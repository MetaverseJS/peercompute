import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONNECTION_PATHS,
  ICE_TRANSPORT_POLICIES,
  NetworkManager,
  classifyConnectionPath,
  normalizeIceTransportPolicy
} from '../../src/peercompute/networkManager/NetworkManager.js';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';
import {
  RemoteResultQuorumValidator,
  createRemoteResultQuorumValidator
} from '../../src/peercompute/computeManager/RemoteResultQuorumValidator.js';
import { SpatialTileLeaseBroker } from '../../src/peercompute/stateManager/SpatialTileLeaseBroker.js';

test('NetworkManager & NodeKernel surface network.iceServers and network.iceTransportPolicy fail-closed', () => {
  assert.deepEqual(ICE_TRANSPORT_POLICIES, ['all', 'relay']);
  assert.equal(normalizeIceTransportPolicy('relay'), 'relay');
  assert.equal(normalizeIceTransportPolicy('ALL'), 'all');
  assert.throws(() => normalizeIceTransportPolicy('invalid-policy'), /Unsupported iceTransportPolicy/);

  const iceServers = [
    { urls: 'stun:stun.example.org:3478' },
    { urls: ['turn:turn.example.org:3478?transport=udp', 'turns:turn.example.org:5349'], username: 'u', credential: 'secret-password' }
  ];

  const nm = new NetworkManager({
    bootstrapPeers: [],
    network: {
      iceServers,
      iceTransportPolicy: 'relay'
    }
  });

  assert.equal(nm.config.webrtc.iceTransportPolicy, 'relay');
  assert.equal(nm.config.webrtc.rtcConfiguration.iceTransportPolicy, 'relay');
  assert.equal(nm.config.webrtc.rtcConfiguration.iceServers.length, 2);

  const iceDiag = nm.getIceConfig();
  assert.equal(iceDiag.iceTransportPolicy, 'relay');
  assert.equal(iceDiag.iceServerCount, 2);
  assert.equal(iceDiag.stunServerCount, 1);
  assert.equal(iceDiag.turnServerCount, 2);
  assert.equal(iceDiag.hasTurnServer, true);
  // Secrets/credentials must never leak into diagnostics/telemetry snapshots.
  assert.equal(JSON.stringify(iceDiag).includes('secret-password'), false);

  // Invalid policy throws fail-closed in both NetworkManager and NodeKernel constructors.
  assert.throws(
    () => new NetworkManager({ bootstrapPeers: [], network: { iceTransportPolicy: 'direct-only' } }),
    /Unsupported iceTransportPolicy/
  );
  assert.throws(
    () => new NodeKernel({ network: { iceTransportPolicy: 'bad' } }),
    /Unsupported iceTransportPolicy/
  );

  const kernel = new NodeKernel({
    network: { iceServers, iceTransportPolicy: 'relay' }
  });
  assert.equal(kernel.config.network.iceTransportPolicy, 'relay');
  assert.equal(kernel.config.iceTransportPolicy, 'relay');
  assert.equal(kernel.config.iceServers.length, 2);
});

test('Connection path classification distinguishes direct-webrtc, turn-relay, and ws-relay in telemetry & diagnostics', () => {
  assert.equal(classifyConnectionPath({ icePath: 'lan-host', via: 'webrtc' }), CONNECTION_PATHS.DIRECT_WEBRTC);
  assert.equal(classifyConnectionPath({ icePath: 'nat-srflx', via: 'webrtc' }), CONNECTION_PATHS.DIRECT_WEBRTC);
  assert.equal(classifyConnectionPath({ icePath: 'turn-relay', via: 'webrtc' }), CONNECTION_PATHS.TURN_RELAY);
  assert.equal(classifyConnectionPath({ mediaPath: 'turn-relay', via: 'webrtc' }), CONNECTION_PATHS.TURN_RELAY);
  assert.equal(classifyConnectionPath({ icePath: 'circuit-relay', via: 'relay' }), CONNECTION_PATHS.WS_RELAY);
  assert.equal(classifyConnectionPath({ icePath: 'direct-ws', via: 'ws' }), CONNECTION_PATHS.WS_RELAY);
  assert.equal(classifyConnectionPath({ via: 'relay-webrtc', mediaPath: 'direct' }), CONNECTION_PATHS.DIRECT_WEBRTC);
  assert.equal(classifyConnectionPath({ via: 'relay-webrtc' }), CONNECTION_PATHS.WS_RELAY);

  const nm = new NetworkManager({
    bootstrapPeers: [],
    network: {
      iceServers: [{ urls: 'stun:stun.example.org:3478' }],
      iceTransportPolicy: 'all'
    }
  });
  nm.peerId = 'local-peer';
  nm.isConnected = true;
  nm.peers.set('peer-direct', { peerId: 'peer-direct', via: 'webrtc', icePath: 'nat-srflx', mediaPath: 'direct' });
  nm.peers.set('peer-turn', { peerId: 'peer-turn', via: 'webrtc', icePath: 'turn-relay', mediaPath: 'turn-relay' });
  nm.peers.set('peer-ws', { peerId: 'peer-ws', via: 'relay', icePath: 'circuit-relay', signalingPath: 'relay-scoped' });
  nm.libp2p = {
    getConnections: () => [
      { remotePeer: { toString: () => 'peer-direct' }, remoteAddr: { toString: () => '/ip4/1.2.3.4/udp/1/webrtc/p2p/peer-direct' } },
      { remotePeer: { toString: () => 'peer-turn' }, remoteAddr: { toString: () => '/ip4/5.6.7.8/udp/2/webrtc/p2p/peer-turn' } },
      { remotePeer: { toString: () => 'peer-ws' }, remoteAddr: { toString: () => '/ip4/9.9.9.9/tcp/443/wss/p2p-circuit/p2p/peer-ws' } }
    ]
  };

  const telemetry = nm.getTelemetrySnapshot();
  assert.equal(telemetry.ice.iceTransportPolicy, 'all');
  assert.equal(telemetry.ice.stunServerCount, 1);
  assert.deepEqual(telemetry.connectionPaths, {
    'direct-webrtc': 1,
    'turn-relay': 1,
    'ws-relay': 1,
    unknown: 0
  });
  const byPeer = Object.fromEntries(telemetry.peers.map((p) => [p.peerId, p.connectionPath]));
  assert.equal(byPeer['peer-direct'], 'direct-webrtc');
  assert.equal(byPeer['peer-turn'], 'turn-relay');
  assert.equal(byPeer['peer-ws'], 'ws-relay');

  const diagnostics = nm.getConnectionDiagnostics();
  assert.deepEqual(diagnostics.connectionPaths, telemetry.connectionPaths);
  assert.equal(diagnostics.peers.length, 3);
});

test('NodeKernel fail-closed disconnect hook cancels in-flight work, evicts tiles, and updates quorum validator', async () => {
  const kernel = new NodeKernel({
    enablePersistence: false,
    disableStateNetworkProvider: true,
    disableStateBroadcast: true,
    network: {
      iceServers: [{ urls: 'turn:turn.example.org:3478' }],
      iceTransportPolicy: 'relay'
    }
  });
  kernel.isStarted = true;
  kernel.nodeId = 'node-local';
  kernel.networkManager = new NetworkManager({
    bootstrapPeers: [],
    network: kernel.config.network
  });
  kernel.networkManager.sendToPeer = async () => {};

  const broker = new SpatialTileLeaseBroker({ name: 'kernel-tiles' });
  kernel.attachSpatialTileLeaseBroker(broker);

  const quorum = createRemoteResultQuorumValidator({ minReplicaCount: 2, minMatchingReplicas: 2 });
  quorum.bindToKernel(kernel);
  const quorumClass = new RemoteResultQuorumValidator({ minReplicaCount: 2, minMatchingReplicas: 2 });
  quorumClass.bindToKernel(kernel);

  const disconnectEvents = [];
  const reconnectEvents = [];
  kernel.onPeerDisconnect((evt) => disconnectEvents.push(evt));
  kernel.onPeerReconnect((evt) => reconnectEvents.push(evt));

  kernel._handlePeerConnect('peer-worker-1');
  kernel._handlePeerConnect('peer-worker-2');
  assert.equal(kernel.isPeerAvailable('peer-worker-1'), true);

  // Acquire tile on peer-worker-1 and start an in-flight remote compute request targeting peer-worker-1.
  const acquired = broker.acquireTile({ tileId: 'tile-42', peerId: 'peer-worker-1' });
  assert.equal(acquired.ok, true);

  const remotePromise = kernel.submitRemoteComputeTask('peer-worker-1', {
    module: 'peercompute:capability-benchmark',
    data: {}
  }, { timeoutMs: 30_000 });

  // Before disconnect, quorum with peer-worker-1 + peer-worker-2 passes.
  const okReport = quorum({ ok: true, value: 42 }, {
    provenance: {
      peerId: 'peer-worker-2',
      replicas: [{ peerId: 'peer-worker-1', value: { ok: true, value: 42 } }]
    }
  });
  assert.equal(okReport.valid, true);
  assert.equal(okReport.reason, 'quorum-accepted');

  // Drop peer-worker-1 -> fail-closed immediately!
  kernel._handlePeerDisconnect('peer-worker-1', { reason: 'ice-disconnected' });

  await assert.rejects(
    remotePromise,
    (err) => err?.code === 'ERR_REMOTE_PEER_DISCONNECTED' && err?.peerId === 'peer-worker-1'
  );
  assert.equal(kernel.isPeerAvailable('peer-worker-1'), false);
  assert.deepEqual(kernel.getUnavailablePeers(), ['peer-worker-1']);
  assert.equal(disconnectEvents.length, 1);
  assert.equal(disconnectEvents[0].cancelledRequestIds.length, 1);
  assert.equal(disconnectEvents[0].evictedTiles.length, 1);
  assert.equal(disconnectEvents[0].evictedTiles[0].tileId, 'tile-42');
  assert.equal(broker.fence('tile-42').epoch, 1);

  // Quorum validator immediately rejects results depending on the dropped responder fail-closed.
  const droppedReplicaReport = quorum({ ok: true, value: 42 }, {
    provenance: {
      peerId: 'peer-worker-2',
      replicas: [{ peerId: 'peer-worker-1', value: { ok: true, value: 42 } }]
    }
  });
  assert.equal(droppedReplicaReport.valid, false);
  assert.equal(droppedReplicaReport.reason, 'responder-unavailable');
  assert.equal(droppedReplicaReport.unavailableReplicaCount, 1);

  const droppedPrimaryReport = quorumClass.validate({ ok: true, value: 42 }, {
    provenance: {
      peerId: 'peer-worker-1',
      replicas: [{ peerId: 'peer-worker-2', value: { ok: true, value: 42 } }]
    }
  });
  assert.equal(droppedPrimaryReport.valid, false);
  assert.equal(droppedPrimaryReport.reason, 'primary-responder-unavailable');

  // Reconnect peer-worker-1 -> emits reconnect and restores availability.
  kernel._handlePeerConnect('peer-worker-1');
  assert.equal(reconnectEvents.length, 1);
  assert.equal(reconnectEvents[0].reconnectCount, 1);
  assert.equal(kernel.isPeerAvailable('peer-worker-1'), true);
  assert.equal(quorum.isPeerAvailable('peer-worker-1'), true);

  const status = kernel.getStatus();
  assert.equal(status.network.ice.iceTransportPolicy, 'relay');
  assert.deepEqual(status.network.unavailablePeerIds, []);
});
