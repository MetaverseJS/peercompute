import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  createPlacementAdmissionPolicy,
  evaluatePlacementAdmission,
  normalizePlacementAdmissionPolicyOptions,
  PLACEMENT_ADMISSION_POLICY_SCHEMA,
  PLACEMENT_ADMISSION_RESULT_SCHEMA
} from '../../src/peercompute/computeManager/PlacementAdmissionPolicy.js';

test('placement admission policy accepts trusted peer with sufficient network capacity', () => {
  const policy = normalizePlacementAdmissionPolicyOptions({
    policyId: 'peer-policy',
    requireTrustedPeer: true,
    trustedPeerIds: ['peer-a'],
    minPeerBandwidthMbps: 2,
    maxPeerRttMs: 120,
    minRemoteWorkers: 2
  });
  assert.equal(policy.schema, PLACEMENT_ADMISSION_POLICY_SCHEMA);

  const result = evaluatePlacementAdmission({
    placement: {
      requestedPlacement: 'peer',
      advisoryOnly: false,
      confidence: 0.9
    }
  }, {
    peerId: 'peer-a',
    networkCapacity: {
      bandwidthMbps: 12,
      rttMs: 45,
      remoteWorkerCapacity: 3
    }
  }, policy);

  assert.equal(result.schema, PLACEMENT_ADMISSION_RESULT_SCHEMA);
  assert.equal(result.accepted, true);
  assert.equal(result.reason, 'accepted');
  assert.equal(result.admissionId, 'peer-policy');
  assert.equal(result.bandwidthMbps, 12);
  assert.equal(result.rttMs, 45);
  assert.equal(result.remoteWorkerCapacity, 3);
});

test('placement admission policy rejects peer with weak network or untrusted id', () => {
  const result = evaluatePlacementAdmission({
    placement: {
      requestedPlacement: 'peer',
      advisoryOnly: false,
      confidence: 0.8
    }
  }, {
    peerId: 'peer-b',
    networkCapacity: {
      bandwidthMbps: 0.5,
      rttMs: 900,
      remoteWorkerCapacity: 0
    }
  }, {
    policyId: 'strict-peer-policy',
    requireTrustedPeer: true,
    trustedPeerIds: ['peer-a'],
    minPeerBandwidthMbps: 2,
    maxPeerRttMs: 200,
    minRemoteWorkers: 1
  });

  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'bandwidth-below-floor');
  assert.deepEqual(result.blockedReasons, [
    'bandwidth-below-floor',
    'rtt-above-ceiling',
    'remote-workers-below-floor',
    'peer-not-trusted'
  ]);
});

test('placement admission policy rejects cluster without declared cluster capacity', () => {
  const result = evaluatePlacementAdmission({
    placement: {
      requestedPlacement: 'cluster',
      advisoryOnly: false,
      confidence: 0.95
    }
  }, {
    networkCapacity: {
      bandwidthMbps: 100,
      rttMs: 40,
      remoteWorkerCapacity: 8,
      clusterNodes: 1,
      clusterGpus: 0
    }
  }, {
    policyId: 'cluster-policy',
    minClusterBandwidthMbps: 25,
    maxClusterRttMs: 100,
    minRemoteWorkers: 4,
    minClusterNodes: 2,
    minClusterGpus: 1
  });

  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'cluster-nodes-below-floor');
  assert.deepEqual(result.blockedReasons, [
    'cluster-nodes-below-floor',
    'cluster-gpus-below-floor'
  ]);
});

test('placement admission policy integrates with ComputeManager remote hook', async () => {
  const placementAdmission = createPlacementAdmissionPolicy({
    policyId: 'manager-peer-policy',
    requireTrustedPeer: true,
    trustedPeerIds: ['peer-a'],
    minPeerBandwidthMbps: 1,
    maxPeerRttMs: 100,
    minRemoteWorkers: 1,
    networkCapacity: {
      bandwidthMbps: 5,
      rttMs: 50,
      remoteWorkerCapacity: 2
    }
  });
  let executorCalled = false;
  const manager = new ComputeManager({
    enableWorkers: false,
    placementAdmission,
    placementExecutor: async () => {
      executorCalled = true;
      return {
        value: 'remote-ok',
        provenance: {
          peerId: 'peer-a',
          resultSchema: 'peercompute.test.remote-ok.v0',
          validated: true
        }
      };
    }
  });

  const result = await manager.submitTask({
    taskFamily: 'policy-integration-fixture',
    placementHint: {
      requestedPlacement: 'peer',
      advisoryOnly: false,
      confidence: 0.9,
      peerId: 'peer-a'
    },
    fn: () => {
      throw new Error('local path should not run');
    }
  });

  assert.equal(result, 'remote-ok');
  assert.equal(executorCalled, true);
  const stats = manager.getStats();
  assert.equal(stats.remoteTasksCompleted, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 1);
  assert.equal(stats.taskPlacement.lastPlacement.admission.admissionId, 'manager-peer-policy');
  assert.equal(stats.taskPlacement.lastPlacement.admission.peerId, 'peer-a');
  assert.equal(stats.taskPlacement.lastPlacement.peerId, 'peer-a');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.admissionId, 'manager-peer-policy');
  assert.equal(stats.taskPlacement.lastPlacement.provenance.admissionReason, 'accepted');
  assert.ok(stats.taskPlacement.lastPlacement.provenance.durationMs >= 0);
  assert.ok(stats.taskPlacement.lastPlacement.provenance.durationMs < 5000);
  assert.equal(stats.taskPlacement.lastRemotePlacement.peerId, 'peer-a');
  assert.equal(stats.taskPlacement.lastRemotePlacement.actualPlacement, 'remote-peer');
});
