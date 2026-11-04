import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { multiaddr } from '@multiformats/multiaddr';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PEER_INFERENCE_PROTOCOL, encryptedConnection, channel, descriptor, generation } from '../../src/peercompute/networkManager/inference/protocol.js';

const manifestCid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { manifestCid, modelId: 'fixture', name: 'Fixture', modalities: ['text', 'image'],
  runtime: 'test-only-injected-service', repository: 'fixture/model', revision: 'abc123', totalBytes: 100 };
const empty = () => ({ sharedModels: [], hostedModel: null, busy: false, idleForMs: 0 });
async function fixture(t, count = 3, options = {}) {
  const entries = [];
  t.after(async () => {
    await Promise.allSettled(entries.map((entry) => entry.manager._stopPeerInferenceService()));
    await Promise.allSettled(entries.map((entry) => entry.node.stop()));
  });
  for (let index = 0; index < count; index++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
      transports: [webSockets()], connectionEncrypters: [options.usePlaintext ? plaintext() : noise()],
      streamMuxers: [yamux()], services: { identify: identify() } });
    const manager = new NetworkManager({ bootstrapPeers: [], gameId: 'inference-test', roomId: 'test', topologyId: 'mesh' });
    manager.libp2p = node; manager.isConnected = true;
    manager.sendToPeer = () => { throw new Error('Private data must never use pubsub'); };
    const entry = { node, manager, owner: Symbol(`owner-${index}`), state: empty(), received: [] };
    entry.run = async (input) => { entry.received.push(input); input.onToken('Hello'); return { text: 'Hello', outputTokens: 1 }; };
    entries.push(entry);
    entry.service = await manager.createPeerInferenceService({ owner: entry.owner, getLocalState: () => entry.state,
      generate: (input) => entry.run(input), queryTimeoutMs: 1000, requestTimeoutMs: 5000, ...options });
  }
  for (const entry of entries.slice(1)) await entries[0].node.dial(entry.node.getMultiaddrs());
  return entries;
}
async function until(check) {
  for (let i = 0; i < 150; i++) { if (check()) return; await delay(10); }
  throw new Error('Condition did not settle');
}

test('private inference rejects plaintext, missing crypto and invalid input envelopes', () => {
  const base = { status: 'open', remotePeer: {} };
  assert.equal(encryptedConnection({ ...base, encryption: '/noise' }), true);
  assert.equal(encryptedConnection({ ...base, encryption: '/plaintext/2.0.0' }), false);
  assert.equal(encryptedConnection(base), false);
  assert.equal(encryptedConnection({ ...base, encryption: 'native', remoteAddr: multiaddr('/webrtc') }), true);
  assert.equal(encryptedConnection({ ...base, encryption: 'native', remoteAddr: multiaddr('/ip4/127.0.0.1/tcp/1/ws') }), false);
  assert.throws(() => descriptor({ ...model, totalBytes: Infinity }), /numeric/);
  assert.throws(() => generation({ manifestCid, requestId: 'x', prompt: 'x'.repeat(65537) }), /budget/);
  assert.throws(() => generation({ manifestCid, requestId: 'x', prompt: 'x', image: { width: 2 ** 31, height: 1, channels: 4 } }), /numeric/);
});

test('real Noise peers group packages and hosts, route longest idle, stream text and bounded RGBA', { timeout: 30000 }, async (t) => {
  const [requestor, a, b] = await fixture(t);
  a.state = { sharedModels: [model], hostedModel: model, busy: false, idleForMs: 100 };
  b.state = { sharedModels: [model], hostedModel: model, busy: false, idleForMs: 900 };
  const directory = await requestor.service.refresh();
  assert.equal(directory.errors.length, 0);
  assert.equal(directory.models.length, 1); assert.equal(directory.models[0].providers.length, 2);
  assert.equal(directory.hosts.length, 1); assert.equal(directory.hosts[0].hosts.length, 2);
  assert.ok(requestor.node.getConnections().every((connection) => connection.encryption === '/noise'));
  const image = { width: 256, height: 128, channels: 4, data: new Uint8Array(256 * 128 * 4).fill(37) };
  const tokens = [];
  const result = await requestor.service.generate(manifestCid, { requestId: 'private-request', prompt: 'Private sentinel text', image,
    onToken: (text) => tokens.push(text) });
  assert.equal(result.peerId, b.node.peerId.toString()); assert.equal(result.text, 'Hello');
  assert.deepEqual(tokens, ['Hello']); assert.equal(a.received.length, 0); assert.equal(b.received.length, 1);
  assert.deepEqual(b.received[0].messages, [{ role: 'user', content: 'Private sentinel text' }]);
  assert.deepEqual(b.received[0].image.data, image.data);
  assert.notEqual(b.received[0].requestId, 'private-request');
  assert.equal(requestor.manager.sendToPeer.toString().includes('pubsub'), true);
});

test('host disable aborts queued/inflight requests and never loads a missing model', { timeout: 20000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), sharedModels: [model], hostedModel: model };
  let aborted = 0;
  host.run = (input) => { host.received.push(input); return new Promise((resolve, reject) => {
    input.signal.addEventListener('abort', () => { aborted++; reject(input.signal.reason); }, { once: true });
  }); };
  await requestor.service.refresh();
  const pending = requestor.service.generate(manifestCid, { requestId: 'disable-me', prompt: 'x' });
  const rejected = assert.rejects(pending);
  await until(() => host.received.length === 1);
  host.service.setHostingEnabled(false);
  await rejected; await until(() => aborted === 1);
  const directory = await requestor.service.refresh();
  assert.equal(directory.hosts.length, 0); assert.equal(directory.models.length, 1);
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }), /No remote peer/);
  assert.equal(host.received.length, 1);
});

test('caller cancellation and connection loss stop remote generation', { timeout: 20000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: model };
  let aborted = 0;
  host.run = (input) => { host.received.push(input); return new Promise((resolve, reject) => {
    input.signal.addEventListener('abort', () => { aborted++; reject(input.signal.reason); }, { once: true });
  }); };
  await requestor.service.refresh();
  const pending = requestor.service.generate(manifestCid, { requestId: 'cancel-me', prompt: 'x' });
  const rejected = assert.rejects(pending);
  await until(() => host.received.length === 1);
  assert.equal(requestor.service.cancel('cancel-me'), true);
  await rejected; await until(() => aborted === 1);
  const disconnected = requestor.service.generate(manifestCid, { requestId: 'disconnect-me', prompt: 'x' });
  const disconnectedRejected = assert.rejects(disconnected);
  await until(() => host.received.length === 2);
  await requestor.node.hangUp(host.node.peerId);
  await disconnectedRejected; await until(() => aborted === 2);
});

test('bounded per-peer admission and busy fallback use the loaded callback only', { timeout: 20000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: model, busy: true, queuedRequests: 1 };
  host.run = (input) => { host.received.push(input); return new Promise((resolve, reject) => {
    input.signal.addEventListener('abort', () => reject(input.signal.reason), { once: true });
  }); };
  await requestor.service.refresh();
  const first = requestor.service.generate(manifestCid, { requestId: 'queue-a', prompt: 'x' });
  const firstRejected = assert.rejects(first);
  await until(() => host.received.length === 1);
  const second = requestor.service.generate(manifestCid, { requestId: 'queue-b', prompt: 'x' });
  const secondRejected = assert.rejects(second);
  await until(() => host.received.length === 2);
  await assert.rejects(requestor.service.generate(manifestCid, { requestId: 'queue-c', prompt: 'x' }), /queue is full/);
  host.service.setHostingEnabled(false); await Promise.all([firstRejected, secondRejected]);
  assert.equal(host.received.length, 2);
});

test('scope mismatch, over-budget host output and deadlines fail closed', { timeout: 20000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2, { requestTimeoutMs: 350 });
  host.state = { ...empty(), hostedModel: model };
  host.manager.config.roomId = 'different';
  const mismatch = await requestor.service.refresh();
  assert.equal(mismatch.hosts.length, 0); assert.equal(mismatch.errors.length, 1);
  host.manager.config.roomId = requestor.manager.config.roomId;
  await requestor.service.refresh();
  host.run = async ({ onToken }) => { onToken('x'.repeat(65537)); return { text: '' }; };
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }));
  host.run = ({ signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }), /deadline|reset|closed|aborted/i);
  await until(() => host.service.inbound.size === 0);
});

test('NetworkManager ownership prevents stale panels stopping or replacing live callbacks', { timeout: 15000 }, async (t) => {
  const [entry] = await fixture(t, 1);
  assert.equal(await entry.manager.createPeerInferenceService({ owner: entry.owner }), entry.service);
  await assert.rejects(entry.manager.createPeerInferenceService({ owner: Symbol('other') }), /another owner/);
  assert.equal(await entry.manager.releasePeerInferenceService(Symbol('other')), false);
  assert.equal(entry.service.closed, false);
  assert.equal(await entry.manager.releasePeerInferenceService(entry.owner), true);
  assert.equal(entry.service.closed, true); assert.equal(entry.service.generateLocal, null);
  assert.deepEqual(entry.manager.getPublishedArtifactCids(), []);
  entry.manager.artifactDiscovery = { publicArtifacts: new Set([manifestCid]) };
  const copy = entry.manager.getPublishedArtifactCids(); copy.length = 0;
  assert.deepEqual(entry.manager.getPublishedArtifactCids(), [manifestCid]);
});

test('malformed image transfer rejects before invoking the model', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: model };
  const stream = await requestor.node.getConnections()[0].newStream(PEER_INFERENCE_PROTOCOL);
  const io = channel(stream); const signal = AbortSignal.timeout(3000);
  await io.write(requestor.service._envelope('generate', host.node.peerId.toString(), {
    manifestCid, requestId: 'bad-image', messages: [{ role: 'user', content: 'x' }], maxNewTokens: 1,
    image: { width: 1, height: 1, channels: 4 }
  }), signal);
  assert.equal((await io.read(signal)).type, 'upload');
  await io.rpc.write(new Uint8Array(8), { signal });
  const response = await io.read(signal);
  assert.equal(response.type, 'error'); assert.match(response.message, /image transfer/);
  assert.equal(host.received.length, 0); await stream.close({ signal });
});

test('stale longest-idle advertisement falls through to the first available busy host', { timeout: 15000 }, async (t) => {
  const [requestor, idle, busy] = await fixture(t);
  idle.state = { ...empty(), hostedModel: model, idleForMs: 5000 };
  busy.state = { ...empty(), hostedModel: model, busy: true, queuedRequests: 1 };
  await requestor.service.refresh();
  // Change the host after discovery. Rejection before upload admission is safe
  // to route elsewhere; an accepted request is never automatically replayed.
  idle.service.setHostingEnabled(false);
  const routed = [];
  const result = await requestor.service.generate(manifestCid, { prompt: 'x', onProgress: (event) => {
    if (event.type === 'routing') routed.push(event.peerId);
  } });
  assert.deepEqual(routed, [idle.node.peerId.toString(), busy.node.peerId.toString()]);
  assert.equal(result.peerId, busy.node.peerId.toString()); assert.equal(idle.received.length, 0);
});

test('simultaneous requests reserve per-peer capacity before suspended state callbacks', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: model };
  await requestor.service.refresh();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  host.service.getLocalState = async () => { await gate; return host.state; };
  host.run = async ({ onToken }) => { onToken('ok'); return { text: 'ok' }; };
  const requests = Array.from({ length: 3 }, (_, index) => requestor.service.generate(manifestCid,
    { requestId: `simultaneous-${index}`, prompt: 'x' }));
  const results = Promise.allSettled(requests);
  await until(() => host.service.inbound.size === 2);
  await delay(30); assert.equal(host.service.inbound.size, 2);
  release();
  const settled = await results;
  assert.equal(settled.filter((value) => value.status === 'fulfilled').length, 2);
  assert.equal(settled.filter((value) => value.status === 'rejected').length, 1);
});

test('a synchronous fast token producer cannot exceed its bounded pending outbox', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: model };
  let emitted = 0; let observedAbort = false;
  host.run = async ({ onToken, signal }) => {
    try { for (; emitted < 4000; emitted++) onToken('x'); }
    finally { observedAbort = signal.aborted; }
    return { text: 'impossible' };
  };
  await requestor.service.refresh();
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }));
  assert.ok(emitted > 0 && emitted < 600, `outbox admitted ${emitted} pending token frames`);
  assert.equal(observedAbort, true);
});

test('generation requires a client start ack and never retries after a host starts', { timeout: 15000 }, async (t) => {
  const [requestor, host, fallback] = await fixture(t);
  host.state = { ...empty(), hostedModel: model, idleForMs: 5000 };
  fallback.state = { ...empty(), hostedModel: model, idleForMs: 1 };
  const stream = await requestor.node.getConnections().find((item) => item.remotePeer.equals(host.node.peerId)).newStream(PEER_INFERENCE_PROTOCOL);
  const io = channel(stream); const signal = AbortSignal.timeout(3000);
  await io.write(requestor.service._envelope('generate', host.node.peerId.toString(), {
    manifestCid, requestId: 'lost-admission-reply', messages: [{ role: 'user', content: 'x' }], maxNewTokens: 1
  }), signal);
  assert.equal((await io.read(signal)).type, 'upload');
  assert.equal((await io.read(signal)).type, 'accepted');
  await delay(20); assert.equal(host.received.length, 0);
  stream.abort(new Error('Caller lost admission response'));
  await until(() => host.service.inbound.size === 0);
  await requestor.service.refresh();
  host.run = async (input) => {
    host.received.push(input);
    for (const connection of host.node.getConnections()) for (const active of connection.streams) {
      if (active.protocol === PEER_INFERENCE_PROTOCOL) active.abort(new Error('Result acknowledgement lost after execution began'));
    }
    return { text: 'must not replay' };
  };
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }));
  assert.equal(host.received.length, 1); assert.equal(fallback.received.length, 0);
});

test('failed stop and failed startup cleanup retain the owner and permit acknowledged retry', { timeout: 15000 }, async (t) => {
  const [entry] = await fixture(t, 1);
  const unhandle = entry.node.unhandle.bind(entry.node);
  entry.node.unhandle = async () => { throw new Error('injected unhandle failure'); };
  await assert.rejects(entry.manager.releasePeerInferenceService(entry.owner), /unhandle failure/);
  assert.equal(entry.manager.getPeerInferenceService(), entry.service);
  await assert.rejects(entry.manager.createPeerInferenceService({ owner: entry.owner }), /cleanup/);
  entry.node.unhandle = unhandle;
  assert.equal(await entry.manager.releasePeerInferenceService(entry.owner), true);
  const handle = entry.node.handle.bind(entry.node);
  entry.node.handle = async () => { throw new Error('injected registration failure'); };
  entry.node.unhandle = async () => { throw new Error('injected startup cleanup failure'); };
  await assert.rejects(entry.manager.createPeerInferenceService({ owner: entry.owner,
    getLocalState: empty, generate: async () => ({ text: '' }) }), /startup cleanup/);
  assert.ok(entry.manager.getPeerInferenceService()?.requiresCleanup);
  entry.node.handle = handle; entry.node.unhandle = unhandle;
  assert.equal(await entry.manager.releasePeerInferenceService(entry.owner), true);
  assert.equal(entry.manager.getPeerInferenceService(), null);
});

test('real plaintext connections cannot discover hosts or invoke inference streams', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2, { usePlaintext: true });
  host.state = { ...empty(), hostedModel: model };
  assert.match(requestor.node.getConnections()[0].encryption, /plaintext/);
  const directory = await requestor.service.refresh();
  assert.equal(directory.hosts.length, 0); assert.equal(directory.errors.length, 1);
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'must stay local' }), /No remote peer/);
  const stream = await requestor.node.getConnections()[0].newStream(PEER_INFERENCE_PROTOCOL);
  const io = channel(stream); const signal = AbortSignal.timeout(1000);
  await assert.rejects(async () => {
    await io.write(requestor.service._envelope('query', host.node.peerId.toString()), signal);
    await io.read(signal);
  });
  assert.equal(host.received.length, 0);
});
