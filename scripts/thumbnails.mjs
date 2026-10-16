// Makes smaller copies of portfolio screenshots and team photos for phones and listing pages.
// Runs before every build (npm run build) and on its own with: npm run images
//
//   public/portfolio/x/dashboard.webp  →  dashboard-800w.webp  (wide screenshots)
//   public/portfolio/x/app-scan.webp   →  app-scan-400w.webp   (phone screenshots)
//   public/team/name.webp              →  name-480w.webp       (square photos)
//
// The page picks the right size automatically (srcset in src/js/images.js). Only new or changed images are processed.
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FOLDERS = ['public/portfolio', 'public/team'];
const IMAGE = /\.(webp|png|jpe?g)$/i;
const VARIANT = /-\d+w\.webp$/;

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : IMAGE.test(e.name) && !VARIANT.test(e.name) ? [join(dir, e.name)] : [],
  );

let made = 0;
for (const folder of FOLDERS) {
  for (const file of files(join(root, folder))) {
    if (/logo/i.test(file)) continue;
    const { width, height } = await sharp(file).metadata();
    const target = width > height * 1.2 ? 800 : height > width * 1.2 ? 400 : 480;
    const out = file.replace(IMAGE, `-${target}w.webp`);
    let fresh = false;
    try {
      fresh = statSync(out).mtimeMs >= statSync(file).mtimeMs;
    } catch {
      /* not made yet */
    }
    if (fresh) continue;
    await sharp(file).resize({ width: target, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    made++;
  }
}
console.log(made ? `thumbnails: made ${made}` : 'thumbnails: up to date');
