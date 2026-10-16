// Responsive images: smaller copies made by scripts/thumbnails.mjs (npm run images, also before every build).
// Each helper returns a srcset so phones download the small copy and large screens the original.
const LOCAL = /^\/(portfolio|team)\//;
const variant = (src, width) => src.replace(/\.(webp|png|jpe?g)$/i, `-${width}w.webp`);
const set = (src, small, full) => (LOCAL.test(src) ? `${variant(src, small)} ${small}w, ${src} ${full}w` : '');

/** Wide desktop screenshot (originals ~1900×960). */
export const shotSrcset = (src) => set(src, 800, 1907);
/** Portrait phone screenshot (originals ~400–600 wide). */
export const phoneSrcset = (src) => set(src, 400, 600);
/** Square team photo (originals 900×900). */
export const photoSrcset = (src) => set(src, 480, 900);

// Intrinsic sizes for width/height attributes, so the browser reserves space before images load
export const SHOT_SIZE = { width: 1907, height: 958 };
export const PHONE_SIZE = { width: 390, height: 844 };
