export const MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_SCHEMA = 'peercompute.multiscale.runtime-diagnostics-budget.v0';
export const MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_POLICY = 'adaptive-runtime-diagnostics-cache-v0';

const TARGET_FRAME_MS = 1000 / 60;

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeHudMode(mode = 'focus') {
  const value = String(mode || '').trim().toLowerCase();
  return value === 'telemetry' || value === 'full' || value === 'debug'
    ? 'telemetry'
    : 'focus';
}

function intervalForPressure(pressure, mode) {
  if (mode === 'telemetry') {
    if (pressure >= 4) return 12;
    if (pressure >= 3.2) return 8;
    if (pressure >= 2.4) return 6;
    if (pressure >= 1.5) return 3;
    return 1;
  }
  if (pressure >= 4) return 48;
  if (pressure >= 3.2) return 36;
  if (pressure >= 2.4) return 24;
  if (pressure >= 1.8) return 12;
  if (pressure >= 1.25) return 6;
  return 2;
}

function statusFor({ shouldRefresh, hasSnapshot, pressure, framesSinceSnapshot }) {
  if (shouldRefresh && !hasSnapshot) return 'initial-build';
  if (shouldRefresh) return pressure >= 2.4 ? 'pressure-refresh' : 'cadence-refresh';
  if (framesSinceSnapshot <= 0) return 'reuse-current';
  return pressure >= 2.4 ? 'pressure-cached' : 'cadence-cached';
}

export function createRuntimeDiagnosticsBudget({
  frame = 0,
  nowMs = Date.now(),
  hudMode = 'focus',
  runtimeScaler = null,
  renderBudget = null,
  statePublicationBudget = null,
  managerStats = null,
  targetFrameMs = TARGET_FRAME_MS,
  lastSnapshotFrame = -1,
  lastSnapshotAtMs = -Infinity,
  snapshotBuildCount = 0,
  snapshotReuseCount = 0,
  lastDurationMs = 0,
  force = false,
  reason = 'runtime'
} = {}) {
  const currentFrame = Math.max(0, Math.floor(finiteNumber(frame, 0)));
  const currentNowMs = finiteNumber(nowMs, Date.now());
  const targetMs = Math.max(1, finiteNumber(targetFrameMs, TARGET_FRAME_MS));
  const frameMs = finiteNumber(
    runtimeScaler?.frameMsAvg ?? renderBudget?.frameMsAvg,
    0
  );
  const framePressure = frameMs > 0 ? frameMs / targetMs : 0;
  const scalerPressure = finiteNumber(runtimeScaler?.pressure, 0);
  const renderPressure = finiteNumber(renderBudget?.pressure, 0);
  const statePressure = finiteNumber(statePublicationBudget?.pressure, 0);
  const managerLoad = finiteNumber(managerStats?.currentLoad, 0);
  const pressure = Math.max(1, framePressure, scalerPressure, renderPressure, statePressure, managerLoad);
  const mode = normalizeHudMode(hudMode);
  const snapshotIntervalFrames = intervalForPressure(pressure, mode);
  const snapshotIntervalMs = Math.max(
    500,
    Math.round(snapshotIntervalFrames * targetMs)
  );
  const lastFrame = Number.isFinite(Number(lastSnapshotFrame))
    ? Math.floor(Number(lastSnapshotFrame))
    : -1;
  const hasSnapshot = lastFrame >= 0 && Number.isFinite(Number(lastSnapshotAtMs));
  const framesSinceSnapshot = hasSnapshot
    ? Math.max(0, currentFrame - lastFrame)
    : Number.POSITIVE_INFINITY;
  const snapshotAgeMs = hasSnapshot
    ? Math.max(0, currentNowMs - Number(lastSnapshotAtMs))
    : Number.POSITIVE_INFINITY;
  const dueByFrame = framesSinceSnapshot >= snapshotIntervalFrames;
  const dueByTime = snapshotAgeMs >= snapshotIntervalMs;
  const shouldRefresh = force || !hasSnapshot || dueByFrame || dueByTime;

  return {
    schema: MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_SCHEMA,
    policy: MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_POLICY,
    reason,
    hudMode: mode,
    frame: currentFrame,
    targetFrameMs: Number(targetMs.toFixed(2)),
    frameMsAvg: Number(frameMs.toFixed(3)),
    pressure: Number(pressure.toFixed(3)),
    framePressure: Number(framePressure.toFixed(3)),
    managerLoad: Number(managerLoad.toFixed(3)),
    statePublicationPressure: Number(statePressure.toFixed(3)),
    snapshotIntervalFrames,
    snapshotIntervalMs,
    lastSnapshotFrame: lastFrame,
    framesSinceSnapshot: Number.isFinite(framesSinceSnapshot) ? framesSinceSnapshot : null,
    snapshotAgeMs: Number.isFinite(snapshotAgeMs) ? Number(snapshotAgeMs.toFixed(1)) : null,
    shouldRefresh,
    force: !!force,
    dueByFrame,
    dueByTime,
    snapshotBuildCount: Math.max(0, Math.floor(finiteNumber(snapshotBuildCount, 0))),
    snapshotReuseCount: Math.max(0, Math.floor(finiteNumber(snapshotReuseCount, 0))),
    lastDurationMs: Number(Math.max(0, finiteNumber(lastDurationMs, 0)).toFixed(3)),
    status: statusFor({
      shouldRefresh,
      hasSnapshot,
      pressure,
      framesSinceSnapshot: Number.isFinite(framesSinceSnapshot) ? framesSinceSnapshot : 0
    }),
    updatedAt: Date.now()
  };
}
