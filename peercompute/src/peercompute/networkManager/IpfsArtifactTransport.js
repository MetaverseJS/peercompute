import { createHeliaLight } from 'helia';
import { withLibp2pLight } from '@helia/libp2p';
import { withBitswap } from '@helia/bitswap';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { multiaddr } from '@multiformats/multiaddr';
import { CID } from 'multiformats/cid';
import { publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { loadOrCreateSelfKey } from '@libp2p/config';

const MAX_BLOCK_BYTES = 2 * 1024 * 1024;
const localNetworkOwners = new WeakMap();
const peerIdsInAddress = (address) => multiaddr(String(address)).getComponents()
  .filter((component) => component.name === 'p2p').map((component) => component.value);

// Sent counters come from Bitswap's network implementation, never cache reads.
// Sent counters describe payloads reported sent by Bitswap, not delivery ACKs.
const createMetrics = (values) => {
  const counter = (name) => ({
    increment(amount = 1) {
      const delta = typeof amount === 'number' ? amount : amount.global ?? 0;
      values[name] = (values[name] || 0) + delta;
    },
    decrement(amount = 1) { values[name] = (values[name] || 0) - amount; },
    update(amount) { if (typeof amount === 'number') values[name] = amount; },
    reset() { values[name] = 0; }
  });
  return {
    traceFunction: (_name, fn) => fn,
    registerCounter: counter,
    registerMetric: counter,
    registerMetricGroup: counter
  };
};

/**
 * A separately identified IPFS node owned by NetworkManager. StateManager owns
 * both physical stores. No HTTP gateways, bootstrap, DHT or delegated routing
 * are configured. Callers must explicitly authorize artifact peer identities;
 * an unsigned application presence message is not an identity binding.
 */
export class IpfsArtifactTransport {
  constructor({
    store,
    relayAddresses = [],
    peerAddresses = [],
    trustedPeerIds = [],
    listen = [],
    enableWebRTC = typeof window !== 'undefined',
    rtcConfiguration = { iceServers: [] },
    allowInsecureLocalConnections = false,
    maximumBlockBytes = MAX_BLOCK_BYTES,
    requestTimeoutMs = 30000
  } = {}) {
    if (!store?.getBlockstore || !store?.getDatastore) {
      throw new TypeError('An ArtifactStore with borrowed blockstore/datastore accessors is required');
    }
    if (!Number.isSafeInteger(maximumBlockBytes) || maximumBlockBytes <= 0 || maximumBlockBytes > MAX_BLOCK_BYTES) {
      throw new RangeError('maximumBlockBytes must be between 1 and 2097152');
    }
    if (!Number.isSafeInteger(requestTimeoutMs) || requestTimeoutMs <= 0) {
      throw new RangeError('requestTimeoutMs must be a positive integer');
    }
    this.store = store;
    this.relayAddresses = relayAddresses.map(String);
    this.peerAddresses = peerAddresses.map(String);
    this.trustedPeerIds = new Set(trustedPeerIds.map(String));
    for (const address of [...this.relayAddresses, ...this.peerAddresses]) {
      const identities = peerIdsInAddress(address);
      if (!identities.length) throw new TypeError('Artifact peer addresses must include /p2p/<peer-id>');
      for (const id of identities) this.trustedPeerIds.add(id);
    }
    this.configuredPeerIds = new Set(this.trustedPeerIds);
    this.publicBlockCids = null;
    this.options = {
      listen: [...listen], enableWebRTC, allowInsecureLocalConnections,
      rtcConfiguration: { iceServers: [], ...structuredClone(rtcConfiguration) }, maximumBlockBytes, requestTimeoutMs
    };
    this.node = null;
    this.identityKey = null;
    this.starting = null;
    this.stopping = null;
    this.releaseOwnership = null;
    this.shutdown = null;
    this.pendingReads = new Set();
    this.receipts = new Map();
    this.counters = {};
    this.readFailures = 0;
    this.lastError = null;
  }

  authorizePeer(peerId) {
    const value = String(peerId);
    // Validate the identifier using the multiaddr codec, before altering policy.
    peerIdsInAddress(`/p2p/${value}`);
    this.trustedPeerIds.add(value);
    return this;
  }

  async revokePeer(peerId) {
    const value = String(peerId);
    if (this.configuredPeerIds.has(value)) return;
    this.trustedPeerIds.delete(value);
    if (this.node?.status === 'started') {
      await Promise.allSettled(this.node.libp2p.getConnections()
        .filter((connection) => connection.remotePeer.toString() === value).map((connection) => connection.close()));
    }
  }

  setPublicBlockCids(cids) {
    this.publicBlockCids = new Set([...cids].map((cid) => CID.parse(String(cid)).toV1().toString()));
  }

  async signProviderRecord(bytes) {
    if (this.node?.status !== 'started') throw new Error('Artifact transport is not started');
    const key = this.identityKey;
    return { publicKey: publicKeyToProtobuf(key.publicKey), signature: await key.sign(bytes) };
  }

  _servingBlockstore() {
    const store = this.store.getBlockstore();
    const visible = (cid) => this.publicBlockCids === null || this.publicBlockCids.has(CID.parse(String(cid)).toV1().toString());
    return new Proxy(store, {
      get(target, property) {
        if (property === 'has') return async (cid, options) => visible(cid) && target.has(cid, options);
        if (property === 'get') return async function* (cid, options) {
          if (!visible(cid)) { const error = new Error('Artifact block is not public'); error.name = 'NotFoundError'; throw error; }
          yield* target.get(cid, options);
        };
        const value = target[property];
        return typeof value === 'function' ? value.bind(target) : value;
      }
    });
  }

  _connectionGater() {
    const deniedPeer = (peer) => !this.trustedPeerIds.has(peer.toString());
    return {
      denyDialPeer: deniedPeer,
      denyInboundEncryptedConnection: deniedPeer,
      denyOutboundEncryptedConnection: deniedPeer,
      denyInboundRelayedConnection: (relay, peer) => deniedPeer(relay) || deniedPeer(peer),
      denyDialMultiaddr: (address) => {
        const value = address.toString();
        const identities = peerIdsInAddress(value);
        if (!identities.length || identities.some((id) => !this.trustedPeerIds.has(id))) return true;
        const insecure = value.includes('/ws') && !value.includes('/wss') && !value.includes('/tls');
        if (!insecure) return false;
        const loopback = value.startsWith('/ip4/127.0.0.1/') || value.startsWith('/ip6/::1/');
        return !this.options.allowInsecureLocalConnections || !loopback;
      }
    };
  }

  async start() {
    if (this.stopping) await this.stopping;
    if (this.requiresCleanup) throw new Error('Artifact transport cleanup must succeed before restarting');
    if (this.node?.status === 'started') return this;
    if (this.starting) return this.starting;
    this.starting = this._start();
    try { return await this.starting; } finally { this.starting = null; }
  }

  async _start() {
    await this.store.open();
    await this._acquireOwnership();
    try { return await this._startNode(); }
    catch (error) {
      this.lastError = error.message;
      this.shutdown?.abort(error);
      try { await this._stopOwnedNode(); }
      catch (cleanupError) { throw new AggregateError([error, cleanupError], 'Artifact transport startup cleanup failed'); }
      throw error;
    }
  }

  get requiresCleanup() { return Boolean(this.releaseOwnership && this.shutdown?.signal.aborted); }

  async _acquireOwnership() {
    const occupied = () => new Error('Artifact network is already active for this store in another tab or transport; local storage and inference remain available');
    if (this.store.persistent && this.store.lockManager?.request) {
      let acquired, denied, release;
      const ready = new Promise((resolve, reject) => { acquired = resolve; denied = reject; });
      const held = new Promise((resolve) => { release = resolve; });
      const lifetime = this.store.lockManager.request(
        `${this.store.lockName}:network-owner`, { mode: 'exclusive', ifAvailable: true }, async (lock) => {
          if (!lock) { denied(occupied()); return; }
          acquired();
          await held;
        });
      lifetime.catch(denied);
      await ready;
      this.releaseOwnership = async () => { release(); await lifetime; };
      return;
    }
    // Memory stores are isolated by backend object. Persistent Node backends
    // must already hold an exclusive physical-store lock before reaching here.
    if (this.store.persistent && !this.store.backend?.hasExclusiveLock) {
      throw new Error('Persistent artifact networking requires an exclusive store ownership mechanism');
    }
    const key = this.store.backend ?? this.store;
    if (localNetworkOwners.has(key)) throw occupied();
    const owner = {};
    localNetworkOwners.set(key, owner);
    this.releaseOwnership = async () => {
      if (localNetworkOwners.get(key) === owner) localNetworkOwners.delete(key);
    };
  }

  async _startNode() {
    this.identityKey = await loadOrCreateSelfKey(this.store.getDatastore());
    this.shutdown = new AbortController();
    const transports = [webSockets()];
    const listen = [...this.options.listen];
    if (this.options.enableWebRTC) {
      transports.push(circuitRelayTransport(), webRTC({
        rtcConfiguration: structuredClone(this.options.rtcConfiguration)
      }));
      listen.push(...this.relayAddresses.map((address) => `${address}/p2p-circuit`), '/webrtc');
    }
    // Construct fresh options: withLibp2pLight mutates its options with identity.
    const node = withBitswap(withLibp2pLight(createHeliaLight({
      blockstore: this._servingBlockstore(),
      datastore: this.store.getDatastore(),
      metrics: createMetrics(this.counters)
    }), {
      privateKey: this.identityKey,
      addresses: { listen },
      transports,
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      services: { identify: identify() },
      peerDiscovery: [],
      connectionGater: this._connectionGater()
    }), {
      maxInboundStreams: 16,
      maxOutboundStreams: 16,
      messageSendConcurrency: 4,
      maxIncomingMessageSize: 4 * 1024 * 1024,
      maxOutgoingMessageSize: 4 * 1024 * 1024
    });
    this.node = node;
    await node.start();
    for (const address of this.peerAddresses) await this.dial(address);
    return this;
  }

  async _stopOwnedNode() {
    // Retain both the node and its lifetime ownership if stop rejects. A second
    // tab must not reuse the key until the previous network owner acknowledges stop.
    if (this.node) await this.node.stop();
    this.node = null;
    this.identityKey = null;
    await this.releaseOwnership?.();
    this.releaseOwnership = null;
  }

  async stop() {
    if (this.stopping) return this.stopping;
    this.stopping = (async () => {
      if (this.starting) await this.starting.catch(() => {});
      this.shutdown?.abort(new Error('Artifact transport stopped'));
      await Promise.allSettled([...this.pendingReads]);
      await this._stopOwnedNode();
      return this;
    })();
    try { return await this.stopping; } finally { this.stopping = null; }
  }

  async dial(addresses, { signal } = {}) {
    if (this.node?.status !== 'started') throw new Error('Artifact transport is not started');
    const targets = (Array.isArray(addresses) ? addresses : [addresses]).map((address) => multiaddr(String(address)));
    for (const target of targets) {
      if (this._connectionGater().denyDialMultiaddr(target)) {
        throw new Error(`Artifact address is not explicitly trusted: ${target}`);
      }
    }
    const connection = await this.node.libp2p.dial(targets, {
      signal: AbortSignal.any([this.shutdown.signal, signal || AbortSignal.timeout(this.options.requestTimeoutMs)])
    });
    if (connection.remoteAddr.toString().includes('/webrtc/')) {
      await Promise.allSettled(this.node.libp2p.getConnections()
        .filter((candidate) => candidate !== connection && candidate.remotePeer.equals(connection.remotePeer)
          && candidate.remoteAddr.toString().includes('/p2p-circuit/p2p/'))
        .map((candidate) => candidate.close()));
    }
    return connection;
  }

  async fetchBlock(cid, { signal } = {}) {
    if (this.node?.status !== 'started') throw new Error('Artifact transport is not started');
    const parsed = CID.parse(String(cid));
    const key = parsed.toV1().toString();
    const receipt = this.receipts.get(key) || { readers: 0, counted: false };
    receipt.readers++;
    this.receipts.set(key, receipt);
    const operation = this._fetchBlock(parsed, signal, receipt);
    this.pendingReads.add(operation);
    try { return await operation; } finally {
      this.pendingReads.delete(operation);
      if (--receipt.readers === 0) this.receipts.delete(key);
    }
  }

  async _fetchBlock(cid, signal, receipt) {
    const combined = AbortSignal.any([
      this.shutdown.signal, AbortSignal.timeout(this.options.requestTimeoutMs), ...(signal ? [signal] : [])
    ]);
    try {
      const chunks = [];
      let size = 0;
      let networkReceived = false;
      const local = this.store.getBlockstore();
      const source = await local.has(cid, { signal: combined }) ? local.get(cid, { signal: combined }) : this.node.blockstore.get(cid, {
        signal: combined,
        onProgress: (event) => {
          if (event.type === 'helia:block-broker:receive-block') networkReceived = true;
        }
      });
      for await (const chunk of source) {
        size += chunk.byteLength;
        if (size > this.options.maximumBlockBytes) throw new RangeError('Artifact block exceeds maximumBlockBytes');
        chunks.push(chunk);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      // Count verified network payloads, deduplicating concurrent readers of
      // one block. Local reads and rejected/corrupt payloads never count.
      if (networkReceived && !receipt.counted) {
        receipt.counted = true;
        this.counters.receivedBlockBytes = (this.counters.receivedBlockBytes || 0) + size;
        this.counters.receivedBlocks = (this.counters.receivedBlocks || 0) + 1;
      }
      return bytes;
    } catch (error) {
      this.readFailures++;
      this.lastError = error.message;
      throw error;
    }
  }

  getPeerInfo() {
    return {
      peerId: this.node?.status === 'started' ? this.node.libp2p.peerId.toString() : null,
      addresses: this.node?.status === 'started' ? this.node.libp2p.getMultiaddrs().map(String) : []
    };
  }

  getStats() {
    return {
      ...this.getPeerInfo(),
      status: this.node?.status || 'stopped',
      connectedPeers: this.node?.status === 'started'
        ? [...new Set(this.node.libp2p.getConnections().map((connection) => connection.remotePeer.toString()))] : [],
      receivedBlockBytes: this.counters.receivedBlockBytes || 0,
      receivedBlocks: this.counters.receivedBlocks || 0,
      sentBlockBytes: this.counters.helia_bitswap_sent_data_bytes_total || 0,
      sentBlocks: this.counters.helia_bitswap_sent_blocks_total || 0,
      pendingReads: this.pendingReads.size,
      readFailures: this.readFailures,
      lastError: this.lastError,
      routing: 'explicit-peers',
      publicGateways: false
    };
  }
}
