import { artifactCID } from '../artifacts/ArtifactManifest.js';

function aborted(signal) { signal?.throwIfAborted(); }
function wait(promise, signal) {
  if (!signal) return promise;
  aborted(signal);
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

/** A bounded collection of independent managed services. It never evicts a
 * resident: ComputeManager's shared broker owns aggregate resource admission.
 */
export class ResidentModelRegistry {
  constructor({ artifactStore, createService, maximumResidents = 8 } = {}) {
    if (!artifactStore?.acquireUse || !artifactStore.getManifest || typeof createService !== 'function') {
      throw new TypeError('Resident models require artifact use leases and a managed service factory');
    }
    if (!Number.isInteger(maximumResidents) || maximumResidents < 1 || maximumResidents > 8) throw new RangeError('Invalid resident model limit');
    this.store = artifactStore; this.createService = createService; this.maximumResidents = maximumResidents;
    this.entries = new Map(); this.closed = false; this.controller = new AbortController();
  }
  getService(cid) { return this.entries.get(cid)?.service ?? null; }
  list() {
    return [...this.entries.values()].map((entry) => ({ manifest: entry.manifest,
      runtimeOptions: structuredClone(entry.options), ...entry.service?.getStatus(),
      manifestCid: entry.cid,
      status: entry.unloading ? 'unloading' : entry.loading ? 'loading' : entry.service?.getStatus().status ?? 'loading' }));
  }
  load(input, { signal, onProgress, runtimeOptions: options = {} } = {}) {
    if (this.closed) return Promise.reject(new Error('Resident model registry is closed'));
    const cid = artifactCID(input).toString();
    const existing = this.entries.get(cid);
    if (existing) {
      if (JSON.stringify(existing.options) !== JSON.stringify(options)) return Promise.reject(new Error('Unload this model before changing its runtime options'));
      if (existing.unloading) return Promise.reject(new Error('This model is unloading'));
      if (existing.loading) return wait(existing.loading, signal);
      if (existing.service.getStatus().status === 'ready') return wait(Promise.resolve(existing.result), signal);
      return Promise.reject(new Error('This resident model needs acknowledged cleanup before reloading'));
    }
    if (this.entries.size >= this.maximumResidents) return Promise.reject(new Error('Resident model capacity exceeded; unload a model first'));
    aborted(signal);
    const controller = new AbortController();
    const activeSignal = AbortSignal.any([controller.signal, this.controller.signal, ...(signal ? [signal] : [])]);
    const entry = { cid, options: structuredClone(options), controller, service: null, releaseUse: null, loading: null };
    this.entries.set(cid, entry);
    const run = async () => {
      try {
        entry.releaseUse = await this.store.acquireUse(cid, { signal: activeSignal });
        aborted(activeSignal);
        entry.manifest = await this.store.getManifest(cid, { signal: activeSignal });
        aborted(activeSignal);
        entry.service = await this.createService({ manifestCid: cid, manifest: entry.manifest, runtimeOptions: entry.options });
        aborted(activeSignal);
        entry.result = await entry.service.loadModel({ manifestCid: cid, signal: activeSignal, onProgress });
        aborted(activeSignal);
        return entry.result;
      } catch (error) {
        try { await this._release(entry); }
        catch (cleanupError) { throw new AggregateError([error, cleanupError], 'Model load failed and cleanup is incomplete'); }
        throw error;
      } finally { entry.loading = null; }
    };
    entry.loading = run();
    return entry.loading;
  }
  async _release(entry) {
    // Failed termination must retain both the service and file-use lease.
    await entry.service?.dispose();
    await entry.releaseUse?.(); entry.releaseUse = null;
    if (this.entries.get(entry.cid) === entry) this.entries.delete(entry.cid);
  }
  async unload(cid) {
    if (cid === undefined) {
      const results = await Promise.allSettled([...this.entries.keys()].map((key) => this.unload(key)));
      const failures = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
      if (failures.length) throw new AggregateError(failures, 'Some resident models could not finish cleanup');
      return { status: 'unloaded' };
    }
    const entry = this.entries.get(artifactCID(cid).toString());
    if (!entry) return { status: 'absent' };
    if (entry.unloading) return entry.unloading;
    const operation = (async () => {
      entry.controller.abort(new DOMException('Model is unloading', 'AbortError'));
      await entry.loading?.catch(() => {});
      if (this.entries.get(entry.cid) === entry) await this._release(entry);
      return { manifestCid: entry.cid, status: 'unloaded' };
    })();
    entry.unloading = operation;
    try { return await operation; } finally { entry.unloading = null; }
  }
  async dispose() { this.closed = true; this.controller.abort(new DOMException('Resident registry closed', 'AbortError')); return this.unload(); }
}
