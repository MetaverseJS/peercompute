import test from 'node:test';
import assert from 'node:assert/strict';
import { MODEL_ARTIFACT_CATALOG } from '../../src/peercompute/artifacts/modelArtifactCatalog.js';
import { createGgufTaskRuntime } from '../../src/peercompute/inference/gguf/modelTask.js';
import { dropOldestGgufTurn, fitGgufContext } from '../../src/peercompute/inference/gguf/contextBudget.js';

const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const done = (data) => ({ success: true, has_more: false, data_json: JSON.stringify(data) });
const measured = (count) => done({ choices: [{ message: { content: 'PRIVATE probe text' } }],
  usage: { prompt_tokens: count, completion_tokens: 1 } });
const overflow = (count, limit = 256) => ({ ...done({ type: 'exceed_context_size_error',
  message: 'PRIVATE native prompt detail', n_prompt_tokens: count, n_ctx: limit }), is_error: true });

function fixture({ contextTokens = 256, requestedContextTokens = 2048, preflight = () => measured(20), generation,
  onAction, onProgress, settleGpu } = {}) {
  const catalog = MODEL_ARTIFACT_CATALOG['qwen3.8-27b-georefine-d14-gguf'];
  const manifest = { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(catalog.model),
    files: catalog.files.map(({ path, size, sha256 }) => ({ path, size, sha256: sha256 ?? 'a'.repeat(64), cid })) };
  const calls = [], requests = [], progress = [], controller = new AbortController();
  let request, requestId = 0, nativePoll = 0, settles = 0;
  const engine = { files: [{ name: 'model.gguf' }],
    evidence: { offload: { gpuLayers: 56, totalLayers: 66 }, dispatches: 0, submissions: 0 },
    memoryBytes: () => 100, close() {},
    async settleGpu() { settles += 1; await settleGpu?.(settles); },
    async action(name, body) {
      calls.push(name);
      if (name === 'load') return { success: true, n_ctx: contextTokens };
      if (name === 'completion') {
        request = JSON.parse(body.data_json); nativePoll = 0; requests.push(request);
        await onAction?.(name, request, controller);
        return { success: true, req_id: ++requestId };
      }
      if (name === 'get_result') {
        await onAction?.(name, request, controller);
        nativePoll += 1;
        return request.stream === false ? preflight(request, nativePoll)
          : generation?.(request, nativePoll) ?? done({ choices: [{ delta: { content: 'OK' }, finish_reason: 'stop' }],
            usage: { prompt_tokens: 20, completion_tokens: 1 } });
      }
      return { success: true };
    },
  };
  const runtime = createGgufTaskRuntime({ assertWorker() {}, baseUrl: 'https://peercompute.test/worker.js',
    checkCapabilities: async () => ({}), createReader: () => ({ getStats: () => ({}), close() {} }),
    loadEngine: async () => engine });
  const load = () => runtime({ command: 'load', sessionId: 'session', manifestCid: cid, manifest,
    runtimeAssets: { wasm: '/runtime/wllama.wasm' }, runtimeOptions: { n_gpu_layers: 56, n_ctx: requestedContextTokens } });
  const generate = (data = {}, signal = controller.signal) => runtime({ command: 'generate',
    sessionId: 'session', requestId: 'request', prompt: 'Current prompt', maxNewTokens: 64, ...data },
  { signal, emitProgress(event) { progress.push(event); onProgress?.(event, controller); } });
  return { load, generate, runtime, requests, calls, progress, controller, get settles() { return settles; } };
}

test('native counts trim complete oldest turns with output reserve, preserving identity and durable input', async () => {
  const messages = [
    { role: 'system', content: 'Identity and goals' }, { role: 'user', content: 'Old question' },
    { role: 'assistant', content: 'Old answer' }, { role: 'system', content: 'Additional instruction' },
    { role: 'user', content: 'Recent question' }, { role: 'assistant', content: 'Recent answer' },
    { role: 'user', content: 'Current prompt' },
  ];
  const before = structuredClone(messages);
  const f = fixture({ preflight: ({ messages: projected }) => {
    const users = projected.filter((message) => message.role === 'user').length;
    return users === 3 ? overflow(300) : measured(users === 2 ? 230 : 120);
  } });
  assert.equal((await f.load()).effectiveContextTokens, 256);
  const result = await f.generate({ messages });
  assert.deepEqual(messages, before);
  assert.equal(result.contextTruncated, true);
  assert.deepEqual(result.contextBudget, { contextTokens: 256, inputTokens: 120,
    reservedOutputTokens: 64, removedTurns: 2, preflightCalls: 3, measurementTokens: 2, probeTokenBudget: 1 });
  assert.deepEqual(f.requests.map((request) => request.max_tokens), [1, 1, 1, 64]);
  assert.deepEqual(f.requests.at(-1).messages, [messages[0], messages[3], messages[6]]);
  assert.ok(f.requests.every((request) => request.cache_prompt === false && request.chat_template_kwargs.enable_thinking === false));
  assert.ok(f.requests.slice(0, -1).every((request) => request.stream === false));
  assert.deepEqual(f.progress.filter((event) => event.type === 'context-budget').map((event) => event.overflow), [true, true, false]);
  assert.deepEqual(f.progress.filter((event) => event.type === 'context-budget').map((event) => event.probeOutputTokens), [0, 1, 1]);
  assert.ok(!JSON.stringify(f.progress).includes('PRIVATE'));
  assert.deepEqual(f.progress.filter((event) => event.type === 'token').map((event) => event.text), ['OK']);
  assert.equal(f.settles, 4);
});

test('exact output reserve boundary fits and measured native capacity controls admission', async () => {
  const f = fixture({ preflight: () => measured(200) }); await f.load();
  const result = await f.generate({ maxNewTokens: 56 });
  assert.equal(result.contextTruncated, false); assert.equal(result.contextBudget.contextTokens, 256);
  await assert.rejects(f.generate({ maxNewTokens: 57 }), { code: 'ERR_MODEL_CONTEXT_BUDGET' });
  assert.deepEqual(f.requests.map((request) => request.max_tokens), [1, 56, 1]);
});

test('GGUF fitting preserves current observation data with the current question and never drops unanswered fixed input', async () => {
  const messages = [{ role: 'system', content: 'Resident identity' },
    { role: 'user', content: 'Older question' }, { role: 'assistant', content: 'Older answer' },
    { role: 'user', content: 'Attributed current world observations' }, { role: 'user', content: 'Current question' }];
  const fixed = [messages[0], ...messages.slice(-2)], original = structuredClone(messages);
  assert.deepEqual(dropOldestGgufTurn(messages), fixed); assert.equal(dropOldestGgufTurn(fixed), null);
  for (const fits of [true, false]) {
    const f = fixture({ preflight: ({ messages: input }) => measured(fits && input.length === fixed.length ? 120 : 300) });
    await f.load();
    if (fits) {
      const result = await f.generate({ messages }); assert.equal(result.contextTruncated, true);
      assert.equal(result.contextBudget.removedTurns, 1); assert.deepEqual(f.requests.at(-1).messages, fixed);
    } else {
      await assert.rejects(f.generate({ messages }), { code: 'ERR_MODEL_CONTEXT_BUDGET' });
      assert.equal(f.requests.length, 2); assert(f.requests.every(request => request.stream === false));
      assert.equal(f.progress.filter(event => event.type === 'token').length, 0);
    }
    assert.deepEqual(f.requests[1].messages, fixed); assert.deepEqual(messages, original);
    await f.runtime({ command: 'unload', sessionId: 'session' });
  }
});

test('native capacity padding is measured without rejecting a valid bounded load', async () => {
  const f = fixture({ requestedContextTokens: 64, contextTokens: 256, preflight: () => measured(100) });
  assert.equal((await f.load()).effectiveContextTokens, 256);
  assert.equal((await f.generate()).contextBudget.contextTokens, 256);
});

test('fixed instructions/current prompt overflow is recoverable without mutation or visible generation', async () => {
  let oversized = true;
  const f = fixture({ preflight: () => oversized ? overflow(400) : measured(20) }); await f.load();
  const messages = [{ role: 'system', content: 'Identity PRIVATE' }, { role: 'user', content: 'Current PRIVATE' }];
  await assert.rejects(f.generate({ messages }), (error) => error.code === 'ERR_MODEL_CONTEXT_BUDGET'
    && !error.message.includes('PRIVATE') && /400/.test(error.message) && /256/.test(error.message));
  assert.equal(f.requests.length, 1); assert.deepEqual(f.requests[0].messages, messages);
  assert.equal(f.progress.filter((event) => event.type === 'token').length, 0);
  assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'ready');
  oversized = false;
  assert.equal((await f.generate()).text, 'OK');
});

test('load refuses missing, invalid or implausibly enlarged native context capacity', async () => {
  for (const contextTokens of [undefined, null, 0, -1, 3.5, 4096]) {
    const f = fixture({ contextTokens: contextTokens === undefined ? null : contextTokens });
    await assert.rejects(f.load(), /context capacity/);
  }
});

test('measurement must prove its one-token bound and valid native usage', async () => {
  const invalid = [
    done({ choices: [{ message: { content: { private: 'PRIVATE invalid output' } } }], usage: { prompt_tokens: 20, completion_tokens: 1 } }),
    done({ choices: [{ message: { reasoning_content: { private: 'PRIVATE invalid output' } } }], usage: { prompt_tokens: 20, completion_tokens: 1 } }),
    done({ usage: { prompt_tokens: 20, completion_tokens: 2 } }),
    done({ usage: { prompt_tokens: 20 } }), measured(-1), measured(1.5), done({}),
  ];
  for (const response of invalid) {
    const f = fixture({ preflight: () => response }); await f.load();
    await assert.rejects(f.generate(), (error) => error.code !== 'ERR_MODEL_CONTEXT_BUDGET' && !error.message.includes('PRIVATE'));
    assert.equal(f.requests.length, 1); assert.equal(f.progress.length, 0);
  }
});

test('untyped, malformed and non-context native errors are prompt-safe and never retried', async () => {
  const invalid = [
    { ...done({ message: 'PRIVATE context budget exceeded' }), is_error: true },
    { ...done({ type: 'invalid_request_error', message: 'PRIVATE prompt' }), is_error: true },
    { ...overflow(300), data_json: '{ PRIVATE malformed JSON' },
    overflow('300'), overflow(300, 4096), overflow(20),
  ];
  for (const response of invalid) {
    const f = fixture({ preflight: () => response }); await f.load();
    await assert.rejects(f.generate(), (error) => error.code !== 'ERR_MODEL_CONTEXT_BUDGET' && !error.message.includes('PRIVATE'));
    assert.equal(f.requests.length, 1); assert.equal(f.settles, 1);
  }
});

test('native context errors during visible generation never become recoverable preflight errors or retries', async () => {
  const f = fixture({ generation: (_request, poll) => poll === 1
    ? { ...done({ choices: [{ delta: { content: 'Partial' } }] }), has_more: true } : overflow(300) });
  await f.load();
  await assert.rejects(f.generate(), { code: 'ERR_GGUF_NATIVE_CONTEXT' });
  assert.deepEqual(f.requests.map((request) => request.max_tokens), [1, 64]);
  assert.deepEqual(f.progress.filter((event) => event.type === 'token').map((event) => event.text), ['Partial']);
});

test('cancellation in preflight start/read and after measurement never dispatches visible generation', async () => {
  for (const phase of ['completion', 'get_result', 'measurement']) {
    const f = fixture({ onAction(name, _request, controller) { if (name === phase) controller.abort(); },
      onProgress(event, controller) { if (phase === 'measurement' && event.type === 'context-budget') controller.abort(); } });
    await f.load(); await assert.rejects(f.generate(), { name: 'AbortError' });
    assert.deepEqual(f.requests.map((request) => request.max_tokens), [1]);
    assert.equal(f.settles, 1); assert.equal(f.calls.includes('cancel'), phase !== 'measurement');
    assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'ready');
  }
});

test('cancelled preflight waits for GPU settlement before reopening resident admission', async () => {
  let release, settling;
  const entered = new Promise((resolve) => { settling = resolve; });
  const f = fixture({ onAction(name, _request, controller) { if (name === 'get_result') controller.abort(); },
    settleGpu: () => new Promise((resolve) => { release = resolve; settling(); }) });
  await f.load(); const request = f.generate(); const rejected = assert.rejects(request, { name: 'AbortError' });
  await entered;
  assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'generating');
  await assert.rejects(f.generate({}, new AbortController().signal), /busy/);
  release(); await rejected;
  assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'ready');
});

test('GPU settlement failure during preflight quarantines the resident', async () => {
  const f = fixture({ settleGpu() { throw new Error('PRIVATE GPU detail'); } }); await f.load();
  await assert.rejects(f.generate(), /Model session lost while settling GGUF inference/);
  assert.equal((await f.runtime({ command: 'status', sessionId: 'session' })).status, 'lost');
  assert.equal(f.requests.length, 1);
});

test('history projection is bounded and retains all systems and newest user turn', async () => {
  const messages = [{ role: 'system', content: 'Identity' }];
  for (let i = 0; i < 30; i += 1) messages.push({ role: 'user', content: String(i) }, { role: 'assistant', content: `Answer ${i}` });
  messages.push({ role: 'user', content: 'Current' });
  let measuredCalls = 0;
  await assert.rejects(fitGgufContext({ messages, contextTokens: 256, reservedOutputTokens: 64,
    async measure(projected) { measuredCalls += 1; assert.equal(projected[0].content, 'Identity');
      assert.equal(projected.at(-1).content, 'Current'); return { inputTokens: 300, contextTokens: 256, probeOutputTokens: 0 }; } }),
  { code: 'ERR_MODEL_CONTEXT_BUDGET' });
  assert.equal(measuredCalls, 31); assert.equal(messages.length, 62);
  assert.equal(dropOldestGgufTurn([{ role: 'system', content: 'Identity' }, { role: 'user', content: 'Current' }]), null);
});
