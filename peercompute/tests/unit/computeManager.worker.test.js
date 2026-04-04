import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';

const fixtureModuleUrl = new URL('../fixtures/computeManagerWorkerFixture.js', import.meta.url).toString();

test('ComputeManager bootstraps workers with an absolute taskRuntime import', async (t) => {
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
  assert.match(created[0].url, /^data:text\/javascript;base64,/);

  const source = Buffer.from(created[0].url.split(',')[1], 'base64').toString('utf8');
  assert.match(source, /import \{ executeTaskPayload \} from "file:.*taskRuntime\.js"/);
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
});
