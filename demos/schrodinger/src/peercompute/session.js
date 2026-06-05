import {
  closureResultFromMaterialPacket
} from '../../../shared/closureContract.js';

const tryFetchJson = async (path) => {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (_) {
    // Optional config lookup.
  }
  return null;
};

export const loadRelayConfig = async () => {
  const params = new URLSearchParams(window.location.search);
  const override = params.get('relayConfigUrl') || params.get('relayConfig') || '';
  if (override) {
    const remote = await tryFetchJson(override);
    if (remote) return remote;
  }
  const source = await tryFetchJson('./relay-config-source.json') || await tryFetchJson('./.relay-config-source.json');
  const sourceUrl = typeof source?.relayConfigUrl === 'string' ? source.relayConfigUrl.trim() : '';
  if (sourceUrl) {
    const remote = await tryFetchJson(sourceUrl);
    if (remote) return remote;
  }
  return await tryFetchJson('./relay-config.json') || { bootstrapPeers: [] };
};

export const attachPeerComputeSession = async ({ onStatus } = {}) => {
  const { NodeKernel } = await import('@peercompute');
  const relayConfig = await loadRelayConfig();
  const node = new NodeKernel({
    bootstrapPeers: Array.isArray(relayConfig.bootstrapPeers) ? relayConfig.bootstrapPeers : [],
    enablePersistence: false,
    enableWebGPU: true,
    enableWorkers: true,
    gameId: 'schrodinger',
    roomId: 'materials',
    topologyId: 'schrodinger-materials',
    topology: 'distributed',
    stateTopic: 'pc.schrodinger.materials.state',
    ...(relayConfig.pubsubType ? { pubsubType: relayConfig.pubsubType } : {}),
    ...(relayConfig.gossipsub ? { gossipsub: relayConfig.gossipsub } : {}),
    ...(relayConfig.webrtc ? { webrtc: relayConfig.webrtc } : {})
  });
  onStatus?.('initializing');
  await node.initialize();
  onStatus?.('starting');
  await node.start();
  const stateManager = node.getStateManager();
  const publishPacket = (packet) => {
    stateManager.commitDelta({
      taskId: `schrodinger:${packet.sampleId}`,
      scope: 'materials',
      version: packet.timestamp,
      payload: packet,
      timestamp: Date.now()
    });
    stateManager.commitDelta({
      taskId: `closure:${packet.sampleId}`,
      scope: 'multiscale-closures',
      version: packet.timestamp,
      payload: closureResultFromMaterialPacket(packet, {
        layerId: 'molecular',
        solverId: 'schrodinger-materials',
        stateKey: `schrodinger:${packet.sampleId}`
      }),
      timestamp: Date.now()
    });
  };
  onStatus?.('attached');
  return {
    node,
    stateManager,
    publishPacket,
    getStatus: () => node.getStatus(),
    stop: () => node.stop()
  };
};
