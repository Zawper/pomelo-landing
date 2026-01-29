document.addEventListener('DOMContentLoaded', () => {

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  });

  // ==================== MOBILE MENU ====================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // ==================== SCROLL ANIMATIONS (Fade In) ====================
  const fadeElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => observer.observe(el));

  // ==================== ACTIVE NAVIGATION ====================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    const navHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
      const top = section.offsetTop - navHeight - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // ==================== FORM VALIDATION ====================
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    const rodo = form.querySelector('#rodo');

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
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
  });

  // ==================== LANG SWITCHER (placeholder) ====================
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

});
