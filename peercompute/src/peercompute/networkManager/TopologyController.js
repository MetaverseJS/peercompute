const DEFAULT_TARGET_CONNECTIONS = 4;
const DEFAULT_MAX_CONNECTIONS = 5;
const DEFAULT_CONNECTION_RADIUS = 6;
const DEFAULT_ISOLATION_CONNECTIONS = 2;
const DEFAULT_LONG_RANGE_REFRESH_MS = 15000;
const DEFAULT_SHARD_SIZE = 8;
const DEFAULT_SHARD_RADIUS = 1;

const toNumber = (value, fallback) => (
  Number.isFinite(value) ? value : fallback
);

const normalizeMetric = (input) => {
  if (!input || typeof input !== 'object') return { x: 0, y: 0, z: 0 };
  const x = Number.isFinite(input.x) ? input.x : 0;
  const y = Number.isFinite(input.y) ? input.y : 0;
  const z = Number.isFinite(input.z) ? input.z : 0;
  return { x, y, z };
};

const distance = (a, b) => {
  const dx = (a?.x || 0) - (b?.x || 0);
  const dy = (a?.y || 0) - (b?.y || 0);
  const dz = (a?.z || 0) - (b?.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const hashString = (value) => {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickDeterministic = (candidates, count, seed) => {
  if (count <= 0) return [];
  const scored = candidates.map((entry) => ({
    entry,
    score: hashString(`${seed}:${entry.peerId}`)
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, count).map((item) => item.entry);
};

export class TopologyController {
  constructor(config = {}) {
    this.config = {
      topologyId: config.topologyId || 'default-topology',
      topologyType: config.topologyType || config.topology || 'distributed',
      targetConnections: toNumber(config.targetConnections, DEFAULT_TARGET_CONNECTIONS),
      maxConnections: toNumber(config.maxConnections, DEFAULT_MAX_CONNECTIONS),
      connectionRadius: toNumber(config.connectionRadius, DEFAULT_CONNECTION_RADIUS),
      isolationMinConnections: toNumber(config.isolationMinConnections, DEFAULT_ISOLATION_CONNECTIONS),
      longRangeCount: toNumber(config.longRangeCount, 1),
      longRangeRefreshMs: toNumber(config.longRangeRefreshMs, DEFAULT_LONG_RANGE_REFRESH_MS),
      shardSize: toNumber(config.shardSize, DEFAULT_SHARD_SIZE),
      shardRadius: toNumber(config.shardRadius, DEFAULT_SHARD_RADIUS),
      enforceTopologyScope: config.enforceTopologyScope !== false,
      allowRelayWhenIsolated: config.allowRelayWhenIsolated !== false
    };
    this.peerId = config.peerId || null;
    this.localMetric = normalizeMetric(config.metric);
    this.longRangePeers = new Set();
    this.lastLongRangeAt = 0;
    this.desiredPeers = new Set();
    this.referralPeers = new Set();
    this.priorityPeers = [];
  }

  setPeerId(peerId) {
    this.peerId = peerId || null;
  }

  setLocalMetric(metric) {
    this.localMetric = normalizeMetric(metric);
  }

  setConnectionLimits({ targetConnections, maxConnections } = {}) {
    if (Number.isFinite(targetConnections)) {
      this.config.targetConnections = Math.max(1, targetConnections);
    }
    if (Number.isFinite(maxConnections)) {
      this.config.maxConnections = Math.max(1, maxConnections);
    }
  }

  setPriorityPeers(peerIds = []) {
    if (!Array.isArray(peerIds)) {
      this.priorityPeers = [];
      return;
    }
    const ordered = [];
    peerIds.forEach((peerId) => {
      if (!peerId) return;
      if (ordered.includes(peerId)) return;
      ordered.push(peerId);
    });
    this.priorityPeers = ordered;
  }

  addReferralPeers(peerIds = []) {
    peerIds.forEach((peerId) => {
      if (peerId) this.referralPeers.add(peerId);
    });
  }

  clearReferral(peerId) {
    if (!peerId) return;
    this.referralPeers.delete(peerId);
  }

  getShardId(metric = this.localMetric) {
    const size = this.config.shardSize || DEFAULT_SHARD_SIZE;
    const pos = normalizeMetric(metric);
    const sx = Math.floor(pos.x / size);
    const sy = Math.floor(pos.y / size);
    const sz = Math.floor(pos.z / size);
    return `${sx}:${sy}:${sz}`;
  }

  getNeighborShardIds(metric = this.localMetric) {
    const radius = Math.max(0, this.config.shardRadius || 0);
    const size = this.config.shardSize || DEFAULT_SHARD_SIZE;
    const pos = normalizeMetric(metric);
    const sx = Math.floor(pos.x / size);
    const sy = Math.floor(pos.y / size);
    const sz = Math.floor(pos.z / size);
    const shards = [];
    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dz = -radius; dz <= radius; dz += 1) {
          shards.push(`${sx + dx}:${sy + dy}:${sz + dz}`);
        }
      }
    }
    return shards;
  }

  _filterCandidates(peers) {
    if (!Array.isArray(peers)) return [];
    return peers.filter((peer) => {
      if (!peer?.peerId) return false;
      if (peer.peerId === this.peerId) return false;
      if (!this.config.enforceTopologyScope) return true;
      if (peer.topologyId && peer.topologyId !== this.config.topologyId) return false;
      return true;
    });
  }

  _pickLongRange(candidates, now) {
    if (this.config.longRangeCount <= 0) return [];
    const refreshMs = this.config.longRangeRefreshMs || DEFAULT_LONG_RANGE_REFRESH_MS;
    const shouldRefresh = now - this.lastLongRangeAt > refreshMs;
    if (shouldRefresh || this.longRangePeers.size === 0) {
      this.longRangePeers.clear();
      const picked = pickDeterministic(candidates, this.config.longRangeCount, this.peerId || now);
      picked.forEach((entry) => this.longRangePeers.add(entry.peerId));
      this.lastLongRangeAt = now;
    }
    return Array.from(this.longRangePeers);
  }

  computeDesiredPeers({ peers = [], connections = [], now = Date.now() } = {}) {
    const candidates = this._filterCandidates(peers).map((peer) => {
      const metric = normalizeMetric(peer.metric);
      const dist = distance(this.localMetric, metric);
      const target = toNumber(peer.targetConnections, this.config.targetConnections);
      const active = Number.isFinite(peer.activeConnections) ? peer.activeConnections : null;
      const underTarget = active === null ? true : active < target;
      const noConnections = active === 0;
      return { ...peer, metric, distance: dist, underTarget, noConnections, targetConnections: target };
    });

    const maxConnections = Math.max(1, this.config.maxConnections);
    const radius = Number.isFinite(this.config.connectionRadius) ? this.config.connectionRadius : null;
    const hasRadius = Number.isFinite(radius);
    const isolationCount = Math.max(1, this.config.isolationMinConnections || DEFAULT_ISOLATION_CONNECTIONS);
    const candidateMap = new Map(candidates.map((entry) => [entry.peerId, entry]));

    const byDistance = candidates
      .filter((entry) => Number.isFinite(entry.distance))
      .slice()
      .sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return String(a.peerId).localeCompare(String(b.peerId));
      });

    const forceClosest = this.config.topologyType === 'distributed';
    const closest = forceClosest ? byDistance[0] : null;

    let pool = hasRadius
      ? byDistance.filter((entry) => entry.distance <= radius)
      : byDistance;
    let fallback = false;
    if (hasRadius && pool.length === 0) {
      fallback = true;
      pool = byDistance.slice(0, Math.min(maxConnections, isolationCount));
    }

    if (!fallback) {
      pool.sort((a, b) => {
        if (a.noConnections !== b.noConnections) return a.noConnections ? -1 : 1;
        if (a.distance !== b.distance) return a.distance - b.distance;
        return String(a.peerId).localeCompare(String(b.peerId));
      });
    }

    const desired = new Set();
    const priorityPeers = Array.isArray(this.priorityPeers) ? this.priorityPeers : [];
    for (const peerId of priorityPeers) {
      if (desired.size >= maxConnections) break;
      if (!candidateMap.has(peerId)) continue;
      desired.add(peerId);
    }
    if (closest?.peerId && desired.size < maxConnections) {
      desired.add(closest.peerId);
    }
    for (const entry of pool) {
      if (desired.size >= maxConnections) break;
      desired.add(entry.peerId);
    }

    if (desired.size < maxConnections) {
      const referralPeers = [];
      for (const peerId of this.referralPeers) {
        if (desired.has(peerId)) continue;
        const match = candidates.find((entry) => entry.peerId === peerId);
        if (!match) continue;
        if (hasRadius && Number.isFinite(match.distance) && match.distance > radius) continue;
        referralPeers.push(peerId);
      }
      referralPeers.forEach((peerId) => {
        if (desired.size < maxConnections) desired.add(peerId);
      });
    }

    if (!hasRadius && desired.size < maxConnections) {
      const longRange = this._pickLongRange(candidates, now).filter((peerId) => !desired.has(peerId));
      longRange.forEach((peerId) => {
        if (desired.size < maxConnections) desired.add(peerId);
      });
    }

    this.desiredPeers = desired;
    return desired;
  }

  shouldDialPeer(peerId) {
    if (!peerId) return false;
    if (this.desiredPeers.size === 0) return true;
    return this.desiredPeers.has(peerId);
  }

  getPeerDistance(peer) {
    if (!peer) return Number.POSITIVE_INFINITY;
    const initialized = peer.metricInitialized === true;
    const metric = normalizeMetric(peer.metric);
    const isZero = metric.x === 0 && metric.y === 0 && metric.z === 0;
    if (!initialized && isZero) return Number.POSITIVE_INFINITY;
    return distance(this.localMetric, metric);
  }
}
