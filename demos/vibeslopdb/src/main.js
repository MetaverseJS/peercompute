import './styles.css';

import { DbSessionManager } from './db/sessionManager.js';
import { STARTER_SCHEMAS } from './db/starterSchemas.js';
import { createLocalStateStore } from './state/localStateStore.js';
import { createPeerComputeAiBridge } from './ai/peercomputeBridge.js';
import {
  createExoWebTuiDesktop,
  detectEmbeddedMode,
  returnToPeerComputeAtlas
} from './ui/exowebtuiDesktop.js';
import { createSchemaWindow } from './ui/windows/schemaWindow.js';
import { createChatWindow } from './ui/windows/chatWindow.js';
import { createQueryWindow } from './ui/windows/queryWindow.js';
import { createCarnageWindow } from './ui/windows/carnageWindow.js';
import { disposeExotuiMermaidRenderer } from './mermaid/exotuiMermaidRenderer.js';

async function bootVibeSlopDb() {
  const embedded = detectEmbeddedMode();
  const params = new URLSearchParams(window.location.search);

  // Initialize local PeerCompute StateManager persistence (Yjs + y-indexeddb)
  // before mounting the UI so saved theme, DB snapshot, and dragged layout restore seamlessly!
  const localStore = createLocalStateStore({ docName: 'vibeslopdb-local-state-v1' });
  await localStore.init();
  const savedPrefs = localStore.getAllPrefs();

  const urlEngine = params.get('engine');
  const urlStarter = params.get('starter');
  const urlTheme = params.get('theme');

  const initialEngine = ['sqlite', 'pglite', 'indexeddb'].includes(urlEngine)
    ? urlEngine
    : (['sqlite', 'pglite', 'indexeddb'].includes(savedPrefs.engineId) ? savedPrefs.engineId : 'sqlite');
  const savedDbEntry = urlStarter ? null : localStore.loadDatabaseSnapshot(initialEngine);
  const initialStarter = STARTER_SCHEMAS[urlStarter]
    ? urlStarter
    : (STARTER_SCHEMAS[savedDbEntry?.starterId]
      ? savedDbEntry.starterId
      : (STARTER_SCHEMAS[savedPrefs.starterId] ? savedPrefs.starterId : 'startup_prod'));
  const initialTheme = urlTheme || savedPrefs.themeId || 'matrix';
  const initialCrt = !embedded && Boolean(savedPrefs.crtEnabled);
  const initialYolo = savedPrefs.yoloMode !== false;

  const atlasBtn = document.getElementById('btn-atlas-return');
  const capBadge = document.getElementById('cap-badge');
  const newQueryBtn = document.getElementById('btn-new-query');
  const tileBtn = document.getElementById('btn-tile');
  const cascadeBtn = document.getElementById('btn-cascade');
  const peersTopBtn = document.getElementById('btn-peers');
  const modelsBtn = document.getElementById('btn-models');
  const themeSelect = document.getElementById('theme-select');
  const crtBtn = document.getElementById('btn-crt');
  const surfaceEl = document.getElementById('exotui-surface');
  const stageLayerEl = document.getElementById('stage-layer');

  if (embedded) {
    document.documentElement.classList.add('is-embedded');
    atlasBtn.hidden = false;
    atlasBtn.addEventListener('click', () => {
      returnToPeerComputeAtlas();
    });
  }

  const sessionManager = new DbSessionManager({
    engineId: initialEngine,
    starterId: initialStarter
  });

  const aiBridge = createPeerComputeAiBridge({
    sessionManager,
    onCapabilitiesReady: (caps) => {
      const tier = caps?.tier || 'unknown';
      const cores = caps?.cpu?.cores ?? caps?.cpu?.logicalCores ?? navigator.hardwareConcurrency ?? 0;
      const webgpuReady = Boolean(caps?.webgpu?.available || caps?.gpu?.webgpu);
      const gpuLabel = webgpuReady
        ? (caps?.webgpu?.adapter?.architecture || caps?.webgpu?.adapter?.vendor || caps?.gpu?.adapterInfo?.vendor || 'WebGPU')
        : 'CPU-only';
      capBadge.textContent = `HW: ${tier} · ${cores}c · ${gpuLabel}`;
      capBadge.title = JSON.stringify({ tier, cpu: caps?.cpu, webgpu: caps?.webgpu }, null, 2);
    }
  });

  let schemaWin = null;
  let chatWin = null;
  let carnageWin = null;
  const queryWindows = new Map();
  let querySeq = 0;

  const desktop = createExoWebTuiDesktop({
    surfaceElement: surfaceEl,
    stageLayerElement: stageLayerEl,
    initialThemeId: initialTheme,
    embedded,
    onThemeChange: (nextTheme) => {
      localStore.setPref('themeId', nextTheme.id);
      void schemaWin?.refresh({ autoFit: false });
    },
    onWindowClosed: (id) => {
      const q = queryWindows.get(id);
      if (q) {
        q.dispose();
        queryWindows.delete(id);
      }
    }
  });

  // Populate ExoTUI Shell Themes selector
  for (const spec of desktop.getThemes()) {
    const opt = document.createElement('option');
    opt.value = spec.id;
    opt.textContent = spec.label;
    themeSelect.append(opt);
  }
  themeSelect.value = desktop.getTheme().id;
  themeSelect.addEventListener('change', () => {
    desktop.setTheme(themeSelect.value);
  });

  let crtOn = initialCrt;
  if (crtOn) {
    desktop.setCrtEnabled(true);
    crtBtn.textContent = 'CRT: ON';
    crtBtn.classList.add('is-active');
  }
  crtBtn.addEventListener('click', () => {
    crtOn = !crtOn;
    desktop.setCrtEnabled(crtOn);
    localStore.setPref('crtEnabled', crtOn);
    crtBtn.textContent = crtOn ? 'CRT: ON' : 'CRT: OFF';
    crtBtn.classList.toggle('is-active', crtOn);
  });

  function getPrimaryQueryWindow() {
    const first = queryWindows.values().next().value;
    if (first) return first;
    return spawnQueryWindow({ initialSql: '' });
  }

  function spawnQueryWindow({ initialSql = '', placement = 'tiled', autoRun = false } = {}) {
    const num = ++querySeq;
    const id = `query-${num}`;
    const title = `SQL Query #${num}`;
    let instance = null;
    desktop.addWindow({
      id,
      title,
      tabLabel: `Query #${num}`,
      placement,
      minWidth: 28,
      minHeight: 10,
      closable: num > 1,
      floatingRect: placement === 'floating'
        ? { column: 10 + (num % 4) * 4, row: 4 + (num % 4) * 2, width: 64, height: 22 }
        : undefined,
      onMount: (contentEl) => {
        instance = createQueryWindow({
          container: contentEl,
          sessionManager,
          initialSql,
          windowLabel: title
        });
        queryWindows.set(id, instance);
      }
    });
    if (placement === 'tiled' && num > 1) {
      desktop.tileAll();
    }
    if (autoRun && instance) {
      void instance.runSql();
    }
    return instance;
  }

  // Mount the 4 core ExoWebTUI windows:
  //   1. Live Mermaid ER Schema (draggable entities + ExoTUI ASCII Cells + Source)
  //   2. YOLO DBA Chat (wired to PeerCompute CubeChat-style modal + Chaos fallback)
  //   3. SQL Query #1 (SQL editor + live results table)
  //   4. Carnage Log & Time-Travel (DB engine switcher, starter schemas, rewind)
  desktop.addWindow({
    id: 'schema',
    title: 'Mermaid ER Schema (Live · Draggable)',
    tabLabel: 'Schema ER',
    placement: 'tiled',
    minWidth: 32,
    minHeight: 12,
    onMount: (contentEl) => {
      schemaWin = createSchemaWindow({
        container: contentEl,
        sessionManager,
        getTheme: () => desktop.getTheme(),
        onOffsetsChange: (offsets) => {
          localStore.setPref('diagramOffsets', offsets);
        },
        onSelectEntityQuery: (sql) => {
          const q = getPrimaryQueryWindow();
          q.setSql(sql);
          desktop.focusWindow(queryWindows.keys().next().value);
          void q.runSql();
        }
      });
      if (savedPrefs.diagramOffsets) {
        schemaWin.stage.setCustomOffsets(savedPrefs.diagramOffsets);
      }
    }
  });

  desktop.addWindow({
    id: 'chat',
    title: 'YOLO DBA Chat (PeerCompute LLM)',
    tabLabel: 'YOLO Chat',
    placement: 'tiled',
    minWidth: 32,
    minHeight: 12,
    onMount: (contentEl) => {
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
          const q = getPrimaryQueryWindow();
          q.setSql(sql);
          desktop.focusWindow(queryWindows.keys().next().value);
        },
        onShowQueryResult: (res, sql) => {
          const q = getPrimaryQueryWindow();
          q.showExternalResult(res, sql);
        }
      });
    }
  });

  spawnQueryWindow({
    initialSql: STARTER_SCHEMAS[initialStarter]?.defaultQuery || '',
    placement: 'tiled'
  });

  desktop.addWindow({
    id: 'carnage',
    title: 'Carnage Log · DB Engines · Time-Travel',
    tabLabel: 'Carnage Log',
    placement: 'tiled',
    minWidth: 30,
    minHeight: 10,
    onMount: (contentEl) => {
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
          const q = getPrimaryQueryWindow();
          q.setSql(sql);
          desktop.focusWindow(queryWindows.keys().next().value);
        },
        onEngineSwitched: (engineId, starterId, { restored = false } = {}) => {
          localStore.setPref('engineId', engineId);
          localStore.setPref('starterId', starterId);
          if (!restored) {
            const defaultSql = STARTER_SCHEMAS[starterId]?.defaultQuery || '';
            const q = getPrimaryQueryWindow();
            q.setSql(defaultSql);
            if (defaultSql && !defaultSql.startsWith('--')) {
              void q.runSql();
            }
          }
        }
      });
    }
  });

  // Arrange all 4 initial windows cleanly in a balanced 2x2 ExoWebTUI tiled grid!
  desktop.tileAll();

  // Top bar buttons
  newQueryBtn.addEventListener('click', () => {
    spawnQueryWindow({
      initialSql: '-- Independent query window\nSELECT * FROM users LIMIT 10;',
      placement: 'floating'
    });
  });
  tileBtn.addEventListener('click', () => desktop.tileAll());
  cascadeBtn.addEventListener('click', () => desktop.cascadeAll());
  peersTopBtn?.addEventListener('click', () => {
    const st = aiBridge.getModelStatus();
    if (st.networkConnected) void aiBridge.refreshPeersNow();
    else void aiBridge.connectPeerNetwork();
  });
  aiBridge.subscribe((st) => {
    if (!peersTopBtn) return;
    if (st.peerConnecting) {
      peersTopBtn.textContent = '🌐 Connecting…';
      peersTopBtn.disabled = true;
    } else if (st.networkConnected) {
      peersTopBtn.disabled = false;
      peersTopBtn.classList.add('is-active');
      peersTopBtn.textContent = `🌐 Peers: ${st.peerCount} (${st.hostedModelCount} models)`;
    } else {
      peersTopBtn.disabled = false;
      peersTopBtn.classList.remove('is-active');
      peersTopBtn.textContent = '🌐 Connect Peers';
    }
  });
  modelsBtn.addEventListener('click', () => {
    void aiBridge.openModelsModal({ managementOnly: true });
  });
  if (params.get('peers') === '1' || params.get('autoconnect') === '1') {
    void aiBridge.connectPeerNetwork();
  }

  // Global keyboard shortcuts
  window.addEventListener('keydown', (event) => {
    if (!event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'n') {
      event.preventDefault();
      newQueryBtn.click();
    } else if (key === 't') {
      event.preventDefault();
      desktop.tileAll();
    } else if (key === 'm') {
      event.preventDefault();
      void aiBridge.openModelsModal({ managementOnly: true });
    }
  });

  // Persist active database snapshot to local PeerCompute StateManager on mutations!
  let persistTimer = 0;
  async function persistNow() {
    clearTimeout(persistTimer);
    persistTimer = 0;
    const st = sessionManager.getState();
    localStore.setPref('engineId', st.engineId);
    localStore.setPref('starterId', st.starterId);
    const snap = await sessionManager.exportCurrentSnapshot();
    if (snap) {
      localStore.saveDatabaseSnapshot(st.engineId, { starterId: st.starterId, snapshot: snap });
    }
  }
  function schedulePersist() {
    clearTimeout(persistTimer);
    persistTimer = window.setTimeout(() => { void persistNow(); }, 200);
  }
  sessionManager.subscribe((ev) => {
    if (ev.type === 'schema-updated' && ev.reason !== 'state-restore') {
      schedulePersist();
    }
  });

  // Boot PeerCompute capabilities probe + initial database engine (restoring from StateManager if saved)!
  void aiBridge.initCapabilities();
  await sessionManager.init(initialEngine, initialStarter, {
    persistedSnapshot: savedDbEntry?.snapshot || null
  });
  await schemaWin.refresh({ autoFit: true });
  if (!savedDbEntry?.snapshot) {
    const initialQuery = STARTER_SCHEMAS[initialStarter]?.defaultQuery || '';
    if (initialQuery && !initialQuery.startsWith('--')) {
      await getPrimaryQueryWindow().runSql(initialQuery, 'SEED');
    }
  } else {
    // Run a safe peek query against the first restored table so the results pane has live data!
    const firstTbl = sessionManager.getState().schema.tables[0]?.name;
    if (firstTbl) {
      await getPrimaryQueryWindow().runSql(`SELECT * FROM "${firstTbl}" LIMIT 25;`, 'RESTORE');
    }
  }

  // Expose deterministic inspection handle for Playwright E2E and debugging
  window.__vibeslopdb = {
    embedded,
    localStore,
    persistNow,
    sessionManager,
    aiBridge,
    desktop,
    schemaWin,
    chatWin,
    carnageWin,
    queryWindows,
    spawnQueryWindow
  };

  window.addEventListener('pagehide', () => {
    void persistNow();
    void aiBridge.dispose();
    void sessionManager.dispose();
    void localStore.dispose();
    desktop.dispose();
    disposeExotuiMermaidRenderer();
  });
}

void bootVibeSlopDb();
