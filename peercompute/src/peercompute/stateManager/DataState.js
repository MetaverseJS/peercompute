/**
 * @fileoverview DataState - Layered hot/warm/cold state wrapper
 * Hot: GPU buffers owned by the main-thread GPU hub
 * Warm: Yjs-backed CPU data for netman/UI
 * Cold: IndexedDB persistence via y-indexeddb
 */

import * as Y from 'yjs';

export class DataState {
  /**
   * @param {Object} options
   * @param {import('yjs').Doc} options.ydoc
   * @param {import('yjs').Map} options.stateMap
   * @param {Map<string, any>} [options.hotStore]
   * @param {string} [options.deltaNamespace]
   */
  constructor({ ydoc, stateMap, hotStore, deltaNamespace = 'deltas' } = {}) {
    if (!ydoc || !stateMap) {
      throw new Error('[DataState] ydoc and stateMap are required');
    }
    this.ydoc = ydoc;
    this.state = stateMap;
    this.hotStore = hotStore || new Map();
    this.deltaNamespace = deltaNamespace;
    // Local source-artifact caches are intentionally not stored in `state`.
    // The registry is process-local and therefore cannot enter Yjs replication.
    this.localArtifactCaches = new Map();
    this.artifactStores = new Map();
  }

  _getNamespaceMap(namespace) {
    let nsMap = this.state.get(namespace);
    if (!nsMap) {
      nsMap = new Y.Map();
      this.state.set(namespace, nsMap);
    }
    return nsMap;
  }

  /**
   * Commit a CPU-friendly delta into the warm layer.
   * @param {Object} delta
   * @param {string} delta.taskId
   * @param {string} [delta.scope]
   * @param {number|string} [delta.version]
   * @param {any} delta.payload
   * @param {number} [delta.timestamp]
   */
  commitDelta(delta = {}) {
    const taskId = delta.taskId || delta.key;
    if (!taskId) {
      throw new Error('[DataState] commitDelta requires taskId');
    }
    const scope = delta.scope || this.deltaNamespace;
    const entry = {
      version: delta.version ?? null,
      payload: delta.payload ?? null,
      ts: delta.timestamp ?? Date.now()
    };

    this.ydoc.transact(() => {
      const nsMap = scope ? this._getNamespaceMap(scope) : this.state;
      nsMap.set(taskId, entry);
    }, 'commit-delta');
  }

  readWarm(key, namespace) {
    if (namespace) {
      const nsMap = this.state.get(namespace);
      return nsMap ? nsMap.get(key) : undefined;
    }
    return this.state.get(key);
  }

  writeWarm(key, value, namespace) {
    this.ydoc.transact(() => {
      if (namespace) {
        const nsMap = this._getNamespaceMap(namespace);
        nsMap.set(key, value);
      } else {
        this.state.set(key, value);
      }
    }, 'write-warm');
  }

  getWarmDeltas(namespace = this.deltaNamespace) {
    const nsMap = this.state.get(namespace);
    if (!nsMap) return {};
    if (typeof nsMap.entries === 'function') {
      return Object.fromEntries(nsMap.entries());
    }
    return {};
  }

  setHotBuffer(key, buffer) {
    this.hotStore.set(key, buffer);
  }

  getHotBuffer(key) {
    return this.hotStore.get(key);
  }

  deleteHotBuffer(key) {
    this.hotStore.delete(key);
  }

  listHotBuffers() {
    return Array.from(this.hotStore.keys());
  }

  registerLocalArtifactCache(name, cache) {
    const key = String(name ?? '').trim();
    if (!key || !cache || typeof cache !== 'object') {
      throw new TypeError('[DataState] local artifact cache name and instance are required');
    }
    if (this.localArtifactCaches.has(key)) {
      throw new Error(`[DataState] local artifact cache ${key} is already registered`);
    }
    this.localArtifactCaches.set(key, cache);
    return cache;
  }

  getLocalArtifactCache(name) {
    return this.localArtifactCaches.get(String(name ?? '').trim()) ?? null;
  }

  unregisterLocalArtifactCache(name, cache) {
    const key = String(name ?? '').trim();
    if (cache && this.localArtifactCaches.get(key) !== cache) return false;
    return this.localArtifactCaches.delete(key);
  }

  getLocalArtifactCacheStats() {
    let entries = 0;
    let residentBytes = 0;
    let pending = 0;
    for (const cache of this.localArtifactCaches.values()) {
      const stats = cache?.getStats?.();
      entries += Number(stats?.entries ?? 0);
      residentBytes += Number(stats?.residentBytes ?? 0);
      pending += Number(stats?.pending ?? 0);
    }
    return Object.freeze({
      caches: this.localArtifactCaches.size,
      entries,
      residentBytes,
      pending
    });
  }

  async destroyLocalArtifactCaches() {
    const caches = [...this.localArtifactCaches.values()];
    this.localArtifactCaches.clear();
    await Promise.allSettled(caches.map((cache) => cache?.destroy?.()));
  }

  registerArtifactStore(store) {
    if (this.artifactStores.has(store.name)) throw new Error(`Artifact store ${store.name} is already registered`);
    this.artifactStores.set(store.name, store);
    return store;
  }

  getArtifactStore(name = 'default') { return this.artifactStores.get(name) || null; }

  unregisterArtifactStore(store) {
    if (this.artifactStores.get(store.name) === store) this.artifactStores.delete(store.name);
  }

  getArtifactStoreStats() {
    const stores = [...this.artifactStores.values()].map((store) => store.getStats());
    return { stores: stores.length,
      storedBytes: stores.reduce((sum, stats) => sum + stats.storedBytes, 0),
      pending: stores.reduce((sum, stats) => sum + stats.pending, 0) };
  }

  async destroyArtifactStores() {
    const results = await Promise.allSettled([...this.artifactStores.values()].map((store) => store.destroy()));
    const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
    if (errors.length) throw new AggregateError(errors, 'Artifact storage cleanup failed');
    this.artifactStores.clear();
  }
}
