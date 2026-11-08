import { publicKeyFromProtobuf, publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { peerIdFromPublicKey } from '@libp2p/peer-id';
import { lpStream } from '@libp2p/utils';
import { multiaddr } from '@multiformats/multiaddr';
import { CID } from 'multiformats/cid';
import { Key } from 'interface-datastore';

export const ARTIFACT_PROVIDER_PROTOCOL = '/peercompute/artifact-provider/1.0.0';
export const ARTIFACT_PROVIDER_MAX_BYTES = 16384;
export const ARTIFACT_PROVIDER_TTL_MS = 60000;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const hex = (bytes) => Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
const fromHex = (value, maximum) => {
  if (typeof value !== 'string' || !/^(?:[0-9a-f]{2})+$/u.test(value) || value.length > maximum * 2) throw new Error('Invalid provider proof encoding');
  return Uint8Array.from(value.match(/../gu), (pair) => Number.parseInt(pair, 16));
};
const text = (value, maximum = 128) => {
  if (typeof value !== 'string' || !value.length || value.length > maximum) throw new Error('Invalid provider record field');
  return value;
};
const canonicalCID = (value) => CID.parse(text(value, 128)).toV1().toString();
export const artifactChallenge = () => hex(crypto.getRandomValues(new Uint8Array(32)));

function normalizeBody(value) {
  if (!value || typeof value !== 'object' || value.schema !== 'peercompute.artifact-provider.v1') throw new Error('Invalid provider schema');
  if (!['query', 'provider'].includes(value.kind)) throw new Error('Invalid provider record kind');
  const artifactPeerId = text(value.artifactPeerId);
  if (!Array.isArray(value.addresses) || value.addresses.length > 8) throw new Error('Too many provider addresses');
  const addresses = [...new Set(value.addresses.map((address) => {
    text(address, 1024);
    const ids = multiaddr(address).getComponents().filter((component) => component.name === 'p2p');
    if (ids.at(-1)?.value !== artifactPeerId) throw new Error('Provider address does not bind artifact identity');
    return address;
  }))].sort();
  if (!/^[0-9a-f]{64}$/u.test(value.nonce)) throw new Error('Invalid provider nonce');
  if (!Number.isSafeInteger(value.issuedAt) || !Number.isSafeInteger(value.expiresAt)) throw new Error('Invalid provider expiry');
  if (typeof value.available !== 'boolean') throw new Error('Invalid provider availability');
  return {
    schema: value.schema, kind: value.kind,
    gameId: text(value.gameId), roomId: text(value.roomId), topologyId: text(value.topologyId),
    appPeerId: text(value.appPeerId), artifactPeerId,
    recipientPeerId: text(value.recipientPeerId), cid: canonicalCID(value.cid),
    nonce: value.nonce, issuedAt: value.issuedAt, expiresAt: value.expiresAt,
    addresses, available: value.available
  };
}

export async function signArtifactProviderRecord(body, { applicationKey, signArtifact }) {
  const normalized = normalizeBody(body);
  const bytes = encoder.encode(JSON.stringify(normalized));
  const artifact = await signArtifact(bytes);
  const record = {
    body: normalized,
    applicationPublicKey: hex(publicKeyToProtobuf(applicationKey.publicKey)),
    artifactPublicKey: hex(artifact.publicKey),
    applicationSignature: hex(await applicationKey.sign(bytes)),
    artifactSignature: hex(artifact.signature)
  };
  if (encoder.encode(JSON.stringify(record)).length > ARTIFACT_PROVIDER_MAX_BYTES) throw new Error('Provider record exceeds byte limit');
  return record;
}

export class ArtifactReplayWindow {
  constructor({ maximumEntries = 1024 } = {}) { this.entries = new Map(); this.maximumEntries = maximumEntries; }
  accept(body, now) {
    for (const [key, expiresAt] of this.entries) if (expiresAt <= now) this.entries.delete(key);
    const key = `${body.appPeerId}:${body.kind}:${body.nonce}`;
    if (this.entries.has(key)) throw new Error('Replayed artifact provider record');
    if (this.entries.size >= this.maximumEntries) throw new Error('Artifact replay window is full');
    this.entries.set(key, body.expiresAt);
  }
}

export async function verifyArtifactProviderRecord(record, {
  scope, expectedPeerId, recipientPeerId, kind, cid, nonce,
  now = Date.now(), replayWindow
}) {
  if (!record || encoder.encode(JSON.stringify(record)).length > ARTIFACT_PROVIDER_MAX_BYTES) throw new Error('Provider record exceeds byte limit');
  const body = normalizeBody(record.body);
  if (body.kind !== kind || body.appPeerId !== expectedPeerId || body.recipientPeerId !== recipientPeerId) throw new Error('Provider identity or recipient mismatch');
  if (body.gameId !== scope.gameId || body.roomId !== scope.roomId || body.topologyId !== scope.topologyId) throw new Error('Artifact provider scope mismatch');
  if ((cid !== undefined && body.cid !== canonicalCID(cid)) || (nonce !== undefined && body.nonce !== nonce)) throw new Error('Artifact provider challenge mismatch');
  if (body.expiresAt <= now || body.issuedAt > now + 5000 || body.expiresAt <= body.issuedAt
    || body.expiresAt - body.issuedAt > ARTIFACT_PROVIDER_TTL_MS) throw new Error('Expired or invalid artifact provider lifetime');
  const applicationKey = publicKeyFromProtobuf(fromHex(record.applicationPublicKey, 128));
  const artifactKey = publicKeyFromProtobuf(fromHex(record.artifactPublicKey, 128));
  if (applicationKey.type !== 'Ed25519' || artifactKey.type !== 'Ed25519'
    || peerIdFromPublicKey(applicationKey).toString() !== body.appPeerId
    || peerIdFromPublicKey(artifactKey).toString() !== body.artifactPeerId) throw new Error('Artifact provider public key mismatch');
  const bytes = encoder.encode(JSON.stringify(body));
  if (!await applicationKey.verify(bytes, fromHex(record.applicationSignature, 128))
    || !await artifactKey.verify(bytes, fromHex(record.artifactSignature, 128))) throw new Error('Invalid artifact provider signature');
  replayWindow?.accept(body, now);
  return body;
}

/** Bounded direct-stream discovery. Unsigned pubsub presence is never consumed. */
export class ArtifactProviderDiscovery {
  constructor(manager, transport, store, { maximumPublicArtifacts = 128, maximumPublicBlocks,
    maximumQueryPeers = 8, queryTimeoutMs = 5000 } = {}) {
    if (maximumPublicBlocks !== undefined && (!Number.isSafeInteger(maximumPublicBlocks)
      || maximumPublicBlocks < 1 || maximumPublicBlocks > 131072)) {
      throw new RangeError('maximumPublicBlocks must be between 1 and 131072');
    }
    this.manager = manager;
    this.transport = transport;
    this.store = store;
    this.configuredMaximumPublicBlocks = maximumPublicBlocks;
    this.maximumPublicArtifacts = Math.min(128, Math.max(1, maximumPublicArtifacts));
    this.maximumQueryPeers = Math.min(8, Math.max(1, maximumQueryPeers));
    this.queryTimeoutMs = Math.min(15000, Math.max(250, queryTimeoutMs));
    this.publicArtifacts = new Set();
    this.providers = new Map();
    this.bindings = new Map();
    this.replayWindow = new ArtifactReplayWindow();
    this.controller = new AbortController();
    this.operations = new Set();
    this.catalogUpdates = Promise.resolve();
    this.closed = false;
    this.lastErrors = [];
    this.expiryTimer = null;
    this.disconnectListener = (event) => this._forgetPeer(event.detail.toString());
  }

  get scope() {
    return { gameId: this.manager.config.gameId, roomId: this.manager.config.roomId, topologyId: this.manager.config.topologyId };
  }

  get indexKey() { return new Key(`/peercompute/artifact-public/${encodeURIComponent(JSON.stringify(this.scope))}`); }

  get maximumPublicBlocks() {
    // Quota selection may change the store's traversal budget after transport
    // startup. Follow that live policy unless the caller supplied a lower cap.
    const storeLimit = this.store.maximumTraversalBlocks ?? 65536;
    if (!Number.isSafeInteger(storeLimit) || storeLimit < 1) throw new RangeError('Invalid artifact store traversal limit');
    return Math.min(131072, storeLimit, this.configuredMaximumPublicBlocks ?? storeLimit);
  }

  async start() {
    let approved = [];
    try { approved = JSON.parse(decoder.decode(await this.store.getDatastore().get(this.indexKey))); }
    catch (error) { if (error.name !== 'NotFoundError') throw error; }
    if (!Array.isArray(approved) || approved.length > this.maximumPublicArtifacts) throw new Error('Invalid persisted public artifact catalog');
    let blocks = new Set();
    const restored = new Set();
    for (const input of approved) {
      const cid = canonicalCID(input);
      if ((await this.store.stat(cid))?.status !== 'complete') continue;
      try {
        // Commit the complete union only after verification and capacity checks.
        // Shared blocks count once; a rejected root cannot expose its prefix.
        const verified = await this._publicBlocksFor([cid], blocks);
        blocks = verified;
        restored.add(cid);
      } catch { /* A missing or corrupt retained root is not advertised. */ }
    }
    this.publicArtifacts = restored;
    this.transport.setPublicBlockCids(blocks);
    await this.manager.libp2p.handle(ARTIFACT_PROVIDER_PROTOCOL, (stream, connection) => {
      if (this.closed || this.operations.size >= 32) { stream.abort(new Error('Artifact discovery is busy')); return; }
      const operation = this._handle(stream, connection);
      this.operations.add(operation);
      operation.catch(() => {}).finally(() => this.operations.delete(operation));
    }, { maxInboundStreams: 4, maxOutboundStreams: 4, runOnLimitedConnection: true });
    this.manager.libp2p.addEventListener('peer:disconnect', this.disconnectListener);
    this.expiryTimer = setInterval(() => {
      for (const [peer, binding] of this.bindings) if (binding.expiresAt <= Date.now()) this._forgetPeer(peer);
    }, 1000);
    this.expiryTimer.unref?.();
    return this;
  }

  _updateCatalog(callback) {
    if (this.closed) return Promise.reject(new Error('Artifact discovery is stopped'));
    const operation = this.catalogUpdates.then(callback);
    this.catalogUpdates = operation.catch(() => {});
    this.operations.add(operation);
    operation.finally(() => this.operations.delete(operation)).catch(() => {});
    return operation;
  }

  announce(cid) { return this._updateCatalog(() => this._announce(cid)); }

  async _announce(cid) {
    cid = canonicalCID(String(cid));
    if ((await this.store.stat(cid))?.status !== 'complete') throw new Error('Only verified complete artifacts may be announced');
    if (!this.publicArtifacts.has(cid) && this.publicArtifacts.size >= this.maximumPublicArtifacts) throw new Error('Public artifact catalog is full');
    // Retention is idempotent for an acknowledged complete root. The closure
    // below remains a fresh block integrity check before serving is approved.
    await this.store.pin(cid, { signal: this.controller.signal });
    const approved = new Set([...this.publicArtifacts, cid]);
    const blocks = await this._publicBlocksFor(approved);
    await this.store.getDatastore().put(this.indexKey, encoder.encode(JSON.stringify([...approved].sort())), { signal: this.controller.signal });
    this.publicArtifacts = approved;
    this.transport.setPublicBlockCids(blocks);
    return { cid, public: true, scope: this.scope };
  }

  withdraw(cid) {
    return this._updateCatalog(async () => {
      cid = canonicalCID(String(cid));
      this.publicArtifacts.delete(cid);
      this.transport.setPublicBlockCids([]);
      await this.store.getDatastore().put(this.indexKey, encoder.encode(JSON.stringify([...this.publicArtifacts].sort())), { signal: this.controller.signal });
      this.transport.setPublicBlockCids(await this._publicBlocksFor(this.publicArtifacts));
      return { cid, public: false, scope: this.scope };
    });
  }

  async _publicBlocksFor(roots, existingBlocks = []) {
    const blocks = new Set(existingBlocks);
    if (blocks.size > this.maximumPublicBlocks) throw new Error('Public artifact block catalog is full');
    for (const root of roots) for await (const block of this.store.listBlockCids(root, { signal: this.controller.signal })) {
      blocks.add(canonicalCID(block));
      if (blocks.size > this.maximumPublicBlocks) throw new Error('Public artifact block catalog is full');
    }
    return blocks;
  }

  _bind(body) {
    if (!this.bindings.has(body.appPeerId) && this.bindings.size >= 128) throw new Error('Artifact identity binding catalog is full');
    const previous = this.bindings.get(body.appPeerId);
    if (previous && previous.artifactPeerId !== body.artifactPeerId) this.transport.revokePeer(previous.artifactPeerId).catch(() => {});
    this.bindings.set(body.appPeerId, body);
    this.transport.authorizePeer(body.artifactPeerId);
  }

  async _record(kind, { recipientPeerId, cid, nonce, available = false }) {
    const info = this.transport.getPeerInfo();
    const issuedAt = Date.now();
    return signArtifactProviderRecord({
      schema: 'peercompute.artifact-provider.v1', kind, ...this.scope,
      appPeerId: this.manager.libp2p.peerId.toString(), artifactPeerId: info.peerId,
      recipientPeerId, cid, nonce, issuedAt, expiresAt: issuedAt + ARTIFACT_PROVIDER_TTL_MS,
      addresses: info.addresses.slice(0, 8), available
    }, { applicationKey: this.manager._applicationPrivateKey,
      signArtifact: (bytes) => this.transport.signProviderRecord(bytes) });
  }

  _signal(signal) { return AbortSignal.any([this.controller.signal, AbortSignal.timeout(this.queryTimeoutMs), ...(signal ? [signal] : [])]); }

  async _handle(stream, connection) {
    const signal = this._signal();
    const abort = () => stream.abort(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    try {
      const rpc = lpStream(stream, { maxDataLength: ARTIFACT_PROVIDER_MAX_BYTES, maxBufferSize: ARTIFACT_PROVIDER_MAX_BYTES + 16 });
      const record = JSON.parse(decoder.decode((await rpc.read({ signal })).subarray()));
      const query = await verifyArtifactProviderRecord(record, {
        scope: this.scope, kind: 'query', expectedPeerId: connection.remotePeer.toString(),
        recipientPeerId: this.manager.libp2p.peerId.toString(), replayWindow: this.replayWindow
      });
      this._bind(query);
      const available = this.publicArtifacts.has(query.cid) && (await this.store.stat(query.cid, { signal }))?.status === 'complete';
      const response = await this._record('provider', { recipientPeerId: query.appPeerId, cid: query.cid, nonce: query.nonce, available });
      await rpc.write(encoder.encode(JSON.stringify(response)), { signal });
      await stream.close({ signal });
    } catch (error) { this.lastInboundError = error.message; stream.abort(error); throw error; }
    finally { signal.removeEventListener('abort', abort); }
  }

  _remember(body) {
    if (!this.providers.has(body.cid)) {
      if (this.providers.size >= 128) this.providers.delete(this.providers.keys().next().value);
      this.providers.set(body.cid, new Map());
    }
    const providers = this.providers.get(body.cid);
    if (body.available) providers.set(body.appPeerId, body);
    else providers.delete(body.appPeerId);
  }

  async _query(connection, cid, signal) {
    signal = this._signal(signal);
    const nonce = artifactChallenge();
    const remotePeer = connection.remotePeer.toString();
    const stream = await connection.newStream(ARTIFACT_PROVIDER_PROTOCOL, { signal, runOnLimitedConnection: true });
    const abort = () => stream.abort(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    try {
      const rpc = lpStream(stream, { maxDataLength: ARTIFACT_PROVIDER_MAX_BYTES, maxBufferSize: ARTIFACT_PROVIDER_MAX_BYTES + 16 });
      const query = await this._record('query', { recipientPeerId: remotePeer, cid, nonce });
      await rpc.write(encoder.encode(JSON.stringify(query)), { signal });
      const response = JSON.parse(decoder.decode((await rpc.read({ signal })).subarray()));
      const body = await verifyArtifactProviderRecord(response, {
        scope: this.scope, kind: 'provider', expectedPeerId: remotePeer,
        recipientPeerId: this.manager.libp2p.peerId.toString(), cid, nonce, replayWindow: this.replayWindow
      });
      this._remember(body);
      if (body.available) this._bind(body);
      await stream.close({ signal });
      return body.available ? body : null;
    } catch (error) { stream.abort(error); throw error; }
    finally { signal.removeEventListener('abort', abort); }
  }

  async find(cid, { signal } = {}) {
    if (this.closed) throw new Error('Artifact discovery is stopped');
    cid = canonicalCID(String(cid));
    const connections = [...new Map(this.manager.libp2p.getConnections()
      .filter((connection) => connection.status === 'open')
      .map((connection) => [connection.remotePeer.toString(), connection])).values()].slice(0, this.maximumQueryPeers);
    if (this.operations.size >= 32) throw new Error('Artifact discovery is busy');
    const operation = Promise.allSettled(connections.map((connection) => this._query(connection, cid, signal)));
    this.operations.add(operation);
    try {
      const results = await operation;
      this.lastErrors = results.flatMap((result, index) => result.status === 'rejected'
        ? [{ peerId: connections[index].remotePeer.toString(), message: result.reason?.message || String(result.reason) }] : []);
    } finally { this.operations.delete(operation); }
    signal?.throwIfAborted();
    this.controller.signal.throwIfAborted();
    const connected = new Set(connections.map((connection) => connection.remotePeer.toString()));
    return [...(this.providers.get(cid)?.values() || [])].filter((record) => record.expiresAt > Date.now()
      && connected.has(record.appPeerId) && record.gameId === this.scope.gameId && record.roomId === this.scope.roomId
      && record.topologyId === this.scope.topologyId).map((record) => structuredClone(record));
  }

  async fetchBlock(cid, { artifactCid, signal } = {}) {
    if (this.closed) throw new Error('Artifact discovery is stopped');
    const known = this.providers.get(canonicalCID(String(artifactCid || cid)));
    const connected = new Set(this.manager.libp2p.getConnections().map((connection) => connection.remotePeer.toString()));
    let providers = [...(known?.values() || [])].filter((provider) => provider.expiresAt > Date.now() + 5000
      && connected.has(provider.appPeerId) && provider.gameId === this.scope.gameId
      && provider.roomId === this.scope.roomId && provider.topologyId === this.scope.topologyId);
    if (!providers.length) {
      providers = await this.find(artifactCid || cid, { signal });
    }
    if (!providers.length) throw new Error(`No authenticated provider for artifact ${artifactCid || cid}`);
    for (const provider of providers) {
      const addresses = [...provider.addresses].sort((a, b) => Number(b.includes('/webrtc/')) - Number(a.includes('/webrtc/')));
      for (const address of addresses) {
        try { await this.transport.dial(address, { signal }); break; }
        catch { signal?.throwIfAborted(); }
      }
    }
    return this.transport.fetchBlock(cid, { signal });
  }

  _forgetPeer(appPeerId) {
    const binding = this.bindings.get(appPeerId);
    if (binding) this.transport.revokePeer(binding.artifactPeerId).catch(() => {});
    this.bindings.delete(appPeerId);
    for (const providers of this.providers.values()) {
      const record = providers.get(appPeerId);
      if (record) this.transport.revokePeer(record.artifactPeerId).catch(() => {});
      providers.delete(appPeerId);
    }
  }

  async stop() {
    if (this.closed) return;
    this.closed = true;
    clearInterval(this.expiryTimer);
    this.controller.abort(new Error('Artifact discovery stopped'));
    this.manager.libp2p.removeEventListener('peer:disconnect', this.disconnectListener);
    await this.manager.libp2p.unhandle(ARTIFACT_PROVIDER_PROTOCOL);
    await Promise.allSettled([...this.operations]);
    this.providers.clear();
  }
}
