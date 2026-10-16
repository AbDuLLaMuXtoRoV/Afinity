// Entry point for the service pages (services/*.html)
import { initI18n } from './js/i18n.js';
import { renderService } from './js/service-page.js';
import { initSite, startReveals } from './js/site.js';

initI18n();

const root = document.querySelector('[data-service-page]');
renderService(root);
document.addEventListener('langchange', () => renderService(root, { revealed: true }));

initSite();
startReveals();
