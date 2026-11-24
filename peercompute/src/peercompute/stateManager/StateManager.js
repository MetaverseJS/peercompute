import { ModelEvidenceStore } from '../modelEvidence/ModelEvidenceStore.js';
/**
 * @fileoverview State Manager - Manages shared data state using Yjs CRDT
 * Coordinates read/write access with automatic P2P synchronization
 * 
 * Uses Yjs for conflict-free replicated data types (CRDT) and PeerComputeProvider
 * for automatic synchronization across the P2P network.
 */

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import {
  bytesFromSerializable,
  isEmptyYjsUpdate,
  PeerComputeProvider
} from './PeerComputeProvider.js';
import { DataState } from './DataState.js';
import { LocalArtifactCache } from './LocalArtifactCache.js';
import { ArtifactStore } from '../artifacts/ArtifactStore.js';
import { AgentRecordStore } from '../agents/AgentRecordStore.js';
import { WorldKnowledgeStore } from '../agents/WorldKnowledgeStore.js';
import { WorldObjectStore } from '../agents/WorldObjectStore.js';
import { ResidentDiagnosticsStore } from '../agents/ResidentDiagnosticsStore.js';
import { WorldMemoryStore } from '../agents/WorldMemoryStore.js';
import { WorldGoalStore } from '../agents/WorldGoalStore.js';
import { WorldStandingGoalStore } from '../agents/WorldStandingGoalStore.js';
import { ReservationLedger } from './ReservationLedger.js';
import { SpatialTileLeaseBroker } from './SpatialTileLeaseBroker.js';

export const STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_SCHEMA = 'peercompute.state.task-graph-cache-artifact-admission.v0';
export const STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_SCHEMA = 'peercompute.state.task-graph-cache-artifact-invalidation.v0';
export const STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE = 'taskGraphCacheArtifactAdmissions';
export const STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE = 'taskGraphCacheArtifactInvalidations';

const NAMESPACE_MAP_PREFIX = 'ns:';
const DEFAULT_PERSISTENCE_SYNC_TIMEOUT_MS = 5000;
const DEFAULT_MAX_TASK_GRAPH_INVALIDATIONS = 256;

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
      persistenceSyncTimeoutMs: Number.isFinite(config.persistenceSyncTimeoutMs) && config.persistenceSyncTimeoutMs > 0
        ? config.persistenceSyncTimeoutMs
        : DEFAULT_PERSISTENCE_SYNC_TIMEOUT_MS,
      maxTaskGraphInvalidationRecords: Number.isSafeInteger(config.maxTaskGraphInvalidationRecords)
        && config.maxTaskGraphInvalidationRecords > 0
        ? config.maxTaskGraphInvalidationRecords
        : DEFAULT_MAX_TASK_GRAPH_INVALIDATIONS,
      disableNetworkProvider: config.disableNetworkProvider || false,
      disableBroadcast: config.disableBroadcast || false,
      broadcastNamespaces: Array.isArray(config.broadcastNamespaces) ? config.broadcastNamespaces : null,
      ...config
    };
    this.localNodeId = config.nodeId || null;
    this.initPromise = null;
    this.destroyed = false;
    this.destroying = null;
    
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
    this.modelEvidenceStores = new Map();
    this.agentRecordStores = new Map();
    this.worldMemoryStores = new Map();
    this.worldKnowledgeStores = new Map();
    this.worldObjectStores = new Map();
    this.residentDiagnosticsStores = new Map();
    this.reservationLedgers = new Map();
    this.spatialTileLeaseBrokers = new Map();
    this.worldGoalStores = new Map();
    this.worldStandingGoalStores = new Map();
  }

  /**
   * Internal helper to get a deterministic top-level namespaced Y.Map.
   * Using root Y.Doc named maps avoids nested-Y.Map concurrent creation races
   * and keeps observation/reads completely mutation-free.
   * @param {string} namespace
   * @returns {Y.Map}
   * @private
   */
  _getNamespaceMap(namespace) {
    return this.ydoc.getMap(`${NAMESPACE_MAP_PREFIX}${namespace}`);
  }

  /**
   * Read-only fallback lookup for historical nested Y.Maps stored under `this.state`.
   * @param {string} namespace
   * @returns {Y.Map|null}
   * @private
   */
  _getLegacyNamespaceMap(namespace) {
    const legacy = this.state.get(namespace);
    return legacy instanceof Y.Map ? legacy : null;
  }

  /**
   * Whether legacy `state-set` pubsub broadcasts should be emitted.
   * Disabled automatically when PeerComputeProvider is active to prevent
   * dual-sync message amplification.
   * @param {string|null} namespace
   * @returns {boolean}
   * @private
   */
  _shouldBroadcastStateSet(namespace = null) {
    if (this.libp2pProvider) return false;
    if (!this.networkManager?.broadcast || this.config.disableBroadcast) return false;
    if (namespace && this.config.broadcastNamespaces && !this.config.broadcastNamespaces.includes(namespace)) {
      return false;
    }
    return true;
  }

  /**
   * Apply a Yjs update received from the network (libp2p pubsub path)
   * @param {Array|Uint8Array|string} updateArr
   */
  applyRemoteUpdate(updateArr) {
    try {
      const normalized = bytesFromSerializable(updateArr);
      if (isEmptyYjsUpdate(normalized)) {
        return;
      }
      Y.applyUpdate(this.ydoc, normalized, 'remote-yjs-update');
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
          const legacy = this._getLegacyNamespaceMap(namespace);
          if (value === undefined) {
            nsMap.delete(key);
            legacy?.delete(key);
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

  /**
   * Create a bounded local-only source-artifact cache.
   *
   * This method does not require initialize(): the cache is deliberately
   * separate from the Y.Doc, y-indexeddb, and network-provider lifecycles.
   * @param {Object} options LocalArtifactCache options
   * @returns {LocalArtifactCache}
   */
  createLocalArtifactCache(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const cache = new LocalArtifactCache({
      ...options,
      onDestroy: (destroyedCache) => {
        this.dataState.unregisterLocalArtifactCache(destroyedCache.name, destroyedCache);
        options.onDestroy?.(destroyedCache);
      }
    });
    try {
      return this.dataState.registerLocalArtifactCache(cache.name, cache);
    } catch (error) {
      void cache.destroy();
      throw error;
    }
  }

  getLocalArtifactCache(name) {
    return this.dataState.getLocalArtifactCache(name);
  }

  /** Binary blocks and local metadata remain outside the replicated Y.Doc. */
  createArtifactStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.getArtifactStore(name)) throw new Error(`Artifact store ${name} is already registered`);
    const store = new ArtifactStore({ ...options, name, onDestroy: (closed) => {
      this.dataState.unregisterArtifactStore(closed);
      options.onDestroy?.(closed);
    } });
    return this.dataState.registerArtifactStore(store);
  }

  getArtifactStore(name = 'default') { return this.dataState.getArtifactStore(name); }

  /** Private observation journals/outboxes stay outside replicated room state. */
  createModelEvidenceStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.modelEvidenceStores.has(name)) throw new Error(`Model evidence store ${name} is already registered`);
    const store = new ModelEvidenceStore({ ...options, name, onDestroy: (closed) => {
      if (this.modelEvidenceStores.get(name) === closed) this.modelEvidenceStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.modelEvidenceStores.set(name, store); return store;
  }
  getModelEvidenceStore(name = 'default') { return this.modelEvidenceStores.get(name) || null; }

  /** Acknowledged private agent journals never enter the replicated Y.Doc. */
  createAgentRecordStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.agentRecordStores.has(name)) throw new Error(`Agent store ${name} is already registered`);
    const store = new AgentRecordStore({ ...options, name, onDestroy: (closed) => {
      if (this.agentRecordStores.get(name) === closed) this.agentRecordStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.agentRecordStores.set(name, store);
    return store;
  }

  getAgentRecordStore(name = 'default') { return this.agentRecordStores.get(name) || null; }

  /** Private scoped episodes persist separately from operation journals and Yjs. */
  createWorldMemoryStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.worldMemoryStores.has(name)) throw new Error(`World memory store ${name} is already registered`);
    const store = new WorldMemoryStore({ ...options, name, onDestroy: closed => {
      if (this.worldMemoryStores.get(name) === closed) this.worldMemoryStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.worldMemoryStores.set(name, store); return store;
  }

  getWorldMemoryStore(name = 'default') { return this.worldMemoryStores.get(name) || null; }

  /** Evidence-backed local knowledge; sharing requires an explicit profile grant. */
  createWorldKnowledgeStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.worldKnowledgeStores.has(name)) throw new Error(`World knowledge store ${name} is already registered`);
    const store = new WorldKnowledgeStore({ ...options, name, onDestroy: closed => {
      if (this.worldKnowledgeStores.get(name) === closed) this.worldKnowledgeStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.worldKnowledgeStores.set(name, store); return store;
  }

  getWorldKnowledgeStore(name = 'default') { return this.worldKnowledgeStores.get(name) || null; }

  /** Durable CAS heads and receipts for retained world-object transforms. */
  createWorldObjectStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.worldObjectStores.has(name)) throw new Error(`World object store ${name} is already registered`);
    const store = new WorldObjectStore({ ...options, name, onDestroy: closed => {
      if (this.worldObjectStores.get(name) === closed) this.worldObjectStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.worldObjectStores.set(name, store); return store;
  }
  getWorldObjectStore(name = 'default') { return this.worldObjectStores.get(name) || null; }


  /** Owner-local diagnostics never enter replicated state or model context. */
  createResidentDiagnosticsStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.residentDiagnosticsStores.has(name)) throw new Error(`Resident diagnostics store ${name} is already registered`);
    const store = new ResidentDiagnosticsStore({ ...options, name, onDestroy: closed => {
      if (this.residentDiagnosticsStores.get(name) === closed) this.residentDiagnosticsStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.residentDiagnosticsStores.set(name, store); return store;
  }

  getResidentDiagnosticsStore(name = 'default') { return this.residentDiagnosticsStores.get(name) || null; }

  /**
   * Bounded CAS multi-consumer reservations (ReservationLedger.js). The
   * ledger in this realm is the authority; with `auditNamespace` each
   * transition is also written as a scoped audit record (evidence only).
   */
  createReservationLedger(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.reservationLedgers.has(name)) throw new Error(`Reservation ledger ${name} is already registered`);
    const auditNamespace = options.auditNamespace ? String(options.auditNamespace) : null;
    const ledger = new ReservationLedger({
      ...options,
      name,
      audit: (record) => {
        if (auditNamespace) this.writeScoped(auditNamespace, record.key, record);
        options.audit?.(record);
      },
      onDestroy: (closed) => {
        if (this.reservationLedgers.get(name) === closed) {
          this.reservationLedgers.delete(name);
        }
        options.onDestroy?.(closed);
      }
    });
    this.reservationLedgers.set(name, ledger);
    return ledger;
  }

  getReservationLedger(name = 'default') { return this.reservationLedgers.get(name) || null; }

  destroyReservationLedger(name = 'default') {
    const ledger = this.reservationLedgers.get(name);
    if (!ledger) return false;
    // Detach first: cleanup may create a replacement with the same name.
    this.reservationLedgers.delete(name);
    ledger.destroy();
    return true;
  }

  /**
   * Epoch-fenced spatial tile lease coordinator and opaque binary boundary
   * summary exchange primitive built on ReservationLedger + StateManager.
   */
  createSpatialTileLeaseBroker(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.spatialTileLeaseBrokers.has(name)) {
      throw new Error(`Spatial tile lease broker ${name} is already registered`);
    }
    const broker = new SpatialTileLeaseBroker({
      ...options,
      name,
      stateManager: this,
      onDestroy: (closed) => {
        if (this.spatialTileLeaseBrokers.get(name) === closed) {
          this.spatialTileLeaseBrokers.delete(name);
        }
        options.onDestroy?.(closed);
      }
    });
    this.spatialTileLeaseBrokers.set(name, broker);
    return broker;
  }

  getSpatialTileLeaseBroker(name = 'default') {
    return this.spatialTileLeaseBrokers.get(name) || null;
  }

  destroySpatialTileLeaseBroker(name = 'default') {
    const broker = this.spatialTileLeaseBrokers.get(name);
    if (!broker) return false;
    this.spatialTileLeaseBrokers.delete(name);
    broker.destroy();
    return true;
  }

  /** Owner-local objectives are durable checkpoints, never replicated state. */
  createWorldGoalStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.worldGoalStores.has(name)) throw new Error(`World goal store ${name} is already registered`);
    const store = new WorldGoalStore({ ...options, name, onDestroy: closed => {
      if (this.worldGoalStores.get(name) === closed) this.worldGoalStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.worldGoalStores.set(name, store); return store;
  }

  getWorldGoalStore(name = 'default') { return this.worldGoalStores.get(name) || null; }

  /** Local standing-goal encounter receipts are never replicated or auto-replayed. */
  createWorldStandingGoalStore(options = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const name = options.name || 'default';
    if (this.worldStandingGoalStores.has(name)) throw new Error(`World standing goal store ${name} is already registered`);
    const store = new WorldStandingGoalStore({ ...options, name, onDestroy: closed => {
      if (this.worldStandingGoalStores.get(name) === closed) this.worldStandingGoalStores.delete(name);
      options.onDestroy?.(closed);
    } });
    this.worldStandingGoalStores.set(name, store); return store;
  }

  getWorldStandingGoalStore(name = 'default') { return this.worldStandingGoalStores.get(name) || null; }

  async ensureArtifact(cid, { storeName = 'default', signal } = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    const store = this.getArtifactStore(storeName);
    if (!store) throw new Error(`Artifact store ${storeName} is not configured`);
    return store.ensureLocal(cid, { signal, fetchBlock: (blockCid, options = {}) => {
      if (!this.networkManager?.fetchArtifactBlock) throw new Error('Artifact networking is not configured');
      return this.networkManager.fetchArtifactBlock(blockCid, { ...options, artifactCid: cid });
    } });
  }

  async publishArtifact(cid) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    if (!this.networkManager?.announceArtifact) throw new Error('Artifact networking is not configured');
    return this.networkManager.announceArtifact(cid);
  }

  async unpublishArtifact(cid, { storeName = 'default', unpin = false } = {}) {
    if (this.destroyed) throw new Error('StateManager is destroyed');
    if (!this.networkManager?.withdrawArtifact) throw new Error('Artifact networking is not configured');
    await this.networkManager.withdrawArtifact(cid);
    if (unpin) await this.getArtifactStore(storeName)?.unpin(cid);
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
      sourceNodeId: options.sourceNodeId || this.localNodeId || this.state.get('nodeId') || null,
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
      sourceNodeId: options.sourceNodeId || this.localNodeId || this.state.get('nodeId') || null
    };
    this.writeScoped(
      STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE,
      invalidation.invalidationId,
      invalidation
    );
    const maxInvalidations = this.config.maxTaskGraphInvalidationRecords || DEFAULT_MAX_TASK_GRAPH_INVALIDATIONS;
    const invalidationKeys = this.listNamespaceKeys(STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE);
    if (invalidationKeys.length > maxInvalidations) {
      const oldest = invalidationKeys
        .map((key) => ({
          key,
          ts: Number(this.readScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE, key)?.invalidatedAt ?? 0)
        }))
        .sort((a, b) => a.ts - b.ts || a.key.localeCompare(b.key))
        .slice(0, invalidationKeys.length - maxInvalidations);
      for (const entry of oldest) {
        this.deleteScoped(STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE, entry.key);
      }
    }
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
    if (this.destroyed) {
      throw new Error('StateManager is destroyed');
    }
    if (this.isInitialized) {
      console.warn('[StateManager] Already initialized');
      return;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Set up IndexedDB persistence if enabled and available in this runtime
        if (this.config.enablePersistence) {
          if (typeof globalThis.indexedDB?.open !== 'function') {
            console.warn('[StateManager] IndexedDB unavailable in this runtime, continuing in memory');
            this.persistenceFailed = true;
          } else {
            try {
              const persistence = new IndexeddbPersistence(
                this.config.docName,
                this.ydoc
              );
              this.indexeddbProvider = persistence;

              // Wait for persistence to sync from IndexedDB with a bounded timeout
              const timeoutMs = this.config.persistenceSyncTimeoutMs || DEFAULT_PERSISTENCE_SYNC_TIMEOUT_MS;
              const synced = await new Promise((resolve) => {
                let settled = false;
                const done = (ok) => {
                  if (settled) return;
                  settled = true;
                  clearTimeout(timer);
                  resolve(ok);
                };
                const timer = setTimeout(() => done(false), timeoutMs);
                timer?.unref?.();
                persistence.once('synced', () => done(true));
              });

              if (synced) {
                console.log('[StateManager] IndexedDB persistence loaded');
              } else {
                console.warn(`[StateManager] IndexedDB persistence sync timed out after ${timeoutMs}ms, continuing in memory`);
                this.persistenceFailed = true;
                try { await persistence.destroy?.(); } catch {}
                if (this.indexeddbProvider === persistence) {
                  this.indexeddbProvider = null;
                }
              }
            } catch (error) {
              console.warn('[StateManager] IndexedDB persistence failed, continuing in memory:', error);
              this.persistenceFailed = true;
              try { await this.indexeddbProvider?.destroy?.(); } catch {}
              this.indexeddbProvider = null;
            }
          }
        }

        if (this.destroyed) {
          return;
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
        if (initialState && typeof initialState === 'object' && Object.keys(initialState).length > 0) {
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
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
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

    // Legacy fallback broadcast only when PeerComputeProvider is inactive
    if (this._shouldBroadcastStateSet()) {
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

    if (this._shouldBroadcastStateSet(namespace)) {
      this.networkManager.broadcast({
        type: 'state-set',
        data: { namespace, key, value }
      }).catch(() => {});
    }
  }

  /**
   * Read a value from a namespaced map
   * @param {string} namespace
   * @param {string} key
   */
  readScoped(namespace, key) {
    const nsMap = this._getNamespaceMap(namespace);
    if (nsMap.has(key)) return nsMap.get(key);
    const legacy = this._getLegacyNamespaceMap(namespace);
    return legacy ? legacy.get(key) : undefined;
  }

  /**
   * Check existence of a key within a namespace without pulling the value.
   */
  hasScoped(namespace, key) {
    const nsMap = this._getNamespaceMap(namespace);
    if (nsMap.has(key)) return true;
    const legacy = this._getLegacyNamespaceMap(namespace);
    return legacy ? legacy.has(key) : false;
  }

  /**
   * List keys within a namespace
   * @param {string} namespace
   * @returns {string[]}
   */
  listNamespaceKeys(namespace) {
    const nsMap = this._getNamespaceMap(namespace);
    const legacy = this._getLegacyNamespaceMap(namespace);
    if (!legacy) {
      return Array.from(nsMap.keys());
    }
    return Array.from(new Set([...legacy.keys(), ...nsMap.keys()]));
  }

  /**
   * Clear all entries in a namespace
   * @param {string} namespace
   */
  clearNamespace(namespace) {
    const nsMap = this._getNamespaceMap(namespace);
    const legacy = this._getLegacyNamespaceMap(namespace);
    const keys = this.listNamespaceKeys(namespace);
    if (keys.length === 0) return;
    this.ydoc.transact(() => {
      keys.forEach((k) => {
        nsMap.delete(k);
        legacy?.delete(k);
      });
    });
    if (this._shouldBroadcastStateSet(namespace)) {
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
    const nsMap = this._getNamespaceMap(namespace);
    const legacy = this._getLegacyNamespaceMap(namespace);
    const existed = nsMap.has(key) || Boolean(legacy?.has(key));
    if (!existed) return;
    this.ydoc.transact(() => {
      nsMap.delete(key);
      legacy?.delete(key);
    });
    if (this._shouldBroadcastStateSet(namespace)) {
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
   * Observe changes within a namespaced map.
   * Read-only: attaching an observer never mutates the Yjs CRDT or emits updates.
   * @param {string} namespace
   * @param {Function} callback - (value, key) => void
   * @returns {Function} unsubscribe
   */
  observeNamespace(namespace, callback) {
    const nsMap = this._getNamespaceMap(namespace);
    let active = true;

    const namespaceHandler = (event) => {
      if (!active || event.target !== nsMap) return;
      event.keysChanged.forEach((key) => {
        if (!active) return;
        try {
          callback(nsMap.get(key), key);
        } catch (error) {
          console.error('[StateManager] Namespace observer error:', error);
        }
      });
    };

    nsMap.observe(namespaceHandler);

    return () => {
      if (!active) return;
      active = false;
      nsMap.unobserve(namespaceHandler);
    };
  }

  /**
   * Get the Y.Map backing a namespace (top-level named CRDT map).
   * @param {string} namespace
   * @returns {Y.Map}
   */
  getNamespaceMap(namespace) {
    return this._getNamespaceMap(namespace);
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
    if (this.destroying) return this.destroying;
    this.destroyed = true;
    this.destroying = (async () => {
      const errors = [];
      const cleanup = async (operation) => { try { await operation(); } catch (error) { errors.push(error); } };
      // Agent runners acknowledge cancellation before private journals close.
      for (const store of [...this.modelEvidenceStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.agentRecordStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.worldMemoryStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.worldKnowledgeStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.worldObjectStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.residentDiagnosticsStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.worldGoalStores.values()]) await cleanup(() => store.destroy());
      for (const store of [...this.worldStandingGoalStores.values()]) await cleanup(() => store.destroy());
      // Reservation resources are released exactly once by their ledger.
      for (const broker of [...this.spatialTileLeaseBrokers.values()]) await cleanup(() => broker.destroy());
      this.spatialTileLeaseBrokers.clear();
      for (const ledger of [...this.reservationLedgers.values()]) await cleanup(() => ledger.destroy());
      this.reservationLedgers.clear();
      // Local artifact bytes live outside Yjs but remain owned by this manager.
      // Destroy handles without deleting their optional persistent records.
      await cleanup(() => this.dataState.destroyArtifactStores());
      await cleanup(() => this.dataState.destroyLocalArtifactCaches());

      // Cleanup libp2p provider
      if (this.libp2pProvider) {
        await cleanup(() => this.libp2pProvider.destroy());
        this.libp2pProvider = null;
      }
      
      // Cleanup IndexedDB provider
      if (this.indexeddbProvider) {
        await cleanup(() => this.indexeddbProvider.destroy());
        this.indexeddbProvider = null;
      }
      
      // Clear subscribers
      this.subscribers.clear();
      this.globalSubscribers.clear();
      
      // Destroy Yjs document
      await cleanup(() => this.ydoc.destroy());
      
      this.isInitialized = false;
      console.log('[StateManager] Destroyed');
      
      if (errors.length) throw new AggregateError(errors, 'StateManager cleanup failed');
    })();
    return this.destroying;
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
    const localArtifactCaches = this.dataState.getLocalArtifactCacheStats();
    const artifacts = this.dataState.getArtifactStoreStats();
    return {
      isInitialized: this.isInitialized,
      keyCount: this.state.size,
      subscriberCount: this.subscribers.size,
      globalSubscriberCount: this.globalSubscribers.size,
      hasPersistence: !!this.indexeddbProvider,
      hasP2PSync: !!this.libp2pProvider,
      docName: this.config.docName,
      topic: this.config.topic,
      hotBufferCount: this.dataState?.listHotBuffers?.().length || 0,
      localArtifactCacheCount: localArtifactCaches.caches,
      localArtifactCacheEntryCount: localArtifactCaches.entries,
      localArtifactCacheResidentBytes: localArtifactCaches.residentBytes,
      localArtifactCachePendingCount: localArtifactCaches.pending,
      artifactStoreCount: artifacts.stores,
      artifactStoredBytes: artifacts.storedBytes,
      artifactPendingCount: artifacts.pending
    };
  }
}
