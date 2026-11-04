import { StateManager } from '../../../peercompute/src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../../peercompute/src/peercompute/computeManager/ComputeManager.js';
import { MODEL_CATALOG as INFERENCE_CATALOG, modelFileUrl } from '../../../peercompute/src/peercompute/inference/modelCatalog.js';
import { MODEL_ARTIFACT_CATALOG, modelArtifactFileUrl } from '../../../peercompute/src/peercompute/artifacts/modelArtifactCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/ggufModelCatalog.js';
import { DIFFUSION_MODEL_CATALOG, diffusionModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/diffusionModelCatalog.js';
import { artifactCID, decodeArtifactManifest, normalizeArtifactManifest, ARTIFACT_MANIFEST_MAXIMUM_BYTES } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { collectModelDeviceCapabilities, evaluateModelCompatibility, modelMemoryEstimate,
  normalizeModelMemoryBudgets } from './modelDeviceCompatibility.js';
import { importModelPackage } from './modelLibrary.js';
import { loadInferenceRelayConfig } from './relayConfig.js';
import { attachModelRuntimeController } from './modelRuntimeController.js';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import factoryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';
import ggufWasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';
import diffusionWasmUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.jsep.wasm?url';
import diffusionFactoryUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.jsep.mjs?url';

export const MODEL_CATALOG = Object.freeze({ ...INFERENCE_CATALOG, ...MODEL_ARTIFACT_CATALOG, ...GGUF_MODEL_CATALOG, ...DIFFUSION_MODEL_CATALOG });

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

export async function checkGgufCapabilities() {
  const { validateGgufCapabilities } = await import('../../../peercompute/src/peercompute/inference/gguf/runtimeDefinition.js');
  return validateGgufCapabilities();
}

/** Reusable app facade; storage and execution remain owned by PeerCompute managers. */
export async function createInferenceRuntime({ stateManager, computeManager, networkManager,
  storeName = 'inference-models', runtimeBaseUrl, collectGpuEvidence = false,
  memoryBudgets, probeDeviceCapabilities = collectModelDeviceCapabilities,
  ggufRuntimeOptions = { n_ctx: 2048, n_batch: 64, n_gpu_layers: 99999, n_threads: 1 } } = {}) {
  let localMemoryBudgets = normalizeModelMemoryBudgets(memoryBudgets);
  let deviceCapabilities = null, deviceCheck;
  const ownsState = !stateManager;
  const ownsCompute = !computeManager;
  const state = stateManager ?? new StateManager(networkManager ?? null, {
    enablePersistence: false, disableNetworkProvider: true, disableBroadcast: true,
  });
  const compute = computeManager ?? new ComputeManager({ requireWorkers: true, enableWorkers: true,
    enableWebGPU: true, minWorkers: 1, targetWorkers: 1, maxWorkers: 1, autoScaleWorkers: false,
    workerBootstrapTimeoutMs: 60_000 });
  const existingTransport = networkManager?.getArtifactTransport?.();
  const existingStore = existingTransport?.store ?? state.getArtifactStore(storeName);
  const store = existingStore
    ?? state.createArtifactStore({ name: storeName, capacity: 'browser', maximumTraversalBlocks: 131072 });
  let service;
  let ggufService;
  let diffusionService;
  let activeService;
  let network = networkManager;
  let ownsNetwork = false;
  let networkError = null;
  try {
    await store.open();
  // Configured admission envelopes, not claims about hardware capacity or observed model peaks.
  const cpuBytes = 12 * 1024 ** 3;
  const gpuBytes = 16 * 1024 ** 3;
    service = await compute.createModelInferenceService({ artifactStore: store,
    resourceBudgets: { cpu: { units: 1, memoryBytes: cpuBytes }, gpu: { units: 1, memoryBytes: gpuBytes } },
    resourceEstimate: modelMemoryEstimate, runtimeAssets: trustedRuntimeAssets(runtimeBaseUrl),
      collectGpuEvidence, generationTimeoutMs: 300_000 });
    ggufService = await createGgufService(ggufRuntimeOptions);
    diffusionService = await compute.createModelInferenceService({ artifactStore: store, runtime: 'onnx-diffusion',
      runtimeAssets: trustedDiffusionRuntimeAssets(), runtimeOptions: {}, collectGpuEvidence,
      resourceEstimate: modelMemoryEstimate,
      loadTimeoutMs: 300_000, generationTimeoutMs: 300_000 });
    activeService = service;
    if (network) {
      try { await network.createArtifactTransport(store); }
      catch (error) { networkError = error; }
    }
  } catch (error) {
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
      runtimeAssets: trustedGgufRuntimeAssets(), runtimeOptions, collectGpuEvidence,
      resourceEstimate: modelMemoryEstimate, loadTimeoutMs: 30 * 60_000, generationTimeoutMs: 300_000 });
  }

  async function connectNetwork(config, { signal } = {}) {
    signal?.throwIfAborted();
    if (network) {
      const transport = await network.createArtifactTransport(store);
      networkError = null; return transport;
    }
    const { NetworkManager } = await import('../../../peercompute/src/peercompute/networkManager/NetworkManager.js');
    const candidate = new NetworkManager(config);
    const aborted = () => { void candidate.disconnect().catch(() => {}); };
    signal?.addEventListener('abort', aborted, { once: true });
    try {
      await candidate.initialize(); signal?.throwIfAborted();
      await candidate.connect(); signal?.throwIfAborted();
      await candidate.createArtifactTransport(store); signal?.throwIfAborted();
      network = candidate; ownsNetwork = true; networkError = null;
      return candidate.getArtifactTransport();
    } catch (error) { networkError = error; await candidate.disconnect().catch(() => {}); throw error; }
    finally { signal?.removeEventListener('abort', aborted); }
  }

  const runtime = {
    stateManager: state, computeManager: compute, store,
    get service() { return activeService; },
    get services() { return { onnx: service, gguf: ggufService, diffusion: diffusionService }; },
    getDeviceCapabilities: () => deviceCapabilities,
    async checkDeviceCapabilities() {
      deviceCheck ??= Promise.resolve().then(() => probeDeviceCapabilities()).then((value) => {
        deviceCapabilities = value; return value;
      });
      return deviceCheck;
    },
    getMemoryBudgets: () => ({ ...localMemoryBudgets }),
    setMemoryBudgets(value) {
      localMemoryBudgets = normalizeModelMemoryBudgets(value);
      return { ...localMemoryBudgets };
    },
    getModelCompatibility(entry) {
      // Pool totals are configured admission limits. Existing model reservations
      // are released during replacement and are not hardware capacity readings.
      const pools = compute.resourceBroker?.reportPressure().pools;
      const budgets = { ...localMemoryBudgets };
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
      catch (error) { signal?.throwIfAborted(); if (!network) throw error; }
      // Read only the bounded manifest before accepting any model weights.
      const bytes = await network.fetchArtifactBlock(cid.toString(), { artifactCid: cid.toString(), signal });
      signal?.throwIfAborted();
      if (!(bytes instanceof Uint8Array) || bytes.byteLength > ARTIFACT_MANIFEST_MAXIMUM_BYTES) {
        throw new Error('Peer model manifest exceeds its metadata budget');
      }
      const digest = sha256(bytes);
      if (!digest.every((value, index) => value === cid.multihash.digest[index])) throw new Error('Peer model manifest CID mismatch');
      return decodeArtifactManifest(bytes);
    },
    checkGgufCapabilities,
    get networkManager() { return network; },
    get networkReady() { return !!network?.getArtifactTransport?.(); },
    get networkError() { return networkError; },
    async connectBackend(options = {}) {
      return connectNetwork(await loadInferenceRelayConfig(options), options);
    },
    async connect(relayAddress, { signal } = {}) {
      signal?.throwIfAborted();
      if (network) {
        const transport = await network.createArtifactTransport(store);
        networkError = null; return transport;
      }
      if (typeof relayAddress !== 'string' || relayAddress.length > 1024
          || !/^\/(?:dns4|dns6|ip4|ip6)\//.test(relayAddress) || !relayAddress.includes('/p2p/')) {
        throw new Error('Enter a relay multiaddress including its peer ID');
      }
      return connectNetwork({ bootstrapPeers: [relayAddress] }, { signal });
    },
    async importCatalog(modelId, options = {}) {
      const entry = MODEL_CATALOG[modelId];
      if (!entry) throw new Error('Unknown approved model');
      const sourceUrl = INFERENCE_CATALOG[modelId] ? modelFileUrl
        : GGUF_MODEL_CATALOG[modelId] ? ggufModelFileUrl
          : DIFFUSION_MODEL_CATALOG[modelId] ? diffusionModelFileUrl : modelArtifactFileUrl;
      return importModelPackage(store, { schema: 'peercompute.artifact.manifest.v1', name: entry.name,
        files: entry.files, model: entry.model, provenance: { ...entry.provenance, license: entry.license } },
      (path) => sourceUrl(modelId, path), options);
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
      if (!isGguf && !isDiffusion && manifest.model?.runtime !== 'transformers.js') {
        throw new Error('This package can be stored and hosted, but its model runtime is unavailable in this browser demo');
      }
      if ([service, ggufService, diffusionService].some((candidate) => candidate.getStatus().status !== 'idle')) {
        throw new Error('Unload the resident model before loading another package');
      }
      if (isGguf) {
        await checkGgufCapabilities();
        if (ggufGpuLayers !== undefined) {
          if (!Number.isSafeInteger(ggufGpuLayers) || ggufGpuLayers < 1 || ggufGpuLayers > 99999) {
            throw new Error('GGUF GPU layers must be between 1 and 99999 (all layers)');
          }
          const replacement = await createGgufService({ ...ggufRuntimeOptions, n_gpu_layers: ggufGpuLayers });
          try { await ggufService.dispose(); }
          catch (error) { await replacement.dispose(); throw error; }
          ggufService = replacement;
        }
      }
      activeService = isGguf ? ggufService : isDiffusion ? diffusionService : service;
      return activeService.loadModel({ manifestCid: cid, ...options });
    },
    async ensure(cid, options = {}) {
      if (!network) throw new Error('Connect the artifact network first');
      return store.ensureLocal(cid, { ...options, fetchBlock: (blockCid, readOptions) =>
        network.fetchArtifactBlock(blockCid, { ...readOptions, artifactCid: cid }) });
    },
    async publish(cid) {
      if (!network) throw new Error('Connect the artifact network first');
      return network.announceArtifact(cid);
    },
    async withdraw(cid) {
      if (!network) throw new Error('Connect the artifact network first');
      return network.withdrawArtifact(cid);
    },
    async dispose() {
      await diffusionService.dispose();
      await ggufService.dispose();
      await service.dispose();
      if (ownsNetwork) await network.disconnect();
      if (ownsCompute) await compute.destroy();
      if (ownsState) await state.destroy();
    },
  };
  const controller = attachModelRuntimeController(runtime, { catalog: MODEL_CATALOG });
  try { await controller.initialize(); }
  catch (error) { await runtime.dispose(); throw error; }
  return runtime;
}
