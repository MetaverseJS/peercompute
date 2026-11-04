/** UI policy over manager-owned storage, inference and private peer streams. */
export function attachModelRuntimeController(runtime, { catalog, now = Date.now } = {}) {
  const original = Object.fromEntries(['importCatalog', 'importPackage', 'load', 'connect', 'connectBackend', 'dispose']
    .map((key) => [key, runtime[key].bind(runtime)]));
  const owner = {};
  const retained = new Map();
  const published = new Set();
  const requests = new Map();
  const lifetime = new AbortController();
  let sharing = true, hostInference = true, closed = false;
  let peerService, peerStarting, refreshing, acquiring;
  let current = null, localRequests = 0, lastIdleAt = now();
  let publication = Promise.resolve();

  const assertOpen = () => { if (closed) throw new Error('Model console is closed'); };
  const combined = (signal) => signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal;
  function descriptor(cid, manifest) {
    if (!manifest?.model?.runtime || !manifest.model.repository) return null;
    const match = Object.values(catalog).find((entry) => entry.model.repository === manifest.model.repository
      && entry.model.revision === manifest.model.revision && entry.model.runtime === manifest.model.runtime);
    return { manifestCid: cid, modelId: match?.id ?? cid, name: match?.name ?? manifest.name ?? manifest.model.repository,
      modalities: manifest.model.modalities ?? ['text'], runtime: manifest.model.runtime,
      repository: manifest.model.repository, revision: manifest.model.revision,
      totalBytes: manifest.files.reduce((sum, file) => sum + file.size, 0) };
  }
  async function remember(record) {
    if (!record?.cid) throw new Error('Imported package has no content identity');
    const model = descriptor(record.cid, record.manifest ?? await runtime.store.getManifest(record.cid));
    if (model) {
      if (!retained.has(record.cid) && retained.size >= 128) throw new Error('Model catalog is full');
      retained.set(record.cid, model);
    }
    return model;
  }
  function resident() {
    const status = runtime.service.getStatus();
    return current && status.status === 'ready' && status.manifestCid === current.manifestCid ? current : null;
  }
  const remoteModels = () => (peerService?.listModels() ?? []).map((entry) => ({ ...entry,
    providers: entry.providers.filter((provider) => !provider.local) })).filter((entry) => entry.providers.length);
  const remoteHosts = () => (peerService?.listHosts() ?? []).map((entry) => ({ ...entry,
    hosts: entry.hosts.filter((host) => !host.local) })).filter((entry) => entry.hosts.length);

  async function syncSharing() {
    const work = async () => {
      if (closed || !runtime.networkReady) return;
      const actual = new Set(runtime.networkManager.getPublishedArtifactCids());
      for (const cid of retained.keys()) {
        if (sharing && !actual.has(cid)) { await runtime.publish(cid); actual.add(cid); }
        if (!sharing && actual.has(cid)) { await runtime.withdraw(cid); actual.delete(cid); }
        if (actual.has(cid)) published.add(cid); else published.delete(cid);
      }
    };
    publication = publication.catch(() => {}).then(work);
    return publication;
  }
  async function generateLocal(options) {
    const model = resident();
    if (!model) throw new Error('Import a model before using local inference');
    if (options.image && !model.modalities.includes('image')) throw new Error('This model accepts text only');
    localRequests++;
    try { return await runtime.service.generate(options); }
    finally { if (--localRequests === 0) lastIdleAt = now(); }
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
          return { sharedModels: sharing ? [...retained.values()].filter((model) => published.has(model.manifestCid)) : [],
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
  for (const method of ['connect', 'connectBackend']) {
    runtime[method] = async (...args) => { assertOpen(); const result = await original[method](...args); await connectionReady(); return result; };
  }
  for (const method of ['importCatalog', 'importPackage']) {
    runtime[method] = async (...args) => {
      assertOpen(); const result = await original[method](...args);
      await remember(result); await syncSharing(); return result;
    };
  }
  runtime.load = async (cid, options = {}) => {
    assertOpen();
    const result = await original.load(cid, options);
    current = await remember({ cid }); lastIdleAt = now();
    await ensurePeerService();
    return result;
  };
  Object.assign(runtime, {
    getPreferences: () => ({ sharing, hostInference }),
    listModelSources() {
      return [...Object.values(catalog).map((entry) => ({ key: `hf:${entry.id}`, name: entry.name, source: 'hf',
        modelId: entry.id, modalities: entry.model.modalities, runtime: entry.model.runtime, totalBytes: entry.totalBytes })),
      ...remoteModels().map((entry) => ({ ...entry, key: `peer:${entry.manifestCid}`, source: 'peers' }))];
    },
    listInferenceTargets() {
      const model = resident();
      return [{ key: 'local', name: model?.name ?? 'No model loaded', local: true,
        available: !!model, busy: localRequests > 0, modalities: model?.modalities ?? ['text'], providerCount: model ? 1 : 0 },
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
      try { await syncSharing(); } catch (error) { sharing = previous; throw error; }
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
      acquiring = (async () => {
        const signal = combined(options.signal); signal.throwIfAborted();
        let record;
        if (source.source === 'hf') {
          const saved = [...retained.values()].find((entry) => entry.modelId === source.modelId);
          record = saved && await runtime.store.stat(saved.manifestCid, { signal });
          if (!record || record.status !== 'complete') record = await runtime.importCatalog(source.modelId, { ...options, signal });
        } else {
          record = await runtime.ensure(source.manifestCid, { signal });
          await remember(record); await syncSharing();
        }
        signal.throwIfAborted();
        if (resident()?.manifestCid === record.cid) return { ...runtime.service.getStatus().evidence, manifestCid: record.cid };
        await runtime.unload();
        return runtime.load(record.cid, { ...options, signal });
      })();
      try { return await acquiring; } finally { acquiring = null; }
    },
    async unload() {
      assertOpen(); current = null;
      await peerService?.setHostingEnabled(false);
      await runtime.service.unloadModel();
      await peerService?.setHostingEnabled(hostInference);
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
        return await peerService.generate(entry.manifestCid, input);
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
    if (peerService) {
      await runtime.networkManager.releasePeerInferenceService(owner);
      peerService = null;
    }
    await Promise.allSettled([publication, refreshing, acquiring].filter(Boolean));
    await original.dispose();
  };
  return { async initialize() {
    for await (const record of runtime.store.list()) {
      if (record.kind === 'manifest' && record.status === 'complete' && record.pinned) await remember(record);
    }
    if (runtime.networkReady) await connectionReady();
  } };
}
