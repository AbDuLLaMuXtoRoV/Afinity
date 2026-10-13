import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { createContactHandler } from './server/contact-api.js';

const root = dirname(fileURLToPath(import.meta.url));
const partialsDir = resolve(root, 'partials');

/**
 * Inlines shared HTML partials so every page uses the same nav, contact form and footer:
 *   <!-- @include footer.html -->
 *   <!-- @include contact.html num=08 -->   (replaces {{num}} inside the partial)
 */
function htmlPartials() {
  const INCLUDE = /<!--\s*@include\s+([\w.-]+)((?:\s+[\w-]+=[^\s>]+)*)\s*-->/g;
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(INCLUDE, (_, file, rawParams) => {
          const params = Object.fromEntries(
            rawParams
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .map((pair) => pair.split('=')),
          );
          const partial = readFileSync(resolve(partialsDir, file), 'utf-8');
          return partial.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] ?? match);
        });
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir.replace(/\\/g, '/')) || file.startsWith(partialsDir)) {
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

/**
 * Serves POST /api/contact (contact form -> Telegram) from the dev and preview servers.
 * The token is read from .env here, on the server; only VITE_* variables ever reach the browser.
 */
function contactApi(mode) {
  // Read on every request, so changing TELEGRAM_CHAT_ID in .env needs no restart
  const getConfig = () => {
    const env = loadEnv(mode, root, '');
    return { token: env.TELEGRAM_BOT_TOKEN, chatId: env.TELEGRAM_CHAT_ID };
  };
  const handler = createContactHandler({ getConfig });
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [htmlPartials(), contactApi(mode)],
    // The demo is shared through a Cloudflare quick tunnel (see demo/start_demo.ps1)
    preview: {
      allowedHosts: ['.trycloudflare.com'],
    },
  };
});
