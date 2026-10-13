import { initConsole } from './js/console.js';
import { initFitTitle } from './js/fit-title.js';
import { initHeroParticles } from './js/hero-particles.js';
import { initI18n } from './js/i18n.js';
import { initPortfolio } from './js/portfolio.js';
import { runPreloader } from './js/preloader.js';
import { initSteps, initWords } from './js/scroll-fx.js';
import { initSite, startReveals } from './js/site.js';
import { renderTeamGrid } from './js/team.js';

// Translate static text first, so everything below renders in the visitor's language
initI18n();

const particles = initHeroParticles(document.querySelector('.hero__canvas'));
initFitTitle(document.querySelector('.hero__title'));
const teamGrid = document.querySelector('[data-team-grid]');

renderTeamGrid(teamGrid);
initPortfolio(document.querySelector('[data-portfolio]'));

document.addEventListener('langchange', () => renderTeamGrid(teamGrid, { revealed: true }));

initSite();
initWords();
initSteps();
initConsole();

// Content above the anchor was just rendered, so re-apply links like /?member=…#portfolio
if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();

runPreloader().then(() => {
  particles.assemble();
  startReveals();
});
