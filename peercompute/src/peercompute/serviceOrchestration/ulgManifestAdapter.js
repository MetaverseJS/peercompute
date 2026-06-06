import { COMPUTE_SERVICE_MANIFEST_SCHEMA } from './ComputeServiceRegistry.js';

export const ULG_MANIFEST_ADAPTER_SCHEMA = 'peercompute.ulg.manifest-adapter.v0';
export const ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA = 'peercompute.ulg.service-contract.v0.5';
export const ULG_TASK_CAPSULE_ADAPTER_SCHEMA = 'peercompute.ulg.task-capsule-adapter.v0';
export const ULG_ARTIFACT_RESULT_SCHEMA = 'peercompute.ulg.artifact-result.v0';

const DEFAULT_PROTOCOL_VERSION = '0.5';
const TASK_ARTIFACT_KIND = Object.freeze({
  'eshkol.closure.derive': 'closure',
  'moonlab.quantum.response': 'quantum-response'
});

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeId(value, label) {
  const id = String(value || '').trim();
  if (!id) throw new Error(`${label} is required`);
  return id;
}

function normalizeStringList(value, label) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value.map((entry) => String(entry || '').trim()).filter(Boolean);
}

function inferArtifactKind(output = {}, taskKind) {
  return String(output.artifactKind || TASK_ARTIFACT_KIND[taskKind] || 'artifact').trim();
}

function normalizeChildWorkers(childWorkers = {}) {
  return {
    ...clonePlain(childWorkers),
    allowed: childWorkers.allowed === true,
    maxChildren: Number.isInteger(childWorkers.maxChildren) ? Math.max(0, childWorkers.maxChildren) : 0,
    allowedModules: normalizeStringList(childWorkers.allowedModules || [], 'childWorkers.allowedModules'),
    sameOriginOnly: childWorkers.sameOriginOnly !== false
  };
}

function normalizeProtocolVersion(manifest = {}) {
  return String(
    manifest.protocolVersion
      || manifest.abi?.ulgIrVersion
      || manifest.abi?.gpuAbiVersion
      || DEFAULT_PROTOCOL_VERSION
  ).trim();
}

export function normalizeUlgArtifactOutputs(outputs = [], taskKind = '') {
  const source = Array.isArray(outputs) && outputs.length > 0
    ? outputs
    : [{ artifactKind: TASK_ARTIFACT_KIND[taskKind] || 'artifact' }];
  return source.map((output, index) => {
    const artifactKind = inferArtifactKind(output, taskKind);
    return {
      ...clonePlain(output),
      outputIndex: index,
      artifactKind,
      artifactSchema: output.artifactSchema || null,
      contentHash: output.contentHash || output.hash || null
    };
  });
}

export function normalizeUlgServiceManifest(manifest = {}, options = {}) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('ULG service manifest is required');
  }
  const serviceId = normalizeId(manifest.serviceId, 'serviceId');
  const entry = clonePlain(manifest.entry || {});
  if (!entry.workerModule) {
    throw new Error(`ULG service ${serviceId} requires entry.workerModule`);
  }
  const capabilities = normalizeStringList(manifest.capabilities, 'capabilities');
  const taskKinds = normalizeStringList(manifest.taskKinds, 'taskKinds');
  if (capabilities.length === 0) {
    throw new Error(`ULG service ${serviceId} requires at least one capability`);
  }
  if (taskKinds.length === 0) {
    throw new Error(`ULG service ${serviceId} requires at least one task kind`);
  }

  const protocolVersion = normalizeProtocolVersion(manifest);
  const outputArtifactKinds = [...new Set(taskKinds.map((taskKind) => TASK_ARTIFACT_KIND[taskKind] || 'artifact'))];
  const serviceAssets = clonePlain(entry.serviceAssets || null);
  const validation = clonePlain(manifest.validation || {});
  const contract = clonePlain(options.contract || {
    schema: ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA,
    protocolVersion,
    serviceId,
    capabilities,
    taskKinds,
    outputArtifactKinds,
    toleranceProfile: validation.toleranceProfile || null,
    serviceAssets: serviceAssets ? {
      serviceId: serviceAssets.serviceId || serviceId,
      baseUrl: serviceAssets.baseUrl || null,
      required: normalizeStringList(serviceAssets.required || [], 'entry.serviceAssets.required')
    } : null
  });

  return {
    schema: options.schema || COMPUTE_SERVICE_MANIFEST_SCHEMA,
    serviceId,
    version: manifest.version || `${protocolVersion}.0-ulg`,
    runtime: String(manifest.runtime || 'js').trim().toLowerCase(),
    entry,
    childWorkers: normalizeChildWorkers(manifest.childWorkers || {}),
    resources: clonePlain(manifest.resources || {}),
    capabilities,
    taskKinds,
    abi: clonePlain(manifest.abi || {}),
    contract,
    validation,
    metadata: {
      ...clonePlain(manifest.metadata || {}),
      adapter: ULG_MANIFEST_ADAPTER_SCHEMA,
      sourceSchema: 'compute_service_manifest',
      protocolVersion,
      originalServiceId: serviceId,
      serviceAssets,
      outputArtifactKinds
    }
  };
}

export const adaptUlgV05ComputeServiceManifest = normalizeUlgServiceManifest;

export function normalizeUlgTaskCapsule(capsule = {}, options = {}) {
  if (!capsule || typeof capsule !== 'object') {
    throw new Error('ULG task capsule is required');
  }
  const serviceId = normalizeId(capsule.serviceId, 'serviceId');
  const taskKind = normalizeId(capsule.taskKind, 'taskKind');
  const taskId = normalizeId(capsule.taskId, 'taskId');
  const rootTaskId = String(capsule.rootTaskId || taskId).trim();
  const outputs = normalizeUlgArtifactOutputs(capsule.outputs || [], taskKind);
  const task = {
    schema: ULG_TASK_CAPSULE_ADAPTER_SCHEMA,
    serviceId,
    taskKind,
    taskId,
    rootTaskId,
    capsule: clonePlain(capsule),
    inputs: clonePlain(capsule.inputs || []),
    outputs,
    artifactPlan: outputs.map((output) => ({
      outputIndex: output.outputIndex,
      artifactKind: output.artifactKind,
      artifactSchema: output.artifactSchema,
      contentHash: output.contentHash
    })),
    resources: clonePlain(capsule.resources || {}),
    validation: clonePlain(capsule.validation || {}),
    provenance: clonePlain(capsule.provenance || null)
  };
  const workerType = options.workerType || capsule.workerType;
  if (workerType) {
    task.workerType = String(workerType).trim().toLowerCase();
  }
  return task;
}

export const adaptUlgV05TaskCapsule = normalizeUlgTaskCapsule;

export function createUlgArtifactResult(task = {}, artifact = {}, options = {}) {
  const capsule = task.capsule || task;
  const serviceId = normalizeId(task.serviceId || capsule.serviceId, 'serviceId');
  const taskKind = normalizeId(task.taskKind || capsule.taskKind, 'taskKind');
  const taskId = normalizeId(task.taskId || capsule.taskId, 'taskId');
  const outputs = normalizeUlgArtifactOutputs(task.outputs || capsule.outputs || [], taskKind);
  const output = outputs.find((item) => item.artifactKind === options.artifactKind)
    || outputs[options.outputIndex || 0]
    || { outputIndex: 0, artifactKind: TASK_ARTIFACT_KIND[taskKind] || 'artifact', artifactSchema: null };
  const artifactKind = String(options.artifactKind || artifact.artifactKind || output.artifactKind).trim();
  const contentHash = String(
    options.contentHash
      || artifact.contentHash
      || artifact.hash
      || output.contentHash
      || ''
  ).trim();
  if (!contentHash) {
    throw new Error(`ULG ${artifactKind} artifact requires a contentHash`);
  }
  const artifactBody = clonePlain(artifact);

  return {
    schema: ULG_ARTIFACT_RESULT_SCHEMA,
    serviceId,
    taskKind,
    taskId,
    rootTaskId: task.rootTaskId || capsule.rootTaskId || taskId,
    status: options.status || 'complete',
    outputs: [{
      ...clonePlain(output),
      artifactKind,
      contentHash,
      artifactRefHint: `ulg:${artifactKind}:${contentHash}`
    }],
    artifact: {
      ...artifactBody,
      schema: artifactBody.schema || output.artifactSchema || `${artifactKind}.artifact.v0.5`,
      artifactKind,
      contentHash,
      sourceService: artifactBody.sourceService || serviceId,
      serviceId,
      taskKind,
      taskId,
      provenance: clonePlain(artifactBody.provenance || task.provenance || capsule.provenance || null)
    }
  };
}

export const createUlgV05ArtifactResult = createUlgArtifactResult;
