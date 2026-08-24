import assert from 'node:assert/strict';
import test from 'node:test';

import { GEODATA_LIMITS } from '../../../services/geodata/src/config.js';
import { parseAndSnapBbox } from '../../../services/geodata/src/osm/bbox.js';
import { normalizeOverpassRegion } from '../../../services/geodata/src/osm/normalize.js';
import { createOverpassFixture } from '../../../services/geodata/test/fixture.js';
import { createMotorcycleGameRuntime } from '../src/runtime/gameRuntime.js';
import { createTrafficCollisionCloud, trafficPose } from '../src/runtime/trafficPhysics.js';
import { createMotorcycleSceneData } from '../src/world/sceneData.js';
import { createDerivedFlatTerrainGrid } from '../src/world/terrainGrid.js';

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
  assert.equal(state.physicsProfile.maxSubSteps, 4);
  assert.equal(state.physics.overflows.overflowed, false);
  assert.ok(runtime.world.getSnapshot().bodies.every((body) => (
    [...body.position, ...body.orientation, ...body.linearVelocity, ...body.angularVelocity].every(Number.isFinite)
  )));
  runtime.dispose();
  assert.equal(runtime.getState().disposed, true);
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
