export {
  CAPABILITIES_SCHEMA,
  GPU_CAPABILITY_LIMIT_KEYS,
  detectBrowserEnvironment,
  readCapabilityOverrides,
  isSoftwareAdapterInfo,
  extractAdapterLimits,
  extractAdapterFeatures,
  probeWasmCapabilities,
  probeWebGLCapabilities,
  inferHardwareTier,
  defaultTierBudgets,
  computeHardwareFingerprint,
  probeCapabilities
} from './probeCapabilities.js';

export {
  MANAGED_GPU_DEVICE_SCHEMA,
  PROMOTED_GPU_LIMIT_KEYS,
  buildPromotedRequiredLimits,
  requestManagedGpuDevice
} from './managedGpuDevice.js';

export {
  CAPABILITY_BENCHMARK_TASK_SCHEMA,
  buildWasmBenchmarkBytes,
  runCpuMicrobenchmark,
  runWasmMicrobenchmark,
  runGpuMicrobenchmark,
  runCapabilityBenchmarkTask
} from './benchmarkTask.js';

export {
  CAPABILITY_BENCHMARK_SCHEMA,
  CAPABILITY_BENCHMARK_VERSION,
  createCapabilityBenchmarkCache,
  classifyPerformance,
  benchmarkCapabilities
} from './capabilityBenchmark.js';

export {
  WORKLOAD_SIZING_SCHEMA,
  recommendPixelRatio,
  sizeCountWorkload,
  sizeGrid3dWorkload,
  sizeGrid2dWorkload,
  selectQualityPreset,
  sizeWorkload
} from './workloadSizer.js';

export {
  RUNTIME_BUDGET_GOVERNOR_SCHEMA,
  RuntimeBudgetGovernor,
  createRuntimeBudgetGovernor
} from './runtimeBudgetGovernor.js';
