import test from 'node:test';
import assert from 'node:assert/strict';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { modelResourcePolicy, validateModelManifest } from '../../src/peercompute/inference/modelManifest.js';
import { onnxMemoryProfile, onnxCacheBytes } from '../../src/peercompute/inference/modelCapabilities.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { modelMemoryEstimate, evaluateModelCompatibility } from '../../../demos/inference/src/modelDeviceCompatibility.js';
const GiB = 1024 ** 3;
const config = { model_type: 'phi3', hidden_size: 1536, num_attention_heads: 12,
  num_key_value_heads: 2, num_hidden_layers: 28, vocab_size: 151936 };
const configBytes = new TextEncoder().encode(JSON.stringify(config));
const hash = await sha256.digest(configBytes), cid = CID.createV1(0x55, hash).toString();
const digest = Buffer.from(hash.digest).toString('hex');
function manifest(weightBytes = 1820055552) {
  return { schema: 'peercompute.artifact.manifest.v1', model: { runtime: 'transformers.js', runtimeVersion: '4.3.2',
    architecture: 'phi3', task: 'text-generation', dtype: 'q4', memoryProfile: onnxMemoryProfile(config) },
  files: ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'onnx/model_q4.onnx'].map((path) => ({ path, cid, sha256: digest,
    size: path.endsWith('.onnx') ? weightBytes : configBytes.length })) };
}
const device = { webgpu: true, features: [], limits: { maxBufferSize: 256 * 1024 ** 2 } };

test('larger ONNX packages use bounded file limits and conservative size/cache reservations', () => {
  const m = manifest(), { resourcePolicy: p, totalBytes } = validateModelManifest(m);
  assert(totalBytes > 1.5 * GiB); assert.equal(p.maxModelBytes, 8 * GiB);
  const cache = onnxCacheBytes(m.model.memoryProfile);
  assert.equal(p.minimumCpuBytes, totalBytes * 2 + 2 * GiB + cache);
  assert.equal(p.minimumGpuBytes, totalBytes * 2 + GiB + cache);
  assert.deepEqual(modelMemoryEstimate(m), { cpuBytes: p.minimumCpuBytes, gpuBytes: p.minimumGpuBytes });
  assert.equal(evaluateModelCompatibility(m, { device, budgets: { cpuBytes: 12 * GiB, gpuBytes: 16 * GiB } }).status, 'unknown');
  assert.equal(evaluateModelCompatibility(m, { device, budgets: { cpuBytes: 4 * GiB } }).code, 'cpu_budget_exceeded');
  assert.equal(evaluateModelCompatibility(m, { device, budgets: { gpuBytes: 4 * GiB } }).code, 'gpu_budget_exceeded');
  assert.throws(() => validateModelManifest(manifest(2 * GiB)), /file budget/);
  const huge = manifest(); huge.files.push(...Array.from({ length: 5 }, (_, i) => ({ path: `part${i}`, cid, sha256: digest, size: 1.5 * GiB })));
  assert.throws(() => validateModelManifest(huge), /8 GiB/);
  const missing = manifest(); delete missing.model.memoryProfile;
  assert.throws(() => validateModelManifest(missing), /memory profile/);
});

test('legacy small and multimodal policy floors remain while peers cannot declare their own RAM budgets', () => {
  assert.equal(modelResourcePolicy({ architecture: 'qwen3' }, { totalBytes: 100 }).minimumCpuBytes, 0);
  assert.equal(modelResourcePolicy({ architecture: 'qwen3_5' }, { totalBytes: 1771280684 }).minimumCpuBytes, 8 * GiB);
  const m = manifest(); m.model.cpuBytes = m.model.gpuBytes = 1;
  assert.equal(modelMemoryEstimate(m).cpuBytes, modelMemoryEstimate(manifest()).cpuBytes);
  const tiny = manifest(100); tiny.model.task = 'image-text-to-text';
  assert.throws(() => validateModelManifest(tiny), /task/);
  for (const [architecture, limit] of [['qwen3_5', 2 * GiB], ['idefics3', 1.5 * GiB], ['smolvlm', 1.5 * GiB]]) {
    assert.equal(modelResourcePolicy({ architecture }).maxModelBytes, limit);
    assert.throws(() => modelResourcePolicy({ architecture }, { files: [{ size: GiB }, { size: limit - GiB + 1 }] }), /file budget/);
  }
});

function serviceFixture({ changedConfig = configBytes, envelope = 12 * GiB, actualDigest = digest } = {}) {
  const m = manifest(), events = []; let reserved = false;
  const service = new ModelInferenceService({ baseUrl: 'https://test.invalid/',
    runtimeAssets: { mjs: 'https://test.invalid/runtime.mjs', wasm: 'https://test.invalid/runtime.wasm' },
    resourceEstimate: { cpuBytes: envelope, gpuBytes: envelope },
    artifactStore: { getManifest: async () => m,
      stat: async () => ({ status: 'complete', size: configBytes.length, sha256: actualDigest }),
      openRead: async () => (async function* () { events.push('config-read'); yield changedConfig; })() },
    admission: { async acquire() { events.push('admit'); return { release() { events.push('release'); } }; } },
    computeManager: { async reserveWorkerAffinity() { events.push('reserve'); reserved = true; },
      getWorkerAffinityState: () => ({ reserved, workerId: reserved ? 1 : null }),
      async releaseWorkerAffinity() { reserved = false; }, async terminateWorkerAffinity() { reserved = false; }, async cancelTask() {},
      async submitTask(task) { events.push(task.data.command); return { workerId: 1 }; } } });
  return { service, events };
}

test('host verifies actual CID config before worker reservation and rejects underestimated residency', async () => {
  const good = serviceFixture();
  await good.service.loadModel({ manifestCid: cid });
  assert.deepEqual(good.events.slice(0, 4), ['config-read', 'reserve', 'admit', 'load']);
  await good.service.unloadModel(); await good.service.dispose();
  const small = serviceFixture({ envelope: 4 * GiB });
  await assert.rejects(small.service.loadModel({ manifestCid: cid }), /envelope/);
  assert.deepEqual(small.events, ['config-read']); await small.service.dispose();
  const substitute = new TextEncoder().encode(JSON.stringify({ ...config, num_hidden_layers: 29 }));
  assert.equal(substitute.length, configBytes.length);
  const wrong = serviceFixture({ changedConfig: substitute });
  await assert.rejects(wrong.service.loadModel({ manifestCid: cid }), /verified config/);
  assert.deepEqual(wrong.events, ['config-read']); await wrong.service.dispose();
  const unverified = serviceFixture({ actualDigest: '0'.repeat(64) });
  await assert.rejects(unverified.service.loadModel({ manifestCid: cid }), /verified locally/);
  assert.deepEqual(unverified.events, []); await unverified.service.dispose();
});
