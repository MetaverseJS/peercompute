import { SPEECH_MODEL_CATALOG, speechModelFileUrl } from '../../../../peercompute/src/peercompute/inference/speech/speechCatalog.js';
import { SPEECH_LIMITS, validateSpeechManifest } from '../../../../peercompute/src/peercompute/inference/speech/runtimeDefinition.js';
import { importModelPackage } from '../../../inference/src/modelLibrary.js';

/** Two auxiliary services on the world's existing manager and broker. No global budget changes. */
export function createWorldSpeech({ runtime, runtimeAssets = runtime?.runtimeAssets,
  sourceUrl = speechModelFileUrl, fetchImpl = globalThis.fetch, collectGpuEvidence = false } = {}) {
  if (!runtime?.store || !runtime.computeManager || !runtime.registerAuxiliaryService) throw new Error('World speech requires a managed runtime');
  const entries = Object.values(SPEECH_MODEL_CATALOG);
  const sessions = new Map();
  let preparing, preparationController, closing, closed = false;
  async function make(entry) {
    let state = sessions.get(entry.id);
    if (state) return state;
    const service = await runtime.computeManager.createModelInferenceService({ artifactStore: runtime.store,
      runtime: 'transformers-speech', runtimeAssets, collectGpuEvidence,
      resourceEstimate: { cpuBytes: SPEECH_LIMITS.residentBytes, gpuBytes: SPEECH_LIMITS.residentBytes },
      loadTimeoutMs: 300000, generationTimeoutMs: 120000 });
    state = { service, releaseUse: null, cid: null };
    const unload = service.unloadModel.bind(service);
    service.unloadModel = async () => {
      const result = await unload();
      await state.releaseUse?.(); state.releaseUse = null;
      return result;
    };
    try { state.unregister = runtime.registerAuxiliaryService(`speech-${entry.id}`, service); }
    catch (error) { await service.dispose(); throw error; }
    sessions.set(entry.id, state); return state;
  }
  async function find(entry, signal) {
    for await (const record of runtime.store.list({ signal })) {
      signal?.throwIfAborted();
      if (record.kind !== 'manifest' || record.status !== 'complete' || !record.pinned
          || record.manifest?.model?.repository !== entry.repository) continue;
      try { if (validateSpeechManifest(record.manifest).trusted.id === entry.id) return record; }
      catch { /* A different or incomplete package is never reused. */ }
    }
    return null;
  }
  async function prepare({ signal, onProgress } = {}) {
    if (closed) throw new Error('Speech is disposed');
    signal?.throwIfAborted();
    if (preparing) return preparing;
    const callerSignal = signal;
    const controller = new AbortController(); preparationController = controller;
    const abort = () => controller.abort(callerSignal.reason);
    callerSignal?.addEventListener('abort', abort, { once: true });
    signal = controller.signal;
    const pending = (async () => {
      try {
        for (const entry of entries) {
          signal?.throwIfAborted();
          const state = await make(entry);
          if (state.service.getStatus().status === 'ready') continue;
          await state.service.unloadModel();
          const record = await find(entry, signal) ?? await importModelPackage(runtime.store,
            { schema: 'peercompute.artifact.manifest.v1', name: entry.name, files: entry.files,
              model: entry.model, provenance: { ...entry.provenance, license: entry.license } },
            (path) => sourceUrl(entry, entry.files.find((file) => file.path === path)),
            { signal, fetchImpl, onProgress: (event) => onProgress?.({ ...event, modelId: entry.id }) });
          signal?.throwIfAborted(); state.cid = record.cid;
          state.releaseUse = await runtime.store.acquireUse(record.cid, { signal });
          try {
            await state.service.loadModel({ manifestCid: record.cid, signal,
              onProgress: (event) => onProgress?.({ ...event, modelId: entry.id }) });
          } catch (error) {
            if (state.service.getStatus().status === 'idle') { await state.releaseUse?.(); state.releaseUse = null; }
            throw error;
          }
        }
        return { ...getStatus(), status: 'ready' };
      } catch (error) {
        const cleanups = await Promise.allSettled([...sessions.values()].map(({ service }) => service.unloadModel()));
        const failures = cleanups.filter((item) => item.status === 'rejected').map((item) => item.reason);
        if (failures.length) throw new AggregateError([error, ...failures], 'Speech preparation failed and cleanup is incomplete');
        throw error;
      }
    })();
    preparing = pending;
    try { return await pending; } finally {
      callerSignal?.removeEventListener('abort', abort);
      if (preparing === pending) { preparing = null; preparationController = null; }
    }
  }
  function getStatus() {
    const models = Object.fromEntries([...sessions].map(([id, state]) => [id, state.service.getStatus()]));
    return { status: closed ? 'closed' : preparing ? 'preparing' : entries.every((entry) => models[entry.id]?.status === 'ready') ? 'ready' : 'idle', models };
  }
  function selected(task) {
    if (closed) throw new Error('Speech is disposed');
    const entry = entries.find((item) => item.model.task === task);
    const state = sessions.get(entry.id);
    if (state?.service.getStatus().status !== 'ready') throw new Error('Enable and prepare voice models first');
    return state.service;
  }
  return {
    prepare, getStatus,
    async transcribe({ samples, sampleRate }, { signal, onProgress } = {}) {
      return selected('automatic-speech-recognition').generate({ audio: { samples, sampleRate }, signal, onProgress });
    },
    async synthesize(text, { signal, onProgress } = {}) {
      return selected('text-to-speech').generate({ prompt: text, signal, onProgress });
    },
    async dispose() {
      if (closing) return closing;
      closed = true;
      preparationController?.abort('Speech is disposing');
      const pending = (async () => {
        // A concurrent prepare cannot install an untracked service after teardown.
        await preparing?.catch(() => {});
        const results = await Promise.allSettled([...sessions.values()].map(async (state) => {
          await state.service.dispose(); await state.releaseUse?.(); state.releaseUse = null;
          state.unregister?.();
        }));
        const failures = results.filter((item) => item.status === 'rejected').map((item) => item.reason);
        if (failures.length) throw new AggregateError(failures, 'Speech cleanup is incomplete');
        sessions.clear();
      })();
      closing = pending;
      try { await pending; } finally { if (closing === pending) closing = null; }
    },
  };
}
