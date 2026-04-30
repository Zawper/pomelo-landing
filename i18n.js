// Pomelo i18n — language switcher

const cache = {};

async function loadTranslations(lang) {
  if (cache[lang]) return cache[lang];
  try {
    const res = await fetch(`/lang/${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache[lang] = data;
    console.log('i18n: JSON loaded, keys =', Object.keys(data).length);
    return data;
  } catch (err) {
    console.warn(`[i18n] Could not load /lang/${lang}.json`, err);
    return null;
  }
}

function applyTranslations(translations) {
  console.log('i18n: applyTranslations called');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.innerHTML = translations[key];
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (translations[key]) el.setAttribute('alt', translations[key]);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) el.setAttribute('placeholder', translations[key]);
  });
}

async function setLanguage(lang) {
  const translations = await loadTranslations(lang);
  if (!translations) return;

  localStorage.setItem('pomelo_lang', lang);
  applyTranslations(translations);
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('lang-active', btn.getAttribute('data-lang') === lang);
  });
}

async function initI18n() {
  const lang = localStorage.getItem('pomelo_lang')
    || (navigator.language.startsWith('pl') ? 'pl' : 'en');
  console.log('i18n: DOMContentLoaded, lang =', lang);

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });

  await setLanguage(lang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
