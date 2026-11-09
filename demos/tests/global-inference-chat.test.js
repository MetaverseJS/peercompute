import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { GlobalInferenceChatService, GLOBAL_INFERENCE_CHAT_PROTOCOL as PROTOCOL,
  GLOBAL_INFERENCE_CHAT_LIMITS as L } from '../shared/chat/GlobalInferenceChatService.js';
import { prepareGlobalChatInput, globalChatWire, globalChatDigest } from '../shared/chat/globalInferenceChatContracts.js';
import { channel } from '../../peercompute/src/peercompute/networkManager/inference/protocol.js';

const scope = { gameId: 'peercompute', roomId: 'inference-test', topologyId: 'mesh' };
const input = (overrides = {}) => ({ turnId: crypto.randomUUID(), phase: 'prompt', name: 'Guest', text: 'Hello world', ...overrides });
const until = async (check) => { for (let i = 0; i < 200; i++) { if (check()) return; await delay(5); } throw new Error('Condition did not settle'); };
async function fixture(t, count = 2, options = {}) {
  const entries = [];
  t.after(async () => {
    await Promise.allSettled(entries.map(({ service }) => service.close()));
    await Promise.allSettled(entries.map(({ node }) => node.stop()));
  });
  for (let i = 0; i < count; i++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [options.plaintext ? plaintext() : noise()], streamMuxers: [yamux()], services: { identify: identify() } });
    const manager = { getLibp2pNode: () => node, config: { ...scope }, peers: new Map(), bootstrapPeerIds: new Set(),
      _maybeDialPeer: async () => {}, sendToPeer() { throw new Error('Global content must not use pubsub'); } };
    const entry = { node, manager, events: [], statuses: [] };
    entry.service = new GlobalInferenceChatService({ networkManager: manager, requestTimeoutMs: 1000,
      onEvent: (event) => entry.events.push(event), onStatus: (status) => entry.statuses.push(status), ...options.service });
    entries.push(entry); await entry.service.start();
  }
  if (!options.noDial) for (const entry of entries.slice(1)) await entries[0].node.dial(entry.node.getMultiaddrs());
  for (const entry of entries) for (const other of entries) if (other !== entry) entry.manager.peers.set(other.node.peerId.toString(), { ...scope });
  return entries;
}
const envelope = (receiver, type, extra = {}) => ({ type, recipient: receiver.node.peerId.toString(), scope, ...extra });
async function raw(sender, receiver, { hello = {}, frame = {}, event = {}, session, id = crypto.randomUUID() } = {}) {
  const connection = sender.node.getConnections().find((entry) => entry.remotePeer.equals(receiver.node.peerId));
  const stream = await connection.newStream(PROTOCOL), io = channel(stream), signal = AbortSignal.timeout(3000);
  try {
    await io.write(envelope(receiver, 'hello', { operation: 'publish', ...hello }), signal);
    const ready = await io.read(signal); if (ready.type === 'error') return ready;
    await io.write(envelope(receiver, 'event', { session: session ?? ready.session,
      event: { id, turnId: 'same-turn', phase: 'prompt', name: 'Display name', text: 'Hello', ...event }, ...frame }), signal);
    return await io.read(signal);
  } finally { try { await stream.close({ signal }); } catch (error) { stream.abort(error); } }
}

test('real Noise peers share explicitly published prompts/results, authenticate author, and echo locally once', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), turnId = crypto.randomUUID();
  const result = await a.service.publish(input({ turnId, name: '<script>display only</script>', text: 'Public 🌎\nquestion' }));
  assert.equal(result.delivery.status, 'delivered'); assert.equal(result.delivery.delivered, 1);
  assert.equal(a.events.length, 1); assert.equal(a.events[0].local, true);
  assert.equal(b.events.length, 1); assert.equal(b.events[0].local, false);
  assert.equal(b.events[0].peerId, a.node.peerId.toString()); assert.equal(b.events[0].id, result.event.id);
  assert.equal(b.events[0].text, 'Public 🌎\nquestion'); assert.equal(a.node.getConnections()[0].encryption, '/noise');
  await a.service.publish(input({ turnId, phase: 'result', modelName: 'Test model', text: 'A public reply' }));
  assert.deepEqual(b.events.map(({ turnId: id, phase }) => [id, phase]), [[turnId, 'prompt'], [turnId, 'result']]);
  assert.equal(b.events[1].modelName, 'Test model'); assert.equal(b.service.sends, 0, 'Receiving never re-executes or republishes');
  assert.equal(a.service.getStatus().peerCount, 1); assert.equal(a.service.getStatus().eventCount, 2);
});

test('no peers preserves public local events and late history; observer mutation cannot alter cached media', { timeout: 15000 }, async (t) => {
  const [a] = await fixture(t, 1), image = { width: 2, height: 1, channels: 4, data: new Uint8Array([1, 2, 3, 255, 5, 6, 7, 255]) };
  const result = await a.service.publish(input({ image }));
  assert.equal(result.delivery.status, 'local-only'); assert.equal(result.event.local, true);
  image.data[0] = 99; a.events[0].image.data[1] = 99; result.event.image.data[2] = 99;
  const cached = [...a.service.cache.values()][0].event.image.data;
  assert.deepEqual([...cached], [1, 2, 3, 255, 5, 6, 7, 255]); assert.equal(a.events.length, 1);
});

test('credited image and generated speech frames arrive byte-for-byte without URLs or microphone input', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), turnId = crypto.randomUUID();
  const image = { width: 256, height: 128, channels: 4, data: new Uint8Array(256 * 128 * 4).map((_, i) => i % 251) };
  assert.equal((await a.service.publish(input({ turnId, phase: 'result', text: '', image }))).delivery.status, 'delivered');
  assert.deepEqual(b.events[0].image, image);
  const samples = Float32Array.from({ length: 40000 }, (_, i) => Math.sin(i / 100) * 0.25);
  assert.equal((await a.service.publish(input({ turnId, phase: 'audio', part: 0, text: 'Spoken answer',
    audio: { samples, sampleRate: 16000 } }))).delivery.status, 'delivered');
  assert.deepEqual(b.events[1].audio.samples, samples); assert.equal(b.events[1].audio.sampleRate, 16000);
  assert.equal(b.events[1].part, 0); assert.equal(b.events[1].phase, 'audio');
});

test('late join synchronizes missing original-author history only and avoids repeated media transfer', { timeout: 15000 }, async (t) => {
  const [a, b, c] = await fixture(t, 3); a.manager.peers.delete(c.node.peerId.toString());
  b.manager.peers.delete(c.node.peerId.toString()); c.manager.peers.clear();
  const turnId = crypto.randomUUID();
  await a.service.publish(input({ turnId }));
  await a.service.publish(input({ turnId, phase: 'result', text: '',
    image: { width: 1, height: 1, channels: 4, data: new Uint8Array([20, 30, 40, 255]) } }));
  assert.equal(b.events.length, 2); assert.equal(c.events.length, 0);
  c.manager.peers.set(b.node.peerId.toString(), scope); b.manager.peers.set(c.node.peerId.toString(), scope);
  await c.node.dial(b.node.getMultiaddrs());
  await c.service.refresh(); assert.equal(c.events.length, 0, 'B cannot forward A-authored history');
  c.manager.peers.set(a.node.peerId.toString(), scope); a.manager.peers.set(c.node.peerId.toString(), scope);
  const write = a.service._writeEvent.bind(a.service); let transfers = 0;
  a.service._writeEvent = (...args) => { transfers++; return write(...args); };
  assert.equal((await c.service.refresh()).error, null); assert.equal(c.events.length, 2);
  assert.equal(c.events[0].peerId, a.node.peerId.toString()); assert.equal(c.events[1].image.data[0], 20);
  await c.service.refresh(); assert.equal(transfers, 2); assert.equal(c.events.length, 2);
});

test('duplicates acknowledge once, conflicting rewrites fail, and old receiver sessions cannot replay', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), id = crypto.randomUUID(), session = b.service.session;
  assert.equal((await raw(a, b, { id })).type, 'ack'); assert.equal((await raw(a, b, { id })).type, 'ack');
  assert.equal(b.events.length, 1); assert.equal((await raw(a, b, { id, event: { text: 'Rewrite' } })).type, 'error');
  await b.service.close(); b.service = new GlobalInferenceChatService({ networkManager: b.manager, onEvent: (event) => b.events.push(event) });
  await b.service.start(); assert.equal((await raw(a, b, { session })).type, 'error'); assert.equal(b.events.length, 1);
});

test('wire rejects author spoofing, other scopes, recipient mismatch and private context fields', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t);
  for (const hello of [{ scope: { ...scope, roomId: 'personal' } }, { scope: { ...scope, topologyId: 'other' } },
    { scope: { ...scope, gameId: 'cubechat' } }, { recipient: a.node.peerId.toString() }, { author: a.node.peerId.toString() }, { history: [] }]) {
    assert.equal((await raw(a, b, { hello })).type, 'error');
  }
  for (const event of [{ peerId: b.node.peerId.toString() }, { local: true }, { history: [] }, { messages: [] },
    { agent: { identity: 'Private' } }, { image: 'https://tracking.invalid/image' }, { phase: 'personal' }]) {
    assert.equal((await raw(a, b, { event })).type, 'error');
  }
  for (const frame of [{ scope: { ...scope, roomId: 'other' } }, { recipient: a.node.peerId.toString() }, { peerId: 'claimed' }]) {
    assert.equal((await raw(a, b, { frame })).type, 'error');
  }
  assert.equal(b.events.length, 0);
});

test('unencrypted connections and bootstrap/unknown/other-scope peers never receive global content', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t, 2, { plaintext: true });
  assert.equal((await a.service.publish(input())).delivery.status, 'failed'); assert.equal(b.events.length, 0);
  const id = b.node.peerId.toString();
  for (const metadata of [{ ...scope, roomId: 'other' }, { ...scope, topologyId: 'other' }, { ...scope, gameId: 'other' }]) {
    a.manager.peers.set(id, metadata); assert.equal((await a.service.publish(input())).delivery.total, 0);
  }
  a.manager.peers.set(id, scope); a.manager.bootstrapPeerIds.add(id);
  assert.equal((await a.service.publish(input())).delivery.total, 0);
  a.manager.bootstrapPeerIds.clear(); a.manager.peers.delete(id);
  assert.equal((await a.service.publish(input())).delivery.total, 0); assert.equal(b.events.length, 0);
});

test('public input validates Unicode, media, phase and strict allowlists before emitting anything', { timeout: 15000 }, async (t) => {
  const [a] = await fixture(t, 1);
  const invalid = [{ text: '\ud800' }, { text: 'x'.repeat(L.textBytes + 1) }, { name: '😀'.repeat(21) },
    { text: 'a\0b' }, { text: '' }, { name: '' }, { modelName: 'x'.repeat(L.modelNameBytes + 1) },
    { peerId: 'spoof' }, { messages: [{ content: 'private' }] }, { history: [] }, { agent: {} },
    { image: 'blob:https://private.invalid' }, { image: { width: 1, height: 1, channels: 4, data: new Uint8Array(3) } },
    { image: { width: 1025, height: 1, channels: 4, data: new Uint8Array(4100) } },
    { audio: { samples: new Float32Array(10), sampleRate: 16000 } }, { part: 0 },
    { phase: 'audio', part: 0 }, { phase: 'audio', part: -1, audio: { samples: new Float32Array(2), sampleRate: 16000 } },
    { phase: 'audio', part: 0, audio: { samples: new Float32Array([NaN]), sampleRate: 16000 } },
    { phase: 'audio', part: 0, audio: { samples: new Float32Array(48000 * 30 + 1), sampleRate: 48000 } },
    { phase: 'error', image: { width: 1, height: 1, channels: 4, data: new Uint8Array(4) } }];
  for (const change of invalid) assert.throws(() => a.service.publish(input(change)));
  assert.equal(a.events.length, 0); assert.equal(a.service.getStatus().cacheBytes, 0);
});

test('retention, history inventory, rate and replay windows stay bounded', { timeout: 15000 }, async (t) => {
  let clock = 0; const [a] = await fixture(t, 1, { service: { now: () => clock } });
  for (let i = 0; i < L.cacheEvents + 5; i++) { await a.service.publish(input()); clock += L.rateWindowMs; }
  assert.equal(a.service.getStatus().eventCount, L.cacheEvents); assert.equal(a.service._ownHistory().length, L.historyEvents);
  assert.ok(a.service.getStatus().cacheBytes <= L.cacheBytes);
  for (let i = 0; i < L.rateMessages; i++) await a.service.publish(input());
  assert.throws(() => a.service.publish(input()), { code: 'ERR_GLOBAL_CHAT_RATE' });
  clock += L.rateWindowMs;
  const audio = { samples: new Float32Array(48000 * 30), sampleRate: 48000 };
  await a.service.publish(input({ phase: 'audio', part: 0, audio }));
  await a.service.publish(input({ phase: 'audio', part: 1, audio }));
  assert.ok(a.service.getStatus().cacheBytes <= L.peerCacheBytes);
  assert.equal([...a.service.cache.values()].filter(({ event }) => event.phase === 'audio').length, 1);
});

test('corrupt image digest cannot reach observers or be acknowledged as accepted', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), connection = a.node.getConnections()[0];
  const stream = await connection.newStream(PROTOCOL), io = channel(stream), signal = AbortSignal.timeout(2000);
  t.after(() => { try { stream.abort(new Error('Test cleanup')); } catch {} });
  const prepared = prepareGlobalChatInput(input({ image: { width: 1, height: 1, channels: 4, data: new Uint8Array([1, 2, 3, 4]) } }));
  const wire = globalChatWire({ id: crypto.randomUUID(), ...prepared.wire });
  await io.write(envelope(b, 'hello', { operation: 'publish' }), signal); const ready = await io.read(signal);
  await io.write(envelope(b, 'event', { session: ready.session, event: wire }), signal);
  await io.write({ type: 'result-image', requestId: wire.id, image: wire.image }, signal);
  assert.equal((await io.read(signal)).offset, 0);
  await io.rpc.write(new Uint8Array([9, 9, 9, 9]), { signal });
  const response = await io.read(signal); assert.equal(response.type, 'error'); assert.match(response.message, /digest mismatch/);
  assert.equal(b.events.length, 0); assert.equal(b.service.cache.size, 0);
});

test('cancellation/close drains streams, unregisters owner and permits a new service', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), controller = new AbortController(); controller.abort();
  assert.throws(() => a.service.publish(input(), { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(a.events.length, 0);
  const oldHandler = b.service._handle.bind(b.service); let arrived = false;
  b.service._handle = async (stream) => {
    arrived = true; await new Promise((resolve) => b.service.controller.signal.addEventListener('abort', resolve, { once: true }));
    stream.abort(new Error('closed'));
  };
  const sending = a.service.publish(input()); await until(() => arrived); await a.service.close();
  assert.equal((await sending).delivery.status, 'failed'); assert.equal(a.service.operations.size, 0);
  assert.equal(a.service.getStatus().connected, false); assert.equal(a.service.getStatus().cacheBytes, 0);
  await b.service.close(); b.service._handle = oldHandler;
  a.service = new GlobalInferenceChatService({ networkManager: a.manager }); await a.service.start();
  assert.equal(a.service.getStatus().connected, true);
});

test('concurrent refresh shares one operation and scope changes fail closed', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t);
  const first = a.service.refresh(), second = a.service.refresh(); assert.equal(first, second); await first;
  a.manager.config.roomId = 'different';
  assert.equal(a.service.getStatus().connected, false);
  assert.throws(() => a.service.publish(input()), { code: 'ERR_GLOBAL_CHAT_SCOPE' });
  assert.throws(() => a.service.refresh(), { code: 'ERR_GLOBAL_CHAT_SCOPE' }); assert.equal(b.events.length, 0);
});

test('history selection cannot request third-party or unpublished IDs', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), connection = a.node.getConnections()[0];
  const stream = await connection.newStream(PROTOCOL), io = channel(stream), signal = AbortSignal.timeout(2000);
  try {
    await io.write(envelope(b, 'hello', { operation: 'history' }), signal); const ready = await io.read(signal);
    const inventory = await io.read(signal); assert.deepEqual(inventory.events, []);
    await io.write(envelope(b, 'select', { session: ready.session, ids: ['not-published'] }), signal);
    assert.equal((await io.read(signal)).type, 'error'); assert.equal(b.events.length, 0);
  } finally { try { await stream.close({ signal }); } catch (error) { stream.abort(error); } }
  const prepared = prepareGlobalChatInput(input());
  assert.match(globalChatDigest(globalChatWire({ id: 'sample', ...prepared.wire })), /^[a-f0-9]{64}$/);
});

test('bounded refresh and publish batches rotate across all known authors while status remains pure', { timeout: 15000 }, async (t) => {
  const [a] = await fixture(t, 1), ids = Array.from({ length: L.maximumPeers * 2 + 9 }, (_, index) => `known-author-${index}`);
  for (const id of ids) a.manager.peers.set(id, { ...scope });
  a.manager.peers.set('other-room', { ...scope, roomId: 'other' });
  a.manager.peers.set('bootstrap', { ...scope }); a.manager.bootstrapPeerIds.add('bootstrap');
  a.manager.peers.set(a.node.peerId.toString(), { ...scope });
  const fetched = [], delivered = [];
  let active = 0, peak = 0;
  a.service._fetchHistory = async (peerId) => {
    fetched.push(peerId); peak = Math.max(peak, ++active); await delay(1); active--;
    return { peerId, status: 'acknowledged' };
  };
  a.service._deliver = async (peerId) => { delivered.push(peerId); return { peerId, status: 'acknowledged' }; };
  for (let batch = 0; batch < 3; batch++) {
    const cursors = { ...a.service.peerCursors };
    for (let i = 0; i < 10; i++) assert.equal(a.service.getStatus().peerCount, ids.length);
    assert.deepEqual(a.service.peerCursors, cursors, 'Reading status must not consume the next peer batch');
    const before = fetched.length; await a.service.refresh(); assert.equal(fetched.length - before, L.maximumPeers);
    assert.equal((await a.service.publish(input())).delivery.total, L.maximumPeers);
  }
  assert.deepEqual(new Set(fetched), new Set(ids)); assert.deepEqual(new Set(delivered), new Set(ids));
  assert.ok(peak <= L.fanout); assert.deepEqual(fetched.slice(0, L.maximumPeers), ids.slice(0, L.maximumPeers));
  assert.deepEqual(fetched.slice(L.maximumPeers, L.maximumPeers * 2), ids.slice(L.maximumPeers, L.maximumPeers * 2));
  // Rate accounting is independently bounded, rather than accidentally imposing
  // the outgoing 32-peer batch limit on incoming authors within a rate window.
  for (const id of ids) assert.doesNotThrow(() => a.service._rate(id));
  for (let i = ids.length; i < L.ratePeers; i++) a.service._rate(`rate-author-${i}`);
  assert.throws(() => a.service._rate('one-too-many-rate-authors'), { code: 'ERR_GLOBAL_CHAT_RATE' });
  a.manager.peers.clear(); assert.equal((await a.service.refresh()).peerCount, 0);
  assert.equal((await a.service.publish(input())).delivery.total, 0);
});
