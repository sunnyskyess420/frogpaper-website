# FrogPaper — Static Website Clone

A faithful static clone of the **FrogPaper** marketing site
(originally hosted at `frog-paper-73709523.base44.app`), rebuilt as
vanilla **HTML + Tailwind (CDN) + CSS + JS** so it can be deployed
straight to **GitHub Pages** with zero build step.

## What's inside

```
frogpaper-website/
├── index.html              ← single-page site, all 12 sections
├── submit-wallpaper.html   ← "Submit a wallpaper" page (same design system)
├── styles.css              ← design tokens + animations
├── main.js                 ← gallery carousel, mobile menu, scroll reveal
├── manifest.json           ← PWA manifest
├── .nojekyll               ← tells GitHub Pages to skip Jekyll
├── README.md               ← this file
└── assets/
    ├── img/
    │   ├── favicon.png
    │   ├── hero-frog.webp     ← hero background
    │   └── mascot-frog.png    ← hero mascot (transparent PNG)
    └── gallery/               ← 12 community wallpapers
        ├── angel_of_war_realistic_20260705_1.png
        ├── moody-treefrog-in-a-synthwave.png
        ├── dragon_realistic_20260731_1.png
        ├── chill-frog-depicted-in-a.png
        ├── elder_treant_darkfantasy_20260818_2.png
        ├── ice_queen_realistic_20260705_1.png
        ├── playful-frog-in-a-retro.png
        ├── mechanical_clockwork_heart_realistic_20260705_1.png
        ├── shadow_panther_darkfantasy_20260622_1.png
        ├── unicorn_realistic_20260705_2.png
        ├── steampunk_laboratory_watercolor_storybook_20260510_1.png
        └── storm_caller_realistic_20260705_1.png
```

## Deploy to GitHub Pages

### Option A — User / Organization site (`<username>.github.io`)

1. Create a new public repo named exactly **`<username>.github.io`** (e.g. `sunnyskyess420.github.io`).
2. Upload everything in `frogpaper-website/` to the **root** of the repo (so `index.html` is at the repo root, not inside a subfolder).
3. Push to the `main` (or `master`) branch.
4. Wait ~30 seconds. Visit `https://<username>.github.io/` — done.

### Option B — Project site (`<username>.github.io/<repo>`)

1. Create any new public repo (e.g. `frogpaper-site`).
2. Upload everything in `frogpaper-website/` to the repo root.
3. Push to `main`.
4. In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / root**.
5. Wait ~30 seconds. Visit `https://<username>.github.io/<repo>/`.

> No build step is required. The site uses Tailwind via CDN, so everything works as static files.

## Customisation

| Want to… | Edit |
|---|---|
| Change the GitHub repo / download link | `index.html` — search for `github.com/sunnyskyess420/frogpaper` and replace with your repo URL |
| Change the "Buy me a coffee" link | `index.html` — search for `buymeacoffee.com/alively142` |
| Add a new gallery wallpaper | Drop the PNG in `assets/gallery/`, copy a `<article>` block in `#galleryTrack`, swap the `<img src>` and labels |
| Re-theme the colors | `index.html` — the `tailwind.config` script in `<head>` (HSL channels) and `styles.css` `:root` |
| Swap fonts | The Google Fonts `<link>` in `<head>` + the `fontFamily` block in `tailwind.config` |
| Remove the Base44 badge | Already removed (it was a Base44 platform script, not present in this static clone) |

## How it was built

This is a **clean rebuild** of the original React/Vite/Framer Motion site.
Everything (text, image URLs, color tokens, comparison matrix values,
FAQ answers) was extracted from the rendered DOM of the original page
and re-implemented with:

- **Single `index.html`** — no SPA, no router, no React.
- **Tailwind CDN** with a custom theme config that mirrors the original
  HSL design tokens (dark sage background `156 14% 7%`, copper accent
  `28 45% 55%`, paper-cream foreground `42 31% 94%`).
- **Vanilla JS** (~150 lines) for: drag-to-scroll gallery carousel,
  prev/next arrows, keyboard nav, mobile menu drawer, scroll-reveal
  via `IntersectionObserver`, active-link highlighting.
- **CSS-only accordion** using native `<details>`/`<summary>` with a
  rotated `+` indicator — no JS required.
- **Animations**: `float-slow`, `sheen` (card hover shimmer), `enter`
  (scroll-reveal fade), `pulse-soft`.
- **Accessibility**: keyboard-focusable carousel, `aria-label`s on icon
  buttons, reduced-motion media query that disables animations.
- **Self-contained**: every image (12 wallpapers + hero + favicon) is
  downloaded locally — no external CDN dependencies except fonts and
  Tailwind itself.

## Browser support

Modern evergreen browsers (Chrome / Edge / Firefox / Safari, latest 2
versions). The carousel uses Pointer Events (so drag works on mouse +
touch). The accordion uses native `<details>` (works everywhere).
Scroll-reveal gracefully degrades to "always visible" if
`IntersectionObserver` is unavailable.

## License & attribution

- **Site content, design, and gallery wallpapers** belong to the
  FrogPaper project (`github.com/sunnyskyess420/frogpaper`).
- This clone is provided as-is for personal hosting purposes.

