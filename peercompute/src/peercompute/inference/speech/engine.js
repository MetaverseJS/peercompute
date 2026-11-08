import { createArtifactFetch } from '../ArtifactReadBridge.js';
import { throwIfAborted } from '../modelManifest.js';
import { SPEECH_LIMITS } from './runtimeDefinition.js';
import { guardSpeechGpu } from './gpuGuard.js';

export async function createSpeechEngine({ manifest, sessionId, artifactPort, runtimeAssets, signal, onProgress,
  baseUrl = globalThis.location?.href, gpu = globalThis.navigator?.gpu,
  loadLibrary = () => import('@huggingface/transformers') }) {
  let device, pipeline, bridge, restoreAdapter, capture, voice, activeSignal = signal, disposed = false, lost = false;
  const evidence = { gpuDispatches: 0, gpuSubmissions: 0, generatedRequests: 0 };
  const fail = (error) => { lost = true; evidence.gpuFailure ??= String(error?.message ?? error).slice(0, 300); };
  const check = () => { throwIfAborted(activeSignal); if (lost) throw new Error(`Model session lost: ${evidence.gpuFailure ?? 'speech GPU lost'}`); };
  const handleGpuError = (event) => fail(event.error);
  const guard = (operation) => guardSpeechGpu({ getDevice: () => device, capture: (value) => { capture = value; }, operation, fail });
  async function dispose() {
    restoreAdapter?.(); restoreAdapter = null; bridge?.close(); bridge = null;
    try { await pipeline?.dispose(); pipeline = null; }
    finally { device?.removeEventListener('uncapturederror', handleGpuError); device?.destroy(); disposed = true; }
  }
  try {
    const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' }); check();
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) throw new Error('Speech requires hardware WebGPU; CPU fallback is disabled');
    evidence.adapter = { vendor: adapter.info?.vendor ?? '', architecture: adapter.info?.architecture ?? '', isFallbackAdapter: false };
    const library = await loadLibrary(); check();
    if (library.env.version !== '4.3.2') throw new Error('Unexpected speech runtime version');
    const root = new URL('/__peercompute_speech/', baseUrl);
    bridge = createArtifactFetch(artifactPort, { manifest, baseUrl: new URL(`${sessionId}/`, root).href, signal });
    const { env } = library;
    env.logLevel = 50; env.allowLocalModels = true; env.allowRemoteModels = false;
    env.useBrowserCache = false; env.useFSCache = false; env.useWasmCache = false;
    env.localModelPath = root.pathname; env.fetch = bridge.fetch;
    env.backends.onnx.wasm.proxy = false; env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.wasmPaths = runtimeAssets;
    env.backends.onnx.webgpu.adapter = adapter;
    // Native ORT may request another adapter instead of using env.webgpu.adapter.
    // Observe the actual owned worker's device creation, including that path.
    const adapterPrototype = Object.getPrototypeOf(adapter);
    const request = adapterPrototype.requestDevice;
    adapterPrototype.requestDevice = async function (...args) {
      if (this.isFallbackAdapter || this.info?.isFallbackAdapter) throw new Error('Speech cannot use a software GPU adapter');
      const actual = await request.apply(this, args); device = actual; capture?.(actual);
      evidence.runtimeFeatures = [...actual.features];
      actual.addEventListener('uncapturederror', handleGpuError);
      actual.lost.then(() => { if (!disposed) fail(new Error('Speech GPU device lost')); });
      const create = actual.createCommandEncoder.bind(actual), submit = actual.queue.submit.bind(actual.queue);
      actual.createCommandEncoder = (...params) => {
        const encoder = create(...params), begin = encoder.beginComputePass.bind(encoder);
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
      actual.queue.submit = (...values) => { const result = submit(...values); evidence.gpuSubmissions++; return result; };
      return actual;
    };
    restoreAdapter = () => { adapterPrototype.requestDevice = request; };
    await guard(async () => {
      pipeline = await library.pipeline(manifest.model.task, sessionId, {
        local_files_only: true, device: 'webgpu', dtype: 'fp32',
        session_options: { executionProviders: ['webgpu'] },
        progress_callback: (event) => onProgress?.({ type: 'speech-load', status: event.status,
          file: event.file, loaded: event.loaded, total: event.total }),
      });
    });
    restoreAdapter(); restoreAdapter = null; check();
    if ((await env.backends.onnx.webgpu.device) !== device) throw new Error('Speech did not acquire its admitted WebGPU device');
    if (manifest.model.voice) {
      const response = await bridge.fetch(new URL(`${sessionId}/${manifest.model.voice}`, root).href);
      voice = new Float32Array(await response.arrayBuffer()); check();
    }
    // Intercept actual session boundaries for cancellation and cap predicted
    // durations before Supertonic allocates latents or waveform buffers.
    for (const [name, session] of Object.entries(pipeline.model.sessions)) {
      const run = session.run.bind(session);
      session.run = async (...args) => {
        check(); const result = await run(...args);
        try {
          check();
          if (name === 'text_encoder' && result.durations) {
            for (const seconds of result.durations.data) {
              if (!Number.isFinite(seconds) || seconds <= 0 || seconds > SPEECH_LIMITS.maxOutputSeconds) {
                throw new Error('Predicted speech exceeds its duration budget');
              }
            }
          }
          return result;
        } catch (error) { for (const tensor of Object.values(result)) tensor.dispose?.(); throw error; }
      };
    }
    bridge.close(); bridge = null; activeSignal = undefined;
  } catch (error) {
    try { await dispose(); } catch (cleanup) { throw new AggregateError([error, cleanup], 'Model session lost: speech load cleanup failed'); }
    throw error;
  }
  return { evidence, get lost() { return lost; }, dispose,
    async generate(input, { signal: requestSignal, onProgress: progress } = {}) {
      if (disposed || lost) throw new Error('Model session lost: speech is unavailable');
      activeSignal = requestSignal; check();
      const before = evidence.gpuDispatches, submissions = evidence.gpuSubmissions;
      try {
        progress?.({ type: 'speech-stage', stage: input.audio ? 'transcribing' : 'speaking' });
        const output = await guard(() => input.audio
          ? pipeline(input.audio.samples, { max_new_tokens: Math.min(128, Math.max(8, Math.ceil(input.audio.samples.length / 16000) * 6)), do_sample: false })
          : pipeline(input.prompt, { speaker_embeddings: voice, num_inference_steps: 5, speed: 1.05 }));
        check();
        if (evidence.gpuDispatches <= before) throw new Error('Model session lost: speech performed no WebGPU dispatches');
        let result;
        if (input.audio) {
          if (typeof output.text !== 'string' || new TextEncoder().encode(output.text).length > SPEECH_LIMITS.maxTranscriptBytes) throw new Error('Invalid speech transcript');
          result = { text: output.text.trim() };
        } else {
          const samples = output.audio, sampleRate = output.sampling_rate;
          if (!(samples instanceof Float32Array) || sampleRate !== manifest.model.sampleRate || !samples.length
              || samples.length > sampleRate * SPEECH_LIMITS.maxOutputSeconds) throw new Error('Invalid synthesized audio duration');
          for (const value of samples) if (!Number.isFinite(value) || Math.abs(value) > 10) throw new Error('Invalid synthesized PCM');
          result = { audio: new Float32Array(samples), sampleRate };
        }
        evidence.generatedRequests++;
        return { ...result, gpuDispatches: evidence.gpuDispatches - before, gpuSubmissions: evidence.gpuSubmissions - submissions };
      } catch (error) {
        if (error instanceof WebAssembly.RuntimeError) { fail(error); throw new Error('Model session lost: speech native runtime failed', { cause: error }); }
        throw error;
      } finally { activeSignal = undefined; }
    },
  };
}
