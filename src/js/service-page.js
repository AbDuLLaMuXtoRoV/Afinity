// Service pages (/services/<slug>.html): what you get, how we work, related projects and FAQ,
// rendered from src/data/services.js. The page's slug is set on <body data-service="…">.
import { PRODUCTS } from '../data/pricing.js';
import { findService, services } from '../data/services.js';
import { findProject } from '../data/team.js';
import { goal } from './analytics.js';
import { prefillContact } from './contact-form.js';
import { formatUsd } from './estimator.js';
import { html, safeUrl } from './html.js';
import { PHONE_SIZE, SHOT_SIZE, phoneSrcset, shotSrcset } from './images.js';
import { t, tr } from './i18n.js';

const pad = (n) => String(n).padStart(2, '0');

const sectionHead = (num, eyebrowKey, title, lead = '') => html`
  <header class="section-head">
    <p class="eyebrow eyebrow--num" data-reveal><span>${num}</span> ${t(eyebrowKey)}</p>
    <h2 class="section-title" data-reveal>${title}</h2>
    ${lead ? html`<p class="section-lead" data-reveal>${lead}</p>` : ''}
  </header>`;

function projectCard(p, i, withPhone = false) {
  const shot = (p.images ?? []).find((img) => safeUrl(img.src));
  // On the mobile apps page, an app screen in front of the admin screen
  const phone = withPhone ? (p.phones ?? []).find((img) => safeUrl(img.src)) : null;
  return html`
    <a class="svc-project" href="/project.html?p=${encodeURIComponent(p.slug)}" data-reveal style="--d: ${i * 0.08}s">
      <span class="svc-project__shot" aria-hidden="true">
        ${shot
          ? html`<img src="${shot.src}" srcset="${shotSrcset(shot.src)}" sizes="(max-width: 700px) 100vw, 33vw"
              width="${SHOT_SIZE.width}" height="${SHOT_SIZE.height}" alt="" loading="lazy" decoding="async" />`
          : ''}
        ${phone
          ? html`<img class="svc-project__phone" src="${phone.src}" srcset="${phoneSrcset(phone.src)}" sizes="120px"
              width="${PHONE_SIZE.width}" height="${PHONE_SIZE.height}" alt="" loading="lazy" decoding="async" />`
          : ''}
      </span>
      <span class="svc-project__info">
        <span class="mono">${t(`cat.${p.category}`)} · ${p.year}</span>
        <strong>${tr(p.title)}</strong>
        <span>${tr(p.tagline)}</span>
      </span>
      <span class="case__go" aria-hidden="true"><svg class="i"><use href="#arrow" /></svg></span>
    </a>`;
}

function serviceMarkup(s) {
  const title = tr(s.title);
  const price = PRODUCTS[s.product];
  const related = s.projects.map(findProject).filter((p) => p?.slug);
  const others = services.filter((o) => o !== s);
  let num = 0;
  const n = () => pad(++num);

  return html`
    <section class="svc-hero">
      <div class="container svc-hero__grid">
        <div>
          <nav class="svc-crumbs mono" aria-label="${t('svcp.crumbs')}">
            <a href="/#services">${t('nav.services')}</a><span aria-hidden="true">/</span><span>${title}</span>
          </nav>
          <h1 class="svc-hero__title" data-reveal>${title}</h1>
          <p class="svc-hero__lead" data-reveal>${tr(s.lead)}</p>
          <div class="svc-hero__actions" data-reveal>
            <button class="btn btn--primary" type="button" data-svc-start>
              <span>${t('nav.cta')}</span><svg class="i"><use href="#arrow" /></svg>
            </button>
            <a class="btn btn--ghost" href="/?est=${s.product}#estimate"><span>${t('work.next.estimate')}</span></a>
          </div>
        </div>

        <aside class="svc-spec" data-reveal style="--d: 0.12s">
          <p class="svc-spec__label mono">${t('svcp.spec')}</p>
          ${price
            ? html`<dl>
                <div><dt class="mono">${t('svcp.from')}</dt><dd class="svc-spec__price">${formatUsd(price.min)}</dd></div>
                <div><dt class="mono">${t('est.timeline')}</dt><dd>${t('est.weeks', { a: price.weeks[0], b: price.weeks[1] })}</dd></div>
                <div><dt class="mono">${t('case.stack')}</dt><dd><ul class="tags">${s.stack.map((x) => html`<li>${x}</li>`)}</ul></dd></div>
              </dl>`
            : ''}
          <p class="svc-spec__note">${t('svcp.specNote')}</p>
        </aside>
      </div>
    </section>

    <section class="section section--light">
      <div class="container">
        ${sectionHead(n(), 'svcp.get.eyebrow', t('svcp.get.title'))}
        <ol class="svc-gets">
          ${s.deliverables.map(
            (d, i) => html`<li class="svc-get" data-reveal style="--d: ${(i % 3) * 0.06}s">
              <span class="svc-get__num mono">${pad(i + 1)}</span>
              <h3>${tr(d.title)}</h3>
              <p>${tr(d.text)}</p>
            </li>`,
          )}
        </ol>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        ${sectionHead(n(), 'process.eyebrow', t('svcp.how.title'), t('process.lead'))}
        <ol class="svc-steps">
          ${[1, 2, 3, 4].map(
            (i) => html`<li class="svc-step" data-reveal style="--d: ${(i - 1) * 0.07}s">
              <span class="svc-step__top mono"><span>${pad(i)}</span><span>${t(`step${i}.time`)}</span></span>
              <h3>${t(`step${i}.title`)}</h3>
              <p>${t(`step${i}.text`)}</p>
            </li>`,
          )}
        </ol>
      </div>
    </section>

    ${related.length
      ? html`<section class="section section--light">
          <div class="container">
            ${sectionHead(n(), 'nav.portfolio', t('svcp.projects.title'))}
            <div class="svc-projects">${related.map((p, i) => projectCard(p, i, s.product === 'mobile'))}</div>
            <a class="link-arrow svc-projects__all" href="/projects.html"><span>${t('case.back')}</span><svg class="i"><use href="#arrow" /></svg></a>
          </div>
        </section>`
      : ''}

    <section class="section section--light svc-faq">
      <div class="container faq">
        ${sectionHead(n(), 'faq.eyebrow', t('svcp.faq.title'))}
        <div class="faq__list">
          ${s.faq.map(
            (item) => html`<details class="qa" data-reveal>
              <summary><span>${tr(item.q)}</span><span class="qa__icon" aria-hidden="true"></span></summary>
              <div class="qa__body"><p>${tr(item.a)}</p></div>
            </details>`,
          )}
        </div>
      </div>
    </section>

    <nav class="svc-others" aria-label="${t('svcp.others')}">
      <div class="container">
        <p class="mono">${t('svcp.others')}</p>
        <div class="svc-others__list">
          ${others.map(
            (o) => html`<a href="/services/${o.slug}.html">
              <strong>${tr(o.title)}</strong><svg class="i" aria-hidden="true"><use href="#arrow" /></svg>
            </a>`,
          )}
        </div>
      </div>
    </nav>`;
}

/** Search engines read the service and its questions from structured data. */
function structuredData(s) {
  let el = document.getElementById('svc-ld');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'svc-ld';
    document.head.append(el);
  }
  el.textContent = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: tr(s.title),
      description: tr(s.lead),
      areaServed: 'UZ',
      provider: { '@type': 'Organization', name: 'Afinity', telephone: '+998935770488' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: s.faq.map((item) => ({
        '@type': 'Question',
        name: tr(item.q),
        acceptedAnswer: { '@type': 'Answer', text: tr(item.a) },
      })),
    },
  ]);
}

export function renderService(root, { revealed = false } = {}) {
  if (!root) return;
  const s = findService(document.body.dataset.service);
  if (!s) return;
  root.innerHTML = serviceMarkup(s).value;
  if (revealed) root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));

  document.title = tr(s.seoTitle);
  document.querySelector('meta[name="description"]')?.setAttribute('content', tr(s.lead));
  structuredData(s);

  if (!root.dataset.bound) {
    root.dataset.bound = 'true';
    root.addEventListener('click', (e) => {
      if (!e.target.closest('[data-svc-start]')) return;
      goal('start_project', { from: s.slug });
      prefillContact({ services: [s.product], message: t('svcp.msg', { service: tr(s.title) }) });
    });
  }
}
