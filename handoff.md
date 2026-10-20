# FrogPaper Website Redesign — Handoff

**Last updated:** 2026-10-19 (MDT)
**Working copy:** `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website`
**Current branch:** `website-redesign`
**Branch state:** created locally, **all changes are uncommitted**
**Remote state:** `website-redesign` has **not** been pushed. `main` is untouched. No pull request exists.

---

## 1. Project goal

Rebuild the FrogPaper marketing site as a clean, fast, responsive **static HTML + CSS + minimal JavaScript** website for GitHub Pages.

- Use the Framer page as the visual/layout reference.
- Use the existing GitHub repository as the source of truth for real copy, links, screenshots, branding and app information.
- Do not copy placeholder or inaccurate Framer text.
- Keep `index.html` at the repository root so GitHub Pages continues to work.
- Preserve all existing download links, support links and external URLs.
- Make Windows and Android feel like two equal versions of one app.
- Stack the two platform cards vertically on mobile, Windows first.

---

## 2. Repository and branch

- **Repository:** https://github.com/sunnyskyess420/frogpaper-website
- **Branch to work on:** `website-redesign`
- **Do not push to `main`.**
- **Do not create or merge a pull request until the user explicitly approves after reviewing the local build.**

---

## 3. Framer visual reference

- **URL:** https://innocent-writers-038948.framer.app/
- Captured at 1440 px wide for desktop reference.
- Reference design language:
  - Deep navy background `#0b1220`
  - Card surface around `#101d2a` / `#121f2c`
  - Mint accent `#70e1b1`
  - Text `#f0f5f2`, muted text `#a6b7bd`
  - Nunito typography, heavy 800 headings, tight letter spacing
  - Rounded cards (16–22 px), generous spacing, mint primary buttons
  - Simple top navigation: logo + Home / Windows / Android / Features / FAQ / Download
  - Equal Windows and Android platform cards
  - FAQ uses rounded accordion rows with a mint “+” indicator
  - Footer uses three link columns with mint headings

---

## 4. Current progress

### 4.1 Files created or changed

| File | State | Purpose |
|---|---|---|
| `index.html` | **Modified / fully rewritten** | Complete redesigned landing page. |
| `site.css` | **New** | Hand-written stylesheet for the new landing page only. No Tailwind dependency. |
| `site.js` | **New** | Mobile menu, header shadow, gallery carousel, active nav link, live Android version/size. |
| `assets/fonts/nunito-latin.woff2` | **New** | Self-hosted Nunito variable font (normal), 38 KB. |
| `assets/fonts/nunito-latin-italic.woff2` | **New** | Self-hosted Nunito variable font (italic), 17 KB. |
| `assets/img/windows-screenshot.webp` | **New** | Optimized 1440 px WebP made from existing `frogpaper-screenshot.png` (107 KB). |
| `assets/img/logo-mark.png` | **New** | 256 px mint nav tile with the existing mascot’s head, derived from `assets/img/mascot-frog.png`. |
| `assets/gallery/thumbs/*.webp` | **New, 12 files** | Optimized 900 px WebP thumbnails of the 12 existing community wallpapers (27–67 KB each). |
| `HANDOFF.md` | **New** | This file. |

**Not changed:** `styles.css`, `output.css`, `main.js`, `downloads.html`, `submit-wallpaper.html`, `404.html`, `README.md`, all original images and all original gallery PNGs. The old pages still use the old stylesheets/scripts, so they should continue to render as before.

### 4.2 What is complete

- Full redesigned `index.html` with all required sections:
  - Fixed navigation bar with logo/name and Home, Windows, Android, Features, FAQ, Download.
  - Hero with mascot, headline, description, equal mint **Download for Windows** and **Get it on Android** buttons, and a large existing mossy-forest hero image.
  - **Choose your platform** section with two equal cards (Windows first in the DOM and on mobile). Each card has an icon, description, visual, metadata and an equal mint “Explore Windows” / “Explore Android” button.
  - **Windows** section with title, copy, download button, release-notes link, desktop screenshot and six feature cards.
  - **Android** section visually mirrors Windows, with title, copy, download button, two phone mockups and six feature cards.
  - **Shared features** section with six common-feature cards.
  - **How it works** 3-step row.
  - **Why FrogPaper?** band using existing comparison copy.
  - **Photo Sorter** bonus-app band.
  - **Release notes** for v1.7.5 and compact version history linking every existing Windows release tag.
  - **FAQ** with the eight existing upgrade/restore questions plus four platform questions answerable from existing copy.
  - **Closing download CTA** with both platform buttons.
  - **Footer** with brand, Windows/Android downloads, support/contact links, GitHub links, release links and copyright.
  - Extra **community gallery** strip using the 12 existing wallpapers.
- Visual system implemented to match the Framer reference: navy/mint palette, Nunito, heavy headings, rounded cards, mint buttons, generous whitespace.
- Fully responsive CSS:
  - Desktop: 2-column platform cards and split Windows/Android sections.
  - Tablet (≤900 px): hamburger nav, stacked platform cards, stacked split sections, 2-column feature grids.
  - Mobile (≤700 px): single-column feature grids, stacked hero buttons, vertically stacked platform cards (Windows first), single-column footer.
- Mobile navigation with `aria-expanded`, Escape-to-close, close-on-link and resize handling.
- Gallery carousel with arrow buttons, drag-to-scroll, keyboard arrows and scroll snap.
- Native `<details>` FAQ accordion, no JavaScript needed.
- Live Android version and APK size pulled from the public GitHub API, with static fallbacks (`v1.12.0`, `75 MB`).
- Self-hosted fonts; no Google Fonts or external CSS/JS.
- Optimized local images; no Framer-hosted assets.
- Accessibility basics: skip link, focus-visible outlines, alt text, aria labels, reduced-motion media query, semantic headings.
- Local validation already completed **before the final CSS-only edits**:
  - `npm run validate:html` passed.
  - HTTP 200 from local server.
  - No console errors, page errors or failed requests.
  - No horizontal overflow at 1440×1000, 820×1180 or 390×844.
  - Required external links all present (Windows EXE, Android APK, GitHub, Issues, Buy Me a Coffee, Photo Sorter).
  - Gallery arrows work, FAQ opens, mobile menu opens/closes and scrolls to Windows.
  - All non-lazy images loaded.

### 4.3 What is unfinished

1. **Re-verify the final CSS edits.** The run was stopped immediately after applying these changes, so they are saved but **not re-screenshotted or re-validated**:
   - Section padding reduced to `92px` desktop and `64px` mobile (`section-tight` 72/52).
   - Mobile hero `h1` set to `40px` and the `<br>` hidden so “Your imagination. Every screen.” stays balanced.
   - Mobile platform-card desktop screenshot changed to `object-fit: contain` so the app UI is no longer clipped on the right.
   - `.hero-meta span { white-space: nowrap; }` to stop “Android” and the version number splitting across lines.
2. **Nothing is committed.** `git status` shows `M index.html` plus untracked `site.css`, `site.js`, `assets/fonts/`, `assets/gallery/thumbs/`, `assets/img/logo-mark.png`, `assets/img/windows-screenshot.webp`.
3. **Scratch files are still in the working tree and must not be committed:**
   - `framer.html`
   - `framer-desktop.png`
   - `framer-crop-01.png` … `framer-crop-10.png`
   - `framer_inspect.py`
   - `list_links.py`
   - `nunito.css`
   - `optimize_assets.py`
   - `preview-desktop.png`, `preview-tablet.png`, `preview-mobile.png`
   - `preview-crops/`, `preview-crops2/`, `preview-tablet-crops/`, `preview-mobile-crops/`
   - `verify.js`, `shoot.js`
   - `node_modules/` (already gitignored)
4. **Optional polish not done:**
   - Lighthouse / performance audit.
   - Firefox and Safari testing (only Edge/Chromium was used).
   - README update; it still describes the old Tailwind-clone workflow.
   - `submit-wallpaper.html` still has an old Windows v1.7.1 download link (intentionally preserved; see known issues).

### 4.4 Errors, missing images and known issues

- **No missing images.** Every image referenced by `index.html` exists in the repository.
- **No console/page errors** in the last full test.
- **No broken required external links** in the last full test.
- **Lazy-loading caveat:** gallery thumbnails 4–12 are horizontally off-screen and are `loading="lazy"`. A full-page screenshot taken without horizontally scrolling the gallery will show those cards empty. This is expected browser behaviour, not a broken image. Scroll the gallery or set them eager only for screenshot purposes.
- **Old pages untouched:** `downloads.html` and `submit-wallpaper.html` still use `output.css` + `styles.css` + `main.js`. Their links to old index anchors still resolve because the new page keeps `#mobile`, `#gallery`, `#features`, `#how`, `#sorter`, `#release`, `#changelog` and `#sync`.
- **Stale link on submit page:** `submit-wallpaper.html` still points its header download button at `FrogPaper-Setup-1.7.1.exe`. It was deliberately not changed to avoid altering existing external links outside the landing page. Flag this to the user; update only if they ask.
- **README stale:** `README.md` still describes the old Tailwind clone. Not required for the redesign, but a follow-up would be useful.
- **Framer text was not copied blindly.** Real copy and URLs come from the existing repository.

---

## 5. Required final structure (and where it lives in `index.html`)

| Requirement | Implementation |
|---|---|
| Navigation | `<header class="site-header">`; links: Home, Windows, Android, Features, FAQ, Download. Mobile drawer `#mobileNav`. |
| Hero with equal Windows + Android download buttons | `<section class="hero" id="home">`; two `.btn.btn-mint` buttons pointing at the real EXE and APK. |
| Choose Your Platform with two equal cards | `<section class="section" id="platform">`; `.platform-grid` with two `.platform-card` articles. Windows first. |
| Windows section | `<section class="section" id="windows">`; split copy + `windows-screenshot.webp`; six feature cards; download button; Halloween note. |
| Android section | `<section class="section" id="android">`; mirrored split copy + two phone mockups; six feature cards; download button. `<div id="mobile">` alias preserved for old links. |
| Shared features | `<section class="section" id="features">`; six shared-feature cards + `#how` steps + `#compare` why band. |
| FAQ | `<section class="section" id="faq">`; 12 `<details class="faq-item">` entries. |
| Footer | `<footer class="site-footer">`; brand, Windows/Android links, support, GitHub, release links, copyright. |

Extra sections, all built from existing content and images: `#gallery`, `#sorter`, `#release`, `#changelog`, `#download` closing CTA.

---

## 6. Strict rules

- Use plain HTML, CSS and minimal JavaScript only.
- Keep `index.html` at the repository root.
- Do **not** use React, Next.js, Framer scripts, Framer badges or Framer-hosted assets.
- Preserve all existing download links and external links:
  - Windows: `https://github.com/sunnyskyess420/frogpaper/releases/download/v1.7.5/FrogPaper-Setup-1.7.5.exe`
  - Android: `https://github.com/sunnyskyess420/frogpaper-mobile/releases/latest/download/FrogPaper-release-signed.apk`
  - GitHub: `https://github.com/sunnyskyess420/frogpaper`
  - Issues: `https://github.com/sunnyskyess420/frogpaper/issues`
  - Buy Me a Coffee: `https://buymeacoffee.com/alively142`
  - Photo Sorter: `https://photo-sorter-navy.vercel.app/`
  - All Windows release tag links from v1.3.2 through v1.7.5.
- Do **not** push to `main`.
- Do **not** create or merge a pull request yet.
- Do not invent download links or app features.
- Keep the old pages and old stylesheets intact unless the user explicitly asks to redesign them too.

---

## 7. Next steps for the next AI

### Step 1 — Inspect the branch

```powershell
cd C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website
git checkout website-redesign
git status
git diff -- index.html
```

Read `index.html`, `site.css`, `site.js`, and this file. Do not re-read or re-clone the repository unnecessarily.

### Step 2 — Run the local site

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`.

### Step 3 — Re-run validation

```powershell
npm ci
npm run validate:html
```

`npm ci` installs the existing `html-validate` and `tailwindcss` dev dependencies. It does not change the site build; the new page does not use Tailwind.

### Step 4 — Re-check the final CSS edits

Specifically verify:

- Mobile (390 px): hero is two balanced lines, not “Your / imagination. / Every screen.”
- Mobile: Windows platform card shows the full app screenshot without a hard right-edge crop.
- All widths: section spacing is not excessive; Windows note → Android section gap looks natural.
- Hero metadata: “Android v1.12.0” does not split across lines.
- Desktop 1440 px: platform cards are equal height; Windows and Android sections feel equal.
- Tablet 820 px: nav collapses, cards stack, no horizontal scroll.
- Mobile 390 px: nav drawer, buttons, gallery, FAQ and footer fit without horizontal scroll.

A quick Playwright screenshot command (after `npm install --no-save playwright`):

```powershell
npx playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1000" --full-page --wait-for-timeout 2500 http://127.0.0.1:8765/index.html preview-desktop.png
npx playwright screenshot --browser chromium --channel msedge --viewport-size "820,1180" --full-page --wait-for-timeout 1500 http://127.0.0.1:8765/index.html preview-tablet.png
npx playwright screenshot --browser chromium --channel msedge --viewport-size "390,844" --full-page --wait-for-timeout 1500 http://127.0.0.1:8765/index.html preview-mobile.png
```

For the gallery, scroll horizontally or use a Playwright script that scrolls the page and waits for images before taking a full-page screenshot. Lazy off-screen gallery thumbnails will otherwise look blank.

### Step 5 — Fix only real issues

Do not redesign or add sections. Fix layout bugs, broken links, accessibility issues and obvious visual defects only.

### Step 6 — Clean scratch files

Remove or move these out of the repository before committing:

```text
framer.html
framer-desktop.png
framer-crop-*.png
framer_inspect.py
list_links.py
nunito.css
optimize_assets.py
preview-*.png
preview-crops*/
preview-crops2/
preview-tablet-crops/
preview-mobile-crops/
verify.js
shoot.js
node_modules/   (gitignored; can stay untracked)
```

Do not delete any original repository asset, `styles.css`, `output.css`, `main.js`, `downloads.html`, `submit-wallpaper.html` or `404.html`.

### Step 7 — Commit

```powershell
git add index.html site.css site.js assets/fonts assets/gallery/thumbs assets/img/logo-mark.png assets/img/windows-screenshot.webp HANDOFF.md
git commit -m "Rebuild FrogPaper landing page for GitHub Pages"
```

Confirm `git status` is clean apart from ignored files and scratch files.

### Step 8 — Stop for user review

The user explicitly said they want to test everything before anything is published.

- Do **not** push `website-redesign` yet.
- Do **not** open a pull request yet.
- Report the local preview URL, what was tested, and any remaining issues.

### Step 9 — After explicit user approval only

When the user says to publish:

```powershell
git push -u origin website-redesign
gh pr create --base main --head website-redesign --title "Rebuild FrogPaper landing page" --body-file PR_BODY.md
```

The PR description must list:

1. What changed.
2. Which existing links were preserved.
3. Any missing images or assets (currently: none).
4. Known issues / recommended follow-up:
   - `submit-wallpaper.html` still links to v1.7.1.
   - README still describes the old Tailwind workflow.
   - No Firefox/Safari test yet.
   - Lighthouse not run yet.

Do not merge the PR without explicit approval.

---

## 8. Useful file facts

- `index.html` is roughly 39 KB.
- `site.css` is roughly 26 KB.
- `site.js` is roughly 7 KB.
- New raster assets total roughly 700 KB, including 12 gallery thumbnails and the optimized desktop screenshot.
- Fonts are two local WOFF2 files totaling about 55 KB.
- No external requests except the optional GitHub API call for the latest Android version/size; if it fails, static fallbacks remain.
- New page uses `site.css` and `site.js`, **not** `output.css`, `styles.css` or `main.js`.
- Old pages still use `output.css`, `styles.css` and `main.js`.

---

## 9. Exact prompt to continue in a new assistant

```text
Read HANDOFF.md in the website-redesign branch of https://github.com/sunnyskyess420/frogpaper-website and continue exactly from it.

The repo is already cloned locally at C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website.

Your job:
1. Inspect the current uncommitted changes on website-redesign.
2. Re-verify the final CSS edits listed in HANDOFF.md at desktop (1440px), tablet (820px), and mobile (390px).
3. Fix only real layout/link/accessibility bugs; do not redesign or add new sections.
4. Run npm run validate:html and check the local site in a browser.
5. Clean the scratch files listed in HANDOFF.md so they are not committed.
6. Commit the finished redesign to website-redesign.
7. Do NOT push to main. Do NOT create or merge a pull request yet. Stop and report back with the local preview URL, test results, and any remaining issues so I can review it first.

Strict rules: plain HTML/CSS/minimal JS only; index.html stays at the repo root; no React, Next.js, Framer scripts, Framer badges or Framer-hosted assets; preserve every existing external link and download URL.
```
