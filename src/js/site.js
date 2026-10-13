import '../styles/main.css';
import { initContactForm } from './contact-form.js';
import { initLiveCards } from './live-cards.js';
import { initNav } from './nav.js';
import { initPointerFx } from './pointer-fx.js';
import { initCounters, initReveal } from './scroll-fx.js';

/** Behaviour shared by every page. Call after page-specific content has been rendered. */
export function initSite() {
  initNav();
  initPointerFx();
  initContactForm();
  initLiveCards();
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}

export function startReveals() {
  document.documentElement.classList.add('is-ready');
  initReveal();
  initCounters();
}
