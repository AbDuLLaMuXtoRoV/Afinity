const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Adds `.is-in` to [data-reveal] elements as they enter the viewport. */
export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => observer.observe(el));
}

/** Counts [data-count] numbers up from zero when they come into view. */
export function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const format = (value, decimals) =>
    value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    if (reduceMotion()) {
      el.textContent = format(target, decimals);
      return;
    }
    const start = performance.now();
    const duration = 1700;
    const frame = (now) => {
      const t = clamp01((now - start) / duration);
      el.textContent = format(target * (1 - Math.pow(1 - t, 4)), decimals);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );

  els.forEach((el) => {
    if (!reduceMotion()) el.textContent = format(0, Number(el.dataset.decimals || 0));
    observer.observe(el);
  });
}

/** Runs `fn` on scroll (throttled to animation frames) only while `el` is near the viewport. */
function onScrollWhileVisible(el, fn) {
  let visible = false;
  let ticking = false;
  const tick = () => {
    ticking = false;
    fn(el.getBoundingClientRect(), window.innerHeight);
  };
  const request = () => {
    if (visible && !ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    request();
  }, { rootMargin: '20% 0px' }).observe(el);
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
}

/** Statement text: words light up one by one as you scroll through it. */
export function initWords() {
  const el = document.querySelector('[data-words]');
  if (!el) return;

  let words = [];
  const split = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        split(child);
        continue;
      }
      if (child.nodeType !== Node.TEXT_NODE) continue;
      const frag = document.createDocumentFragment();
      for (const part of child.textContent.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.append(part);
          continue;
        }
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = part;
        words.push(span);
        frag.append(span);
      }
      child.replaceWith(frag);
    }
  };
  const highlight = (rect, vh) => {
    // 0 when the text's top reaches 80% of the viewport, 1 when its bottom reaches 55%
    const progress = clamp01((vh * 0.8 - rect.top) / (vh * 0.25 + rect.height));
    const lit = Math.round(progress * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  };
  const prepare = () => {
    words = [];
    split(el);
    el.classList.add('is-split');
    if (reduceMotion()) words.forEach((w) => w.classList.add('on'));
    else highlight(el.getBoundingClientRect(), window.innerHeight);
  };
  prepare();

  // The translated text replaces the spans, so split it again
  document.addEventListener('langchange', prepare);

  if (!reduceMotion()) onScrollWhileVisible(el, highlight);
}

/** Process rail: fills as the steps scroll through the viewport. */
export function initSteps() {
  const el = document.querySelector('[data-steps]');
  if (!el) return;
  if (reduceMotion()) {
    el.style.setProperty('--p', 1);
    return;
  }
  onScrollWhileVisible(el, (rect, vh) => {
    const progress = clamp01((vh * 0.85 - rect.top) / (rect.height * 0.9));
    el.style.setProperty('--p', progress.toFixed(3));
  });
}
