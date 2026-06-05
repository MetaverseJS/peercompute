import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  CHILD_WORKER_LEASE_SCHEMA,
  COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA,
  COMPUTE_SERVICE_MANIFEST_SCHEMA,
  COMPUTE_SERVICE_REGISTRY_SCHEMA,
  ComputeServiceRegistry,
  ChildWorkerLeaseManager,
  WORKER_SUPERVISOR_TELEMETRY_SCHEMA,
  WorkerSupervisor,
  createComputeManagerServiceFactory,
  normalizeComputeServiceManifest
} from '../../src/peercompute/serviceOrchestration/index.js';

function serviceManifest(overrides = {}) {
  return {
    serviceId: 'eshkol',
    version: '0.1.0-test',
    runtime: 'js',
    entry: { workerModule: '/service.js' },
    childWorkers: {
      allowed: true,
      maxChildren: 2,
      allowedModules: ['/child.js'],
      sameOriginOnly: false
    },
    capabilities: ['ulg.closure.derive'],
    taskKinds: ['eshkol.closure.derive'],
    abi: {
      ulgIrVersion: '0.5',
      gpuAbiVersion: '0.5',
      supportedDTypes: ['f32']
    },
    validation: { requiresCpuReference: true },
    ...overrides
  };
}

class CompletingServiceHost {
  constructor(manifest) {
    this.manifest = manifest;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.messages = [];
  }

  addEventListener(type, listener) {
    this.listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  postMessage(message) {
    this.messages.push(message);
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.emit({
        type: 'ready',
        workerId: message.workerId,
        serviceId: this.manifest.serviceId
      });
    }
    if (message.type === 'submit-task') {
      this.task = message.task;
      this.emit({
        type: 'task-status',
        rootTaskId: message.task.rootTaskId,
        status: 'requesting-lease',
        progress: 0,
        children: []
      });
      this.emit({
        type: 'lease-request',
        requestId: `${message.task.rootTaskId}:lease`,
        rootTaskId: message.task.rootTaskId,
        module: this.manifest.childWorkers.allowedModules[0],
        count: message.task.resources?.childWorkers || 1
      });
    }
    if (message.type === 'lease-granted') {
      this.emit({
        type: 'task-status',
        rootTaskId: message.lease.rootTaskId,
        status: 'running',
        progress: 0.5,
        children: [{ childId: `${message.lease.rootTaskId}:child-1`, status: 'running', progress: 0.5 }]
      });
      this.emit({ type: 'lease-release', leaseId: message.lease.leaseId });
      this.emit({
        type: 'task-result',
        rootTaskId: message.lease.rootTaskId,
        result: {
          value: {
            ok: true,
            leaseId: message.lease.leaseId
          }
        }
      });
    }
    if (message.type === 'lease-denied') {
      this.emit({
        type: 'task-error',
        rootTaskId: this.task?.rootTaskId,
        error: message.error
      });
    }
  }

  terminate() {
    this.terminated = true;
  }

  emit(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }
}

class CancellableServiceHost extends CompletingServiceHost {
  postMessage(message) {
    this.messages.push(message);
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.emit({
        type: 'ready',
        workerId: message.workerId,
        serviceId: this.manifest.serviceId
      });
    }
    if (message.type === 'submit-task') {
      this.task = message.task;
      this.emit({
        type: 'lease-request',
        requestId: `${message.task.rootTaskId}:lease`,
        rootTaskId: message.task.rootTaskId,
        module: this.manifest.childWorkers.allowedModules[0],
        count: 1
      });
    }
    if (message.type === 'lease-granted') {
      this.emit({
        type: 'task-status',
        rootTaskId: message.lease.rootTaskId,
        status: 'running',
        progress: 0.25,
        children: [{ childId: `${message.lease.rootTaskId}:child-1`, status: 'running', progress: 0.25 }]
      });
    }
    if (message.type === 'cancel-task') {
      this.emit({
        type: 'task-cancelled',
        rootTaskId: message.rootTaskId,
        result: { cancelled: true }
      });
    }
  }
}

async function waitFor(predicate) {
  for (let i = 0; i < 50; i += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  throw new Error('Timed out waiting for condition');
}

test('ComputeServiceRegistry normalizes manifests and resolves task kinds', () => {
  const manifest = normalizeComputeServiceManifest(serviceManifest({
    serviceId: 'moonlab',
    entry: { adapter: 'compute-manager' },
    capabilities: ['ulg.quantum.response'],
    taskKinds: ['moonlab.quantum.response']
  }));
  assert.equal(manifest.schema, COMPUTE_SERVICE_MANIFEST_SCHEMA);
  assert.equal(manifest.runtime, 'js');
  assert.equal(manifest.entry.adapter, 'compute-manager');

  const registry = new ComputeServiceRegistry([manifest]);
  assert.equal(registry.resolve('moonlab.quantum.response')[0].serviceId, 'moonlab');
  assert.equal(registry.resolve('ulg.quantum.response')[0].serviceId, 'moonlab');
  assert.equal(registry.resolveTask({ taskKind: 'moonlab.quantum.response' })[0].serviceId, 'moonlab');

  const copy = registry.get('moonlab');
  copy.manifest.capabilities.push('mutated');
  assert.equal(registry.get('moonlab').manifest.capabilities.includes('mutated'), false);

  const capabilities = registry.listCapabilities();
  assert.equal(capabilities.schema, COMPUTE_SERVICE_REGISTRY_SCHEMA);
  assert.deepEqual(capabilities.capabilities, ['ulg.quantum.response']);
  assert.deepEqual(capabilities.taskKinds, ['moonlab.quantum.response']);
  assert.throws(() => normalizeComputeServiceManifest({ serviceId: 'bad', entry: { adapter: 'x' } }), /capability/);
});

test('ChildWorkerLeaseManager enforces approved modules, quotas, expiry, and root revocation', async () => {
  let now = 1000;
  const leases = new ChildWorkerLeaseManager({ now: () => now });

  const lease = await leases.request('root-worker-a', {
    rootTaskId: 'root-task-a',
    module: '/child.js',
    count: 2,
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/child.js'],
    sameOriginOnly: false,
    ttlMs: 100
  });

  assert.equal(lease.schema, CHILD_WORKER_LEASE_SCHEMA);
  assert.equal(lease.count, 2);
  assert.equal(leases.activeChildCount('root-worker-a'), 2);
  await assert.rejects(() => leases.request('root-worker-a', {
    rootTaskId: 'root-task-a',
    module: '/child.js',
    count: 1,
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  }), /quota exceeded/);
  await assert.rejects(() => leases.request('root-worker-b', {
    rootTaskId: 'root-task-b',
    module: '/unapproved.js',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  }), /not lease-approved/);

  const sameOriginLease = await leases.request('root-worker-relative', {
    rootTaskId: 'root-task-relative',
    module: '/child.js',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['/child.js'],
    baseUrl: '/service.js'
  });
  assert.equal(sameOriginLease.status, 'active');
  await assert.rejects(() => leases.request('root-worker-foreign', {
    rootTaskId: 'root-task-foreign',
    module: 'https://example.com/child.js',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['https://example.com/child.js'],
    baseUrl: '/service.js'
  }), /same-origin/);

  now = 1201;
  const expired = leases.expireLeases();
  assert.equal(expired[0].status, 'expired');
  assert.equal(leases.activeChildCount('root-worker-a'), 0);

  const revocable = await leases.request('root-worker-a', {
    rootTaskId: 'root-task-c',
    module: '/child.js',
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  });
  assert.equal(revocable.status, 'active');
  await leases.revokeByRootTask('root-task-c');
  assert.equal(leases.get(revocable.leaseId).status, 'revoked');
});

test('WorkerSupervisor runs a fake service host with child-worker leases', async () => {
  const registry = new ComputeServiceRegistry([serviceManifest()]);
  const leaseManager = new ChildWorkerLeaseManager();
  const events = [];
  const supervisor = new WorkerSupervisor({
    registry,
    leaseManager,
    workerFactory: (manifest) => new CompletingServiceHost(manifest)
  });
  supervisor.subscribe((event) => events.push(event.type));

  const result = await supervisor.submitTask({
    serviceId: 'eshkol',
    taskKind: 'eshkol.closure.derive',
    rootTaskId: 'root-task-supervised',
    resources: { childWorkers: 1 }
  });

  assert.equal(result.status, 'complete');
  assert.equal(result.value.ok, true);
  assert.equal(leaseManager.list()[0].status, 'released');
  const telemetry = supervisor.getTreeTelemetry();
  assert.equal(telemetry.schema, WORKER_SUPERVISOR_TELEMETRY_SCHEMA);
  assert.equal(telemetry.services[0].status, 'ready');
  assert.equal(telemetry.tasks[0].status, 'complete');
  assert.equal(telemetry.tasks[0].progress, 1);
  assert.equal(events.includes('service-spawned'), true);
  assert.equal(events.includes('task-submitted'), true);
});

test('WorkerSupervisor cancelTree revokes active child leases', async () => {
  const registry = new ComputeServiceRegistry([serviceManifest()]);
  const leaseManager = new ChildWorkerLeaseManager();
  const supervisor = new WorkerSupervisor({
    registry,
    leaseManager,
    workerFactory: (manifest) => new CancellableServiceHost(manifest)
  });

  const promise = supervisor.submitTask({
    serviceId: 'eshkol',
    taskKind: 'eshkol.closure.derive',
    rootTaskId: 'root-task-cancel',
    resources: { childWorkers: 1 }
  });

  await waitFor(() => leaseManager.list({ status: 'active' }).length === 1);
  await supervisor.cancelTree('root-task-cancel');
  const result = await promise;

  assert.equal(result.status, 'cancelled-clean');
  assert.equal(result.cancelled, true);
  assert.equal(leaseManager.list()[0].status, 'revoked');
  assert.equal(supervisor.getTreeTelemetry().tasks[0].status, 'cancelled-clean');
});

test('ComputeManagerServiceAdapter lets a service run through ComputeManager without a browser worker', async () => {
  const computeManager = new ComputeManager({ enableWorkers: false });
  const registry = new ComputeServiceRegistry([serviceManifest({
    serviceId: 'pc-adapter',
    entry: { adapter: 'compute-manager' },
    childWorkers: { allowed: false, maxChildren: 0, allowedModules: [] },
    capabilities: ['ulg.test.double'],
    taskKinds: ['ulg.test.double']
  })]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: createComputeManagerServiceFactory(computeManager)
  });

  const result = await supervisor.submitTask({
    serviceId: 'pc-adapter',
    taskKind: 'ulg.test.double',
    rootTaskId: 'root-task-adapter',
    computeTask: {
      taskFamily: 'service-adapter-fixture',
      fn: ({ value }) => ({ doubled: value * 2 }),
      data: { value: 7 }
    }
  });

  assert.equal(result.schema, COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA);
  assert.deepEqual(result.value, { doubled: 14 });
  assert.equal(result.status, 'complete');
  assert.equal(computeManager.getStats().totalTasksCompleted, 1);
  assert.equal(computeManager.getStats().byTaskFamily['service-adapter-fixture'].completed, 1);
  assert.equal(supervisor.getTreeTelemetry().services[0].status, 'ready');
});
