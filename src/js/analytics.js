// Yandex Metrika: visits, sources, click maps and goals (estimator use, sent requests, Telegram clicks).
// Off until VITE_YANDEX_METRIKA_ID is set in .env (the counter number from metrika.yandex.ru).
// Session recording (Webvisor) stays off, so what visitors type in the form is never recorded.
const ID = Number(import.meta.env.VITE_YANDEX_METRIKA_ID) || 0;

let started = false;

export function initAnalytics() {
  if (!ID || started) return;
  started = true;

  // Official loader: queue calls until tag.js arrives
  window.ym =
    window.ym ||
    function (...args) {
      (window.ym.a = window.ym.a || []).push(args);
    };
  window.ym.l = Date.now();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.append(script);

  window.ym(ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });

  // Contact links anywhere on the site
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.includes('t.me/')) goal('telegram_click');
    else if (href.startsWith('tel:')) goal('phone_click');
  });
}

/**
 * Records a goal. Create goals with the same names in Metrika ("JavaScript event") to see them in reports:
 * estimate_used, estimate_quote, request_sent, start_project, telegram_click, phone_click
 */
export function goal(name, params) {
  if (ID && typeof window.ym === 'function') window.ym(ID, 'reachGoal', name, params);
}
