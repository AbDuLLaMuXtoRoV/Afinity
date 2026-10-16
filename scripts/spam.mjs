// Manage blocked spammer IPs (stored in data/blocklist.json).
//
//   npm run spam -- list              show blocked IPs
//   npm run spam -- unblock <ip>      unblock an IP (e.g. a real client blocked by mistake)
//   npm run spam -- block <ip> [days] block an IP by hand (days: 0 = permanently, default 7)
//
// The running site picks up changes immediately; no restart needed.
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isActive, readBlocklist, writeBlocklist } from '../server/spam-guard.js';

const file = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'blocklist.json');
const [command = 'list', ip, daysArg] = process.argv.slice(2);
const list = readBlocklist(file);
const tashkent = (iso) => new Date(iso).toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });

if (command === 'list') {
  const active = Object.entries(list).filter(([, entry]) => isActive(entry));
  if (!active.length) {
    console.log('No blocked IPs.');
  } else {
    for (const [addr, entry] of active) {
      console.log(`${addr}`);
      console.log(`  blocked: ${tashkent(entry.blockedAt)}   until: ${entry.until ? tashkent(entry.until) : 'permanently'}`);
      console.log(`  why:     ${entry.reasons.join(', ')}`);
      for (const sample of entry.samples ?? []) console.log(`  sample:  ${sample.slice(0, 100)}`);
    }
  }
} else if (command === 'unblock') {
  if (!ip) throw new Error('Usage: npm run spam -- unblock <ip>');
  if (!list[ip]) {
    console.log(`${ip} is not blocked.`);
  } else {
    delete list[ip];
    writeBlocklist(file, list);
    console.log(`Unblocked ${ip}.`);
  }
} else if (command === 'block') {
  if (!ip) throw new Error('Usage: npm run spam -- block <ip> [days]');
  const days = daysArg === undefined ? 7 : Number(daysArg);
  const now = Date.now();
  list[ip] = {
    blockedAt: new Date(now).toISOString(),
    until: days > 0 ? new Date(now + days * 86400000).toISOString() : null,
    reasons: ['manual'],
    samples: [],
  };
  writeBlocklist(file, list);
  console.log(`Blocked ${ip} ${days > 0 ? `for ${days} days` : 'permanently'}.`);
} else {
  console.log('Commands: list | unblock <ip> | block <ip> [days]');
}
