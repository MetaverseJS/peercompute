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
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { bootstrap } from '@libp2p/bootstrap';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { peerIdFromString } from '@libp2p/peer-id';
import { multiaddr } from '@multiformats/multiaddr';

const DEFAULT_PUBSUB_TOPIC = 'peercompute-state-sync';
const DEFAULT_DIRECT_TOPIC = 'peercompute-direct';
const DEFAULT_PRESENCE_TOPIC = 'peercompute-presence';
const PEER_DIAL_THROTTLE_MS = 5000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

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
    console.warn('[NetworkManager] Invalid peer multiaddr', addr, err?.message || err);
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
    console.warn('[NetworkManager] Invalid bootstrap multiaddr', normalized, err?.message || err);
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
    const defaults = {
      topology: config.topology || 'distributed',
      pubsubTopic: config.pubsubTopic || DEFAULT_PUBSUB_TOPIC,
      directTopic: config.directTopic || DEFAULT_DIRECT_TOPIC,
      presenceTopic: config.presenceTopic || DEFAULT_PRESENCE_TOPIC,
      discoveryTopic: config.discoveryTopic || 'peercompute._peer-discovery._p2p._pubsub',
      bootstrapPeers: Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers : [],
      gameId: config.gameId || 'default-game',
      roomId: config.roomId || 'default-room'
    };

    const normalizedBootstrapPeers = defaults.bootstrapPeers.map((addr) =>
      typeof addr === 'string' ? normalizeBootstrapAddr(addr) : addr
    );
    const allowLocalDial = config.allowLocalDial ?? normalizedBootstrapPeers.some(isLocalDialAddr);
    this.config = {
      ...defaults,
      ...config,
      bootstrapPeers: normalizedBootstrapPeers,
      allowLocalDial
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
    this.onMessage = config.onMessage || (() => {});
    this.onPeerConnect = config.onPeerConnect || (() => {});
    this.onPeerDisconnect = config.onPeerDisconnect || (() => {});
    this.messageHandlers = [];
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  async initialize() {
    const isBrowser = typeof window !== 'undefined';
    const listenAddrs = isBrowser ? ['/p2p-circuit', '/webrtc'] : ['/ip4/0.0.0.0/tcp/0'];
    const peerDiscovery = [
      pubsubPeerDiscovery({
        interval: 1000,
        topics: [this.config.discoveryTopic]
      })
    ];

    if (this.config.bootstrapPeers?.length) {
      peerDiscovery.unshift(bootstrap({ list: this.config.bootstrapPeers }));
    }

    this.libp2p = await createLibp2p({
      transports: [
        webSockets(),
        webRTC(),
        circuitRelayTransport()
      ],
      connectionEncrypters: [noise(), plaintext()],
      streamMuxers: [yamux()],
      peerDiscovery,
      services: {
        identify: identify(),
        ping: ping({ interval: 10000 }),
        pubsub: floodsub()
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
      ...(this.config.allowLocalDial
        ? {
            connectionGater: {
              denyDialMultiaddr: () => false
            }
          }
        : {})
    });

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

    await this._dialBootstrapPeers();

    this._startPresence();
    this._logPubsubStatus('connected');
    this.isConnected = true;
  }

  async redialBootstrapPeers() {
    if (!this.libp2p) return;
    await this._dialBootstrapPeers();
  }

  async disconnect() {
    this.isConnected = false;
    this._clearPresenceTimer();

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

  getLibp2pNode() {
    return this.libp2p;
  }

  _wireLibp2pEvents() {
    if (!this.libp2p) return;

    this.libp2p.addEventListener('peer:discovery', (evt) => {
      const peerId = evt.detail?.id?.toString?.() || evt.detail?.id?.toString?.();
      if (!peerId || peerId === this.peerId) return;
      this._maybeDialPeer(peerId, 'discovery').catch(() => {});
    });

    this.libp2p.addEventListener('peer:connect', (evt) => {
      const peerId = evt.detail?.remotePeer?.toString?.() || evt.detail?.toString?.();
      if (!peerId) return;
      const isNewPeer = !this.peers.has(peerId);
      this._touchPeer(peerId, { connectedAt: Date.now(), via: 'connection' });
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

      let parsed = null;
      try {
        parsed = JSON.parse(decoder.decode(data));
      } catch (err) {
        console.warn('[NetworkManager] Failed to parse pubsub payload', err);
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

  _touchPeer(peerId, updates) {
    const existing = this.peers.get(peerId) || {};
    this.peers.set(peerId, { ...existing, ...updates });
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
    }, 3000);
  }

  _clearPresenceTimer() {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
    }
  }

  async _publish(topic, payload) {
    if (!this.libp2p?.services?.pubsub) return;
    const data = encoder.encode(JSON.stringify(payload));
    try {
      await this.libp2p.services.pubsub.publish(topic, data);
    } catch (err) {
      const now = Date.now();
      const last = this.publishErrorAt.get(topic) || 0;
      if (now - last > 5000) {
        this.publishErrorAt.set(topic, now);
        console.warn('[NetworkManager] Publish failed', topic, err?.message || err);
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
          console.log('[NetworkManager] Dialed bootstrap peer', addr.toString());
        } catch (err) {
          console.warn('[NetworkManager] Failed to dial bootstrap peer', addr.toString(), err?.message || err);
        }
      })
    );
  }

  async _maybeDialPeer(peerId, source, addrs = null) {
    if (!this.libp2p || !peerId || peerId === this.peerId) return;
    if (this.bootstrapPeerIds.has(peerId)) return;
    const active = this.libp2p.getConnections?.(peerId) || [];
    if (active.length > 0) return;
    const now = Date.now();
    const lastAttempt = this.recentDialAttempts.get(peerId) || 0;
    if (now - lastAttempt < PEER_DIAL_THROTTLE_MS) return;
    this.recentDialAttempts.set(peerId, now);
    const maybeDialTargets = Array.isArray(addrs) && addrs.length > 0
      ? addrs.map(toPeerMultiaddr).filter(Boolean)
      : [];
    if (maybeDialTargets.length > 0) {
      for (const addr of maybeDialTargets) {
        try {
          await this.libp2p.dial(addr);
          console.log('[NetworkManager] Dialed discovered peer', peerId, source ? `(${source})` : '', addr.toString());
          return;
        } catch (err) {
          console.warn('[NetworkManager] Failed to dial discovered peer', peerId, addr.toString(), err?.message || err);
        }
      }
    }
    let target = peerId;
    try {
      target = peerIdFromString(peerId);
    } catch (_) {
      return;
    }
    try {
      await this.libp2p.dial(target);
      console.log('[NetworkManager] Dialed discovered peer', peerId, source ? `(${source})` : '');
    } catch (err) {
      console.warn('[NetworkManager] Failed to dial discovered peer', peerId, err?.message || err);
    }
  }

  _getAnnounceAddrs() {
    if (!this.libp2p?.getMultiaddrs) return [];
    const addrs = this.libp2p.getMultiaddrs().map((addr) => addr.toString());
    const scoped = addrs.filter((addr) => addr.includes('/p2p-circuit') || addr.includes('/webrtc'));
    const candidates = scoped.length > 0 ? scoped : addrs;
    const peerId = this.peerId;
    const normalized = candidates.map((addr) => ensurePeerIdSuffix(addr, peerId));
    return Array.from(new Set(normalized));
  }

  _logPubsubStatus(label) {
    if (!this.libp2p?.services?.pubsub) return;
    const pubsub = this.libp2p.services.pubsub;
    const peers = typeof pubsub.getPeers === 'function' ? pubsub.getPeers() : [];
    const presencePeers = typeof pubsub.getSubscribers === 'function'
      ? pubsub.getSubscribers(this.config.presenceTopic)
      : [];
    if (Array.isArray(peers) && peers.length === 0) {
      console.warn(`[NetworkManager] Pubsub has no peers (${label})`);
    }
    if (Array.isArray(presencePeers) && presencePeers.length === 0) {
      console.warn(`[NetworkManager] No subscribers on presence topic (${label})`);
    }
    const announceAddrs = this._getAnnounceAddrs();
    if (announceAddrs.length === 0) {
      console.warn(`[NetworkManager] No announce addrs available (${label})`);
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
