import { createGgufArtifactReader } from '../GgufArtifactReader.js';
import { throwIfAborted, abortError } from '../modelManifest.js';
import { validateGeneratedMesh } from '../GeneratedMeshArtifact.js';
import { FOREGROUND_SIZE, hasForegroundAlpha, prepareForegroundInput, applyForegroundMask } from '../mesh/imagePreparation.js';
import { createSf3dArtifactSource, SF3D_READ_BYTES } from './artifactSource.js';

const SOURCE_COMMIT = '86b7b68109434ffc33218f5fb697c7057c2518f9';
const releaseOutputs = outputs => Object.values(outputs ?? {}).forEach(tensor => tensor.dispose?.());
const defaultRuntime = () => import('../sf3dRuntimeDefinition.js');
const defaultVendor = async () => {
  const [producer, weights, shaders] = await Promise.all([
    import('./vendor/src/lib/sf3d_producer.js'), import('./vendor/src/lib/weights.js'),
    import('./vendor/src/lib/shader_ops.js'),
  ]);
  return { createProducer: producer.createSf3dProducer, loadWeights: weights.loadWeightsFromSource,
    getPersistentResources: shaders.getPersistentShaderResources };
};

/** Normalize the upstream's diagnostic sentences/duty counters to the existing
 * peer mesh protocol. Keep detailed text in engine evidence, never on the wire.
 * Phase milestones plus quantized texture progress stay below 32 frames. */
export function createSf3dProgressReporter(callback) {
  let previousStage = -1, previousLoaded = -1, frames = 0;
  const stages = ['image', 'shape', 'color', 'done'];
  return raw => {
    const text = String(raw), lower = text.toLowerCase();
    let stage, loaded = 0;
    if (lower === 'done') { stage = 'done'; loaded = 1; }
    else if (/foreground|preprocess|^image$/.test(lower)) stage = 'image';
    else if (/clip-material|uv-unwrap|uv-rasterize|texture.bake|glb-export|^color$/.test(lower)) {
      stage = 'color';
      loaded = /glb-export/.test(lower) ? 100 : /texture.bake/.test(lower) ? 40
        : /uv-rasterize/.test(lower) ? 20 : /uv-unwrap/.test(lower) ? 10 : 0;
      const match = /texture bake (\d+)\/(\d+)/i.exec(text);
      if (match && Number(match[2]) > 0) {
        loaded = 40 + Math.floor(Math.min(1, Number(match[1]) / Number(match[2])) * 10) * 5;
      }
    } else if (/camera embedding|dinov2|two-stream|post-processor|triplane|tet grid|sdf|mesh|^shape$/.test(lower)) {
      stage = 'shape';
      loaded = /mesh extracted/.test(lower) ? 100 : /extracting mesh/.test(lower) ? 90
        : /triplane|tet grid|sdf/.test(lower) ? 80 : /post-processor/.test(lower) ? 60
          : /two-stream/.test(lower) ? 30 : /dinov2/.test(lower) ? 10 : 0;
      const duty = /^(dinov2 blocks|two-stream duties) (\d+)\/(\d+)/i.exec(text);
      if (duty && Number(duty[3]) > 0) {
        const fraction = Math.min(1, Number(duty[2]) / Number(duty[3]));
        const dino = duty[1].toLowerCase().startsWith('dinov2');
        loaded = (dino ? 10 : 30) + Math.floor(fraction * (dino ? 3 : 5)) * 5;
      }
    } else return;
    const index = stages.indexOf(stage);
    if (index < previousStage || (index === previousStage && loaded <= previousLoaded)
        || (frames >= 31 && stage !== 'done')) return;
    previousStage = index; previousLoaded = loaded; frames++;
    callback?.({ type: 'mesh-generation', stage, loaded, total: stage === 'done' ? 1 : 100 });
  };
}

/** Inventory all SF3D allocations, including partially built tensors. Weights
 * and pipeline caches stay resident; generation scratch retires only after
 * queue settlement. ORT foreground allocations remain session-owned. */
function observeDevice(device, evidence) {
  const resources = new Set(), scratch = new Set();
  let collecting = false, persistentDepth = 0, ownedScope = false;
  evidence.liveBufferBytes = 0; evidence.peakBufferBytes = 0;
  evidence.ortBufferAllocations = 0;
  evidence.allocationAuthority = 'SF3D-owned requested WebGPU buffer bytes; excludes ORT foreground buffers, driver overhead and physical VRAM';
  evidence.phaseAllocations = [];
  const original = { createCommandEncoder: device.createCommandEncoder, submit: device.queue.submit };
  device.createCommandEncoder = function (...args) {
    const encoder = original.createCommandEncoder.apply(device, args), begin = encoder.beginComputePass;
    encoder.beginComputePass = function (...values) {
      const pass = begin.apply(encoder, values);
      for (const method of ['dispatchWorkgroups', 'dispatchWorkgroupsIndirect']) {
        const dispatch = pass[method];
        if (typeof dispatch === 'function') pass[method] = function (...groups) {
          const result = dispatch.apply(pass, groups); evidence.gpuDispatches++; return result;
        };
      }
      return pass;
    };
    return encoder;
  };
  device.queue.submit = function (...args) {
    const result = original.submit.apply(device.queue, args); evidence.gpuSubmissions++; return result;
  };
  for (const method of ['createBuffer', 'createTexture']) {
    if (typeof device[method] !== 'function') continue;
    original[method] = device[method];
    device[method] = function (...args) {
      const resource = original[method].apply(device, args);
      // ORT owns its buffers/pool and may reclaim wrappers through GC. Never
      // retain those resources or replace their destroy methods in our SF3D
      // inventory. Dispatch/submission instrumentation still observes both.
      if (!ownedScope) {
        if (method === 'createBuffer') evidence.ortBufferAllocations++;
        return resource;
      }
      const size = method === 'createBuffer' && Number.isSafeInteger(args[0]?.size) ? args[0].size : 0;
      evidence.liveBufferBytes += size;
      evidence.peakBufferBytes = Math.max(evidence.peakBufferBytes, evidence.liveBufferBytes);
      resources.add(resource);
      if (collecting && !persistentDepth) scratch.add(resource);
      const destroy = resource.destroy;
      resource.destroy = function () {
        if (!resources.has(resource)) return;
        const result = destroy.call(resource);
        resources.delete(resource); scratch.delete(resource); evidence.liveBufferBytes -= size;
        return result;
      };
      return resource;
    };
  }
  return {
    async owned(operation) {
      if (ownedScope) throw new Error('SF3D allocation ownership scopes cannot overlap');
      ownedScope = true;
      try { return await operation(); } finally { ownedScope = false; }
    },
    persistent(fn) { persistentDepth++; try { return fn(); } finally { persistentDepth--; } },
    begin() { collecting = true; },
    retire(pipelines, { keep = [], phase, finish = true } = {}) {
      // The upstream backbone lazily caches a zero-bias buffer on its instance.
      const seen = new Set(), protectedResources = new Set(keep);
      const preserve = value => {
        if (!value || typeof value !== 'object' || seen.has(value)) return;
        seen.add(value);
        if (resources.has(value)) { protectedResources.add(value); return; }
        if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer || value === device) return;
        // The pinned tokenizer/backbone/decoder keep their GPU uniforms in
        // Maps. Object.values alone misses these live resources and destroys
        // uniforms that the next request will reuse.
        if (value instanceof Map) {
          for (const [key, child] of value) { preserve(key); preserve(child); }
          return;
        }
        if (value instanceof Set) { for (const child of value) preserve(child); return; }
        for (const child of Object.values(value)) preserve(child);
      };
      preserve(pipelines);
      if (finish) collecting = false;
      const beforeBytes = evidence.liveBufferBytes;
      for (const resource of [...scratch]) if (!protectedResources.has(resource)) resource.destroy();
      if (phase && evidence.phaseAllocations.length < 32) evidence.phaseAllocations.push({ phase,
        beforeBytes, afterBytes: evidence.liveBufferBytes, retiredBytes: beforeBytes - evidence.liveBufferBytes });
    },
    close() {
      collecting = false;
      for (const resource of [...resources]) { try { resource.destroy(); } catch {} }
      for (const [method, implementation] of Object.entries(original)) {
        if (method === 'submit') device.queue.submit = implementation;
        else device[method] = implementation;
      }
    },
  };
}

/** Full SF3D image→geometry→UV→albedo/normal→GLB route. Everything runs in
 * ComputeManager's owned worker/device. No child workers, model URLs, remote
 * shader fetches, or unverified model-selected code enter this boundary. */
export async function createSf3dEngine({ manifest, runtimeAssets, artifactPort, signal, onProgress,
  gpu = globalThis.navigator?.gpu, loadRuntime = defaultRuntime, loadVendor = defaultVendor,
  loadOrt = () => import('peercompute-diffusion-ort/webgpu'), createReader = createGgufArtifactReader,
  createSource = createSf3dArtifactSource, prepareForeground = prepareForegroundInput,
  applyMask = applyForegroundMask, validateMesh = validateGeneratedMesh } = {}) {
  const runtime = await loadRuntime();
  const { manifest: admitted } = runtime.validateSf3dManifest(manifest);
  const evidence = { runtime: 'webgpu-sf3d', sourceCommit: SOURCE_COMMIT, gpuDispatches: 0,
    gpuSubmissions: 0, generatedRequests: 0, foregroundRequests: 0, subordinateWorkers: 0 };
  let device, reader, tracker, producer, weights, tetData, foreground, ort;
  let getPersistentResources = () => null;
  let disposed = false, lost = false, busy = false, activeRun = null, disposal;
  const markLost = reason => {
    if (disposed) return;
    lost = true; evidence.gpuFailure ??= String(reason?.message ?? reason ?? 'GPU device lost').slice(0, 300);
  };
  const uncaptured = event => markLost(event.error);
  function assertLive() {
    if (disposed) throw new Error('SF3D model is unloaded');
    if (lost) throw new Error(`Model session lost: SF3D ${evidence.gpuFailure}`);
  }
  async function runGpu(stage, operation) {
    assertLive();
    const filters = ['validation', 'out-of-memory', 'internal'];
    for (const filter of filters) device.pushErrorScope(filter);
    let result, failure;
    try { result = await operation(); await device.queue.onSubmittedWorkDone(); }
    catch (error) { failure = error; }
    for (const filter of filters.reverse()) {
      try { const error = await device.popErrorScope(); if (error) { markLost(error); failure ??= error; } }
      catch (error) { markLost(error); failure ??= error; }
    }
    if (disposed) throw new Error('SF3D model is unloaded');
    if (lost || failure) {
      if (failure?.name === 'AbortError') throw failure;
      markLost(failure); releaseOutputs(result);
      const allocation = `live=${evidence.liveBufferBytes}, peak=${evidence.peakBufferBytes}, stage=${evidence.lastStage ?? stage}`;
      throw Object.assign(new Error(`Model session lost: SF3D ${stage} (${allocation}): ${evidence.gpuFailure}`, { cause: failure }),
        { code: 'ERR_SF3D_GPU' });
    }
    return result;
  }
  function dispose() {
    if (disposal) return disposal;
    disposed = true;
    // Stop GPU admission immediately. Destroying our device aborts queued work;
    // ComputeManager also terminates this worker if a CPU stage cannot yield.
    reader?.close(); reader = null;
    device?.removeEventListener('uncapturederror', uncaptured);
    device?.destroy();
    disposal = (async () => {
      try { await activeRun; } catch {}
      const failures = [];
      try { const result = producer?.dispose(); await (result?.completion ?? result); } catch (error) { failures.push(error); }
      try { await foreground?.release(); } catch (error) { failures.push(error); }
      try { weights?.dispose(); } catch (error) { failures.push(error); }
      tracker?.close(); producer = foreground = weights = tetData = null;
      if (failures.length) { evidence.cleanupFailures = failures.map(error => String(error.message ?? error)); }
    })();
    return disposal;
  }
  try {
    throwIfAborted(signal);
    const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) throw new Error('SF3D requires hardware WebGPU');
    throwIfAborted(signal);
    const requiredLimits = {};
    for (const name of ['maxBufferSize', 'maxStorageBufferBindingSize', 'maxComputeWorkgroupStorageSize',
      'maxComputeInvocationsPerWorkgroup', 'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupSizeY',
      'maxComputeWorkgroupSizeZ', 'maxStorageBuffersPerShaderStage']) {
      if (adapter.limits[name] !== undefined) requiredLimits[name] = adapter.limits[name];
    }
    device = await adapter.requestDevice({ requiredLimits });
    evidence.adapter = { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '', isFallbackAdapter: false };
    evidence.runtimeFeatures = [...device.features];
    device.addEventListener('uncapturederror', uncaptured); device.lost.then(markLost, markLost);
    tracker = observeDevice(device, evidence);
    reader = createReader(artifactPort, { manifest: admitted, signal, maxReadBytes: SF3D_READ_BYTES,
      maxReads: 1, maxQueuedReads: 2, readTimeoutMs: 60000 });
    const source = createSource(reader, { signal, onProgress });
    const vendor = await loadVendor();
    getPersistentResources = vendor.getPersistentResources ?? getPersistentResources;
    throwIfAborted(signal);
    weights = await tracker.owned(() => runGpu('weight loading', async () => vendor.loadWeights(device, await source.weights())));
    throwIfAborted(signal);
    // CLIP uploads some owned weights on its first run. Keep those resident
    // while retiring transient shape/texture buffers after each generation.
    if (weights._rawGet) {
      const rawGet = weights._rawGet;
      weights._rawGet = (...args) => tracker.persistent(() => rawGet(...args));
    }
    tetData = await source.tetData();
    throwIfAborted(signal);
    ort = await loadOrt();
    if (ort.env.versions.web !== '1.31.1') throw new Error('Unexpected SF3D foreground ORT runtime version');
    ort.env.wasm.proxy = false; ort.env.wasm.numThreads = 1; ort.env.wasm.wasmPaths = runtimeAssets;
    const file = reader.stat('u2netp.onnx');
    const graph = await source.read(file.path, 0, file.size);
    await runGpu('foreground load', async () => {
      foreground = await ort.InferenceSession.create(graph, { executionProviders: [{ name: 'webgpu', device }],
        enableMemPattern: false, enableCpuMemArena: false, extra: { session: { disable_prepacking: '1' } } });
    });
    if (foreground.inputNames.join() !== 'input.1' || foreground.outputNames.join() !== '1959,1960,1961,1962,1963,1964,1965') {
      throw new Error('SF3D foreground graph differs from its pinned interface');
    }
    throwIfAborted(signal);
    producer = await tracker.owned(() => runGpu('pipeline load', () => vendor.createProducer({ device, adapter, weights,
      workers: {}, commit: SOURCE_COMMIT })));
    evidence.artifactReads = reader.getStats(); reader.close(); reader = null;
    throwIfAborted(signal);
    onProgress?.({ type: 'model-load', stage: 'ready', loaded: 1, total: 1 });
  } catch (error) { await dispose(); throw error; }

  async function generate(input, { signal: generationSignal, onProgress: progress } = {}) {
    assertLive();
    if (busy) throw new Error('SF3D model is already generating');
    const normalized = runtime.normalizeSf3dInput(input, admitted);
    const reportProgress = createSf3dProgressReporter(progress);
    throwIfAborted(generationSignal);
    busy = true;
    const startDispatches = evidence.gpuDispatches, startSubmissions = evidence.gpuSubmissions;
    const onAbort = () => { markLost(abortError(generationSignal.reason)); device.destroy(); };
    generationSignal?.addEventListener('abort', onAbort, { once: true });
    const operation = async () => {
      try {
        reportProgress('image');
        let image = normalized.image;
        if (!hasForegroundAlpha(image)) {
          reportProgress('foreground');
          const tensor = new ort.Tensor('float32', prepareForeground(image), [1, 3, FOREGROUND_SIZE, FOREGROUND_SIZE]);
          let outputs;
          try {
            outputs = await runGpu('foreground separation', () => foreground.run({ 'input.1': tensor }));
            throwIfAborted(generationSignal);
            const mask = outputs['1959'];
            if (mask?.type !== 'float32' || mask.dims.join() !== '1,1,320,320') throw new Error('Unexpected SF3D foreground mask');
            image = applyMask(image, mask.data); evidence.foregroundRequests++;
          } finally { tensor.dispose(); releaseOutputs(outputs); }
        }
        throwIfAborted(generationSignal); assertLive(); tracker.begin();
        const result = await tracker.owned(() => runGpu('generation', () => producer.run(image, { signal: generationSignal,
          runId: `peercompute-sf3d-${evidence.generatedRequests + 1}`, routeOverrides: { tetData,
            async retirePhase(phase, keep) {
              await device.queue.onSubmittedWorkDone();
              throwIfAborted(generationSignal); assertLive();
              tracker.retire({ pipelines: producer.pipelines, weights, shaders: getPersistentResources() }, { keep, phase, finish: false });
            } },
          onProgress(stage) {
            throwIfAborted(generationSignal); assertLive();
            evidence.lastStage = String(stage).slice(0, 300);
            reportProgress(evidence.lastStage);
          } })));
        throwIfAborted(generationSignal);
        if (evidence.gpuDispatches <= startDispatches) throw new Error('SF3D execution did not dispatch work on the admitted GPU');
        evidence.lastUnvalidatedMesh = { vertexCount: result.uvNumVertices ?? result.numVertices,
          triangleCount: result.uvNumFaces ?? result.numFaces, byteLength: result.glb?.byteLength };
        const mesh = validateMesh({ data: new Uint8Array(result.glb) });
        throwIfAborted(generationSignal);
        evidence.generatedRequests++;
        evidence.lastMesh = { vertexCount: mesh.vertexCount, triangleCount: mesh.triangleCount, byteLength: mesh.byteLength };
        evidence.lastRoute = { sourceCommit: SOURCE_COMMIT, totalMs: result.totalMs,
          offloads: result.offloads, stageTimings: result.stageTimings };
        reportProgress('done');
        return { text: '', mesh, gpuDispatches: evidence.gpuDispatches - startDispatches,
          gpuSubmissions: evidence.gpuSubmissions - startSubmissions };
      } catch (error) {
        // Partial GPU pipelines are quarantined; a retry gets a clean worker.
        markLost(error); device.destroy();
        if (generationSignal?.aborted) throw abortError(generationSignal.reason);
        throw error;
      } finally {
        generationSignal?.removeEventListener('abort', onAbort);
        // runGpu waits for all submitted commands (or device loss) first.
        tracker.retire({ pipelines: producer?.pipelines, weights, shaders: getPersistentResources() }); busy = false;
      }
    };
    activeRun = operation();
    try { return await activeRun; } finally { activeRun = null; }
  }
  return { get lost() { return lost; }, getEvidence: () => structuredClone(evidence), generate, dispose };
}
