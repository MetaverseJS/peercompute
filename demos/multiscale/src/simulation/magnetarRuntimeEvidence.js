export const RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCHEMA =
  'peercompute.multiscale.relativistic-correction.runtime-validation.v0';

export const RELATIVISTIC_CORRECTION_RUNTIME_VALIDATION_SCOPE =
  'bounded-analytic-post-newtonian-proxy-validation';

const RUNTIME_EVIDENCE_ENTRY_ID = 'validated-relativistic-correction-runtime';
const RUNTIME_EVIDENCE_FAMILY = 'relativistic-correction';
const RUNTIME_EVIDENCE_SOLVER_ID = 'relativistic-correction';

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
  const blockers = validationBlockers(checks);
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

function validationBlockers(checks = {}) {
  return Object.entries(checks)
    .filter(([, passed]) => passed !== true)
    .map(([name]) => `relativistic-correction-${kebabCase(name)}-failed`);
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
