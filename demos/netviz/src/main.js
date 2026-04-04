import { NodeKernel } from '@peercompute';
import { loadRelayConfig, normalizeBootstrapPeers } from './relayConfig.js';
import { buildPubsubEdges, buildRelayState } from './relayOverlay.js';
import { TelemetryStore } from './telemetryStore.js';
import { NetworkVisualizer } from './visualizer.js';

const canvas = document.getElementById('netviz-canvas');
const statusEl = document.getElementById('status');
const peerListEl = document.getElementById('peer-list');
const connectBtn = document.getElementById('connect-btn');
const topologySelect = document.getElementById('topology-select');
const topologyIdInput = document.getElementById('topology-id');
const roomInput = document.getElementById('room-input');
const attachSessionSelect = document.getElementById('attach-session-select');
const attachSessionBtn = document.getElementById('attach-session-btn');
const renderModeSelect = document.getElementById('render-mode');
const connectionRadiusInput = document.getElementById('connection-radius');
const maxConnectionsInput = document.getElementById('max-connections');
const targetConnectionsInput = document.getElementById('target-connections');
const dropRelayToggle = document.getElementById('drop-relay');
const relayRetentionModeSelect = document.getElementById('relay-retention-mode');
const relayRetentionMinInput = document.getElementById('relay-retention-min');
const showP2PTopologyToggle = document.getElementById('show-p2p-topology');
const showIPTopologyToggle = document.getElementById('show-ip-topology');
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
const chaosStatusEl = document.getElementById('chaos-status');

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
const QUERY_PARAM_CHAOS_API = 'chaosApi';
const QUERY_PARAM_SHOW_P2P = 'showP2P';
const QUERY_PARAM_SHOW_IP = 'showIP';
const QUERY_PARAM_AUTO_CONNECT = 'autoConnect';
const QUERY_PARAM_ATTACH_SESSION = 'attachSession';
const CHAOS_POLL_MS = 2000;
const CHAOS_NODE_PREFIX = 'chaos:';
const NETVIZ_DEBUG_CHANNEL = 'peercompute-netviz-debug-v1';
const ATTACH_SESSION_STALE_MS = 12000;
const RTC_DIAGNOSTICS_INTERVAL_MS = 2000;
const RTC_DIRECT_CANDIDATE_TYPES = new Set(['host', 'srflx', 'prflx']);
const RTC_ACTIVE_PAIR_STATES = new Set(['succeeded', 'in-progress']);
const RTC_TRACKED_METHOD_FLAG = '__netvizRtcMethodWrapped__';
const CONNECTION_STATE = Object.freeze({
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnecting'
});

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

const normalizeRenderModeValue = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (['off', 'none', 'false', '0'].includes(raw)) return 'off';
  if (['low', 'lite', 'minimal'].includes(raw)) return 'low';
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
let debugLogTimer = null;
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
let connectionState = CONNECTION_STATE.DISCONNECTED;
let chaosApiBase = '';
let chaosPollTimer = null;
let chaosFetchInFlight = false;
let lastChaosStageKey = '';
let chaosFeed = {
  summary: null,
  topology: null,
  events: [],
  latestEvent: null,
  healthy: false,
  error: null
};
let lastDisplayedPeersById = new Map();
let lastDisplayedEdgesByKey = new Map();
let lastP2PPeersById = new Map();
let lastP2PEdgesByKey = new Map();
let lastChaosOverlay = {
  peers: [],
  edges: [],
  peerInfo: new Map(),
  edgeInfo: new Map(),
  topology: null
};
const attachSessions = new Map();
let attachSessionChannel = null;
let pendingAttachSessionId = null;
let rtcDiagnosticsTimer = null;
let rtcDiagnosticsInFlight = false;
let rtcPathState = {
  updatedAt: 0,
  peerConnectionCount: 0,
  pairCount: 0,
  hasDirectPair: false,
  hasRelayPair: false,
  localCandidateTypes: {},
  remoteCandidateTypes: {},
  selectedPairStates: {}
};

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

const formatPct = (value) => {
  const rate = Number(value);
  if (!Number.isFinite(rate)) return '--';
  return `${(rate * 100).toFixed(1)}%`;
};

const formatMs = (value) => {
  if (!Number.isFinite(value)) return '--';
  return `${Math.round(value)}ms`;
};

const buildEdgeKey = (from, to) => (
  String(from) < String(to) ? `${from}|${to}` : `${to}|${from}`
);

const extractMultiaddrProtocolValue = (addr, protocol) => {
  if (!addr) return null;
  const match = String(addr).match(new RegExp(`/${protocol}/([^/]+)`));
  return match ? match[1] : null;
};

const isPrivateIpv4 = (value) => {
  const ip = String(value || '').trim();
  if (!ip) return false;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (ip.startsWith('127.')) return true;
  return false;
};

const isPrivateIpv6 = (value) => {
  const ip = String(value || '').trim().toLowerCase();
  if (!ip) return false;
  if (ip.startsWith('fc') || ip.startsWith('fd')) return true;
  if (ip.startsWith('fe80:')) return true;
  if (ip === '::1') return true;
  return false;
};

const classifyConnectionKind = (remoteAddr) => {
  const addr = String(remoteAddr || '');
  const hasRelay = addr.includes('/p2p-circuit');
  const hasWebrtc = addr.includes('/webrtc');
  if (hasWebrtc && hasRelay) return 'relay-webrtc';
  if (hasWebrtc) return 'webrtc-direct';
  if (hasRelay) return 'relay';
  if (addr.includes('/wss') || addr.includes('/ws')) return 'direct-websocket';
  return 'direct';
};

const normalizeTransportVia = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'webrtc' || raw === 'webrtc-direct') return 'webrtc';
  if (raw === 'relay-webrtc' || raw === 'webrtc-relay') return 'relay-webrtc';
  if (raw === 'relay') return 'relay';
  if (raw === 'direct' || raw === 'direct-websocket') return 'direct';
  if (raw === 'presence' || raw === 'connection') return null;
  return raw;
};

const signalingPathFromVia = (value) => {
  const via = normalizeTransportVia(value);
  if (!via) return null;
  if (via === 'webrtc' || via === 'direct') return 'direct';
  if (via === 'relay' || via === 'relay-webrtc') return 'relay-scoped';
  return null;
};

const normalizeSignalingPath = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'direct') return 'direct';
  if (raw === 'relay-scoped') return 'relay-scoped';
  return null;
};

const mediaPathFromVia = (value) => {
  const via = normalizeTransportVia(value);
  if (!via) return null;
  if (via === 'webrtc' || via === 'direct') return 'direct';
  if (via === 'relay') return 'turn-relay';
  if (via === 'relay-webrtc') return 'unknown';
  return null;
};

const normalizeMediaPath = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'direct') return 'direct';
  if (raw === 'turn-relay' || raw === 'relay') return 'turn-relay';
  if (raw === 'unknown') return 'unknown';
  return null;
};

const isDirectTransportVia = (value) => {
  const via = normalizeTransportVia(value);
  return via === 'webrtc' || via === 'direct';
};

const isRelayedTransportVia = (value) => {
  const via = normalizeTransportVia(value);
  return via === 'relay' || via === 'relay-webrtc';
};

const isDirectMediaPath = (value) => normalizeMediaPath(value) === 'direct';

const getViaPriority = (value) => {
  const via = normalizeTransportVia(value);
  if (via === 'webrtc') return 4;
  if (via === 'direct') return 3;
  if (via === 'relay-webrtc') return 2;
  if (via === 'relay') return 1;
  return 0;
};

const preferStrongerVia = (current, next) => {
  const currentVia = normalizeTransportVia(current);
  const nextVia = normalizeTransportVia(next);
  if (!nextVia) return currentVia;
  if (!currentVia) return nextVia;
  return getViaPriority(nextVia) > getViaPriority(currentVia) ? nextVia : currentVia;
};

const getSignalingPathPriority = (value) => {
  const signalingPath = normalizeSignalingPath(value);
  if (signalingPath === 'direct') return 2;
  if (signalingPath === 'relay-scoped') return 1;
  return 0;
};

const preferStrongerSignalingPath = (current, next) => {
  const currentPath = normalizeSignalingPath(current);
  const nextPath = normalizeSignalingPath(next);
  if (!nextPath) return currentPath;
  if (!currentPath) return nextPath;
  return getSignalingPathPriority(nextPath) > getSignalingPathPriority(currentPath)
    ? nextPath
    : currentPath;
};

const getMediaPathPriority = (value) => {
  const mediaPath = normalizeMediaPath(value);
  if (mediaPath === 'direct') return 3;
  if (mediaPath === 'turn-relay') return 2;
  if (mediaPath === 'unknown') return 1;
  return 0;
};

const preferStrongerMediaPath = (current, next) => {
  const currentPath = normalizeMediaPath(current);
  const nextPath = normalizeMediaPath(next);
  if (!nextPath) return currentPath;
  if (!currentPath) return nextPath;
  return getMediaPathPriority(nextPath) > getMediaPathPriority(currentPath)
    ? nextPath
    : currentPath;
};

const normalizeRtcType = (value) => String(value || '').trim().toLowerCase();

const incrementCount = (target, key) => {
  const normalized = normalizeRtcType(key) || 'unknown';
  target[normalized] = Number(target[normalized] || 0) + 1;
};

const toPlainRtcCandidate = (candidate) => {
  if (!candidate) return null;
  return {
    id: candidate.id || null,
    type: candidate.candidateType || null,
    protocol: candidate.protocol || null,
    address: candidate.address || null,
    port: candidate.port || null
  };
};

const ensureRtcDiagnosticsTracker = () => {
  if (typeof window === 'undefined') return;
  if (window.__NETVIZ_RTC_TRACKER__?.collect) return;
  const NativePc = window.RTCPeerConnection || globalThis.RTCPeerConnection;
  if (!NativePc) return;

  const tracked = new Set();
  const markTracked = (pc) => {
    if (pc && typeof pc.getStats === 'function') tracked.add(pc);
  };
  const patchPrototypeMethod = (proto, methodName) => {
    const original = proto?.[methodName];
    if (typeof original !== 'function') return;
    if (original[RTC_TRACKED_METHOD_FLAG]) return;
    const wrapped = function wrappedRtcMethod(...args) {
      markTracked(this);
      return original.apply(this, args);
    };
    Object.defineProperty(wrapped, RTC_TRACKED_METHOD_FLAG, {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });
    proto[methodName] = wrapped;
  };

  const proto = NativePc.prototype;
  [
    'createOffer',
    'createAnswer',
    'setLocalDescription',
    'setRemoteDescription',
    'addIceCandidate',
    'addTrack',
    'createDataChannel',
    'getStats'
  ].forEach((methodName) => patchPrototypeMethod(proto, methodName));
  const closeOriginal = proto?.close;
  if (typeof closeOriginal === 'function' && !closeOriginal[RTC_TRACKED_METHOD_FLAG]) {
    const wrappedClose = function wrappedRtcClose(...args) {
      tracked.delete(this);
      return closeOriginal.apply(this, args);
    };
    Object.defineProperty(wrappedClose, RTC_TRACKED_METHOD_FLAG, {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });
    proto.close = wrappedClose;
  }

  class TrackedPc extends NativePc {
    constructor(...args) {
      super(...args);
      markTracked(this);
    }
  }

  if (window.RTCPeerConnection === NativePc) {
    window.RTCPeerConnection = TrackedPc;
  }
  if (typeof globalThis !== 'undefined' && globalThis.RTCPeerConnection === NativePc) {
    globalThis.RTCPeerConnection = TrackedPc;
  }

  window.__NETVIZ_RTC_TRACKER__ = {
    async collect() {
      const pairs = [];
      for (const pc of Array.from(tracked)) {
        if (!pc || pc.signalingState === 'closed' || pc.connectionState === 'closed') {
          tracked.delete(pc);
          continue;
        }
        let selectedPair = null;
        let localCandidate = null;
        let remoteCandidate = null;
        try {
          const stats = await pc.getStats();
          for (const report of stats.values()) {
            if (report.type === 'transport' && report.selectedCandidatePairId) {
              selectedPair = stats.get(report.selectedCandidatePairId) || null;
              break;
            }
          }
          if (!selectedPair) {
            for (const report of stats.values()) {
              if (report.type === 'candidate-pair' && report.nominated && report.state === 'succeeded') {
                selectedPair = report;
                break;
              }
            }
          }
          if (selectedPair) {
            localCandidate = stats.get(selectedPair.localCandidateId) || null;
            remoteCandidate = stats.get(selectedPair.remoteCandidateId) || null;
          }
        } catch (_) {
          // Ignore transient getStats failures from closing peer connections.
        }
        pairs.push({
          selectedPairState: selectedPair?.state || null,
          localCandidate: toPlainRtcCandidate(localCandidate),
          remoteCandidate: toPlainRtcCandidate(remoteCandidate),
          bytesSent: Number.isFinite(selectedPair?.bytesSent) ? selectedPair.bytesSent : 0,
          bytesReceived: Number.isFinite(selectedPair?.bytesReceived) ? selectedPair.bytesReceived : 0
        });
      }
      return pairs;
    }
  };
};

const summarizeRtcPairs = (pairs = []) => {
  const localCandidateTypes = {};
  const remoteCandidateTypes = {};
  const selectedPairStates = {};
  let hasDirectPair = false;
  let hasRelayPair = false;

  pairs.forEach((pair) => {
    const state = normalizeRtcType(pair?.selectedPairState);
    const localType = normalizeRtcType(pair?.localCandidate?.type);
    const remoteType = normalizeRtcType(pair?.remoteCandidate?.type);
    const bytesSent = Number(pair?.bytesSent || 0);
    const bytesReceived = Number(pair?.bytesReceived || 0);

    incrementCount(localCandidateTypes, localType || 'unknown');
    incrementCount(remoteCandidateTypes, remoteType || 'unknown');
    incrementCount(selectedPairStates, state || 'none');

    if (localType === 'relay' || remoteType === 'relay') {
      hasRelayPair = true;
    }

    if (state && !RTC_ACTIVE_PAIR_STATES.has(state)) return;
    if (!(state === 'succeeded' || bytesSent > 0 || bytesReceived > 0)) return;
    if (!RTC_DIRECT_CANDIDATE_TYPES.has(localType)) return;
    if (!RTC_DIRECT_CANDIDATE_TYPES.has(remoteType)) return;
    hasDirectPair = true;
  });

  return {
    updatedAt: Date.now(),
    pairCount: pairs.length,
    hasDirectPair,
    hasRelayPair,
    localCandidateTypes,
    remoteCandidateTypes,
    selectedPairStates
  };
};

const updateRtcPathState = async () => {
  if (rtcDiagnosticsInFlight) return;
  if (typeof window === 'undefined') return;
  const collect = window.__NETVIZ_RTC_TRACKER__?.collect;
  if (typeof collect !== 'function') return;
  rtcDiagnosticsInFlight = true;
  try {
    const pairs = await collect();
    const summary = summarizeRtcPairs(Array.isArray(pairs) ? pairs : []);
    rtcPathState = {
      ...rtcPathState,
      ...summary,
      peerConnectionCount: Array.isArray(pairs) ? pairs.length : 0
    };
  } catch (_) {
    // Ignore diagnostics read errors to keep rendering loop stable.
  } finally {
    rtcDiagnosticsInFlight = false;
  }
};

const startRtcDiagnosticsLoop = () => {
  ensureRtcDiagnosticsTracker();
  if (rtcDiagnosticsTimer) return;
  updateRtcPathState().catch(() => {});
  rtcDiagnosticsTimer = setInterval(() => {
    updateRtcPathState().catch(() => {});
  }, RTC_DIAGNOSTICS_INTERVAL_MS);
};

const stopRtcDiagnosticsLoop = () => {
  if (rtcDiagnosticsTimer) {
    clearInterval(rtcDiagnosticsTimer);
    rtcDiagnosticsTimer = null;
  }
  rtcDiagnosticsInFlight = false;
  rtcPathState = {
    updatedAt: 0,
    peerConnectionCount: 0,
    pairCount: 0,
    hasDirectPair: false,
    hasRelayPair: false,
    localCandidateTypes: {},
    remoteCandidateTypes: {},
    selectedPairStates: {}
  };
};

const summarizeConnectionKinds = (connections = []) => {
  if (!Array.isArray(connections) || connections.length === 0) return 'none';
  const counts = connections.reduce((acc, conn) => {
    const key = conn?.kind || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([kind, count]) => `${kind}(${count})`)
    .join(', ');
};

const uniqueList = (values = []) => (
  Array.from(new Set(values.filter((value) => Boolean(value))))
);

const getLibp2pConnections = () => {
  const libp2p = networkManager?.getLibp2pNode?.();
  if (!libp2p?.getConnections) return [];
  const raw = libp2p.getConnections();
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw.values === 'function') {
    return Array.from(raw.values()).flat();
  }
  return [];
};

const getConnectionAddressSnapshot = () => {
  const byPeer = new Map();
  const all = [];
  const connections = getLibp2pConnections();
  connections.forEach((conn) => {
    const peerId = conn?.remotePeer?.toString?.() || null;
    if (!peerId) return;
    const remoteAddr = conn?.remoteAddr?.toString?.() || '';
    const kind = classifyConnectionKind(remoteAddr);
    const detail = {
      peerId,
      status: conn?.status || null,
      remoteAddr,
      kind,
      ip4: extractMultiaddrProtocolValue(remoteAddr, 'ip4'),
      ip6: extractMultiaddrProtocolValue(remoteAddr, 'ip6')
    };
    all.push(detail);
    if (!byPeer.has(peerId)) byPeer.set(peerId, []);
    byPeer.get(peerId).push(detail);
  });
  const localAddrs = networkManager?.getLibp2pNode?.()?.getMultiaddrs?.()
    ?.map((addr) => addr.toString?.() || String(addr))
    ?.filter(Boolean) || [];
  return { byPeer, all, localAddrs, rtcPath: rtcPathState };
};

const guessNatStatus = (connections = []) => {
  if (!Array.isArray(connections) || connections.length === 0) return 'unknown';
  const hasDirectWebrtc = connections.some((conn) => conn?.kind === 'webrtc-direct');
  const hasRelayOnly = connections.every((conn) => ['relay', 'relay-webrtc'].includes(conn?.kind));
  if (hasDirectWebrtc || rtcPathState.hasDirectPair) return 'direct-capable';
  if (hasRelayOnly) return 'relay-dependent';
  return 'mixed/unknown';
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

const parseNumberValue = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseIntValue = (value) => {
  const num = Number.parseInt(String(value), 10);
  return Number.isFinite(num) ? num : null;
};

const parseBooleanParam = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;
  if (['1', 'true', 'yes', 'on'].includes(raw)) return true;
  if (['0', 'false', 'no', 'off'].includes(raw)) return false;
  return null;
};

const normalizeRetentionMode = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'logn' || raw === 'log(n)') return 'logn';
  if (raw === 'sqrt') return 'sqrt';
  return '';
};

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
  const renderModeValue = params.get(QUERY_PARAM_RENDER)
    || params.get(QUERY_PARAM_RENDER_MODE)
    || '';
  const connectionRadius = params.get(QUERY_PARAM_CONNECTION_RADIUS) || '';
  const maxConnections = params.get(QUERY_PARAM_MAX_CONNECTIONS) || '';
  const targetConnections = params.get(QUERY_PARAM_TARGET_CONNECTIONS) || '';
  const dropRelay = params.get(QUERY_PARAM_DROP_RELAY) || '';
  const relayRetentionMode = params.get(QUERY_PARAM_RELAY_RETENTION_MODE) || '';
  const relayRetentionMin = params.get(QUERY_PARAM_RELAY_RETENTION_MIN) || '';
  const chaosApi = params.get(QUERY_PARAM_CHAOS_API) || '';
  const showP2P = params.get(QUERY_PARAM_SHOW_P2P) || '';
  const showIP = params.get(QUERY_PARAM_SHOW_IP) || '';
  const autoConnect = params.get(QUERY_PARAM_AUTO_CONNECT) || '';
  const attachSession = params.get(QUERY_PARAM_ATTACH_SESSION) || '';
  return {
    room,
    topologyId,
    topologyType,
    renderMode: renderModeValue,
    connectionRadius,
    maxConnections,
    targetConnections,
    dropRelay,
    relayRetentionMode,
    relayRetentionMin,
    chaosApi,
    showP2P,
    showIP,
    autoConnect,
    attachSession
  };
};

const resolveChaosApiBase = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const parsed = new URL(raw, window.location.origin);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    const pathname = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${pathname}`;
  } catch (_) {
    return '';
  }
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
  const normalizedRender = normalizeRenderModeValue(query.renderMode) || renderMode;
  if (renderModeSelect && normalizedRender) {
    renderModeSelect.value = normalizedRender;
  }
  if (connectionRadiusInput && query.connectionRadius) {
    connectionRadiusInput.value = query.connectionRadius;
  }
  if (maxConnectionsInput && query.maxConnections) {
    maxConnectionsInput.value = query.maxConnections;
  }
  if (targetConnectionsInput && query.targetConnections) {
    targetConnectionsInput.value = query.targetConnections;
  }
  if (dropRelayToggle) {
    dropRelayToggle.checked = query.dropRelay === 'true' || query.dropRelay === '1';
  }
  if (relayRetentionModeSelect) {
    relayRetentionModeSelect.value = normalizeRetentionMode(query.relayRetentionMode);
  }
  if (relayRetentionMinInput && query.relayRetentionMin) {
    relayRetentionMinInput.value = query.relayRetentionMin;
  }
  if (showP2PTopologyToggle) {
    const parsed = parseBooleanParam(query.showP2P);
    if (parsed !== null) {
      showP2PTopologyToggle.checked = parsed;
    }
  }
  if (showIPTopologyToggle) {
    const parsed = parseBooleanParam(query.showIP);
    if (parsed !== null) {
      showIPTopologyToggle.checked = parsed;
    }
  }
  pendingAttachSessionId = query.attachSession || null;
  chaosApiBase = resolveChaosApiBase(query.chaosApi);
  return query;
};

const syncQueryParams = ({
  room,
  topologyId,
  topologyType: nextType,
  renderMode: nextRender,
  connectionRadius,
  maxConnections,
  targetConnections,
  dropRelay,
  relayRetentionMode,
  relayRetentionMin,
  showP2P,
  showIP
} = {}) => {
  const params = new URLSearchParams(window.location.search);
  const setParam = (key, value) => {
    if (value === null || value === undefined || value === '') {
      params.delete(key);
      return;
    }
    params.set(key, String(value));
  };
  setParam(QUERY_PARAM_ROOM, room);
  setParam(QUERY_PARAM_TOPOLOGY, topologyId);
  setParam(QUERY_PARAM_TOPOLOGY_TYPE, nextType);
  setParam(QUERY_PARAM_RENDER, nextRender);
  setParam(QUERY_PARAM_CONNECTION_RADIUS, connectionRadius);
  setParam(QUERY_PARAM_MAX_CONNECTIONS, maxConnections);
  setParam(QUERY_PARAM_TARGET_CONNECTIONS, targetConnections);
  if (dropRelay) {
    params.set(QUERY_PARAM_DROP_RELAY, 'true');
  } else {
    params.delete(QUERY_PARAM_DROP_RELAY);
  }
  if (showP2P === false) {
    params.set(QUERY_PARAM_SHOW_P2P, '0');
  } else {
    params.delete(QUERY_PARAM_SHOW_P2P);
  }
  if (showIP === false) {
    params.set(QUERY_PARAM_SHOW_IP, '0');
  } else {
    params.delete(QUERY_PARAM_SHOW_IP);
  }
  setParam(QUERY_PARAM_RELAY_RETENTION_MODE, relayRetentionMode);
  setParam(QUERY_PARAM_RELAY_RETENTION_MIN, relayRetentionMin);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', nextUrl);
};

const readUrlInputState = () => {
  const topology = readTopologyInputs();
  const room = roomInput?.value?.trim() || 'telemetry';
  const renderModeValue = normalizeRenderModeValue(renderModeSelect?.value);
  const connectionRadius = parseNumberValue(connectionRadiusInput?.value);
  const maxConnections = parseIntValue(maxConnectionsInput?.value);
  const targetConnections = parseIntValue(targetConnectionsInput?.value);
  const relayRetentionMode = normalizeRetentionMode(relayRetentionModeSelect?.value);
  const relayRetentionMin = parseIntValue(relayRetentionMinInput?.value);
  return {
    room,
    topologyId: topology.topologyId,
    topologyType: topology.topologyType,
    renderMode: renderModeValue,
    connectionRadius,
    maxConnections,
    targetConnections,
    dropRelay: dropRelayToggle?.checked ?? false,
    relayRetentionMode,
    relayRetentionMin,
    showP2P: showP2PTopologyToggle?.checked ?? true,
    showIP: showIPTopologyToggle?.checked ?? true
  };
};

const syncInputsToUrl = () => {
  if (node) return;
  syncQueryParams(readUrlInputState());
};

const normalizeAttachSession = (session) => {
  if (!session || typeof session !== 'object') return null;
  const sessionId = String(session.sessionId || '').trim();
  const topologyIdValue = String(session.topologyId || '').trim();
  const roomIdValue = String(session.roomId || '').trim();
  if (!sessionId || !topologyIdValue || !roomIdValue) return null;
  return {
    sessionId,
    peerId: String(session.peerId || '').trim() || null,
    nodeId: String(session.nodeId || '').trim() || null,
    gameId: String(session.gameId || '').trim() || 'unknown',
    roomId: roomIdValue,
    topologyId: topologyIdValue,
    topologyType: normalizeTopologyType(session.topologyType || 'distributed'),
    isStarted: session.isStarted !== false,
    ts: Number.isFinite(session.ts) ? session.ts : Date.now()
  };
};

const pruneAttachSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of attachSessions.entries()) {
    const age = now - (session.ts || 0);
    if (age > ATTACH_SESSION_STALE_MS || session.isStarted === false) {
      attachSessions.delete(sessionId);
    }
  }
};

const formatAttachSessionLabel = (session) => {
  const gameId = session.gameId || 'unknown';
  const room = session.roomId || '--';
  const topology = session.topologyId || '--';
  const peer = session.peerId ? formatPeerId(session.peerId) : 'pending';
  return `${gameId} | ${room} | ${topology} | ${peer}`;
};

const refreshAttachSessionOptions = () => {
  if (!attachSessionSelect) return;
  pruneAttachSessions();
  const previousValue = attachSessionSelect.value;
  const options = Array.from(attachSessions.values())
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));

  attachSessionSelect.textContent = '';
  const manualOption = document.createElement('option');
  manualOption.value = '';
  manualOption.textContent = 'Manual';
  attachSessionSelect.appendChild(manualOption);

  options.forEach((session) => {
    const option = document.createElement('option');
    option.value = session.sessionId;
    option.textContent = formatAttachSessionLabel(session);
    attachSessionSelect.appendChild(option);
  });

  if (previousValue && attachSessions.has(previousValue)) {
    attachSessionSelect.value = previousValue;
  }
};

const upsertAttachSession = (session) => {
  const normalized = normalizeAttachSession(session);
  if (!normalized) return;
  attachSessions.set(normalized.sessionId, normalized);
  refreshAttachSessionOptions();
  if (!pendingAttachSessionId) return;
  const shouldAttach = pendingAttachSessionId === 'latest'
    || pendingAttachSessionId === normalized.sessionId;
  if (!shouldAttach) return;
  pendingAttachSessionId = null;
  if (attachSessionSelect) {
    attachSessionSelect.value = normalized.sessionId;
  }
  queueMicrotask(() => {
    attachToSelectedSession().catch((err) => {
      logEvent(`Attach failed: ${err?.message || err}`);
    });
  });
};

const removeAttachSession = (sessionId) => {
  const id = String(sessionId || '').trim();
  if (!id) return;
  attachSessions.delete(id);
  refreshAttachSessionOptions();
};

const applyAttachSessionInputs = (session) => {
  topologyType = normalizeTopologyType(session.topologyType);
  topologyId = session.topologyId || 'netviz-topology';
  if (topologySelect) topologySelect.value = topologyType;
  if (topologyIdInput) topologyIdInput.value = topologyId;
  if (roomInput) roomInput.value = session.roomId || 'telemetry';
  visualizer.setTopologyMode(topologyType);
  syncInputsToUrl();
};

const attachToSelectedSession = async () => {
  if (!attachSessionSelect) return;
  const sessionId = attachSessionSelect.value;
  if (!sessionId) {
    logEvent('Attach skipped: no demo session selected.');
    return;
  }
  const session = attachSessions.get(sessionId);
  if (!session) {
    logEvent('Attach failed: selected session is no longer active.');
    refreshAttachSessionOptions();
    return;
  }

  applyAttachSessionInputs(session);
  logEvent(`Attached to ${session.gameId} (${formatPeerId(session.peerId || '')})`);

  if (connectionState === CONNECTION_STATE.DISCONNECTED) {
    await connect();
    return;
  }
  if (connectionState === CONNECTION_STATE.CONNECTED) {
    await disconnect({ reason: 'attach' });
    await connect();
  }
};

const startAttachSessionBridge = () => {
  if (typeof BroadcastChannel === 'undefined') return;
  try {
    attachSessionChannel = new BroadcastChannel(NETVIZ_DEBUG_CHANNEL);
  } catch (_) {
    attachSessionChannel = null;
    return;
  }
  attachSessionChannel.addEventListener('message', (event) => {
    const message = event?.data;
    if (!message || typeof message !== 'object') return;
    if (message.type === 'session-upsert') {
      upsertAttachSession(message.session);
      return;
    }
    if (message.type === 'session-remove') {
      removeAttachSession(message.sessionId);
    }
  });
};

const syncAttachSessionsFromNode = () => {
  const sessions = node?.getNetVizDiscoveredSessions?.();
  if (!Array.isArray(sessions) || sessions.length === 0) return;
  sessions.forEach((session) => {
    upsertAttachSession(session);
  });
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

const formatChaosStage = (stage) => {
  if (!stage || typeof stage !== 'object') return '--';
  const phase = stage.phase || 'stage';
  const type = stage.type || 'unknown';
  const ok = stage.ok === false ? 'fail' : 'ok';
  return `${phase}:${type} (${ok})`;
};

const updateChaosPanel = () => {
  if (!chaosStatusEl) return;
  if (!chaosApiBase) {
    chaosStatusEl.textContent = 'Chaos feed: disabled (add ?chaosApi=http://127.0.0.1:8866)';
    return;
  }
  if (!chaosFeed.healthy) {
    const errorText = chaosFeed.error || 'offline';
    chaosStatusEl.textContent = [
      `Chaos API: ${chaosApiBase}`,
      `State: ${errorText}`,
      'Waiting for chaos-lab dashboard...'
    ].join('\n');
    return;
  }

  const summary = chaosFeed.summary || {};
  const topologyPayload = chaosFeed.topology || {};
  const topology = topologyPayload.topology || {};
  const partitioned = Array.isArray(topology.partitioned_segments)
    ? topology.partitioned_segments
    : [];
  const latestStage = topologyPayload.latest_stage || null;
  const latestEvent = chaosFeed.latestEvent || null;

  const lines = [
    `Chaos API: ${chaosApiBase}`,
    `Run: ${summary.run_id || topologyPayload.run_id || '--'}`,
    `Updated: ${summary.updated_at || topologyPayload.updated_at || '--'}`,
    `Mode: ${topology.actual_mode || '--'} | IP: ${topology.ip_mode || '--'}`,
    `Segments: ${topology.segment_total ?? '--'} | Partitioned: ${partitioned.length ? partitioned.join(', ') : 'none'}`,
    `Agents: ${topology.agent_online ?? '--'}/${topology.agent_total ?? '--'} | Services: ${topology.service_total ?? '--'}`,
    `Overlay nodes: ${(Number(topology.segment_total) || 0) + (Number(topology.agent_total) || 0) + (Number(topology.service_total) || 0) + 1}`,
    `Scenario events: ${summary.scenario_event_count ?? 0} | Probes: ${summary.probe_total ?? 0}`,
    `Direct rate: ${formatPct(summary.direct_connection_rate)} | Relay-WebRTC: ${formatPct(summary.relay_webrtc_connection_rate)}`,
    `Latest stage: ${formatChaosStage(latestStage)}`
  ];
  if (latestEvent) {
    lines.push(`Latest event: ${latestEvent.type || '--'} @ ${latestEvent.ts || '--'}`);
  }
  chaosStatusEl.textContent = lines.join('\n');
};

const chaosFallbackPayload = (path) => {
  const pathOnly = String(path || '').split('?')[0];
  if (pathOnly.endsWith('/api/events')) {
    return { events: [] };
  }
  if (pathOnly.endsWith('/api/topology')) {
    return { run_id: null, updated_at: null, topology: null };
  }
  return { run_id: null, updated_at: null };
};

const fetchChaosJson = async (path) => {
  const fallback = chaosFallbackPayload(path);
  try {
    const response = await fetch(`${chaosApiBase}${path}`, { cache: 'no-store', mode: 'cors' });
    if (!response.ok) {
      return { ...fallback, degraded: true, status: response.status };
    }
    const payload = await response.json();
    if (payload && typeof payload === 'object') {
      return payload;
    }
  } catch (err) {
    return { ...fallback, degraded: true, error: err?.message || 'request failed' };
  }
  return { ...fallback, degraded: true };
};

const refreshChaosFeed = async () => {
  if (!chaosApiBase || chaosFetchInFlight) return;
  chaosFetchInFlight = true;
  try {
    const [summary, eventsPayload, topology] = await Promise.all([
      fetchChaosJson('/api/summary'),
      fetchChaosJson('/api/events?limit=40'),
      fetchChaosJson('/api/topology')
    ]);
    const summaryDegraded = Boolean(summary?.degraded);
    const eventsDegraded = Boolean(eventsPayload?.degraded);
    const topologyDegraded = Boolean(topology?.degraded);
    const feedDegraded = summaryDegraded || eventsDegraded || topologyDegraded;

    const events = Array.isArray(eventsPayload?.events) ? eventsPayload.events : [];
    const latestStage = topology?.latest_stage;
    const stageKey = latestStage
      ? `${latestStage.phase || 'stage'}:${latestStage.stage_index ?? '--'}:${latestStage.type || '--'}:${latestStage.ok === false ? 'fail' : 'ok'}`
      : '';
    if (stageKey && stageKey !== lastChaosStageKey) {
      lastChaosStageKey = stageKey;
      logEvent(`[Chaos] stage ${stageKey}`);
    }
    chaosFeed = {
      summary: summary && typeof summary === 'object' ? summary : null,
      topology: topology && typeof topology === 'object' ? topology : null,
      events,
      latestEvent: events.length > 0 ? events[events.length - 1] : null,
      healthy: !feedDegraded,
      error: feedDegraded ? 'dashboard offline (degraded fallback)' : null
    };
  } catch (err) {
    chaosFeed = {
      ...chaosFeed,
      healthy: false,
      error: err?.message || 'request failed'
    };
  } finally {
    chaosFetchInFlight = false;
    updateChaosPanel();
  }
};

const startChaosPolling = () => {
  if (!chaosApiBase) {
    updateChaosPanel();
    return;
  }
  if (chaosPollTimer) return;
  refreshChaosFeed().catch(() => {});
  chaosPollTimer = setInterval(() => {
    refreshChaosFeed().catch(() => {});
  }, CHAOS_POLL_MS);
};

const stopChaosPolling = () => {
  if (!chaosPollTimer) return;
  clearInterval(chaosPollTimer);
  chaosPollTimer = null;
};

const isChaosNodeId = (peerId) => (
  typeof peerId === 'string' && peerId.startsWith(CHAOS_NODE_PREFIX)
);

const buildChaosOverlay = () => {
  if (!chaosFeed.healthy) {
    return {
      peers: [],
      edges: [],
      peerInfo: new Map(),
      edgeInfo: new Map(),
      topology: null
    };
  }
  const topologyPayload = chaosFeed.topology || {};
  const topology = topologyPayload.topology;
  if (!topology || typeof topology !== 'object') {
    return {
      peers: [],
      edges: [],
      peerInfo: new Map(),
      edgeInfo: new Map(),
      topology: null
    };
  }

  const rawSegments = Array.isArray(topology.segments) ? topology.segments : [];
  const rawServices = Array.isArray(topology.services) ? topology.services : [];
  const rawAgents = Array.isArray(topology.agents) ? topology.agents : [];
  const partitioned = new Set(
    Array.isArray(topology.partitioned_segments) ? topology.partitioned_segments : []
  );

  const peers = [];
  const edges = [];
  const peerInfo = new Map();
  const edgeInfo = new Map();
  const segmentCenters = new Map();
  const coreId = `${CHAOS_NODE_PREFIX}core`;

  peers.push({
    peerId: coreId,
    role: 'chaos-core',
    source: 'ip-topology',
    isRoot: true,
    metricInitialized: true,
    metric: { x: 0, y: 0, z: 0 }
  });
  peerInfo.set(coreId, {
    kind: 'core',
    source: 'ip-topology',
    actualMode: topology.actual_mode || '--',
    requestedMode: topology.requested_mode || '--',
    ipMode: topology.ip_mode || '--',
    segmentTotal: Number.isFinite(topology.segment_total) ? topology.segment_total : rawSegments.length,
    agentTotal: Number.isFinite(topology.agent_total) ? topology.agent_total : rawAgents.length,
    serviceTotal: Number.isFinite(topology.service_total) ? topology.service_total : rawServices.length
  });

  const segmentRadius = Math.max(4.5, rawSegments.length * 1.75);
  rawSegments.forEach((segment, index) => {
    const segmentId = String(segment?.id || '').trim();
    if (!segmentId) return;
    const angle = (index / Math.max(1, rawSegments.length)) * Math.PI * 2;
    const center = {
      x: Math.cos(angle) * segmentRadius,
      y: 0,
      z: Math.sin(angle) * segmentRadius
    };
    const peerId = `${CHAOS_NODE_PREFIX}segment:${segmentId}`;
    segmentCenters.set(segmentId, center);
    peers.push({
      peerId,
      role: 'chaos-segment',
      source: 'ip-topology',
      isHost: true,
      metricInitialized: true,
      metric: center
    });
    peerInfo.set(peerId, {
      kind: 'segment',
      source: 'ip-topology',
      segmentId,
      ipv4Subnet: segment?.ipv4_subnet || '--',
      ipv6Subnet: segment?.ipv6_subnet || '--',
      gateway4: segment?.gateway4 || '--',
      gateway6: segment?.gateway6 || '--',
      partitioned: Boolean(segment?.partitioned),
      uplinkEnabled: segment?.uplink_enabled !== false,
      natEnabled: Boolean(segment?.nat?.enabled),
      natType: segment?.nat?.type || '--',
      natUplinkIpv4: segment?.nat?.uplink_ipv4 || '--',
      natUplinkIpv6: segment?.nat?.uplink_ipv6 || '--',
      linkProfile: {
        bwMbit: segment?.link_profile?.bw_mbit ?? null,
        delayMs: segment?.link_profile?.delay_ms ?? null,
        lossPct: segment?.link_profile?.loss_pct ?? null
      }
    });
    edges.push({
      from: coreId,
      to: peerId,
      via: 'webrtc',
      source: 'ip-topology',
      errorActive: partitioned.has(segmentId),
      rxBps: 0,
      txBps: 0,
      rxCount: 0,
      txCount: 0
    });
    edgeInfo.set(buildEdgeKey(coreId, peerId), {
      kind: 'core-segment',
      source: 'ip-topology',
      segmentId,
      partitioned: partitioned.has(segmentId),
      natType: segment?.nat?.type || '--',
      bwMbit: segment?.link_profile?.bw_mbit ?? null,
      delayMs: segment?.link_profile?.delay_ms ?? null,
      lossPct: segment?.link_profile?.loss_pct ?? null
    });
  });

  const serviceRadius = Math.max(2.2, rawServices.length * 0.9);
  rawServices.forEach((service, index) => {
    const name = String(service?.name || '').trim();
    if (!name) return;
    const angle = (index / Math.max(1, rawServices.length)) * Math.PI * 2;
    const metric = {
      x: Math.cos(angle) * serviceRadius,
      y: 0.65,
      z: Math.sin(angle) * serviceRadius
    };
    const peerId = `${CHAOS_NODE_PREFIX}service:${name}`;
    peers.push({
      peerId,
      role: 'chaos-service',
      source: 'ip-topology',
      isRelay: name === 'relay',
      metricInitialized: true,
      metric
    });
    peerInfo.set(peerId, {
      kind: 'service',
      source: 'ip-topology',
      service: name,
      host: service?.host || '--',
      ipv4: service?.ipv4 || '--',
      ipv6: service?.ipv6 || '--'
    });
    edges.push({
      from: coreId,
      to: peerId,
      via: 'webrtc',
      source: 'ip-topology',
      rxBps: 0,
      txBps: 0,
      rxCount: 0,
      txCount: 0
    });
    edgeInfo.set(buildEdgeKey(coreId, peerId), {
      kind: 'core-service',
      source: 'ip-topology',
      service: name,
      host: service?.host || '--'
    });
  });

  const agentsBySegment = new Map();
  rawAgents.forEach((agent) => {
    const segmentId = String(agent?.segment_id || '').trim();
    if (!segmentId || !segmentCenters.has(segmentId)) return;
    if (!agentsBySegment.has(segmentId)) agentsBySegment.set(segmentId, []);
    agentsBySegment.get(segmentId).push(agent);
  });

  agentsBySegment.forEach((segmentAgents, segmentId) => {
    const center = segmentCenters.get(segmentId);
    if (!center) return;
    segmentAgents.forEach((agent, index) => {
      const name = String(agent?.name || '').trim();
      if (!name) return;
      const angle = (index / Math.max(1, segmentAgents.length)) * Math.PI * 2;
      const radius = 1.2 + Math.floor(index / 8) * 0.8;
      const metric = {
        x: center.x + Math.cos(angle) * radius,
        y: 0,
        z: center.z + Math.sin(angle) * radius
      };
      const enabled = agent?.enabled !== false;
      const peerId = `${CHAOS_NODE_PREFIX}agent:${name}`;
      const segmentPeerId = `${CHAOS_NODE_PREFIX}segment:${segmentId}`;
      peers.push({
        peerId,
        role: 'chaos-agent',
        source: 'ip-topology',
        inferred: !enabled,
        metricInitialized: true,
        metric
      });
      const segment = rawSegments.find((entry) => String(entry?.id || '').trim() === segmentId) || null;
      peerInfo.set(peerId, {
        kind: 'agent',
        source: 'ip-topology',
        name,
        enabled,
        segmentId,
        ipv4: agent?.ipv4 || '--',
        ipv6: agent?.ipv6 || '--',
        natType: segment?.nat?.type || '--',
        natEnabled: Boolean(segment?.nat?.enabled)
      });
      edges.push({
        from: segmentPeerId,
        to: peerId,
        via: 'webrtc',
        source: 'ip-topology',
        errorActive: partitioned.has(segmentId) || !enabled,
        rxBps: 0,
        txBps: 0,
        rxCount: 0,
        txCount: 0
      });
      edgeInfo.set(buildEdgeKey(segmentPeerId, peerId), {
        kind: 'segment-agent',
        source: 'ip-topology',
        segmentId,
        agentName: name,
        enabled,
        partitioned: partitioned.has(segmentId)
      });
    });
  });

  return { peers, edges, peerInfo, edgeInfo, topology };
};

const normalizeEventTimestamp = (value) => {
  if (!value) return 0;
  const ms = Date.parse(String(value));
  return Number.isFinite(ms) ? ms : 0;
};

const buildChaosP2POverlay = (topology = null) => {
  if (!chaosFeed.healthy) {
    return {
      peers: [],
      edges: [],
      peerInfo: new Map(),
      edgeInfo: new Map()
    };
  }
  const events = Array.isArray(chaosFeed.events) ? chaosFeed.events : [];
  if (events.length === 0) {
    return {
      peers: [],
      edges: [],
      peerInfo: new Map(),
      edgeInfo: new Map()
    };
  }

  const latestByAgent = new Map();
  events.forEach((event) => {
    if (!event || event.type !== 'probe_result') return;
    const payload = event.payload;
    if (!payload || typeof payload !== 'object') return;
    if (payload.ok === false || payload.connected === false) return;
    const agent = String(payload.agent || '').trim();
    if (!agent) return;
    const ts = normalizeEventTimestamp(event.ts);
    const current = latestByAgent.get(agent);
    if (!current || ts >= current.ts) {
      latestByAgent.set(agent, { ts, payload });
    }
  });

  if (latestByAgent.size === 0) {
    return {
      peers: [],
      edges: [],
      peerInfo: new Map(),
      edgeInfo: new Map()
    };
  }

  const peerMap = new Map();
  const edgeMap = new Map();
  const peerInfo = new Map();
  const edgeInfo = new Map();
  const agentSegmentByName = new Map();
  if (topology && typeof topology === 'object') {
    const agents = Array.isArray(topology.agents) ? topology.agents : [];
    agents.forEach((agent) => {
      const name = String(agent?.name || '').trim();
      const segmentId = String(agent?.segment_id || '').trim();
      if (!name || !segmentId) return;
      agentSegmentByName.set(name, segmentId);
    });
  }

  const mergePeer = (next) => {
    const peerId = String(next?.peerId || '').trim();
    if (!peerId) return;
    const current = peerMap.get(peerId);
    if (!current) {
      peerMap.set(peerId, { ...next, peerId });
      return;
    }
    const merged = { ...current };
    const truthyKeys = ['isRelay', 'isHost', 'isRoot'];
    truthyKeys.forEach((key) => {
      if (next[key]) merged[key] = true;
    });
    if (next.role && !merged.role) merged.role = next.role;
    if (next.source && !merged.source) merged.source = next.source;
    if (next.inferred === false) merged.inferred = false;
    if (!merged.metricInitialized && next.metricInitialized) merged.metricInitialized = true;
    if (next.metric && (!merged.metric || !merged.metricInitialized)) {
      merged.metric = next.metric;
      merged.metricInitialized = Boolean(next.metricInitialized);
    }
    peerMap.set(peerId, merged);
  };

  const mergeEdge = (next) => {
    const from = String(next?.from || '').trim();
    const to = String(next?.to || '').trim();
    if (!from || !to || from === to) return;
    const key = buildEdgeKey(from, to);
    const current = edgeMap.get(key);
    if (!current) {
      edgeMap.set(key, { ...next, from, to });
      return;
    }
    const merged = { ...current };
    merged.via = preferStrongerVia(merged.via, next.via);
    merged.signalingPath = preferStrongerSignalingPath(merged.signalingPath, next.signalingPath)
      || signalingPathFromVia(merged.via);
    merged.mediaPath = preferStrongerMediaPath(merged.mediaPath, next.mediaPath)
      || mediaPathFromVia(merged.via);
    merged.rxBps = Math.max(Number(merged.rxBps) || 0, Number(next.rxBps) || 0);
    merged.txBps = Math.max(Number(merged.txBps) || 0, Number(next.txBps) || 0);
    merged.rxCount = Math.max(Number(merged.rxCount) || 0, Number(next.rxCount) || 0);
    merged.txCount = Math.max(Number(merged.txCount) || 0, Number(next.txCount) || 0);
    const nextRxAt = Number(next.lastRxAt) || 0;
    const nextTxAt = Number(next.lastTxAt) || 0;
    if (nextRxAt > (Number(merged.lastRxAt) || 0)) merged.lastRxAt = nextRxAt;
    if (nextTxAt > (Number(merged.lastTxAt) || 0)) merged.lastTxAt = nextTxAt;
    edgeMap.set(key, merged);
  };

  latestByAgent.forEach(({ payload }, agentName) => {
    const diagnostics = payload?.diagnostics;
    const netviz = diagnostics && typeof diagnostics === 'object' ? diagnostics.netviz : null;
    const telemetry = netviz && typeof netviz === 'object' ? netviz.telemetry : null;
    const localPeerId = String(
      netviz?.localPeerId
      || telemetry?.peerId
      || ''
    ).trim();
    if (!localPeerId) return;

    const metric = telemetry?.metric && typeof telemetry.metric === 'object'
      ? {
          x: Number.isFinite(telemetry.metric.x) ? telemetry.metric.x : 0,
          y: Number.isFinite(telemetry.metric.y) ? telemetry.metric.y : 0,
          z: Number.isFinite(telemetry.metric.z) ? telemetry.metric.z : 0
        }
      : null;
    const metricInitialized = Boolean(telemetry?.metricInitialized) || Boolean(metric);
    mergePeer({
      peerId: localPeerId,
      role: 'chaos-p2p-agent',
      source: 'chaos-p2p',
      inferred: false,
      metricInitialized,
      metric
    });

    const segmentId = agentSegmentByName.get(agentName) || '--';
    peerInfo.set(localPeerId, {
      kind: 'p2p-node',
      source: 'chaos-p2p',
      agentName,
      segmentId,
      peerId: localPeerId,
      peerCount: Number(payload?.peer_count ?? telemetry?.peerCount ?? 0),
      directPeerCount: Number(payload?.direct_peer_count ?? netviz?.directPeerCount ?? 0),
      relayPeerCount: Number(payload?.relay_peer_count ?? netviz?.relayPeerCount ?? 0),
      hasDirectConnection: Boolean(payload?.has_direct_connection ?? netviz?.hasDirectConnection),
      hasRelayWebrtcConnection: Boolean(
        payload?.has_relay_webrtc_connection ?? netviz?.hasRelayWebrtcConnection
      ),
      announcedDirectWebrtcAddrsCount: Number(
        payload?.announced_direct_webrtc_addrs_count
        ?? (Array.isArray(netviz?.announcedDirectWebrtcAddrs) ? netviz.announcedDirectWebrtcAddrs.length : 0)
      )
    });

    const neighbors = Array.isArray(telemetry?.peers) ? telemetry.peers : [];
    neighbors.forEach((neighbor) => {
      if (!neighbor || typeof neighbor !== 'object') return;
      const peerId = String(neighbor.peerId || neighbor.id || '').trim();
      if (!peerId || peerId === localPeerId) return;
      mergePeer({
        peerId,
        role: 'chaos-p2p-peer',
        source: 'chaos-p2p',
        inferred: !peerInfo.has(peerId)
      });
      if (!peerInfo.has(peerId)) {
        peerInfo.set(peerId, {
          kind: 'p2p-node',
          source: 'chaos-p2p',
          agentName: '--',
          segmentId: '--',
          peerId,
          peerCount: null,
          directPeerCount: null,
          relayPeerCount: null,
          hasDirectConnection: false,
          hasRelayWebrtcConnection: false,
          announcedDirectWebrtcAddrsCount: null
        });
      }

      const viaRaw = String(neighbor.via || '').trim().toLowerCase();
      const via = normalizeTransportVia(viaRaw);
      if (!via) return;
      const signalingPath = normalizeSignalingPath(neighbor?.signalingPath) || signalingPathFromVia(via);
      const mediaPath = normalizeMediaPath(neighbor?.mediaPath) || mediaPathFromVia(via);
      mergeEdge({
        from: localPeerId,
        to: peerId,
        source: 'chaos-p2p',
        via,
        signalingPath,
        mediaPath,
        rxBps: Number(neighbor.rxBps) || 0,
        txBps: Number(neighbor.txBps) || 0,
        rxCount: Number(neighbor.rxCount) || 0,
        txCount: Number(neighbor.txCount) || 0,
        lastRxAt: Number(neighbor.lastRxAt) || null,
        lastTxAt: Number(neighbor.lastTxAt) || null,
        errorActive: false
      });

      edgeInfo.set(buildEdgeKey(localPeerId, peerId), {
        kind: 'p2p-link',
        source: 'chaos-p2p',
        agentName,
        via: viaRaw || 'unknown',
        signalingPath: signalingPath || 'unknown',
        mediaPath: mediaPath || 'unknown',
        fromPeerId: localPeerId,
        toPeerId: peerId,
        rxBps: Number(neighbor.rxBps) || 0,
        txBps: Number(neighbor.txBps) || 0,
        rxCount: Number(neighbor.rxCount) || 0,
        txCount: Number(neighbor.txCount) || 0
      });
    });
  });

  return {
    peers: Array.from(peerMap.values()),
    edges: Array.from(edgeMap.values()),
    peerInfo,
    edgeInfo
  };
};

const mergePeersForDisplay = (primaryPeers, overlayPeers) => {
  const merged = new Map();
  const add = (peer) => {
    const peerId = peer?.peerId;
    if (!peerId || merged.has(peerId)) return;
    merged.set(peerId, peer);
  };
  primaryPeers.forEach(add);
  overlayPeers.forEach(add);
  return Array.from(merged.values());
};

const mergeEdgesForDisplay = (primaryEdges, overlayEdges) => {
  const merged = new Map();
  const add = (edge) => {
    const from = edge?.from;
    const to = edge?.to;
    if (!from || !to || from === to) return;
    const key = from < to ? `${from}|${to}` : `${to}|${from}`;
    if (!merged.has(key)) merged.set(key, edge);
  };
  primaryEdges.forEach(add);
  overlayEdges.forEach(add);
  return Array.from(merged.values());
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
  if (via && via !== 'presence') return true;
  if (normalizeSignalingPath(neighbor.signalingPath)) return true;
  if (normalizeMediaPath(neighbor.mediaPath)) return true;
  return false;
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

const setConfigInputsDisabled = (disabled) => {
  const controls = [
    topologySelect,
    topologyIdInput,
    roomInput,
    renderModeSelect,
    connectionRadiusInput,
    maxConnectionsInput,
    targetConnectionsInput,
    dropRelayToggle,
    relayRetentionModeSelect,
    relayRetentionMinInput
  ];
  controls.forEach((control) => {
    if (control) control.disabled = disabled;
  });
};

const setConnectButtonState = (state) => {
  if (!connectBtn) return;
  if (state === CONNECTION_STATE.CONNECTING) {
    connectBtn.textContent = 'Connecting...';
    connectBtn.disabled = true;
    return;
  }
  if (state === CONNECTION_STATE.DISCONNECTING) {
    connectBtn.textContent = 'Disconnecting...';
    connectBtn.disabled = true;
    return;
  }
  connectBtn.disabled = false;
  connectBtn.textContent = state === CONNECTION_STATE.CONNECTED ? 'Disconnect' : 'Connect';
};

const setConnectionState = (state) => {
  connectionState = state;
  setConnectButtonState(state);
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

const shouldShowP2PTopology = () => showP2PTopologyToggle?.checked ?? true;
const shouldShowIPTopology = () => showIPTopologyToggle?.checked ?? true;
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
  const isDirectCapablePeer = (peer) => (
    Boolean(peer?.peerId)
    && (isDirectMediaPath(peer?.mediaPath) || isDirectTransportVia(peer?.via))
  );
  const hasNonRelay = connectedPeers.some((peer) => isDirectCapablePeer(peer));
  const hostId = localView?.hostId || null;
  const backupHostId = localView?.backupHostId || null;
  const hasHostDirect = hostId
    ? connectedPeers.some((peer) => peer?.peerId === hostId && isDirectCapablePeer(peer))
    : false;
  const hasBackupDirect = backupHostId
    ? connectedPeers.some((peer) => peer?.peerId === backupHostId && isDirectCapablePeer(peer))
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
  const connectionSnapshot = localId ? getConnectionAddressSnapshot() : null;
  const buildEdgeKey = (from, to) => (from < to ? `${from}|${to}` : `${to}|${from}`);
  const telemetryViaByEdge = new Map();
  const telemetrySignalingPathByEdge = new Map();
  const telemetryMediaPathByEdge = new Map();
  peers.forEach((peer) => {
    const from = peer?.peerId;
    if (!from) return;
    const snapshot = telemetryStore.get(from);
    const neighbors = Array.isArray(snapshot?.peers) ? snapshot.peers : [];
    neighbors.forEach((neighbor) => {
      const to = neighbor?.peerId || neighbor?.id || null;
      if (!to || to === from) return;
      const key = buildEdgeKey(from, to);
      const via = normalizeTransportVia(neighbor?.via);
      const signalingPath = normalizeSignalingPath(neighbor?.signalingPath) || signalingPathFromVia(via);
      const mediaPath = normalizeMediaPath(neighbor?.mediaPath) || mediaPathFromVia(via);
      if (via) {
        telemetryViaByEdge.set(key, preferStrongerVia(telemetryViaByEdge.get(key), via));
      }
      telemetrySignalingPathByEdge.set(
        key,
        preferStrongerSignalingPath(telemetrySignalingPathByEdge.get(key), signalingPath)
      );
      telemetryMediaPathByEdge.set(
        key,
        preferStrongerMediaPath(telemetryMediaPathByEdge.get(key), mediaPath)
      );
    });
  });
  const resolveLiveViaForEdge = (from, to) => {
    if (!connectionSnapshot || !localId) return null;
    const remotePeerId = from === localId ? to : to === localId ? from : null;
    if (!remotePeerId) return null;
    const liveConnections = connectionSnapshot.byPeer.get(remotePeerId) || [];
    if (!Array.isArray(liveConnections) || liveConnections.length === 0) return null;
    if (liveConnections.some((conn) => conn?.kind === 'webrtc-direct')) {
      return 'webrtc';
    }
    if (liveConnections.some((conn) => conn?.kind === 'relay-webrtc')) {
      return 'relay-webrtc';
    }
    if (liveConnections.some((conn) => conn?.kind === 'relay')) {
      return 'relay';
    }
    if (liveConnections.some((conn) => conn?.kind === 'direct' || conn?.kind === 'direct-websocket')) {
      return 'direct';
    }
    return null;
  };
  const resolveLiveSignalingPathForEdge = (from, to) => {
    return signalingPathFromVia(resolveLiveViaForEdge(from, to));
  };
  const resolveLiveMediaPathForEdge = (from, to) => {
    if (!connectionSnapshot || !localId) return null;
    const remotePeerId = from === localId ? to : to === localId ? from : null;
    if (!remotePeerId) return null;
    const liveConnections = connectionSnapshot.byPeer.get(remotePeerId) || [];
    if (!Array.isArray(liveConnections) || liveConnections.length === 0) return null;
    if (liveConnections.some((conn) => conn?.kind === 'webrtc-direct' || conn?.kind === 'direct' || conn?.kind === 'direct-websocket')) {
      return 'direct';
    }
    if (liveConnections.some((conn) => conn?.kind === 'relay')) {
      return 'turn-relay';
    }
    if (liveConnections.some((conn) => conn?.kind === 'relay-webrtc')) {
      if (rtcPathState?.hasDirectPair && !rtcPathState?.hasRelayPair) return 'direct';
      if (rtcPathState?.hasRelayPair && !rtcPathState?.hasDirectPair) return 'turn-relay';
      return 'unknown';
    }
    return null;
  };
  const resolveRelayForEdge = (from, to, signalingPath, via) => {
    const relayed = normalizeSignalingPath(signalingPath) === 'relay-scoped'
      || isRelayedTransportVia(via);
    if (!relayed) return null;
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
    const rawVia = normalizeTransportVia(metrics?.via);
    const rawSignalingPath = normalizeSignalingPath(metrics?.signalingPath) || signalingPathFromVia(rawVia);
    const rawMediaPath = normalizeMediaPath(metrics?.mediaPath) || mediaPathFromVia(rawVia);
    const liveVia = resolveLiveViaForEdge(from, to);
    const liveSignalingPath = resolveLiveSignalingPathForEdge(from, to);
    const liveMediaPath = resolveLiveMediaPathForEdge(from, to);
    const telemetryVia = telemetryViaByEdge.get(key) || null;
    const telemetrySignalingPath = telemetrySignalingPathByEdge.get(key) || null;
    const telemetryMediaPath = telemetryMediaPathByEdge.get(key) || null;
    const via = preferStrongerVia(preferStrongerVia(rawVia, telemetryVia), liveVia) || 'unknown';
    const signalingPath = preferStrongerSignalingPath(
      preferStrongerSignalingPath(rawSignalingPath, telemetrySignalingPath),
      liveSignalingPath
    ) || signalingPathFromVia(via) || 'unknown';
    const mediaPath = preferStrongerMediaPath(
      preferStrongerMediaPath(rawMediaPath, telemetryMediaPath),
      liveMediaPath
    ) || mediaPathFromVia(via) || 'unknown';
    const relayPeerId = resolveRelayForEdge(from, to, signalingPath, via);
    const existing = edgeMap.get(key);
    if (existing) {
      existing.via = preferStrongerVia(existing.via, via) || existing.via || via;
      existing.signalingPath = preferStrongerSignalingPath(existing.signalingPath, signalingPath)
        || existing.signalingPath
        || signalingPath;
      existing.mediaPath = preferStrongerMediaPath(existing.mediaPath, mediaPath)
        || existing.mediaPath
        || mediaPath;
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
      source: 'p2p-topology',
      rxBps: nextRxBps,
      txBps: nextTxBps,
      rxCount: nextRxCount,
      txCount: nextTxCount,
      errorActive,
      errorAt: Number.isFinite(errorAt) ? errorAt : null,
      lastRxAt: Number.isFinite(lastRxAt) ? lastRxAt : null,
      lastTxAt: Number.isFinite(lastTxAt) ? lastTxAt : null,
      via,
      signalingPath,
      mediaPath,
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

const findNeighborMetrics = (fromPeer, toPeerId) => {
  const neighbors = Array.isArray(fromPeer?.peers) ? fromPeer.peers : [];
  return neighbors.find((neighbor) => neighbor?.peerId === toPeerId) || null;
};

const formatLocalTime = (value) => (
  Number.isFinite(value) ? new Date(value).toLocaleTimeString() : '--'
);

const formatCompactList = (values = [], max = 3) => {
  const list = uniqueList(values);
  if (list.length === 0) return '--';
  if (list.length <= max) return list.join(', ');
  return `${list.slice(0, max).join(', ')} (+${list.length - max})`;
};

const buildChaosNodeInfo = (peerId) => {
  const info = lastChaosOverlay.peerInfo.get(peerId);
  if (!info) {
    return {
      title: `Node ${formatPeerId(peerId)}`,
      lines: ['No IP-topology metadata for this node.']
    };
  }

  if (info.kind === 'core') {
    return {
      title: 'IP Topology Core',
      lines: [
        `Mode: ${info.actualMode}`,
        `Requested mode: ${info.requestedMode}`,
        `IP mode: ${info.ipMode}`,
        `Segments: ${info.segmentTotal}`,
        `Agents: ${info.agentTotal}`,
        `Services: ${info.serviceTotal}`
      ]
    };
  }

  if (info.kind === 'segment') {
    return {
      title: `IP Segment ${info.segmentId}`,
      lines: [
        `Partitioned: ${info.partitioned ? 'yes' : 'no'}`,
        `Uplink: ${info.uplinkEnabled ? 'enabled' : 'disabled'}`,
        `IPv4 subnet: ${info.ipv4Subnet}`,
        `IPv6 subnet: ${info.ipv6Subnet}`,
        `Gateway v4/v6: ${info.gateway4} / ${info.gateway6}`,
        `NAT: ${info.natEnabled ? 'enabled' : 'disabled'} (${info.natType})`,
        `NAT uplink v4/v6: ${info.natUplinkIpv4} / ${info.natUplinkIpv6}`,
        `Link profile: bw ${info.linkProfile?.bwMbit ?? '--'}mbit | delay ${info.linkProfile?.delayMs ?? '--'}ms | loss ${info.linkProfile?.lossPct ?? '--'}%`
      ]
    };
  }

  if (info.kind === 'service') {
    return {
      title: `IP Service ${info.service}`,
      lines: [
        `Host: ${info.host}`,
        `IPv4: ${info.ipv4}`,
        `IPv6: ${info.ipv6}`
      ]
    };
  }

  if (info.kind === 'agent') {
    return {
      title: `IP Agent ${info.name}`,
      lines: [
        `Enabled: ${info.enabled ? 'yes' : 'no'}`,
        `Segment: ${info.segmentId}`,
        `IPv4: ${info.ipv4}`,
        `IPv6: ${info.ipv6}`,
        `NAT: ${info.natEnabled ? 'enabled' : 'disabled'} (${info.natType})`
      ]
    };
  }

  if (info.kind === 'p2p-node') {
    return {
      title: `P2P Node ${formatPeerId(peerId)}`,
      lines: [
        `Source: chaos probe telemetry`,
        `Agent: ${info.agentName || '--'}`,
        `Segment: ${info.segmentId || '--'}`,
        `Peer ID: ${info.peerId || peerId}`,
        `Peers: ${info.peerCount ?? '--'} (direct ${info.directPeerCount ?? '--'} | relay ${info.relayPeerCount ?? '--'})`,
        `Has direct connection: ${info.hasDirectConnection ? 'yes' : 'no'}`,
        `Has relay WebRTC: ${info.hasRelayWebrtcConnection ? 'yes' : 'no'}`,
        `Announced direct /webrtc addrs: ${info.announcedDirectWebrtcAddrsCount ?? '--'}`
      ]
    };
  }

  return {
    title: `Node ${formatPeerId(peerId)}`,
    lines: ['Unknown IP-topology node type.']
  };
};

const buildNodeInfo = (peerId) => {
  const displayedPeer = lastDisplayedPeersById.get(peerId) || null;
  if (
    displayedPeer?.source === 'ip-topology'
    || displayedPeer?.source === 'chaos-p2p'
    || String(peerId).startsWith(CHAOS_NODE_PREFIX)
  ) {
    return buildChaosNodeInfo(peerId);
  }

  const connectionSnapshot = getConnectionAddressSnapshot();
  const liveConnections = connectionSnapshot.byPeer.get(peerId) || [];
  const observedIpv4 = uniqueList(liveConnections.map((entry) => entry.ip4));
  const observedIpv6 = uniqueList(liveConnections.map((entry) => entry.ip6));
  const hasPrivateIpv4 = observedIpv4.some((value) => isPrivateIpv4(value));
  const hasPrivateIpv6 = observedIpv6.some((value) => isPrivateIpv6(value));

  const data = telemetryStore.get(peerId);
  if (!data) {
    const isRelay = relayPeerIds.has(peerId);
    return {
      title: `Node ${formatPeerId(peerId)}`,
      lines: isRelay
        ? [
            'Role: Relay server',
            `Link modes: ${summarizeConnectionKinds(liveConnections)}`,
            `Observed IPv4: ${formatCompactList(observedIpv4)}`,
            `Observed IPv6: ${formatCompactList(observedIpv6)}`,
            'No telemetry for this node yet.'
          ]
        : ['No telemetry for this node yet.']
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
  const natGuess = guessNatStatus(liveConnections);
  const localAddrSummary = peerId === localPeerId
    ? connectionSnapshot.localAddrs
    : [];
  const localWebrtcAddrs = peerId === localPeerId
    ? localAddrSummary.filter((addr) => String(addr).includes('/webrtc'))
    : [];
  const localRelayAddrs = peerId === localPeerId
    ? localAddrSummary.filter((addr) => String(addr).includes('/p2p-circuit'))
    : [];
  const rtcPath = connectionSnapshot.rtcPath || rtcPathState;
  const lines = [
    `Peer ID: ${peerId}`,
    `Role: ${role}`,
    `Connection state: ${connectionState}`,
    `Topology: ${data.topologyId || '--'}`,
    `Room: ${data.roomId || '--'}`,
    `Shard: ${data.shardId || '--'}`,
    `Metric: ${formatMetric(data.metric)}`,
    `Connections: ${data.connections ?? peers.length}`,
    `Peers: ${data.peerCount ?? peers.length}`,
    `Link modes: ${summarizeConnectionKinds(liveConnections)}`,
    `NAT status (heuristic): ${natGuess}`,
    `Observed IPv4: ${formatCompactList(observedIpv4)}${hasPrivateIpv4 ? ' (private seen)' : ''}`,
    `Observed IPv6: ${formatCompactList(observedIpv6)}${hasPrivateIpv6 ? ' (private seen)' : ''}`,
    `Rx: ${counts.rx ?? 0} (${formatBytes(counts.rxBytes)}) @ ${formatRate(rates.rxBps)}`,
    `Tx: ${counts.tx ?? 0} (${formatBytes(counts.txBytes)}) @ ${formatRate(rates.txBps)}`,
    `Avg RTT: ${formatMs(avgRtt)}`,
    `Last Rx: ${formatLocalTime(data.lastRxAt)}`,
    `Last Tx: ${formatLocalTime(data.lastTxAt)}`
  ];
  if (peerId === localPeerId) {
    lines.push(`Announce addrs: total ${localAddrSummary.length} | webrtc ${localWebrtcAddrs.length} | relay ${localRelayAddrs.length}`);
    lines.push(
      `RTC path evidence: direct=${rtcPath?.hasDirectPair ? 'yes' : 'no'} | relay=${rtcPath?.hasRelayPair ? 'yes' : 'no'} | pairs=${rtcPath?.pairCount ?? 0}`
    );
    lines.push(`Local addrs: ${formatCompactList(localAddrSummary, 2)}`);
  } else {
    const liveAddrs = uniqueList(liveConnections.map((entry) => entry.remoteAddr));
    lines.push(`Remote addrs: ${formatCompactList(liveAddrs, 2)}`);
  }

  return {
    title: `Node ${formatPeerId(peerId)}`,
    lines
  };
};

const buildEdgeInfo = (fromId, toId, edgeType = 'edge') => {
  const edgeKey = buildEdgeKey(fromId, toId);
  const edgeMeta = lastDisplayedEdgesByKey.get(edgeKey)
    || lastP2PEdgesByKey.get(edgeKey)
    || null;
  const chaosEdgeMeta = lastChaosOverlay.edgeInfo.get(edgeKey) || null;
  if ((edgeMeta?.source === 'ip-topology' || chaosEdgeMeta) && edgeType !== 'pubsub') {
    const info = chaosEdgeMeta || edgeMeta;
    if (info?.source === 'chaos-p2p' || info?.kind === 'p2p-link') {
      const lines = [
        `From: ${fromId}`,
        `To: ${toId}`,
        `Agent sample: ${info.agentName || '--'}`,
        `Via: ${info.via || '--'}`,
        `Rx rate: ${formatRate(info.rxBps)} (${info.rxCount ?? 0} msgs)`,
        `Tx rate: ${formatRate(info.txBps)} (${info.txCount ?? 0} msgs)`
      ];
      return {
        title: `P2P Edge ${formatPeerId(fromId)} ↔ ${formatPeerId(toId)}`,
        lines
      };
    }
    const lines = [
      `From: ${fromId}`,
      `To: ${toId}`,
      `Type: ${info.kind || 'ip-link'}`
    ];
    if (info.segmentId) lines.push(`Segment: ${info.segmentId}`);
    if (info.service) lines.push(`Service: ${info.service}`);
    if (info.agentName) lines.push(`Agent: ${info.agentName}`);
    if (info.natType) lines.push(`NAT: ${info.natType}`);
    if (Number.isFinite(info.bwMbit)) lines.push(`Bandwidth: ${info.bwMbit} mbit`);
    if (Number.isFinite(info.delayMs)) lines.push(`Delay: ${info.delayMs} ms`);
    if (Number.isFinite(info.lossPct)) lines.push(`Loss: ${info.lossPct}%`);
    if (typeof info.partitioned === 'boolean') lines.push(`Partitioned: ${info.partitioned ? 'yes' : 'no'}`);
    if (typeof info.enabled === 'boolean') lines.push(`Agent enabled: ${info.enabled ? 'yes' : 'no'}`);
    return {
      title: `IP Edge ${formatPeerId(fromId)} ↔ ${formatPeerId(toId)}`,
      lines
    };
  }

  const fromData = telemetryStore.get(fromId);
  const toData = telemetryStore.get(toId);
  const fromMetrics = findNeighborMetrics(fromData, toId);
  const toMetrics = findNeighborMetrics(toData, fromId);
  const rttMs = Number.isFinite(fromMetrics?.rttMs) ? fromMetrics.rttMs : toMetrics?.rttMs;
  const rxBps = Number.isFinite(edgeMeta?.rxBps) ? edgeMeta.rxBps : (Number.isFinite(fromMetrics?.rxBps) ? fromMetrics.rxBps : 0);
  const txBps = Number.isFinite(edgeMeta?.txBps) ? edgeMeta.txBps : (Number.isFinite(fromMetrics?.txBps) ? fromMetrics.txBps : 0);
  const rxCount = Number.isFinite(edgeMeta?.rxCount) ? edgeMeta.rxCount : (Number.isFinite(fromMetrics?.rxCount) ? fromMetrics.rxCount : 0);
  const txCount = Number.isFinite(edgeMeta?.txCount) ? edgeMeta.txCount : (Number.isFinite(fromMetrics?.txCount) ? fromMetrics.txCount : 0);
  const via = edgeType === 'pubsub' ? 'pubsub' : (edgeMeta?.via || fromMetrics?.via || toMetrics?.via || 'unknown');
  const signalingPath = edgeType === 'pubsub'
    ? 'pubsub'
    : (edgeMeta?.signalingPath
      || fromMetrics?.signalingPath
      || toMetrics?.signalingPath
      || signalingPathFromVia(via)
      || 'unknown');
  const mediaPath = edgeType === 'pubsub'
    ? 'pubsub'
    : (edgeMeta?.mediaPath
      || fromMetrics?.mediaPath
      || toMetrics?.mediaPath
      || mediaPathFromVia(via)
      || 'unknown');
  const relayPeerId = edgeMeta?.relayPeerId || null;
  const lastRxAt = Number.isFinite(edgeMeta?.lastRxAt) ? edgeMeta.lastRxAt : fromMetrics?.lastRxAt;
  const lastTxAt = Number.isFinite(edgeMeta?.lastTxAt) ? edgeMeta.lastTxAt : fromMetrics?.lastTxAt;
  const localPeer = fromId === localPeerId ? toId : toId === localPeerId ? fromId : null;
  const connectionSnapshot = getConnectionAddressSnapshot();
  const liveConnections = localPeer ? (connectionSnapshot.byPeer.get(localPeer) || []) : [];
  const observedIpv4 = uniqueList(liveConnections.map((entry) => entry.ip4));
  const observedIpv6 = uniqueList(liveConnections.map((entry) => entry.ip6));

  return {
    title: `${edgeType === 'pubsub' ? 'Pubsub' : 'Edge'} ${formatPeerId(fromId)} ↔ ${formatPeerId(toId)}`,
    lines: [
      `From: ${fromId}`,
      `To: ${toId}`,
      `Signaling path: ${signalingPath}`,
      `Media path: ${mediaPath}`,
      `Transport key: ${via}`,
      relayPeerId ? `Relay peer: ${relayPeerId}` : 'Relay peer: --',
      `RTT: ${formatMs(rttMs)}`,
      `Rx rate: ${formatRate(rxBps)} (${rxCount} msgs)`,
      `Tx rate: ${formatRate(txBps)} (${txCount} msgs)`,
      `Observed IPv4: ${formatCompactList(observedIpv4)}`,
      `Observed IPv6: ${formatCompactList(observedIpv6)}`,
      `Last Rx: ${formatLocalTime(lastRxAt)}`,
      `Last Tx: ${formatLocalTime(lastTxAt)}`,
      edgeMeta?.errorActive ? 'Edge state: error active' : 'Edge state: healthy',
      `Updated: ${formatLocalTime(fromMetrics?.lastRttAt)}`
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
  syncAttachSessionsFromNode();
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
  const chaosOverlay = buildChaosOverlay();
  const chaosP2POverlay = buildChaosP2POverlay(chaosOverlay.topology);
  const p2pEnabled = shouldShowP2PTopology();
  const ipEnabled = shouldShowIPTopology();
  const p2pPeers = peers.map((peer) => ({ ...peer, source: peer.source || 'p2p-topology' }));
  const p2pEdges = edges.map((edge) => ({ ...edge, source: edge.source || 'p2p-topology' }));
  const mergedP2PPeers = mergePeersForDisplay(p2pPeers, chaosP2POverlay.peers);
  const mergedP2PEdges = mergeEdgesForDisplay(p2pEdges, chaosP2POverlay.edges);
  const displayPeers = mergePeersForDisplay(
    p2pEnabled ? mergedP2PPeers : [],
    ipEnabled ? chaosOverlay.peers : []
  );
  const displayEdges = mergeEdgesForDisplay(
    p2pEnabled ? mergedP2PEdges : [],
    ipEnabled ? chaosOverlay.edges : []
  );
  const displayPubsubEdges = p2pEnabled ? pubsubEdges : [];

  lastP2PPeersById = new Map(mergedP2PPeers.map((peer) => [peer.peerId, peer]));
  lastP2PEdgesByKey = new Map(mergedP2PEdges.map((edge) => [buildEdgeKey(edge.from, edge.to), edge]));
  lastChaosOverlay = {
    ...chaosOverlay,
    peers: mergePeersForDisplay(chaosOverlay.peers, chaosP2POverlay.peers),
    edges: mergeEdgesForDisplay(chaosOverlay.edges, chaosP2POverlay.edges),
    peerInfo: new Map([...chaosOverlay.peerInfo, ...chaosP2POverlay.peerInfo]),
    edgeInfo: new Map([...chaosOverlay.edgeInfo, ...chaosP2POverlay.edgeInfo])
  };
  lastDisplayedPeersById = new Map(displayPeers.map((peer) => [peer.peerId, peer]));
  lastDisplayedEdgesByKey = new Map(displayEdges.map((edge) => [buildEdgeKey(edge.from, edge.to), edge]));

  visualizer.updatePeers(displayPeers, localPeerId, displayEdges, displayPubsubEdges);

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

  if (displayPeers.length === 0) {
    peerListEl.textContent = 'No peers yet.';
    return;
  }

  const lines = displayPeers
    .slice()
    .sort((a, b) => (a.peerId || '').localeCompare(b.peerId || ''))
    .map((peer) => {
      const tag = isChaosNodeId(peer.peerId)
        ? 'CHAOS'
        : peer.source === 'chaos-p2p'
          ? 'P2P* '
        : peer.isRelay
        ? 'RELAY'
        : peer.peerId === localPeerId
          ? 'LOCAL'
          : peer.inferred
            ? 'GHOST'
            : 'PEER ';
      const rx = peer.counts?.rx ?? peer.rxCount ?? 0;
      const tx = peer.counts?.tx ?? peer.txCount ?? 0;
      const rtt = Number.isFinite(peer.rttMs) ? ` | rtt ${Math.round(peer.rttMs)}ms` : '';
      const displayId = isChaosNodeId(peer.peerId)
        ? String(peer.peerId).slice(CHAOS_NODE_PREFIX.length, CHAOS_NODE_PREFIX.length + 18)
        : formatPeerId(peer.peerId);
      return `${tag} ${displayId} | rx ${rx} | tx ${tx}${rtt}`;
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
  startRtcDiagnosticsLoop();

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

const stopTelemetryLoop = () => {
  if (telemetryTimer) {
    clearInterval(telemetryTimer);
    telemetryTimer = null;
  }
  if (uiTimer) {
    clearInterval(uiTimer);
    uiTimer = null;
  }
  stopRtcDiagnosticsLoop();
};

const stopDebugLoop = () => {
  if (!debugLogTimer) return;
  clearInterval(debugLogTimer);
  debugLogTimer = null;
};

const shutdownNode = async (nodeInstance) => {
  if (!nodeInstance) return;

  let stopped = false;
  if (nodeInstance.isStarted) {
    try {
      await nodeInstance.stop();
      stopped = true;
    } catch (err) {
      console.warn('[NetViz] Node stop failed:', err?.message || err);
    }
  }

  if (stopped) return;

  try {
    await nodeInstance.networkManager?.disconnect?.();
  } catch (err) {
    console.warn('[NetViz] Network disconnect cleanup failed:', err?.message || err);
  }
  try {
    await nodeInstance.stateManager?.destroy?.();
  } catch (err) {
    console.warn('[NetViz] State cleanup failed:', err?.message || err);
  }
};

const resetRuntimeState = () => {
  node = null;
  networkManager = null;
  stateManager = null;
  localPeerId = null;
  relayPeerIds = new Set();
  relayReachable = null;
  lastRelayPeerId = null;
  connectStartedAt = 0;
  libp2pLogAttached = false;
  lastConnectionPolicy = null;
  lastPeerView = [];
  connectionErrors.clear();
  telemetryStore.clear();
  setDragActive(false);
  dragMoved = false;
  skipNextClick = false;
  hideInspector();
};

const disconnect = async ({ reason = 'manual' } = {}) => {
  if (connectionState === CONNECTION_STATE.DISCONNECTING
    || connectionState === CONNECTION_STATE.DISCONNECTED) {
    return;
  }

  const previousState = connectionState;
  setConnectionState(CONNECTION_STATE.DISCONNECTING);
  setConfigInputsDisabled(true);
  setStatus('Status: disconnecting...');
  stopTelemetryLoop();
  stopDebugLoop();
  const activeNode = node;

  try {
    await shutdownNode(activeNode);
  } catch (err) {
    console.error('NetViz disconnect failed', err);
    logEvent(`Disconnect warning: ${err?.message || err}`);
  } finally {
    resetRuntimeState();
    visualizer.updatePeers([], null, [], []);
    peerListEl.textContent = 'No peers yet.';
    setConfigInputsDisabled(false);
    setConnectionState(CONNECTION_STATE.DISCONNECTED);
    if (reason === 'manual') {
      logEvent('Disconnected.');
    } else if (previousState === CONNECTION_STATE.CONNECTING) {
      logEvent('Connect attempt cancelled.');
    }
    setStatus('Status: disconnected');
    syncInputsToUrl();
  }
};

const connect = async () => {
  if (connectionState !== CONNECTION_STATE.DISCONNECTED) return;
  ensureRtcDiagnosticsTracker();
  setConnectionState(CONNECTION_STATE.CONNECTING);
  setConfigInputsDisabled(true);
  syncQueryParams(readUrlInputState());
  setStatus('Status: connecting...');
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
        : 1.1;
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
      enableNetVizDebugTelemetry: false,
      enableNetVizSessionBroadcast: false,
      enableNetVizSessionDiscovery: true,
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
    setConnectionState(CONNECTION_STATE.CONNECTED);
    if (!debugLogTimer) {
      debugLogTimer = setInterval(() => {
        const debug = window.__NETVIZ__?.getStatus?.().relayRetentionDebug || null;
        console.log('[NetViz] Relay retention debug:', debug ? JSON.stringify(debug) : 'n/a');
          try {
            const libp2p = networkManager?.getLibp2pNode?.();
            const addrs = libp2p?.getMultiaddrs?.().map((addr) => addr.toString()) || [];
            const connections = libp2p?.getConnections?.() || [];
            const summarized = Array.isArray(connections)
              ? connections.map((conn) => {
                  const remoteAddr = conn?.remoteAddr?.toString?.() || '';
                  return {
                    peerId: conn?.remotePeer?.toString?.() || '',
                    remoteAddr,
                    kind: classifyConnectionKind(remoteAddr),
                    isRelay: remoteAddr.includes('/p2p-circuit'),
                    isWebRTC: remoteAddr.includes('/webrtc')
                  };
                })
              : [];
            console.log('[NetViz] Libp2p addrs:', addrs);
            console.log('[NetViz] Connections:', summarized);
          } catch (err) {
            console.warn('[NetViz] Libp2p debug failed:', err?.message || err);
          }
      }, 60000);
    }
    syncQueryParams(readUrlInputState());
    startTelemetryLoop();
    updateHud();
  } catch (err) {
    console.error('NetViz connect failed', err);
    stopTelemetryLoop();
    stopDebugLoop();
    await shutdownNode(node);
    resetRuntimeState();
    visualizer.updatePeers([], null, [], []);
    peerListEl.textContent = 'No peers yet.';
    setConfigInputsDisabled(false);
    setConnectionState(CONNECTION_STATE.DISCONNECTED);
    setStatus(`Status: error (${err?.message || err})`);
    logEvent(`Connect failed: ${err?.message || err}`);
  }
};

const attachDebugHandles = () => {
  if (typeof window === 'undefined') return;
  const getLibp2pDebug = () => {
    try {
      const libp2p = networkManager?.getLibp2pNode?.();
      if (!libp2p) return { addrs: [], announceAddrs: [], connections: [] };
        const addrs = libp2p.getMultiaddrs?.().map((addr) => addr.toString()) || [];
        const announceAddrs = networkManager?.getAnnounceAddrs?.() || addrs;
        const connections = libp2p.getConnections?.() || [];
        const summarized = Array.isArray(connections)
          ? connections.map((conn) => {
              const remoteAddr = conn?.remoteAddr?.toString?.() || '';
              return {
                peerId: conn?.remotePeer?.toString?.() || '',
                remoteAddr,
                kind: classifyConnectionKind(remoteAddr),
                isRelay: remoteAddr.includes('/p2p-circuit'),
                isWebRTC: remoteAddr.includes('/webrtc')
              };
            })
          : [];
        return { addrs, announceAddrs, connections: summarized };
    } catch (_) {
      return { addrs: [], announceAddrs: [], connections: [] };
    }
  };

  window.__NETVIZ__ = {
    getStatus: () => ({
      ...getLibp2pDebug(),
      connectionState,
      localPeerId,
      topologyType,
      topologyId,
      roomId: roomInput?.value?.trim() || null,
      relayPeerIds: Array.from(relayPeerIds),
      relayReachable,
      telemetry: networkManager?.getTelemetrySnapshot?.() || null,
      peers: telemetryStore.list(),
      chaosApiBase,
      chaosFeed,
      attachSessions: Array.from(attachSessions.values()),
      rtcPath: { ...rtcPathState },
      relayRetentionDebug: networkManager?.getRelayRetentionDebug?.() || (networkManager ? {
        dropRelayBootstrapOnDirect: networkManager.config?.webrtc?.dropRelayBootstrapOnDirect,
        relayRetention: networkManager.config?.webrtc?.relayRetention,
        hasBootstrapRelayConnections: networkManager._hasBootstrapRelayConnections?.(),
        hasDirectPeerConnections: networkManager._hasDirectPeerConnections?.(),
        shouldKeepRelay: networkManager._shouldKeepRelayBootstrapConnection?.()
      } : null)
    }),
    connect: () => connect(),
    disconnect: () => disconnect(),
    toggleConnection: () => {
      if (connectionState === CONNECTION_STATE.CONNECTED) {
        return disconnect();
      }
      if (connectionState === CONNECTION_STATE.DISCONNECTED) {
        return connect();
      }
      return Promise.resolve();
    }
  };
};

attachDebugHandles();

const toggleConnection = () => {
  if (connectionState === CONNECTION_STATE.CONNECTED) {
    return disconnect();
  }
  if (connectionState === CONNECTION_STATE.DISCONNECTED) {
    return connect();
  }
  return Promise.resolve();
};

connectBtn.addEventListener('click', () => {
  toggleConnection().catch(() => {});
});

attachSessionBtn?.addEventListener('click', () => {
  attachToSelectedSession().catch((err) => {
    logEvent(`Attach failed: ${err?.message || err}`);
  });
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
    return;
  }
  if (hit.type === 'pubsub') {
    const info = buildEdgeInfo(hit.from, hit.to, 'pubsub');
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
  syncInputsToUrl();
});

showP2PTopologyToggle?.addEventListener('change', () => {
  updateHud();
  syncInputsToUrl();
});

showIPTopologyToggle?.addEventListener('change', () => {
  updateHud();
  syncInputsToUrl();
});

autoRotateToggle?.addEventListener('change', () => {
  visualizer.setAutoRotate(shouldAutoRotate());
});

topologySelect?.addEventListener('change', () => {
  topologyType = normalizeTopologyType(topologySelect.value);
  visualizer.setTopologyMode(topologyType);
  updateHud();
  syncInputsToUrl();
});

topologyIdInput?.addEventListener('input', () => {
  topologyId = topologyIdInput.value.trim() || 'netviz-topology';
  updateHud();
  syncInputsToUrl();
});

roomInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && connectionState === CONNECTION_STATE.DISCONNECTED) {
    connect().catch(() => {});
  }
});

roomInput.addEventListener('input', () => {
  syncInputsToUrl();
});

renderModeSelect?.addEventListener('change', () => {
  syncInputsToUrl();
});

connectionRadiusInput?.addEventListener('change', () => {
  syncInputsToUrl();
});

maxConnectionsInput?.addEventListener('change', () => {
  syncInputsToUrl();
});

targetConnectionsInput?.addEventListener('change', () => {
  syncInputsToUrl();
});

dropRelayToggle?.addEventListener('change', () => {
  syncInputsToUrl();
});

relayRetentionModeSelect?.addEventListener('change', () => {
  syncInputsToUrl();
});

relayRetentionMinInput?.addEventListener('change', () => {
  syncInputsToUrl();
});

setConnectionState(CONNECTION_STATE.DISCONNECTED);
setConfigInputsDisabled(false);

const queryParams = applyQueryParams();
refreshAttachSessionOptions();
startAttachSessionBridge();
startChaosPolling();
const autoConnect = parseBooleanParam(queryParams.autoConnect);
const shouldAutoConnect = autoConnect ?? Boolean(queryParams.room && queryParams.topologyId);
if (shouldAutoConnect) {
  connect().catch(() => {});
}

topologyIdInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && connectionState === CONNECTION_STATE.DISCONNECTED) {
    connect().catch(() => {});
  }
});

window.addEventListener('beforeunload', () => {
  stopTelemetryLoop();
  stopDebugLoop();
  stopChaosPolling();
  if (attachSessionChannel) {
    try {
      attachSessionChannel.close();
    } catch (_) {
      // no-op
    }
    attachSessionChannel = null;
  }
  if (node) {
    node.stop().catch(() => {});
  }
});

updateChaosPanel();
updateHud();
