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

test('ComputeManager requires a real worker bootstrap only when configured', async (t) => {
  const originalWorker = globalThis.Worker;
  class ReadyWorker {
    constructor() {
      queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
    }

    addEventListener() {}

    postMessage() {}

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = ReadyWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    maxWorkers: 1,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 50
  });
  await manager.initialize();
  const requirement = manager.getCapabilities().workerRequirement;
  assert.equal(requirement.required, true);
  assert.equal(requirement.status, 'ready');
  assert.equal(requirement.readyWorkerCount, 1);
});

test('ComputeManager fails closed when a required worker cannot be created', async (t) => {
  const originalWorker = globalThis.Worker;
  delete globalThis.Worker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ requireWorkers: true });
  await assert.rejects(
    manager.initialize(),
    (error) => error?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
  );
  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
  await assert.rejects(
    manager.submitTask({ fn: () => 'must-not-run' }),
    (error) => error?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
  );
});

test('ComputeManager validates direct and task-graph payloads before worker initialization', async (t) => {
  const originalWorker = globalThis.Worker;
  let constructions = 0;

  globalThis.Worker = class CountingWorker {
    constructor() {
      constructions += 1;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    maxWorkers: 1,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 10
  });
  await assert.rejects(
    manager.submitTask({ data: { invalid: true } }),
    /JavaScript tasks must provide fn or module/
  );
  await assert.rejects(
    manager.submitTaskGraph({
      graphId: 'invalid-before-worker-bootstrap',
      nodes: [{ id: 'invalid', task: { data: { invalid: true } } }]
    }),
    /JavaScript tasks must provide fn or module/
  );

  assert.equal(constructions, 0);
  assert.equal(manager.initialized, false);
  assert.equal(manager.getStats().totalTasksSubmitted, 0);
});

test('ComputeManager preserves optional inline fallback when Worker construction throws', async (t) => {
  const originalWorker = globalThis.Worker;
  globalThis.Worker = class ThrowingWorker {
    constructor() {
      throw new Error('optional worker constructor failed');
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ maxWorkers: 1 });
  assert.equal(await manager.submitTask({ fn: () => 7 }), 7);
  assert.equal(manager.getCapabilities().workerRequirement.status, 'not-required');
  assert.ok(manager.getCapabilities().workerSpawnFailures >= 1);
  assert.equal(manager.getStats().inlineTasksCompleted, 1);
});

test('ComputeManager reports and preserves a required Worker constructor failure', async (t) => {
  const originalWorker = globalThis.Worker;
  const cause = new Error('required worker constructor failed');
  globalThis.Worker = class ThrowingWorker {
    constructor() {
      throw cause;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({ maxWorkers: 1, requireWorkers: true });
  await assert.rejects(manager.initialize(), (error) => {
    assert.equal(error.code, 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE');
    assert.equal(error.reason, 'constructing a browser worker threw');
    assert.equal(error.cause, cause);
    return true;
  });
  assert.equal(manager.initialized, false);
  assert.equal(manager.workers.length, 0);
  assert.equal(manager.getCapabilities().workerSpawnFailures, 1);
});

test('ComputeManager immediately tears down a partial pool on constructor failure', async (t) => {
  const originalWorker = globalThis.Worker;
  let constructionCount = 0;
  let firstWorker = null;
  const cause = new Error('second required worker constructor failed');

  globalThis.Worker = class PartiallyConstructedPoolWorker {
    constructor() {
      constructionCount += 1;
      if (constructionCount === 2) throw cause;
      firstWorker = this;
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    minWorkers: 2,
    targetWorkers: 2,
    maxWorkers: 2,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 1000
  });
  await assert.rejects(manager.initialize(), (error) => {
    assert.equal(error.code, 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE');
    assert.equal(error.reason, 'constructing a browser worker threw');
    assert.equal(error.cause, cause);
    return true;
  });
  assert.equal(constructionCount, 2);
  assert.equal(firstWorker.terminated, true);
  assert.equal(manager.workers.length, 0);
});

test('ComputeManager terminates an unacknowledged required worker after handshake timeout', async (t) => {
  const originalWorker = globalThis.Worker;
  let createdWorker = null;

  globalThis.Worker = class HangingWorker {
    constructor() {
      createdWorker = this;
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    maxWorkers: 1,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 10
  });
  await assert.rejects(manager.initialize(), (error) => {
    assert.equal(error.code, 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE');
    assert.match(error.reason, /did not acknowledge readiness within 10ms/);
    return true;
  });
  assert.equal(createdWorker.terminated, true);
  assert.equal(manager.initialized, false);
  assert.equal(manager.workers.length, 0);
  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
});

test('ComputeManager requires every admitted startup worker to acknowledge readiness', async (t) => {
  const originalWorker = globalThis.Worker;
  const createdWorkers = [];

  globalThis.Worker = class PartiallyReadyWorker {
    constructor() {
      createdWorkers.push(this);
      if (createdWorkers.length === 1) {
        queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
      }
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    minWorkers: 2,
    targetWorkers: 2,
    maxWorkers: 2,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 10
  });
  await assert.rejects(
    manager.initialize(),
    (error) => error?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
      && /did not acknowledge readiness within 10ms/.test(error.reason)
  );
  assert.equal(createdWorkers.length, 2);
  assert.ok(createdWorkers.every((worker) => worker.terminated));
  assert.equal(manager.workers.length, 0);
  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
});

test('ComputeManager blocks concurrent task submission until startup admission completes', async (t) => {
  const originalWorker = globalThis.Worker;
  const createdWorkers = [];
  let postedTaskCount = 0;

  globalThis.Worker = class PartiallyReadyWorker {
    constructor() {
      createdWorkers.push(this);
      if (createdWorkers.length === 1) {
        queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
      }
    }

    addEventListener() {}

    postMessage(message) {
      postedTaskCount += 1;
      queueMicrotask(() => this.onmessage?.({
        data: { id: message.id, type: 'result', result: 'must-not-complete' }
      }));
    }

    terminate() {
      this.terminated = true;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    minWorkers: 2,
    targetWorkers: 2,
    maxWorkers: 2,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 15
  });
  const tasks = [1, 2].map((value) => manager.submitTask({
    module: fixtureModuleUrl,
    exportName: 'sumTask',
    data: { a: value, b: value }
  }));
  const results = await Promise.allSettled(tasks);

  assert.ok(results.every((result) => (
    result.status === 'rejected'
      && result.reason?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
  )));
  assert.equal(postedTaskCount, 0);
  assert.equal(manager.getStats().totalTasksSubmitted, 0);
});

test('ComputeManager cannot resize a required pool to zero during admission', async (t) => {
  const originalWorker = globalThis.Worker;
  let createdWorker = null;

  globalThis.Worker = class HangingWorker {
    constructor() {
      createdWorker = this;
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    minWorkers: 0,
    targetWorkers: 1,
    maxWorkers: 1,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 10
  });
  const initialization = manager.initialize();
  manager.resizeWorkers(0, { reason: 'required-worker-test-zero' });

  await assert.rejects(
    initialization,
    (error) => error?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
  );
  assert.equal(manager.targetWorkerCount, 1);
  assert.equal(createdWorker.terminated, true);
  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
});

test('ComputeManager times out an unacknowledged worker added after startup', async (t) => {
  const originalWorker = globalThis.Worker;
  const createdWorkers = [];

  globalThis.Worker = class ScalingWorker {
    constructor() {
      createdWorkers.push(this);
      if (createdWorkers.length === 1) {
        queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
      }
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
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
    maxWorkers: 2,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 10
  });
  await manager.initialize();
  assert.equal(manager.getCapabilities().workerRequirement.status, 'ready');
  manager.resizeWorkers(2, { reason: 'required-worker-test' });
  assert.equal(manager.getCapabilities().workerRequirement.status, 'bootstrapping');

  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
  assert.equal(manager.workers.length, 0);
  assert.ok(createdWorkers.every((worker) => worker.terminated));
});

test('ComputeManager fails the pool when an added worker constructor throws', async (t) => {
  const originalWorker = globalThis.Worker;
  let constructionCount = 0;
  let firstWorker = null;

  globalThis.Worker = class ScalingConstructorWorker {
    constructor() {
      constructionCount += 1;
      if (constructionCount === 2) {
        throw new Error('scaled worker constructor failed');
      }
      firstWorker = this;
      queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
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
    maxWorkers: 2,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 50
  });
  await manager.initialize();
  manager.resizeWorkers(2, { reason: 'required-worker-constructor-test' });

  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
  assert.equal(manager.workers.length, 0);
  assert.equal(firstWorker.terminated, true);
});

test('ComputeManager cancels a bootstrap timeout when resize retires that worker', async (t) => {
  const originalWorker = globalThis.Worker;
  const createdWorkers = [];

  globalThis.Worker = class ScalingWorker {
    constructor() {
      createdWorkers.push(this);
      if (createdWorkers.length === 1) {
        queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
      }
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  };
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
    maxWorkers: 2,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 10
  });
  await manager.initialize();
  manager.resizeWorkers(2, { reason: 'required-worker-test-up' });
  assert.equal(manager.getCapabilities().workerRequirement.status, 'bootstrapping');
  manager.resizeWorkers(1, { reason: 'required-worker-test-down' });
  assert.equal(manager.getCapabilities().workerRequirement.status, 'ready');

  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(manager.getCapabilities().workerRequirement.status, 'ready');
  assert.equal(manager.workers.length, 1);
  assert.equal(createdWorkers[0].terminated, undefined);
  assert.equal(createdWorkers[1].terminated, true);
  await manager.destroy();
});

test('ComputeManager can initialize again after destroy cancels pending worker bootstrap', async (t) => {
  const originalWorker = globalThis.Worker;
  const createdWorkers = [];

  class HangingWorker {
    constructor() {
      createdWorkers.push(this);
    }

    addEventListener() {}

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = HangingWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    maxWorkers: 1,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 100
  });
  const firstInitialization = manager.initialize();
  await Promise.resolve();
  const staleErrorHandler = createdWorkers[0].onerror;
  await manager.destroy();
  await assert.rejects(
    firstInitialization,
    (error) => error?.code === 'ERR_COMPUTE_MANAGER_DESTROYED'
  );
  assert.equal(createdWorkers[0].terminated, true);
  assert.equal(createdWorkers[0].onerror, null);
  staleErrorHandler?.(new Error('late error from destroyed worker'));
  assert.equal(manager.workerRequirementError, null);
  assert.equal(manager.initialized, false);

  globalThis.Worker = class ReadyWorker extends HangingWorker {
    constructor() {
      super();
      queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
    }
  };
  await manager.initialize();
  assert.equal(manager.getCapabilities().workerRequirement.status, 'ready');
  await manager.destroy();
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

test('ComputeManager rejects active and queued tasks when a required worker fails', async (t) => {
  const originalWorker = globalThis.Worker;
  let createdWorker = null;

  class ReadyWorker {
    constructor() {
      createdWorker = this;
      queueMicrotask(() => this.onmessage?.({ data: { type: 'ready' } }));
    }

    addEventListener() {}

    postMessage(message) {
      this.lastMessage = message;
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Worker = ReadyWorker;
  t.after(() => {
    if (originalWorker === undefined) {
      delete globalThis.Worker;
    } else {
      globalThis.Worker = originalWorker;
    }
  });

  const manager = new ComputeManager({
    maxWorkers: 1,
    requireWorkers: true,
    workerBootstrapTimeoutMs: 50
  });
  await manager.initialize();
  const activePromise = manager.submitTask({
    module: fixtureModuleUrl,
    exportName: 'sumTask',
    data: { a: 7, b: 5 }
  });
  const queuedPromise = manager.submitTask({
    module: fixtureModuleUrl,
    exportName: 'sumTask',
    data: { a: 3, b: 4 }
  });
  const outcomesPromise = Promise.allSettled([activePromise, queuedPromise]);

  await Promise.resolve();
  assert.equal(createdWorker.lastMessage?.type, 'run');
  assert.equal(manager.activeTasks.size, 1);
  assert.equal(manager.taskQueue.length, 1);
  createdWorker.onerror({ message: 'worker lost' });

  const outcomes = await outcomesPromise;
  assert.deepEqual(outcomes.map((outcome) => outcome.status), ['rejected', 'rejected']);
  assert.ok(outcomes.every((outcome) => (
    outcome.reason?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
  )));
  assert.equal(manager.getCapabilities().workerRequirement.status, 'blocked');
  assert.equal(manager.activeTasks.size, 0);
  assert.equal(manager.taskQueue.length, 0);
  assert.equal(createdWorker.terminated, true);
  assert.equal(manager.getStats().totalTasksFailed, 2);
  assert.equal(manager.getStats().inlineTasksCompleted, 0);
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
