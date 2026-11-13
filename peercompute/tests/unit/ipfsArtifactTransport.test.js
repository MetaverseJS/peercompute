import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { create as createDigest } from 'multiformats/hashes/digest';
import { generateKeyPair, publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { peerIdFromPublicKey } from '@libp2p/peer-id';
import { createHeliaLight } from 'helia';
import { withLibp2pLight } from '@helia/libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { ArtifactStore, ARTIFACT_MANIFEST_SCHEMA } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { encodeGeneratedMesh, retainGeneratedMesh, readGeneratedMesh } from '../../src/peercompute/inference/GeneratedMeshArtifact.js';
import { MemoryArtifactBackend } from '../../src/peercompute/artifacts/ArtifactBackends.js';
import { IpfsArtifactTransport } from '../../src/peercompute/networkManager/IpfsArtifactTransport.js';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { signArtifactProviderRecord, verifyArtifactProviderRecord, ArtifactReplayWindow, ArtifactProviderDiscovery, artifactChallenge } from '../../src/peercompute/networkManager/ArtifactProviderRecord.js';

const collect = async (source) => {
  const chunks = [];
  for await (const chunk of source) chunks.push(chunk);
  return Buffer.concat(chunks);
};
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const localOptions = {
  enableWebRTC: false,
  listen: ['/ip4/127.0.0.1/tcp/0/ws'],
  allowInsecureLocalConnections: true,
  requestTimeoutMs: 15000
};
const authorize = (a, b) => {
  a.authorizePeer(b.getPeerInfo().peerId);
  b.authorizePeer(a.getPeerInfo().peerId);
};

const catalogCID = (index) => {
  const hash = new Uint8Array(32);
  new DataView(hash.buffer).setUint32(28, index);
  return CID.createV1(0x55, createDigest(sha256.code, hash)).toString();
};

// Exercise publication policy without allocating tens of thousands of file
// blocks. The real ArtifactStore's verified closure is the boundary mocked here.
const catalogFixture = ({ maximumTraversalBlocks = 65536, ...options } = {}) => {
  const roots = new Map();
  const values = new Map();
  const datastore = {
    failWrites: false,
    async get(key) {
      if (values.has(String(key))) return values.get(String(key));
      const error = new Error('Missing catalog'); error.name = 'NotFoundError'; throw error;
    },
    async put(key, value) {
      if (this.failWrites) throw new Error('Catalog persistence failed');
      values.set(String(key), value.slice());
    }
  };
  const store = {
    maximumTraversalBlocks,
    getDatastore: () => datastore,
    async stat(cid) { return roots.has(cid) ? { status: 'complete' } : null; },
    async pin() {},
    async *listBlockCids(cid) {
      const source = roots.get(cid);
      yield* typeof source === 'function' ? source() : source;
    }
  };
  const manager = { config: { gameId: 'catalog', roomId: 'catalog', topologyId: 'catalog' },
    libp2p: { async handle() {}, async unhandle() {}, addEventListener() {}, removeEventListener() {} } };
  const transport = { publicBlocks: new Set(), setPublicBlockCids(blocks) { this.publicBlocks = new Set(blocks); } };
  const discovery = new ArtifactProviderDiscovery(manager, transport, store, options);
  const persisted = () => JSON.parse(new TextDecoder().decode(values.get(String(discovery.indexKey))));
  const persist = (approved) => datastore.put(discovery.indexKey, new TextEncoder().encode(JSON.stringify(approved)));
  return { roots, store, datastore, transport, discovery, persisted, persist };
};

test('interrupted real provider announcement preserves a complete retained package across reopen', async (t) => {
  const backend = new MemoryArtifactBackend({ name: 'provider-retention' });
  const store = new ArtifactStore({ persistent: false, backend });
  const file = await store.importFile(new Uint8Array(2 * 1024 ** 2 + 17).fill(31), { pin: false });
  const manifest = await store.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA,
    files: [{ path: 'model.bin', cid: file.cid, size: file.size, sha256: file.sha256 }] });
  const fixture = catalogFixture();
  const discovery = new ArtifactProviderDiscovery(fixture.discovery.manager, fixture.transport, store);
  await discovery.start();
  let entered; let release;
  const started = new Promise((resolve) => { entered = resolve; });
  const held = new Promise((resolve) => { release = resolve; });
  const get = backend.get.bind(backend);
  backend.get = async (collection, key) => {
    if (collection === 'blocks' && key === file.cid) { entered(); await held; }
    return get(collection, key);
  };
  t.after(async () => { release(); await discovery.stop(); await store.destroy(); });
  const publication = discovery.announce(manifest.cid);
  const rejected = assert.rejects(publication, /discovery stopped/);
  await started;
  assert.equal((await store.stat(manifest.cid)).status, 'complete');
  const stopping = discovery.stop(); release();
  await rejected; await stopping; await store.destroy();
  const reopened = new ArtifactStore({ persistent: false, backend });
  t.after(() => reopened.destroy());
  assert.equal((await reopened.stat(manifest.cid)).status, 'complete');
  assert.equal((await reopened.stat(manifest.cid)).pinned, true);
  assert.equal((await reopened.gc()).deletedBlocks, 0);
  assert.equal(digest(await collect(reopened.openRead(file.cid))), file.sha256);
  assert.equal(fixture.transport.publicBlocks.size, 0, 'no prefix was published');
});

test('provider publication rejects a corrupted retained package after the idempotent pin', async (t) => {
  const store = new ArtifactStore({ persistent: false });
  const file = await store.importFile(new Uint8Array(300000).fill(42), { pin: false });
  const root = await store.importManifest({ schema: ARTIFACT_MANIFEST_SCHEMA,
    files: [{ path: 'model.bin', cid: file.cid, size: file.size, sha256: file.sha256 }] });
  await store.backend.delete('blocks', file.cid);
  const fixture = catalogFixture();
  const discovery = new ArtifactProviderDiscovery(fixture.discovery.manager, fixture.transport, store);
  t.after(async () => { await discovery.stop(); await store.destroy(); });
  await discovery.start();
  await assert.rejects(discovery.announce(root.cid), { code: 'ERR_NOT_FOUND' });
  assert.equal((await store.stat(root.cid)).status, 'partial');
  assert.equal(discovery.publicArtifacts.size, 0);
  assert.equal(fixture.transport.publicBlocks.size, 0);
});

test('IPFS transport requires a StateManager-owned store and bounded requests', () => {
  assert.throws(() => new IpfsArtifactTransport(), /ArtifactStore/);
  const store = new ArtifactStore({ persistent: false });
  assert.throws(() => new IpfsArtifactTransport({ store, maximumBlockBytes: Infinity }), /maximumBlockBytes/);
  assert.throws(() => new IpfsArtifactTransport({ store, requestTimeoutMs: 0 }), /requestTimeoutMs/);
  assert.throws(() => new IpfsArtifactTransport({ store, peerAddresses: ['/ip4/127.0.0.1/tcp/1234/ws'] }), /peer-id/);
});

test('artifact dial keeps its deadline with a live caller signal and filters only denied alternatives', async (t) => {
  const store = new ArtifactStore({ persistent: false });
  t.after(() => store.destroy());
  const peer = peerIdFromPublicKey((await generateKeyPair('Ed25519')).publicKey).toString();
  const transport = new IpfsArtifactTransport({ store, trustedPeerIds: [peer], requestTimeoutMs: 30 });
  transport.shutdown = new AbortController();
  const caller = new AbortController();
  const allowed = `/p2p/${peer}`;
  const denied = `/ip4/192.0.2.1/tcp/80/ws/p2p/${peer}`;
  let receivedTargets;
  // Hold the connection boundary; the independent watchdog keeps this
  // regression finite when the caller incorrectly disables the deadline.
  transport.node = { status: 'started', libp2p: { dial: async (targets, { signal }) => {
    receivedTargets = targets.map(String);
    await new Promise((resolve, reject) => {
      const finish = (error) => { clearTimeout(watchdog); signal.removeEventListener('abort', abort); reject(error); };
      const abort = () => finish(signal.reason);
      const watchdog = setTimeout(() => finish(new Error('Dial outlived its deadline')), 300);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
  } } };
  await assert.rejects(transport.dial(allowed, { signal: caller.signal }), { name: 'TimeoutError' });
  assert.equal(caller.signal.aborted, false);
  await assert.rejects(transport.dial([denied, allowed], { signal: caller.signal }), { name: 'TimeoutError' });
  assert.deepEqual(receivedTargets, [allowed], 'Denied addresses must never reach the dialer');
  await assert.rejects(transport.dial([denied]), /explicitly trusted/);
  const cancelled = transport.dial(allowed, { signal: caller.signal });
  caller.abort(new Error('Viewer closed'));
  await assert.rejects(cancelled, /Viewer closed/);
  const stopped = transport.dial(allowed);
  transport.shutdown.abort(new Error('Transport stopped'));
  await assert.rejects(stopped, /Transport stopped/);
});

test('artifact connection reuse excludes untrusted, closed and limited relay connections', async (t) => {
  const store = new ArtifactStore({ persistent: false });
  t.after(() => store.destroy());
  const peer = peerIdFromPublicKey((await generateKeyPair('Ed25519')).publicKey);
  const transport = new IpfsArtifactTransport({ store, trustedPeerIds: [peer.toString()] });
  const connection = { remotePeer: peer, status: 'open' };
  transport.node = { status: 'started', libp2p: { getConnections: () => [connection] } };
  assert.equal(transport.hasUsableConnection(peer.toString()), true);
  connection.limits = { bytes: 1024 };
  assert.equal(transport.hasUsableConnection(peer.toString()), false);
  delete connection.limits;
  connection.status = 'closing';
  assert.equal(transport.hasUsableConnection(peer.toString()), false);
  connection.status = 'open';
  transport.trustedPeerIds.clear();
  assert.equal(transport.hasUsableConnection(peer.toString()), false);
  transport.authorizePeer(peer);
  transport.node.status = 'stopped';
  assert.equal(transport.hasUsableConnection(peer.toString()), false);
});

test('three real IPFS peers reseed verified file blocks after the origin exits', { timeout: 45000 }, async (t) => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('Public HTTP fallback is forbidden'); });
  const stores = ['a', 'b', 'c'].map((name) => new ArtifactStore({
    name: `ipfs-unit-${name}`, persistent: false, maximumBytes: 16 * 1024 * 1024
  }));
  const transports = stores.map((store) => new IpfsArtifactTransport({ store, ...localOptions }));
  t.after(async () => {
    await Promise.allSettled(transports.map((transport) => transport.stop()));
    await Promise.allSettled(stores.map((store) => store.destroy()));
  });
  const [a, b, c] = transports;
  await Promise.all([a.start(), a.start(), b.start(), c.start()]);
  assert.notEqual(a.getPeerInfo().peerId, b.getPeerInfo().peerId);
  await assert.rejects(b.dial(a.getPeerInfo().addresses), /explicitly trusted/);
  authorize(a, b);
  await b.dial(a.getPeerInfo().addresses);

  const bytes = new Uint8Array(2 * 1024 * 1024 + 99);
  for (let index = 0; index < bytes.length; index++) bytes[index] = (index * 31 + (index >> 9)) % 251;
  async function* source() {
    for (let offset = 0; offset < bytes.length; offset += 32768) yield bytes.subarray(offset, offset + 32768);
  }
  const imported = await stores[0].importFile(source(), { expectedSize: bytes.length, pin: true });
  await stores[1].ensureLocal(imported.cid, { fetchBlock: b.fetchBlock.bind(b), pin: true });
  assert.equal(digest(await collect(stores[1].openRead(imported.cid))), digest(bytes));
  assert(b.getStats().receivedBlockBytes >= bytes.length);
  assert(a.getStats().sentBlockBytes >= bytes.length);
  const bytesAfterFetch = b.getStats().receivedBlockBytes;
  assert.deepEqual(await collect(stores[1].openRead(imported.cid, { offset: 262130, length: 50 })), Buffer.from(bytes.subarray(262130, 262180)));
  assert.equal(b.getStats().receivedBlockBytes, bytesAfterFetch, 'local range reads are not network traffic');

  await a.stop();
  const identity = b.getPeerInfo().peerId;
  await b.stop();
  assert.equal(digest(await collect(stores[1].openRead(imported.cid))), digest(bytes), 'transport stop does not close owned storage');
  await b.start();
  assert.equal(b.getPeerInfo().peerId, identity, 'artifact identity persists in the StateManager datastore');
  authorize(b, c);
  await c.dial(b.getPeerInfo().addresses);
  const sentBeforeReseed = b.getStats().sentBlockBytes;
  await stores[2].ensureLocal(imported.cid, { fetchBlock: c.fetchBlock.bind(c), pin: true });
  assert.equal(digest(await collect(stores[2].openRead(imported.cid))), digest(bytes));
  assert(c.getStats().receivedBlockBytes >= bytes.length);
  assert(b.getStats().sentBlockBytes > sentBeforeReseed);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
  assert.equal(c.getStats().routing, 'explicit-peers');
  assert.equal(c.getStats().publicGateways, false);
});

test('stopping IPFS cancels a missing-block read without closing the artifact store', { timeout: 15000 }, async (t) => {
  const store = new ArtifactStore({ persistent: false });
  const transport = new IpfsArtifactTransport({ store, ...localOptions });
  t.after(async () => { await transport.stop(); await store.destroy(); });
  await transport.start();
  const cid = CID.createV1(0x55, await sha256.digest(new TextEncoder().encode('absent fixture')));
  const read = transport.fetchBlock(cid);
  const rejected = assert.rejects(read);
  await transport.stop();
  await rejected;
  assert.equal(transport.getStats().pendingReads, 0);
  assert.equal(transport.getStats().readFailures, 1);
  await assert.rejects(transport.fetchBlock(cid), /not started/);
  const local = await store.importFile(new Uint8Array([1, 2, 3]));
  assert.deepEqual(await collect(store.openRead(local.cid)), Buffer.from([1, 2, 3]));
});

test('persistent stores admit one network owner with a nonblocking lifetime Web Lock', async (t) => {
  const held = new Map();
  const requests = [];
  const locks = {
    request(name, options, callback) {
      requests.push({ name, ...options });
      if (held.has(name) && options.ifAvailable) return Promise.resolve(callback(null));
      const previous = held.get(name)?.done ?? Promise.resolve();
      let release;
      const token = { done: new Promise((resolve) => { release = resolve; }) };
      held.set(name, token);
      return previous.then(() => callback({ name, mode: options.mode })).finally(() => {
        release(); if (held.get(name) === token) held.delete(name);
      });
    }
  };
  const backend = new MemoryArtifactBackend({ name: 'shared-persistent-network' });
  const stores = [0, 1].map(() => new ArtifactStore({ backend, persistent: true, lockManager: locks }));
  const [a, b] = stores.map((store) => new IpfsArtifactTransport({ store, ...localOptions }));
  t.after(async () => { await Promise.all([a.stop(), b.stop()]); await Promise.all(stores.map((store) => store.destroy())); });
  await a.start();
  const identity = a.getPeerInfo().peerId;
  await assert.rejects(b.start(), /already active for this store/);
  const local = await stores[1].importFile(new Uint8Array([7, 8]));
  assert.deepEqual(await collect(stores[1].openRead(local.cid)), Buffer.from([7, 8]), 'second owner can still use local storage');
  assert(requests.filter((request) => request.name.endsWith(':network-owner')).every((request) => request.ifAvailable === true));
  await a.stop();
  await b.start();
  assert.equal(b.getPeerInfo().peerId, identity, 'ownership transfers without changing the persisted artifact identity');
});

test('failed transport stop retains identity ownership and permits cleanup retry', async (t) => {
  const store = new ArtifactStore({ persistent: false });
  const a = new IpfsArtifactTransport({ store, ...localOptions });
  const b = new IpfsArtifactTransport({ store, ...localOptions });
  t.after(async () => { await Promise.all([a.stop(), b.stop()]); await store.destroy(); });
  await a.start();
  const node = a.node;
  const identity = a.getPeerInfo().peerId;
  const stop = node.stop.bind(node);
  node.stop = async () => { throw new Error('Stop was not acknowledged'); };
  await assert.rejects(a.stop(), /not acknowledged/);
  assert.equal(a.node, node);
  assert.equal(a.requiresCleanup, true);
  await assert.rejects(b.start(), /already active for this store/);
  await assert.rejects(a.start(), /cleanup must succeed/);
  node.stop = stop;
  await a.stop();
  await b.start();
  assert.equal(b.getPeerInfo().peerId, identity);
});

test('NetworkManager retains startup cleanup failures for an acknowledged retry', async (t) => {
  const store = new ArtifactStore({ persistent: false });
  const manager = new NetworkManager({ enableTopologyController: false });
  manager.libp2p = {};
  manager._applicationPrivateKey = {};
  t.mock.method(IpfsArtifactTransport.prototype, '_startNode', async function () {
    this.shutdown = new AbortController();
    this.node = { async stop() { throw new Error('Cleanup was not acknowledged'); } };
    throw new Error('Startup failed');
  });
  await assert.rejects(manager.createArtifactTransport(store, localOptions), /startup cleanup failed/);
  const transport = manager.getArtifactTransport();
  assert(transport?.requiresCleanup);
  await assert.rejects(manager.createArtifactTransport(store, localOptions), /cleanup must succeed/);
  const competitor = new IpfsArtifactTransport({ store, ...localOptions });
  await assert.rejects(competitor.start(), /already active for this store/);
  transport.node.stop = async () => {};
  await manager._stopArtifactTransport();
  assert.equal(manager.getArtifactTransport(), null);
  assert.equal(transport.releaseOwnership, null);
  await store.destroy();
});

test('provider proofs reject forged bindings, replay, expiry, scope and challenge mismatch', async () => {
  const applicationKey = await generateKeyPair('Ed25519');
  const artifactKey = await generateKeyPair('Ed25519');
  const scope = { gameId: 'proof-game', roomId: 'proof-room', topologyId: 'proof-topology' };
  const appPeerId = peerIdFromPublicKey(applicationKey.publicKey).toString();
  const artifactPeerId = peerIdFromPublicKey(artifactKey.publicKey).toString();
  const cid = CID.createV1(0x55, await sha256.digest(new Uint8Array([5]))).toString();
  const now = Date.now();
  const body = { schema: 'peercompute.artifact-provider.v1', kind: 'provider', ...scope,
    appPeerId, artifactPeerId, recipientPeerId: appPeerId, cid, nonce: artifactChallenge(),
    issuedAt: now, expiresAt: now + 60000, available: true,
    addresses: [`/ip4/127.0.0.1/tcp/1234/ws/p2p/${artifactPeerId}`] };
  const sign = (value) => signArtifactProviderRecord(value, { applicationKey,
    signArtifact: async (bytes) => ({ publicKey: publicKeyToProtobuf(artifactKey.publicKey), signature: await artifactKey.sign(bytes) }) });
  const record = await sign(body);
  const options = { scope, expectedPeerId: appPeerId, recipientPeerId: appPeerId,
    kind: 'provider', cid, nonce: body.nonce, now };
  assert.equal((await verifyArtifactProviderRecord(record, options)).artifactPeerId, artifactPeerId);
  const forged = structuredClone(record);
  forged.body.available = false;
  await assert.rejects(verifyArtifactProviderRecord(forged, options), /signature/);
  const forgedArtifact = structuredClone(record);
  forgedArtifact.artifactPublicKey = forgedArtifact.applicationPublicKey;
  await assert.rejects(verifyArtifactProviderRecord(forgedArtifact, options), /key mismatch/);
  await assert.rejects(verifyArtifactProviderRecord(record, { ...options, now: now + 60000 }), /Expired/);
  await assert.rejects(verifyArtifactProviderRecord(record, { ...options, scope: { ...scope, roomId: 'other' } }), /scope/);
  await assert.rejects(verifyArtifactProviderRecord(record, { ...options, nonce: artifactChallenge() }), /challenge/);
  await assert.rejects(verifyArtifactProviderRecord(record, { ...options, expectedPeerId: artifactPeerId }), /identity/);
  const replayWindow = new ArtifactReplayWindow({ maximumEntries: 1 });
  await verifyArtifactProviderRecord(record, { ...options, replayWindow });
  await assert.rejects(verifyArtifactProviderRecord(record, { ...options, replayWindow }), /Replayed/);
  const fresh = await sign({ ...body, nonce: artifactChallenge() });
  await assert.rejects(verifyArtifactProviderRecord(fresh, { ...options, nonce: fresh.body.nonce, replayWindow }), /full/);
});

test('interleaved artifact discovery rotates independent bounded peer batches', async () => {
  const f = catalogFixture(), calls = new Map();
  f.discovery.manager.libp2p.getConnections = () => Array.from({ length: 16 }, (_, index) => ({ status: 'open',
    remotePeer: { toString: () => `peer-${index}` } }));
  f.discovery._query = async (connection, cid) => {
    if (!calls.has(cid)) calls.set(cid, []);
    calls.get(cid).push(connection.remotePeer.toString());
  };
  const roots = [catalogCID(701), catalogCID(702)];
  for (let round = 0; round < 2; round++) for (const cid of roots) await f.discovery.find(cid);
  for (const cid of roots) assert.deepEqual(calls.get(cid), Array.from({ length: 16 }, (_, index) => `peer-${index}`));
  for (let index = 0; index < 129; index++) await f.discovery.find(catalogCID(1000 + index));
  assert.equal(f.discovery.queryCursors.size, 128);
  await f.discovery.stop(); assert.equal(f.discovery.queryCursors.size, 0);
});

test('block delivery falls back across providers but stops immediately on cancellation', async (t) => {
  const f = catalogFixture(), cid = catalogCID(801), connected = new Set(), calls = [];
  t.after(() => f.discovery.stop());
  const providers = Array.from({ length: 3 }, (_, index) => ({ ...f.discovery.scope,
    cid, appPeerId: `app-${index}`, artifactPeerId: `artifact-${index}`, expiresAt: Date.now() + 60000,
    addresses: [`address-${index}-a`, `address-${index}-b`] }));
  // These records stand for already verified proofs; the three-node test below
  // exercises the actual signatures, streams and file bytes.
  f.discovery.providers.set(cid, new Map(providers.map((provider) => [provider.appPeerId, provider])));
  f.discovery.manager.libp2p.getConnections = () => providers.map((provider) => ({ remotePeer: provider.appPeerId }));
  f.transport.hasUsableConnection = (peer) => connected.has(peer);
  f.transport.dial = async (addresses) => {
    calls.push(addresses);
    if (addresses[0] === 'address-0-a') throw new Error('Unreachable');
    if (addresses[0] === 'address-2-a') connected.add('artifact-2');
    // Provider 1 resolves a dial, but has no unrestricted Bitswap connection.
  };
  f.transport.fetchBlock = async () => { calls.push('read'); return new Uint8Array([17]); };
  assert.deepEqual(await f.discovery.fetchBlock(cid), new Uint8Array([17]));
  assert.deepEqual(calls, [...providers.map((provider) => provider.addresses), 'read']);

  calls.length = 0; connected.clear(); connected.add('artifact-0');
  let reads = 0;
  f.transport.fetchBlock = async () => {
    calls.push('read');
    if (++reads === 1) throw new Error('Provider lost block');
    return new Uint8Array([18]);
  };
  assert.deepEqual(await f.discovery.fetchBlock(cid), new Uint8Array([18]));
  assert.deepEqual(calls, ['read', providers[1].addresses, providers[2].addresses, 'read']);

  calls.length = 0; connected.clear();
  const caller = new AbortController();
  f.transport.dial = async (addresses) => {
    calls.push(addresses); caller.abort(new Error('Viewer gone')); throw caller.signal.reason;
  };
  await assert.rejects(f.discovery.fetchBlock(cid, { signal: caller.signal }), /Viewer gone/);
  assert.equal(calls.length, 1, 'Cancellation must not trigger another provider attempt');
});

test('NetworkManagers discover signed providers and expose only approved complete artifacts', { timeout: 30000 }, async (t) => {
  const managers = [];
  const appNodes = [];
  const stores = [];
  t.after(async () => {
    await Promise.allSettled(managers.map((manager) => manager.disconnect()));
    await Promise.allSettled(appNodes.map((node) => node.stop()));
    await Promise.allSettled(stores.map((store) => store.destroy()));
  });
  for (let index = 0; index < 3; index++) {
    const applicationKey = await generateKeyPair('Ed25519');
    const app = withLibp2pLight(createHeliaLight(), {
      privateKey: applicationKey, addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
      transports: [webSockets()], connectionEncrypters: [noise()], streamMuxers: [yamux()],
      services: { identify: identify() }, peerDiscovery: []
    });
    appNodes.push(app);
    await app.start();
    const manager = new NetworkManager({ gameId: 'artifact-unit', roomId: 'same-room', enableTopologyController: false });
    managers.push(manager);
    // Use real application streams while keeping unrelated pubsub/topology out
    // of this unit fixture. The browser harness also runs initialize/connect.
    manager.libp2p = app.libp2p;
    manager._applicationPrivateKey = applicationKey;
    const store = new ArtifactStore({ name: `signed-${index}`, persistent: false });
    stores.push(store);
    await manager.createArtifactTransport(store, localOptions);
  }
  const [a, b, stale] = managers;
  await b.libp2p.dial(a.libp2p.getMultiaddrs()[0]);
  const publicBytes = new Uint8Array(524301).fill(31);
  const approved = await stores[0].importFile(publicBytes);
  const privateArtifact = await stores[0].importFile(new TextEncoder().encode('private fixture'));
  assert.deepEqual(await b.findArtifactProviders(approved.cid), []);
  await a.announceArtifact(approved.cid);
  // The actual owner is beyond a full bounded batch of unrelated connections.
  // Its provider signature and subsequent Bitswap delivery remain real; only
  // the unrelated peers' unsupported discovery streams are controlled here.
  const connections = b.libp2p.getConnections.bind(b.libp2p), unrelatedQueries = [];
  const unrelated = Array.from({ length: 8 }, (_, index) => ({ status: 'open', remotePeer: { toString: () => `unrelated-${index}` },
    async newStream() { unrelatedQueries.push(index); throw new Error('Unrelated peer has no artifact service'); } }));
  let providers;
  b.libp2p.getConnections = () => [...unrelated, ...connections()];
  try {
    assert.deepEqual(await b.findArtifactProviders(approved.cid), []);
    assert.deepEqual(unrelatedQueries, [0, 1, 2, 3, 4, 5, 6, 7]);
    providers = await b.findArtifactProviders(approved.cid);
    assert.equal(unrelatedQueries.length, 15, 'Second batch contains seven unrelated peers and the real owner');
  } finally { b.libp2p.getConnections = connections; }
  assert.equal(providers.length, 1, JSON.stringify({ outbound: b.artifactDiscovery.lastErrors, inbound: a.artifactDiscovery.lastInboundError }));
  assert.equal(providers[0].appPeerId, a.libp2p.peerId.toString());
  assert.equal(providers[0].artifactPeerId, a.getArtifactTransport().getPeerInfo().peerId);
  await stores[1].ensureLocal(approved.cid, {
    fetchBlock: (cid, options) => b.fetchArtifactBlock(cid, { ...options, artifactCid: approved.cid })
  });
  assert.deepEqual(await collect(stores[1].openRead(approved.cid)), Buffer.from(publicBytes));
  // A freshly receiving store needs both the retained manifest and its GLB
  // closure. Real signed discovery/Noise/Bitswap delivers both, then the same
  // mesh admission used by object/avatar viewers verifies their exact bytes.
  const mesh = encodeGeneratedMesh({ positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
    indices: new Uint16Array([0, 1, 2]), colors: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) });
  const savedMesh = await retainGeneratedMesh(stores[0], mesh, { name: 'Fresh peer retained mesh' });
  await stores[0].gc();
  assert.equal(await stores[1].stat(savedMesh.artifactCid), undefined);
  assert.deepEqual(await b.findArtifactProviders(savedMesh.artifactCid), []);
  await a.announceArtifact(savedMesh.artifactCid);
  // A second actual provider signs the same complete mesh, but its advertised
  // artifact address is unreachable. Its application connection remains live.
  await b.libp2p.dial(stale.libp2p.getMultiaddrs()[0]);
  const duplicate = await retainGeneratedMesh(stores[2], mesh, { name: 'Fresh peer retained mesh' });
  assert.equal(duplicate.artifactCid, savedMesh.artifactCid);
  await stale.announceArtifact(savedMesh.artifactCid);
  const staleTransport = stale.getArtifactTransport();
  const peerInfo = staleTransport.getPeerInfo.bind(staleTransport);
  staleTransport.getPeerInfo = () => ({ ...peerInfo(), addresses: [
    `/ip4/127.0.0.1/tcp/1/ws/p2p/${peerInfo().peerId}`
  ] });
  const meshProviders = await b.findArtifactProviders(savedMesh.artifactCid);
  assert.equal(meshProviders.length, 2);
  // Put the genuine stale proof first deterministically, regardless of stream
  // response timing. Both records were authenticated by the real discovery.
  const known = b.artifactDiscovery.providers.get(savedMesh.artifactCid);
  const healthy = known.get(a.libp2p.peerId.toString());
  known.delete(healthy.appPeerId); known.set(healthy.appPeerId, healthy);
  const receiver = b.getArtifactTransport(), dial = receiver.dial.bind(receiver), attempted = [];
  receiver.dial = async (addresses, options) => { attempted.push(addresses); return dial(addresses, options); };
  const started = performance.now();
  await stores[1].ensureLocal(savedMesh.artifactCid, {
    fetchBlock: (cid, options) => b.fetchArtifactBlock(cid, { ...options, artifactCid: savedMesh.artifactCid })
  });
  const receivedMesh = await readGeneratedMesh(stores[1], savedMesh.artifactCid);
  assert.deepEqual(receivedMesh.data, mesh.data);
  assert.equal(receivedMesh.sha256, mesh.sha256);
  assert.equal(receivedMesh.vertexCount, 3); assert.equal(receivedMesh.triangleCount, 1);
  t.diagnostic(`Signed peer mesh verified in ${Math.round(performance.now() - started)}ms; extra dials: ${attempted.length}`);
  assert.equal(attempted.length, 0, 'Use the existing healthy provider without dialing stale providers for every block');
  receiver.dial = dial;
  assert.deepEqual(await b.findArtifactProviders(privateArtifact.cid), []);
  await a.announceArtifact(privateArtifact.cid);
  assert.equal((await b.findArtifactProviders(privateArtifact.cid)).length, 1);
  await a.withdrawArtifact(privateArtifact.cid);
  assert.deepEqual(await b.findArtifactProviders(privateArtifact.cid), []);
  await assert.rejects(b.getArtifactTransport().fetchBlock(privateArtifact.cid, { signal: AbortSignal.timeout(100) }));
  const retained = b.getArtifactTransport();
  const stop = retained.node.stop.bind(retained.node);
  retained.node.stop = async () => { throw new Error('Managed transport stop failed'); };
  await assert.rejects(b.disconnect(), /Managed transport stop failed/);
  assert.equal(b.getArtifactTransport(), retained, 'manager must retain transport ownership after failed stop');
  retained.node.stop = stop;
  await b.disconnect();
  assert.equal(b.getArtifactTransport(), null);
  assert.deepEqual(await collect(stores[1].openRead(approved.cid)), Buffer.from(publicBytes));
});

test('public catalog restore counts shared blocks once and excludes rejected root prefixes', async (t) => {
  const fixture = catalogFixture({ maximumPublicBlocks: 5 });
  t.after(() => fixture.discovery.stop());
  const blocks = Array.from({ length: 7 }, (_, index) => catalogCID(index));
  fixture.roots.set(blocks[0], [blocks[0], blocks[1], blocks[2]]);
  fixture.roots.set(blocks[3], [blocks[1], blocks[2], blocks[3]]);
  fixture.roots.set(blocks[4], [blocks[4], blocks[5]]);
  fixture.roots.set(blocks[6], async function* () { yield blocks[6]; throw new Error('Corrupt retained root'); });
  await fixture.persist([blocks[0], blocks[3], blocks[4], blocks[6]]);
  await fixture.discovery.start();
  assert.deepEqual(fixture.discovery.publicArtifacts, new Set([blocks[0], blocks[3]]));
  assert.deepEqual(fixture.transport.publicBlocks, new Set(blocks.slice(0, 4)));
  assert.equal(fixture.transport.publicBlocks.has(blocks[4]), false, 'capacity failure must not expose a verified prefix');
  assert.equal(fixture.transport.publicBlocks.has(blocks[6]), false, 'verification failure must not expose a verified prefix');
});

test('public catalog admission follows quota changes and leaves prior publication intact on failure', async (t) => {
  const fixture = catalogFixture({ maximumTraversalBlocks: 3 });
  t.after(() => fixture.discovery.stop());
  const blocks = Array.from({ length: 6 }, (_, index) => catalogCID(index));
  fixture.roots.set(blocks[0], [blocks[0], blocks[1]]);
  fixture.roots.set(blocks[2], [blocks[1], blocks[2]]);
  fixture.roots.set(blocks[3], [blocks[3], blocks[4]]);
  fixture.roots.set(blocks[5], [blocks[5]]);
  await fixture.discovery.start();
  await fixture.discovery.announce(blocks[0]);
  await fixture.discovery.announce(blocks[2]);
  const before = fixture.persisted();
  await assert.rejects(fixture.discovery.announce(blocks[3]), /block catalog is full/);
  assert.deepEqual(fixture.persisted(), before);
  assert.deepEqual(fixture.discovery.publicArtifacts, new Set(before));
  assert.deepEqual(fixture.transport.publicBlocks, new Set(blocks.slice(0, 3)));

  fixture.store.maximumTraversalBlocks = 5;
  assert.equal(fixture.discovery.maximumPublicBlocks, 5);
  await fixture.discovery.announce(blocks[3]);
  assert.deepEqual(fixture.transport.publicBlocks, new Set(blocks.slice(0, 5)));
  const expanded = fixture.persisted();
  fixture.store.maximumTraversalBlocks = 6;
  fixture.datastore.failWrites = true;
  await assert.rejects(fixture.discovery.announce(blocks[5]), /persistence failed/);
  assert.deepEqual(fixture.persisted(), expanded);
  assert.deepEqual(fixture.discovery.publicArtifacts, new Set(expanded));
  assert.deepEqual(fixture.transport.publicBlocks, new Set(blocks.slice(0, 5)));
});

test('public block limits are bounded by explicit configuration, current storage policy and the hard ceiling', () => {
  for (const invalid of [0, -1, 1.5, NaN, Infinity, 131073, '102400']) {
    assert.throws(() => catalogFixture({ maximumPublicBlocks: invalid }), /maximumPublicBlocks/);
  }
  const defaults = catalogFixture();
  assert.equal(defaults.discovery.maximumPublicBlocks, 65536);
  defaults.store.maximumTraversalBlocks = 102400;
  assert.equal(defaults.discovery.maximumPublicBlocks, 102400);
  defaults.store.maximumTraversalBlocks = 500000;
  assert.equal(defaults.discovery.maximumPublicBlocks, 131072);
  const explicit = catalogFixture({ maximumPublicBlocks: 10, maximumTraversalBlocks: 5 });
  assert.equal(explicit.discovery.maximumPublicBlocks, 5);
  explicit.store.maximumTraversalBlocks = 20;
  assert.equal(explicit.discovery.maximumPublicBlocks, 10);
  explicit.store.maximumTraversalBlocks = NaN;
  assert.throws(() => explicit.discovery.maximumPublicBlocks, /store traversal limit/);
});

test('an explicit larger public catalog admits more than 65536 unique verified block CIDs', { timeout: 15000 }, async (t) => {
  const fixture = catalogFixture({ maximumPublicBlocks: 102400 });
  t.after(() => fixture.discovery.stop());
  const root = catalogCID(0);
  fixture.roots.set(root, function* () {
    for (let index = 0; index < 65537; index++) yield catalogCID(index);
  });
  await fixture.discovery.start();
  await assert.rejects(fixture.discovery.announce(root), /block catalog is full/);
  assert.equal(fixture.transport.publicBlocks.size, 0);
  // The same discovery instance sees the user's 24GiB store policy selection.
  fixture.store.maximumTraversalBlocks = 102400;
  await fixture.discovery.announce(root);
  assert.equal(fixture.transport.publicBlocks.size, 65537);
  assert.deepEqual(fixture.persisted(), [root]);
});
