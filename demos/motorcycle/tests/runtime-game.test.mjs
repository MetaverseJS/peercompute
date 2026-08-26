import assert from 'node:assert/strict';
import test from 'node:test';

import { GEODATA_LIMITS } from '../../../services/geodata/src/config.js';
import { parseAndSnapBbox } from '../../../services/geodata/src/osm/bbox.js';
import { normalizeOverpassRegion } from '../../../services/geodata/src/osm/normalize.js';
import { createOverpassFixture } from '../../../services/geodata/test/fixture.js';
import { createMotorcycleGameRuntime } from '../src/runtime/gameRuntime.js';
import { createGlobeSurfaceStream } from '../src/runtime/globeSurfaceStream.js';
import { createTrafficCollisionCloud, trafficPose } from '../src/runtime/trafficPhysics.js';
import {
  createTerrainDrapedRoadSurface,
  MOTORCYCLE_ROAD_DECK_CLEARANCE_METERS,
} from '../src/world/roadSurface.js';
import { createRoadTerrainSurface } from '../src/world/roadSurfaceCollider.js';
import { createMotorcycleSceneData } from '../src/world/sceneData.js';
import { createDerivedFlatTerrainGrid } from '../src/world/terrainGrid.js';
import { rideTileAt, rideTileBounds } from '../src/world/rideTile.js';

const BBOX = [-0.02, -0.02, 0.04, 0.04];

function sceneFixture() {
  const parsed = parseAndSnapBbox(BBOX.join(','), GEODATA_LIMITS);
  const data = normalizeOverpassRegion(createOverpassFixture(), {
    bbox: parsed,
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits: GEODATA_LIMITS,
  });
  const envelope = {
    schemaVersion: 'peercompute.geo.osm-region.v1',
    status: 'current',
    source: 'openstreetmap-overpass',
    synthetic: false,
    bbox: { values: parsed.values },
    provenance: {
      attribution: '© OpenStreetMap contributors',
      licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/',
    },
    data,
  };
  const terrain = createDerivedFlatTerrainGrid({ bbox: BBOX });
  return { terrain, sceneData: createMotorcycleSceneData(envelope, terrain) };
}

function control(sequence, patch = {}) {
  return {
    sequence,
    steer: 0,
    throttle: 0,
    frontBrake: 0,
    rearBrake: 0,
    clutch: 0,
    shiftDelta: 0,
    handbrake: false,
    reset: false,
    cameraToggle: false,
    recenter: false,
    ...patch,
  };
}

async function waitFor(predicate, message) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  assert.fail(message);
}

function createFlatRideTile(tile) {
  const bounds = rideTileBounds(tile);
  const terrain = createDerivedFlatTerrainGrid({ bbox: bounds.bbox });
  return Object.freeze({
    ...terrain,
    rideTile: bounds.tile,
    coreBbox: bounds.bbox,
    halo: Object.freeze({ sourcePixels: 1, geometryOverlapVertices: 0 }),
    resource: Object.freeze({
      residentBytes: terrain.heights.byteLength + terrain.positions.byteLength,
      vertexCount: terrain.positions.length / 3,
      triangleCount: 8,
    }),
  });
}

function createFlatRideRoad(tile) {
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.test-road-tile.v1',
    tile,
    resource: Object.freeze({ residentBytes: 1, vertexCount: 0 }),
    sampleLocalSurface: () => null,
    dispose: () => true,
  });
}

test('composes the six-body motorcycle, real road graph, terrain contact, and synthetic traffic', () => {
  const { terrain, sceneData } = sceneFixture();
  const runtime = createMotorcycleGameRuntime({
    terrain,
    sceneData,
    trafficVehicleCount: 3,
    maximumPhysicalTrafficVehicles: 3,
  });
  assert.equal(runtime.rig.componentCount, 6);
  assert.equal(runtime.trafficPhysics.added, 3);
  assert.equal(runtime.world.getSnapshot().bodies.length, 9);
  for (let sequence = 1; sequence <= 60; sequence += 1) {
    runtime.stepFrame(1 / 60, {
      sequence,
      steer: sequence < 30 ? 0.18 : -0.12,
      throttle: 0.35,
      frontBrake: 0,
      rearBrake: 0,
      clutch: 0,
      shiftDelta: sequence === 40 ? 1 : 0,
      handbrake: false,
      reset: false,
      cameraToggle: false,
      recenter: false,
    });
  }
  const state = runtime.getState();
  assert.equal(state.frameCount, 60);
  assert.equal(state.syntheticTraffic, true);
  assert.equal(state.liveTraffic, false);
  assert.equal(state.traffic.spawnedVehicleCount, 3);
  assert.equal(state.race.schemaVersion, 'peercompute.motorcycle.road-race-snapshot.v1');
  assert.equal(state.raceCourse.schemaVersion, 'peercompute.motorcycle.road-race-course.v1');
  assert.equal(state.raceCourse.source.data, 'real OSM road graph');
  assert.equal(state.raceCourse.source.navigationGrade, false);
  assert.deepEqual(runtime.rig.rootPosition, new Float32Array(state.raceCourse.start.positionLocal));
  assert.equal(state.motorcycle.componentCount, 6);
  assert.ok(Math.abs(state.physicsProfile.fixedDt - 1 / 120) < 1e-8);
  assert.equal(state.physicsProfile.solverIterations, 12);
  assert.equal(state.physicsProfile.maxSubSteps, 8);
  assert.equal(state.physics.overflows.overflowed, false);
  assert.equal(state.roadSurface.geometry.collisionModel, 'single-composite-static-heightfield');
  assert.equal(state.roadSurface.geometry.deckClearanceMeters, MOTORCYCLE_ROAD_DECK_CLEARANCE_METERS);
  assert.equal(state.roadSurface.collider.roadAware, true);
  assert.ok(runtime.world.getSnapshot().bodies.every((body) => (
    [...body.position, ...body.orientation, ...body.linearVelocity, ...body.angularVelocity].every(Number.isFinite)
  )));
  runtime.dispose();
  assert.equal(runtime.getState().disposed, true);
});

test('one bounded terrain-draped road model supplies exact render height and physical tire contact', () => {
  const { terrain, sceneData } = sceneFixture();
  const roadSurface = createTerrainDrapedRoadSurface(terrain, sceneData.roadSegments);
  assert.equal(Object.isFrozen(roadSurface), true);
  assert.equal(Object.isFrozen(roadSurface.groups), true);
  const surfaceTelemetry = roadSurface.getTelemetry();
  assert.equal(surfaceTelemetry.elevationModel, 'exact-terrain-triangle-plus-shared-deck-clearance');
  assert.equal(surfaceTelemetry.collisionModel, 'single-composite-static-heightfield');
  assert.ok(surfaceTelemetry.triangleCount > 0);
  assert.equal(surfaceTelemetry.collisionFootprintCount, surfaceTelemetry.renderedSourceSegmentCount);
  assert.ok(surfaceTelemetry.spatialReferenceCount > 0);
  assert.ok(surfaceTelemetry.maximumCandidatesPerBin > 0);

  const sourceSegment = sceneData.roadSegments.find((segment) => {
    const x = (segment.from[0] + segment.to[0]) / 2;
    const z = (segment.from[2] + segment.to[2]) / 2;
    return roadSurface.sampleLocalSurface(x, z);
  });
  assert.ok(sourceSegment);
  const x = (sourceSegment.from[0] + sourceSegment.to[0]) / 2;
  const z = (sourceSegment.from[2] + sourceSegment.to[2]) / 2;
  const roadSample = roadSurface.sampleLocalSurface(x, z);
  const terrainSample = terrain.sampleLocalSurface(x, z);
  assert.equal(roadSample.surfaceKind, 'osm-road');
  assert.ok(
    Math.abs(roadSample.height - terrainSample.height - MOTORCYCLE_ROAD_DECK_CLEARANCE_METERS) < 2e-4,
  );

  const collider = createRoadTerrainSurface(terrain, { roadSurface });
  const radius = 0.2;
  const contact = collider.sampleSphere({ center: [x, roadSample.height + radius, z], radius });
  assert.ok(Math.abs(contact.signedDistance) < 2e-4);
  assert.equal(contact.metadata.surfaceKind, 'osm-road');
  assert.equal(contact.metadata.roadSegmentId, roadSample.roadSegmentId);
  assert.equal(contact.metadata.roadDeckClearanceMeters, MOTORCYCLE_ROAD_DECK_CLEARANCE_METERS);

  let offRoad = null;
  for (let row = 0; row <= 16 && !offRoad; row += 1) {
    for (let column = 0; column <= 16; column += 1) {
      const candidateX = terrain.localBounds.minX
        + (terrain.localBounds.maxX - terrain.localBounds.minX) * column / 16;
      const candidateZ = terrain.localBounds.minZ
        + (terrain.localBounds.maxZ - terrain.localBounds.minZ) * row / 16;
      if (!roadSurface.containsLocalRoad(candidateX, candidateZ)
        && terrain.sampleLocalSurface(candidateX, candidateZ)) {
        offRoad = [candidateX, candidateZ];
        break;
      }
    }
  }
  assert.ok(offRoad, 'fixture must expose ordinary terrain outside a road footprint');
  const offRoadHeight = terrain.sampleLocalHeight(...offRoad);
  const terrainContact = collider.sampleSphere({
    center: [offRoad[0], offRoadHeight + radius, offRoad[1]],
    radius,
  });
  assert.ok(Math.abs(terrainContact.signedDistance) < 2e-4);
  assert.equal(terrainContact.metadata.surfaceKind, 'terrain');
  assert.equal(terrainContact.metadata.roadSegmentId, null);
});

test('composite road sweep uses one endpoint sample for slow motion and bounded adaptive CCD', () => {
  const { terrain, sceneData } = sceneFixture();
  const roadSurface = createTerrainDrapedRoadSurface(terrain, sceneData.roadSegments);
  const sourceSegment = sceneData.roadSegments.find((segment) => roadSurface.sampleLocalSurface(
    (segment.from[0] + segment.to[0]) / 2,
    (segment.from[2] + segment.to[2]) / 2,
  ));
  assert.ok(sourceSegment);
  const x = (sourceSegment.from[0] + sourceSegment.to[0]) / 2;
  const z = (sourceSegment.from[2] + sourceSegment.to[2]) / 2;
  const height = roadSurface.sampleLocalSurface(x, z).height;
  const radius = 0.2;
  const collider = createRoadTerrainSurface(terrain, { roadSurface });
  const before = collider.getTelemetry();

  for (let index = 0; index < 64; index += 1) {
    const miss = collider.sweepSphere({
      from: [x, height + radius + 1, z],
      to: [x + 0.001, height + radius + 1, z],
      radius,
    });
    assert.equal(miss.hit, false);
    assert.ok(Number.isFinite(miss.signedDistance));
  }
  const slow = collider.getTelemetry();
  assert.equal(slow.sweepQueries - before.sweepQueries, 64);
  assert.equal(slow.sampleQueries - before.sampleQueries, 64);
  assert.equal(slow.sweepSampleCount - before.sweepSampleCount, 64);
  assert.equal(slow.endpointOnlySweepCount - before.endpointOnlySweepCount, 64);
  assert.equal(slow.adaptiveSweepCount - before.adaptiveSweepCount, 0);

  const crossing = collider.sweepSphere({
    from: [x, height + radius + 2, z],
    to: [x, height - radius - 2, z],
    radius,
  });
  assert.equal(crossing.hit, true);
  assert.equal(crossing.swept, true);
  assert.ok(crossing.toi > 0 && crossing.toi <= 1);
  const adaptive = collider.getTelemetry();
  assert.equal(adaptive.adaptiveSweepCount - slow.adaptiveSweepCount, 1);
  assert.equal(adaptive.maximumSweepSegmentsUsed, 8);
  assert.equal(adaptive.maximumSweepSegments, 8);
  assert.ok(adaptive.sweepSampleCount - slow.sweepSampleCount <= 8);
});

test('parked six-body tires settle through road impulses on the shared OSM deck', () => {
  const runtime = createMotorcycleGameRuntime({
    ...sceneFixture(),
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
  });
  for (let sequence = 1; sequence <= 60; sequence += 1) {
    runtime.stepFrame(1 / 60, control(sequence));
  }
  const tireContacts = runtime.world.getContacts().filter((contact) => contact.metadata?.tire);
  assert.ok(tireContacts.length > 0);
  assert.ok(tireContacts.every((contact) => contact.surfaceId === 'real-terrain-surface'));
  assert.ok(tireContacts.every((contact) => contact.metadata.surfaceKind === 'osm-road'));
  assert.ok(tireContacts.every((contact) => typeof contact.metadata.roadSegmentId === 'string'));
  assert.ok(tireContacts.some((contact) => contact.normalImpulse > 0));
  const state = runtime.getState();
  assert.equal(Object.isFrozen(runtime.roadSurface), true);
  assert.ok(state.roadSurface.collider.roadHits > 0);
  assert.equal(
    state.roadSurface.collider.sampleQueries,
    state.roadSurface.collider.sweepSampleCount,
    'sweep misses retain their endpoint distance instead of triggering a duplicate fallback query',
  );
  assert.ok(
    state.roadSurface.collider.sampleQueries / state.frameCount < 300,
    'stationary player surface work remains bounded below 300 height samples per render frame',
  );
  assert.ok(
    state.roadSurface.collider.endpointOnlySweepCount
      > state.roadSurface.collider.adaptiveSweepCount,
  );
  assert.equal(state.physics.overflows.overflowed, false);
  runtime.dispose();
});

test('runtime reset coordinates traffic RNG state and controller snapshot topology', () => {
  const fixture = sceneFixture();
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
  });
  const initialTraffic = runtime.traffic.getSnapshot();
  runtime.stepFrame(0.1, {
    sequence: 1,
    throttle: 1,
    steer: 0,
    frontBrake: 0,
    rearBrake: 0,
    clutch: 0,
    shiftDelta: 0,
    handbrake: false,
    reset: false,
  });
  assert.ok(runtime.traffic.getSnapshot().sequence > 0);
  const reset = runtime.reset();
  assert.equal(reset.frameCount, 0);
  assert.deepEqual(runtime.traffic.getSnapshot(), initialTraffic);
  assert.equal(reset.race.status, 'ready');
  assert.equal(reset.race.timing.suppliedTimeSeconds, null);
  assert.equal(runtime.world.getSnapshot().bodies.length, 8);
  runtime.dispose();
});

test('runtime advances the race from swept physics motion and resets it atomically', () => {
  const runtime = createMotorcycleGameRuntime({
    ...sceneFixture(),
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
  });
  const startGate = runtime.raceCourse.gates[0];
  const chassis = runtime.world.getBody(runtime.rig.bodyIds.chassis);
  const target = [
    startGate.positionLocal[0] + startGate.forwardLocal[0] * 3,
    chassis.position[1],
    startGate.positionLocal[2] + startGate.forwardLocal[2] * 3,
  ];
  const translation = [target[0] - chassis.position[0], 0, target[2] - chassis.position[2]];
  for (const bodyId of runtime.rig.bodyIdList) {
    const body = runtime.world.getBody(bodyId);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) {
      body[field][0] += translation[0];
      body[field][2] += translation[2];
    }
  }

  const step = runtime.stepFrame(1 / 60, control(1));
  assert.equal(step.physicsSubsteps, 2);
  assert.equal(step.race.status, 'racing');
  assert.equal(step.race.progress.acceptedPassageCount, 1);
  assert.equal(step.race.progress.expectedGateIndex, 1);
  assert.equal(runtime.getState().race.status, 'racing');
  assert.ok(step.race.timing.suppliedTimeSeconds > 0);

  const reset = runtime.reset();
  assert.equal(reset.race.status, 'ready');
  assert.equal(reset.race.progress.expectedGateIndex, 0);
  assert.equal(reset.race.timing.suppliedTimeSeconds, null);
  runtime.dispose();
});

test('renders a larger synthetic traffic population while bounding physical collision cages', () => {
  const runtime = createMotorcycleGameRuntime({
    ...sceneFixture(),
    trafficVehicleCount: 4,
    maximumPhysicalTrafficVehicles: 1,
  });
  const state = runtime.getState();
  assert.equal(state.traffic.spawnedVehicleCount, 4);
  assert.equal(state.trafficSnapshot.vehicleCount, 4);
  assert.equal(state.trafficPhysics.added, 1);
  assert.equal(state.trafficPhysics.omitted, 3);
  assert.equal(runtime.world.getSnapshot().bodies.length, 7);
  runtime.dispose();
});

test('built-runtime diagnostic proves a synthetic traffic cage transfers collision impulse', () => {
  const runtime = createMotorcycleGameRuntime({
    ...sceneFixture(),
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
  });
  const result = runtime.runTrafficImpactScenario();
  assert.equal(result.schemaVersion, 'peercompute.motorcycle.traffic-impact-scenario.v1');
  assert.ok(result.collisionStep !== null && result.collisionStep < 48);
  assert.ok(result.maximumImpulse > 0);
  assert.ok(result.maximumPenetration >= 0);
  assert.equal(result.finite, true);
  assert.equal(result.overflowed, false);
  assert.equal(result.source.syntheticTraffic, true);
  assert.equal(result.source.liveTraffic, false);
  assert.equal(runtime.getState().frameCount, 0, 'diagnostic restores the game state after impact');
  runtime.dispose();
});

test('traffic WGS84 heading is converted to the local east/up/south physics frame', () => {
  const terrain = createDerivedFlatTerrainGrid({ bbox: BBOX });
  const northbound = trafficPose({
    coordinates: [0.01, 0.01],
    dimensionsMeters: [4, 2, 1.5],
    headingRadians: 0,
  }, terrain);
  assert.ok(northbound.position.every(Number.isFinite));
  assert.ok(Math.abs(northbound.orientation[1] - 1) < 1e-9);
  assert.ok(Math.abs(northbound.orientation[3]) < 1e-9);
});

test('traffic particle cages preserve the reported outer vehicle dimensions', () => {
  const dimensionsMeters = [4.3, 1.8, 1.45];
  const cloud = createTrafficCollisionCloud({
    kind: 'commuter',
    dimensionsMeters,
  });
  const expectedHalfExtents = [
    dimensionsMeters[1] / 2,
    dimensionsMeters[2] / 2,
    dimensionsMeters[0] / 2,
  ];
  for (let axis = 0; axis < 3; axis += 1) {
    let outerExtent = 0;
    for (let index = 0; index < cloud.radii.length; index += 1) {
      outerExtent = Math.max(
        outerExtent,
        Math.abs(cloud.positions[index * 3 + axis]) + cloud.radii[index],
      );
    }
    assert.ok(Math.abs(outerExtent - expectedHalfExtents[axis]) < 1e-6);
  }
});

test('queues one-shot shift edges across zero-substep frames and applies reset atomically', () => {
  const runtime = createMotorcycleGameRuntime({
    ...sceneFixture(),
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
  });
  assert.equal(runtime.setAutomaticTransmission(false).transmissionMode, 'manual');
  const first = runtime.stepFrame(1 / 240, control(1, { shiftDelta: 1 }));
  assert.equal(first.physicsSubsteps, 0);
  assert.equal(runtime.getState().motorcycle.gear, 1);
  assert.deepEqual(runtime.getState().pendingInputEdges.shifts, [1]);
  runtime.stepFrame(1 / 240, control(2));
  runtime.stepFrame(1 / 240, control(3));
  const consumed = runtime.stepFrame(1 / 240, control(4));
  assert.equal(consumed.physicsSubsteps, 1);
  assert.equal(runtime.getState().motorcycle.gear, 2);
  assert.equal(runtime.getState().pendingInputEdges.shiftCount, 0);

  const fourSubsteps = runtime.stepFrame(1 / 30, control(5, { shiftDelta: -1 }));
  assert.equal(fourSubsteps.physicsSubsteps, 4);
  assert.equal(runtime.getState().motorcycle.gear, 1, 'one edge is consumed exactly once across all substeps');

  runtime.stepFrame(1 / 60, control(6, { throttle: 1 }));
  assert.ok(runtime.traffic.getSnapshot().sequence > 0);
  const resetFrame = runtime.stepFrame(1 / 240, control(7, { reset: true }));
  assert.equal(resetFrame.physicsSubsteps, 0);
  assert.equal(resetFrame.resetApplied, true);
  assert.equal(runtime.traffic.getSnapshot().sequence, 0);
  const resetState = runtime.getState();
  const resetChassis = runtime.world.getBody(runtime.rig.bodyIds.chassis);
  const originalChassisPosition = resetChassis.position.map((value, index) => (
    value + resetState.origin.offset[index]
  ));
  assert.ok(Math.abs(originalChassisPosition[0] - runtime.rig.rootPosition[0]) < 2e-2);
  assert.ok(Math.abs(originalChassisPosition[2] - runtime.rig.rootPosition[2]) < 2e-2);
  assert.ok(runtime.world.getSnapshot().bodies.every((body) => (
    [...body.position, ...body.orientation, ...body.linearVelocity, ...body.angularVelocity]
      .every(Number.isFinite)
  )));
  assert.equal(runtime.getState().pendingInputEdges.shiftCount, 0);
  assert.equal(runtime.stepFrame(1 / 240, control(8)).resetApplied, false);
  runtime.dispose();
});

test('changing transmission mode clears queued one-shot shift edges', () => {
  const runtime = createMotorcycleGameRuntime({
    ...sceneFixture(),
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
  });
  const queued = runtime.stepFrame(1 / 240, control(1, { shiftDelta: 1 }));
  assert.equal(queued.physicsSubsteps, 0);
  assert.deepEqual(runtime.getState().pendingInputEdges.shifts, [1]);
  const manual = runtime.setAutomaticTransmission(false);
  assert.equal(manual.transmissionMode, 'manual');
  assert.equal(runtime.getState().pendingInputEdges.shiftCount, 0);
  const automatic = runtime.setAutomaticTransmission(true);
  assert.equal(automatic.transmissionMode, 'automatic');
  assert.equal(runtime.getState().pendingInputEdges.shiftCount, 0);
  runtime.dispose();
});

test('commits globe terrain and full ENU handoffs without resetting outside the seed region', async () => {
  const fixture = sceneFixture();
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => createFlatRideTile(tile),
    loadRoadTile: null,
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9,
    'streamed terrain did not qualify its active 3x3 ring',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
    rebaseThresholdMeters: 20,
  });
  for (const bodyId of runtime.rig.bodyIdList) {
    const body = runtime.world.getBody(bodyId);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) body[field][0] += 50;
  }
  const handedOff = runtime.stepFrame(1 / 120, control(1));
  assert.equal(handedOff.physicsSubsteps, 1);
  assert.equal(handedOff.boundaryReset, null);
  assert.ok(handedOff.referenceFrameTransform);
  assert.equal(handedOff.referenceFrameTransform.schema, 'peercompute.geo.enu-frame-transform.v1');
  const state = runtime.getState();
  assert.equal(state.origin.mode, 'wgs84-ecef-enu-stream');
  assert.equal(state.origin.referenceFrameTransformCount, 1);
  assert.ok(Math.abs(runtime.world.options.gravity[0]) < 1e-12);
  assert.ok(Math.abs(runtime.world.options.gravity[1] + 9.81) < 1e-5);
  assert.ok(Math.abs(runtime.world.options.gravity[2]) < 1e-12);
  assert.equal(state.boundary.resetCount, 0);
  assert.equal(state.globe.stream.committed.activeKeys.length, 9);
  assert.equal(state.globe.collision.fallbackEnabled, true);
  assert.equal(state.roadSurface.collider.schemaVersion,
    'peercompute.motorcycle.streaming-surface-collider.telemetry.v1');
  assert.ok(Number.isFinite(runtime.sampleSurfaceHeight(
    runtime.world.getBody(runtime.rig.bodyIds.chassis).position,
  )));

  // Exceed both the seed terrain and committed stream coverage before the next
  // ring qualifies. The deterministic solver must wait, not teleport or use a
  // fabricated plane.
  for (const bodyId of runtime.rig.bodyIdList) {
    const body = runtime.world.getBody(bodyId);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) body[field][0] += 10_000;
  }
  const waiting = runtime.stepFrame(1 / 60, control(2, { throttle: 1 }));
  assert.equal(waiting.physicsSubsteps, 0);
  assert.equal(waiting.streamWait, true);
  assert.equal(waiting.boundaryReset, null);
  assert.equal(runtime.getState().boundary.action, 'stream-wait');
  assert.equal(runtime.getState().boundary.resetCount, 0);
  assert.ok(runtime.getState().globe.streamWaitSeconds >= 1 / 60);
  assert.equal(runtime.getState().regionActivity.raceStatus, 'out-of-region');
  assert.equal(runtime.getState().regionActivity.trafficStatus, 'out-of-region');
  assert.equal(runtime.getState().regionActivity.physicalTrafficActive, false);
  assert.ok(runtime.trafficPhysics.bindings.every((binding) => {
    const body = runtime.world.getBody(binding.bodyId);
    return body.collisionMask === 0 && body.metadata.physicsActive === false;
  }), 'seed traffic cages leave the broadphase while the rider is out of region');
  const resetAtDistance = runtime.stepFrame(1 / 240, control(3, { reset: true }));
  assert.equal(resetAtDistance.resetApplied, true);
  assert.ok(resetAtDistance.referenceFrameTransform);
  const resetState = runtime.getState();
  const resetChassis = runtime.world.getBody(runtime.rig.bodyIds.chassis);
  assert.ok(Math.abs(resetChassis.position[0] - runtime.rig.rootPosition[0]) < 0.1);
  assert.ok(Math.abs(resetChassis.position[2] - runtime.rig.rootPosition[2]) < 0.1);
  assert.ok(Math.abs(resetState.globe.pose.longitude - fixture.terrain.frame.origin.longitude) < 0.01);
  assert.ok(Math.abs(resetState.globe.pose.latitude - fixture.terrain.frame.origin.latitude) < 0.01);
  assert.equal(resetState.globe.collision.streamEnabled, false);
  assert.equal(resetState.globe.collision.fallbackEnabled, true);
  assert.equal(resetState.regionActivity.seedRegionActive, true);
  assert.ok(runtime.trafficPhysics.bindings.every((binding) => {
    const body = runtime.world.getBody(binding.bodyId);
    return body.collisionMask === binding.collisionMask && body.metadata.physicsActive === true;
  }), 'reset restores the bounded seed traffic cages');
  assert.ok(Number.isFinite(runtime.sampleSurfaceHeight(resetChassis.position)));
  runtime.dispose();
  assert.equal(surfaceStream.getStatus().state, 'disposed');
});

test('crosses the seed-region edge onto a newly committed off-road terrain generation', async () => {
  const fixture = sceneFixture();
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => createFlatRideTile(tile),
    loadRoadTile: null,
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9,
    'initial active terrain ring did not qualify',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
    rebaseThresholdMeters: 20,
  });
  runtime.stepFrame(0, control(1));
  const initialGeneration = runtime.getState().globe.stream.committed.generation;
  for (const bodyId of runtime.rig.bodyIdList) {
    const body = runtime.world.getBody(bodyId);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) body[field][0] += 4_000;
  }
  runtime.stepFrame(1 / 120, control(2));
  await waitFor(
    () => surfaceStream.getStatus().generation > initialGeneration
      && surfaceStream.getStatus().counts.activeTerrainReady === 9,
    'next off-road terrain generation did not qualify',
  );
  const resumed = runtime.stepFrame(1 / 120, control(3));
  const state = runtime.getState();
  const chassis = runtime.world.getBody(runtime.rig.bodyIds.chassis);
  const sample = runtime.sampleSurface(chassis.position);
  assert.equal(resumed.boundaryReset, null);
  assert.ok(state.globe.stream.committed.generation > initialGeneration);
  assert.equal(state.boundary.resetCount, 0);
  assert.equal(state.regionActivity.seedRegionActive, false);
  assert.equal(sample.available, true);
  assert.equal(sample.surfaceKind, 'terrain');
  assert.equal(typeof sample.tileKey, 'string');
  assert.equal(sample.snapshotRevision, state.globe.stream.committed.revision);
  runtime.dispose();
});

test('reference-frame participant preparation fails before physics or stream state mutates', async () => {
  const fixture = sceneFixture();
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => createFlatRideTile(tile),
    loadRoadTile: null,
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9,
    'streamed terrain did not qualify its active ring',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
    rebaseThresholdMeters: 20,
  });
  runtime.setReferenceFrameParticipants([{
    prepareReferenceFrameTransform() {
      throw new Error('injected participant preparation failure');
    },
  }]);
  for (const bodyId of runtime.rig.bodyIdList) {
    const body = runtime.world.getBody(bodyId);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) body[field][0] += 50;
  }
  const before = runtime.world.getSnapshot();
  const beforeStream = surfaceStream.getSnapshot();
  assert.throws(
    () => runtime.stepFrame(1 / 120, control(1)),
    /injected participant preparation failure/,
  );
  const after = runtime.world.getSnapshot();
  assert.deepEqual(after.bodies, before.bodies);
  assert.equal(surfaceStream.getSnapshot(), beforeStream);
  assert.equal(runtime.getState().origin.referenceFrameTransformCount, 0);
  assert.equal(runtime.getState().frameCount, 0);

  runtime.setReferenceFrameParticipants([{
    prepareReferenceFrameTransform() {
      return { commit() { throw new Error('must never be reached'); } };
    },
  }]);
  assert.throws(
    () => runtime.stepFrame(1 / 120, control(2)),
    /validated synchronous no-throw commit/,
  );
  assert.deepEqual(runtime.world.getSnapshot().bodies, before.bodies);
  assert.equal(surfaceStream.getSnapshot(), beforeStream);
  runtime.dispose();
});

test('withholds every substep when the swept tire envelope outruns committed terrain coverage', async () => {
  const fixture = sceneFixture();
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => createFlatRideTile(tile),
    loadRoadTile: null,
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9,
    'streamed terrain did not qualify its active ring',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
  });
  for (const bodyId of [runtime.rig.bodyIds.rearWheel, runtime.rig.bodyIds.frontWheel]) {
    runtime.world.getBody(bodyId).linearVelocity[0] = 500_000;
  }
  const before = runtime.world.getSnapshot();
  const withheld = runtime.stepFrame(1 / 15, control(1, { throttle: 1 }));
  assert.equal(withheld.physicsSubsteps, 0);
  assert.equal(withheld.streamWait, true);
  assert.equal(runtime.getState().globe.coveragePreflight.available, false);
  assert.deepEqual(runtime.world.getSnapshot().bodies, before.bodies);
  runtime.dispose();
});

test('inactive desired-tile completions do not rebuild the unchanged active terrain snapshot', async () => {
  const fixture = sceneFixture();
  const center = rideTileAt(fixture.terrain.frame.origin);
  const blockedKey = `${center.z}/${(center.x + 2) % (2 ** center.z)}/${center.y}`;
  let releaseOuterTile;
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => {
      if (tile.key === blockedKey) {
        await new Promise((resolve) => { releaseOuterTile = resolve; });
      }
      return createFlatRideTile(tile);
    },
    loadRoadTile: null,
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9 && releaseOuterTile,
    'active terrain did not qualify before the controlled outer tile',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
  });
  runtime.stepFrame(0, control(1));
  const first = runtime.getState();
  assert.ok(first.globe.stream.committed.revision > 0);
  releaseOuterTile();
  await waitFor(
    () => surfaceStream.getStatus().counts.inflight === 0
      && surfaceStream.getStatus().counts.queued === 0,
    'outer desired terrain did not settle',
  );
  runtime.stepFrame(0, control(2));
  const after = runtime.getState();
  assert.equal(after.globe.stream.committed.revision, first.globe.stream.committed.revision);
  assert.ok(after.globe.activeSnapshotNoopCount > first.globe.activeSnapshotNoopCount);
  assert.equal(after.lastStep.streamCommit, null, 'an inactive content no-op is not a phantom commit');
  runtime.dispose();
});

test('retries the same active content epoch after participant preparation rejects publication', async () => {
  const fixture = sceneFixture();
  const center = rideTileAt(fixture.terrain.frame.origin);
  let releaseRoad;
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => createFlatRideTile(tile),
    loadRoadTile: async (tile) => {
      if (tile.key !== center.key) return null;
      await new Promise((resolve) => { releaseRoad = resolve; });
      return createFlatRideRoad(tile);
    },
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9 && releaseRoad,
    'terrain did not qualify while the controlled active road was pending',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
  });
  let rejectNextSurface = false;
  let surfacePreparationCount = 0;
  runtime.setReferenceFrameParticipants([{
    prepareReferenceFrameTransform() {
      return {
        commitModel: 'validated-synchronous-noexcept',
        commit: () => true,
      };
    },
    prepareSurfaceSnapshot() {
      surfacePreparationCount += 1;
      if (rejectNextSurface) {
        rejectNextSurface = false;
        throw new Error('injected surface preparation failure');
      }
      return {
        commitModel: 'validated-synchronous-noexcept',
        commit: () => true,
      };
    },
  }]);
  runtime.stepFrame(0, control(1));
  const beforeRoad = runtime.getState();
  assert.ok(beforeRoad.lastStep.streamCommit);
  rejectNextSurface = true;
  releaseRoad();
  await waitFor(
    () => surfaceStream.getStatus().counts.roadPending === 0
      && surfaceStream.getStatus().contentEpoch > beforeRoad.globe.stream.contentEpoch,
    'controlled active road did not settle',
  );
  assert.throws(
    () => runtime.stepFrame(0, control(2)),
    /injected surface preparation failure/,
  );
  const rejected = runtime.getState();
  assert.equal(
    rejected.globe.evaluatedContentEpoch,
    beforeRoad.globe.evaluatedContentEpoch,
    'rejected publication cannot consume the active content epoch',
  );
  const retried = runtime.stepFrame(0, control(3));
  const afterRoad = runtime.getState();
  assert.ok(retried.streamCommit);
  assert.equal(afterRoad.globe.evaluatedContentEpoch, afterRoad.globe.stream.contentEpoch);
  assert.equal(afterRoad.globe.stream.committed.contentEpoch, afterRoad.globe.stream.contentEpoch);
  assert.ok(surfacePreparationCount >= 3, 'initial, rejected, and retried preparations all ran');
  runtime.dispose();
});

test('reset disables a same-frame streamed snapshot and restores the seed fallback', async () => {
  const fixture = sceneFixture();
  const surfaceStream = createGlobeSurfaceStream({
    currentFrame: fixture.terrain.frame,
    loadTerrainTile: async (tile) => createFlatRideTile(tile),
    loadRoadTile: null,
  });
  surfaceStream.update(fixture.terrain.frame.origin);
  await waitFor(
    () => surfaceStream.getStatus().counts.activeTerrainReady === 9,
    'streamed terrain did not qualify its active ring',
  );
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    surfaceStream,
    trafficVehicleCount: 1,
    maximumPhysicalTrafficVehicles: 0,
  });
  let streamVisibility = null;
  runtime.setReferenceFrameParticipants([{
    prepareReferenceFrameTransform() {
      return {
        commitModel: 'validated-synchronous-noexcept',
        commit: () => true,
      };
    },
    prepareSurfaceSnapshot() {
      return {
        commitModel: 'validated-synchronous-noexcept',
        commit: () => true,
      };
    },
    setStreamedTerrainVisible(value) { streamVisibility = value; },
  }]);
  runtime.stepFrame(0, control(1));
  assert.equal(runtime.getState().globe.collision.streamEnabled, true);
  const reset = runtime.stepFrame(1 / 240, control(2, { reset: true }));
  assert.equal(reset.resetApplied, true);
  assert.equal(reset.referenceFrameTransform, null);
  assert.equal(reset.streamCommit, null);
  assert.equal(runtime.getState().globe.collision.streamEnabled, false);
  assert.equal(runtime.getState().globe.collision.fallbackEnabled, true);
  assert.equal(streamVisibility, false);
  const resumed = runtime.stepFrame(0, control(3));
  assert.equal(resumed.streamCommit, null);
  assert.equal(runtime.getState().globe.collision.streamEnabled, true);
  assert.equal(streamVisibility, true);
  runtime.dispose();
});

test('rebases the complete physics frame and fails closed at the bounded terrain edge', () => {
  const fixture = sceneFixture();
  const runtime = createMotorcycleGameRuntime({
    ...fixture,
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
    rebaseThresholdMeters: 20,
  });
  const controlRuntime = createMotorcycleGameRuntime({
    ...fixture,
    trafficVehicleCount: 2,
    maximumPhysicalTrafficVehicles: 2,
    rebaseThresholdMeters: 1_000,
  });

  // Move the player rig through the public world state; the runtime itself
  // must detect the threshold and shift every local-frame consumer together.
  for (const candidate of [runtime, controlRuntime]) {
    for (const bodyId of candidate.rig.bodyIdList) {
      const body = candidate.world.getBody(bodyId);
      for (const field of ['position', 'previousPosition', 'predictedPosition']) body[field][0] += 50;
    }
  }
  const rebased = runtime.stepFrame(1 / 120, control(1));
  const unreBased = controlRuntime.stepFrame(1 / 120, control(1));
  assert.ok(rebased.originRebase);
  assert.ok(Math.abs(rebased.originRebase.shift[0]) > 20);
  assert.equal(unreBased.originRebase, null);
  assert.equal(runtime.getState().origin.rebaseCount, 1);
  assert.ok(Math.abs(runtime.getState().origin.offset[0] - rebased.originRebase.shift[0]) < 1e-4);
  assert.deepEqual(
    runtime.getState().roadSurface.collider.originOffset,
    runtime.getState().origin.offset,
    'composite road/terrain queries join the same origin-rebase transaction',
  );
  assert.ok(Math.abs(runtime.world.getBody(runtime.rig.bodyIds.chassis).position[0]) < 2);
  const offset = runtime.getState().origin.offset;
  const rebasedBodies = new Map(runtime.world.getSnapshot().bodies.map((body) => [body.id, body]));
  const controlBodies = new Map(controlRuntime.world.getSnapshot().bodies.map((body) => [body.id, body]));
  for (const [id, body] of rebasedBodies) {
    const expected = controlBodies.get(id);
    assert.ok(expected, `missing control body ${id}`);
    for (let axis = 0; axis < 3; axis += 1) {
      assert.ok(
        Math.abs(body.position[axis] + offset[axis] - expected.position[axis]) < 2e-4,
        `${id} canonical position changed across rebase`,
      );
      assert.ok(Math.abs(body.linearVelocity[axis] - expected.linearVelocity[axis]) < 2e-4);
    }
  }
  assert.deepEqual(runtime.getState().trafficSnapshot, controlRuntime.getState().trafficSnapshot);
  assert.deepEqual(runtime.getState().race, controlRuntime.getState().race);
  const rebasedChassis = runtime.world.getBody(runtime.rig.bodyIds.chassis);
  const controlChassis = controlRuntime.world.getBody(controlRuntime.rig.bodyIds.chassis);
  const canonicalX = rebasedChassis.position[0] + offset[0];
  const canonicalZ = rebasedChassis.position[2] + offset[2];
  const rebasedClearance = rebasedChassis.position[1] + offset[1]
    - fixture.terrain.sampleLocalHeight(canonicalX, canonicalZ);
  const controlClearance = controlChassis.position[1]
    - fixture.terrain.sampleLocalHeight(controlChassis.position[0], controlChassis.position[2]);
  assert.ok(Math.abs(rebasedClearance - controlClearance) < 2e-4);

  const translation = (fixture.terrain.localBounds.maxX - fixture.terrain.localBounds.minX) * 2;
  for (const bodyId of runtime.rig.bodyIdList) {
    const body = runtime.world.getBody(bodyId);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) body[field][0] += translation;
  }
  const boundary = runtime.stepFrame(1 / 60, control(2));
  assert.ok(boundary.boundaryReset);
  assert.equal(boundary.boundaryReset.action, 'reset-to-real-road-spawn');
  assert.equal(runtime.getState().boundary.resetCount, 1);
  assert.ok(runtime.world.getSnapshot().bodies.every((body) => (
    [...body.position, ...body.orientation].every(Number.isFinite)
  )));
  controlRuntime.dispose();
  runtime.dispose();
});
