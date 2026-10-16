// POST /api/contact: validates a contact form request, filters spam and forwards it to Telegram.
// The bot token stays on the server (read from .env); it is never sent to the browser.
import { findMember, team } from '../src/data/team.js';
import { validateContact } from '../src/js/validation.js';
import { spamReasons } from './spam-check.js';
import { createSpamGuard, MAX_STRIKES } from './spam-guard.js';

const SERVICE_NAMES = {
  mobile: 'Mobile app',
  website: 'Website',
  admin: 'Admin panel',
  bot: 'Telegram bot',
  infrastructure: 'Infrastructure',
};
const LANGUAGE_NAMES = { en: 'English', ru: 'Русский', uz: 'O‘zbekcha' };
const MEMBER_IDS = team.map((m) => m.id);
const MAX_BODY_BYTES = 16 * 1024;
const MAX_MESSAGE_CHARS = 3000; // Telegram messages are limited to 4096 characters
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }; // per visitor

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

const clean = (value, max = 200) => String(value ?? '').trim().slice(0, max);

const tashkentTime = (date) =>
  date.toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent', dateStyle: 'short', timeStyle: 'short' });

/** Builds the Telegram message for a request (HTML parse mode). Exported for tests. */
export function formatMessage(data, { now = new Date() } = {}) {
  const member = findMember(data.member);
  const services = (Array.isArray(data.services) ? data.services : [])
    .map((s) => SERVICE_NAMES[s])
    .filter(Boolean);
  let message = clean(data.message, 5000);
  if (message.length > MAX_MESSAGE_CHARS) message = `${message.slice(0, MAX_MESSAGE_CHARS)}…`;

  const row = (label, value) => (value ? `<b>${label}:</b> ${escapeHtml(value)}` : null);
  return [
    '<b>🆕 New project request</b>',
    '',
    row('👤 Name', clean(data.name)),
    row('✉️ Email', clean(data.email)),
    row('🏢 Company', clean(data.company)),
    row('🧑‍💻 Team member', member?.name),
    row('🧩 Needs', services.join(', ')),
    row('🌐 Language', LANGUAGE_NAMES[data.language] ?? ''),
    '',
    '<b>💬 Message:</b>',
    escapeHtml(message),
    '',
    `<i>🕒 ${escapeHtml(tashkentTime(now))} (Tashkent)</i>`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

/** Builds the alert sent when an IP gets blocked. Exported for tests. */
export function formatBlockAlert(ip, entry) {
  const until = entry.until ? `${tashkentTime(new Date(entry.until))} (Tashkent)` : 'permanently';
  return [
    '<b>🚫 Spammer blocked</b>',
    '',
    `<b>IP:</b> <code>${escapeHtml(ip)}</code>`,
    `<b>Blocked until:</b> ${escapeHtml(until)}`,
    `<b>Why:</b> ${MAX_STRIKES} junk requests: ${escapeHtml(entry.reasons.join(', '))}`,
    ...(entry.samples.length ? ['', '<b>Last messages:</b>', ...entry.samples.map((s) => `• ${escapeHtml(s.slice(0, 120))}`)] : []),
    '',
    `If this was a real client, unblock: <code>npm run spam -- unblock ${escapeHtml(ip)}</code>`,
  ].join('\n');
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('too_large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/**
 * The visitor's IP. Forwarding headers are trusted only when the request comes from this
 * machine (the Cloudflare tunnel connects locally); otherwise anyone could fake a header
 * to dodge a block or to get someone else blocked.
 */
export function clientIp(req) {
  const remote = String(req.socket?.remoteAddress ?? '');
  const viaLocalProxy = /^(::1|127\.|::ffff:127\.)/.test(remote);
  if (viaLocalProxy) {
    const forwarded = req.headers['cf-connecting-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (forwarded) return forwarded;
  }
  return remote || 'unknown';
}

async function sendTelegram({ token, chatId }, text, fetchImpl) {
  return fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10_000),
  });
}

/**
 * Connect-style middleware (works in Vite dev and preview servers).
 * Pass `token`/`chatId`, or `getConfig()` to read them fresh on every request (so .env changes apply without a restart).
 * @param {{ token?: string, chatId?: string, getConfig?: () => { token?: string, chatId?: string },
 *           blocklistFile?: string, blockDays?: number,
 *           fetchImpl?: typeof fetch, log?: Pick<Console, 'error'> }} options
 *   blocklistFile: where blocked IPs are stored (no file = blocks are not saved); blockDays: 0 = permanent
 */
export function createContactHandler({
  token,
  chatId,
  getConfig,
  blocklistFile,
  blockDays = 7,
  fetchImpl = fetch,
  log = console,
} = {}) {
  const config = () => (getConfig ? getConfig() : { token, chatId });
  const hits = new Map(); // ip -> timestamps of recent requests

  const guard = createSpamGuard({
    file: blocklistFile ?? '',
    blockDays,
    onBlock: (ip, entry) => {
      const cfg = config();
      if (!cfg.token || !cfg.chatId) return;
      sendTelegram(cfg, formatBlockAlert(ip, entry), fetchImpl).catch((err) =>
        log.error(`[contact] block alert failed: ${err.message}`),
      );
    },
  });

  const rateLimited = (ip) => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear(); // keep memory bounded
    return recent.length > RATE_LIMIT.max;
  };

  return async function contactHandler(req, res, next) {
    if ((req.url ?? '').split('?')[0] !== '/api/contact') return next();
    if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });

    const ip = clientIp(req);
    if (blocklistFile && guard.isBlocked(ip)) return sendJson(res, 403, { ok: false, error: 'blocked' });

    const cfg = config();
    if (!cfg.token || !cfg.chatId) return sendJson(res, 503, { ok: false, error: 'not_configured' });
    if (rateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'too_many_requests' });

    let data;
    try {
      data = JSON.parse(await readBody(req));
      if (!data || typeof data !== 'object') throw new Error('bad_json');
    } catch (err) {
      return sendJson(res, err.status ?? 400, { ok: false, error: err.status ? 'too_large' : 'bad_request' });
    }

    // Junk counts as a strike; MAX_STRIKES strikes block the IP
    const strike = (reasons) => blocklistFile && guard.strike(ip, reasons, clean(data.message, 200));

    // Bots fill the hidden "website" field: pretend success, send nothing
    if (clean(data.website)) {
      strike(['bot-honeypot']);
      return sendJson(res, 200, { ok: true });
    }

    // The form already checks these fields, so an invalid request here bypassed it
    const { valid, errors } = validateContact(data, { memberIds: MEMBER_IDS });
    if (!valid) {
      strike(['invalid']);
      return sendJson(res, 422, { ok: false, error: 'invalid', fields: Object.keys(errors) });
    }

    const reasons = spamReasons(data);
    if (reasons.length) {
      const blocked = strike(reasons);
      return sendJson(res, blocked ? 403 : 422, { ok: false, error: blocked ? 'blocked' : 'spam' });
    }

    try {
      const tg = await sendTelegram(cfg, formatMessage(data), fetchImpl);
      if (!tg.ok) {
        const detail = await tg.text().catch(() => '');
        log.error(`[contact] Telegram responded ${tg.status}: ${detail.slice(0, 200)}`);
        return sendJson(res, 502, { ok: false, error: 'delivery_failed' });
      }
    } catch (err) {
      log.error(`[contact] Telegram request failed: ${err.message}`);
      return sendJson(res, 502, { ok: false, error: 'delivery_failed' });
    }

    return sendJson(res, 200, { ok: true });
  };
}
