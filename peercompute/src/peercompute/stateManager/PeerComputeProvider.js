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
    
    // Listen to network messages (NetworkManager should route messages to us)
    // We assume NetworkManager has a way to subscribe to specific message types or we hook into global handler
    // For now, we'll register a listener on the NetworkManager if possible, or the caller should route it.
    // But NetworkManager interface uses `onMessage` callback in constructor.
    // We might need to register a protocol or just use broadcast.
    
    // We will use the 'broadcast' channel for updates
    this.networkManager.libp2pNode.services.pubsub.addEventListener('message', (evt) => {
        // Filter by topic if needed, though NetworkManager subscribes to one topic currently
        if (evt.detail.topic === this.topic) {
            this._onPubsubMessage(evt);
        }
    });
    
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

  /**
   * Handle raw pubsub message (direct from libp2p)
   * @param {Object} evt 
   */
  _onPubsubMessage(evt) {
      // Verify it's not from us
      // NetworkManager config: emitSelf: false, so we shouldn't receive our own.
      
      try {
          const messageStr = new TextDecoder().decode(evt.detail.data);
          const message = JSON.parse(messageStr);
          
          // We reuse _onNetworkMessage logic
          this._onNetworkMessage(evt.detail.from.toString(), message);
      } catch (e) {
          console.error('[PeerComputeProvider] Failed to parse message', e);
      }
  }
  
  destroy() {
    this.doc.off('update', this._onDocumentUpdate);
    // Remove listener from pubsub? NetworkManager manages pubsub subscription.
    this.networkManager = null;
  }
}
