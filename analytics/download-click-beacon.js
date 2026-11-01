/**
 * Download Click Tracking - Beacon Code
 *
 * Add this to site.js to track download button clicks.
 * Sends events to Cloudflare Worker via navigator.sendBeacon().
 *
 * Privacy-focused: No cookies, no PII, no fingerprints.
 */

(function () {
  'use strict';

  // Worker URL - update this when deploying the worker
  var WORKER_URL = 'https://frogpaper-analytics.your-subdomain.workers.dev/download-click';

  // Coarse device class detection (no fingerprinting)
  function getDeviceClass() {
    var ua = navigator.userAgent;
    var width = window.innerWidth;

    // Check for tablet patterns
    if (/tablet|ipad|playbook|silk/i.test(ua) || (width >= 768 && width < 1024)) {
      return 'tablet';
    }

    // Check for mobile patterns
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua) || width < 768) {
      return 'mobile';
    }

    return 'desktop';
  }

  // Send click event to worker
  function trackDownloadClick(platform, isDirect) {
    var payload = {
      platform: platform,
      page: window.location.pathname,
      isDirect: isDirect,
      deviceClass: getDeviceClass(),
      timestamp: Date.now(),
    };

    // Use sendBeacon for reliable delivery even if user navigates away
    var data = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(WORKER_URL, data);
  }

  // Attach click handlers to download buttons
  function attachClickHandlers() {
    // Windows download buttons
    var windowsLinks = document.querySelectorAll('[data-windows-download]');
    windowsLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        // Check if href is direct asset URL or fallback to release page
        var href = link.getAttribute('href') || '';
        var isDirect = href.includes('/releases/download/');

        trackDownloadClick('windows', isDirect);
      });
    });

    // Android download buttons
    var androidLinks = document.querySelectorAll('[data-android-download]');
    androidLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        // Check if href is direct asset URL or fallback to release page
        var href = link.getAttribute('href') || '';
        var isDirect = href.includes('/releases/download/');

        trackDownloadClick('android', isDirect);
      });
    });
  }

  // Attach handlers when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachClickHandlers);
  } else {
    attachClickHandlers();
  }
})();
