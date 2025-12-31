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

const DEFAULT_PUBSUB_TOPIC = 'peercompute-state-sync';
const DEFAULT_DIRECT_TOPIC = 'peercompute-direct';
const DEFAULT_PRESENCE_TOPIC = 'peercompute-presence';
const PEER_DIAL_THROTTLE_MS = 5000;

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

const scoreDialTarget = (addr) => {
  const value = toAddrString(addr);
  const hasRelay = value.includes('/p2p-circuit');
  const hasWebRTC = value.includes('/webrtc');
  if (hasWebRTC && !hasRelay) return 3;
  if (hasWebRTC) return 2;
  if (!hasRelay) return 1;
  return 0;
};

const orderDialTargets = (targets) => {
  const scored = targets.map((addr, index) => ({
    addr,
    score: scoreDialTarget(addr),
    index
  }));
  scored.sort((a, b) => (b.score - a.score) || (a.index - b.index));
  return scored.map((entry) => entry.addr);
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

const normalizeWebRTCConfig = (config = {}) => {
  const raw = config && typeof config.webrtc === 'object' && config.webrtc ? config.webrtc : {};
  const preferDirect = raw.preferDirect ?? config.preferDirect ?? true;
  const dropRelayOnDirect = raw.dropRelayOnDirect ?? config.dropRelayOnDirect ?? true;
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

    const defaults = {
      topology: config.topology || 'distributed',
      pubsubTopic: config.pubsubTopic || DEFAULT_PUBSUB_TOPIC,
      directTopic: config.directTopic || DEFAULT_DIRECT_TOPIC,
      presenceTopic: config.presenceTopic || DEFAULT_PRESENCE_TOPIC,
      discoveryTopic: config.discoveryTopic || 'peercompute._peer-discovery._p2p._pubsub',
      bootstrapPeers: Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers : [],
      gameId: config.gameId || 'default-game',
      roomId: config.roomId || 'default-room',
      enforceRoomIsolation: config.enforceRoomIsolation !== false,
      enableTelemetry: config.enableTelemetry !== false,
      webrtc: webrtcConfig,
      telemetrySampleMs,
      telemetryPingMs,
      presenceIntervalMs,
      pubsubType,
      gossipsub: gossipsubOptions
    };

    const normalizedBootstrapPeers = defaults.bootstrapPeers.map((addr) =>
      typeof addr === 'string' ? normalizeBootstrapAddr(addr) : addr
    );
    const allowLocalDial = config.allowLocalDial ?? normalizedBootstrapPeers.some(isLocalDialAddr);
    this.config = {
      ...defaults,
      ...config,
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
    this.presenceInterval = null;
    this.publishErrorAt = new Map();

    this.peers = new Map();
    this.recentDialAttempts = new Map();
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
    this.messageHandlers = [];
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
    [this.schedulerProfile.snapshotTopic, this.schedulerProfile.commandTopic, this.schedulerProfile.eventTopic]
      .filter(Boolean)
      .forEach((topic) => this.allowedTopics.add(topic));
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

    if (!useGossipsub) {
      peerDiscovery.push(pubsubPeerDiscovery({
        interval: 1000,
        topics: [this.config.discoveryTopic]
      }));
    }

    const rtcConfiguration = this.config.webrtc?.rtcConfiguration || {};
    const webRtcTransport = Object.keys(rtcConfiguration).length > 0
      ? webRTC({ rtcConfiguration })
      : webRTC();
    const privateKey = useGossipsub ? await generateKeyPair('Ed25519') : null;

    this.libp2p = await createLibp2p({
      ...(privateKey ? { privateKey } : {}),
      transports: [
        webSockets(),
        webRtcTransport,
        circuitRelayTransport()
      ],
      connectionEncrypters: [noise(), plaintext()],
      streamMuxers: [yamux()],
      peerDiscovery,
      services: {
        identify: identify(),
        ping: ping({ interval: 10000 }),
        pubsub: this._buildPubsubService()
      },
      connectionManager: {
        minConnections: 0,
        maxConnections: 200,
        inboundConnectionThreshold: Infinity,
        maxIncomingPendingConnections: 100
      },
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
    if (privateKey && this.libp2p?.peerId) {
      this.libp2p.peerId.privateKey = privateKeyToProtobuf(privateKey);
      this.libp2p.peerId.publicKey = publicKeyToProtobuf(privateKey.publicKey);
    }

    this._wireLibp2pEvents();
    return this.libp2p;
  }

  async connect() {
    if (this.isConnected) return;
    if (!this.libp2p) {
      throw new Error('NetworkManager not initialized');
    }

    await this.libp2p.start();
    this.peerId = this.libp2p.peerId.toString();

    // Subscribe to topics used by PeerCompute
    this.libp2p.services.pubsub.subscribe(this.config.pubsubTopic);
    this.libp2p.services.pubsub.subscribe(this.config.directTopic);
    this.libp2p.services.pubsub.subscribe(this.config.presenceTopic);
    this._recordPubsubTx(0);

    await this._dialBootstrapPeers();

    this._startPresence();
    this._logPubsubStatus('connected');
    this.isConnected = true;
    this._sampleTelemetry(Date.now());
    this._startTelemetrySampler();
    if (this.schedulerEnabled) {
      this._ensureScheduler();
      this._startScheduler();
    }
  }

  async redialBootstrapPeers() {
    if (!this.libp2p) return;
    await this._dialBootstrapPeers();
  }

  async disconnect() {
    this.isConnected = false;
    this._stopScheduler();
    this._clearPresenceTimer();
    this._stopTelemetrySampler();

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
      connections: connectionCount
    };
  }

  getTelemetrySnapshot() {
    const now = Date.now();
    const networkStats = this.getNetworkStats();
    const health = this.getHealth();
    const peers = this.getConnectedPeers().map((peer) => ({
      peerId: peer.peerId,
      connectedAt: peer.connectedAt || null,
      lastSeen: peer.lastSeen || null,
      lastMessageTime: peer.lastMessageTime || null,
      lastRxAt: peer.lastRxAt || null,
      lastTxAt: peer.lastTxAt || null,
      lastRttAt: peer.lastRttAt || null,
      rttMs: Number.isFinite(peer.rttMs) ? peer.rttMs : null,
      via: peer.via || null,
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
      peers
    };
  }

  getLibp2pNode() {
    return this.libp2p;
  }

  _wireLibp2pEvents() {
    if (!this.libp2p) return;

    this.libp2p.addEventListener('connection:open', (evt) => {
      const conn = evt.detail;
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId) return;
      const via = this._getPreferredConnectionType(peerId);
      if (via) {
        this._touchPeer(peerId, { via });
      }
      this._maybePruneRelayConnections(peerId);
    });

    this.libp2p.addEventListener('connection:close', (evt) => {
      const conn = evt.detail;
      const peerId = conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.();
      if (!peerId) return;
      const via = this._getPreferredConnectionType(peerId);
      if (via) {
        this._touchPeer(peerId, { via });
      }
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
      this._touchPeer(peerId, {
        connectedAt: Date.now(),
        via: preferredVia || existingVia || 'connection'
      });
      if (isNewPeer) {
        this.onPeerConnect(peerId);
      }
    });

    this.libp2p.addEventListener('peer:disconnect', (evt) => {
      const peerId = evt.detail?.remotePeer?.toString?.() || evt.detail?.toString?.();
      if (!peerId) return;
      this.peers.delete(peerId);
      this.onPeerDisconnect(peerId);
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

      if (topic === this.config.directTopic) {
        if (parsed?.target && parsed.target !== this.peerId) return;
      }

      if (!this._matchesScope(parsed)) return;

      const payload = parsed?.payload ?? parsed;
      const from = parsed?.from;
      if (from && from !== this.peerId) {
        this._touchPeer(from, { lastMessageTime: Date.now() });
      }

      this._dispatchMessage(from || 'unknown', payload);
    });
  }

  _buildPubsubService() {
    if (this.config.pubsubType === 'gossipsub') {
      const directPeers = this._buildGossipsubDirectPeers();
      const configured = this.config.gossipsub || {};
      const options = {
        emitSelf: false,
        allowPublishToZeroPeers: true,
        ...configured
      };
      if (configured.allowPublishToZeroTopicPeers !== undefined && options.allowPublishToZeroPeers === undefined) {
        options.allowPublishToZeroPeers = configured.allowPublishToZeroTopicPeers;
      }
      if (directPeers.length > 0 && !options.directPeers) {
        options.directPeers = directPeers;
      }
      return gossipsub(options);
    }
    return floodsub();
  }

  _buildGossipsubDirectPeers() {
    const peers = new Map();
    (this.config.bootstrapPeers || []).forEach((addr) => {
      const addrStr = toAddrString(addr);
      const peerIdStr = getPeerIdFromAddr(addrStr);
      if (!peerIdStr) return;
      let peerId = null;
      try {
        peerId = peerIdFromString(peerIdStr);
      } catch (_) {
        return;
      }
      const ma = toPeerMultiaddr(addrStr);
      if (!ma) return;
      const entry = peers.get(peerIdStr) || { id: peerId, addrs: [] };
      if (!entry.addrs.some((existing) => existing.toString() === ma.toString())) {
        entry.addrs.push(ma);
      }
      peers.set(peerIdStr, entry);
    });
    return Array.from(peers.values());
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
      payload,
      ...extra
    };
  }

  _matchesScope(message) {
    if (!message) return true;
    if (message.gameId && message.gameId !== this.config.gameId) return false;
    if (message.roomId && message.roomId !== this.config.roomId) return false;
    return true;
  }

  _handlePresence(message) {
    if (!message || !this._matchesScope(message)) return;
    if (!message.from || message.from === this.peerId) return;
    const isNewPeer = !this.peers.has(message.from);
    this._touchPeer(message.from, {
      gameId: message.gameId,
      roomId: message.roomId,
      lastSeen: Date.now(),
      via: 'presence'
    });
    if (isNewPeer) {
      this.onPeerConnect(message.from);
    }
    if (Array.isArray(message.multiaddrs) && message.multiaddrs.length > 0) {
      this._rememberPeerAddresses(message.from, message.multiaddrs);
    }
    this._maybeDialPeer(message.from, 'presence', message.multiaddrs).catch(() => {});
  }

  _getScopedPeers() {
    return Array.from(this.peers.entries())
      .filter(([, meta]) => meta?.gameId === this.config.gameId && meta?.roomId === this.config.roomId)
      .map(([peerId, meta]) => ({ peerId, ...meta }));
  }

  _getConnectionPeers() {
    if (!this.libp2p?.getConnections) return [];
    const byId = new Map();
    const connections = this.libp2p.getConnections();
    const connectionList = Array.isArray(connections)
      ? connections
      : typeof connections?.values === 'function'
        ? Array.from(connections.values()).reduce((acc, value) => acc.concat(value), [])
        : [];
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

  _shouldDialDiscoveredPeer(peerId) {
    if (!peerId) return false;
    if (!this.config.enforceRoomIsolation) return true;
    if (this.bootstrapPeerIds.has(peerId)) return true;
    return this.peers.has(peerId);
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

  _startPresence() {
    this._clearPresenceTimer();
    const publishPresence = async () => {
      if (!this.peerId) return;
      const payload = {
        type: 'presence',
        from: this.peerId,
        gameId: this.config.gameId,
        roomId: this.config.roomId,
        multiaddrs: this._getAnnounceAddrs()
      };
      await this._publish(this.config.presenceTopic, payload);
    };

    publishPresence().catch(() => {});
    this.presenceInterval = setInterval(() => {
      publishPresence().catch(() => {});
    }, this.config.presenceIntervalMs || 3000);
  }

  _clearPresenceTimer() {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
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
      isInScope: (message) => this._matchesScope(message)
    };
  }

  async _sendScheduledSnapshot(message) {
    if (!this.isConnected) return;
    if (this.schedulerProfile.snapshotsRequireAuthority && this.authorityId && this.authorityId !== this.peerId) {
      return;
    }
    const topic = this.scheduler?.getProfile()?.snapshotTopic || this.config.pubsubTopic;
    await this._publish(topic, message);
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
    this._recordPubsubTx(0);
  }

  async _publish(topic, payload) {
    if (!this.libp2p?.services?.pubsub) return;
    const data = encoder.encode(JSON.stringify(payload));
    try {
      await this.libp2p.services.pubsub.publish(topic, data);
      const now = Date.now();
      this.lastTxAt = now;
      this.scheduler?.recordTx(now);
      this._recordTx(payload?.target || null, getByteLength(data));
      this._recordPubsubTx(getByteLength(data));
    } catch (err) {
      const now = Date.now();
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
        try {
          const addrStr = addr.toString();
          const peerIdStr = getPeerIdFromAddr(addrStr);
          if (peerIdStr) {
            try {
              const peerId = peerIdFromString(peerIdStr);
              const existing = this.libp2p?.getConnections?.(peerId) || [];
              if (existing.length > 0) {
                return;
              }
            } catch (_) {
              // Fall through and attempt dial if peer ID parsing fails.
            }
          }
          await this.libp2p.dial(addr);
          debugLog('[NetworkManager] Dialed bootstrap peer', addr.toString());
        } catch (err) {
          debugWarn('[NetworkManager] Failed to dial bootstrap peer', addr.toString(), err?.message || err);
        }
      })
    );
  }

  async _maybeDialPeer(peerId, source, addrs = null) {
    if (!this.libp2p || !peerId || peerId === this.peerId) return;
    if (this.bootstrapPeerIds.has(peerId)) return;
    const active = this._getConnectionsForPeer(peerId);
    const hasDirect = active.some((conn) => !isRelayAddr(conn?.remoteAddr));
    const hasRelay = active.some((conn) => isRelayAddr(conn?.remoteAddr));
    const preferDirect = this.config.webrtc?.preferDirect !== false;
    if (hasDirect) return;
    if (!preferDirect && active.length > 0) return;
    const now = Date.now();
    const lastAttempt = this.recentDialAttempts.get(peerId) || 0;
    if (now - lastAttempt < PEER_DIAL_THROTTLE_MS) return;
    this.recentDialAttempts.set(peerId, now);
    const maybeDialTargets = Array.isArray(addrs) && addrs.length > 0
      ? addrs.map(toPeerMultiaddr).filter(Boolean)
      : [];
    const orderedTargets = preferDirect ? orderDialTargets(maybeDialTargets) : maybeDialTargets;
    if (orderedTargets.length > 0) {
      for (const addr of orderedTargets) {
        try {
          await this.libp2p.dial(addr);
          debugLog('[NetworkManager] Dialed discovered peer', peerId, source ? `(${source})` : '', addr.toString());
          return;
        } catch (err) {
          debugWarn('[NetworkManager] Failed to dial discovered peer', peerId, addr.toString(), err?.message || err);
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
      debugWarn('[NetworkManager] Failed to dial discovered peer', peerId, err?.message || err);
    }
  }

  _getAnnounceAddrs() {
    if (!this.libp2p?.getMultiaddrs) return [];
    const addrs = this.libp2p.getMultiaddrs().map((addr) => addr.toString());
    const scoped = addrs.filter((addr) => addr.includes('/p2p-circuit') || addr.includes('/webrtc'));
    const candidates = scoped.length > 0 ? scoped : addrs;
    const preferDirect = this.config.webrtc?.preferDirect !== false;
    const ordered = preferDirect ? orderDialTargets(candidates) : candidates;
    const peerId = this.peerId;
    const normalized = ordered.map((addr) => ensurePeerIdSuffix(addr, peerId));
    return Array.from(new Set(normalized));
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
    if (connections.some((conn) => !isRelayAddr(conn?.remoteAddr))) {
      return 'direct';
    }
    if (connections.some((conn) => isRelayAddr(conn?.remoteAddr))) {
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
    const hasDirect = connections.some((conn) => !isRelayAddr(conn?.remoteAddr));
    if (!hasDirect) return;
    const relayed = connections.filter((conn) => isRelayAddr(conn?.remoteAddr));
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
    if (!this.libp2p?.peerStore?.merge) return;
    if (!Array.isArray(addrs) || addrs.length === 0) return;
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
}
