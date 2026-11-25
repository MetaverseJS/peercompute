/**
 * @fileoverview PeerCompute Core - Slim dependency-free core entrypoint
 *
 * Exports PeerCompute's scheduling, resource leases, epoch fencing, StateManager
 * admission, spatial tile coordination, WebRTC/libp2p transport, GPUHub residency,
 * and service orchestration primitives with ZERO static or dynamic import edges
 * into `src/peercompute/inference/`, `peercompute-diffusion-ort`, `onnxruntime-web`,
 * `@huggingface/transformers`, `@wllama/wllama`, or `@kaminos/webgpu-inference-kit`.
 */

import {
  NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_EXECUTION_AUTHORITY_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_EXECUTOR_CONTRACT_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_REQUEST_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_RESULT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_HOT_BUFFER_REFRESH_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_RESULT_ADMISSION_SCHEMA,
  NODE_KERNEL_TASK_GRAPH_AUTHORITY_SCHEMA,
  NODE_KERNEL_TASK_GRAPH_PLACEMENT_PREFLIGHT_SCHEMA,
  NodeKernel,
  REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_COMPUTE_REQUEST_SCHEMA,
  REMOTE_COMPUTE_RESULT_SCHEMA,
  REMOTE_TASK_GRAPH_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_TASK_GRAPH_REQUEST_SCHEMA,
  REMOTE_TASK_GRAPH_RESULT_SCHEMA
} from './nodeKernel/NodeKernel.js';

export {
  NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_COMPACT_CANDIDATE_AUTHORITY_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_HOT_BUFFER_REFRESH_SCHEMA,
  NODE_KERNEL_REMOTE_TASK_GRAPH_STATE_SEED_AUTHORITY_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_EXECUTION_AUTHORITY_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_EXECUTOR_CONTRACT_SCHEMA,
  NODE_KERNEL_GPU_RESIDENT_STAGE_PLACEMENT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_REQUEST_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_EXECUTION_RESULT_PREFLIGHT_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_HOT_BUFFER_REFRESH_SCHEMA,
  NODE_KERNEL_REMOTE_GPU_RESIDENT_STAGE_RESULT_ADMISSION_SCHEMA,
  NODE_KERNEL_TASK_GRAPH_AUTHORITY_SCHEMA,
  NODE_KERNEL_TASK_GRAPH_PLACEMENT_PREFLIGHT_SCHEMA,
  NodeKernel,
  REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_COMPUTE_REQUEST_SCHEMA,
  REMOTE_COMPUTE_RESULT_SCHEMA,
  REMOTE_TASK_GRAPH_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_TASK_GRAPH_REQUEST_SCHEMA,
  REMOTE_TASK_GRAPH_RESULT_SCHEMA
};

export {
  ComputeManager,
  COMPUTE_GPU_FENCE_REPORT_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
  COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA,
  COMPUTE_REMOTE_TASK_GRAPH_STATE_SEED_POLICY_SCHEMA,
  COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA,
  COMPUTE_TASK_EXECUTION_SCHEMA,
  COMPUTE_TASK_PACKET_SCHEMA,
  COMPUTE_TASK_PLACEMENT_SCHEMA,
  COMPUTE_WORKER_UTILIZATION_SCHEMA
} from './computeManager/ComputeManager.js';

export {
  STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_NAMESPACE,
  STATE_TASK_GRAPH_CACHE_ARTIFACT_ADMISSION_SCHEMA,
  STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_NAMESPACE,
  STATE_TASK_GRAPH_CACHE_ARTIFACT_INVALIDATION_SCHEMA,
  StateManager
} from './stateManager/StateManager.js';

export { ReservationLedger, RESERVATION_LEDGER_SCHEMA } from './stateManager/ReservationLedger.js';
export {
  SPATIAL_TILE_BOUNDARY_SCHEMA,
  SPATIAL_TILE_EVENT_SCHEMA,
  SPATIAL_TILE_LEASE_SCHEMA,
  SPATIAL_TILE_STATES,
  SpatialTileLeaseBroker
} from './stateManager/SpatialTileLeaseBroker.js';
export { DataState } from './stateManager/DataState.js';
export {
  LOCAL_ARTIFACT_CACHE_DATABASE,
  LOCAL_ARTIFACT_CACHE_SCHEMA,
  LOCAL_ARTIFACT_CACHE_STORE,
  LocalArtifactCache
} from './stateManager/LocalArtifactCache.js';

export {
  CONNECTION_PATHS,
  DIRECT_UNICAST_PROTOCOL,
  ICE_TRANSPORT_POLICIES,
  NetworkManager,
  classifyConnectionPath,
  normalizeIceTransportPolicy
} from './networkManager/NetworkManager.js';
export {
  THROUGHPUT_TOPOLOGY_PROFILES,
  createThroughputProfileScorers
} from './networkManager/ThroughputTopologyPolicy.js';
export {
  WorkMesh,
  WORK_MESH_SCHEMA,
  WORK_MESH_DEFAULTS
} from './workMesh/WorkMesh.js';
export {
  WorkMeshService,
  WORK_MESH_PROTOCOL
} from './networkManager/WorkMeshService.js';

export {
  GPUHubManager,
  ResidentStageWorkerBackend,
  createResidentStageWorkerBackend
} from './gpu/GPUHubManager.js';
export {
  GPU_RESIDENT_LANE_COPY_BUDGET_SCHEMA,
  GPU_RESIDENT_LANE_EXECUTION_SCHEMA,
  GPU_RESIDENT_LANE_FENCE_REPORT_SCHEMA,
  GPU_RESIDENT_LANE_LEASE_SCHEMA,
  GPU_RESIDENT_LANE_MANAGER_SCHEMA,
  GPU_RESIDENT_LANE_SCHEMA,
  GPU_RESIDENT_LANE_STAGE_EXECUTION_SCHEMA,
  GPU_RESIDENT_LANE_STAGE_PLACEMENT_PREFLIGHT_SCHEMA,
  GPU_RESIDENT_LANE_STAGE_PLAN_SCHEMA,
  GpuResidentLaneManager
} from './computeManager/GpuResidentLaneManager.js';

export {
  SolverRegistry,
  normalizeSolverDescriptor,
  SOLVER_DESCRIPTOR_SCHEMA,
  SOLVER_TASK_SCHEMA
} from './computeManager/SolverRegistry.js';

export {
  PlacementAdmissionPolicy,
  createPlacementAdmissionPolicy,
  evaluatePlacementAdmission,
  normalizePlacementAdmissionPolicyOptions,
  PLACEMENT_ADMISSION_POLICY_SCHEMA,
  PLACEMENT_ADMISSION_RESULT_SCHEMA
} from './computeManager/PlacementAdmissionPolicy.js';

export {
  RemoteResultQuorumValidator,
  createRemoteResultQuorumValidator,
  evaluateRemoteResultQuorum,
  normalizeRemoteResultQuorumOptions,
  REMOTE_RESULT_QUORUM_POLICY_SCHEMA,
  REMOTE_RESULT_QUORUM_REPORT_SCHEMA
} from './computeManager/RemoteResultQuorumValidator.js';

export * as serviceOrchestration from './serviceOrchestration/index.js';
export * from './serviceOrchestration/index.js';
export * from './capabilities/index.js';

export {
  getBuiltinTaskModule,
  getDefaultWorkerBootstrapURL,
  getDefaultWorkerFactory,
  getModelInferenceFactory,
  getPeerInferenceServiceFactory,
  listBuiltinTaskModules,
  registerBuiltinTaskModule,
  registerDefaultWorkerBootstrapURL,
  registerDefaultWorkerFactory,
  registerModelInferenceFactory,
  registerPeerInferenceServiceFactory
} from './runtime/extensionRegistry.js';

export async function createNode(config = {}) {
  const node = new NodeKernel(config);
  await node.initialize();
  return node;
}

export const VERSION = '0.0.1';
