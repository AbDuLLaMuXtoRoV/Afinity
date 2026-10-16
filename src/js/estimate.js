// Pure price/timeline calculation for the cost estimator (no DOM; easy to unit test).
import { BOTH_PLATFORMS, CUSTOM_DESIGN, FEATURES, PRODUCTS, USD_TO_UZS } from '../data/pricing.js';

const floor100 = (n) => Math.floor(n / 100) * 100;
const ceil100 = (n) => Math.ceil(n / 100) * 100;
const millions = (usd) => {
  const m = (usd * USD_TO_UZS) / 1e6;
  return m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
};

/**
 * @param {{ products?: string[], platforms?: 'ios'|'android'|'both', websiteType?: 'landing'|'corporate'|'shop',
 *           features?: string[], design?: 'ready'|'custom' }} selection
 * @returns {null | { usd: [number, number], uzsMln: [number, number], weeks: [number, number] }}
 *   null when nothing is selected
 */
export function estimate({ products = [], platforms = 'both', websiteType = 'corporate', features = [], design = 'custom' } = {}) {
  const parts = products
    .map((p) => {
      if (p === 'website') return PRODUCTS.website[websiteType] ?? PRODUCTS.website.corporate;
      const part = PRODUCTS[p];
      if (!part) return null;
      const k = p === 'mobile' && platforms === 'both' ? BOTH_PLATFORMS : 1;
      return { min: part.min * k, max: part.max * k, weeks: part.weeks };
    })
    .filter(Boolean);
  if (!parts.length) return null;

  let min = parts.reduce((sum, p) => sum + p.min, 0);
  let max = parts.reduce((sum, p) => sum + p.max, 0);
  // Parts are built in parallel: the longest one sets the pace
  const baseWeeks = [Math.max(...parts.map((p) => p.weeks[0])), Math.max(...parts.map((p) => p.weeks[1]))];

  let extraWeeks = 0;
  for (const f of features) {
    const feature = FEATURES[f];
    if (!feature) continue;
    min += feature.min;
    max += feature.max;
    extraWeeks += feature.weeks;
  }
  if (design === 'custom') {
    min += CUSTOM_DESIGN.min;
    max += CUSTOM_DESIGN.max;
    extraWeeks += CUSTOM_DESIGN.weeks;
  }

  const usd = [floor100(min), ceil100(max)];
  return {
    usd,
    uzsMln: [millions(usd[0]), millions(usd[1])],
    // Extras partly overlap with the main work
    weeks: [baseWeeks[0] + Math.ceil(extraWeeks * 0.4), baseWeeks[1] + Math.ceil(extraWeeks * 0.7)],
  };
}
