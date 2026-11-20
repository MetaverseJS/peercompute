import { createDesktopApp, desktopWindowStates, focusDesktopWindow, closeDesktopWindow } from 'exowebtui-desktop';
import { webPresenter } from 'exowebtui-presenter';
import { browserAudioSource } from 'exowebtui-audio';
import { copyBrowserText } from 'exowebtui-clipboard';
import { createButterchurnPresenter } from './butterchurn-presenter.js';
import { createGuideMedia } from './guide-media.js';
import { syncGuideTheme } from '../../docs/assets/gallery-guide-theme.js';
import { openDiagram } from '../../docs/assets/gallery-diagram.js';
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
  function openAtlas() { desktop.openWindow(catalog.id); focusDesktop(); }
  const guides = new Map();
  const guideRoutes = new Map();
  let retired = false;
  function follow(href) {
    const url = new URL(href);
    const target = guideRoutes.get(url.origin + url.pathname);
    if (target) { target.pendingAnchor = url.hash; openDemo(target.id); return; }
    if (['http:', 'https:', 'mailto:'].includes(url.protocol)) window.open(url, '_blank', 'noopener');
  }
  // Register lightweight shell windows up front. The document library and
  // each README load only when the user opens a guide.
  const reader = new URL('./gallery-guide-reader.js', import.meta.url);
  for (const entry of entries.filter(entry => entry.guide)) {
    const url = new URL(entry.guide, document.baseURI);
    const guide = { id: 'guide-' + entry.id, title: entry.title + ' guide', menu: false, summary: entry.title,
      window: { width: 116, height: 46, minWidth: 25, minHeight: 10, widthRatio: .74, heightRatio: .86, fullscreenBelow: 960 },
      render(width, _height, _now, theme) {
        if (!guide.loading) {
          guide.loading = import(reader.href).then(({ createGuideWindow }) => {
            if (retired) return;
            Object.assign(guide, createGuideWindow({ id: guide.id, title: guide.title, href: url.href,
              async load() {
                const response = await fetch(new URL(url.pathname.replace(/\.html$/, '.json'), url));
                if (!response.ok) throw new Error('Guide download failed (' + response.status + ')');
                return response.json();
              },
              follow, openAtlas, openDemo: () => openDemo(entry.id),
              openDiagram: options => openDiagram({ ...options, returnFocus: focusDesktop }),
            }));
            if (guide.pendingAnchor) guide.goToAnchor(guide.pendingAnchor);
            delete guide.pendingAnchor;
          }).catch(() => {
            guide.failed = true;
            guide.onPointerUp = () => window.open(url, '_blank', 'noopener');
            guide.onKey = event => {
              if (event.key !== 'return') return false;
              guide.onPointerUp();
              return true;
            };
          });
        }
        const line = guide.failed ? '[Open HTML guide]' : 'Loading guide…';
        return [Array.from(line.slice(0, width), char => ({ char, foreground: theme.accent }))];
      },
    };
    guides.set(guide.id, guide);
    guideRoutes.set(url.origin + url.pathname, guide);
  }
  const catalog = createCatalogWindow({ entries, openDemo, openSearch,
    openSettings: () => desktop.openWindow('settings'),
    openHtml: () => location.assign(plainUrl) });
  const media = createGuideMedia(root, presenter, new Map([...guides, [catalog.id, catalog]]));
  const frames = createFrameWindows({ entries, root, presenter, focusDesktop, guideLayers: media.layers,
    focusWindow: focusDesktopWindow, closeWindow: closeDesktopWindow,
    openAtlas });
  function openDemo(id) {
    const guide = guides.get(id);
    if (guide?.goToAnchor && guide.pendingAnchor) {
      guide.goToAnchor(guide.pendingAnchor);
      delete guide.pendingAnchor;
    }
    if (!guide) frames.open(id);
    desktop.openWindow(id);
  }
  function openSearch() {
    if (dialog.open) return;
    input.value = catalog.getSearch();
    dialog.showModal();
    input.focus();
    input.select();
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menuLinks = entries.map(entry => ({ id: entry.id, title: entry.title,
    summary: entry.description, href: entry.href }));
  menuLinks.push({ id: 'source', title: 'Project source', summary: 'PeerCompute on GitHub', href: source.href },
    { id: 'plain', title: 'HTML directory', summary: 'Browse accessible direct links', href: plainUrl });

  let currentTheme;
  desktop = createDesktopApp({
    startLabel: 'PeerCompute', initialWindow: catalog.id,
    applications: [catalog, ...frames.applications, ...guides.values()],
    hiddenMenuIds: ['about', 'exomonitor', 'neon', 'viz', 'three', 'clock', 'workbench', 'jsr', 'github'],
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
    onWindows(windows, blocked, theme, animating, overlays) {
      if (currentTheme !== theme) { syncGuideTheme(theme); currentTheme = theme; }
      media.project(windows, theme, overlays, animating);
      frames.project(windows, blocked, theme, desktopWindowStates(), overlays);
    },
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
    retired = true;
    for (const guide of guides.values()) guide.dispose?.();
    media.dispose();
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
