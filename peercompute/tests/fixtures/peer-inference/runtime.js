import { StateManager } from '../../../src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../../src/peercompute/computeManager/ComputeManager.js';
import { NetworkManager } from '../../../src/peercompute/networkManager/NetworkManager.js';
import { normalizeArtifactManifest } from '../../../src/peercompute/artifacts/ArtifactManifest.js';
import { multiaddr } from '@multiformats/multiaddr';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import factoryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';

let state, store, network, peerService, compute, modelService, descriptor;
let hosting = true, sharing = false, loaded = false, idleSince = Date.now();
const owner = {};
const hostResults = [];
const requests = new Map();
const progress = [];
const pubsub = { messages: 0, bytes: 0, privateMarkerSeen: false, contentFieldsSeen: false };
let privateMarker = '';

function assertNoContentFields(value, depth = 0) {
  if (!value || typeof value !== 'object' || depth > 12) return false;
  return Object.entries(value).some(([key, child]) => ['prompt', 'messages', 'image', 'token'].includes(key)
    || assertNoContentFields(child, depth + 1));
}

function imageFor(color) {
  const width = 128, height = 128;
  const data = new Uint8Array(width * height * 4);
  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = color === 'red' ? 255 : 0;
    data[offset + 2] = color === 'blue' ? 255 : 0;
    data[offset + 3] = 255;
  }
  return { data, width, height, channels: 4 };
}

function errorRecord(error) {
  return { name: error.name, code: error.code ?? null, message: error.message,
    workerTerminated: error.workerTerminated === true };
}

window.peerInferenceAcceptance = {
  async start({ relayAddress, label, marker }) {
    privateMarker = marker;
    network = new NetworkManager({ gameId: 'peer-inference-acceptance', roomId: 'peer-inference-acceptance',
      topologyId: 'peer-inference-acceptance', bootstrapPeers: [relayAddress], allowLocalDial: true,
      pubsubPeerDiscovery: false, enableTopologyController: false, enableTelemetry: false,
      enablePeerDirectory: false, enableRelayDirectPeers: false, debugOutput: false,
      webrtc: { rtcConfiguration: { iceServers: [] }, dropRelayOnDirect: false, dropRelayBootstrapOnDirect: false } });
    state = new StateManager(network, { enablePersistence: false, disableNetworkProvider: true, disableBroadcast: true });
    store = state.createArtifactStore({ name: `peer-inference-${label}`, maximumBytes: 1024 ** 3 });
    await store.open();
    await network.initialize(); await network.connect();
    const gossip = network.libp2p.services.pubsub;
    const publish = gossip.publish.bind(gossip);
    gossip.publish = (topic, bytes, ...rest) => {
      pubsub.messages += 1; pubsub.bytes += bytes.byteLength;
      const text = new TextDecoder().decode(bytes);
      pubsub.privateMarkerSeen ||= text.includes(privateMarker);
      try { pubsub.contentFieldsSeen ||= assertNoContentFields(JSON.parse(text)); } catch { /* Non-JSON application metadata. */ }
      return publish(topic, bytes, ...rest);
    };
    await network.createArtifactTransport(store, { relayAddresses: [relayAddress], enableWebRTC: true,
      rtcConfiguration: { iceServers: [] }, allowInsecureLocalConnections: true, requestTimeoutMs: 20_000 });
    peerService = await network.createPeerInferenceService({ owner,
      async getLocalState() {
        const status = modelService?.getStatus();
        return { sharedModels: sharing && descriptor ? [descriptor] : [],
          hostedModel: hosting && loaded && status?.status === 'ready' ? descriptor : null,
          busy: !!status?.activeRequestId, queuedRequests: status?.queuedRequests ?? 0,
          idleForMs: Math.max(0, Date.now() - idleSince) };
      },
      async generate(options) {
        if (!hosting || !loaded || options.manifestCid !== descriptor?.manifestCid) throw new Error('Hosted model is unavailable');
        try {
          const result = await modelService.generate(options);
          hostResults.push({ requestId: options.requestId, workerId: result.workerId,
            gpuDispatches: result.gpuDispatches, gpuSubmissions: result.gpuSubmissions,
            inputTokens: result.inputTokens, outputTokens: result.outputTokens });
          if (hostResults.length > 32) hostResults.shift();
          return result;
        } finally { idleSince = Date.now(); }
      },
    });
    return this.info();
  },
  info() {
    return { appPeerId: network.libp2p?.peerId.toString() ?? null, appAddresses: network.libp2p?.getMultiaddrs().map(String) ?? [],
      artifact: network.getArtifactTransport()?.getPeerInfo() ?? null, persistent: store.persistent,
      gpuAvailable: !!navigator.gpu, hasComputeManager: !!compute };
  },
  async dial(address) { await network.libp2p.dial(multiaddr(address)); },
  async importPackage(source, modelDescriptor) {
    const manifest = normalizeArtifactManifest(source);
    for (const file of manifest.files) {
      const response = await fetch(`/seed/${file.path.split('/').map(encodeURIComponent).join('/')}`);
      if (!response.ok || !response.body) throw new Error(`Cached source unavailable: ${file.path}`);
      const result = await store.importFile(response.body, { expectedSize: file.size, expectedSha256: file.sha256, pin: false });
      if (result.cid !== file.cid) throw new Error(`Cached file CID mismatch: ${file.path}`);
    }
    const result = await store.importManifest(manifest, { pin: true });
    if (result.cid !== modelDescriptor.manifestCid) throw new Error('Cached manifest CID mismatch');
    descriptor = modelDescriptor;
    return { cid: result.cid, files: manifest.files.length, bytes: modelDescriptor.totalBytes };
  },
  async load() {
    if (!descriptor) throw new Error('Import the pinned package first');
    compute = new ComputeManager({ requireWorkers: true, enableWorkers: true, enableWebGPU: true,
      minWorkers: 1, targetWorkers: 1, maxWorkers: 1, autoScaleWorkers: false, workerBootstrapTimeoutMs: 60_000 });
    const bytes = 4 * 1024 ** 3;
    modelService = await compute.createModelInferenceService({ artifactStore: store,
      resourceBudgets: { cpu: { units: 1, memoryBytes: bytes }, gpu: { units: 1, memoryBytes: bytes } },
      resourceEstimate: { cpuBytes: bytes, gpuBytes: bytes }, collectGpuEvidence: true,
      runtimeAssets: { mjs: new URL(factoryUrl, location.href).href, wasm: new URL(wasmUrl, location.href).href } });
    const result = await modelService.loadModel({ manifestCid: descriptor.manifestCid });
    loaded = true; idleSince = Date.now(); return result;
  },
  refresh() { return peerService.refresh(); },
  listModels() { return peerService.listModels(); },
  listHosts() { return peerService.listHosts(); },
  async setHosting(enabled) { hosting = enabled; await peerService.setHostingEnabled(enabled); return this.localStatus(); },
  async setSharing(enabled) {
    if (!descriptor) throw new Error('No local model package');
    if (enabled) await network.announceArtifact(descriptor.manifestCid);
    else await network.withdrawArtifact(descriptor.manifestCid);
    sharing = enabled;
  },
  async run({ requestId, manifestCid, prompt, color, cancelAfterToken = false, maxNewTokens = 24 }) {
    const tokens = [], events = [];
    let cancelPromise;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('Acceptance request deadline'), 30_000);
    const record = { tokens, events, controller, done: false };
    requests.set(requestId, record);
    const promise = (async () => {
      try {
        const result = await peerService.generate(manifestCid, { requestId, prompt,
          image: color ? imageFor(color) : undefined, maxNewTokens, signal: controller.signal,
          onToken(text, event) {
            tokens.push(text);
            if (events.length < 512) events.push({ type: 'token', sequence: event?.sequence });
            if (cancelAfterToken) cancelPromise ??= peerService.cancel(requestId);
          },
          onProgress(event) { if (events.length < 512) events.push(event); },
        });
        return { result, tokens, events, error: null };
      } catch (error) { return { error: errorRecord(error), tokens, events, result: null }; }
      finally { clearTimeout(timer); record.done = true; await cancelPromise; }
    })();
    record.promise = promise;
    return promise;
  },
  startPending(options) { void this.run(options); return true; },
  pending(requestId) { const request = requests.get(requestId); return request ? { done: request.done, tokens: request.tokens.length } : null; },
  awaitPending(requestId) { return requests.get(requestId).promise; },
  async ensurePackage(cid) {
    await store.ensureLocal(cid, { pin: true, fetchBlock: (blockCid, options) =>
      network.fetchArtifactBlock(blockCid, { ...options, artifactCid: cid }) });
    const manifest = await store.getManifest(cid);
    const files = [];
    for (const file of manifest.files) {
      const hash = sha256.create(); let bytes = 0;
      for await (const chunk of store.openRead(file.cid)) { hash.update(chunk); bytes += chunk.byteLength; }
      files.push({ path: file.path, size: bytes, sha256: bytesToHex(hash.digest()) });
    }
    return { cid, files };
  },
  localStatus() { return { loaded, hosting, sharing, model: modelService?.getStatus() ?? null }; },
  evidence() {
    return { info: this.info(), local: this.localStatus(), hostResults, pubsub,
      storage: store.getStats(), transfer: network.getArtifactTransport()?.getStats() ?? null,
      compute: compute?.getStats() ?? null, pressure: compute?.resourceBroker.reportPressure() ?? null,
      connections: (network.libp2p?.getConnections() ?? []).map((connection) => ({ peerId: connection.remotePeer.toString(),
        address: connection.remoteAddr.toString(), encryption: connection.encryption ?? connection.stat?.encryption ?? null,
        direct: connection.direct ?? null, status: connection.status ?? connection.stat?.status })), progress };
  },
  async disconnect() { await network.disconnect(); },
  async unload() { loaded = false; await modelService?.unloadModel(); },
  async stop() {
    for (const request of requests.values()) if (!request.done) request.controller.abort('Acceptance cleanup');
    await Promise.allSettled([...requests.values()].map((request) => request.promise));
    await network?.releasePeerInferenceService(owner);
    await modelService?.dispose(); await compute?.destroy(); await network?.disconnect(); await state?.destroy();
  },
};
window.peerInferenceAcceptanceReady = true;
