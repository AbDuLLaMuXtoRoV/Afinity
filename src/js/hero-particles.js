import { MARK_H, MARK_POINTS, MARK_SLANT, MARK_W, pointInPolygon } from './mark.js';

const GREEN = '#5bb14e';
const GREEN_DIM = 'rgba(91, 177, 78, 0.35)';
const WHITE = '#ecf2e9';

/**
 * The hero's signature visual: thousands of "data points" that assemble into
 * the Afinity mark, scatter away from the cursor and burst apart on click.
 */
export function initHeroParticles(canvas) {
  const noop = { assemble() {} };
  if (!canvas) return noop;
  const ctx = canvas.getContext('2d');
  if (!ctx) return noop;

  canvas.parentElement.classList.add('has-canvas');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = canvas.closest('.hero') || canvas.parentElement;

  let width = 0;
  let height = 0;
  let size = 2;
  let particles = [];
  let assembled = reduceMotion;
  let running = false;
  let inView = true;
  let raf = 0;
  let t = 0;
  let sweepAt = 0;
  const pointer = { x: -1e4, y: -1e4 };

  function build() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (!width || !height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scale = (Math.min(width / MARK_W, height / MARK_H) * 0.8);
    const ox = (width - MARK_W * scale) / 2;
    const oy = (height - MARK_H * scale) / 2;
    const poly = MARK_POINTS.map(([x, y]) => [ox + x * scale, oy + y * scale]);
    const gap = Math.max(5, Math.round(width / 92));
    size = Math.max(1.6, gap * 0.46);

    const previous = particles;
    particles = [];
    for (let y = oy + gap / 2; y < oy + MARK_H * scale; y += gap) {
      for (let x = ox + gap / 2; x < ox + MARK_W * scale; x += gap) {
        if (!pointInPolygon(x, y, poly)) continue;
        const old = previous[particles.length];
        const hx = x + (Math.random() - 0.5) * gap * 0.3;
        const hy = y + (Math.random() - 0.5) * gap * 0.3;
        particles.push({
          hx,
          hy,
          x: old ? old.x : assembled ? hx : Math.random() * width,
          y: old ? old.y : assembled ? hy : Math.random() * height,
          vx: 0,
          vy: 0,
          white: Math.random() < 0.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function step() {
    t += 1;
    const radius = Math.max(70, width * 0.16);
    const r2 = radius * radius;
    const spring = assembled ? 0.045 : 0.0;

    for (const p of particles) {
      const tx = p.hx + Math.sin(t * 0.02 + p.phase) * 0.8;
      const ty = p.hy + Math.cos(t * 0.017 + p.phase) * 0.8;
      p.vx += (tx - p.x) * spring;
      p.vy += (ty - p.y) * spring;

      if (!assembled) {
        p.vx += Math.sin(t * 0.01 + p.phase) * 0.03;
        p.vy += Math.cos(t * 0.012 + p.phase) * 0.03;
      }

      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const force = (1 - d / radius) * 2.4;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }

      p.vx *= 0.84;
      p.vy *= 0.84;
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // A highlight band, parallel to the logo's diagonal stroke, sweeps across every few seconds
    const lo = -height * MARK_SLANT;
    const span = width - lo;
    const band = lo - 40 + (((t - sweepAt) * 5) % (span * 2.2));

    const buckets = { green: [], dim: [], white: [] };
    for (const p of particles) {
      const off = Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy);
      const diag = p.x - (height - p.y) * MARK_SLANT;
      if (Math.abs(diag - band) < 26 || p.white) buckets.white.push(p);
      else if (off > 40) buckets.dim.push(p);
      else buckets.green.push(p);
    }

    const paint = (list, color) => {
      ctx.fillStyle = color;
      for (const p of list) ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    };
    paint(buckets.dim, GREEN_DIM);
    paint(buckets.green, GREEN);
    paint(buckets.white, WHITE);

    // Soft glow under the pointer
    if (pointer.x > -1e3) {
      const r = Math.max(70, width * 0.16);
      const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, r);
      g.addColorStop(0, 'rgba(91,177,78,0.12)');
      g.addColorStop(1, 'rgba(91,177,78,0)');
      ctx.fillStyle = g;
      ctx.fillRect(pointer.x - r, pointer.y - r, r * 2, r * 2);
    }
  }

  function loop() {
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduceMotion || !inView || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function burst(x, y) {
    for (const p of particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (12 + Math.random() * 14) * Math.max(0.15, 1 - d / (width * 0.9));
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
    }
  }

  function toLocal(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  build();
  if (reduceMotion) draw();

  if (!reduceMotion) {
    hero.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        const p = toLocal(e);
        pointer.x = p.x;
        pointer.y = p.y;
      },
      { passive: true },
    );
    hero.addEventListener('pointerleave', () => {
      pointer.x = pointer.y = -1e4;
    });
    canvas.addEventListener('pointerdown', (e) => {
      const p = toLocal(e);
      burst(p.x, p.y);
    });

    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView ? start() : stop();
    }).observe(canvas);

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
  }

  let resizeTimer;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (reduceMotion) draw();
    }, 120);
  }).observe(canvas);

  return {
    assemble() {
      assembled = true;
      sweepAt = t + 60;
    },
  };
}
