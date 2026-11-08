import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
  COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA,
  COMPUTE_TASK_PACKET_SCHEMA,
  ComputeManager
} from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
  NodeKernel,
  REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_COMPUTE_REQUEST_SCHEMA,
  REMOTE_COMPUTE_RESULT_SCHEMA
} from '../../src/peercompute/nodeKernel/NodeKernel.js';
import {
  createRemoteResultQuorumValidator,
  REMOTE_RESULT_QUORUM_REPORT_SCHEMA
} from '../../src/peercompute/computeManager/RemoteResultQuorumValidator.js';

function makeKernel(config = {}) {
  const { nodeId = 'node-a', ...kernelConfig } = config;
  const kernel = new NodeKernel(kernelConfig);
  kernel.nodeId = nodeId;
  kernel.isStarted = true;
  return kernel;
}

function connectInMemoryKernels({
  requester,
  responder,
  requesterPeerId = 'peer-a',
  responderPeerId = 'peer-b'
} = {}) {
  requester.networkManager = {
    sendToPeer: async (peerId, message) => {
      assert.equal(peerId, responderPeerId);
      if (message.type === 'compute-task') {
        await responder._handleComputeTask(requesterPeerId, message.data);
        return;
      }
      throw new Error(`Unexpected requester message type ${message.type}`);
    }
  };
  responder.networkManager = {
    sendToPeer: async (peerId, message) => {
      assert.equal(peerId, requesterPeerId);
      if (message.type === 'compute-result') {
        requester._handleComputeResult(responderPeerId, message.data);
        return;
      }
      throw new Error(`Unexpected responder message type ${message.type}`);
    }
  };
}

function connectInMemoryKernelMesh({
  requester,
  responders = [],
  requesterPeerId = 'peer-a',
  failPeerIds = []
} = {}) {
  const responderByPeerId = new Map(
    responders.map((entry) => [entry.peerId, entry.kernel])
  );
  const failedPeers = new Set(failPeerIds);
  requester.networkManager = {
    sendToPeer: async (peerId, message) => {
      if (failedPeers.has(peerId)) {
        const err = new Error(`Simulated send failure for ${peerId}`);
        err.code = 'ERR_SIMULATED_PRIMARY_FAILURE';
        throw err;
      }
      const responder = responderByPeerId.get(peerId);
      if (!responder) throw new Error(`Unexpected requester peer ${peerId}`);
      if (message.type === 'compute-task') {
        await responder._handleComputeTask(requesterPeerId, message.data);
        return;
      }
      throw new Error(`Unexpected requester message type ${message.type}`);
    }
  };
  for (const { kernel, peerId } of responders) {
    kernel.networkManager = {
      sendToPeer: async (targetPeerId, message) => {
        assert.equal(targetPeerId, requesterPeerId);
        if (message.type === 'compute-result') {
          requester._handleComputeResult(peerId, message.data);
          return;
        }
        throw new Error(`Unexpected responder message type ${message.type}`);
      }
    };
  }
}

test('NodeKernel sends remote compute requests and resolves matching responses', async () => {
  const sent = [];
  const kernel = makeKernel();
  kernel.networkManager = {
    sendToPeer: async (peerId, message) => {
      sent.push({ peerId, message });
    }
  };

  const promise = kernel.submitRemoteComputeTask('peer-b', {
    id: 'remote-task-1',
    runtime: 'js',
    module: '/tasks/example.js',
    exportName: 'run',
    data: { value: 3 }
  }, {
    requestId: 'request-1',
    timeoutMs: 1000
  });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].peerId, 'peer-b');
  assert.equal(sent[0].message.type, 'compute-task');
  assert.equal(sent[0].message.data.schema, REMOTE_COMPUTE_REQUEST_SCHEMA);
  assert.equal(sent[0].message.data.requestId, 'request-1');
  assert.equal(sent[0].message.data.task.module, '/tasks/example.js');
  assert.equal(sent[0].message.data.task.suppressCommitDelta, true);
  assert.equal(sent[0].message.data.task.returnEnvelope, true);

  kernel._handleComputeResult('peer-b', {
    schema: REMOTE_COMPUTE_RESULT_SCHEMA,
    requestId: 'request-1',
    ok: true,
    result: {
      value: { ok: true }
    }
  });

  assert.deepEqual(await promise, { value: { ok: true } });
  assert.equal(kernel.pendingRemoteComputeRequests.size, 0);
});

test('NodeKernel rejects outgoing remote function payloads by default', async () => {
  const kernel = makeKernel();
  kernel.networkManager = {
    sendToPeer: async () => {
      throw new Error('should not send unsafe task');
    }
  };

  await assert.rejects(
    kernel.submitRemoteComputeTask('peer-b', {
      runtime: 'js',
      fn: '() => 1'
    }),
    (err) => {
      assert.equal(err.code, 'ERR_REMOTE_COMPUTE_UNSAFE_TASK');
      return true;
    }
  );
});

test('NodeKernel network placement executor preserves remote response provenance', async () => {
  const sent = [];
  const kernel = makeKernel();
  kernel.networkManager = {
    sendToPeer: async (peerId, message) => {
      sent.push({ peerId, message });
    }
  };

  const executor = kernel.createNetworkPlacementExecutor('peer-b', {
    requestId: 'request-placement-1',
    executorId: 'nodekernel-network-placement:peer-b',
    timeoutMs: 1000
  });
  const promise = executor({
    id: 'remote-task-placement-1',
    runtime: 'js',
    taskFamily: 'multiscale-ladder',
    module: '/tasks/example.js',
    exportName: 'run',
    data: { value: 5 },
    taskPacket: {
      schema: 'peercompute.compute.task-packet.v0',
      codeHash: 'code-hash-1',
      inputHash: 'input-hash-1',
      taskHash: 'task-hash-1'
    },
    taskEnvelope: {
      schema: 'peercompute.compute.remote-task-envelope.v0',
      signed: true,
      signerId: 'metadata-signer',
      signatureAlgorithm: 'metadata-only-demo-signature'
    }
  });

  assert.equal(executor.placementExecutorId, 'nodekernel-network-placement:peer-b');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].peerId, 'peer-b');
  assert.equal(sent[0].message.type, 'compute-task');
  assert.equal(sent[0].message.data.requestId, 'request-placement-1');
  assert.equal(sent[0].message.data.task.suppressCommitDelta, true);
  assert.equal(sent[0].message.data.task.returnEnvelope, true);

  kernel._handleComputeResult('peer-b', {
    schema: REMOTE_COMPUTE_RESULT_SCHEMA,
    requestId: 'request-placement-1',
    ok: true,
    responderId: 'node-b',
    completedAt: 12345,
    result: {
      value: {
        schema: 'demo.remote-result.v0',
        ok: true,
        value: 10
      },
      commitDelta: {
        scope: 'remote-result',
        taskId: 'remote-task-placement-1',
        payload: { ok: true }
      }
    },
    taskPacket: sent[0].message.data.taskPacket,
    taskEnvelope: sent[0].message.data.taskEnvelope
  });

  const result = await promise;
  assert.equal(result.value.schema, 'demo.remote-result.v0');
  assert.equal(result.commitDelta.scope, 'remote-result');
  assert.equal(result.placementProvenance.schema, REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(result.placementProvenance.transport, 'nodekernel-remote-compute');
  assert.equal(result.placementProvenance.executorId, 'nodekernel-network-placement:peer-b');
  assert.equal(result.placementProvenance.peerId, 'node-b');
  assert.equal(result.placementProvenance.remotePeerId, 'node-b');
  assert.equal(result.placementProvenance.targetPeerId, 'peer-b');
  assert.equal(result.placementProvenance.requestId, 'request-placement-1');
  assert.equal(result.placementProvenance.requestSchema, REMOTE_COMPUTE_REQUEST_SCHEMA);
  assert.equal(result.placementProvenance.responseSchema, REMOTE_COMPUTE_RESULT_SCHEMA);
  assert.equal(result.placementProvenance.taskPacketSchema, 'peercompute.compute.task-packet.v0');
  assert.equal(result.placementProvenance.taskEnvelopeSchema, 'peercompute.compute.remote-task-envelope.v0');
  assert.equal(result.placementProvenance.taskSigned, true);
  assert.equal(result.placementProvenance.signerId, 'metadata-signer');
  assert.equal(result.placementProvenance.codeHash, 'code-hash-1');
  assert.equal(result.placementProvenance.inputHash, 'input-hash-1');
  assert.equal(result.placementProvenance.taskHash, 'task-hash-1');
  assert.equal(result.placementProvenance.resultSchema, 'demo.remote-result.v0');
  assert.equal(result.placementProvenance.trustLevel, 'nodekernel-network-peer');
  assert.equal(result.placementProvenance.validated, false);
  assert.ok(result.placementProvenance.roundTripMs >= 0);
  assert.equal(kernel.pendingRemoteComputeRequests.size, 0);
});

test('NodeKernel remote compute responder runs module tasks without local delta commit', async () => {
  const sent = [];
  let submittedTask = null;
  const kernel = makeKernel({ enableRemoteComputeResponder: true });
  kernel.networkManager = {
    sendToPeer: async (peerId, message) => {
      sent.push({ peerId, message });
    }
  };
  kernel.computeManager = {
    submitTask: async (task) => {
      submittedTask = task;
      return {
        commitDelta: { taskId: task.id, scope: 'remote-result', payload: { ok: true } },
        value: { ok: true, input: task.data.value }
      };
    }
  };

  await kernel._handleComputeTask('peer-a', {
    schema: REMOTE_COMPUTE_REQUEST_SCHEMA,
    requestId: 'request-2',
    task: {
      id: 'remote-task-2',
      runtime: 'js',
      module: '/tasks/remote.js',
      exportName: 'run',
      data: { value: 9 }
    }
  });

  assert.equal(submittedTask.id, 'remote-task-2');
  assert.equal(submittedTask.suppressCommitDelta, true);
  assert.equal(submittedTask.returnEnvelope, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].peerId, 'peer-a');
  assert.equal(sent[0].message.type, 'compute-result');
  assert.equal(sent[0].message.data.schema, REMOTE_COMPUTE_RESULT_SCHEMA);
  assert.equal(sent[0].message.data.ok, true);
  assert.deepEqual(sent[0].message.data.result.value, { ok: true, input: 9 });
  assert.deepEqual(sent[0].message.data.result.commitDelta.payload, { ok: true });
});

test('NodeKernel placement executor runs through a responder ComputeManager without responder delta commit', async () => {
  const requester = makeKernel({ nodeId: 'node-a' });
  const responder = makeKernel({
    nodeId: 'node-b',
    enableRemoteComputeResponder: true
  });
  connectInMemoryKernels({ requester, responder });

  const responderDeltas = [];
  responder.computeManager = new ComputeManager({ enableWorkers: false });
  responder.computeManager.setCommitDeltaHandler((delta) => responderDeltas.push(delta));

  const requesterDeltas = [];
  const placementExecutor = requester.createNetworkPlacementExecutor('peer-b', {
    executorId: 'nodekernel-network-placement:peer-b',
    timeoutMs: 1000
  });
  const requesterCompute = new ComputeManager({
    enableWorkers: false,
    placementExecutor,
    placementExecutorId: placementExecutor.placementExecutorId,
    placementAdmissionId: 'two-kernel-admission',
    placementAdmission: () => ({
      accepted: true,
      reason: 'trusted-in-memory-peer'
    }),
    placementTaskSignerId: 'two-kernel-signer',
    placementTaskSigner: (taskPacket) => ({
      signed: true,
      signerId: 'two-kernel-signer',
      signature: `sig:${taskPacket.taskHash}`,
      signatureAlgorithm: 'unit-test-signature'
    }),
    placementResultValidatorId: 'two-kernel-validator',
    placementResultValidator: (result, context) => {
      assert.equal(result.schema, 'peercompute.test.two-kernel-result.v0');
      assert.equal(context.commitDelta.scope, 'nodekernel-two-kernel');
      return {
        valid: result.doubled === 42,
        reason: result.doubled === 42 ? 'result-accepted' : 'bad-result'
      };
    }
  });
  requesterCompute.setCommitDeltaHandler((delta) => requesterDeltas.push(delta));

  const moduleUrl = new URL('../fixtures/remotePlacementModule.js', import.meta.url).toString();
  const result = await requesterCompute.submitTask({
    id: 'two-kernel-placement-task',
    runtime: 'js',
    taskFamily: 'nodekernel-two-kernel',
    module: moduleUrl,
    exportName: 'run',
    data: {
      value: 21,
      scope: 'nodekernel-two-kernel'
    },
    placementHint: {
      requestedPlacement: 'peer',
      recommendedPlacement: 'peer',
      advisoryOnly: false,
      solverKey: 'two-kernel-fixture',
      solverId: 'nodekernel-two-kernel',
      confidence: 1,
      targetReplicaCount: 1,
      peerId: 'peer-b',
      timeoutMs: 1000
    }
  });

  assert.deepEqual(result, {
    schema: 'peercompute.test.two-kernel-result.v0',
    doubled: 42
  });
  assert.equal(responderDeltas.length, 0);
  assert.equal(requesterDeltas.length, 1);
  assert.equal(requesterDeltas[0].scope, 'nodekernel-two-kernel');
  assert.deepEqual(requesterDeltas[0].payload, { doubled: 42 });

  const responderStats = responder.computeManager.getStats();
  assert.equal(responderStats.totalTasksCompleted, 1);
  assert.equal(responderStats.inlineTasksCompleted, 1);
  assert.equal(responderStats.taskPlacement.localSubmitted, 1);

  const requesterStats = requesterCompute.getStats();
  assert.equal(requesterStats.totalTasksCompleted, 1);
  assert.equal(requesterStats.remoteTasksCompleted, 1);
  assert.equal(requesterStats.inlineTasksCompleted, 0);
  assert.equal(requesterStats.taskPlacement.remoteRequested, 1);
  assert.equal(requesterStats.taskPlacement.remoteExecuted, 1);
  assert.equal(requesterStats.taskPlacement.byActualPlacement['remote-peer'].completed, 1);

  const provenance = requesterStats.taskPlacement.lastPlacement.provenance;
  assert.equal(provenance.schema, COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(provenance.executorId, 'nodekernel-network-placement:peer-b');
  assert.equal(provenance.peerId, 'node-b');
  assert.equal(provenance.requestedPlacement, 'peer');
  assert.equal(provenance.taskFamily, 'nodekernel-two-kernel');
  assert.equal(provenance.solverKey, 'two-kernel-fixture');
  assert.equal(provenance.workerId, null);
  assert.equal(provenance.remoteExecution.schema, 'peercompute.compute.task-execution.v0');
  assert.equal(provenance.remoteExecution.executionMode, 'inline');
  assert.equal(provenance.remoteExecution.executorId, 'inline');
  assert.equal(provenance.remoteExecution.workerId, null);
  assert.equal(provenance.taskPacketSchema, COMPUTE_TASK_PACKET_SCHEMA);
  assert.equal(provenance.taskEnvelopeSchema, COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA);
  assert.equal(provenance.taskSigned, true);
  assert.equal(provenance.signerId, 'two-kernel-signer');
  assert.equal(provenance.signatureAlgorithm, 'unit-test-signature');
  assert.equal(provenance.trustLevel, 'nodekernel-network-peer');
  assert.equal(provenance.verification.schema, COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA);
  assert.equal(provenance.verification.verified, true);
  assert.deepEqual(provenance.verification.mismatchFields, []);
  assert.equal(provenance.validation.schema, COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA);
  assert.equal(provenance.validation.valid, true);
  assert.equal(provenance.validation.reason, 'result-accepted');
  assert.match(provenance.codeHash, /^fnv1a32-/);
  assert.match(provenance.inputHash, /^fnv1a32-/);
  assert.match(provenance.taskHash, /^fnv1a32-/);
  assert.equal(requester.pendingRemoteComputeRequests.size, 0);
});

test('NodeKernel redundant placement executor attaches matching replica reports for quorum validation', async () => {
  const requester = makeKernel({ nodeId: 'node-a' });
  const responderB = makeKernel({
    nodeId: 'node-b',
    enableRemoteComputeResponder: true
  });
  const responderC = makeKernel({
    nodeId: 'node-c',
    enableRemoteComputeResponder: true
  });
  connectInMemoryKernelMesh({
    requester,
    responders: [
      { peerId: 'peer-b', kernel: responderB },
      { peerId: 'peer-c', kernel: responderC }
    ]
  });

  const responderDeltas = [];
  responderB.computeManager = new ComputeManager({ enableWorkers: false });
  responderC.computeManager = new ComputeManager({ enableWorkers: false });
  responderB.computeManager.setCommitDeltaHandler((delta) => responderDeltas.push(delta));
  responderC.computeManager.setCommitDeltaHandler((delta) => responderDeltas.push(delta));

  const requesterDeltas = [];
  const placementExecutor = requester.createRedundantNetworkPlacementExecutor(['peer-b', 'peer-c'], {
    executorId: 'nodekernel-redundant-network-placement:peer-b:peer-c',
    timeoutMs: 1000,
    requestId: 'redundant-request'
  });
  const requesterCompute = new ComputeManager({
    enableWorkers: false,
    placementExecutor,
    placementExecutorId: placementExecutor.placementExecutorId,
    placementAdmission: () => ({
      accepted: true,
      reason: 'trusted-redundant-mesh'
    }),
    placementTaskSigner: (taskPacket) => ({
      signed: true,
      signerId: 'redundant-test-signer',
      signature: `sig:${taskPacket.taskHash}`,
      signatureAlgorithm: 'unit-test-signature'
    }),
    placementResultValidator: createRemoteResultQuorumValidator({
      validationId: 'redundant-nodekernel-quorum',
      minReplicaCount: 2,
      minMatchingReplicas: 2
    })
  });
  requesterCompute.setCommitDeltaHandler((delta) => requesterDeltas.push(delta));

  const moduleUrl = new URL('../fixtures/remotePlacementModule.js', import.meta.url).toString();
  const result = await requesterCompute.submitTask({
    id: 'redundant-placement-task',
    runtime: 'js',
    taskFamily: 'nodekernel-redundant-placement',
    module: moduleUrl,
    exportName: 'run',
    data: {
      value: 12,
      scope: 'nodekernel-redundant-placement'
    },
    placementHint: {
      requestedPlacement: 'peer',
      recommendedPlacement: 'peer',
      advisoryOnly: false,
      solverKey: 'redundant-fixture',
      solverId: 'nodekernel-redundant-placement',
      confidence: 1,
      targetReplicaCount: 2,
      peerId: 'peer-b',
      timeoutMs: 1000
    }
  });

  assert.deepEqual(result, {
    schema: 'peercompute.test.two-kernel-result.v0',
    doubled: 24
  });
  assert.equal(responderDeltas.length, 0);
  assert.equal(requesterDeltas.length, 1);
  assert.equal(requesterDeltas[0].scope, 'nodekernel-redundant-placement');
  assert.deepEqual(requesterDeltas[0].payload, { doubled: 24 });
  assert.equal(responderB.computeManager.getStats().totalTasksCompleted, 1);
  assert.equal(responderC.computeManager.getStats().totalTasksCompleted, 1);

  const requesterStats = requesterCompute.getStats();
  const provenance = requesterStats.taskPlacement.lastPlacement.provenance;
  assert.equal(requesterStats.remoteTasksCompleted, 1);
  assert.equal(provenance.schema, COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(provenance.executorId, 'nodekernel-redundant-network-placement:peer-b:peer-c');
  assert.equal(provenance.peerId, 'node-b');
  assert.equal(provenance.targetPeerId, 'peer-b');
  assert.equal(provenance.redundantPlacement.schema, NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA);
  assert.equal(provenance.redundantPlacement.primaryPeerId, 'peer-b');
  assert.deepEqual(provenance.redundantPlacement.replicaPeerIds, ['peer-c']);
  assert.equal(provenance.redundantReplicaCount, 1);
  assert.equal(provenance.replicaSuccessCount, 1);
  assert.equal(provenance.replicaFailureCount, 0);
  assert.equal(provenance.replicas.length, 1);
  assert.equal(provenance.replicas[0].schema, NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA);
  assert.equal(provenance.replicas[0].peerId, 'node-c');
  assert.equal(provenance.replicas[0].targetPeerId, 'peer-c');
  assert.equal(provenance.replicas[0].ok, true);
  assert.equal(provenance.replicas[0].codeHash, provenance.codeHash);
  assert.equal(provenance.replicas[0].inputHash, provenance.inputHash);
  assert.equal(provenance.replicas[0].taskHash, provenance.taskHash);
  assert.equal(provenance.replicas[0].outputHash, provenance.outputHash);
  assert.equal(provenance.replicas[0].commitDeltaHash, provenance.commitDeltaHash);
  assert.equal(provenance.verification.verified, true);
  assert.equal(provenance.validation.quorumSchema, REMOTE_RESULT_QUORUM_REPORT_SCHEMA);
  assert.equal(provenance.validation.valid, true);
  assert.equal(provenance.validation.reason, 'quorum-accepted');
  assert.equal(provenance.validation.totalResultCount, 2);
  assert.equal(provenance.validation.matchingResultCount, 2);
  assert.equal(provenance.validation.remoteReplicaCount, 1);
  assert.equal(requester.pendingRemoteComputeRequests.size, 0);
});

test('NodeKernel redundant placement promotes a replica when the primary fails', async () => {
  const requester = makeKernel({ nodeId: 'node-a' });
  const responderC = makeKernel({
    nodeId: 'node-c',
    enableRemoteComputeResponder: true
  });
  const responderD = makeKernel({
    nodeId: 'node-d',
    enableRemoteComputeResponder: true
  });
  connectInMemoryKernelMesh({
    requester,
    responders: [
      { peerId: 'peer-c', kernel: responderC },
      { peerId: 'peer-d', kernel: responderD }
    ],
    failPeerIds: ['peer-b']
  });

  const responderDeltas = [];
  responderC.computeManager = new ComputeManager({ enableWorkers: false });
  responderD.computeManager = new ComputeManager({ enableWorkers: false });
  responderC.computeManager.setCommitDeltaHandler((delta) => responderDeltas.push(delta));
  responderD.computeManager.setCommitDeltaHandler((delta) => responderDeltas.push(delta));

  const requesterDeltas = [];
  const placementExecutor = requester.createRedundantNetworkPlacementExecutor(['peer-b', 'peer-c', 'peer-d'], {
    executorId: 'nodekernel-redundant-network-placement:peer-b:peer-c,peer-d',
    timeoutMs: 1000,
    requestId: 'redundant-promote-request'
  });
  const requesterCompute = new ComputeManager({
    enableWorkers: false,
    placementExecutor,
    placementExecutorId: placementExecutor.placementExecutorId,
    placementAdmission: () => ({
      accepted: true,
      reason: 'trusted-redundant-promote-mesh'
    }),
    placementTaskSigner: (taskPacket) => ({
      signed: true,
      signerId: 'redundant-promote-signer',
      signature: `sig:${taskPacket.taskHash}`,
      signatureAlgorithm: 'unit-test-signature'
    }),
    placementResultValidator: createRemoteResultQuorumValidator({
      validationId: 'redundant-nodekernel-promote-quorum',
      minReplicaCount: 2,
      minMatchingReplicas: 2,
      compareCommitDeltaHash: false
    })
  });
  requesterCompute.setCommitDeltaHandler((delta) => requesterDeltas.push(delta));

  const moduleUrl = new URL('../fixtures/remotePlacementModule.js', import.meta.url).toString();
  const result = await requesterCompute.submitTask({
    id: 'redundant-promote-placement-task',
    runtime: 'js',
    taskFamily: 'nodekernel-redundant-placement',
    module: moduleUrl,
    exportName: 'run',
    data: {
      value: 14,
      scope: 'nodekernel-redundant-promote-placement'
    },
    placementHint: {
      requestedPlacement: 'peer',
      recommendedPlacement: 'peer',
      advisoryOnly: false,
      solverKey: 'redundant-promote-fixture',
      solverId: 'nodekernel-redundant-placement',
      confidence: 1,
      targetReplicaCount: 3,
      peerId: 'peer-b',
      timeoutMs: 1000
    }
  });

  assert.deepEqual(result, {
    schema: 'peercompute.test.two-kernel-result.v0',
    doubled: 28
  });
  assert.equal(responderDeltas.length, 0);
  assert.equal(requesterDeltas.length, 1);
  assert.equal(requesterDeltas[0].scope, 'nodekernel-redundant-promote-placement');
  assert.deepEqual(requesterDeltas[0].payload, { doubled: 28 });
  assert.equal(responderC.computeManager.getStats().totalTasksCompleted, 1);
  assert.equal(responderD.computeManager.getStats().totalTasksCompleted, 1);

  const requesterStats = requesterCompute.getStats();
  const provenance = requesterStats.taskPlacement.lastPlacement.provenance;
  assert.equal(requesterStats.remoteTasksCompleted, 1);
  assert.equal(provenance.schema, COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(provenance.executorId, 'nodekernel-redundant-network-placement:peer-b:peer-c,peer-d');
  assert.equal(provenance.promotedReplicaExecutorId, 'nodekernel-redundant-network-placement:peer-b:peer-c,peer-d:replica:0:peer-c');
  assert.equal(provenance.peerId, 'node-c');
  assert.equal(provenance.targetPeerId, 'peer-c');
  assert.equal(provenance.role, 'promoted-replica');
  assert.equal(provenance.redundantPlacement.schema, NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA);
  assert.equal(provenance.redundantPlacement.primaryPeerId, 'peer-b');
  assert.deepEqual(provenance.redundantPlacement.replicaPeerIds, ['peer-c', 'peer-d']);
  assert.equal(provenance.redundantPlacement.primaryOk, false);
  assert.equal(provenance.redundantPlacement.promotedReplica, true);
  assert.equal(provenance.redundantPlacement.promotedReplicaPeerId, 'peer-c');
  assert.equal(provenance.redundantPlacement.commitSourceRole, 'promoted-replica');
  assert.equal(provenance.redundantPlacement.primaryFailure.code, 'ERR_SIMULATED_PRIMARY_FAILURE');
  assert.equal(provenance.primaryFailure.code, 'ERR_SIMULATED_PRIMARY_FAILURE');
  assert.equal(provenance.promotedReplica.peerId, 'node-c');
  assert.equal(provenance.promotedReplica.targetPeerId, 'peer-c');
  assert.equal(provenance.promotedReplica.usedAsCommitSource, true);
  assert.equal(provenance.redundantReplicaCount, 2);
  assert.equal(provenance.replicaCount, 1);
  assert.equal(provenance.quorumReplicaCount, 1);
  assert.equal(provenance.replicaSuccessCount, 2);
  assert.equal(provenance.replicaFailureCount, 0);
  assert.equal(provenance.replicas.length, 1);
  assert.equal(provenance.replicas[0].peerId, 'node-d');
  assert.equal(provenance.replicas[0].targetPeerId, 'peer-d');
  assert.equal(provenance.replicas[0].ok, true);
  assert.equal(provenance.replicas[0].outputHash, provenance.outputHash);
  assert.equal(provenance.replicas[0].taskHash, provenance.taskHash);
  assert.equal(provenance.verification.verified, true);
  assert.equal(provenance.validation.quorumSchema, REMOTE_RESULT_QUORUM_REPORT_SCHEMA);
  assert.equal(provenance.validation.valid, true);
  assert.equal(provenance.validation.reason, 'quorum-accepted');
  assert.equal(provenance.validation.totalResultCount, 2);
  assert.equal(provenance.validation.matchingResultCount, 2);
  assert.equal(provenance.validation.remoteReplicaCount, 1);
  assert.equal(requester.pendingRemoteComputeRequests.size, 0);
});

test('NodeKernel remote compute responder rejects unsafe function tasks', async () => {
  const sent = [];
  const kernel = makeKernel({ enableRemoteComputeResponder: true });
  kernel.networkManager = {
    sendToPeer: async (peerId, message) => {
      sent.push({ peerId, message });
    }
  };
  kernel.computeManager = {
    submitTask: async () => {
      throw new Error('unsafe task should not execute');
    }
  };

  await kernel._handleComputeTask('peer-a', {
    schema: REMOTE_COMPUTE_REQUEST_SCHEMA,
    requestId: 'request-3',
    task: {
      runtime: 'js',
      fn: '() => 1'
    }
  });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].message.type, 'compute-result');
  assert.equal(sent[0].message.data.ok, false);
  assert.equal(sent[0].message.data.error.code, 'ERR_REMOTE_COMPUTE_UNSAFE_TASK');
});
