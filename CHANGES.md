# FrogPaper Website — localStorage Cache for GitHub API calls

Branch: `main` (apply directly — no PR needed unless you want one)
Goal: stop hitting GitHub's 60-requests-per-hour unauthenticated API limit
when users browse the site. Cache API responses in `localStorage` for 1 hour.

This folder contains two patched files. Each has a `.original` companion so
you can `diff` to see what changed.

```
frogpaper-cache-fix/
├── CHANGES.md                       ← this file
├── site.js                          ← patched
├── site.js.original                 ← as-is from main
├── downloads.html                   ← patched
└── downloads.html.original          ← as-is from main
```

## Why

GitHub's unauthenticated API limit is **60 requests per hour per IP**. A
single page load of `index.html` fires **13** of those requests:

- 1× `/repos/sunnyskyess420/frogpaper-mobile/releases/latest` (Android version + APK size + download count)
- 11× `/repos/sunnyskyess420/frogpaper/releases/tags/{v1.7.5 ... v1.3.2}` (one per release-tag link)
- 1× `/repos/sunnyskyess420/frogpaper/releases/latest` (latest Windows download count)

That's 13 requests per visit. A user who opens the site, scrolls around,
hits refresh a couple times, comes back later — they hit the limit. Then
every download counter on the page is stuck on "Loading downloads…" for
the next hour. The site looks broken, even though it isn't.

The numbers don't even change fast — a download count from 30 minutes ago
is basically the same number.

## What changed

### `site.js`

Added a `cachedFetch(url, options, force)` helper that wraps `fetch()` with
a `localStorage` cache (1-hour TTL, namespaced under `fp:api:`).

Behavior:
- **Cache hit, < 1 hour old** → return cached JSON immediately. **Zero network calls.** Numbers appear instantly.
- **Cache hit, > 1 hour old** → fetch fresh; on success update the cache; on failure (rate limit, offline, DNS, etc.) fall back to the stale cache so the user still sees a number, not "Loading downloads…".
- **Cache miss** → fetch fresh; on failure reject (caller keeps the static "Loading downloads…" fallback that was already in the markup).

All three existing fetch sites now go through `cachedFetch`:
- `fetchAndroidInfo()` — Android release info
- `fetchDownloadCounts()` — per-release-tag counts
- `fetchDownloadCounts()` — latest Windows release count

The 60-second poller still runs, but with `force=true` so it always *tries* to refresh. If the refresh fails, it falls back to stale cache instead of clearing the numbers.

### `downloads.html`

Same pattern in the page's inline `<script>` block. One API call
(`/repos/sunnyskyess420/frogpaper-mobile/releases?per_page=20`) gets cached.

Also made the failure path smarter: if the network fails AND we have any
cached version (even stale), we render the cached data with a small
"offline — showing last known counts" notice instead of clearing the page
and showing the error box.

When rendering from cache, the timestamp label says "showing cached data —
refresh for live counts" instead of "updated {time}" so the user knows what
they're seeing.

## What the user sees

| Scenario | Before | After |
|---|---|---|
| First visit ever | ~1s "Loading downloads…", then numbers | Same (no cache yet) |
| Second visit within 1 hour | ~1s "Loading downloads…", then numbers | Numbers appear **instantly** |
| Visit after 1 hour | ~1s "Loading downloads…", then numbers | Brief flash, then fresh numbers |
| Visit while offline / rate-limited | "Loading downloads…" stuck forever | Last known numbers shown, with note |
| Page left open, 60s poll fires | Numbers update silently | Same (with `force=true`, still tries to refresh) |
| Page left open, 60s poll fires but rate-limited | Numbers stay where they were | Numbers stay where they were (now backed by cache too) |

## How to apply

Same process as the last batch:

```powershell
# from your repo root on main
copy C:\path\to\frogpaper-cache-fix\site.js           site.js
copy C:\path\to\frogpaper-cache-fix\downloads.html    downloads.html

git add site.js downloads.html
git commit -m "Add localStorage cache (1h TTL) for GitHub API calls"
git push
```

CI should stay green — the Lighthouse detection from the previous patch is
preserved, so Lighthouse still skips these calls entirely.

## How to verify

After pushing and the Pages deploy finishes, visit
https://sunnyskyess420.github.io/frogpaper-:

1. Open DevTools (F12) → Application tab → Local Storage → click the site URL
2. You should see keys starting with `fp:api:` after the page loads
3. Reload the page → the download counters should appear instantly (no flash of "Loading downloads…")
4. On the downloads page (`/frogpaper-website/downloads.html`), the
   timestamp should say "showing cached data — refresh for live counts"
   on the second visit
5. Click "Refresh now" → timestamp goes back to "updated {time}"

## Backward compatibility

- The cache uses a `fp:api:` prefix — it doesn't touch any other localStorage keys.
- If a user has an old version of the page cached in their browser, the new `site.js` just loads and works — no migration needed.
- If `localStorage` is disabled (private mode in some browsers) or full, `writeCache` silently fails and `cachedFetch` degrades to plain `fetch()` — the page still works, just without caching.
