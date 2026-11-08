import test from 'node:test';
import assert from 'node:assert/strict';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { createModelMemoryBudgets } from '../../../demos/inference/src/modelMemoryBudgets.js';
import { modelMemoryEstimate } from '../../../demos/inference/src/modelDeviceCompatibility.js';
import { MODEL_CATALOG } from '../../src/peercompute/inference/modelCatalog.js';
import { DIFFUSION_MODEL_CATALOG } from '../../src/peercompute/artifacts/diffusionModelCatalog.js';
import { SPEECH_MODEL_CATALOG } from '../../src/peercompute/inference/speech/speechCatalog.js';
import { ResourceLeaseBroker } from '../../src/peercompute/serviceOrchestration/ResourceLeaseBroker.js';
import { ResidentModelAdmission } from '../../src/peercompute/serviceOrchestration/ResidentModelAdmission.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';

const GiB = 1024 ** 3;
const dream = modelMemoryEstimate(DIFFUSION_MODEL_CATALOG['dreamshaper-8-lcm-int8-onnx']);
const qwen = modelMemoryEstimate(MODEL_CATALOG['qwen3.5-2b-q4']);
const speech = modelMemoryEstimate(Object.values(SPEECH_MODEL_CATALOG)[0]);
const reserve = (admission, id, estimate) => admission.acquire({ sessionId: id, manifestCid: id,
  estimatedCpuBytes: estimate.cpuBytes, estimatedGpuBytes: estimate.gpuBytes });
function fixture({ owned = true, initial, capacities } = {}) {
  const compute = {};
  const policy = createModelMemoryBudgets({ computeManager: compute, owned, initial });
  compute.resourceBroker = new ResourceLeaseBroker({ capacities: capacities ?? policy.initialResourceBudgets(8) });
  const admission = new ResidentModelAdmission({ broker: compute.resourceBroker, ...policy.admissionOptions });
  return { policy, admission, broker: compute.resourceBroker, compute };
}

test('actual DreamShaper/Qwen2B profiles reproduce the old CPU refusal; owned Auto admits both without changing their estimates', async () => {
  assert.deepEqual(dream, { cpuBytes: 8 * GiB, gpuBytes: 8 * GiB }); assert.deepEqual(qwen, dream);
  const old = fixture({ owned: false });
  const first = await reserve(old.admission, 'dream', dream);
  await assert.rejects(reserve(old.admission, 'qwen', qwen), { code: 'ERR_RESOURCE_MEMORY_BUDGET', resourceKind: 'cpu',
    reservedBytes: 8 * GiB, requestedBytes: 8 * GiB, budgetBytes: 12 * GiB });
  await first.release();
  const current = fixture(), leases = [];
  leases.push(await reserve(current.admission, 'dream', dream)); leases.push(await reserve(current.admission, 'qwen', qwen));
  assert.deepEqual(current.policy.status(), { owned: true,
    cpu: { reservedBytes: 16 * GiB, budgetBytes: null, configuredBytes: null, brokerBytes: null, overBudget: false },
    gpu: { reservedBytes: 16 * GiB, budgetBytes: null, configuredBytes: null, brokerBytes: null, overBudget: false } });
  assert.equal(current.broker.reportPressure().activeLeaseCount, 4);
  for (const lease of leases) await lease.release();
  assert.equal(current.policy.status().gpu.reservedBytes, 0);
});

test('explicit16GiB GPU budget accepts equality and rejects added speech with CPU rollback', async () => {
  const f = fixture({ initial: { gpuBytes: 16 * GiB } });
  const first = await reserve(f.admission, 'dream', dream), second = await reserve(f.admission, 'qwen', qwen);
  await assert.rejects(reserve(f.admission, 'speech', speech), (error) => {
    assert.equal(error.code, 'ERR_RESOURCE_MEMORY_BUDGET'); assert.equal(error.resourceKind, 'gpu');
    assert.equal(error.reservedBytes, 16 * GiB); assert.equal(error.requestedBytes, speech.gpuBytes);
    assert.match(error.message, /estimated reserved.*requested.*configured/); return true;
  });
  assert.equal(f.policy.status().cpu.reservedBytes, 16 * GiB); assert.equal(f.broker.reportPressure().activeLeaseCount, 4);
  first.assertActive(); second.assertActive(); await first.release(); await second.release();
});

test('lowering explicit budgets preserves owners, reports over-budget and blocks new loads until cleared or released', async () => {
  const f = fixture(), first = await reserve(f.admission, 'dream', dream), second = await reserve(f.admission, 'qwen', qwen);
  f.policy.set({ cpuBytes: 4 * GiB, gpuBytes: 12 * GiB });
  first.assertActive(); second.assertActive();
  assert.equal(f.policy.status().cpu.overBudget, true); assert.equal(f.policy.status().gpu.overBudget, true);
  await assert.rejects(reserve(f.admission, 'speech', speech), { code: 'ERR_RESOURCE_MEMORY_BUDGET', resourceKind: 'cpu' });
  f.policy.set({}); assert.equal(f.policy.status().cpu.budgetBytes, null); assert.equal(f.policy.status().cpu.overBudget, false);
  const third = await reserve(f.admission, 'speech', speech);
  assert.equal(f.policy.status().cpu.reservedBytes, 16 * GiB + speech.cpuBytes);
  await first.release(); await second.release(); await third.release();
});

test('both owned caps change atomically and malformed updates preserve the previous policy', () => {
  const f = fixture({ initial: { cpuBytes: 24 * GiB, gpuBytes: 16 * GiB } });
  const previous = f.policy.status();
  for (const bad of [0, -1, NaN, Infinity, '8', {}, 0.5]) {
    assert.throws(() => f.policy.set({ cpuBytes: 4 * GiB, gpuBytes: bad })); assert.deepEqual(f.policy.status(), previous);
  }
  assert.throws(() => f.broker.setMemoryBudgets({ cpu: 4 * GiB, gpu: -1 })); assert.deepEqual(f.policy.status(), previous);
  assert.throws(() => f.broker.setMemoryBudgets({ cpu: 4 * GiB, foreign: 3 })); assert.deepEqual(f.policy.status(), previous);
  f.policy.set({ cpuBytes: 1024 * GiB, gpuBytes: 1024 * GiB });
  assert.equal(f.policy.status().gpu.budgetBytes, 1024 * GiB);
});

test('borrowed broker caps never change, while stricter local aggregate caps remain enforced', async () => {
  const f = fixture({ owned: false, initial: { gpuBytes: 8 * GiB },
    capacities: { cpu: { units: 8, memoryBytes: 24 * GiB }, gpu: { units: 8, memoryBytes: 10 * GiB } } });
  const first = await reserve(f.admission, 'first', { cpuBytes: 6 * GiB, gpuBytes: 6 * GiB });
  await assert.rejects(reserve(f.admission, 'second', { cpuBytes: 3 * GiB, gpuBytes: 3 * GiB }), {
    code: 'ERR_RESOURCE_MEMORY_BUDGET', resourceKind: 'gpu', budgetBytes: 8 * GiB });
  assert.equal(f.policy.status().cpu.reservedBytes, 6 * GiB);
  f.policy.set({ cpuBytes: 32 * GiB, gpuBytes: 32 * GiB });
  assert.equal(f.policy.status().gpu.configuredBytes, 32 * GiB); assert.equal(f.policy.status().gpu.budgetBytes, 10 * GiB);
  await assert.rejects(reserve(f.admission, 'second', { cpuBytes: 5 * GiB, gpuBytes: 5 * GiB }), {
    code: 'ERR_RESOURCE_MEMORY_BUDGET', resourceKind: 'gpu', budgetBytes: 10 * GiB });
  f.policy.set({}); assert.equal(f.broker.pools.get('gpu').memoryBytes, 10 * GiB); assert.equal(f.broker.pools.get('cpu').memoryBytes, 24 * GiB);
  await first.release();
});

test('unbounded tracking requires owner opt-in; an explicit local limit can safely bound a borrowed zero-capacity pool', async () => {
  const broker = new ResourceLeaseBroker({ capacities: { cpu: { units: 8 }, gpu: { units: 8 } } });
  assert.throws(() => new ResidentModelAdmission({ broker }), /explicit cpu memory budget/);
  const manager = { resourceBroker: broker };
  const policy = createModelMemoryBudgets({ computeManager: manager, owned: false, initial: { cpuBytes: 4 * GiB, gpuBytes: 4 * GiB } });
  const admission = new ResidentModelAdmission({ broker, ...policy.admissionOptions });
  const first = await reserve(admission, 'speech', speech); assert.equal(broker.pools.get('gpu').memoryBytes, 0);
  policy.set({}); await assert.rejects(reserve(admission, 'another', speech), /explicit cpu memory budget/);
  first.assertActive(); await first.release();
  const owner = new ResidentModelAdmission({ broker, allowUnboundedMemory: true });
  const second = await reserve(owner, 'dream', dream); await second.release();
  const uninitialized = createModelMemoryBudgets({ computeManager: {}, owned: true });
  assert.throws(() => uninitialized.set({ gpuBytes: GiB }), /not initialized/);
  assert.deepEqual(uninitialized.get(), { cpuBytes: null, gpuBytes: null });
});

test('a changed live cap is reread before GPU admission and concurrent borrowed admissions cannot bypass a tighter limit', async () => {
  const f = fixture({ owned: false, initial: { cpuBytes: 12 * GiB, gpuBytes: 12 * GiB } });
  const results = await Promise.allSettled([reserve(f.admission, 'first', dream), reserve(f.admission, 'second', qwen)]);
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(f.policy.status().cpu.reservedBytes, 8 * GiB); assert.equal(f.policy.status().gpu.reservedBytes, 8 * GiB);
  await results.find((result) => result.status === 'fulfilled').value.release();
  const request = f.broker.requestLease.bind(f.broker);
  f.broker.requestLease = (spec) => {
    const promise = request(spec);
    if (spec.resourceKind === 'cpu') f.policy.set({ cpuBytes: 12 * GiB, gpuBytes: 4 * GiB });
    return promise;
  };
  await assert.rejects(reserve(f.admission, 'changed', qwen), { code: 'ERR_RESOURCE_MEMORY_BUDGET', resourceKind: 'gpu', budgetBytes: 4 * GiB });
  assert.equal(f.policy.status().cpu.reservedBytes, 0); assert.equal(f.policy.status().gpu.reservedBytes, 0);
});

test('an invalid or asynchronous live policy never grants an unbounded allocation', async () => {
  const f = fixture(); let caps = {};
  const admission = new ResidentModelAdmission({ broker: f.broker, allowUnboundedMemory: true, getMemoryBudgets: () => caps });
  for (const invalid of [{ gpuBytes: Infinity }, { cpuBytes: -1 }, { unknown: 1 }, Promise.resolve({}), []]) {
    caps = invalid; await assert.rejects(reserve(admission, 'bad', dream), /Invalid resident memory budget/);
    assert.equal(f.broker.reportPressure().activeLeaseCount, 0);
  }
});

test('ComputeManager applies the trusted live admission policy to every service while sharing one broker', async () => {
  const manager = new ComputeManager({ enableWorkers: false, enableWebGPU: false });
  const policy = createModelMemoryBudgets({ computeManager: manager, owned: true });
  const artifactStore = { async stat() {}, async *openRead() {} };
  const options = { artifactStore, resourceEstimate: dream, baseUrl: 'https://peercompute.test/',
    runtimeAssets: { mjs: 'https://peercompute.test/ort.mjs', wasm: 'https://peercompute.test/ort.wasm' },
    admissionOptions: policy.admissionOptions };
  try {
    const first = await manager.createModelInferenceService({ ...options, resourceBudgets: policy.initialResourceBudgets(8) });
    const second = await manager.createModelInferenceService(options);
    assert.equal(first.admission.broker, second.admission.broker);
    const lease = await reserve(first.admission, 'first', dream);
    policy.set({ cpuBytes: 12 * GiB });
    await assert.rejects(reserve(second.admission, 'second', qwen), { code: 'ERR_RESOURCE_MEMORY_BUDGET', resourceKind: 'cpu' });
    policy.set({}); const another = await reserve(second.admission, 'second', qwen);
    await lease.release(); await another.release(); await first.dispose(); await second.dispose();
  } finally { await manager.destroy(); }
});

test('simulated native allocation failure retains estimates until managed worker termination acknowledges cleanup', async () => {
  const f = fixture(), previous = await reserve(f.admission, 'existing', qwen);
  const cid = CID.createV1(0x55, await sha256.digest(new Uint8Array([1]))).toString();
  const source = { model: { runtime: 'test' }, files: [] }, workers = new Map();
  let refuseTermination = true, terminations = 0;
  const compute = {
    async reserveWorkerAffinity(key) { workers.set(key, 'worker'); },
    getWorkerAffinityState(key) { return { reserved: workers.has(key), workerId: workers.get(key) }; },
    async releaseWorkerAffinity(key) { workers.delete(key); },
    async cancelTask() {},
    async terminateWorkerAffinity(key) { terminations++; if (refuseTermination) throw new Error('Worker termination not acknowledged'); workers.delete(key); },
    async submitTask(task) { task.data?.artifactPort?.close(); throw new Error('Simulated GPU allocation failed'); },
  };
  const service = new ModelInferenceService({ computeManager: compute,
    artifactStore: { async getManifest() { return source; }, async stat() { return { status: 'complete' }; }, async *openRead() {} },
    admission: f.admission, resourceEstimate: dream, runtimeAssets: {},
    runtimeDefinition: { id: 'test', terminateOnUnload: true, validateRuntimeAssets: (assets) => assets,
      validateManifest: (manifest) => ({ manifest, resourcePolicy: { minimumCpuBytes: 1, minimumGpuBytes: 1 } }) } });
  await assert.rejects(service.loadModel({ manifestCid: cid }), /cleanup is incomplete/);
  assert.equal(service.getStatus().status, 'cleanup-failed'); assert.equal(f.policy.status().gpu.reservedBytes, 16 * GiB);
  previous.assertActive(); f.policy.set({ gpuBytes: 16 * GiB });
  await assert.rejects(reserve(f.admission, 'speech', speech), { code: 'ERR_RESOURCE_MEMORY_BUDGET' });
  refuseTermination = false; await service.dispose();
  assert(terminations >= 2); assert.equal(f.policy.status().gpu.reservedBytes, 8 * GiB); assert.equal(workers.size, 0);
  previous.assertActive(); await previous.release(); assert.equal(f.policy.status().gpu.reservedBytes, 0);
});
