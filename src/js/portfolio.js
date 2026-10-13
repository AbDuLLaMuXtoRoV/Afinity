import { CATEGORIES, findMember, firstName, projects, team } from '../data/team.js';
import { caseVisual } from './case-visuals.js';
import { presetMember } from './contact-form.js';
import { html, safeUrl } from './html.js';
import { t, tr } from './i18n.js';
import { avatarInner, memberLink } from './team.js';

const REGULAR_PER_PAGE = 6; // two full rows of three under the featured projects
const BACKGROUNDS = ['green', 'ink', 'paper', 'grid'];

// Featured first, then newest; projects from the same year keep their order in the data file.
const sorted = projects
  .map((p, order) => ({ ...p, order }))
  .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.year - a.year || a.order - b.order);

const usedTypes = CATEGORIES.filter((c) => sorted.some((p) => p.category === c));
// The team filter only makes sense once projects list who built them
const hasCredits = sorted.some((p) => p.team.length);

const resultsList = (results) => {
  const list = tr(results);
  return list?.length
    ? html`<ul class="project__results">
        ${list.map((r) => html`<li><svg class="i"><use href="#check" /></svg>${r}</li>`)}
      </ul>`
    : '';
};

const teamCredits = (p) => {
  const members = p.team.map(findMember).filter(Boolean);
  return members.length
    ? html`<p class="credits project__team"><span class="credits__label mono">${t('credits.team')}</span>${members.map((m) =>
        memberLink(m),
      )}</p>`
    : '';
};

const shotLabel = (label, front) => `${label}: ${front ? t('feat.openFull') : t('feat.bringFront')}`;

/** Full-width showcase for a real project: 3D screenshot stack, optional phone fan, figures, details. */
function featuredCard(p) {
  const shots = (p.images ?? []).filter((img) => safeUrl(img.src));
  const phones = (p.phones ?? []).filter((img) => safeUrl(img.src)).slice(0, 4);
  const links = (p.links ?? []).filter((l) => safeUrl(l.href));
  const logo = safeUrl(p.logo);
  const highlights = (tr(p.highlights) ?? []).slice(0, 3);
  const features = tr(p.features) ?? [];
  const title = tr(p.title);
  return html`
    <article class="case project project--featured" data-category="${p.category}" data-team="${p.team.join(' ')}" tabindex="-1" data-reveal>
      <div class="feat">
        <div class="feat__stage ${phones.length ? 'feat__stage--duo' : ''}" data-showcase>
          <div class="feat__desk">
            <div class="feat__screens" data-screens>
              ${shots.map(
                (img, i) => html`<button class="shot" type="button" data-shot-card="${i}" data-label="${tr(img.label)}"
                  data-pos="${i === 0 ? 'front' : i === 1 ? 'right' : 'left'}" aria-label="${shotLabel(tr(img.label), i === 0)}">
                  <span class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span class="mono">${title} · ${tr(img.label)}</span></span>
                  <img class="shot__img" src="${img.src}" alt="${tr(img.alt)}" loading="lazy" decoding="async" />
                </button>`,
              )}
              <span class="feat__fallback case__visual case__visual--ink" aria-hidden="true">${caseVisual(p.visual?.type)}</span>
            </div>
            ${shots.length > 1
              ? html`<div class="feat__tabs" role="group" aria-label="${t('feat.screens')}">
                  ${shots.map(
                    (img, i) => html`<button class="feat__tab" type="button" data-shot="${i}" aria-pressed="${i === 0}">
                      <span class="mono">0${i + 1}</span>${tr(img.label)}
                    </button>`,
                  )}
                </div>`
              : ''}
          </div>
          ${phones.length
            ? html`<div class="feat__phones" data-phones>
                ${phones.map(
                  (img, i) => html`<button class="phone-shot" type="button" data-phone="${i}" data-slot="${i}"
                    data-label="${tr(img.label)}" aria-label="${shotLabel(tr(img.label), i === 0)}">
                    <img src="${img.src}" alt="${tr(img.alt)}" loading="lazy" decoding="async" />
                  </button>`,
                )}
              </div>`
            : ''}
          ${highlights.map(
            (h, i) => html`<span class="feat__chip feat__chip--${i + 1}" aria-hidden="true">
              <strong>${h.value}</strong><span class="mono">${h.label}</span>
            </span>`,
          )}
        </div>

        <div class="feat__info">
          <div class="feat__intro">
            <p class="feat__eyebrow mono">
              ${logo ? html`<img class="feat__logo" src="${logo}" alt="" width="30" height="30" />` : ''}
              ${t('feat.featured')} · ${p.year}
            </p>
            <h3 class="feat__title">${title}</h3>
            <p class="feat__tagline">${tr(p.tagline)}</p>
            <p class="project__client mono">${t(`cat.${p.category}`)} · ${tr(p.client)}</p>
            <p class="project__summary">${tr(p.summary)}</p>
            <ul class="tags project__tags">${p.tags.map((tag) => html`<li>${tr(tag)}</li>`)}</ul>
            ${links.length
              ? html`<div class="feat__links">
                  ${links.map(
                    (l, i) => html`<a class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'} btn--sm" href="${safeUrl(l.href)}"
                      target="_blank" rel="noopener noreferrer"><span>${tr(l.label)}</span><svg class="i"><use href="#arrow" /></svg></a>`,
                  )}
                </div>`
              : ''}
            ${teamCredits(p)}
          </div>
          <div class="feat__details">
            ${features.length ? html`<ul class="feat__features">${features.map((f) => html`<li>${f}</li>`)}</ul>` : ''}
            ${resultsList(p.results)}
          </div>
        </div>
      </div>
    </article>`;
}

function projectCard(p) {
  if (p.featured) return featuredCard(p);
  const image = safeUrl(p.image);
  const bg = BACKGROUNDS.includes(p.visual?.bg) ? p.visual.bg : 'ink';
  return html`
    <article class="case project" data-category="${p.category}" data-team="${p.team.join(' ')}" tabindex="-1" data-reveal>
      <div class="case__visual case__visual--${bg}" aria-hidden="true">
        ${image ? html`<img class="case__img" src="${image}" alt="" loading="lazy" decoding="async" />` : caseVisual(p.visual?.type)}
      </div>
      <div class="case__info">
        <h3>${tr(p.title)}</h3>
        <span class="case__year mono">${p.year}</span>
        <p class="project__client mono">${t(`cat.${p.category}`)} · ${tr(p.client)}</p>
      </div>
      <p class="project__summary">${tr(p.summary)}</p>
      ${resultsList(p.results)}
      <ul class="tags project__tags">${p.tags.map((tag) => html`<li>${tr(tag)}</li>`)}</ul>
      ${teamCredits(p)}
    </article>`;
}

function bannerMarkup(m) {
  const first = firstName(m.name);
  return html`
    <span class="pf-banner__avatar" aria-hidden="true">${avatarInner(m)}</span>
    <div class="pf-banner__text">
      <p class="pf-banner__title">${t('pf.by', { name: m.name })}</p>
      <p class="pf-banner__meta mono">${tr(m.role)} · <span class="${m.available ? 'is-on' : ''}">${tr(m.availability)}</span></p>
    </div>
    <div class="pf-banner__actions">
      <a class="btn btn--primary btn--sm" href="#contact" data-hire="${m.id}">
        <span>${t('pf.workWith', { name: first })}</span><svg class="i"><use href="#arrow" /></svg>
      </a>
      <button class="btn btn--ghost btn--sm" type="button" data-copy><span>${t('pf.copy')}</span></button>
      <button class="pf-banner__close" type="button" data-clear-member aria-label="${t('pf.clear')}"></button>
    </div>`;
}

function portfolioMarkup() {
  return html`
    <div class="pf-filters" data-reveal>
      <div class="pf-row" role="group" aria-label="${t('pf.filterType')}">
        <span class="pf-label mono">${t('pf.type')}</span>
        ${['all', ...usedTypes].map(
          (type) => html`<button class="filter" type="button" data-type="${type}" aria-pressed="false">
            ${type === 'all' ? t('pf.all') : t(`cat.${type}`)} <span class="mono" data-type-count></span>
          </button>`,
        )}
      </div>
      ${hasCredits
        ? html`<div class="pf-row" role="group" aria-label="${t('pf.filterTeam')}">
            <span class="pf-label mono">${t('pf.team')}</span>
            <button class="filter" type="button" data-member="" aria-pressed="false">${t('pf.everyone')}</button>
            ${team.map(
              (m) => html`<button class="filter filter--member" type="button" data-member="${m.id}" aria-pressed="false">
                <span class="credit__avatar" aria-hidden="true">${avatarInner(m)}</span>${firstName(m.name)}
              </button>`,
            )}
          </div>`
        : ''}
    </div>
    <div class="pf-banner" data-banner hidden></div>
    <p class="pf-count mono" data-pf-count aria-live="polite"></p>
    <div class="projects">${sorted.map(projectCard)}</div>
    <div class="pf-empty" data-empty hidden>
      <p>${t('pf.empty')}</p>
      <button class="btn btn--dark btn--sm" type="button" data-reset><span>${t('pf.reset')}</span></button>
    </div>
    <div class="pf-more" data-more-wrap>
      <button class="btn btn--dark" type="button" data-more><span></span><svg class="i"><use href="#arrow" /></svg></button>
    </div>`;
}

export function initPortfolio(root) {
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const state = {
    type: usedTypes.includes(params.get('type')) ? params.get('type') : 'all',
    member: findMember(params.get('member'))?.id ?? '',
    expanded: false,
  };

  let cards = [];
  let typeButtons = [];
  let memberButtons = [];
  let teardownGalleries = () => {};

  const matches = (card, type, member) =>
    (type === 'all' || card.dataset.category === type) && (!member || card.dataset.team.split(' ').includes(member));

  const syncUrl = () => {
    const url = new URL(window.location.href);
    state.member ? url.searchParams.set('member', state.member) : url.searchParams.delete('member');
    state.type !== 'all' ? url.searchParams.set('type', state.type) : url.searchParams.delete('type');
    if (state.member || state.type !== 'all') url.hash = 'portfolio';
    history.replaceState(null, '', url);
  };

  const apply = ({ updateUrl = true } = {}) => {
    const filtered = cards.filter((c) => matches(c, state.type, state.member));
    const limited = !state.expanded && state.type === 'all' && !state.member;
    const pageSize = cards.filter((c) => c.classList.contains('project--featured')).length + REGULAR_PER_PAGE;
    cards.forEach((c) => (c.hidden = true));
    filtered.forEach((c, i) => (c.hidden = limited && i >= pageSize));

    const shown = filtered.filter((c) => !c.hidden).length;
    root.querySelector('[data-pf-count]').textContent = t('pf.showing', { shown, total: cards.length });
    root.querySelector('[data-empty]').hidden = filtered.length > 0;
    const moreWrap = root.querySelector('[data-more-wrap]');
    moreWrap.hidden = !(limited && filtered.length > pageSize);
    moreWrap.querySelector('span').textContent = t('pf.showAll', { n: filtered.length });

    // Type counts follow the selected person; empty types are disabled
    typeButtons.forEach((b) => {
      const n = cards.filter((c) => matches(c, b.dataset.type, state.member)).length;
      b.querySelector('[data-type-count]').textContent = n;
      b.disabled = n === 0 && b.dataset.type !== 'all';
      b.setAttribute('aria-pressed', String(b.dataset.type === state.type));
    });
    memberButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.member === state.member)));

    const banner = root.querySelector('[data-banner]');
    const member = findMember(state.member);
    banner.hidden = !member;
    if (member) banner.innerHTML = bannerMarkup(member).value;

    if (updateUrl) syncUrl();
  };

  /** Builds (or rebuilds, e.g. after a language change) the whole portfolio, keeping the filters. */
  const render = ({ revealed = false } = {}) => {
    teardownGalleries();
    root.innerHTML = portfolioMarkup().value;
    cards = [...root.querySelectorAll('.project')];
    typeButtons = [...root.querySelectorAll('[data-type]')];
    memberButtons = [...root.querySelectorAll('[data-member]')];
    if (revealed) root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    teardownGalleries = initGalleries(root);
    apply({ updateUrl: false });
  };

  // Land on the filters and person bar rather than the section heading
  const scrollToFilters = () => {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  };

  /** Filters the portfolio to one person (used by team cards and credits anywhere on the page). */
  const showMember = (id) => {
    state.member = findMember(id)?.id ?? '';
    state.type = 'all';
    apply();
    scrollToFilters();
  };

  root.addEventListener('click', async (e) => {
    const type = e.target.closest('[data-type]');
    const member = e.target.closest('[data-member]');

    if (type) {
      state.type = type.dataset.type;
      apply();
    } else if (member) {
      state.member = member.dataset.member;
      if (state.type !== 'all' && !cards.some((c) => matches(c, state.type, state.member))) state.type = 'all';
      apply();
    } else if (e.target.closest('[data-more]')) {
      const firstHidden = cards.find((c) => c.hidden && matches(c, state.type, state.member));
      state.expanded = true;
      apply();
      firstHidden?.focus({ preventScroll: true });
    } else if (e.target.closest('[data-reset]')) {
      Object.assign(state, { type: 'all', member: '' });
      apply();
    } else if (e.target.closest('[data-clear-member]')) {
      state.member = '';
      apply();
      memberButtons[0]?.focus();
    } else if (e.target.closest('[data-hire]')) {
      presetMember(findMember(state.member));
    } else if (e.target.closest('[data-copy]')) {
      const label = e.target.closest('[data-copy]').querySelector('span');
      try {
        await navigator.clipboard.writeText(window.location.href);
        label.textContent = t('pf.copied');
      } catch {
        label.textContent = t('pf.copyFail');
      }
      setTimeout(() => (label.textContent = t('pf.copy')), 2400);
    }
  });

  // Team cards, "Built by" credits and project team chips all filter by person
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-show-member]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    showMember(link.dataset.showMember);
  });

  document.addEventListener('langchange', () => render({ revealed: true }));

  render();
}

// One shared full-size viewer for every showcase
let viewer;
function openViewer(img) {
  if (!viewer) {
    viewer = document.createElement('dialog');
    viewer.className = 'shot-viewer';
    viewer.innerHTML = html`<button class="shot-viewer__close" type="button"></button>
      <div class="shot-viewer__scroll"><img alt="" /></div>`.value;
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer || e.target.closest('.shot-viewer__close')) viewer.close();
    });
    document.body.append(viewer);
  }
  viewer.querySelector('.shot-viewer__close').setAttribute('aria-label', t('viewer.close'));
  const full = viewer.querySelector('img');
  full.src = img.currentSrc || img.src;
  full.alt = img.alt;
  viewer.classList.toggle('shot-viewer--portrait', img.naturalHeight > img.naturalWidth);
  viewer.showModal();
  viewer.querySelector('.shot-viewer__scroll').scrollTop = 0;
}

/**
 * 3D screenshot stack + phone fan: rotate on click / tabs / timer, tilt with the cursor, full-size viewer.
 * Returns a cleanup function (timers, observers, listeners) used before re-rendering.
 */
function initGalleries(root) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const cleanups = [];

  root.querySelectorAll('.feat__logo').forEach((logo) => {
    if (logo.complete && !logo.naturalWidth) logo.remove();
    else logo.addEventListener('error', () => logo.remove());
  });

  root.querySelectorAll('[data-showcase]').forEach((stage) => {
    const screens = stage.querySelector('[data-screens]');
    const tabs = [...stage.querySelectorAll('[data-shot]')];
    let cards = [...stage.querySelectorAll('[data-shot-card]')];
    let order = cards.map((_, i) => i); // order[0] is in front

    const layout = () => {
      const positions = ['front', 'right', 'left'];
      order.forEach((cardIndex, slot) => {
        const card = cards.find((c) => Number(c.dataset.shotCard) === cardIndex);
        if (!card) return;
        card.dataset.pos = positions[slot] ?? 'hidden';
        card.setAttribute('aria-label', shotLabel(card.dataset.label, slot === 0));
      });
      tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(Number(tab.dataset.shot) === order[0])));
    };

    const bringToFront = (index) => {
      if (order[0] === index) return;
      order = [index, ...order.filter((i) => i !== index)];
      layout();
    };

    // Screenshots that fail to load are dropped; with none left the mockup shows instead
    const drop = (card) => {
      const index = Number(card.dataset.shotCard);
      card.remove();
      cards = cards.filter((c) => c !== card);
      order = order.filter((i) => i !== index);
      tabs.forEach((tab) => (tab.hidden = Number(tab.dataset.shot) === index || tab.hidden || cards.length < 2));
      stage.classList.toggle('is-empty', cards.length === 0);
      layout();
    };
    cards.forEach((card) => {
      const img = card.querySelector('img');
      if (img.complete && img.getAttribute('src') && !img.naturalWidth) drop(card);
      else img.addEventListener('error', () => drop(card));
    });
    stage.classList.toggle('is-empty', cards.length === 0);
    layout();

    // ---- Phone fan (optional): same idea, portrait screenshots ----
    const fan = stage.querySelector('[data-phones]');
    let phones = fan ? [...fan.querySelectorAll('[data-phone]')] : [];
    let phoneOrder = phones.map((_, i) => i);
    const layoutPhones = () => {
      phoneOrder.forEach((index, slot) => {
        const phone = phones.find((ph) => Number(ph.dataset.phone) === index);
        if (!phone) return;
        phone.dataset.slot = slot;
        phone.setAttribute('aria-label', shotLabel(phone.dataset.label, slot === 0));
      });
    };
    phones.forEach((phone) => {
      const img = phone.querySelector('img');
      const dropPhone = () => {
        phone.remove();
        phones = phones.filter((ph) => ph !== phone);
        phoneOrder = phoneOrder.filter((i) => i !== Number(phone.dataset.phone));
        layoutPhones();
      };
      if (img.complete && img.getAttribute('src') && !img.naturalWidth) dropPhone();
      else img.addEventListener('error', dropPhone);
    });

    // ---- Auto-rotate every few seconds while visible and not being interacted with ----
    let timer = 0;
    let visible = false;
    let paused = false;
    const tick = () => {
      if (cards.length > 1) {
        order = [...order.slice(1), order[0]];
        layout();
      }
      if (phones.length > 1) {
        phoneOrder = [...phoneOrder.slice(1), phoneOrder[0]];
        layoutPhones();
      }
    };
    const restartTimer = () => {
      clearInterval(timer);
      timer = 0;
      if (!reduceMotion && visible && !paused && !document.hidden && (cards.length > 1 || phones.length > 1)) {
        timer = setInterval(tick, 4500);
      }
    };

    stage.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-shot]');
      const card = e.target.closest('[data-shot-card]');
      const phone = e.target.closest('[data-phone]');
      if (tab) bringToFront(Number(tab.dataset.shot));
      else if (card) {
        if (card.dataset.pos === 'front') openViewer(card.querySelector('img'));
        else bringToFront(Number(card.dataset.shotCard));
      } else if (phone) {
        const index = Number(phone.dataset.phone);
        if (phoneOrder[0] === index) openViewer(phone.querySelector('img'));
        else {
          phoneOrder = [index, ...phoneOrder.filter((i) => i !== index)];
          layoutPhones();
        }
      }
      restartTimer();
    });

    // Gentle tilt toward the cursor (desktop only)
    if (finePointer && !reduceMotion) {
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        screens.style.setProperty('--tilt-y', `${(x * 6).toFixed(2)}deg`);
        screens.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
      });
      stage.addEventListener('pointerleave', () => {
        screens.style.removeProperty('--tilt-y');
        screens.style.removeProperty('--tilt-x');
      });
    }

    stage.addEventListener('pointerenter', () => ((paused = true), restartTimer()));
    stage.addEventListener('pointerleave', () => ((paused = false), restartTimer()));
    stage.addEventListener('focusin', () => ((paused = true), restartTimer()));
    stage.addEventListener('focusout', () => ((paused = false), restartTimer()));
    document.addEventListener('visibilitychange', restartTimer);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        stage.classList.toggle('is-visible', visible);
        restartTimer();
      },
      { threshold: 0.35 },
    );
    observer.observe(stage);

    cleanups.push(() => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', restartTimer);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
