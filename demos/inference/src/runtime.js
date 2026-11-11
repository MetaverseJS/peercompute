import { StateManager } from '../../../peercompute/src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../../peercompute/src/peercompute/computeManager/ComputeManager.js';
import { ResidentModelRegistry } from '../../../peercompute/src/peercompute/inference/ResidentModelRegistry.js';
import { SPEECH_MODEL_CATALOG, speechModelFileUrl } from '../../../peercompute/src/peercompute/inference/speech/speechCatalog.js';
import { MODEL_CATALOG as INFERENCE_CATALOG, modelFileUrl } from '../../../peercompute/src/peercompute/inference/modelCatalog.js';
import { MODEL_ARTIFACT_CATALOG, modelArtifactFileUrl } from '../../../peercompute/src/peercompute/artifacts/modelArtifactCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/ggufModelCatalog.js';
import { DIFFUSION_MODEL_CATALOG, diffusionModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/diffusionModelCatalog.js';
import { MESH_MODEL_CATALOG, meshModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/meshModelCatalog.js';
import { artifactCID, decodeArtifactManifest, normalizeArtifactManifest, ARTIFACT_MANIFEST_MAXIMUM_BYTES } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { collectModelDeviceCapabilities, evaluateModelCompatibility, modelMemoryEstimate } from './modelDeviceCompatibility.js';
import { createModelMemoryBudgets } from './modelMemoryBudgets.js';
import { importModelPackage } from './modelLibrary.js';
import { trustedCatalogSource } from './modelCatalogSources.js';
import { inspectLoraHub, createStoredLoraComposition } from './modelLora.js';
import { createModelPreferences } from './modelPreferences.js';
import { loadInferenceRelayConfig } from './relayConfig.js';
import { createHuggingFaceClient, huggingFaceFileUrl } from './huggingface/hubClient.js';
import { inspectHuggingFaceModel } from './huggingface/packageResolver.js';
import { findHuggingFaceConversions } from './huggingface/conversionFinder.js';
import { validateHubPackage, reuseVerifiedHubFiles } from './modelHubPackage.js';
import { attachModelRuntimeController } from './modelRuntimeController.js';
import { createModelNetworkConnection } from './modelNetworkConnection.js';
import { createModelNetworkTelemetry } from './modelNetworkTelemetry.js';
import { AgentRuntime } from '../../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { createAgentModelAdapter } from './agentModelAdapter.js';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import factoryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';
import ggufWasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';
import diffusionWasmUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.jsep.wasm?url';
import diffusionFactoryUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.jsep.mjs?url';
import meshWasmUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.asyncify.wasm?url';
import meshFactoryUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.asyncify.mjs?url';

export const MODEL_CATALOG = Object.freeze({ ...INFERENCE_CATALOG, ...MODEL_ARTIFACT_CATALOG, ...GGUF_MODEL_CATALOG, ...DIFFUSION_MODEL_CATALOG, ...SPEECH_MODEL_CATALOG, ...MESH_MODEL_CATALOG });

export function trustedRuntimeAssets(runtimeBaseUrl) {
  if (runtimeBaseUrl) {
    const base = new URL(runtimeBaseUrl, location.href);
    return { mjs: new URL('ort-wasm-simd-threaded.asyncify.mjs', base).href,
      wasm: new URL('ort-wasm-simd-threaded.asyncify.wasm', base).href };
  }
  return { mjs: new URL(factoryUrl, location.href).href, wasm: new URL(wasmUrl, location.href).href };
}

export function trustedGgufRuntimeAssets() {
  return { wasm: new URL(ggufWasmUrl, location.href).href };
}

export function trustedDiffusionRuntimeAssets() {
  return { mjs: new URL(diffusionFactoryUrl, location.href).href, wasm: new URL(diffusionWasmUrl, location.href).href };
}

export function trustedMeshRuntimeAssets() {
  return { mjs: new URL(meshFactoryUrl, location.href).href, wasm: new URL(meshWasmUrl, location.href).href };
}

export async function checkGgufCapabilities() {
  const { validateGgufCapabilities } = await import('../../../peercompute/src/peercompute/inference/gguf/runtimeDefinition.js');
  return validateGgufCapabilities();
}

/** Reusable app facade; storage and execution remain owned by PeerCompute managers. */
export async function createInferenceRuntime({ stateManager, computeManager, networkManager,
  storeName = 'inference-models', runtimeBaseUrl, collectGpuEvidence = false, telemetryApplication = 'inference',
  memoryBudgets, preferenceStorage, residentModelSlots = 8, auxiliaryWorkerSlots = 0, probeDeviceCapabilities = collectModelDeviceCapabilities,
  ggufRuntimeOptions = { n_ctx: 2048, n_batch: 64, n_gpu_layers: 99999, n_threads: 1 } } = {}) {
  if (!Number.isInteger(residentModelSlots) || residentModelSlots < 1 || residentModelSlots > 8) {
    throw new Error('Managed model slots must be between one and eight');
  }
  if (!Number.isInteger(auxiliaryWorkerSlots) || auxiliaryWorkerSlots < 0 || auxiliaryWorkerSlots > 2) {
    throw new Error('Auxiliary worker slots must be between zero and two');
  }
  let deviceCapabilities = null, deviceCheck;
  const ownsState = !stateManager;
  const ownsCompute = !computeManager;
  const state = stateManager ?? new StateManager(networkManager ?? null, {
    enablePersistence: false, disableNetworkProvider: true, disableBroadcast: true,
  });
  const compute = computeManager ?? new ComputeManager({ requireWorkers: true, enableWorkers: true,
    enableWebGPU: true, minWorkers: 1, targetWorkers: 1, maxWorkers: residentModelSlots + auxiliaryWorkerSlots, autoScaleWorkers: false,
    workerBootstrapTimeoutMs: 60_000 });
  const memoryPolicy = createModelMemoryBudgets({ computeManager: compute, owned: ownsCompute, initial: memoryBudgets });
  const admissionOptions = memoryPolicy.admissionOptions;
  const existingTransport = networkManager?.getArtifactTransport?.();
  const existingStore = existingTransport?.store ?? state.getArtifactStore(storeName);
  const store = existingStore
    ?? state.createArtifactStore({ name: storeName, capacity: 'browser', maximumTraversalBlocks: 131072 });
  let service;
  let ggufService;
  let diffusionService;
  let activeService;
  let residents;
  const createdServices = new Set();
  const claimedServices = new Set();
  const trackedServices = new WeakSet();
  function trackService(candidate) {
    createdServices.add(candidate);
    if (!trackedServices.has(candidate)) {
      trackedServices.add(candidate);
      const dispose = candidate.dispose.bind(candidate);
      candidate.dispose = async () => {
        const result = await dispose();
        createdServices.delete(candidate); claimedServices.delete(candidate);
        return result;
      };
    }
    return candidate;
  }
  let agents, agentsStarting, disposingAgents = false;
  const auxiliaryServices = new Map();
  const networkTelemetry = createModelNetworkTelemetry({ computeManager: compute, application: telemetryApplication });
  networkTelemetry.attach(networkManager);
  const networkConnection = createModelNetworkConnection({ store, manager: networkManager,
    async createManager(config) {
      const { NetworkManager } = await import('../../../peercompute/src/peercompute/networkManager/NetworkManager.js');
      const manager = new NetworkManager(config);
      networkTelemetry.attach(manager);
      return manager;
    } });
  try {
    await store.open();
    service = await compute.createModelInferenceService({ artifactStore: store,
      resourceBudgets: memoryPolicy.initialResourceBudgets(residentModelSlots), admissionOptions,
      resourceEstimate: modelMemoryEstimate, runtimeAssets: trustedRuntimeAssets(runtimeBaseUrl),
      collectGpuEvidence, generationTimeoutMs: 300_000 });
    ggufService = await createGgufService(ggufRuntimeOptions);
    diffusionService = await compute.createModelInferenceService({ artifactStore: store, runtime: 'onnx-diffusion',
      runtimeAssets: trustedDiffusionRuntimeAssets(), runtimeOptions: {}, collectGpuEvidence, admissionOptions,
      resourceEstimate: modelMemoryEstimate,
      loadTimeoutMs: 300_000, generationTimeoutMs: 300_000 });
    activeService = service;
    for (const candidate of [service, ggufService, diffusionService]) trackService(candidate);
    residents = new ResidentModelRegistry({ artifactStore: store, maximumResidents: residentModelSlots,
      async createService({ manifest, runtimeOptions }) {
        const kind = manifest.model?.runtime;
        if (kind === 'llama.cpp') await checkGgufCapabilities();
        const available = (candidate) => candidate && !claimedServices.has(candidate) && !candidate.closed && candidate.getStatus().status === 'idle';
        let candidate = kind === 'llama.cpp' ? ggufService : kind === 'onnx-diffusion' ? diffusionService
          : kind === 'transformers.js' ? service : null;
        if (!available(candidate) || (kind === 'llama.cpp' && runtimeOptions.ggufGpuLayers !== undefined)) {
          const assets = kind === 'llama.cpp' ? trustedGgufRuntimeAssets()
            : kind === 'onnx-diffusion' ? trustedDiffusionRuntimeAssets()
              : kind === 'onnx-mesh' ? trustedMeshRuntimeAssets() : trustedRuntimeAssets(runtimeBaseUrl);
          candidate = await compute.createModelInferenceService({ artifactStore: store, runtime: kind,
            runtimeAssets: assets, resourceEstimate: modelMemoryEstimate, collectGpuEvidence, admissionOptions,
            ...(kind === 'llama.cpp' ? { runtimeOptions: { ...ggufRuntimeOptions,
              ...(runtimeOptions.ggufGpuLayers !== undefined ? { n_gpu_layers: runtimeOptions.ggufGpuLayers } : {}) }, loadTimeoutMs: 30 * 60_000 }
              : { loadTimeoutMs: 300_000 }), generationTimeoutMs: 300_000 });
          trackService(candidate);
          if (kind === 'transformers.js' && !available(service) && service.closed) service = candidate;
          if (kind === 'llama.cpp' && ggufService.closed) ggufService = candidate;
          if (kind === 'onnx-diffusion' && diffusionService.closed) diffusionService = candidate;
        }
        claimedServices.add(candidate); return candidate;
      } });
    if (networkConnection.networkReady) networkConnection.startArtifacts();
  } catch (error) {
    networkTelemetry.dispose();
    await diffusionService?.dispose().catch(() => {});
    await ggufService?.dispose().catch(() => {});
    await service?.dispose().catch(() => {});
    if (ownsCompute) await compute.destroy().catch(() => {});
    if (ownsState) await state.destroy().catch(() => {});
    else if (!existingStore) await store.destroy().catch(() => {});
    throw error;
  }

  async function createGgufService(runtimeOptions) {
    return compute.createModelInferenceService({ artifactStore: store, runtime: 'llama.cpp',
      runtimeAssets: trustedGgufRuntimeAssets(), runtimeOptions, collectGpuEvidence, admissionOptions,
      resourceEstimate: modelMemoryEstimate, loadTimeoutMs: 30 * 60_000, generationTimeoutMs: 300_000 });
  }

  const hubClient = createHuggingFaceClient();
  const runtime = {
    searchModelHub: (options) => hubClient.search(options),
    inspectLoraHub: (reference, options = {}) => inspectLoraHub(reference, { ...options, client: hubClient }),
    inspectModelHub: (repository, options = {}) => inspectHuggingFaceModel(repository, { ...options, client: hubClient, catalog: MODEL_CATALOG }),
    findModelConversions: (repository, options = {}) => findHuggingFaceConversions(repository, { ...options, client: hubClient }),
    stateManager: state, computeManager: compute, store,
    async getAgentController() {
      if (disposingAgents) throw new Error('Model console is closed');
      if (agents) return agents;
      if (!agentsStarting) agentsStarting = (async () => {
        const name = `${storeName}-agents`;
        const records = state.getAgentRecordStore(name) ?? state.createAgentRecordStore({ name });
        await records.open();
        if (disposingAgents) throw new Error('Model console is closed');
        agents = new AgentRuntime({ store: records, inference: createAgentModelAdapter(runtime) });
        return agents;
      })().finally(() => { agentsStarting = null; });
      return agentsStarting;
    },
    get service() { return activeService; },
    get services() {
      const result = { onnx: service, gguf: ggufService, diffusion: diffusionService, ...Object.fromEntries(auxiliaryServices) };
      for (const entry of residents.list()) {
        const candidate = residents.getService(entry.manifestCid);
        if (candidate && !Object.values(result).includes(candidate)) result[entry.manifestCid] = candidate;
      }
      return result;
    },
    managesArtifactUses: true,
    getServiceForModel(cid) { return residents.getService(cid)
      ?? [...auxiliaryServices.values()].find((candidate) => candidate.getStatus().manifestCid === cid) ?? null; },
    getResidentModelStates: () => residents.list(),
    selectResidentModel(cid) {
      const candidate = residents.getService(cid);
      if (candidate?.getStatus().status !== 'ready') throw new Error('The selected model is not ready');
      activeService = candidate;
    },
    async unloadResidentModel(cid) {
      const result = await residents.unload(cid);
      if (cid === undefined || activeService.getStatus().manifestCid === cid || ['idle', 'closed'].includes(activeService.getStatus().status)) {
        activeService = residents.list().map((entry) => residents.getService(entry.manifestCid)).find((candidate) => candidate?.getStatus().status === 'ready') ?? service;
      }
      return result;
    },
    runtimeAssets: trustedRuntimeAssets(runtimeBaseUrl),
    registerAuxiliaryService(id, auxiliary) {
      if (disposingAgents || !/^[a-z][a-z0-9-]{0,63}$/.test(id) || ['onnx', 'gguf', 'diffusion'].includes(id)
          || auxiliaryServices.has(id) || !auxiliary?.getStatus || !auxiliary.unloadModel || !auxiliary.dispose) {
        throw new Error('Invalid or duplicate auxiliary model service');
      }
      auxiliaryServices.set(id, auxiliary);
      return () => {
        const status = auxiliary.getStatus();
        if (!['idle', 'closed'].includes(status.status) || status.manifestCid) throw new Error('Unload the auxiliary model before unregistering it');
        if (auxiliaryServices.get(id) === auxiliary) auxiliaryServices.delete(id);
      };
    },
    async unloadAuxiliaryModel(cid) {
      let unloaded = false;
      for (const auxiliary of auxiliaryServices.values()) if (auxiliary.getStatus().manifestCid === cid) {
        await auxiliary.unloadModel(); unloaded = true;
      }
      return unloaded;
    },
    getDeviceCapabilities: () => deviceCapabilities,
    async checkDeviceCapabilities() {
      deviceCheck ??= Promise.resolve().then(() => probeDeviceCapabilities()).then((value) => {
        deviceCapabilities = value; return value;
      });
      return deviceCheck;
    },
    getMemoryBudgets: memoryPolicy.get,
    setMemoryBudgets: memoryPolicy.set,
    getMemoryBudgetStatus: memoryPolicy.status,
    getModelCompatibility(entry) {
      // Configured aggregate capacity, not free physical VRAM. Admission checks
      // the remaining pool without evicting an existing resident.
      const pools = compute.resourceBroker?.reportPressure().pools;
      const budgets = memoryPolicy.get();
      for (const [key, kind] of [['cpuBytes', 'cpu'], ['gpuBytes', 'gpu']]) {
        const limit = pools?.[kind]?.memoryBytes;
        if (Number.isSafeInteger(limit) && limit > 0) budgets[key] = Math.min(budgets[key] ?? limit, limit);
      }
      return evaluateModelCompatibility(entry, { device: deviceCapabilities, budgets });
    },
    async inspectPeerPackage(input, { signal } = {}) {
      const cid = artifactCID(input);
      if (cid.code !== 0x55) throw new Error('Model packages require a manifest CID');
      try { return await store.getManifest(cid.toString(), { signal }); }
      catch (error) { signal?.throwIfAborted(); if (!networkConnection.networkReady) throw error; }
      // Read only the bounded manifest before accepting any model weights.
      await networkConnection.requireArtifacts({ signal });
      const bytes = await networkConnection.manager.fetchArtifactBlock(cid.toString(), { artifactCid: cid.toString(), signal });
      signal?.throwIfAborted();
      if (!(bytes instanceof Uint8Array) || bytes.byteLength > ARTIFACT_MANIFEST_MAXIMUM_BYTES) {
        throw new Error('Peer model manifest exceeds its metadata budget');
      }
      const digest = sha256(bytes);
      if (!digest.every((value, index) => value === cid.multihash.digest[index])) throw new Error('Peer model manifest CID mismatch');
      return decodeArtifactManifest(bytes);
    },
    checkGgufCapabilities,
    get networkManager() { return networkConnection.manager; },
    get networkReady() { return networkConnection.networkReady; },
    get artifactReady() { return networkConnection.artifactReady; },
    get networkError() { return networkConnection.error; },
    getArtifactNetworkStatus: () => networkConnection.getArtifactNetworkStatus(),
    async connectBackend(options = {}) {
      // Connect resolves on application readiness; file transport may still be
      // starting, in which case the return value is null. Transfers await it.
      return networkConnection.connect(({ signal }) => loadInferenceRelayConfig({ ...options, signal }), options);
    },
    async connect(relayAddress, { signal } = {}) {
      signal?.throwIfAborted();
      return networkConnection.connect(() => {
        if (typeof relayAddress !== 'string' || relayAddress.length > 1024
            || !/^\/(?:dns4|dns6|ip4|ip6)\//.test(relayAddress) || !relayAddress.includes('/p2p/')) {
          throw new Error('Enter a relay multiaddress including its peer ID');
        }
        return { bootstrapPeers: [relayAddress] };
      }, { signal });
    },
    async importCatalog(modelId, options = {}) {
      const entry = MODEL_CATALOG[modelId];
      if (!entry) throw new Error('Unknown approved model');
      const sourceUrl = INFERENCE_CATALOG[modelId] ? modelFileUrl
        : GGUF_MODEL_CATALOG[modelId] ? ggufModelFileUrl
          : DIFFUSION_MODEL_CATALOG[modelId] ? diffusionModelFileUrl
            : MESH_MODEL_CATALOG[modelId] ? meshModelFileUrl
            : SPEECH_MODEL_CATALOG[modelId] ? (id, path) => speechModelFileUrl(SPEECH_MODEL_CATALOG[id], SPEECH_MODEL_CATALOG[id].files.find((file) => file.path === path)) : modelArtifactFileUrl;
      const manifest = { schema: 'peercompute.artifact.manifest.v1', name: entry.name,
        files: entry.files, model: entry.model, provenance: { ...entry.provenance, license: entry.license } };
      const trusted = trustedCatalogSource(manifest);
      return importModelPackage(store, manifest, trusted?.sourceUrl ?? ((path) => sourceUrl(modelId, path)),
        { ...options, ...(trusted ? { openSource: trusted.openSource } : {}) });
    },
    importLora(baseCid, options = {}) {
      return createStoredLoraComposition(store, baseCid, { ...options, client: hubClient });
    },
    async importHub(entry, { reuseManifest, ...options } = {}) {
      const manifest = reuseVerifiedHubFiles(validateHubPackage(entry), reuseManifest);
      const availability = runtime.getModelCompatibility(entry);
      if (['checking', 'unavailable'].includes(availability.status)) throw new Error(availability.reason);
      const trusted = trustedCatalogSource(manifest);
      return importModelPackage(store, manifest,
        trusted?.sourceUrl ?? ((path) => huggingFaceFileUrl(entry.repository, entry.revision, path)),
        { ...options, ...(trusted ? { openSource: trusted.openSource } : {}) });
    },
    async importPackage(manifest, sourceBaseUrl, { expectedCid, ...options } = {}) {
      manifest = normalizeArtifactManifest(manifest);
      const base = new URL(sourceBaseUrl, location.href);
      if (base.origin !== location.origin) throw new Error('Fixture package source must be same-origin');
      const result = await importModelPackage(store, manifest,
        (path) => new URL(path.split('/').map(encodeURIComponent).join('/'), base).href, options);
      if (expectedCid && result.cid !== expectedCid) throw new Error('Package manifest CID changed during import');
      return result;
    },
    async load(cid, { ggufGpuLayers, ...options } = {}) {
      const manifest = await store.getManifest(cid, { signal: options.signal });
      const isGguf = manifest.model?.runtime === 'llama.cpp';
      const isDiffusion = manifest.model?.runtime === 'onnx-diffusion';
      if (!isGguf && !isDiffusion && !['transformers.js', 'transformers-speech', 'onnx-mesh'].includes(manifest.model?.runtime)) {
        throw new Error('This package can be stored and hosted, but its model runtime is unavailable in this browser demo');
      }
      if (isGguf) {
        if (ggufGpuLayers !== undefined) {
          if (!Number.isSafeInteger(ggufGpuLayers) || ggufGpuLayers < 1 || ggufGpuLayers > 99999) {
            throw new Error('GGUF GPU layers must be between 1 and 99999 (all layers)');
          }
        }
      }
      const result = await residents.load(cid, { signal: options.signal, onProgress: options.onProgress,
        runtimeOptions: ggufGpuLayers === undefined ? {} : { ggufGpuLayers } });
      if (manifest.model.runtime !== 'transformers-speech' || activeService.getStatus().status !== 'ready') activeService = residents.getService(cid);
      return result;
    },
    async ensure(cid, options = {}) {
      await networkConnection.requireArtifacts(options);
      return store.ensureLocal(cid, { ...options, fetchBlock: (blockCid, readOptions) =>
        networkConnection.manager.fetchArtifactBlock(blockCid, { ...readOptions, artifactCid: cid }) });
    },
    async withArtifactRetention(callback, { signal } = {}) {
      if (typeof callback !== 'function') throw new TypeError('Artifact retention requires a callback');
      // Establish transport before holding the GC read lock. Do not enter the
      // model mutation queue here: a queued deletion may need its write lock.
      await networkConnection.requireArtifacts({ signal });
      signal?.throwIfAborted();
      return store.withRetention((scoped) => callback(Object.freeze({ ...scoped,
        ensure: (cid, options = {}) => scoped.ensureLocal(cid, { ...options, pin: false,
          signal: options.signal && signal ? AbortSignal.any([options.signal, signal]) : options.signal ?? signal,
          fetchBlock: (blockCid, readOptions) => networkConnection.manager.fetchArtifactBlock(blockCid,
            { ...readOptions, artifactCid: cid }),
        }),
      })), { signal });
    },
    async publish(cid) {
      await networkConnection.requireArtifacts();
      return networkConnection.manager.announceArtifact(cid);
    },
    async withdraw(cid) {
      await networkConnection.requireArtifacts();
      return networkConnection.manager.withdrawArtifact(cid);
    },
    async dispose() {
      disposingAgents = true;
      await agentsStarting?.catch(() => {});
      await agents?.dispose();
      for (const auxiliary of auxiliaryServices.values()) await auxiliary.dispose();
      auxiliaryServices.clear();
      await residents.dispose();
      const disposed = await Promise.allSettled([...createdServices].map((candidate) => candidate.dispose()));
      const failures = disposed.filter((result) => result.status === 'rejected').map((result) => result.reason);
      if (failures.length) throw new AggregateError(failures, 'Some managed model services could not finish cleanup');
      await networkConnection.dispose();
      networkTelemetry.dispose();
      if (ownsCompute) await compute.destroy();
      if (ownsState) await state.destroy();
    },
  };
  const controller = attachModelRuntimeController(runtime, { catalog: MODEL_CATALOG,
    preferences: createModelPreferences({ storeName: store.lockName ?? store.name ?? storeName, storage: preferenceStorage }) });
  try { await controller.initialize(); }
  catch (error) { await runtime.dispose(); throw error; }
  return runtime;
}
