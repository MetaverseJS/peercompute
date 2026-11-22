import vibeSlopCss from './styles.css?inline';
import inferencePanelCss from '@peercompute-inference/panel.css?inline';
import { shellActiveTitlebarForeground } from '@exotui/theme';
import { DbSessionManager } from './db/sessionManager.js';
import { STARTER_SCHEMAS } from './db/starterSchemas.js';
import { createLocalStateStore } from './state/localStateStore.js';
import { createPeerComputeAiBridge } from './ai/peercomputeBridge.js';
import { createSchemaWindow } from './ui/windows/schemaWindow.js';
import { createChatWindow } from './ui/windows/chatWindow.js';
import { createQueryWindow } from './ui/windows/queryWindow.js';
import { createCarnageWindow } from './ui/windows/carnageWindow.js';
import { disposeExotuiMermaidRenderer } from './mermaid/exotuiMermaidRenderer.js';

const HOST_CSS_ATTR = 'data-vibeslopdb-host-css';
const THEME_CSS_ATTR = 'data-vibeslopdb-theme-css';

function rgbCss(rgb = [14, 21, 34]) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function ensureHostStyles() {
  if (!document.head.querySelector(`style[${HOST_CSS_ATTR}]`)) {
    const style = document.createElement('style');
    style.setAttribute(HOST_CSS_ATTR, '1');
    style.textContent = `${vibeSlopCss}\n${inferencePanelCss}`;
    document.head.append(style);
  }
}

function applyScopedTheme(theme) {
  if (!theme) return;
  let style = document.head.querySelector(`style[${THEME_CSS_ATTR}]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute(THEME_CSS_ATTR, '1');
    document.head.append(style);
  }
  const accentFg = shellActiveTitlebarForeground(theme);
  style.textContent = `.vs-scope, .vs-models-host, .vs-models-dialog {
  --vs-bg: ${rgbCss(theme.background)};
  --vs-surface: ${rgbCss(theme.surface)};
  --vs-surface-strong: ${rgbCss(theme.surfaceStrong)};
  --vs-border: ${rgbCss(theme.border)};
  --vs-text: ${rgbCss(theme.text)};
  --vs-muted: ${rgbCss(theme.muted)};
  --vs-accent: ${rgbCss(theme.accent)};
  --vs-accent-fg: ${rgbCss(accentFg)};
  --vs-success: ${rgbCss(theme.success || theme.accent)};
  --vs-warning: ${rgbCss(theme.warning || theme.accent)};
  --vs-danger: ${rgbCss(theme.danger || [255, 91, 91])};
}`;
}

function computeQuadRects(body, windowIds) {
  const col = body.column ?? 0;
  const row = body.row ?? 1;
  const width = Math.max(24, body.width ?? 120);
  const height = Math.max(12, body.height ?? 40);
  const compact = width < 84 || height < 22;

  if (compact) {
    return windowIds.map((id) => ({
      id,
      rect: { column: col, row, width, height }
    }));
  }

  const leftW = Math.max(28, Math.floor(width * 0.52));
  const rightW = Math.max(28, width - leftW);
  const topH = Math.max(10, Math.floor(height * 0.54));
  const bottomH = Math.max(10, height - topH);

  const schemaId = windowIds.find((id) => id === 'vibeslopdb-schema');
  const chatId = windowIds.find((id) => id === 'vibeslopdb-chat');
  const carnageId = windowIds.find((id) => id === 'vibeslopdb-carnage');
  const queryIds = windowIds.filter((id) => id.startsWith('vibeslopdb-query-'));

  const placements = [];
  if (schemaId) {
    placements.push({ id: schemaId, rect: { column: col, row, width: leftW, height: topH } });
  }
  if (chatId) {
    placements.push({ id: chatId, rect: { column: col + leftW, row, width: rightW, height: topH } });
  }
  if (queryIds.length > 0) {
    const sliceW = Math.max(24, Math.floor(leftW / queryIds.length));
    queryIds.forEach((qid, idx) => {
      const isLast = idx === queryIds.length - 1;
      const x = col + idx * sliceW;
      const w = isLast ? Math.max(24, col + leftW - x) : sliceW;
      placements.push({ id: qid, rect: { column: x, row: row + topH, width: w, height: bottomH } });
    });
  }
  if (carnageId) {
    placements.push({ id: carnageId, rect: { column: col + leftW, row: row + topH, width: rightW, height: bottomH } });
  }
  // Place any unexpected extra windows cleanly cascaded
  const placed = new Set(placements.map((p) => p.id));
  windowIds.filter((id) => !placed.has(id)).forEach((id, idx) => {
    const w = Math.min(width - 4, 68);
    const h = Math.min(height - 4, 22);
    placements.push({
      id,
      rect: {
        column: col + Math.min(width - w, 4 + idx * 4),
        row: row + Math.min(height - h, 2 + idx * 2),
        width: w,
        height: h
      }
    });
  });
  return placements;
}

/**
 * Mount VibeSlopDB directly inside the PeerCompute ExoWebTUI desktop so its
 * Schema ER, YOLO Chat, SQL Query #1..N, and Carnage Log panels each run as
 * individual first-class PeerCompute ExoWebTUI windows sharing one live DB,
 * PeerCompute StateManager store, and PeerCompute LLM bridge.
 */
export async function mountVibeSlopDbHost(host) {
  ensureHostStyles();
  let activeTheme = host.getTheme?.() || null;
  applyScopedTheme(activeTheme);

  const localStore = createLocalStateStore({ docName: 'vibeslopdb-local-state-v1' });
  await localStore.init();
  const savedPrefs = localStore.getAllPrefs();

  const initialEngine = ['sqlite', 'pglite', 'indexeddb'].includes(savedPrefs.engineId)
    ? savedPrefs.engineId
    : 'sqlite';
  const savedDbEntry = localStore.loadDatabaseSnapshot(initialEngine);
  const initialStarter = STARTER_SCHEMAS[savedDbEntry?.starterId]
    ? savedDbEntry.starterId
    : (STARTER_SCHEMAS[savedPrefs.starterId] ? savedPrefs.starterId : 'startup_prod');
  const initialYolo = savedPrefs.yoloMode !== false;

  const sessionManager = new DbSessionManager({
    engineId: initialEngine,
    starterId: initialStarter
  });

  let hwLabel = 'PeerCompute HW';
  const aiBridge = createPeerComputeAiBridge({
    sessionManager,
    onCapabilitiesReady: (caps) => {
      const tier = caps?.tier || 'unknown';
      const cores = caps?.cpu?.cores ?? caps?.cpu?.logicalCores ?? navigator.hardwareConcurrency ?? 0;
      const webgpuReady = Boolean(caps?.webgpu?.available || caps?.gpu?.webgpu);
      const gpuLabel = webgpuReady
        ? (caps?.webgpu?.adapter?.architecture || caps?.webgpu?.adapter?.vendor || caps?.gpu?.adapterInfo?.vendor || 'WebGPU')
        : 'CPU-only';
      hwLabel = `HW: ${tier} · ${cores}c · ${gpuLabel}`;
    }
  });

  let schemaWin = null;
  let chatWin = null;
  let carnageWin = null;
  const queryWindows = new Map();
  const openIds = new Set();
  let querySeq = 0;
  let disposed = false;
  let closingAll = false;
  let persistTimer = 0;

  async function persistNow() {
    clearTimeout(persistTimer);
    persistTimer = 0;
    if (disposed) return;
    const st = sessionManager.getState();
    localStore.setPref('engineId', st.engineId);
    localStore.setPref('starterId', st.starterId);
    const snap = await sessionManager.exportCurrentSnapshot().catch(() => null);
    if (snap) {
      localStore.saveDatabaseSnapshot(st.engineId, { starterId: st.starterId, snapshot: snap });
    }
  }

  function schedulePersist() {
    clearTimeout(persistTimer);
    persistTimer = window.setTimeout(() => { void persistNow(); }, 200);
  }

  const unsubSession = sessionManager.subscribe((ev) => {
    if (ev.type === 'schema-updated' && ev.reason !== 'state-restore') {
      schedulePersist();
    }
  });

  const unsubTheme = host.onThemeChange?.((nextTheme) => {
    activeTheme = nextTheme;
    applyScopedTheme(nextTheme);
    void schemaWin?.refresh({ autoFit: false });
  });

  function checkEmptyAndDispose() {
    if (!disposed && !closingAll && openIds.size === 0) {
      void dispose();
    }
  }

  function sharedNavActions() {
    return [
      {
        id: 'new-query',
        label: '+ Query',
        title: 'Spawn another independent VibeSlopDB SQL Query window (Alt+N)',
        onClick: () => {
          spawnQueryWindow({
            initialSql: '-- Independent query window\nSELECT * FROM users LIMIT 10;',
            cascade: true
          });
        }
      },
      {
        id: 'tile-db',
        label: 'Tile DB',
        title: 'Arrange all open VibeSlopDB windows into a clean grid (Alt+T)',
        onClick: () => tileAll()
      },
      {
        id: 'close-db',
        label: 'Close DB',
        title: 'Save database, close all VibeSlopDB windows, and return to PeerCompute',
        onClick: () => { void closeAll(); }
      }
    ];
  }

  function getPrimaryQueryEntry() {
    const first = queryWindows.entries().next().value;
    if (first) return { id: first[0], instance: first[1] };
    return spawnQueryWindow({ initialSql: '' });
  }

  function spawnQueryWindow({ initialSql = '', autoRun = false, cascade = false, rect = null } = {}) {
    const num = ++querySeq;
    const id = `vibeslopdb-query-${num}`;
    const title = `VibeSlopDB · SQL Query #${num}`;
    const body = host.getBodyBounds();
    const targetRect = rect || (cascade
      ? {
          column: (body.column ?? 0) + Math.min(Math.max(2, (body.width ?? 100) - 68), 6 + ((num - 1) % 4) * 5),
          row: (body.row ?? 1) + Math.min(Math.max(1, (body.height ?? 36) - 22), 3 + ((num - 1) % 4) * 3),
          width: Math.min(Math.max(36, Math.floor((body.width ?? 100) * 0.56)), body.width ?? 100),
          height: Math.min(Math.max(14, Math.floor((body.height ?? 36) * 0.52)), body.height ?? 36)
        }
      : null);

    let instance = null;
    openIds.add(id);
    host.openNativeWindow({
      id,
      title,
      summary: 'VibeSlopDB live SQL query editor and result table.',
      minWidth: 28,
      minHeight: 10,
      rect: targetRect,
      standaloneHref: host.standaloneHref,
      navActions: sharedNavActions(),
      onMount: (contentEl) => {
        contentEl.classList.add('vs-scope', 'vs-host-pane');
        instance = createQueryWindow({
          container: contentEl,
          sessionManager,
          initialSql,
          windowLabel: `SQL Query #${num}`
        });
        queryWindows.set(id, instance);
      },
      onClose: () => {
        openIds.delete(id);
        const q = queryWindows.get(id);
        if (q) {
          q.dispose();
          queryWindows.delete(id);
        }
        checkEmptyAndDispose();
      }
    });

    if (autoRun && instance) {
      void instance.runSql();
    }
    return { id, instance };
  }

  function openSchemaWindow(rect) {
    const id = 'vibeslopdb-schema';
    if (openIds.has(id)) {
      host.focusWindow(id);
      return;
    }
    openIds.add(id);
    host.openNativeWindow({
      id,
      title: 'VibeSlopDB · Schema ER',
      summary: 'Live draggable Mermaid ER schema diagram.',
      minWidth: 32,
      minHeight: 12,
      rect,
      standaloneHref: host.standaloneHref,
      navActions: sharedNavActions(),
      onMount: (contentEl) => {
        contentEl.classList.add('vs-scope', 'vs-host-pane');
        schemaWin = createSchemaWindow({
          container: contentEl,
          sessionManager,
          getTheme: () => activeTheme || host.getTheme?.(),
          onOffsetsChange: (offsets) => {
            localStore.setPref('diagramOffsets', offsets);
          },
          onSelectEntityQuery: (sql) => {
            const { id: qId, instance: q } = getPrimaryQueryEntry();
            q.setSql(sql);
            host.focusWindow(qId);
            void q.runSql();
          }
        });
        if (savedPrefs.diagramOffsets) {
          schemaWin.stage.setCustomOffsets(savedPrefs.diagramOffsets);
        }
      },
      onClose: () => {
        openIds.delete(id);
        schemaWin?.dispose();
        schemaWin = null;
        checkEmptyAndDispose();
      }
    });
  }

  function openChatWindow(rect) {
    const id = 'vibeslopdb-chat';
    if (openIds.has(id)) {
      host.focusWindow(id);
      return;
    }
    openIds.add(id);
    host.openNativeWindow({
      id,
      title: 'VibeSlopDB · YOLO Chat',
      summary: 'YOLO DBA natural-language SQL chat over PeerCompute local/peer inference.',
      minWidth: 32,
      minHeight: 12,
      rect,
      standaloneHref: host.standaloneHref,
      navActions: sharedNavActions(),
      onMount: (contentEl) => {
        contentEl.classList.add('vs-scope', 'vs-host-pane');
        chatWin = createChatWindow({
          container: contentEl,
          sessionManager,
          aiBridge,
          initialYoloMode: initialYolo,
          onYoloChange: (enabled) => {
            localStore.setPref('yoloMode', Boolean(enabled));
          },
          onOpenModels: () => {
            void aiBridge.openModelsModal({ managementOnly: true });
          },
          onSendToQuery: (sql) => {
            const { id: qId, instance: q } = getPrimaryQueryEntry();
            q.setSql(sql);
            host.focusWindow(qId);
          },
          onShowQueryResult: (res, sql) => {
            const { instance: q } = getPrimaryQueryEntry();
            q.showExternalResult(res, sql);
          }
        });
      },
      onClose: () => {
        openIds.delete(id);
        chatWin?.dispose();
        chatWin = null;
        checkEmptyAndDispose();
      }
    });
  }

  function openCarnageWindow(rect) {
    const id = 'vibeslopdb-carnage';
    if (openIds.has(id)) {
      host.focusWindow(id);
      return;
    }
    openIds.add(id);
    host.openNativeWindow({
      id,
      title: 'VibeSlopDB · Carnage Log',
      summary: 'DB engine switcher (SQLite/Postgres/IndexedDB), starter schemas, and time-travel log.',
      minWidth: 30,
      minHeight: 10,
      rect,
      standaloneHref: host.standaloneHref,
      navActions: sharedNavActions(),
      onMount: (contentEl) => {
        contentEl.classList.add('vs-scope', 'vs-host-pane');
        carnageWin = createCarnageWindow({
          container: contentEl,
          sessionManager,
          getPersistedSnapshot: (engineId) => localStore.loadDatabaseSnapshot(engineId),
          onCopyMermaid: async () => {
            const src = schemaWin?.stage?.getMermaidSource() || '';
            if (!src) return false;
            try {
              await navigator.clipboard.writeText(src);
              return true;
            } catch {
              return false;
            }
          },
          onReplaySql: (sql) => {
            const { id: qId, instance: q } = getPrimaryQueryEntry();
            q.setSql(sql);
            host.focusWindow(qId);
          },
          onEngineSwitched: (engineId, starterId, { restored = false } = {}) => {
            localStore.setPref('engineId', engineId);
            localStore.setPref('starterId', starterId);
            if (!restored) {
              const defaultSql = STARTER_SCHEMAS[starterId]?.defaultQuery || '';
              const { instance: q } = getPrimaryQueryEntry();
              q.setSql(defaultSql);
              if (defaultSql && !defaultSql.startsWith('--')) {
                void q.runSql();
              }
            }
          }
        });
      },
      onClose: () => {
        openIds.delete(id);
        carnageWin?.dispose();
        carnageWin = null;
        checkEmptyAndDispose();
      }
    });
  }

  function tileAll() {
    const ids = [...openIds];
    if (!ids.length) return;
    const placements = computeQuadRects(host.getBodyBounds(), ids);
    host.placeWindows(placements);
    if (openIds.has('vibeslopdb-chat')) host.focusWindow('vibeslopdb-chat');
    else if (ids.length) host.focusWindow(ids[0]);
  }

  function openCoreWindows() {
    const coreOrder = ['vibeslopdb-schema', 'vibeslopdb-chat', 'vibeslopdb-query-1', 'vibeslopdb-carnage'];
    const rects = new Map(computeQuadRects(host.getBodyBounds(), coreOrder).map((p) => [p.id, p.rect]));
    openSchemaWindow(rects.get('vibeslopdb-schema'));
    openCarnageWindow(rects.get('vibeslopdb-carnage'));
    if (queryWindows.size === 0) {
      spawnQueryWindow({
        initialSql: STARTER_SCHEMAS[initialStarter]?.defaultQuery || '',
        rect: rects.get('vibeslopdb-query-1')
      });
    }
    openChatWindow(rects.get('vibeslopdb-chat'));
    tileAll();
  }

  const keyHandler = (event) => {
    if (disposed || !event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'n') {
      event.preventDefault();
      spawnQueryWindow({
        initialSql: '-- Independent query window\nSELECT * FROM users LIMIT 10;',
        cascade: true
      });
    } else if (key === 't') {
      event.preventDefault();
      tileAll();
    } else if (key === 'm') {
      event.preventDefault();
      void aiBridge.openModelsModal({ managementOnly: true });
    }
  };
  window.addEventListener('keydown', keyHandler);

  const pageHideHandler = () => {
    void persistNow();
  };
  window.addEventListener('pagehide', pageHideHandler);

  openCoreWindows();

  // Boot hardware probe + database engine, then render ER schema + initial query
  void aiBridge.initCapabilities();
  await sessionManager.init(initialEngine, initialStarter, {
    persistedSnapshot: savedDbEntry?.snapshot || null
  });
  if (disposed) return null;

  await schemaWin?.refresh({ autoFit: true });
  const primary = getPrimaryQueryEntry();
  if (!savedDbEntry?.snapshot) {
    const initialQuery = STARTER_SCHEMAS[initialStarter]?.defaultQuery || '';
    if (initialQuery && !initialQuery.startsWith('--')) {
      await primary.instance?.runSql(initialQuery, 'SEED');
    }
  } else {
    const firstTbl = sessionManager.getState().schema.tables[0]?.name;
    if (firstTbl) {
      await primary.instance?.runSql(`SELECT * FROM "${firstTbl}" LIMIT 25;`, 'RESTORE');
    }
  }

  async function closeAll() {
    if (disposed || closingAll) return;
    closingAll = true;
    await persistNow();
    const ids = [...openIds];
    for (const id of ids) {
      host.closeWindow(id);
    }
    await dispose();
    host.openAtlas?.();
  }

  async function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimeout(persistTimer);
    window.removeEventListener('keydown', keyHandler);
    window.removeEventListener('pagehide', pageHideHandler);
    unsubSession?.();
    unsubTheme?.();
    schemaWin?.dispose();
    schemaWin = null;
    chatWin?.dispose();
    chatWin = null;
    carnageWin?.dispose();
    carnageWin = null;
    for (const q of queryWindows.values()) q.dispose();
    queryWindows.clear();
    openIds.clear();
    await aiBridge.dispose().catch(() => {});
    await sessionManager.dispose().catch(() => {});
    await localStore.dispose().catch(() => {});
    disposeExotuiMermaidRenderer();
    if (window.__vibeslopdb?.multiWindowHost) {
      delete window.__vibeslopdb;
    }
    host.onDisposed?.();
  }

  function reopen() {
    if (disposed) return;
    openCoreWindows();
  }

  const handle = {
    embedded: true,
    multiWindowHost: true,
    get hwLabel() { return hwLabel; },
    localStore,
    persistNow,
    sessionManager,
    aiBridge,
    get schemaWin() { return schemaWin; },
    get chatWin() { return chatWin; },
    get carnageWin() { return carnageWin; },
    queryWindows,
    openIds,
    spawnQueryWindow,
    tileAll,
    reopen,
    closeAll,
    dispose
  };
  window.__vibeslopdb = handle;
  return handle;
}
