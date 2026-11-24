import '../../../src/peercompute/inference/registerInference.js';
import { StateManager } from '../../../src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../../src/peercompute/computeManager/ComputeManager.js';
import { importModelPackage } from '../../../src/peercompute/inference/library/modelLibrary.js';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import factoryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';

let state, store, compute, service;
const events = [];
window.inferenceAcceptance = {
  async start() {
    state = new StateManager(null, {
      enablePersistence: false, disableNetworkProvider: true, disableBroadcast: true
    });
    store = state.createArtifactStore({
      name: 'model-acceptance', capacity: 'browser', maximumTraversalBlocks: 131072
    });
    await store.open();
    compute = new ComputeManager({
      requireWorkers: true, enableWorkers: true, enableWebGPU: true,
      minWorkers: 1, targetWorkers: 1, maxWorkers: 1, autoScaleWorkers: false,
      workerBootstrapTimeoutMs: 60_000
    });
    service = await compute.createModelInferenceService({
      artifactStore: store,
      collectGpuEvidence: true,
      runtimeAssets: {
        mjs: new URL(factoryUrl, location.href).href,
        wasm: new URL(wasmUrl, location.href).href
      }
    });
    return { persistent: store.persistent, runtimeAssets: service.runtimeAssets };
  },
  async importPackage(manifest, sourceBaseUrl, expectedCid) {
    return importModelPackage(store, manifest, sourceBaseUrl, {
      expectedCid,
      onProgress: (event) => { document.querySelector('#status').textContent = JSON.stringify(event); }
    });
  },
  async load(cid) {
    return service.loadModel({
      manifestCid: cid,
      onProgress: (event) => {
        if (!event.status?.startsWith('progress')) events.push(event);
        if (events.length > 2000) events.shift();
        if (event.type === 'model-load' && !event.status.startsWith('progress')) console.log('MODEL LOAD', event.status, event.file);
        if (event.type === 'artifact-read-error') console.error('ARTIFACT ADAPTER', event.message);
      }
    });
  },
  async generate({ image = false, color = 'red', requestId = crypto.randomUUID(), maxNewTokens = 16 } = {}) {
    let rgba;
    if (image) {
      const width = 128, height = 128;
      const data = new Uint8Array(width * height * 4);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = color === 'red' ? 255 : 0; data[i + 1] = 0; data[i + 2] = color === 'blue' ? 255 : 0; data[i + 3] = 255;
      }
      rgba = { data, width, height, channels: 4 };
    }
    return service.generate({
      requestId,
      prompt: image ? 'What is the dominant color in this image? Answer in a few words.'
        : 'Reply with a short greeting.',
      image: rgba,
      maxNewTokens,
      onProgress: (event) => { if (events.length < 2000) events.push(event); }
    });
  },
  cancel(requestId) { return service.cancel(requestId); },
  async cancelGeneration() {
    const requestId = 'hardware-cancel';
    let cancellation;
    let error;
    try {
      await service.generate({
        requestId,
        prompt: 'List every integer from 1 to 100 in order, separated by spaces. Continue until 100.',
        maxNewTokens: 256,
        onToken() { cancellation ??= service.cancel(requestId); }
      });
    } catch (cause) { error = { name: cause.name, message: cause.message, workerTerminated: cause.workerTerminated === true }; }
    await cancellation;
    return { requested: !!cancellation, error, status: service.getStatus() };
  },
  unload() { return service.unloadModel(); },
  status() { return service.status(); },
  stat(cid) { return store.stat(cid); },
  evidence() {
    return {
      service: service.getStatus(),
      compute: compute.getStats(),
      pressure: compute.resourceBroker.reportPressure(),
      events
    };
  },
  async stop() {
    await service?.dispose();
    await compute?.destroy();
    await state?.destroy();
    service = compute = store = state = null;
  }
};
window.inferenceAcceptanceReady = true;
