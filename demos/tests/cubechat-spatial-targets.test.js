import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import { createCubeSpatialTargets } from '../cubechat/src/agents/CubeSpatialTargets.js';
import { createCubeNavigationSensors } from '../cubechat/src/agents/CubeNavigationSensors.js';
import { createWorldExperience } from '../shared/agents/WorldExperience.js';

function fixture() {
  const world = new CANNON.World(), entries = new Map(), physics = { world }, participants = [];
  const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() }); floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(floor);
  const body = new CANNON.Body({ mass: 5, position: new CANNON.Vec3(0, 3, 0), shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)) }); world.addBody(body);
  entries.set('ada', { body, descriptor: { local: true, agentId: 'ada', ownerPeerId: 'owner' } });
  const sensors = createCubeNavigationSensors({ physics, getEntries: () => entries });
  const spatial = createCubeSpatialTargets({ physics, sensors, getEntries: () => entries,
    getBounds: () => ({ min: [-120, -120], max: [120, 120] }), groundHeight: (x, z) => (x + z) / 10,
    getParticipants: () => participants.map(person => ({ ...person, position: person.body.position.toArray() })) });
  const obstacle = (position, half = [3, 3, 3]) => {
    const box = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(...position), shape: new CANNON.Box(new CANNON.Vec3(...half)) }); world.addBody(box); return box;
  };
  return { world, entries, body, floor, sensors, spatial, obstacle, participants };
}
const locationTarget = (position, extra = {}) => ({ kind: 'location', id: 'observed-ground', position, observedAt: 100, ...extra });

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

test('object placement retains clear observed or remembered ground and moves to nearest space when occupied', () => {
  const f = fixture(), observed = f.spatial.describe('ada');
  const distant = observed.locations.find(item => item.distance === 96 && item.position[2] === 0);
  assert.deepEqual(f.spatial.placement('ada', 6), [9, 0, 0]);
  assert.deepEqual(f.spatial.placement('ada', 24, locationTarget(distant.position, { id: distant.id })), [96, 0, 0],
    'authoritative planar floor replaces decorative scene height');
  f.body.position.x = 80;
  const saved = locationTarget([0, 3, 0], { id: 'saved-meeting', knowledgeId: 'meeting', knowledgeRevision: 2 });
  assert.deepEqual(f.spatial.placement('ada', 12, saved), [0, 0, 0]);
  f.obstacle([0, 3, 0]);
  const relocated = f.spatial.placement('ada', 12, saved);
  assert(Math.abs(Math.hypot(relocated[0], relocated[2]) - 9.5001) < 1e-6);
  assert.deepEqual(f.spatial.validatePlacement('ada', relocated, 12), relocated);
  assert.deepEqual(saved.position, [0, 3, 0], 'the remembered anchor is not rewritten');
});

test('object footprint checks the whole fitted envelope against bounds and geometry beyond resident clearance', () => {
  const f = fixture(), target = locationTarget([32, 3, 0]);
  const beside = f.obstacle([42, 3, 0]);
  assert.deepEqual(f.spatial.validate('ada', target.position), target.position, 'six-unit resident center is clear');
  assert.throws(() => f.spatial.validatePlacement('ada', target.position, 24), /footprint.*occupied/);
  f.world.removeBody(beside);
  const overhang = f.obstacle([32, 20, 0], [2, 1, 2]);
  assert.deepEqual(f.spatial.placement('ada', 6, target), [32, 0, 0]);
  assert.throws(() => f.spatial.validatePlacement('ada', target.position, 24), /footprint.*occupied/);
  f.world.removeBody(overhang);
  const sphere = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(32, 3, 0), shape: new CANNON.Sphere(2) });
  f.world.addBody(sphere);
  assert.throws(() => f.spatial.validatePlacement('ada', target.position, 6), /footprint.*occupied/);
  f.world.removeBody(sphere);
  assert.throws(() => f.spatial.validatePlacement('ada', [112, 3, 0], 48), /footprint.*outside/);
  assert.deepEqual(f.spatial.placement('ada', 48, locationTarget([112, 3, 0])), [96, 0, 0]);
  assert.throws(() => f.spatial.placement('ada', 6, locationTarget([121, 3, 0])), /outside/);
  assert.throws(() => f.spatial.placement('ada', 6, locationTarget([120, 3, 120])), /range/);
  assert.throws(() => f.spatial.validatePlacement('ada', [0, 3, 0], 6), /footprint.*occupied/,
    'the resident is an obstruction even though its navigation sensor excludes self');
});

test('participant placements track the same current body and choose nearby clearance without replacing its identity', () => {
  const f = fixture(), human = f.obstacle([30, 3, 0]);
  f.participants.push({ id: 'human:owner', kind: 'human', peerId: 'owner', name: 'Owner', body: human });
  const target = { kind: 'participant', id: 'human:owner', observedAt: 100 };
  assert.deepEqual(f.spatial.placement('ada', 6, target), [39, 0, 0]);
  human.position.set(60, 3, 0);
  assert.deepEqual(f.spatial.placement('ada', 6, target), [69, 0, 0], 'post-generation resolution uses the moved participant');
  const blocker = f.obstacle([69, 3, 0]);
  const relocated = f.spatial.placement('ada', 6, target);
  assert.deepEqual(f.spatial.validatePlacement('ada', relocated, 6), relocated);
  assert(Math.abs(Math.hypot(relocated[0] - 69, relocated[2]) - 6.5001) < 1e-6);
  f.world.removeBody(blocker); human.position.set(119, 3, 0);
  const inward = f.spatial.placement('ada', 6, target);
  assert.equal(inward[0], 117); assert(Math.abs(inward[2] + 6.5001) < 1e-6, 'participant offset moves inward at the floor edge');
  human.position.set(121, 3, 0);
  assert.throws(() => f.spatial.placement('ada', 6, target), /outside/, 'the source participant must still be on the authorized surface');
  f.participants.length = 0;
  assert.throws(() => f.spatial.placement('ada', 6, target), /no longer observed/);
  f.participants.push({ id: 'human:imposter', kind: 'human', name: 'Owner', body: human });
  assert.throws(() => f.spatial.placement('ada', 6, target), /no longer observed/, 'a matching name does not replace identity');
});

test('placed mesh bounds, supported floor and owner authority constrain placement before generation', () => {
  const f = fixture(), target = locationTarget([32, 3, 0]);
  assert.throws(() => f.spatial.validatePlacement('ada', target.position, 12, {
    obstacles: [{ min: [36, 0, -2], max: [44, 10, 2] }]
  }), /overlaps a placed object/);
  assert.deepEqual(f.spatial.placement('ada', 6, target, {
    obstacles: [{ min: [40, 0, -2], max: [44, 10, 2] }]
  }), [32, 0, 0]);
  f.entries.get('ada').descriptor.local = false;
  assert.throws(() => f.spatial.placement('ada', 6, target), /owner/);
  f.entries.get('ada').descriptor.local = true; f.world.removeBody(f.floor);
  assert.throws(() => f.spatial.placement('ada', 6, target), /supported planar/);
});

test('building sizes exceed avatar limits only when the real footprint fits, with no silent resize clamp', () => {
  const f = fixture();
  assert.deepEqual(f.spatial.placement('ada', 96, locationTarget([60, 3, 0])), [60, 0, 0]);
  assert.throws(() => f.spatial.placement('ada', 960, locationTarget([60, 3, 0])), /footprint.*outside/);
  assert.throws(() => f.spatial.placement('ada', 1024.1, locationTarget([60, 3, 0])), /1024/);
  const obstacle = f.obstacle([105, 5, 0]);
  assert.throws(() => f.spatial.validatePlacement('ada', [60, 3, 0], 96), /footprint.*occupied/);
  f.world.removeBody(obstacle);
  assert.deepEqual(f.spatial.placement('ada', 96, locationTarget([60, 3, 0])), [60, 0, 0]);
});

test('existing-object transforms may be remote while retaining support, bounds and every physical clearance check', () => {
  const f = fixture(), spatial = createCubeSpatialTargets({ physics: { world: f.world }, sensors: f.sensors,
    getEntries: () => f.entries, getBounds: () => ({ min: [-1000, -1000], max: [1000, 1000] }), groundHeight: () => 0 });
  const target = locationTarget([700, 0, 0]);
  assert.throws(() => spatial.placement('ada', 400, target), /range/);
  assert.deepEqual(spatial.placement('ada', 400, target, { transformExisting: true }), [700, 0, 0]);
  const blocker = f.obstacle([850, 3, 0]);
  assert.throws(() => spatial.placement('ada', 400, target, { transformExisting: true }), /footprint.*occupied/);
  f.world.removeBody(blocker);
  assert.throws(() => spatial.placement('ada', 960, target, { transformExisting: true }), /footprint.*outside/);
  assert.throws(() => spatial.placement('ada', 400, locationTarget([100, 0, 0]), { transformExisting: true }), /footprint.*occupied/,
    'the requesting resident remains an obstruction');
  f.world.removeBody(f.floor);
  assert.throws(() => spatial.placement('ada', 400, target, { transformExisting: true }), /supported planar/);
});

test('nearest placement covers spheres, overhead navigation clearance, and the requesting resident', () => {
  const f = fixture(), target = locationTarget([32, 3, 0]);
  const sphere = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(32, 3, 0), shape: new CANNON.Sphere(2) });
  f.world.addBody(sphere);
  let point = f.spatial.placement('ada', 6, target);
  assert(Math.abs(Math.hypot(point[0] - 32, point[2]) - 5.5001) < 1e-6);
  f.world.removeBody(sphere);
  const overhead = f.obstacle([32, 4, 0], [3, 1, 3]);
  point = f.spatial.placement('ada', 1, target);
  assert(Math.abs(Math.hypot(point[0] - 32, point[2]) - 6.5001) < 1e-6, 'small prop still requires the navigation destination to be clear');
  assert.deepEqual(f.spatial.validatePlacement('ada', point, 1), point);
  f.world.removeBody(overhead);
  point = f.spatial.placement('ada', .3, locationTarget([0, 3, 0]));
  assert(Math.abs(Math.hypot(point[0], point[2]) - 3.6501) < 1e-6, 'self uses the object envelope, not an extra navigation body');
});

test('plane strips constrain the nearest location and a low ceiling can rule out the entire search', () => {
  const f = fixture(), wall = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(40, 0, 0), shape: new CANNON.Plane() });
  wall.quaternion.setFromEuler(0, Math.PI / 2, 0); f.world.addBody(wall);
  const point = f.spatial.placement('ada', 6, locationTarget([40, 3, 0]));
  assert(Math.abs(point[0] - 36.4999) < 1e-6); assert(Math.abs(point[2]) < 1e-6);
  assert.deepEqual(f.spatial.validatePlacement('ada', point, 6), point);
  f.world.removeBody(wall);
  const ceiling = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 12, 0), shape: new CANNON.Plane() });
  ceiling.quaternion.setFromEuler(Math.PI / 2, 0, 0); f.world.addBody(ceiling);
  assert.deepEqual(f.spatial.placement('ada', 6, locationTarget([40, 3, 0])), [40, 0, 0]);
  assert.throws(() => f.spatial.placement('ada', 24, locationTarget([40, 3, 0])), /No clear placement/);
});

test('nearest location considers intersecting placed meshes and searches inside the footprint-adjusted surface', () => {
  const f = fixture(), target = locationTarget([32, 3, 0]);
  const obstacles = [{ min: [30, 0, -8], max: [34, 12, 8] }, { min: [20, 0, -8], max: [27, 12, 8] }];
  const point = f.spatial.placement('ada', 6, target, { obstacles });
  assert(Math.abs(point[0] - 37.5001) < 1e-6); assert.equal(point[2], 0);
  assert.deepEqual(f.spatial.validatePlacement('ada', point, 6, { obstacles }), point);
  assert.throws(() => f.spatial.placement('ada', 6, target, {
    obstacles: [{ min: [-200, 0, -200], max: [200, 30, 200] }]
  }), /No clear placement/);
});

test('search preserves masks and authority and never masks malformed geometry or an oversized footprint', () => {
  const f = fixture(), target = locationTarget([32, 3, 0]), ignored = f.obstacle([32, 3, 0]);
  ignored.collisionResponse = false;
  assert.deepEqual(f.spatial.placement('ada', 6, target), [32, 0, 0]);
  ignored.collisionResponse = true; ignored.collisionFilterMask = 0;
  assert.deepEqual(f.spatial.placement('ada', 6, target), [32, 0, 0]);
  assert.throws(() => f.spatial.placement('ada', 6, locationTarget([121, 3, 0])), /outside/);
  assert.throws(() => f.spatial.placement('ada', 6, locationTarget([120, 3, 120])), /range/);
  assert.throws(() => f.spatial.placement('ada', 6, target, { obstacles: [{ min: [40, 0, 0], max: [20, 3, 4] }] }), /geometry/);
  assert.throws(() => f.spatial.placement('ada', 241, target), /footprint.*outside/);
  f.entries.get('ada').descriptor.local = false;
  assert.throws(() => f.spatial.placement('ada', 6, target), /owner/);
});

test('an exactly fitting model has only one allowed center and cannot escape that point', () => {
  const f = fixture(); f.body.shapes[0].collisionResponse = false;
  assert.deepEqual(f.spatial.placement('ada', 240, locationTarget([20, 3, 30])), [0, 0, 0]);
  f.body.shapes[0].collisionResponse = true;
  assert.throws(() => f.spatial.placement('ada', 240, locationTarget([20, 3, 30])), /No clear placement/);
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
