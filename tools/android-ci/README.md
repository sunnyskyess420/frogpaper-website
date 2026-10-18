# Signed Android builds, built by GitHub instead of by hand

Three files that make the 2026-10-18 bug (a release APK silently signed with the
debug key) impossible, and remove the manual build from the release process:

| File | Goes to (in `sunnyskyess420/frogpaper-mobile`) | What it does |
|---|---|---|
| `SigningConfig.js` | `mobile-app/src/plugins/SigningConfig/index.js` | Config plugin: after `expo prebuild` regenerates `android/`, it points the release build at `keystore.properties` instead of the debug key. Survives every prebuild, exactly like `WallpaperManagerFix`. |
| `SigningConfig.test.js` | `mobile-app/scripts/check-signing-config.js` | Runs the plugin's transform against a real Expo SDK 57 `app/build.gradle` and asserts the result (6 checks). `node scripts/check-signing-config.js`. |
| `android-release.yml` | `.github/workflows/android-release.yml` | Builds the APK on a tag, **refuses to publish anything not signed by `CN=FrogPaper` with fingerprint `f59a1728…0644`**, attaches it to the release, and reports the SHA-256. |

## Install (5 minutes, once)

**1. Copy the files in.** From the repo root:

```powershell
$src = "C:\FrogPaperMobile"
New-Item -ItemType Directory -Force "$src\mobile-app\src\plugins\SigningConfig" | Out-Null
New-Item -ItemType Directory -Force "$src\.github\workflows" | Out-Null
Invoke-WebRequest https://sunnyskyess420.github.io/frogpaper-website/tools/android-ci/SigningConfig.js -OutFile "$src\mobile-app\src\plugins\SigningConfig\index.js"
Invoke-WebRequest https://sunnyskyess420.github.io/frogpaper-website/tools/android-ci/SigningConfig.test.js -OutFile "$src\mobile-app\scripts\check-signing-config.js"
Invoke-WebRequest https://sunnyskyess420.github.io/frogpaper-website/tools/android-ci/android-release.yml -OutFile "$src\.github\workflows\android-release.yml"
```

**2. Register the plugin** in `mobile-app/app.json` inside `expo.plugins`:

```json
"./src/plugins/WallpaperManagerFix",
"./src/plugins/SigningConfig",
"expo-sharing"
```

**3. Prove it works locally** before trusting CI:

```powershell
cd C:\FrogPaperMobile\mobile-app
node scripts\check-signing-config.js
npx expo prebuild --platform android --clean
Select-String -Path android\app\build.gradle -Pattern "signingConfig signingConfigs.release"
```

That last line must print the line — it means the regenerated project is wired to
your release key. Then rebuild as usual: `powershell -ExecutionPolicy Bypass -File scripts\release.ps1`.

**4. Add four repository secrets** (GitHub → the mobile repo → Settings → Secrets and
variables → Actions). Create the base64 value on your PC, where the keystore already lives:

```powershell
$b = [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\FrogPaperBackups\keys\frogpaper-release.keystore"))
Set-Clipboard $b; "base64 copied - paste it as ANDROID_KEYSTORE_BASE64"
```

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | the string just copied |
| `ANDROID_KEYSTORE_PASSWORD` | your store password |
| `ANDROID_KEY_ALIAS` | `frogpaper` |
| `ANDROID_KEY_PASSWORD` | your key password |

This is the one real trade-off: the keystore and its passwords then live in GitHub
(encrypted, and never printed — the workflow only ever uses them inside the runner).
Keep the `C:\FrogPaperBackups` copies regardless. If you would rather not, skip this
file and keep using `release.ps1`, which enforces the same signature check locally.

## Releasing from now on

```powershell
git tag v1.13.0
git push origin v1.13.0
```

CI builds, verifies the signature, attaches `FrogPaper-release-signed.apk` and prints
the SHA-256 in the run summary. The website picks the new version and size up by itself
(it reads `releases/latest`), so there is nothing to edit afterwards.

You can also run it by hand: Actions → **Android release APK** → Run workflow → enter an
existing tag. That is the safe way to replace a bad asset: it re-uploads with `--clobber`.

## Notes

- `versionName` comes from the tag; `versionCode` stays whatever `app.json` says, so bump
  it there when you ship a new release (Android needs it to never go backwards).
- The workflow runs `expo prebuild --clean`. If `android/` on your PC has manual edits not
  represented by a config plugin, they are lost both here and in CI — the SigningConfig
  plugin exists precisely so signing is not one of them.
- No step ever prints secret values. `keystore.properties` is written with `chmod 600`
  inside the runner and is not uploaded as an artifact.
