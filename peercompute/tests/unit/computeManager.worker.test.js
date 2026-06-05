import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';

const fixtureModuleUrl = new URL('../fixtures/computeManagerWorkerFixture.js', import.meta.url).toString();

test('ComputeManager bootstraps workers with module worker URLs', async (t) => {
  const originalWorker = globalThis.Worker;
  const created = [];

  class FakeWorker {
    constructor(url, options) {
      this.url = String(url);
      this.options = options;
      this.listeners = new Map();
      created.push(this);
    }

    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }

    postMessage() {}

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = FakeWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ maxWorkers: 1 });
  await manager.initialize();

  assert.equal(created.length, 1);
  assert.equal(created[0].options?.type, 'module');
  assert.match(created[0].url, /computeWorker\.js$/);

  const configured = new ComputeManager({
    maxWorkers: 1,
    workerBootstrapURL: '/assets/peercomputeComputeWorker.js'
  });
  await configured.initialize();

  assert.equal(created.length, 2);
  assert.equal(created[1].options?.type, 'module');
  assert.equal(created[1].url, '/assets/peercomputeComputeWorker.js');
});

test('ComputeManager falls back inline when a worker fails after dispatch', async (t) => {
  const originalWorker = globalThis.Worker;
  let createdWorker = null;

  class FakeWorker {
    constructor() {
      this.listeners = new Map();
      createdWorker = this;
    }

    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }

    postMessage(message) {
      this.lastMessage = message;
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = FakeWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ maxWorkers: 1 });
  const resultPromise = manager.submitTask({
    module: fixtureModuleUrl,
    exportName: 'sumTask',
    data: {
      a: 7,
      b: 5
    }
  });

  await Promise.resolve();
  assert.ok(createdWorker);
  assert.equal(createdWorker.lastMessage?.type, 'run');
  createdWorker.onerror({ message: 'worker bootstrap failed' });

  const result = await resultPromise;
  assert.equal(result, 12);
  assert.equal(createdWorker.terminated, true);
  assert.equal(manager.workers.length, 0);
  const stats = manager.getStats();
  assert.equal(stats.workerUtilization.schema, 'peercompute.compute.worker-utilization.v0');
  assert.equal(stats.workerUtilization.inline.submitted, 1);
  assert.equal(stats.workerUtilization.inline.completed, 1);
  assert.equal(stats.workerUtilization.workers.length, 1);
  assert.equal(stats.workerUtilization.workers[0].executorId, 'worker-1');
  assert.equal(stats.workerUtilization.workers[0].status, 'retired');
  assert.equal(stats.workerUtilization.workers[0].submitted, 1);
  assert.equal(stats.workerUtilization.workers[0].abandoned, 1);
  assert.equal(stats.workerUtilization.workers[0].activeTaskCount, 0);
});

test('ComputeManager keeps affinity-key tasks on the assigned worker', async (t) => {
  const originalWorker = globalThis.Worker;
  const created = [];

  class FakeWorker {
    constructor() {
      this.messages = [];
      created.push(this);
    }

    addEventListener() {}

    postMessage(message) {
      this.messages.push(message);
      this.lastMessage = message;
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = FakeWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ maxWorkers: 2 });
  await manager.initialize();
  assert.equal(created.length, 2);

  const first = manager.submitTask({
    fn: () => 'a1',
    affinityKey: 'scale:0:shard:0'
  });
  await Promise.resolve();
  const firstWorker = created.find((worker) => worker.lastMessage?.id);
  assert.equal(firstWorker, created[0]);
  manager._handleWorkerMessage(firstWorker, {
    type: 'result',
    id: firstWorker.lastMessage.id,
    result: 'a1'
  });
  assert.equal(await first, 'a1');

  const second = manager.submitTask({
    fn: () => 'a2',
    affinityKey: 'scale:0:shard:0'
  });
  await Promise.resolve();
  assert.equal(created[0].messages.length, 2);
  assert.equal(created[1].messages.length, 0);
  manager._handleWorkerMessage(created[0], {
    type: 'result',
    id: created[0].lastMessage.id,
    result: 'a2'
  });
  assert.equal(await second, 'a2');

  const third = manager.submitTask({
    fn: () => 'b1',
    affinityKey: 'scale:1:shard:0'
  });
  await Promise.resolve();
  assert.equal(created[1].messages.length, 1);
  manager._handleWorkerMessage(created[1], {
    type: 'result',
    id: created[1].lastMessage.id,
    result: 'b1'
  });
  assert.equal(await third, 'b1');
  assert.equal(manager.getCapabilities().affinityCount, 2);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 3);
  assert.equal(stats.totalTasksCompleted, 3);
  assert.equal(stats.workerTasksCompleted, 3);
  assert.equal(stats.inlineTasksCompleted, 0);
  assert.equal(stats.byRuntime.js.completed, 3);
  assert.equal(stats.byTaskFamily.scale.submitted, 3);
  assert.equal(stats.byTaskFamily.scale.completed, 3);
  assert.equal(stats.workerUtilization.schema, 'peercompute.compute.worker-utilization.v0');
  assert.equal(stats.workerUtilization.inline.completed, 0);
  assert.equal(stats.workerUtilization.summary.workerCount, 2);
  assert.equal(stats.workerUtilization.summary.totalCompleted, 3);
  assert.equal(stats.workerUtilization.summary.activeTaskCount, 0);
  assert.equal(stats.workerUtilization.workers.length, 2);
  assert.equal(stats.workerUtilization.workers[0].executorId, 'worker-1');
  assert.equal(stats.workerUtilization.workers[0].submitted, 2);
  assert.equal(stats.workerUtilization.workers[0].completed, 2);
  assert.equal(stats.workerUtilization.workers[0].byRuntime.js.completed, 2);
  assert.equal(stats.workerUtilization.workers[0].byTaskFamily.scale.completed, 2);
  assert.equal(stats.workerUtilization.workers[1].executorId, 'worker-2');
  assert.equal(stats.workerUtilization.workers[1].submitted, 1);
  assert.equal(stats.workerUtilization.workers[1].completed, 1);
  assert.equal(stats.workerUtilization.workers[1].byRuntime.js.completed, 1);
  assert.equal(stats.workerUtilization.workers[1].byTaskFamily.scale.completed, 1);
});

test('ComputeManager includes worker execution metadata in task envelopes', async (t) => {
  const originalWorker = globalThis.Worker;
  const created = [];

  class FakeWorker {
    constructor() {
      this.messages = [];
      created.push(this);
    }

    addEventListener() {}

    postMessage(message) {
      this.messages.push(message);
      this.lastMessage = message;
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = FakeWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ maxWorkers: 1 });
  const resultPromise = manager.submitTask({
    taskFamily: 'worker-envelope-fixture',
    fn: () => ({ value: { ok: true } }),
    returnEnvelope: true
  });

  await Promise.resolve();
  const worker = created[0];
  assert.equal(worker.lastMessage?.type, 'run');
  manager._handleWorkerMessage(worker, {
    type: 'result',
    id: worker.lastMessage.id,
    result: {
      value: { ok: true }
    }
  });

  const result = await resultPromise;
  assert.deepEqual(result.value, { ok: true });
  assert.equal(result.computeExecution.schema, 'peercompute.compute.task-execution.v0');
  assert.equal(result.computeExecution.executionMode, 'worker');
  assert.equal(result.computeExecution.executorId, 'worker-1');
  assert.equal(result.computeExecution.workerId, 'worker-1');
  assert.equal(result.workerId, 'worker-1');
});

test('ComputeManager resizes workers and estimates workload budget from resource profile', async (t) => {
  const originalWorker = globalThis.Worker;
  const created = [];

  class FakeWorker {
    constructor() {
      this.messages = [];
      created.push(this);
    }

    addEventListener() {}

    postMessage(message) {
      this.messages.push(message);
      this.lastMessage = message;
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = FakeWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    minWorkers: 1,
    targetWorkers: 1,
    maxWorkers: 4,
    autoScaleWorkers: false,
    resourceProfile: {
      tier: 'workstation',
      cpuCores: 16,
      deviceMemoryGB: 32,
      gpuAvailable: true
    }
  });
  await manager.initialize();
  assert.equal(manager.getCapabilities().workers, 1);
  assert.equal(manager.getCapabilities().workerPoolRevision, 0);
  assert.equal(manager.getResourceProfile().tier, 'workstation');

  manager.resizeWorkers(3);
  assert.equal(manager.getCapabilities().workers, 3);
  assert.equal(manager.getCapabilities().workerPoolRevision, 1);
  assert.equal(manager.getCapabilities().lastWorkerResize.reason, 'manual');
  assert.equal(manager.getCapabilities().lastWorkerResize.previousTargetWorkers, 1);
  assert.equal(manager.getCapabilities().lastWorkerResize.targetWorkers, 3);
  assert.equal(manager.getCapabilities().workerAutoScaleHold.active, true);
  assert.equal(manager.getCapabilities().workerAutoScaleHold.reason, 'manual');
  assert.equal(created.length, 3);

  manager.resizeWorkers(1);
  assert.equal(manager.getCapabilities().workers, 1);
  assert.equal(created.filter((worker) => worker.terminated).length, 2);
  assert.equal(manager.getCapabilities().workerRetirements, 2);
  assert.equal(manager.getCapabilities().workerPoolRevision, 2);
  assert.equal(manager.getStats().workerPoolRevision, 2);
  assert.equal(manager.getStats().workerResizeHistory.length, 2);
  assert.equal(manager.getStats().workerUtilization.summary.activeWorkerCount, 1);
  assert.equal(manager.getStats().workerUtilization.summary.retiredWorkerCount, 2);

  const budget = manager.estimateWorkloadBudget({
    itemName: 'particles',
    baseItems: 4096,
    minItems: 1024,
    maxItems: 16384,
    itemStrideBytes: 32,
    layerCount: 2
  });
  assert.equal(budget.schema, 'peercompute.compute.workload-budget.v0');
  assert.equal(budget.resourceProfile.tier, 'workstation');
  assert.equal(budget.itemName, 'particles');
  assert.equal(budget.itemCount, 2048);
  assert.equal(budget.capacity.schema, 'peercompute.compute.capacity-budget.v0');
  assert.equal(budget.capacity.budgetScale, 0.25);
  assert.equal(budget.workerCount, 1);
  assert.equal(budget.shardsPerLayer, 1);

  const capped = new ComputeManager({
    minWorkers: 1,
    targetWorkers: 2,
    maxWorkers: 4,
    autoScaleWorkers: false,
    resourceProfile: {
      tier: 'workstation',
      cpuCores: 16,
      deviceMemoryGB: 32,
      memoryBudgetMB: 1,
      gpuMemoryBudgetMB: 8,
      gpuAvailable: true,
      gpuLimits: {
        maxBufferSize: 4096,
        maxStorageBufferBindingSize: 4096
      }
    }
  });
  const cappedProfile = capped.getResourceProfile();
  assert.equal(cappedProfile.gpuLimits.maxBufferSize, 4096);
  assert.equal(cappedProfile.memoryBudgetMB, 1);
  const cappedBudget = capped.estimateWorkloadBudget({
    itemName: 'particles',
    baseItems: 4096,
    minItems: 16,
    maxItems: 16384,
    itemStrideBytes: 32,
    memoryFraction: 1,
    layerCount: 1
  });
  assert.equal(cappedBudget.effectiveMaxItems, 128);
  assert.equal(cappedBudget.itemCount, 128);
  assert.equal(cappedBudget.capacity.gpuMaxItems, 128);
  assert.equal(cappedBudget.capacity.gpuLimits.maxStorageBufferBindingSize, 4096);

  manager.config.autoScaleWorkers = true;
  manager.workerPolicy.autoScale = true;
  manager.workerPolicy.scaleUpQueueDepth = 0;
  manager.resizeWorkers(1, { reason: 'demo-api' });
  manager.taskQueue.push({ id: 'queued-for-pressure' });
  manager._maybeScaleForQueue();
  assert.equal(manager.getCapabilities().targetWorkers, 1);
  assert.equal(manager.getCapabilities().workerAutoScaleHold.active, true);
  assert.equal(manager.getCapabilities().workerAutoScaleHold.reason, 'demo-api');
  manager.workerAutoScaleHoldUntil = 0;
  manager._maybeScaleForQueue();
  assert.equal(manager.getCapabilities().targetWorkers, 2);
});

test('ComputeManager revives retained target workers before inline fallback', async (t) => {
  const originalWorker = globalThis.Worker;
  const created = [];

  class FakeWorker {
    constructor() {
      this.messages = [];
      created.push(this);
    }

    addEventListener() {}

    postMessage(message) {
      this.messages.push(message);
      this.lastMessage = message;
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = FakeWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    minWorkers: 0,
    targetWorkers: 2,
    maxWorkers: 2,
    autoScaleWorkers: false
  });
  await manager.initialize();
  assert.equal(manager.getCapabilities().workers, 2);

  for (const worker of [...manager.workers]) {
    manager._removeWorker(worker);
  }
  assert.equal(manager.getCapabilities().workers, 0);
  assert.equal(manager.getCapabilities().targetWorkers, 2);
  assert.equal(manager.getStats().workerUtilization.summary.retiredWorkerCount, 2);

  const resultPromise = manager.submitTask({
    module: fixtureModuleUrl,
    exportName: 'sumTask',
    data: {
      a: 4,
      b: 5
    }
  });

  await Promise.resolve();
  const revivedWorker = created.find((worker) => !worker.terminated && worker.lastMessage?.id);
  assert.ok(revivedWorker);
  assert.equal(manager.getCapabilities().workers, 2);
  assert.equal(manager.getCapabilities().lastWorkerResize.reason, 'task-demand');
  assert.equal(manager.getStats().workerUtilization.summary.retiredWorkerCount, 2);

  manager._handleWorkerMessage(revivedWorker, {
    type: 'result',
    id: revivedWorker.lastMessage.id,
    result: 9
  });

  const result = await resultPromise;
  assert.equal(result, 9);
  const stats = manager.getStats();
  assert.equal(stats.workerTasksCompleted, 1);
  assert.equal(stats.inlineTasksCompleted, 0);
  assert.equal(stats.workerUtilization.summary.activeWorkerCount, 2);
});
