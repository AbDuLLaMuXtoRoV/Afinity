import { findMember, firstName, team } from '../data/team.js';
import { getLang, t, tr } from './i18n.js';
import { validateContact } from './validation.js';

const CONTACT_EMAIL = 'hello@afinity.com';
// Requests go to this site's /api/contact (forwarded to Telegram, see server/contact-api.js).
// VITE_CONTACT_ENDPOINT in .env can point it at another backend.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';
const VALIDATED_FIELDS = ['name', 'email', 'member', 'message'];
const MEMBER_IDS = team.map((m) => m.id);
const LANGUAGE_NAMES = { en: 'English', ru: 'Русский', uz: 'O‘zbekcha' };

// The team member requested via ?with=<id> or the portfolio; restored after each reset.
let presetId = '';

export function initContactForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const status = form.querySelector('.form__status');
  const submit = form.querySelector('[type="submit"]');
  const memberSelect = form.elements.member;
  let attempted = false;
  let lastStatus = null; // { key, vars, kind }, re-translated when the language changes

  const fillMemberOptions = () => {
    if (!memberSelect) return;
    const selected = memberSelect.value;
    [...memberSelect.options].filter((o) => o.value).forEach((o) => o.remove());
    for (const m of team) memberSelect.add(new Option(`${m.name}, ${tr(m.role)}`, m.id));
    memberSelect.value = selected;
  };
  fillMemberOptions();

  const fromUrl = findMember(new URLSearchParams(window.location.search).get('with'));
  if (fromUrl) presetMember(fromUrl);

  const read = () => {
    const fd = new FormData(form);
    return {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      member: String(fd.get('member') ?? ''),
      services: fd.getAll('services').map(String),
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''), // honeypot
    };
  };

  const setStatus = (key, kind = '', vars) => {
    lastStatus = key ? { key, kind, vars } : null;
    status.textContent = key ? t(key, vars) : '';
    status.className = `form__status${kind ? ` is-${kind}` : ''}`;
  };

  const showErrors = (errors) => {
    for (const field of VALIDATED_FIELDS) {
      const input = form.elements[field];
      const error = form.querySelector(`#f-${field}-err`);
      if (!input || !error) continue;
      if (errors[field]) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', error.id);
        error.textContent = errors[field];
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        error.textContent = '';
      }
    }
  };

  const validate = (data) => validateContact(data, { memberIds: MEMBER_IDS, t });

  const resetForm = () => {
    form.reset();
    if (memberSelect) memberSelect.value = presetId;
  };

  form.addEventListener('input', () => {
    if (attempted) showErrors(validate(read()).errors);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    const data = read();
    const { valid, errors } = validate(data);
    showErrors(errors);

    if (!valid) {
      setStatus('form.status.check', 'error');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    // Bots fill the hidden field; pretend success and drop it.
    if (data.website) {
      resetForm();
      setStatus('form.status.thanks', 'success');
      return;
    }

    submit.disabled = true;
    setStatus('form.status.sending');
    try {
      const { website, ...payload } = data;
      const member = findMember(payload.member);
      const result = await send({ ...payload, memberName: member?.name ?? '', language: getLang() });
      resetForm();
      attempted = false;
      setStatus(result === 'mailto' ? 'form.status.mailto' : 'form.status.thanks', 'success');
    } catch {
      setStatus('form.status.error', 'error', { email: CONTACT_EMAIL });
    } finally {
      submit.disabled = false;
    }
  });

  // Team cards for people without credited projects link here
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-contact-member]');
    if (card) presetMember(findMember(card.dataset.contactMember));
  });

  document.addEventListener('langchange', () => {
    fillMemberOptions();
    presetMember(findMember(presetId));
    if (attempted) showErrors(validate(read()).errors);
    if (lastStatus) setStatus(lastStatus.key, lastStatus.kind, lastStatus.vars);
  });
}

/** Pre-selects a team member in the contact form (or clears it with null) and personalises the intro. */
export function presetMember(member) {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  presetId = member?.id ?? '';
  if (form.elements.member) form.elements.member.value = presetId;

  const lead = document.querySelector('[data-contact-lead]');
  if (lead) {
    lead.textContent = member ? t('contact.leadMember', { name: firstName(member.name) }) : t('contact.lead');
  }
}

/** Opens the visitor's email app with the request filled in. */
function openMailto(payload) {
  const subject = payload.memberName
    ? `Project request for ${payload.memberName} from ${payload.name}`
    : `New project request from ${payload.name}`;
  const lines = [`Name: ${payload.name}`, `Email: ${payload.email}`];
  if (payload.company) lines.push(`Company: ${payload.company}`);
  if (payload.memberName) lines.push(`Requested team member: ${payload.memberName}`);
  if (payload.services.length) lines.push(`Services: ${payload.services.join(', ')}`);
  lines.push(`Language: ${LANGUAGE_NAMES[payload.language] ?? payload.language}`);
  const body = [...lines, '', payload.message].join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Sends the request to the server (which forwards it to Telegram).
 * If that is not possible (no server, Telegram down, rate limit), the email app opens instead,
 * so a request is never lost.
 */
async function send(payload) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return 'sent';
  } catch {
    /* network error or timeout: fall back below */
  }
  openMailto(payload);
  return 'mailto';
}
