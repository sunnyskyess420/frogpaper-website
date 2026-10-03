# Lighthouse CI

Automated performance regression testing for FrogPaper. Runs on every push to `main` and every pull request via GitHub Actions.

## What it does

- Builds the static site and serves it locally in CI
- Runs Lighthouse 3 times per page (median result used to reduce noise)
- Fails the build if any of these regress:
  - **Performance score** drops below 90
  - **LCP** (Largest Contentful Paint) exceeds 2.5s
  - **CLS** (Cumulative Layout Shift) exceeds 0.1
  - **TBT** (Total Blocking Time) exceeds 300ms
- Warns (but doesn't fail) if Accessibility, Best Practices, SEO, or FCP regress
- Uploads the full Lighthouse reports to temporary public storage (7-day links in the run summary)

## Files

- `.github/workflows/lighthouse.yml` — the GitHub Actions workflow
- `lighthouserc.json` — Lighthouse CI configuration (thresholds, runs, upload target)

## How to view results

1. Go to https://github.com/sunnyskyess420/frogpaper-website/actions
2. Click any "Lighthouse CI" run
3. Scroll to the bottom of the run page for a summary with report links

## How to make this check required for PRs (optional, recommended)

This stops PRs from being merged if Lighthouse fails:

1. Go to https://github.com/sunnyskyess420/frogpaper-website/settings/branches
2. Click "Add rule" (or edit existing rule for `main`)
3. Check "Require status checks to pass before merging"
4. Search for and add "Lighthouse CI" as a required check
5. Save

## Tuning thresholds

If false failures happen (e.g. CI runner is slow one day), edit `lighthouserc.json`:

```json
"categories:performance": ["error", {"minScore": 0.9}]  // raise/lower the 0.9
"largest-contentful-paint": ["error", {"maxNumericValue": 2500}]  // raise/lower ms
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
