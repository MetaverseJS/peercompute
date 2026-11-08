import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { RoomChatService, ROOM_CHAT_PROTOCOL, ROOM_CHAT_LIMITS } from '../shared/chat/RoomChatService.js';
import { channel } from '../../peercompute/src/peercompute/networkManager/inference/protocol.js';

const scope = { gameId: 'cubechat', roomId: 'test-room', topologyId: 'mesh' }, worldId = 'cubechat:test-room';
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
      _maybeDialPeer: async () => {}, sendToPeer() { throw new Error('Chat content must never use pubsub'); } };
    const entry = { node, manager, messages: [], statuses: [] };
    entry.service = new RoomChatService({ networkManager: manager, worldId, requestTimeoutMs: 750,
      onMessage: (message) => entry.messages.push(message), onStatus: (status) => entry.statuses.push(status), ...options.service });
    entries.push(entry); await entry.service.start();
  }
  if (!options.noDial) for (const entry of entries.slice(1)) await entries[0].node.dial(entry.node.getMultiaddrs());
  for (const entry of entries) for (const other of entries) if (other !== entry) entry.manager.peers.set(other.node.peerId.toString(), { ...scope });
  return entries;
}
const envelope = (recipient, type, extra = {}) => ({ type, recipient: recipient.node.peerId.toString(), scope, worldId, ...extra });
async function raw(sender, receiver, { hello = {}, message = {}, session } = {}) {
  const connection = sender.node.getConnections().find((entry) => entry.remotePeer.equals(receiver.node.peerId));
  const stream = await connection.newStream(ROOM_CHAT_PROTOCOL), io = channel(stream), signal = AbortSignal.timeout(2000);
  try {
    await io.write(envelope(receiver, 'hello', hello), signal);
    const ready = await io.read(signal);
    if (ready.type === 'error') return ready;
    await io.write(envelope(receiver, 'message', { id: crypto.randomUUID(), session: session ?? ready.session,
      name: 'Display only', text: 'Hello there', ...message }), signal);
    return await io.read(signal);
  } finally { try { await stream.close({ signal }); } catch (error) { stream.abort(error); } }
}

test('two real Noise services echo locally once, derive author from connection, and acknowledge peer delivery', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t);
  const result = await a.service.send({ text: 'Hello\nroom 🌍', name: '<script>display only</script>' });
  assert.equal(result.delivery.status, 'delivered'); assert.equal(result.delivery.delivered, 1);
  assert.equal(result.delivery.recipients[0].peerId, b.node.peerId.toString());
  assert.equal(a.messages.length, 1); assert.equal(a.messages[0].local, true);
  assert.equal(b.messages.length, 1); assert.equal(b.messages[0].peerId, a.node.peerId.toString());
  assert.equal(b.messages[0].text, 'Hello\nroom 🌍'); assert.equal(b.messages[0].local, false);
  assert.equal(b.messages[0].id, result.message.id);
  assert.deepEqual(a.statuses.map((entry) => entry.status), ['sending', 'delivered']);
  assert.equal(a.node.getConnections()[0].encryption, '/noise');
  await b.service.send({ name: 'B', text: 'Reply' }); assert.equal(a.messages[1].text, 'Reply');
});

test('enumeration excludes bootstrap, self, unknown and other room/topology/game peers', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t);
  const peer = b.node.peerId.toString();
  for (const meta of [{ ...scope, gameId: 'other' }, { ...scope, roomId: 'other' }, { ...scope, topologyId: 'other' }]) {
    a.manager.peers.set(peer, meta);
    assert.equal((await a.service.send({ text: 'Local only' })).delivery.status, 'local-only');
  }
  a.manager.peers.set(peer, scope); a.manager.bootstrapPeerIds.add(peer);
  a.manager.peers.set(a.node.peerId.toString(), scope);
  assert.equal((await a.service.send({ text: 'No relay messages' })).delivery.total, 0);
  a.manager.peers.delete(peer); a.manager.bootstrapPeerIds.clear();
  assert.equal((await a.service.send({ text: 'Raw connection is insufficient' })).delivery.total, 0);
  assert.equal(b.messages.length, 0);
});

test('incoming scope, claimed author, unexpected fields and wrong receiver session fail closed', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t);
  for (const hello of [{ worldId: 'other' }, { scope: { ...scope, roomId: 'other' } },
    { scope: { ...scope, gameId: 'other' } }, { scope: { ...scope, topologyId: 'other' } },
    { recipient: a.node.peerId.toString() }, { author: b.node.peerId.toString() }]) {
    assert.equal((await raw(a, b, { hello })).type, 'error');
  }
  for (const message of [{ peerId: b.node.peerId.toString() }, { sender: b.node.peerId.toString() }, { history: [] }]) {
    assert.equal((await raw(a, b, { message })).type, 'error');
  }
  assert.equal((await raw(a, b, { session: 'expired-session' })).type, 'error'); assert.equal(b.messages.length, 0);
});

test('plaintext connections cannot deliver', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t, 2, { plaintext: true });
  const result = await a.service.send({ text: 'No plaintext' });
  assert.equal(result.delivery.status, 'failed'); assert.equal(b.messages.length, 0);
});

test('duplicate messages acknowledge once, conflicting duplicates reject, reload invalidates old receiver session', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), id = crypto.randomUUID(), session = b.service.session;
  assert.equal((await raw(a, b, { message: { id } })).type, 'ack');
  assert.equal((await raw(a, b, { message: { id } })).type, 'ack'); assert.equal(b.messages.length, 1);
  assert.equal((await raw(a, b, { message: { id, text: 'Changed replay' } })).type, 'error');
  await b.service.close();
  b.service = new RoomChatService({ networkManager: b.manager, worldId, onMessage: (value) => b.messages.push(value) });
  await b.service.start();
  assert.equal((await raw(a, b, { session, message: { id } })).type, 'error'); assert.equal(b.messages.length, 1);
  assert.equal((await raw(a, b, { message: { id: crypto.randomUUID() } })).type, 'ack'); assert.equal(b.messages.length, 2);
});

test('UTF-8 bounds, malformed Unicode, rate and replay storage limits reject without extra local echoes', { timeout: 15000 }, async (t) => {
  let clock = 0; const [a, b] = await fixture(t, 2, { service: { now: () => clock } });
  for (const input of [{ text: '😀'.repeat(513) }, { text: '\ud800' }, { text: ' ' }, { text: 'a\0b' },
    { text: 'hello', name: 'é'.repeat(41) }, { text: 'hello', sender: 'spoof' }]) assert.throws(() => a.service.send(input));
  assert.equal(a.messages.length, 0);
  assert.equal((await a.service.send({ text: 'é'.repeat(1024), name: 'é'.repeat(40) })).delivery.status, 'delivered');
  for (let i = 1; i < ROOM_CHAT_LIMITS.rateMessages; i++) await a.service.send({ text: `Message ${i}` });
  assert.throws(() => a.service.send({ text: 'Rate limited' }), { code: 'ERR_ROOM_CHAT_RATE' });
  clock += ROOM_CHAT_LIMITS.rateWindowMs;
  for (let i = 0; i < ROOM_CHAT_LIMITS.replayEntries; i++) b.service.seen.set(`fixture:${i}`, { at: clock });
  const result = await a.service.send({ text: 'Replay storage is bounded' }); assert.equal(result.delivery.status, 'failed');
  assert.match(result.delivery.recipients[0].error, /replay window is full/);
});

test('fanout reports partial delivery truthfully when another same-room peer rejects world scope', { timeout: 15000 }, async (t) => {
  const [a, b, c] = await fixture(t, 3); c.service.worldId = 'different-world';
  const result = await a.service.send({ text: 'A bounded fanout' });
  assert.equal(result.delivery.status, 'partial'); assert.equal(result.delivery.delivered, 1); assert.equal(result.delivery.total, 2);
  assert.equal(b.messages.length, 1); assert.equal(c.messages.length, 0);
});

test('a missing acknowledgment is unconfirmed and never causes message replay', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t); let writes = 0;
  const realEnvelope = b.service._envelope.bind(b.service);
  b.service._envelope = (type, ...args) => { if (type === 'ack') { writes++; throw new Error('Ack write failed'); } return realEnvelope(type, ...args); };
  // The receiver already emitted the message; it must not send a false rejection after a failed ack.
  const result = await a.service.send({ text: 'Accepted but ack lost' });
  assert.equal(result.delivery.status, 'failed'); assert.equal(result.delivery.recipients[0].status, 'unconfirmed');
  assert.equal(b.messages.length, 1); assert.equal(writes, 1);
});

test('malformed acknowledgment is unconfirmed, while a bounded silent receiver times out without replay', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t, 2, { service: { requestTimeoutMs: 150 } });
  const realEnvelope = b.service._envelope.bind(b.service);
  b.service._envelope = (type, recipient, extra) => realEnvelope(type, recipient,
    type === 'ack' ? { ...extra, id: 'wrong-id' } : extra);
  const first = await a.service.send({ text: 'Wrong receipt cannot prove delivery' });
  assert.equal(first.delivery.recipients[0].status, 'unconfirmed'); assert.equal(b.messages.length, 1);
  b.service._envelope = realEnvelope;
  const realHandler = b.service._handle.bind(b.service);
  b.service._handle = async (stream) => {
    // Do not process or acknowledge the hello; this is an owned test peer only.
    await delay(200); stream.abort(new Error('Test receiver deadline'));
  };
  const second = await a.service.send({ text: 'No payload before handshake' });
  assert.equal(second.delivery.recipients[0].status, 'failed');
  assert.match(second.delivery.recipients[0].error, /timed out/); assert.equal(b.messages.length, 1);
  b.service._handle = realHandler;
});

test('validated acknowledgment survives close failure and no second message is dispatched', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), realOpen = a.service._open.bind(a.service);
  a.service._open = async (...args) => { const opened = await realOpen(...args); opened.stream.close = async () => { throw new Error('close failed'); }; return opened; };
  const result = await a.service.send({ text: 'Valid acknowledgment' });
  assert.equal(result.delivery.status, 'delivered'); assert.equal(b.messages.length, 1);
});

test('cancelled stalled stream opening aborts late stream, sends no payload, and close does not stop shared node', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), connection = a.node.getConnections()[0], real = connection.newStream.bind(connection);
  let release, aborted = 0;
  connection.newStream = () => new Promise((resolve) => { release = resolve; });
  const controller = new AbortController(), sending = a.service.send({ text: 'Cancel before writing' }, { signal: controller.signal });
  await until(() => release); controller.abort(new DOMException('Cancelled by user', 'AbortError'));
  const result = await sending; assert.equal(result.delivery.cancelled, true); assert.equal(result.delivery.recipients[0].status, 'failed');
  release({ abort: async () => { aborted++; } }); await until(() => aborted === 1);
  connection.newStream = real; await a.service.close(); assert.equal(a.node.status, 'started');
  assert.equal(b.messages.length, 0); assert.throws(() => a.service.send({ text: 'Closed' }), { code: 'ERR_ROOM_CHAT_CLOSED' });
});

test('service ownership, changed network scope, failed cleanup retry and receiver close are explicit', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t);
  const other = new RoomChatService({ networkManager: a.manager, worldId });
  await assert.rejects(other.start(), { code: 'ERR_ROOM_CHAT_OWNER' });
  a.manager.config.roomId = 'changed'; assert.throws(() => a.service.send({ text: 'Wrong room' }), { code: 'ERR_ROOM_CHAT_SCOPE' });
  a.manager.config.roomId = scope.roomId;
  const unhandle = a.node.unhandle.bind(a.node); let fail = true;
  a.node.unhandle = async (...args) => { if (fail) throw new Error('cleanup failed'); return unhandle(...args); };
  await assert.rejects(a.service.close(), /cleanup failed/);
  await assert.rejects(other.start(), { code: 'ERR_ROOM_CHAT_OWNER' });
  fail = false; await a.service.close(); await other.start(); await other.close();
  await b.service.close(); assert.equal(b.node.status, 'started');
});

test('outgoing admission is bounded and close acknowledges all cancelled sends before releasing ownership', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t), connection = a.node.getConnections()[0];
  const opening = connection.newStream.bind(connection); connection.newStream = () => new Promise(() => {});
  const sends = [a.service.send({ text: 'First pending' }), a.service.send({ text: 'Second pending' })];
  assert.throws(() => a.service.send({ text: 'No third concurrent echo' }), { code: 'ERR_ROOM_CHAT_BUSY' });
  assert.equal(a.messages.length, 2);
  await a.service.close(); const results = await Promise.all(sends);
  assert.ok(results.every((entry) => entry.delivery.cancelled && entry.delivery.status === 'failed'));
  assert.equal(a.service.sends, 0); assert.equal(a.service.operations.size, 0); assert.equal(b.messages.length, 0);
  connection.newStream = opening;
});

test('send waits for a pending normal dial instead of failing before a real authenticated connection arrives', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t, 2, { noDial: true }); let requests = 0;
  a.manager._maybeDialPeer = () => { requests++; }; // Manager already has a discovery dial in flight.
  const connection = delay(35).then(() => a.node.dial(b.node.getMultiaddrs()));
  const result = await a.service.send({ text: 'The pending connection delivers once' }); await connection;
  assert.equal(requests, 1); assert.equal(result.delivery.status, 'delivered');
  assert.equal(b.messages.length, 1); assert.equal(b.messages[0].peerId, a.node.peerId.toString());
});

test('cancel during pending dial never sends later; an absent peer remains bounded by the existing request deadline', { timeout: 15000 }, async (t) => {
  const [a, b] = await fixture(t, 2, { noDial: true, service: { requestTimeoutMs: 100 } });
  const abort = new AbortController(), pending = a.service.send({ text: 'Cancelled before connection' }, { signal: abort.signal });
  abort.abort(new DOMException('Cancelled', 'AbortError'));
  const cancelled = await pending; assert.equal(cancelled.delivery.cancelled, true);
  assert.equal(cancelled.delivery.recipients[0].status, 'failed');
  const connection = await a.node.dial(b.node.getMultiaddrs()); await delay(25); assert.equal(b.messages.length, 0);
  await connection.close();
  await until(() => !a.node.getConnections().some((entry) => entry.remotePeer.equals(b.node.peerId)));
  const started = performance.now(), timedOut = await a.service.send({ text: 'No indefinite wait' });
  assert.equal(timedOut.delivery.status, 'failed'); assert(performance.now() - started < 500);
  assert.match(timedOut.delivery.recipients[0].error, /timed out/); assert.equal(b.messages.length, 0);
});
