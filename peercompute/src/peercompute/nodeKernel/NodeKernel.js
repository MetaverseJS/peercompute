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
export const REMOTE_TASK_GRAPH_REQUEST_SCHEMA = 'peercompute.nodekernel.remote-task-graph-request.v0';
export const REMOTE_TASK_GRAPH_RESULT_SCHEMA = 'peercompute.nodekernel.remote-task-graph-result.v0';
export const REMOTE_TASK_GRAPH_PLACEMENT_PROVENANCE_SCHEMA = 'peercompute.nodekernel.remote-task-graph-placement-provenance.v0';
export const NODE_KERNEL_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_PREFLIGHT_SCHEMA = 'peercompute.nodekernel.remote-task-graph-cache-artifact-preflight.v0';
export const NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA = 'peercompute.nodekernel.remote-task-graph-state-seed-authority.v0';
export const NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA = 'peercompute.nodekernel.remote-task-graph-compact-candidate-authority.v0';
export const NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA = 'peercompute.nodekernel.remote-task-graph-hot-buffer-refresh.v0';
export const NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA = 'peercompute.nodekernel.redundant-network-placement.v0';
export const NODE_KERNEL_PEER_CAPABILITIES_SCHEMA = 'peercompute.nodekernel.peer-capabilities.v0';
export const NODE_KERNEL_COMPUTE_CAPACITY_SCHEMA = 'peercompute.nodekernel.compute-capacity.v0';
export const NODE_KERNEL_TASK_GRAPH_AUTHORITY_SCHEMA = 'peercompute.nodekernel.task-graph-authority.v0';
export const NODE_KERNEL_TASK_GRAPH_PLACEMENT_PREFLIGHT_SCHEMA = 'peercompute.nodekernel.task-graph-placement-preflight.v0';

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

function cloneSerializableValue(value) {
  if (value == null) return value;
  try {
    return JSON.parse(JSON.stringify(value));
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

function normalizeStringList(value) {
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
    const text = String(entry || '').trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
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

function normalizeTaskGraphRequestedPlacement(graph = {}) {
  const source = graph.placementPolicy || graph.placement || graph.placementHint || {};
  return String(firstDefined(
    source.requestedPlacement,
    source.placement,
    source.mode,
    graph.requestedPlacement,
    graph.placementMode,
    'local'
  ) || 'local').trim().toLowerCase();
}

function normalizeTaskGraphTargetPeerIds(graph = {}) {
  const source = graph.placementPolicy || graph.placement || graph.placementHint || {};
  const out = [];
  const seen = new Set();
  const add = (value) => {
    for (const peerId of normalizePeerIdList(value)) {
      if (seen.has(peerId)) continue;
      seen.add(peerId);
      out.push(peerId);
    }
  };
  add(source.targetPeerIds);
  add(source.peers);
  add(source.peerIds);
  add(source.targetPeerId);
  add(source.peerId);
  add(source.remotePeerId);
  add(graph.targetPeerIds);
  add(graph.peers);
  add(graph.peerIds);
  add(graph.targetPeerId);
  add(graph.peerId);
  add(graph.remotePeerId);
  return out;
}

function taskGraphPlacementIsLocal(requestedPlacement) {
  const placement = String(requestedPlacement || '').trim().toLowerCase();
  return !placement || placement === 'local' || placement.startsWith('local-');
}

function normalizeTaskGraphAdvisoryPlacement(graph = {}) {
  const source = graph.placementPolicy || graph.placement || graph.placementHint || {};
  return source.advisory !== false && graph.advisory !== false;
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
    const stateProviderSyncRetryDelaysMs = Array.isArray(config.stateProviderSyncRetryDelaysMs)
      ? config.stateProviderSyncRetryDelaysMs
        .map((value) => normalizeInteger(value, 0, 0, 60000))
        .filter((value) => value > 0)
      : [500, 1500, 4000];
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
      stateProviderSyncRetryDelaysMs,
      netVizDebugTelemetryTaskPrefix,
      enableNetVizSessionBroadcast,
      enableNetVizSessionDiscovery,
      debugOutput,
      netVizSessionTopic,
      netVizSessionStaleMs,
      netVizDebugSessionIntervalMs,
      enableRemoteComputeResponder: config.enableRemoteComputeResponder === true,
      enableRemoteTaskGraphResponder: typeof config.enableRemoteTaskGraphResponder === 'boolean'
        ? config.enableRemoteTaskGraphResponder
        : config.enableRemoteComputeResponder === true,
      allowRemoteFunctionTasks: config.allowRemoteFunctionTasks === true,
      remoteComputeTimeoutMs: normalizeInteger(config.remoteComputeTimeoutMs, 30000, 1, 3600000),
      remoteTaskGraphTimeoutMs: normalizeInteger(
        config.remoteTaskGraphTimeoutMs ?? config.remoteComputeTimeoutMs,
        30000,
        1,
        3600000
      ),
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
    this.stateProviderSyncTimers = new Set();
    this.netVizDebugSessionId = null;
    this.netVizDebugChannel = null;
    this.netVizDiscoveredSessions = new Map();
    this.pendingRemoteComputeRequests = new Map();
    this.pendingRemoteTaskGraphRequests = new Map();
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
        enableWorkers: this.config.enableWorkers !== false,
        gpuHub: this.gpuHub || null
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
      await this._requestStateProviderSync('start');
      this._scheduleStateProviderSyncRetries();

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
      this._clearStateProviderSyncTimers();
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

  async _requestStateProviderSync(reason = 'manual') {
    if (typeof this.stateManager?.requestProviderSync !== 'function') return false;
    try {
      return await this.stateManager.requestProviderSync({ reason });
    } catch (err) {
      console.warn('[NodeKernel] State provider sync request failed:', err?.message || err);
      return false;
    }
  }

  _scheduleStateProviderSyncRetries() {
    this._clearStateProviderSyncTimers();
    const delays = Array.isArray(this.config.stateProviderSyncRetryDelaysMs)
      ? this.config.stateProviderSyncRetryDelaysMs
      : [];
    for (const delayMs of delays) {
      const timer = setTimeout(() => {
        this.stateProviderSyncTimers.delete(timer);
        if (!this.isStarted) return;
        this._requestStateProviderSync(`retry-${delayMs}`).catch(() => {});
      }, delayMs);
      this.stateProviderSyncTimers.add(timer);
    }
  }

  _clearStateProviderSyncTimers() {
    for (const timer of this.stateProviderSyncTimers) {
      clearTimeout(timer);
    }
    this.stateProviderSyncTimers.clear();
  }

  clearStateProviderSyncTimers() {
    this._clearStateProviderSyncTimers();
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

  async submitTaskGraph(graph = {}) {
    const submittedAt = Date.now();
    const requestedPlacement = normalizeTaskGraphRequestedPlacement(graph);
    const advisoryPlacement = normalizeTaskGraphAdvisoryPlacement(graph);
    const localPlacement = taskGraphPlacementIsLocal(requestedPlacement);
    const targetPeerIds = normalizeTaskGraphTargetPeerIds(graph);
    const remoteExecutor = !localPlacement && !advisoryPlacement
      ? await this._resolveTaskGraphPlacementExecutor(graph, {
        requestedPlacement,
        advisoryPlacement,
        localPlacement,
        targetPeerIds,
        submittedAt
      })
      : null;
    const distributedGraphExecutorAvailable = typeof remoteExecutor?.executor === 'function';
    const placementPreflight = {
      schema: NODE_KERNEL_TASK_GRAPH_PLACEMENT_PREFLIGHT_SCHEMA,
      status: localPlacement
        ? 'local-placement-accepted'
        : (advisoryPlacement
            ? 'advisory-distributed-placement-local-execution-allowed'
            : (distributedGraphExecutorAvailable
                ? 'distributed-placement-executor-ready'
                : 'blocked-distributed-graph-executor-unavailable')),
      graphId: graph.graphId || graph.id || null,
      nodeId: this.nodeId || null,
      requestedPlacement,
      targetPeerIds,
      targetPeerId: targetPeerIds[0] || null,
      localPlacement,
      advisory: advisoryPlacement,
      distributedGraphExecutorAvailable,
      executorId: remoteExecutor?.executorId || null,
      executorTransport: remoteExecutor?.transport || null,
      reason: localPlacement
        ? 'task-graph-placement-local'
        : (advisoryPlacement
            ? 'distributed-task-graph-placement-is-advisory'
            : (distributedGraphExecutorAvailable
                ? 'non-advisory-distributed-task-graph-executor-available'
                : 'non-advisory-distributed-task-graph-executor-not-implemented'))
    };
    if (!localPlacement && !advisoryPlacement && !distributedGraphExecutorAvailable) {
      const err = new Error(`Distributed task graph placement is not available: ${requestedPlacement}`);
      err.code = 'ERR_NODEKERNEL_DISTRIBUTED_TASK_GRAPH_UNAVAILABLE';
      err.graphId = placementPreflight.graphId;
      err.placementPreflight = placementPreflight;
      throw err;
    }
    const placementPolicy = {
      ...(graph.placementPolicy || graph.placement || graph.placementHint || {}),
      authority: 'node-kernel',
      nodeId: this.nodeId || null,
      ...(targetPeerIds.length > 0 ? { targetPeerIds } : {})
    };
    let result;
    let authorityStatus = 'submitted-through-node-kernel';
    if (!localPlacement && !advisoryPlacement) {
      result = await remoteExecutor.executor({
        ...graph,
        placementPolicy
      }, {
        placementPreflight,
        nodeKernel: this,
        submittedAt
      });
      authorityStatus = 'submitted-through-node-kernel-distributed-executor';
    } else {
      if (!this.computeManager?.submitTaskGraph) {
        throw new Error('ComputeManager task graph support is unavailable');
      }
      result = await this.computeManager.submitTaskGraph({
        ...graph,
        placementPolicy
      });
    }
    const completedAt = Date.now();
    const nodeKernelAuthority = {
      schema: NODE_KERNEL_TASK_GRAPH_AUTHORITY_SCHEMA,
      status: authorityStatus,
      nodeId: this.nodeId || null,
      graphId: result?.graphId || graph.graphId || graph.id || null,
      computeManagerAvailable: typeof this.computeManager?.submitTaskGraph === 'function',
      stateManagerAvailable: !!this.stateManager,
      cacheArtifactAdmissionAvailable: typeof this.admitTaskGraphCacheArtifact === 'function',
      invalidationAvailable: typeof this.invalidateTaskGraphCacheArtifact === 'function',
      placementAuthority: 'node-kernel',
      placementPreflight,
      submittedAt,
      completedAt
    };
    return {
      ...result,
      nodeKernelOwned: true,
      nodeKernelAuthority
    };
  }

  async _resolveTaskGraphPlacementExecutor(graph = {}, context = {}) {
    const targetPeerIds = Array.isArray(context.targetPeerIds)
      ? context.targetPeerIds
      : normalizeTaskGraphTargetPeerIds(graph);
    const fallbackPeerId = targetPeerIds[0] || null;
    const fallbackExecutorId = fallbackPeerId
      ? `network-task-graph:${fallbackPeerId}`
      : 'task-graph-placement-executor';
    const resolverContext = {
      ...context,
      graph,
      targetPeerIds,
      targetPeerId: fallbackPeerId,
      nodeKernel: this
    };
    if (typeof graph.taskGraphExecutor === 'function') {
      return this._normalizeTaskGraphExecutorCandidate(graph.taskGraphExecutor, fallbackExecutorId, 'graph-task-graph-executor');
    }
    if (typeof this.config.resolveTaskGraphPlacementExecutor === 'function') {
      const candidate = await this.config.resolveTaskGraphPlacementExecutor(resolverContext);
      const normalized = this._normalizeTaskGraphExecutorCandidate(candidate, fallbackExecutorId, 'resolved-task-graph-executor');
      if (normalized) return normalized;
    }
    if (typeof this.config.taskGraphPlacementExecutor === 'function') {
      return this._normalizeTaskGraphExecutorCandidate(
        this.config.taskGraphPlacementExecutor,
        this.config.taskGraphPlacementExecutorId || fallbackExecutorId,
        'configured-task-graph-executor'
      );
    }
    if (fallbackPeerId && this.networkManager?.sendToPeer) {
      const source = graph.placementPolicy || graph.placement || graph.placementHint || {};
      const executor = this.createNetworkTaskGraphExecutor(fallbackPeerId, {
        executorId: fallbackExecutorId,
        timeoutMs: firstDefined(source.timeoutMs, graph.timeoutMs, this.config.remoteTaskGraphTimeoutMs),
        admitRemoteTaskGraphCacheArtifact: source.admitRemoteTaskGraphCacheArtifact === true
          || graph.admitRemoteTaskGraphCacheArtifact === true,
        remoteTaskGraphCacheArtifactValidatorId: firstDefined(
          source.remoteTaskGraphCacheArtifactValidatorId,
          graph.remoteTaskGraphCacheArtifactValidatorId,
          null
        )
      });
      return {
        executor,
        executorId: executor.taskGraphExecutorId || fallbackExecutorId,
        transport: 'nodekernel-remote-task-graph',
        targetPeerId: fallbackPeerId
      };
    }
    return null;
  }

  _normalizeTaskGraphExecutorCandidate(candidate, fallbackExecutorId, fallbackTransport) {
    if (!candidate) return null;
    if (typeof candidate === 'function') {
      return {
        executor: candidate,
        executorId: candidate.taskGraphExecutorId
          || candidate.placementExecutorId
          || fallbackExecutorId
          || null,
        transport: candidate.taskGraphExecutorTransport
          || candidate.placementExecutorTransport
          || fallbackTransport
          || 'task-graph-executor',
        targetPeerId: candidate.targetPeerId || null
      };
    }
    if (candidate && typeof candidate.executor === 'function') {
      return {
        executor: candidate.executor,
        executorId: candidate.executorId
          || candidate.taskGraphExecutorId
          || candidate.executor.taskGraphExecutorId
          || fallbackExecutorId
          || null,
        transport: candidate.transport
          || candidate.executor.taskGraphExecutorTransport
          || fallbackTransport
          || 'task-graph-executor',
        targetPeerId: candidate.targetPeerId || null
      };
    }
    return null;
  }

  _createRemoteComputeRequestId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `remote-compute-${crypto.randomUUID()}`;
    }
    return `remote-compute-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  _createRemoteTaskGraphRequestId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `remote-task-graph-${crypto.randomUUID()}`;
    }
    return `remote-task-graph-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

  _assertRemoteTaskGraphSafe(graph = {}, { allowFunctions = false } = {}) {
    if (allowFunctions) return;
    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    for (const node of nodes) {
      if (typeof node?.createTask === 'function' || typeof node?.task === 'function' || node?.task?.fn) {
        const err = new Error('Remote task graph function nodes are disabled; use module or WASM task nodes');
        err.code = 'ERR_REMOTE_TASK_GRAPH_UNSAFE_NODE';
        err.nodeId = node?.id || node?.nodeId || null;
        throw err;
      }
    }
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

  _buildRemoteTaskGraphCacheArtifactPreflight(targetPeerId, resultEnvelope = {}, response = {}, options = {}) {
    const artifact = resultEnvelope?.cacheArtifact && typeof resultEnvelope.cacheArtifact === 'object'
      ? resultEnvelope.cacheArtifact
      : null;
    const base = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_PREFLIGHT_SCHEMA,
      status: artifact ? 'remote-cache-artifact-received-not-admitted' : 'no-cache-artifact',
      cacheKey: artifact?.cacheKey || resultEnvelope?.cacheKey || null,
      cacheArtifactSchema: artifact?.schema || resultEnvelope?.cacheArtifactSchema || null,
      cacheArtifactStatus: artifact?.status || resultEnvelope?.cacheArtifactStatus || null,
      remoteArtifactAdmitted: artifact?.admitted === true,
      resultHash: artifact?.resultHash || null,
      inputHash: artifact?.inputHash || resultEnvelope?.cacheInputHash || null,
      requestId: response?.requestId || null,
      targetPeerId,
      responderId: response?.responderId || null,
      admittedLocally: false,
      admission: null,
      reason: artifact
        ? 'remote-cache-artifact-requires-local-state-manager-admission'
        : 'remote-task-graph-result-has-no-cache-artifact'
    };
    if (!artifact) return base;
    if (options.admitRemoteTaskGraphCacheArtifact !== true) return base;
    if (!this.stateManager?.admitTaskGraphCacheArtifact) {
      return {
        ...base,
        status: 'admission-unavailable',
        reason: 'state-manager-cache-artifact-admission-unavailable'
      };
    }
    try {
      const admission = this.admitTaskGraphCacheArtifact(artifact, {
        source: 'remote-task-graph-result',
        sourcePeerId: targetPeerId,
        responderId: response?.responderId || null,
        requestId: response?.requestId || null,
        validatorId: options.remoteTaskGraphCacheArtifactValidatorId || null,
        reason: 'remote-task-graph-cache-artifact-admitted'
      });
      const importReport = admission?.admitted === true && this.computeManager?.importRemoteTaskGraphCacheResult
        ? this.computeManager.importRemoteTaskGraphCacheResult(resultEnvelope, admission, {
          sourcePeerId: targetPeerId,
          responderId: response?.responderId || null,
          requestId: response?.requestId || null
        })
        : null;
      return {
        ...base,
        status: admission?.admitted === true ? 'admitted-through-node-kernel-state-manager' : 'admission-recorded-not-admitted',
        admittedLocally: admission?.admitted === true,
        importedLocally: importReport?.status === 'imported-admitted-remote-cache-result',
        importStatus: importReport?.status || null,
        importReport,
        admission,
        reason: admission?.reason || 'remote-task-graph-cache-artifact-admission-recorded'
      };
    } catch (err) {
      return {
        ...base,
        status: 'admission-failed',
        errorCode: err?.code || null,
        errorMessage: err?.message || String(err),
        reason: 'remote-task-graph-cache-artifact-admission-failed'
      };
    }
  }

  _buildNetworkTaskGraphResultEnvelope(targetPeerId, graph, response, {
    executorId,
    admitRemoteTaskGraphCacheArtifact = false,
    remoteTaskGraphCacheArtifactValidatorId = null
  } = {}) {
    const resultEnvelope = response?.result && typeof response.result === 'object'
      ? { ...response.result }
      : { value: response?.result };
    const cacheArtifactPreflight = this._buildRemoteTaskGraphCacheArtifactPreflight(
      targetPeerId,
      resultEnvelope,
      response,
      {
        admitRemoteTaskGraphCacheArtifact,
        remoteTaskGraphCacheArtifactValidatorId
      }
    );
    const transportPeerId = response?.peerId || null;
    const responderNodeId = response?.responderId || null;
    const responderPeerId = response?.responderPeerId || transportPeerId || targetPeerId;
    const graphId = resultEnvelope.graphId || graph?.graphId || graph?.id || null;
    const provenance = {
      schema: REMOTE_TASK_GRAPH_PLACEMENT_PROVENANCE_SCHEMA,
      transport: 'nodekernel-remote-task-graph',
      executorId,
      peerId: responderNodeId || targetPeerId,
      remotePeerId: responderNodeId || targetPeerId,
      transportPeerId,
      responderNodeId,
      responderPeerId,
      targetPeerId,
      requesterId: this.nodeId,
      requestId: response?.requestId || null,
      requestSchema: REMOTE_TASK_GRAPH_REQUEST_SCHEMA,
      responseSchema: response?.schema || REMOTE_TASK_GRAPH_RESULT_SCHEMA,
      graphId,
      nodeCount: resultEnvelope.nodeCount ?? (Array.isArray(graph?.nodes) ? graph.nodes.length : null),
      resultSchema: resultEnvelope.schema || null,
      cacheArtifactPreflight,
      remoteCompletedAt: response?.completedAt || null,
      receivedAt: response?.receivedAt || Date.now(),
      roundTripMs: Number.isFinite(response?.roundTripMs) ? response.roundTripMs : null,
      trustLevel: 'nodekernel-network-peer',
      validated: false
    };
    if (!resultEnvelope.taskGraphPlacementProvenance && !resultEnvelope.placementProvenance) {
      resultEnvelope.taskGraphPlacementProvenance = provenance;
    } else {
      resultEnvelope.nodeKernelRemoteTaskGraphResponse = provenance;
    }
    resultEnvelope.remoteTaskGraphCacheArtifactPreflight = cacheArtifactPreflight;
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

  createNetworkTaskGraphExecutor(peerId, options = {}) {
    const targetPeerId = String(peerId || options.peerId || '').trim();
    if (!targetPeerId) {
      throw new Error('createNetworkTaskGraphExecutor requires a peerId');
    }
    const executorId = options.executorId || `network-task-graph:${targetPeerId}`;
    const executor = async (graph, context = {}) => {
      const response = await this.submitRemoteTaskGraph(targetPeerId, graph, {
        ...options,
        context,
        returnResponseEnvelope: true
      });
      return this._buildNetworkTaskGraphResultEnvelope(targetPeerId, graph, response, {
        executorId,
        admitRemoteTaskGraphCacheArtifact: options.admitRemoteTaskGraphCacheArtifact === true,
        remoteTaskGraphCacheArtifactValidatorId: options.remoteTaskGraphCacheArtifactValidatorId || null
      });
    };
    executor.taskGraphExecutorId = executorId;
    executor.taskGraphExecutorTransport = 'nodekernel-remote-task-graph';
    executor.targetPeerId = targetPeerId;
    return executor;
  }

  async submitRemoteTaskGraph(peerId, graph = {}, options = {}) {
    if (!this.isStarted) {
      throw new Error('Node not started');
    }
    if (!this.networkManager?.sendToPeer) {
      throw new Error('NetworkManager not initialized');
    }
    const targetPeerId = String(peerId || '').trim();
    if (!targetPeerId) {
      throw new Error('submitRemoteTaskGraph requires peerId');
    }
    this._assertRemoteTaskGraphSafe(graph, {
      allowFunctions: options.allowRemoteFunctionTasks === true
    });
    const requestId = options.requestId || this._createRemoteTaskGraphRequestId();
    const timeoutMs = normalizeInteger(
      options.timeoutMs ?? this.config.remoteTaskGraphTimeoutMs ?? this.config.remoteComputeTimeoutMs,
      this.config.remoteTaskGraphTimeoutMs || this.config.remoteComputeTimeoutMs,
      1,
      3600000
    );
    const request = {
      schema: REMOTE_TASK_GRAPH_REQUEST_SCHEMA,
      requestId,
      requesterId: this.nodeId,
      targetPeerId,
      graph,
      context: options.context || null,
      sentAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRemoteTaskGraphRequests.delete(requestId);
        const err = new Error(`Remote task graph request timed out after ${timeoutMs}ms`);
        err.code = 'ERR_REMOTE_TASK_GRAPH_TIMEOUT';
        err.requestId = requestId;
        reject(err);
      }, timeoutMs);
      this.pendingRemoteTaskGraphRequests.set(requestId, {
        peerId: targetPeerId,
        resolve,
        reject,
        timeoutId,
        requestId,
        sentAt: request.sentAt,
        returnResponseEnvelope: options.returnResponseEnvelope === true
      });
      this.networkManager.sendToPeer(targetPeerId, {
        type: 'compute-task-graph',
        data: request
      }).catch((err) => {
        clearTimeout(timeoutId);
        this.pendingRemoteTaskGraphRequests.delete(requestId);
        reject(err);
      });
    });
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
        taskGraphResponderEnabled: this.config.enableRemoteTaskGraphResponder === true,
        allowFunctionTasks: this.config.allowRemoteFunctionTasks === true,
        pendingRequestCount: this.pendingRemoteComputeRequests?.size || 0,
        pendingTaskGraphRequestCount: this.pendingRemoteTaskGraphRequests?.size || 0
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

  commitRemoteTaskGraphStateSeed(cacheKeyOrOptions, options = {}) {
    const source = cacheKeyOrOptions && typeof cacheKeyOrOptions === 'object'
      ? cacheKeyOrOptions
      : options;
    const cacheKey = String(
      typeof cacheKeyOrOptions === 'string'
        ? cacheKeyOrOptions
        : source?.cacheKey || ''
    ).trim();
    const requestedAt = Date.now();
    const base = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA,
      status: 'blocked',
      committed: false,
      authority: 'node-kernel-state-manager',
      nodeId: this.nodeId || null,
      cacheKey: cacheKey || null,
      requestedAt
    };
    if (!cacheKey) {
      return {
        ...base,
        status: 'blocked-no-cache-key',
        reason: 'remote-task-graph-state-seed-requires-cache-key'
      };
    }
    if (!this.computeManager?.evaluateRemoteTaskGraphStateSeedPolicy) {
      return {
        ...base,
        status: 'policy-unavailable',
        reason: 'compute-manager-remote-state-seed-policy-unavailable'
      };
    }
    const policy = this.computeManager.evaluateRemoteTaskGraphStateSeedPolicy(cacheKey, {
      allowedStateFamilies: source?.allowedStateFamilies ?? source?.allowedFamilies,
      allowWarmStateSeed: source?.allowWarmStateSeed !== false,
      allowHotBufferRefresh: source?.allowHotBufferRefresh === true,
      requireStateFamilies: source?.requireStateFamilies
    });
    const policyReady = policy?.status === 'policy-ready'
      && policy?.warmStateSeedStatus === 'warm-state-seed-allowed';
    if (!policyReady) {
      return {
        ...base,
        status: 'blocked-by-policy',
        reason: policy?.reason || 'remote-state-seed-policy-blocked',
        policy: cloneSerializableValue(policy)
      };
    }
    const overrideStateSeedPayload = firstDefined(
      source?.validatedStateSeedPayload,
      source?.stateSeedPayloadOverride,
      source?.stateSeedPayload
    );
    const stateSeedPayload = overrideStateSeedPayload != null
      ? overrideStateSeedPayload
      : policy.stateSeedPayload;
    const requireStateSeedPayload = source?.requireStateSeedPayload !== false;
    if (requireStateSeedPayload && stateSeedPayload == null) {
      return {
        ...base,
        status: 'blocked-missing-state-seed-payload',
        reason: 'remote-import-did-not-include-compact-state-seed-payload',
        policy: cloneSerializableValue(policy)
      };
    }
    if (!this.stateManager?.commitDelta) {
      return {
        ...base,
        status: 'commit-unavailable',
        reason: 'state-manager-commit-delta-unavailable',
        policy: cloneSerializableValue(policy)
      };
    }
    const committedAt = Date.now();
    const deltaScope = String(source?.scope || source?.deltaScope || 'remote-task-graph-state-seeds').trim()
      || 'remote-task-graph-state-seeds';
    const deltaTaskId = String(
      source?.taskId
        || source?.deltaTaskId
        || `remote-task-graph-state-seed:${cacheKey}`
    ).trim();
    const payload = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA,
      status: 'warm-state-seed-recorded',
      authority: 'node-kernel-state-manager',
      nodeId: this.nodeId || null,
      cacheKey,
      committedAt,
      stateFamilies: [...(policy.stateFamilies || [])],
      readFamilies: [...(policy.readFamilies || [])],
      writeFamilies: [...(policy.writeFamilies || [])],
      retainedBufferRefs: [...(policy.retainedBufferRefs || [])],
      remoteRetainedRefsUsableLocally: policy.remoteRetainedRefsUsableLocally === true,
      hotBufferRefreshStatus: policy.hotBufferRefreshStatus || null,
      hotBufferRefreshRequired: policy.hotBufferRefreshStatus === 'local-refresh-required',
      stateSeedPayload: stateSeedPayload != null
        ? cloneSerializableValue(stateSeedPayload)
        : null,
      stateSeedPayloadSource: overrideStateSeedPayload != null
        ? 'nodekernel-call-validated-override'
        : 'remote-cache-artifact-policy',
      importReport: cloneSerializableValue(policy.importReport),
      remoteGraphLeaseRefs: cloneSerializableValue(policy.remoteGraphLeaseRefs),
      policy: cloneSerializableValue(policy)
    };
    const commitDelta = {
      taskId: deltaTaskId,
      scope: deltaScope,
      version: source?.version ?? policy.importReport?.importedAt ?? committedAt,
      timestamp: committedAt,
      payload
    };
    this.stateManager.commitDelta(commitDelta);
    return {
      ...payload,
      status: 'warm-state-seed-committed',
      committed: true,
      commitDeltaTaskId: deltaTaskId,
      commitDeltaScope: deltaScope,
      commitDeltaTimestamp: committedAt,
      commitDelta: source?.returnCommitDelta === true ? cloneSerializableValue(commitDelta) : null
    };
  }

  commitRemoteTaskGraphCompactCandidate(cacheKeyOrOptions, options = {}) {
    const source = cacheKeyOrOptions && typeof cacheKeyOrOptions === 'object'
      ? cacheKeyOrOptions
      : options;
    const cacheKey = String(
      typeof cacheKeyOrOptions === 'string'
        ? cacheKeyOrOptions
        : source?.cacheKey || ''
    ).trim();
    const requestedAt = Date.now();
    const base = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA,
      status: 'blocked',
      committed: false,
      authority: 'node-kernel-state-manager',
      nodeId: this.nodeId || null,
      cacheKey: cacheKey || null,
      requestedAt
    };
    if (!cacheKey) {
      return {
        ...base,
        status: 'blocked-no-cache-key',
        reason: 'remote-task-graph-compact-candidate-requires-cache-key'
      };
    }
    const compactCandidate = firstDefined(
      source?.compactCandidate,
      source?.compactOutputCandidate,
      source?.compactMechanicsStageCandidate,
      source?.candidate
    );
    if (!compactCandidate || typeof compactCandidate !== 'object') {
      return {
        ...base,
        status: 'blocked-missing-compact-candidate',
        reason: 'remote-task-graph-compact-candidate-required'
      };
    }
    if (!this.computeManager?.evaluateRemoteTaskGraphStateSeedPolicy) {
      return {
        ...base,
        status: 'policy-unavailable',
        reason: 'compute-manager-remote-state-seed-policy-unavailable'
      };
    }
    const allowedStateFamilies = normalizeStringList(source?.allowedStateFamilies ?? source?.allowedFamilies);
    const policy = this.computeManager.evaluateRemoteTaskGraphStateSeedPolicy(cacheKey, {
      allowedStateFamilies,
      allowWarmStateSeed: false,
      allowHotBufferRefresh: true,
      requireStateFamilies: source?.requireStateFamilies
    });
    if (policy?.status !== 'policy-ready') {
      return {
        ...base,
        status: 'blocked-by-policy',
        reason: policy?.reason || 'remote-compact-candidate-policy-blocked',
        policy: cloneSerializableValue(policy)
      };
    }
    const candidateStateFamilies = normalizeStringList(compactCandidate.stateFamilies ?? compactCandidate.outputFamilies);
    const disallowedCandidateFamilies = allowedStateFamilies.length > 0
      ? candidateStateFamilies.filter((family) => !allowedStateFamilies.includes(family))
      : [];
    if (allowedStateFamilies.length === 0) {
      return {
        ...base,
        status: 'blocked-missing-state-family-policy',
        reason: 'allowed-state-family-policy-is-required',
        compactCandidate: cloneSerializableValue(compactCandidate),
        policy: cloneSerializableValue(policy)
      };
    }
    if (candidateStateFamilies.length === 0) {
      return {
        ...base,
        status: 'blocked-missing-candidate-state-families',
        reason: 'compact-candidate-did-not-declare-state-families',
        compactCandidate: cloneSerializableValue(compactCandidate),
        policy: cloneSerializableValue(policy)
      };
    }
    if (disallowedCandidateFamilies.length > 0) {
      return {
        ...base,
        status: 'blocked-state-family-policy',
        reason: 'compact-candidate-declares-state-families-outside-policy',
        disallowedCandidateFamilies,
        compactCandidate: cloneSerializableValue(compactCandidate),
        policy: cloneSerializableValue(policy)
      };
    }
    if (!this.stateManager?.commitDelta) {
      return {
        ...base,
        status: 'commit-unavailable',
        reason: 'state-manager-commit-delta-unavailable',
        policy: cloneSerializableValue(policy)
      };
    }
    const committedAt = Date.now();
    const deltaScope = String(source?.scope || source?.deltaScope || 'remote-task-graph-compact-candidates').trim()
      || 'remote-task-graph-compact-candidates';
    const candidateId = String(
      source?.candidateId
        || compactCandidate.hash
        || compactCandidate.sourceNodeId
        || 'compact-candidate'
    ).trim();
    const deltaTaskId = String(
      source?.taskId
        || source?.deltaTaskId
        || `remote-task-graph-compact-candidate:${cacheKey}:${candidateId}`
    ).trim();
    const retainedBufferRefs = normalizeStringList(
      compactCandidate.retainedBufferRefs ?? compactCandidate.outputBufferRefs ?? policy.retainedBufferRefs
    );
    const payload = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA,
      status: 'compact-candidate-recorded',
      authority: 'node-kernel-state-manager',
      nodeId: this.nodeId || null,
      cacheKey,
      candidateId,
      committedAt,
      stateFamilies: candidateStateFamilies,
      readFamilies: normalizeStringList(source?.readFamilies ?? policy.readFamilies),
      writeFamilies: normalizeStringList(source?.writeFamilies ?? policy.writeFamilies),
      retainedBufferRefs,
      remoteRetainedRefsUsableLocally: false,
      localRefreshRequired: compactCandidate.localRefreshRequired !== false,
      admissionRequired: compactCandidate.admissionRequired !== false,
      hotBufferRefreshStatus: compactCandidate.localRefreshRequired === false
        ? 'compact-candidate-refresh-not-required'
        : 'compact-candidate-local-refresh-required',
      compactCandidate: cloneSerializableValue(compactCandidate),
      importReport: cloneSerializableValue(policy.importReport),
      remoteGraphLeaseRefs: cloneSerializableValue(policy.remoteGraphLeaseRefs),
      policy: cloneSerializableValue(policy)
    };
    const commitDelta = {
      taskId: deltaTaskId,
      scope: deltaScope,
      version: source?.version ?? policy.importReport?.importedAt ?? committedAt,
      timestamp: committedAt,
      payload
    };
    this.stateManager.commitDelta(commitDelta);
    return {
      ...payload,
      status: 'compact-candidate-committed',
      committed: true,
      commitDeltaTaskId: deltaTaskId,
      commitDeltaScope: deltaScope,
      commitDeltaTimestamp: committedAt,
      commitDelta: source?.returnCommitDelta === true ? cloneSerializableValue(commitDelta) : null
    };
  }

  async refreshRemoteTaskGraphHotBuffersFromCompactCandidate(cacheKeyOrOptions, options = {}) {
    const source = cacheKeyOrOptions && typeof cacheKeyOrOptions === 'object'
      ? cacheKeyOrOptions
      : options;
    const cacheKey = String(
      typeof cacheKeyOrOptions === 'string'
        ? cacheKeyOrOptions
        : source?.cacheKey || ''
    ).trim();
    const requestedAt = Date.now();
    const base = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
      status: 'blocked',
      refreshed: false,
      authority: 'node-kernel-compute-manager-local-gpu-lane',
      sourceMode: 'compact-candidate',
      nodeId: this.nodeId || null,
      cacheKey: cacheKey || null,
      requestedAt
    };
    if (!cacheKey) {
      return {
        ...base,
        status: 'blocked-no-cache-key',
        reason: 'remote-task-graph-compact-hot-buffer-refresh-requires-cache-key'
      };
    }
    if (!this.stateManager?.getWarmDeltas) {
      return {
        ...base,
        status: 'compact-candidate-read-unavailable',
        reason: 'state-manager-warm-delta-read-unavailable'
      };
    }
    const candidateScope = String(
      source?.compactCandidateScope
        || source?.candidateScope
        || source?.scope
        || 'remote-task-graph-compact-candidates'
    ).trim() || 'remote-task-graph-compact-candidates';
    const candidateId = String(source?.candidateId || source?.hash || 'compact-candidate').trim();
    const candidateTaskId = String(
      source?.compactCandidateTaskId
        || source?.candidateTaskId
        || source?.taskId
        || `remote-task-graph-compact-candidate:${cacheKey}:${candidateId}`
    ).trim();
    const warmDeltas = this.stateManager.getWarmDeltas(candidateScope) || {};
    const candidateEntry = warmDeltas[candidateTaskId] || Object.values(warmDeltas)
      .find((entry) => entry?.payload?.schema === NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA
        && entry?.payload?.cacheKey === cacheKey) || null;
    const candidatePayload = candidateEntry?.payload || null;
    if (!candidatePayload || candidatePayload.schema !== NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA) {
      return {
        ...base,
        status: 'blocked-missing-compact-candidate',
        reason: 'committed-remote-task-graph-compact-candidate-not-found',
        candidateScope,
        candidateTaskId
      };
    }
    if (candidatePayload.localRefreshRequired !== true && source?.forceRefresh !== true) {
      return {
        ...base,
        status: 'no-refresh-required',
        refreshed: false,
        reason: 'committed-compact-candidate-does-not-require-hot-buffer-refresh',
        candidateScope,
        candidateTaskId,
        compactCandidateAuthority: cloneSerializableValue(candidatePayload)
      };
    }
    if (!this.computeManager?.acquireGpuResidentLaneLease
      || !this.computeManager?.completeGpuResidentLaneLease
      || !this.computeManager?.rejectGpuResidentLaneLease) {
      return {
        ...base,
        status: 'gpu-lane-unavailable',
        reason: 'compute-manager-gpu-resident-lane-api-unavailable',
        candidateScope,
        candidateTaskId,
        compactCandidateAuthority: cloneSerializableValue(candidatePayload)
      };
    }
    if (typeof source?.refreshExecutor !== 'function') {
      return {
        ...base,
        status: 'refresh-executor-unavailable',
        reason: 'local-compact-hot-buffer-refresh-executor-required',
        candidateScope,
        candidateTaskId,
        compactCandidateAuthority: cloneSerializableValue(candidatePayload)
      };
    }
    const stateFamilies = normalizeStringList(candidatePayload.stateFamilies);
    const remoteRetainedBufferRefs = normalizeStringList(candidatePayload.retainedBufferRefs);
    const initialLocalRetainedBufferRefs = normalizeStringList(source?.localRetainedBufferRefs);
    const leaseSpec = {
      laneId: source?.laneId || `remote-task-graph-compact-refresh:${cacheKey}`,
      stateKey: source?.stateKey || candidatePayload.stateKey || `remote-task-graph-compact-state:${cacheKey}`,
      domainKey: source?.domainKey || 'remote-task-graph-compact-hot-buffer-refresh',
      solverId: source?.solverId || 'remote-task-graph-compact-hot-buffer-refresh',
      taskId: source?.refreshTaskId || `remote-task-graph-compact-hot-buffer-refresh:${cacheKey}`,
      owner: 'node-kernel-remote-task-graph-compact-hot-buffer-refresh',
      readFamilies: stateFamilies,
      writeFamilies: stateFamilies,
      retainedBufferRefs: initialLocalRetainedBufferRefs,
      remoteRetainedBufferRefs,
      copyBudget: source?.copyBudget || {
        uploadBytes: 0,
        readbackBytes: 0,
        retainedBytes: 0,
        compactSummaryBytes: 0
      }
    };
    let lease = null;
    try {
      lease = this.computeManager.acquireGpuResidentLaneLease(leaseSpec);
      const refreshResult = await source.refreshExecutor({
        cacheKey,
        compactCandidateAuthority: cloneSerializableValue(candidatePayload),
        compactCandidate: cloneSerializableValue(candidatePayload.compactCandidate),
        lease: cloneSerializableValue(lease),
        nodeKernel: this,
        computeManager: this.computeManager,
        stateManager: this.stateManager,
        gpuHub: this.gpuHub || null
      });
      const localRetainedRefs = normalizeStringList(
        refreshResult?.retainedBufferRefs || refreshResult?.localBufferRefs || initialLocalRetainedBufferRefs
      );
      const refreshStatusText = String(refreshResult?.status || '').trim().toLowerCase();
      const executorBlocked = refreshResult?.refreshed === false
        || refreshStatusText.startsWith('blocked')
        || refreshStatusText.includes('unavailable')
        || refreshStatusText.includes('failed');
      if (executorBlocked || localRetainedRefs.length === 0) {
        let rejectedLease = null;
        try {
          rejectedLease = this.computeManager.rejectGpuResidentLaneLease(
            lease.leaseId,
            'remote-task-graph-compact-hot-buffer-refresh-not-completed'
          );
        } catch {
          rejectedLease = null;
        }
        return {
          ...base,
          status: 'compact-hot-buffer-refresh-not-completed',
          reason: refreshResult?.reason
            || (localRetainedRefs.length === 0
              ? 'local-compact-hot-buffer-refresh-executor-produced-no-local-refs'
              : 'local-compact-hot-buffer-refresh-executor-blocked'),
          candidateScope,
          candidateTaskId,
          compactCandidateAuthority: cloneSerializableValue(candidatePayload),
          refreshResult: cloneSerializableValue(refreshResult),
          lease: cloneSerializableValue(lease),
          rejectedLease: cloneSerializableValue(rejectedLease)
        };
      }
      const execution = this.computeManager.completeGpuResidentLaneLease(lease.leaseId, {
        status: refreshResult?.gpuFence?.status || refreshResult?.fenceStatus || 'queue-work-completed',
        method: refreshResult?.gpuFence?.method || refreshResult?.fenceMethod || 'local-compact-hot-buffer-refresh-executor',
        retainedBufferRefs: localRetainedRefs,
        source: 'node-kernel-remote-task-graph-compact-hot-buffer-refresh'
      });
      const refreshedAt = Date.now();
      const payload = {
        schema: NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
        status: 'hot-buffer-refresh-recorded',
        authority: 'node-kernel-compute-manager-local-gpu-lane',
        sourceMode: 'compact-candidate',
        nodeId: this.nodeId || null,
        cacheKey,
        candidateScope,
        candidateTaskId,
        refreshedAt,
        stateFamilies,
        remoteRetainedBufferRefs,
        retainedBufferRefs: localRetainedRefs,
        localBufferRefs: normalizeStringList(refreshResult?.localBufferRefs || localRetainedRefs),
        lease: cloneSerializableValue(lease),
        execution: cloneSerializableValue(execution),
        refreshResult: cloneSerializableValue(refreshResult),
        compactCandidateAuthority: cloneSerializableValue(candidatePayload),
        compactCandidate: cloneSerializableValue(candidatePayload.compactCandidate)
      };
      let commitDelta = null;
      if (source?.commitRefreshDelta !== false && this.stateManager?.commitDelta) {
        const refreshScope = String(source?.refreshScope || 'remote-task-graph-hot-buffer-refreshes').trim()
          || 'remote-task-graph-hot-buffer-refreshes';
        const refreshTaskId = String(
          source?.refreshDeltaTaskId
            || `remote-task-graph-compact-hot-buffer-refresh:${cacheKey}`
        ).trim();
        commitDelta = {
          taskId: refreshTaskId,
          scope: refreshScope,
          version: source?.version ?? refreshedAt,
          timestamp: refreshedAt,
          payload
        };
        this.stateManager.commitDelta(commitDelta);
      }
      return {
        ...payload,
        status: 'hot-buffer-refresh-completed',
        refreshed: true,
        commitDelta: commitDelta && source?.returnCommitDelta === true
          ? cloneSerializableValue(commitDelta)
          : null
      };
    } catch (err) {
      let rejectedLease = null;
      if (lease?.leaseId) {
        try {
          rejectedLease = this.computeManager.rejectGpuResidentLaneLease(
            lease.leaseId,
            'remote-task-graph-compact-hot-buffer-refresh-failed'
          );
        } catch {
          rejectedLease = null;
        }
      }
      return {
        ...base,
        status: 'hot-buffer-refresh-failed',
        reason: 'local-compact-hot-buffer-refresh-executor-failed',
        errorCode: err?.code || null,
        errorMessage: err?.message || String(err),
        candidateScope,
        candidateTaskId,
        lease: cloneSerializableValue(lease),
        rejectedLease: cloneSerializableValue(rejectedLease)
      };
    }
  }

  async refreshRemoteTaskGraphHotBuffersFromSeed(cacheKeyOrOptions, options = {}) {
    const source = cacheKeyOrOptions && typeof cacheKeyOrOptions === 'object'
      ? cacheKeyOrOptions
      : options;
    const cacheKey = String(
      typeof cacheKeyOrOptions === 'string'
        ? cacheKeyOrOptions
        : source?.cacheKey || ''
    ).trim();
    const requestedAt = Date.now();
    const base = {
      schema: NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
      status: 'blocked',
      refreshed: false,
      authority: 'node-kernel-compute-manager-local-gpu-lane',
      nodeId: this.nodeId || null,
      cacheKey: cacheKey || null,
      requestedAt
    };
    if (!cacheKey) {
      return {
        ...base,
        status: 'blocked-no-cache-key',
        reason: 'remote-task-graph-hot-buffer-refresh-requires-cache-key'
      };
    }
    if (!this.stateManager?.getWarmDeltas) {
      return {
        ...base,
        status: 'seed-read-unavailable',
        reason: 'state-manager-warm-delta-read-unavailable'
      };
    }
    const seedScope = String(source?.seedScope || source?.scope || 'remote-task-graph-state-seeds').trim()
      || 'remote-task-graph-state-seeds';
    const seedTaskId = String(
      source?.seedTaskId
        || source?.taskId
        || `remote-task-graph-state-seed:${cacheKey}`
    ).trim();
    const warmDeltas = this.stateManager.getWarmDeltas(seedScope) || {};
    const seedEntry = warmDeltas[seedTaskId] || Object.values(warmDeltas)
      .find((entry) => entry?.payload?.cacheKey === cacheKey) || null;
    const seedPayload = seedEntry?.payload || null;
    if (!seedPayload || seedPayload.schema !== NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA) {
      return {
        ...base,
        status: 'blocked-missing-state-seed',
        reason: 'committed-remote-task-graph-state-seed-not-found',
        seedScope,
        seedTaskId
      };
    }
    if (seedPayload.hotBufferRefreshRequired !== true && source?.forceRefresh !== true) {
      return {
        ...base,
        status: 'no-refresh-required',
        refreshed: false,
        reason: 'committed-state-seed-does-not-require-hot-buffer-refresh',
        seedScope,
        seedTaskId,
        seed: cloneSerializableValue(seedPayload)
      };
    }
    if (!this.computeManager?.acquireGpuResidentLaneLease
      || !this.computeManager?.completeGpuResidentLaneLease
      || !this.computeManager?.rejectGpuResidentLaneLease) {
      return {
        ...base,
        status: 'gpu-lane-unavailable',
        reason: 'compute-manager-gpu-resident-lane-api-unavailable',
        seedScope,
        seedTaskId
      };
    }
    if (typeof source?.refreshExecutor !== 'function') {
      return {
        ...base,
        status: 'refresh-executor-unavailable',
        reason: 'local-hot-buffer-refresh-executor-required',
        seedScope,
        seedTaskId,
        seed: cloneSerializableValue(seedPayload)
      };
    }
    const retainedBufferRefs = Array.isArray(seedPayload.retainedBufferRefs)
      ? [...seedPayload.retainedBufferRefs]
      : [];
    const initialLocalRetainedBufferRefs = Array.isArray(source?.localRetainedBufferRefs)
      ? [...source.localRetainedBufferRefs]
      : [];
    const stateFamilies = Array.isArray(seedPayload.stateFamilies)
      ? [...seedPayload.stateFamilies]
      : [];
    const leaseSpec = {
      laneId: source?.laneId || `remote-task-graph-refresh:${cacheKey}`,
      stateKey: source?.stateKey || `remote-task-graph-state:${cacheKey}`,
      domainKey: source?.domainKey || 'remote-task-graph-hot-buffer-refresh',
      solverId: source?.solverId || 'remote-task-graph-hot-buffer-refresh',
      taskId: source?.refreshTaskId || `remote-task-graph-hot-buffer-refresh:${cacheKey}`,
      owner: 'node-kernel-remote-task-graph-hot-buffer-refresh',
      readFamilies: stateFamilies,
      writeFamilies: stateFamilies,
      retainedBufferRefs: initialLocalRetainedBufferRefs,
      copyBudget: source?.copyBudget || {
        uploadBytes: 0,
        readbackBytes: 0,
        retainedBytes: 0,
        compactSummaryBytes: 0
      }
    };
    let lease = null;
    try {
      lease = this.computeManager.acquireGpuResidentLaneLease(leaseSpec);
      const refreshResult = await source.refreshExecutor({
        cacheKey,
        seed: cloneSerializableValue(seedPayload),
        stateSeedPayload: cloneSerializableValue(seedPayload.stateSeedPayload),
        lease: cloneSerializableValue(lease),
        nodeKernel: this,
        computeManager: this.computeManager,
        stateManager: this.stateManager,
        gpuHub: this.gpuHub || null
      });
      const localRetainedRefs = Array.isArray(refreshResult?.retainedBufferRefs)
        ? refreshResult.retainedBufferRefs
        : initialLocalRetainedBufferRefs;
      const execution = this.computeManager.completeGpuResidentLaneLease(lease.leaseId, {
        status: refreshResult?.gpuFence?.status || refreshResult?.fenceStatus || 'queue-work-completed',
        method: refreshResult?.gpuFence?.method || refreshResult?.fenceMethod || 'local-hot-buffer-refresh-executor',
        retainedBufferRefs: localRetainedRefs,
        source: 'node-kernel-remote-task-graph-hot-buffer-refresh'
      });
      const refreshedAt = Date.now();
      const payload = {
        schema: NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
        status: 'hot-buffer-refresh-recorded',
        authority: 'node-kernel-compute-manager-local-gpu-lane',
        nodeId: this.nodeId || null,
        cacheKey,
        seedScope,
        seedTaskId,
        refreshedAt,
        stateFamilies,
        retainedBufferRefs: localRetainedRefs,
        localBufferRefs: Array.isArray(refreshResult?.localBufferRefs)
          ? [...refreshResult.localBufferRefs]
          : localRetainedRefs,
        lease: cloneSerializableValue(lease),
        execution: cloneSerializableValue(execution),
        refreshResult: cloneSerializableValue(refreshResult),
        seed: cloneSerializableValue(seedPayload)
      };
      let commitDelta = null;
      if (source?.commitRefreshDelta !== false && this.stateManager?.commitDelta) {
        const refreshScope = String(source?.refreshScope || 'remote-task-graph-hot-buffer-refreshes').trim()
          || 'remote-task-graph-hot-buffer-refreshes';
        const refreshTaskId = String(
          source?.refreshDeltaTaskId
            || `remote-task-graph-hot-buffer-refresh:${cacheKey}`
        ).trim();
        commitDelta = {
          taskId: refreshTaskId,
          scope: refreshScope,
          version: source?.version ?? refreshedAt,
          timestamp: refreshedAt,
          payload
        };
        this.stateManager.commitDelta(commitDelta);
      }
      return {
        ...payload,
        status: 'hot-buffer-refresh-completed',
        refreshed: true,
        commitDelta: commitDelta && source?.returnCommitDelta === true
          ? cloneSerializableValue(commitDelta)
          : null
      };
    } catch (err) {
      let rejectedLease = null;
      if (lease?.leaseId) {
        try {
          rejectedLease = this.computeManager.rejectGpuResidentLaneLease(
            lease.leaseId,
            'remote-task-graph-hot-buffer-refresh-failed'
          );
        } catch {
          rejectedLease = null;
        }
      }
      return {
        ...base,
        status: 'hot-buffer-refresh-failed',
        reason: 'local-hot-buffer-refresh-executor-failed',
        errorCode: err?.code || null,
        errorMessage: err?.message || String(err),
        seedScope,
        seedTaskId,
        lease: cloneSerializableValue(lease),
        rejectedLease: cloneSerializableValue(rejectedLease)
      };
    }
  }

  admitTaskGraphCacheArtifact(cacheKeyOrArtifact, options = {}) {
    if (!this.stateManager?.admitTaskGraphCacheArtifact) {
      throw new Error('StateManager cache artifact admission is unavailable');
    }
    const artifact = cacheKeyOrArtifact && typeof cacheKeyOrArtifact === 'object'
      ? cacheKeyOrArtifact
      : this.computeManager?.getTaskGraphCacheArtifact?.(cacheKeyOrArtifact);
    if (!artifact) {
      throw new Error(`No task graph cache artifact found for ${String(cacheKeyOrArtifact || '').trim()}`);
    }
    const admission = this.stateManager.admitTaskGraphCacheArtifact(artifact, {
      authority: 'node-kernel-state-manager',
      sourceNodeId: this.nodeId,
      ...options
    });
    const computeArtifact = this.computeManager?.admitTaskGraphCacheArtifact?.(admission.cacheKey, admission) || null;
    return {
      ...admission,
      computeArtifactAdmitted: computeArtifact?.admitted === true,
      computeArtifactStatus: computeArtifact?.status || null
    };
  }

  invalidateTaskGraphCacheArtifact(cacheKeyOrArtifact, options = {}) {
    if (!this.stateManager?.invalidateTaskGraphCacheArtifact) {
      throw new Error('StateManager cache artifact invalidation is unavailable');
    }
    const invalidation = this.stateManager.invalidateTaskGraphCacheArtifact(cacheKeyOrArtifact, {
      authority: 'node-kernel-state-manager',
      sourceNodeId: this.nodeId,
      ...options
    });
    const computeArtifact = this.computeManager?.invalidateTaskGraphCacheArtifact?.(invalidation.cacheKey, invalidation) || null;
    return {
      ...invalidation,
      computeArtifactAdmitted: computeArtifact?.admitted === true,
      computeArtifactStatus: computeArtifact?.status || null
    };
  }

  getTaskGraphCacheArtifactAdmission(cacheKey) {
    return this.stateManager?.getTaskGraphCacheArtifactAdmission?.(cacheKey) || null;
  }

  listTaskGraphCacheArtifactAdmissions(options = {}) {
    return this.stateManager?.listTaskGraphCacheArtifactAdmissions?.(options) || [];
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

      case 'compute-task-graph':
        this._handleComputeTaskGraph(peerId, message.data);
        break;

      case 'compute-task-graph-result':
        this._handleComputeTaskGraphResult(peerId, message.data);
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

  async _handleComputeTaskGraph(peerId, data) {
    if (this.debugOutputEnabled) {
      console.log(`[NodeKernel] Remote task graph from ${peerId}`);
    }
    const request = data && typeof data === 'object' ? data : {};
    const requestId = request.requestId || `remote-task-graph-${Date.now()}`;
    const baseResponse = {
      schema: REMOTE_TASK_GRAPH_RESULT_SCHEMA,
      requestId,
      responderId: this.nodeId,
      responderPeerId: this.networkManager?.peerId || null,
      targetPeerId: peerId,
      completedAt: Date.now()
    };
    const sendResult = async (response) => {
      if (!this.networkManager?.sendToPeer) return;
      await this.networkManager.sendToPeer(peerId, {
        type: 'compute-task-graph-result',
        data: {
          ...baseResponse,
          ...response,
          completedAt: Date.now()
        }
      });
    };

    try {
      if (!this.config.enableRemoteTaskGraphResponder) {
        const err = new Error('Remote task graph responder is disabled');
        err.code = 'ERR_REMOTE_TASK_GRAPH_DISABLED';
        throw err;
      }
      if (!this.computeManager?.submitTaskGraph) {
        const err = new Error('ComputeManager task graph support is unavailable');
        err.code = 'ERR_REMOTE_TASK_GRAPH_UNAVAILABLE';
        throw err;
      }
      if (request.schema && request.schema !== REMOTE_TASK_GRAPH_REQUEST_SCHEMA) {
        const err = new Error(`Unsupported remote task graph request schema: ${request.schema}`);
        err.code = 'ERR_REMOTE_TASK_GRAPH_SCHEMA';
        throw err;
      }
      const graph = request.graph || request.taskGraph || request.payload || request;
      this._assertRemoteTaskGraphSafe(graph, {
        allowFunctions: this.config.allowRemoteFunctionTasks === true
      });
      const result = await this.computeManager.submitTaskGraph(graph);
      await sendResult({
        ok: true,
        result
      });
    } catch (err) {
      await sendResult({
        ok: false,
        error: {
          code: err?.code || 'ERR_REMOTE_TASK_GRAPH_FAILED',
          message: err?.message || String(err)
        }
      });
    }
  }

  _handleComputeTaskGraphResult(peerId, data = {}) {
    const response = data && typeof data === 'object' ? data : {};
    const requestId = String(response.requestId || '');
    if (!requestId) return;
    const pending = this.pendingRemoteTaskGraphRequests.get(requestId);
    if (!pending) return;
    this.pendingRemoteTaskGraphRequests.delete(requestId);
    clearTimeout(pending.timeoutId);
    if (pending.peerId && peerId && pending.peerId !== peerId) {
      const err = new Error(`Remote task graph result came from unexpected peer ${peerId}`);
      err.code = 'ERR_REMOTE_TASK_GRAPH_PEER_MISMATCH';
      err.requestId = requestId;
      pending.reject(err);
      return;
    }
    if (response.ok === false) {
      const err = new Error(response.error?.message || 'Remote task graph failed');
      err.code = response.error?.code || 'ERR_REMOTE_TASK_GRAPH_FAILED';
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
