import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PeerConnectionRecovery } from '../../src/peercompute/networkManager/inference/PeerConnectionRecovery.js';
import { PEER_INFERENCE_PROTOCOL } from '../../src/peercompute/networkManager/inference/protocol.js';

const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { manifestCid: cid, modelId: 'private-recovery', name: 'Private vision fixture', modalities: ['text', 'image'],
  runtime: 'test-only-callback', repository: 'fixture/model', revision: 'fixture', totalBytes: 100 };
const empty = () => ({ sharedModels: [], hostedModels: [], hostedModel: null, busy: false, idleForMs: 0 });
const deferred = () => { let resolve; const promise = new Promise((yes) => { resolve = yes; }); return { promise, resolve }; };
async function until(check) {
  for (let i = 0; i < 200; i++) { if (check()) return; await delay(10); }
  throw new Error('Private recovery fixture did not settle');
}

async function fixture(t) {
  const nodes = [], managers = [];
  t.after(async () => {
    for (const manager of managers) await manager._stopPeerInferenceService();
    for (const manager of managers) {
      await manager.peerConnectionRecovery?.stop();
      for (const timer of manager.relayPruneTimers.values()) clearTimeout(timer);
      manager.relayPruneTimers.clear();
    }
    await Promise.allSettled(nodes.map((node) => node.stop()));
  });
  const create = async (options = {}) => {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
      transports: [webSockets(), circuitRelayTransport()], connectionEncrypters: [noise()],
      streamMuxers: [yamux()], services: { identify: identify() }, ...options });
    nodes.push(node); return node;
  };
  const relay = await create({ services: { identify: identify(), relay: circuitRelayServer({ reservations: { applyDefaultLimit: false } }) } });
  const relayAddress = relay.getMultiaddrs()[0].toString();
  const host = await create({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws', `${relayAddress}/p2p-circuit`] } });
  const requestor = await create();
  await until(() => host.getMultiaddrs().some((value) => value.toString().includes('/p2p-circuit')));
  await requestor.dial(host.getMultiaddrs().find((value) => !value.toString().includes('/p2p-circuit')));
  const entries = [];
  for (const node of [requestor, host]) {
    const manager = new NetworkManager({ bootstrapPeers: [relayAddress], webrtc: { dropRelayOnDirect: true,
      dropRelayBootstrapOnDirect: false, directUpgradeGraceMs: 0 }, maxConnections: 4, transportMaxConnections: 12 });
    managers.push(manager); manager.libp2p = node; manager.peerId = node.peerId.toString(); manager.isConnected = true;
    manager.peerConnectionRecovery = new PeerConnectionRecovery(manager, { freshGraceMs: 100, idleGraceMs: 100 });
    const other = node === host ? requestor : host;
    manager.peers.set(other.peerId.toString(), { gameId: manager.config.gameId, roomId: manager.config.roomId,
      topologyId: manager.config.topologyId, directCandidateSince: Date.now() - 30000 });
    node.addEventListener('connection:open', ({ detail }) => {
      manager.peerConnectionRecovery.observe(detail);
      manager._maybePruneRelayConnections(detail.remotePeer.toString());
    });
    const entry = { node, manager, state: empty(), calls: [], generations: 0 };
    entry.run = async (input) => { entry.calls.push(input); entry.generations++; input.onToken('blue'); return { text: 'blue' }; };
    entry.service = await manager.createPeerInferenceService({ owner: entry, getLocalState: () => entry.state,
      generate: (input) => entry.run(input), queryTimeoutMs: 1000, requestTimeoutMs: 5000 });
    entries.push(entry);
  }
  entries[1].state = { ...empty(), sharedModels: [model], hostedModels: [model], hostedModel: model };
  const original = requestor.getConnections(host.peerId).find((value) => !value.remoteAddr.toString().includes('/p2p-circuit'));
  return { requestor: entries[0], host: entries[1], original };
}

function stallInference(connection) {
  const original = connection.newStream.bind(connection), pending = [];
  connection.newStream = (protocol, options) => {
    if ([protocol].flat().includes(PEER_INFERENCE_PROTOCOL)) {
      const value = deferred(); pending.push(value); return value.promise;
    }
    return original(protocol, options);
  };
  return { pending, restore() { connection.newStream = original; } };
}

test('a missing authenticated link discovers and generates over a fresh configured Noise relay', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  await original.close();
  await until(() => !requestor.node.getConnections(host.node.peerId).length);
  let normalDials = 0;
  requestor.manager._maybeDialPeer = async () => { normalDials++; };
  const directory = await requestor.service.refresh();
  assert.deepEqual(directory.errors, []);
  assert.equal(directory.hosts[0].hosts[0].peerId, host.node.peerId.toString());
  assert.equal(normalDials, 0, 'normal WebRTC dialing must not consume the short directory deadline first');
  const fresh = requestor.node.getConnections(host.node.peerId).find(value => value.remoteAddr.toString().includes('/p2p-circuit'));
  assert(fresh); assert.equal(fresh.encryption, '/noise');
  assert.equal(host.generations, 0, 'discovery sends no generation');
  const result = await requestor.service.generate(cid, { prompt: 'Describe the world.' });
  assert.equal(result.text, 'blue'); assert.equal(result.peerId, host.node.peerId.toString());
  assert.equal(result.connectionEncryption, '/noise'); assert.match(result.connectionAddress, /p2p-circuit/);
  assert.equal(host.generations, 1, 'exactly one application request follows connection recovery');
});

test('cancelling missing-link acquisition cannot publish a late directory or send a prompt', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  await original.close();
  await until(() => !requestor.node.getConnections(host.node.peerId).length);
  const nativeDial = requestor.node.dial.bind(requestor.node), entered = deferred(), gate = deferred();
  requestor.node.dial = async (...args) => { entered.resolve(); await gate.promise; return nativeDial(...args); };
  const caller = new AbortController();
  const refresh = requestor.service.refresh({ signal: caller.signal });
  const rejected = assert.rejects(refresh, { name: 'AbortError' });
  await entered.promise; caller.abort(); await rejected;
  gate.resolve(); await until(() => requestor.service.recoveries.size === 0);
  assert.equal(requestor.service.records.has(host.node.peerId.toString()), false);
  assert.equal(host.generations, 0); assert.equal(host.calls.length, 0);
});

test('missing-link recovery retains application scope and physical capacity admission', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  await original.close();
  await until(() => !requestor.node.getConnections(host.node.peerId).length);
  const peer = requestor.manager.peers.get(host.node.peerId.toString());
  const nativeDial = requestor.node.dial.bind(requestor.node); let forcedDials = 0;
  requestor.node.dial = async (...args) => { if (args[1]?.force) forcedDials++; return nativeDial(...args); };
  requestor.manager._maybeDialPeer = async () => {};
  peer.roomId = 'different-room';
  assert.equal((await requestor.service.refresh()).hosts.length, 0);
  assert.equal(forcedDials, 0, 'out-of-scope peers cannot enter relay repair');
  peer.roomId = requestor.manager.config.roomId;
  requestor.manager._getTransportMaxConnections = () => 0;
  assert.equal((await requestor.service.refresh()).hosts.length, 0);
  assert.equal(forcedDials, 0, 'repair cannot exceed physical connection headroom');
  assert.equal(host.generations, 0);
});

test('real private Noise peers recover a stalled open link automatically and retain the fresh relay through vision generation', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  // An unrelated active application stream must survive inference recovery.
  await host.node.handle('/fixture/keep-open/1', () => {});
  const unrelated = await original.newStream('/fixture/keep-open/1');
  t.after(() => unrelated.abort(new Error('Fixture complete')));
  const stalled = stallInference(original); t.after(() => stalled.restore());
  const directory = await requestor.service.refresh();
  assert.deepEqual(directory.errors, []); assert.equal(directory.hosts[0].task, 'image-text-to-text');
  assert.equal(requestor.manager.peerConnectionRecovery.cooldowns.size, 1);
  assert.equal(original.status, 'open'); assert.equal(unrelated.status, 'open');
  const fresh = requestor.node.getConnections(host.node.peerId).find((value) => value.remoteAddr.toString().includes('/p2p-circuit'));
  assert(fresh); assert.equal(fresh.encryption, '/noise'); assert.notEqual(fresh.id, original.id);
  host.run = async (input) => {
    host.calls.push(input); host.generations++;
    await delay(140); // Outlive the fresh handshake grace on both endpoints.
    requestor.manager._maybePruneRelayConnections(host.node.peerId.toString());
    host.manager._maybePruneRelayConnections(requestor.node.peerId.toString());
    assert.equal(fresh.status, 'open', 'active request holds its specific relay');
    input.onToken('blue'); return { text: 'blue' };
  };
  const pixels = new Uint8Array([0, 0, 255, 255]);
  const result = await requestor.service.generate(cid, { prompt: 'Describe color', image: { width: 1, height: 1, channels: 4, data: pixels } });
  assert.equal(result.peerId, host.node.peerId.toString()); assert.equal(result.connectionEncryption, '/noise');
  assert.match(result.connectionAddress, /p2p-circuit/); assert.equal(result.text, 'blue');
  assert.deepEqual(host.calls[0].image.data, pixels); assert.equal(host.generations, 1);
  assert.equal(stalled.pending.length, 1, 'a fresh working alternative suppresses repeated stalled-link negotiation');
  assert.equal(original.status, 'open'); assert.equal(unrelated.status, 'open');
  let lateAborted = 0;
  for (const value of stalled.pending) value.resolve({ abort() { lateAborted++; } });
  await delay(0); assert.equal(lateAborted, 1);
});

test('cancellation while bounded repair finishes sends no generation header or prompt', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  await requestor.service.refresh();
  const stalled = stallInference(original); t.after(() => stalled.restore());
  const normalDial = requestor.node.dial.bind(requestor.node), entered = deferred(), gate = deferred();
  requestor.node.dial = async (...args) => { entered.resolve(); await gate.promise; return normalDial(...args); };
  const caller = new AbortController();
  const request = requestor.service.generate(cid, { prompt: 'Must not leave requester', signal: caller.signal });
  const rejected = assert.rejects(request, { name: 'AbortError' });
  await entered.promise; caller.abort(); await rejected;
  gate.resolve(); await until(() => requestor.service.recoveries.size === 0);
  assert.equal(host.calls.length, 0); assert.equal(host.service.inbound.size, 0);
  assert.equal(original.status, 'open'); assert.equal(requestor.service.outbound.size, 0);
  for (const value of stalled.pending) value.resolve({ abort() {} });
});

test('unsupported protocols and malformed authenticated directories do not trigger fresh dials', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  let recoveryCalls = 0;
  const recovery = requestor.manager.recoverPeerInferenceConnection.bind(requestor.manager);
  requestor.manager.recoverPeerInferenceConnection = (...args) => { recoveryCalls++; return recovery(...args); };
  const originalNewStream = original.newStream;
  original.newStream = async () => { throw Object.assign(new Error('Unsupported protocol'), { name: 'UnsupportedProtocolError' }); };
  assert.equal((await requestor.service.refresh()).hosts.length, 0);
  assert.equal(recoveryCalls, 0);
  original.newStream = originalNewStream;
  host.state.hostedModels = [{ ...model, outputModalities: ['image'] }];
  const invalid = await requestor.service.refresh();
  assert.equal(invalid.hosts.length, 0); assert.match(invalid.errors[0].message, /output modalities/);
  assert.equal(recoveryCalls, 0); assert.equal(host.generations, 0);
});

test('a short directory deadline leaves only tracked bounded repair for the next poll, without a late directory write', { timeout: 15000 }, async (t) => {
  const { requestor, host, original } = await fixture(t);
  requestor.service.queryTimeoutMs = 100;
  const stalled = stallInference(original); t.after(() => stalled.restore());
  const normalDial = requestor.node.dial.bind(requestor.node), entered = deferred(), gate = deferred();
  requestor.node.dial = async (...args) => { entered.resolve(); await gate.promise; return normalDial(...args); };
  const directory = requestor.service.refresh();
  await entered.promise;
  const failed = await directory;
  assert.equal(failed.hosts.length, 0); assert.equal(failed.errors[0].code, 'ERR_INFERENCE_DEADLINE');
  assert.equal(requestor.service.recoveries.size, 1); assert.equal(requestor.service.operations.size, 1);
  gate.resolve(); await until(() => requestor.service.recoveries.size === 0);
  assert.equal(requestor.service.records.has(host.node.peerId.toString()), false, 'expired query never resumes on a late repair');
  requestor.service.queryTimeoutMs = 1000;
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  assert.equal(host.generations, 0);
  for (const value of stalled.pending) value.resolve({ abort() {} });
});

test('a committed remote failure is never replayed through transport recovery', { timeout: 15000 }, async (t) => {
  const { requestor, host } = await fixture(t);
  await requestor.service.refresh();
  let recoveries = 0;
  requestor.manager.recoverPeerInferenceConnection = async () => { recoveries++; throw new Error('Forbidden replay'); };
  host.run = async (input) => { host.generations++; input.onToken('partial'); throw new Error('Model execution failed'); };
  await assert.rejects(requestor.service.generate(cid, { prompt: 'Once' }), (error) => error.committed === true);
  assert.equal(host.generations, 1); assert.equal(recoveries, 0);
});
