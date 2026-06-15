/**
 * @fileoverview State Manager - Manages shared data state using Yjs CRDT
 * Coordinates read/write access with automatic P2P synchronization
 * 
 * Uses Yjs for conflict-free replicated data types (CRDT) and PeerComputeProvider
 * for automatic synchronization across the P2P network.
 */

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { PeerComputeProvider } from './PeerComputeProvider.js';
import { DataState } from './DataState.js';

export const STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_SCHEMA = 'peercompute.state.task-graph-cache-artifact-admission.v0';
export const STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_SCHEMA = 'peercompute.state.task-graph-cache-artifact-invalidation.v0';
export const STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE = 'taskGraphCacheArtifactAdmissions';
export const STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE = 'taskGraphCacheArtifactInvalidations';

function normalizeStringList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((entry) => entry.trim()).filter(Boolean);
  }
  return [...fallback];
}

function cloneStateManagerValue(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall through for plain JSON diagnostics.
    }
  }
  return JSON.parse(JSON.stringify(value));
}

/**
 * StateManager class - Handles distributed state coordination
 * Provides CRDT-based state management with automatic P2P sync
 */
export class StateManager {
  /**
   * @param {Object} networkManager - NetworkManager instance
   * @param {Object} config - State manager configuration
   * @param {string} config.docName - Yjs document name for persistence
   * @param {string} config.topic - P2P sync topic
   * @param {boolean} config.enablePersistence - Enable IndexedDB persistence
   */
  constructor(networkManager, config = {}) {
    this.networkManager = networkManager;
    this.libp2pNode = networkManager ? networkManager.getLibp2pNode() : null;
    this.config = {
      docName: config.docName || 'peercompute-state',
      topic: config.topic || 'peercompute-state-sync',
      enablePersistence: config.enablePersistence !== false,
      disableNetworkProvider: config.disableNetworkProvider || false,
      disableBroadcast: config.disableBroadcast || false,
      broadcastNamespaces: Array.isArray(config.broadcastNamespaces) ? config.broadcastNamespaces : null,
      ...config
    };
    
    // Yjs document - the CRDT state container
    this.ydoc = new Y.Doc();
    
    // Main state map (CRDT Y.Map)
    this.state = this.ydoc.getMap('state');

    // Layered DataState wrapper (hot/warm/cold)
    this.dataState = new DataState({
      ydoc: this.ydoc,
      stateMap: this.state,
      hotStore: config.hotStore,
      deltaNamespace: config.deltaNamespace || 'deltas'
    });
    
    // Providers
    this.indexeddbProvider = null;
    this.libp2pProvider = null;
    
    // Subscribers
    this.subscribers = new Map(); // key -> Set of callbacks
    this.globalSubscribers = new Set(); // Callbacks for all changes
    
    // State
    this.isInitialized = false;
    this.persistenceFailed = false;
  }

  /**
   * Internal helper to get or create a namespaced Y.Map within the root state
   * @param {string} namespace
   * @returns {Y.Map}
   * @private
   */
  _getNamespaceMap(namespace) {
    let nsMap = this.state.get(namespace);
    if (!nsMap) {
      nsMap = new Y.Map();
      this.state.set(namespace, nsMap);
    }
    return nsMap;
  }

  /**
   * Apply a Yjs update received from the network (libp2p pubsub path)
   * @param {Array|Uint8Array} updateArr
   */
  applyRemoteUpdate(updateArr) {
    try {
      const normalized = (() => {
        if (updateArr instanceof Uint8Array) return updateArr;
        if (Array.isArray(updateArr)) return new Uint8Array(updateArr);
        if (updateArr && typeof updateArr === 'object') {
          // Handle plain object maps of index->byte
          const values = Object.values(updateArr);
          return new Uint8Array(values);
        }
        return new Uint8Array(0);
      })();
      if (normalized.byteLength === 0) {
        console.warn('[StateManager] Remote update was empty, skipping');
        return;
      }
      const update = normalized;
      Y.applyUpdate(this.ydoc, update, this);
    } catch (err) {
      console.error('[StateManager] Failed to apply remote update:', err);
    }
  }

  /**
   * Apply a simple key/value update received outside of Yjs
   * @param {string} key
   * @param {any} value
   */
  applyStateSet(key, value, namespace) {
    try {
      this.ydoc.transact(() => {
        if (namespace) {
          const nsMap = this._getNamespaceMap(namespace);
          if (value === undefined) {
            nsMap.delete(key);
          } else {
            nsMap.set(key, value);
          }
        } else {
          if (value === undefined) {
            this.state.delete(key);
          } else {
            this.state.set(key, value);
          }
        }
      }, 'remote-state-set');
    } catch (err) {
      console.error('[StateManager] Failed to apply state-set:', err);
    }
  }

  /**
   * Commit a warm-layer delta (CPU-friendly) into the DataState
   * @param {Object} delta
   */
  commitDelta(delta) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    this.dataState.commitDelta(delta);
  }

  /**
   * Get the layered DataState wrapper
   */
  getDataState() {
    return this.dataState;
  }

  getWarmDeltas(namespace) {
    return this.dataState.getWarmDeltas(namespace);
  }

  setHotBuffer(key, buffer) {
    this.dataState.setHotBuffer(key, buffer);
  }

  getHotBuffer(key) {
    return this.dataState.getHotBuffer(key);
  }

  /**
   * Admit a ComputeManager task-graph cache artifact into the CRDT authority
   * ledger. ComputeManager may record local artifacts, but this StateManager
   * record is the durable admission decision peers should trust.
   * @param {Object} artifact
   * @param {Object} options
   * @returns {Object}
   */
  admitTaskGraphCacheArtifact(artifact = {}, options = {}) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    if (!artifact || typeof artifact !== 'object') {
      throw new Error('admitTaskGraphCacheArtifact requires an artifact object');
    }
    const cacheKey = String(options.cacheKey || artifact.cacheKey || '').trim();
    if (!cacheKey) {
      throw new Error('admitTaskGraphCacheArtifact requires artifact.cacheKey');
    }
    const admittedAt = Number.isFinite(options.admittedAt) ? options.admittedAt : Date.now();
    const invalidationRefs = normalizeStringList(
      options.invalidationRefs ?? artifact.invalidationRefs ?? artifact.admission?.invalidationRefs,
      []
    );
    const record = {
      schema: STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_SCHEMA,
      admissionId: String(
        options.admissionId
          || artifact.admission?.admissionId
          || `task-graph-cache-admission:${cacheKey}:${admittedAt}`
      ),
      cacheKey,
      artifactId: artifact.artifactId || `${cacheKey}:artifact`,
      artifactSchema: artifact.schema || null,
      artifactStatus: artifact.status || null,
      cacheScope: artifact.cacheScope || options.cacheScope || null,
      cacheKeySource: artifact.cacheKeySource || options.cacheKeySource || null,
      inputHash: artifact.inputHash || options.inputHash || null,
      resultHash: artifact.resultHash || options.resultHash || null,
      status: options.status || 'admitted',
      admitted: true,
      authority: options.authority || 'state-manager',
      validatorId: options.validatorId || artifact.admission?.validatorId || null,
      reason: options.reason || 'state-manager-cache-artifact-admission',
      invalidationRefs,
      admittedAt,
      acceptedAt: admittedAt,
      expiresAt: options.expiresAt ?? artifact.expiresAt ?? null,
      sourceNodeId: options.sourceNodeId || this.state.get('nodeId') || null,
      artifact: cloneStateManagerValue(artifact)
    };
    this.writeScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE, cacheKey, record);
    return cloneStateManagerValue(record);
  }

  /**
   * Mark an admitted artifact as invalidated and write an audit record.
   * @param {string|Object} cacheKeyOrArtifact
   * @param {Object} options
   * @returns {Object}
   */
  invalidateTaskGraphCacheArtifact(cacheKeyOrArtifact, options = {}) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    const artifact = cacheKeyOrArtifact && typeof cacheKeyOrArtifact === 'object'
      ? cacheKeyOrArtifact
      : null;
    const cacheKey = String(options.cacheKey || artifact?.cacheKey || cacheKeyOrArtifact || '').trim();
    if (!cacheKey) {
      throw new Error('invalidateTaskGraphCacheArtifact requires a cacheKey');
    }
    const existing = this.readScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE, cacheKey);
    const invalidatedAt = Number.isFinite(options.invalidatedAt) ? options.invalidatedAt : Date.now();
    const invalidationRefs = normalizeStringList(
      options.invalidationRefs ?? artifact?.invalidationRefs ?? existing?.invalidationRefs,
      []
    );
    const invalidation = {
      schema: STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_SCHEMA,
      invalidationId: String(options.invalidationId || `task-graph-cache-invalidation:${cacheKey}:${invalidatedAt}`),
      cacheKey,
      artifactId: artifact?.artifactId || existing?.artifactId || `${cacheKey}:artifact`,
      status: 'invalidated',
      authority: options.authority || 'state-manager',
      reason: options.reason || 'state-manager-cache-artifact-invalidated',
      invalidationRefs,
      previousAdmissionStatus: existing?.status || null,
      invalidatedAt,
      sourceNodeId: options.sourceNodeId || this.state.get('nodeId') || null
    };
    this.writeScoped(
      STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE,
      invalidation.invalidationId,
      invalidation
    );
    if (existing) {
      this.writeScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE, cacheKey, {
        ...existing,
        status: 'invalidated',
        admitted: false,
        invalidatedAt,
        invalidation
      });
    }
    return cloneStateManagerValue(invalidation);
  }

  getTaskGraphCacheArtifactAdmission(cacheKey) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    const key = String(cacheKey || '').trim();
    if (!key) return null;
    const record = this.readScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE, key);
    return record ? cloneStateManagerValue(record) : null;
  }

  listTaskGraphCacheArtifactAdmissions(options = {}) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    const includeInvalidated = options.includeInvalidated !== false;
    return this.listNamespaceKeys(STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE)
      .map((key) => this.readScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE, key))
      .filter((record) => record && (includeInvalidated || record.admitted === true))
      .map((record) => cloneStateManagerValue(record))
      .sort((a, b) => String(a.cacheKey || '').localeCompare(String(b.cacheKey || '')));
  }

  /**
   * Initialize the state manager
   * @param {Object} initialState - Initial state data (optional)
   * @returns {Promise<void>}
   */
  async initialize(initialState = {}) {
    if (this.isInitialized) {
      console.warn('[StateManager] Already initialized');
      return;
    }
    
    try {
      // Set up IndexedDB persistence if enabled
      if (this.config.enablePersistence) {
        this.indexeddbProvider = new IndexeddbPersistence(
          this.config.docName,
          this.ydoc
        );
        
        // Wait for persistence to sync from IndexedDB
        await new Promise((resolve) => {
          this.indexeddbProvider.once('synced', resolve);
        });
        
        console.log('[StateManager] IndexedDB persistence loaded');
      }
      
      // Set up PeerComputeProvider synchronization (Custom replacement for y-libp2p)
      if (this.networkManager && !this.config.disableNetworkProvider) {
        try {
          this.libp2pProvider = new PeerComputeProvider(
            this.networkManager,
            this.ydoc,
            {
              topic: this.config.topic
            }
          );
          
          console.log('[StateManager] PeerCompute P2P synchronization enabled');
        } catch (error) {
          console.error('[StateManager] Failed to enable P2P sync:', error);
        }
      }
      
      // Apply initial state if provided
      if (Object.keys(initialState).length > 0) {
        this.ydoc.transact(() => {
          for (const [key, value] of Object.entries(initialState)) {
            this.state.set(key, value);
          }
        });
      }
      
      // Set up change observers
      this._setupObservers();
      
      this.isInitialized = true;
      console.log('[StateManager] Initialized');
      
    } catch (error) {
      console.error('[StateManager] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up Yjs observers for change notifications
   * @private
   */
  _setupObservers() {
    // Observe all changes to the state map
    this.state.observe((event) => {
      // Notify subscribers for each changed key
      event.keysChanged.forEach((key) => {
        const value = this.state.get(key);
        
        // Notify key-specific subscribers
        const keySubscribers = this.subscribers.get(key);
        if (keySubscribers) {
          keySubscribers.forEach(callback => {
            try {
              callback(value, key);
            } catch (error) {
              console.error('[StateManager] Subscriber error:', error);
            }
          });
        }
        
        // Notify global subscribers
        this.globalSubscribers.forEach(callback => {
          try {
            callback(value, key);
          } catch (error) {
            console.error('[StateManager] Global subscriber error:', error);
          }
        });
      });
    }, { captureTransactions: false });
  }

  /**
   * Fallback P2P sync when the network provider is disabled
   * Uses NetworkManager directly
   * @private
   */
  _setupFallbackSync() {
    if (!this.libp2pNode) return;
    
    // Listen for state update requests
    // This is a simplified fallback - PeerComputeProvider is more efficient
    console.log('[StateManager] Using fallback P2P sync via NetworkManager');
    
    // TODO: Implement manual CRDT sync protocol via NetworkManager
    // For now, just log that we're in fallback mode
  }

  /**
   * Read value from state
   * @param {string} key - State key
   * @returns {any} State value (undefined if not found)
   */
  read(key) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    return this.state.get(key);
  }

  /**
   * Write value to state
   * CRDT automatically handles conflict resolution
   * 
   * @param {string} key - State key
   * @param {any} value - New value (must be JSON-serializable)
   * @returns {void}
   */
  write(key, value) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    // Yjs handles the write and automatically syncs
    // No need for queuing or manual conflict resolution
    this._safeSetMap(this.state, key, value);

    // Opportunistic direct broadcast for libp2p pubsub path
    if (this.networkManager?.broadcast && !this.config.disableBroadcast) {
      this.networkManager.broadcast({
        type: 'state-set',
        data: { key, value }
      }).catch(() => {});
    }
  }

  /**
   * Write a value in a namespaced map
   * @param {string} namespace
   * @param {string} key
   * @param {any} value
   */
  writeScoped(namespace, key, value) {
    const nsMap = this._getNamespaceMap(namespace);
    this._safeSetMap(nsMap, key, value);

    if (this.networkManager?.broadcast && !this.config.disableBroadcast) {
      if (!this.config.broadcastNamespaces || this.config.broadcastNamespaces.includes(namespace)) {
        this.networkManager.broadcast({
          type: 'state-set',
          data: { namespace, key, value }
        }).catch(() => {});
      }
    }
  }

  /**
   * Read a value from a namespaced map
   * @param {string} namespace
   * @param {string} key
   */
  readScoped(namespace, key) {
    const nsMap = this.state.get(namespace);
    if (!nsMap) return undefined;
    return nsMap.get(key);
  }

  /**
   * Check existence of a key within a namespace without pulling the value.
   */
  hasScoped(namespace, key) {
    const nsMap = this.state.get(namespace);
    if (!nsMap) return false;
    return nsMap.has(key);
  }

  /**
   * List keys within a namespace
   * @param {string} namespace
   * @returns {string[]}
   */
  listNamespaceKeys(namespace) {
    const nsMap = this.state.get(namespace);
    if (!nsMap) return [];
    return Array.from(nsMap.keys());
  }

  /**
   * Clear all entries in a namespace
   * @param {string} namespace
   */
  clearNamespace(namespace) {
    const nsMap = this.state.get(namespace);
    if (!nsMap) return;
    const keys = Array.from(nsMap.keys());
    this.ydoc.transact(() => {
      keys.forEach((k) => nsMap.delete(k));
    });
    if (this.networkManager?.broadcast && !this.config.disableBroadcast) {
      keys.forEach((key) => {
        this.networkManager.broadcast({
          type: 'state-set',
          data: { namespace, key, value: undefined }
        }).catch(() => {});
      });
    }
  }

  /**
   * Delete a value from a namespaced map
   * @param {string} namespace
   * @param {string} key
   */
  deleteScoped(namespace, key) {
    const nsMap = this.state.get(namespace);
    if (!nsMap) return;
    nsMap.delete(key);
    if (this.networkManager?.broadcast && !this.config.disableBroadcast) {
      this.networkManager.broadcast({
        type: 'state-set',
        data: { namespace, key, value: undefined }
      }).catch(() => {});
    }
  }

  /**
   * Delete a key from state
   * @param {string} key - State key to delete
   * @returns {void}
   */
  delete(key) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    this.state.delete(key);
  }

  /**
   * Check if key exists in state
   * @param {string} key - State key
   * @returns {boolean} True if key exists
   */
  has(key) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    return this.state.has(key);
  }

  /**
   * Safe setter with persistence fallback
   * @private
   */
  _safeSetMap(map, key, value) {
    if (this.persistenceFailed) {
      map.set(key, value);
      return;
    }
    try {
      map.set(key, value);
    } catch (err) {
      if (err?.name === 'InvalidStateError') {
        console.warn('[StateManager] Persistence unavailable, disabling IndexedDB provider', err);
        this.indexeddbProvider?.destroy?.();
        this.indexeddbProvider = null;
        this.persistenceFailed = true;
        map.set(key, value);
      } else {
        throw err;
      }
    }
  }

  /**
   * Batch write multiple key-value pairs
   * Uses a Yjs transaction for atomic updates
   * 
   * @param {Object} updates - Object with key-value pairs to update
   * @returns {void}
   */
  batchWrite(updates) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    // Use Yjs transaction for atomic batch update
    this.ydoc.transact(() => {
      for (const [key, value] of Object.entries(updates)) {
        this.state.set(key, value);
      }
    });
  }

  /**
   * Subscribe to state changes
   * 
   * @param {string} key - State key to watch (or '*' for all changes)
   * @param {Function} callback - Change notification callback (value, key) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    if (key === '*') {
      // Global subscription
      this.globalSubscribers.add(callback);
      
      return () => {
        this.globalSubscribers.delete(callback);
      };
    } else {
      // Key-specific subscription
      if (!this.subscribers.has(key)) {
        this.subscribers.set(key, new Set());
      }
      
      this.subscribers.get(key).add(callback);
      
      return () => {
        const keySubscribers = this.subscribers.get(key);
        if (keySubscribers) {
          keySubscribers.delete(callback);
          if (keySubscribers.size === 0) {
            this.subscribers.delete(key);
          }
        }
      };
    }
  }

  /**
   * Observe changes within a namespaced map
   * @param {string} namespace
   * @param {Function} callback - (value, key) => void
   * @returns {Function} unsubscribe
   */
  observeNamespace(namespace, callback) {
    const nsMap = this._getNamespaceMap(namespace);
    const handler = (event) => {
      event.keysChanged.forEach((key) => {
        callback(nsMap.get(key), key);
      });
    };
    nsMap.observe(handler);
    return () => nsMap.unobserve(handler);
  }

  /**
   * Get all keys in state
   * @returns {Array<string>} Array of state keys
   */
  keys() {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    return Array.from(this.state.keys());
  }

  /**
   * Get all values in state
   * @returns {Array<any>} Array of state values
   */
  values() {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    return Array.from(this.state.values());
  }

  /**
   * Get all entries in state
   * @returns {Array<[string, any]>} Array of [key, value] pairs
   */
  entries() {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    return Array.from(this.state.entries());
  }

  /**
   * Synchronize state with network peers
   * 
   * Note: With Yjs + PeerComputeProvider, synchronization is automatic.
   * This method is provided for compatibility but is mostly a no-op.
   * 
   * @param {Array<Object>} peerStates - States from peer nodes (unused with Yjs)
   * @returns {Promise<void>}
   */
  async synchronize(peerStates) {
    // With Yjs + PeerComputeProvider, sync is automatic via CRDT
    // This method is here for API compatibility
    console.log('[StateManager] Synchronization is automatic with Yjs CRDT');
  }

  /**
   * Create a snapshot of current state
   * @returns {Object} State snapshot with metadata
   */
  snapshot() {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    return {
      data: Object.fromEntries(this.state.entries()),
      timestamp: Date.now(),
      version: this.ydoc.clientID,
      keyCount: this.state.size
    };
  }

  /**
   * Get Y.Doc instance for advanced operations
   * @returns {Y.Doc} Yjs document
   */
  getYDoc() {
    return this.ydoc;
  }

  /**
   * Get Yjs state map for advanced operations
   * @returns {Y.Map} Yjs map
   */
  getYMap() {
    return this.state;
  }

  /**
   * Get awareness instance (for cursor/presence tracking)
   * @returns {Object|null} Awareness instance if libp2pProvider exists
   */
  getAwareness() {
    return this.libp2pProvider?.awareness || null;
  }

  /**
   * Request a full Yjs state sync from peers once the backing network is live.
   * PeerComputeProvider is created during StateManager initialization, which can
   * happen before NodeKernel connects the NetworkManager.
   */
  async requestProviderSync() {
    if (!this.libp2pProvider?.requestSync) return false;
    await this.libp2pProvider.requestSync();
    return true;
  }

  /**
   * Clear all state
   * @returns {void}
   */
  clear() {
    if (!this.isInitialized) {
      throw new Error('StateManager not initialized');
    }
    
    this.ydoc.transact(() => {
      this.state.clear();
    });
  }

  /**
   * Destroy the state manager and cleanup resources
   * @returns {Promise<void>}
   */
  async destroy() {
    try {
      // Cleanup libp2p provider
      if (this.libp2pProvider) {
        this.libp2pProvider.destroy();
        this.libp2pProvider = null;
      }
      
      // Cleanup IndexedDB provider
      if (this.indexeddbProvider) {
        this.indexeddbProvider.destroy();
        this.indexeddbProvider = null;
      }
      
      // Clear subscribers
      this.subscribers.clear();
      this.globalSubscribers.clear();
      
      // Destroy Yjs document
      this.ydoc.destroy();
      
      this.isInitialized = false;
      console.log('[StateManager] Destroyed');
      
    } catch (error) {
      console.error('[StateManager] Destroy failed:', error);
      throw error;
    }
  }

  /**
   * Clear persisted IndexedDB data for this document.
   * Note: this clears the whole document, not just a namespace.
   */
  async clearPersistence() {
    if (this.indexeddbProvider?.clearData) {
      try {
        await this.indexeddbProvider.clearData();
        console.log('[StateManager] IndexedDB persistence cleared');
      } catch (err) {
        console.error('[StateManager] Failed to clear IndexedDB persistence', err);
      }
    }
  }

  /**
   * Delete any IndexedDB databases that start with the given prefix.
   * Useful to clean up docName-per-node databases from previous runs.
   */
  async clearAllPersistenceByPrefix(prefix, excludeNames = []) {
    if (typeof indexedDB?.databases !== 'function') return;
    try {
      const dbs = await indexedDB.databases();
      for (const db of dbs || []) {
        if (db?.name && db.name.startsWith(prefix) && !excludeNames.includes(db.name)) {
          await new Promise((resolve, reject) => {
            const req = indexedDB.deleteDatabase(db.name);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
            req.onblocked = () => resolve(); // best-effort
          });
        }
      }
      console.log(`[StateManager] Cleared IndexedDB databases with prefix ${prefix}`);
    } catch (err) {
      console.warn('[StateManager] Failed to enumerate/delete IndexedDB databases', err);
    }
  }

  getDocName() {
    return this.config.docName;
  }

  /**
   * Get state manager statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      keyCount: this.state.size,
      subscriberCount: this.subscribers.size,
      globalSubscriberCount: this.globalSubscribers.size,
      hasPersistence: !!this.indexeddbProvider,
      hasP2PSync: !!this.libp2pProvider,
      docName: this.config.docName,
      topic: this.config.topic,
      hotBufferCount: this.dataState?.listHotBuffers?.().length || 0
    };
  }
}
