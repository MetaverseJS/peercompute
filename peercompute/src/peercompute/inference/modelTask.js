import { createArtifactFetch } from './ArtifactReadBridge.js';
import { MODEL_POLICY, MODEL_RUNTIME_VERSION, abortError, throwIfAborted,
  modelResourcePolicy, validateModelManifest, validateRuntimeAssets, validateSessionId } from './modelManifest.js';

const byteLength = (text) => new TextEncoder().encode(text).byteLength;

function requireManagedWorker() {
  if (typeof WorkerGlobalScope === 'undefined' || !(globalThis instanceof WorkerGlobalScope)) {
    throw new Error('Model inference requires a ComputeManager-owned worker');
  }
}

export function validateImageInput(image) {
  if (image === undefined || image === null) return null;
  if (!Number.isSafeInteger(image.width) || !Number.isSafeInteger(image.height)
      || image.width < 1 || image.height < 1 || image.width * image.height > MODEL_POLICY.maxImagePixels
      || image.channels !== 4 || !(image.data instanceof Uint8Array || image.data instanceof Uint8ClampedArray)
      || image.data.byteLength !== image.width * image.height * 4
      || image.data.byteLength > MODEL_POLICY.maxImageBytes) {
    throw new Error('Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted');
  }
  return image;
}

export function normalizeModelMessages(data) {
  const messages = data.messages ?? (typeof data.prompt === 'string' ? [{ role: 'user', content: data.prompt }] : null);
  if (!Array.isArray(messages) || !messages.length || messages.length > MODEL_POLICY.maxMessages) {
    throw new Error('Invalid inference messages');
  }
  let size = 0;
  return messages.map((message) => {
    if (!message || !['system', 'user', 'assistant'].includes(message.role)
        || typeof message.content !== 'string') throw new Error('Only text message content is accepted');
    size += byteLength(message.content);
    if (size > MODEL_POLICY.maxPromptBytes) throw new Error('Prompt exceeds its byte budget');
    return { role: message.role, content: message.content };
  });
}

async function disposeComponents(components) {
  if (!components) return;
  let error;
  const visited = new Set();
  for (const component of [components.model, components.processor, components.tokenizer]) {
    if (!component || visited.has(component)) continue;
    visited.add(component);
    try { await component.dispose?.(); } catch (cause) { error ??= cause; }
  }
  if (error) throw error;
}

function disposeTensors(value, visited = new Set()) {
  if (!value || typeof value !== 'object' || visited.has(value)) return;
  visited.add(value);
  if (typeof value.dispose === 'function') { value.dispose(); return; }
  for (const item of Object.values(value)) disposeTensors(item, visited);
}

function dropOldestTurn(messages) {
  const first = messages.findIndex((message) => message.role === 'user');
  if (first < 0) return null;
  const next = messages.findIndex((message, index) => index > first && message.role === 'user');
  if (next < 0) return null;
  // Keep all system instructions and the latest user turn. Do not slice text or
  // leave an older assistant response without its corresponding user request.
  return messages.filter((message, index) => index < first || index >= next || message.role === 'system');
}

function generationFinishReason(model, generated, maximum) {
  // Match the pinned Transformers runtime's generation-config precedence.
  const config = { ...model.config };
  for (const key of ['decoder', 'generator', 'text_config']) Object.assign(config, config[key]);
  Object.assign(config, model.generation_config);
  const eos = Array.isArray(config.eos_token_id) ? config.eos_token_id : [config.eos_token_id];
  const last = generated.at(-1);
  const tokenId = (value) => typeof value === 'bigint' || (Number.isSafeInteger(value) && value >= 0);
  if (tokenId(last) && eos.some((id) => tokenId(id) && BigInt(id) === BigInt(last))) return 'stop';
  return generated.length >= maximum ? 'length' : 'unknown';
}

async function loadComponents({ library, modelPath, options, manifest }) {
  const components = {};
  try {
    const config = await library.AutoConfig.from_pretrained(modelPath, options);
    if (config.model_type !== manifest.model.architecture) {
      throw new Error('Model config architecture does not match its admitted manifest');
    }
    const modelOptions = { ...options, config };
    if (manifest.model.architecture === 'qwen3_5') modelOptions.use_external_data_format = 1;
    if (manifest.model.task === 'image-text-to-text') {
      components.processor = await library.AutoProcessor.from_pretrained(modelPath, options);
      if (manifest.model.architecture === 'qwen3_5') {
        const processor = components.processor.image_processor;
        if (!processor) throw new Error('Qwen3.5 image processor is unavailable');
        processor.min_pixels = 256 * 256;
        processor.max_pixels = modelResourcePolicy(manifest.model).maxProcessedImagePixels;
        // Qwen's Python processor defaults to normalization, but the pinned export
        // omits that flag and Transformers.js 4.3.2 otherwise leaves it disabled.
        // Preserve an explicit setting while restoring the expected RGB [-1, 1].
        processor.do_normalize ??= true;
      }
      components.tokenizer = components.processor.tokenizer;
      components.model = await library.AutoModelForImageTextToText.from_pretrained(modelPath, modelOptions);
    } else {
      components.tokenizer = await library.AutoTokenizer.from_pretrained(modelPath, options);
      components.model = await library.AutoModelForCausalLM.from_pretrained(modelPath, modelOptions);
    }
    return components;
  } catch (error) {
    await disposeComponents(components);
    throw error;
  }
}

function summary(entry) {
  return {
    sessionId: entry.sessionId,
    manifestCid: entry.manifestCid,
    status: entry.lost ? 'lost' : entry.status,
    task: entry.manifest.model.task,
    dtype: entry.manifest.model.dtype,
    workerId: entry.workerId,
    adapter: entry.adapter,
    runtimeAdapter: entry.runtimeAdapter ?? null,
    gpuDispatches: entry.gpuDispatches ?? 0,
    gpuSubmissions: entry.gpuSubmissions ?? 0,
    gpuProfileSamples: entry.gpuProfileSamples ?? 0,
    collectGpuEvidence: entry.collectGpuEvidence === true,
    runtimeFeatures: entry.runtimeFeatures ?? [],
    generatedRequests: entry.generatedRequests,
  };
}

/** One runtime per imported task module, resident in the manager's reserved worker. */
export function createModelTaskRuntime({
  loadLibrary = () => import('@huggingface/transformers'),
  loadModel = loadComponents,
  gpu = globalThis.navigator?.gpu,
  baseUrl = globalThis.location?.href,
  assertWorker = requireManagedWorker,
} = {}) {
  const sessions = new Map();
  let libraryPromise;

  async function load(data, context) {
    if (sessions.size) throw new Error('This inference worker already has a resident/loading model');
    const sessionId = validateSessionId(data.sessionId);
    const { manifest } = validateModelManifest(data.manifest);
    const runtimeAssets = validateRuntimeAssets(data.runtimeAssets, baseUrl);
    if (!data.artifactPort?.postMessage) throw new Error('An artifact reader port is required');
    throwIfAborted(context.signal);
    const entry = { sessionId, manifest, manifestCid: data.manifestCid, status: 'loading',
      workerId: context.workerId ?? null, generatedRequests: 0, components: null };
    sessions.set(sessionId, entry);
    let bridge;
    try {
      const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' });
      throwIfAborted(context.signal);
      if (!adapter || adapter.info?.isFallbackAdapter || adapter.isFallbackAdapter) {
        throw new Error('A hardware WebGPU adapter is required; CPU/software fallback is disabled');
      }
      const dtypes = typeof manifest.model.dtype === 'string' ? [manifest.model.dtype] : Object.values(manifest.model.dtype);
      const features = new Set(manifest.model.requiredFeatures ?? []);
      if (dtypes.some((dtype) => ['fp16', 'q4f16'].includes(dtype))) features.add('shader-f16');
      for (const feature of features) {
        if (!adapter.features.has(feature)) throw new Error(`Model requires unsupported GPU feature: ${feature}`);
      }
      entry.adapter = { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '',
        isFallbackAdapter: false, requiredFeatures: [...features] };
      const library = await (libraryPromise ??= loadLibrary());
      throwIfAborted(context.signal);
      if (library.env.version !== MODEL_RUNTIME_VERSION) throw new Error('Unexpected Transformers runtime version');
      const root = new URL('/__peercompute_models/', baseUrl);
      bridge = createArtifactFetch(data.artifactPort, {
        manifest, baseUrl: new URL(`${sessionId}/`, root).href, signal: context.signal,
      });
      const { env } = library;
      // The library's error logger can dump input tensors; return bounded errors through the task instead.
      env.logLevel = 50;
      env.allowLocalModels = true;
      env.allowRemoteModels = false;
      env.localModelPath = root.pathname;
      env.useBrowserCache = false;
      env.useFSCache = false;
      env.useWasmCache = false;
      env.fetch = async (...args) => {
        try { return await bridge.fetch(...args); }
        catch (error) {
          context.emitProgress?.({ type: 'artifact-read-error', sessionId, message: error.message });
          throw error;
        }
      };
      env.backends.onnx.wasm.proxy = false;
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.wasmPaths = runtimeAssets;
      entry.gpuDispatches = 0;
      entry.gpuProfileSamples = 0;
      entry.gpuSubmissions = 0;
      entry.collectGpuEvidence = data.collectGpuEvidence === true;
      if (env.backends.onnx.webgpu) env.backends.onnx.webgpu.profiling = {
        mode: data.collectGpuEvidence === true ? 'default' : 'off',
        ondata: () => { entry.gpuProfileSamples += 1; },
      };
      const options = {
        local_files_only: true, device: 'webgpu', dtype: manifest.model.dtype,
        session_options: { executionProviders: ['webgpu'] },
        progress_callback: (progress) => {
          if (!context.signal?.aborted) context.emitProgress?.({ type: 'model-load', sessionId,
            status: String(progress.status ?? '').slice(0,40),
            file: typeof progress.file === 'string' ? progress.file.slice(0, 512) : undefined,
            loaded: Number.isFinite(progress.loaded) ? progress.loaded : undefined,
            total: Number.isFinite(progress.total) ? progress.total : undefined });
        },
      };
      entry.library = library;
      entry.components = await loadModel({ library, modelPath: sessionId, options, manifest });
      // A non-abortable ORT load can finish after cancellation. Dispose before acknowledging failure.
      throwIfAborted(context.signal);
      const runtimeDevice = await env.backends.onnx.webgpu?.device;
      entry.runtimeDevice = runtimeDevice;
      entry.runtimeFeatures = [...(runtimeDevice?.features ?? [])];
      if (entry.collectGpuEvidence && runtimeDevice) {
        // Acceptance instrumentation is confined to this ORT-owned worker/device.
        // Count actual model compute dispatches/submissions independently of timestamp-query callbacks.
        const createEncoder = runtimeDevice.createCommandEncoder.bind(runtimeDevice);
        const submit = runtimeDevice.queue.submit.bind(runtimeDevice.queue);
        const encoderDescriptor = Object.getOwnPropertyDescriptor(runtimeDevice, 'createCommandEncoder');
        const submitDescriptor = Object.getOwnPropertyDescriptor(runtimeDevice.queue, 'submit');
        entry.restoreGpuEvidence = () => {
          if (encoderDescriptor) Object.defineProperty(runtimeDevice, 'createCommandEncoder', encoderDescriptor);
          else delete runtimeDevice.createCommandEncoder;
          if (submitDescriptor) Object.defineProperty(runtimeDevice.queue, 'submit', submitDescriptor);
          else delete runtimeDevice.queue.submit;
          entry.restoreGpuEvidence = null;
        };
        runtimeDevice.createCommandEncoder = (...args) => {
          const encoder = createEncoder(...args);
          const begin = encoder.beginComputePass.bind(encoder);
          encoder.beginComputePass = (...passArgs) => {
            const pass = begin(...passArgs);
            for (const name of ['dispatchWorkgroups', 'dispatchWorkgroupsIndirect']) {
              const dispatch = pass[name].bind(pass);
              pass[name] = (...dispatchArgs) => { const result = dispatch(...dispatchArgs); entry.gpuDispatches += 1; return result; };
            }
            return pass;
          };
          return encoder;
        };
        runtimeDevice.queue.submit = (...args) => { const result = submit(...args); entry.gpuSubmissions += 1; return result; };
      }
      const runtimeInfo = runtimeDevice?.adapterInfo ?? env.backends.onnx.webgpu?.adapter?.info;
      if (runtimeInfo) {
        if (runtimeInfo.isFallbackAdapter) throw new Error('ORT selected a software GPU adapter');
        entry.runtimeAdapter = { vendor: runtimeInfo.vendor, architecture: runtimeInfo.architecture,
          isFallbackAdapter: runtimeInfo.isFallbackAdapter ?? false };
      }
      if (runtimeDevice?.lost) runtimeDevice.lost.then(() => {
        if (sessions.get(sessionId) !== entry) return;
        entry.lost = true;
        entry.active?.abort('GPU device lost');
      });
      throwIfAborted(context.signal);
      entry.status = 'ready';
      return summary(entry);
    } catch (error) {
      try {
        await disposeComponents(entry.components);
        entry.restoreGpuEvidence?.();
        sessions.delete(sessionId);
      } catch (disposeError) {
        // Keep the handle for a retry; the host must retain admission until cleanup succeeds.
        entry.status = 'ready';
        entry.lost = true;
        const failure = new Error(`MODEL_DISPOSE_FAILED: ${disposeError.message}`);
        failure.code = 'MODEL_DISPOSE_FAILED';
        throw failure;
      }
      throw error;
    } finally {
      bridge?.close();
      if (!bridge) data.artifactPort.close();
    }
  }

  async function generate(data, context) {
    const entry = sessions.get(validateSessionId(data.sessionId));
    if (!entry || entry.lost) throw new Error('Model session lost or not loaded');
    if (entry.status !== 'ready') throw new Error('Model session is busy');
    const requestId = validateSessionId(data.requestId);
    const maxNewTokens = data.maxNewTokens ?? MODEL_POLICY.maxNewTokens;
    if (!Number.isInteger(maxNewTokens) || maxNewTokens < 1 || maxNewTokens > MODEL_POLICY.maxNewTokens) {
      throw new Error('Generation exceeds its output-token budget');
    }
    let messages = normalizeModelMessages(data);
    const image = validateImageInput(data.image);
    if (image && entry.manifest.model.task !== 'image-text-to-text') throw new Error('This model does not admit image inputs');
    throwIfAborted(context.signal);
    const controller = new AbortController();
    const stop = new entry.library.InterruptableStoppingCriteria();
    const abort = () => { controller.abort(context.signal?.reason); stop.interrupt(); };
    context.signal?.addEventListener('abort', abort, { once: true });
    controller.signal.addEventListener('abort', () => stop.interrupt(), { once: true });
    entry.active = controller;
    entry.requestId = requestId;
    entry.status = 'generating';
    let inputs;
    let output;
    let sequence = 0;
    let outputBytes = 0;
    let streamFailure;
    let contextTruncated = false;
    const initialDispatches = entry.gpuDispatches ?? 0;
    const initialSubmissions = entry.gpuSubmissions ?? 0;
    try {
      throwIfAborted(context.signal);
      const { tokenizer, processor, model } = entry.components;
      let inputTokens;
      while (true) {
        throwIfAborted(controller.signal);
        let chat = messages;
        if (processor) {
          chat = messages.map((message) => ({ role: message.role, content: [{ type: 'text', text: message.content }] }));
          if (image) {
            const lastUser = chat.findLast((message) => message.role === 'user');
            if (!lastUser) throw new Error('An image requires a user message');
            lastUser.content.unshift({ type: 'image' });
          }
        }
        const prompt = (processor ?? tokenizer).apply_chat_template(chat, {
          tokenize: false, add_generation_prompt: true, enable_thinking: false,
        });
        if (typeof prompt !== 'string' || byteLength(prompt) > MODEL_POLICY.maxPromptBytes) {
          throw new Error('Templated prompt exceeds its byte budget');
        }
        if (image) {
          const raw = new entry.library.RawImage(image.data, image.width, image.height, image.channels);
          // Version 4's Idefics3 processor takes (text, images), unlike old examples.
          inputs = await processor(prompt, raw, { do_image_splitting: false });
        } else {
          inputs = await tokenizer(prompt, { truncation: false, padding: false });
        }
        throwIfAborted(controller.signal);
        inputTokens = inputs.input_ids?.dims?.at(-1);
        if (!Number.isSafeInteger(inputTokens) || inputTokens < 1) throw new Error('Invalid model input token count');
        if (inputTokens + maxNewTokens <= MODEL_POLICY.maxContextTokens) break;
        const trimmed = dropOldestTurn(messages);
        if (!trimmed) throw new Error('Latest prompt/image and system instructions exceed the context budget; shorten the prompt or request fewer output tokens');
        const discarded = inputs; inputs = undefined;
        disposeTensors(discarded);
        messages = trimmed;
        contextTruncated = true;
      }
      throwIfAborted(controller.signal);
      const streamer = new entry.library.TextStreamer(tokenizer, {
        skip_prompt: true, skip_special_tokens: true,
        callback_function: (text) => {
          if (controller.signal.aborted || streamFailure) return;
          outputBytes += byteLength(text);
          if (outputBytes > MODEL_POLICY.maxOutputBytes) {
            streamFailure = new Error('Generated text exceeded its byte budget');
            controller.abort(streamFailure);
            return;
          }
          try {
            // Callbacks are synchronous. Total output is bounded; this is not an async decode pause.
            const accepted = context.emitProgress?.({ type: 'token', sessionId: entry.sessionId,
              requestId, sequence: sequence++, text });
            if (accepted === false) throw new Error('Token consumer rejected output');
          } catch (error) { streamFailure = error; controller.abort(error); }
        },
      });
      output = await model.generate({ ...inputs, max_new_tokens: maxNewTokens,
        do_sample: false, streamer, stopping_criteria: [stop] });
      await entry.runtimeDevice?.queue.onSubmittedWorkDone();
      if (streamFailure) throw streamFailure;
      if (entry.lost) throw new Error('GPU device lost; model session is unavailable');
      throwIfAborted(controller.signal);
      const rows = output.tolist();
      if (rows.length !== 1 || rows[0].length < inputTokens || rows[0].length > inputTokens + maxNewTokens) {
        throw new Error('Model returned an over-budget token sequence');
      }
      const generated = rows[0].slice(inputTokens);
      const text = tokenizer.decode(generated, { skip_special_tokens: true });
      if (byteLength(text) > MODEL_POLICY.maxOutputBytes) throw new Error('Generated text exceeds its byte budget');
      entry.generatedRequests += 1;
      return { sessionId: entry.sessionId, requestId, text, inputTokens,
        outputTokens: generated.length, finishReason: generationFinishReason(model, generated, maxNewTokens), contextTruncated,
        workerId: entry.workerId, gpuDispatches: (entry.gpuDispatches ?? 0) - initialDispatches,
        gpuSubmissions: (entry.gpuSubmissions ?? 0) - initialSubmissions, gpuProfileSamples: entry.gpuProfileSamples ?? 0 };
    } finally {
      context.signal?.removeEventListener('abort', abort);
      try {
        const visited = new Set();
        disposeTensors(inputs, visited);
        disposeTensors(output, visited);
      } finally {
        entry.active = null;
        entry.requestId = null;
        entry.status = 'ready';
      }
    }
  }

  return async function handle(data = {}, context = {}) {
    assertWorker();
    if (data.command === 'load') return load(data, context);
    if (data.command === 'generate') return generate(data, context);
    const entry = sessions.get(validateSessionId(data.sessionId));
    if (data.command === 'status') return entry ? summary(entry) : { sessionId: data.sessionId, status: 'absent' };
    if (data.command === 'cancel') {
      if (entry?.requestId === data.requestId) entry.active?.abort('Generation cancelled');
      return { sessionId: data.sessionId, cancellationRequested: true };
    }
    if (data.command === 'unload') {
      if (!entry) return { sessionId: data.sessionId, status: 'absent' };
      if (entry.status !== 'ready') throw new Error('Cancel and await active model work before unloading');
      entry.status = 'unloading';
      try { await disposeComponents(entry.components); entry.restoreGpuEvidence?.(); }
      catch (cause) {
        entry.status = 'ready';
        entry.lost = true;
        const error = new Error(`MODEL_DISPOSE_FAILED: ${cause.message}`);
        error.code = 'MODEL_DISPOSE_FAILED';
        throw error;
      }
      sessions.delete(data.sessionId);
      return { sessionId: data.sessionId, status: 'unloaded' };
    }
    throw new Error('Unknown model task command');
  };
}

const runtime = createModelTaskRuntime();
export const handleModelTask = (data, context) => runtime(data, context);
