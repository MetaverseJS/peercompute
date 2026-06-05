/**
 * @fileoverview Node Kernel - Main coordinator for the PeerCompute node
 * Manages State, Network, and Compute managers
 * Acts as the central orchestrator for all node operations
 */

import { NetworkManager } from '../networkManager/NetworkManager.js';
import { StateManager } from '../stateManager/StateManager.js';
import { ComputeManager } from '../computeManager/ComputeManager.js';
import { GPUHubManager } from '../gpu/GPUHubManager.js';
import { generateId } from '../utils/Utils.js';
import { isDebugOutputEnabled } from '../utils/debugOutput.js';

const NETVIZ_DEBUG_CHANNEL = 'peercompute-netviz-debug-v1';
const NETVIZ_DEBUG_TELEMETRY_PREFIX = 'telemetry:';
const NETVIZ_SESSION_TOPIC = 'peercompute-netviz-sessions';
const PEERCOMPUTE_KERNEL_REGISTRY_KEY = '__PEERCOMPUTE_KERNELS__';
const PEERCOMPUTE_KERNEL_LAST_KEY = '__PEERCOMPUTE_LAST_KERNEL__';
const PEERCOMPUTE_KERNEL_INDEX_KEY = '__PEERCOMPUTE_KERNEL_INDEX__';
export const REMOTE_COMPUTE_REQUEST_SCHEMA = 'peercompute.compute.remote-request.v0';
export const REMOTE_COMPUTE_RESULT_SCHEMA = 'peercompute.compute.remote-result.v0';
export const REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA = 'peercompute.nodekernel.remote-compute-placement-provenance.v0';
export const NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA = 'peercompute.nodekernel.redundant-network-placement.v0';
export const NODE_KERNEL_PEER_CAPABILITIES_SCHEMA = 'peercompute.nodekernel.peer-capabilities.v0';
export const NODE_KERNEL_COMPUTE_CAPACITY_SCHEMA = 'peercompute.nodekernel.compute-capacity.v0';

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeFiniteNumber(value, fallback = null, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function cloneSessionMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return null;
  try {
    return JSON.parse(JSON.stringify(metadata));
  } catch (_) {
    return null;
  }
}

function hasOwn(value, key) {
  return value != null
    && typeof value === 'object'
    && Object.prototype.hasOwnProperty.call(value, key);
}

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return null;
}

function normalizePeerIdList(value) {
  const source = Array.isArray(value)
    ? value
    : value instanceof Set
      ? Array.from(value)
      : typeof value === 'string'
        ? value.split(',')
        : value == null
          ? []
          : [value];
  const seen = new Set();
  const out = [];
  for (const entry of source) {
    const peerId = String(entry || '').trim();
    if (!peerId || seen.has(peerId)) continue;
    seen.add(peerId);
    out.push(peerId);
  }
  return out;
}

function stableRemoteResultValue(value) {
  if (value == null) return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (typeof value === 'function') return `[Function:${value.name || 'anonymous'}]`;
  if (ArrayBuffer.isView(value)) {
    return {
      typedArray: value.constructor?.name || 'TypedArray',
      values: Array.from(value)
    };
  }
  if (value instanceof ArrayBuffer) {
    return {
      arrayBufferBytes: Array.from(new Uint8Array(value))
    };
  }
  if (Array.isArray(value)) return value.map(stableRemoteResultValue);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const entry = stableRemoteResultValue(value[key]);
      if (entry !== undefined) out[key] = entry;
    }
    return out;
  }
  return String(value);
}

function hashRemoteResultString(value) {
  const input = String(value ?? '');
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32-${hash.toString(16).padStart(8, '0')}`;
}

function hashRemoteResultValue(value) {
  if (value === undefined) return null;
  return hashRemoteResultString(JSON.stringify(stableRemoteResultValue(value)));
}

function replicaRequestId(baseRequestId, index, peerId) {
  if (!baseRequestId) return undefined;
  const safePeerId = String(peerId || `peer-${index}`).replace(/[^a-zA-Z0-9_.:-]/g, '_');
  return `${baseRequestId}:replica:${index}:${safePeerId}`;
}

/**
 * NodeKernel class - Core orchestrator for a PeerCompute node
 * Coordinates State, Network, and Compute managers
 */
export class NodeKernel {
  /**
   * @param {Object} config - Configuration options for the node
   * @param {string} config.topology - Network topology: 'hierarchy' | 'distributed' | 'emergent'
   * @param {string} config.topologyId - Topology identifier shared across rooms
   * @param {string} config.topicPrefix - Base prefix for scoped topics
   * @param {boolean} config.useScopedTopics - Enable topology + room topic scoping
   * @param {string} config.storageMode - Data storage mode: 'local' | 'propagate'
   * @param {boolean} config.enableWebGPU - Enable WebGPU compute capabilities
   * @param {boolean} config.enablePersistence - Enable IndexedDB persistence
   * @param {Array<string>} config.bootstrapPeers - Bootstrap peer multiaddrs
   * @param {string} config.stateTopic - P2P state sync topic
   * @param {number} config.presenceIntervalMs - Presence heartbeat interval in ms
   * @param {string} config.pubsubType - Pubsub router to use ('floodsub' or 'gossipsub')
   * @param {Object} config.gossipsub - Optional gossipsub configuration overrides
   * @param {number|null} config.maxDialPeers - Limit outbound dials to discovered peers (null disables)
   * @param {number} config.bootstrapDialThrottleMs - Throttle for bootstrap redial attempts
   * @param {boolean} config.dropRelayBootstrapOnDirect - Drop relay bootstrap when direct peers exist
   * @param {number} config.maxConnections - Max libp2p connections per node
   * @param {number} config.maxIncomingPendingConnections - Max pending inbound connections
   * @param {boolean} config.enableNetVizDebugTelemetry - Publish `telemetry:<peerId>` warm deltas for NetViz attach/debug
   * @param {number} config.netVizDebugTelemetryIntervalMs - NetViz telemetry publish interval in ms
   * @param {boolean} config.enableNetVizSessionBroadcast - Broadcast active demo session metadata for NetViz attach picker
   * @param {boolean} config.enableNetVizSessionDiscovery - Listen for active NetViz session metadata over pubsub
   * @param {string} config.netVizSessionTopic - Cross-demo pubsub topic used for NetViz session discovery
   * @param {boolean} config.debugOutput - Emit verbose network debug logs (or enable via URL `?debugoutput=true`)
   */
  constructor(config = {}) {
    const clockPolicy = this._normalizeClockPolicy(config.clockPolicy);
    const topologyType = config.topologyType || config.topology || 'distributed';
    const topologyId = config.topologyId || config.topologyKey || config.gameId || 'default-topology';
    const roomId = config.roomId || 'default-room';
    const topicPrefix = config.topicPrefix || config.topicBase || 'pc';
    const useScopedTopics = config.useScopedTopics !== false;
    const scopedStateTopic = `${topicPrefix}.${topologyId}.${roomId}.state`;
    const enableNetVizDebugTelemetry = config.enableNetVizDebugTelemetry !== false;
    const enableWarmDeltaProvider =
      typeof config.enableWarmDeltaProvider === 'boolean'
        ? config.enableWarmDeltaProvider
        : enableNetVizDebugTelemetry;
    const netVizDebugTelemetryIntervalMs = Number.isFinite(config.netVizDebugTelemetryIntervalMs)
      ? Math.max(500, config.netVizDebugTelemetryIntervalMs)
      : 2000;
    const netVizDebugSessionIntervalMs = Number.isFinite(config.netVizDebugSessionIntervalMs)
      ? Math.max(1000, config.netVizDebugSessionIntervalMs)
      : 2000;
    const netVizSessionTopic =
      typeof config.netVizSessionTopic === 'string' && config.netVizSessionTopic.trim()
        ? config.netVizSessionTopic.trim()
        : NETVIZ_SESSION_TOPIC;
    const enableNetVizSessionBroadcast = config.enableNetVizSessionBroadcast !== false;
    const enableNetVizSessionDiscovery = config.enableNetVizSessionDiscovery === true;
    const debugOutput = typeof config.debugOutput === 'boolean'
      ? config.debugOutput
      : isDebugOutputEnabled();
    const netVizSessionStaleMs = Number.isFinite(config.netVizSessionStaleMs)
      ? Math.max(5000, config.netVizSessionStaleMs)
      : 15000;
    const additionalPubsubTopics = [];
    if (Array.isArray(config.additionalPubsubTopics)) {
      config.additionalPubsubTopics
        .map((topic) => String(topic || '').trim())
        .filter(Boolean)
        .forEach((topic) => additionalPubsubTopics.push(topic));
    }
    if (enableNetVizSessionDiscovery && !additionalPubsubTopics.includes(netVizSessionTopic)) {
      additionalPubsubTopics.push(netVizSessionTopic);
    }
    const netVizDebugTelemetryTaskPrefix =
      typeof config.netVizDebugTelemetryTaskPrefix === 'string' && config.netVizDebugTelemetryTaskPrefix.trim()
        ? config.netVizDebugTelemetryTaskPrefix.trim()
        : NETVIZ_DEBUG_TELEMETRY_PREFIX;
    this.config = {
      topology: topologyType,
      topologyId,
      topicPrefix,
      useScopedTopics,
      storageMode: config.storageMode || 'local',
      enableWebGPU: config.enableWebGPU || false,
      enableGPUHub: config.enableGPUHub !== false,
      enableWarmDeltaProvider,
      enableNetVizDebugTelemetry,
      netVizDebugTelemetryIntervalMs,
      netVizDebugTelemetryTaskPrefix,
      enableNetVizSessionBroadcast,
      enableNetVizSessionDiscovery,
      debugOutput,
      netVizSessionTopic,
      netVizSessionStaleMs,
      netVizDebugSessionIntervalMs,
      enableRemoteComputeResponder: config.enableRemoteComputeResponder === true,
      allowRemoteFunctionTasks: config.allowRemoteFunctionTasks === true,
      remoteComputeTimeoutMs: normalizeInteger(config.remoteComputeTimeoutMs, 30000, 1, 3600000),
      netVizAttachPath: config.netVizAttachPath || '/netviz/',
      additionalPubsubTopics,
      enablePersistence: config.enablePersistence !== false,
      disableStateNetworkProvider: config.disableStateNetworkProvider || false,
      disableStateBroadcast: config.disableStateBroadcast || false,
      bootstrapPeers: Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers : [],
      gameId: config.gameId || 'default-game',
      roomId,
      stateTopic: config.stateTopic || (useScopedTopics ? scopedStateTopic : 'peercompute-state'),
      docName: config.docName,
      stateBroadcastNamespaces: config.stateBroadcastNamespaces,
      deltaNamespace: config.deltaNamespace || 'deltas',
      topologyMetric: config.topologyMetric || config.metric || null,
      targetConnections: config.targetConnections,
      longRangeCount: config.longRangeCount,
      longRangeRefreshMs: config.longRangeRefreshMs,
      enableSharding: config.enableSharding,
      shardSize: config.shardSize,
      shardRadius: config.shardRadius,
      enableTopologyController: config.enableTopologyController,
      enforceTopologyScope: config.enforceTopologyScope,
      topologyTickMs: config.topologyTickMs,
      gpuHubFrameBudgetMs: config.gpuHubFrameBudgetMs,
      clockPolicy,
      ...config
    };
    const normalizedSessionTopic = String(this.config.netVizSessionTopic || '').trim() || NETVIZ_SESSION_TOPIC;
    this.config.netVizSessionTopic = normalizedSessionTopic;
    const normalizedAdditionalTopics = Array.isArray(this.config.additionalPubsubTopics)
      ? this.config.additionalPubsubTopics
        .map((topic) => String(topic || '').trim())
        .filter(Boolean)
      : [];
    if (
      this.config.enableNetVizSessionDiscovery &&
      !normalizedAdditionalTopics.includes(normalizedSessionTopic)
    ) {
      normalizedAdditionalTopics.push(normalizedSessionTopic);
    }
    this.config.additionalPubsubTopics = Array.from(new Set(normalizedAdditionalTopics));

    this.stateManager = null;
    this.networkManager = null;
    this.computeManager = null;
    this.gpuHub = null;

    this.isInitialized = false;
    this.isStarted = false;
    this.nodeId = null;
    this.debugOutputEnabled = this.config.debugOutput === true;
    this.kernelClockTimer = null;
    this.netVizDebugTelemetryTimer = null;
    this.netVizDebugSessionTimer = null;
    this.netVizNetworkSessionTimer = null;
    this.netVizDebugSessionId = null;
    this.netVizDebugChannel = null;
    this.netVizDiscoveredSessions = new Map();
    this.pendingRemoteComputeRequests = new Map();
    this.kernelTickMs = Math.round(1000 / (this.config.clockPolicy.tickHz || 30));
  }

  /**
   * Initialize the node kernel and managers
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isInitialized) {
      console.warn('[NodeKernel] Already initialized');
      return;
    }

    try {
      console.log('[NodeKernel] Initializing...');
      
      // Generate unique node ID
      this.nodeId = generateId();
      this.netVizDebugSessionId = `session-${this.nodeId}`;
      this._registerBrowserKernelHandle();
      console.log(`[NodeKernel] Node ID: ${this.nodeId}`);
      
      // 1. Initialize NetworkManager first
      this.networkManager = new NetworkManager({
        topology: this.config.topology,
        topologyId: this.config.topologyId,
        topicPrefix: this.config.topicPrefix,
        useScopedTopics: this.config.useScopedTopics,
        enforceTopologyScope: this.config.enforceTopologyScope,
        enableTopologyController: this.config.enableTopologyController,
        topologyTickMs: this.config.topologyTickMs,
        topologyMetric: this.config.topologyMetric,
        targetConnections: this.config.targetConnections,
        connectionRadius: this.config.connectionRadius,
        isolationMinConnections: this.config.isolationMinConnections,
        longRangeCount: this.config.longRangeCount,
        longRangeRefreshMs: this.config.longRangeRefreshMs,
        enableSharding: this.config.enableSharding,
        shardSize: this.config.shardSize,
        shardRadius: this.config.shardRadius,
        bootstrapPeers: this.config.bootstrapPeers,
        gameId: this.config.gameId,
        roomId: this.config.roomId,
        pubsubTopic: this.config.stateTopic,
        additionalPubsubTopics: this.config.additionalPubsubTopics,
        allowDiscoveryDialWhenIsolated: this.config.allowDiscoveryDialWhenIsolated,
        allowLocalDial: this.config.allowLocalDial,
        webrtc: this.config.webrtc,
        iceServers: this.config.iceServers,
        rtcConfiguration: this.config.rtcConfiguration,
        preferDirect: this.config.preferDirect,
        dropRelayOnDirect: this.config.dropRelayOnDirect,
        dropRelayBootstrapOnDirect: this.config.dropRelayBootstrapOnDirect,
        presenceIntervalMs: this.config.presenceIntervalMs,
        maxDialPeers: this.config.maxDialPeers,
        bootstrapDialThrottleMs: this.config.bootstrapDialThrottleMs,
        maxConnections: this.config.maxConnections,
        maxIncomingPendingConnections: this.config.maxIncomingPendingConnections,
        maxParallelDials: this.config.maxParallelDials,
        maxDialQueueLength: this.config.maxDialQueueLength,
        maxPeerAddrsToDial: this.config.maxPeerAddrsToDial,
        dialTimeoutMs: this.config.dialTimeoutMs ?? this.config.dialTimeout,
        transportManager: this.config.transportManager,
        pubsubType: this.config.pubsubType,
        gossipsub: this.config.gossipsub,
        debugOutput: this.config.debugOutput,
        schedulerClock: this.config.clockPolicy.mode === 'kernel' ? 'external' : 'internal',
        schedulerProfile: this.config.clockPolicy.networkProfile,
        presenceCapabilitiesProvider: this._buildPresenceCapabilities.bind(this),
        onPublishError: this.config.onPublishError,
        onPublishSuccess: this.config.onPublishSuccess,
        onConnectionFailure: this.config.onConnectionFailure,
        onMessage: this._handleNetworkMessage.bind(this),
        onPeerConnect: this._handlePeerConnect.bind(this),
        onPeerDisconnect: this._handlePeerDisconnect.bind(this)
      });
      
      await this.networkManager.initialize();
      console.log('[NodeKernel] NetworkManager initialized');
      
      // 2. Initialize StateManager with NetworkManager
      const stateDocName = this.config.docName || `peercompute-${this.config.gameId}-${this.config.roomId}`;
      if (this.config.enableGPUHub) {
        this.gpuHub = new GPUHubManager({
          frameBudgetMs: this.config.gpuHubFrameBudgetMs
        });
      }

      this.stateManager = new StateManager(this.networkManager, {
        docName: stateDocName,
        topic: this.config.stateTopic,
        enablePersistence: this.config.enablePersistence,
        disableNetworkProvider: this.config.disableStateNetworkProvider,
        disableBroadcast: this.config.disableStateBroadcast,
        broadcastNamespaces: this.config.stateBroadcastNamespaces,
        deltaNamespace: this.config.deltaNamespace,
        hotStore: this.gpuHub?.getHotStore()
      });
      
      await this.stateManager.initialize({
        nodeId: this.nodeId,
        topology: this.config.topology,
        createdAt: Date.now()
      });
      console.log('[NodeKernel] StateManager initialized');

      if (this.config.enableWarmDeltaProvider) {
        this.networkManager.registerWarmDeltaProvider(() => this.stateManager.getWarmDeltas());
      }
      
      // 3. Initialize ComputeManager
      this.computeManager = new ComputeManager({
        enableWebGPU: this.config.enableWebGPU,
        maxWorkers: this.config.maxWorkers,
        minWorkers: this.config.minWorkers,
        targetWorkers: this.config.targetWorkers,
        initialWorkers: this.config.initialWorkers,
        autoScaleWorkers: this.config.autoScaleWorkers,
        resourceProfile: this.config.resourceProfile,
        workerBootstrapURL: this.config.workerBootstrapURL || this.config.computeWorkerBootstrapURL,
        enableWorkers: this.config.enableWorkers !== false
      });
      await this.computeManager.initialize();
      this.computeManager.setCommitDeltaHandler((delta) => {
        this.stateManager?.commitDelta?.(delta);
      });
      console.log('[NodeKernel] ComputeManager initialized');
      
      this.isInitialized = true;
      console.log('[NodeKernel] Initialization complete');
      
    } catch (error) {
      console.error('[NodeKernel] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Start the node and connect to the P2P network
   * @param {Array<string>} bootstrapPeers - Bootstrap peer multiaddrs (optional)
   * @returns {Promise<void>}
   */
  async start(bootstrapPeers) {
    if (!this.isInitialized) {
      throw new Error('NodeKernel not initialized. Call initialize() first.');
    }
    
    if (this.isStarted) {
      console.warn('[NodeKernel] Already started');
      return;
    }

    try {
      console.log('[NodeKernel] Starting...');
      
      // Connect to P2P network
      await this.networkManager.connect();

      if (this.config.clockPolicy.networkProfile) {
        this.networkManager.configureScheduler(this.config.clockPolicy.networkProfile);
      }
      if (this.config.clockPolicy.mode === 'kernel') {
        this._startKernelClock();
      }
      
      // Set node state to active
      this.stateManager.write('status', 'active');
      this.stateManager.write('startedAt', Date.now());

      this._startNetVizDebugTelemetryLoop();
      this._startNetVizSessionBroadcast();
      this._startNetVizNetworkSessionLoop();
      this._logNetVizAttachHint();
      
      this.isStarted = true;
      console.log('[NodeKernel] Node started and connected to P2P network');
      
    } catch (error) {
      console.error('[NodeKernel] Start failed:', error);
      throw error;
    }
  }

  /**
   * Stop the node and cleanup resources
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.isStarted) {
      console.warn('[NodeKernel] Node not started');
      return;
    }

    try {
      console.log('[NodeKernel] Stopping...');
      this._stopKernelClock();
      this._stopNetVizDebugTelemetryLoop();
      this._stopNetVizSessionBroadcast();
      this._stopNetVizNetworkSessionLoop();
      
      // Update state
      if (this.stateManager) {
        this.stateManager.write('status', 'stopped');
      }
      
      // Disconnect from network
      if (this.networkManager) {
        await this.networkManager.disconnect();
      }
      
      // Cleanup state manager
      if (this.stateManager) {
        await this.stateManager.destroy();
      }
      
      // Cleanup compute manager
      if (this.computeManager) {
        // await this.computeManager.destroy();
      }
      
      this.isStarted = false;
      this._unregisterBrowserKernelHandle();
      console.log('[NodeKernel] Node stopped');
      
    } catch (error) {
      console.error('[NodeKernel] Stop failed:', error);
      throw error;
    }
  }

  setClockPolicy(policy = {}) {
    const next = this._normalizeClockPolicy(policy, this.config.clockPolicy);
    this.config.clockPolicy = next;
    this.kernelTickMs = Math.round(1000 / next.tickHz);
    if (this.networkManager) {
      this.networkManager.setSchedulerClock(next.mode === 'kernel' ? 'external' : 'internal');
      if (next.networkProfile) {
        this.networkManager.configureScheduler(next.networkProfile);
      }
    }
    if (this.isStarted) {
      if (next.mode === 'kernel') {
        this._startKernelClock();
      } else {
        this._stopKernelClock();
      }
    }
  }

  tick(now = Date.now()) {
    this.networkManager?.tickScheduler?.(now);
  }

  _startKernelClock() {
    if (this.kernelClockTimer) return;
    const intervalMs = Math.max(10, this.kernelTickMs || 33);
    this.kernelClockTimer = setInterval(() => {
      this.tick(Date.now());
    }, intervalMs);
  }

  _stopKernelClock() {
    if (!this.kernelClockTimer) return;
    clearInterval(this.kernelClockTimer);
    this.kernelClockTimer = null;
  }

  _isBrowserRuntime() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  _registerBrowserKernelHandle() {
    if (!this._isBrowserRuntime()) return;
    try {
      const root = window;
      if (!Array.isArray(root[PEERCOMPUTE_KERNEL_REGISTRY_KEY])) {
        root[PEERCOMPUTE_KERNEL_REGISTRY_KEY] = [];
      }
      const registry = root[PEERCOMPUTE_KERNEL_REGISTRY_KEY];
      if (!registry.includes(this)) {
        registry.push(this);
      }

      root[PEERCOMPUTE_KERNEL_LAST_KEY] = this;
      if (
        !root[PEERCOMPUTE_KERNEL_INDEX_KEY]
        || typeof root[PEERCOMPUTE_KERNEL_INDEX_KEY] !== 'object'
        || Array.isArray(root[PEERCOMPUTE_KERNEL_INDEX_KEY])
      ) {
        root[PEERCOMPUTE_KERNEL_INDEX_KEY] = {};
      }
      if (this.nodeId) {
        root[PEERCOMPUTE_KERNEL_INDEX_KEY][this.nodeId] = this;
      }
    } catch (_) {
      // Best-effort debug registration only.
    }
  }

  _unregisterBrowserKernelHandle() {
    if (!this._isBrowserRuntime()) return;
    try {
      const root = window;
      const registry = Array.isArray(root[PEERCOMPUTE_KERNEL_REGISTRY_KEY])
        ? root[PEERCOMPUTE_KERNEL_REGISTRY_KEY]
        : null;
      if (registry) {
        const next = registry.filter((entry) => entry !== this);
        root[PEERCOMPUTE_KERNEL_REGISTRY_KEY] = next;
      }

      if (root[PEERCOMPUTE_KERNEL_LAST_KEY] === this) {
        root[PEERCOMPUTE_KERNEL_LAST_KEY] = null;
      }
      if (
        this.nodeId
        && root[PEERCOMPUTE_KERNEL_INDEX_KEY]
        && typeof root[PEERCOMPUTE_KERNEL_INDEX_KEY] === 'object'
      ) {
        delete root[PEERCOMPUTE_KERNEL_INDEX_KEY][this.nodeId];
      }
    } catch (_) {
      // Best-effort debug registration only.
    }
  }

  getNetVizAttachUrl(basePath = this.config.netVizAttachPath || '/netviz/') {
    if (!this._isBrowserRuntime()) return null;
    try {
      const url = new URL(basePath, window.location.origin);
      url.searchParams.set('topologyType', this.config.topology || 'distributed');
      url.searchParams.set('topologyId', this.config.topologyId || 'default-topology');
      url.searchParams.set('room', this.config.roomId || 'default-room');
      url.searchParams.set('autoConnect', '1');
      if (this.netVizDebugSessionId) {
        url.searchParams.set('attachSession', this.netVizDebugSessionId);
      }
      return url.toString();
    } catch (_) {
      return null;
    }
  }

  getNetVizDebugSession() {
    const metadata = this._getNetVizSessionMetadata();
    return {
      sessionId: this.netVizDebugSessionId || `session-${this.nodeId || 'pending'}`,
      nodeId: this.nodeId || null,
      peerId: this.networkManager?.peerId || null,
      gameId: this.config.gameId || null,
      roomId: this.config.roomId || null,
      topologyId: this.config.topologyId || null,
      topologyType: this.config.topology || null,
      isStarted: this.isStarted,
      attachUrl: this.getNetVizAttachUrl(),
      metadata,
      ts: Date.now()
    };
  }

  _getNetVizSessionMetadata() {
    let metadata = this.config.netVizSessionMetadata || null;
    if (typeof this.config.netVizSessionMetadataProvider === 'function') {
      try {
        metadata = this.config.netVizSessionMetadataProvider();
      } catch (err) {
        console.warn('[NodeKernel] NetViz session metadata provider failed:', err?.message || err);
        metadata = null;
      }
    }
    return cloneSessionMetadata(metadata);
  }

  _normalizeNetVizSession(session, fallbackPeerId = null) {
    if (!session || typeof session !== 'object') return null;
    const sessionId = String(session.sessionId || '').trim();
    const roomId = String(session.roomId || '').trim();
    const topologyId = String(session.topologyId || '').trim();
    if (!sessionId || !roomId || !topologyId) return null;
    return {
      sessionId,
      nodeId: String(session.nodeId || '').trim() || null,
      peerId: String(session.peerId || fallbackPeerId || '').trim() || null,
      gameId: String(session.gameId || '').trim() || 'unknown',
      roomId,
      topologyId,
      topologyType: String(session.topologyType || 'distributed').trim() || 'distributed',
      isStarted: session.isStarted !== false,
      attachUrl: String(session.attachUrl || '').trim() || null,
      metadata: cloneSessionMetadata(session.metadata),
      ts: Number.isFinite(session.ts) ? session.ts : Date.now(),
      seenAt: Date.now()
    };
  }

  _pruneNetVizDiscoveredSessions() {
    const staleMs = this.config.netVizSessionStaleMs || 15000;
    const now = Date.now();
    for (const [sessionId, session] of this.netVizDiscoveredSessions.entries()) {
      const ageMs = now - (Number.isFinite(session?.seenAt) ? session.seenAt : 0);
      if (ageMs > staleMs || session?.isStarted === false) {
        this.netVizDiscoveredSessions.delete(sessionId);
      }
    }
  }

  getNetVizDiscoveredSessions() {
    this._pruneNetVizDiscoveredSessions();
    return Array.from(this.netVizDiscoveredSessions.values())
      .sort((a, b) => (b.ts || 0) - (a.ts || 0))
      .map((session) => ({ ...session }));
  }

  _publishNetVizDebugTelemetry() {
    if (!this.config.enableNetVizDebugTelemetry) return;
    if (!this.networkManager?.getTelemetrySnapshot || !this.stateManager?.commitDelta) return;
    const snapshot = this.networkManager.getTelemetrySnapshot();
    if (!snapshot?.peerId) return;
    const taskPrefix = this.config.netVizDebugTelemetryTaskPrefix || NETVIZ_DEBUG_TELEMETRY_PREFIX;
    const taskId = `${taskPrefix}${snapshot.peerId}`;
    try {
      this.stateManager.commitDelta({
        taskId,
        version: snapshot.ts,
        payload: snapshot,
        timestamp: snapshot.ts,
        scope: this.config.deltaNamespace
      });
    } catch (err) {
      console.warn('[NodeKernel] NetViz telemetry publish failed:', err?.message || err);
    }
  }

  _startNetVizDebugTelemetryLoop() {
    this._stopNetVizDebugTelemetryLoop();
    if (!this.config.enableNetVizDebugTelemetry) return;
    this._publishNetVizDebugTelemetry();
    this.netVizDebugTelemetryTimer = setInterval(() => {
      this._publishNetVizDebugTelemetry();
    }, this.config.netVizDebugTelemetryIntervalMs || 2000);
  }

  _stopNetVizDebugTelemetryLoop() {
    if (!this.netVizDebugTelemetryTimer) return;
    clearInterval(this.netVizDebugTelemetryTimer);
    this.netVizDebugTelemetryTimer = null;
  }

  _startNetVizSessionBroadcast() {
    this._stopNetVizSessionBroadcast();
    if (!this.config.enableNetVizSessionBroadcast) return;
    if (!this._isBrowserRuntime()) return;
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      this.netVizDebugChannel = new BroadcastChannel(NETVIZ_DEBUG_CHANNEL);
    } catch (_) {
      this.netVizDebugChannel = null;
      return;
    }
    const publish = () => {
      const session = this.getNetVizDebugSession();
      if (!session || !this.netVizDebugChannel) return;
      this.netVizDebugChannel.postMessage({
        type: 'session-upsert',
        ts: Date.now(),
        session
      });
    };
    publish();
    this.netVizDebugSessionTimer = setInterval(
      publish,
      this.config.netVizDebugSessionIntervalMs || 2000
    );
  }

  _stopNetVizSessionBroadcast() {
    if (this.netVizDebugSessionTimer) {
      clearInterval(this.netVizDebugSessionTimer);
      this.netVizDebugSessionTimer = null;
    }
    if (this.netVizDebugChannel) {
      try {
        this.netVizDebugChannel.postMessage({
          type: 'session-remove',
          ts: Date.now(),
          sessionId: this.netVizDebugSessionId
        });
        this.netVizDebugChannel.close();
      } catch (_) {
        // no-op
      }
      this.netVizDebugChannel = null;
    }
  }

  async _publishNetVizSessionUpsertOverNetwork() {
    if (!this.config.enableNetVizSessionBroadcast) return;
    if (!this.networkManager?.broadcast) return;
    const session = this.getNetVizDebugSession();
    if (!session) return;
    try {
      await this.networkManager.broadcast(
        {
          type: 'netviz-session-upsert',
          session
        },
        { topic: this.config.netVizSessionTopic || NETVIZ_SESSION_TOPIC }
      );
    } catch (err) {
      console.warn('[NodeKernel] NetViz session pubsub upsert failed:', err?.message || err);
    }
  }

  async _publishNetVizSessionRemoveOverNetwork() {
    if (!this.config.enableNetVizSessionBroadcast) return;
    if (!this.networkManager?.broadcast) return;
    try {
      await this.networkManager.broadcast(
        {
          type: 'netviz-session-remove',
          sessionId: this.netVizDebugSessionId
        },
        { topic: this.config.netVizSessionTopic || NETVIZ_SESSION_TOPIC }
      );
    } catch (err) {
      console.warn('[NodeKernel] NetViz session pubsub remove failed:', err?.message || err);
    }
  }

  _startNetVizNetworkSessionLoop() {
    this._stopNetVizNetworkSessionLoop();
    if (!this.config.enableNetVizSessionBroadcast) return;
    this._publishNetVizSessionUpsertOverNetwork().catch(() => {});
    this.netVizNetworkSessionTimer = setInterval(() => {
      this._publishNetVizSessionUpsertOverNetwork().catch(() => {});
    }, this.config.netVizDebugSessionIntervalMs || 2000);
  }

  _stopNetVizNetworkSessionLoop() {
    if (this.netVizNetworkSessionTimer) {
      clearInterval(this.netVizNetworkSessionTimer);
      this.netVizNetworkSessionTimer = null;
    }
    this._publishNetVizSessionRemoveOverNetwork().catch(() => {});
  }

  _logNetVizAttachHint() {
    const attachUrl = this.getNetVizAttachUrl();
    if (!attachUrl) return;
    console.info('[NodeKernel] NetViz attach URL:', attachUrl);
  }

  _normalizeClockPolicy(policy = {}, base = {}) {
    const input = policy && typeof policy === 'object' ? policy : {};
    const basePolicy = base && typeof base === 'object' ? base : {};
    const mode = input.mode || basePolicy.mode || 'independent';
    const rawTick = input.tickHz ?? basePolicy.tickHz ?? 30;
    const tickHz = Number.isFinite(rawTick) && rawTick > 0 ? rawTick : 30;
    const networkProfile =
      input.networkProfile !== undefined ? input.networkProfile : basePolicy.networkProfile || null;
    return {
      mode: mode === 'kernel' ? 'kernel' : 'independent',
      tickHz,
      networkProfile
    };
  }

  /**
   * Submit a compute task to the network
   * @param {Object} task - Task definition
   * @param {string} task.id - Unique task ID
   * @param {string} task.type - Task type: 'cpu' | 'webgpu' | 'wasm'
   * @param {*} task.data - Task input data
   * @returns {Promise<any>} Task result
   */
  async submitTask(task) {
    if (!this.isStarted) {
      throw new Error('Node not started');
    }
    if (!this.computeManager) {
      throw new Error('ComputeManager not initialized');
    }
    return this.computeManager.submitTask(task);
  }

  _createRemoteComputeRequestId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `remote-compute-${crypto.randomUUID()}`;
    }
    return `remote-compute-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  _normalizeRemoteComputePayload(payload = {}, { allowFunctions = false } = {}) {
    const task = payload && typeof payload === 'object' ? payload : {};
    if (task.fn && !allowFunctions) {
      const err = new Error('Remote compute function payloads are disabled; use module or WASM tasks');
      err.code = 'ERR_REMOTE_COMPUTE_UNSAFE_TASK';
      throw err;
    }
    const runtime = typeof task.runtime === 'string'
      ? task.runtime.trim().toLowerCase()
      : task.wasm
        ? (task.hostModule || task.module ? 'wasm-webgpu' : 'wasm')
        : 'js';
    if (runtime === 'js' && !task.module && !task.fn) {
      const err = new Error('Remote JavaScript compute tasks must provide a module export');
      err.code = 'ERR_REMOTE_COMPUTE_MODULE_REQUIRED';
      throw err;
    }
    return {
      id: task.id,
      runtime,
      taskFamily: task.taskFamily || 'remote-compute',
      solverId: task.solverId,
      data: task.data ?? null,
      module: task.module,
      hostModule: task.hostModule,
      exportName: task.exportName || 'default',
      hostExport: task.hostExport,
      wasm: task.wasm,
      wasmSource: task.wasmSource,
      source: task.source,
      args: task.args,
      webgpu: task.webgpu,
      affinityKey: task.affinityKey || task.workerKey || task.data?.affinityKey || task.data?.stateKey,
      suppressCommitDelta: true,
      returnEnvelope: true,
      ...(allowFunctions && task.fn ? { fn: task.fn } : {})
    };
  }

  _buildNetworkPlacementResultEnvelope(targetPeerId, payload, response, { executorId, role = 'primary' } = {}) {
    const resultEnvelope = response?.result && typeof response.result === 'object'
      ? { ...response.result }
      : { value: response?.result };
    const taskPacket = response?.taskPacket || payload?.taskPacket || null;
    const taskEnvelope = response?.taskEnvelope || payload?.taskEnvelope || null;
    const resultValueForHash = hasOwn(resultEnvelope, 'value')
      ? resultEnvelope.value
      : resultEnvelope?.result;
    const commitDelta = hasOwn(resultEnvelope, 'commitDelta') ? resultEnvelope.commitDelta : null;
    const resultValue = resultValueForHash && typeof resultValueForHash === 'object'
      ? resultValueForHash
      : null;
    const computeExecution = resultEnvelope?.computeExecution && typeof resultEnvelope.computeExecution === 'object'
      ? resultEnvelope.computeExecution
      : null;
    const transportPeerId = response?.peerId || null;
    const responderNodeId = response?.responderId || null;
    const responderPeerId = response?.responderPeerId || transportPeerId || targetPeerId;
    const outputHash = firstDefined(
      resultEnvelope?.outputHash,
      resultEnvelope?.resultHash,
      hashRemoteResultValue(resultValueForHash)
    );
    const commitDeltaHash = firstDefined(
      resultEnvelope?.commitDeltaHash,
      resultEnvelope?.deltaHash,
      hashRemoteResultValue(commitDelta)
    );
    const placementProvenance = {
      schema: REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA,
      transport: 'nodekernel-remote-compute',
      executorId,
      peerId: responderNodeId || targetPeerId,
      remotePeerId: responderNodeId || targetPeerId,
      workerId: resultEnvelope?.workerId || computeExecution?.workerId || null,
      remoteExecution: computeExecution ? { ...computeExecution } : null,
      transportPeerId,
      responderNodeId,
      responderPeerId,
      targetPeerId,
      requesterId: this.nodeId,
      requestId: response?.requestId || null,
      requestSchema: REMOTE_COMPUTE_REQUEST_SCHEMA,
      responseSchema: response?.schema || REMOTE_COMPUTE_RESULT_SCHEMA,
      taskPacketSchema: taskPacket?.schema || null,
      taskEnvelopeSchema: taskEnvelope?.schema || null,
      taskSigned: taskEnvelope?.signed === true,
      signerId: taskEnvelope?.signerId || null,
      signatureAlgorithm: taskEnvelope?.signatureAlgorithm || null,
      codeHash: taskPacket?.codeHash || null,
      inputHash: taskPacket?.inputHash || null,
      taskHash: taskPacket?.taskHash || null,
      outputHash,
      resultHash: outputHash,
      commitDeltaHash,
      resultSchema: resultEnvelope?.schema || resultValue?.schema || null,
      role,
      remoteCompletedAt: response?.completedAt || null,
      receivedAt: response?.receivedAt || Date.now(),
      roundTripMs: Number.isFinite(response?.roundTripMs) ? response.roundTripMs : null,
      trustLevel: 'nodekernel-network-peer',
      validated: false
    };
    if (!resultEnvelope.provenance && !resultEnvelope.remoteProvenance && !resultEnvelope.placementProvenance) {
      resultEnvelope.placementProvenance = placementProvenance;
    } else {
      resultEnvelope.nodeKernelRemoteResponse = placementProvenance;
    }
    return resultEnvelope;
  }

  _networkPlacementProvenance(resultEnvelope = {}) {
    if (!resultEnvelope || typeof resultEnvelope !== 'object') return null;
    return resultEnvelope.provenance
      || resultEnvelope.remoteProvenance
      || resultEnvelope.placementProvenance
      || resultEnvelope.nodeKernelRemoteResponse
      || null;
  }

  _createRemoteReplicaSummary(resultEnvelope, {
    targetPeerId,
    index = 0,
    role = 'replica',
    error = null
  } = {}) {
    const provenance = this._networkPlacementProvenance(resultEnvelope) || {};
    const valueForHash = hasOwn(resultEnvelope, 'value')
      ? resultEnvelope.value
      : resultEnvelope?.result;
    const commitDelta = hasOwn(resultEnvelope, 'commitDelta') ? resultEnvelope.commitDelta : null;
    const ok = !error;
    const outputHash = ok
      ? firstDefined(provenance.outputHash, provenance.resultHash, hashRemoteResultValue(valueForHash))
      : null;
    const commitDeltaHash = ok
      ? firstDefined(provenance.commitDeltaHash, provenance.deltaHash, hashRemoteResultValue(commitDelta))
      : null;
    return {
      schema: NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
      role,
      index,
      ok,
      peerId: provenance.peerId || targetPeerId || null,
      remotePeerId: provenance.remotePeerId || provenance.peerId || targetPeerId || null,
      targetPeerId: provenance.targetPeerId || targetPeerId || null,
      transportPeerId: provenance.transportPeerId || null,
      responderNodeId: provenance.responderNodeId || null,
      responderPeerId: provenance.responderPeerId || null,
      workerId: provenance.workerId || null,
      remoteExecution: provenance.remoteExecution && typeof provenance.remoteExecution === 'object'
        ? cloneSessionMetadata(provenance.remoteExecution)
        : null,
      executorId: provenance.executorId || null,
      requestId: provenance.requestId || null,
      responseSchema: provenance.responseSchema || null,
      taskPacketSchema: provenance.taskPacketSchema || null,
      taskEnvelopeSchema: provenance.taskEnvelopeSchema || null,
      codeHash: provenance.codeHash || null,
      inputHash: provenance.inputHash || null,
      taskHash: provenance.taskHash || null,
      outputHash,
      resultHash: outputHash,
      commitDeltaHash,
      resultSchema: provenance.resultSchema || resultEnvelope?.schema || null,
      durationMs: Number.isFinite(Number(provenance.durationMs))
        ? Number(Number(provenance.durationMs).toFixed(3))
        : Number.isFinite(Number(provenance.roundTripMs))
          ? Number(Number(provenance.roundTripMs).toFixed(3))
          : null,
      errorCode: error?.code || null,
      errorMessage: error ? (error.message || String(error)) : null,
      completedAt: Date.now()
    };
  }

  _attachRedundantPlacementReport(primaryResult, {
    primaryPeerId,
    replicaPeerIds = [],
    replicaSummaries = [],
    allReplicaSummaries = null,
    primarySummary = null,
    promotedReplicaSummary = null,
    executorId,
    commitSourceRole = 'primary'
  } = {}) {
    const provenance = this._networkPlacementProvenance(primaryResult);
    if (!provenance) return primaryResult;
    const quorumReplicaSummaries = Array.isArray(replicaSummaries) ? replicaSummaries : [];
    const fullReplicaSummaries = Array.isArray(allReplicaSummaries) ? allReplicaSummaries : quorumReplicaSummaries;
    const replicaSuccessCount = fullReplicaSummaries.filter((entry) => entry?.ok !== false).length;
    const replicaFailureCount = fullReplicaSummaries.length - replicaSuccessCount;
    const quorumReplicaSuccessCount = quorumReplicaSummaries.filter((entry) => entry?.ok !== false).length;
    const primaryOk = primarySummary?.ok !== false && commitSourceRole === 'primary';
    const promotedReplica = promotedReplicaSummary && typeof promotedReplicaSummary === 'object'
      ? promotedReplicaSummary
      : null;
    provenance.redundantPlacement = {
      schema: NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
      executorId,
      primaryPeerId,
      replicaPeerIds: [...replicaPeerIds],
      replicaCount: fullReplicaSummaries.length,
      quorumReplicaCount: quorumReplicaSummaries.length,
      replicaSuccessCount,
      replicaFailureCount,
      quorumReplicaSuccessCount,
      primaryOk,
      primaryOnly: fullReplicaSummaries.length === 0,
      commitSourceRole,
      commitSourcePeerId: provenance.targetPeerId || provenance.remotePeerId || provenance.peerId || null,
      promotedReplica: !!promotedReplica,
      promotedReplicaPeerId: promotedReplica?.targetPeerId || promotedReplica?.remotePeerId || promotedReplica?.peerId || null,
      primary: primarySummary && typeof primarySummary === 'object'
        ? cloneSessionMetadata(primarySummary)
        : null,
      primaryFailure: primarySummary?.ok === false
        ? {
          code: primarySummary.errorCode || null,
          message: primarySummary.errorMessage || null,
          peerId: primarySummary.peerId || primaryPeerId || null,
          targetPeerId: primarySummary.targetPeerId || primaryPeerId || null,
          requestId: primarySummary.requestId || null
        }
        : null,
      promotedReplicaSummary: promotedReplica
        ? cloneSessionMetadata(promotedReplica)
        : null,
      replicaSummaries: fullReplicaSummaries.map((entry) => cloneSessionMetadata(entry) || entry),
      quorumReplicaSummaries: quorumReplicaSummaries.map((entry) => cloneSessionMetadata(entry) || entry),
      completedAt: Date.now()
    };
    provenance.redundantReplicaCount = fullReplicaSummaries.length;
    provenance.replicaCount = quorumReplicaSummaries.length;
    provenance.quorumReplicaCount = quorumReplicaSummaries.length;
    provenance.replicaSuccessCount = replicaSuccessCount;
    provenance.replicaFailureCount = replicaFailureCount;
    provenance.quorumReplicaSuccessCount = quorumReplicaSuccessCount;
    provenance.replicas = quorumReplicaSummaries;
    provenance.replicaResults = quorumReplicaSummaries;
    if (primarySummary && typeof primarySummary === 'object') {
      provenance.primary = primarySummary;
      if (primarySummary.ok === false) provenance.primaryFailure = provenance.redundantPlacement.primaryFailure;
    }
    if (promotedReplica) {
      provenance.promotedReplica = promotedReplica;
    }
    return primaryResult;
  }

  createNetworkPlacementExecutor(peerId, options = {}) {
    const targetPeerId = String(peerId || options.peerId || '').trim();
    if (!targetPeerId) {
      throw new Error('createNetworkPlacementExecutor requires a peerId');
    }
    if (
      (Array.isArray(options.replicaPeerIds) && options.replicaPeerIds.length > 0)
      || (Array.isArray(options.redundantPeerIds) && options.redundantPeerIds.length > 0)
    ) {
      return this.createRedundantNetworkPlacementExecutor([targetPeerId], options);
    }
    const executorId = options.executorId || `network-placement:${targetPeerId}`;
    const executor = async (payload, context = {}) => {
      const response = await this.submitRemoteComputeTask(targetPeerId, payload, {
        ...options,
        context,
        returnResponseEnvelope: true
      });
      return this._buildNetworkPlacementResultEnvelope(targetPeerId, payload, response, {
        executorId,
        role: 'primary'
      });
    };
    executor.placementExecutorId = executorId;
    return executor;
  }

  createRedundantNetworkPlacementExecutor(peerIds = [], options = {}) {
    const listedPeerIds = normalizePeerIdList(peerIds);
    const primaryPeerId = String(options.primaryPeerId || options.peerId || listedPeerIds[0] || '').trim();
    if (!primaryPeerId) {
      throw new Error('createRedundantNetworkPlacementExecutor requires a primary peerId');
    }
    const optionReplicaIds = normalizePeerIdList(
      options.replicaPeerIds ?? options.redundantPeerIds ?? options.replicaPeers
    );
    const replicaSource = optionReplicaIds.length > 0
      ? optionReplicaIds
      : listedPeerIds.filter((peerId) => peerId !== primaryPeerId);
    const maxReplicaCount = normalizeInteger(
      options.maxReplicaCount ?? options.targetReplicaCount ?? replicaSource.length,
      replicaSource.length,
      0,
      1000000
    );
    const replicaPeerIds = [];
    const seen = new Set([primaryPeerId]);
    for (const peerId of replicaSource) {
      if (!peerId || seen.has(peerId)) continue;
      seen.add(peerId);
      replicaPeerIds.push(peerId);
      if (replicaPeerIds.length >= maxReplicaCount) break;
    }
    const executorId = options.executorId
      || `redundant-network-placement:${primaryPeerId}:${replicaPeerIds.join(',') || 'primary-only'}`;
    const promoteReplicaOnPrimaryFailure = options.promoteReplicaOnPrimaryFailure !== false;
    const executor = async (payload, context = {}) => {
      const runPeer = async (targetPeerId, { role, index }) => {
        const requestId = role === 'primary'
          ? options.requestId
          : replicaRequestId(options.requestId, index, targetPeerId);
        const roleTimeoutMs = role === 'primary'
          ? firstDefined(options.primaryTimeoutMs, options.remotePrimaryTimeoutMs, options.timeoutMs)
          : firstDefined(options.replicaTimeoutMs, options.remoteReplicaTimeoutMs, options.timeoutMs);
        const response = await this.submitRemoteComputeTask(targetPeerId, payload, {
          ...options,
          timeoutMs: roleTimeoutMs,
          requestId,
          context: {
            ...context,
            redundantPlacement: {
              schema: NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
              executorId,
              role,
              primaryPeerId,
              replicaPeerIds: [...replicaPeerIds],
              replicaIndex: role === 'replica' ? index : null
            }
          },
          returnResponseEnvelope: true
        });
        return this._buildNetworkPlacementResultEnvelope(targetPeerId, payload, response, {
          executorId: role === 'primary'
            ? executorId
            : `${executorId}:replica:${index}:${targetPeerId}`,
          role
        });
      };

      const primaryPromise = runPeer(primaryPeerId, { role: 'primary', index: -1 })
        .then((value) => ({ ok: true, value }))
        .catch((error) => ({ ok: false, error }));
      const replicaPromises = replicaPeerIds.map((targetPeerId, index) => (
        runPeer(targetPeerId, { role: 'replica', index })
          .then((value) => ({
            ok: true,
            value,
            targetPeerId,
            index,
            summary: this._createRemoteReplicaSummary(value, {
              targetPeerId,
              index,
              role: 'replica'
            })
          }))
          .catch((error) => ({
            ok: false,
            error,
            targetPeerId,
            index,
            summary: this._createRemoteReplicaSummary(null, {
              targetPeerId,
              index,
              role: 'replica',
              error
            })
          }))
      ));
      const [primary, replicaRuns] = await Promise.all([
        primaryPromise,
        Promise.all(replicaPromises)
      ]);
      const replicaSummaries = replicaRuns.map((entry) => entry.summary);
      if (!primary.ok) {
        const primarySummary = this._createRemoteReplicaSummary(null, {
          targetPeerId: primaryPeerId,
          index: -1,
          role: 'primary',
          error: primary.error
        });
        const promotedRun = promoteReplicaOnPrimaryFailure
          ? replicaRuns.find((entry) => entry.ok && entry.value)
          : null;
        if (!promotedRun) {
          primary.error.replicas = replicaSummaries;
          primary.error.replicaPeerIds = [...replicaPeerIds];
          primary.error.primary = primarySummary;
          throw primary.error;
        }
        const provenance = this._networkPlacementProvenance(promotedRun.value);
        if (provenance) {
          provenance.originalRole = provenance.role || 'replica';
          provenance.role = 'promoted-replica';
          provenance.promotedReplicaExecutorId = provenance.executorId || null;
          provenance.executorId = executorId;
          provenance.primaryPeerId = primaryPeerId;
          provenance.promotedFromReplica = true;
        }
        const promotedReplicaSummary = {
          ...promotedRun.summary,
          role: 'promoted-replica',
          promoted: true,
          usedAsCommitSource: true
        };
        const allReplicaSummaries = replicaRuns.map((entry) => (
          entry === promotedRun ? promotedReplicaSummary : entry.summary
        ));
        const quorumReplicaSummaries = replicaRuns
          .filter((entry) => entry !== promotedRun)
          .map((entry) => entry.summary);
        return this._attachRedundantPlacementReport(promotedRun.value, {
          primaryPeerId,
          replicaPeerIds,
          replicaSummaries: quorumReplicaSummaries,
          allReplicaSummaries,
          primarySummary,
          promotedReplicaSummary,
          executorId,
          commitSourceRole: 'promoted-replica'
        });
      }
      const primarySummary = this._createRemoteReplicaSummary(primary.value, {
        targetPeerId: primaryPeerId,
        index: -1,
        role: 'primary'
      });
      return this._attachRedundantPlacementReport(primary.value, {
        primaryPeerId,
        replicaPeerIds,
        replicaSummaries,
        allReplicaSummaries: replicaSummaries,
        primarySummary,
        executorId,
        commitSourceRole: 'primary'
      });
    };
    executor.placementExecutorId = executorId;
    executor.primaryPeerId = primaryPeerId;
    executor.replicaPeerIds = [...replicaPeerIds];
    executor.redundantPlacementSchema = NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA;
    return executor;
  }

  async submitRemoteComputeTask(peerId, payload = {}, options = {}) {
    if (!this.isStarted) {
      throw new Error('Node not started');
    }
    if (!this.networkManager?.sendToPeer) {
      throw new Error('NetworkManager not initialized');
    }
    const targetPeerId = String(peerId || '').trim();
    if (!targetPeerId) {
      throw new Error('submitRemoteComputeTask requires peerId');
    }
    const requestId = options.requestId || this._createRemoteComputeRequestId();
    const timeoutMs = normalizeInteger(options.timeoutMs ?? this.config.remoteComputeTimeoutMs, this.config.remoteComputeTimeoutMs, 1, 3600000);
    const task = this._normalizeRemoteComputePayload(payload, {
      allowFunctions: options.allowRemoteFunctionTasks === true
    });
    const request = {
      schema: REMOTE_COMPUTE_REQUEST_SCHEMA,
      requestId,
      requesterId: this.nodeId,
      targetPeerId,
      task,
      taskPacket: payload.taskPacket || null,
      taskEnvelope: payload.taskEnvelope || null,
      placement: payload.placement || null,
      sentAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRemoteComputeRequests.delete(requestId);
        const err = new Error(`Remote compute request timed out after ${timeoutMs}ms`);
        err.code = 'ERR_REMOTE_COMPUTE_TIMEOUT';
        err.requestId = requestId;
        reject(err);
      }, timeoutMs);
      this.pendingRemoteComputeRequests.set(requestId, {
        peerId: targetPeerId,
        resolve,
        reject,
        timeoutId,
        requestId,
        sentAt: request.sentAt,
        returnResponseEnvelope: options.returnResponseEnvelope === true
      });
      this.networkManager.sendToPeer(targetPeerId, {
        type: 'compute-task',
        data: request
      }).catch((err) => {
        clearTimeout(timeoutId);
        this.pendingRemoteComputeRequests.delete(requestId);
        reject(err);
      });
    });
  }

  /**
   * Get current node status
   * @returns {Object} Status information
   */
  getStatus() {
    const networkStats = this.networkManager?.getNetworkStats() || {};
    const connectedPeers = this.networkManager?.getConnectedPeers?.() || [];
    const connectedPeerIds = connectedPeers
      .map((peer) => peer.peerId)
      .filter(Boolean);
    const peerCapabilities = {};
    for (const peer of connectedPeers) {
      if (!peer?.peerId) continue;
      const capabilities = cloneSessionMetadata(peer.capabilities);
      if (capabilities) {
        peerCapabilities[peer.peerId] = capabilities;
      }
    }
    const stateStats = this.stateManager?.getStats() || {};
    const computeStats = this.computeManager?.getStats?.() || null;
    const localCapabilities = this._buildPresenceCapabilities();
    
    return {
      nodeId: this.nodeId,
      isInitialized: this.isInitialized,
      isStarted: this.isStarted,
      topology: this.config.topology,
      topologyId: this.config.topologyId,
      clock: {
        mode: this.config.clockPolicy.mode,
        tickHz: this.config.clockPolicy.tickHz,
        schedulerClock: this.networkManager?.getSchedulerClock?.()
      },
      
      // Network status
      network: {
        peerId: networkStats.peerId,
        peerCount: networkStats.peerCount,
        logicalPeerCount: networkStats.logicalPeerCount,
        activeDialedPeerCount: networkStats.activeDialedPeerCount,
        bootstrapPeerCount: networkStats.bootstrapPeerCount,
        reservedDialPeerCount: networkStats.reservedDialPeerCount,
        isConnected: networkStats.isConnected,
        connections: networkStats.connections,
        targetConnections: networkStats.targetConnections,
        maxConnections: networkStats.maxConnections,
        connectionManager: networkStats.connectionManager || null
      },
      connectedPeerIds,
      peerCapabilities,
      localCapabilities,
      remoteCompute: {
        responderEnabled: this.config.enableRemoteComputeResponder === true,
        allowFunctionTasks: this.config.allowRemoteFunctionTasks === true,
        pendingRequestCount: this.pendingRemoteComputeRequests?.size || 0
      },
      
      // State status
      state: {
        keyCount: stateStats.keyCount,
        hasPersistence: stateStats.hasPersistence,
        hasP2PSync: stateStats.hasP2PSync
      },
      
      // Compute status
      compute: {
        enabled: true,
        available: !!this.computeManager,
        stats: computeStats
      }
    };
  }

  _buildPresenceCapabilities() {
    const capabilities = this.computeManager?.getCapabilities?.() || {};
    const stats = capabilities?.stats || this.computeManager?.getStats?.() || {};
    const resourceProfile = capabilities?.resourceProfile || this.computeManager?.getResourceProfile?.() || {};
    const workerPolicy = capabilities?.workerPolicy || this.computeManager?.getWorkerPolicy?.() || {};
    const workerCount = normalizeInteger(
      stats.workerCount ?? capabilities.workers ?? capabilities.workerCount,
      0,
      0,
      1000000
    );
    const targetWorkers = normalizeInteger(
      stats.targetWorkers ?? capabilities.targetWorkers ?? workerPolicy.targetWorkers,
      workerCount,
      0,
      1000000
    );
    const maxWorkers = normalizeInteger(
      workerPolicy.maxWorkers ?? capabilities.maxWorkers,
      Math.max(workerCount, targetWorkers),
      0,
      1000000
    );
    const gpuAvailable = resourceProfile.gpuAvailable === true
      || capabilities.webgpu === true
      || this.config.enableWebGPU === true;
    const gpuCount = gpuAvailable
      ? normalizeInteger(
        resourceProfile.gpuCount ?? resourceProfile.gpuAdapterCount ?? capabilities.gpuCount,
        1,
        1,
        1000000
      )
      : 0;

    return {
      schema: NODE_KERNEL_PEER_CAPABILITIES_SCHEMA,
      sampledAtMs: Date.now(),
      nodeId: this.nodeId,
      compute: {
        schema: NODE_KERNEL_COMPUTE_CAPACITY_SCHEMA,
        workerCount,
        targetWorkers,
        minWorkers: normalizeInteger(workerPolicy.minWorkers ?? capabilities.minWorkers, 0, 0, 1000000),
        maxWorkers,
        activeTaskCount: normalizeInteger(
          stats.activeTaskCount ?? capabilities.activeTaskCount,
          0,
          0,
          1000000
        ),
        queuedTaskCount: normalizeInteger(
          stats.queuedTaskCount ?? capabilities.queuedTaskCount,
          0,
          0,
          1000000
        ),
        currentLoad: normalizeFiniteNumber(stats.currentLoad, 0, 0, 1000000),
        gpuAvailable,
        gpuCount,
        webgpuAvailable: capabilities.webgpu === true || this.config.enableWebGPU === true,
        wasmAvailable: capabilities.wasm === true,
        resourceTier: typeof resourceProfile.tier === 'string' ? resourceProfile.tier : null,
        memoryBudgetMB: normalizeFiniteNumber(resourceProfile.memoryBudgetMB, null, 0, 1048576),
        gpuMemoryBudgetMB: normalizeFiniteNumber(resourceProfile.gpuMemoryBudgetMB, null, 0, 1048576),
        workerPoolRevision: normalizeInteger(
          stats.workerPoolRevision ?? capabilities.workerPoolRevision,
          0,
          0,
          1000000
        )
      }
    };
  }

  /**
   * Get the state manager instance
   * @returns {StateManager} State manager
   */
  getStateManager() {
    return this.stateManager;
  }

  /**
   * Get the network manager instance
   * @returns {NetworkManager} Network manager
   */
  getNetworkManager() {
    return this.networkManager;
  }

  /**
   * Get the compute manager instance
   * @returns {ComputeManager|null} Compute manager (or null if not implemented)
   */
  getComputeManager() {
    return this.computeManager;
  }

  /**
   * Get the GPU hub manager (main thread)
   * @returns {GPUHubManager|null}
   */
  getGPUHub() {
    return this.gpuHub;
  }

  /**
   * Handle incoming network message
   * @private
   * @param {string} peerId - Source peer ID
   * @param {Object} message - Message data
   */
  _handleNetworkMessage(peerId, message) {
    if (this.debugOutputEnabled) {
      console.log(`[NodeKernel] Message from ${peerId}:`, message.type);
    }
    
    // Route messages based on type
    switch (message.type) {
      case 'state-request':
        this._handleStateRequest(peerId, message.data);
        break;
        
      case 'yjs-update':
        if (this.stateManager) {
          this.stateManager.applyRemoteUpdate(message.data);
        }
        break;

      case 'state-set':
        if (this.stateManager) {
          this.stateManager.applyStateSet(
            message.data?.key,
            message.data?.value,
            message.data?.namespace
          );
        }
        break;

      case 'compute-task':
        this._handleComputeTask(peerId, message.data);
        break;

      case 'compute-result':
        this._handleComputeResult(peerId, message.data);
        break;
        
      case 'ping':
        this._handlePing(peerId, message.data);
        break;

      case 'netviz-session-upsert': {
        if (!this.config.enableNetVizSessionDiscovery) break;
        const session = this._normalizeNetVizSession(message.session, peerId);
        if (session) {
          this.netVizDiscoveredSessions.set(session.sessionId, session);
        }
        break;
      }

      case 'netviz-session-remove': {
        if (!this.config.enableNetVizSessionDiscovery) break;
        const sessionId = String(message.sessionId || '').trim();
        if (sessionId) {
          this.netVizDiscoveredSessions.delete(sessionId);
        }
        break;
      }
        
      default:
        console.warn(`[NodeKernel] Unknown message type: ${message.type}`);
    }
  }

  /**
   * Handle peer connection event
   * @private
   * @param {string} peerId - Connected peer ID
   */
  _handlePeerConnect(peerId) {
    if (this.debugOutputEnabled) {
      console.log(`[NodeKernel] Peer connected: ${peerId}`);
    }
    
    // Update state with connected peer
    const peers = this.stateManager.read('connectedPeers') || [];
    if (!peers.includes(peerId)) {
      peers.push(peerId);
      this.stateManager.write('connectedPeers', peers);
    }
  }

  /**
   * Handle peer disconnection event
   * @private
   * @param {string} peerId - Disconnected peer ID
   */
  _handlePeerDisconnect(peerId) {
    if (this.debugOutputEnabled) {
      console.log(`[NodeKernel] Peer disconnected: ${peerId}`);
    }
    
    // Update state
    const peers = this.stateManager.read('connectedPeers') || [];
    const filtered = peers.filter(p => p !== peerId);
    this.stateManager.write('connectedPeers', filtered);
  }

  /**
   * Handle state request message
   * @private
   * @param {string} peerId - Requesting peer ID
   * @param {Object} data - Request data
   */
  async _handleStateRequest(peerId, data) {
    // Send state snapshot to requesting peer
    const snapshot = this.stateManager.snapshot();
    
    await this.networkManager.sendToPeer(peerId, {
      type: 'state-response',
      data: snapshot
    });
  }

  /**
   * Handle compute task message
   * @private
   * @param {string} peerId - Requesting peer ID
   * @param {Object} task - Task data
   */
  async _handleComputeTask(peerId, data) {
    if (this.debugOutputEnabled) {
      console.log(`[NodeKernel] Remote compute task from ${peerId}`);
    }
    const request = data && typeof data === 'object' ? data : {};
    const requestId = request.requestId || `remote-compute-${Date.now()}`;
    const baseResponse = {
      schema: REMOTE_COMPUTE_RESULT_SCHEMA,
      requestId,
      responderId: this.nodeId,
      responderPeerId: this.networkManager?.peerId || null,
      targetPeerId: peerId,
      completedAt: Date.now()
    };
    const sendResult = async (response) => {
      if (!this.networkManager?.sendToPeer) return;
      await this.networkManager.sendToPeer(peerId, {
        type: 'compute-result',
        data: {
          ...baseResponse,
          ...response,
          completedAt: Date.now()
        }
      });
    };

    try {
      if (!this.config.enableRemoteComputeResponder) {
        const err = new Error('Remote compute responder is disabled');
        err.code = 'ERR_REMOTE_COMPUTE_DISABLED';
        throw err;
      }
      if (!this.computeManager) {
        const err = new Error('ComputeManager not initialized');
        err.code = 'ERR_REMOTE_COMPUTE_UNAVAILABLE';
        throw err;
      }
      if (request.schema && request.schema !== REMOTE_COMPUTE_REQUEST_SCHEMA) {
        const err = new Error(`Unsupported remote compute request schema: ${request.schema}`);
        err.code = 'ERR_REMOTE_COMPUTE_SCHEMA';
        throw err;
      }
      const payload = request.task || request.payload || request;
      const task = this._normalizeRemoteComputePayload(payload, {
        allowFunctions: this.config.allowRemoteFunctionTasks === true
      });
      task.id = task.id || requestId;
      const result = await this.computeManager.submitTask(task);
      await sendResult({
        ok: true,
        result,
        taskPacket: request.taskPacket || null,
        taskEnvelope: request.taskEnvelope || null
      });
    } catch (err) {
      await sendResult({
        ok: false,
        error: {
          code: err?.code || 'ERR_REMOTE_COMPUTE_FAILED',
          message: err?.message || String(err)
        }
      });
    }
  }

  _handleComputeResult(peerId, data = {}) {
    const response = data && typeof data === 'object' ? data : {};
    const requestId = String(response.requestId || '');
    if (!requestId) return;
    const pending = this.pendingRemoteComputeRequests.get(requestId);
    if (!pending) return;
    this.pendingRemoteComputeRequests.delete(requestId);
    clearTimeout(pending.timeoutId);
    if (pending.peerId && peerId && pending.peerId !== peerId) {
      const err = new Error(`Remote compute result came from unexpected peer ${peerId}`);
      err.code = 'ERR_REMOTE_COMPUTE_PEER_MISMATCH';
      err.requestId = requestId;
      pending.reject(err);
      return;
    }
    if (response.ok === false) {
      const err = new Error(response.error?.message || 'Remote compute task failed');
      err.code = response.error?.code || 'ERR_REMOTE_COMPUTE_FAILED';
      err.requestId = requestId;
      pending.reject(err);
      return;
    }
    if (pending.returnResponseEnvelope) {
      const receivedAt = Date.now();
      pending.resolve({
        ...response,
        peerId,
        receivedAt,
        roundTripMs: Number.isFinite(pending.sentAt) ? Math.max(0, receivedAt - pending.sentAt) : null
      });
      return;
    }
    pending.resolve(response.result);
  }

  /**
   * Handle ping message
   * @private
   * @param {string} peerId - Pinging peer ID
   * @param {Object} data - Ping data
   */
  async _handlePing(peerId, data) {
    // Respond with pong
    await this.networkManager.sendToPeer(peerId, {
      type: 'pong',
      data: {
        timestamp: Date.now(),
        originalTimestamp: data.timestamp
      }
    });
  }
}
