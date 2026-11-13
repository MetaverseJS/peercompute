import test from 'node:test';
import assert from 'node:assert/strict';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { createWorldGeneratedObjects } from '../shared/agents/WorldGeneratedObjects.js';
import { CubeGeneratedObjectLayer } from '../cubechat/src/renderer/CubeGeneratedObjectLayer.js';
import { createCubeSpatialTargets } from '../cubechat/src/agents/CubeSpatialTargets.js';
import { createCubeNavigationSensors } from '../cubechat/src/agents/CubeNavigationSensors.js';
import { action, worldId, meshFixture, imageFixture, until } from './world-generated-fixtures.js';

// Real physics, GLTF decoding/presentation, artifact bytes and durable object
// heads. Only inference output is simulated; no GPU/model-quality claim.
async function fixture(t) {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const world = new CANNON.World(), physics = { world };
  const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(floor);
  const body = new CANNON.Body({ mass: 5, position: new CANNON.Vec3(0, 3, 0),
    shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)) }); world.addBody(body);
  const entries = new Map([['agent', { body, descriptor: { local: true, agentId: 'agent' } }]]);
  const spatial = createCubeSpatialTargets({ physics, getEntries: () => entries,
    sensors: createCubeNavigationSensors({ physics, getEntries: () => entries }),
    getBounds: () => ({ min: [-120, -120], max: [120, 120] }), groundHeight: () => 0 });
  const makeLayer = () => new CubeGeneratedObjectLayer({ scene: { scene: new THREE.Scene(), gridSize: 240 }, physics,
    getResidentPosition: () => body.position.toArray(), resolvePlacement: (...args) => spatial.placement(...args) });
  let layer = makeLayer();
  const state = { calls: 0, output: async () => ({ mesh: meshFixture() }) };
  const agents = { get: async () => ({ agentId: 'agent', revision: 1, status: 'active',
    policy: { inferenceMode: 'local-only' }, embodiments: [{ worldId }] }),
  inference: {
    listCandidates: async () => [{ key: 'local:mesh', manifestCid: 'mesh', runtime: 'onnx-mesh', available: true,
      local: true, task: 'image-to-3d', modalities: ['image'], outputModalities: ['mesh'] }],
    generate: async () => { state.calls++; return state.output(); },
  } };
  const managers = [], runtime = { store, artifactReady: false, inspectPeerPackage: cid => store.getManifest(cid), ensure: async () => {} };
  const create = async () => {
    if (layer.closed) layer = makeLayer();
    const manager = createWorldGeneratedObjects({ runtime, agents, adapter: layer, worldId, ownerHostId: 'host', isOwner: () => true });
    managers.push(manager); await manager.ready; return manager;
  };
  const manager = await create();
  const block = (position, halfSize = [3, 3, 3]) => {
    const obstacle = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(...position),
      shape: new CANNON.Box(new CANNON.Vec3(...halfSize)) }); world.addBody(obstacle); return obstacle;
  };
  const input = requestId => ({ agentId: 'agent', action, requestId, image: imageFixture(),
    placementTarget: { kind: 'location', id: 'ground:40:0', position: [40, 3, 0], observedAt: 100 } });
  t.after(async () => { for (const manager of managers) await manager.dispose(); layer.dispose(); await store.destroy(); });
  return { store, world, body, spatial, get layer() { return layer; }, state, manager, create, block, input };
}

test('new generated objects find the nearest clear footprint around an existing rendered object', async t => {
  const f = await fixture(t), first = await f.manager.generate(f.input('first'));
  assert.deepEqual(first.placement.position, [40, 0, 0]);
  const secondInput = f.input('second'), second = await f.manager.generate(secondInput);
  assert.equal(second.status, 'placed'); assert.equal(f.layer.entries.size, 2); assert.equal(f.state.calls, 2);
  const position = second.placement.position;
  assert(Math.abs(Math.hypot(position[0] - 40, position[2]) - 6.5) < .001,
    `expected nearest 6.5-unit clearance, got ${position}`);
  const firstBounds = new THREE.Box3().setFromObject(f.layer.entries.get('local:first').group);
  assert.deepEqual(f.spatial.validatePlacement('agent', position, action.size,
    { obstacles: [{ min: firstBounds.min.toArray(), max: firstBounds.max.toArray() }] }), position);
  assert.deepEqual((await f.store.getManifest(second.artifactCid)).provenance.worldObject.position, position);
  assert.deepEqual(f.layer.entries.get('local:second').descriptor.placement.position, position);
  assert.equal((await f.store.stat(second.artifactCid)).pinned, true);
  await f.manager.dispose(); const restored = await f.create(); await until(() => f.layer.entries.size === 2);
  assert.deepEqual(restored.list().find(value => value.placement.objectId === 'second').placement.position, position);
  assert.equal((await restored.generate(secondInput)).artifactCid, second.artifactCid);
  assert.equal(f.state.calls, 2, 'reopening/replaying keeps the retained placement without another generation');
});

test('moving blockers during inference and persistence relocate the same mesh before committing its final position', async t => {
  const f = await fixture(t), input = f.input('late-blockers'); let interim;
  f.state.output = async () => { f.block([40, 3, 0]); return { mesh: meshFixture() }; };
  const importFile = f.store.importFile.bind(f.store);
  f.store.importFile = async (...args) => {
    const record = await importFile(...args);
    interim = f.layer.getPlacement('agent', action.size, input.placementTarget);
    f.block([interim[0], 3, interim[2]]);
    return record;
  };
  const result = await f.manager.generate(input), position = result.placement.position;
  assert.equal(result.status, 'placed'); assert.notDeepEqual(position, [40, 0, 0]); assert.notDeepEqual(position, interim);
  assert.deepEqual(f.spatial.validatePlacement('agent', position, action.size), position);
  assert.deepEqual((await f.store.getManifest(result.artifactCid)).provenance.worldObject, result.placement);
  assert.deepEqual(f.layer.entries.get('local:late-blockers').descriptor.placement, result.placement);
  assert.equal(f.state.calls, 1, 'late placement changes do not repeat model work');
  await f.manager.dispose();
  const restored = await f.create(); await until(() => f.layer.entries.size === 1);
  assert.deepEqual(restored.list()[0].placement, result.placement);
  assert.deepEqual(f.layer.entries.get('local:late-blockers').descriptor.placement.position, position);
  assert.equal(f.state.calls, 1);
});

for (const phase of ['before inference', 'during storage']) {
  test(`a completely blocked world ${phase} fails without a retained or visible object`, async t => {
    const f = await fixture(t), fillWorld = () => f.block([0, 3, 0], [120, 3, 120]);
    if (phase === 'before inference') fillWorld();
    else {
      const importFile = f.store.importFile.bind(f.store);
      f.store.importFile = async (...args) => { const record = await importFile(...args); fillWorld(); return record; };
    }
    await assert.rejects(f.manager.generate(f.input('no-space')), /footprint|space|blocked|clear|obstructed/i);
    assert.equal(f.state.calls, phase === 'before inference' ? 0 : 1);
    assert.equal(f.layer.entries.size, 0); assert.equal(f.manager.list().length, 0);
    for await (const record of f.store.list()) assert.equal(record.pinned, false);
  });
}
