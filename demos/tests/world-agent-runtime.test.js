import test from 'node:test';
import assert from 'node:assert/strict';
import { attachModelRuntimeController } from '../inference/src/modelRuntimeController.js';
const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
function fixture({ failUnload = false } = {}) {
  const calls = []; let callbacks, present = true, loaded = true;
  const manifest = { name: 'Speech', model: { runtime: 'transformers-speech', repository: 'test/speech', revision: 'a'.repeat(40),
    task: 'automatic-speech-recognition', modalities: ['audio'], outputModalities: ['text'] }, files: [{ size: 100 }] };
  const idle = { getStatus: () => ({ status: 'idle' }) };
  const runtime = { service: idle, services: { reasoning: idle, speech: { getStatus: () => ({ status: loaded ? 'ready' : 'idle', manifestCid: loaded ? cid : null }) } },
    networkReady: true, artifactReady: true,
    networkManager: { isConnected: true, getPublishedArtifactCids: () => [cid],
      createPeerInferenceService: async (options) => { callbacks = options; return { setHostingEnabled: async () => {}, refresh: async () => ({}), listModels: () => [], listHosts: () => [] }; },
      releasePeerInferenceService: async () => {} },
    store: { async *list() { if (present) yield { cid, manifest, pinned: true, kind: 'manifest', status: 'complete' }; },
      stat: async () => present ? { cid, manifest, kind: 'manifest' } : undefined,
      remove: async () => { calls.push('remove'); assert.equal(loaded, false); present = false; return { removed: true, freedBytes: 100 }; } },
    publish: async () => calls.push('publish'), withdraw: async () => calls.push('withdraw'), dispose: async () => {},
    unloadAuxiliaryModel: async (target) => { assert.equal(target, cid); calls.push('speech-unload'); if (failUnload) throw new Error('Cleanup failed'); loaded = false; return true; },
  };
  const controller = attachModelRuntimeController(runtime, { catalog: {} });
  return { runtime, controller, calls, get callbacks() { return callbacks; }, get present() { return present; } };
}
test('stored speech is visible and deletable but does not poison the text/image inference directory', async () => {
  const f = fixture(); await f.controller.initialize(); await f.runtime.refreshPeers();
  assert.equal((await f.runtime.listStoredModels())[0].loaded, true);
  assert.deepEqual(f.callbacks.getLocalState().sharedModels, []);
  const result = await f.runtime.deleteStoredModel(cid);
  assert.equal(result.unloaded, true); assert.equal(f.present, false);
  assert(f.calls.indexOf('speech-unload') < f.calls.indexOf('remove')); await f.runtime.dispose();
});
test('failed speech cleanup preserves the stored package for retry', async () => {
  const f = fixture({ failUnload: true }); await f.controller.initialize();
  await assert.rejects(f.runtime.deleteStoredModel(cid), /Cleanup failed/);
  assert.equal(f.present, true); assert.equal(f.calls.includes('remove'), false);
  assert.equal((await f.runtime.listStoredModels())[0].cleanupPending, true); await f.runtime.dispose();
});
