import test from 'node:test';
import assert from 'node:assert/strict';
import { WorkMeshService, WORK_MESH_PROTOCOL } from '../../src/peercompute/networkManager/WorkMeshService.js';

const settle = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));

/** One-way in-memory frame pipe with the channel interface the service uses. */
function pipe() {
  const frames = [];
  let waiting = null, closed = null;
  const fail = (error) => { closed = error || new Error('closed'); waiting?.reject(closed); waiting = null; };
  return {
    writer: {
      async write(value) {
        if (closed) throw closed;
        const text = JSON.stringify(value);
        if (waiting) { waiting.resolve(JSON.parse(text)); waiting = null; } else frames.push(JSON.parse(text));
        return text.length;
      },
      abort: fail
    },
    reader: {
      read() {
        if (frames.length) return Promise.resolve(frames.shift());
        if (closed) return Promise.reject(closed);
        return new Promise((resolve, reject) => { waiting = { resolve, reject }; });
      },
      abort: fail
    },
    fail
  };
}

/** Fake NetworkManagers joined by direct connections; `limited` pairs are relayed. */
function cluster(ids, pairs, { limited = [], speeds = {}, config = {} } = {}) {
  const key = (a, b) => [a, b].sort().join('|');
  const up = new Set(pairs.map(([a, b]) => key(a, b)));
  const relayed = new Set(limited.map(([a, b]) => key(a, b)));
  const managers = new Map(), services = new Map(), pipes = [];
  for (const id of ids) {
    const work = new Map();
    const manager = {
      peerId: id, bootstrapPeerIds: new Set(['relay']), handler: null, work,
      recordPeerWork: (peerId, units) => work.set(peerId, (work.get(peerId) || 0) + units),
      libp2p: {
        handle: async (protocol, handler) => { assert.equal(protocol, WORK_MESH_PROTOCOL); manager.handler = handler; },
        unhandle: async () => { manager.handler = null; }
      },
      _getConnectionPeers: () => [{ peerId: 'relay' }, ...ids.filter((other) => other !== id && up.has(key(id, other))).map((peerId) => ({ peerId }))],
      _getConnectionsForPeer: (peerId) => (up.has(key(id, peerId)) ? [{
        status: 'open', limits: relayed.has(key(id, peerId)) ? { bytes: 1n } : undefined,
        newStream: async (protocol) => {
          assert.equal(protocol, WORK_MESH_PROTOCOL);
          const link = pipe();
          pipes.push({ from: id, to: peerId, link });
          managers.get(peerId).handler?.(link.reader, { remotePeer: { toString: () => id } });
          return link.writer;
        }
      }] : [])
    };
    managers.set(id, manager);
    services.set(id, new WorkMeshService(manager, {
      tickMs: 1e9, channel: (stream) => stream, config,
      execute: (task, done) => setTimeout(() => done({ by: id, value: task.payload + 1 }), 1000 / (speeds[id] || 200))
    }));
  }
  const tickAll = async (rounds = 1) => {
    for (let i = 0; i < rounds; i += 1) { for (const service of services.values()) service.tick(); await settle(8); }
  };
  return { managers, services, pipes, up, key, tickAll };
}

test('a job crosses real service plumbing: streams per link, results home, work reported per peer', async (t) => {
  const net = cluster(['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]);
  t.after(() => Promise.all([...net.services.values()].map((service) => service.stop())));
  for (const service of net.services.values()) await service.start();
  const done = net.services.get('a').submitJob({ jobId: 'j', tasks: Array.from({ length: 90 }, (_, i) => i) });
  let values = null;
  done.then((out) => { values = out; });
  for (let i = 0; i < 400 && !values; i += 1) await net.tickAll();
  assert.ok(values, 'the job completes');
  assert.deepEqual(values.map((entry) => entry.value), Array.from({ length: 90 }, (_, i) => i + 1));
  assert.ok(values.some((entry) => entry.by === 'c'), 'the two-hop peer did some of the work');
  // One outbound stream per direction per link, none to the relay or to unlinked peers.
  assert.deepEqual(net.pipes.map((entry) => entry.from + entry.to).sort(), ['ab', 'ba', 'bc', 'cb']);
  assert.ok(net.managers.get('a').work.get('b') > 0 && net.managers.get('c').work.get('b') > 0);
  assert.equal(net.managers.get('a').work.has('c'), false);
  assert.ok(net.services.get('a').snapshot().bytesSent > 0);
  for (const service of net.services.values()) await service.stop();
  assert.equal(net.managers.get('a').handler, null);
});

test('relayed connections are not links, and work lost with a connection is offered again', async (t) => {
  const net = cluster(['a', 'b', 'c'], [['a', 'b'], ['a', 'c']], { limited: [['a', 'c']], speeds: { a: 20, b: 20, c: 20 },
    config: { taskTimeoutMs: 400 } });
  t.after(() => Promise.all([...net.services.values()].map((service) => service.stop())));
  for (const service of net.services.values()) await service.start();
  let values = null;
  net.services.get('a').submitJob({ jobId: 'j', tasks: Array.from({ length: 60 }, (_, i) => i) }).then((out) => { values = out; });
  await net.tickAll(10);
  assert.deepEqual(net.services.get('a').snapshot().peers, ['b']);
  assert.ok(net.services.get('b').mesh.queue.length + net.services.get('b').mesh.running > 0, 'b holds work');
  // The connection to b closes with work in flight and queued at b.
  net.up.delete(net.key('a', 'b'));
  for (const entry of net.pipes) entry.link.fail(new Error('connection closed'));
  for (let i = 0; i < 600 && !values; i += 1) await net.tickAll();
  assert.ok(values, 'the origin finishes the job alone: ' + JSON.stringify(net.services.get('a').snapshot()) + JSON.stringify([...net.services.get('a').mesh.jobs.values()].map((job) => ({ remaining: job.remaining, next: job.next, retry: job.retry.length, issued: job.issued.size }))));
  assert.deepEqual(values.map((entry) => entry.value), Array.from({ length: 60 }, (_, i) => i + 1));
  assert.deepEqual(net.services.get('a').snapshot().peers, []);
  assert.ok(net.services.get('a').mesh.counters.reissued > 0);
});

test('queue reports are coalesced behind a payload and a failed write resets the stream, not the link', async (t) => {
  const net = cluster(['a', 'b'], [['a', 'b']]);
  t.after(() => Promise.all([...net.services.values()].map((service) => service.stop())));
  const a = net.services.get('a');
  await a.start(); await net.services.get('b').start();
  a.tick(); await settle();
  const peer = a.peers.get('b');
  peer.writing = true; // hold the writer as if a large frame were in progress
  a._send('b', { schema: 's', type: 'work', tasks: [] });
  for (let i = 0; i < 5; i += 1) a._send('b', { schema: 's', type: 'state', queued: i });
  assert.deepEqual(peer.outbox.map((message) => message.type), ['work', 'state']);
  assert.equal(peer.outbox[1].queued, 4);
  peer.writing = false;
  peer.out = { write: async () => { throw new Error('reset'); }, abort() {} };
  a.mesh.links.get('b').work = [{ jobId: 'j', taskId: 7, origin: 'a', payload: 1 }]; // a batch in flight
  await a._flush('b', peer);
  // The peer is still connected: the link stays, the unacknowledged batch comes
  // back to the queue, and a fresh stream opens on the next tick.
  assert.equal(a.peers.has('b'), true);
  assert.equal(a.mesh.links.get('b').work, null);
  assert.deepEqual(a.mesh.queue.map((task) => task.taskId), [7]);
  assert.equal(a.snapshot().streamResets, 1);
  assert.equal(peer.out, null);
  a.tick(); await settle();
  assert.ok(peer.out);
  await a.stop(); await net.services.get('b').stop();
  assert.throws(() => new WorkMeshService(null, {}), TypeError);
});
