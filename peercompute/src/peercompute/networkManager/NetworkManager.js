/**
 * @fileoverview Network Manager - PeerJS-based P2P networking
 * Provides simple data connections and broadcast via PeerJS and BroadcastChannel discovery.
 */

import Peer from 'peerjs';

export class NetworkManager {
  constructor(config = {}) {
    const defaults = {
      topology: config.topology || 'distributed',
      pubsubTopic: config.pubsubTopic || 'peercompute-default',
      peerServer: {
        host: 'localhost',
        port: 9000,
        path: '/peerjs',
        secure: false,
        ...(config.peerServer || {})
      },
      gameId: config.gameId || 'default-game',
      roomId: config.roomId || 'default-room'
    };
    this.config = { ...defaults, ...config, peerServer: defaults.peerServer };

    this.peer = null;
    this.peerId = null;
    this.connections = new Map(); // peerId -> PeerJS DataConnection
    this.discoveryChannel = null;
    this.isConnected = false;

    this.peers = new Map();
    this.onMessage = config.onMessage || (() => {});
    this.onPeerConnect = config.onPeerConnect || (() => {});
    this.onPeerDisconnect = config.onPeerDisconnect || (() => {});
    this.messageHandlers = [];
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer({
          config: this.config.rtcConfiguration,
          host: this.config.peerServer.host,
          port: this.config.peerServer.port,
          path: this.config.peerServer.path,
          secure: this.config.peerServer.secure
        });

        this.peer.on('open', (id) => {
          this.peerId = id;
          console.log(`[NetworkManager] PeerJS initialized with ID ${id}`);
          resolve(this.peer);
        });

        this.peer.on('connection', (conn) => {
          this._registerConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.error('[NetworkManager] Peer error:', err);
          // Surface fatal open errors
          if (!this.peerId) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async connect() {
    if (this.isConnected) return;
    this.isConnected = true;
    this._startDiscovery();
  }

  async disconnect() {
    this.isConnected = false;
    if (this.discoveryChannel) {
      this.discoveryChannel.close();
      this.discoveryChannel = null;
    }
    for (const conn of this.connections.values()) {
      try {
        conn.close();
      } catch {}
    }
    this.connections.clear();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
      this.peerId = null;
    }
  }

  async sendToPeer(peerId, message) {
    const conn = await this._ensureConnection(peerId);
    if (!conn) throw new Error(`No connection to peer ${peerId}`);
    conn.send(message);
  }

  async broadcast(message) {
    for (const [peerId, conn] of this.connections.entries()) {
      const meta = this.peers.get(peerId);
      if (meta?.gameId === this.config.gameId && meta?.roomId === this.config.roomId) {
        conn.send(message);
      }
    }
  }

  getConnectedPeers() {
    return Array.from(this.connections.keys()).map(peerId => ({
      peerId,
      ...this.peers.get(peerId)
    }));
  }

  getNetworkStats() {
    return {
      peerId: this.peerId,
      peerCount: this.connections.size,
      isConnected: this.isConnected,
      topology: this.config.topology,
      connections: this.connections.size
    };
  }

  getLibp2pNode() {
    return null;
  }

  /* Internal */
  _startDiscovery() {
    this.discoveryChannel = new BroadcastChannel('peercompute-discovery');
    this.discoveryChannel.onmessage = (evt) => {
      const data = evt.data;
      const otherId = data?.peerId || data;
      const gameId = data?.gameId;
      const roomId = data?.roomId;
      if (!otherId || otherId === this.peerId) return;
      if (gameId && gameId !== this.config.gameId) return;
      if (roomId && roomId !== this.config.roomId) return;
      if (this.connections.has(otherId)) return;
      this._dialPeer(otherId);
    };
    // announce ourselves
    const announce = () => {
      if (this.peerId) {
        this.discoveryChannel.postMessage({
          peerId: this.peerId,
          gameId: this.config.gameId,
          roomId: this.config.roomId
        });
      }
    };
    announce();
    setInterval(announce, 3000);

    // PeerServer discovery fallback (cross-device)
    const pollPeerServer = () => {
      if (!this.peer?.listAllPeers) return;
      this.peer.listAllPeers((ids) => {
        ids
          .filter((id) => id && id !== this.peerId && !this.connections.has(id))
          .forEach((id) => this._dialPeer(id));
      });
    };
    pollPeerServer();
    setInterval(pollPeerServer, 5000);
  }

  _dialPeer(peerId) {
    if (!this.peer) return;
    const conn = this.peer.connect(peerId, { reliable: true });
    this._registerConnection(conn);
  }

  _ensureConnection(peerId) {
    return new Promise((resolve, reject) => {
      if (this.connections.has(peerId)) {
        return resolve(this.connections.get(peerId));
      }
      try {
        const conn = this.peer.connect(peerId, { reliable: true });
        this._registerConnection(conn, resolve);
        setTimeout(() => {
          if (!this.connections.has(peerId)) {
            reject(new Error('Connection timeout'));
          }
        }, 5000);
      } catch (err) {
        reject(err);
      }
    });
  }

  _registerConnection(conn, onReady) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      this.peers.set(conn.peer, { connectedAt: Date.now() });
      // Send handshake for room/game scoping
      conn.send({
        type: 'handshake',
        gameId: this.config.gameId,
        roomId: this.config.roomId,
        peerId: this.peerId
      });
      if (onReady) onReady(conn);
    });

    conn.on('data', (data) => {
      this._handleIncomingMessage(conn.peer, data);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.peers.delete(conn.peer);
      this.onPeerDisconnect(conn.peer);
    });

    conn.on('error', (err) => {
      console.warn('[NetworkManager] Connection error', err);
    });
  }

  _handleIncomingMessage(peerId, message) {
    // Handshake gate for room/game scoping
    if (message?.type === 'handshake') {
      if (message.gameId !== this.config.gameId || message.roomId !== this.config.roomId) {
        console.warn(`[NetworkManager] Rejecting peer ${peerId} due to room/game mismatch`);
        const conn = this.connections.get(peerId);
        conn?.close();
        this.connections.delete(peerId);
        this.peers.delete(peerId);
        return;
      }
      const meta = this.peers.get(peerId) || {};
      this.peers.set(peerId, {
        ...meta,
        gameId: message.gameId,
        roomId: message.roomId,
        lastMessageTime: Date.now()
      });
      this.onPeerConnect(peerId);
      return;
    }

    this.peers.set(peerId, {
      ...(this.peers.get(peerId) || {}),
      lastMessageTime: Date.now()
    });

    // Notify registered handlers (used by StateManager)
    this.messageHandlers.forEach((fn) => {
      try { fn(peerId, message); } catch (e) { console.error(e); }
    });

    // Notify NodeKernel handler
    this.onMessage(peerId, message);
  }
}
