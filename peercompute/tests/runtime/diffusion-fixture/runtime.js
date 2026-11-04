import { StateManager } from '../../../src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../../src/peercompute/computeManager/ComputeManager.js';
import { NetworkManager } from '../../../src/peercompute/networkManager/NetworkManager.js';
import { DIFFUSION_MODEL_CATALOG } from '../../../src/peercompute/artifacts/diffusionModelCatalog.js';
import { importModelPackage } from '../../../../demos/inference/src/modelLibrary.js';
import wasmUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.jsep.wasm?url';
import factoryUrl from 'peercompute-diffusion-ort/ort-wasm-simd-threaded.jsep.mjs?url';
let state, store, compute, service, network, peerService, hostedDescriptor;
let hosting = false, idleSince = Date.now();
const owner = {}, events = [], hostResults = [], pubsub = { messages: 0, privateMarkerSeen: false, contentFieldsSeen: false };
function progress(event) { events.push(event); if (events.length > 500) events.shift(); document.querySelector('#status').textContent = JSON.stringify(event); console.log('DIFFUSION', JSON.stringify(event)); }
async function imageRecord(result, draw = true) {
  const { data, ...image } = result.image;
  const imageSha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  let minimum = 255, maximum = 0, sum = 0; for (let i = 0; i < data.length; i++) if (i % 4 !== 3) { minimum = Math.min(minimum, data[i]); maximum = Math.max(maximum, data[i]); sum += data[i]; }
  if (draw) document.querySelector('canvas').getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(data), image.width, image.height), 0, 0);
  return { ...result, image: { ...image, bytes: data.byteLength, minimum, maximum, mean: sum / (512 * 512 * 3) }, imageSha256 };
}
window.diffusionAcceptance = {
  async start() {
    state = new StateManager(null, { enablePersistence: false, disableNetworkProvider: true, disableBroadcast: true });
    store = state.createArtifactStore({ name: 'diffusion-acceptance', capacity: 'browser', maximumTraversalBlocks: 131072 }); await store.open();
    compute = new ComputeManager({ requireWorkers: true, enableWorkers: true, enableWebGPU: true, minWorkers: 1, targetWorkers: 1, maxWorkers: 1, autoScaleWorkers: false, workerBootstrapTimeoutMs: 60000 });
    service = await compute.createModelInferenceService({ artifactStore: store, runtime: 'onnx-diffusion', collectGpuEvidence: true,
      resourceBudgets: { cpu: { units: 1, memoryBytes: 8 * 1024 ** 3 }, gpu: { units: 1, memoryBytes: 8 * 1024 ** 3 } },
      resourceEstimate: { cpuBytes: 8 * 1024 ** 3, gpuBytes: 8 * 1024 ** 3 }, loadTimeoutMs: 300000, generationTimeoutMs: 300000,
      runtimeAssets: { mjs: new URL(factoryUrl, location.href).href, wasm: new URL(wasmUrl, location.href).href } });
    return { persistent: store.persistent, runtimeAssets: service.runtimeAssets };
  },
  async importCatalog(id) {
    const entry = DIFFUSION_MODEL_CATALOG[id];
    const imported = await importModelPackage(store, { schema: 'peercompute.artifact.manifest.v1', name: entry.name,
      files: entry.files, model: entry.model, provenance: { ...entry.provenance, license: entry.license } },
      (path) => `/seed/${id}/${path.split('/').map(encodeURIComponent).join('/')}`, { onProgress: progress });
    return { cid: imported.cid, manifest: await store.getManifest(imported.cid), descriptor: { manifestCid: imported.cid, modelId: id, name: entry.name, runtime: entry.model.runtime,
      modalities: ['text'], outputModalities: ['image'], task: 'text-to-image', repository: entry.repository, revision: entry.revision, totalBytes: entry.totalBytes } };
  },
  load(cid) { return service.loadModel({ manifestCid: cid, onProgress: progress }); },
  async generate(options = {}) { return imageRecord(await service.generate({ prompt: 'A red apple on a white wooden table, studio photograph', seed: 42, ...options, onProgress: progress })); },
  async cancelGeneration() {
    const requestId = 'diffusion-cancel'; let cancellation, error;
    try { await service.generate({ requestId, prompt: 'A small blue boat on a mountain lake', seed: 71, onProgress(event) {
      progress(event); if (event.type === 'diffusion-progress' && event.stage === 'denoise') cancellation ??= service.cancel(requestId);
    } }); } catch (cause) { error = { name: cause.name, message: cause.message, workerTerminated: cause.workerTerminated === true }; }
    await cancellation; return { requested: !!cancellation, error, status: service.getStatus() };
  },
  unload() { return service.unloadModel(); },
  status() { return service.status(); }, stat(cid) { return store.stat(cid); },
  evidence() { return { service: service?.getStatus(), compute: compute?.getStats(), pressure: compute?.resourceBroker.reportPressure(), events }; },
  async startPeerHost({ relayAddress, scope, descriptor, marker }) {
    hostedDescriptor = descriptor; hosting = true;
    network = new NetworkManager({ gameId: scope, roomId: scope, topologyId: scope, bootstrapPeers: [relayAddress], allowLocalDial: true,
      pubsubPeerDiscovery: false, enableTopologyController: false, enableTelemetry: false, enablePeerDirectory: false, enableRelayDirectPeers: false, debugOutput: false,
      webrtc: { rtcConfiguration: { iceServers: [] }, dropRelayOnDirect: false, dropRelayBootstrapOnDirect: false } });
    await network.initialize(); await network.connect();
    const gossip = network.libp2p.services.pubsub, publish = gossip.publish.bind(gossip);
    gossip.publish = (topic, bytes, ...rest) => { pubsub.messages++; const text = new TextDecoder().decode(bytes); pubsub.privateMarkerSeen ||= text.includes(marker); pubsub.contentFieldsSeen ||= /"(?:prompt|messages|image|token)"\s*:/.test(text); return publish(topic, bytes, ...rest); };
    peerService = await network.createPeerInferenceService({ owner, requestTimeoutMs: 300000,
      getLocalState() { const status = service.getStatus(); return { sharedModels: [], hostedModel: hosting && status.status === 'ready' ? hostedDescriptor : null,
        busy: !!status.activeRequestId, queuedRequests: status.queuedRequests, idleForMs: Math.max(0, Date.now() - idleSince) }; },
      async generate(options) { if (!hosting || options.manifestCid !== hostedDescriptor.manifestCid) throw new Error('Model not hosted');
        try { const result = await service.generate({ ...options, onProgress: options.onProgress }); hostResults.push(await imageRecord(result, false)); return result; } finally { idleSince = Date.now(); } },
    });
    return { peerId: network.libp2p.peerId.toString(), addresses: network.libp2p.getMultiaddrs().map(String) };
  },
  peerEvidence() { return { hostResults, pubsub, modelStatus: service.getStatus(), peerId: network?.libp2p?.peerId.toString(), addresses: network?.libp2p?.getMultiaddrs().map(String) ?? [] }; },
  async setPeerHosting(value) { hosting = value; await peerService?.setHostingEnabled(value); },
  async stopPeerHost() { hosting = false; if (network) { await network.releasePeerInferenceService(owner); await network.disconnect(); } network = peerService = null; },
  async stop() { await this.stopPeerHost(); await service?.dispose(); await compute?.destroy(); await state?.destroy(); },
};
window.diffusionAcceptanceReady = true;
