import { SPEECH_MODEL_CATALOG, speechModelFileUrl } from '../../../../peercompute/src/peercompute/inference/speech/speechCatalog.js';
import { SPEECH_LIMITS, validateSpeechManifest } from '../../../../peercompute/src/peercompute/inference/speech/runtimeDefinition.js';
import { importModelPackage } from '../../../inference/src/modelLibrary.js';

/** Shared resident speech, with an auxiliary-service adapter for older runtimes. */
export function createWorldSpeech({ runtime, runtimeAssets = runtime?.runtimeAssets,
  sourceUrl = speechModelFileUrl, fetchImpl = globalThis.fetch, collectGpuEvidence = false } = {}) {
  if (!runtime?.store || !runtime.computeManager || !runtime.registerAuxiliaryService) throw new Error('World speech requires a managed runtime');
  const entries = Object.values(SPEECH_MODEL_CATALOG);
  const sessions = new Map();
  const pooled = typeof runtime.getServiceForModel === 'function' && typeof runtime.loadStoredModel === 'function'
    && typeof runtime.unload === 'function';
  let preparing, preparationController, closing, closed = false;
  const ownsSession = (state) => state.owned && runtime.getServiceForModel(state.cid) === state.service
    && state.service.getStatus().sessionId === state.sessionId;
  const releaseOwned = async (state) => {
    if (ownsSession(state)) await runtime.unload(state.cid,
      { expectedService: state.service, expectedSessionId: state.sessionId });
  };
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
    let pending, deleting;
    for await (const record of runtime.store.list({ signal })) {
      signal?.throwIfAborted();
      if (record.kind !== 'manifest' || !(record.pinned || record.retain)
          || record.manifest?.model?.repository !== entry.repository) continue;
      let matches = false;
      try { matches = validateSpeechManifest(record.manifest).trusted.id === entry.id; }
      catch { /* A different or incomplete package is never reused. */ }
      if (!matches) continue;
      if (record.status === 'partial') pending = record;
      if (record.status === 'deleting') deleting = record;
      if (record.status === 'complete') return record;
    }
    if (pending) throw Object.assign(new Error('A saved voice package needs local verification. Open Stored Models and choose Verify locally.'),
      { code: 'ERR_MODEL_VERIFICATION_REQUIRED', manifestCid: pending.cid });
    if (deleting) throw new Error('Finish deleting the saved voice package before loading it again.');
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
      const added = new Set();
      try {
        for (const entry of entries) {
          signal?.throwIfAborted();
          if (pooled) {
            const previous = sessions.get(entry.id);
            const current = previous && runtime.getServiceForModel(previous.cid);
            if (current?.getStatus().status === 'ready') {
              if (!ownsSession(previous)) sessions.set(entry.id,
                { cid: previous.cid, service: current, owned: false, sessionId: current.getStatus().sessionId });
              continue;
            }
            const record = await find(entry, signal) ?? await importModelPackage(runtime.store,
              { schema: 'peercompute.artifact.manifest.v1', name: entry.name, files: entry.files,
                model: entry.model, provenance: { ...entry.provenance, license: entry.license } },
              (path) => sourceUrl(entry, entry.files.find((file) => file.path === path)),
              { signal, fetchImpl, onProgress: (event) => onProgress?.({ ...event, modelId: entry.id }) });
            signal?.throwIfAborted();
            const existing = runtime.getServiceForModel(record.cid);
            if (existing && existing.getStatus().status !== 'ready') {
              throw new Error('This voice model is already loading or unloading. Wait for that operation and enable voice again.');
            }
            if (!existing) {
              await runtime.loadStoredModel(record.cid, { signal,
                onProgress: (event) => onProgress?.({ ...event, modelId: entry.id }) });
            }
            const state = { cid: record.cid, owned: !existing, service: runtime.getServiceForModel(record.cid) };
            state.sessionId = state.service?.getStatus().sessionId;
            sessions.set(entry.id, state);
            if (state.owned) added.add(state);
            if (state.service?.getStatus().status !== 'ready') throw new Error('Managed voice model did not become ready');
            continue;
          }
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
        const cleanups = await Promise.allSettled(pooled ? [...added].map(releaseOwned)
          : [...sessions.values()].map(({ service }) => service.unloadModel()));
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
    const models = Object.fromEntries([...sessions].map(([id, state]) => [id,
      (pooled ? runtime.getServiceForModel(state.cid) : state.service)?.getStatus() ?? { status: 'idle', manifestCid: null }]));
    return { status: closed ? 'closed' : preparing ? 'preparing' : entries.every((entry) => models[entry.id]?.status === 'ready') ? 'ready' : 'idle', models };
  }
  function selected(task) {
    if (closed) throw new Error('Speech is disposed');
    const entry = entries.find((item) => item.model.task === task);
    const state = sessions.get(entry.id);
    const service = pooled && state ? runtime.getServiceForModel(state.cid) : state?.service;
    if (service?.getStatus().status !== 'ready') throw new Error('Enable and prepare voice models first');
    return service;
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
          if (pooled) { await releaseOwned(state); return; }
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
