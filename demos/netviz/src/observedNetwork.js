const number = (value) => Number.isFinite(value) && value >= 0 ? value : 0;
const key = (a, b) => a < b ? `${a}|${b}` : `${b}|${a}`;

/** Reports describe network instances, not physical computers or a global census. */
export function buildObservedNetwork(reports = [], {
  application = '', role = '', includeGhosts = true, legacySessions = [], relayIds = new Set(), now = Date.now()
} = {}) {
  const records = new Map();
  for (const report of reports) {
    if (!report?.peerId || !Number.isFinite(report.receivedAt) || now - report.receivedAt > 60_000) continue;
    const old = records.get(report.peerId);
    if (!old || report.receivedAt >= old.receivedAt) records.set(report.peerId, {
      ...report, stale: Boolean(report.stale) || now - report.receivedAt > 15_000,
      source: 'network-report', reported: true
    });
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
    const peer = { peerId: session.peerId, application: session.gameId || 'unknown', role: 'world',
      gameId: session.gameId, roomId: session.roomId, topologyId: session.topologyId,
      source: 'session-only', sessionOnly: true, reported: false };
    if (matches(peer)) { peers.set(peer.peerId, peer); sessionOnly++; }
  }
  const edges = new Map();
  for (const report of selected) {
    for (const neighbor of report.peers || []) {
      const to = neighbor?.peerId;
      if (!to || to === report.peerId) continue;
      // A filtered-out reporter must not reappear disguised as a ghost.
      if (records.has(to) && !peers.has(to)) continue;
      if (!peers.has(to)) {
        if (!includeGhosts && !relayIds.has(to)) continue;
        peers.set(to, { peerId: to, inferred: true, isRelay: relayIds.has(to), reported: false, source: 'reported-endpoint' });
      }
      const id = key(report.peerId, to), previous = edges.get(id);
      const candidate = { from: report.peerId, to, via: neighbor.via || 'unknown',
        signalingPath: neighbor.signalingPath || 'unknown', mediaPath: neighbor.mediaPath || 'unknown',
        rxBps: number(neighbor.rxBps), txBps: number(neighbor.txBps),
        rxCount: number(neighbor.rxCount), txCount: number(neighbor.txCount),
        rttMs: Number.isFinite(neighbor.rttMs) ? neighbor.rttMs : null,
        stale: report.stale, source: 'network-report', reportedBy: [report.peerId] };
      if (previous) {
        previous.reportedBy.push(report.peerId);
        previous.stale = previous.stale && candidate.stale;
        // Rates from opposite endpoints describe the same traffic; do not sum.
        previous.rxBps = Math.max(previous.rxBps, candidate.txBps);
        previous.txBps = Math.max(previous.txBps, candidate.rxBps);
      } else edges.set(id, candidate);
    }
  }
  const models = new Map();
  const compute = { workerCount: 0, activeTasks: 0, queuedTasks: 0, totalTasksCompleted: 0, totalTasksFailed: 0 };
  for (const report of selected.filter((r) => !r.stale)) {
    for (const field of Object.keys(compute)) compute[field] += number(report.compute?.[field]);
    if (report.modelsStatus === 'unavailable') continue;
    for (const model of report.models || []) {
      if (!model?.manifestCid) continue;
      let group = models.get(model.manifestCid);
      if (!group) models.set(model.manifestCid, group = { ...model, hosts: [] });
      if (!group.hosts.some((host) => host.peerId === report.peerId)) group.hosts.push({ peerId: report.peerId, busy: Boolean(model.busy) });
    }
  }
  const grouped = [...models.values()].map((model) => ({ ...model,
    hostCount: model.hosts.length, busyCount: model.hosts.filter((h) => h.busy).length,
    busy: model.hosts.every((h) => h.busy) })).sort((a, b) => (a.name || a.manifestCid).localeCompare(b.name || b.manifestCid));
  return { peers: [...peers.values()], edges: [...edges.values()], reports: selected,
    applications: [...applications].sort(), models: grouped, compute,
    summary: { reporting: selected.length, active: selected.filter((r) => !r.stale).length,
      stale: selected.filter((r) => r.stale).length, sessionOnly,
      modelsUnavailable: selected.filter((r) => !r.stale && r.modelsStatus === 'unavailable').length,
      inferred: [...peers.values()].filter((r) => r.inferred).length, models: grouped.length } };
}

export function attachedScope(session) {
  return { gameId: String(session?.gameId || 'netviz'), roomId: String(session?.roomId || 'telemetry'),
    topologyId: String(session?.topologyId || 'netviz-topology'), topologyType: String(session?.topologyType || 'distributed') };
}

export function describeObservedPeer(peer, now = Date.now()) {
  if (!peer) return null;
  const lines = [`Peer ID: ${peer.peerId}`];
  if (peer.sessionOnly) return { title: `${peer.application} · session only`,
    lines: [...lines, 'Legacy session beacon; network telemetry unavailable.', 'Refresh this demo from an updated build to report links, compute and models.'] };
  if (peer.inferred) return { title: 'Reported endpoint', lines: [...lines,
    'Named in another peer’s link report; no telemetry received from this endpoint.'] };
  lines.push(`Application: ${peer.application || peer.gameId || 'unknown'}`, `Connection role: ${peer.role || 'unknown'}`,
    `Report: ${peer.stale ? 'stale' : 'recent'} · received ${Math.max(0, Math.floor((now - peer.receivedAt) / 1000))}s ago`,
    `Topology: ${peer.topologyId || '--'}`, `Room: ${peer.roomId || '--'}`,
    `Workers: ${number(peer.compute?.workerCount)} · active ${number(peer.compute?.activeTasks)} · queued ${number(peer.compute?.queuedTasks)}`,
    `Tasks completed: ${number(peer.compute?.totalTasksCompleted)} · failed ${number(peer.compute?.totalTasksFailed)}`,
    'Hosted models:', ...(peer.modelsStatus === 'unavailable' ? ['Hosting status unavailable; this is not a confirmed empty model list.']
      : peer.models?.length ? peer.models.map((m) => `${m.name || m.manifestCid} · ${m.task || 'unknown'}${m.busy ? ' (busy)' : ''}`) : ['None advertised']),
    'Operational values are reported by this peer, not independently measured.');
  return { title: `${peer.application || peer.gameId || 'Peer'} · ${peer.role || 'network'}`, lines };
}
