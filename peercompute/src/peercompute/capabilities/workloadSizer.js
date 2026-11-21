export const WORKLOAD_SIZING_SCHEMA = 'peercompute.capabilities.workload-sizing.v1';

const TIER_SCALE = Object.freeze({
  mobile: 0.4,
  laptop: 1.0,
  workstation: 2.0,
  cluster: 4.0
});

const PERFORMANCE_CLASS_SCALE = Object.freeze({
  software: 0.2,
  low: 0.45,
  mid: 1.0,
  high: 1.75,
  workstation: 3.0
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeInt(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return clamp(n, min, max);
}

function normalizeNum(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return clamp(n, min, max);
}

function roundToMultiple(value, multiple = 1) {
  const step = Math.max(1, Math.floor(multiple));
  return Math.max(step, Math.round(value / step) * step);
}

function resolveGpuLimits(capabilities = {}, budgets = null) {
  const capLimits = capabilities?.webgpu?.limits || capabilities?.gpuLimits || {};
  const maxBuffer = normalizeInt(budgets?.maxBufferSize ?? capLimits.maxBufferSize, null, 1);
  const maxStorageBinding = normalizeInt(
    budgets?.maxStorageBufferBindingSize ?? capLimits.maxStorageBufferBindingSize,
    null,
    1
  );
  const singleBufferLimitBytes = maxBuffer != null && maxStorageBinding != null
    ? Math.min(maxBuffer, maxStorageBinding)
    : (maxStorageBinding ?? maxBuffer ?? null);
  return {
    maxBufferSize: maxBuffer,
    maxStorageBufferBindingSize: maxStorageBinding,
    singleBufferLimitBytes,
    maxComputeWorkgroupsPerDimension: normalizeInt(capLimits.maxComputeWorkgroupsPerDimension, 65535, 1),
    maxComputeInvocationsPerWorkgroup: normalizeInt(capLimits.maxComputeInvocationsPerWorkgroup, 256, 1),
    maxTextureDimension2D: normalizeInt(capLimits.maxTextureDimension2D, null, 1),
    maxTextureDimension3D: normalizeInt(capLimits.maxTextureDimension3D, null, 1)
  };
}

function resolveMemoryBudgetsBytes(capabilities = {}, benchmark = null, budgets = null) {
  const plan = capabilities?.planningBudgets || {};
  const bench = benchmark?.workingSetGuidance || {};
  const defaultCpuMB = bench.cpuBudgetMB ?? plan.memoryBudgetMB ?? capabilities?.memoryBudgetMB ?? 1024;
  const defaultGpuMB = bench.gpuBudgetMB ?? plan.gpuMemoryBudgetMB ?? capabilities?.gpuMemoryBudgetMB ?? 512;
  const cpuBudgetBytes = normalizeNum(budgets?.cpuBytes, defaultCpuMB * 1024 * 1024, 0);
  const gpuBudgetBytes = normalizeNum(budgets?.gpuBytes, defaultGpuMB * 1024 * 1024, 0);
  return { cpuBudgetBytes, gpuBudgetBytes };
}

function resolvePerformanceScale(capabilities = {}, benchmark = null, overrides = null) {
  const explicit = normalizeNum(overrides?.budgetScale ?? capabilities?.planningBudgets?.budgetScale, 1, 0.05, 16);
  if (benchmark?.performanceClass) {
    const classScale = PERFORMANCE_CLASS_SCALE[benchmark.performanceClass] ?? 1.0;
    const score = benchmark.scores?.overallScore;
    const refined = Number.isFinite(score) ? clamp(0.5 * classScale + 0.5 * score, 0.15, 6) : classScale;
    return clamp(refined * explicit, 0.1, 16);
  }
  const tier = overrides?.tier || capabilities?.tier || 'laptop';
  return clamp((TIER_SCALE[tier] ?? 1.0) * explicit, 0.1, 16);
}

export function recommendPixelRatio(capabilities = {}, benchmark = null, overrides = null) {
  const nativeDpr = normalizeNum(capabilities?.display?.devicePixelRatio, 1, 0.5, 8);
  const explicitCap = normalizeNum(overrides?.dprCap, null, 1, 4);
  if (explicitCap != null) return Math.min(nativeDpr, explicitCap);

  const perfClass = benchmark?.performanceClass || null;
  if (perfClass === 'software' || perfClass === 'low') return Math.min(nativeDpr, 1.25);
  if (capabilities?.tier === 'mobile') return Math.min(nativeDpr, 1.5);
  return Math.min(nativeDpr, 2);
}

/**
 * Right-size a linear item-count workload (particles, rigid bodies, stars, point samples).
 * Respects single storage buffer limits, 1D dispatch workgroup limits, complexity (O(N), O(N log N), O(N^2)),
 * memory working-set envelopes, and measured hardware speed.
 */
export function sizeCountWorkload(spec = {}, { capabilities = {}, benchmark = null, overrides = null, budgets = null } = {}) {
  const minCount = normalizeInt(spec.minCount, 1, 1);
  const maxCount = normalizeInt(spec.maxCount, 1_000_000, minCount);
  const baseCount = normalizeInt(spec.baseCount, minCount, minCount, maxCount);
  const requestedCount = spec.requestedCount != null
    ? normalizeInt(spec.requestedCount, baseCount, minCount, maxCount)
    : null;
  const multiple = normalizeInt(spec.multiple, 1, 1);
  const strideBytes = normalizeInt(spec.strideBytes, 0, 0);
  const buffersCount = normalizeInt(spec.buffersCount, 1, 1);
  const largestSingleBufferBytesPerItem = normalizeInt(spec.storageBufferBytesPerItem, strideBytes, 0);
  const totalBytesPerItem = strideBytes * buffersCount;
  const memoryFraction = normalizeNum(spec.memoryFraction, 0.5, 0.01, 1);
  const gpuRequired = spec.gpuRequired !== false;
  const workgroupSize = normalizeInt(spec.workgroupSize, 64, 1);
  const dispatchDimensions = normalizeInt(spec.dispatchDimensions, 1, 1, 3);
  const complexity = String(spec.complexity || 'O(N)');

  const gpuLimits = resolveGpuLimits(capabilities, budgets);
  const memBudgets = resolveMemoryBudgetsBytes(capabilities, benchmark, budgets);
  const perfScale = resolvePerformanceScale(capabilities, benchmark, overrides);
  const gpuAvailable = capabilities?.webgpu?.available !== false;

  const reasons = [];
  const ceilings = {
    configuredMax: maxCount,
    gpuSingleBufferMax: maxCount,
    gpuDispatchMax: maxCount,
    gpuWorkingSetMax: maxCount,
    cpuMemoryMax: maxCount,
    complexityMax: maxCount
  };

  if (gpuRequired && largestSingleBufferBytesPerItem > 0 && gpuLimits.singleBufferLimitBytes != null) {
    ceilings.gpuSingleBufferMax = Math.max(
      minCount,
      Math.floor((gpuLimits.singleBufferLimitBytes * 0.9) / largestSingleBufferBytesPerItem)
    );
  }
  if (gpuRequired && dispatchDimensions === 1) {
    ceilings.gpuDispatchMax = Math.max(
      minCount,
      gpuLimits.maxComputeWorkgroupsPerDimension * workgroupSize
    );
  }
  if (gpuRequired && totalBytesPerItem > 0 && memBudgets.gpuBudgetBytes > 0) {
    ceilings.gpuWorkingSetMax = Math.max(
      minCount,
      Math.floor((memBudgets.gpuBudgetBytes * memoryFraction) / totalBytesPerItem)
    );
  }
  if (totalBytesPerItem > 0 && memBudgets.cpuBudgetBytes > 0) {
    ceilings.cpuMemoryMax = Math.max(
      minCount,
      Math.floor((memBudgets.cpuBudgetBytes * memoryFraction) / totalBytesPerItem)
    );
  }
  if (complexity === 'O(N^2)') {
    // Protect against GPU TDR / CPU freeze from quadratic all-pairs kernels.
    const baseQuadraticCap = normalizeInt(spec.quadraticBaseCap, 2048, minCount, maxCount);
    ceilings.complexityMax = Math.max(
      minCount,
      Math.floor(baseQuadraticCap * Math.sqrt(perfScale))
    );
  }

  let effectiveMaxCount = maxCount;
  let limitingFactor = 'none';
  for (const [key, ceiling] of Object.entries(ceilings)) {
    if (ceiling < effectiveMaxCount) {
      effectiveMaxCount = ceiling;
      limitingFactor = key;
    }
  }
  effectiveMaxCount = Math.max(minCount, effectiveMaxCount);

  let targetCount;
  if (requestedCount != null) {
    targetCount = requestedCount;
  } else if (complexity === 'O(N^2)') {
    targetCount = roundToMultiple(baseCount * Math.sqrt(perfScale), multiple);
  } else if (complexity === 'O(N log N)') {
    targetCount = roundToMultiple(baseCount * Math.pow(perfScale, 0.85), multiple);
  } else {
    targetCount = roundToMultiple(baseCount * perfScale, multiple);
  }

  const count = clamp(roundToMultiple(targetCount, multiple), minCount, effectiveMaxCount);
  const clamped = (requestedCount != null ? requestedCount : targetCount) > effectiveMaxCount;
  if (clamped) {
    reasons.push(`Clamped to ${effectiveMaxCount} by ${limitingFactor}`);
  }
  if (gpuRequired && !gpuAvailable) {
    reasons.push('Hardware WebGPU is unavailable');
  }

  const maxSubSteps = normalizeInt(spec.maxSubSteps, 8, 1, 64);
  const baseSubSteps = normalizeInt(spec.baseSubSteps, 1, 1, maxSubSteps);
  const recommendedSubSteps = clamp(
    Math.round(baseSubSteps * clamp(perfScale, 0.5, 2)),
    1,
    maxSubSteps
  );

  return {
    schema: WORKLOAD_SIZING_SCHEMA,
    kind: 'count',
    name: spec.name || 'items',
    count,
    minCount,
    maxCount,
    effectiveMaxCount,
    clamped,
    limitingFactor: clamped ? limitingFactor : 'none',
    ceilings,
    perfScale: Number(perfScale.toFixed(3)),
    recommendedSubSteps,
    recommendedDpr: recommendPixelRatio(capabilities, benchmark, overrides),
    estimatedSingleBufferBytes: count * largestSingleBufferBytesPerItem,
    estimatedTotalBytes: count * totalBytesPerItem,
    reasons
  };
}

/**
 * Right-size a 3D grid or volumetric simulation (MPM grid, Toychest broadphase grid,
 * PlanetGen 3D water volume, Schrodinger 3D orbital grid, Universes 3D density texture).
 */
export function sizeGrid3dWorkload(spec = {}, { capabilities = {}, benchmark = null, overrides = null, budgets = null } = {}) {
  const toTriplet = (val, fallback) => {
    if (Array.isArray(val) && val.length === 3) return val.map((v, i) => normalizeInt(v, fallback[i], 1));
    if (val && typeof val === 'object' && ('x' in val || 'y' in val || 'z' in val)) {
      return [normalizeInt(val.x, fallback[0], 1), normalizeInt(val.y, fallback[1], 1), normalizeInt(val.z, fallback[2], 1)];
    }
    const scalar = normalizeInt(val, fallback[0], 1);
    return [scalar, scalar, scalar];
  };

  const minDim = toTriplet(spec.minDim ?? 8, [8, 8, 8]);
  const maxDim = toTriplet(spec.maxDim ?? 256, [256, 256, 256]);
  const baseDim = toTriplet(spec.baseDim ?? 32, [32, 32, 32]);
  const requestedDim = spec.requestedDim != null ? toTriplet(spec.requestedDim, baseDim) : null;
  const step = normalizeInt(spec.step, 1, 1);
  const cellStrideBytes = normalizeInt(spec.cellStrideBytes, 32, 1);
  const buffersCount = normalizeInt(spec.buffersCount, 1, 1);
  const memoryFraction = normalizeNum(spec.memoryFraction, 0.4, 0.01, 1);
  const workgroupSize = normalizeInt(spec.workgroupSize, 64, 1);
  const dispatchDimensions = normalizeInt(spec.dispatchDimensions, 1, 1, 3);
  const webgl3dTexture = spec.webgl3dTexture === true;

  const gpuLimits = resolveGpuLimits(capabilities, budgets);
  const memBudgets = resolveMemoryBudgetsBytes(capabilities, benchmark, budgets);
  const perfScale = resolvePerformanceScale(capabilities, benchmark, overrides);
  const reasons = [];

  // Per-axis texture cap (WebGL2 3D texture or WebGPU 3D texture)
  let maxAxisCap = Math.max(...maxDim);
  if (webgl3dTexture && capabilities?.webgl?.max3DTextureSize) {
    maxAxisCap = Math.min(maxAxisCap, capabilities.webgl.max3DTextureSize);
  } else if (spec.webgpu3dTexture && gpuLimits.maxTextureDimension3D) {
    maxAxisCap = Math.min(maxAxisCap, gpuLimits.maxTextureDimension3D);
  }

  let maxCells = maxDim[0] * maxDim[1] * maxDim[2];
  let limitingFactor = 'none';

  const applyCellCap = (cap, reason) => {
    if (Number.isFinite(cap) && cap > 0 && cap < maxCells) {
      maxCells = Math.floor(cap);
      limitingFactor = reason;
    }
  };

  if (!webgl3dTexture && gpuLimits.singleBufferLimitBytes != null) {
    applyCellCap((gpuLimits.singleBufferLimitBytes * 0.9) / cellStrideBytes, 'gpuSingleBufferMax');
  }
  if (!webgl3dTexture && dispatchDimensions === 1) {
    applyCellCap(gpuLimits.maxComputeWorkgroupsPerDimension * workgroupSize, 'gpuDispatchMax');
  }
  if (memBudgets.gpuBudgetBytes > 0 && !webgl3dTexture) {
    applyCellCap((memBudgets.gpuBudgetBytes * memoryFraction) / (cellStrideBytes * buffersCount), 'gpuWorkingSetMax');
  }
  if (webgl3dTexture && memBudgets.cpuBudgetBytes > 0) {
    // 3D WebGL textures are built in CPU typed arrays first before upload.
    applyCellCap((memBudgets.cpuBudgetBytes * memoryFraction) / Math.max(4, cellStrideBytes * buffersCount), 'cpuMemoryMax');
  }

  const dimScale = Math.cbrt(perfScale);
  let target = requestedDim
    ? [...requestedDim]
    : baseDim.map((d, i) => clamp(roundToMultiple(d * dimScale, step), minDim[i], maxDim[i]));

  // Clamp per-axis to hardware max texture dimension if applicable.
  let clamped = false;
  target = target.map((d, i) => {
    const cap = Math.min(maxDim[i], maxAxisCap);
    if (d > cap) {
      clamped = true;
      if (limitingFactor === 'none') limitingFactor = 'max3DTextureSize';
      return clamp(Math.floor(cap / step) * step, minDim[i], cap);
    }
    return clamp(d, minDim[i], cap);
  });

  // Uniformly shrink axes if total cellCount exceeds hard maxCells.
  const minCells = minDim[0] * minDim[1] * minDim[2];
  const effectiveMaxCells = Math.max(minCells, maxCells);
  let cellCount = target[0] * target[1] * target[2];
  if (cellCount > effectiveMaxCells) {
    clamped = true;
    const shrink = Math.cbrt(effectiveMaxCells / cellCount);
    target = target.map((d, i) => {
      const scaled = Math.floor((d * shrink) / step) * step;
      return clamp(Math.max(step, scaled), minDim[i], Math.min(maxDim[i], maxAxisCap));
    });
    // Guarantee cellCount <= effectiveMaxCells even after rounding.
    while (target[0] * target[1] * target[2] > effectiveMaxCells) {
      let largestIdx = 0;
      for (let i = 1; i < 3; i += 1) {
        if (target[i] - minDim[i] > target[largestIdx] - minDim[largestIdx]) largestIdx = i;
      }
      if (target[largestIdx] <= minDim[largestIdx]) break;
      target[largestIdx] = Math.max(minDim[largestIdx], target[largestIdx] - step);
    }
    cellCount = target[0] * target[1] * target[2];
    reasons.push(`Clamped 3D grid to ${target.join('x')} (${cellCount} cells) by ${limitingFactor}`);
  }

  return {
    schema: WORKLOAD_SIZING_SCHEMA,
    kind: 'grid3d',
    name: spec.name || 'grid3d',
    dim: target,
    x: target[0],
    y: target[1],
    z: target[2],
    cellCount,
    effectiveMaxCells,
    clamped,
    limitingFactor: clamped ? limitingFactor : 'none',
    estimatedSingleBufferBytes: cellCount * cellStrideBytes,
    estimatedTotalBytes: cellCount * cellStrideBytes * buffersCount,
    recommendedDpr: recommendPixelRatio(capabilities, benchmark, overrides),
    reasons
  };
}

/**
 * Right-size a 2D grid/texture simulation (heightmaps, 2D weather/ocean fields).
 */
export function sizeGrid2dWorkload(spec = {}, { capabilities = {}, benchmark = null, overrides = null, budgets = null } = {}) {
  const minWidth = normalizeInt(spec.minWidth ?? spec.minDim, 16, 1);
  const maxWidth = normalizeInt(spec.maxWidth ?? spec.maxDim, 2048, minWidth);
  const baseWidth = normalizeInt(spec.baseWidth ?? spec.baseDim, 256, minWidth, maxWidth);
  const aspect = normalizeNum(spec.aspectRatio, 1, 0.1, 10); // height = width * aspect
  const step = normalizeInt(spec.step, 1, 1);
  const cellStrideBytes = normalizeInt(spec.cellStrideBytes, 16, 1);
  const buffersCount = normalizeInt(spec.buffersCount, 1, 1);
  const memoryFraction = normalizeNum(spec.memoryFraction, 0.35, 0.01, 1);
  const gpuRequired = spec.gpuRequired !== false;

  const gpuLimits = resolveGpuLimits(capabilities, budgets);
  const memBudgets = resolveMemoryBudgetsBytes(capabilities, benchmark, budgets);
  const perfScale = resolvePerformanceScale(capabilities, benchmark, overrides);
  const reasons = [];

  let widthCap = maxWidth;
  let limitingFactor = 'none';
  if (gpuRequired && gpuLimits.maxTextureDimension2D && gpuLimits.maxTextureDimension2D < widthCap) {
    widthCap = gpuLimits.maxTextureDimension2D;
    limitingFactor = 'maxTextureDimension2D';
  }
  if (!gpuRequired && capabilities?.webgl?.maxTextureSize && capabilities.webgl.maxTextureSize < widthCap) {
    widthCap = capabilities.webgl.maxTextureSize;
    limitingFactor = 'webglMaxTextureSize';
  }
  if (gpuRequired && gpuLimits.singleBufferLimitBytes != null) {
    const maxCells = Math.floor((gpuLimits.singleBufferLimitBytes * 0.9) / cellStrideBytes);
    const maxW = Math.floor(Math.sqrt(maxCells / aspect));
    if (maxW < widthCap) {
      widthCap = maxW;
      limitingFactor = 'gpuSingleBufferMax';
    }
  }
  const budgetBytes = gpuRequired ? memBudgets.gpuBudgetBytes : memBudgets.cpuBudgetBytes;
  if (budgetBytes > 0) {
    const maxCells = Math.floor((budgetBytes * memoryFraction) / (cellStrideBytes * buffersCount));
    const maxW = Math.floor(Math.sqrt(maxCells / aspect));
    if (maxW < widthCap) {
      widthCap = maxW;
      limitingFactor = gpuRequired ? 'gpuWorkingSetMax' : 'cpuMemoryMax';
    }
  }

  widthCap = Math.max(minWidth, widthCap);
  const targetWidth = spec.requestedWidth != null
    ? normalizeInt(spec.requestedWidth, baseWidth, minWidth, maxWidth)
    : roundToMultiple(baseWidth * Math.sqrt(perfScale), step);
  const width = clamp(roundToMultiple(targetWidth, step), minWidth, widthCap);
  const height = Math.max(1, roundToMultiple(width * aspect, step));
  const clamped = targetWidth > widthCap;
  if (clamped) reasons.push(`Clamped 2D grid width to ${width} by ${limitingFactor}`);

  return {
    schema: WORKLOAD_SIZING_SCHEMA,
    kind: 'grid2d',
    name: spec.name || 'grid2d',
    width,
    height,
    cellCount: width * height,
    clamped,
    limitingFactor: clamped ? limitingFactor : 'none',
    estimatedTotalBytes: width * height * cellStrideBytes * buffersCount,
    recommendedDpr: recommendPixelRatio(capabilities, benchmark, overrides),
    reasons
  };
}

/**
 * Select the highest fitting discrete quality preset from an ordered list (lowest -> highest).
 */
export function selectQualityPreset(spec = {}, { capabilities = {}, benchmark = null, overrides = null, budgets = null } = {}) {
  const presets = Array.isArray(spec.presets) ? spec.presets : [];
  if (!presets.length) {
    throw new TypeError('selectQualityPreset requires a non-empty presets array');
  }
  const perfScale = resolvePerformanceScale(capabilities, benchmark, overrides);
  const memBudgets = resolveMemoryBudgetsBytes(capabilities, benchmark, budgets);
  const gpuLimits = resolveGpuLimits(capabilities, budgets);
  const tierOrder = { mobile: 0, laptop: 1, workstation: 2, cluster: 3 };
  const classOrder = { software: 0, low: 1, mid: 2, high: 3, workstation: 4 };
  const currentTier = tierOrder[overrides?.tier || capabilities?.tier || 'laptop'] ?? 1;
  const currentClass = benchmark?.performanceClass != null ? (classOrder[benchmark.performanceClass] ?? 2) : null;

  let selected = presets[0];
  let selectedIndex = 0;
  const reasons = [];

  for (let i = 0; i < presets.length; i += 1) {
    const preset = presets[i];
    if (preset.minTier && (tierOrder[preset.minTier] ?? 0) > currentTier) continue;
    if (preset.minPerformanceClass && currentClass != null && (classOrder[preset.minPerformanceClass] ?? 0) > currentClass) continue;
    if (Number.isFinite(preset.minPerfScale) && perfScale < preset.minPerfScale) continue;
    if (preset.requireWebGPU && capabilities?.webgpu?.available !== true) continue;
    if (preset.requireWebGL2 && capabilities?.webgl && capabilities.webgl.webgl2 !== true) continue;
    if (Number.isFinite(preset.estimatedMemoryBytes) && memBudgets.cpuBudgetBytes > 0 && preset.estimatedMemoryBytes > memBudgets.cpuBudgetBytes) continue;
    if (Number.isFinite(preset.estimatedGpuBytes) && memBudgets.gpuBudgetBytes > 0 && preset.estimatedGpuBytes > memBudgets.gpuBudgetBytes) continue;
    if (Number.isFinite(preset.minBufferSizeBytes) && gpuLimits.singleBufferLimitBytes != null && preset.minBufferSizeBytes > gpuLimits.singleBufferLimitBytes) continue;
    if (Number.isFinite(preset.required3DTextureSize) && capabilities?.webgl?.max3DTextureSize && preset.required3DTextureSize > capabilities.webgl.max3DTextureSize) continue;
    selected = preset;
    selectedIndex = i;
  }

  if (selectedIndex < presets.length - 1) {
    reasons.push(`Selected preset "${selected.id || selectedIndex}" for perfScale=${perfScale.toFixed(2)}`);
  }

  return {
    schema: WORKLOAD_SIZING_SCHEMA,
    kind: 'preset',
    name: spec.name || 'preset',
    presetId: selected.id ?? String(selectedIndex),
    presetIndex: selectedIndex,
    preset: selected,
    perfScale: Number(perfScale.toFixed(3)),
    recommendedDpr: recommendPixelRatio(capabilities, benchmark, overrides),
    reasons
  };
}

/**
 * Unified declarative workload right-sizer.
 */
export function sizeWorkload(spec = {}, context = {}) {
  const kind = String(spec?.kind || 'count').trim().toLowerCase();
  if (kind === 'grid3d') return sizeGrid3dWorkload(spec, context);
  if (kind === 'grid2d') return sizeGrid2dWorkload(spec, context);
  if (kind === 'preset') return selectQualityPreset(spec, context);
  return sizeCountWorkload(spec, context);
}
