import test from 'node:test';
import assert from 'node:assert/strict';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { SF3D_MODEL_CATALOG } from '../../src/peercompute/artifacts/sf3dModelCatalog.js';
import { sf3dRuntimeDefinition, SF3D_RESOURCE_POLICY } from '../../src/peercompute/inference/sf3dRuntimeDefinition.js';

const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const catalog = Object.values(SF3D_MODEL_CATALOG)[0];
const manifest = { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(catalog.model),
  files: catalog.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) };
const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([200, 100, 50, 255]) };
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

// Exercise the real host lifecycle and trusted SF3D admission, with a controlled
// worker boundary. This fixture does not claim GPU inference or model loading.
async function fixture(t, { destructiveAbort = true } = {}) {
  const events = [], started = deferred(), stopping = deferred(), running = new Map(), ports = [];
  let reserved = false, workerId = null;
  const state = { stopGate: null, stopFailure: null, admissionCheck: null, active: null };
  const computeManager = {
    async reserveWorkerAffinity() { reserved = true; workerId = 17; },
    getWorkerAffinityState() { return { reserved, workerId }; },
    async releaseWorkerAffinity() { events.push('release-affinity'); reserved = false; workerId = null; },
    async terminateWorkerAffinity() {
      events.push('stop-start'); stopping.resolve();
      if (state.stopFailure) throw state.stopFailure;
      await state.stopGate;
      workerId = null; for (const port of ports) port.close(); events.push('stop-ack');
    },
    submitTask(task) {
      events.push(`submit:${task.data.command}`);
      if (task.data.command === 'load') { ports.push(task.data.artifactPort); return Promise.resolve({ status: 'ready', workerId: 17 }); }
      assert.equal(task.data.command, 'generate');
      const work = deferred(), abort = new DOMException('SF3D device retired by cancellation', 'AbortError');
      state.active = { ...work, abort };
      task.signal.addEventListener('abort', () => work.reject(abort), { once: true });
      running.set(task.id, work.promise);
      void work.promise.finally(() => running.delete(task.id)).catch(() => {});
      started.resolve(); return work.promise;
    },
    async cancelTask(id) { events.push('cancel-worker'); await running.get(id)?.catch(() => {}); },
  };
  const service = new ModelInferenceService({ computeManager,
    artifactStore: { async getManifest() { return manifest; }, async stat() {}, async *openRead() {} },
    admission: { async acquire() { return {
      assertActive() { return state.admissionCheck?.(); },
      async release() { events.push('release-admission'); },
    }; } },
    runtimeDefinition: destructiveAbort ? sf3dRuntimeDefinition : { ...sf3dRuntimeDefinition, terminateOnGenerationAbort: undefined },
    runtimeAssets: { mjs: 'https://peercompute.test/assets/ort-wasm-simd-threaded.asyncify.mjs',
      wasm: 'https://peercompute.test/assets/ort-wasm-simd-threaded.asyncify.wasm' },
    resourceEstimate: { cpuBytes: SF3D_RESOURCE_POLICY.minimumCpuBytes, gpuBytes: SF3D_RESOURCE_POLICY.minimumGpuBytes },
    baseUrl: 'https://peercompute.test/worker.js' });
  t.after(async () => {
    state.stopFailure = null; state.stopGate = null; state.admissionCheck = null;
    state.active?.resolve({ text: 'cleanup' }); await service.dispose();
    for (const port of ports) port.close();
  });
  await service.loadModel({ sessionId: 'cancel-fixture', manifestCid: cid });
  return { service, events, state, started: started.promise, stopping: stopping.promise };
}

test('active SF3D abort withdraws readiness and rejects queued work before acknowledged cleanup releases residency', async (t) => {
  assert.equal(sf3dRuntimeDefinition.terminateOnGenerationAbort, true);
  const f = await fixture(t), stop = deferred(); f.state.stopGate = stop.promise;
  const active = f.service.generate({ requestId: 'active', image }); await f.started;
  const original = f.state.active.abort;
  const rejected = assert.rejects(active, error => error === original && error.name === 'AbortError');
  const queued = f.service.generate({ requestId: 'queued', image });
  const queueRejected = assert.rejects(queued, { name: 'AbortError' });
  const cancelled = f.service.cancel('active'); await f.stopping; await queueRejected;
  assert.equal(f.service.getStatus().status, 'lost');
  assert(!f.events.includes('release-admission')); assert(!f.events.includes('release-affinity'));
  await assert.rejects(f.service.generate({ requestId: 'late', image }), /not ready/);
  assert.equal(f.events.filter(event => event === 'submit:generate').length, 1);
  stop.resolve(); await rejected; assert.equal(await cancelled, true);
  assert.equal(f.service.getStatus().status, 'idle'); assert.equal(f.service.getStatus().manifestCid, null);
  assert(f.events.indexOf('stop-ack') < f.events.indexOf('release-admission'));
  assert(f.events.indexOf('release-admission') < f.events.indexOf('release-affinity'));
  assert.equal(f.events.filter(event => event === 'release-admission').length, 1);
  await f.service.loadModel({ sessionId: 'reloaded', manifestCid: cid });
  assert.equal(f.service.getStatus().status, 'ready');
});

test('cancelling queued SF3D work neither dispatches it nor retires the active session', async (t) => {
  const f = await fixture(t), active = f.service.generate({ requestId: 'active', image }); await f.started;
  const queued = f.service.generate({ requestId: 'queued', image });
  const rejected = assert.rejects(queued, { name: 'AbortError' });
  assert.equal(await f.service.cancel('queued'), true); await rejected;
  assert.equal(f.service.getStatus().status, 'ready'); assert.equal(f.service.getStatus().activeRequestId, 'active');
  assert(!f.events.includes('stop-start')); assert(!f.events.includes('cancel-worker'));
  assert(!f.events.includes('release-admission'));
  f.state.active.resolve({ text: 'original request completes' });
  assert.equal((await active).text, 'original request completes');
  assert.equal(f.events.filter(event => event === 'submit:generate').length, 1);
});

test('pre-dispatch SF3D cancellation keeps its healthy resident model', async (t) => {
  const f = await fixture(t), checking = deferred(), gate = deferred();
  f.state.admissionCheck = () => { checking.resolve(); return gate.promise; };
  const active = f.service.generate({ requestId: 'before-dispatch', image });
  const rejected = assert.rejects(active, { name: 'AbortError' }); await checking.promise;
  await f.service.cancel('before-dispatch'); await rejected;
  assert.equal(f.service.getStatus().status, 'ready');
  assert(!f.events.includes('submit:generate')); assert(!f.events.includes('stop-start'));
  assert(!f.events.includes('release-admission')); gate.resolve();
});

test('abort cleanup failure quarantines admission until an explicit successful unload', async (t) => {
  const f = await fixture(t); f.state.stopFailure = new Error('Worker stop was not acknowledged');
  const active = f.service.generate({ requestId: 'active', image }); await f.started;
  const rejected = assert.rejects(active, error => error instanceof AggregateError
    && error.errors[0] === f.state.active.abort && error.errors[1] === f.state.stopFailure);
  await f.service.cancel('active'); await rejected;
  assert.equal(f.service.getStatus().status, 'cleanup-failed');
  assert(!f.events.includes('release-admission')); assert(!f.events.includes('release-affinity'));
  await assert.rejects(f.service.generate({ image }), /not ready/);
  await assert.rejects(f.service.loadModel({ manifestCid: cid }), /Unload/);
  f.state.stopFailure = null; await f.service.unloadModel();
  assert.equal(f.service.getStatus().status, 'idle');
  assert.equal(f.events.filter(event => event === 'release-admission').length, 1);
  assert(f.events.indexOf('stop-ack') < f.events.indexOf('release-admission'));
});

test('ordinary AbortError leaves reusable runtimes resident unless they opt into retirement', async (t) => {
  const f = await fixture(t, { destructiveAbort: false });
  const active = f.service.generate({ requestId: 'active', image }); await f.started;
  const rejected = assert.rejects(active, error => error === f.state.active.abort);
  await f.service.cancel('active'); await rejected;
  assert.equal(f.service.getStatus().status, 'ready');
  assert(!f.events.includes('stop-start')); assert(!f.events.includes('release-admission'));
});
