import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
  ComputeManager
} from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  createRemoteResultQuorumValidator,
  evaluateRemoteResultQuorum,
  normalizeRemoteResultQuorumOptions,
  REMOTE_RESULT_QUORUM_POLICY_SCHEMA,
  REMOTE_RESULT_QUORUM_REPORT_SCHEMA
} from '../../src/peercompute/computeManager/RemoteResultQuorumValidator.js';

test('remote result quorum validator accepts matching replica hashes', () => {
  const policy = normalizeRemoteResultQuorumOptions({
    validationId: 'unit-quorum',
    minReplicaCount: 2
  });

  assert.equal(policy.schema, REMOTE_RESULT_QUORUM_POLICY_SCHEMA);
  assert.equal(policy.minMatchingReplicas, 2);

  const report = evaluateRemoteResultQuorum({ ok: true }, {
    commitDelta: { scope: 'test', payload: { ok: true } },
    provenance: {
      outputHash: 'result-a',
      commitDeltaHash: 'delta-a',
      replicas: [
        {
          peerId: 'peer-b',
          outputHash: 'result-a',
          commitDeltaHash: 'delta-a'
        }
      ]
    }
  }, policy);

  assert.equal(report.schema, COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA);
  assert.equal(report.quorumSchema, REMOTE_RESULT_QUORUM_REPORT_SCHEMA);
  assert.equal(report.valid, true);
  assert.equal(report.reason, 'quorum-accepted');
  assert.equal(report.totalResultCount, 2);
  assert.equal(report.matchingResultCount, 2);
  assert.equal(report.replicas[0].matchesPrimary, true);
});

test('remote result quorum validator rejects mismatched replica hashes', () => {
  const report = evaluateRemoteResultQuorum({ ok: true }, {
    provenance: {
      outputHash: 'result-a',
      replicas: [
        {
          peerId: 'peer-b',
          outputHash: 'result-b'
        }
      ]
    }
  }, {
    validationId: 'strict-quorum',
    minReplicaCount: 2,
    minMatchingReplicas: 2,
    compareCommitDeltaHash: false
  });

  assert.equal(report.valid, false);
  assert.equal(report.reason, 'quorum-mismatch');
  assert.equal(report.totalResultCount, 2);
  assert.equal(report.matchingResultCount, 1);
  assert.equal(report.replicas[0].matchesPrimary, false);
});

test('remote result quorum validator integrates with ComputeManager before committing deltas', async () => {
  const deltas = [];
  const validator = createRemoteResultQuorumValidator({
    validationId: 'manager-quorum',
    minReplicaCount: 2,
    minMatchingReplicas: 2
  });
  const manager = new ComputeManager({
    enableWorkers: false,
    placementResultValidator: validator,
    placementExecutor: async (payload) => ({
      value: { ok: true },
      commitDelta: {
        taskId: payload.id,
        scope: 'quorum-test',
        version: 1,
        payload: { ok: true }
      },
      provenance: {
        executorId: 'primary-peer',
        peerId: 'peer-a',
        outputHash: 'result-a',
        commitDeltaHash: 'delta-a',
        replicas: [
          {
            peerId: 'peer-b',
            outputHash: 'result-a',
            commitDeltaHash: 'delta-a',
            codeHash: payload.taskPacket.codeHash,
            inputHash: payload.taskPacket.inputHash,
            taskHash: payload.taskPacket.taskHash
          }
        ]
      }
    })
  });
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitTask({
    id: 'quorum-remote-task',
    taskFamily: 'remote-quorum-fixture',
    placementHint: {
      requestedPlacement: 'peer',
      advisoryOnly: false
    },
    data: { value: 1 },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.deepEqual(result, { ok: true });
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].scope, 'quorum-test');
  const provenance = manager.getStats().taskPlacement.lastPlacement.provenance;
  assert.equal(provenance.replicaCount, 1);
  assert.equal(provenance.validation.validationId, 'manager-quorum');
  assert.equal(provenance.validation.valid, true);
  assert.equal(provenance.validation.quorumSchema, REMOTE_RESULT_QUORUM_REPORT_SCHEMA);
  assert.equal(provenance.validation.matchingResultCount, 2);
  assert.equal(manager.getCapabilities().placementResultValidatorId, 'manager-quorum');
});

test('remote result quorum validator prevents mismatched remote delta commits', async () => {
  const deltas = [];
  const manager = new ComputeManager({
    enableWorkers: false,
    placementResultValidator: createRemoteResultQuorumValidator({
      validationId: 'mismatch-quorum',
      minReplicaCount: 2,
      minMatchingReplicas: 2,
      compareCommitDeltaHash: false
    }),
    placementExecutor: async () => ({
      value: { ok: true },
      commitDelta: {
        taskId: 'quorum-mismatch-task',
        scope: 'quorum-test',
        version: 1,
        payload: { shouldNotCommit: true }
      },
      provenance: {
        executorId: 'primary-peer',
        peerId: 'peer-a',
        outputHash: 'result-a',
        replicas: [
          {
            peerId: 'peer-b',
            outputHash: 'result-b'
          }
        ]
      }
    })
  });
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  await assert.rejects(
    manager.submitTask({
      id: 'quorum-mismatch-task',
      taskFamily: 'remote-quorum-fixture',
      placementHint: {
        requestedPlacement: 'cluster',
        advisoryOnly: false
      },
      fn: () => {
        throw new Error('local path should not run');
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_COMPUTE_PLACEMENT_VALIDATION');
      assert.equal(err.reason, 'quorum-mismatch');
      assert.equal(err.validation.validationId, 'mismatch-quorum');
      assert.equal(err.validation.matchingResultCount, 1);
      return true;
    }
  );

  assert.equal(deltas.length, 0);
  const stats = manager.getStats();
  assert.equal(stats.remoteTasksValidationFailed, 1);
  assert.equal(stats.taskPlacement.remoteValidationFailed, 1);
  assert.equal(stats.taskPlacement.lastPlacement.provenance.validation.reason, 'quorum-mismatch');
});
