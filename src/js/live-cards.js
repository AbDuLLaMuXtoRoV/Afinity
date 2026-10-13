/**
 * Touch screens have no hover, so cards play their story while they are
 * mostly on screen, and stop (freeing the animations) once scrolled away.
 */
export function initLiveCards() {
  if (matchMedia('(hover: hover)').matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-live', entry.isIntersecting);
    },
    { threshold: 0.55 },
  );
  document.querySelectorAll('.card, .case, .member').forEach((el) => observer.observe(el));
}
