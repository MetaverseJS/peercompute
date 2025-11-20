/**
 * @fileoverview State Manager - Manages shared data state using Yjs CRDT
 * Coordinates read/write access with automatic P2P synchronization
 * 
 * Uses Yjs for conflict-free replicated data types (CRDT) and y-libp2p
 * for automatic synchronization across the P2P network.
 */

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { PeerComputeProvider } from './PeerComputeProvider.js';

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
      ...config
    };
    
    // Yjs document - the CRDT state container
    this.ydoc = new Y.Doc();
    
    // Main state map (CRDT Y.Map)
    this.state = this.ydoc.getMap('state');
    
    // Providers
    this.indexeddbProvider = null;
    this.libp2pProvider = null;
    
    // Subscribers
    this.subscribers = new Map(); // key -> Set of callbacks
    this.globalSubscribers = new Set(); // Callbacks for all changes
    
    // State
    this.isInitialized = false;
  }

  /**
   * Initialize the state manager
   * @param {Object} initialState - Initial state data (optional)
   * @returns {Promise<void>}
   */
  async initialize(initialState = {}) {
    if (this.isInitialized) {
      console.warn('[StateManager] Already initialized');
      return;
    }
    
    try {
      // Set up IndexedDB persistence if enabled
      if (this.config.enablePersistence) {
        this.indexeddbProvider = new IndexeddbPersistence(
          this.config.docName,
          this.ydoc
        );
        
        // Wait for persistence to sync from IndexedDB
        await new Promise((resolve) => {
          this.indexeddbProvider.once('synced', resolve);
        });
        
        console.log('[StateManager] IndexedDB persistence loaded');
      }
      
      // Set up PeerComputeProvider synchronization (Custom replacement for y-libp2p)
      if (this.networkManager) {
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
      if (Object.keys(initialState).length > 0) {
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
    }
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
    });
  }

  /**
   * Fallback P2P sync when y-libp2p is not available
   * Uses NetworkManager directly
   * @private
   */
  _setupFallbackSync() {
    if (!this.libp2pNode) return;
    
    // Listen for state update requests
    // This is a simplified fallback - y-libp2p is much more efficient
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
    this.state.set(key, value);
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
   * Note: With Yjs + y-libp2p, synchronization is automatic.
   * This method is provided for compatibility but is mostly a no-op.
   * 
   * @param {Array<Object>} peerStates - States from peer nodes (unused with Yjs)
   * @returns {Promise<void>}
   */
  async synchronize(peerStates) {
    // With Yjs + y-libp2p, sync is automatic via CRDT
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
    try {
      // Cleanup libp2p provider
      if (this.libp2pProvider) {
        this.libp2pProvider.destroy();
        this.libp2pProvider = null;
      }
      
      // Cleanup IndexedDB provider
      if (this.indexeddbProvider) {
        this.indexeddbProvider.destroy();
        this.indexeddbProvider = null;
      }
      
      // Clear subscribers
      this.subscribers.clear();
      this.globalSubscribers.clear();
      
      // Destroy Yjs document
      this.ydoc.destroy();
      
      this.isInitialized = false;
      console.log('[StateManager] Destroyed');
      
    } catch (error) {
      console.error('[StateManager] Destroy failed:', error);
      throw error;
    }
  }

  /**
   * Get state manager statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      keyCount: this.state.size,
      subscriberCount: this.subscribers.size,
      globalSubscriberCount: this.globalSubscribers.size,
      hasPersistence: !!this.indexeddbProvider,
      hasP2PSync: !!this.libp2pProvider,
      docName: this.config.docName,
      topic: this.config.topic
    };
  }
}
