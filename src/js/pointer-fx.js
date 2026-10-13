/** Hero glow that follows the cursor, and buttons that lean toward it. */
export function initPointerFx() {
  const fine = matchMedia('(pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;

  const hero = document.querySelector('.hero');
  const bg = hero?.querySelector('.hero__bg');
  if (hero && bg) {
    hero.addEventListener(
      'pointermove',
      (e) => {
        const r = hero.getBoundingClientRect();
        bg.style.setProperty('--mx', `${e.clientX - r.left}px`);
        bg.style.setProperty('--my', `${e.clientY - r.top}px`);
      },
      { passive: true },
    );
  }

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.25;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.translate = `${x}px ${y}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.translate = '';
    });
  });
}
