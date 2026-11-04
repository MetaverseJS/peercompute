import { artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';

export const DEFAULT_MODEL_ID = 'qwen3.5-0.8b-abliterated-q4-k-m-gguf';

/** A selection hint only: never authorizes downloads, execution or admission. */
export function createModelPreferences({ storeName = 'inference-models', storage,
  locks = globalThis.navigator?.locks } = {}) {
  const key = `peercompute:model-console:last-loaded:v1:${encodeURIComponent(String(storeName))}`;
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storage = null; }
  }
  function normalize(value) {
    if (value?.version !== 1 || typeof value.manifestCid !== 'string' || value.manifestCid.length > 128
        || typeof value.modelId !== 'string' || !value.modelId || value.modelId.length > 256
        || (value.selectionId !== undefined && !/^[a-f0-9-]{36}$/.test(value.selectionId))) return null;
    try { return { version: 1, manifestCid: artifactCID(value.manifestCid).toString(), modelId: value.modelId,
      ...(value.selectionId ? { selectionId: value.selectionId } : {}) }; }
    catch { return null; }
  }
  let remembered = null, sessionOnly = false;
  const copy = () => remembered ? { ...remembered } : null;
  function read(persistent = false) {
    if (sessionOnly && !persistent) return copy();
    try {
      if (!storage?.getItem) return copy();
      const value = storage.getItem(key);
      try { remembered = typeof value === 'string' && value.length <= 1024 ? normalize(JSON.parse(value)) : null; }
      catch { remembered = null; }
      sessionOnly = false;
    } catch { /* Denied or malformed preferences do not disable local inference. */ }
    return copy();
  }
  // Web Locks makes the read/compare/remove atomic against other tabs using this
  // helper. If the lock is denied or stalls, only change this session's hint.
  async function update(operation, signal) {
    if (!locks?.request) return operation(true);
    try {
      return await locks.request(`${key}:write`, { mode: 'exclusive',
        signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(1000)]) : AbortSignal.timeout(1000) },
      () => operation(true));
    } catch { return operation(false); }
  }
  read();
  return {
    readLastLoaded: read,
    rememberLoaded(value, { signal } = {}) {
      const record = normalize({ ...value, version: 1, selectionId: crypto.randomUUID() });
      if (!record) throw new TypeError('A stored model preference requires a valid CID and model ID');
      return update((persistent) => {
        if (signal?.aborted) return read();
        remembered = record; sessionOnly = !persistent;
        if (persistent) try { storage?.setItem(key, JSON.stringify(record)); } catch { sessionOnly = true; }
        return copy();
      }, signal);
    },
    clearLastLoaded(expected = copy()) {
      const previous = normalize(expected);
      return update((persistent) => {
        const current = read(true);
        if (!previous || !current || current.manifestCid !== previous.manifestCid
            || current.modelId !== previous.modelId || current.selectionId !== previous.selectionId) return current;
        remembered = null; sessionOnly = !persistent;
        if (persistent) try { storage?.removeItem(key); } catch { sessionOnly = true; }
        return null;
      });
    },
  };
}
