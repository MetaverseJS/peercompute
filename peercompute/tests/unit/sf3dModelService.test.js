import test from 'node:test';
import assert from 'node:assert/strict';
import { SF3D_MODEL_CATALOG } from '../../src/peercompute/artifacts/sf3dModelCatalog.js';
import { meshModelFileUrl } from '../../src/peercompute/artifacts/meshModelCatalog.js';
import { validateSf3dManifest, normalizeSf3dInput, sf3dRuntimeDefinition } from '../../src/peercompute/inference/sf3dRuntimeDefinition.js';
import { validateMeshManifest } from '../../src/peercompute/inference/mesh/runtimeDefinition.js';
import { createMeshTaskHandler } from '../../src/peercompute/inference/mesh/modelTask.js';
import { evaluateModelCompatibility } from '../../../demos/inference/src/modelDeviceCompatibility.js';
import { validateHubPackage } from '../../../demos/inference/src/modelHubPackage.js';
import { trustedCatalogSource } from '../../../demos/inference/src/modelCatalogSources.js';

const entry = SF3D_MODEL_CATALOG['stable-fast-3d-webgpu'];
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const manifest = () => ({ schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
  files: entry.files.map(({path, size, sha256}) => ({path, size, sha256, cid})) });
const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([255, 100, 50, 255]) };
const assets = { mjs: '/assets/ort-wasm-simd-threaded.asyncify-Ab12.mjs', wasm: '/assets/ort-wasm-simd-threaded.asyncify-Ab12.wasm' };

test('SF3D admission binds kernels, grids, foreground and weights to exact identities', () => {
  assert.equal(validateSf3dManifest(manifest()).trusted, entry);
  assert.equal(entry.totalBytes, entry.files.reduce((n, file) => n + file.size, 0));
  assert.throws(() => validateMeshManifest(manifest()), /catalog/);
  for (const mutate of [m => { m.files.pop(); }, m => { m.files[0].sha256 = '0'.repeat(64); },
    m => { m.files[0].size--; }, m => { m.model.kernelRevision = '0'.repeat(40); },
    m => { m.model.textureSize = 8192; }, m => { m.model.backgroundRemoval = 'none'; }]) {
    const changed = manifest(); mutate(changed); assert.throws(() => validateSf3dManifest(changed), /catalog/);
  }
  assert.equal(normalizeSf3dInput({ task: 'image-to-3d', image }, manifest()).task, 'image-to-3d');
  assert.throws(() => normalizeSf3dInput({ image, prompt: 'unhandled condition' }, manifest()), /image input/);
  assert.throws(() => normalizeSf3dInput({ image, audio: {} }, manifest()), /audio/);
  assert.throws(() => sf3dRuntimeDefinition.validateRuntimeOptions({ textureSize: 8192 }), /fixed/);
});

test('FP16 storage does not require shader-f16 for the pinned FP32 compute pipeline', () => {
  const device = { webgpu: true, features: [] };
  assert.equal(evaluateModelCompatibility(entry, { device }).code, 'memory_fit_unverified');
  assert.equal(evaluateModelCompatibility(entry, { device: { webgpu: false } }).code, 'webgpu_unavailable');
  assert.equal(evaluateModelCompatibility(entry, { device, budgets: { gpuBytes: 1024 ** 3 } }).code, 'gpu_budget_exceeded');
  const changed = structuredClone(entry); changed.model.computeDtype = 'fp16';
  assert.equal(evaluateModelCompatibility(changed, { device }).code, 'catalog_unsupported');
});

test('catalog and inspected imports use pinned cross-repository grid and foreground sources', () => {
  const inspected = validateHubPackage(entry);
  const source = trustedCatalogSource(inspected);
  assert(source);
  assert.match(source.sourceUrl('weights.bin'), /BasinShapers\/sf3d-webgpu-weights\/resolve\/53cfd892/);
  assert.match(source.sourceUrl('tets/vertices.bin'), /needle-tools\/SF3D-webgpu\/resolve\/56d2f58.*\/tets_vertices.bin$/);
  assert.match(source.sourceUrl('u2netp.onnx'), /edgetools\/u2netp/);
  assert.equal(source.sourceUrl('weights.bin'), meshModelFileUrl(entry.id, 'weights.bin'));
  assert.throws(() => source.sourceUrl('../../other'));
  const changed = structuredClone(inspected); changed.files[0].sha256 = 'f'.repeat(64);
  assert.equal(trustedCatalogSource(changed), null);
  assert.match(entry.license.notice, /Powered by Stability AI/);
  assert(entry.files.some(file => file.path === 'LICENSE.md'));
  assert(entry.files.some(file => file.path === 'NOTICE'));
});

test('managed task uses SF3D admission and suppresses output after cancellation', async () => {
  let disposals = 0, calls = 0;
  const controller = new AbortController();
  const handler = createMeshTaskHandler({ assertWorker() {}, baseUrl: 'https://example.test/worker.js',
    validateManifest: validateSf3dManifest, normalizeInput: normalizeSf3dInput,
    createEngine: async () => ({ lost: false, getEvidence: () => ({ gpuDispatches: 1 }),
      generate: async () => { calls++; controller.abort(); return { mesh: {} }; },
      dispose: async () => { disposals++; } }) });
  await handler({ command: 'load', sessionId: 'sf3d', manifestCid: cid, manifest: manifest(), runtimeAssets: assets });
  await assert.rejects(handler({ command: 'generate', sessionId: 'sf3d', requestId: 'request', image },
    { signal: controller.signal }), { name: 'AbortError' });
  await handler({ command: 'unload', sessionId: 'sf3d' });
  assert.equal(calls, 1); assert.equal(disposals, 1);
});
