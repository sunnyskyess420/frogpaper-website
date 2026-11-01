# Handoff for Next Agent - FrogPaper Download Investigation

**Date:** 2026-11-01
**Repo:** sunnyskyess420/frogpaper-website
**Branch:** fix/download-conversion
**User:** sunnyskyess420 (out of Devin usage, resuming later)

---

## What's Been Done ✅

### 1. Quick Wins PR (#4) - READY TO MERGE
**Status:** PR created, NOT merged yet
**URL:** https://github.com/sunnyskyess420/frogpaper-website/pull/4

**Changes:**
- Homepage shows "500+ downloads" instead of per-release count (social proof fix)
- Platform-aware CTAs: Android button appears first on Android devices
- Fixed duplicate "Windows" in submit-wallpaper.html button text
- Added site.js to downloads.html and submit-wallpaper.html
- Bumped site.js cache-buster to v=1.7.14

**User action needed:** Merge this PR

### 2. Download Click Tracking - CODE INTEGRATED, WORKER NOT DEPLOYED
**Status:** Beacon code added to site.js, Worker script ready in analytics/
**Files:**
- `site.js` - Now includes click tracking beacon (lines 453-492)
- `analytics/download-click-worker.js` - Cloudflare Worker script
- `analytics/wrangler.toml` - Worker configuration
- `analytics/DEPLOYMENT.md` - Full deployment instructions

**What's tracked:**
- Platform (windows/android)
- Page path
- Direct vs fallback (asset URL vs release page)
- Device class (desktop/mobile/tablet)
- Timestamp

**What's NOT tracked:**
- Cookies, PII, fingerprints, referrer, IP, location

**Missing:**
- Worker URL in site.js line 454 is a placeholder
- Worker has NOT been deployed to Cloudflare
- Analytics Engine dataset has NOT been created

**User action needed:**
1. Follow `analytics/DEPLOYMENT.md` to deploy Worker
2. Update `ANALYTICS_WORKER_URL` in site.js line 454 with actual Worker URL
3. Commit and push the URL update
4. Test tracking on live site

---

## What's Next (In Priority Order)

### 🔴 IMMEDIATE (Do First)

#### 1. Merge PR #4
- User: https://github.com/sunnyskyess420/frogpaper-website/pull/4
- Click "Merge pull request"
- Wait 90s for GitHub Pages rebuild

#### 2. Deploy Telemetry Worker
- Follow `analytics/DEPLOYMENT.md`
- Create Analytics Engine dataset in Cloudflare
- Deploy Worker: `cd analytics && npx wrangler deploy`
- Update WORKER_URL in site.js line 454
- Commit and push

#### 3. Submit Sitemap to Search Engines
- Google Search Console: add property, verify, submit sitemap
- Bing Webmaster Tools: same process
- Sitemap URL: https://sunnyskyess420.github.io/frogpaper-website/sitemap.xml

### 🟡 MEDIUM PRIORITY

#### 4. Add SmartScreen Warning Note
The Windows installer is unsigned. Add this to downloads.html next to the download button:

```html
<p class="text-sm text-muted-foreground mt-2">
  Note: Windows may show a SmartScreen warning because the installer is not code-signed.
  This is normal for unsigned open-source software. The SHA256 is shown above for verification.
</p>
```

#### 5. Link VirusTotal Result
- Download current installer from GitHub
- Upload to VirusTotal
- Wait for scan
- Add link to downloads.html

### 🟢 LOW PRIORITY

#### 6. Code Signing
- Requires identity verification (user must do this)
- Options: SignPath.io (free for OSS), Azure Trusted Signing, Certum/SSL.com
- Once signed, update build process

#### 7. Marketing/Distribution
- Reddit: r/wallpapers, r/frogs, r/AndroidApps, r/software, r/SideProject
- Hacker News: "Show HN: FrogPaper"
- Product Hunt launch
- Facebook groups
- Demo video

#### 8. Install Ping (Python App)
- Add first-run telemetry to the Python app
- Tracks actual installs, not just downloads
- Requires changes to frogpaper (Windows) repo, not website repo

---

## Current Git State

**Branch:** fix/download-conversion
**Status:** Beacon code integrated, ready to commit

**Uncommitted changes:**
- site.js: Added click tracking beacon (lines 453-492)
- index.html: Bumped cache-buster to v=1.7.15
- downloads.html: Bumped cache-buster to v=1.7.15
- submit-wallpaper.html: Bumped cache-buster to v=1.7.15

**What the next agent should do:**
1. Commit these changes with message: "Integrate download click tracking beacon into site.js"
2. Push to fix/download-conversion branch
3. User should update WORKER_URL in site.js line 454 after deploying Worker
4. Then merge PR #4 (the quick wins) and create a new PR for telemetry

---

## Key Files

- `site.js` - Main site script (now includes tracking beacon)
- `analytics/download-click-worker.js` - Cloudflare Worker script
- `analytics/wrangler.toml` - Worker configuration
- `analytics/DEPLOYMENT.md` - Step-by-step deployment guide
- `deliverables/devin_handoff_2026-11-01.md` - Original investigation brief
- `ACTION_REQUIRED.md` - User's action checklist

---

## User Context

- User is out of Devin usage (42% left, using for this handoff)
- User will resume with more usage later
- User needs clear, simple instructions
- User is not familiar with Cloudflare Workers deployment
- User's primary concern: low downloads/installs despite working buttons

---

## Root Cause Summary (From Investigation)

1. **Unsigned Windows installer** - SmartScreen blocks installs (highest impact)
2. **Almost no traffic** - 22 visits since analytics installed (distribution problem)
3. **No telemetry** - Can't distinguish "no clicks" from "no installs"
4. **Mobile visitors getting wrong platform** - m.facebook.com referrer downloads Windows .exe on phone
5. **Misleading social proof** - Homepage showed per-release count (14) instead of total (500+)

**What we've fixed:**
- ✅ Social proof (PR #4)
- ✅ Platform-aware CTAs (PR #4)
- ✅ Copy errors (PR #4)
- ✅ Telemetry code (ready to deploy)

**What still needs work:**
- ⏳ Code signing (requires user identity)
- ⏳ Marketing/distribution
- ⏳ Install ping (Python app)

---

## For the Next Agent

**When user returns with more usage:**

1. Help user deploy the Worker (walk through Cloudflare dashboard)
2. Help user update WORKER_URL in site.js
3. Test tracking end-to-end
4. Add SmartScreen warning note to downloads.html
5. Help with VirusTotal link
6. Guide user through code signing setup
7. Help with marketing materials
8. Add install ping to Python app (different repo)

**Guardrails:**
- Do NOT push to main without user approval
- Do NOT rename/delete release assets
- Do NOT run installer without user approval
- Do NOT ask for Cloudflare/Google credentials
- Keep changes on branches, use PRs

---

## Quick Start for Next Agent

```bash
cd C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website
git status
git add site.js index.html downloads.html submit-wallpaper.html
git commit -m "Integrate download click tracking beacon into site.js"
git push origin fix/download-conversion
```

Then tell user:
1. Merge PR #4 (quick wins)
2. Read analytics/DEPLOYMENT.md
3. Deploy Worker when ready
4. Update WORKER_URL in site.js line 454
5. Test tracking
