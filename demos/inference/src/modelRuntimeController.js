import { createModelMutationQueue, listStoredModelRecords, modelStorageError, withModelDeletionOwnership } from './modelLibrary.js';
import { artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { PEER_INFERENCE_LIMITS } from '../../../peercompute/src/peercompute/networkManager/inference/protocol.js';

function capabilities(model = {}) {
  const modalities = [...(model.modalities ?? ['text'])];
  const task = model.task ?? (modalities.includes('image') ? 'image-text-to-text' : 'text-generation');
  return { task, modalities, outputModalities: [...(model.outputModalities ?? [task === 'text-to-image' ? 'image' : 'text'])] };
}

/** UI policy over manager-owned storage, inference and private peer streams. */
export function attachModelRuntimeController(runtime, { catalog, now = Date.now } = {}) {
  const original = Object.fromEntries(['importCatalog', 'importPackage', 'ensure', 'load', 'connect', 'connectBackend', 'dispose']
    .map((key) => [key, runtime[key].bind(runtime)]));
  const owner = {};
  const retained = new Map();
  const published = new Set();
  const sharingErrors = new Map();
  const requests = new Map();
  const lifetime = new AbortController();
  const mutations = createModelMutationQueue();
  const deleting = new Set();
  const deletions = new Map();
  const localGenerations = new Set();
  const modelUses = new Map();
  let sharing = true, hostInference = true, closed = false;
  let peerService, peerStarting, refreshing, acquiring;
  let current = null, localRequests = 0, lastIdleAt = now();
  let publication = Promise.resolve();

  const assertOpen = () => { if (closed) throw new Error('Model console is closed'); };
  const combined = (signal) => signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal;
  function localAvailability(entry) {
    // Peer display metadata cannot lower a trusted model's resource estimate.
    const approved = !entry.model && Object.values(catalog).find((candidate) =>
      candidate.model.runtime === entry.runtime && (candidate.repository ?? candidate.model.repository) === entry.repository
        && (candidate.revision ?? candidate.model.revision) === entry.revision);
    return runtime.getModelCompatibility?.(approved || entry)
      ?? { status: 'unknown', reason: 'Local memory fit is unverified.' };
  }
  function assertLocallyAvailable(entry) {
    const availability = localAvailability(entry);
    if (['checking', 'unavailable'].includes(availability.status)) {
      throw Object.assign(new Error(availability.reason || 'This model cannot load on this device'),
        { code: 'ERR_MODEL_LOCAL_UNAVAILABLE', availability });
    }
    return availability;
  }
  if (runtime.setMemoryBudgets) {
    const setBudgets = runtime.setMemoryBudgets.bind(runtime);
    runtime.setMemoryBudgets = (value) => {
      assertOpen();
      if (acquiring || runtime.service.getStatus().status === 'loading') throw new Error('Wait for the model import/load to finish before changing memory budgets');
      return setBudgets(value);
    };
  }
  function descriptor(cid, manifest) {
    if (!manifest?.model?.runtime || !manifest.model.repository) return null;
    const match = Object.values(catalog).find((entry) => entry.model.repository === manifest.model.repository
      && entry.model.revision === manifest.model.revision && entry.model.runtime === manifest.model.runtime);
    return { manifestCid: cid, modelId: match?.id ?? cid, name: match?.name ?? manifest.name ?? manifest.model.repository,
      ...capabilities(manifest.model), runtime: manifest.model.runtime,
      repository: manifest.model.repository, revision: manifest.model.revision,
      totalBytes: manifest.files.reduce((sum, file) => sum + file.size, 0) };
  }
  async function remember(record) {
    if (!record?.cid) throw new Error('Imported package has no content identity');
    const model = descriptor(record.cid, record.manifest ?? await runtime.store.getManifest(record.cid));
    if (model) {
      retained.set(record.cid, model);
    }
    return model;
  }
  async function refreshStoredRecords(signal) {
    const records = await listStoredModelRecords(runtime.store, { signal });
    const available = new Set();
    for (const record of records) {
      if (record.status === 'deleting') { deleting.add(record.cid); continue; }
      if (record.pinned) { available.add(record.cid); await remember(record); }
    }
    for (const cid of retained.keys()) if (!available.has(cid)) retained.delete(cid);
    return records;
  }
  function resident() {
    const status = runtime.service.getStatus();
    return current && !deleting.has(current.manifestCid) && status.status === 'ready'
      && status.manifestCid === current.manifestCid ? current : null;
  }
  const remoteModels = () => (peerService?.listModels() ?? []).map((entry) => ({ ...entry, ...capabilities(entry),
    providers: entry.providers.filter((provider) => !provider.local) })).filter((entry) => entry.providers.length);
  const remoteHosts = () => (peerService?.listHosts() ?? []).map((entry) => ({ ...entry, ...capabilities(entry),
    hosts: entry.hosts.filter((host) => !host.local) })).filter((entry) => entry.hosts.length);

  async function syncSharing({ strict = false } = {}) {
    const work = async () => {
      if (closed || !runtime.networkReady) return;
      await refreshStoredRecords(lifetime.signal);
      const actual = new Set(runtime.networkManager.getPublishedArtifactCids());
      const errors = [];
      for (const cid of published) if (!retained.has(cid)) {
        try { await runtime.withdraw(cid); actual.delete(cid); published.delete(cid); sharingErrors.delete(cid); }
        catch (error) { sharingErrors.set(cid, error); errors.push(error); }
      }
      for (const cid of retained.keys()) {
        try {
          if (sharing && !deleting.has(cid) && !actual.has(cid)) { await runtime.publish(cid); actual.add(cid); }
          if ((!sharing || deleting.has(cid)) && actual.has(cid)) { await runtime.withdraw(cid); actual.delete(cid); }
          sharingErrors.delete(cid);
        } catch (error) { sharingErrors.set(cid, error); errors.push(error); }
        if (actual.has(cid)) published.add(cid); else published.delete(cid);
      }
      if (strict && errors.length) throw new AggregateError(errors, 'Some models could not update their file sharing state');
    };
    publication = publication.catch(() => {}).then(work);
    return publication;
  }
  async function generateLocal(options) {
    const model = resident();
    if (!model) throw new Error('Import a model before using local inference');
    if (options.image && !model.modalities.includes('image')) throw new Error('This model accepts text only');
    localRequests++;
    const abort = new AbortController();
    const signal = AbortSignal.any([combined(options.signal), abort.signal]);
    const request = { manifestCid: model.manifestCid, abort };
    localGenerations.add(request);
    try {
      request.promise = Promise.resolve(runtime.service.generate({ ...options, task: model.task, signal }));
      return await request.promise;
    } finally { localGenerations.delete(request); if (--localRequests === 0) lastIdleAt = now(); }
  }
  async function ensurePeerService() {
    assertOpen();
    const manager = runtime.networkManager;
    if (!manager?.isConnected) return null;
    // A shared manager can disconnect and reconnect while this panel survives.
    // Retire its stopped protocol handle before advertising or routing again.
    if (peerService?.closed) {
      await manager.releasePeerInferenceService(owner);
      peerService = null;
    }
    if (peerService) return peerService;
    if (!peerStarting) {
      peerStarting = manager.createPeerInferenceService({ owner, requestTimeoutMs: 300_000,
        getLocalState: () => {
          const status = runtime.service.getStatus();
          const busy = localRequests > 0 || !!status.activeRequestId || status.queuedRequests > 0;
          const local = resident();
          const models = [...retained.values()].filter((model) => published.has(model.manifestCid) && !deleting.has(model.manifestCid));
          if (local) models.sort((left, right) => Number(right.manifestCid === local.manifestCid) - Number(left.manifestCid === local.manifestCid));
          return { sharedModels: sharing ? models.slice(0, PEER_INFERENCE_LIMITS.maximumModels) : [],
            hostedModel: hostInference && !closed ? resident() : null,
            busy, queuedRequests: status.queuedRequests ?? 0, idleForMs: busy ? 0 : Math.max(0, now() - lastIdleAt) };
        },
        generate: async ({ manifestCid, ...options }) => {
          if (!hostInference || closed || resident()?.manifestCid !== manifestCid) throw new Error('Model is no longer hosted');
          return generateLocal(options);
        },
      }).then(async (service) => {
        if (closed) { await manager.releasePeerInferenceService(owner); throw new Error('Model console is closed'); }
        peerService = service;
        await service.setHostingEnabled(hostInference);
        return service;
      }).finally(() => { peerStarting = null; });
    }
    return peerStarting;
  }
  async function connectionReady() {
    await ensurePeerService();
    await syncSharing();
  }
  function mutate(operation, signal) {
    assertOpen();
    const activeSignal = combined(signal);
    return mutations.run(() => { assertOpen(); return operation(activeSignal); }, { signal: activeSignal });
  }
  async function importModel(method, args) {
    let result;
    try { result = await original[method](...args); } catch (error) { throw modelStorageError(error); }
    await remember(result); await syncSharing(); return result;
  }
  async function loadModel(cid, options = {}) {
    if (deleting.has(cid)) throw new Error('This model is being deleted; retry deletion before loading it');
    assertLocallyAvailable(await runtime.store.getManifest(cid, { signal: options.signal }));
    if (!modelUses.has(cid)) modelUses.set(cid, await runtime.store.acquireUse(cid, { signal: options.signal }));
    let result;
    try { result = await original.load(cid, options); }
    catch (error) {
      // A failed load can retain a worker whose termination was not acknowledged.
      // Only a service with no matching session proves its file lease is releasable.
      if (runtime.service.getStatus().manifestCid !== cid) await releaseModelUse(cid);
      throw error;
    }
    current = await remember({ cid }); lastIdleAt = now();
    await ensurePeerService();
    return result;
  }
  async function unloadModel() {
    await peerService?.setHostingEnabled(false);
    await runtime.service.unloadModel();
    for (const cid of modelUses.keys()) await releaseModelUse(cid);
    current = null;
    await peerService?.setHostingEnabled(hostInference);
  }
  async function releaseModelUse(cid) {
    const release = modelUses.get(cid);
    if (release) { await release(); modelUses.delete(cid); }
  }
  for (const method of ['connect', 'connectBackend']) {
    runtime[method] = async (...args) => { assertOpen(); const result = await original[method](...args); await connectionReady(); return result; };
  }
  for (const method of ['importCatalog', 'importPackage']) {
    runtime[method] = (...args) => {
      const index = method === 'importPackage' ? 2 : 1;
      return mutate((signal) => {
        args[index] = { ...args[index], signal };
        return importModel(method, args);
      }, args[index]?.signal);
    };
  }
  runtime.ensure = (cid, options = {}) => mutate((signal) => importModel('ensure', [cid, { ...options, signal }]), options.signal);
  runtime.load = (cid, options = {}) => mutate((signal) => loadModel(cid, { ...options, signal }), options.signal);
  Object.assign(runtime, {
    getPreferences: () => ({ sharing, hostInference }),
    getSharingErrors: () => [...sharingErrors].map(([manifestCid, error]) => ({ manifestCid, message: error.message })),
    listModelSources() {
      return [...Object.values(catalog).map((entry) => ({ key: `hf:${entry.id}`, name: entry.name, source: 'hf',
        modelId: entry.id, ...capabilities(entry.model), runtime: entry.model.runtime, totalBytes: entry.totalBytes,
        localAvailability: localAvailability(entry) })),
      ...remoteModels().map((entry) => ({ ...entry, key: `peer:${entry.manifestCid}`, source: 'peers',
        localAvailability: localAvailability(entry) }))];
    },
    listInferenceTargets() {
      const model = resident();
      return [{ key: 'local', name: model?.name ?? 'No model loaded', local: true,
        available: !!model, busy: localRequests > 0, ...capabilities(model ?? {}), providerCount: model ? 1 : 0 },
      ...remoteHosts().map((entry) => ({ ...entry, key: `peer:${entry.manifestCid}`, local: false,
        available: true, busy: entry.hosts.every((host) => host.busy), providerCount: entry.hosts.length }))];
    },
    async refreshPeers({ signal } = {}) {
      assertOpen();
      if (!refreshing) refreshing = (async () => {
        const service = await ensurePeerService();
        await syncSharing();
        if (service) await service.refresh({ signal: combined(signal) });
        return { models: runtime.listModelSources(), targets: runtime.listInferenceTargets() };
      })().finally(() => { refreshing = null; });
      return refreshing;
    },
    async setSharing(value) {
      assertOpen(); const previous = sharing; sharing = Boolean(value);
      try { await syncSharing({ strict: true }); } catch (error) { sharing = previous; throw error; }
      return runtime.getPreferences();
    },
    async setHostInference(value) {
      assertOpen(); hostInference = Boolean(value);
      const service = await ensurePeerService();
      await service?.setHostingEnabled(hostInference);
      return runtime.getPreferences();
    },
    async acquireModel(key, options = {}) {
      assertOpen();
      if (acquiring) throw new Error('Another model import is already running');
      const source = runtime.listModelSources().find((entry) => entry.key === key);
      if (!source) throw new Error('This model source is no longer available');
      const profile = source.source === 'hf' ? catalog[source.modelId] : source;
      assertLocallyAvailable(profile);
      acquiring = mutate(async (signal) => {
        assertLocallyAvailable(profile);
        let record;
        if (source.source === 'hf') {
          const saved = [...retained.values()].find((entry) => entry.modelId === source.modelId);
          record = saved && await runtime.store.stat(saved.manifestCid, { signal });
          if (!record || record.status !== 'complete') record = await importModel('importCatalog', [source.modelId, { ...options, signal }]);
        } else {
          if (runtime.inspectPeerPackage) assertLocallyAvailable(await runtime.inspectPeerPackage(source.manifestCid, { signal }));
          record = await importModel('ensure', [source.manifestCid, { signal }]);
        }
        signal.throwIfAborted();
        // Recheck the actual persisted manifest before unloading a working model.
        assertLocallyAvailable(record.manifest ?? await runtime.store.getManifest(record.cid, { signal }));
        if (resident()?.manifestCid === record.cid) return { ...runtime.service.getStatus().evidence, manifestCid: record.cid };
        await unloadModel();
        return loadModel(record.cid, { ...options, signal });
      }, options.signal);
      try { return await acquiring; } finally { acquiring = null; }
    },
    unload() { return mutate(() => unloadModel()); },
    async listStoredModels({ signal } = {}) {
      assertOpen();
      const activeSignal = combined(signal);
      const records = await refreshStoredRecords(activeSignal);
      const status = runtime.service.getStatus();
      const actual = new Set(runtime.networkManager?.getPublishedArtifactCids?.() ?? []);
      return records.map((record) => ({
        manifestCid: record.cid, name: descriptor(record.cid, record.manifest)?.name ?? record.manifest.name ?? record.cid,
        totalBytes: record.manifest.files.reduce((sum, file) => sum + file.size, 0),
        runtime: record.manifest.model.runtime,
        loaded: status.status !== 'idle' && status.manifestCid === record.cid,
        shared: actual.has(record.cid),
        ...(record.status === 'deleting' || deleting.has(record.cid) ? { cleanupPending: true } : {}),
        ...(sharingErrors.has(record.cid) ? { shareError: sharingErrors.get(record.cid).message } : {}),
      }));
    },
    deleteStoredModel(input, { signal } = {}) {
      assertOpen();
      const cid = artifactCID(input).toString();
      if (deletions.has(cid)) return deletions.get(cid);
      signal?.throwIfAborted();
      // Stop admission immediately, including while an earlier import finishes.
      // A failed deletion stays quarantined until an explicit retry succeeds.
      deleting.add(cid);
      const deletion = mutate((activeSignal) => withModelDeletionOwnership(runtime, async () => {
        let unloaded = false;
        const record = await runtime.store.stat(cid, { signal: activeSignal });
        if (record && (record.kind !== 'manifest' || !record.manifest?.model?.runtime)) {
          deleting.delete(cid); throw new Error('Only stored model packages can be deleted here');
        }
        try {
          await publication.catch(() => {});
          if (runtime.networkManager?.getPublishedArtifactCids?.().includes(cid)) await runtime.withdraw(cid);
          published.delete(cid);
          const status = runtime.service.getStatus();
          const matching = current?.manifestCid === cid || status.manifestCid === cid;
          if (matching) {
            await peerService?.setHostingEnabled(false);
            const active = [...localGenerations].filter((request) => request.manifestCid === cid);
            for (const request of active) request.abort.abort(new DOMException('Stored model is being deleted', 'AbortError'));
            await Promise.allSettled(active.map((request) => request.promise));
            await runtime.service.unloadModel();
            await releaseModelUse(cid);
            current = null; unloaded = true;
          }
          activeSignal.throwIfAborted();
          const result = await runtime.store.remove(cid, { signal: activeSignal });
          retained.delete(cid); deleting.delete(cid); sharingErrors.delete(cid);
          await peerService?.setHostingEnabled(hostInference);
          return { deleted: result.removed, freedBytes: result.freedBytes, unloaded };
        } catch (error) {
          const present = await runtime.store.stat(cid).catch(() => undefined);
          if (present === undefined) retained.delete(cid);
          // Quarantine still prevents this CID from being hosted. Other models
          // can be selected after a failed deletion without changing preference.
          await peerService?.setHostingEnabled(hostInference).catch(() => {});
          throw error;
        }
      }, { signal: activeSignal }), signal).finally(() => { deletions.delete(cid); });
      deletions.set(cid, deletion);
      return deletion;
    },
    async generate(target, options = {}) {
      assertOpen();
      const requestId = options.requestId ?? crypto.randomUUID();
      if (requests.has(requestId)) throw new Error('Duplicate inference request ID');
      const abort = new AbortController();
      const signal = AbortSignal.any([combined(options.signal), abort.signal]);
      const request = { abort, remote: target !== 'local' }; requests.set(requestId, request);
      try {
        const input = { ...options, requestId, signal };
        if (target === 'local') return await generateLocal(input);
        const entry = remoteHosts().find((model) => `peer:${model.manifestCid}` === target);
        if (!entry) throw new Error('No peer is currently hosting that model');
        if (options.image && !entry.modalities.includes('image')) throw new Error('This model accepts text only');
        return await peerService.generate(entry.manifestCid, { ...input, task: entry.task });
      } finally { requests.delete(requestId); }
    },
    async cancel(requestId) {
      const request = requests.get(requestId); if (!request) return false;
      request.abort.abort('User cancelled');
      if (request.remote) await peerService?.cancel(requestId);
      else await runtime.service.cancel(requestId);
      return true;
    },
  });
  runtime.dispose = async () => {
    closed = true; hostInference = false; current = null; lifetime.abort('Model console closed');
    for (const request of requests.values()) request.abort.abort('Model console closed');
    await peerStarting?.catch(() => {});
    // Failed startup may leave a manager-owned handle awaiting cleanup even
    // though createPeerInferenceService never resolved into peerService.
    await runtime.networkManager?.releasePeerInferenceService(owner);
    peerService = null;
    await Promise.allSettled([publication, refreshing, acquiring, mutations.settled()].filter(Boolean));
    await original.dispose();
    for (const cid of modelUses.keys()) await releaseModelUse(cid);
  };
  return { async initialize() {
    await runtime.checkDeviceCapabilities?.();
    await refreshStoredRecords(lifetime.signal);
    if (runtime.networkReady) await connectionReady();
  } };
}
