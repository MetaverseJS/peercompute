/**
 * Whole-network and subgroup graph analytics, rolling telemetry history,
 * SVG sparkline rendering, and snapshot export for NetViz.
 */

export const NETVIZ_ANALYSIS_SCHEMA = 'peercompute.netviz-analysis.v1';

const EDGE_KEY = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const safeNum = (v) => (Number.isFinite(v) && v >= 0 ? v : 0);

const SUBGROUP_PALETTE = [
  '#00ff6a',
  '#00ffd4',
  '#ffb13b',
  '#ff4fb3',
  '#7aa7ff',
  '#b8ff4d',
  '#ff8552',
  '#c084fc',
  '#38bdf8',
  '#facc15'
];

const hashText = (value) => {
  let h = 2166136261;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export function classifyEdgeTransport(edge) {
  const icePath = String(edge?.icePath || '').trim().toLowerCase();
  if (icePath) return icePath;
  const media = String(edge?.mediaPath || '').trim().toLowerCase();
  const via = String(edge?.via || '').trim().toLowerCase();
  if (media === 'turn-relay') {
    return via === 'relay' ? 'circuit-relay' : 'turn-relay';
  }
  if (via === 'relay') return 'circuit-relay';
  if (via === 'direct' || via === 'direct-websocket' || via === 'websocket') return 'direct-ws';
  if (media === 'direct' || via === 'webrtc') return 'webrtc-direct';
  if (via === 'relay-webrtc') return 'relay-webrtc';
  return 'unknown';
}

export function isDirectTransportCategory(cat) {
  return cat === 'lan-host' || cat === 'nat-srflx' || cat === 'nat-prflx' || cat === 'webrtc-direct' || cat === 'direct-ws' || cat === 'direct-tcp';
}

function findConnectedComponents(nodeIds, adjacency) {
  const visited = new Set();
  const components = [];
  for (const id of nodeIds) {
    if (visited.has(id)) continue;
    const queue = [id];
    const members = [];
    visited.add(id);
    while (queue.length > 0) {
      const curr = queue.shift();
      members.push(curr);
      const neighbors = adjacency.get(curr);
      if (!neighbors) continue;
      for (const next of neighbors) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    members.sort();
    components.push(members);
  }
  components.sort((a, b) => (b.length - a.length) || a[0].localeCompare(b[0]));
  return components;
}

/** Tarjan's O(V + E) algorithm for bridge edges and articulation (cut) vertices. */
function findBridgesAndCutVertices(nodeIds, adjacency) {
  const disc = new Map();
  const low = new Map();
  const parent = new Map();
  const bridges = [];
  const cutVertices = new Set();
  let timer = 0;

  const dfs = (u) => {
    disc.set(u, timer);
    low.set(u, timer);
    timer += 1;
    let children = 0;
    const neighbors = adjacency.get(u);
    if (!neighbors) return;
    for (const v of neighbors) {
      if (!disc.has(v)) {
        children += 1;
        parent.set(v, u);
        dfs(v);
        low.set(u, Math.min(low.get(u), low.get(v)));
        if (!parent.has(u) && children > 1) {
          cutVertices.add(u);
        }
        if (parent.has(u) && low.get(v) >= disc.get(u)) {
          cutVertices.add(u);
        }
        if (low.get(v) > disc.get(u)) {
          bridges.push(EDGE_KEY(u, v));
        }
      } else if (v !== parent.get(u)) {
        low.set(u, Math.min(low.get(u), disc.get(v)));
      }
    }
  };

  for (const id of nodeIds) {
    if (!disc.has(id)) dfs(id);
  }
  bridges.sort();
  return {
    bridgeEdgeKeys: bridges,
    cutPeerIds: [...cutVertices].sort()
  };
}

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[idx];
}

export function computeGraphDiagnostics(peers = [], edges = [], { relayIds = new Set() } = {}) {
  const relaySet = relayIds instanceof Set ? relayIds : new Set(relayIds || []);
  const peerById = new Map();
  for (const peer of peers) {
    if (!peer?.peerId) continue;
    peerById.set(peer.peerId, peer);
    if (peer.isRelay) relaySet.add(peer.peerId);
  }

  const allNodeIds = [...peerById.keys()];
  const nonRelayIds = allNodeIds.filter((id) => !relaySet.has(id));
  const nonRelaySet = new Set(nonRelayIds);

  const adjWithRelay = new Map(allNodeIds.map((id) => [id, new Set()]));
  const adjWithoutRelay = new Map(nonRelayIds.map((id) => [id, new Set()]));
  const relayNeighborsByPeer = new Map();

  const pathMix = {
    'lan-host': 0,
    'nat-srflx': 0,
    'nat-prflx': 0,
    'webrtc-direct': 0,
    'relay-webrtc': 0,
    'turn-relay': 0,
    'circuit-relay': 0,
    'direct-ws': 0,
    'direct-tcp': 0,
    unknown: 0
  };

  let p2pEdgeCount = 0;
  let duplicateEdgeCount = 0;
  let totalRxBps = 0;
  let totalTxBps = 0;
  let totalWorkRate = 0;
  let workMeshEdgeCount = 0;
  let totalStreamResets = 0;
  const rttSamples = [];

  for (const edge of edges) {
    const a = edge?.from;
    const b = edge?.to;
    if (!a || !b || a === b) continue;
    if (!peerById.has(a) || !peerById.has(b)) continue;

    adjWithRelay.get(a)?.add(b);
    adjWithRelay.get(b)?.add(a);

    const aRelay = relaySet.has(a);
    const bRelay = relaySet.has(b);
    if (aRelay !== bRelay) {
      const peerSide = aRelay ? b : a;
      const relaySide = aRelay ? a : b;
      let set = relayNeighborsByPeer.get(peerSide);
      if (!set) {
        set = new Set();
        relayNeighborsByPeer.set(peerSide, set);
      }
      set.add(relaySide);
      continue;
    }
    if (aRelay && bRelay) continue;

    // Non-relay P2P edge
    p2pEdgeCount += 1;
    adjWithoutRelay.get(a)?.add(b);
    adjWithoutRelay.get(b)?.add(a);

    const cat = classifyEdgeTransport(edge);
    pathMix[cat] = (pathMix[cat] || 0) + 1;
    if (edge.duplicateConnections) duplicateEdgeCount += 1;
    totalRxBps += safeNum(edge.rxBps);
    totalTxBps += safeNum(edge.txBps);
    const rtt = Number.isFinite(edge.candidatePairRttMs) ? edge.candidatePairRttMs : edge.rttMs;
    if (Number.isFinite(rtt) && rtt >= 0) rttSamples.push(rtt);
    const wr = safeNum(edge.workRate) || safeNum(edge.workMesh?.tasksPerSec);
    if (wr > 0) {
      totalWorkRate += wr;
      workMeshEdgeCount += 1;
    }
    totalStreamResets += safeNum(edge.workMesh?.streamResets);
  }

  const componentsWithoutRelay = findConnectedComponents(nonRelayIds, adjWithoutRelay);
  const componentsWithRelayRaw = findConnectedComponents(allNodeIds, adjWithRelay);
  // Project with-relay components down to non-relay peers for fair comparison.
  const componentsWithRelay = componentsWithRelayRaw
    .map((group) => group.filter((id) => nonRelaySet.has(id)))
    .filter((group) => group.length > 0);

  const { bridgeEdgeKeys, cutPeerIds } = findBridgesAndCutVertices(nonRelayIds, adjWithoutRelay);

  const isolatedPeers = [];
  const relayDependentPeers = [];
  const underTargetPeers = [];
  let degreeSum = 0;
  let minDegree = nonRelayIds.length ? Infinity : 0;
  let maxDegree = 0;
  let totalRewiresPerMin = 0;
  let totalDialFailures = 0;
  let gossipMeshSum = 0;
  let gossipReporters = 0;

  // Relay audit
  const relayAuditById = new Map();
  const keepReasonCounts = {};
  let relayConnectedPeers = 0;
  let relayKeeperCount = 0;

  const ensureRelayBucket = (relayId) => {
    const key = relayId || 'unattributed-relay';
    let bucket = relayAuditById.get(key);
    if (!bucket) {
      bucket = {
        relayPeerId: key,
        connectedPeers: 0,
        keepers: 0,
        electedKeepers: 0,
        permanent: 0,
        holding: 0,
        keepReasons: {}
      };
      relayAuditById.set(key, bucket);
    }
    return bucket;
  };

  for (const id of nonRelayIds) {
    const peer = peerById.get(id);
    const deg = adjWithoutRelay.get(id)?.size || 0;
    degreeSum += deg;
    if (deg < minDegree) minDegree = deg;
    if (deg > maxDegree) maxDegree = deg;
    const hasRelayEdge = (relayNeighborsByPeer.get(id)?.size || 0) > 0 || peer?.relayState?.connected === true;
    if (deg === 0) {
      isolatedPeers.push(id);
      if (hasRelayEdge) relayDependentPeers.push(id);
    }
    if (Number.isFinite(peer?.targetConnections) && peer.targetConnections > 0 && deg < peer.targetConnections) {
      underTargetPeers.push(id);
    }
    totalRewiresPerMin += safeNum(peer?.rewiresPerMin);
    totalDialFailures += safeNum(peer?.dialFailures);
    if (Array.isArray(peer?.gossipMeshPeers)) {
      gossipMeshSum += peer.gossipMeshPeers.length;
      gossipReporters += 1;
    }

    const rs = peer?.relayState;
    if (rs?.connected || hasRelayEdge) {
      relayConnectedPeers += 1;
      const relayId = rs?.relayPeerId || [...(relayNeighborsByPeer.get(id) || [])][0] || 'unattributed-relay';
      const bucket = ensureRelayBucket(relayId);
      bucket.connectedPeers += 1;
      const role = rs?.role || 'holding';
      if (role === 'keeper') { bucket.keepers += 1; relayKeeperCount += 1; }
      else if (role === 'elected-keeper') { bucket.electedKeepers += 1; relayKeeperCount += 1; }
      else if (role === 'permanent') { bucket.permanent += 1; relayKeeperCount += 1; }
      else { bucket.holding += 1; }
      const reason = rs?.keepReason || 'unknown';
      bucket.keepReasons[reason] = (bucket.keepReasons[reason] || 0) + 1;
      keepReasonCounts[reason] = (keepReasonCounts[reason] || 0) + 1;
    }
  }

  rttSamples.sort((a, b) => a - b);
  const directEdgeCount = Object.entries(pathMix)
    .reduce((sum, [cat, count]) => sum + (isDirectTransportCategory(cat) ? count : 0), 0);
  const lanEdgeCount = pathMix['lan-host'] || 0;
  const turnEdgeCount = (pathMix['turn-relay'] || 0) + (pathMix['circuit-relay'] || 0);

  const componentCount = componentsWithoutRelay.length;
  const componentCountWithRelay = componentsWithRelay.length;
  const isPartitioned = nonRelayIds.length > 1 && componentCount > 1;
  const wouldPartitionWithoutRelay = nonRelayIds.length > 1
    && componentCount > componentCountWithRelay;

  return {
    nodeCount: nonRelayIds.length,
    relayCount: relaySet.size,
    p2pEdgeCount,
    duplicateEdgeCount,
    componentCount,
    componentCountWithRelay,
    largestComponentSize: componentsWithoutRelay[0]?.length || 0,
    components: componentsWithoutRelay.map((memberIds, index) => ({
      index,
      size: memberIds.length,
      peerIds: memberIds
    })),
    isPartitioned,
    wouldPartitionWithoutRelay,
    isolatedPeers,
    relayDependentPeers,
    underTargetPeers,
    bridgeEdgeKeys,
    cutPeerIds,
    avgDegree: nonRelayIds.length ? Number((degreeSum / nonRelayIds.length).toFixed(2)) : 0,
    minDegree: nonRelayIds.length ? minDegree : 0,
    maxDegree,
    medianRttMs: percentile(rttSamples, 0.5),
    p95RttMs: percentile(rttSamples, 0.95),
    pathMix,
    directEdgeCount,
    lanEdgeCount,
    turnEdgeCount,
    directPct: p2pEdgeCount ? Math.round((directEdgeCount / p2pEdgeCount) * 100) : 0,
    lanPct: p2pEdgeCount ? Math.round((lanEdgeCount / p2pEdgeCount) * 100) : 0,
    turnPct: p2pEdgeCount ? Math.round((turnEdgeCount / p2pEdgeCount) * 100) : 0,
    totalRxBps,
    totalTxBps,
    totalWorkRate: Number(totalWorkRate.toFixed(2)),
    workMeshEdgeCount,
    totalStreamResets,
    totalRewiresPerMin,
    totalDialFailures,
    avgGossipMeshDegree: gossipReporters ? Number((gossipMeshSum / gossipReporters).toFixed(2)) : null,
    relayAudit: {
      connectedPeers: relayConnectedPeers,
      keeperCount: relayKeeperCount,
      offRelayPeers: Math.max(0, nonRelayIds.length - relayConnectedPeers),
      keepReasonCounts,
      relays: [...relayAuditById.values()].sort((a, b) => b.connectedPeers - a.connectedPeers)
    }
  };
}

export function getPeerSubgroupDescriptor(peer, groupBy = 'room', edgeIndex = null) {
  if (!peer || peer.isRelay) return null;
  if (groupBy === 'relay') {
    const relayId = peer.relayState?.connected
      ? (peer.relayState.relayPeerId || 'relay-connected')
      : 'off-relay';
    const short = relayId === 'off-relay'
      ? 'Off-relay (P2P only)'
      : relayId === 'relay-connected'
        ? 'Relay connected'
        : `Relay ${relayId.slice(0, 6)}…${relayId.slice(-4)}`;
    return { key: `relay:${relayId}`, label: short };
  }
  if (groupBy === 'topology') {
    const topo = peer.topology || 'distributed';
    return { key: `topology:${topo}`, label: `Topology: ${topo}` };
  }
  if (groupBy === 'transport') {
    const peerEdges = edgeIndex?.get(peer.peerId) || [];
    if (peerEdges.length === 0) {
      return { key: 'transport:isolated', label: 'Isolated / no P2P' };
    }
    const cats = peerEdges.map(classifyEdgeTransport);
    if (cats.includes('lan-host')) return { key: 'transport:lan-host', label: 'LAN direct (host)' };
    if (cats.some((c) => c === 'nat-srflx' || c === 'nat-prflx' || c === 'webrtc-direct' || c === 'direct-ws')) {
      return { key: 'transport:nat-direct', label: 'NAT direct (WebRTC)' };
    }
    if (cats.includes('turn-relay')) return { key: 'transport:turn-relay', label: 'TURN relayed' };
    if (cats.includes('circuit-relay')) return { key: 'transport:circuit-relay', label: 'Circuit relayed' };
    return { key: 'transport:mixed', label: 'Mixed / relay-webrtc' };
  }
  // Default: 'room' — group by (application, topologyId, roomId)
  const app = peer.application || peer.gameId || (peer.inferred ? 'inferred' : 'unknown');
  const topoId = peer.topologyId || '';
  const roomId = peer.roomId || '';
  const key = `room:${app}|${topoId}|${roomId}`;
  const parts = [app];
  if (roomId && roomId !== app) parts.push(roomId);
  else if (topoId && topoId !== app) parts.push(topoId);
  return { key, label: parts.join(' / ') };
}

export function buildSubgroupClusters(peers = [], edges = [], { groupBy = 'room', relayIds = new Set() } = {}) {
  const relaySet = relayIds instanceof Set ? relayIds : new Set(relayIds || []);
  const nonRelayPeers = peers.filter((peer) => peer?.peerId && !peer.isRelay && !relaySet.has(peer.peerId));
  const edgesByPeer = new Map();
  for (const edge of edges) {
    if (!edge?.from || !edge?.to) continue;
    if (relaySet.has(edge.from) || relaySet.has(edge.to)) continue;
    if (!edgesByPeer.has(edge.from)) edgesByPeer.set(edge.from, []);
    if (!edgesByPeer.has(edge.to)) edgesByPeer.set(edge.to, []);
    edgesByPeer.get(edge.from).push(edge);
    edgesByPeer.get(edge.to).push(edge);
  }

  const groups = new Map();
  const peerToGroup = new Map();

  for (const peer of nonRelayPeers) {
    const desc = getPeerSubgroupDescriptor(peer, groupBy, edgesByPeer);
    if (!desc) continue;
    let group = groups.get(desc.key);
    if (!group) {
      group = {
        id: desc.key,
        key: desc.key,
        label: desc.label,
        peers: [],
        peerIds: [],
        colorHex: SUBGROUP_PALETTE[hashText(desc.key) % SUBGROUP_PALETTE.length]
      };
      groups.set(desc.key, group);
    }
    group.peers.push(peer);
    group.peerIds.push(peer.peerId);
    peerToGroup.set(peer.peerId, desc.key);
  }

  const clusters = [];
  for (const group of groups.values()) {
    const memberSet = new Set(group.peerIds);
    const internalEdges = [];
    let crossEdges = 0;
    for (const edge of edges) {
      if (!edge?.from || !edge?.to) continue;
      if (relaySet.has(edge.from) || relaySet.has(edge.to)) continue;
      const inA = memberSet.has(edge.from);
      const inB = memberSet.has(edge.to);
      if (inA && inB) internalEdges.push(edge);
      else if (inA || inB) crossEdges += 1;
    }
    const diag = computeGraphDiagnostics(group.peers, internalEdges, { relayIds: relaySet });
    clusters.push({
      id: group.id,
      key: group.key,
      label: group.label,
      colorHex: group.colorHex,
      peerIds: group.peerIds,
      peerCount: group.peers.length,
      activeCount: group.peers.filter((p) => !p.stale && !p.inferred).length,
      staleCount: group.peers.filter((p) => p.stale).length,
      internalEdges: internalEdges.length,
      crossEdges,
      componentCount: diag.componentCount,
      isPartitioned: diag.isPartitioned,
      directPct: diag.directPct,
      lanEdgeCount: diag.lanEdgeCount,
      relayConnectedCount: diag.relayAudit.connectedPeers,
      medianRttMs: diag.medianRttMs,
      totalRxBps: diag.totalRxBps,
      totalTxBps: diag.totalTxBps,
      totalWorkRate: diag.totalWorkRate,
      bridgeCount: diag.bridgeEdgeKeys.length
    });
  }

  clusters.sort((a, b) => (b.peerCount - a.peerCount) || a.label.localeCompare(b.label));
  return { clusters, peerToGroup };
}

export class RollingMetricsHistory {
  constructor({ maxSamples = 180, minIntervalMs = 1500 } = {}) {
    this.maxSamples = Math.max(10, maxSamples);
    this.minIntervalMs = Math.max(250, minIntervalMs);
    this.samples = [];
    this.lastRecordedAt = 0;
  }

  record(diagnostics, now = Date.now()) {
    if (!diagnostics) return false;
    if (this.lastRecordedAt && now - this.lastRecordedAt < this.minIntervalMs) return false;
    this.lastRecordedAt = now;
    this.samples.push({
      ts: now,
      nodeCount: diagnostics.nodeCount || 0,
      p2pEdgeCount: diagnostics.p2pEdgeCount || 0,
      directPct: diagnostics.directPct || 0,
      lanPct: diagnostics.lanPct || 0,
      relayConnected: diagnostics.relayAudit?.connectedPeers || 0,
      medianRttMs: Number.isFinite(diagnostics.medianRttMs) ? diagnostics.medianRttMs : null,
      totalBps: (diagnostics.totalRxBps || 0) + (diagnostics.totalTxBps || 0),
      workRate: diagnostics.totalWorkRate || 0,
      rewiresPerMin: diagnostics.totalRewiresPerMin || 0,
      componentCount: diagnostics.componentCount || 0
    });
    if (this.samples.length > this.maxSamples) {
      this.samples.splice(0, this.samples.length - this.maxSamples);
    }
    return true;
  }

  clear() {
    this.samples = [];
    this.lastRecordedAt = 0;
  }

  list() {
    return this.samples.slice();
  }
}

export function buildSparklinePath(values = [], width = 110, height = 22) {
  const clean = values.map((v) => (Number.isFinite(v) ? v : null));
  const numeric = clean.filter((v) => v !== null);
  if (numeric.length < 2) return '';
  const min = Math.min(...numeric);
  const max = Math.max(...numeric);
  const span = max - min || 1;
  const pad = 2;
  const innerW = Math.max(1, width - pad * 2);
  const innerH = Math.max(1, height - pad * 2);
  const stepX = innerW / Math.max(1, clean.length - 1);
  const parts = [];
  let penDown = false;
  clean.forEach((v, idx) => {
    if (v === null) {
      penDown = false;
      return;
    }
    const x = (pad + idx * stepX).toFixed(1);
    const y = (pad + innerH - ((v - min) / span) * innerH).toFixed(1);
    parts.push(`${penDown ? 'L' : 'M'}${x},${y}`);
    penDown = true;
  });
  return parts.join(' ');
}

export function buildAnalysisSnapshot({
  viewMode = 'all',
  groupBy = 'room',
  colorLens = 'role',
  focusSubgroup = '',
  observedView = null,
  diagnostics = null,
  subgroups = [],
  history = [],
  now = Date.now()
} = {}) {
  return {
    schema: NETVIZ_ANALYSIS_SCHEMA,
    exportedAt: new Date(now).toISOString(),
    ts: now,
    viewMode,
    groupBy,
    colorLens,
    focusSubgroup: focusSubgroup || null,
    summary: observedView?.summary || null,
    compute: observedView?.compute || null,
    diagnostics: diagnostics || null,
    subgroups: Array.isArray(subgroups) ? subgroups : [],
    peers: Array.isArray(observedView?.peers) ? observedView.peers : [],
    edges: Array.isArray(observedView?.edges) ? observedView.edges : [],
    gossipEdges: Array.isArray(observedView?.gossipEdges) ? observedView.gossipEdges : [],
    workMeshEdges: Array.isArray(observedView?.workMeshEdges) ? observedView.workMeshEdges : [],
    models: Array.isArray(observedView?.models) ? observedView.models : [],
    history: Array.isArray(history) ? history : []
  };
}
