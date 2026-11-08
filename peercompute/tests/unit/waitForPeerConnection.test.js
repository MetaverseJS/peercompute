import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { waitForPeerConnection } from '../../src/peercompute/networkManager/inference/waitForPeerConnection.js';

function fixture() {
  const node = new EventTarget(), connections = [], listeners = new Set();
  const add = node.addEventListener.bind(node), remove = node.removeEventListener.bind(node);
  node.addEventListener = (type, fn, options) => { if (type === 'connection:open') listeners.add(fn); add(type, fn, options); };
  node.removeEventListener = (type, fn, options) => { if (type === 'connection:open') listeners.delete(fn); remove(type, fn, options); };
  node.getConnections = () => connections;
  const connection = (id = 'target', encryption = '/noise') => ({ remotePeer: { toString: () => id }, status: 'open', encryption,
    close() { throw new Error('Waiter must not close manager connections'); }, abort() { throw new Error('Waiter must not abort manager connections'); } });
  const emit = (value) => { connections.push(value); node.dispatchEvent(new CustomEvent('connection:open', { detail: value })); };
  return { node, listeners, connections, connection, emit, options: { node, peerId: 'target', timeoutMs: 1000, dial: () => {}, assertAllowed: () => {} } };
}

test('subscribe before a synchronous connection event and do not wait for the normal dial promise to settle', async () => {
  const f = fixture(), target = f.connection();
  const result = await waitForPeerConnection({ ...f.options, dial: () => { assert.equal(f.listeners.size, 1); f.emit(target); return new Promise(() => {}); } });
  assert.equal(result, target); assert.equal(f.listeners.size, 0);
});

test('an already-pending normal dial may return early; only the exact encrypted connection completes the wait', async () => {
  const f = fixture(); let dials = 0;
  const pending = waitForPeerConnection({ ...f.options, dial: () => { dials++; } });
  f.emit(f.connection('unrelated')); f.emit(f.connection('target', '/plaintext/2.0.0'));
  assert.equal(f.listeners.size, 1); await delay(10);
  const target = f.connection(); f.emit(target);
  assert.equal(await pending, target); assert.equal(dials, 1); assert.equal(f.listeners.size, 0);
});

test('existing connection still requires caller scope authorization and does not redial', async () => {
  const f = fixture(); f.emit(f.connection()); let dials = 0;
  await assert.rejects(waitForPeerConnection({ ...f.options, assertAllowed: () => { throw new Error('Wrong room'); }, dial: () => { dials++; } }), /Wrong room/);
  assert.equal(dials, 0); assert.equal(f.listeners.size, 0);
  assert.equal(await waitForPeerConnection({ ...f.options, dial: () => { dials++; } }), f.connections[0]); assert.equal(dials, 0);
});

test('scope changes while waiting fail closed before returning a connection', async () => {
  const f = fixture(); let allowed = true;
  const pending = waitForPeerConnection({ ...f.options, assertAllowed: () => { if (!allowed) throw new Error('Room changed'); } });
  allowed = false; f.emit(f.connection()); await assert.rejects(pending, /Room changed/); assert.equal(f.listeners.size, 0);
});

test('cancellation removes listeners and consumes a late dial failure without closing a shared connection', async () => {
  const f = fixture(), abort = new AbortController(); let rejectDial;
  const pending = waitForPeerConnection({ ...f.options, signal: abort.signal, dial: () => new Promise((_, reject) => { rejectDial = reject; }) });
  abort.abort(new DOMException('Cancelled', 'AbortError')); await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(f.listeners.size, 0); f.emit(f.connection()); rejectDial(new Error('Late normal dial error')); await delay(10);
  assert.equal(f.connections[0].status, 'open');
});

test('bounded deadline and pre-aborted input remove listeners without dispatching later', async () => {
  const f = fixture(); let dials = 0;
  const pending = waitForPeerConnection({ ...f.options, timeoutMs: 20, dial: () => { dials++; } });
  const rejected = assert.rejects(pending, { code: 'ERR_PEER_CONNECTION_DEADLINE' }); await delay(30); await rejected;
  assert.equal(f.listeners.size, 0); assert.equal(dials, 1);
  await assert.rejects(waitForPeerConnection({ ...f.options, signal: AbortSignal.abort(), dial: () => { dials++; } }), { name: 'AbortError' });
  assert.equal(dials, 1); assert.equal(f.listeners.size, 0);
  assert.throws(() => waitForPeerConnection({ ...f.options, timeoutMs: 15001 }), /Invalid bounded/);
});
