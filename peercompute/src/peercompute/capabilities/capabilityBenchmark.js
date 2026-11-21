import { probeCapabilities } from './probeCapabilities.js';
import { runCapabilityBenchmarkTask } from './benchmarkTask.js';

export const CAPABILITY_BENCHMARK_SCHEMA = 'peercompute.capabilities.benchmark.v1';
export const CAPABILITY_BENCHMARK_VERSION = 1;

// Reference baselines representing a nominal mid-range laptop = 1.0.
const BASELINE_CPU_SINGLE_MOPS = 120;
const BASELINE_CPU_MULTI_MOPS = 480;
const BASELINE_WASM_MOPS = 300;
const BASELINE_GPU_GFLOPS = 1500;
const BASELINE_GPU_BANDWIDTH_GBPS = 60;

const DEFAULT_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_CACHE_PREFIX = 'peercompute:cap-bench:v1:';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

function defaultStorage() {
  try {
    if (typeof globalThis.localStorage !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
  } catch {
    // Storage access blocked (e.g. sandboxed iframe or privacy mode).
  }
  return null;
}

export function createCapabilityBenchmarkCache({
  storage = undefined,
  prefix = DEFAULT_CACHE_PREFIX,
  ttlMs = DEFAULT_CACHE_TTL_MS,
  now = () => Date.now()
} = {}) {
  const backing = storage === undefined ? defaultStorage() : storage;
  const memory = new Map();

  const keyFor = (fingerprint) => `${prefix}${fingerprint}`;

  return {
    get(fingerprint) {
      if (!fingerprint) return null;
      const key = keyFor(fingerprint);
      let raw = memory.get(key) ?? null;
      if (!raw && backing && typeof backing.getItem === 'function') {
        try {
          const text = backing.getItem(key);
          if (text) raw = JSON.parse(text);
        } catch {
          raw = null;
        }
      }
      if (!raw || typeof raw !== 'object') return null;
      if (raw.schema !== CAPABILITY_BENCHMARK_SCHEMA || raw.benchmarkVersion !== CAPABILITY_BENCHMARK_VERSION) {
        return null;
      }
      if (raw.hardwareFingerprint !== fingerprint) return null;
      if (!Number.isFinite(raw.measuredAt) || now() - raw.measuredAt > ttlMs || raw.measuredAt - now() > 60_000) {
        this.delete(fingerprint);
        return null;
      }
      memory.set(key, raw);
      return structuredClone(raw);
    },
    set(fingerprint, record) {
      if (!fingerprint || !record) return;
      const key = keyFor(fingerprint);
      const copy = structuredClone(record);
      memory.set(key, copy);
      if (backing && typeof backing.setItem === 'function') {
        try {
          backing.setItem(key, JSON.stringify(copy));
        } catch {
          // Ignore storage quota / privacy failures; memory cache still works.
        }
      }
    },
    delete(fingerprint) {
      if (!fingerprint) return;
      const key = keyFor(fingerprint);
      memory.delete(key);
      if (backing && typeof backing.removeItem === 'function') {
        try {
          backing.removeItem(key);
        } catch {
          // Ignore storage failures.
        }
      }
    },
    clear() {
      memory.clear();
    }
  };
}

/**
 * Derive normalized compute scores, performance class, and honest advisory
 * working-set guidance from observed static capabilities + microbenchmark results.
 * Never claims physical VRAM was measured in a browser.
 */
export function classifyPerformance(metrics = {}, capabilities = {}) {
  const cpuSingleMops = Number.isFinite(metrics.cpu?.mopsPerSec) ? metrics.cpu.mopsPerSec : null;
  const cpuMultiMops = Number.isFinite(metrics.multiWorker?.totalMopsPerSec)
    ? metrics.multiWorker.totalMopsPerSec
    : (cpuSingleMops != null ? cpuSingleMops * Math.max(1, Math.min(4, capabilities.cpu?.cores ?? 1)) * 0.7 : null);
  const wasmMops = metrics.wasm?.ok && Number.isFinite(metrics.wasm.mopsPerSec) ? metrics.wasm.mopsPerSec : null;
  const gpuOk = metrics.gpu?.ok === true;
  const gpuGflops = gpuOk && Number.isFinite(metrics.gpu.computeGflopsProxy) ? metrics.gpu.computeGflopsProxy : null;
  const gpuBw = gpuOk && Number.isFinite(metrics.gpu.memoryBandwidthGBps) ? metrics.gpu.memoryBandwidthGBps : null;

  const cpuScore = cpuSingleMops != null
    ? round(clamp(0.4 * (cpuSingleMops / BASELINE_CPU_SINGLE_MOPS) + 0.6 * ((cpuMultiMops ?? cpuSingleMops) / BASELINE_CPU_MULTI_MOPS), 0.05, 16))
    : null;
  const wasmScore = wasmMops != null ? round(clamp(wasmMops / BASELINE_WASM_MOPS, 0.05, 16)) : null;
  const gpuComputeScore = gpuGflops != null ? round(clamp(gpuGflops / BASELINE_GPU_GFLOPS, 0.02, 32)) : null;
  const gpuBandwidthScore = gpuBw != null ? round(clamp(gpuBw / BASELINE_GPU_BANDWIDTH_GBPS, 0.02, 32)) : null;
  const gpuScore = gpuComputeScore != null && gpuBandwidthScore != null
    ? round(clamp(0.45 * gpuComputeScore + 0.55 * gpuBandwidthScore, 0.02, 32))
    : (gpuComputeScore ?? gpuBandwidthScore);

  let overallScore;
  if (gpuScore != null && cpuScore != null) {
    overallScore = round(0.65 * gpuScore + 0.35 * cpuScore);
  } else {
    overallScore = round(gpuScore ?? cpuScore ?? wasmScore ?? 0.5);
  }

  let performanceClass = 'mid';
  if (gpuOk && metrics.gpu?.isFallbackAdapter) {
    performanceClass = 'software';
  } else if (!gpuOk && capabilities.webgpu?.status === 'fallback-only') {
    performanceClass = 'software';
  } else if (gpuOk) {
    if (gpuScore >= 3.0 && (gpuBw == null || gpuBw >= 180)) {
      performanceClass = 'workstation';
    } else if (gpuScore >= 1.35 && (gpuBw == null || gpuBw >= 85)) {
      performanceClass = 'high';
    } else if (gpuScore >= 0.55) {
      performanceClass = 'mid';
    } else {
      performanceClass = 'low';
    }
  } else if (cpuScore != null) {
    if (cpuScore >= 2.5) performanceClass = 'workstation';
    else if (cpuScore >= 1.35) performanceClass = 'high';
    else if (cpuScore >= 0.6) performanceClass = 'mid';
    else performanceClass = 'low';
  }

  const maxBufferMB = capabilities.webgpu?.limits?.maxBufferSize
    ? Math.floor(capabilities.webgpu.limits.maxBufferSize / (1024 * 1024))
    : null;
  const workingSetByClass = {
    software: { cpuBudgetMB: 256, gpuBudgetMB: 64 },
    low: { cpuBudgetMB: 384, gpuBudgetMB: 160 },
    mid: { cpuBudgetMB: 1024, gpuBudgetMB: 512 },
    high: { cpuBudgetMB: 2048, gpuBudgetMB: 1536 },
    workstation: { cpuBudgetMB: 4096, gpuBudgetMB: 3072 }
  };
  const baseWorkingSet = workingSetByClass[performanceClass] || workingSetByClass.mid;
  const rawCpuBudgetMB = capabilities.memory?.deviceMemoryGiB != null && capabilities.memory.deviceMemoryGiB <= 4
    ? Math.min(baseWorkingSet.cpuBudgetMB, Math.floor(capabilities.memory.deviceMemoryGiB * 1024 * 0.25))
    : baseWorkingSet.cpuBudgetMB;
  const rawGpuBudgetMB = gpuOk
    ? (maxBufferMB != null ? Math.min(baseWorkingSet.gpuBudgetMB, Math.max(64, maxBufferMB)) : baseWorkingSet.gpuBudgetMB)
    : 0;

  const cores = capabilities.cpu?.cores ?? 4;
  let recommendedWorkerCount = Math.max(1, Math.min(cores, 8));
  if (Number.isFinite(metrics.multiWorker?.scalingEfficiency)) {
    // Avoid spawning workers past diminishing scaling returns.
    if (metrics.multiWorker.scalingEfficiency < 0.45) {
      recommendedWorkerCount = Math.max(1, Math.min(cores, Math.ceil(metrics.multiWorker.workerCount * 0.5)));
    } else if (performanceClass === 'workstation') {
      recommendedWorkerCount = Math.min(16, Math.max(4, cores));
    } else if (performanceClass === 'low' || performanceClass === 'software') {
      recommendedWorkerCount = Math.min(2, Math.max(1, Math.floor(cores / 2)));
    }
  } else if (performanceClass === 'low' || performanceClass === 'software') {
    recommendedWorkerCount = Math.min(2, cores);
  } else if (performanceClass === 'workstation') {
    recommendedWorkerCount = Math.min(16, Math.max(4, cores));
  }

  return {
    scores: {
      cpuScore,
      wasmScore,
      gpuComputeScore,
      gpuBandwidthScore,
      gpuScore,
      overallScore
    },
    performanceClass,
    recommendedWorkerCount,
    workingSetGuidance: {
      cpuBudgetMB: Math.max(128, rawCpuBudgetMB),
      gpuBudgetMB: Math.max(0, rawGpuBudgetMB),
      provenance: 'benchmark-heuristic-not-measured-vram'
    }
  };
}

function withTimeout(promise, timeoutMs, controller) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error('Capability benchmark timed out');
        err.code = 'ERR_CAPABILITY_BENCHMARK_TIMEOUT';
        controller?.abort(err);
        reject(err);
      }, timeoutMs);
    })
  ]).finally(() => clearTimeout(timer));
}

/**
 * Run a fast, bounded, cached CPU/WASM/WebGPU microbenchmark suite.
 * Uses ComputeManager managed workers when supplied (including multi-worker CPU scaling),
 * falling back cleanly to inline execution in Node or non-worker environments.
 */
export async function benchmarkCapabilities({
  capabilities = null,
  computeManager = null,
  scope = globalThis,
  suites = ['cpu', 'wasm', 'gpu'],
  cache = null,
  force = false,
  allowFallback = false,
  maxBenchmarkWorkers = 4,
  timeoutMs = 8000,
  signal = null,
  onProgress = null
} = {}) {
  signal?.throwIfAborted();
  const caps = capabilities || await probeCapabilities({ scope, allowFallback });
  const cacheStore = cache === false ? null : (cache || createCapabilityBenchmarkCache());

  if (!force && cacheStore) {
    const cached = cacheStore.get(caps.hardwareFingerprint);
    if (cached) {
      return { ...cached, fromCache: true };
    }
  }

  const controller = new AbortController();
  const onAbort = () => controller.abort(signal.reason);
  signal?.addEventListener('abort', onAbort, { once: true });

  const runWorkerOrInline = async (taskData) => {
    if (computeManager && typeof computeManager.submitTask === 'function') {
      return computeManager.submitTask({
        module: 'peercompute:capability-benchmark',
        exportName: 'runCapabilityBenchmarkTask',
        data: taskData,
        signal: controller.signal,
        onProgress
      });
    }
    return runCapabilityBenchmarkTask(taskData, {
      signal: controller.signal,
      emitProgress: onProgress
    });
  };

  const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
  try {
    const primary = await withTimeout(
      runWorkerOrInline({
        mode: 'all',
        suites,
        allowFallback
      }),
      timeoutMs,
      controller
    );

    // Optional multi-worker CPU scaling probe when ComputeManager has real workers available.
    let multiWorker = null;
    const availableWorkers = computeManager?.getCapabilities?.()?.workers ?? 0;
    const shardCount = Math.min(
      Math.max(0, Math.floor(maxBenchmarkWorkers)),
      Math.max(0, caps.cpu?.cores ?? 1),
      availableWorkers
    );
    if (suites.includes('cpu') && shardCount >= 2 && primary?.cpu?.ok && computeManager) {
      const mwStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const shards = await withTimeout(
        Promise.all(
          Array.from({ length: shardCount }, () => computeManager.submitTask({
            module: 'peercompute:capability-benchmark',
            exportName: 'runCapabilityBenchmarkTask',
            data: { mode: 'cpu-shard', targetMs: 18, maxMs: 90 },
            signal: controller.signal
          }))
        ),
        Math.max(1000, timeoutMs - 200),
        controller
      );
      const mwWallMs = Math.max(0.1, (typeof performance !== 'undefined' ? performance.now() : Date.now()) - mwStart);
      const totalOps = shards.reduce((sum, entry) => sum + (entry?.cpu?.ops ?? 0), 0);
      const totalMopsPerSec = round((totalOps / (mwWallMs / 1000)) / 1e6, 2);
      const singleMops = Math.max(0.01, primary.cpu.mopsPerSec);
      const speedup = round(totalMopsPerSec / singleMops, 3);
      multiWorker = {
        ok: true,
        workerCount: shardCount,
        wallMs: round(mwWallMs, 3),
        totalMopsPerSec,
        effectiveParallelSpeedup: speedup,
        scalingEfficiency: round(clamp(speedup / shardCount, 0, 2), 3)
      };
    }

    const metrics = {
      cpu: primary?.cpu ?? null,
      multiWorker,
      wasm: primary?.wasm ?? null,
      gpu: primary?.gpu ?? null
    };
    const classification = classifyPerformance(metrics, caps);
    const totalDurationMs = round(
      Math.max(0, (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt),
      3
    );

    const record = {
      schema: CAPABILITY_BENCHMARK_SCHEMA,
      benchmarkVersion: CAPABILITY_BENCHMARK_VERSION,
      hardwareFingerprint: caps.hardwareFingerprint,
      measuredAt: Date.now(),
      durationMs: totalDurationMs,
      executedInWorker: Boolean(primary?.workerId),
      suites: [...suites],
      metrics,
      ...classification,
      fromCache: false
    };

    cacheStore?.set(caps.hardwareFingerprint, record);
    return record;
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
}
