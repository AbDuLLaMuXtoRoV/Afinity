// Entry point for 404.html (shown for addresses that do not exist)
import { initI18n, t } from './js/i18n.js';
import { initSite, startReveals } from './js/site.js';

initI18n();
document.title = t('nf.meta');
document.addEventListener('langchange', () => (document.title = t('nf.meta')));

initSite();
startReveals();
