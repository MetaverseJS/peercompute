import { createGgufArtifactReader } from '../GgufArtifactReader.js';
import { throwIfAborted } from '../modelManifest.js';
import { encodeGeneratedMesh } from '../GeneratedMeshArtifact.js';
import { MESH_RUNTIME_VERSION, validateMeshManifest, normalizeMeshInput } from './runtimeDefinition.js';
import { TRIPOSR, prepareTripoImage, tripoGridPoints, sampleTriplane, extractTripoSurface,
  orientTripoMesh, tripoColorsToLinear, requireFinite } from './geometry.js';
import { FOREGROUND_SIZE, hasForegroundAlpha, prepareForegroundInput, applyForegroundMask } from './imagePreparation.js';

const nextTurn = () => new Promise(resolve => setTimeout(resolve, 0));
const readSize = 4 * 1024 ** 2;
const releaseOutputs = outputs => Object.values(outputs ?? {}).forEach(tensor => tensor.dispose?.());

async function readFile(reader, file, signal, onProgress) {
  if (!file || file.size < 1 || file.size > 512 * 1024 ** 2) throw new Error('3D model file exceeds its loader budget');
  const bytes = new Uint8Array(file.size);
  for (let offset = 0; offset < bytes.length; offset += readSize) {
    throwIfAborted(signal);
    bytes.set(await reader.read(file.path, offset, Math.min(readSize, bytes.length - offset), { signal }), offset);
    onProgress?.({ type: 'model-load', stage: file.path, loaded: Math.min(offset + readSize, bytes.length), total: bytes.length });
  }
  return bytes;
}

function measureDevice(device, evidence) {
  const create = device.createCommandEncoder.bind(device), submit = device.queue.submit.bind(device.queue);
  device.createCommandEncoder = (...args) => {
    const encoder = create(...args), begin = encoder.beginComputePass.bind(encoder);
    encoder.beginComputePass = (...values) => {
      const pass = begin(...values);
      for (const name of ['dispatchWorkgroups', 'dispatchWorkgroupsIndirect']) {
        const dispatch = pass[name].bind(pass);
        pass[name] = (...groups) => { const result = dispatch(...groups); evidence.gpuDispatches++; return result; };
      }
      return pass;
    };
    return encoder;
  };
  device.queue.submit = (...args) => { const result = submit(...args); evidence.gpuSubmissions++; return result; };
}

/** Model bytes come only from the artifact reader. ORT uses the native WebGPU
 * EP with the exact owned device; its asyncify assets differ from diffusion's
 * JSEP ABI, whose MatMulNBits does not support these 8-bit weights. No child
 * workers, remote scripts, Python services, or model-driven code are created. */
export async function createMeshEngine({ manifest, runtimeAssets, artifactPort, signal, onProgress,
  gpu = globalThis.navigator?.gpu, loadOrt = () => import('peercompute-diffusion-ort/webgpu'),
  createReader = createGgufArtifactReader, prepareImage = prepareTripoImage, readModelFile = readFile,
  prepareForeground = prepareForegroundInput, applyMask = applyForegroundMask }) {
  const { manifest: admitted } = validateMeshManifest(manifest);
  const evidence = { gpuDispatches: 0, gpuSubmissions: 0, generatedRequests: 0 };
  let device, reader, ort, encoder, decoder, foreground, busy = false, disposed = false, lost = false;
  const markLost = cause => {
    if (disposed) return;
    lost = true;
    evidence.gpuFailure ??= String(cause?.message ?? cause ?? 'GPU device lost').slice(0, 300);
  };
  const uncaptured = event => markLost(event.error);
  async function runGpu(stage, operation) {
    if (lost) throw new Error(`Model session lost: 3D ${evidence.gpuFailure}`);
    const filters = ['validation', 'out-of-memory', 'internal'];
    for (const filter of filters) device.pushErrorScope(filter);
    let result, failure;
    try { result = await operation(); await device.queue.onSubmittedWorkDone(); }
    catch (error) { failure = error; }
    const errors = [];
    for (const filter of filters.reverse()) {
      try { const error = await device.popErrorScope(); if (error) errors.push({ filter, error }); }
      catch (error) { errors.push({ filter, error }); }
    }
    if (errors.length || lost) {
      const cause = errors.find(item => item.filter === 'out-of-memory')?.error ?? errors[0]?.error ?? evidence.gpuFailure;
      markLost(cause); releaseOutputs(result);
      const error = new Error(`Model session lost: 3D ${stage}: ${evidence.gpuFailure}`, { cause });
      error.code = 'ERR_MESH_GPU'; throw error;
    }
    if (failure) {
      markLost(failure);
      const error = new Error(`Model session lost: 3D ${stage}: ${evidence.gpuFailure}`, { cause: failure });
      error.code = 'ERR_MESH_GPU'; throw error;
    }
    return result;
  }
  async function dispose() {
    if (disposed) return;
    disposed = true; reader?.close(); reader = null;
    let failure;
    for (const session of [encoder, decoder, foreground]) {
      try { await session?.release(); } catch (error) { failure ??= error; }
    }
    encoder = decoder = foreground = null;
    device?.removeEventListener('uncapturederror', uncaptured); device?.destroy();
    if (failure) { lost = true; evidence.gpuFailure ??= String(failure.message ?? failure); throw failure; }
  }
  try {
    throwIfAborted(signal);
    const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) throw new Error('3D generation requires hardware WebGPU');
    device = await adapter.requestDevice({ requiredLimits: {
      maxBufferSize: adapter.limits.maxBufferSize,
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
    } });
    evidence.adapter = { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '', isFallbackAdapter: false };
    evidence.runtimeFeatures = [...device.features];
    device.addEventListener('uncapturederror', uncaptured); device.lost.then(markLost, markLost);
    measureDevice(device, evidence);
    ort = await loadOrt();
    if (ort.env.versions.web !== MESH_RUNTIME_VERSION) throw new Error('Unexpected 3D ORT runtime version');
    ort.env.wasm.proxy = false; ort.env.wasm.numThreads = 1; ort.env.wasm.wasmPaths = runtimeAssets;
    reader = createReader(artifactPort, { manifest: admitted, signal, maxReadBytes: readSize,
      maxReads: 1, maxQueuedReads: 2, readTimeoutMs: 60000 });
    const bytes = path => readModelFile(reader, admitted.files.find(file => file.path === path), signal, onProgress);
    const sessionOptions = { executionProviders: [{ name: 'webgpu', device }], enableMemPattern: false,
      enableCpuMemArena: false, extra: { session: { disable_prepacking: '1' } } };
    let graph = await bytes('triplane_q8.onnx'), external = await bytes('triplane_q8.onnx.data');
    await runGpu('encoder load', async () => {
      encoder = await ort.InferenceSession.create(graph, { ...sessionOptions,
        externalData: [{ path: 'triplane_q8.onnx.data', data: external }] });
    });
    graph = external = null; throwIfAborted(signal);
    const decoderBytes = await bytes('decoder.onnx');
    await runGpu('decoder load', async () => { decoder = await ort.InferenceSession.create(decoderBytes, sessionOptions); });
    throwIfAborted(signal);
    if (admitted.model.backgroundRemoval === 'u2netp') {
      const foregroundBytes = await bytes('u2netp.onnx');
      await runGpu('foreground load', async () => { foreground = await ort.InferenceSession.create(foregroundBytes, sessionOptions); });
    }
    evidence.artifactReads = reader.getStats(); reader.close(); reader = null;
    throwIfAborted(signal);
    if (encoder.inputNames.join() !== 'image' || encoder.outputNames.join() !== 'triplane'
        || decoder.inputNames.join() !== 'features' || decoder.outputNames.join() !== 'density,color'
        || (foreground && (foreground.inputNames.join() !== 'input.1'
          || foreground.outputNames.join() !== '1959,1960,1961,1962,1963,1964,1965'))) {
      throw new Error('3D graph interfaces differ from the pinned pipeline');
    }
  } catch (error) { try { await dispose(); } catch {} throw error; }

  return {
    get lost() { return lost; },
    getEvidence() { return structuredClone(evidence); },
    dispose,
    async generate(input, { signal: generationSignal, onProgress: progress } = {}) {
      if (disposed) throw new Error('3D model is unloaded');
      if (busy) throw new Error('3D model is already generating');
      if (lost) throw new Error(`Model session lost: 3D ${evidence.gpuFailure}`);
      const normalized = normalizeMeshInput(input, admitted);
      busy = true;
      const startDispatches = evidence.gpuDispatches, startSubmissions = evidence.gpuSubmissions;
      try {
        throwIfAborted(generationSignal); progress?.({ type: 'mesh-generation', stage: 'image', loaded: 0, total: 1 });
        let prepared = normalized.image;
        if (foreground && !hasForegroundAlpha(prepared)) {
          const tensor = new ort.Tensor('float32', prepareForeground(prepared), [1, 3, FOREGROUND_SIZE, FOREGROUND_SIZE]);
          let masks;
          try {
            masks = await runGpu('foreground separation', () => foreground.run({ 'input.1': tensor }));
            throwIfAborted(generationSignal);
            const mask = masks['1959'];
            if (mask?.type !== 'float32' || mask.dims.join() !== '1,1,320,320') throw new Error('Unexpected foreground model output');
            prepared = applyMask(prepared, mask.data);
          } finally { tensor.dispose(); releaseOutputs(masks); }
          evidence.foregroundRequests = (evidence.foregroundRequests ?? 0) + 1;
        }
        throwIfAborted(generationSignal);
        const image = new ort.Tensor('float32', prepareImage(prepared), [1, 3, 512, 512]);
        let outputs, planes;
        try {
          outputs = await runGpu('image encoding', () => encoder.run({ image }));
          const value = outputs.triplane;
          if (value?.type !== 'float32' || value.dims.join() !== '1,3,40,64,64') throw new Error('Unexpected TripoSR encoder output');
          planes = requireFinite(new Float32Array(value.data), 'Triplane');
        } finally { image.dispose(); releaseOutputs(outputs); }
        throwIfAborted(generationSignal);
        const query = async points => {
          throwIfAborted(generationSignal);
          const features = new ort.Tensor('float32', sampleTriplane(planes, points), [points.length / 3, 120]);
          let result;
          try {
            result = await runGpu('field decoding', () => decoder.run({ features }));
            const count = points.length / 3;
            if (result.density?.type !== 'float32' || result.color?.type !== 'float32'
                || result.density.data.length !== count || result.color.data.length !== count * 3) throw new Error('Unexpected TripoSR decoder output');
            return { density: requireFinite(new Float32Array(result.density.data), 'Density'),
              color: requireFinite(new Float32Array(result.color.data), 'Vertex colors') };
          } finally { features.dispose(); releaseOutputs(result); }
        };
        const total = TRIPOSR.resolution ** 3, field = new Float32Array(total);
        for (let offset = 0; offset < total; offset += TRIPOSR.queryBatch) {
          const count = Math.min(TRIPOSR.queryBatch, total - offset);
          field.set((await query(tripoGridPoints(TRIPOSR.resolution, offset, count))).density, offset);
          progress?.({ type: 'mesh-generation', stage: 'shape', loaded: offset + count, total });
          await nextTurn();
        }
        throwIfAborted(generationSignal);
        const mesh = extractTripoSurface(field), count = mesh.positions.length / 3;
        mesh.colors = new Float32Array(mesh.positions.length);
        for (let offset = 0; offset < count; offset += TRIPOSR.queryBatch) {
          const end = Math.min(count, offset + TRIPOSR.queryBatch);
          mesh.colors.set(tripoColorsToLinear((await query(mesh.positions.subarray(offset * 3, end * 3))).color), offset * 3);
          progress?.({ type: 'mesh-generation', stage: 'color', loaded: end, total: count });
          await nextTurn();
        }
        throwIfAborted(generationSignal);
        if (evidence.gpuDispatches <= startDispatches) {
          markLost(new Error('3D execution did not dispatch work on the admitted GPU'));
          throw new Error(`Model session lost: ${evidence.gpuFailure}`);
        }
        const generated = await encodeGeneratedMesh(orientTripoMesh(mesh));
        throwIfAborted(generationSignal); evidence.generatedRequests++;
        evidence.lastMesh = { vertexCount: generated.vertexCount, triangleCount: generated.triangleCount, byteLength: generated.byteLength };
        progress?.({ type: 'mesh-generation', stage: 'done', loaded: 1, total: 1 });
        return { text: '', mesh: generated, gpuDispatches: evidence.gpuDispatches - startDispatches,
          gpuSubmissions: evidence.gpuSubmissions - startSubmissions };
      } finally { busy = false; }
    },
  };
}
