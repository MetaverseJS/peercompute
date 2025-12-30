import { NodeKernel } from '@peercompute';
import { loadRelayConfig, normalizeBootstrapPeers } from './relayConfig.js';
import { TelemetryStore } from './telemetryStore.js';
import { NetworkVisualizer } from './visualizer.js';

const canvas = document.getElementById('netviz-canvas');
const statusEl = document.getElementById('status');
const peerListEl = document.getElementById('peer-list');
const connectBtn = document.getElementById('connect-btn');
const roomInput = document.getElementById('room-input');
const hideGhostsToggle = document.getElementById('hide-ghosts');
const autoRotateToggle = document.getElementById('auto-rotate');
const inspectPanel = document.getElementById('inspect-panel');
const inspectTitle = document.getElementById('inspect-title');
const inspectBody = document.getElementById('inspect-body');
const helpToggle = document.getElementById('help-toggle');
const helpPanel = document.getElementById('help-panel');

const TELEMETRY_PUBLISH_MS = 2000;
const HUD_UPDATE_MS = 500;
const SNAPSHOT_HZ = 2;
const SNAPSHOT_KEEPALIVE_MS = 2500;

const visualizer = new NetworkVisualizer({ canvas });
const telemetryStore = new TelemetryStore();

let node = null;
let networkManager = null;
let stateManager = null;
let localPeerId = null;
let telemetryTimer = null;
let uiTimer = null;

const formatPeerId = (peerId) => {
  if (!peerId) return 'unknown';
  return peerId.slice(0, 8);
};

const formatBytes = (value) => {
  const bytes = Number(value) || 0;
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
};

const formatRate = (value) => {
  const rate = Number(value) || 0;
  return `${formatBytes(rate)}/s`;
};

const formatMs = (value) => {
  if (!Number.isFinite(value)) return '--';
  return `${Math.round(value)}ms`;
};

const setStatus = (lines) => {
  statusEl.textContent = Array.isArray(lines) ? lines.join('\n') : String(lines || '');
};

const showInspector = (title, lines) => {
  inspectTitle.textContent = title;
  inspectBody.textContent = Array.isArray(lines) ? lines.join('\n') : String(lines || '');
  inspectPanel.classList.add('active');
};

const hideInspector = () => {
  inspectPanel.classList.remove('active');
};

const setHelpVisible = (visible) => {
  if (!helpPanel) return;
  helpPanel.classList.toggle('active', visible);
  if (helpToggle) {
    helpToggle.setAttribute('aria-expanded', String(visible));
  }
};

const shouldHideGhosts = () => hideGhostsToggle?.checked ?? true;
const shouldAutoRotate = () => autoRotateToggle?.checked ?? false;

visualizer.setAutoRotate(shouldAutoRotate());

const buildPeerView = ({ includeGhosts = true } = {}) => {
  const peers = telemetryStore.list();
  const byId = new Map();
  peers.forEach((peer) => {
    if (peer?.peerId) byId.set(peer.peerId, peer);
  });

  if (includeGhosts) {
    peers.forEach((peer) => {
      const from = peer?.peerId;
      if (!from) return;
      const neighbors = Array.isArray(peer.peers) ? peer.peers : [];
      neighbors.forEach((neighbor) => {
        const to = neighbor?.peerId || neighbor?.id || null;
        if (!to || byId.has(to)) return;
        byId.set(to, { peerId: to, inferred: true });
      });
    });
  }

  return Array.from(byId.values());
};

const buildEdges = (peers, localId) => {
  const edgeMap = new Map();
  const knownIds = new Set(peers.map((peer) => peer?.peerId).filter(Boolean));
  const buildEdgeKey = (from, to) => (from < to ? `${from}|${to}` : `${to}|${from}`);
  const addEdge = (from, to, metrics) => {
    const key = buildEdgeKey(from, to);
    if (edgeMap.has(key)) return;
    const lastRxAt = Number(metrics?.lastRxAt);
    const lastTxAt = Number(metrics?.lastTxAt);
    edgeMap.set(key, {
      from,
      to,
      rxBps: Number(metrics?.rxBps) || 0,
      txBps: Number(metrics?.txBps) || 0,
      lastRxAt: Number.isFinite(lastRxAt) ? lastRxAt : null,
      lastTxAt: Number.isFinite(lastTxAt) ? lastTxAt : null
    });
  };

  if (localId) {
    const localData = telemetryStore.get(localId);
    const neighbors = Array.isArray(localData?.peers) ? localData.peers : [];
    neighbors.forEach((neighbor) => {
      const to = neighbor?.peerId || neighbor?.id || null;
      if (!to || to === localId || !knownIds.has(to)) return;
      addEdge(localId, to, neighbor);
    });
  }

  peers.forEach((peer) => {
    const from = peer?.peerId;
    if (!from) return;
    const neighbors = Array.isArray(peer.peers) ? peer.peers : [];
    neighbors.forEach((neighbor) => {
      const to = neighbor?.peerId || neighbor?.id || null;
      if (!to || to === from || !knownIds.has(to)) return;
      addEdge(from, to, neighbor);
    });
  });

  return Array.from(edgeMap.values());
};

const findNeighborMetrics = (fromPeer, toPeerId) => {
  const neighbors = Array.isArray(fromPeer?.peers) ? fromPeer.peers : [];
  return neighbors.find((neighbor) => neighbor?.peerId === toPeerId) || null;
};

const buildNodeInfo = (peerId) => {
  const data = telemetryStore.get(peerId);
  if (!data) {
    return {
      title: `Node ${formatPeerId(peerId)}`,
      lines: ['No telemetry for this node yet.']
    };
  }
  const counts = data.counts || {};
  const rates = data.rates || {};
  const peers = Array.isArray(data.peers) ? data.peers : [];
  const rttValues = peers.map((peer) => peer?.rttMs).filter((value) => Number.isFinite(value));
  const avgRtt = rttValues.length
    ? rttValues.reduce((sum, value) => sum + value, 0) / rttValues.length
    : null;

  return {
    title: `Node ${formatPeerId(peerId)}`,
    lines: [
      `Peer ID: ${peerId}`,
      `Connections: ${data.connections ?? peers.length}`,
      `Peers: ${data.peerCount ?? peers.length}`,
      `Rx: ${counts.rx ?? 0} (${formatBytes(counts.rxBytes)}) @ ${formatRate(rates.rxBps)}`,
      `Tx: ${counts.tx ?? 0} (${formatBytes(counts.txBytes)}) @ ${formatRate(rates.txBps)}`,
      `Avg RTT: ${formatMs(avgRtt)}`,
      `Last Rx: ${data.lastRxAt ? new Date(data.lastRxAt).toLocaleTimeString() : '--'}`,
      `Last Tx: ${data.lastTxAt ? new Date(data.lastTxAt).toLocaleTimeString() : '--'}`
    ]
  };
};

const buildEdgeInfo = (fromId, toId) => {
  const fromData = telemetryStore.get(fromId);
  const toData = telemetryStore.get(toId);
  const fromMetrics = findNeighborMetrics(fromData, toId);
  const toMetrics = findNeighborMetrics(toData, fromId);
  const rttMs = Number.isFinite(fromMetrics?.rttMs) ? fromMetrics.rttMs : toMetrics?.rttMs;
  const rxBps = Number.isFinite(fromMetrics?.rxBps) ? fromMetrics.rxBps : 0;
  const txBps = Number.isFinite(fromMetrics?.txBps) ? fromMetrics.txBps : 0;

  return {
    title: `Edge ${formatPeerId(fromId)} ↔ ${formatPeerId(toId)}`,
    lines: [
      `From: ${fromId}`,
      `To: ${toId}`,
      `RTT: ${formatMs(rttMs)}`,
      `Rx rate: ${formatRate(rxBps)}`,
      `Tx rate: ${formatRate(txBps)}`,
      `Updated: ${fromMetrics?.lastRttAt ? new Date(fromMetrics.lastRttAt).toLocaleTimeString() : '--'}`
    ]
  };
};

const updateHud = () => {
  telemetryStore.prune(15000);
  const peers = buildPeerView({ includeGhosts: !shouldHideGhosts() });
  const edges = buildEdges(peers, localPeerId);
  visualizer.updatePeers(peers, localPeerId, edges);

  const local = localPeerId ? telemetryStore.get(localPeerId) : null;
  if (local) {
    setStatus([
      `Status: connected (${formatPeerId(local.peerId)})`,
      `Peers: ${local.peerCount ?? peers.length - 1}`,
      `Rx: ${local.counts?.rx ?? 0} (${formatBytes(local.counts?.rxBytes)})`,
      `Rx rate: ${formatRate(local.rates?.rxBps)}`,
      `Tx: ${local.counts?.tx ?? 0} (${formatBytes(local.counts?.txBytes)})`,
      `Tx rate: ${formatRate(local.rates?.txBps)}`,
      `Pubsub: ${local.pubsubPeerCount ?? 0}`
    ]);
  } else if (node) {
    setStatus('Status: connecting...');
  }

  if (peers.length === 0) {
    peerListEl.textContent = 'No peers yet.';
    return;
  }

  const lines = peers
    .slice()
    .sort((a, b) => (a.peerId || '').localeCompare(b.peerId || ''))
    .map((peer) => {
      const tag = peer.peerId === localPeerId ? 'LOCAL' : peer.inferred ? 'GHOST' : 'PEER ';
      const rx = peer.counts?.rx ?? peer.rxCount ?? 0;
      const tx = peer.counts?.tx ?? peer.txCount ?? 0;
      const rtt = Number.isFinite(peer.rttMs) ? ` | rtt ${Math.round(peer.rttMs)}ms` : '';
      return `${tag} ${formatPeerId(peer.peerId)} | rx ${rx} | tx ${tx}${rtt}`;
    });
  peerListEl.textContent = lines.join('\n');
};

const handleSnapshot = (_peerId, message) => {
  const entries = Array.isArray(message?.payload) ? message.payload : [];
  entries.forEach((entry) => {
    if (!entry || entry.id !== 'warm-deltas') return;
    telemetryStore.updateFromWarmDeltas(entry.data);
  });
};

const startTelemetryLoop = () => {
  if (!networkManager || !stateManager) return;

  const publish = () => {
    const snapshot = networkManager.getTelemetrySnapshot();
    if (!snapshot?.peerId) return;
    telemetryStore.updateLocal(snapshot);
    stateManager.commitDelta({
      taskId: `telemetry:${snapshot.peerId}`,
      version: snapshot.ts,
      payload: snapshot,
      timestamp: snapshot.ts
    });
  };

  publish();
  telemetryTimer = setInterval(publish, TELEMETRY_PUBLISH_MS);
  uiTimer = setInterval(updateHud, HUD_UPDATE_MS);
};

const connect = async () => {
  if (node) return;
  setStatus('Status: connecting...');
  connectBtn.disabled = true;

  try {
    const cfg = await loadRelayConfig();
    const bootstrapPeers = normalizeBootstrapPeers(cfg.bootstrapPeers || []);
    const roomId = roomInput.value.trim() || 'telemetry';

    node = new NodeKernel({
      bootstrapPeers,
      enablePersistence: false,
      enableWarmDeltaProvider: true,
      deltaNamespace: 'telemetry',
      gameId: 'netviz',
      roomId
    });

    await node.initialize();
    await node.start();

    networkManager = node.getNetworkManager();
    stateManager = node.getStateManager();
    networkManager.configureScheduler({ snapshotHz: SNAPSHOT_HZ, keepaliveMs: SNAPSHOT_KEEPALIVE_MS });
    networkManager.addSnapshotHandler(handleSnapshot);

    localPeerId = node.getStatus().network.peerId;
    startTelemetryLoop();
    updateHud();
  } catch (err) {
    console.error('NetViz connect failed', err);
    setStatus(`Status: error (${err?.message || err})`);
    connectBtn.disabled = false;
  }
};

connectBtn.addEventListener('click', () => {
  connect().catch(() => {});
});

const handlePick = (event) => {
  const hit = visualizer.pick(event.clientX, event.clientY);
  if (!hit) {
    hideInspector();
    return;
  }
  if (hit.type === 'node') {
    const info = buildNodeInfo(hit.peerId);
    showInspector(info.title, info.lines);
    return;
  }
  if (hit.type === 'edge') {
    const info = buildEdgeInfo(hit.from, hit.to);
    showInspector(info.title, info.lines);
  }
};

canvas.addEventListener('click', handlePick);

helpToggle?.addEventListener('click', () => {
  if (!helpPanel) return;
  const next = !helpPanel.classList.contains('active');
  setHelpVisible(next);
});

hideGhostsToggle?.addEventListener('change', () => {
  updateHud();
});

autoRotateToggle?.addEventListener('change', () => {
  visualizer.setAutoRotate(shouldAutoRotate());
});

roomInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    connect().catch(() => {});
  }
});

window.addEventListener('beforeunload', () => {
  if (telemetryTimer) clearInterval(telemetryTimer);
  if (uiTimer) clearInterval(uiTimer);
});

updateHud();
connect().catch(() => {});
