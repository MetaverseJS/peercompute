import {
  SOLVER_LAYER_AFFINITY,
  SOLVER_LAYER_ORDER
} from './solverRuntimeGovernor.js';

export const MULTISCALE_LOWER_SCALE_REFINEMENT_SCHEMA = 'peercompute.multiscale.lower-scale-refinement.v0';
export const MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY = 'event-sampled-current-view-v0';

const SOLVER_KEYS = Object.freeze(Object.keys(SOLVER_LAYER_AFFINITY));

const REQUEST_SOLVER_MAP = Object.freeze({
  'reactive-md-label': Object.freeze([
    ['molecularDynamics', 0.96, 'reaction-progress-md-label'],
    ['reactiveThermal', 0.72, 'reaction-progress-thermal-feedback']
  ]),
  'molecular-md-refinement': Object.freeze([
    ['molecularDynamics', 1, 'molecular-charge-energy-event'],
    ['reactiveThermal', 0.68, 'molecular-thermal-coupling']
  ]),
  'surface-sph-refinement': Object.freeze([
    ['sphMaterial', 1, 'rupture-spill-material-event'],
    ['combustionPlume', 0.84, 'water-fire-contact-event'],
    ['membraneShell', 0.76, 'rupture-boundary-event'],
    ['reactiveThermal', 0.72, 'water-fire-thermal-event'],
    ['molecularDynamics', 0.58, 'surface-event-md-spot-check']
  ]),
  'membrane-fracture-refinement': Object.freeze([
    ['membraneShell', 1, 'membrane-fracture-event'],
    ['sphMaterial', 0.82, 'membrane-to-sph-event'],
    ['reactiveThermal', 0.62, 'membrane-heat-event']
  ]),
  'weather-patch-refinement': Object.freeze([
    ['hydroAtmosphere', 1, 'weather-patch-event'],
    ['radiationOpacity', 0.72, 'weather-radiation-event'],
    ['combustionPlume', 0.52, 'weather-fire-feedback-event']
  ]),
  'stellar-plasma-refinement': Object.freeze([
    ['stellarFusion', 1, 'stellar-plasma-event'],
    ['radiationOpacity', 0.76, 'stellar-radiation-event'],
    ['magnetospherePlasma', 0.62, 'stellar-mhd-event']
  ]),
  'mhd-pic-refinement': Object.freeze([
    ['magnetospherePlasma', 1, 'mhd-reconnection-event'],
    ['picPlasmaPatch', 0.94, 'mhd-pic-coupling-event'],
    ['maxwell', 0.66, 'mhd-em-field-event']
  ]),
  'pic-kinetic-refinement': Object.freeze([
    ['picPlasmaPatch', 1, 'pic-kinetic-event'],
    ['magnetospherePlasma', 0.82, 'pic-mhd-feedback-event'],
    ['relativisticCorrection', 0.58, 'charged-particle-relativity-event']
  ]),
  'relativistic-region-refinement': Object.freeze([
    ['relativisticCorrection', 1, 'relativistic-region-event'],
    ['nbody', 0.72, 'relativistic-orbit-event'],
    ['cosmologyExpansion', 0.5, 'relativistic-cosmology-sample']
  ]),
  'cosmology-expansion-refinement': Object.freeze([
    ['cosmologyExpansion', 1, 'cosmology-structure-event'],
    ['maxwell', 0.56, 'cosmology-galactic-field-sample'],
    ['relativisticCorrection', 0.5, 'cosmology-relativity-sample']
  ]),
  'combustion-chemistry-refinement': Object.freeze([
    ['combustionPlume', 0.94, 'combustion-chemistry-event'],
    ['reactiveThermal', 0.86, 'combustion-thermal-event'],
    ['molecularDynamics', 0.7, 'combustion-md-spot-check']
  ]),
  'thermal-material-refinement': Object.freeze([
    ['reactiveThermal', 0.92, 'thermal-material-event'],
    ['sphMaterial', 0.8, 'thermal-phase-event'],
    ['membraneShell', 0.64, 'thermal-shell-event'],
    ['radiationOpacity', 0.56, 'thermal-radiation-event']
  ])
});

const SAMPLE_SOLVERS_BY_LAYER = Object.freeze({
  supergalactic: Object.freeze(['cosmologyExpansion', 'relativisticCorrection', 'maxwell']),
  galactic: Object.freeze(['maxwell', 'nbody', 'relativisticCorrection', 'cosmologyExpansion']),
  solar: Object.freeze(['nbody', 'stellarFusion', 'magnetospherePlasma', 'picPlasmaPatch', 'relativisticCorrection', 'radiationOpacity']),
  planet: Object.freeze(['hydroAtmosphere', 'radiationOpacity', 'combustionPlume', 'sphMaterial']),
  surface: Object.freeze(['reactiveThermal', 'combustionPlume', 'sphMaterial', 'membraneShell', 'molecularDynamics']),
  mpm: Object.freeze(['sphMaterial', 'membraneShell', 'reactiveThermal', 'molecularDynamics']),
  molecular: Object.freeze(['molecularDynamics', 'quantumMaterialPotential', 'quantumOrbitalGrid', 'reactiveThermal', 'sphMaterial']),
  orbital: Object.freeze(['quantumOrbitalGrid', 'quantumMaterialPotential', 'molecularDynamics', 'reactiveThermal'])
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeFrame(value) {
  return Math.max(0, Math.floor(finite(value, 0)));
}

function normalizeLayerId(value, fallback = 'surface') {
  const id = String(value || '').trim();
  return SOLVER_LAYER_ORDER.includes(id) ? id : fallback;
}

function layerIndex(layerId) {
  const index = SOLVER_LAYER_ORDER.indexOf(layerId);
  return index >= 0 ? index : 0;
}

function layerDistance(solverKey, activeLayerId) {
  const solverLayer = SOLVER_LAYER_AFFINITY[solverKey] || activeLayerId;
  return Math.abs(layerIndex(solverLayer) - layerIndex(activeLayerId));
}

function cloneArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

function addUniqueRequest(requests, request) {
  if (!request || requests.includes(request)) return;
  requests.push(request);
}

function inferImplicitRequests({ state = {}, environment = {} } = {}) {
  const requests = [];
  const molecular = state.molecular || {};
  const md = molecular.molecularDynamics || {};
  const surface = state.surface || {};
  const balloon = state.balloon || {};
  const mpm = state.mpm || {};
  const sph = mpm.sphMaterial || {};
  const planet = state.planet || {};
  const solar = state.solar || {};
  const magnetosphere = solar.magnetosphere || {};
  const pic = solar.picPlasmaPatch || {};
  const relativity = solar.relativity || {};
  const cosmology = state.cosmology || {};
  const expansion = cosmology.expansion || {};
  const threshold = finite(environment.refinementThreshold, 0.42);

  if (finite(molecular.reactionProgress) > threshold) addUniqueRequest(requests, 'reactive-md-label');
  if (finite(md.ionizationFraction) > 0.2 || Math.abs(finite(md.chargeDrift)) > 0.08 || Math.abs(finite(md.energyDelta)) > 1.2) {
    addUniqueRequest(requests, 'molecular-md-refinement');
  }
  if (balloon.ruptured || finite(balloon.spillImpulse) > 0.05 || finite(sph.fireContactFraction) > 0.015 || finite(sph.coolingPotential) > 0.03) {
    addUniqueRequest(requests, 'surface-sph-refinement');
  }
  if (finite(balloon.membraneShell?.ruptureRisk) > 0.78) addUniqueRequest(requests, 'membrane-fracture-refinement');
  if (finite(surface.fireIntensity) > 0.64 && finite(environment.oxygenFraction, 0.21) > 0.08 && finite(surface.fuelFraction, 1) > 0.04) {
    addUniqueRequest(requests, 'combustion-chemistry-refinement');
  }
  if (finite(surface.radiativeHeatFlux) > 50 || finite(surface.flameTemperatureK, 294) > 1200 || finite(sph.phaseChangeRateProxy) > 0.08) {
    addUniqueRequest(requests, 'thermal-material-refinement');
  }
  if (finite(planet.stormEnergy) > 0.76) addUniqueRequest(requests, 'weather-patch-refinement');
  if (finite(solar.stellarFusion?.coreTemperatureK) > 24000000 || finite(solar.stellarFusion?.luminosityFactor) > 2.1) {
    addUniqueRequest(requests, 'stellar-plasma-refinement');
  }
  if (finite(magnetosphere.reconnectionRate) > 1.1 || finite(magnetosphere.divergenceBProxy) > 0.35) {
    addUniqueRequest(requests, 'mhd-pic-refinement');
  }
  if (finite(pic.divergenceEProxy) > 0.18 || Math.abs(finite(pic.chargeImbalance)) > 0.08 || finite(pic.particleEscapeFraction) > 0.2) {
    addUniqueRequest(requests, 'pic-kinetic-refinement');
  }
  if (finite(relativity.maxSpeedFractionC) > 0.18 || finite(relativity.gravitationalRedshiftProxy) > 0.006 || finite(relativity.causalityClampCount) > 0) {
    addUniqueRequest(requests, 'relativistic-region-refinement');
  }
  if (finite(expansion.hubbleTensionProxy) > 0.2 || finite(expansion.structureGrowthProxy) > 0.8 || finite(expansion.voidFraction) > 0.42) {
    addUniqueRequest(requests, 'cosmology-expansion-refinement');
  }
  return requests;
}

function runtimePressure({ runtimeScaler = {}, solverGovernor = {}, frameMsAvg = null, targetFrameMs = 16.667 } = {}) {
  const framePressure = Number.isFinite(frameMsAvg)
    ? Math.max(0, finite(frameMsAvg) / Math.max(1, targetFrameMs) - 1)
    : 0;
  return clamp(
    Math.max(
      framePressure,
      finite(runtimeScaler.pressure),
      finite(solverGovernor.pressure)
    ),
    0,
    4
  );
}

function sampleBudgetForPressure(pressure, frameMsAvg, targetFrameMs) {
  if (pressure >= 1.65 || finite(frameMsAvg, targetFrameMs) > targetFrameMs * 1.45) return 0;
  if (pressure >= 0.9 || finite(frameMsAvg, targetFrameMs) > targetFrameMs * 1.18) return 1;
  return 2;
}

function eventBudgetForPressure(pressure) {
  if (pressure >= 3) return 1;
  if (pressure >= 2) return 2;
  return 4;
}

function summarizeTriggerList(triggers) {
  return triggers.map((trigger) => ({
    solverKey: trigger.solverKey,
    request: trigger.request,
    reason: trigger.reason,
    priority: Number(trigger.priority.toFixed(3)),
    triggerType: trigger.triggerType,
    solverLayerId: SOLVER_LAYER_AFFINITY[trigger.solverKey] || null,
    layerDistance: trigger.layerDistance
  }));
}

function makeEmptyReport({
  sequence = 0,
  frame = 0,
  activeLayerId = 'surface',
  targetFrameMs = 16.667,
  sampleIntervalFrames = 120
} = {}) {
  return {
    schema: MULTISCALE_LOWER_SCALE_REFINEMENT_SCHEMA,
    policy: MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY,
    sequence,
    frame,
    activeLayerId,
    targetFrameMs,
    sampleIntervalFrames,
    frameMsAvg: null,
    pressure: 0,
    eventBudget: 0,
    sampleBudget: 0,
    eventTriggerCount: 0,
    sampleTriggerCount: 0,
    requestCount: 0,
    requests: [],
    implicitRequests: [],
    eventTriggers: [],
    sampleTriggers: [],
    triggeredSolvers: [],
    solverDecisions: {},
    skipped: [],
    nextSampleCursor: 0,
    status: 'idle'
  };
}

export class LowerScaleRefinementScheduler {
  constructor({
    targetFrameMs = 16.667,
    sampleIntervalFrames = 120,
    eventCooldownFrames = 10,
    sampleCooldownFrames = 90,
    activeLayerId = 'surface'
  } = {}) {
    this.targetFrameMs = finite(targetFrameMs, 16.667);
    this.sampleIntervalFrames = Math.max(1, Math.floor(finite(sampleIntervalFrames, 120)));
    this.eventCooldownFrames = Math.max(1, Math.floor(finite(eventCooldownFrames, 10)));
    this.sampleCooldownFrames = Math.max(1, Math.floor(finite(sampleCooldownFrames, 90)));
    this.sequence = 0;
    this.sampleCursor = 0;
    this.lastRunFrameBySolver = Object.fromEntries(SOLVER_KEYS.map((key) => [key, -Infinity]));
    this.lastReport = makeEmptyReport({
      activeLayerId: normalizeLayerId(activeLayerId),
      targetFrameMs: this.targetFrameMs,
      sampleIntervalFrames: this.sampleIntervalFrames
    });
  }

  evaluate({
    frame = 0,
    activeLayerId = this.lastReport.activeLayerId,
    refinementRequests = [],
    state = {},
    environment = {},
    runtimeScaler = {},
    solverGovernor = {},
    solverRuntime = {},
    frameMsAvg = null
  } = {}) {
    const normalizedFrame = normalizeFrame(frame);
    const normalizedLayer = normalizeLayerId(activeLayerId, this.lastReport.activeLayerId || 'surface');
    const implicitRequests = inferImplicitRequests({ state, environment });
    const requests = [];
    for (const request of [...cloneArray(refinementRequests), ...implicitRequests]) {
      addUniqueRequest(requests, request);
    }
    const pressure = runtimePressure({
      runtimeScaler,
      solverGovernor,
      frameMsAvg: Number.isFinite(frameMsAvg) ? frameMsAvg : finite(runtimeScaler.frameMsAvg, null),
      targetFrameMs: this.targetFrameMs
    });
    const frameMs = Number.isFinite(frameMsAvg)
      ? frameMsAvg
      : Number.isFinite(runtimeScaler.frameMsAvg)
        ? runtimeScaler.frameMsAvg
        : null;
    const eventBudget = eventBudgetForPressure(pressure);
    const sampleBudget = sampleBudgetForPressure(pressure, frameMs, this.targetFrameMs);
    const triggerBySolver = new Map();
    const skipped = [];

    const considerTrigger = (trigger) => {
      if (!trigger?.solverKey || !SOLVER_KEYS.includes(trigger.solverKey)) return;
      if (solverRuntime[trigger.solverKey]?.pending) {
        skipped.push({
          solverKey: trigger.solverKey,
          reason: 'pending',
          triggerType: trigger.triggerType,
          request: trigger.request
        });
        return;
      }
      const lastFrame = this.lastRunFrameBySolver[trigger.solverKey] ?? -Infinity;
      const cooldown = trigger.triggerType === 'event' ? this.eventCooldownFrames : this.sampleCooldownFrames;
      if (normalizedFrame - lastFrame < cooldown) {
        skipped.push({
          solverKey: trigger.solverKey,
          reason: 'cooldown',
          triggerType: trigger.triggerType,
          request: trigger.request,
          cooldownFrames: cooldown,
          lastRunFrame: Number.isFinite(lastFrame) ? lastFrame : null
        });
        return;
      }
      const current = triggerBySolver.get(trigger.solverKey);
      if (!current || trigger.priority > current.priority) {
        triggerBySolver.set(trigger.solverKey, trigger);
      }
    };

    for (const request of requests) {
      const solvers = REQUEST_SOLVER_MAP[request] || [];
      for (const [solverKey, priority, reason] of solvers) {
        considerTrigger({
          solverKey,
          request,
          reason,
          priority,
          triggerType: 'event',
          layerDistance: layerDistance(solverKey, normalizedLayer)
        });
      }
    }

    const eventTriggers = [...triggerBySolver.values()]
      .filter((trigger) => trigger.triggerType === 'event')
      .sort((a, b) => b.priority - a.priority || b.layerDistance - a.layerDistance)
      .slice(0, eventBudget);

    triggerBySolver.clear();
    for (const trigger of eventTriggers) {
      triggerBySolver.set(trigger.solverKey, trigger);
    }

    const sampleTriggers = [];
    if (sampleBudget > 0 && normalizedFrame % this.sampleIntervalFrames === 0) {
      const samplePool = SAMPLE_SOLVERS_BY_LAYER[normalizedLayer] || SOLVER_KEYS;
      let attempts = 0;
      while (sampleTriggers.length < sampleBudget && attempts < samplePool.length) {
        const solverKey = samplePool[this.sampleCursor % samplePool.length];
        this.sampleCursor = (this.sampleCursor + 1) % Math.max(1, samplePool.length);
        attempts += 1;
        if (triggerBySolver.has(solverKey)) continue;
        const trigger = {
          solverKey,
          request: 'background-spot-check',
          reason: `${normalizedLayer}-spot-check`,
          priority: 0.36 - sampleTriggers.length * 0.03,
          triggerType: 'sample',
          layerDistance: layerDistance(solverKey, normalizedLayer)
        };
        const beforeCount = skipped.length;
        considerTrigger(trigger);
        if (triggerBySolver.get(solverKey) === trigger && skipped.length === beforeCount) {
          sampleTriggers.push(trigger);
        }
      }
    }

    const selected = [...eventTriggers, ...sampleTriggers]
      .filter((trigger, index, all) => all.findIndex((entry) => entry.solverKey === trigger.solverKey) === index);
    const solverDecisions = {};
    for (const trigger of selected) {
      this.lastRunFrameBySolver[trigger.solverKey] = normalizedFrame;
      solverDecisions[trigger.solverKey] = {
        shouldRun: true,
        triggerType: trigger.triggerType,
        request: trigger.request,
        reason: trigger.reason,
        priority: Number(trigger.priority.toFixed(3)),
        solverLayerId: SOLVER_LAYER_AFFINITY[trigger.solverKey] || null,
        activeLayerId: normalizedLayer,
        layerDistance: trigger.layerDistance,
        lowerOrAdjacentScale: trigger.layerDistance > 0
      };
    }

    this.sequence += 1;
    this.lastReport = {
      schema: MULTISCALE_LOWER_SCALE_REFINEMENT_SCHEMA,
      policy: MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY,
      sequence: this.sequence,
      frame: normalizedFrame,
      activeLayerId: normalizedLayer,
      targetFrameMs: Number(this.targetFrameMs.toFixed(3)),
      sampleIntervalFrames: this.sampleIntervalFrames,
      frameMsAvg: frameMs === null ? null : Number(frameMs.toFixed(3)),
      pressure: Number(pressure.toFixed(3)),
      eventBudget,
      sampleBudget,
      eventTriggerCount: eventTriggers.length,
      sampleTriggerCount: sampleTriggers.length,
      requestCount: requests.length,
      requests,
      implicitRequests,
      eventTriggers: summarizeTriggerList(eventTriggers),
      sampleTriggers: summarizeTriggerList(sampleTriggers),
      triggeredSolvers: selected.map((trigger) => trigger.solverKey),
      solverDecisions,
      skipped,
      nextSampleCursor: this.sampleCursor,
      status: selected.length > 0 ? 'scheduled' : requests.length > 0 ? 'events-cooling' : sampleBudget > 0 ? 'sampling-idle' : 'pressure-limited'
    };
    return this.lastReport;
  }

  getStatus() {
    return this.lastReport;
  }
}

export function createLowerScaleRefinementScheduler(options = {}) {
  return new LowerScaleRefinementScheduler(options);
}

export function shouldRunLowerScaleRefinementSolver(report, solverKey) {
  return report?.solverDecisions?.[solverKey]?.shouldRun === true;
}
