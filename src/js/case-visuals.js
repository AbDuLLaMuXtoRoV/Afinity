import { raw } from './html.js';

// Static mockups used for portfolio projects that have no screenshot yet.
// They share class names with the homepage case studies, so hover stories work everywhere.
const cells = (booked, done) =>
  Array.from({ length: 21 }, (_, i) => {
    const b = booked.indexOf(i);
    if (b !== -1) return `<i class="bk" style="--i: ${b}"></i>`;
    return done.includes(i) ? '<i class="on"></i>' : '<i></i>';
  }).join('');

const bars = (heights) => heights.map((h) => `<i style="--h: ${h}%"></i>`).join('');

const VISUALS = {
  delivery: `
    <div class="cv-phones">
      <div class="cv-phone"><div class="cv-map"><i></i><b></b></div><div class="cv-sheet"><i></i><i></i></div></div>
      <div class="cv-phone cv-phone--2"><div class="cv-track"><i></i><i></i><i></i><i></i></div></div>
    </div>`,
  booking: `
    <div class="cv-cal">
      <div class="cv-cal__head"><b></b><i></i></div>
      <div class="cv-cal__grid">${cells([4, 10, 19], [2, 8, 12, 17])}</div>
      <div class="cv-cal__toast mono"><svg class="i"><use href="#check" /></svg>Booked · Tue 10:30</div>
    </div>`,
  shop: `
    <div class="cv-shop">
      <div class="cv-shop__nav"><b></b><i></i><i></i><s class="cv-cart"></s></div>
      <div class="cv-shop__grid"><div><i></i><b></b></div><div><i></i><b></b></div><div><i></i><b></b></div></div>
      <div class="cv-checkout"><span></span><i></i></div>
    </div>`,
  network: `
    <svg class="cv-net" viewBox="0 0 400 250">
      <g class="cv-net__links"><path d="M60 125 L200 60 L340 125 L200 190 Z M60 125 L340 125 M200 60 L200 190" /></g>
      <g class="cv-net__pkt">
        <path pathLength="100" d="M200 125 L72 125" /><path pathLength="100" d="M200 125 L200 72" />
        <path pathLength="100" d="M200 125 L328 125" /><path pathLength="100" d="M200 125 L200 178" />
      </g>
      <g class="cv-net__nodes">
        <rect x="48" y="113" width="24" height="24" /><rect x="188" y="48" width="24" height="24" />
        <rect x="328" y="113" width="24" height="24" /><rect x="188" y="178" width="24" height="24" />
        <rect class="hub" x="184" y="109" width="32" height="32" />
      </g>
    </svg>`,
  app: `
    <div class="cv-app">
      <div class="cv-app__phone">
        <div class="cv-app__screen">
          <div class="cv-app__toast"><i></i><span></span></div>
          <div class="cv-app__card"><span></span><b></b></div>
          <div class="cv-app__row"><i></i><b></b></div>
          <div class="cv-app__row"><i></i><b></b></div>
          <div class="cv-app__row"><i></i><b></b></div>
        </div>
      </div>
    </div>`,
  dashboard: `
    <div class="cv-dash">
      <div class="cv-dash__side"><i class="on"></i><i></i><i></i><i></i></div>
      <div class="cv-dash__main">
        <div class="cv-dash__kpis"><i></i><i></i><i></i></div>
        <div class="cv-dash__bars">${bars([38, 60, 46, 72, 55, 84, 66, 94])}</div>
      </div>
    </div>`,
};

export const VISUAL_TYPES = Object.keys(VISUALS);

export function caseVisual(type) {
  return raw(VISUALS[type] ?? VISUALS.app);
}
