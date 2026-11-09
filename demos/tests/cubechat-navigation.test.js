import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { createCubeNavigationSensors } from '../cubechat/src/agents/CubeNavigationSensors.js';
import { CubeResidentMotor } from '../cubechat/src/agents/CubeResidentMotor.js';
import { MOTOR_DYNAMICS as D } from '../shared/agents/motor/motorContracts.js';

function fixture(t) {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) }), entries = new Map(), bodies = new Map();
  const box = (position, half, options = {}) => {
    const body = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(...position), shape: new CANNON.Box(new CANNON.Vec3(...half)), ...options });
    world.addBody(body); return body;
  };
  const body = box([0, 3, 0], [3, 3, 3], { mass: D.mass, linearDamping: D.linearDamping, fixedRotation: true });
  const entry = { body, descriptor: { local: true, agentId: 'ada', ownerPeerId: 'owner', status: 'idle' },
    mesh: { position: { toArray: () => body.position.toArray() }, rotation: { y: 0 } } };
  entries.set('ada', entry);
  const target = { id: 'human:person', peerId: 'person', kind: 'human', name: 'Person', position: [45, 3, 0], velocity: [0, 0, 0] };
  const sensor = createCubeNavigationSensors({ physics: { world, bodies }, getEntries: () => entries });
  let clock = 0, participants = [target]; const calls = [], events = [];
  const motor = new CubeResidentMotor({ getEntries: () => entries, observe: () => ({ participants }),
    senseNavigation: (key, observed) => sensor.sample(key, observed), now: () => clock });
  motor.subscribe(event => events.push(event));
  motor.setService({ infer: async batch => { calls.push(batch); return { backend: 'fixture', policyId: 'controlled-force', worker: false,
    results: batch.map(({ id }) => ({ id, acceleration: [2, 0] })) }; } });
  const tick = async (count, { physical = false } = {}) => {
    for (let i = 0; i < count; i++) {
      clock += D.fixedDt * 1000;
      motor.beforeStep();
      if (motor.pending) await motor.pending.done;
      if (physical) world.step(D.fixedDt);
    }
  };
  t.after(() => motor.dispose());
  return { world, entries, bodies, body, entry, target, sensor, motor, calls, events, box, tick,
    advanceClock: milliseconds => { clock += milliseconds; }, loseTarget: () => { participants = []; } };
}

test('Cannon sensor detects long, rotated and compound box extents instead of center/radius summaries', t => {
  const f = fixture(t), wall = f.box([8, 3, 100], [1, 3, 110]);
  assert.equal(f.sensor.sample('ada', f.target).targetClear, false, 'long wall reaches the corridor although its center is distant');
  f.world.removeBody(wall);
  const rotated = f.box([12, 3, 4], [1, 3, 10]); rotated.quaternion.setFromEuler(0, Math.PI / 4, 0);
  assert.equal(f.sensor.sample('ada', f.target).targetClear, false);
  f.world.removeBody(rotated);
  const compound = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 0, 0) });
  compound.addShape(new CANNON.Box(new CANNON.Vec3(1, 3, 5)), new CANNON.Vec3(15, 3, 0)); f.world.addBody(compound);
  const reading = f.sensor.sample('ada', f.target);
  assert.equal(reading.targetClear, false); assert.equal(reading.clearance.length, 32);
  assert(Math.abs(reading.clearance[0] - 10.5 / 64) < 1e-8);
});

test('sensing includes private physical blockers but excludes self, target, floor and noncolliding or elevated boxes', t => {
  const f = fixture(t), targetBody = f.box(f.target.position, [3, 3, 3]); f.bodies.set('person', targetBody);
  f.box([10, 15, 0], [2, 2, 2]); f.box([10, -2, 0], [10, 2, 10]);
  f.box([10, 3, 0], [2, 3, 3], { collisionResponse: false });
  f.box([10, 3, 0], [2, 3, 3], { collisionFilterGroup: 0 });
  assert.equal(f.sensor.sample('ada', f.target).targetClear, true);
  const secret = f.box([10, 3, 0], [3, 3, 3]);
  f.entries.set('private', { body: secret, descriptor: { local: true, shared: false, name: 'Private identity' } });
  const sample = f.sensor.sample('ada', f.target);
  assert.equal(sample.targetClear, false); assert.equal(JSON.stringify(sample).includes('Private identity'), false);
  assert.equal('obstacles' in sample, false, 'only fixed-size sensors leave the geometry adapter');
});

test('full body clearance rejects narrow openings and sensing retains all bounded colliders', t => {
  const f = fixture(t), left = f.box([12, 3, -8], [2, 3, 5]), right = f.box([12, 3, 8], [2, 3, 5]);
  assert.equal(f.sensor.sample('ada', f.target).targetClear, false, '6-unit doorway does not fit a 6-unit cube with margin');
  left.position.z = -10; right.position.z = 10;
  assert.equal(f.sensor.sample('ada', f.target).targetClear, true);
  f.world.removeBody(left); f.world.removeBody(right);
  for (let i = 0; i < 70; i++) f.box([10, 3, 25 + i * .1], [.1, 3, .1]);
  f.box([20, 3, 0], [1, 3, 4]);
  assert.equal(f.sensor.sample('ada', f.target).targetClear, false);
});

test('close target behind a wall cannot report arrival and geometry reaches managed inference', async t => {
  const f = fixture(t); f.target.position = [9, 3, 0]; f.box([4.5, 3, 0], [.5, 3, 10]);
  f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id }); await f.tick(12);
  assert.equal(f.events.some(event => event.status === 'arrived'), false);
  assert.equal(f.calls.at(-1)[0].observation.targetClear, false);
  assert.equal(f.calls.at(-1)[0].observation.clearance.length, 32);
  assert.deepEqual(f.calls.at(-1)[0].observation.previousAcceleration, [2, 0]);
  assert.equal(f.motor.getResidentStatus('ada').status, 'detouring');
});

test('sideways and backward detours retain progress while a truly stationary body stops with a bounded explanation', async t => {
  const f = fixture(t); f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id });
  for (let i = 0; i < 1200; i++) {
    f.body.position.z += .05; f.body.position.x -= .01;
    await f.tick(1);
  }
  assert.equal(f.events.some(event => event.status === 'blocked'), false);
  assert(f.motor.getResidentStatus('ada').progress.distanceTravelled > 60);
  await f.tick(1000);
  assert.equal(f.motor.getResidentStatus('ada').status, 'blocked');
  assert.match(f.motor.getResidentStatus('ada').blockedReason, /No new ground/);
  assert.deepEqual([f.body.velocity.x, f.body.velocity.z, f.body.force.x, f.body.force.z], [0, 0, 0, 0]);
  assert.equal(f.events.filter(event => event.status === 'blocked').length, 1);
});

test('stop, pause, clear, service replacement and disposal halt synchronously without accepting old actions', async t => {
  for (const operation of ['stop', 'pause', 'clear', 'service', 'dispose']) {
    const f = fixture(t); let release, signal;
    f.motor.setService({ infer: (batch, options) => {
      signal = options.signal;
      return new Promise(resolve => { release = () => resolve({ results: batch.map(({ id }) => ({ id, acceleration: [12, 12] })) }); });
    } });
    f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id });
    for (let i = 0; i < 6; i++) f.motor.beforeStep(); await Promise.resolve();
    const pending = f.motor.pending;
    f.body.velocity.set(3, 0, 4); f.body.force.set(5, 0, 6);
    if (operation === 'stop') f.motor.setIntent('ada', { type: 'stop' });
    if (operation === 'pause') { f.entry.descriptor.status = 'paused'; f.motor.suspend('ada'); }
    if (operation === 'clear') f.motor.clear('ada');
    if (operation === 'service') f.motor.setService(null);
    if (operation === 'dispose') f.motor.dispose();
    assert.deepEqual([f.body.velocity.x, f.body.velocity.z, f.body.force.x, f.body.force.z], [0, 0, 0, 0], operation);
    assert.equal(signal.aborted, true, operation); assert.equal(f.motor.pending, pending, 'in-flight cleanup retains ownership');
    release(); await pending.done;
    assert.equal(f.motor.commands.size, 0, operation);
  }
});

test('target loss invalidates pending output; owner snapshots exclude remote bodies and do not invent GPU proof', async t => {
  const f = fixture(t); let release;
  f.motor.setService({ infer: batch => new Promise(resolve => { release = () => resolve({ backend: 'webgpu', worker: true,
    policyId: 'stale-policy', results: batch.map(({ id }) => ({ id, acceleration: [12, 0] })) }); }) });
  f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id });
  for (let i = 0; i < 6; i++) f.motor.beforeStep(); await Promise.resolve();
  const pending = f.motor.pending; f.loseTarget(); f.motor.beforeStep(); release(); await pending.done;
  const status = f.motor.getResidentStatus('ada'); assert.equal(status.status, 'target-lost'); assert.equal(status.backend, null);
  assert.equal(status.worker, false); assert.equal(f.motor.commands.size, 0);
  f.entries.set('remote', { descriptor: { local: false } });
  assert.equal(f.motor.getResidentStatus('remote'), null); assert.equal(f.motor.getStatus().residents.length, 1);
  assert.equal('clearance' in status, false);
});

test('unchanged-target control has a finite attempt budget even while continuously traversing new ground', async t => {
  const f = fixture(t); f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id });
  for (let i = 0; i < 7300; i++) { f.body.position.z += .05; await f.tick(1); }
  assert.equal(f.motor.getResidentStatus('ada').status, 'blocked');
  assert.match(f.motor.getResidentStatus('ada').blockedReason, /120 seconds/);
  assert(f.motor.getResidentStatus('ada').progress.distanceTravelled > 350);
});

test('approach requires low absolute speed; follow may settle alongside a moving target', async t => {
  const f = fixture(t); f.target.position = [9, 3, 0]; f.target.velocity = [2, 0, 0];
  f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id }); f.body.velocity.x = 2;
  await f.tick(1); assert.equal(f.events.some(event => event.status === 'arrived'), false);
  f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id }); f.body.velocity.x = 2;
  await f.tick(1); assert.equal(f.events.at(-1).status, 'arrived');
});

test('local geometry overflow fails visibly and target identity resolves to physics rather than visual terrain', async t => {
  const f = fixture(t); f.target.position = [100, 900, 100];
  const target = f.box([20, 3, 0], [3, 3, 3]); f.bodies.set('person', target);
  assert.deepEqual(f.sensor.sample('ada', f.target).relativePosition, [20, 0]);
  for (let i = 0; i < 257; i++) f.box([15, 3, 10 + i * .01], [.1, 3, .1]);
  f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id }); await f.tick(1);
  assert.equal(f.motor.getResidentStatus('ada').status, 'failed');
  assert.match(f.motor.getResidentStatus('ada').blockedReason, /collider limit/);
  assert.equal(f.calls.length, 0);
});

test('cancellation before dispatch never invokes the managed policy', async t => {
  const f = fixture(t); f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id });
  for (let i = 0; i < 6; i++) f.motor.beforeStep();
  const pending = f.motor.pending; f.motor.setIntent('ada', { type: 'stop' }); await pending.done;
  assert.equal(f.calls.length, 0); assert.equal(f.motor.commands.size, 0);
});

test('arrival cancels a previously dispatched action and discards its late result', async t => {
  const f = fixture(t); let release, signal;
  f.motor.setService({ infer: (batch, options) => {
    signal = options.signal;
    return new Promise(resolve => { release = () => resolve({ results: batch.map(({ id }) => ({ id, acceleration: [12, 0] })) }); });
  } });
  f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id });
  for (let i = 0; i < 6; i++) f.motor.beforeStep(); await Promise.resolve();
  const pending = f.motor.pending; f.target.position = [9, 3, 0]; f.motor.beforeStep();
  assert.equal(f.events.at(-1).status, 'arrived'); assert.equal(signal.aborted, true);
  release(); await pending.done; assert.equal(f.motor.commands.size, 0);
});

test('real Cannon collision contains an unhelpful managed action and reports blockage instead of moving through a wall', async t => {
  const f = fixture(t); f.box([12, 3, 0], [1, 3, 25]);
  f.motor.setService({ infer: async batch => ({ backend: 'fixture', worker: false,
    results: batch.map(({ id }) => ({ id, acceleration: [12, 0] })) }) });
  f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id });
  const before = () => {
    const speed = Math.hypot(f.body.velocity.x, f.body.velocity.z);
    if (speed > D.maxSpeed) { f.body.velocity.x *= D.maxSpeed / speed; f.body.velocity.z *= D.maxSpeed / speed; }
    f.motor.beforeStep();
  };
  f.world.addEventListener('preStep', before); t.after(() => f.world.removeEventListener('preStep', before));
  for (let i = 0; i < 1300; i++) { f.world.step(D.fixedDt); if (f.motor.pending) await f.motor.pending.done; }
  assert(f.body.position.x > 7 && f.body.position.x < 8.05);
  assert.equal(f.motor.getResidentStatus('ada').status, 'blocked');
  assert.equal(f.events.some(event => event.status === 'arrived'), false);
});

test('navigation sensing follows control cadence and invalidates for new intentions, service and geometry', async t => {
  const f = fixture(t), sample = f.sensor.sample.bind(f.sensor); let reads = 0;
  f.sensor.sample = (...args) => { reads++; return sample(...args); };
  f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id }); await f.tick(60);
  assert.equal(reads, 11, 'one initial sample, then10 control samples per simulated second');
  f.motor.invalidateNavigation(); await f.tick(1); assert.equal(reads, 12);
  f.motor.setIntent('ada', { type: 'follow', targetId: f.target.id }); await f.tick(1); assert.equal(reads, 13);
  f.motor.setService(f.motor.service); await f.tick(1); assert.equal(reads, 14);
});

test('arrival rechecks visibility between scheduled controls and stale commands report loading', async t => {
  const f = fixture(t); f.motor.setIntent('ada', { type: 'approach', targetId: f.target.id }); await f.tick(6);
  assert.equal(f.motor.getResidentStatus('ada').status, 'moving');
  f.advanceClock(1000); assert.equal(f.motor.getResidentStatus('ada').status, 'loading');
  f.target.position = [9, 3, 0]; const wall = f.box([4.5, 3, 0], [.5, 3, 10]);
  await f.tick(1); assert.equal(f.events.some(event => event.status === 'arrived'), false);
  f.world.removeBody(wall); f.motor.invalidateNavigation(); await f.tick(1);
  assert.equal(f.events.at(-1).status, 'arrived');
});
