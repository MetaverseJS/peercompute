import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MODEL_ARTIFACT_CATALOG } from '../../src/peercompute/artifacts/modelArtifactCatalog.js';
import { GGUF_MODEL_CATALOG } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { createGgufEngine, createNativeFileReader, observeGpuDevice, parseOffloadEvidence, parseBufferEvidence } from '../../src/peercompute/inference/gguf/engine.js';
import { glueSerialize, glueDeserialize } from '@wllama/wllama/peercompute-glue.js';
import { createGgufTaskRuntime } from '../../src/peercompute/inference/gguf/modelTask.js';
import { MODEL_POLICY } from '../../src/peercompute/inference/modelManifest.js';
import { validateGgufManifest, validateGgufCapabilities, validateGgufRuntimeAssets,
  validateGgufRuntimeOptions } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';

const origin = 'https://peercompute.test/worker.js';
const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
function manifest(entry = MODEL_ARTIFACT_CATALOG['qwen3.8-27b-georefine-d14-gguf']) {
  return { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
    files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256: sha256 ?? 'a'.repeat(64), cid })) };
}

test('GGUF execution admits exact trusted revision and weight digests without altering legacy manifests', () => {
  const source = manifest();
  const validated = validateGgufManifest(source);
  assert.equal(validated.manifest.model.runtimeVersion, undefined);
  assert.equal(validated.weights[0].size, 14199740480);
  assert.equal(validated.resourcePolicy.minimumCpuBytes, 8 * 1024 ** 3);
  assert.equal(validated.resourcePolicy.minimumGpuBytes, 16 * 1024 ** 3);
  const wrong = structuredClone(source); wrong.model.revision = 'f'.repeat(40);
  assert.throws(() => validateGgufManifest(wrong), /trusted/);
  const corrupt = structuredClone(source); corrupt.files.find((file) => file.path.endsWith('.gguf')).sha256 = '0'.repeat(64);
  assert.throws(() => validateGgufManifest(corrupt), /digests/);
});

test('GGUF admission distinguishes same-revision precisions and rejects relabelled or missing weights', () => {
  const q4 = GGUF_MODEL_CATALOG['qwen3.5-9b-evil-mradermacher-q4-k-m-gguf'];
  const q8 = GGUF_MODEL_CATALOG['qwen3.5-9b-evil-mradermacher-q8-0-gguf'];
  for (const entry of [q4, q8]) {
    const source = manifest(entry), validated = validateGgufManifest(source);
    assert.equal(validated.weights[0].sha256, entry.files.find((file) => file.path.endsWith('.gguf')).sha256);
    assert.equal(validated.resourcePolicy.minimumCpuBytes, 8 * 1024 ** 3);
    assert.equal(validated.resourcePolicy.minimumGpuBytes, 16 * 1024 ** 3);
    for (const field of ['dtype', 'architecture', 'task']) {
      const missing = structuredClone(source); delete missing.model[field];
      assert.throws(() => validateGgufManifest(missing), /trusted/);
    }
  }
  const relabelled = manifest(q4); relabelled.model.dtype = q8.model.dtype;
  assert.throws(() => validateGgufManifest(relabelled), /digests/);
  const swapped = manifest(q8); swapped.files = manifest(q4).files;
  assert.throws(() => validateGgufManifest(swapped), /digests/);
  const renamed = manifest(q8); renamed.files.find((file) => file.path.endsWith('.gguf')).path = q4.files.find((file) => file.path.endsWith('.gguf')).path;
  assert.throws(() => validateGgufManifest(renamed), /digests/);
});

test('GGUF assets and native options reject arbitrary URLs, CPU-only fallback and child threads', () => {
  assert.deepEqual(validateGgufRuntimeAssets({ wasm: '/runtime/wllama.wasm' }, origin),
    { wasm: 'https://peercompute.test/runtime/wllama.wasm' });
  for (const wasm of ['https://cdn.test/wllama.wasm', 'data:application/wasm,x', '/x.wasm?q=1']) {
    assert.throws(() => validateGgufRuntimeAssets({ wasm }, origin), /same-origin/);
  }
  assert.equal(validateGgufRuntimeOptions({ n_gpu_layers: 56 }).n_gpu_layers, 56);
  assert.equal(validateGgufRuntimeOptions().n_ctx, 2048);
  assert.equal(validateGgufRuntimeOptions().n_batch, 64);
  assert.equal(validateGgufRuntimeOptions({ n_ctx: 512 }).n_ctx, 512);
  for (const options of [{ n_threads: 2 }, { n_gpu_layers: 0 }, { n_ctx: 2049 }, { n_batch: 129 }, { path: 'x' }]) {
    assert.throws(() => validateGgufRuntimeOptions(options));
  }
});

test('GGUF capabilities fail closed without isolation, JSPI, memory64 or hardware f16', async () => {
  const scope = { crossOriginIsolated: true, SharedArrayBuffer,
    WebAssembly: { Suspending() {}, promising() {}, Memory: class {} } };
  const adapter = { features: new Set(['shader-f16']), info: { vendor: 'test', isFallbackAdapter: false } };
  const gpu = { async requestAdapter() { return adapter; } };
  assert.equal((await validateGgufCapabilities({ scope, gpu })).adapter.vendor, 'test');
  await assert.rejects(validateGgufCapabilities({ scope: { ...scope, crossOriginIsolated: false }, gpu }), /isolation/);
  await assert.rejects(validateGgufCapabilities({ scope: { ...scope, WebAssembly: {} }, gpu }), /JSPI/);
  adapter.features.clear(); await assert.rejects(validateGgufCapabilities({ scope, gpu }), /shader-f16/);
  adapter.features.add('shader-f16'); adapter.info.isFallbackAdapter = true;
  await assert.rejects(validateGgufCapabilities({ scope, gpu }), /hardware/);
});

test('native GGUF reads preserve offsets above 2^32, bound results to 4MiB and clamp EOF', async () => {
  const offset = 2 ** 32 + 87;
  const bytes = 9 * 1024 ** 2 + 17;
  const memory = new ArrayBuffer(bytes + 64);
  const reads = [];
  const read = createNativeFileReader({ files: [{ name: 'model.gguf', path: 'weights.gguf', size: offset + bytes }],
    getMemory: () => memory, reader: { async read(path, start, length) {
      reads.push({ path, start, length }); return new Uint8Array(length).fill(reads.length);
    } } });
  assert.equal(await read('/models/model.gguf', offset, bytes + 999, 32), BigInt(bytes));
  assert.deepEqual(reads.map((item) => item.length), [4194304, 4194304, 1048593]);
  assert.deepEqual(reads.map((item) => item.start), [offset, offset + 4194304, offset + 8388608]);
  assert.equal(new Uint8Array(memory)[32 + bytes - 1], 3);
  assert.equal(await read('model.gguf', offset + bytes, 100, 0), 0n);
  await assert.rejects(read('unknown', 0, 1, 0), /Invalid/);
  await assert.rejects(read('model.gguf', offset, bytes, 100), /memory/);
});

test('native GGUF range cancellation and short reads stop before copying unverified bytes', async () => {
  const controller = new AbortController();
  const memory = new ArrayBuffer(512);
  const read = createNativeFileReader({ files: [{ name: 'x', path: 'x', size: 512 }], getMemory: () => memory,
    getSignal: () => controller.signal, reader: { async read() { controller.abort(); return new Uint8Array(10).fill(9); } } });
  await assert.rejects(read('x', 0, 10, 0), { name: 'AbortError' });
  assert.deepEqual([...new Uint8Array(memory)], new Array(512).fill(0));
  const short = createNativeFileReader({ files: [{ name: 'x', path: 'x', size: 512 }], getMemory: () => memory,
    reader: { async read() { return new Uint8Array(1); } } });
  await assert.rejects(short('x', 0, 10, 0), /Incomplete/);
});

test('native engine action obeys the memory64 size_t and uint32 ABI and decodes a real GLUE response', async () => {
  const memory = new ArrayBuffer(8192);
  const result = glueSerialize({ _name: 'cncl_res', success: true });
  let calls = 0, nullAllocation = false;
  const engine = await createGgufEngine({ wasmUrl: 'https://peercompute.test/wllama.wasm',
    weights: [{ path: 'x.gguf', size: 1 }], reader: { async read() { return new Uint8Array(1); } },
    initialize(module) {
      Object.assign(module, { ENV: {}, wasmMemory: { buffer: memory },
        FS: { mkdir() {}, mount() {} }, FS_createDataFile() {},
        MEMFS: { stream_ops: { read() {}, llseek() {}, mmap() {} }, ops_table: { file: { stream: {} } } },
        cwrap(name, resultType, argTypes) {
          if (name === 'wllama_start') return async () => '{"success":true}';
          if (name === 'wllama_malloc') {
            assert.deepEqual(argTypes, ['bigint', 'number']); assert.equal(resultType, 'bigint');
            return (size, dummy) => { assert.equal(typeof size, 'bigint'); assert.equal(dummy, 0); return nullAllocation ? 0n : 64n; };
          }
          assert.equal(name, 'wllama_action');
          return async (action, pointer) => {
            assert.equal(action, 'cancel'); assert.equal(pointer, 64n); calls += 1;
            assert.equal(glueDeserialize(new Uint8Array(memory, 64).slice()).req_id, 7);
            new Uint8Array(memory).set(result, 1024);
            new DataView(memory).setUint32(64, result.length, true); return 1024n;
          };
        },
      });
      module.preRun(); assert.equal(module.ENV.USE_ASYNC_FILE, '1');
      module.peercomputeOnDevice({ features: new Set(['shader-f16']), lost: new Promise(() => {}),
        queue: { async onSubmittedWorkDone() {} }, destroy() {} });
      module.onRuntimeInitialized();
    },
  });
  assert.deepEqual(await engine.action('cancel', { _name: 'cncl_req', req_id: 7 }), { _name: 'cncl_res', success: true });
  assert.equal(calls, 1);
  nullAllocation = true;
  await assert.rejects(engine.action('cancel', { _name: 'cncl_req', req_id: 7 }), /Invalid GGUF input pointer/);
  assert.equal(new Uint8Array(memory)[0], 0); assert.equal(calls, 1);
  engine.close();
});

test('GPU evidence observes the owned device and restores its methods', () => {
  const device = { features: new Set(['shader-f16']), lost: new Promise(() => {}),
    createCommandEncoder() { return { beginComputePass() { return { dispatchWorkgroups() {}, dispatchWorkgroupsIndirect() {} }; } }; },
    queue: { submit() {} } };
  const encoder = device.createCommandEncoder, submit = device.queue.submit;
  const evidence = { dispatches: 0, submissions: 0 };
  const restore = observeGpuDevice(device, evidence, { collect: true });
  device.createCommandEncoder().beginComputePass().dispatchWorkgroups(1); device.queue.submit([]);
  assert.equal(evidence.dispatches, 1); assert.equal(evidence.submissions, 1);
  restore(); assert.equal(device.createCommandEncoder, encoder); assert.equal(device.queue.submit, submit);
  assert.deepEqual(parseOffloadEvidence('load_tensors: offloaded 56/66 layers to GPU'), { gpuLayers: 56, totalLayers: 66 });
  assert.equal(parseOffloadEvidence('load_tensors: CPU buffer'), null);
  assert.deepEqual(parseBufferEvidence('load_tensors: WebGPU0 model buffer size = 1024.25 MiB'),
    { backend: 'WebGPU0', kind: 'model', bytes: 1074003968 });
});

test('GPU queue rejection quarantines the native engine before device.lost resolves', async () => {
  let nativeCalls = 0;
  const engine = await createGgufEngine({ wasmUrl: 'https://peercompute.test/wllama.wasm',
    weights: [{ path: 'x.gguf', size: 1 }], reader: {}, initialize(module) {
      Object.assign(module, { wasmMemory: { buffer: new ArrayBuffer(8192) },
        FS: { mkdir() {}, mount() {} }, FS_createDataFile() {},
        MEMFS: { stream_ops: { read() {}, llseek() {}, mmap() {} }, ops_table: { file: { stream: {} } } },
        cwrap(name) { return name === 'wllama_start' ? async () => '{"success":true}' : () => { nativeCalls += 1; }; },
      });
      module.peercomputeOnDevice({ features: new Set(['shader-f16']), lost: new Promise(() => {}),
        queue: { async onSubmittedWorkDone() { throw new Error('device queue rejected'); } }, destroy() {} });
      module.onRuntimeInitialized();
    },
  });
  await assert.rejects(engine.settleGpu(), /Model session lost: GGUF GPU completion failed/);
  assert.equal(engine.evidence.lost, true);
  await assert.rejects(engine.action('cancel', { _name: 'cncl_req', req_id: 1 }), /Model session lost/);
  assert.equal(nativeCalls, 0); engine.close();
});

function fixture({ offload = { gpuLayers: 56, totalLayers: 66 }, abortOnToken = false, trap = false, lateAbort = false, responses } = {}) {
  const calls = [], requests = []; let closed = false, responseIndex = 0, preflight = false;
  const tokens = [];
  const controller = new AbortController();
  const engine = { files: [{ name: 'model.gguf' }], evidence: { offload, dispatches: 0, submissions: 0 },
    memoryBytes() { return 128 * 1024 ** 2; }, close() { calls.push('close-engine'); }, async settleGpu() {},
    async action(name, body) {
      calls.push(name); requests.push({ name, body });
      if (name === 'load') {
        assert.equal(body.n_threads, 1); assert.equal(body.use_mmap, false);
        assert.equal(body.n_ctx, 2048); assert.equal(body.n_batch, 64); assert.equal(body.ctx_shift, false);
        return { success: true, n_ctx: 2048 };
      }
      if (name === 'completion') {
        if (trap) throw new WebAssembly.RuntimeError('unreachable');
        preflight = JSON.parse(body.data_json).stream === false;
        return { success: true, req_id: 7 };
      }
      if (name === 'get_result') {
        engine.evidence.dispatches += 3; engine.evidence.submissions += 1;
        if (lateAbort) controller.abort();
        if (preflight) return { success: true, has_more: false, data_json: JSON.stringify({
          choices: [{ message: { content: 'Discarded' } }], usage: { prompt_tokens: 20, completion_tokens: 1 } }) };
        if (responses) return responses[responseIndex++];
        return { success: true, has_more: abortOnToken, data_json: JSON.stringify({ choices: [{ delta: { content: 'Hello' } }],
          usage: { prompt_tokens: 3, completion_tokens: 1 } }) };
      }
      return { success: true };
    } };
  const runtime = createGgufTaskRuntime({ assertWorker() {}, baseUrl: origin,
    checkCapabilities: async () => ({ adapter: { vendor: 'test' } }),
    createReader() { return { getStats: () => ({ closed }), close() { closed = true; calls.push('close-reader'); } }; },
    loadEngine: async () => engine });
  const load = () => runtime({ command: 'load', sessionId: 'session', manifestCid: cid, manifest: manifest(),
    runtimeAssets: { wasm: '/runtime/wllama.wasm' }, runtimeOptions: { n_gpu_layers: 56 } }, { workerId: 'worker-3' });
  const generate = (options = {}) => runtime({ command: 'generate', sessionId: 'session', requestId: 'request', prompt: 'Hello', maxNewTokens: 8, ...options },
    { signal: controller.signal, emitProgress(event) { if (event.type !== 'token') return;
      tokens.push(event.text); if (abortOnToken) controller.abort(); } });
  return { runtime, load, generate, calls, tokens, requests };
}

test('GGUF managed lifecycle keeps the reader resident and requires owned termination on unload', async () => {
  const f = fixture();
  assert.equal((await f.load()).gpuOffload.gpuLayers, 56);
  const result = await f.generate(); assert.equal(result.text, 'Hello'); assert.equal(result.gpuDispatches, 6);
  assert.equal(result.workerId, 'worker-3');
  assert.equal(result.finishReason, 'unknown'); assert.equal(result.contextTruncated, false);
  assert.deepEqual(f.calls, ['load', 'completion', 'get_result', 'completion', 'get_result']);
  assert.deepEqual(result.contextBudget, { contextTokens: 2048, inputTokens: 20,
    reservedOutputTokens: 8, removedTurns: 0, preflightCalls: 1, measurementTokens: 1, probeTokenBudget: 1 });
  const unloaded = await f.runtime({ command: 'unload', sessionId: 'session' });
  assert.equal(unloaded.requiresWorkerTermination, true);
  assert.deepEqual(f.calls.slice(-2), ['close-reader', 'close-engine']);
});

test('GGUF preserves native completion reasons including EOS at the requested limit', async () => {
  for (const [nativeReason, expected] of [['stop', 'stop'], ['length', 'length'], ['tool_calls', 'unknown'], [undefined, 'unknown']]) {
    const f = fixture({ responses: [
      { success: true, has_more: true, data_json: JSON.stringify({ choices: [{ delta: { content: 'Leaves capture sunlight. ' }, finish_reason: null }] }) },
      { success: true, has_more: false, data_json: JSON.stringify([
        { choices: [{ delta: { content: 'Roots absorb water.' }, finish_reason: nativeReason }], usage: { prompt_tokens: 20, completion_tokens: 1024 } },
        { usage: { prompt_tokens: 20, completion_tokens: 1024 } },
      ]) },
    ] });
    await f.load();
    const result = await f.generate({ prompt: 'Explain how a plant grows.', maxNewTokens: 1024 });
    assert.equal(result.finishReason, expected); assert.equal(result.contextTruncated, false);
    assert.equal(result.text, 'Leaves capture sunlight. Roots absorb water.');
    assert.equal(result.outputTokens, 1024);
    const request = JSON.parse(f.requests.findLast((entry) => entry.name === 'completion').body.data_json);
    assert.equal(request.max_tokens, 1024); assert.equal(request.cache_prompt, false);
    assert.equal(f.calls.filter((name) => name === 'completion').length, 2);
    await f.runtime({ command: 'unload', sessionId: 'session' });
  }
});

test('GGUF rejects excessive output budgets before native work and untyped native errors do not trigger retries', async () => {
  const f = fixture({ responses: [{ success: true, is_error: true, has_more: false,
    data_json: JSON.stringify({ error: { message: 'prompt exceeds context size' } }) }] });
  await f.load();
  await assert.rejects(f.generate({ maxNewTokens: MODEL_POLICY.maxNewTokens + 1 }), /token budget/);
  assert.deepEqual(f.calls, ['load']);
  await assert.rejects(f.generate({ prompt: 'Explain the life cycle of a sunflower.' }), { code: 'ERR_GGUF_NATIVE_FAILURE' });
  assert.equal(f.calls.filter((name) => name === 'completion').length, 2);
  assert.equal(f.calls.at(-1), 'cancel');
  assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'ready');
  await f.runtime({ command: 'unload', sessionId: 'session' });
});

test('GGUF cooperative cancellation cancels the native slot and leaves residency usable', async () => {
  const f = fixture({ abortOnToken: true }); await f.load();
  await assert.rejects(f.generate(), { name: 'AbortError' });
  assert.equal(f.calls.at(-1), 'cancel');
  assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'ready');
});

test('GGUF refuses missing or unexpected actual GPU offload rather than accepting CPU fallback', async () => {
  for (const offload of [null, { gpuLayers: 0, totalLayers: 66 }, { gpuLayers: 55, totalLayers: 66 }]) {
    const f = fixture({ offload }); await assert.rejects(f.load(), /offload/);
    assert.ok(f.calls.includes('close-engine')); assert.ok(f.calls.includes('close-reader'));
  }
});

test('GGUF native traps quarantine the session and late cancelled responses emit no tokens', async () => {
  const trapped = fixture({ trap: true }); await trapped.load();
  await assert.rejects(trapped.generate(), /Model session lost/);
  assert.equal((await trapped.runtime({ command: 'status', sessionId: 'session' })).status, 'lost');
  const cancelled = fixture({ lateAbort: true }); await cancelled.load();
  await assert.rejects(cancelled.generate(), { name: 'AbortError' });
  assert.deepEqual(cancelled.tokens, []); assert.equal(cancelled.calls.at(-1), 'cancel');
});

test('generated engine is static, pinned, and forbids hidden worker construction locally', async () => {
  const source = await readFile(new URL('../../../node_modules/@wllama/wllama/peercompute-engine.js', import.meta.url), 'utf8');
  assert.match(source, /const Worker = class \{ constructor\(\) \{ throw new Error\('Nested GGUF workers are prohibited'\)/);
  assert.match(source, /export function initializeWllamaModule/);
  assert.doesNotMatch(source, /globalThis\.Worker\s*=/);
});
