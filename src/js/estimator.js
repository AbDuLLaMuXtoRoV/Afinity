// Cost estimator UI: reads the choices, shows a price range and timeline, and hands the
// selection to the contact form. Prices live in src/data/pricing.js.
import { goal } from './analytics.js';
import { prefillContact } from './contact-form.js';
import { estimate } from './estimate.js';
import { getLang, t } from './i18n.js';

const LOCALES = { en: 'en-US', ru: 'ru-RU', uz: 'uz-Latn-UZ' };
const PRODUCT_KEYS = { mobile: 'form.chip.mobile', website: 'form.chip.website', admin: 'form.chip.admin', bot: 'form.chip.bot' };

/** A price in dollars, written the way the current language does it ($7,500 / 7 500 $). */
export const formatUsd = (n) =>
  new Intl.NumberFormat(LOCALES[getLang()] ?? 'en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(n);
const usd = formatUsd;
const num = (n) => new Intl.NumberFormat(LOCALES[getLang()] ?? 'en-US', { maximumFractionDigits: 1 }).format(n);

export function initEstimator() {
  const form = document.querySelector('[data-estimator]');
  if (!form) return;

  const out = {
    price: form.querySelector('[data-est-price]'),
    som: form.querySelector('[data-est-som]'),
    time: form.querySelector('[data-est-time]'),
    empty: form.querySelector('[data-est-empty]'),
    cta: form.querySelector('[data-est-cta]'),
    result: form.querySelector('.est__result'),
  };

  const read = () => {
    const fd = new FormData(form);
    return {
      products: fd.getAll('est-product').map(String),
      platforms: String(fd.get('est-platforms') ?? 'both'),
      websiteType: String(fd.get('est-website') ?? 'corporate'),
      features: fd.getAll('est-feature').map(String),
      design: String(fd.get('est-design') ?? 'custom'),
    };
  };

  const render = () => {
    const sel = read();
    // Follow-up questions appear only for the products they belong to
    for (const q of form.querySelectorAll('[data-when]')) q.hidden = !sel.products.includes(q.dataset.when);

    const result = estimate(sel);
    out.result.classList.toggle('is-empty', !result);
    out.empty.hidden = Boolean(result);
    out.cta.disabled = !result;
    if (!result) {
      out.price.textContent = '—';
      out.som.textContent = '';
      out.time.textContent = '—';
      return;
    }
    out.price.textContent = `${usd(result.usd[0])} – ${usd(result.usd[1])}`;
    out.som.textContent = t('est.som', { a: num(result.uzsMln[0]), b: num(result.uzsMln[1]) });
    out.time.textContent = t('est.weeks', { a: result.weeks[0], b: result.weeks[1] });
  };

  /** A short, readable summary of the choices for the contact message (in the visitor's language). */
  const summary = () => {
    const sel = read();
    const result = estimate(sel);
    const label = (name, value) => form.querySelector(`input[name="${name}"][value="${value}"] + span`)?.textContent.trim() ?? value;
    const products = sel.products.map((p) => {
      if (p === 'mobile') return `${t(PRODUCT_KEYS.mobile)} (${label('est-platforms', sel.platforms)})`;
      if (p === 'website') return label('est-website', sel.websiteType);
      return t(PRODUCT_KEYS[p]);
    });
    const lines = [`${t('est.summary.intro')}: ${products.join(', ')}`];
    if (sel.features.length) lines.push(`${t('est.summary.features')}: ${sel.features.map((f) => label('est-feature', f)).join(', ')}`);
    lines.push(`${t('est.summary.design')}: ${label('est-design', sel.design)}`);
    if (result) lines.push(`${t('est.summary.range')}: ${usd(result.usd[0])} – ${usd(result.usd[1])}, ${t('est.weeks', { a: result.weeks[0], b: result.weeks[1] })}`);
    return `${lines.join('\n')}\n\n${t('est.summary.more')} `;
  };

  let used = false;
  form.addEventListener('change', () => {
    if (!used) goal('estimate_used');
    used = true;
    render();
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  out.cta.addEventListener('click', () => {
    goal('estimate_quote');
    const products = read().products;
    prefillContact({ services: products, message: summary() });
  });
  document.addEventListener('langchange', render);

  // Service pages link here with ?est=mobile (comma-separated for several) to preselect products
  const preset = (new URLSearchParams(window.location.search).get('est') ?? '').split(',');
  for (const box of form.querySelectorAll('input[name="est-product"]')) {
    if (preset.includes(box.value)) box.checked = true;
  }
  render();
}
