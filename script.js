document.addEventListener('DOMContentLoaded', () => {

  // ==================== NAVBAR SCROLL EFFECT ====================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==================== MOBILE MENU TOGGLE ====================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // ==================== ACTIVE NAVIGATION ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector('.nav-link[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // ==================== FADE IN ON SCROLL ====================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ==================== FORM VALIDATION ====================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      const rodo = contactForm.querySelector('#rodo');

      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!message.value.trim()) {
        message.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!rodo.checked) {
        rodo.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (valid) {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }
    });
  }

  // ==================== LANG SWITCHER ====================
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ==================== COOKIE CONSENT ====================

  const COOKIE_NAME = 'pomelo_cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;

  function getCookieConsent() {
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  function setCookieConsent(analytics) {
    const value = JSON.stringify({ necessary: true, analytics: analytics });
    const date = new Date();
    date.setTime(date.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/;SameSite=Lax';
  }

  function initGA4() {
    if (window._ga4Loaded) return;
    window._ga4Loaded = true;
    // Replace G-XXXXXXXX with your actual GA4 Measurement ID
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX';
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXX');
  }

  function showCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    if (banner) {
      setTimeout(function() { banner.classList.add('show'); }, 300);
    }
  }

  function hideCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
  }

  function showCookieSettings() {
    hideCookieBanner();
    var modal = document.getElementById('cookieModal');
    if (modal) modal.classList.add('show');
  }

  function hideCookieSettings() {
    var modal = document.getElementById('cookieModal');
    if (modal) modal.classList.remove('show');
  }

  function saveCookieConsent(analytics) {
    setCookieConsent(analytics);
    hideCookieBanner();
    hideCookieSettings();
    if (analytics) {
      initGA4();
    }
  }

  // Check existing consent – load GA4 if previously accepted
  var consent = getCookieConsent();
  if (consent && consent.analytics === true) {
    initGA4();
  }
  // Always show banner on page load
  showCookieBanner();

  // Banner buttons
  var btnAcceptAll = document.getElementById('cookieAcceptAll');
  var btnReject = document.getElementById('cookieReject');
  var btnSettings = document.getElementById('cookieSettings');

  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', function() {
      saveCookieConsent(true);
    });
  }

  if (btnReject) {
    btnReject.addEventListener('click', function() {
      saveCookieConsent(false);
    });
  }

  if (btnSettings) {
    btnSettings.addEventListener('click', function() {
      showCookieSettings();
    });
  }

  // Modal buttons
  var btnModalSave = document.getElementById('cookieModalSave');
  var btnModalAcceptAll = document.getElementById('cookieModalAcceptAll');
  var analyticsToggle = document.getElementById('cookieAnalyticsToggle');

  if (btnModalSave) {
    btnModalSave.addEventListener('click', function() {
      var analyticsVal = analyticsToggle ? analyticsToggle.checked : false;
      saveCookieConsent(analyticsVal);
    });
  }

  if (btnModalAcceptAll) {
    btnModalAcceptAll.addEventListener('click', function() {
      if (analyticsToggle) analyticsToggle.checked = true;
      saveCookieConsent(true);
    });
  }

  // Close modal on overlay click
  var modalOverlay = document.getElementById('cookieModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        hideCookieSettings();
      }
    });
  }

  // Footer "Zarządzaj cookies" link
  var manageCookiesLink = document.getElementById('manage-cookies');
  if (manageCookiesLink) {
    manageCookiesLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Pre-fill modal toggle based on current consent
      var currentConsent = getCookieConsent();
      if (analyticsToggle && currentConsent) {
        analyticsToggle.checked = currentConsent.analytics;
      }
      showCookieSettings();
    });
  }

});
