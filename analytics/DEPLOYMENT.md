# Download Click Tracking - Deployment Instructions

## Overview
This adds download click tracking using Cloudflare Workers + Analytics Engine. The tracking is privacy-focused: no cookies, no PII, no fingerprints.

## What Gets Tracked
- **Platform:** windows or android
- **Page path:** e.g., `/`, `/downloads.html`, `/submit-wallpaper.html`
- **Direct vs fallback:** Whether the button linked to the direct asset URL or the release page
- **Device class:** desktop, mobile, or tablet (coarse detection, no fingerprinting)
- **Timestamp:** When the click occurred

## Files Created
- `analytics/download-click-worker.js` - Cloudflare Worker script
- `analytics/download-click-beacon.js` - JavaScript beacon code (to be integrated into site.js)
- `analytics/wrangler.toml` - Cloudflare Workers configuration

## Deployment Steps

### Step 1: Set up Cloudflare Analytics Engine

1. Log in to your Cloudflare dashboard
2. Navigate to **Workers & Pages** → **Analytics Engine**
3. Click **Create database**
4. Name it: `frogpaper-download-clicks`
5. Note the dataset name for the wrangler.toml binding

### Step 2: Configure wrangler.toml

Update `analytics/wrangler.toml` with your dataset name:

```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
dataset_name = "frogpaper-download-clicks"  # Replace with your actual dataset name
```

### Step 3: Deploy the Worker

From the `analytics/` directory:

```bash
cd analytics
npx wrangler deploy
```

This will:
- Deploy the worker to Cloudflare
- Bind it to your Analytics Engine dataset
- Output the worker URL (e.g., `https://frogpaper-download-click.your-subdomain.workers.dev`)

### Step 4: Update the Worker URL in the Beacon Code

Open `analytics/download-click-beacon.js` and update line 7:

```javascript
var WORKER_URL = 'https://frogpaper-download-click.your-subdomain.workers.dev/download-click';
```

Replace with the actual URL from Step 3.

### Step 5: Integrate Beacon Code into site.js

Open `site.js` and paste the entire contents of `download-click-beacon.js` at the end, before the closing `})();`.

Or, more cleanly:
1. Create a new file `analytics.js` in the repo root
2. Paste the beacon code there
3. Add `<script src="analytics.js?v=1.7.14"></script>` to index.html, downloads.html, and submit-wallpaper.html

### Step 6: Test the Tracking

1. Open the live site (or local preview)
2. Click a download button
3. Check the Cloudflare Analytics Engine dashboard
4. You should see a new data point appear within a minute

### Step 7: Verify the Data

In the Cloudflare Analytics Engine dashboard, run a query:

```sql
SELECT
  blobs[1] as platform,
  blobs[2] as page,
  blobs[3] as device_class,
  doubles[1] as is_direct,
  timestamp
FROM frogpaper-download-clicks
ORDER BY timestamp DESC
LIMIT 10
```

You should see your test click with the correct platform, page, and device class.

## Privacy Note

This tracking:
- ✅ Does NOT use cookies
- ✅ Does NOT collect PII (personal identifiable information)
- ✅ Does NOT use device fingerprinting
- ✅ Uses coarse device class (desktop/mobile/tablet) only
- ✅ Does NOT track referrer, IP, or location
- ✅ Uses `navigator.sendBeacon()` for reliable delivery

You should update the privacy policy on the site to mention:
> "We collect anonymous download click statistics to improve the website. This includes platform, page, and coarse device class. No personal information is collected."

## Rollback

If you need to disable tracking:
1. Remove the `<script src="analytics.js">` tags from the HTML files
2. Bump the cache-buster on site.js if you integrated the code there
3. The Worker can remain deployed (it will just receive no events)

## Cost

Cloudflare Analytics Engine pricing (as of 2024):
- Free tier: 100,000 events per month
- Paid: $0.50 per million events beyond free tier

For a small project, the free tier should be sufficient.

## Questions Before Deployment

**Do NOT deploy without answering these:**

1. [ ] Have you created the Analytics Engine dataset in Cloudflare?
2. [ ] Have you updated the dataset name in wrangler.toml?
3. [ ] Have you deployed the worker and noted its URL?
4. [ ] Have you updated the WORKER_URL in the beacon code?
5. [ ] Have you tested the tracking locally?
6. [ ] Have you updated the site's privacy policy?

## Next Steps After Deployment

Once tracking is live, you can answer:
- How many people click the Windows vs Android buttons?
- Which page drives the most downloads?
- Are users getting the direct asset or falling back to the release page?
- What device classes are downloading?

This data will help you:
- Optimize the homepage layout
- Fix any API/rate-limit issues affecting the direct links
- Understand your user base better
