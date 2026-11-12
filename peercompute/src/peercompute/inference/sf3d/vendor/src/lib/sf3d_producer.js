/**
 * SF3D producer — the device/adapter-injected callable a Kaminos host composes
 * into its own route (the kiln composition: the host owns the GPUDevice, SF3D
 * runs on it, host frames are submitted through the kit's foreground-
 * opportunity interlock before each SF3D GPU duty).
 *
 *   const producer = await createSf3dProducer({ device, adapter, weightsUrl });
 *   const handle = producer.requestForegroundOpportunity({ requestId, run(ctx) { ... ctx.submit([cb]) } });
 *   const { glb, receipt, foregroundOpportunityReport } = await producer.run(image, { runId });
 *   producer.dispose();
 *
 * Without an injected device the producer requests its own (the standalone
 * app path). The route is the product route (every proven foreground-liveness
 * mechanism on by default: cooperative GPU duties, decoder arena, five CPU
 * offload workers); routeOverrides adjust it per run.
 *
 * Honest boundaries: one run at a time per producer (the pipelines and decoder
 * arena are not reentrant); PeerCompute checks `signal` at stage/progress
 * boundaries (submitted GPU work needs device/worker retirement); receipt hashes are
 * 'not-computed' as in the app (the witness harness hashes the GLB).
 * `dispose()` refuses new work synchronously and returns a stable completion
 * promise. That completion settles only after admitted foreground work drains,
 * then producer-created workers and producer-loaded weight buffers release; it
 * never destroys an injected device or injected weights. Called during a run,
 * teardown waits for the run's foreground finish boundary first.
 * A failed run throws with `error.sf3dRun` = { runId, lastProgress,
 * foregroundOpportunityReport, identity } so the host keeps the phase and the
 * last trustworthy evidence. If both inference and foreground finish fail,
 * the thrown AggregateError preserves both original errors in order.
 * Failed foreground finish quarantines model execution and owned resources;
 * an attached host may still request outside-run frames, but disposal refuses
 * resource retirement until a separately proven settlement path exists.
 */
import { initGPU } from './gpu.js';
import { loadWeights } from './weights.js';
import { isLoaderMemoryBudget } from './loader_memory_budget.js';
// Hosts use the same bundled authority as the constructor, not a duplicated
// module's lookalike budget or an assertion about an unobserved old device.
export { createLoaderMemoryBudget } from './loader_memory_budget.js';
import { initPipelines } from './inference.js';
import { retainClipPrepWorker, releaseClipPrepWorker } from './clip_estimator.js';
import { runFullPipelineToGlb } from './full_pipeline.js';
import {
  createProductRouteOptions,
  createProductRouteWorkers,
  describeProductRouteOptions,
  productRouteWorkerModuleUrls,
  terminateProductRouteWorkers,
} from './product_route.js';
import { createProducerLifecycle, prepareProducerRun } from './producer_lifecycle.js';
import {
  createSf3dImageToMeshRouteReceipt,
  createStagedSubmitProfile,
  addStagedSubmitStage,
  createWebGpuBackendIdentity,
  createWebGpuForegroundService,
  SF3D_IMAGE_TO_MESH_ROUTE_ID,
  WEBGPU_INFERENCE_KIT_VERSION,
  validateRouteReceipt,
} from '@kaminos/webgpu-inference-kit';

export const SF3D_PRODUCER_SCHEMA = 'sf3d.producer.v0';
export const SF3D_PRODUCER_RUN_IDENTITY_SCHEMA = 'sf3d.producer-run-identity.v0';

/** Resolve the weights URL the way loadWeights will fetch it (absolute when a document location exists). */
export function resolveWeightsUrl(weightsUrl, base = globalThis.location?.href ?? null) {
  if (typeof weightsUrl !== 'string' || !weightsUrl) throw new Error('weightsUrl must be a non-empty string');
  try { return new URL(weightsUrl, base ?? undefined).href; } catch { return weightsUrl; }
}

/** Release a loader-owned weight set, or a legacy component tree. Callers enforce ownership. */
export function releaseLoadedWeights(weights) {
  // The loader owns both eager uploads and lazy resources hidden behind its
  // accessors, including retained CPU bytes. Tree walking is only the legacy
  // fallback; never combine it with disposal and double-destroy the buffers.
  if (typeof weights?.dispose === 'function') return weights.dispose();
  let released = 0;
  const seen = new Set();
  const visit = (value) => {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    // Raw CPU payloads are leaves, not containers of GPU resources.
    if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) return;
    if (typeof value.destroy === 'function') {
      value.destroy();
      released += 1;
      return;
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(weights);
  return released;
}

/** Drain foreground before retiring anything it may still reference. */
export async function releaseProducerResources({ foreground, retainedClipPrepWorker, routeWorkers, modelWeights, ownsWorkers, ownsWeights }) {
  const errors = [];
  const attempt = async operation => {
    try { await operation(); } catch (error) { errors.push(error); }
  };

  // Rejection is not a settlement certificate. Keep all owned resources alive
  // and let the host quarantine this producer instead of risking use-after-free.
  if (foreground) await foreground.dispose();
  if (retainedClipPrepWorker) {
    await attempt(() => releaseClipPrepWorker(routeWorkers.clipPrepWorker, modelWeights));
  }
  if (ownsWorkers && routeWorkers) await attempt(() => terminateProductRouteWorkers(routeWorkers));
  if (ownsWeights) await attempt(() => releaseLoadedWeights(modelWeights));

  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'SF3D producer cleanup encountered multiple failures');
}

/** Run/clock identity bound to a producer run (Wake answer 5: run/clock identity + effective topology). */
export function buildRunIdentity({ runId, routeId, startedAtMs, finishedAtMs, deviceInjected, commit, kitVersion }) {
  return Object.freeze({
    schema: SF3D_PRODUCER_RUN_IDENTITY_SCHEMA,
    runId,
    routeId,
    timeOrigin: globalThis.performance?.timeOrigin ?? null,
    clock: 'performance.now',
    startedAtMs,
    finishedAtMs,
    durationMs: finishedAtMs - startedAtMs,
    deviceTopology: deviceInjected ? 'host-injected-device' : 'producer-owned-device',
    producerCommit: commit,
    kitVersion,
  });
}

/** Internal run-settlement seam: the caller supplies the completed pipeline result/error. */
export async function finishProducerRunWithEvidence({
  prepared, pipelineFailed, pipelineError, runId, lastProgress,
  startedAtMs, deviceInjected, commit,
}) {
  let foregroundOpportunityReport = null;
  let finishFailed = false;
  let finishError;
  try {
    foregroundOpportunityReport = await prepared.release();
  } catch (releaseError) {
    finishFailed = true;
    finishError = releaseError;
  }
  if (!pipelineFailed && !finishFailed) return foregroundOpportunityReport;
  const reason = pipelineFailed && finishFailed
    ? new AggregateError([pipelineError, finishError], 'SF3D inference and foreground finish both failed', { cause: pipelineError })
    : pipelineFailed ? pipelineError : finishError;
  const evidence = Object.freeze({
    runId,
    lastProgress,
    foregroundOpportunityReport,
    inferenceCompleted: !pipelineFailed,
    identity: buildRunIdentity({ runId, routeId: SF3D_IMAGE_TO_MESH_ROUTE_ID, startedAtMs, finishedAtMs: performance.now(), deviceInjected, commit, kitVersion: WEBGPU_INFERENCE_KIT_VERSION }),
  });
  // JavaScript rejection reasons need not be Error objects (or extensible).
  // Preserve the original as cause while keeping run identity inspectable.
  let terminalError = reason instanceof Error ? reason : new Error('SF3D run failed with non-Error reason', { cause: reason });
  if (!Object.isExtensible(terminalError)) terminalError = new Error(terminalError.message, { cause: terminalError });
  terminalError.sf3dRun = evidence;
  throw terminalError;
}
export const SF3D_REQUIRED_RECEIPT_STAGES = Object.freeze([
  'image-preprocess', 'dinov2-tokenizer', 'two-stream-backbone',
  'triplane-decode', 'marching-tet', 'texture-bake', 'glb-export',
]);
const TEX_RESOLUTION = 1024;

async function describeBackend(adapter, device) {
  let info = adapter?.info ?? device.adapterInfo ?? null;
  if (!info && adapter?.requestAdapterInfo) info = await adapter.requestAdapterInfo();
  info = info || {};
  const limits = adapter?.limits ?? device.limits;
  const features = [...(adapter?.features ?? device.features ?? [])];
  const identity = createWebGpuBackendIdentity({
    adapterName: info.description || info.device || 'unknown',
    browser: globalThis.navigator?.userAgent ?? 'unknown',
    requestedFeatures: features,
    effectiveFeatures: features,
    limits: {
      maxBufferSize: limits.maxBufferSize,
      maxStorageBufferBindingSize: limits.maxStorageBufferBindingSize,
      maxComputeInvocationsPerWorkgroup: limits.maxComputeInvocationsPerWorkgroup,
    },
    timestampQuery: features.includes('timestamp-query') ? 'available' : 'unavailable',
  });
  return { identity, info, limits, features };
}

function buildRouteReceipt({ backend, image, result, commit }) {
  const profile = createStagedSubmitProfile({
    route: SF3D_IMAGE_TO_MESH_ROUTE_ID,
    timingSource: 'performance-now-wall-clock',
    requiredStages: [...SF3D_REQUIRED_RECEIPT_STAGES],
  });
  const stageTimings = result.stageTimings || {};
  for (const name of ['image-preprocess', 'dinov2-tokenizer', 'two-stream-backbone', 'triplane-decode', 'marching-tet']) {
    addStagedSubmitStage(profile, { name, ms: stageTimings[name] || 0 });
  }
  const spanMs = (name) => {
    const span = (result.stageSpans || []).find(s => s.name === name);
    return span ? span.end - span.start : 0;
  };
  addStagedSubmitStage(profile, { name: 'texture-bake', ms: spanMs('texture-bake') });
  addStagedSubmitStage(profile, { name: 'glb-export', ms: spanMs('glb-export') });

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  return createSf3dImageToMeshRouteReceipt({
    input: { artifactId: `source-image:${width}x${height}`, sha256: 'not-computed', shape: [height, width, 4] },
    outputs: {
      meshGlb: { artifactId: `mesh-glb:${result.numVertices}v-${result.numFaces}f`, sha256: 'not-computed', shape: [result.glb.byteLength] },
      albedoTexture: { artifactId: `albedo-texture:${TEX_RESOLUTION}`, sha256: 'not-computed', shape: [TEX_RESOLUTION, TEX_RESOLUTION, 4] },
      normalMap: { artifactId: `normal-map:${TEX_RESOLUTION}`, sha256: 'not-computed', shape: [TEX_RESOLUTION, TEX_RESOLUTION, 4] },
    },
    backend: backend.identity,
    model: { revision: 'v1.0.0-webgpu', weightsHash: 'not-computed' },
    kernel: {
      kitVersion: WEBGPU_INFERENCE_KIT_VERSION,
      profile: 'dinov2-two-stream-triplane-marching-tet-texture-bake',
      commit,
    },
    profile,
  });
}

export async function createSf3dProducer({
  device = null,
  adapter = null,
  weights = null,
  weightsUrl = 'weights.bin',
  workers = null,
  onWeightsProgress = null,
  memoryBudget = null,
  expectedWeightBytes = undefined,
  weightLoadingMode = 'whole-file',
  expectedSourceETag = undefined,
  commit = (typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'dev'),
} = {}) {
  if (memoryBudget && !isLoaderMemoryBudget(memoryBudget)) throw new TypeError('authenticated loader budget required');
  if (memoryBudget && weights != null)
    throw new Error('injected weights are unaccounted by the loader budget');
  if (memoryBudget && device != null) memoryBudget.assertDeviceAcquiredHere(device);
  const gpu = await initGPU(device ? { device, adapter } : {});
  const dev = gpu.device;
  const retireBudgetDevice = () => { if (memoryBudget && !gpu.injected) { dev.destroy(); memoryBudget.restore(); } };
  if (memoryBudget && !gpu.injected) {
    try { memoryBudget.bindOwnedDevice(dev); }
    catch (error) { dev.destroy(); throw error; }
  }
  const ownsWeights = weights == null;
  let modelWeights, backend;
  try {
    backend = await describeBackend(gpu.adapter, dev);
    modelWeights = weights ?? await loadWeights(dev, weightsUrl, onWeightsProgress || undefined, {memoryBudget, expectedWeightBytes, loadingMode:weightLoadingMode, expectedSourceETag});
  }
  catch (error) {
    try { retireBudgetDevice(); }
    catch (cleanupError) { throw new AggregateError([error, cleanupError], 'SF3D budgeted loading and device cleanup failed', {cause:error}); }
    throw error;
  }
  modelWeights._assertActive?.(dev);
  // Explicit resource identity for a mounting host: where the weights came
  // from and which worker module URLs must be reachable from the artifact.
  const resources = Object.freeze({
    weightsSource: ownsWeights ? 'loaded-by-producer' : 'injected-by-host',
    weightsUrl: ownsWeights ? resolveWeightsUrl(weightsUrl) : null,
    weightsSha256: 'not-computed',
    workerModuleUrls: productRouteWorkerModuleUrls(),
    workersSource: workers == null ? 'created-by-producer' : 'injected-by-host',
  });
  const ownsWorkers = workers == null;
  let pipelines;
  let routeWorkers;
  let foreground;
  let retainedClipPrepWorker = false;
  try {
    pipelines = initPipelines(dev);
    routeWorkers = workers ?? createProductRouteWorkers();
    if (routeWorkers?.clipPrepWorker) {
      retainClipPrepWorker(routeWorkers.clipPrepWorker, modelWeights);
      retainedClipPrepWorker = true;
    }
    foreground = createWebGpuForegroundService({ routeId: SF3D_IMAGE_TO_MESH_ROUTE_ID, device: dev, queue: dev.queue });
  } catch (error) {
    const failures = [error];
    try {
      await releaseProducerResources({
        foreground, retainedClipPrepWorker, routeWorkers, modelWeights, ownsWorkers, ownsWeights,
      });
    } catch (cleanupError) {
      failures.push(cleanupError);
    }
    try { retireBudgetDevice(); } catch (cleanupError) { failures.push(cleanupError); }
    if (failures.length > 1) throw new AggregateError(failures, 'SF3D producer initialization and cleanup failed', {cause:error});
    throw error;
  }

  let runSequence = 0;
  // One run at a time; dispose() during a run defers the release until the
  // run ends and refuses everything new meanwhile (producer_lifecycle.js).
  const lifecycle = createProducerLifecycle({
    // An injected worker is borrowed, but copied prep tensors sent into it are
    // not. After a successful foreground drain, attempt independent owned
    // cleanup even if reset fails. Failed drain quarantines all owned resources;
    // never destroy injected weights/device.
    async release() {
      await releaseProducerResources({
        foreground, retainedClipPrepWorker, routeWorkers, modelWeights, ownsWorkers, ownsWeights,
      });
      retireBudgetDevice();
    },
  });

  return Object.freeze({
    schema: SF3D_PRODUCER_SCHEMA,
    routeId: SF3D_IMAGE_TO_MESH_ROUTE_ID,
    kitVersion: WEBGPU_INFERENCE_KIT_VERSION,
    device: dev,
    adapter: gpu.adapter,
    deviceInjected: gpu.injected,
    weights: modelWeights,
    pipelines,
    workers: routeWorkers,
    backend: backend.identity,
    resources,
    adapterInfo: backend.info,
    adapterLimits: backend.limits,
    adapterFeatures: Object.freeze([...backend.features]),
    get activeRunId() { return lifecycle.activeRunId; },
    get disposed() { return lifecycle.disposed; },
    get quarantined() { return lifecycle.quarantined; },

    /** Host (kiln) frames: kit-shaped { requestId, run(ctx), metadata } → { requestId, completion, cancel }. */
    requestForegroundOpportunity(request) {
      lifecycle.assertAcceptingRequests();
      return foreground.request(request);
    },
    foregroundSnapshot() { return foreground.snapshot(); },

    async run(image, { runId = null, onProgress = null, routeOverrides = {}, signal = null } = {}) {
      if (image == null) throw new Error('sf3d run requires an image (HTMLImageElement/ImageBitmap-like)');
      if (signal?.aborted) throw new Error('sf3d run aborted before start');
      runSequence += 1;
      const id = runId ?? `sf3d-run-${runSequence}`;
      // Every fallible input is validated before any state is acquired, and
      // everything after acquisition sits under one exactly-once release
      // boundary (producer_lifecycle.js prepareProducerRun).
      const prepared = await prepareProducerRun({
        lifecycle, foreground, runId: id,
        buildOptions: () => createProductRouteOptions({ workers: routeWorkers, overrides: routeOverrides }),
      });
      const { options } = prepared;
      let result;
      let foregroundOpportunityReport = null;
      let lastProgress = null;
      const startedAtMs = performance.now();
      const progress = (message) => { signal?.throwIfAborted(); lastProgress = String(message); if (onProgress) onProgress(message); };
      try {
        result = await runFullPipelineToGlb(dev, pipelines, modelWeights, image, { ...options, signal }, progress);
      } catch (error) {
        await finishProducerRunWithEvidence({ prepared, pipelineFailed: true, pipelineError: error,
          runId: id, lastProgress, startedAtMs, deviceInjected: gpu.injected, commit });
      }
      foregroundOpportunityReport = await finishProducerRunWithEvidence({ prepared, pipelineFailed: false,
        runId: id, lastProgress, startedAtMs, deviceInjected: gpu.injected, commit });
      const finishedAtMs = performance.now();
      const receipt = buildRouteReceipt({ backend, image, result, commit });
      const receiptValidation = validateRouteReceipt(receipt);
      return Object.freeze({
        schema: 'sf3d.producer-run-result.v0',
        runId: id,
        identity: buildRunIdentity({ runId: id, routeId: SF3D_IMAGE_TO_MESH_ROUTE_ID, startedAtMs, finishedAtMs, deviceInjected: gpu.injected, commit, kitVersion: WEBGPU_INFERENCE_KIT_VERSION }),
        resources,
        glb: result.glb,
        receipt,
        receiptValidation,
        routeOptions: describeProductRouteOptions(options),
        offloads: result.offloads,
        cooperativeReports: result.cooperativeReports,
        stageSpans: result.stageSpans,
        stageTimings: result.stageTimings,
        totalMs: result.totalMs,
        foregroundOpportunityReport,
        numVertices: result.numVertices,
        numFaces: result.numFaces,
        uvNumVertices: result.uvNumVertices,
        uvNumFaces: result.uvNumFaces,
        vertices: result.vertices,
        faces: result.faces,
        roughness: result.roughness,
        metallic: result.metallic,
        sdf: result.sdf,
        isosurfaceThreshold: result.isosurfaceThreshold,
        arenaSnapshot: result.arenaSnapshot,
        dinoPayload: result.dinoPayload,
      });
    },

    /**
     * Safe at any time. With no run active: releases producer-created workers
     * and weight buffers now. During a run: refuses new runs/requests at once
     * and releases when the run ends (the run's own finish and receipts still
     * happen). Never destroys an injected device or injected weights.
     * Returns a synchronous status plus one stable `completion` promise. The
     * promise resolves with { status: 'released' } only after foreground drain
     * and producer-owned resource release have both finished.
     */
    dispose() {
      return lifecycle.dispose();
    },
  });
}
