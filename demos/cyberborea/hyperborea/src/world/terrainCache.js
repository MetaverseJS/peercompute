const META_VERSION_KEY = '__version';

/**
 * Terrain cache backed by a generic StateStore (StateManager + IndexedDB).
 * Keeps an in-memory map and mirrors to the shared state so peers can reuse data.
 */
export class TerrainCache {
  constructor(store, version) {
    this.store = store;
    this.version = version;
    this.memory = new Map();
    this.ensureVersion();
  }

  ensureVersion() {
    if (!this.store) return;
    const stored = this.store.read?.(META_VERSION_KEY);
    if (stored === this.version) return;
    // Only purge persistent data if we previously stored a different version
    if (stored !== undefined && stored !== null) {
      const keys = this.store.listKeys?.() || [];
      for (const key of keys) {
        if (key === META_VERSION_KEY) continue;
        this.store.delete?.(key);
      }
      this.store.clear?.();
      const currentDoc = this.store.getDocName?.();
      this.store.clearAllPersistenceByPrefix?.('peercompute-', currentDoc ? [currentDoc] : []);
      this.memory.clear();
    }
    this.store.write?.(META_VERSION_KEY, this.version);
  }

  ingestRemote(key, value) {
    if (!key || !value) return;
    if (key === META_VERSION_KEY) {
      // If we learn of a newer version remotely, align and purge
      if (value !== this.version) {
        this.version = value;
        this.ensureVersion();
      }
      return;
    }
    this.memory.set(key, value);
  }

  getChunk(key) {
    if (this.memory.has(key)) return this.memory.get(key);
    const data = this.store?.read?.(key);
    if (data) {
      this.memory.set(key, data);
    }
    return data || null;
  }

  putChunk(key, data) {
    if (!key || !data) return;
    // Avoid re-writing if persistence already has this chunk; Yjs persistence appends updates
    if (this.store?.has?.(key)) {
      if (!this.memory.has(key)) {
        this.memory.set(key, this.store.read?.(key));
      }
      return;
    }
    this.memory.set(key, data);
    if (!this.store) return;
    try {
      this.store.write(key, data);
    } catch (err) {
      console.warn('[TerrainCache] Failed to persist chunk', key, err);
    }
  }

  deleteChunk(key) {
    this.memory.delete(key);
    try {
      this.store?.delete?.(key);
    } catch (err) {
      console.warn('[TerrainCache] Failed to delete chunk', key, err);
    }
  }
}
