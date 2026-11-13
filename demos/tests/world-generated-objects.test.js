import test from 'node:test';
import assert from 'node:assert/strict';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { createWorldGeneratedObjects } from '../shared/agents/WorldGeneratedObjects.js';
import { action, worldId, meshFixture, imageFixture, sceneAdapter, deferred, tick, until } from './world-generated-fixtures.js';

async function fixture(t) {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const adapter = sceneAdapter(), calls = [], states = [], controllers = [];
  const head = { agentId: 'agent', revision: 3, status: 'active', policy: { inferenceMode: 'local-only' }, embodiments: [{ worldId }] };
  const state = { owns: true, candidates: ['text-to-image', 'image-to-3d'].map(task => ({ key: `local:${task}`, manifestCid: task,
    runtime: task === 'text-to-image' ? 'onnx-diffusion' : 'onnx-mesh', available: true, local: true, task,
    modalities: task === 'text-to-image' ? ['text'] : ['image'], outputModalities: task === 'text-to-image' ? ['image'] : ['mesh'] })),
  output: async input => input.task === 'text-to-image' ? { text: '', image: imageFixture() } : { text: '', mesh: meshFixture() } };
  const agents = { get: async () => structuredClone(head), inference: { listCandidates: async () => state.candidates,
    generate: async (candidate, input, options) => { calls.push({ candidate, input, options }); return state.output(input, options); } } };
  const runtime = { store, artifactReady: false, inspectPeerPackage: cid => store.getManifest(cid), ensure: async () => {} };
  const create = (options = {}) => { const manager = createWorldGeneratedObjects({ runtime, agents, adapter, worldId, ownerHostId: 'host',
    isOwner: () => state.owns, onStatus: event => states.push(event), ...options }); controllers.push(manager); return manager; };
  const manager = create(); await manager.ready;
  t.after(async () => { for (const item of controllers) await item.dispose(); await store.destroy(); });
  return { manager, create, runtime, agents, store, adapter, head, state, calls, states };
}
test('managed text-image-mesh chain commits one retained object, actual placement receipt, and restores without generating again', async t => {
  const f = await fixture(t), result = await f.manager.generate({ agentId: 'agent', action, requestId: 'request', expectedRevision: 3 });
  assert.equal(result.status, 'placed'); assert.equal(f.calls.length, 2);
  assert(f.calls[0].input.prompt.startsWith(action.prompt)); assert.match(f.calls[0].input.prompt, /isolated object.*plain white background/);
  assert.equal(f.calls[0].input.task, 'text-to-image');
  assert.deepEqual(f.calls[1].input.image, imageFixture()); assert.equal(f.calls[1].input.task, 'image-to-3d');
  assert.equal(Object.hasOwn(f.calls[1].input, 'prompt'), false);
  assert.equal(f.adapter.visible.size, 1); assert.deepEqual(f.states.map(value => value.status), ['image', 'mesh', 'saving', 'placed']);
  const stored = await f.store.getManifest(result.artifactCid); assert.equal(stored.model, undefined);
  assert.equal(stored.files[0].path, 'mesh.glb'); assert.equal((await f.store.stat(result.artifactCid)).pinned, true);
  const fileCid = stored.files[0].cid; assert.equal((await f.store.stat(fileCid)).pinned, false);
  await f.store.gc(); assert.equal((await f.store.stat(fileCid)).status, 'complete');
  await f.manager.dispose(); const restored = f.create(); await restored.ready; await until(() => f.adapter.visible.size === 1);
  assert.equal(restored.list()[0].artifactCid, result.artifactCid); assert.equal(f.calls.length, 2);
  const otherWorld = f.create({ worldId: 'cubechat:other', adapter: sceneAdapter() }); await otherWorld.ready; assert.deepEqual(otherWorld.list(), []);
  const otherHost = f.create({ ownerHostId: 'other', adapter: sceneAdapter() }); await otherHost.ready; assert.deepEqual(otherHost.list(), []);
});
test('exact requests deduplicate across active calls and reload; changed input cannot replay an existing object identity', async t => {
  const f = await fixture(t), release = deferred(), began = deferred();
  f.state.output = async input => { if (input.task === 'text-to-image') { began.resolve(); await release.promise; return { image: imageFixture() }; } return { mesh: meshFixture() }; };
  const input = { agentId: 'agent', action, requestId: 'idempotent' }, first = f.manager.generate(input);
  assert.equal(f.manager.generate(input), first);
  await assert.rejects(f.manager.generate({ ...input, action: { ...action, prompt: 'Different shape' } }), /Conflicting/);
  await began.promise; await assert.rejects(f.manager.generate({ ...input, requestId: 'another' }), /current object/);
  release.resolve(); await first; assert.equal(f.calls.length, 2);
  await f.manager.dispose(); const restored = f.create(); await restored.ready;
  assert.equal((await restored.generate(input)).status, 'saved'); assert.equal(f.calls.length, 2);
  await assert.rejects(restored.generate({ ...input, action: { ...action, prompt: 'Different shape' } }), /Conflicting/);
});

test('renderer failure after retention returns a saved receipt and restores the exact object without another model request', async t => {
  const f = await fixture(t), prepare = f.adapter.prepare.bind(f.adapter);
  let rendererAvailable = false;
  f.adapter.prepare = async (...args) => {
    const prepared = await prepare(...args);
    return { ...prepared, commit(...commitArgs) {
      if (!rendererAvailable) throw new Error('World object display limit reached');
      return prepared.commit(...commitArgs);
    } };
  };
  const input = { agentId: 'agent', action, requestId: 'saved-display-failure', image: imageFixture() };
  const pending = f.manager.generate(input), result = await pending;
  assert.equal(result.status, 'saved'); assert.match(result.displayError, /display limit/);
  assert.equal(f.manager.generate(input), pending, 'same acknowledged request does not regenerate');
  assert.equal(f.calls.length, 1); assert.equal(f.adapter.visible.size, 0); assert.equal(f.adapter.prepared[0].released, true);
  assert(f.states.some(event => event.status === 'saved' && /could not display/.test(event.message)));
  assert.equal((await f.store.stat(result.artifactCid)).pinned, true);
  const manifest = await f.store.getManifest(result.artifactCid);
  assert.deepEqual(manifest.provenance.worldObject, result.placement);
  assert.deepEqual(f.manager.list(), [{ artifactCid: result.artifactCid, placement: result.placement }]);
  await f.store.gc(); assert.equal((await f.store.stat(manifest.files[0].cid)).status, 'complete');
  await f.manager.dispose(); rendererAvailable = true;
  const restored = f.create(); await restored.ready; await until(() => f.adapter.visible.size === 1);
  assert.equal(f.calls.length, 1); assert.equal((await restored.generate(input)).status, 'saved');
  assert.deepEqual([...f.adapter.visible.values()][0], { artifactCid: result.artifactCid, placement: result.placement });
});

test('cancellation at renderer commit preserves the retained receipt, with a bounded failure if display cannot complete', async t => {
  for (const fails of [false, true]) {
    const f = await fixture(t), controller = new AbortController(), prepare = f.adapter.prepare.bind(f.adapter);
    f.adapter.prepare = async (...args) => {
      const prepared = await prepare(...args);
      return { ...prepared, commit(...commitArgs) {
        controller.abort(new DOMException('Cancelled after storage committed', 'AbortError'));
        if (fails) throw new Error('Display unavailable\0' + 'x'.repeat(2000));
        return prepared.commit(...commitArgs);
      } };
    };
    const result = await f.manager.generate({ agentId: 'agent', action, requestId: 'cancel-after-save',
      image: imageFixture(), signal: controller.signal });
    assert.equal(controller.signal.aborted, true);
    assert.equal(result.status, fails ? 'saved' : 'placed');
    if (fails) { assert(result.displayError.length <= 240); assert(!result.displayError.includes('\0')); assert(f.adapter.prepared[0].released); }
    assert.equal((await f.store.stat(result.artifactCid)).pinned, true);
    assert.deepEqual((await f.store.getManifest(result.artifactCid)).provenance.worldObject, result.placement);
    assert.equal(f.calls.length, 1); assert.equal(f.manager.list().length, 1);
  }
});
test('explicit source pixels route directly to the mesh provider and are copied before asynchronous dispatch', async t => {
  const f = await fixture(t), image = imageFixture();
  f.state.candidates = f.state.candidates.filter(value => value.task === 'image-to-3d');
  const running = f.manager.generate({ agentId: 'agent', action, image }); image.data.fill(0);
  await running; assert.equal(f.calls.length, 1); assert.equal(f.calls[0].input.task, 'image-to-3d');
  assert.deepEqual(f.calls[0].input.image, imageFixture());
});
test('missing model, local-only policy and revoked ownership fail before generation or saved placement', async t => {
  const f = await fixture(t);
  f.state.candidates = f.state.candidates.map(value => ({ ...value, local: false, key: `peer:${value.manifestCid}` }));
  await assert.rejects(f.manager.generate({ agentId: 'agent', action }), /No 3D generation model/); assert.equal(f.calls.length, 0);
  f.head.policy.inferenceMode = 'network-assisted';
  f.state.candidates = f.state.candidates.filter(value => value.task === 'image-to-3d');
  await assert.rejects(f.manager.generate({ agentId: 'agent', action }), /text-to-image model/); assert.equal(f.calls.length, 0);
  f.state.owns = false;
  await assert.rejects(f.manager.generate({ agentId: 'agent', action, image: imageFixture() }), /ownership/);
  assert.equal(f.manager.list().length, 0);
});
test('cancel waits for provider cleanup; authority is checked again after persistence and before manifest commit', async t => {
  const f = await fixture(t), began = deferred(), cleanup = deferred(), controller = new AbortController();
  f.state.output = async (_input, { signal }) => {
    began.resolve(); await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
    await cleanup.promise; signal.throwIfAborted();
  };
  const pending = f.manager.generate({ agentId: 'agent', action, signal: controller.signal }); pending.catch(() => {});
  await began.promise; controller.abort(); let finished = false; pending.catch(() => { finished = true; });
  await tick(); assert.equal(finished, false); cleanup.resolve(); await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(f.manager.list().length, 0); assert.equal(f.adapter.visible.size, 0);
  f.state.output = async () => ({ mesh: meshFixture() });
  const original = f.store.importFile.bind(f.store);
  f.store.importFile = async (...args) => { const file = await original(...args); f.head.revision++; return file; };
  await assert.rejects(f.manager.generate({ agentId: 'agent', action, image: imageFixture(), expectedRevision: 3 }), /settings changed/);
  assert.equal(f.manager.list().length, 0); assert(f.adapter.prepared.at(-1).released);
  const records = []; for await (const record of f.store.list()) records.push(record);
  assert.equal(records.filter(record => record.pinned).length, 0);
});
test('owner deletion removes scene and durable placement; another host cannot delete it', async t => {
  const f = await fixture(t), result = await f.manager.generate({ agentId: 'agent', action, requestId: 'delete-me', image: imageFixture() });
  const stranger = f.create({ ownerHostId: 'stranger', adapter: sceneAdapter() }); await stranger.ready;
  await assert.rejects(stranger.remove('delete-me'), /Only this host/);
  await f.manager.remove('delete-me'); assert.equal(f.adapter.visible.size, 0); assert.equal((await f.store.stat(result.artifactCid)).pinned, false);
  const reloaded = f.create(); await reloaded.ready; assert.deepEqual(reloaded.list(), []);
});
test('deletion during a slow publication withdraws its late announcement and cannot republish the removed object', async t => {
  const f = await fixture(t), entered = deferred(), release = deferred(), publications = [], withdrawals = [];
  f.runtime.artifactReady = true;
  f.runtime.publish = async cid => { publications.push(cid); entered.resolve(); await release.promise; };
  f.runtime.withdraw = async cid => { withdrawals.push(cid); };
  const result = await f.manager.generate({ agentId: 'agent', action, requestId: 'publishing', image: imageFixture() });
  await entered.promise; await f.manager.remove('publishing'); release.resolve(); await f.manager.syncNetwork();
  assert.deepEqual(publications, [result.artifactCid]); assert.deepEqual(withdrawals, [result.artifactCid]);
  assert.equal((await f.store.stat(result.artifactCid)).pinned, false);
  await f.manager.syncNetwork(); assert.equal(publications.length, 1);
});

test('explicit destinations fail before generation when unsupported, absent or obstructed without falling back nearby', async t => {
  const f = await fixture(t), placementTarget = { kind: 'participant', id: 'human:owner', observedAt: Date.now() };
  await assert.rejects(f.manager.generate({ agentId: 'agent', action, placementTarget }), /does not support/);
  assert.equal(f.calls.length, 0);
  f.adapter.supportsGroundedPlacement = true;
  f.adapter.getPlacement = () => { throw new Error('The requested participant has left'); };
  await assert.rejects(f.manager.generate({ agentId: 'agent', action, placementTarget }), /participant has left/);
  assert.equal(f.calls.length, 0); assert.equal(f.manager.list().length, 0);
});

test('participant placement reobserves after model work and disk writes; final position and CID restore exactly', async t => {
  const f = await fixture(t), placementTarget = { kind: 'participant', id: 'human:owner', observedAt: Date.now() };
  let current = [20, 0, 0]; const targets = [];
  f.adapter.supportsGroundedPlacement = true;
  f.adapter.getPlacement = (agentId, size, target) => { targets.push(structuredClone(target)); return [...current]; };
  f.state.output = async input => {
    if (input.task === 'text-to-image') return { image: imageFixture() };
    current = [60, 0, 40]; return { mesh: meshFixture() };
  };
  const importFile = f.store.importFile.bind(f.store);
  f.store.importFile = async (...args) => { const record = await importFile(...args); current = [80, 0, 50]; return record; };
  const input = { agentId: 'agent', action, requestId: 'moving-target', placementTarget };
  const pending = f.manager.generate(input); placementTarget.id = 'human:attacker';
  const result = await pending;
  assert(targets.length >= 3); assert(targets.every(target => target.id === 'human:owner'));
  assert.deepEqual(result.placement.position, [80, 0, 50]);
  const stored = await f.store.getManifest(result.artifactCid);
  assert.deepEqual(stored.provenance.worldObject.position, result.placement.position);
  assert.equal(f.calls.length, 2);
  await f.manager.dispose(); const restored = f.create(); await restored.ready;
  assert.deepEqual(restored.list()[0], { artifactCid: result.artifactCid, placement: result.placement });
  assert.equal(f.calls.length, 2, 'restoration never regenerates the mesh or repositions a saved object');
});

test('a fixed remembered destination stays fixed and its identity participates in request deduplication', async t => {
  const f = await fixture(t), placementTarget = { kind: 'location', id: 'knowledge:castle', position: [96, 3, 0],
    observedAt: Date.now(), knowledgeId: 'castle', knowledgeRevision: 7 };
  f.adapter.supportsGroundedPlacement = true;
  f.adapter.getPlacement = (_id, _size, target) => [target.position[0], 0, target.position[2]];
  const input = { agentId: 'agent', action, requestId: 'fixed', placementTarget };
  const first = f.manager.generate(input);
  assert.equal(f.manager.generate(input), first);
  await assert.rejects(f.manager.generate({ ...input, placementTarget: { ...placementTarget, position: [32, 3, 0] } }), /Conflicting/);
  await assert.rejects(f.manager.generate({ ...input, placementTarget: { ...placementTarget, knowledgeRevision: 8 } }), /Conflicting/);
  placementTarget.position[0] = 12;
  assert.deepEqual((await first).placement.position, [96, 0, 0]);
});

test('a destination blocked during model work or artifact persistence cannot become a pinned or visible object', async t => {
  for (const phase of ['mesh', 'storage']) {
    const f = await fixture(t); let blocked = false;
    f.adapter.supportsGroundedPlacement = true;
    f.adapter.getPlacement = () => { if (blocked) throw new Error('Destination became obstructed'); return [96, 0, 0]; };
    const placementTarget = { kind: 'location', id: 'ground:96:0', position: [96, 3, 0], observedAt: Date.now() };
    if (phase === 'mesh') f.state.output = async () => { blocked = true; return { mesh: meshFixture() }; };
    else {
      const original = f.store.importFile.bind(f.store);
      f.store.importFile = async (...args) => { const record = await original(...args); blocked = true; return record; };
    }
    await assert.rejects(f.manager.generate({ agentId: 'agent', action, image: imageFixture(), placementTarget }), /obstructed/);
    assert.equal(f.manager.list().length, 0); assert.equal(f.adapter.visible.size, 0);
    const records = []; for await (const record of f.store.list()) records.push(record);
    assert.equal(records.filter(record => record.pinned).length, 0);
  }
});

test('selected remembered-place revision is checked before inference and again before retention', async t => {
  const f = await fixture(t); let current = true, checked = 0;
  f.adapter.supportsGroundedPlacement = true; f.adapter.getPlacement = () => [96, 0, 0];
  const placementTarget = { kind: 'location', id: 'knowledge:castle', position: [96, 3, 0], observedAt: Date.now(), knowledgeId: 'castle', knowledgeRevision: 7 };
  const manager = f.create({ assertPlacementCurrent: async input => {
    checked++; assert.deepEqual(input.placementTarget, placementTarget);
    if (!current) throw new DOMException('Remembered place changed', 'AbortError');
  } }); await manager.ready;
  current = false;
  await assert.rejects(manager.generate({ agentId: 'agent', action, placementTarget }), { name: 'AbortError' });
  assert.equal(f.calls.length, 0);
  current = true;
  const original = f.store.importFile.bind(f.store);
  f.store.importFile = async (...args) => { const record = await original(...args); current = false; return record; };
  await assert.rejects(manager.generate({ agentId: 'agent', action, image: imageFixture(), placementTarget }), { name: 'AbortError' });
  assert(checked >= 3); assert.equal(manager.list().length, 0); assert.equal(f.adapter.visible.size, 0);
  const records = []; for await (const record of f.store.list()) records.push(record);
  assert.equal(records.filter(record => record.pinned).length, 0);
});

test('targeted object cancellation or ownership loss during persistence prevents a retained placement', async t => {
  for (const reason of ['cancel', 'ownership']) {
    const f = await fixture(t), controller = new AbortController();
    f.adapter.supportsGroundedPlacement = true; f.adapter.getPlacement = () => [96, 0, 0];
    const target = { kind: 'location', id: 'ground:96:0', position: [96, 3, 0], observedAt: Date.now() };
    const original = f.store.importFile.bind(f.store);
    f.store.importFile = async (...args) => { const record = await original(...args);
      if (reason === 'cancel') controller.abort(); else f.state.owns = false;
      return record;
    };
    await assert.rejects(f.manager.generate({ agentId: 'agent', action, placementTarget: target,
      image: imageFixture(), signal: controller.signal }), reason === 'cancel' ? { name: 'AbortError' } : /ownership/);
    assert.equal(f.manager.list().length, 0); assert.equal(f.adapter.visible.size, 0);
    const records = []; for await (const record of f.store.list()) records.push(record);
    assert.equal(records.filter(record => record.pinned).length, 0);
  }
});

function enableTransforms(f) {
  f.adapter.validateTransform = (_key, descriptor) => [...descriptor.placement.position];
  f.adapter.updateTransform = (key, descriptor) => {
    if (!f.adapter.visible.has(key)) throw new Error('Not visible');
    f.adapter.visible.set(key, structuredClone(descriptor));
  };
}

test('exact resize reuses mesh CID without inference, persists CAS head through reload and deduplicates old operation', async t => {
  const { IDBFactory } = await import('fake-indexeddb');
  const { WorldObjectStore } = await import('../../peercompute/src/peercompute/agents/WorldObjectStore.js');
  const f = await fixture(t); enableTransforms(f);
  const original = await f.manager.generate({ agentId: 'agent', action, requestId: 'castle', image: imageFixture() });
  const indexedDBImpl = new IDBFactory(), state = new WorldObjectStore({ name: 'resizing', indexedDBImpl }); await state.open();
  await f.manager.dispose(); const managed = f.create({ objectStore: state }); await managed.ready; await until(() => f.adapter.visible.size === 1);
  const request = { agentId: 'agent', objectId: 'castle', expectedObjectRevision: 0, expectedArtifactCid: original.artifactCid,
    multiplier: 10, requestId: 'scale-ten', expectedRevision: 3 };
  const before = await f.store.getManifest(original.artifactCid), count = f.calls.length;
  const resized = await managed.resize(request);
  assert.equal(resized.status, 'resized'); assert.equal(resized.oldSize, 6); assert.equal(resized.newSize, 60);
  assert.equal(resized.placement.revision, 1); assert.deepEqual(resized.placement.position, original.placement.position);
  assert.notEqual(resized.artifactCid, original.artifactCid);
  const after = await f.store.getManifest(resized.artifactCid);
  assert.deepEqual(after.files, before.files); assert.deepEqual(after.provenance.generatedMesh, before.provenance.generatedMesh);
  assert.equal(f.calls.length, count); assert.equal(f.adapter.prepared.length, 2, 'original and reload only; resize does not decode GLB again');
  assert.equal((await managed.resize(request)).newSize, 60); assert.equal(managed.list()[0].placement.size, 60);
  await managed.dispose(); await state.destroy();
  const reopened = new WorldObjectStore({ name: 'resizing', indexedDBImpl }); await reopened.open(); t.after(() => reopened.destroy());
  const restored = f.create({ objectStore: reopened }); await restored.ready; await until(() => f.adapter.visible.size === 1);
  assert.equal(restored.list()[0].artifactCid, resized.artifactCid); assert.equal(restored.list()[0].placement.size, 60);
  assert.equal((await restored.resize(request)).replayed, true); assert.equal(f.calls.length, count);
  const second = await restored.resize({ ...request, expectedObjectRevision: 1, expectedArtifactCid: resized.artifactCid, multiplier: 0.5, requestId: 'halve' });
  assert.equal(second.newSize, 30);
  assert.equal((await restored.resize(request)).newSize, 60, 'historic receipt does not overwrite the newer head');
  assert.equal(restored.list()[0].placement.size, 30);
  await restored.remove('castle'); await restored.dispose();
  const gone = f.create({ objectStore: reopened }); await gone.ready; assert.deepEqual(gone.list(), []);
  await assert.rejects(gone.resize(request), /removed/);
});

test('resize fences stale snapshots, foreign owners, exact bounds and geometry; no creation model is invoked', async t => {
  const f = await fixture(t); enableTransforms(f);
  const original = await f.manager.generate({ agentId: 'agent', action, requestId: 'object', image: imageFixture() });
  const input = { agentId: 'agent', objectId: 'object', expectedObjectRevision: 0, expectedArtifactCid: original.artifactCid,
    multiplier: 10, requestId: 'resize' };
  const stranger = f.create({ ownerHostId: 'stranger', adapter: sceneAdapter() }); await stranger.ready;
  await assert.rejects(stranger.resize(input), /not owned/);
  await assert.rejects(f.manager.resize({ ...input, expectedObjectRevision: 4 }), /revision changed/);
  await assert.rejects(f.manager.resize({ ...input, multiplier: 1000 }), /1024/);
  f.adapter.validateTransform = () => { throw new Error('Object would intersect another body'); };
  await assert.rejects(f.manager.resize(input), /intersect/);
  assert.equal(f.manager.list()[0].artifactCid, original.artifactCid); assert.equal(f.calls.length, 1);
  f.state.owns = false; await assert.rejects(f.manager.resize(input), /ownership/);
});

test('resize ownership loss after candidate retention leaves original head and reload ignores the uncommitted candidate', async t => {
  const f = await fixture(t); enableTransforms(f);
  const original = await f.manager.generate({ agentId: 'agent', action, requestId: 'original', image: imageFixture() });
  const importManifest = f.store.importManifest.bind(f.store);
  f.store.importManifest = async (...args) => { const record = await importManifest(...args); f.state.owns = false; return record; };
  await assert.rejects(f.manager.resize({ agentId: 'agent', objectId: 'original', expectedObjectRevision: 0,
    expectedArtifactCid: original.artifactCid, multiplier: 10, requestId: 'late' }), /ownership/);
  assert.equal(f.manager.list()[0].artifactCid, original.artifactCid);
  await f.manager.dispose(); const reload = f.create(); await reload.ready;
  assert.equal(reload.list()[0].artifactCid, original.artifactCid); assert.equal(f.calls.length, 1);
});

test('display failure after resize commit is a truthful saved receipt and restores the committed scale', async t => {
  const f = await fixture(t); enableTransforms(f);
  const original = await f.manager.generate({ agentId: 'agent', action, requestId: 'visible', image: imageFixture() });
  f.adapter.updateTransform = () => { throw new Error('Renderer was lost'); };
  const result = await f.manager.resize({ agentId: 'agent', objectId: 'visible', expectedObjectRevision: 0,
    expectedArtifactCid: original.artifactCid, multiplier: 10, requestId: 'saved-scale' });
  assert.equal(result.status, 'saved'); assert.match(result.displayError, /Renderer/); assert.equal(result.newSize, 60);
  await f.manager.dispose(); const reload = f.create(); await reload.ready; await until(() => f.adapter.visible.size === 1);
  assert.equal(reload.list()[0].placement.size, 60); assert.equal(f.calls.length, 1);
});

test('cancellation on retention exit after head CAS still returns the known committed resize receipt', async t => {
  const { WorldObjectStore } = await import('../../peercompute/src/peercompute/agents/WorldObjectStore.js');
  const f = await fixture(t); enableTransforms(f);
  const original = await f.manager.generate({ agentId: 'agent', action, requestId: 'committed', image: imageFixture() });
  const objectStore = new WorldObjectStore({ persistent: false }); await objectStore.open(); t.after(() => objectStore.destroy());
  await f.manager.dispose(); const manager = f.create({ objectStore }); await manager.ready; await until(() => f.adapter.visible.size === 1);
  const controller = new AbortController(), commit = objectStore.commit.bind(objectStore);
  objectStore.commit = async (...args) => { const result = await commit(...args); controller.abort(); return result; };
  const result = await manager.resize({ agentId: 'agent', objectId: 'committed', expectedObjectRevision: 0,
    expectedArtifactCid: original.artifactCid, multiplier: 10, requestId: 'commit-before-abort', signal: controller.signal });
  assert.equal(result.newSize, 60); assert(['saved', 'resized'].includes(result.status));
  assert.equal((await objectStore.get({ worldId, ownerHostId: 'host' }, 'committed')).artifactCid, result.artifactCid);
  assert.equal((await f.store.stat(result.artifactCid)).pinned, true); assert.equal(f.calls.length, 1);
});

test('different-object mutations serialize final geometry validation so expanded neighbors cannot overlap', async t => {
  const f = await fixture(t); enableTransforms(f);
  const one = await f.manager.generate({ agentId: 'agent', action, requestId: 'one', image: imageFixture() });
  const two = await f.manager.generate({ agentId: 'agent', action, requestId: 'two', image: imageFixture() });
  f.adapter.validateTransform = (key, descriptor) => {
    if ([...f.adapter.visible].some(([other, value]) => other !== key && value.placement.size >= 60)) throw new Error('Expanded neighbor blocks this resize');
    return descriptor.placement.position;
  };
  const results = await Promise.allSettled([one, two].map((original, i) => f.manager.resize({ agentId: 'agent', objectId: original.placement.objectId,
    expectedObjectRevision: 0, expectedArtifactCid: original.artifactCid, multiplier: 10, requestId: `grow-${i}` })));
  assert.equal(results.filter(value => value.status === 'fulfilled').length, 1);
  assert.match(results.find(value => value.status === 'rejected').reason.message, /neighbor/);
  assert.deepEqual(f.manager.list().map(value => value.placement.size).sort((a,b) => a-b), [6, 60]);
  assert.equal(f.calls.length, 2);
});

test('creation index failure preserves the known pinned artifact receipt and can be adopted on reload', async t => {
  const { WorldObjectStore } = await import('../../peercompute/src/peercompute/agents/WorldObjectStore.js');
  const f = await fixture(t), objectStore = new WorldObjectStore({ persistent: false }); await objectStore.open();
  t.after(() => objectStore.destroy()); await f.manager.dispose();
  const manager = f.create({ objectStore }); await manager.ready;
  const adopt = objectStore.adopt.bind(objectStore); objectStore.adopt = async () => { throw new Error('Index quota failure'); };
  const result = await manager.generate({ agentId: 'agent', action, requestId: 'index-failure', image: imageFixture() });
  assert.equal(result.status, 'saved'); assert.equal(result.indexError, true); assert.match(result.displayError, /index/);
  assert.equal((await f.store.stat(result.artifactCid)).pinned, true); assert.equal(f.calls.length, 1);
  await manager.dispose(); objectStore.adopt = adopt;
  const restored = f.create({ objectStore }); await restored.ready;
  assert.equal(restored.list()[0].artifactCid, result.artifactCid); assert.equal(f.calls.length, 1);
});

test('synchronous current-revision guard rejects a settings change during object head transaction', async t => {
  const f = await fixture(t); enableTransforms(f);
  const original = await f.manager.generate({ agentId: 'agent', action, requestId: 'revision-guard', image: imageFixture() });
  await f.manager.dispose();
  let checks = 0;
  const manager = f.create({ isCurrent: () => ++checks < 2 }); await manager.ready;
  await assert.rejects(manager.resize({ agentId: 'agent', objectId: 'revision-guard', expectedObjectRevision: 0,
    expectedArtifactCid: original.artifactCid, multiplier: 10, requestId: 'changed-settings', expectedRevision: 3 }), { name: 'AbortError' });
  assert.equal(checks, 2); assert.equal(manager.list()[0].artifactCid, original.artifactCid);
});
