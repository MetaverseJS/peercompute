/**
 * @fileoverview PeerCompute - P2P Distributed Compute Network Library
 * Main entry point for the PeerCompute library
 * 
 * @module PeerCompute
 * @version 0.0.1
 * @description A browser-based P2P compute network leveraging WebGPU and libp2p
 * for distributed computing, multiplayer gaming, and metaverse applications.
 */

// Core components
import {
  NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
  NodeKernel,
  REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_COMPUTE_REQUEST_SCHEMA,
  REMOTE_COMPUTE_RESULT_SCHEMA
} from './nodeKernel/NodeKernel.js';
export {
  NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
  NodeKernel,
  REMOTE_COMPUTE_PLACEMENT_PROVENANCE_SCHEMA,
  REMOTE_COMPUTE_REQUEST_SCHEMA,
  REMOTE_COMPUTE_RESULT_SCHEMA
};
export { StateManager } from './stateManager/StateManager.js';
export { DataState } from './stateManager/DataState.js';
export { NetworkManager } from './networkManager/NetworkManager.js';
export {
  ComputeManager,
  COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
  COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA,
  COMPUTE_TASK_PACKET_SCHEMA,
  COMPUTE_TASK_PLACEMENT_SCHEMA,
  COMPUTE_WORKER_UTILIZATION_SCHEMA
} from './computeManager/ComputeManager.js';
export {
  SolverRegistry,
  normalizeSolverDescriptor,
  SOLVER_DESCRIPTOR_SCHEMA,
  SOLVER_TASK_SCHEMA
} from './computeManager/SolverRegistry.js';
export {
  createPlacementAdmissionPolicy,
  evaluatePlacementAdmission,
  normalizePlacementAdmissionPolicyOptions,
  PLACEMENT_ADMISSION_POLICY_SCHEMA,
  PLACEMENT_ADMISSION_RESULT_SCHEMA
} from './computeManager/PlacementAdmissionPolicy.js';
export {
  createRemoteResultQuorumValidator,
  evaluateRemoteResultQuorum,
  normalizeRemoteResultQuorumOptions,
  REMOTE_RESULT_QUORUM_POLICY_SCHEMA,
  REMOTE_RESULT_QUORUM_REPORT_SCHEMA
} from './computeManager/RemoteResultQuorumValidator.js';
export {
  CHILD_WORKER_LEASE_SCHEMA,
  COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA,
  COMPUTE_SERVICE_MANIFEST_SCHEMA,
  COMPUTE_SERVICE_REGISTRY_SCHEMA,
  ComputeManagerServiceAdapter,
  ComputeServiceRegistry,
  ChildWorkerLeaseManager,
  ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
  ULG_ARTIFACT_RESULT_SCHEMA,
  ULG_ARTIFACT_SUMMARY_SCHEMA,
  ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
  ULG_DEMO_HANDOFF_SCHEMA,
  ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA,
  ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA,
  ULG_MANIFEST_ADAPTER_SCHEMA,
  ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA,
  ULG_QUANTUM_RESPONSE_PARITY_SCHEMA,
  ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA,
  ULG_TASK_CAPSULE_ADAPTER_SCHEMA,
  WORKER_SUPERVISOR_TELEMETRY_SCHEMA,
  WorkerSupervisor,
  adaptUlgV05ComputeServiceManifest,
  adaptUlgV05TaskCapsule,
  createComputeManagerServiceFactory,
  createUlgArtifactResult,
  createUlgV05ArtifactResult,
  normalizeComputeServiceManifest,
  normalizeUlgDemoHandoff,
  normalizeUlgDemoHandoffArtifact,
  normalizeUlgArtifactOutputs,
  normalizeUlgServiceManifest,
  normalizeUlgTaskCapsule,
  summarizeUlgArtifact
} from './serviceOrchestration/index.js';
export { GPUHubManager } from './gpu/GPUHubManager.js';

// Subsystems
export { PhysicsEngine } from './physics/PhysicsEngine.js';
export { InputManager } from './input/InputManager.js';

// Utilities
export * as Utils from './utils/Utils.js';

/**
 * Create a new PeerCompute node
 * Convenience function to initialize a complete node with all managers
 * 
 * @param {Object} config - Node configuration
 * @param {string} config.topology - Network topology: 'hierarchy' | 'distributed' | 'emergent'
 * @param {string} config.topologyId - Topology identifier shared across rooms
 * @param {string} config.topicPrefix - Base prefix for scoped topics
 * @param {boolean} config.useScopedTopics - Enable topology + room topic scoping
 * @param {string} config.storageMode - Data storage mode: 'local' | 'propagate'
 * @param {boolean} config.enableWebGPU - Enable WebGPU compute capabilities
 * @param {boolean} config.enablePhysics - Enable physics engine
 * @param {boolean} config.enableInput - Enable input manager
 * @param {Array<string>} config.bootstrapPeers - Bootstrap peer addresses
 * @param {Object} config.clockPolicy - Clock policy for orchestration
 * @param {string} config.clockPolicy.mode - 'independent' | 'kernel'
 * @param {number} config.clockPolicy.tickHz - Kernel tick rate when mode is 'kernel'
 * @param {Object|null} config.clockPolicy.networkProfile - Network scheduler profile overrides
 * @returns {Promise<NodeKernel>} Initialized node
 * 
 * @example
 * ```javascript
 * import { createNode } from './peercompute/index.js';
 * 
 * const node = await createNode({
 *   topology: 'distributed',
 *   enableWebGPU: true,
 *   enablePhysics: true
 * });
 * 
 * await node.start();
 * 
 * // Submit a compute task
 * const result = await node.submitTask({
 *   type: 'webgpu',
 *   shader: '...',
 *   data: {...}
 * });
 * ```
 */
export async function createNode(config = {}) {
  // TODO: Create and initialize node with all requested components
  // TODO: Wire up managers based on config
  // TODO: Return initialized node
  
  const node = new NodeKernel(config);
  await node.initialize();
  
  return node;
}

/**
 * Library version
 */
export const VERSION = '0.0.1';

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  topology: 'distributed',
  topologyId: 'default-topology',
  topicPrefix: 'pc',
  useScopedTopics: true,
  storageMode: 'local',
  enableWebGPU: false,
  enablePhysics: false,
  enableInput: false,
  bootstrapPeers: [],
  clockPolicy: {
    mode: 'independent',
    tickHz: 30,
    networkProfile: null
  }
};
