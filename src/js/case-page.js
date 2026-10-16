// Project page (project.html?p=<slug>): the problem, what was built, screens and results,
// rendered from the same data as the portfolio (src/data/team.js).
import { findMember, findProject, projects } from '../data/team.js';
import { goal } from './analytics.js';
import { prefillContact } from './contact-form.js';
import { projectReviews } from './reviews.js';
import { html, safeUrl } from './html.js';
import { PHONE_SIZE, SHOT_SIZE, phoneSrcset, shotSrcset } from './images.js';
import { t, tr } from './i18n.js';
import { memberLink } from './team.js';
import { openViewer } from './viewer.js';

const withPages = projects.filter((p) => p.slug);
const pad = (n) => String(n).padStart(2, '0');

/** Contact-form services that match a project (its category plus what its tags mention). */
function servicesFor(p) {
  const tags = p.tags.map((tag) => String(tr(tag)).toLowerCase());
  const services = new Set([p.category === 'web' ? 'website' : p.category]);
  if (tags.some((tag) => tag.includes('admin'))) services.add('admin');
  if (tags.some((tag) => tag.includes('telegram bot'))) services.add('bot');
  return [...services];
}

const sectionHead = (num, eyebrowKey, titleKey, ink = false) => html`
  <header class="case-head">
    <p class="eyebrow eyebrow--num${ink ? ' eyebrow--ink' : ''}" data-reveal><span>${num}</span> ${t(eyebrowKey)}</p>
    <h2 class="section-title" data-reveal>${t(titleKey)}</h2>
  </header>`;

const shot = (img, title, cls = '', sizes = '(max-width: 959px) 100vw, 50vw') => html`
  <button class="case-shot ${cls}" type="button" data-case-shot aria-label="${tr(img.label)}: ${t('feat.openFull')}">
    <span class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span class="mono">${title} · ${tr(img.label)}</span></span>
    <img src="${img.src}" srcset="${shotSrcset(img.src)}" sizes="${sizes}" width="${SHOT_SIZE.width}" height="${SHOT_SIZE.height}"
      alt="${tr(img.alt)}" loading="lazy" decoding="async" />
  </button>`;

function caseMarkup(p) {
  const title = tr(p.title);
  const logo = safeUrl(p.logo);
  const links = (p.links ?? []).filter((l) => safeUrl(l.href));
  const shots = (p.images ?? []).filter((img) => safeUrl(img.src));
  const phones = (p.phones ?? []).filter((img) => safeUrl(img.src));
  const features = tr(p.features) ?? [];
  const results = tr(p.results) ?? [];
  const highlights = tr(p.highlights) ?? [];
  const credits = p.team.map(findMember).filter(Boolean);
  const next = withPages[(withPages.indexOf(p) + 1) % withPages.length];
  let num = 0;
  const n = () => pad(++num);

  return html`
    <section class="case-hero">
      <div class="container">
        <a class="case-back mono" href="/projects.html"><svg class="i" aria-hidden="true"><use href="#arrow" /></svg>${t('case.back')}</a>
        <p class="case-hero__eyebrow mono" data-reveal>
          ${logo ? html`<img class="case-hero__logo" src="${logo}" alt="" width="34" height="34" />` : ''}
          ${t('case.eyebrow')} · ${t(`cat.${p.category}`)} · ${p.year}
        </p>
        <h1 class="case-hero__title" data-reveal>${title}</h1>
        <p class="case-hero__tagline" data-reveal>${tr(p.tagline)}</p>
        <dl class="case-meta" data-reveal>
          <div><dt class="mono">${t('case.client')}</dt><dd>${tr(p.client)}</dd></div>
          <div><dt class="mono">${t('case.stack')}</dt><dd>${p.tags.map((tag) => tr(tag)).join(' · ')}</dd></div>
          ${credits.length ? html`<div><dt class="mono">${t('credits.team')}</dt><dd class="case-meta__team">${credits.map((m) => memberLink(m))}</dd></div>` : ''}
        </dl>
        <div class="case-hero__actions" data-reveal>
          <button class="btn btn--primary" type="button" data-case-similar>
            <span>${t('case.similar')}</span><svg class="i"><use href="#arrow" /></svg>
          </button>
          ${links.map(
            (l) => html`<a class="btn btn--ghost" href="${safeUrl(l.href)}" target="_blank" rel="noopener noreferrer">
              <span>${tr(l.label)}</span><svg class="i"><use href="#arrow" /></svg></a>`,
          )}
        </div>
        ${shots[0] ? html`<div class="case-hero__shot" data-reveal style="--d: 0.15s">${shot(shots[0], title, 'case-shot--hero', '(max-width: 1320px) 100vw, 1240px')}</div>` : ''}
      </div>
    </section>

    ${p.challenge
      ? html`<section class="section section--light case-block">
          <div class="container case-split">
            ${sectionHead(n(), 'case.challenge.eyebrow', 'case.challenge.title')}
            <div class="case-text">
              <p class="case-text__lead" data-reveal>${tr(p.challenge)}</p>
              <h3 class="case-text__sub mono" data-reveal>${t('case.solution')}</h3>
              <p data-reveal>${tr(p.summary)}</p>
            </div>
          </div>
        </section>`
      : ''}

    ${features.length
      ? html`<section class="section section--dark case-block">
          <div class="container">
            ${sectionHead(n(), 'case.built.eyebrow', 'case.built.title')}
            <ol class="case-features">
              ${features.map(
                (f, i) => html`<li class="case-feature" data-reveal style="--d: ${(i % 3) * 0.06}s">
                  <span class="case-feature__num mono">${pad(i + 1)}</span><p>${f}</p>
                </li>`,
              )}
            </ol>
          </div>
        </section>`
      : ''}

    ${shots.length > 1 || phones.length
      ? html`<section class="section section--light case-block">
          <div class="container">
            ${sectionHead(n(), 'case.screens.eyebrow', 'case.screens.title')}
            ${shots.length > 1
              ? html`<div class="case-gallery">${shots.slice(1).map((img) => html`<div data-reveal>${shot(img, title)}</div>`)}</div>`
              : ''}
            ${phones.length
              ? html`<div class="case-phones">
                  ${phones.map(
                    (img, i) => html`<button class="case-phone" type="button" data-case-shot data-reveal style="--d: ${i * 0.06}s"
                      aria-label="${tr(img.label)}: ${t('feat.openFull')}">
                      <img src="${img.src}" srcset="${phoneSrcset(img.src)}" sizes="(max-width: 959px) 45vw, 260px"
                        width="${PHONE_SIZE.width}" height="${PHONE_SIZE.height}" alt="${tr(img.alt)}" loading="lazy" decoding="async" />
                      <span class="mono">${tr(img.label)}</span>
                    </button>`,
                  )}
                </div>`
              : ''}
          </div>
        </section>`
      : ''}

    ${results.length || highlights.length
      ? html`<section class="section section--dark case-block">
          <div class="container">
            ${sectionHead(n(), 'case.results.eyebrow', 'case.results.title')}
            ${highlights.length
              ? html`<div class="case-stats">
                  ${highlights.map(
                    (h, i) => html`<div class="case-stat" data-reveal style="--d: ${i * 0.08}s">
                      <strong>${h.value}</strong><span class="mono">${h.label}</span>
                    </div>`,
                  )}
                </div>`
              : ''}
            ${results.length
              ? html`<ul class="project__results case-results">
                  ${results.map((r) => html`<li data-reveal><svg class="i"><use href="#check" /></svg>${r}</li>`)}
                </ul>`
              : ''}
          </div>
        </section>`
      : ''}

    ${projectReviews(p.slug)}

    ${next && next !== p
      ? html`<a class="case-next" href="/project.html?p=${encodeURIComponent(next.slug)}">
          <span class="container case-next__inner">
            <span class="mono">${t('case.next')}</span>
            <span class="case-next__title">${tr(next.title)}<svg class="i" aria-hidden="true"><use href="#arrow" /></svg></span>
            <span class="case-next__tagline">${tr(next.tagline)}</span>
          </span>
        </a>`
      : ''}`;
}

const notFoundMarkup = () => html`
  <section class="case-hero case-hero--missing">
    <div class="container">
      <h1 class="case-hero__title">${t('case.notFound')}</h1>
      <p class="case-hero__tagline">${t('case.notFoundText')}</p>
      <div class="case-hero__actions">
        <a class="btn btn--primary" href="/projects.html"><span>${t('case.back')}</span><svg class="i"><use href="#arrow" /></svg></a>
      </div>
    </div>
  </section>`;

export function renderCase(root, { revealed = false } = {}) {
  if (!root) return;
  const p = findProject(new URLSearchParams(window.location.search).get('p'));
  root.innerHTML = (p ? caseMarkup(p) : notFoundMarkup()).value;
  if (revealed) root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));

  document.title = p ? t('case.metaTitle', { title: tr(p.title) }) : t('case.notFound');
  if (p) document.querySelector('meta[name="description"]')?.setAttribute('content', tr(p.tagline));

  if (!root.dataset.bound) {
    root.dataset.bound = 'true';
    root.addEventListener('click', (e) => {
      const shotBtn = e.target.closest('[data-case-shot]');
      if (shotBtn) openViewer(shotBtn.querySelector('img'));
      if (e.target.closest('[data-case-similar]')) {
        const project = findProject(new URLSearchParams(window.location.search).get('p'));
        if (project) goal('start_project', { from: project.slug });
        if (project) prefillContact({ services: servicesFor(project), message: t('case.similarMsg', { title: tr(project.title) }) });
      }
    });
  }
}
