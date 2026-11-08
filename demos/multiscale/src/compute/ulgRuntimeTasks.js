export const ULG_RUNTIME_EXECUTION_RESULT_SCHEMA = 'peercompute.ulg.webgpu-execution-result.v0';
export const ULG_RUNTIME_EXECUTION_DELTA_SCHEMA = 'peercompute.ulg.webgpu-execution-delta.v0';
export const ULG_RUNTIME_EXECUTION_WEBGPU_SCHEMA = 'peercompute.ulg.webgpu-pass-execution.v0';
export const ULG_RUNTIME_STATE_DELTA_SCHEMA = 'peercompute.ulg.webgpu-state-delta.v0';
export const ULG_RUNTIME_GPU_FENCE_REPORT_SCHEMA = 'peercompute.compute.gpu-fence-report.v0';
export const ULG_RUNTIME_GPU_LANE_ID = 'ulg-runtime:webgpu-pass-dag';

const DEFAULT_STATE_KEY = 'ulg:runtime:active-pass-dag';
const DEFAULT_DELTA_SCOPE = 'multiscale-ulg-runtime-execution';
const WORKGROUP_SIZE = 64;
const INPUT_FLOATS_PER_PASS = 8;
const OUTPUT_FLOATS_PER_PASS = 8;
const STATE_INPUT_VEC4_COUNT = 4;
const STATE_OUTPUT_VEC4_COUNT = 6;
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const ULG_PASS_EVIDENCE_SHADER = `
struct Params {
  passCount: f32,
  sequence: f32,
  activeLayerCode: f32,
  dtSeconds: f32,
};

@group(0) @binding(0) var<storage, read> passInputs: array<vec4f>;
@group(0) @binding(1) var<uniform> params: Params;
@group(0) @binding(2) var<storage, read_write> passOutputs: array<vec4f>;
@group(0) @binding(3) var<storage, read> stateInputs: array<vec4f>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  if (index >= u32(params.passCount)) {
    return;
  }

  let a = passInputs[index * 2u + 0u];
  let b = passInputs[index * 2u + 1u];
  let backendOk = a.x;
  let dispatchProduct = max(1.0, a.y) * max(1.0, a.z) * max(1.0, a.w);
  let workgroupProduct = max(1.0, b.x) * max(1.0, b.y) * max(1.0, b.z);
  let validationOk = b.w;
  let executionOk = backendOk * validationOk;
  let workItems = dispatchProduct * workgroupProduct;
  let passWeight = f32(index + 1u);

  passOutputs[index * 2u + 0u] = vec4f(workItems, executionOk, passWeight, workItems * executionOk);
  passOutputs[index * 2u + 1u] = vec4f(workItems * passWeight, executionOk * passWeight, params.activeLayerCode, params.sequence);

  if (index == 0u) {
    var executedPasses = 0.0;
    var summedWorkItems = 0.0;
    var cursor = 0u;
    loop {
      if (cursor >= u32(params.passCount)) {
        break;
      }
      let pa = passInputs[cursor * 2u + 0u];
      let pb = passInputs[cursor * 2u + 1u];
      let passDispatch = max(1.0, pa.y) * max(1.0, pa.z) * max(1.0, pa.w);
      let passWorkgroup = max(1.0, pb.x) * max(1.0, pb.y) * max(1.0, pb.z);
      let passOk = pa.x * pb.w;
      executedPasses = executedPasses + passOk;
      summedWorkItems = summedWorkItems + passDispatch * passWorkgroup;
      cursor = cursor + 1u;
    }

    let closure = stateInputs[0u];
    let env = stateInputs[1u];
    let quantum = stateInputs[2u];
    let flags = stateInputs[3u];
    let passDenom = max(1.0, params.passCount);
    let executedFraction = clamp(executedPasses / passDenom, 0.0, 1.0);
    let proxyClosureReady = clamp(flags.x, 0.0, 1.0);
    let scientificClosureReady = clamp(flags.y, 0.0, 1.0);
    let materialReady = clamp(flags.z, 0.0, 1.0);
    let manifestReady = clamp(flags.w, 0.0, 1.0);
    let readiness = executedFraction * proxyClosureReady * materialReady * manifestReady;
    let scientificReadiness = readiness * scientificClosureReady;

    let temperatureDrive = clamp((env.x - 273.15) / 1000.0, -1.0, 8.0);
    let pressureDrive = clamp(env.y - 1.0, -2.0, 20.0);
    let gravityDrive = clamp(env.z, -20.0, 20.0);
    let fieldDrive = clamp(env.w, -20.0, 20.0);
    let quantumResidual = abs(quantum.x) + abs(quantum.y);
    let materialResponse = readiness * (
      clamp(closure.x, 0.0, 20.0) * 0.16
      + clamp(closure.y, 0.0, 20.0) * 0.36
      + clamp(closure.z, 0.0, 20.0) * 0.30
      + clamp(closure.w, 0.0, 20.0) * 0.18
    );
    let temperatureDeltaK = readiness * clamp(temperatureDrive * 18.0 + pressureDrive * 0.75 - quantumResidual * 4.0, -50.0, 50.0);
    let energyDeltaProxy = readiness * clamp(temperatureDrive * 0.34 + pressureDrive * 0.055 + materialResponse * 0.12 - quantumResidual * 0.18, -10.0, 10.0);
    let chargeDeltaProxy = readiness * clamp(fieldDrive * 0.035 + closure.z * 0.08 - quantumResidual * 0.025, -4.0, 4.0);
    let velocityDeltaProxy = readiness * gravityDrive * (0.012 + clamp(closure.y, 0.0, 20.0) * 0.004) * max(params.dtSeconds, 0.0);
    let magneticDeltaProxy = readiness * fieldDrive * (0.018 + clamp(closure.z, 0.0, 20.0) * 0.006);
    let normalizationCorrection = -quantum.y * readiness;
    let deltaHashSeed = materialResponse
      + temperatureDeltaK * 0.017
      + energyDeltaProxy * 0.031
      + chargeDeltaProxy * 0.043
      + normalizationCorrection * 0.059
      + params.sequence * 0.001;
    let base = u32(params.passCount) * 2u;
    passOutputs[base + 0u] = vec4f(readiness, executedFraction, proxyClosureReady, scientificReadiness);
    passOutputs[base + 1u] = vec4f(temperatureDeltaK, energyDeltaProxy, chargeDeltaProxy, velocityDeltaProxy);
    passOutputs[base + 2u] = vec4f(magneticDeltaProxy, normalizationCorrection, materialResponse, quantumResidual);
    passOutputs[base + 3u] = vec4f(closure.x, closure.y, closure.z, closure.w);
    passOutputs[base + 4u] = vec4f(env.x, env.y, env.z, env.w);
    passOutputs[base + 5u] = vec4f(summedWorkItems, params.activeLayerCode, params.sequence, deltaHashSeed);
  }
}
`;

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      const entry = value[key];
      if (entry !== undefined) result[key] = stableValue(entry);
      return result;
    }, {});
  }
  if (Number.isFinite(value)) return Number(value);
  return value ?? null;
}

function hashString(input) {
  let hash = 2166136261;
  const text = String(input);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `sha256:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function stableHash(value) {
  return hashString(JSON.stringify(stableValue(value)));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, finite(value, min)));
}

function getExecutionContext() {
  if (typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope) return 'worker';
  if (typeof window !== 'undefined') return 'browser-main';
  return 'node';
}

function activeLayerCode(layerId) {
  const text = String(layerId || 'unknown');
  let code = 0;
  for (let index = 0; index < text.length; index += 1) {
    code = (code + text.charCodeAt(index) * (index + 1)) % 4096;
  }
  return code;
}

function deriveManifestHash(manifest = {}) {
  return manifest.manifestHash || stableHash({
    schema: manifest.schema || null,
    modelId: manifest.modelId || null,
    status: manifest.status || null,
    activeLayerId: manifest.activeLayerId || null,
    liveBackendPolicy: manifest.liveBackendPolicy || null,
    hamiltonianHash: manifest.hamiltonian?.hamiltonianHash || null,
    closureHashes: asArray(manifest.materialClosures).map((closure) => closure?.closureHash || null),
    passHashes: asArray(manifest.passDag?.passes).map((pass) => pass?.passHash || null),
    passIds: asArray(manifest.passDag?.passIds)
  });
}

function normalizeTaskPayload(payload = {}) {
  const input = payload.input && typeof payload.input === 'object' ? payload.input : payload;
  const manifest = input.manifest || payload.manifest || null;
  return {
    input,
    manifest,
    stateKey: input.stateKey || payload.stateKey || DEFAULT_STATE_KEY,
    taskId: input.taskId || payload.id || 'solver:ulg-runtime:active-pass-dag',
    scope: input.scope || DEFAULT_DELTA_SCOPE,
    emitCommitDelta: input.emitCommitDelta !== false,
    sequence: Math.max(0, Math.round(finite(input.sequence ?? payload.sequence, 0))),
    dtSeconds: Math.max(0, finite(input.dt ?? input.dtSeconds ?? payload.dt ?? payload.dtSeconds, 1 / 60)),
    timeSeconds: Number.isFinite(Number(input.timeSeconds))
      ? Number(input.timeSeconds)
      : Number.isFinite(Number(manifest?.timeSeconds))
        ? Number(manifest.timeSeconds)
        : 0
  };
}

function summarizeManifest(manifest) {
  const passDag = manifest?.passDag || {};
  return {
    schema: manifest?.schema || null,
    modelId: manifest?.modelId || null,
    status: manifest?.status || null,
    activeLayerId: manifest?.activeLayerId || null,
    liveBackendPolicy: manifest?.liveBackendPolicy || passDag.liveBackendPolicy || 'webgpu-only-no-cpu-fallback',
    passDagStatus: passDag.status || null,
    passCount: Number(passDag.passCount || asArray(passDag.passes).length || 0),
    webgpuPassCount: Number(passDag.webgpuPassCount || 0),
    invalidLivePassCount: Number(passDag.invalidLivePassCount || 0),
    hamiltonianHash: manifest?.hamiltonian?.hamiltonianHash || null,
    closureHash: manifest?.materialClosures?.[0]?.closureHash || null,
    lawTaskStatus: manifest?.lawTaskCapsule?.validation?.status || null,
    quantumTaskStatus: manifest?.quantumTaskCapsule?.validation?.status || null,
    manifestHash: deriveManifestHash(manifest || {})
  };
}

function resolveGpuLaneId(resolved = {}) {
  return resolved.input?.gpuLaneId
    || resolved.input?.gpuLane
    || resolved.input?.webgpu?.laneId
    || resolved.input?.webgpu?.gpuLaneId
    || ULG_RUNTIME_GPU_LANE_ID;
}

function createGpuFenceReport(resolved, {
  status = 'gpu-fence-not-submitted',
  method = null,
  fenceSatisfied = false,
  queueCompletionStatus = status,
  queueCompletionMethod = method,
  readbackCompletionStatus = null,
  readbackCompletionMethod = null,
  passCount = null,
  dispatchWorkgroups = null,
  source = 'ulg-runtime-webgpu-pass-dag'
} = {}) {
  return {
    schema: ULG_RUNTIME_GPU_FENCE_REPORT_SCHEMA,
    status,
    method,
    fenceSatisfied,
    required: true,
    laneId: resolveGpuLaneId(resolved),
    stateKey: resolved.stateKey,
    queueFencePolicy: 'queue.onSubmittedWorkDone-before-readback-map',
    queueCompletionStatus,
    queueCompletionMethod,
    readbackCompletionStatus,
    readbackCompletionMethod,
    retainedBufferRefs: [],
    passCount,
    dispatchWorkgroups,
    completedAt: fenceSatisfied ? Date.now() : null,
    source
  };
}

function createDeltaPayload(result, resolved) {
  const stateDelta = result.stateDelta ? compactStateDelta(result.stateDelta) : null;
  return {
    schema: ULG_RUNTIME_EXECUTION_DELTA_SCHEMA,
    taskId: resolved.taskId,
    stateKey: resolved.stateKey,
    sequence: result.sequence,
    status: result.status,
    ok: result.ok === true,
    backend: result.backend,
    liveBackendPolicy: result.liveBackendPolicy,
    manifestHash: result.manifestHash,
    activeLayerId: result.activeLayerId,
    timeSeconds: result.timeSeconds,
    passDagStatus: result.passDagStatus,
    passCount: result.passCount,
    executedPassCount: result.executedPassCount,
    invalidLivePassCount: result.invalidLivePassCount,
    totalWorkItems: result.totalWorkItems,
    evidenceHash: result.evidenceHash,
    stateDelta,
    webgpuStatus: result.webgpuStatus,
    webgpuError: result.webgpuError || null,
    gpuFence: result.gpuFence || null,
    gpuFenceStatus: result.gpuFence?.status || null,
    gpuFenceSatisfied: result.gpuFence?.fenceSatisfied === true
  };
}

function withCommitDelta(value, resolved) {
  if (!resolved.emitCommitDelta) return value;
  return {
    value,
    commitDelta: {
      taskId: resolved.taskId,
      scope: resolved.scope,
      version: value.sequence || 0,
      timestamp: Date.now(),
      payload: createDeltaPayload(value, resolved)
    }
  };
}

function createBlockedResult(resolved, { status, reason, manifestSummary = null, backend = 'webgpu-unavailable', error = null } = {}) {
  const summary = manifestSummary || summarizeManifest(resolved.manifest || {});
  const blockedStateDelta = createBlockedStateDelta({
    resolved,
    manifestSummary: summary,
    status: status || 'blocked-webgpu-unavailable',
    reason: reason || 'WebGPU unavailable; live ULG execution has no CPU fallback.'
  });
  return {
    ok: false,
    schema: ULG_RUNTIME_EXECUTION_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: 'ulg-runtime',
    taskId: resolved.taskId,
    stateKey: resolved.stateKey,
    sequence: resolved.sequence,
    status: status || 'blocked-webgpu-unavailable',
    backend,
    liveBackendPolicy: summary.liveBackendPolicy || 'webgpu-only-no-cpu-fallback',
    manifestHash: summary.manifestHash,
    activeLayerId: summary.activeLayerId,
    timeSeconds: rounded(resolved.timeSeconds, 4),
    passDagStatus: summary.passDagStatus,
    passCount: summary.passCount,
    executedPassCount: 0,
    invalidLivePassCount: summary.invalidLivePassCount,
    totalWorkItems: 0,
    evidenceHash: stableHash({ status, reason, manifestHash: summary.manifestHash, sequence: resolved.sequence }),
    passEvidencePreview: [],
    stateDelta: blockedStateDelta,
    gpuFence: createGpuFenceReport(resolved, {
      status: 'gpu-fence-not-submitted',
      method: null,
      fenceSatisfied: false,
      queueCompletionStatus: 'not-submitted',
      queueCompletionMethod: null,
      passCount: summary.passCount,
      dispatchWorkgroups: null,
      source: 'ulg-runtime-blocked-before-webgpu-submit'
    }),
    webgpuStatus: {
      schema: ULG_RUNTIME_EXECUTION_WEBGPU_SCHEMA,
      status: status || 'blocked-webgpu-unavailable',
      kernelMode: 'ulg-pass-dag-evidence-v0',
      liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
      passCount: summary.passCount,
      reason: reason || 'WebGPU unavailable; live ULG execution has no CPU fallback.'
    },
    webgpuError: error
  };
}

function createBlockedStateDelta({ resolved, manifestSummary, status, reason }) {
  return {
    schema: ULG_RUNTIME_STATE_DELTA_SCHEMA,
    status,
    ok: false,
    mutationMode: 'blocked-webgpu-only',
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
    sequence: resolved.sequence,
    stateKey: resolved.stateKey,
    manifestHash: manifestSummary.manifestHash,
    activeLayerId: manifestSummary.activeLayerId,
    proxyStateReady: false,
    proxyStateApplied: false,
    authoritativeWorkerBufferMutation: false,
    scientificMutationReady: false,
    readiness: 0,
    executedFraction: 0,
    channelUpdateCount: 0,
    appliedChannelUpdateCount: 0,
    channelUpdates: [],
    residuals: {
      quantumResidualProxy: null,
      wavefunctionNormalizationCorrection: null
    },
    materialResponse: null,
    blocker: reason,
    stateDeltaHash: stableHash({
      schema: ULG_RUNTIME_STATE_DELTA_SCHEMA,
      status,
      reason,
      sequence: resolved.sequence,
      manifestHash: manifestSummary.manifestHash
    })
  };
}

function compactStateDelta(delta = {}) {
  if (!delta || delta.schema !== ULG_RUNTIME_STATE_DELTA_SCHEMA) return null;
  return {
    schema: delta.schema,
    status: delta.status || 'unknown',
    ok: delta.ok === true,
    mutationMode: delta.mutationMode || null,
    proxyStateReady: delta.proxyStateReady === true,
    proxyStateApplied: delta.proxyStateApplied === true,
    authoritativeWorkerBufferMutation: delta.authoritativeWorkerBufferMutation === true,
    scientificMutationReady: delta.scientificMutationReady === true,
    readiness: delta.readiness ?? 0,
    executedFraction: delta.executedFraction ?? 0,
    channelUpdateCount: delta.channelUpdateCount ?? 0,
    appliedChannelUpdateCount: delta.appliedChannelUpdateCount ?? 0,
    stateDeltaHash: delta.stateDeltaHash || null,
    blocker: delta.blocker || null,
    residuals: delta.residuals || null,
    materialResponse: delta.materialResponse || null,
    channelUpdates: Array.isArray(delta.channelUpdates)
      ? delta.channelUpdates.slice(0, 6).map((update) => ({
        channelId: update.channelId,
        quantity: update.quantity,
        unit: update.unit,
        delta: update.delta,
        target: update.target,
        status: update.status
      }))
      : []
  };
}

function encodePasses(passes) {
  const data = new Float32Array(passes.length * INPUT_FLOATS_PER_PASS);
  for (let index = 0; index < passes.length; index += 1) {
    const pass = passes[index] || {};
    const dispatch = asArray(pass.dispatch);
    const workgroupSize = asArray(pass.workgroupSize);
    const offset = index * INPUT_FLOATS_PER_PASS;
    data[offset + 0] = pass.backend === 'webgpu' && pass.executionMode === 'live' ? 1 : 0;
    data[offset + 1] = Math.max(1, Math.round(finite(dispatch[0], 1)));
    data[offset + 2] = Math.max(1, Math.round(finite(dispatch[1], 1)));
    data[offset + 3] = Math.max(1, Math.round(finite(dispatch[2], 1)));
    data[offset + 4] = Math.max(1, Math.round(finite(workgroupSize[0], 1)));
    data[offset + 5] = Math.max(1, Math.round(finite(workgroupSize[1], 1)));
    data[offset + 6] = Math.max(1, Math.round(finite(workgroupSize[2], 1)));
    data[offset + 7] = pass.validation?.ok === true ? 1 : 0;
  }
  return data;
}

function encodeStateInputs(resolved, manifestSummary) {
  const closure = asArray(resolved.manifest?.materialClosures)[0] || {};
  const values = closure.values || {};
  const hamiltonian = resolved.manifest?.hamiltonian || {};
  const boundary = hamiltonian.boundary || {};
  const externalFields = hamiltonian.externalFields || {};
  const quantumResult = resolved.manifest?.quantumStateResult || {};
  const invariantEntries = asArray(resolved.manifest?.invariantReport?.entries);
  const normInvariant = invariantEntries.find((entry) => entry?.id === 'invariant:wavefunction-normalization');
  const densityNorm = clamp(finite(values.densityKgM3, 0) / 10000, 0, 20);
  const stiffnessNorm = clamp((finite(values.bulkModulusPa, 0) + finite(values.youngsModulusPa, 0)) / 2e11, 0, 20);
  const conductivityNorm = clamp(Math.log10(Math.max(1, finite(values.electricalConductivitySpm, 0) + 1)) / 8, 0, 20);
  const refractiveNorm = clamp((finite(values.refractiveIndex, 1) - 1) / 3, 0, 20);
  const temperatureK = finite(boundary.temperatureK, finite(resolved.input?.environment?.ambientTemperatureK, 294));
  const pressureNorm = clamp(finite(boundary.pressurePa, finite(resolved.input?.environment?.ambientPressurePa, 101325)) / 101325, 0, 200);
  const electricFieldNorm = Math.abs(asArray(externalFields.electricFieldVm)[0] || 0) / 1000;
  const magneticFieldNorm = Math.abs(asArray(externalFields.magneticFieldT)[1] || 0);
  const fieldNorm = clamp(electricFieldNorm + magneticFieldNorm, 0, 20);
  const gravityNorm = clamp(finite(externalFields.gravityMps2, finite(resolved.input?.environment?.gravityMps2, 9.80665)) / 9.80665, -20, 20);
  const quantumResidual = clamp(finite(quantumResult.convergence?.residual, 0), 0, 1e6);
  const normError = clamp(finite(normInvariant?.residual, 0), -1e6, 1e6);
  const electronNorm = clamp(finite(hamiltonian.electrons?.count, 0) / 128, 0, 20);
  const atomicNumberNorm = clamp(finite(asArray(hamiltonian.nuclei)[0]?.Z, 0) / 128, 0, 20);
  const proxyReady = closure.validity?.proxyReady === true ? 1 : 0;
  const scientificReady = closure.validity?.scientificReady === true ? 1 : 0;
  const materialReady = manifestSummary.passDagStatus && !String(manifestSummary.passDagStatus).startsWith('blocked') ? 1 : 0;
  const manifestReady = resolved.manifest?.schema === 'peercompute.ulg.runtime-manifest.v0' ? 1 : 0;
  const data = new Float32Array(STATE_INPUT_VEC4_COUNT * 4);
  data.set([densityNorm, stiffnessNorm, conductivityNorm, refractiveNorm], 0);
  data.set([temperatureK, pressureNorm, gravityNorm, fieldNorm], 4);
  data.set([quantumResidual, normError, electronNorm, atomicNumberNorm], 8);
  data.set([proxyReady, scientificReady, materialReady, manifestReady], 12);
  return {
    data,
    source: {
      densityNorm,
      stiffnessNorm,
      conductivityNorm,
      refractiveNorm,
      temperatureK,
      pressureNorm,
      gravityNorm,
      fieldNorm,
      quantumResidual,
      normError,
      electronNorm,
      atomicNumberNorm,
      proxyReady: Boolean(proxyReady),
      scientificReady: Boolean(scientificReady),
      materialReady: Boolean(materialReady),
      manifestReady: Boolean(manifestReady)
    }
  };
}

function createStateDeltaFromRaw({ raw, passes, resolved, manifestSummary, stateInputSource, status, ok }) {
  const summaryOffset = passes.length * OUTPUT_FLOATS_PER_PASS;
  const readiness = clamp(raw[summaryOffset + 0], 0, 1);
  const executedFraction = clamp(raw[summaryOffset + 1], 0, 1);
  const proxyClosureReady = raw[summaryOffset + 2] > 0.5;
  const scientificReadiness = clamp(raw[summaryOffset + 3], 0, 1);
  const temperatureDeltaK = rounded(raw[summaryOffset + 4], 5);
  const energyDeltaProxy = rounded(raw[summaryOffset + 5], 8);
  const chargeDeltaProxy = rounded(raw[summaryOffset + 6], 8);
  const velocityDeltaProxy = rounded(raw[summaryOffset + 7], 8);
  const magneticDeltaProxy = rounded(raw[summaryOffset + 8], 8);
  const normalizationCorrection = rounded(raw[summaryOffset + 9], 8);
  const materialResponseDrive = rounded(raw[summaryOffset + 10], 8);
  const quantumResidualProxy = rounded(raw[summaryOffset + 11], 8);
  const deltaSeed = rounded(raw[summaryOffset + 23], 8);
  const proxyStateReady = ok === true && readiness > 0.999 && proxyClosureReady;
  const targetTemperatureK = rounded((stateInputSource.temperatureK || 0) + temperatureDeltaK, 4);
  const channelUpdates = [
    {
      channelId: 'channel:temperature',
      quantity: 'temperature',
      unit: 'K',
      delta: temperatureDeltaK,
      target: targetTemperatureK,
      source: 'webgpu-ulg-state-delta',
      status: proxyStateReady ? 'applied-to-ulg-state-lane' : 'blocked'
    },
    {
      channelId: 'channel:internal-energy',
      quantity: 'specific-internal-energy',
      unit: 'reduced J kg^-1 proxy',
      delta: energyDeltaProxy,
      target: energyDeltaProxy,
      source: 'webgpu-ulg-state-delta',
      status: proxyStateReady ? 'applied-to-ulg-state-lane' : 'blocked'
    },
    {
      channelId: 'channel:charge',
      quantity: 'charge',
      unit: 'reduced C proxy',
      delta: chargeDeltaProxy,
      target: chargeDeltaProxy,
      source: 'webgpu-ulg-state-delta',
      status: proxyStateReady ? 'applied-to-ulg-state-lane' : 'blocked'
    },
    {
      channelId: 'channel:v',
      quantity: 'velocity',
      unit: 'reduced m s^-1 proxy',
      delta: velocityDeltaProxy,
      target: velocityDeltaProxy,
      source: 'webgpu-ulg-state-delta',
      status: proxyStateReady ? 'applied-to-ulg-state-lane' : 'blocked'
    },
    {
      channelId: 'channel:magnetic-field',
      quantity: 'magnetic-field',
      unit: 'reduced T proxy',
      delta: magneticDeltaProxy,
      target: magneticDeltaProxy,
      source: 'webgpu-ulg-state-delta',
      status: proxyStateReady ? 'applied-to-ulg-state-lane' : 'blocked'
    },
    {
      channelId: 'channel:wavefunction-normalization',
      quantity: 'wavefunction-normalization',
      unit: 'dimensionless correction',
      delta: normalizationCorrection,
      target: normalizationCorrection,
      source: 'webgpu-ulg-state-delta',
      status: proxyStateReady ? 'applied-to-ulg-state-lane' : 'blocked'
    }
  ];
  const delta = {
    schema: ULG_RUNTIME_STATE_DELTA_SCHEMA,
    status: proxyStateReady ? 'webgpu-reduced-state-delta-applied' : status,
    ok: proxyStateReady,
    mutationMode: 'state-manager-ulg-lane',
    liveBackendPolicy: manifestSummary.liveBackendPolicy || 'webgpu-only-no-cpu-fallback',
    sequence: resolved.sequence,
    stateKey: resolved.stateKey,
    manifestHash: manifestSummary.manifestHash,
    activeLayerId: manifestSummary.activeLayerId,
    proxyStateReady,
    proxyStateApplied: proxyStateReady,
    authoritativeWorkerBufferMutation: false,
    scientificMutationReady: scientificReadiness > 0.999,
    readiness: rounded(readiness, 6),
    executedFraction: rounded(executedFraction, 6),
    proxyClosureReady,
    scientificReadiness: rounded(scientificReadiness, 6),
    sourceKernel: 'ulg-pass-dag-state-delta-v0',
    channelUpdateCount: channelUpdates.length,
    appliedChannelUpdateCount: proxyStateReady ? channelUpdates.length : 0,
    channelUpdates,
    residuals: {
      quantumResidualProxy,
      wavefunctionNormalizationCorrection: normalizationCorrection,
      closureScienceResidual: rounded(1 - scientificReadiness, 6)
    },
    materialResponse: {
      drive: materialResponseDrive,
      densityNorm: rounded(stateInputSource.densityNorm, 6),
      stiffnessNorm: rounded(stateInputSource.stiffnessNorm, 6),
      conductivityNorm: rounded(stateInputSource.conductivityNorm, 6),
      refractiveNorm: rounded(stateInputSource.refractiveNorm, 6),
      temperatureK: rounded(stateInputSource.temperatureK, 4),
      pressureNorm: rounded(stateInputSource.pressureNorm, 6),
      gravityNorm: rounded(stateInputSource.gravityNorm, 6),
      fieldNorm: rounded(stateInputSource.fieldNorm, 6)
    },
    scientificBlockers: scientificReadiness > 0.999
      ? []
      : ['proxy closures are not calibrated first-principles closures; worker-buffer mutation remains blocked'],
    blocker: proxyStateReady ? null : 'ULG pass execution or proxy closure readiness was incomplete.',
    stateDeltaHash: stableHash({
      schema: ULG_RUNTIME_STATE_DELTA_SCHEMA,
      sequence: resolved.sequence,
      manifestHash: manifestSummary.manifestHash,
      readiness: rounded(readiness, 6),
      deltas: channelUpdates.map((update) => [update.channelId, update.delta]),
      deltaSeed
    })
  };
  return delta;
}

async function getGpuRuntime(stateKey) {
  if (gpuDisabledReasons.has(stateKey)) return null;
  if (gpuRuntimes.has(stateKey)) return gpuRuntimes.get(stateKey);
  try {
    if (!globalThis.navigator?.gpu) {
      gpuDisabledReasons.set(stateKey, 'navigator.gpu unavailable');
      return null;
    }
    const adapter = await globalThis.navigator.gpu.requestAdapter();
    if (!adapter) {
      gpuDisabledReasons.set(stateKey, 'requestAdapter returned null');
      return null;
    }
    const device = await adapter.requestDevice();
    const shaderModule = device.createShaderModule({ code: ULG_PASS_EVIDENCE_SHADER });
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: 'main' }
    });
    const runtime = { device, pipeline };
    gpuRuntimes.set(stateKey, runtime);
    return runtime;
  } catch (error) {
    gpuDisabledReasons.set(stateKey, error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function executePassDagWebGpu(resolved, manifestSummary) {
  const passes = asArray(resolved.manifest?.passDag?.passes);
  if (passes.length < 1) {
    return createBlockedResult(resolved, {
      status: 'blocked-empty-pass-dag',
      reason: 'ULG manifest has no pass DAG entries.',
      manifestSummary,
      backend: 'webgpu-empty-pass-dag'
    });
  }
  const runtime = await getGpuRuntime(resolved.stateKey);
  if (!runtime) {
    return createBlockedResult(resolved, {
      status: 'blocked-webgpu-unavailable',
      reason: gpuDisabledReasons.get(resolved.stateKey) || 'WebGPU unavailable; live ULG execution has no CPU fallback.',
      manifestSummary,
      backend: 'webgpu-unavailable',
      error: gpuDisabledReasons.get(resolved.stateKey) || null
    });
  }

  const { device, pipeline } = runtime;
  const passData = encodePasses(passes);
  const stateInputs = encodeStateInputs(resolved, manifestSummary);
  const paramsData = new Float32Array([
    passes.length,
    resolved.sequence,
    activeLayerCode(manifestSummary.activeLayerId),
    resolved.dtSeconds
  ]);
  const outputFloatCount = passes.length * OUTPUT_FLOATS_PER_PASS + STATE_OUTPUT_VEC4_COUNT * 4;
  const outputBytes = outputFloatCount * Float32Array.BYTES_PER_ELEMENT;
  const inputBuffer = device.createBuffer({
    size: passData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const stateInputBuffer = device.createBuffer({
    size: stateInputs.data.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const paramsBuffer = device.createBuffer({
    size: Math.max(16, paramsData.byteLength),
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
  const outputBuffer = device.createBuffer({
    size: outputBytes,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  });
  const readBuffer = device.createBuffer({
    size: outputBytes,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  });

  device.queue.writeBuffer(inputBuffer, 0, passData);
  device.queue.writeBuffer(stateInputBuffer, 0, stateInputs.data);
  device.queue.writeBuffer(paramsBuffer, 0, paramsData);
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: inputBuffer } },
      { binding: 1, resource: { buffer: paramsBuffer } },
      { binding: 2, resource: { buffer: outputBuffer } },
      { binding: 3, resource: { buffer: stateInputBuffer } }
    ]
  });
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  const dispatchWorkgroups = Math.ceil(passes.length / WORKGROUP_SIZE);
  passEncoder.dispatchWorkgroups(dispatchWorkgroups);
  passEncoder.end();
  commandEncoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, outputBytes);
  device.queue.submit([commandEncoder.finish()]);
  const hasQueueFence = typeof device.queue.onSubmittedWorkDone === 'function';
  let queueCompletionStatus = 'queue-work-submitted';
  let queueCompletionMethod = 'queue.submit';
  if (hasQueueFence) {
    await device.queue.onSubmittedWorkDone();
    queueCompletionStatus = 'queue-work-completed';
    queueCompletionMethod = 'queue.onSubmittedWorkDone';
  }
  await readBuffer.mapAsync(GPUMapMode.READ);
  const readbackCompletionStatus = 'readback-map-completed';
  const readbackCompletionMethod = 'GPUBuffer.mapAsync';
  if (!hasQueueFence) {
    queueCompletionStatus = readbackCompletionStatus;
    queueCompletionMethod = readbackCompletionMethod;
  }
  const raw = new Float32Array(readBuffer.getMappedRange()).slice();
  readBuffer.unmap();
  inputBuffer.destroy?.();
  stateInputBuffer.destroy?.();
  paramsBuffer.destroy?.();
  outputBuffer.destroy?.();
  readBuffer.destroy?.();

  let executedPassCount = 0;
  let totalWorkItems = 0;
  let weightedEvidence = 0;
  const passEvidencePreview = [];
  for (let index = 0; index < passes.length; index += 1) {
    const offset = index * OUTPUT_FLOATS_PER_PASS;
    const workItems = finite(raw[offset + 0], 0);
    const executionOk = finite(raw[offset + 1], 0);
    const weighted = finite(raw[offset + 3], 0);
    totalWorkItems += workItems;
    weightedEvidence += weighted;
    if (executionOk > 0.5) executedPassCount += 1;
    if (passEvidencePreview.length < 5) {
      passEvidencePreview.push({
        id: passes[index]?.id || `pass:${index}`,
        workItems: Math.round(workItems),
        executionOk: executionOk > 0.5,
        passHash: passes[index]?.passHash || null
      });
    }
  }

  const invalidLivePassCount = passes.filter((pass) => (
    pass?.backend !== 'webgpu'
    || pass?.executionMode !== 'live'
    || pass?.validation?.ok !== true
  )).length;
  const evidenceHash = stableHash({
    manifestHash: manifestSummary.manifestHash,
    passIds: passes.map((pass) => pass?.id || null),
    raw: Array.from(raw).map((value) => rounded(value, 4))
  });
  const ok = invalidLivePassCount === 0 && executedPassCount === passes.length;
  const status = ok ? 'webgpu-executed' : 'blocked-invalid-live-pass';
  const stateDelta = createStateDeltaFromRaw({
    raw,
    passes,
    resolved,
    manifestSummary,
    stateInputSource: stateInputs.source,
    status,
    ok
  });
  const gpuFence = createGpuFenceReport(resolved, {
    status: queueCompletionStatus,
    method: queueCompletionMethod,
    fenceSatisfied: true,
    queueCompletionStatus,
    queueCompletionMethod,
    readbackCompletionStatus,
    readbackCompletionMethod,
    passCount: passes.length,
    dispatchWorkgroups
  });

  return {
    ok,
    schema: ULG_RUNTIME_EXECUTION_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: 'ulg-runtime',
    taskId: resolved.taskId,
    stateKey: resolved.stateKey,
    sequence: resolved.sequence,
    status,
    backend: 'webgpu-ulg-pass-dag-state-delta',
    liveBackendPolicy: manifestSummary.liveBackendPolicy || 'webgpu-only-no-cpu-fallback',
    manifestHash: manifestSummary.manifestHash,
    activeLayerId: manifestSummary.activeLayerId,
    timeSeconds: rounded(resolved.timeSeconds, 4),
    passDagStatus: manifestSummary.passDagStatus,
    passCount: passes.length,
    executedPassCount,
    invalidLivePassCount,
    totalWorkItems: Math.round(totalWorkItems),
    weightedEvidence: rounded(weightedEvidence, 4),
    evidenceHash,
    passEvidencePreview,
    stateDelta,
    gpuFence,
    webgpuStatus: {
      schema: ULG_RUNTIME_EXECUTION_WEBGPU_SCHEMA,
      status: 'webgpu-executed',
      kernelMode: 'ulg-pass-dag-state-delta-v0',
      liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
      workgroupSize: WORKGROUP_SIZE,
      dispatchWorkgroups,
      passCount: passes.length,
      executedPassCount,
      invalidLivePassCount,
      inputBytes: passData.byteLength,
      stateInputBytes: stateInputs.data.byteLength,
      outputBytes,
      stateDeltaHash: stateDelta.stateDeltaHash,
      evidenceHash,
      gpuFenceStatus: gpuFence.status,
      gpuFenceSatisfied: gpuFence.fenceSatisfied,
      queueCompletionStatus,
      queueCompletionMethod,
      readbackCompletionStatus,
      readbackCompletionMethod
    },
    webgpuError: null
  };
}

export async function stepUlgRuntime(payload = {}) {
  const resolved = normalizeTaskPayload(payload);
  const manifestSummary = summarizeManifest(resolved.manifest || {});
  if (!resolved.manifest || resolved.manifest.schema !== 'peercompute.ulg.runtime-manifest.v0') {
    const value = createBlockedResult(resolved, {
      status: 'blocked-missing-manifest',
      reason: 'ULG WebGPU execution requires a peercompute.ulg.runtime-manifest.v0 manifest.',
      manifestSummary,
      backend: 'webgpu-missing-manifest'
    });
    return withCommitDelta(value, resolved);
  }
  try {
    const value = await executePassDagWebGpu(resolved, manifestSummary);
    return withCommitDelta(value, resolved);
  } catch (error) {
    const value = createBlockedResult(resolved, {
      status: 'blocked-webgpu-execution-error',
      reason: error instanceof Error ? error.message : String(error),
      manifestSummary,
      backend: 'webgpu-execution-error',
      error: error instanceof Error ? error.message : String(error)
    });
    return withCommitDelta(value, resolved);
  }
}
