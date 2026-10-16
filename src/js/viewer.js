import { html } from './html.js';
import { t } from './i18n.js';

// One shared full-size screenshot viewer (a <dialog>), created on first use
let viewer;
export function openViewer(img) {
  if (!viewer) {
    viewer = document.createElement('dialog');
    viewer.className = 'shot-viewer';
    viewer.innerHTML = html`<button class="shot-viewer__close" type="button"></button>
      <div class="shot-viewer__scroll"><img alt="" /></div>`.value;
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer || e.target.closest('.shot-viewer__close')) viewer.close();
    });
    document.body.append(viewer);
  }
  viewer.querySelector('.shot-viewer__close').setAttribute('aria-label', t('viewer.close'));
  const full = viewer.querySelector('img');
  full.src = img.getAttribute('src'); // the original, not the smaller srcset copy
  full.alt = img.alt;
  viewer.classList.toggle('shot-viewer--portrait', img.naturalHeight > img.naturalWidth);
  viewer.showModal();
  viewer.querySelector('.shot-viewer__scroll').scrollTop = 0;
}
