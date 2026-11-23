/**
 * @fileoverview PeerCompute Inference - Optional model & peer inference entrypoint
 *
 * Importing this entrypoint automatically registers the optional inference
 * factories (`ComputeManager.createModelInferenceService`,
 * `NetworkManager.createPeerInferenceService`, built-in `peercompute:*-inference`
 * task loaders, and the inference-enabled compute worker) without forcing
 * `peercompute/core` consumers to bundle ONNX/Transformers/Wllama assets.
 */

import './inference/registerInference.js';

export { registerInferenceRuntime } from './inference/registerInference.js';
export { registerInferenceTaskModules } from './inference/registerTaskModules.js';
export { ModelInferenceService } from './inference/ModelInferenceService.js';
export { PeerInferenceService } from './networkManager/inference/PeerInferenceService.js';
export {
  MODEL_COMPOSITION_SCHEMA,
  MODEL_COMPOSITION_LIMITS,
  modelManifestCid,
  createModelComposition,
  splitModelComposition
} from './inference/modelComposition.js';
export {
  GENERATED_MESH_LIMITS,
  encodeGeneratedMesh,
  normalizeGeneratedMeshDescriptor,
  validateGeneratedMesh,
  retainGeneratedMesh,
  readGeneratedMesh
} from './inference/GeneratedMeshArtifact.js';
export { ArtifactStore, ARTIFACT_IMPORT_PROFILE, ARTIFACT_MANIFEST_SCHEMA } from './artifacts/ArtifactStore.js';
export { MODEL_ARTIFACT_CATALOG, modelArtifactFileUrl } from './artifacts/modelArtifactCatalog.js';
export { GGUF_MODEL_CATALOG, ggufModelFileUrl } from './artifacts/ggufModelCatalog.js';
export { MESH_MODEL_CATALOG, meshModelFileUrl } from './artifacts/meshModelCatalog.js';
export { SF3D_MODEL_CATALOG } from './artifacts/sf3dModelCatalog.js';
export { AgentRecordStore } from './agents/AgentRecordStore.js';
export { AgentRuntime } from './agents/AgentRuntime.js';
export {
  RESIDENT_AVATAR_SCHEMA,
  normalizeResidentAvatar,
  normalizeResidentAvatarProvenance,
  residentAvatarFromManifest,
  sameResidentAvatar
} from './agents/ResidentAvatar.js';
export { WorldKnowledgeStore } from './agents/WorldKnowledgeStore.js';
export { ResidentDiagnosticsStore } from './agents/ResidentDiagnosticsStore.js';
export { RESIDENT_DIAGNOSTICS_LIMITS } from './agents/ResidentDiagnosticsContracts.js';
export {
  normalizeWorldKnowledgeRecord,
  worldKnowledgeStatus,
  WORLD_KNOWLEDGE_LIMITS
} from './agents/WorldKnowledgeContracts.js';
export * from './modelEvidence/index.js';
