import { createDesktopApp } from 'exowebtui-desktop';
import { webPresenter } from 'exowebtui-presenter';

const WINDOW_ID = 'demo-atlas';
const CELL_WIDTH = 8;
const CELL_HEIGHT = 16;

async function mountDesktop(root, atlas) {
  // The gallery is a semantic HTML client of a real ExoWebTUI window. Only
  // the desktop canvas owns window state, chrome, input and menu hit testing.
  const originalStyle = atlas.getAttribute('style');
  Object.assign(root.style, { position: 'fixed', inset: '0', overflow: 'hidden', visibility: 'hidden' });
  const presenter = webPresenter({
    root, storeDatabase: 'peercompute-demo-atlas',
    host: {
      sinkOptions: { cellWidth: CELL_WIDTH, cellHeight: CELL_HEIGHT, font: '13px ui-monospace, monospace' },
      platformOptions: { textInput: 'target' },
    },
  });
  // Present the canvas only when the window state changes. The DOM client scrolls
  // independently and needs no idle rendering from the desktop behind it.
  presenter.host.renderLoop.stop();
  root.tabIndex = -1;
  const canvas = presenter.host.element;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;position:absolute;left:0;top:0;max-width:none;max-height:none';
  const restore = document.createElement('button');
  restore.type = 'button';
  restore.textContent = 'Open demo atlas';
  restore.hidden = true;
  restore.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;padding:.8em 1.2em';
  root.after(restore);

  let app;
  let disposed = false;
  let frameId = 0;
  let animationUntil = 0;
  let ready = false;
  const removeEvents = [];

  function fallback(error) {
    if (disposed) return;
    disposed = true;
    if (error) console.warn('The demo atlas is using the HTML view.', error);
    cancelAnimationFrame(frameId);
    for (const remove of removeEvents) remove();
    presenter.dispose();
    root.hidden = true;
    restore.remove();
    if (originalStyle === null) atlas.removeAttribute('style');
    else atlas.setAttribute('style', originalStyle);
    atlas.hidden = false;
    document.documentElement.classList.remove('exowebtui-ready');
  }

  function project(windows, blocked, _theme, animating) {
    const top = windows.at(-1);
    const visible = top?.id === WINDOW_ID && top.state !== 'minimized' && top.clientRect.width > 0 && top.clientRect.height > 0;
    if (visible && !ready) {
      ready = true;
      document.documentElement.classList.add('exowebtui-ready');
      root.style.visibility = 'visible';
      Object.assign(atlas.style, { position: 'fixed', margin: '0', boxSizing: 'border-box', overflow: 'auto' });
    }
    if (!ready) return;
    atlas.hidden = blocked || animating || !visible;
    restore.hidden = blocked || animating || windows.some(window => window.state !== 'minimized');
    if (visible && !atlas.hidden) {
      const { column, row, width, height } = top.clientRect;
      Object.assign(atlas.style, {
        left: `${column * CELL_WIDTH}px`, top: `${row * CELL_HEIGHT}px`,
        width: `${width * CELL_WIDTH}px`, height: `${height * CELL_HEIGHT}px`,
      });
    }
    if (animating) animationUntil = Math.max(animationUntil, performance.now() + 120);
  }

  function render(now) {
    frameId = 0;
    if (disposed || document.hidden) return;
    try {
      const size = presenter.size();
      canvas.style.width = `${size.columns * CELL_WIDTH}px`;
      canvas.style.height = `${size.rows * CELL_HEIGHT}px`;
      presenter.present(app.frame(now, size));
      presenter.host.canvas.render();
      if (now < animationUntil) schedule();
    } catch (error) {
      fallback(error);
    }
  }

  function schedule() {
    if (!frameId && !disposed && !document.hidden) frameId = requestAnimationFrame(render);
  }

  const atlasWindow = {
    id: WINDOW_ID, title: 'Demo Atlas', summary: 'Browse and launch PeerCompute demos.',
    window: { width: 512, height: 256, minWidth: 18, minHeight: 6, widthRatio: 0.97, heightRatio: 0.97, fullscreenBelow: 800 },
    // The HTML client renders the window contents. When menus take focus the
    // shell's underlying client surface remains available for compositing.
    render: () => [],
  };
  // Read the anchors after the gallery has applied its preview or Pages URLs.
  // Activating the same anchors preserves browser navigation and query handling.
  const demos = [...atlas.querySelectorAll('a[data-demo-dir]')];
  const linkByUrl = new Map(demos.map(anchor => [anchor.href, anchor]));
  const menuLinks = demos.map(anchor => ({
    id: `launch-${anchor.dataset.demoDir}-${anchor.dataset.demoPath}`,
    title: anchor.querySelector('h2').textContent.trim(),
    summary: anchor.querySelector('p').textContent.trim(),
    href: anchor.href,
  }));
  const source = atlas.querySelector('a.source[href]');
  if (source) menuLinks.push({ id: 'source', title: 'Project source', summary: 'Open the PeerCompute repository.', href: source.href });
  try {
    app = createDesktopApp({
      applications: [atlasWindow], initialWindow: WINDOW_ID, startLabel: 'PeerCompute',
      viewportWidth: () => root.clientWidth,
      reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
      hiddenMenuIds: ['about', 'exomonitor', 'neon', 'viz', 'three', 'clock', 'font-generator', 'builder', 'settings', 'help', 'workbench', 'jsr', 'github'],
      menuLinks,
      openExternal: url => {
        const demo = linkByUrl.get(url);
        if (demo) demo.click();
        else if (source && url === source.href) source.click();
      },
      onWindows: project,
    });
    await app.init(presenter);
    for (const [subscribe, handle] of [['onKey', 'key'], ['onPointer', 'pointer'], ['onWheel', 'wheel'], ['onResize', 'resize']]) {
      removeEvents.push(presenter[subscribe](event => {
        app[handle](event);
        schedule();
      }));
    }
    const reopen = () => {
      app.openWindow(WINDOW_ID);
      schedule();
      requestAnimationFrame(() => atlas.querySelector('a[href],button:not([disabled])')?.focus());
    };
    restore.addEventListener('click', reopen);
    document.addEventListener('visibilitychange', schedule);
    window.addEventListener('pageshow', schedule);
    window.addEventListener('resize', schedule);
    const clock = setInterval(schedule, 60_000);
    removeEvents.push(() => {
      clearInterval(clock);
      document.removeEventListener('visibilitychange', schedule);
      window.removeEventListener('pageshow', schedule);
      window.removeEventListener('resize', schedule);
    });
    schedule();
  } catch (error) {
    fallback(error);
  }
}

const desktop = document.getElementById('desktop');
const atlas = document.getElementById('atlas');
if (desktop && atlas) mountDesktop(desktop, atlas).catch(error => {
  desktop.hidden = true;
  console.warn('The demo atlas is using the HTML view.', error);
});
