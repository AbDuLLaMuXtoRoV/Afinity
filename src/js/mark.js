// Outline of the Afinity "A" mark, traced from the logo (viewBox 0 0 336 337).
export const MARK_W = 336;
export const MARK_H = 337;

export const MARK_POINTS = [
  [225, 0],
  [336, 0],
  [260, 114],
  [326, 185],
  [336, 196],
  [336, 337],
  [225, 337],
  [225, 166],
  [112, 337],
  [0, 337],
];

// Slope of the diagonal stroke (dx per dy), used to align effects with the logo.
export const MARK_SLANT = 224 / 337;

export function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
