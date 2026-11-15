import { NodeKernel } from '../../peercompute/src/peercompute/nodeKernel/NodeKernel.js';
import { multiaddr } from '@multiformats/multiaddr';
import { ModelEvidenceStore } from '../../peercompute/src/peercompute/modelEvidence/ModelEvidenceStore.js';
import { ModelEvidenceService } from '../../peercompute/src/peercompute/modelEvidence/ModelEvidenceService.js';
import { BrowserHostStore, hostInstallationId } from './BrowserHostStore.js';

const gpuTaskUrl = new URL('./gpuQualificationTask.js', import.meta.url).href;

/** Browser-client composition for an owned host. No demo UI, model auto-load or remote code API. */
export function createBrowserRoot() {
  let store, identity, kernel, evidenceStore, evidenceService, installationId, lockRelease, lockTask;
  let phase = 'idle', failure = null, qualification = null, requireHardwareGpu = true;
  let lifetime = new AbortController(), queue = Promise.resolve();
  const serialize = operation => {
    const next = queue.then(operation); queue = next.catch(() => {}); return next;
  };
  const publicIdentity = () => identity ? { installationId, peerId: identity.peerId, persistent: true } : null;

  async function acquireLock(id) {
    if (!globalThis.navigator?.locks?.request) throw new Error('A persistent root requires the browser Web Locks API');
    let accept, reject;
    const acquired = new Promise((resolve, no) => { accept = resolve; reject = no; });
    lockTask = navigator.locks.request(`peercompute-root-runtime:${id}`, { ifAvailable: true }, async lock => {
      if (!lock) throw new Error('This installation is already running in another tab');
      const held = new Promise(resolve => { lockRelease = resolve; });
      accept(); await held;
    });
    lockTask.catch(reject);
    await acquired;
  }

  async function prepare({ installationId: requestedId = installationId ?? 'default' } = {}) {
    const id = hostInstallationId(requestedId);
    if (identity) {
      if (id !== installationId) throw new Error('Stop the root before selecting a different installation');
      return publicIdentity();
    }
    installationId = id; phase = 'preparing'; failure = null;
    try {
      await acquireLock(id);
      store = new BrowserHostStore({ installationId: id });
      identity = await store.loadIdentity();
      phase = 'prepared';
      return publicIdentity();
    } catch (error) {
      await store?.close(); store = null;
      lockRelease?.(); await lockTask?.catch(() => {}); lockTask = null; lockRelease = null;
      phase = 'failed'; failure = error.message; throw error;
    }
  }

  function status() {
    return { schema: 'peercompute.browser-root-status.v1', phase, identity: publicIdentity(),
      connected: kernel?.networkManager?.isConnected === true,
      addresses: kernel?.networkManager?.libp2p?.getMultiaddrs().map(address => address.toString()) ?? [],
      peers: kernel?.networkManager?.libp2p?.getPeers().map(peer => peer.toString()) ?? [],
      connections: kernel?.networkManager?.libp2p?.getConnections().map(connection => ({
        remotePeer: connection.remotePeer.toString(), multiaddr: connection.remoteAddr.toString(),
        encryption: connection.encryption ?? null, direction: connection.direction,
        limited: connection.limits != null,
      })) ?? [],
      statePersistent: !!kernel?.stateManager?.indexeddbProvider && !kernel.stateManager.persistenceFailed,
      evidence: evidenceStore ? { storage: evidenceStore.status(), network: evidenceService?.status() ?? null } : null,
      compute: kernel?.computeManager ? { capabilities: kernel.computeManager.getCapabilities(), stats: kernel.computeManager.getStats() } : null,
      gpuQualification: qualification, failure,
      environment: { secureContext: globalThis.isSecureContext === true, crossOriginIsolated: globalThis.crossOriginIsolated === true,
        userAgent: globalThis.navigator?.userAgent ?? '', webgpu: !!globalThis.navigator?.gpu } };
  }

  async function stop() {
    phase = 'stopping'; lifetime.abort(new DOMException('Root host stopped', 'AbortError'));
    try {
      // Never release the identity lock while managed work may still be alive.
      await evidenceService?.stop(); evidenceService = null;
      await evidenceStore?.destroy(); evidenceStore = null;
      await kernel?.stop(); kernel = null;
      await store?.close(); store = null; identity = null;
      lockRelease?.(); await lockTask?.catch(() => {}); lockTask = null; lockRelease = null;
      phase = 'stopped'; qualification = null; lifetime = new AbortController();
      return status();
    } catch (error) { phase = 'cleanup-failed'; failure = error.message; throw error; }
  }

  async function start(config = {}) {
    if (kernel) {
      if (config.installationId !== undefined && config.installationId !== installationId) throw new Error('A different installation is already started');
      if (phase !== 'ready') throw new Error(`Root host is ${phase}`);
      return status();
    }
    await prepare(config);
    const bootstrapPeers = config.bootstrapPeers ?? [];
    if (!Array.isArray(bootstrapPeers) || bootstrapPeers.length > 16
        || bootstrapPeers.some(value => typeof value !== 'string' || value.length > 2048)) {
      throw new TypeError('bootstrapPeers must contain at most 16 multiaddress strings');
    }
    requireHardwareGpu = config.requireHardwareGpu !== false;
    phase = 'starting'; failure = null;
    try {
      kernel = new NodeKernel({
        gameId: 'peercompute-root', roomId: installationId, docName: `peercompute-root-state-v1-${installationId}`,
        privateKeyProvider: () => identity.privateKey, bootstrapPeers,
        enableWebGPU: true, enableWorkers: true, requireWorkers: true,
        minWorkers: 1, targetWorkers: 1, maxWorkers: 2, autoScaleWorkers: false, workerBootstrapTimeoutMs: 60000,
        enableGPUHub: false, enablePersistence: true, disableStateNetworkProvider: true, disableStateBroadcast: true,
        enableNetVizDebugTelemetry: false, enableNetVizSessionBroadcast: false, enableNetVizSessionDiscovery: false,
        enableNetworkTelemetry: false, enableTopologyController: false, enableWarmDeltaProvider: false,
        enableRemoteComputeResponder: false, enableRemoteTaskGraphResponder: false, allowRemoteFunctionTasks: false,
        maxConnections: 16, maxDialPeers: 8,
        // Let NetworkManager infer loopback/LAN permission from explicit bootstraps.
        allowLocalDial: config.allowLocalDial,
        webrtc: { rtcConfiguration: { iceServers: [] }, dropRelayOnDirect: false, dropRelayBootstrapOnDirect: false },
      });
      await kernel.initialize();
      if (kernel.networkManager.libp2p.peerId.toString() !== identity.peerId) throw new Error('Kernel did not retain the prepared application identity');
      evidenceStore = new ModelEvidenceStore({ name: installationId });
      await evidenceStore.open();
      evidenceService = new ModelEvidenceService(kernel.networkManager, { store: evidenceStore, serve: true });
      await evidenceService.start();
      if (config.connectNetwork === true) await kernel.start();
      phase = 'ready'; return status();
    } catch (error) {
      try { await stop(); } catch (cleanupError) { error.cleanupError = cleanupError; }
      phase = 'failed'; failure = error.message; throw error;
    }
  }

  async function qualifyCompute() {
    if (phase !== 'ready' || !kernel) throw new Error('Start the root before qualifying compute');
    const signal = AbortSignal.any([lifetime.signal, AbortSignal.timeout(30000)]);
    qualification = await kernel.computeManager.submitTask({ module: gpuTaskUrl, exportName: 'qualifyManagedGpu',
      data: { requireHardwareGpu }, requireWorker: true, signal, suppressCommitDelta: true });
    return qualification;
  }

  return Object.freeze({
    prepare: config => serialize(() => prepare(config)),
    start: config => serialize(() => start(config)), status,
    qualifyCompute: () => serialize(qualifyCompute),
    recordEvidence: report => serialize(() => {
      if (phase !== 'ready' || !evidenceStore) throw new Error('Start the root before recording model evidence');
      return evidenceStore.append(report, { reporterPeerId: identity.peerId, provenance: 'local' });
    }),
    queryEvidence: filter => serialize(() => {
      if (phase !== 'ready' || !evidenceStore) throw new Error('Start the root before querying model evidence');
      return evidenceStore.query(filter);
    }),
    submitEvidence: (peerId, reports) => serialize(() => {
      if (phase !== 'ready' || !evidenceService) throw new Error('Start the root before submitting peer evidence');
      return evidenceService.submit(peerId, reports, { signal: lifetime.signal });
    }),
    queryPeerEvidence: (peerId, filter) => serialize(() => {
      if (phase !== 'ready' || !evidenceService) throw new Error('Start the root before querying peer evidence');
      return evidenceService.query(peerId, filter, { signal: lifetime.signal });
    }),
    connectPeer: address => serialize(async () => {
      if (phase !== 'ready' || !kernel?.networkManager?.isConnected) throw new Error('Start the network before connecting a peer');
      if (typeof address !== 'string' || !address || address.length > 2048) throw new TypeError('A peer multiaddress is required');
      const target = multiaddr(address);
      if (!target.getComponents().some(component => component.name === 'p2p')) throw new TypeError('A peer identity is required in its multiaddress');
      const signal = AbortSignal.any([lifetime.signal, AbortSignal.timeout(15000)]);
      const connection = await kernel.networkManager.libp2p.dial(target, { signal });
      const encrypted = ['/noise', '/tls/1.0.0'].includes(connection.encryption)
        || connection.encryption === 'native' && /\/webrtc(?:-direct)?(?:\/|$)/.test(connection.remoteAddr.toString());
      if (!encrypted) { await connection.close(); throw new Error('Root peer operations require an authenticated encrypted connection'); }
      return { peerId: connection.remotePeer.toString(), multiaddr: connection.remoteAddr.toString(), encryption: connection.encryption };
    }),
    writeMarker: input => serialize(() => {
      if (!store || !identity) throw new Error('Prepare the root before writing host markers');
      return store.writeMarker(input);
    }),
    readMarker: key => serialize(() => {
      if (!store || !identity) throw new Error('Prepare the root before reading host markers');
      return store.readMarker(key);
    }),
    stop: () => {
      lifetime.abort(new DOMException('Root host stopped', 'AbortError'));
      return serialize(stop);
    },
  });
}
