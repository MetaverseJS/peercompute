import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { TopologyController } from '../../src/peercompute/networkManager/TopologyController.js';
import {
  createThroughputTopologyState,
  decideThroughputTopology,
  THROUGHPUT_TOPOLOGY_DEFAULTS
} from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';
import { PeerConnectionRecovery } from '../../src/peercompute/networkManager/inference/PeerConnectionRecovery.js';

const buildAddr = (value) => ({ getComponents: () => [], toString: () => value });

const makeIceStatsReport = ({ localType, remoteType, protocol = 'udp', rttSec = 0.012 } = {}) => {
  const entries = [
    ['t1', { id: 't1', type: 'transport', selectedCandidatePairId: 'cp1' }],
    ['cp1', {
      id: 'cp1',
      type: 'candidate-pair',
      state: 'succeeded',
      nominated: true,
      localCandidateId: 'lc1',
      remoteCandidateId: 'rc1',
      currentRoundTripTime: rttSec
    }],
    ['lc1', { id: 'lc1', type: 'local-candidate', candidateType: localType, protocol }],
    ['rc1', { id: 'rc1', type: 'remote-candidate', candidateType: remoteType, protocol }]
  ];
  return {
    forEach: (fn) => {
      for (const [key, val] of entries) fn(val, key);
    }
  };
};

test('queryPeerDirectory does not double-JSON-encode and fast-fails without subscribers', async () => {
  const manager = new NetworkManager({ enablePeerDirectory: true, directoryQueryTimeoutMs: 2000 });
  manager.peerId = 'peer-self';
  manager.isConnected = true;

  const published = [];
  manager.libp2p = {
    services: {
      pubsub: {
        getSubscribers: () => [],
        publish: async (topic, data) => {
          published.push({ topic, raw: new TextDecoder().decode(data) });
        }
      }
    }
  };

  const t0 = Date.now();
  const emptyRes = await manager.queryPeerDirectory('peer-target');
  const elapsedEmpty = Date.now() - t0;
  assert.equal(emptyRes, null);
  assert.ok(elapsedEmpty < 250, `expected immediate fast-fail with 0 subscribers, took ${elapsedEmpty}ms`);
  assert.equal(published.length, 0);

  // With a subscriber present, verify single-encoded JSON object and response resolution.
  manager.libp2p.services.pubsub.getSubscribers = () => [{ toString: () => 'relay-1' }];
  const queryPromise = manager.queryPeerDirectory('peer-target');
  await new Promise((r) => setImmediate(r));
  assert.equal(published.length, 1);
  const parsed = JSON.parse(published[0].raw);
  assert.equal(typeof parsed, 'object');
  assert.equal(parsed.type, 'directory-query');
  assert.equal(parsed.targetPeerId, 'peer-target');

  manager._handleDirectoryMessage({
    type: 'directory-response',
    requestId: parsed.requestId,
    targetPeerId: 'peer-target',
    found: true,
    multiaddrs: ['/webrtc/p2p/peer-target']
  });
  const resolved = await queryPromise;
  assert.equal(resolved?.peerId, 'peer-target');
  assert.deepEqual(resolved?.multiaddrs, ['/webrtc/p2p/peer-target']);

  // registerWithDirectory also publishes a single-encoded JSON object.
  manager.libp2p.getMultiaddrs = () => [buildAddr('/webrtc/p2p/peer-self')];
  await manager.registerWithDirectory();
  assert.equal(published.length, 2);
  const regParsed = JSON.parse(published[1].raw);
  assert.equal(typeof regParsed, 'object');
  assert.equal(regParsed.type, 'directory-register');
  assert.equal(regParsed.from, 'peer-self');
});

test('_maybeDialPeer never stalls behind queryPeerDirectory when relay-webrtc targets are already present', async () => {
  const manager = new NetworkManager({
    enablePeerDirectory: true,
    directoryQueryTimeoutMs: 5000,
    webrtc: { preferDirect: true }
  });
  manager.isConnected = true;
  manager.bootstrapPeerIds = new Set();

  let directoryCalls = 0;
  manager.queryPeerDirectory = async () => {
    directoryCalls += 1;
    return null;
  };
  const dialed = [];
  manager.libp2p = {
    getConnections: () => [],
    dial: async (addr) => {
      dialed.push(addr.toString());
    }
  };

  await manager._maybeDialPeer('peer-b', 'presence', [
    buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1/p2p-circuit/webrtc/p2p/peer-b')
  ], { force: true });

  assert.equal(directoryCalls, 0);
  assert.equal(dialed.length, 1);
});

test('ICE getStats inspection classifies lan-host, nat-srflx, and turn-relay truthfully', async () => {
  const manager = new NetworkManager();
  manager.peerId = 'peer-self';
  manager.bootstrapPeerIds = new Set();

  const makeConn = (peerId, remoteAddr, stats) => ({
    remotePeer: { toString: () => peerId },
    remoteAddr: buildAddr(remoteAddr),
    status: 'open',
    direction: 'outbound',
    maConn: {
      peerConnection: {
        getStats: async () => makeIceStatsReport(stats)
      }
    }
  });

  const lanConn = makeConn(
    'peer-lan',
    '/ip4/1.2.3.4/tcp/443/wss/p2p/relay/p2p-circuit/webrtc/p2p/peer-lan',
    { localType: 'host', remoteType: 'host', protocol: 'udp', rttSec: 0.002 }
  );
  const turnConn = makeConn(
    'peer-turn',
    '/webrtc/p2p/peer-turn',
    { localType: 'relay', remoteType: 'srflx', protocol: 'tcp', rttSec: 0.068 }
  );
  const srflxConn = makeConn(
    'peer-nat',
    '/ip4/1.2.3.4/tcp/443/wss/p2p/relay/p2p-circuit/webrtc/p2p/peer-nat',
    { localType: 'srflx', remoteType: 'srflx', protocol: 'udp', rttSec: 0.025 }
  );

  manager.libp2p = {
    getConnections: (peerId) => {
      const all = [lanConn, turnConn, srflxConn];
      return peerId ? all.filter((c) => c.remotePeer.toString() === peerId) : all;
    }
  };

  await manager._sampleConnectionIceStats(lanConn, 'peer-lan');
  await manager._sampleConnectionIceStats(turnConn, 'peer-turn');
  await manager._sampleConnectionIceStats(srflxConn, 'peer-nat');

  const peers = new Map(manager._getConnectionPeers().map((p) => [p.peerId, p]));
  assert.equal(peers.get('peer-lan').icePath, 'lan-host');
  assert.equal(peers.get('peer-lan').mediaPath, 'direct');
  assert.equal(peers.get('peer-lan').iceProtocol, 'udp');
  assert.equal(peers.get('peer-lan').candidatePairRttMs, 2);

  // Even though recipient remoteAddr looks like `/webrtc/p2p/peer-turn`,
  // getStats exposes TURN relay truthfully instead of misreporting direct!
  assert.equal(peers.get('peer-turn').icePath, 'turn-relay');
  assert.equal(peers.get('peer-turn').mediaPath, 'turn-relay');
  assert.equal(peers.get('peer-turn').iceProtocol, 'tcp');
  assert.equal(peers.get('peer-turn').candidatePairRttMs, 68);

  assert.equal(peers.get('peer-nat').icePath, 'nat-srflx');
  assert.equal(peers.get('peer-nat').mediaPath, 'direct');
  assert.equal(peers.get('peer-nat').candidatePairRttMs, 25);
});

test('_handlePresence preserves live connection via and mediaPath instead of clobbering to presence', () => {
  const manager = new NetworkManager();
  manager.peerId = 'peer-self';
  manager._shouldDialDiscoveredPeer = () => false;
  const conn = {
    remotePeer: { toString: () => 'peer-a' },
    remoteAddr: buildAddr('/webrtc/p2p/peer-a'),
    status: 'open',
    direction: 'inbound'
  };
  manager.libp2p = {
    getConnections: (peerId) => (!peerId || peerId === 'peer-a' ? [conn] : [])
  };
  manager._touchPeer('peer-a', { via: 'webrtc', signalingPath: 'direct', mediaPath: 'direct' });

  manager._handlePresence({
    type: 'presence',
    from: 'peer-a',
    gameId: manager.config.gameId,
    roomId: manager.config.roomId,
    topologyId: manager.config.topologyId,
    topologyType: manager.config.topology,
    activeConnections: 1
  });

  const peer = manager.peers.get('peer-a');
  assert.equal(peer.via, 'webrtc');
  assert.equal(peer.mediaPath, 'direct');
});

test('initiator relay-webrtc prunes plain circuit relay connection under dropRelayOnDirect', () => {
  const manager = new NetworkManager({
    webrtc: { dropRelayOnDirect: true, directUpgradeGraceMs: 0, countRelayWebrtcAsDirectCapable: true }
  });
  manager.bootstrapPeerIds = new Set();

  let plainRelayClosed = false;
  let relayWebrtcClosed = false;
  const plainRelay = {
    remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/443/wss/p2p/relay/p2p-circuit/p2p/peer-a'),
    status: 'open',
    close: async () => { plainRelayClosed = true; }
  };
  const relayWebrtc = {
    remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/443/wss/p2p/relay/p2p-circuit/webrtc/p2p/peer-a'),
    status: 'open',
    close: async () => { relayWebrtcClosed = true; }
  };
  manager.libp2p = { getConnections: () => [plainRelay, relayWebrtc] };

  manager._maybePruneRelayConnections('peer-a');
  assert.equal(plainRelayClosed, true);
  assert.equal(relayWebrtcClosed, false);
});

test('bilateral dial glare tie-breaker yields higher peerId briefly while lower peerId dials immediately', async () => {
  const makePeer = (selfId) => {
    const manager = new NetworkManager({ webrtc: { preferDirect: true, dialGlareTieBreakMs: 3000 } });
    manager.peerId = selfId;
    manager.bootstrapPeerIds = new Set();
    const dialed = [];
    manager.libp2p = {
      getConnections: () => [],
      dial: async (addr) => { dialed.push(addr.toString()); }
    };
    return { manager, dialed };
  };

  const lower = makePeer('peer-a');
  const higher = makePeer('peer-z');
  const addr = buildAddr('/webrtc/p2p/peer-a');

  await lower.manager._maybeDialPeer('peer-z', 'presence', [buildAddr('/webrtc/p2p/peer-z')]);
  assert.equal(lower.dialed.length, 1, 'lower peerId should dial immediately');

  await higher.manager._maybeDialPeer('peer-a', 'presence', [addr]);
  assert.equal(higher.dialed.length, 0, 'higher peerId should yield during glare window');

  // After glare window elapses, higher peerId falls back and dials normally.
  higher.manager.peers.get('peer-a').firstSeenAt = Date.now() - 4000;
  await higher.manager._maybeDialPeer('peer-a', 'presence', [addr]);
  assert.equal(higher.dialed.length, 1, 'higher peerId should dial once glare window expires');
});

test('small rooms (N <= 3) cap effective minDirectMeshPeers so non-keeper peers can drop relay', () => {
  const manager = new NetworkManager({
    targetConnections: 3,
    webrtc: {
      dropRelayBootstrapOnDirect: true,
      relayRetention: { mode: 'logn', min: 1 },
      relayBootstrapMinHoldMs: 0,
      relayPostDirectHoldMs: 0
    }
  });
  manager.peerId = 'peer-3';
  manager.joinedAt = 3000;
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  manager.peers.set('peer-1', {
    gameId: manager.config.gameId,
    roomId: manager.config.roomId,
    topologyId: manager.config.topologyId,
    joinedAt: 1000
  });
  manager.peers.set('peer-2', {
    gameId: manager.config.gameId,
    roomId: manager.config.roomId,
    topologyId: manager.config.topologyId,
    joinedAt: 2000
  });

  const conns = [
    { remotePeer: { toString: () => 'relay-peer' }, remoteAddr: buildAddr('/dns4/r/tcp/443/wss/p2p/relay-peer'), status: 'open' },
    { remotePeer: { toString: () => 'peer-1' }, remoteAddr: buildAddr('/webrtc/p2p/peer-1'), status: 'open' },
    { remotePeer: { toString: () => 'peer-2' }, remoteAddr: buildAddr('/webrtc/p2p/peer-2'), status: 'open' }
  ];
  manager.libp2p = {
    services: { pubsub: { getMeshPeers: () => [{ toString: () => 'peer-1' }, { toString: () => 'peer-2' }] } },
    getConnections: (id) => (id ? conns.filter((c) => c.remotePeer.toString() === id) : conns)
  };

  const debug = manager.getRelayRetentionDebug();
  assert.equal(debug.effectiveMinDirectMeshPeers, 2);
  assert.equal(debug.healthyMesh, true);
  // N=3, log2(3) -> ceil=2 keepers (peer-1, peer-2), so peer-3 can drop relay!
  assert.equal(debug.shouldKeepRelay, false);
  assert.equal(debug.keepReason, 'none');
});

test('PeerConnectionRecovery uses shorter fresh grace for direct links so 6s throughput trials do not deadlock', () => {
  let now = 10000;
  const manager = new NetworkManager();
  const recovery = new PeerConnectionRecovery(manager, { now: () => now, freshGraceMs: 10000 });
  const directConn = {
    remoteAddr: buildAddr('/webrtc/p2p/peer-a'),
    status: 'open',
    timeline: { open: now }
  };
  const relayConn = {
    remoteAddr: buildAddr('/dns4/r/tcp/443/wss/p2p/r/p2p-circuit/p2p/peer-a'),
    status: 'open',
    timeline: { open: now }
  };

  now += 6000;
  assert.equal(recovery.protectionMs(directConn), 0, 'direct link must be evictable at 6000ms trialMs');
  assert.equal(recovery.protectionMs(relayConn), 4000, 'relay recovery link retains full 10000ms freshGraceMs');
});

test('maintenance protocols (/ipfs/id/push/1.0.0 and /peercompute/keepalive/1.0.0) do not pin idle connections', () => {
  const manager = new NetworkManager();
  manager.libp2p = { services: {} };
  const conn = {
    remotePeer: { toString: () => 'peer-a' },
    remoteAddr: buildAddr('/webrtc/p2p/peer-a'),
    status: 'open',
    timeline: { open: Date.now() - 30000 },
    streams: [
      { protocol: '/ipfs/id/push/1.0.0', status: 'open' },
      { protocol: '/peercompute/keepalive/1.0.0', status: 'open' }
    ]
  };
  assert.equal(manager._hasActiveApplicationStreams(conn), false);

  // Active relay /hop stream MUST still protect bootstrap connections.
  conn.streams.push({ protocol: '/libp2p/circuit/relay/0.2.0/hop', status: 'open' });
  assert.equal(manager._hasActiveApplicationStreams(conn), true);
});

test('TopologyController applies distance hysteresis, bounds zero-conn boost, and keeps long-range bridging with radius', () => {
  const controller = new TopologyController({
    topologyId: 'topo-a',
    maxConnections: 3,
    connectionRadius: 5,
    longRangeCount: 1,
    swapHysteresisRatio: 0.15,
    maxZeroConnBoost: 1,
    metric: { x: 0, y: 0, z: 0 }
  });
  controller.setPeerId('self');

  // 1. Hysteresis prevents flapping when a connected peer is slightly farther than a newcomer.
  const peersHyst = [
    { peerId: 'near', topologyId: 'topo-a', metric: { x: 1, y: 0, z: 0 }, activeConnections: 2 },
    { peerId: 'conn-1', topologyId: 'topo-a', metric: { x: 3.1, y: 0, z: 0 }, activeConnections: 2 },
    { peerId: 'conn-2', topologyId: 'topo-a', metric: { x: 3.2, y: 0, z: 0 }, activeConnections: 2 },
    { peerId: 'newcomer', topologyId: 'topo-a', metric: { x: 2.95, y: 0, z: 0 }, activeConnections: 2 }
  ];
  const desiredHyst = controller.computeDesiredPeers({
    peers: peersHyst,
    connections: [{ peerId: 'conn-1' }, { peerId: 'conn-2' }]
  });
  assert.ok(desiredHyst.has('conn-1') && desiredHyst.has('conn-2'), 'connected peers within hysteresis margin stay desired');

  // 2. Bounded zero-conn boost prevents a burst of 3 newcomers from evicting stable neighbors.
  const peersBurst = [
    { peerId: 'near-1', topologyId: 'topo-a', metric: { x: 1, y: 0, z: 0 }, activeConnections: 2 },
    { peerId: 'near-2', topologyId: 'topo-a', metric: { x: 1.5, y: 0, z: 0 }, activeConnections: 2 },
    { peerId: 'zero-a', topologyId: 'topo-a', metric: { x: 4.0, y: 0, z: 0 }, activeConnections: 0 },
    { peerId: 'zero-b', topologyId: 'topo-a', metric: { x: 4.2, y: 0, z: 0 }, activeConnections: 0 },
    { peerId: 'zero-c', topologyId: 'topo-a', metric: { x: 4.5, y: 0, z: 0 }, activeConnections: 0 }
  ];
  const desiredBurst = controller.computeDesiredPeers({ peers: peersBurst, connections: [] });
  assert.ok(desiredBurst.has('near-1'));
  assert.ok(desiredBurst.has('zero-a'), 'closest isolated peer gets the single boost slot');
  assert.ok(desiredBurst.has('near-2'), 'stable local neighbor is preserved instead of evicted by additional zero-conn peers');

  // 3. Long-range link bridges outside connectionRadius when spare slots exist.
  const peersIsland = [
    { peerId: 'local-1', topologyId: 'topo-a', metric: { x: 1, y: 0, z: 0 }, activeConnections: 1 },
    { peerId: 'far-island', topologyId: 'topo-a', metric: { x: 50, y: 0, z: 0 }, activeConnections: 1 }
  ];
  const desiredIsland = controller.computeDesiredPeers({ peers: peersIsland, connections: [] });
  assert.ok(desiredIsland.has('local-1'));
  assert.ok(desiredIsland.has('far-island'), 'long-range slot should bridge spatially separated clusters even when connectionRadius is set');
});

test('ThroughputTopologyPolicy wakes immediately from idle exponential backoff when work resumes', () => {
  const state = createThroughputTopologyState();
  const base = THROUGHPUT_TOPOLOGY_DEFAULTS.exploreIntervalMs;
  const cfg = { targetConnections: 2, maxConnections: 3, exploreIntervalMs: base };
  const idleLinks = [
    { peerId: 'a', flow: 0, since: -1e6 },
    { peerId: 'b', flow: 0, since: -1e6 }
  ];

  // Simulate idle state that backed off to 5 minutes.
  decideThroughputTopology({ now: 0, links: idleLinks, candidates: ['c'], state, random: () => 0, config: cfg });
  state.trialPeerId = null;
  state.exploreDelayMs = 300000;
  state.lastExploreAt = 10000;
  state.wasIdle = true;

  // Workload starts carrying flow at t = 11000 (only 1s after lastExploreAt, well below 300s backoff).
  const activeLinks = [
    { peerId: 'a', flow: 10, since: -1e6 },
    { peerId: 'b', flow: 8, since: -1e6 }
  ];
  const woken = decideThroughputTopology({
    now: 11000,
    links: activeLinks,
    candidates: ['c'],
    state,
    random: () => 0,
    config: cfg
  });
  assert.equal(state.exploreDelayMs, base);
  assert.equal(woken.connect, 'c', 'policy must wake and explore immediately when work resumes');
});

test('_handleTopologyConnectRequest refuses instead of accepting when eviction target is protected', () => {
  const manager = new NetworkManager({ maxConnections: 2, topology: 'distributed', swapHysteresisRatio: 0.1 });
  manager.peerId = 'self';
  manager.bootstrapPeerIds = new Set();
  manager.topologyMetric = { x: 0, y: 0, z: 0 };
  manager.metricInitialized = true;

  const sent = [];
  manager.sendToPeer = async (peerId, msg) => { sent.push({ peerId, type: msg.type }); };

  const protectedConn = {
    remotePeer: { toString: () => 'peer-far' },
    remoteAddr: buildAddr('/webrtc/p2p/peer-far'),
    status: 'open',
    streams: [{ protocol: '/peercompute/inference/3.0.0', status: 'open' }],
    close: async function () { this.status = 'closed'; }
  };
  const nearConn = {
    remotePeer: { toString: () => 'peer-near' },
    remoteAddr: buildAddr('/webrtc/p2p/peer-near'),
    status: 'open',
    streams: [],
    close: async function () { this.status = 'closed'; }
  };
  manager.libp2p = {
    getConnections: (id) => {
      const all = [nearConn, protectedConn];
      return id ? all.filter((c) => c.remotePeer.toString() === id) : all;
    }
  };
  manager.peers.set('peer-near', {
    gameId: manager.config.gameId, roomId: manager.config.roomId, topologyId: manager.config.topologyId,
    via: 'webrtc', metric: { x: 1, y: 0, z: 0 }, metricInitialized: true, activeConnections: 3
  });
  manager.peers.set('peer-far', {
    gameId: manager.config.gameId, roomId: manager.config.roomId, topologyId: manager.config.topologyId,
    via: 'webrtc', metric: { x: 10, y: 0, z: 0 }, metricInitialized: true, activeConnections: 4
  });
  manager.peers.set('peer-c1', {
    gameId: manager.config.gameId, roomId: manager.config.roomId, topologyId: manager.config.topologyId,
    metric: { x: 9, y: 0, z: 0 }, metricInitialized: true
  });
  manager.peers.set('peer-c2', {
    gameId: manager.config.gameId, roomId: manager.config.roomId, topologyId: manager.config.topologyId,
    metric: { x: 8, y: 0, z: 0 }, metricInitialized: true
  });

  manager._handleTopologyConnectRequest('peer-closer', { metric: { x: 2, y: 0, z: 0 } });
  assert.equal(protectedConn.status, 'open');
  assert.ok(!sent.some((m) => m.type === 'topology-connect-accept'), 'must not accept when eviction failed');
  assert.ok(sent.some((m) => m.type === 'topology-connect-referral'), 'should send referral when eviction cannot free a slot');
});
