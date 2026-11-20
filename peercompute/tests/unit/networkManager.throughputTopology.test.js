import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { NodeKernel, REMOTE_COMPUTE_RESULT_SCHEMA } from '../../src/peercompute/nodeKernel/NodeKernel.js';

const buildAddr = (value) => ({ getComponents: () => [], toString: () => value });

/** A manager in the throughput topology with mocked connections and outbound messages. */
function throughputManager({ connected, known = [], config = {} }) {
  const manager = new NetworkManager({ topology: 'throughput', targetConnections: 2, maxConnections: 3,
    topologyMetric: { x: 0, y: 0, z: 0 }, ...config });
  manager.isConnected = true;
  manager.peerId = 'self';
  manager.bootstrapPeerIds = new Set();
  const start = Date.now() - 60000;
  for (const [index, peerId] of [...connected, ...known].entries()) {
    manager.peers.set(peerId, { peerId, gameId: 'default-game', roomId: 'default-room',
      topologyId: manager.config.topologyId, metricInitialized: true,
      // Opposite of the work ranking, so a spatial rule would choose differently.
      metric: { x: 100 - index, y: 0, z: 0 },
      ...(connected.includes(peerId) ? { connectedAt: start } : {}) });
  }
  const connections = connected.map((peerId, index) => ({
    remotePeer: { toString: () => peerId },
    remoteAddr: buildAddr(`/ip4/10.0.0.${index + 1}/udp/9999/webrtc/p2p/${peerId}`),
    status: 'open',
    close: async function close() { this.status = 'closed'; }
  }));
  manager.libp2p = { getConnections: (peerId) => (peerId
    ? connections.filter((conn) => conn.remotePeer.toString() === peerId) : connections) };
  const sent = [];
  manager.sendToPeer = async (peerId, message) => { sent.push({ peerId, type: message.type }); };
  const open = () => connections.filter((conn) => conn.status === 'open').map((conn) => conn.remotePeer.toString()).sort();
  return { manager, sent, open, start };
}

/** Feed work and advance the manager's clock through its own tick. */
function tickWithWork(manager, now, work = {}) {
  for (const [peerId, units] of Object.entries(work)) manager.recordPeerWork(peerId, units);
  const realNow = Date.now;
  Date.now = () => now;
  try { manager._tickTopology(); } finally { Date.now = realNow; }
}

test('recordPeerWork turns counted work into a smoothed per-peer rate and ignores bad input', () => {
  const { manager, start } = throughputManager({ connected: ['peer-a'] });
  manager.recordPeerWork('peer-a', -1);
  manager.recordPeerWork('', 5);
  manager.recordPeerWork('peer-a', Number.NaN);
  assert.equal(manager.peerWork.size, 0);
  tickWithWork(manager, start + 60000, { 'peer-a': 10 });
  for (let step = 1; step <= 30; step += 1) tickWithWork(manager, start + 60000 + step * 1000, { 'peer-a': 10 });
  const rate = manager.peerWork.get('peer-a').rate;
  assert.ok(Math.abs(rate - 10) < 0.1, `rate settles at 10 units per second, got ${rate}`);
  assert.equal(manager.getNetworkTelemetry?.().peers?.find?.((peer) => peer.peerId === 'peer-a')?.workRate ?? rate, rate);
});

test('the throughput topology keeps the links that carry work, whatever their distance', () => {
  // Three links against a target of two; peer-c is spatially nearest and idle.
  const { manager, open, start } = throughputManager({ connected: ['peer-a', 'peer-b', 'peer-c'] });
  let now = start + 60000;
  for (let step = 0; step < 10; step += 1, now += 1000) tickWithWork(manager, now, { 'peer-a': 5, 'peer-b': 3 });
  assert.deepEqual(open(), ['peer-a', 'peer-b']);
  assert.ok(manager.throughputTopologyState.cooldown.has('peer-c'));
  assert.deepEqual([...manager.topologyController.desiredPeers].sort(), ['peer-a', 'peer-b']);
});

test('a node below its target asks a peer that is short of links to connect', () => {
  const { manager, sent, start } = throughputManager({ connected: ['peer-a'], known: ['peer-full', 'peer-needy'] });
  Object.assign(manager.peers.get('peer-full'), { activeConnections: 3, targetConnections: 2 });
  Object.assign(manager.peers.get('peer-needy'), { activeConnections: 1, targetConnections: 2 });
  tickWithWork(manager, start + 60000);
  assert.deepEqual(sent, [{ peerId: 'peer-needy', type: 'topology-connect-request' }]);
  assert.ok(manager.topologyController.shouldDialPeer('peer-needy'));
});

test('a node at its target trials a peer it already exchanges work with', () => {
  const { manager, sent, start } = throughputManager({ connected: ['peer-a', 'peer-b'], known: ['peer-x', 'peer-y'],
    config: { throughputTopology: { referralShare: 1 } } });
  let now = start + 60000;
  // Hold the first trial back until the work rates have been sampled.
  manager.throughputTopologyState.lastExploreAt = now;
  for (let step = 0; step < 3; step += 1, now += 1000) tickWithWork(manager, now, { 'peer-a': 5, 'peer-b': 3, 'peer-y': 2 });
  assert.deepEqual(sent, []);
  for (let step = 0; step < 2; step += 1, now += 1000) tickWithWork(manager, now, { 'peer-a': 5, 'peer-b': 3, 'peer-y': 2 });
  assert.deepEqual(sent, [{ peerId: 'peer-y', type: 'topology-connect-request' }]);
  // While the link is being negotiated the trial stays open and nothing else is tried.
  assert.equal(manager.throughputTopologyState.trialPeerId, 'peer-y');
  assert.equal(manager.throughputTopologyState.exploreDelayMs, null);
  // If the request expires unanswered, the trial counts as failed.
  manager.pendingTopologyRequests.clear();
  tickWithWork(manager, now + 1000, { 'peer-a': 5, 'peer-b': 3 });
  assert.equal(manager.throughputTopologyState.trialPeerId, null);
  assert.ok(manager.throughputTopologyState.exploreDelayMs > 0);
  assert.ok(manager.throughputTopologyState.cooldown.has('peer-y'));
});

test('a full throughput node refuses a connect request without evicting by distance', () => {
  const { manager, sent, open } = throughputManager({ connected: ['peer-a', 'peer-b', 'peer-c'] });
  manager.peers.set('peer-near', { peerId: 'peer-near', gameId: 'default-game', roomId: 'default-room',
    topologyId: manager.config.topologyId, metricInitialized: true, metric: { x: 0.1, y: 0, z: 0 } });
  for (const peerId of ['peer-a', 'peer-b', 'peer-c']) Object.assign(manager.peers.get(peerId), { activeConnections: 4 });
  manager._handleTopologyConnectRequest('peer-near', { metric: { x: 0.1, y: 0, z: 0 } });
  assert.deepEqual(open(), ['peer-a', 'peer-b', 'peer-c']);
  assert.ok(!sent.some((message) => message.type === 'topology-connect-accept'));
});

test('the emergent topology name keeps its earlier behaviour', () => {
  // NetViz offers 'emergent'. It still selects by position and never prunes.
  const { manager, open, sent, start } = throughputManager({ connected: ['peer-a', 'peer-b', 'peer-c'], known: ['peer-x'],
    config: { topology: 'emergent', connectionRadius: 1000 } });
  let now = start + 60000;
  for (let step = 0; step < 10; step += 1, now += 1000) tickWithWork(manager, now, { 'peer-a': 5, 'peer-b': 3 });
  assert.deepEqual(open(), ['peer-a', 'peer-b', 'peer-c']);
  assert.equal(manager.peerWork.size, 0);
  assert.equal(manager.throughputTopologyState.trialPeerId, null);
  assert.ok(sent.every((message) => message.type === 'topology-connect-request'));
});

test('the distributed topology is unchanged: it still prunes by distance', () => {
  const { manager, open, start } = throughputManager({ connected: ['peer-a', 'peer-b', 'peer-c', 'peer-d'],
    config: { topology: 'distributed', maxConnections: 2, connectionRadius: 1000 } });
  tickWithWork(manager, start + 60000, { 'peer-a': 50, 'peer-b': 50 });
  assert.deepEqual(open(), ['peer-c', 'peer-d']); // the two nearest, despite carrying no work
  // Outside the throughput mode nothing is counted and telemetry is unchanged.
  assert.equal(manager.peerWork.size, 0);
});

test('NodeKernel counts completed remote tasks as work on the peer link, in both directions', async () => {
  const recorded = [];
  const kernel = new NodeKernel({});
  kernel.nodeId = 'node-a';
  kernel.isStarted = true;
  kernel.networkManager = { sendToPeer: async () => {}, recordPeerWork: (peerId, units) => recorded.push([peerId, units]) };
  const task = { id: 't', runtime: 'js', module: '/tasks/example.js', exportName: 'run', data: {} };
  const ok = kernel.submitRemoteComputeTask('peer-b', task, { requestId: 'r1', timeoutMs: 1000 });
  kernel._handleComputeResult('peer-b', { schema: REMOTE_COMPUTE_RESULT_SCHEMA, requestId: 'r1', ok: true, result: { value: 1 } });
  await ok;
  const failed = kernel.submitRemoteComputeTask('peer-b', task, { requestId: 'r2', timeoutMs: 1000 });
  kernel._handleComputeResult('peer-b', { schema: REMOTE_COMPUTE_RESULT_SCHEMA, requestId: 'r2', ok: false, error: { message: 'no' } });
  await assert.rejects(failed);
  assert.deepEqual(recorded, [['peer-b', 1]]);
  // Serving a peer's task counts for the responder once the result is sent;
  // a refused task does not.
  await kernel._handleComputeTask('peer-c', { requestId: 'r3', task });
  assert.deepEqual(recorded, [['peer-b', 1]]);
});
