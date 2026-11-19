import { createDesktopApp, desktopWindowStates, focusDesktopWindow, closeDesktopWindow } from 'exowebtui-desktop';
import { webPresenter } from 'exowebtui-presenter';
import { browserAudioSource } from 'exowebtui-audio';
import { copyBrowserText } from 'exowebtui-clipboard';
import { createButterchurnPresenter } from './butterchurn-presenter.js';
import { createCatalogWindow } from './catalog-window.js';
import { createFrameWindows, returnFromFramedAtlas } from './frame-windows.js';

function wallpaper(audio, onDispose) {
  let field;
  let disposed = false;
  const url = new URL('./desktop-butterchurn.js', import.meta.url);
  // Load the upstream MilkDrop catalog only when this wallpaper is selected.
  import(url.href).then(({ createButterchurnBackground }) => {
    if (!disposed) field = createButterchurnBackground(audio);
  }).catch(error => console.warn('Butterchurn wallpaper unavailable.', error));
  return {
    advance: options => field?.advance(options) ?? false,
    rasterizeCells: (bounds, theme) => field?.rasterizeCells(bounds, theme) ?? [],
    setPointer: (point, now) => field?.setPointer(point, now),
    clearPointer: () => field?.clearPointer(),
    pick: (column, row, now) => field?.pick?.(column, row, now) ?? false,
    get presetIndex() { return field?.presetIndex; },
    dispose() {
      if (disposed) return;
      disposed = true;
      field?.dispose?.();
      onDispose();
    },
  };
}

async function mountDesktop(viewport, atlas) {
  const root = viewport.querySelector('.desktop-surface');
  // Commit one pixel size for the cell grid, shader surface and live iframe
  // captures. Resizing those independently can repeatedly reset a demo's GPU canvas.
  const fitSurface = () => {
    root.style.width = viewport.clientWidth + 'px';
    root.style.height = viewport.clientHeight + 'px';
  };
  fitSurface();
  const plainUrl = document.querySelector('#plain-directory').href;
  const entries = [...atlas.querySelectorAll('[data-demo-dir]')].map(anchor => ({
    id: 'launch-' + anchor.dataset.demoDir + '-' + anchor.dataset.demoPath,
    title: anchor.querySelector('h2').textContent.trim(),
    description: anchor.querySelector('p').textContent.trim(),
    guide: anchor.dataset.guide,
    summary: anchor.querySelector('.demo-summary')?.textContent.trim() || anchor.querySelector('p').textContent.trim(),
    category: anchor.dataset.category,
    href: anchor.href,
    image: anchor.querySelector('img,canvas'),
  }));
  const guides = entries.filter(entry => entry.guide).map(entry => ({
    id: 'guide-' + entry.id, title: entry.title + ' guide', href: new URL(entry.guide, document.baseURI).href,
  }));
  const source = atlas.querySelector('.source');
  const dialog = document.querySelector('#desktop-search');
  const input = dialog.querySelector('input');
  const audio = browserAudioSource();
  const presenter = webPresenter({ root, storeDatabase: 'peercompute-demo-atlas',
    host: { platformOptions: { textInput: 'target' } } });
  let desktop;
  let animation = 0;
  let stopped = false;
  let nextFrame = 0;
  let butterchurnPresenter;
  let activeWallpaper;
  const focusDesktop = () => presenter.focus();
  const frames = createFrameWindows({ entries: [...entries, ...guides], root, presenter, focusDesktop,
    focusWindow: focusDesktopWindow, closeWindow: closeDesktopWindow,
    openAtlas: () => { desktop.openWindow(catalog.id); focusDesktop(); } });
  function openDemo(id) {
    frames.open(id);
    desktop.openWindow(id);
  }
  function openSearch() {
    if (dialog.open) return;
    input.value = catalog.getSearch();
    dialog.showModal();
    input.focus();
    input.select();
  }
  const catalog = createCatalogWindow({ entries, openDemo, openSearch,
    openSettings: () => desktop.openWindow('settings'),
    openHtml: () => location.assign(plainUrl) });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menuLinks = entries.map(entry => ({ id: entry.id, title: entry.title,
    summary: entry.description, href: entry.href }));
  menuLinks.push({ id: 'source', title: 'Project source', summary: 'PeerCompute on GitHub', href: source.href },
    { id: 'plain', title: 'HTML directory', summary: 'Browse accessible direct links', href: plainUrl });

  desktop = createDesktopApp({
    startLabel: 'PeerCompute', initialWindow: catalog.id,
    applications: [catalog, ...frames.applications],
    hiddenMenuIds: ['about', 'exomonitor', 'neon', 'viz', 'three', 'clock', 'workbench', 'jsr', 'github', ...guides.map(guide => guide.id)],
    menuLinks, audio,
    shader: presenter.shader,
    reducedMotion: () => reducedMotion.matches,
    viewportWidth: () => root.clientWidth,
    extraBackgrounds: [{ id: 'butterchurn', label: 'Butterchurn — audio-reactive MilkDrop', fps: 120, create() {
      butterchurnPresenter = createButterchurnPresenter(presenter.host);
      presenter.host.renderLoop.stop();
      activeWallpaper = wallpaper(audio, () => {
        butterchurnPresenter.dispose();
        butterchurnPresenter = undefined;
        activeWallpaper = undefined;
        if (!stopped) {
          presenter.host.canvas.rerenderAll();
          presenter.host.renderLoop.start();
        }
      });
      return activeWallpaper;
    } }],
    copyText: copyBrowserText, selectionText: () => getSelection()?.toString() ?? '',
    openExternal(href) {
      const entry = entries.find(demo => demo.href === href);
      if (entry) openDemo(entry.id);
      else if (href === source.href) source.click();
      else if (href === plainUrl) location.assign(plainUrl);
    },
    onWindows: (windows, blocked, theme, _animating, overlays) =>
      frames.project(windows, blocked, theme, desktopWindowStates(), overlays),
  });

  const remove = [];
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let resizeTimer;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitSurface, 160);
  });
  resizeObserver.observe(viewport);
  function dispose() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(animation);
    resizeObserver.disconnect();
    clearTimeout(resizeTimer);
    listeners.abort();
    if (dialog.open) dialog.close();
    for (const off of remove) off();
    activeWallpaper?.dispose();
    frames.dispose();
    audio.close();
    presenter.dispose();
  }
  function fallback(error) {
    dispose();
    document.documentElement.classList.remove('exowebtui-ready');
    atlas.hidden = false;
    viewport.hidden = true;
    console.warn('Switched to the HTML demo directory.', error);
  }
  // The presenter animates the GLSL passes independently. The shell redraws
  // at a bounded cadence so an open demo still has time to render its own GPU scene.
  function renderFrame(now) {
    // Painting the desktop may activate or dispose its wallpaper as settings change.
    const frame = desktop.frame(now, presenter.size());
    (butterchurnPresenter ?? presenter).present(frame);
  }
  function tick(now) {
    if (stopped) return;
    try {
      if (now + 0.5 >= nextFrame) {
        renderFrame(now);
        const period = 1000 / (butterchurnPresenter ? 120 : 30);
        // Retain the phase when a display refresh arrives a little early or late.
        nextFrame += Math.max(1, Math.floor((now + 0.5 - nextFrame) / period) + 1) * period;
      }
      animation = requestAnimationFrame(tick);
    } catch (error) { fallback(error); }
  }
  try {
    input.addEventListener('input', () => catalog.setSearch(input.value), options);
    dialog.addEventListener('close', focusDesktop, options);
    await desktop.init(presenter);
    for (const [subscribe, handle] of [['onKey', 'key'], ['onPointer', 'pointer'], ['onWheel', 'wheel'], ['onResize', 'resize']]) {
      remove.push(presenter[subscribe](event => desktop[handle](event)));
    }
    // Keep normal link semantics for the standalone HTML view and modifier clicks.
    // Programmatic activation (including assistive controls) uses the native windows here.
    atlas.addEventListener('click', event => {
      const anchor = event.target.closest('a[href]');
      if (!anchor || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const entry = entries.find(demo => demo.href === anchor.href);
      if (entry) { event.preventDefault(); openDemo(entry.id); }
    }, options);
    renderFrame(performance.now());
    document.documentElement.classList.add('exowebtui-ready');
    atlas.hidden = true;
    focusDesktop();
    animation = requestAnimationFrame(tick);
    window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); }, options);
  } catch (error) { fallback(error); }
}

export async function startDesktop() {
  const root = document.querySelector('#desktop');
  if (returnFromFramedAtlas() || new URLSearchParams(location.search).get('view') === 'html') {
    root.hidden = true;
    return;
  }
  await mountDesktop(root, document.querySelector('#atlas'));
}
