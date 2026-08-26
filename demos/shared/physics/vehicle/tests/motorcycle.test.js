import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  createBoxParticleCloud,
  createParticleRigidWorld,
  createPlaneSurfaceCollider,
} from '../../particle-rigid/index.js';
import { bodyWorldVector } from '../../particle-rigid/bodyMath.js';
import {
  createMotorcyclePhysics,
  createMotorcycleRig,
  normalizeControlFrame,
} from '../index.js';

const FIXED_DT = 1 / 120;

function degrees(radians) {
  return radians * 180 / Math.PI;
}

function clampedAcos(value) {
  return Math.acos(Math.min(1, Math.max(-1, value)));
}

function snapshotHash(snapshot) {
  return createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
}

function createRoadBike(id) {
  const game = createMotorcyclePhysics({
    worldOptions: { solverIterations: 12, maxParticles: 512 },
    rigOptions: { id },
  });
  game.world.addSurfaceCollider(createPlaneSurfaceCollider({ friction: 1.05 }));
  return game;
}

function settleBike(game, steps = 120) {
  for (let step = 0; step < steps; step += 1) {
    game.stepFrame(FIXED_DT, { sequence: step });
  }
}

function setBikeForwardSpeed(game, speed) {
  const chassis = game.world.getBody(game.rig.bodyIds.chassis);
  const forward = bodyWorldVector(chassis, [0, 0, 1]);
  for (const bodyId of game.rig.bodyIdList) {
    game.world.getBody(bodyId).linearVelocity.set(forward.map((value) => value * speed));
  }
  for (const bodyId of [game.rig.bodyIds.rearWheel, game.rig.bodyIds.frontWheel]) {
    const wheel = game.world.getBody(bodyId);
    const axle = bodyWorldVector(wheel, [1, 0, 0]);
    wheel.angularVelocity.set(
      axle.map((value) => value * speed / game.rig.rollingRadiusMeters),
    );
  }
}

function finiteSnapshot(snapshot) {
  return snapshot.bodies.every((state) => (
    [...state.position, ...state.orientation, ...state.linearVelocity, ...state.angularVelocity]
      .every(Number.isFinite)
  ));
}

test('ControlFrame normalization clamps analogs and preserves one-shot actions', () => {
  const control = normalizeControlFrame({
    sequence: 42,
    steer: -4,
    throttle: 3,
    frontBrake: -1,
    rearBrake: 0.4,
    clutch: 0.25,
    shiftDelta: 8,
    handbrake: 2,
    reset: 1,
    cameraToggle: true,
    recenter: 'yes',
  });
  assert.deepEqual(control, {
    sequence: 42,
    steer: -1,
    throttle: 1,
    frontBrake: 0,
    rearBrake: Math.fround(0.4),
    clutch: 0.25,
    shiftDelta: 1,
    handbrake: 1,
    reset: true,
    cameraToggle: true,
    recenter: true,
  });
  assert.equal(Object.isFrozen(control), true);
});

test('fixed-step steering, throttle, and brake actuators follow an exact deterministic trace', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 512 },
  });
  const trace = [];
  let firstActuation = null;
  for (let step = 0; step < 80; step += 1) {
    game.stepFrame(FIXED_DT, {
      sequence: step,
      steer: 1,
      throttle: 1,
      frontBrake: 1,
      rearBrake: 0.6,
    });
    if (step === 0) firstActuation = game.controller.getTelemetry();
    if ([0, 11, 47, 79].includes(step)) {
      trace.push([step + 1, game.controller.getTelemetry().actuators]);
    }
  }
  for (let step = 0; step < 40; step += 1) {
    game.stepFrame(FIXED_DT, { sequence: 80 + step });
    if ([0, 9, 29, 39].includes(step)) {
      trace.push([81 + step, game.controller.getTelemetry().actuators]);
    }
  }
  assert.deepEqual(trace, [
    [1, {
      steer: 0.02083333395421505,
      throttle: 0.01250000111758709,
      frontBrake: 0.0833333358168602,
      rearBrake: 0.0833333358168602,
      handbrake: 0,
    }],
    [12, {
      steer: 0.2499999701976776,
      throttle: 0.15000002086162567,
      frontBrake: 0.9999998807907104,
      rearBrake: 0.6000000238418579,
      handbrake: 0,
    }],
    [48, {
      steer: 0.9999995827674866,
      throttle: 0.599999725818634,
      frontBrake: 1,
      rearBrake: 0.6000000238418579,
      handbrake: 0,
    }],
    [80, {
      steer: 1,
      throttle: 0.9999993443489075,
      frontBrake: 1,
      rearBrake: 0.6000000238418579,
      handbrake: 0,
    }],
    [81, {
      steer: 0.9666666388511658,
      throttle: 0.9749993681907654,
      frontBrake: 0.8999999761581421,
      rearBrake: 0.5,
      handbrake: 0,
    }],
    [90, {
      steer: 0.6666663885116577,
      throttle: 0.7499995827674866,
      frontBrake: 0,
      rearBrake: 0,
      handbrake: 0,
    }],
    [110, {
      steer: 0,
      throttle: 0.2499997317790985,
      frontBrake: 0,
      rearBrake: 0,
      handbrake: 0,
    }],
    [120, {
      steer: 0,
      throttle: 0,
      frontBrake: 0,
      rearBrake: 0,
      handbrake: 0,
    }],
  ]);
  assert.equal(firstActuation.steeringSpeedBlend, 0);
  assert.equal(firstActuation.desiredLateralAcceleration, 0);
  assert.equal(firstActuation.targetLean, 0);
  assert.ok(Math.abs(
    firstActuation.steeringTarget + firstActuation.actuators.steer * 0.42,
  ) <= 1e-8, 'low speed uses direct physical fork steering without synthetic lean');
  assert.equal(game.controller.getTelemetry().controls.steer, 0, 'raw normalized action remains unchanged');
  game.dispose();
});

test('motorcycle rig is six particle-cloud rigid components with physical joints', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], maxParticles: 512 });
  const rig = createMotorcycleRig(world, { id: 'test-bike' });
  assert.equal(rig.componentCount, 6);
  assert.equal(world.bodies.size, 6);
  assert.equal(world.joints.size, 7);
  assert.deepEqual(
    [...new Set(world.jointOrder.map((joint) => joint.type))].sort(),
    ['hinge', 'prismatic', 'spring'],
  );
  for (const bodyId of rig.bodyIdList) {
    const body = world.getBody(bodyId);
    assert.ok(body.particleCloud.count >= 8);
    assert.ok(body.inertia instanceof Float32Array);
    assert.ok(body.inverseInertia.every(Number.isFinite));
    assert.equal(body.motionType, 'dynamic');
  }
  world.stepFrame(1 / 120, { sequence: 1 });
  assert.equal(world.getTelemetry().particleContactCount, 0, 'rig components do not self-collide');
});

test('powertrain accelerates forward, tire contacts obey friction ellipse, and brakes slow down', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { solverIterations: 16, maxParticles: 512 },
    rigOptions: { id: 'road-bike' },
  });
  game.world.addSurfaceCollider(createPlaneSurfaceCollider({ friction: 1.05 }));
  let observedRearContact = false;
  for (let index = 0; index < 180; index += 1) {
    game.stepFrame(1 / 120, { sequence: index, throttle: 0.8 });
    observedRearContact ||= game.getTelemetry().motorcycle.tires.rear.contactCount > 0;
  }
  const accelerated = game.getTelemetry().motorcycle;
  const acceleratedSpeed = accelerated.speed;
  assert.ok(accelerated.forwardSpeed > 3, `forward speed=${accelerated.forwardSpeed}`);
  assert.ok(accelerated.driveTorque > 0);
  assert.equal(observedRearContact, true);
  assert.ok(Number.isFinite(accelerated.tires.rear.longitudinalSlip));

  for (const contact of game.world.getContacts().filter((candidate) => candidate.normalImpulse > 1e-7)) {
    const longLimit = contact.muLongitudinal * contact.normalImpulse;
    const lateralLimit = contact.muLateral * contact.normalImpulse;
    if (longLimit <= 0 || lateralLimit <= 0) continue;
    const ellipse = (contact.longitudinalImpulse / longLimit) ** 2
      + (contact.lateralImpulse / lateralLimit) ** 2;
    assert.ok(ellipse <= 1.00001, `friction ellipse exceeded: ${ellipse}`);
  }

  for (let index = 180; index < 360; index += 1) {
    game.stepFrame(1 / 120, {
      sequence: index,
      throttle: 0,
      frontBrake: 1,
      rearBrake: 1,
    });
  }
  const braked = game.getTelemetry().motorcycle;
  assert.ok(braked.speed < acceleratedSpeed * 0.35, `${braked.speed} !< ${acceleratedSpeed}`);
  assert.ok(braked.tires.front.normalLoad >= 0 && braked.tires.rear.normalLoad >= 0);
  const chassis = game.world.getBody(game.rig.bodyIds.chassis);
  assert.ok(chassis.position[2] > 1, 'drivetrain acts through wheel/road impulses in +Z');
  game.dispose();
});

test('reported road friction bounds tire grip and suspension remains inside physical travel', () => {
  const run = (friction) => {
    const game = createMotorcyclePhysics({
      worldOptions: { solverIterations: 12, maxParticles: 512 },
      rigOptions: { id: `grip-${friction}` },
    });
    game.world.addSurfaceCollider(createPlaneSurfaceCollider({ friction }));
    let minimumFork = Infinity;
    let maximumFork = -Infinity;
    let minimumSwingarm = Infinity;
    let maximumSwingarm = -Infinity;
    for (let index = 0; index < 240; index += 1) {
      game.stepFrame(1 / 120, { sequence: index, throttle: 0.8 });
      const telemetry = game.getTelemetry().motorcycle.suspension;
      minimumFork = Math.min(minimumFork, telemetry.front.positionMeters);
      maximumFork = Math.max(maximumFork, telemetry.front.positionMeters);
      minimumSwingarm = Math.min(minimumSwingarm, telemetry.rear.swingarmAngleRadians);
      maximumSwingarm = Math.max(maximumSwingarm, telemetry.rear.swingarmAngleRadians);
      for (const contact of game.world.getContacts().filter((candidate) => candidate.metadata?.tire)) {
        assert.ok(contact.muLongitudinal <= contact.metadata.combinedMaterialFriction + 1e-7);
        assert.ok(contact.muLateral <= contact.metadata.combinedMaterialFriction + 1e-7);
      }
    }
    const result = {
      speed: game.getTelemetry().motorcycle.forwardSpeed,
      minimumFork,
      maximumFork,
      minimumSwingarm,
      maximumSwingarm,
    };
    game.dispose();
    return result;
  };
  const lowGrip = run(0.01);
  const highGrip = run(1.5);
  assert.ok(highGrip.speed > lowGrip.speed * 2, `${highGrip.speed} !> ${lowGrip.speed} * 2`);
  for (const result of [lowGrip, highGrip]) {
    assert.ok(result.minimumFork >= -0.120001);
    assert.ok(result.maximumFork <= 0.080001);
    assert.ok(result.minimumSwingarm >= -0.380001);
    assert.ok(result.maximumSwingarm <= 0.320001);
  }
});

test('reported grip shortens a controlled braking stop without destabilizing the chassis', () => {
  const stop = (friction) => {
    const game = createMotorcyclePhysics({
      worldOptions: { solverIterations: 12, maxParticles: 512 },
      rigOptions: { id: `braking-${friction}` },
    });
    game.world.addSurfaceCollider(createPlaneSurfaceCollider({ friction }));
    for (const bodyId of game.rig.bodyIdList) {
      game.world.getBody(bodyId).linearVelocity.set([0, 0, 8]);
    }
    game.world.getBody(game.rig.bodyIds.rearWheel).angularVelocity[0] = 8 / game.rig.wheelRadius;
    game.world.getBody(game.rig.bodyIds.frontWheel).angularVelocity[0] = 8 / game.rig.wheelRadius;
    const start = game.world.getBody(game.rig.bodyIds.chassis).position[2];
    for (let index = 0; index < 240; index += 1) {
      game.stepFrame(1 / 120, {
        sequence: index,
        frontBrake: 1,
        rearBrake: 1,
      });
    }
    const chassis = game.world.getBody(game.rig.bodyIds.chassis);
    const result = {
      distance: chassis.position[2] - start,
      speed: game.controller.getTelemetry().speed,
      orientation: Array.from(chassis.orientation),
      overflows: game.world.getTelemetry().overflows,
    };
    game.dispose();
    return result;
  };
  const lowGrip = stop(0.15);
  const highGrip = stop(1.2);
  assert.ok(highGrip.distance <= lowGrip.distance * 0.65, `${highGrip.distance} !<= ${lowGrip.distance} * 0.65`);
  assert.ok(highGrip.speed < 0.5 && lowGrip.speed < 0.5);
  assert.ok(highGrip.orientation.every(Number.isFinite));
  assert.ok(lowGrip.orientation.every(Number.isFinite));
  assert.equal(highGrip.overflows.overflowed, false);
  assert.equal(lowGrip.overflows.overflowed, false);
});

test('neutral motorcycle settles on suspension sag without creeping under rider-foot parking support', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { solverIterations: 12, maxParticles: 512 },
    rigOptions: { id: 'settled-bike' },
  });
  game.world.addSurfaceCollider(createPlaneSurfaceCollider());
  let settledPosition = null;
  let accumulatedAxleLoad = 0;
  let axleLoadSamples = 0;
  let minimumSettledFrontTravel = Infinity;
  let maximumSettledFrontTravel = -Infinity;
  let minimumSettledRearTravel = Infinity;
  let maximumSettledRearTravel = -Infinity;
  for (let index = 0; index < 2_400; index += 1) {
    game.stepFrame(1 / 120, { sequence: index });
    if (index === 239) {
      settledPosition = Array.from(game.world.getBody(game.rig.bodyIds.chassis).position);
    } else if (index > 239) {
      const tires = game.controller.getTelemetry().tires;
      accumulatedAxleLoad += tires.front.normalLoad + tires.rear.normalLoad;
      axleLoadSamples += 1;
    }
    if (index >= 600) {
      const suspension = game.controller.getTelemetry().suspension;
      const rearSpan = suspension.rear.maximumRadians - suspension.rear.minimumRadians;
      const rearTravel = (suspension.rear.swingarmAngleRadians - suspension.rear.minimumRadians)
        / rearSpan;
      minimumSettledFrontTravel = Math.min(
        minimumSettledFrontTravel,
        suspension.front.normalizedTravel,
      );
      maximumSettledFrontTravel = Math.max(
        maximumSettledFrontTravel,
        suspension.front.normalizedTravel,
      );
      minimumSettledRearTravel = Math.min(minimumSettledRearTravel, rearTravel);
      maximumSettledRearTravel = Math.max(maximumSettledRearTravel, rearTravel);
    }
  }
  const body = game.world.getBody(game.rig.bodyIds.chassis);
  const telemetry = game.controller.getTelemetry();
  const drift = Math.hypot(
    body.position[0] - settledPosition[0],
    body.position[2] - settledPosition[2],
  );
  const planarSpeed = Math.hypot(body.linearVelocity[0], body.linearVelocity[2]);
  const totalMass = game.rig.bodyIdList.reduce(
    (sum, bodyId) => sum + game.world.getBody(bodyId).mass,
    0,
  );
  const expectedWeight = totalMass * Math.abs(game.world.options.gravity[1]);
  const averageAxleLoad = accumulatedAxleLoad / axleLoadSamples;

  assert.ok(drift <= 0.1, `post-settle drift=${drift}`);
  assert.ok(planarSpeed <= 0.02, `post-settle planar speed=${planarSpeed}`);
  assert.ok(minimumSettledFrontTravel >= 0.4, `settled fork minimum=${minimumSettledFrontTravel}`);
  assert.ok(maximumSettledFrontTravel <= 0.6, `settled fork maximum=${maximumSettledFrontTravel}`);
  assert.ok(minimumSettledRearTravel >= 0.4, `settled rear minimum=${minimumSettledRearTravel}`);
  assert.ok(maximumSettledRearTravel <= 0.6, `settled rear maximum=${maximumSettledRearTravel}`);
  assert.ok(Math.abs(averageAxleLoad - expectedWeight) / expectedWeight <= 0.05);
  assert.equal(game.world.getTelemetry().overflows.overflowed, false);
  assert.ok(game.world.getSnapshot().bodies.every((state) => (
    [...state.position, ...state.orientation, ...state.linearVelocity, ...state.angularVelocity]
      .every(Number.isFinite)
  )));
  game.dispose();
});

test('two-metre landing respects hard suspension travel and recovers to finite sag', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { solverIterations: 12, maxParticles: 512 },
    rigOptions: { id: 'landing-bike', position: [0, 2, 0] },
  });
  game.world.addSurfaceCollider(createPlaneSurfaceCollider());
  let firstContactStep = null;
  let maximumFork = Number.NEGATIVE_INFINITY;
  let minimumFork = Number.POSITIVE_INFINITY;
  let maximumSwingarm = Number.NEGATIVE_INFINITY;
  let minimumSwingarm = Number.POSITIVE_INFINITY;
  let maximumPenetration = 0;
  for (let index = 0; index < 600; index += 1) {
    game.stepFrame(1 / 120, { sequence: index });
    if (firstContactStep === null && game.world.getContacts().length > 0) {
      firstContactStep = index;
    }
    const suspension = game.controller.getTelemetry().suspension;
    maximumFork = Math.max(maximumFork, suspension.front.positionMeters);
    minimumFork = Math.min(minimumFork, suspension.front.positionMeters);
    maximumSwingarm = Math.max(maximumSwingarm, suspension.rear.swingarmAngleRadians);
    minimumSwingarm = Math.min(minimumSwingarm, suspension.rear.swingarmAngleRadians);
    maximumPenetration = Math.max(
      maximumPenetration,
      game.world.getTelemetry().maximumPenetration,
    );
  }
  const body = game.world.getBody(game.rig.bodyIds.chassis);
  const suspension = game.controller.getTelemetry().suspension;
  assert.ok(firstContactStep !== null && firstContactStep < 120);
  assert.ok(minimumFork >= suspension.front.minimumMeters - 1e-4);
  assert.ok(maximumFork <= suspension.front.maximumMeters + 1e-4);
  assert.ok(minimumSwingarm >= suspension.rear.minimumRadians - 1e-5);
  assert.ok(maximumSwingarm <= suspension.rear.maximumRadians + 1e-5);
  assert.ok(maximumPenetration <= 0.04, `maximum penetration=${maximumPenetration}`);
  assert.ok(Math.hypot(...body.linearVelocity) <= 0.15);
  const recoveredRearTravel = (
    suspension.rear.swingarmAngleRadians - suspension.rear.minimumRadians
  ) / (suspension.rear.maximumRadians - suspension.rear.minimumRadians);
  assert.ok(suspension.front.normalizedTravel >= 0.35 && suspension.front.normalizedTravel <= 0.65);
  assert.ok(recoveredRearTravel >= 0.35 && recoveredRearTravel <= 0.65);
  assert.equal(game.world.getTelemetry().overflows.overflowed, false);
  assert.ok(game.world.getSnapshot().bodies.every((state) => (
    [...state.position, ...state.orientation, ...state.linearVelocity, ...state.angularVelocity]
      .every(Number.isFinite)
  )));
  game.dispose();
});

test('shift edges execute once per sequence even with multiple physics substeps', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 512 },
    controllerOptions: { automaticTransmission: false },
  });
  assert.equal(game.controller.getTelemetry().transmissionMode, 'manual');
  assert.equal(game.controller.getTelemetry().gear, 1);
  game.stepFrame(1 / 60, { sequence: 10, shiftDelta: 1 });
  assert.equal(game.controller.getTelemetry().gear, 2);
  game.stepFrame(1 / 60, { sequence: 10, shiftDelta: 1 });
  assert.equal(game.controller.getTelemetry().gear, 2);
  game.stepFrame(1 / 120, { sequence: 11, shiftDelta: 1 });
  assert.equal(game.controller.getTelemetry().gear, 3);
  game.stepFrame(1 / 60, { sequence: 12, reset: true });
  assert.equal(game.world.stepCount, 2, 'reset edge is consumed once before two fixed substeps');
  game.dispose();
});

test('automatic transmission is explicit, ignores manual shifts, and survives reset mode changes', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 512 },
  });
  let telemetry = game.controller.getTelemetry();
  assert.equal(telemetry.automaticTransmissionEnabled, true);
  assert.equal(telemetry.transmissionMode, 'automatic');
  assert.equal(telemetry.gear, 1);

  game.stepFrame(1 / 120, { sequence: 1, shiftDelta: 1 });
  assert.equal(game.controller.getTelemetry().gear, 1, 'AUTO ignores manual shift edges');

  telemetry = game.controller.setAutomaticTransmission(false);
  assert.equal(telemetry.automaticTransmissionEnabled, false);
  assert.equal(telemetry.transmissionMode, 'manual');
  game.stepFrame(1 / 120, { sequence: 2, shiftDelta: -1 });
  assert.equal(game.controller.getTelemetry().gear, 0);

  telemetry = game.controller.setAutomaticTransmission(true);
  assert.equal(telemetry.transmissionMode, 'automatic');
  assert.equal(telemetry.gear, 1, 'enabling AUTO selects first from neutral');
  game.controller.setGear(0);
  assert.equal(game.controller.getTelemetry().gear, 1, 'AUTO cannot be put back into neutral');

  game.controller.setAutomaticTransmission(false);
  game.reset();
  telemetry = game.controller.getTelemetry();
  assert.equal(telemetry.automaticTransmissionEnabled, false);
  assert.equal(telemetry.transmissionMode, 'manual');
  assert.equal(telemetry.gear, 1);
  game.dispose();
});

test('bounded lean assist applies torque and reset restores the six-body snapshot', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 512 },
    controllerOptions: { maxLeanTorque: 300 },
  });
  const chassis = game.world.getBody(game.rig.bodyIds.chassis);
  chassis.angularVelocity[2] = 2;
  const initial = JSON.parse(JSON.stringify(game.controller.initialSnapshot));
  game.stepFrame(1 / 120, { sequence: 1, steer: 1 });
  const telemetry = game.controller.getTelemetry();
  assert.ok(Math.abs(telemetry.leanAssistTorque) <= 300);
  assert.notEqual(telemetry.leanAssistTorque, 0);
  assert.notDeepEqual(Array.from(chassis.orientation), [0, 0, 0, 1]);
  game.controller.reset();
  assert.deepEqual(game.world.getSnapshot(), initial);
  const resetTelemetry = game.controller.getTelemetry();
  assert.equal(resetTelemetry.gear, 1);
  assert.equal(resetTelemetry.engineRpm, 1_200);
  assert.equal(resetTelemetry.speed, 0);
  assert.equal(resetTelemetry.forwardSpeed, 0);
  assert.equal(resetTelemetry.tires.front.contactCount, 0);
  assert.equal(resetTelemetry.tires.rear.contactCount, 0);
  game.world.shiftOrigin([10, 0, -4]);
  game.controller.reset();
  const shiftedChassis = game.world.getBody(game.rig.bodyIds.chassis).position;
  assert.ok(Math.abs(shiftedChassis[0] + 10) < 1e-6);
  assert.ok(Math.abs(shiftedChassis[2] - 4) < 1e-6);
  game.dispose();
});

test('rider-right input turns the physical fork and lean target right', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 512 },
  });
  const chassis = game.world.getBody(game.rig.bodyIds.chassis);
  chassis.linearVelocity[2] = 8;
  game.stepFrame(1 / 120, { sequence: 1, steer: 1 });
  const right = game.controller.getTelemetry();
  assert.ok(right.steeringTarget < 0, 'positive rider-right action maps to negative +Y rig hinge rotation');
  assert.ok(right.targetLean > 0, 'positive rider-right action requests rider-right lean');
  assert.equal(game.rig.worldUnits, 'meters');
  assert.ok(Math.abs(game.rig.rollingRadiusMeters - 0.412) < 1e-9);
  assert.ok(Math.abs(game.rig.wheelOuterDiameterMeters - 0.824) < 1e-9);
  game.stepFrame(1 / 120, { sequence: 2, steer: -1 });
  const left = game.controller.getTelemetry();
  assert.ok(left.steeringTarget > 0);
  assert.ok(left.targetLean < 0);
  game.dispose();
});

test('unified curvature produces stable physical right turns at 8 and 20 metres per second', () => {
  const runTurn = (initialSpeed) => {
    const game = createRoadBike(`right-turn-${initialSpeed}`);
    settleBike(game);
    setBikeForwardSpeed(game, initialSpeed);
    const chassis = game.world.getBody(game.rig.bodyIds.chassis);
    const initialPosition = [...chassis.position];
    const initialForward = bodyWorldVector(chassis, [0, 0, 1]);
    const initialRight = bodyWorldVector(chassis, [-1, 0, 0]);
    const initialYaw = Math.atan2(initialForward[0], initialForward[2]);
    let maximumTiltDegrees = 0;
    let maximumLateralSlip = 0;
    for (let step = 0; step < 120; step += 1) {
      game.stepFrame(FIXED_DT, {
        sequence: 120 + step,
        steer: 1,
        throttle: 0.5,
      });
      const telemetry = game.controller.getTelemetry();
      const up = bodyWorldVector(chassis, [0, 1, 0]);
      maximumTiltDegrees = Math.max(maximumTiltDegrees, degrees(clampedAcos(up[1])));
      maximumLateralSlip = Math.max(
        maximumLateralSlip,
        Math.abs(telemetry.tires.front.lateralSlip),
        Math.abs(telemetry.tires.rear.lateralSlip),
      );
    }
    const telemetry = game.controller.getTelemetry();
    const forward = bodyWorldVector(chassis, [0, 0, 1]);
    const yawDelta = Math.atan2(
      Math.sin(Math.atan2(forward[0], forward[2]) - initialYaw),
      Math.cos(Math.atan2(forward[0], forward[2]) - initialYaw),
    );
    const displacement = chassis.position.map((value, axis) => value - initialPosition[axis]);
    const rightDisplacement = displacement.reduce(
      (sum, value, axis) => sum + value * initialRight[axis],
      0,
    );
    const expectedFork = -Math.atan(
      game.rig.wheelbaseMeters * telemetry.desiredLateralAcceleration
        / (telemetry.forwardSpeed * telemetry.forwardSpeed),
    );
    const result = {
      yawRightDegrees: -degrees(yawDelta),
      rightDisplacement,
      forwardSpeed: telemetry.forwardSpeed,
      maximumTiltDegrees,
      maximumLateralSlip,
      desiredLateralAcceleration: telemetry.desiredLateralAcceleration,
      steeringTarget: telemetry.steeringTarget,
      expectedFork,
      targetLean: telemetry.targetLean,
      overflowed: game.world.getTelemetry().overflows.overflowed,
    };
    game.dispose();
    return result;
  };

  const medium = runTurn(8);
  const high = runTurn(20);
  assert.ok(medium.yawRightDegrees >= 18 && medium.yawRightDegrees <= 28, JSON.stringify(medium));
  assert.ok(medium.rightDisplacement >= 1.1 && medium.rightDisplacement <= 1.8, JSON.stringify(medium));
  assert.ok(medium.forwardSpeed >= 7.2 && medium.forwardSpeed <= 8.5, JSON.stringify(medium));
  assert.ok(medium.maximumTiltDegrees >= 13 && medium.maximumTiltDegrees <= 20, JSON.stringify(medium));
  assert.ok(medium.maximumLateralSlip <= 0.2, JSON.stringify(medium));

  assert.ok(high.yawRightDegrees >= 10 && high.yawRightDegrees <= 19, JSON.stringify(high));
  assert.ok(high.rightDisplacement >= 1 && high.rightDisplacement <= 1.7, JSON.stringify(high));
  assert.ok(high.forwardSpeed >= 17.2 && high.forwardSpeed <= 19.2, JSON.stringify(high));
  assert.ok(high.maximumTiltDegrees >= 11 && high.maximumTiltDegrees <= 18, JSON.stringify(high));
  assert.ok(high.maximumLateralSlip <= 0.2, JSON.stringify(high));
  assert.ok(high.yawRightDegrees < medium.yawRightDegrees);

  for (const result of [medium, high]) {
    assert.equal(result.desiredLateralAcceleration, 4.5);
    assert.ok(Math.abs(result.steeringTarget - result.expectedFork) <= 1e-6, JSON.stringify(result));
    assert.ok(Math.abs(result.targetLean - Math.atan(4.5 / 9.81)) <= 1e-6);
    assert.equal(result.overflowed, false);
  }
});

test('full keyboard throttle remains upright and deterministically shifts during a nine-second run', () => {
  const run = (id) => {
    const game = createRoadBike(id);
    settleBike(game);
    const chassis = game.world.getBody(game.rig.bodyIds.chassis);
    const initialPosition = [...chassis.position];
    let maximumTiltDegrees = 0;
    let maximumRearSlip = 0;
    let minimumDriveTorqueScale = 1;
    let minimumDriveSlipScale = 1;
    let minimumDriveFrontLoadScale = 1;
    for (let step = 0; step < 1_080; step += 1) {
      game.stepFrame(FIXED_DT, { sequence: 120 + step, throttle: 1 });
      const telemetry = game.controller.getTelemetry();
      const up = bodyWorldVector(chassis, [0, 1, 0]);
      maximumTiltDegrees = Math.max(maximumTiltDegrees, degrees(clampedAcos(up[1])));
      maximumRearSlip = Math.max(maximumRearSlip, Math.abs(telemetry.tires.rear.longitudinalSlip));
      minimumDriveTorqueScale = Math.min(minimumDriveTorqueScale, telemetry.driveTorqueScale);
      minimumDriveSlipScale = Math.min(minimumDriveSlipScale, telemetry.driveSlipScale);
      minimumDriveFrontLoadScale = Math.min(
        minimumDriveFrontLoadScale,
        telemetry.driveFrontLoadScale,
      );
    }
    const telemetry = game.controller.getTelemetry();
    const snapshot = game.world.getSnapshot();
    const result = {
      forwardSpeed: telemetry.forwardSpeed,
      speed: telemetry.speed,
      distance: chassis.position[2] - initialPosition[2],
      upY: bodyWorldVector(chassis, [0, 1, 0])[1],
      maximumTiltDegrees,
      maximumRearSlip,
      minimumDriveTorqueScale,
      minimumDriveSlipScale,
      minimumDriveFrontLoadScale,
      gear: telemetry.gear,
      automaticShiftCount: telemetry.automaticShiftCount,
      engineRpm: telemetry.engineRpm,
      overflowed: game.world.getTelemetry().overflows.overflowed,
      finite: finiteSnapshot(snapshot),
      hash: snapshotHash(snapshot),
    };
    game.dispose();
    return result;
  };
  const first = run('full-throttle-deterministic');
  const second = run('full-throttle-deterministic');
  assert.deepEqual(second, first);
  assert.ok(first.forwardSpeed >= 14.5 && first.forwardSpeed <= 16.5, JSON.stringify(first));
  assert.ok(first.distance >= 78 && first.distance <= 92, JSON.stringify(first));
  assert.ok(first.upY >= 0.995, JSON.stringify(first));
  assert.ok(first.maximumTiltDegrees <= 3, JSON.stringify(first));
  assert.ok(first.maximumRearSlip <= 0.7, JSON.stringify(first));
  assert.ok(first.minimumDriveTorqueScale <= 0.3, 'slip/front-load limiter must actively intervene');
  assert.ok(first.minimumDriveSlipScale < 1, 'rear-slip limiter must actively intervene');
  assert.ok(first.minimumDriveFrontLoadScale <= 0.3, 'front-load limiter must actively intervene');
  assert.equal(first.gear, 2);
  assert.equal(first.automaticShiftCount, 1);
  assert.equal(first.overflowed, false);
  assert.equal(first.finite, true);
  assert.match(first.hash, /^[0-9a-f]{64}$/);
});

test('balanced service braking stops from 8 metres per second and remains physically upright', () => {
  const game = createRoadBike('service-brake-stop');
  settleBike(game);
  setBikeForwardSpeed(game, 8);
  const chassis = game.world.getBody(game.rig.bodyIds.chassis);
  const initialPosition = [...chassis.position];
  let stopStep = null;
  let stopDistance = null;
  let maximumTiltDegrees = 0;
  for (let step = 0; step < 240; step += 1) {
    game.stepFrame(FIXED_DT, {
      sequence: 120 + step,
      frontBrake: 1,
      rearBrake: 0.6,
    });
    const telemetry = game.controller.getTelemetry();
    maximumTiltDegrees = Math.max(
      maximumTiltDegrees,
      degrees(clampedAcos(bodyWorldVector(chassis, [0, 1, 0])[1])),
    );
    if (stopStep === null && telemetry.speed < 0.25) {
      stopStep = step + 1;
      const displacement = chassis.position.map((value, axis) => value - initialPosition[axis]);
      stopDistance = Math.hypot(displacement[0], displacement[2]);
    }
  }
  assert.ok(stopStep !== null);
  assert.ok(stopStep / 120 >= 0.95 && stopStep / 120 <= 1.2, `stop=${stopStep / 120}s`);
  assert.ok(stopDistance >= 4.1 && stopDistance <= 4.9, `distance=${stopDistance}`);
  assert.ok(maximumTiltDegrees <= 4, `tilt=${maximumTiltDegrees}`);
  assert.ok(game.controller.getTelemetry().parkingHoldForceNewtons > 0);
  assert.equal(game.world.getTelemetry().overflows.overflowed, false);
  game.dispose();
});

test('rider-foot parking forces hold through steering and dedicated brakes, then release on launch', () => {
  const cases = [
    ['steer', { steer: 1 }, 0.05, 2.5],
    ['front-brake', { frontBrake: 1 }, 0.02, 0.5],
    ['rear-brake', { rearBrake: 1 }, 0.02, 0.6],
  ];
  for (const [name, control, maximumDrift, maximumTilt] of cases) {
    const game = createRoadBike(`parking-${name}`);
    settleBike(game, 240);
    const chassis = game.world.getBody(game.rig.bodyIds.chassis);
    const initialPosition = [...chassis.position];
    let observedHoldForce = false;
    let maximumTiltDegrees = 0;
    for (let step = 0; step < 240; step += 1) {
      game.stepFrame(FIXED_DT, { sequence: 240 + step, ...control });
      const telemetry = game.controller.getTelemetry();
      observedHoldForce ||= telemetry.parkingHoldForceNewtons > 0;
      maximumTiltDegrees = Math.max(
        maximumTiltDegrees,
        degrees(clampedAcos(bodyWorldVector(chassis, [0, 1, 0])[1])),
      );
    }
    const drift = Math.hypot(
      chassis.position[0] - initialPosition[0],
      chassis.position[2] - initialPosition[2],
    );
    assert.ok(drift <= maximumDrift, `${name} drift=${drift}`);
    assert.ok(maximumTiltDegrees <= maximumTilt, `${name} tilt=${maximumTiltDegrees}`);
    assert.equal(observedHoldForce, true);
    game.stepFrame(FIXED_DT, { sequence: 480, throttle: 1, ...control });
    assert.equal(game.controller.getTelemetry().parkingHoldForceNewtons, 0);
    assert.equal(game.world.getTelemetry().overflows.overflowed, false);
    game.dispose();
  }
});

test('rider-foot parking anchor remains continuous across an origin rebase', () => {
  const baseline = createRoadBike('parking-rebase-baseline');
  const shifted = createRoadBike('parking-rebase-shifted');
  settleBike(baseline, 240);
  settleBike(shifted, 240);

  const shift = [10, 0, -4];
  const anchorBefore = [...shifted.controller.parkingAnchor];
  const shiftedChassis = shifted.world.getBody(shifted.rig.bodyIds.chassis);
  const relativeBefore = [
    shiftedChassis.position[0] - anchorBefore[0],
    shiftedChassis.position[2] - anchorBefore[1],
  ];
  shifted.world.shiftOrigin(shift);

  assert.deepEqual(shifted.controller.parkingAnchor, [
    Math.fround(anchorBefore[0] - shift[0]),
    Math.fround(anchorBefore[1] - shift[2]),
  ]);
  assert.ok(Math.abs(
    shiftedChassis.position[0] - shifted.controller.parkingAnchor[0] - relativeBefore[0]
  ) < 2e-6);
  assert.ok(Math.abs(
    shiftedChassis.position[2] - shifted.controller.parkingAnchor[1] - relativeBefore[1]
  ) < 2e-6);

  let maximumShiftedForce = 0;
  let maximumBaselineForce = 0;
  for (let step = 0; step < 120; step += 1) {
    const control = { sequence: 240 + step };
    baseline.stepFrame(FIXED_DT, control);
    shifted.stepFrame(FIXED_DT, control);
    maximumBaselineForce = Math.max(
      maximumBaselineForce,
      baseline.controller.getTelemetry().parkingHoldForceNewtons,
    );
    maximumShiftedForce = Math.max(
      maximumShiftedForce,
      shifted.controller.getTelemetry().parkingHoldForceNewtons,
    );
  }

  const baselineChassis = baseline.world.getBody(baseline.rig.bodyIds.chassis);
  assert.ok(Math.abs(shiftedChassis.position[0] + shift[0] - baselineChassis.position[0]) < 2e-4);
  assert.ok(Math.abs(shiftedChassis.position[1] + shift[1] - baselineChassis.position[1]) < 2e-4);
  assert.ok(Math.abs(shiftedChassis.position[2] + shift[2] - baselineChassis.position[2]) < 2e-4);
  for (let axis = 0; axis < 3; axis += 1) {
    assert.ok(Math.abs(
      shiftedChassis.linearVelocity[axis] - baselineChassis.linearVelocity[axis]
    ) < 2e-4);
  }
  assert.ok(maximumShiftedForce < shifted.controller.config.parkingMaximumForce * 0.25);
  assert.ok(Math.abs(maximumShiftedForce - maximumBaselineForce) < 2);
  assert.equal(shifted.world.getTelemetry().overflows.overflowed, false);

  baseline.dispose();
  shifted.dispose();
});

test('wheel contacts with rigid traffic remain generic body collisions', () => {
  const game = createMotorcyclePhysics({
    worldOptions: { gravity: [0, 0, 0], maxParticles: 1_024 },
  });
  const rearWheel = game.world.getBody(game.rig.bodyIds.rearWheel);
  game.world.addBody({
    id: 'traffic-cage',
    motionType: 'kinematic',
    position: [...rearWheel.position],
    mass: 1_200,
    particleCloud: createBoxParticleCloud({
      halfExtents: [0.25, 0.25, 0.25],
      radius: 0.16,
      spacing: 0.25,
      shell: true,
      tag: 'synthetic-traffic',
    }),
  });
  game.world.setKinematicTarget('traffic-cage', {
    position: [...rearWheel.position],
    orientation: [0, 0, 0, 1],
  });
  game.world.stepFrame(1 / 120, { sequence: 1 });
  const wheelTraffic = game.world.getContacts().filter((contact) => (
    contact.type === 'particle'
      && [contact.bodyA, contact.bodyB].includes(game.rig.bodyIds.rearWheel)
      && [contact.bodyA, contact.bodyB].includes('traffic-cage')
  ));
  assert.ok(wheelTraffic.length > 0);
  assert.ok(wheelTraffic.every((contact) => contact.metadata?.tire === undefined));
  assert.equal(game.controller.getTelemetry().tires.rear.contactCount, 0);
  game.dispose();
});

test('moving synthetic traffic transfers a deterministic bounded collision impulse to the motorcycle', () => {
  const runImpact = () => {
    const game = createMotorcyclePhysics({
      worldOptions: {
        gravity: [0, 0, 0],
        solverIterations: 12,
        maxParticles: 1_024,
        maxLinearSpeed: 80,
      },
      rigOptions: { id: 'impact-bike' },
    });
    const chassis = game.world.getBody(game.rig.bodyIds.chassis);
    const impactY = chassis.position[1];
    const impactZ = chassis.position[2];
    game.world.addBody({
      id: 'synthetic-traffic-impact',
      motionType: 'kinematic',
      position: [-2, impactY, impactZ],
      mass: 1_200,
      particleCloud: createBoxParticleCloud({
        halfExtents: [0.12, 0.18, 0.28],
        radius: 0.12,
        spacing: 0.18,
        shell: true,
        tag: 'synthetic-traffic',
      }),
    });
    let collisionStep = null;
    let maximumImpulse = 0;
    let maximumPenetration = 0;
    for (let index = 0; index < 15; index += 1) {
      game.world.setKinematicTarget('synthetic-traffic-impact', {
        position: [-2 + (index + 1) * 0.15, impactY, impactZ],
        orientation: [0, 0, 0, 1],
      });
      game.world.stepFrame(1 / 120, { sequence: index });
      const trafficContacts = game.world.getContacts().filter((contact) => (
        contact.type === 'particle'
        && [contact.bodyA, contact.bodyB].includes('synthetic-traffic-impact')
      ));
      maximumImpulse = Math.max(
        maximumImpulse,
        ...trafficContacts.map((contact) => contact.normalImpulse),
      );
      maximumPenetration = Math.max(
        maximumPenetration,
        ...trafficContacts.map((contact) => contact.penetration),
      );
      if (maximumImpulse > 0) {
        collisionStep = index;
        break;
      }
    }
    const result = {
      collisionStep,
      maximumImpulse,
      maximumPenetration,
      linearVelocity: Array.from(chassis.linearVelocity),
      angularVelocity: Array.from(chassis.angularVelocity),
      overflows: game.world.getTelemetry().overflows,
      snapshot: game.world.getSnapshot(),
    };
    game.dispose();
    return result;
  };

  const first = runImpact();
  const second = runImpact();
  assert.deepEqual(second, first);
  assert.ok(first.collisionStep !== null && first.collisionStep < 15);
  assert.ok(first.maximumImpulse > 0);
  assert.ok(first.maximumPenetration < 0.1);
  assert.ok(Math.abs(first.linearVelocity[0]) > 1);
  assert.ok(Math.hypot(...first.angularVelocity) > 0);
  assert.equal(first.overflows.overflowed, false);
  assert.ok(first.snapshot.bodies.every((state) => (
    [...state.position, ...state.orientation, ...state.linearVelocity, ...state.angularVelocity]
      .every(Number.isFinite)
  )));
});

test('same controls produce deterministic motorcycle snapshots and telemetry', () => {
  const make = () => {
    const game = createMotorcyclePhysics({
      worldOptions: { solverIterations: 12, maxParticles: 512 },
    });
    game.world.addSurfaceCollider(createPlaneSurfaceCollider());
    return game;
  };
  const first = make();
  const second = make();
  for (let index = 0; index < 150; index += 1) {
    const control = {
      sequence: index,
      throttle: index > 60 ? 0.45 : 0,
      steer: index > 100 ? 0.2 : 0,
      shiftDelta: index === 90 ? 1 : 0,
    };
    first.stepFrame(1 / 120, control);
    second.stepFrame(1 / 120, control);
  }
  assert.deepEqual(first.world.getSnapshot(), second.world.getSnapshot());
  assert.deepEqual(first.controller.getTelemetry(), second.controller.getTelemetry());
  first.dispose();
  second.dispose();
});
