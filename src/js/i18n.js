import en from '../i18n/en.js';
import ru from '../i18n/ru.js';
import uz from '../i18n/uz.js';

const DICTS = { en, ru, uz };
export const LANGS = ['en', 'ru', 'uz'];
const STORAGE_KEY = 'afinity:lang';

let lang = detect();

function detect() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  for (const pref of navigator.languages ?? [navigator.language]) {
    const code = String(pref).slice(0, 2).toLowerCase();
    if (LANGS.includes(code)) return code;
  }
  return 'en';
}

export const getLang = () => lang;

/** Interface text by key, with {placeholders}. Falls back to English, then to the key. */
export function t(key, vars) {
  const text = DICTS[lang][key] ?? DICTS.en[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match) : text;
}

/** Data value that may be localised: { en, ru, uz } → current language; plain values pass through. */
export function tr(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value) return value[lang] ?? value.en;
  return value;
}

/**
 * Applies translations to static markup:
 *   data-i18n="key"                 → textContent
 *   data-i18n-html="key"            → innerHTML (trusted strings from the dictionaries only)
 *   data-i18n-attr="attr:key; ..."  → attributes
 */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    }
  });
}

function applyDocument() {
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelectorAll('[data-lang]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
}

/** Switches language everywhere; components re-render on the "langchange" event. */
export function setLang(next) {
  if (!LANGS.includes(next) || next === lang) return;
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  applyDocument();
  applyTranslations();
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/** Call once, before page content is rendered. */
export function initI18n() {
  applyDocument();
  if (lang !== 'en') applyTranslations();
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (btn) setLang(btn.dataset.lang);
  });
}
