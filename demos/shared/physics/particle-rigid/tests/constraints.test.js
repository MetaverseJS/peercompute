import assert from 'node:assert/strict';
import test from 'node:test';

import { createParticleCloud, createParticleRigidWorld } from '../index.js';

const cloud = createParticleCloud([{ position: [0, 0, 0], radius: 0.12, mass: 1 }]);

function addBody(world, id, position, motionType = 'dynamic', mass = 1) {
  world.addBody({ id, position, motionType, mass, particleCloud: cloud });
}

test('hinge keeps anchors coincident while allowing axial rotation', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 18 });
  addBody(world, 'anchor', [0, 0, 0], 'static');
  addBody(world, 'arm', [1, 0, 0]);
  world.addJoint({
    id: 'hinge',
    type: 'hinge',
    bodyA: 'arm',
    bodyB: 'anchor',
    anchors: { bodyA: [-1, 0, 0], bodyB: [0, 0, 0] },
    axes: { bodyA: [0, 0, 1], bodyB: [0, 0, 1] },
  });
  world.addStepListener(() => world.applyForce('arm', [0, 3, 0]));
  for (let index = 0; index < 240; index += 1) world.stepFrame(1 / 120);
  const arm = world.getBody('arm');
  const anchorPosition = [
    arm.position[0] - 1 * (1 - 2 * (arm.orientation[1] ** 2 + arm.orientation[2] ** 2)),
    arm.position[1] - 1 * (2 * (arm.orientation[0] * arm.orientation[1] + arm.orientation[2] * arm.orientation[3])),
    arm.position[2] - 1 * (2 * (arm.orientation[0] * arm.orientation[2] - arm.orientation[1] * arm.orientation[3])),
  ];
  assert.ok(Math.hypot(...anchorPosition) < 0.06, `hinge anchor drifted: ${anchorPosition}`);
  assert.ok(Math.abs(world.getJoint('hinge').runtime.angle) > 0.05);
});

test('prismatic joint allows axial travel, rejects transverse travel, and enforces limits', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 18 });
  addBody(world, 'rail', [0, 0, 0], 'static');
  addBody(world, 'slider', [0, 0, 0]);
  world.addJoint({
    id: 'slide',
    type: 'prismatic',
    bodyA: 'slider',
    bodyB: 'rail',
    axes: { bodyA: [1, 0, 0], bodyB: [1, 0, 0] },
    limits: { min: -0.2, max: 0.2 },
  });
  world.addStepListener(() => world.applyForce('slider', [20, 20, 5]));
  for (let index = 0; index < 180; index += 1) world.stepFrame(1 / 120);
  const slider = world.getBody('slider');
  assert.ok(slider.position[0] > 0.1 && slider.position[0] < 0.24);
  assert.ok(Math.abs(slider.position[1]) < 0.025);
  assert.ok(Math.abs(slider.position[2]) < 0.025);
  assert.ok(world.getJoint('slide').runtime.position <= 0.205);
});

test('spring and damper pull a displaced body toward rest length', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 12 });
  addBody(world, 'anchor', [0, 0, 0], 'static');
  addBody(world, 'mass', [2, 0, 0], 'dynamic', 2);
  world.addJoint({
    id: 'spring',
    type: 'spring',
    bodyA: 'mass',
    bodyB: 'anchor',
    restLength: 1,
    stiffness: 45,
    damping: 8,
  });
  for (let index = 0; index < 360; index += 1) world.stepFrame(1 / 120);
  const distance = Math.hypot(...world.getBody('mass').position);
  assert.ok(Math.abs(distance - 1) < 0.08, `spring did not settle: length=${distance}`);
  assert.ok(Math.abs(world.getJoint('spring').runtime.springForce) < 2);
});

test('hinge motor reaches a bounded target without overwriting pose', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 18 });
  addBody(world, 'anchor', [0, 0, 0], 'static');
  addBody(world, 'rotor', [0, 0, 0]);
  world.addJoint({
    id: 'motor',
    type: 'hinge',
    bodyA: 'rotor',
    bodyB: 'anchor',
    axes: { bodyA: [0, 0, 1], bodyB: [0, 0, 1] },
    limits: { min: -0.5, max: 0.5 },
    stiffness: 10,
    motor: { targetPosition: 0.35, targetVelocity: 0, maxImpulse: 0.2 },
  });
  for (let index = 0; index < 240; index += 1) world.stepFrame(1 / 120);
  const joint = world.getJoint('motor');
  assert.ok(joint.runtime.angle > 0.2 && joint.runtime.angle < 0.5, `motor angle=${joint.runtime.angle}`);
  assert.ok(Math.abs(joint.runtime.motorImpulse) <= 0.200001);
  const rotor = world.getBody('rotor');
  assert.notDeepEqual(Array.from(rotor.orientation), [0, 0, 0, 1]);
  assert.ok(rotor.orientation instanceof Float32Array);
});

test('hinge positional correction enforces hard limits under sustained torque', () => {
  const world = createParticleRigidWorld({ gravity: [0, 0, 0], solverIterations: 12 });
  addBody(world, 'anchor', [0, 0, 0], 'static');
  addBody(world, 'arm', [0, 0, 0]);
  world.addJoint({
    id: 'limited',
    type: 'hinge',
    bodyA: 'arm',
    bodyB: 'anchor',
    axes: { bodyA: [0, 0, 1], bodyB: [0, 0, 1] },
    limits: { min: -0.2, max: 0.25 },
  });
  world.addStepListener(() => world.applyTorque('arm', [0, 0, 30]));
  let maximum = -Infinity;
  for (let index = 0; index < 600; index += 1) {
    world.stepFrame(1 / 120);
    maximum = Math.max(maximum, world.getJoint('limited').runtime.angle);
  }
  assert.ok(maximum <= 0.250001, `hinge escaped maximum: ${maximum}`);
  assert.ok(world.getJoint('limited').runtime.angle >= -0.200001);
});
