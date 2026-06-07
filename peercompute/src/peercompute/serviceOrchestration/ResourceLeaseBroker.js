export const RESOURCE_LEASE_SCHEMA = 'peercompute.service.resource-lease.v0';
export const RESOURCE_PRESSURE_SCHEMA = 'peercompute.service.resource-pressure.v0';

let nextLeaseId = 1;

const PRIORITY_VALUES = Object.freeze({
  background: 10,
  compute: 50,
  interactive: 75,
  render: 100,
  critical: 1000
});

function createLeaseId(prefix = 'resource-lease') {
  const id = nextLeaseId;
  nextLeaseId += 1;
  return `${prefix}-${Date.now().toString(36)}-${id.toString(36)}`;
}

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizePositiveInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeNonNegativeInteger(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(0, number));
}

function normalizeResourceKind(value) {
  return String(value || 'gpu').trim().toLowerCase() || 'gpu';
}

function normalizePriorityClass(value) {
  const priorityClass = String(value || 'compute').trim().toLowerCase();
  return Object.hasOwn(PRIORITY_VALUES, priorityClass) ? priorityClass : 'compute';
}

function priorityValue(priorityClass, priority) {
  const numeric = Number(priority);
  if (Number.isFinite(numeric)) return numeric;
  return PRIORITY_VALUES[priorityClass] ?? PRIORITY_VALUES.compute;
}

function normalizePool(kind, config = {}) {
  const units = normalizePositiveInteger(config.units ?? config.count, kind === 'gpu' ? 1 : 0, 0);
  return {
    kind,
    units,
    memoryBytes: normalizeNonNegativeInteger(config.memoryBytes, 0),
    deviceIds: Array.isArray(config.deviceIds)
      ? config.deviceIds.map((id) => String(id || '').trim()).filter(Boolean)
      : [],
    metadata: clonePlain(config.metadata || {})
  };
}

function poolFromCapacities(capacities = {}) {
  const pools = new Map();
  for (const [kind, config] of Object.entries(capacities)) {
    pools.set(normalizeResourceKind(kind), normalizePool(normalizeResourceKind(kind), config));
  }
  if (!pools.has('gpu')) {
    pools.set('gpu', normalizePool('gpu', { units: 1 }));
  }
  return pools;
}

export class ResourceLeaseBroker {
  constructor({
    capacities = { gpu: { units: 1 } },
    defaultTtlMs = 30_000,
    now = () => Date.now()
  } = {}) {
    this.pools = poolFromCapacities(capacities);
    this.defaultTtlMs = normalizePositiveInteger(defaultTtlMs, 30_000);
    this.now = now;
    this.leases = new Map();
    this.quarantined = new Map();
    this.preemptionCount = 0;
  }

  async requestLease(spec = {}) {
    this.expireLeases();
    const kind = normalizeResourceKind(spec.resourceKind || spec.kind || spec.type);
    const pool = this.pools.get(kind);
    if (!pool || pool.units <= 0) {
      throw new Error(`No resource capacity configured for ${kind}`);
    }
    const deviceId = spec.deviceId ? String(spec.deviceId) : null;
    if (deviceId && pool.deviceIds.length > 0 && !pool.deviceIds.includes(deviceId)) {
      throw new Error(`Resource device is not in the ${kind} pool: ${deviceId}`);
    }
    if (this.quarantined.has(`${kind}:*`) || (deviceId && this.quarantined.has(`${kind}:${deviceId}`))) {
      throw new Error(`Resource ${deviceId || kind} is quarantined for ${kind}`);
    }

    const priorityClass = normalizePriorityClass(spec.priorityClass);
    const priority = priorityValue(priorityClass, spec.priority);
    const units = normalizePositiveInteger(spec.units ?? spec.count, 1, 1, pool.units);
    const memoryBytes = normalizeNonNegativeInteger(spec.memoryBytes, 0);
    if (memoryBytes > 0 && pool.memoryBytes > 0 && this.#activeMemoryBytes(kind) + memoryBytes > pool.memoryBytes) {
      throw new Error(`Resource memory quota exceeded for ${kind}`);
    }

    const activeUnits = this.#activeUnits(kind);
    if (activeUnits + units > pool.units) {
      const needed = activeUnits + units - pool.units;
      const preempted = this.#preemptLowerPriority(kind, priority, needed);
      if (preempted < needed) {
        throw new Error(`Resource quota exceeded for ${kind}`);
      }
    }

    const createdAt = this.now();
    const ttlMs = normalizePositiveInteger(spec.ttlMs, this.defaultTtlMs);
    const lease = {
      schema: RESOURCE_LEASE_SCHEMA,
      leaseId: spec.leaseId || createLeaseId(),
      resourceKind: kind,
      rootTaskId: spec.rootTaskId || null,
      serviceId: spec.serviceId || null,
      taskId: spec.taskId || null,
      priorityClass,
      priority,
      units,
      memoryBytes,
      deviceId,
      preemptable: spec.preemptable !== false,
      createdAt,
      expiresAt: normalizePositiveInteger(spec.expiresAt, createdAt + ttlMs, createdAt),
      status: 'active',
      metadata: clonePlain(spec.metadata || {})
    };
    this.leases.set(lease.leaseId, lease);
    return clonePlain(lease);
  }

  async releaseLease(leaseId) {
    return this.#mark(leaseId, 'released', 'releasedAt');
  }

  async revokeLease(leaseId) {
    return this.#mark(leaseId, 'revoked', 'revokedAt');
  }

  async revokeByRootTask(rootTaskId) {
    const revoked = [];
    for (const lease of this.leases.values()) {
      if (lease.rootTaskId === rootTaskId && lease.status === 'active') {
        lease.status = 'revoked';
        lease.revokedAt = this.now();
        revoked.push(clonePlain(lease));
      }
    }
    return revoked;
  }

  expireLeases(now = this.now()) {
    const expired = [];
    for (const lease of this.leases.values()) {
      if (lease.status === 'active' && lease.expiresAt <= now) {
        lease.status = 'expired';
        lease.expiredAt = now;
        expired.push(clonePlain(lease));
      }
    }
    return expired;
  }

  quarantineResource({ resourceKind = 'gpu', deviceId = null, reason = 'device-lost', retryable = true } = {}) {
    const kind = normalizeResourceKind(resourceKind);
    const key = `${kind}:${deviceId || '*'}`;
    const record = {
      resourceKind: kind,
      deviceId,
      reason,
      retryable: Boolean(retryable),
      quarantinedAt: this.now()
    };
    this.quarantined.set(key, record);
    for (const lease of this.leases.values()) {
      if (
        lease.status === 'active'
        && lease.resourceKind === kind
        && (deviceId == null || lease.deviceId === deviceId)
      ) {
        lease.status = 'quarantined';
        lease.quarantinedAt = record.quarantinedAt;
        lease.quarantineReason = reason;
        lease.retryable = Boolean(retryable);
      }
    }
    return clonePlain(record);
  }

  clearQuarantine({ resourceKind = 'gpu', deviceId = null } = {}) {
    return this.quarantined.delete(`${normalizeResourceKind(resourceKind)}:${deviceId || '*'}`);
  }

  get(leaseId) {
    const lease = this.leases.get(leaseId);
    return lease ? clonePlain(lease) : undefined;
  }

  list({ status = null, rootTaskId = null, resourceKind = null } = {}) {
    const kind = resourceKind == null ? null : normalizeResourceKind(resourceKind);
    return [...this.leases.values()]
      .filter((lease) => status == null || lease.status === status)
      .filter((lease) => rootTaskId == null || lease.rootTaskId === rootTaskId)
      .filter((lease) => kind == null || lease.resourceKind === kind)
      .map((lease) => clonePlain(lease));
  }

  reportPressure() {
    const pools = {};
    for (const [kind, pool] of this.pools.entries()) {
      const activeUnits = this.#activeUnits(kind);
      const activeMemoryBytes = this.#activeMemoryBytes(kind);
      pools[kind] = {
        units: pool.units,
        activeUnits,
        availableUnits: Math.max(0, pool.units - activeUnits),
        pressure: pool.units > 0 ? activeUnits / pool.units : 0,
        memoryBytes: pool.memoryBytes,
        activeMemoryBytes,
        availableMemoryBytes: pool.memoryBytes > 0 ? Math.max(0, pool.memoryBytes - activeMemoryBytes) : null,
        deviceIds: [...pool.deviceIds],
        metadata: clonePlain(pool.metadata)
      };
    }
    const counts = {};
    for (const lease of this.leases.values()) {
      counts[lease.status] = (counts[lease.status] || 0) + 1;
    }
    return {
      schema: RESOURCE_PRESSURE_SCHEMA,
      pools,
      leaseCounts: counts,
      activeLeaseCount: counts.active || 0,
      preemptionCount: this.preemptionCount,
      quarantined: [...this.quarantined.values()].map((entry) => clonePlain(entry)),
      leases: this.list()
    };
  }

  #activeUnits(kind) {
    return [...this.leases.values()]
      .filter((lease) => lease.status === 'active' && lease.resourceKind === kind)
      .reduce((total, lease) => total + lease.units, 0);
  }

  #activeMemoryBytes(kind) {
    return [...this.leases.values()]
      .filter((lease) => lease.status === 'active' && lease.resourceKind === kind)
      .reduce((total, lease) => total + lease.memoryBytes, 0);
  }

  #preemptLowerPriority(kind, priority, neededUnits) {
    let freed = 0;
    const candidates = [...this.leases.values()]
      .filter((lease) => (
        lease.status === 'active'
        && lease.resourceKind === kind
        && lease.preemptable
        && lease.priority < priority
      ))
      .sort((left, right) => left.priority - right.priority || left.createdAt - right.createdAt);
    for (const lease of candidates) {
      lease.status = 'preempted';
      lease.preemptedAt = this.now();
      lease.preemptedByPriority = priority;
      freed += lease.units;
      this.preemptionCount += 1;
      if (freed >= neededUnits) break;
    }
    return freed;
  }

  #mark(leaseId, status, timestampField) {
    const lease = this.leases.get(leaseId);
    if (!lease) return undefined;
    if (lease.status === 'active') {
      lease.status = status;
      lease[timestampField] = this.now();
    }
    return clonePlain(lease);
  }
}
