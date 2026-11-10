import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { createCubeSpatialTargets } from '../cubechat/src/agents/CubeSpatialTargets.js';
import { createCubeNavigationSensors } from '../cubechat/src/agents/CubeNavigationSensors.js';
import { createWorldExperience } from '../shared/agents/WorldExperience.js';

function fixture() {
  const world = new CANNON.World(), entries = new Map(), physics = { world };
  const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() }); floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(floor);
  const body = new CANNON.Body({ mass: 5, position: new CANNON.Vec3(0, 3, 0), shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)) }); world.addBody(body);
  entries.set('ada', { body, descriptor: { local: true, agentId: 'ada', ownerPeerId: 'owner' } });
  const sensors = createCubeNavigationSensors({ physics, getEntries: () => entries });
  const spatial = createCubeSpatialTargets({ physics, sensors, getEntries: () => entries,
    getBounds: () => ({ min: [-120, -120], max: [120, 120] }), groundHeight: (x, z) => (x + z) / 10 });
  const obstacle = (position, half = [3, 3, 3]) => {
    const box = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(...position), shape: new CANNON.Box(new CANNON.Vec3(...half)) }); world.addBody(box); return box;
  };
  return { world, entries, body, floor, sensors, spatial, obstacle };
}

test('candidate perception samples real clear ground while keeping decorative height separate from physics', () => {
  const f = fixture(), before = f.body.position.toArray(), observed = f.spatial.describe('ada');
  assert.equal(observed.locations.length, 12); assert.equal(observed.spatial.frame, 'planar-xz');
  assert(observed.locations.some(item => item.distance === 32)); assert(observed.locations.some(item => item.distance === 96));
  assert.deepEqual(f.body.position.toArray(), before, 'perception never moves the body');
  const target = observed.locations.find(item => item.position[0] === 96 && item.position[2] === 0);
  assert.equal(target.position[1], 12.6);
  f.obstacle([96, 3, 0]);
  assert.equal(f.spatial.describe('ada').locations.some(item => item.id === target.id), false);
  assert.throws(() => f.spatial.validate('ada', target.position), /occupied/);
});

test('point admission rejects footprint overlap, absent ground, floor edge, range, malformed points and remote authority', () => {
  const f = fixture(); f.obstacle([40, 3, 0]);
  assert.throws(() => f.spatial.validate('ada', [34, 3, 0]), /occupied/);
  assert.throws(() => f.spatial.validate('ada', [121, 3, 0]), /outside/);
  assert.throws(() => f.spatial.validate('ada', [120, 3, 120]), /range/);
  for (const invalid of [[NaN, 3, 0], [1, , 3], Object.assign([1, 3, 0], { metadata: true })]) assert.throws(() => f.spatial.validate('ada', invalid));
  f.entries.get('ada').descriptor.local = false;
  assert.throws(() => f.spatial.validate('ada', [20, 3, 0]), /owner/);
  f.entries.get('ada').descriptor.local = true;
  f.world.removeBody(f.floor);
  assert.deepEqual(f.spatial.describe('ada'), {});
  assert.throws(() => f.spatial.validate('ada', [20, 3, 0]), /walking surface/);
});

test('saved return anchors remain valid after candidate regeneration; current blockers still reject them', () => {
  const f = fixture(), origin = [0, 3, 0]; f.body.position.x = 80;
  assert.equal(f.spatial.describe('ada').locations.some(item => item.position[0] === origin[0] && item.position[2] === origin[2]), false);
  assert.deepEqual(f.spatial.validate('ada', origin), origin);
  const wall = f.obstacle([40, 3, 0], [1, 3, 20]);
  assert.deepEqual(f.spatial.validate('ada', origin), origin, 'an obstructed path can be attempted by the neural motor');
  assert.equal(f.sensors.sample('ada', { kind: 'location', position: origin }).targetClear, false);
  f.world.removeBody(wall); f.obstacle([0, 3, 0]);
  assert.throws(() => f.spatial.validate('ada', origin), /occupied/);
});

test('private and rotated compound blockers constrain destinations without exposing their identity', () => {
  const f = fixture(), compound = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 3, 0) });
  compound.addShape(new CANNON.Box(new CANNON.Vec3(1, 3, 10)), new CANNON.Vec3(30, 0, 0));
  compound.quaternion.setFromEuler(0, Math.PI / 4, 0); f.world.addBody(compound);
  f.entries.set('secret', { body: compound, descriptor: { local: true, shared: false, name: 'Secret identity', agentId: 'private' } });
  assert.throws(() => f.spatial.validate('ada', [21.2, 3, -21.2]), /occupied/);
  assert.doesNotMatch(JSON.stringify(f.spatial.describe('ada')), /Secret identity|private/);
});

test('bounded crowded observations retain the requester, self, and all twelve real sampled destinations', async () => {
  const f = fixture(), candidates = f.spatial.describe('ada');
  const participants = Array.from({ length: 24 }, (_, index) => ({ id: `human:${index}:${'p'.repeat(128)}`,
    peerId: `${index}:${'p'.repeat(128)}`, kind: 'human', name: 'Name '.repeat(20), position: [index + 10, 3, 0],
    relativePosition: [index + 10, 0, 0], velocity: [0, 0, 0], distance: index + 10 }));
  const raw = { observedAt: 1, self: { id: 'resident:owner:ada', name: 'Ada', position: [0, 3, 0], intentRevision: 2 },
    ...candidates, participants, requesterId: participants.at(-1).id, obstacles: Array.from({ length: 12 }, (_, i) => ({ position: [i, 3, 0], radius: 3 })) };
  const original = structuredClone(raw), experience = createWorldExperience({ worldId: 'cube:test', getBody: () => ({ local: true }),
    adapter: { observe: () => raw, setIntent: () => {}, subscribeOutcomes: () => () => {} } });
  const observed = experience.observe('ada');
  assert.deepEqual(observed.self, raw.self); assert.deepEqual(observed.spatial, candidates.spatial);
  assert.deepEqual(observed.locations, candidates.locations);
  assert.equal(observed.requesterId, participants.at(-1).id);
  assert(observed.participants.some(person => person.id === observed.requesterId));
  assert(new TextEncoder().encode(JSON.stringify(observed)).length <= 4608);
  assert.deepEqual(raw, original); await experience.dispose();
});
