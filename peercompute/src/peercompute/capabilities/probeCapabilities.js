export const CAPABILITIES_SCHEMA = 'peercompute.capabilities.v1';

export const GPU_CAPABILITY_LIMIT_KEYS = Object.freeze([
  'maxBufferSize',
  'maxStorageBufferBindingSize',
  'maxComputeWorkgroupStorageSize',
  'maxComputeInvocationsPerWorkgroup',
  'maxComputeWorkgroupSizeX',
  'maxComputeWorkgroupSizeY',
  'maxComputeWorkgroupSizeZ',
  'maxComputeWorkgroupsPerDimension',
  'maxStorageBuffersPerShaderStage',
  'maxTextureDimension2D',
  'maxTextureDimension3D',
  'maxTextureArrayLayers'
]);

const SOFTWARE_ADAPTER_PATTERN = /swiftshader|llvmpipe|lavapipe|software|microsoft basic render|subzero/i;

// Minimal valid WebAssembly v128 module: (func (result v128) (v128.const i32x4 0 0 0 0))
const WASM_SIMD_PROBE_BYTES = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
  0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7b,
  0x03, 0x02, 0x01, 0x00,
  0x0a, 0x16, 0x01, 0x14, 0x00, 0xfd, 0x0c,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x0b
]);

function boundedText(value, maximum = 128, fallback = '') {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, maximum).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ').trim() || fallback;
}

function normalizePositiveInteger(value, fallback = null, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const num = Math.floor(Number(value));
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function normalizeFiniteNumber(value, fallback = null, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (value === null || value === undefined || value === '') return fallback;
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function readNumberParam(params, ...keys) {
  for (const key of keys) {
    const raw = params.get(key);
    if (raw == null || raw === '') continue;
    const num = Number(raw);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

function readBooleanParam(params, ...keys) {
  for (const key of keys) {
    const raw = params.get(key);
    if (raw == null || raw === '') continue;
    const normalized = String(raw).trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  }
  return null;
}

function fnv1aHex(input) {
  const text = String(input ?? '');
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= (code + (i & 0xff));
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

export function detectBrowserEnvironment(navigatorLike = globalThis.navigator) {
  const nav = navigatorLike ?? {};
  const ua = boundedText(nav.userAgent, 4096);
  const platform = boundedText(nav.userAgentData?.platform, 80) || boundedText(nav.platform, 80);
  const brands = Array.isArray(nav.userAgentData?.brands)
    ? nav.userAgentData.brands.slice(0, 16).map((item) => boundedText(item?.brand, 80)).join(' ')
    : '';

  let os = 'other';
  if (/iPhone|iPad|iPod|\biOS\b/i.test(`${platform} ${ua}`) || (/Mac/i.test(`${platform} ${ua}`) && nav.maxTouchPoints > 1)) {
    os = 'ios';
  } else if (/Android/i.test(`${platform} ${ua}`)) {
    os = 'android';
  } else if (/Windows|Win32|Win64/i.test(platform)) {
    os = 'windows';
  } else if (/macOS|Mac/i.test(platform)) {
    os = 'macos';
  } else if (/Linux/i.test(platform)) {
    os = 'linux';
  } else if (/Windows/i.test(ua)) {
    os = 'windows';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macos';
  } else if (/Linux|X11/i.test(ua)) {
    os = 'linux';
  }

  let browser = 'other';
  if (/Brave/i.test(brands) || /Brave\//i.test(ua) || typeof nav.brave?.isBrave === 'function') {
    browser = 'brave';
  } else if (/Microsoft Edge/i.test(brands) || /(?:Edg|EdgA|EdgiOS|Edge)\//i.test(ua)) {
    browser = 'edge';
  } else if (/Firefox/i.test(brands) || /(?:Firefox|FxiOS)\//i.test(ua)) {
    browser = 'firefox';
  } else if (/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.test(ua)) {
    browser = 'other';
  } else if (/Google Chrome/i.test(brands) || /CriOS\//i.test(ua)) {
    browser = 'chrome';
  } else if (/Chromium\//i.test(ua)) {
    browser = 'chromium';
  } else if (/Chrome\//i.test(ua)) {
    browser = 'chrome';
  } else if (/Chromium/i.test(brands)) {
    browser = 'chromium';
  } else if (/Safari\//i.test(ua) && /Version\//i.test(ua)) {
    browser = 'safari';
  }

  let kind = 'browser';
  if (typeof process !== 'undefined' && process?.versions?.node && typeof window === 'undefined' && typeof WorkerGlobalScope === 'undefined') {
    kind = 'node';
  } else if (typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope) {
    kind = 'worker';
  }

  return { kind, browser, os };
}

export function readCapabilityOverrides(search = globalThis.location?.search || '') {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(String(search || ''));
  const rawTier = params.get('computeTier') || params.get('deviceTier');
  const tier = rawTier && ['mobile', 'laptop', 'workstation', 'cluster'].includes(rawTier.trim().toLowerCase())
    ? rawTier.trim().toLowerCase()
    : undefined;
  return {
    tier,
    cpuCores: readNumberParam(params, 'cpuCores') ?? undefined,
    deviceMemoryGiB: readNumberParam(params, 'deviceMemoryGB', 'deviceMemoryGiB', 'deviceMemory') ?? undefined,
    memoryBudgetMB: readNumberParam(params, 'memoryBudgetMB', 'ramBudgetMB') ?? undefined,
    gpuMemoryBudgetMB: readNumberParam(params, 'gpuMemoryBudgetMB', 'gpuBudgetMB', 'vramBudgetMB') ?? undefined,
    budgetScale: readNumberParam(params, 'budgetScale', 'resourceBudgetScale', 'computeScale') ?? undefined,
    maxWorkers: readNumberParam(params, 'maxWorkers') ?? undefined,
    dprCap: readNumberParam(params, 'dprCap', 'maxDpr') ?? undefined,
    forceBenchmark: readBooleanParam(params, 'forceBenchmark') ?? undefined,
    skipBenchmark: readBooleanParam(params, 'skipBenchmark') ?? undefined,
    allowFallbackGpu: readBooleanParam(params, 'allowFallbackGpu') ?? undefined
  };
}

export function isSoftwareAdapterInfo(adapter) {
  if (!adapter) return false;
  if (adapter.isFallbackAdapter === true || adapter.info?.isFallbackAdapter === true) {
    return true;
  }
  const info = adapter.info;
  if (!info || typeof info !== 'object') return false;
  const combined = [info.vendor, info.architecture, info.device, info.description]
    .filter((value) => typeof value === 'string' && value.length > 0)
    .join(' ');
  return combined.length > 0 && SOFTWARE_ADAPTER_PATTERN.test(combined);
}

export function extractAdapterLimits(limitsLike = null, keys = GPU_CAPABILITY_LIMIT_KEYS) {
  const limits = {};
  if (!limitsLike || typeof limitsLike !== 'object') return limits;
  for (const key of keys) {
    const value = limitsLike[key];
    if (Number.isSafeInteger(value) && value > 0) {
      limits[key] = value;
    }
  }
  return limits;
}

export function extractAdapterFeatures(featuresLike = null) {
  if (!featuresLike) return [];
  const raw = typeof featuresLike[Symbol.iterator] === 'function' ? [...featuresLike] : [];
  return [...new Set(
    raw.filter((feature) => typeof feature === 'string' && feature.length > 0 && feature.length <= 80)
  )].sort().slice(0, 64);
}

export function probeWasmCapabilities(scope = globalThis) {
  const wasm = scope?.WebAssembly;
  const supported = typeof wasm === 'object' && wasm !== null
    && (typeof wasm.Module === 'function'
      || typeof wasm.Memory === 'function'
      || typeof wasm.instantiate === 'function'
      || typeof wasm.validate === 'function');
  const crossOriginIsolated = scope?.crossOriginIsolated === true;
  const sharedArrayBuffer = typeof scope?.SharedArrayBuffer === 'function';
  const jspi = Boolean(supported && typeof wasm.Suspending === 'function' && typeof wasm.promising === 'function');
  let simd = false;
  if (supported && typeof wasm.validate === 'function') {
    try {
      simd = wasm.validate(WASM_SIMD_PROBE_BYTES) === true;
    } catch {
      simd = false;
    }
  }
  let memory64 = false;
  if (supported && sharedArrayBuffer && typeof wasm.Memory === 'function') {
    try {
      // Minimal zero-page descriptor probes shared memory64 support without allocating memory.
      // eslint-disable-next-line no-new
      new wasm.Memory({ initial: 0n, maximum: 1n, shared: true, address: 'i64' });
      memory64 = true;
    } catch {
      memory64 = false;
    }
  }
  return {
    supported,
    crossOriginIsolated,
    sharedArrayBuffer,
    threads: Boolean(supported && crossOriginIsolated && sharedArrayBuffer),
    simd,
    jspi,
    memory64
  };
}

export function probeWebGLCapabilities(scope = globalThis) {
  const unavailable = {
    available: false,
    webgl2: false,
    maxTextureSize: null,
    max3DTextureSize: null,
    maxTextureImageUnits: null,
    maxRenderbufferSize: null,
    maxAnisotropy: null
  };
  let canvas = null;
  if (typeof scope?.OffscreenCanvas === 'function') {
    try {
      canvas = new scope.OffscreenCanvas(1, 1);
    } catch {
      canvas = null;
    }
  }
  if (!canvas && typeof scope?.document?.createElement === 'function') {
    try {
      canvas = scope.document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
    } catch {
      canvas = null;
    }
  }
  if (!canvas || typeof canvas.getContext !== 'function') return unavailable;

  let gl = null;
  let webgl2 = false;
  try {
    gl = canvas.getContext('webgl2', { powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false });
    if (gl) {
      webgl2 = true;
    } else {
      gl = canvas.getContext('webgl', { powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false });
    }
  } catch {
    return unavailable;
  }
  if (!gl) return unavailable;

  try {
    const param = (name) => {
      const key = gl[name];
      if (key === undefined) return null;
      const val = gl.getParameter(key);
      return Number.isFinite(val) && val > 0 ? Math.floor(val) : null;
    };
    let maxAnisotropy = null;
    try {
      const ext = gl.getExtension('EXT_texture_filter_anisotropic')
        || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
        || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
      if (ext && ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT !== undefined) {
        const val = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        if (Number.isFinite(val) && val > 0) maxAnisotropy = val;
      }
    } catch {
      maxAnisotropy = null;
    }
    return {
      available: true,
      webgl2,
      maxTextureSize: param('MAX_TEXTURE_SIZE'),
      max3DTextureSize: webgl2 ? param('MAX_3D_TEXTURE_SIZE') : null,
      maxTextureImageUnits: param('MAX_TEXTURE_IMAGE_UNITS'),
      maxRenderbufferSize: param('MAX_RENDERBUFFER_SIZE'),
      maxAnisotropy
    };
  } finally {
    try {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      // Ignore cleanup errors on synthetic contexts.
    }
  }
}

export function inferHardwareTier({ cpuCores, deviceMemoryGiB, gpuAvailable, isMobileOs, declaredTier } = {}) {
  if (declaredTier && ['mobile', 'laptop', 'workstation', 'cluster'].includes(String(declaredTier))) {
    return String(declaredTier);
  }
  if (cpuCores >= 32 || (deviceMemoryGiB != null && deviceMemoryGiB >= 64)) return 'cluster';
  if (gpuAvailable && !isMobileOs && (cpuCores >= 12 || (deviceMemoryGiB != null && deviceMemoryGiB >= 16))) {
    return 'workstation';
  }
  if (isMobileOs || cpuCores <= 4 || (deviceMemoryGiB != null && deviceMemoryGiB <= 4)) return 'mobile';
  return 'laptop';
}

export function defaultTierBudgets(tier) {
  if (tier === 'cluster') return { memoryBudgetMB: 8192, gpuMemoryBudgetMB: 4096 };
  if (tier === 'workstation') return { memoryBudgetMB: 2048, gpuMemoryBudgetMB: 1024 };
  if (tier === 'mobile') return { memoryBudgetMB: 384, gpuMemoryBudgetMB: 192 };
  return { memoryBudgetMB: 1024, gpuMemoryBudgetMB: 512 };
}

export function computeHardwareFingerprint(capabilities = {}) {
  const gpu = capabilities.webgpu || {};
  const payload = {
    v: 1,
    cores: capabilities.cpu?.cores ?? null,
    memGiB: capabilities.memory?.deviceMemoryGiB ?? null,
    webgpu: gpu.status ?? null,
    vendor: gpu.info?.vendor ?? '',
    arch: gpu.info?.architecture ?? '',
    features: Array.isArray(gpu.features) ? gpu.features : [],
    limits: gpu.limits ?? {},
    wasmSimd: capabilities.wasm?.simd === true,
    wasmThreads: capabilities.wasm?.threads === true,
    browser: capabilities.environment?.browser ?? 'other',
    os: capabilities.environment?.os ?? 'other'
  };
  return `hw-${fnv1aHex(JSON.stringify(payload))}`;
}

/**
 * Read-only hardware & browser capability probe.
 * Never creates a GPUDevice, spawns workers, or runs destructive memory probes.
 * A timeout returns webgpu.available === null (unknown), not false.
 */
export async function probeCapabilities({
  scope = globalThis,
  timeoutMs = 3000,
  allowFallback = false,
  includeWebGL = false,
  includeStorageEstimate = false,
  overrides = null,
  nativeMetrics = null
} = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) {
    throw new RangeError('Invalid capability probe timeout');
  }

  const nav = scope?.navigator ?? {};
  const perf = scope?.performance ?? globalThis.performance;
  const now = () => (typeof perf?.now === 'function' ? perf.now() : Date.now());
  const ov = overrides && typeof overrides === 'object' ? overrides : {};
  const environment = detectBrowserEnvironment(nav);
  const isMobileOs = environment.os === 'android' || environment.os === 'ios';

  const rawCores = normalizePositiveInteger(nav.hardwareConcurrency, null, 1, 512);
  const overrideCores = normalizePositiveInteger(ov.cpuCores, null, 1, 512);
  const cpuCores = overrideCores ?? rawCores ?? 4;
  const cpu = {
    cores: cpuCores,
    source: overrideCores != null ? 'override' : (rawCores != null ? 'navigator' : 'fallback'),
    coarseHint: true
  };

  const rawDeviceMem = normalizeFiniteNumber(nav.deviceMemory, null, 0.25, 2048);
  const overrideDeviceMem = normalizeFiniteNumber(ov.deviceMemoryGiB ?? ov.deviceMemoryGB, null, 0.25, 2048);
  const deviceMemoryGiB = overrideDeviceMem ?? rawDeviceMem;
  const perfMem = perf?.memory && typeof perf.memory === 'object' ? perf.memory : null;
  const jsHeapLimitBytes = normalizePositiveInteger(perfMem?.jsHeapSizeLimit, null, 1);
  const jsHeapUsedBytes = normalizePositiveInteger(perfMem?.usedJSHeapSize, null, 0);
  const physicalRamBytes = normalizePositiveInteger(nativeMetrics?.physicalRamBytes, null, 1);
  const physicalVramBytes = normalizePositiveInteger(nativeMetrics?.physicalVramBytes, null, 1);

  const memory = {
    deviceMemoryGiB,
    deviceMemorySource: overrideDeviceMem != null
      ? 'override'
      : (rawDeviceMem != null ? 'navigator-coarse-hint' : 'unknown'),
    jsHeapLimitBytes,
    jsHeapUsedBytes,
    physicalRamBytes,
    physicalVramBytes,
    provenance: {
      deviceMemory: overrideDeviceMem != null
        ? 'override'
        : (rawDeviceMem != null ? 'coarse-browser-hint-capped-8gib' : 'unknown'),
      vram: physicalVramBytes != null ? 'native-driver-sampler' : 'unavailable-in-browser'
    }
  };

  const wasm = probeWasmCapabilities(scope);

  const effectiveAllowFallback = ov.allowFallbackGpu ?? allowFallback === true;
  const webgpu = {
    status: 'unavailable',
    available: false,
    isFallbackAdapter: null,
    info: null,
    features: [],
    limits: {},
    hasShaderF16: false,
    hasTimestampQuery: false,
    hasSubgroups: false,
    probeError: null
  };

  const gpu = nav.gpu;
  if (typeof gpu?.requestAdapter === 'function') {
    const deadline = now() + timeoutMs;
    const timedOut = new Error('GPU capability check timed out');
    let timer;
    let retryTimer;
    let resumeRetry;
    let finished = false;
    const withinDeadline = () => {
      if (finished || now() >= deadline) throw timedOut;
    };
    const requestAdapter = async () => {
      withinDeadline();
      let adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
      withinDeadline();
      // Cold Chromium can transiently return null while Dawn initializes.
      // Retry once within the shared deadline without creating a device.
      if (adapter == null) {
        await new Promise((resolve) => {
          resumeRetry = resolve;
          retryTimer = setTimeout(resolve, 100);
        });
        retryTimer = undefined;
        resumeRetry = undefined;
        withinDeadline();
        adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
        withinDeadline();
      }
      return adapter;
    };

    try {
      const adapter = await Promise.race([
        requestAdapter(),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(timedOut), timeoutMs);
        })
      ]);
      if (!adapter) {
        webgpu.status = 'unavailable';
        webgpu.available = false;
      } else {
        const isFallback = isSoftwareAdapterInfo(adapter);
        webgpu.isFallbackAdapter = isFallback;
        const info = adapter.info && typeof adapter.info === 'object' ? adapter.info : null;
        if (info) {
          webgpu.info = {
            vendor: boundedText(info.vendor, 80, 'unknown'),
            architecture: boundedText(info.architecture, 80, 'unknown'),
            device: boundedText(info.device, 80, ''),
            description: boundedText(info.description, 128, '')
          };
        } else {
          webgpu.info = { vendor: 'unknown', architecture: 'unknown', device: '', description: '' };
        }
        if (isFallback && !effectiveAllowFallback) {
          webgpu.status = 'fallback-only';
          webgpu.available = false;
        } else {
          webgpu.features = extractAdapterFeatures(adapter.features);
          webgpu.limits = extractAdapterLimits(adapter.limits);
          webgpu.hasShaderF16 = webgpu.features.includes('shader-f16');
          webgpu.hasTimestampQuery = webgpu.features.includes('timestamp-query');
          webgpu.hasSubgroups = webgpu.features.includes('subgroups');
          webgpu.status = isFallback ? 'fallback' : 'hardware';
          webgpu.available = true;
        }
      }
    } catch (error) {
      webgpu.available = null;
      webgpu.probeError = String(error?.message ?? error).slice(0, 300);
      webgpu.status = error === timedOut ? 'timeout' : 'error';
    } finally {
      finished = true;
      clearTimeout(timer);
      clearTimeout(retryTimer);
      resumeRetry?.();
    }
  }

  const webgl = includeWebGL ? probeWebGLCapabilities(scope) : null;

  let storage = null;
  if (includeStorageEstimate && typeof nav.storage?.estimate === 'function') {
    let storageTimer;
    try {
      const estimate = await Promise.race([
        nav.storage.estimate(),
        new Promise((_, reject) => {
          storageTimer = setTimeout(() => reject(new Error('Storage estimate timed out')), Math.min(timeoutMs, 1500));
        })
      ]);
      storage = {
        usageBytes: normalizePositiveInteger(estimate?.usage, null, 0),
        quotaBytes: normalizePositiveInteger(estimate?.quota, null, 0),
        advisory: true
      };
    } catch {
      storage = { usageBytes: null, quotaBytes: null, advisory: true };
    } finally {
      clearTimeout(storageTimer);
    }
  }

  const rawDpr = normalizeFiniteNumber(scope?.devicePixelRatio, 1, 0.5, 8);
  const tier = inferHardwareTier({
    cpuCores,
    deviceMemoryGiB,
    gpuAvailable: webgpu.available === true,
    isMobileOs,
    declaredTier: ov.tier
  });
  const dprCap = normalizeFiniteNumber(
    ov.dprCap,
    tier === 'mobile' ? 1.5 : 2,
    1,
    4
  );
  const display = {
    devicePixelRatio: rawDpr,
    recommendedPixelRatio: Math.min(rawDpr, dprCap),
    screenWidth: normalizePositiveInteger(scope?.screen?.width ?? scope?.innerWidth, null, 1),
    screenHeight: normalizePositiveInteger(scope?.screen?.height ?? scope?.innerHeight, null, 1)
  };

  const conn = nav.connection || nav.mozConnection || nav.webkitConnection || null;
  const network = conn ? {
    effectiveType: typeof conn.effectiveType === 'string' ? conn.effectiveType : null,
    downlinkMbps: normalizeFiniteNumber(conn.downlink, null, 0, 100000),
    rttMs: normalizeFiniteNumber(conn.rtt, null, 0, 60000),
    saveData: conn.saveData === true,
    coarseHint: true
  } : null;

  const tierDefaults = defaultTierBudgets(tier);
  const deviceBasedMemoryMB = deviceMemoryGiB != null
    ? Math.max(128, Math.min(tierDefaults.memoryBudgetMB, deviceMemoryGiB * 1024 * 0.25))
    : tierDefaults.memoryBudgetMB;
  const memoryBudgetMB = normalizeFiniteNumber(ov.memoryBudgetMB, deviceBasedMemoryMB, 64, 1048576);
  const gpuMemoryBudgetMB = normalizeFiniteNumber(
    ov.gpuMemoryBudgetMB,
    webgpu.available === true ? tierDefaults.gpuMemoryBudgetMB : 0,
    0,
    1048576
  );

  const result = {
    schema: CAPABILITIES_SCHEMA,
    probedAt: Date.now(),
    environment,
    tier,
    cpu,
    memory,
    wasm,
    webgpu,
    webgl,
    storage,
    display,
    network,
    planningBudgets: {
      memoryBudgetMB,
      gpuMemoryBudgetMB,
      budgetScale: normalizeFiniteNumber(ov.budgetScale, 1, 0.05, 64),
      provenance: (ov.memoryBudgetMB != null || ov.gpuMemoryBudgetMB != null)
        ? 'override'
        : 'tier-planning-estimate-not-measured-vram'
    }
  };
  result.hardwareFingerprint = computeHardwareFingerprint(result);
  return result;
}
