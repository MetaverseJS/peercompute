export const CHILD_WORKER_LEASE_SCHEMA = 'peercompute.service.child-worker-lease.v0';

let nextLeaseId = 1;

function createLeaseId(prefix = 'lease') {
  const id = nextLeaseId;
  nextLeaseId += 1;
  return `${prefix}-${Date.now().toString(36)}-${id.toString(36)}`;
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

function normalizePolicy(spec = {}, defaultPolicy = {}) {
  return {
    allowed: spec.allowed ?? defaultPolicy.allowed ?? false,
    maxChildren: normalizeInteger(spec.maxChildren ?? defaultPolicy.maxChildren, 0, 0),
    allowedModules: normalizeStringList(
      spec.allowedModules ?? defaultPolicy.allowedModules ?? [],
      'allowedModules'
    ),
    sameOriginOnly: spec.sameOriginOnly ?? defaultPolicy.sameOriginOnly ?? true,
    baseUrl: spec.baseUrl ?? defaultPolicy.baseUrl ?? null
  };
}

function assertSameOriginModule(moduleUrl, policy) {
  if (!policy.sameOriginOnly || !policy.baseUrl || !moduleUrl) return;
  const fallbackBase = globalThis.location?.href || 'http://localhost/';
  const base = new URL(policy.baseUrl, fallbackBase);
  const target = new URL(moduleUrl, base);
  if (target.origin !== base.origin) {
    throw new Error(`Child worker module must be same-origin: ${moduleUrl}`);
  }
}

export class ChildWorkerLeaseManager {
  constructor({ defaultPolicy = {}, now = () => Date.now() } = {}) {
    this.defaultPolicy = defaultPolicy;
    this.now = now;
    this.leases = new Map();
  }

  async request(parentWorkerId, spec = {}) {
    const parentId = String(parentWorkerId || '').trim();
    if (!parentId) throw new Error('parentWorkerId is required');

    const policy = normalizePolicy(spec, this.defaultPolicy);
    const moduleUrl = String(spec.module || spec.workerModule || '').trim();
    const count = normalizeInteger(spec.count, 1, 1);

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

    const existingCount = this.activeChildCount(parentId);
    if (existingCount + count > policy.maxChildren) {
      throw new Error(`Child worker quota exceeded for ${parentId}`);
    }

    const createdAt = this.now();
    const ttlMs = normalizeInteger(spec.ttlMs, 30_000, 1);
    const lease = {
      schema: CHILD_WORKER_LEASE_SCHEMA,
      leaseId: spec.leaseId || createLeaseId('child-lease'),
      parentWorkerId: parentId,
      rootTaskId: spec.rootTaskId || null,
      module: moduleUrl,
      count,
      createdAt,
      expiresAt: normalizeInteger(spec.expiresAt, createdAt + ttlMs, createdAt),
      resources: clonePlain(spec.resources || {}),
      metadata: clonePlain(spec.metadata || {}),
      status: 'active'
    };
    this.leases.set(lease.leaseId, lease);
    return clonePlain(lease);
  }

  async release(leaseId) {
    return this.#mark(leaseId, 'released', 'releasedAt');
  }

  async revoke(leaseId) {
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

  async revokeByParent(parentWorkerId) {
    const revoked = [];
    for (const lease of this.leases.values()) {
      if (lease.parentWorkerId === parentWorkerId && lease.status === 'active') {
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

  get(leaseId) {
    const lease = this.leases.get(leaseId);
    return lease ? clonePlain(lease) : undefined;
  }

  list({ status = null, rootTaskId = null, parentWorkerId = null } = {}) {
    return [...this.leases.values()]
      .filter((lease) => status == null || lease.status === status)
      .filter((lease) => rootTaskId == null || lease.rootTaskId === rootTaskId)
      .filter((lease) => parentWorkerId == null || lease.parentWorkerId === parentWorkerId)
      .map((lease) => clonePlain(lease));
  }

  activeChildCount(parentWorkerId) {
    return [...this.leases.values()]
      .filter((lease) => lease.parentWorkerId === parentWorkerId && lease.status === 'active')
      .reduce((total, lease) => total + lease.count, 0);
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
