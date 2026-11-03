import { StateManager } from '../../../peercompute/src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../../peercompute/src/peercompute/computeManager/ComputeManager.js';
import { MODEL_CATALOG as INFERENCE_CATALOG, modelFileUrl } from '../../../peercompute/src/peercompute/inference/modelCatalog.js';
import { MODEL_ARTIFACT_CATALOG, modelArtifactFileUrl } from '../../../peercompute/src/peercompute/artifacts/modelArtifactCatalog.js';
import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/ggufModelCatalog.js';
import { normalizeArtifactManifest } from '../../../peercompute/src/peercompute/artifacts/ArtifactManifest.js';
import { modelResourcePolicy } from '../../../peercompute/src/peercompute/inference/modelManifest.js';
import { sha1 } from '@noble/hashes/legacy.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { loadInferenceRelayConfig } from './relayConfig.js';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import factoryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';
import ggufWasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';

export const MODEL_CATALOG = Object.freeze({ ...INFERENCE_CATALOG, ...MODEL_ARTIFACT_CATALOG, ...GGUF_MODEL_CATALOG });
export const STORAGE_QUOTAS = Object.freeze([4, 8, 24].map((gib) => gib * 1024 ** 3));

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

export async function checkGgufCapabilities() {
  const { validateGgufCapabilities } = await import('../../../peercompute/src/peercompute/inference/gguf/runtimeDefinition.js');
  return validateGgufCapabilities();
}

/** Reusable app facade; storage and execution remain owned by PeerCompute managers. */
export async function createInferenceRuntime({ stateManager, computeManager, networkManager,
  storeName = 'inference-models', runtimeBaseUrl, collectGpuEvidence = false,
  ggufRuntimeOptions = { n_ctx: 512, n_batch: 64, n_gpu_layers: 99999, n_threads: 1 } } = {}) {
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
    ?? state.createArtifactStore({ name: storeName, maximumBytes: 4 * 1024 ** 3 });
  let service;
  let ggufService;
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
    resourceEstimate: (manifest) => {
      const policy = modelResourcePolicy(manifest.model);
      return { cpuBytes: Math.max(4 * 1024 ** 3, policy.minimumCpuBytes),
        gpuBytes: Math.max(4 * 1024 ** 3, policy.minimumGpuBytes) };
    }, runtimeAssets: trustedRuntimeAssets(runtimeBaseUrl),
      collectGpuEvidence, generationTimeoutMs: 300_000 });
    ggufService = await createGgufService(ggufRuntimeOptions);
    activeService = service;
    if (network) {
      try { await network.createArtifactTransport(store); }
      catch (error) { networkError = error; }
    }
  } catch (error) {
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
      resourceEstimate: (manifest) => {
        const large = manifest.files.reduce((sum, file) => sum + file.size, 0) > 4 * 1024 ** 3;
        return { cpuBytes: (large ? 8 : 2) * 1024 ** 3, gpuBytes: (large ? 16 : 2) * 1024 ** 3 };
      }, loadTimeoutMs: 30 * 60_000, generationTimeoutMs: 300_000 });
  }

  async function importFiles(files, sourceUrl, { signal, onProgress } = {}) {
    const imported = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      onProgress?.({ stage: 'import', path: file.path, index, total: files.length });
      let result = file.cid ? await store.stat(file.cid) : null;
      if (!result || result.status !== 'complete' || result.size !== file.size || result.sha256 !== file.sha256) {
        const response = await fetch(sourceUrl(file.path), { signal });
        if (!response.ok || !response.body) throw new Error(`Artifact source failed: ${file.path} (${response.status})`);
        const git = file.gitBlobSha1 ? sha1.create().update(new TextEncoder().encode(`blob ${file.size}\0`)) : null;
        async function* verifiedSource() {
          for await (const bytes of response.body) { git?.update(bytes); yield bytes; }
          if (git && bytesToHex(git.digest()) !== file.gitBlobSha1) throw new Error(`Source Git blob SHA-1 mismatch: ${file.path}`);
        }
        result = await store.importFile(verifiedSource(), { expectedSize: file.size,
          ...(file.sha256 ? { expectedSha256: file.sha256 } : {}), signal, pin: false });
      }
      if (file.cid && result.cid !== file.cid) throw new Error(`Imported CID differs: ${file.path}`);
      imported.push({ path: file.path, cid: result.cid, size: result.size, sha256: result.sha256 });
    }
    return imported;
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

  return {
    stateManager: state, computeManager: compute, store,
    get service() { return activeService; },
    get services() { return { onnx: service, gguf: ggufService }; },
    checkGgufCapabilities,
    get networkManager() { return network; },
    get networkReady() { return !!network?.getArtifactTransport?.(); },
    get networkError() { return networkError; },
    setStorageQuota(bytes) {
      if (!STORAGE_QUOTAS.includes(bytes)) throw new Error('Choose a supported local storage limit');
      const stats = store.getStats();
      const blocks = Math.max(65536, Math.ceil(bytes / (256 * 1024)) + 4096);
      if (stats.storedBytes > bytes || stats.blockCount > blocks) throw new Error('Existing files exceed the requested storage limit');
      store.maximumBytes = bytes; store.maximumTraversalBlocks = blocks;
      return store.getStats();
    },
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
      const available = store.maximumBytes - store.getStats().storedBytes;
      if (entry.totalBytes > available) throw new Error(`Package needs ${(entry.totalBytes / 1024 ** 3).toFixed(2)} GiB; increase the local storage limit before importing`);
      const storage = await globalThis.navigator?.storage?.estimate?.();
      if (Number.isFinite(storage?.quota) && Number.isFinite(storage?.usage)
          && entry.totalBytes > storage.quota - storage.usage) throw new Error('Browser storage quota is too small for this package');
      const sourceUrl = INFERENCE_CATALOG[modelId] ? modelFileUrl
        : GGUF_MODEL_CATALOG[modelId] ? ggufModelFileUrl : modelArtifactFileUrl;
      const files = await importFiles(entry.files, (path) => sourceUrl(modelId, path), options);
      return store.importManifest({ schema: 'peercompute.artifact.manifest.v1', name: entry.name,
        files, model: entry.model, provenance: { ...entry.provenance, license: entry.license } }, { pin: true, signal: options.signal });
    },
    async importPackage(manifest, sourceBaseUrl, { expectedCid, ...options } = {}) {
      manifest = normalizeArtifactManifest(manifest);
      const base = new URL(sourceBaseUrl, location.href);
      if (base.origin !== location.origin) throw new Error('Fixture package source must be same-origin');
      await importFiles(manifest.files, (path) => new URL(path.split('/').map(encodeURIComponent).join('/'), base).href, options);
      const result = await store.importManifest(manifest, { pin: true, signal: options.signal });
      if (expectedCid && result.cid !== expectedCid) throw new Error('Package manifest CID changed during import');
      return result;
    },
    async load(cid, { ggufGpuLayers, ...options } = {}) {
      const manifest = await store.getManifest(cid, { signal: options.signal });
      const isGguf = manifest.model?.runtime === 'llama.cpp';
      if (!isGguf && manifest.model?.runtime !== 'transformers.js') {
        throw new Error('This package can be stored and hosted, but its model runtime is unavailable in this browser demo');
      }
      if ([service, ggufService].some((candidate) => candidate.getStatus().status !== 'idle')) {
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
      activeService = isGguf ? ggufService : service;
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
      await ggufService.dispose();
      await service.dispose();
      if (ownsNetwork) await network.disconnect();
      if (ownsCompute) await compute.destroy();
      if (ownsState) await state.destroy();
    },
  };
}
