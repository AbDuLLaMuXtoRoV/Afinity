import { existsSync, readFileSync, statSync } from 'node:fs';
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
  const env = loadEnv(mode, root, '');
  const handler = createContactHandler({
    getConfig,
    // Spammers' IPs (personal data: git-ignored). SPAM_BLOCK_DAYS=0 blocks permanently.
    blocklistFile: resolve(root, 'data', 'blocklist.json'),
    blockDays: env.SPAM_BLOCK_DAYS === undefined || env.SPAM_BLOCK_DAYS === '' ? 7 : Number(env.SPAM_BLOCK_DAYS),
  });
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

/**
 * Unknown addresses get the branded 404 page (with a real 404 status) on the preview server,
 * which also runs the demo. On the real hosting, point its 404 page to /404.html (see README).
 */
function notFoundPage() {
  return {
    name: 'not-found-page',
    configurePreviewServer(server) {
      // Returned function = runs after the static files, so it only sees addresses nothing else answered
      const dist = resolve(root, 'dist');
      const send = (res, status, file) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(file));
      };
      return () => {
        server.middlewares.use((req, res, next) => {
          // "/" → index.html, "/projects" → projects.html (clean addresses), anything else → 404
          let path = '/';
          try {
            path = decodeURIComponent((req.url ?? '/').split('?')[0]);
          } catch {
            /* malformed address: 404 below */
          }
          const exists = (candidate) => {
            const file = resolve(dist, `.${candidate}`);
            return file.startsWith(dist) && existsSync(file) && statSync(file).isFile() ? file : null;
          };
          // Vite already mapped the address to an existing page ("/" → "/index.html"): let it serve that page
          if (path.endsWith('.html') && exists(path)) return next();
          for (const candidate of path.endsWith('/') ? [`${path}index.html`] : [`${path}.html`, `${path}/index.html`]) {
            const file = exists(candidate);
            if (file) return send(res, 200, file);
          }
          send(res, 404, resolve(dist, '404.html'));
        });
      };
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [htmlPartials(), contactApi(mode), notFoundPage()],
    // Several separate pages, no single-page fallback (unknown addresses are 404s)
    appType: 'mpa',
    // Every HTML page of the site (projects.html lists all projects, project.html shows one: ?p=<slug>;
    // services/*.html: one page per service, content in src/data/services.js)
    build: {
      rollupOptions: {
        input: {
          main: resolve(root, 'index.html'),
          projects: resolve(root, 'projects.html'),
          project: resolve(root, 'project.html'),
          'services/mobile-apps': resolve(root, 'services/mobile-apps.html'),
          'services/admin-panels': resolve(root, 'services/admin-panels.html'),
          'services/telegram-bots': resolve(root, 'services/telegram-bots.html'),
          404: resolve(root, '404.html'),
        },
      },
    },
    // The demo is shared through a Cloudflare quick tunnel (see demo/start_demo.ps1)
    preview: {
      allowedHosts: ['.trycloudflare.com'],
    },
  };
});
