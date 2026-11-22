import { webPresenter } from '@exotui/web';
import { TiledWorkspaceController } from '@exotui/tiled';
import { WorkbenchWindowHostController } from '@exotui/window-host';
import {
  paintShellWindowChrome,
  paintShellTabStrip,
  solidGround,
  shellFitText
} from '@exotui/shell';
import {
  SHELL_THEMES,
  shellThemeById,
  shellActiveTitlebarForeground
} from '@exotui/theme';

const BORDER_ACTIVE = Object.freeze({
  topLeft: '╔', top: '═', topRight: '╗',
  left: '║', right: '║',
  bottomLeft: '╚', bottom: '═', bottomRight: '╝'
});

const BORDER_INACTIVE = Object.freeze({
  topLeft: '┌', top: '─', topRight: '┐',
  left: '│', right: '│',
  bottomLeft: '└', bottom: '─', bottomRight: '┘'
});

const FRAME_PREFIX = 'peercompute-atlas-demo:';
const RETURN_SIGNAL = 'peercompute.atlas.return.v1';
const CELL_WIDTH = 9;
const CELL_HEIGHT = 18;

export function detectEmbeddedMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('embedded') === '1' || params.get('embed') === '1') return true;
    if (window.name && window.name.startsWith(FRAME_PREFIX)) return true;
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  return false;
}

export function returnToPeerComputeAtlas() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(RETURN_SIGNAL, '*');
      return true;
    }
  } catch {
    // Ignore cross-origin error
  }
  return false;
}

function rgbCss(rgb = [14, 21, 34]) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function createFrameSurface(columns, rows, background) {
  const frame = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ char: ' ', background }))
  );

  const surface = {
    cell(col, row, char, style = {}) {
      const c = Math.floor(col);
      const r = Math.floor(row);
      if (r < 0 || r >= rows || c < 0 || c >= columns) return;
      frame[r][c] = {
        char: char || ' ',
        foreground: style.foreground,
        background: style.background ?? background,
        bold: Boolean(style.bold)
      };
    },
    write(col, row, text, style = {}) {
      const r = Math.floor(row);
      if (r < 0 || r >= rows) return;
      let c = Math.floor(col);
      for (const ch of String(text ?? '')) {
        if (c >= columns) break;
        if (c >= 0) {
          frame[r][c] = {
            char: ch,
            foreground: style.foreground,
            background: style.background ?? background,
            bold: Boolean(style.bold)
          };
        }
        c += 1;
      }
    },
    fill(rect, char, style = {}) {
      if (!rect) return;
      const x0 = Math.max(0, Math.floor(rect.column));
      const y0 = Math.max(0, Math.floor(rect.row));
      const x1 = Math.min(columns, Math.floor(rect.column + rect.width));
      const y1 = Math.min(rows, Math.floor(rect.row + rect.height));
      for (let r = y0; r < y1; r += 1) {
        for (let c = x0; c < x1; c += 1) {
          frame[r][c] = {
            char: char || ' ',
            foreground: style.foreground,
            background: style.background ?? background,
            bold: Boolean(style.bold)
          };
        }
      }
    }
  };

  return { frame, surface };
}

// CRT-aware client projection adapted from PeerCompute Gallery's ExoWebTUI frame-windows.
function projectCellRectToPixels(rect, size, bounds, curve = 0, outer = false) {
  const x0 = rect.column / size.columns;
  const x1 = (rect.column + rect.width) / size.columns;
  const y0 = rect.row / size.rows;
  const y1 = (rect.row + rect.height) / size.rows;

  if (!curve) {
    return {
      left: bounds.left + x0 * bounds.width,
      top: bounds.top + y0 * bounds.height,
      width: Math.max(0, (x1 - x0) * bounds.width),
      height: Math.max(0, (y1 - y0) * bounds.height)
    };
  }

  function toScreen(x, y) {
    const u = 2 * x - 1;
    const v = 2 * y - 1;
    const bend = curve * (u * u + v * v);
    let scale = 1;
    for (let i = 0; i < 4; i += 1) {
      const k = bend * scale * scale;
      scale -= ((1 - curve + k) * scale - 1) / (1 - curve + 3 * k);
    }
    return { x: (1 + u * scale) / 2, y: (1 + v * scale) / 2 };
  }

  const xs = [x0, Math.max(x0, Math.min(0.5, x1)), x1];
  const ys = [y0, Math.max(y0, Math.min(0.5, y1)), y1];
  const start = outer ? Math.min : Math.max;
  const end = outer ? Math.max : Math.min;
  const left = start(...ys.map((y) => toScreen(x0, y).x));
  const right = end(...ys.map((y) => toScreen(x1, y).x));
  const top = start(...xs.map((x) => toScreen(x, y0).y));
  const bottom = end(...xs.map((x) => toScreen(x, y1).y));
  return {
    left: bounds.left + left * bounds.width,
    top: bounds.top + top * bounds.height,
    width: Math.max(0, (right - left) * bounds.width),
    height: Math.max(0, (bottom - top) * bounds.height)
  };
}

// Subtract a higher window's full outer chrome rect from a lower window's visible DOM area
// so higher ExoWebTUI titlebars, borders, and controls are NEVER obscured by lower DOM stages!
function subtractRect(box, cover) {
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  const x0 = Math.max(box.left, cover.left);
  const y0 = Math.max(box.top, cover.top);
  const x1 = Math.min(right, cover.left + cover.width);
  const y1 = Math.min(bottom, cover.top + cover.height);
  if (x1 <= x0 || y1 <= y0) return [box];
  return [
    { left: box.left, top: box.top, width: box.width, height: y0 - box.top },
    { left: box.left, top: y1, width: box.width, height: bottom - y1 },
    { left: box.left, top: y0, width: x0 - box.left, height: y1 - y0 },
    { left: x1, top: y0, width: right - x1, height: y1 - y0 }
  ].filter((part) => part.width > 0.5 && part.height > 0.5);
}

export function applyThemeCssVars(theme) {
  const root = document.documentElement.style;
  root.setProperty('--vs-bg', rgbCss(theme.background));
  root.setProperty('--vs-surface', rgbCss(theme.surface));
  root.setProperty('--vs-surface-strong', rgbCss(theme.surfaceStrong));
  root.setProperty('--vs-border', rgbCss(theme.border));
  root.setProperty('--vs-text', rgbCss(theme.text));
  root.setProperty('--vs-muted', rgbCss(theme.muted));
  root.setProperty('--vs-accent', rgbCss(theme.accent));
  root.setProperty('--vs-accent-fg', rgbCss(shellActiveTitlebarForeground(theme)));
  root.setProperty('--vs-success', rgbCss(theme.success));
  root.setProperty('--vs-warning', rgbCss(theme.warning));
  root.setProperty('--vs-danger', rgbCss(theme.danger));
}

/**
 * Stripped-down ExoWebTUI desktop window manager built directly on ExoTUI's
 * real `webPresenter`, `TiledWorkspaceController`, `WorkbenchWindowHostController`,
 * `paintShellWindowChrome`, and `SHELL_THEMES`.
 *
 * Works identically standalone OR embedded inside the PeerCompute ExoWebTUI launcher.
 */
export function createExoWebTuiDesktop({
  surfaceElement,
  stageLayerElement,
  initialThemeId = 'matrix',
  embedded = detectEmbeddedMode(),
  onThemeChange,
  onWindowClosed
} = {}) {
  let theme = shellThemeById(initialThemeId);
  applyThemeCssVars(theme);

  let crtEnabled = false;
  let presenter = null;
  let fallbackMode = false;
  let animationId = 0;
  let disposed = false;
  let dirty = true;
  let lastLayoutKey = '';
  let bottomTabs = [];

  // Window registry: id -> { descriptor, stage, contentEl, shieldEl, closable, onResize }
  const windows = new Map();
  let windowOrder = [];

  const workspace = new TiledWorkspaceController({ gap: 0 });
  const host = new WorkbenchWindowHostController({
    workspace,
    windows: [],
    snapOnRelease: true
  });

  function currentBounds() {
    if (!presenter) {
      return { column: 0, row: 0, width: 140, height: 42 };
    }
    const size = presenter.size();
    return {
      column: 0,
      row: 0,
      width: Math.max(20, size.columns),
      height: Math.max(8, size.rows - 1) // reserve bottom row for ExoWebTUI taskbar/shelf
    };
  }

  function shelfRect() {
    if (!presenter) return { column: 0, row: 42, width: 140, height: 1 };
    const size = presenter.size();
    return { column: 0, row: Math.max(0, size.rows - 1), width: Math.max(20, size.columns), height: 1 };
  }

  function getDescriptors() {
    return windowOrder
      .map((id) => windows.get(id)?.descriptor)
      .filter(Boolean);
  }

  function reconcileHost() {
    host.reconcileWindows(getDescriptors());
    dirty = true;
    lastLayoutKey = '';
  }

  function createStageDom(id, title) {
    const stage = document.createElement('section');
    stage.className = 'vs-win-stage';
    stage.dataset.windowId = id;
    stage.setAttribute('aria-label', title);

    const content = document.createElement('div');
    content.className = 'vs-win-content';

    const shield = document.createElement('button');
    shield.type = 'button';
    shield.className = 'vs-win-focus-shield';
    shield.setAttribute('aria-label', `Focus ${title}`);
    shield.hidden = true;
    shield.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      focusWindow(id);
    });

    // Clicking anywhere inside a tiled window focuses it cleanly in ExoTUI
    stage.addEventListener('pointerdown', () => {
      const activeId = host.controller.inspect().activeWindowId;
      if (activeId !== id) focusWindow(id);
    }, { capture: true });

    stage.append(content, shield);
    stageLayerElement.append(stage);
    return { stage, content, shield };
  }

  function addWindow({
    id,
    title,
    tabLabel,
    placement = 'tiled',
    floatingRect,
    minWidth = 24,
    minHeight = 8,
    closable = false,
    onMount
  }) {
    if (windows.has(id)) {
      focusWindow(id);
      return windows.get(id);
    }
    const descriptor = {
      id,
      title,
      placement,
      minWidth,
      minHeight,
      ...(floatingRect ? { floatingRect } : {})
    };
    const { stage, content, shield } = createStageDom(id, title);
    const record = { id, descriptor, tabLabel: tabLabel || title, stage, content, shield, closable };
    windows.set(id, record);
    windowOrder.push(id);
    reconcileHost();

    if (typeof onMount === 'function') {
      onMount(content, record);
    }

    // Arrange cleanly into a 2x2 tiled grid when initial 4 windows are added
    focusWindow(id);
    renderNow();
    return record;
  }

  function setWindowTitle(id, title) {
    const rec = windows.get(id);
    if (!rec) return;
    rec.descriptor.title = title;
    rec.stage.setAttribute('aria-label', title);
    reconcileHost();
  }

  function removeWindow(id) {
    const rec = windows.get(id);
    if (!rec) return;
    rec.stage.remove();
    windows.delete(id);
    windowOrder = windowOrder.filter((item) => item !== id);
    reconcileHost();
    onWindowClosed?.(id);
  }

  function focusWindow(id) {
    if (!windows.has(id)) return;
    const inspected = host.controller.inspect().windows.find((w) => w.id === id);
    if (inspected && (inspected.state === 'minimized' || inspected.state === 'closed')) {
      host.execute({ kind: 'restore', id }, currentBounds());
    }
    host.execute({ kind: 'focus', id }, currentBounds());
    dirty = true;
    renderNow();
  }

  function tileAll() {
    const bounds = currentBounds();
    const ids = windowOrder.filter((id) => windows.has(id));
    for (const id of ids) {
      host.execute({ kind: 'restore', id }, bounds);
      host.execute({ kind: 'set-placement', id, placement: 'tiled' }, bounds);
    }
    // Use ExoTUI's official WorkbenchWindowHostController `dock` commands
    // so registration generations and history invariants stay 100% valid!
    if (ids.length >= 2) {
      host.execute({ kind: 'dock', id: ids[1], targetId: ids[0], edge: 'right', ratio: 0.48 }, bounds);
    }
    if (ids.length >= 3) {
      host.execute({ kind: 'dock', id: ids[2], targetId: ids[0], edge: 'bottom', ratio: 0.44 }, bounds);
    }
    if (ids.length >= 4) {
      host.execute({ kind: 'dock', id: ids[3], targetId: ids[1], edge: 'bottom', ratio: 0.42 }, bounds);
    }
    for (let i = 4; i < ids.length; i += 1) {
      host.execute({ kind: 'dock', id: ids[i], targetId: ids[2], edge: 'bottom', ratio: 0.5 }, bounds);
    }
    if (ids.length > 0) {
      host.execute({ kind: 'focus', id: ids[0] }, bounds);
    }
    dirty = true;
    lastLayoutKey = '';
    renderNow();
  }

  function cascadeAll() {
    const bounds = currentBounds();
    const ids = windowOrder.filter((id) => windows.has(id));
    const winW = Math.max(36, Math.floor(bounds.width * 0.62));
    const winH = Math.max(14, Math.floor(bounds.height * 0.64));
    ids.forEach((id, idx) => {
      const col = Math.min(Math.max(1, bounds.width - winW - 1), 2 + idx * 5);
      const row = Math.min(Math.max(1, bounds.height - winH - 1), 1 + idx * 2);
      host.execute({ kind: 'restore', id }, bounds);
      host.execute({
        kind: 'set-placement',
        id,
        placement: 'floating',
        rect: { column: col, row, width: winW, height: winH }
      }, bounds);
    });
    if (ids.length) host.execute({ kind: 'focus', id: ids[ids.length - 1] }, bounds);
    dirty = true;
    lastLayoutKey = '';
    renderNow();
  }

  function setTheme(themeId) {
    theme = shellThemeById(themeId);
    applyThemeCssVars(theme);
    dirty = true;
    lastLayoutKey = '';
    onThemeChange?.(theme);
    renderNow();
  }

  function setCrtEnabled(enabled) {
    crtEnabled = Boolean(enabled);
    if (presenter?.shader) {
      try {
        presenter.shader.setEnabled(crtEnabled ? ['crt'] : []);
      } catch {
        // Headless software WebGL may omit shader pass cleanly
      }
    }
    dirty = true;
    lastLayoutKey = '';
    renderNow();
  }

  function syncCanvasCssSize() {
    if (!presenter?.host?.element) return;
    const size = presenter.size();
    const canvasEl = presenter.host.element;
    // CRITICAL FOR HiDPI (dpr > 1): BrowserCellCanvasSink allocates backing pixels at
    // (columns * CELL_WIDTH * dpr) x (rows * CELL_HEIGHT * dpr) without setting CSS size.
    // Pin CSS size to exact logical (columns * CELL_WIDTH) x (rows * CELL_HEIGHT) px so:
    //  1) Retina/HiDPI displays render razor-sharp at 1:1 logical scale (never 2x oversized)
    //  2) BrowserInputSource pointer math (floor((clientX - left) / CELL_WIDTH)) matches painted cells 100%
    //  3) Projected DOM window stages align subpixel-exact inside ExoWebTUI borders!
    const cssW = `${size.columns * CELL_WIDTH}px`;
    const cssH = `${size.rows * CELL_HEIGHT}px`;
    if (canvasEl.style.width !== cssW) canvasEl.style.width = cssW;
    if (canvasEl.style.height !== cssH) canvasEl.style.height = cssH;
  }

  function projectStages(projection) {
    if (fallbackMode || !presenter) {
      // Pure CSS grid fallback if canvas presenter cannot mount
      stageLayerElement.classList.add('is-fallback-grid');
      for (const rec of windows.values()) {
        rec.stage.hidden = false;
        rec.stage.style.cssText = '';
        rec.shield.hidden = true;
      }
      return;
    }

    syncCanvasCssSize();
    const size = presenter.size();
    const presentingShader = Boolean(crtEnabled && presenter.shader?.isPresenting?.());
    // When unshaded, the canvas has exact CSS size (columns*CELL_WIDTH x rows*CELL_HEIGHT).
    // When CRT shader is actively presenting, the shader canvas fills surfaceElement.
    // Express bounds relative to stageLayerElement (same containing block as surfaceElement)
    // so browser zoom, pinch-zoom (visualViewport), topbar wrapping, and iframe offsets NEVER drift!
    const boundsEl = presentingShader ? surfaceElement : (presenter.host?.element || surfaceElement);
    const rawBounds = boundsEl.getBoundingClientRect();
    const stageRect = stageLayerElement.getBoundingClientRect();
    const bounds = {
      left: rawBounds.left - stageRect.left,
      top: rawBounds.top - stageRect.top,
      width: rawBounds.width,
      height: rawBounds.height
    };
    const curve = (presentingShader && presenter.shader?.enabled?.().includes('crt'))
      ? (presenter.shader.option('crt', 'curve') ?? 0)
      : 0;

    // Close/cleanup any dynamic closable windows the user clicked × on in ExoTUI chrome!
    const inspected = host.controller.inspect();
    for (const winState of inspected.windows) {
      if (winState.state === 'closed') {
        const rec = windows.get(winState.id);
        if (rec?.closable) {
          removeWindow(winState.id);
          return;
        }
      }
    }

    const layoutKey = [
      size.columns, size.rows,
      Math.round(bounds.left), Math.round(bounds.top), Math.round(bounds.width), Math.round(bounds.height),
      theme.id, curve,
      ...projection.windows.map((w) =>
        `${w.id}:${w.active}:${w.placement}:${w.zIndex}:`
        + `${w.rect.column},${w.rect.row},${w.rect.width},${w.rect.height}:`
        + `${w.clientRect.column},${w.clientRect.row},${w.clientRect.width},${w.clientRect.height}`
      )
    ].join('|');

    if (layoutKey === lastLayoutKey) return;
    lastLayoutKey = layoutKey;

    // Precompute outer chrome pixel bounds for every window in paint order
    // so lower DOM stages clip cleanly around higher windows' titlebars & borders!
    const outerCovers = projection.windows.map((w) =>
      projectCellRectToPixels(w.rect, size, bounds, curve, true)
    );

    const visibleIds = new Set();
    for (let idx = 0; idx < projection.windows.length; idx += 1) {
      const win = projection.windows[idx];
      const rec = windows.get(win.id);
      if (!rec) continue;
      visibleIds.add(win.id);
      const box = projectCellRectToPixels(win.clientRect, size, bounds, curve, false);
      const tiny = box.width < 24 || box.height < 18;
      const visibleParts = outerCovers.slice(idx + 1).reduce(
        (parts, cover) => parts.flatMap((part) => subtractRect(part, cover)),
        [box]
      );
      const fullyCovered = visibleParts.length === 0;
      rec.stage.hidden = tiny || fullyCovered;
      rec.stage.style.left = `${box.left.toFixed(1)}px`;
      rec.stage.style.top = `${box.top.toFixed(1)}px`;
      rec.stage.style.width = `${box.width.toFixed(1)}px`;
      rec.stage.style.height = `${box.height.toFixed(1)}px`;
      rec.stage.style.zIndex = String(10 + idx);
      rec.stage.classList.toggle('is-active', win.active);

      const unclipped = visibleParts.length === 1
        && Math.abs(visibleParts[0].left - box.left) < 0.5
        && Math.abs(visibleParts[0].top - box.top) < 0.5
        && Math.abs(visibleParts[0].width - box.width) < 0.5
        && Math.abs(visibleParts[0].height - box.height) < 0.5;
      if (fullyCovered) {
        rec.stage.style.clipPath = 'inset(50%)';
      } else if (unclipped) {
        rec.stage.style.clipPath = '';
      } else {
        const paths = visibleParts.map(
          (p) => `M${(p.left - box.left).toFixed(1)},${(p.top - box.top).toFixed(1)}h${p.width.toFixed(1)}v${p.height.toFixed(1)}h${(-p.width).toFixed(1)}Z`
        );
        rec.stage.style.clipPath = `path("${paths.join(' ')}")`;
      }

      // Only show focus shield for inactive FLOATING windows (tiled windows stay directly interactive!)
      rec.shield.hidden = win.active || win.placement === 'tiled';
    }

    for (const [id, rec] of windows.entries()) {
      if (!visibleIds.has(id)) {
        rec.stage.hidden = true;
      }
    }
  }

  function paintDesktopFrame() {
    if (!presenter || disposed) return;
    const size = presenter.size();
    if (size.columns < 10 || size.rows < 6) return;

    const bounds = currentBounds();
    const sRect = shelfRect();
    const projection = host.project(bounds, {
      shelfBounds: sRect,
      doubleClickMaximizeMs: 320
    });

    const { frame, surface } = createFrameSurface(size.columns, size.rows, theme.background);

    // Subtle terminal dot-grid wallpaper on empty desktop background
    for (let r = 0; r < bounds.height; r += 2) {
      for (let c = 0; c < bounds.width; c += 4) {
        surface.cell(c, r, '·', { foreground: theme.surfaceStrong, background: theme.background });
      }
    }

    // Paint tiled separators
    for (const sep of projection.separators) {
      const ch = sep.axis === 'column' ? '│' : '─';
      surface.fill(sep.rect, ch, { foreground: theme.border, background: theme.background });
    }

    // Paint all windows (tiled then floating) using real ExoTUI paintShellWindowChrome!
    const activeTitleFg = shellActiveTitlebarForeground(theme);
    for (const win of projection.windows) {
      const active = win.active;
      const borderFg = active ? theme.accent : theme.border;
      const titleBg = active ? theme.accent : theme.surfaceStrong;
      const titleFg = active ? activeTitleFg : theme.text;
      const placementGlyph = win.placement === 'floating' ? '◈' : '▪';
      paintShellWindowChrome(surface, win, {
        surfaceFill: { foreground: theme.text, background: theme.surface },
        borderGlyphs: active ? BORDER_ACTIVE : BORDER_INACTIVE,
        borderForeground: borderFg,
        chromeGround: solidGround(theme.surface),
        titleBarGround: solidGround(titleBg),
        titleBarFillForeground: titleFg,
        titleText: `${placementGlyph} ${win.title}`,
        titleForeground: titleFg,
        titleBold: active,
        controlBold: (ctrl) => active || ctrl.tone === 'danger',
        controlForeground: titleFg
      });
    }

    // Paint snap preview outline during drag
    if (projection.snapPreview) {
      const r = projection.snapPreview.rect;
      for (let c = r.column; c < r.column + r.width; c += 1) {
        surface.cell(c, r.row, '░', { foreground: theme.warning, background: theme.background });
        surface.cell(c, r.row + r.height - 1, '░', { foreground: theme.warning, background: theme.background });
      }
    }

    // Bottom ExoWebTUI taskbar / window shelf (clicking any tab focuses or restores!)
    surface.fill(sRect, ' ', { foreground: theme.muted, background: theme.surfaceStrong });
    const inspected = host.controller.inspect();
    const tabs = windowOrder
      .map((id) => {
        const rec = windows.get(id);
        const st = inspected.windows.find((w) => w.id === id);
        if (!rec || !st) return null;
        return {
          id,
          label: `${st.state === 'minimized' ? '▽ ' : st.state === 'closed' ? '○ ' : ''}${rec.tabLabel || rec.descriptor.title}`,
          active: st.id === inspected.activeWindowId && st.state !== 'minimized' && st.state !== 'closed',
          dimmed: st.state === 'minimized' || st.state === 'closed'
        };
      })
      .filter(Boolean);

    const statusTail = ` ${embedded ? 'EMBEDDED' : 'STANDALONE'} · ExoWebTUI · ${theme.label} `;
    bottomTabs = paintShellTabStrip(
      surface,
      sRect,
      tabs,
      {
        activeTab: { foreground: activeTitleFg, background: theme.accent, bold: true },
        tab: { foreground: theme.text, background: theme.surface },
        dimmedTab: { foreground: theme.muted, background: theme.background }
      },
      statusTail.length + 1
    );
    const tailCol = Math.max(0, sRect.width - statusTail.length);
    surface.write(tailCol, sRect.row, shellFitText(statusTail, sRect.width - tailCol), {
      foreground: theme.muted,
      background: theme.surfaceStrong
    });

    presenter.present(frame);
    projectStages(projection);
    dirty = false;
  }

  function renderNow() {
    if (disposed) return;
    if (fallbackMode) {
      projectStages(null);
      return;
    }
    try {
      paintDesktopFrame();
    } catch (err) {
      console.warn('[ExoWebTUI] Falling back to CSS grid layout:', err);
      fallbackMode = true;
      projectStages(null);
    }
  }

  const cleanupListeners = [];

  function handlePointerInput(event) {
    if (disposed || fallbackMode) return;
    const bounds = currentBounds();
    const sRect = shelfRect();

    // Check bottom taskbar tab click first
    if (event.kind === 'down' && event.coordinates?.cell) {
      const { x, y } = event.coordinates.cell;
      if (y === sRect.row) {
        for (const tab of bottomTabs) {
          if (x >= tab.rect.column && x < tab.rect.column + tab.rect.width) {
            focusWindow(tab.id);
            return;
          }
        }
      }
    }

    host.handlePointer(event, bounds, {
      shelfBounds: sRect,
      doubleClickMaximizeMs: 320
    });
    dirty = true;
    renderNow();
  }

  // While dragging on the ExoWebTUI canvas (titlebars / splitters / floating borders),
  // suppress pointer events on projected DOM stages so drags never drop mid-flight!
  const endDrag = () => stageLayerElement.classList.remove('is-shell-dragging');
  const startDrag = () => stageLayerElement.classList.add('is-shell-dragging');
  surfaceElement.addEventListener('pointerdown', startDrag, { capture: true });
  window.addEventListener('pointerup', endDrag, { capture: true });
  window.addEventListener('pointercancel', endDrag, { capture: true });
  window.addEventListener('blur', endDrag);

  function mountPresenter() {
    // Never overwrite surfaceElement.style.width/height with stale pixel integers;
    // CSS `position: absolute; inset: 0; width: 100%; height: 100%` keeps it locked
    // instantaneously to `.vs-desktop-host` across window resizes, browser zoom, and topbar wrap.
    surfaceElement.style.width = '';
    surfaceElement.style.height = '';

    try {
      presenter = webPresenter({
        root: surfaceElement,
        storeDatabase: 'vibeslopdb-exowebtui',
        host: {
          platformOptions: { textInput: 'target' },
          sinkOptions: {
            cellWidth: CELL_WIDTH,
            cellHeight: CELL_HEIGHT,
            font: '13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
          }
        }
      });
      syncCanvasCssSize();
      // Embedded mode leaves CRT to the outer PeerCompute ExoWebTUI launcher by default.
      setCrtEnabled(false);

      const syncPlatformSizeFromSurface = () => {
        if (!presenter?.host?.platform?.size) return;
        const rect = surfaceElement.getBoundingClientRect();
        const cols = Math.max(1, Math.floor(rect.width / CELL_WIDTH));
        const rows = Math.max(1, Math.floor(rect.height / CELL_HEIGHT));
        const cur = presenter.host.platform.size.peek();
        if (cols !== cur.columns || rows !== cur.rows) {
          cur.columns = cols;
          cur.rows = rows;
        }
      };

      const resyncViewport = () => {
        if (disposed || fallbackMode) return;
        syncPlatformSizeFromSurface();
        syncCanvasCssSize();
        presenter?.host?.canvas?.rerenderAll?.();
        dirty = true;
        lastLayoutKey = '';
        renderNow();
      };

      let resizeTimer = 0;
      const scheduleResync = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resyncViewport, 24);
      };

      cleanupListeners.push(presenter.onPointer((event) => handlePointerInput(event)));
      cleanupListeners.push(presenter.onResize(() => {
        syncCanvasCssSize();
        presenter?.host?.canvas?.rerenderAll?.();
        dirty = true;
        lastLayoutKey = '';
        renderNow();
      }));

      const ro = new ResizeObserver(() => scheduleResync());
      if (surfaceElement.parentElement) ro.observe(surfaceElement.parentElement);
      ro.observe(surfaceElement);

      window.addEventListener('resize', scheduleResync);
      const vv = window.visualViewport;
      vv?.addEventListener('resize', scheduleResync);
      vv?.addEventListener('scroll', scheduleResync);

      // Re-sync whenever browser zoom changes devicePixelRatio
      let dprMedia = null;
      const watchDpr = () => {
        if (disposed || typeof window.matchMedia !== 'function') return;
        dprMedia?.removeEventListener?.('change', onDprChange);
        dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
        dprMedia.addEventListener?.('change', onDprChange);
      };
      const onDprChange = () => {
        scheduleResync();
        watchDpr();
      };
      watchDpr();

      cleanupListeners.push(() => {
        clearTimeout(resizeTimer);
        ro.disconnect();
        window.removeEventListener('resize', scheduleResync);
        vv?.removeEventListener('resize', scheduleResync);
        vv?.removeEventListener('scroll', scheduleResync);
        dprMedia?.removeEventListener?.('change', onDprChange);
      });

      const tick = () => {
        if (disposed) return;
        if (dirty) renderNow();
        animationId = requestAnimationFrame(tick);
      };
      animationId = requestAnimationFrame(tick);
    } catch (err) {
      console.warn('[ExoWebTUI] webPresenter unavailable, using CSS terminal fallback:', err);
      fallbackMode = true;
    }
  }

  mountPresenter();

  return {
    addWindow,
    removeWindow,
    focusWindow,
    setWindowTitle,
    tileAll,
    cascadeAll,
    setTheme,
    setCrtEnabled,
    renderNow,
    isEmbedded: () => embedded,
    isFallback: () => fallbackMode,
    getTheme: () => theme,
    getThemes: () => SHELL_THEMES,
    getWindowIds: () => [...windowOrder],
    getActiveWindowId: () => host.controller.inspect().activeWindowId,
    getWindowRects: () => {
      if (fallbackMode || !presenter) return [];
      const proj = host.project(currentBounds(), { shelfBounds: shelfRect() });
      return proj.windows.map((w) => ({
        id: w.id,
        title: w.title,
        placement: w.placement,
        active: w.active,
        rect: w.rect,
        clientRect: w.clientRect
      }));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(animationId);
      surfaceElement.removeEventListener('pointerdown', startDrag, { capture: true });
      window.removeEventListener('pointerup', endDrag, { capture: true });
      window.removeEventListener('pointercancel', endDrag, { capture: true });
      window.removeEventListener('blur', endDrag);
      for (const off of cleanupListeners) off();
      host.dispose();
      presenter?.dispose?.();
      for (const rec of windows.values()) rec.stage.remove();
      windows.clear();
    }
  };
}
