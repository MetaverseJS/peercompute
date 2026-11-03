import { ComputeManager } from '../../../src/peercompute/computeManager/ComputeManager.js';
import { StateManager } from '../../../src/peercompute/stateManager/StateManager.js';
import { validateGgufCapabilities } from '../../../src/peercompute/inference/gguf/runtimeDefinition.js';
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';

let compute, service, state;
const events = [];
const MAX_RANGE = 1024 * 1024;

// Test-only transport of the Node-owned verified ArtifactStore. This deliberately
// does not claim browser persistence, IPFS transfer, or zero local HTTP traffic.
function externalArtifactStore({ manifest, manifestCid, endpoint }) {
  const files = new Map(manifest.files.map((file) => [file.cid, file]));
  return {
    async stat(cid) {
      if (cid === manifestCid) return { cid, kind: 'manifest', status: 'complete' };
      const file = files.get(String(cid));
      return file ? { ...file, kind: 'file', status: 'complete' } : null;
    },
    async getManifest(cid) {
      if (cid !== manifestCid) throw new Error('Unapproved fixture manifest');
      return manifest;
    },
    async *openRead(cid, { offset = 0, length, signal } = {}) {
      const file = files.get(String(cid));
      if (!file) throw new Error('Unapproved fixture artifact');
      length ??= file.size - offset;
      if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0
          || length < 0 || offset > file.size || length > file.size - offset) throw new Error('Invalid fixture range');
      const end = offset + length;
      while (offset < end) {
        signal?.throwIfAborted();
        const count = Math.min(MAX_RANGE, end - offset);
        const url = new URL(`${endpoint}${encodeURIComponent(cid)}`, location.origin);
        url.searchParams.set('offset', String(offset)); url.searchParams.set('length', String(count));
        const response = await fetch(url, { signal, cache: 'no-store' });
        if (!response.ok || !response.body) throw new Error(`Verified artifact bridge failed: ${response.status}`);
        let delivered = 0;
        for await (const bytes of response.body) {
          delivered += bytes.byteLength;
          if (delivered > count) throw new Error('Artifact bridge exceeded range');
          // Native fetch chunks are not assumed to respect the model port bound.
          for (let i = 0; i < bytes.byteLength; i += 256 * 1024) yield bytes.subarray(i, i + 256 * 1024);
        }
        if (delivered !== count) throw new Error('Artifact bridge truncated range');
        offset += count;
      }
    },
  };
}

window.ggufAcceptance = {
  async start(configuration) {
    const capabilities = await validateGgufCapabilities();
    let store = externalArtifactStore(configuration);
    if (configuration.mode === 'browser') {
      const source = store;
      state = new StateManager(null, { enablePersistence: false, disableNetworkProvider: true, disableBroadcast: true });
      store = state.createArtifactStore({ name: 'gguf-acceptance', maximumBytes: 4 * 1024 ** 3 });
      await store.open();
      for (const file of configuration.manifest.files) {
        console.log('GGUF SEED', file.path);
        let stat = await store.stat(file.cid);
        if (stat?.status !== 'complete' || stat.sha256 !== file.sha256 || stat.size !== file.size) {
          const imported = await store.importFile(source.openRead(file.cid), { expectedSize: file.size,
            expectedSha256: file.sha256, pin: false });
          if (imported.cid !== file.cid) throw new Error('Seeded GGUF artifact CID changed');
        }
      }
      const imported = await store.importManifest(configuration.manifest, { pin: true });
      if (imported.cid !== configuration.manifestCid) throw new Error('Seeded GGUF manifest CID changed');
      console.log('GGUF SEED COMPLETE', imported.cid);
    }
    compute = new ComputeManager({ requireWorkers: true, enableWorkers: true, enableWebGPU: true,
      minWorkers: 1, targetWorkers: 1, maxWorkers: 1, autoScaleWorkers: false, workerBootstrapTimeoutMs: 60_000 });
    const large = configuration.manifest.files.reduce((sum, file) => sum + file.size, 0) > 4 * 1024 ** 3;
    service = await compute.createModelInferenceService({ runtime: 'llama.cpp',
      artifactStore: store,
      runtimeAssets: { wasm: new URL(wasmUrl, location.href).href },
      runtimeOptions: configuration.runtimeOptions,
      resourceBudgets: { cpu: { units: 1, memoryBytes: 12 * 1024 ** 3 }, gpu: { units: 1, memoryBytes: 16 * 1024 ** 3 } },
      resourceEstimate: { cpuBytes: (large ? 8 : 2) * 1024 ** 3, gpuBytes: (large ? 16 : 2) * 1024 ** 3 },
      collectGpuEvidence: true, loadTimeoutMs: 30 * 60_000, generationTimeoutMs: 5 * 60_000,
      allowedManifestCids: [configuration.manifestCid],
    });
    return { capabilities, crossOriginIsolated, artifactSource: configuration.mode === 'browser'
      ? 'browser-indexeddb-seeded-from-node-verified-store' : 'node-verified-store-range-bridge' };
  },
  load(cid) {
    return service.loadModel({ manifestCid: cid, onProgress(event) {
      if (events.length >= 1000) events.shift();
      events.push(event);
      document.querySelector('#status').textContent = JSON.stringify(event);
      if (event.type === 'gpu-offload' || event.type === 'native-buffer'
          || (event.status && !event.status.startsWith('progress'))) console.log('GGUF LOAD', JSON.stringify(event));
    } });
  },
  generate({ maxNewTokens = 32, prompt = 'Reply with a short greeting. /no_think' } = {}) {
    return service.generate({ prompt, maxNewTokens });
  },
  async cancelGeneration() {
    const requestId = 'gguf-hardware-cancel';
    let cancellation, error;
    try {
      await service.generate({ requestId, prompt: 'Count from one to one hundred. /no_think', maxNewTokens: 256,
        onToken() { cancellation ??= service.cancel(requestId); } });
    } catch (cause) { error = { name: cause.name, message: cause.message, workerTerminated: cause.workerTerminated === true }; }
    await cancellation;
    return { requested: !!cancellation, error, status: service.getStatus() };
  },
  unload() { return service.unloadModel(); },
  status() { return service.status(); },
  evidence() { return { service: service?.getStatus(), compute: compute?.getStats(),
    pressure: compute?.resourceBroker?.reportPressure(), events }; },
  async stop() { await service?.dispose(); await compute?.destroy(); await state?.destroy(); service = compute = state = null; },
};
window.ggufAcceptanceReady = true;
