/**
 * Keeps the hero heading on its designed lines without cutting words off:
 * if the widest line is wider than its column (long words in Russian or Uzbek,
 * narrow windows, late-loading fonts), the font size is reduced just enough to fit.
 * It never enlarges the heading.
 */
export function initFitTitle(title) {
  if (!title) return;
  const lines = [...title.querySelectorAll('.line > span')];
  const wide = matchMedia('(min-width: 960px)'); // below this the lines are allowed to wrap

  const fit = () => {
    title.style.fontSize = '';
    if (!wide.matches) return;
    const available = title.clientWidth;
    const widest = Math.max(...lines.map((line) => line.offsetWidth));
    if (widest > available) {
      const size = parseFloat(getComputedStyle(title).fontSize);
      title.style.fontSize = `${Math.floor(((size * available) / widest) * 0.98)}px`;
    }
  };

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fit);
  };

  fit();
  window.addEventListener('resize', schedule);
  wide.addEventListener('change', schedule);
  document.addEventListener('langchange', schedule);
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener?.('loadingdone', schedule);
}
