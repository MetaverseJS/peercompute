import test from 'node:test';
import assert from 'node:assert/strict';
import { ChildWorkerLeaseManager } from '../../src/peercompute/serviceOrchestration/ChildWorkerLeaseManager.js';
import { ResourceLeaseBroker } from '../../src/peercompute/serviceOrchestration/ResourceLeaseBroker.js';
import { ComputeServiceRegistry } from '../../src/peercompute/serviceOrchestration/ComputeServiceRegistry.js';
import { WorkerSupervisor } from '../../src/peercompute/serviceOrchestration/WorkerSupervisor.js';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import { createRemoteResultQuorumValidator } from '../../src/peercompute/computeManager/RemoteResultQuorumValidator.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';

class MockWorker {
  constructor(url) {
    this.url = String(url);
    this.onmessage = null;
    this.onerror = null;
    this.messages = [];
    this.terminated = false;
    queueMicrotask(() => {
      this.onmessage?.({ data: { type: 'ready', protocolVersion: 2 } });
    });
  }

  postMessage(message) {
    this.messages.push(message);
  }

  complete(id, result) {
    this.onmessage?.({ data: { type: 'result', id, result } });
  }

  terminate() {
    this.terminated = true;
  }
}

class MockServiceHost {
  constructor() {
    this.listeners = new Set();
    this.received = [];
    this.terminated = false;
  }

  addEventListener(type, fn) {
    if (type === 'message') this.listeners.add(fn);
  }

  removeEventListener(type, fn) {
    if (type === 'message') this.listeners.delete(fn);
  }

  postMessage(msg) {
    this.received.push(msg);
  }

  emit(data) {
    for (const fn of [...this.listeners]) fn({ data });
  }

  terminate() {
    this.terminated = true;
  }
}

test('ChildWorkerLeaseManager reuses warm affinity workers and enforces ResourceLeaseBroker caps with priority eviction', async () => {
  let clock = 10_000;
  const broker = new ResourceLeaseBroker({
    capacities: {
      cpu: { units: 2, memoryBytes: 256 * 1024 * 1024 }
    },
    now: () => clock
  });
  const manager = new ChildWorkerLeaseManager({
    resourceBroker: broker,
    maxWarmPerParent: 2,
    maxWarmTotal: 2,
    defaultWarmTtlMs: 10_000,
    now: () => clock
  });

  const policy = {
    allowed: true,
    maxChildren: 2,
    allowedModules: ['./eshkol-worker.js', './moonlab-worker.js'],
    sameOriginOnly: false
  };

  // Cold miss acquires Eshkol worker and reserves 128 MiB in ResourceLeaseBroker.
  const first = await manager.request('parent-1', {
    ...policy,
    rootTaskId: 'closure-1',
    module: './eshkol-worker.js',
    affinityKey: 'eshkol:chebyshev-z26',
    priorityClass: 'interactive',
    resources: { resourceKind: 'cpu', units: 1, memoryBytes: 128 * 1024 * 1024 }
  });
  assert.equal(first.reusedWarm, false);
  assert.equal(first.affinityKey, 'eshkol:chebyshev-z26');
  assert.ok(first.workerHandleId);
  assert.equal(broker.reportPressure().pools.cpu.activeUnits, 1);

  // Release with keepWarm: true transitions to warm pool and keeps memory accounted in broker.
  const warmed = await manager.release(first.leaseId, { keepWarm: true });
  assert.equal(warmed.status, 'warm');
  assert.equal(manager.activeChildCount('parent-1'), 0);
  assert.equal(manager.warmChildCount('parent-1'), 1);
  assert.equal(broker.reportPressure().pools.cpu.activeMemoryBytes, 128 * 1024 * 1024);

  // Repeated closure-miss for same affinityKey hits warm worker without cold re-instantiation!
  clock += 1_000;
  const second = await manager.request('parent-1', {
    ...policy,
    rootTaskId: 'closure-2',
    module: './eshkol-worker.js',
    affinityKey: 'eshkol:chebyshev-z26',
    priorityClass: 'interactive',
    resources: { resourceKind: 'cpu', units: 1, memoryBytes: 128 * 1024 * 1024 }
  });
  assert.equal(second.reusedWarm, true);
  assert.equal(second.workerHandleId, first.workerHandleId);
  assert.equal(second.reuseCount, 1);
  assert.equal(manager.getWarmPoolStats().warmHits, 1);

  // Warm up a lower-priority background MoonLab worker (fills remaining 128 MiB).
  const lowPrio = await manager.request('parent-1', {
    ...policy,
    rootTaskId: 'bg-1',
    module: './moonlab-worker.js',
    affinityKey: 'moonlab:bg-parity',
    priorityClass: 'background',
    resources: { resourceKind: 'cpu', units: 1, memoryBytes: 128 * 1024 * 1024 }
  });
  await manager.release(lowPrio.leaseId, { keepWarm: true });
  assert.equal(broker.reportPressure().pools.cpu.activeMemoryBytes, 256 * 1024 * 1024);

  // High-priority render derivation needs 128 MiB -> evicts lower-priority idle warm worker to stay within ResourceLeaseBroker cap!
  const highPrio = await manager.request('parent-1', {
    ...policy,
    rootTaskId: 'render-1',
    module: './moonlab-worker.js',
    affinityKey: 'moonlab:response-z79',
    priorityClass: 'render',
    resources: { resourceKind: 'cpu', units: 1, memoryBytes: 128 * 1024 * 1024 }
  });
  assert.equal(highPrio.status, 'active');
  assert.equal(manager.get(lowPrio.leaseId).status, 'evicted');
  assert.equal(manager.getWarmPoolStats().warmEvictions, 1);
  assert.equal(broker.reportPressure().pools.cpu.activeMemoryBytes, 256 * 1024 * 1024);

  // Trying to exceed cap when all capacity is active fails closed.
  await assert.rejects(
    manager.request('parent-1', {
      ...policy,
      rootTaskId: 'overflow',
      module: './eshkol-worker.js',
      affinityKey: 'eshkol:overflow',
      priorityClass: 'critical',
      resources: { resourceKind: 'cpu', units: 1, memoryBytes: 64 * 1024 * 1024 }
    }),
    /quota exceeded/i
  );

  // TTL expiry cleans up warm pool and releases broker memory.
  await manager.release(second.leaseId, { keepWarm: true, warmTtlMs: 2_000 });
  await manager.release(highPrio.leaseId, { keepWarm: false });
  clock += 3_000;
  const expired = manager.expireLeases(clock);
  assert.equal(expired.length, 1);
  assert.equal(manager.warmChildCount('parent-1'), 0);
  await Promise.resolve();
  assert.equal(broker.reportPressure().pools.cpu.activeUnits, 0);
});

test('ComputeManager schedules queued tasks by priority and steers repeat affinity keys to warm workers', async () => {
  const originalWorker = globalThis.Worker;
  const createdWorkers = [];
  globalThis.Worker = class extends MockWorker {
    constructor(url) {
      super(url);
      createdWorkers.push(this);
    }
  };

  try {
    const cm = new ComputeManager({
      enableWorkers: true,
      enableWebGPU: false,
      minWorkers: 2,
      targetWorkers: 2,
      maxWorkers: 2,
      autoScaleWorkers: false
    });
    await cm.initialize();
    await new Promise((r) => setTimeout(r, 10));
    assert.equal(createdWorkers.length, 2);

    // 1. Warm worker-1 with Eshkol affinity and worker-2 with MoonLab affinity.
    const t1 = cm.submitTask({
      id: 'eshkol-1',
      fn: () => 1,
      affinityKey: 'eshkol:z26',
      priorityClass: 'interactive',
      returnEnvelope: true
    });
    const t2 = cm.submitTask({
      id: 'moonlab-1',
      fn: () => 2,
      affinityKey: 'moonlab:z26',
      priorityClass: 'background',
      returnEnvelope: true
    });

    // While both workers are busy, enqueue a background task followed by a critical task.
    const lowQueued = cm.submitTask({
      id: 'queued-low',
      fn: () => 'low',
      priorityClass: 'background'
    });
    const highQueued = cm.submitTask({
      id: 'queued-critical',
      fn: () => 'critical',
      priorityClass: 'critical'
    });

    const w1 = createdWorkers[0];
    const w2 = createdWorkers[1];
    assert.equal(w1.messages[0].id, 'eshkol-1');
    assert.equal(w2.messages[0].id, 'moonlab-1');

    // Completing w2 frees one slot -> critical task MUST dispatch before background task!
    w2.complete('moonlab-1', 'm1');
    assert.equal(w2.messages[1].id, 'queued-critical');

    w1.complete('eshkol-1', 'e1');
    assert.equal(w1.messages[1].id, 'queued-low');

    w2.complete('queued-critical', 'critical');
    w1.complete('queued-low', 'low');

    const [r1, r2, rLow, rHigh] = await Promise.all([t1, t2, lowQueued, highQueued]);
    assert.equal(r1.computeExecution.warmAffinityHit, false);
    assert.equal(r2.computeExecution.warmAffinityHit, false);
    assert.equal(rHigh, 'critical');
    assert.equal(rLow, 'low');

    // 2. Submit repeat Eshkol closure-miss -> MUST hit warm w1!
    const t3 = cm.submitTask({
      id: 'eshkol-2',
      fn: () => 3,
      affinityKey: 'eshkol:z26',
      priorityClass: 'interactive',
      returnEnvelope: true
    });
    assert.equal(w1.messages[2].id, 'eshkol-2');
    w1.complete('eshkol-2', 'e2');
    const r3 = await t3;
    assert.equal(r3.computeExecution.warmAffinityHit, true);
    assert.equal(r3.computeExecution.workerId, r1.computeExecution.workerId);
    assert.equal(cm.getStats().warmWorkerHits, 1);
    assert.equal(cm.getStats().warmWorkerPool.warmHits, 1);

    await cm.destroy();
  } finally {
    globalThis.Worker = originalWorker;
  }
});

test('WorkerSupervisor forwards warm child leases into telemetry and preserves StateManager + Quorum provenance admission', async () => {
  const broker = new ResourceLeaseBroker({
    capacities: { cpu: { units: 2, memoryBytes: 512 * 1024 * 1024 } }
  });
  const registry = new ComputeServiceRegistry();
  registry.register({
    serviceId: 'eshkol-closure',
    name: 'Eshkol Closure Service',
    version: '1.0.0',
    capabilities: ['closure-approximation'],
    taskKinds: ['closure-miss'],
    entry: { workerModule: './eshkol-host.js' },
    childWorkers: {
      allowed: true,
      maxChildren: 2,
      allowedModules: ['./eshkol-wasm-child.js'],
      sameOriginOnly: false
    }
  });

  const host = new MockServiceHost();
  const supervisor = new WorkerSupervisor({
    registry,
    resourceBroker: broker,
    serviceFactory: () => host
  });

  await supervisor.spawnService('eshkol-closure');
  host.emit({ type: 'ready' });

  // Service requests a warmable child lease, releases it warm, then requests again -> warm hit!
  host.emit({
    type: 'lease-request',
    requestId: 'req-1',
    rootTaskId: 'task-1',
    module: './eshkol-wasm-child.js',
    affinityKey: 'eshkol:chebyshev-closure',
    priorityClass: 'interactive',
    resources: { resourceKind: 'cpu', units: 1, memoryBytes: 64 * 1024 * 1024 }
  });
  await new Promise((r) => setTimeout(r, 10));
  const granted1 = host.received.find((m) => m.type === 'lease-granted' && m.requestId === 'req-1');
  assert.ok(granted1);
  assert.equal(granted1.lease.reusedWarm, false);

  host.emit({ type: 'lease-release', leaseId: granted1.lease.leaseId, keepWarm: true });
  await new Promise((r) => setTimeout(r, 10));

  host.emit({
    type: 'lease-request',
    requestId: 'req-2',
    rootTaskId: 'task-2',
    module: './eshkol-wasm-child.js',
    affinityKey: 'eshkol:chebyshev-closure',
    priorityClass: 'interactive',
    resources: { resourceKind: 'cpu', units: 1, memoryBytes: 64 * 1024 * 1024 }
  });
  await new Promise((r) => setTimeout(r, 10));
  const granted2 = host.received.find((m) => m.type === 'lease-granted' && m.requestId === 'req-2');
  assert.ok(granted2);
  assert.equal(granted2.lease.reusedWarm, true);
  assert.equal(granted2.lease.workerHandleId, granted1.lease.workerHandleId);

  const telemetry = supervisor.getTreeTelemetry();
  assert.equal(telemetry.warmPool.warmHits, 1);

  // Verify provenance-bound admission through RemoteResultQuorumValidator + StateManager.
  const quorum = createRemoteResultQuorumValidator({ minReplicaCount: 2, minMatchingReplicas: 2 });
  const derivationOutput = { artifactCid: 'bafkrei-derivation-1', coefficients: [0.1, 0.2, 0.3] };
  const quorumReport = quorum(derivationOutput, {
    provenance: {
      peerId: 'peer-1',
      replicas: [{ peerId: 'peer-2', value: derivationOutput }]
    }
  });
  assert.equal(quorumReport.valid, true);

  const state = new StateManager(null, {
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true
  });
  await state.initialize();
  state.writeScoped('derivationAdmissions', 'closure:z26', {
    output: derivationOutput,
    quorum: { valid: quorumReport.valid, outputHash: quorumReport.primaryOutputHash }
  });
  assert.equal(state.readScoped('derivationAdmissions', 'closure:z26').quorum.valid, true);

  await supervisor.shutdown();
  await state.destroy();
});
