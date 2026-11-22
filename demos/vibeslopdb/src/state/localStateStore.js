import { StateManager } from '@peercompute';

const PREFS_NS = 'vibeslopdb:prefs';
const DB_NS = 'vibeslopdb:databases';

function uint8ToBase64(bytes) {
  if (!(bytes instanceof Uint8Array)) return '';
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToUint8(b64) {
  const binary = atob(String(b64 || ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function serializeSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  if (snapshot.engine === 'sqlite' && snapshot.bytes instanceof Uint8Array) {
    // Cap persisted SQLite snapshot at 12 MiB raw bytes to keep IndexedDB crisp.
    if (snapshot.bytes.byteLength > 12 * 1024 * 1024) return null;
    return {
      engine: 'sqlite',
      bytesBase64: uint8ToBase64(snapshot.bytes)
    };
  }
  if (snapshot.engine === 'pglite' && typeof snapshot.sqlDump === 'string') {
    if (snapshot.sqlDump.length > 8 * 1024 * 1024) return null;
    return {
      engine: 'pglite',
      sqlDump: snapshot.sqlDump
    };
  }
  if (snapshot.engine === 'indexeddb' && Array.isArray(snapshot.tables)) {
    return {
      engine: 'indexeddb',
      tables: snapshot.tables,
      rows: snapshot.rows || []
    };
  }
  return snapshot;
}

function deserializeSnapshot(record) {
  if (!record || typeof record !== 'object') return null;
  if (record.engine === 'sqlite' && typeof record.bytesBase64 === 'string') {
    return {
      engine: 'sqlite',
      bytes: base64ToUint8(record.bytesBase64)
    };
  }
  if (record.engine === 'pglite' && typeof record.sqlDump === 'string') {
    return {
      engine: 'pglite',
      sqlDump: record.sqlDump
    };
  }
  if (record.engine === 'indexeddb' && Array.isArray(record.tables)) {
    return {
      engine: 'indexeddb',
      tables: record.tables,
      rows: record.rows || []
    };
  }
  return record;
}

/**
 * Local durable persistence for VibeSlopDB backed by PeerCompute's `StateManager`
 * (Yjs CRDT + y-indexeddb local IndexedDB persistence, network sync disabled).
 *
 * Persists:
 *  - User UI preferences (themeId, crtEnabled, activeEngineId, activeStarterId, yoloMode, diagramOffsets)
 *  - Per-engine database snapshots (SQLite WASM bytes, PGlite SQL dump, IndexedDB schema+rows)
 */
export function createLocalStateStore({ docName = 'vibeslopdb-local-state-v1' } = {}) {
  const stateManager = new StateManager(null, {
    docName,
    enablePersistence: true,
    disableNetworkProvider: true,
    disableBroadcast: true
  });

  let ready = false;
  let failed = false;

  async function init() {
    if (ready || failed) return ready;
    try {
      await stateManager.initialize();
      ready = true;
      return true;
    } catch (err) {
      failed = true;
      console.warn('[LocalStateStore] PeerCompute StateManager persistence unavailable:', err);
      return false;
    }
  }

  function getPref(key, fallback = undefined) {
    if (!ready) return fallback;
    try {
      const val = stateManager.readScoped(PREFS_NS, key);
      return val === undefined ? fallback : val;
    } catch {
      return fallback;
    }
  }

  function setPref(key, value) {
    if (!ready) return false;
    try {
      stateManager.writeScoped(PREFS_NS, key, value);
      return true;
    } catch (err) {
      console.warn(`[LocalStateStore] Failed to save pref "${key}":`, err);
      return false;
    }
  }

  function getAllPrefs() {
    return {
      themeId: getPref('themeId', null),
      crtEnabled: Boolean(getPref('crtEnabled', false)),
      engineId: getPref('engineId', null),
      starterId: getPref('starterId', null),
      yoloMode: getPref('yoloMode', true),
      diagramOffsets: getPref('diagramOffsets', null),
      lastQuery: getPref('lastQuery', null)
    };
  }

  function saveDatabaseSnapshot(engineId, { starterId, snapshot }) {
    if (!ready || !engineId || !snapshot) return false;
    try {
      const encoded = serializeSnapshot(snapshot);
      if (!encoded) return false;
      stateManager.writeScoped(DB_NS, engineId, {
        engineId,
        starterId: starterId || 'startup_prod',
        savedAt: Date.now(),
        snapshot: encoded
      });
      return true;
    } catch (err) {
      console.warn(`[LocalStateStore] Failed to persist ${engineId} snapshot:`, err);
      return false;
    }
  }

  function loadDatabaseSnapshot(engineId) {
    if (!ready || !engineId) return null;
    try {
      const entry = stateManager.readScoped(DB_NS, engineId);
      if (!entry || !entry.snapshot) return null;
      const decoded = deserializeSnapshot(entry.snapshot);
      if (!decoded) return null;
      return {
        engineId: entry.engineId || engineId,
        starterId: entry.starterId || 'startup_prod',
        savedAt: entry.savedAt || 0,
        snapshot: decoded
      };
    } catch (err) {
      console.warn(`[LocalStateStore] Failed to load ${engineId} snapshot:`, err);
      return null;
    }
  }

  function clearDatabaseSnapshot(engineId) {
    if (!ready || !engineId) return;
    try {
      stateManager.deleteScoped(DB_NS, engineId);
    } catch {
      // Ignore
    }
  }

  async function dispose() {
    if (!ready) return;
    ready = false;
    await stateManager.destroy?.().catch(() => {});
  }

  return {
    stateManager,
    init,
    isReady: () => ready,
    getPref,
    setPref,
    getAllPrefs,
    saveDatabaseSnapshot,
    loadDatabaseSnapshot,
    clearDatabaseSnapshot,
    dispose
  };
}
