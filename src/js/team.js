import { firstName, initials, projectsBy, team } from '../data/team.js';
import { html, safeUrl } from './html.js';
import { photoSrcset } from './images.js';
import { t, tr } from './i18n.js';

/** Photo if the member has one, otherwise their initials. */
export function avatarInner(member) {
  const photo = safeUrl(member.photo);
  return photo
    ? html`<img class="avatar__img" src="${photo}" srcset="${photoSrcset(photo)}" sizes="(max-width: 640px) 92vw, 30vw"
        width="900" height="900" alt="" loading="lazy" decoding="async" />`
    : html`<span class="avatar__initials">${initials(member.name)}</span>`;
}

/** Link to the projects page filtered to one person. */
export function memberLink(member, { label = member.name, className = 'credit' } = {}) {
  return html`<a class="${className}" href="/projects.html?member=${member.id}">
    <span class="credit__avatar" aria-hidden="true">${avatarInner(member)}</span>${label}
  </a>`;
}

export function memberCard(member, index = 0) {
  const count = projectsBy(member.id).length;
  // With credited projects the card opens their projects; without any it opens the contact form for this person
  const link = count
    ? html`href="/projects.html?member=${member.id}"`
    : html`href="#contact" data-contact-member="${member.id}"`;
  return html`
    <a class="member" ${link} data-reveal style="--d: ${(index % 4) * 0.08}s">
      <span class="member__tile">
        ${avatarInner(member)}
        <svg class="member__mark" aria-hidden="true"><use href="#mark" /></svg>
        <span class="member__status mono ${member.available ? 'is-on' : ''}">${member.available ? t('team.available') : t('team.booked')}</span>
        <span class="member__slash" aria-hidden="true"></span>
      </span>
      <span class="case__go" aria-hidden="true"><svg class="i"><use href="#arrow" /></svg></span>
      <span class="member__info">
        <h3 class="member__name">${member.name}</h3>
        <span class="member__role mono">${tr(member.role)}</span>
        <span class="tags member__skills">${member.skills.slice(0, 3).map((s) => html`<span>${tr(s)}</span>`)}</span>
        <span class="member__more">
          ${count
            ? html`${t('team.seeProjects')} <span class="mono">· ${count}</span>`
            : t('pf.workWith', { name: firstName(member.name) })}
          <svg class="i"><use href="#arrow" /></svg>
        </span>
      </span>
    </a>`;
}

export function renderTeamGrid(el, { revealed = false } = {}) {
  if (!el) return;
  el.innerHTML = team.map((m, i) => memberCard(m, i).value).join('');
  if (revealed) el.querySelectorAll('[data-reveal]').forEach((card) => card.classList.add('is-in'));
}
