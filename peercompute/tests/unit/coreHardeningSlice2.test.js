import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager, DIRECT_UNICAST_PROTOCOL } from '../../src/peercompute/networkManager/NetworkManager.js';
import {
  createThroughputProfileScorers,
  createThroughputTopologyState,
  decideThroughputTopology
} from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';
import { TopologyController } from '../../src/peercompute/networkManager/TopologyController.js';
import { NetworkScheduler } from '../../src/peercompute/networkManager/NetworkScheduler.js';
import { WorkMesh, WORK_MESH_SCHEMA } from '../../src/peercompute/workMesh/WorkMesh.js';
import { WorkMeshService } from '../../src/peercompute/networkManager/WorkMeshService.js';

const encoder = new TextEncoder();

test('Slice 2: NetworkManager preserves normalized defaults over raw config, enforces strict scope, and rejects spoofed pubsub senders', async () => {
  const manager = new NetworkManager({
    gameId: 'arena',
    roomId: 'room-1',
    topologyId: 'topo-1',
    pubsubType: 'GOSSIPSUB',
    targetConnections: 10,
    maxConnections: 4,
    enableNetworkTelemetry: false
  });
  assert.equal(manager.config.pubsubType, 'gossipsub', 'normalized pubsubType must not be clobbered by raw config');
  assert.equal(manager.config.targetConnections, 4, 'targetConnections must be clamped <= maxConnections');

  // Strict scope check rejects missing gameId or roomId.
  assert.equal(manager._matchesScope(null), false);
  assert.equal(manager._matchesScope({ payload: { hi: 1 } }), false);
  assert.equal(manager._matchesScope({ gameId: 'arena' }), false);
  assert.equal(manager._matchesScope({ gameId: 'arena', roomId: 'room-1', topologyId: 'topo-1' }), true);

  // Wire pubsub listener on a minimal mock libp2p node to verify sender authentication.
  const pubsubListeners = new Map();
  const received = [];
  manager.peerId = 'self-peer';
  manager.onMessage = (from, payload) => received.push({ from, payload });
  manager.libp2p = {
    addEventListener() {},
    services: {
      pubsub: {
        addEventListener(type, fn) { pubsubListeners.set(type, fn); },
        subscribe() {},
        unsubscribe() {}
      }
    }
  };
  manager._wireLibp2pEvents();
  const onPubsubMsg = pubsubListeners.get('message');
  assert.equal(typeof onPubsubMsg, 'function');

  const topic = manager.config.pubsubTopic;
  const encodeMsg = (obj) => encoder.encode(JSON.stringify(obj));

  // 1) Unsigned pubsub message is rejected.
  onPubsubMsg({
    detail: {
      type: 'unsigned',
      topic,
      data: encodeMsg({ gameId: 'arena', roomId: 'room-1', topologyId: 'topo-1', from: 'victim', payload: { x: 1 } })
    }
  });
  assert.equal(received.length, 0);

  // 2) Signed pubsub message where envelope `from` disagrees with authenticated `detail.from` is rejected.
  onPubsubMsg({
    detail: {
      type: 'signed',
      from: { toString: () => 'attacker-peer' },
      topic,
      data: encodeMsg({ gameId: 'arena', roomId: 'room-1', topologyId: 'topo-1', from: 'victim-peer', payload: { x: 2 } })
    }
  });
  assert.equal(received.length, 0);

  // 3) Signed pubsub message matching authenticated `detail.from` is delivered with verified sender.
  onPubsubMsg({
    detail: {
      type: 'signed',
      from: { toString: () => 'honest-peer' },
      topic,
      data: encodeMsg({ gameId: 'arena', roomId: 'room-1', topologyId: 'topo-1', from: 'honest-peer', payload: { x: 3 } })
    }
  });
  assert.equal(received.length, 1);
  assert.equal(received[0].from, 'honest-peer');
  assert.deepEqual(received[0].payload, { x: 3 });
});

test('Slice 2: NetworkManager _sampleRtt preserves pingService this-binding, unsubscribeTopic unsubscribes libp2p, and _getAnnounceAddrs skips offline relays', async () => {
  const unsubscribed = [];
  const pingCalls = [];
  const manager = new NetworkManager({
    bootstrapPeers: ['/dns4/offline-relay.example/tcp/443/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1'],
    enableNetworkTelemetry: false
  });
  manager.peerId = '12D3KooWPjceQrSwdWXPyLLeABRXmuqt69Rg3sBYbU1Nft9HyQ6X';
  const pingService = {
    marker: 'bound-ok',
    async ping(target) {
      assert.equal(this.marker, 'bound-ok', 'ping() must keep `this` bound to pingService');
      pingCalls.push(target.toString());
      return 12.4;
    }
  };
  manager.libp2p = {
    getMultiaddrs: () => [],
    getConnections: () => [],
    services: {
      ping: pingService,
      pubsub: {
        subscribe() {},
        unsubscribe(topic) { unsubscribed.push(topic); }
      }
    }
  };

  // Offline bootstrap relay must NOT appear in synthesized announce addrs.
  assert.deepEqual(manager._getAnnounceAddrs(), []);

  // subscribeTopic / unsubscribeTopic removes topic from libp2p pubsub.
  const unsub = manager.subscribeTopic('pc.custom.chat', () => {});
  unsub();
  assert.deepEqual(unsubscribed, ['pc.custom.chat']);
  assert.equal(manager.additionalPubsubTopics.has('pc.custom.chat'), false);

  // _sampleRtt preserves `this` binding and does not resurrect removed peers.
  const peerStr = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
  manager.peers.set(peerStr, { peerId: peerStr, via: 'webrtc' });
  manager._sampleRtt(Date.now(), [{ peerId: peerStr }]);
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual(pingCalls, [peerStr]);
  assert.equal(manager.peers.get(peerStr)?.rttMs, 12);
});

test('Slice 2: ThroughputTopologyPolicy reads NodeKernel nested capabilities, blocks RFC1918 LAN spoofing, and avoids double cooldown', () => {
  const peers = {
    gpuWorkstation: {
      icePath: 'nat-srflx',
      rttMs: 25,
      capabilities: {
        compute: {
          resourceTier: 'high',
          gpuAvailable: true,
          webgpuAvailable: true,
          gpuHardwareVerified: true,
          cpuCores: 16,
          gpuComputeScore: 500
        }
      }
    },
    weakCpu: {
      icePath: 'nat-srflx',
      rttMs: 25,
      capabilities: {
        compute: {
          resourceTier: 'low',
          gpuAvailable: false,
          webgpuAvailable: false,
          cpuCores: 2
        }
      }
    },
    wanSpoofer: {
      icePath: 'turn-relay',
      rttMs: 120,
      hostGroupId: 'attacker-net',
      multiaddrs: ['/ip4/192.168.1.5/tcp/8080/ws/p2p/wanSpoofer']
    },
    trueLan: {
      icePath: 'lan-host',
      rttMs: 2,
      hostGroupId: 'home-lan'
    }
  };

  // Nested NodeKernel capabilities schema works with capability-weighted scorers.
  const cap = createThroughputProfileScorers('capability-weighted', (id) => peers[id]);
  assert.ok(cap.scoreCandidate('gpuWorkstation') > cap.scoreCandidate('weakCpu') + 1.0);

  // WAN spoofer advertising RFC1918 multiaddr must NOT get LAN boost.
  const lan = createThroughputProfileScorers('lan-first', (id) => peers[id], { localHostGroupId: 'home-lan' });
  assert.ok(lan.scoreLink({ peerId: 'trueLan', flow: 10 }) > lan.scoreLink({ peerId: 'wanSpoofer', flow: 10 }) * 2);

  // Failed trial link dropped in the same tick must only increment failCounts ONCE (no double cooldown).
  const state = createThroughputTopologyState();
  const baseLinks = [
    { peerId: 'a', flow: 5, since: -1e6 },
    { peerId: 'b', flow: 5, since: -1e6 }
  ];
  const d1 = decideThroughputTopology({
    now: 0,
    links: baseLinks,
    candidates: ['trial-peer'],
    state,
    random: () => 0,
    config: { targetConnections: 2, maxConnections: 3, maxCooldownMultiplier: 8 }
  });
  assert.equal(d1.connect, 'trial-peer');
  const d2 = decideThroughputTopology({
    now: 10000,
    links: [...baseLinks, { peerId: 'trial-peer', flow: 0, since: 0 }],
    candidates: [],
    state,
    random: () => 0,
    config: { targetConnections: 2, maxConnections: 3, maxCooldownMultiplier: 8 }
  });
  assert.deepEqual(d2.drop, ['trial-peer']);
  assert.equal(state.failCounts.get('trial-peer'), 1, 'failed trial must increment failCounts exactly once');
});

test('Slice 2: TopologyController reserves small-world long-range slots and rotates across refresh epochs', () => {
  const controller = new TopologyController({
    peerId: 'self-node',
    topologyId: 'topo-1',
    targetConnections: 3,
    maxConnections: 3,
    connectionRadius: 5,
    longRangeCount: 1,
    longRangeRefreshMs: 1000,
    metric: { x: 0, y: 0, z: 0 }
  });

  const peers = [
    { peerId: 'local-1', topologyId: 'topo-1', metric: { x: 1, y: 0, z: 0 } },
    { peerId: 'local-2', topologyId: 'topo-1', metric: { x: 2, y: 0, z: 0 } },
    { peerId: 'local-3', topologyId: 'topo-1', metric: { x: 3, y: 0, z: 0 } },
    { peerId: 'far-1', topologyId: 'topo-1', metric: { x: 50, y: 0, z: 0 } },
    { peerId: 'far-2', topologyId: 'topo-1', metric: { x: 60, y: 0, z: 0 } },
    { peerId: 'far-3', topologyId: 'topo-1', metric: { x: 70, y: 0, z: 0 } },
    { peerId: 'far-4', topologyId: 'topo-1', metric: { x: 80, y: 0, z: 0 } }
  ];

  const seenFar = new Set();
  for (let epoch = 0; epoch < 12; epoch += 1) {
    const desired = controller.computeDesiredPeers({ peers, connections: [], now: epoch * 1500 });
    assert.equal(desired.size, 3);
    const farChosen = [...desired].filter((id) => id.startsWith('far-'));
    assert.equal(farChosen.length, 1, 'dense local cluster must not starve the reserved small-world slot');
    seenFar.add(farChosen[0]);
  }
  assert.ok(seenFar.size >= 2, `longRangeRefreshMs must rotate long-range peers across epochs, saw: ${[...seenFar].join(',')}`);
});

test('Slice 2: NetworkScheduler uses local clock for RX, deduplicates retransmitted reliable events, and enforces snapshotsRequireAuthority', () => {
  const delivered = [];
  const acks = [];
  let stateCollects = 0;
  const scheduler = new NetworkScheduler({
    sendSnapshot: () => {},
    sendCommand: () => {},
    sendEvent: (msg) => acks.push(msg),
    getPeerId: () => 'client-1',
    getAuthority: () => 'host-1',
    getGameId: () => 'g',
    getRoomId: () => 'r',
    isInScope: () => true
  }, { snapshotsRequireAuthority: true });

  scheduler.registerStateProvider(() => {
    stateCollects += 1;
    return { v: 1 };
  });
  scheduler.tick(1000);
  assert.equal(stateCollects, 0, 'non-authority peer must not invoke state providers when snapshotsRequireAuthority is true');

  const unsub = scheduler.addEventHandler((peerId, msg) => delivered.push({ peerId, payload: msg.payload }));
  const before = Date.now();
  const evtMsg = {
    type: 'pc-event',
    header: { ts: 999999999999999, peerId: 'peer-x' },
    payload: [{ id: 'rel-1', reliable: true, payload: { a: 1 } }]
  };
  scheduler.handleMessage(evtMsg, 'peer-x');
  assert.ok(scheduler.lastRxAt <= Date.now() + 100 && scheduler.lastRxAt >= before - 10, 'lastRxAt must use local clock, not remote header.ts');
  assert.equal(delivered.length, 1);
  assert.equal(acks.length, 1);

  // Retransmitted reliable event is ACKed again but NOT re-delivered to handlers.
  scheduler.handleMessage(evtMsg, 'peer-x');
  assert.equal(delivered.length, 1);
  assert.equal(acks.length, 2);

  unsub();
  scheduler.handleMessage({ type: 'pc-event', payload: [{ id: 'rel-2', reliable: true, payload: { a: 2 } }] }, 'peer-x');
  assert.equal(delivered.length, 1);
});

test('Slice 2: WorkMesh validates taskId bounds, rejects pending jobs on destroy, isolates throwing execute, and WorkMeshService reports real inFlight', async () => {
  let executeCalls = 0;
  const mesh = new WorkMesh({
    nodeId: 'origin',
    send() {},
    execute(task, done) {
      executeCalls += 1;
      if (task.payload === 'throw') throw new Error('boom');
      done(task.payload * 10);
    }
  });
  mesh.linkUp('peer-1');

  const jobPromise = mesh.submitJob({ jobId: 'job-1', tasks: [1, 2] });
  // Out-of-range / invalid taskIds from remote peer must be ignored without corrupting job.remaining.
  mesh.receive('peer-1', {
    schema: WORK_MESH_SCHEMA,
    type: 'results',
    results: [
      { jobId: 'job-1', taskId: -1, value: 'bad' },
      { jobId: 'job-1', taskId: 99, value: 'bad' },
      { jobId: 'job-1', taskId: '0', value: 'bad' },
      { jobId: 'job-1', taskId: 0, value: 100 }
    ]
  });
  assert.equal(mesh.jobs.get('job-1').remaining, 1);
  assert.equal(mesh.jobs.get('job-1').values.length, 2);

  // Destroy rejects unfinished job cleanly.
  mesh.destroy();
  await assert.rejects(jobPromise, /destroyed/);

  // Throwing execute does not permanently leak `running`.
  const mesh2 = new WorkMesh({
    nodeId: 'n2',
    send() {},
    execute(task, done) {
      if (task.payload === 'throw') throw new Error('sync throw');
      done(task.payload);
    }
  });
  mesh2.queue.push({ jobId: 'j2', taskId: 0, origin: 'other', payload: 'throw' });
  mesh2._pump();
  assert.equal(mesh2.running, 0);
  mesh2.destroy();

  // WorkMeshService getPeerTelemetry reports actual link.work + link.results lengths.
  const fakeManager = {
    peerId: 'svc-a',
    bootstrapPeerIds: new Set(),
    peerWork: new Map([['svc-b', { rate: 12.5 }]]),
    libp2p: { handle: async () => {}, unhandle: async () => {} },
    _getConnectionPeers: () => [],
    _getConnectionsForPeer: () => []
  };
  const service = new WorkMeshService(fakeManager, { execute: (_, done) => done(1) });
  service.peers.set('svc-b', { outbox: [], out: null, opening: false, writing: false });
  service.mesh.linkUp('svc-b');
  service.mesh.links.get('svc-b').work = [{}, {}];
  service.mesh.links.get('svc-b').results = [{}];
  const telem = service.getPeerTelemetry('svc-b');
  assert.equal(telem.inFlight, 3);
  assert.equal(telem.tasksPerSec, 12.5);
  await service.stop();
});
