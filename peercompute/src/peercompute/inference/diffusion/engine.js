import { createGgufArtifactReader } from '../GgufArtifactReader.js';
import { throwIfAborted } from '../modelManifest.js';
import { DIFFUSION_RUNTIME_VERSION, validateDiffusionManifest } from './runtimeDefinition.js';
import { gaussianLatents, seededRandom, sdScaleInput, sdStep, lcmStep, LCM_TIMESTEPS, SD_SIGMA, rgbaFromNchw } from './math.js';

const latentDims = [1, 4, 64, 64];
const byteLimit = 2 * 1024 ** 3;
const nextTurn = () => new Promise((resolve) => setTimeout(resolve, 0));

async function readBytes(reader, file, signal) {
  if (!file || file.size <= 0 || file.size >= byteLimit) throw new Error('Diffusion file exceeds the loader buffer budget');
  const bytes = new Uint8Array(file.size);
  for (let offset = 0; offset < file.size; offset += 4 * 1024 ** 2) {
    throwIfAborted(signal);
    const part = await reader.read(file.path, offset, Math.min(4 * 1024 ** 2, file.size - offset), { signal });
    bytes.set(part, offset);
  }
  return bytes;
}

function measureDevice(device, evidence) {
  const create = device.createCommandEncoder.bind(device), submit = device.queue.submit.bind(device.queue);
  device.createCommandEncoder = (...args) => {
    const encoder = create(...args), begin = encoder.beginComputePass.bind(encoder);
    encoder.beginComputePass = (...passArgs) => {
      const pass = begin(...passArgs);
      for (const method of ['dispatchWorkgroups', 'dispatchWorkgroupsIndirect']) {
        const dispatch = pass[method].bind(pass);
        pass[method] = (...values) => { const result = dispatch(...values); evidence.gpuDispatches++; return result; };
      }
      return pass;
    };
    return encoder;
  };
  device.queue.submit = (...args) => { const result = submit(...args); evidence.gpuSubmissions++; return result; };
}

// JSEP creates its own device from env.webgpu.adapter and replaces the device
// property with a read-only result. Capture that actual device even if the first
// session fails partway through initialization, then restore the adapter method.
export function captureOrtDevice(adapter, onDevice) {
  const original = adapter.requestDevice;
  adapter.requestDevice = async function (...args) {
    const device = await original.apply(this, args);
    onDevice(device);
    return device;
  };
  return () => { adapter.requestDevice = original; };
}

// Queue completion alone does not reject failed GPU commands. ORT logs some
// validation errors and otherwise returns tensors backed by invalid buffers.
export async function guardDiffusionGpuOperation({ device, operation, setDeviceCapture, markLost, stage = 'execution' }) {
  let scopedDevice, result, failure;
  const filters = [];
  const attach = (actual) => {
    if (scopedDevice === actual) return;
    if (scopedDevice) throw new Error('Diffusion changed GPU devices during an operation');
    scopedDevice = actual;
    for (const filter of ['validation', 'out-of-memory', 'internal']) {
      actual.pushErrorScope(filter); filters.push(filter);
    }
  };
  try {
    if (device) attach(device);
    // The first session creates the ORT device partway through this operation.
    setDeviceCapture?.(attach);
    result = await operation();
    if (!scopedDevice) throw new Error('ORT did not create the admitted GPU device');
    await scopedDevice.queue.onSubmittedWorkDone();
  } catch (error) { failure = error; }
  finally { setDeviceCapture?.(null); }
  const captured = await Promise.all(filters.reverse().map(async (filter) => {
    try { return { filter, error: await scopedDevice.popErrorScope() }; }
    catch (error) { return { filter, error, scopeFailed: true }; }
  }));
  // Prefer the originating allocation/internal error over invalid-buffer fallout.
  const gpuFailure = ['out-of-memory', 'internal', 'validation'].map((filter) =>
    captured.find((item) => item.filter === filter && item.error && !item.scopeFailed)).find(Boolean);
  failure ??= captured.find((item) => item.scopeFailed)?.error;
  if (gpuFailure || failure) {
    const cause = gpuFailure?.error ?? failure;
    const kind = gpuFailure?.filter === 'out-of-memory' ? 'out of memory' : gpuFailure?.filter ?? 'execution failure';
    const message = gpuFailure?.filter === 'out-of-memory'
      ? `Model session lost: diffusion ${stage} GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.`
      : `Model session lost: diffusion ${stage} GPU ${kind}: ${String(cause.message ?? cause).slice(0, 240)}`;
    const error = new Error(message, { cause });
    error.code = gpuFailure?.filter === 'out-of-memory' ? 'ERR_DIFFUSION_GPU_OUT_OF_MEMORY' : 'ERR_DIFFUSION_GPU';
    markLost(error); throw error;
  }
  return result;
}

export function observeDiffusionGpuErrors(device, onFailure) {
  const handle = (event) => onFailure(event.error);
  // ORT assigns onuncapturederror; an independent listener survives that assignment.
  device.addEventListener('uncapturederror', handle);
  return () => device.removeEventListener('uncapturederror', handle);
}

export async function runDiffusionGpuStage({ session, inputs, device, signal, own, markLost, stage = 'execution' }) {
  throwIfAborted(signal);
  const outputs = await guardDiffusionGpuOperation({ device, markLost, stage, operation: async () => {
    const outputs = await session.run(inputs);
    Object.values(outputs).forEach(own); return outputs;
  } });
  throwIfAborted(signal);
  return outputs;
}

function metadata(session, name) {
  return Array.isArray(session.inputMetadata) ? session.inputMetadata.find((item) => item.name === name)
    : session.inputMetadata?.[name];
}

function integerTensor(ort, session, name, values, dims) {
  const type = metadata(session, name)?.type;
  if (type === 'int32') return new ort.Tensor('int32', Int32Array.from(values, Number), dims);
  if (type === 'int64') return new ort.Tensor('int64', BigInt64Array.from(values, BigInt), dims);
  if (type === 'float32') return new ort.Tensor('float32', Float32Array.from(values, Number), dims);
  throw new Error(`Unsupported diffusion input type for ${name}: ${type}`);
}

/** No network fetches or hidden workers: all model bytes enter through the
 * StateManager artifact port, and all sessions use this managed worker's device.
 * ORT currently needs one complete ONNX buffer per session; the largest pinned
 * file is 1.733GB. Files load sequentially, never as a full package buffer.
 */
export async function createDiffusionEngine({ manifest, runtimeAssets, artifactPort, signal, onProgress,
  // ORT 1.31 /webgpu selects the native EP/asyncify ABI; /all contains the
  // JSEP backend matching the explicitly pinned .jsep runtime assets.
  gpu = globalThis.navigator?.gpu, loadOrt = () => import('peercompute-diffusion-ort/all'),
  loadTokenizer = () => import('@huggingface/transformers').then((module) => module.CLIPTokenizer) }) {
  const { trusted } = validateDiffusionManifest(manifest);
  const sessions = {}, evidence = { gpuDispatches: 0, gpuSubmissions: 0, generatedRequests: 0 };
  let device, reader, tokenizer, ort, restoreAdapter, removeGpuObserver, captureLoadingDevice,
    disposed = false, busy = false, lost = false;
  const markLost = (error) => {
    if (disposed) return;
    lost = true;
    if (!evidence.gpuFailure) {
      evidence.gpuFailure = String(error?.cause?.message ?? error?.message ?? error ?? 'GPU operation failed').slice(0, 400);
      console.error('Diffusion GPU failure:', evidence.gpuFailure);
    }
  };
  async function dispose() {
    if (disposed) return;
    disposed = true;
    restoreAdapter?.(); restoreAdapter = null;
    removeGpuObserver?.(); removeGpuObserver = null;
    reader?.close();
    let error;
    for (const session of Object.values(sessions)) {
      try { await session.release(); } catch (cause) { error ??= cause; }
    }
    device?.destroy();
    if (error) throw error;
  }
  try {
    const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' });
    throwIfAborted(signal);
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter || !adapter.features.has('shader-f16')) {
      throw new Error('Diffusion requires a hardware WebGPU adapter with shader-f16; CPU fallback is disabled');
    }
    evidence.adapter = { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '',
      isFallbackAdapter: false, requiredFeatures: ['shader-f16'] };
    ort = await loadOrt();
    if (ort.env.versions.web !== DIFFUSION_RUNTIME_VERSION) throw new Error('Unexpected diffusion ORT runtime version');
    ort.env.wasm.proxy = false; ort.env.wasm.numThreads = 1; ort.env.wasm.wasmPaths = runtimeAssets;
    ort.env.webgpu.adapter = adapter;
    restoreAdapter = captureOrtDevice(adapter, (actual) => {
      device = actual;
      captureLoadingDevice?.(device);
      removeGpuObserver = observeDiffusionGpuErrors(device, markLost);
      evidence.runtimeFeatures = [...device.features];
      measureDevice(device, evidence);
      device.lost.then(() => { if (!disposed) lost = true; });
    });
    ort.env.logLevel = 'error';
    reader = createGgufArtifactReader(artifactPort, { manifest, signal, maxReadBytes: 4 * 1024 ** 2,
      maxReads: 1, maxQueuedReads: 2, readTimeoutMs: 60000 });
    const file = (path) => manifest.files.find((entry) => entry.path === path);
    const tokenizerJson = JSON.parse(new TextDecoder().decode(await readBytes(reader, file('tokenizer/tokenizer.json'), signal)));
    const tokenizerConfig = JSON.parse(new TextDecoder().decode(await readBytes(reader, file('tokenizer/tokenizer_config.json'), signal)));
    const Tokenizer = await loadTokenizer();
    tokenizer = new Tokenizer(tokenizerJson, tokenizerConfig); tokenizer.pad_token_id = trusted.padTokenId;
    // Largest first avoids keeping smaller session initializers around during
    // the largest model's WASM parse/allocation peak.
    for (const name of ['unet', 'text_encoder', 'vae_decoder']) {
      throwIfAborted(signal);
      onProgress?.({ type: 'model-load', stage: name, loaded: 0, total: file(`${name}/model.onnx`).size });
      let data = await readBytes(reader, file(`${name}/model.onnx`), signal);
      const overrides = trusted.pipeline === 'sd-turbo' ? {
        unet: { batch_size: 1, num_channels: 4, height: 64, width: 64, sequence_length: 77 },
        text_encoder: { batch_size: 1 },
        vae_decoder: { batch_size: 1, num_channels_latent: 4, height_latent: 64, width_latent: 64 },
      } : {};
      sessions[name] = await guardDiffusionGpuOperation({ device, stage: `${name} load`, markLost,
        setDeviceCapture: (capture) => { captureLoadingDevice = capture; }, operation: async () => {
          // Retain the session even if a later scope/fence fails, so cleanup owns it.
          sessions[name] = await ort.InferenceSession.create(data, {
            executionProviders: ['webgpu'], enableMemPattern: false, enableCpuMemArena: false,
            ...(overrides[name] ? { freeDimensionOverrides: overrides[name] } : {}),
            extra: { session: { disable_prepacking: '1', use_device_allocator_for_initializers: '1' } },
          });
          return sessions[name];
        } });
      if (!device || ort.env.webgpu.device !== device || !device.features.has('shader-f16')) {
        throw new Error('ORT did not create the admitted WebGPU device');
      }
      restoreAdapter?.(); restoreAdapter = null;
      data = null;
      throwIfAborted(signal);
      onProgress?.({ type: 'model-load', stage: name, loaded: file(`${name}/model.onnx`).size, total: file(`${name}/model.onnx`).size });
    }
    reader.close(); evidence.artifactReads = reader.getStats(); reader = null;
    await device.queue.onSubmittedWorkDone(); throwIfAborted(signal);
    if (lost) throw new Error('GPU device lost while loading diffusion');
  } catch (error) {
    try { await dispose(); } catch (cleanup) { throw new AggregateError([error, cleanup], 'Diffusion loader cleanup failed'); }
    throw error;
  }

  return {
    evidence, get lost() { return lost; }, dispose,
    async generate({ prompt, seed, steps, signal: requestSignal, onProgress: progress }) {
      if (disposed || lost) throw new Error('Model session lost: diffusion device is unavailable');
      if (busy) throw new Error('Diffusion engine is already generating');
      busy = true;
      const tensors = new Set();
      const own = (value) => { tensors.add(value); return value; };
      const before = { dispatches: evidence.gpuDispatches, submissions: evidence.gpuSubmissions };
      const run = async (session, inputs) => {
        throwIfAborted(requestSignal);
        const dispatches = evidence.gpuDispatches;
        const outputs = await runDiffusionGpuStage({ session, inputs, device, signal: requestSignal, own,
          markLost, stage: session === sessions.text_encoder ? 'text encoder'
            : session === sessions.unet ? 'denoise' : 'decode' });
        throwIfAborted(requestSignal);
        if (lost) throw new Error(`GPU operation failed during diffusion: ${evidence.gpuFailure ?? 'device lost'}`);
        if (evidence.gpuDispatches <= dispatches) throw new Error('Diffusion stage did not execute on WebGPU');
        await nextTurn(); throwIfAborted(requestSignal);
        if (lost) throw new Error(`GPU operation failed during diffusion: ${evidence.gpuFailure ?? 'device lost'}`);
        return outputs;
      };
      const update = (stage, step) => { throwIfAborted(requestSignal); progress?.({ type: 'diffusion-progress', stage, step, steps }); };
      try {
        update('text-encoder', 0);
        const encoded = tokenizer(prompt, { padding: 'max_length', max_length: 77, truncation: true, return_tensor: false });
        let ids = encoded.input_ids; if (Array.isArray(ids[0])) ids = ids[0];
        if (!Array.isArray(ids) || ids.length !== 77 || ids.some((id) => !Number.isInteger(id) || id < 0 || id > 49407)) throw new Error('Invalid CLIP token sequence');
        const tokens = own(integerTensor(ort, sessions.text_encoder, 'input_ids', ids, [1, 77]));
        const { last_hidden_state: hidden } = await run(sessions.text_encoder, { input_ids: tokens });
        if (!hidden) throw new Error('Diffusion text encoder did not return hidden states');
        const random = seededRandom(seed);
        let sample = gaussianLatents(random, trusted.pipeline === 'sd-turbo' ? SD_SIGMA : 1);
        for (let index = 0; index < steps; index++) {
          update('denoise', index);
          const sampleTensor = own(new ort.Tensor('float32', trusted.pipeline === 'sd-turbo' ? sdScaleInput(sample) : sample, latentDims));
          const time = trusted.pipeline === 'sd-turbo' ? 999 : LCM_TIMESTEPS[index];
          const timestep = own(integerTensor(ort, sessions.unet, 'timestep', [time], [1]));
          const { out_sample: noise } = await run(sessions.unet, { sample: sampleTensor, timestep, encoder_hidden_states: hidden });
          if (!noise || noise.type !== 'float32') throw new Error('Invalid diffusion UNet output');
          sample = trusted.pipeline === 'sd-turbo' ? sdStep(sample, noise.data) : lcmStep(sample, noise.data, index, random);
          noise.dispose(); tensors.delete(noise); sampleTensor.dispose(); tensors.delete(sampleTensor); timestep.dispose(); tensors.delete(timestep);
        }
        update('decode', steps);
        const latent = own(new ort.Tensor('float32', sample, latentDims));
        const inputName = trusted.pipeline === 'sd-turbo' ? 'latent_sample' : 'latent';
        const decoded = await run(sessions.vae_decoder, { [inputName]: latent });
        const imageTensor = decoded[trusted.pipeline === 'sd-turbo' ? 'sample' : 'image'];
        if (!imageTensor || imageTensor.type !== 'float32') throw new Error('Invalid diffusion image tensor');
        const image = rgbaFromNchw(imageTensor.data, imageTensor.dims);
        throwIfAborted(requestSignal);
        evidence.generatedRequests++;
        return { text: '', image, seed, steps,
          gpuDispatches: evidence.gpuDispatches - before.dispatches,
          gpuSubmissions: evidence.gpuSubmissions - before.submissions };
      } catch (error) {
        if (!requestSignal?.aborted) {
          lost = true;
          if (String(error.message).startsWith('Model session lost:')) throw error;
          throw new Error(`Model session lost: ${String(error.message ?? error).slice(0, 300)}`, { cause: error });
        }
        throw error;
      } finally {
        for (const tensor of tensors) { try { tensor.dispose(); } catch { /* Owned worker shutdown remains the fallback. */ } }
        busy = false;
      }
    },
  };
}
