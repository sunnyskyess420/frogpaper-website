# ACTION REQUIRED - Clear Instructions for You

## What I've Done ✅
1. **Website improvements merged** - Social proof fix, platform-aware buttons, copy errors fixed
2. **Tracking code added** - Download click tracking is now in the site code
3. **Worker script ready** - Cloudflare Worker script is prepared but NOT deployed yet

---

## What YOU Need to Do (In Priority Order)

### 🔴 HIGH PRIORITY - Do These First

#### 1. Submit Sitemap to Google Search Console (10 minutes) - EASIEST, DO THIS FIRST

**What this does:** Tells Google about your website pages so they can show up in search results.

**Step-by-step:**

1. Go to: https://search.google.com/search-console
2. Click "Add a property" (top left)
3. Enter: `sunnyskyess420.github.io/frogpaper-website/`
4. Click "Continue"
5. Select "HTML tag" verification method
6. Copy the meta tag (it looks like: `<meta name="google-site-verification" content="...">`)
7. Open this file on your computer: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\index.html`
8. Paste the meta tag in the `<head>` section (near line 10-20)
9. Save the file
10. In your terminal, run:
    ```bash
    cd C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website
    git add index.html
    git commit -m "Add Google Search Console verification"
    git push
    ```
11. Wait 1-2 minutes for GitHub Pages to rebuild
12. Go back to Google Search Console and click "Verify"
13. Once verified, click "Sitemaps" in the left menu
14. Enter: `https://sunnyskyess420.github.io/frogpaper-website/sitemap.xml`
15. Click "Submit"

**Also do this for Bing:**
1. Go to: https://www.bing.com/webmasters
2. Sign in with your Microsoft account
3. Add your site: `sunnyskyess420.github.io/frogpaper-website/`
4. Verify the same way (HTML meta tag)
5. Submit the sitemap URL

---

#### 2. Deploy Download Click Tracking (20 minutes) - OPTIONAL, CAN SKIP

**What this does:** Tracks when people click download buttons so you know if anyone is actually downloading.

**Skip this if:** You don't want to set up Cloudflare Workers right now.

**Step-by-step:**

1. **Go to Cloudflare:**
   - Log in to: https://dash.cloudflare.com/
   - Click "Workers & Pages" in the left menu
   - Click "Analytics Engine"

2. **Create database:**
   - Click "Create database"
   - Name it: `frogpaper-download-clicks`
   - Click "Create"

3. **Deploy the Worker:**
   - Open your terminal
   - Run:
     ```bash
     cd C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\analytics
     npx wrangler deploy
     ```
   - If it asks for login, follow the prompts
   - Copy the worker URL it shows (it looks like: `https://frogpaper-download-click.xxx.workers.dev`)

4. **Update the code:**
   - Open this file: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\site.js`
   - Go to line 454
   - Replace the placeholder URL with your actual worker URL
   - Save the file

5. **Push changes:**
   ```bash
   cd C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website
   git add site.js
   git commit -m "Update analytics worker URL"
   git push
   ```

6. **Test it:**
   - Go to: https://sunnyskyess420.github.io/frogpaper-website/
   - Click a download button
   - Go back to Cloudflare Analytics Engine dashboard
   - You should see a new data point appear

**More details:** See `analytics/DEPLOYMENT.md`

### 🟡 MEDIUM PRIORITY - Do These When You Have Time

#### 3. Add "Why Windows May Warn" Note (5 minutes)

**What this does:** Warns users that Windows might show a security warning because the installer isn't signed.

**Step-by-step:**

1. Open this file: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\downloads.html`
2. Find the Windows download button (around line 130)
3. Add this HTML right after the button:
   ```html
   <p class="text-sm text-muted-foreground mt-2">
     Note: Windows may show a SmartScreen warning because the installer is not code-signed.
     This is normal for unsigned open-source software. The SHA256 is shown above for verification.
   </p>
   ```
4. Save the file
5. Push changes:
   ```bash
   cd C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website
   git add downloads.html
   git commit -m "Add SmartScreen warning note"
   git push
   ```

---

#### 4. Link VirusTotal Result (10 minutes)

**What this does:** Shows users that the installer has been scanned for viruses.

**Step-by-step:**

1. Download the installer: https://github.com/sunnyskyess420/frogpaper/releases/download/v1.7.12/FrogPaper-Setup-1.7.12.exe
2. Go to: https://www.virustotal.com/
3. Click "Choose file" and select the installer you just downloaded
4. Wait for the scan to complete (1-2 minutes)
5. Copy the analysis URL (it looks like: https://www.virustotal.com/gui/file/...)
6. Open this file: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\downloads.html`
7. Add this link near the download button:
   ```html
   <a href="https://www.virustotal.com/gui/file/YOUR_FILE_ID_HERE" target="_blank" rel="noopener">View VirusTotal scan</a>
   ```
8. Replace `YOUR_FILE_ID_HERE` with the actual ID from the URL
9. Save and push changes

### 🟢 LOW PRIORITY - Do These When You Have More Time

#### 5. Code Signing (Requires Your Identity)

**What this does:** Signs the Windows installer so Windows doesn't show a security warning.

**Options:**
- **SignPath.io** (FREE for open-source): https://signpath.io/
- **Azure Trusted Signing** (low-cost): https://learn.microsoft.com/en-us/azure/trusted-signing/
- **Certum** (discounted OSS certificates): https://www.certum.pl/

**This requires:**
- Your personal identity verification (ID, phone, etc.)
- Setting up the signing service
- Updating the build process

**I cannot do this for you** - it requires your personal identity.

---

#### 6. Marketing - Get People to Your Site

**The problem:** Only 22 people have visited your site since analytics was installed. You need more traffic.

**Where to post:**

**Reddit:**
- r/wallpapers: https://www.reddit.com/r/wallpapers/
- r/frogs: https://www.reddit.com/r/frogs/
- r/AndroidApps: https://www.reddit.com/r/AndroidApps/
- r/software: https://www.reddit.com/r/software/
- r/SideProject: https://www.reddit.com/r/SideProject/

**Hacker News:**
- Post "Show HN: FrogPaper – a cozy AI wallpaper studio"
- https://news.ycombinator.com/

**Product Hunt:**
- Launch your product: https://www.producthunt.com/

**Facebook:**
- Post in groups where you're already active
- Share on your personal page

**Demo video:**
- Record a 30-60 second video showing the app
- Post natively to each platform (not just a YouTube link)

---

## What I Can Do Later (When You Have More Usage)

When you're ready with more usage time, I can:
- Add install ping to the Python app (tracks actual installs, not just downloads)
- Add UTM tracking to marketing links
- Help with any code changes needed for code signing
- Optimize the site further based on telemetry data

---

## Quick Checklist

- [ ] Submit sitemap to Google Search Console (DO THIS FIRST - easiest)
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Deploy telemetry Worker (optional, can skip)
- [ ] Add SmartScreen warning note to downloads.html
- [ ] Upload installer to VirusTotal and link the result
- [ ] Set up code signing (requires your identity)
- [ ] Do marketing/distribution

---

## File Locations

- Live site: https://sunnyskyess420.github.io/frogpaper-website/
- GitHub repo: https://github.com/sunnyskyess420/frogpaper-website
- Local repo: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\`
- Analytics folder: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\analytics\`
- This file: `C:\Users\alive\.openclaw-autoclaw\workspace\projects\frogpaper-website\ACTION_REQUIRED.md`

---

## Summary

**DO NOW (easiest):**
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools

**LATER (when you have time):**
3. Deploy telemetry Worker (optional)
4. Add SmartScreen note + VirusTotal link
5. Set up code signing (requires your identity)
6. Do marketing/distribution

**NEEDS MORE USAGE:**
7. Ask next agent to add install ping to Python app
8. Ask next agent for any other code changes
