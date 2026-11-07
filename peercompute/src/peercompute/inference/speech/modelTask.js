import { createSpeechEngine } from './engine.js';
import { normalizeSpeechInput, validateSpeechManifest } from './runtimeDefinition.js';
import { throwIfAborted, validateSessionId, validateRuntimeAssets } from '../modelManifest.js';

export function createSpeechTaskHandler({ createEngine = createSpeechEngine,
  assertWorker = () => {
    if (typeof WorkerGlobalScope === 'undefined' || !(globalThis instanceof WorkerGlobalScope)) throw new Error('Speech requires a ComputeManager-owned worker');
  }, baseUrl = globalThis.location?.href } = {}) {
  const sessions = new Map();
  const summary = (entry) => ({ sessionId: entry.sessionId, manifestCid: entry.manifestCid,
    workerId: entry.workerId, status: entry.engine?.lost ? 'lost' : entry.status, ...entry.engine?.evidence });
  return async (data, context = {}) => {
    assertWorker(); validateSessionId(data?.sessionId); throwIfAborted(context.signal);
    if (data.command === 'load') {
      if (sessions.size) throw new Error('A speech model is already resident');
      const { manifest } = validateSpeechManifest(data.manifest);
      const runtimeAssets = validateRuntimeAssets(data.runtimeAssets, baseUrl);
      const entry = { sessionId: data.sessionId, manifestCid: data.manifestCid, manifest,
        workerId: context.workerId, status: 'loading' }; sessions.set(entry.sessionId, entry);
      try {
        entry.engine = await createEngine({ manifest, runtimeAssets, sessionId: entry.sessionId, artifactPort: data.artifactPort,
          signal: context.signal, onProgress: context.emitProgress, baseUrl });
        throwIfAborted(context.signal); entry.status = 'ready'; return summary(entry);
      } catch (error) {
        try { await entry.engine?.dispose(); sessions.delete(entry.sessionId); }
        catch (cleanup) { entry.status = 'lost'; throw new AggregateError([error, cleanup], 'Model session lost: speech cleanup failed'); }
        throw error;
      }
    }
    const entry = sessions.get(data.sessionId);
    if (!entry) throw new Error('Speech model is not loaded');
    if (data.command === 'status') return summary(entry);
    if (data.command === 'unload') {
      await entry.engine.dispose(); sessions.delete(entry.sessionId); return { status: 'unloaded', sessionId: entry.sessionId };
    }
    if (data.command !== 'generate') throw new Error('Unknown speech command');
    validateSessionId(data.requestId);
    if (entry.status !== 'ready' || entry.engine.lost) throw new Error('Model session lost: speech is not ready');
    const input = normalizeSpeechInput(data, entry.manifest); entry.status = 'generating';
    try {
      const result = await entry.engine.generate(input, { signal: context.signal, onProgress: context.emitProgress });
      throwIfAborted(context.signal);
      return { ...result, sessionId: entry.sessionId, requestId: data.requestId, workerId: entry.workerId };
    } catch (error) { if (/Model session lost/.test(error.message)) entry.status = 'lost'; throw error; }
    finally { if (entry.status !== 'lost') entry.status = entry.engine.lost ? 'lost' : 'ready'; }
  };
}
export const handleModelTask = createSpeechTaskHandler();
