const STORAGE_KEY = 'afinity:intro';
const DRAW_MS = 1000;
const LIT_MS = 550;
const WIPE_MS = 950;

/**
 * First visit per session: the mark draws itself, the screen turns into the
 * green logo tile, then wipes away. Resolves when the page should start revealing.
 */
export function runPreloader() {
  const root = document.documentElement;
  const el = document.querySelector('.preloader');

  if (!el || root.classList.contains('intro-seen')) {
    el?.remove();
    return Promise.resolve();
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* storage unavailable — intro will simply replay next visit */
  }

  root.classList.add('is-loading');
  const count = el.querySelector('.preloader__count');
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / DRAW_MS);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    count.textContent = String(Math.round(eased * 100)).padStart(3, '0');
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  return new Promise((resolve) => {
    setTimeout(() => el.classList.add('is-lit'), DRAW_MS);
    setTimeout(() => {
      el.classList.add('is-done');
      root.classList.remove('is-loading');
      resolve();
    }, DRAW_MS + LIT_MS);
    setTimeout(() => el.remove(), DRAW_MS + LIT_MS + WIPE_MS);
  });
}
