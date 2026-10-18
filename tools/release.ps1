<#
.SYNOPSIS
    Builds the FrogPaper Android release APK and refuses to hand it over unless it is
    signed with the real FrogPaper release key.

.DESCRIPTION
    On 2026-10-18 a release APK was published signed with the throwaway debug key
    (CN=Android Debug) because `expo prebuild` had regenerated android/ and dropped
    keystore.properties. Gradle still printed BUILD SUCCESSFUL, apksigner never ran,
    and the file could not install over any existing FrogPaper install.

    This script makes that impossible to repeat by hand:
      1. preflight  - keystore.properties present, storeFile resolves, build.gradle
                      actually reads it, and no debug-signing fallback is in play
      2. build      - gradlew assembleRelease
      3. guard      - apksigner must report CN=FrogPaper AND the documented key
                      fingerprint, otherwise the APK is deleted and the run fails
      4. report     - size, SHA-256, versionCode/versionName, release-note snippet

.PARAMETER PreflightOnly
    Run the checks without building (fast way to see if a rebuild is safe).

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\release.ps1

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts\release.ps1 -PreflightOnly
#>
[CmdletBinding()]
param(
    [string] $AndroidDir = 'C:\FrogPaperMobile\mobile-app\android',
    [string] $OutFile = 'C:\FrogPaperMobile\FrogPaper-release-signed.apk',
    [string] $ExpectedFingerprint = 'f59a1728b2c14921358137277d596125845b0a83f7e45aaf9c54137307bc0644',
    [switch] $PreflightOnly
)

$ErrorActionPreference = 'Stop'

function Fail {
    param([string] $Message, [string[]] $Hint)
    Write-Host ''
    Write-Host '  RELEASE BLOCKED - the APK was NOT released.' -ForegroundColor Red
    Write-Host "  $Message" -ForegroundColor Red
    if ($Hint) {
        Write-Host ''
        foreach ($line in $Hint) { Write-Host "  $line" -ForegroundColor Yellow }
    }
    Write-Host ''
    exit 1
}

function Step {
    param([string] $Text)
    Write-Host ''
    Write-Host "[$Text]" -ForegroundColor Cyan
}

function Ok {
    param([string] $Text)
    Write-Host "  ok - $Text" -ForegroundColor Green
}

function Warn {
    param([string] $Text)
    Write-Host "  note - $Text" -ForegroundColor Yellow
}

function Read-PropertiesFile {
    # Minimal .properties parser: key=value, # and ! comments, \ escapes ignored.
    param([string] $Path)
    $map = @{}
    foreach ($raw in (Get-Content -LiteralPath $Path)) {
        $line = $raw.Trim()
        if ($line.Length -eq 0) { continue }
        if ($line.StartsWith('#') -or $line.StartsWith('!')) { continue }
        $idx = $line.IndexOf('=')
        if ($idx -lt 1) { continue }
        $map[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
    }
    return $map
}

function Get-ApkSigner {
    $sdk = $env:ANDROID_HOME
    if (-not $sdk) { $sdk = $env:ANDROID_SDK_ROOT }
    if (-not $sdk) { $sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
    if (-not (Test-Path -LiteralPath $sdk)) {
        Fail -Message "Android SDK not found (looked in '$sdk')." -Hint @(
            'Set ANDROID_HOME or pass nothing and let the script use %LOCALAPPDATA%\Android\Sdk.',
            'Install the SDK via Android Studio, then re-run.'
        )
    }
    $signers = @(Get-ChildItem -Path (Join-Path $sdk 'build-tools\*\apksigner.bat') -ErrorAction SilentlyContinue)
    if ($signers.Count -eq 0) {
        Fail -Message "apksigner.bat not found under '$sdk\build-tools'." -Hint @(
            'Open Android Studio > SDK Manager > SDK Tools and install a Build-Tools package.'
        )
    }
    return ($signers | Sort-Object { [version]($_.Directory.Name -replace '[^0-9.].*$', '') } | Select-Object -Last 1).FullName
}

# ---------------------------------------------------------------- 1. preflight
Step '1/4  preflight - is a signed release even possible?'

if (-not (Test-Path -LiteralPath $AndroidDir)) {
    Fail -Message "Android project folder not found: $AndroidDir" -Hint @(
        'Run from the mobile repo root, or pass -AndroidDir "<path to android>".'
    )
}
$appDir = Join-Path $AndroidDir 'app'
$propsPath = Join-Path $AndroidDir 'keystore.properties'
$gradlePath = Join-Path $appDir 'build.gradle'
$apkPath = Join-Path $appDir 'build\outputs\apk\release\app-release.apk'

# keystore.properties missing => Gradle silently debug-signs. Restore it, don't guess.
if (-not (Test-Path -LiteralPath $propsPath)) {
    $candidates = @(
        (Join-Path $AndroidDir '..\android_backup\keystore.properties'),
        (Join-Path $AndroidDir 'android_backup\keystore.properties')
    )
    $restored = $null
    foreach ($c in $candidates) {
        $full = [System.IO.Path]::GetFullPath($c)
        if (Test-Path -LiteralPath $full) { $restored = $full; break }
    }
    if ($restored) {
        Copy-Item -LiteralPath $restored -Destination $propsPath -Force
        Ok "keystore.properties restored from $restored"
    } else {
        Fail -Message 'keystore.properties is missing, so Gradle would silently sign with the debug key.' -Hint @(
            'It is not in android_backup either. Recreate it with these four lines:',
            '    storeFile=frogpaper-release.keystore',
            '    storePassword=<your store password>',
            '    keyAlias=frogpaper',
            '    keyPassword=<your key password>',
            "Place the real keystore at $appDir\frogpaper-release.keystore (a copy is in C:\FrogPaperBackups\keys)."
        )
    }
} else {
    Ok "keystore.properties present: $propsPath"
}

$props = Read-PropertiesFile -Path $propsPath
$storeFile = $props['storeFile']
if (-not $props['storePassword'] -or -not $props['keyAlias'] -or -not $props['keyPassword']) {
    Fail -Message 'keystore.properties is incomplete (needs storePassword, keyAlias and keyPassword).'
}

$keystorePath = $null
if ($storeFile) {
    if ([System.IO.Path]::IsPathRooted($storeFile)) {
        $keystorePath = $storeFile
    } else {
        # Gradle resolves storeFile against the app module; older copies of this file
        # wrote "app\..." (module-relative from android/) or an absolute path.
        $candidates = @(
            [System.IO.Path]::GetFullPath((Join-Path $appDir $storeFile)),
            [System.IO.Path]::GetFullPath((Join-Path $AndroidDir $storeFile))
        )
        foreach ($c in $candidates) {
            if (Test-Path -LiteralPath $c) { $keystorePath = $c; break }
        }
        if (-not $keystorePath) { $keystorePath = $candidates[0] }
    }
}
if (-not $keystorePath -or -not (Test-Path -LiteralPath $keystorePath)) {
    Fail -Message "The keystore file itself is missing: $keystorePath" -Hint @(
        'Copy it back from C:\FrogPaperBackups\keys\frogpaper-release.keystore',
        "to $appDir\frogpaper-release.keystore"
    )
}
Ok "keystore found: $keystorePath"

if (-not (Test-Path -LiteralPath $gradlePath)) {
    Fail -Message "app/build.gradle not found: $gradlePath"
}
$gradleText = Get-Content -LiteralPath $gradlePath -Raw
if ($gradleText -notmatch 'keystore\.properties') {
    Fail -Message 'app/build.gradle no longer reads keystore.properties, so a release build would use the debug key.' -Hint @(
        'Restore the release signingConfig block (storeFile/storePassword/keyAlias/keyPassword',
        'loaded from keystore.properties) before building.'
    )
}
Ok 'app/build.gradle reads keystore.properties'

# Gradle's prebuild-generated template falls back to the debug config; that fallback is
# exactly the bug that shipped a debug-signed APK. Flag it, then let the signature check decide.
if ($gradleText -match 'signingConfig\s+signingConfigs\.debug') {
    Warn 'build.gradle still contains a "signingConfig signingConfigs.debug" fallback - check it is not used for release.'
}

if ($PreflightOnly) {
    Write-Host ''
    Write-Host '  Preflight passed - a release build here would be signed correctly.' -ForegroundColor Green
    exit 0
}

# ---------------------------------------------------------------- 2. build
Step '2/4  building the release APK (a few minutes)'
if (-not $env:ANDROID_HOME) {
    if (Test-Path -LiteralPath (Join-Path $env:LOCALAPPDATA 'Android\Sdk')) {
        $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
    }
}
if (Test-Path -LiteralPath $apkPath) { Remove-Item -LiteralPath $apkPath -Force }

Push-Location -LiteralPath $AndroidDir
try {
    & (Join-Path $AndroidDir 'gradlew.bat') assembleRelease
    $buildExit = $LASTEXITCODE
} finally {
    Pop-Location
}
if ($buildExit -ne 0) {
    Fail -Message "gradlew assembleRelease failed (exit $buildExit)."
}
if (-not (Test-Path -LiteralPath $apkPath)) {
    Fail -Message "The build reported success but produced no APK at $apkPath"
}
Ok "APK built: $apkPath"

# ---------------------------------------------------------------- 3. signature guard
Step '3/4  signature guard - is this really the FrogPaper key?'
$apksigner = Get-ApkSigner
$certLines = & $apksigner verify --print-certs $apkPath 2>&1
if ($LASTEXITCODE -ne 0) {
    Remove-Item -LiteralPath $apkPath -Force -ErrorAction SilentlyContinue
    Fail -Message "apksigner could not verify the APK (exit $LASTEXITCODE):`n$($certLines -join "`n")"
}
$cn = $null
$digest = $null
foreach ($line in $certLines) {
    if ($line -match 'certificate DN:\s*(.+)$') { $cn = $Matches[1].Trim() }
    if (-not $digest -and $line -match 'SHA-256 digest:\s*([0-9a-fA-F]+)') { $digest = $Matches[1].ToLower() }
}
if (-not $cn) {
    Remove-Item -LiteralPath $apkPath -Force -ErrorAction SilentlyContinue
    Fail -Message 'apksigner printed no certificate DN, so the signature cannot be trusted.'
}
$cnValue = $cn
if ($cn -match 'CN=([^,]+)') { $cnValue = $Matches[1].Trim() }
Write-Host "  signer: CN=$cnValue"
Write-Host "  SHA-256: $digest"

if ($cn -notmatch 'FrogPaper') {
    Remove-Item -LiteralPath $apkPath -Force -ErrorAction SilentlyContinue
    Fail -Message "The APK is signed with '$cn', not the FrogPaper release key. The bad file was deleted." -Hint @(
        'This is the debug-signing bug: keystore.properties was not picked up at build time.',
        'Run this script again with -PreflightOnly to see which piece is missing.'
    )
}
if ($ExpectedFingerprint -and $digest -ne $ExpectedFingerprint.ToLower()) {
    Remove-Item -LiteralPath $apkPath -Force -ErrorAction SilentlyContinue
    Fail -Message "Signed with the right name but the WRONG key (fingerprint $digest)." -Hint @(
        "Expected: $ExpectedFingerprint",
        'That keystore is not the published FrogPaper release key - do not upload this build.'
    )
}
Ok "signed with the FrogPaper release key ($digest)"

# ---------------------------------------------------------------- 4. report
Step '4/4  staging the file for the GitHub release'
$outDir = Split-Path -Parent $OutFile
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
Copy-Item -LiteralPath $apkPath -Destination $OutFile -Force
$file = Get-Item -LiteralPath $OutFile
$hash = (Get-FileHash -LiteralPath $OutFile -Algorithm SHA256).Hash.ToLower()

$versionCode = 'unknown'
$versionName = 'unknown'
$metaPath = Join-Path $appDir 'build\outputs\apk\release\output-metadata.json'
if (Test-Path -LiteralPath $metaPath) {
    try {
        $meta = Get-Content -LiteralPath $metaPath -Raw | ConvertFrom-Json
        $element = @($meta.elements)[0]
        $versionCode = $element.versionCode
        $versionName = $element.versionName
    } catch {
        Warn "could not read output-metadata.json ($($_.Exception.Message))"
    }
}

Write-Host ''
Write-Host '  READY TO UPLOAD' -ForegroundColor Green
Write-Host "  file      : $OutFile"
Write-Host "  size      : $($file.Length) bytes"
Write-Host "  SHA-256   : $hash"
Write-Host "  cert      : CN=$cnValue"
Write-Host "  version   : $versionName (versionCode $versionCode)"
Write-Host ''
Write-Host '  Paste into the GitHub release description:' -ForegroundColor Cyan
Write-Host "    APK SHA-256: ``$hash``"
Write-Host ''
Write-Host '  Then: Releases > edit the release > delete the old APK asset > drag this file in > Update release.'
Write-Host ''
