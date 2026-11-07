import test from 'node:test';
import assert from 'node:assert/strict';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { SPEECH_MODEL_CATALOG, speechModelFileUrl } from '../../src/peercompute/inference/speech/speechCatalog.js';
import { normalizeSpeechInput, validateSpeechManifest, speechRuntimeDefinition } from '../../src/peercompute/inference/speech/runtimeDefinition.js';
import { createSpeechTaskHandler } from '../../src/peercompute/inference/speech/modelTask.js';
import { guardSpeechGpu } from '../../src/peercompute/inference/speech/gpuGuard.js';
import { ModelInferenceService } from '../../src/peercompute/inference/ModelInferenceService.js';
const cid = CID.createV1(0x55, await sha256.digest(new Uint8Array([1]))).toString();
const assets = { mjs: 'https://test.local/ort.mjs', wasm: 'https://test.local/ort.wasm' };
const manifest = (id = 'moonshine-tiny-fp32') => {
  const entry = SPEECH_MODEL_CATALOG[id];
  return { schema: 'peercompute.artifact.manifest.v1', model: structuredClone(entry.model), files: entry.files.map((file) => ({ ...file, cid })) };
};

test('speech manifests pin every file, task, dtype, voice and immutable revision', () => {
  for (const entry of Object.values(SPEECH_MODEL_CATALOG)) {
    const value = manifest(entry.id);
    assert.equal(validateSpeechManifest(value).totalBytes, entry.totalBytes);
    assert.match(speechModelFileUrl(entry, entry.files[0]), new RegExp(`/resolve/${entry.revision}/`));
    value.files[0].sha256 = '0'.repeat(64);
    assert.throws(() => validateSpeechManifest(value), /digest/);
    const altered = manifest(entry.id); altered.model.dtype = 'fp16';
    assert.throws(() => validateSpeechManifest(altered), /catalog/);
  }
});
test('speech admission rejects nonfinite, oversized, wrong-rate PCM and unbounded TTS', () => {
  const asr = manifest(), tts = manifest('supertonic-fp32');
  assert.equal(normalizeSpeechInput({ audio: { samples: new Float32Array(1600), sampleRate: 16000 } }, asr).task, 'automatic-speech-recognition');
  for (const audio of [{ samples: new Float32Array(320001), sampleRate: 16000 },
    { samples: new Float32Array(1600), sampleRate: 48000 },
    { samples: new Float32Array(1600).fill(NaN), sampleRate: 16000 }]) {
    assert.throws(() => normalizeSpeechInput({ audio }, asr), /PCM|Speech input/);
  }
  assert.throws(() => normalizeSpeechInput({ prompt: 'a'.repeat(257) }, tts), /sentence/);
  assert.throws(() => normalizeSpeechInput({ prompt: 'Hi', image: {} }, tts), /image/);
  assert.throws(() => normalizeSpeechInput({ prompt: 'Hi', audio: {} }, tts), /text prompt/);
});
test('GPU validation/OOM scopes reject apparent successful output and drain all scopes', async () => {
  const stack = [], popped = []; let lost;
  const device = { pushErrorScope: (kind) => stack.push(kind),
    async popErrorScope() { const kind = stack.pop(); popped.push(kind); return kind === 'out-of-memory' ? new Error('allocation failed') : null; },
    queue: { onSubmittedWorkDone: async () => {} } };
  await assert.rejects(guardSpeechGpu({ getDevice: () => device, operation: async () => ({ audio: new Float32Array(1) }), fail: (error) => { lost = error; } }), /GPU out of memory/);
  assert.equal(lost.cause.message, 'allocation failed'); assert.equal(popped.length, 3); assert.equal(stack.length, 0);
});
test('late speech load after cancellation disposes its model and admits a later fresh load', async () => {
  let finish, disposals = 0;
  const engine = { dispose: async () => { disposals++; }, evidence: {} };
  const handler = createSpeechTaskHandler({ assertWorker() {}, baseUrl: 'https://test.local/',
    createEngine: () => new Promise((resolve) => { finish = () => resolve(engine); }) });
  const abort = new AbortController();
  const pending = handler({ command: 'load', sessionId: 'late', manifest: manifest(), runtimeAssets: assets }, { signal: abort.signal });
  abort.abort(); finish(); await assert.rejects(pending, { name: 'AbortError' }); assert.equal(disposals, 1);
  const next = handler({ command: 'load', sessionId: 'next', manifest: manifest(), runtimeAssets: assets });
  finish(); assert.equal((await next).status, 'ready');
});
test('host facade transfers an owned bounded PCM copy and retains original caller samples', async () => {
  const calls = []; let reserved = false, released = 0;
  const compute = { async reserveWorkerAffinity() { reserved = true; }, async releaseWorkerAffinity() { reserved = false; },
    getWorkerAffinityState: () => ({ reserved, workerId: 'worker-1' }),
    async terminateWorkerAffinity() {}, async cancelTask() {},
    async submitTask(task) { calls.push(task); return task.data.command === 'load' ? { status: 'ready' } : { text: 'hello' }; } };
  const store = { getManifest: async () => manifest(), stat: async () => null, async *openRead() {} };
  const service = new ModelInferenceService({ computeManager: compute, artifactStore: store,
    admission: { acquire: async () => ({ release: async () => { released++; } }) }, runtimeAssets: assets,
    runtimeDefinition: speechRuntimeDefinition, resourceEstimate: { cpuBytes: 1024 ** 3, gpuBytes: 1024 ** 3 }, baseUrl: 'https://test.local/' });
  await service.loadModel({ manifestCid: cid, sessionId: 'speech-test' });
  const samples = new Float32Array(1600).fill(0.2);
  await service.generate({ audio: { samples, sampleRate: 16000 } });
  const task = calls.find((call) => call.data.command === 'generate');
  assert.notEqual(task.data.audio.samples.buffer, samples.buffer);
  assert.deepEqual(task.transferables, [task.data.audio.samples.buffer]);
  assert.equal(samples.length, 1600); await service.dispose(); assert.equal(released, 1);
});
