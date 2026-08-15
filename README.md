# FrogPaper Website

Official landing page for [FrogPaper](https://github.com/sunnyskyess420/frogpaper) — the AI Wallpaper Studio for Windows.

## 🌐 Live Site

**[sunnyskyess420.github.io/frogpaper-website](https://sunnyskyess420.github.io/frogpaper-website/)**

## 🐸 About FrogPaper

FrogPaper is a free, open-source Windows desktop application that generates, curates, and rotates AI-powered wallpapers. It combines prompt building, AI image generation, style filtering, and automatic wallpaper rotation — all in one window, no browser needed.

## ✨ Landing Page Features

- **Dark theme** with green accent design system
- **Wallpaper carousel** with 15 sample images and lightbox
- **Live stats bar** — visit counter, GitHub stars, forks, and download count
- **Feature grid** with scroll-triggered animations
- **Comparison table** — FrogPaper vs browser AI vs wallpaper apps
- **Download section** — direct installer links with total download counter
- **Changelog** and privacy section
- **Fully responsive** — mobile, tablet, and desktop

## 📥 Downloads

| Version | What's New | Link |
|---------|-----------|------|
| **v1.1.1** (latest) | Update checker + all v1.1.0 features | [FrogPaper-Setup-1.1.1.exe](https://github.com/sunnyskyess420/frogpaper/releases/download/v1.1.1/FrogPaper-Setup-1.1.1.exe) |
| v1.1.0 | Portrait bulk export (9:16) | [FrogPaper-Setup-1.1.0.exe](https://github.com/sunnyskyess420/frogpaper/releases/download/v1.1.0/FrogPaper-Setup-1.1.0.exe) |
| v1.0.2 | Gallery, 19 style filters, tagging, slideshow | [Releases page](https://github.com/sunnyskyess420/frogpaper/releases/tag/v1.0.2) |

## 🛠️ Tech Stack

- **Next.js 16** (static export)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** icons
- **GitHub API** for live stats (stars, forks, downloads)
- **CounterAPI** for site visit tracking
- Deployed to **GitHub Pages** at `/frogpaper-website`

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page (all sections)
│   │   ├── layout.tsx        # Root layout + metadata/SEO
│   │   └── globals.css       # Theme variables + animations
│   └── components/
│       ├── frogpaper-nav.tsx         # Fixed nav + sticky download bar
│       ├── frogpaper-hero.tsx        # Hero section with demo video
│       ├── frogpaper-stats-bar.tsx   # Live counters (visits, stars, forks, downloads)
│       ├── frogpaper-carousel.tsx    # Wallpaper slideshow + lightbox
│       ├── frogpaper-features.tsx    # Feature grid with animations
│       ├── frogpaper-how-it-works.tsx
│       ├── frogpaper-privacy.tsx
│       ├── frogpaper-comparison.tsx  # Comparison table
│       ├── frogpaper-downloads.tsx   # Download cards + counter
│       ├── frogpaper-changelog.tsx
│       ├── frogpaper-final-cta.tsx
│       └── frogpaper-footer.tsx
├── public/
│   ├── slideshow/            # Wallpaper images (20 PNGs)
│   ├── logo.svg
│   └── robots.txt
├── next.config.ts             # Static export + basePath config
└── package.json
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## 📦 Building for Deployment

The site uses two build configs:

- **Preview** (`basePath: ""`) — for local testing with VS Code Live Server
- **Deploy** (`basePath: "/frogpaper-website"`) — for GitHub Pages

```bash
npm run build
# Output goes to out/
```

To deploy, push the contents of the deploy build (`out/`) to the `gh-pages` branch or use GitHub Actions.

## ☕ Support

If you enjoy FrogPaper, consider [buying the dev a coffee](https://buymeacoffee.com/alively142).

## 📄 License

This website is part of the FrogPaper project. See the main [FrogPaper repository](https://github.com/sunnyskyess420/frogpaper) for license information.

---

*Lily pads optional. Wallpapers mandatory.*
