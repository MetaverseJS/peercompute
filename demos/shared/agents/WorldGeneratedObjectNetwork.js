import { channel, encryptedConnection } from '../../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { waitForPeerConnection } from '../../../peercompute/src/peercompute/networkManager/inference/waitForPeerConnection.js';
import { chatScope } from '../chat/roomChatContracts.js';
import { normalizeWorldObjectDescriptor, objectText, WORLD_OBJECT_LIMITS } from './WorldObjectAction.js';

export const WORLD_OBJECT_PROTOCOL = '/peercompute/world-generated-objects/1.0.0';
const owners = new WeakMap();
const failure = message => new Error(`World objects: ${message}`);
const abortStream = (stream, error) => { try { Promise.resolve(stream?.abort(error)).catch(() => {}); } catch { /* Transport is already closed. */ } };
const observe = (callback, value) => { try { Promise.resolve(callback(value)).catch(() => {}); } catch { /* Observer only. */ } };
async function finish(stream) {
  try { await stream.close({ signal: AbortSignal.timeout(250) }); }
  catch (error) { abortStream(stream, error); }
}

/** Authenticated room snapshots carry references only. Binary delivery remains
 * the ArtifactStore/IPFS transport's responsibility, not the replicated Y.Doc. */
export class WorldGeneratedObjectNetwork {
  constructor({ networkManager, worldId, listLocalObjects, onDirectory = () => {}, requestTimeoutMs = 5000, now = Date.now }) {
    if (!networkManager || typeof listLocalObjects !== 'function' || !Number.isInteger(requestTimeoutMs)
        || requestTimeoutMs < 100 || requestTimeoutMs > 10000) throw failure('invalid service configuration');
    Object.assign(this, { manager: networkManager, listLocalObjects, onDirectory, requestTimeoutMs, now });
    this.worldId = objectText(worldId, 240, 'world'); this.scope = chatScope(networkManager.config);
    this.lifetime = new AbortController(); this.operations = new Set(); this.inbound = new Map(); this.rate = new Map();
    this.directory = new Map(); this.closed = false; this.registered = false;
  }
  get node() { return this.boundNode ?? this.manager.getLibp2pNode?.() ?? this.manager.libp2p; }
  get peerId() { return this.node.peerId.toString(); }
  _known(peerId) {
    const meta = this.manager.peers?.get(peerId);
    return peerId !== this.peerId && !this.manager.bootstrapPeerIds?.has(peerId)
      && !!meta && Object.keys(this.scope).every(key => meta[key] === this.scope[key]);
  }
  _active() {
    if (this.closed || !this.registered || (this.manager.getLibp2pNode?.() ?? this.manager.libp2p) !== this.boundNode
        || JSON.stringify(chatScope(this.manager.config)) !== JSON.stringify(this.scope)) throw failure('room changed or service closed');
  }
  _track(promise) {
    this.operations.add(promise); promise.catch(() => {}).finally(() => this.operations.delete(promise)); return promise;
  }
  _envelope(type, recipient, nonce, extra = {}) { return { type, recipient, nonce, worldId: this.worldId, scope: this.scope, ...extra }; }
  _check(value, peerId, type, nonce) {
    this._active();
    const allowed = ['type', 'recipient', 'nonce', 'worldId', 'scope', ...(type === 'objects' ? ['objects'] : [])];
    if (!value || Object.keys(value).some(key => !allowed.includes(key)) || value.type !== type
        || value.recipient !== this.peerId || value.worldId !== this.worldId || value.nonce !== nonce
        || !/^[a-zA-Z0-9-]{1,80}$/.test(nonce) || !this._known(peerId)
        || !value.scope || Object.keys(value.scope).length !== 3 || Object.keys(this.scope).some(key => value.scope[key] !== this.scope[key])) {
      throw failure('authenticated owner, request, or world mismatch');
    }
  }
  _objects(values) {
    if (!Array.isArray(values) || values.length > WORLD_OBJECT_LIMITS.perOwner) throw failure('owner object limit exceeded');
    const objects = values.map(value => normalizeWorldObjectDescriptor(value, { worldId: this.worldId }));
    if (new Set(objects.map(value => value.placement.objectId)).size !== objects.length) throw failure('duplicate object identity');
    return objects;
  }
  async start() {
    if (this.closed) throw failure('service closed');
    if (this.registered) return this;
    this.boundNode = this.node;
    if (!this.node?.handle || owners.has(this.node)) throw failure('room already has an object service or is offline');
    owners.set(this.node, this);
    try {
      await this.node.handle(WORLD_OBJECT_PROTOCOL, (stream, connection) => {
        const peerId = connection?.remotePeer?.toString?.(), time = this.now();
        const previous = this.rate.get(peerId);
        if (this.closed || !encryptedConnection(connection) || !this._known(peerId) || (previous !== undefined && time - previous < 250)
            || (this.inbound.get(peerId) ?? 0) >= 2 || [...this.inbound.values()].reduce((a, b) => a + b, 0) >= 8) {
          abortStream(stream, failure('encrypted current-room owner connection required or service busy')); return;
        }
        this.rate.set(peerId, time); this.inbound.set(peerId, (this.inbound.get(peerId) ?? 0) + 1);
        this._track(this._handle(stream, connection).finally(() => {
          const count = this.inbound.get(peerId) - 1;
          if (count) this.inbound.set(peerId, count); else this.inbound.delete(peerId);
        }));
      }, { maxInboundStreams: 2, maxOutboundStreams: 2, runOnLimitedConnection: true });
      this.registered = true; return this;
    } catch (error) { owners.delete(this.node); throw error; }
  }
  async _handle(stream, connection) {
    const signal = AbortSignal.any([this.lifetime.signal, AbortSignal.timeout(this.requestTimeoutMs)]);
    const abort = () => abortStream(stream, signal.reason); signal.addEventListener('abort', abort, { once: true });
    try {
      const io = channel(stream), peerId = connection.remotePeer.toString();
      const input = await io.read(signal); this._check(input, peerId, 'query', input?.nonce);
      const objects = this._objects(await this.listLocalObjects()); signal.throwIfAborted();
      this._check(input, peerId, 'query', input.nonce);
      await io.write(this._envelope('objects', peerId, input.nonce, { objects }), signal); await finish(stream);
    } catch (error) { abortStream(stream, error); }
    finally { signal.removeEventListener('abort', abort); }
  }
  query(peerId, options) { return this._track(this._query(peerId, options)); }
  async _query(peerId, { signal: callerSignal } = {}) {
    this._active(); if (!this._known(peerId)) throw failure('peer is not in this room');
    const signal = AbortSignal.any([this.lifetime.signal, AbortSignal.timeout(this.requestTimeoutMs), ...(callerSignal ? [callerSignal] : [])]);
    const connections = () => this.node.getConnections().filter(value => encryptedConnection(value) && value.remotePeer.toString() === peerId);
    let stream; const abort = () => abortStream(stream, signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    try {
      if (!connections().length && this.manager._maybeDialPeer) await waitForPeerConnection({ node: this.node, peerId, signal,
        timeoutMs: this.requestTimeoutMs, dial: () => this.manager._maybeDialPeer(peerId, 'world-objects'),
        assertAllowed: () => { this._active(); if (!this._known(peerId)) throw failure('peer left room'); } });
      const connection = connections()[0]; if (!connection) throw failure('peer is not connected');
      stream = await connection.newStream(WORLD_OBJECT_PROTOCOL, { signal, runOnLimitedConnection: true });
      const io = channel(stream), nonce = crypto.randomUUID();
      await io.write(this._envelope('query', peerId, nonce), signal);
      const response = await io.read(signal); this._check(response, peerId, 'objects', nonce);
      const objects = this._objects(response.objects); signal.throwIfAborted(); await finish(stream);
      return objects.map(value => ({ ...value, ownerPeerId: peerId, local: false }));
    } catch (error) { abortStream(stream, error); throw error; }
    finally { signal.removeEventListener('abort', abort); }
  }
  refresh() {
    if (this.refreshing) return this.refreshing;
    this._active();
    const peers = [...(this.manager.peers?.keys() ?? [])].filter(peerId => this._known(peerId)).slice(0, 32);
    this.refreshing = this._track((async () => {
      let next = 0;
      await Promise.all(Array.from({ length: Math.min(2, peers.length) }, async () => {
        for (;;) {
          const peerId = peers[next++]; if (!peerId || this.closed) break;
          try { this.directory.set(peerId, { at: this.now(), objects: await this.query(peerId) }); }
          catch { /* Retain a bounded recent snapshot through transient disconnections. */ }
        }
      }));
      for (const [peerId, entry] of this.directory) if (!this._known(peerId) || this.now() - entry.at > 20000) this.directory.delete(peerId);
      for (const peerId of this.rate.keys()) if (!this._known(peerId)) this.rate.delete(peerId);
      if (!this.closed) observe(this.onDirectory, [...this.directory.values()].flatMap(value => value.objects).slice(0, WORLD_OBJECT_LIMITS.visible));
    })()).finally(() => { this.refreshing = null; });
    return this.refreshing;
  }
  async close() {
    if (this.closing) return this.closing;
    this.closed = true; this.lifetime.abort(new DOMException('World objects closed', 'AbortError'));
    this.closing = (async () => {
      if (this.registered) { await this.node.unhandle(WORLD_OBJECT_PROTOCOL); this.registered = false; }
      await Promise.allSettled([...this.operations]);
      if (owners.get(this.node) === this) owners.delete(this.node);
      this.directory.clear(); this.rate.clear(); observe(this.onDirectory, []);
    })();
    return this.closing;
  }
}
