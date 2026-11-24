import * as Y from 'yjs';
import { Observable } from 'lib0/observable';

const YJS_UPDATE_TYPE = 'yjs-update';
const YJS_SYNC_REQUEST_TYPE = 'yjs-sync-request';
const YJS_SYNC_RESPONSE_TYPE = 'yjs-sync-response';
const REMOTE_SYNC_ORIGINS = new Set(['remote-yjs-update', 'remote-state-set']);

function uint8ArrayToBase64(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0) return '';
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
  }
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToUint8Array(encoded) {
  if (typeof encoded !== 'string' || encoded.length === 0) return new Uint8Array(0);
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(encoded, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  const binary = atob(encoded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export function bytesFromSerializable(value) {
  if (value instanceof Uint8Array) return value;
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (typeof value === 'string') {
    try {
      return base64ToUint8Array(value);
    } catch {
      return new Uint8Array(0);
    }
  }
  if (Array.isArray(value)) return new Uint8Array(value);
  if (value && typeof value === 'object') {
    if (typeof value.b64 === 'string') return bytesFromSerializable(value.b64);
    return new Uint8Array(Object.values(value));
  }
  return new Uint8Array(0);
}

export function isEmptyYjsUpdate(update) {
  if (!update || update.byteLength === 0) return true;
  // Yjs v1 encodes an empty update (0 structs, 0 delete sets) as [0, 0].
  return update.byteLength === 2 && update[0] === 0 && update[1] === 0;
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
    this.destroyed = false;
    this._unsubscribeMessageHandler = null;
    this.awareness = null; // TODO: Implement awareness
    
    this._onDocumentUpdate = this._onDocumentUpdate.bind(this);
    this._onNetworkMessage = this._onNetworkMessage.bind(this);
    
    // Listen to local document updates
    this.doc.on('update', this._onDocumentUpdate);

    // Listen for network messages routed by NetworkManager
    if (this.networkManager?.addMessageHandler) {
      const maybeUnsubscribe = this.networkManager.addMessageHandler(this._onNetworkMessage);
      if (typeof maybeUnsubscribe === 'function') {
        this._unsubscribeMessageHandler = maybeUnsubscribe;
      }
    }

    if (this.initialSync) {
      this.initialSyncTimer = setTimeout(() => {
        this.initialSyncTimer = null;
        if (this.destroyed) return;
        this.requestSync().catch(err => {
          console.error('[PeerComputeProvider] Initial sync request failed', err);
        });
      }, 0);
      this.initialSyncTimer?.unref?.();
    }

    console.log('[PeerComputeProvider] Initialized');
  }

  _getLocalPeerId() {
    return this.peerId || this.networkManager?.peerId || this.networkManager?.getPeerId?.() || null;
  }

  async requestSync() {
    if (this.destroyed || typeof this.networkManager?.broadcast !== 'function') return;
    const requestId = `${this._getLocalPeerId() || 'peer'}:${Date.now()}:${++this.syncRequestCounter}`;
    const stateVector = Y.encodeStateVector(this.doc);
    await this.networkManager.broadcast({
      type: YJS_SYNC_REQUEST_TYPE,
      data: {
        requestId,
        sourcePeerId: this._getLocalPeerId(),
        stateVector: uint8ArrayToBase64(stateVector)
      }
    }, { topic: this.topic });
  }

  async _sendSyncResponse(peerId, data = {}) {
    if (this.destroyed) return;
    const stateVector = bytesFromSerializable(data.stateVector);
    const update = Y.encodeStateAsUpdate(this.doc, stateVector);
    if (isEmptyYjsUpdate(update)) return;
    const message = {
      type: YJS_SYNC_RESPONSE_TYPE,
      data: {
        requestId: data.requestId || null,
        sourcePeerId: this._getLocalPeerId(),
        targetPeerId: peerId || data.sourcePeerId || null,
        update: uint8ArrayToBase64(update)
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
    if (this.destroyed || origin === this || REMOTE_SYNC_ORIGINS.has(origin) || isEmptyYjsUpdate(update)) {
      return;
    }
    if (typeof this.networkManager?.broadcast !== 'function') return;
    // Broadcast update to peers using compact base64 encoding
    this.networkManager.broadcast({
      type: YJS_UPDATE_TYPE,
      data: uint8ArrayToBase64(update)
    }, { topic: this.topic }).catch(err => {
      console.error('[PeerComputeProvider] Broadcast failed', err);
    });
  }
  
  /**
   * Handle incoming network message
   * @param {Object} message 
   */
  _onNetworkMessage(peerId, message) {
    if (this.destroyed || !message || peerId === this._getLocalPeerId()) return;
    if (message.type === YJS_UPDATE_TYPE) {
      const update = bytesFromSerializable(message.data);
      if (!isEmptyYjsUpdate(update)) Y.applyUpdate(this.doc, update, this);
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
      if (!isEmptyYjsUpdate(update)) Y.applyUpdate(this.doc, update, this);
    }
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.initialSyncTimer) {
      clearTimeout(this.initialSyncTimer);
      this.initialSyncTimer = null;
    }
    if (this._unsubscribeMessageHandler) {
      try { this._unsubscribeMessageHandler(); } catch {}
      this._unsubscribeMessageHandler = null;
    } else if (typeof this.networkManager?.removeMessageHandler === 'function') {
      this.networkManager.removeMessageHandler(this._onNetworkMessage);
    }
    this.doc.off('update', this._onDocumentUpdate);
    this.networkManager = null;
  }
}
