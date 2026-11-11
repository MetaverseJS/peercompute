import test from 'node:test';
import assert from 'node:assert/strict';
import { GGUF_MODEL_CATALOG } from '../../src/peercompute/artifacts/ggufModelCatalog.js';
import { createGgufTaskRuntime } from '../../src/peercompute/inference/gguf/modelTask.js';
import { normalizeGgufGenerationInput, validateGgufManifest, validateGgufRuntimeOptions } from '../../src/peercompute/inference/gguf/runtimeDefinition.js';

const cid = 'bafkreia44oqmad5qe6j2dxe2gamyk5567hthj7lefwuwivfgm6u4o2oh3q';
const mediaId = 'gemma4-12b-uncensored-q4-k-m-multimodal-gguf';
function manifest(id = mediaId) {
  const entry = GGUF_MODEL_CATALOG[id];
  assert.ok(entry, 'The pinned multimodal catalog entry must exist');
  return { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model),
    files: entry.files.map(({ path, size, sha256 }) => ({ path, size, sha256, cid })) };
}
const image = () => ({ width: 1, height: 1, channels: 4, data: new Uint8Array([4, 5, 6, 255]) });
const audio = () => ({ samples: new Float32Array(1600), sampleRate: 16000 });

test('Gemma4 media admission separates trusted projector from text weights and rejects relabeling or missing files', () => {
  const source = manifest(), admitted = validateGgufManifest(source);
  assert.equal(admitted.weights.length, 1); assert.equal(admitted.projector.path, source.model.ggufMedia.projectorPath);
  assert.notEqual(admitted.weights[0].path, admitted.projector.path);
  assert.equal(admitted.mediaProfile.imageMaxTokens, 280);
  assert.equal(validateGgufRuntimeOptions({}, admitted.mediaProfile).n_batch, 512);
  assert.equal(validateGgufRuntimeOptions({ n_batch: 64 }, admitted.mediaProfile).n_batch, 512);
  assert.throws(() => validateGgufRuntimeOptions({ n_batch: 128 }, admitted.mediaProfile), /bounds/);
  assert.throws(() => validateGgufRuntimeOptions({ n_ctx: 256 }, admitted.mediaProfile), /bounds/);
  assert.throws(() => validateGgufRuntimeOptions({ n_batch: 512 }), /bounds/);
  for (const alter of [
    (m) => { m.files = m.files.filter((file) => file.path !== admitted.projector.path); },
    (m) => { m.files.find((file) => file.path === admitted.projector.path).sha256 = '0'.repeat(64); },
    (m) => { m.model.ggufMedia.profile = 'untrusted'; },
    (m) => { m.model.ggufMedia.projectorPath = admitted.weights[0].path; },
    (m) => { delete m.model.ggufMedia; },
    (m) => { m.model.modalities = ['text']; },
  ]) {
    const changed = structuredClone(source); alter(changed); assert.throws(() => validateGgufManifest(changed));
  }
  const text = manifest('gemma4-12b-uncensored-q4-k-m-gguf');
  assert.equal(validateGgufManifest(text).projector, undefined);
  assert.throws(() => normalizeGgufGenerationInput({ prompt: 'Look', image: image() }, text), /text only/);
  assert.throws(() => normalizeGgufGenerationInput({ audio: audio() }, text), /text only/);
  assert.equal(normalizeGgufGenerationInput({ audio: audio() }, source).messages[0].content, 'Transcribe this audio.');
});

function fixture({ loadResponse = {}, overflowHistory = false, abortPreflight = false } = {}) {
  const requests = [], progress = [], closed = [], controller = new AbortController();
  let loadParameters, current, serial = 0;
  const engine = { files: [{ name: 'text.gguf' }], projectorFile: { name: 'mmproj.gguf' },
    evidence: { offload: { gpuLayers: 49, totalLayers: 49 }, dispatches: 0, submissions: 0 },
    memoryBytes: () => 128 * 1024 ** 2, close() { closed.push('engine'); }, async settleGpu() {},
    async action(name, body) {
      requests.push({ name, body });
      if (name === 'load') return { success: true, n_ctx: 2048, n_batch: 512, n_ubatch: 512,
        has_image_input: true, has_audio_input: true, media_marker: '<__media_fixture__>', ...loadResponse };
      if (name === 'completion') {
        current = JSON.parse(body.data_json);
        if (abortPreflight && current.stream === false) controller.abort();
        return { success: true, req_id: ++serial };
      }
      if (name === 'get_result') {
        engine.evidence.dispatches++; engine.evidence.submissions++;
        const inputTokens = overflowHistory && current.messages.length > 2 ? 2041 : 320;
        return { success: true, has_more: false, data_json: JSON.stringify({
          choices: [{ message: { content: current.stream ? 'A different scene.' : 'Discard this probe.' }, finish_reason: 'stop' }],
          usage: { prompt_tokens: inputTokens, completion_tokens: 1 },
        }) };
      }
      return { success: true };
    },
  };
  const runtime = createGgufTaskRuntime({ assertWorker() {}, baseUrl: 'https://test.local/worker.js',
    checkCapabilities: async () => ({ adapter: { vendor: 'test' } }),
    createReader: () => ({ close() { closed.push('reader'); }, getStats: () => ({}) }),
    loadEngine: async (parameters) => { loadParameters = parameters; return engine; },
  });
  return { runtime, requests, progress, closed,
    get loadParameters() { return loadParameters; },
    load: () => runtime({ command: 'load', sessionId: 'media-session', manifestCid: cid,
      manifest: manifest(), runtimeAssets: { wasm: '/runtime/wllama.wasm' }, runtimeOptions: { n_batch: 64 } }, { workerId: 'media-worker' }),
    generate: (input = {}) => runtime({ command: 'generate', sessionId: 'media-session', requestId: 'media-request',
      prompt: 'What do you see and hear?', image: image(), audio: audio(), maxNewTokens: 8, ...input },
    { signal: controller.signal, emitProgress(event) { progress.push(event); } }),
  };
}

test('managed Gemma4 requests load the distinct projector and pair identical media through measured history fitting and completion', async () => {
  const f = fixture({ overflowHistory: true });
  assert.deepEqual((await f.load()).inputModalities, ['text', 'image', 'audio']);
  assert.equal(f.loadParameters.weights.length, 1); assert.equal(f.loadParameters.projector.path, 'mmproj-gemma4-unified-f16.gguf');
  const nativeLoad = f.requests[0].body;
  assert.deepEqual(nativeLoad.model_paths, ['models/text.gguf']); assert.equal(nativeLoad.mmproj_path, 'models/mmproj.gguf');
  assert.equal(nativeLoad.mmproj_offload, true); assert.equal(nativeLoad.image_min_tokens, 70); assert.equal(nativeLoad.image_max_tokens, 280);
  assert.equal(nativeLoad.n_batch, 512); assert.equal(nativeLoad.n_ubatch, 512);
  const result = await f.generate({ messages: [{ role: 'system', content: 'Stay helpful.' },
    { role: 'user', content: 'Earlier scene' }, { role: 'assistant', content: 'Earlier reply' },
    { role: 'user', content: 'What is new?' }] });
  assert.equal(result.text, 'A different scene.'); assert.equal(result.contextTruncated, true);
  const completions = f.requests.filter((request) => request.name === 'completion');
  assert.equal(completions.length, 3);
  assert.deepEqual(completions.map((request) => JSON.parse(request.body.data_json).messages.length), [4, 2, 2]);
  for (const request of completions) {
    assert.equal(request.body.files.length, 2);
    assert.deepEqual([...request.body.files[0].subarray(0, 4)], [137, 80, 78, 71]);
    assert.equal(new TextDecoder().decode(request.body.files[1].subarray(0, 4)), 'RIFF');
    assert.deepEqual(JSON.parse(request.body.data_json).messages.at(-1).content.map((part) => part.text),
      ['What is new?', '<__media_fixture__>', '<__media_fixture__>']);
  }
  assert.deepEqual(f.progress.filter((event) => event.type === 'token').map((event) => event.text), ['A different scene.']);
  await f.generate({ prompt: 'A new text question.', image: undefined, audio: undefined });
  assert.deepEqual(f.requests.findLast((request) => request.name === 'completion').body.files, []);
  await assert.rejects(f.generate({ prompt: '<__media_fixture__>' }), /reserved/);
  assert.equal((await f.runtime({ command: 'status', sessionId: 'media-session' })).status, 'ready');
});

test('missing native modality/batch/marker attestation fails the load and closes its owned resources', async () => {
  for (const loadResponse of [{ has_image_input: false }, { has_audio_input: false }, { n_ubatch: 64 },
    { n_batch: 128 }, { media_marker: '' }]) {
    const f = fixture({ loadResponse });
    await assert.rejects(f.load(), /required image\/audio/);
    assert.deepEqual(f.closed, ['reader', 'engine']);
  }
});

test('media preflight cancellation cancels native work without visible output or leaking media into another request', async () => {
  const f = fixture({ abortPreflight: true }); await f.load();
  await assert.rejects(f.generate(), { name: 'AbortError' });
  assert.equal(f.requests.filter((request) => request.name === 'completion').length, 1);
  assert.equal(f.requests.at(-1).name, 'cancel');
  assert.equal(f.progress.some((event) => event.type === 'token'), false);
  assert.equal((await f.runtime({ command: 'status', sessionId: 'media-session' })).status, 'ready');
});
