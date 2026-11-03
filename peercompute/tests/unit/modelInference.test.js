import assert from 'node:assert/strict';
import test from 'node:test';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { createArtifactFetch, serveArtifactPort } from '../../src/peercompute/inference/ArtifactReadBridge.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { createModelTaskRuntime, validateImageInput } from '../../src/peercompute/inference/modelTask.js';
import { MODEL_POLICY, validateModelManifest } from '../../src/peercompute/inference/modelManifest.js';
import { MODEL_CATALOG, modelFileUrl } from '../../src/peercompute/inference/modelCatalog.js';
import { loadInferenceRelayConfig } from '../../../demos/inference/src/relayConfig.js';

const origin = 'https://peercompute.test/';
const assets = { mjs: `${origin}nested/assets/ort.mjs`, wasm: `${origin}nested/assets/ort.wasm` };
const cid = CID.createV1(0x55, await sha256.digest(new Uint8Array([1, 2, 3]))).toString();
const digest = 'a'.repeat(64);

function manifest({ dtype = 'q4', vision = false } = {}) {
  const suffix = (type) => type === 'fp32' ? '' : type === 'q8' ? '_quantized' : `_${type}`;
  const files = ['config.json', 'tokenizer.json', 'tokenizer_config.json'];
  if (vision) {
    files.push('processor_config.json', 'preprocessor_config.json');
    for (const name of ['embed_tokens', 'vision_encoder', 'decoder_model_merged']) {
      files.push(`onnx/${name}${suffix(typeof dtype === 'string' ? dtype : dtype[name])}.onnx`);
    }
  } else files.push(`onnx/model${suffix(dtype)}.onnx`);
  return { schema: 'peercompute.artifact.manifest.v1',
    files: files.map((path) => ({ path, cid, size: 16, sha256: digest })),
    model: { runtime: 'transformers.js', runtimeVersion: '4.3.2',
      architecture: vision ? 'idefics3' : 'qwen3', dtype,
      task: vision ? 'image-text-to-text' : 'text-generation' } };
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function storeFor(modelManifest = manifest(), overrides = {}) {
  return {
    getManifest: async () => modelManifest,
    stat: async () => ({ cid, size: 16, sha256: digest, status: 'complete' }),
    async *openRead(_cid, { signal } = {}) {
      if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
      yield new Uint8Array(16).fill(7);
    },
    ...overrides,
  };
}

function fakeLibrary() {
  return {
    env: { version: '4.3.2', backends: { onnx: { wasm: {}, webgpu: {} } } },
    InterruptableStoppingCriteria: class {
      interrupt() { this.interrupted = true; }
      reset() { this.interrupted = false; }
    },
    TextStreamer: class { constructor(_tokenizer, options) { this.options = options; } },
    RawImage: class {
      constructor(data, width, height, channels) { Object.assign(this, { data, width, height, channels }); }
    },
  };
}

function fakeComponents({ inputTokens = 2, generate, vision = false, events = [] } = {}) {
  const tensors = [];
  const tokenizer = Object.assign(() => {
    const tensor = { dims: [1, inputTokens], dispose() { events.push('inputs-disposed'); } };
    tensors.push(tensor);
    return { input_ids: tensor };
  }, {
    apply_chat_template(messages) {
      events.push('template');
      return messages.map((message) => typeof message.content === 'string'
        ? message.content : message.content.map((part) => part.text ?? '<image>').join('')).join('\n');
    },
    decode: () => 'hello',
    dispose() { events.push('tokenizer-disposed'); },
  });
  const output = () => ({ tolist: () => [[...Array(inputTokens).fill(1n), 2n]],
    dispose() { events.push('output-disposed'); } });
  const model = {
    async generate(options) {
      events.push('generate');
      if (generate) return generate(options, output);
      options.streamer.options.callback_function('hello');
      return output();
    },
    async dispose() { events.push('model-disposed'); },
  };
  const processor = vision ? Object.assign(async (text, image, options) => {
    events.push({ text, image, options });
    return { ...tokenizer(text), pixel_values: { dispose() { events.push('pixels-disposed'); } } };
  }, { tokenizer, apply_chat_template: tokenizer.apply_chat_template,
    dispose() { events.push('processor-disposed'); } }) : undefined;
  return { model, tokenizer, processor, tensors };
}

function runtimeFor({ components = fakeComponents(), library = fakeLibrary(), loadModel,
  features = [], fallback = false, adapter = true } = {}) {
  const calls = [];
  const runtime = createModelTaskRuntime({ assertWorker() {}, baseUrl: `${origin}worker.js`,
    gpu: { async requestAdapter() { return adapter ? {
      info: { vendor: 'test-hardware', architecture: 'test', isFallbackAdapter: fallback }, features: new Set(features),
    } : null; } },
    loadLibrary: async () => library,
    loadModel: loadModel ?? (async (options) => { calls.push(options); return components; }),
  });
  return { runtime, library, components, calls };
}

async function loadRuntime(fixture, modelManifest = manifest(), context = {}, extra = {}) {
  const { port1, port2 } = new MessageChannel();
  const server = serveArtifactPort(port1, { store: storeFor(modelManifest), manifest: modelManifest });
  try {
    return await fixture.runtime({ command: 'load', sessionId: 'test-session', manifestCid: cid,
      manifest: modelManifest, artifactPort: port2, runtimeAssets: assets, ...extra }, { workerId: 7, ...context });
  } finally { await server.close(); }
}

test('model manifest admits explicit Qwen and per-module image dtypes, rejects ambiguous packages', () => {
  assert.equal(validateModelManifest(manifest()).totalBytes, 64);
  const multimodal = manifest({ vision: true, dtype: { embed_tokens: 'q4', vision_encoder: 'fp32', decoder_model_merged: 'q4' } });
  assert.equal(validateModelManifest(multimodal).manifest.model.task, 'image-text-to-text');
  for (const path of ['../config.json', '/config.json', 'a/../config.json', 'a\\config.json', 'a%2fconfig.json']) {
    const bad = manifest(); bad.files[0].path = path;
    assert.throws(() => validateModelManifest(bad), /path/);
  }
  const duplicate = manifest(); duplicate.files.push(duplicate.files[0]);
  assert.throws(() => validateModelManifest(duplicate), /Duplicate/);
  const missing = manifest(); missing.files.pop();
  assert.throws(() => validateModelManifest(missing), /Incomplete/);
  const corrupt = manifest(); corrupt.files[0].sha256 = 'git-blob-oid';
  assert.throws(() => validateModelManifest(corrupt), /digest/);
  const oversized = manifest(); oversized.files[0].size = MODEL_POLICY.maxModelBytes + 1;
  assert.throws(() => validateModelManifest(oversized), /budget/);
});

test('artifact bridge uses pull credits, bounds chunks, and never fetches unlisted paths', async () => {
  const modelManifest = manifest();
  let reads = 0;
  const store = storeFor(modelManifest, { async *openRead() {
    for (let i = 0; i < 4; i += 1) { reads += 1; yield new Uint8Array(4).fill(i); }
  } });
  const { port1, port2 } = new MessageChannel();
  const server = serveArtifactPort(port1, { store, manifest: modelManifest, chunkBytes: 4 });
  const client = createArtifactFetch(port2, { manifest: modelManifest, baseUrl: `${origin}models/test/`, chunkBytes: 4 });
  try {
    const response = await client.fetch('/models/test/config.json');
    await nextTurn();
    assert.equal(reads, 0, 'no source read before response consumption');
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3]);
    assert.equal(server.getStats().deliveredBytes, 16);
    assert.equal((await client.fetch('/models/test/not-listed.json')).status, 404);
    for (const url of ['https://elsewhere.test/config.json', '/models/test/a/../config.json',
      '/models/test/%2e%2e/config.json', '/models/test/config.json?download=1']) {
      await assert.rejects(client.fetch(url), /artifact|manifest/i);
    }
  } finally { client.close(); await server.close(); }
});

test('artifact bridge rejects incomplete storage and oversized or truncated chunks', async () => {
  for (const overrides of [
    { stat: async () => ({ size: 16, status: 'partial' }) },
    { async *openRead() { yield new Uint8Array(MODEL_POLICY.chunkBytes + 1); } },
    { async *openRead() { yield new Uint8Array(3); } },
  ]) {
    const modelManifest = manifest();
    const { port1, port2 } = new MessageChannel();
    const server = serveArtifactPort(port1, { store: storeFor(modelManifest, overrides), manifest: modelManifest });
    const client = createArtifactFetch(port2, { manifest: modelManifest, baseUrl: `${origin}models/test/` });
    try {
      await assert.rejects(async () => (await client.fetch('/models/test/config.json')).arrayBuffer(),
        /incomplete|bounds|Truncated/);
    } finally { client.close(); await server.close(); }
  }
});

test('aborting an in-flight artifact read aborts the source and releases its read lease', async () => {
  const started = deferred();
  const stopped = deferred();
  const controller = new AbortController();
  const modelManifest = manifest();
  const store = storeFor(modelManifest, { async *openRead(_cid, { signal }) {
    try {
      started.resolve();
      await new Promise((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('stop', 'AbortError')), { once: true }));
    } finally { stopped.resolve(); }
  } });
  const { port1, port2 } = new MessageChannel();
  const server = serveArtifactPort(port1, { store, manifest: modelManifest });
  const client = createArtifactFetch(port2, { manifest: modelManifest, baseUrl: `${origin}models/test/`, signal: controller.signal });
  try {
    const response = await client.fetch('/models/test/config.json');
    const reading = response.arrayBuffer();
    await started.promise;
    controller.abort('test cancellation');
    await assert.rejects(reading, { name: 'AbortError' });
    await stopped.promise;
    assert.equal(server.getStats().activeReads, 0);
  } finally { client.close(); await server.close(); }
});

test('worker loader pins runtime assets and GPU provider without a CPU fallback', async () => {
  const fixture = runtimeFor();
  const loaded = await loadRuntime(fixture);
  assert.equal(loaded.workerId, 7);
  assert.equal(loaded.adapter.isFallbackAdapter, false);
  assert.deepEqual(fixture.calls[0].options.session_options.executionProviders, ['webgpu']);
  assert.equal(fixture.calls[0].options.device, 'webgpu');
  assert.equal(fixture.library.env.allowRemoteModels, false);
  assert.equal(fixture.library.env.useWasmCache, false);
  assert.equal(fixture.library.env.backends.onnx.wasm.proxy, false);
  assert.equal(fixture.library.env.backends.onnx.wasm.numThreads, 1);
  assert.deepEqual(fixture.library.env.backends.onnx.wasm.wasmPaths, assets);
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
  for (const options of [{ adapter: false }, { fallback: true }]) {
    await assert.rejects(loadRuntime(runtimeFor(options)), /hardware WebGPU/);
  }
  await assert.rejects(loadRuntime(runtimeFor(), manifest({ dtype: 'q4f16' })), /shader-f16/);
  const half = runtimeFor({ features: ['shader-f16'] });
  await loadRuntime(half, manifest({ dtype: 'q4f16' }));
  await half.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('cancelled late model loading disposes the eventual session before reporting cancellation', async () => {
  const gate = deferred();
  const started = deferred();
  const events = [];
  const controller = new AbortController();
  const components = fakeComponents({ events });
  const fixture = runtimeFor({ loadModel: async () => { started.resolve(); await gate.promise; return components; } });
  const loading = loadRuntime(fixture, manifest(), { signal: controller.signal });
  await started.promise;
  controller.abort();
  let finished = false;
  void loading.catch(() => { finished = true; });
  await nextTurn();
  assert.equal(finished, false);
  gate.resolve();
  await assert.rejects(loading, { name: 'AbortError' });
  assert.deepEqual(events, ['model-disposed', 'tokenizer-disposed']);
  assert.equal((await fixture.runtime({ command: 'status', sessionId: 'test-session' })).status, 'absent');
});

test('resident generation reuses loaded sessions, bounds tokens, and emits ordered private text', async () => {
  const events = [];
  const fixture = runtimeFor({ components: fakeComponents({ events }) });
  await loadRuntime(fixture);
  const progress = [];
  for (const requestId of ['first', 'second']) {
    const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId,
      prompt: 'private prompt', maxNewTokens: 10 }, { emitProgress: (event) => progress.push(event) });
    assert.equal(result.text, 'hello');
    assert.equal(result.inputTokens, 2);
    assert.equal(result.outputTokens, 1);
  }
  assert.equal(fixture.calls.length, 1);
  assert.deepEqual(progress.map((event) => event.sequence), [0, 0]);
  assert.ok(progress.every((event) => !JSON.stringify(event).includes('private prompt')));
  assert.equal(events.filter((event) => event === 'inputs-disposed').length, 2);
  await assert.rejects(fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'over',
    prompt: 'x', maxNewTokens: MODEL_POLICY.maxNewTokens + 1 }), /output-token/);
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('context and output byte budgets fail closed and release input/output tensors', async () => {
  const events = [];
  const context = runtimeFor({ components: fakeComponents({ inputTokens: 2048, events }) });
  await loadRuntime(context);
  await assert.rejects(context.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'too-long', prompt: 'x' }), /context budget/);
  assert.ok(events.includes('inputs-disposed'));
  assert.ok(!events.includes('generate'));
  await context.runtime({ command: 'unload', sessionId: 'test-session' });
  let interrupted = false;
  const overflow = runtimeFor({ components: fakeComponents({ generate: async (options, output) => {
    options.streamer.options.callback_function('x'.repeat(MODEL_POLICY.maxOutputBytes + 1));
    interrupted = options.stopping_criteria[0].interrupted;
    return output();
  } }) });
  await loadRuntime(overflow);
  await assert.rejects(overflow.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'overflow', prompt: 'x' }), /byte budget/);
  assert.equal(interrupted, true);
  await overflow.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('generation cancellation awaits the model and keeps a reusable resident session', async () => {
  const gate = deferred();
  const started = deferred();
  let criteria;
  const controller = new AbortController();
  const fixture = runtimeFor({ components: fakeComponents({ generate: async (options, output) => {
    criteria = options.stopping_criteria[0]; started.resolve(); await gate.promise; return output();
  } }) });
  await loadRuntime(fixture);
  const generating = fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'cancel', prompt: 'x' },
    { signal: controller.signal });
  await started.promise;
  controller.abort();
  assert.equal(criteria.interrupted, true);
  let finished = false;
  void generating.catch(() => { finished = true; });
  await nextTurn();
  assert.equal(finished, false);
  gate.resolve();
  await assert.rejects(generating, { name: 'AbortError' });
  assert.equal((await fixture.runtime({ command: 'status', sessionId: 'test-session' })).status, 'ready');
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('multimodal generation passes bounded RGBA to the processor and disposes processor tensors', async () => {
  const events = [];
  const fixture = runtimeFor({ components: fakeComponents({ vision: true, events }) });
  await loadRuntime(fixture, manifest({ vision: true }));
  const image = { data: new Uint8Array(4 * 8 * 8), width: 8, height: 8, channels: 4 };
  const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'image',
    prompt: 'Describe this scene', image, maxNewTokens: 20 });
  assert.equal(result.text, 'hello');
  const call = events.find((event) => typeof event === 'object');
  assert.equal(call.text, '<image>Describe this scene');
  assert.equal(call.image.width, 8);
  assert.equal(call.options.do_image_splitting, false);
  assert.ok(events.includes('pixels-disposed'));
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
  assert.ok(events.includes('processor-disposed'));
  assert.throws(() => validateImageInput({ url: 'https://elsewhere.test/image.png' }), /RGBA/);
  assert.throws(() => validateImageInput({ ...image, width: 2048, height: 2048 }), /RGBA/);
  const text = runtimeFor(); await loadRuntime(text);
  await assert.rejects(text.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'no-images', prompt: 'x', image }), /does not admit image/);
  await text.runtime({ command: 'unload', sessionId: 'test-session' });
});

function serviceFor({ fixture = runtimeFor(), modelManifest = manifest(), events = [] } = {}) {
  const submissions = [];
  const running = new Map();
  const computeManager = {
    async reserveWorkerAffinity(key) { events.push(`reserve:${key}`); },
    async releaseWorkerAffinity(key) { events.push(`release:${key}`); },
    async terminateWorkerAffinity(key) { events.push(`terminate:${key}`); },
    submitTask(task) {
      submissions.push(task);
      assert.equal(task.requireWorker, true);
      const promise = fixture.runtime(task.data, { signal: task.signal, emitProgress: task.onProgress, workerId: 17 });
      running.set(task.id, promise);
      void promise.finally(() => running.delete(task.id)).catch(() => {});
      return promise;
    },
    async cancelTask(id) { await running.get(id)?.catch(() => {}); },
  };
  const service = new ModelInferenceService({ computeManager, artifactStore: storeFor(modelManifest),
    admission: { async acquire() { events.push('admit'); return { async release() { events.push('release-admission'); } }; } },
    runtimeAssets: assets, resourceEstimate: { cpuBytes: 1024, gpuBytes: 1024 }, baseUrl: origin });
  return { service, fixture, submissions, computeManager };
}

test('host service holds admission and affinity through residency and acknowledges disposal before release', async () => {
  const events = [];
  const fixture = runtimeFor({ components: fakeComponents({ events }) });
  const { service, submissions } = serviceFor({ fixture, events });
  await service.loadModel({ sessionId: 'resident', manifestCid: cid });
  assert.equal(service.getStatus().status, 'ready');
  assert.ok(!events.includes('release-admission'));
  const result = await service.generate({ requestId: 'once', prompt: 'x', maxNewTokens: 5 });
  assert.equal(result.workerId, 17);
  assert.ok(!events.includes('release-admission'));
  await service.unloadModel();
  assert.ok(events.indexOf('model-disposed') < events.indexOf('release-admission'));
  assert.ok(events.indexOf('release-admission') < events.indexOf('release:model:resident'));
  assert.ok(submissions.every((task) => task.affinityKey === 'model:resident'));
  assert.equal(submissions[0].transferables.length, 1);
  assert.equal(service.getStatus().status, 'idle');
});

test('host service bounds its queue and cancels queued work without dispatch', async () => {
  const started = deferred();
  const gate = deferred();
  const fixture = runtimeFor({ components: fakeComponents({ generate: async (_options, output) => {
    started.resolve(); await gate.promise; return output();
  } }) });
  const { service, submissions } = serviceFor({ fixture });
  await service.loadModel({ sessionId: 'queue', manifestCid: cid });
  const active = service.generate({ requestId: 'active', prompt: 'x' });
  await started.promise;
  const queued = Array.from({ length: 4 }, (_, index) => service.generate({ requestId: `queued-${index}`, prompt: 'x' }));
  const outcomes = queued.map((promise) => promise.catch((error) => error));
  await assert.rejects(service.generate({ requestId: 'over-limit', prompt: 'x' }), /queue is full/);
  for (let index = 0; index < 4; index += 1) await service.cancel(`queued-${index}`);
  assert.ok((await Promise.all(outcomes)).every((error) => error.name === 'AbortError'));
  assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 1);
  gate.resolve();
  await active;
  await service.dispose();
});

test('host cancellation releases a late load only after worker cleanup acknowledges', async () => {
  const started = deferred();
  const gate = deferred();
  const events = [];
  const components = fakeComponents({ events });
  const fixture = runtimeFor({ loadModel: async () => { started.resolve(); await gate.promise; return components; } });
  const { service } = serviceFor({ fixture, events });
  const controller = new AbortController();
  const loading = service.loadModel({ sessionId: 'late', manifestCid: cid, signal: controller.signal });
  await started.promise;
  controller.abort();
  void loading.catch(() => {});
  await nextTurn();
  assert.ok(!events.includes('release-admission'));
  gate.resolve();
  await assert.rejects(loading, { name: 'AbortError' });
  assert.ok(events.indexOf('model-disposed') < events.indexOf('release-admission'));
  assert.ok(events.indexOf('terminate:model:late') < events.indexOf('release-admission'));
  assert.equal(service.getStatus().status, 'idle');
});

test('default loader selects causal versus image-text model classes and cleans failed component loads', async () => {
  for (const vision of [false, true]) {
    const events = [];
    const components = fakeComponents({ vision, events });
    const library = fakeLibrary();
    library.AutoConfig = { async from_pretrained() { return { model_type: vision ? 'idefics3' : 'qwen3' }; } };
    library.AutoTokenizer = { async from_pretrained() { events.push('load-tokenizer'); return components.tokenizer; } };
    library.AutoProcessor = { async from_pretrained() { events.push('load-processor'); return components.processor; } };
    library.AutoModelForCausalLM = { async from_pretrained() { events.push('load-causal'); return components.model; } };
    library.AutoModelForImageTextToText = { async from_pretrained() { events.push('load-image-text'); return components.model; } };
    const runtime = createModelTaskRuntime({ loadLibrary: async () => library,
      assertWorker() {}, baseUrl: origin,
      gpu: { async requestAdapter() { return { features: new Set(), info: { isFallbackAdapter: false } }; } },
    });
    await loadRuntime({ runtime }, manifest({ vision }));
    assert.ok(events.includes(vision ? 'load-image-text' : 'load-causal'));
    assert.ok(!events.includes(vision ? 'load-causal' : 'load-image-text'));
    await runtime({ command: 'unload', sessionId: 'test-session' });
  }
  const events = [];
  const components = fakeComponents({ vision: true, events });
  const library = fakeLibrary();
  library.AutoConfig = { async from_pretrained() { return { model_type: 'idefics3' }; } };
  library.AutoProcessor = { async from_pretrained() { return components.processor; } };
  library.AutoModelForImageTextToText = { async from_pretrained() { throw new Error('Partial load failure'); } };
  const runtime = createModelTaskRuntime({ loadLibrary: async () => library, assertWorker() {}, baseUrl: origin,
    gpu: { async requestAdapter() { return { features: new Set(), info: { isFallbackAdapter: false } }; } },
  });
  await assert.rejects(loadRuntime({ runtime }, manifest({ vision: true })), /Partial load failure/);
  assert.ok(events.includes('processor-disposed'));
  assert.ok(events.includes('tokenizer-disposed'));
  library.AutoConfig = { async from_pretrained() { return { model_type: 'unapproved' }; } };
  events.length = 0;
  await assert.rejects(loadRuntime({ runtime }, manifest({ vision: true })), /config architecture/);
  assert.deepEqual(events, []);
});

test('multimodal image-token context expansion is checked after preprocessing', async () => {
  const events = [];
  const fixture = runtimeFor({ components: fakeComponents({ vision: true, inputTokens: 2040, events }) });
  await loadRuntime(fixture, manifest({ vision: true }));
  await assert.rejects(fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'expanded',
    prompt: 'x', image: { data: new Uint8Array(4), width: 1, height: 1, channels: 4 }, maxNewTokens: 20 }), /context budget/);
  assert.ok(events.includes('pixels-disposed'));
  assert.ok(!events.includes('generate'));
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('owned worker loss invalidates residency and rejects queued requests before releasing admission', async () => {
  const fixture = runtimeFor();
  const events = [];
  const { service, computeManager } = serviceFor({ fixture, events });
  await service.loadModel({ sessionId: 'lost', manifestCid: cid });
  const gate = deferred();
  computeManager.submitTask = async () => {
    await gate.promise;
    const error = new Error('Worker terminated'); error.workerTerminated = true; throw error;
  };
  const active = service.generate({ requestId: 'lost-active', prompt: 'x' });
  const queued = service.generate({ requestId: 'lost-queued', prompt: 'x' });
  const rejected = assert.rejects(queued, { name: 'AbortError' });
  gate.resolve();
  await assert.rejects(active, /Worker terminated/);
  await rejected;
  assert.equal(service.getStatus().status, 'idle');
  assert.ok(events.includes('release-admission'));
  // The fake manager cannot kill a real realm; dispose its injected runtime explicitly.
  await fixture.runtime({ command: 'unload', sessionId: 'lost' });
});

test('partial loader failure waits for owned-worker termination before releasing resident admission', async () => {
  const events = [];
  const stop = deferred();
  const started = deferred();
  const fixture = runtimeFor({ loadModel: async () => { throw new Error('Partial ORT allocation failure'); } });
  const { service, computeManager } = serviceFor({ fixture, events });
  computeManager.terminateWorkerAffinity = async () => { started.resolve(); await stop.promise; events.push('stopped'); };
  const loading = service.loadModel({ sessionId: 'partial', manifestCid: cid });
  const rejected = assert.rejects(loading, /Partial ORT allocation failure/);
  await started.promise;
  assert.ok(!events.includes('release-admission'));
  stop.resolve();
  await rejected;
  assert.ok(events.indexOf('stopped') < events.indexOf('release-admission'));
  assert.equal(service.getStatus().status, 'idle');
});

test('failed worker termination quarantines admission until explicit cleanup retry succeeds', async () => {
  const events = [];
  const fixture = runtimeFor({ loadModel: async () => { throw new Error('Partial load'); } });
  const { service, computeManager } = serviceFor({ fixture, events });
  computeManager.terminateWorkerAffinity = async () => { throw new Error('Cannot acknowledge worker stop'); };
  await assert.rejects(service.loadModel({ sessionId: 'quarantine', manifestCid: cid }), /cleanup is incomplete/);
  assert.equal(service.getStatus().status, 'cleanup-failed');
  assert.ok(!events.includes('release-admission'));
  assert.ok(!events.includes('release:model:quarantine'));
  computeManager.terminateWorkerAffinity = async () => { events.push('stop-ack'); };
  await service.unloadModel();
  assert.ok(events.indexOf('stop-ack') < events.indexOf('release-admission'));
  assert.equal(service.getStatus().status, 'idle');
});

test('host image transfer owns a bounded copy and rejects invalid requests before dispatch', async () => {
  const fixture = runtimeFor({ components: fakeComponents({ vision: true }) });
  const { service, submissions } = serviceFor({ fixture, modelManifest: manifest({ vision: true }) });
  await service.loadModel({ sessionId: 'image-host', manifestCid: cid });
  const pixels = new Uint8Array([1, 2, 3, 255]);
  await service.generate({ requestId: 'image-copy', prompt: 'x', image: { data: pixels, width: 1, height: 1, channels: 4 } });
  const task = submissions.find((submission) => submission.data.command === 'generate');
  assert.notEqual(task.data.image.data.buffer, pixels.buffer);
  assert.deepEqual(task.transferables, [task.data.image.data.buffer]);
  const count = submissions.length;
  await assert.rejects(service.generate({ prompt: 'x'.repeat(MODEL_POLICY.maxPromptBytes + 1) }), /byte budget/);
  await assert.rejects(service.generate({ prompt: 'x', maxNewTokens: 10000 }), /output-token budget/);
  assert.equal(submissions.length, count);
  await service.dispose();
});

test('artifact client enforces concurrent-reader limits and checks stored file digests', async () => {
  const modelManifest = manifest();
  const { port1, port2 } = new MessageChannel();
  const server = serveArtifactPort(port1, { store: storeFor(modelManifest), manifest: modelManifest });
  const client = createArtifactFetch(port2, { manifest: modelManifest, baseUrl: `${origin}models/test/`, maxReads: 1, maxQueuedReads: 0 });
  try {
    const response = await client.fetch('/models/test/config.json');
    const reader = response.body.getReader(); await reader.read();
    await assert.rejects((await client.fetch('/models/test/tokenizer.json')).arrayBuffer(), /reader limit/);
    await reader.cancel();
    const another = await client.fetch('/models/test/tokenizer.json');
    await another.arrayBuffer();
  } finally { client.close(); await server.close(); }
  const channel = new MessageChannel();
  const mismatchServer = serveArtifactPort(channel.port1, { manifest: modelManifest,
    store: storeFor(modelManifest, { stat: async () => ({ size: 16, status: 'complete', sha256: 'b'.repeat(64) }) }) });
  const mismatchClient = createArtifactFetch(channel.port2, { manifest: modelManifest, baseUrl: `${origin}models/test/` });
  try { await assert.rejects((await mismatchClient.fetch('/models/test/config.json')).arrayBuffer(), /incomplete/); }
  finally { mismatchClient.close(); await mismatchServer.close(); }
});

test('catalog pins complete selected model variants and distinguishes Git blobs from file digests', () => {
  assert.equal(Object.keys(MODEL_CATALOG).length, 4);
  assert.equal(MODEL_CATALOG['qwen3-0.6b-q4'].weightBytes, 919096585);
  assert.equal(MODEL_CATALOG['smolvlm-256m-q4'].weightBytes, 263889326);
  assert.equal(MODEL_CATALOG['smolvlm-500m-q4'].weightBytes, 485088765);
  assert.equal(MODEL_CATALOG['qwen3.5-2b-q4'].weightBytes, 1752031835);
  for (const entry of Object.values(MODEL_CATALOG)) {
    assert.match(entry.revision, /^[a-f0-9]{40}$/);
    assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
    assert.equal(entry.license.spdx, 'Apache-2.0');
    assert.ok(Object.isFrozen(entry.model));
    const packageManifest = { schema: 'peercompute.artifact.manifest.v1', model: entry.model,
      files: entry.files.map((file) => ({ ...file, cid, sha256: file.sha256 ?? digest })) };
    validateModelManifest(packageManifest);
    for (const file of entry.files) {
      assert.ok(file.sha256 ? /^[a-f0-9]{64}$/.test(file.sha256) : /^[a-f0-9]{40}$/.test(file.gitBlobSha1));
      assert.ok(modelFileUrl(entry.id, file.path).includes(`/resolve/${entry.revision}/`));
      assert.ok(!file.path.endsWith('.safetensors'));
    }
    assert.throws(() => modelFileUrl(entry.id, '../missing'), /Unknown/);
  }
});

test('artifact client queues concurrent config probes and aborts queued reads without occupying credits', async () => {
  const modelManifest = manifest();
  const channel = new MessageChannel();
  const server = serveArtifactPort(channel.port1, { manifest: modelManifest, store: storeFor(modelManifest), maxReads: 1 });
  const client = createArtifactFetch(channel.port2, { manifest: modelManifest, baseUrl: `${origin}models/test/`, maxReads: 1 });
  try {
    const first = await client.fetch('/models/test/config.json');
    const reader = first.body.getReader(); await reader.read();
    const abort = new AbortController();
    const aborted = (await client.fetch('/models/test/tokenizer.json', { signal: abort.signal })).arrayBuffer();
    const next = (await client.fetch('/models/test/tokenizer_config.json')).arrayBuffer();
    abort.abort();
    await assert.rejects(aborted, { name: 'AbortError' });
    assert.equal(server.getStats().activeReads, 1);
    await reader.read();
    assert.equal((await next).byteLength, 16);
    assert.equal(server.getStats().activeReads, 0);
  } finally { client.close(); await server.close(); }
});

test('failed generation termination quarantines residency and prevents further dispatch until retry', async () => {
  const events = [];
  const { service, computeManager } = serviceFor({ events });
  await service.loadModel({ sessionId: 'termination-failed', manifestCid: cid });
  const submit = computeManager.submitTask;
  computeManager.submitTask = (task) => task.data.command === 'generate'
    ? Promise.reject(Object.assign(new Error('Owned worker stop failed'), { code: 'ERR_COMPUTE_WORKER_TERMINATION_FAILED', workerTerminated: false }))
    : submit(task);
  const terminate = computeManager.terminateWorkerAffinity;
  computeManager.terminateWorkerAffinity = async () => { throw new Error('Stop still failing'); };
  await assert.rejects(service.generate({ prompt: 'x' }), /cleanup failed/);
  assert.equal(service.getStatus().status, 'cleanup-failed');
  assert.ok(!events.includes('release-admission'));
  await assert.rejects(service.generate({ prompt: 'x' }), /not ready/);
  computeManager.terminateWorkerAffinity = terminate;
  await service.unloadModel();
  assert.ok(events.includes('release-admission'));
});

test('revoked admission rejects queued generation without freeing resident capacity', async () => {
  const events = [];
  const { service, submissions } = serviceFor({ events });
  let calls = 0;
  service.admission.acquire = async () => ({
    assertActive() { calls += 1; if (calls > 1) throw new Error('Residency was revoked'); },
    release() { events.push('release-admission'); },
  });
  await service.loadModel({ sessionId: 'revoked', manifestCid: cid });
  await assert.rejects(service.generate({ prompt: 'x' }), /revoked/);
  assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 0);
  assert.ok(!events.includes('release-admission'));
  await service.unloadModel();
  assert.ok(events.includes('release-admission'));
});

test('overlapping panel and manager disposal dispatch one unload and release one residency', async () => {
  const events = [];
  const gate = deferred();
  const components = fakeComponents({ events });
  components.model.dispose = async () => { events.push('disposing'); await gate.promise; };
  const { service, submissions } = serviceFor({ events, fixture: runtimeFor({ components }) });
  await service.loadModel({ sessionId: 'shared-dispose', manifestCid: cid });
  const one = service.dispose();
  const two = service.dispose();
  assert.equal(submissions.filter((task) => task.data.command === 'unload').length, 1);
  gate.resolve();
  await Promise.all([one, two]);
  assert.equal(events.filter((event) => event === 'release-admission').length, 1);
});

test('unused metadata responses allocate no host read slots and do not prevent body loading', async () => {
  const modelManifest = manifest();
  const channel = new MessageChannel();
  const server = serveArtifactPort(channel.port1, { manifest: modelManifest, store: storeFor(modelManifest), maxReads: 1 });
  const client = createArtifactFetch(channel.port2, { manifest: modelManifest, baseUrl: `${origin}models/test/`, maxReads: 1 });
  try {
    const probes = await Promise.all(Array.from({ length: 16 }, () => client.fetch('/models/test/config.json')));
    assert.ok(probes.every((response) => response.headers.get('Content-Length') === '16'));
    assert.equal(server.getStats().activeReads, 0);
    assert.equal((await (await client.fetch('/models/test/tokenizer.json')).arrayBuffer()).byteLength, 16);
    assert.equal(server.getStats().activeReads, 0);
  } finally { client.close(); await server.close(); }
});

test('opt-in hardware evidence counts each request and restores the owned device methods on unload', async () => {
  const library = fakeLibrary();
  const device = {
    features: new Set(['timestamp-query']),
    queue: { submit() {}, async onSubmittedWorkDone() {} },
    createCommandEncoder() {
      return { beginComputePass: () => ({ dispatchWorkgroups() {}, dispatchWorkgroupsIndirect() {} }) };
    },
  };
  const originalEncoder = device.createCommandEncoder;
  const originalSubmit = device.queue.submit;
  library.env.backends.onnx.webgpu.device = device;
  const fixture = runtimeFor({ library, components: fakeComponents({ generate: async (_options, output) => {
    device.createCommandEncoder().beginComputePass().dispatchWorkgroups(1);
    device.queue.submit([]);
    return output();
  } }) });
  await loadRuntime(fixture, manifest(), {}, { collectGpuEvidence: true });
  for (const requestId of ['first', 'second']) {
    const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId, prompt: 'x' });
    assert.equal(result.gpuDispatches, 1); assert.equal(result.gpuSubmissions, 1);
  }
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
  assert.equal(device.createCommandEncoder, originalEncoder);
  assert.equal(device.queue.submit, originalSubmit);
});

function qwen35Manifest() {
  const entry = MODEL_CATALOG['qwen3.5-2b-q4'];
  return { schema: 'peercompute.artifact.manifest.v1', model: entry.model,
    files: entry.files.map((file) => ({ path: file.path, cid, size: file.size, sha256: file.sha256 ?? digest })) };
}

test('Qwen3.5 admits its complete external-data q4 closure with a separate package budget', () => {
  const modelManifest = qwen35Manifest();
  const validated = validateModelManifest(modelManifest);
  assert.equal(validated.totalBytes, 1771280684);
  assert.equal(validated.resourcePolicy.minimumGpuBytes, 8 * 1024 ** 3);
  assert.ok(validated.totalBytes > MODEL_POLICY.maxModelBytes);
  const missing = structuredClone(modelManifest);
  missing.files = missing.files.filter((file) => !file.path.endsWith('embed_tokens_q4.onnx_data'));
  assert.throws(() => validateModelManifest(missing), /Incomplete/);
  const wrongVariant = structuredClone(modelManifest); wrongVariant.model.dtype = 'q4f16';
  assert.throws(() => validateModelManifest(wrongVariant), /q4 language/);
  const oversized = structuredClone(modelManifest); oversized.files[0].size = 2 * 1024 ** 3;
  assert.throws(() => validateModelManifest(oversized), /file budget/);
});

test('Qwen3.5 host admission rejects small envelopes before reserving or loading a worker', async () => {
  const events = [];
  const { service, submissions } = serviceFor({ events, modelManifest: qwen35Manifest() });
  await assert.rejects(service.loadModel({ manifestCid: cid }), /envelope of at least 8589934592/);
  assert.equal(submissions.length, 0);
  assert.equal(events.length, 0);
});

test('Qwen3.5 loader preserves Python normalization defaults and caps processor expansion', async () => {
 const { Qwen2VLImageProcessor, RawImage } = await import('@huggingface/transformers');
 for (const normalize of [undefined, false, true]) {
  const library = fakeLibrary();
  const components = fakeComponents({ vision: true });
  components.processor.image_processor = new Qwen2VLImageProcessor({
    size: { shortest_edge: 65536, longest_edge: 16777216 }, patch_size: 16,
    temporal_patch_size: 2, merge_size: 2, image_mean: [0.5, 0.5, 0.5],
    image_std: [0.5, 0.5, 0.5], do_normalize: normalize,
  });
  library.AutoConfig = { async from_pretrained() { return { model_type: 'qwen3_5' }; } };
  library.AutoProcessor = { async from_pretrained() { return components.processor; } };
  let options;
  library.AutoModelForImageTextToText = { async from_pretrained(_path, value) { options = value; return components.model; } };
  const runtime = createModelTaskRuntime({ loadLibrary: async () => library, assertWorker() {}, baseUrl: origin,
    gpu: { async requestAdapter() { return { features: new Set(), info: { isFallbackAdapter: false } }; } } });
  await loadRuntime({ runtime }, qwen35Manifest());
  assert.equal(options.use_external_data_format, 1);
  assert.equal(components.processor.image_processor.max_pixels, 512 * 512);
  assert.equal(components.processor.image_processor.do_normalize, normalize ?? true);
  for (const rgb of [[255, 0, 0], [0, 0, 255]]) {
    const rgba = new Uint8Array(256 * 256 * 4);
    for (let offset = 0; offset < rgba.length; offset += 4) rgba.set([...rgb, 255], offset);
    const tensors = await components.processor.image_processor(new RawImage(rgba, 256, 256, 4));
    assert.deepEqual(tensors.pixel_values.dims, [256, 1536]);
    assert.deepEqual(tensors.image_grid_thw.tolist(), [[1n, 16n, 16n]]);
    assert.deepEqual([0, 512, 1024].map((offset) => tensors.pixel_values.data[offset]),
      rgb.map((value) => value === 255 ? 1 : normalize === false ? 0 : -1));
    tensors.pixel_values.dispose(); tensors.image_grid_thw.dispose();
  }
  assert.equal(library.env.logLevel, 50);
  await runtime({ command: 'unload', sessionId: 'test-session' });
 }
});

test('standalone relay configuration preserves secure WSS and rejects unapproved configuration origins', async () => {
  const address = '/dns4/secretworkshop.net/tcp/443/wss/p2p/example';
  const fetchImpl = async (url) => new Response(JSON.stringify(url.includes('source')
    ? { relayConfigUrl: 'https://secretworkshop.net/peercompute/config/relay-config.json' }
    : { bootstrapPeers: [address], pubsubType: 'gossipsub' }));
  const config = await loadInferenceRelayConfig({ fetchImpl, baseUrl: 'http://localhost/inference/' });
  assert.deepEqual(config.bootstrapPeers, [address]);
  await assert.rejects(loadInferenceRelayConfig({ baseUrl: origin,
    fetchImpl: async () => new Response(JSON.stringify({ relayConfigUrl: 'https://unapproved.test/config.json' })) }), /approved/);
  await assert.rejects(loadInferenceRelayConfig({ baseUrl: origin, fetchImpl: async () => new Response(' '.repeat(70 * 1024)) }), /byte limit/);
});
