export const MULTISCALE_RENDER_BUDGET_SCHEMA = 'peercompute.multiscale.render-budget.v0';
export const MULTISCALE_RENDER_BUDGET_POLICY = 'active-layer-visual-budget-v0';

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

function pointScaleForPressure(pressure) {
  if (pressure >= 6) return 0.1;
  if (pressure >= 4.2) return 0.16;
  if (pressure >= 3.2) return 0.25;
  if (pressure >= 2.4) return 0.33;
  if (pressure >= 1.8) return 0.5;
  if (pressure >= 1.2) return 0.67;
  return 1;
}

function commitIntervalForPressure(pressure, mode) {
  if (mode === 'telemetry') {
    if (pressure >= 6) return 3;
    if (pressure >= 4.2) return 2;
    if (pressure >= 3.2) return 2;
    return 1;
  }
  if (pressure >= 6) return 8;
  if (pressure >= 4.2) return 6;
  if (pressure >= 3.2) return 4;
  if (pressure >= 2.4) return 3;
  if (pressure >= 1.8) return 2;
  return 1;
}

function visibleCommitLimitForPressure(pressure, mode) {
  if (mode === 'telemetry') {
    if (pressure >= 6) return 4;
    if (pressure >= 4.2) return 5;
    if (pressure >= 3.2) return 6;
    if (pressure >= 2.4) return 8;
    return 12;
  }
  if (pressure >= 4.2) return 1;
  if (pressure >= 3.2) return 2;
  if (pressure >= 2.4) return 3;
  if (pressure >= 1.8) return 4;
  return 12;
}

function pixelRatioScaleForPressure(pressure, mode) {
  if (mode === 'telemetry') {
    if (pressure >= 6) return 0.58;
    if (pressure >= 4.2) return 0.66;
    if (pressure >= 4) return 0.72;
    if (pressure >= 3.2) return 0.78;
    if (pressure >= 2.4) return 0.86;
    return 1;
  }
  if (pressure >= 6) return 0.36;
  if (pressure >= 4.2) return 0.42;
  if (pressure >= 4) return 0.5;
  if (pressure >= 3.2) return 0.6;
  if (pressure >= 2.4) return 0.72;
  if (pressure >= 1.8) return 0.85;
  return 1;
}

function dynamicVisualIntervalForPressure(pressure, mode) {
  if (mode === 'telemetry') {
    if (pressure >= 6) return 3;
    if (pressure >= 4.2) return 2;
    if (pressure >= 4) return 2;
    return 1;
  }
  if (pressure >= 6) return 8;
  if (pressure >= 4.2) return 6;
  if (pressure >= 4) return 4;
  if (pressure >= 3.2) return 3;
  if (pressure >= 2.4) return 2;
  return 1;
}

function minVisibleScaleForPressure(pressure, mode) {
  if (mode === 'telemetry') {
    if (pressure >= 6) return 0.6;
    if (pressure >= 4.2) return 0.75;
    return 1;
  }
  if (pressure >= 6) return 0.25;
  if (pressure >= 4.2) return 0.375;
  if (pressure >= 3.2) return 0.75;
  return 1;
}

export function createMultiscaleRenderBudget({
  activeLayerId = 'supergalactic',
  hudMode = 'focus',
  runtimeScaler = null,
  frameMsAvg = null,
  pressure = null,
  targetFrameMs = TARGET_FRAME_MS,
  updateHiddenOverlays = null,
  frame = 0,
  reason = 'runtime'
} = {}) {
  const targetMs = Math.max(1, finiteNumber(targetFrameMs, TARGET_FRAME_MS));
  const frameMs = finiteNumber(frameMsAvg ?? runtimeScaler?.frameMsAvg, 0);
  const scalerPressure = finiteNumber(pressure ?? runtimeScaler?.pressure, 0);
  const framePressure = frameMs > 0 ? frameMs / targetMs : 0;
  const renderPressure = Math.max(1, scalerPressure, framePressure);
  const mode = normalizeHudMode(hudMode);
  const severeFrameRescue = renderPressure >= 4.2;
  const rescueLevel = !severeFrameRescue
    ? 'off'
    : renderPressure >= 6
      ? 'severe'
      : 'high';
  const hiddenUpdates = updateHiddenOverlays == null
    ? mode === 'telemetry'
    : updateHiddenOverlays !== false;
  const rawPointScale = pointScaleForPressure(renderPressure);
  const pointScale = hiddenUpdates
    ? Math.max(0.67, rawPointScale)
    : rawPointScale;
  const commitIntervalFrames = commitIntervalForPressure(renderPressure, mode);
  const maxVisibleCommitsPerFrame = visibleCommitLimitForPressure(renderPressure, mode);
  const pixelRatioScale = pixelRatioScaleForPressure(renderPressure, mode);
  const dynamicVisualIntervalFrames = dynamicVisualIntervalForPressure(renderPressure, mode);
  const minVisibleScale = minVisibleScaleForPressure(renderPressure, mode);
  const activeOverlayThrottling = commitIntervalFrames > 1 || maxVisibleCommitsPerFrame < 12;
  const renderQualityThrottling = pixelRatioScale < 1 || dynamicVisualIntervalFrames > 1;

  return {
    schema: MULTISCALE_RENDER_BUDGET_SCHEMA,
    policy: MULTISCALE_RENDER_BUDGET_POLICY,
    reason,
    activeLayerId: activeLayerId || 'unknown',
    hudMode: mode,
    frame: Math.max(0, Math.floor(finiteNumber(frame, 0))),
    targetFrameMs: Number(targetMs.toFixed(2)),
    frameMsAvg: Number(frameMs.toFixed(3)),
    pressure: Number(renderPressure.toFixed(3)),
    pointScale: Number(pointScale.toFixed(3)),
    minVisibleScale: Number(minVisibleScale.toFixed(3)),
    pixelRatioScale: Number(pixelRatioScale.toFixed(3)),
    dynamicVisualIntervalFrames,
    commitIntervalFrames,
    maxVisibleCommitsPerFrame,
    severeFrameRescue,
    rescueLevel,
    activeOverlayThrottling,
    renderQualityThrottling,
    dynamicVisualThrottling: dynamicVisualIntervalFrames > 1,
    updateHiddenOverlays: hiddenUpdates,
    status: severeFrameRescue
      ? 'rescue'
      : pointScale < 1 || activeOverlayThrottling || renderQualityThrottling || !hiddenUpdates ? 'budgeted' : 'full',
    updatedAt: Date.now()
  };
}
