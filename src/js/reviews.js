// Client reviews (src/data/reviews.js): a section on the home page and a quote on the matching project page.
// Nothing is rendered while there are no reviews.
import { PREVIEW_REVIEWS, reviews } from '../data/reviews.js';
import { findProject, initials } from '../data/team.js';
import { html, safeUrl } from './html.js';
import { t, tr } from './i18n.js';

const isPreview = () => new URLSearchParams(window.location.search).get('reviews') === 'preview';
const list = () => (reviews.length ? reviews : isPreview() ? PREVIEW_REVIEWS.map((r) => ({ ...r, example: true })) : []);

function reviewCard(r, i, { withProject = true } = {}) {
  const photo = safeUrl(r.photo);
  const project = withProject && r.project ? findProject(r.project) : null;
  return html`
    <figure class="review" data-reveal style="--d: ${i * 0.08}s">
      ${r.example ? html`<span class="review__example mono">${t('rev.example')}</span>` : ''}
      <svg class="review__mark" viewBox="0 0 48 36" aria-hidden="true"><path d="M0 36V20Q0 6 14 0l3 5Q8 9 8 18h9v18zm27 0V20q0-14 14-20l3 5q-9 4-9 13h9v18z" /></svg>
      <blockquote class="review__quote"><p>${tr(r.quote)}</p></blockquote>
      <figcaption class="review__who">
        <span class="review__avatar" aria-hidden="true">
          ${photo ? html`<img src="${photo}" alt="" loading="lazy" decoding="async" />` : initials(r.name)}
        </span>
        <span>
          <strong>${r.name}</strong>
          <span class="mono">${[tr(r.role), r.company].filter(Boolean).join(' · ')}</span>
        </span>
        ${project?.slug
          ? html`<a class="review__project" href="/project.html?p=${encodeURIComponent(project.slug)}">${tr(project.title)}<svg class="i" aria-hidden="true"><use href="#arrow" /></svg></a>`
          : ''}
      </figcaption>
    </figure>`;
}

/** Home page section (replaces the [data-reviews] placeholder; empty when there are no reviews). */
export function renderReviews(root, { revealed = false } = {}) {
  if (!root) return;
  const items = list();
  root.innerHTML = items.length
    ? html`<section class="section section--light reviews" id="reviews">
        <div class="container">
          <header class="section-head">
            <p class="eyebrow" data-reveal>${t('rev.eyebrow')}</p>
            <h2 class="section-title" data-reveal>${t('rev.title')}</h2>
          </header>
          <div class="reviews__grid ${items.length === 1 ? 'reviews__grid--one' : ''}">${items.map((r, i) => reviewCard(r, i))}</div>
        </div>
      </section>`.value
    : '';
  if (revealed) root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
}

/** Markup for a project page: reviews that mention this project ('' when there are none). */
export function projectReviews(slug) {
  const items = list().filter((r) => r.project === slug);
  return items.length
    ? html`<section class="section section--light reviews reviews--case">
        <div class="container">
          <p class="eyebrow" data-reveal>${t('rev.client')}</p>
          <div class="reviews__grid reviews__grid--one">${items.map((r, i) => reviewCard(r, i, { withProject: false }))}</div>
        </div>
      </section>`
    : '';
}
