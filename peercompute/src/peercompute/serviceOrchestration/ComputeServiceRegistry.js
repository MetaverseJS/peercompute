export const COMPUTE_SERVICE_MANIFEST_SCHEMA = 'peercompute.service.manifest.v0';
export const COMPUTE_SERVICE_REGISTRY_SCHEMA = 'peercompute.service.registry.v0';

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeId(value, label) {
  const id = String(value || '').trim();
  if (!id) throw new Error(`${label} is required`);
  return id;
}

function normalizeStringList(value, label) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value.map((entry) => String(entry || '').trim()).filter(Boolean);
}

function normalizeEntry(entry = {}, serviceId) {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Service ${serviceId} requires entry`);
  }
  const normalized = {
    ...clonePlain(entry)
  };
  const hasWorker = !!normalized.workerModule;
  const hasAdapter = !!(normalized.adapter || normalized.kind || normalized.type || normalized.computeManager);
  const hasTaskTarget = !!(normalized.module || normalized.hostModule || normalized.solverId);
  if (!hasWorker && !hasAdapter && !hasTaskTarget) {
    throw new Error(`Service ${serviceId} requires entry.workerModule, entry.adapter, or a compute target`);
  }
  return normalized;
}

export function normalizeComputeServiceManifest(manifest = {}) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('Service manifest is required');
  }
  const serviceId = normalizeId(manifest.serviceId, 'serviceId');
  const capabilities = normalizeStringList(manifest.capabilities, 'capabilities');
  const taskKinds = normalizeStringList(manifest.taskKinds || capabilities, 'taskKinds');
  if (capabilities.length === 0) {
    throw new Error(`Service ${serviceId} requires at least one capability`);
  }
  if (taskKinds.length === 0) {
    throw new Error(`Service ${serviceId} requires at least one task kind`);
  }

  const childWorkers = manifest.childWorkers && typeof manifest.childWorkers === 'object'
    ? manifest.childWorkers
    : {};

  return {
    schema: manifest.schema || COMPUTE_SERVICE_MANIFEST_SCHEMA,
    serviceId,
    version: manifest.version || '0.0.0',
    runtime: String(manifest.runtime || 'js').trim().toLowerCase(),
    entry: normalizeEntry(manifest.entry, serviceId),
    childWorkers: {
      allowed: childWorkers.allowed === true,
      maxChildren: Number.isInteger(childWorkers.maxChildren) ? Math.max(0, childWorkers.maxChildren) : 0,
      allowedModules: normalizeStringList(childWorkers.allowedModules || [], 'childWorkers.allowedModules'),
      sameOriginOnly: childWorkers.sameOriginOnly !== false
    },
    resources: clonePlain(manifest.resources || {}),
    capabilities,
    taskKinds,
    abi: clonePlain(manifest.abi || null),
    validation: clonePlain(manifest.validation || {}),
    metadata: clonePlain(manifest.metadata || {})
  };
}

export class ComputeServiceRegistry {
  constructor(manifests = []) {
    this.manifests = new Map();
    for (const manifest of manifests) {
      this.register(manifest);
    }
  }

  register(manifest) {
    const normalized = normalizeComputeServiceManifest(manifest);
    this.manifests.set(normalized.serviceId, normalized);
    return this.get(normalized.serviceId);
  }

  unregister(serviceId) {
    return this.manifests.delete(serviceId);
  }

  has(serviceId) {
    return this.manifests.has(serviceId);
  }

  get(serviceId) {
    const manifest = this.manifests.get(serviceId);
    if (!manifest) return undefined;
    return {
      serviceId: manifest.serviceId,
      manifest: clonePlain(manifest),
      capabilities: [...manifest.capabilities],
      taskKinds: [...manifest.taskKinds]
    };
  }

  resolve(taskKind, filters = {}) {
    const requestedKind = String(taskKind || '').trim();
    if (!requestedKind) return [];
    return [...this.manifests.values()]
      .filter((manifest) => {
        if (filters.serviceId && manifest.serviceId !== filters.serviceId) return false;
        if (filters.runtime && manifest.runtime !== String(filters.runtime).trim().toLowerCase()) return false;
        if (filters.capability && !manifest.capabilities.includes(filters.capability)) return false;
        return manifest.taskKinds.includes(requestedKind)
          || manifest.capabilities.includes(requestedKind)
          || manifest.serviceId === requestedKind;
      })
      .map((manifest) => this.get(manifest.serviceId));
  }

  resolveTask(task = {}, filters = {}) {
    const taskKind = task.taskKind || task.kind || task.capability || task.serviceId;
    return this.resolve(taskKind, {
      ...filters,
      serviceId: filters.serviceId || task.serviceId
    });
  }

  list() {
    return [...this.manifests.values()].map((manifest) => clonePlain(manifest));
  }

  listCapabilities() {
    const services = [...this.manifests.values()].map((manifest) => ({
      serviceId: manifest.serviceId,
      version: manifest.version,
      runtime: manifest.runtime,
      capabilities: [...manifest.capabilities],
      taskKinds: [...manifest.taskKinds],
      abi: clonePlain(manifest.abi)
    }));
    return {
      schema: COMPUTE_SERVICE_REGISTRY_SCHEMA,
      services,
      serviceCount: services.length,
      capabilities: [...new Set(services.flatMap((service) => service.capabilities))].sort(),
      taskKinds: [...new Set(services.flatMap((service) => service.taskKinds))].sort()
    };
  }
}
