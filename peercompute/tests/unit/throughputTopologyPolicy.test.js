import test from 'node:test';
import assert from 'node:assert/strict';
import { createThroughputTopologyState, decideThroughputTopology, THROUGHPUT_TOPOLOGY_DEFAULTS }
  from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';

const old = -1e6;
const link = (peerId, flow, since = old) => ({ peerId, flow, since });
const config = { targetConnections: 3, maxConnections: 4 };

test('a node below its target repairs at once, even to a peer in cooldown', () => {
  const state = createThroughputTopologyState();
  state.cooldown.set('c', 1e9);
  const decision = decideThroughputTopology({ now: 0, links: [link('a', 5)], candidates: ['c'], state, random: () => 0, config });
  assert.deepEqual(decision, { connect: 'c', drop: [] });
});

test('a full node opens one trial link, then waits for it to mature', () => {
  const state = createThroughputTopologyState();
  const links = [link('a', 5), link('b', 4), link('c', 3)];
  const first = decideThroughputTopology({ now: 0, links, candidates: ['d', 'e'], state, random: () => 0, config });
  assert.deepEqual(first, { connect: 'd', drop: [] });
  const during = decideThroughputTopology({ now: 1000, links: [...links, link('d', 9, 0)], candidates: ['e'], state, random: () => 0, config });
  assert.deepEqual(during, { connect: null, drop: [] });
});

test('a newcomer that raises this node\'s total displaces the weakest established link', () => {
  const state = createThroughputTopologyState();
  const established = [link('a', 5), link('b', 4), link('c', 3)];
  decideThroughputTopology({ now: 0, links: established, candidates: [], state, config });
  // The newcomer is first seen carrying nothing, when the node moves 12 in total.
  decideThroughputTopology({ now: 1000, links: [...established, link('d', 0, 1000)], candidates: [], state, config });
  const now = 1000 + THROUGHPUT_TOPOLOGY_DEFAULTS.trialMs;
  const better = decideThroughputTopology({ now, links: [...established, link('d', 9, 1000)], candidates: [], state, config });
  assert.deepEqual(better.drop, ['c']);
  assert.ok(state.cooldown.has('c') && state.established.has('d'));
});

test('a newcomer that only takes work from another link is dropped, however busy it is', () => {
  const state = createThroughputTopologyState();
  decideThroughputTopology({ now: 0, links: [link('a', 5), link('b', 4), link('c', 3)], candidates: [], state, config });
  decideThroughputTopology({ now: 1000, links: [link('a', 5), link('b', 4), link('c', 3), link('d', 0, 1000)], candidates: [], state, config });
  const now = 1000 + THROUGHPUT_TOPOLOGY_DEFAULTS.trialMs;
  // d carries 5, but a fell by 5: the node still moves 12.
  const moved = decideThroughputTopology({ now, links: [link('a', 0), link('b', 4), link('c', 3), link('d', 5, 1000)], candidates: [], state, config });
  assert.deepEqual(moved.drop, ['d']);
  // A gain under the 5% threshold does not count either.
  const other = createThroughputTopologyState();
  decideThroughputTopology({ now: 0, links: [link('a', 5), link('b', 4), link('c', 3)], candidates: [], state: other, config });
  decideThroughputTopology({ now: 1000, links: [link('a', 5), link('b', 4), link('c', 3), link('d', 0, 1000)], candidates: [], state: other, config });
  const slight = decideThroughputTopology({ now, links: [link('a', 5), link('b', 4), link('c', 3), link('d', 0.5, 1000)], candidates: [], state: other, config });
  assert.deepEqual(slight.drop, ['d']);
});

test('failed trials double the wait, a kept trial halves it, and links opened by peers do not count', () => {
  const state = createThroughputTopologyState();
  const established = [link('a', 5), link('b', 4), link('c', 3)];
  const base = THROUGHPUT_TOPOLOGY_DEFAULTS.exploreIntervalMs, trial = THROUGHPUT_TOPOLOGY_DEFAULTS.trialMs;
  const step = (now, links, candidates = []) => decideThroughputTopology({ now, links, candidates, state, random: () => 0, config });
  // The wait is measured from the start of the previous trial.
  assert.equal(step(0, established, ['d']).connect, 'd');
  assert.deepEqual(step(trial, [...established, link('d', 0, 0)]).drop, ['d']); // carried nothing
  assert.equal(state.exploreDelayMs, 2 * base);
  assert.equal(step(2 * base - 1, established, ['e']).connect, null);
  let start = 2 * base;
  assert.equal(step(start, established, ['d', 'e']).connect, 'e'); // d is in cooldown
  assert.deepEqual(step(start + 1000, established).drop, []); // e refused the link: a failed trial
  assert.equal(state.exploreDelayMs, 4 * base);
  // A link another peer opened and this node drops leaves the wait alone.
  step(start + 2000, [...established, link('p', 0, start + 2000)]);
  assert.deepEqual(step(start + 2000 + trial, [...established, link('p', 0, start + 2000)]).drop, ['p']);
  assert.equal(state.exploreDelayMs, 4 * base);
  assert.equal(step(start + 4 * base - 1, established, ['f']).connect, null);
  // A trial that earns its place halves the wait.
  start += 4 * base;
  assert.equal(step(start, established, ['f']).connect, 'f');
  assert.deepEqual(step(start + trial, [...established, link('f', 9, start)]).drop, ['c']);
  assert.equal(state.exploreDelayMs, 2 * base);
});

test('repairs prefer peers that are short of links and wait longer after each attempt', () => {
  const state = createThroughputTopologyState();
  const base = THROUGHPUT_TOPOLOGY_DEFAULTS.exploreIntervalMs;
  const short = [link('a', 5), link('b', 4)];
  const args = { links: short, candidates: ['full', 'needy'], available: ['needy'], state, random: () => 0, config };
  assert.equal(decideThroughputTopology({ now: 0, ...args }).connect, 'needy');
  assert.equal(decideThroughputTopology({ now: 1000, ...args }).connect, null);
  assert.equal(decideThroughputTopology({ now: base, ...args }).connect, 'needy');
  assert.equal(decideThroughputTopology({ now: 2 * base, ...args }).connect, null);
  assert.equal(decideThroughputTopology({ now: 3 * base, ...args }).connect, 'needy');
  // Back at the target, the next loss is repaired at once.
  decideThroughputTopology({ now: 3 * base + 1, ...args, links: [...short, link('needy', 1)] });
  assert.equal(decideThroughputTopology({ now: 3 * base + 2, ...args, available: [] }).connect, 'full');
});

test('referrals are preferred at the configured share and the rule never exceeds its limit', () => {
  const state = createThroughputTopologyState();
  const links = [link('a', 5), link('b', 4), link('c', 3)];
  const referred = decideThroughputTopology({ now: 0, links, candidates: ['d'], referrals: ['r'], state, random: () => 0.1, config });
  assert.equal(referred.connect, 'r');
  const full = decideThroughputTopology({ now: 1e7, links: [...links, link('d', 9)].map((entry) => ({ ...entry })), candidates: ['e'], state: createThroughputTopologyState(), random: () => 0, config });
  assert.equal(full.drop.length, 1);
  assert.equal(full.connect, 'e'); // one link was dropped, so a trial slot is free again
  assert.throws(() => decideThroughputTopology({ links }), TypeError);
});
