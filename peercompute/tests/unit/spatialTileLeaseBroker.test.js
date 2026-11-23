import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SpatialTileLeaseBroker,
  SPATIAL_TILE_BOUNDARY_SCHEMA,
  SPATIAL_TILE_LEASE_SCHEMA,
  SPATIAL_TILE_STATES
} from '../../src/peercompute/stateManager/SpatialTileLeaseBroker.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

test('SpatialTileLeaseBroker enforces deterministic single-winner CAS tile leases and renewal', () => {
  let clock = 1_000;
  const events = [];
  const broker = new SpatialTileLeaseBroker({
    name: 'grid-cas',
    defaultTtlMs: 5_000,
    now: () => clock,
    onEvent: (evt) => events.push(evt)
  });

  const win = broker.acquireTile({
    tileId: 'tile:0:0:0',
    peerId: 'peer-alpha',
    expectedEpoch: 0,
    metadata: { level: 3 }
  });
  assert.equal(win.ok, true);
  assert.equal(win.lease.schema, SPATIAL_TILE_LEASE_SCHEMA);
  assert.equal(win.lease.peerId, 'peer-alpha');
  assert.equal(win.lease.epoch, 0);
  assert.equal(win.lease.expiresAt, 6_000);

  // Competing peer loses deterministically at the same epoch.
  const lose = broker.acquireTile({
    tileId: 'tile:0:0:0',
    peerId: 'peer-beta',
    expectedEpoch: 0
  });
  assert.equal(lose.ok, false);
  assert.equal(lose.reason, 'already-leased');
  assert.equal(lose.ownerPeerId, 'peer-alpha');
  assert.equal(lose.activeEpoch, 0);

  // Valid owner renews before TTL expiry.
  clock = 4_000;
  const renewed = broker.renewTile(win.lease.token, { ttlMs: 5_000 });
  assert.equal(renewed.ok, true);
  assert.equal(renewed.lease.expiresAt, 9_000);

  // Foreign/fake token fails closed.
  const fakeRenew = broker.renewTile({ key: 'tile:0:0:0', epoch: 0, reservationId: 999999 });
  assert.equal(fakeRenew.ok, false);
  assert.equal(fakeRenew.reason, 'invalid-token');

  // Release advances epoch fence so next winner acquires epoch 1.
  const released = broker.releaseTile(win.lease.token);
  assert.equal(released.ok, true);
  assert.equal(released.fencedEpoch, 0);
  assert.equal(released.nextEpoch, 1);

  const staleAttempt = broker.acquireTile({ tileId: 'tile:0:0:0', peerId: 'peer-beta', expectedEpoch: 0 });
  assert.equal(staleAttempt.ok, false);
  assert.equal(staleAttempt.reason, 'stale-epoch');

  const nextWin = broker.acquireTile({ tileId: 'tile:0:0:0', peerId: 'peer-beta', expectedEpoch: 1 });
  assert.equal(nextWin.ok, true);
  assert.equal(nextWin.lease.epoch, 1);
  assert.ok(events.some((evt) => evt.type === 'tile-acquired'));
  assert.ok(events.some((evt) => evt.type === 'tile-released'));
});

test('SpatialTileLeaseBroker gates opaque binary boundary summaries strictly by active epoch and owner', () => {
  let clock = 10_000;
  const admittedLog = [];
  const broker = new SpatialTileLeaseBroker({
    name: 'boundary-gate',
    defaultTtlMs: 2_000,
    maxPayloadBytes: 64,
    now: () => clock,
    onBoundaryAdmitted: (summary) => admittedLog.push(summary)
  });

  const leaseA = broker.acquireTile({ tileId: 'slab-7', peerId: 'peer-A' });
  assert.equal(leaseA.ok, true);

  // Valid opaque Float32Array payload (16 bytes) admitted and defensively copied.
  const srcPayload = new Float32Array([1.5, -2.25, 3.75, 4.0]);
  const admitted = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-A',
    epoch: leaseA.lease.epoch,
    token: leaseA.lease.token,
    schema: 'opaque.boundary.v1',
    payload: srcPayload,
    metadata: { step: 42 }
  });
  assert.equal(admitted.ok, true);
  assert.equal(admitted.summary.schema, SPATIAL_TILE_BOUNDARY_SCHEMA);
  assert.equal(admitted.summary.byteLength, 16);
  assert.match(admitted.summary.sha256, /^[a-f0-9]{64}$/);
  assert.equal(admittedLog.length, 1);

  // Mutating caller's source buffer must NOT mutate stored boundary bytes.
  srcPayload[0] = 9999;
  const readBack = broker.getBoundarySummary('slab-7', { expectedEpoch: 0 });
  assert.ok(readBack);
  const storedFloats = new Float32Array(readBack.payload.buffer, readBack.payload.byteOffset, 4);
  assert.equal(storedFloats[0], 1.5);
  assert.equal(broker.getBoundarySummary('slab-7', { expectedEpoch: 1 }), null);

  // Fail-closed rejections: non-owner, stale epoch, oversized, non-binary, empty.
  const wrongOwner = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-B',
    epoch: 0,
    payload: new Uint8Array([1, 2, 3, 4])
  });
  assert.equal(wrongOwner.ok, false);
  assert.equal(wrongOwner.reason, 'not-owner');

  const wrongEpoch = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-A',
    epoch: 1,
    payload: new Uint8Array([1, 2, 3, 4])
  });
  assert.equal(wrongEpoch.ok, false);
  assert.equal(wrongEpoch.reason, 'stale-epoch');

  const oversized = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-A',
    epoch: 0,
    payload: new Uint8Array(65)
  });
  assert.equal(oversized.ok, false);
  assert.equal(oversized.reason, 'payload-too-large');

  const nonBinary = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-A',
    epoch: 0,
    payload: { not: 'binary' }
  });
  assert.equal(nonBinary.ok, false);
  assert.equal(nonBinary.reason, 'invalid-payload');

  const emptyPayload = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-A',
    epoch: 0,
    payload: new ArrayBuffer(0)
  });
  assert.equal(emptyPayload.ok, false);
  assert.equal(emptyPayload.reason, 'empty-payload');

  // Advance clock past TTL -> automatic expiry + reassignment to peer-B at epoch 1.
  clock = 12_500;
  const expired = broker.expireLeases();
  assert.equal(expired.length, 1);
  assert.equal(expired[0].fencedEpoch, 0);
  assert.equal(expired[0].nextEpoch, 1);

  // Late submission from old owner at epoch 0 MUST fail closed.
  const staleSubmitAfterExpiry = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-A',
    epoch: 0,
    token: leaseA.lease.token,
    payload: new Uint8Array([9, 8, 7, 6])
  });
  assert.equal(staleSubmitAfterExpiry.ok, false);
  assert.equal(staleSubmitAfterExpiry.reason, 'stale-epoch');

  // Peer-B acquires epoch 1 and admits cleanly.
  const leaseB = broker.acquireTile({ tileId: 'slab-7', peerId: 'peer-B', expectedEpoch: 1 });
  assert.equal(leaseB.ok, true);
  assert.equal(leaseB.lease.epoch, 1);

  const admittedB = broker.admitBoundarySummary({
    tileId: 'slab-7',
    peerId: 'peer-B',
    summaryEpoch: 1,
    payload: new Uint8Array([7, 7, 7, 7]).buffer
  });
  assert.equal(admittedB.ok, true);
  assert.equal(admittedB.summary.epoch, 1);
});

test('SpatialTileLeaseBroker evictPeer fences dropped peer tiles and integrates with StateManager', async () => {
  const state = new StateManager(null, {
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true
  });
  await state.initialize();

  const reassignments = [];
  const broker = state.createSpatialTileLeaseBroker({
    name: 'octree',
    auditNamespace: 'tileAudit',
    summaryNamespace: 'tileSummaries'
  });
  assert.equal(state.getSpatialTileLeaseBroker('octree'), broker);

  broker.subscribe((event) => {
    if (event.type === 'tile-reassignment-needed') reassignments.push(event);
  });

  const l1 = broker.acquireTile({ tileId: 'oct:0', peerId: 'peer-drop' });
  const l2 = broker.acquireTile({ tileId: 'oct:1', peerId: 'peer-drop' });
  const l3 = broker.acquireTile({ tileId: 'oct:2', peerId: 'peer-keep' });
  assert.ok(l1.ok && l2.ok && l3.ok);

  const admit = broker.admitBoundarySummary({
    tileId: 'oct:2',
    peerId: 'peer-keep',
    epoch: l3.lease.epoch,
    schema: 'opaque.octree.v0',
    payload: new Uint8Array([1, 2, 3, 4])
  });
  assert.equal(admit.ok, true);
  assert.equal(state.readScoped('tileSummaries', 'oct:2')?.sha256, admit.summary.sha256);

  const eviction = broker.evictPeer('peer-drop');
  assert.equal(eviction.evictedCount, 2);
  assert.equal(reassignments.length, 2);
  assert.equal(broker.fence('oct:0').epoch, 1);
  assert.equal(broker.fence('oct:0').state, SPATIAL_TILE_STATES.EVICTED);
  assert.equal(broker.fence('oct:2').state, SPATIAL_TILE_STATES.LEASED);

  // Old owner fails closed on evicted tile.
  const staleAfterEvict = broker.admitBoundarySummary({
    tileId: 'oct:0',
    peerId: 'peer-drop',
    epoch: 0,
    payload: new Uint8Array([5, 6])
  });
  assert.equal(staleAfterEvict.ok, false);
  assert.equal(staleAfterEvict.reason, 'stale-epoch');

  await state.destroy();
  assert.equal(broker.destroyed, true);
  assert.equal(broker.acquireTile({ tileId: 'oct:9', peerId: 'peer-keep' }).reason, 'destroyed');
});
