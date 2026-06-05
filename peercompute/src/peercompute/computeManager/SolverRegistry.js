export const SOLVER_DESCRIPTOR_SCHEMA = 'peercompute.compute.solver-descriptor.v0';
export const SOLVER_TASK_SCHEMA = 'peercompute.compute.solver-task.v0';

function normalizeId(value, label) {
  const id = String(value || '').trim();
  if (!id) throw new Error(`${label} is required`);
  return id;
}

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeField(field) {
  if (typeof field === 'string') {
    return {
      name: normalizeId(field, 'field.name'),
      unit: null,
      dimensions: null,
      location: null
    };
  }
  if (!field || typeof field !== 'object') {
    throw new Error('field must be a string or object');
  }
  return {
    name: normalizeId(field.name, 'field.name'),
    unit: field.unit ?? null,
    dimensions: field.dimensions ?? null,
    location: field.location ?? null,
    role: field.role ?? null
  };
}

function normalizeFields(fields = []) {
  if (!Array.isArray(fields)) {
    throw new Error('fields must be an array');
  }
  return fields.map(normalizeField);
}

function normalizeRuntime(descriptor) {
  if (descriptor.runtime) return String(descriptor.runtime).trim().toLowerCase();
  if (descriptor.wasm) return descriptor.hostModule || descriptor.module ? 'wasm-webgpu' : 'wasm';
  return 'js';
}

export function normalizeSolverDescriptor(descriptor = {}) {
  if (!descriptor || typeof descriptor !== 'object') {
    throw new Error('solver descriptor is required');
  }
  const id = normalizeId(descriptor.id, 'solver.id');
  const kind = normalizeId(descriptor.kind || descriptor.family, 'solver.kind');
  const runtime = normalizeRuntime(descriptor);
  const hasExecutor = !!(descriptor.module || descriptor.fn || descriptor.wasm || descriptor.wasmSource || descriptor.source);

  return {
    schema: SOLVER_DESCRIPTOR_SCHEMA,
    id,
    kind,
    version: descriptor.version || '0.0.0',
    label: descriptor.label || id,
    description: descriptor.description || '',
    runtime,
    module: descriptor.module,
    exportName: descriptor.exportName || 'default',
    fn: descriptor.fn,
    hostModule: descriptor.hostModule,
    hostExport: descriptor.hostExport,
    wasm: descriptor.wasm,
    wasmSource: descriptor.wasmSource,
    source: descriptor.source,
    webgpu: descriptor.webgpu || null,
    inputFields: normalizeFields(descriptor.inputFields || descriptor.inputs || []),
    outputFields: normalizeFields(descriptor.outputFields || descriptor.outputs || []),
    conservedFields: normalizeFields(descriptor.conservedFields || descriptor.conserved || []),
    timestep: {
      mode: descriptor.timestep?.mode || descriptor.timestepMode || 'explicit',
      maxDt: descriptor.timestep?.maxDt ?? descriptor.maxDt ?? null,
      subcycles: descriptor.timestep?.subcycles ?? descriptor.subcycles ?? 1
    },
    validity: clonePlain(descriptor.validity || descriptor.validityDomain || {}),
    affinity: {
      policy: descriptor.affinity?.policy || descriptor.affinityPolicy || 'state-key',
      keyFields: Array.isArray(descriptor.affinity?.keyFields) ? [...descriptor.affinity.keyFields] : ['solverId', 'stateKey']
    },
    warmDelta: {
      scope: descriptor.warmDelta?.scope || descriptor.scope || 'solver-deltas',
      schema: descriptor.warmDelta?.schema || `peercompute.solver.${id}.delta.v0`
    },
    metadata: clonePlain(descriptor.metadata || {}),
    hasExecutor
  };
}

export class SolverRegistry {
  constructor(descriptors = []) {
    this.solvers = new Map();
    for (const descriptor of descriptors) {
      this.register(descriptor);
    }
  }

  register(descriptor) {
    const normalized = normalizeSolverDescriptor(descriptor);
    this.solvers.set(normalized.id, normalized);
    return normalized;
  }

  unregister(id) {
    return this.solvers.delete(id);
  }

  has(id) {
    return this.solvers.has(id);
  }

  get(id) {
    const solver = this.solvers.get(id);
    if (!solver) throw new Error(`Solver not registered: ${id}`);
    return solver;
  }

  list() {
    return Array.from(this.solvers.values()).map((solver) => clonePlain(solver));
  }

  createTask(solverId, {
    id,
    input = {},
    stateKey = input.stateKey || input.taskId || solverId,
    affinityKey,
    scope,
    version,
    timestamp,
    data = {},
    placementHint,
    webgpu
  } = {}) {
    const solver = this.get(solverId);
    if (!solver.hasExecutor) {
      throw new Error(`Solver has no executable task target: ${solverId}`);
    }
    const taskId = id || `${solver.id}:${stateKey}:${Date.now()}`;
    const resolvedScope = scope || solver.warmDelta.scope;
    const resolvedPlacementHint = placementHint ?? data.placementHint ?? null;
    return {
      id: taskId,
      solverId: solver.id,
      taskFamily: solver.id,
      runtime: solver.runtime,
      module: solver.module,
      exportName: solver.exportName,
      fn: solver.fn,
      hostModule: solver.hostModule,
      hostExport: solver.hostExport,
      wasm: solver.wasm,
      wasmSource: solver.wasmSource,
      source: solver.source,
      webgpu: webgpu || solver.webgpu || undefined,
      affinityKey: affinityKey || `${solver.id}:${stateKey}`,
      placementHint: clonePlain(resolvedPlacementHint),
      data: {
        schema: SOLVER_TASK_SCHEMA,
        solver: {
          id: solver.id,
          kind: solver.kind,
          version: solver.version,
          inputFields: solver.inputFields,
          outputFields: solver.outputFields,
          conservedFields: solver.conservedFields,
          timestep: solver.timestep,
          validity: solver.validity,
          warmDelta: {
            scope: resolvedScope,
            schema: solver.warmDelta.schema
          }
        },
        stateKey,
        scope: resolvedScope,
        version: version ?? null,
        timestamp: timestamp ?? Date.now(),
        input,
        ...data,
        placementHint: clonePlain(resolvedPlacementHint)
      }
    };
  }
}
