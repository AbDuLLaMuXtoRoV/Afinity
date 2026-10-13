export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 5000;

// English messages, used when no translate function is passed (keeps this module dependency-free).
const DEFAULT_MESSAGES = {
  'form.err.name': 'Please enter your name.',
  'form.err.emailRequired': 'Please enter your email.',
  'form.err.emailInvalid': 'That email address doesn’t look right.',
  'form.err.messageShort': 'Tell us a bit more (at least {min} characters).',
  'form.err.messageLong': 'Please keep it under {max} characters.',
  'form.err.member': 'Please choose a team member from the list.',
};

const defaultT = (key, vars = {}) =>
  (DEFAULT_MESSAGES[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);

/**
 * Validates contact form data.
 * @param {{name?: string, email?: string, member?: string, message?: string}} data
 * @param {{memberIds?: string[], t?: (key: string, vars?: object) => string}} [options]
 *   memberIds: allowed team member ids (member is optional); t: translate function for messages
 * @returns {{valid: boolean, errors: Record<string, string>}}
 */
export function validateContact(data, { memberIds, t = defaultT } = {}) {
  const errors = {};
  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const member = (data.member ?? '').trim();
  const message = (data.message ?? '').trim();

  if (member && memberIds && !memberIds.includes(member)) errors.member = t('form.err.member');

  if (name.length < 2) errors.name = t('form.err.name');

  if (!email) errors.email = t('form.err.emailRequired');
  else if (!EMAIL_RE.test(email)) errors.email = t('form.err.emailInvalid');

  if (message.length < MESSAGE_MIN) errors.message = t('form.err.messageShort', { min: MESSAGE_MIN });
  else if (message.length > MESSAGE_MAX) errors.message = t('form.err.messageLong', { max: MESSAGE_MAX });

  return { valid: Object.keys(errors).length === 0, errors };
}
