import * as Y from 'yjs';
import { Observable } from 'lib0/observable';

const YJS_UPDATE_TYPE = 'yjs-update';
const YJS_SYNC_REQUEST_TYPE = 'yjs-sync-request';
const YJS_SYNC_RESPONSE_TYPE = 'yjs-sync-response';

function bytesFromSerializable(value) {
  if (value instanceof Uint8Array) return value;
  if (Array.isArray(value)) return new Uint8Array(value);
  if (value && typeof value === 'object') return new Uint8Array(Object.values(value));
  return new Uint8Array(0);
}

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
    this.peerId = options.peerId || networkManager?.peerId || null;
    this.initialSync = options.initialSync !== false;
    this.syncRequestCounter = 0;
    this.initialSyncTimer = null;
    this.awareness = null; // TODO: Implement awareness
    
    this._onDocumentUpdate = this._onDocumentUpdate.bind(this);
    this._onNetworkMessage = this._onNetworkMessage.bind(this);
    
    // Listen to local document updates
    this.doc.on('update', this._onDocumentUpdate);

    // Listen for network messages routed by NetworkManager
    if (this.networkManager?.addMessageHandler) {
      this.networkManager.addMessageHandler(this._onNetworkMessage);
    }

    if (this.initialSync) {
      this.initialSyncTimer = setTimeout(() => {
        this.initialSyncTimer = null;
        this.requestSync().catch(err => {
          console.error('[PeerComputeProvider] Initial sync request failed', err);
        });
      }, 0);
    }

    console.log('[PeerComputeProvider] Initialized');
  }

  _getLocalPeerId() {
    return this.peerId || this.networkManager?.peerId || this.networkManager?.getPeerId?.() || null;
  }

  async requestSync() {
    if (typeof this.networkManager?.broadcast !== 'function') return;
    const requestId = `${this._getLocalPeerId() || 'peer'}:${Date.now()}:${++this.syncRequestCounter}`;
    const stateVector = Y.encodeStateVector(this.doc);
    await this.networkManager.broadcast({
      type: YJS_SYNC_REQUEST_TYPE,
      data: {
        requestId,
        sourcePeerId: this._getLocalPeerId(),
        stateVector: Array.from(stateVector)
      }
    }, { topic: this.topic });
  }

  async _sendSyncResponse(peerId, data = {}) {
    const stateVector = bytesFromSerializable(data.stateVector);
    const update = Y.encodeStateAsUpdate(this.doc, stateVector);
    if (update.byteLength === 0) return;
    const message = {
      type: YJS_SYNC_RESPONSE_TYPE,
      data: {
        requestId: data.requestId || null,
        sourcePeerId: this._getLocalPeerId(),
        targetPeerId: peerId || data.sourcePeerId || null,
        update: Array.from(update)
      }
    };
    if (peerId && typeof this.networkManager?.sendToPeer === 'function') {
      await this.networkManager.sendToPeer(peerId, message);
      return;
    }
    if (typeof this.networkManager?.broadcast === 'function') {
      await this.networkManager.broadcast(message, { topic: this.topic });
    }
  }
  
  /**
   * Handle local document update
   * @param {Uint8Array} update 
   * @param {any} origin 
   */
  _onDocumentUpdate(update, origin) {
    if (origin !== this) {
      if (typeof this.networkManager?.broadcast !== 'function') return;
      // Broadcast update to peers
      this.networkManager.broadcast({
        type: YJS_UPDATE_TYPE,
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
    if (!message || peerId === this._getLocalPeerId()) return;
    if (message.type === YJS_UPDATE_TYPE) {
       const update = bytesFromSerializable(message.data);
       if (update.byteLength > 0) Y.applyUpdate(this.doc, update, this);
       return;
    }
    if (message.type === YJS_SYNC_REQUEST_TYPE) {
      this._sendSyncResponse(peerId, message.data || {}).catch(err => {
        console.error('[PeerComputeProvider] Sync response failed', err);
      });
      return;
    }
    if (message.type === YJS_SYNC_RESPONSE_TYPE) {
      const targetPeerId = message.data?.targetPeerId || null;
      const localPeerId = this._getLocalPeerId();
      if (targetPeerId && localPeerId && targetPeerId !== localPeerId) return;
      const update = bytesFromSerializable(message.data?.update);
      if (update.byteLength > 0) Y.applyUpdate(this.doc, update, this);
    }
  }

  destroy() {
    if (this.initialSyncTimer) {
      clearTimeout(this.initialSyncTimer);
      this.initialSyncTimer = null;
    }
    this.doc.off('update', this._onDocumentUpdate);
    this.networkManager = null;
  }
}
