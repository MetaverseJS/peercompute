import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NETVIZ_ANALYSIS_SCHEMA,
  RollingMetricsHistory,
  buildAnalysisSnapshot,
  buildSparklinePath,
  buildSubgroupClusters,
  computeGraphDiagnostics
} from '../src/networkAnalysis.js';
import { buildObservedNetwork, describeObservedPeer } from '../src/observedNetwork.js';

const now = 2_000_000;
const makeReport = (peerId, fields = {}) => ({
  peerId,
  application: 'cubechat',
  role: 'world',
  gameId: 'cubechat',
  roomId: 'room-alpha',
  topologyId: 'cubechat',
  topology: 'distributed',
  targetConnections: 2,
  maxConnections: 4,
  receivedAt: now,
  ts: now,
  peers: [],
  models: [],
  ...fields
});

test('buildObservedNetwork merges second endpoint ICE path, RTT, counts, and WorkMesh fields without discarding them', () => {
  const reports = [
    makeReport('peer-a', {
      peers: [{ peerId: 'peer-b', via: 'relay-webrtc', mediaPath: 'unknown', rxBps: 100, txBps: 200, rxCount: 10, txCount: 20 }]
    }),
    makeReport('peer-b', {
      peers: [{
        peerId: 'peer-a',
        via: 'webrtc',
        signalingPath: 'direct',
        mediaPath: 'direct',
        icePath: 'lan-host',
        iceProtocol: 'udp',
        candidatePairRttMs: 3,
        rttMs: 4,
        direction: 'inbound',
        duplicateConnections: true,
        workRate: 12.5,
        workMesh: { tasksPerSec: 12.5, linkCost: 4.2, inFlight: 3, streamResets: 1 },
        rxBps: 200,
        txBps: 100,
        rxCount: 20,
        txCount: 10
      }]
    })
  ];
  const view = buildObservedNetwork(reports, { now });
  assert.equal(view.edges.length, 1);
  const edge = view.edges[0];
  assert.equal(edge.via, 'webrtc');
  assert.equal(edge.mediaPath, 'direct');
  assert.equal(edge.icePath, 'lan-host');
  assert.equal(edge.iceProtocol, 'udp');
  assert.equal(edge.candidatePairRttMs, 3);
  assert.equal(edge.rttMs, 4);
  assert.equal(edge.duplicateConnections, true);
  assert.equal(edge.workRate, 12.5);
  assert.equal(edge.workMesh.streamResets, 1);
  assert.equal(view.workMeshEdges.length, 1);
});

test('computeGraphDiagnostics detects partitions, Relay-Off Resilience, bridges, cut vertices, and relay audit', () => {
  const relayId = 'relay-1';
  // Two clusters: (a-b-c triangle) joined to (d-e) via single bridge edge c-d,
  // plus f connected ONLY to relay-1 (relay-dependent / would split without relay).
  const reports = [
    makeReport('a', {
      peers: [
        { peerId: 'b', via: 'webrtc', icePath: 'lan-host', rttMs: 2 },
        { peerId: 'c', via: 'webrtc', icePath: 'lan-host', rttMs: 4 },
        { peerId: relayId, via: 'direct', icePath: 'direct-ws', rttMs: 30 }
      ],
      relayState: { connected: true, role: 'keeper', keepReason: 'retention-keeper', relayPeerId: relayId, gossipMeshCount: 2, directMeshPeerCount: 2, minDirectMeshPeers: 2 },
      gossipMeshPeers: ['b', 'c'],
      rewiresPerMin: 1,
      dialFailures: 0
    }),
    makeReport('b', {
      peers: [
        { peerId: 'a', via: 'webrtc', icePath: 'lan-host', rttMs: 2 },
        { peerId: 'c', via: 'webrtc', icePath: 'nat-srflx', rttMs: 18 }
      ],
      relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 2, directMeshPeerCount: 2, minDirectMeshPeers: 2 },
      gossipMeshPeers: ['a', 'c']
    }),
    makeReport('c', {
      peers: [
        { peerId: 'a', via: 'webrtc', icePath: 'lan-host', rttMs: 4 },
        { peerId: 'b', via: 'webrtc', icePath: 'nat-srflx', rttMs: 18 },
        { peerId: 'd', via: 'webrtc', icePath: 'turn-relay', mediaPath: 'turn-relay', rttMs: 95 }
      ],
      relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 2, directMeshPeerCount: 2, minDirectMeshPeers: 2 }
    }),
    makeReport('d', {
      peers: [
        { peerId: 'c', via: 'webrtc', icePath: 'turn-relay', mediaPath: 'turn-relay', rttMs: 95 },
        { peerId: 'e', via: 'webrtc', icePath: 'lan-host', rttMs: 3 }
      ],
      relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 1, directMeshPeerCount: 1, minDirectMeshPeers: 2 }
    }),
    makeReport('e', {
      peers: [{ peerId: 'd', via: 'webrtc', icePath: 'lan-host', rttMs: 3 }],
      relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 1, directMeshPeerCount: 1, minDirectMeshPeers: 2 }
    }),
    makeReport('f', {
      peers: [{ peerId: relayId, via: 'direct', icePath: 'direct-ws', rttMs: 40 }],
      relayState: { connected: true, role: 'holding', keepReason: 'no-direct', relayPeerId: relayId, gossipMeshCount: 0, directMeshPeerCount: 0, minDirectMeshPeers: 2 },
      dialFailures: 3
    })
  ];

  const view = buildObservedNetwork(reports, { now, relayIds: new Set([relayId]) });
  const diag = view.diagnostics;

  assert.equal(diag.nodeCount, 6);
  assert.equal(diag.componentCountWithRelay, 1, 'with relay all 6 peers are connected');
  assert.equal(diag.componentCount, 2, 'without relay peer f splits off');
  assert.equal(diag.isPartitioned, true);
  assert.equal(diag.wouldPartitionWithoutRelay, true);
  assert.deepEqual(diag.isolatedPeers, ['f']);
  assert.deepEqual(diag.relayDependentPeers, ['f']);
  assert.deepEqual(diag.bridgeEdgeKeys, ['c|d', 'd|e']);
  assert.deepEqual(diag.cutPeerIds, ['c', 'd']);
  assert.equal(diag.pathMix['lan-host'], 3);
  assert.equal(diag.pathMix['nat-srflx'], 1);
  assert.equal(diag.pathMix['turn-relay'], 1);
  assert.equal(diag.relayAudit.connectedPeers, 2);
  assert.equal(diag.relayAudit.keeperCount, 1);
  assert.equal(diag.relayAudit.keepReasonCounts['retention-keeper'], 1);
  assert.equal(diag.relayAudit.keepReasonCounts['no-direct'], 1);
  assert.equal(diag.totalDialFailures, 3);
  assert.equal(diag.totalRewiresPerMin, 1);
  assert.equal(view.gossipEdges.length, 3);
});

test('buildSubgroupClusters groups by room, relay, topology, and transport and supports non-disruptive focus filter', () => {
  const relayId = 'relay-1';
  const reports = [
    makeReport('c1', { application: 'cubechat', roomId: 'lobby', topology: 'distributed', peers: [{ peerId: 'c2', via: 'webrtc', icePath: 'lan-host' }] }),
    makeReport('c2', { application: 'cubechat', roomId: 'lobby', topology: 'distributed', peers: [{ peerId: 'c1', via: 'webrtc', icePath: 'lan-host' }] }),
    makeReport('i1', {
      application: 'inference',
      roomId: 'models',
      topology: 'throughput',
      relayState: { connected: true, role: 'keeper', keepReason: 'retention-keeper', relayPeerId: relayId, gossipMeshCount: 1, directMeshPeerCount: 1, minDirectMeshPeers: 1 },
      peers: [{ peerId: 'i2', via: 'webrtc', icePath: 'turn-relay', mediaPath: 'turn-relay', workRate: 4.5 }]
    }),
    makeReport('i2', {
      application: 'inference',
      roomId: 'models',
      topology: 'throughput',
      relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 1, directMeshPeerCount: 1, minDirectMeshPeers: 1 },
      peers: [{ peerId: 'i1', via: 'webrtc', icePath: 'turn-relay', mediaPath: 'turn-relay', workRate: 4.5 }]
    })
  ];

  const byRoom = buildObservedNetwork(reports, { now, groupBy: 'room', relayIds: new Set([relayId]) });
  assert.equal(byRoom.subgroups.length, 2);
  const cubeGroup = byRoom.subgroups.find((g) => g.label.includes('cubechat'));
  assert.equal(cubeGroup.peerCount, 2);
  assert.equal(cubeGroup.lanEdgeCount, 1);

  // Focusing one subgroup filters visible peers without losing full subgroup inventory.
  const focused = buildObservedNetwork(reports, { now, groupBy: 'room', subgroup: cubeGroup.id, relayIds: new Set([relayId]) });
  assert.deepEqual(focused.peers.map((p) => p.peerId).sort(), ['c1', 'c2']);
  assert.equal(focused.subgroups.length, 2);

  const byTopo = buildSubgroupClusters(byRoom.peers, byRoom.edges, { groupBy: 'topology', relayIds: new Set([relayId]) });
  assert.equal(byTopo.clusters.length, 2);

  const byTransport = buildSubgroupClusters(byRoom.peers, byRoom.edges, { groupBy: 'transport', relayIds: new Set([relayId]) });
  assert.ok(byTransport.clusters.some((c) => c.id === 'transport:lan-host'));
  assert.ok(byTransport.clusters.some((c) => c.id === 'transport:turn-relay'));

  const byRelay = buildSubgroupClusters(byRoom.peers, byRoom.edges, { groupBy: 'relay', relayIds: new Set([relayId]) });
  assert.ok(byRelay.clusters.some((c) => c.id === `relay:${relayId}`));
  assert.ok(byRelay.clusters.some((c) => c.id === 'relay:off-relay'));

  // describeObservedPeer includes relay & hardware summaries cleanly.
  const desc = describeObservedPeer(
    { ...reports[2], capabilities: { resourceTier: 'workstation', cpuCores: 16, gpuAvailable: true, gpuHardwareVerified: true } },
    now
  );
  assert.match(desc.lines.join('\n'), /Relay: connected · role=keeper · reason=retention-keeper/);
  assert.match(desc.lines.join('\n'), /Hardware: tier=workstation/);
});

test('RollingMetricsHistory, sparklines, and JSON snapshot export are deterministic and bounded', () => {
  const history = new RollingMetricsHistory({ maxSamples: 10, minIntervalMs: 500 });
  const diag = computeGraphDiagnostics([], []);
  for (let i = 0; i < 15; i += 1) {
    history.record({ ...diag, nodeCount: i + 1, directPct: 50 + i }, 1000 + i * 1000);
  }
  const samples = history.list();
  assert.equal(samples.length, 10);
  assert.equal(samples[0].nodeCount, 6);
  assert.equal(samples[9].nodeCount, 15);

  const svgPath = buildSparklinePath(samples.map((s) => s.nodeCount), 110, 22);
  assert.match(svgPath, /^M[\d.]+,[\d.]+( L[\d.]+,[\d.]+)+$/);

  const snapshot = buildAnalysisSnapshot({
    viewMode: 'all',
    groupBy: 'room',
    colorLens: 'transport',
    diagnostics: diag,
    subgroups: [],
    history: samples,
    now
  });
  assert.equal(snapshot.schema, NETVIZ_ANALYSIS_SCHEMA);
  assert.equal(snapshot.history.length, 10);
  assert.equal(snapshot.colorLens, 'transport');
});
