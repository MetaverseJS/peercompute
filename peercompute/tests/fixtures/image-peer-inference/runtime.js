import { NetworkManager } from '../../../src/peercompute/networkManager/NetworkManager.js';
import { multiaddr } from '@multiformats/multiaddr';

let network, service;
const owner = {};
const requests = new Map();
const pubsub = { messages: 0, privateMarkerSeen: false, contentFieldsSeen: false };

function contentFields(value, depth = 0) {
  if (!value || typeof value !== 'object' || depth > 12) return false;
  return Object.entries(value).some(([key, child]) => ['prompt', 'messages', 'image', 'token'].includes(key)
    || contentFields(child, depth + 1));
}
function errorRecord(error) {
  return { name: error.name, code: error.code ?? null, message: error.message };
}

window.imagePeerRequester = {
  async start({ relayAddress, scope, marker, requestTimeoutMs }) {
    network = new NetworkManager({ ...scope, bootstrapPeers: [relayAddress], allowLocalDial: true,
      pubsubPeerDiscovery: false, enableTopologyController: false, enableTelemetry: false,
      enablePeerDirectory: false, enableRelayDirectPeers: false, debugOutput: false,
      webrtc: { rtcConfiguration: { iceServers: [] }, dropRelayOnDirect: false, dropRelayBootstrapOnDirect: false } });
    await network.initialize(); await network.connect();
    const gossip = network.libp2p.services.pubsub;
    const publish = gossip.publish.bind(gossip);
    gossip.publish = (topic, bytes, ...rest) => {
      pubsub.messages++;
      const text = new TextDecoder().decode(bytes); pubsub.privateMarkerSeen ||= text.includes(marker);
      try { pubsub.contentFieldsSeen ||= contentFields(JSON.parse(text)); } catch { /* Metadata may be binary. */ }
      return publish(topic, bytes, ...rest);
    };
    service = await network.createPeerInferenceService({ owner, requestTimeoutMs,
      getLocalState: () => ({ sharedModels: [], hostedModel: null, busy: false, queuedRequests: 0, idleForMs: 0 }),
      generate() { throw new Error('Requester has no local inference implementation'); },
    });
    return this.info();
  },
  info() {
    return { peerId: network?.libp2p?.peerId.toString(), addresses: network?.libp2p?.getMultiaddrs().map(String) ?? [],
      hasArtifactTransport: Boolean(network?.getArtifactTransport()), hasComputeManager: false };
  },
  dial(address) { return network.libp2p.dial(multiaddr(address)).then(() => true); },
  refresh() { return service.refresh(); },
  async run({ manifestCid, requestId, prompt, seed, steps, cancelAfterProgress = false }) {
    const events = [], controller = new AbortController();
    const record = { controller, done: false, events }; requests.set(requestId, record);
    record.promise = (async () => {
      try {
        const started = performance.now();
        const result = await service.generate(manifestCid, { requestId, prompt, task: 'text-to-image', seed,
          ...(steps === undefined ? {} : { steps }), width: 512, height: 512, signal: controller.signal,
          onProgress(event) {
            if (events.length < 64) events.push({ ...event });
            if (cancelAfterProgress && event.type === 'diffusion-progress') service.cancel(requestId);
          },
          onToken() { throw new Error('Image request unexpectedly produced a text token'); },
        });
        const data = result.image?.data;
        if (!(data instanceof Uint8Array) || result.image.width !== 512 || result.image.height !== 512
            || result.image.channels !== 4 || data.byteLength !== 512 * 512 * 4) throw new Error('Invalid raw image result');
        const digest = await crypto.subtle.digest('SHA-256', data);
        const imageSha256 = [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
        const { image, ...metadata } = result;
        return { error: null, elapsedMs: performance.now() - started, events,
          result: { ...metadata, image: { width: image.width, height: image.height, channels: image.channels,
            bytes: data.byteLength, sha256: imageSha256, advertisedSha256: image.sha256 } } };
      } catch (error) { return { error: errorRecord(error), events, result: null }; }
      finally { record.done = true; }
    })();
    return record.promise;
  },
  async evidence() {
    return { ...this.info(), pubsub: { ...pubsub }, databases: (await indexedDB.databases()).map((database) => database.name),
      workerAttempts: window.__imagePeerWorkerAttempts ?? [],
      connections: (network?.libp2p?.getConnections() ?? []).map((connection) => ({ peerId: connection.remotePeer.toString(),
        address: connection.remoteAddr.toString(), encryption: connection.encryption, status: connection.status })) };
  },
  async stop() {
    for (const request of requests.values()) if (!request.done) request.controller.abort('Requester cleanup');
    await Promise.allSettled([...requests.values()].map((request) => request.promise));
    await network?.releasePeerInferenceService(owner);
    await network?.disconnect();
  },
};
window.imagePeerRequesterReady = true;
