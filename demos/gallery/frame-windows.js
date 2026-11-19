import { createFrameEffects } from './frame-effects.js';

// This name and signal let an overview reached by a demo's own Back link
// hand control to the containing desktop, including on dedicated dev ports.
const FRAME_PREFIX = 'peercompute-atlas-demo:';
const RETURN_SIGNAL = 'peercompute.atlas.return.v1';

export function returnFromFramedAtlas() {
  if (window === window.parent || !window.name.startsWith(FRAME_PREFIX)) return false;
  // Contains no URL or user data. The parent checks the sending window and origin.
  window.parent.postMessage(RETURN_SIGNAL, '*');
  return true;
}

const frameCss = `
.pc-demo-stage { position: fixed; display: flex; flex-direction: column;
  overflow: hidden; z-index: 1; background: #0a1014; color: #cfefea; }
.pc-demo-stage[hidden] { display: none !important; }
.pc-demo-surface { position: relative; display: flex; flex: 1; min-height: 0; flex-direction: column; overflow: hidden; }
.pc-demo-stage nav { display: flex; justify-content: space-between; align-items: center;
  gap: 10px; padding: 0 8px; flex: none; border-bottom: 1px solid currentColor; }
.pc-demo-stage nav :is(button,a) { font: 12px/1.4 ui-monospace, monospace; color: inherit;
  background: transparent; border: 0; padding: 5px 2px; text-decoration: none; cursor: pointer; }
.pc-demo-stage nav :is(button,a):hover { text-decoration: underline; }
.pc-demo-stage iframe { display: block; width: 100%; min-height: 0; flex: 1; border: 0; }
.pc-demo-focus { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0;
  border: 0; background: transparent; cursor: pointer; }
.pc-demo-dragging .pc-demo-stage { pointer-events: none; }
@media (pointer: coarse) { .pc-demo-stage nav :is(button,a) { min-height: 36px; } }`;

// ExoWebTUI's CRT samples the source canvas at r*(1+curve*(r²-1)).
// Fit a straight DOM client inside its curved title bar and edges, leaving
// resize and close controls reachable even at maximum curvature.
function pixelBounds(rect, columns, rows, bounds, curve, outer = false) {
  const x0 = rect.column / columns, x1 = (rect.column + rect.width) / columns;
  const y0 = rect.row / rows, y1 = (rect.row + rect.height) / rows;
  function toScreen(x, y) {
    const u = 2 * x - 1, v = 2 * y - 1;
    const bend = curve * (u * u + v * v);
    let scale = 1;
    for (let i = 0; i < 4; i++) {
      const k = bend * scale * scale;
      scale -= ((1 - curve + k) * scale - 1) / (1 - curve + 3 * k);
    }
    return { x: (1 + u * scale) / 2, y: (1 + v * scale) / 2 };
  }
  const xs = [x0, Math.max(x0, Math.min(.5, x1)), x1];
  const ys = [y0, Math.max(y0, Math.min(.5, y1)), y1];
  const start = outer ? Math.min : Math.max, end = outer ? Math.max : Math.min;
  const left = start(...ys.map(y => toScreen(x0, y).x));
  const right = end(...ys.map(y => toScreen(x1, y).x));
  const top = start(...xs.map(x => toScreen(x, y0).y));
  const bottom = end(...xs.map(x => toScreen(x, y1).y));
  return {
    left: bounds.left + left * bounds.width, top: bounds.top + top * bounds.height,
    width: (right - left) * bounds.width, height: (bottom - top) * bounds.height,
  };
}

// Return disjoint screen rectangles. Occlude by the enclosing bounds of the
// higher window's curved *chrome*, even when its content is another canvas.
function subtract(box, cover) {
  const right = box.left + box.width, bottom = box.top + box.height;
  const x0 = Math.max(box.left, cover.left), y0 = Math.max(box.top, cover.top);
  const x1 = Math.min(right, cover.left + cover.width), y1 = Math.min(bottom, cover.top + cover.height);
  if (x1 <= x0 || y1 <= y0) return [box];
  return [
    { left: box.left, top: box.top, width: box.width, height: y0 - box.top },
    { left: box.left, top: y1, width: box.width, height: bottom - y1 },
    { left: box.left, top: y0, width: x0 - box.left, height: y1 - y0 },
    { left: x1, top: y0, width: right - x1, height: y1 - y0 },
  ].filter(part => part.width > 0 && part.height > 0);
}

export function createFrameWindows({ entries, root, presenter, openAtlas, focusDesktop, focusWindow, closeWindow }) {
  const catalog = new Map(entries.map(entry => [entry.id, entry]));
  const sessions = new Map();
  const effects = createFrameEffects(presenter.shader);
  const style = document.createElement('style');
  style.textContent = frameCss;
  document.head.append(style);
  const events = new AbortController();
  const options = { signal: events.signal };
  let lastLayout = '';

  function remove(id) {
    const session = sessions.get(id);
    if (!session) return;
    session.stage.remove(); // Discard this browsing context and its workers.
    sessions.delete(id);
    lastLayout = '';
  }
  function returnToAtlas(id) {
    remove(id);
    closeWindow(id);
    openAtlas();
    focusDesktop();
  }
  const overview = new URL('./', location.href);
  function isOverview(url) {
    return url.origin === overview.origin && (url.pathname === overview.pathname ||
      url.pathname === overview.pathname + 'index.html');
  }
  window.addEventListener('message', event => {
    if (event.data !== RETURN_SIGNAL) return;
    for (const [id, session] of sessions) {
      if (session.frame.contentWindow !== event.source) continue;
      const devGallery = new URL(overview);
      devGallery.port = '4173';
      if (event.origin === overview.origin ||
          (new URL(session.frame.src).origin !== overview.origin && event.origin === devGallery.origin)) {
        returnToAtlas(id);
      }
      break;
    }
  }, options);

  // Keep drag and resize input attached to the shell when a pointer crosses
  // into a frame. A pointer pressed inside the demo still belongs to the demo.
  const enablePointer = () => root.parentElement.classList.remove('pc-demo-dragging');
  root.addEventListener('pointerdown', () => root.parentElement.classList.add('pc-demo-dragging'),
    { ...options, capture: true });
  window.addEventListener('pointerup', enablePointer, { ...options, capture: true });
  window.addEventListener('pointercancel', enablePointer, { ...options, capture: true });
  window.addEventListener('blur', enablePointer, options);

  function open(id) {
    const entry = catalog.get(id);
    if (!entry || sessions.has(id)) return;
    const stage = document.createElement('section');
    stage.className = 'pc-demo-stage';
    stage.dataset.demoWindow = id;
    stage.setAttribute('aria-label', entry.title);
    stage.hidden = true;
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', entry.title + ' window controls');
    const atlas = document.createElement('button');
    atlas.type = 'button';
    atlas.textContent = '← Back to PeerCompute';
    atlas.addEventListener('click', () => { openAtlas(); focusDesktop(); });
    const direct = document.createElement('a');
    direct.textContent = 'Open in tab ↗';
    direct.href = entry.href;
    direct.target = '_blank';
    direct.rel = 'noopener';
    nav.append(atlas, direct);
    const frame = document.createElement('iframe');
    frame.title = entry.title;
    frame.name = FRAME_PREFIX + id;
    frame.allow = 'autoplay; camera; clipboard-write; cross-origin-isolated; display-capture; fullscreen; gamepad; geolocation; microphone; xr-spatial-tracking';
    frame.addEventListener('load', () => {
      // This also handles the ordinary HTML overview when its JS is unavailable.
      const url = frame.contentDocument?.URL;
      if (url && isOverview(new URL(url))) returnToAtlas(id);
    });
    // A click on a background window raises it through the real window host.
    // Its iframe remains mounted, and only the active frame receives input.
    const shield = document.createElement('button');
    shield.type = 'button'; shield.className = 'pc-demo-focus';
    shield.setAttribute('aria-label', 'Focus ' + entry.title);
    shield.addEventListener('click', () => focusWindow(id));
    const surface = document.createElement('div');
    surface.className = 'pc-demo-surface';
    surface.toggleAttribute('data-pc-foreign', new URL(entry.href, location.href).origin !== location.origin);
    surface.append(nav, frame);
    stage.append(surface, shield);
    sessions.set(id, { stage, frame, nav, shield });
    lastLayout = '';
    frame.src = entry.href;
    root.after(stage);
  }
  const applications = entries.map(entry => ({
    id: entry.id, title: entry.title, summary: entry.description, menu: false,
    window: { width: 160, height: 64, minWidth: 24, minHeight: 9,
      widthRatio: .87, heightRatio: .88, fullscreenBelow: 800 },
    render: (width, _height, _now, theme) => [
      Array.from(entry.title.slice(0, width), char => ({ char, foreground: theme?.accent })),
    ],
  }));
  function project(windows, blocked, theme, animating, states) {
    // The projection omits both minimized and closed windows. Only a real close
    // may tear down a running model, multiplayer room, or simulation.
    for (const state of states) if (state.state === 'closed') remove(state.id);
    const active = windows.find(win => win.active);
    if (active && !blocked && !animating) open(active.id);
    if (!sessions.size) return;
    if (blocked || animating) {
      for (const { stage } of sessions.values()) stage.hidden = true;
      lastLayout = '';
      return;
    }
    effects.sync();
    const size = presenter.size();
    const bounds = root.getBoundingClientRect();
    const shader = presenter.shader;
    const curve = shader.enabled().includes('crt') ? shader.option('crt', 'curve') ?? 0 : 0;
    const key = [size.columns, size.rows, bounds.left, bounds.top, bounds.width, bounds.height,
      theme.id, curve, ...windows.map(win => [win.id, win.active, ...Object.values(win.rect),
        ...Object.values(win.clientRect)].join(','))].join('|');
    if (lastLayout === key) return;
    lastLayout = key;
    const projectRect = (rect, outer) => pixelBounds(rect, size.columns, size.rows, bounds, curve, outer);
    const covers = windows.map(win => projectRect(win.rect, true));
    const visibleIds = new Set();
    windows.forEach((win, index) => {
      const session = sessions.get(win.id);
      if (!session) return;
      const { stage, nav, frame, shield } = session;
      const box = projectRect(win.clientRect, false);
      let parts = [box];
      for (const cover of covers.slice(index + 1)) parts = parts.flatMap(part => subtract(part, cover));
      if (!parts.length) return;
      visibleIds.add(win.id);
      stage.hidden = false;
      shield.hidden = win.active;
      nav.inert = frame.inert = !win.active;
      stage.style.color = 'rgb(' + theme.accent.join(',') + ')';
      stage.style.backgroundColor = 'rgb(' + theme.surface.join(',') + ')';
      for (const [name, value] of Object.entries(box)) stage.style[name] = value + 'px';
      const paths = parts.map(part => `M${part.left - box.left},${part.top - box.top}h${part.width}v${part.height}h${-part.width}Z`);
      stage.style.clipPath = parts[0] === box ? '' : `path("${paths.join(' ')}")`;
    });
    for (const [id, { stage }] of sessions) if (!visibleIds.has(id)) stage.hidden = true;
  }
  function dispose() {
    effects.dispose();
    events.abort();
    enablePointer();
    for (const id of sessions.keys()) remove(id);
    style.remove();
  }
  return { applications, open, project, degauss: effects.degauss, dispose };
}
