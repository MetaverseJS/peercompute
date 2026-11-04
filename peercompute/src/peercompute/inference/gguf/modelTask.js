import { createGgufArtifactReader } from '../GgufArtifactReader.js';
import { normalizeModelMessages } from '../modelTask.js';
import { MODEL_POLICY, abortError, throwIfAborted, validateSessionId } from '../modelManifest.js';
import { createGgufEngine, GGUF_NATIVE_READ_BYTES } from './engine.js';
import { GGUF_RUNTIME_VERSION, ggufRuntimeDefinition, validateGgufCapabilities,
  validateGgufManifest, validateGgufRuntimeAssets, validateGgufRuntimeOptions } from './runtimeDefinition.js';

const byteLength = (text) => new TextEncoder().encode(text).byteLength;
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
    const options = validateGgufRuntimeOptions(data.runtimeOptions);
    const sessionId = validateSessionId(data.sessionId);
    throwIfAborted(context.signal);
    const current = { sessionId, manifestCid: data.manifestCid, workerId: context.workerId ?? null,
      manifest: validated.manifest, status: 'loading', options, generatedRequests: 0,
      residency: new AbortController(), lost: false };
    entry = current;
    try {
      current.capabilities = await checkCapabilities();
      throwIfAborted(context.signal);
      current.reader = createReader(data.artifactPort, { manifest: validated.manifest,
        signal: current.residency.signal, maxReadBytes: GGUF_NATIVE_READ_BYTES, maxReads: 1 });
      current.engine = await loadEngine({ wasmUrl: assets.wasm, weights: validated.weights,
        reader: current.reader, signal: context.signal, collectGpuEvidence: data.collectGpuEvidence === true,
        onProgress: (event) => context.emitProgress?.({ ...event, sessionId }),
        onLost() { current.lost = true; current.active?.abort('GPU device lost'); },
      });
      throwIfAborted(context.signal);
      const response = await current.engine.action('load', {
        _name: 'load_req', model_paths: current.engine.files.map((file) => `models/${file.name}`),
        use_mmap: false, use_mlock: false, n_ctx_auto: false, ...options,
        n_ubatch: Math.min(64, options.n_batch), n_parallel: 1, kv_unified: true,
        log_level: 2, warmup: false, ctx_shift: false, cache_idle_slots: false,
        reasoning: false, jinja: true,
      }, context.signal);
      if (!response.success) throw new Error('GGUF native model load failed');
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
    const maxNewTokens = data.maxNewTokens ?? MODEL_POLICY.maxNewTokens;
    ggufRuntimeDefinition.validateGenerationInput({ ...data, maxNewTokens });
    const messages = normalizeModelMessages(data);
    const controller = new AbortController();
    const abort = () => controller.abort(context.signal?.reason);
    context.signal?.addEventListener('abort', abort, { once: true });
    if (context.signal?.aborted) abort();
    current.active = controller; current.status = 'generating'; current.requestId = requestId;
    const dispatches = current.engine.evidence.dispatches;
    const submissions = current.engine.evidence.submissions;
    let nativeRequest;
    let completed = false;
    let text = '', sequence = 0, inputTokens = null, outputTokens = null, finishReason = 'unknown';
    try {
      const started = await current.engine.action('completion', { _name: 'cmpl_req', is_chat: true,
        data_json: JSON.stringify({ messages, stream: true, max_tokens: maxNewTokens,
          temperature: 0, cache_prompt: false, chat_template_kwargs: { enable_thinking: false } }), files: [],
      }, controller.signal);
      if (!started.success || !Number.isInteger(started.req_id)) throw new Error('GGUF failed to start generation');
      nativeRequest = started.req_id;
      throwIfAborted(controller.signal);
      for (let poll = 0; poll < 4096; poll += 1) {
        throwIfAborted(controller.signal);
        const response = await current.engine.action('get_result', { _name: 'gres_req', req_id: nativeRequest }, controller.signal);
        throwIfAborted(controller.signal);
        if (!response.success || response.is_error) throw new Error('GGUF generation failed or exceeded the context budget; shorten the conversation or request fewer output tokens');
        if (response.data_json && response.data_json !== 'null') {
          if (byteLength(response.data_json) > 1024 * 1024) throw new Error('GGUF result exceeds its byte budget');
          const parsed = JSON.parse(response.data_json);
          for (const chunk of Array.isArray(parsed) ? parsed : [parsed]) {
            const nativeReason = chunk.choices?.[0]?.finish_reason ?? chunk.finish_reason;
            if (nativeReason != null) finishReason = ['stop', 'length'].includes(nativeReason) ? nativeReason : 'unknown';
            const delta = chunk.choices?.[0]?.delta?.content ?? chunk.content ?? '';
            if (typeof delta !== 'string') throw new Error('Invalid GGUF text chunk');
            text += delta;
            if (byteLength(text) > MODEL_POLICY.maxOutputBytes) throw new Error('GGUF output exceeds its byte budget');
            if (delta && context.emitProgress?.({ type: 'token', sessionId: current.sessionId,
              requestId, sequence: sequence++, text: delta }) === false) throw new Error('Token consumer rejected output');
            inputTokens = chunk.usage?.prompt_tokens ?? chunk.timings?.prompt_n ?? inputTokens;
            outputTokens = chunk.usage?.completion_tokens ?? chunk.timings?.predicted_n ?? outputTokens;
          }
        }
        if (!response.has_more) { completed = true; break; }
        // Yield a task turn so manager cancellation can reach this owned worker.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      if (!completed) throw new Error('GGUF result polling exceeded its request budget');
      await current.engine.settleGpu();
      throwIfAborted(controller.signal);
      if (current.lost) throw new Error('GPU device lost; model session is unavailable');
      if (outputTokens !== null && (!Number.isSafeInteger(outputTokens) || outputTokens > maxNewTokens)) {
        throw new Error('GGUF returned an over-budget token sequence');
      }
      current.generatedRequests += 1;
      return { sessionId: current.sessionId, requestId, text, inputTokens, outputTokens,
        finishReason, contextTruncated: false,
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
      try {
        if (!completed && nativeRequest !== undefined && !current.lost) {
          await current.engine.action('cancel', { _name: 'cncl_req', req_id: nativeRequest });
        }
      } catch (error) { current.lost = true; throw new Error(`Model session lost during GGUF cancellation: ${error.message}`); }
      finally { current.active = null; current.requestId = null; current.status = current.lost ? 'lost' : 'ready'; }
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
