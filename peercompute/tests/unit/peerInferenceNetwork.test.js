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
import { PEER_INFERENCE_PROTOCOL, PEER_INFERENCE_PROTOCOL_V4, PEER_INFERENCE_PROTOCOL_V3, PEER_INFERENCE_PROTOCOL_V2, PEER_INFERENCE_LIMITS, LEGACY_MAX_NEW_TOKENS, encryptedConnection, channel, descriptor, localState, generation, resultData } from '../../src/peercompute/networkManager/inference/protocol.js';
import { imageDigest } from '../../src/peercompute/networkManager/inference/imageResult.js';
import { MODEL_POLICY } from '../../src/peercompute/inference/modelManifest.js';

const manifestCid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { manifestCid, modelId: 'fixture', name: 'Fixture', modalities: ['text', 'image'],
  runtime: 'test-only-injected-service', repository: 'fixture/model', revision: 'abc123', totalBytes: 100 };
const empty = () => ({ sharedModels: [], hostedModel: null, busy: false, idleForMs: 0 });
const imageModel = { ...model, task: 'text-to-image', modalities: ['text'], outputModalities: ['image'] };
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

function interceptStreamClose(t, service, close) {
  const open = service._openStream;
  const calls = { closed: 0, aborted: 0 };
  service._openStream = async function (...args) {
    const result = await open.apply(this, args), abort = result.stream.abort.bind(result.stream);
    result.stream.close = (...options) => { calls.closed++; return close(...options); };
    result.stream.abort = (error) => { calls.aborted++; return abort(error); };
    return result;
  };
  t.after(() => { service._openStream = open; });
  return calls;
}

test('validated vision advertisements survive close-only failure, expire normally and still reject failed directory queries', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), sharedModels: [model], hostedModels: [model], hostedModel: model };
  const closes = interceptStreamClose(t, requestor.service, async () => { throw new Error('FIN failed after directory'); });
  const directory = await requestor.service.refresh();
  assert.deepEqual(directory.errors, []);
  assert.equal(directory.hosts.length, 1);
  assert.equal(directory.hosts[0].task, 'image-text-to-text');
  assert.deepEqual(directory.hosts[0].modalities, ['text', 'image']);
  assert.deepEqual(directory.hosts[0].outputModalities, ['text']);
  assert.equal(directory.hosts[0].hosts[0].peerId, host.node.peerId.toString());
  assert.equal(closes.closed, 1); assert.equal(closes.aborted, 1);
  const record = requestor.service.records.get(host.node.peerId.toString());
  record.receivedAt = Date.now() - PEER_INFERENCE_LIMITS.recordTtlMs - 1;
  assert.equal(requestor.service.listHosts().length, 0, 'close recovery does not extend the directory TTL');
  assert.equal(requestor.service.listModels().length, 0);
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  // Failed/malformed updates must still invalidate the previous record. Only
  // closure after a fully checked directory receives the new tolerance.
  host.state.hostedModels = [{ ...model, outputModalities: ['image'] }];
  const invalid = await requestor.service.refresh();
  assert.equal(invalid.hosts.length, 0); assert.equal(invalid.models.length, 0);
  assert.match(invalid.errors[0].message, /output modalities/);
  assert.equal(closes.closed, 2, 'invalid response never reaches completed-stream cleanup');
  assert.equal(host.received.length, 0);
});

test('completed remote vision replies preserve received pixels and provider identity after close failure without replay', { timeout: 15000 }, async (t) => {
  const [requestor, host, fallback] = await fixture(t);
  host.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 100 }] };
  fallback.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 1 }] };
  await requestor.service.refresh();
  const closes = interceptStreamClose(t, requestor.service, () => { throw new Error('FIN failed after vision reply'); });
  const pixels = new Uint8Array([255, 0, 0, 255, 0, 0, 255, 255]);
  const result = await requestor.service.generate(manifestCid, { prompt: 'Describe these pixels.',
    image: { width: 2, height: 1, channels: 4, data: pixels } });
  assert.equal(result.text, 'Hello'); assert.equal(result.peerId, host.node.peerId.toString());
  assert.equal(result.manifestCid, manifestCid); assert.equal(result.connectionEncryption, '/noise');
  assert.deepEqual(host.received[0].image.data, pixels);
  assert.equal(host.received.length, 1); assert.equal(fallback.received.length, 0);
  assert.equal(closes.closed, 1); assert.equal(closes.aborted, 1);
  await until(() => host.service.inbound.size === 0);
});

test('complete credited image results survive close failure after digest validation and are never rerun', { timeout: 15000 }, async (t) => {
  const [requestor, host, fallback] = await fixture(t);
  host.state = { ...empty(), hostedModels: [{ ...imageModel, idleForMs: 100 }] };
  fallback.state = { ...empty(), hostedModels: [{ ...imageModel, idleForMs: 1 }] };
  const pixels = Uint8Array.from({ length: 256 * 256 * 4 }, (_, i) => i % 251);
  host.run = async (input) => { host.received.push(input); return { text: '', seed: 42,
    image: { width: 256, height: 256, channels: 4, data: pixels } }; };
  await requestor.service.refresh();
  const closes = interceptStreamClose(t, requestor.service, async () => { throw new Error('FIN failed after image'); });
  const result = await requestor.service.generate(manifestCid, { prompt: 'A mountain.', seed: 42 });
  assert.equal(result.peerId, host.node.peerId.toString()); assert.equal(result.seed, 42);
  assert.equal(result.connectionEncryption, '/noise');
  assert.equal(result.image.sha256, imageDigest(pixels)); assert.deepEqual(result.image.data, pixels);
  assert.equal(host.received.length, 1); assert.equal(fallback.received.length, 0);
  assert.equal(closes.closed, 1); assert.equal(closes.aborted, 1);
  await until(() => host.service.inbound.size === 0);
});

test('a transport ignoring close cancellation cannot hang a completed directory or inference result', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModels: [model] };
  const lateRejects = [];
  const closes = interceptStreamClose(t, requestor.service, () => new Promise((_resolve, reject) => { lateRejects.push(reject); }));
  const before = performance.now();
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  assert.equal((await requestor.service.generate(manifestCid, { prompt: 'One answer.' })).text, 'Hello');
  assert.ok(performance.now() - before < 3000, 'cleanup has its own short deadline, not the generation deadline');
  assert.equal(closes.closed, 2); assert.equal(closes.aborted, 2);
  assert.equal(host.received.length, 1);
  assert.equal(requestor.service.outbound.size, 0);
  for (const reject of lateRejects) reject(new Error('Late close rejection'));
  await delay(0);
});

test('host completion cleanup releases inbound slots even if its transport close never settles', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModels: [model] };
  const handle = host.service._handle;
  let aborted = 0;
  host.service._handle = function (stream, ...args) {
    const abort = stream.abort.bind(stream);
    stream.close = () => new Promise(() => {});
    stream.abort = (error) => { aborted++; return abort(error); };
    return handle.call(this, stream, ...args);
  };
  t.after(() => { host.service._handle = handle; });
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  assert.equal((await requestor.service.generate(manifestCid, { prompt: 'Finish once.' })).text, 'Hello');
  await until(() => host.service.inbound.size === 0 && host.service.operations.size === 0);
  assert.ok(aborted >= 2, 'both completed directory and result streams receive bounded cleanup');
  assert.equal(host.received.length, 1);
});

for (const kind of ['directory', 'result']) test(`caller cancellation during completed ${kind} cleanup still wins`, { timeout: 15000 }, async (t) => {
  const [requestor, host, fallback] = await fixture(t);
  host.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 100 }] };
  fallback.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 1 }] };
  if (kind === 'result') await requestor.service.refresh();
  const caller = new AbortController();
  const closes = interceptStreamClose(t, requestor.service, async () => { caller.abort(); throw new Error('close failed while caller cancelled'); });
  if (kind === 'directory') {
    await assert.rejects(requestor.service._query(host.node.peerId.toString(), caller.signal), { name: 'AbortError' });
    assert.equal(requestor.service.records.has(host.node.peerId.toString()), false);
  } else {
    await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'Do not replay.', signal: caller.signal }),
      (error) => error.name === 'AbortError' && error.committed === true);
    assert.equal(host.received.length, 1);
  }
  assert.equal(closes.closed, 1); assert.ok(closes.aborted >= 1);
  assert.equal(fallback.received.length, 0);
});

test('failed preferred WebRTC stream opens through the same host\'s encrypted relay before sending inference', { timeout: 15000 }, async (t) => {
  const [requestor, host, unrelated] = await fixture(t);
  host.state = { ...empty(), hostedModel: model };
  await requestor.service.refresh();
  const actual = requestor.node.getConnections().find((connection) => connection.remotePeer.equals(host.node.peerId));
  const original = requestor.node.getConnections;
  const attempts = [];
  const native = { status: 'open', remotePeer: host.node.peerId, encryption: 'native', remoteAddr: multiaddr('/webrtc'),
    async newStream() { attempts.push('native'); throw new Error('Preferred muxer closed'); } };
  const relay = { status: 'open', remotePeer: host.node.peerId, encryption: '/noise', remoteAddr: multiaddr('/p2p-circuit'),
    newStream(...args) { attempts.push('relay'); return actual.newStream(...args); } };
  const forbidden = { ...native, encryption: '/plaintext/2.0.0',
    newStream() { throw new Error('Plaintext must never be attempted'); } };
  const other = { ...native, remotePeer: unrelated.node.peerId,
    newStream() { throw new Error('A different peer is not a connection fallback'); } };
  requestor.node.getConnections = () => [native, relay, forbidden, other];
  try {
    await requestor.service._query(host.node.peerId.toString(), AbortSignal.timeout(3000));
    let accepted = 0;
    const result = await requestor.service.generate(manifestCid, { prompt: 'Describe a calm lake.',
      onProgress(event) { if (event.type === 'accepted') accepted++; } });
    assert.deepEqual(attempts, ['native', 'relay', 'native', 'relay']);
    assert.equal(result.peerId, host.node.peerId.toString()); assert.equal(result.connectionEncryption, '/noise');
    assert.equal(host.received.length, 1); assert.equal(accepted, 1); assert.equal(unrelated.received.length, 0);
  } finally { requestor.node.getConnections = original; }
});

test('stream opening cancellation never retries and closes a transport\'s late stream', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  const original = requestor.node.getConnections;
  const caller = new AbortController(); let finishOpening, started, relayAttempts = 0, lateAborted = 0;
  const opening = new Promise((resolve) => { finishOpening = resolve; });
  const atOpening = new Promise((resolve) => { started = resolve; });
  const native = { status: 'open', remotePeer: host.node.peerId, encryption: 'native', remoteAddr: multiaddr('/webrtc'),
    newStream() { started(); return opening; } };
  const relay = { ...native, encryption: '/noise', remoteAddr: multiaddr('/p2p-circuit'),
    newStream() { relayAttempts++; throw new Error('Must not retry after cancellation'); } };
  requestor.node.getConnections = () => [native, relay];
  const pending = requestor.service._openStream(host.node.peerId.toString(), caller.signal);
  const rejected = assert.rejects(pending, { name: 'AbortError' });
  try {
    await atOpening; caller.abort(); await rejected;
    assert.equal(relayAttempts, 0); assert.equal(host.received.length, 0);
    finishOpening({ abort() { lateAborted++; } }); await delay(0); assert.equal(lateAborted, 1);
  } finally { finishOpening({ abort() {} }); requestor.node.getConnections = original; await rejected; }
});

test('stream negotiation has a bounded deadline and preserves every failed connection cause', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2, { queryTimeoutMs: 100 });
  const original = requestor.node.getConnections;
  const relayError = Object.assign(new Error('Relay stream limit reached'), { code: 'ERR_RELAY_LIMIT' });
  let finishOpening, lateAborted = 0, relayAttempts = 0;
  const native = { status: 'open', remotePeer: host.node.peerId, encryption: 'native', remoteAddr: multiaddr('/webrtc'),
    newStream() { return new Promise((resolve) => { finishOpening = resolve; }); } };
  const relay = { ...native, encryption: '/noise', remoteAddr: multiaddr('/p2p-circuit'),
    newStream() { relayAttempts++; throw relayError; } };
  requestor.node.getConnections = () => [native, relay];
  try {
    await assert.rejects(requestor.service._openStream(host.node.peerId.toString(), AbortSignal.timeout(2000)), (error) => {
      assert(error instanceof AggregateError); assert.equal(error.code, 'ERR_INFERENCE_STREAM_UNAVAILABLE');
      assert.equal(error.errors.length, 2); assert.equal(error.errors[0].code, 'ERR_INFERENCE_DEADLINE');
      assert.equal(error.errors[1], relayError); assert.equal(error.cause, relayError);
      assert.match(error.message, /Relay stream limit/); return true;
    });
    assert.equal(relayAttempts, 1); assert.equal(host.received.length, 0);
    finishOpening({ abort() { lateAborted++; } }); await delay(0); assert.equal(lateAborted, 1);
  } finally { finishOpening?.({ abort() {} }); requestor.node.getConnections = original; }
});

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
  assert.equal(generation({ manifestCid, requestId: 'token-limit', prompt: 'x', maxNewTokens: MODEL_POLICY.maxNewTokens }).maxNewTokens, MODEL_POLICY.maxNewTokens);
  assert.throws(() => generation({ manifestCid, requestId: 'over-token-limit', prompt: 'x', maxNewTokens: MODEL_POLICY.maxNewTokens + 1 }), /numeric/);
});

test('an online host query failure reports its actual scoped error and recovers on the next refresh', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), sharedModels: [model], hostedModel: model };
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  host.service.getLocalState = () => { throw Object.assign(new Error('Catalog is temporarily locked'), { code: 'ERR_CATALOG_LOCKED' }); };
  const stream = await requestor.node.getConnections()[0].newStream(PEER_INFERENCE_PROTOCOL);
  const io = channel(stream); const signal = AbortSignal.timeout(3000);
  await io.write(requestor.service._envelope('query', host.node.peerId.toString()), signal);
  const response = await io.read(signal);
  assert.equal(response.type, 'error');
  assert.equal(response.sender, host.node.peerId.toString()); assert.equal(response.recipient, requestor.node.peerId.toString());
  assert.deepEqual(response.scope, requestor.service.scope);
  assert.equal(response.code, 'ERR_CATALOG_LOCKED'); assert.equal(response.message, 'Catalog is temporarily locked');
  await stream.close({ signal });
  const failed = await requestor.service.refresh();
  assert.deepEqual(failed.errors, [{ peerId: host.node.peerId.toString(), code: 'ERR_CATALOG_LOCKED', message: 'Catalog is temporarily locked' }]);
  assert.equal(failed.models.length, 0); assert.equal(failed.hosts.length, 0);
  assert.equal(requestor.node.getConnections().length, 1);
  host.service.getLocalState = () => host.state;
  const recovered = await requestor.service.refresh();
  assert.equal(recovered.models.length, 1); assert.equal(recovered.hosts.length, 1); assert.deepEqual(recovered.errors, []);
  assert.equal(host.received.length, 0);
});

test('legacy bare query errors stay bounded while spoofed or partial scoped responses fail closed', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), sharedModels: [model], hostedModel: model };
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  let response = { type: 'error', code: 'E'.repeat(200), message: 'Temporary failure '.repeat(100) };
  await host.node.unhandle(PEER_INFERENCE_PROTOCOL);
  await host.node.handle(PEER_INFERENCE_PROTOCOL, (stream) => {
    void (async () => {
      const io = channel(stream); const signal = AbortSignal.timeout(3000);
      try { await io.read(signal); await io.write(response, signal); await stream.close({ signal }); }
      catch (error) { stream.abort(error); }
    })();
  });
  const legacy = await requestor.service.refresh();
  assert.equal(legacy.errors[0].code, 'E'.repeat(80));
  assert.equal(legacy.errors[0].message, response.message.slice(0, 256));
  assert.equal(legacy.hosts.length, 0); assert.equal(legacy.models.length, 0);
  response = { type: 'error', code: {}, message: 'Invalid code type' };
  assert.equal((await requestor.service.refresh()).errors[0].code, 'ERR_INFERENCE_DIRECTORY_INVALID');
  const validError = host.service._envelope('error', requestor.node.peerId.toString(), { code: 'ERR_TEST', message: 'Hidden forged error' });
  for (const invalid of [
    { ...validError, sender: requestor.node.peerId.toString() },
    { ...validError, recipient: host.node.peerId.toString() },
    { ...validError, scope: { ...validError.scope, roomId: 'wrong-room' } },
    { type: 'error', sender: host.node.peerId.toString(), message: 'Partial envelope' },
    { type: 'directory', state: host.state },
    host.service._envelope('directory', requestor.node.peerId.toString(), { state: host.state, scope: { ...validError.scope, roomId: 'wrong-room' } }),
  ]) {
    response = invalid;
    const rejected = await requestor.service.refresh();
    assert.match(rejected.errors[0].message, /identity or scope mismatch/);
    assert.equal(rejected.models.length, 0); assert.equal(rejected.hosts.length, 0);
  }
  response = host.service._envelope('directory', requestor.node.peerId.toString(), { state: host.state });
  assert.equal((await requestor.service.refresh()).hosts.length, 1);
  assert.equal(host.received.length, 0);
});

test('completion metadata validates enums and booleans without inventing an older peer stop reason', () => {
  assert.deepEqual(resultData({ text: 'Older answer' }), { text: 'Older answer', finishReason: 'unknown' });
  assert.deepEqual(resultData({ text: '', finishReason: undefined, contextTruncated: undefined }), { text: '', finishReason: 'unknown' });
  for (const finishReason of ['stop', 'length', 'unknown']) for (const contextTruncated of [true, false]) {
    assert.deepEqual(resultData({ text: 'Answer', finishReason, contextTruncated }), { text: 'Answer', finishReason, contextTruncated });
  }
  for (const finishReason of [null, false, 1, {}, [], '', 'eos', 'STOP', 'length '.repeat(10000)]) {
    assert.throws(() => resultData({ text: 'Answer', finishReason }), /finish reason/);
  }
  for (const contextTruncated of [null, 0, 1, 'true', {}, []]) {
    assert.throws(() => resultData({ text: 'Answer', contextTruncated }), /context truncation/);
  }
});

test('host token caps are validated separately from package descriptors and absent remote caps stay legacy', () => {
  assert.equal(MODEL_POLICY.maxNewTokens, 1024);
  assert.equal(LEGACY_MAX_NEW_TOKENS, 256);
  assert.equal(localState({ ...empty(), hostedModel: model }).hostedModel.maxNewTokens, 256);
  assert.equal(localState({ ...empty(), hostedModel: { ...model, maxNewTokens: 1024 } }).hostedModel.maxNewTokens, 1024);
  assert.equal(localState({ ...empty(), hostedModel: model }, true, { defaultMaxNewTokens: 1024 }).hostedModel.maxNewTokens, 1024);
  const state = localState({ ...empty(), sharedModels: [{ ...model, maxNewTokens: 1024 }] });
  assert.equal(state.sharedModels[0].maxNewTokens, undefined);
  for (const maxNewTokens of [null, 0, -1, 1.5, 1025, Infinity, '1024', true]) {
    assert.throws(() => localState({ ...empty(), hostedModel: { ...model, maxNewTokens } }), /numeric/);
  }
});

test('mixed old and new Noise hosts keep longest-idle routing and use their individual token caps', { timeout: 15000 }, async (t) => {
  const [requestor, old, current] = await fixture(t);
  let oldIdle = 900, rejectOld = false, oldCap;
  const oldRequests = [];
  current.state = { ...empty(), hostedModel: model, idleForMs: 100 };
  await old.node.unhandle(PEER_INFERENCE_PROTOCOL);
  await old.node.handle(PEER_INFERENCE_PROTOCOL, (stream) => {
    void (async () => {
      const io = channel(stream); const signal = AbortSignal.timeout(3000);
      try {
        const input = await io.read(signal);
        if (input.type === 'query') {
          await io.write(old.service._envelope('directory', requestor.node.peerId.toString(), { state: {
            ...empty(), sharedModels: [model], hostedModel: { ...model, ...(oldCap !== undefined ? { maxNewTokens: oldCap } : {}) }, idleForMs: oldIdle,
          } }), signal);
        } else {
          oldRequests.push(input);
          assert(input.maxNewTokens <= 256, 'An older host must never receive the new 1024-token default');
          if (rejectOld) await io.write({ type: 'error', code: 'ERR_INFERENCE_NOT_HOSTED', message: 'Model unloaded' }, signal);
          else {
            await io.write({ type: 'upload', requestId: input.requestId }, signal);
            await io.write({ type: 'accepted', requestId: input.requestId }, signal);
            assert.equal((await io.read(signal)).type, 'start');
            await io.write({ type: 'done', requestId: input.requestId, result: { text: 'Legacy answer' } }, signal);
          }
        }
        await stream.close({ signal });
      } catch (error) { stream.abort(error); }
    })();
  });
  const firstDirectory = await requestor.service.refresh();
  const group = firstDirectory.hosts[0];
  assert.equal(group.maxNewTokens, undefined);
  assert.equal(group.hosts.find((host) => host.peerId === old.node.peerId.toString()).maxNewTokens, 256);
  assert.equal(group.hosts.find((host) => host.peerId === current.node.peerId.toString()).maxNewTokens, 1024);
  const first = await requestor.service.generate(manifestCid, { prompt: 'x' });
  assert.equal(first.peerId, old.node.peerId.toString()); assert.equal(first.finishReason, 'unknown');
  assert.equal(oldRequests.at(-1).maxNewTokens, 256); assert.equal(current.received.length, 0);

  oldIdle = 1; await requestor.service.refresh();
  const second = await requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: 1024 });
  assert.equal(second.peerId, current.node.peerId.toString()); assert.equal(current.received.at(-1).maxNewTokens, 1024);
  await requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: 64 });
  assert.equal(current.received.at(-1).maxNewTokens, 64);

  // An old provider rejected before commitment does not lower the next candidate's limit.
  oldIdle = 900; rejectOld = true; await requestor.service.refresh();
  const routed = [];
  const fallback = await requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: 1024,
    onProgress: (event) => { if (event.type === 'routing') routed.push(event.peerId); } });
  assert.deepEqual(routed, [old.node.peerId.toString(), current.node.peerId.toString()]);
  assert.equal(fallback.peerId, current.node.peerId.toString()); assert.equal(current.received.at(-1).maxNewTokens, 1024);
  assert.equal(oldRequests.at(-1).maxNewTokens, 256);

  oldCap = 1025;
  const invalid = await requestor.service.refresh();
  assert.equal(invalid.errors.length, 1);
  assert.equal(invalid.hosts[0].hosts.length, 1);
  assert.equal(invalid.hosts[0].hosts[0].peerId, current.node.peerId.toString());
});

test('a host enforces a smaller advertised token cap before execution', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: { ...model, maxNewTokens: 128 } };
  await requestor.service.refresh();
  await requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: 1024 });
  assert.equal(host.received[0].maxNewTokens, 128);
  const stream = await requestor.node.getConnections()[0].newStream(PEER_INFERENCE_PROTOCOL);
  const io = channel(stream); const signal = AbortSignal.timeout(3000);
  await io.write(requestor.service._envelope('generate', host.node.peerId.toString(), {
    manifestCid, requestId: 'over-host-limit', prompt: 'x', maxNewTokens: 129,
  }), signal);
  const response = await io.read(signal);
  assert.equal(response.type, 'error'); assert.equal(response.code, 'ERR_INFERENCE_TOKEN_LIMIT');
  assert.equal(host.received.length, 1); await stream.close({ signal });
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
  assert.equal(result.finishReason, 'unknown'); assert.equal(result.contextTruncated, undefined);
  assert.deepEqual(tokens, ['Hello']); assert.equal(a.received.length, 0); assert.equal(b.received.length, 1);
  assert.deepEqual(b.received[0].messages, [{ role: 'user', content: 'Private sentinel text' }]);
  assert.deepEqual(b.received[0].image.data, image.data);
  assert.notEqual(b.received[0].requestId, 'private-request');
  assert.equal(requestor.manager.sendToPeer.toString().includes('pubsub'), true);
});

test('real Noise text peers preserve completion and trimming metadata and reject invalid host results', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: model };
  await requestor.service.refresh();
  for (const metadata of [
    { finishReason: 'stop', contextTruncated: false },
    { finishReason: 'length', contextTruncated: true },
    { finishReason: 'unknown' },
  ]) {
    host.run = async (input) => {
      host.received.push(input); input.onToken('Answer');
      return { text: 'Answer', outputTokens: 1, ...metadata };
    };
    const result = await requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: MODEL_POLICY.maxNewTokens });
    assert.equal(result.finishReason, metadata.finishReason);
    assert.equal(result.contextTruncated, metadata.contextTruncated);
    assert.equal(host.received.at(-1).maxNewTokens, MODEL_POLICY.maxNewTokens);
  }
  for (const [metadata, message] of [[{ finishReason: 'eos' }, /finish reason/], [{ contextTruncated: 'yes' }, /context truncation/]]) {
    host.run = async () => ({ text: 'Answer', ...metadata });
    await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }), message);
  }
  await until(() => host.service.inbound.size === 0);
  assert.equal(requestor.service.outbound.size, 0);
});

test('older v2 wire results default to unknown and invalid completion metadata is never replayed', { timeout: 15000 }, async (t) => {
  const [requestor, host, fallback] = await fixture(t);
  host.state = { ...empty(), hostedModel: model, idleForMs: 100 };
  fallback.state = { ...empty(), hostedModel: model, idleForMs: 1 };
  await requestor.service.refresh();
  let metadata = {};
  await host.node.unhandle(PEER_INFERENCE_PROTOCOL);
  await host.node.handle(PEER_INFERENCE_PROTOCOL, (stream) => {
    void (async () => {
      const io = channel(stream); const signal = AbortSignal.timeout(3000);
      try {
        const input = await io.read(signal);
        await io.write({ type: 'upload', requestId: input.requestId }, signal);
        await io.write({ type: 'accepted', requestId: input.requestId }, signal);
        assert.equal((await io.read(signal)).type, 'start');
        await io.write({ type: 'done', requestId: input.requestId, result: { text: 'Legacy answer', ...metadata } }, signal);
        await stream.close({ signal });
      } catch (error) { stream.abort(error); }
    })();
  });
  const legacy = await requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: 32 });
  assert.equal(legacy.text, 'Legacy answer'); assert.equal(legacy.finishReason, 'unknown');
  assert.equal(legacy.contextTruncated, undefined);
  for (const [invalid, message] of [[{ finishReason: null }, /finish reason/], [{ contextTruncated: 'false' }, /context truncation/]]) {
    metadata = invalid;
    await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x', maxNewTokens: 32 }), message);
  }
  assert.equal(fallback.received.length, 0);
  assert.equal(requestor.service.outbound.size, 0);
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

test('v2 image capabilities reject ambiguous tasks and over-budget image metadata', () => {
  assert.equal(PEER_INFERENCE_PROTOCOL, '/peercompute/inference/5.0.0');
  assert.equal(PEER_INFERENCE_PROTOCOL_V4, '/peercompute/inference/4.0.0');
  assert.equal(PEER_INFERENCE_PROTOCOL_V3, '/peercompute/inference/3.0.0');
  assert.equal(PEER_INFERENCE_PROTOCOL_V2, '/peercompute/inference/2.0.0');
  assert.deepEqual(descriptor(imageModel).outputModalities, ['image']);
  assert.deepEqual(descriptor(model).outputModalities, ['text']);
  assert.throws(() => descriptor({ ...imageModel, outputModalities: ['text'] }), /modalities/);
  assert.throws(() => descriptor({ ...imageModel, modalities: ['text', 'image'] }), /text input/);
  assert.throws(() => generation({ manifestCid, requestId: 'bad', task: 'text-to-image',
    messages: [{ role: 'assistant', content: 'x' }] }), /one text prompt/);
  for (const extra of [{ seed: -1 }, { seed: 2 ** 32 }, { steps: 9 }, { width: 1024 }]) {
    assert.throws(() => generation({ manifestCid, requestId: 'bad', prompt: 'x', ...extra }), /numeric/);
  }
  assert.throws(() => resultData({ text: '', image: { width: 1025, height: 1, channels: 4, sha256: '0'.repeat(64) } }), /numeric/);
  assert.throws(() => resultData({ text: '', image: { width: 1, height: 1, channels: 3, sha256: '0'.repeat(64) } }), /dimensions/);
});

test('real Noise peers transfer generated pixels with credits, digest, progress and seed', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), sharedModels: [imageModel], hostedModel: imageModel };
  const pixels = Uint8Array.from({ length: 512 * 512 * 4 }, (_, i) => i % 251);
  host.run = async (input) => {
    host.received.push(input);
    input.onProgress({ type: 'diffusion-progress', stage: 'denoise', step: 1, steps: 4 });
    return { text: '', seed: input.seed, steps: 4, gpuDispatches: 22, finishReason: 'stop', contextTruncated: false,
      image: { width: 512, height: 512, channels: 4, data: pixels } };
  };
  const directory = await requestor.service.refresh();
  assert.equal(directory.hosts[0].task, 'text-to-image');
  assert.deepEqual(directory.hosts[0].modalities, ['text']);
  assert.deepEqual(directory.hosts[0].outputModalities, ['image']);
  const progress = [];
  const result = await requestor.service.generate(manifestCid, { prompt: 'A green mountain', seed: 123,
    onProgress: (event) => progress.push(event) });
  assert.equal(result.seed, 123); assert.equal(result.steps, 4);
  assert.equal(result.gpuDispatches, 22); assert.equal(result.connectionEncryption, '/noise');
  assert.equal(result.finishReason, 'stop'); assert.equal(result.contextTruncated, false);
  assert.equal(result.image.sha256, imageDigest(pixels));
  assert.deepEqual(result.image.data, pixels);
  assert.equal(host.received[0].task, 'text-to-image');
  assert.equal(progress.filter((event) => event.type === 'diffusion-progress').length, 1);
  await until(() => host.service.inbound.size === 0);
});

test('image result credits bound transfer and cancellation releases the host reservation', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: imageModel };
  host.run = async (input) => { host.received.push(input); return { text: '',
    image: { width: 512, height: 512, channels: 4, data: new Uint8Array(512 * 512 * 4) } }; };
  const stream = await requestor.node.getConnections()[0].newStream(PEER_INFERENCE_PROTOCOL);
  const io = channel(stream); const signal = AbortSignal.timeout(5000);
  const requestId = 'stalled-output';
  await io.write(requestor.service._envelope('generate', host.node.peerId.toString(), {
    manifestCid, requestId, task: 'text-to-image', prompt: 'x'
  }), signal);
  assert.equal((await io.read(signal)).type, 'upload');
  assert.equal((await io.read(signal)).type, 'accepted');
  await io.write({ type: 'start', requestId }, signal);
  assert.equal((await io.read(signal)).type, 'result-image');
  // No ready credit: the host cannot enqueue a binary image or finish its work.
  await delay(30); assert.equal(host.service.inbound.size, 1);
  await io.write({ type: 'result-credit', requestId, offset: 0 }, signal);
  assert.equal((await io.rpc.read({ signal })).byteLength, 64 * 1024);
  await io.write({ type: 'cancel', requestId }, signal);
  await until(() => host.service.inbound.size === 0);
  await assert.rejects(io.rpc.read({ signal }));
  assert.equal(host.received.length, 1);
});

test('a corrupted generated image is rejected after commitment and never replayed', { timeout: 15000 }, async (t) => {
  const [requestor, host, fallback] = await fixture(t);
  host.state = { ...empty(), hostedModel: imageModel, idleForMs: 100 };
  fallback.state = { ...empty(), hostedModel: imageModel, idleForMs: 1 };
  await requestor.service.refresh();
  await host.node.unhandle(PEER_INFERENCE_PROTOCOL);
  await host.node.handle(PEER_INFERENCE_PROTOCOL, (stream) => {
    void (async () => {
      const io = channel(stream); const signal = AbortSignal.timeout(3000);
      try {
        const input = await io.read(signal);
        await io.write({ type: 'upload', requestId: input.requestId }, signal);
        await io.write({ type: 'accepted', requestId: input.requestId }, signal);
        assert.equal((await io.read(signal)).type, 'start');
        await io.write({ type: 'result-image', requestId: input.requestId,
          image: { width: 1, height: 1, channels: 4, sha256: imageDigest(new Uint8Array(4)) } }, signal);
        assert.equal((await io.read(signal)).offset, 0);
        await io.rpc.write(new Uint8Array([1, 2, 3, 4]), { signal });
        await io.read(signal);
      } catch (error) { stream.abort(error); }
    })();
  });
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }), /digest mismatch/);
  assert.equal(fallback.received.length, 0);
});

test('image hosts reject chat history and attachments before execution; text hosts reject image output', { timeout: 15000 }, async (t) => {
  const [requestor, host] = await fixture(t, 2);
  host.state = { ...empty(), hostedModel: imageModel };
  await requestor.service.refresh();
  await assert.rejects(requestor.service.generate(manifestCid, { messages: [
    { role: 'user', content: 'x' }, { role: 'assistant', content: 'y' }
  ] }), /one text prompt/);
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x', image: {
    width: 1, height: 1, channels: 4, data: new Uint8Array(4)
  } }), /Requested task or media does not match/);
  assert.equal(host.received.length, 0);
  host.state.hostedModel = model;
  host.run = async () => ({ text: '', image: { width: 1, height: 1, channels: 4, data: new Uint8Array(4) } });
  await requestor.service.refresh();
  await assert.rejects(requestor.service.generate(manifestCid, { prompt: 'x' }), /output does not match/);
});
