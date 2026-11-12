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
  constructor({ artifactStore, createService, maximumResidents = 8, recovery = null, now = Date.now, random = Math.random } = {}) {
    if (!artifactStore?.acquireUse || !artifactStore.getManifest || typeof createService !== 'function') {
      throw new TypeError('Resident models require artifact use leases and a managed service factory');
    }
    if (!Number.isInteger(maximumResidents) || maximumResidents < 1 || maximumResidents > 8) throw new RangeError('Invalid resident model limit');
    const policy = recovery ? { pollMs: 2000, retryMs: 1000, maximumAttempts: 3, stableMs: 60_000,
      cooldownMinMs: 60_000, cooldownMaxMs: 180_000, ...recovery } : null;
    if (typeof now !== 'function' || typeof random !== 'function'
        || policy && (Object.values(policy).some(value => !Number.isSafeInteger(value) || value < 1)
          || policy.cooldownMaxMs < policy.cooldownMinMs)) {
      throw new TypeError('Invalid resident recovery policy');
    }
    this.store = artifactStore; this.createService = createService; this.maximumResidents = maximumResidents;
    this.entries = new Map(); this.closed = false; this.controller = new AbortController();
    this.recovery = policy; this.now = now; this.random = random; this.listeners = new Set(); this.timer = null;
  }
  getService(cid) { return this.entries.get(cid)?.service ?? null; }
  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('Resident observer must be a function');
    this.listeners.add(listener); return () => this.listeners.delete(listener);
  }
  _emit(event) {
    for (const listener of this.listeners) {
      try { Promise.resolve(listener(event)).catch(() => {}); } catch { /* Observer only. */ }
    }
  }
  list() {
    return [...this.entries.values()].map((entry) => ({ manifest: entry.manifest,
      runtimeOptions: structuredClone(entry.options), ...entry.service?.getStatus(),
      manifestCid: entry.cid,
      recovery: entry.recoveryState ? { ...entry.recoveryState } : null,
      status: entry.unloading ? 'unloading' : entry.recovering ? 'recovering'
        : entry.loading ? 'loading' : entry.service?.getStatus().status ?? 'lost' }));
  }
  load(input, { signal, onProgress, runtimeOptions: options = {} } = {}) {
    if (this.closed) return Promise.reject(new Error('Resident model registry is closed'));
    const cid = artifactCID(input).toString();
    const existing = this.entries.get(cid);
    if (existing) {
      if (JSON.stringify(existing.options) !== JSON.stringify(options)) return Promise.reject(new Error('Unload this model before changing its runtime options'));
      if (existing.unloading) return Promise.reject(new Error('This model is unloading'));
      if (existing.loading) return wait(existing.loading, signal);
      if (existing.recovering) return wait(existing.recovering, signal);
      if (existing.service?.getStatus().status === 'ready') return wait(Promise.resolve(existing.result), signal);
      return Promise.reject(new Error('This resident model needs acknowledged cleanup before reloading'));
    }
    if (this.entries.size >= this.maximumResidents) return Promise.reject(Object.assign(
      new Error('Resident model capacity exceeded; unload a model first'), { code: 'ERR_RESOURCE_CAPACITY' }));
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
        entry.desired = !!this.recovery && !entry.recoveryDisabled;
        entry.stableSince = this.now(); entry.attempts = 0;
        this._schedule();
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
  _schedule() {
    if (this.timer || this.closed || !this.recovery || ![...this.entries.values()].some(entry => entry.desired)) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.checkRecovery().catch(() => {});
      this._schedule();
    }, this.recovery.pollMs);
    this.timer.unref?.();
  }
  /** Disarm before awaiting network cancellation or deletion locks. */
  stopRecovery(cid) {
    const entries = cid === undefined ? [...this.entries.values()] : [this.entries.get(artifactCID(cid).toString())];
    for (const entry of entries) if (entry) {
      entry.desired = false; entry.recoveryDisabled = true;
      entry.recoveryController?.abort(new DOMException('Resident recovery cancelled', 'AbortError'));
    }
    if (![...this.entries.values()].some(entry => entry.desired)) { clearTimeout(this.timer); this.timer = null; }
  }
  /** Also exposed for deterministic hosts/tests. Polling only observes service
   * health; it never replays generation or downloads a replacement package. */
  async checkRecovery() {
    if (this.closed || !this.recovery) return;
    const operations = [];
    for (const entry of this.entries.values()) {
      if (!entry.desired || entry.unloading || entry.loading) continue;
      if (entry.recovering) { operations.push(entry.recovering); continue; }
      const status = entry.service?.getStatus();
      if (status?.status === 'ready') {
        if (this.now() - entry.stableSince >= this.recovery.stableMs) entry.attempts = 0;
        continue;
      }
      if (status?.loss?.recoverable !== true && !['waiting', 'cooldown'].includes(entry.recoveryState?.status)) continue;
      if (this.now() < (entry.nextAttemptAt ?? 0)) continue;
      if (entry.attempts >= this.recovery.maximumAttempts) {
        if (entry.recoveryState?.status !== 'cooldown') {
          this._cooldown(entry, 'The model became unavailable repeatedly; waiting before another recovery burst.');
          continue;
        }
        // Exhaustion limits one burst, not the owner's desire to host a model.
        // A fresh burst still cleans the quarantined worker before any loading.
        entry.attempts = 0;
      }
      entry.recovering = this._recover(entry).finally(() => { entry.recovering = null; });
      // The supervisor owns this promise even when no consumer is watching.
      entry.recovering.catch(() => {}); operations.push(entry.recovering);
    }
    return Promise.allSettled(operations);
  }
  _cooldown(entry, message) {
    const value = this.random();
    const fraction = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
    const delay = this.recovery.cooldownMinMs
      + Math.round(fraction * (this.recovery.cooldownMaxMs - this.recovery.cooldownMinMs));
    entry.nextAttemptAt = this.now() + delay;
    entry.recoveryState = { status: 'cooldown', attempts: entry.attempts,
      nextAttemptAt: entry.nextAttemptAt, message: String(message).slice(0, 2048) };
    this._emit({ type: 'recovery-waiting', manifestCid: entry.cid, ...entry.recoveryState });
  }
  async _recover(entry) {
    const controller = new AbortController(); entry.recoveryController = controller;
    const signal = AbortSignal.any([controller.signal, entry.controller.signal, this.controller.signal]);
    const check = () => {
      aborted(signal);
      if (!entry.desired || this.entries.get(entry.cid) !== entry) throw new DOMException('Recovery superseded', 'AbortError');
    };
    entry.recoveryOrigin ??= { previousService: entry.service,
      previousSessionId: entry.service?.getStatus().sessionId ?? entry.service?.getStatus().loss?.sessionId };
    entry.attempts++;
    entry.recoveryState = { status: 'recovering', attempts: entry.attempts };
    this._emit({ type: 'recovering', manifestCid: entry.cid, ...entry.recoveryState });
    try {
      check();
      // Preserve the artifact-use lease and resident slot across replacement.
      // Never admit new GPU resources until old worker disposal acknowledges.
      await entry.service?.dispose(); entry.service = null;
      check();
      entry.service = await this.createService({ manifestCid: entry.cid, manifest: entry.manifest, runtimeOptions: entry.options });
      check();
      entry.result = await entry.service.loadModel({ manifestCid: entry.cid, signal,
        onProgress: progress => this._emit({ type: 'recovery-progress', manifestCid: entry.cid, progress }) });
      check();
      entry.stableSince = this.now(); entry.nextAttemptAt = 0;
      entry.recoveryState = { status: 'recovered', attempts: entry.attempts };
      this._emit({ type: 'recovered', manifestCid: entry.cid, service: entry.service,
        ...entry.recoveryOrigin, sessionId: entry.service.getStatus().sessionId });
      entry.recoveryOrigin = null;
      return entry.result;
    } catch (error) {
      // A failed replacement can itself own a partly loaded GPU runtime.
      // Keep it quarantined until cleanup succeeds, including cancellation.
      try { await entry.service?.dispose(); entry.service = null; }
      catch (cleanupError) { error = new AggregateError([error, cleanupError], 'Resident recovery cleanup is incomplete'); }
      if (entry.attempts >= this.recovery.maximumAttempts) this._cooldown(entry, error.message ?? error);
      else {
        entry.nextAttemptAt = this.now() + Math.min(30_000, this.recovery.retryMs * 2 ** (entry.attempts - 1));
        entry.recoveryState = { status: 'waiting', attempts: entry.attempts,
          message: String(error.message ?? error).slice(0, 2048) };
        this._emit({ type: 'recovery-waiting', manifestCid: entry.cid, ...entry.recoveryState });
      }
      throw error;
    } finally { entry.recoveryController = null; }
  }
  async unload(cid) {
    this.stopRecovery(cid);
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
      await entry.recovering?.catch(() => {});
      if (this.entries.get(entry.cid) === entry) await this._release(entry);
      return { manifestCid: entry.cid, status: 'unloaded' };
    })();
    entry.unloading = operation;
    try { return await operation; } finally { entry.unloading = null; }
  }
  async dispose() {
    this.closed = true; clearTimeout(this.timer); this.timer = null; this.listeners.clear();
    this.controller.abort(new DOMException('Resident registry closed', 'AbortError')); return this.unload();
  }
}
