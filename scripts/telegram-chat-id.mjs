// Finds the chat the Telegram bot should write to and saves it to .env.
//
//   1. Open the bot in Telegram and press Start (or add the bot to a group and write a message there).
//   2. npm run telegram:chat-id            -> uses the most recent chat
//      npm run telegram:chat-id -- <id>    -> picks a specific chat from the list
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env');
let env;
try {
  env = readFileSync(envPath, 'utf8');
} catch {
  console.error('No .env file found. Copy .env.example to .env and set TELEGRAM_BOT_TOKEN first.');
  process.exit(1);
}

const token = env.match(/^TELEGRAM_BOT_TOKEN=(.+)$/m)?.[1]?.trim();
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is empty in .env.');
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await res.json();
if (!data.ok) {
  console.error(`Telegram error: ${data.description}`);
  process.exit(1);
}

// Collect chats that wrote to the bot, newest last
const chats = new Map();
for (const update of data.result) {
  const msg = update.message ?? update.my_chat_member ?? update.channel_post ?? update.edited_message;
  const chat = msg?.chat;
  if (!chat) continue;
  const name = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(' ');
  chats.delete(chat.id);
  chats.set(chat.id, `${name || 'chat'}${chat.username ? ` (@${chat.username})` : ''} [${chat.type}]`);
}

if (!chats.size) {
  console.error('Nobody has written to the bot yet. Open it in Telegram, press Start, then run this again.');
  process.exit(1);
}

console.log('Chats that wrote to the bot:');
for (const [id, label] of chats) console.log(`  ${id}  ${label}`);

const wanted = process.argv[2];
const chatId = wanted ?? [...chats.keys()].at(-1);
if (wanted && !chats.has(Number(wanted)) && !chats.has(wanted)) {
  console.error(`Chat ${wanted} is not in the list above.`);
  process.exit(1);
}

const line = `TELEGRAM_CHAT_ID=${chatId}`;
env = /^TELEGRAM_CHAT_ID=.*$/m.test(env) ? env.replace(/^TELEGRAM_CHAT_ID=.*$/m, line) : `${env.trimEnd()}\n${line}\n`;
writeFileSync(envPath, env);
console.log(`\nSaved ${line} to .env (${chats.get(chatId) ?? chats.get(Number(chatId))}).`);
console.log('It is used for the next request right away (no restart needed).');
