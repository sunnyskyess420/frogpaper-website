/* =============================================================
   FrogPaper — site.js (website-redesign)
   Small, dependency-free enhancements:
   header shadow, mobile navigation, gallery carousel and the
   live Android version/size labels.
   ============================================================= */
(function () {
  'use strict';

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
  if (versionSpots.length || sizeSpots.length || androidDownloadSpots.length) {
    function fetchAndroidInfo() {
      fetch('https://api.github.com/repos/sunnyskyess420/frogpaper-mobile/releases/latest', {
        headers: { Accept: 'application/vnd.github+json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .then(function (release) {
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
        })
        .catch(function () { /* keep the static fallback */ });
    }

    // Initial fetch
    fetchAndroidInfo();

    // Poll every 60 seconds to keep Android info updated
    setInterval(fetchAndroidInfo, 60000);
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
     ----------------------------------------------------------- */
  var releaseLinks = document.querySelectorAll('[data-release-tag]');
  var windowsDownloadSpots = document.querySelectorAll('[data-windows-downloads]');
  if (releaseLinks.length || windowsDownloadSpots.length) {
    function fetchDownloadCounts() {
      // Fetch version history download counts
      releaseLinks.forEach(function (link) {
        var tag = link.getAttribute('data-release-tag');
        var downloadsEl = link.querySelector('[data-release-downloads]');
        if (!tag || !downloadsEl) return;

        fetch('https://api.github.com/repos/sunnyskyess420/frogpaper/releases/tags/' + tag, {
          headers: { Accept: 'application/vnd.github+json' }
        })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
          })
          .then(function (release) {
            var assets = release && release.assets ? release.assets : [];
            var total = assets.reduce(function (sum, asset) {
              return sum + (asset.download_count || 0);
            }, 0);
            downloadsEl.textContent = '— ' + formatNumber(total) + ' downloads';
          })
          .catch(function () { /* keep the static fallback */ });
      });

      // Fetch latest Windows release download count for the Windows section
      if (windowsDownloadSpots.length) {
        fetch('https://api.github.com/repos/sunnyskyess420/frogpaper/releases/latest', {
          headers: { Accept: 'application/vnd.github+json' }
        })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
          })
          .then(function (release) {
            var tag = release && release.tag_name ? String(release.tag_name) : '';
            var assets = release && release.assets ? release.assets : [];
            var total = assets.reduce(function (sum, asset) {
              return sum + (asset.download_count || 0);
            }, 0);
            windowsDownloadSpots.forEach(function (el) {
              el.textContent = formatNumber(total);
            });
          })
          .catch(function () { /* keep the static fallback */ });
      }
    }

    // Initial fetch
    fetchDownloadCounts();

    // Poll every 60 seconds to keep counts updated
    setInterval(fetchDownloadCounts, 60000);
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
})();
