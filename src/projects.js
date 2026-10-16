// Entry point for projects.html (all projects on one page)
import { initI18n } from './js/i18n.js';
import { initSite, startReveals } from './js/site.js';
import { renderWork } from './js/work-page.js';

initI18n();

const root = document.querySelector('[data-work]');
renderWork(root);
document.addEventListener('langchange', () => renderWork(root, { revealed: true }));

initSite();
startReveals();
