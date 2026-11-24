import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { gossipsub } from '@libp2p/gossipsub';
import { multiaddr } from '@multiformats/multiaddr';
import { NetworkManager, DIRECT_UNICAST_PROTOCOL } from '../../src/peercompute/networkManager/NetworkManager.js';
import {
  THROUGHPUT_TOPOLOGY_PROFILES,
  createThroughputProfileScorers,
  createThroughputTopologyState,
  decideThroughputTopology
} from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';
import { WorkMesh } from '../../src/peercompute/workMesh/WorkMesh.js';
import { WorkMeshService, WORK_MESH_PROTOCOL } from '../../src/peercompute/networkManager/WorkMeshService.js';
import { createNativeCompanion } from '../../src/host/native/NativeCompanion.js';

test('sendToPeer uses /peercompute/direct/1.0.0 over real libp2p direct connections and falls back to pubsub otherwise', { timeout: 15000 }, async (t) => {
  const receivedB = [];
  const publishedA = [];

  const nodeB = await createLibp2p({
    start: false,
    addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: { identify: identify() },
    connectionGater: { denyDialMultiaddr: () => false }
  });
  const nodeA = await createLibp2p({
    start: false,
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: { identify: identify() },
    connectionGater: { denyDialMultiaddr: () => false }
  });
  t.after(async () => {
    await nodeA.stop().catch(() => {});
    await nodeB.stop().catch(() => {});
  });
  await nodeB.start();
  await nodeA.start();

  const a = new NetworkManager({
    gameId: 'slice3-test',
    roomId: 'room-1',
    topologyId: 'topo-1',
    enableNetworkTelemetry: false
  });
  const b = new NetworkManager({
    gameId: 'slice3-test',
    roomId: 'room-1',
    topologyId: 'topo-1',
    enableNetworkTelemetry: false,
    onMessage: (from, msg) => receivedB.push({ from, msg })
  });
  a.libp2p = nodeA;
  a.peerId = nodeA.peerId.toString();
  b.libp2p = nodeB;
  b.peerId = nodeB.peerId.toString();
  await b._registerDirectUnicastHandler();
  await nodeA.dial(nodeB.getMultiaddrs()[0]);

  // Spy on pubsub publish so we verify direct unicast bypasses directTopic
  const origPublish = a._publish.bind(a);
  a._publish = async (topic, payload) => {
    publishedA.push({ topic, payload });
  };

  await a.sendToPeer(b.peerId, { kind: 'ping', seq: 1 });
  await a.sendToPeer(b.peerId, { kind: 'ping', seq: 2 });
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline && receivedB.length < 2) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  assert.equal(publishedA.length, 0, 'direct unicast should bypass pubsub directTopic');
  assert.equal(receivedB.length, 2);
  assert.deepEqual(receivedB[0], { from: a.peerId, msg: { kind: 'ping', seq: 1 } });
  assert.deepEqual(receivedB[1], { from: a.peerId, msg: { kind: 'ping', seq: 2 } });
  assert.ok(a.telemetry.txBytes > 0 && a.peers.get(b.peerId)?.txBytes > 0);
  assert.ok(b.telemetry.rxBytes > 0 && b.peers.get(a.peerId)?.rxBytes > 0);

  // Fallback to pubsub when no direct connection exists (peer-C)
  await a.sendToPeer('peer-C', { kind: 'fallback', seq: 3 });
  assert.equal(publishedA.length, 1);
  assert.equal(publishedA[0].topic, a.config.directTopic);

  // Fallback to pubsub + cooldown when remote peer does not support direct protocol
  let newStreamCalls = 0;
  const unsupportedConn = {
    id: 'conn-ad-1',
    status: 'open',
    remoteAddr: { toString: () => '/ip4/192.168.1.30/udp/4001/webrtc/p2p/peer-D' },
    newStream: async () => {
      newStreamCalls += 1;
      throw new Error('UnsupportedProtocolError: protocol selection failed');
    }
  };
  a._getConnectionsForPeer = (pid) => (pid === 'peer-D' ? [unsupportedConn] : []);
  await a.sendToPeer('peer-D', { kind: 'old-peer', seq: 4 });
  await a.sendToPeer('peer-D', { kind: 'old-peer', seq: 5 });
  assert.equal(newStreamCalls, 1, 'unsupported peer should be cached on cooldown');
  assert.equal(publishedA.length, 3, 'both messages should cleanly fall back to pubsub');
  assert.equal(typeof origPublish, 'function');
  a._closeAllDirectUnicastStreams();
  await nodeB.unhandle(DIRECT_UNICAST_PROTOCOL);
});

test('ThroughputTopologyPolicy goal-conditioned profiles rank LAN, low-latency, and capability peers cleanly', () => {
  assert.deepEqual(THROUGHPUT_TOPOLOGY_PROFILES, [
    'batch-throughput', 'low-latency', 'lan-first', 'capability-weighted'
  ]);

  const peerMeta = {
    lanFast: { icePath: 'lan-host', candidatePairRttMs: 2, capabilities: { gpuTier: 'low', cores: 4 }, hostGroupId: 'home-lan' },
    wanSlow: { icePath: 'turn-relay', candidatePairRttMs: 220, capabilities: { gpuTier: 'high', webgpu: true, cores: 16 }, hostGroupId: 'cloud' },
    wanMid: { icePath: 'nat-srflx', candidatePairRttMs: 35, capabilities: { gpuTier: 'mid', webgpu: true, cores: 8 }, hostGroupId: 'isp' }
  };

  // low-latency profile favors low RTT links & candidates, preserves 0 flow -> 0 score
  const lowLat = createThroughputProfileScorers('low-latency', (id) => peerMeta[id]);
  assert.equal(lowLat.scoreLink({ peerId: 'lanFast', flow: 0 }), 0);
  assert.ok(lowLat.scoreLink({ peerId: 'lanFast', flow: 10 }) > lowLat.scoreLink({ peerId: 'wanSlow', flow: 10 }));
  assert.ok(lowLat.scoreCandidate('lanFast') > lowLat.scoreCandidate('wanMid'));
  assert.ok(lowLat.scoreCandidate('wanMid') > lowLat.scoreCandidate('wanSlow'));

  // lan-first profile strongly favors lan-host / same hostGroupId peers
  const lanFirst = createThroughputProfileScorers('lan-first', (id) => peerMeta[id], { localHostGroupId: 'home-lan' });
  assert.equal(lanFirst.scoreLink({ peerId: 'lanFast', flow: 0 }), 0);
  assert.ok(lanFirst.scoreLink({ peerId: 'lanFast', flow: 10 }) > lanFirst.scoreLink({ peerId: 'wanMid', flow: 10 }));
  assert.ok(lanFirst.scoreLink({ peerId: 'wanMid', flow: 10 }) > lanFirst.scoreLink({ peerId: 'wanSlow', flow: 10 }));
  const lanState = createThroughputTopologyState();
  const lanDecision = decideThroughputTopology({
    now: 1000,
    links: [],
    candidates: ['wanSlow', 'wanMid', 'lanFast'],
    state: lanState,
    config: { targetConnections: 2, scoreLink: lanFirst.scoreLink, scoreCandidate: lanFirst.scoreCandidate }
  });
  assert.equal(lanDecision.connect, 'lanFast');

  // capability-weighted profile favors high-GPU/WebGPU candidates
  const capWeighted = createThroughputProfileScorers('capability-weighted', (id) => peerMeta[id]);
  assert.equal(capWeighted.scoreLink({ peerId: 'wanSlow', flow: 0 }), 0);
  assert.ok(capWeighted.scoreCandidate('wanSlow') > capWeighted.scoreCandidate('wanMid'));
  assert.ok(capWeighted.scoreCandidate('wanMid') > capWeighted.scoreCandidate('lanFast'));
  const capState = createThroughputTopologyState();
  const capDecision = decideThroughputTopology({
    now: 1000,
    links: [],
    candidates: ['lanFast', 'wanMid', 'wanSlow'],
    state: capState,
    config: { targetConnections: 2, scoreLink: capWeighted.scoreLink, scoreCandidate: capWeighted.scoreCandidate }
  });
  assert.equal(capDecision.connect, 'wanSlow');
});

test('NetworkManager _tickThroughputTopology wires profile scorers automatically', () => {
  const manager = new NetworkManager({
    topology: 'throughput',
    targetConnections: 1,
    maxConnections: 2,
    hostGroupId: 'pi-lan',
    throughputTopology: { profile: 'lan-first' },
    enableNetworkTelemetry: false
  });
  manager.peerId = 'self-laptop';
  manager.peers.set('wan-node', { peerId: 'wan-node', icePath: 'turn-relay', rttMs: 180, multiaddrs: ['/dns4/wan.example/tcp/443/wss/p2p/wan-node'] });
  manager.peers.set('pi-node', { peerId: 'pi-node', icePath: 'lan-host', rttMs: 2, hostGroupId: 'pi-lan', multiaddrs: ['/ip4/192.168.1.42/tcp/8080/ws/p2p/pi-node'] });
  const dialed = [];
  manager._ensureTopologyConnections = (set) => dialed.push(...set);

  manager._tickThroughputTopology(
    10000,
    [
      { peerId: 'wan-node', activeConnections: 0, targetConnections: 2 },
      { peerId: 'pi-node', activeConnections: 0, targetConnections: 2 }
    ],
    []
  );
  assert.deepEqual(dialed, ['pi-node']);
});

test('Multi-relay health tracking and _buildCircuitAddr failover select healthy / LAN / target relay', async () => {
  const relay1Id = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
  const relay2Id = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
  const targetId = '12D3KooWPjceQrSwdWXPyLLeABRXmuqt69Rg3sBYbU1Nft9HyQ6X';
  const relay1Addr = `/dns4/wan-relay.example/tcp/443/wss/p2p/${relay1Id}`;
  const relay2Addr = `/ip4/192.168.1.50/tcp/8080/ws/p2p/${relay2Id}`;

  const manager = new NetworkManager({
    bootstrapPeers: [relay1Addr, relay2Addr],
    enableNetworkTelemetry: false
  });
  let connectedIds = new Set();
  manager.libp2p = {
    dial: async (ma) => {
      const s = ma.toString();
      if (s.includes(relay1Id)) throw new Error('WAN relay unreachable');
      connectedIds.add(relay2Id);
    },
    getConnections: (pid) => {
      const s = pid?.toString?.() ?? String(pid ?? '');
      return connectedIds.has(s) ? [{ status: 'open', remotePeer: { toString: () => s } }] : [];
    }
  };
  manager._reserveRelayForPeer = async () => true;

  await manager._dialBootstrapPeers();
  const health = manager.getBootstrapRelayHealth();
  assert.equal(health[relay1Addr].ok, false);
  assert.equal(health[relay1Addr].failures, 1);
  assert.equal(health[relay2Addr].ok, true);
  assert.equal(health[relay2Addr].isLan, true);
  assert.ok(Number.isFinite(health[relay2Addr].rttMs));

  const circuit = manager._buildCircuitAddr(targetId);
  assert.equal(circuit?.toString?.(), `${relay2Addr}/p2p-circuit/p2p/${targetId}`);

  // When both relays are connected, prefer the relay where target announced a circuit
  connectedIds.add(relay1Id);
  manager.bootstrapRelayHealth.get(relay1Addr).ok = true;
  manager.bootstrapRelayHealth.get(relay1Addr).lastOkAt = Date.now();
  manager.peers.set(targetId, {
    multiaddrs: [`${relay1Addr}/p2p-circuit/p2p/${targetId}`]
  });
  const targetCircuit = manager._buildCircuitAddr(targetId);
  assert.equal(targetCircuit?.toString?.(), `${relay1Addr}/p2p-circuit/p2p/${targetId}`);
});

test('WorkMesh calms idle state heartbeats and WorkMeshService accounts bytes & bounds outbox', async (t) => {
  // 1) Idle heartbeat calming in WorkMesh
  const sentStates = [];
  const pendingCallbacks = [];
  const a = new WorkMesh({
    nodeId: 'a',
    config: { idleStateIntervalMs: 2000 },
    send: (peerId, msg) => {
      if (msg.type === 'state') sentStates.push(msg);
      b.receive('a', structuredClone(msg));
    },
    execute: (task, done) => pendingCallbacks.push(() => done(task.payload))
  });
  const b = new WorkMesh({
    nodeId: 'b',
    config: { idleStateIntervalMs: 2000 },
    send: (_peerId, msg) => a.receive('b', structuredClone(msg)),
    execute: (task, done) => pendingCallbacks.push(() => done(task.payload))
  });
  a.linkUp('b');
  b.linkUp('a');
  for (let ms = 0; ms < 10000; ms += 100) {
    a.tick(ms);
    b.tick(ms);
  }
  assert.ok(sentStates.length <= 8, `expected <= 8 idle state heartbeats over 10s, got ${sentStates.length}`);

  // Active job resumes immediate ticks (every 100ms while work is running/queued) and completes cleanly
  const beforeJob = sentStates.length;
  const done = a.submitJob({ jobId: 'active-1', tasks: [1, 2, 3, 4] });
  for (let ms = 10100; ms < 10600; ms += 100) {
    a.tick(ms);
    b.tick(ms);
    while (pendingCallbacks.length > 0 && ms >= 10400) {
      pendingCallbacks.shift()();
    }
  }
  const results = await done;
  assert.deepEqual(results, [1, 2, 3, 4]);
  assert.ok(sentStates.length >= beforeJob + 3, `expected active ticks to emit immediately, got ${sentStates.length - beforeJob}`);

  // 2) WorkMeshService byte accounting + bounded outbox overflow recovery
  const byteLog = { rx: 0, tx: 0 };
  const manager = {
    peerId: 'a',
    bootstrapPeerIds: new Set(),
    recordPeerWork: () => {},
    recordPeerBytes: (_peerId, { rxBytes = 0, txBytes = 0 } = {}) => {
      byteLog.rx += rxBytes;
      byteLog.tx += txBytes;
    },
    libp2p: {
      handle: async (proto) => { assert.equal(proto, WORK_MESH_PROTOCOL); },
      unhandle: async () => {}
    },
    _getConnectionPeers: () => [{ peerId: 'b' }],
    _getConnectionsForPeer: () => [{
      status: 'open',
      remoteAddr: '/ip4/192.168.1.10/udp/4001/webrtc/p2p/b',
      newStream: async () => ({
        async write(val) { return JSON.stringify(val).length; },
        abort() {}
      })
    }]
  };
  const service = new WorkMeshService(manager, {
    tickMs: 1e9,
    maxOutbox: 4,
    channel: (stream) => stream,
    execute: (task, doneFn) => doneFn(task.payload)
  });
  t.after(() => service.stop());
  await service.start();
  service.tick();
  await new Promise((resolve) => setTimeout(resolve, 15));
  assert.ok(byteLog.tx > 0, 'WorkMeshService should report txBytes to NetworkManager');

  // Stall writer and exceed maxOutbox -> cleanly resets stream instead of leaking
  const peer = service.peers.get('b');
  peer.writing = true;
  for (let i = 0; i < 6; i += 1) {
    service._send('b', { schema: 's', type: 'work', tasks: [{ id: i }] });
  }
  assert.equal(service.snapshot().streamResets, 1);
  assert.ok(peer.outbox.length <= 4);
});

test('NativeCompanion defaults to LAN-friendly gossipsub and relays pubsub between peers', { timeout: 20000 }, async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'peercompute-companion-gs-'));
  const identityPath = path.join(dir, 'identity.json');
  assert.throws(() => createNativeCompanion({ identityPath, pubsubType: 'invalid' }), /pubsubType/);

  const companion = createNativeCompanion({
    identityPath,
    relay: { enabled: true }
  });
  t.after(async () => {
    await companion.stop();
    await rm(dir, { recursive: true, force: true });
  });

  const status = await companion.start();
  assert.equal(status.pubsubType, 'gossipsub');
  const relayAddr = status.localMultiaddrs[0];

  const makePeer = async () => {
    const node = await createLibp2p({
      start: false,
      transports: [webSockets()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      services: {
        identify: identify(),
        pubsub: gossipsub({
          emitSelf: false,
          allowPublishToZeroTopicPeers: true,
          scoreParams: { IPColocationFactorWeight: 0, behaviourPenaltyWeight: 0 }
        })
      },
      connectionGater: { denyDialMultiaddr: () => false }
    });
    t.after(() => node.stop());
    await node.start();
    await node.dial(multiaddr(relayAddr));
    return node;
  };

  const p1 = await makePeer();
  const p2 = await makePeer();
  const topic = 'pc.lan-test.global.presence';
  const received = [];
  p2.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === topic) {
      received.push(new TextDecoder().decode(evt.detail.data));
    }
  });
  p1.services.pubsub.subscribe(topic);
  p2.services.pubsub.subscribe(topic);

  // Wait for gossipsub mesh / companion subscription forwarding
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline && received.length === 0) {
    await p1.services.pubsub.publish(topic, new TextEncoder().encode('hello-lan-gossipsub')).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  assert.ok(received.includes('hello-lan-gossipsub'), 'gossipsub message should traverse NativeCompanion relay');
});
