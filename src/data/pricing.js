/*
  ============================================================================
  COST ESTIMATOR PRICES: REVIEW BEFORE LAUNCH.

  These are typical Uzbekistan market ranges (USD) for a small professional team,
  set as a starting point. Replace them with Afinity's own prices; the estimator
  on the site updates automatically.

  min / max   price range in USD
  weeks       [shortest, longest] time for that part
  Parts are built in parallel, so the longest part sets the timeline; features
  and design add time on top.
  ============================================================================
*/

// REVIEW: exchange rate used to show the so‘m equivalent
export const USD_TO_UZS = 12700;

export const PRODUCTS = {
  // One platform, built with cross-platform technology
  mobile: { min: 3500, max: 8000, weeks: [8, 14] },
  website: {
    landing: { min: 400, max: 1000, weeks: [1, 2] },
    corporate: { min: 1000, max: 2500, weeks: [3, 5] },
    shop: { min: 2500, max: 6000, weeks: [6, 10] },
  },
  admin: { min: 2000, max: 5000, weeks: [4, 8] },
  bot: { min: 300, max: 1500, weeks: [1, 3] },
};

// iOS + Android instead of one platform
export const BOTH_PLATFORMS = 1.5;

export const FEATURES = {
  accounts: { min: 300, max: 800, weeks: 1 }, // sign-up, login, profiles
  payments: { min: 400, max: 1000, weeks: 1 }, // Payme, Click, Uzum, cards
  maps: { min: 500, max: 1500, weeks: 2 }, // maps, GPS, live tracking
  languages: { min: 200, max: 600, weeks: 1 }, // several languages
  integrations: { min: 500, max: 2000, weeks: 2 }, // 1C, CRM, external APIs
  notifications: { min: 200, max: 500, weeks: 1 }, // push / Telegram notifications
};

// UI/UX design from scratch (nothing extra when the client already has a design)
export const CUSTOM_DESIGN = { min: 600, max: 2000, weeks: 2 };
