import test from 'node:test';
import assert from 'node:assert/strict';
import { MESH_MODEL_CATALOG } from '../../src/peercompute/artifacts/meshModelCatalog.js';
import { validateMeshManifest, normalizeMeshInput, validateMeshRuntimeAssets, meshRuntimeDefinition,
  MESH_RESOURCE_POLICY } from '../../src/peercompute/inference/mesh/runtimeDefinition.js';
import { createMeshTaskHandler } from '../../src/peercompute/inference/mesh/modelTask.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { evaluateModelCompatibility } from '../../../demos/inference/src/modelDeviceCompatibility.js';

const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const origin = 'https://peercompute.test/worker.js';
const assets = { mjs: '/assets/ort-wasm-simd-threaded.asyncify-Ab12_-.mjs', wasm: '/assets/ort-wasm-simd-threaded.asyncify-123Ab.wasm' };
const image = () => ({ width: 2, height: 2, channels: 4, data: new Uint8Array(16).fill(255) });
function manifest() {
  const entry = MESH_MODEL_CATALOG['triposr-q8-onnx'];
  return { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
    files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) };
}

test('3D execution admits exact graphs and preprocessing, not peer or Hub profile claims', () => {
  const source = manifest();
  assert.equal(validateMeshManifest(source).totalBytes, source.files.reduce((n, f) => n + f.size, 0));
  for (const mutate of [m => m.files.pop(), m => m.files[0].sha256 = 'f'.repeat(64),
    m => m.model.resolution = 128, m => m.model.radius = 1, m => m.model.requiredFeatures.push('shader-f16'),
    m => m.model.composition = {}, m => m.model.revision = 'a'.repeat(40)]) {
    const copy = structuredClone(source); mutate(copy);
    assert.throws(() => validateMeshManifest(copy), /qualified runtime catalog/);
  }
  assert.equal(normalizeMeshInput({ task: 'image-to-3d', image: image() }, source).task, 'image-to-3d');
  assert.throws(() => normalizeMeshInput({ image: image(), prompt: 'ignored conditioning' }, source), /image input/);
  assert.throws(() => normalizeMeshInput({ task: 'text-generation', image: image() }, source), /3D objects/);
  assert.throws(() => normalizeMeshInput({}, source), /requires an image/);
  assert.throws(() => normalizeMeshInput({ image: { ...image(), data: new Uint8Array(15) } }, source), /RGBA/);
});

test('native WebGPU mesh assets cannot use the incompatible JSEP ABI or third-party URLs', () => {
  assert.equal(validateMeshRuntimeAssets(assets, origin).wasm, new URL(assets.wasm, origin).href);
  for (const wasm of ['https://other.test/ort-wasm-simd-threaded.asyncify.wasm',
    '/assets/ort-wasm-simd-threaded.jsep.wasm', assets.wasm + '?version=1']) {
    assert.throws(() => validateMeshRuntimeAssets({ ...assets, wasm }, origin), /same-origin ORT asyncify/);
  }
  assert.throws(() => meshRuntimeDefinition.validateRuntimeOptions({ resolution: 1024 }), /fixed/);
  const compatible = evaluateModelCompatibility(MESH_MODEL_CATALOG['triposr-q8-onnx'], { device: { webgpu: true, features: [] } });
  assert.equal(compatible.status, 'unknown'); assert.equal(compatible.code, 'memory_fit_unverified');
  assert.equal(compatible.gpuBytes, MESH_RESOURCE_POLICY.minimumGpuBytes);
});

function fixture(generate) {
  let disposed = 0, calls = 0;
  const handler = createMeshTaskHandler({ baseUrl: origin, assertWorker() {}, createEngine: async () => ({
    getEvidence: () => ({ gpuDispatches: 1 }), generate: async (...args) => { calls++; return generate(...args); },
    dispose: async () => { disposed++; },
  }) });
  return { handler, get disposed() { return disposed; }, get calls() { return calls; },
    load: () => handler({ command: 'load', sessionId: 'mesh', manifestCid: cid, manifest: manifest(), runtimeAssets: assets }, { workerId: 'owned' }),
    run: context => handler({ command: 'generate', sessionId: 'mesh', requestId: 'mesh-request', task: 'image-to-3d', image: image() }, context) };
}

test('managed 3D task suppresses cancelled output and quarantines native traps', async () => {
  const controller = new AbortController();
  const cancelled = fixture(async () => { controller.abort(); return { mesh: {} }; });
  assert.equal((await cancelled.load()).workerId, 'owned');
  await assert.rejects(cancelled.run({ signal: controller.signal }), { name: 'AbortError' });
  assert.equal((await cancelled.handler({ command: 'status', sessionId: 'mesh' })).status, 'ready');
  await cancelled.handler({ command: 'unload', sessionId: 'mesh' }); assert.equal(cancelled.disposed, 1);
  const trapped = fixture(async () => { throw new WebAssembly.RuntimeError('trap'); });
  await trapped.load(); await assert.rejects(trapped.run(), /trap/);
  await assert.rejects(trapped.run(), /session lost/); assert.equal(trapped.calls, 1);
  await trapped.handler({ command: 'unload', sessionId: 'mesh' });
});

test('service copies image ownership and releases GPU residency only after worker termination', async () => {
  const tasks = [], events = [], source = manifest();
  const compute = { async reserveWorkerAffinity() {},
    getWorkerAffinityState(affinityKey) { return { affinityKey, reserved: true, workerId: 'mesh-worker' }; },
    async releaseWorkerAffinity() { events.push('affinity'); }, async terminateWorkerAffinity() { events.push('terminate'); },
    async cancelTask() {}, async submitTask(task) { tasks.push(task); task.data.artifactPort?.close();
      return { status: task.data.command === 'load' ? 'ready' : 'unloaded' }; } };
  const service = new ModelInferenceService({ computeManager: compute,
    artifactStore: { async stat() { return { status: 'complete' }; }, async *openRead() {}, async getManifest() { return source; } },
    admission: { async acquire() { return { async release() { events.push('lease'); } }; } },
    runtimeAssets: assets, baseUrl: origin, runtimeDefinition: meshRuntimeDefinition,
    resourceEstimate: { cpuBytes: MESH_RESOURCE_POLICY.minimumCpuBytes, gpuBytes: MESH_RESOURCE_POLICY.minimumGpuBytes } });
  try {
    await service.loadModel({ manifestCid: cid }); const pixels = image();
    await service.generate({ task: 'image-to-3d', image: pixels });
    const task = tasks.find(value => value.data.command === 'generate');
    assert.equal(task.module, 'peercompute:mesh-inference'); assert.equal(task.requireWorker, true);
    assert.deepEqual(task.data.image.data, pixels.data); assert.notEqual(task.data.image.data, pixels.data);
    assert.equal(task.data.messages, undefined);
    await service.unloadModel(); assert(events.indexOf('terminate') < events.indexOf('lease'));
  } finally { await service.dispose(); }
});
