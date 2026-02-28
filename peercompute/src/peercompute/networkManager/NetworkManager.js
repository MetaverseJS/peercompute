/**
 * @fileoverview Network Manager - libp2p-based P2P networking
 * Provides pubsub broadcasts, presence discovery, and direct messaging over libp2p.
 */

import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { noise } from '@libp2p/noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { floodsub } from '@libp2p/floodsub';
import { gossipsub } from '@libp2p/gossipsub';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { bootstrap } from '@libp2p/bootstrap';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { peerIdFromString } from '@libp2p/peer-id';
import { generateKeyPair, privateKeyToProtobuf, publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { multiaddr } from '@multiformats/multiaddr';
import { NetworkScheduler, DEFAULT_SCHEDULER_PROFILE } from './NetworkScheduler.js';
import { TopologyController } from './TopologyController.js';

const DEFAULT_PUBSUB_TOPIC = 'peercompute-state-sync';
const DEFAULT_DIRECT_TOPIC = 'peercompute-direct';
const DEFAULT_PRESENCE_TOPIC = 'peercompute-presence';
const DEFAULT_TOPIC_PREFIX = 'pc';
const PEER_DIAL_THROTTLE_MS = 5000;
const DEFAULT_MAX_DIAL_PEERS = 16;
const REMEMBERED_DIAL_ADDR_TTL_MS = 10 * 60 * 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEBUG_P2P = typeof __PC_DEBUG__ !== 'undefined' && __PC_DEBUG__ === true;
const debugLog = (...args) => {
  if (DEBUG_P2P) console.log(...args);
};
const debugWarn = (...args) => {
  if (DEBUG_P2P) console.warn(...args);
};

const getByteLength = (data) => {
  if (!data) return 0;
  if (typeof data.byteLength === 'number') return data.byteLength;
  if (typeof data.length === 'number') return data.length;
  return 0;
};

const toAddrString = (addr) => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  if (typeof addr.toString === 'function') return addr.toString();
  return String(addr);
};

const isRelayAddr = (addr) => toAddrString(addr).includes('/p2p-circuit');
const isWebRTCAddr = (addr) => toAddrString(addr).includes('/webrtc');
const isRelayOnlyAddr = (addr) => isRelayAddr(addr) && !isWebRTCAddr(addr);
const isRelayWebRTCAddr = (addr) => isRelayAddr(addr) && isWebRTCAddr(addr);
const isTrulyDirectAddr = (addr) => !isRelayAddr(addr);
const isDirectAddr = (addr) => isTrulyDirectAddr(addr);
const getConnectionKind = (addr) => {
  if (isRelayWebRTCAddr(addr)) return 'relay-webrtc';
  if (isWebRTCAddr(addr)) return 'webrtc';
  if (isRelayAddr(addr)) return 'relay';
  return 'direct';
};
const normalizePeerVia = (via) => String(via || '').trim().toLowerCase();
const isDirectPeerVia = (via) => {
  const normalized = normalizePeerVia(via);
  return normalized === 'direct' || normalized === 'webrtc' || normalized === 'webrtc-direct';
};
const isRelayPeerVia = (via) => {
  const normalized = normalizePeerVia(via);
  return normalized === 'relay' || normalized === 'relay-webrtc' || normalized === 'webrtc-relay';
};
const getDialKind = (addr) => {
  if (isWebRTCAddr(addr) && isRelayAddr(addr)) return 'webrtc-relay';
  if (isWebRTCAddr(addr)) return 'webrtc-direct';
  if (isRelayAddr(addr)) return 'relay';
  return 'direct';
};
const formatDialTargets = (targets) => targets.map((addr) => {
  const addrStr = toAddrString(addr);
  return `${getDialKind(addrStr)}:${addrStr}`;
});
const isConnectionOpen = (conn) => {
  if (!conn) return false;
  if (typeof conn.status === 'string') return conn.status === 'open';
  const closed = conn?.stat?.timeline?.close || conn?.timeline?.close;
  if (closed) return false;
  return true;
};
const formatCloseReason = (err) => {
  if (!err) return 'unknown';
  const message = typeof err === 'string' ? err : err?.message || err?.toString?.() || '';
  if (!message) return 'unknown';
  if (message.toLowerCase().includes('timeout')) return `timeout (${message})`;
  return message;
};
const parseIceCandidate = (candidate) => {
  if (typeof candidate !== 'string') return null;
  const match = candidate.match(/candidate:\S+\s+\d+\s+(\w+)\s+\d+\s+([^\s]+)\s+(\d+)\s+typ\s+(\w+)/i);
  if (!match) return { type: 'unknown', protocol: '', address: '' };
  return {
    protocol: match[1].toLowerCase(),
    address: `${match[2]}:${match[3]}`,
    type: match[4].toLowerCase()
  };
};

const scoreDialTarget = (addr, preferIpv6) => {
  const value = toAddrString(addr);
  const hasRelay = value.includes('/p2p-circuit');
  const hasWebRTC = value.includes('/webrtc');
  const baseScore = hasWebRTC && !hasRelay
    ? 3
    : hasWebRTC
      ? 2
      : !hasRelay
        ? 1
        : 0;
  const ipv6Bonus = preferIpv6 && value.includes('/ip6/') ? 0.1 : 0;
  return baseScore + ipv6Bonus;
};

const orderDialTargets = (targets, preferIpv6 = false) => {
  const scored = targets.map((addr, index) => ({
    addr,
    score: scoreDialTarget(addr, preferIpv6),
    index
  }));
  scored.sort((a, b) => (b.score - a.score) || (a.index - b.index));
  return scored.map((entry) => entry.addr);
};

const expandScoreParamTopics = (options, topics) => {
  if (!options || typeof options !== 'object') return options;
  const scoreParams = options.scoreParams;
  if (!scoreParams || typeof scoreParams !== 'object') return options;
  const scoreTopics = scoreParams.topics;
  if (!scoreTopics || typeof scoreTopics !== 'object') return options;
  const defaultTopic = scoreTopics.__default;
  if (!defaultTopic || typeof defaultTopic !== 'object') return options;

  const expandedTopics = { ...scoreTopics };
  delete expandedTopics.__default;
  topics
    .filter((topic) => typeof topic === 'string' && topic.length > 0)
    .forEach((topic) => {
      if (!expandedTopics[topic]) {
        expandedTopics[topic] = { ...defaultTopic };
      }
    });

  return {
    ...options,
    scoreParams: {
      ...scoreParams,
      topics: expandedTopics
    }
  };
};

const normalizeIceServers = (input) => {
  if (!input) return [];
  const list = Array.isArray(input) ? input : [input];
  const servers = [];
  list.forEach((entry) => {
    if (!entry) return;
    if (typeof entry === 'string') {
      servers.push({ urls: entry });
      return;
    }
    if (typeof entry !== 'object') return;
    const rawUrls = entry.urls ?? entry.url;
    if (!rawUrls) return;
    const urls = Array.isArray(rawUrls)
      ? rawUrls.map((value) => String(value)).filter(Boolean)
      : [String(rawUrls)];
    if (urls.length === 0) return;
    const payload = { ...entry, urls: Array.isArray(rawUrls) ? urls : urls[0] };
    servers.push(payload);
  });
  return servers;
};

const normalizeRelayRetention = (input) => {
  if (!input) return null;
  if (input === true) {
    return { mode: 'logn', min: 1, max: null, base: 2 };
  }
  if (input === false) return null;
  if (typeof input !== 'object') return null;
  const rawMode = input.mode ?? input.strategy ?? 'logn';
  const mode = String(rawMode).trim().toLowerCase();
  if (mode === 'none' || mode === 'off' || mode === 'disabled') return null;
  if (mode !== 'logn' && mode !== 'log(n)' && mode !== 'sqrt') return null;
  const min = Number.isFinite(input.min) ? Math.max(0, input.min) : 1;
  const max = Number.isFinite(input.max) ? Math.max(min, input.max) : null;
  const base = Number.isFinite(input.base) ? Math.max(2, input.base) : 2;
  const normalizedMode = mode === 'log(n)' ? 'logn' : mode;
  return { mode: normalizedMode, min, max, base };
};

const normalizeWebRTCConfig = (config = {}) => {
  const raw = config && typeof config.webrtc === 'object' && config.webrtc ? config.webrtc : {};
  const preferDirect = raw.preferDirect ?? config.preferDirect ?? true;
  const dropRelayOnDirect = raw.dropRelayOnDirect ?? config.dropRelayOnDirect ?? true;
  const dropRelayBootstrapOnDirect =
    raw.dropRelayBootstrapOnDirect ?? config.dropRelayBootstrapOnDirect ?? false;
  const relayRetention = normalizeRelayRetention(
    raw.relayRetention ?? config.relayRetention
  );
  // Phase 4: Reconnect-on-demand config
  const reconnectOnDialFailure = raw.reconnectOnDialFailure ?? config.reconnectOnDialFailure ?? true;
  const reconnectThrottleMs = Number.isFinite(raw.reconnectThrottleMs)
    ? Math.max(5000, raw.reconnectThrottleMs)
    : (Number.isFinite(config.reconnectThrottleMs) ? Math.max(5000, config.reconnectThrottleMs) : 30000);
  const autoDropRelayAfterDialMs = Number.isFinite(raw.autoDropRelayAfterDialMs)
    ? Math.max(0, raw.autoDropRelayAfterDialMs)
    : (Number.isFinite(config.autoDropRelayAfterDialMs) ? Math.max(0, config.autoDropRelayAfterDialMs) : 60000);
  const iceServers = normalizeIceServers(
    raw.iceServers ?? config.iceServers ?? config.webrtcIceServers
  );
  const baseRtc = raw.rtcConfiguration ?? config.rtcConfiguration ?? {};
  const rtcConfiguration = (baseRtc && typeof baseRtc === 'object') ? { ...baseRtc } : {};
  if (iceServers.length > 0) {
    rtcConfiguration.iceServers = iceServers;
  }
  return {
    ...raw,
    preferDirect,
    dropRelayOnDirect,
    dropRelayBootstrapOnDirect,
    relayRetention,
    reconnectOnDialFailure,
    reconnectThrottleMs,
    autoDropRelayAfterDialMs,
    iceServers,
    rtcConfiguration
  };
};

const isLocalDialAddr = (addr) => {
  if (typeof addr !== 'string') return false;
  if (addr.includes('/dns4/localhost') || addr.includes('/dns/localhost')) return true;
  if (addr.includes('/ip6/::1')) return true;
  if (addr.includes('/ip4/127.')) return true;
  if (addr.includes('/ip4/10.')) return true;
  if (addr.includes('/ip4/192.168.')) return true;
  return /\/ip4\/172\.(1[6-9]|2\d|3[01])\./.test(addr);
};

const normalizeBootstrapAddr = (addr) => {
  if (typeof addr !== 'string') return addr;
  const parts = addr.split('/p2p/');
  if (parts.length <= 2) return addr;
  const peerId = parts[parts.length - 1];
  return `${parts[0]}/p2p/${peerId}`;
};

const getPeerIdFromAddr = (addr) => {
  if (typeof addr !== 'string') return null;
  const parts = addr.split('/p2p/');
  if (parts.length < 2) return null;
  return parts[parts.length - 1] || null;
};

const toPeerMultiaddr = (addr) => {
  if (!addr) return null;
  if (typeof addr.getComponents === 'function') return addr;
  if (typeof addr !== 'string') return null;
  try {
    return multiaddr(addr);
  } catch (err) {
    debugWarn('[NetworkManager] Invalid peer multiaddr', addr, err?.message || err);
    return null;
  }
};

const toMultiaddr = (addr) => {
  if (!addr) return null;
  if (typeof addr.getComponents === 'function') return addr;
  if (typeof addr !== 'string') return null;
  const normalized = normalizeBootstrapAddr(addr);
  try {
    return multiaddr(normalized);
  } catch (err) {
    debugWarn('[NetworkManager] Invalid bootstrap multiaddr', normalized, err?.message || err);
    return null;
  }
};

const ensurePeerIdSuffix = (addr, peerId) => {
  if (!peerId || typeof addr !== 'string') return addr;
  const suffix = `/p2p/${peerId}`;
  if (addr.includes(suffix)) return addr;
  return `${addr}${suffix}`;
};

const buildScopedTopic = (prefix, topologyId, roomId, suffix) => {
  const scope = [prefix, topologyId, roomId].filter(Boolean).join('.');
  return `${scope}.${suffix}`;
};

const normalizeTopicList = (input) => {
  if (!input) return [];
  const list = Array.isArray(input) ? input : [input];
  const normalized = list
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  return Array.from(new Set(normalized));
};


export class NetworkManager {
  constructor(config = {}) {
    const webrtcConfig = normalizeWebRTCConfig(config);
    const telemetrySampleMs = Number.isFinite(config.telemetrySampleMs)
      ? Math.max(250, config.telemetrySampleMs)
      : 1000;
    const telemetryPingMs = Number.isFinite(config.telemetryPingMs)
      ? Math.max(500, config.telemetryPingMs)
      : 5000;
    const presenceIntervalMs = Number.isFinite(config.presenceIntervalMs)
      ? Math.max(1000, config.presenceIntervalMs)
      : 3000;
    const maxConnections = Number.isFinite(config.maxConnections)
      ? Math.max(1, config.maxConnections)
      : 200;
    const maxIncomingPendingConnections = Number.isFinite(config.maxIncomingPendingConnections)
      ? Math.max(1, config.maxIncomingPendingConnections)
      : 100;
    const maxParallelDials = Number.isFinite(config.maxParallelDials)
      ? Math.max(1, config.maxParallelDials)
      : undefined;
    const maxDialQueueLength = Number.isFinite(config.maxDialQueueLength)
      ? Math.max(1, config.maxDialQueueLength)
      : undefined;
    const maxPeerAddrsToDial = Number.isFinite(config.maxPeerAddrsToDial)
      ? Math.max(1, config.maxPeerAddrsToDial)
      : undefined;
    const dialTimeoutMs = Number.isFinite(config.dialTimeoutMs)
      ? Math.max(1000, config.dialTimeoutMs)
      : Number.isFinite(config.dialTimeout)
        ? Math.max(1000, config.dialTimeout)
        : undefined;
    const maxDialPeers = (() => {
      const value = config.maxDialPeers;
      if (value === null || value === Infinity) return null;
      if (Number.isFinite(value)) return Math.max(0, value);
      return DEFAULT_MAX_DIAL_PEERS;
    })();
    const bootstrapDialThrottleMs = Number.isFinite(config.bootstrapDialThrottleMs)
      ? Math.max(0, config.bootstrapDialThrottleMs)
      : PEER_DIAL_THROTTLE_MS;
    const rawPubsubType = typeof config.pubsubType === 'string'
      ? config.pubsubType
      : typeof config.pubsub === 'string'
        ? config.pubsub
        : '';
    const pubsubType = String(rawPubsubType || 'floodsub').trim().toLowerCase() === 'gossipsub'
      ? 'gossipsub'
      : 'floodsub';
    const gossipsubOptions = config.gossipsub && typeof config.gossipsub === 'object'
      ? { ...config.gossipsub }
      : null;
    const pubsubPeerDiscovery =
      config.pubsubPeerDiscovery ??
      config.enablePubsubPeerDiscovery ??
      undefined;

    const topologyType = config.topologyType || config.topology || 'distributed';
    const topologyId = config.topologyId || config.topologyKey || config.topologyName || config.gameId || 'default-topology';
    const roomId = config.roomId || 'default-room';
    const topicPrefix = config.topicPrefix || config.topicBase || DEFAULT_TOPIC_PREFIX;
    const useScopedTopics = config.useScopedTopics !== false;
    const scopedPubsubTopic = buildScopedTopic(topicPrefix, topologyId, roomId, 'state');
    const scopedDirectTopic = buildScopedTopic(topicPrefix, topologyId, roomId, 'direct');
    const scopedPresenceTopic = buildScopedTopic(topicPrefix, topologyId, roomId, 'presence');
    const discoveryTopic = config.discoveryTopic || 'peercompute._peer-discovery._p2p._pubsub';
    const additionalPubsubTopics = normalizeTopicList(config.additionalPubsubTopics);
    const expandedGossipsubOptions = expandScoreParamTopics(gossipsubOptions, [
      config.pubsubTopic || (useScopedTopics ? scopedPubsubTopic : DEFAULT_PUBSUB_TOPIC),
      config.directTopic || (useScopedTopics ? scopedDirectTopic : DEFAULT_DIRECT_TOPIC),
      config.presenceTopic || (useScopedTopics ? scopedPresenceTopic : DEFAULT_PRESENCE_TOPIC),
      discoveryTopic,
      ...additionalPubsubTopics
    ]);

    const defaults = {
      topology: topologyType,
      topologyId,
      topicPrefix,
      useScopedTopics,
      pubsubTopic: config.pubsubTopic || (useScopedTopics ? scopedPubsubTopic : DEFAULT_PUBSUB_TOPIC),
      directTopic: config.directTopic || (useScopedTopics ? scopedDirectTopic : DEFAULT_DIRECT_TOPIC),
      presenceTopic: config.presenceTopic || (useScopedTopics ? scopedPresenceTopic : DEFAULT_PRESENCE_TOPIC),
      additionalPubsubTopics,
      discoveryTopic,
      bootstrapPeers: Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers : [],
      gameId: config.gameId || 'default-game',
      roomId,
      enforceRoomIsolation: config.enforceRoomIsolation !== false,
      allowDiscoveryDialWhenIsolated: config.allowDiscoveryDialWhenIsolated === true,
      enforceTopologyScope: config.enforceTopologyScope !== false,
      enableTelemetry: config.enableTelemetry !== false,
      enableTopologyController: config.enableTopologyController !== false,
      enableRelayDirectPeers: config.enableRelayDirectPeers !== false,
      topologyTickMs: Number.isFinite(config.topologyTickMs) ? Math.max(250, config.topologyTickMs) : 1500,
      targetConnections: Number.isFinite(config.targetConnections)
        ? Math.max(1, config.targetConnections)
        : Math.min(maxConnections, 4),
      connectionRadius: Number.isFinite(config.connectionRadius)
        ? Math.max(0, config.connectionRadius)
        : 6,
      isolationMinConnections: Number.isFinite(config.isolationMinConnections)
        ? Math.max(1, config.isolationMinConnections)
        : 2,
      longRangeCount: Number.isFinite(config.longRangeCount) ? Math.max(0, config.longRangeCount) : 1,
      longRangeRefreshMs: Number.isFinite(config.longRangeRefreshMs)
        ? Math.max(1000, config.longRangeRefreshMs)
        : 15000,
      enableSharding: config.enableSharding === true,
      shardSize: Number.isFinite(config.shardSize) ? Math.max(1, config.shardSize) : 8,
      shardRadius: Number.isFinite(config.shardRadius) ? Math.max(0, config.shardRadius) : 1,
      webrtc: webrtcConfig,
      telemetrySampleMs,
      telemetryPingMs,
      presenceIntervalMs,
      maxConnections,
      maxIncomingPendingConnections,
      maxParallelDials,
      maxDialQueueLength,
      maxPeerAddrsToDial,
      dialTimeoutMs,
      maxDialPeers,
      bootstrapDialThrottleMs,
      pubsubType,
      gossipsub: expandedGossipsubOptions,
      pubsubPeerDiscovery,
      // Phase 5: Peer directory config
      enablePeerDirectory: config.enablePeerDirectory !== false,
      directoryTopic: config.directoryTopic || 'peercompute-directory',
      directoryQueryTimeoutMs: Number.isFinite(config.directoryQueryTimeoutMs)
        ? Math.max(1000, config.directoryQueryTimeoutMs)
        : 5000,
      onPublishError: typeof config.onPublishError === 'function' ? config.onPublishError : null,
      onPublishSuccess: typeof config.onPublishSuccess === 'function' ? config.onPublishSuccess : null
    };

    const normalizedBootstrapPeers = defaults.bootstrapPeers.map((addr) =>
      typeof addr === 'string' ? normalizeBootstrapAddr(addr) : addr
    );
    const allowLocalDial = config.allowLocalDial ?? normalizedBootstrapPeers.some(isLocalDialAddr);
    const definedConfig = Object.fromEntries(
      Object.entries(config).filter(([, value]) => value !== undefined)
    );
    this.config = {
      ...defaults,
      ...definedConfig,
      additionalPubsubTopics: normalizeTopicList(
        definedConfig.additionalPubsubTopics ?? defaults.additionalPubsubTopics
      ),
      bootstrapPeers: normalizedBootstrapPeers,
      allowLocalDial,
      webrtc: webrtcConfig
    };
    this.bootstrapPeerIds = new Set(
      normalizedBootstrapPeers.map(getPeerIdFromAddr).filter(Boolean)
    );

    this.libp2p = null;
    this.peerId = null;
    this.isConnected = false;
    this.joinedAt = null;
    this.presenceInterval = null;
    this.publishErrorAt = new Map();
    this.pubsubStreamErrorAt = new Map();
    this.lastBootstrapDialAt = 0;
    this.isolationReconnectTimer = null;
    this.lastWebrtcAnnounceWarnAt = 0;
    this.relayTransport = null;
    this.relayReservationPeers = new Set();
    this.peerDialAddrCache = new Map();

    this.peers = new Map();
    this.recentDialAttempts = new Map();
    // Phase 4: Relay reconnect-on-demand state
    this.relayReconnectState = {
      lastReconnectAt: 0,
      pendingDialsNeedingRelay: new Set(),
      autoDisconnectTimer: null
    };
    // Phase 5: Peer directory query state
    this.pendingDirectoryQueries = new Map();
    this.telemetry = {
      rxCount: 0,
      txCount: 0,
      rxBytes: 0,
      txBytes: 0,
      rxBps: 0,
      txBps: 0,
      pubsubRxCount: 0,
      pubsubTxCount: 0,
      pubsubRxBytes: 0,
      pubsubTxBytes: 0,
      pubsubLastRxAt: 0,
      pubsubLastTxAt: 0
    };
    this.telemetrySample = {
      rxBytes: 0,
      txBytes: 0,
      at: 0
    };
    this.telemetryTimer = null;
    this.onMessage = config.onMessage || (() => {});
    this.onPeerConnect = config.onPeerConnect || (() => {});
    this.onPeerDisconnect = config.onPeerDisconnect || (() => {});
    this.onConnectionFailure = typeof config.onConnectionFailure === 'function'
      ? config.onConnectionFailure
      : null;
    this.messageHandlers = [];
    this.additionalPubsubTopics = new Set(this.config.additionalPubsubTopics || []);
    this.scheduler = null;
    this.schedulerTimer = null;
    this.schedulerEnabled = config.enableScheduler || false;
    this.schedulerClock = config.schedulerClock || 'internal';
    this.schedulerProfile = {
      ...DEFAULT_SCHEDULER_PROFILE,
      ...(config.schedulerProfile || {})
    };
    this.authorityId = config.authorityId || null;
    this.lastRxAt = 0;
    this.lastTxAt = 0;
    this.allowedTopics = new Set([
      this.config.pubsubTopic,
      this.config.directTopic,
      this.config.presenceTopic
    ]);
    this.additionalPubsubTopics.forEach((topic) => this.allowedTopics.add(topic));
    // Phase 5: Add directory topic to allowed topics
    if (this.config.enablePeerDirectory) {
      this.allowedTopics.add(this.config.directoryTopic);
    }
    [this.schedulerProfile.snapshotTopic, this.schedulerProfile.commandTopic, this.schedulerProfile.eventTopic]
      .filter(Boolean)
      .forEach((topic) => this.allowedTopics.add(topic));

    const metricConfigured = config.topologyMetric !== undefined || config.metric !== undefined;
    const initialMetric = config.topologyMetric || config.metric || null;
    this.topologyMetric = initialMetric && typeof initialMetric === 'object'
      ? { x: initialMetric.x || 0, y: initialMetric.y || 0, z: initialMetric.z || 0 }
      : { x: 0, y: 0, z: 0 };
    this.metricInitialized = config.topologyMetricInitialized ?? config.metricInitialized ?? metricConfigured;
    this.topologyShardId = null;
    this.shardTopics = new Set();
    this.pendingTopologyRequests = new Map();
    this.publishBlockedUntil = new Map();
    this.topologyController = this.config.enableTopologyController
      ? new TopologyController({
        topologyId: this.config.topologyId,
        topologyType: this.config.topology,
        targetConnections: this.config.targetConnections,
        maxConnections: this.config.maxConnections,
        connectionRadius: this.config.connectionRadius,
        isolationMinConnections: this.config.isolationMinConnections,
        longRangeCount: this.config.longRangeCount,
        longRangeRefreshMs: this.config.longRangeRefreshMs,
        shardSize: this.config.shardSize,
        shardRadius: this.config.shardRadius,
        enforceTopologyScope: this.config.enforceTopologyScope,
        metric: this.topologyMetric
      })
      : null;
    this.topologyTimer = null;
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  configureScheduler(profile = {}) {
    this.schedulerProfile = {
      ...this.schedulerProfile,
      ...profile
    };
    [this.schedulerProfile.snapshotTopic, this.schedulerProfile.commandTopic, this.schedulerProfile.eventTopic]
      .filter(Boolean)
      .forEach((topic) => this.allowedTopics.add(topic));
    this.schedulerEnabled = true;
    this._ensureScheduler();
    this.scheduler.configure(this.schedulerProfile);
    this._startScheduler();
  }

  setSchedulerClock(mode = 'internal') {
    const next = mode === 'external' ? 'external' : 'internal';
    if (this.schedulerClock === next) return;
    this.schedulerClock = next;
    if (next === 'external') {
      this._stopScheduler();
      return;
    }
    if (this.schedulerEnabled && this.isConnected) {
      this._startScheduler();
    }
  }

  getSchedulerClock() {
    return this.schedulerClock;
  }

  tickScheduler(now = Date.now()) {
    if (!this.scheduler || !this.schedulerEnabled) return;
    this.scheduler.tick(now);
  }

  getSchedulerProfile() {
    return this.scheduler ? this.scheduler.getProfile() : { ...this.schedulerProfile };
  }

  registerStateProvider(fn, options = {}) {
    this._ensureScheduler();
    this.schedulerEnabled = true;
    this._startScheduler();
    return this.scheduler.registerStateProvider(fn, options);
  }

  registerWarmDeltaProvider(fn, options = {}) {
    const id = options.id || 'warm-deltas';
    return this.registerStateProvider(() => fn(), { ...options, id });
  }

  registerCommandProvider(fn, options = {}) {
    this._ensureScheduler();
    this.schedulerEnabled = true;
    this._startScheduler();
    return this.scheduler.registerCommandProvider(fn, options);
  }

  unregisterStateProvider(id) {
    this.scheduler?.unregisterStateProvider(id);
  }

  unregisterCommandProvider(id) {
    this.scheduler?.unregisterCommandProvider(id);
  }

  markStateDirty() {
    this.scheduler?.markStateDirty();
  }

  queueEvent(payload, options = {}) {
    this._ensureScheduler();
    this.schedulerEnabled = true;
    this._startScheduler();
    const hasReliabilityFlag =
      Object.prototype.hasOwnProperty.call(options, 'reliable') ||
      Object.prototype.hasOwnProperty.call(options, 'critical');
    let nextOptions = options;
    if (!hasReliabilityFlag && payload?.type) {
      const profile = this.scheduler?.getProfile?.() || this.schedulerProfile;
      if (Array.isArray(profile.reliableEventTypes) && profile.reliableEventTypes.includes(payload.type)) {
        nextOptions = { ...options, reliable: true };
      }
    }
    this.scheduler.queueEvent(payload, nextOptions);
  }

  addSnapshotHandler(handler) {
    this._ensureScheduler();
    this.scheduler.addSnapshotHandler(handler);
  }

  addCommandHandler(handler) {
    this._ensureScheduler();
    this.scheduler.addCommandHandler(handler);
  }

  addEventHandler(handler) {
    this._ensureScheduler();
    this.scheduler.addEventHandler(handler);
  }

  setAuthority(peerId) {
    this.authorityId = peerId || null;
    if (this.scheduler) {
      this.scheduler.setAuthority(this.authorityId);
    }
  }

  getAuthority() {
    return this.authorityId;
  }

  getHealth() {
    const reliability = this.scheduler?.getReliabilityStats?.();
    return {
      lastRxAt: this.lastRxAt,
      lastTxAt: this.lastTxAt,
      peerCount: this.getConnectedPeers().length,
      pubsubPeers: this.libp2p?.services?.pubsub?.getPeers?.() || [],
      reliability
    };
  }

  async initialize() {
    const isBrowser = typeof window !== 'undefined';
    const listenAddrs = isBrowser ? ['/p2p-circuit', '/webrtc'] : ['/ip4/0.0.0.0/tcp/0'];
    const useGossipsub = this.config.pubsubType === 'gossipsub';
    const peerDiscovery = [];

    if (this.config.bootstrapPeers?.length) {
      peerDiscovery.push(bootstrap({ list: this.config.bootstrapPeers }));
    }

    if (this.config.pubsubPeerDiscovery !== false) {
      peerDiscovery.push(pubsubPeerDiscovery({
        interval: 1000,
        topics: [this.config.discoveryTopic]
      }));
    }

    const rtcConfiguration = this.config.webrtc?.rtcConfiguration || {};
    const webRtcTransport = Object.keys(rtcConfiguration).length > 0
      ? webRTC({ rtcConfiguration })
      : webRTC();
    const relayTransport = circuitRelayTransport();
    this.relayTransport = relayTransport;
    const privateKey = useGossipsub ? await generateKeyPair('Ed25519') : null;

    const connectionManagerConfig = {
      minConnections: 0,
      maxConnections: this.config.maxConnections ?? 200,
      inboundConnectionThreshold: Infinity,
      maxIncomingPendingConnections: this.config.maxIncomingPendingConnections ?? 100
    };
    if (Number.isFinite(this.config.maxParallelDials)) {
      connectionManagerConfig.maxParallelDials = Math.max(1, this.config.maxParallelDials);
    }
    if (Number.isFinite(this.config.maxDialQueueLength)) {
      connectionManagerConfig.maxDialQueueLength = Math.max(1, this.config.maxDialQueueLength);
    }
    if (Number.isFinite(this.config.maxPeerAddrsToDial)) {
      connectionManagerConfig.maxPeerAddrsToDial = Math.max(1, this.config.maxPeerAddrsToDial);
    }
    const dialTimeoutMs = Number.isFinite(this.config.dialTimeoutMs)
      ? Math.max(1000, this.config.dialTimeoutMs)
      : Number.isFinite(this.config.dialTimeout)
        ? Math.max(1000, this.config.dialTimeout)
        : null;
    if (dialTimeoutMs) {
      connectionManagerConfig.dialTimeout = dialTimeoutMs;
    }

    try {
      this.libp2p = await createLibp2p({
        ...(privateKey ? { privateKey } : {}),
        transports: [
          webSockets(),
          webRtcTransport,
          relayTransport
        ],
        connectionEncrypters: [noise(), plaintext()],
        streamMuxers: [yamux()],
        peerDiscovery,
        services: {
          identify: identify(),
          ping: ping({ interval: 10000 }),
          pubsub: this._buildPubsubService()
        },
        connectionManager: connectionManagerConfig,
        connectionMonitor: {
          abortConnectionOnPingFailure: false
        },
        addresses: {
          listen: listenAddrs
        },
        start: false,
        ...(this.config.allowLocalDial
          ? {
              connectionGater: {
                denyDialMultiaddr: () => false
              }
            }
          : {})
      });
    } catch (err) {
      this._emitConnectionFailure({
        source: 'libp2p',
        stage: 'init',
        error: err
      });
      debugWarn('[NetworkManager] Libp2p init failed', err?.message || err);
      throw err;
    }
    if (privateKey && this.libp2p?.peerId) {
      this.libp2p.peerId.privateKey = privateKeyToProtobuf(privateKey);
      this.libp2p.peerId.publicKey = publicKeyToProtobuf(privateKey.publicKey);
    }

    this._wireLibp2pEvents();
    this._patchGossipsubOutboundStreams();
    this._refreshRelayTransport();
    return this.libp2p;
  }

  async connect() {
    if (this.isConnected) return;
    if (!this.libp2p) {
      throw new Error('NetworkManager not initialized');
    }

    try {
      await this.libp2p.start();
    } catch (err) {
      this._emitConnectionFailure({
        source: 'libp2p',
        stage: 'start',
        error: err
      });
      debugWarn('[NetworkManager] Libp2p start failed', err?.message || err);
      throw err;
    }
    this._refreshRelayTransport();
    this.peerId = this.libp2p.peerId.toString();
    if (!this.joinedAt) {
      this.joinedAt = Date.now();
    }
    if (this.topologyController) {
      this.topologyController.setPeerId(this.peerId);
    }
    this._updateShardState(true);

    // Subscribe to topics used by PeerCompute
    const subscribeTopic = (topic) => {
      try {
        this.libp2p.services.pubsub.subscribe(topic);
      } catch (err) {
        this._emitConnectionFailure({
          source: 'pubsub',
          stage: 'subscribe',
          address: topic,
          error: err
        });
        debugWarn('[NetworkManager] Pubsub subscribe failed', topic, err?.message || err);
      }
    };
    subscribeTopic(this.config.pubsubTopic);
    subscribeTopic(this.config.directTopic);
    subscribeTopic(this.config.presenceTopic);
    this.additionalPubsubTopics.forEach((topic) => subscribeTopic(topic));
    this._syncShardSubscriptions(this.topologyController?.getNeighborShardIds?.() || []);
    this._recordPubsubTx(0);

    await this._dialBootstrapPeers();
    await this._reserveBootstrapRelayAddrs();
    await this._logLocalAnnounceAddrs('post-bootstrap');
    setTimeout(() => {
      this._logLocalAnnounceAddrs('post-bootstrap+2s').catch(() => {});
    }, 2000);

    this._startPresence();
    this._logPubsubStatus('connected');
    this.isConnected = true;
    this._sampleTelemetry(Date.now());
    this._startTelemetrySampler();
    if (this.schedulerEnabled) {
      this._ensureScheduler();
      this._startScheduler();
    }
    this._startTopologyController();
  }

  _refreshRelayTransport() {
    const transportManager = this.libp2p?.components?.transportManager;
    if (!transportManager?.getTransports) return;
    const rawTransports = transportManager.getTransports();
    const transportList = Array.isArray(rawTransports)
      ? rawTransports
      : rawTransports?.values
        ? Array.from(rawTransports.values())
        : [];
    const normalized = transportList
      .map((entry) => entry?.transport || entry)
      .filter(Boolean);
    const relayTransport = normalized.find((transport) => {
      if (transport?.reservationStore) return true;
      if (transport?.[Symbol.toStringTag] === '@libp2p/circuit-relay-v2-transport') return true;
      return false;
    });
    if (relayTransport) {
      this.relayTransport = relayTransport;
    }
  }

  async redialBootstrapPeers() {
    if (!this.libp2p) return;
    await this._dialBootstrapPeers();
    await this._reserveBootstrapRelayAddrs();
    await this._logLocalAnnounceAddrs('redial-bootstrap');
  }

  async disconnect() {
    this.isConnected = false;
    this._stopScheduler();
    this._clearPresenceTimer();
    if (this.isolationReconnectTimer) {
      clearTimeout(this.isolationReconnectTimer);
      this.isolationReconnectTimer = null;
    }
    this._stopTelemetrySampler();
    this._stopTopologyController();

    if (this.libp2p) {
      await this.libp2p.stop();
    }

    this.peers.clear();
    this.peerId = null;
  }

  async sendToPeer(peerId, message) {
    const payload = this._wrapPayload(message, { target: peerId });
    await this._publish(this.config.directTopic, payload);
  }

  async broadcast(message, options = {}) {
    const topic = options.topic || this.config.pubsubTopic;
    const payload = this._wrapPayload(message);
    await this._publish(topic, payload);
  }

  setTopologyMetric(metric) {
    if (!metric || typeof metric !== 'object') return;
    const next = {
      x: Number.isFinite(metric.x) ? metric.x : 0,
      y: Number.isFinite(metric.y) ? metric.y : 0,
      z: Number.isFinite(metric.z) ? metric.z : 0
    };
    this.topologyMetric = next;
    this.metricInitialized = true;
    if (this.topologyController) {
      this.topologyController.setLocalMetric(next);
    }
    this._updateShardState(true);
    this._publishPresenceNow().catch(() => {});
  }

  setConnectionLimits({ targetConnections, maxConnections } = {}) {
    const nextTarget = Number.isFinite(targetConnections)
      ? Math.max(1, targetConnections)
      : this.config.targetConnections;
    const nextMax = Number.isFinite(maxConnections)
      ? Math.max(1, maxConnections)
      : this.config.maxConnections;
    const changed = nextTarget !== this.config.targetConnections || nextMax !== this.config.maxConnections;
    this.config.targetConnections = nextTarget;
    this.config.maxConnections = nextMax;
    const connectionManager =
      this.libp2p?.services?.connectionManager || this.libp2p?.connectionManager;
    if (connectionManager) {
      try {
        if (typeof connectionManager.setMaxConnections === 'function') {
          connectionManager.setMaxConnections(nextMax);
        } else if (typeof connectionManager.maxConnections === 'number') {
          connectionManager.maxConnections = nextMax;
        }
      } catch (err) {
        debugWarn('[NetworkManager] Failed to update connection manager limits', err?.message || err);
      }
    }
    if (this.topologyController?.setConnectionLimits) {
      this.topologyController.setConnectionLimits({
        targetConnections: nextTarget,
        maxConnections: nextMax
      });
    }
    if (changed) {
      this._publishPresenceNow().catch(() => {});
    }
  }

  setPriorityPeers(peerIds = []) {
    if (this.topologyController?.setPriorityPeers) {
      this.topologyController.setPriorityPeers(peerIds);
    }
  }

  setRelayBootstrapBehavior({ keepRelay } = {}) {
    if (typeof keepRelay !== 'boolean') return;
    if (!this.config.webrtc || typeof this.config.webrtc !== 'object') {
      this.config.webrtc = {};
    }
    const dropRelayBootstrapOnDirect = !keepRelay;
    this.config.webrtc.dropRelayBootstrapOnDirect = dropRelayBootstrapOnDirect;
    this._maybeUpdateBootstrapRelayConnections();
  }

  getTopologyStatus() {
    return {
      topologyId: this.config.topologyId,
      topologyType: this.config.topology,
      shardId: this.topologyShardId,
      metric: { ...this.topologyMetric },
      targetConnections: this.config.targetConnections,
      maxConnections: this.config.maxConnections
    };
  }

  getConnectedPeers() {
    const connectionPeers = this._getConnectionPeers();
    const scopedPeers = this._getScopedPeers();
    const merged = new Map();
    connectionPeers.forEach((peer) => merged.set(peer.peerId, peer));
    scopedPeers.forEach((peer) => {
      const existing = merged.get(peer.peerId) || {};
      merged.set(peer.peerId, { ...existing, ...peer });
    });
    return Array.from(merged.values());
  }

  _getConnectionManager() {
    return this.libp2p?.services?.connectionManager
      || this.libp2p?.components?.connectionManager
      || this.libp2p?.connectionManager
      || null;
  }

  _getConnectionManagerStats() {
    const connectionManager = this._getConnectionManager();
    if (!connectionManager) return null;
    const dialQueue = connectionManager?.dialQueue?.queue || null;
    const maxConnections = typeof connectionManager.getMaxConnections === 'function'
      ? connectionManager.getMaxConnections()
      : Number.isFinite(connectionManager.maxConnections)
        ? connectionManager.maxConnections
        : null;
    return {
      maxConnections,
      maxIncomingPendingConnections: Number.isFinite(connectionManager.maxIncomingPendingConnections)
        ? connectionManager.maxIncomingPendingConnections
        : null,
      incomingPendingConnections: Number.isFinite(connectionManager.incomingPendingConnections)
        ? connectionManager.incomingPendingConnections
        : null,
      outboundPendingConnections: Number.isFinite(connectionManager.outboundPendingConnections)
        ? connectionManager.outboundPendingConnections
        : null,
      dialQueue: dialQueue
        ? {
            size: Number.isFinite(dialQueue.size) ? dialQueue.size : null,
            running: Number.isFinite(dialQueue.running) ? dialQueue.running : null,
            queued: Number.isFinite(dialQueue.queued) ? dialQueue.queued : null,
            concurrency: Number.isFinite(dialQueue.concurrency) ? dialQueue.concurrency : null,
            maxSize: Number.isFinite(dialQueue.maxSize) ? dialQueue.maxSize : null
          }
        : null
    };
  }

  getNetworkStats() {
    const connectionPeers = this._getConnectionPeers();
    const connections = this.libp2p?.getConnections?.() || [];
    const connectionCount = Array.isArray(connections)
      ? connections.length
      : typeof connections.size === 'number'
        ? connections.size
        : 0;
    return {
      peerId: this.peerId,
      peerCount: connectionPeers.length,
      isConnected: this.isConnected,
      topology: this.config.topology,
      topologyId: this.config.topologyId,
      shardId: this.topologyShardId,
      metric: { ...this.topologyMetric },
      connections: connectionCount,
      targetConnections: this.config.targetConnections,
      maxConnections: this.config.maxConnections,
      connectionManager: this._getConnectionManagerStats()
    };
  }

  getTelemetrySnapshot() {
    const now = Date.now();
    const networkStats = this.getNetworkStats();
    const health = this.getHealth();
      const peers = this.getConnectedPeers().map((peer) => ({
      peerId: peer.peerId,
      connectedAt: peer.connectedAt || null,
      joinedAt: peer.joinedAt || null,
      lastSeen: peer.lastSeen || null,
      lastMessageTime: peer.lastMessageTime || null,
      lastRxAt: peer.lastRxAt || null,
      lastTxAt: peer.lastTxAt || null,
      lastRttAt: peer.lastRttAt || null,
      rttMs: Number.isFinite(peer.rttMs) ? peer.rttMs : null,
      via: peer.via || null,
      topologyId: peer.topologyId || null,
      shardId: peer.shardId || null,
      metric: peer.metric || null,
      metricInitialized: peer.metricInitialized ?? null,
      targetConnections: peer.targetConnections || null,
      maxConnections: peer.maxConnections || null,
      activeConnections: peer.activeConnections || null,
      rxCount: peer.rxCount || 0,
      txCount: peer.txCount || 0,
      rxBytes: peer.rxBytes || 0,
      txBytes: peer.txBytes || 0,
      rxBps: peer.rxBps || 0,
      txBps: peer.txBps || 0
    }));

    return {
      ts: now,
      peerId: this.peerId,
      gameId: this.config.gameId,
      roomId: this.config.roomId,
      topology: this.config.topology,
      topologyId: this.config.topologyId,
      shardId: this.topologyShardId,
      metric: { ...this.topologyMetric },
      metricInitialized: this.metricInitialized,
      isConnected: this.isConnected,
      peerCount: networkStats.peerCount,
      connections: networkStats.connections,
      lastRxAt: health.lastRxAt,
      lastTxAt: health.lastTxAt,
      counts: {
        rx: this.telemetry.rxCount,
        tx: this.telemetry.txCount,
        rxBytes: this.telemetry.rxBytes,
        txBytes: this.telemetry.txBytes
      },
      rates: {
        rxBps: this.telemetry.rxBps,
        txBps: this.telemetry.txBps
      },
      pubsub: {
        rxCount: this.telemetry.pubsubRxCount,
        txCount: this.telemetry.pubsubTxCount,
        rxBytes: this.telemetry.pubsubRxBytes,
        txBytes: this.telemetry.pubsubTxBytes,
        lastRxAt: this.telemetry.pubsubLastRxAt || null,
      lastTxAt: this.telemetry.pubsubLastTxAt || null
      },
      reliability: health.reliability,
      pubsubPeerCount: Array.isArray(health.pubsubPeers) ? health.pubsubPeers.length : 0,
      joinedAt: this.joinedAt,
      peers
    };
  }

  getLibp2pNode() {
    return this.libp2p;
  }

  _dropPubsubPeer(peerId) {
    if (!peerId) return;
    const pubsub = this.libp2p?.services?.pubsub;
    if (!pubsub || typeof pubsub.removePeer !== 'function') return;
    let peer;
    try {
      peer = peerIdFromString(peerId);
    } catch (_) {
      return;
    }
    try {
      pubsub.removePeer(peer);
    } catch (err) {
      debugWarn('[NetworkManager] Failed to remove pubsub peer', peerId, err?.message || err);
    }
  }

  _handlePubsubStreamError(peerId, err) {
    if (!peerId || !err) return;
    const message = err?.message || '';
    if (err?.name !== 'StreamStateError' && !String(message).includes('stream')) return;
    const now = Date.now();
    const last = this.pubsubStreamErrorAt.get(peerId) || 0;
    if (now - last > 5000) {
      this.pubsubStreamErrorAt.set(peerId, now);
      debugWarn('[NetworkManager] Pubsub stream error', peerId, message);
    }
    this._dropPubsubPeer(peerId);
  }

  _emitConnectionFailure(details = {}) {
    if (typeof this.onConnectionFailure !== 'function') return;
    const payload = {
      peerId: details.peerId ?? null,
      address: details.address ?? null,
      source: details.source ?? null,
      stage: details.stage ?? null,
      error: details.error ?? null,
      at: details.at ?? Date.now()
    };
    try {
      this.onConnectionFailure(payload);
    } catch (err) {
      debugWarn('[NetworkManager] onConnectionFailure failed', err?.message || err);
    }
  }

  _patchGossipsubOutboundStream(peerId, outboundStream) {
    if (!peerId || !outboundStream) return;
    const rawStream = outboundStream.rawStream || outboundStream.stream || outboundStream._rawStream;
    if (!rawStream || typeof rawStream.send !== 'function') return;
    if (rawStream.__pcSendPatched) return;
    const originalSend = rawStream.send.bind(rawStream);
    rawStream.send = (data) => {
      try {
        const result = originalSend(data);
        if (result && typeof result.catch === 'function') {
          result.catch((err) => this._handlePubsubStreamError(peerId, err));
        }
        return result;
      } catch (err) {
        this._handlePubsubStreamError(peerId, err);
        return undefined;
      }
    };
    rawStream.__pcSendPatched = true;
  }

  _patchGossipsubOutboundStreams() {
    if (this.config.pubsubType !== 'gossipsub') return;
    const pubsub = this.libp2p?.services?.pubsub;
    const outbound = pubsub?.streamsOutbound;
    if (!outbound || typeof outbound.forEach !== 'function') return;
    outbound.forEach((stream, id) => {
      this._patchGossipsubOutboundStream(id, stream);
    });
    if (!outbound.__pcWrapped) {
      const originalSet = outbound.set.bind(outbound);
      outbound.set = (id, stream) => {
        const result = originalSet(id, stream);
        this._patchGossipsubOutboundStream(id, stream);
        return result;
      };
      outbound.__pcWrapped = true;
    }
  }

  _wireLibp2pEvents() {
    if (!this.libp2p) return;

    this.libp2p.addEventListener('error', (evt) => {
      const err = evt?.detail?.error || evt?.detail || evt?.error || evt;
      if (!err) return;
      this._emitConnectionFailure({
        source: 'libp2p',
        stage: 'runtime',
        error: err
      });
      debugWarn('[NetworkManager] Libp2p runtime error', err?.message || err);
    });

    this.libp2p.addEventListener('connection:open', (evt) => {
      const conn = evt.detail;
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId) return;
      const remoteAddr = toAddrString(conn?.remoteAddr);
      const kind = getConnectionKind(remoteAddr);
      this._rememberDialTargets(peerId, [remoteAddr]);
      const prevKind = this.peers.get(peerId)?.via || null;
      if (prevKind && ['relay', 'relay-webrtc', 'direct', 'webrtc'].includes(prevKind) && prevKind !== kind) {
        console.info('[NetworkManager] Connection upgraded', peerId, `${prevKind} -> ${kind}`, remoteAddr);
      } else {
        console.info('[NetworkManager] Connection open', peerId, kind, remoteAddr);
      }
      const via = this._getPreferredConnectionType(peerId);
      if (via) {
        this._touchPeer(peerId, { via });
      }
      this._maybePruneRelayConnections(peerId);
      this._maybeUpdateBootstrapRelayConnections();
    });

    this.libp2p.addEventListener('connection:close', (evt) => {
      const conn = evt.detail;
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId) return;
      const remoteAddr = toAddrString(conn?.remoteAddr);
      const kind = getConnectionKind(remoteAddr);
      const via = this._getPreferredConnectionType(peerId);
      if (via) {
        this._touchPeer(peerId, { via });
      }
      const closeError = conn?.stat?.timeline?.close?.error
        || conn?.stat?.timeline?.close?.cause
        || conn?.timeline?.close?.error
        || conn?.timeline?.close?.cause
        || conn?.error
        || evt?.detail?.error;
      if (closeError) {
        this._emitConnectionFailure({
          peerId,
          address: conn?.remoteAddr?.toString?.(),
          source: 'connection',
          stage: 'close',
          error: closeError
        });
      }
      const remaining = this._getConnectionsForPeer(peerId).filter(isConnectionOpen).length;
      console.info('[NetworkManager] Connection closed', peerId, kind, remoteAddr, 'reason:', formatCloseReason(closeError), 'remaining:', remaining);
      const active = this._getConnectionsForPeer(peerId).filter((entry) => entry?.status === 'open');
      if (active.length === 0) {
        this._dropPubsubPeer(peerId);
      }
      this._scheduleIsolationRelayRedial();
      this._maybeUpdateBootstrapRelayConnections();
    });

    this.libp2p.addEventListener('peer:discovery', (evt) => {
      const peerId = evt.detail?.id?.toString?.() || evt.detail?.id?.toString?.();
      if (!peerId || peerId === this.peerId) return;
      if (!this._shouldDialDiscoveredPeer(peerId)) return;
      this._maybeDialPeer(peerId, 'discovery').catch(() => {});
    });

    this.libp2p.addEventListener('peer:connect', (evt) => {
      const peerId = evt.detail?.remotePeer?.toString?.() || evt.detail?.toString?.();
      if (!peerId) return;
      const isNewPeer = !this.peers.has(peerId);
      const preferredVia = this._getPreferredConnectionType(peerId);
      const existingVia = this.peers.get(peerId)?.via || null;
      const existingJoinedAt = this.peers.get(peerId)?.joinedAt;
      if (this.bootstrapPeerIds.has(peerId)) {
        this._reserveRelayForPeer(peerId, 'bootstrap-connect').catch(() => {});
      }
      this._touchPeer(peerId, {
        connectedAt: Date.now(),
        joinedAt: Number.isFinite(existingJoinedAt) ? existingJoinedAt : Date.now(),
        via: preferredVia || existingVia || 'connection'
      });
      if (isNewPeer) {
        this.onPeerConnect(peerId);
      }
    });

    this.libp2p.addEventListener('peer:disconnect', (evt) => {
      const peerId = evt.detail?.remotePeer?.toString?.() || evt.detail?.toString?.();
      if (!peerId) return;
      this._dropPubsubPeer(peerId);
      this.peers.delete(peerId);
      this.onPeerDisconnect(peerId);
      this._maybeUpdateBootstrapRelayConnections();
    });

    this.libp2p.services.pubsub.addEventListener('message', (evt) => {
      const { topic, data } = evt.detail || {};
      if (!topic || !data) return;
      if (!this.allowedTopics.has(topic)) return;

      let parsed = null;
      try {
        parsed = JSON.parse(decoder.decode(data));
      } catch (err) {
        debugWarn('[NetworkManager] Failed to parse pubsub payload', err);
        return;
      }
      const now = Date.now();
      const byteLength = getByteLength(data);
      this.lastRxAt = now;
      this.scheduler?.recordRx(now);
      this._recordPubsubRx(byteLength);

      const sender = parsed?.header?.peerId || parsed?.from || null;
      if (sender && sender !== this.peerId) {
        this._recordRx(sender, byteLength);
      }
      if (this.scheduler?.handleMessage(parsed, sender)) {
        return;
      }

      if (topic === this.config.presenceTopic) {
        this._handlePresence(parsed);
        return;
      }

      // Phase 5: Handle directory responses
      if (topic === this.config.directoryTopic) {
        this._handleDirectoryMessage(parsed);
        return;
      }

      if (topic === this.config.directTopic) {
        if (parsed?.target && parsed.target !== this.peerId) return;
      }

      const bypassScope = this.additionalPubsubTopics.has(topic);
      if (!bypassScope && !this._matchesScope(parsed)) return;

      const payload = parsed?.payload ?? parsed;
      if (this._handleTopologyMessage(payload, parsed)) {
        return;
      }
      const from = parsed?.from;
      if (from && from !== this.peerId) {
        this._touchPeer(from, { lastMessageTime: Date.now() });
      }

      this._dispatchMessage(from || 'unknown', payload);
    });
  }

  _buildPubsubService() {
    if (this.config.pubsubType === 'gossipsub') {
      const configured = this.config.gossipsub || {};
      const options = {
        emitSelf: false,
        allowPublishToZeroTopicPeers: true,
        ...configured
      };
      if (configured.allowPublishToZeroPeers !== undefined && options.allowPublishToZeroTopicPeers === undefined) {
        options.allowPublishToZeroTopicPeers = configured.allowPublishToZeroPeers;
      }

      // Phase 1 Relay Scaling: Add relay as directPeer to keep it in gossipsub mesh
      // This ensures relay can forward messages between direct and relayed peers
      if (this.config.enableRelayDirectPeers !== false && this.bootstrapPeerIds.size > 0) {
        const directPeers = options.directPeers || [];

        // Add each bootstrap peer (relay) as a directPeer
        for (const relayPeerIdStr of this.bootstrapPeerIds) {
          try {
            // Convert string peer ID to PeerId object (required by gossipsub)
            const relayPeerId = peerIdFromString(relayPeerIdStr);

            // Find the multiaddr for this relay
            const relayAddrs = this.config.bootstrapPeers
              .map((addr) => {
                try {
                  const ma = typeof addr === 'string' ? multiaddr(addr) : addr;
                  return ma;
                } catch (_) {
                  return null;
                }
              })
              .filter(Boolean);

            if (relayAddrs.length > 0) {
              directPeers.push({
                id: relayPeerId,
                addrs: relayAddrs
              });
              debugLog('[NetworkManager] Added relay as gossipsub directPeer:', relayPeerId.toString());
            }
          } catch (err) {
            debugWarn('[NetworkManager] Failed to add relay as directPeer:', relayPeerIdStr, err?.message || err);
          }
        }

        if (directPeers.length > 0) {
          options.directPeers = directPeers;
        }
      }

      return gossipsub(options);
    }
    return floodsub();
  }

  _dispatchMessage(peerId, message) {
    this.messageHandlers.forEach((fn) => {
      try {
        fn(peerId, message);
      } catch (err) {
        console.error('[NetworkManager] Message handler failed', err);
      }
    });

    this.onMessage(peerId, message);
  }

  _wrapPayload(payload, extra = {}) {
    return {
      type: 'peercompute-message',
      from: this.peerId,
      gameId: this.config.gameId,
      roomId: this.config.roomId,
      topologyId: this.config.topologyId,
      topologyType: this.config.topology,
      shardId: this.topologyShardId,
      payload,
      ...extra
    };
  }

  _matchesScope(message) {
    if (!message) return true;
    if (message.gameId && message.gameId !== this.config.gameId) return false;
    if (message.roomId && message.roomId !== this.config.roomId) return false;
    if (this.config.enforceTopologyScope) {
      const msgTopology = message.topologyId || message.header?.topologyId || null;
      if (!msgTopology) return false;
      if (msgTopology !== this.config.topologyId) return false;
    }
    return true;
  }

  _handlePresence(message) {
    if (!message || !this._matchesScope(message)) return;
    if (!message.from || message.from === this.peerId) return;
    const isNewPeer = !this.peers.has(message.from);
    const joinedAtValue = Number(message.joinedAt);
    const existing = this.peers.get(message.from) || {};
    let joinedAt = existing.joinedAt ?? null;
    if (Number.isFinite(joinedAtValue)) {
      joinedAt = Number.isFinite(joinedAt) ? Math.min(joinedAt, joinedAtValue) : joinedAtValue;
    }
    this._touchPeer(message.from, {
      gameId: message.gameId,
      roomId: message.roomId,
      topologyId: message.topologyId,
      topologyType: message.topologyType,
      shardId: message.shardId,
      metric: message.metric || null,
      metricInitialized: message.metricInitialized ?? null,
      targetConnections: message.targetConnections,
      maxConnections: message.maxConnections,
      activeConnections: message.activeConnections,
      relayConnected: message.relayConnected ?? null,
      lastSeen: Date.now(),
      joinedAt,
      via: 'presence'
    });
    if (isNewPeer) {
      this.onPeerConnect(message.from);
    }
    if (Array.isArray(message.multiaddrs) && message.multiaddrs.length > 0) {
      this._rememberPeerAddresses(message.from, message.multiaddrs);
    }
    if (!this._shouldDialDiscoveredPeer(message.from)) return;
    this._maybeDialPeer(message.from, 'presence', message.multiaddrs).catch(() => {});
    this._maybeUpdateBootstrapRelayConnections();
  }

  _getScopedPeers() {
    return Array.from(this.peers.entries())
      .filter(([, meta]) => meta?.gameId === this.config.gameId && meta?.roomId === this.config.roomId)
      .filter(([, meta]) => {
        if (!this.config.enforceTopologyScope) return true;
        if (!meta?.topologyId) return false;
        return meta.topologyId === this.config.topologyId;
      })
      .map(([peerId, meta]) => ({ peerId, ...meta }));
  }

  _getConnections() {
    if (!this.libp2p?.getConnections) return [];
    const connections = this.libp2p.getConnections();
    if (Array.isArray(connections)) return connections;
    if (typeof connections?.values === 'function') {
      return Array.from(connections.values()).reduce((acc, value) => acc.concat(value), []);
    }
    return [];
  }

  _getConnectionPeers() {
    const byId = new Map();
    const connectionList = this._getConnections();
    for (const conn of connectionList) {
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId) continue;
      const meta = this.peers.get(peerId) || {};
      byId.set(peerId, {
        peerId,
        ...meta,
        via: meta.via || 'connection'
      });
    }
    return Array.from(byId.values());
  }

  _getActiveConnectionCount() {
    const connectionList = this._getConnections();
    let count = 0;
    for (const conn of connectionList) {
      if (!isConnectionOpen(conn)) continue;
      count += 1;
    }
    return count;
  }

  _countDialedPeers() {
    const dialed = new Set();
    const connectionList = this._getConnections();
    for (const conn of connectionList) {
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId) continue;
      if (this.bootstrapPeerIds.has(peerId)) continue;
      dialed.add(peerId);
    }
    return dialed.size;
  }

  _hasDirectPeerConnections() {
    const connectionList = this._getConnections();
    return connectionList.some((conn) => {
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId || this.bootstrapPeerIds.has(peerId)) return false;
      return isDirectAddr(conn?.remoteAddr);
    });
  }

  _hasBootstrapRelayConnections() {
    if (!this.libp2p || this.bootstrapPeerIds.size === 0) return false;
    for (const peerId of this.bootstrapPeerIds) {
      const connections = this._getConnectionsForPeer(peerId);
      if (connections.some(isConnectionOpen)) {
        return true;
      }
    }
    return false;
  }

  _closeBootstrapRelayConnections() {
    if (!this.libp2p || this.bootstrapPeerIds.size === 0) return;
    for (const peerId of this.bootstrapPeerIds) {
      const connections = this._getConnectionsForPeer(peerId);
      connections.forEach((conn) => {
        if (conn?.status && conn.status !== 'open') return;
        conn.close?.().catch?.(() => {});
      });
    }
  }

  _maybeRedialBootstrapPeers() {
    const now = Date.now();
    const throttleMs = this.config.bootstrapDialThrottleMs ?? PEER_DIAL_THROTTLE_MS;
    if (throttleMs > 0 && now - this.lastBootstrapDialAt < throttleMs) return;
    this.lastBootstrapDialAt = now;
    this._dialBootstrapPeers().catch(() => {});
  }

  _maybeUpdateBootstrapRelayConnections() {
    if (!this.libp2p) return;
    if (this.config.bootstrapPeers?.length) {
      const activeConnections = this._getActiveConnectionCount();
      if (activeConnections === 0 && !this._hasBootstrapRelayConnections()) {
        this._maybeRedialBootstrapPeers();
        return;
      }
    }
    if (this._shouldElectRelayRedial()) {
      this._maybeRedialBootstrapPeers();
      return;
    }
    if (!this.config.webrtc?.dropRelayBootstrapOnDirect) {
      if (!this._hasBootstrapRelayConnections()) {
        this._maybeRedialBootstrapPeers();
      }
      return;
    }
    if (this._shouldKeepRelayBootstrapConnection()) {
      if (!this._hasBootstrapRelayConnections()) {
        this._maybeRedialBootstrapPeers();
      }
      return;
    }
    if (this._hasBootstrapRelayConnections()) {
      this._closeBootstrapRelayConnections();
    }
  }

  // Phase 4: Reconnect-on-demand methods
  _shouldReconnectRelayForDial(peerId) {
    // Already connected to relay?
    if (this._hasBootstrapRelayConnections()) return false;
    // Feature disabled?
    if (this.config.webrtc?.reconnectOnDialFailure === false) return false;
    // Throttle check
    const now = Date.now();
    const throttleMs = this.config.webrtc?.reconnectThrottleMs ?? 30000;
    if (now - this.relayReconnectState.lastReconnectAt < throttleMs) return false;
    // Don't reconnect for bootstrap peers
    if (this.bootstrapPeerIds.has(peerId)) return false;
    // Only reconnect if peer is known (seen in presence)
    if (!this.peers.has(peerId)) return false;
    return true;
  }

  async _reconnectRelayForDial(peerId) {
    if (!this._shouldReconnectRelayForDial(peerId)) return false;
    debugLog('[NetworkManager] Reconnecting to relay for dial:', peerId);
    this.relayReconnectState.lastReconnectAt = Date.now();
    this.relayReconnectState.pendingDialsNeedingRelay.add(peerId);
    try {
      await this._dialBootstrapPeers();
      return this._hasBootstrapRelayConnections();
    } catch (err) {
      debugWarn('[NetworkManager] Relay reconnect failed:', err?.message || err);
      return false;
    }
  }

  _buildCircuitAddr(peerId) {
    if (!peerId || !this.config.bootstrapPeers?.length) return null;
    try {
      const bootstrapAddrs = this.config.bootstrapPeers
        .filter((addr) => typeof addr === 'string' && addr.includes('/p2p/'))
        .map((addr) => normalizeBootstrapAddr(addr));
      if (bootstrapAddrs.length === 0) return null;
      const preferIpv6 = this._hasLocalIpv6Addrs();
      const preferredRelayAddr = bootstrapAddrs.find((addr) => {
        if (preferIpv6) {
          return addr.includes('/ip6/') || addr.includes('/dns6/');
        }
        return addr.includes('/ip4/') || addr.includes('/dns4/');
      });
      const relayAddr = preferredRelayAddr || bootstrapAddrs[0];
      const normalized = normalizeBootstrapAddr(relayAddr);
      return multiaddr(`${normalized}/p2p-circuit/p2p/${peerId}`);
    } catch (err) {
      debugWarn('[NetworkManager] Failed to build circuit addr:', err?.message || err);
      return null;
    }
  }

  _scheduleAutoRelayDrop() {
    const delay = this.config.webrtc?.autoDropRelayAfterDialMs ?? 60000;
    if (delay <= 0) return;
    // Clear existing timer
    if (this.relayReconnectState.autoDisconnectTimer) {
      clearTimeout(this.relayReconnectState.autoDisconnectTimer);
    }
    this.relayReconnectState.autoDisconnectTimer = setTimeout(() => {
      this.relayReconnectState.autoDisconnectTimer = null;
      this.relayReconnectState.pendingDialsNeedingRelay.clear();
      debugLog('[NetworkManager] Auto-dropping relay after dial timeout');
      this._maybeUpdateBootstrapRelayConnections();
    }, delay);
  }

  _shouldElectRelayRedial(now = Date.now()) {
    if (!this.peerId) return false;
    if (!this.config.bootstrapPeers?.length) return false;
    if (this._hasBootstrapRelayConnections()) return false;
    const presenceInterval = Number.isFinite(this.config.presenceIntervalMs)
      ? this.config.presenceIntervalMs
      : 3000;
    const maxAgeMs = Number.isFinite(this.config.peerStaleMs)
      ? this.config.peerStaleMs
      : Math.max(30000, presenceInterval * 3);
    const scopedPeers = this._getScopedPeers().filter((peer) => {
      const lastSeen = Number(peer?.lastSeen ?? 0);
      if (!lastSeen) return false;
      return now - lastSeen <= maxAgeMs;
    });
    if (scopedPeers.some((peer) => peer?.relayConnected === true)) return false;
    const candidates = scopedPeers.map((peer) => ({
      peerId: peer.peerId,
      activeConnections: Number.isFinite(peer.activeConnections) ? peer.activeConnections : Infinity
    }));
    candidates.push({
      peerId: this.peerId,
      activeConnections: this._getActiveConnectionCount()
    });
    candidates.sort((a, b) => {
      if (a.activeConnections !== b.activeConnections) {
        return a.activeConnections - b.activeConnections;
      }
      return String(a.peerId).localeCompare(String(b.peerId));
    });
    return candidates[0]?.peerId === this.peerId;
  }

  _scheduleIsolationRelayRedial() {
    if (!this.libp2p) return;
    if (!this.config.bootstrapPeers?.length) return;
    if (this.isolationReconnectTimer) return;
    this.isolationReconnectTimer = setTimeout(() => {
      this.isolationReconnectTimer = null;
      if (this._getActiveConnectionCount() > 0) return;
      if (this._hasBootstrapRelayConnections()) return;
      this._maybeRedialBootstrapPeers();
    }, 400);
  }

  _shouldDialDiscoveredPeer(peerId) {
    if (!peerId) return false;
    const existingConnections = this._getConnectionsForPeer(peerId);
    const hasRelayOnly = existingConnections.length > 0
      && existingConnections.some((conn) => isRelayOnlyAddr(conn?.remoteAddr))
      && !existingConnections.some((conn) => isTrulyDirectAddr(conn?.remoteAddr));
    const nonBootstrapConnections = this._countDialedPeers();
    const allowIsolationDial = this.config.allowDiscoveryDialWhenIsolated
      && nonBootstrapConnections === 0;
    const allowByRoom = !this.config.enforceRoomIsolation
      || this.bootstrapPeerIds.has(peerId)
      || this.peers.has(peerId)
      || allowIsolationDial;
    if (!allowByRoom) return false;
    if (this.bootstrapPeerIds.has(peerId)) {
      if (this.config.webrtc?.dropRelayBootstrapOnDirect && this._hasDirectPeerConnections()) {
        return false;
      }
      return true;
    }
    if (hasRelayOnly && this.config.webrtc?.preferDirect !== false) {
      return true;
    }
    const maxDialPeers = this.config.maxDialPeers;
    if (Number.isFinite(maxDialPeers)) {
      if (maxDialPeers <= 0) return false;
      if (this._countDialedPeers() >= maxDialPeers) {
        return false;
      }
    }
    const targetConnections = Number.isFinite(this.config.targetConnections)
      ? this.config.targetConnections
      : null;
    const activeConnections = this._getActiveConnectionCount();
    const underTarget = Number.isFinite(targetConnections) && activeConnections < targetConnections;
    if (this.topologyController && !underTarget && !this.topologyController.shouldDialPeer(peerId)) {
      return false;
    }
    return true;
  }

  _pruneStalePeers(now = Date.now()) {
    const configured = this.config.peerStaleMs;
    const presenceInterval = Number.isFinite(this.config.presenceIntervalMs)
      ? this.config.presenceIntervalMs
      : 3000;
    const maxAgeMs = Number.isFinite(configured)
      ? configured
      : Math.max(30000, presenceInterval * 3);
    if (maxAgeMs <= 0) return;
    for (const [peerId, meta] of this.peers.entries()) {
      if (!peerId) continue;
      const lastSeen = Number(meta?.lastSeen ?? meta?.lastMessageTime ?? meta?.connectedAt ?? meta?.joinedAt ?? 0);
      if (!lastSeen) continue;
      if (now - lastSeen <= maxAgeMs) continue;
      const connections = this._getConnectionsForPeer(peerId);
      const hasConnection = connections.some((conn) => conn?.status !== 'closed');
      if (hasConnection) continue;
      this.peers.delete(peerId);
      this._dropPubsubPeer(peerId);
      this.recentDialAttempts.delete(peerId);
      this.pendingTopologyRequests.delete(peerId);
    }
  }

  _touchPeer(peerId, updates) {
    const existing = this.peers.get(peerId) || {};
    this.peers.set(peerId, { ...existing, ...updates });
  }

  _recordRx(peerId, byteLength) {
    this.telemetry.rxCount += 1;
    this.telemetry.rxBytes += byteLength || 0;
    if (!peerId) return;
    const existing = this.peers.get(peerId) || {};
    this.peers.set(peerId, {
      ...existing,
      rxCount: (existing.rxCount || 0) + 1,
      rxBytes: (existing.rxBytes || 0) + (byteLength || 0),
      lastRxAt: Date.now()
    });
  }

  _recordPubsubRx(byteLength) {
    this.telemetry.pubsubRxCount += 1;
    this.telemetry.pubsubRxBytes += byteLength || 0;
    this.telemetry.pubsubLastRxAt = Date.now();
  }

  _recordTx(peerId, byteLength) {
    this.telemetry.txCount += 1;
    this.telemetry.txBytes += byteLength || 0;
    if (!peerId) return;
    const existing = this.peers.get(peerId) || {};
    this.peers.set(peerId, {
      ...existing,
      txCount: (existing.txCount || 0) + 1,
      txBytes: (existing.txBytes || 0) + (byteLength || 0),
      lastTxAt: Date.now()
    });
  }

  _recordPubsubTx(byteLength) {
    this.telemetry.pubsubTxCount += 1;
    this.telemetry.pubsubTxBytes += byteLength || 0;
    this.telemetry.pubsubLastTxAt = Date.now();
  }

  _getRelayRetentionConfig() {
    return this.config.webrtc?.relayRetention || null;
  }

  _getRetentionCandidates() {
    const candidates = new Map();
    const scopedPeers = this._getScopedPeers();
    scopedPeers.forEach((peer) => {
      const peerId = peer?.peerId;
      if (!peerId) return;
      const joinedAt = Number(peer.joinedAt ?? peer.connectedAt ?? peer.lastSeen);
      const existing = candidates.get(peerId);
      if (!existing || (Number.isFinite(joinedAt) && joinedAt < existing)) {
        candidates.set(peerId, Number.isFinite(joinedAt) ? joinedAt : Infinity);
      }
    });
    if (this.peerId) {
      const joinedAt = Number(this.joinedAt ?? Date.now());
      const existing = candidates.get(this.peerId);
      if (!existing || joinedAt < existing) {
        candidates.set(this.peerId, joinedAt);
      }
    }
    return Array.from(candidates.entries()).map(([peerId, joinedAt]) => ({
      peerId,
      joinedAt
    }));
  }

  _getRelayRetentionKeepCount(peerCount, retention) {
    if (!peerCount || peerCount <= 0) return 0;
    const mode = retention?.mode || 'logn';
    let keep = 0;
    if (mode === 'sqrt') {
      keep = Math.ceil(Math.sqrt(peerCount));
    } else {
      const base = retention?.base || 2;
      const raw = Math.log(peerCount) / Math.log(base);
      keep = Math.ceil(raw);
    }
    keep = Math.max(retention.min ?? 1, keep);
    if (Number.isFinite(retention.max)) {
      keep = Math.min(keep, retention.max);
    }
    return keep;
  }

  _shouldKeepRelayBootstrapConnection() {
    if (!this.config.webrtc?.dropRelayBootstrapOnDirect) return true;
    if (!this._hasDirectPeerConnections()) return true;
    const targetConnections = Number.isFinite(this.config.targetConnections)
      ? this.config.targetConnections
      : null;
    if (Number.isFinite(targetConnections)) {
      const activeConnections = this._getActiveConnectionCount();
      if (activeConnections < targetConnections) return true;
    }
    const retention = this._getRelayRetentionConfig();
    if (!retention) {
      debugLog('[NetworkManager] No retention config, dropping relay');
      return false;
    }
    if (retention.mode !== 'logn' && retention.mode !== 'sqrt') {
      debugLog('[NetworkManager] Invalid retention mode:', retention.mode);
      return false;
    }
    const candidates = this._getRetentionCandidates();
    const keepCount = this._getRelayRetentionKeepCount(candidates.length, retention);
    if (keepCount <= 0) {
      debugLog('[NetworkManager] keepCount=0, dropping relay');
      return false;
    }
    // Don't drop relay until we know about enough peers to make a stable retention decision
    const minCandidates = retention.minCandidates ?? Math.max(keepCount * 2, retention.min ?? 1);
    if (candidates.length < minCandidates) {
      debugLog('[NetworkManager] Not enough candidates:', candidates.length, '<', minCandidates);
      return true;
    }
    const ordered = candidates
      .slice()
      .sort((a, b) => {
        const aJoined = Number.isFinite(a.joinedAt) ? a.joinedAt : Infinity;
        const bJoined = Number.isFinite(b.joinedAt) ? b.joinedAt : Infinity;
        if (aJoined !== bJoined) return aJoined - bJoined;
        return String(a.peerId).localeCompare(String(b.peerId));
      });
    const keepSet = new Set(ordered.slice(0, keepCount).map((entry) => entry.peerId));
    return keepSet.has(this.peerId);
  }

  _startPresence() {
    this._clearPresenceTimer();
    const publishPresence = () => this._publishPresenceNow();
    const tick = () => {
      this._maybeUpdateBootstrapRelayConnections();
      publishPresence().catch(() => {});
    };
    tick();
    this.presenceInterval = setInterval(() => {
      tick();
    }, this.config.presenceIntervalMs || 3000);
  }

  _buildPresencePayload() {
    if (!this.peerId) return null;
    const activeConnections = this._getActiveConnectionCount();
    return {
      type: 'presence',
      from: this.peerId,
      gameId: this.config.gameId,
      roomId: this.config.roomId,
      topologyId: this.config.topologyId,
      topologyType: this.config.topology,
      shardId: this.topologyShardId,
      metric: { ...this.topologyMetric },
      metricInitialized: this.metricInitialized,
      joinedAt: this.joinedAt,
      targetConnections: this.config.targetConnections,
      maxConnections: this.config.maxConnections,
      activeConnections,
      relayConnected: this._hasBootstrapRelayConnections(),
      multiaddrs: this._getAnnounceAddrs()
    };
  }

  async _publishPresenceNow() {
    const payload = this._buildPresencePayload();
    if (!payload) return;
    await this._publish(this.config.presenceTopic, payload);
  }

  _clearPresenceTimer() {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
    }
  }

  // Phase 5: Peer directory methods
  async queryPeerDirectory(targetPeerId) {
    if (!this.libp2p || !this.config.enablePeerDirectory) {
      return null;
    }
    const requestId = `${this.peerId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const query = {
      type: 'directory-query',
      requestId,
      targetPeerId,
      from: this.peerId
    };
    return new Promise((resolve) => {
      const timeoutMs = this.config.directoryQueryTimeoutMs;
      const timeout = setTimeout(() => {
        this.pendingDirectoryQueries.delete(requestId);
        resolve(null); // Timeout = not found
      }, timeoutMs);
      this.pendingDirectoryQueries.set(requestId, { resolve, timeout });
      const payload = JSON.stringify(query);
      this._publish(this.config.directoryTopic, payload).catch(() => {
        clearTimeout(timeout);
        this.pendingDirectoryQueries.delete(requestId);
        resolve(null);
      });
    });
  }

  _handleDirectoryMessage(data) {
    try {
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      if (response.type !== 'directory-response') return;
      const pending = this.pendingDirectoryQueries.get(response.requestId);
      if (!pending) return; // Not our query
      clearTimeout(pending.timeout);
      this.pendingDirectoryQueries.delete(response.requestId);
      if (response.found && Array.isArray(response.multiaddrs)) {
        // Store addresses for future dial attempts
        this._rememberPeerAddresses(response.targetPeerId, response.multiaddrs);
        pending.resolve({
          peerId: response.targetPeerId,
          multiaddrs: response.multiaddrs,
          lastSeen: response.lastSeen,
          metadata: response.metadata
        });
      } else {
        pending.resolve(null);
      }
    } catch (_) {}
  }

  async registerWithDirectory() {
    if (!this.libp2p || !this.config.enablePeerDirectory) return;
    const registration = {
      type: 'directory-register',
      from: this.peerId,
      multiaddrs: this._getAnnounceAddrs(),
      roomId: this.config.roomId,
      topologyId: this.config.topologyId,
      shardId: this.topologyShardId
    };
    await this._publish(this.config.directoryTopic, JSON.stringify(registration));
  }

  _updateShardState(force = false) {
    if (!this.topologyController || !this.config.enableSharding) return;
    const shardId = this.topologyController.getShardId(this.topologyMetric);
    if (!force && shardId === this.topologyShardId) return;
    this.topologyShardId = shardId;
    const neighborIds = this.topologyController.getNeighborShardIds(this.topologyMetric);
    this._syncShardSubscriptions(neighborIds);
  }

  _getShardTopics(ids = []) {
    if (!this.config.useScopedTopics) return [];
    return ids.map((id) =>
      buildScopedTopic(this.config.topicPrefix, this.config.topologyId, this.config.roomId, `shard.${id}`)
    );
  }

  _getShardSnapshotTopic() {
    if (!this.config.enableSharding) return null;
    if (!this.config.useScopedTopics) return null;
    if (!this.topologyShardId) return null;
    return buildScopedTopic(
      this.config.topicPrefix,
      this.config.topologyId,
      this.config.roomId,
      `shard.${this.topologyShardId}`
    );
  }

  _syncShardSubscriptions(ids = []) {
    if (!this.config.enableSharding || !this.libp2p?.services?.pubsub) return;
    const topics = new Set(this._getShardTopics(ids));
    for (const topic of topics) {
      if (!this.shardTopics.has(topic)) {
        this.libp2p.services.pubsub.subscribe(topic);
      }
      this.allowedTopics.add(topic);
    }
    for (const topic of Array.from(this.shardTopics)) {
      if (!topics.has(topic)) {
        this.libp2p.services.pubsub.unsubscribe?.(topic);
        this.allowedTopics.delete(topic);
      }
    }
    this.shardTopics = topics;
  }

  _startTopologyController() {
    if (!this.topologyController) return;
    if (this.topologyTimer) return;
    const tick = () => {
      this._tickTopology();
      this.topologyTimer = setTimeout(tick, this.config.topologyTickMs || 1500);
    };
    this._tickTopology(true);
    this.topologyTimer = setTimeout(tick, this.config.topologyTickMs || 1500);
  }

  _stopTopologyController() {
    if (this.topologyTimer) {
      clearTimeout(this.topologyTimer);
      this.topologyTimer = null;
    }
  }

  _tickTopology(force = false) {
    if (!this.topologyController || !this.isConnected) return;
    const now = Date.now();
    this._pruneStalePeers(now);
    if (this.config.enableSharding) {
      this._updateShardState(force);
    }
    const peers = this._getScopedPeers();
    const connections = this._getConnectionPeers();
    const desiredPeers = this.topologyController.computeDesiredPeers({
      peers,
      connections,
      now
    });
    this._maybeSwapTopologyConnections(desiredPeers, peers, connections);
    this._ensureTopologyConnections(desiredPeers);
  }

  _maybeSwapTopologyConnections(desiredPeers, peers, connections) {
    if (!this.topologyController) return;
    if (this.config.topology !== 'distributed') return;
    const maxConnections = this.config.maxConnections;
    if (!Number.isFinite(maxConnections) || maxConnections <= 0) return;
    if (this._getActiveConnectionCount() < maxConnections) return;
    if (!desiredPeers || desiredPeers.size === 0) return;

    const peerById = new Map();
    peers.forEach((peer) => {
      if (peer?.peerId) peerById.set(peer.peerId, peer);
    });

    const connected = connections.filter((peer) => peer?.peerId && !this.bootstrapPeerIds.has(peer.peerId));
    if (connected.length === 0) return;
    const connectedIds = new Set(connected.map((peer) => peer.peerId));
    const allowRelayWhenIsolated = this.config.allowRelayWhenIsolated !== false;
    const hasNonRelay = connected.some((peer) => isDirectPeerVia(peer?.via));
    if (allowRelayWhenIsolated && !hasNonRelay) return;

    const toPriority = (peerId, peer) => {
      const activeConnections = peer?.activeConnections;
      const distanceRaw = this.topologyController.getPeerDistance(peer || { peerId });
      const distance = Number.isFinite(distanceRaw) ? distanceRaw : Number.POSITIVE_INFINITY;
      return {
        peerId,
        distance,
        noConnections: activeConnections === 0
      };
    };
    const comparePriority = (a, b) => {
      if (a.noConnections !== b.noConnections) return a.noConnections ? -1 : 1;
      if (a.distance !== b.distance) return a.distance - b.distance;
      return String(a.peerId).localeCompare(String(b.peerId));
    };
    const normalizeMetric = (metric) => ({
      x: Number.isFinite(metric?.x) ? metric.x : 0,
      y: Number.isFinite(metric?.y) ? metric.y : 0,
      z: Number.isFinite(metric?.z) ? metric.z : 0
    });
    const isMetricReady = (peer) => {
      if (!peer?.metric || typeof peer.metric !== 'object') return false;
      const initialized = peer.metricInitialized === true;
      const metric = normalizeMetric(peer.metric);
      const isZero = metric.x === 0 && metric.y === 0 && metric.z === 0;
      return initialized || !isZero;
    };
    const getMetricDistance = (a, b) => {
      if (!isMetricReady(a) || !isMetricReady(b)) return Number.POSITIVE_INFINITY;
      const aMetric = normalizeMetric(a.metric);
      const bMetric = normalizeMetric(b.metric);
      const dx = aMetric.x - bMetric.x;
      const dy = aMetric.y - bMetric.y;
      const dz = aMetric.z - bMetric.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    const pendingDesired = Array.from(desiredPeers)
      .filter((peerId) => !connectedIds.has(peerId))
      .map((peerId) => toPriority(peerId, peerById.get(peerId)))
      .filter((entry) => Number.isFinite(entry.distance));
    if (pendingDesired.length === 0) return;

    pendingDesired.sort(comparePriority);
    const bestCandidate = pendingDesired[0];
    if (!bestCandidate) return;

    const protectedIds = new Set(this.bootstrapPeerIds);
    if (this.topologyController.longRangePeers) {
      for (const peerId of this.topologyController.longRangePeers) {
        protectedIds.add(peerId);
      }
    }

    const dropCandidates = connected
      .filter((peer) => peer?.peerId)
      .filter((peer) => !desiredPeers.has(peer.peerId))
      .filter((peer) => !protectedIds.has(peer.peerId))
      .filter((peer) => !(allowRelayWhenIsolated && isRelayPeerVia(peer?.via) && !hasNonRelay))
      .map((peer) => toPriority(peer.peerId, peer));

    if (dropCandidates.length === 0) return;

    dropCandidates.sort(comparePriority);
    const worstCandidate = dropCandidates[dropCandidates.length - 1];
    if (!worstCandidate) return;
    if (comparePriority(bestCandidate, worstCandidate) >= 0) return;

    const worstPeer = peerById.get(worstCandidate.peerId);
    const otherConnections = Number.isFinite(worstPeer?.activeConnections)
      ? worstPeer.activeConnections - 1
      : null;
    if (!Number.isFinite(otherConnections) || otherConnections < 2) return;
    if (!Number.isFinite(worstCandidate.distance)) return;
    let closerCount = 0;
    for (const peer of peers) {
      if (!peer?.peerId) continue;
      if (peer.peerId === worstCandidate.peerId) continue;
      if (peer.peerId === this.peerId) continue;
      const dist = getMetricDistance(worstPeer, peer);
      if (!Number.isFinite(dist)) continue;
      if (dist < worstCandidate.distance) {
        closerCount += 1;
        if (closerCount >= 2) break;
      }
    }
    if (closerCount < 2) return;

    this._closeConnectionsToPeer(worstCandidate.peerId);
  }

  _ensureTopologyConnections(desiredPeers) {
    if (!desiredPeers || desiredPeers.size === 0) return;
    const now = Date.now();
    for (const [peerId, entry] of Array.from(this.pendingTopologyRequests.entries())) {
      if (now - (entry?.sentAt || 0) > 10000) {
        this.pendingTopologyRequests.delete(peerId);
      }
    }
    for (const peerId of desiredPeers) {
      if (!peerId) continue;
      if (this.peers.get(peerId)?.connectedAt) continue;
      if (this.pendingTopologyRequests.has(peerId)) continue;
      this.pendingTopologyRequests.set(peerId, { sentAt: now });
      this.sendToPeer(peerId, {
        type: 'topology-connect-request',
        metric: this.topologyMetric,
        targetConnections: this.config.targetConnections,
        maxConnections: this.config.maxConnections
      }).catch(() => {
        this.pendingTopologyRequests.delete(peerId);
      });
    }
  }

  _closeConnectionsToPeer(peerId) {
    if (!this.libp2p?.getConnections || !peerId) return;
    const connections = this._getConnectionsForPeer(peerId);
    connections.forEach((conn) => {
      if (conn?.status && conn.status !== 'open') return;
      conn.close?.().catch?.(() => {});
    });
  }

  _handleTopologyMessage(payload, envelope) {
    if (!payload || typeof payload.type !== 'string') return false;
    if (!payload.type.startsWith('topology-')) return false;
    const from = envelope?.from || payload.from;
    if (!from || from === this.peerId) return true;

    if (payload.type === 'topology-connect-request') {
      this._handleTopologyConnectRequest(from, payload);
      return true;
    }
    if (payload.type === 'topology-connect-accept') {
      this._handleTopologyConnectAccept(from);
      return true;
    }
    if (payload.type === 'topology-connect-referral') {
      this._handleTopologyConnectReferral(from, payload);
      return true;
    }
    return true;
  }

  _handleTopologyConnectRequest(peerId, payload = {}) {
    if (!peerId) return;
    const activeConnections = this._getActiveConnectionCount();
    const capacity = this.config.maxConnections || 0;
    if (capacity > 0 && activeConnections >= capacity) {
      if (this.topologyController) {
        const incomingMetric = payload?.metric || this.peers.get(peerId)?.metric || null;
        const incomingInitialized = payload?.metric
          ? true
          : this.peers.get(peerId)?.metricInitialized === true;
        const incomingDistance = this.topologyController.getPeerDistance({
          peerId,
          metric: incomingMetric,
          metricInitialized: incomingInitialized
        });
        if (Number.isFinite(incomingDistance)) {
          const connected = this._getConnectionPeers()
            .filter((peer) => peer?.peerId && !this.bootstrapPeerIds.has(peer.peerId));
          const allowRelayWhenIsolated = this.config.allowRelayWhenIsolated !== false;
          const hasNonRelay = connected.some((peer) => isDirectPeerVia(peer?.via));
          if (!(allowRelayWhenIsolated && !hasNonRelay) && connected.length > 0) {
            const protectedIds = new Set(this.bootstrapPeerIds);
            if (this.topologyController.longRangePeers) {
              for (const id of this.topologyController.longRangePeers) {
                protectedIds.add(id);
              }
            }
            const normalizeMetric = (metric) => ({
              x: Number.isFinite(metric?.x) ? metric.x : 0,
              y: Number.isFinite(metric?.y) ? metric.y : 0,
              z: Number.isFinite(metric?.z) ? metric.z : 0
            });
            const isMetricReady = (peer) => {
              if (!peer?.metric || typeof peer.metric !== 'object') return false;
              const initialized = peer.metricInitialized === true;
              const metric = normalizeMetric(peer.metric);
              const isZero = metric.x === 0 && metric.y === 0 && metric.z === 0;
              return initialized || !isZero;
            };
            const getMetricDistance = (a, b) => {
              if (!isMetricReady(a) || !isMetricReady(b)) return Number.POSITIVE_INFINITY;
              const aMetric = normalizeMetric(a.metric);
              const bMetric = normalizeMetric(b.metric);
              const dx = aMetric.x - bMetric.x;
              const dy = aMetric.y - bMetric.y;
              const dz = aMetric.z - bMetric.z;
              return Math.sqrt(dx * dx + dy * dy + dz * dz);
            };
            const dropCandidates = connected
              .filter((peer) => peer?.peerId)
              .filter((peer) => !protectedIds.has(peer.peerId))
              .filter((peer) => !(allowRelayWhenIsolated && isRelayPeerVia(peer?.via) && !hasNonRelay))
              .map((peer) => ({
                peer,
                distance: this.topologyController.getPeerDistance(peer)
              }))
              .filter((entry) => Number.isFinite(entry.distance));
            if (dropCandidates.length > 0) {
              dropCandidates.sort((a, b) => b.distance - a.distance);
              const farthest = dropCandidates[0];
              if (incomingDistance < farthest.distance) {
                const farthestPeer = farthest.peer;
                const otherConnections = Number.isFinite(farthestPeer?.activeConnections)
                  ? farthestPeer.activeConnections - 1
                  : null;
                if (Number.isFinite(otherConnections) && otherConnections >= 2) {
                  let closerCount = 0;
                  const peers = this._getScopedPeers();
                  for (const peer of peers) {
                    if (!peer?.peerId) continue;
                    if (peer.peerId === farthestPeer.peerId) continue;
                    if (peer.peerId === this.peerId) continue;
                    const dist = getMetricDistance(farthestPeer, peer);
                    if (!Number.isFinite(dist)) continue;
                    if (dist < farthest.distance) {
                      closerCount += 1;
                      if (closerCount >= 2) break;
                    }
                  }
                  if (closerCount >= 2) {
                    this._closeConnectionsToPeer(farthestPeer.peerId);
                    this.sendToPeer(peerId, { type: 'topology-connect-accept' }).catch(() => {});
                    return;
                  }
                }
              }
            }
          }
        }
      }
      const candidates = this._getScopedPeers()
        .filter((peer) => peer.peerId && peer.peerId !== this.peerId)
        .filter((peer) => {
          if (!Number.isFinite(peer.targetConnections)) return true;
          if (!Number.isFinite(peer.activeConnections)) return true;
          return peer.activeConnections < peer.targetConnections;
        })
        .slice(0, 5)
        .map((peer) => peer.peerId);
      this.sendToPeer(peerId, {
        type: 'topology-connect-referral',
        peers: candidates
      }).catch(() => {});
      return;
    }
    this.sendToPeer(peerId, { type: 'topology-connect-accept' }).catch(() => {});
  }

  _handleTopologyConnectAccept(peerId) {
    if (!peerId) return;
    this.pendingTopologyRequests.delete(peerId);
    this._maybeDialPeer(peerId, 'topology-accept').catch(() => {});
  }

  _handleTopologyConnectReferral(peerId, payload) {
    this.pendingTopologyRequests.delete(peerId);
    const peers = Array.isArray(payload?.peers) ? payload.peers : [];
    if (this.topologyController) {
      this.topologyController.addReferralPeers(peers);
    }
  }

  _startTelemetrySampler() {
    if (!this.config.enableTelemetry) return;
    if (this.telemetryTimer) return;
    const interval = this.config.telemetrySampleMs || 1000;
    const tick = () => {
      this._sampleTelemetry(Date.now());
      this.telemetryTimer = setTimeout(tick, interval);
    };
    this.telemetryTimer = setTimeout(tick, interval);
  }

  _stopTelemetrySampler() {
    if (this.telemetryTimer) {
      clearTimeout(this.telemetryTimer);
      this.telemetryTimer = null;
    }
  }

  _sampleTelemetry(now) {
    const sampleAt = this.telemetrySample.at || now;
    const elapsed = now - sampleAt;
    if (elapsed > 0) {
      const rxDelta = this.telemetry.rxBytes - this.telemetrySample.rxBytes;
      const txDelta = this.telemetry.txBytes - this.telemetrySample.txBytes;
      this.telemetry.rxBps = Math.max(0, (rxDelta * 1000) / elapsed);
      this.telemetry.txBps = Math.max(0, (txDelta * 1000) / elapsed);
    }
    this.telemetrySample = {
      rxBytes: this.telemetry.rxBytes,
      txBytes: this.telemetry.txBytes,
      at: now
    };

    const peers = this._getConnectionPeers();
    peers.forEach((peer) => {
      const peerId = peer.peerId;
      if (!peerId) return;
      const existing = this.peers.get(peerId) || {};
      const sample = existing.telemetrySample || {
        rxBytes: existing.rxBytes || 0,
        txBytes: existing.txBytes || 0,
        at: now
      };
      const peerElapsed = now - sample.at;
      if (peerElapsed > 0) {
        const rxDelta = (existing.rxBytes || 0) - sample.rxBytes;
        const txDelta = (existing.txBytes || 0) - sample.txBytes;
        existing.rxBps = Math.max(0, (rxDelta * 1000) / peerElapsed);
        existing.txBps = Math.max(0, (txDelta * 1000) / peerElapsed);
      }
      existing.telemetrySample = {
        rxBytes: existing.rxBytes || 0,
        txBytes: existing.txBytes || 0,
        at: now
      };
      this.peers.set(peerId, existing);
    });

    this._sampleRtt(now, peers);
  }

  _sampleRtt(now, peers) {
    const ping = this.libp2p?.services?.ping?.ping;
    if (!ping || !this.config.enableTelemetry) return;
    const pingInterval = this.config.telemetryPingMs || 5000;

    peers.forEach((peer) => {
      const peerId = peer.peerId;
      if (!peerId) return;
      const existing = this.peers.get(peerId) || {};
      if (existing.pingInFlight) return;
      if (existing.lastRttAt && now - existing.lastRttAt < pingInterval) return;

      let peerTarget = null;
      try {
        peerTarget = peerIdFromString(peerId);
      } catch (_) {
        return;
      }

      existing.pingInFlight = true;
      this.peers.set(peerId, existing);
      ping(peerTarget)
        .then((rtt) => {
          this._touchPeer(peerId, { rttMs: Math.round(rtt), lastRttAt: Date.now() });
        })
        .catch(() => {
          this._touchPeer(peerId, { rttMs: null, lastRttAt: Date.now() });
        })
        .finally(() => {
          const current = this.peers.get(peerId) || {};
          current.pingInFlight = false;
          this.peers.set(peerId, current);
        });
    });
  }

  _ensureScheduler() {
    if (this.scheduler) return;
    this.scheduler = new NetworkScheduler(this._buildSchedulerAdapter(), this.schedulerProfile);
    if (this.authorityId) {
      this.scheduler.setAuthority(this.authorityId);
    }
  }

  _startScheduler() {
    if (!this.schedulerEnabled) return;
    if (!this.isConnected) return;
    if (this.schedulerClock === 'external') return;
    if (!this.scheduler || this.schedulerTimer) return;
    const tick = () => {
      if (!this.scheduler) return;
      this.scheduler.tick(Date.now());
      this.schedulerTimer = setTimeout(tick, this.scheduler.getTickIntervalMs());
    };
    this.schedulerTimer = setTimeout(tick, this.scheduler.getTickIntervalMs());
  }

  _stopScheduler() {
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  _buildSchedulerAdapter() {
    return {
      sendSnapshot: (message) => this._sendScheduledSnapshot(message),
      sendCommand: (message) => this._sendScheduledCommand(message),
      sendEvent: (message) => this._sendScheduledEvent(message),
      reconnect: () => this._schedulerReconnect(),
      getPeerId: () => this.peerId,
      getAuthority: () => this.authorityId,
      getGameId: () => this.config.gameId,
      getRoomId: () => this.config.roomId,
      getTopologyId: () => this.config.topologyId,
      getTopologyType: () => this.config.topology,
      isInScope: (message) => this._matchesScope(message)
    };
  }

  async _sendScheduledSnapshot(message) {
    if (!this.isConnected) return;
    if (this.schedulerProfile.snapshotsRequireAuthority && this.authorityId && this.authorityId !== this.peerId) {
      return;
    }
    const snapshotTopic = this.scheduler?.getProfile()?.snapshotTopic || null;
    const shardTopic = this._getShardSnapshotTopic();
    const useShardTopic = !snapshotTopic && shardTopic;
    const topic = snapshotTopic || shardTopic || this.config.pubsubTopic;
    const payload = useShardTopic
      ? { ...message, shardId: this.topologyShardId }
      : message;
    await this._publish(topic, payload);
  }

  async _sendScheduledCommand(message) {
    if (!this.isConnected) return;
    const topic = this.scheduler?.getProfile()?.commandTopic || this.config.directTopic;
    const target = this.authorityId && this.authorityId !== this.peerId ? this.authorityId : null;
    const payload = target ? { ...message, target } : message;
    await this._publish(topic, payload);
  }

  async _sendScheduledEvent(message) {
    if (!this.isConnected) return;
    const topic = this.scheduler?.getProfile()?.eventTopic || this.config.pubsubTopic;
    await this._publish(topic, message);
  }

  async _schedulerReconnect() {
    await this.redialBootstrapPeers();
    this._resubscribeTopics();
    this._startPresence();
  }

  _resubscribeTopics() {
    if (!this.libp2p?.services?.pubsub) return;
    this.libp2p.services.pubsub.subscribe(this.config.pubsubTopic);
    this.libp2p.services.pubsub.subscribe(this.config.directTopic);
    this.libp2p.services.pubsub.subscribe(this.config.presenceTopic);
    this.additionalPubsubTopics.forEach((topic) => {
      this.libp2p.services.pubsub.subscribe(topic);
    });
    // Phase 5: Subscribe to directory topic
    if (this.config.enablePeerDirectory) {
      this.libp2p.services.pubsub.subscribe(this.config.directoryTopic);
    }
    if (this.config.enableSharding && this.topologyController) {
      this._syncShardSubscriptions(this.topologyController.getNeighborShardIds(this.topologyMetric));
    }
    this._recordPubsubTx(0);
  }

  async _publish(topic, payload) {
    try {
      if (!this.libp2p?.services?.pubsub || !this.isConnected) return;
      const now = Date.now();
      const blockedUntil = this.publishBlockedUntil.get(topic) || 0;
      if (now < blockedUntil) return;
      let data;
      try {
        data = encoder.encode(JSON.stringify(payload));
      } catch (err) {
        debugWarn('[NetworkManager] Publish encode failed', topic, err?.message || err);
        return;
      }
      await this.libp2p.services.pubsub.publish(topic, data);
      if (this.config.onPublishSuccess) {
        try {
          this.config.onPublishSuccess(topic, payload);
        } catch (err) {
          debugWarn('[NetworkManager] onPublishSuccess failed', err?.message || err);
        }
      }
      this.lastTxAt = now;
      this.scheduler?.recordTx(now);
      this._recordTx(payload?.target || null, getByteLength(data));
      this._recordPubsubTx(getByteLength(data));
    } catch (err) {
      const now = Date.now();
      if (this.config.onPublishError) {
        try {
          this.config.onPublishError(topic, payload, err);
        } catch (errInner) {
          debugWarn('[NetworkManager] onPublishError failed', errInner?.message || errInner);
        }
      }
      if (err?.name === 'StreamStateError' || String(err?.message || '').includes('stream')) {
        this.publishBlockedUntil.set(topic, now + 2000);
      }
      const last = this.publishErrorAt.get(topic) || 0;
      if (now - last > 5000) {
        this.publishErrorAt.set(topic, now);
        debugWarn('[NetworkManager] Publish failed', topic, err?.message || err);
      }
    }
  }

  async _dialBootstrapPeers() {
    const dialAddrs = (this.config.bootstrapPeers || [])
      .map(toMultiaddr)
      .filter(Boolean);
    await Promise.all(
      dialAddrs.map(async (addr) => {
        const addrStr = addr.toString();
        const peerIdStr = getPeerIdFromAddr(addrStr);
        try {
          if (peerIdStr) {
            try {
              const peerId = peerIdFromString(peerIdStr);
              const existing = this.libp2p?.getConnections?.(peerId) || [];
              const hasOpen = existing.some(isConnectionOpen);
              if (hasOpen) {
                return;
              }
            } catch (_) {
              // Fall through and attempt dial if peer ID parsing fails.
            }
          }
          await this.libp2p.dial(addr);
          debugLog('[NetworkManager] Dialed bootstrap peer', addrStr);
          await this._reserveRelayForPeer(peerIdStr, 'bootstrap-dial');
        } catch (err) {
          debugWarn('[NetworkManager] Failed to dial bootstrap peer', addrStr, err?.message || err);
          this._emitConnectionFailure({
            peerId: peerIdStr,
            address: addrStr,
            source: 'bootstrap',
            stage: 'dial',
            error: err
          });
        }
      })
    );
  }

  async _reserveRelayForPeer(peerIdStr, source = '') {
    if (!peerIdStr) return false;
    const reservationStore = this.relayTransport?.reservationStore;
    if (!reservationStore) {
      console.warn('[NetworkManager] Relay reservation store unavailable', source);
      return false;
    }
    if (typeof reservationStore.isStarted === 'function' && !reservationStore.isStarted()) {
      console.warn('[NetworkManager] Relay reservation store not started', source);
    }
    let peerId;
    try {
      peerId = peerIdFromString(peerIdStr);
    } catch (_) {
      return false;
    }
    if (reservationStore.hasReservation(peerId)) return true;
    try {
      await reservationStore.addRelay(peerId, 'configured');
      this.relayReservationPeers.add(peerIdStr);
      console.info('[NetworkManager] Relay reservation created', peerIdStr, source);
      return true;
    } catch (err) {
      debugWarn('[NetworkManager] Relay reservation failed', peerIdStr, source, err?.message || err);
      return false;
    }
  }

  async _reserveBootstrapRelayAddrs() {
    if (!this.config.bootstrapPeers?.length) return;
    const peerIds = Array.from(this.bootstrapPeerIds);
    await Promise.all(peerIds.map((peerId) => this._reserveRelayForPeer(peerId, 'bootstrap')));
  }

  async _logLocalAnnounceAddrs(label = 'status') {
    if (!this.libp2p?.getMultiaddrs) return;
    const addrs = this.libp2p.getMultiaddrs().map((addr) => addr.toString());
    const announceAddrs = this._getAnnounceAddrs();
    const webrtcAddrs = addrs.filter((addr) => addr.includes('/webrtc'));
    const relayAddrs = addrs.filter((addr) => addr.includes('/p2p-circuit'));
    console.info(`[NetworkManager] Local multiaddrs (${label})`, JSON.stringify(addrs));
    console.info(`[NetworkManager] Local webrtc addrs (${label})`, JSON.stringify(webrtcAddrs));
    console.info(`[NetworkManager] Local relay addrs (${label})`, JSON.stringify(relayAddrs));
    console.info(`[NetworkManager] Announce addrs (${label})`, JSON.stringify(announceAddrs));
    const reservationStore = this.relayTransport?.reservationStore;
    if (reservationStore?.reservationCount) {
      console.info(`[NetworkManager] Relay reservations (${label})`, {
        total: reservationStore.reservationCount(),
        configured: reservationStore.reservationCount('configured'),
        discovered: reservationStore.reservationCount('discovered')
      });
    }
    if (!this.libp2p?.peerStore?.get || !this.peerId) return;
    try {
      const selfId = peerIdFromString(this.peerId);
      const entry = await this.libp2p.peerStore.get(selfId);
      const storeAddrs = (entry?.addresses || [])
        .map((addr) => addr?.multiaddr?.toString?.())
        .filter(Boolean);
      console.info(`[NetworkManager] PeerStore addrs (${label})`, JSON.stringify(storeAddrs));
    } catch (err) {
      debugWarn('[NetworkManager] Failed to read peerStore addrs', err?.message || err);
    }
  }

  async _maybeDialPeer(peerId, source, addrs = null) {
    if (!this.libp2p || !peerId || peerId === this.peerId) return;
    if (this.bootstrapPeerIds.has(peerId)) return;
    const active = this._getConnectionsForPeer(peerId);
    const hasDirect = active.some((conn) => isTrulyDirectAddr(conn?.remoteAddr));
    const hasRelay = active.some((conn) => isRelayAddr(conn?.remoteAddr));
    const preferDirect = this.config.webrtc?.preferDirect !== false;
    if (hasDirect) return;
    if (!preferDirect && active.length > 0) return;
    const now = Date.now();
    const lastAttempt = this.recentDialAttempts.get(peerId) || 0;
    if (now - lastAttempt < PEER_DIAL_THROTTLE_MS) return;
    this.recentDialAttempts.set(peerId, now);
    const ensurePeerIdForAddr = (addr) => {
      if (!peerId) return addr;
      const addrStr = toAddrString(addr);
      if (!addrStr) return addr;
      return ensurePeerIdSuffix(addrStr, peerId);
    };
    const normalizeTargets = (list) => {
      if (!Array.isArray(list)) return [];
      const seen = new Set();
      return list
        .map((addr) => toPeerMultiaddr(ensurePeerIdForAddr(addr)))
        .filter(Boolean)
        .filter((addr) => {
          const key = toAddrString(addr);
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
    };
    const splitTargets = (list) => {
      const directTargets = [];
      const relayWebrtcTargets = [];
      const relayTargets = [];
      list.forEach((addr) => {
        const addrStr = addr?.toString?.() || String(addr || '');
        if (isRelayAddr(addrStr) && isWebRTCAddr(addrStr)) {
          relayWebrtcTargets.push(addr);
        } else if (isRelayOnlyAddr(addrStr)) {
          relayTargets.push(addr);
        } else {
          directTargets.push(addr);
        }
      });
      return { directTargets, relayWebrtcTargets, relayTargets };
    };
    let maybeDialTargets = normalizeTargets(addrs);
    let { directTargets, relayWebrtcTargets, relayTargets } = splitTargets(maybeDialTargets);
    let peerStoreAddrs = null;

    if (preferDirect) {
      if (directTargets.length === 0 && this.config.enablePeerDirectory) {
        const directoryResult = await this.queryPeerDirectory(peerId);
        if (directoryResult?.multiaddrs?.length > 0) {
          const directoryTargets = normalizeTargets(directoryResult.multiaddrs);
          const split = splitTargets(directoryTargets);
          directTargets = split.directTargets;
          relayWebrtcTargets = relayWebrtcTargets.length > 0 ? relayWebrtcTargets : split.relayWebrtcTargets;
          relayTargets = relayTargets.length > 0 ? relayTargets : split.relayTargets;
          debugLog('[NetworkManager] Got addresses from directory for:', peerId, directoryTargets.length);
        }
      }
      if (directTargets.length === 0 && this.libp2p?.peerStore?.get) {
        try {
          const peer = peerIdFromString(peerId);
          const entry = await this.libp2p.peerStore.get(peer);
          peerStoreAddrs = entry?.addresses?.map((addr) => addr?.multiaddr?.toString?.() || String(addr?.multiaddr || '')) || [];
          const storeTargets = normalizeTargets(entry?.addresses?.map((addr) => addr.multiaddr));
          const split = splitTargets(storeTargets);
          directTargets = split.directTargets;
          relayWebrtcTargets = relayWebrtcTargets.length > 0 ? relayWebrtcTargets : split.relayWebrtcTargets;
          relayTargets = relayTargets.length > 0 ? relayTargets : split.relayTargets;
        } catch (_) {
          // ignore peerStore lookup failures
        }
      }
      if (directTargets.length === 0) {
        const rememberedTargets = this._getRememberedDialTargets(peerId);
        if (rememberedTargets.length > 0) {
          const split = splitTargets(rememberedTargets);
          directTargets = split.directTargets;
          if (relayWebrtcTargets.length === 0) {
            relayWebrtcTargets = split.relayWebrtcTargets;
          }
          if (relayTargets.length === 0) {
            relayTargets = split.relayTargets;
          }
        }
      }
    }

    let orderedTargets = [];
    const preferIpv6 = this._hasLocalIpv6Addrs();
    if (preferDirect) {
      if (directTargets.length > 0) {
        orderedTargets = orderDialTargets(directTargets, preferIpv6);
      } else if (!hasRelay && relayWebrtcTargets.length > 0) {
        orderedTargets = relayWebrtcTargets;
      } else if (!hasRelay && relayTargets.length > 0) {
        orderedTargets = relayTargets;
      }
    } else {
      orderedTargets = maybeDialTargets.length > 0 ? maybeDialTargets : relayTargets;
    }

    if (orderedTargets.length > 0) {
      if (preferDirect) {
        if (directTargets.length > 0) {
          console.info('[NetworkManager] Direct dial targets', peerId, formatDialTargets(orderedTargets));
        } else if (relayWebrtcTargets.length > 0) {
          console.info('[NetworkManager] No direct targets, using relay-webrtc', peerId, formatDialTargets(orderedTargets));
        } else if (relayTargets.length > 0) {
          console.info('[NetworkManager] No direct targets, using relay', peerId, formatDialTargets(orderedTargets));
          if (peerStoreAddrs && peerStoreAddrs.length > 0) {
            console.info('[NetworkManager] PeerStore addrs', peerId, peerStoreAddrs);
          }
        }
      }
      for (const addr of orderedTargets) {
        const addrStr = toAddrString(addr);
        const kind = getDialKind(addrStr);
        const progressLogger = addrStr.includes('/webrtc')
          ? (() => {
              const seenEvents = new Set();
              const candidateCounts = new Map();
              return (event) => {
                const eventType = event?.type || '';
                if (!eventType.startsWith('webrtc:')) return;
                if (eventType === 'webrtc:add-ice-candidate') {
                  const info = parseIceCandidate(event?.detail);
                  if (!info) return;
                  const key = info.type || 'unknown';
                  const count = candidateCounts.get(key) || 0;
                  candidateCounts.set(key, count + 1);
                  const logKey = `ice:${key}`;
                  if (!seenEvents.has(logKey)) {
                    console.info('[NetworkManager] ICE candidate', peerId, key, info.protocol, info.address);
                    seenEvents.add(logKey);
                  }
                  return;
                }
                if (eventType === 'webrtc:end-of-ice-candidates') {
                  const summary = Array.from(candidateCounts.entries())
                    .map(([key, count]) => `${key}=${count}`)
                    .join(', ') || 'none';
                  console.info('[NetworkManager] ICE gathering done', peerId, summary);
                  return;
                }
                if (!seenEvents.has(eventType)) {
                  console.info('[NetworkManager] WebRTC progress', peerId, eventType, addrStr);
                  seenEvents.add(eventType);
                }
              };
            })()
          : null;
        if (kind !== 'relay') {
          console.info('[NetworkManager] Dial attempt', peerId, kind, addrStr);
        }
        try {
          await this.libp2p.dial(addr, progressLogger ? { onProgress: progressLogger } : undefined);
          debugLog('[NetworkManager] Dialed discovered peer', peerId, source ? `(${source})` : '', addr.toString());
          return;
        } catch (err) {
          if (kind !== 'relay') {
            console.warn('[NetworkManager] Dial failed', peerId, kind, addrStr, err?.message || err);
          } else {
            debugWarn('[NetworkManager] Failed to dial discovered peer', peerId, addr.toString(), err?.message || err);
          }
          this._emitConnectionFailure({
            peerId,
            address: addr.toString(),
            source,
            stage: 'dial',
            error: err
          });
        }
      }
    }
    // Phase 4: Try relay reconnection if all direct addresses failed
    if (orderedTargets.length > 0 && !this._hasBootstrapRelayConnections()) {
      const reconnected = await this._reconnectRelayForDial(peerId);
      if (reconnected) {
        const circuitAddr = this._buildCircuitAddr(peerId);
        if (circuitAddr) {
          try {
            await this.libp2p.dial(circuitAddr);
            debugLog('[NetworkManager] Dialed via relay circuit after reconnect:', peerId);
            this._scheduleAutoRelayDrop();
            return;
          } catch (err) {
            debugWarn('[NetworkManager] Circuit dial failed after reconnect:', peerId, err?.message || err);
            this._emitConnectionFailure({
              peerId,
              address: circuitAddr.toString(),
              source,
              stage: 'dial',
              error: err
            });
          }
        }
      }
    }
    if (preferDirect && hasRelay) return;
    let target = peerId;
    try {
      target = peerIdFromString(peerId);
    } catch (_) {
      return;
    }
    try {
      await this.libp2p.dial(target);
      debugLog('[NetworkManager] Dialed discovered peer', peerId, source ? `(${source})` : '');
    } catch (err) {
      console.warn('[NetworkManager] Dial failed', peerId, 'peerId', err?.message || err);
      this._emitConnectionFailure({
        peerId,
        source,
        stage: 'dial',
        error: err
      });
    }
  }

  _hasLocalIpv6Addrs() {
    if (!this.libp2p?.getMultiaddrs) return false;
    const addrs = this.libp2p.getMultiaddrs().map((addr) => addr.toString());
    return addrs.some((addr) => {
      if (!addr.includes('/ip6/')) return false;
      if (addr.includes('/ip6/::1')) return false;
      if (addr.includes('/ip6/::')) return false;
      if (addr.includes('/ip6/fe80:')) return false;
      return true;
    });
  }

  _getAnnounceAddrs() {
    if (!this.libp2p?.getMultiaddrs) return [];
    const addrs = this.libp2p.getMultiaddrs().map((addr) => addr.toString());
    const scoped = addrs.filter((addr) => addr.includes('/p2p-circuit') || addr.includes('/webrtc'));
    const candidates = scoped.length > 0 ? scoped : addrs;
    const preferDirect = this.config.webrtc?.preferDirect !== false;
    if (preferDirect && !addrs.some((addr) => addr.includes('/webrtc'))) {
      const now = Date.now();
      if (!this.lastWebrtcAnnounceWarnAt || now - this.lastWebrtcAnnounceWarnAt > 60000) {
        console.info('[NetworkManager] No local /webrtc addrs to announce; using relay-scoped WebRTC announce addrs.');
        this.lastWebrtcAnnounceWarnAt = now;
      }
    }
    const preferIpv6 = this._hasLocalIpv6Addrs();
    const ordered = preferDirect ? orderDialTargets(candidates, preferIpv6) : candidates;
    const peerId = this.peerId;
    const relayAddrs = [];
    const relayWebrtcAddrs = [];
    if (peerId && Array.isArray(this.config.bootstrapPeers)) {
      this.config.bootstrapPeers
        .filter((addr) => typeof addr === 'string' && addr.includes('/p2p/'))
        .map((addr) => normalizeBootstrapAddr(addr))
        .forEach((addr) => {
          relayAddrs.push(`${addr}/p2p-circuit/p2p/${peerId}`);
          relayWebrtcAddrs.push(`${addr}/p2p-circuit/webrtc/p2p/${peerId}`);
        });
    }
    const normalized = [...ordered, ...relayAddrs, ...relayWebrtcAddrs]
      .map((addr) => ensurePeerIdSuffix(addr, peerId));
    return Array.from(new Set(normalized));
  }

  getAnnounceAddrs() {
    return this._getAnnounceAddrs();
  }

  _getConnectionsForPeer(peerId) {
    if (!this.libp2p?.getConnections) return [];
    const connections = this.libp2p.getConnections(peerId);
    if (Array.isArray(connections)) return connections;
    if (connections && typeof connections.values === 'function') {
      return Array.from(connections.values()).flat();
    }
    return [];
  }

  _getPreferredConnectionType(peerId) {
    const connections = this._getConnectionsForPeer(peerId);
    if (connections.some((conn) => isWebRTCAddr(conn?.remoteAddr) && !isRelayAddr(conn?.remoteAddr))) {
      return 'webrtc';
    }
    if (connections.some((conn) => isDirectAddr(conn?.remoteAddr) && !isWebRTCAddr(conn?.remoteAddr))) {
      return 'direct';
    }
    if (connections.some((conn) => isRelayWebRTCAddr(conn?.remoteAddr))) {
      return 'relay-webrtc';
    }
    if (connections.some((conn) => isRelayOnlyAddr(conn?.remoteAddr))) {
      return 'relay';
    }
    return null;
  }

  _maybePruneRelayConnections(peerId) {
    if (!this.libp2p) return;
    if (this.bootstrapPeerIds.has(peerId)) return;
    if (this.config.webrtc?.dropRelayOnDirect === false) return;
    const connections = this._getConnectionsForPeer(peerId);
    if (connections.length === 0) return;
    const hasDirect = connections.some((conn) => isTrulyDirectAddr(conn?.remoteAddr));
    if (!hasDirect) return;
    const relayed = connections.filter((conn) => isRelayOnlyAddr(conn?.remoteAddr));
    relayed.forEach((conn) => {
      if (conn?.status && conn.status !== 'open') return;
      conn.close?.().catch?.(() => {});
    });
  }

  _logPubsubStatus(label) {
    if (!this.libp2p?.services?.pubsub) return;
    if (!DEBUG_P2P) return;
    const pubsub = this.libp2p.services.pubsub;
    const peers = typeof pubsub.getPeers === 'function' ? pubsub.getPeers() : [];
    const presencePeers = typeof pubsub.getSubscribers === 'function'
      ? pubsub.getSubscribers(this.config.presenceTopic)
      : [];
    if (Array.isArray(peers) && peers.length === 0) {
      debugWarn(`[NetworkManager] Pubsub has no peers (${label})`);
    }
    if (Array.isArray(presencePeers) && presencePeers.length === 0) {
      debugWarn(`[NetworkManager] No subscribers on presence topic (${label})`);
    }
    const announceAddrs = this._getAnnounceAddrs();
    if (announceAddrs.length === 0) {
      debugWarn(`[NetworkManager] No announce addrs available (${label})`);
    }
  }

  _rememberPeerAddresses(peerId, addrs) {
    if (!Array.isArray(addrs) || addrs.length === 0) return;
    this._rememberDialTargets(peerId, addrs);
    if (!this.libp2p?.peerStore?.merge) return;
    let peer;
    try {
      peer = peerIdFromString(peerId);
    } catch (_) {
      return;
    }
    const multiaddrs = addrs.map(toPeerMultiaddr).filter(Boolean);
    if (multiaddrs.length === 0) return;
    this.libp2p.peerStore.merge(peer, { multiaddrs }).catch(() => {});
  }

  _rememberDialTargets(peerId, addrs) {
    if (!peerId || !Array.isArray(addrs) || addrs.length === 0) return;
    const now = Date.now();
    const current = this.peerDialAddrCache.get(peerId) || { addrs: new Set(), updatedAt: now };
    let changed = false;
    addrs.forEach((value) => {
      const addr = ensurePeerIdSuffix(toAddrString(value), peerId);
      if (!addr) return;
      const parsed = toPeerMultiaddr(addr);
      if (parsed) {
        const normalized = parsed.toString();
        if (!current.addrs.has(normalized)) {
          current.addrs.add(normalized);
          changed = true;
        }
      }
    });
    if (!changed && !this.peerDialAddrCache.has(peerId)) return;
    current.updatedAt = now;
    this.peerDialAddrCache.set(peerId, current);
    this._pruneRememberedDialTargets(now);
  }

  _getRememberedDialTargets(peerId, now = Date.now()) {
    const cached = this.peerDialAddrCache.get(peerId);
    if (!cached || !(cached.addrs instanceof Set)) return [];
    if (now - (cached.updatedAt || 0) > REMEMBERED_DIAL_ADDR_TTL_MS) {
      this.peerDialAddrCache.delete(peerId);
      return [];
    }
    return Array.from(cached.addrs)
      .map((addr) => toPeerMultiaddr(addr))
      .filter(Boolean);
  }

  _pruneRememberedDialTargets(now = Date.now()) {
    for (const [peerId, entry] of this.peerDialAddrCache.entries()) {
      if (now - (entry?.updatedAt || 0) > REMEMBERED_DIAL_ADDR_TTL_MS) {
        this.peerDialAddrCache.delete(peerId);
      }
    }
  }
}
