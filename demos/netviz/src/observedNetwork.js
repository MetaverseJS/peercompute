import {
  buildSubgroupClusters,
  computeGraphDiagnostics
} from './networkAnalysis.js';

const number = (value) => (Number.isFinite(value) && value >= 0 ? value : 0);
const key = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

const VIA_RANK = {
  webrtc: 5,
  direct: 4,
  'direct-websocket': 4,
  websocket: 3,
  'relay-webrtc': 3,
  relay: 2,
  presence: 1,
  unknown: 0
};
const SIGNALING_RANK = { direct: 2, 'relay-scoped': 1, unknown: 0 };
const MEDIA_RANK = { direct: 3, 'turn-relay': 2, unknown: 0 };
const ICE_PATH_RANK = {
  'lan-host': 6,
  'nat-prflx': 5,
  'nat-srflx': 4,
  'direct-ws': 3,
  'direct-tcp': 3,
  'turn-relay': 2,
  'circuit-relay': 1
};

const pickRanked = (a, b, table, fallback = 'unknown') => {
  const rankA = table[a] ?? -1;
  const rankB = table[b] ?? -1;
  if (rankB > rankA) return b;
  if (rankA >= 0) return a;
  return b || fallback;
};

const mergeRtt = (a, b) => {
  const validA = Number.isFinite(a) && a >= 0;
  const validB = Number.isFinite(b) && b >= 0;
  if (validA && validB) return Math.round((a + b) / 2);
  if (validA) return a;
  if (validB) return b;
  return null;
};

const mergeWorkMesh = (a, b) => {
  if (!a && !b) return null;
  if (!a) return { ...b };
  if (!b) return { ...a };
  return {
    tasksPerSec: Math.max(number(a.tasksPerSec), number(b.tasksPerSec)),
    linkCost: Math.min(
      Number.isFinite(a.linkCost) && a.linkCost > 0 ? a.linkCost : Infinity,
      Number.isFinite(b.linkCost) && b.linkCost > 0 ? b.linkCost : Infinity
    ) === Infinity ? 0 : Math.min(
      Number.isFinite(a.linkCost) && a.linkCost > 0 ? a.linkCost : Infinity,
      Number.isFinite(b.linkCost) && b.linkCost > 0 ? b.linkCost : Infinity
    ),
    inFlight: Math.max(number(a.inFlight), number(b.inFlight)),
    streamResets: number(a.streamResets) + number(b.streamResets)
  };
};

/** Reports describe network instances, not physical computers or a global census. */
export function buildObservedNetwork(reports = [], {
  application = '',
  role = '',
  groupBy = 'room',
  subgroup = '',
  includeGhosts = true,
  legacySessions = [],
  rootNodes = [],
  relayIds = new Set(),
  now = Date.now()
} = {}) {
  const relaySet = relayIds instanceof Set ? new Set(relayIds) : new Set(relayIds || []);
  const records = new Map();
  for (const report of reports) {
    if (!report?.peerId || !Number.isFinite(report.receivedAt) || now - report.receivedAt > 60_000) continue;
    const old = records.get(report.peerId);
    if (!old || report.receivedAt >= old.receivedAt) {
      records.set(report.peerId, {
        ...report,
        stale: Boolean(report.stale) || now - report.receivedAt > 15_000,
        source: 'network-report',
        reported: true
      });
    }
    if (report.relayState?.relayPeerId) {
      relaySet.add(report.relayState.relayPeerId);
    }
  }
  for (const root of Array.isArray(rootNodes) ? rootNodes : []) {
    if (!root?.peerId) continue;
    const rootRelayIds = Array.isArray(root.relayPeerIds) ? root.relayPeerIds.filter(Boolean) : [];
    for (const rid of rootRelayIds) relaySet.add(rid);
    const expired = Number.isFinite(root.expiresAt) ? root.expiresAt < now : false;
    const existing = records.get(root.peerId);
    const rootDirectory = {
      schema: root.schema || 'peercompute.model-evidence-directory.v1',
      protocol: root.protocol || '/peercompute/model-evidence/1.0.0',
      expiresAt: Number.isFinite(root.expiresAt) ? root.expiresAt : null,
      addresses: Array.isArray(root.addresses) ? root.addresses.slice(0, 8) : [],
      sourceUrl: root.sourceUrl || null
    };
    if (existing) {
      records.set(root.peerId, {
        ...existing,
        isRoot: true,
        role: existing.role || 'root',
        rootDirectory
      });
    } else {
      records.set(root.peerId, {
        peerId: root.peerId,
        isRoot: true,
        application: 'peercompute-root',
        role: 'root',
        gameId: 'peercompute-root',
        roomId: 'root',
        topologyId: 'root',
        topology: 'root',
        source: 'root-directory',
        reported: true,
        stale: expired,
        receivedAt: Number.isFinite(root.fetchedAt) ? root.fetchedAt : now,
        rootDirectory,
        relayState: {
          connected: rootRelayIds.length > 0 && !expired,
          role: 'permanent',
          keepReason: 'root-service',
          relayPeerId: rootRelayIds[0] || null,
          gossipMeshCount: 0,
          directMeshPeerCount: 0,
          minDirectMeshPeers: 0
        },
        peers: rootRelayIds.map((rid) => ({
          peerId: rid,
          via: 'direct',
          signalingPath: 'direct',
          mediaPath: 'direct',
          icePath: 'direct-ws',
          rxBps: 0,
          txBps: 0,
          rxCount: 0,
          txCount: 0
        })),
        compute: { workerCount: 0, activeTasks: 0, queuedTasks: 0, totalTasksCompleted: 0, totalTasksFailed: 0 },
        models: []
      });
    }
  }
  const applications = new Set([...records.values()].map((r) => r.application || r.gameId || 'unknown'));
  const matches = (r) => (!application || (r.application || r.gameId || 'unknown') === application)
    && (!role || r.role === role);
  const selected = [...records.values()].filter(matches);
  const peers = new Map(selected.map((r) => [r.peerId, r]));
  let sessionOnly = 0;
  for (const session of legacySessions) {
    if (!session?.peerId || session.isStarted === false || now - Number(session.ts || 0) > 15_000) continue;
    applications.add(session.gameId || 'unknown');
    if (records.has(session.peerId) || peers.has(session.peerId)) continue;
    const peer = {
      peerId: session.peerId,
      application: session.gameId || 'unknown',
      role: 'world',
      gameId: session.gameId,
      roomId: session.roomId,
      topologyId: session.topologyId,
      topology: session.topologyType || 'distributed',
      source: 'session-only',
      sessionOnly: true,
      reported: false
    };
    if (matches(peer)) {
      peers.set(peer.peerId, peer);
      sessionOnly += 1;
    }
  }

  const edges = new Map();
  const gossipEdges = new Map();
  for (const report of selected) {
    for (const neighbor of report.peers || []) {
      const to = neighbor?.peerId;
      if (!to || to === report.peerId) continue;
      // A filtered-out reporter must not reappear disguised as a ghost.
      if (records.has(to) && !peers.has(to)) continue;
      if (!peers.has(to)) {
        if (!includeGhosts && !relaySet.has(to)) continue;
        peers.set(to, {
          peerId: to,
          inferred: true,
          isRelay: relaySet.has(to),
          reported: false,
          source: 'reported-endpoint'
        });
      }
      const id = key(report.peerId, to);
      const previous = edges.get(id);
      const candidate = {
        from: report.peerId,
        to,
        via: neighbor.via || 'unknown',
        signalingPath: neighbor.signalingPath || 'unknown',
        mediaPath: neighbor.mediaPath || 'unknown',
        icePath: neighbor.icePath || null,
        iceProtocol: neighbor.iceProtocol || null,
        candidatePairRttMs: Number.isFinite(neighbor.candidatePairRttMs) ? neighbor.candidatePairRttMs : null,
        direction: neighbor.direction || null,
        connectionCount: Number.isFinite(neighbor.connectionCount) ? neighbor.connectionCount : 1,
        duplicateConnections: Boolean(neighbor.duplicateConnections),
        workRate: Number.isFinite(neighbor.workRate) ? neighbor.workRate : (number(neighbor.workMesh?.tasksPerSec) || 0),
        workMesh: neighbor.workMesh ? { ...neighbor.workMesh } : null,
        rxBps: number(neighbor.rxBps),
        txBps: number(neighbor.txBps),
        rxCount: number(neighbor.rxCount),
        txCount: number(neighbor.txCount),
        rttMs: Number.isFinite(neighbor.rttMs) ? neighbor.rttMs : null,
        stale: report.stale,
        source: 'network-report',
        reportedBy: [report.peerId]
      };
      if (previous) {
        if (!previous.reportedBy.includes(report.peerId)) previous.reportedBy.push(report.peerId);
        previous.stale = previous.stale && candidate.stale;
        // Rates and counts from opposite endpoints describe the same traffic; do not sum.
        previous.rxBps = Math.max(previous.rxBps, candidate.txBps);
        previous.txBps = Math.max(previous.txBps, candidate.rxBps);
        previous.rxCount = Math.max(previous.rxCount, candidate.txCount);
        previous.txCount = Math.max(previous.txCount, candidate.rxCount);
        // Merge transport, ICE path, RTT, duplicate status, and WorkMesh fields from both endpoints.
        previous.via = pickRanked(previous.via, candidate.via, VIA_RANK, 'unknown');
        previous.signalingPath = pickRanked(previous.signalingPath, candidate.signalingPath, SIGNALING_RANK, 'unknown');
        previous.mediaPath = pickRanked(previous.mediaPath, candidate.mediaPath, MEDIA_RANK, 'unknown');
        previous.icePath = pickRanked(previous.icePath, candidate.icePath, ICE_PATH_RANK, null);
        previous.iceProtocol = previous.iceProtocol || candidate.iceProtocol || null;
        previous.rttMs = mergeRtt(previous.rttMs, candidate.rttMs);
        previous.candidatePairRttMs = mergeRtt(previous.candidatePairRttMs, candidate.candidatePairRttMs);
        previous.connectionCount = Math.max(previous.connectionCount || 1, candidate.connectionCount || 1);
        previous.duplicateConnections = previous.duplicateConnections || candidate.duplicateConnections;
        if (candidate.direction && previous.direction && candidate.direction !== previous.direction) {
          previous.direction = 'both';
        } else if (!previous.direction && candidate.direction) {
          previous.direction = candidate.direction;
        }
        previous.workRate = Math.max(number(previous.workRate), number(candidate.workRate));
        previous.workMesh = mergeWorkMesh(previous.workMesh, candidate.workMesh);
      } else {
        edges.set(id, candidate);
      }
    }

    // Real Gossipsub mesh overlay reported by this peer
    for (const meshPeerId of report.gossipMeshPeers || []) {
      if (!meshPeerId || meshPeerId === report.peerId) continue;
      if (records.has(meshPeerId) && !peers.has(meshPeerId)) continue;
      if (!peers.has(meshPeerId)) {
        if (!includeGhosts && !relaySet.has(meshPeerId)) continue;
        peers.set(meshPeerId, {
          peerId: meshPeerId,
          inferred: true,
          isRelay: relaySet.has(meshPeerId),
          reported: false,
          source: 'reported-endpoint'
        });
      }
      const gid = key(report.peerId, meshPeerId);
      const existing = gossipEdges.get(gid);
      if (existing) {
        if (!existing.reportedBy.includes(report.peerId)) existing.reportedBy.push(report.peerId);
        existing.stale = existing.stale && report.stale;
      } else {
        gossipEdges.set(gid, {
          from: report.peerId,
          to: meshPeerId,
          layer: 'gossipsub',
          stale: report.stale,
          reportedBy: [report.peerId]
        });
      }
    }
  }

  const allPeers = [...peers.values()];
  const allEdges = [...edges.values()];
  const allGossipEdges = [...gossipEdges.values()];
  const { clusters: subgroups, peerToGroup } = buildSubgroupClusters(allPeers, allEdges, {
    groupBy: groupBy || 'room',
    relayIds: relaySet
  });
  for (const peer of allPeers) {
    peer.subgroupId = peerToGroup.get(peer.peerId) || null;
  }

  // Optional non-disruptive subgroup focus filter (keeps relays connected to focused peers).
  let filteredPeers = allPeers;
  let filteredEdges = allEdges;
  let filteredGossipEdges = allGossipEdges;
  if (subgroup) {
    const focusIds = new Set(
      allPeers
        .filter((peer) => peer.subgroupId === subgroup)
        .map((peer) => peer.peerId)
    );
    for (const edge of allEdges) {
      if (focusIds.has(edge.from) && relaySet.has(edge.to)) focusIds.add(edge.to);
      if (focusIds.has(edge.to) && relaySet.has(edge.from)) focusIds.add(edge.from);
    }
    filteredPeers = allPeers.filter((peer) => focusIds.has(peer.peerId));
    filteredEdges = allEdges.filter((edge) => focusIds.has(edge.from) && focusIds.has(edge.to));
    filteredGossipEdges = allGossipEdges.filter((edge) => focusIds.has(edge.from) && focusIds.has(edge.to));
  }

  const workMeshEdges = filteredEdges
    .filter((edge) => number(edge.workRate) > 0 || number(edge.workMesh?.tasksPerSec) > 0)
    .map((edge) => ({
      ...edge,
      layer: 'workmesh',
      tasksPerSec: number(edge.workMesh?.tasksPerSec) || number(edge.workRate)
    }));

  const diagnostics = computeGraphDiagnostics(filteredPeers, filteredEdges, { relayIds: relaySet });
  const visiblePeerIds = new Set(filteredPeers.map((peer) => peer.peerId));

  const models = new Map();
  const compute = { workerCount: 0, activeTasks: 0, queuedTasks: 0, totalTasksCompleted: 0, totalTasksFailed: 0 };
  for (const report of selected.filter((r) => !r.stale && visiblePeerIds.has(r.peerId))) {
    for (const field of Object.keys(compute)) compute[field] += number(report.compute?.[field]);
    if (report.modelsStatus === 'unavailable') continue;
    for (const model of report.models || []) {
      if (!model?.manifestCid) continue;
      let group = models.get(model.manifestCid);
      if (!group) models.set(model.manifestCid, (group = { ...model, hosts: [] }));
      if (!group.hosts.some((host) => host.peerId === report.peerId)) {
        group.hosts.push({ peerId: report.peerId, busy: Boolean(model.busy) });
      }
    }
  }
  const grouped = [...models.values()].map((model) => ({
    ...model,
    hostCount: model.hosts.length,
    busyCount: model.hosts.filter((h) => h.busy).length,
    busy: model.hosts.every((h) => h.busy)
  })).sort((a, b) => (a.name || a.manifestCid).localeCompare(b.name || b.manifestCid));

  const visibleSelected = selected.filter((r) => visiblePeerIds.has(r.peerId));
  return {
    peers: filteredPeers,
    edges: filteredEdges,
    gossipEdges: filteredGossipEdges,
    workMeshEdges,
    reports: visibleSelected,
    applications: [...applications].sort(),
    subgroups,
    diagnostics,
    models: grouped,
    compute,
    summary: {
      reporting: visibleSelected.length,
      active: visibleSelected.filter((r) => !r.stale).length,
      stale: visibleSelected.filter((r) => r.stale).length,
      sessionOnly: filteredPeers.filter((p) => p.sessionOnly).length,
      modelsUnavailable: visibleSelected.filter((r) => !r.stale && r.modelsStatus === 'unavailable').length,
      inferred: filteredPeers.filter((p) => p.inferred).length,
      rootNodes: filteredPeers.filter((p) => p.isRoot).length,
      models: grouped.length,
      subgroups: subgroups.length
    }
  };
}

export function attachedScope(session) {
  return {
    gameId: String(session?.gameId || 'netviz'),
    roomId: String(session?.roomId || 'telemetry'),
    topologyId: String(session?.topologyId || 'netviz-topology'),
    topologyType: String(session?.topologyType || 'distributed')
  };
}

export function describeObservedPeer(peer, now = Date.now()) {
  if (!peer) return null;
  const lines = [`Peer ID: ${peer.peerId}`];
  if (peer.sessionOnly) {
    return {
      title: `${peer.application} · session only`,
      lines: [
        ...lines,
        'Legacy session beacon; network telemetry unavailable.',
        'Refresh this demo from an updated build to report links, compute and models.'
      ]
    };
  }
  if (peer.isRoot && peer.source === 'root-directory') {
    const dir = peer.rootDirectory || {};
    const ttlSec = Number.isFinite(dir.expiresAt) ? Math.round((dir.expiresAt - now) / 1000) : null;
    const relayPeers = (peer.peers || []).map((n) => n?.peerId).filter(Boolean);
    return {
      title: 'Root Node · peercompute-root',
      lines: [
        ...lines,
        'Role: root (persistent model-evidence registry)',
        `Protocol: ${dir.protocol || '/peercompute/model-evidence/1.0.0'}`,
        `Directory status: ${peer.stale ? 'stale / expired' : 'live'}${ttlSec !== null ? ` (${ttlSec >= 0 ? `expires in ${ttlSec}s` : `expired ${Math.abs(ttlSec)}s ago`})` : ''}`,
        `Attached relay(s): ${relayPeers.length ? relayPeers.join(', ') : 'none'}`,
        `Announced circuit addrs: ${Array.isArray(dir.addresses) ? dir.addresses.length : 0}`,
        ...(dir.sourceUrl ? [`Directory URL: ${dir.sourceUrl}`] : []),
        'Discovered from the signed public root directory descriptor (root disables pubsub telemetry).'
      ]
    };
  }
  if (peer.inferred) {
    return {
      title: peer.isRelay ? 'Relay server' : 'Reported endpoint',
      lines: [
        ...lines,
        peer.isRelay
          ? 'Known relay server referenced in peer link reports.'
          : 'Named in another peer’s link report; no telemetry received from this endpoint.'
      ]
    };
  }
  const appName = peer.application || peer.gameId || 'unknown';
  const roleDesc = peer.role === 'models' && appName !== 'inference'
    ? `models (shared model-network client for ${appName}; separate from its world connection)`
    : (peer.role || 'unknown');
  lines.push(
    `Application: ${appName}`,
    `Connection role: ${roleDesc}`,
    `Report: ${peer.stale ? 'stale' : 'recent'} · received ${Math.max(0, Math.floor((now - peer.receivedAt) / 1000))}s ago`,
    `Topology: ${peer.topologyId || '--'} (${peer.topology || 'distributed'})`,
    `Room: ${peer.roomId || '--'}`
  );
  if (Number.isFinite(peer.targetConnections) || Number.isFinite(peer.maxConnections)) {
    lines.push(`Degree target/max: ${peer.peerCount ?? 0} / target ${peer.targetConnections ?? '--'} · max ${peer.maxConnections ?? '--'}`);
  }
  if (peer.relayState) {
    lines.push(
      `Relay: ${peer.relayState.connected ? 'connected' : 'off-relay'} · role=${peer.relayState.role} · reason=${peer.relayState.keepReason}`,
      `Gossipsub mesh: ${peer.relayState.gossipMeshCount ?? 0} peers (direct ${peer.relayState.directMeshPeerCount ?? 0}/${peer.relayState.minDirectMeshPeers ?? '--'})`
    );
  }
  if (Number.isFinite(peer.rewiresPerMin) || Number.isFinite(peer.dialFailures)) {
    lines.push(`Stability: ${peer.rewiresPerMin ?? 0} rewires/min · ${peer.dialFailures ?? 0} dial failures`);
  }
  if (peer.capabilities) {
    const cap = peer.capabilities;
    lines.push(
      `Hardware: tier=${cap.resourceTier || 'unknown'} · cores=${cap.cpuCores || '--'} · gpu=${cap.gpuHardwareVerified ? 'verified' : (cap.gpuAvailable ? 'available' : 'none')}${cap.performanceClass ? ` · ${cap.performanceClass}` : ''}`
    );
  }
  lines.push(
    `Workers: ${number(peer.compute?.workerCount)} · active ${number(peer.compute?.activeTasks)} · queued ${number(peer.compute?.queuedTasks)}`,
    `Tasks completed: ${number(peer.compute?.totalTasksCompleted)} · failed ${number(peer.compute?.totalTasksFailed)}`,
    'Hosted models:',
    ...(peer.modelsStatus === 'unavailable'
      ? ['Hosting status unavailable; this is not a confirmed empty model list.']
      : peer.models?.length
        ? peer.models.map((m) => `${m.name || m.manifestCid} · ${m.task || 'unknown'}${m.busy ? ' (busy)' : ''}`)
        : ['None advertised']),
    'Operational values are reported by this peer, not independently measured.'
  );
  return { title: `${peer.application || peer.gameId || 'Peer'} · ${peer.role || 'network'}`, lines };
}
