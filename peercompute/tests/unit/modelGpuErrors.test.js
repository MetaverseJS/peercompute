import assert from 'node:assert/strict';
import test from 'node:test';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { createModelTaskRuntime } from '../../src/peercompute/inference/modelTask.js';

const origin = 'https://peercompute.test/';
const cid = CID.createV1(0x55, await sha256.digest(new Uint8Array([1]))).toString();
const manifest = { schema: 'peercompute.artifact.manifest.v1',
  model: { runtime: 'transformers.js', runtimeVersion: '4.3.2', architecture: 'qwen3',
    dtype: 'q4', task: 'text-generation' },
  files: ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'onnx/model_q4.onnx']
    .map((path) => ({ path, cid, size: 16, sha256: 'a'.repeat(64) })) };
const deferred = () => {
  let resolve;
  const promise = new Promise((yes) => { resolve = yes; });
  return { promise, resolve };
};

class GPUOutOfMemoryError extends Error {}

// Model the native device's per-filter scope stack, asynchronous pop results and
// independent uncaptured-error listeners. No GPU/model allocation is performed.
class FakeGpuDevice extends EventTarget {
  constructor() {
    super();
    this.features = new Set();
    this.scopes = [];
    this.pushed = [];
    this.popped = [];
    this.listeners = new Set();
    this.loss = deferred();
    this.lost = this.loss.promise;
    this.queue = { onSubmittedWorkDone: async () => {
      this.fences = (this.fences ?? 0) + 1;
      if (this.queueFailure) throw this.queueFailure;
    } };
  }
  addEventListener(type, fn, options) {
    if (type === 'uncapturederror') this.listeners.add(fn);
    super.addEventListener(type, fn, options);
  }
  removeEventListener(type, fn, options) {
    this.listeners.delete(fn);
    super.removeEventListener(type, fn, options);
  }
  pushErrorScope(filter) {
    if (this.failPush === filter) throw new Error('push scope failed');
    this.pushed.push(filter);
    this.scopes.push({ filter, error: null });
  }
  async popErrorScope() {
    const scope = this.scopes.pop();
    assert.ok(scope, 'every native pop must have a corresponding push');
    this.popped.push(scope.filter);
    if (this.failPop === scope.filter) throw new Error('pop scope failed');
    return scope.error;
  }
  raise(filter, error) {
    const scope = this.scopes.findLast((item) => item.filter === filter);
    if (scope) scope.error ??= error;
    else this.uncaptured(error);
  }
  uncaptured(error) {
    const event = new Event('uncapturederror');
    event.error = error;
    this.dispatchEvent(event);
  }
  destroy() { this.destroyed = true; this.loss.resolve({ reason: 'destroyed' }); }
}

function fixture({ load, generate, tokenize, device = new FakeGpuDevice() } = {}) {
  const events = [];
  const input = () => ({ input_ids: { dims: [1, 2], dispose() { events.push('input-disposed'); } } });
  const output = () => ({ tolist: () => [[1n, 1n, 2n]], dispose() { events.push('output-disposed'); } });
  const components = {
    tokenizer: Object.assign(async () => tokenize ? tokenize(input) : input(), {
      apply_chat_template: () => 'hello', decode: () => 'answer', dispose: () => events.push('tokenizer-disposed'),
    }),
    model: { config: {}, async generate(options) {
      events.push('generate');
      return generate ? generate(options, output) : output();
    }, dispose: () => events.push('model-disposed') },
  };
  const adapter = { info: { isFallbackAdapter: false }, features: new Set(['subgroups', 'timestamp-query']),
    limits: { maxBindGroups: 4, maxComputeWorkgroupStorageSize: 32768, maxComputeWorkgroupsPerDimension: 65535,
      maxStorageBuffersPerShaderStage: 16, maxStorageBufferBindingSize: 2 ** 31, maxBufferSize: 2 ** 32,
      maxComputeInvocationsPerWorkgroup: 1024, maxComputeWorkgroupSizeX: 1024, maxComputeWorkgroupSizeY: 1024, maxComputeWorkgroupSizeZ: 64 },
    async requestDevice(descriptor) {
      assert.deepEqual(descriptor.requiredLimits, this.limits, 'native EP receives full supported compute/buffer limits');
      assert.deepEqual(descriptor.requiredFeatures, ['timestamp-query', 'subgroups']);
      events.push('request-device'); return device;
    } };
  const originalRequestDevice = adapter.requestDevice;
  const library = {
    env: { version: '4.3.2', backends: { onnx: { wasm: {}, webgpu: {} } } },
    InterruptableStoppingCriteria: class { interrupt() { this.interrupted = true; } },
    TextStreamer: class { constructor(_tokenizer, options) { this.options = options; } },
  };
  const runtime = createModelTaskRuntime({ assertWorker() {}, baseUrl: origin,
    gpu: { requestAdapter: async () => adapter }, loadLibrary: async () => library,
    loadModel: async ({ options }) => {
      const webgpu = library.env.backends.onnx.webgpu;
      assert.equal(webgpu.adapter, adapter, 'ORT must initialize using the preflighted adapter');
      assert.equal(options.session_options.executionProviders.length, 1, 'no CPU provider fallback');
      assert.equal(options.session_options.executionProviders[0].name, 'webgpu');
      const actual = options.session_options.executionProviders[0].device;
      assert.equal(actual, device);
      assert.deepEqual(device.scopes.map((scope) => scope.filter), ['validation', 'out-of-memory', 'internal'],
        'load guards must already cover the device before ORT starts allocating');
      // Native ORT does not set env.webgpu.device for an injected device (only
      // default deviceId 0 invokes its webgpuInit callback). Do not model JSEP.
      assert.equal(webgpu.device, undefined);
      return load ? load(components) : components;
    },
  });
  const send = (command, data = {}, context = {}) => runtime({ command, sessionId: 'gpu-model', ...data }, context);
  return { device, events, components, adapter, originalRequestDevice, library, send,
    generate: (context = {}) => send('generate', { requestId: 'request', prompt: 'hello', maxNewTokens: 4 }, context),
    async load(context = {}) {
      const { port1, port2 } = new MessageChannel();
      try { return await send('load', { manifest, manifestCid: cid, artifactPort: port2,
        runtimeAssets: { mjs: `${origin}assets/ort.mjs`, wasm: `${origin}assets/ort.wasm` } }, context); }
      finally { port1.close(); port2.close(); }
    },
  };
}

function balanced(device, operations) {
  assert.equal(device.scopes.length, 0);
  assert.equal(device.popped.length, device.pushed.length);
  if (operations !== undefined) assert.equal(device.popped.length, 3 * operations);
}

test('native EP receives the guarded owned device; clean generations reuse it and unload removes observers and destroys it', async () => {
  const f = fixture();
  assert.equal((await f.load()).status, 'ready');
  assert.equal(f.adapter.requestDevice, f.originalRequestDevice, 'adapter creation is not intercepted');
  assert.equal(f.library.env.backends.onnx.webgpu.device, undefined, 'native custom-device path does not populate the environment');
  assert.equal(f.device.listeners.size, 1);
  for (let i = 0; i < 2; i++) assert.equal((await f.generate()).text, 'answer');
  balanced(f.device, 3);
  assert.deepEqual(f.device.popped, Array(3).fill(['internal', 'out-of-memory', 'validation']).flat());
  await f.send('unload');
  assert.equal(f.device.listeners.size, 0);
  assert.equal(f.device.destroyed, true);
  assert.equal((await f.send('status')).status, 'absent');
});

test('load OOM owns and disposes returned components and its device, retaining the original cause', async () => {
  const cause = new GPUOutOfMemoryError('native allocation failed');
  let f;
  f = fixture({ load: (components) => { f.device.raise('out-of-memory', cause); return components; } });
  await assert.rejects(f.load(), (error) => {
    assert.equal(error.code, 'ERR_MODEL_GPU_OUT_OF_MEMORY');
    assert.equal(error.cause, cause);
    assert.match(error.message, /Close GPU-heavy apps or unload other models, then reload/);
    return true;
  });
  balanced(f.device, 1);
  assert.ok(f.events.includes('model-disposed'));
  assert.ok(f.events.includes('tokenizer-disposed'));
  assert.equal(f.device.listeners.size, 0);
  assert.equal(f.device.destroyed, true);
  assert.equal(f.adapter.requestDevice, f.originalRequestDevice);
  assert.equal((await f.send('status')).status, 'absent');
});

test('scoped generation errors reject instead of returning tensors, invalidate residency and permit acknowledged unload', async () => {
  for (const filter of ['out-of-memory', 'internal', 'validation']) {
    let f;
    f = fixture({ generate: (_options, output) => { f.device.raise(filter, new Error(filter)); return output(); } });
    await f.load();
    await assert.rejects(f.generate(), /Model session lost/);
    balanced(f.device, 2);
    assert.ok(f.events.includes('input-disposed'));
    assert.ok(f.events.includes('output-disposed'));
    assert.equal((await f.send('status')).status, 'lost');
    await assert.rejects(f.generate(), /Model session lost/);
    assert.equal(f.events.filter((event) => event === 'generate').length, 1);
    await f.send('unload');
    assert.equal(f.device.listeners.size, 0);
  }
});

test('OOM takes priority over invalid-buffer fallout and a simultaneous cancellation', async () => {
  const controller = new AbortController(), cause = new GPUOutOfMemoryError('out of device memory');
  let f;
  f = fixture({ generate: () => {
    f.device.raise('validation', new Error('invalid buffer'));
    f.device.raise('out-of-memory', cause);
    controller.abort();
    throw new DOMException('cancelled', 'AbortError');
  } });
  await f.load();
  await assert.rejects(f.generate({ signal: controller.signal }), (error) => error.cause === cause
    && error.code === 'ERR_MODEL_GPU_OUT_OF_MEMORY');
  balanced(f.device, 2);
  assert.equal((await f.send('status')).status, 'lost');
  await f.send('unload');
});

test('ordinary model errors and clean cancellation drain scopes without invalidating a healthy session', async () => {
  let attempt = 0;
  const controller = new AbortController();
  const f = fixture({ generate: (_options, output) => {
    if (attempt++ === 0) throw new Error('ordinary model input failure');
    if (attempt === 2) { controller.abort(); return output(); }
    return output();
  } });
  await f.load();
  await assert.rejects(f.generate(), /ordinary model input failure/);
  assert.equal((await f.send('status')).status, 'ready');
  await assert.rejects(f.generate({ signal: controller.signal }), { name: 'AbortError' });
  assert.equal((await f.send('status')).status, 'ready');
  assert.equal((await f.generate()).text, 'answer');
  balanced(f.device, 4);
  await f.send('unload');
});

test('uncaptured errors remain visible despite ORT assigning its event property', async () => {
  const f = fixture();
  await f.load();
  f.device.onuncapturederror = () => {};
  f.device.uncaptured(new GPUOutOfMemoryError('resident allocation failed'));
  assert.equal((await f.send('status')).status, 'lost');
  await assert.rejects(f.generate(), /Model session lost/);
  assert.ok(!f.events.includes('generate'));
  await f.send('unload');
});

test('device loss during preprocessing is a session failure rather than a reusable AbortError', async () => {
  const started = deferred(), gate = deferred();
  const f = fixture({ tokenize: async (input) => { started.resolve(); await gate.promise; return input(); } });
  await f.load();
  const result = f.generate();
  await started.promise;
  f.device.loss.resolve({ reason: 'unknown', message: 'device removed' });
  await Promise.resolve();
  gate.resolve();
  await assert.rejects(result, (error) => error.code === 'ERR_MODEL_GPU' && /device lost/.test(error.message));
  assert.equal((await f.send('status')).status, 'lost');
  assert.ok(!f.events.includes('generate'));
  assert.ok(f.events.includes('input-disposed'));
  balanced(f.device, 1);
  await f.send('unload');
});

test('queue rejection and failed scope pops quarantine the session while every remaining scope is drained', async () => {
  for (const failure of ['queue', 'pop']) {
    const f = fixture();
    await f.load();
    if (failure === 'queue') f.device.queueFailure = new Error('submission failed');
    else f.device.failPop = 'internal';
    await assert.rejects(f.generate(), /Model session lost/);
    balanced(f.device, 2);
    assert.equal((await f.send('status')).status, 'lost');
    await f.send('unload');
  }
});

test('a partial scope-push failure drains only successfully pushed scopes and cannot run the model', async () => {
  const f = fixture();
  await f.load();
  f.device.failPush = 'out-of-memory';
  await assert.rejects(f.generate(), /error scope failure/);
  balanced(f.device);
  assert.equal(f.device.pushed.length, 4);
  assert.ok(!f.events.includes('generate'));
  assert.equal((await f.send('status')).status, 'lost');
  await f.send('unload');
});

test('cancelled non-abortable load still drains scopes and disposes late components before acknowledging failure', async () => {
  const controller = new AbortController(), started = deferred(), gate = deferred();
  const f = fixture({ load: async (components) => { started.resolve(); await gate.promise; return components; } });
  const loading = f.load({ signal: controller.signal });
  await started.promise;
  controller.abort();
  gate.resolve();
  await assert.rejects(loading, { name: 'AbortError' });
  balanced(f.device, 1);
  assert.ok(f.events.includes('model-disposed'));
  assert.equal(f.device.listeners.size, 0);
  assert.equal(f.adapter.requestDevice, f.originalRequestDevice);
});

test('missing native GPU error APIs are rejected instead of silently disabling guards', async () => {
  const device = new FakeGpuDevice();
  device.pushErrorScope = undefined;
  const f = fixture({ device });
  await assert.rejects(f.load(), /GPU device unavailable/);
  assert.equal((await f.send('status')).status, 'absent');
  assert.equal(f.adapter.requestDevice, f.originalRequestDevice);
});

test('a tensor cleanup failure cannot mask GPU OOM or prevent disposal of the returned output', async () => {
  const cause = new GPUOutOfMemoryError('allocation failed');
  let f;
  f = fixture({ tokenize: () => ({ input_ids: { dims: [1, 2], dispose() { throw new Error('input disposal failed'); } } }),
    generate: (_options, output) => { f.device.raise('out-of-memory', cause); return output(); } });
  await f.load();
  await assert.rejects(f.generate(), (error) => error.cause === cause && error.code === 'ERR_MODEL_GPU_OUT_OF_MEMORY');
  assert.ok(f.events.includes('output-disposed'));
  assert.equal((await f.send('status')).status, 'lost');
  balanced(f.device, 2);
  await f.send('unload');
});

test('native WASM traps invalidate residency even when GPU scopes have no separate error', async () => {
  const cause = new WebAssembly.RuntimeError('unreachable');
  const f = fixture({ generate: () => { throw cause; } });
  await f.load();
  await assert.rejects(f.generate(), (error) => error.code === 'ERR_MODEL_RUNTIME' && error.cause === cause);
  balanced(f.device, 2);
  assert.equal((await f.send('status')).status, 'lost');
  await assert.rejects(f.generate(), /Model session lost/);
  await f.send('unload');
});

test('a native OrtRun rejection remains fatal when ORT consumed its own inner validation scope', async () => {
  const cause = new Error('failed to call OrtRun(). ERROR_CODE: 1, ERROR_MESSAGE: native GPU validation failed');
  let f;
  f = fixture({ generate: async () => {
    f.device.pushErrorScope('validation');
    f.device.raise('validation', new Error('native validation error'));
    assert.ok(await f.device.popErrorScope());
    throw cause;
  } });
  await f.load();
  await assert.rejects(f.generate(), (error) => error.code === 'ERR_MODEL_RUNTIME' && error.cause === cause);
  balanced(f.device);
  assert.equal(f.device.popped.length, 7, 'three scopes per operation plus ORT inner validation');
  assert.equal((await f.send('status')).status, 'lost');
  await f.send('unload');
});

test('failed or pending component disposal retains ownership until cleanup acknowledges success', async () => {
  const f = fixture();
  await f.load();
  f.components.model.dispose = () => { throw new Error('cannot release model yet'); };
  await assert.rejects(f.send('unload'), /MODEL_DISPOSE_FAILED/);
  assert.notEqual(f.device.destroyed, true);
  assert.equal(f.device.listeners.size, 1);
  assert.equal((await f.send('status')).status, 'lost');
  const gate = deferred(), started = deferred();
  f.components.model.dispose = async () => { started.resolve(); await gate.promise; };
  const unloading = f.send('unload');
  await started.promise;
  assert.notEqual(f.device.destroyed, true);
  gate.resolve();
  await unloading;
  assert.equal(f.device.destroyed, true);
  assert.equal(f.device.listeners.size, 0);
});
