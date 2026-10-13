import { t } from './i18n.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const root = document.documentElement;

  // Solid background after scrolling; hide on scroll down, show on scroll up
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    if (Math.abs(y - lastY) > 6) {
      const hide = y > lastY && y > window.innerHeight * 0.6 && !root.classList.contains('menu-open');
      nav.classList.toggle('is-hidden', hide);
      lastY = y;
    }
    ticking = false;
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

  // Show the nav again when keyboard focus moves into it
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  // Highlight the link of the section in view
  const links = [...nav.querySelectorAll('.nav__links a')];
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((l) => l.classList.toggle('is-active', l === byId.get(entry.target.id)));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  document.querySelectorAll('main > section[id]').forEach((s) => observer.observe(s));

  initMenu(nav);
}

function initMenu(nav) {
  const root = document.documentElement;
  const toggle = nav.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  if (!toggle || !menu) return;

  let closeTimer;
  const isOpen = () => root.classList.contains('menu-open');

  const open = () => {
    clearTimeout(closeTimer);
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    root.classList.add('menu-open');
    nav.classList.remove('is-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', t('nav.close'));
  };

  const close = ({ restoreFocus = true } = {}) => {
    menu.classList.remove('is-open');
    root.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', t('nav.open'));
    if (restoreFocus) toggle.focus();
    closeTimer = setTimeout(() => (menu.hidden = true), 700);
  };

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  document.addEventListener('langchange', () => toggle.setAttribute('aria-label', t(isOpen() ? 'nav.close' : 'nav.open')));

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close({ restoreFocus: false });
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    // Keep Tab cycling between the toggle and the menu links
    if (e.key === 'Tab') {
      const items = [toggle, ...menu.querySelectorAll('a')];
      const i = items.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    }
  });

  matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches && isOpen()) close({ restoreFocus: false });
  });
}
