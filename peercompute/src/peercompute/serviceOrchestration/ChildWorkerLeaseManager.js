export const CHILD_WORKER_LEASE_SCHEMA = 'peercompute.service.child-worker-lease.v0';

let nextLeaseId = 1;
let nextWorkerHandleId = 1;

const PRIORITY_VALUES = Object.freeze({
  background: 10,
  compute: 50,
  interactive: 75,
  render: 100,
  critical: 1000
});

function createLeaseId(prefix = 'lease') {
  const id = nextLeaseId;
  nextLeaseId += 1;
  return `${prefix}-${Date.now().toString(36)}-${id.toString(36)}`;
}

function createWorkerHandleId(affinityKey = null) {
  const id = nextWorkerHandleId;
  nextWorkerHandleId += 1;
  const tag = affinityKey ? String(affinityKey).replace(/[^a-zA-Z0-9._:-]+/g, '-').slice(0, 32) : 'child';
  return `child-worker-${tag}-${id.toString(36)}`;
}

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeStringList(value, label) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value.map((entry) => String(entry || '').trim()).filter(Boolean);
}

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizePriorityClass(value) {
  const priorityClass = String(value || 'compute').trim().toLowerCase();
  return Object.hasOwn(PRIORITY_VALUES, priorityClass) ? priorityClass : 'compute';
}

function normalizePriority(priorityClass, priority) {
  const numeric = Number(priority);
  if (Number.isFinite(numeric)) return numeric;
  return PRIORITY_VALUES[priorityClass] ?? PRIORITY_VALUES.compute;
}

function normalizeAffinityKey(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

function normalizeWorkerType(value) {
  const workerType = String(value || 'module').trim().toLowerCase();
  if (!['classic', 'module'].includes(workerType)) {
    throw new Error(`Unsupported child worker type: ${workerType}`);
  }
  return workerType;
}

function normalizePolicy(spec = {}, defaultPolicy = {}) {
  return {
    allowed: spec.allowed ?? defaultPolicy.allowed ?? false,
    maxChildren: normalizeInteger(spec.maxChildren ?? defaultPolicy.maxChildren, 0, 0),
    maxWarmPerParent: normalizeInteger(
      spec.maxWarmPerParent ?? defaultPolicy.maxWarmPerParent,
      Number.MAX_SAFE_INTEGER,
      0
    ),
    allowedModules: normalizeStringList(
      spec.allowedModules ?? defaultPolicy.allowedModules ?? [],
      'allowedModules'
    ),
    sameOriginOnly: spec.sameOriginOnly ?? defaultPolicy.sameOriginOnly ?? true,
    baseUrl: spec.baseUrl ?? defaultPolicy.baseUrl ?? null
  };
}

const OPAQUE_OR_UNSAFE_CHILD_SCHEMES = /^(?:data|blob|javascript|vbscript|file|about|chrome|chrome-extension|filesystem):/i;

function assertSameOriginModule(moduleUrl, policy) {
  if (!policy.sameOriginOnly || !moduleUrl) return;
  const raw = String(moduleUrl).trim();
  if (!raw) return;
  if (raw.startsWith('//') || OPAQUE_OR_UNSAFE_CHILD_SCHEMES.test(raw)) {
    throw new Error(`Child worker module must be same-origin: ${moduleUrl}`);
  }
  const effectiveBase = policy.baseUrl
    || (typeof globalThis.location?.href === 'string' && globalThis.location.href ? globalThis.location.href : null);
  if (!effectiveBase) {
    // In headless environments without a baseUrl/location, allow relative paths
    // but reject explicit cross-origin URLs.
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) {
      throw new Error(`Child worker module must be same-origin: ${moduleUrl}`);
    }
    return;
  }
  const fallbackBase = globalThis.location?.href || 'http://localhost/';
  const base = new URL(effectiveBase, fallbackBase);
  const target = new URL(raw, base);
  if (base.origin === 'null' || target.origin === 'null' || target.origin !== base.origin) {
    throw new Error(`Child worker module must be same-origin: ${moduleUrl}`);
  }
}

function hasResourceRequest(resources) {
  if (!resources || typeof resources !== 'object') return false;
  return Boolean(
    resources.resourceKind
    || resources.kind
    || resources.type
    || Number(resources.units) > 0
    || Number(resources.count) > 0
    || Number(resources.memoryBytes) > 0
  );
}

export class ChildWorkerLeaseManager {
  constructor({
    defaultPolicy = {},
    resourceBroker = null,
    maxWarmPerParent = 4,
    maxWarmTotal = 16,
    defaultWarmTtlMs = 60_000,
    now = () => Date.now()
  } = {}) {
    this.defaultPolicy = defaultPolicy;
    this.resourceBroker = resourceBroker || null;
    this.maxWarmPerParent = normalizeInteger(maxWarmPerParent, 4, 0);
    this.maxWarmTotal = normalizeInteger(maxWarmTotal, 16, 0);
    this.defaultWarmTtlMs = normalizeInteger(defaultWarmTtlMs, 60_000, 1);
    this.now = now;
    this.leases = new Map();
    this._requestQueue = Promise.resolve();
    this.warmStats = {
      warmHits: 0,
      warmMisses: 0,
      warmEvictions: 0,
      warmExpirations: 0
    };
  }

  request(parentWorkerId, spec = {}) {
    const run = this._requestQueue.then(() => this.#requestSerialized(parentWorkerId, spec));
    this._requestQueue = run.catch(() => {});
    return run;
  }

  async #requestSerialized(parentWorkerId, spec = {}) {
    const parentId = String(parentWorkerId || '').trim();
    if (!parentId) throw new Error('parentWorkerId is required');

    await this.expireLeases();

    const policy = normalizePolicy(spec, this.defaultPolicy);
    const moduleUrl = String(spec.module || spec.workerModule || '').trim();
    const count = normalizeInteger(spec.count, 1, 1);
    const workerType = normalizeWorkerType(spec.workerType);
    const affinityKey = normalizeAffinityKey(spec.affinityKey ?? spec.warmKey);
    const priorityClass = normalizePriorityClass(spec.priorityClass ?? spec.resources?.priorityClass);
    const priority = normalizePriority(priorityClass, spec.priority ?? spec.resources?.priority);
    const reuseWarm = spec.reuseWarm !== false;
    const warmTtlMs = normalizeInteger(spec.warmTtlMs, this.defaultWarmTtlMs, 1);

    if (!policy.allowed) {
      throw new Error(`Child workers are not allowed for ${parentId}`);
    }
    if (!moduleUrl) {
      throw new Error(`Child worker module is required for ${parentId}`);
    }
    if (!policy.allowedModules.includes(moduleUrl)) {
      throw new Error(`Module is not lease-approved: ${moduleUrl}`);
    }
    assertSameOriginModule(moduleUrl, policy);

    const createdAt = this.now();
    const ttlMs = normalizeInteger(spec.ttlMs, 30_000, 1);

    // 1. Priority-aware warm-worker affinity reuse path.
    if (affinityKey && reuseWarm) {
      const warmCandidate = this.#findWarmMatch({ parentId, moduleUrl, workerType, affinityKey, count });
      if (warmCandidate) {
        const activeCount = this.activeChildCount(parentId);
        if (activeCount + warmCandidate.count > policy.maxChildren) {
          throw new Error(`Child worker quota exceeded for ${parentId}`);
        }
        if (this.resourceBroker && hasResourceRequest(spec.resources)) {
          await this.#ensureResourceLeaseForWarmReuse(warmCandidate, {
            ...spec.resources,
            rootTaskId: spec.rootTaskId || null,
            priorityClass,
            priority,
            ttlMs
          });
        }
        warmCandidate.status = 'active';
        warmCandidate.rootTaskId = spec.rootTaskId || null;
        warmCandidate.priorityClass = priorityClass;
        warmCandidate.priority = priority;
        warmCandidate.expiresAt = normalizeInteger(spec.expiresAt, createdAt + ttlMs, createdAt);
        warmCandidate.warmTtlMs = warmTtlMs;
        warmCandidate.warmExpiresAt = null;
        warmCandidate.lastUsedAt = createdAt;
        warmCandidate.reuseCount = (warmCandidate.reuseCount || 0) + 1;
        warmCandidate.reusedWarm = true;
        if (spec.metadata) {
          warmCandidate.metadata = clonePlain(spec.metadata);
        }
        this.warmStats.warmHits += 1;
        return clonePlain(warmCandidate);
      }
    }

    // 2. Enforce strict active child quota, evicting idle warm leases if total
    //    occupied (active + warm) exceeds `maxChildren`.
    const existingActive = this.activeChildCount(parentId);
    if (existingActive + count > policy.maxChildren) {
      throw new Error(`Child worker quota exceeded for ${parentId}`);
    }
    let occupied = existingActive + this.warmChildCount(parentId);
    if (occupied + count > policy.maxChildren) {
      const needed = occupied + count - policy.maxChildren;
      await this.#evictWarmForCapacity({ parentId, neededUnits: needed });
      occupied = existingActive + this.warmChildCount(parentId);
      if (occupied + count > policy.maxChildren) {
        throw new Error(`Child worker quota exceeded for ${parentId}`);
      }
    }

    // 3. Acquire bounded ResourceLeaseBroker capacity when requested, evicting
    //    lower-priority idle warm leases first if memory/unit caps are tight.
    let resourceLease = null;
    if (this.resourceBroker && hasResourceRequest(spec.resources)) {
      resourceLease = await this.#acquireBoundedResourceLease({
        ...spec.resources,
        rootTaskId: spec.rootTaskId || null,
        priorityClass,
        priority,
        ttlMs
      });
    }

    const lease = {
      schema: CHILD_WORKER_LEASE_SCHEMA,
      leaseId: spec.leaseId || createLeaseId('child-lease'),
      workerHandleId: spec.workerHandleId || createWorkerHandleId(affinityKey),
      parentWorkerId: parentId,
      rootTaskId: spec.rootTaskId || null,
      module: moduleUrl,
      workerType,
      count,
      affinityKey,
      priorityClass,
      priority,
      warmTtlMs,
      warmedAt: null,
      warmExpiresAt: null,
      lastUsedAt: createdAt,
      reuseCount: 0,
      reusedWarm: false,
      createdAt,
      expiresAt: normalizeInteger(spec.expiresAt, createdAt + ttlMs, createdAt),
      resources: clonePlain(spec.resources || {}),
      resourceLease: clonePlain(resourceLease),
      metadata: clonePlain(spec.metadata || {}),
      status: 'active'
    };
    if (affinityKey) {
      this.warmStats.warmMisses += 1;
    }
    this.leases.set(lease.leaseId, lease);
    return clonePlain(lease);
  }

  async release(leaseId, { keepWarm = false, warmTtlMs = null } = {}) {
    const lease = this.leases.get(leaseId);
    if (!lease) return undefined;
    if (lease.status !== 'active') {
      return clonePlain(lease);
    }

    const now = this.now();
    if (keepWarm && lease.affinityKey && this.maxWarmTotal > 0 && this.maxWarmPerParent > 0) {
      const ttl = normalizeInteger(warmTtlMs ?? lease.warmTtlMs, this.defaultWarmTtlMs, 1);
      const canRetain = await this.#makeRoomForWarmLease(lease);
      if (canRetain) {
        if (lease.resourceLease?.leaseId && this.resourceBroker?.renewLease) {
          try {
            const renewed = await this.resourceBroker.renewLease(lease.resourceLease.leaseId, { ttlMs: ttl });
            if (renewed) lease.resourceLease = clonePlain(renewed);
          } catch {
            // If the underlying resource lease was already preempted/expired, do not retain warm.
            return this.#finalizeRelease(lease, 'released', 'releasedAt', now);
          }
        }
        lease.status = 'warm';
        lease.rootTaskId = null;
        lease.warmedAt = now;
        lease.warmTtlMs = ttl;
        lease.warmExpiresAt = now + ttl;
        lease.releasedAt = now;
        return clonePlain(lease);
      }
    }

    return this.#finalizeRelease(lease, 'released', 'releasedAt', now);
  }

  async revoke(leaseId) {
    const lease = this.leases.get(leaseId);
    if (!lease) return undefined;
    if (lease.status === 'active' || lease.status === 'warm') {
      return this.#finalizeRelease(lease, 'revoked', 'revokedAt', this.now());
    }
    return clonePlain(lease);
  }

  async revokeByRootTask(rootTaskId) {
    const revoked = [];
    const now = this.now();
    for (const lease of this.leases.values()) {
      if (lease.rootTaskId === rootTaskId && lease.status === 'active') {
        revoked.push(await this.#finalizeRelease(lease, 'revoked', 'revokedAt', now));
      }
    }
    return revoked;
  }

  async revokeByParent(parentWorkerId) {
    const revoked = [];
    const now = this.now();
    for (const lease of this.leases.values()) {
      if (lease.parentWorkerId === parentWorkerId && (lease.status === 'active' || lease.status === 'warm')) {
        revoked.push(await this.#finalizeRelease(lease, 'revoked', 'revokedAt', now));
      }
    }
    return revoked;
  }

  async evictWarmLeases({ parentWorkerId = null, affinityKey = null, maxPriority = Infinity } = {}) {
    const evicted = [];
    const now = this.now();
    const candidates = [...this.leases.values()]
      .filter((lease) => lease.status === 'warm')
      .filter((lease) => parentWorkerId == null || lease.parentWorkerId === parentWorkerId)
      .filter((lease) => affinityKey == null || lease.affinityKey === affinityKey)
      .filter((lease) => (lease.priority ?? PRIORITY_VALUES.compute) <= maxPriority)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || (a.warmedAt ?? 0) - (b.warmedAt ?? 0));

    for (const lease of candidates) {
      this.warmStats.warmEvictions += 1;
      evicted.push(await this.#finalizeRelease(lease, 'evicted', 'evictedAt', now));
    }
    return evicted;
  }

  expireLeases(now = this.now()) {
    const expired = [];
    for (const lease of this.leases.values()) {
      if (lease.status === 'active' && lease.expiresAt <= now) {
        lease.status = 'expired';
        lease.expiredAt = now;
        this.#releaseResourceLeaseSyncBestEffort(lease);
        expired.push(clonePlain(lease));
      } else if (lease.status === 'warm' && Number.isFinite(lease.warmExpiresAt) && lease.warmExpiresAt <= now) {
        lease.status = 'expired';
        lease.expiredAt = now;
        this.warmStats.warmExpirations += 1;
        this.#releaseResourceLeaseSyncBestEffort(lease);
        expired.push(clonePlain(lease));
      }
    }
    return expired;
  }

  get(leaseId) {
    const lease = this.leases.get(leaseId);
    return lease ? clonePlain(lease) : undefined;
  }

  list({ status = null, rootTaskId = null, parentWorkerId = null, affinityKey = null } = {}) {
    return [...this.leases.values()]
      .filter((lease) => status == null || lease.status === status)
      .filter((lease) => rootTaskId == null || lease.rootTaskId === rootTaskId)
      .filter((lease) => parentWorkerId == null || lease.parentWorkerId === parentWorkerId)
      .filter((lease) => affinityKey == null || lease.affinityKey === affinityKey)
      .map((lease) => clonePlain(lease));
  }

  activeChildCount(parentWorkerId) {
    return [...this.leases.values()]
      .filter((lease) => lease.parentWorkerId === parentWorkerId && lease.status === 'active')
      .reduce((total, lease) => total + lease.count, 0);
  }

  warmChildCount(parentWorkerId = null) {
    return [...this.leases.values()]
      .filter((lease) => lease.status === 'warm' && (parentWorkerId == null || lease.parentWorkerId === parentWorkerId))
      .reduce((total, lease) => total + lease.count, 0);
  }

  getWarmPoolStats() {
    let activeCount = 0;
    let warmCount = 0;
    const warmAffinityKeys = new Set();
    for (const lease of this.leases.values()) {
      if (lease.status === 'active') activeCount += lease.count;
      if (lease.status === 'warm') {
        warmCount += lease.count;
        if (lease.affinityKey) warmAffinityKeys.add(lease.affinityKey);
      }
    }
    const attempts = this.warmStats.warmHits + this.warmStats.warmMisses;
    return {
      activeCount,
      warmCount,
      warmAffinityCount: warmAffinityKeys.size,
      warmAffinityKeys: [...warmAffinityKeys],
      maxWarmPerParent: this.maxWarmPerParent,
      maxWarmTotal: this.maxWarmTotal,
      warmHits: this.warmStats.warmHits,
      warmMisses: this.warmStats.warmMisses,
      warmEvictions: this.warmStats.warmEvictions,
      warmExpirations: this.warmStats.warmExpirations,
      hitRate: attempts > 0 ? Number((this.warmStats.warmHits / attempts).toFixed(4)) : 0
    };
  }

  #findWarmMatch({ parentId, moduleUrl, workerType, affinityKey, count }) {
    const matches = [...this.leases.values()]
      .filter((lease) => (
        lease.status === 'warm'
        && lease.parentWorkerId === parentId
        && lease.module === moduleUrl
        && lease.workerType === workerType
        && lease.affinityKey === affinityKey
        && lease.count >= count
      ))
      .sort((a, b) => (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0));
    return matches[0] || null;
  }

  async #acquireBoundedResourceLease(resourceSpec) {
    try {
      return await this.resourceBroker.requestLease(resourceSpec);
    } catch (error) {
      // Attempt priority-aware eviction of lower-priority idle warm leases that
      // currently hold capacity in the same resource broker, then retry once.
      const requestedPriority = resourceSpec.priority ?? PRIORITY_VALUES.compute;
      const evictable = [...this.leases.values()]
        .filter((lease) => (
          lease.status === 'warm'
          && lease.resourceLease?.leaseId
          && (lease.priority ?? PRIORITY_VALUES.compute) < requestedPriority
        ))
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || (a.warmedAt ?? 0) - (b.warmedAt ?? 0));

      if (evictable.length === 0) throw error;

      const now = this.now();
      for (const candidate of evictable) {
        this.warmStats.warmEvictions += 1;
        await this.#finalizeRelease(candidate, 'evicted', 'evictedAt', now);
        try {
          return await this.resourceBroker.requestLease(resourceSpec);
        } catch {
          // Keep evicting strictly lower-priority warm leases until capacity opens.
        }
      }
      throw error;
    }
  }

  async #ensureResourceLeaseForWarmReuse(lease, resourceSpec) {
    const existingId = lease.resourceLease?.leaseId;
    if (existingId) {
      const existing = this.resourceBroker.get?.(existingId);
      const sameKind = existing && existing.status === 'active'
        && existing.resourceKind === (String(resourceSpec.resourceKind || resourceSpec.kind || resourceSpec.type || 'gpu').trim().toLowerCase() || 'gpu');
      const requestedBytes = normalizeInteger(resourceSpec.memoryBytes, 0, 0);
      const requestedUnits = normalizeInteger(resourceSpec.units ?? resourceSpec.count, 1, 1);
      if (sameKind && existing.memoryBytes >= requestedBytes && existing.units >= requestedUnits) {
        const renewed = await this.resourceBroker.renewLease(existingId, { ttlMs: resourceSpec.ttlMs });
        lease.resourceLease = clonePlain(renewed);
        return;
      }
      await this.resourceBroker.releaseLease(existingId);
      lease.resourceLease = null;
    }
    const acquired = await this.#acquireBoundedResourceLease(resourceSpec);
    lease.resourceLease = clonePlain(acquired);
  }

  async #evictWarmForCapacity({ parentId, neededUnits }) {
    const candidates = [...this.leases.values()]
      .filter((lease) => lease.status === 'warm' && lease.parentWorkerId === parentId)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || (a.warmedAt ?? 0) - (b.warmedAt ?? 0));
    let freed = 0;
    const now = this.now();
    for (const candidate of candidates) {
      if (freed >= neededUnits) break;
      freed += candidate.count;
      this.warmStats.warmEvictions += 1;
      await this.#finalizeRelease(candidate, 'evicted', 'evictedAt', now);
    }
    return freed;
  }

  async #makeRoomForWarmLease(incoming) {
    const incomingPriority = incoming.priority ?? PRIORITY_VALUES.compute;
    const evictLowest = async (pool) => {
      const sorted = pool
        .filter((lease) => (lease.priority ?? PRIORITY_VALUES.compute) <= incomingPriority)
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || (a.warmedAt ?? 0) - (b.warmedAt ?? 0));
      if (sorted.length === 0) return false;
      const victim = sorted[0];
      this.warmStats.warmEvictions += 1;
      await this.#finalizeRelease(victim, 'evicted', 'evictedAt', this.now());
      return true;
    };

    while (this.warmChildCount(incoming.parentWorkerId) + incoming.count > this.maxWarmPerParent) {
      const parentWarm = [...this.leases.values()]
        .filter((lease) => lease.status === 'warm' && lease.parentWorkerId === incoming.parentWorkerId);
      if (!(await evictLowest(parentWarm))) return false;
    }

    while (this.warmChildCount() + incoming.count > this.maxWarmTotal) {
      const allWarm = [...this.leases.values()].filter((lease) => lease.status === 'warm');
      if (!(await evictLowest(allWarm))) return false;
    }

    return true;
  }

  async #finalizeRelease(lease, status, timestampField, now) {
    lease.status = status;
    lease[timestampField] = now;
    if (lease.resourceLease?.leaseId && this.resourceBroker?.releaseLease) {
      try {
        const released = await this.resourceBroker.releaseLease(lease.resourceLease.leaseId);
        if (released) lease.resourceLease = clonePlain(released);
      } catch {
        // Best-effort release if already revoked/expired.
      }
    }
    return clonePlain(lease);
  }

  #releaseResourceLeaseSyncBestEffort(lease) {
    if (lease.resourceLease?.leaseId && this.resourceBroker?.releaseLease) {
      try {
        void Promise.resolve(this.resourceBroker.releaseLease(lease.resourceLease.leaseId)).catch(() => {});
      } catch {
        // Ignore best-effort release failure during synchronous expiry sweep.
      }
    }
  }
}
