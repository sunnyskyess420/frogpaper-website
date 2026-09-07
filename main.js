/* =============================================================
   FrogPaper — main.js
   Gallery carousel (drag + arrows), mobile menu, scroll reveal,
   smooth-scroll anchor nav, sticky-header shadow.
   ============================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. MOBILE MENU TOGGLE
     ------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mobileNav.classList.add('hidden'));
    });
  }

  /* ------------------------------------------------------------------
     2. GALLERY CAROUSEL — drag + arrow controls
     ------------------------------------------------------------------ */
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galPrev');
  const nextBtn = document.getElementById('galNext');

  if (track) {
    const cardWidth = () => {
      const first = track.querySelector('article');
      if (!first) return 440;
      const gap = 20;
      return first.getBoundingClientRect().width + gap;
    };

    prevBtn && prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });

    // --- Drag-to-scroll (pointer events: mouse + touch unified) ---
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let hasMoved = false;

    track.addEventListener('pointerdown', (e) => {
      isDown = true;
      hasMoved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) hasMoved = true;
      track.scrollLeft = startScroll - dx;
    });

    const endDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      try { track.releasePointerCapture(e.pointerId); } catch (_) {}
      // Prevent the click that follows a drag from "clicking through" the card
      if (hasMoved) {
        const suppress = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          track.removeEventListener('click', suppress, true);
        };
        track.addEventListener('click', suppress, true);
      }
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);

    // Keyboard nav
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
      }
    });
  }

  /* ------------------------------------------------------------------
     3. STICKY HEADER — add shadow on scroll
     ------------------------------------------------------------------ */
  const header = document.querySelector('header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('shadow-lg', 'shadow-black/30');
    } else {
      header.classList.remove('shadow-lg', 'shadow-black/30');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     4. SCROLL REVEAL — IntersectionObserver
        Adds .is-visible to .reveal elements as they enter the viewport.
        Falls back to "show everything" if IntersectionObserver missing,
        and uses a generous rootMargin so off-screen elements pre-reveal.
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    'section h2, section article, section .grid > div, footer .grid > div'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      // rootMargin: trigger reveal when element is within 500px of viewport
      // (so full-page screenshots and pre-scroll don't show blank sections)
      { rootMargin: '500px 0px 500px 0px', threshold: 0 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // Safety net: after 2 seconds, force-show anything still hidden
  // (covers edge cases like full-page screenshots where IO never fires)
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      el.classList.add('is-visible');
    });
  }, 2000);

  /* ------------------------------------------------------------------
     5. ANCHOR NAV — close mobile nav + smooth-scroll already handled
        by CSS scroll-behavior. Add active-state highlight.
     ------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const isActive = link.getAttribute('href') === '#' + id;
              link.classList.toggle('text-copper', isActive);
              link.classList.toggle('text-muted-foreground', !isActive);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => navIo.observe(s));
  }

  /* ------------------------------------------------------------------
     6. ACCORDION — details/summary works natively; just animate the
        chevron rotation via CSS (group-open). No JS needed here.
     ------------------------------------------------------------------ */
})();
