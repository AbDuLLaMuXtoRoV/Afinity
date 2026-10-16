// Entry point for project.html (one page per project, chosen with ?p=<slug>)
import { renderCase } from './js/case-page.js';
import { initI18n } from './js/i18n.js';
import { initSite, startReveals } from './js/site.js';

initI18n();

const root = document.querySelector('[data-case]');
renderCase(root);
document.addEventListener('langchange', () => renderCase(root, { revealed: true }));

initSite();
startReveals();
