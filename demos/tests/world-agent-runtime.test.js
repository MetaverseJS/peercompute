import test from 'node:test';
import assert from 'node:assert/strict';
import { attachModelRuntimeController } from '../inference/src/modelRuntimeController.js';
import { localState, PEER_INFERENCE_PROTOCOL_V2 } from '../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { routeAgentTask } from '../../peercompute/src/peercompute/agents/AgentRouter.js';
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
test('stored speech is discoverable by capable peers without becoming a text or vision agent target', async () => {
  const f = fixture(); await f.controller.initialize(); await f.runtime.refreshPeers();
  assert.equal((await f.runtime.listStoredModels())[0].loaded, true);
  const state = f.callbacks.getLocalState();
  assert.equal(state.sharedModels.length, 1);
  const speech = state.sharedModels[0];
  assert.equal(speech.manifestCid, cid);
  assert.equal(speech.task, 'automatic-speech-recognition');
  assert.deepEqual(speech.modalities, ['audio']);
  assert.deepEqual(speech.outputModalities, ['text']);
  assert.equal(localState(state).sharedModels[0].manifestCid, cid);
  assert.deepEqual(localState(state, true, { protocol: PEER_INFERENCE_PROTOCOL_V2 }).sharedModels, []);
  assert.equal(state.hostedModel, null, 'a stored legacy auxiliary package is not automatically an inference host');
  assert.deepEqual(state.hostedModels, []);
  for (const task of ['text-generation', 'image-text-to-text']) {
    assert.throws(() => routeAgentTask({ task, inferenceMode: 'network-assisted',
      candidates: [{ ...speech, key: `peer:${cid}`, local: false, available: true }] }), { code: 'ERR_AGENT_NO_MODEL' });
  }
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
