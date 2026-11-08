import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import { installComputeWorkerHost } from '../../src/peercompute/computeManager/workerTaskHost.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { ResidentModelAdmission } from '../../src/peercompute/serviceOrchestration/ResidentModelAdmission.js';
import { ResourceLeaseBroker } from '../../src/peercompute/serviceOrchestration/ResourceLeaseBroker.js';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';

const modelCid = CID.createV1(0x55, await sha256.digest(new Uint8Array([1]))).toString();

function setup(t, config = {}) {
  const previous = globalThis.Worker;
  const workers = [];
  class ManagedWorker {
    constructor() {
      workers.push(this);
      this.sent = [];
      this.scope = { postMessage: (data) => queueMicrotask(() => {
        if (!this.terminated) this.onmessage?.({ data });
      }) };
      installComputeWorkerHost(this.scope);
    }
    addEventListener() {}
    removeEventListener() {}
    postMessage(data, transferables) {
      this.sent.push({ data, transferables });
      if (!this.ignore) queueMicrotask(() => this.scope.onmessage({ data }));
    }
    terminate() { this.terminated = true; }
  }
  globalThis.Worker = ManagedWorker;
  const manager = new ComputeManager({ maxWorkers: 2, autoScaleWorkers: false, ...config });
  t.after(async () => {
    await manager.destroy();
    if (previous === undefined) delete globalThis.Worker;
    else globalThis.Worker = previous;
  });
  return { manager, workers };
}

test('managed worker progress retains the task and transfers only explicit ports', async (t) => {
  const { manager, workers } = setup(t);
  const reservation = await manager.reserveWorkerAffinity('model');
  const events = [];
  const channel = new MessageChannel();
  t.after(() => { channel.port1.close(); channel.port2.close(); });
  const result = await manager.submitTask({
    id: 'progress', affinityKey: 'model', requireWorker: true,
    data: { port: channel.port2 }, transferables: [channel.port2],
    onProgress(value) {
      assert.equal(manager.activeTasks.has('progress'), true);
      events.push(value);
    },
    fn: async (_data, context) => {
      context.emitProgress({ token: 'hello' });
      await new Promise((resolve) => setTimeout(resolve, 10));
      return { workerId: context.workerId, taskId: context.taskId };
    }
  });
  assert.deepEqual(events, [{ token: 'hello' }]);
  assert.equal(result.workerId, reservation.workerId);
  assert.equal(result.taskId, 'progress');
  const sent = workers.flatMap((worker) => worker.sent).find(({ data }) => data.id === 'progress');
  assert.equal(sent.transferables[0], channel.port2);
  assert.equal('onProgress' in sent.data, false);
  await manager.releaseWorkerAffinity('model');
});

test('resident reservations protect an idle worker from unrelated work', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1 });
  await manager.reserveWorkerAffinity('model');
  let finished = false;
  const queued = manager.submitTask({ id: 'ordinary', fn: () => 17 }).then((value) => { finished = true; return value; });
  await delay(10);
  assert.equal(finished, false);
  assert.equal(manager.taskQueue.length, 1);
  assert.equal(manager.getWorkerAffinityState('model').reserved, true);
  await manager.releaseWorkerAffinity('model');
  assert.equal(await queued, 17);
});

test('cooperative cancellation waits for worker cleanup and preserves residency', async (t) => {
  const { manager, workers } = setup(t, { maxWorkers: 1 });
  await manager.reserveWorkerAffinity('model');
  let started;
  const ready = new Promise((resolve) => { started = resolve; });
  const task = manager.submitTask({
    id: 'cancel', affinityKey: 'model', requireWorker: true, onProgress: started,
    fn: async (_data, { signal, emitProgress }) => {
      emitProgress('started');
      await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
      await new Promise((resolve) => setTimeout(resolve, 25));
      return 'late-result';
    }
  });
  const rejected = assert.rejects(task, (error) => error.name === 'AbortError' && !error.workerTerminated);
  await ready;
  let cancelled = false;
  const cancellation = manager.cancelTask('cancel').then((value) => { cancelled = true; return value; });
  await delay(5);
  assert.equal(cancelled, false);
  await cancellation;
  await rejected;
  assert.equal(workers[0].terminated, undefined);
  assert.ok(manager.getWorkerAffinityState('model').workerId);
  assert.equal(await manager.submitTask({ affinityKey: 'model', requireWorker: true, fn: () => 23 }), 23);
  await manager.releaseWorkerAffinity('model');
});

test('cancellation still discards late results, commit deltas and nonfatal errors', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1 });
  await manager.reserveWorkerAffinity('model');
  const worker = manager.workerAffinities.get('model'); worker.ignore = true;
  let commits = 0;
  manager.commitDelta = () => { commits++; };
  for (const [index, reply] of [
    { type: 'result', result: { value: 'too late', commitDelta: { changed: true } } },
    { type: 'error', error: 'Ordinary model input error', code: 'ERR_MODEL_INPUT' },
    { type: 'error', error: 'Cancelled', name: 'AbortError' },
  ].entries()) {
    const id = `cancel-reply-${index}`;
    const task = manager.submitTask({ id, affinityKey: 'model', requireWorker: true, fn: () => 1 });
    const rejected = assert.rejects(task, { name: 'AbortError', code: 'ERR_COMPUTE_TASK_CANCELLED' });
    const cancellation = manager.cancelTask(id);
    // Simulate a reply already in transit when cancellation reaches the worker.
    worker.onmessage({ data: { id, ...reply } });
    await Promise.all([rejected, cancellation]);
  }
  assert.equal(commits, 0);
  assert.equal(worker.terminated, undefined);
  worker.ignore = false;
  assert.equal(await manager.submitTask({ affinityKey: 'model', requireWorker: true, fn: () => 23 }), 23);
  await manager.releaseWorkerAffinity('model');
});

test('cancelled resident inference preserves fatal GPU/native errors through the worker protocol and acknowledges cleanup before releasing leases', async (t) => {
  for (const code of ['ERR_MODEL_GPU_OUT_OF_MEMORY', 'ERR_MODEL_GPU', 'ERR_MODEL_RUNTIME', 'MODEL_DISPOSE_FAILED']) {
    await t.test(code, async (t) => {
      const { manager } = setup(t, { maxWorkers: 1 });
      const broker = new ResourceLeaseBroker({ capacities: {
        cpu: { units: 1, memoryBytes: 1024 }, gpu: { units: 1, memoryBytes: 2048 },
      } });
      const message = `Model session lost: synthetic ${code}`;
      // A trusted synthetic runtime exercises the real worker host, error
      // serialization, manager cancellation and service/admission lifecycle.
      const moduleUrl = `data:text/javascript,${encodeURIComponent(`
        export async function handleModelTask(data, context) {
          if (data.command === 'load') {
            data.artifactPort.close();
            return { sessionId: data.sessionId, status: 'ready' };
          }
          if (data.command === 'generate') {
            context.emitProgress({ type: 'started' });
            await new Promise(resolve => context.signal.addEventListener('abort', resolve, { once: true }));
            throw Object.assign(new Error(${JSON.stringify(message)}), { code: ${JSON.stringify(code)} });
          }
          return { status: 'unloaded' };
        }
      `)}`;
      const service = new ModelInferenceService({ computeManager: manager,
        artifactStore: { async stat() { return { status: 'complete' }; }, async *openRead() {} },
        admission: new ResidentModelAdmission({ broker }), resourceEstimate: { cpuBytes: 1024, gpuBytes: 2048 },
        runtimeAssets: {}, moduleUrl,
        runtimeDefinition: { id: 'test', validateRuntimeAssets: (assets) => assets,
          validateManifest: (manifest) => ({ manifest, resourcePolicy: { minimumCpuBytes: 1, minimumGpuBytes: 1 } }) },
      });
      manager.modelServices.add(service);
      await service.loadModel({ sessionId: 'cancel-fatal', manifestCid: modelCid,
        manifest: { model: { runtime: 'test' }, files: [] } });
      const affinity = service.session.affinityKey;
      const worker = manager.workerAffinities.get(affinity);
      const terminate = worker.terminate.bind(worker);
      let acknowledged = false;
      const failCleanup = code === 'ERR_MODEL_RUNTIME';
      worker.terminate = () => {
        assert.equal(service.getStatus().status, 'lost', 'the host must not advertise ready during cleanup');
        assert.equal(broker.reportPressure().activeLeaseCount, 2, 'both reservations survive until worker termination');
        assert.equal(manager.getWorkerAffinityState(affinity).reserved, true);
        if (failCleanup) throw new Error('Synthetic worker termination failure');
        terminate(); acknowledged = true;
      };
      const controller = new AbortController();
      let started;
      const ready = new Promise((resolve) => { started = resolve; });
      const request = service.generate({ requestId: 'fatal', prompt: 'A benign prompt', signal: controller.signal,
        onProgress: started });
      const rejected = assert.rejects(request, (error) => {
        const original = failCleanup ? error.errors?.[0] : error;
        assert.equal(original?.code, code);
        assert.equal(original?.message, message);
        assert.notEqual(original?.name, 'AbortError');
        return true;
      });
      await ready;
      const queued = assert.rejects(service.generate({ requestId: 'queued', prompt: 'Another benign prompt' }));
      controller.abort('Caller cancelled');
      await Promise.all([rejected, queued]);
      assert.equal(controller.signal.aborted, true);
      if (failCleanup) {
        assert.equal(service.getStatus().status, 'cleanup-failed');
        assert.equal(broker.reportPressure().activeLeaseCount, 2);
        assert.ok(manager.getWorkerAffinityState(affinity).workerId);
        await assert.rejects(service.generate({ prompt: 'Must not run' }), /not ready/);
        worker.terminate = terminate;
        await service.dispose();
      } else {
        assert.equal(acknowledged, true);
        assert.equal(service.getStatus().status, 'idle');
        await service.dispose();
      }
      assert.equal(broker.reportPressure().activeLeaseCount, 0);
      assert.equal(manager.getWorkerAffinityState(affinity).reserved, false);
      assert.equal(manager.activeTasks.size, 0);
    });
  }
});

test('hard cancellation terminates only the owning worker before releasing the task', async (t) => {
  const { manager, workers } = setup(t);
  await manager.reserveWorkerAffinity('model');
  const owned = manager.workerAffinities.get('model');
  owned.ignore = true;
  const task = manager.submitTask({ id: 'hung', affinityKey: 'model', requireWorker: true, fn: () => 1 });
  const rejected = assert.rejects(task, (error) => error.name === 'AbortError' && error.workerTerminated);
  await delay(0);
  await manager.cancelTask('hung', { timeoutMs: 5 });
  await rejected;
  assert.equal(owned.terminated, true);
  assert.equal(workers.filter((worker) => worker.terminated).length, 1);
  assert.deepEqual(manager.getWorkerAffinityState('model'), { affinityKey: 'model', reserved: true, workerId: null });
  await assert.rejects(manager.reserveWorkerAffinity('model'), (error) => error.workerTerminated);
  await manager.releaseWorkerAffinity('model');
});

test('partial model failure can terminate a reserved worker and reject its queued work', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1 });
  await manager.reserveWorkerAffinity('model');
  const owned = manager.workerAffinities.get('model');
  owned.ignore = true;
  const first = manager.submitTask({ id: 'first', affinityKey: 'model', requireWorker: true, fn: () => 1 });
  const second = manager.submitTask({ id: 'second', affinityKey: 'model', requireWorker: true, fn: () => 2 });
  const failures = [first, second].map((task) => assert.rejects(task, (error) => error.workerTerminated));
  await delay(0);
  await assert.rejects(manager.submitTask({ id: 'first', fn: () => 3 }), /already active/);
  await manager.terminateWorkerAffinity('model', { reason: 'Partial ORT allocation' });
  await Promise.all(failures);
  assert.equal(owned.terminated, true);
  assert.equal(manager.getWorkerAffinityState('model').reserved, true);
  await manager.releaseWorkerAffinity('model');
  assert.equal(await manager.submitTask({ fn: () => 9 }), 9);
});

test('failed termination preserves the reserved worker for explicit cleanup retry', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1 });
  await manager.reserveWorkerAffinity('model');
  const owned = manager.workerAffinities.get('model');
  const original = owned.terminate;
  owned.terminate = () => { throw new Error('termination failed'); };
  await assert.rejects(manager.terminateWorkerAffinity('model'), /termination failed/);
  assert.ok(manager.getWorkerAffinityState('model').workerId);
  owned.terminate = original;
  await manager.terminateWorkerAffinity('model');
  await manager.releaseWorkerAffinity('model');
});

test('per-task worker requirement fails closed without workers', async (t) => {
  const { manager } = setup(t);
  delete globalThis.Worker;
  await assert.rejects(manager.submitTask({ requireWorker: true, fn: () => 'inline forbidden' }),
    (error) => error.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE');
  assert.equal(manager.getStats().inlineTasksCompleted, 0);
});

test('queued resident work cannot migrate after its worker fails', async (t) => {
  const { manager } = setup(t, { maxWorkers: 2 });
  await manager.reserveWorkerAffinity('model');
  const owned = manager.workerAffinities.get('model'); owned.ignore = true;
  const tasks = ['active', 'queued'].map((id) => manager.submitTask({ id, affinityKey: 'model', requireWorker: true, fn: () => 'must not migrate' }));
  const failures = tasks.map((task) => assert.rejects(task, (error) => error.workerTerminated));
  await delay(0);
  owned.onerror(new Error('Worker lost'));
  await Promise.all(failures);
  assert.equal(manager.getWorkerAffinityState('model').workerId, null);
  assert.equal(manager.taskQueue.length, 0);
  await manager.releaseWorkerAffinity('model');
});

test('failed hard cancellation rejects its acknowledgment and permits a cleanup retry', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1 });
  await manager.reserveWorkerAffinity('model');
  const owned = manager.workerAffinities.get('model'); owned.ignore = true;
  const terminate = owned.terminate;
  owned.terminate = () => { throw new Error('simulated termination failure'); };
  let settled = false;
  const task = manager.submitTask({ id: 'hung-retry', affinityKey: 'model', requireWorker: true, fn: () => 1 });
  const failed = assert.rejects(task, (error) => error.workerTerminated).then(() => { settled = true; });
  await delay(0);
  await assert.rejects(manager.cancelTask('hung-retry', { timeoutMs: 5 }), (error) => error.code === 'ERR_COMPUTE_WORKER_TERMINATION_FAILED' && !error.workerTerminated);
  assert.equal(settled, false);
  assert.equal(manager.workerAffinities.get('model'), owned);
  owned.terminate = terminate;
  await manager.cancelTask('hung-retry', { timeoutMs: 5 });
  await failed;
  await manager.releaseWorkerAffinity('model');
});

test('worker failure never acknowledges disposal when terminate throws', async (t) => {
  for (const requireWorkers of [false, true]) {
    const { manager } = setup(t, { maxWorkers: 1, requireWorkers });
    await manager.reserveWorkerAffinity(`model-${requireWorkers}`);
    const owned = manager.workerAffinities.get(`model-${requireWorkers}`); owned.ignore = true;
    const terminate = owned.terminate;
    owned.terminate = () => { throw new Error('termination failed'); };
    const task = manager.submitTask({ id: 'failure', affinityKey: `model-${requireWorkers}`, requireWorker: true, fn: () => 1 });
    const failed = assert.rejects(task, (error) => error.workerTerminated === false);
    await delay(0); owned.onerror(new Error('Worker failure')); await failed;
    assert.ok(manager.workers.includes(owned));
    assert.equal(manager.workerAffinities.get(`model-${requireWorkers}`), owned);
    owned.terminate = terminate;
    await manager.terminateWorkerAffinity(`model-${requireWorkers}`);
    await manager.releaseWorkerAffinity(`model-${requireWorkers}`);
  }
});

test('per-task required worker readiness has a deadline in an optional pool', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1, workerBootstrapTimeoutMs: 5 });
  globalThis.Worker = class { addEventListener() {} postMessage() {} terminate() {} };
  await assert.rejects(manager.submitTask({ requireWorker: true, fn: () => 'forbidden' }), /readiness timed out/);
  assert.equal(manager.taskQueue.length, 0);
});

test('destroy serializes service disposal and rejects new work while cleanup is pending', async (t) => {
  const { manager } = setup(t, { maxWorkers: 1 });
  await manager.initialize();
  let finish; const cleanup = new Promise((resolve) => { finish = resolve; });
  let calls = 0;
  manager.modelServices.add({ dispose() { calls++; return cleanup; } });
  const first = manager.destroy(), second = manager.destroy();
  await assert.rejects(manager.submitTask({ requireWorker: true, fn: () => 42 }), /shutting down/);
  await assert.rejects(manager.reserveWorkerAffinity('late'), /shutting down/);
  await assert.rejects(manager.createModelInferenceService(), /shutting down/);
  assert.equal(calls, 1);
  finish(); await Promise.all([first, second]);
  assert.equal(manager.initialized, false);
});
