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
}
