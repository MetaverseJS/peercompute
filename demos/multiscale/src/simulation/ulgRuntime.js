export const ULG_RUNTIME_MANIFEST_SCHEMA = 'peercompute.ulg.runtime-manifest.v0';
export const ULG_CARRIER_REGISTRY_SCHEMA = 'peercompute.ulg.carrier-registry.v0';
export const ULG_STATE_CHANNEL_DECL_SCHEMA = 'peercompute.ulg.state-channel-decl.v0';
export const ULG_HAMILTONIAN_SPEC_SCHEMA = 'peercompute.ulg.hamiltonian-spec.v0';
export const ULG_QUANTUM_STATE_RESULT_SCHEMA = 'peercompute.ulg.quantum-state-result.v0';
export const ULG_DERIVED_MATERIAL_CLOSURE_SCHEMA = 'peercompute.ulg.derived-material-closure.v0';
export const ULG_KERNEL_PASS_SPEC_SCHEMA = 'peercompute.ulg.kernel-pass-spec.v0';
export const ULG_PASS_DAG_SCHEMA = 'peercompute.ulg.worker-pass-dag.v0';
export const ULG_LAW_TASK_CAPSULE_SCHEMA = 'peercompute.ulg.law-task-capsule.v0';
export const ULG_QUANTUM_TASK_CAPSULE_SCHEMA = 'peercompute.ulg.quantum-task-capsule.v0';
export const ULG_INVARIANT_REPORT_SCHEMA = 'peercompute.ulg.invariant-report.v0';
export const ULG_COMPACT_DELTA_SCHEMA = 'peercompute.ulg.compact-delta.v0';
export const ULG_SIMULATION_ARTIFACT_SCHEMA = 'peercompute.ulg.simulation-artifact.v0';
export const ULG_SIMULATION_ARTIFACT_SUMMARY_SCHEMA = 'peercompute.multiscale.ulg-simulation-artifact-summary.v0';
export const ULG_EDGE_MESSAGE_SUMMARY_SCHEMA = 'peercompute.ulg.edge-message-summary.v0';
export const ULG_FIELD_OBSERVER_SUMMARY_SCHEMA = 'peercompute.ulg.field-observer-summary.v0';
export const ULG_FIELD_CLOSURE_SAMPLE_SUMMARY_SCHEMA = 'peercompute.ulg.field-closure-sample-summary.v0';
export const ULG_CLOSURE_REFRESH_REQUEST_SCHEMA = 'peercompute.ulg.closure-refresh-request.v0';

export const ULG_LIVE_BACKENDS = ['webgpu'];
export const ULG_OFFLINE_AUDIT_BACKENDS = ['wasm_audit'];
export const ULG_SPEC_VERSION = '0.4';
export const ULG_V04_CORE_PASS_IDS = Object.freeze([
  'buildSpatialHash',
  'buildNeighborEdges',
  'buildLongRangeGraph',
  'observeCoarseState',
  'activateTerms',
  'evaluateEdgeMessages',
  'evaluateFieldMessages',
  'evaluateSourceTerms',
  'accumulateMessages',
  'integrateState',
  'projectConstraints',
  'validateDomain',
  'refineOrCoarsen',
  'packPeerDelta'
]);

const DEFAULT_UNIT_SYSTEM = 'SI';
const ZERO_HASH = 'sha256:00000000';

export const ULG_DIMENSIONS = Object.freeze({
  dimensionless: Object.freeze({ length: 0, mass: 0, time: 0, current: 0, temperature: 0, amount: 0, luminous: 0 }),
  position: Object.freeze({ length: 1, mass: 0, time: 0, current: 0, temperature: 0, amount: 0, luminous: 0 }),
  velocity: Object.freeze({ length: 1, mass: 0, time: -1, current: 0, temperature: 0, amount: 0, luminous: 0 }),
  mass: Object.freeze({ length: 0, mass: 1, time: 0, current: 0, temperature: 0, amount: 0, luminous: 0 }),
  energy: Object.freeze({ length: 2, mass: 1, time: -2, current: 0, temperature: 0, amount: 0, luminous: 0 }),
  pressure: Object.freeze({ length: -1, mass: 1, time: -2, current: 0, temperature: 0, amount: 0, luminous: 0 }),
  charge: Object.freeze({ length: 0, mass: 0, time: 1, current: 1, temperature: 0, amount: 0, luminous: 0 }),
  temperature: Object.freeze({ length: 0, mass: 0, time: 0, current: 0, temperature: 1, amount: 0, luminous: 0 }),
  magneticField: Object.freeze({ length: 0, mass: 1, time: -2, current: -1, temperature: 0, amount: 0, luminous: 0 })
});

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      const entry = value[key];
      if (entry !== undefined) result[key] = stableValue(entry);
      return result;
    }, {});
  }
  if (Number.isFinite(value)) return Number(value);
  return value ?? null;
}

function hashString(input) {
  let hash = 2166136261;
  const text = String(input);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `sha256:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function stableHash(value) {
  return hashString(JSON.stringify(stableValue(value)));
}

function normalizeDimensions(dimensions = ULG_DIMENSIONS.dimensionless) {
  return {
    length: finite(dimensions.length, 0),
    mass: finite(dimensions.mass, 0),
    time: finite(dimensions.time, 0),
    current: finite(dimensions.current, 0),
    temperature: finite(dimensions.temperature, 0),
    amount: finite(dimensions.amount, 0),
    luminous: finite(dimensions.luminous, 0)
  };
}

function normalizeRangePair(value, fallback = [null, null]) {
  if (!Array.isArray(value) || value.length < 2) return fallback;
  return [
    Number.isFinite(Number(value[0])) ? Number(value[0]) : fallback[0],
    Number.isFinite(Number(value[1])) ? Number(value[1]) : fallback[1]
  ];
}

function validateLiveBackend(backend, { executionMode = 'live' } = {}) {
  if (executionMode === 'live' && !ULG_LIVE_BACKENDS.includes(backend)) {
    return {
      ok: false,
      status: 'blocked-live-backend',
      reason: `ULG live passes require WebGPU; ${backend || 'unknown'} is not a live backend.`
    };
  }
  if (executionMode !== 'live' && ![...ULG_LIVE_BACKENDS, ...ULG_OFFLINE_AUDIT_BACKENDS].includes(backend)) {
    return {
      ok: false,
      status: 'blocked-unknown-backend',
      reason: `Unknown ULG backend ${backend || 'unknown'}.`
    };
  }
  return { ok: true, status: 'backend-ready', reason: null };
}

function validateKernelPassContract({
  reads = [],
  writes = [],
  units = [],
  dispatch = [],
  workgroupSize = [],
  precision = 'f32',
  deterministic = true
} = {}) {
  const missing = [];
  if (asArray(reads).length < 1) missing.push('reads');
  if (asArray(writes).length < 1) missing.push('writes');
  if (asArray(units).length < 1) missing.push('units');
  if (asArray(dispatch).some((value) => finite(value, 0) <= 0)) missing.push('dispatch-bounds');
  if (asArray(workgroupSize).some((value) => finite(value, 0) <= 0)) missing.push('workgroup-bounds');
  if (!precision) missing.push('precision');
  if (deterministic !== true) missing.push('determinism');
  return {
    ok: missing.length === 0,
    status: missing.length === 0 ? 'pass-contract-ready' : 'blocked-incomplete-pass-contract',
    missing
  };
}

function passValidates(passId) {
  const id = String(passId || '');
  if (id.includes('buildSpatialHash')) return ['finite-position', 'domain-bounds'];
  if (id.includes('buildNeighborEdges')) return ['edge-capacity'];
  if (id.includes('buildLongRangeGraph')) return ['long-range-bounds'];
  if (id.includes('observeCoarseState')) return ['positive-density-energy'];
  if (id.includes('activateTerms')) return ['closure-validity-envelope'];
  if (id.includes('evaluateEdgeMessages')) return ['pair-message-antisymmetry-proxy'];
  if (id.includes('evaluateFieldMessages')) return ['field-finite-values'];
  if (id.includes('evaluateSourceTerms')) return ['species-energy-source-accounting'];
  if (id.includes('accumulateMessages')) return ['reduction-finite-values'];
  if (id.includes('integrateState')) return ['finite-integrated-state'];
  if (id.includes('projectConstraints')) return ['positivity-and-invariant-projection'];
  if (id.includes('validateDomain')) return ['residuals-invariants-closure-envelope'];
  if (id.includes('refineOrCoarsen')) return ['refinement-trigger-bounds'];
  if (id.includes('packPeerDelta')) return ['delta-hash-and-compactness'];
  return ['finite-values'];
}

export function createStateChannelDecl({
  id,
  quantity,
  unit = 'reduced',
  dimensions = ULG_DIMENSIONS.dimensionless,
  storage = 'buffer:soa',
  location = 'carrier',
  role = 'evolved',
  validity = { status: 'declared' },
  source = null
} = {}) {
  const channelId = id || `channel:${quantity || 'unknown'}`;
  return {
    schema: ULG_STATE_CHANNEL_DECL_SCHEMA,
    id: channelId,
    quantity: quantity || channelId,
    unit,
    dimensions: normalizeDimensions(dimensions),
    storage,
    location,
    role,
    validity,
    source,
    unitHash: stableHash({ unit, dimensions: normalizeDimensions(dimensions) })
  };
}

export function createCarrierRegistry({
  carrierKinds = [],
  channels = [],
  domainId = 'multiscale',
  representation = 'hybrid-carrier-graph'
} = {}) {
  const normalizedKinds = asArray(carrierKinds).map((kind, index) => ({
    id: kind.id || `carrier:${index}`,
    label: kind.label || kind.id || `carrier ${index}`,
    representation: kind.representation || representation,
    primitiveInputs: asArray(kind.primitiveInputs),
    active: kind.active !== false,
    refinementLevel: finite(kind.refinementLevel, 0)
  }));
  return {
    schema: ULG_CARRIER_REGISTRY_SCHEMA,
    domainId,
    representation,
    carrierKindCount: normalizedKinds.length,
    stateChannelCount: channels.length,
    carrierKinds: normalizedKinds,
    channels,
    channelIds: channels.map((channel) => channel.id),
    status: normalizedKinds.length > 0 && channels.length > 0 ? 'declared' : 'incomplete'
  };
}

export function createHamiltonianSpec({
  id,
  nuclei = [],
  electrons = {},
  boundary = {},
  externalFields = {},
  approximation = 'screened_hydrogenic_reference',
  basis = { kind: 'finite-grid-or-orbital-reference' },
  pseudopotential = null,
  exchangeCorrelation = null,
  convergence = {},
  units = DEFAULT_UNIT_SYSTEM,
  provenance = {}
} = {}) {
  const normalizedNuclei = asArray(nuclei).map((site, index) => ({
    Z: Math.max(1, Math.round(finite(site.Z, 1))),
    isotopeMass: finite(site.isotopeMass, site.mass || site.Z || 1),
    position: asArray(site.position).slice(0, 3).map((value) => finite(value, 0)),
    spin: Number.isFinite(Number(site.spin)) ? Number(site.spin) : null,
    siteIndex: index
  }));
  const normalizedElectrons = {
    count: Math.max(0, Math.round(finite(electrons.count, normalizedNuclei.reduce((sum, site) => sum + site.Z, 0)))),
    totalCharge: finite(electrons.totalCharge, 0),
    spinMultiplicity: Number.isFinite(Number(electrons.spinMultiplicity)) ? Number(electrons.spinMultiplicity) : null,
    temperature: Number.isFinite(Number(electrons.temperature)) ? Number(electrons.temperature) : null
  };
  const spec = {
    schema: ULG_HAMILTONIAN_SPEC_SCHEMA,
    id: id || `hamiltonian:${normalizedNuclei.map((site) => site.Z).join('-') || 'empty'}:${normalizedElectrons.count}`,
    nuclei: normalizedNuclei,
    electrons: normalizedElectrons,
    boundary: {
      type: boundary.type || 'finite-local-patch',
      temperatureK: Number.isFinite(Number(boundary.temperatureK)) ? Number(boundary.temperatureK) : null,
      pressurePa: Number.isFinite(Number(boundary.pressurePa)) ? Number(boundary.pressurePa) : null,
      strain: boundary.strain || null,
      lengthUnit: boundary.lengthUnit || 'bohr'
    },
    externalFields: {
      electricFieldVm: asArray(externalFields.electricFieldVm).slice(0, 3).map((value) => finite(value, 0)),
      magneticFieldT: asArray(externalFields.magneticFieldT).slice(0, 3).map((value) => finite(value, 0)),
      gravityMps2: Number.isFinite(Number(externalFields.gravityMps2)) ? Number(externalFields.gravityMps2) : null
    },
    approximation,
    basis,
    pseudopotential,
    exchangeCorrelation,
    convergence: {
      targetResidual: finite(convergence.targetResidual, 1e-4),
      maxIterations: Math.max(1, Math.round(finite(convergence.maxIterations, 1))),
      status: convergence.status || 'declared'
    },
    units,
    provenance: {
      source: provenance.source || 'runtime-generated-from-current-state',
      methodStatus: provenance.methodStatus || (approximation === 'screened_hydrogenic_reference' ? 'declared-proxy' : 'declared'),
      notes: asArray(provenance.notes)
    }
  };
  return {
    ...spec,
    hamiltonianHash: stableHash(spec),
    primitiveMatterOnly: true
  };
}

export function createQuantumStateResult({
  taskId,
  hamiltonian,
  method = hamiltonian?.approximation || 'unknown',
  totalEnergy = null,
  electronDensity = null,
  orbitals = null,
  chargeDensity = null,
  spinDensity = null,
  forces = null,
  stressTensor = null,
  bandStructure = null,
  densityOfStates = null,
  phonons = null,
  dielectricTensor = null,
  polarizability = null,
  uncertainty = {},
  convergence = {},
  validity = {},
  provenance = {}
} = {}) {
  const hamiltonianHash = hamiltonian?.hamiltonianHash || hamiltonian?.id || ZERO_HASH;
  const result = {
    schema: ULG_QUANTUM_STATE_RESULT_SCHEMA,
    taskId: taskId || `qtask:${hamiltonianHash}`,
    hamiltonianHash,
    method,
    totalEnergy: Number.isFinite(Number(totalEnergy)) ? Number(totalEnergy) : null,
    electronDensity,
    orbitals,
    chargeDensity,
    spinDensity,
    forces,
    stressTensor,
    bandStructure,
    densityOfStates,
    phonons,
    dielectricTensor,
    polarizability,
    uncertainty: {
      model: uncertainty.model || 'declared-method-envelope',
      relative: finite(uncertainty.relative, method === 'screened_hydrogenic_reference' ? 0.35 : 0.1),
      status: uncertainty.status || 'declared'
    },
    convergence: {
      status: convergence.status || hamiltonian?.convergence?.status || 'declared',
      residual: Number.isFinite(Number(convergence.residual)) ? Number(convergence.residual) : null,
      targetResidual: finite(convergence.targetResidual, hamiltonian?.convergence?.targetResidual ?? 1e-4)
    },
    validity: {
      status: validity.status || (method === 'screened_hydrogenic_reference' ? 'proxy-not-scientific' : 'declared'),
      envelope: validity.envelope || {},
      warnings: asArray(validity.warnings)
    },
    provenance: {
      source: provenance.source || 'current-schrodinger-orbital-contract',
      hamiltonianId: hamiltonian?.id || null,
      hamiltonianHash,
      method,
      approximation: hamiltonian?.approximation || method
    }
  };
  return {
    ...result,
    resultHash: stableHash(result)
  };
}

export function createDerivedMaterialClosure({
  id,
  name = null,
  producedBy = 'screened_hydrogenic_reference',
  sourceTaskIds = [],
  sourceHamiltonianHashes = [],
  structureDescriptor = {},
  stateRange = {},
  unitSystem = DEFAULT_UNIT_SYSTEM,
  values = {},
  uncertainty = {},
  invalidationTriggers = [],
  allowEmpiricalFallbackOnlyForDebug = false,
  quantumResults = [],
  liveProductionMode = true
} = {}) {
  const taskIds = [...new Set([
    ...asArray(sourceTaskIds),
    ...asArray(quantumResults).map((result) => result?.taskId).filter(Boolean)
  ])];
  const hamiltonianHashes = [...new Set([
    ...asArray(sourceHamiltonianHashes),
    ...asArray(quantumResults).map((result) => result?.hamiltonianHash).filter(Boolean)
  ])];
  const hasProvenance = taskIds.length > 0 && hamiltonianHashes.length > 0;
  const invalidDebugFallback = liveProductionMode && allowEmpiricalFallbackOnlyForDebug;
  const hasValues = values && Object.keys(values).length > 0;
  const status = !hasProvenance
    ? 'invalid-missing-quantum-provenance'
    : invalidDebugFallback
      ? 'invalid-debug-fallback-in-live-mode'
      : hasValues
        ? producedBy === 'screened_hydrogenic_reference'
          ? 'proxy-valid-scientific-blocked'
          : 'valid'
        : 'invalid-empty-values';
  const closure = {
    schema: ULG_DERIVED_MATERIAL_CLOSURE_SCHEMA,
    id: id || `closure:${stableHash({ taskIds, structureDescriptor }).slice(7)}`,
    name,
    producedBy,
    sourceTaskIds: taskIds,
    sourceHamiltonianHashes: hamiltonianHashes,
    structureDescriptor,
    stateRange: {
      temperatureK: normalizeRangePair(stateRange.temperatureK, [null, null]),
      pressurePa: normalizeRangePair(stateRange.pressurePa, [null, null]),
      strain: normalizeRangePair(stateRange.strain, [0, null]),
      phase: asArray(stateRange.phase).length > 0 ? asArray(stateRange.phase) : ['unknown']
    },
    unitSystem,
    values,
    uncertainty: {
      model: uncertainty.model || 'source-propagated-method-envelope',
      relative: finite(uncertainty.relative, producedBy === 'screened_hydrogenic_reference' ? 0.4 : 0.1),
      status: uncertainty.status || 'declared'
    },
    invalidationTriggers: asArray(invalidationTriggers),
    allowEmpiricalFallbackOnlyForDebug: Boolean(allowEmpiricalFallbackOnlyForDebug),
    provenance: {
      quantumResultCount: asArray(quantumResults).length,
      sourceTaskCount: taskIds.length,
      sourceHamiltonianCount: hamiltonianHashes.length,
      sourceHashes: hamiltonianHashes
    },
    validity: {
      status,
      hasQuantumOrAtomicProvenance: hasProvenance,
      liveProductionMode,
      scientificReady: status === 'valid',
      proxyReady: status === 'valid' || status === 'proxy-valid-scientific-blocked'
    }
  };
  return {
    ...closure,
    closureHash: stableHash(closure)
  };
}

export function createKernelPassSpec({
  id,
  backend = 'webgpu',
  shaderModuleId = null,
  entryPoint = null,
  workgroupSize = [64, 1, 1],
  dispatch = [1, 1, 1],
  bindGroups = [],
  reads = [],
  writes = [],
  barriers = [],
  units = [],
  precision = 'f32',
  deterministic = true,
  validates = null,
  bufferLayout = 'hot-soa-flat-buffer',
  constants = {},
  inputHash = ZERO_HASH,
  lawHash = ZERO_HASH,
  unitHash = ZERO_HASH,
  executionMode = 'live'
} = {}) {
  const backendValidation = validateLiveBackend(backend, { executionMode });
  const contractValidation = validateKernelPassContract({
    reads,
    writes,
    units,
    dispatch,
    workgroupSize,
    precision,
    deterministic
  });
  const validation = backendValidation.ok
    ? contractValidation.ok
      ? backendValidation
      : {
        ok: false,
        status: contractValidation.status,
        reason: `Incomplete ULG v0.4 pass contract: ${contractValidation.missing.join(', ')}.`
      }
    : backendValidation;
  const pass = {
    schema: ULG_KERNEL_PASS_SPEC_SCHEMA,
    id: id || `pass:${entryPoint || 'unnamed'}`,
    backend,
    executionMode,
    shaderModuleId,
    entryPoint: entryPoint || id || 'main',
    workgroupSize: workgroupSize.slice(0, 3).map((value) => Math.max(1, Math.round(finite(value, 1)))),
    dispatch: dispatch.slice(0, 3).map((value) => Math.max(1, Math.round(finite(value, 1)))),
    bindGroups: asArray(bindGroups),
    reads: asArray(reads),
    writes: asArray(writes),
    barriers: asArray(barriers),
    units: asArray(units),
    precision,
    deterministic: deterministic === true,
    validates: asArray(validates ?? passValidates(id || entryPoint)),
    bufferLayout,
    constants,
    inputHash,
    lawHash,
    unitHash,
    validation,
    contractValidation
  };
  return {
    ...pass,
    passHash: stableHash(pass)
  };
}

function makeCanonicalPass(id, index, context = {}) {
  return createKernelPassSpec({
    id: `ulg:${id}`,
    backend: 'webgpu',
    shaderModuleId: `ulg-${id}-wgsl`,
    entryPoint: id,
    workgroupSize: [64, 1, 1],
    dispatch: [Math.max(1, Math.ceil(finite(context.carrierCount, 1024) / 64)), 1, 1],
    reads: context.reads || ['buffer:carrier-state'],
    writes: context.writes || ['buffer:carrier-state-next'],
    barriers: context.barriers || ['storage-read-after-write-sequenced-by-pass-dag'],
    units: context.units || [{
      unitSystem: DEFAULT_UNIT_SYSTEM,
      unitHash: context.unitHash || ZERO_HASH,
      channelCount: Math.max(0, Math.round(finite(context.stateChannelCount, 0)))
    }],
    precision: context.precision || 'f32',
    deterministic: true,
    validates: context.validates || passValidates(id),
    bufferLayout: context.bufferLayout || 'hot-soa-flat-buffer',
    constants: {
      passIndex: index,
      carrierCount: Math.max(0, Math.round(finite(context.carrierCount, 1024))),
      stateChannelCount: Math.max(0, Math.round(finite(context.stateChannelCount, 0)))
    },
    inputHash: context.inputHash || ZERO_HASH,
    lawHash: context.lawHash || ZERO_HASH,
    unitHash: context.unitHash || ZERO_HASH,
    executionMode: 'live'
  });
}

export function compileUlgPassDag({
  carrierRegistry = null,
  lawGraph = null,
  closures = [],
  carrierCount = 1024,
  includeQuantumSidePasses = true
} = {}) {
  const closureList = asArray(closures);
  const invalidClosures = closureList.filter((closure) => closure?.validity?.proxyReady !== true);
  const scientificBlockedClosures = closureList.filter((closure) => closure?.validity?.scientificReady !== true);
  const context = {
    carrierCount,
    stateChannelCount: carrierRegistry?.stateChannelCount || 0,
    inputHash: stableHash({ carrierRegistry, closureHashes: closureList.map((closure) => closure.closureHash) }),
    lawHash: stableHash(lawGraph || {}),
    unitHash: stableHash(asArray(carrierRegistry?.channels).map((channel) => channel.unitHash))
  };
  const canonicalPassIds = [...ULG_V04_CORE_PASS_IDS];
  const passes = canonicalPassIds.map((id, index) => makeCanonicalPass(id, index, context));
  const quantumPasses = includeQuantumSidePasses
    ? [
      makeCanonicalPass('smallHamiltonianAssembly', passes.length, {
        ...context,
        reads: ['buffer:nuclei', 'buffer:electrons', 'buffer:boundary'],
        writes: ['buffer:hamiltonian']
      }),
      makeCanonicalPass('quantumClosureCacheWrite', passes.length + 1, {
        ...context,
        reads: ['buffer:quantum-state-result'],
        writes: ['buffer:material-memory-cache']
      })
    ]
    : [];
  const allPasses = [...passes, ...quantumPasses];
  const invalidLivePasses = allPasses.filter((pass) => pass.validation?.ok !== true);
  const implementedCoreIds = new Set(allPasses.map((pass) => String(pass.id || '').replace(/^ulg:/, '')));
  const missingCorePassIds = ULG_V04_CORE_PASS_IDS.filter((id) => !implementedCoreIds.has(id));
  const status = invalidLivePasses.length > 0
    ? 'blocked-invalid-live-pass'
    : invalidClosures.length > 0
      ? 'blocked-invalid-closure'
      : scientificBlockedClosures.length > 0
        ? 'proxy-pass-dag-ready-scientific-blocked'
        : 'scientific-pass-dag-ready';
  return {
    schema: ULG_PASS_DAG_SCHEMA,
    modelId: 'ulg-webgpu-canonical-pass-dag-v0',
    status,
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
    passCount: allPasses.length,
    webgpuPassCount: allPasses.filter((pass) => pass.backend === 'webgpu').length,
    invalidLivePassCount: invalidLivePasses.length,
    requiredCorePassCount: ULG_V04_CORE_PASS_IDS.length,
    implementedCorePassCount: ULG_V04_CORE_PASS_IDS.length - missingCorePassIds.length,
    missingCorePassIds,
    closureCount: closureList.length,
    invalidClosureCount: invalidClosures.length,
    scientificBlockedClosureCount: scientificBlockedClosures.length,
    passes: allPasses,
    passIds: allPasses.map((pass) => pass.id),
    nextRequiredStep: status === 'scientific-pass-dag-ready'
      ? 'dispatch-live-webgpu-passes'
      : invalidClosures.length > 0
        ? 'derive-provenanced-material-closures'
        : 'replace-proxy-closures-with-calibrated-first-principles-closures'
  };
}

export function createLawTaskCapsule({
  taskId,
  graphId = 'ulg:multiscale',
  domainId = 'multiscale',
  timestep = 0,
  dt = 0,
  activeLawTerms = [],
  activeClosureIds = [],
  kernelPasses = [],
  inputRefs = [],
  outputRefs = [],
  boundaryRefs = [],
  inputStateHash = ZERO_HASH,
  lawHash = ZERO_HASH,
  unitHash = ZERO_HASH,
  closureHash = ZERO_HASH,
  tolerance = {},
  commitPolicy = 'local_only'
} = {}) {
  const passList = asArray(kernelPasses);
  const invalidLivePassCount = passList.filter((pass) => pass.validation?.ok !== true).length;
  return {
    schema: ULG_LAW_TASK_CAPSULE_SCHEMA,
    taskId: taskId || `lawtask:${graphId}:${timestep}`,
    graphId,
    domainId,
    timestep,
    dt,
    activeLawTerms: asArray(activeLawTerms),
    activeClosureIds: asArray(activeClosureIds),
    kernelPasses: passList,
    inputRefs: asArray(inputRefs),
    outputRefs: asArray(outputRefs),
    boundaryRefs: asArray(boundaryRefs),
    inputStateHash,
    lawHash,
    unitHash,
    closureHash,
    tolerance: {
      absolute: finite(tolerance.absolute, 1e-5),
      relative: finite(tolerance.relative, 1e-4),
      invariantDrift: finite(tolerance.invariantDrift, 1e-4)
    },
    commitPolicy,
    validation: {
      status: invalidLivePassCount > 0 ? 'blocked-invalid-live-pass' : 'ready',
      invalidLivePassCount,
      liveBackendPolicy: 'webgpu-only-no-cpu-fallback'
    }
  };
}

export function createQuantumTaskCapsule({
  taskId,
  regionId = 'orbital',
  hamiltonian,
  requestedOutputs = [],
  targetClosureKinds = [],
  maxWallTimeMs = 12,
  backendPreference = ['webgpu'],
  inputPatchHash = ZERO_HASH,
  convergenceTarget = {},
  commitPolicy = 'cache_only'
} = {}) {
  const blockedBackends = asArray(backendPreference).filter((backend) => !ULG_LIVE_BACKENDS.includes(backend));
  return {
    schema: ULG_QUANTUM_TASK_CAPSULE_SCHEMA,
    taskId: taskId || `qtask:${regionId}:${hamiltonian?.hamiltonianHash || ZERO_HASH}`,
    regionId,
    hamiltonian,
    requestedOutputs: asArray(requestedOutputs),
    targetClosureKinds: asArray(targetClosureKinds),
    maxWallTimeMs,
    backendPreference: asArray(backendPreference),
    inputPatchHash,
    convergenceTarget,
    commitPolicy,
    validation: {
      status: blockedBackends.length > 0 ? 'blocked-non-webgpu-live-backend' : 'ready',
      blockedBackends,
      liveBackendPolicy: 'webgpu-only-no-cpu-fallback'
    }
  };
}

export function createInvariantReport({
  invariants = [],
  tolerance = {},
  mode = 'interactive-proxy'
} = {}) {
  const entries = asArray(invariants).map((entry) => ({
    id: entry.id || 'invariant:unknown',
    quantity: entry.quantity || entry.id || 'unknown',
    residual: finite(entry.residual, 0),
    tolerance: finite(entry.tolerance, tolerance.invariantDrift ?? 1e-4),
    status: finite(entry.residual, 0) <= finite(entry.tolerance, tolerance.invariantDrift ?? 1e-4) ? 'pass' : 'fail',
    source: entry.source || 'runtime'
  }));
  return {
    schema: ULG_INVARIANT_REPORT_SCHEMA,
    mode,
    invariantCount: entries.length,
    failedInvariantCount: entries.filter((entry) => entry.status !== 'pass').length,
    maxResidual: rounded(Math.max(0, ...entries.map((entry) => Math.abs(entry.residual))), 8),
    entries,
    status: entries.every((entry) => entry.status === 'pass') ? 'pass' : 'fail'
  };
}

export function createCompactDelta({
  taskId,
  domainId = 'multiscale',
  version = 0,
  halos = [],
  events = [],
  residuals = [],
  hashes = {},
  payloadRefs = []
} = {}) {
  const delta = {
    schema: ULG_COMPACT_DELTA_SCHEMA,
    taskId: taskId || `delta:${domainId}:${version}`,
    domainId,
    version,
    halos: asArray(halos),
    events: asArray(events),
    residuals: asArray(residuals),
    hashes,
    payloadRefs: asArray(payloadRefs)
  };
  return {
    ...delta,
    deltaHash: stableHash(delta)
  };
}

export function createUlgSimulationArtifactSummary(artifact = {}) {
  const sourceSchema = artifact?.schema || null;
  const compatible = sourceSchema === ULG_SIMULATION_ARTIFACT_SCHEMA;
  const outputs = compatible && artifact.outputs && typeof artifact.outputs === 'object'
    ? artifact.outputs
    : {};
  const execution = compatible && artifact.execution && typeof artifact.execution === 'object'
    ? artifact.execution
    : {};
  const validity = compatible && artifact.validity && typeof artifact.validity === 'object'
    ? artifact.validity
    : {};
  const uncertainty = compatible && artifact.uncertainty && typeof artifact.uncertainty === 'object'
    ? artifact.uncertainty
    : {};
  const validation = compatible && artifact.validation && typeof artifact.validation === 'object'
    ? artifact.validation
    : {};
  const deltas = asArray(outputs.deltas);
  const edgeMessageSummaries = deltas
    .map((delta) => delta?.edgeMessageSummary && typeof delta.edgeMessageSummary === 'object'
      ? delta.edgeMessageSummary
      : null)
    .filter(Boolean);
  const edgeMessageSummary = edgeMessageSummaries.at(-1) || null;
  const fieldObserverSummaries = deltas
    .map((delta) => delta?.fieldObserverSummary && typeof delta.fieldObserverSummary === 'object'
      ? delta.fieldObserverSummary
      : null)
    .filter(Boolean);
  const fieldObserverSummary = fieldObserverSummaries.at(-1) || null;
  const fieldObserverObservedFieldNames = Array.isArray(fieldObserverSummary?.observedFieldNames)
    ? fieldObserverSummary.observedFieldNames
    : [];
  const fieldClosureSampleSummaries = deltas
    .map((delta) => delta?.fieldClosureSampleSummary && typeof delta.fieldClosureSampleSummary === 'object'
      ? delta.fieldClosureSampleSummary
      : null)
    .filter(Boolean);
  const fieldClosureSampleSummary = fieldClosureSampleSummaries.at(-1) || null;
  const fieldClosureSampleRefreshRequest =
    fieldClosureSampleSummary?.closureRefreshRequest && typeof fieldClosureSampleSummary.closureRefreshRequest === 'object'
      ? fieldClosureSampleSummary.closureRefreshRequest
      : null;
  const invariantReport = outputs.invariants && typeof outputs.invariants === 'object'
    ? outputs.invariants
    : null;
  const deltaCount = deltas.length;
  const invariantStatus = invariantReport?.status || null;
  const runtimeEvidenceReady = compatible && deltaCount > 0 && invariantStatus === 'pass';
  const scientificValidation = validation.scientificValidation === true;
  const fullPhysicsValidation = validation.fullPhysicsValidation === true || validation.fullPhysics === true;
  const calibratedPhysics = uncertainty.calibratedPhysics === true;
  const representation = compatible ? artifact.representation || null : null;
  const toyReference = representation === 'carrier-toy' || calibratedPhysics !== true;
  const blockers = [
    compatible ? null : 'ulg-simulation-artifact-schema-missing',
    runtimeEvidenceReady ? null : 'ulg-simulation-runtime-evidence-incomplete',
    scientificValidation ? null : 'ulg-simulation-artifact-not-scientifically-validated',
    fullPhysicsValidation ? null : 'ulg-simulation-artifact-not-full-physics-validated',
    calibratedPhysics ? null : 'ulg-simulation-artifact-uncalibrated',
    toyReference ? 'ulg-simulation-artifact-toy-reference' : null,
    ...asArray(validation.blockers)
  ].filter(Boolean);
  const scientificRuntimeReady = runtimeEvidenceReady
    && scientificValidation
    && fullPhysicsValidation
    && calibratedPhysics
    && toyReference === false;
  const closureRef = artifact?.closureRef || null;
  const closureRefUri = typeof closureRef === 'string'
    ? closureRef
    : closureRef?.uri || closureRef?.hash || null;
  const summaryHash = stableHash({
    artifactId: compatible ? artifact.artifactId || null : null,
    sourceSchema,
    closureRefUri,
    representation,
    backend: execution.backend || null,
    steps: execution.steps ?? null,
    deltaCount,
    invariantStatus,
    edgeMessageSummarySchema: edgeMessageSummary?.schema || null,
    edgeMessageSummaryStatus: edgeMessageSummary?.status || null,
    edgeMessageSummaryCount: edgeMessageSummaries.length,
    edgeMessageMaxNetForceAbs: edgeMessageSummary?.maxNetForceAbs ?? null,
    edgeMessageMaxAntisymmetricResidualAbs: edgeMessageSummary?.maxAntisymmetricResidualAbs ?? null,
    edgeMessageOutOfRangeCount: edgeMessageSummary?.outOfRangeCount ?? null,
    edgeMessageScientificValidation: typeof edgeMessageSummary?.scientificValidation === 'boolean'
      ? edgeMessageSummary.scientificValidation
      : null,
    edgeMessageFullPhysicsValidation: typeof edgeMessageSummary?.fullPhysicsValidation === 'boolean'
      ? edgeMessageSummary.fullPhysicsValidation
      : null,
    fieldObserverSummarySchema: fieldObserverSummary?.schema || null,
    fieldObserverSummaryStatus: fieldObserverSummary?.status || null,
    fieldObserverSummaryCount: fieldObserverSummaries.length,
    fieldObserverObservedFieldNames,
    fieldObserverZeroWeightCount: fieldObserverSummary?.zeroWeightCount ?? null,
    fieldObserverMaxNeighborCount: fieldObserverSummary?.maxNeighborCount ?? null,
    fieldObserverMaxWeightSum: fieldObserverSummary?.maxWeightSum ?? null,
    fieldObserverScientificValidation: typeof fieldObserverSummary?.scientificValidation === 'boolean'
      ? fieldObserverSummary.scientificValidation
      : null,
    fieldObserverFullPhysicsValidation: typeof fieldObserverSummary?.fullPhysicsValidation === 'boolean'
      ? fieldObserverSummary.fullPhysicsValidation
      : null,
    fieldClosureSampleSummarySchema: fieldClosureSampleSummary?.schema || null,
    fieldClosureSampleSummaryStatus: fieldClosureSampleSummary?.status || null,
    fieldClosureSampleSummaryCount: fieldClosureSampleSummaries.length,
    fieldClosureSampleValidityStatus: fieldClosureSampleSummary?.validityStatus || null,
    fieldClosureSampleKind: fieldClosureSampleSummary?.sampleKind || null,
    fieldClosureSampleClosureId: fieldClosureSampleSummary?.closureId || null,
    fieldClosureSampleFieldName: fieldClosureSampleSummary?.fieldName || null,
    fieldClosureSampleAxisName: fieldClosureSampleSummary?.axisName || null,
    fieldClosureSampleOutputName: fieldClosureSampleSummary?.outputName || null,
    fieldClosureSampleCount: fieldClosureSampleSummary?.sampleCount ?? null,
    fieldClosureSampleOutOfRangeCount: fieldClosureSampleSummary?.outOfRangeCount ?? null,
    fieldClosureSampleNullFieldCount: fieldClosureSampleSummary?.nullFieldCount ?? null,
    fieldClosureSampleMinInput: fieldClosureSampleSummary?.minInput ?? null,
    fieldClosureSampleMaxInput: fieldClosureSampleSummary?.maxInput ?? null,
    fieldClosureSampleMinSampledValue: fieldClosureSampleSummary?.minSampledValue ?? null,
    fieldClosureSampleMaxSampledValue: fieldClosureSampleSummary?.maxSampledValue ?? null,
    fieldClosureSampleMaxAbsDerivative: fieldClosureSampleSummary?.maxAbsDerivative ?? null,
    fieldClosureSampleRefreshRequestSchema: fieldClosureSampleRefreshRequest?.schema || null,
    fieldClosureSampleRefreshRequestStatus: fieldClosureSampleRefreshRequest?.status || null,
    fieldClosureSampleRefreshRecommended: typeof fieldClosureSampleSummary?.closureRefreshRecommended === 'boolean'
      ? fieldClosureSampleSummary.closureRefreshRecommended
      : (
          typeof fieldClosureSampleRefreshRequest?.refreshRecommended === 'boolean'
            ? fieldClosureSampleRefreshRequest.refreshRecommended
            : null
        ),
    fieldClosureSampleInvalidationRecommended: typeof fieldClosureSampleSummary?.closureInvalidationRecommended === 'boolean'
      ? fieldClosureSampleSummary.closureInvalidationRecommended
      : (
          typeof fieldClosureSampleRefreshRequest?.invalidationRecommended === 'boolean'
            ? fieldClosureSampleRefreshRequest.invalidationRecommended
            : null
        ),
    fieldClosureSampleRefreshReason:
      fieldClosureSampleSummary?.closureRefreshReason || fieldClosureSampleRefreshRequest?.reason || null,
    fieldClosureSampleRefreshRegistryAction:
      fieldClosureSampleSummary?.closureRefreshRegistryAction || fieldClosureSampleRefreshRequest?.registryAction || null,
    fieldClosureSampleMinOutOfRangeInput: fieldClosureSampleRefreshRequest?.minOutOfRangeInput ?? null,
    fieldClosureSampleMaxOutOfRangeInput: fieldClosureSampleRefreshRequest?.maxOutOfRangeInput ?? null,
    fieldClosureSampleScientificValidation: typeof fieldClosureSampleSummary?.scientificValidation === 'boolean'
      ? fieldClosureSampleSummary.scientificValidation
      : null,
    fieldClosureSampleFullPhysicsValidation: typeof fieldClosureSampleSummary?.fullPhysicsValidation === 'boolean'
      ? fieldClosureSampleSummary.fullPhysicsValidation
      : null,
    fieldClosureSampleMaterialValidation: typeof fieldClosureSampleSummary?.materialValidation === 'boolean'
      ? fieldClosureSampleSummary.materialValidation
      : null,
    fieldClosureSampleEosValidation: typeof fieldClosureSampleSummary?.eosValidation === 'boolean'
      ? fieldClosureSampleSummary.eosValidation
      : null,
    fieldClosureSampleSphValidation: typeof fieldClosureSampleSummary?.sphValidation === 'boolean'
      ? fieldClosureSampleSummary.sphValidation
      : null,
    fieldClosureSamplePhaseChangeValidation: typeof fieldClosureSampleSummary?.phaseChangeValidation === 'boolean'
      ? fieldClosureSampleSummary.phaseChangeValidation
      : null,
    validationStatus: validation.status || null,
    scientificValidation,
    fullPhysicsValidation,
    calibratedPhysics
  });
  return {
    schema: ULG_SIMULATION_ARTIFACT_SUMMARY_SCHEMA,
    sourceSchema,
    status: compatible
      ? (scientificRuntimeReady ? 'scientific-runtime-artifact-ready' : 'toy-runtime-artifact-consumed-scientific-blocked')
      : 'unsupported-or-missing-artifact',
    compatible,
    runtimeEvidenceReady,
    scientificRuntimeReady,
    fullPhysicsReady: scientificRuntimeReady,
    sourceService: compatible ? artifact.sourceService || null : null,
    taskKind: compatible ? artifact.taskKind || null : null,
    artifactId: compatible ? artifact.artifactId || null : null,
    closureRefUri,
    representation,
    backend: execution.backend || null,
    steps: execution.steps ?? null,
    integrator: execution.integrator || null,
    deltaCount,
    invariantSchema: invariantReport?.schema || null,
    invariantStatus,
    maxEnergyDriftAbs: invariantReport?.metrics?.maxEnergyDriftAbs ?? null,
    maxMomentumDriftAbs: invariantReport?.metrics?.maxMomentumDriftAbs ?? null,
    edgeMessageSummarySchema: edgeMessageSummary?.schema || null,
    edgeMessageSummaryStatus: edgeMessageSummary?.status || null,
    edgeMessageSummaryCount: edgeMessageSummaries.length,
    edgeMessageMaxNetForceAbs: edgeMessageSummary?.maxNetForceAbs ?? null,
    edgeMessageMaxAntisymmetricResidualAbs: edgeMessageSummary?.maxAntisymmetricResidualAbs ?? null,
    edgeMessageOutOfRangeCount: edgeMessageSummary?.outOfRangeCount ?? null,
    edgeMessageScientificValidation: typeof edgeMessageSummary?.scientificValidation === 'boolean'
      ? edgeMessageSummary.scientificValidation
      : null,
    edgeMessageFullPhysicsValidation: typeof edgeMessageSummary?.fullPhysicsValidation === 'boolean'
      ? edgeMessageSummary.fullPhysicsValidation
      : null,
    fieldObserverSummarySchema: fieldObserverSummary?.schema || null,
    fieldObserverSummaryStatus: fieldObserverSummary?.status || null,
    fieldObserverSummaryCount: fieldObserverSummaries.length,
    fieldObserverObservedFieldNames,
    fieldObserverZeroWeightCount: fieldObserverSummary?.zeroWeightCount ?? null,
    fieldObserverMaxNeighborCount: fieldObserverSummary?.maxNeighborCount ?? null,
    fieldObserverMaxWeightSum: fieldObserverSummary?.maxWeightSum ?? null,
    fieldObserverScientificValidation: typeof fieldObserverSummary?.scientificValidation === 'boolean'
      ? fieldObserverSummary.scientificValidation
      : null,
    fieldObserverFullPhysicsValidation: typeof fieldObserverSummary?.fullPhysicsValidation === 'boolean'
      ? fieldObserverSummary.fullPhysicsValidation
      : null,
    fieldClosureSampleSummarySchema: fieldClosureSampleSummary?.schema || null,
    fieldClosureSampleSummaryStatus: fieldClosureSampleSummary?.status || null,
    fieldClosureSampleSummaryCount: fieldClosureSampleSummaries.length,
    fieldClosureSampleValidityStatus: fieldClosureSampleSummary?.validityStatus || null,
    fieldClosureSampleKind: fieldClosureSampleSummary?.sampleKind || null,
    fieldClosureSampleClosureId: fieldClosureSampleSummary?.closureId || null,
    fieldClosureSampleFieldName: fieldClosureSampleSummary?.fieldName || null,
    fieldClosureSampleAxisName: fieldClosureSampleSummary?.axisName || null,
    fieldClosureSampleOutputName: fieldClosureSampleSummary?.outputName || null,
    fieldClosureSampleCount: fieldClosureSampleSummary?.sampleCount ?? null,
    fieldClosureSampleOutOfRangeCount: fieldClosureSampleSummary?.outOfRangeCount ?? null,
    fieldClosureSampleNullFieldCount: fieldClosureSampleSummary?.nullFieldCount ?? null,
    fieldClosureSampleMinInput: fieldClosureSampleSummary?.minInput ?? null,
    fieldClosureSampleMaxInput: fieldClosureSampleSummary?.maxInput ?? null,
    fieldClosureSampleMinSampledValue: fieldClosureSampleSummary?.minSampledValue ?? null,
    fieldClosureSampleMaxSampledValue: fieldClosureSampleSummary?.maxSampledValue ?? null,
    fieldClosureSampleMaxAbsDerivative: fieldClosureSampleSummary?.maxAbsDerivative ?? null,
    fieldClosureSampleRefreshRequestSchema: fieldClosureSampleRefreshRequest?.schema || null,
    fieldClosureSampleRefreshRequestStatus: fieldClosureSampleRefreshRequest?.status || null,
    fieldClosureSampleRefreshRecommended: typeof fieldClosureSampleSummary?.closureRefreshRecommended === 'boolean'
      ? fieldClosureSampleSummary.closureRefreshRecommended
      : (
          typeof fieldClosureSampleRefreshRequest?.refreshRecommended === 'boolean'
            ? fieldClosureSampleRefreshRequest.refreshRecommended
            : null
        ),
    fieldClosureSampleInvalidationRecommended: typeof fieldClosureSampleSummary?.closureInvalidationRecommended === 'boolean'
      ? fieldClosureSampleSummary.closureInvalidationRecommended
      : (
          typeof fieldClosureSampleRefreshRequest?.invalidationRecommended === 'boolean'
            ? fieldClosureSampleRefreshRequest.invalidationRecommended
            : null
        ),
    fieldClosureSampleRefreshReason:
      fieldClosureSampleSummary?.closureRefreshReason || fieldClosureSampleRefreshRequest?.reason || null,
    fieldClosureSampleRefreshRegistryAction:
      fieldClosureSampleSummary?.closureRefreshRegistryAction || fieldClosureSampleRefreshRequest?.registryAction || null,
    fieldClosureSampleMinOutOfRangeInput: fieldClosureSampleRefreshRequest?.minOutOfRangeInput ?? null,
    fieldClosureSampleMaxOutOfRangeInput: fieldClosureSampleRefreshRequest?.maxOutOfRangeInput ?? null,
    fieldClosureSampleScientificValidation: typeof fieldClosureSampleSummary?.scientificValidation === 'boolean'
      ? fieldClosureSampleSummary.scientificValidation
      : null,
    fieldClosureSampleFullPhysicsValidation: typeof fieldClosureSampleSummary?.fullPhysicsValidation === 'boolean'
      ? fieldClosureSampleSummary.fullPhysicsValidation
      : null,
    fieldClosureSampleMaterialValidation: typeof fieldClosureSampleSummary?.materialValidation === 'boolean'
      ? fieldClosureSampleSummary.materialValidation
      : null,
    fieldClosureSampleEosValidation: typeof fieldClosureSampleSummary?.eosValidation === 'boolean'
      ? fieldClosureSampleSummary.eosValidation
      : null,
    fieldClosureSampleSphValidation: typeof fieldClosureSampleSummary?.sphValidation === 'boolean'
      ? fieldClosureSampleSummary.sphValidation
      : null,
    fieldClosureSamplePhaseChangeValidation: typeof fieldClosureSampleSummary?.phaseChangeValidation === 'boolean'
      ? fieldClosureSampleSummary.phaseChangeValidation
      : null,
    validityStatus: validity.status || null,
    closureValidity: validity.closureValidity || null,
    validationStatus: validation.status || null,
    validationMode: validation.validationMode || null,
    scientificValidation,
    fullPhysicsValidation,
    calibratedPhysics,
    toyReference,
    blockerCount: blockers.length,
    blockers,
    summaryHash
  };
}

function createCurrentHamiltonianFromState({ state = {}, environment = {}, timeSeconds = 0 } = {}) {
  const atomicNumber = Math.max(1, Math.round(finite(state.orbital?.atomicNumber, 8)));
  const elementSymbol = state.orbital?.elementSymbol || 'O';
  return createHamiltonianSpec({
    id: `hamiltonian:${elementSymbol}:active-orbital:${state.orbital?.activeOrbitalLabel || 'unknown'}`,
    nuclei: [{
      Z: atomicNumber,
      isotopeMass: finite(state.orbital?.materialPotential?.atomProperties?.atomicMass, atomicNumber),
      position: [0, 0, 0]
    }],
    electrons: {
      count: Math.max(0, Math.round(finite(state.orbital?.electronCount, atomicNumber))),
      totalCharge: 0,
      temperature: finite(environment.ambientTemperatureK, 294)
    },
    boundary: {
      type: 'single-center-screened-orbital-patch',
      temperatureK: finite(environment.ambientTemperatureK, 294),
      pressurePa: finite(environment.ambientPressurePa, 101325),
      lengthUnit: 'bohr'
    },
    externalFields: {
      electricFieldVm: [finite(environment.electricFieldVm, 0), 0, 0],
      magneticFieldT: [0, finite(environment.magneticFieldT, 0), 0],
      gravityMps2: finite(environment.gravityMps2, 9.8)
    },
    approximation: 'screened_hydrogenic_reference',
    convergence: {
      targetResidual: 1e-4,
      status: state.orbital?.finiteGridEigenResidualWebgpuStatus || state.orbital?.finiteGridEigenResidualStatus || 'declared'
    },
    provenance: {
      source: 'peercompute-schrodinger-webgpu-orbital-contract',
      methodStatus: 'proxy-first-principles-scaffold',
      notes: [`time=${rounded(timeSeconds, 3)}`]
    }
  });
}

function createCurrentQuantumResult({ state = {}, hamiltonian } = {}) {
  return createQuantumStateResult({
    taskId: `qtask:${state.orbital?.elementSymbol || 'O'}:${state.orbital?.finiteGridSequence || 0}`,
    hamiltonian,
    method: hamiltonian?.approximation,
    totalEnergy: Number.isFinite(Number(state.orbital?.energyEv)) ? Number(state.orbital.energyEv) : null,
    electronDensity: state.orbital?.finiteGridSchema ? {
      schema: state.orbital.finiteGridSchema,
      backend: state.orbital.finiteGridBackend || 'unknown',
      gridSize: state.orbital.finiteGridSize || 0,
      normalizationError: state.orbital.finiteGridNormError || 0
    } : null,
    orbitals: {
      activeOrbital: state.orbital?.activeOrbitalLabel || 'unknown',
      principalN: state.orbital?.principalN || 0,
      angularL: state.orbital?.angularL || 0,
      magneticM: state.orbital?.magneticM || 0
    },
    polarizability: {
      scalarProxy: state.orbital?.polarizabilityProxy ?? null
    },
    uncertainty: {
      model: 'screened-hydrogenic-plus-reference-property-envelope',
      relative: 0.4
    },
    convergence: {
      status: state.orbital?.finiteGridEigenResidualWebgpuStatus || state.orbital?.finiteGridEigenResidualStatus || 'proxy',
      residual: state.orbital?.finiteGridEigenResidualWebgpuRelativeL2 || state.orbital?.finiteGridEigenResidualRelativeL2 || null,
      targetResidual: 1e-4
    },
    validity: {
      status: 'proxy-not-scientific',
      envelope: {
        temperatureK: [0, 2000],
        pressurePa: [1, 1e8],
        phase: [state.orbital?.materialPotentialPhase || 'unknown']
      },
      warnings: ['screened-hydrogenic reference is not calibrated many-electron electronic structure']
    }
  });
}

function createCurrentMaterialClosure({ state = {}, environment = {}, quantumResult } = {}) {
  const qmat = state.orbital?.materialPotential || {};
  const materialId = qmat.materialId || state.orbital?.materialPotentialMaterialId || state.orbital?.elementSymbol || 'unknown';
  return createDerivedMaterialClosure({
    id: `closure:material:${materialId}`,
    name: materialId,
    producedBy: 'screened_hydrogenic_reference',
    quantumResults: [quantumResult].filter(Boolean),
    structureDescriptor: {
      materialId,
      elementSymbol: state.orbital?.elementSymbol || null,
      dominantFormula: qmat.dominantFormula || null,
      phase: state.orbital?.materialPotentialPhase || qmat.phase || 'unknown',
      activeOrbital: state.orbital?.activeOrbitalLabel || null
    },
    stateRange: {
      temperatureK: [Math.max(0, finite(environment.ambientTemperatureK, 294) - 200), finite(environment.ambientTemperatureK, 294) + 200],
      pressurePa: [Math.max(1, finite(environment.ambientPressurePa, 101325) * 0.2), finite(environment.ambientPressurePa, 101325) * 5],
      strain: [0, 0.01],
      phase: [state.orbital?.materialPotentialPhase || qmat.phase || 'unknown']
    },
    values: {
      densityKgM3: state.orbital?.materialPotentialDensityKgM3 ?? qmat.densityKgM3 ?? null,
      bulkModulusPa: state.orbital?.materialPotentialBulkModulusPa ?? qmat.bulkModulusPa ?? null,
      youngsModulusPa: state.orbital?.materialPotentialYoungsModulusPa ?? qmat.youngsModulusPa ?? null,
      refractiveIndex: state.orbital?.materialPotentialRefractiveIndex ?? qmat.refractiveIndex ?? null,
      dielectricConstant: qmat.dielectricConstant ?? null,
      electricalConductivitySpm: state.orbital?.materialPotentialElectricalConductivitySpm ?? qmat.electricalConductivitySpm ?? null,
      bondStrengthTerms: qmat.bondStrengthTerms || []
    },
    uncertainty: {
      model: 'reference-property-plus-hydrogenic-proxy',
      relative: 0.4
    },
    invalidationTriggers: [
      { field: 'temperatureK', op: 'outside', value: 'stateRange.temperatureK' },
      { field: 'pressurePa', op: 'outside', value: 'stateRange.pressurePa' },
      { field: 'bondTopology', op: 'changes', value: true },
      { field: 'phase', op: 'changes', value: true }
    ]
  });
}

function createDefaultChannels() {
  return [
    createStateChannelDecl({ id: 'channel:x', quantity: 'position', unit: 'm', dimensions: ULG_DIMENSIONS.position, storage: 'hot:soa:f32x3' }),
    createStateChannelDecl({ id: 'channel:v', quantity: 'velocity', unit: 'm s^-1', dimensions: ULG_DIMENSIONS.velocity, storage: 'hot:soa:f32x3' }),
    createStateChannelDecl({ id: 'channel:mass', quantity: 'mass', unit: 'kg', dimensions: ULG_DIMENSIONS.mass, storage: 'hot:soa:f32' }),
    createStateChannelDecl({ id: 'channel:internal-energy', quantity: 'specific-internal-energy', unit: 'J kg^-1', dimensions: ULG_DIMENSIONS.energy, storage: 'hot:soa:f32' }),
    createStateChannelDecl({ id: 'channel:species', quantity: 'species-composition', unit: 'fraction', dimensions: ULG_DIMENSIONS.dimensionless, storage: 'hot:soa:u32/f32' }),
    createStateChannelDecl({ id: 'channel:charge', quantity: 'charge', unit: 'C', dimensions: ULG_DIMENSIONS.charge, storage: 'hot:soa:f32' }),
    createStateChannelDecl({ id: 'channel:temperature', quantity: 'temperature', unit: 'K', dimensions: ULG_DIMENSIONS.temperature, storage: 'warm/observed:f32' }),
    createStateChannelDecl({ id: 'channel:magnetic-field', quantity: 'magnetic-field', unit: 'T', dimensions: ULG_DIMENSIONS.magneticField, storage: 'hot:grid-face-or-carrier:f32x3' })
  ];
}

export function createUlgRuntimeManifest({
  state = {},
  environment = {},
  lawGraph = null,
  solverDescriptors = [],
  timeSeconds = 0,
  activeLayerId = 'unknown',
  carrierCount = null
} = {}) {
  const hamiltonian = createCurrentHamiltonianFromState({ state, environment, timeSeconds });
  const quantumResult = createCurrentQuantumResult({ state, hamiltonian });
  const materialClosure = createCurrentMaterialClosure({ state, environment, quantumResult });
  const channels = createDefaultChannels();
  const registry = createCarrierRegistry({
    domainId: 'peercompute-multiscale',
    representation: 'hybrid-carrier-graph-view',
    carrierKinds: [
      {
        id: 'carrier:atomic-or-molecular',
        label: 'atomic/molecular carrier',
        primitiveInputs: ['nuclear species', 'nuclear charge', 'nuclear mass', 'nuclear positions', 'electron count', 'charge state', 'boundary conditions'],
        refinementLevel: 8
      },
      {
        id: 'carrier:material-or-fluid',
        label: 'coarse material carrier',
        primitiveInputs: ['position', 'velocity', 'mass', 'internal energy', 'species fractions', 'closure id'],
        refinementLevel: 4
      },
      {
        id: 'carrier:stellar-plasma',
        label: 'stellar/plasma macro-carrier',
        primitiveInputs: ['position', 'velocity', 'mass', 'internal energy', 'species fractions', 'charge state', 'field state'],
        refinementLevel: 1
      }
    ],
    channels
  });
  const effectiveCarrierCount = Math.max(1, Math.round(finite(
    carrierCount,
    state.molecular?.molecularDynamics?.atomCount
      || state.mpm?.sphMaterial?.particleCount
      || 1024
  )));
  const passDag = compileUlgPassDag({
    carrierRegistry: registry,
    lawGraph,
    closures: [materialClosure],
    carrierCount: effectiveCarrierCount
  });
  const lawTaskCapsule = createLawTaskCapsule({
    taskId: `ulg-lawtask:${Math.round(finite(timeSeconds, 0) * 1000)}`,
    graphId: 'ulg:peercompute-multiscale',
    domainId: activeLayerId || 'multiscale',
    timestep: Math.round(finite(timeSeconds, 0) * 60),
    dt: 1 / 60,
    activeLawTerms: asArray(lawGraph?.lawNodes).map((node) => node.id).filter(Boolean),
    activeClosureIds: [materialClosure.id],
    kernelPasses: passDag.passes,
    inputStateHash: stableHash({ activeLayerId, stateKeys: Object.keys(state) }),
    lawHash: stableHash(lawGraph || {}),
    unitHash: stableHash(channels.map((channel) => channel.unitHash)),
    closureHash: materialClosure.closureHash,
    commitPolicy: 'local_only'
  });
  const quantumTaskCapsule = createQuantumTaskCapsule({
    regionId: 'orbital',
    hamiltonian,
    requestedOutputs: ['energy', 'electron_density', 'orbitals', 'forces', 'stress', 'response_derivatives'],
    targetClosureKinds: ['forces', 'bonding', 'elasticity', 'thermal', 'electrical', 'optical'],
    backendPreference: ['webgpu'],
    inputPatchHash: hamiltonian.hamiltonianHash
  });
  const invariantReport = createInvariantReport({
    mode: 'interactive-proxy',
    invariants: [
      {
        id: 'invariant:closure-provenance',
        quantity: 'closure-provenance',
        residual: materialClosure.validity.hasQuantumOrAtomicProvenance ? 0 : 1,
        tolerance: 0
      },
      {
        id: 'invariant:live-webgpu-only',
        quantity: 'live-backend-policy',
        residual: passDag.invalidLivePassCount,
        tolerance: 0
      },
      {
        id: 'invariant:wavefunction-normalization',
        quantity: 'wavefunction-normalization',
        residual: Math.abs(finite(state.orbital?.finiteGridNormError, 0)),
        tolerance: 1e-3
      }
    ]
  });
  const compactDelta = createCompactDelta({
    taskId: lawTaskCapsule.taskId,
    domainId: activeLayerId || 'multiscale',
    version: lawTaskCapsule.timestep,
    residuals: invariantReport.entries.map((entry) => ({
      id: entry.id,
      residual: entry.residual,
      status: entry.status
    })),
    hashes: {
      hamiltonianHash: hamiltonian.hamiltonianHash,
      closureHash: materialClosure.closureHash,
      lawHash: lawTaskCapsule.lawHash,
      unitHash: lawTaskCapsule.unitHash
    },
    payloadRefs: [
      hamiltonian.id,
      quantumResult.taskId,
      materialClosure.id,
      lawTaskCapsule.taskId
    ]
  });
  const scientificReady = materialClosure.validity.scientificReady
    && passDag.status === 'scientific-pass-dag-ready'
    && invariantReport.status === 'pass';
  return {
    schema: ULG_RUNTIME_MANIFEST_SCHEMA,
    modelId: 'ulg-star-material-runtime-stage0-v0',
    specVersion: ULG_SPEC_VERSION,
    status: scientificReady ? 'scientific-runtime-ready' : 'proxy-runtime-ready-scientific-blocked',
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
    runtimeSplit: {
      graphOrchestration: 'js-law-graph-validity-scheduler',
      denseExecution: 'worker-local-webgpu-pass-dag',
      wgslGraphTraversal: false
    },
    carrierRegistry: registry,
    hamiltonian,
    quantumStateResult: quantumResult,
    materialClosures: [materialClosure],
    passDag,
    lawTaskCapsule,
    quantumTaskCapsule,
    invariantReport,
    compactDelta,
    solverDescriptorCount: asArray(solverDescriptors).length,
    lawGraphSchema: lawGraph?.schema || null,
    closureCount: 1,
    stateChannelCount: registry.stateChannelCount,
    carrierKindCount: registry.carrierKindCount,
    passCount: passDag.passCount,
    webgpuPassCount: passDag.webgpuPassCount,
    invalidLivePassCount: passDag.invalidLivePassCount,
    materialClosureReadyCount: materialClosure.validity.proxyReady ? 1 : 0,
    scientificBlockedClosureCount: passDag.scientificBlockedClosureCount,
    nextRequiredStep: scientificReady
      ? 'dispatch-validated-webgpu-pass-capsules'
      : passDag.nextRequiredStep
  };
}
