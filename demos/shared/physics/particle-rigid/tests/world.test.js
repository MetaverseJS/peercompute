import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createParticleCloud,
  createRingParticleCloud,
  createHeightfieldSurfaceCollider,
  createParticleRigidWorld,
  createPlaneSurfaceCollider,
} from '../index.js';
import { bodyInertiaWorld } from '../bodyMath.js';
import { mat3MulVec, vecDot } from '../math.js';

function normalizedQuaternion(value) {
  const length = Math.hypot(...value);
  const result = value.map((entry) => entry / length);
  return result[3] < 0 ? result.map((entry) => -entry) : result;
}

function multiplyQuaternion(left, right) {
  const [leftX, leftY, leftZ, leftW] = left;
  const [rightX, rightY, rightZ, rightW] = right;
  return normalizedQuaternion([
    leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY,
    leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX,
    leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW,
    leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ,
  ]);
}

function rigidReferenceFrameTransform() {
  const rotationQuaternion = normalizedQuaternion([0, 0, 1, 1]);
  const inverseRotationQuaternion = normalizedQuaternion([0, 0, -1, 1]);
  const translation = [10, -3, 5];
  const rotate = ([x, y, z]) => [-y, x, z];
  const inverseRotate = ([x, y, z]) => [y, -x, z];
  const forward = {
    schema: 'fixture.reference-frame-transform.v1',
    transformPoint(value) {
      const rotated = rotate(value);
      return rotated.map((entry, index) => entry + translation[index]);
    },
    transformVector: rotate,
    transformOrientation(value) {
      return multiplyQuaternion(rotationQuaternion, value);
    },
    inverse: null,
  };
  const inverse = {
    schema: 'fixture.reference-frame-transform.v1',
    transformPoint(value) {
      return inverseRotate(value.map((entry, index) => entry - translation[index]));
    },
    transformVector: inverseRotate,
    transformOrientation(value) {
      return multiplyQuaternion(inverseRotationQuaternion, value);
    },
    inverse: forward,
  };
  forward.inverse = inverse;
  Object.freeze(inverse);
  return Object.freeze(forward);
}

function axisAngleQuaternion(axis, radians) {
  const length = Math.hypot(...axis);
  const sine = Math.sin(radians / 2);
  return normalizedQuaternion([
    axis[0] * sine / length,
    axis[1] * sine / length,
    axis[2] * sine / length,
    Math.cos(radians / 2),
  ]);
}

function rotateVectorByQuaternion(rotation, value) {
  const [x, y, z, w] = rotation;
  const [vx, vy, vz] = value;
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [
    vx + w * tx + y * tz - z * ty,
    vy + w * ty + z * tx - x * tz,
    vz + w * tz + x * ty - y * tx,
  ];
}

function quaternionReferenceFrameTransform(rotation, translation) {
  const inverseRotation = [-rotation[0], -rotation[1], -rotation[2], rotation[3]];
  const forward = {
    schema: 'fixture.high-latitude-reference-frame-transform.v1',
    transformPoint(value) {
      const rotated = rotateVectorByQuaternion(rotation, value);
      return rotated.map((entry, index) => entry + translation[index]);
    },
    transformVector(value) {
      return rotateVectorByQuaternion(rotation, value);
    },
    transformOrientation(value) {
      return multiplyQuaternion(rotation, value);
    },
    inverse: null,
  };
  const inverse = {
    schema: 'fixture.high-latitude-reference-frame-transform.v1',
    transformPoint(value) {
      return rotateVectorByQuaternion(
        inverseRotation,
        value.map((entry, index) => entry - translation[index]),
      );
    },
    transformVector(value) {
      return rotateVectorByQuaternion(inverseRotation, value);
    },
    transformOrientation(value) {
      return multiplyQuaternion(inverseRotation, value);
    },
    inverse: forward,
  };
  forward.inverse = inverse;
  Object.freeze(inverse);
  return Object.freeze(forward);
}

function highLatitudeReferenceFrameTransform() {
  // A large pitch plus longitude-like rotation exercises the same non-planar
  // basis change that occurs when an ENU ride frame moves near a pole.
  const polarRotation = axisAngleQuaternion([1, 0, 0], 82 * Math.PI / 180);
  const longitudeRotation = axisAngleQuaternion([0, 1, 0], -147 * Math.PI / 180);
  const rotation = multiplyQuaternion(longitudeRotation, polarRotation);
  return quaternionReferenceFrameTransform(rotation, [850, -420, 1_290]);
}

function f32(value) {
  return Array.from(Float32Array.from(value));
}

function physicsQuaternion(value) {
  const initial = f32(value);
  const length = Math.hypot(...initial);
  const normalized = initial.map((entry) => entry / length);
  const canonical = normalized[3] < 0 ? normalized.map((entry) => -entry) : normalized;
  return f32(canonical);
}

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

test('reference-frame transform atomically preserves complete body, joint, and reset state', () => {
  const world = createParticleRigidWorld({
    gravity: [1, -2, 3],
    solverIterations: 12,
  });
  world.addSurfaceCollider(createPlaneSurfaceCollider());
  addSphere(world, 'dynamic', { position: [0, 0.18, 0], radius: 0.2 });
  addSphere(world, 'kinematic', {
    position: [4, 2, -1],
    orientation: normalizedQuaternion([0.1, -0.2, 0.3, 0.9]),
    motionType: 'kinematic',
  });
  world.stepFrame(1 / 120);
  assert.ok(world.getContacts().length > 0);
  assert.ok(world.spatialHash.getDiagnostics().cellCount > 0);
  world.addJoint({
    id: 'world-hinge',
    type: 'hinge',
    bodyA: 'dynamic',
    bodyB: null,
    anchors: { bodyA: [0, 0, 0], bodyB: [1.5, 2.5, -3.5] },
    axes: { bodyA: [0, 1, 0], bodyB: [0.25, 0.9, -0.1] },
  });
  world.addJoint({
    id: 'body-fixed',
    type: 'fixed',
    bodyA: 'dynamic',
    bodyB: 'kinematic',
    anchors: { bodyA: [0.1, 0.2, 0.3], bodyB: [-0.3, 0.2, 0.1] },
  });

  const dynamic = world.getBody('dynamic');
  dynamic.position.set([1, 2, 3]);
  dynamic.previousPosition.set([0.5, 1.5, 2.5]);
  dynamic.predictedPosition.set([1.25, 2.25, 3.25]);
  dynamic.orientation.set(physicsQuaternion([0.2, -0.1, 0.3, 0.9]));
  dynamic.previousOrientation.set(physicsQuaternion([-0.1, 0.25, 0.2, 0.93]));
  dynamic.predictedOrientation.set(physicsQuaternion([0.15, 0.05, -0.2, 0.96]));
  dynamic.linearVelocity.set([7, -8, 9]);
  dynamic.angularVelocity.set([-2, 3, 4]);
  dynamic.force.set([11, 12, -13]);
  dynamic.torque.set([-5, 6, 7]);
  const kinematic = world.getBody('kinematic');
  world.setKinematicTarget('kinematic', {
    position: [8, 9, 10],
    orientation: normalizedQuaternion([0.3, 0.1, -0.2, 0.9]),
  });
  world.captureInitialState();

  const transform = rigidReferenceFrameTransform();
  const bodyBefore = new Map(world.bodyOrder.map((body) => [body.id, {
    position: Array.from(body.position),
    previousPosition: Array.from(body.previousPosition),
    predictedPosition: Array.from(body.predictedPosition),
    orientation: Array.from(body.orientation),
    previousOrientation: Array.from(body.previousOrientation),
    predictedOrientation: Array.from(body.predictedOrientation),
    linearVelocity: Array.from(body.linearVelocity),
    angularVelocity: Array.from(body.angularVelocity),
    force: Array.from(body.force),
    torque: Array.from(body.torque),
    kinematicTarget: body.kinematicTarget ? {
      position: Array.from(body.kinematicTarget.position),
      orientation: Array.from(body.kinematicTarget.orientation),
    } : null,
  }]));
  const worldJoint = world.getJoint('world-hinge');
  const bodyJoint = world.getJoint('body-fixed');
  const worldJointBefore = {
    anchor: Array.from(worldJoint.localAnchorB),
    axis: Array.from(worldJoint.localAxisB),
    reference: Array.from(worldJoint.runtime.referenceB),
    orientation: Array.from(worldJoint.runtime.initialRelativeOrientation),
  };
  const bodyJointBefore = {
    anchor: Array.from(bodyJoint.localAnchorB),
    axis: Array.from(bodyJoint.localAxisB),
    reference: Array.from(bodyJoint.runtime.referenceB),
    orientation: Array.from(bodyJoint.runtime.initialRelativeOrientation),
  };
  const emitted = [];
  world.addReferenceFrameTransformListener((event) => emitted.push(event));
  assert.equal(world.transformReferenceFrame(transform), transform);
  assert.deepEqual(emitted, [transform]);

  for (const body of world.bodyOrder) {
    const before = bodyBefore.get(body.id);
    for (const field of ['position', 'previousPosition', 'predictedPosition']) {
      assert.deepEqual(Array.from(body[field]), f32(transform.transformPoint(before[field])), `${body.id} ${field}`);
    }
    for (const field of ['orientation', 'previousOrientation', 'predictedOrientation']) {
      assert.deepEqual(
        Array.from(body[field]),
        physicsQuaternion(transform.transformOrientation(before[field])),
        `${body.id} ${field}`,
      );
    }
    for (const field of ['linearVelocity', 'angularVelocity', 'force', 'torque']) {
      assert.deepEqual(Array.from(body[field]), f32(transform.transformVector(before[field])), `${body.id} ${field}`);
    }
    if (before.kinematicTarget) {
      assert.deepEqual(
        Array.from(body.kinematicTarget.position),
        f32(transform.transformPoint(before.kinematicTarget.position)),
      );
      assert.deepEqual(
        Array.from(body.kinematicTarget.orientation),
        physicsQuaternion(transform.transformOrientation(before.kinematicTarget.orientation)),
      );
    }
  }
  assert.deepEqual(Array.from(world.options.gravity), f32(transform.transformVector([1, -2, 3])));
  assert.deepEqual(Array.from(worldJoint.localAnchorB), f32(transform.transformPoint(worldJointBefore.anchor)));
  assert.deepEqual(Array.from(worldJoint.localAxisB), f32(transform.transformVector(worldJointBefore.axis)));
  assert.deepEqual(Array.from(worldJoint.runtime.referenceB), f32(
    transform.transformVector(worldJointBefore.reference),
  ));
  assert.deepEqual(
    Array.from(worldJoint.runtime.initialRelativeOrientation),
    physicsQuaternion(transform.transformOrientation(worldJointBefore.orientation)),
  );
  assert.deepEqual(Array.from(bodyJoint.localAnchorB), bodyJointBefore.anchor);
  assert.deepEqual(Array.from(bodyJoint.localAxisB), bodyJointBefore.axis);
  assert.deepEqual(Array.from(bodyJoint.runtime.referenceB), bodyJointBefore.reference);
  assert.notDeepEqual(Array.from(bodyJoint.runtime.initialRelativeOrientation), bodyJointBefore.orientation);
  assert.equal(world.getContacts().length, 0);
  assert.equal(world.getTelemetry().contactCount, 0);
  assert.equal(world.spatialHash.getDiagnostics().cellCount, 0);

  const transformedDefault = world.getSnapshot();
  dynamic.position.fill(999);
  dynamic.linearVelocity.fill(999);
  world.reset();
  assert.deepEqual(world.getSnapshot(), transformedDefault);
});

test('reference-frame transform fails closed before any state, contact, or hash mutation', () => {
  const world = createParticleRigidWorld({ gravity: [0, -9.81, 0] });
  world.addSurfaceCollider(createPlaneSurfaceCollider());
  addSphere(world, 'body', { position: [0, 0.18, 0], radius: 0.2 });
  world.stepFrame(1 / 120);
  const body = world.getBody('body');
  body.predictedPosition.set([1, 2, 3]);
  body.predictedOrientation.set(physicsQuaternion([0.2, 0.3, 0.1, 0.9]));
  body.force.set([1, 2, 3]);
  body.torque.set([4, 5, 6]);
  const snapshotBefore = world.getSnapshot();
  const predictedBefore = {
    position: Array.from(body.predictedPosition),
    orientation: Array.from(body.predictedOrientation),
  };
  const contactsBefore = world.getContacts();
  const hashBefore = world.spatialHash.getDiagnostics();
  const optionsBefore = world.options;
  let emitted = 0;
  world.addReferenceFrameTransformListener(() => { emitted += 1; });
  let vectorCalls = 0;
  const invalid = {
    transformPoint: (value) => [...value],
    transformOrientation: (value) => [...value],
    transformVector(value) {
      vectorCalls += 1;
      return vectorCalls === 4 ? [Number.NaN, value[1], value[2]] : [...value];
    },
  };
  assert.throws(() => world.transformReferenceFrame(invalid), /must be finite/u);
  assert.equal(emitted, 0);
  assert.equal(world.options, optionsBefore);
  assert.deepEqual(world.getSnapshot(), snapshotBefore);
  assert.deepEqual(Array.from(body.predictedPosition), predictedBefore.position);
  assert.deepEqual(Array.from(body.predictedOrientation), predictedBefore.orientation);
  assert.deepEqual(world.getContacts(), contactsBefore);
  assert.deepEqual(world.spatialHash.getDiagnostics(), hashBefore);

  assert.throws(
    () => world.transformReferenceFrame(rigidReferenceFrameTransform(), {
      gravity: [0, Number.NaN, 0],
    }),
    /local gravity override must be finite/u,
  );
  assert.equal(emitted, 0);
  assert.equal(world.options, optionsBefore);
  assert.deepEqual(world.getSnapshot(), snapshotBefore);
  assert.deepEqual(Array.from(body.predictedPosition), predictedBefore.position);
  assert.deepEqual(Array.from(body.predictedOrientation), predictedBefore.orientation);
  assert.deepEqual(world.getContacts(), contactsBefore);
  assert.deepEqual(world.spatialHash.getDiagnostics(), hashBefore);
});

test('local gravity override remains exact through repeated high-latitude frame rotations', () => {
  const localDown = f32([0, -9.81, 0]);
  const world = createParticleRigidWorld({ gravity: localDown });
  addSphere(world, 'traveler', {
    position: [320, 48, -175],
    orientation: normalizedQuaternion([0.2, -0.3, 0.1, 0.9]),
    linearVelocity: [31, -4, 12],
    angularVelocity: [-1.5, 2.25, 0.75],
  });
  const transform = highLatitudeReferenceFrameTransform();
  const body = world.getBody('traveler');
  const initial = {
    linearVelocity: Array.from(body.linearVelocity),
    angularVelocity: Array.from(body.angularVelocity),
    orientation: Array.from(body.orientation),
  };

  for (let cycle = 0; cycle < 64; cycle += 1) {
    for (const frame of [transform, transform.inverse]) {
      const velocityBefore = Array.from(body.linearVelocity);
      const angularVelocityBefore = Array.from(body.angularVelocity);
      const orientationBefore = Array.from(body.orientation);
      const speedBefore = Math.hypot(...velocityBefore);
      const angularSpeedBefore = Math.hypot(...angularVelocityBefore);
      world.transformReferenceFrame(frame, { gravity: localDown });

      assert.deepEqual(Array.from(world.options.gravity), localDown);
      assert.deepEqual(
        Array.from(body.linearVelocity),
        f32(frame.transformVector(velocityBefore)),
      );
      assert.deepEqual(
        Array.from(body.angularVelocity),
        f32(frame.transformVector(angularVelocityBefore)),
      );
      assert.deepEqual(
        Array.from(body.orientation),
        physicsQuaternion(frame.transformOrientation(orientationBefore)),
      );
      assert.ok(Math.abs(Math.hypot(...body.linearVelocity) - speedBefore) <= 4e-6);
      assert.ok(Math.abs(Math.hypot(...body.angularVelocity) - angularSpeedBefore) <= 4e-6);
      assert.ok(Math.abs(Math.hypot(...body.orientation) - 1) <= 2e-7);
    }
  }

  for (const field of ['linearVelocity', 'angularVelocity', 'orientation']) {
    initial[field].forEach((expected, index) => assert.ok(
      Math.abs(body[field][index] - expected) <= 2e-5,
      `${field}[${index}] drifted across high-latitude frame transactions`,
    ));
  }
  assert.deepEqual(world.getTelemetry().referenceFrame, {
    schema: 'peercompute.physics.reference-frame-telemetry.v1',
    transformCount: 128,
    gravityOverrideCount: 128,
    listenerInvocationCount: 0,
    listenerFailureCount: 0,
    lastListenerCount: 0,
    lastListenerFailureCount: 0,
    lastListenerError: null,
    lastGravityMode: 'local-override',
  });
});

test('throwing reference-frame listeners cannot corrupt or reject a committed transaction', () => {
  const world = createParticleRigidWorld({ gravity: [3, -4, 5] });
  addSphere(world, 'body', {
    position: [2, 3, 4],
    orientation: normalizedQuaternion([0.1, 0.4, -0.2, 0.87]),
    linearVelocity: [7, -8, 9],
    angularVelocity: [-2, 3, 4],
  });
  world.captureInitialState();
  const body = world.getBody('body');
  const before = {
    position: Array.from(body.position),
    orientation: Array.from(body.orientation),
    linearVelocity: Array.from(body.linearVelocity),
    angularVelocity: Array.from(body.angularVelocity),
  };
  const transform = rigidReferenceFrameTransform();
  const calls = [];
  world.addReferenceFrameTransformListener((event) => {
    calls.push(['first', event]);
  });
  world.addReferenceFrameTransformListener((event) => {
    calls.push(['throwing', event]);
    throw new Error('synthetic listener failure');
  });
  world.addReferenceFrameTransformListener((event) => {
    calls.push(['last', event]);
  });

  let returned = null;
  assert.doesNotThrow(() => {
    returned = world.transformReferenceFrame(transform, { gravity: [0, -9.81, 0] });
  });
  assert.equal(returned, transform);
  assert.deepEqual(calls.map(([label]) => label), ['first', 'throwing', 'last']);
  assert.ok(calls.every(([, event]) => event === transform));
  assert.deepEqual(Array.from(body.position), f32(transform.transformPoint(before.position)));
  assert.deepEqual(
    Array.from(body.orientation),
    physicsQuaternion(transform.transformOrientation(before.orientation)),
  );
  assert.deepEqual(
    Array.from(body.linearVelocity),
    f32(transform.transformVector(before.linearVelocity)),
  );
  assert.deepEqual(
    Array.from(body.angularVelocity),
    f32(transform.transformVector(before.angularVelocity)),
  );
  assert.deepEqual(Array.from(world.options.gravity), f32([0, -9.81, 0]));

  const telemetry = world.getTelemetry();
  assert.deepEqual(telemetry.referenceFrame, {
    schema: 'peercompute.physics.reference-frame-telemetry.v1',
    transformCount: 1,
    gravityOverrideCount: 1,
    listenerInvocationCount: 3,
    listenerFailureCount: 1,
    lastListenerCount: 3,
    lastListenerFailureCount: 1,
    lastListenerError: 'Error: synthetic listener failure',
    lastGravityMode: 'local-override',
  });
  telemetry.referenceFrame.listenerFailureCount = 999;
  assert.equal(world.getTelemetry().referenceFrame.listenerFailureCount, 1);
  assert.equal(world.stepFrame(0).telemetry.referenceFrame.listenerFailureCount, 1);
});

test('repeated reference-frame forward/inverse transactions replay deterministically', () => {
  const makeWorld = () => {
    const world = createParticleRigidWorld({ gravity: [1, -2, 3] });
    addSphere(world, 'body', {
      position: [231.25, 17.75, -94.5],
      orientation: normalizedQuaternion([0.1, 0.2, -0.3, 0.9]),
      linearVelocity: [12, -4, 7],
      angularVelocity: [-2, 1, 3],
    });
    const body = world.getBody('body');
    body.previousPosition.set([230.75, 17.5, -95]);
    body.predictedPosition.set([231.75, 18, -94]);
    body.force.set([9, 8, 7]);
    body.torque.set([-6, 5, 4]);
    world.captureInitialState();
    return world;
  };
  const first = makeWorld();
  const second = makeWorld();
  const initial = first.getSnapshot();
  const transform = rigidReferenceFrameTransform();
  for (let index = 0; index < 256; index += 1) {
    for (const world of [first, second]) {
      world.transformReferenceFrame(transform);
      world.transformReferenceFrame(transform.inverse);
    }
  }
  assert.deepEqual(second.getSnapshot(), first.getSnapshot());
  const final = first.getSnapshot();
  for (const field of ['position', 'previousPosition', 'linearVelocity', 'angularVelocity', 'force', 'torque']) {
    initial.bodies[0][field].forEach((expected, index) => assert.ok(
      Math.abs(final.bodies[0][field][index] - expected) <= 2e-5,
      `${field}[${index}] drifted`,
    ));
  }
  initial.bodies[0].orientation.forEach((expected, index) => assert.ok(
    Math.abs(final.bodies[0].orientation[index] - expected) <= 2e-6,
    `orientation[${index}] drifted`,
  ));
  first.reset();
  assert.deepEqual(first.getSnapshot(), final);
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
  const orientationBeforeShift = Array.from(world.getBody('body').orientation);
  const velocityBeforeShift = Array.from(world.getBody('body').linearVelocity);
  const originEvents = [];
  const referenceEvents = [];
  world.addOriginShiftListener((shift) => originEvents.push(Array.from(shift)));
  world.addReferenceFrameTransformListener((transform) => referenceEvents.push(transform));
  world.shiftOrigin([5, 0, -3]);
  assert.deepEqual(Array.from(world.getBody('body').position), [
    Math.fround(beforeShift[0] - 5),
    Math.fround(beforeShift[1]),
    Math.fround(beforeShift[2] + 3),
  ]);
  assert.deepEqual(Array.from(world.getBody('body').orientation), orientationBeforeShift);
  assert.deepEqual(Array.from(world.getBody('body').linearVelocity), velocityBeforeShift);
  assert.deepEqual(originEvents, [[5, 0, -3]]);
  assert.equal(referenceEvents.length, 1);
  assert.equal(referenceEvents[0].schema, 'peercompute.physics.translation-reference-frame-transform.v1');
  assert.deepEqual(Array.from(world.options.gravity), f32([0, -9.81, 0]));
  assert.equal(world.getTelemetry().referenceFrame.lastGravityMode, 'transformed-legacy');
  world.reset();
  assert.deepEqual(Array.from(world.getBody('body').position), [-5, Math.fround(1.2), 3]);
});

test('continuous wheel support replaces particle surface queries without removing ring inertia', () => {
  const world = createParticleRigidWorld({
    solverIterations: 12,
    maxAngularSpeed: 200,
  });
  world.addSurfaceCollider(createPlaneSurfaceCollider({
    id: 'road',
    friction: 1.05,
    metadata: { source: 'continuous-wheel-fixture' },
  }));
  world.addBody({
    id: 'wheel',
    position: [0, 0.412, 0],
    angularVelocity: [72, 0, 0],
    mass: 12,
    particleCloud: createRingParticleCloud({
      radius: 0.34,
      tubeRadius: 0.072,
      segments: 32,
      axis: 'x',
      tag: 'test-tire',
    }),
    surfaceContactShapes: [{
      id: 'tread',
      type: 'wheel',
      center: [0, 0, 0],
      axis: [1, 0, 0],
      radius: 0.34,
      treadRadius: 0.072,
      tag: 'test-tire',
      material: {
        contactModel: 'compliant',
        contactStiffness: 24_000_000,
        contactDamping: 24_000,
      },
    }],
  });
  const wheel = world.getBody('wheel');
  assert.equal(wheel.particleCloud.count, 32);
  assert.equal(wheel.surfaceContactShapes.length, 1);
  const localShapeBefore = {
    center: Array.from(wheel.surfaceContactShapes[0].localCenter),
    axis: Array.from(wheel.surfaceContactShapes[0].localAxis),
  };
  const heights = [];
  const verticalSpeeds = [];
  for (let step = 0; step < 360; step += 1) {
    world.stepFrame(1 / 120);
    if (step >= 240) {
      heights.push(wheel.position[1]);
      verticalSpeeds.push(wheel.linearVelocity[1]);
    }
  }
  const contacts = world.getContacts();
  assert.equal(contacts.length, 1);
  assert.equal(contacts[0].type, 'surface');
  assert.equal(contacts[0].surfaceContactShapeA, 'tread');
  assert.equal(contacts[0].particleA, null);
  assert.equal(contacts[0].particleTagA, 'test-tire');
  assert.equal(contacts[0].contactModel, 'compliant');
  assert.equal(contacts[0].metadata.source, 'continuous-wheel-fixture');
  assert.equal(contacts[0].metadata.surfaceContactShape, 'wheel');
  assert.ok(contacts[0].normalImpulse > 0);
  assert.ok(Math.max(...heights) - Math.min(...heights) <= 0.001);
  assert.ok(Math.max(...verticalSpeeds) - Math.min(...verticalSpeeds) <= 0.02);
  assert.ok(world.getTelemetry().surfaceQueries <= 8);
  world.shiftOrigin([4, 0, -7]);
  assert.deepEqual(Array.from(wheel.surfaceContactShapes[0].localCenter), localShapeBefore.center);
  assert.deepEqual(Array.from(wheel.surfaceContactShapes[0].localAxis), localShapeBefore.axis);
});

test('continuous wheel support schema fails closed on invalid shape or compliance', () => {
  const cloud = createRingParticleCloud({ segments: 8 });
  const invalidShape = createParticleRigidWorld();
  assert.throws(() => invalidShape.addBody({
    id: 'invalid-shape',
    particleCloud: cloud,
    surfaceContactShapes: [{
      id: 'shape',
      type: 'capsule',
      radius: 0.3,
      treadRadius: 0.05,
    }],
  }), /unsupported type/);
  const invalidCompliance = createParticleRigidWorld();
  assert.throws(() => invalidCompliance.addBody({
    id: 'invalid-compliance',
    particleCloud: cloud,
    surfaceContactShapes: [{
      id: 'tread',
      type: 'wheel',
      radius: 0.3,
      treadRadius: 0.05,
      material: { contactModel: 'compliant', contactStiffness: 0 },
    }],
  }), /contactStiffness must be positive/);
});
