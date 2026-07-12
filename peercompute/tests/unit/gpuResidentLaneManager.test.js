import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  GPU_RESIDENT_LANE_EXECUTION_SCHEMA,
  GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA,
  GPU_RESIDENT_LANE_LEASE_SCHEMA,
  GPU_RESIDENT_LANE_MANAGER_SCHEMA,
  GPU_RESIDENT_LANE_SCHEMA,
  GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA,
  GPU_RESIDENT_LANE_STAGE_PLACEMENT_PREFLIGHT_SCHEMA,
  GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA,
  GpuResidentLaneManager
} from '../../src/peercompute/computeManager/GpuResidentLaneManager.js';
import { GPUHubManager } from '../../src/peercompute/gpu/GPUHubManager.js';

function monotonicClock(start = 1000) {
  let value = start;
  return () => {
    value += 1;
    return value;
  };
}

function delayMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function residentSequenceContract(overrides = {}) {
  return {
    schema: 'peercompute.ulg.mls-mpm-resident-sequence-lane-contract.v0',
    authority: 'compute-manager-gpuhub-resident-lane-contract',
    status: 'lane-owned-fused-sequence-contract-ready',
    laneId: 'ulg:sph:lane:contract',
    stateKey: 'ulg:sph-state:contract',
    domainKey: 'tile:0',
    queueFencePolicy: 'queue.onSubmittedWorkDone-before-admission',
    stepCount: 2,
    sequenceRequested: true,
    sequenceRunnable: true,
    sequenceMode: 'fused-no-full-active-grid-mechanics-sequence',
    defaultEnabled: false,
    passDagStages: [
      {
        id: 'mechanics-p2g',
        lawNodeId: 'ulg-mls-mpm-mechanics-law',
        runtimeTarget: 'webgpu-compute',
        reads: ['sph-particle-state'],
        writes: ['mls-mpm-grid-momentum']
      },
      {
        id: 'mechanics-g2p',
        lawNodeId: 'ulg-mls-mpm-mechanics-law',
        runtimeTarget: 'webgpu-compute',
        reads: ['mls-mpm-grid-velocity'],
        writes: ['sph-particle-state', 'mls-mpm-mechanics']
      }
    ],
    ...overrides
  };
}

test('GpuResidentLaneManager leases one state-keyed lane and reports a satisfied queue fence', () => {
  const manager = new GpuResidentLaneManager({
    deviceId: 'gpu-device:a',
    now: monotonicClock()
  });

  const lease = manager.acquireLease({
    laneId: 'ulg:sph:lane:a',
    stateKey: 'ulg:sph-state:a',
    solverId: 'ulg-sph-resident',
    taskId: 'sph-step:1',
    readFamilies: ['positions', 'thermal'],
    writeFamilies: ['positions', 'velocity', 'pressure'],
    retainedBufferRefs: ['positions-buffer', 'velocity-buffer'],
    copyBudget: {
      uploadBytes: 128,
      readbackBytes: 0,
      retainedBytes: 4096,
      compactSummaryBytes: 64
    }
  });

  assert.equal(lease.schema, GPU_RESIDENT_LANE_LEASE_SCHEMA);
  assert.equal(lease.laneId, 'ulg:sph:lane:a');
  assert.equal(lease.stateKey, 'ulg:sph-state:a');
  assert.equal(lease.copyBudget.uploadBytes, 128);
  assert.equal(manager.getStats().schema, GPU_RESIDENT_LANE_MANAGER_SCHEMA);
  assert.equal(manager.getStats().activeLeaseCount, 1);

  const execution = manager.completeLease(lease.leaseId, {
    status: 'queue-work-completed',
    method: 'queue.onSubmittedWorkDone',
    retainedBufferRefs: ['positions-buffer', 'velocity-buffer', 'surface-field-buffer']
  });

  assert.equal(execution.schema, GPU_RESIDENT_LANE_EXECUTION_SCHEMA);
  assert.equal(execution.gpuFence.schema, GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA);
  assert.equal(execution.gpuFence.status, 'queue-work-completed');
  assert.equal(execution.gpuFence.fenceSatisfied, true);
  assert.equal(execution.gpuFence.laneId, 'ulg:sph:lane:a');
  assert.equal(execution.gpuFence.stateKey, 'ulg:sph-state:a');
  assert.deepEqual(execution.gpuFence.retainedBufferRefs, ['positions-buffer', 'velocity-buffer', 'surface-field-buffer']);
  assert.equal(execution.lane.schema, GPU_RESIDENT_LANE_SCHEMA);
  assert.equal(execution.lane.activeLeaseCount, 0);
  assert.deepEqual(execution.lane.retainedBufferRefs, ['positions-buffer', 'surface-field-buffer', 'velocity-buffer']);
  assert.equal(manager.getStats().activeLeaseCount, 0);
  assert.equal(manager.getStats().completedLeaseCount, 1);
  assert.equal(manager.getStats().totalUploadBytes, 128);
  assert.equal(manager.getStats().maxRetainedBytes, 4096);
});

test('GpuResidentLaneManager rejects conflicting state keys on the same lane', () => {
  const manager = new GpuResidentLaneManager({ now: monotonicClock() });
  const lease = manager.acquireLease({
    laneId: 'ulg:sph:lane:conflict',
    stateKey: 'ulg:sph-state:a'
  });

  assert.throws(
    () => manager.acquireLease({
      laneId: 'ulg:sph:lane:conflict',
      stateKey: 'ulg:sph-state:b'
    }),
    /already owns stateKey/
  );

  const rejected = manager.rejectLease(lease.leaseId, 'test-cleanup');
  assert.equal(rejected.status, 'rejected');
  assert.equal(rejected.releaseReason, 'test-cleanup');
  assert.equal(manager.getStats().activeLeaseCount, 0);
  assert.equal(manager.getStats().rejectedLeaseCount, 1);
});

test('GpuResidentLaneManager executes a resident contract stage plan under one active lease', async () => {
  const manager = new GpuResidentLaneManager({
    deviceId: 'gpu-device:contract',
    now: monotonicClock()
  });
  const contract = residentSequenceContract();
  const lease = manager.acquireLease({
    laneId: contract.laneId,
    stateKey: contract.stateKey,
    domainKey: contract.domainKey,
    retainedBufferRefs: ['sph-state-buffer'],
    residentSequenceLaneContract: contract
  });

  assert.equal(lease.stagePlan.schema, GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA);
  assert.equal(lease.stagePlan.status, 'contract-stage-plan-ready');
  assert.equal(lease.stagePlan.stageCount, 2);
  assert.equal(lease.stagePlan.defaultEnabled, false);

  const calls = [];
  const stageExecution = await manager.executeStagePlan(lease.leaseId, {
    input: { particleCount: 8 },
    context: { scenario: 'unit-contract' },
    stageExecutors: {
      'mechanics-p2g': async ({ stage, input, lease: stageLease, context }) => {
        calls.push({ stage: stage.id, input, laneId: stageLease.laneId, context });
        return {
          value: { ...input, p2g: true },
          retainedBufferRefs: ['grid-momentum-buffer'],
          summary: { activeNodes: 12 }
        };
      },
      'mechanics-g2p': ({ stage, input, lease: stageLease }) => {
        calls.push({ stage: stage.id, input, laneId: stageLease.laneId });
        return {
          value: { ...input, g2p: true },
          retainedBufferRefs: ['sph-state-buffer', 'mls-mpm-mechanics-buffer'],
          gpuFence: {
            schema: GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA,
            status: 'queue-work-completed',
            fenceSatisfied: true
          }
        };
      }
    }
  });

  assert.equal(stageExecution.schema, GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA);
  assert.equal(stageExecution.status, 'completed');
  assert.equal(stageExecution.completedStageCount, 2);
  assert.deepEqual(stageExecution.output, { particleCount: 8, p2g: true, g2p: true });
  assert.deepEqual(stageExecution.retainedBufferRefs, [
    'sph-state-buffer',
    'grid-momentum-buffer',
    'sph-state-buffer',
    'mls-mpm-mechanics-buffer'
  ]);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].laneId, 'ulg:sph:lane:contract');
  assert.equal(calls[0].context.scenario, 'unit-contract');

  const execution = manager.completeLease(lease.leaseId, {
    status: 'queue-work-completed',
    method: 'queue.onSubmittedWorkDone'
  });
  assert.equal(execution.stagePlan.schema, GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA);
  assert.equal(execution.stageExecution.schema, GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA);
  assert.equal(execution.stageExecution.completedStageCount, 2);
  assert.equal(execution.residentSequenceLaneContract.schema, contract.schema);
  assert.deepEqual(execution.lane.retainedBufferRefs, [
    'grid-momentum-buffer',
    'mls-mpm-mechanics-buffer',
    'sph-state-buffer'
  ]);
});

test('GpuResidentLaneManager executes explicit dependency batches concurrently', async () => {
  const manager = new GpuResidentLaneManager({
    deviceId: 'gpu-device:dependency-batches',
    now: monotonicClock()
  });
  const contract = residentSequenceContract({
    stageDependencyMode: 'explicit-stage-dependencies',
    parallelStageExecution: true,
    passDagStages: [
      {
        id: 'p2g',
        runtimeTarget: 'webgpu-compute',
        reads: ['sph-particle-state'],
        writes: ['mls-mpm-grid']
      },
      {
        id: 'pressureInterface',
        runtimeTarget: 'webgpu-compute',
        reads: ['resident-gas-pressure'],
        writes: ['pressure-interface-force-rows']
      },
      {
        id: 'gridUpdate',
        runtimeTarget: 'webgpu-compute',
        dependsOn: ['p2g', 'pressureInterface'],
        inputFrom: 'pressureInterface',
        reads: ['mls-mpm-grid', 'pressure-interface-force-rows'],
        writes: ['mls-mpm-grid']
      },
      {
        id: 'g2p',
        runtimeTarget: 'webgpu-compute',
        dependsOn: ['gridUpdate'],
        inputFrom: 'gridUpdate',
        reads: ['mls-mpm-grid'],
        writes: ['sph-particle-state']
      }
    ]
  });
  const lease = manager.acquireLease({
    laneId: contract.laneId,
    stateKey: contract.stateKey,
    residentSequenceLaneContract: contract
  });
  assert.equal(lease.stagePlan.dependencyMode, 'explicit-stage-dependencies');
  assert.equal(lease.stagePlan.parallelStageExecution, true);

  const events = [];
  const stageExecution = await manager.executeStagePlan(lease.leaseId, {
    input: { particleCount: 8 },
    stageExecutors: {
      p2g: async ({ input }) => {
        events.push('start:p2g');
        await delayMs(25);
        events.push('finish:p2g');
        return {
          value: { ...input, p2g: true },
          retainedBufferRefs: ['grid-momentum-buffer']
        };
      },
      pressureInterface: async ({ input }) => {
        events.push('start:pressureInterface');
        await delayMs(5);
        events.push('finish:pressureInterface');
        return {
          value: { ...input, pressureInterfaceStageTask: true },
          retainedBufferRefs: ['pressure-interface-force-rows-buffer']
        };
      },
      gridUpdate: ({ input }) => {
        events.push(`start:gridUpdate:${input.pressureInterfaceStageTask === true}`);
        return {
          value: { gridUpdate: true, pressureInput: input.pressureInterfaceStageTask === true },
          retainedBufferRefs: ['mls-mpm-grid-update-buffer']
        };
      },
      g2p: ({ input }) => {
        events.push(`start:g2p:${input.gridUpdate === true}`);
        return {
          value: { g2p: true, pressureInput: input.pressureInput === true },
          retainedBufferRefs: ['sph-state-buffer']
        };
      }
    }
  });

  assert.equal(stageExecution.status, 'completed');
  assert.equal(stageExecution.dependencyMode, 'explicit-stage-dependencies');
  assert.equal(stageExecution.parallelStageExecution, true);
  assert.equal(stageExecution.stateFamilyConflictPolicy, 'defer-read-write-conflicting-ready-stages');
  assert.equal(stageExecution.stateFamilyConflictDeferralCount, 0);
  assert.deepEqual(stageExecution.executionBatches, [
    ['p2g', 'pressureInterface'],
    ['gridUpdate'],
    ['g2p']
  ]);
  assert.equal(stageExecution.maxConcurrentStageCount, 2);
  assert.deepEqual(stageExecution.output, { g2p: true, pressureInput: true });
  assert.deepEqual(stageExecution.stageResults.map((entry) => entry.stageId), [
    'p2g',
    'pressureInterface',
    'gridUpdate',
    'g2p'
  ]);
  assert.ok(events.indexOf('start:pressureInterface') < events.indexOf('finish:p2g'));
  assert.ok(events.indexOf('finish:pressureInterface') < events.indexOf('finish:p2g'));
  assert.ok(events.includes('start:gridUpdate:true'));
  assert.ok(events.includes('start:g2p:true'));
});

test('GpuResidentLaneManager defers ready stages with state-family conflicts', async () => {
  const manager = new GpuResidentLaneManager({
    deviceId: 'gpu-device:state-conflicts',
    now: monotonicClock()
  });
  const contract = residentSequenceContract({
    stageDependencyMode: 'explicit-stage-dependencies',
    parallelStageExecution: true,
    passDagStages: [
      {
        id: 'p2g',
        runtimeTarget: 'webgpu-compute',
        reads: ['sph-particle-state'],
        writes: ['mls-mpm-grid']
      },
      {
        id: 'gridDiagnostics',
        runtimeTarget: 'webgpu-compute',
        reads: ['mls-mpm-grid'],
        writes: ['diagnostics']
      },
      {
        id: 'pressureInterface',
        runtimeTarget: 'webgpu-compute',
        reads: ['resident-gas-pressure'],
        writes: ['pressure-interface-force-rows']
      },
      {
        id: 'gridUpdate',
        runtimeTarget: 'webgpu-compute',
        dependsOn: ['p2g', 'pressureInterface'],
        inputFrom: 'pressureInterface',
        reads: ['mls-mpm-grid', 'pressure-interface-force-rows'],
        writes: ['mls-mpm-grid']
      }
    ]
  });
  const lease = manager.acquireLease({
    laneId: contract.laneId,
    stateKey: contract.stateKey,
    residentSequenceLaneContract: contract
  });

  const events = [];
  const stageExecution = await manager.executeStagePlan(lease.leaseId, {
    input: { particleCount: 8 },
    stageExecutors: {
      p2g: async ({ input }) => {
        events.push('start:p2g');
        await delayMs(20);
        events.push('finish:p2g');
        return { value: { ...input, p2g: true } };
      },
      gridDiagnostics: ({ input }) => {
        events.push(`start:gridDiagnostics:${input.p2g === true}`);
        return { value: { diagnostics: true, sawP2g: input.p2g === true } };
      },
      pressureInterface: async ({ input }) => {
        events.push('start:pressureInterface');
        await delayMs(5);
        events.push('finish:pressureInterface');
        return { value: { ...input, pressureInterfaceStageTask: true } };
      },
      gridUpdate: ({ input }) => {
        events.push(`start:gridUpdate:${input.pressureInterfaceStageTask === true}`);
        return { value: { gridUpdate: true } };
      }
    }
  });

  assert.equal(stageExecution.status, 'completed');
  assert.equal(stageExecution.stateFamilyConflictPolicy, 'defer-read-write-conflicting-ready-stages');
  assert.deepEqual(stageExecution.executionBatches, [
    ['p2g', 'pressureInterface'],
    ['gridDiagnostics'],
    ['gridUpdate']
  ]);
  assert.equal(stageExecution.maxConcurrentStageCount, 2);
  assert.equal(stageExecution.stateFamilyConflictDeferralCount, 2);
  assert.deepEqual(stageExecution.stateFamilyConflictDeferrals, [
    {
      stageId: 'gridDiagnostics',
      blockedByStageId: 'p2g',
      conflictType: 'write-read',
      families: ['mls-mpm-grid'],
      batchIndex: 0
    },
    {
      stageId: 'gridUpdate',
      blockedByStageId: 'gridDiagnostics',
      conflictType: 'read-write',
      families: ['mls-mpm-grid'],
      batchIndex: 1
    }
  ]);
  assert.ok(events.indexOf('start:pressureInterface') < events.indexOf('finish:p2g'));
  assert.ok(events.indexOf('start:gridDiagnostics:false') > events.indexOf('finish:p2g'));
  assert.ok(events.includes('start:gridUpdate:true'));
});

test('ComputeManager preflights GPU resident lane placement with dependency batches, conflicts, and worker policy', () => {
  const gpuHub = new GPUHubManager();
  gpuHub.setDevice({ label: 'gpu-device:placement-preflight' });
  for (const stageId of ['p2g', 'pressureInterface', 'gridDiagnostics', 'gridUpdate']) {
    gpuHub.registerResidentStageExecutor({
      stageId,
      workerPolicy: stageId === 'p2g'
        ? {
            mode: 'dedicated-worker',
            workerType: 'webgpu-compute-worker',
            workerModuleUrl: `/workers/${stageId}.js`,
            sameDeviceRequired: true
          }
        : { mode: 'inline' },
      executor: () => ({ value: { stageId } })
    });
  }
  gpuHub.registerResidentStageExecutor({
    stageId: 'g2p',
    workerPolicy: {
      mode: 'dedicated-worker',
      workerType: 'webgpu-compute-worker',
      workerModuleUrl: '/workers/g2p.js',
      sameDeviceRequired: true
    },
    workerRunner: () => ({ value: { stageId: 'g2p' } })
  });
  const laneManager = new GpuResidentLaneManager({
    gpuHub,
    deviceId: 'gpu-device:placement-preflight',
    now: monotonicClock()
  });
  const computeManager = new ComputeManager({
    enableWorkers: false,
    gpuResidentLaneManager: laneManager
  });
  const contract = residentSequenceContract({
    stageDependencyMode: 'explicit-stage-dependencies',
    parallelStageExecution: true,
    passDagStages: [
      {
        id: 'p2g',
        runtimeTarget: 'webgpu-compute',
        reads: ['sph-particle-state'],
        writes: ['mls-mpm-grid']
      },
      {
        id: 'gridDiagnostics',
        runtimeTarget: 'webgpu-compute',
        reads: ['mls-mpm-grid'],
        writes: ['diagnostics']
      },
      {
        id: 'pressureInterface',
        runtimeTarget: 'webgpu-compute',
        reads: ['resident-gas-pressure'],
        writes: ['pressure-interface-force-rows']
      },
      {
        id: 'gridUpdate',
        runtimeTarget: 'webgpu-compute',
        dependsOn: ['p2g', 'pressureInterface'],
        reads: ['mls-mpm-grid', 'pressure-interface-force-rows'],
        writes: ['mls-mpm-grid']
      },
      {
        id: 'g2p',
        runtimeTarget: 'webgpu-compute',
        dependsOn: ['gridUpdate'],
        reads: ['mls-mpm-grid'],
        writes: ['sph-particle-state']
      }
    ]
  });
  const lease = computeManager.acquireGpuResidentLaneLease({
    laneId: contract.laneId,
    stateKey: contract.stateKey,
    residentSequenceLaneContract: contract
  });

  const preflight = computeManager.preflightGpuResidentLaneStagePlacement(lease.leaseId);

  assert.equal(preflight.schema, GPU_RESIDENT_LANE_STAGE_PLACEMENT_PREFLIGHT_SCHEMA);
  assert.equal(preflight.status, 'placement-preflight-ready');
  assert.equal(preflight.authority, 'compute-manager-gpu-resident-lane-manager');
  assert.equal(preflight.dependencyMode, 'explicit-stage-dependencies');
  assert.equal(preflight.parallelStageExecution, true);
  assert.equal(preflight.stateFamilyConflictPolicy, 'defer-read-write-conflicting-ready-stages');
  assert.deepEqual(preflight.placementBatches, [
    ['p2g', 'pressureInterface'],
    ['gridDiagnostics'],
    ['gridUpdate'],
    ['g2p']
  ]);
  assert.equal(preflight.maxConcurrentStageCount, 2);
  assert.equal(preflight.stateFamilyConflictDeferralCount, 2);
  assert.deepEqual(preflight.executorSources, {
    p2g: 'gpu-hub-resident-stage-executor',
    gridDiagnostics: 'gpu-hub-resident-stage-executor',
    pressureInterface: 'gpu-hub-resident-stage-executor',
    gridUpdate: 'gpu-hub-resident-stage-executor',
    g2p: 'gpu-hub-resident-stage-executor'
  });
  assert.deepEqual(preflight.workerResidencyStatuses, {
    p2g: 'blocked-worker-backend-missing',
    gridDiagnostics: 'inline-ready',
    pressureInterface: 'inline-ready',
    gridUpdate: 'inline-ready',
    g2p: 'worker-ready'
  });
  assert.deepEqual(preflight.workerRequestedStageIds, ['p2g', 'g2p']);
  assert.deepEqual(preflight.workerReadyStageIds, ['g2p']);
  assert.deepEqual(preflight.workerFallbackStageIds, ['p2g']);
  assert.equal(preflight.canExecute, true);
  assert.equal(preflight.missingExecutorCount, 0);
  assert.equal(
    preflight.stagePlacements.find((entry) => entry.stageId === 'p2g')?.placementTarget,
    'gpu-hub-inline-fallback-for-worker-stage'
  );
  assert.equal(
    preflight.stagePlacements.find((entry) => entry.stageId === 'g2p')?.placementTarget,
    'gpu-hub-worker-resident-stage'
  );
});

test('GpuResidentLaneManager can execute contract stages through GPUHub resident executors', async () => {
  const gpuHub = new GPUHubManager();
  gpuHub.setDevice({ label: 'gpu-device:hub-stage' });
  gpuHub.registerResidentStageExecutor({
    stageId: 'mechanics-p2g',
    workerPolicy: {
      mode: 'dedicated-worker',
      workerType: 'webgpu-compute-worker',
      workerModuleUrl: '/workers/ulg-mechanics-p2g-worker.js',
      startupMode: 'warm-on-first-use',
      sameDeviceRequired: true
    },
    executor({ input, device }) {
      return {
        value: { ...input, p2gDevice: device.label },
        retainedBufferRefs: ['grid-momentum-buffer'],
        summary: { backend: 'webgpu', source: 'gpu-hub' }
      };
    }
  });
  gpuHub.registerResidentStageExecutor({
    stageId: 'mechanics-g2p',
    workerPolicy: {
      mode: 'dedicated-worker',
      workerType: 'webgpu-compute-worker',
      workerModuleUrl: '/workers/ulg-mechanics-g2p-worker.js'
    },
    workerRunner({ input, executor }) {
      return {
        value: { ...input, g2p: true, g2pWorkerStatus: executor.workerPolicy.status },
        retainedBufferRefs: ['sph-state-buffer'],
        gpuFence: {
          schema: GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA,
          status: 'queue-work-completed',
          fenceSatisfied: true
        }
      };
    }
  });

  const manager = new GpuResidentLaneManager({
    gpuHub,
    deviceId: 'gpu-device:hub-stage',
    now: monotonicClock()
  });
  const contract = residentSequenceContract();
  const lease = manager.acquireLease({
    laneId: contract.laneId,
    stateKey: contract.stateKey,
    residentSequenceLaneContract: contract
  });

  const stageExecution = await manager.executeStagePlan(lease.leaseId, {
    input: { particleCount: 3 }
  });

  assert.equal(stageExecution.status, 'completed');
  assert.equal(stageExecution.completedStageCount, 2);
  assert.deepEqual(stageExecution.output, {
    particleCount: 3,
    p2gDevice: 'gpu-device:hub-stage',
    g2p: true,
    g2pWorkerStatus: 'worker-ready'
  });
  assert.deepEqual(
    stageExecution.stageResults.map((entry) => entry.executorSource),
    ['gpu-hub-resident-stage-executor', 'gpu-hub-resident-stage-executor']
  );
  assert.equal(stageExecution.stageResults[0].workerResidency.schema, 'peercompute.gpu.resident-stage-worker-policy.v0');
  assert.equal(stageExecution.stageResults[0].workerResidency.mode, 'dedicated-worker');
  assert.equal(stageExecution.stageResults[0].workerResidency.status, 'blocked-worker-backend-missing');
  assert.equal(stageExecution.stageResults[0].workerResidency.fallbackRuntimeTarget, 'gpu-hub-inline-stage-executor');
  assert.equal(stageExecution.stageResults[1].workerResidency.mode, 'dedicated-worker');
  assert.equal(stageExecution.stageResults[1].workerResidency.status, 'worker-ready');
  assert.deepEqual(stageExecution.stageResults[0].summary, {
    backend: 'webgpu',
    source: 'gpu-hub'
  });
  assert.deepEqual(stageExecution.retainedBufferRefs, [
    'grid-momentum-buffer',
    'sph-state-buffer'
  ]);
});

test('ComputeManager exposes passive GPU resident lane leases without changing task dispatch', async () => {
  const computeManager = new ComputeManager({
    enableWorkers: false,
    gpuDeviceId: 'gpu-device:compute-manager'
  });
  await computeManager.initialize();

  const lease = computeManager.acquireGpuResidentLaneLease({
    laneId: 'ulg:sph:lane:compute-manager',
    stateKey: 'ulg:sph-state:compute-manager',
    solverId: 'ulg-sph-resident',
    taskId: 'sph-step:manager',
    copyBudget: {
      uploadBytes: 32,
      readbackBytes: 16,
      retainedBytes: 2048,
      compactSummaryBytes: 24,
      fullReadbackReason: 'unit-test-diagnostic'
    }
  });

  assert.equal(lease.schema, GPU_RESIDENT_LANE_LEASE_SCHEMA);
  assert.equal(computeManager.getCapabilities().gpuResidentLanes.activeLeaseCount, 1);
  assert.equal(computeManager.getStats().gpuResidentLanes.activeLeaseCount, 1);

  const result = await computeManager.submitTask({
    fn: (data) => data.value + 1,
    data: { value: 4 }
  });
  assert.equal(result, 5);

  const execution = computeManager.completeGpuResidentLaneLease(lease.leaseId, {
    status: 'readback-map-completed',
    method: 'GPUBuffer.mapAsync'
  });

  assert.equal(execution.gpuFence.fenceSatisfied, true);
  assert.equal(execution.gpuFence.method, 'GPUBuffer.mapAsync');
  assert.equal(computeManager.getStats().gpuResidentLanes.activeLeaseCount, 0);
  assert.equal(computeManager.getStats().gpuResidentLanes.completedLeaseCount, 1);
  assert.equal(computeManager.getStats().totalTasksCompleted, 1);
});

test('ComputeManager wraps declared inline tasks in GPU resident lane leases before committing deltas', async () => {
  const computeManager = new ComputeManager({
    enableWorkers: false,
    gpuDeviceId: 'gpu-device:compute-manager'
  });
  const deltas = [];
  computeManager.setCommitDeltaHandler((delta) => deltas.push(delta));
  await computeManager.initialize();

  const result = await computeManager.submitTask({
    id: 'local-gpu-lane-task',
    taskFamily: 'ulg-resident-gpu-lane',
    returnEnvelope: true,
    data: {},
    gpuResidentLane: {
      enabled: true,
      laneId: 'ulg:sph:lane:inline',
      stateKey: 'ulg:sph-state:inline',
      sourceFamily: 'sph-particle-state',
      domainKey: 'tile:0',
      readFamilies: ['sph-particle-state'],
      writeFamilies: ['sph-particle-state', 'mls-mpm-mechanics'],
      retainedBufferRefs: ['sph-state-buffer', 'mls-mechanics-buffer'],
      residentSequenceLaneContract: residentSequenceContract({
        laneId: 'ulg:sph:lane:inline',
        stateKey: 'ulg:sph-state:inline'
      }),
      copyBudget: {
        uploadBytes: 0,
        readbackBytes: 128,
        retainedBytes: 4096,
        compactSummaryBytes: 128
      }
    },
    gpuFence: {
      required: true,
      laneId: 'ulg:sph:lane:inline',
      stateKey: 'ulg:sph-state:inline',
      queueFencePolicy: 'queue.onSubmittedWorkDone',
      retainedBufferRefs: ['sph-state-buffer', 'mls-mechanics-buffer']
    },
    fn: (data) => ({
      commitDelta: {
        taskId: 'local-gpu-lane-task',
        scope: 'ulg-resident-inline',
        payload: { nextStep: 2 }
      },
      value: { ok: true, leaseIdentity: data.gpuResidentLaneLeaseIdentity },
      gpuFence: {
        status: 'queue-work-completed',
        method: 'queue.onSubmittedWorkDone',
        laneId: 'ulg:sph:lane:inline',
        stateKey: 'ulg:sph-state:inline',
        queueFencePolicy: 'queue.onSubmittedWorkDone',
        retainedBufferRefs: ['sph-state-buffer', 'mls-mechanics-buffer', 'surface-field-buffer']
      }
    })
  });

  assert.deepEqual(deltas, [{
    taskId: 'local-gpu-lane-task',
    scope: 'ulg-resident-inline',
    payload: { nextStep: 2 }
  }]);
  assert.equal(result.value.ok, true);
  assert.equal(
    result.value.leaseIdentity.schema,
    'peercompute.compute.gpu-resident-lane-lease-identity.v0'
  );
  assert.equal(result.value.leaseIdentity.authoritative, true);
  assert.equal(result.value.leaseIdentity.laneId, 'ulg:sph:lane:inline');
  assert.equal(result.value.leaseIdentity.stateKey, 'ulg:sph-state:inline');
  assert.equal(result.value.leaseIdentity.sourceFamily, 'sph-particle-state');
  assert.equal(
    result.value.leaseIdentity.leaseId,
    result.gpuResidentLaneExecution.lease.leaseId
  );
  assert.equal(result.gpuResidentLaneExecution.schema, GPU_RESIDENT_LANE_EXECUTION_SCHEMA);
  assert.equal(result.gpuResidentLaneExecution.gpuFence.schema, GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA);
  assert.equal(result.gpuResidentLaneExecution.gpuFence.fenceSatisfied, true);
  assert.equal(result.gpuResidentLaneExecution.gpuFence.laneId, 'ulg:sph:lane:inline');
  assert.deepEqual(result.gpuResidentLaneExecution.gpuFence.retainedBufferRefs, ['sph-state-buffer', 'mls-mechanics-buffer', 'surface-field-buffer']);
  assert.equal(result.computeExecution.gpuFenceSatisfied, true);
  assert.equal(result.computeExecution.gpuResidentLaneRequirement.localExecution, 'inline');
  assert.equal(
    result.computeExecution.gpuResidentLaneRequirement.residentSequenceLaneContract.schema,
    'peercompute.ulg.mls-mpm-resident-sequence-lane-contract.v0'
  );
  assert.equal(result.gpuResidentLaneExecution.stagePlan.schema, GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA);
  assert.equal(result.gpuResidentLaneExecution.stagePlan.stageCount, 2);
  assert.equal(result.gpuResidentLaneExecution.stagePlan.defaultEnabled, false);
  assert.equal(result.computeExecution.gpuResidentLaneExecution.gpuFence.status, 'queue-work-completed');
  assert.equal(computeManager.getStats().gpuResidentLanes.activeLeaseCount, 0);
  assert.equal(computeManager.getStats().gpuResidentLanes.completedLeaseCount, 1);
  assert.equal(computeManager.getStats().gpuResidentLanes.totalReadbackBytes, 128);
  assert.equal(computeManager.getStats().totalTasksCompleted, 1);
});

test('ComputeManager blocks local commit when a required GPU resident lane fence is missing', async () => {
  const computeManager = new ComputeManager({
    enableWorkers: false,
    gpuDeviceId: 'gpu-device:compute-manager'
  });
  const deltas = [];
  computeManager.setCommitDeltaHandler((delta) => deltas.push(delta));
  await computeManager.initialize();

  await assert.rejects(
    computeManager.submitTask({
      id: 'local-gpu-lane-missing-fence-task',
      taskFamily: 'ulg-resident-gpu-lane',
      gpuResidentLane: {
        enabled: true,
        laneId: 'ulg:sph:lane:missing-fence',
        stateKey: 'ulg:sph-state:missing-fence',
        retainedBufferRefs: ['sph-state-buffer']
      },
      gpuFence: {
        required: true,
        laneId: 'ulg:sph:lane:missing-fence',
        stateKey: 'ulg:sph-state:missing-fence',
        queueFencePolicy: 'queue.onSubmittedWorkDone',
        retainedBufferRefs: ['sph-state-buffer']
      },
      fn: () => ({
        commitDelta: {
          taskId: 'local-gpu-lane-missing-fence-task',
          scope: 'ulg-resident-inline',
          payload: { shouldNotCommit: true }
        },
        value: { ok: true }
      })
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_GPU_FENCE_UNSATISFIED');
      assert.equal(err.gpuFence.status, 'gpu-fence-report-missing');
      assert.equal(err.gpuFence.fenceSatisfied, false);
      return true;
    }
  );

  assert.equal(deltas.length, 0);
  assert.equal(computeManager.getStats().gpuResidentLanes.activeLeaseCount, 0);
  assert.equal(computeManager.getStats().gpuResidentLanes.completedLeaseCount, 1);
  assert.equal(computeManager.getStats().gpuResidentLanes.lastFence.status, 'gpu-fence-report-missing');
  assert.equal(computeManager.getStats().gpuResidentLanes.lastFence.fenceSatisfied, false);
  assert.equal(computeManager.getStats().totalTasksCompleted, 0);
  assert.equal(computeManager.getStats().totalTasksFailed, 1);
});
