export const RUNTIME_BUDGET_GOVERNOR_SCHEMA = 'peercompute.capabilities.runtime-governor.v1';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finiteOr(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

/**
 * Reusable closed-loop runtime frame/queue/memory budget governor with hysteresis
 * and cooldowns. Operates in either continuous scale mode (minScale..maxScale) or
 * discrete quality-level mode (levels[]).
 */
export class RuntimeBudgetGovernor {
  constructor({
    targetFrameMs = 16.7,
    highFrameMs = 24,
    lowFrameMs = 12,
    sampleAlpha = 0.12,
    downDelayMs = 1500,
    upDelayMs = 4000,
    cooldownDownMs = 3000,
    cooldownUpMs = 6000,
    minScale = 0.25,
    maxScale = 1.0,
    initialScale = 1.0,
    stepDownFactor = 0.8,
    stepUpFactor = 1.15,
    levels = null,
    initialLevelIndex = null,
    maxQueuePressure = 4,
    maxHeapFraction = 0.85,
    onChange = null
  } = {}) {
    this.targetFrameMs = Math.max(4, finiteOr(targetFrameMs, 16.7));
    this.highFrameMs = Math.max(this.targetFrameMs, finiteOr(highFrameMs, 24));
    this.lowFrameMs = Math.min(this.targetFrameMs, Math.max(1, finiteOr(lowFrameMs, 12)));
    this.sampleAlpha = clamp(finiteOr(sampleAlpha, 0.12), 0.01, 1);
    this.downDelayMs = Math.max(0, finiteOr(downDelayMs, 1500));
    this.upDelayMs = Math.max(0, finiteOr(upDelayMs, 4000));
    this.cooldownDownMs = Math.max(0, finiteOr(cooldownDownMs, 3000));
    this.cooldownUpMs = Math.max(0, finiteOr(cooldownUpMs, 6000));
    this.minScale = clamp(finiteOr(minScale, 0.25), 0.05, 1);
    this.maxScale = Math.max(this.minScale, clamp(finiteOr(maxScale, 1.0), 0.1, 4));
    this.scale = clamp(finiteOr(initialScale, 1.0), this.minScale, this.maxScale);
    this.stepDownFactor = clamp(finiteOr(stepDownFactor, 0.8), 0.25, 0.98);
    this.stepUpFactor = clamp(finiteOr(stepUpFactor, 1.15), 1.02, 2.0);
    this.levels = Array.isArray(levels) && levels.length > 0 ? [...levels] : null;
    this.levelIndex = this.levels
      ? clamp(
        initialLevelIndex != null ? Math.floor(initialLevelIndex) : this.levels.length - 1,
        0,
        this.levels.length - 1
      )
      : null;
    this.maxQueuePressure = Math.max(1, finiteOr(maxQueuePressure, 4));
    this.maxHeapFraction = clamp(finiteOr(maxHeapFraction, 0.85), 0.5, 0.99);
    this.onChange = typeof onChange === 'function' ? onChange : null;

    this.frameMsAvg = this.targetFrameMs;
    this.overBudgetMs = 0;
    this.underBudgetMs = 0;
    this.cooldownRemainingMs = 0;
    this.holdRemainingMs = 0;
    this.holdReason = null;
    this.pressure = 0;
    this.lastAction = 'baseline';
    this.lastReason = 'initial';
    this.adjustments = 0;
    this.samples = 0;
  }

  hold(durationMs = 4000, reason = 'manual') {
    this.holdRemainingMs = Math.max(this.holdRemainingMs, Math.max(0, finiteOr(durationMs, 4000)));
    this.holdReason = String(reason || 'manual');
    this.overBudgetMs = 0;
    this.underBudgetMs = 0;
    return this.getStatus();
  }

  setLevelIndex(index, { holdMs = 0, reason = 'manual' } = {}) {
    if (!this.levels) return this.getStatus();
    this.levelIndex = clamp(Math.floor(index), 0, this.levels.length - 1);
    this.lastAction = 'set-level';
    this.lastReason = reason;
    if (holdMs > 0) this.hold(holdMs, reason);
    return this.getStatus();
  }

  setScale(scale, { holdMs = 0, reason = 'manual' } = {}) {
    this.scale = clamp(finiteOr(scale, this.scale), this.minScale, this.maxScale);
    this.lastAction = 'set-scale';
    this.lastReason = reason;
    if (holdMs > 0) this.hold(holdMs, reason);
    return this.getStatus();
  }

  reset() {
    this.frameMsAvg = this.targetFrameMs;
    this.overBudgetMs = 0;
    this.underBudgetMs = 0;
    this.cooldownRemainingMs = 0;
    this.holdRemainingMs = 0;
    this.holdReason = null;
    this.pressure = 0;
    this.lastAction = 'baseline';
    this.lastReason = 'reset';
    return this.getStatus();
  }

  update({
    frameMs = null,
    dtMs = null,
    queueDepth = 0,
    activeTasks = 0,
    workerCount = 1,
    heapUsedBytes = null,
    heapLimitBytes = null,
    gpuPassMs = null
  } = {}) {
    const sampleMs = Number.isFinite(frameMs)
      ? Math.max(0, frameMs)
      : (Number.isFinite(dtMs) ? Math.max(0, dtMs) : this.frameMsAvg);
    const stepMs = Number.isFinite(dtMs) ? clamp(dtMs, 0, 250) : clamp(sampleMs, 0, 250);
    if (stepMs <= 0) return this.getStatus();

    this.samples += 1;
    this.frameMsAvg = this.frameMsAvg * (1 - this.sampleAlpha) + sampleMs * this.sampleAlpha;

    const queueLoad = Math.max(0, finiteOr(queueDepth, 0) + finiteOr(activeTasks, 0)) / Math.max(1, finiteOr(workerCount, 1));
    const heapFraction = Number.isFinite(heapUsedBytes) && Number.isFinite(heapLimitBytes) && heapLimitBytes > 0
      ? heapUsedBytes / heapLimitBytes
      : 0;
    const gpuOver = Number.isFinite(gpuPassMs) && gpuPassMs > this.highFrameMs * 0.85;

    const frameOver = this.frameMsAvg > this.highFrameMs;
    const queueOver = queueLoad >= this.maxQueuePressure;
    const heapOver = heapFraction >= this.maxHeapFraction;
    const over = frameOver || queueOver || heapOver || gpuOver;
    const under = !over && this.frameMsAvg < this.lowFrameMs && queueLoad < 1 && heapFraction < this.maxHeapFraction * 0.8;

    this.pressure = Number(clamp(
      Math.max(0, (this.frameMsAvg - this.lowFrameMs) / Math.max(1, this.highFrameMs - this.lowFrameMs))
        + (queueOver ? 0.6 : 0)
        + (heapOver ? 0.8 : 0),
      0,
      4
    ).toFixed(3));

    if (this.holdRemainingMs > 0) {
      this.holdRemainingMs = Math.max(0, this.holdRemainingMs - stepMs);
      if (this.holdRemainingMs === 0) this.holdReason = null;
      this.overBudgetMs = 0;
      this.underBudgetMs = 0;
      this.lastAction = 'hold';
      return this.getStatus();
    }

    if (this.cooldownRemainingMs > 0) {
      this.cooldownRemainingMs = Math.max(0, this.cooldownRemainingMs - stepMs);
      this.lastAction = 'cooldown';
      return this.getStatus();
    }

    if (over) {
      this.overBudgetMs += stepMs;
      this.underBudgetMs = 0;
    } else if (under) {
      this.underBudgetMs += stepMs;
      this.overBudgetMs = 0;
    } else {
      this.overBudgetMs = 0;
      this.underBudgetMs = 0;
    }

    let changed = false;
    let action = 'steady';
    let reason = 'within-budget';

    if (this.overBudgetMs >= this.downDelayMs) {
      reason = heapOver ? 'memory-pressure' : (queueOver ? 'queue-pressure' : (gpuOver ? 'gpu-pass-budget' : 'frame-time'));
      if (this.levels) {
        if (this.levelIndex > 0) {
          this.levelIndex -= 1;
          changed = true;
        }
      } else {
        const next = clamp(Number((this.scale * this.stepDownFactor).toFixed(3)), this.minScale, this.maxScale);
        if (next < this.scale) {
          this.scale = next;
          changed = true;
        }
      }
      action = changed ? 'scale-down' : 'at-floor';
      this.overBudgetMs = 0;
      this.cooldownRemainingMs = this.cooldownDownMs;
    } else if (this.underBudgetMs >= this.upDelayMs) {
      reason = 'headroom-available';
      if (this.levels) {
        if (this.levelIndex < this.levels.length - 1) {
          this.levelIndex += 1;
          changed = true;
        }
      } else {
        const next = clamp(Number((this.scale * this.stepUpFactor).toFixed(3)), this.minScale, this.maxScale);
        if (next > this.scale) {
          this.scale = next;
          changed = true;
        }
      }
      action = changed ? 'scale-up' : 'at-ceiling';
      this.underBudgetMs = 0;
      this.cooldownRemainingMs = this.cooldownUpMs;
    }

    this.lastAction = action;
    this.lastReason = reason;
    const status = this.getStatus();
    if (changed) {
      this.adjustments += 1;
      status.adjustments = this.adjustments;
      this.onChange?.(status);
    }
    return status;
  }

  getStatus() {
    return {
      schema: RUNTIME_BUDGET_GOVERNOR_SCHEMA,
      mode: this.levels ? 'levels' : 'continuous',
      scale: this.scale,
      levelIndex: this.levelIndex,
      level: this.levels ? this.levels[this.levelIndex] : null,
      levelCount: this.levels ? this.levels.length : 0,
      frameMsAvg: Number(this.frameMsAvg.toFixed(3)),
      pressure: this.pressure,
      overBudgetMs: Math.round(this.overBudgetMs),
      underBudgetMs: Math.round(this.underBudgetMs),
      cooldownRemainingMs: Math.round(this.cooldownRemainingMs),
      holdActive: this.holdRemainingMs > 0,
      holdRemainingMs: Math.round(this.holdRemainingMs),
      holdReason: this.holdReason,
      lastAction: this.lastAction,
      lastReason: this.lastReason,
      adjustments: this.adjustments,
      samples: this.samples
    };
  }
}

export function createRuntimeBudgetGovernor(options = {}) {
  return new RuntimeBudgetGovernor(options);
}
