export const MULTISCALE_SOLVER_GOVERNOR_SCHEMA = 'peercompute.multiscale.solver-governor.v0';
export const MULTISCALE_SOLVER_CADENCE_POLICY = 'scale-aware-multirate-v0';
export const MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY = 'active-layer-priority-v0';

const SOLVER_KEYS = Object.freeze([
  'nbody',
  'maxwell',
  'cosmologyExpansion',
  'molecularDynamics',
  'quantumOrbitalGrid',
  'quantumMaterialPotential',
  'reactiveThermal',
  'sphMaterial',
  'hydroAtmosphere',
  'radiationOpacity',
  'stellarFusion',
  'magnetospherePlasma',
  'picPlasmaPatch',
  'relativisticCorrection',
  'combustionPlume',
  'membraneShell'
]);

export const SOLVER_CADENCE_SCALE_WEIGHTS = Object.freeze({
  nbody: 2,
  maxwell: 2,
  cosmologyExpansion: 3,
  molecularDynamics: 1,
  quantumOrbitalGrid: 1,
  quantumMaterialPotential: 1,
  reactiveThermal: 1,
  sphMaterial: 1,
  hydroAtmosphere: 2,
  radiationOpacity: 2,
  stellarFusion: 2,
  magnetospherePlasma: 2,
  picPlasmaPatch: 2,
  relativisticCorrection: 3,
  combustionPlume: 1,
  membraneShell: 1
});

export const SOLVER_LAYER_ORDER = Object.freeze([
  'supergalactic',
  'galactic',
  'solar',
  'planet',
  'surface',
  'mpm',
  'molecular',
  'orbital'
]);

export const SOLVER_LAYER_AFFINITY = Object.freeze({
  nbody: 'solar',
  maxwell: 'galactic',
  cosmologyExpansion: 'supergalactic',
  molecularDynamics: 'molecular',
  quantumOrbitalGrid: 'orbital',
  quantumMaterialPotential: 'orbital',
  reactiveThermal: 'surface',
  sphMaterial: 'surface',
  hydroAtmosphere: 'planet',
  radiationOpacity: 'planet',
  stellarFusion: 'solar',
  magnetospherePlasma: 'solar',
  picPlasmaPatch: 'solar',
  relativisticCorrection: 'solar',
  combustionPlume: 'surface',
  membraneShell: 'surface'
});

export const SOLVER_LAYER_DISTANCE_MULTIPLIERS = Object.freeze({
  0: 1,
  1: 2,
  2: 5,
  3: 8,
  4: 10,
  5: 10,
  6: 12,
  7: 12
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeLayerId(value) {
  const text = String(value || '').trim();
  return SOLVER_LAYER_ORDER.includes(text) ? text : null;
}

function layerIndex(layerId) {
  const index = SOLVER_LAYER_ORDER.indexOf(layerId);
  return index >= 0 ? index : null;
}

function layerDistance(solverLayerId, activeLayerId) {
  const solverIndex = layerIndex(solverLayerId);
  const activeIndex = layerIndex(activeLayerId);
  if (solverIndex === null || activeIndex === null) return 0;
  return Math.abs(solverIndex - activeIndex);
}

function cadenceMultiplierForDistance(distance) {
  const normalizedDistance = normalizeInteger(distance, 0, 0, SOLVER_LAYER_ORDER.length - 1);
  return SOLVER_LAYER_DISTANCE_MULTIPLIERS[normalizedDistance] || 1;
}

function cadenceFromBudget(budget = {}) {
  return {
    nbody: normalizeInteger(budget.nbody?.cadenceFrames, 1, 1, 120),
    maxwell: normalizeInteger(budget.maxwell?.cadenceFrames, 1, 1, 120),
    cosmologyExpansion: normalizeInteger(budget.cosmologyExpansion?.cadenceFrames, 1, 1, 120),
    molecularDynamics: normalizeInteger(budget.molecularDynamics?.cadenceFrames, 1, 1, 120),
    quantumOrbitalGrid: normalizeInteger(budget.quantumOrbitalGrid?.cadenceFrames, 2, 1, 120),
    quantumMaterialPotential: normalizeInteger(budget.quantumMaterialPotential?.cadenceFrames, 2, 1, 120),
    reactiveThermal: normalizeInteger(budget.reactiveThermal?.cadenceFrames, 1, 1, 120),
    sphMaterial: normalizeInteger(budget.sphMaterial?.cadenceFrames, 1, 1, 120),
    hydroAtmosphere: normalizeInteger(budget.hydroAtmosphere?.cadenceFrames, 1, 1, 120),
    radiationOpacity: normalizeInteger(budget.radiationOpacity?.cadenceFrames, 1, 1, 120),
    stellarFusion: normalizeInteger(budget.stellarFusion?.cadenceFrames, 1, 1, 120),
    magnetospherePlasma: normalizeInteger(budget.magnetospherePlasma?.cadenceFrames, 1, 1, 120),
    picPlasmaPatch: normalizeInteger(budget.picPlasmaPatch?.cadenceFrames, 1, 1, 120),
    relativisticCorrection: normalizeInteger(budget.relativisticCorrection?.cadenceFrames, 1, 1, 120),
    combustionPlume: normalizeInteger(budget.combustionPlume?.cadenceFrames, 1, 1, 120),
    membraneShell: normalizeInteger(budget.membraneShell?.cadenceFrames, 1, 1, 120)
  };
}

function countPendingSolvers(runtime = {}) {
  return SOLVER_KEYS.reduce((count, key) => count + (runtime[key]?.pending ? 1 : 0), 0);
}

function queuePressure(computeStatus = {}) {
  const peer = computeStatus.peercompute || {};
  const capabilities = peer.managerCapabilities || computeStatus.capabilities || {};
  return Number(capabilities.queuedTaskCount || 0) + Number(capabilities.activeTaskCount || 0);
}

export class AdaptiveSolverGovernor {
  constructor({
    budget,
    targetFrameMs = 33,
    relaxFrameMs = 20,
    sampleAlpha = 0.12,
    maxCadenceFrames = 16,
    maxEffectiveCadenceFrames = 96,
    activeLayerId = null,
    adjustCooldownFrames = 45
  } = {}) {
    this.baseCadence = cadenceFromBudget(budget);
    this.cadence = { ...this.baseCadence };
    this.targetFrameMs = targetFrameMs;
    this.relaxFrameMs = relaxFrameMs;
    this.sampleAlpha = clamp(sampleAlpha, 0.01, 1);
    this.maxCadenceFrames = normalizeInteger(maxCadenceFrames, 16, 1, 240);
    this.maxEffectiveCadenceFrames = normalizeInteger(maxEffectiveCadenceFrames, Math.max(this.maxCadenceFrames, 96), this.maxCadenceFrames, 960);
    this.adjustCooldownFrames = normalizeInteger(adjustCooldownFrames, 45, 1, 600);
    this.activeLayerId = normalizeLayerId(activeLayerId);
    this.activeLayerChangeFrame = -1;
    this.frameMsAvg = targetFrameMs;
    this.frameCount = 0;
    this.cooldown = 0;
    this.pressure = 0;
    this.lastAction = 'baseline';
  }

  setBudget(budget = {}) {
    this.baseCadence = cadenceFromBudget(budget);
    for (const key of Object.keys(this.baseCadence)) {
      const base = this.baseCadence[key] || 1;
      this.cadence[key] = clamp(
        normalizeInteger(this.cadence[key], base, 1, this.maxCadenceFrames),
        base,
        this.maxCadenceFrames
      );
    }
    this.lastAction = 'budget-update';
    return this.getStatus();
  }

  setActiveLayer(activeLayerId, frame = this.frameCount) {
    const normalizedLayerId = normalizeLayerId(activeLayerId);
    if (normalizedLayerId && normalizedLayerId !== this.activeLayerId) {
      this.activeLayerId = normalizedLayerId;
      this.activeLayerChangeFrame = normalizeInteger(frame, this.frameCount, 0, Number.MAX_SAFE_INTEGER);
    }
    return this.getStatus();
  }

  update({ frameMs = null, dtSeconds = null, solverRuntime = {}, computeStatus = {} } = {}) {
    const observedFrameMs = Number.isFinite(frameMs)
      ? frameMs
      : Number.isFinite(dtSeconds)
        ? dtSeconds * 1000
        : this.frameMsAvg;
    this.frameMsAvg = this.frameMsAvg * (1 - this.sampleAlpha) + observedFrameMs * this.sampleAlpha;
    this.frameCount += 1;
    this.cooldown = Math.max(0, this.cooldown - 1);

    const pendingSolvers = countPendingSolvers(solverRuntime);
    const queued = queuePressure(computeStatus);
    this.pressure = clamp(
      Math.max(0, (this.frameMsAvg - this.relaxFrameMs) / Math.max(1, this.targetFrameMs - this.relaxFrameMs))
        + pendingSolvers * 0.18
        + queued * 0.08,
      0,
      4
    );

    if (this.cooldown === 0 && (this.frameMsAvg > this.targetFrameMs || pendingSolvers >= 3 || queued > 4)) {
      this.scaleCadence(1);
      this.lastAction = 'increase-cadence';
      this.cooldown = this.adjustCooldownFrames;
    } else if (this.cooldown === 0 && this.frameMsAvg < this.relaxFrameMs && pendingSolvers === 0 && queued === 0) {
      const changed = this.scaleCadence(-1);
      this.lastAction = changed ? 'decrease-cadence' : 'baseline';
      this.cooldown = this.adjustCooldownFrames;
    }

    return this.getStatus();
  }

  scaleCadence(direction) {
    let changed = false;
    for (const key of Object.keys(this.cadence)) {
      const base = this.baseCadence[key] || 1;
      const current = normalizeInteger(this.cadence[key], base, base, this.maxCadenceFrames);
      const weight = normalizeInteger(SOLVER_CADENCE_SCALE_WEIGHTS[key], 1, 1, 8);
      const step = direction > 0 ? weight : Math.max(1, Math.ceil(weight / 2));
      const next = direction > 0
        ? Math.min(this.maxCadenceFrames, current + step)
        : Math.max(base, current - step);
      if (next !== current) {
        this.cadence[key] = next;
        changed = true;
      }
    }
    return changed;
  }

  getEffectiveCadence(key, { activeLayerId = this.activeLayerId } = {}) {
    const cadence = normalizeInteger(this.cadence[key], 1, 1, this.maxCadenceFrames);
    const normalizedLayerId = normalizeLayerId(activeLayerId);
    const solverLayerId = SOLVER_LAYER_AFFINITY[key] || null;
    const distance = normalizedLayerId && solverLayerId
      ? layerDistance(solverLayerId, normalizedLayerId)
      : 0;
    const layerMultiplier = cadenceMultiplierForDistance(distance);
    return {
      key,
      solverLayerId,
      activeLayerId: normalizedLayerId,
      distance,
      layerMultiplier,
      cadenceFrames: Math.min(this.maxEffectiveCadenceFrames, cadence * layerMultiplier),
      dynamicCadenceFrames: cadence
    };
  }

  shouldRun(key, frame, options = {}) {
    const effective = this.getEffectiveCadence(key, options);
    if (effective.distance === 0 && this.activeLayerChangeFrame === frame) {
      return true;
    }
    const cadence = normalizeInteger(effective.cadenceFrames, 1, 1, this.maxEffectiveCadenceFrames);
    return frame % cadence === 0;
  }

  getStatus({ activeLayerId = this.activeLayerId } = {}) {
    const effectiveEntries = {};
    const layerDistances = {};
    const layerMultipliers = {};
    const normalizedLayerId = normalizeLayerId(activeLayerId);
    for (const key of Object.keys(this.cadence)) {
      const effective = this.getEffectiveCadence(key, { activeLayerId: normalizedLayerId });
      effectiveEntries[key] = effective.cadenceFrames;
      layerDistances[key] = effective.distance;
      layerMultipliers[key] = effective.layerMultiplier;
    }
    return {
      schema: MULTISCALE_SOLVER_GOVERNOR_SCHEMA,
      frameCount: this.frameCount,
      targetFrameMs: this.targetFrameMs,
      relaxFrameMs: this.relaxFrameMs,
      frameMsAvg: Number(this.frameMsAvg.toFixed(3)),
      pressure: Number(this.pressure.toFixed(3)),
      cadencePolicy: MULTISCALE_SOLVER_CADENCE_POLICY,
      activeLayerPolicy: MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY,
      activeLayerId: normalizedLayerId,
      activeLayerChangeFrame: this.activeLayerChangeFrame,
      layerOrder: [...SOLVER_LAYER_ORDER],
      solverLayerAffinity: { ...SOLVER_LAYER_AFFINITY },
      layerDistanceMultipliers: { ...SOLVER_LAYER_DISTANCE_MULTIPLIERS },
      cadenceScaleWeights: { ...SOLVER_CADENCE_SCALE_WEIGHTS },
      cadenceFrames: { ...this.cadence },
      effectiveCadenceFrames: effectiveEntries,
      layerDistances,
      layerMultipliers,
      baseCadenceFrames: { ...this.baseCadence },
      cooldownFrames: this.cooldown,
      lastAction: this.lastAction
    };
  }
}
