import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleNavigationSensors, NAVIGATION_SENSORS as S } from '../shared/agents/motor/navigationSensors.js';
import { MOTOR_INPUTS, encodeMotorObservation, validateMotorObservation } from '../shared/agents/motor/motorContracts.js';
import { createNavigationTeacher, navigationLayout, navigationRollout } from '../shared/agents/motor/navigationTrainingEnvironment.js';

test('footprint clearance sees walls and body-width doorways without counting arrival through a wall', () => {
  const wall = { min: [-2, -14], max: [2, 14] };
  const seen = sampleNavigationSensors({ position: [-30, 0], targetPosition: [30, 0], obstacles: [wall] });
  assert.equal(seen.clearance.length, S.rays); assert.equal(seen.targetClear, false);
  assert.equal(seen.clearance[0], 24.5 / 64); assert.equal(seen.clearance[16], 1);
  assert.equal(sampleNavigationSensors({ position: [-6, 0], targetPosition: [6, 0], obstacles: [wall] }).targetClear, false);
  const door = width => [{ min: [-2, -30], max: [2, -width / 2] }, { min: [-2, width / 2], max: [2, 30] }];
  assert.equal(sampleNavigationSensors({ position: [-30, 0], targetPosition: [30, 0], obstacles: door(6) }).targetClear, false);
  assert.equal(sampleNavigationSensors({ position: [-30, 0], targetPosition: [30, 0], obstacles: door(12) }).targetClear, true);
  const contact = sampleNavigationSensors({ position: [-5.1, 0], targetPosition: [5.1, 0], obstacles: door(5.95) });
  assert.equal(contact.targetClear, false, 'Recovery tolerance cannot claim arrival through an impassable doorway');
  for (const targetPosition of [[0, 0], [1e-7, 0]]) {
    assert.equal(sampleNavigationSensors({ position: [0, 0], targetPosition, obstacles: [wall] }).targetClear, false,
      'Coincident or sub-tolerance targets inside solid geometry cannot establish arrival');
  }
  assert.equal(sampleNavigationSensors({ position: [-30, 0], targetPosition: [-30, 0], obstacles: [wall] }).targetClear, true);
});
test('contact inside the optional margin preserves outward rays for learned recovery', () => {
  const sensors = sampleNavigationSensors({ position: [-5.01, 0], targetPosition: [30, 0],
    obstacles: [{ min: [-2, -14], max: [2, 14] }] });
  assert(sensors.clearance[0] < .01); assert.equal(sensors.clearance[16], 1); assert.equal(sensors.targetClear, false);
  const teacher = createNavigationTeacher([{ min: [-2, -14], max: [2, 14] }]);
  assert(teacher({ position: [-5.01, 0], target: [30, 0], velocity: [0, 0], stopDistance: 10 })[0] < 0);
});
test('local sensors rotate with the target and reject malformed/unbounded geometry', () => {
  const first = sampleNavigationSensors({ position: [-30, 0], targetPosition: [30, 0], obstacles: [{ min: [-2, -14], max: [2, 14] }] });
  const rotated = sampleNavigationSensors({ position: [0, -30], targetPosition: [0, 30], obstacles: [{ min: [-14, -2], max: [14, 2] }] });
  first.clearance.forEach((v, i) => assert(Math.abs(v - rotated.clearance[i]) < 1e-12));
  for (const obstacles of [Array(S.maximumObstacles + 1).fill({ min: [0, 0], max: [1, 1] }), [{ min: [NaN, 0], max: [1, 1] }], [{ min: [2, 0], max: [1, 1] }]]) {
    assert.throws(() => sampleNavigationSensors({ position: [0, 0], targetPosition: [20, 0], obstacles }));
  }
});
test('policy features own normalized geometry and exclude unstable previous-action feedback', () => {
  const observation = { relativePosition: [0, 20], velocity: [0, 0], targetVelocity: [0, 0], stopDistance: 10,
    previousAcceleration: [12, 0], clearance: Array(32).fill(.5), targetClear: false };
  const encoded = encodeMotorObservation(observation);
  assert.equal(encoded.input.length, MOTOR_INPUTS); assert.equal(encoded.input[39], 0);
  assert.deepEqual(encoded.input, encodeMotorObservation({ ...observation, previousAcceleration: [-12, 12] }).input);
  const validated = validateMotorObservation(observation); observation.clearance[0] = 1; assert.equal(validated.clearance[0], .5);
  assert.throws(() => validateMotorObservation({ ...observation, clearance: [1] }));
  assert.throws(() => validateMotorObservation({ ...observation, targetClear: 'true' }));
});
test('offline route demonstrations traverse seeded real Cannon walls, boxes and doorways without collision', () => {
  for (let i = 0; i < 8; i++) {
    const layout = navigationLayout(910000 + i * 101), teacher = createNavigationTeacher(layout.obstacles);
    const result = navigationRollout((_observation, state) => teacher(state), layout);
    assert(result.success, JSON.stringify(result)); assert.equal(result.collisionSeconds, 0);
  }
});
test('following demonstrations learn retreat when a target approaches inside the requested spacing', () => {
  const teacher = createNavigationTeacher([]);
  const acceleration = teacher({ position: [0, 0], target: [7, 0], velocity: [0, 0], targetVelocity: [-.5, 0], stopDistance: 10 });
  assert(acceleration[0] < 0); assert.equal(acceleration[1], 0);
  const layout = navigationLayout(920303), result = navigationRollout((_o, state) => teacher(state), { ...layout, obstacles: [] }, { follow: true, seconds: 60 });
  assert(result.success); assert(result.targetError < 1.5);
});
