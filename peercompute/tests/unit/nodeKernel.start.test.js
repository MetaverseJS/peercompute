import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA,
  COMPUTE_REMOTE_TASK_GRAPH_STATE_SEED_POLICY_SCHEMA,
  ComputeManager
} from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  NodeKernel,
  NODE_KERNEL_GPU_RESIDENT_STAGE_EXECUTION_AUTHORITY_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_EXECUTOR_CONTRACT_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_REQUEST_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_RESULT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_HOT_BUFFER_REFRESH_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_RESULT_ADMISSION_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA,
  REMOTE_TASK_GRAPH_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_TASK_GRAPH_REQUEST_SCHEMA,
  REMOTE_TASK_GRAPH_RESULT_SCHEMA
} from '../../src/peercompute/nodeKernel/NodeKernel.js';

function makeStartedKernel(nodeId, config = {}) {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false,
    ...config
  });
  node.nodeId = nodeId;
  node.isStarted = true;
  return node;
}

function connectInMemoryTaskGraphKernels({
  requester,
  responder,
  requesterPeerId = 'peer-a',
  responderPeerId = 'peer-b',
  messages = []
}) {
  requester.networkManager = {
    sendToPeer: async (peerId, message) => {
      messages.push({ from: requesterPeerId, to: peerId, message });
      assert.equal(peerId, responderPeerId);
      await responder._handleNetworkMessage(requesterPeerId, message);
    }
  };
  responder.networkManager = {
    peerId: responderPeerId,
    sendToPeer: async (peerId, message) => {
      messages.push({ from: responderPeerId, to: peerId, message });
      assert.equal(peerId, requesterPeerId);
      await requester._handleNetworkMessage(responderPeerId, message);
    }
  };
}

test('NodeKernel passes GPUHub to ComputeManager resident lane manager', async (t) => {
  const node = new NodeKernel({
    enableGPUHub: true,
    enableWebGPU: false,
    enableWorkers: false,
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false,
    disableStateNetworkProvider: true,
    disableStateBroadcast: true,
    enablePersistence: false
  });
  t.after(() => node.stateManager?.destroy?.());
  await node.initialize();

  const gpuHub = node.getGPUHub();
  const computeManager = node.getComputeManager();
  const laneManager = computeManager.getGpuResidentLaneManager();
  assert.ok(gpuHub);
  assert.equal(laneManager.gpuHub, gpuHub);
});

test('NodeKernel requests StateManager provider sync after network connect', async () => {
  const events = [];
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false,
    stateProviderSyncRetryDelaysMs: []
  });
  node.isInitialized = true;
  node.networkManager = {
    async connect() {
      events.push('connect');
    }
  };
  node.stateManager = {
    write(key) {
      events.push(`write:${key}`);
    },
    async requestProviderSync() {
      events.push('request-provider-sync');
      return true;
    }
  };

  await node.start();

  assert.equal(node.isStarted, true);
  assert.deepEqual(events, [
    'connect',
    'write:status',
    'write:startedAt',
    'request-provider-sync'
  ]);
});

test('NodeKernel routes task graph cache artifact admission through StateManager authority', () => {
  const events = [];
  const artifact = {
    schema: 'peercompute.compute.task-graph-cache-artifact.v0',
    cacheKey: 'unit-cache:fnv1a32-12345678',
    artifactId: 'unit-cache-artifact',
    status: 'recorded-not-admitted',
    admitted: false,
    resultHash: 'fnv1a32-abcdef00'
  };
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-authority-fixture';
  node.computeManager = {
    getTaskGraphCacheArtifact(cacheKey) {
      events.push(`compute-get:${cacheKey}`);
      return artifact;
    },
    admitTaskGraphCacheArtifact(cacheKey, admission) {
      events.push(`compute-admit:${cacheKey}:${admission.authority}`);
      return {
        ...artifact,
        status: 'admitted-cache-artifact-recorded',
        admitted: true
      };
    },
    invalidateTaskGraphCacheArtifact(cacheKey, invalidation) {
      events.push(`compute-invalidate:${cacheKey}:${invalidation.authority}`);
      return {
        ...artifact,
        status: 'invalidated',
        admitted: false
      };
    }
  };
  node.stateManager = {
    admitTaskGraphCacheArtifact(inputArtifact, options) {
      events.push(`state-admit:${inputArtifact.cacheKey}:${options.sourceNodeId}`);
      return {
        schema: 'peercompute.state.task-graph-cache-artifact-admission.v0',
        cacheKey: inputArtifact.cacheKey,
        admissionId: 'state-admission-1',
        authority: options.authority,
        sourceNodeId: options.sourceNodeId,
        status: 'admitted',
        admitted: true
      };
    },
    invalidateTaskGraphCacheArtifact(cacheKeyOrArtifact, options) {
      const cacheKey = typeof cacheKeyOrArtifact === 'string'
        ? cacheKeyOrArtifact
        : cacheKeyOrArtifact.cacheKey;
      events.push(`state-invalidate:${cacheKey}:${options.sourceNodeId}`);
      return {
        schema: 'peercompute.state.task-graph-cache-artifact-invalidation.v0',
        cacheKey,
        authority: options.authority,
        sourceNodeId: options.sourceNodeId,
        status: 'invalidated'
      };
    }
  };

  const admission = node.admitTaskGraphCacheArtifact(artifact.cacheKey);
  assert.equal(admission.authority, 'node-kernel-state-manager');
  assert.equal(admission.computeArtifactAdmitted, true);
  assert.equal(admission.computeArtifactStatus, 'admitted-cache-artifact-recorded');

  const invalidation = node.invalidateTaskGraphCacheArtifact(artifact.cacheKey);
  assert.equal(invalidation.authority, 'node-kernel-state-manager');
  assert.equal(invalidation.computeArtifactAdmitted, false);
  assert.equal(invalidation.computeArtifactStatus, 'invalidated');
  assert.deepEqual(events, [
    `compute-get:${artifact.cacheKey}`,
    `state-admit:${artifact.cacheKey}:node-authority-fixture`,
    `compute-admit:${artifact.cacheKey}:node-kernel-state-manager`,
    `state-invalidate:${artifact.cacheKey}:node-authority-fixture`,
    `compute-invalidate:${artifact.cacheKey}:node-kernel-state-manager`
  ]);
});

test('NodeKernel submits task graphs through compute manager with authority metadata', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-task-graph-authority';
  node.stateManager = {};
  node.computeManager = {
    async submitTaskGraph(graph) {
      assert.equal(graph.placementPolicy.authority, 'node-kernel');
      assert.equal(graph.placementPolicy.nodeId, 'node-task-graph-authority');
      return {
        schema: 'peercompute.compute.task-graph-result.v0',
        graphId: graph.graphId,
        status: 'completed',
        placementPolicy: {
          schema: 'peercompute.compute.task-graph-placement-policy.v0',
          requestedPlacement: 'local',
          authority: graph.placementPolicy.authority
        }
      };
    }
  };

  const result = await node.submitTaskGraph({
    graphId: 'node-kernel-task-graph-fixture',
    placementPolicy: {
      requestedPlacement: 'local',
      authority: 'compute-manager'
    },
    nodes: [{ id: 'a', task: { fn: () => 1 } }]
  });

  assert.equal(result.nodeKernelOwned, true);
  assert.equal(result.nodeKernelAuthority.schema, 'peercompute.nodekernel.task-graph-authority.v0');
  assert.equal(result.nodeKernelAuthority.status, 'submitted-through-node-kernel');
  assert.equal(result.nodeKernelAuthority.nodeId, 'node-task-graph-authority');
  assert.equal(result.nodeKernelAuthority.stateManagerAvailable, true);
  assert.equal(
    result.nodeKernelAuthority.placementPreflight.schema,
    'peercompute.nodekernel.task-graph-placement-preflight.v0'
  );
  assert.equal(result.nodeKernelAuthority.placementPreflight.status, 'local-placement-accepted');
  assert.equal(result.placementPolicy.authority, 'node-kernel');
});

test('NodeKernel wraps local GPU resident stage placement preflight with authority metadata', () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-local-preflight';
  let called = false;
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement(leaseId, options) {
      called = true;
      assert.equal(leaseId, 'lease-local');
      assert.equal(options.context?.scenario, 'local-unit');
      return {
        schema: 'peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0',
        status: 'placement-preflight-ready',
        canExecute: true,
        placementBatches: [['p2g'], ['gridUpdate'], ['g2p']]
      };
    }
  };

  const preflight = node.preflightGpuResidentLaneStagePlacement('lease-local', {
    context: { scenario: 'local-unit' },
    placementPolicy: { requestedPlacement: 'local' }
  });

  assert.equal(called, true);
  assert.equal(preflight.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA);
  assert.equal(preflight.status, 'local-placement-accepted');
  assert.equal(preflight.nodeId, 'node-gpu-stage-local-preflight');
  assert.equal(preflight.requestedPlacement, 'local');
  assert.equal(preflight.localPlacement, true);
  assert.equal(preflight.advisory, true);
  assert.equal(preflight.computeManagerPreflightStatus, 'placement-preflight-ready');
  assert.equal(preflight.computeManagerCanExecute, true);
  assert.deepEqual(preflight.computeManagerPreflight.placementBatches, [['p2g'], ['gridUpdate'], ['g2p']]);
});

test('NodeKernel allows advisory distributed GPU resident stage placement as local preflight only', () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-advisory-preflight';
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement() {
      return {
        schema: 'peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0',
        status: 'placement-preflight-ready',
        canExecute: true
      };
    }
  };

  const preflight = node.preflightGpuResidentLaneStagePlacement('lease-advisory', {
    placementPolicy: {
      requestedPlacement: 'peer',
      advisory: true,
      targetPeerIds: ['peer-b']
    }
  });

  assert.equal(preflight.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA);
  assert.equal(preflight.status, 'advisory-distributed-placement-local-execution-allowed');
  assert.equal(preflight.requestedPlacement, 'peer');
  assert.equal(preflight.targetPeerId, 'peer-b');
  assert.deepEqual(preflight.targetPeerIds, ['peer-b']);
  assert.equal(preflight.localPlacement, false);
  assert.equal(preflight.advisory, true);
  assert.equal(preflight.distributedStagePlacementExecutorAvailable, false);
  assert.equal(preflight.computeManagerPreflightStatus, 'placement-preflight-ready');
});

test('NodeKernel blocks non-advisory distributed GPU resident stage placement', () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-distributed-block';
  let called = false;
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement() {
      called = true;
      throw new Error('distributed GPU resident stage should not preflight locally');
    }
  };

  assert.throws(
    () => node.preflightGpuResidentLaneStagePlacement('lease-distributed', {
      placementPolicy: {
        requestedPlacement: 'peer',
        advisory: false,
        targetPeerIds: ['peer-b']
      }
    }),
    (err) => {
      assert.equal(called, false);
      assert.equal(err.code, 'ERR_NODEKERNEL_DISTRIBUTED_GPU_RESIDENT_STAGE_PLACEMENT_UNAVAILABLE');
      assert.equal(err.placementPreflight.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA);
      assert.equal(err.placementPreflight.status, 'blocked-distributed-resident-stage-placement-unavailable');
      assert.equal(err.placementPreflight.requestedPlacement, 'peer');
      assert.equal(err.placementPreflight.targetPeerId, 'peer-b');
      assert.equal(err.placementPreflight.advisory, false);
      assert.equal(err.placementPreflight.computeManagerPreflight, null);
      return true;
    }
  );
});

test('NodeKernel reports ready non-advisory distributed GPU resident stage placement executor contracts', () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-distributed-ready';
  let localPreflightCalled = false;
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement() {
      localPreflightCalled = true;
      throw new Error('distributed GPU resident stage should not preflight locally');
    }
  };
  const registration = node.registerGpuResidentStagePlacementExecutor(
    'gpu-resident-stage-placement:peer-b',
    {
      executor: () => ({ ok: true }),
      targetPeerId: 'peer-b',
      transport: 'unit-gpu-resident-stage-placement-executor',
      supportsGpuResidentStagePlacement: true,
      retainedRefPolicy: 'metadata-only-nonlocal',
      stateAuthority: 'node-kernel-state-manager',
      cacheAdmissionPolicy: 'state-manager-required'
    }
  );
  assert.equal(registration.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_EXECUTOR_CONTRACT_SCHEMA);
  assert.equal(registration.registered, true);
  assert.equal(node.listGpuResidentStagePlacementExecutors()[0].contractReady, true);
  const capabilities = node._buildPresenceCapabilities();
  assert.equal(capabilities.compute.supportsGpuResidentStagePlacement, true);
  assert.equal(capabilities.compute.gpuResidentStagePlacement.localPreflightAvailable, true);
  assert.equal(capabilities.compute.gpuResidentStagePlacement.registeredExecutorCount, 1);

  const preflight = node.preflightGpuResidentLaneStagePlacement('lease-distributed-ready', {
    placementPolicy: {
      requestedPlacement: 'peer',
      advisory: false,
      targetPeerIds: ['peer-b']
    }
  });

  assert.equal(localPreflightCalled, false);
  assert.equal(preflight.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA);
  assert.equal(preflight.status, 'distributed-resident-stage-placement-executor-ready');
  assert.equal(preflight.distributedStagePlacementExecutorAvailable, true);
  assert.equal(preflight.executorId, 'gpu-resident-stage-placement:peer-b');
  assert.equal(preflight.executorTransport, 'unit-gpu-resident-stage-placement-executor');
  assert.equal(preflight.executorTargetPeerId, 'peer-b');
  assert.equal(preflight.executorContract.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_EXECUTOR_CONTRACT_SCHEMA);
  assert.equal(preflight.executorContractStatus, 'resident-stage-placement-executor-contract-ready');
  assert.equal(preflight.executorContractReady, true);
  assert.deepEqual(preflight.executorContractFailures, []);
  assert.equal(preflight.remoteRetainedRefsUsableLocally, false);
  assert.equal(preflight.localHotBufferRefreshRequired, true);
  assert.equal(preflight.computeManagerPreflight, null);
});

test('NodeKernel keeps invalid distributed GPU resident stage placement executor contracts fail-closed', () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-distributed-contract-block';
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement() {
      throw new Error('distributed GPU resident stage should not preflight locally');
    }
  };
  node.registerGpuResidentStagePlacementExecutor(
    'gpu-resident-stage-placement:peer-b',
    {
      executor: () => ({ ok: true }),
      targetPeerId: 'peer-b',
      supportsGpuResidentStagePlacement: true,
      retainedRefPolicy: 'direct-local-buffer'
    }
  );

  assert.throws(
    () => node.preflightGpuResidentLaneStagePlacement('lease-distributed-invalid', {
      placementPolicy: {
        requestedPlacement: 'peer',
        advisory: false,
        targetPeerIds: ['peer-b']
      }
    }),
    (err) => {
      assert.equal(err.code, 'ERR_NODEKERNEL_DISTRIBUTED_GPU_RESIDENT_STAGE_PLACEMENT_UNAVAILABLE');
      assert.equal(err.placementPreflight.status, 'blocked-distributed-resident-stage-placement-executor-contract-invalid');
      assert.equal(err.placementPreflight.executorContractReady, false);
      assert.equal(
        err.placementPreflight.executorContractStatus,
        'blocked-resident-stage-placement-executor-contract-invalid'
      );
      assert.equal(err.placementPreflight.computeManagerPreflight, null);
      assert.equal(err.placementPreflight.executorContract.remoteRetainedRefsUsableLocally, false);
      assert.equal(err.placementPreflight.executorContract.localHotBufferRefreshRequired, true);
      assert.ok(
        err.placementPreflight.executorContractFailures.includes(
          'remote-retained-refs-must-be-metadata-only-nonlocal'
        )
      );
      assert.ok(
        err.placementPreflight.executorContractFailures.includes(
          'state-manager-authority-required'
        )
      );
      assert.ok(
        err.placementPreflight.executorContractFailures.includes(
          'cache-admission-required'
        )
      );
      return true;
    }
  );
});

test('NodeKernel executes local GPU resident stage plans through ComputeManager authority', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-local-execution';
  let preflightCalled = false;
  let executionCalled = false;
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement(leaseId, options) {
      preflightCalled = true;
      assert.equal(leaseId, 'lease-local-execution');
      assert.equal(options.context?.scenario, 'local-execution-unit');
      return {
        schema: 'peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0',
        status: 'placement-preflight-ready',
        canExecute: true
      };
    },
    async executeGpuResidentLaneStagePlan(leaseId, options) {
      executionCalled = true;
      assert.equal(leaseId, 'lease-local-execution');
      assert.equal(options.input.value, 17);
      return {
        schema: 'peercompute.compute.gpu-resident-lane-stage-execution.v0',
        status: 'completed',
        retainedBufferRefs: ['local-buffer:stage']
      };
    }
  };

  const result = await node.executeGpuResidentLaneStagePlan('lease-local-execution', {
    input: { value: 17 },
    context: { scenario: 'local-execution-unit' },
    placementPolicy: { requestedPlacement: 'local' }
  });

  assert.equal(preflightCalled, true);
  assert.equal(executionCalled, true);
  assert.equal(result.schema, 'peercompute.compute.gpu-resident-lane-stage-execution.v0');
  assert.equal(result.nodeKernelGpuResidentStageAuthority.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_EXECUTION_AUTHORITY_SCHEMA);
  assert.equal(result.nodeKernelGpuResidentStageAuthority.status, 'executed-through-local-compute-manager');
  assert.equal(result.nodeKernelGpuResidentStageAuthority.localPlacement, true);
  assert.equal(result.nodeKernelGpuResidentStageAuthority.remoteResultPreflight, null);
  assert.equal(
    result.nodeKernelGpuResidentStageAuthority.placementPreflight.schema,
    NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA
  );
});

test('NodeKernel submits distributed GPU resident stage execution through validated executor as non-admitted metadata', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-remote-execution';
  let localPreflightCalled = false;
  let localExecutionCalled = false;
  let seenRequest = null;
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement() {
      localPreflightCalled = true;
      throw new Error('distributed GPU resident stage should not preflight locally');
    },
    async executeGpuResidentLaneStagePlan() {
      localExecutionCalled = true;
      throw new Error('distributed GPU resident stage should not execute locally');
    }
  };
  node.registerGpuResidentStagePlacementExecutor(
    'gpu-resident-stage-placement:peer-b',
    {
      executor: async (request, context) => {
        seenRequest = request;
        assert.equal(request.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_REQUEST_SCHEMA);
        assert.equal(request.leaseId, 'lease-remote-execution');
        assert.equal(request.targetPeerId, 'peer-b');
        assert.equal(request.input.value, 29);
        assert.equal(request.context.scenario, 'remote-execution-unit');
        assert.equal(context.placementPreflight.status, 'distributed-resident-stage-placement-executor-ready');
        return {
          schema: 'peercompute.test.remote-gpu-resident-stage-result.v0',
          status: 'completed',
          cacheKey: 'remote-stage-cache:unit',
          retainedBufferRefs: ['remote-buffer:stage']
        };
      },
      targetPeerId: 'peer-b',
      transport: 'unit-gpu-resident-stage-placement-executor',
      supportsGpuResidentStagePlacement: true,
      retainedRefPolicy: 'metadata-only-nonlocal',
      stateAuthority: 'node-kernel-state-manager',
      cacheAdmissionPolicy: 'state-manager-required'
    }
  );

  const result = await node.executeGpuResidentLaneStagePlan('lease-remote-execution', {
    input: { value: 29 },
    context: { scenario: 'remote-execution-unit' },
    placementPolicy: {
      requestedPlacement: 'peer',
      advisory: false,
      targetPeerIds: ['peer-b']
    }
  });

  assert.equal(localPreflightCalled, false);
  assert.equal(localExecutionCalled, false);
  assert.equal(seenRequest.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_REQUEST_SCHEMA);
  assert.equal(result.schema, 'peercompute.test.remote-gpu-resident-stage-result.v0');
  assert.equal(result.remoteGpuResidentStageResultPreflight.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_RESULT_PREFLIGHT_SCHEMA);
  assert.equal(result.remoteGpuResidentStageResultPreflight.status, 'remote-resident-stage-result-received-not-admitted');
  assert.equal(result.remoteGpuResidentStageResultPreflight.admittedLocally, false);
  assert.equal(result.remoteGpuResidentStageResultPreflight.remoteRetainedRefsUsableLocally, false);
  assert.equal(result.remoteGpuResidentStageResultPreflight.localHotBufferRefreshRequired, true);
  assert.deepEqual(result.remoteGpuResidentStageResultPreflight.remoteRetainedBufferRefs, ['remote-buffer:stage']);
  assert.equal(result.nodeKernelGpuResidentStageAuthority.schema, NODE_KERNEL_GPU_RESIDENT_STAGE_EXECUTION_AUTHORITY_SCHEMA);
  assert.equal(
    result.nodeKernelGpuResidentStageAuthority.status,
    'submitted-through-node-kernel-distributed-resident-stage-executor'
  );
  assert.equal(result.nodeKernelGpuResidentStageAuthority.remoteResultAdmitted, false);
  assert.equal(result.nodeKernelGpuResidentStageAuthority.remoteRetainedRefsUsableLocally, false);
  assert.equal(result.nodeKernelGpuResidentStageAuthority.localHotBufferRefreshRequired, true);
  assert.equal(result.nodeKernelGpuResidentStageAuthority.executorId, 'gpu-resident-stage-placement:peer-b');
  assert.equal(
    result.nodeKernelGpuResidentStageAuthority.placementPreflight.status,
    'distributed-resident-stage-placement-executor-ready'
  );
});

test('NodeKernel admits remote GPU resident stage execution results as metadata only', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-remote-admission';
  const committedDeltas = [];
  node.stateManager = {
    commitDelta(delta) {
      committedDeltas.push(delta);
    }
  };
  node.computeManager = {
    preflightGpuResidentLaneStagePlacement() {
      throw new Error('distributed GPU resident stage should not preflight locally');
    }
  };
  node.registerGpuResidentStagePlacementExecutor(
    'gpu-resident-stage-placement:peer-b',
    {
      executor: async () => ({
        schema: 'peercompute.test.remote-gpu-resident-stage-result.v0',
        status: 'completed',
        cacheKey: 'remote-stage-cache:admit',
        stateFamilies: ['particle-kinematics'],
        retainedBufferRefs: ['remote-buffer:positions'],
        compactCandidate: {
          schema: 'peercompute.test.remote-stage-compact-candidate.v0',
          hash: 'fnv1a32-remote-stage-compact',
          particleCount: 2
        }
      }),
      targetPeerId: 'peer-b',
      supportsGpuResidentStagePlacement: true,
      retainedRefPolicy: 'metadata-only-nonlocal',
      stateAuthority: 'node-kernel-state-manager',
      cacheAdmissionPolicy: 'state-manager-required'
    }
  );

  const result = await node.executeGpuResidentLaneStagePlan('lease-remote-admission', {
    placementPolicy: {
      requestedPlacement: 'peer',
      advisory: false,
      targetPeerIds: ['peer-b']
    }
  });
  const admission = node.commitRemoteGpuResidentStageExecutionResult(result, {
    allowedStateFamilies: ['particle-kinematics'],
    returnCommitDelta: true
  });

  assert.equal(admission.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_RESULT_ADMISSION_SCHEMA);
  assert.equal(admission.status, 'remote-resident-stage-result-admitted-metadata');
  assert.equal(admission.admitted, true);
  assert.equal(admission.committed, true);
  assert.equal(admission.cacheKey, 'remote-stage-cache:admit');
  assert.deepEqual(admission.stateFamilies, ['particle-kinematics']);
  assert.deepEqual(admission.remoteRetainedBufferRefs, ['remote-buffer:positions']);
  assert.equal(admission.remoteRetainedRefsUsableLocally, false);
  assert.equal(admission.localHotBufferRefreshRequired, true);
  assert.equal(admission.remoteResultPreflight.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_RESULT_PREFLIGHT_SCHEMA);
  assert.equal(admission.commitDelta.scope, 'remote-gpu-resident-stage-results');
  assert.equal(committedDeltas.length, 1);
  assert.equal(committedDeltas[0].payload.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_RESULT_ADMISSION_SCHEMA);
  assert.equal(committedDeltas[0].payload.remoteRetainedRefsUsableLocally, false);
  assert.equal(committedDeltas[0].payload.localHotBufferRefreshRequired, true);
});

test('NodeKernel refreshes local hot buffers from admitted remote GPU resident stage metadata', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-gpu-stage-remote-refresh';
  const committedDeltas = [];
  let acquiredSpec = null;
  let completedOptions = null;
  node.stateManager = {
    commitDelta(delta) {
      committedDeltas.push(delta);
    }
  };
  node.computeManager = {
    acquireGpuResidentLaneLease(spec) {
      acquiredSpec = spec;
      return {
        schema: 'peercompute.compute.gpu-resident-lane-lease.v0',
        leaseId: 'local-refresh-lease',
        laneId: spec.laneId,
        stateKey: spec.stateKey,
        retainedBufferRefs: spec.retainedBufferRefs,
        remoteRetainedBufferRefs: spec.remoteRetainedBufferRefs
      };
    },
    completeGpuResidentLaneLease(leaseId, options) {
      assert.equal(leaseId, 'local-refresh-lease');
      completedOptions = options;
      return {
        schema: 'peercompute.compute.gpu-resident-lane-execution.v0',
        lease: { leaseId },
        gpuFence: {
          status: options.status,
          method: options.method,
          fenceSatisfied: true
        },
        retainedBufferRefs: options.retainedBufferRefs
      };
    },
    rejectGpuResidentLaneLease() {
      throw new Error('refresh should not reject successful lease');
    }
  };
  const admission = {
    schema: NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_RESULT_ADMISSION_SCHEMA,
    status: 'remote-resident-stage-result-admitted-metadata',
    admitted: true,
    cacheKey: 'remote-stage-cache:refresh',
    leaseId: 'remote-stage-lease',
    stateFamilies: ['particle-kinematics'],
    remoteRetainedBufferRefs: ['remote-buffer:positions'],
    retainedBufferRefs: ['remote-buffer:positions'],
    remoteRetainedRefsUsableLocally: false,
    localHotBufferRefreshRequired: true,
    compactPayload: {
      schema: 'peercompute.test.remote-stage-compact-candidate.v0',
      particleCount: 2
    }
  };

  const refresh = await node.refreshRemoteGpuResidentStageHotBuffersFromAdmission(admission, {
    returnCommitDelta: true,
    refreshExecutor: async ({ admission: refreshAdmission, compactPayload, lease }) => {
      assert.equal(refreshAdmission.cacheKey, 'remote-stage-cache:refresh');
      assert.equal(compactPayload.particleCount, 2);
      assert.equal(lease.leaseId, 'local-refresh-lease');
      return {
        schema: 'peercompute.test.local-remote-stage-refresh.v0',
        status: 'completed',
        localBufferRefs: ['local-buffer:positions'],
        retainedBufferRefs: ['local-buffer:positions'],
        gpuFence: {
          status: 'queue-work-completed',
          method: 'unit-remote-stage-refresh'
        }
      };
    }
  });

  assert.equal(refresh.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_HOT_BUFFER_REFRESH_SCHEMA);
  assert.equal(refresh.status, 'hot-buffer-refresh-completed');
  assert.equal(refresh.refreshed, true);
  assert.deepEqual(refresh.remoteRetainedBufferRefs, ['remote-buffer:positions']);
  assert.deepEqual(refresh.retainedBufferRefs, ['local-buffer:positions']);
  assert.deepEqual(refresh.localBufferRefs, ['local-buffer:positions']);
  assert.equal(refresh.remoteRetainedRefsUsableLocally, false);
  assert.equal(refresh.execution.gpuFence.fenceSatisfied, true);
  assert.equal(refresh.commitDelta.scope, 'remote-gpu-resident-stage-hot-buffer-refreshes');
  assert.deepEqual(acquiredSpec.readFamilies, ['particle-kinematics']);
  assert.deepEqual(acquiredSpec.writeFamilies, ['particle-kinematics']);
  assert.deepEqual(acquiredSpec.remoteRetainedBufferRefs, ['remote-buffer:positions']);
  assert.deepEqual(completedOptions.retainedBufferRefs, ['local-buffer:positions']);
  assert.equal(committedDeltas.length, 1);
  assert.equal(committedDeltas[0].payload.schema, NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_HOT_BUFFER_REFRESH_SCHEMA);
  assert.deepEqual(committedDeltas[0].payload.retainedBufferRefs, ['local-buffer:positions']);
});

test('NodeKernel blocks non-advisory distributed task graphs until graph executor exists', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-task-graph-distributed-block';
  node.computeManager = {
    async submitTaskGraph() {
      throw new Error('distributed graph should not be submitted locally');
    }
  };

  await assert.rejects(
    node.submitTaskGraph({
      graphId: 'distributed-task-graph-fixture',
      placementPolicy: {
        requestedPlacement: 'peer',
        advisory: false
      },
      nodes: [{ id: 'a', task: { fn: () => 1 } }]
    }),
    (err) => {
      assert.equal(err.code, 'ERR_NODEKERNEL_DISTRIBUTED_TASK_GRAPH_UNAVAILABLE');
      assert.equal(err.placementPreflight.schema, 'peercompute.nodekernel.task-graph-placement-preflight.v0');
      assert.equal(err.placementPreflight.status, 'blocked-distributed-graph-executor-unavailable');
      assert.equal(err.placementPreflight.requestedPlacement, 'peer');
      assert.equal(err.placementPreflight.advisory, false);
      return true;
    }
  );
});

test('NodeKernel executes non-advisory distributed task graphs through a remote peer ComputeManager', async () => {
  const requester = makeStartedKernel('node-task-graph-requester');
  const responder = makeStartedKernel('node-task-graph-responder', {
    enableRemoteTaskGraphResponder: true
  });
  const messages = [];
  connectInMemoryTaskGraphKernels({ requester, responder, messages });

  let requesterLocalSubmitted = false;
  let responderSubmittedGraph = null;
  requester.computeManager = {
    async submitTaskGraph() {
      requesterLocalSubmitted = true;
      throw new Error('requester local compute manager must not run distributed graph');
    }
  };
  responder.computeManager = {
    async submitTaskGraph(graph) {
      responderSubmittedGraph = graph;
      assert.equal(graph.placementPolicy.authority, 'node-kernel');
      assert.equal(graph.placementPolicy.nodeId, 'node-task-graph-requester');
      assert.deepEqual(graph.placementPolicy.targetPeerIds, ['peer-b']);
      return {
        schema: 'peercompute.compute.task-graph-result.v0',
        graphId: graph.graphId,
        status: 'completed',
        nodeCount: graph.nodes.length,
        nodeResults: {
          law: {
            schema: 'peercompute.test.remote-task-graph-node-result.v0',
            ok: true
          }
        },
        cacheKey: 'remote-graph-cache:fnv1a32-default',
        cacheInputHash: 'fnv1a32-input-default',
        cacheArtifact: {
          schema: 'peercompute.compute.task-graph-cache-artifact.v0',
          cacheKey: 'remote-graph-cache:fnv1a32-default',
          artifactId: 'remote-graph-cache-artifact-default',
          status: 'recorded-not-admitted',
          admitted: false,
          resultHash: 'fnv1a32-result-default',
          inputHash: 'fnv1a32-input-default'
        },
        placementPolicy: {
          schema: 'peercompute.compute.task-graph-placement-policy.v0',
          requestedPlacement: graph.placementPolicy.requestedPlacement,
          authority: graph.placementPolicy.authority,
          targetPeerIds: graph.placementPolicy.targetPeerIds
        }
      };
    }
  };

  const result = await requester.submitTaskGraph({
    graphId: 'distributed-task-graph-remote-fixture',
    placementPolicy: {
      requestedPlacement: 'peer',
      advisory: false,
      targetPeerIds: ['peer-b']
    },
    nodes: [{
      id: 'law',
      task: {
        id: 'law-task',
        runtime: 'js',
        module: '/tasks/law.js',
        exportName: 'run',
        data: { value: 7 }
      }
    }]
  });

  assert.equal(requesterLocalSubmitted, false);
  assert.equal(responderSubmittedGraph.graphId, 'distributed-task-graph-remote-fixture');
  assert.equal(messages[0].message.type, 'compute-task-graph');
  assert.equal(messages[0].message.data.schema, REMOTE_TASK_GRAPH_REQUEST_SCHEMA);
  assert.equal(messages[0].message.data.targetPeerId, 'peer-b');
  assert.equal(messages[1].message.type, 'compute-task-graph-result');
  assert.equal(messages[1].message.data.schema, REMOTE_TASK_GRAPH_RESULT_SCHEMA);
  assert.equal(result.nodeKernelOwned, true);
  assert.equal(result.nodeKernelAuthority.schema, 'peercompute.nodekernel.task-graph-authority.v0');
  assert.equal(result.nodeKernelAuthority.status, 'submitted-through-node-kernel-distributed-executor');
  assert.equal(
    result.nodeKernelAuthority.placementPreflight.status,
    'distributed-placement-executor-ready'
  );
  assert.equal(result.nodeKernelAuthority.placementPreflight.targetPeerId, 'peer-b');
  assert.equal(result.nodeKernelAuthority.placementPreflight.distributedGraphExecutorAvailable, true);
  assert.equal(result.taskGraphPlacementProvenance.schema, REMOTE_TASK_GRAPH_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(result.taskGraphPlacementProvenance.transport, 'nodekernel-remote-task-graph');
  assert.equal(result.taskGraphPlacementProvenance.peerId, 'node-task-graph-responder');
  assert.equal(result.taskGraphPlacementProvenance.targetPeerId, 'peer-b');
  assert.equal(result.taskGraphPlacementProvenance.requestSchema, REMOTE_TASK_GRAPH_REQUEST_SCHEMA);
  assert.equal(result.taskGraphPlacementProvenance.responseSchema, REMOTE_TASK_GRAPH_RESULT_SCHEMA);
  assert.equal(
    result.remoteTaskGraphCacheArtifactPreflight.schema,
    NODE_KERNEL_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_PREFLIGHT_SCHEMA
  );
  assert.equal(
    result.remoteTaskGraphCacheArtifactPreflight.status,
    'remote-cache-artifact-received-not-admitted'
  );
  assert.equal(result.remoteTaskGraphCacheArtifactPreflight.cacheKey, 'remote-graph-cache:fnv1a32-default');
  assert.equal(result.remoteTaskGraphCacheArtifactPreflight.admittedLocally, false);
  assert.equal(
    result.taskGraphPlacementProvenance.cacheArtifactPreflight.status,
    'remote-cache-artifact-received-not-admitted'
  );
  assert.deepEqual(result.nodeResults.law, {
    schema: 'peercompute.test.remote-task-graph-node-result.v0',
    ok: true
  });
  assert.equal(requester.pendingRemoteTaskGraphRequests.size, 0);
});

test('NodeKernel admits explicit remote task graph cache artifacts through StateManager authority', async () => {
  const requester = makeStartedKernel('node-task-graph-cache-requester');
  const responder = makeStartedKernel('node-task-graph-cache-responder', {
    enableRemoteTaskGraphResponder: true
  });
  connectInMemoryTaskGraphKernels({ requester, responder });

  const admissions = [];
  const committedDeltas = [];
  requester.stateManager = {
    commitDelta(delta) {
      committedDeltas.push(delta);
    },
    getWarmDeltas(scope) {
      return Object.fromEntries(
        committedDeltas
          .filter((delta) => delta.scope === scope)
          .map((delta) => [delta.taskId, {
            version: delta.version ?? null,
            payload: delta.payload ?? null,
            ts: delta.timestamp ?? null
          }])
      );
    },
    admitTaskGraphCacheArtifact(artifact, options) {
      admissions.push({
        cacheKey: artifact.cacheKey,
        sourcePeerId: options.sourcePeerId,
        responderId: options.responderId,
        requestId: options.requestId,
        validatorId: options.validatorId,
        reason: options.reason
      });
      return {
        schema: 'peercompute.state.task-graph-cache-artifact-admission.v0',
        cacheKey: artifact.cacheKey,
        admissionId: 'remote-cache-admission-1',
        authority: options.authority,
        sourceNodeId: options.sourceNodeId,
        sourcePeerId: options.sourcePeerId,
        responderId: options.responderId,
        requestId: options.requestId,
        validatorId: options.validatorId,
        reason: options.reason,
        status: 'admitted',
        admitted: true
      };
    }
  };
  requester.computeManager = new ComputeManager({ enableWorkers: false });
  responder.computeManager = {
    async submitTaskGraph(graph) {
      return {
        schema: 'peercompute.compute.task-graph-result.v0',
        graphId: graph.graphId,
        status: 'completed',
        nodeCount: graph.nodes.length,
        nodeResults: {
          law: { ok: true }
        },
        cacheKey: 'remote-graph-cache:fnv1a32-admit',
        cacheInputHash: 'fnv1a32-input-admit',
        cacheInputs: {
          stateFamilies: ['particle-kinematics'],
          retainedBufferRefs: ['remote-buffer:positions']
        },
        stateSeedPayload: {
          schema: 'peercompute.test.remote-state-seed.v0',
          particleCount: 1,
          centerOfMass: [1, 2, 3]
        },
        graphLeaseRequired: true,
        graphLeaseStatus: 'completed',
        graphLeaseSpec: {
          schema: 'peercompute.compute.task-graph-gpu-resident-lane.v0',
          laneId: 'remote-lane-a',
          stateKey: 'remote-state-a',
          retainedBufferRefs: ['remote-buffer:positions']
        },
        cacheArtifact: {
          schema: 'peercompute.compute.task-graph-cache-artifact.v0',
          cacheKey: 'remote-graph-cache:fnv1a32-admit',
          artifactId: 'remote-graph-cache-artifact-admit',
          status: 'recorded-not-admitted',
          admitted: false,
          resultHash: 'fnv1a32-result-admit',
          inputHash: 'fnv1a32-input-admit',
          stateSeedPayload: {
            schema: 'peercompute.test.remote-state-seed.v0',
            particleCount: 1,
            centerOfMass: [1, 2, 3]
          },
          inputs: {
            stateFamilies: ['particle-kinematics'],
            retainedBufferRefs: ['remote-buffer:positions']
          }
        }
      };
    }
  };

  const result = await requester.submitTaskGraph({
    graphId: 'distributed-task-graph-remote-cache-fixture',
    placementPolicy: {
      requestedPlacement: 'peer',
      advisory: false,
      targetPeerIds: ['peer-b'],
      admitRemoteTaskGraphCacheArtifact: true,
      remoteTaskGraphCacheArtifactValidatorId: 'unit-remote-cache-validator'
    },
    nodes: [{
      id: 'law',
      task: {
        id: 'law-task-cache',
        runtime: 'js',
        module: '/tasks/law-cache.js',
        exportName: 'run',
        data: { value: 11 }
      }
    }]
  });

  assert.equal(admissions.length, 1);
  assert.equal(admissions[0].cacheKey, 'remote-graph-cache:fnv1a32-admit');
  assert.equal(admissions[0].sourcePeerId, 'peer-b');
  assert.equal(admissions[0].responderId, 'node-task-graph-cache-responder');
  assert.equal(admissions[0].validatorId, 'unit-remote-cache-validator');
  assert.equal(admissions[0].reason, 'remote-task-graph-cache-artifact-admitted');
  assert.equal(
    result.remoteTaskGraphCacheArtifactPreflight.status,
    'admitted-through-node-kernel-state-manager'
  );
  assert.equal(result.remoteTaskGraphCacheArtifactPreflight.admittedLocally, true);
  assert.equal(result.remoteTaskGraphCacheArtifactPreflight.importedLocally, true);
  assert.equal(
    result.remoteTaskGraphCacheArtifactPreflight.importReport.schema,
    COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA
  );
  assert.equal(
    result.remoteTaskGraphCacheArtifactPreflight.importReport.retainedGpuLaneRefsStatus,
    'remote-retained-buffer-refs-metadata-only'
  );
  assert.equal(result.remoteTaskGraphCacheArtifactPreflight.admission.admitted, true);
  assert.equal(result.remoteTaskGraphCacheArtifactPreflight.admission.computeArtifactAdmitted, false);
  assert.equal(
    result.taskGraphPlacementProvenance.cacheArtifactPreflight.status,
    'admitted-through-node-kernel-state-manager'
  );
  const importedArtifact = requester.computeManager.getTaskGraphCacheArtifact('remote-graph-cache:fnv1a32-admit');
  assert.equal(importedArtifact.admitted, true);
  assert.equal(importedArtifact.status, 'admitted-remote-cache-artifact-recorded');
  assert.equal(importedArtifact.remoteCacheImport.schema, COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA);

  const cached = await requester.computeManager.submitTaskGraph({
    graphId: 'local-read-through-remote-cache-fixture',
    cachePolicy: {
      cacheKey: 'remote-graph-cache:fnv1a32-admit',
      mode: 'read-only',
      requireAdmitted: true
    },
    nodes: [{
      id: 'should-not-run',
      task: {
        id: 'should-not-run-task',
        runtime: 'js',
        module: '/tasks/should-not-run.js',
        exportName: 'run'
      }
    }]
  });
  assert.equal(cached.cacheStatus, 'hit');
  assert.equal(cached.cacheHit, true);
  assert.equal(cached.remoteTaskGraphCacheImport.schema, COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA);
  assert.equal(cached.remoteGraphLeaseRefs.usableLocally, false);
  assert.deepEqual(cached.remoteGraphLeaseRefs.retainedBufferRefs, ['remote-buffer:positions']);
  const seedPolicy = requester.computeManager.evaluateRemoteTaskGraphStateSeedPolicy(
    'remote-graph-cache:fnv1a32-admit',
    {
      allowedStateFamilies: ['particle-kinematics'],
      allowWarmStateSeed: true,
      allowHotBufferRefresh: true
    }
  );
  assert.equal(seedPolicy.schema, COMPUTE_REMOTE_TASK_GRAPH_STATE_SEED_POLICY_SCHEMA);
  assert.equal(seedPolicy.status, 'policy-ready');
  assert.equal(seedPolicy.stateFamilyStatus, 'state-family-allowed');
  assert.equal(seedPolicy.warmStateSeedStatus, 'warm-state-seed-allowed');
  assert.equal(seedPolicy.hotBufferRefreshStatus, 'local-refresh-required');
  assert.equal(seedPolicy.remoteRetainedRefsUsableLocally, false);
  assert.equal(seedPolicy.stateSeedPayloadAvailable, true);
  assert.deepEqual(seedPolicy.stateSeedPayload.centerOfMass, [1, 2, 3]);
  assert.deepEqual(seedPolicy.stateFamilies, ['particle-kinematics']);
  assert.deepEqual(seedPolicy.retainedBufferRefs, ['remote-buffer:positions']);
  const committedSeed = requester.commitRemoteTaskGraphStateSeed(
    'remote-graph-cache:fnv1a32-admit',
    {
      allowedStateFamilies: ['particle-kinematics'],
      allowHotBufferRefresh: true,
      returnCommitDelta: true
    }
  );
  assert.equal(committedSeed.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA);
  assert.equal(committedSeed.status, 'warm-state-seed-committed');
  assert.equal(committedSeed.committed, true);
  assert.equal(committedSeed.commitDeltaScope, 'remote-task-graph-state-seeds');
  assert.equal(committedSeed.hotBufferRefreshStatus, 'local-refresh-required');
  assert.equal(committedSeed.hotBufferRefreshRequired, true);
  assert.equal(committedSeed.remoteRetainedRefsUsableLocally, false);
  assert.deepEqual(committedSeed.stateSeedPayload.centerOfMass, [1, 2, 3]);
  assert.equal(committedDeltas.length, 1);
  assert.equal(committedDeltas[0].taskId, 'remote-task-graph-state-seed:remote-graph-cache:fnv1a32-admit');
  assert.equal(committedDeltas[0].scope, 'remote-task-graph-state-seeds');
  assert.equal(committedDeltas[0].payload.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA);
  assert.deepEqual(committedDeltas[0].payload.stateFamilies, ['particle-kinematics']);
  const refresh = await requester.refreshRemoteTaskGraphHotBuffersFromSeed(
    'remote-graph-cache:fnv1a32-admit',
    {
      returnCommitDelta: true,
      refreshExecutor: async ({ stateSeedPayload, lease }) => ({
        schema: 'peercompute.test.local-hot-buffer-refresh.v0',
        stateSeedSchema: stateSeedPayload.schema,
        leaseId: lease.leaseId,
        localBufferRefs: ['local-buffer:positions'],
        retainedBufferRefs: ['local-buffer:positions'],
        gpuFence: {
          status: 'queue-work-completed',
          method: 'unit-local-refresh'
        }
      })
    }
  );
  assert.equal(refresh.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA);
  assert.equal(refresh.status, 'hot-buffer-refresh-completed');
  assert.equal(refresh.refreshed, true);
  assert.equal(refresh.execution.gpuFence.fenceSatisfied, true);
  assert.equal(refresh.execution.gpuFence.method, 'unit-local-refresh');
  assert.deepEqual(refresh.localBufferRefs, ['local-buffer:positions']);
  assert.deepEqual(refresh.retainedBufferRefs, ['local-buffer:positions']);
  assert.equal(refresh.commitDelta.scope, 'remote-task-graph-hot-buffer-refreshes');
  assert.equal(committedDeltas.length, 2);
  assert.equal(committedDeltas[1].payload.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA);
  assert.equal(committedDeltas[1].payload.execution.gpuFence.fenceSatisfied, true);
  const compactCandidate = requester.commitRemoteTaskGraphCompactCandidate(
    'remote-graph-cache:fnv1a32-admit',
    {
      allowedStateFamilies: ['particle-kinematics'],
      returnCommitDelta: true,
      compactCandidate: {
        schema: 'peercompute.test.compact-candidate.v0',
        status: 'compact-output-ready',
        sourceNodeId: 'law',
        hash: 'fnv1a32-compact',
        stateFamilies: ['particle-kinematics'],
        retainedBufferRefs: ['remote-buffer:positions'],
        outputBuffers: {
          stateBufferByteLength: 32
        },
        gpuFenceSatisfied: true,
        admissionRequired: true,
        localRefreshRequired: true
      }
    }
  );
  assert.equal(compactCandidate.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA);
  assert.equal(compactCandidate.status, 'compact-candidate-committed');
  assert.equal(compactCandidate.committed, true);
  assert.equal(compactCandidate.commitDeltaScope, 'remote-task-graph-compact-candidates');
  assert.equal(compactCandidate.localRefreshRequired, true);
  assert.equal(compactCandidate.hotBufferRefreshStatus, 'compact-candidate-local-refresh-required');
  assert.equal(compactCandidate.remoteRetainedRefsUsableLocally, false);
  assert.deepEqual(compactCandidate.stateFamilies, ['particle-kinematics']);
  assert.deepEqual(compactCandidate.retainedBufferRefs, ['remote-buffer:positions']);
  assert.equal(compactCandidate.compactCandidate.hash, 'fnv1a32-compact');
  assert.equal(committedDeltas.length, 3);
  assert.equal(committedDeltas[2].scope, 'remote-task-graph-compact-candidates');
  assert.equal(committedDeltas[2].payload.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA);
  assert.equal(committedDeltas[2].payload.compactCandidate.hash, 'fnv1a32-compact');
  const blockedCompactRefresh = await requester.refreshRemoteTaskGraphHotBuffersFromCompactCandidate(
    'remote-graph-cache:fnv1a32-admit'
  );
  assert.equal(blockedCompactRefresh.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA);
  assert.equal(blockedCompactRefresh.status, 'refresh-executor-unavailable');
  assert.equal(blockedCompactRefresh.reason, 'local-compact-hot-buffer-refresh-executor-required');
  assert.equal(blockedCompactRefresh.sourceMode, 'compact-candidate');
  assert.equal(blockedCompactRefresh.compactCandidateAuthority.compactCandidate.hash, 'fnv1a32-compact');
  assert.equal(committedDeltas.length, 3);
  const blockedCompactExecutorResult = await requester.refreshRemoteTaskGraphHotBuffersFromCompactCandidate(
    'remote-graph-cache:fnv1a32-admit',
    {
      refreshExecutor: async () => ({
        schema: 'peercompute.test.local-compact-hot-buffer-refresh.v0',
        status: 'blocked-no-local-compact-source',
        refreshed: false,
        reason: 'test-local-compact-source-required',
        localBufferRefs: []
      })
    }
  );
  assert.equal(blockedCompactExecutorResult.status, 'compact-hot-buffer-refresh-not-completed');
  assert.equal(blockedCompactExecutorResult.reason, 'test-local-compact-source-required');
  assert.equal(blockedCompactExecutorResult.rejectedLease.releaseReason, 'remote-task-graph-compact-hot-buffer-refresh-not-completed');
  assert.equal(committedDeltas.length, 3);
  const compactRefresh = await requester.refreshRemoteTaskGraphHotBuffersFromCompactCandidate(
    'remote-graph-cache:fnv1a32-admit',
    {
      returnCommitDelta: true,
      refreshExecutor: async ({ compactCandidateAuthority, compactCandidate, lease }) => {
        assert.equal(compactCandidateAuthority.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA);
        assert.equal(compactCandidate.hash, 'fnv1a32-compact');
        assert.equal(lease.owner, 'node-kernel-remote-task-graph-compact-hot-buffer-refresh');
        return {
          schema: 'peercompute.test.local-compact-hot-buffer-refresh.v0',
          compactCandidateHash: compactCandidate.hash,
          leaseId: lease.leaseId,
          localBufferRefs: ['local-buffer:positions-from-compact'],
          retainedBufferRefs: ['local-buffer:positions-from-compact'],
          gpuFence: {
            status: 'queue-work-completed',
            method: 'unit-local-compact-refresh'
          }
        };
      }
    }
  );
  assert.equal(compactRefresh.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA);
  assert.equal(compactRefresh.status, 'hot-buffer-refresh-completed');
  assert.equal(compactRefresh.sourceMode, 'compact-candidate');
  assert.equal(compactRefresh.refreshed, true);
  assert.equal(compactRefresh.execution.gpuFence.fenceSatisfied, true);
  assert.equal(compactRefresh.execution.gpuFence.method, 'unit-local-compact-refresh');
  assert.deepEqual(compactRefresh.remoteRetainedBufferRefs, ['remote-buffer:positions']);
  assert.deepEqual(compactRefresh.localBufferRefs, ['local-buffer:positions-from-compact']);
  assert.deepEqual(compactRefresh.retainedBufferRefs, ['local-buffer:positions-from-compact']);
  assert.equal(compactRefresh.compactCandidate.hash, 'fnv1a32-compact');
  assert.equal(compactRefresh.commitDelta.scope, 'remote-task-graph-hot-buffer-refreshes');
  assert.equal(committedDeltas.length, 4);
  assert.equal(committedDeltas[3].payload.schema, NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA);
  assert.equal(committedDeltas[3].payload.sourceMode, 'compact-candidate');
  assert.deepEqual(committedDeltas[3].payload.localBufferRefs, ['local-buffer:positions-from-compact']);
  const blockedSeedPolicy = requester.computeManager.evaluateRemoteTaskGraphStateSeedPolicy(
    'remote-graph-cache:fnv1a32-admit',
    {
      allowedStateFamilies: ['chemical-species'],
      allowWarmStateSeed: true,
      allowHotBufferRefresh: true
    }
  );
  assert.equal(blockedSeedPolicy.status, 'blocked-state-family-policy');
  assert.equal(blockedSeedPolicy.warmStateSeedStatus, 'warm-state-seed-blocked');
  assert.equal(blockedSeedPolicy.hotBufferRefreshStatus, 'hot-buffer-refresh-blocked');
  assert.deepEqual(blockedSeedPolicy.disallowedStateFamilies, ['particle-kinematics']);
  const blockedCommit = requester.commitRemoteTaskGraphStateSeed(
    'remote-graph-cache:fnv1a32-admit',
    {
      allowedStateFamilies: ['chemical-species'],
      allowHotBufferRefresh: true
    }
  );
  assert.equal(blockedCommit.status, 'blocked-by-policy');
  assert.equal(blockedCommit.committed, false);
  assert.equal(committedDeltas.length, 4);
  const requesterStats = requester.computeManager.getStats();
  assert.equal(requesterStats.taskGraphRemoteCacheImports, 1);
  assert.equal(requesterStats.taskGraphCacheHits, 1);
});

test('NodeKernel allows advisory distributed task graphs but records local-execution preflight', async () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false
  });
  node.nodeId = 'node-task-graph-advisory';
  node.computeManager = {
    async submitTaskGraph(graph) {
      return {
        schema: 'peercompute.compute.task-graph-result.v0',
        graphId: graph.graphId,
        status: 'completed',
        placementPolicy: {
          schema: 'peercompute.compute.task-graph-placement-policy.v0',
          requestedPlacement: graph.placementPolicy.requestedPlacement,
          authority: graph.placementPolicy.authority
        }
      };
    }
  };

  const result = await node.submitTaskGraph({
    graphId: 'advisory-distributed-task-graph-fixture',
    placementPolicy: {
      requestedPlacement: 'cluster',
      advisory: true
    },
    nodes: [{ id: 'a', task: { fn: () => 1 } }]
  });

  assert.equal(result.nodeKernelOwned, true);
  assert.equal(
    result.nodeKernelAuthority.placementPreflight.status,
    'advisory-distributed-placement-local-execution-allowed'
  );
  assert.equal(result.nodeKernelAuthority.placementPreflight.requestedPlacement, 'cluster');
  assert.equal(result.nodeKernelAuthority.placementPreflight.advisory, true);
  assert.equal(result.placementPolicy.authority, 'node-kernel');
});
