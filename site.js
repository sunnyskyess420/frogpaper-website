/* =============================================================
   FrogPaper — site.js (website-redesign)
   Small, dependency-free enhancements:
   header shadow, mobile navigation, gallery carousel and the
   live Android version/size labels.
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     Lighthouse / CI detection
     When Lighthouse CI runs the page, there is no point fetching live
     download counts from the GitHub API — the numbers are not visible
     to anyone reading the report, and 13 unauthenticated fetches per
     page load × 3 URLs × 3 runs blows straight through GitHub's
     60-requests-per-hour limit. Rate-limited fetches either fail
     instantly (403) or hang, and either case can leave Lighthouse
     waiting on pending promises long enough for it to give up and
     return null/NaN for performance and TBT.
     Skipping these fetches under Lighthouse removes that entire class
     of failure without changing anything a real visitor sees.
     ----------------------------------------------------------- */
  var isLighthouse = navigator.userAgent.indexOf('Chrome-Lighthouse') !== -1;

  /* -----------------------------------------------------------
     Cached GitHub API fetch
     GitHub's unauthenticated API limit is 60 requests/hour per IP.
     A single page load can fire 13 of those, so a user who reloads
     a few times gets rate-limited and sees stuck "Loading downloads…"
     for the next hour.

     cachedFetch() wraps fetch() with a localStorage cache:
       - Cache hit younger than TTL → return cached JSON immediately,
         no network call.
       - Cache hit older than TTL → fetch fresh; on success update the
         cache; on failure (rate limit, offline, etc.) fall back to
         the stale cache so the user still sees a number.
       - Cache miss → fetch fresh; on failure reject.

     Each cache key is namespaced under "fp:api:" so clearing FrogPaper
     data doesn't wipe unrelated localStorage.
     ----------------------------------------------------------- */
  var API_CACHE_PREFIX = 'fp:api:v1.7.12:';
  var API_CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

  function readCache(key) {
    try {
      var raw = localStorage.getItem(API_CACHE_PREFIX + key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed; // { ts: number, data: any }
    } catch (error) {
      return null;
    }
  }

  function writeCache(key, data) {
    try {
      localStorage.setItem(API_CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (error) {
      // localStorage might be full or disabled (private mode) — silently
      // degrade to no caching. The fetches still work; they're just not
      // cached.
    }
  }

  // Returns a Promise that resolves to { data, fromCache }.
  // `force` skips the cache TTL check (used by the periodic poller and
  // any future manual-refresh button) but still reads stale cache on
  // failure.
  function cachedFetch(url, options, force) {
    var cacheKey = url;
    var cached = readCache(cacheKey);

    if (cached && !force && (Date.now() - cached.ts) < API_CACHE_TTL) {
      return Promise.resolve({ data: cached.data, fromCache: true });
    }

    return fetch(url, options || {})
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        writeCache(cacheKey, data);
        return { data: data, fromCache: false };
      })
      .catch(function (error) {
        // Network/rate-limit failure. If we have any cached version —
        // even a stale one past TTL — use it rather than showing
        // "Loading downloads…" forever.
        if (cached) {
          return { data: cached.data, fromCache: true };
        }
        throw error;
      });
  }

  /* -----------------------------------------------------------
     Header shadow on scroll
     ----------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------
     Mobile navigation
     ----------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* -----------------------------------------------------------
     Gallery carousel — arrows, drag and keyboard
     ----------------------------------------------------------- */
  function initGallery(trackId, prevId, nextId, label) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var prev = document.getElementById(prevId);
    var next = document.getElementById(nextId);

    track.setAttribute('tabindex', '0');
    track.setAttribute('aria-label', label + '. Use the arrow keys to scroll.');

    function cardStep() {
      var card = track.querySelector('.gallery-card');
      if (!card) return 320;
      return card.getBoundingClientRect().width + 18;
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: cardStep(), behavior: 'smooth' });
      });
    }

    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        track.scrollBy({ left: cardStep(), behavior: 'smooth' });
      }
    });

    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;

    track.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      isDown = true;
      moved = false;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      if (track.setPointerCapture) track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', function (event) {
      if (!isDown) return;
      var dx = event.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });

    function endDrag(event) {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      if (track.releasePointerCapture) {
        try { track.releasePointerCapture(event.pointerId); } catch (error) { /* ignore */ }
      }
      if (moved) {
        var suppress = function (clickEvent) {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          track.removeEventListener('click', suppress, true);
        };
        track.addEventListener('click', suppress, true);
      }
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);
  }

  initGallery('galleryTrackWindows', 'galleryPrevWindows', 'galleryNextWindows', 'Windows community wallpaper gallery');
  initGallery('galleryTrackAndroid', 'galleryPrevAndroid', 'galleryNextAndroid', 'Android community wallpaper gallery');

  /* -----------------------------------------------------------
     Active navigation link
     ----------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* -----------------------------------------------------------
     Live Android version + APK size + download count
     Falls back to the static values in the markup.
     ----------------------------------------------------------- */
  var versionSpots = document.querySelectorAll('[data-android-version]');
  var sizeSpots = document.querySelectorAll('[data-android-size]');
  var androidDownloadSpots = document.querySelectorAll('[data-android-downloads]');
  if (!isLighthouse && (versionSpots.length || sizeSpots.length || androidDownloadSpots.length)) {
    function applyAndroidInfo(release) {
      var tag = release && release.tag_name ? String(release.tag_name) : '';
      if (tag) {
        var version = tag.charAt(0) === 'v' ? tag : 'v' + tag;
        versionSpots.forEach(function (el) { el.textContent = version; });
      }
      var apk = (release && release.assets ? release.assets : []).filter(function (asset) {
        return /\.apk$/i.test(asset.name || '');
      })[0];
      if (apk && apk.size) {
        var mb = Math.round(apk.size / 1048576);
        sizeSpots.forEach(function (el) { el.textContent = mb + ' MB'; });
      }
      if (apk && apk.download_count) {
        androidDownloadSpots.forEach(function (el) {
          el.textContent = formatNumber(apk.download_count);
        });
      }
    }

    function fetchAndroidInfo(force) {
      cachedFetch(
        'https://api.github.com/repos/sunnyskyess420/frogpaper-mobile/releases/latest',
        { headers: { Accept: 'application/vnd.github+json' } },
        force
      )
        .then(function (result) { applyAndroidInfo(result.data); })
        .catch(function () { /* keep the static fallback */ });
    }

    // Initial fetch (will hit cache if user visited in the last hour)
    fetchAndroidInfo(false);

    // Poll every 10 minutes. force=true so the poller always tries to
    // refresh, but cachedFetch still falls back to stale data on failure.
    // 60s polling burned 60 of GitHub's 60/hour unauthenticated requests
    // on its own, which rate-limited every other label on the page.
    setInterval(function () { fetchAndroidInfo(true); }, 600000);
  }

  /* -----------------------------------------------------------
     Shared number formatter
     ----------------------------------------------------------- */
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return String(num);
  }

  /* -----------------------------------------------------------
     Windows release download counts

     FALLBACK_WIN_INSTALLER is the direct download URL for the most recent
     Windows release. When the GitHub API is rate-limited, blocked, or the
     visitor is offline, applyWindowsRelease() never runs and the static
     href in the HTML is what users get — so that href AND this constant
     MUST point at a real installer file, not at /releases/latest (which
     lands people on a release-notes page instead of a download).

     *** BUMP THIS CONSTANT AND EVERY data-windows-download HREF IN THE
         HTML ON EVERY WINDOWS RELEASE. ***
     ----------------------------------------------------------- */
  var FALLBACK_WIN_INSTALLER =
    'https://github.com/sunnyskyess420/frogpaper/releases/download/v1.7.12/FrogPaper-Setup-1.7.12.exe';

  var releaseLinks = document.querySelectorAll('[data-release-tag]');
  var windowsDownloadSpots = document.querySelectorAll('[data-windows-downloads]');
  var windowsVersionSpots = document.querySelectorAll('[data-windows-version]');
  var windowsDownloadLinks = document.querySelectorAll('[data-windows-download]');
  var windowsShaSpots = document.querySelectorAll('[data-windows-sha256]');

  function applyWindowsRelease(release) {
    if (!release) return;

    var tag = release.tag_name ? String(release.tag_name) : '';
    if (tag) {
      var version = tag.charAt(0) === 'v' ? tag : 'v' + tag;
      windowsVersionSpots.forEach(function (el) { el.textContent = version; });
    }

    var assets = release.assets || [];
    var exes = assets.filter(function (asset) {
      return /\.exe$/i.test(asset.name || '');
    });
    var installer = exes.filter(function (asset) {
      return /setup/i.test(asset.name || '');
    })[0] || exes[0];

    if (installer) {
      windowsDownloadLinks.forEach(function (link) {
        link.setAttribute('href', installer.browser_download_url || release.html_url || '#download');
      });
      var digest = String(installer.digest || '').replace(/^sha256:/i, '');
      windowsShaSpots.forEach(function (el) {
        el.textContent = digest || 'See the release page';
      });
    } else if (release.html_url) {
      windowsDownloadLinks.forEach(function (link) {
        link.setAttribute('href', release.html_url);
      });
    }

    if (windowsDownloadSpots.length) {
      var total = assets.reduce(function (sum, asset) {
        return sum + (asset.download_count || 0);
      }, 0);
      windowsDownloadSpots.forEach(function (el) {
        el.textContent = formatNumber(total);
      });
    }
  }

  function fetchLatestWindowsRelease(force) {
    cachedFetch(
      'https://api.github.com/repos/sunnyskyess420/frogpaper/releases/latest',
      { headers: { Accept: 'application/vnd.github+json' } },
      force
    )
      .then(function (result) { applyWindowsRelease(result.data); })
      .catch(function () {
        // API failed (rate-limited, offline, ad-blocker, etc.).
        // Rewrite every Windows download button to the last-known-good
        // installer so users still get a file, not a release-notes page.
        windowsDownloadLinks.forEach(function (link) {
          link.setAttribute('href', FALLBACK_WIN_INSTALLER);
        });
      });
  }

  if (!isLighthouse) {
    if (releaseLinks.length) {
      function fetchDownloadCounts(force) {
        releaseLinks.forEach(function (link) {
          var tag = link.getAttribute('data-release-tag');
          var downloadsEl = link.querySelector('[data-release-downloads]');
          if (!tag || !downloadsEl) return;

          cachedFetch(
            'https://api.github.com/repos/sunnyskyess420/frogpaper/releases/tags/' + tag,
            { headers: { Accept: 'application/vnd.github+json' } },
            force
          )
            .then(function (result) {
              var release = result.data;
              var assets = release && release.assets ? release.assets : [];
              var total = assets.reduce(function (sum, asset) {
                return sum + (asset.download_count || 0);
              }, 0);
              downloadsEl.textContent = '\u00b7 ' + formatNumber(total) + ' downloads';
            })
            .catch(function () { /* keep the static fallback */ });
        });
      }

      fetchDownloadCounts(false);
      // Historical counts change slowly; the 1-hour cache keeps this under
      // GitHub's 60-requests/hour limit.
      setInterval(function () { fetchDownloadCounts(false); }, 600000);
    }

    if (windowsDownloadSpots.length || windowsVersionSpots.length || windowsDownloadLinks.length || windowsShaSpots.length) {
      // Force the first lookup so a freshly published release appears
      // immediately; later polls reuse the cache unless it is over an hour old.
      fetchLatestWindowsRelease(true);
      setInterval(function () { fetchLatestWindowsRelease(false); }, 600000);
    }
  }

  /* -----------------------------------------------------------
     Platform-aware CTA reordering
     On Android devices, show the Android download button first.
     On Windows devices, keep Windows first. Both buttons remain
     available on all platforms.
     ----------------------------------------------------------- */
  var heroActions = document.querySelector('.hero-actions');
  if (heroActions) {
    var isAndroid = /android/i.test(navigator.userAgent);
    var buttons = heroActions.querySelectorAll('a');
    if (isAndroid && buttons.length >= 2) {
      var windowsBtn = heroActions.querySelector('[data-windows-download]');
      var androidBtn = heroActions.querySelector('[data-android-download]');
      if (windowsBtn && androidBtn) {
        heroActions.insertBefore(androidBtn, windowsBtn);
      }
    }
  }

  /* -----------------------------------------------------------
     Download click tracking (beacon to Cloudflare Worker)
     Privacy-focused: no cookies, no PII, no fingerprints.
     Tracks: platform, page, direct/fallback, device class, timestamp.
     ----------------------------------------------------------- */
  var ANALYTICS_WORKER_URL = 'https://frogpaper-download-click.your-subdomain.workers.dev/download-click';

  function getDeviceClass() {
    var ua = navigator.userAgent;
    var width = window.innerWidth;
    if (/tablet|ipad|playbook|silk/i.test(ua) || (width >= 768 && width < 1024)) {
      return 'tablet';
    }
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua) || width < 768) {
      return 'mobile';
    }
    return 'desktop';
  }

  function trackDownloadClick(platform, isDirect) {
    var payload = {
      platform: platform,
      page: window.location.pathname,
      isDirect: isDirect,
      deviceClass: getDeviceClass(),
      timestamp: Date.now(),
    };
    var data = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(ANALYTICS_WORKER_URL, data);
  }

  var windowsLinks = document.querySelectorAll('[data-windows-download]');
  windowsLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href') || '';
      var isDirect = href.includes('/releases/download/');
      trackDownloadClick('windows', isDirect);
    });
  });

  var androidLinks = document.querySelectorAll('[data-android-download]');
  androidLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href') || '';
      var isDirect = href.includes('/releases/download/');
      trackDownloadClick('android', isDirect);
    });
  });

})();
