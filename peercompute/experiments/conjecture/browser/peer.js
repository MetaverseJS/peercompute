// One peer of the browser experiment. The page is driven by browserRun.mjs:
// URL parameters describe the scenario and this peer's place in it.
import { NetworkManager } from '../../../src/peercompute/networkManager/NetworkManager.js';
import { WorkMeshService } from '../../../src/peercompute/networkManager/WorkMeshService.js';
import { createRng, makeScenario } from '../model.js';

const params = new URLSearchParams(location.search);
const number = (name, fallback) => (params.has(name) ? Number(params.get(name)) : fallback);
const index = number('index', 0);
const topology = params.get('topology') || 'distributed';
const scenario = makeScenario({
  name: params.get('scenario') || 'sites', seed: number('seed', 1), nodes: number('nodes', 16),
  regime: params.get('regime') || 'balanced', provisionedSource: params.get('source') === 'provisioned'
});
const self = scenario.nodes[index];
// `metric=random` gives every peer a position unrelated to the scenario, so the
// spatial mode links arbitrary peers: a random-links baseline.
const position = params.get('metric') === 'random'
  ? (() => { const random = createRng(number('seed', 1) * 7907 + index * 104723 + 3); return { x: 200 * random() - 100, y: 200 * random() - 100, z: 0 }; })()
  : self.position;
const status = document.getElementById('status');
const say = (text) => { status.textContent = text; };

const relay = await (await fetch('./relay-config.json', { cache: 'no-store' })).json();
const manager = new NetworkManager({
  topology, topologyId: `conjecture-${params.get('run') || 'run'}`,
  gameId: 'conjecture', roomId: params.get('run') || 'run',
  topicPrefix: 'pc', useScopedTopics: true, enforceTopologyScope: true,
  bootstrapPeers: relay.bootstrapPeers,
  topologyMetric: position, topologyMetricInitialized: true,
  // Every peer is within range, so the spatial mode picks its nearest peers.
  connectionRadius: 1e6, longRangeCount: 1,
  targetConnections: scenario.targetConnections, maxConnections: scenario.maxConnections,
  allowDiscoveryDialWhenIsolated: true, presenceIntervalMs: 3000,
  enableNetworkTelemetry: false, networkTelemetryPublish: false, debugOutput: false
});
await manager.initialize();
await manager.connect();

// Diagnostics for the runner's --debug output.
const trace = { retireOk: 0, retireProtected: 0, retireStreams: 0, retireClosed: 0, opened: 0, closed: 0, requests: 0, accepts: 0, blocking: {} };
const retire = manager._retireIdleConnection.bind(manager);
manager._retireIdleConnection = (connection, reason) => {
  const ok = retire(connection, reason);
  if (reason === 'topology') {
    if (ok) trace.retireOk += 1;
    else if (connection.status !== 'open') trace.retireClosed += 1;
    else if (manager._hasActiveApplicationStreams(connection)) {
      trace.retireStreams += 1;
      for (const stream of connection.streams ?? []) {
        if (['closed', 'aborted', 'reset'].includes(stream.status)) continue;
        const kind = `${String(connection.remoteAddr).includes('/webrtc') ? 'webrtc' : 'circuit'} ${stream.protocol} ${stream.direction} ${stream.status}`;
        trace.blocking[kind] = (trace.blocking[kind] || 0) + 1;
      }
    }
    else trace.retireProtected += 1;
  }
  return ok;
};
manager.libp2p.addEventListener('connection:open', () => { trace.opened += 1; });
manager.libp2p.addEventListener('connection:close', () => { trace.closed += 1; });
const sendToPeer = manager.sendToPeer.bind(manager);
manager.sendToPeer = (peerId, message) => {
  if (message?.type === 'topology-connect-request') trace.requests += 1;
  if (message?.type === 'topology-connect-accept') trace.accepts += 1;
  return sendToPeer(peerId, message);
};

// The runner tells every page which scenario node each peer id is.
const indexOf = new Map();
let egressFree = 0;
const megabytes = (message) => (message.type === 'work' ? message.tasks.length * scenario.task.inMb
  : message.results.length * scenario.task.outMb);
const mesh = new WorkMeshService(manager, {
  // Emulated compute: a task takes 1 / compute seconds on this node.
  execute: (task, done) => setTimeout(() => done(task.payload), 1000 / self.compute),
  // Emulated capacity: hold a payload for its size over the link capacity, with
  // this node's access capacity shared by all of its links.
  shape: (peerId, message) => {
    const other = indexOf.get(peerId);
    if (other === undefined) return 0;
    const now = performance.now(), size = megabytes(message);
    egressFree = Math.max(now, egressFree) + 1000 * size / self.access;
    return Math.max(egressFree - now, 1000 * size / Math.max(scenario.capacity(index, other), 1e-9));
  }
});
await mesh.start();

window.__conjecture = {
  peerId: manager.peerId, index, isSource: index === scenario.source,
  setPeers(entries) { for (const [peerId, peerIndex] of entries) indexOf.set(peerId, peerIndex); },
  submit(count) { mesh.submitJob({ jobId: 'job', tasks: Array.from({ length: count }, (_, n) => n) }); },
  debug() {
    const state = manager.throughputTopologyState;
    const direct = new Set(), relayed = new Set();
    for (const conn of manager._getConnections()) {
      const peer = indexOf.get(conn.remotePeer.toString());
      if (conn.status !== 'open' || peer === undefined) continue;
      const address = String(conn.remoteAddr);
      (!address.includes('/p2p-circuit') || address.includes('/webrtc') ? direct : relayed).add(peer);
    }
    const name = (peerId) => indexOf.get(peerId) ?? '?';
    return { index, known: manager._getScopedPeers().length, direct: [...direct].sort((a, b) => a - b),
      relayedOnly: [...relayed].filter((peer) => !direct.has(peer)).sort((a, b) => a - b),
      meshLinks: mesh.snapshot().peers.map(name), pending: [...manager.pendingTopologyRequests.keys()].map(name),
      rule: { exploreS: state.exploreDelayMs && state.exploreDelayMs / 1000, repairS: state.repairDelayMs / 1000, trial: state.trialPeerId && name(state.trialPeerId),
        established: [...state.established].map(name), cooldown: [...state.cooldown.keys()].map(name) },
      trace,
      work: [...manager.peerWork].map(([peerId, entry]) => [name(peerId), Number(entry.rate.toFixed(1))]) };
  },
  stats() {
    const snapshot = mesh.snapshot();
    return { index, peerId: manager.peerId, returned: snapshot.counters.returned, executed: snapshot.counters.executed,
      duplicates: snapshot.counters.duplicates, reissued: snapshot.counters.reissued, queued: snapshot.queued,
      links: snapshot.peers.map((peerId) => indexOf.get(peerId) ?? -1).sort((a, b) => a - b),
      connections: manager._getConnectionPeers().filter((peer) => !manager.bootstrapPeerIds.has(peer.peerId)).length };
  }
};
setInterval(() => {
  const stats = window.__conjecture.stats();
  say(`peer ${index}${index === scenario.source ? ' (source)' : ''} · ${topology}\ncompute ${self.compute.toFixed(1)} tasks/s · access ${self.access.toFixed(1)} MB/s\n`
    + `links ${JSON.stringify(stats.links)}\nexecuted ${stats.executed} · returned ${stats.returned} · queued ${stats.queued}`);
}, 1000);
document.title = `peer ${index} ready`;
