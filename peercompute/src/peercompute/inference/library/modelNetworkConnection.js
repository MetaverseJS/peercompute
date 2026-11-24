function aborted(signal) { signal?.throwIfAborted(); }

function waitFor(promise, signal) {
  aborted(signal);
  if (!signal) return promise;
  return new Promise((resolve, reject) => {
    const cancel = () => reject(signal.reason);
    signal.addEventListener('abort', cancel, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', cancel));
  });
}

/** Application discovery is independent of the optional, persistent artifact node. */
export function createModelNetworkConnection({ store, manager = null, createManager,
  stopArtifacts = (value) => value._stopArtifactTransport(), now = Date.now } = {}) {
  if (typeof now !== 'function') throw new TypeError('Artifact recovery requires a clock');
  let network = manager;
  let applicationStarting = null, artifactStarting = null, disposing = null;
  let applicationError = null, artifactError = null, artifactStatus = 'offline';
  let artifactFailures = 0, artifactRetryAt = null;
  let ownedArtifact = null, closed = false;
  const ownedManagers = new Set();
  const lifetime = new AbortController();

  function assertOpen() {
    if (closed) throw new Error('Model network connection is disposed');
  }

  function transport() {
    const value = network?.getArtifactTransport?.();
    return value?.store === store && !value.requiresCleanup ? value : null;
  }

  function ready() {
    return !closed && !!network?.isConnected && artifactStatus === 'ready' && !!transport();
  }

  async function releaseOwnedArtifact() {
    const owned = ownedArtifact;
    if (!owned) return;
    const current = owned.manager.getArtifactTransport?.();
    // Never stop a replacement transport or one borrowed from an embedding app.
    if (current && current === owned.transport) await stopArtifacts(owned.manager);
    if (ownedArtifact === owned) ownedArtifact = null;
  }

  function startArtifacts() {
    assertOpen();
    if (!network?.isConnected) return Promise.resolve(null);
    if (artifactStarting) return artifactStarting;
    if (transport()) {
      artifactStatus = 'ready'; artifactError = null;
      artifactFailures = 0; artifactRetryAt = null;
      return Promise.resolve(transport());
    }
    const candidate = network;
    artifactStatus = 'starting'; artifactError = null; artifactRetryAt = null;
    const operation = (async () => {
      try {
        // The manager exposes only completed startup. Keep its entire operation
        // tracked: persisted verification cannot currently be externally aborted.
        if (candidate.artifactStopping) await candidate.artifactStopping;
        if (closed || !candidate.isConnected) return null;
        if (ownedArtifact?.manager === candidate
            && candidate.getArtifactTransport?.()?.requiresCleanup) await releaseOwnedArtifact();
        const borrowed = candidate.getArtifactTransport?.() || candidate.artifactStarting;
        const ownership = borrowed ? null : { manager: candidate, transport: null };
        if (ownership) ownedArtifact = ownership;
        let result;
        try { result = await candidate.createArtifactTransport(store); }
        finally {
          if (ownership) {
            ownership.transport = candidate.getArtifactTransport?.() ?? null;
            if (!ownership.transport && ownedArtifact === ownership) ownedArtifact = null;
          }
        }
        if (result?.store !== store || result.requiresCleanup) {
          throw new Error('Artifact transport is not ready for this model library');
        }
        if (!closed && network === candidate && candidate.isConnected) {
          artifactStatus = 'ready'; artifactFailures = 0; artifactRetryAt = null;
        }
        return result;
      } catch (error) {
        if (!closed) {
          artifactError = error; artifactStatus = 'error';
          artifactFailures = Math.min(5, artifactFailures + 1);
          artifactRetryAt = now() + Math.min(60000, 5000 * 2 ** (artifactFailures - 1));
        }
        return null;
      } finally {
        if (closed || !candidate.isConnected) artifactStatus = 'offline';
      }
    })();
    artifactStarting = operation;
    operation.then(() => { if (artifactStarting === operation) artifactStarting = null; });
    return operation;
  }

  // No timer or new application/model session is created here. A transfer or
  // the embedding world's maintenance tick can retry due file startup without
  // hammering a locked library or a temporarily unavailable relay. Connect is
  // still an explicit immediate retry, and all callers share one startup.
  function retryArtifacts({ signal, force = false } = {}) {
    assertOpen(); aborted(signal);
    if (typeof force !== 'boolean') throw new TypeError('Artifact retry force must be a boolean');
    if (!network?.isConnected) return Promise.resolve(null);
    if (artifactStarting) return waitFor(artifactStarting, signal);
    if (!force && artifactStatus === 'error' && artifactRetryAt > now()) return Promise.resolve(null);
    return waitFor(startArtifacts(), signal);
  }

  async function disconnectOwned(candidate) {
    await candidate.disconnect();
    ownedManagers.delete(candidate);
    if (network === candidate) network = null;
    if (ownedArtifact?.manager === candidate) ownedArtifact = null;
  }

  function connect(config, { signal } = {}) {
    assertOpen(); aborted(signal);
    if (network?.isConnected) {
      startArtifacts();
      return Promise.resolve(ready() ? transport() : null);
    }
    if (applicationStarting) return waitFor(applicationStarting, signal);
    const operationSignal = signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal;
    applicationError = null;
    const operation = (async () => {
      let candidate = network;
      try {
        // A failed disconnect retains ownership and must be retried before a
        // second standalone manager can be created.
        for (const owned of ownedManagers) {
          if (owned !== network) await disconnectOwned(owned);
        }
        aborted(operationSignal);
        if (!candidate) {
          const options = typeof config === 'function' ? await config({ signal: operationSignal }) : config;
          aborted(operationSignal);
          candidate = await createManager(options);
          ownedManagers.add(candidate);
          aborted(operationSignal);
        }
        if (!candidate.libp2p) await candidate.initialize();
        aborted(operationSignal);
        await candidate.connect();
        aborted(operationSignal);
        network = candidate;
        applicationError = null;
        // Starting optional file sharing must not delay application readiness.
        startArtifacts();
        return ready() ? transport() : null;
      } catch (error) {
        if (candidate && ownedManagers.has(candidate)) {
          try { await disconnectOwned(candidate); }
          catch (cleanupError) {
            error = new AggregateError([error, cleanupError], 'Application connection failed and its cleanup must be retried', { cause: error });
          }
        }
        if (!closed) applicationError = error;
        throw error;
      }
    })();
    applicationStarting = operation;
    operation.then(() => { if (applicationStarting === operation) applicationStarting = null; },
      () => { if (applicationStarting === operation) applicationStarting = null; });
    return waitFor(operation, signal);
  }

  async function requireArtifacts({ signal } = {}) {
    assertOpen(); aborted(signal);
    if (!network?.isConnected) throw new Error('Connect the network before transferring model files');
    await retryArtifacts({ signal });
    aborted(signal); assertOpen();
    if (!ready()) throw artifactError ?? new Error('Model file sharing is unavailable; use Connect to retry');
    return transport();
  }

  function dispose() {
    if (disposing) return disposing;
    closed = true;
    lifetime.abort(new DOMException('Model network connection disposed', 'AbortError'));
    artifactStatus = 'offline';
    const operation = (async () => {
      await applicationStarting?.catch(() => {});
      await artifactStarting;
      const failures = [];
      for (const owned of ownedManagers) {
        try { await disconnectOwned(owned); } catch (error) { failures.push(error); }
      }
      // Disconnect owns artifact cleanup for standalone managers. Embedded
      // managers keep their application connection and all borrowed transports.
      if (ownedArtifact && !ownedManagers.has(ownedArtifact.manager)) {
        try { await releaseOwnedArtifact(); } catch (error) { failures.push(error); }
      }
      if (failures.length) throw new AggregateError(failures, 'Model network cleanup failed; retry closing the console');
    })();
    disposing = operation;
    operation.then(() => { if (disposing === operation) disposing = null; },
      () => { if (disposing === operation) disposing = null; });
    return operation;
  }

  return {
    connect, startArtifacts, retryArtifacts, requireArtifacts, dispose,
    get manager() { return network; },
    get networkReady() { return !closed && !!network?.isConnected; },
    get artifactReady() { return ready(); },
    get error() { return applicationError ?? artifactError; },
    getArtifactNetworkStatus() {
      const status = closed || !network?.isConnected ? 'offline' : artifactStatus;
      return { status, error: status === 'error' ? String(artifactError?.message ?? artifactError).slice(0, 1024) : null,
        ...(status === 'error' && artifactRetryAt !== null ? { retryAt: artifactRetryAt } : {}) };
    },
  };
}
