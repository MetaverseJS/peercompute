import { createGgufArtifactReader } from '../GgufArtifactReader.js';
import { MODEL_POLICY, abortError, throwIfAborted, validateSessionId } from '../modelManifest.js';
import { createGgufEngine, GGUF_NATIVE_READ_BYTES } from './engine.js';
import { verifyGgufHubWeights } from './hubAdmission.js';
import { fitGgufContext, GGUF_MEASUREMENT_TOKEN_BUDGET } from './contextBudget.js';
import { encodeGgufMedia, projectGgufMedia } from './mediaInput.js';
import { GGUF_CONTEXT_LIMIT, GGUF_RUNTIME_VERSION, validateGgufCapabilities,
  normalizeGgufGenerationInput, validateGgufManifest, validateGgufRuntimeAssets, validateGgufRuntimeOptions } from './runtimeDefinition.js';

const byteLength = (text) => new TextEncoder().encode(text).byteLength;
function resultChunks(response) {
  if (!response.data_json || response.data_json === 'null') return [];
  if (typeof response.data_json !== 'string' || byteLength(response.data_json) > 1024 * 1024) {
    throw new Error('GGUF result exceeds its byte budget');
  }
  let parsed;
  try { parsed = JSON.parse(response.data_json); }
  catch { throw new Error('GGUF returned invalid result JSON'); }
  const chunks = Array.isArray(parsed) ? parsed : [parsed];
  if (chunks.some((chunk) => !chunk || typeof chunk !== 'object' || Array.isArray(chunk))) {
    throw new Error('GGUF returned invalid result data');
  }
  return chunks;
}

function nativeFailure(chunks, contextTokens) {
  const body = chunks[0], detail = body?.error ?? body;
  // Native error messages may contain prompts. Expose only a known category and
  // validated counts, never the native message or serialized response.
  const inputTokens = detail?.n_prompt_tokens ?? body?.n_prompt_tokens;
  const limit = detail?.n_ctx ?? body?.n_ctx;
  if (detail?.type === 'exceed_context_size_error' && Number.isSafeInteger(inputTokens) && inputTokens >= limit
      && Number.isSafeInteger(limit) && limit > 0 && limit <= contextTokens) {
    return Object.assign(new Error('GGUF native prompt exceeds the model context'),
      { code: 'ERR_GGUF_NATIVE_CONTEXT', inputTokens, contextTokens: limit });
  }
  const invalidInput = detail?.type === 'invalid_request_error';
  return Object.assign(new Error(invalidInput ? 'GGUF rejected the inference request' : 'GGUF native inference failed'),
    { code: invalidInput ? 'ERR_GGUF_NATIVE_INPUT' : 'ERR_GGUF_NATIVE_FAILURE' });
}
function requireManagedWorker() {
  if (typeof WorkerGlobalScope === 'undefined' || !(globalThis instanceof WorkerGlobalScope)) {
    throw new Error('GGUF inference requires a ComputeManager-owned worker');
  }
}

function status(entry) {
  return { sessionId: entry.sessionId, manifestCid: entry.manifestCid, status: entry.lost ? 'lost' : entry.status,
    runtime: 'llama.cpp', runtimeVersion: GGUF_RUNTIME_VERSION, task: 'text-generation',
    workerId: entry.workerId, adapter: entry.capabilities?.adapter,
    runtimeAdapter: entry.engine?.evidence.runtimeAdapter ?? null,
    runtimeFeatures: entry.engine?.evidence.runtimeFeatures ?? [],
    gpuDispatches: entry.engine?.evidence.dispatches ?? 0, gpuSubmissions: entry.engine?.evidence.submissions ?? 0,
    gpuOffload: entry.engine?.evidence.offload ?? null, runtimeOptions: entry.options,
    effectiveContextTokens: entry.contextTokens ?? null,
    inputModalities: entry.inputModalities ?? ['text'],
    nativeBuffers: entry.engine?.evidence.buffers ?? [],
    wasmMemoryBytes: entry.engine?.memoryBytes() ?? 0, generatedRequests: entry.generatedRequests,
    artifactReads: entry.reader?.getStats() ?? null };
}

export function createGgufTaskRuntime({ loadEngine = createGgufEngine,
  createReader = createGgufArtifactReader, checkCapabilities = validateGgufCapabilities,
  assertWorker = requireManagedWorker, baseUrl = globalThis.location?.href } = {}) {
  let entry;
  async function load(data, context) {
    if (entry) throw new Error('GGUF worker already has a resident model');
    const validated = validateGgufManifest(data.manifest);
    const assets = validateGgufRuntimeAssets(data.runtimeAssets, baseUrl);
    const options = validateGgufRuntimeOptions(data.runtimeOptions, validated.mediaProfile);
    const sessionId = validateSessionId(data.sessionId);
    throwIfAborted(context.signal);
    const current = { sessionId, manifestCid: data.manifestCid, workerId: context.workerId ?? null,
      manifest: validated.manifest, mediaProfile: validated.mediaProfile, status: 'loading', options, generatedRequests: 0,
      residency: new AbortController(), lost: false };
    entry = current;
    try {
      current.capabilities = await checkCapabilities();
      throwIfAborted(context.signal);
      current.reader = createReader(data.artifactPort, { manifest: validated.manifest,
        signal: current.residency.signal, maxReadBytes: GGUF_NATIVE_READ_BYTES, maxReads: 1 });
      await verifyGgufHubWeights(validated.manifest.model, validated.weights, current.reader, { signal: context.signal });
      throwIfAborted(context.signal);
      current.engine = await loadEngine({ wasmUrl: assets.wasm, weights: validated.weights, projector: validated.projector,
        reader: current.reader, signal: context.signal, collectGpuEvidence: data.collectGpuEvidence === true,
        onProgress: (event) => context.emitProgress?.({ ...event, sessionId }),
        onLost() { current.lost = true; current.active?.abort('GPU device lost'); },
      });
      throwIfAborted(context.signal);
      if (validated.mediaProfile && !current.engine.projectorFile) throw new Error('GGUF projector was not mounted');
      const response = await current.engine.action('load', {
        _name: 'load_req', model_paths: current.engine.files.map((file) => `models/${file.name}`),
        use_mmap: false, use_mlock: false, n_ctx_auto: false, ...options,
        n_ubatch: validated.mediaProfile?.batchTokens ?? Math.min(64, options.n_batch), n_parallel: 1, kv_unified: true,
        ...(validated.mediaProfile ? { mmproj_path: `models/${current.engine.projectorFile.name}`, mmproj_offload: true,
          image_min_tokens: validated.mediaProfile.imageMinTokens, image_max_tokens: validated.mediaProfile.imageMaxTokens } : {}),
        log_level: 2, warmup: false, ctx_shift: false, cache_idle_slots: false,
        reasoning: false, jinja: true,
      }, context.signal);
      if (!response.success) throw new Error('GGUF native model load failed');
      // Native contexts may be padded; use the actual bounded allocation rather
      // than assuming the requested size was honored exactly.
      if (!Number.isSafeInteger(response.n_ctx) || response.n_ctx < 1 || response.n_ctx > GGUF_CONTEXT_LIMIT) {
        throw new Error('GGUF native model returned an invalid context capacity');
      }
      current.contextTokens = response.n_ctx;
      if (validated.mediaProfile) {
        if (response.has_image_input !== true || response.has_audio_input !== true
            || response.n_batch !== validated.mediaProfile.batchTokens || response.n_ubatch !== validated.mediaProfile.batchTokens
            || typeof response.media_marker !== 'string' || !/^<[^\s<>]{1,126}>$/.test(response.media_marker)) {
          throw new Error('GGUF native runtime did not confirm the required image/audio projector and batch profile');
        }
        current.mediaMarker = response.media_marker;
        current.inputModalities = ['text', 'image', 'audio'];
      }
      const offload = current.engine.evidence.offload;
      if (!offload || offload.gpuLayers < 1 || offload.gpuLayers !== Math.min(options.n_gpu_layers, offload.totalLayers)) {
        throw new Error('GGUF did not honor the explicitly configured GPU layer offload');
      }
      throwIfAborted(context.signal);
      if (current.lost) throw new Error('GPU device lost during GGUF load');
      current.status = 'ready';
      return status(current);
    } catch (error) {
      if (current.engine) context.emitProgress?.({ type: 'model-load-memory', sessionId,
        wasmMemoryBytes: current.engine.memoryBytes(), nativeBuffers: current.engine.evidence.buffers ?? [] });
      current.lost = true; current.status = 'lost';
      current.residency.abort(error);
      current.reader?.close(error);
      current.engine?.close();
      // Host termination must acknowledge release of the whole native realm.
      throw error;
    }
  }

  async function generate(data, context) {
    const current = entry;
    if (!current || current.sessionId !== validateSessionId(data.sessionId) || current.lost) {
      throw new Error('Model session lost or not loaded');
    }
    if (current.status !== 'ready') throw new Error('GGUF model session is busy');
    const requestId = validateSessionId(data.requestId);
    const normalized = normalizeGgufGenerationInput(data, current.manifest);
    const { messages, maxNewTokens } = normalized;
    throwIfAborted(context.signal);
    const mediaFiles = encodeGgufMedia(normalized);
    throwIfAborted(context.signal);
    projectGgufMedia(messages, mediaFiles, current.mediaMarker);
    const controller = new AbortController();
    const abort = () => controller.abort(context.signal?.reason);
    context.signal?.addEventListener('abort', abort, { once: true });
    if (context.signal?.aborted) abort();
    current.active = controller; current.status = 'generating'; current.requestId = requestId;
    const dispatches = current.engine.evidence.dispatches;
    const submissions = current.engine.evidence.submissions;
    let sequence = 0;
    async function complete(projected, measureOnly) {
      let nativeRequest, completed = false;
      let text = '', inputTokens = null, outputTokens = null, finishReason = 'unknown', measuredBytes = 0;
      try {
        throwIfAborted(controller.signal);
        const nativeInput = projectGgufMedia(projected, mediaFiles, current.mediaMarker);
        const started = await current.engine.action('completion', { _name: 'cmpl_req', is_chat: true,
          data_json: JSON.stringify({ messages: nativeInput.messages, stream: !measureOnly,
            max_tokens: measureOnly ? GGUF_MEASUREMENT_TOKEN_BUDGET : maxNewTokens,
            temperature: 0, cache_prompt: false, chat_template_kwargs: { enable_thinking: false } }), files: nativeInput.files,
        }, controller.signal);
        if (!started.success || !Number.isSafeInteger(started.req_id) || started.req_id < 0) throw new Error('GGUF failed to start generation');
        nativeRequest = started.req_id;
        throwIfAborted(controller.signal);
        for (let poll = 0; poll < 4096; poll += 1) {
          throwIfAborted(controller.signal);
          const response = await current.engine.action('get_result', { _name: 'gres_req', req_id: nativeRequest }, controller.signal);
          throwIfAborted(controller.signal);
          const chunks = resultChunks(response);
          if (!response.success || response.is_error) throw nativeFailure(chunks, current.contextTokens);
          for (const chunk of chunks) {
            const nativeReason = chunk.choices?.[0]?.finish_reason ?? chunk.finish_reason;
            if (nativeReason != null) finishReason = ['stop', 'length'].includes(nativeReason) ? nativeReason : 'unknown';
            const choice = chunk.choices?.[0];
            const delta = choice?.delta?.content ?? choice?.message?.content ?? chunk.content ?? '';
            if (typeof delta !== 'string') throw new Error('Invalid GGUF text chunk');
            if (measureOnly) {
              const reasoning = choice?.delta?.reasoning_content ?? choice?.message?.reasoning_content ?? '';
              if (typeof reasoning !== 'string') throw new Error('Invalid GGUF measurement result');
              measuredBytes += byteLength(delta) + byteLength(reasoning);
              if (measuredBytes > MODEL_POLICY.maxOutputBytes) throw new Error('GGUF measurement exceeds its byte budget');
              // Never retain, emit, cache or use this sampled text as an answer.
            } else {
              text += delta;
              if (byteLength(text) > MODEL_POLICY.maxOutputBytes) throw new Error('GGUF output exceeds its byte budget');
              if (delta && context.emitProgress?.({ type: 'token', sessionId: current.sessionId,
                requestId, sequence: sequence++, text: delta }) === false) throw new Error('Token consumer rejected output');
            }
            inputTokens = chunk.usage?.prompt_tokens ?? chunk.timings?.prompt_n ?? inputTokens;
            outputTokens = chunk.usage?.completion_tokens ?? chunk.timings?.predicted_n ?? outputTokens;
          }
          if (!response.has_more) { completed = true; break; }
          // Yield a task turn so manager cancellation can reach this owned worker.
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
        if (!completed) throw new Error('GGUF result polling exceeded its request budget');
        if (outputTokens !== null && (!Number.isSafeInteger(outputTokens) || outputTokens < 0
            || outputTokens > (measureOnly ? GGUF_MEASUREMENT_TOKEN_BUDGET : maxNewTokens))) {
          throw new Error('GGUF returned an over-budget token sequence');
        }
        if (measureOnly && (!Number.isSafeInteger(inputTokens) || inputTokens < 0 || outputTokens === null)) {
          throw new Error('GGUF context preflight did not return valid token usage');
        }
        return { text, inputTokens, outputTokens, finishReason };
      } catch (error) {
        if (error?.name === 'RuntimeError' || /Model session lost|GPU device lost/.test(error?.message ?? '')) current.lost = true;
        throw error;
      } finally {
        if (nativeRequest !== undefined && !current.lost) {
          try {
            if (!completed) await current.engine.action('cancel', { _name: 'cncl_req', req_id: nativeRequest });
            // A request is not reusable until native cancellation and GPU work
            // have both settled, even when its caller has already cancelled.
            await current.engine.settleGpu();
          } catch {
            current.lost = true;
            throw new Error('Model session lost while settling GGUF inference');
          }
        }
      }
    }
    try {
      const fitted = await fitGgufContext({ messages, contextTokens: current.contextTokens,
        reservedOutputTokens: maxNewTokens, signal: controller.signal,
        async measure(projected) {
          try {
            const measured = await complete(projected, true);
            return { inputTokens: measured.inputTokens, contextTokens: current.contextTokens, probeOutputTokens: measured.outputTokens };
          } catch (error) {
            if (error.code !== 'ERR_GGUF_NATIVE_CONTEXT') throw error;
            return { inputTokens: error.inputTokens, contextTokens: error.contextTokens, probeOutputTokens: 0 };
          }
        },
        onMeasured: (budget) => context.emitProgress?.({ type: 'context-budget', sessionId: current.sessionId, requestId, ...budget }),
      });
      throwIfAborted(controller.signal);
      const result = await complete(fitted.messages, false);
      throwIfAborted(controller.signal);
      if (current.lost) throw new Error('GPU device lost; model session is unavailable');
      current.generatedRequests += 1;
      return { sessionId: current.sessionId, requestId, ...result,
        contextTruncated: fitted.contextTruncated, contextBudget: fitted.contextBudget,
        workerId: current.workerId, gpuDispatches: current.engine.evidence.dispatches - dispatches,
        gpuSubmissions: current.engine.evidence.submissions - submissions,
        gpuOffload: current.engine.evidence.offload, artifactReads: current.reader.getStats() };
    } catch (error) {
      if (error?.name === 'RuntimeError') {
        current.lost = true;
        throw new Error(`Model session lost: GGUF native trap: ${String(error.message).slice(0, 300)}`);
      }
      if (/Model session lost|GPU device lost/.test(error.message ?? '')) current.lost = true;
      throw error;
    } finally {
      context.signal?.removeEventListener('abort', abort);
      current.active = null; current.requestId = null; current.status = current.lost ? 'lost' : 'ready';
    }
  }

  return async (data = {}, context = {}) => {
    assertWorker();
    if (data.command === 'load') return load(data, context);
    if (data.command === 'generate') return generate(data, context);
    const sessionId = validateSessionId(data.sessionId);
    if (data.command === 'status') return entry?.sessionId === sessionId ? status(entry) : { sessionId, status: 'absent' };
    if (!entry || entry.sessionId !== sessionId) throw new Error('Model session lost or not loaded');
    if (data.command === 'cancel') {
      if (entry.requestId === data.requestId) entry.active?.abort(abortError());
      return { sessionId, cancellationRequested: true };
    }
    if (data.command === 'unload') {
      if (entry.status === 'generating') throw new Error('Cancel and await GGUF generation before unloading');
      entry.residency.abort('GGUF unload'); entry.reader?.close(); entry.engine?.close(); entry = null;
      return { sessionId, status: 'unloaded', requiresWorkerTermination: true };
    }
    throw new Error('Unknown GGUF inference command');
  };
}

const runtime = createGgufTaskRuntime();
export const handleModelTask = (data, context) => runtime(data, context);
