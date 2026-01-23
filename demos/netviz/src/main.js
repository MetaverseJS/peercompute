import { NodeKernel } from '@peercompute';
import { loadRelayConfig, normalizeBootstrapPeers } from './relayConfig.js';
import { TelemetryStore } from './telemetryStore.js';
import { NetworkVisualizer } from './visualizer.js';

const canvas = document.getElementById('netviz-canvas');
const statusEl = document.getElementById('status');
const peerListEl = document.getElementById('peer-list');
const connectBtn = document.getElementById('connect-btn');
const topologySelect = document.getElementById('topology-select');
const topologyIdInput = document.getElementById('topology-id');
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
const METRIC_SNAP = 0.25;
const MAX_SPIRAL_SEARCH = 200;
const METRIC_COLLISION_COOLDOWN_MS = 1500;
const QUERY_PARAM_ROOM = 'room';
const QUERY_PARAM_TOPOLOGY = 'topology';
const QUERY_PARAM_TOPOLOGY_TYPE = 'topologyType';
const QUERY_PARAM_RENDER = 'render';
const QUERY_PARAM_RENDER_MODE = 'renderMode';
const QUERY_PARAM_CONNECTION_RADIUS = 'connectionRadius';
const QUERY_PARAM_MAX_CONNECTIONS = 'maxConnections';
const QUERY_PARAM_TARGET_CONNECTIONS = 'targetConnections';
const QUERY_PARAM_DROP_RELAY = 'dropRelay';
const QUERY_PARAM_RELAY_RETENTION_MODE = 'relayRetentionMode';
const QUERY_PARAM_RELAY_RETENTION_MIN = 'relayRetentionMin';

const resolveRenderMode = () => {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(QUERY_PARAM_RENDER)
    || params.get(QUERY_PARAM_RENDER_MODE)
    || params.get('viz')
    || '';
  const value = String(raw || '').trim().toLowerCase();
  if (['off', 'none', 'false', '0'].includes(value)) return 'off';
  if (['low', 'lite', 'minimal'].includes(value)) return 'low';
  return 'full';
};

const renderMode = resolveRenderMode();
const visualizer = new NetworkVisualizer({ canvas, renderMode });
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
let relayConfig = null;
let lastConnectionPolicy = null;
const logEntries = [];
let topologyType = 'distributed';
let topologyId = 'netviz-topology';
let localMetric = { x: 0, y: 0, z: 0 };
let localMetricInitialized = false;
let dragActive = false;
let dragMoved = false;
let skipNextClick = false;
let lastPeerView = [];
let lastMetricRelocationAt = 0;

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

const formatFailureReason = (err) => {
  if (!err) return 'unknown';
  if (typeof err === 'string') return err;
  const code = err.code || err.name || '';
  const message = err.message || '';
  if (!code && !message) return String(err);
  if (code && message && !message.includes(code)) return `${code}: ${message}`;
  return message || code || String(err);
};

const formatLogTime = (value) => new Date(value).toLocaleTimeString();

const normalizeTopologyType = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'hierarchy' || raw === 'hierarchical') return 'hierarchical';
  if (raw === 'emergent') return 'emergent';
  return 'distributed';
};

const readTopologyInputs = () => {
  const selectedType = normalizeTopologyType(topologySelect?.value);
  const selectedId = topologyIdInput?.value?.trim() || 'netviz-topology';
  return { topologyType: selectedType, topologyId: selectedId };
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getDeviceScale = () => {
  const cores = Number.isFinite(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 4;
  const memory = Number.isFinite(navigator.deviceMemory) ? navigator.deviceMemory : 4;
  const coreScale = Math.max(1, Math.round(cores / 4));
  const memScale = Math.max(1, Math.round(memory / 4));
  return clamp(Math.max(coreScale, memScale), 1, 3);
};

const resolveConfigNumber = (value, fallback) => (
  Number.isFinite(value) ? value : fallback
);

const getConnectionLimits = ({ role, topology }) => {
  const scale = getDeviceScale();
  const cfg = relayConfig || {};
  if (topology === 'hierarchical') {
    if (role === 'host') {
      const maxConnections = resolveConfigNumber(
        cfg.hostMaxConnections,
        6 + scale * 2
      );
      const targetConnections = resolveConfigNumber(
        cfg.hostTargetConnections,
        Math.max(4, Math.floor(maxConnections * 0.75))
      );
      return { maxConnections, targetConnections };
    }
    const maxConnections = resolveConfigNumber(
      cfg.clientMaxConnections,
      4 + scale
    );
    const targetConnections = resolveConfigNumber(
      cfg.clientTargetConnections,
      Math.max(2, Math.min(maxConnections, 3))
    );
    return { maxConnections, targetConnections };
  }

  const maxConnections = resolveConfigNumber(cfg.maxConnections, 5);
  const targetConnections = resolveConfigNumber(cfg.targetConnections, Math.min(maxConnections, 4));
  return { maxConnections, targetConnections };
};

const syncHierarchicalConnectionPolicy = () => {
  if (!networkManager || !localPeerId) return;
  if (topologyType !== 'hierarchical') {
    networkManager.setPriorityPeers([]);
    return;
  }
  const localView = lastPeerView.find((peer) => peer.peerId === localPeerId);
  if (!localView) return;
  const role = localView.isHost ? 'host' : 'client';
  const limits = getConnectionLimits({ role, topology: topologyType });
  const priorityPeers = role === 'client'
    ? [localView.hostId, localView.backupHostId].filter(Boolean)
    : [];
  const priorityKey = priorityPeers.join('|');
  if (!lastConnectionPolicy
    || lastConnectionPolicy.maxConnections !== limits.maxConnections
    || lastConnectionPolicy.targetConnections !== limits.targetConnections
    || lastConnectionPolicy.priorityKey !== priorityKey) {
    networkManager.setConnectionLimits(limits);
    networkManager.setPriorityPeers(priorityPeers);
    lastConnectionPolicy = {
      maxConnections: limits.maxConnections,
      targetConnections: limits.targetConnections,
      priorityKey
    };
  }
};

const readQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const room = params.get(QUERY_PARAM_ROOM)?.trim() || '';
  const topologyId = params.get(QUERY_PARAM_TOPOLOGY)?.trim()
    || params.get('topologyId')?.trim()
    || '';
  const topologyType = params.get(QUERY_PARAM_TOPOLOGY_TYPE)?.trim() || '';
  return { room, topologyId, topologyType };
};

const applyQueryParams = () => {
  const query = readQueryParams();
  if (query.topologyType) {
    topologyType = normalizeTopologyType(query.topologyType);
    if (topologySelect) topologySelect.value = topologyType;
    visualizer.setTopologyMode(topologyType);
  }
  if (query.topologyId) {
    topologyId = query.topologyId;
    if (topologyIdInput) topologyIdInput.value = topologyId;
  }
  if (query.room && roomInput) {
    roomInput.value = query.room;
  }
  return query;
};

const syncQueryParams = ({ room, topologyId, topologyType: nextType }) => {
  const params = new URLSearchParams(window.location.search);
  if (room) params.set(QUERY_PARAM_ROOM, room);
  if (topologyId) params.set(QUERY_PARAM_TOPOLOGY, topologyId);
  if (nextType) params.set(QUERY_PARAM_TOPOLOGY_TYPE, nextType);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', nextUrl);
};

const formatMetric = (metric) => {
  if (!metric) return '--';
  const x = Number.isFinite(metric.x) ? metric.x.toFixed(2) : '0.00';
  const y = Number.isFinite(metric.y) ? metric.y.toFixed(2) : '0.00';
  const z = Number.isFinite(metric.z) ? metric.z.toFixed(2) : '0.00';
  return `${x}, ${y}, ${z}`;
};

const snapMetric = (metric) => {
  const snap = Number.isFinite(METRIC_SNAP) ? METRIC_SNAP : 1;
  const x = Number.isFinite(metric.x) ? Math.round(metric.x / snap) * snap : 0;
  const y = Number.isFinite(metric.y) ? Math.round(metric.y / snap) * snap : 0;
  const z = Number.isFinite(metric.z) ? Math.round(metric.z / snap) * snap : 0;
  return { x, y, z };
};

const getMetricKey = (metric) => {
  if (!metric) return null;
  const snapped = snapMetric(metric);
  return `${snapped.x}|${snapped.y}|${snapped.z}`;
};

const logEvent = (message) => {
  if (!eventLogEl) return;
  const line = `[${formatLogTime(Date.now())}] ${message}`;
  logEntries.push(line);
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries.splice(0, logEntries.length - MAX_LOG_ENTRIES);
  }
  eventLogEl.textContent = logEntries.join('\n');
};

if (renderMode !== 'full') {
  logEvent(`Render mode: ${renderMode === 'off' ? 'off (no draw)' : 'low-power'}.`);
}

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

const applyLocalMetric = (metric, { snap = true, notify = true, markInitialized = notify } = {}) => {
  if (!metric) return;
  const next = snap ? snapMetric(metric) : metric;
  localMetric = { x: next.x || 0, y: next.y || 0, z: next.z || 0 };
  visualizer.setLocalMetric(localMetric);
  if (markInitialized) {
    localMetricInitialized = true;
  }
  if (notify && networkManager?.setTopologyMetric) {
    networkManager.setTopologyMetric(localMetric);
    const snapshot = networkManager.getTelemetrySnapshot();
    telemetryStore.updateLocal(snapshot);
  }
};

const isZeroMetric = (metric) => {
  if (!metric) return true;
  return (metric.x || 0) === 0 && (metric.y || 0) === 0 && (metric.z || 0) === 0;
};

const findNextOpenMetric = (occupied) => {
  if (!localPeerId) return null;
  for (let attempt = 0; attempt < MAX_SPIRAL_SEARCH; attempt += 1) {
    const candidate = visualizer.getSpiralMetric(`${localPeerId}-reseed-${attempt}`);
    const key = getMetricKey(candidate);
    if (key && !occupied.has(key)) {
      return candidate;
    }
  }
  return null;
};

const resolveLocalMetricOverlap = (entries) => {
  if (!localPeerId || !Array.isArray(entries) || entries.length === 0) return;
  const local = telemetryStore.get(localPeerId);
  if (!local?.metric || local.metricInitialized !== true) return;
  const now = Date.now();
  if (now - lastMetricRelocationAt < METRIC_COLLISION_COOLDOWN_MS) return;
  const localKey = getMetricKey(local.metric);
  if (!localKey) return;
  const localJoined = Number.isFinite(local.joinedAt) ? local.joinedAt : (local.seenAt || 0);
  let collision = null;
  const occupied = new Set();

  entries.forEach((entry) => {
    if (!entry?.metric || entry.metricInitialized !== true) return;
    const key = getMetricKey(entry.metric);
    if (!key) return;
    occupied.add(key);
    if (entry.peerId === localPeerId) return;
    if (key !== localKey) return;
    const joinedAt = Number.isFinite(entry.joinedAt) ? entry.joinedAt : (entry.seenAt || 0);
    if (!collision || joinedAt < collision.joinedAt) {
      collision = { peerId: entry.peerId, joinedAt };
    }
  });

  if (!collision) return;
  if (Number.isFinite(localJoined) && Number.isFinite(collision.joinedAt) && localJoined <= collision.joinedAt) {
    return;
  }
  const nextMetric = findNextOpenMetric(occupied);
  if (!nextMetric) return;
  lastMetricRelocationAt = now;
  applyLocalMetric(nextMetric, { snap: true, notify: true });
  logEvent(`Metric overlap: moved to ${formatMetric(nextMetric)}`);
};

const seedLocalMetricIfNeeded = () => {
  if (localMetricInitialized) return;
  if (!localPeerId) return;
  if (!isZeroMetric(localMetric)) {
    localMetricInitialized = true;
    return;
  }
  const seeded = visualizer.getSpiralMetric(localPeerId);
  applyLocalMetric(seeded, { snap: true, notify: true });
  logEvent(`Metric seeded to ${formatMetric(seeded)}`);
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

const handleConnectionFailure = (failure = {}) => {
  const address = failure.address ? String(failure.address) : '';
  const peerId = failure.peerId || extractPeerId(address);
  const target = peerId ? formatPeerId(peerId) : 'peer';
  const stage = failure.stage === 'close'
    ? 'Connection closed'
    : failure.stage === 'dial'
      ? 'Dial failed'
      : 'Connection failed';
  const source = failure.source ? ` via ${failure.source}` : '';
  const reason = formatFailureReason(failure.error);
  const addressNote = address && (!peerId || !address.includes(peerId)) ? ` @ ${address}` : '';
  logEvent(`${stage}${source}: ${target}${addressNote} (${reason})`);
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
  const dropRelayBootstrapOnDirect =
    raw.dropRelayBootstrapOnDirect ?? cfg.dropRelayBootstrapOnDirect;
  const relayRetention = raw.relayRetention ?? cfg.relayRetention;
  const next = { ...raw };
  if (iceServers !== undefined && next.iceServers === undefined) next.iceServers = iceServers;
  if (rtcConfiguration !== undefined && next.rtcConfiguration === undefined) next.rtcConfiguration = rtcConfiguration;
  if (preferDirect !== undefined && next.preferDirect === undefined) next.preferDirect = preferDirect;
  if (dropRelayOnDirect !== undefined && next.dropRelayOnDirect === undefined) next.dropRelayOnDirect = dropRelayOnDirect;
  if (dropRelayBootstrapOnDirect !== undefined && next.dropRelayBootstrapOnDirect === undefined) {
    next.dropRelayBootstrapOnDirect = dropRelayBootstrapOnDirect;
  }
  if (relayRetention !== undefined && next.relayRetention === undefined) {
    next.relayRetention = relayRetention;
  }
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
{
  const initialTopology = readTopologyInputs();
  topologyType = initialTopology.topologyType;
  topologyId = initialTopology.topologyId;
  visualizer.setTopologyMode(topologyType);
}

const hashString = (value) => {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const readMetric = (peer) => {
  const metric = peer?.metric;
  if (!metric || typeof metric !== 'object') return null;
  const x = Number.isFinite(metric.x) ? metric.x : null;
  const y = Number.isFinite(metric.y) ? metric.y : null;
  const z = Number.isFinite(metric.z) ? metric.z : null;
  if (x === null && y === null && z === null) return null;
  return { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
};

const metricDistance = (a, b) => {
  const dx = (a?.x || 0) - (b?.x || 0);
  const dy = (a?.y || 0) - (b?.y || 0);
  const dz = (a?.z || 0) - (b?.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const scoreHostCandidate = (peer) => {
  const maxConnections = Number.isFinite(peer?.maxConnections) ? peer.maxConnections : 0;
  const targetConnections = Number.isFinite(peer?.targetConnections) ? peer.targetConnections : 0;
  const peerCount = Number.isFinite(peer?.peerCount)
    ? peer.peerCount
    : Array.isArray(peer?.peers)
      ? peer.peers.length
      : 0;
  return maxConnections * 2 + targetConnections + peerCount;
};

const assignHierarchyRoles = (peers, localId) => {
  const next = peers.map((peer) => ({ ...peer }));
  const nonRelay = next.filter((peer) => peer?.peerId && !peer.isRelay);
  if (nonRelay.length === 0) return next;
  const hostCount = Math.max(1, Math.ceil(nonRelay.length / 6));
  const candidates = nonRelay.slice();
  candidates.sort((a, b) => {
    const scoreDelta = scoreHostCandidate(b) - scoreHostCandidate(a);
    if (scoreDelta !== 0) return scoreDelta;
    return String(a.peerId).localeCompare(String(b.peerId));
  });
  const hosts = candidates.slice(0, hostCount);
  const hostIds = hosts.map((peer) => peer.peerId);
  const hostIdSet = new Set(hostIds);
  const hostMetrics = new Map(hosts.map((peer) => [peer.peerId, readMetric(peer)]));

  next.forEach((peer) => {
    if (!peer?.peerId) return;
    if (hostIdSet.has(peer.peerId)) {
      peer.role = 'host';
      peer.isHost = true;
      return;
    }
    peer.role = 'client';
    peer.isClient = true;
  });

  const hostAssignments = new Map();
  const backupAssignments = new Map();
  const hostCounts = new Map(hostIds.map((id) => [id, 0]));
  next.forEach((peer) => {
    if (!peer?.isClient || !peer.peerId || hostIds.length === 0) return;
    const metric = readMetric(peer);
    let assignedHost = null;
    let backupHost = null;
    if (metric) {
      let best = null;
      let second = null;
      hostIds.forEach((hostId) => {
        const hostMetric = hostMetrics.get(hostId);
        if (!hostMetric) return;
        const dist = metricDistance(metric, hostMetric);
        if (!best || dist < best.dist) {
          second = best;
          best = { hostId, dist };
          return;
        }
        if (!second || dist < second.dist) {
          second = { hostId, dist };
        }
      });
      assignedHost = best?.hostId || null;
      backupHost = second?.hostId || null;
    }
    if (!assignedHost) {
      const seedIndex = hashString(peer.peerId) % hostIds.length;
      assignedHost = hostIds[seedIndex];
      backupHost = hostIds[(seedIndex + 1) % hostIds.length] || null;
    }
    if (assignedHost) {
      hostAssignments.set(peer.peerId, assignedHost);
      hostCounts.set(assignedHost, (hostCounts.get(assignedHost) || 0) + 1);
    }
    if (backupHost && backupHost !== assignedHost) {
      backupAssignments.set(peer.peerId, backupHost);
    }
  });

  next.forEach((peer) => {
    if (!peer?.peerId) return;
    if (peer.isHost) {
      peer.clientCount = hostCounts.get(peer.peerId) || 0;
    }
    if (peer.isClient) {
      peer.hostId = hostAssignments.get(peer.peerId) || null;
      peer.backupHostId = backupAssignments.get(peer.peerId) || null;
    }
  });

  return next;
};

const buildPeerView = ({
  includeGhosts = true,
  relayState = null,
  topologyType: viewTopology = 'distributed',
  localId = null
} = {}) => {
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

  const relayIds = relayState?.relayIds || [];
  const activeRelayIds = relayState?.activeRelayIds || [];
  relayIds.forEach((relayId) => {
    const existing = byId.get(relayId);
    if (!existing) return;
    byId.set(relayId, { ...existing, isRelay: true, inferred: false });
  });
  activeRelayIds.forEach((relayId) => {
    const existing = byId.get(relayId);
    if (existing) {
      byId.set(relayId, { ...existing, isRelay: true, inferred: false });
    } else {
      byId.set(relayId, { peerId: relayId, isRelay: true });
    }
  });

  let list = Array.from(byId.values());
  if (viewTopology === 'hierarchical') {
    list = assignHierarchyRoles(list, localId);
  }
  return list;
};

const updateHierarchicalRelayPolicy = () => {
  if (!networkManager || topologyType !== 'hierarchical') return;
  if (relayConfig?.webrtc?.dropRelayBootstrapOnDirect === false) {
    networkManager.setRelayBootstrapBehavior({ keepRelay: true });
    return;
  }
  if (!localPeerId) return;
  const localView = lastPeerView.find((peer) => peer.peerId === localPeerId);
  const isHost = localView?.isHost || localView?.role === 'host';
  const connectedPeers = networkManager.getConnectedPeers();
  const hasNonRelay = connectedPeers.some((peer) => peer?.peerId && peer.via && peer.via !== 'relay');
  const hostId = localView?.hostId || null;
  const backupHostId = localView?.backupHostId || null;
  const hasHostDirect = hostId
    ? connectedPeers.some((peer) => peer?.peerId === hostId && peer.via && peer.via !== 'relay')
    : false;
  const hasBackupDirect = backupHostId
    ? connectedPeers.some((peer) => peer?.peerId === backupHostId && peer.via && peer.via !== 'relay')
    : true;
  const keepRelay = Boolean(
    isHost
    || localView?.isRelay
    || !hasNonRelay
    || !hasHostDirect
    || !hasBackupDirect
  );
  networkManager.setRelayBootstrapBehavior({ keepRelay });
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
  const role = isRelay
    ? 'relay'
    : data.role || (peerId === localPeerId ? 'local' : 'peer');
  const lines = [
    `Peer ID: ${peerId}`,
    `Role: ${role}`,
    `Topology: ${data.topologyId || '--'}`,
    `Room: ${data.roomId || '--'}`,
    `Shard: ${data.shardId || '--'}`,
    `Metric: ${formatMetric(data.metric)}`,
    `Connections: ${data.connections ?? peers.length}`,
    `Peers: ${data.peerCount ?? peers.length}`,
    `Rx: ${counts.rx ?? 0} (${formatBytes(counts.rxBytes)}) @ ${formatRate(rates.rxBps)}`,
    `Tx: ${counts.tx ?? 0} (${formatBytes(counts.txBytes)}) @ ${formatRate(rates.txBps)}`,
    `Avg RTT: ${formatMs(avgRtt)}`,
    `Last Rx: ${data.lastRxAt ? new Date(data.lastRxAt).toLocaleTimeString() : '--'}`,
    `Last Tx: ${data.lastTxAt ? new Date(data.lastTxAt).toLocaleTimeString() : '--'}`
  ];

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

const requestHostJoin = (peer) => {
  if (!peer?.peerId || !networkManager) return;
  if (peer.peerId === localPeerId) return;
  const targetRoom = peer.roomId || roomInput.value.trim() || 'telemetry';
  networkManager.sendToPeer(peer.peerId, {
    type: 'host-join-request',
    topologyId,
    roomId: targetRoom,
    clientPeerId: localPeerId
  }).catch(() => {});
  logEvent(`Join request sent to host ${formatPeerId(peer.peerId)}`);
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
  const entries = telemetryStore.list();
  resolveLocalMetricOverlap(entries);
  const refreshedEntries = telemetryStore.list();
  const relayState = buildRelayState(refreshedEntries, relayPeerIds);
  const peers = buildPeerView({
    includeGhosts: !shouldHideGhosts(),
    relayState,
    topologyType,
    localId: localPeerId
  });
  lastPeerView = peers;
  syncHierarchicalConnectionPolicy();
  updateHierarchicalRelayPolicy();
  const edges = buildEdges(peers, localPeerId, relayState);
  const pubsubEdges = buildPubsubEdges(peers, relayState);
  visualizer.updatePeers(peers, localPeerId, edges, pubsubEdges);

  const local = localPeerId ? telemetryStore.get(localPeerId) : null;
  if (local) {
    if (local.metric) {
      localMetric = {
        x: Number.isFinite(local.metric.x) ? local.metric.x : 0,
        y: Number.isFinite(local.metric.y) ? local.metric.y : 0,
        z: Number.isFinite(local.metric.z) ? local.metric.z : 0
      };
      visualizer.setLocalMetric(localMetric);
    }
    if (local.metricInitialized) {
      localMetricInitialized = true;
    }
    setStatus([
      `Status: connected (${formatPeerId(local.peerId)})`,
      `Topology: ${topologyType} (${topologyId})`,
      `Peers: ${local.peerCount ?? peers.length - 1}`,
      `Rx: ${local.counts?.rx ?? 0} (${formatBytes(local.counts?.rxBytes)})`,
      `Rx rate: ${formatRate(local.rates?.rxBps)}`,
      `Tx: ${local.counts?.tx ?? 0} (${formatBytes(local.counts?.txBytes)})`,
      `Tx rate: ${formatRate(local.rates?.txBps)}`,
      `Pubsub: ${local.pubsubPeerCount ?? 0}`,
      `Metric: ${formatMetric(local.metric)}`
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
    relayConfig = cfg;
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
    const urlParams = new URLSearchParams(window.location.search);
    const urlDropRelay = urlParams.get(QUERY_PARAM_DROP_RELAY);
    const urlRetentionMode = urlParams.get(QUERY_PARAM_RELAY_RETENTION_MODE);
    const urlRetentionMin = parseInt(urlParams.get(QUERY_PARAM_RELAY_RETENTION_MIN), 10);
    const urlMaxConnections = parseInt(urlParams.get(QUERY_PARAM_MAX_CONNECTIONS), 10);
    const urlTargetConnections = parseInt(urlParams.get(QUERY_PARAM_TARGET_CONNECTIONS), 10);
    const webrtcOverrides = {};
    if (urlDropRelay === 'true' || urlDropRelay === '1') {
      webrtcOverrides.dropRelayBootstrapOnDirect = true;
    }
    if (urlRetentionMode && ['sqrt', 'logn'].includes(urlRetentionMode)) {
      const retentionMin = Number.isFinite(urlRetentionMin) ? urlRetentionMin : 2;
      webrtcOverrides.relayRetention = { mode: urlRetentionMode, min: retentionMin, max: 10 };
    }
    const webrtcBase = normalizeWebRTCConfig(cfg) || {};
    const webrtc = Object.keys(webrtcOverrides).length
      ? { ...webrtcBase, ...webrtcOverrides }
      : (Object.keys(webrtcBase).length ? webrtcBase : null);
    if (webrtcOverrides.dropRelayBootstrapOnDirect || webrtcOverrides.relayRetention) {
      console.log('[NetViz] Relay drop config:', JSON.stringify(webrtc));
    }
    const pubsubType = normalizePubsubType(cfg) || 'gossipsub';
    const gossipsub = normalizeGossipsubConfig(cfg);
    const topologySelection = readTopologyInputs();
    topologyType = topologySelection.topologyType;
    topologyId = topologySelection.topologyId;
    visualizer.setTopologyMode(topologyType);
    const roomId = roomInput.value.trim() || 'telemetry';
    const maxConnections = Number.isFinite(urlMaxConnections)
      ? urlMaxConnections
      : Number.isFinite(cfg.maxConnections)
        ? cfg.maxConnections
        : 5;
    const targetConnections = Number.isFinite(urlTargetConnections)
      ? urlTargetConnections
      : Number.isFinite(cfg.targetConnections)
        ? cfg.targetConnections
        : maxConnections;
    const urlConnectionRadius = parseFloat(urlParams.get(QUERY_PARAM_CONNECTION_RADIUS));
    const connectionRadius = Number.isFinite(urlConnectionRadius)
      ? urlConnectionRadius
      : Number.isFinite(cfg.connectionRadius)
        ? cfg.connectionRadius
        : 1.2;
    const isolationMinConnections = Number.isFinite(cfg.isolationMinConnections)
      ? cfg.isolationMinConnections
      : 2;
    const longRangeCount = Number.isFinite(cfg.longRangeCount)
      ? cfg.longRangeCount
      : Math.min(1, Math.max(0, targetConnections - 1));
    const maxDialPeers = Number.isFinite(cfg.maxDialPeers)
      ? cfg.maxDialPeers
      : Math.max(maxConnections, targetConnections * 2);
    localMetric = snapMetric(localMetric);
    visualizer.setConnectionRadius(connectionRadius);

    node = new NodeKernel({
      topology: topologyType,
      topologyId,
      topicPrefix: 'pc',
      useScopedTopics: true,
      enableTopologyController: true,
      enforceTopologyScope: true,
      allowDiscoveryDialWhenIsolated: true,
      topologyMetric: localMetric,
      topologyMetricInitialized: false,
      targetConnections,
      connectionRadius,
      isolationMinConnections,
      longRangeCount,
      bootstrapPeers,
      enablePersistence: false,
      disableStateNetworkProvider: true,
      disableStateBroadcast: true,
      enableWarmDeltaProvider: true,
      deltaNamespace: 'telemetry',
      gameId: 'netviz',
      roomId,
      presenceIntervalMs: 15000,
      maxConnections,
      maxDialPeers,
      onPublishError: handlePublishError,
      onPublishSuccess: handlePublishSuccess,
      onConnectionFailure: handleConnectionFailure,
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
    seedLocalMetricIfNeeded();
    logEvent(`Local peer ready (${formatPeerId(localPeerId)})`);
    logEvent(`Topology set to ${topologyType} (${topologyId})`);
    if (topologySelect) topologySelect.disabled = true;
    if (topologyIdInput) topologyIdInput.disabled = true;
    if (roomInput) roomInput.disabled = true;
    syncQueryParams({ room: roomId, topologyId, topologyType });
    startTelemetryLoop();
    updateHud();
  } catch (err) {
    console.error('NetViz connect failed', err);
    setStatus(`Status: error (${err?.message || err})`);
    logEvent(`Connect failed: ${err?.message || err}`);
    connectBtn.disabled = false;
  }
};

const attachDebugHandles = () => {
  if (typeof window === 'undefined') return;
  window.__NETVIZ__ = {
    getStatus: () => ({
      localPeerId,
      topologyType,
      topologyId,
      roomId: roomInput?.value?.trim() || null,
      relayPeerIds: Array.from(relayPeerIds),
      relayReachable,
      telemetry: networkManager?.getTelemetrySnapshot?.() || null,
      peers: telemetryStore.list(),
      relayRetentionDebug: networkManager ? {
        dropRelayBootstrapOnDirect: networkManager.config?.webrtc?.dropRelayBootstrapOnDirect,
        relayRetention: networkManager.config?.webrtc?.relayRetention,
        hasBootstrapRelayConnections: networkManager._hasBootstrapRelayConnections?.(),
        hasDirectPeerConnections: networkManager._hasDirectPeerConnections?.(),
        shouldKeepRelay: networkManager._shouldKeepRelayBootstrapConnection?.()
      } : null
    }),
    connect: () => connect()
  };
};

attachDebugHandles();

connectBtn.addEventListener('click', () => {
  connect().catch(() => {});
});

const handlePick = (event) => {
  if (skipNextClick) {
    skipNextClick = false;
    return;
  }
  const hit = visualizer.pick(event.clientX, event.clientY);
  if (!hit) {
    hideInspector();
    return;
  }
  if (hit.type === 'node') {
    const info = buildNodeInfo(hit.peerId);
    showInspector(info.title, info.lines);
    if (topologyType === 'hierarchical') {
      const peer = lastPeerView.find((entry) => entry.peerId === hit.peerId);
      if (peer?.isHost) {
        requestHostJoin(peer);
      }
    }
    return;
  }
  if (hit.type === 'edge') {
    const info = buildEdgeInfo(hit.from, hit.to);
    showInspector(info.title, info.lines);
  }
};

const setDragActive = (next) => {
  dragActive = next;
  visualizer.setControlsEnabled(!next);
};

const handlePointerDown = (event) => {
  if (topologyType !== 'distributed') return;
  if (!localPeerId) return;
  const hit = visualizer.pick(event.clientX, event.clientY);
  if (!hit || hit.type !== 'node' || hit.peerId !== localPeerId) return;
  dragMoved = false;
  setDragActive(true);
  event.preventDefault();
  event.stopPropagation();
};

const handlePointerMove = (event) => {
  if (!dragActive) return;
  const point = visualizer.projectToGround(event.clientX, event.clientY, visualizer.gridHeight);
  if (!point) return;
  const metric = visualizer.worldToMetric(point);
  applyLocalMetric(metric, { snap: true, notify: true });
  dragMoved = true;
};

const handlePointerUp = () => {
  if (!dragActive) return;
  setDragActive(false);
  if (dragMoved) {
    skipNextClick = true;
  }
};

canvas.addEventListener('click', handlePick);
canvas.addEventListener('pointerdown', handlePointerDown);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);

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

topologySelect?.addEventListener('change', () => {
  topologyType = normalizeTopologyType(topologySelect.value);
  visualizer.setTopologyMode(topologyType);
  updateHud();
});

topologyIdInput?.addEventListener('input', () => {
  topologyId = topologyIdInput.value.trim() || 'netviz-topology';
  updateHud();
});

roomInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    connect().catch(() => {});
  }
});

const queryParams = applyQueryParams();
if (queryParams.room && queryParams.topologyId) {
  connect().catch(() => {});
}

topologyIdInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    connect().catch(() => {});
  }
});

window.addEventListener('beforeunload', () => {
  if (telemetryTimer) clearInterval(telemetryTimer);
  if (uiTimer) clearInterval(uiTimer);
});

updateHud();
