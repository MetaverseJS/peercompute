import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAPABILITIES_SCHEMA,
  CAPABILITY_BENCHMARK_SCHEMA,
  MANAGED_GPU_DEVICE_SCHEMA,
  RUNTIME_BUDGET_GOVERNOR_SCHEMA,
  WORKLOAD_SIZING_SCHEMA,
  probeCapabilities,
  detectBrowserEnvironment,
  readCapabilityOverrides,
  isSoftwareAdapterInfo,
  computeHardwareFingerprint,
  buildPromotedRequiredLimits,
  requestManagedGpuDevice,
  buildWasmBenchmarkBytes,
  runCpuMicrobenchmark,
  runWasmMicrobenchmark,
  runGpuMicrobenchmark,
  createCapabilityBenchmarkCache,
  classifyPerformance,
  benchmarkCapabilities,
  sizeWorkload,
  recommendPixelRatio,
  createRuntimeBudgetGovernor,
  ComputeManager,
  GPUHubManager,
  NodeKernel,
  evaluatePlacementAdmission
} from '../../src/peercompute/index.js';

function createMockGpuScope({
  features = ['shader-f16', 'timestamp-query'],
  limits = {
    maxBufferSize: 1024 * 1024 * 1024,
    maxStorageBufferBindingSize: 512 * 1024 * 1024,
    maxComputeWorkgroupStorageSize: 32768,
    maxComputeInvocationsPerWorkgroup: 512,
    maxComputeWorkgroupSizeX: 512,
    maxComputeWorkgroupSizeY: 512,
    maxComputeWorkgroupSizeZ: 64,
    maxComputeWorkgroupsPerDimension: 65535,
    maxStorageBuffersPerShaderStage: 10,
    maxTextureDimension2D: 16384,
    maxTextureDimension3D: 2048,
    maxTextureArrayLayers: 2048
  },
  info = { vendor: 'nvidia', architecture: 'ada', device: 'rtx', description: 'Mock RTX' },
  isFallbackAdapter = false,
  rejectPromotedLimits = false,
  timestampDiffNs = { compute: 250_000n, bandwidth: 400_000n },
  validationError = null
} = {}) {
  const destroyedResources = [];
  const requestedDescriptors = [];
  let deviceDestroyed = false;
  let resolveLost;
  const lostPromise = new Promise((resolve) => { resolveLost = resolve; });

  const makeDevice = (descriptor) => {
    const activeLimits = descriptor?.requiredLimits
      ? { ...limits, ...descriptor.requiredLimits }
      : { maxBufferSize: 256 * 1024 * 1024, maxStorageBufferBindingSize: 128 * 1024 * 1024, maxComputeWorkgroupsPerDimension: 65535 };
    const activeFeatures = new Set(descriptor?.requiredFeatures || []);
    return {
      features: activeFeatures,
      limits: activeLimits,
      lost: lostPromise,
      pushErrorScope() {},
      async popErrorScope() { return validationError; },
      createShaderModule({ label }) {
        return { label, async getCompilationInfo() { return { messages: [] }; } };
      },
      async createComputePipelineAsync() {
        return { getBindGroupLayout() { return {}; } };
      },
      createBindGroup() { return {}; },
      createBuffer({ size, usage }) {
        const isQueryRead = size === 32 && (usage & 1);
        const buf = {
          size,
          usage,
          destroyed: false,
          async mapAsync() {},
          getMappedRange(offset = 0, length = size) {
            if (isQueryRead) {
              const stamps = new BigInt64Array(4);
              stamps[0] = 1_000_000n;
              stamps[1] = 1_000_000n + timestampDiffNs.compute;
              stamps[2] = 2_000_000n;
              stamps[3] = 2_000_000n + timestampDiffNs.bandwidth;
              return stamps.buffer;
            }
            const floats = new Float32Array(Math.max(4, Math.floor((length || 16) / 4)));
            floats.fill(1.5);
            return floats.buffer.slice(offset, offset + (length || 16));
          },
          unmap() {},
          destroy() {
            this.destroyed = true;
            destroyedResources.push(this);
          }
        };
        return buf;
      },
      createQuerySet({ count }) {
        const qs = {
          count,
          destroyed: false,
          destroy() {
            this.destroyed = true;
            destroyedResources.push(this);
          }
        };
        return qs;
      },
      createCommandEncoder() {
        return {
          beginComputePass() {
            return { setPipeline() {}, setBindGroup() {}, dispatchWorkgroups() {}, end() {} };
          },
          resolveQuerySet() {},
          copyBufferToBuffer() {},
          finish() { return {}; }
        };
      },
      queue: {
        writeBuffer() {},
        submit() {},
        async onSubmittedWorkDone() {}
      },
      destroy() {
        deviceDestroyed = true;
      },
      addEventListener() {}
    };
  };

  const adapter = {
    features: new Set(features),
    limits,
    info,
    isFallbackAdapter,
    async requestDevice(descriptor) {
      requestedDescriptors.push(descriptor);
      if (rejectPromotedLimits && descriptor?.requiredLimits) {
        throw new Error('Strict driver rejected promoted limits');
      }
      return makeDevice(descriptor);
    }
  };

  const scope = {
    navigator: {
      hardwareConcurrency: 16,
      deviceMemory: 8,
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
      gpu: {
        async requestAdapter() {
          return adapter;
        }
      }
    },
    devicePixelRatio: 2,
    crossOriginIsolated: true,
    SharedArrayBuffer: globalThis.SharedArrayBuffer,
    WebAssembly: globalThis.WebAssembly,
    performance: {
      now: () => performance.now(),
      memory: { jsHeapSizeLimit: 4294967296, usedJSHeapSize: 134217728 }
    }
  };

  return {
    scope,
    adapter,
    requestedDescriptors,
    destroyedResources,
    isDeviceDestroyed: () => deviceDestroyed,
    triggerLoss: (reason = 'destroyed') => resolveLost({ reason, message: 'mock loss' })
  };
}

test('probeCapabilities returns honest hardware provenance, WASM SIMD, and deterministic fingerprint', async () => {
  const { scope } = createMockGpuScope();
  const caps1 = await probeCapabilities({ scope, timeoutMs: 1000 });
  const caps2 = await probeCapabilities({ scope, timeoutMs: 1000 });

  assert.equal(caps1.schema, CAPABILITIES_SCHEMA);
  assert.equal(caps1.cpu.cores, 16);
  assert.equal(caps1.memory.deviceMemoryGiB, 8);
  assert.equal(caps1.memory.provenance.deviceMemory, 'coarse-browser-hint-capped-8gib');
  assert.equal(caps1.memory.provenance.vram, 'unavailable-in-browser');
  assert.equal(caps1.memory.physicalVramBytes, null);
  assert.equal(caps1.webgpu.status, 'hardware');
  assert.equal(caps1.webgpu.available, true);
  assert.equal(caps1.webgpu.isFallbackAdapter, false);
  assert.equal(caps1.webgpu.limits.maxBufferSize, 1024 * 1024 * 1024);
  assert.equal(caps1.wasm.supported, true);
  assert.equal(caps1.wasm.simd, true);
  assert.equal(caps1.tier, 'workstation');
  assert.equal(caps1.hardwareFingerprint, caps2.hardwareFingerprint);
  assert.equal(caps1.hardwareFingerprint, computeHardwareFingerprint(caps1));
});

test('probeCapabilities honors cold-Dawn retry, rejects fallback adapters by default, and supports native metrics', async () => {
  let calls = 0;
  const mock = createMockGpuScope();
  mock.scope.navigator.gpu.requestAdapter = async () => {
    calls += 1;
    return calls === 1 ? null : mock.adapter;
  };
  const retried = await probeCapabilities({
    scope: mock.scope,
    timeoutMs: 1000,
    nativeMetrics: { physicalRamBytes: 64 * 1024 ** 3, physicalVramBytes: 24 * 1024 ** 3 }
  });
  assert.equal(calls, 2);
  assert.equal(retried.webgpu.available, true);
  assert.equal(retried.memory.provenance.vram, 'native-driver-sampler');
  assert.equal(retried.memory.physicalVramBytes, 24 * 1024 ** 3);

  const fallbackMock = createMockGpuScope({
    isFallbackAdapter: true,
    info: { vendor: 'google', architecture: 'swiftshader', description: 'SwiftShader' }
  });
  assert.equal(isSoftwareAdapterInfo(fallbackMock.adapter), true);
  const blockedFallback = await probeCapabilities({ scope: fallbackMock.scope, allowFallback: false });
  assert.equal(blockedFallback.webgpu.status, 'fallback-only');
  assert.equal(blockedFallback.webgpu.available, false);

  const allowedFallback = await probeCapabilities({ scope: fallbackMock.scope, allowFallback: true });
  assert.equal(allowedFallback.webgpu.status, 'fallback');
  assert.equal(allowedFallback.webgpu.available, true);
  assert.equal(allowedFallback.webgpu.isFallbackAdapter, true);
});

test('probeCapabilities timeout returns unknown (null) and never inspects late adapters', async () => {
  let lateRead = false;
  let resolveLate;
  const scope = {
    navigator: {
      gpu: {
        requestAdapter: () => new Promise((resolve) => { resolveLate = resolve; })
      }
    }
  };
  await assert.rejects(probeCapabilities({ scope, timeoutMs: Infinity }), /timeout/i);
  const timed = await probeCapabilities({ scope, timeoutMs: 25 });
  assert.equal(timed.webgpu.status, 'timeout');
  assert.equal(timed.webgpu.available, null);
  resolveLate({
    get features() { lateRead = true; return new Set(); },
    get limits() { lateRead = true; return {}; }
  });
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(lateRead, false);
});

test('detectBrowserEnvironment and readCapabilityOverrides parse browser, OS, and URL overrides safely', () => {
  const env = detectBrowserEnvironment({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15'
  });
  assert.equal(env.browser, 'safari');
  assert.equal(env.os, 'macos');

  const overrides = readCapabilityOverrides('?computeTier=mobile&budgetScale=0.5&dprCap=1.5&skipBenchmark=1&cpuCores=2');
  assert.equal(overrides.tier, 'mobile');
  assert.equal(overrides.budgetScale, 0.5);
  assert.equal(overrides.dprCap, 1.5);
  assert.equal(overrides.skipBenchmark, true);
  assert.equal(overrides.cpuCores, 2);
});

test('requestManagedGpuDevice promotes adapter limits, negotiates optional features, handles fallback & strict drivers', async () => {
  const mock = createMockGpuScope();
  let lostInfoSeen = null;
  const managed = await requestManagedGpuDevice({
    scope: mock.scope,
    optionalFeatures: ['timestamp-query', 'nonexistent-feature'],
    limitCeilings: { maxBufferSize: 512 * 1024 * 1024 },
    onDeviceLost: (info) => { lostInfoSeen = info; }
  });
  assert.equal(managed.schema, MANAGED_GPU_DEVICE_SCHEMA);
  assert.equal(managed.hasTimestampQuery, true);
  assert.equal(managed.limits.maxBufferSize, 512 * 1024 * 1024);
  assert.equal(managed.limits.maxStorageBufferBindingSize, 512 * 1024 * 1024);
  assert.deepEqual(mock.requestedDescriptors[0].requiredFeatures, ['timestamp-query']);

  mock.triggerLoss('destroyed');
  await new Promise((r) => setTimeout(r, 5));
  assert.equal(lostInfoSeen?.reason, 'destroyed');

  // Required feature missing fails closed
  await assert.rejects(
    requestManagedGpuDevice({ scope: mock.scope, requiredFeatures: ['missing-feature'] }),
    (err) => err.code === 'ERR_GPU_FEATURE_UNAVAILABLE'
  );

  // Strict driver fallback drops promoted limits cleanly
  const strict = createMockGpuScope({ rejectPromotedLimits: true });
  const recovered = await requestManagedGpuDevice({ scope: strict.scope });
  assert.equal(strict.requestedDescriptors.length, 2);
  assert.ok(strict.requestedDescriptors[0].requiredLimits);
  assert.equal(strict.requestedDescriptors[1].requiredLimits, undefined);
  assert.ok(recovered.device);

  // buildPromotedRequiredLimits clamps extra limits to adapter max
  const promoted = buildPromotedRequiredLimits({ maxBufferSize: 256 }, { extraLimits: { maxBufferSize: 1024 } });
  assert.equal(promoted.maxBufferSize, 256);
});

test('CPU, self-contained WASM, and mocked WebGPU microbenchmarks execute, verify output, and clean up all GPU resources', async () => {
  const wasmBytes = buildWasmBenchmarkBytes();
  assert.equal(WebAssembly.validate(wasmBytes), true);

  const cpu = runCpuMicrobenchmark({ targetMs: 12, maxMs: 80 });
  assert.equal(cpu.ok, true);
  assert.ok(cpu.mopsPerSec > 0);

  const wasm = await runWasmMicrobenchmark({ targetMs: 12, maxMs: 80 });
  assert.equal(wasm.ok, true);
  assert.equal(wasm.supported, true);
  assert.ok(wasm.mopsPerSec > 0);

  const mock = createMockGpuScope();
  const gpu = await runGpuMicrobenchmark({ scope: mock.scope });
  assert.equal(gpu.ok, true);
  assert.equal(gpu.timingMethod, 'timestamp-query');
  assert.ok(gpu.computeGflopsProxy > 0);
  assert.ok(gpu.memoryBandwidthGBps > 0);
  assert.ok(gpu.readbackLatencyMs > 0);
  assert.equal(gpu.verified, true);
  assert.ok(mock.destroyedResources.length >= 6);
  assert.equal(mock.isDeviceDestroyed(), true);

  // Cleanup still runs when validation error occurs
  const badMock = createMockGpuScope({ validationError: { message: 'mock validation fault' } });
  const failedGpu = await runGpuMicrobenchmark({ scope: badMock.scope });
  assert.equal(failedGpu.ok, false);
  assert.match(failedGpu.reason, /validation error/i);
  assert.equal(badMock.isDeviceDestroyed(), true);
});

test('benchmarkCapabilities caches by hardware fingerprint, respects TTL & force, and integrates with ComputeManager', async () => {
  const backingMap = new Map();
  const storage = {
    getItem: (k) => backingMap.get(k) ?? null,
    setItem: (k, v) => backingMap.set(k, v),
    removeItem: (k) => backingMap.delete(k)
  };
  let now = Date.now();
  const cache = createCapabilityBenchmarkCache({ storage, ttlMs: 5000, now: () => now });
  const manager = new ComputeManager({ enableWorkers: false });

  const first = await manager.benchmarkCapabilities({ suites: ['cpu', 'wasm'], cache });
  assert.equal(first.schema, CAPABILITY_BENCHMARK_SCHEMA);
  assert.equal(first.fromCache, false);
  assert.ok(first.metrics.cpu.ok);
  assert.ok(first.metrics.wasm.ok);
  assert.equal(first.workingSetGuidance.provenance, 'benchmark-heuristic-not-measured-vram');

  const second = await manager.benchmarkCapabilities({ suites: ['cpu', 'wasm'], cache });
  assert.equal(second.fromCache, true);
  assert.equal(second.hardwareFingerprint, first.hardwareFingerprint);

  // Expire TTL -> re-measure
  now += 10_000;
  const expired = await manager.benchmarkCapabilities({ suites: ['cpu', 'wasm'], cache });
  assert.equal(expired.fromCache, false);

  // Forced re-run bypasses cache
  const forced = await manager.benchmarkCapabilities({ suites: ['cpu', 'wasm'], cache, force: true });
  assert.equal(forced.fromCache, false);

  // Performance classification distinguishes software vs workstation
  const softwareClass = classifyPerformance(
    { cpu: { mopsPerSec: 80 }, gpu: { ok: true, isFallbackAdapter: true, computeGflopsProxy: 50, memoryBandwidthGBps: 5 } },
    { cpu: { cores: 8 }, webgpu: { limits: { maxBufferSize: 256 * 1024 * 1024 } } }
  );
  assert.equal(softwareClass.performanceClass, 'software');

  const workstationClass = classifyPerformance(
    { cpu: { mopsPerSec: 320 }, gpu: { ok: true, isFallbackAdapter: false, computeGflopsProxy: 12000, memoryBandwidthGBps: 450 } },
    { cpu: { cores: 16 }, webgpu: { limits: { maxBufferSize: 2 * 1024 * 1024 * 1024 } } }
  );
  assert.equal(workstationClass.performanceClass, 'workstation');
  assert.ok(workstationClass.scores.gpuScore >= 3.0);
});

test('sizeWorkload enforces GPU single-buffer, 1D dispatch, O(N^2) TDR, 3D texture, and preset ceilings', () => {
  const mobileCaps = {
    tier: 'mobile',
    display: { devicePixelRatio: 3 },
    webgpu: {
      available: true,
      limits: {
        maxBufferSize: 128 * 1024 * 1024,
        maxStorageBufferBindingSize: 64 * 1024 * 1024,
        maxComputeWorkgroupsPerDimension: 65535
      }
    },
    webgl: { webgl2: true, max3DTextureSize: 128 },
    planningBudgets: { memoryBudgetMB: 384, gpuMemoryBudgetMB: 192 }
  };

  // O(N^2) safety cap prevents GPU TDR (e.g. PPF cubic barrier)
  const quadratic = sizeWorkload({
    kind: 'count',
    name: 'ppf-particles',
    baseCount: 4000,
    minCount: 256,
    maxCount: 200_000,
    requestedCount: 200_000,
    complexity: 'O(N^2)',
    quadraticBaseCap: 2048
  }, { capabilities: mobileCaps });
  assert.equal(quadratic.schema, WORKLOAD_SIZING_SCHEMA);
  assert.equal(quadratic.clamped, true);
  assert.equal(quadratic.limitingFactor, 'complexityMax');
  assert.ok(quadratic.count <= 2048);

  // 1D dispatch ceiling enforced on MPM-like 3D grid
  const mpmGrid = sizeWorkload({
    kind: 'grid3d',
    name: 'mpm-grid',
    baseDim: [128, 128, 128],
    requestedDim: [256, 256, 256],
    minDim: [16, 16, 16],
    maxDim: [256, 256, 256],
    step: 8,
    cellStrideBytes: 32,
    workgroupSize: 64,
    dispatchDimensions: 1
  }, { capabilities: mobileCaps });
  assert.equal(mpmGrid.clamped, true);
  assert.ok(mpmGrid.cellCount <= 65535 * 64);
  assert.ok(mpmGrid.estimatedSingleBufferBytes <= 64 * 1024 * 1024);

  // WebGL 3D texture cap enforced (e.g. Universes density texture)
  const densityTex = sizeWorkload({
    kind: 'grid3d',
    name: 'universe-density',
    requestedDim: [207, 207, 207],
    minDim: [32, 32, 32],
    maxDim: [256, 256, 256],
    cellStrideBytes: 4,
    webgl3dTexture: true
  }, { capabilities: mobileCaps });
  assert.ok(densityTex.x <= 128 && densityTex.y <= 128 && densityTex.z <= 128);

  // Preset selection picks mobile-safe preset
  const presetChoice = sizeWorkload({
    kind: 'preset',
    presets: [
      { id: 'LOW', minTier: 'mobile', required3DTextureSize: 96 },
      { id: 'MED', minTier: 'laptop', required3DTextureSize: 128 },
      { id: 'HIGH', minTier: 'workstation', required3DTextureSize: 207 }
    ]
  }, { capabilities: mobileCaps });
  assert.equal(presetChoice.presetId, 'LOW');
  assert.equal(recommendPixelRatio(mobileCaps), 1.5);
});

test('RuntimeBudgetGovernor supports continuous scale and discrete levels with hysteresis, cooldowns, and hold', () => {
  const changes = [];
  const gov = createRuntimeBudgetGovernor({
    targetFrameMs: 16.7,
    highFrameMs: 22,
    lowFrameMs: 11,
    sampleAlpha: 0.5,
    downDelayMs: 100,
    upDelayMs: 200,
    cooldownDownMs: 100,
    cooldownUpMs: 100,
    levels: ['LOW', 'MED', 'HIGH'],
    initialLevelIndex: 2,
    onChange: (status) => changes.push(status.level)
  });

  // Sustained slow frames trigger scale-down from HIGH -> MED
  for (let i = 0; i < 6; i += 1) {
    gov.update({ frameMs: 36, dtMs: 35 });
  }
  assert.equal(gov.getStatus().schema, RUNTIME_BUDGET_GOVERNOR_SCHEMA);
  assert.equal(gov.getStatus().level, 'MED');
  assert.deepEqual(changes, ['MED']);

  // Manual hold suppresses adjustments while active
  gov.hold(200, 'user-slider');
  for (let i = 0; i < 5; i += 1) {
    gov.update({ frameMs: 40, dtMs: 30 });
  }
  assert.equal(gov.getStatus().level, 'MED');
  assert.equal(gov.getStatus().holdActive, true);

  // Continuous governor reacts to JS heap pressure
  const cont = createRuntimeBudgetGovernor({
    sampleAlpha: 1,
    downDelayMs: 50,
    cooldownDownMs: 50,
    minScale: 0.25,
    maxScale: 1.0,
    initialScale: 1.0,
    stepDownFactor: 0.75
  });
  cont.update({ frameMs: 12, dtMs: 60, heapUsedBytes: 900, heapLimitBytes: 1000 });
  assert.equal(cont.getStatus().scale, 0.75);
  assert.equal(cont.getStatus().lastReason, 'memory-pressure');
});

test('GPUHubManager promotes limits via requestManagedGpuDevice and clears device on loss', async (t) => {
  const origNav = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const mock = createMockGpuScope();
  Object.defineProperty(globalThis, 'navigator', { value: mock.scope.navigator, configurable: true });
  t.after(() => {
    if (origNav) Object.defineProperty(globalThis, 'navigator', origNav);
    else delete globalThis.navigator;
  });

  const hub = new GPUHubManager();
  const device = await hub.initialize({ label: 'unit-gpu-hub' });
  assert.ok(device);
  assert.equal(hub.getLimits().maxBufferSize, 1024 * 1024 * 1024);
  assert.equal(hub.getDeviceInfo().vendor, 'nvidia');
  assert.ok(hub.getFeatures().includes('timestamp-query'));

  mock.triggerLoss('destroyed');
  await new Promise((r) => setTimeout(r, 5));
  assert.equal(hub.device, null);
  assert.equal(hub.lastDeviceLoss?.reason, 'destroyed');
});

test('NodeKernel exposes capabilities & benchmark telemetry in presence and PlacementAdmissionPolicy filters by hardware', async (t) => {
  const origNav = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const mock = createMockGpuScope();
  Object.defineProperty(globalThis, 'navigator', { value: mock.scope.navigator, configurable: true });
  t.after(() => {
    if (origNav) Object.defineProperty(globalThis, 'navigator', origNav);
    else delete globalThis.navigator;
  });

  const node = new NodeKernel({
    enableWorkers: false,
    enableNetVizDebugTelemetry: false,
    enableNetVizSessionBroadcast: false,
    enableNetVizSessionDiscovery: false,
    disableStateNetworkProvider: true,
    disableStateBroadcast: true,
    enablePersistence: false
  });
  t.after(() => node.stop().catch(() => {}));
  await node.initialize();

  const caps = await node.probeCapabilities();
  assert.equal(caps.webgpu.available, true);
  const bench = await node.benchmarkCapabilities({ suites: ['cpu', 'wasm', 'gpu'], cache: false });
  assert.equal(bench.metrics.gpu.ok, true);

  const presence = node._buildPresenceCapabilities();
  assert.equal(presence.compute.gpuHardwareVerified, true);
  assert.equal(presence.compute.isFallbackAdapter, false);
  assert.equal(presence.compute.gpuVendor, 'nvidia');
  assert.ok(presence.compute.gpuFeatures.includes('shader-f16'));
  assert.equal(presence.compute.gpuLimits.maxBufferSize, 1024 * 1024 * 1024);
  assert.ok(presence.compute.gpuBandwidthGBps > 0);
  assert.ok(JSON.stringify(presence).length < 4096);

  // PlacementAdmissionPolicy accepts capable peer and rejects weak/fallback peer
  const strictPolicy = {
    requireHardwareGpu: true,
    requiredGpuFeatures: ['shader-f16'],
    requiredWasmFeatures: ['simd'],
    minMaxBufferSize: 512 * 1024 * 1024,
    minGpuBandwidthGBps: 10
  };
  const admitted = evaluatePlacementAdmission(
    { placement: { requestedPlacement: 'peer', advisoryOnly: false, bandwidthMbps: 100, rttMs: 15, remoteWorkerCapacity: 4 } },
    { peerId: 'peer-rtx', peerCapabilities: presence },
    strictPolicy
  );
  assert.equal(admitted.accepted, true);

  const weakPeer = {
    compute: {
      gpuAvailable: true,
      gpuHardwareVerified: false,
      isFallbackAdapter: true,
      gpuFeatures: [],
      wasmFeatures: { simd: false },
      gpuLimits: { maxBufferSize: 128 * 1024 * 1024 },
      gpuBandwidthGBps: 4
    }
  };
  const rejected = evaluatePlacementAdmission(
    { placement: { requestedPlacement: 'peer', advisoryOnly: false, bandwidthMbps: 100, rttMs: 15, remoteWorkerCapacity: 4 } },
    { peerId: 'peer-weak', peerCapabilities: weakPeer },
    strictPolicy
  );
  assert.equal(rejected.accepted, false);
  assert.ok(rejected.blockedReasons.includes('peer-gpu-software-fallback'));
  assert.ok(rejected.blockedReasons.includes('peer-gpu-feature-missing:shader-f16'));
  assert.ok(rejected.blockedReasons.includes('peer-wasm-feature-missing:simd'));
  assert.ok(rejected.blockedReasons.includes('peer-gpu-max-buffer-below-floor'));
  assert.ok(rejected.blockedReasons.includes('peer-gpu-bandwidth-below-floor'));
});
