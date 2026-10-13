// Tiny HTML templating: every interpolated value is escaped unless wrapped in raw().
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = (value) => new Raw(value);

const render = (value) => {
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  if (value === false || value === null || value === undefined) return '';
  return escapeHtml(value);
};

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => {
    out += render(value) + strings[i + 1];
  });
  return raw(out);
}

/** Allows only http(s), mailto and relative URLs; anything else becomes ''. */
export function safeUrl(url) {
  if (!url) return '';
  try {
    const { protocol } = new URL(url, 'https://afinity.local');
    return ['http:', 'https:', 'mailto:'].includes(protocol) ? url : '';
  } catch {
    return '';
  }
}
