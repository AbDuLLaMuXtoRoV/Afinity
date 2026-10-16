// Strike counting and IP blocking for the contact form.
// An IP that sends junk (spam, invalid or bot requests) gets a strike; after
// MAX_STRIKES within the window it is blocked for BLOCK_DAYS.
// Blocks are stored in a JSON file so they survive restarts. The file is re-read
// when it changes, so `npm run spam -- unblock <ip>` takes effect immediately.
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const MAX_STRIKES = 5;
const STRIKE_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Reads the block list file ({ ip: { blockedAt, until|null, reasons, samples } }). */
export function readBlocklist(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

/** Writes the block list atomically (temp file + rename) so it is never half-written. */
export function writeBlocklist(file, list) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(list, null, 2)}\n`);
  renameSync(tmp, file);
}

export const isActive = (entry, now = Date.now()) => !!entry && (entry.until === null || Date.parse(entry.until) > now);

/**
 * @param {{ file: string, blockDays?: number, onBlock?: (ip: string, entry: object) => void }} options
 *   blockDays: 0 = permanent
 */
export function createSpamGuard({ file, blockDays = 7, onBlock = () => {} }) {
  const strikes = new Map(); // ip -> [{ t, reasons, sample }]
  let list = {};
  let mtime = -1;

  const refresh = () => {
    const current = existsSync(file) ? statSync(file).mtimeMs : 0;
    if (current !== mtime) {
      list = current ? readBlocklist(file) : {};
      mtime = current;
    }
  };

  return {
    isBlocked(ip) {
      refresh();
      return isActive(list[ip]);
    },

    /** Records a junk request; returns true if this strike got the IP blocked. */
    strike(ip, reasons, sample = '') {
      const now = Date.now();
      const recent = (strikes.get(ip) ?? []).filter((s) => now - s.t < STRIKE_WINDOW_MS);
      recent.push({ t: now, reasons, sample: String(sample).slice(0, 200) });
      strikes.set(ip, recent);
      if (strikes.size > 10000) strikes.clear(); // keep memory bounded

      if (recent.length < MAX_STRIKES) return false;

      refresh();
      const entry = {
        blockedAt: new Date(now).toISOString(),
        until: blockDays > 0 ? new Date(now + blockDays * 86400000).toISOString() : null,
        reasons: [...new Set(recent.flatMap((s) => s.reasons))],
        samples: recent.map((s) => s.sample).filter(Boolean).slice(-3),
      };
      list[ip] = entry;
      writeBlocklist(file, list);
      mtime = statSync(file).mtimeMs;
      strikes.delete(ip);
      onBlock(ip, entry);
      return true;
    },
  };
}
