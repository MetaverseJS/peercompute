import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ROADVECTOR_PRESENCE_SCHEMA,
  ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS,
  coarseRoadvectorPresence,
  collectRoadvectorPeers,
  createRoadvectorPresenceRuntime,
  validateRoadvectorPresence,
} from '../../src/overview/playerPresence.js';

function jsonResponse(value) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function relayConnection(overrides = {}) {
  return {
    remotePeer: { toString: () => '12D3KooWTestRelayPeer' },
    remoteAddr: { toString: () => '/dns4/secretworkshop.net/tcp/443/wss/p2p/12D3KooWTestRelayPeer' },
    status: 'open',
    encryption: '/noise',
    ...overrides,
  };
}

async function runtimeWithConnections(getConnections) {
  const runtime = createRoadvectorPresenceRuntime({
    fetchImpl: async (url) => jsonResponse(String(url).includes('relay-config-source')
      ? { relayConfigUrl: 'https://secretworkshop.net/peercompute/config/relay-config.json' }
      : { bootstrapPeers: ['/dns4/secretworkshop.net/tcp/443/wss/p2p/12D3KooWTestRelayPeer'] }),
    networkManagerFactory: async () => ({
      async initialize() {},
      async connect() {},
      async disconnect() {},
      getConnectedPeers() { return []; },
      getLibp2pNode() { return { getConnections }; },
    }),
  });
  await runtime.start();
  return runtime;
}

test('presence publishes only explicit coarse locations and rejects fallback precision leaks', () => {
  assert.equal(coarseRoadvectorPresence(
    { longitude: -149.90031, latitude: 61.21811 },
    { source: 'anchorage-fallback' },
  ), null);
  const presence = coarseRoadvectorPresence(
    { longitude: -149.90031, latitude: 61.21811 },
    { source: 'browser-geolocation' },
  );
  assert.equal(presence.schema, ROADVECTOR_PRESENCE_SCHEMA);
  assert.equal(presence.longitudeCell, -149.9);
  assert.equal(presence.latitudeCell, 61.2);
  assert.equal(JSON.stringify(presence).includes('-149.90031'), false);
  assert.equal(validateRoadvectorPresence({ ...presence, longitudeCell: -149.93 }), null);
});

test('remote players are stale-bounded, validated, capped, and fixed red', () => {
  const now = 10_000_000;
  const capability = {
    schema: ROADVECTOR_PRESENCE_SCHEMA,
    longitudeCell: -149.9,
    latitudeCell: 61.2,
    precisionDegrees: 0.1,
    mode: 'ride',
  };
  const peers = Array.from({ length: 70 }, (_, index) => ({
    peerId: `peer-${String(index).padStart(2, '0')}`,
    lastSeen: now - 1_000,
    capabilities: { roadvector: capability },
  }));
  peers.push({ peerId: 'stale', lastSeen: now - 20_000, capabilities: { roadvector: capability } });
  peers.push({ peerId: 'invalid', lastSeen: now, capabilities: { roadvector: { ...capability, latitudeCell: 999 } } });
  const markers = collectRoadvectorPeers(peers, { now });
  assert.equal(markers.length, 64);
  assert.ok(markers.every((marker) => marker.color === '#ff334f'));
  assert.equal(markers.some((marker) => marker.peerId === 'stale'), false);
  assert.equal(markers.some((marker) => marker.peerId === 'invalid'), false);
});

test('presence runtime uses PeerCompute capabilities and treats network failure as nonfatal', async () => {
  let config = null;
  let disconnected = false;
  const networkManagerFactory = async (value) => {
    config = value;
    return {
      async initialize() {},
      async connect() {},
      async disconnect() { disconnected = true; },
      getConnectedPeers() { return []; },
      getLibp2pNode() { return { getConnections: () => [relayConnection()] }; },
    };
  };
  const fetchImpl = async (url) => {
    if (String(url).includes('relay-config-source')) {
      return jsonResponse({ relayConfigUrl: 'https://secretworkshop.net/peercompute/config/relay-config.json' });
    }
    return jsonResponse({ bootstrapPeers: ['/dns4/relay.example/tcp/443/wss/p2p/peer'] });
  };
  const runtime = createRoadvectorPresenceRuntime({ fetchImpl, networkManagerFactory });
  runtime.setLocation({ longitude: -149.9, latitude: 61.2 }, { source: 'manual' });
  const ready = await runtime.start();
  assert.equal(ready.status, 'connected');
  assert.equal(ready.connected, true);
  assert.equal(ready.connections[0].encryption, '/noise');
  assert.equal(config.gameId, 'roadvector');
  assert.equal(config.enableScheduler, false);
  assert.equal(config.presenceCapabilitiesProvider().roadvector.longitudeCell, -149.9);
  runtime.clearLocation();
  assert.equal(config.presenceCapabilitiesProvider(), null);
  assert.equal(runtime.getSnapshot().publishingLocation, false);
  await runtime.dispose();
  assert.equal(disconnected, true);

  const failed = createRoadvectorPresenceRuntime({
    fetchImpl: async () => { throw new Error('offline'); },
  });
  const unavailable = await failed.start();
  assert.equal(unavailable.status, 'unavailable');
  assert.equal(unavailable.remotePlayerCount, 0);
  assert.equal(unavailable.synthetic, false);
  await failed.dispose();
});

test('connection status follows actual open connections through disconnect and reconnect', async () => {
  let connections = [];
  const runtime = await runtimeWithConnections(() => connections);
  assert.equal(runtime.getSnapshot().status, 'disconnected');
  assert.equal(runtime.getSnapshot().connected, false);

  connections = [relayConnection()];
  const open = runtime.getSnapshot();
  assert.equal(open.status, 'connected');
  assert.deepEqual(open.connections[0], {
    remotePeer: '12D3KooWTestRelayPeer',
    address: '/dns4/secretworkshop.net/tcp/443/wss/p2p/12D3KooWTestRelayPeer',
    status: 'open',
    encryption: '/noise',
    limited: false,
  });
  connections[0].status = 'closed';
  assert.equal(runtime.getSnapshot().status, 'disconnected');
  assert.equal(runtime.getSnapshot().connected, false);
  assert.equal(open.connections[0].status, 'open', 'previous snapshots must not alias live connection state');
  connections[0] = relayConnection({ encryption: 'native', limits: { bytes: 100n } });
  assert.equal(runtime.getSnapshot().connected, true);
  assert.equal(runtime.getSnapshot().connections[0].limited, true);
  await runtime.dispose();
  assert.equal(runtime.getSnapshot().status, 'disposed');
  assert.equal(runtime.getSnapshot().connected, false);
  assert.deepEqual(runtime.getSnapshot().connections, []);
});

test('public connection diagnostics are bounded, frozen and exclude private connection data', async () => {
  const records = Array.from({ length: 20 }, (_, index) => relayConnection({
    remotePeer: `PublicPeer${index}`,
    status: index < 10 ? 'closed' : 'open',
    secretKey: 'never-expose-this',
    streams: [{ prompt: 'private-message' }],
  }));
  const runtime = await runtimeWithConnections(() => records);
  const snapshot = runtime.getSnapshot();
  assert.equal(snapshot.maximumConnections, ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS);
  assert.equal(snapshot.connections.length, ROADVECTOR_PRESENCE_MAXIMUM_CONNECTIONS);
  assert.ok(snapshot.connections.every((connection) => connection.status === 'open'));
  assert.ok(Object.isFrozen(snapshot.connections));
  assert.ok(snapshot.connections.every(Object.isFrozen));
  const serialized = JSON.stringify(snapshot.connections);
  assert.equal(serialized.includes('never-expose-this'), false);
  assert.equal(serialized.includes('private-message'), false);
  assert.throws(() => { snapshot.connections[0].status = 'closed'; }, TypeError);
  await runtime.dispose();
});

test('connection diagnostics omit unsafe or overlong fields and fail closed when unavailable', async () => {
  let records = [
    relayConnection({ remotePeer: 'x'.repeat(257), remoteAddr: '/dns4/user:password@secretworkshop.net/tcp/443/wss' }),
    relayConnection({ remoteAddr: '/dns4/secretworkshop.net/tcp/443/wss/http-path/private-token' }),
    relayConnection({ remoteAddr: `/dns4/${'x'.repeat(2048)}/tcp/443/wss`, encryption: 'unexpected-private-value' }),
    relayConnection({ remotePeer: { toString() { throw new Error('unavailable'); } }, status: 'unexpected' }),
  ];
  const runtime = await runtimeWithConnections(() => {
    if (records === null) throw new Error('libp2p stopped');
    return records;
  });
  const snapshot = runtime.getSnapshot();
  assert.equal(snapshot.connections[0].remotePeer, null);
  assert.equal(snapshot.connections[0].address, null);
  assert.equal(snapshot.connections[1].address, null);
  assert.equal(snapshot.connections[2].address, null);
  assert.equal(snapshot.connections[2].encryption, 'unknown');
  assert.equal(snapshot.connections[3].remotePeer, null);
  assert.equal(snapshot.connections[3].status, 'unknown');
  records = null;
  assert.deepEqual(runtime.getSnapshot().connections, []);
  assert.equal(runtime.getSnapshot().connected, false);
  assert.equal(runtime.getSnapshot().status, 'disconnected');
  await runtime.dispose();
});
