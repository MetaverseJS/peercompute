import { createMeshEngine } from './engine.js';
import { normalizeMeshInput, validateMeshManifest, validateMeshRuntimeAssets } from './runtimeDefinition.js';
import { throwIfAborted, validateSessionId } from '../modelManifest.js';

function requireManagedWorker() {
  if (typeof WorkerGlobalScope === 'undefined' || !(globalThis instanceof WorkerGlobalScope)) {
    throw new Error('3D generation requires a ComputeManager-owned worker');
  }
}

export function createMeshTaskHandler({ createEngine = createMeshEngine, assertWorker = requireManagedWorker,
  validateManifest = validateMeshManifest, validateRuntimeAssets = validateMeshRuntimeAssets,
  normalizeInput = normalizeMeshInput,
  baseUrl = globalThis.location?.href } = {}) {
  const sessions = new Map();
  const summary = entry => ({ sessionId: entry.sessionId, manifestCid: entry.manifestCid,
    status: entry.engine?.lost ? 'lost' : entry.status, workerId: entry.workerId,
    ...entry.engine?.getEvidence() });
  return async function handle(data, context = {}) {
    assertWorker(); validateSessionId(data?.sessionId); throwIfAborted(context.signal);
    if (data.command === 'load') {
      if (sessions.size) throw new Error('Unload the resident 3D model first');
      const { manifest } = validateManifest(data.manifest);
      const runtimeAssets = validateRuntimeAssets(data.runtimeAssets, baseUrl);
      const entry = { sessionId: data.sessionId, manifestCid: data.manifestCid, manifest,
        status: 'loading', workerId: context.workerId, engine: null };
      sessions.set(data.sessionId, entry);
      try {
        entry.engine = await createEngine({ manifest, runtimeAssets, artifactPort: data.artifactPort,
          signal: context.signal, onProgress: context.emitProgress });
        throwIfAborted(context.signal); entry.status = 'ready'; return summary(entry);
      } catch (error) {
        try { await entry.engine?.dispose(); sessions.delete(data.sessionId); }
        catch (cleanup) { entry.status = 'lost'; throw new AggregateError([error, cleanup], 'Model session lost: 3D cleanup failed'); }
        throw error;
      }
    }
    const entry = sessions.get(data.sessionId);
    if (!entry) throw new Error('3D model session is not loaded');
    if (data.command === 'status') return summary(entry);
    if (data.command === 'unload') {
      entry.status = 'unloading'; await entry.engine.dispose(); sessions.delete(data.sessionId);
      return { sessionId: data.sessionId, status: 'unloaded' };
    }
    if (data.command !== 'generate') throw new Error('Unknown 3D model command');
    validateSessionId(data.requestId);
    if (entry.status !== 'ready' || entry.engine.lost) throw new Error('Model session lost: 3D model is not ready');
    const input = normalizeInput(data, entry.manifest);
    entry.status = 'generating';
    try {
      const result = await entry.engine.generate(input, { signal: context.signal, onProgress: context.emitProgress });
      throwIfAborted(context.signal);
      return { ...result, sessionId: data.sessionId, requestId: data.requestId, workerId: entry.workerId };
    } catch (error) {
      if (error instanceof WebAssembly.RuntimeError || /Model session lost/.test(error?.message ?? '')) entry.status = 'lost';
      throw error;
    } finally { if (entry.status !== 'lost') entry.status = entry.engine.lost ? 'lost' : 'ready'; }
  };
}

export const handleModelTask = createMeshTaskHandler();
