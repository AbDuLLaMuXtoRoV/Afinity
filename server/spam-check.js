// Heuristics that recognise junk contact requests (keyboard mashing, gibberish,
// repeated words, link spam). Works for English, Russian and Uzbek (Latin) text.
// Kept deliberately conservative: a short but real request must never be flagged.

const VOWELS = 'aeiouyаеёиоуыэюя';
const isVowel = (ch) => VOWELS.includes(ch);
const LETTER = /\p{L}/u;

// Starts of keyboard rows and long row runs: almost never part of real words
// (no digit runs: phone numbers like +998 90 123 45 67 would match)
const KEYBOARD_MASH = [
  'qwerty', 'asdfgh', 'zxcvbn', 'sdfghj', 'dfghjk', 'fghjkl', 'wertyu', 'ertyui',
  'asdf', 'qwer', 'zxcv', 'йцук', 'фыва', 'ячсм', 'цукен', 'ывапр', 'апрол',
];
const SPAM_WORDS = /\b(viagra|cialis|porn|escort|backlinks?)\b|порно|эскорт|виагра/i;
const URLS = /(https?:\/\/|www\.)\S+/gi; // for counting
const HAS_URL = /(https?:\/\/|www\.)\S+/i; // for testing

const words = (text) => text.toLowerCase().match(/[\p{L}‘’'ʻ-]+/gu) ?? [];

function longestConsonantRun(word) {
  let longest = 0;
  let run = 0;
  for (const ch of word) {
    if (!LETTER.test(ch)) {
      run = 0;
      continue;
    }
    run = isVowel(ch) ? 0 : run + 1;
    longest = Math.max(longest, run);
  }
  return longest;
}

/** Junk signals in a free-text field. */
function textSignals(text, { minWords = 0 } = {}) {
  const value = String(text ?? '').trim();
  const lower = value.toLowerCase();
  const found = [];
  if (!value) return found;

  const letters = [...lower].filter((ch) => LETTER.test(ch));
  const list = words(lower);

  if (/(.)\1{5,}/u.test(lower.replace(/\s/g, ''))) found.push('repeated-characters');
  if (KEYBOARD_MASH.some((seq) => lower.replace(/\s/g, '').includes(seq))) found.push('keyboard-mash');

  if (letters.length >= 12) {
    const vowelShare = letters.filter(isVowel).length / letters.length;
    if (vowelShare < 0.18) found.push('gibberish');
  }
  if (list.some((w) => longestConsonantRun(w) >= 6)) found.push('gibberish');

  if (list.length >= 4 && new Set(list).size / list.length <= 0.4) found.push('repeated-words');
  if (minWords && list.length < minWords) found.push('too-short');
  if (minWords && letters.length < 5) found.push('no-text');

  return [...new Set(found)];
}

/**
 * Returns the reasons a request looks like spam ([] = looks fine).
 * @param {{ name?: string, company?: string, message?: string, elapsed?: number }} data
 *   elapsed: milliseconds between page load and sending (bots send almost instantly)
 */
export function spamReasons(data) {
  const reasons = new Set();
  const message = String(data.message ?? '');

  for (const r of textSignals(message, { minWords: 3 })) reasons.add(r);
  for (const r of textSignals(data.name)) reasons.add(`name-${r}`);

  if ((message.match(URLS) ?? []).length >= 2) reasons.add('links');
  if (HAS_URL.test(String(data.name ?? '')) || HAS_URL.test(String(data.company ?? ''))) reasons.add('link-in-name');
  if (SPAM_WORDS.test(`${data.name ?? ''} ${data.company ?? ''} ${message}`)) reasons.add('spam-words');

  const elapsed = Number(data.elapsed);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 2000) reasons.add('too-fast');

  return [...reasons];
}
