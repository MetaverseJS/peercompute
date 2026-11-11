import { initializeWllamaModule } from '@wllama/wllama/peercompute-engine.js';
import { glueSerialize, glueDeserialize } from '@wllama/wllama/peercompute-glue.js';
import { throwIfAborted } from '../modelManifest.js';
import { GGUF_MEDIA_PROFILE } from './mediaInput.js';

export const GGUF_NATIVE_READ_BYTES = 4 * 1024 ** 2;
const MAX_RESPONSE_BYTES = 1024 * 1024;
function serializeRequest(name, body) {
  if (name === 'completion') {
    if (typeof body?.data_json !== 'string' || new TextEncoder().encode(body.data_json).length > MAX_RESPONSE_BYTES
        || !Array.isArray(body.files) || body.files.length > GGUF_MEDIA_PROFILE.maximumFiles
        || body.files.some((file) => !(file instanceof Uint8Array))) throw new Error('Invalid GGUF native media request');
    const rawBytes = body.files.reduce((sum, file) => sum + file.byteLength, 0);
    if (rawBytes > GGUF_MEDIA_PROFILE.requestBytes) throw new Error('GGUF native media exceeds its byte budget');
  }
  const encoded = glueSerialize(body);
  const maximum = name === 'completion' ? GGUF_MEDIA_PROFILE.requestBytes : MAX_RESPONSE_BYTES;
  if (encoded.byteLength > maximum) throw new Error('GGUF native message exceeds its byte budget');
  return encoded;
}

/** Copies bounded CID ranges into the native tensor buffer without a whole-file Blob. */
export function createNativeFileReader({ files, reader, getMemory, getSignal = () => undefined }) {
  const paths = new Map(files.map((file) => [file.name, file]));
  return async (path, offset, requested, pointer) => {
    const file = paths.get(path.replace(/^\/?models\//, ''));
    if (!file || ![offset, requested, pointer].every((value) => Number.isSafeInteger(value) && value >= 0)
        || offset > file.size) throw new Error('Invalid GGUF native file read');
    const length = Math.min(requested, file.size - offset);
    if (!Number.isSafeInteger(pointer + length) || pointer + length > getMemory().byteLength) {
      throw new Error('GGUF native file read exceeds WASM memory');
    }
    for (let done = 0; done < length;) {
      throwIfAborted(getSignal());
      const size = Math.min(GGUF_NATIVE_READ_BYTES, length - done);
      const bytes = await reader.read(file.path, offset + done, size, { signal: getSignal() });
      throwIfAborted(getSignal());
      if (!(bytes instanceof Uint8Array) || bytes.byteLength !== size) throw new Error('Incomplete GGUF artifact range');
      new Uint8Array(getMemory()).set(bytes, pointer + done);
      done += size;
    }
    return BigInt(length);
  };
}

function mountVirtualFiles(module, files) {
  module.FS.mkdir('/models');
  module.FS.mount(module.MEMFS, { root: '.' }, '/models');
  const byName = new Map(files.map((file) => [file.name, file]));
  const ops = module.MEMFS.stream_ops;
  for (const operation of ['read', 'llseek']) {
    const original = ops[operation];
    ops[operation] = function (stream, ...args) {
      const file = byName.get(stream.node.name);
      if (file) stream.node.usedBytes = file.size;
      return original.call(this, stream, ...args);
    };
    module.MEMFS.ops_table.file.stream[operation] = ops[operation];
  }
  // Async reads are mandatory. An accidental mmap must never copy a multi-GB model.
  const mmap = ops.mmap;
  ops.mmap = function (stream, ...args) {
    if (byName.has(stream.node.name)) throw new Error('GGUF artifact mmap is prohibited');
    return mmap.call(this, stream, ...args);
  };
  module.MEMFS.ops_table.file.stream.mmap = ops.mmap;
  for (const file of files) module.FS_createDataFile('/models', file.name, new Uint8Array(0), true, false, true);
}

export function observeGpuDevice(device, evidence, { collect = false, onLost } = {}) {
  evidence.device = device;
  evidence.runtimeFeatures = [...device.features];
  evidence.runtimeAdapter = device.adapterInfo ? { vendor: device.adapterInfo.vendor,
    architecture: device.adapterInfo.architecture, isFallbackAdapter: device.adapterInfo.isFallbackAdapter ?? false } : null;
  if (!device.features.has('shader-f16') || evidence.runtimeAdapter?.isFallbackAdapter) {
    throw new Error('GGUF native runtime did not acquire the required hardware GPU');
  }
  device.lost.then((info) => onLost?.(info));
  if (!collect) return () => {};
  const encoderDescriptor = Object.getOwnPropertyDescriptor(device, 'createCommandEncoder');
  const submitDescriptor = Object.getOwnPropertyDescriptor(device.queue, 'submit');
  const create = device.createCommandEncoder.bind(device);
  const submit = device.queue.submit.bind(device.queue);
  device.createCommandEncoder = (...args) => {
    const encoder = create(...args);
    const begin = encoder.beginComputePass.bind(encoder);
    encoder.beginComputePass = (...passArgs) => {
      const pass = begin(...passArgs);
      for (const method of ['dispatchWorkgroups', 'dispatchWorkgroupsIndirect']) {
        const dispatch = pass[method].bind(pass);
        pass[method] = (...dispatchArgs) => { const result = dispatch(...dispatchArgs); evidence.dispatches += 1; return result; };
      }
      return pass;
    };
    return encoder;
  };
  device.queue.submit = (...args) => { const result = submit(...args); evidence.submissions += 1; return result; };
  return () => {
    if (encoderDescriptor) Object.defineProperty(device, 'createCommandEncoder', encoderDescriptor);
    else delete device.createCommandEncoder;
    if (submitDescriptor) Object.defineProperty(device.queue, 'submit', submitDescriptor);
    else delete device.queue.submit;
  };
}

export function parseOffloadEvidence(line) {
  const match = /offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(line);
  if (!match) return null;
  return { gpuLayers: Number(match[1]), totalLayers: Number(match[2]) };
}

export function parseBufferEvidence(line) {
  const match = /([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.exec(line);
  if (!match) return null;
  return { backend: match[1], kind: match[2].toLowerCase(), bytes: Math.round(Number(match[3]) * 1024 ** 2) };
}

/** Native Wllama engine, instantiated in the caller's existing managed worker. */
export async function createGgufEngine({ wasmUrl, weights, projector, adapters = [], reader, signal, collectGpuEvidence = false,
  onProgress, onLost, initialize = initializeWllamaModule } = {}) {
  const files = weights.map((file, index) => ({ ...file,
    name: `model-${String(index + 1).padStart(5, '0')}-of-${String(weights.length).padStart(5, '0')}.gguf` }));
  if (projector && weights.some((file) => file.path === projector.path)) throw new Error('GGUF projector must be separate from text shards');
  const projectorFile = projector ? { ...projector, name: 'mmproj.gguf' } : undefined;
  const adapterFiles = adapters.map((adapter, index) => ({ ...adapter.file, scale: adapter.scale,
    name: `adapter-${index + 1}.gguf` }));
  const mountedFiles = [...files, ...(projectorFile ? [projectorFile] : []), ...adapterFiles];
  if (new Set(mountedFiles.map((file) => file.path)).size !== mountedFiles.length) {
    throw new Error('GGUF base and companion files must have distinct paths');
  }
  const evidence = { dispatches: 0, submissions: 0, device: null, offload: null, buffers: [], lost: false };
  let activeSignal = signal;
  let fatal;
  let restoreDevice;
  let module;
  let resolveReady, rejectReady;
  const ready = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const onLog = (line) => {
    const offload = parseOffloadEvidence(String(line));
    if (offload) { evidence.offload = offload; onProgress?.({ type: 'gpu-offload', ...offload }); }
    const allocation = parseBufferEvidence(String(line));
    if (allocation && evidence.buffers.length < 32) {
      evidence.buffers.push(allocation);
      onProgress?.({ type: 'native-buffer', ...allocation, wasmMemoryBytes: module?.wasmMemory?.buffer.byteLength ?? 0 });
    }
    // Never forward native prompts, tokens, tensors, or complete log lines.
  };
  const fail = (reason) => {
    fatal = new Error(`Model session lost: GGUF native runtime failed: ${String(reason).slice(0, 300)}`);
    rejectReady(fatal);
  };
  module = {
    noInitialRun: true, pthreadPoolSize: 0,
    locateFile(name) { if (name !== 'wllama.wasm') throw new Error('Untrusted GGUF runtime asset request'); return wasmUrl; },
    print: onLog, printErr: onLog, onAbort: fail, onExit: fail,
    preRun() { module.ENV.USE_ASYNC_FILE = '1'; },
    onRuntimeInitialized() { resolveReady(); },
    peercomputeOnDevice(device) {
      try {
        restoreDevice?.();
        restoreDevice = observeGpuDevice(device, evidence, { collect: collectGpuEvidence,
          onLost(info) { evidence.lost = true; onLost?.(info); } });
      } catch (error) { device.destroy(); fail(error.message); }
    },
  };
  const read = createNativeFileReader({ files: mountedFiles, reader, getMemory: () => module.wasmMemory.buffer,
    getSignal: () => activeSignal });
  initialize(module, read);
  await ready;
  throwIfAborted(signal);
  mountVirtualFiles(module, mountedFiles);
  const start = module.cwrap('wllama_start', 'string', [], { async: true });
  const malloc = module.cwrap('wllama_malloc', 'bigint', ['bigint', 'number']);
  const invoke = module.cwrap('wllama_action', 'bigint', ['string', 'bigint'], { async: true });
  let busy = false;
  const action = async (name, body, operationSignal) => {
    if (busy) throw new Error('Concurrent GGUF native calls are prohibited');
    if (fatal) throw fatal;
    if (evidence.lost) throw new Error('GPU device lost; GGUF session is unavailable');
    throwIfAborted(operationSignal);
    // Reject invalid caller input before quarantining an otherwise healthy session.
    const encoded = serializeRequest(name, body);
    busy = true; activeSignal = operationSignal;
    try {
      const input = Number(malloc(BigInt(encoded.byteLength), 0));
      const memory = new Uint8Array(module.wasmMemory.buffer);
      if (!Number.isSafeInteger(input) || input <= 0 || input + encoded.length > memory.length) throw new Error('Invalid GGUF input pointer');
      memory.set(encoded, input);
      const output = Number(await invoke(name, BigInt(input)));
      if (fatal) throw fatal;
      const resultMemory = module.wasmMemory.buffer;
      const length = new DataView(resultMemory).getUint32(input, true);
      if (!Number.isSafeInteger(output) || output <= 0 || length > MAX_RESPONSE_BYTES
          || output + length > resultMemory.byteLength) throw new Error('Invalid GGUF output buffer');
      return glueDeserialize(new Uint8Array(resultMemory, output, length).slice());
    } catch (error) {
      fatal ??= new Error(`Model session lost: GGUF native action failed: ${String(error.message ?? error).slice(0, 300)}`);
      throw fatal;
    } finally { busy = false; activeSignal = undefined; }
  };
  const started = JSON.parse(await start());
  if (fatal) throw fatal;
  if (!started.success || !evidence.device) throw new Error('GGUF native hardware GPU backend did not initialize');
  throwIfAborted(signal);
  return {
    files, projectorFile, adapterFiles, action, evidence,
    async settleGpu() {
      try { await evidence.device.queue.onSubmittedWorkDone(); }
      catch (error) {
        evidence.lost = true;
        fatal = new Error(`Model session lost: GGUF GPU completion failed: ${String(error.message ?? error).slice(0, 300)}`);
        throw fatal;
      }
    },
    close() { restoreDevice?.(); evidence.device?.destroy(); },
    memoryBytes() { return module.wasmMemory.buffer.byteLength; },
  };
}
