export const RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCHEMA =
  'peercompute.multiscale.relativistic-correction.runtime-validation.v0';

export const RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCOPE =
  'bounded-analytic-post-newtonian-proxy-validation';

export const RADIATION_TRANSPORT_RUNTIME_VALIDATION_SCHEMA =
  'peercompute.multiscale.radiation-transport.runtime-validation.v0';

export const RADIATION_TRANSPORT_RUNTIME_VALIDATION_SCOPE =
  'bounded-grey-radiation-opacity-proxy-validation';

const RUNTIME_EVIDENCE_ENTRY_ID = 'validated-relativistic-correction-runtime';
const RUNTIME_EVIDENCE_FAMILY = 'relativistic-correction';
const RUNTIME_EVIDENCE_SOLVER_ID = 'relativistic-correction';
const RADIATION_RUNTIME_EVIDENCE_ENTRY_ID = 'validated-radiation-transport-runtime';
const RADIATION_RUNTIME_EVIDENCE_FAMILY = 'radiation-transport';
const RADIATION_RUNTIME_EVIDENCE_SOLVER_ID = 'radiation-opacity';

export function createRelativisticCorrectionRuntimeValidation(result = {}, options = {}) {
  const diagnostics = clonePlain(result.diagnostics || {});
  const conservation = clonePlain(result.conservation || {});
  const observed = summarizeRelativisticCorrectionRuntime(result);
  const checks = {
    resultOk: result.ok === true,
    backendObserved: typeof result.backend === 'string' && result.backend !== 'none',
    sequenceAdvanced: Number.isFinite(Number(result.sequence)) && Number(result.sequence) > 0,
    diagnosticsSchema: diagnostics.schema === 'peercompute.multiscale.relativistic-correction.diagnostics.v0',
    sampleCountPositive: Number.isFinite(Number(diagnostics.sampleCount)) && Number(diagnostics.sampleCount) > 0,
    maxSpeedBelowC: Number.isFinite(Number(diagnostics.maxSpeedFractionC))
      && Number(diagnostics.maxSpeedFractionC) >= 0
      && Number(diagnostics.maxSpeedFractionC) < 1,
    lorentzFactorFinite: Number.isFinite(Number(diagnostics.meanLorentzFactor))
      && Number(diagnostics.meanLorentzFactor) >= 1,
    timeDilationFinite: Number.isFinite(Number(diagnostics.meanTimeDilation))
      && Number(diagnostics.meanTimeDilation) >= 0,
    redshiftFinite: Number.isFinite(Number(diagnostics.gravitationalRedshiftProxy))
      && Number(diagnostics.gravitationalRedshiftProxy) >= 0,
    precessionFinite: Number.isFinite(Number(diagnostics.perihelionPrecessionArcsecProxy)),
    causalityClampCountFinite: Number.isFinite(Number(diagnostics.causalityClampCount))
      && Number(diagnostics.causalityClampCount) >= 0,
    proxyConservationMode: conservation.energyMode === 'reduced-post-newtonian-proxy'
  };
  const blockers = validationBlockers('relativistic-correction', checks);
  const passed = blockers.length === 0;
  return {
    schema: RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCHEMA,
    status: passed ? 'proxy-validation-pass' : 'proxy-validation-fail',
    pass: passed,
    ready: false,
    scientificExecution: false,
    proxyOnly: true,
    scope: options.scope || RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCOPE,
    solverId: RUNTIME_EVIDENCE_SOLVER_ID,
    backend: typeof result.backend === 'string' ? result.backend : null,
    sequence: finiteOrNull(result.sequence),
    observed,
    checks,
    blockerCount: blockers.length,
    blockers,
    note: 'This validates bounded scalar invariants for the reduced relativistic proxy runtime only; it is not calibrated GR, GRMHD, or magnetar scientific execution.'
  };
}

export async function createRelativisticCorrectionRuntimeEvidenceEntry(result = {}, options = {}) {
  const validation = createRelativisticCorrectionRuntimeValidation(result, options);
  const evidenceHash = validation.pass
    ? await sha256CanonicalJson({
      schema: RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCHEMA,
      scope: validation.scope,
      solverId: validation.solverId,
      backend: validation.backend,
      sequence: validation.sequence,
      observed: validation.observed,
      checks: validation.checks
    })
    : null;
  return {
    id: RUNTIME_EVIDENCE_ENTRY_ID,
    family: RUNTIME_EVIDENCE_FAMILY,
    solverId: RUNTIME_EVIDENCE_SOLVER_ID,
    status: validation.pass ? 'proxy-runtime-validated' : 'proxy-runtime-validation-failed',
    ready: false,
    scientificExecution: false,
    runtimeObserved: validation.pass,
    proxyOnly: true,
    backend: validation.backend,
    sequence: validation.sequence,
    validationStatus: validation.pass ? 'pass' : 'fail',
    evidenceHash,
    observed: validation.observed,
    validation,
    scope: validation.scope,
    blocker: 'relativistic-correction-runtime-proxy-only',
    blockers: validation.pass
      ? [
        'relativistic-correction-runtime-proxy-only',
        'validated-relativistic-correction-runtime-missing'
      ]
      : [
        ...validation.blockers,
        'validated-relativistic-correction-runtime-missing'
      ]
  };
}

export function createRadiationTransportRuntimeValidation(result = {}, options = {}) {
  const diagnostics = clonePlain(result.diagnostics || {});
  const conservation = clonePlain(result.conservation || {});
  const observed = summarizeRadiationTransportRuntime(result);
  const checks = {
    resultOk: result.ok === true,
    backendObserved: typeof result.backend === 'string' && result.backend !== 'none',
    sequenceAdvanced: Number.isFinite(Number(result.sequence)) && Number(result.sequence) > 0,
    diagnosticsSchema: diagnostics.schema === 'peercompute.multiscale.radiation-opacity.diagnostics.v0',
    cellCountPositive: Number.isFinite(Number(diagnostics.cellCount)) && Number(diagnostics.cellCount) > 0,
    dimensionsPositive: Number.isFinite(Number(diagnostics.width)) && Number(diagnostics.width) > 0
      && Number.isFinite(Number(diagnostics.height)) && Number(diagnostics.height) > 0,
    radiationEnergyNonnegative: Number.isFinite(Number(diagnostics.totalRadiationEnergy))
      && Number(diagnostics.totalRadiationEnergy) >= 0,
    temperatureBounded: Number.isFinite(Number(diagnostics.meanTemperatureK))
      && Number(diagnostics.meanTemperatureK) >= 120
      && Number(diagnostics.meanTemperatureK) <= 2400,
    opacityBounded: Number.isFinite(Number(diagnostics.meanOpacity))
      && Number(diagnostics.meanOpacity) > 0
      && Number(diagnostics.meanOpacity) <= 3,
    opticalDepthFinite: Number.isFinite(Number(diagnostics.opticalDepth))
      && Number(diagnostics.opticalDepth) >= 0,
    greenhouseFactorBounded: Number.isFinite(Number(diagnostics.greenhouseFactor))
      && Number(diagnostics.greenhouseFactor) >= 0
      && Number(diagnostics.greenhouseFactor) <= 1,
    radiationEnergyDeltaFinite: Number.isFinite(Number(conservation.radiationEnergyDelta)),
    absorbedMinusEmittedFinite: Number.isFinite(Number(conservation.absorbedMinusEmitted)),
    proxyConservationMode: conservation.energyMode === 'reduced-grey-radiation-opacity'
  };
  const blockers = validationBlockers('radiation-transport', checks);
  const passed = blockers.length === 0;
  return {
    schema: RADIATION_TRANSPORT_RUNTIME_VALIDATION_SCHEMA,
    status: passed ? 'proxy-validation-pass' : 'proxy-validation-fail',
    pass: passed,
    ready: false,
    scientificExecution: false,
    proxyOnly: true,
    scope: options.scope || RADIATION_TRANSPORT_RUNTIME_VALIDATION_SCOPE,
    solverId: RADIATION_RUNTIME_EVIDENCE_SOLVER_ID,
    backend: typeof result.backend === 'string' ? result.backend : null,
    sequence: finiteOrNull(result.sequence),
    observed,
    checks,
    blockerCount: blockers.length,
    blockers,
    note: 'This validates bounded scalar invariants for the reduced grey-radiation proxy runtime only; it is not calibrated radiation transport or magnetar scientific execution.'
  };
}

export async function createRadiationTransportRuntimeEvidenceEntry(result = {}, options = {}) {
  const validation = createRadiationTransportRuntimeValidation(result, options);
  const evidenceHash = validation.pass
    ? await sha256CanonicalJson({
      schema: RADIATION_TRANSPORT_RUNTIME_VALIDATION_SCHEMA,
      scope: validation.scope,
      solverId: validation.solverId,
      backend: validation.backend,
      sequence: validation.sequence,
      observed: validation.observed,
      checks: validation.checks
    })
    : null;
  return {
    id: RADIATION_RUNTIME_EVIDENCE_ENTRY_ID,
    family: RADIATION_RUNTIME_EVIDENCE_FAMILY,
    solverId: RADIATION_RUNTIME_EVIDENCE_SOLVER_ID,
    status: validation.pass ? 'proxy-runtime-validated' : 'proxy-runtime-validation-failed',
    ready: false,
    scientificExecution: false,
    runtimeObserved: validation.pass,
    proxyOnly: true,
    backend: validation.backend,
    sequence: validation.sequence,
    validationStatus: validation.pass ? 'pass' : 'fail',
    evidenceHash,
    observed: validation.observed,
    validation,
    scope: validation.scope,
    blocker: 'radiation-transport-runtime-proxy-only',
    blockers: validation.pass
      ? [
        'radiation-transport-runtime-proxy-only',
        'validated-radiation-transport-runtime-missing'
      ]
      : [
        ...validation.blockers,
        'validated-radiation-transport-runtime-missing'
      ]
  };
}

function summarizeRelativisticCorrectionRuntime(result = {}) {
  const diagnostics = result.diagnostics || {};
  const conservation = result.conservation || {};
  return {
    sampleCount: finiteOrNull(diagnostics.sampleCount),
    meanSpeedFractionC: finiteOrNull(diagnostics.meanSpeedFractionC),
    maxSpeedFractionC: finiteOrNull(diagnostics.maxSpeedFractionC),
    meanLorentzFactor: finiteOrNull(diagnostics.meanLorentzFactor),
    maxLorentzFactor: finiteOrNull(diagnostics.maxLorentzFactor),
    meanTimeDilation: finiteOrNull(diagnostics.meanTimeDilation),
    gravitationalRedshiftProxy: finiteOrNull(diagnostics.gravitationalRedshiftProxy),
    perihelionPrecessionArcsecProxy: finiteOrNull(diagnostics.perihelionPrecessionArcsecProxy),
    frameDraggingProxy: finiteOrNull(diagnostics.frameDraggingProxy),
    lensingDeflectionArcsecProxy: finiteOrNull(diagnostics.lensingDeflectionArcsecProxy),
    relativisticEnergyProxy: finiteOrNull(diagnostics.relativisticEnergyProxy),
    relativisticEnergyDelta: finiteOrNull(conservation.relativisticEnergyDelta),
    timeDilationDrift: finiteOrNull(conservation.timeDilationDrift),
    causalityClampCount: finiteOrNull(diagnostics.causalityClampCount)
  };
}

function summarizeRadiationTransportRuntime(result = {}) {
  const diagnostics = result.diagnostics || {};
  const conservation = result.conservation || {};
  return {
    width: finiteOrNull(diagnostics.width),
    height: finiteOrNull(diagnostics.height),
    cellCount: finiteOrNull(diagnostics.cellCount),
    totalRadiationEnergy: finiteOrNull(diagnostics.totalRadiationEnergy),
    meanRadiationEnergy: finiteOrNull(diagnostics.meanRadiationEnergy),
    totalAbsorbedPower: finiteOrNull(diagnostics.totalAbsorbedPower),
    totalEmittedPower: finiteOrNull(diagnostics.totalEmittedPower),
    sourcePower: finiteOrNull(diagnostics.sourcePower),
    meanTemperatureK: finiteOrNull(diagnostics.meanTemperatureK),
    meanOpacity: finiteOrNull(diagnostics.meanOpacity),
    opticalDepth: finiteOrNull(diagnostics.opticalDepth),
    greenhouseFactor: finiteOrNull(diagnostics.greenhouseFactor),
    maxFluxMagnitude: finiteOrNull(diagnostics.maxFluxMagnitude),
    radiationEnergyDelta: finiteOrNull(conservation.radiationEnergyDelta),
    absorbedMinusEmitted: finiteOrNull(conservation.absorbedMinusEmitted)
  };
}

function validationBlockers(prefix, checks = {}) {
  return Object.entries(checks)
    .filter(([, passed]) => passed !== true)
    .map(([name]) => `${prefix}-${kebabCase(name)}-failed`);
}

async function sha256CanonicalJson(value) {
  if (!globalThis.crypto?.subtle) {
    return null;
  }
  const encoded = new TextEncoder().encode(canonicalJson(value));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
  return `sha256:${Array.from(new Uint8Array(digest), byteToHex).join('')}`;
}

function canonicalJson(value) {
  return JSON.stringify(sortJson(value));
}

function sortJson(value) {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sortJson(value[key])])
    );
  }
  return value;
}

function clonePlain(value) {
  if (!value || typeof value !== 'object') return {};
  return JSON.parse(JSON.stringify(value));
}

function finiteOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function byteToHex(byte) {
  return byte.toString(16).padStart(2, '0');
}

function kebabCase(value) {
  return String(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
