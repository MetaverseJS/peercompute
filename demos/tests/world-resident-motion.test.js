import test from 'node:test';
import assert from 'node:assert/strict';
import { WorldResidentMotion } from '../shared/agents/WorldResidentMotion.js';
import { WorldEmbodimentLease } from '../shared/agents/WorldEmbodimentLease.js';
import { PhysicsWorld } from '../cubechat/src/physics/world.js';
import { TronScene } from '../cubechat/src/renderer/scene.js';

test('scripted roam is deterministic and ground-constrained over many updates, including resumed tabs', () => {
  const a = new WorldResidentMotion({ key: 'Ada', position: [0, 3, 0], mode: 'roam' });
  const b = new WorldResidentMotion({ key: 'Ada', position: [0, 3, 0], mode: 'roam' });
  let left = [0, 3, 0], right = [...left];
  for (let index = 0; index < 4000; index++) {
    const dt = index % 100 === 0 ? 90 : 1 / 60;
    const next = a.step({ position: left, dt }); right = b.step({ position: right, dt });
    assert.deepEqual(next, right); assert.equal(next[1], 3);
    assert(Math.hypot(next[0] - left[0], next[2] - left[2]) <= 0.500001);
    assert(Math.hypot(next[0], next[2]) <= 24.00001); left = next;
  }
  assert(Math.hypot(left[0], left[2]) > 1);
});

test('follow obeys stand-off distance, obstacles and conversation pauses without a jump action', () => {
  const motor = new WorldResidentMotion({ key: 'Ada', position: [0, 7, 0], mode: 'follow' });
  let position = [0, 7, 0];
  for (let index = 0; index < 1000; index++) position = motor.step({ position, target: [30, 50, 0], dt: 1 / 60 });
  assert(Math.abs(position[0] - 20) < 1e-6); assert.equal(position[1], 7);
  for (const status of ['thinking', 'speaking', 'paused']) assert.deepEqual(motor.step({ position, target: [100, 0, 0], dt: 1, status }), position);
  assert.deepEqual(motor.step({ position, target: [100, 0, 0], dt: 1, obstacles: [[26.9, 3, 0]] }), position);
  motor.setMode('stationary'); assert.deepEqual(motor.step({ position, target: [100, 0, 0], dt: 1 }), position);
  assert.throws(() => motor.setMode('jump'), /Unknown/);
  assert.throws(() => motor.step({ position, dt: Infinity }), /timestep/);
  assert.throws(() => motor.step({ position: [0, NaN, 0], dt: 1 }), /bounded/);
});

test('self-directed never chooses scripted motion and discards a previous roam destination', () => {
  const motion = new WorldResidentMotion({ key: 'Ada', position: [0, 3, 0], mode: 'roam' });
  motion.step({ position: [0, 3, 0], dt: 1 / 60 });
  assert(motion.destination, 'explicit roam selected a destination');
  const seed = motion.seed;
  motion.setMode('self-directed');
  assert.equal(motion.destination, null);
  for (let index = 0; index < 200; index++) {
    // A separate motor may have moved the body; never pull it back to the
    // scripted anchor or toward the owner's current position.
    const position = [index, 3, -index], target = [index + 50, 3, 80];
    const next = motion.step({ position, target, dt: index % 2 ? 90 : 1 / 60 });
    assert.deepEqual(next, position); assert.notEqual(next, position);
  }
  assert.equal(motion.seed, seed); assert.equal(motion.destination, null);
  motion.setMode('follow');
  assert(motion.step({ position: [0, 3, 0], target: [100, 3, 0], dt: 1 })[0] > 0);
  const unspecified = new WorldResidentMotion({ key: 'unspecified', position: [0, 3, 0] });
  assert.equal(unspecified.mode, 'self-directed');
  assert.deepEqual(unspecified.step({ position: [0, 3, 0], target: [100, 3, 0], dt: 90 }), [0, 3, 0]);
});

test('repeated player creation reuses one collider and one existing renderer body', () => {
  const physics = new PhysicsWorld();
  const first = physics.createPlayerBody('human', { x: 1, y: 3, z: 2 });
  first.velocity.x = 2;
  for (let index = 0; index < 20; index++) assert.equal(physics.createPlayerBody('human', { x: 0, y: 3, z: 0 }), first);
  assert.equal(physics.world.bodies.length, 2); assert.equal(first.velocity.x, 2);
  const mesh = { existing: true };
  assert.equal(TronScene.prototype.createPlayer.call({ players: new Map([['human', mesh]]) }, 'human', '#ffffff', { x: 0, y: 3, z: 0 }), mesh);
  physics.removePlayerBody('human'); assert.equal(physics.world.bodies.length, 1);
  assert.notEqual(physics.createPlayerBody('human', { x: 0, y: 3, z: 0 }), first);
});

test('unsupported Web Locks retains same-page ownership without claiming cross-tab protection', async () => {
  const options = { namespace: 'motion-fixture', worldId: 'world', lockManager: null };
  const a = new WorldEmbodimentLease(options), b = new WorldEmbodimentLease(options);
  assert.equal(a.supported, false); assert.equal(await a.acquire('agent'), true);
  assert.equal(await b.acquire('agent'), false); assert.equal(await a.acquire('agent'), true);
  await a.close(); await a.close(); assert.equal(await b.acquire('agent'), true);
  await b.close(); assert.equal(await a.acquire('agent'), false);
});

test('a failing native lock service is surfaced and never silently grants duplicate ownership', async () => {
  const lease = new WorldEmbodimentLease({ namespace: 'fixture', worldId: 'world',
    lockManager: { request: async () => { throw new Error('Lock service failed'); } } });
  await assert.rejects(lease.acquire('agent'), /Lock service failed/); assert.equal(lease.entries.size, 0);
  await lease.close();
});
