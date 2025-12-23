import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkScheduler } from '../../src/peercompute/networkManager/NetworkScheduler.js';

const createAdapter = (overrides = {}) => ({
  sendSnapshot: () => {},
  sendCommand: () => {},
  sendEvent: () => {},
  reconnect: () => {},
  getPeerId: () => 'peer-a',
  getAuthority: () => null,
  getGameId: () => 'game',
  getRoomId: () => 'room',
  isInScope: () => true,
  ...overrides
});

test('scheduler sends snapshots when dirty and respects interval', () => {
  const sent = [];
  const scheduler = new NetworkScheduler(
    createAdapter({ sendSnapshot: (msg) => sent.push(msg) }),
    { snapshotHz: 10, keepaliveMs: 1000 }
  );
  scheduler.registerStateProvider(() => ({ pos: 1 }));
  scheduler.markStateDirty();
  scheduler.tick(0);
  scheduler.tick(50);
  assert.equal(sent.length, 1);
  scheduler.markStateDirty();
  scheduler.tick(100);
  assert.equal(sent.length, 2);
});

test('scheduler sends keepalive snapshots after interval', () => {
  const sent = [];
  const scheduler = new NetworkScheduler(
    createAdapter({ sendSnapshot: (msg) => sent.push(msg) }),
    { snapshotHz: 5, keepaliveMs: 150 }
  );
  scheduler.registerStateProvider(() => ({ pos: 1 }));
  scheduler.markStateDirty();
  scheduler.tick(0);
  scheduler.tick(100);
  assert.equal(sent.length, 1);
  scheduler.tick(200);
  assert.equal(sent.length, 2);
  assert.equal(sent[1].keepalive, true);
});

test('scheduler batches commands on command ticks', () => {
  const sent = [];
  const scheduler = new NetworkScheduler(
    createAdapter({ sendCommand: (msg) => sent.push(msg) }),
    { commandHz: 20 }
  );
  scheduler.registerCommandProvider(() => [{ input: 'move' }]);
  scheduler.tick(0);
  scheduler.tick(10);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].payload[0].data.input, 'move');
});

test('scheduler triggers reconnect on stall with backoff', () => {
  let reconnects = 0;
  const scheduler = new NetworkScheduler(
    createAdapter({ reconnect: () => { reconnects += 1; } }),
    { reconnectStallMs: 100, reconnectBackoffMs: 200, snapshotHz: 1, commandHz: 1 }
  );
  scheduler.recordRx(0);
  scheduler.tick(50);
  assert.equal(reconnects, 0);
  scheduler.tick(150);
  assert.equal(reconnects, 1);
  scheduler.tick(250);
  assert.equal(reconnects, 1);
  scheduler.tick(400);
  assert.equal(reconnects, 2);
});

test('scheduler retries reliable events until ack', () => {
  const sent = [];
  const scheduler = new NetworkScheduler(
    createAdapter({ sendEvent: (msg) => sent.push(msg) }),
    { eventRetryMs: 50, eventRetryMax: 3, maxEventsPerTick: 10 }
  );
  const id = scheduler.queueEvent({ type: 'boom' }, { reliable: true });
  scheduler.tick(0);
  assert.equal(sent.length, 1);
  scheduler.tick(40);
  assert.equal(sent.length, 1);
  scheduler.tick(60);
  assert.equal(sent.length, 2);
  scheduler.handleMessage(
    { type: 'pc-ack', target: 'peer-a', payload: { eventIds: [id] }, header: { ts: 60 } },
    'peer-b'
  );
  scheduler.tick(120);
  assert.equal(sent.length, 2);
  const stats = scheduler.getReliabilityStats();
  assert.equal(stats.acked, 1);
});

test('scheduler acks reliable events on receive', () => {
  const sent = [];
  const scheduler = new NetworkScheduler(
    createAdapter({ sendEvent: (msg) => sent.push(msg) }),
    {}
  );
  scheduler.handleMessage(
    {
      type: 'pc-event',
      header: { ts: 0, peerId: 'peer-b' },
      gameId: 'game',
      roomId: 'room',
      payload: [{ id: 'evt-1', reliable: true, payload: { hit: true } }]
    },
    'peer-b'
  );
  assert.equal(sent.length, 1);
  assert.equal(sent[0].type, 'pc-ack');
  assert.deepEqual(sent[0].payload.eventIds, ['evt-1']);
  assert.equal(sent[0].target, 'peer-b');
  const stats = scheduler.getReliabilityStats();
  assert.equal(stats.pending, 0);
});
