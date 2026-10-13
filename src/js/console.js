// Simulated live traffic for the infrastructure section. Purely illustrative.
const POINTS = 40;
const MAX_LOG = 7;
const ROUTES = [
  ['GET', '/api/orders'],
  ['POST', '/api/auth/login'],
  ['GET', '/v1/products?page=2'],
  ['GET', '/api/users/me'],
  ['POST', '/v1/payments'],
  ['GET', '/api/search?q=shoes'],
  ['GET', '/admin/reports/daily'],
  ['PUT', '/api/cart/items'],
  ['GET', '/v1/notifications'],
];
const NODES = ['a', 'b', 'c'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function initConsole() {
  const root = document.querySelector('[data-console]');
  if (!root) return;

  const line = root.querySelector('[data-line]');
  const area = root.querySelector('[data-area]');
  const log = root.querySelector('[data-log]');
  const metric = (name) => root.querySelector(`[data-metric="${name}"]`);
  const rpsEl = metric('rps');
  const latEl = metric('lat');
  const errEl = metric('err');

  let rps = 12480;
  const nextRps = () => {
    rps += (Math.random() - 0.5) * 1600 + (12500 - rps) * 0.1;
    if (Math.random() < 0.07) rps += 3000 + Math.random() * 3000;
    rps = Math.min(21500, Math.max(6500, rps));
    return rps;
  };
  const data = Array.from({ length: POINTS }, nextRps);

  const drawChart = () => {
    const min = 5000;
    const max = 22000;
    const pts = data.map((v, i) => [(i / (POINTS - 1)) * 300, 100 - ((v - min) / (max - min)) * 100]);
    // Smooth curve through midpoints
    let d = `M${pts[0][0]} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    const last = pts[pts.length - 1];
    d += `L${last[0]} ${last[1].toFixed(1)}`;
    line.setAttribute('d', d);
    area.setAttribute('d', `${d}L300 100L0 100Z`);
  };

  const updateMetrics = () => {
    rpsEl.textContent = fmt(rps);
    latEl.textContent = `${Math.round(28 + (rps / 21500) * 22 + Math.random() * 6)}ms`;
    errEl.textContent = `${(0.01 + Math.random() * 0.03).toFixed(2)}%`;
  };

  const addLog = () => {
    const [method, path] = pick(ROUTES);
    const roll = Math.random();
    const status = roll < 0.06 ? 429 : roll < 0.14 ? 304 : method === 'POST' ? 201 : 200;
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });

    const li = document.createElement('li');
    const cells = [
      ['t', time],
      ['m', method],
      ['p', path],
      [status === 429 ? 's s--warn' : 's s--ok', String(status)],
      ['ms', `${status === 429 ? 1 : 4 + Math.floor(Math.random() * 56)}ms`],
      ['n', `node-${pick(NODES)}`],
    ];
    for (const [cls, text] of cells) {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text;
      li.append(span);
    }
    if (status === 429) li.title = 'Rate limited';
    log.prepend(li);
    while (log.children.length > MAX_LOG) log.lastElementChild.remove();
  };

  // Initial frame
  for (let i = 0; i < MAX_LOG; i++) addLog();
  drawChart();
  updateMetrics();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let chartTimer = 0;
  let logTimer = 0;
  const scheduleLog = () => {
    logTimer = setTimeout(() => {
      addLog();
      scheduleLog();
    }, 350 + Math.random() * 650);
  };
  const start = () => {
    if (chartTimer) return;
    chartTimer = setInterval(() => {
      data.shift();
      data.push(nextRps());
      drawChart();
      updateMetrics();
    }, 900);
    scheduleLog();
  };
  const stop = () => {
    clearInterval(chartTimer);
    clearTimeout(logTimer);
    chartTimer = 0;
  };

  let visible = false;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible && !document.hidden ? start() : stop();
  }).observe(root);
  document.addEventListener('visibilitychange', () => (visible && !document.hidden ? start() : stop()));
}
