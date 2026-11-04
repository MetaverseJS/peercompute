import test from 'node:test';
import assert from 'node:assert/strict';
import { DIFFUSION_MODEL_CATALOG } from '../../src/peercompute/artifacts/diffusionModelCatalog.js';
import { validateDiffusionManifest, normalizeDiffusionInput, validateDiffusionRuntimeAssets, diffusionRuntimeDefinition } from '../../src/peercompute/inference/diffusion/runtimeDefinition.js';
import { createDiffusionTaskHandler } from '../../src/peercompute/inference/diffusion/modelTask.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { LATENT_SIZE, seededRandom, gaussianLatents, SD_SIGMA, sdStep, sdScaleInput, lcmStep, rgbaFromNchw } from '../../src/peercompute/inference/diffusion/math.js';
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const origin = 'https://peercompute.test/worker.js';
const assets = { mjs: '/assets/ort-wasm-simd-threaded.jsep-Ab12_-.mjs', wasm: '/assets/ort-wasm-simd-threaded.jsep-123Ab.wasm' };
function manifest(id = 'sd-turbo-onnx') { const entry = DIFFUSION_MODEL_CATALOG[id]; return { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model), files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) }; }

test('diffusion admits only exact profiles and complete digest-pinned file closures', () => {
  for (const id of Object.keys(DIFFUSION_MODEL_CATALOG)) {
    const value = manifest(id); assert.equal(validateDiffusionManifest(value).trusted.id, id);
    assert.equal(validateDiffusionManifest(value).resourcePolicy.minimumGpuBytes, 8 * 1024 ** 3);
    for (const [key, replacement] of [['revision', 'f'.repeat(40)], ['steps', 8], ['width', 1024], ['dtype', 'q4'], ['format', 'GGUF'], ['padTokenId', 7], ['weightQuantization', 'fake']]) {
      const wrong = structuredClone(value); wrong.model[key] = replacement; assert.throws(() => validateDiffusionManifest(wrong));
    }
    const altered = structuredClone(value); altered.files[0].sha256 = '0'.repeat(64); assert.throws(() => validateDiffusionManifest(altered), /digests/);
    altered.files.pop(); assert.throws(() => validateDiffusionManifest(altered), /catalog/);
  }
});

test('diffusion assets support hashed production filenames and reject remote or arbitrary runtime modules', () => {
  assert.equal(validateDiffusionRuntimeAssets(assets, origin).mjs, 'https://peercompute.test' + assets.mjs);
  for (const mjs of ['https://cdn.test/ort-wasm-simd-threaded.jsep.mjs', '/x.mjs', '/ort-wasm-simd-threaded.jsep.mjs#x']) assert.throws(() => validateDiffusionRuntimeAssets({ ...assets, mjs }, origin));
  assert.throws(() => diffusionRuntimeDefinition.validateRuntimeOptions({ executionProviders: ['cpu'] }));
});

test('text-to-image uses one bounded user prompt and pinned dimensions/steps', () => {
  const source = manifest(); assert.deepEqual(normalizeDiffusionInput({ prompt: ' apple ', seed: 0 }, source), { task: 'text-to-image', prompt: 'apple', messages: [{ role: 'user', content: 'apple' }], seed: 0, steps: 1, width: 512, height: 512 });
  for (const extra of [{ seed: -1 }, { seed: 2 ** 32 }, { steps: 4 }, { width: 1024 }, { image: {} }, { prompt: 'x'.repeat(4097) }, { messages: [{ role: 'system', content: 'style' }, { role: 'user', content: 'apple' }] }]) assert.throws(() => normalizeDiffusionInput({ prompt: 'apple', ...extra }, source));
  assert.equal(normalizeDiffusionInput({ prompt: 'apple', seed: 1 }, manifest('dreamshaper-8-lcm-int8-onnx')).steps, 4);
});

test('seeded noise is repeatable, finite and SD scheduler applies the fixed sigma and decoder scale', () => {
  const a = gaussianLatents(seededRandom(123)), b = gaussianLatents(seededRandom(123)); assert.deepEqual(a, b); assert.notEqual(a[0], gaussianLatents(seededRandom(124))[0]); assert(a.every(Number.isFinite));
  const sample = new Float32Array(LATENT_SIZE).fill(2), noise = new Float32Array(LATENT_SIZE).fill(0.1);
  assert(Math.abs(sdScaleInput(sample)[0] - 2 / Math.sqrt(SD_SIGMA ** 2 + 1)) < 1e-6);
  assert(Math.abs(sdStep(sample, noise)[0] - (2 - SD_SIGMA * noise[0]) / 0.18215) < 1e-6);
  sample[0] = Infinity; assert.throws(() => sdStep(sample, noise), /Nonfinite/);
});

test('LCM final boundary step matches an independent scalar reference without adding final noise or SD VAE scale', () => {
  let alpha = 1; for (let t = 0; t <= 259; t++) alpha *= 1 - (Math.sqrt(.00085) + (Math.sqrt(.012) - Math.sqrt(.00085)) * t / 999) ** 2;
  const sample = new Float32Array(LATENT_SIZE).fill(2), noise = new Float32Array(LATENT_SIZE).fill(.25);
  const expected = (2590 / Math.sqrt(2590 ** 2 + .25)) * (2 - Math.sqrt(1 - alpha) * .25) / Math.sqrt(alpha) + .25 / (2590 ** 2 + .25) * 2;
  assert(Math.abs(lcmStep(sample, noise, 3, () => { throw new Error('Final step cannot draw noise'); })[0] - expected) < 1e-6);
  assert.throws(() => lcmStep(sample, noise, 4), /Invalid/);
});

test('NCHW decoder maps channels, clamps pixels and rejects nonfinite or incorrectly shaped outputs', () => {
  const data = new Float32Array(3 * 512 ** 2); data[0] = -3; data[512 ** 2] = 0; data[2 * 512 ** 2] = 3;
  const result = rgbaFromNchw(data, [1, 3, 512, 512]); assert.equal(result.data.length, 1048576); assert.deepEqual([...result.data.slice(0, 4)], [0, 128, 255, 255]);
  data[0] = NaN; assert.throws(() => rgbaFromNchw(data, [1, 3, 512, 512]), /nonfinite/); assert.throws(() => rgbaFromNchw(data, [1, 512, 512, 3]), /512/);
});

function fixture(generate = async (options) => ({ text: '', seed: options.seed, steps: options.steps, image: { width: 512, height: 512, channels: 4, data: new Uint8Array(1048576) } })) {
  let disposed = 0, calls = 0;
  const engine = { evidence: {}, async generate(options) { calls++; return generate(options); }, async dispose() { disposed++; } };
  const task = createDiffusionTaskHandler({ assertWorker() {}, baseUrl: origin, createEngine: async () => engine });
  const load = () => task({ command: 'load', sessionId: 'model', manifestCid: cid, manifest: manifest(), runtimeAssets: assets }, { workerId: 'worker-7' });
  const run = (context = {}) => task({ command: 'generate', sessionId: 'model', requestId: 'request', prompt: 'apple', seed: 42 }, context);
  return { task, load, run, engine, get disposed() { return disposed; }, get calls() { return calls; } };
}
test('managed task retains sessions for warm generation, returns bounded image and disposes explicitly', async () => {
  const f = fixture(); assert.equal((await f.load()).status, 'ready'); assert.equal((await f.run()).workerId, 'worker-7'); await f.run(); assert.equal(f.calls, 2);
  await assert.rejects(f.load(), /Unload/); assert.equal((await f.task({ command: 'unload', sessionId: 'model' })).status, 'unloaded'); assert.equal(f.disposed, 1);
});
test('native traps quarantine task state and cannot be followed by another generation', async () => {
  const f = fixture(async () => { throw new WebAssembly.RuntimeError('unreachable'); }); await f.load(); await assert.rejects(f.run(), /unreachable/);
  assert.equal((await f.task({ command: 'status', sessionId: 'model' })).status, 'lost'); await assert.rejects(f.run(), /lost/); assert.equal(f.calls, 1);
});
test('late cancellation suppresses generated output while a healthy engine remains reusable', async () => {
  const controller = new AbortController(); const f = fixture(async () => { controller.abort(); return { image: {} }; }); await f.load(); await assert.rejects(f.run({ signal: controller.signal }), { name: 'AbortError' });
  assert.equal((await f.task({ command: 'status', sessionId: 'model' })).status, 'ready');
});
test('service routes normalized image generation into the trusted worker and releases admission after termination', async () => {
  const tasks = [], events = []; const source = manifest();
  const compute = { async reserveWorkerAffinity() {}, async releaseWorkerAffinity() { events.push('affinity'); }, async terminateWorkerAffinity() { events.push('terminate'); }, async cancelTask() {}, async submitTask(task) { tasks.push(task); task.data.artifactPort?.close(); return { status: task.data.command === 'load' ? 'ready' : 'unloaded' }; } };
  const service = new ModelInferenceService({ computeManager: compute, artifactStore: { async stat() { return { status: 'complete' }; }, async *openRead() {}, async getManifest() { return source; } }, admission: { async acquire() { return { async release() { events.push('lease'); } }; } }, runtimeAssets: assets, baseUrl: origin, runtimeDefinition: diffusionRuntimeDefinition, resourceEstimate: { cpuBytes: 8 * 1024 ** 3, gpuBytes: 8 * 1024 ** 3 } });
  await service.loadModel({ manifestCid: cid }); await service.generate({ prompt: 'apple', seed: 2 }); const task = tasks.find((value) => value.data.command === 'generate'); assert.equal(task.module, 'peercompute:diffusion-inference'); assert.equal(task.requireWorker, true); assert.equal(task.data.steps, 1); assert.equal(task.data.seed, 2);
  await service.unloadModel(); assert(events.indexOf('terminate') < events.indexOf('lease')); await service.dispose();
});

test('JSEP actual-device capture follows adapter.requestDevice and survives readonly env replacement', async () => {
  const { captureOrtDevice } = await import('../../src/peercompute/inference/diffusion/engine.js');
  const actual = { marker: 'ORT device' }, adapter = { async requestDevice() { assert.equal(this, adapter); return actual; } };
  const original = adapter.requestDevice, captured = []; const restore = captureOrtDevice(adapter, (device) => captured.push(device));
  const env = { webgpu: {} }; Object.defineProperty(env.webgpu, 'device', { value: await adapter.requestDevice({ requiredFeatures: ['shader-f16'] }), writable: false });
  assert.equal(captured[0], env.webgpu.device); assert.equal(captured[0], actual); restore(); assert.equal(adapter.requestDevice, original);
});

test('native failure racing cancellation quarantines diffusion while cooperative post-stage cancellation remains healthy', async () => {
  const { runDiffusionGpuStage } = await import('../../src/peercompute/inference/diffusion/engine.js');
  for (const fails of [true, false]) {
    const controller = new AbortController(); let lost = false;
    const session = { async run() { controller.abort(); if (fails) throw new WebAssembly.RuntimeError('trap'); return {}; } };
    await assert.rejects(runDiffusionGpuStage({ session, inputs: {}, device: { queue: { async onSubmittedWorkDone() {} } }, signal: controller.signal, own() {}, markLost() { lost = true; } }), fails ? /Model session lost/ : { name: 'AbortError' });
    assert.equal(lost, fails);
  }
});
