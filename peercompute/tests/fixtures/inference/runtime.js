import { createInferenceRuntime } from '../../../../demos/inference/src/runtime.js';

let runtime;
const events = [];
window.inferenceAcceptance = {
  async start() {
    runtime = await createInferenceRuntime({ storeName: 'model-acceptance', collectGpuEvidence: true });
    return { persistent: runtime.store.persistent, runtimeAssets: runtime.service.runtimeAssets };
  },
  async importPackage(manifest, sourceBaseUrl, expectedCid) {
    return runtime.importPackage(manifest, sourceBaseUrl, { expectedCid,
      onProgress: (event) => { document.querySelector('#status').textContent = JSON.stringify(event); } });
  },
  async load(cid) { return runtime.load(cid, { onProgress: (event) => {
    if (!event.status?.startsWith('progress')) events.push(event);
    if (events.length > 2000) events.shift();
    if (event.type === 'model-load' && !event.status.startsWith('progress')) console.log('MODEL LOAD', event.status, event.file);
    if (event.type === 'artifact-read-error') console.error('ARTIFACT ADAPTER', event.message);
  } }); },
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
    return runtime.service.generate({ requestId, prompt: image ? 'What is the dominant color in this image? Answer in a few words.'
      : 'Reply with a short greeting.', image: rgba, maxNewTokens,
    onProgress: (event) => { if (events.length < 2000) events.push(event); } });
  },
  cancel(requestId) { return runtime.service.cancel(requestId); },
  async cancelGeneration() {
    const requestId = 'hardware-cancel';
    let cancellation;
    let error;
    try {
      await runtime.service.generate({ requestId,
        prompt: 'List every integer from 1 to 100 in order, separated by spaces. Continue until 100.',
        maxNewTokens: 256, onToken() { cancellation ??= runtime.service.cancel(requestId); } });
    } catch (cause) { error = { name: cause.name, message: cause.message, workerTerminated: cause.workerTerminated === true }; }
    await cancellation;
    return { requested: !!cancellation, error, status: runtime.service.getStatus() };
  },
  unload() { return runtime.service.unloadModel(); },
  status() { return runtime.service.status(); },
  stat(cid) { return runtime.store.stat(cid); },
  evidence() { return { service: runtime.service.getStatus(), compute: runtime.computeManager.getStats(),
    pressure: runtime.computeManager.resourceBroker.reportPressure(), events }; },
  async stop() { await runtime?.dispose(); runtime = null; },
};
window.inferenceAcceptanceReady = true;
