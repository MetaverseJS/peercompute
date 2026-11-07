import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldSpeech } from '../shared/agents/speech/WorldSpeech.js';
import { SPEECH_MODEL_CATALOG } from '../../peercompute/src/peercompute/inference/speech/speechCatalog.js';
import { validateSpeechManifest } from '../../peercompute/src/peercompute/inference/speech/runtimeDefinition.js';
const cid = 'bafkreiglh4rfdrjhf2xk7id7ggyvbm7qmxd5vg6q3j7mxkeu7mnckgf7w4';
function fixture({ delayLoad = false } = {}) {
  let useCount = 0, created = 0, finish;
  const registered = new Map();
  const runtime = { runtimeAssets: {},
    store: {
      async *list() { for (const entry of Object.values(SPEECH_MODEL_CATALOG)) yield {
        cid, kind: 'manifest', status: 'complete', pinned: true,
        manifest: { schema: 'peercompute.artifact.manifest.v1', model: entry.model, files: entry.files.map((file) => ({ ...file, cid })) },
      }; },
      async acquireUse() { useCount++; let released = false; return () => { if (!released) { released = true; useCount--; } }; },
    },
    computeManager: { async createModelInferenceService(options) {
      assert.equal(options.runtime, 'transformers-speech'); assert.equal(options.resourceBudgets, undefined); created++;
      let state = 'idle', manifestCid = null;
      return { getStatus: () => ({ status: state, manifestCid }),
        async loadModel({ signal, manifestCid: cid }) { state = 'loading';
          if (delayLoad) await new Promise((resolve, reject) => { finish = resolve; signal.addEventListener('abort', () => { state = 'idle'; reject(signal.reason); }, { once: true }); });
          signal?.throwIfAborted(); manifestCid = cid; state = 'ready'; },
        async unloadModel() { state = 'idle'; manifestCid = null; },
        async dispose() { await this.unloadModel(); state = 'closed'; },
        async generate(input) { input.signal?.throwIfAborted(); return input.audio ? { text: 'hello' } : { audio: new Float32Array(100), sampleRate: 44100 }; },
      };
    } },
    registerAuxiliaryService(id, service) { registered.set(id, service); return () => { assert(['idle', 'closed'].includes(service.getStatus().status)); registered.delete(id); }; },
  };
  return { runtime, registered, get useCount() { return useCount; }, get created() { return created; }, finish: () => finish?.() };
}
test('cached prepare reuses packages and keeps per-model use locks until acknowledged unload', async () => {
  const f = fixture(), controller = new AbortController();
  const speech = createWorldSpeech({ runtime: f.runtime, fetchImpl: () => { throw new Error('Unexpected weight fetch'); } });
  assert.equal((await speech.prepare({ signal: controller.signal })).status, 'ready');
  controller.abort(); assert.equal(f.useCount, 2);
  await speech.prepare(); assert.equal(f.created, 2);
  const first = [...f.registered.values()][0]; await first.unloadModel(); assert.equal(f.useCount, 1);
  await speech.dispose(); assert.equal(f.useCount, 0); assert.equal(f.registered.size, 0);
});
test('dispose aborts pending preparation and waits for use-lease cleanup', async () => {
  const f = fixture({ delayLoad: true }), speech = createWorldSpeech({ runtime: f.runtime });
  const loading = speech.prepare(); loading.catch(() => {});
  while (!f.useCount) await new Promise((resolve) => setTimeout(resolve, 0));
  await speech.dispose(); await assert.rejects(loading);
  assert.equal(f.useCount, 0); assert.equal(f.registered.size, 0);
  await assert.rejects(speech.prepare(), /disposed/);
});
test('download adapter binds each pinned package and file before requesting source bytes', async () => {
  const f = fixture(); let observed = false;
  f.runtime.store.list = async function* () {};
  f.runtime.store.withRetention = (callback) => callback({ async importFile(source) { for await (const chunk of source) void chunk; } });
  const speech = createWorldSpeech({ runtime: f.runtime, sourceUrl(entry, file) {
    assert.equal(entry.id, 'moonshine-tiny-fp32');
    assert.equal(file.path, 'onnx/encoder_model.onnx');
    assert.equal(file.sha256.length, 64); observed = true;
    throw new Error('Intentional source stop');
  } });
  await assert.rejects(speech.prepare(), /Intentional source stop/);
  assert.equal(observed, true); await speech.dispose();
});
test('new speech imports contain only valid artifact manifest fields and pinned model closure', async () => {
  const f = fixture(); let imported = 0;
  f.runtime.store.list = async function* () {};
  f.runtime.store.withRetention = (callback) => callback({
    async importFile(source, options) { return { cid, size: options.expectedSize, sha256: options.expectedSha256 }; },
    async importManifest(manifest) { validateSpeechManifest(manifest); imported++; return { cid, manifest }; },
  });
  const speech = createWorldSpeech({ runtime: f.runtime }); await speech.prepare();
  assert.equal(imported, 2); await speech.dispose();
});
