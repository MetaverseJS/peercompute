export const MULTISCALE_READBACK_BUDGET_SCHEMA = 'peercompute.multiscale.readback-budget.v0';
export const MULTISCALE_READBACK_BUDGET_POLICY = 'adaptive-ladder-readback-cadence-v0';

const TARGET_FRAME_MS = 1000 / 60;
const NOMINAL_READBACK_INTERVAL = 3;
const MIN_READBACK_INTERVAL = 2;
const MAX_READBACK_INTERVAL = 12;

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampInteger(value, min, max, fallback) {
  const number = Math.floor(Number(value));
  const base = Number.isFinite(number) ? number : fallback;
  return Math.min(max, Math.max(min, base));
}

function normalizeHudMode(mode = 'focus') {
  const value = String(mode || '').trim().toLowerCase();
  return value === 'telemetry' || value === 'full' || value === 'debug'
    ? 'telemetry'
    : 'focus';
}

function readbackIntervalForPressure(pressure) {
  if (pressure >= 4) return 12;
  if (pressure >= 3.2) return 9;
  if (pressure >= 2.4) return 6;
  if (pressure >= 1.8) return 4;
  if (pressure >= 1.2) return NOMINAL_READBACK_INTERVAL;
  return MIN_READBACK_INTERVAL;
}

function createStatus(interval, nominal, pendingReadbacks, backlog) {
  if (pendingReadbacks > 0 || backlog > interval * 2) return 'backlog-throttled';
  if (interval > nominal) return 'throttled';
  if (interval < nominal) return 'fresh';
  return 'nominal';
}

export function createMultiscaleReadbackBudget({
  activeLayerId = 'supergalactic',
  hudMode = 'focus',
  runtimeScaler = null,
  renderBudget = null,
  computeStatus = null,
  frameMsAvg = null,
  pressure = null,
  targetFrameMs = TARGET_FRAME_MS,
  minReadbackInterval = MIN_READBACK_INTERVAL,
  maxReadbackInterval = MAX_READBACK_INTERVAL,
  nominalReadbackInterval = NOMINAL_READBACK_INTERVAL,
  previousReadbackInterval = null,
  reason = 'runtime'
} = {}) {
  const targetMs = Math.max(1, finiteNumber(targetFrameMs, TARGET_FRAME_MS));
  const minInterval = clampInteger(minReadbackInterval, 1, 60, MIN_READBACK_INTERVAL);
  const maxInterval = clampInteger(maxReadbackInterval, minInterval, 60, MAX_READBACK_INTERVAL);
  const nominalInterval = clampInteger(nominalReadbackInterval, minInterval, maxInterval, NOMINAL_READBACK_INTERVAL);
  const previousInterval = clampInteger(
    previousReadbackInterval ?? computeStatus?.readbackInterval,
    1,
    60,
    nominalInterval
  );
  const pendingReadbacks = Math.max(0, Math.floor(finiteNumber(computeStatus?.pendingReadbacks, 0)));
  const submittedFrames = Math.max(0, Math.floor(finiteNumber(computeStatus?.submittedFrames, 0)));
  const completedReadbacks = Math.max(0, Math.floor(finiteNumber(computeStatus?.completedReadbacks, 0)));
  const backlogFrames = Math.max(0, submittedFrames - completedReadbacks);
  const readbackPressure = Math.max(
    1,
    1 + pendingReadbacks * 0.75,
    previousInterval > 0 ? backlogFrames / Math.max(1, previousInterval * 2) : 1
  );
  const frameMs = finiteNumber(frameMsAvg ?? runtimeScaler?.frameMsAvg ?? renderBudget?.frameMsAvg, 0);
  const runtimePressure = finiteNumber(pressure ?? runtimeScaler?.pressure, 0);
  const renderPressure = finiteNumber(renderBudget?.pressure, 0);
  const framePressure = frameMs > 0 ? frameMs / targetMs : 0;
  const combinedPressure = Math.max(1, runtimePressure, renderPressure, framePressure, readbackPressure);
  const suggestedInterval = readbackIntervalForPressure(combinedPressure);
  const readbackInterval = clampInteger(suggestedInterval, minInterval, maxInterval, nominalInterval);
  const status = createStatus(readbackInterval, nominalInterval, pendingReadbacks, backlogFrames);

  return {
    schema: MULTISCALE_READBACK_BUDGET_SCHEMA,
    policy: MULTISCALE_READBACK_BUDGET_POLICY,
    reason,
    activeLayerId: activeLayerId || 'unknown',
    hudMode: normalizeHudMode(hudMode),
    targetFrameMs: Number(targetMs.toFixed(2)),
    frameMsAvg: Number(frameMs.toFixed(3)),
    pressure: Number(combinedPressure.toFixed(3)),
    runtimePressure: Number(Math.max(0, runtimePressure).toFixed(3)),
    renderPressure: Number(Math.max(0, renderPressure).toFixed(3)),
    framePressure: Number(Math.max(0, framePressure).toFixed(3)),
    readbackPressure: Number(readbackPressure.toFixed(3)),
    readbackInterval,
    previousReadbackInterval: previousInterval,
    nominalReadbackInterval: nominalInterval,
    minReadbackInterval: minInterval,
    maxReadbackInterval: maxInterval,
    pendingReadbacks,
    submittedFrames,
    completedReadbacks,
    readbackBacklogFrames: backlogFrames,
    staleFrameEstimate: Math.max(readbackInterval, backlogFrames),
    pendingReadbackThrottling: pendingReadbacks > 0 || readbackInterval > nominalInterval,
    changed: readbackInterval !== previousInterval,
    status,
    updatedAt: Date.now()
  };
}
