import { initConsole } from './js/console.js';
import { initEstimator } from './js/estimator.js';
import { initFitTitle } from './js/fit-title.js';
import { initHeroParticles } from './js/hero-particles.js';
import { initI18n } from './js/i18n.js';
import { runPreloader } from './js/preloader.js';
import { renderReviews } from './js/reviews.js';
import { initSteps, initWords } from './js/scroll-fx.js';
import { initSite, startReveals } from './js/site.js';
import { renderTeamGrid } from './js/team.js';

// Old links to the portfolio section (/#portfolio, /?member=…#portfolio) now open the projects page
if (window.location.hash === '#portfolio') window.location.replace(`/projects.html${window.location.search}`);

// Translate static text first, so everything below renders in the visitor's language
initI18n();

const particles = initHeroParticles(document.querySelector('.hero__canvas'));
initFitTitle(document.querySelector('.hero__title'));
const teamGrid = document.querySelector('[data-team-grid]');

renderTeamGrid(teamGrid);
const reviewsRoot = document.querySelector('[data-reviews]');
renderReviews(reviewsRoot);

document.addEventListener('langchange', () => {
  renderTeamGrid(teamGrid, { revealed: true });
  renderReviews(reviewsRoot, { revealed: true });
});

initSite();
initWords();
initSteps();
initConsole();
initEstimator();

// Content above the anchor was just rendered, so re-apply links like /#team
if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();

runPreloader().then(() => {
  particles.assemble();
  startReveals();
});
