import assert from 'node:assert/strict';
import test from 'node:test';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { createArtifactFetch, serveArtifactPort } from '../../src/peercompute/inference/ArtifactReadBridge.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
import { ResidentModelRegistry } from '../../src/peercompute/inference/ResidentModelRegistry.js';
import { ResidentModelAdmission } from '../../src/peercompute/serviceOrchestration/ResidentModelAdmission.js';
import { ResourceLeaseBroker } from '../../src/peercompute/serviceOrchestration/ResourceLeaseBroker.js';
import { createModelTaskRuntime, validateImageInput } from '../../src/peercompute/inference/modelTask.js';
import { MODEL_POLICY, validateModelManifest } from '../../src/peercompute/inference/modelManifest.js';
import { onnxMemoryProfile } from '../../src/peercompute/inference/modelCapabilities.js';
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

function fakeGpuDevice() {
  const listeners = new Set(), scopes = [];
  return { features: new Set(), lost: new Promise(() => {}),
    queue: { async onSubmittedWorkDone() {} }, destroy() {},
    pushErrorScope(filter) { scopes.push(filter); },
    async popErrorScope() { assert.ok(scopes.pop()); return null; },
    addEventListener(type, listener) { assert.equal(type, 'uncapturederror'); listeners.add(listener); },
    removeEventListener(type, listener) { assert.equal(type, 'uncapturederror'); listeners.delete(listener); } };
}

function fakeAdapter(library, features = [], fallback = false) {
  return { info: { vendor: 'test-hardware', architecture: 'test', isFallbackAdapter: fallback }, features: new Set(features),
    limits: { maxBindGroups: 4, maxComputeWorkgroupStorageSize: 32768, maxComputeWorkgroupsPerDimension: 65535,
      maxStorageBuffersPerShaderStage: 16, maxStorageBufferBindingSize: 2 ** 31, maxBufferSize: 2 ** 32,
      maxComputeInvocationsPerWorkgroup: 1024, maxComputeWorkgroupSizeX: 1024, maxComputeWorkgroupSizeY: 1024, maxComputeWorkgroupSizeZ: 64 },
    async requestDevice() { return library.env.backends.onnx.webgpu.device; } };
}

function fakeLibrary() {
  return {
    env: { version: '4.3.2', backends: { onnx: { wasm: {}, webgpu: { device: fakeGpuDevice() } } } },
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

function fakeComponents({ inputTokens = 2, outputTokens = [2n], config, generationConfig, generate, vision = false, events = [] } = {}) {
  const tensors = [];
  let lastInputTokens;
  const tokenizer = Object.assign((text) => {
    lastInputTokens = typeof inputTokens === 'function' ? inputTokens(text) : inputTokens;
    const tensor = { dims: [1, lastInputTokens], dispose() { events.push('inputs-disposed'); } };
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
  const output = () => ({ tolist: () => [[...Array(lastInputTokens).fill(1n), ...outputTokens]],
    dispose() { events.push('output-disposed'); } });
  const model = {
    config, generation_config: generationConfig,
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
  for (const feature of features) library.env.backends.onnx.webgpu.device?.features.add(feature);
  const runtime = createModelTaskRuntime({ assertWorker() {}, baseUrl: `${origin}worker.js`,
    gpu: { async requestAdapter() { return adapter ? fakeAdapter(library, features, fallback) : null; } },
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
  assert.deepEqual(fixture.calls[0].options.session_options.executionProviders, [{ name: 'webgpu', device: fixture.library.env.backends.onnx.webgpu.device }]);
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

test('long benign replies use the larger bounded output allowance and retain a natural stop', async () => {
  const explanation = ('Plants use sunlight, water and carbon dioxide to make sugars. ' +
    'Roots absorb water, leaves exchange gases, and chlorophyll captures light. ').repeat(16) + 'That completes the explanation.';
  const components = fakeComponents({ outputTokens: [...Array(400).fill(4n), 9n], generationConfig: { eos_token_id: [8, 9] },
    generate(options, output) {
      assert.equal(options.max_new_tokens, 1024);
      options.streamer.options.callback_function(explanation);
      return output();
    } });
  components.tokenizer.decode = () => explanation;
  const fixture = runtimeFor({ components }); await loadRuntime(fixture);
  let streamed = '';
  const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'long-answer',
    prompt: 'Explain how plants make food in several paragraphs.' }, { emitProgress(event) { streamed += event.text; } });
  assert.equal(result.text, explanation); assert.equal(streamed, explanation);
  assert.equal(result.outputTokens, 401); assert.equal(result.finishReason, 'stop');
  assert.equal(result.contextTruncated, false);
  assert.equal(MODEL_POLICY.maxContextTokens, 2048); assert.equal(MODEL_POLICY.maxOutputBytes, 64 * 1024);
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('ONNX distinguishes EOS at the exact limit, length, and an unverified early ending', async () => {
  for (const [outputTokens, config, generationConfig, expected] of [
    [[4n, 9n], { eos_token_id: 1 }, { eos_token_id: [8, 9] }, 'stop'],
    [[4n, 7n], { eos_token_id: 1, text_config: { eos_token_id: 7 } }, undefined, 'stop'],
    [[4n, 7n], { eos_token_id: 7 }, { eos_token_id: 9 }, 'length'],
    [[4n, 5n], undefined, undefined, 'length'],
    [[4n], { eos_token_id: 9 }, undefined, 'unknown'],
  ]) {
    const fixture = runtimeFor({ components: fakeComponents({ outputTokens, config, generationConfig }) });
    await loadRuntime(fixture);
    const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'finish',
      prompt: 'Explain a seed.', maxNewTokens: 2 });
    assert.equal(result.finishReason, expected);
    await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
  }
});

test('token-aware history trimming preserves instructions and latest turn, then frees discarded tensors', async () => {
  const events = [], prompts = [];
  const messages = [
    { role: 'system', content: 'Explain clearly.' },
    { role: 'user', content: 'OLDER_QUESTION about seeds.' },
    { role: 'assistant', content: 'OLDER_ANSWER about seed shells.' },
    { role: 'user', content: 'RECENT_QUESTION about roots.' },
    { role: 'assistant', content: 'RECENT_ANSWER about absorbing water.' },
    { role: 'user', content: 'Explain how leaves capture sunlight.' },
  ];
  const original = structuredClone(messages);
  const components = fakeComponents({ events, inputTokens(text) {
    prompts.push(text); return text.includes('OLDER_QUESTION') ? 1200 : 900;
  }, generate(options, output) {
    assert.equal(events.filter((event) => event === 'inputs-disposed').length, 1);
    assert.equal(options.input_ids.dims[1], 900); return output();
  } });
  const fixture = runtimeFor({ components }); await loadRuntime(fixture);
  const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'history', messages });
  assert.equal(result.contextTruncated, true); assert.equal(result.inputTokens, 900);
  assert.equal(prompts.length, 2); assert.doesNotMatch(prompts[1], /OLDER_/);
  assert.match(prompts[1], /Explain clearly/); assert.match(prompts[1], /RECENT_QUESTION.*\nRECENT_ANSWER/);
  assert.match(prompts[1], /leaves capture sunlight/); assert.deepEqual(messages, original);
  assert.equal(events.filter((event) => event === 'inputs-disposed').length, 2);
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('history trimming accounts for image tokens and keeps the image on the latest user turn', async () => {
  const events = [];
  const components = fakeComponents({ events, vision: true, inputTokens: (text) => text.includes('older') ? 1500 : 1000 });
  const fixture = runtimeFor({ components }); await loadRuntime(fixture, manifest({ vision: true }));
  const result = await fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'image-history',
    messages: [{ role: 'user', content: 'older question' }, { role: 'assistant', content: 'older answer' },
      { role: 'user', content: 'Describe this leaf.' }], image: { data: new Uint8Array(4), width: 1, height: 1, channels: 4 } });
  assert.equal(result.contextTruncated, true);
  const calls = events.filter((event) => typeof event === 'object');
  assert.equal(calls.length, 2); assert.equal(calls[1].text, '<image>Describe this leaf.');
  assert.equal(events.filter((event) => event === 'pixels-disposed').length, 2);
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
});

test('token fitting preserves unanswered observation data and the latest image prompt, or rejects before generation', async () => {
  const messages = [{ role: 'system', content: 'Your identity.' },
    { role: 'user', content: 'older question' }, { role: 'assistant', content: 'older answer' },
    { role: 'user', content: 'Current attributed world observation data.' }, { role: 'user', content: 'Describe this leaf.' }];
  const original = structuredClone(messages);
  for (const fits of [true, false]) {
    const events = [], components = fakeComponents({ events, vision: true,
      inputTokens: text => fits && !text.includes('older') ? 1000 : 1800 });
    const fixture = runtimeFor({ components }); await loadRuntime(fixture, manifest({ vision: true }));
    const work = fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: `world-data-${fits}`,
      messages, image: { data: new Uint8Array(4), width: 1, height: 1, channels: 4 } });
    if (fits) { const result = await work; assert.equal(result.contextTruncated, true); }
    else { await assert.rejects(work, /context budget/); assert.equal(events.includes('generate'), false); }
    const processed = events.filter(event => typeof event === 'object');
    assert.equal(processed.length, 2, 'Only one complete answered historical turn can be removed');
    assert.equal(processed.at(-1).text, 'Your identity.\nCurrent attributed world observation data.\n<image>Describe this leaf.');
    assert.deepEqual(messages, original);
    await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
  }
});

test('an oversized latest prompt remains an explicit error after bounded history trimming', async () => {
  const events = [];
  const fixture = runtimeFor({ components: fakeComponents({ events, inputTokens: 1800 }) });
  await loadRuntime(fixture);
  await assert.rejects(fixture.runtime({ command: 'generate', sessionId: 'test-session', requestId: 'latest-too-long',
    messages: [{ role: 'system', content: 'Explain carefully.' }, { role: 'user', content: 'Old question.' },
      { role: 'assistant', content: 'Old answer.' }, { role: 'user', content: 'Explain the complete plant life cycle.' }] }),
  /Latest prompt\/image and system instructions exceed the context budget/);
  assert.equal(events.filter((event) => event === 'inputs-disposed').length, 2);
  assert.equal(events.includes('generate'), false);
  await fixture.runtime({ command: 'unload', sessionId: 'test-session' });
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
  let reserved = false, workerId = null;
  const computeManager = {
    async reserveWorkerAffinity(key) { events.push(`reserve:${key}`); reserved = true; workerId = 17; },
    getWorkerAffinityState(affinityKey) { return { affinityKey, reserved, workerId }; },
    async releaseWorkerAffinity(key) { events.push(`release:${key}`); reserved = false; workerId = null; },
    async terminateWorkerAffinity(key) { events.push(`terminate:${key}`); workerId = null; },
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

test('managed resident survives a long load and idle clock jumps without renewal or reloading', async () => {
  let now = 1000;
  const broker = new ResourceLeaseBroker({ now: () => now,
    capacities: { cpu: { units: 1, memoryBytes: 2048 }, gpu: { units: 1, memoryBytes: 2048 } } });
  const { service, submissions, computeManager } = serviceFor();
  service.admission = new ResidentModelAdmission({ broker });
  const submit = computeManager.submitTask;
  computeManager.submitTask = async (task) => {
    const result = await submit(task);
    if (task.data.command === 'load') { now += 90_000; broker.expireLeases(); }
    return result;
  };
  await service.loadModel({ sessionId: 'long-lived', manifestCid: cid });
  assert.equal(service.getStatus().status, 'ready');
  for (let index = 0; index < 2; index++) {
    now += 24 * 60 * 60_000;
    assert.deepEqual(broker.expireLeases(), []);
    assert.equal(service.getStatus().status, 'ready');
    const result = await service.generate({ prompt: 'Hello', maxNewTokens: 5 });
    assert.equal(result.workerId, 17);
    assert.equal(broker.reportPressure().pools.gpu.activeMemoryBytes, 1024);
    await assert.rejects(broker.requestLease({ kind: 'gpu' }), /quota exceeded/);
  }
  assert.equal(submissions.filter((task) => task.data.command === 'load').length, 1);
  await service.unloadModel();
  assert.equal(broker.reportPressure().pools.gpu.activeMemoryBytes, 0);
  assert.equal(broker.reportPressure().pools.cpu.activeMemoryBytes, 0);
});

test('admission revoked during a loader cannot become ready and releases only after worker stop', async () => {
  const events = [], { service, computeManager } = serviceFor({ events });
  let revoked = false;
  service.admission.acquire = async () => ({
    assertActive() { if (revoked) throw new Error('Residency was revoked'); },
    async release() { events.push('release-admission'); },
  });
  const submit = computeManager.submitTask;
  computeManager.submitTask = async (task) => {
    const result = await submit(task);
    if (task.data.command === 'load') revoked = true;
    return result;
  };
  await assert.rejects(service.loadModel({ sessionId: 'load-revoked', manifestCid: cid }), /revoked/);
  assert.equal(service.getStatus().status, 'idle');
  assert.ok(events.indexOf('terminate:model:load-revoked') < events.indexOf('release-admission'));
});

test('ready status rejects a missing or replaced original worker without releasing unacknowledged capacity', async () => {
  for (const state of [{ reserved: false, workerId: 17 }, { reserved: true, workerId: null }, { reserved: true, workerId: 18 }]) {
    const events = [], { service, submissions, computeManager } = serviceFor({ events });
    await service.loadModel({ sessionId: 'worker-lost', manifestCid: cid });
    computeManager.getWorkerAffinityState = (affinityKey) => ({ affinityKey, ...state });
    assert.equal(service.getStatus().status, 'lost');
    assert.equal(service.getStatus().loss.recoverable, true);
    assert.equal(service.getStatus().loss.sessionId, 'worker-lost');
    await assert.rejects(service.generate({ prompt: 'Do not dispatch' }), { code: 'ERR_MODEL_NOT_READY' });
    assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 0);
    assert.ok(!events.includes('release-admission'));
    await service.unloadModel();
    assert.equal(service.getStatus().loss, null, 'explicit unload clears recovery intent');
    assert.ok(events.indexOf('terminate:model:worker-lost') < events.indexOf('release-admission'));
  }
});

test('worker loss during load cannot return a ready session', async () => {
  const events = [], { service, computeManager } = serviceFor({ events });
  const submit = computeManager.submitTask;
  computeManager.submitTask = async (task) => {
    const result = await submit(task);
    if (task.data.command === 'load') computeManager.getWorkerAffinityState = () => ({ reserved: true, workerId: null });
    return result;
  };
  await assert.rejects(service.loadModel({ sessionId: 'load-worker-lost', manifestCid: cid }), /original managed resident worker/);
  assert.equal(service.getStatus().status, 'idle');
  assert.ok(events.indexOf('terminate:model:load-worker-lost') < events.indexOf('release-admission'));
});

test('worker status loss is remembered and failed explicit cleanup retains admission until retry', async () => {
  const events = [], { service, computeManager } = serviceFor({ events });
  await service.loadModel({ sessionId: 'status-lost', manifestCid: cid });
  const submit = computeManager.submitTask;
  computeManager.submitTask = (task) => task.data.command === 'status'
    ? Promise.resolve({ status: 'lost', sessionId: task.data.sessionId }) : submit(task);
  assert.equal((await service.status()).status, 'lost');
  assert.equal(service.getStatus().status, 'lost');
  const terminate = computeManager.terminateWorkerAffinity;
  computeManager.terminateWorkerAffinity = async () => { throw new Error('Worker stop not acknowledged'); };
  await assert.rejects(service.unloadModel(), /not acknowledged/);
  assert.ok(!events.includes('release-admission'));
  computeManager.terminateWorkerAffinity = terminate;
  await service.unloadModel();
  assert.equal(events.filter((event) => event === 'release-admission').length, 1);
});

test('revocation during active generation suppresses its result and cancels queued work', async () => {
  const events = [], { service, computeManager, submissions } = serviceFor({ events });
  let revoked = false;
  service.admission.acquire = async () => ({
    assertActive() { if (revoked) throw new Error('Residency was revoked'); },
    async release() { events.push('release-admission'); },
  });
  await service.loadModel({ sessionId: 'active-revoked', manifestCid: cid });
  const submit = computeManager.submitTask, started = deferred(), gate = deferred();
  computeManager.submitTask = async (task) => {
    if (task.data.command === 'generate') { started.resolve(); await gate.promise; }
    return submit(task);
  };
  const active = service.generate({ requestId: 'active', prompt: 'Hello' });
  await started.promise;
  const queued = service.generate({ requestId: 'queued', prompt: 'Later' });
  const rejected = assert.rejects(queued, { name: 'AbortError' });
  revoked = true; gate.resolve();
  await assert.rejects(active, error => {
    assert.match(error.message, /revoked/); assert.equal(error.code, 'ERR_MODEL_RESIDENCY_INACTIVE');
    assert.equal(error.committed, true, 'post-dispatch loss must not requeue the same prompt'); return true;
  }); await rejected;
  assert.equal(service.getStatus().status, 'lost');
  assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 1);
  assert.ok(!events.includes('release-admission'));
  await service.unloadModel();
  assert.equal(events.filter((event) => event === 'release-admission').length, 1);
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
  await assert.rejects(service.generate({ requestId: 'over-limit', prompt: 'x' }), { code: 'ERR_INFERENCE_BUSY' });
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

test('worker independently rejects substituted memory geometry, custom code and hidden FP16 cache requirements before graph load', async () => {
  const config = { model_type: 'phi3', hidden_size: 1536, num_attention_heads: 12,
    num_key_value_heads: 2, num_hidden_layers: 28, vocab_size: 151936 };
  for (const [changed, expected] of [
    [{ ...config, num_hidden_layers: 29 }, /verified config/],
    [{ ...config, auto_map: { AutoModel: 'repo.Code' } }, /Custom/],
    [{ ...config, 'transformers.js_config': { kv_cache_dtype: 'float16' } }, /GPU feature/],
  ]) {
    const library = fakeLibrary(), events = [];
    library.AutoConfig = { async from_pretrained() { return changed; } };
    library.AutoTokenizer = { async from_pretrained() { events.push('tokenizer'); } };
    library.AutoModelForCausalLM = { async from_pretrained() { events.push('graph'); } };
    const runtime = createModelTaskRuntime({ loadLibrary: async () => library, assertWorker() {}, baseUrl: origin,
      gpu: { async requestAdapter() { return fakeAdapter(library); } } });
    const input = manifest(); input.model.architecture = 'phi3'; input.model.memoryProfile = onnxMemoryProfile(config);
    await assert.rejects(loadRuntime({ runtime }, input), expected);
    assert.deepEqual(events, []);
  }
});

test('default loader selects causal versus image-text model classes and cleans failed component loads', async () => {
  for (const architecture of ['qwen3', 'qwen2', 'llama', 'idefics3']) {
    const vision = architecture === 'idefics3';
    const events = [];
    const components = fakeComponents({ vision, events });
    const library = fakeLibrary();
    library.AutoConfig = { async from_pretrained() { return { model_type: architecture }; } };
    library.AutoTokenizer = { async from_pretrained() { events.push('load-tokenizer'); return components.tokenizer; } };
    library.AutoProcessor = { async from_pretrained() { events.push('load-processor'); return components.processor; } };
    library.AutoModelForCausalLM = { async from_pretrained() { events.push('load-causal'); return components.model; } };
    library.AutoModelForImageTextToText = { async from_pretrained() { events.push('load-image-text'); return components.model; } };
    const runtime = createModelTaskRuntime({ loadLibrary: async () => library,
      assertWorker() {}, baseUrl: origin,
      gpu: { async requestAdapter() { return fakeAdapter(library); } },
    });
    const modelManifest = manifest({ vision });
    modelManifest.model.architecture = architecture;
    await loadRuntime({ runtime }, modelManifest);
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
    gpu: { async requestAdapter() { return fakeAdapter(library); } },
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
  await assert.rejects(active, error => {
    assert.match(error.message, /Worker terminated/); assert.equal(error.committed, true); return true;
  });
  await rejected;
  assert.equal(service.getStatus().status, 'idle');
  assert.deepEqual(service.getStatus().loss, { recoverable: true, manifestCid: cid, sessionId: 'lost',
    code: 'ERR_MODEL_SESSION_LOST', message: 'Worker terminated' });
  assert.ok(events.includes('release-admission'));
  // The fake manager cannot kill a real realm; dispose its injected runtime explicitly.
  await fixture.runtime({ command: 'unload', sessionId: 'lost' });
});

test('prompt cancellation that retires its worker preserves desired model residency', async () => {
  const { service, computeManager, fixture } = serviceFor();
  service.runtimeDefinition = { ...service.runtimeDefinition, terminateOnGenerationAbort: true };
  await service.loadModel({ sessionId: 'intentional-cancel', manifestCid: cid });
  const started = deferred();
  computeManager.submitTask = task => {
    assert.equal(task.data.command, 'generate'); started.resolve();
    return new Promise((_resolve, reject) => task.signal.addEventListener('abort', () => reject(task.signal.reason), { once: true }));
  };
  const controller = new AbortController();
  const generating = service.generate({ prompt: 'Cancel this', signal: controller.signal });
  await started.promise; controller.abort(); await assert.rejects(generating, { name: 'AbortError' });
  assert.equal(service.getStatus().status, 'idle'); assert.equal(service.getStatus().loss.recoverable, true);
  await service.dispose(); assert.equal(service.getStatus().loss, null);
  await fixture.runtime({ command: 'unload', sessionId: 'intentional-cancel' });
});

test('cancelled prompt retirement reloads its retained model once, without replay, and owner unload wins', async (t) => {
  const fixtures = [], started = deferred(); let generations = 0, leases = 0;
  const registry = new ResidentModelRegistry({ recovery: { pollMs: 100000 }, artifactStore: {
    ...storeFor(), async acquireUse() { leases++; return () => { leases--; }; },
  }, createService() {
    const f = serviceFor(); fixtures.push(f);
    f.service.runtimeDefinition = { ...f.service.runtimeDefinition, terminateOnGenerationAbort: true };
    const submit = f.computeManager.submitTask;
    f.computeManager.submitTask = task => {
      if (task.data.command === 'load') f.sessionId = task.data.sessionId;
      if (task.data.command !== 'generate') return submit(task);
      generations++; started.resolve();
      return new Promise((_resolve, reject) => task.signal.addEventListener('abort', () => reject(
        task.signal.reason instanceof Error ? task.signal.reason : new DOMException(String(task.signal.reason), 'AbortError')), { once: true }));
    };
    return f.service;
  } });
  t.after(async () => {
    await registry.dispose();
    // The injected manager cannot destroy a real realm. Close its fake runtime.
    for (const f of fixtures) if (f.sessionId) await f.fixture.runtime({ command: 'unload', sessionId: f.sessionId });
  });
  await registry.load(cid);
  const old = registry.getService(cid), sessionId = old.getStatus().sessionId, cancel = new AbortController();
  const request = old.generate({ prompt: 'Speculative thought interrupted by a new world hello', signal: cancel.signal });
  await started.promise; cancel.abort(); await assert.rejects(request, { name: 'AbortError' });
  assert.equal(old.getStatus().loss.recoverable, true); assert.equal(leases, 1);
  await registry.checkRecovery();
  assert.equal(fixtures.length, 2); assert.notEqual(registry.getService(cid), old);
  assert.equal(registry.getService(cid).getStatus().status, 'ready');
  assert.equal(generations, 1, 'the cancelled thought must never be regenerated'); assert.equal(leases, 1);
  await fixtures[0].fixture.runtime({ command: 'unload', sessionId });
  const unloadingService = registry.getService(cid);
  const ownerInterrupted = assert.rejects(unloadingService.generate({ prompt: 'Owner unload interrupts this new request' }), { name: 'AbortError' });
  await nextTurn(); await registry.unload(cid); await ownerInterrupted; await registry.checkRecovery();
  assert.equal(unloadingService.getStatus().loss, null, 'owner unload clears recovery intent even while cancelling a prompt');
  assert.equal(fixtures.length, 2); assert.equal(registry.list().length, 0); assert.equal(leases, 0);
});

test('readiness-loss cancellation in a retiring runtime preserves unexpected recovery intent', async () => {
  const { service, computeManager, fixture } = serviceFor();
  service.runtimeDefinition = { ...service.runtimeDefinition, terminateOnGenerationAbort: true };
  await service.loadModel({ sessionId: 'readiness-loss', manifestCid: cid });
  const started = deferred();
  computeManager.submitTask = task => {
    started.resolve();
    return new Promise((_resolve, reject) => task.signal.addEventListener('abort', () => {
      reject(new DOMException('Worker aborted after health loss', 'AbortError'));
    }, { once: true }));
  };
  const generating = service.generate({ prompt: 'Interrupted by device loss' });
  await started.promise;
  computeManager.getWorkerAffinityState = () => ({ reserved: true, workerId: null });
  assert.equal(service.getStatus().status, 'lost');
  await assert.rejects(generating, { name: 'AbortError', committed: true });
  assert.equal(service.getStatus().loss.recoverable, true);
  assert.equal(service.getStatus().loss.code, 'ERR_MODEL_RESIDENCY_INACTIVE');
  await service.dispose(); await fixture.runtime({ command: 'unload', sessionId: 'readiness-loss' });
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
  assert.equal(Object.keys(MODEL_CATALOG).length, 7);
  assert.equal(MODEL_CATALOG['qwen3-0.6b-q4'].weightBytes, 919096585);
  assert.equal(MODEL_CATALOG['smolvlm-256m-q4'].weightBytes, 263889326);
  assert.equal(MODEL_CATALOG['smolvlm-500m-q4'].weightBytes, 485088765);
  assert.equal(MODEL_CATALOG['qwen3.5-2b-q4'].weightBytes, 1752031835);
  const nano = MODEL_CATALOG['nemotron-3-nano-4b-q4'];
  assert.equal(nano.model.architecture, 'nemotron_h');
  assert.equal(nano.model.dtype, 'q4');
  assert.deepEqual(nano.model.requiredFeatures, []);
  assert.equal(nano.totalBytes, 2568544283);
  assert.equal(nano.model.memoryProfile.recurrentLayers, 21);
  assert.equal(nano.license.spdx, 'LicenseRef-NVIDIA-Nemotron-Open-Model-License');
  assert.match(nano.license.text, /NVIDIA Nemotron Open Model License/);
  assert.deepEqual(nano.files.filter((file) => file.path.startsWith('onnx/')).map((file) => file.path),
    ['onnx/model_q4.onnx', 'onnx/model_q4.onnx_data', 'onnx/model_q4.onnx_data_1']);
  for (const entry of Object.values(MODEL_CATALOG)) {
    assert.match(entry.revision, /^[a-f0-9]{40}$/);
    assert.equal(entry.totalBytes, entry.files.reduce((sum, file) => sum + file.size, 0));
    if (entry !== nano) assert.equal(entry.license.spdx, 'Apache-2.0');
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
  await assert.rejects(service.generate({ prompt: 'x' }), error => {
    assert.match(error.message, /cleanup failed/); assert.equal(error.committed, true); return true;
  });
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
  let revoked = false;
  service.admission.acquire = async () => ({
    assertActive() { if (revoked) throw new Error('Residency was revoked'); },
    release() { events.push('release-admission'); },
  });
  await service.loadModel({ sessionId: 'revoked', manifestCid: cid });
  revoked = true;
  await assert.rejects(service.generate({ prompt: 'x' }), error => {
    assert.match(error.message, /revoked/); assert.equal(error.committed, undefined, 'pre-dispatch admission remains a wait'); return true;
  });
  assert.equal(service.getStatus().status, 'lost');
  assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 0);
  assert.ok(!events.includes('release-admission'));
  await service.unloadModel();
  assert.ok(events.includes('release-admission'));
});

test('async admission checks are awaited before dispatch and result delivery without unhandled rejection', async () => {
  for (const failAt of ['dispatch', 'completion']) {
    const events = [], { service, computeManager, submissions } = serviceFor({ events });
    let phase = 'load', assertions = 0;
    const entered = deferred(), gate = deferred();
    service.admission.acquire = async () => ({
      async assertActive() {
        assertions++;
        if (phase === failAt) { entered.resolve(); await gate.promise; throw new Error('Async residency revoked'); }
      },
      async release() { events.push('release-admission'); },
    });
    await service.loadModel({ sessionId: `async-${failAt}`, manifestCid: cid });
    assert.equal(assertions, 2);
    service.getStatus(); service.getStatus();
    assert.equal(assertions, 2, 'synchronous status must not invoke an asynchronous guard');
    phase = 'dispatch';
    const submit = computeManager.submitTask;
    computeManager.submitTask = async (task) => {
      const result = await submit(task);
      if (task.data.command === 'generate') phase = 'completion';
      return result;
    };
    const pending = service.generate({ prompt: 'Hello' });
    const rejected = assert.rejects(pending, /Async residency revoked/);
    await entered.promise;
    assert.equal(submissions.filter((task) => task.data.command === 'generate').length, failAt === 'dispatch' ? 0 : 1);
    gate.resolve(); await rejected;
    assert.equal(service.getStatus().status, 'lost');
    assert.ok(!events.includes('release-admission'));
    await service.unloadModel();
    assert.equal(events.filter((event) => event === 'release-admission').length, 1);
  }
});

test('a promise returned by an explicitly synchronous admission check fails closed and is consumed', async () => {
  const { service, submissions } = serviceFor();
  service.admission.acquire = async () => ({ assertActive() {},
    assertActiveSync() { return Promise.reject(new Error('Invalid asynchronous health API')); }, async release() {} });
  await service.loadModel({ sessionId: 'bad-health-api', manifestCid: cid });
  assert.equal(service.getStatus().status, 'lost');
  await assert.rejects(service.generate({ prompt: 'Do not dispatch' }), /not ready/);
  await nextTurn();
  assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 0);
  await service.unloadModel();
});

test('unload cancels a suspended async admission check before dispatch and consumes its late rejection', async () => {
  const events = [], { service, submissions } = serviceFor({ events });
  let checking = false;
  const entered = deferred(), gate = deferred();
  service.admission.acquire = async () => ({
    async assertActive() { if (checking) { entered.resolve(); await gate.promise; } },
    async release() { events.push('release-admission'); },
  });
  await service.loadModel({ sessionId: 'async-unload', manifestCid: cid });
  checking = true;
  const active = service.generate({ prompt: 'Do not dispatch' });
  const rejected = assert.rejects(active, { name: 'AbortError' });
  await entered.promise;
  await service.unloadModel(); await rejected;
  assert.equal(submissions.filter((task) => task.data.command === 'generate').length, 0);
  assert.equal(service.getStatus().status, 'idle');
  assert.equal(events.filter((event) => event === 'release-admission').length, 1);
  gate.reject(new Error('Late admission failure')); await nextTurn();
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
    ...fakeGpuDevice(),
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

test('Qwen3.5 retains its complete external-data q4 closure and separate memory floor', () => {
  const modelManifest = qwen35Manifest();
  const validated = validateModelManifest(modelManifest);
  assert.equal(validated.totalBytes, 1771280684);
  assert.equal(validated.resourcePolicy.minimumGpuBytes, 8 * 1024 ** 3);
  assert.ok(validated.totalBytes < MODEL_POLICY.maxModelBytes);
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
    gpu: { async requestAdapter() { return fakeAdapter(library); } } });
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
