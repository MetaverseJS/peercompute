/**
 * @fileoverview Node Kernel - Main coordinator for the PeerCompute node
 * Manages State, Network, and Compute managers
 * Acts as the central orchestrator for all node operations
 */

import { NetworkManager } from '../networkManager/NetworkManager.js';
import { StateManager } from '../stateManager/StateManager.js';
import { generateId } from '../utils/Utils.js';

/**
 * NodeKernel class - Core orchestrator for a PeerCompute node
 * Coordinates State, Network, and Compute managers
 */
export class NodeKernel {
  /**
   * @param {Object} config - Configuration options for the node
   * @param {string} config.topology - Network topology: 'hierarchy' | 'distributed' | 'emergent'
   * @param {string} config.storageMode - Data storage mode: 'local' | 'propagate'
   * @param {boolean} config.enableWebGPU - Enable WebGPU compute capabilities
   * @param {boolean} config.enablePersistence - Enable IndexedDB persistence
   * @param {Array<string>} config.bootstrapPeers - Bootstrap peer multiaddrs
   * @param {string} config.stateTopic - P2P state sync topic
   */
  constructor(config = {}) {
    this.config = {
      topology: config.topology || 'distributed',
      storageMode: config.storageMode || 'local',
      enableWebGPU: config.enableWebGPU || false,
      enablePersistence: config.enablePersistence !== false,
      peerServer: config.peerServer || null,
      stateTopic: config.stateTopic || 'peercompute-state',
      ...config
    };

    this.stateManager = null;
    this.networkManager = null;
    this.computeManager = null;

    this.isInitialized = false;
    this.isStarted = false;
    this.nodeId = null;
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
      console.log(`[NodeKernel] Node ID: ${this.nodeId}`);
      
      // 1. Initialize NetworkManager first
      this.networkManager = new NetworkManager({
        topology: this.config.topology,
        peerServer: this.config.peerServer || undefined,
        pubsubTopic: this.config.stateTopic,
        onMessage: this._handleNetworkMessage.bind(this),
        onPeerConnect: this._handlePeerConnect.bind(this),
        onPeerDisconnect: this._handlePeerDisconnect.bind(this)
      });
      
      await this.networkManager.initialize();
      console.log('[NodeKernel] NetworkManager initialized');
      
      // 2. Initialize StateManager with NetworkManager
      this.stateManager = new StateManager(this.networkManager, {
        docName: `peercompute-${this.nodeId}`,
        topic: this.config.stateTopic,
        enablePersistence: this.config.enablePersistence
      });
      
      await this.stateManager.initialize({
        nodeId: this.nodeId,
        topology: this.config.topology,
        createdAt: Date.now()
      });
      console.log('[NodeKernel] StateManager initialized');
      
      // 3. Initialize ComputeManager (TODO - placeholder)
      // this.computeManager = new ComputeManager({
      //   enableWebGPU: this.config.enableWebGPU
      // });
      // await this.computeManager.initialize();
      console.log('[NodeKernel] ComputeManager: TODO');
      
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
      
      // Set node state to active
      this.stateManager.write('status', 'active');
      this.stateManager.write('startedAt', Date.now());
      
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
      console.log('[NodeKernel] Node stopped');
      
    } catch (error) {
      console.error('[NodeKernel] Stop failed:', error);
      throw error;
    }
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
    
    // TODO: Route task to compute manager
    console.log('[NodeKernel] Task submission: TODO (ComputeManager not implemented)');
    throw new Error('ComputeManager not yet implemented');
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
      
      // Network status
      network: {
        peerId: networkStats.peerId,
        peerCount: networkStats.peerCount,
        isConnected: networkStats.isConnected,
        connections: networkStats.connections
      },
      
      // State status
      state: {
        keyCount: stateStats.keyCount,
        hasPersistence: stateStats.hasPersistence,
        hasP2PSync: stateStats.hasP2PSync
      },
      
      // Compute status
      compute: {
        enabled: this.config.enableWebGPU,
        available: false // TODO: Update when ComputeManager implemented
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
   * Handle incoming network message
   * @private
   * @param {string} peerId - Source peer ID
   * @param {Object} message - Message data
   */
  _handleNetworkMessage(peerId, message) {
    console.log(`[NodeKernel] Message from ${peerId}:`, message.type);
    
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
          this.stateManager.applyStateSet(message.data?.key, message.data?.value);
        }
        break;

      case 'compute-task':
        this._handleComputeTask(peerId, message.data);
        break;
        
      case 'ping':
        this._handlePing(peerId, message.data);
        break;
        
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
    console.log(`[NodeKernel] Peer connected: ${peerId}`);
    
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
    console.log(`[NodeKernel] Peer disconnected: ${peerId}`);
    
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
    console.log(`[NodeKernel] Compute task from ${peerId}: TODO`);
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
