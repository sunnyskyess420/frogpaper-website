# FrogPaper Website

Official landing page for [FrogPaper](https://github.com/sunnyskyess420/frogpaper) — the AI Wallpaper Generator for Windows.

## 🌐 Live Site

**[sunnyskyess420.github.io/frogpaper-website](https://sunnyskyess420.github.io/frogpaper-website/)**

## 🐸 About FrogPaper

FrogPaper is a free, open-source Windows desktop application that generates, curates, and rotates AI-powered wallpapers. It combines prompt building, AI image generation, style filtering, and automatic wallpaper rotation — all in one window, no browser needed.

## ✨ Website Features

- **Dark theme** with green accent design
- **Wallpaper carousel** with sample images and lightbox
- **Feature grid** highlighting v1.2.0 capabilities
- **Comparison table** — FrogPaper vs browser AI vs wallpaper apps
- **Direct download** buttons linking to the installer (.exe)
- **Changelog** with clickable version history linking to GitHub releases
- **Community Gallery** section linking to the wallpaper submission form
- **Bonus Apps** section featuring related tools like Photo Sorter
- **Privacy section** with clear data handling info
- **Fully responsive** — mobile, tablet, and desktop

## 📥 Downloads

| Version | What's New | Link |
|---------|-----------|------|
| **v1.2.0** (latest) | Cloud sync (Google Drive, OneDrive, Dropbox), secure sign-in, setup wizard | [FrogPaper-Setup-1.2.0.exe](https://github.com/sunnyskyess420/frogpaper/releases/download/1.2.0/FrogPaper-Setup-1.2.0.exe) |
| v1.1.1 | Improved update notifications, image tagging, reliability | [FrogPaper-Setup-1.1.1.exe](https://github.com/sunnyskyess420/frogpaper/releases/download/v1.1.1/FrogPaper-Setup-1.1.1.exe) |
| v1.1.0 | Portrait export for mobile wallpapers | [FrogPaper-Setup-1.1.0.exe](https://github.com/sunnyskyess420/frogpaper/releases/download/v1.1.0/FrogPaper-Setup-1.1.0.exe) |
| v1.0.2 | Gallery, 19 style filters, tagging, slideshow | [Releases page](https://github.com/sunnyskyess420/frogpaper/releases/tag/v1.0.2) |

## 🛠️ Tech Stack

- **Static HTML/CSS/JS** — no build step, no framework
- **Google Fonts** (Inter, JetBrains Mono)
- **FormSubmit.co** for wallpaper submission form handling
- Deployed to **GitHub Pages**

## 📂 Project Structure

```
├── index.html              # Main landing page (all sections)
├── submit-wallpaper.html   # Community wallpaper submission form
├── 404.html                # Custom 404 error page
├── _not-found.html         # GitHub Pages 404 fallback
├── logo.svg                # FrogPaper logo (vector)
├── logo.png                # FrogPaper logo (raster)
├── frogpaper-preview.jpg   # App screenshot / preview image
├── robots.txt              # Search engine crawl rules
└── README.md               # This file
```

## 🚀 Local Development

No build step required — just open the files in a browser or use any local server.

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (e.g., VS Code Live Server or Python)
python3 -m http.server 8000
```

## 📦 Deployment

Push all files to the `gh-pages` branch (or your GitHub Pages branch). No build step is needed — the static HTML files are ready to serve as-is.

## ☕ Support

If you enjoy FrogPaper, consider [buying the dev a coffee](https://buymeacoffee.com/alively142).

## 📄 License

This website is part of the FrogPaper project. See the main [FrogPaper repository](https://github.com/sunnyskyess420/frogpaper) for license information.

---

*Lily pads optional. Wallpapers mandatory.*
