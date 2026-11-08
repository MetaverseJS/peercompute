import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPUTE_GPU_FENCE_REPORT_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
  COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA,
  COMPUTE_TASK_PACKET_SCHEMA,
  COMPUTE_TASK_PLACEMENT_SCHEMA,
  ComputeManager
} from '../../src/peercompute/computeManager/ComputeManager.js';

test('ComputeManager commitDelta handler is invoked for inline tasks', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  let received = null;
  manager.setCommitDeltaHandler((delta) => {
    received = delta;
  });

  const result = await manager.submitTask({
    taskFamily: 'commit-delta-fixture',
    fn: () => ({
      commitDelta: { taskId: 'task-1', payload: { value: 7 } },
      value: 'ok'
    })
  });

  assert.equal(result, 'ok');
  assert.deepEqual(received, { taskId: 'task-1', payload: { value: 7 } });
  const stats = manager.getStats();
  assert.equal(stats.schema, 'peercompute.compute.manager-stats.v0');
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 1);
  assert.equal(stats.totalTasksFailed, 0);
  assert.equal(stats.inlineTasksCompleted, 1);
  assert.equal(stats.workerTasksCompleted, 0);
  assert.equal(stats.byRuntime.js.completed, 1);
  assert.equal(stats.byTaskFamily['commit-delta-fixture'].submitted, 1);
  assert.equal(stats.byTaskFamily['commit-delta-fixture'].completed, 1);
  assert.equal(stats.workerUtilization.schema, 'peercompute.compute.worker-utilization.v0');
  assert.equal(stats.workerUtilization.inline.executorId, 'inline');
  assert.equal(stats.workerUtilization.inline.submitted, 1);
  assert.equal(stats.workerUtilization.inline.completed, 1);
  assert.equal(stats.workerUtilization.inline.byRuntime.js.completed, 1);
  assert.equal(stats.workerUtilization.inline.byTaskFamily['commit-delta-fixture'].completed, 1);
  assert.equal(stats.workerUtilization.summary.totalCompleted, 1);
  assert.equal(stats.workerUtilization.summary.activeTaskCount, 0);
  assert.equal(Number.isFinite(stats.averageTaskDurationMs), true);
});

test('ComputeManager can return a task envelope without committing returned deltas', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitTask({
    taskFamily: 'remote-responder-fixture',
    suppressCommitDelta: true,
    returnEnvelope: true,
    fn: () => ({
      commitDelta: { taskId: 'remote-task-1', scope: 'remote-test', payload: { ok: true } },
      value: { ok: true }
    })
  });

  assert.deepEqual(result.commitDelta, { taskId: 'remote-task-1', scope: 'remote-test', payload: { ok: true } });
  assert.deepEqual(result.value, { ok: true });
  assert.equal(result.computeExecution.schema, 'peercompute.compute.task-execution.v0');
  assert.equal(result.computeExecution.executionMode, 'inline');
  assert.equal(result.computeExecution.executorId, 'inline');
  assert.equal(result.computeExecution.workerId, null);
  assert.equal(deltas.length, 0);
  assert.equal(manager.getStats().totalTasksCompleted, 1);
});

test('ComputeManager resolves result when no commitDelta is returned', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const result = await manager.submitTask({ fn: () => 123 });
  assert.equal(result, 123);
  assert.equal(manager.getCapabilities().stats.totalTasksCompleted, 1);
});

test('ComputeManager records failed inline tasks in stats', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  await assert.rejects(
    manager.submitTask({
      fn: () => {
        throw new Error('boom');
      }
    }),
    /boom/
  );
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 0);
  assert.equal(stats.totalTasksFailed, 1);
  assert.equal(stats.byRuntime.js.failed, 1);
  assert.equal(stats.byTaskFamily.js.failed, 1);
  assert.equal(stats.workerUtilization.inline.failed, 1);
  assert.equal(stats.workerUtilization.inline.activeTaskCount, 0);
  assert.equal(stats.workerUtilization.inline.byRuntime.js.failed, 1);
  assert.equal(stats.workerUtilization.inline.byTaskFamily.js.failed, 1);
});

test('ComputeManager records advisory task placement intent and actual local execution', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const result = await manager.submitTask({
    taskFamily: 'placement-fixture',
    placementHint: {
      solverKey: 'nbody',
      solverId: 'nbody-gravity',
      recommendedPlacement: 'cluster',
      syncMode: 'coarse-sync',
      confidence: 0.86,
      targetReplicaCount: 3,
      reasons: ['unit-test-cluster-capacity'],
      constraints: ['advisory-only']
    },
    fn: () => 42
  });

  assert.equal(result, 42);
  const placement = manager.getStats().taskPlacement;
  assert.equal(placement.schema, COMPUTE_TASK_PLACEMENT_SCHEMA);
  assert.equal(placement.totalSubmitted, 1);
  assert.equal(placement.totalCompleted, 1);
  assert.equal(placement.totalFailed, 0);
  assert.equal(placement.localSubmitted, 0);
  assert.equal(placement.remoteRequested, 1);
  assert.equal(placement.remoteExecuted, 0);
  assert.equal(placement.byRecommendedPlacement.cluster.submitted, 1);
  assert.equal(placement.byRecommendedPlacement.cluster.completed, 1);
  assert.equal(placement.byActualPlacement['local-inline'].submitted, 1);
  assert.equal(placement.byActualPlacement['local-inline'].completed, 1);
  assert.equal(placement.lastPlacement.schema, COMPUTE_TASK_PLACEMENT_SCHEMA);
  assert.equal(placement.lastPlacement.requestedPlacement, 'cluster');
  assert.equal(placement.lastPlacement.recommendedPlacement, 'cluster');
  assert.equal(placement.lastPlacement.actualPlacement, 'local-inline');
  assert.equal(placement.lastPlacement.solverKey, 'nbody');
  assert.equal(placement.lastPlacement.targetReplicaCount, 3);
  assert.deepEqual(placement.lastPlacement.reasons, ['unit-test-cluster-capacity']);
});

test('ComputeManager can delegate non-advisory remote placement through one manager hook', async () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    placementExecutor: async (payload, context) => {
      assert.equal(payload.placement.requestedPlacement, 'peer');
      assert.equal(context.placement.requestedPlacement, 'peer');
      assert.equal(payload.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      assert.equal(context.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      assert.match(payload.taskPacket.inputHash, /^fnv1a32-/);
      assert.match(payload.taskPacket.codeHash, /^fnv1a32-/);
      assert.match(payload.taskPacket.taskHash, /^fnv1a32-/);
      assert.equal(payload.taskEnvelope.schema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
      assert.equal(payload.taskEnvelope.signed, false);
      assert.equal(context.taskEnvelope.schema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
      return {
        value: {
          ok: true,
          mode: context.task.executionMode,
          taskFamily: payload.taskFamily
        },
        commitDelta: {
          taskId: payload.id,
          scope: 'remote-placement-test',
          version: 1,
          payload: { ok: true }
        },
        provenance: {
          executorId: 'peer-fixture-executor',
          peerId: 'peer-a',
          workerId: 'worker-a',
          outputHash: 'output-hash-a',
          resultSchema: 'peercompute.test.remote-result.v0',
          validated: true,
          redundantReplicaCount: 2,
          trustLevel: 'redundant-test'
        }
      };
    }
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitTask({
    id: 'remote-placement-task',
    taskFamily: 'remote-placement-fixture',
    placementHint: {
      solverKey: 'remote-fixture',
      requestedPlacement: 'peer',
      syncMode: 'coarse-sync',
      advisoryOnly: false,
      confidence: 0.91,
      targetReplicaCount: 1
    },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.deepEqual(result, {
    ok: true,
    mode: 'remote-peer',
    taskFamily: 'remote-placement-fixture'
  });
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].scope, 'remote-placement-test');
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 1);
  assert.equal(stats.inlineTasksCompleted, 0);
  assert.equal(stats.workerTasksCompleted, 0);
  assert.equal(stats.remoteTasksCompleted, 1);
  assert.equal(stats.taskPlacement.remoteRequested, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.completed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].submitted, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].completed, 1);
  assert.equal(stats.taskPlacement.lastPlacement.actualPlacement, 'remote-peer');
  assert.equal(stats.taskPlacement.lastPlacement.admission.reason, 'no-admission-hook');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.schema, COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.taskPacketSchema, COMPUTE_TASK_PACKET_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.taskEnvelopeSchema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.taskSigned, false);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.verification.schema, COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.verification.verified, true);
  assert.deepEqual(stats.taskPlacement.lastPlacement.provenance.verification.mismatchFields, []);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.verified, true);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validation.schema, COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validation.valid, true);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validation.reason, 'no-result-validator');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.schema, COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.attemptCount, 1);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.retryCount, 0);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.executorId, 'peer-fixture-executor');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.admissionReason, 'no-admission-hook');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.peerId, 'peer-a');
  assert.match(stats.taskPlacement.lastPlacement.provenance.inputHash, /^fnv1a32-/);
  assert.match(stats.taskPlacement.lastPlacement.provenance.codeHash, /^fnv1a32-/);
  assert.match(stats.taskPlacement.lastPlacement.provenance.taskHash, /^fnv1a32-/);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.outputHash, 'output-hash-a');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validated, true);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.redundantReplicaCount, 2);
  assert.equal(stats.remoteTaskAttempts, 1);
  assert.equal(stats.remoteTasksRetried, 0);
  assert.equal(stats.taskPlacement.remoteAttempts, 1);
  assert.equal(stats.taskPlacement.remoteRetried, 0);
  assert.equal(manager.getCapabilities().placementExecutor, true);
  assert.equal(manager.getCapabilities().placementExecutorId, 'placementExecutor');
  assert.equal(manager.getCapabilities().placementAdmission, false);
  assert.equal(manager.getCapabilities().placementTimeoutMs, 30000);
  assert.equal(manager.getCapabilities().placementRetryPolicy.schema, COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA);
  assert.equal(manager.getCapabilities().placementRetryPolicy.maxAttempts, 1);
  assert.equal(manager.getCapabilities().remoteResultVerification, true);
  assert.equal(manager.getCapabilities().placementResultValidator, false);
  assert.equal(manager.getCapabilities().placementTaskSigner, false);
});

test('ComputeManager accepts remote placement only after required GPU fence evidence is satisfied', async () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    placementExecutor: async (payload, context) => {
      assert.equal(payload.gpuFence.schema, 'peercompute.compute.gpu-fence-requirement.v0');
      assert.equal(payload.gpuFence.required, true);
      assert.equal(payload.gpuFence.laneId, 'ulg-resident-lane:a');
      assert.equal(payload.gpuFence.stateKey, 'ulg:sph-state');
      assert.equal(payload.taskPacket.gpuFenceRequired, true);
      assert.equal(payload.taskPacket.gpuLaneId, 'ulg-resident-lane:a');
      assert.equal(context.taskPacket.gpuQueueFencePolicy, 'queue.onSubmittedWorkDone');
      return {
        value: {
          ok: true,
          gpuFenceAccepted: true
        },
        provenance: {
          executorId: 'gpu-fence-peer-executor',
          peerId: 'peer-gpu-a',
          workerId: 'worker-gpu-a',
          gpuFence: {
            status: 'queue-work-completed',
            method: 'queue.onSubmittedWorkDone',
            laneId: 'ulg-resident-lane:a',
            stateKey: 'ulg:sph-state',
            queueFencePolicy: 'queue.onSubmittedWorkDone',
            retainedBufferRefs: ['sph-state-buffer', 'mls-mechanics-buffer'],
            workerId: 'worker-gpu-a'
          }
        }
      };
    }
  });

  const result = await manager.submitTask({
    id: 'remote-gpu-fence-task',
    taskFamily: 'ulg-resident-gpu-lane',
    placementHint: {
      solverKey: 'ulg-resident-step',
      requestedPlacement: 'peer',
      advisoryOnly: false,
      peerId: 'peer-gpu-a'
    },
    webgpu: {
      fenceRequired: true,
      laneId: 'ulg-resident-lane:a',
      stateKey: 'ulg:sph-state',
      queueFencePolicy: 'queue.onSubmittedWorkDone',
      retainedBufferRefs: ['sph-state-buffer', 'mls-mechanics-buffer']
    },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.deepEqual(result, { ok: true, gpuFenceAccepted: true });
  const provenance = manager.getStats().taskPlacement.lastPlacement.provenance;
  assert.equal(provenance.schema, COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(provenance.gpuFence.schema, COMPUTE_GPU_FENCE_REPORT_SCHEMA);
  assert.equal(provenance.gpuFence.status, 'queue-work-completed');
  assert.equal(provenance.gpuFence.fenceSatisfied, true);
  assert.equal(provenance.gpuFence.laneId, 'ulg-resident-lane:a');
  assert.equal(provenance.gpuFence.stateKey, 'ulg:sph-state');
  assert.deepEqual(provenance.gpuFence.retainedBufferRefs, ['sph-state-buffer', 'mls-mechanics-buffer']);
  assert.equal(provenance.gpuFenceSatisfied, true);
  assert.equal(provenance.verification.verified, true);
  assert.equal(provenance.verification.reason, 'hashes-match');
  assert.equal(provenance.verification.checks.find((check) => check.field === 'gpuFence').ok, true);
});

test('ComputeManager rejects remote placement when a required GPU fence report is missing', async () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    placementExecutor: async () => ({
      value: { ok: true },
      commitDelta: {
        taskId: 'remote-gpu-fence-missing-task',
        scope: 'gpu-fence-missing',
        payload: { shouldNotCommit: true }
      },
      provenance: {
        executorId: 'gpu-fence-missing-executor',
        peerId: 'peer-gpu-missing'
      }
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  await assert.rejects(
    manager.submitTask({
      id: 'remote-gpu-fence-missing-task',
      taskFamily: 'ulg-resident-gpu-lane',
      placementHint: {
        solverKey: 'ulg-resident-step',
        requestedPlacement: 'peer',
        advisoryOnly: false,
        peerId: 'peer-gpu-missing'
      },
      gpuFence: {
        required: true,
        laneId: 'ulg-resident-lane:missing',
        stateKey: 'ulg:sph-state',
        queueFencePolicy: 'queue.onSubmittedWorkDone'
      },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_VERIFICATION');
      assert.equal(err.reason, 'gpu-fence-missing-or-unsatisfied');
      assert.deepEqual(err.verification.mismatchFields, ['gpuFence']);
      assert.equal(err.provenance.gpuFence.status, 'gpu-fence-report-missing');
      assert.equal(err.provenance.gpuFence.fenceSatisfied, false);
      return true;
    }
  );

  assert.equal(deltas.length, 0);
  const lastPlacement = manager.getStats().taskPlacement.lastPlacement;
  assert.equal(lastPlacement.errorKind, 'verification-failed');
  assert.equal(lastPlacement.provenance.verification.reason, 'gpu-fence-missing-or-unsatisfied');
  assert.deepEqual(lastPlacement.provenance.verification.mismatchFields, ['gpuFence']);
  assert.equal(lastPlacement.provenance.gpuFenceSatisfied, false);
});

test('ComputeManager attaches signed task envelopes before remote admission and execution', async () => {
  let signerCalled = false;
  let admissionCalled = false;
  let executorCalled = false;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementTaskSignerId: 'node-a-signer',
    placementTaskSigner: async (taskPacket, context) => {
      signerCalled = true;
      assert.equal(taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      assert.equal(context.taskPacket.taskHash, taskPacket.taskHash);
      assert.equal(context.mode, 'remote-cluster');
      return {
        signature: `sig:${taskPacket.taskHash}`,
        signatureAlgorithm: 'unit-test-signature',
        signerId: 'node-a'
      };
    },
    placementAdmission: (payload, context) => {
      admissionCalled = true;
      assert.equal(payload.taskEnvelope.schema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
      assert.equal(payload.taskEnvelope.signed, true);
      assert.equal(context.taskEnvelope.signature, `sig:${payload.taskPacket.taskHash}`);
      return true;
    },
    placementExecutor: async (payload, context) => {
      executorCalled = true;
      assert.equal(payload.taskEnvelope.schema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
      assert.equal(payload.taskEnvelope.signed, true);
      assert.equal(payload.taskEnvelope.signerId, 'node-a');
      assert.equal(context.taskEnvelope.signatureAlgorithm, 'unit-test-signature');
      return {
        value: { ok: true, signed: payload.taskEnvelope.signed },
        provenance: {
          executorId: 'signed-envelope-executor',
          peerId: 'peer-signed'
        }
      };
    }
  });

  const result = await manager.submitTask({
    id: 'remote-signed-task',
    taskFamily: 'remote-placement-fixture',
    placementHint: {
      solverKey: 'remote-fixture',
      requestedPlacement: 'cluster',
      advisoryOnly: false
    },
    data: { value: 77 },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.deepEqual(result, { ok: true, signed: true });
  assert.equal(signerCalled, true);
  assert.equal(admissionCalled, true);
  assert.equal(executorCalled, true);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksCompleted, 1);
  assert.equal(stats.remoteTasksCompleted, 1);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.taskEnvelopeSchema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.taskSigned, true);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.signerId, 'node-a');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.signatureAlgorithm, 'unit-test-signature');
  assert.equal(manager.getCapabilities().placementTaskSigner, true);
  assert.equal(manager.getCapabilities().placementTaskSignerId, 'node-a-signer');
});

test('ComputeManager can configure remote placement hooks after construction', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  assert.equal(manager.getCapabilities().placementExecutor, false);
  assert.equal(manager.getCapabilities().placementAdmission, false);
  assert.equal(manager.getCapabilities().placementTaskSigner, false);
  assert.equal(manager.getCapabilities().placementResultValidator, false);

  let signerCalled = false;
  let admissionCalled = false;
  let executorCalled = false;
  let validatorCalled = false;
  const configured = manager.configurePlacementHooks({
    placementExecutorId: 'late-peer-executor',
    placementExecutor: async (payload, context) => {
      executorCalled = true;
      assert.equal(context.mode, 'remote-peer');
      assert.equal(payload.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      assert.equal(payload.taskEnvelope.signed, true);
      return {
        value: { ok: true, remote: true },
        provenance: {
          executorId: 'late-peer-executor',
          peerId: 'peer-late'
        }
      };
    },
    placementAdmissionId: 'late-admission',
    placementAdmission: (payload, context) => {
      admissionCalled = true;
      assert.equal(context.mode, 'remote-peer');
      assert.equal(payload.taskEnvelope.signed, true);
      return true;
    },
    placementTaskSignerId: 'late-signer',
    placementTaskSigner: (taskPacket, context) => {
      signerCalled = true;
      assert.equal(context.mode, 'remote-peer');
      return {
        signature: `late:${taskPacket.taskHash}`,
        signatureAlgorithm: 'unit-test-late-signature',
        signerId: 'late-signer'
      };
    },
    placementResultValidatorId: 'late-validator',
    placementResultValidator: (finalResult, context) => {
      validatorCalled = true;
      assert.deepEqual(finalResult, { ok: true, remote: true });
      assert.equal(context.provenance.peerId, 'peer-late');
      return { valid: true, reason: 'late-validator-accepted' };
    },
    placementTimeoutMs: 1234,
    placementRetryPolicy: {
      maxAttempts: 2,
      baseDelayMs: 0,
      maxDelayMs: 10,
      jitterFraction: 0
    }
  });

  assert.equal(configured.placementExecutor, true);
  assert.equal(configured.placementExecutorId, 'late-peer-executor');
  assert.equal(configured.placementAdmission, true);
  assert.equal(configured.placementAdmissionId, 'late-admission');
  assert.equal(configured.placementTaskSigner, true);
  assert.equal(configured.placementTaskSignerId, 'late-signer');
  assert.equal(configured.placementResultValidator, true);
  assert.equal(configured.placementResultValidatorId, 'late-validator');
  assert.equal(configured.placementTimeoutMs, 1234);
  assert.equal(configured.placementRetryPolicy.maxAttempts, 2);

  const result = await manager.submitTask({
    id: 'late-remote-task',
    taskFamily: 'late-remote-fixture',
    placementHint: {
      solverKey: 'late-remote-fixture',
      requestedPlacement: 'peer',
      advisoryOnly: false,
      peerId: 'peer-late'
    },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.deepEqual(result, { ok: true, remote: true });
  assert.equal(signerCalled, true);
  assert.equal(admissionCalled, true);
  assert.equal(executorCalled, true);
  assert.equal(validatorCalled, true);

  const stats = manager.getStats();
  assert.equal(stats.remoteTasksCompleted, 1);
  assert.equal(stats.taskPlacement.lastPlacement.actualPlacement, 'remote-peer');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.executorId, 'late-peer-executor');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validation.reason, 'late-validator-accepted');

  const cleared = manager.configurePlacementHooks({
    placementExecutor: null,
    placementAdmission: null,
    placementTaskSigner: null,
    placementResultValidator: null
  });
  assert.equal(cleared.placementExecutor, false);
  assert.equal(cleared.placementExecutorId, null);
  assert.equal(cleared.placementAdmission, false);
  assert.equal(cleared.placementAdmissionId, null);
  assert.equal(cleared.placementTaskSigner, false);
  assert.equal(cleared.placementTaskSignerId, null);
  assert.equal(cleared.placementResultValidator, false);
  assert.equal(cleared.placementResultValidatorId, null);
});

test('ComputeManager retries transient remote placement executor failures before committing result', async () => {
  const deltas = [];
  let attempts = 0;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementMaxAttempts: 3,
    placementRetryBaseDelayMs: 0,
    placementExecutor: async (payload, context) => {
      attempts += 1;
      assert.equal(context.attempt, attempts);
      assert.equal(context.retryPolicy.maxAttempts, 3);
      assert.equal(payload.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      if (attempts === 1) {
        throw new Error('transient remote executor failure');
      }
      return {
        value: { ok: true, attempt: attempts },
        commitDelta: {
          taskId: payload.id,
          scope: 'remote-retry-test',
          version: 1,
          payload: { attempt: attempts }
        },
        provenance: {
          executorId: 'retry-peer-executor',
          peerId: 'peer-retry',
          outputHash: 'output-retry'
        }
      };
    }
  });
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitTask({
    id: 'remote-retry-task',
    taskFamily: 'remote-placement-fixture',
    placementHint: {
      solverKey: 'remote-fixture',
      requestedPlacement: 'peer',
      advisoryOnly: false
    },
    data: { value: 123 },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.deepEqual(result, { ok: true, attempt: 2 });
  assert.equal(attempts, 2);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].payload.attempt, 2);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 1);
  assert.equal(stats.totalTasksFailed, 0);
  assert.equal(stats.remoteTasksCompleted, 1);
  assert.equal(stats.remoteTasksFailed, 0);
  assert.equal(stats.remoteTaskAttempts, 2);
  assert.equal(stats.remoteTasksRetried, 1);
  assert.equal(stats.remoteTasksRetryExhausted, 0);
  assert.equal(stats.taskPlacement.remoteAttempts, 2);
  assert.equal(stats.taskPlacement.remoteRetried, 1);
  assert.equal(stats.taskPlacement.remoteRetryExhausted, 0);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.attempted, 2);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.retried, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].attempted, 2);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].retried, 1);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.schema, COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.attemptCount, 2);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.retryCount, 1);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.retried, true);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.events.length, 1);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.events[0].errorKind, 'executor-error');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.retry.events[0].retryScheduled, true);
});

test('ComputeManager reports retry exhaustion after transient remote placement failures keep failing', async () => {
  let attempts = 0;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementMaxAttempts: 2,
    placementRetryBaseDelayMs: 0,
    placementExecutor: async (payload, context) => {
      attempts += 1;
      assert.equal(context.attempt, attempts);
      assert.equal(payload.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      throw new Error(`persistent remote executor failure ${attempts}`);
    }
  });

  await assert.rejects(
    manager.submitTask({
      id: 'remote-retry-exhausted-task',
      taskFamily: 'remote-placement-fixture',
      placementHint: {
        solverKey: 'remote-fixture',
        requestedPlacement: 'cluster',
        advisoryOnly: false
      },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    /persistent remote executor failure 2/
  );

  assert.equal(attempts, 2);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 0);
  assert.equal(stats.totalTasksFailed, 1);
  assert.equal(stats.remoteTasksCompleted, 0);
  assert.equal(stats.remoteTasksFailed, 1);
  assert.equal(stats.remoteTaskAttempts, 2);
  assert.equal(stats.remoteTasksRetried, 1);
  assert.equal(stats.remoteTasksRetryExhausted, 1);
  assert.equal(stats.taskPlacement.remoteAttempts, 2);
  assert.equal(stats.taskPlacement.remoteRetried, 1);
  assert.equal(stats.taskPlacement.remoteRetryExhausted, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.cluster.retryExhausted, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-cluster'].retryExhausted, 1);
  assert.equal(stats.taskPlacement.lastPlacement.ok, false);
  assert.equal(stats.taskPlacement.lastPlacement.errorKind, 'executor-error');
  assert.equal(stats.taskPlacement.lastPlacement.retry.schema, COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA);
  assert.equal(stats.taskPlacement.lastPlacement.retry.attemptCount, 2);
  assert.equal(stats.taskPlacement.lastPlacement.retry.retryCount, 1);
  assert.equal(stats.taskPlacement.lastPlacement.retry.exhausted, true);
  assert.equal(stats.taskPlacement.lastPlacement.retry.events.length, 2);
  assert.equal(stats.taskPlacement.lastPlacement.retry.events[0].retryScheduled, true);
  assert.equal(stats.taskPlacement.lastPlacement.retry.events[1].retryScheduled, false);
  assert.equal(stats.taskPlacement.lastPlacement.retry.events[1].exhausted, true);
});

test('ComputeManager rejects remote placement when provenance hashes do not match task packet', async () => {
  let attempts = 0;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementMaxAttempts: 3,
    placementRetryBaseDelayMs: 0,
    placementExecutor: async () => {
      attempts += 1;
      return {
        value: { ok: true },
        provenance: {
          executorId: 'bad-peer-executor',
          peerId: 'peer-b',
          inputHash: 'fnv1a32-deadbeef'
        }
      };
    }
  });

  await assert.rejects(
    manager.submitTask({
      id: 'remote-hash-mismatch-task',
      taskFamily: 'remote-placement-fixture',
      placementHint: {
        solverKey: 'remote-fixture',
        requestedPlacement: 'peer',
        advisoryOnly: false
      },
      data: { value: 42 },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_VERIFICATION');
      assert.equal(err.reason, 'hash-mismatch');
      assert.equal(err.placementMode, 'remote-peer');
      assert.equal(err.verification.schema, COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA);
      assert.equal(err.verification.verified, false);
      assert.deepEqual(err.verification.mismatchFields, ['inputHash']);
      assert.equal(err.provenance.inputHash, 'fnv1a32-deadbeef');
      return true;
    }
  );

  assert.equal(attempts, 1);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 0);
  assert.equal(stats.totalTasksFailed, 1);
  assert.equal(stats.remoteTasksCompleted, 0);
  assert.equal(stats.remoteTasksFailed, 1);
  assert.equal(stats.remoteTasksVerificationFailed, 1);
  assert.equal(stats.remoteTaskAttempts, 1);
  assert.equal(stats.remoteTasksRetried, 0);
  assert.equal(stats.taskPlacement.remoteRequested, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 0);
  assert.equal(stats.taskPlacement.remoteFailed, 1);
  assert.equal(stats.taskPlacement.remoteVerificationFailed, 1);
  assert.equal(stats.taskPlacement.remoteAttempts, 1);
  assert.equal(stats.taskPlacement.remoteRetried, 0);
  assert.equal(stats.taskPlacement.lastPlacement.actualPlacement, 'remote-peer');
  assert.equal(stats.taskPlacement.lastPlacement.ok, false);
  assert.equal(stats.taskPlacement.lastPlacement.errorKind, 'verification-failed');
  assert.equal(stats.taskPlacement.lastPlacement.retry.retryCount, 0);
  assert.equal(stats.taskPlacement.lastPlacement.retry.finalErrorKind, 'verification-failed');
  assert.equal(stats.taskPlacement.lastPlacement.retry.events[0].terminal, true);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.verification.verified, false);
  assert.deepEqual(stats.taskPlacement.lastPlacement.provenance.verification.mismatchFields, ['inputHash']);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.verificationFailed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].verificationFailed, 1);
});

test('ComputeManager rejects remote placement when result validator denies it', async () => {
  const deltas = [];
  const manager = new ComputeManager({
    enableWorkers: false,
    placementResultValidatorId: 'redundant-replay-validator',
    placementResultValidator: (result, context) => {
      assert.equal(result.ok, true);
      assert.equal(context.provenance.verified, true);
      assert.equal(context.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      return {
        valid: false,
        reason: 'redundant-replay-mismatch',
        replicaCount: 2
      };
    },
    placementExecutor: async () => ({
      value: { ok: true },
      commitDelta: {
        taskId: 'remote-validation-task',
        scope: 'remote-validation-test',
        version: 1,
        payload: { shouldNotCommit: true }
      },
      provenance: {
        executorId: 'peer-validation-executor',
        peerId: 'peer-c'
      }
    })
  });
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  await assert.rejects(
    manager.submitTask({
      id: 'remote-validation-task',
      taskFamily: 'remote-placement-fixture',
      placementHint: {
        solverKey: 'remote-fixture',
        requestedPlacement: 'peer',
        advisoryOnly: false
      },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_VALIDATION');
      assert.equal(err.reason, 'redundant-replay-mismatch');
      assert.equal(err.validation.schema, COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA);
      assert.equal(err.validation.validationId, 'redundant-replay-validator');
      assert.equal(err.validation.valid, false);
      assert.equal(err.provenance.validation.reason, 'redundant-replay-mismatch');
      return true;
    }
  );

  assert.equal(deltas.length, 0);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 0);
  assert.equal(stats.totalTasksFailed, 1);
  assert.equal(stats.remoteTasksCompleted, 0);
  assert.equal(stats.remoteTasksFailed, 1);
  assert.equal(stats.remoteTasksValidationFailed, 1);
  assert.equal(stats.taskPlacement.remoteRequested, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 0);
  assert.equal(stats.taskPlacement.remoteFailed, 1);
  assert.equal(stats.taskPlacement.remoteValidationFailed, 1);
  assert.equal(stats.taskPlacement.lastPlacement.actualPlacement, 'remote-peer');
  assert.equal(stats.taskPlacement.lastPlacement.errorKind, 'validation-failed');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validation.valid, false);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.validationFailed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].validationFailed, 1);
  assert.equal(manager.getCapabilities().placementResultValidator, true);
  assert.equal(manager.getCapabilities().placementResultValidatorId, 'redundant-replay-validator');
});

test('ComputeManager rejects non-advisory remote placement before execution when admission denies it', async () => {
  let executorCalled = false;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementAdmissionId: 'bandwidth-gate',
    placementAdmission: () => ({
      accepted: false,
      reason: 'bandwidth-below-floor',
      bandwidthMbps: 0.5,
      retryAfterMs: 2500
    }),
    placementExecutor: () => {
      executorCalled = true;
      throw new Error('executor should not run after admission denial');
    }
  });

  await assert.rejects(
    manager.submitTask({
      id: 'remote-rejected-task',
      taskFamily: 'remote-rejected-fixture',
      placementHint: {
        solverKey: 'remote-rejected-fixture',
        requestedPlacement: 'peer',
        advisoryOnly: false
      },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_REJECTED');
      assert.equal(err.reason, 'bandwidth-below-floor');
      assert.equal(err.placementMode, 'remote-peer');
      assert.equal(err.admission.admissionId, 'bandwidth-gate');
      return true;
    }
  );

  assert.equal(executorCalled, false);
  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 0);
  assert.equal(stats.totalTasksFailed, 1);
  assert.equal(stats.inlineTasksCompleted, 0);
  assert.equal(stats.workerTasksCompleted, 0);
  assert.equal(stats.remoteTasksCompleted, 0);
  assert.equal(stats.remoteTasksFailed, 1);
  assert.equal(stats.remoteTasksRejected, 1);
  assert.equal(stats.activeTaskCount, 0);
  assert.equal(stats.taskPlacement.remoteRequested, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 0);
  assert.equal(stats.taskPlacement.remoteFailed, 1);
  assert.equal(stats.taskPlacement.remoteRejected, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.failed, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.rejected, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].failed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].rejected, 1);
  assert.equal(stats.taskPlacement.lastPlacement.actualPlacement, 'remote-peer');
  assert.equal(stats.taskPlacement.lastPlacement.errorKind, 'rejected');
  assert.equal(stats.taskPlacement.lastPlacement.admission.admissionId, 'bandwidth-gate');
  assert.equal(stats.taskPlacement.lastPlacement.admission.reason, 'bandwidth-below-floor');
  assert.equal(manager.getCapabilities().placementAdmission, true);
  assert.equal(manager.getCapabilities().placementAdmissionId, 'bandwidth-gate');
});

test('ComputeManager times out stalled non-advisory remote placement tasks', async () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    placementTimeoutMs: 8,
    placementExecutor: () => new Promise(() => {})
  });

  await assert.rejects(
    manager.submitTask({
      id: 'remote-timeout-task',
      taskFamily: 'remote-timeout-fixture',
      placementHint: {
        solverKey: 'remote-timeout-fixture',
        requestedPlacement: 'cluster',
        advisoryOnly: false,
        timeoutMs: 8
      },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_TIMEOUT');
      assert.equal(err.timeoutMs, 8);
      assert.equal(err.placementMode, 'remote-cluster');
      return true;
    }
  );

  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 0);
  assert.equal(stats.totalTasksFailed, 1);
  assert.equal(stats.inlineTasksCompleted, 0);
  assert.equal(stats.workerTasksCompleted, 0);
  assert.equal(stats.remoteTasksCompleted, 0);
  assert.equal(stats.remoteTasksFailed, 1);
  assert.equal(stats.remoteTasksTimedOut, 1);
  assert.equal(stats.activeTaskCount, 0);
  assert.equal(stats.taskPlacement.remoteRequested, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 0);
  assert.equal(stats.taskPlacement.remoteFailed, 1);
  assert.equal(stats.taskPlacement.remoteTimedOut, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.cluster.failed, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.cluster.timedOut, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-cluster'].failed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-cluster'].timedOut, 1);
  assert.equal(stats.taskPlacement.lastPlacement.actualPlacement, 'remote-cluster');
  assert.equal(stats.taskPlacement.lastPlacement.errorKind, 'timeout');
  assert.match(stats.taskPlacement.lastPlacement.errorMessage, /timed out/);
});

test('ComputeManager read-through cache remains blocked until authority admission', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const graph = {
    graphId: 'cache-authority-fixture',
    cachePolicy: {
      mode: 'read-through',
      scope: 'unit-cache-authority'
    },
    cacheInputs: {
      lawGraphId: 'unit-law-graph',
      lawIds: ['mechanics:test'],
      stateRefs: ['state:fixture'],
      invalidationRefs: ['law:mechanics:test:v1'],
      values: {
        fixture: 'cache-admission'
      }
    },
    cacheAdmission: {
      status: 'recorded-not-admitted',
      admitted: false,
      authority: 'state-manager-required'
    },
    nodes: [
      {
        id: 'node-a',
        task: {
          id: 'cache-authority-task-a',
          taskFamily: 'cache-authority-fixture',
          fn: () => ({ ok: true })
        }
      }
    ]
  };

  const first = await manager.submitTaskGraph(graph);
  assert.equal(first.cacheHit, false);
  assert.equal(first.cacheArtifact.admitted, false);
  assert.equal(manager.getStats().totalTasksCompleted, 1);

  const second = await manager.submitTaskGraph(graph);
  assert.equal(second.cacheHit, false);
  assert.equal(manager.getStats().taskGraphCacheReadBlocked, 1);
  assert.equal(manager.getStats().totalTasksCompleted, 2);

  const admitted = manager.admitTaskGraphCacheArtifact(first.cacheKey, {
    cacheKey: first.cacheKey,
    admissionId: 'state-admission-1',
    authority: 'state-manager',
    validatorId: 'cpu-oracle',
    reason: 'unit-test-authority-admitted',
    invalidationRefs: ['law:mechanics:test:v1'],
    admittedAt: 123
  });
  assert.equal(admitted.admitted, true);
  assert.equal(admitted.status, 'admitted-cache-artifact-recorded');
  assert.equal(manager.getStats().taskGraphCacheArtifactsAdmitted, 1);

  const third = await manager.submitTaskGraph(graph);
  assert.equal(third.cacheHit, true);
  assert.equal(third.cacheAdmissionStatus, 'admitted');
  assert.deepEqual(third.nodeResults['node-a'], { ok: true });
  assert.equal(manager.getStats().totalTasksCompleted, 2);

  const invalidated = manager.invalidateTaskGraphCacheArtifact(first.cacheKey, {
    cacheKey: first.cacheKey,
    reason: 'unit-test-invalidation'
  });
  assert.equal(invalidated.admitted, false);
  assert.equal(invalidated.status, 'invalidated');
  assert.equal(manager.getStats().taskGraphCacheInvalidations, 1);

  const fourth = await manager.submitTaskGraph(graph);
  assert.equal(fourth.cacheHit, false);
  assert.equal(manager.getStats().totalTasksCompleted, 3);
});

test('ComputeManager task graph resultInputs inject completed node results into downstream task data', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const graph = {
    graphId: 'task-graph-result-inputs-fixture',
    cachePolicy: {
      mode: 'record-only',
      scope: 'unit-result-inputs'
    },
    nodes: [
      {
        id: 'source-node',
        task: {
          id: 'result-input-source',
          taskFamily: 'result-inputs-fixture',
          fn: () => ({
            value: 7,
            rows: new Float32Array([1.5, 2.5]),
            dropMe() {
              return 'not-cloneable';
            }
          })
        }
      },
      {
        id: 'consumer-node',
        dependsOn: ['source-node'],
        resultInputs: {
          upstream: 'source-node'
        },
        task: {
          id: 'result-input-consumer',
          taskFamily: 'result-inputs-fixture',
          data: {
            local: 3
          },
          fn: (data) => ({
            upstreamValue: data.upstream.value,
            upstreamRow0: data.upstream.rows[0],
            upstreamFunctionDropped: Object.prototype.hasOwnProperty.call(data.upstream, 'dropMe') === false,
            local: data.local
          })
        }
      }
    ]
  };

  const result = await manager.submitTaskGraph(graph);
  assert.equal(result.nodeResults['consumer-node'].upstreamValue, 7);
  assert.equal(result.nodeResults['consumer-node'].upstreamRow0, 1.5);
  assert.equal(result.nodeResults['consumer-node'].upstreamFunctionDropped, true);
  assert.equal(result.nodeResults['consumer-node'].local, 3);
});

test('ComputeManager task graph cache artifacts preserve graph state seed payloads', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const stateSeedPayload = {
    schema: 'peercompute.test.task-graph-state-seed.v0',
    cacheKey: 'task-graph-state-seed:fixture',
    stateKey: 'state:seeded-fixture',
    centerOfMass: [1, 2, 3],
    state: {
      particleCount: 2
    }
  };
  const graph = {
    graphId: 'task-graph-state-seed-fixture',
    cachePolicy: {
      mode: 'read-through',
      scope: 'unit-state-seed-cache'
    },
    cacheInputs: {
      graphFamily: 'state-seed-fixture',
      stateFamilies: ['particle-kinematics'],
      values: {
        fixture: 'state-seed'
      }
    },
    stateSeedPayload,
    cacheAdmission: {
      status: 'recorded-not-admitted',
      admitted: false,
      authority: 'state-manager-required'
    },
    nodes: [
      {
        id: 'seed-node',
        task: {
          id: 'state-seed-task',
          taskFamily: 'state-seed-fixture',
          fn: () => ({ ok: true })
        }
      }
    ]
  };

  const first = await manager.submitTaskGraph(graph);
  assert.equal(first.cacheHit, false);
  assert.deepEqual(first.stateSeedPayload, stateSeedPayload);
  assert.deepEqual(first.cacheArtifact.stateSeedPayload, stateSeedPayload);

  manager.admitTaskGraphCacheArtifact(first.cacheKey, {
    cacheKey: first.cacheKey,
    admissionId: 'state-seed-admission',
    authority: 'state-manager',
    validatorId: 'state-seed-fixture-validator',
    reason: 'unit-test-state-seed-admitted'
  });

  const cached = await manager.submitTaskGraph(graph);
  assert.equal(cached.cacheHit, true);
  assert.deepEqual(cached.stateSeedPayload, stateSeedPayload);
  assert.deepEqual(cached.cacheArtifact.stateSeedPayload, stateSeedPayload);
});
