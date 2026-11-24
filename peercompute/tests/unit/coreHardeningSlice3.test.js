import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  assertSafeRemoteModuleUrl,
  sha256StableHash
} from '../../src/peercompute/computeManager/remoteModulePolicy.js';
import { executeWasmTask, executeWasmWebGPUTask } from '../../src/peercompute/computeManager/runtime/wasmRuntime.js';
import { evaluateRemoteResultQuorum } from '../../src/peercompute/computeManager/RemoteResultQuorumValidator.js';
import {
  evaluatePlacementAdmission,
  normalizePlacementAdmissionPolicyOptions
} from '../../src/peercompute/computeManager/PlacementAdmissionPolicy.js';
import { GpuResidentLaneManager } from '../../src/peercompute/computeManager/GpuResidentLaneManager.js';
import {
  NodeKernel,
  REMOTE_COMPUTE_REQUEST_SCHEMA,
  REMOTE_TASK_GRAPH_REQUEST_SCHEMA
} from '../../src/peercompute/nodeKernel/NodeKernel.js';
import { ResourceLeaseBroker } from '../../src/peercompute/serviceOrchestration/ResourceLeaseBroker.js';
import { ChildWorkerLeaseManager } from '../../src/peercompute/serviceOrchestration/ChildWorkerLeaseManager.js';
import { WorkerSupervisor } from '../../src/peercompute/serviceOrchestration/WorkerSupervisor.js';
import { ComputeServiceRegistry } from '../../src/peercompute/serviceOrchestration/ComputeServiceRegistry.js';
import { ComputeManagerServiceAdapter } from '../../src/peercompute/serviceOrchestration/ComputeManagerServiceAdapter.js';
import { WASM_ADD_BYTES } from '../fixtures/wasmFixtures.js';

const hybridModuleUrl = new URL('../fixtures/wasmWebGpuTask.js', import.meta.url).toString();

test('Slice 3: assertSafeRemoteModuleUrl blocks dangerous schemes, file://, and cross-origin URLs', () => {
  const blocked = [
    'data:text/javascript,export default () => 1',
    'blob:https://app.example/1234',
    'javascript:alert(1)',
    'file:///etc/passwd',
    '//evil.example/payload.js',
    'https://evil.example/payload.js'
  ];
  for (const url of blocked) {
    assert.throws(
      () => assertSafeRemoteModuleUrl(url, { baseUrl: 'https://app.example/index.html' }),
      (err) => err?.code === 'ERR_REMOTE_COMPUTE_UNSAFE_MODULE_URL',
      `expected ${url} to be blocked`
    );
  }

  assert.doesNotThrow(() => assertSafeRemoteModuleUrl('/tasks/worker.js', { baseUrl: 'https://app.example/index.html' }));
  assert.doesNotThrow(() => assertSafeRemoteModuleUrl('./tasks/worker.js', { baseUrl: 'https://app.example/index.html' }));
  assert.doesNotThrow(() => assertSafeRemoteModuleUrl('peercompute:capability-benchmark'));
  assert.doesNotThrow(() => assertSafeRemoteModuleUrl('https://app.example/tasks/worker.js', { baseUrl: 'https://app.example/index.html' }));
  assert.doesNotThrow(() => assertSafeRemoteModuleUrl('https://cdn.trusted.example/worker.js', {
    allowedRemoteModuleOrigins: ['https://cdn.trusted.example']
  }));
});

test('Slice 3: NodeKernel remote responder blocks unsafe module URLs, namespaces affinityKey, and sanitizes task graphs', async () => {
  const sent = [];
  const submittedTasks = [];
  const submittedGraphs = [];
  const kernel = new NodeKernel({
    enableRemoteComputeResponder: true,
    enableRemoteTaskGraphResponder: true
  });
  kernel.nodeId = 'node-responder';
  kernel.isStarted = true;
  kernel.networkManager = {
    sendToPeer: async (peerId, message) => sent.push({ peerId, message })
  };
  kernel.computeManager = {
    _supportsWorkers: () => true,
    submitTask: async (task) => {
      submittedTasks.push(task);
      return { value: { ok: true } };
    },
    submitTaskGraph: async (graph) => {
      submittedGraphs.push(graph);
      return { status: 'completed', nodeResults: {} };
    }
  };

  // data: URL is rejected before ComputeManager ever sees it
  await kernel._handleComputeTask('peer-attacker', {
    schema: REMOTE_COMPUTE_REQUEST_SCHEMA,
    requestId: 'req-evil-data',
    task: {
      runtime: 'js',
      module: 'data:text/javascript,export default () => 42'
    }
  });
  assert.equal(submittedTasks.length, 0);
  assert.equal(sent[0].message.data.ok, false);
  assert.equal(sent[0].message.data.error.code, 'ERR_REMOTE_COMPUTE_UNSAFE_MODULE_URL');

  // Legitimate relative module gets namespaced affinityKey + requireWorker when workers exist
  await kernel._handleComputeTask('peer-good', {
    schema: REMOTE_COMPUTE_REQUEST_SCHEMA,
    requestId: 'req-good',
    task: {
      id: 'task-good',
      runtime: 'js',
      module: '/tasks/safe.js',
      affinityKey: 'local-resident-model',
      data: { x: 1 }
    }
  });
  assert.equal(submittedTasks.length, 1);
  assert.equal(submittedTasks[0].affinityKey, 'remote:peer-good:local-resident-model');
  assert.equal(submittedTasks[0].requireWorker, true);
  assert.equal(submittedTasks[0].remote, true);

  // Remote task graph strips cacheAdmission, cache writes, taskGraphExecutor, and forces advisoryOnly on nodes
  await kernel._handleComputeTaskGraph('peer-good', {
    schema: REMOTE_TASK_GRAPH_REQUEST_SCHEMA,
    requestId: 'req-graph-1',
    graph: {
      graphId: 'g-remote',
      cacheAdmission: { admitted: true, authority: 'forged' },
      cachePolicy: { mode: 'read-write', writeEnabled: true },
      taskGraphExecutor: () => { throw new Error('should be stripped'); },
      nodes: [{
        id: 'n1',
        task: {
          runtime: 'js',
          module: '/tasks/safe.js',
          affinityKey: 'shared-model',
          placementHint: { requestedPlacement: 'peer', advisoryOnly: false, peerId: 'peer-victim' }
        }
      }]
    }
  });
  assert.equal(submittedGraphs.length, 1);
  assert.equal(submittedGraphs[0].cacheAdmission, undefined);
  assert.equal(submittedGraphs[0].taskGraphExecutor, undefined);
  assert.equal(submittedGraphs[0].cachePolicy.writeEnabled, false);
  assert.equal(submittedGraphs[0].nodes[0].task.affinityKey, 'remote:peer-good:shared-model');
  assert.equal(submittedGraphs[0].nodes[0].task.placementHint.advisoryOnly, true);
  assert.equal(submittedGraphs[0].nodes[0].task.requireWorker, true);
});

test('Slice 3: NodeKernel fails closed when remote response omits taskPacket and computes outputHash locally', () => {
  const kernel = new NodeKernel();
  kernel.nodeId = 'node-requester';
  const envelope = kernel._buildNetworkPlacementResultEnvelope(
    'peer-b',
    {
      taskPacket: {
        schema: 'peercompute.compute.task-packet.v0',
        codeHash: 'fnv1a32-expected',
        inputHash: 'fnv1a32-expected',
        taskHash: 'fnv1a32-expected'
      }
    },
    {
      requestId: 'req-1',
      result: {
        value: { tampered: true },
        outputHash: 'sha256-forged-matching-hash'
      }
    },
    { executorId: 'net-exec' }
  );
  assert.equal(envelope.placementProvenance.codeHash, null);
  assert.equal(envelope.placementProvenance.inputHash, null);
  assert.equal(envelope.placementProvenance.taskHash, null);
  assert.equal(envelope.placementProvenance.outputHash, sha256StableHash({ tampered: true }));
  assert.notEqual(envelope.placementProvenance.outputHash, 'sha256-forged-matching-hash');
});

test('Slice 3: ComputeManager fails closed when remote provenance omits packet hashes', async () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    placementExecutor: async () => ({
      value: { ok: true },
      provenance: {
        executorId: 'omitting-peer',
        peerId: 'peer-omitter'
      }
    })
  });

  await assert.rejects(
    manager.submitTask({
      id: 'missing-hashes-task',
      placementHint: { requestedPlacement: 'peer', advisoryOnly: false },
      fn: () => 'local'
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_VERIFICATION');
      assert.deepEqual(err.verification.mismatchFields, ['codeHash', 'inputHash', 'taskHash']);
      return true;
    }
  );
});

test('Slice 3: ComputeManager catches requireWorker conflict with non-advisory remote placement and rejects pre-dispatch aborts', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  await assert.rejects(
    manager.submitTask({
      requireWorker: true,
      placementHint: { requestedPlacement: 'peer', advisoryOnly: false },
      fn: () => 1
    }),
    (err) => err?.code === 'ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE'
  );

  // Pre-dispatch abort while waiting on ResourceLeaseBroker must reject and release lease (not hang!)
  let resolveLease;
  const released = [];
  const broker = {
    requestLease: () => new Promise((resolve) => { resolveLease = resolve; }),
    releaseLease: async (id) => { released.push(id); }
  };
  const brokerManager = new ComputeManager({ enableWorkers: false, resourceBroker: broker });
  const ac = new AbortController();
  const taskPromise = brokerManager.submitTask({
    id: 'pre-dispatch-abort-task',
    resources: { resourceKind: 'gpu', units: 1 },
    signal: ac.signal,
    fn: () => 42
  });
  await Promise.resolve();
  ac.abort(Object.assign(new Error('user aborted'), { name: 'AbortError' }));
  resolveLease({ leaseId: 'late-lease-1' });
  await assert.rejects(taskPromise, /user aborted|cancelled/i);
  await Promise.resolve();
  assert.deepEqual(released, ['late-lease-1']);
});

test('Slice 3: ComputeManager handles DataCloneError without killing worker, re-enqueues stranded tasks, and enforces worker GPU fence', async (t) => {
  const originalWorker = globalThis.Worker;
  const created = [];
  class MockWorker {
    constructor() {
      this.messages = [];
      created.push(this);
      queueMicrotask(() => this.onmessage?.({ data: { type: 'ready', protocolVersion: 2 } }));
    }
    addEventListener() {}
    removeEventListener() {}
    postMessage(msg) {
      if (msg.data?.uncloneable) {
        const err = new Error('Could not clone');
        err.name = 'DataCloneError';
        throw err;
      }
      this.messages.push(msg);
    }
    terminate() { this.terminated = true; }
  }
  globalThis.Worker = MockWorker;
  t.after(() => {
    if (originalWorker === undefined) delete globalThis.Worker;
    else globalThis.Worker = originalWorker;
  });

  const manager = new ComputeManager({ minWorkers: 2, targetWorkers: 2, maxWorkers: 2 });
  await manager.initialize();
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(created.length, 2);

  // 1. DataCloneError rejects only the bad task; worker stays alive
  await assert.rejects(
    manager.submitTask({ id: 'bad-clone', fn: () => 1, data: { uncloneable: true } }),
    (err) => err?.name === 'DataCloneError'
  );
  assert.equal(manager.workers.length, 2);
  assert.equal(created[0].terminated, undefined);

  // 2. Worker GPU fence required + GPU resident lane lease blocks commitDelta when missing
  const deltas = [];
  manager.setCommitDeltaHandler((d) => deltas.push(d));
  const fencePromise = manager.submitTask({
    id: 'worker-fence-missing',
    fn: () => ({ ok: true }),
    gpuResidentLane: { enabled: true, laneId: 'lane:w', stateKey: 'state:w', localExecution: 'worker' },
    gpuFence: { required: true, laneId: 'lane:w', stateKey: 'state:w' }
  });
  await Promise.resolve();
  const fenceWorker = created.find((w) => w.messages.some((m) => m.id === 'worker-fence-missing'));
  assert.ok(fenceWorker);
  assert.equal(manager.getStats().gpuResidentLanes.activeLeaseCount, 1);
  fenceWorker.onmessage({
    data: {
      id: 'worker-fence-missing',
      type: 'result',
      result: { commitDelta: { scope: 's', payload: { x: 1 } }, value: { ok: true } }
    }
  });
  await assert.rejects(fencePromise, (err) => err?.code === 'ERR_COMPUTE_GPU_FENCE_UNSATISFIED');
  assert.equal(deltas.length, 0);
  assert.equal(manager.getStats().gpuResidentLanes.activeLeaseCount, 0);

  // 3. Worker crash while other healthy worker is busy never falls back inline:
  //    re-enqueues onto healthy pool (and dispatches to a worker, not main thread).
  let inlineRan = false;
  const busyTask = manager.submitTask({ id: 'busy-on-w0', fn: () => 'busy' });
  const strandedTask = manager.submitTask({
    id: 'stranded-on-w1',
    fn: () => { inlineRan = true; return 'inline'; }
  });
  await Promise.resolve();
  assert.equal(manager.activeTasks.size, 2);
  const w1 = created.find((w) => w.messages.some((m) => m.id === 'stranded-on-w1'));
  const w0 = created.find((w) => w.messages.some((m) => m.id === 'busy-on-w0'));
  assert.ok(w0 && w1 && w0 !== w1);
  // Lower target so _ensureTargetWorkers doesn't respawn immediately, proving
  // stranded task queues cleanly behind busy healthy worker w0 instead of running inline.
  manager.targetWorkerCount = 1;
  w1.onerror(new Error('worker-2 crashed'));
  assert.equal(inlineRan, false);
  assert.equal(manager.taskQueue.some((entry) => entry.id === 'stranded-on-w1'), true);
  // Complete busyTask on worker w0 -> stranded task dispatches to worker w0
  w0.onmessage({ data: { id: 'busy-on-w0', type: 'result', result: 'busy' } });
  assert.equal(await busyTask, 'busy');
  assert.ok(w0.messages.some((m) => m.id === 'stranded-on-w1'));
  w0.onmessage({ data: { id: 'stranded-on-w1', type: 'result', result: 'recovered-on-worker' } });
  assert.equal(await strandedTask, 'recovered-on-worker');
  assert.equal(inlineRan, false);
  await manager.destroy();
});

test('Slice 3: ComputeManager propagates AbortSignal to retry sleep, handles DataView/cycles, and aborts task graphs', async () => {
  let attempts = 0;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementMaxAttempts: 5,
    placementRetryBaseDelayMs: 5000,
    placementExecutor: async () => {
      attempts += 1;
      throw new Error('transient');
    }
  });
  const ac = new AbortController();
  const started = Date.now();
  const p = manager.submitTask({
    id: 'abort-retry-sleep',
    placementHint: { requestedPlacement: 'peer', advisoryOnly: false },
    signal: ac.signal,
    data: (() => {
      const cyclic = { view: new DataView(new Uint8Array([1, 2, 3, 4]).buffer) };
      cyclic.self = cyclic;
      return cyclic;
    })(),
    fn: () => 1
  });
  setTimeout(() => ac.abort(Object.assign(new Error('stop retry'), { name: 'AbortError' })), 25);
  await assert.rejects(p, /stop retry|cancelled/i);
  assert.ok(Date.now() - started < 1000);
  assert.equal(attempts, 1);
});

test('Slice 3: wasmRuntime evicts failed cache entries, destroys owned GPUDevices, and honors AbortSignal', async (t) => {
  const originalFetch = globalThis.fetch;
  const originalNav = globalThis.navigator;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    if (fetchCalls === 1) {
      return { ok: false, status: 503, statusText: 'Service Unavailable' };
    }
    return {
      ok: true,
      arrayBuffer: async () => WASM_ADD_BYTES.slice().buffer
    };
  };
  let destroyedCount = 0;
  const fakeDevice = { destroy: () => { destroyedCount += 1; } };
  const fakeGpu = {
    requestAdapter: async () => ({
      requestDevice: async () => fakeDevice
    })
  };
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { ...(originalNav || {}), gpu: fakeGpu }
  });
  t.after(() => {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNav });
  });

  const url = 'https://cache-evict-test.invalid/add.wasm';
  await assert.rejects(
    executeWasmTask({ wasm: { source: url, entry: 'add', args: [2, 3] } }),
    /503/
  );
  // Second attempt must NOT reuse the rejected promise from cache
  const sum = await executeWasmTask({ wasm: { source: url, entry: 'add', args: [2, 3] } });
  assert.equal(sum, 5);
  assert.equal(fetchCalls, 2);

  // AbortSignal stops before execution
  const ac = new AbortController();
  ac.abort();
  await assert.rejects(
    executeWasmTask({ wasm: { source: WASM_ADD_BYTES, entry: 'add', args: [1, 1] } }, { signal: ac.signal }),
    (err) => err?.name === 'AbortError'
  );

  // GPUDevice created via webgpu.requestDevice is destroyed in finally
  const hostResult = await executeWasmWebGPUTask({
    runtime: 'wasm-webgpu',
    wasm: { source: WASM_ADD_BYTES },
    module: hybridModuleUrl,
    exportName: 'runWasmWebGPU',
    webgpu: { promoteLimits: false },
    data: { args: [3, 4], taskId: 'gpu-cleanup' }
  });
  assert.equal(hostResult.value.sum, 7);
  // Requesting a device inside a host destroys it automatically
  const customHostUrl = `data:text/javascript,export async function run({ webgpu }) { await webgpu.requestDevice(); return 'ok'; }`;
  const r2 = await executeWasmWebGPUTask({
    runtime: 'wasm-webgpu',
    wasm: { source: WASM_ADD_BYTES },
    module: customHostUrl,
    exportName: 'run',
    webgpu: { promoteLimits: false }
  });
  assert.equal(r2, 'ok');
  assert.equal(destroyedCount, 1);
});

test('Slice 3: RemoteResultQuorumValidator uses SHA-256, catches tampered digests, deduplicates Sybil peers, and handles DataView/cycles', () => {
  const cyclic = { view: new DataView(new Uint8Array([9, 8, 7]).buffer), big: 42n };
  cyclic.self = cyclic;
  const h = sha256StableHash(cyclic);
  assert.match(h, /^sha256-[0-9a-f]{64}$/);

  // Tampered sha256 digest fails closed
  const tampered = evaluateRemoteResultQuorum({ answer: 999 }, {
    provenance: {
      peerId: 'peer-a',
      outputHash: sha256StableHash({ answer: 42 }),
      replicas: [{ peerId: 'peer-b', outputHash: sha256StableHash({ answer: 42 }) }]
    }
  }, { minReplicaCount: 2, minMatchingReplicas: 2, compareCommitDeltaHash: false });
  assert.equal(tampered.valid, false);
  assert.equal(tampered.reason, 'primary-digest-mismatch');

  // Sybil duplicate peerId cannot satisfy quorum
  const sybil = evaluateRemoteResultQuorum({ answer: 42 }, {
    provenance: {
      peerId: 'peer-sybil',
      outputHash: sha256StableHash({ answer: 42 }),
      replicas: [
        { peerId: 'peer-sybil', outputHash: sha256StableHash({ answer: 42 }) },
        { peerId: 'peer-sybil', outputHash: sha256StableHash({ answer: 42 }) }
      ]
    }
  }, { minReplicaCount: 2, minMatchingReplicas: 2, compareCommitDeltaHash: false });
  assert.equal(sybil.valid, false);
  assert.equal(sybil.reason, 'duplicate-responder-peer');
  assert.equal(sybil.duplicatePeerCount, 2);
  assert.equal(sybil.matchingResultCount, 1);
});

test('Slice 3: PlacementAdmissionPolicy preserves empty allowedPlacements, enforces trusted peer for cluster, and enforces confidence floor when omitted', () => {
  const denyAll = normalizePlacementAdmissionPolicyOptions({ allowedPlacements: [] });
  assert.deepEqual(denyAll.allowedPlacements, []);
  const denied = evaluatePlacementAdmission({
    placement: { requestedPlacement: 'peer', advisoryOnly: false, confidence: 1 }
  }, { networkCapacity: { bandwidthMbps: 100, rttMs: 10, remoteWorkerCapacity: 4 } }, denyAll);
  assert.equal(denied.accepted, false);
  assert.equal(denied.reason, 'placement-not-allowed');

  const clusterUntrusted = evaluatePlacementAdmission({
    placement: { requestedPlacement: 'cluster', advisoryOnly: false }
  }, {
    peerId: 'peer-untrusted',
    networkCapacity: { bandwidthMbps: 100, rttMs: 10, remoteWorkerCapacity: 4, clusterNodes: 2, clusterGpus: 2 }
  }, {
    requireTrustedPeer: true,
    trustedPeerIds: ['peer-trusted'],
    minConfidence: 0.5
  });
  assert.equal(clusterUntrusted.accepted, false);
  assert.ok(clusterUntrusted.blockedReasons.includes('peer-not-trusted'));
  assert.ok(clusterUntrusted.blockedReasons.includes('confidence-below-floor'));
});

test('Slice 3: GpuResidentLaneManager resolves lease objects via live map, awaits real GPU fence, rejects duplicate stages & write-family conflicts', async () => {
  let fenceAwaited = false;
  const manager = new GpuResidentLaneManager({
    gpuHub: {
      device: {
        queue: {
          onSubmittedWorkDone: async () => { fenceAwaited = true; }
        }
      }
    }
  });

  const lease = manager.acquireLease({
    laneId: 'lane:1',
    stateKey: 'state:1',
    writeFamilies: ['positions'],
    residentSequenceLaneContract: {
      sequenceRunnable: true,
      passDagStages: [{ id: 's1', reads: ['positions'], writes: ['positions'] }]
    }
  });

  // Conflicting write-family lease on same lane is rejected
  assert.throws(
    () => manager.acquireLease({ laneId: 'lane:1', stateKey: 'state:1', readFamilies: ['positions'] }),
    (err) => err?.code === 'ERR_GPU_RESIDENT_LANE_FAMILY_CONFLICT'
  );

  // Passing the cloned lease object (not string id) mutates live internal lease
  await manager.executeStagePlan(lease, {
    input: { step: 1 },
    stageExecutors: { s1: () => ({ value: { step: 2 }, retainedBufferRefs: ['buf-a'] }) }
  });
  const fence = await manager.waitForGpuFence(lease);
  assert.equal(fenceAwaited, true);
  assert.equal(fence.fenceSatisfied, true);
  const completed = manager.completeLease(lease, fence);
  assert.equal(completed.stageExecution.completedStageCount, 1);
  assert.equal(manager.getStats().activeLeaseCount, 0);

  // Duplicate stage IDs are rejected
  const dupLease = manager.acquireLease({
    laneId: 'lane:dup',
    stateKey: 'state:dup',
    residentSequenceLaneContract: {
      passDagStages: [{ id: 'dup' }, { id: 'dup' }]
    }
  });
  await assert.rejects(
    manager.executeStagePlan(dupLease, { stageExecutors: { dup: () => ({ value: 1 }) } }),
    (err) => err?.code === 'ERR_GPU_RESIDENT_LANE_STAGE_DUPLICATE_ID'
  );
  manager.rejectLease(dupLease, 'cleanup');
});

test('Slice 3: serviceOrchestration fixes atomic preemption, units cap, ChildWorkerLeaseManager races/sameOrigin, WorkerSupervisor & ComputeManagerServiceAdapter', async () => {
  // 1. ResourceLeaseBroker: reject units > pool.units & atomic two-phase preemption
  const broker = new ResourceLeaseBroker({ capacities: { gpu: { units: 2 } } });
  await assert.rejects(
    broker.requestLease({ resourceKind: 'gpu', units: 3 }),
    /exceeds pool capacity/
  );
  const bg = await broker.requestLease({ resourceKind: 'gpu', priorityClass: 'background', units: 1 });
  const fixed = await broker.requestLease({ resourceKind: 'gpu', priorityClass: 'background', units: 1, preemptable: false });
  await assert.rejects(
    broker.requestLease({ resourceKind: 'gpu', priorityClass: 'render', units: 2 }),
    /Resource quota exceeded/
  );
  // bg must NOT have been preempted when total capacity still could not satisfy units: 2
  assert.equal(broker.get(bg.leaseId).status, 'active');
  assert.equal(broker.get(fixed.leaseId).status, 'active');

  // 2. ChildWorkerLeaseManager: blocks data:/cross-origin without baseUrl & serializes concurrent quota checks
  const childBroker = {
    requestLease: async () => {
      await new Promise((r) => setTimeout(r, 15));
      return { leaseId: `rl-${Math.random()}` };
    },
    releaseLease: async () => {}
  };
  const childLeases = new ChildWorkerLeaseManager({ resourceBroker: childBroker });
  await assert.rejects(
    childLeases.request('parent-1', {
      allowed: true,
      maxChildren: 1,
      allowedModules: ['data:text/javascript,1'],
      module: 'data:text/javascript,1'
    }),
    /same-origin/
  );
  const [r1, r2] = await Promise.allSettled([
    childLeases.request('parent-1', {
      allowed: true,
      maxChildren: 1,
      allowedModules: ['/child.js'],
      module: '/child.js',
      resources: { resourceKind: 'gpu', units: 1 }
    }),
    childLeases.request('parent-1', {
      allowed: true,
      maxChildren: 1,
      allowedModules: ['/child.js'],
      module: '/child.js',
      resources: { resourceKind: 'gpu', units: 1 }
    })
  ]);
  assert.equal([r1, r2].filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal([r1, r2].filter((r) => r.status === 'rejected').length, 1);

  // 3. WorkerSupervisor: skips getTreeTelemetry when no listeners; rejects pending on shutdown & host error
  const host = new EventEmitter();
  host.postMessage = () => {};
  host.terminate = () => {};
  const registry = new ComputeServiceRegistry([{
    serviceId: 'svc',
    version: '1.0.0',
    runtime: 'js',
    capabilities: ['cap'],
    taskKinds: ['cap'],
    entry: { adapter: 'test' }
  }]);
  const sup = new WorkerSupervisor({ registry, serviceFactory: () => host });
  let telemetryCalls = 0;
  const origTelemetry = sup.getTreeTelemetry.bind(sup);
  sup.getTreeTelemetry = () => { telemetryCalls += 1; return origTelemetry(); };
  const pendingShutdown = sup.submitTask({ taskKind: 'cap', rootTaskId: 't-shut' });
  await Promise.resolve();
  assert.equal(telemetryCalls, 0);
  await sup.shutdown();
  await assert.rejects(pendingShutdown, (err) => err?.code === 'ERR_WORKER_SUPERVISOR_SHUTDOWN');

  // 4. ComputeManagerServiceAdapter: task failure does not fire host 'error' event; cancel forwards cancelTask
  let cancelCalledWith = null;
  const fakeCompute = {
    submitTask: async (t) => {
      if (t.data?.fail) throw new Error('single task boom');
      return new Promise((_, reject) => {
        t.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });
    },
    cancelTask: async (id) => { cancelCalledWith = id; }
  };
  const adapter = new ComputeManagerServiceAdapter({
    manifest: { serviceId: 'svc-a', entry: { module: '/m.js' } },
    computeManager: fakeCompute
  });
  let hostErrors = 0;
  const messages = [];
  adapter.addEventListener('error', () => { hostErrors += 1; });
  adapter.addEventListener('message', (evt) => messages.push(evt.data));
  adapter.postMessage({ type: 'submit-task', task: { rootTaskId: 'fail-1', data: { fail: true }, fn: () => 1 } });
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(hostErrors, 0);
  assert.ok(messages.some((m) => m.type === 'task-error' && m.rootTaskId === 'fail-1'));

  adapter.postMessage({ type: 'submit-task', task: { rootTaskId: 'cancel-1', fn: () => 1 } });
  await new Promise((r) => setTimeout(r, 10));
  adapter.postMessage({ type: 'cancel-task', rootTaskId: 'cancel-1' });
  assert.equal(cancelCalledWith, 'cancel-1');
});
