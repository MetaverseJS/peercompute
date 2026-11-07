import { createModelMutationQueue, listStoredModelRecords, modelStorageError, withModelDeletionOwnership } from './modelLibrary.js';
import { artifactCID } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { PEER_INFERENCE_LIMITS } from '../../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { findModelCatalogEntry, VOICE_MODEL_LOAD_HINT } from './modelDeviceCompatibility.js';
import { validateHubPackage, matchesHubPackage, verifyStoredHubPackage } from './modelHubPackage.js';
import { createModelPreferences, DEFAULT_MODEL_ID } from './modelPreferences.js';

function compareModelSizes(left, right) {
  const size = (value) => Number.isSafeInteger(value) && value >= 0 ? value : Infinity;
  const a = size(left.totalBytes), b = size(right.totalBytes);
  if (a !== b) return a < b ? -1 : 1;
  const label = (value) => `${value.name ?? ''}\0${value.key ?? value.manifestCid ?? ''}`;
  return label(left) < label(right) ? -1 : label(left) > label(right) ? 1 : 0;
}

function capabilities(model = {}) {
  const modalities = [...(model.modalities ?? ['text'])];
  const task = model.task ?? (modalities.includes('image') ? 'image-text-to-text' : 'text-generation');
  return { task, modalities, outputModalities: [...(model.outputModalities ?? [task === 'text-to-image' ? 'image' : 'text'])] };
}
const voiceManaged = (entry) => (entry?.model ?? entry)?.runtime === 'transformers-speech';

function awaitLoadStep(promise, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    let timer;
    const finish = (callback, value) => {
      clearTimeout(timer); signal?.removeEventListener('abort', abort); callback(value);
    };
    const abort = () => finish(reject, signal.reason);
    signal?.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then((value) => finish(resolve, value), (error) => finish(reject, error));
    // Peer registration is optional for a local load. Its existing tracked
    // promise remains owned by the controller if registration is still pending.
    if (timeoutMs !== undefined) timer = setTimeout(() => finish(resolve), timeoutMs);
    if (signal?.aborted) abort();
  });
}

/** UI policy over manager-owned storage, inference and private peer streams. */
export function attachModelRuntimeController(runtime, { catalog, now = Date.now,
  preferences = createModelPreferences({ storeName: runtime.store.lockName ?? runtime.store.name }) } = {}) {
  const original = Object.fromEntries(['importCatalog', 'importPackage', 'importHub', 'ensure', 'load', 'connect', 'connectBackend', 'dispose']
    .filter((key) => typeof runtime[key] === 'function').map((key) => [key, runtime[key].bind(runtime)]));
  const owner = {};
  const retained = new Map();
  const retainedManifests = new Map();
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
  let peerService, peerStarting, refreshing, acquiring, backgroundSharing;
  let current = null, localRequests = 0, lastIdleAt = now();
  let publication = Promise.resolve();
  let lastLoaded = preferences.readLastLoaded();
  let discovery = { connected: false, peerCount: 0, sharedModelCount: 0, hostedModelCount: 0,
    errors: [], checkedAt: null };

  const assertOpen = () => { if (closed) throw new Error('Model console is closed'); };
  const combined = (signal) => signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal;
  function localAvailability(entry) {
    // Peer display metadata cannot lower a trusted model's resource estimate.
    const approved = !entry.model && findModelCatalogEntry(entry, Object.values(catalog));
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
  function assertChatLoadable(entry) {
    assertLocallyAvailable(entry);
    if (voiceManaged(entry)) throw Object.assign(new Error(VOICE_MODEL_LOAD_HINT), { code: 'ERR_MODEL_VOICE_MANAGED' });
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
    const match = findModelCatalogEntry(manifest, Object.values(catalog));
    return { manifestCid: cid, modelId: match?.id ?? cid, name: match?.name ?? manifest.name ?? manifest.model.repository,
      ...capabilities(manifest.model), runtime: manifest.model.runtime,
      repository: manifest.model.repository, revision: manifest.model.revision,
      totalBytes: manifest.files.reduce((sum, file) => sum + file.size, 0) };
  }
  async function remember(record, { signal } = {}) {
    if (!record?.cid) throw new Error('Imported package has no content identity');
    const manifest = record.manifest ?? await runtime.store.getManifest(record.cid, { signal });
    signal?.throwIfAborted();
    const model = descriptor(record.cid, manifest);
    if (model) {
      retained.set(record.cid, model);
      retainedManifests.set(record.cid, manifest);
    }
    return model;
  }
  async function refreshStoredRecords(signal) {
    const records = await listStoredModelRecords(runtime.store, { signal });
    const available = new Set();
    for (const record of records) {
      if (record.status === 'deleting') { deleting.add(record.cid); continue; }
      if (record.pinned || record.retain) { available.add(record.cid); await remember(record); }
    }
    for (const cid of retained.keys()) if (!available.has(cid)) { retained.delete(cid); retainedManifests.delete(cid); }
    if (lastLoaded && !available.has(lastLoaded.manifestCid)) {
      lastLoaded = await preferences.clearLastLoaded(lastLoaded);
    }
    return records;
  }
  async function rememberSuccessfulLoad(cid, signal) {
    const model = resident();
    if (signal?.aborted || model?.manifestCid !== cid) return;
    lastLoaded = await preferences.rememberLoaded({ manifestCid: cid, modelId: model.modelId }, { signal });
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

  function recordDiscovery(errors = []) {
    const manager = runtime.networkManager;
    const connected = Boolean(manager?.isConnected);
    const peers = new Set(connected ? manager.peers?.keys() ?? [] : []);
    for (const connection of connected ? manager.libp2p?.getConnections?.() ?? [] : []) {
      if (connection.status === 'open') peers.add(connection.remotePeer.toString());
    }
    peers.delete(manager?.libp2p?.peerId?.toString());
    for (const relay of manager?.bootstrapPeerIds ?? []) peers.delete(relay);
    discovery = { connected, peerCount: peers.size, sharedModelCount: connected ? remoteModels().length : 0,
      hostedModelCount: connected ? remoteHosts().length : 0, checkedAt: now(),
      errors: (Array.isArray(errors) ? errors : []).slice(0, PEER_INFERENCE_LIMITS.maximumPeers).map((error) => ({
        peerId: String(error?.peerId ?? '').slice(0, 128),
        code: String(error?.code ?? 'ERR_PEER_DISCOVERY').slice(0, 80),
        message: String(error?.message ?? 'Peer directory query failed').slice(0, 256),
      })) };
  }

  function refreshSharingInBackground(cid) {
    if (closed || backgroundSharing) return;
    // A single background pass joins the same chain as explicit sharing changes.
    // Directory polls must neither await it nor append another pass while busy.
    backgroundSharing = syncSharing().catch((error) => {
      if (closed) return;
      for (const root of cid ? [cid] : retained.keys()) sharingErrors.set(root, error);
    }).finally(() => { backgroundSharing = null; });
  }

  async function syncSharing({ strict = false } = {}) {
    const work = async () => {
      if (closed || !(runtime.artifactReady ?? runtime.networkReady)) return;
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
          // The inference-directory protocol supports these tasks only. Speech
          // packages remain in file storage/sharing without poisoning its schema.
          const models = [...retained.values()].filter((model) => published.has(model.manifestCid) && !deleting.has(model.manifestCid)
            && ['text-generation', 'image-text-to-text', 'text-to-image'].includes(model.task));
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
    refreshSharingInBackground();
  }
  function mutate(operation, signal) {
    assertOpen();
    const activeSignal = combined(signal);
    return mutations.run(() => { assertOpen(); return operation(activeSignal); }, { signal: activeSignal });
  }
  async function importModel(method, args, { deferSharing = false } = {}) {
    let result;
    try { result = await original[method](...args); } catch (error) { throw modelStorageError(error); }
    await remember(result);
    if (!deferSharing) await syncSharing();
    return result;
  }
  function shareAfterLoad(cid) {
    refreshSharingInBackground(cid);
  }
  async function loadModel(cid, options = {}) {
    if (deleting.has(cid)) throw new Error('This model is being deleted; retry deletion before loading it');
    assertChatLoadable(await runtime.store.getManifest(cid, { signal: options.signal }));
    if (!modelUses.has(cid)) modelUses.set(cid, await runtime.store.acquireUse(cid, { signal: options.signal }));
    const signal = options.signal;
    let preferenceReceipt;
    try {
      const result = await original.load(cid, options);
      signal?.throwIfAborted();
      const next = await awaitLoadStep(remember({ cid }, { signal }), signal);
      signal?.throwIfAborted();
      await awaitLoadStep(ensurePeerService(), signal, 3000);
      signal?.throwIfAborted();
      preferenceReceipt = await preferences.rememberLoadedWithReceipt({ manifestCid: cid, modelId: next.modelId }, { signal });
      lastLoaded = preferenceReceipt.record;
      signal?.throwIfAborted();
      current = next; lastIdleAt = now();
      return { ...result, manifestCid: cid };
    }
    catch (error) {
      const failures = [];
      if (signal?.aborted && runtime.service.getStatus().manifestCid === cid) {
        // Cancellation may arrive after the managed loader returned ready.
        // Hide it from new peer requests, then await acknowledged worker cleanup.
        if (current?.manifestCid === cid) current = null;
        try { await runtime.service.unloadModel(); }
        catch (cleanupError) { failures.push(cleanupError); }
      }
      // A failed load can retain a worker whose termination was not acknowledged.
      // Only a service with no matching session proves its file lease is releasable.
      if (runtime.service.getStatus().manifestCid !== cid) await releaseModelUse(cid);
      if (signal?.aborted && preferenceReceipt?.committed) {
        try { lastLoaded = await preferences.restoreLastLoaded(preferenceReceipt); }
        catch (restoreError) { failures.push(restoreError); }
      }
      if (failures.length) throw new AggregateError([error, ...failures], 'Model load cancelled and cleanup is incomplete');
      throw error;
    }
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
  async function activateRecord(record, options, signal) {
    signal.throwIfAborted();
    // Validate persisted metadata before replacing a working local session.
    assertChatLoadable(record.manifest ?? await runtime.store.getManifest(record.cid, { signal }));
    signal.throwIfAborted();
    if (resident()?.manifestCid === record.cid) {
      await rememberSuccessfulLoad(record.cid, signal);
      shareAfterLoad(record.cid);
      return { ...runtime.service.getStatus().evidence, manifestCid: record.cid };
    }
    options.onProgress?.({ stage: 'unload' }); signal.throwIfAborted();
    await unloadModel(); signal.throwIfAborted();
    options.onProgress?.({ stage: 'load' }); signal.throwIfAborted();
    const result = await loadModel(record.cid, { ...options, signal });
    shareAfterLoad(record.cid);
    return result;
  }
  async function acquire(operation, signal) {
    assertOpen();
    if (acquiring) throw new Error('Another model import or load is already running');
    acquiring = mutate(operation, signal);
    try { return await acquiring; } finally { acquiring = null; }
  }
  for (const method of ['connect', 'connectBackend']) {
    runtime[method] = async (...args) => { assertOpen(); const result = await original[method](...args); await connectionReady(); return result; };
  }
  for (const method of ['importCatalog', 'importPackage', 'importHub'].filter((key) => original[key])) {
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
    getDiscoveryStatus: () => structuredClone({ ...discovery, connected: Boolean(runtime.networkManager?.isConnected) }),
    getPreferredModelSourceKey() {
      const saved = lastLoaded && !deleting.has(lastLoaded.manifestCid) && retained.get(lastLoaded.manifestCid);
      return saved && !voiceManaged(saved) ? catalog[saved.modelId] ? `hf:${saved.modelId}` : `stored:${saved.manifestCid}`
        : `hf:${DEFAULT_MODEL_ID}`;
    },
    getStartupModel() {
      assertOpen();
      const saved = [...retained.values()].filter((entry) => !voiceManaged(entry) && !deleting.has(entry.manifestCid))
        .sort(compareModelSizes).map((entry) => ({
          sourceKey: catalog[entry.modelId] ? `hf:${entry.modelId}` : `stored:${entry.manifestCid}`,
          manifestCid: entry.manifestCid, name: entry.name,
          localAvailability: localAvailability(retainedManifests.get(entry.manifestCid) ?? entry),
        }));
      const choices = Object.values(catalog).filter((entry) => !voiceManaged(entry)).map((entry) => ({ ...entry, key: `hf:${entry.id}` }))
        .sort(compareModelSizes).map((entry) => ({ sourceKey: entry.key, name: entry.name,
          localAvailability: localAvailability(entry) }));
      const preferred = saved.find((entry) => entry.manifestCid === lastLoaded?.manifestCid);
      const fallback = choices.find((entry) => entry.sourceKey === `hf:${DEFAULT_MODEL_ID}`);
      // Unknown physical memory remains eligible under the admission policy.
      // Pending checks never authorize a speculative replacement download.
      const supported = (entry) => ['available', 'unknown'].includes(entry?.localAvailability.status);
      const checking = (entry) => entry?.localAvailability.status === 'checking';
      return (supported(preferred) ? preferred : null) ?? saved.find(supported)
        ?? (checking(preferred) ? preferred : null) ?? saved.find(checking)
        ?? (supported(fallback) || checking(fallback) ? fallback : null) ?? choices.find(supported)
        ?? choices.find(checking) ?? preferred ?? saved[0] ?? fallback ?? choices[0] ?? null;
    },
    listModelSources() {
      return [...Object.values(catalog).map((entry) => ({ key: `hf:${entry.id}`, name: entry.name, source: 'hf',
        modelId: entry.id, ...capabilities(entry.model), runtime: entry.model.runtime, totalBytes: entry.totalBytes,
        description: entry.description ?? '', repository: entry.repository ?? entry.model.repository,
        revision: entry.revision ?? entry.model.revision, license: entry.license, model: entry.model, files: entry.files,
        dtype: entry.model.dtype, catalog: true,
        ...(() => { const saved = [...retained.values()].find((item) => item.modelId === entry.id);
          return saved ? { stored: true, manifestCid: saved.manifestCid } : {}; })(),
        localAvailability: localAvailability(entry) })),
      ...remoteModels().map((entry) => ({ ...entry, key: `peer:${entry.manifestCid}`, source: 'peers',
        localAvailability: localAvailability(entry) })),
      ...[...retained.values()].filter((entry) => !catalog[entry.modelId] && !deleting.has(entry.manifestCid))
        .map((entry) => ({ ...entry, key: `stored:${entry.manifestCid}`, source: 'stored',
          model: retainedManifests.get(entry.manifestCid)?.model,
          files: retainedManifests.get(entry.manifestCid)?.files,
          description: retainedManifests.get(entry.manifestCid)?.description ?? '',
          license: retainedManifests.get(entry.manifestCid)?.provenance?.license,
          dtype: retainedManifests.get(entry.manifestCid)?.model?.dtype,
          localAvailability: localAvailability(retainedManifests.get(entry.manifestCid) ?? entry) }))]
        .filter((entry) => !voiceManaged(entry)).sort(compareModelSizes);
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
        const activeSignal = combined(signal);
        try {
          activeSignal.throwIfAborted();
          const service = await ensurePeerService();
          activeSignal.throwIfAborted();
          refreshSharingInBackground();
          const result = service ? await service.refresh({ signal: activeSignal }) : null;
          activeSignal.throwIfAborted();
          recordDiscovery(result?.errors);
          return { models: runtime.listModelSources(), targets: runtime.listInferenceTargets(), discovery: runtime.getDiscoveryStatus() };
        } catch (error) {
          if (!closed && !activeSignal.aborted) recordDiscovery([error]);
          throw error;
        }
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
      const source = runtime.listModelSources().find((entry) => entry.key === key);
      if (!source) throw new Error('This model source is no longer available');
      if (source.source === 'stored') return runtime.loadStoredModel(source.manifestCid, options);
      const profile = source.source === 'hf' ? catalog[source.modelId] : source;
      assertChatLoadable(profile);
      return acquire(async (signal) => {
        assertChatLoadable(profile);
        let record;
        if (source.source === 'hf') {
          const preferred = lastLoaded && retained.get(lastLoaded.manifestCid);
          const saved = preferred?.modelId === source.modelId ? preferred
            : [...retained.values()].find((entry) => entry.modelId === source.modelId);
          record = saved && await runtime.store.stat(saved.manifestCid, { signal });
          if (!record || record.status !== 'complete') record = await importModel('importCatalog', [source.modelId, { ...options, signal }], { deferSharing: true });
        } else {
          if (runtime.inspectPeerPackage) assertLocallyAvailable(await runtime.inspectPeerPackage(source.manifestCid, { signal }));
          signal.throwIfAborted();
          options.onProgress?.({ stage: 'download-peers' });
          signal.throwIfAborted();
          record = await importModel('ensure', [source.manifestCid, { signal }], { deferSharing: true });
        }
        return activateRecord(record, options, signal);
      }, options.signal);
    },
    acquireHubModel(entry, options = {}) {
      assertOpen();
      if (!original.importHub) throw new Error('Hub import is unavailable in this runtime');
      // Copy and validate before entering the async queue so caller mutations
      // cannot change the chosen revision/files while replacement waits.
      entry = structuredClone(entry);
      validateHubPackage(entry);
      assertLocallyAvailable(entry);
      return acquire(async (signal) => {
        assertLocallyAvailable(entry);
        const saved = [...retainedManifests].find(([cid, manifest]) => !deleting.has(cid) && matchesHubPackage(manifest, entry));
        let record = saved && await runtime.store.stat(saved[0], { signal });
        if (record && !await verifyStoredHubPackage(runtime.store, saved[1], entry, { signal })) record = null;
        if (!record || record.status !== 'complete') record = await importModel('importHub', [entry, { ...options, signal, reuseManifest: saved?.[1] }], { deferSharing: true });
        return activateRecord(record, options, signal);
      }, options.signal);
    },
    loadStoredModel(input, options = {}) {
      const cid = artifactCID(input).toString();
      return acquire(async (signal) => {
        if (deleting.has(cid)) throw new Error('This model is being deleted; retry deletion before loading it');
        const record = await runtime.store.stat(cid, { signal });
        if (record?.kind !== 'manifest' || record.status !== 'complete' || !(record.pinned || record.retain)) {
          throw new Error('This model is no longer completely stored and retained on this device. Import it before loading.');
        }
        return activateRecord(record, options, signal);
      }, options.signal);
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
        modelId: descriptor(record.cid, record.manifest)?.modelId ?? record.cid,
        totalBytes: record.manifest.files.reduce((sum, file) => sum + file.size, 0),
        runtime: record.manifest.model.runtime,
        ...(voiceManaged(record.manifest) ? { loadMode: 'voice', loadHint: VOICE_MODEL_LOAD_HINT } : {}),
        localAvailability: record.status === 'deleting' || deleting.has(record.cid)
          ? { status: 'unavailable', code: 'model_deleting', reason: 'Finish deleting this package before loading it.' }
          : !(record.pinned || record.retain)
            ? { status: 'unavailable', code: 'model_not_retained', reason: 'This package is not retained for local use. Import it before loading.' }
            : localAvailability(record.manifest),
        loaded: (status.status !== 'idle' && status.manifestCid === record.cid)
          || Object.values(runtime.services ?? {}).some((service) => service.getStatus().status !== 'idle' && service.getStatus().manifestCid === record.cid),
        shared: actual.has(record.cid),
        ...(record.status === 'deleting' || deleting.has(record.cid) ? { cleanupPending: true } : {}),
        ...(sharingErrors.has(record.cid) ? { shareError: sharingErrors.get(record.cid).message } : {}),
      })).sort(compareModelSizes);
    },
    deleteStoredModel(input, { signal } = {}) {
      assertOpen();
      const cid = artifactCID(input).toString();
      if (deletions.has(cid)) return deletions.get(cid);
      signal?.throwIfAborted();
      // Stop admission immediately, including while an earlier import finishes.
      // Once cleanup starts, a failed deletion stays quarantined until retry.
      const wasDeleting = deleting.has(cid);
      let ownershipEntered = false;
      deleting.add(cid);
      const deletion = mutate((activeSignal) => withModelDeletionOwnership(runtime, async () => {
        ownershipEntered = true;
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
          unloaded = await runtime.unloadAuxiliaryModel?.(cid) || unloaded;
          activeSignal.throwIfAborted();
          const result = await runtime.store.remove(cid, { signal: activeSignal });
          retained.delete(cid); retainedManifests.delete(cid); deleting.delete(cid); sharingErrors.delete(cid);
          if (lastLoaded?.manifestCid === cid) lastLoaded = await preferences.clearLastLoaded(lastLoaded);
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
      }, { signal: activeSignal }), signal).catch((error) => {
        // A denied owner lock or queued cancellation has not changed storage.
        // Clear only this attempt's marker, never an earlier cleanup failure.
        if (!ownershipEntered && !wasDeleting) deleting.delete(cid);
        throw error;
      }).finally(() => { deletions.delete(cid); });
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
    await Promise.allSettled([publication, backgroundSharing, refreshing, acquiring, mutations.settled()].filter(Boolean));
    await original.dispose();
    for (const cid of modelUses.keys()) await releaseModelUse(cid);
  };
  return { async initialize() {
    await runtime.checkDeviceCapabilities?.();
    await refreshStoredRecords(lifetime.signal);
    if (runtime.networkManager?.isConnected) await connectionReady();
  } };
}
