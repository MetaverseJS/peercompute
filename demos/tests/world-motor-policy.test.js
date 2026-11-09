import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as CANNON from 'cannon-es';
import checkpoint from '../shared/agents/motor/residentMotorCheckpoint.js';
import baseline from '../shared/agents/motor/residentMotorBaseline.js';
import { MOTOR_DYNAMICS as D, encodeMotorObservation, validateMotorBatch } from '../shared/agents/motor/motorContracts.js';
import { PARAMETER_COUNT, referenceMotorAction, validateCheckpoint } from '../shared/agents/motor/policyReference.js';
import { stepMotorState, evaluatePolicy } from '../shared/agents/motor/trainingEnvironment.js';

test('checked-in policy is a finite reproducible learned checkpoint with held-out evidence', () => {
  validateCheckpoint(checkpoint);
  assert.equal(checkpoint.weights.length, PARAMETER_COUNT);
  assert.equal(checkpoint.policyId, `sha256:${createHash('sha256').update(JSON.stringify(checkpoint.weights)).digest('hex')}`);
  assert.equal(checkpoint.training.kind, 'seeded-demonstration-behavioral-cloning');
  assert(checkpoint.training.updates > 1000); assert(checkpoint.training.finalMse < 0.02);
  assert.equal(checkpoint.training.evaluation.trained.approach.successRate, 1);
  assert(checkpoint.training.evaluation.navigation.successRate >= .9);
  assert(checkpoint.training.evaluation.navigation.successRate > checkpoint.training.evaluation.baseline.successRate);
  assert.equal(checkpoint.training.evaluation.zero.successRate, 0);
  assert.equal(checkpoint.training.evaluation.random.successRate, 0);
  assert.equal(baseline.shape[0], 7); assert.equal(baseline.weights.length, 1378);
  assert.equal(baseline.policyId, `sha256:${createHash('sha256').update(JSON.stringify(baseline.weights)).digest('hex')}`);
});
test('loaded learned weights reach and follow in held-out closed-loop rollouts; zero actions do not', () => {
  const learned = evaluatePolicy(observation => referenceMotorAction(checkpoint.weights, observation), 12);
  const zero = evaluatePolicy(() => [0, 0], 12);
  assert.equal(learned.approach.successRate, 1); assert.equal(learned.follow.successRate, 1);
  assert(learned.approach.meanTailError < 1.5); assert(learned.follow.meanTailError < 2);
  assert(learned.approach.meanTailError < zero.approach.meanTailError / 10);
  assert(learned.follow.meanTailError < zero.follow.meanTailError / 10);
  assert(learned.approach.finite && learned.follow.finite);
});
test('training integrator matches actual Cannon damping, preStep speed clamp and force integration', () => {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
  const body = new CANNON.Body({ mass: D.mass, linearDamping: D.linearDamping, fixedRotation: true,
    shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)) });
  body.linearFactor.set(1, 0, 1); body.position.set(12, 3, -8); body.velocity.set(7, 0, -3); world.addBody(body);
  let action = [0, 0]; world.addEventListener('preStep', () => {
    const speed = Math.hypot(body.velocity.x, body.velocity.z), scale = Math.min(1, D.maxSpeed / Math.max(speed, 1e-9));
    body.velocity.x *= scale; body.velocity.z *= scale;
    body.applyForce(new CANNON.Vec3(action[0] * D.mass, 0, action[1] * D.mass));
  });
  let state = { position: [12, -8], velocity: [7, -3] };
  for (let tick = 0; tick < 180; tick++) {
    action = [Math.sin(tick / 10) * 12, Math.cos(tick / 7) * 12];
    state = stepMotorState(state, action); world.step(D.fixedDt);
    assert(Math.abs(state.position[0] - body.position.x) < 1e-9);
    assert(Math.abs(state.position[1] - body.position.z) < 1e-9);
    assert(Math.abs(state.velocity[0] - body.velocity.x) < 1e-9);
  }
});
test('sensor encoding owns bounded data and keeps resident identities separate', () => {
  const observation = { relativePosition: [20, 0], velocity: [0, 0], targetVelocity: [0, 0], stopDistance: 10 };
  const batch = validateMotorBatch([{ id: 'a', observation }, { id: 'b', observation: { ...observation, relativePosition: [-20, 0] } }]);
  observation.relativePosition[0] = 99; assert.equal(batch[0].observation.relativePosition[0], 20);
  assert.throws(() => validateMotorBatch([{ id: 'a', observation }, { id: 'a', observation }]));
  assert.throws(() => encodeMotorObservation({ ...observation, velocity: [NaN, 0] }));
  assert.throws(() => validateMotorBatch(Array.from({ length: 17 }, (_, i) => ({ id: `${i}`, observation }))));
  const a = referenceMotorAction(checkpoint.weights, batch[0].observation), b = referenceMotorAction(checkpoint.weights, batch[1].observation);
  assert(Math.abs(a[0] + b[0]) < 1e-6); assert(a[0] > 0 && b[0] < 0);
});
