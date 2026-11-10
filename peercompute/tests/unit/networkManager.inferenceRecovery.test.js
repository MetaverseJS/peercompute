import test from 'node:test';
import assert from 'node:assert/strict';
import { multiaddr } from '@multiformats/multiaddr';
import { generateKeyPair } from '@libp2p/crypto/keys';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PeerConnectionRecovery } from '../../src/peercompute/networkManager/inference/PeerConnectionRecovery.js';

const SELF = '12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs';
const PEER = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
const RELAY = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
const RELAY_ADDRESS = `/dns4/relay.example/tcp/443/wss/p2p/${RELAY}`;
const CIRCUIT = `${RELAY_ADDRESS}/p2p-circuit/p2p/${PEER}`;
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const turn = () => new Promise((resolve) => setImmediate(resolve));

function connection(id, address, { peerId = PEER, encryption = 'native', openedAt = Date.now() - 30000 } = {}) {
  return { id, remotePeer: { toString: () => peerId }, remoteAddr: multiaddr(address),
    encryption, status: 'open', timeline: { open: openedAt }, streams: [], closes: 0, aborts: 0,
    async close() { this.closes++; this.status = 'closed'; },
    abort() { this.aborts++; this.status = 'closed'; } };
}

function fixture(t, { config = {}, recovery = {} } = {}) {
  let now = Date.now();
  const manager = new NetworkManager({ bootstrapPeers: [RELAY_ADDRESS], ...config });
  manager.peerId = SELF; manager.isConnected = true;
  manager.peers.set(PEER, { gameId: manager.config.gameId, roomId: manager.config.roomId,
    topologyId: manager.config.topologyId, directCandidateSince: now - 30000 });
  const old = connection('old-direct', `/webrtc/p2p/${PEER}`, { openedAt: now - 30000 });
  const connections = [old], dials = [];
  let dial = async () => {
    const next = connection(`fresh-${dials.length}`, CIRCUIT, { encryption: '/noise', openedAt: now });
    connections.push(next); return next;
  };
  manager.libp2p = { peerId: { toString: () => SELF },
    getConnections: (id) => connections.filter((item) => !id || item.remotePeer.toString() === id.toString()),
    getDialQueue: () => [],
    dial: async (address, options) => { dials.push({ address: address.toString(), options }); return dial(address, options); },
    async stop() {}, addEventListener() {}, removeEventListener() {} };
  const helper = new PeerConnectionRecovery(manager, { now: () => now, ...recovery });
  manager.peerConnectionRecovery = helper;
  t.after(async () => {
    await helper.stop();
    for (const timer of manager.relayPruneTimers.values()) clearTimeout(timer);
    manager.relayPruneTimers.clear();
  });
  return { manager, helper, old, connections, dials, setDial: (fn) => { dial = fn; },
    now: () => now, advance: (ms) => { now += ms; } };
}

test('recovery dials a fresh authenticated configured relay circuit without disrupting the existing native connection', async (t) => {
  const f = fixture(t);
  f.old.streams.push({ protocol: '/peercompute/inference/3.0.0', status: 'open' });
  const result = await f.helper.recover(PEER);
  assert.notEqual(result, f.old);
  assert.equal(result.remotePeer.toString(), PEER);
  assert.equal(result.encryption, '/noise');
  assert.equal(f.dials.length, 1);
  assert.equal(f.dials[0].address, CIRCUIT, 'use configured relay signaling, never the incomplete native address');
  assert.equal(f.dials[0].options.force, true, 'libp2p must not return the existing unusable connection');
  assert(f.dials[0].options.signal instanceof AbortSignal);
  assert.equal(f.old.closes + f.old.aborts, 0);
  assert.equal(f.old.streams.length, 1);
});

test('recovery rejects unknown, self, bootstrap and disconnected targets before dialing', async (t) => {
  const f = fixture(t);
  for (const peerId of ['not-a-peer', SELF, RELAY]) {
    await assert.rejects(f.helper.recover(peerId));
  }
  f.manager.isConnected = false;
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0);
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('a valid but unknown peer and an unconfigured relay cannot trigger recovery traffic', async (t) => {
  const f = fixture(t);
  f.manager.peers.delete(PEER); f.connections.length = 0;
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0);
  f.manager.peers.set(PEER, { gameId: f.manager.config.gameId, roomId: f.manager.config.roomId,
    topologyId: f.manager.config.topologyId }); f.connections.push(f.old);
  f.manager._buildCircuitAddr = () => multiaddr(`/dns4/untrusted.example/tcp/443/wss/p2p/${SELF}/p2p-circuit/p2p/${PEER}`);
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0, 'a remembered or forged route must not extend the configured relay trust set');
});

test('recovery honors normal backoff and transport headroom while retaining the logical peer slot', async (t) => {
  const f = fixture(t, { config: { maxConnections: 1, transportMaxConnections: 3 } });
  f.manager.peerDialBackoff.set(PEER, { until: f.now() + 10000 });
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0);
  f.manager.peerDialBackoff.clear();
  const occupied = connection('occupied', RELAY_ADDRESS, { peerId: RELAY, encryption: '/noise' });
  const occupiedSecond = connection('occupied-second', RELAY_ADDRESS, { peerId: RELAY, encryption: '/noise' });
  f.connections.push(occupied, occupiedSecond);
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0, 'a replacement may not force capacity eviction of unrelated connections');
  f.connections.splice(1);
  const recovered = await f.helper.recover(PEER);
  assert.equal(recovered.remotePeer.toString(), PEER, 'same peer may recover even at logical peer capacity');
  assert.equal(f.dials.length, 1);
  assert.equal(occupied.closes + occupied.aborts, 0);
});

test('recovery cannot join or take ownership of an ordinary in-flight same-peer dial', async (t) => {
  const f = fixture(t);
  f.manager.libp2p.getDialQueue = () => [{ id: 'normal-manager-dial', status: 'active',
    peerId: { toString: () => PEER }, multiaddrs: [multiaddr(`${RELAY_ADDRESS}/p2p-circuit/webrtc/p2p/${PEER}`)] }];
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0, 'force:true does not prevent libp2p from joining an existing dial');
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('ordinary queued dials reserve physical headroom before a recovery adds another connection', async (t) => {
  const f = fixture(t, { config: { transportMaxConnections: 3 } });
  f.manager.libp2p.getDialQueue = () => [{ id: 'unrelated-normal-dial', status: 'queued',
    peerId: { toString: () => RELAY }, multiaddrs: [multiaddr(RELAY_ADDRESS)] }];
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0);
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('a missing bootstrap connection reserves both the outer relay and inner peer circuit', async (t) => {
  const f = fixture(t, { config: { transportMaxConnections: 2 } });
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 0, 'one free slot cannot hold both new transport connections');
  f.manager.config.transportMaxConnections = 3;
  const bootstrap = connection('already-connected-bootstrap', RELAY_ADDRESS, { peerId: RELAY, encryption: '/noise' });
  f.connections.push(bootstrap);
  const recovered = await f.helper.recover(PEER);
  assert.equal(recovered.encryption, '/noise'); assert.equal(f.dials.length, 1);
  assert.equal(bootstrap.closes + bootstrap.aborts, 0);
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('a transport returning an original connection cannot make recovery close another operation', async (t) => {
  const f = fixture(t);
  f.setDial(async () => f.old);
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('simultaneous recovery callers share one dial and repeat failures cannot grow connections without a cooldown', async (t) => {
  const f = fixture(t), gate = deferred();
  f.setDial(() => gate.promise);
  const first = f.helper.recover(PEER), second = f.helper.recover(PEER);
  await turn();
  assert.equal(f.dials.length, 1);
  const fresh = connection('fresh-coalesced', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(fresh); gate.resolve(fresh);
  assert.equal(await first, fresh); assert.equal(await second, fresh);
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 1);
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('cancelled recovery waiter cannot cancel another waiter or revive after manager shutdown', async (t) => {
  const f = fixture(t), gate = deferred(), cancel = new AbortController();
  f.setDial(() => gate.promise);
  const first = f.helper.recover(PEER, { signal: cancel.signal });
  const firstRejected = assert.rejects(first, (error) => error.name === 'AbortError');
  const second = f.helper.recover(PEER);
  await turn(); cancel.abort(); await firstRejected;
  assert.equal(f.dials.length, 1);
  const fresh = connection('fresh-after-one-cancel', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(fresh); gate.resolve(fresh);
  assert.equal(await second, fresh);
  assert.equal(fresh.closes + fresh.aborts, 0);
  await f.helper.stop();
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('an already aborted request never starts a recovery dial', async (t) => {
  const f = fixture(t), controller = new AbortController(); controller.abort();
  await assert.rejects(f.helper.recover(PEER, { signal: controller.signal }), (error) => error.name === 'AbortError');
  assert.equal(f.dials.length, 0);
});

test('concurrent repairs to distinct known peers respect the repair admission cap', async (t) => {
  const f = fixture(t, { recovery: { maxConcurrent: 1 } }), gate = deferred();
  const other = peerIdFromPrivateKey(await generateKeyPair('Ed25519')).toString();
  f.manager.peers.set(other, { gameId: f.manager.config.gameId, roomId: f.manager.config.roomId,
    topologyId: f.manager.config.topologyId });
  f.connections.push(connection('other-direct', `/webrtc/p2p/${other}`, { peerId: other }));
  f.setDial(() => gate.promise);
  const first = f.helper.recover(PEER); await turn();
  await assert.rejects(f.helper.recover(other));
  assert.equal(f.dials.length, 1);
  const fresh = connection('fresh-with-slot', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(fresh); gate.resolve(fresh); await first;
});

test('both ends preserve a fresh inbound relay during negotiation and a bounded active inference hold', async (t) => {
  const f = fixture(t, { config: { webrtc: { directUpgradeGraceMs: 0 } } });
  const incoming = connection('incoming-recovery', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(incoming);
  f.manager._maybePruneRelayConnections(PEER);
  assert.equal(incoming.closes, 0, 'the host must leave time to negotiate before its protocol handler can retain the connection');
  assert(f.helper.protectionMs(incoming) > 0);
  const release = f.manager.retainPeerInferenceConnection(incoming, { timeoutMs: 30000 });
  f.advance(20000); f.manager._maybePruneRelayConnections(PEER);
  assert.equal(incoming.closes, 0, 'an established old native connection does not authorize closing an active relay request');
  release(); release();
  f.advance(14999); f.manager._maybePruneRelayConnections(PEER);
  assert.equal(incoming.closes, 0, 'idle reuse is bounded but avoids directory poll churn');
  f.advance(2); f.manager._maybePruneRelayConnections(PEER);
  assert.equal(incoming.closes, 1, 'normal pruning resumes after release and idle grace');
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('nested inference holds protect until the last owner releases and no hold can be infinite', async (t) => {
  const f = fixture(t), incoming = connection('nested', CIRCUIT, { encryption: '/noise', openedAt: f.now() - 30000 });
  f.connections.push(incoming);
  const first = f.helper.retain(incoming, { timeoutMs: 30000 });
  const second = f.helper.retain(incoming, { timeoutMs: 60000 });
  first(); f.advance(20000);
  assert(f.helper.protectionMs(incoming) > 0, 'one owner release must not revoke another live operation');
  second(); f.advance(15001);
  assert.equal(f.helper.protectionMs(incoming), 0);
  assert.throws(() => f.helper.retain(incoming, { timeoutMs: Infinity }));
  assert.throws(() => f.helper.retain(incoming, { timeoutMs: 301001 }));
  f.helper.retain(incoming, { timeoutMs: 100 }); f.advance(101);
  assert.equal(f.helper.protectionMs(incoming), 0, 'an abandoned owner cannot protect the connection forever');
});

test('topology pruning respects active inference leases on both directions of native and relay connections', async (t) => {
  for (const address of [`/webrtc/p2p/${PEER}`, `${RELAY_ADDRESS}/p2p-circuit/webrtc/p2p/${PEER}`, CIRCUIT]) {
    for (const direction of ['inbound', 'outbound']) {
      const f = fixture(t, { config: { maxConnections: 1 } }); f.connections.length = 0;
      const active = connection('active', address, { encryption: address.includes('webrtc') ? 'native' : '/noise', openedAt: f.now() - 30000 });
      active.direction = direction; f.connections.push(active);
      const release = f.manager.retainPeerInferenceConnection(active, { timeoutMs: 30000 });
      f.manager.topologyController = { getPeerDistance: () => 1 };
      const candidates = [{ peerId: PEER, via: 'webrtc' }, { peerId: SELF, via: 'webrtc' }];
      f.manager._pruneExcessTopologyConnections(new Set([SELF]), candidates, candidates);
      assert.equal(active.closes, 0, `${direction} ${address} was closed during an acknowledged request`);
      assert(f.helper.protectionMs(active) > 0);
      release(); f.advance(15001);
      f.manager._pruneExcessTopologyConnections(new Set([SELF]), candidates, candidates);
      assert.equal(active.closes, 1, 'normal topology maintenance resumes after bounded idle grace');
    }
  }
});

test('routine close paths preserve active application streams but not idle, completed or gossip-only links', async (t) => {
  const f = fixture(t, { config: { webrtc: { directUpgradeGraceMs: 0 } } });
  f.manager.libp2p.services = { pubsub: { protocols: ['/custom-gossip/1'], multicodecs: ['/custom-flood/1'] },
    identify: { protocol: '/custom-identify/1' }, ping: { protocol: '/custom-ping/1' } };
  for (const address of [`/webrtc/p2p/${PEER}`, CIRCUIT]) {
    const active = connection('application', address, { openedAt: f.now() - 30000 });
    active.streams.push({ protocol: '/fixture/other-application/1', status: 'open' }); f.connections.push(active);
    f.manager._closeConnectionsToPeer(PEER); assert.equal(active.closes, 0);
    f.manager._maybePruneRelayConnections(PEER); assert.equal(active.closes, 0);
    active.streams[0].status = 'closed';
    active.streams.push(...['/custom-gossip/1', '/custom-flood/1', '/custom-identify/1', '/custom-ping/1']
      .map(protocol => ({ protocol, status: 'open' })));
    f.manager._closeConnectionsToPeer(PEER); assert.equal(active.closes, 1);
  }
});

test('bootstrap retirement preserves an active circuit stream and closes its gossip-only transport afterward', async (t) => {
  const f = fixture(t);
  const bootstrap = connection('bootstrap', RELAY_ADDRESS, { peerId: RELAY, encryption: '/noise', openedAt: f.now() - 30000 });
  const circuit = { protocol: '/libp2p/circuit/relay/0.2.0/hop', status: 'open' }; bootstrap.streams.push(circuit); f.connections.push(bootstrap);
  f.manager._closeBootstrapRelayConnections(); assert.equal(bootstrap.closes, 0);
  circuit.status = 'closed'; f.manager._closeBootstrapRelayConnections(); assert.equal(bootstrap.closes, 1);
});

test('direct inference holds remain bounded, reject foreign handles, and never prevent explicit shutdown', async (t) => {
  const f = fixture(t); const release = f.helper.retain(f.old, { timeoutMs: 100 });
  assert(f.helper.protectionMs(f.old) > 0); f.advance(101); assert.equal(f.helper.protectionMs(f.old), 0);
  assert.throws(() => f.helper.retain(connection('foreign', `/webrtc/p2p/${PEER}`)), /not owned/);
  release(); f.old.streams.push({ protocol: '/fixture/live-application/1', status: 'open' });
  f.helper.retain(f.old, { timeoutMs: 30000 });
  let stops = 0; f.manager.libp2p.stop = async () => { stops++; await f.old.close(); };
  await f.manager.disconnect(); assert.equal(stops, 1); assert.equal(f.old.closes, 1);
  assert.equal(f.helper.protectionMs(f.old), 0);
});

test('a missing relay reservation permits only a bounded same-peer retry after matching readiness', async (t) => {
  const f = fixture(t), assisted = [];
  f.manager._isRelayReservationError = (error) => error.code === 'TEST_NO_RESERVATION';
  f.manager._requestRelayAssist = async (peerId) => {
    assisted.push(peerId);
    queueMicrotask(() => f.helper.notifyRelayReady(peerId));
    return true;
  };
  f.setDial(async () => {
    if (f.dials.length === 1) throw Object.assign(new Error('No reservation'), { code: 'TEST_NO_RESERVATION' });
    const fresh = connection('after-assist', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
    f.connections.push(fresh); return fresh;
  });
  const result = await f.helper.recover(PEER);
  assert.equal(result.id, 'after-assist'); assert.deepEqual(assisted, [PEER]);
  assert.equal(f.dials.length, 2);
  assert(f.dials.every((dial) => dial.address === CIRCUIT && dial.options.force === true));
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('relay-assist retry rechecks physical capacity consumed while waiting', async (t) => {
  const f = fixture(t, { config: { transportMaxConnections: 3 } });
  const other = peerIdFromPrivateKey(await generateKeyPair('Ed25519')).toString();
  f.manager._isRelayReservationError = (error) => error.code === 'TEST_NO_RESERVATION';
  f.manager._requestRelayAssist = async (peerId) => {
    f.connections.push(connection('arrived-during-assist', `/webrtc/p2p/${other}`, { peerId: other }));
    queueMicrotask(() => f.helper.notifyRelayReady(peerId)); return true;
  };
  f.setDial(async () => {
    if (f.dials.length === 1) throw Object.assign(new Error('No reservation'), { code: 'TEST_NO_RESERVATION' });
    return connection('unsafe-over-capacity', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  });
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials.length, 1, 'a late second dial cannot evict another connection to make room');
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('late completion after the only waiter cancels closes only the owned fresh connection', { timeout: 2000 }, async (t) => {
  const f = fixture(t, { recovery: { dialTimeoutMs: 100 } }), gate = deferred(), cancel = new AbortController();
  f.setDial(() => gate.promise);
  const pending = f.helper.recover(PEER, { signal: cancel.signal });
  const rejected = assert.rejects(pending, (error) => error.name === 'AbortError');
  await turn(); cancel.abort(); await rejected;
  assert.equal(f.dials[0].options.signal.aborted, true);
  const fresh = connection('late-after-cancel', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(fresh); gate.resolve(fresh); await turn(); await turn();
  assert.equal(fresh.closes + fresh.aborts, 1);
  assert.equal(f.old.closes + f.old.aborts, 0);
});

test('manager shutdown cancels recovery, accounts for late completion, and never closes an existing stream itself', { timeout: 2000 }, async (t) => {
  const f = fixture(t, { recovery: { dialTimeoutMs: 100 } }), gate = deferred();
  f.setDial(() => gate.promise);
  const pending = f.manager.recoverPeerInferenceConnection(PEER);
  const rejected = assert.rejects(pending);
  await turn(); await f.manager.disconnect(); await rejected;
  const fresh = connection('late-after-stop', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(fresh); gate.resolve(fresh); await turn(); await turn();
  assert.equal(fresh.closes + fresh.aborts, 1);
  assert.equal(f.old.closes + f.old.aborts, 0);
  assert.equal(f.manager.isConnected, false);
});

test('recovery independently rejects wrong-peer or plaintext dial results without touching originals', async (t) => {
  for (const bad of [{ peerId: RELAY, encryption: '/noise' }, { peerId: PEER, encryption: '/plaintext/2.0.0' }]) {
    const f = fixture(t), fresh = connection('invalid-fresh', CIRCUIT, { ...bad, openedAt: f.now() });
    f.setDial(async () => { f.connections.push(fresh); return fresh; });
    await assert.rejects(f.helper.recover(PEER));
    assert.equal(fresh.closes + fresh.aborts, 1);
    assert.equal(f.old.closes + f.old.aborts, 0);
  }
});

test('non-cooperative dial is deadline bounded and its late owned connection is cleaned up', { timeout: 2000 }, async (t) => {
  const f = fixture(t, { recovery: { dialTimeoutMs: 25 } }), gate = deferred();
  f.setDial(() => gate.promise);
  await assert.rejects(f.helper.recover(PEER));
  assert.equal(f.dials[0].options.signal.aborted, true);
  const late = connection('late-timeout', CIRCUIT, { encryption: '/noise', openedAt: f.now() });
  f.connections.push(late); gate.resolve(late); await turn(); await turn();
  assert.equal(late.closes + late.aborts, 1);
  assert.equal(f.old.closes + f.old.aborts, 0);
});
