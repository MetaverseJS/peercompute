import { SCALE_LAYERS } from '../simulation/multiscaleModel.js';
import { WEBGPU_PARTICLE_COUNT, WEBGPU_PARTICLE_RECORD_BYTES } from './webgpuLadderCompute.js';

export const MULTISCALE_COMPUTE_BUDGET_SCHEMA = 'peercompute.multiscale.compute-budget.v0';
export const MULTISCALE_SOLVER_BUDGET_SCHEMA = 'peercompute.multiscale.solver-budget.v0';
export const MULTISCALE_SOLVER_ADMISSION_SCHEMA = 'peercompute.multiscale.solver-admission.v0';

const BASELINE_WORKERS_BY_TIER = {
  mobile: 2,
  laptop: 8,
  workstation: 16,
  cluster: 64
};

const DEFAULT_MEMORY_BUDGET_MB_BY_TIER = {
  mobile: 384,
  laptop: 1024,
  workstation: 2048,
  cluster: 8192
};

const DEFAULT_GPU_MEMORY_BUDGET_MB_BY_TIER = {
  mobile: 192,
  laptop: 512,
  workstation: 1024,
  cluster: 4096
};

const SOLVER_ADMISSION_PROFILES = {
  nbody: { itemName: 'nbody-bodies', kind: 'count', unitField: 'bodyCount', minItems: 2, strideBytes: 96, memoryFraction: 0.01 },
  maxwell: { itemName: 'maxwell-cells', kind: 'square-grid', widthField: 'width', minItems: 16, strideBytes: 48, memoryFraction: 0.02 },
  cosmologyExpansion: { itemName: 'cosmology-samples', kind: 'count', unitField: 'sampleCount', minItems: 8, strideBytes: 64, memoryFraction: 0.02 },
  molecularDynamics: { itemName: 'molecular-atoms', kind: 'count', unitField: 'atomCount', minItems: 3, strideBytes: 192, memoryFraction: 0.05 },
  quantumOrbitalGrid: { itemName: 'quantum-grid-samples', kind: 'count', unitField: 'sampleCount', minItems: 512, strideBytes: 32, memoryFraction: 0.01 },
  quantumMaterialPotential: { itemName: 'quantum-material-records', kind: 'count', unitField: 'sampleCount', minItems: 16, strideBytes: 64, memoryFraction: 0.01 },
  reactiveThermal: { itemName: 'reactive-cells', kind: 'count', unitField: 'cellCount', minItems: 1, strideBytes: 64, memoryFraction: 0.005 },
  sphMaterial: { itemName: 'sph-particles', kind: 'count', unitField: 'particleCount', minItems: 16, strideBytes: 128, memoryFraction: 0.04 },
  hydroAtmosphere: { itemName: 'hydro-cells', kind: 'half-grid', widthField: 'width', minItems: 16, strideBytes: 48, memoryFraction: 0.02 },
  radiationOpacity: { itemName: 'radiation-cells', kind: 'half-grid', widthField: 'width', minItems: 16, strideBytes: 48, memoryFraction: 0.02 },
  stellarFusion: { itemName: 'stellar-cells', kind: 'half-grid', widthField: 'width', minItems: 16, strideBytes: 64, memoryFraction: 0.02 },
  magnetospherePlasma: { itemName: 'magnetosphere-cells', kind: 'half-grid', widthField: 'width', minItems: 16, strideBytes: 80, memoryFraction: 0.025 },
  relativisticCorrection: { itemName: 'relativity-samples', kind: 'count', unitField: 'sampleCount', minItems: 4, strideBytes: 64, memoryFraction: 0.02 },
  combustionPlume: { itemName: 'combustion-cells', kind: 'half-grid', widthField: 'width', minItems: 16, strideBytes: 64, memoryFraction: 0.02 },
  membraneShell: { itemName: 'membrane-segments', kind: 'count', unitField: 'segmentCount', minItems: 8, strideBytes: 96, memoryFraction: 0.02 }
};

function normalizeInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeNumber(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function rounded(value, digits = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

function normalizeGravityMode(value, fallback = 'auto') {
  const normalized = String(value || fallback).trim().toLowerCase();
  if (['tree', 'barnes-hut', 'barnes_hut', 'bh'].includes(normalized)) return 'tree';
  if (['direct', 'direct-sum', 'direct_sum'].includes(normalized)) return 'direct';
  return 'auto';
}

function readNumberParam(searchParams, key) {
  const value = searchParams?.get?.(key);
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function readBooleanParam(searchParams, key) {
  const value = searchParams?.get?.(key);
  if (value == null || value === '') return null;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

function readStringListParam(searchParams, ...keys) {
  for (const key of keys) {
    const value = searchParams?.get?.(key);
    if (value == null) continue;
    return String(value)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return undefined;
}

function clampScale(value, fallback = 1, min = 0.25, max = 8) {
  return normalizeNumber(value, fallback, min, max);
}

function tierBaselineWorkers(tier) {
  return BASELINE_WORKERS_BY_TIER[tier] || BASELINE_WORKERS_BY_TIER.laptop;
}

function tierMemoryBudgetMB(tier) {
  return DEFAULT_MEMORY_BUDGET_MB_BY_TIER[tier] || DEFAULT_MEMORY_BUDGET_MB_BY_TIER.laptop;
}

function tierGpuMemoryBudgetMB(tier) {
  return DEFAULT_GPU_MEMORY_BUDGET_MB_BY_TIER[tier] || DEFAULT_GPU_MEMORY_BUDGET_MB_BY_TIER.laptop;
}

function deriveCapacityScale({ computeBudget = null, resourceProfile = {}, workerPolicy = {}, overrides = {} } = {}) {
  const tier = resourceProfile.tier || computeBudget?.resourceTier || 'laptop';
  const workloadScale = computeBudget?.workload?.capacity?.budgetScale;
  if (Number.isFinite(Number(workloadScale))) {
    return clampScale(Number(workloadScale));
  }
  const targetWorkers = normalizeInteger(
    workerPolicy.targetWorkers ?? computeBudget?.managerTargetWorkers,
    tierBaselineWorkers(tier),
    1,
    1024
  );
  const workerScale = clampScale(targetWorkers / tierBaselineWorkers(tier));
  const memoryBudgetMB = normalizeNumber(resourceProfile.memoryBudgetMB, tierMemoryBudgetMB(tier), 0, 1048576);
  const gpuMemoryBudgetMB = normalizeNumber(resourceProfile.gpuMemoryBudgetMB, tierGpuMemoryBudgetMB(tier), 0, 1048576);
  const memoryScale = clampScale(memoryBudgetMB / tierMemoryBudgetMB(tier));
  const gpuScale = resourceProfile.gpuAvailable === false
    ? 0.75
    : clampScale(gpuMemoryBudgetMB / tierGpuMemoryBudgetMB(tier));
  const explicitScale = normalizeNumber(overrides.budgetScale, resourceProfile.budgetScale || 1, 0.05, 64);
  return clampScale(Math.min(workerScale, memoryScale, gpuScale) * explicitScale);
}

function scaledInteger(base, scale, min, max, multiple = 1) {
  const scaled = base * scale;
  const rounded = multiple > 1
    ? Math.max(multiple, Math.round(scaled / multiple) * multiple)
    : Math.round(scaled);
  return normalizeInteger(rounded, base, min, max);
}

function budgetUnitsFor(entry = {}, profile = {}) {
  if (profile.kind === 'count') return normalizeInteger(entry[profile.unitField], 0, 0, Number.MAX_SAFE_INTEGER);
  return normalizeInteger(entry.cellCount ?? ((entry.width || 0) * (entry.height || 0)), 0, 0, Number.MAX_SAFE_INTEGER);
}

function halfGridHeight(width) {
  return Math.max(4, Math.round(width / 2));
}

function widthForAdmittedCells({ profile, currentWidth, admittedUnits }) {
  if (profile.kind === 'square-grid') {
    return normalizeInteger(Math.floor(Math.sqrt(Math.max(1, admittedUnits))), currentWidth, 4, currentWidth);
  }
  const approximate = Math.sqrt(Math.max(1, admittedUnits) * 2);
  return normalizeInteger(Math.floor(approximate), currentWidth, 4, currentWidth);
}

function applyAdmissionToBudgetEntry(entry = {}, profile = {}, admittedUnits) {
  if (profile.kind === 'count') {
    return {
      ...entry,
      [profile.unitField]: normalizeInteger(admittedUnits, entry[profile.unitField] || profile.minItems, profile.minItems)
    };
  }
  const currentWidth = normalizeInteger(entry.width, 4, 4, 128);
  const width = widthForAdmittedCells({ profile, currentWidth, admittedUnits });
  const height = profile.kind === 'square-grid' ? width : halfGridHeight(width);
  return {
    ...entry,
    width,
    height,
    cellCount: width * height
  };
}

function estimateAdmissionLimit(computeManager, {
  itemName,
  requestedUnits,
  minItems,
  strideBytes,
  memoryFraction
} = {}) {
  if (!computeManager?.estimateWorkloadBudget) {
    return null;
  }
  return computeManager.estimateWorkloadBudget({
    itemName,
    baseItems: Math.max(minItems, requestedUnits),
    minItems,
    maxItems: Math.max(minItems, requestedUnits),
    itemStrideBytes: strideBytes,
    memoryFraction,
    layerCount: 1,
    maxShardsPerLayer: 1
  });
}

function clampBudgetEntryByAdmission(computeManager, solverKey, entry = {}, profile = {}) {
  const requestedUnits = Math.max(profile.minItems, budgetUnitsFor(entry, profile));
  const estimate = estimateAdmissionLimit(computeManager, {
    itemName: profile.itemName,
    requestedUnits,
    minItems: profile.minItems,
    strideBytes: profile.strideBytes,
    memoryFraction: profile.memoryFraction
  });
  const effectiveMaxUnits = normalizeInteger(
    estimate?.effectiveMaxItems,
    requestedUnits,
    profile.minItems,
    Math.max(profile.minItems, requestedUnits)
  );
  const admittedUnits = Math.min(requestedUnits, effectiveMaxUnits);
  const nextEntry = applyAdmissionToBudgetEntry(entry, profile, admittedUnits);
  const nextUnits = budgetUnitsFor(nextEntry, profile);
  const clamped = nextUnits < requestedUnits;
  return {
    entry: nextEntry,
    report: {
      solverKey,
      itemName: profile.itemName,
      requestedUnits,
      admittedUnits: nextUnits,
      effectiveMaxUnits,
      clamped,
      reason: clamped ? 'resource-admission-clamp' : 'within-resource-envelope',
      strideBytes: profile.strideBytes,
      memoryFraction: profile.memoryFraction,
      estimate: estimate
        ? {
          schema: estimate.schema,
          itemCount: estimate.itemCount,
          effectiveMaxItems: estimate.effectiveMaxItems,
          memoryMaxItems: estimate.capacity?.memoryMaxItems ?? null,
          gpuMaxItems: estimate.capacity?.gpuMaxItems ?? null,
          limitingFactor: estimate.capacity?.limitingFactor || null
        }
        : null
    }
  };
}

function clampPicBudgetEntryByAdmission(computeManager, entry = {}) {
  const particleProfile = {
    itemName: 'pic-particles',
    kind: 'count',
    unitField: 'particleCount',
    minItems: 8,
    strideBytes: 128,
    memoryFraction: 0.035
  };
  const gridProfile = {
    itemName: 'pic-cells',
    kind: 'half-grid',
    widthField: 'gridWidth',
    minItems: 16,
    strideBytes: 64,
    memoryFraction: 0.02
  };
  const particleResult = clampBudgetEntryByAdmission(
    computeManager,
    'picPlasmaPatch.particles',
    entry,
    particleProfile
  );
  const gridEntry = {
    width: entry.gridWidth,
    height: entry.gridHeight,
    cellCount: entry.cellCount
  };
  const gridResult = clampBudgetEntryByAdmission(
    computeManager,
    'picPlasmaPatch.grid',
    gridEntry,
    gridProfile
  );
  return {
    entry: {
      ...entry,
      particleCount: particleResult.entry.particleCount,
      gridWidth: gridResult.entry.width,
      gridHeight: gridResult.entry.height,
      cellCount: gridResult.entry.cellCount
    },
    report: {
      solverKey: 'picPlasmaPatch',
      itemName: 'pic-particles+cells',
      requestedUnits: Math.max(particleResult.report.requestedUnits, gridResult.report.requestedUnits),
      admittedUnits: Math.max(particleResult.report.admittedUnits, gridResult.report.admittedUnits),
      effectiveMaxUnits: Math.min(particleResult.report.effectiveMaxUnits, gridResult.report.effectiveMaxUnits),
      clamped: particleResult.report.clamped || gridResult.report.clamped,
      reason: particleResult.report.clamped || gridResult.report.clamped
        ? 'resource-admission-clamp'
        : 'within-resource-envelope',
      particle: particleResult.report,
      grid: gridResult.report
    }
  };
}

export function readComputeOverrides(search = globalThis.location?.search || '') {
  const params = new URLSearchParams(search);
  return {
    tier: params.get('computeTier') || params.get('deviceTier') || undefined,
    cpuCores: readNumberParam(params, 'cpuCores') ?? undefined,
    deviceMemoryGB: readNumberParam(params, 'deviceMemoryGB') ?? readNumberParam(params, 'deviceMemory') ?? undefined,
    memoryBudgetMB: readNumberParam(params, 'memoryBudgetMB') ?? readNumberParam(params, 'ramBudgetMB') ?? undefined,
    gpuMemoryBudgetMB: readNumberParam(params, 'gpuMemoryBudgetMB') ?? readNumberParam(params, 'gpuBudgetMB') ?? readNumberParam(params, 'vramBudgetMB') ?? undefined,
    budgetScale: readNumberParam(params, 'budgetScale') ?? readNumberParam(params, 'resourceBudgetScale') ?? readNumberParam(params, 'computeScale') ?? undefined,
    clusterNodes: readNumberParam(params, 'clusterNodes') ?? readNumberParam(params, 'clusterNodeCount') ?? undefined,
    clusterGpus: readNumberParam(params, 'clusterGpus') ?? readNumberParam(params, 'clusterGpuCount') ?? undefined,
    networkBandwidthMbps: readNumberParam(params, 'networkBandwidthMbps') ?? readNumberParam(params, 'downlinkMbps') ?? undefined,
    networkRttMs: readNumberParam(params, 'networkRttMs') ?? readNumberParam(params, 'rttMs') ?? undefined,
    networkEffectiveType: params.get('networkEffectiveType') || params.get('effectiveType') || undefined,
    networkSaveData: readBooleanParam(params, 'networkSaveData') ?? readBooleanParam(params, 'saveData') ?? undefined,
    enableRemotePlacement: readBooleanParam(params, 'enableRemotePlacement') ?? readBooleanParam(params, 'remotePlacement') ?? undefined,
    enableLoopbackRemotePlacement: readBooleanParam(params, 'enableLoopbackRemotePlacement')
      ?? readBooleanParam(params, 'remotePlacementLoopback')
      ?? undefined,
    remotePlacementExecutorMode: params.get('remotePlacementExecutorMode') || params.get('placementExecutorMode') || undefined,
    remotePlacementPeerId: params.get('remotePlacementPeerId') || params.get('remotePeerId') || undefined,
    autoSelectRemotePlacementPeer: readBooleanParam(params, 'autoSelectRemotePlacementPeer')
      ?? readBooleanParam(params, 'remotePlacementAutoSelectPeer')
      ?? readBooleanParam(params, 'autoSelectRemotePeer')
      ?? undefined,
    balanceRemotePlacementPeers: readBooleanParam(params, 'balanceRemotePlacementPeers')
      ?? readBooleanParam(params, 'remotePlacementBalancePeers')
      ?? readBooleanParam(params, 'remotePeerLoadBalance')
      ?? undefined,
    remotePlacementBalanceSeed: readNumberParam(params, 'remotePlacementBalanceSeed')
      ?? readNumberParam(params, 'remotePeerBalanceSeed')
      ?? readNumberParam(params, 'balanceSeed')
      ?? undefined,
    remotePlacementMode: params.get('remotePlacementMode') || undefined,
    remotePlacementTimeoutMs: readNumberParam(params, 'remotePlacementTimeoutMs') ?? readNumberParam(params, 'remoteComputeTimeoutMs') ?? undefined,
    remotePlacementPrimaryTimeoutMs: readNumberParam(params, 'remotePlacementPrimaryTimeoutMs')
      ?? readNumberParam(params, 'remotePrimaryTimeoutMs')
      ?? readNumberParam(params, 'primaryTimeoutMs')
      ?? undefined,
    remotePlacementReplicaTimeoutMs: readNumberParam(params, 'remotePlacementReplicaTimeoutMs')
      ?? readNumberParam(params, 'remoteReplicaTimeoutMs')
      ?? readNumberParam(params, 'replicaTimeoutMs')
      ?? undefined,
    remotePlacementReplicaPeerIds: readStringListParam(
      params,
      'remotePlacementReplicaPeerIds',
      'remoteReplicaPeerIds',
      'replicaPeerIds'
    ),
    remotePlacementTargetReplicaCount: readNumberParam(params, 'remotePlacementTargetReplicaCount')
      ?? readNumberParam(params, 'remoteTargetReplicaCount')
      ?? readNumberParam(params, 'targetReplicaCount')
      ?? undefined,
    remotePlacementQuorumResultCount: readNumberParam(params, 'remotePlacementQuorumResultCount')
      ?? readNumberParam(params, 'remoteQuorumResultCount')
      ?? readNumberParam(params, 'quorumResultCount')
      ?? undefined,
    gpuLimits: {
      maxBufferSize: readNumberParam(params, 'gpuMaxBufferSize') ?? readNumberParam(params, 'maxBufferSize') ?? undefined,
      maxStorageBufferBindingSize: readNumberParam(params, 'gpuMaxStorageBufferBindingSize') ?? readNumberParam(params, 'maxStorageBufferBindingSize') ?? undefined,
      maxComputeWorkgroupStorageSize: readNumberParam(params, 'gpuMaxComputeWorkgroupStorageSize') ?? readNumberParam(params, 'maxComputeWorkgroupStorageSize') ?? undefined,
      maxComputeInvocationsPerWorkgroup: readNumberParam(params, 'gpuMaxComputeInvocationsPerWorkgroup') ?? readNumberParam(params, 'maxComputeInvocationsPerWorkgroup') ?? undefined,
      maxComputeWorkgroupsPerDimension: readNumberParam(params, 'gpuMaxComputeWorkgroupsPerDimension') ?? readNumberParam(params, 'maxComputeWorkgroupsPerDimension') ?? undefined
    },
    minWorkers: readNumberParam(params, 'minWorkers') ?? undefined,
    targetWorkers: readNumberParam(params, 'targetWorkers') ?? readNumberParam(params, 'workers') ?? undefined,
    maxWorkers: readNumberParam(params, 'maxWorkers') ?? undefined,
    autoScaleWorkers: readBooleanParam(params, 'autoScaleWorkers')
      ?? readBooleanParam(params, 'autoScale')
      ?? undefined,
    autoScaleWorkloads: readBooleanParam(params, 'autoScaleWorkloads')
      ?? readBooleanParam(params, 'autoScale')
      ?? undefined,
    maxParticles: readNumberParam(params, 'maxParticles') ?? undefined,
    particleCount: readNumberParam(params, 'particles') ?? readNumberParam(params, 'particleCount') ?? undefined,
    workersPerScale: readNumberParam(params, 'workersPerScale') ?? readNumberParam(params, 'shardsPerScale') ?? undefined,
    nbodyBodies: readNumberParam(params, 'nbodyBodies') ?? readNumberParam(params, 'bodies') ?? undefined,
    nbodyMode: params.get('nbodyMode') || params.get('gravityMode') || undefined,
    nbodyTheta: readNumberParam(params, 'nbodyTheta') ?? readNumberParam(params, 'treeTheta') ?? undefined,
    nbodyTreeThreshold: readNumberParam(params, 'nbodyTreeThreshold') ?? readNumberParam(params, 'treeThreshold') ?? undefined,
    nbodyLeafSize: readNumberParam(params, 'nbodyLeafSize') ?? readNumberParam(params, 'treeLeafSize') ?? undefined,
    maxwellGrid: readNumberParam(params, 'maxwellGrid') ?? readNumberParam(params, 'fieldGrid') ?? undefined,
    cosmologySamples: readNumberParam(params, 'cosmologySamples') ?? readNumberParam(params, 'cosmologyHalos') ?? readNumberParam(params, 'cosmologyParticles') ?? undefined,
    molecularAtoms: readNumberParam(params, 'molecularAtoms') ?? readNumberParam(params, 'mdAtoms') ?? readNumberParam(params, 'molecularParticles') ?? undefined,
    sphParticles: readNumberParam(params, 'sphParticles') ?? readNumberParam(params, 'materialParticles') ?? undefined,
    hydroGrid: readNumberParam(params, 'hydroGrid') ?? readNumberParam(params, 'weatherGrid') ?? undefined,
    radiationGrid: readNumberParam(params, 'radiationGrid') ?? readNumberParam(params, 'opacityGrid') ?? undefined,
    stellarGrid: readNumberParam(params, 'stellarGrid') ?? readNumberParam(params, 'fusionGrid') ?? undefined,
    magnetosphereGrid: readNumberParam(params, 'magnetosphereGrid') ?? readNumberParam(params, 'mhdGrid') ?? readNumberParam(params, 'plasmaGrid') ?? undefined,
    picGrid: readNumberParam(params, 'picGrid') ?? readNumberParam(params, 'kineticGrid') ?? undefined,
    picParticles: readNumberParam(params, 'picParticles') ?? readNumberParam(params, 'kineticParticles') ?? undefined,
    relativitySamples: readNumberParam(params, 'relativitySamples') ?? readNumberParam(params, 'relativisticSamples') ?? undefined,
    combustionGrid: readNumberParam(params, 'combustionGrid') ?? readNumberParam(params, 'fireGrid') ?? undefined,
    membraneSegments: readNumberParam(params, 'membraneSegments') ?? readNumberParam(params, 'shellSegments') ?? undefined,
    solverCadence: readNumberParam(params, 'solverCadence') ?? undefined,
    nbodyCadence: readNumberParam(params, 'nbodyCadence') ?? undefined,
    maxwellCadence: readNumberParam(params, 'maxwellCadence') ?? undefined,
    cosmologyCadence: readNumberParam(params, 'cosmologyCadence') ?? readNumberParam(params, 'expansionCadence') ?? undefined,
    molecularCadence: readNumberParam(params, 'molecularCadence') ?? readNumberParam(params, 'mdCadence') ?? undefined,
    reactiveCadence: readNumberParam(params, 'reactiveCadence') ?? undefined,
    sphCadence: readNumberParam(params, 'sphCadence') ?? undefined,
    hydroCadence: readNumberParam(params, 'hydroCadence') ?? readNumberParam(params, 'weatherCadence') ?? undefined,
    radiationCadence: readNumberParam(params, 'radiationCadence') ?? readNumberParam(params, 'opacityCadence') ?? undefined,
    stellarCadence: readNumberParam(params, 'stellarCadence') ?? readNumberParam(params, 'fusionCadence') ?? undefined,
    magnetosphereCadence: readNumberParam(params, 'magnetosphereCadence') ?? readNumberParam(params, 'mhdCadence') ?? readNumberParam(params, 'plasmaCadence') ?? undefined,
    picCadence: readNumberParam(params, 'picCadence') ?? readNumberParam(params, 'kineticCadence') ?? undefined,
    relativityCadence: readNumberParam(params, 'relativityCadence') ?? readNumberParam(params, 'relativisticCadence') ?? undefined,
    combustionCadence: readNumberParam(params, 'combustionCadence') ?? readNumberParam(params, 'fireCadence') ?? undefined,
    membraneCadence: readNumberParam(params, 'membraneCadence') ?? readNumberParam(params, 'shellCadence') ?? undefined
  };
}

export function createMultiscaleComputeBudget(computeManager, {
  layerCount = SCALE_LAYERS.length,
  baseParticleCount = WEBGPU_PARTICLE_COUNT,
  minParticleCount = 1024,
  maxParticleCount = null,
  overrides = {}
} = {}) {
  const initialResourceProfile = computeManager?.getResourceProfile?.() || {};
  const tier = initialResourceProfile.tier || 'laptop';
  const tierMaxParticleCount = tier === 'cluster'
    ? 32768
    : tier === 'workstation'
      ? 8192
      : tier === 'mobile'
        ? 2048
        : 4096;
  const budgetMaxParticleCount = normalizeInteger(
    overrides.maxParticles,
    maxParticleCount || tierMaxParticleCount,
    minParticleCount,
    1048576
  );
  const workload = computeManager?.estimateWorkloadBudget?.({
    itemName: 'particles',
    baseItems: baseParticleCount,
    minItems: minParticleCount,
    maxItems: budgetMaxParticleCount,
    itemStrideBytes: WEBGPU_PARTICLE_RECORD_BYTES,
    memoryFraction: 0.05,
    layerCount,
    maxShardsPerLayer: 8
  });
  const workerPolicy = computeManager?.getWorkerPolicy?.() || workload?.workerPolicy || {};
  const resourceProfile = computeManager?.getResourceProfile?.() || workload?.resourceProfile || {};
  const capacityScale = workload?.capacity?.budgetScale
    ?? deriveCapacityScale({ computeBudget: { workload, resourceTier: resourceProfile.tier }, resourceProfile, workerPolicy, overrides });
  const workersPerScale = normalizeInteger(
    overrides.workersPerScale,
    workload?.shardsPerLayer || 1,
    1,
    8
  );
  const totalParticleCount = normalizeInteger(
    overrides.particleCount,
    workload?.itemCount || baseParticleCount,
    minParticleCount,
    workload?.effectiveMaxItems || 1048576
  );

  return {
    schema: MULTISCALE_COMPUTE_BUDGET_SCHEMA,
    resourceTier: resourceProfile.tier || 'unknown',
    resourceProfile,
    workerPolicy,
    capacity: workload?.capacity || {
      schema: 'peercompute.compute.capacity-budget.v0',
      budgetScale: capacityScale
    },
    workersPerScale,
    layerCount,
    plannedWorkers: workersPerScale * layerCount,
    managerTargetWorkers: workerPolicy.targetWorkers || workload?.workerCount || workersPerScale * layerCount,
    managerMinWorkers: workerPolicy.minWorkers ?? null,
    managerMaxWorkers: workerPolicy.maxWorkers ?? null,
    totalParticleCount,
    particleScale: totalParticleCount / baseParticleCount,
    workload
  };
}

export function createMultiscaleSolverBudget(computeManager, {
  computeBudget = null,
  overrides = {}
} = {}) {
  const resourceProfile = computeManager?.getResourceProfile?.() || computeBudget?.resourceProfile || {};
  const tier = resourceProfile.tier || computeBudget?.resourceTier || 'laptop';
  const workerPolicy = computeManager?.getWorkerPolicy?.() || computeBudget?.workerPolicy || {};
  const capacityScale = deriveCapacityScale({ computeBudget, resourceProfile, workerPolicy, overrides });
  const table = {
    mobile: {
      nbodyBodies: 7,
      maxwellGrid: 12,
      cosmologySamples: 72,
      molecularAtoms: 36,
      sphParticles: 64,
      hydroGrid: 10,
      radiationGrid: 10,
      stellarGrid: 10,
      magnetosphereGrid: 10,
      picGrid: 10,
      picParticles: 64,
      relativitySamples: 48,
      quantumGrid: 14,
      quantumMaterialSamples: 64,
      combustionGrid: 10,
      membraneSegments: 32,
      cadence: { nbody: 4, maxwell: 5, cosmologyExpansion: 8, molecularDynamics: 3, quantumOrbitalGrid: 4, quantumMaterialPotential: 4, reactiveThermal: 3, sphMaterial: 2, hydroAtmosphere: 4, radiationOpacity: 5, stellarFusion: 6, magnetospherePlasma: 6, picPlasmaPatch: 5, relativisticCorrection: 8, combustionPlume: 3, membraneShell: 2 }
    },
    laptop: {
      nbodyBodies: 9,
      maxwellGrid: 16,
      cosmologySamples: 96,
      molecularAtoms: 54,
      sphParticles: 96,
      hydroGrid: 14,
      radiationGrid: 14,
      stellarGrid: 14,
      magnetosphereGrid: 14,
      picGrid: 14,
      picParticles: 96,
      relativitySamples: 72,
      quantumGrid: 18,
      quantumMaterialSamples: 128,
      combustionGrid: 14,
      membraneSegments: 64,
      cadence: { nbody: 3, maxwell: 4, cosmologyExpansion: 7, molecularDynamics: 3, quantumOrbitalGrid: 3, quantumMaterialPotential: 3, reactiveThermal: 2, sphMaterial: 1, hydroAtmosphere: 3, radiationOpacity: 4, stellarFusion: 5, magnetospherePlasma: 5, picPlasmaPatch: 4, relativisticCorrection: 6, combustionPlume: 2, membraneShell: 1 }
    },
    workstation: {
      nbodyBodies: 15,
      maxwellGrid: 20,
      cosmologySamples: 160,
      molecularAtoms: 96,
      sphParticles: 160,
      hydroGrid: 20,
      radiationGrid: 20,
      stellarGrid: 20,
      magnetosphereGrid: 20,
      picGrid: 20,
      picParticles: 160,
      relativitySamples: 128,
      quantumGrid: 22,
      quantumMaterialSamples: 256,
      combustionGrid: 20,
      membraneSegments: 128,
      cadence: { nbody: 2, maxwell: 3, cosmologyExpansion: 6, molecularDynamics: 2, quantumOrbitalGrid: 2, quantumMaterialPotential: 2, reactiveThermal: 1, sphMaterial: 1, hydroAtmosphere: 3, radiationOpacity: 3, stellarFusion: 4, magnetospherePlasma: 4, picPlasmaPatch: 3, relativisticCorrection: 5, combustionPlume: 2, membraneShell: 1 }
    },
    cluster: {
      nbodyBodies: 32,
      maxwellGrid: 32,
      cosmologySamples: 384,
      molecularAtoms: 192,
      sphParticles: 384,
      hydroGrid: 32,
      radiationGrid: 32,
      stellarGrid: 32,
      magnetosphereGrid: 32,
      picGrid: 32,
      picParticles: 384,
      relativitySamples: 256,
      quantumGrid: 28,
      quantumMaterialSamples: 512,
      combustionGrid: 32,
      membraneSegments: 256,
      cadence: { nbody: 1, maxwell: 2, cosmologyExpansion: 4, molecularDynamics: 1, quantumOrbitalGrid: 1, quantumMaterialPotential: 1, reactiveThermal: 1, sphMaterial: 1, hydroAtmosphere: 2, radiationOpacity: 2, stellarFusion: 3, magnetospherePlasma: 3, picPlasmaPatch: 2, relativisticCorrection: 4, combustionPlume: 1, membraneShell: 1 }
    }
  };
  const profile = table[tier] || table.laptop;
  const globalCadence = normalizeInteger(overrides.solverCadence, 0, 0, 120);
  const cadence = {
    nbody: normalizeInteger(overrides.nbodyCadence, globalCadence || profile.cadence.nbody, 1, 120),
    maxwell: normalizeInteger(overrides.maxwellCadence, globalCadence || profile.cadence.maxwell, 1, 120),
    cosmologyExpansion: normalizeInteger(overrides.cosmologyCadence, globalCadence || profile.cadence.cosmologyExpansion, 1, 120),
    molecularDynamics: normalizeInteger(overrides.molecularCadence, globalCadence || profile.cadence.molecularDynamics, 1, 120),
    quantumOrbitalGrid: normalizeInteger(overrides.quantumGridCadence ?? overrides.orbitalCadence, globalCadence || profile.cadence.quantumOrbitalGrid, 1, 120),
    quantumMaterialPotential: normalizeInteger(overrides.quantumMaterialCadence ?? overrides.materialPotentialCadence, globalCadence || profile.cadence.quantumMaterialPotential || profile.cadence.quantumOrbitalGrid, 1, 120),
    reactiveThermal: normalizeInteger(overrides.reactiveCadence, globalCadence || profile.cadence.reactiveThermal, 1, 120),
    sphMaterial: normalizeInteger(overrides.sphCadence, globalCadence || profile.cadence.sphMaterial, 1, 120),
    hydroAtmosphere: normalizeInteger(overrides.hydroCadence, globalCadence || profile.cadence.hydroAtmosphere, 1, 120),
    radiationOpacity: normalizeInteger(overrides.radiationCadence, globalCadence || profile.cadence.radiationOpacity, 1, 120),
    stellarFusion: normalizeInteger(overrides.stellarCadence, globalCadence || profile.cadence.stellarFusion, 1, 120),
    magnetospherePlasma: normalizeInteger(overrides.magnetosphereCadence, globalCadence || profile.cadence.magnetospherePlasma, 1, 120),
    picPlasmaPatch: normalizeInteger(overrides.picCadence, globalCadence || profile.cadence.picPlasmaPatch, 1, 120),
    relativisticCorrection: normalizeInteger(overrides.relativityCadence, globalCadence || profile.cadence.relativisticCorrection, 1, 120),
    combustionPlume: normalizeInteger(overrides.combustionCadence, globalCadence || profile.cadence.combustionPlume, 1, 120),
    membraneShell: normalizeInteger(overrides.membraneCadence, globalCadence || profile.cadence.membraneShell, 1, 120)
  };
  const nbodyBodies = normalizeInteger(overrides.nbodyBodies, scaledInteger(profile.nbodyBodies, capacityScale, 2, 2048), 2, 2048);
  const nbodyMode = normalizeGravityMode(overrides.nbodyMode, 'auto');
  const nbodyTheta = normalizeNumber(overrides.nbodyTheta, 0.65, 0.05, 2.5);
  const nbodyTreeThreshold = normalizeInteger(overrides.nbodyTreeThreshold, 513, 2, 2048);
  const nbodyLeafSize = normalizeInteger(overrides.nbodyLeafSize, 1, 1, 64);
  const maxwellGrid = normalizeInteger(overrides.maxwellGrid, scaledInteger(profile.maxwellGrid, capacityScale, 4, 128), 4, 128);
  const cosmologySamples = normalizeInteger(overrides.cosmologySamples, scaledInteger(profile.cosmologySamples, capacityScale, 8, 32768, 8), 8, 32768);
  const molecularAtoms = normalizeInteger(overrides.molecularAtoms, scaledInteger(profile.molecularAtoms, capacityScale, 3, 32768, 3), 3, 32768);
  const quantumGrid = normalizeInteger(overrides.quantumGrid ?? overrides.orbitalGrid, scaledInteger(profile.quantumGrid, capacityScale, 8, 32), 8, 32);
  const quantumMaterialSamples = normalizeInteger(overrides.quantumMaterialSamples ?? overrides.materialPotentialSamples, scaledInteger(profile.quantumMaterialSamples, capacityScale, 16, 65536, 16), 16, 65536);
  const sphParticles = normalizeInteger(overrides.sphParticles, scaledInteger(profile.sphParticles, capacityScale, 16, 4096, 8), 16, 4096);
  const hydroGrid = normalizeInteger(overrides.hydroGrid, scaledInteger(profile.hydroGrid, capacityScale, 4, 128), 4, 128);
  const radiationGrid = normalizeInteger(overrides.radiationGrid, scaledInteger(profile.radiationGrid, capacityScale, 4, 128), 4, 128);
  const stellarGrid = normalizeInteger(overrides.stellarGrid, scaledInteger(profile.stellarGrid, capacityScale, 4, 128), 4, 128);
  const magnetosphereGrid = normalizeInteger(overrides.magnetosphereGrid, scaledInteger(profile.magnetosphereGrid, capacityScale, 4, 128), 4, 128);
  const picGrid = normalizeInteger(overrides.picGrid, scaledInteger(profile.picGrid, capacityScale, 4, 128), 4, 128);
  const picParticles = normalizeInteger(overrides.picParticles, scaledInteger(profile.picParticles, capacityScale, 8, 8192, 8), 8, 8192);
  const relativitySamples = normalizeInteger(overrides.relativitySamples, scaledInteger(profile.relativitySamples, capacityScale, 4, 16384, 4), 4, 16384);
  const combustionGrid = normalizeInteger(overrides.combustionGrid, scaledInteger(profile.combustionGrid, capacityScale, 4, 128), 4, 128);
  const membraneSegments = normalizeInteger(overrides.membraneSegments, scaledInteger(profile.membraneSegments, capacityScale, 8, 4096, 8), 8, 4096);

  return {
    schema: MULTISCALE_SOLVER_BUDGET_SCHEMA,
    resourceTier: tier,
    resourceProfile,
    capacityScale,
    cadencePolicy: 'scale-separated-defaults-v0',
    nbody: {
      bodyCount: nbodyBodies,
      cadenceFrames: cadence.nbody,
      gravityMode: nbodyMode,
      treeTheta: nbodyTheta,
      treeThreshold: nbodyTreeThreshold,
      treeLeafSize: nbodyLeafSize
    },
    maxwell: {
      width: maxwellGrid,
      height: maxwellGrid,
      cellCount: maxwellGrid * maxwellGrid,
      cadenceFrames: cadence.maxwell
    },
    cosmologyExpansion: {
      sampleCount: cosmologySamples,
      cadenceFrames: cadence.cosmologyExpansion
    },
    molecularDynamics: {
      atomCount: molecularAtoms,
      cadenceFrames: cadence.molecularDynamics
    },
    quantumOrbitalGrid: {
      gridSize: quantumGrid,
      sampleCount: quantumGrid ** 3,
      cadenceFrames: cadence.quantumOrbitalGrid
    },
    quantumMaterialPotential: {
      sampleCount: quantumMaterialSamples,
      cadenceFrames: cadence.quantumMaterialPotential
    },
    reactiveThermal: {
      cellCount: 1,
      cadenceFrames: cadence.reactiveThermal
    },
    sphMaterial: {
      particleCount: sphParticles,
      cadenceFrames: cadence.sphMaterial
    },
    hydroAtmosphere: {
      width: hydroGrid,
      height: Math.max(4, Math.round(hydroGrid / 2)),
      cellCount: hydroGrid * Math.max(4, Math.round(hydroGrid / 2)),
      cadenceFrames: cadence.hydroAtmosphere
    },
    radiationOpacity: {
      width: radiationGrid,
      height: Math.max(4, Math.round(radiationGrid / 2)),
      cellCount: radiationGrid * Math.max(4, Math.round(radiationGrid / 2)),
      cadenceFrames: cadence.radiationOpacity
    },
    stellarFusion: {
      width: stellarGrid,
      height: Math.max(4, Math.round(stellarGrid / 2)),
      cellCount: stellarGrid * Math.max(4, Math.round(stellarGrid / 2)),
      cadenceFrames: cadence.stellarFusion
    },
    magnetospherePlasma: {
      width: magnetosphereGrid,
      height: Math.max(4, Math.round(magnetosphereGrid / 2)),
      cellCount: magnetosphereGrid * Math.max(4, Math.round(magnetosphereGrid / 2)),
      cadenceFrames: cadence.magnetospherePlasma
    },
    picPlasmaPatch: {
      particleCount: picParticles,
      gridWidth: picGrid,
      gridHeight: Math.max(4, Math.round(picGrid / 2)),
      cellCount: picGrid * Math.max(4, Math.round(picGrid / 2)),
      cadenceFrames: cadence.picPlasmaPatch
    },
    relativisticCorrection: {
      sampleCount: relativitySamples,
      cadenceFrames: cadence.relativisticCorrection
    },
    combustionPlume: {
      width: combustionGrid,
      height: Math.max(4, Math.round(combustionGrid / 2)),
      cellCount: combustionGrid * Math.max(4, Math.round(combustionGrid / 2)),
      cadenceFrames: cadence.combustionPlume
    },
    membraneShell: {
      segmentCount: membraneSegments,
      cadenceFrames: cadence.membraneShell
    }
  };
}

export function createAdmittedMultiscaleSolverBudget(computeManager, {
  computeBudget = null,
  overrides = {},
  nowMs = Date.now()
} = {}) {
  const requestedBudget = createMultiscaleSolverBudget(computeManager, {
    computeBudget,
    overrides
  });
  const solverBudget = { ...requestedBudget };
  const entries = {};
  let clampedSolverCount = 0;
  let requestedTotalUnits = 0;
  let admittedTotalUnits = 0;
  let dominantLimiter = 'none';

  for (const [solverKey, profile] of Object.entries(SOLVER_ADMISSION_PROFILES)) {
    const result = clampBudgetEntryByAdmission(computeManager, solverKey, requestedBudget[solverKey], profile);
    solverBudget[solverKey] = result.entry;
    entries[solverKey] = result.report;
    requestedTotalUnits += result.report.requestedUnits;
    admittedTotalUnits += result.report.admittedUnits;
    if (result.report.clamped) {
      clampedSolverCount += 1;
      dominantLimiter = result.report.estimate?.limitingFactor || 'resource-capacity';
    }
  }

  const picResult = clampPicBudgetEntryByAdmission(computeManager, requestedBudget.picPlasmaPatch);
  solverBudget.picPlasmaPatch = picResult.entry;
  entries.picPlasmaPatch = picResult.report;
  requestedTotalUnits += picResult.report.requestedUnits;
  admittedTotalUnits += picResult.report.admittedUnits;
  if (picResult.report.clamped) {
    clampedSolverCount += 1;
    dominantLimiter = picResult.report.particle?.estimate?.limitingFactor
      || picResult.report.grid?.estimate?.limitingFactor
      || 'resource-capacity';
  }

  const admission = {
    schema: MULTISCALE_SOLVER_ADMISSION_SCHEMA,
    source: 'budget-admission-v0',
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    available: true,
    resourceTier: requestedBudget.resourceTier,
    capacityScale: rounded(requestedBudget.capacityScale),
    status: clampedSolverCount > 0 ? 'clamped' : 'admitted',
    recommendedAction: clampedSolverCount > 0 ? 'hold' : 'admit',
    pressure: clampedSolverCount > 0 ? 1 : 0,
    dominantLimiter,
    dominantSolver: Object.values(entries).find((entry) => entry.clamped)?.solverKey || null,
    clampedSolverCount,
    limitedSolverCount: clampedSolverCount,
    lockedLimitedSolverCount: 0,
    requestedTotalUnits: rounded(requestedTotalUnits, 2),
    admittedTotalUnits: rounded(admittedTotalUnits, 2),
    entries
  };

  return {
    solverBudget,
    admission,
    requestedBudget
  };
}
