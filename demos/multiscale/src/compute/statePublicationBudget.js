export const MULTISCALE_STATE_PUBLICATION_BUDGET_SCHEMA = 'peercompute.multiscale.state-publication-budget.v0';
export const MULTISCALE_STATE_PUBLICATION_BUDGET_POLICY = 'adaptive-state-publication-cadence-v0';

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
    if (pressure >= 4) return 5;
    if (pressure >= 3.2) return 4;
    if (pressure >= 2.4) return 3;
    if (pressure >= 1.5) return 2;
    return 1;
  }
  if (pressure >= 4) return 10;
  if (pressure >= 3.2) return 8;
  if (pressure >= 2.4) return 6;
  if (pressure >= 1.8) return 4;
  if (pressure >= 1.25) return 2;
  return 1;
}

function statusFor({ shouldPublish, interval, pressure, framesSincePublish }) {
  if (shouldPublish && interval <= 1) return 'live';
  if (shouldPublish) return 'published-throttled';
  if (framesSincePublish <= 0) return 'warming';
  if (pressure >= 2.4) return 'pressure-deferred';
  return 'cadence-deferred';
}

export function createStatePublicationBudget({
  frame = 0,
  hudMode = 'focus',
  runtimeScaler = null,
  renderBudget = null,
  solverSubmissionBudget = null,
  managerStats = null,
  targetFrameMs = TARGET_FRAME_MS,
  lastPublishedFrame = -1,
  publishCount = 0,
  skippedFrameCount = 0,
  lastDurationMs = 0,
  force = false,
  reason = 'runtime'
} = {}) {
  const currentFrame = Math.max(0, Math.floor(finiteNumber(frame, 0)));
  const targetMs = Math.max(1, finiteNumber(targetFrameMs, TARGET_FRAME_MS));
  const frameMs = finiteNumber(
    runtimeScaler?.frameMsAvg ?? renderBudget?.frameMsAvg,
    0
  );
  const framePressure = frameMs > 0 ? frameMs / targetMs : 0;
  const scalerPressure = finiteNumber(runtimeScaler?.pressure, 0);
  const renderPressure = finiteNumber(renderBudget?.pressure, 0);
  const queuePressure = finiteNumber(solverSubmissionBudget?.queuePressure, 0);
  const managerLoad = finiteNumber(managerStats?.currentLoad, 0);
  const pressure = Math.max(1, framePressure, scalerPressure, renderPressure, queuePressure, managerLoad);
  const mode = normalizeHudMode(hudMode);
  const packetIntervalFrames = intervalForPressure(pressure, mode);
  const deltaIntervalFrames = packetIntervalFrames;
  const lastFrame = Number.isFinite(Number(lastPublishedFrame))
    ? Math.floor(Number(lastPublishedFrame))
    : -1;
  const framesSincePublish = lastFrame >= 0
    ? Math.max(0, currentFrame - lastFrame)
    : Number.POSITIVE_INFINITY;
  const shouldPublish = force || lastFrame < 0 || framesSincePublish >= packetIntervalFrames;
  const shouldPublishWarmDeltas = shouldPublish;

  return {
    schema: MULTISCALE_STATE_PUBLICATION_BUDGET_SCHEMA,
    policy: MULTISCALE_STATE_PUBLICATION_BUDGET_POLICY,
    reason,
    hudMode: mode,
    frame: currentFrame,
    targetFrameMs: Number(targetMs.toFixed(2)),
    frameMsAvg: Number(frameMs.toFixed(3)),
    pressure: Number(pressure.toFixed(3)),
    framePressure: Number(framePressure.toFixed(3)),
    queuePressure: Number(queuePressure.toFixed(3)),
    managerLoad: Number(managerLoad.toFixed(3)),
    packetIntervalFrames,
    deltaIntervalFrames,
    lastPublishedFrame: lastFrame,
    framesSincePublish: Number.isFinite(framesSincePublish) ? framesSincePublish : null,
    shouldPublish,
    shouldPublishWarmDeltas,
    publishCount: Math.max(0, Math.floor(finiteNumber(publishCount, 0))),
    skippedFrameCount: Math.max(0, Math.floor(finiteNumber(skippedFrameCount, 0))),
    lastDurationMs: Number(Math.max(0, finiteNumber(lastDurationMs, 0)).toFixed(3)),
    status: statusFor({
      shouldPublish,
      interval: packetIntervalFrames,
      pressure,
      framesSincePublish: Number.isFinite(framesSincePublish) ? framesSincePublish : 0
    }),
    updatedAt: Date.now()
  };
}
