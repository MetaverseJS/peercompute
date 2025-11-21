import * as Y from 'yjs';
import { Observable } from 'lib0/observable';

/**
 * Custom Yjs Provider that uses NetworkManager for communication
 * Replaces y-libp2p to avoid compatibility issues
 */
export class PeerComputeProvider extends Observable {
  /**
   * @param {Object} networkManager - NetworkManager instance
   * @param {Y.Doc} doc - Yjs document
   * @param {Object} options - Configuration
   */
  constructor(networkManager, doc, options = {}) {
    super();
    this.networkManager = networkManager;
    this.doc = doc;
    this.topic = options.topic || 'peercompute-state-sync';
    this.awareness = null; // TODO: Implement awareness
    
    this._onDocumentUpdate = this._onDocumentUpdate.bind(this);
    this._onNetworkMessage = this._onNetworkMessage.bind(this);
    
    // Listen to local document updates
    this.doc.on('update', this._onDocumentUpdate);

    // Listen for network messages routed by NetworkManager
    if (this.networkManager?.addMessageHandler) {
      this.networkManager.addMessageHandler(this._onNetworkMessage);
    }

    console.log('[PeerComputeProvider] Initialized');
  }
  
  /**
   * Handle local document update
   * @param {Uint8Array} update 
   * @param {any} origin 
   */
  _onDocumentUpdate(update, origin) {
    if (origin !== this) {
      // Broadcast update to peers
      this.networkManager.broadcast({
        type: 'yjs-update',
        data: Array.from(update) // Convert Uint8Array to Array for JSON serialization
      }, { topic: this.topic }).catch(err => {
          console.error('[PeerComputeProvider] Broadcast failed', err);
      });
    }
  }
  
  /**
   * Handle incoming network message
   * @param {Object} message 
   */
  _onNetworkMessage(peerId, message) {
    if (message.type === 'yjs-update') {
       const update = new Uint8Array(message.data);
       Y.applyUpdate(this.doc, update, this);
    }
  }

  destroy() {
    this.doc.off('update', this._onDocumentUpdate);
    this.networkManager = null;
  }
}
