import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ROADVECTOR_PRESENCE_SCHEMA,
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
  assert.equal(config.gameId, 'roadvector');
  assert.equal(config.enableScheduler, false);
  assert.equal(config.presenceCapabilitiesProvider().roadvector.longitudeCell, -149.9);
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
