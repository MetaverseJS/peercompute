import test from 'node:test';
import assert from 'node:assert/strict';
import { WorkMesh, WORK_MESH_SCHEMA } from '../../src/peercompute/workMesh/WorkMesh.js';

/**
 * In-memory network on a virtual clock. `speed` is tasks per second per node;
 * `links` are pairs; `delayMs` is the delivery time of every message.
 */
function network({ speeds, links, delayMs = 10, config = {} }) {
  let now = 0;
  const events = []; // [at, order, fn]
  let order = 0;
  const at = (time, fn) => { events.push([time, order++, fn]); };
  const moved = new Map();
  const up = new Set(links.map(([a, b]) => [a, b].sort().join('|')));
  const nodes = new Map();
  for (const [id, speed] of Object.entries(speeds)) {
    nodes.set(id, new WorkMesh({
      nodeId: id, config, clock: () => now,
      send: (peerId, message) => at(now + delayMs, () => { if (up.has([id, peerId].sort().join('|'))) nodes.get(peerId)?.receive(id, structuredClone(message)); }),
      execute: (task, done) => at(now + 1000 / speed, () => done({ by: id, value: task.payload * 2 })),
      onWork: (peerId, units) => moved.set(`${id}>${peerId}`, (moved.get(`${id}>${peerId}`) || 0) + units)
    }));
  }
  for (const [a, b] of links) { nodes.get(a).linkUp(b); nodes.get(b).linkUp(a); }
  const run = (untilMs, tickMs = 100) => {
    for (let t = Math.ceil(now / tickMs) * tickMs; t <= untilMs; t += tickMs) at(t, () => { for (const node of nodes.values()) node.tick(now); });
    for (;;) {
      events.sort((x, y) => (x[0] - y[0]) || (x[1] - y[1]));
      if (!events.length || events[0][0] > untilMs) break;
      const [time, , fn] = events.shift();
      now = time; fn();
    }
    now = untilMs;
  };
  const cut = (a, b) => { up.delete([a, b].sort().join('|')); nodes.get(a)?.linkDown(b); nodes.get(b)?.linkDown(a); };
  const kill = (id) => { for (const peer of [...nodes.keys()]) if (peer !== id) cut(id, peer); nodes.get(id).destroy(); nodes.delete(id); };
  return { nodes, run, cut, kill, moved, clock: () => now };
}

const payloads = (count) => Array.from({ length: count }, (_, i) => i);

test('a job spreads over a chain and every result returns in order', async () => {
  const net = network({ speeds: { a: 5, b: 5, c: 5 }, links: [['a', 'b'], ['b', 'c']] });
  let finished = null;
  net.nodes.get('a').submitJob({ jobId: 'j1', tasks: payloads(120) }).then((values) => { finished = values; });
  net.run(20000);
  await Promise.resolve();
  assert.ok(finished, 'the job completes');
  assert.deepEqual(finished.map((entry) => entry.value), payloads(120).map((value) => value * 2));
  const by = (id) => finished.filter((entry) => entry.by === id).length;
  // Three equal nodes share the work; c is only reachable through b.
  for (const id of ['a', 'b', 'c']) assert.ok(by(id) >= 25, `${id} ran ${by(id)} tasks`);
  assert.ok(net.moved.get('b>c') > 0 && net.moved.get('c>b') > 0);
  assert.equal(net.nodes.get('a').counters.duplicates, 0);
});

test('faster nodes do more of the work, and the job is quicker than the origin alone', async () => {
  const solo = network({ speeds: { a: 2 }, links: [] });
  let soloDone = null;
  solo.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(60), onResult: () => { soloDone = solo.clock(); } });
  solo.run(60000);
  const net = network({ speeds: { a: 2, slow: 1, fast: 10 }, links: [['a', 'slow'], ['a', 'fast']] });
  let done = null, values = null;
  net.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(60), onResult: () => { done = net.clock(); } }).then((out) => { values = out; });
  net.run(60000);
  await Promise.resolve();
  const by = (id) => values.filter((entry) => entry.by === id).length;
  assert.ok(by('fast') > 3 * by('slow'), `fast ${by('fast')} against slow ${by('slow')}`);
  assert.ok(done < soloDone / 3, `mesh ${done} ms against solo ${soloDone} ms`);
});

test('a node stops computing when it cannot hand its results on', () => {
  const net = network({ speeds: { a: 1, b: 100 }, links: [['a', 'b']], config: { resultBuffer: 4 } });
  net.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(500) });
  net.run(1000);
  net.cut('a', 'b');
  const before = net.nodes.get('b').counters.executed;
  net.run(6000);
  const b = net.nodes.get('b');
  // b finishes at most a buffer's worth, then waits; once the origin has been
  // unreachable for long enough it drops the leftovers.
  assert.ok(b.counters.executed - before <= 4 + 1);
  net.run(15000);
  assert.deepEqual([b.queue.length, b.results.length, b.origins.size], [0, 0, 0]);
});

test('work held by a peer that disappears is offered again and the job still completes', async () => {
  const net = network({ speeds: { a: 2, b: 2, c: 2 }, links: [['a', 'b'], ['a', 'c']], config: { taskTimeoutMs: 3000 } });
  let values = null;
  net.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(80) }).then((out) => { values = out; });
  net.run(2000);
  assert.ok(net.nodes.get('b').queue.length > 0, 'b is holding tasks when it fails');
  net.kill('b');
  net.run(60000);
  await Promise.resolve();
  assert.ok(values, 'the job completes without b');
  assert.deepEqual(values.map((entry) => entry.value), payloads(80).map((value) => value * 2));
  assert.ok(net.nodes.get('a').counters.reissued > 0);
});

test('the origin never re-offers a task that is still waiting in its own queue', async () => {
  // Alone, at two tasks per second, later tasks wait far longer than the timeout.
  const net = network({ speeds: { a: 2 }, links: [], config: { taskTimeoutMs: 500 } });
  let values = null;
  net.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(30) }).then((out) => { values = out; });
  net.run(20000);
  await Promise.resolve();
  assert.equal(values.length, 30);
  assert.deepEqual([net.nodes.get('a').counters.reissued, net.nodes.get('a').counters.duplicates, net.nodes.get('a').counters.executed], [0, 0, 30]);
});

test('two jobs from different origins share the mesh and results reach the right origin', async () => {
  const net = network({ speeds: { a: 4, b: 4, c: 4 }, links: [['a', 'b'], ['b', 'c']] });
  let fromA = null, fromC = null;
  net.nodes.get('a').submitJob({ jobId: 'ja', tasks: payloads(40) }).then((out) => { fromA = out; });
  net.nodes.get('c').submitJob({ jobId: 'jc', tasks: payloads(40).map((value) => value + 1000) }).then((out) => { fromC = out; });
  net.run(40000);
  await Promise.resolve();
  assert.deepEqual(fromA.map((entry) => entry.value), payloads(40).map((value) => value * 2));
  assert.deepEqual(fromC.map((entry) => entry.value), payloads(40).map((value) => (value + 1000) * 2));
});

test('a node starts its next task at once, and work does not circulate between equal neighbours', async () => {
  // Four tasks per second is one task every 250 ms, which a 100 ms tick would round up to 300 ms.
  const solo = network({ speeds: { a: 4 }, links: [] });
  solo.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(1000) });
  solo.run(30000);
  assert.ok(Math.abs(solo.nodes.get('a').counters.executed - 120) <= 1, `ran ${solo.nodes.get('a').counters.executed} of 120`);

  const net = network({ speeds: { a: 4, b: 4, c: 4, d: 4 }, links: [['a', 'b'], ['a', 'c'], ['b', 'c'], ['b', 'd'], ['c', 'd']] });
  const source = net.nodes.get('a');
  source.submitJob({ jobId: 'j', tasks: payloads(100000) });
  net.run(60000);
  const executed = [...net.nodes.values()].reduce((sum, node) => sum + node.counters.executed, 0);
  assert.ok(executed >= 0.95 * 16 * 60, `four nodes ran ${executed} of 960`);
  assert.equal(source.counters.duplicates, 0);
  assert.equal(source.counters.reissued, 0);
  // b and c are about the same distance from the origin. Nothing circulates
  // between them (no task was late or run twice above), and d, which both can
  // reach, gets its full share.
  assert.ok(net.nodes.get('d').counters.executed >= 0.9 * 4 * 60);
});

test('a slow node is not left holding more than a few seconds of work', () => {
  const net = network({ speeds: { a: 20, slow: 0.5, fast: 20 }, links: [['a', 'slow'], ['a', 'fast']] });
  net.nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(100000) });
  let worst = 0;
  for (let t = 5000; t <= 60000; t += 1000) { net.run(t); worst = Math.max(worst, net.nodes.get('slow').queue.length); }
  // At half a task per second, 64 queued tasks would be two minutes of work.
  assert.ok(worst <= 6, `the slow node held up to ${worst} tasks`);
  assert.ok(net.nodes.get('fast').counters.executed > 30 * net.nodes.get('slow').counters.executed);
});

test('a strong peer is fed through a fast two-link path rather than its slow direct link', () => {
  // Every payload between the origin and the strong peer is slow; via the relay it is fast.
  const slow = new Set(['a|strong']);
  let now = 0, order = 0;
  const events = [];
  const at = (time, fn) => events.push([time, order++, fn]);
  const speeds = { a: 1, relay: 1, strong: 40 };
  const nodes = new Map();
  for (const [id, speed] of Object.entries(speeds)) {
    nodes.set(id, new WorkMesh({
      nodeId: id, clock: () => now,
      send: (peerId, message) => {
        const payload = message.type === 'work' ? message.tasks.length : message.type === 'results' ? message.results.length : 0;
        const perTask = slow.has([id, peerId].sort().join('|')) ? 400 : 5;
        at(now + 5 + payload * perTask, () => nodes.get(peerId).receive(id, structuredClone(message)));
      },
      execute: (task, done) => at(now + 1000 / speed, () => done(task.payload))
    }));
  }
  for (const [x, y] of [['a', 'relay'], ['relay', 'strong'], ['a', 'strong']]) { nodes.get(x).linkUp(y); nodes.get(y).linkUp(x); }
  nodes.get('a').submitJob({ jobId: 'j', tasks: payloads(100000) });
  for (let t = 0; t <= 60000; t += 100) at(t, () => { for (const node of nodes.values()) node.tick(now); });
  for (;;) {
    events.sort((x, y) => (x[0] - y[0]) || (x[1] - y[1]));
    if (!events.length || events[0][0] > 60000) break;
    const [time, , fn] = events.shift(); now = time; fn();
  }
  // The slow link alone could carry 2.5 tasks per second: 150 in a minute.
  const strong = nodes.get('strong');
  assert.ok(strong.counters.executed > 1500, `the strong peer ran ${strong.counters.executed} tasks`);
  assert.ok(strong.distances.get('j') < 0.05, `its distance follows the fast path: ${strong.distances.get('j')}`);
  assert.ok(nodes.get('relay').counters.forwarded > 1000);
});

test('bad input is rejected and foreign messages are ignored', () => {
  assert.throws(() => new WorkMesh({ nodeId: 'a' }), TypeError);
  const mesh = new WorkMesh({ nodeId: 'a', send() {}, execute() {} });
  assert.throws(() => mesh.submitJob({ jobId: 'j' }), TypeError);
  mesh.submitJob({ jobId: 'j', tasks: [1] });
  assert.throws(() => mesh.submitJob({ jobId: 'j', tasks: [1] }), /already running/);
  mesh.receive('stranger', { schema: WORK_MESH_SCHEMA, type: 'work', tasks: [{ jobId: 'x', taskId: 0, origin: 'z', payload: 1 }] });
  mesh.linkUp('b');
  mesh.receive('b', { schema: 'other', type: 'work', tasks: [{ jobId: 'x', taskId: 0, origin: 'z', payload: 1 }] });
  assert.equal(mesh.queue.length, 0);
  mesh.destroy();
  assert.throws(() => mesh.submitJob({ jobId: 'k', tasks: [] }), /destroyed/);
});
