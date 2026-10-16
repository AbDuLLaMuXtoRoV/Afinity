/** Shows the floating Telegram button once the visitor has scrolled past the first screen. */
export function initTelegramButton() {
  const button = document.querySelector('[data-tg-float]');
  if (!button) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    button.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.6);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
