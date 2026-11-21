import { requestManagedGpuDevice } from './managedGpuDevice.js';
import { probeWasmCapabilities } from './probeCapabilities.js';

export const CAPABILITY_BENCHMARK_TASK_SCHEMA = 'peercompute.capabilities.benchmark-task.v1';

const MAX_GPU_BANDWIDTH_BUFFER_BYTES = 8 * 1024 * 1024;
const MIN_GPU_BANDWIDTH_BUFFER_BYTES = 256 * 1024;
const GPU_READBACK_BYTES = 64 * 1024;

function gpuBufferUsage() {
  const usage = globalThis.GPUBufferUsage;
  return {
    MAP_READ: usage?.MAP_READ ?? 0x0001,
    COPY_SRC: usage?.COPY_SRC ?? 0x0004,
    COPY_DST: usage?.COPY_DST ?? 0x0008,
    STORAGE: usage?.STORAGE ?? 0x0080,
    QUERY_RESOLVE: usage?.QUERY_RESOLVE ?? 0x0200
  };
}

function gpuMapReadMode() {
  return globalThis.GPUMapMode?.READ ?? 0x0001;
}

let cachedWasmBenchModule = null;

function nowMs() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function encodeUleb128(value) {
  const bytes = [];
  let remaining = value >>> 0;
  do {
    let byte = remaining & 0x7f;
    remaining >>>= 7;
    if (remaining !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (remaining !== 0);
  return bytes;
}

function encodeF32(value) {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, value, true);
  return Array.from(new Uint8Array(buf));
}

function encodeWasmSection(id, payload) {
  return [id, ...encodeUleb128(payload.length), ...payload];
}

/**
 * Self-contained valid WebAssembly binary (no external fetch required):
 *   export bench(count: i32) -> f32
 * Performs 8 FP32 multiply-add operations per loop iteration.
 */
export function buildWasmBenchmarkBytes() {
  const typeSection = encodeWasmSection(1, [
    0x01, // 1 function type
    0x60, // func
    0x01, 0x7f, // (param i32)
    0x01, 0x7d // (result f32)
  ]);
  const funcSection = encodeWasmSection(3, [0x01, 0x00]);
  const exportName = Array.from(new TextEncoder().encode('bench'));
  const exportSection = encodeWasmSection(7, [
    0x01, // 1 export
    exportName.length, ...exportName,
    0x00, 0x00 // func index 0
  ]);

  const fmaStep = (delta) => [
    0x20, 0x02, // local.get $acc
    0x20, 0x03, // local.get $x
    0x94, // f32.mul
    0x43, ...encodeF32(delta), // f32.const delta
    0x92, // f32.add
    0x21, 0x02 // local.set $acc
  ];

  // Locals: param 0 = count (i32); local 1 = i (i32); local 2 = acc (f32); local 3 = x (f32)
  const body = [
    0x02, // 2 local declaration groups
    0x01, 0x7f, // 1 i32 ($i)
    0x02, 0x7d, // 2 f32 ($acc, $x)
    0x43, ...encodeF32(1.0), 0x21, 0x02, // acc = 1.0
    0x43, ...encodeF32(1.000001), 0x21, 0x03, // x = 1.000001
    0x02, 0x40, // block $break
    0x03, 0x40, // loop $cont
    0x20, 0x01, // local.get $i
    0x20, 0x00, // local.get $count
    0x4e, // i32.ge_s
    0x0d, 0x01, // br_if $break
    ...fmaStep(0.000125),
    ...fmaStep(-0.000124),
    ...fmaStep(0.000123),
    ...fmaStep(-0.000122),
    0x20, 0x01, // local.get $i
    0x41, 0x01, // i32.const 1
    0x6a, // i32.add
    0x21, 0x01, // local.set $i
    0x0c, 0x00, // br $cont
    0x0b, // end loop
    0x0b, // end block
    0x20, 0x02, // local.get $acc
    0x0b // end func
  ];
  const codeSection = encodeWasmSection(10, [
    0x01, // 1 function body
    ...encodeUleb128(body.length),
    ...body
  ]);

  return new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic
    0x01, 0x00, 0x00, 0x00, // version 1
    ...typeSection,
    ...funcSection,
    ...exportSection,
    ...codeSection
  ]);
}

function cpuKernelPass(buffer, passes) {
  const len = buffer.length;
  let acc = 1.0;
  for (let p = 0; p < passes; p += 1) {
    for (let i = 0; i < len; i += 4) {
      const a = buffer[i];
      const b = buffer[i + 1];
      const c = buffer[i + 2];
      const d = buffer[i + 3];
      // 12 FP32 arithmetic ops per 4 floats = 3 ops/float + sqrt
      const x = a * 1.0001 + b * 0.9997;
      const y = c * 1.0003 - d * 0.9999;
      const m = Math.sqrt(x * x + y * y + 1e-6);
      buffer[i] = x / m;
      buffer[i + 1] = y / m;
      acc += m * 1e-5;
    }
  }
  return acc;
}

export function runCpuMicrobenchmark({
  workSize = 16384,
  targetMs = 20,
  maxMs = 150,
  signal = null
} = {}) {
  signal?.throwIfAborted();
  const size = Math.max(1024, Math.min(262144, Math.floor(workSize / 4) * 4));
  const data = new Float32Array(size);
  for (let i = 0; i < size; i += 1) {
    data[i] = ((i % 97) + 1) * 0.013;
  }

  // Short warm-up pass to stabilize JIT.
  cpuKernelPass(data, 2);
  signal?.throwIfAborted();

  const opsPerPass = (size / 4) * 12;
  let totalPasses = 0;
  let checksum = 0;
  const started = nowMs();
  let batch = 4;
  while (true) {
    signal?.throwIfAborted();
    checksum += cpuKernelPass(data, batch);
    totalPasses += batch;
    const elapsed = nowMs() - started;
    if (elapsed >= targetMs || elapsed >= maxMs) break;
    if (elapsed < targetMs * 0.25) batch = Math.min(64, batch * 2);
  }
  const durationMs = Math.max(0.05, nowMs() - started);
  const ops = totalPasses * opsPerPass;
  const mopsPerSec = Number(((ops / (durationMs / 1000)) / 1e6).toFixed(2));
  return {
    ok: true,
    ops,
    passes: totalPasses,
    durationMs: Number(durationMs.toFixed(3)),
    mopsPerSec,
    checksum: Number(checksum.toFixed(6))
  };
}

export async function runWasmMicrobenchmark({
  targetMs = 20,
  maxMs = 150,
  signal = null
} = {}) {
  signal?.throwIfAborted();
  const caps = probeWasmCapabilities(globalThis);
  if (!caps.supported) {
    return { ok: false, supported: false, simdSupported: false, reason: 'WebAssembly unavailable' };
  }
  try {
    if (!cachedWasmBenchModule) {
      cachedWasmBenchModule = await WebAssembly.compile(buildWasmBenchmarkBytes());
    }
    signal?.throwIfAborted();
    const instance = await WebAssembly.instantiate(cachedWasmBenchModule, {});
    const bench = instance.exports.bench;

    // Warm-up
    bench(50_000);
    signal?.throwIfAborted();

    const opsPerIter = 8;
    let totalIters = 0;
    let batchIters = 250_000;
    let checksum = 0;
    const started = nowMs();
    while (true) {
      signal?.throwIfAborted();
      checksum += bench(batchIters);
      totalIters += batchIters;
      const elapsed = nowMs() - started;
      if (elapsed >= targetMs || elapsed >= maxMs) break;
      if (elapsed < targetMs * 0.25) batchIters = Math.min(4_000_000, batchIters * 2);
    }
    const durationMs = Math.max(0.05, nowMs() - started);
    const ops = totalIters * opsPerIter;
    const mopsPerSec = Number(((ops / (durationMs / 1000)) / 1e6).toFixed(2));
    return {
      ok: true,
      supported: true,
      simdSupported: caps.simd,
      ops,
      iterations: totalIters,
      durationMs: Number(durationMs.toFixed(3)),
      mopsPerSec,
      checksum: Number(checksum.toFixed(6))
    };
  } catch (error) {
    return {
      ok: false,
      supported: caps.supported,
      simdSupported: caps.simd,
      reason: String(error?.message ?? error).slice(0, 200)
    };
  }
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

async function compileVerifiedShader(device, code, label) {
  const module = device.createShaderModule({ label, code });
  if (typeof module.getCompilationInfo === 'function') {
    const info = await module.getCompilationInfo();
    const errors = info.messages.filter((msg) => msg.type === 'error');
    if (errors.length > 0) {
      throw new Error(`WGSL compilation failed (${label}): ${errors.map((e) => e.message).join('; ')}`);
    }
  }
  return module;
}

/**
 * Bounded, non-destructive WebGPU microbenchmark:
 *   1. Compute FMA throughput (GFLOPS proxy; timestamp-query if available else queue.onSubmittedWorkDone)
 *   2. Storage-buffer streaming memory bandwidth (GB/s proxy; <= 8 MiB per buffer)
 *   3. Staging-buffer readback round-trip latency (ms)
 * Always destroys every allocated buffer, query set, and temporary GPUDevice in finally {}.
 */
export async function runGpuMicrobenchmark({
  scope = globalThis,
  allowFallback = false,
  bufferBytes = MAX_GPU_BANDWIDTH_BUFFER_BYTES,
  computeThreads = 65536,
  computePasses = 4,
  bandwidthPasses = 4,
  readbackPasses = 3,
  timeoutMs = 5000,
  signal = null
} = {}) {
  signal?.throwIfAborted();
  let managed = null;
  const resources = [];
  let errorScopeOpen = false;
  const track = (res) => {
    if (res) resources.push(res);
    return res;
  };

  try {
    managed = await requestManagedGpuDevice({
      scope,
      allowFallback,
      optionalFeatures: ['timestamp-query', 'shader-f16'],
      promoteLimits: true,
      timeoutMs,
      label: 'peercompute-capability-benchmark'
    });
    signal?.throwIfAborted();

    const { device, hasTimestampQuery, hasShaderF16, limits, adapterInfo, isFallbackAdapter } = managed;
    if (typeof device.pushErrorScope === 'function') {
      device.pushErrorScope('validation');
      errorScopeOpen = true;
    }

    const useTimestamps = hasTimestampQuery && typeof device.createQuerySet === 'function';
    const maxBinding = Math.min(
      limits.maxBufferSize || MAX_GPU_BANDWIDTH_BUFFER_BYTES,
      limits.maxStorageBufferBindingSize || MAX_GPU_BANDWIDTH_BUFFER_BYTES
    );

    // 1. Compute FMA benchmark: 64 iterations * 4 vec4 fma = 64 * 4 * 4 * 2 = 2048 FLOPs/thread
    const workgroupSize = 64;
    const maxWorkgroups = limits.maxComputeWorkgroupsPerDimension || 65535;
    const threads = Math.min(
      Math.max(workgroupSize, Math.floor(computeThreads / workgroupSize) * workgroupSize),
      maxWorkgroups * workgroupSize,
      Math.floor(maxBinding / 16)
    );
    const computeWorkgroups = Math.max(1, Math.floor(threads / workgroupSize));
    const computeOutBytes = threads * 16; // vec4<f32> per thread

    const computeShader = await compileVerifiedShader(device, `
      @group(0) @binding(0) var<storage, read_write> outBuf: array<vec4<f32>>;
      @compute @workgroup_size(${workgroupSize})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&outBuf)) { return; }
        var a = vec4<f32>(0.901, 0.899, 0.902, 0.898) + vec4<f32>(f32(idx & 255u) * 0.0001);
        var b = vec4<f32>(0.9993, 1.0007, 0.9991, 1.0009);
        var c = vec4<f32>(0.9505, 0.9496, 0.9503, 0.9498);
        var d = vec4<f32>(1.0002, 0.9998, 1.0004, 0.9996);
        let k = vec4<f32>(0.7501, 0.7499, 0.7502, 0.7498);
        let bias = vec4<f32>(0.125, 0.126, 0.124, 0.1255);
        for (var i = 0u; i < 64u; i = i + 1u) {
          a = fma(a, k, fma(b, vec4<f32>(0.125), bias));
          b = fma(b, k, fma(c, vec4<f32>(0.125), bias));
          c = fma(c, k, fma(d, vec4<f32>(0.125), bias));
          d = fma(d, k, fma(a, vec4<f32>(0.125), bias));
        }
        outBuf[idx] = a + b + c + d;
      }
    `, 'peercompute-bench-compute');

    const computePipeline = await device.createComputePipelineAsync({
      layout: 'auto',
      compute: { module: computeShader, entryPoint: 'main' }
    });
    const usage = gpuBufferUsage();
    const mapRead = gpuMapReadMode();
    const computeOutBuf = track(device.createBuffer({
      size: computeOutBytes,
      usage: usage.STORAGE | usage.COPY_SRC
    }));
    const computeBindGroup = device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: computeOutBuf } }]
    });

    // 2. Memory bandwidth benchmark: streaming vec4<f32> copy+scale over <= 8 MiB buffers
    const targetBufBytes = Math.min(
      Math.max(MIN_GPU_BANDWIDTH_BUFFER_BYTES, bufferBytes),
      MAX_GPU_BANDWIDTH_BUFFER_BYTES,
      Math.floor(maxBinding / 4)
    );
    const vec4Count = Math.max(256, Math.min(
      Math.floor(targetBufBytes / 16),
      maxWorkgroups * workgroupSize
    ));
    const alignedVec4Count = Math.floor(vec4Count / workgroupSize) * workgroupSize;
    const bwBufBytes = alignedVec4Count * 16;
    const bwWorkgroups = Math.max(1, Math.floor(alignedVec4Count / workgroupSize));

    const bwShader = await compileVerifiedShader(device, `
      @group(0) @binding(0) var<storage, read> srcBuf: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> dstBuf: array<vec4<f32>>;
      @compute @workgroup_size(${workgroupSize})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&srcBuf)) { return; }
        dstBuf[idx] = srcBuf[idx] * 1.0001 + vec4<f32>(0.25, 0.5, 0.75, 1.0);
      }
    `, 'peercompute-bench-bandwidth');

    const bwPipeline = await device.createComputePipelineAsync({
      layout: 'auto',
      compute: { module: bwShader, entryPoint: 'main' }
    });
    const bwSrc = track(device.createBuffer({
      size: bwBufBytes,
      usage: usage.STORAGE | usage.COPY_DST
    }));
    const bwDst = track(device.createBuffer({
      size: bwBufBytes,
      usage: usage.STORAGE | usage.COPY_SRC
    }));
    // Seed a small slice of bwSrc to avoid huge CPU-side allocation.
    const seedChunk = new Float32Array(1024);
    for (let i = 0; i < seedChunk.length; i += 1) seedChunk[i] = (i + 1) * 0.01;
    device.queue.writeBuffer(bwSrc, 0, seedChunk);

    const bwBindGroup = device.createBindGroup({
      layout: bwPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: bwSrc } },
        { binding: 1, resource: { buffer: bwDst } }
      ]
    });

    // Optional GPU timestamp query setup (4 timestamps: compute start/end, bandwidth start/end)
    let querySet = null;
    let queryResolveBuf = null;
    let queryReadBuf = null;
    if (useTimestamps) {
      querySet = track(device.createQuerySet({ type: 'timestamp', count: 4 }));
      queryResolveBuf = track(device.createBuffer({
        size: 4 * 8,
        usage: usage.QUERY_RESOLVE | usage.COPY_SRC
      }));
      queryReadBuf = track(device.createBuffer({
        size: 4 * 8,
        usage: usage.COPY_DST | usage.MAP_READ
      }));
    }

    // Warm-up submission for both pipelines
    {
      const warmEnc = device.createCommandEncoder();
      const p1 = warmEnc.beginComputePass();
      p1.setPipeline(computePipeline);
      p1.setBindGroup(0, computeBindGroup);
      p1.dispatchWorkgroups(computeWorkgroups);
      p1.end();
      const p2 = warmEnc.beginComputePass();
      p2.setPipeline(bwPipeline);
      p2.setBindGroup(0, bwBindGroup);
      p2.dispatchWorkgroups(bwWorkgroups);
      p2.end();
      device.queue.submit([warmEnc.finish()]);
      await device.queue.onSubmittedWorkDone();
    }
    signal?.throwIfAborted();

    const passesCompute = Math.max(1, Math.min(32, Math.floor(computePasses)));
    const passesBw = Math.max(1, Math.min(32, Math.floor(bandwidthPasses)));

    // Timed compute passes
    let computeMs = 0;
    const computeWallStart = nowMs();
    {
      const enc = device.createCommandEncoder();
      const passDesc = useTimestamps
        ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 } }
        : undefined;
      const pass = enc.beginComputePass(passDesc);
      pass.setPipeline(computePipeline);
      pass.setBindGroup(0, computeBindGroup);
      for (let i = 0; i < passesCompute; i += 1) {
        pass.dispatchWorkgroups(computeWorkgroups);
      }
      pass.end();
      device.queue.submit([enc.finish()]);
      await device.queue.onSubmittedWorkDone();
    }
    const computeWallMs = Math.max(0.05, nowMs() - computeWallStart);
    signal?.throwIfAborted();

    // Timed memory bandwidth passes
    let bwMs = 0;
    const bwWallStart = nowMs();
    {
      const enc = device.createCommandEncoder();
      const passDesc = useTimestamps
        ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 2, endOfPassWriteIndex: 3 } }
        : undefined;
      const pass = enc.beginComputePass(passDesc);
      pass.setPipeline(bwPipeline);
      pass.setBindGroup(0, bwBindGroup);
      for (let i = 0; i < passesBw; i += 1) {
        pass.dispatchWorkgroups(bwWorkgroups);
      }
      pass.end();
      if (useTimestamps) {
        enc.resolveQuerySet(querySet, 0, 4, queryResolveBuf, 0);
        enc.copyBufferToBuffer(queryResolveBuf, 0, queryReadBuf, 0, 4 * 8);
      }
      device.queue.submit([enc.finish()]);
      await device.queue.onSubmittedWorkDone();
    }
    const bwWallMs = Math.max(0.05, nowMs() - bwWallStart);
    signal?.throwIfAborted();

    let timingMethod = 'queue-done';
    if (useTimestamps) {
      try {
        await queryReadBuf.mapAsync(mapRead);
        const stamps = new BigInt64Array(queryReadBuf.getMappedRange().slice(0));
        queryReadBuf.unmap();
        const cNs = Number(stamps[1] - stamps[0]);
        const bNs = Number(stamps[3] - stamps[2]);
        if (Number.isFinite(cNs) && cNs > 0 && Number.isFinite(bNs) && bNs > 0) {
          computeMs = cNs / 1e6;
          bwMs = bNs / 1e6;
          timingMethod = 'timestamp-query';
        }
      } catch {
        // Fall back to queue-done wall timings.
      }
    }
    if (timingMethod !== 'timestamp-query') {
      computeMs = computeWallMs;
      bwMs = bwWallMs;
    }

    // 3. Staging-buffer readback latency + correctness spot-check
    const readBytes = Math.min(GPU_READBACK_BYTES, computeOutBytes, bwBufBytes);
    const readbackStaging = track(device.createBuffer({
      size: readBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    }));
    const readbackSamples = [];
    let verifiedFinite = false;
    const rbCount = Math.max(1, Math.min(8, Math.floor(readbackPasses)));
    for (let i = 0; i < rbCount; i += 1) {
      signal?.throwIfAborted();
      const rbStart = nowMs();
      const enc = device.createCommandEncoder();
      enc.copyBufferToBuffer(i === 0 ? computeOutBuf : bwDst, 0, readbackStaging, 0, readBytes);
      device.queue.submit([enc.finish()]);
      await readbackStaging.mapAsync(mapRead);
      const sample = new Float32Array(readbackStaging.getMappedRange(0, 16).slice(0));
      readbackStaging.unmap();
      readbackSamples.push(Math.max(0.01, nowMs() - rbStart));
      if (i === 0) {
        verifiedFinite = sample.length === 4 && sample.every((v) => Number.isFinite(v) && v !== 0);
      }
    }

    if (errorScopeOpen && typeof device.popErrorScope === 'function') {
      const validationError = await device.popErrorScope();
      errorScopeOpen = false;
      if (validationError) {
        throw new Error(`WebGPU validation error during benchmark: ${validationError.message}`);
      }
    }

    if (!verifiedFinite) {
      throw new Error('WebGPU benchmark readback returned invalid or zero values');
    }

    // 64 iterations * 8 vec4 fma * 4 lanes * 2 ops (fma) = 4096 FLOPs per thread per pass
    const totalFlops = threads * 4096 * passesCompute;
    const computeGflopsProxy = Number((totalFlops / ((computeMs / 1000) * 1e9)).toFixed(2));
    // Each streaming copy pass reads bwBufBytes and writes bwBufBytes
    const totalBytesMoved = bwBufBytes * 2 * passesBw;
    const memoryBandwidthGBps = Number((totalBytesMoved / ((bwMs / 1000) * 1e9)).toFixed(2));
    const readbackLatencyMs = Number(median(readbackSamples).toFixed(3));

    return {
      ok: true,
      status: isFallbackAdapter ? 'fallback' : 'hardware',
      timingMethod,
      adapter: adapterInfo,
      isFallbackAdapter,
      hasTimestampQuery,
      hasShaderF16,
      computeGflopsProxy,
      memoryBandwidthGBps,
      readbackLatencyMs,
      computeMs: Number(computeMs.toFixed(3)),
      bandwidthMs: Number(bwMs.toFixed(3)),
      bandwidthBufferBytes: bwBufBytes,
      readbackBytes: readBytes,
      verified: true
    };
  } catch (error) {
    return {
      ok: false,
      status: error?.code === 'ERR_GPU_FALLBACK_REJECTED' ? 'fallback-only' : 'unavailable',
      code: error?.code || 'ERR_GPU_BENCHMARK_FAILED',
      reason: String(error?.message ?? error).slice(0, 240)
    };
  } finally {
    if (errorScopeOpen && typeof managed?.device?.popErrorScope === 'function') {
      await managed.device.popErrorScope().catch(() => {});
    }
    for (const res of resources) {
      try {
        res?.destroy?.();
      } catch {
        // Ignore cleanup errors.
      }
    }
    managed?.destroy?.();
  }
}

/**
 * Managed worker entry point invoked by ComputeManager with module 'peercompute:capability-benchmark'.
 */
export async function runCapabilityBenchmarkTask(data = {}, context = {}) {
  const signal = context?.signal ?? null;
  const mode = String(data?.mode || 'all').trim().toLowerCase();
  const startedAt = nowMs();

  if (mode === 'cpu-shard') {
    const cpu = runCpuMicrobenchmark({
      workSize: data.workSize,
      targetMs: data.targetMs ?? 20,
      maxMs: data.maxMs ?? 120,
      signal
    });
    return { schema: CAPABILITY_BENCHMARK_TASK_SCHEMA, mode, workerId: context?.workerId ?? null, cpu };
  }

  const suites = Array.isArray(data?.suites)
    ? data.suites
    : mode === 'all' ? ['cpu', 'wasm', 'gpu'] : [mode];

  const output = {
    schema: CAPABILITY_BENCHMARK_TASK_SCHEMA,
    mode,
    workerId: context?.workerId ?? null
  };

  if (suites.includes('cpu')) {
    context?.emitProgress?.({ stage: 'cpu', fraction: 0.1 });
    output.cpu = runCpuMicrobenchmark({
      workSize: data.cpuWorkSize,
      targetMs: data.cpuTargetMs ?? 20,
      maxMs: data.cpuMaxMs ?? 120,
      signal
    });
  }
  if (suites.includes('wasm')) {
    context?.emitProgress?.({ stage: 'wasm', fraction: 0.4 });
    output.wasm = await runWasmMicrobenchmark({
      targetMs: data.wasmTargetMs ?? 20,
      maxMs: data.wasmMaxMs ?? 120,
      signal
    });
  }
  if (suites.includes('gpu')) {
    context?.emitProgress?.({ stage: 'gpu', fraction: 0.7 });
    output.gpu = await runGpuMicrobenchmark({
      allowFallback: data.allowFallback === true,
      bufferBytes: data.gpuBufferBytes ?? MAX_GPU_BANDWIDTH_BUFFER_BYTES,
      computeThreads: data.gpuComputeThreads ?? 65536,
      computePasses: data.gpuComputePasses ?? 4,
      bandwidthPasses: data.gpuBandwidthPasses ?? 4,
      readbackPasses: data.gpuReadbackPasses ?? 3,
      timeoutMs: data.gpuTimeoutMs ?? 5000,
      signal
    });
  }

  output.durationMs = Number(Math.max(0, nowMs() - startedAt).toFixed(3));
  context?.emitProgress?.({ stage: 'complete', fraction: 1 });
  return output;
}

export default runCapabilityBenchmarkTask;
