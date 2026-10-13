import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

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

export default defineConfig({
  plugins: [htmlPartials()],
});
