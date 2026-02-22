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
      // Accessibility
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault(); // POPRAWKA: zawsze zapobiegaj skokom strony dla href="#"
        return;
      }
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

  // ==================== FORM VALIDATION + SECURITY ====================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // POPRAWKA: Funkcja sanityzacji inputów - usuwa potencjalnie niebezpieczne znaki
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }

  // POPRAWKA: Rate limiting - zapobiega spamowi wielokrotnego wysyłania
  let formSubmitCount = 0;
  let lastSubmitTime = 0;
  const MAX_SUBMITS = 3;
  const SUBMIT_COOLDOWN = 60000; // 1 minuta

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // POPRAWKA: Rate limiting check
      const now = Date.now();
      if (now - lastSubmitTime < SUBMIT_COOLDOWN && formSubmitCount >= MAX_SUBMITS) {
        e.preventDefault();
        alert('Zbyt wiele prób wysłania. Poczekaj chwilę i spróbuj ponownie.');
        return;
      }

      // POPRAWKA: Honeypot check (pole ukryte - boty je wypełniają, ludzie nie)
      const honeypot = contactForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value !== '') {
        e.preventDefault(); // Cicho odrzucamy - bot nie powinien wiedzieć że został wykryty
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        return;
      }

      let valid = true;
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      const rodo = contactForm.querySelector('#rodo');

      // POPRAWKA: Sprawdzamy i sanityzujemy wartości
      const nameVal = sanitizeInput(name.value);
      const emailVal = sanitizeInput(email.value);
      const messageVal = sanitizeInput(message.value);

      if (!nameVal || nameVal.length < 2 || nameVal.length > 100) {
        name.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || emailVal.length > 200) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!messageVal || messageVal.length < 10 || messageVal.length > 5000) {
        message.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!rodo.checked) {
        rodo.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        return;
      }

      // POPRAWKA: Aktualizuj rate limiting counter
      formSubmitCount++;
      lastSubmitTime = now;

      // Formularz wysyła się przez Formspree
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 500);
    });
  }

  // ==================== LANG SWITCHER ====================
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Zapisz wybór języka w localStorage
      try {
        localStorage.setItem('pomelo_lang', btn.getAttribute('data-lang'));
      } catch(err) {
        // Cicho ignoruj jeśli localStorage niedostępny
      }
    });
  });

  // ==================== COOKIE CONSENT ====================

  const COOKIE_NAME = 'pomelo_cookie_consent';
  const COOKIE_EXPIRY_HOURS = 1;

  function getCookieConsent() {
    try {
      const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
      if (match) {
        return JSON.parse(decodeURIComponent(match[2]));
      }
    } catch (e) {
      // Błąd parsowania - ignoruj
    }
    return null;
  }

  // POPRAWKA: Dodano Secure flag i SameSite=Strict
  function setCookieConsent(analytics) {
    const value = JSON.stringify({ necessary: true, analytics: analytics });
    const date = new Date();
date.setTime(date.getTime() + COOKIE_EXPIRY_HOURS * 60 * 60 * 1000);    // Secure flag działa tylko na HTTPS (Vercel = zawsze HTTPS) ✓
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(value)
      + ';expires=' + date.toUTCString()
      + ';path=/'
      + ';SameSite=Strict'  // POPRAWKA: Strict zamiast Lax - lepsze bezpieczeństwo
      + ';Secure';          // POPRAWKA: Secure flag - tylko przez HTTPS
  }

  function initGA4() {
    if (window._ga4Loaded) return;
    window._ga4Loaded = true;
    var GA4_ID = 'G-LJLQKVTBRH'; 
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    // POPRAWKA: Anonimizacja IP + brak reklam
    gtag('config', GA4_ID, {
      'anonymize_ip': true,        // Anonimizacja IP zgodnie z RODO
      'allow_google_signals': false, // Brak śledzenia reklamowego
      'allow_ad_personalization_signals': false
    });
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

  // POPRAWKA: Banner pokazuje się TYLKO gdy nie ma zapisanej zgody
  var consent = getCookieConsent();
  if (consent && consent.analytics === true) {
    initGA4();
    // Nie pokazuj bannera - użytkownik już wyraził zgodę
  } else if (consent === null) {
    // Brak zgody - pokaż banner (pierwsza wizyta lub zgoda wygasła)
    showCookieBanner();
  }
  // Jeśli consent istnieje ale analytics=false - baner też ukryty (użytkownik odrzucił)

  // Banner buttons
  var btnAcceptAll = document.getElementById('cookieAcceptAll');
  var btnReject = document.getElementById('cookieReject');
  var btnSettings = document.getElementById('cookieSettings');

  if (btnAcceptAll) btnAcceptAll.addEventListener('click', function() { saveCookieConsent(true); });
if (btnReject) btnReject.addEventListener('click', function() {
  saveCookieConsent(false);
  window.location.href = 'polityka-cookies.html';
});  if (btnSettings) btnSettings.addEventListener('click', function() { showCookieSettings(); });

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

  // POPRAWKA: Escape key zamyka modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideCookieSettings();
    }
  });

  // Footer "Zarządzaj cookies" link
  var manageCookiesLink = document.getElementById('manage-cookies');
  if (manageCookiesLink) {
    manageCookiesLink.addEventListener('click', function(e) {
      e.preventDefault();
      var currentConsent = getCookieConsent();
      if (analyticsToggle && currentConsent) {
        analyticsToggle.checked = currentConsent.analytics;
      }
      showCookieSettings();
    });
  }

});
