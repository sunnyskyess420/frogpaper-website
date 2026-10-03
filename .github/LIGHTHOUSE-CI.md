# Lighthouse CI

Automated performance regression testing for FrogPaper. Runs on every push to `main` and every pull request via GitHub Actions.

## What it does

- Serves the static site from a local directory in CI
- Runs Lighthouse 3 times per page (median result used to reduce noise)
- Tests only real pages: `index.html`, `downloads.html`, `submit-wallpaper.html`
- Skips utility files like `404.html` and `googleda5218953696dbdc.html`
- **Fails the build** if any of these regress:
  - **Performance score** drops below 85
  - **LCP** (Largest Contentful Paint) exceeds 4,000 ms
  - **CLS** (Cumulative Layout Shift) exceeds 0.1
  - **TBT** (Total Blocking Time) exceeds 500 ms
- **Warns (but doesn't fail)** on Accessibility, Best Practices, SEO, or FCP regressions
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
| Performance < 0.85 | Real regression OR CI runner was overloaded | Re-run the workflow; if it fails 2x in a row, investigate |
| LCP > 4000ms | Hero image broken, preload removed, or huge new asset added | Check if `assets/img/hero-frog-*.webp` files still exist and `index.html` still has the preload links |
| CLS > 0.1 | An image is missing `width`/`height` attributes | Check the diff for new `<img>` tags without dimensions |
| TBT > 500ms | New render-blocking JavaScript added | Check the diff for new `<script>` tags in `<head>` |

## Tuning thresholds

If false failures happen often, edit `lighthouserc.json`:

```json
"categories:performance": ["error", {"minScore": 0.85}]      // raise/lower the 0.85
"largest-contentful-paint": ["error", {"maxNumericValue": 4000}]  // raise/lower ms
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
