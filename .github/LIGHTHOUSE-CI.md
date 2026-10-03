# Lighthouse CI

Automated performance regression testing for FrogPaper. Runs on every push to `main` and every pull request via GitHub Actions.

## What it does

- Serves the static site from a local directory in CI
- Runs Lighthouse 3 times per page (median result used to reduce noise)
- Auto-discovers all HTML files in the repo (5 total: `index.html`, `downloads.html`, `submit-wallpaper.html`, `404.html`, `googleda5218953696dbdc.html`)
- The 3 real pages have strict thresholds; `404.html` and the Google verification file only generate warnings (they're not real pages, so SEO/a11y failures there don't matter)
- **Fails the build (error)** if any of these regress:
  - **Performance score** drops below 70 (catches real regressions; tolerates CI variance — site normally scores 75–85 in CI, 100 on real PageSpeed Insights)
  - **CLS** (Cumulative Layout Shift) exceeds 0.1 (low variance, reliable signal)
  - **TBT** (Total Blocking Time) exceeds 700 ms (catches render-blocking JS regressions)
- **Warns (but doesn't fail)** on:
  - **LCP** (Largest Contentful Paint) — CI variance too high (5.6s–9.9s range on same site) to fail reliably; still reported for visibility
  - **Accessibility**, **Best Practices**, **SEO**, **FCP** — useful signals but not blockers
- Uploads full Lighthouse reports to temporary public storage (7-day links in the run summary)

## ⚠️ Why CI scores differ from PageSpeed Insights

This is the #1 source of confusion. Your site scores **100/100 on PageSpeed Insights** but **~79–85 in Lighthouse CI**. Both are correct. Here's why:

| Where it runs | Hardware | Your score |
|---------------|----------|------------|
| PageSpeed Insights (pagespeed.web.dev) | Google's fast dedicated infrastructure | 100/100 |
| Lighthouse CI (GitHub Actions) | Shared `ubuntu-latest` runner, 2-core CPU | ~79–85 |

The site is the same. The **environment** is different. GitHub's CI runners are slower than Google's PageSpeed servers, so the same site scores 15–20 points lower in CI. Every developer who sets up Lighthouse CI encounters this gap — it's expected.

### Run-to-run variance is also higher in CI

Lighthouse CI runs 3 times per page and picks the median. In CI you'll sometimes see wildly different results across the 3 runs (e.g. LCP of 5.6s, 9.9s, 5.6s). This is because the shared runner's load varies during the test. The median-of-3 approach helps smooth this out, but big swings still happen.

That's why our thresholds are set to **85** (not 100) for Performance and **4000 ms** (not 2500 ms) for LCP — these give CI enough headroom to tolerate variance while still catching real regressions (e.g. if someone adds a 2 MB image or breaks the preload hint, the score will crater far below these thresholds).

## Files

- `.github/workflows/lighthouse.yml` — the GitHub Actions workflow
- `lighthouserc.json` — Lighthouse CI configuration (URLs, thresholds, upload target)

## How to view results

1. Go to https://github.com/sunnyskyess420/frogpaper-website/actions
2. Click any "Lighthouse CI" run
3. Scroll to the bottom of the run page — there's a "Lighthouse CI Results" section with links to the full reports (valid for 7 days)

Each report looks exactly like a PageSpeed Insights report — same audits, same scoring, same everything.

## How to make this check required for PRs (optional, recommended)

This stops PRs from being merged if Lighthouse fails:

1. Go to https://github.com/sunnyskyess420/frogpaper-website/settings/branches
2. Click "Add rule" (or edit existing rule for `main`)
3. Check "Require status checks to pass before merging"
4. Search for and add **"Lighthouse CI"** as a required check
5. Save

## How to interpret failures

| Failure type | What it usually means | Action |
|--------------|------------------------|--------|
| Performance < 0.7 | Real regression (e.g. broken preload, huge new asset, render-blocking JS added) | Re-run the workflow; if it fails 2x in a row, check the diff for new images, scripts, or stylesheets |
| CLS > 0.1 | An image is missing `width`/`height` attributes | Check the diff for new `<img>` tags without dimensions |
| TBT > 700ms | New render-blocking JavaScript added | Check the diff for new `<script>` tags in `<head>` |
| LCP > 8000ms (warning only) | CI runner was overloaded OR real regression | Check the report — if other metrics are fine, it's CI variance. If LCP is the only metric that's bad AND Performance also dropped, investigate. |

**Note:** LCP is a warning (not an error) because CI variance is too high — the same site can produce LCP values of 5.6s, 7.0s, and 9.9s across three runs. Performance score is a more stable signal for catching real regressions.

## Tuning thresholds

If false failures happen often, edit `lighthouserc.json`:

```json
"categories:performance": ["error", {"minScore": 0.7}]      // raise/lower the 0.7
"total-blocking-time": ["error", {"maxNumericValue": 700}]  // raise/lower ms
```

If you want to **disable** an assertion temporarily (e.g. while debugging), change `"error"` to `"off"`:

```json
"categories:performance": "off"
```

## Optional: Rich PR comments via LHCI GitHub App

By default, results appear in the Actions tab logs. For richer PR comments with trend graphs and detailed audit breakdowns:

1. Install the Lighthouse CI GitHub App: https://github.com/apps/lighthouse-ci
2. Grant it access to this repo
3. Copy the token it gives you
4. Add it as a repo secret: https://github.com/sunnyskyess420/frogpaper-website/settings/secrets/actions
   - Name: `LHCI_GITHUB_APP_TOKEN`
   - Value: paste the token

The workflow already references this secret; it'll start working automatically once added.
