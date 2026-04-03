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
        pubsubType: this.config.pubsubType,
        gossipsub: this.config.gossipsub,
        debugOutput: this.config.debugOutput,
        schedulerClock: this.config.clockPolicy.mode === 'kernel' ? 'external' : 'internal',
        schedulerProfile: this.config.clockPolicy.networkProfile,
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
      ts: Date.now()
    };
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

  /**
   * Get current node status
   * @returns {Object} Status information
   */
  getStatus() {
    const networkStats = this.networkManager?.getNetworkStats() || {};
    const stateStats = this.stateManager?.getStats() || {};
    
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
      
      // State status
      state: {
        keyCount: stateStats.keyCount,
        hasPersistence: stateStats.hasPersistence,
        hasP2PSync: stateStats.hasP2PSync
      },
      
      // Compute status
      compute: {
        enabled: true,
        available: !!this.computeManager
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
  async _handleComputeTask(peerId, task) {
    if (this.debugOutputEnabled) {
      console.log(`[NodeKernel] Compute task from ${peerId}: TODO`);
    }
    // TODO: Route to ComputeManager when implemented
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
