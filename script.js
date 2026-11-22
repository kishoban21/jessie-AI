/**
 * JESSIE — Landing Page Script
 * Interactive behaviour: nav state, search overlay,
 * mobile menu drawer and smooth scrolling.
 */

(function () {
  'use strict';

  /* =========================================================
     UTILITY HELPERS
     ========================================================= */

  /**
   * Trap focus inside a container element (a11y).
   * Returns a cleanup function.
   */
  function trapFocus(container) {
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return () => {};
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    container.addEventListener('keydown', handler);
    first.focus();
    return () => container.removeEventListener('keydown', handler);
  }

  /* =========================================================
     ACTIVE NAV LINK
     ========================================================= */
  const navLinks    = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  /**
   * Sets the active state on both desktop and drawer nav links.
   * @param {string} target — the data-nav value to activate
   */
  function setActiveNav(target) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === target);
    });
    drawerLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === target);
    });
  }

  // Desktop nav click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.nav;
      setActiveNav(target);
      // Smooth-scroll to section if it exists
      const section = document.getElementById(target);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Drawer nav click
  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.nav;
      setActiveNav(target);
      closeDrawer();
      const section = document.getElementById(target);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* =========================================================
     SEARCH OVERLAY
     ========================================================= */
  const searchOverlay  = document.getElementById('searchOverlay');
  const searchBtn      = document.getElementById('searchBtn');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput    = document.getElementById('searchInput');
  let searchFocusTrap  = null;

  function openSearch() {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    searchFocusTrap = trapFocus(searchOverlay);
    searchInput.value = '';
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchFocusTrap) { searchFocusTrap(); searchFocusTrap = null; }
    searchBtn.focus();
  }

  searchBtn.addEventListener('click', openSearch);
  searchCloseBtn.addEventListener('click', closeSearch);

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchOverlay.classList.contains('open'))  closeSearch();
      if (mobileDrawer.classList.contains('open'))   closeDrawer();
    }
  });

  /* =========================================================
     MOBILE MENU DRAWER
     ========================================================= */
  const hamburgerBtn   = document.getElementById('hamburgerBtn');
  const mobileDrawer   = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  let   drawerFocusTrap = null;

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    drawerFocusTrap = trapFocus(mobileDrawer);
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    if (drawerFocusTrap) { drawerFocusTrap(); drawerFocusTrap = null; }
    hamburgerBtn.focus();
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  /* =========================================================
     EXPLORE JESSIE CTA (smooth scroll to #about)
     ========================================================= */
  const exploreBtn = document.getElementById('shopNowBtn');

  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = document.getElementById('about');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveNav('about');
    });
  }

  /* =========================================================
     NAVBAR SCROLL GLASSMORPHISM ENHANCEMENT
     ========================================================= */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.style.background = 'rgba(7,5,7,0.95)';
      navbar.style.boxShadow  = '0 1px 32px rgba(0,0,0,0.6)';
    } else {
      navbar.style.background = '';
      navbar.style.boxShadow  = '';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* =========================================================
     ACTIVE NAV WHILE SCROLLING + FOOTER YEAR
     ========================================================= */
  const spySections = ['home', 'about', 'features', 'team', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) setActiveNav(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach(sec => spy.observe(sec));
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     INIT
     ========================================================= */
  // Set initial active nav to Home on load
  setActiveNav('home');

  console.log('%cJESSIE landing page loaded ✓', 'color:#e11d2e;font-weight:700;font-size:14px');

})();
