const atlas = document.querySelector('#atlas');
const demos = [...atlas.querySelectorAll('[data-demo-dir]')];
const params = new URLSearchParams(location.search);
const dev = params.get('dev') === '1' || (params.get('prod') !== '1' && location.port === '4173');

const plainUrl = new URL(location.href);
plainUrl.searchParams.set('view', 'html');
document.querySelector('#plain-directory').href = plainUrl.href;
const desktopUrl = new URL(location.href);
desktopUrl.searchParams.delete('view');
document.querySelector('#return-desktop').href = desktopUrl.href;

for (const demo of demos) {
  const target = new URL(demo.href);
  if (dev) {
    target.port = demo.dataset.demoPort;
    target.pathname = demo.dataset.demoPath;
  }
  target.search = location.search;
  demo.href = target.href;
}
const featured = atlas.querySelector('[data-feature]');
featured.href = demos.find(demo => demo.dataset.demoDir === featured.dataset.feature).href;

const search = atlas.querySelector('#search');
const filters = atlas.querySelector('.filters');
const choices = [...filters.querySelectorAll('button')];
const count = atlas.querySelector('#result-count');
const empty = atlas.querySelector('#empty');
let category = choices[0];
function updateResults() {
  const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let matches = 0;
  for (const demo of demos) {
    const text = (demo.dataset.demoDir + ' ' + demo.textContent).toLowerCase();
    const inCategory = category === choices[0] || demo.dataset.category === category.textContent;
    demo.hidden = !(inCategory && words.every(word => text.includes(word)));
    if (!demo.hidden) matches++;
  }
  count.textContent = matches + (matches === 1 ? ' demo' : ' demos');
  empty.hidden = matches > 0;
  for (const choice of choices) choice.setAttribute('aria-pressed', String(choice === category));
}
search.closest('label').hidden = false;
filters.hidden = false;
search.addEventListener('input', updateResults);
for (const choice of choices) {
  choice.addEventListener('click', () => {
    category = choice;
    updateResults();
  });
}
atlas.querySelector('#reset').addEventListener('click', () => {
  search.value = '';
  category = choices[0];
  updateResults();
  search.focus();
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.altKey && !event.ctrlKey && !event.metaKey &&
      !event.target.matches('input, textarea, [contenteditable="true"]') && atlas.getClientRects().length) {
    event.preventDefault();
    search.focus();
  }
});

// A static wireframe represents the inference pipeline; drawing once avoids a
// render loop and requires neither WebGPU nor a live model to browse the atlas.
function drawInferencePlate(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  const point = (u, v) => {
    const angle = v * 2 * Math.PI + u * 3.3;
    const radius = 12 + 39 * (0.5 + 0.5 * Math.cos(u * 3 * Math.PI));
    return [14 + u * (width - 28) + Math.cos(angle) * radius * .4,
      height * (.48 + .16 * Math.sin(u * 2 * Math.PI)) + Math.sin(angle) * radius];
  };
  ctx.lineWidth = 1.15;
  for (let ring = 0; ring <= 72; ring++) {
    ctx.beginPath();
    for (let step = 0; step <= 40; step++) {
      const [x,y] = point(ring / 72, step / 40);
      if (step === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle = 'rgba(183,230,132,.5)';
    ctx.stroke();
  }
  for (let strip = 0; strip < 15; strip++) {
    ctx.beginPath();
    for (let step = 0; step <= 72; step++) {
      const [x,y] = point(step / 72, strip / 15);
      if (step === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle = 'rgba(205,248,176,.66)';
    ctx.stroke();
  }
}
drawInferencePlate(atlas.querySelector('#model-wave'));
