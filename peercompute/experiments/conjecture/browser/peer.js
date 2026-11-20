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
const trace = { retireOk: 0, retireProtected: 0, retireStreams: 0, retireClosed: 0, opened: 0, closed: 0, requests: 0, accepts: 0, blocking: {}, retired: {}, closedKinds: {}, meshDrops: {}, openedKinds: {}, dials: {} };
const retire = manager._retireIdleConnection.bind(manager);
manager._retireIdleConnection = (connection, reason) => {
  const ok = retire(connection, reason);
  if (ok) {
    const kind = `${reason} ${String(connection.remoteAddr).includes('/webrtc') ? 'webrtc' : String(connection.remoteAddr).includes('/p2p-circuit') ? 'circuit' : 'other'}`;
    trace.retired[kind] = (trace.retired[kind] || 0) + 1;
  }
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
manager.libp2p.addEventListener('connection:open', (event) => {
  trace.opened += 1;
  const conn = event.detail;
  const address = String(conn?.remoteAddr ?? '');
  const kind = address.includes('/webrtc') ? 'webrtc' : address.includes('/p2p-circuit') ? 'circuit' : 'other';
  const peerId = conn?.remotePeer?.toString?.();
  const wanted = manager.bootstrapPeerIds.has(peerId) ? 'relay' : manager.topologyController?.desiredPeers?.has(peerId) ? 'wanted' : 'unwanted';
  const key = `${kind} ${conn?.direction} ${wanted}`;
  trace.openedKinds[key] = (trace.openedKinds[key] || 0) + 1;
});
manager.libp2p.addEventListener('connection:close', (event) => {
  trace.closed += 1;
  const address = String(event.detail?.remoteAddr ?? '');
  const kind = address.includes('/webrtc') ? 'webrtc' : address.includes('/p2p-circuit') ? 'circuit' : 'other';
  trace.closedKinds[kind] = (trace.closedKinds[kind] || 0) + 1;
});
const dialAfterAccept = {};
const maybeDial = manager._maybeDialPeer.bind(manager);
manager._maybeDialPeer = (peerId, source, ...rest) => {
  trace.dials[source] = (trace.dials[source] || 0) + 1;
  if (source === 'topology-accept') {
    const now = Date.now();
    const active = manager._getConnectionsForPeer(peerId);
    const why = manager.peerConnectionRecovery?.pending.has(peerId) ? 'recovery pending'
      : active.some((conn) => String(conn.remoteAddr).includes('/webrtc')) ? 'already direct'
        : !manager._hasAvailableLogicalPeerSlot(peerId, now) ? 'no logical slot'
          : manager._getDialBackoffEntry(peerId, now) ? 'dial backoff'
            : now - (manager.recentDialAttempts.get(peerId) || 0) < 5000 ? 'throttled' : 'dialled';
    dialAfterAccept[why] = (dialAfterAccept[why] || 0) + 1;
    if (why === 'dialled') {
      const started = now;
      const check = setInterval(() => {
        const direct = manager._getConnectionsForPeer(peerId).some((conn) => conn.status === 'open' && String(conn.remoteAddr).includes('/webrtc'));
        const waited = Date.now() - started;
        if (direct || waited > 30000) {
          clearInterval(check);
          const bucket = direct ? `direct in ${Math.ceil(waited / 5000) * 5}s` : 'no direct link in 30s';
          dialAfterAccept[bucket] = (dialAfterAccept[bucket] || 0) + 1;
        }
      }, 250);
    }
  }
  return maybeDial(peerId, source, ...rest);
};
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
// Why the scheduler lets go of a link.
const drop = mesh._drop.bind(mesh), release = mesh._release.bind(mesh);
let releasing = false;
mesh._release = (peerId) => { releasing = true; try { release(peerId); } finally { releasing = false; } };
mesh._drop = (peerId) => {
  if (mesh.peers.has(peerId)) {
    const why = releasing ? 'released by topology' : mesh._directConnection(peerId) ? 'stream failed' : 'connection gone';
    trace.meshDrops[why] = (trace.meshDrops[why] || 0) + 1;
  }
  drop(peerId);
};

// Follow the throughput rule's trials: how many start, and how each ends.
const trials = { started: 0, kept: 0, noGain: 0, neverLinked: 0 };
let watched = null;
setInterval(() => {
  const state = manager.throughputTopologyState;
  const direct = (peerId) => Boolean(mesh._directConnection(peerId));
  if (!watched && state.trialPeerId) { watched = { peerId: state.trialPeerId, linked: false }; trials.started += 1; }
  if (watched) {
    watched.linked = watched.linked || direct(watched.peerId);
    if (state.trialPeerId !== watched.peerId) {
      if (state.established.has(watched.peerId)) trials.kept += 1;
      else if (watched.linked) trials.noGain += 1;
      else trials.neverLinked += 1;
      watched = null;
    }
  }
}, 250);

window.__conjecture = {
  peerId: manager.peerId, index, isSource: index === scenario.source,
  setPeers(entries) { for (const [peerId, peerIndex] of entries) indexOf.set(peerId, peerIndex); },
  // For the fixed-link baselines: the peer ids this peer must hold links to.
  setStatic(peerIds) { manager.setStaticTopologyPeers(peerIds); },
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
      trace, trials, dialAfterAccept,
      scheduler: { queue: mesh.mesh.queue.length, running: mesh.mesh.running, results: mesh.mesh.results.length, rate: Number(mesh.mesh.rate.toFixed(2)),
        distances: [...mesh.mesh.distances].map(([job, value]) => [job, Number(value.toFixed(4))]), counters: mesh.mesh.counters,
        links: [...mesh.mesh.links].map(([peerId, link]) => ({ peer: name(peerId), queued: link.queued, rate: Number(link.rate.toFixed(2)), cost: Number(link.cost.toFixed(4)),
          distance: [...link.distances.values()].map((value) => Number(value.toFixed(4))), work: link.work?.length ?? 0, results: link.results?.length ?? 0 })),
        outbox: [...mesh.peers].map(([peerId, peer]) => [name(peerId), peer.outbox.length, Boolean(peer.out), peer.opening, peer.writing]) },
      work: [...manager.peerWork].map(([peerId, entry]) => [name(peerId), Number(entry.rate.toFixed(1))]) };
  },
  stats() {
    const snapshot = mesh.snapshot();
    return { index, peerId: manager.peerId, returned: snapshot.counters.returned, executed: snapshot.counters.executed,
      duplicates: snapshot.counters.duplicates, reissued: snapshot.counters.reissued, queued: snapshot.queued,
      streamResets: snapshot.streamResets,
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
