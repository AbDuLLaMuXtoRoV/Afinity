// Projects page (projects.html): every project as a large row linking to its own page.
// Rendered from src/data/team.js, so a new project there appears here automatically.
import { CATEGORIES, findMember, projects } from '../data/team.js';
import { html, raw, safeUrl } from './html.js';
import { PHONE_SIZE, SHOT_SIZE, phoneSrcset, shotSrcset } from './images.js';
import { t, tr } from './i18n.js';

// Newest first; projects from the same year keep their order in the data file
const sorted = projects
  .map((p, order) => ({ ...p, order }))
  .sort((a, b) => b.year - a.year || a.order - b.order);
const usedTypes = CATEGORIES.filter((c) => sorted.some((p) => p.category === c));
const pad = (n) => String(n).padStart(2, '0');

const PLATFORMS = ['Android', 'iOS', 'Web'];
const platforms = PLATFORMS.filter((name) =>
  sorted.some((p) => p.tags.some((tag) => String(tr(tag)).toLowerCase().includes(name.toLowerCase()))),
);

// Screens fill most of the row: about the full width on phones, half of it on wide screens
const SHOT_SIZES = '(max-width: 959px) 92vw, 55vw';

const projectUrl = (p) => (p.slug ? `/project.html?p=${encodeURIComponent(p.slug)}` : '');

/** Desktop screenshot with a phone in front of it (or a second screen when there are no phone shots). */
function visual(p) {
  const [main, second] = (p.images ?? []).filter((img) => safeUrl(img.src));
  const phone = (p.phones ?? []).find((img) => safeUrl(img.src));
  return html`
    <div class="wk__visual" aria-hidden="true">
      <span class="wk__beam"></span>
      ${!phone && second
        ? html`<span class="wk__frame wk__frame--back"><img src="${second.src}" srcset="${shotSrcset(second.src)}" sizes="${SHOT_SIZES}"
            width="${SHOT_SIZE.width}" height="${SHOT_SIZE.height}" alt="" loading="lazy" decoding="async" /></span>`
        : ''}
      ${main
        ? html`<span class="wk__frame">
            <span class="shot__bar"><i></i><i></i><i></i><span class="mono">${tr(p.title)} · ${tr(main.label)}</span></span>
            <img src="${main.src}" srcset="${shotSrcset(main.src)}" sizes="${SHOT_SIZES}"
              width="${SHOT_SIZE.width}" height="${SHOT_SIZE.height}" alt="" loading="lazy" decoding="async" />
          </span>`
        : ''}
      ${phone
        ? html`<span class="wk__phone"><img src="${phone.src}" srcset="${phoneSrcset(phone.src)}" sizes="(max-width: 959px) 22vw, 12vw"
            width="${PHONE_SIZE.width}" height="${PHONE_SIZE.height}" alt="" loading="lazy" decoding="async" /></span>`
        : ''}
    </div>`;
}

function row(p, i) {
  const url = projectUrl(p);
  const logo = safeUrl(p.logo);
  const highlights = (tr(p.highlights) ?? []).slice(0, 2);
  const tag = url ? 'a' : 'article';
  return html`
    <${raw(tag)} class="wk" ${url ? raw(`href="${url}"`) : ''} id="${p.slug ?? ''}" data-category="${p.category}"
      data-team="${p.team.join(' ')}" data-reveal>
      ${visual(p)}
      <div class="wk__info">
        <p class="wk__meta mono">
          <span class="wk__num">${pad(i + 1)}</span>
          ${logo ? html`<img class="wk__logo" src="${logo}" alt="" width="26" height="26" />` : ''}
          ${t(`cat.${p.category}`)} · ${p.year}
        </p>
        <h2 class="wk__title">${tr(p.title)}</h2>
        <p class="wk__tagline">${tr(p.tagline)}</p>
        <p class="wk__client mono">${tr(p.client)}</p>
        ${highlights.length
          ? html`<dl class="wk__figures">
              ${highlights.map((h) => html`<div><dt>${h.value}</dt><dd class="mono">${h.label}</dd></div>`)}
            </dl>`
          : ''}
        <ul class="tags wk__tags">${p.tags.slice(0, 4).map((tg) => html`<li>${tr(tg)}</li>`)}</ul>
        ${url ? html`<span class="wk__more"><span>${t('feat.viewProject')}</span><svg class="i"><use href="#arrow" /></svg></span>` : ''}
      </div>
    </${raw(tag)}>`;
}

function workMarkup() {
  return html`
    <section class="work-hero">
      <div class="container">
        <p class="eyebrow eyebrow--num" data-reveal><span>01</span> ${t('work.eyebrow')}</p>
        <h1 class="work-hero__title" data-reveal>${raw(t('work.title'))}</h1>
        <div class="work-hero__row">
          <p class="work-hero__lead" data-reveal>${t('work.lead')}</p>
          <dl class="work-stats" data-reveal style="--d: 0.1s">
            <div><dt>${pad(sorted.length)}</dt><dd class="mono">${t('work.stat.projects')}</dd></div>
            ${platforms.length ? html`<div><dt>${platforms.join(' · ')}</dt><dd class="mono">${t('work.stat.platforms')}</dd></div>` : ''}
            <div><dt>${t('work.stat.city')}</dt><dd class="mono">${t('work.stat.based')}</dd></div>
          </dl>
        </div>
        <nav class="work-index" aria-label="${t('work.index')}" data-reveal style="--d: 0.15s">
          ${sorted.map(
            (p, i) => html`<a href="#${p.slug ?? ''}" data-index="${p.category}" data-team="${p.team.join(' ')}">
              <span class="mono">${pad(i + 1)}</span><strong>${tr(p.title)}</strong><em>${tr(p.tagline)}</em>
            </a>`,
          )}
        </nav>
      </div>
    </section>

    <section class="work-list">
      <div class="container">
        ${usedTypes.length > 1
          ? html`<div class="work-filters" role="group" aria-label="${t('pf.filterType')}" data-reveal>
              ${['all', ...usedTypes].map(
                (type) => html`<button class="filter" type="button" data-type="${type}" aria-pressed="${type === 'all'}">
                  ${type === 'all' ? t('pf.all') : t(`cat.${type}`)}
                  <span class="mono">${type === 'all' ? sorted.length : sorted.filter((p) => p.category === type).length}</span>
                </button>`,
              )}
            </div>`
          : ''}
        <div class="work-by" data-work-by hidden></div>
        <div class="wk-list">${sorted.map(row)}</div>
        <p class="work-empty" data-work-empty hidden>${t('pf.empty')}</p>

        <div class="wk-next" data-reveal>
          <span class="wk-next__plus" aria-hidden="true"></span>
          <div>
            <h2 class="wk-next__title">${raw(t('work.next.title'))}</h2>
            <p>${t('work.next.text')}</p>
          </div>
          <div class="wk-next__actions">
            <a class="btn btn--primary" href="#contact"><span>${t('nav.cta')}</span><svg class="i"><use href="#arrow" /></svg></a>
            <a class="btn btn--dark" href="/#estimate"><span>${t('work.next.estimate')}</span><svg class="i"><use href="#arrow" /></svg></a>
          </div>
        </div>
      </div>
    </section>`;
}

let currentType = 'all';
let currentMember = null; // team member from ?member=<id> (team cards link here)

function applyFilter(root) {
  for (const btn of root.querySelectorAll('[data-type]')) btn.setAttribute('aria-pressed', String(btn.dataset.type === currentType));
  let shown = 0;
  for (const el of root.querySelectorAll('.wk, [data-index]')) {
    const category = el.dataset.category ?? el.dataset.index;
    const byMember = !currentMember || el.dataset.team.split(' ').includes(currentMember.id);
    el.hidden = (currentType !== 'all' && category !== currentType) || !byMember;
    if (!el.hidden && el.classList.contains('wk')) shown++;
  }
  root.querySelector('[data-work-empty]').hidden = shown > 0;

  const by = root.querySelector('[data-work-by]');
  by.hidden = !currentMember;
  by.innerHTML = currentMember
    ? html`<span>${t('pf.by', { name: currentMember.name })}</span>
        <button type="button" data-clear-member aria-label="${t('pf.clear')}">${t('pf.everyone')} ×</button>`.value
    : '';
}

export function renderWork(root, { revealed = false } = {}) {
  if (!root) return;
  if (!root.dataset.bound) {
    const params = new URLSearchParams(window.location.search);
    if (usedTypes.includes(params.get('type'))) currentType = params.get('type');
    currentMember = findMember(params.get('member'));
  }
  root.innerHTML = workMarkup().value;
  if (revealed) root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  applyFilter(root);

  document.title = t('work.metaTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('work.lead'));

  if (!root.dataset.bound) {
    root.dataset.bound = 'true';
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-type]');
      const clear = e.target.closest('[data-clear-member]');
      if (!btn && !clear) return;
      if (btn) currentType = btn.dataset.type;
      if (clear) currentMember = null;
      applyFilter(root);
      // Filtered rows are already in view: show them without waiting for the scroll reveal
      root.querySelectorAll('.wk:not([hidden])').forEach((el) => el.classList.add('is-in'));
      const url = new URL(window.location.href);
      if (currentType === 'all') url.searchParams.delete('type');
      else url.searchParams.set('type', currentType);
      if (!currentMember) url.searchParams.delete('member');
      history.replaceState(null, '', url);
    });
  }
}
