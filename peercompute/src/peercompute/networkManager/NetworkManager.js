/**
 * @fileoverview Network Manager - Handles P2P networking using libp2p v2
 * Manages peer connections, topology, and message routing
 * 
 * WASM Compatibility: All messages use structured cloneable data types
 * (plain objects, ArrayBuffers, TypedArrays) for compatibility with
 * WebAssembly compute workers.
 */

import { createLibp2p } from 'libp2p';
import { webRTC } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { plaintext } from '@libp2p/plaintext';
import { noise } from '@libp2p/noise';
import { yamux } from '@libp2p/yamux';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { bootstrap } from '@libp2p/bootstrap';
import { kadDHT } from '@libp2p/kad-dht';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { multiaddr } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';

/**
 * NetworkManager class - Manages P2P network connections and communication
 * Supports hierarchy, distributed, and emergent topologies
 */
export class NetworkManager {
  /**
   * @param {Object} config - Network configuration
   * @param {string} config.topology - 'hierarchy' | 'distributed' | 'emergent'
   * @param {Array<string>} config.bootstrapPeers - Bootstrap peer multiaddrs
   * @param {Array<string>} config.stunServers - STUN servers for WebRTC
   * @param {Function} config.onMessage - Message handler callback
   * @param {Function} config.onPeerConnect - Peer connection callback
   * @param {Function} config.onPeerDisconnect - Peer disconnection callback
   */
  constructor(config = {}) {
    this.config = config;
    this.topology = config.topology || 'distributed';
    this.peers = new Map();
    this.parentNode = null;
    this.childNodes = new Set();
    this.isConnected = false;
    this.libp2pNode = null;
    
    // Message handlers
    this.onMessage = config.onMessage || (() => {});
    this.onPeerConnect = config.onPeerConnect || (() => {});
    this.onPeerDisconnect = config.onPeerDisconnect || (() => {});
    
    // Topic for pubsub (used in distributed topology)
    this.pubsubTopic = config.pubsubTopic || 'peercompute-default';
    
    // Message handlers by protocol
    this.messageHandlers = new Map();
  }

  /**
   * Initialize the network manager and libp2p node
   * @returns {Promise<Object>} The libp2p node instance
   */
  async initialize() {
    try {
      // Create libp2p node with modern v2 API
      this.libp2pNode = await createLibp2p({
        // Addresses to listen on (empty for browser, will use WebRTC)
        addresses: {
          listen: []
        },
        
        // Transports - WebRTC for browser P2P, WebSockets for signaling, Circuit Relay for NAT traversal
        transports: [
          webRTC({
            rtcConfiguration: {
              iceServers: this.config.stunServers || [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
              ]
            }
          }),
          webSockets({
            // Allow dialing ws:// and IP addresses in browser during local dev
            // Browser default filter only allows wss:// DNS addresses
            filter: (addrs) => addrs
          }),
          circuitRelayTransport({
            discoverRelays: 1
          })
        ],
        
        // Connection encryption
        connectionEncrypters: [
          noise(),
          plaintext()
        ],
        
        // Stream multiplexing
        streamMuxers: [yamux({})],
        
        // Pubsub for distributed messaging
        services: {
          pubsub: gossipsub({
            emitSelf: false,
            allowPublishToZeroPeers: true
          }),
          
          // DHT for distributed topology
          dht: kadDHT({
            clientMode: true
          }),
          
          // Identify protocol
          identify: identify(),
          
          // Ping service (required by DHT)
          ping: ping()
        },
        
        // Peer discovery
        peerDiscovery: [
          // Bootstrap peers for initial connection
          ...(this.config.bootstrapPeers && this.config.bootstrapPeers.length > 0 ? [
            bootstrap({
              list: this.config.bootstrapPeers
            })
          ] : []),
          // Pubsub peer discovery - announces presence and discovers peers via gossipsub
          pubsubPeerDiscovery({
            interval: 1000,
            topics: ['peercompute._peer-discovery._p2p._pubsub']
          })
        ],
        
        // Connection manager - aggressive settings to maintain relay connections
        connectionManager: {
          maxConnections: 100,
          minConnections: 1,                      // Keep at least 1 connection (relay)
          autoDial: true,                         // Automatically dial to maintain minConnections
          autoDialInterval: 3000,                 // Check every 3 seconds
          maxIncomingPendingConnections: 10,
          inboundConnectionThreshold: Infinity,   // Never prune inbound connections
          maxEventLoopDelay: Infinity,            // Don't close connections due to event loop delay
          maxPeerAddrsToDial: 25                  // Dial up to 25 addresses per peer
        },

        // Connection gater - allow local connections for testing
        connectionGater: {
          denyDialMultiaddr: () => false
        }
      });

      // Set up event listeners
      this._setupEventListeners();
      
      // Register keep-alive protocol to maintain persistent streams
      await this._registerKeepAliveProtocol();
      
      // Start the node
      await this.libp2pNode.start();
      
      console.log(`[NetworkManager] Initialized with peer ID: ${this.libp2pNode.peerId.toString()}`);
      
      return this.libp2pNode;
      
    } catch (error) {
      console.error('[NetworkManager] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up libp2p event listeners
   * @private
   */
  _setupEventListeners() {
    // Connection lifecycle logging
    this.libp2pNode.addEventListener('connection:open', (evt) => {
      console.log(`[NetworkManager] 🔌 Connection opened to ${evt.detail.remotePeer.toString()}`);
    });
    
    this.libp2pNode.addEventListener('connection:close', (evt) => {
      console.log(`[NetworkManager] 🔌 Connection closed to ${evt.detail.remotePeer.toString()}`);
    });
    
    // Peer connected
    this.libp2pNode.addEventListener('peer:connect', (evt) => {
      console.log(`[NetworkManager] ✅ Peer connected: ${evt.detail.toString()}`);
      this._handlePeerConnected(evt.detail.toString());
    });
    
    // Peer disconnected
    this.libp2pNode.addEventListener('peer:disconnect', (evt) => {
      console.log(`[NetworkManager] ❌ Peer disconnected: ${evt.detail.toString()}`);
      this._handlePeerDisconnected(evt.detail.toString());
    });
    
    // Peer discovered
    this.libp2pNode.addEventListener('peer:discovery', (evt) => {
      console.log(`[NetworkManager] 🔍 Peer discovered: ${evt.detail.id.toString()}`);
    });
    
    // Subscribe to pubsub topic for distributed messaging
    if (this.topology === 'distributed') {
      this.libp2pNode.services.pubsub.subscribe(this.pubsubTopic);
      this.libp2pNode.services.pubsub.addEventListener('message', (evt) => {
        this._handlePubsubMessage(evt);
      });
    }
    
    // Log connection status periodically
    setInterval(() => {
      const connections = this.libp2pNode.getConnections().length;
      const peers = this.libp2pNode.getPeers().length;
      if (connections > 0 || peers > 0) {
        console.log(`[NetworkManager] 📊 Status: ${connections} connections, ${peers} peers`);
      }
    }, 10000); // Every 10 seconds
  }

  /**
   * Connect to the P2P network
   * @param {Array<string>} bootstrapPeers - Initial peer multiaddrs (optional)
   * @returns {Promise<void>}
   */
  async connect(bootstrapPeers = []) {
    if (this.isConnected) {
      console.warn('[NetworkManager] Already connected');
      return;
    }
    
    try {
      this.isConnected = true;
      console.log('[NetworkManager] P2P network enabled');
      console.log('[NetworkManager] Bootstrap peers configured:', this.config.bootstrapPeers?.length || 0);
      
      // Subscribe to discovery topic BEFORE dialing to ensure gossipsub mesh is established
      const discoveryTopic = 'peercompute._peer-discovery._p2p._pubsub';
      this.libp2pNode.services.pubsub.subscribe(discoveryTopic);
      console.log('[NetworkManager] Subscribed to discovery topic for mesh maintenance');
      
      // Dial bootstrap peers (relay servers)
      // libp2p will automatically use them for circuit relay connections
      if (this.config.bootstrapPeers?.length > 0) {
        console.log('[NetworkManager] Connecting to relay servers...');
        
        for (const peer of this.config.bootstrapPeers) {
          try {
            const ma = typeof peer === 'string' ? multiaddr(peer) : peer;
            const connection = await this.libp2pNode.dial(ma);
            console.log(`[NetworkManager] ✅ Connected to relay: ${connection.remotePeer.toString()}`);
            
            // Keep connection alive with simple keep-alive protocol
            this._keepAlive(connection.remotePeer.toString());
          } catch (err) {
            console.warn(`[NetworkManager] Failed to dial ${peer}:`, err.message);
          }
        }
      }
      
      // Log connection status
      setTimeout(() => {
        const connections = this.libp2pNode.getConnections().length;
        const peers = this.libp2pNode.getPeers().length;
        console.log(`[NetworkManager] Status: ${connections} connections, ${peers} peers`);
      }, 2000);
      
    } catch (error) {
      console.error('[NetworkManager] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the network
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.libp2pNode) {
      return;
    }
    
    try {
      // Unsubscribe from pubsub
      if (this.topology === 'distributed') {
        this.libp2pNode.services.pubsub.unsubscribe(this.pubsubTopic);
      }
      
      // Stop the node
      await this.libp2pNode.stop();
      
      this.isConnected = false;
      this.peers.clear();
      this.parentNode = null;
      this.childNodes.clear();
      
      console.log('[NetworkManager] Disconnected from P2P network');
      
    } catch (error) {
      console.error('[NetworkManager] Disconnect failed:', error);
      throw error;
    }
  }

  /**
   * Send message to specific peer using custom protocol
   * 
   * WASM Compatible: Message data should be structured cloneable
   * (plain objects, ArrayBuffer, TypedArray)
   * 
   * @param {string} peerId - Target peer ID
   * @param {Object} message - Message to send
   * @param {string} message.type - Message type
   * @param {*} message.data - Message data (must be structured cloneable)
   * @param {string} protocol - Protocol name (default: '/peercompute/1.0.0')
   * @returns {Promise<void>}
   */
  async sendToPeer(peerId, message, protocol = '/peercompute/1.0.0') {
    if (!this.libp2pNode) {
      throw new Error('NetworkManager not initialized');
    }
    
    try {
      // Ensure peerId is a PeerId object
      const pid = typeof peerId === 'string' ? peerIdFromString(peerId) : peerId;

      // Open stream to peer
      const stream = await this.libp2pNode.dialProtocol(pid, protocol);
      
      // Serialize message (WASM-compatible: uses structured clone algorithm)
      const messageBytes = new TextEncoder().encode(JSON.stringify(message));
      
      // Send message
      await stream.sink([messageBytes]);
      await stream.close();
      
    } catch (error) {
      console.error(`[NetworkManager] Failed to send to peer ${peerId}:`, error);
      throw error;
    }
  }

  /**
   * Broadcast message to all connected peers via pubsub
   * 
   * WASM Compatible: Message data should be structured cloneable
   * 
   * @param {Object} message - Message to broadcast
   * @param {string} message.type - Message type
   * @param {*} message.data - Message data (must be structured cloneable)
   * @param {Object} options - Broadcast options
   * @param {string} options.topic - Custom topic (optional)
   * @returns {Promise<void>}
   */
  async broadcast(message, options = {}) {
    if (!this.libp2pNode) {
      throw new Error('NetworkManager not initialized');
    }
    
    const topic = options.topic || this.pubsubTopic;
    
    try {
      // Serialize message (WASM-compatible)
      const messageBytes = new TextEncoder().encode(JSON.stringify(message));
      
      // Publish to topic
      await this.libp2pNode.services.pubsub.publish(topic, messageBytes);
      
    } catch (error) {
      // Ignore NoPeersSubscribedToTopic error as it's expected during initialization
      // or when peers haven't subscribed yet
      if (error.message && error.message.includes('NoPeersSubscribedToTopic')) {
        console.warn('[NetworkManager] Broadcast skipped: No peers subscribed to topic');
        return;
      }
      
      console.error('[NetworkManager] Broadcast failed:', error);
      throw error;
    }
  }

  /**
   * Register a custom protocol handler
   * Useful for compute task distribution to/from WASM workers
   * 
   * @param {string} protocol - Protocol name
   * @param {Function} handler - Handler function (stream) => Promise<void>
   */
  async registerProtocol(protocol, handler) {
    if (!this.libp2pNode) {
      throw new Error('NetworkManager not initialized');
    }
    
    await this.libp2pNode.handle(protocol, async ({ stream }) => {
      try {
        await handler(stream);
      } catch (error) {
        console.error(`[NetworkManager] Protocol ${protocol} handler error:`, error);
      }
    });
    
    console.log(`[NetworkManager] Registered protocol: ${protocol}`);
  }

  /**
   * Join a parent node (hierarchy topology)
   * @param {string} parentPeerId - Parent node peer ID
   * @returns {Promise<void>}
   */
  async joinParent(parentPeerId) {
    if (this.topology !== 'hierarchy') {
      throw new Error('joinParent only available in hierarchy topology');
    }
    
    try {
      // Dial parent node
      await this.libp2pNode.dial(parentPeerId);
      
      // Send join request
      await this.sendToPeer(parentPeerId, {
        type: 'join-request',
        data: {
          nodeId: this.libp2pNode.peerId.toString(),
          timestamp: Date.now()
        }
      }, '/peercompute/hierarchy/1.0.0');
      
      this.parentNode = parentPeerId;
      console.log(`[NetworkManager] Joined parent node: ${parentPeerId}`);
      
    } catch (error) {
      console.error('[NetworkManager] Failed to join parent:', error);
      throw error;
    }
  }

  /**
   * Accept a child node (hierarchy topology)
   * @param {string} childPeerId - Child node peer ID
   * @returns {Promise<void>}
   */
  async acceptChild(childPeerId) {
    if (this.topology !== 'hierarchy') {
      throw new Error('acceptChild only available in hierarchy topology');
    }
    
    this.childNodes.add(childPeerId);
    
    // Send acceptance response
    await this.sendToPeer(childPeerId, {
      type: 'join-accepted',
      data: {
        parentId: this.libp2pNode.peerId.toString(),
        timestamp: Date.now()
      }
    }, '/peercompute/hierarchy/1.0.0');
    
    console.log(`[NetworkManager] Accepted child node: ${childPeerId}`);
  }

  /**
   * Discover nearby peers with high bandwidth/compute
   * @returns {Promise<Array<Object>>} Discovered peers with metrics
   */
  async discoverNearbyPeers() {
    if (!this.libp2pNode) {
      return [];
    }
    
    const peers = [];
    const connections = this.libp2pNode.getConnections();
    
    for (const conn of connections) {
      const peerId = conn.remotePeer.toString();
      const peerData = this.peers.get(peerId) || {};
      
      peers.push({
        peerId,
        latency: peerData.latency || 0,
        bandwidth: peerData.bandwidth || 0,
        compute: peerData.compute || 0,
        connectionTime: peerData.connectedAt || Date.now()
      });
    }
    
    // Sort by suitability (low latency, high bandwidth)
    return peers.sort((a, b) => {
      const scoreA = (1 / (a.latency + 1)) * (a.bandwidth + 1);
      const scoreB = (1 / (b.latency + 1)) * (b.bandwidth + 1);
      return scoreB - scoreA;
    });
  }

  /**
   * Optimize topology based on network conditions
   * (Used for emergent topology mode)
   * @returns {Promise<void>}
   */
  async optimizeTopology() {
    if (this.topology !== 'emergent') {
      return;
    }
    
    // Discover nearby peers
    const peers = await this.discoverNearbyPeers();
    
    // TODO: Implement intelligent topology optimization
    // - Form subgroups for LAN peers
    // - Reorganize connections based on bandwidth/latency
    // - Balance load across peers
    
    console.log('[NetworkManager] Topology optimization (TODO)');
  }

  /**
   * Get list of connected peers
   * @returns {Array<Object>} Connected peers with metadata
   */
  getConnectedPeers() {
    if (!this.libp2pNode) {
      return [];
    }
    
    return this.libp2pNode.getConnections().map(conn => ({
      peerId: conn.remotePeer.toString(),
      ...this.peers.get(conn.remotePeer.toString())
    }));
  }

  /**
   * Get network statistics
   * @returns {Object} Network stats (latency, bandwidth, peer count, etc)
   */
  getNetworkStats() {
    return {
      peerId: this.libp2pNode?.peerId.toString(),
      peerCount: this.peers.size,
      isConnected: this.isConnected,
      topology: this.topology,
      connections: this.libp2pNode?.getConnections().length || 0,
      parentNode: this.parentNode,
      childNodeCount: this.childNodes.size
    };
  }

  /**
   * Get the libp2p node instance
   * Used by StateManager for Yjs integration
   * @returns {Object} libp2p node
   */
  getLibp2pNode() {
    return this.libp2pNode;
  }

  /**
   * Handle incoming pubsub message
   * @private
   * @param {Object} evt - Pubsub message event
   */
  _handlePubsubMessage(evt) {
    try {
      const messageStr = new TextDecoder().decode(evt.detail.data);
      const message = JSON.parse(messageStr);
      
      // Call registered message handler
      this._handleIncomingMessage(evt.detail.from.toString(), message);
      
    } catch (error) {
      console.error('[NetworkManager] Failed to handle pubsub message:', error);
    }
  }

  /**
   * Handle incoming message from peer
   * @private
   * @param {string} peerId - Source peer ID
   * @param {Object} message - Received message
   */
  _handleIncomingMessage(peerId, message) {
    // Update peer stats
    const peer = this.peers.get(peerId) || {};
    peer.lastMessageTime = Date.now();
    this.peers.set(peerId, peer);
    
    // Call external message handler
    this.onMessage(peerId, message);
  }

  /**
   * Handle peer connection event
   * @private
   * @param {string} peerId - Connected peer ID
   */
  _handlePeerConnected(peerId) {
    // Initialize peer metadata
    this.peers.set(peerId, {
      peerId,
      connectedAt: Date.now(),
      latency: 0,
      bandwidth: 0,
      compute: 0,
      lastMessageTime: Date.now()
    });
    
    console.log(`[NetworkManager] Peer connected: ${peerId}`);
    
    // Call external connection handler
    this.onPeerConnect(peerId);
  }


  /**
   * Handle peer disconnection event
   * @private
   * @param {string} peerId - Disconnected peer ID
   */
  _handlePeerDisconnected(peerId) {
    // Remove from peers
    this.peers.delete(peerId);
    
    // Remove from child nodes if present
    this.childNodes.delete(peerId);
    
    // Clear parent if this was parent node
    if (this.parentNode === peerId) {
      this.parentNode = null;
    }
    
    console.log(`[NetworkManager] Peer disconnected: ${peerId}`);
    
    // Call external disconnection handler
    this.onPeerDisconnect(peerId);
  }

  /**
   * Register keep-alive protocol handler
   * This protocol maintains persistent streams to prevent connection closure
   * @private
   */
  async _registerKeepAliveProtocol() {
    const KEEPALIVE_PROTOCOL = '/peercompute/keepalive/1.0.0';
    
    await this.libp2pNode.handle(KEEPALIVE_PROTOCOL, async ({ stream }) => {
      console.log('[NetworkManager] Keep-alive stream opened');
      
      try {
        // Keep stream open by reading from it (even if no data comes)
        // This prevents the muxer from closing due to inactivity
        for await (const _ of stream.source) {
          // Just consume any incoming data to keep stream alive
        }
      } catch (error) {
        console.log('[NetworkManager] Keep-alive stream closed:', error.message);
      }
    });
    
    console.log('[NetworkManager] Keep-alive protocol registered');
  }

  /**
   * Keep connection alive with persistent stream
   * Send immediate heartbeat then maintain with periodic pings
   * @private
   * @param {string} peerId - Peer ID to keep alive
   */
  async _keepAlive(peerId) {
    const KEEPALIVE_PROTOCOL = '/peercompute/keepalive/1.0.0';
    
    try {
      const pid = peerIdFromString(peerId);
      
      // Open persistent stream using keep-alive protocol
      const stream = await this.libp2pNode.dialProtocol(pid, KEEPALIVE_PROTOCOL);
      console.log(`[NetworkManager] 🔄 Keep-alive stream established to ${peerId}`);
      
      // Send IMMEDIATE heartbeat to establish bidirectional flow
      await stream.sink([new Uint8Array([1])]);
      console.log(`[NetworkManager] 💓 Initial heartbeat sent to ${peerId}`);
      
      // Create a pipe to continuously read from the stream
      (async () => {
        try {
          if (stream.source) {
            for await (const data of stream.source) {
              console.log(`[NetworkManager] 💓 Received heartbeat echo from ${peerId}`);
            }
          }
        } catch (error) {
          console.log(`[NetworkManager] Keep-alive stream to ${peerId} closed:`, error.message);
        }
      })();
      
      // Send heartbeats every 5 seconds (not 30) to keep connection very active
      const heartbeatInterval = setInterval(async () => {
        try {
          if (!this.isConnected) {
            clearInterval(heartbeatInterval);
            await stream.close();
            return;
          }
          
          const connections = this.libp2pNode.getConnections();
          const hasConnection = connections.some(conn => conn.remotePeer.toString() === peerId);
          
          if (!hasConnection) {
            console.log(`[NetworkManager] Lost connection to ${peerId}, attempting redial...`);
            clearInterval(heartbeatInterval);
            await stream.close();
            // Attempt to reconnect
            try {
              const ma = this.config.bootstrapPeers.find(p => p.includes(peerId));
              if (ma) {
                const connection = await this.libp2pNode.dial(multiaddr(ma));
                console.log(`[NetworkManager] ✅ Reconnected to relay: ${connection.remotePeer.toString()}`);
                this._keepAlive(peerId); // Restart keep-alive
              }
            } catch (err) {
              console.warn(`[NetworkManager] Reconnect failed:`, err.message);
            }
            return;
          }
          
          // Send heartbeat byte to keep stream active
          await stream.sink([new Uint8Array([1])]);
          console.log(`[NetworkManager] 💓 Heartbeat sent to ${peerId}`);
        } catch (error) {
          console.warn(`[NetworkManager] Heartbeat failed to ${peerId}:`, error.message);
          clearInterval(heartbeatInterval);
        }
      }, 5000); // Send heartbeat every 5 seconds
      
    } catch (error) {
      console.error(`[NetworkManager] Failed to establish keep-alive stream to ${peerId}:`, error.message);
    }
  }
}
