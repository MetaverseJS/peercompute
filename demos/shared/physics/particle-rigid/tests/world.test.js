import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createParticleCloud,
  createHeightfieldSurfaceCollider,
  createParticleRigidWorld,
  createPlaneSurfaceCollider,
} from '../index.js';
import { bodyInertiaWorld } from '../bodyMath.js';
import { mat3MulVec, vecDot } from '../math.js';

function sphereCloud(radius = 0.2) {
  return createParticleCloud([{ position: [0, 0, 0], radius, mass: 1 }]);
}

function addSphere(world, id, options = {}) {
  return world.addBody({
    id,
    position: options.position ?? [0, 1, 0],
    orientation: options.orientation,
    linearVelocity: options.linearVelocity,
    angularVelocity: options.angularVelocity,
    mass: options.mass ?? 1,
    motionType: options.motionType ?? 'dynamic',
    particleCloud: sphereCloud(options.radius ?? 0.2),
    material: options.material,
    collisionGroup: options.collisionGroup,
    collisionMask: options.collisionMask,
    groups: options.groups,
  });
}

test('fixed accumulator runs 120 Hz substeps and surfaces dropped frame time', () => {
  const world = createParticleRigidWorld({ fixedDt: 1 / 120, maxSubSteps: 3, maxFrameDt: 0.2 });
  addSphere(world, 'body', { position: [0, 3, 0] });
  const normalFrame = world.stepFrame(1 / 60);
  assert.equal(normalFrame.substeps, 2);
  assert.equal(world.stepCount, 2);
  const boundedFrame = world.stepFrame(0.2);
  assert.equal(boundedFrame.substeps, 3);
  assert.ok(boundedFrame.droppedTime > 0.15);
  assert.equal(world.stepCount, 5);
  assert.ok(boundedFrame.alpha >= 0 && boundedFrame.alpha <= 1);
});

test('falling particle contacts a swept plane and Coulomb friction removes slide', () => {
  const world = createParticleRigidWorld({ solverIterations: 16, maxLinearSpeed: 200 });
  world.addSurfaceCollider(createPlaneSurfaceCollider({ friction: 1.1 }));
  addSphere(world, 'slider', {
    position: [0, 2, 0],
    linearVelocity: [8, -100, 0],
    radius: 0.25,
    material: { friction: 1.1, rollingFriction: 0.08 },
  });
  for (let index = 0; index < 300; index += 1) world.stepFrame(1 / 120);
  const body = world.getBody('slider');
  assert.ok(body.position[1] > 0.20, `body tunneled through plane: y=${body.position[1]}`);
  assert.ok(Math.abs(body.linearVelocity[0]) < 1.2, `friction did not slow body: vx=${body.linearVelocity[0]}`);
  assert.ok(world.getTelemetry().maximumPenetration < 0.04);
  assert.ok(world.getContacts().some((contact) => contact.surfaceId === 'ground'));
});

test('particle contacts exchange momentum without creating non-finite state', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 16 });
  addSphere(world, 'a', { position: [-0.45, 0, 0], linearVelocity: [2, 0, 0], radius: 0.25 });
  addSphere(world, 'b', { position: [0.45, 0, 0], linearVelocity: [-2, 0, 0], radius: 0.25 });
  let observedContact = false;
  for (let index = 0; index < 60; index += 1) {
    world.stepFrame(1 / 120);
    observedContact ||= world.getTelemetry().particleContactCount > 0;
  }
  assert.equal(observedContact, true);
  const a = world.getBody('a');
  const b = world.getBody('b');
  assert.ok(a.linearVelocity[0] < 0.2);
  assert.ok(b.linearVelocity[0] > -0.2);
  for (const value of [...a.position, ...a.linearVelocity, ...b.position, ...b.linearVelocity]) {
    assert.ok(Number.isFinite(value));
  }
});

test('force, torque, and force-at-point affect independent linear and angular state', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0] });
  world.addBody({
    id: 'body',
    position: [0, 0, 0],
    mass: 3,
    particleCloud: createParticleCloud([
      { position: [-0.5, -0.2, 0], radius: 0.1, mass: 1 },
      { position: [0.5, -0.2, 0], radius: 0.1, mass: 1 },
      { position: [0, 0.5, 0.2], radius: 0.1, mass: 1 },
    ]),
  });
  world.applyForce('body', [3, 0, 0]);
  world.applyTorque('body', [0, 0, 2]);
  world.applyForceAtPoint('body', [0, 4, 0], [1, 0, 0]);
  world.stepFrame(1 / 120);
  const body = world.getBody('body');
  assert.ok(body.linearVelocity[0] > 0);
  assert.ok(body.linearVelocity[1] > 0);
  assert.ok(body.angularVelocity[2] > 0);
});

test('asymmetric torque-free body conserves world momentum and energy while precessing', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], angularDamping: 0 });
  world.addBody({
    id: 'gyro',
    position: [0, 0, 0],
    angularVelocity: [4, 7, 2],
    mass: 4,
    particleCloud: createParticleCloud([
      { position: [-0.8, 0, 0], radius: 0.08, mass: 1 },
      { position: [0.8, 0, 0], radius: 0.08, mass: 1 },
      { position: [0, 0.3, 0], radius: 0.08, mass: 1 },
      { position: [0, 0, 0.15], radius: 0.08, mass: 1 },
    ]),
  });
  const invariants = () => {
    const body = world.getBody('gyro');
    const momentum = mat3MulVec(bodyInertiaWorld(body), body.angularVelocity);
    return {
      energy: 0.5 * vecDot(body.angularVelocity, momentum),
      momentum: Array.from(momentum),
      magnitude: Math.hypot(...momentum),
    };
  };
  const initial = Array.from(world.getBody('gyro').angularVelocity);
  const initialInvariants = invariants();
  for (let index = 0; index < 1_200; index += 1) world.stepFrame(1 / 120);
  const final = Array.from(world.getBody('gyro').angularVelocity);
  const finalInvariants = invariants();
  assert.ok(final.every(Number.isFinite));
  assert.ok(final.some((value, index) => Math.abs(value - initial[index]) > 0.02));
  assert.ok(Math.hypot(...world.getBody('gyro').orientation) > 0.999);
  const energyDrift = Math.abs(finalInvariants.energy - initialInvariants.energy)
    / initialInvariants.energy;
  const momentumDrift = Math.hypot(...finalInvariants.momentum.map(
    (value, index) => value - initialInvariants.momentum[index],
  )) / initialInvariants.magnitude;
  assert.ok(energyDrift < 0.001, `torque-free energy drift=${energyDrift}`);
  assert.ok(momentumDrift < 0.001, `world momentum drift=${momentumDrift}`);
});

test('swept particle CCD catches a kinematic body that crosses a dynamic sphere in one step', () => {
  const world = createParticleRigidWorld({
    gravity: [0, 0, 0],
    solverIterations: 12,
    maxLinearSpeed: 200,
  });
  addSphere(world, 'pusher', {
    position: [-0.6, 0, 0],
    motionType: 'kinematic',
    radius: 0.2,
  });
  addSphere(world, 'dynamic', { position: [0, 0, 0], radius: 0.2 });
  world.setKinematicTarget('pusher', { position: [0.6, 0, 0] });
  world.stepFrame(1 / 120);
  const contact = world.getContacts().find((candidate) => candidate.type === 'particle');
  assert.ok(contact, 'swept particle collision was missed');
  assert.equal(contact.metadata.swept, true);
  assert.ok(contact.metadata.toi > 0 && contact.metadata.toi < 1);
  assert.ok(world.getBody('dynamic').linearVelocity[0] > 0);
  assert.equal(world.getTelemetry().overflows.overflowed, false);
});

test('swept particle CCD follows a rotating particle arc instead of its endpoint chord', () => {
  const world = createParticleRigidWorld({
    gravity: [0, 0, 0],
    solverIterations: 12,
    maxAngularSpeed: 1_000,
  });
  world.addBody({
    id: 'rotator',
    motionType: 'kinematic',
    position: [0, 0, 0],
    mass: 1,
    particleCloud: createParticleCloud([
      { position: [1, 0, 0], radius: 0.1, mass: 1 },
      { position: [-1, 0, 0], radius: 0.1, mass: 1 },
    ]),
  });
  addSphere(world, 'arc-target', { position: [0, 1, 0], radius: 0.1 });
  world.setKinematicTarget('rotator', {
    position: [0, 0, 0],
    orientation: [0, 0, 1, 0],
  });
  world.stepFrame(1 / 120);
  const contact = world.getContacts().find((candidate) => candidate.metadata?.swept);
  assert.ok(contact, 'rotational arc collision was missed');
  assert.ok(contact.metadata.toi > 0.4 && contact.metadata.toi < 0.5, contact.metadata.toi);
  assert.ok(contact.metadata.ccdSegments >= 25);
  assert.ok(contact.normalImpulse > 0);
  assert.equal(world.getTelemetry().overflows.overflowed, false);
  assert.ok([...world.getBody('arc-target').linearVelocity].every(Number.isFinite));
});

test('excluded and masked pairs are pruned before the cap without losing deterministic CCD', () => {
  const makeWorld = () => {
    const world = createParticleRigidWorld({
      gravity: [0, 0, 0],
      fixedDt: 1 / 120,
      solverIterations: 12,
      maxCandidatePairs: 1,
      maxLinearSpeed: 200,
    });
    addSphere(world, '00-excluded-a', {
      position: [0, 0, 0],
      motionType: 'static',
      collisionGroup: 1,
      collisionMask: 1,
    });
    addSphere(world, '01-excluded-b', {
      position: [0, 0, 0],
      motionType: 'static',
      collisionGroup: 1,
      collisionMask: 1,
    });
    addSphere(world, '10-pusher', {
      position: [-0.6, 0, 0],
      motionType: 'kinematic',
      collisionGroup: 2,
      collisionMask: 4,
    });
    addSphere(world, '11-target', {
      position: [0, 0, 0],
      collisionGroup: 4,
      collisionMask: 2,
    });
    world.setBodiesCollide('00-excluded-a', '01-excluded-b', false);
    world.setKinematicTarget('10-pusher', { position: [0.6, 0, 0] });
    return world;
  };

  const first = makeWorld();
  const second = makeWorld();
  first.stepFrame(1 / 120);
  second.stepFrame(1 / 120);
  const contact = first.getContacts().find((candidate) => candidate.type === 'particle');
  assert.ok(contact, 'allowed swept pair was starved by earlier excluded pairs');
  assert.deepEqual([contact.bodyA, contact.bodyB], ['10-pusher', '11-target']);
  assert.equal(contact.metadata.swept, true);
  assert.ok(contact.metadata.toi > 0 && contact.metadata.toi < 1);
  assert.ok(first.getBody('11-target').linearVelocity[0] > 0);
  assert.equal(first.getTelemetry().overflows.candidatePairs, 0);
  assert.deepEqual(first.getSnapshot(), second.getSnapshot());
  assert.deepEqual(first.getContacts(), second.getContacts());
});

test('snapshot JSON round-trip restores state and deterministic replay is byte-stable', () => {
  const makeWorld = () => {
    const world = createParticleRigidWorld({ solverIterations: 10 });
    world.addSurfaceCollider(createPlaneSurfaceCollider());
    addSphere(world, 'z', { position: [0.2, 1.5, 0], linearVelocity: [0.4, 0, 0] });
    addSphere(world, 'a', { position: [-0.3, 2.2, 0.1], linearVelocity: [-0.1, 0, 0] });
    return world;
  };
  const first = makeWorld();
  const second = makeWorld();
  for (let index = 0; index < 240; index += 1) {
    first.stepFrame(1 / 120);
    second.stepFrame(1 / 120);
  }
  assert.deepEqual(first.getSnapshot(), second.getSnapshot());
  const checkpoint = JSON.parse(JSON.stringify(first.getSnapshot()));
  for (let index = 0; index < 30; index += 1) first.stepFrame(1 / 120);
  first.reset(checkpoint);
  assert.deepEqual(first.getSnapshot(), checkpoint);
  const transforms = first.getInterpolatedTransforms(0.5);
  assert.deepEqual(transforms.map(({ id }) => id), ['a', 'z']);
  assert.ok(transforms.every(({ position, orientation }) => position instanceof Float32Array
    && orientation instanceof Float32Array));
});

test('world asserts structural caps and reports broadphase overflow', () => {
  const capped = createParticleRigidWorld({ maxBodies: 1, maxParticles: 1 });
  addSphere(capped, 'one');
  assert.throws(() => addSphere(capped, 'two'), /body capacity/);

  const overflow = createParticleRigidWorld({
    gravity: [0, 0, 0],
    maxEntriesPerCell: 1,
    spatialCellSize: 1,
    maxContacts: 1,
  });
  addSphere(overflow, 'a', { position: [0, 0, 0], radius: 0.2 });
  addSphere(overflow, 'b', { position: [0.1, 0, 0], radius: 0.2 });
  addSphere(overflow, 'c', { position: [-0.1, 0, 0], radius: 0.2 });
  overflow.stepFrame(1 / 120);
  const diagnostics = overflow.getTelemetry().overflows;
  assert.equal(diagnostics.overflowed, true);
  assert.ok(diagnostics.gridCells > 0);
  assert.ok(diagnostics.contacts > 0);

  const throwing = createParticleRigidWorld({
    gravity: [0, 0, 0],
    maxEntriesPerCell: 1,
    throwOnOverflow: true,
  });
  addSphere(throwing, 'a', { position: [0, 0, 0] });
  addSphere(throwing, 'b', { position: [0.1, 0, 0] });
  assert.throws(() => throwing.stepFrame(1 / 120), /physics capacity overflow/);
});

test('dispose is idempotent and prevents later mutation', () => {
  const world = createParticleRigidWorld();
  addSphere(world, 'body');
  world.dispose();
  world.dispose();
  assert.throws(() => world.stepFrame(1 / 120), /disposed/);
  assert.throws(() => world.addBody({}), /disposed/);
});

test('kinematic targets publish derived velocities and collide with dynamic particles', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 12 });
  addSphere(world, 'pusher', { position: [-1, 0, 0], motionType: 'kinematic', radius: 0.25 });
  addSphere(world, 'dynamic', { position: [0.1, 0, 0], radius: 0.25 });
  world.setKinematicTarget('pusher', { position: [-0.25, 0, 0] });
  world.stepFrame(1 / 120);
  assert.deepEqual(Array.from(world.getBody('pusher').position), [-0.25, 0, 0]);
  assert.ok(world.getBody('pusher').linearVelocity[0] > 80);
  assert.ok(world.getBody('dynamic').linearVelocity[0] > 0);
  world.stepFrame(1 / 120);
  assert.equal(world.getBody('pusher').linearVelocity[0], 0);
});

test('heightfield contacts settle on sampled relief and deterministic origin shift preserves reset frame', () => {
  const world = createParticleRigidWorld({ solverIterations: 16 });
  world.addSurfaceCollider(createHeightfieldSurfaceCollider({
    id: 'slope',
    sampleHeight: (x) => 0.2 + x * 0.05,
    bounds: { minX: -10, maxX: 10, minZ: -10, maxZ: 10 },
  }));
  addSphere(world, 'body', { position: [0, 1.2, 0], radius: 0.2 });
  world.captureInitialState();
  for (let index = 0; index < 240; index += 1) world.stepFrame(1 / 120);
  assert.ok(world.getBody('body').position[1] > 0.37);
  const beforeShift = Array.from(world.getBody('body').position);
  world.shiftOrigin([5, 0, -3]);
  assert.deepEqual(Array.from(world.getBody('body').position), [
    Math.fround(beforeShift[0] - 5),
    Math.fround(beforeShift[1]),
    Math.fround(beforeShift[2] + 3),
  ]);
  world.reset();
  assert.deepEqual(Array.from(world.getBody('body').position), [-5, Math.fround(1.2), 3]);
});
