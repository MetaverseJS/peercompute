import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager, DIRECT_UNICAST_PROTOCOL } from '../../src/peercompute/networkManager/NetworkManager.js';
import {
  createThroughputProfileScorers,
  createThroughputTopologyState,
  decideThroughputTopology
} from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';
import { WorkMesh } from '../../src/peercompute/workMesh/WorkMesh.js';
import { WorkMeshService } from '../../src/peercompute/networkManager/WorkMeshService.js';

test('NetworkManager treats DIRECT_UNICAST_PROTOCOL as maintenance and skips direct-drop-recovery under throughput topology', () => {
  const manager = new NetworkManager({
    topology: 'throughput',
    enableNetworkTelemetry: false
  });
  manager.peerId = 'peer-self';
  const connWithDirectOnly = {
    status: 'open',
    remoteAddr: { toString: () => '/ip4/192.168.1.20/udp/4001/webrtc/p2p/peer-b' },
    streams: [{ protocol: DIRECT_UNICAST_PROTOCOL, status: 'open' }]
  };
  assert.equal(manager._hasActiveApplicationStreams(connWithDirectOnly), false,
    'persistent /peercompute/direct/1.0.0 stream must not pin an idle topology neighbor');

  const connWithAppStream = {
    status: 'open',
    remoteAddr: { toString: () => '/ip4/192.168.1.20/udp/4001/webrtc/p2p/peer-b' },
    streams: [{ protocol: '/peercompute/inference/4.0.0', status: 'open' }]
  };
  assert.equal(manager._hasActiveApplicationStreams(connWithAppStream), true);
  assert.equal(manager.config.enableRelayDirectPeers, false,
    'asymmetric client->relay gossipsub directPeers must default to false so browsers never PRUNE relay GRAFTs');
});

test('WorkMeshService selects primary direct connection deterministically and drops cleanly when connection is gone', async (t) => {
  const openConns = [
    { id: 'c-relay-rtc', status: 'open', direction: 'outbound', remoteAddr: '/dns4/r/tcp/443/wss/p2p/R/p2p-circuit/webrtc/p2p/peer-b', timeline: { open: 100 } },
    { id: 'c-true-direct', status: 'open', direction: 'inbound', remoteAddr: '/ip4/192.168.1.22/udp/4001/webrtc/p2p/peer-b', timeline: { open: 200 } }
  ];
  let live = true;
  const manager = {
    peerId: 'peer-a',
    bootstrapPeerIds: new Set(),
    recordPeerWork: () => {},
    recordPeerBytes: () => {},
    libp2p: { handle: async () => {}, unhandle: async () => {} },
    _getConnectionPeers: () => (live ? [{ peerId: 'peer-b' }] : []),
    _getConnectionsForPeer: () => (live ? openConns : [])
  };
  const service = new WorkMeshService(manager, {
    tickMs: 1e9,
    channel: (stream) => stream,
    execute: (task, done) => done(task.payload)
  });
  t.after(() => service.stop());
  assert.equal(service._directConnection('peer-b').id, 'c-true-direct',
    'WorkMeshService must prefer true direct over relay-webrtc to match duplicate-connection pruner');

  // Simulate remote peer closing the connection while a write is attempted:
  // should drop cleanly WITHOUT counting a bogus streamReset.
  service.peers.set('peer-b', {
    outbox: [{ schema: 's', type: 'state', queued: 0 }],
    out: { write: async () => { live = false; throw new Error('connection closed'); }, abort() {} },
    opening: false,
    writing: false
  });
  service.mesh.linkUp('peer-b');
  await service._flush('peer-b', service.peers.get('peer-b'));
  assert.equal(service.peers.has('peer-b'), false);
  assert.equal(service.snapshot().streamResets, 0, 'closing a dead connection must not increment streamResets');
});

test('WorkMesh scales effective batch and buffer headroom adaptively for high-rate gateways while respecting explicit overrides', () => {
  const auto = new WorkMesh({ nodeId: 'gw', send() {}, execute() {} });
  assert.equal(auto._effectiveWorkBatch(), 8);
  assert.equal(auto._effectiveResultBuffer(), 16);
  auto.rate = 80;
  assert.equal(auto._effectiveWorkBatch(), 12);
  assert.equal(auto._effectiveResultBatch(), 24);
  assert.equal(auto._effectiveResultBuffer(), 48);

  const explicit = new WorkMesh({ nodeId: 'capped', send() {}, execute() {}, config: { workBatch: 4, resultBuffer: 4 } });
  explicit.rate = 100;
  assert.equal(explicit._effectiveWorkBatch(), 4);
  assert.equal(explicit._effectiveResultBuffer(), 4);
});

test('ThroughputTopologyPolicy avoids single-peer stampede across top-band candidates while preserving exploratory bridges', () => {
  const peers = {
    gpu1: { capabilities: { gpuTier: 'high', webgpu: true, cores: 16 }, rttMs: 10 },
    gpu2: { capabilities: { gpuTier: 'high', webgpu: true, cores: 16 }, rttMs: 12 },
    gpu3: { capabilities: { gpuTier: 'high', webgpu: true, cores: 12 }, rttMs: 14 },
    cpu1: { capabilities: { gpuTier: 'low', cores: 2 }, rttMs: 80 },
    cpu2: { capabilities: { gpuTier: 'low', cores: 2 }, rttMs: 90 },
    cpu3: { capabilities: { gpuTier: 'low', cores: 2 }, rttMs: 100 }
  };
  const scorers = createThroughputProfileScorers('capability-weighted', (id) => peers[id]);
  const chosen = new Set();
  for (let i = 0; i < 40; i += 1) {
    const state = createThroughputTopologyState();
    const d = decideThroughputTopology({
      now: 1000,
      links: [],
      candidates: Object.keys(peers),
      state,
      random: () => (i + 0.5) / 40,
      config: { targetConnections: 2, scoreLink: scorers.scoreLink, scoreCandidate: scorers.scoreCandidate }
    });
    if (d.connect) chosen.add(d.connect);
  }
  assert.ok(chosen.has('gpu1') && chosen.has('gpu2'),
    `expected top-band sampling to spread across top peers, got ${[...chosen].join(',')}`);
  assert.ok(chosen.size >= 3, `expected anti-herd diversity + exploratory share, got ${[...chosen].join(',')}`);
});
