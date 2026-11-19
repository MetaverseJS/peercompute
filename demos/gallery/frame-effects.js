// Embedded WebGL and media stay in their own browsing context. SVG filters act
// on the browser's composited surface; the parent never reads the demo pixels.
const effectsCss = `
[data-pc-frame-effects] .pc-demo-surface { position: relative; }
[data-pc-frame-effects] .pc-demo-surface::before,
[data-pc-frame-effects] .pc-demo-surface::after,
[data-pc-frame-thump] .pc-demo-stage::after {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
}
/* Chromium omits foreign documents from an SVG filter's SourceGraphic.
   Its built-in backdrop blur still composites those pixels. Screen the soft
   image back over the sharp one as a glass halo, with a little tape bleed. */
[data-pc-frame-optics] .pc-demo-stage:has(.pc-demo-surface[data-pc-foreign])::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  backdrop-filter: blur(var(--pc-halo-radius)) sepia(var(--pc-tint)) saturate(2) hue-rotate(134deg);
  mix-blend-mode: screen; opacity: var(--pc-halo-gain);
}
[data-pc-frame-effects~="vhs"] .pc-demo-surface::before {
  content: ""; background-image: linear-gradient(to bottom, transparent 35%,
    rgb(217 247 242 / var(--pc-tape-track)) 39%, transparent 43%), var(--pc-tape-grain);
  background-repeat: repeat; background-size: 100% 280%, 72px 72px;
  animation: pc-tape-travel 4s steps(48,end) infinite;
}
[data-pc-frame-effects~="crt"] .pc-demo-surface::after,
[data-pc-frame-effects~="scanlines"] .pc-demo-surface::after,
[data-pc-frame-effects~="degauss"] .pc-demo-surface::after {
  content: "";
  background-image:
    repeating-linear-gradient(180deg, rgb(0 0 0 / var(--pc-raster)) 0 1px,
      transparent 1px var(--pc-raster-period)),
    radial-gradient(ellipse at center, transparent 44%, rgb(0 0 0 / var(--pc-vignette)) 100%),
    radial-gradient(ellipse at bottom left, rgb(100 230 133 / var(--pc-stain)), transparent 35%),
    radial-gradient(ellipse at top right, rgb(228 97 182 / var(--pc-stain)), transparent 34%);
  border-radius: var(--pc-glass-radius);
  box-shadow: inset 0 0 var(--pc-glass-depth) rgb(3 9 16 / var(--pc-edge));
}
[data-pc-frame-thump] .pc-demo-stage::after {
  content: ""; z-index: 2; opacity: 0;
  background: radial-gradient(ellipse at 20% 60%, #65ecba, transparent 56%),
    radial-gradient(ellipse at 80% 47%, #e879bd, transparent 58%);
  animation: pc-coil-settle .95s ease-out;
}
@keyframes pc-tape-travel {
  from { background-position: 0 100%, 0 0; }
  to { background-position: 0 0, 29px 41px; }
}
@keyframes pc-coil-settle {
  0% { opacity: .30; } 22% { opacity: .17; } 44% { opacity: .22; } 100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  [data-pc-frame-effects] .pc-demo-surface::before,
  [data-pc-frame-thump] .pc-demo-stage::after { animation: none; }
}`;

function colorPass(fringe, glow) {
  let source = 'SourceGraphic';
  let passes = '';
  if (fringe) {
    // Isolate each channel after shifting its sample position, then add the
    // three colors. The green image (and the interactive layout) stays put.
    for (const [i, name] of ['red', 'green', 'blue'].entries()) {
      const row = [0, 1, 2].map(channel =>
        channel === i ? ['1 0 0', '0 1 0', '0 0 1'][channel] + ' 0 0' : '0 0 0 0 0');
      passes += `<feOffset in="SourceGraphic" dx="${(1 - i) * fringe}" result="sample"/>
        <feColorMatrix in="sample" type="matrix" values="${row.join(' ')} 0 0 0 1 0" result="${name}"/>`;
    }
    passes += '<feBlend in="red" in2="green" mode="screen" result="rg"/><feBlend in="rg" in2="blue" mode="screen" result="rgb"/>';
    source = 'rgb';
  }
  if (glow) {
    const gain = (glow * .35).toFixed(3);
    const curves = ['R', 'G', 'B'].map(c => `<feFunc${c} type="gamma" amplitude="${gain}" exponent="1.65" offset="0"/>`).join('');
    passes += `<feGaussianBlur in="${source}" stdDeviation="${(1.35 + glow).toFixed(2)}" result="halo"/>
      <feComponentTransfer in="halo" result="phosphor">${curves}</feComponentTransfer>
      <feBlend in="${source}" in2="phosphor" mode="screen"/>`;
  }
  return passes;
}

function tapeGrain(noise) {
  if (!noise) return 'none';
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72">
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/></filter>
    <path d="M0 0h72v72H0z" filter="url(#n)" opacity="${noise * .6}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(tile)}")`;
}

let instance = 0;
export function createFrameEffects(shader, host = document.body) {
  const doc = host.ownerDocument;
  const id = 'pc-frame-optics-' + ++instance;
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;pointer-events:none';
  svg.innerHTML = `<defs><filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"/></defs>`;
  const filter = svg.querySelector('filter');
  const style = doc.createElement('style');
  style.textContent = effectsCss + `\n[data-pc-frame-optics="${id}"] .pc-demo-surface:not([data-pc-foreign]) { filter: url(#${id}); }`;
  doc.head.append(style);
  host.append(svg);
  let previous = '', optics = '', thumpTimer;
  const props = [];
  function property(name, value) {
    const key = '--pc-' + name;
    if (!props.includes(key)) props.push(key);
    host.style.setProperty(key, value);
  }
  function sync() {
    const enabled = shader.enabled();
    const read = (pass, key) => enabled.includes(pass) ? shader.option(pass, key) ?? 0 : 0;
    const tracking = read('vhs', 'tracking'), noise = read('vhs', 'noise'), bleed = read('vhs', 'bleed');
    const curve = read('crt', 'curve'), vignette = read('crt', 'vignette'), fringe = read('crt', 'fringe');
    const glow = read('phosphor', 'glow'), lines = read('scanlines', 'strength'), period = read('scanlines', 'period');
    const rate = read('degauss', 'rate');
    // Quantize slow magnet drift. Applying a full SVG tree for every painted
    // frame would be expensive for an actively rendering demo.
    const magnet = rate ? Math.round((shader.magnetism?.() ?? 0) * 12) / 12 : 0;
    const key = [enabled.join(' '), tracking, noise, bleed, curve, vignette, fringe, glow, lines, period, rate, magnet].join('|');
    if (previous === key) return;
    previous = key;
    if (enabled.length) host.dataset.pcFrameEffects = enabled.join(' ');
    else delete host.dataset.pcFrameEffects;
    const shift = Math.min(5, fringe * 840 + bleed * .42);
    const graph = shift + ':' + glow;
    if (optics !== graph) {
      optics = graph;
      filter.innerHTML = colorPass(shift, glow);
      if (shift || glow) host.dataset.pcFrameOptics = id;
      else delete host.dataset.pcFrameOptics;
      property('halo-radius', (1.35 + glow + shift * .32) + 'px');
      property('halo-gain', Math.min(.55, glow * .19 + shift * .045));
      property('tint', Math.min(.75, shift * .22));
    }
    property('tape-track', tracking * .16);
    property('tape-grain', tapeGrain(noise));
    property('raster', lines);
    property('raster-period', (period || 3) + 'px');
    property('vignette', vignette);
    property('glass-radius', (curve * 22).toFixed(2) + '%');
    property('glass-depth', (curve * 110).toFixed(2) + 'px');
    property('edge', Math.min(.85, curve * 4));
    property('stain', magnet * .15);
  }
  function degauss() {
    clearTimeout(thumpTimer);
    delete host.dataset.pcFrameThump;
    if (doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Restart the one-shot color wash without displacing the live hit targets.
    void host.offsetWidth;
    host.dataset.pcFrameThump = '';
    thumpTimer = setTimeout(() => { delete host.dataset.pcFrameThump; }, 980);
  }
  function dispose() {
    clearTimeout(thumpTimer);
    delete host.dataset.pcFrameEffects; delete host.dataset.pcFrameOptics; delete host.dataset.pcFrameThump;
    for (const key of props) host.style.removeProperty(key);
    svg.remove(); style.remove();
  }
  sync();
  return { sync, degauss, dispose };
}
