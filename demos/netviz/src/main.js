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
const consoleToggle = document.getElementById('console-toggle');
const consoleWindow = document.getElementById('console-window');
const inspectPanel = document.getElementById('inspect-panel');
const inspectTitle = document.getElementById('inspect-title');
const inspectBody = document.getElementById('inspect-body');
const helpToggle = document.getElementById('help-toggle');
const helpPanel = document.getElementById('help-panel');
const eventLogEl = document.getElementById('event-log');

const TELEMETRY_PUBLISH_MS = 2000;
const HUD_UPDATE_MS = 500;
const SNAPSHOT_HZ = 1;
const SNAPSHOT_KEEPALIVE_MS = 5000;
const PUBSUB_ACTIVE_MS = 12000;
const MAX_LOG_ENTRIES = 120;

const visualizer = new NetworkVisualizer({ canvas });
const telemetryStore = new TelemetryStore();

let node = null;
let networkManager = null;
let stateManager = null;
let localPeerId = null;
let telemetryTimer = null;
let uiTimer = null;
let relayPeerIds = new Set();
let relayReachable = null;
let lastRelayPeerId = null;
let connectStartedAt = 0;
let libp2pLogAttached = false;
const logEntries = [];

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

const formatLogTime = (value) => new Date(value).toLocaleTimeString();

const logEvent = (message) => {
  if (!eventLogEl) return;
  const line = `[${formatLogTime(Date.now())}] ${message}`;
  logEntries.push(line);
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries.splice(0, logEntries.length - MAX_LOG_ENTRIES);
  }
  eventLogEl.textContent = logEntries.join('\n');
};

const connectionErrors = new Map();
const BROADCAST_ERROR_KEY = '__broadcast__';

const markConnectionError = (peerId) => {
  if (!peerId) return;
  connectionErrors.set(peerId, Date.now());
};

const clearConnectionError = (peerId) => {
  if (!peerId) return;
  connectionErrors.delete(peerId);
};

const markBroadcastError = () => {
  connectionErrors.set(BROADCAST_ERROR_KEY, Date.now());
};

const clearBroadcastError = () => {
  connectionErrors.delete(BROADCAST_ERROR_KEY);
};

const handlePublishError = (_topic, payload, err) => {
  const target = payload?.target || null;
  if (target) {
    markConnectionError(target);
  } else {
    markBroadcastError();
  }
  if (err) {
    logEvent(`Publish error: ${err?.message || err}`);
  }
};

const handlePublishSuccess = (_topic, payload) => {
  const target = payload?.target || null;
  if (target) {
    clearConnectionError(target);
  } else {
    clearBroadcastError();
  }
};

const extractPeerId = (value) => {
  if (!value) return null;
  const text = String(value);
  const p2pIndex = text.lastIndexOf('/p2p/');
  if (p2pIndex >= 0) {
    const id = text.slice(p2pIndex + 5).split('/')[0];
    return id || null;
  }
  if (!text.includes('/')) return text;
  return null;
};

const isActiveNeighbor = (neighbor) => {
  if (!neighbor) return false;
  if (Number.isFinite(neighbor.connectedAt)) return true;
  const via = neighbor.via;
  return Boolean(via && via !== 'presence');
};

const getLocalRelayPeerId = () => {
  if (!localPeerId || relayPeerIds.size === 0) return null;
  const local = telemetryStore.get(localPeerId);
  const neighbors = Array.isArray(local?.peers) ? local.peers : [];
  for (const neighbor of neighbors) {
    if (!isActiveNeighbor(neighbor)) continue;
    const id = neighbor?.peerId || neighbor?.id || null;
    if (id && relayPeerIds.has(id)) return id;
  }
  return null;
};

const buildRelayState = (entries, relayIds) => {
  const relaySet = relayIds instanceof Set ? relayIds : new Set(relayIds || []);
  const activeRelayIds = new Set();
  const peerRelayMap = new Map();
  if (!Array.isArray(entries) || relaySet.size === 0) {
    return { relayIds: Array.from(relaySet), activeRelayIds: [], peerRelayMap };
  }
  entries.forEach((peer) => {
    const peerId = peer?.peerId;
    if (!peerId) return;
    const neighbors = Array.isArray(peer.peers) ? peer.peers : [];
    let relayId = null;
    neighbors.forEach((neighbor) => {
      if (!isActiveNeighbor(neighbor)) return;
      const id = neighbor?.peerId || neighbor?.id || null;
      if (!id || !relaySet.has(id)) return;
      activeRelayIds.add(id);
      if (!relayId) relayId = id;
    });
    if (relayId) {
      peerRelayMap.set(peerId, relayId);
    }
  });
  return { relayIds: Array.from(relaySet), activeRelayIds: Array.from(activeRelayIds), peerRelayMap };
};

const normalizeWebRTCConfig = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return null;
  const raw = cfg.webrtc && typeof cfg.webrtc === 'object' ? cfg.webrtc : {};
  const iceServers = raw.iceServers ?? cfg.iceServers ?? cfg.webrtcIceServers;
  const rtcConfiguration = raw.rtcConfiguration ?? cfg.rtcConfiguration;
  const preferDirect = raw.preferDirect ?? cfg.preferDirect;
  const dropRelayOnDirect = raw.dropRelayOnDirect ?? cfg.dropRelayOnDirect;
  const next = { ...raw };
  if (iceServers !== undefined && next.iceServers === undefined) next.iceServers = iceServers;
  if (rtcConfiguration !== undefined && next.rtcConfiguration === undefined) next.rtcConfiguration = rtcConfiguration;
  if (preferDirect !== undefined && next.preferDirect === undefined) next.preferDirect = preferDirect;
  if (dropRelayOnDirect !== undefined && next.dropRelayOnDirect === undefined) next.dropRelayOnDirect = dropRelayOnDirect;
  return Object.keys(next).length ? next : null;
};

const normalizePubsubType = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return null;
  const raw = cfg.pubsubType ?? cfg.pubsub;
  if (!raw) return null;
  return String(raw).trim().toLowerCase();
};

const normalizeGossipsubConfig = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return null;
  const raw = cfg.gossipsub;
  if (!raw || typeof raw !== 'object') return null;
  return { ...raw };
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

const setConsoleVisible = (visible) => {
  if (!consoleWindow) return;
  consoleWindow.classList.toggle('collapsed', !visible);
  if (consoleToggle) {
    consoleToggle.setAttribute('aria-expanded', String(visible));
  }
};

const shouldHideGhosts = () => hideGhostsToggle?.checked ?? true;
const shouldAutoRotate = () => autoRotateToggle?.checked ?? false;

visualizer.setAutoRotate(shouldAutoRotate());
setConsoleVisible(true);

const buildPeerView = ({ includeGhosts = true, relayState = null } = {}) => {
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

  const activeRelayIds = relayState?.activeRelayIds || [];
  activeRelayIds.forEach((relayId) => {
    const existing = byId.get(relayId);
    if (existing) {
      byId.set(relayId, { ...existing, isRelay: true, inferred: false });
    } else {
      byId.set(relayId, { peerId: relayId, isRelay: true });
    }
  });

  return Array.from(byId.values());
};

const buildEdges = (peers, localId, relayState = null) => {
  const edgeMap = new Map();
  const knownIds = new Set(peers.map((peer) => peer?.peerId).filter(Boolean));
  const relayIds = new Set(relayState?.activeRelayIds || []);
  const buildEdgeKey = (from, to) => (from < to ? `${from}|${to}` : `${to}|${from}`);
  const resolveRelayForEdge = (from, to, via) => {
    if (via !== 'relay') return null;
    const peerRelayMap = relayState?.peerRelayMap;
    const fromRelay = peerRelayMap?.get(from) || null;
    const toRelay = peerRelayMap?.get(to) || null;
    if (fromRelay && toRelay && fromRelay === toRelay) return fromRelay;
    if (fromRelay) return fromRelay;
    if (toRelay) return toRelay;
    const localRelay = localId ? peerRelayMap?.get(localId) || null : null;
    if (localRelay) return localRelay;
    const fallback = relayState?.activeRelayIds?.[0];
    return fallback || null;
  };
  const addEdge = (from, to, metrics) => {
    if (relayIds.has(from) || relayIds.has(to)) return;
    const key = buildEdgeKey(from, to);
    const lastRxAt = Number(metrics?.lastRxAt);
    const lastTxAt = Number(metrics?.lastTxAt);
    const errorAtFromMetrics = Number(metrics?.errorAt);
    const localErrorPeer = from === localId ? to : to === localId ? from : null;
    const broadcastErrorAt = connectionErrors.get(BROADCAST_ERROR_KEY);
    const errorAtLocal = localErrorPeer ? (connectionErrors.get(localErrorPeer) ?? broadcastErrorAt) : null;
    const errorAt = Number.isFinite(errorAtFromMetrics) ? errorAtFromMetrics : errorAtLocal;
    const lastSuccess = Math.max(
      Number.isFinite(lastRxAt) ? lastRxAt : 0,
      Number.isFinite(lastTxAt) ? lastTxAt : 0
    );
    const errorActive = Number.isFinite(errorAt) && (!lastSuccess || lastSuccess <= errorAt);
    if (localErrorPeer && Number.isFinite(errorAt) && lastSuccess > errorAt) {
      clearConnectionError(localErrorPeer);
    }
    const nextRxBps = Number(metrics?.rxBps) || 0;
    const nextTxBps = Number(metrics?.txBps) || 0;
    const nextRxCount = Number(metrics?.rxCount) || 0;
    const nextTxCount = Number(metrics?.txCount) || 0;
    const via = metrics?.via || null;
    const relayPeerId = resolveRelayForEdge(from, to, via);
    const existing = edgeMap.get(key);
    if (existing) {
      if (existing.via !== 'webrtc') {
        if (via === 'webrtc') {
          existing.via = 'webrtc';
        } else if (!existing.via && via) {
          existing.via = via;
        }
      }
      if (!existing.relayPeerId && relayPeerId) {
        existing.relayPeerId = relayPeerId;
      }
      if (errorActive) {
        existing.errorActive = true;
        existing.errorAt = errorAt;
      } else if (Number.isFinite(errorAt) && !errorActive) {
        existing.errorActive = false;
        existing.errorAt = errorAt;
      }
      existing.rxBps = Math.max(existing.rxBps || 0, nextRxBps);
      existing.txBps = Math.max(existing.txBps || 0, nextTxBps);
      existing.rxCount = Math.max(existing.rxCount || 0, nextRxCount);
      existing.txCount = Math.max(existing.txCount || 0, nextTxCount);
      if (Number.isFinite(lastRxAt)) {
        existing.lastRxAt = Math.max(existing.lastRxAt || 0, lastRxAt);
      }
      if (Number.isFinite(lastTxAt)) {
        existing.lastTxAt = Math.max(existing.lastTxAt || 0, lastTxAt);
      }
      return;
    }
    edgeMap.set(key, {
      from,
      to,
      rxBps: nextRxBps,
      txBps: nextTxBps,
      rxCount: nextRxCount,
      txCount: nextTxCount,
      errorActive,
      errorAt: Number.isFinite(errorAt) ? errorAt : null,
      lastRxAt: Number.isFinite(lastRxAt) ? lastRxAt : null,
      lastTxAt: Number.isFinite(lastTxAt) ? lastTxAt : null,
      via,
      relayPeerId
    });
  };

  if (localId) {
    const localData = telemetryStore.get(localId);
    const neighbors = Array.isArray(localData?.peers) ? localData.peers : [];
    neighbors.forEach((neighbor) => {
      if (!isActiveNeighbor(neighbor)) return;
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
      if (!isActiveNeighbor(neighbor)) return;
      const to = neighbor?.peerId || neighbor?.id || null;
      if (!to || to === from || !knownIds.has(to)) return;
      addEdge(from, to, neighbor);
    });
  });

  return Array.from(edgeMap.values());
};

const buildPubsubEdges = (peers, relayState = null) => {
  const edges = [];
  const now = Date.now();
  const relayFallback = relayState?.activeRelayIds?.[0] || null;
  const peerRelayMap = relayState?.peerRelayMap;

  peers.forEach((peer) => {
    if (!peer?.peerId || peer.isRelay) return;
    const pubsub = peer.pubsub || {};
    const txCount = Number(pubsub.txCount) || 0;
    const rxCount = Number(pubsub.rxCount) || 0;
    const hasPubsub = txCount > 0 || rxCount > 0 || pubsub.lastTxAt || pubsub.lastRxAt;
    if (!hasPubsub) return;
    const relayPeerId = peerRelayMap?.get(peer.peerId) || relayFallback;
    if (!relayPeerId) return;
    const lastTxAt = Number(pubsub.lastTxAt);
    const lastRxAt = Number(pubsub.lastRxAt);
    const txActive = Number.isFinite(lastTxAt) && now - lastTxAt < PUBSUB_ACTIVE_MS;
    const rxActive = Number.isFinite(lastRxAt) && now - lastRxAt < PUBSUB_ACTIVE_MS;
    edges.push({
      from: peer.peerId,
      to: relayPeerId,
      lastTxAt: txActive ? lastTxAt : null,
      lastRxAt: rxActive ? lastRxAt : null,
      txCount,
      rxCount
    });
  });

  return edges;
};

const findNeighborMetrics = (fromPeer, toPeerId) => {
  const neighbors = Array.isArray(fromPeer?.peers) ? fromPeer.peers : [];
  return neighbors.find((neighbor) => neighbor?.peerId === toPeerId) || null;
};

const buildNodeInfo = (peerId) => {
  const data = telemetryStore.get(peerId);
  if (!data) {
    const isRelay = relayPeerIds.has(peerId);
    return {
      title: `Node ${formatPeerId(peerId)}`,
      lines: isRelay ? ['Role: Relay server', 'No telemetry for this node yet.'] : ['No telemetry for this node yet.']
    };
  }
  const isRelay = relayPeerIds.has(peerId);
  const counts = data.counts || {};
  const rates = data.rates || {};
  const peers = Array.isArray(data.peers) ? data.peers : [];
  const rttValues = peers.map((peer) => peer?.rttMs).filter((value) => Number.isFinite(value));
  const avgRtt = rttValues.length
    ? rttValues.reduce((sum, value) => sum + value, 0) / rttValues.length
    : null;
  const lines = [
    `Peer ID: ${peerId}`,
    `Connections: ${data.connections ?? peers.length}`,
    `Peers: ${data.peerCount ?? peers.length}`,
    `Rx: ${counts.rx ?? 0} (${formatBytes(counts.rxBytes)}) @ ${formatRate(rates.rxBps)}`,
    `Tx: ${counts.tx ?? 0} (${formatBytes(counts.txBytes)}) @ ${formatRate(rates.txBps)}`,
    `Avg RTT: ${formatMs(avgRtt)}`,
    `Last Rx: ${data.lastRxAt ? new Date(data.lastRxAt).toLocaleTimeString() : '--'}`,
    `Last Tx: ${data.lastTxAt ? new Date(data.lastTxAt).toLocaleTimeString() : '--'}`
  ];
  if (isRelay) {
    lines.splice(1, 0, 'Role: Relay server');
  }

  return {
    title: `Node ${formatPeerId(peerId)}`,
    lines
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

const attachLibp2pLogging = () => {
  if (libp2pLogAttached || !networkManager?.getLibp2pNode) return;
  const libp2p = networkManager.getLibp2pNode();
  if (!libp2p?.addEventListener) return;
  libp2pLogAttached = true;

  const readPeerId = (evt) =>
    evt?.detail?.remotePeer?.toString?.() ||
    evt?.detail?.id?.toString?.() ||
    evt?.detail?.toString?.() ||
    null;

  libp2p.addEventListener('peer:connect', (evt) => {
    const peerId = readPeerId(evt);
    if (!peerId) return;
    clearConnectionError(peerId);
    const label = relayPeerIds.has(peerId) ? 'Relay' : 'Peer';
    logEvent(`${label} connected (${formatPeerId(peerId)})`);
  });

  libp2p.addEventListener('peer:disconnect', (evt) => {
    const peerId = readPeerId(evt);
    if (!peerId) return;
    markConnectionError(peerId);
    const label = relayPeerIds.has(peerId) ? 'Relay' : 'Peer';
    logEvent(`${label} disconnected (${formatPeerId(peerId)})`);
  });
};

const updateRelayStatus = () => {
  if (!connectStartedAt || relayPeerIds.size === 0) return;
  const relayPeerId = getLocalRelayPeerId();
  if (relayPeerId) {
    if (relayReachable !== true || relayPeerId !== lastRelayPeerId) {
      logEvent(`Relay reachable (${formatPeerId(relayPeerId)})`);
    }
    relayReachable = true;
    lastRelayPeerId = relayPeerId;
    return;
  }
  const elapsed = Date.now() - connectStartedAt;
  if (relayReachable === true) {
    relayReachable = false;
    logEvent('Relay disconnected');
    return;
  }
  if (relayReachable !== false && elapsed > 6000) {
    relayReachable = false;
    logEvent('Relay unreachable');
  }
};

const updateHud = () => {
  telemetryStore.prune(15000);
  updateRelayStatus();
  const relayState = buildRelayState(telemetryStore.list(), relayPeerIds);
  const peers = buildPeerView({ includeGhosts: !shouldHideGhosts(), relayState });
  const edges = buildEdges(peers, localPeerId, relayState);
  const pubsubEdges = buildPubsubEdges(peers, relayState);
  visualizer.updatePeers(peers, localPeerId, edges, pubsubEdges);

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
      const tag = peer.isRelay
        ? 'RELAY'
        : peer.peerId === localPeerId
          ? 'LOCAL'
          : peer.inferred
            ? 'GHOST'
            : 'PEER ';
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
  logEvent('Connecting to relay...');
  connectStartedAt = Date.now();
  relayReachable = null;
  lastRelayPeerId = null;

  try {
    const cfg = await loadRelayConfig();
    const bootstrapPeers = normalizeBootstrapPeers(cfg.bootstrapPeers || []);
    relayPeerIds = new Set(
      bootstrapPeers
        .map((peer) => extractPeerId(peer))
        .concat(extractPeerId(cfg.relayPeerId))
        .filter(Boolean)
    );
    if (bootstrapPeers.length === 0) {
      logEvent('Relay config missing bootstrap peers.');
    } else {
      logEvent(`Relay config loaded (${bootstrapPeers.length} bootstrap peer(s)).`);
    }
    const webrtc = normalizeWebRTCConfig(cfg);
    const pubsubType = normalizePubsubType(cfg);
    const gossipsub = normalizeGossipsubConfig(cfg);
    const roomId = roomInput.value.trim() || 'telemetry';
    const maxConnections = Number.isFinite(cfg.maxConnections) ? cfg.maxConnections : 3;
    const maxDialPeers = Number.isFinite(cfg.maxDialPeers)
      ? cfg.maxDialPeers
      : maxConnections;

    node = new NodeKernel({
      bootstrapPeers,
      enablePersistence: false,
      enableWarmDeltaProvider: true,
      deltaNamespace: 'telemetry',
      gameId: 'netviz',
      roomId,
      presenceIntervalMs: 15000,
      maxConnections,
      maxDialPeers,
      onPublishError: handlePublishError,
      onPublishSuccess: handlePublishSuccess,
      ...(pubsubType ? { pubsubType } : {}),
      ...(gossipsub ? { gossipsub } : {}),
      ...(webrtc ? { webrtc } : {})
    });

    await node.initialize();
    await node.start();

    networkManager = node.getNetworkManager();
    stateManager = node.getStateManager();
    attachLibp2pLogging();
    networkManager.configureScheduler({ snapshotHz: SNAPSHOT_HZ, keepaliveMs: SNAPSHOT_KEEPALIVE_MS });
    networkManager.addSnapshotHandler(handleSnapshot);

    localPeerId = node.getStatus().network.peerId;
    logEvent(`Local peer ready (${formatPeerId(localPeerId)})`);
    startTelemetryLoop();
    updateHud();
  } catch (err) {
    console.error('NetViz connect failed', err);
    setStatus(`Status: error (${err?.message || err})`);
    logEvent(`Connect failed: ${err?.message || err}`);
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

consoleToggle?.addEventListener('click', () => {
  if (!consoleWindow) return;
  const next = consoleWindow.classList.contains('collapsed');
  setConsoleVisible(next);
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
