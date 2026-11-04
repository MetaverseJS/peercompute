import { serveArtifactPort } from './ArtifactReadBridge.js';
import { CID } from 'multiformats/cid';
import { normalizeModelMessages, validateImageInput } from './modelTask.js';
import { MODEL_POLICY, abortError, throwIfAborted, validateModelManifest,
  validateRuntimeAssets, validateSessionId } from './modelManifest.js';

function operationSignal(signal, timeoutMs) {
  const controller = new AbortController();
  const abort = () => controller.abort(signal?.reason ?? 'Cancelled');
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) abort();
  const timer = setTimeout(() => controller.abort('Model operation deadline exceeded'), timeoutMs);
  timer.unref?.();
  return { controller, dispose() { clearTimeout(timer); signal?.removeEventListener('abort', abort); } };
}

function workerWasTerminated(error) {
  return error?.workerTerminated === true || error?.code === 'WORKER_TERMINATED';
}

function waitForAdmission(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => reject(abortError(signal.reason));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    if (signal.aborted) abort();
  });
}

/** Host-side lifecycle/admission facade. All inference runs through ComputeManager. */
export class ModelInferenceService {
  constructor({ computeManager, artifactStore, admission, runtimeAssets, resourceEstimate,
    runtimeDefinition = null, runtimeOptions = {},
    moduleUrl = runtimeDefinition?.moduleUrl ?? 'peercompute:model-inference',
    baseUrl = globalThis.location?.href,
    createChannel = () => new MessageChannel(),
    loadTimeoutMs = 300_000, generationTimeoutMs = 120_000,
    allowedManifestCids = null, collectGpuEvidence = false } = {}) {
    if (!computeManager?.submitTask || !computeManager.reserveWorkerAffinity
        || !computeManager.releaseWorkerAffinity || !computeManager.cancelTask
        || !computeManager.terminateWorkerAffinity || !computeManager.getWorkerAffinityState) {
      throw new Error('Inference requires managed worker reservation and cancellation APIs');
    }
    if (!artifactStore?.stat || !artifactStore.openRead || !admission?.acquire) {
      throw new Error('Inference requires a StateManager artifact store and resource admission');
    }
    for (const key of typeof resourceEstimate === 'function' ? [] : ['cpuBytes', 'gpuBytes']) {
      if (!Number.isSafeInteger(resourceEstimate?.[key]) || resourceEstimate[key] <= 0) {
        throw new Error('An explicit measured/configured resident memory envelope is required');
      }
    }
    for (const timeout of [loadTimeoutMs, generationTimeoutMs]) {
      if (!Number.isSafeInteger(timeout) || timeout < 1 || timeout > 30 * 60_000) {
        throw new Error('Invalid inference operation deadline');
      }
    }
    this.computeManager = computeManager;
    this.artifactStore = artifactStore;
    this.admission = admission;
    // Definitions come from trusted application code selected by ComputeManager,
    // never from an artifact manifest or a peer-supplied module location.
    this.runtimeDefinition = runtimeDefinition ?? {
      id: 'transformers.js', validateManifest: validateModelManifest, validateRuntimeAssets,
    };
    if (typeof this.runtimeDefinition.validateManifest !== 'function'
        || typeof this.runtimeDefinition.validateRuntimeAssets !== 'function') {
      throw new Error('A trusted model runtime definition is required');
    }
    this.runtimeAssets = this.runtimeDefinition.validateRuntimeAssets(runtimeAssets, baseUrl);
    if (!this.runtimeDefinition.validateRuntimeOptions && Object.keys(runtimeOptions).length) {
      throw new Error('This model runtime does not accept runtime options');
    }
    this.runtimeOptions = this.runtimeDefinition.validateRuntimeOptions?.(runtimeOptions) ?? {};
    this.resourceEstimate = typeof resourceEstimate === 'function' ? resourceEstimate : { ...resourceEstimate };
    this.moduleUrl = String(moduleUrl);
    this.createChannel = createChannel;
    this.loadTimeoutMs = loadTimeoutMs;
    this.generationTimeoutMs = generationTimeoutMs;
    this.allowedManifestCids = allowedManifestCids ? new Set(allowedManifestCids) : null;
    this.collectGpuEvidence = collectGpuEvidence === true;
    this.session = null;
    this.queue = [];
    this.active = null;
    this.closed = false;
  }

  async loadModel({ sessionId = crypto.randomUUID(), manifestCid, manifest, signal, onProgress } = {}) {
    if (this.closed) throw new Error('Inference service is closed');
    if (this.session) throw new Error('Unload the current model before loading another');
    validateSessionId(sessionId);
    if (typeof manifestCid !== 'string' || !manifestCid || manifestCid.length > 256
        || (this.allowedManifestCids && !this.allowedManifestCids.has(manifestCid))) {
      throw new Error('Model manifest is not admitted');
    }
    CID.parse(manifestCid);
    throwIfAborted(signal);
    const entry = { sessionId, manifestCid, affinityKey: `model:${sessionId}`, status: 'loading', reserved: false };
    this.session = entry;
    const operation = operationSignal(signal, this.loadTimeoutMs);
    entry.loadController = operation.controller;
    const run = async () => {
      try {
        const source = this.artifactStore.getManifest
          ? await this.artifactStore.getManifest(manifestCid, { signal: operation.controller.signal }) : manifest;
        const validated = this.runtimeDefinition.validateManifest(source);
        entry.manifest = validated.manifest;
        const estimate = typeof this.resourceEstimate === 'function'
          ? await this.resourceEstimate(entry.manifest, validated) : this.resourceEstimate;
        for (const [key, floor] of [['cpuBytes', validated.resourcePolicy.minimumCpuBytes],
          ['gpuBytes', validated.resourcePolicy.minimumGpuBytes]]) {
          if (!Number.isSafeInteger(estimate?.[key]) || estimate[key] <= 0 || estimate[key] < floor) {
            throw new Error(`Model requires an admitted ${key} envelope of at least ${floor} bytes`);
          }
        }
        throwIfAborted(operation.controller.signal);
        await this.computeManager.reserveWorkerAffinity(entry.affinityKey);
        entry.reserved = true;
        entry.workerId = this.#assertWorker(entry).workerId;
        throwIfAborted(operation.controller.signal);
        entry.lease = await this.admission.acquire({ sessionId, manifestCid, manifest: entry.manifest,
          estimatedCpuBytes: estimate.cpuBytes, estimatedGpuBytes: estimate.gpuBytes });
        if (!entry.lease?.release) throw new Error('Admission did not return a resident resource lease');
        throwIfAborted(operation.controller.signal);
        await waitForAdmission(entry.lease.assertActive?.(), operation.controller.signal);
        throwIfAborted(operation.controller.signal);
        this.#assertWorker(entry);
        const { port1, port2 } = this.createChannel();
        entry.bridge = serveArtifactPort(port1, { store: this.artifactStore, manifest: entry.manifest });
        entry.dispatched = true;
        const result = await this.computeManager.submitTask({
          id: `${sessionId}-load`, module: this.moduleUrl, exportName: 'handleModelTask',
          data: { command: 'load', sessionId, manifestCid, manifest: entry.manifest,
            artifactPort: port2, runtimeAssets: this.runtimeAssets, runtimeOptions: this.runtimeOptions,
            collectGpuEvidence: this.collectGpuEvidence },
          affinityKey: entry.affinityKey, requireWorker: true, transferables: [port2],
          signal: operation.controller.signal, onProgress,
        });
        throwIfAborted(operation.controller.signal);
        this.#assertWorker(entry);
        await waitForAdmission(entry.lease.assertActive?.(), operation.controller.signal);
        throwIfAborted(operation.controller.signal);
        this.#assertWorker(entry);
        entry.status = 'ready';
        entry.evidence = result;
        return result;
      } catch (error) {
        try {
          // A rejected loader can hide partially initialized ORT sessions. An owned-worker stop
          // acknowledges disposal of the whole realm before residency admission can be released.
          if (entry.dispatched && !workerWasTerminated(error)) {
            await this.computeManager.terminateWorkerAffinity(entry.affinityKey, { reason: 'Model load failed' });
          }
          await this.#release(entry);
          if (this.session === entry) this.session = null;
        } catch (cleanupError) {
          entry.status = 'cleanup-failed';
          throw new AggregateError([error, cleanupError], 'Model load failed and cleanup is incomplete');
        }
        throw error;
      } finally {
        operation.dispose();
        if (!this.runtimeDefinition.retainArtifactBridge) {
          await entry.bridge?.close();
          entry.bridge = null;
        }
        entry.loadController = null;
      }
    };
    entry.loading = run();
    return entry.loading;
  }

  generate({ requestId = crypto.randomUUID(), sessionId = this.session?.sessionId,
    messages, prompt, image, maxNewTokens = MODEL_POLICY.maxNewTokens, seed, steps, width, height,
    signal, onProgress, onToken } = {}) {
    if (this.closed || this.session?.status !== 'ready' || sessionId !== this.session.sessionId) {
      return Promise.reject(new Error('Requested model is not ready'));
    }
    const healthError = this.#checkReadiness(this.session);
    if (healthError) return Promise.reject(healthError);
    let normalized;
    try {
      validateSessionId(requestId);
      if (this.runtimeDefinition.normalizeGenerationInput) {
        normalized = this.runtimeDefinition.normalizeGenerationInput({ messages, prompt, image, maxNewTokens,
          seed, steps, width, height }, this.session.manifest);
      } else {
        validateImageInput(image);
        messages = normalizeModelMessages({ messages, prompt });
        this.runtimeDefinition.validateGenerationInput?.({ image, messages, maxNewTokens });
        if (!Number.isInteger(maxNewTokens) || maxNewTokens < 1 || maxNewTokens > MODEL_POLICY.maxNewTokens) {
          throw new Error('Generation exceeds its output-token budget');
        }
        normalized = { messages, image, maxNewTokens };
      }
      throwIfAborted(signal);
    }
    catch (error) { return Promise.reject(error); }
    if ((this.active?.requestId === requestId) || this.queue.some((item) => item.requestId === requestId)) {
      return Promise.reject(new Error('Duplicate inference request ID'));
    }
    if (this.active && this.queue.length >= MODEL_POLICY.maxQueued) {
      return Promise.reject(new Error('Inference queue is full'));
    }
    const entry = this.session;
    const operation = operationSignal(signal, this.generationTimeoutMs);
    // Copy at most the admitted RGBA budget, then transfer the owned copy to the managed worker.
    const copiedImage = normalized.image ? { width: normalized.image.width, height: normalized.image.height, channels: 4,
      data: new Uint8Array(normalized.image.data) } : undefined;
    const item = { requestId, session: entry, operation, started: false,
      data: { ...normalized, command: 'generate', sessionId, requestId, image: copiedImage },
      onProgress: (event) => {
        if (operation.controller.signal.aborted) return;
        try {
          onProgress?.(event);
          if (event.type === 'token') onToken?.(event.text, event);
        } catch (error) { operation.controller.abort(error); }
      },
    };
    const promise = new Promise((resolve, reject) => { item.resolve = resolve; item.reject = reject; });
    item.finished = promise.catch(() => {});
    item.abortQueued = () => {
      if (item.started) return;
      const index = this.queue.indexOf(item);
      if (index >= 0) this.queue.splice(index, 1);
      operation.dispose();
      item.reject(abortError(operation.controller.signal.reason));
    };
    operation.controller.signal.addEventListener('abort', item.abortQueued, { once: true });
    this.queue.push(item);
    this.#drain();
    return promise;
  }

  async #drain() {
    if (this.active || !this.queue.length) return;
    const item = this.queue.shift();
    item.started = true;
    this.active = item;
    try {
      throwIfAborted(item.operation.controller.signal);
      if (this.session !== item.session || item.session.status !== 'ready') throw new Error('Model session lost');
      const healthError = await this.#checkReadinessAsync(item.session, item.operation.controller.signal);
      if (healthError) throw healthError;
      throwIfAborted(item.operation.controller.signal);
      if (this.session !== item.session || item.session.status !== 'ready') throw new Error('Requested model is no longer ready');
      const result = await this.computeManager.submitTask({
        id: `${item.session.sessionId}-generate-${item.requestId}`,
        module: this.moduleUrl, exportName: 'handleModelTask', data: item.data,
        affinityKey: item.session.affinityKey, requireWorker: true,
        transferables: item.data.image ? [item.data.image.data.buffer] : [],
        signal: item.operation.controller.signal, onProgress: item.onProgress,
      });
      const completionError = await this.#checkReadinessAsync(item.session, item.operation.controller.signal);
      if (completionError) throw completionError;
      throwIfAborted(item.operation.controller.signal);
      if (this.session !== item.session || item.session.status !== 'ready') throw new Error('Requested model is no longer ready');
      item.resolve(result);
    } catch (error) {
      if (error?.code === 'ERR_MODEL_RESIDENCY_INACTIVE') {
        // Keep resident capacity quarantined until explicit unload acknowledges
        // termination, just as when a readiness query discovers the loss.
        this.#markUnavailable(item.session, error);
      } else if (workerWasTerminated(error) || error?.code === 'ERR_COMPUTE_WORKER_TERMINATION_FAILED'
          || /GPU device lost|Model session lost/.test(error?.message ?? '')) {
        item.session.status = 'lost';
        this.#rejectQueue('Model worker was lost');
        try {
          if (!workerWasTerminated(error)) {
            await this.computeManager.terminateWorkerAffinity(item.session.affinityKey, { reason: 'Model session lost' });
          }
          await this.#release(item.session);
          if (this.session === item.session) this.session = null;
        } catch (cleanupError) {
          item.session.status = 'cleanup-failed';
          error = new AggregateError([error, cleanupError], 'Lost worker resource cleanup failed');
        }
      }
      item.reject(error);
    } finally {
      item.operation.dispose();
      item.operation.controller.signal.removeEventListener('abort', item.abortQueued);
      this.active = null;
      void this.#drain();
    }
  }

  async cancel(requestId, { reason = 'Caller cancelled inference', timeoutMs } = {}) {
    const item = this.active?.requestId === requestId ? this.active : this.queue.find((queued) => queued.requestId === requestId);
    if (!item) return false;
    item.operation.controller.abort(reason);
    if (item.started) {
      await this.computeManager.cancelTask(`${item.session.sessionId}-generate-${requestId}`, { reason, timeoutMs });
      await item.finished;
    }
    return true;
  }

  getStatus() {
    if (this.session?.status === 'ready') this.#checkReadiness(this.session);
    return { status: this.session?.status ?? (this.closed ? 'closed' : 'idle'),
      runtime: this.runtimeDefinition.id,
      sessionId: this.session?.sessionId ?? null, manifestCid: this.session?.manifestCid ?? null,
      activeRequestId: this.active?.requestId ?? null, queuedRequests: this.queue.length,
      artifactReads: this.session?.bridge?.getStats() ?? null,
      evidence: this.session?.evidence ?? null };
  }

  async status() {
    const snapshot = this.getStatus();
    const entry = this.session;
    if (!entry || entry.status !== 'ready' || this.active) return snapshot;
    const result = await this.computeManager.submitTask({ module: this.moduleUrl, exportName: 'handleModelTask',
      data: { command: 'status', sessionId: entry.sessionId }, affinityKey: entry.affinityKey, requireWorker: true });
    if (this.session === entry && ['lost', 'absent', 'unloaded'].includes(result.status)) {
      this.#markUnavailable(entry, new Error('Model session lost: resident worker reported an unavailable runtime'));
    }
    return result;
  }

  #assertWorker(entry) {
    const state = this.computeManager.getWorkerAffinityState(entry.affinityKey);
    if (!entry.reserved || !state?.reserved || state.workerId == null
        || (entry.workerId != null && entry.workerId !== state.workerId)) {
      throw new Error('Model session lost: the original managed resident worker is unavailable');
    }
    return state;
  }

  #markUnavailable(entry, error) {
    if (this.session !== entry || ['unloading', 'cleanup-failed'].includes(entry.status)) return;
    entry.status = 'lost';
    this.#rejectQueue(error.message);
    if (this.active?.session === entry) this.active.operation.controller.abort(error);
  }

  #checkReadiness(entry) {
    try {
      this.#assertWorker(entry);
      const result = entry.lease?.assertActiveSync?.();
      if (result?.then) {
        Promise.resolve(result).catch(() => {});
        throw new TypeError('Resident synchronous health check must not return a promise');
      }
      return null;
    } catch (cause) {
      return this.#readinessFailure(entry, cause);
    }
  }

  async #checkReadinessAsync(entry, signal) {
    try {
      this.#assertWorker(entry);
      await waitForAdmission(entry.lease?.assertActive?.(), signal);
      throwIfAborted(signal);
      if (this.session !== entry || entry.status !== 'ready') throw new Error('Requested model is no longer ready');
      this.#assertWorker(entry);
      return null;
    } catch (cause) {
      if (signal.aborted) throw abortError(signal.reason);
      if (this.session !== entry || entry.status === 'unloading') throw cause;
      return this.#readinessFailure(entry, cause);
    }
  }

  #readinessFailure(entry, cause) {
    const error = Object.assign(new Error(String(cause?.message ?? cause), { cause }), { code: 'ERR_MODEL_RESIDENCY_INACTIVE' });
    this.#markUnavailable(entry, error);
    return error;
  }

  #rejectQueue(reason) {
    for (const item of [...this.queue]) item.operation.controller.abort(reason);
  }

  async #release(entry) {
    await entry.bridge?.close();
    entry.bridge = null;
    if (entry.lease) {
      await entry.lease.release();
      entry.lease = null;
    }
    if (entry.reserved) {
      await this.computeManager.releaseWorkerAffinity(entry.affinityKey);
      entry.reserved = false;
    }
  }

  async unloadModel() {
    const entry = this.session;
    if (!entry) return { status: 'absent' };
    if (entry.unloadingPromise) return entry.unloadingPromise;
    const unloading = this.#unloadEntry(entry);
    entry.unloadingPromise = unloading;
    try { return await unloading; }
    finally { if (entry.unloadingPromise === unloading) entry.unloadingPromise = null; }
  }

  async #unloadEntry(entry) {
    this.#rejectQueue('Model is unloading');
    if (entry.status === 'loading') {
      entry.loadController?.abort('Model load cancelled by unload');
      await entry.loading.catch(() => {});
      if (this.session === entry) throw new Error('Model cleanup is incomplete; admission remains held');
      return { sessionId: entry.sessionId, status: 'unloaded' };
    }
    if (entry.status === 'cleanup-failed' || entry.status === 'lost') {
      if (this.active?.session === entry) await this.cancel(this.active.requestId, { reason: 'Lost model is unloading' });
      if (this.session !== entry) return { sessionId: entry.sessionId, status: 'unloaded' };
      await this.computeManager.terminateWorkerAffinity(entry.affinityKey, { reason: 'Retry model cleanup' });
      await this.#release(entry);
      this.session = null;
      return { sessionId: entry.sessionId, status: 'unloaded', workerTerminated: true };
    }
    entry.status = 'unloading';
    if (this.active) await this.cancel(this.active.requestId, { reason: 'Model is unloading' });
    if (this.session !== entry) return { sessionId: entry.sessionId, status: 'unloaded' };
    const operation = operationSignal(undefined, this.generationTimeoutMs);
    try {
      if (this.runtimeDefinition.terminateOnUnload) {
        // Some native runtimes retain allocations on their exit API. A successful
        // owned-worker stop is the disposal acknowledgement for that entire realm.
        await this.computeManager.terminateWorkerAffinity(entry.affinityKey, { reason: 'Model runtime unloaded' });
        await this.#release(entry);
        this.session = null;
        return { sessionId: entry.sessionId, status: 'unloaded', workerTerminated: true };
      }
      const result = await this.computeManager.submitTask({ id: `${entry.sessionId}-unload`,
        module: this.moduleUrl, exportName: 'handleModelTask', data: { command: 'unload', sessionId: entry.sessionId },
        affinityKey: entry.affinityKey, requireWorker: true, signal: operation.controller.signal });
      await this.#release(entry);
      this.session = null;
      return result;
    } catch (error) {
      try {
        if (!workerWasTerminated(error)) {
          await this.computeManager.terminateWorkerAffinity(entry.affinityKey, { reason: 'Model disposal failed' });
        }
        await this.#release(entry);
        this.session = null;
      } catch (cleanupError) {
        entry.status = 'cleanup-failed';
        throw new AggregateError([error, cleanupError], 'Model disposal failed and cleanup is incomplete');
      }
      throw error;
    } finally { operation.dispose(); }
  }

  async dispose() {
    this.closed = true;
    return this.unloadModel();
  }
}
