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

test('after the trial the lowest-flow links beyond the target are dropped', () => {
  const state = createThroughputTopologyState();
  const established = [link('a', 5), link('b', 4), link('c', 3)];
  decideThroughputTopology({ now: 0, links: established, candidates: [], state, config });
  const now = THROUGHPUT_TOPOLOGY_DEFAULTS.trialMs;
  const better = decideThroughputTopology({ now, links: [...established, link('d', 9, 0)], candidates: [], state, config });
  assert.deepEqual(better.drop, ['c']);
  assert.ok(state.cooldown.has('c') && state.established.has('d'));
});

test('a newcomer must beat an established link by the margin, and failures back off', () => {
  const state = createThroughputTopologyState();
  const established = [link('a', 5), link('b', 4), link('c', 3)];
  decideThroughputTopology({ now: 0, links: established, candidates: [], state, config });
  const now = THROUGHPUT_TOPOLOGY_DEFAULTS.trialMs;
  const marginal = decideThroughputTopology({ now, links: [...established, link('d', 3.2, 0)], candidates: [], state, config });
  assert.deepEqual(marginal.drop, ['d']);
  assert.equal(state.exploreDelayMs, 2 * THROUGHPUT_TOPOLOGY_DEFAULTS.exploreIntervalMs);
  state.lastExploreAt = now;
  const soon = decideThroughputTopology({ now: now + THROUGHPUT_TOPOLOGY_DEFAULTS.exploreIntervalMs, links: established, candidates: ['e'], state, random: () => 0, config });
  assert.equal(soon.connect, null);
  const later = decideThroughputTopology({ now: now + 2 * THROUGHPUT_TOPOLOGY_DEFAULTS.exploreIntervalMs, links: established, candidates: ['d', 'e'], state, random: () => 0, config });
  assert.equal(later.connect, 'e'); // d is still in cooldown
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
