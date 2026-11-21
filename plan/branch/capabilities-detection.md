Instructions: This file tracks goals, architecture, and verification for the `feature/capabilities-detection` branch. Append new instructions as they are given.

# Hardware Capabilities Detection & Simulation Right-Sizing

Branch `feature/capabilities-detection` starts at `72e03991`.

## User Goal

- 2026-11-21 12:02 AKST: Add hardware capabilities detection to PeerCompute to determine available CPU, GPU, VRAM/memory resources and how fast they are, and use that to right-size simulations for the current hardware.
- 2026-11-21 12:16 AKST: User approved the 3-layer capabilities + microbenchmark + right-sizing plan and directed: **skip `demos/multiscale`**, which will likely be deprecated for the ULG project soon.

## Architecture & Honesty Constraints

1. **Layer 1 — Unified Read-Only Static Probe + Managed GPU Device Acquisition** (`peercompute/src/peercompute/capabilities/probeCapabilities.js`, `managedGpuDevice.js`):
   - Single read-only probe (`probeCapabilities`, schema `peercompute.capabilities.v1`) replacing duplicated probes across `demos/inference`, `ComputeManager`, `netviz`, `webgpuphys`, `planetgen`, `schrodinger`, and `universes`.
   - Cold-Chromium single adapter retry within a bounded deadline, software/fallback adapter detection, 12 WebGPU limits + features (`shader-f16`, `timestamp-query`, `subgroups`), WASM (`simd`, `threads`, `jspi`, `memory64`), optional WebGL2 (`MAX_3D_TEXTURE_SIZE`, `MAX_TEXTURE_SIZE`, `maxAnisotropy`), optional advisory `navigator.storage.estimate()`, display DPR recommendation, coarse `navigator.connection`, and browser/OS detection.
   - Strict browser memory honesty: `navigator.deviceMemory` is labeled a coarse browser hint capped at 8 GiB; WebGPU `maxBufferSize` is never treated as physical VRAM; destructive allocate-until-OOM VRAM probing is prohibited; installed `root-node` native metrics carry distinct `native-driver-sampler` provenance.
   - `requestManagedGpuDevice()` promotes safe `adapter.limits` into `requiredLimits` (fixing the split-brain where `GPUHubManager` and demos got WebGPU 128 MiB defaults while budgets assumed adapter maxima), negotiates optional features, rejects software adapters by default, and wires `device.lost` recovery.

2. **Layer 2 — Fast, Cached, Non-Destructive Microbenchmark** (`benchmarkTask.js`, `capabilityBenchmark.js`):
   - Runs inside a managed `ComputeManager` worker via trusted module `'peercompute:capability-benchmark'` (with safe inline fallback in Node/non-worker hosts), targeting ~60–150 ms total, cancellable via `AbortSignal`, and cached by coarse `hardwareFingerprint`.
   - Measures:
     - CPU single-thread FP32 throughput (`mopsPerSec`) and multi-worker scaling efficiency (`effectiveParallelSpeedup`, `scalingEfficiency`).
     - Self-contained WASM binary throughput (`mopsPerSec`, zero external fetch) + SIMD capability.
     - Bounded WebGPU compute FMA throughput (`computeGflopsProxy`, via `timestamp-query` when available else `queue.onSubmittedWorkDone`), storage-buffer streaming memory bandwidth (`memoryBandwidthGBps`, <= 8 MiB per buffer), and staging-buffer readback latency (`readbackLatencyMs`).
   - Emits normalized `scores`, `performanceClass` (`software | low | mid | high | workstation`), `recommendedWorkerCount`, and advisory `workingSetGuidance`.

3. **Layer 3 — Declarative Workload Right-Sizer & Shared Runtime Budget Governor** (`workloadSizer.js`, `runtimeBudgetGovernor.js`):
   - `sizeWorkload()` supports `count`, `grid3d`, `grid2d`, and `preset` shapes with hard guards for single storage buffer limits, 1D dispatch workgroup limits (`maxComputeWorkgroupsPerDimension * workgroupSize`), 3D/2D texture dimensions, and `O(N^2)` quadratic safety ceilings.
   - `createRuntimeBudgetGovernor()` provides hysteresis/cooldown-protected dynamic quality/tier scaling from frame time, queue pressure, and optional heap pressure.

## Integration Scope

- Core exports (`peercompute/src/peercompute/index.js`), `ComputeManager`, `GPUHubManager`, `wasmRuntime`, `NodeKernel._buildPresenceCapabilities()`, `PlacementAdmissionPolicy`, `taskRuntime`.
- Consumers: `demos/inference`, `demos/webgpuphys` (Toychest, MPM, PPF contact & cubic barrier), `demos/planetgen`, `demos/universes`, `demos/schrodinger`, `demos/netviz`.
- Explicitly skipped: `demos/multiscale` (preserved backwards compatibility only; no multiscale edits).

## Steps

- [x] Create `peercompute/src/peercompute/capabilities/` modules (`probeCapabilities`, `managedGpuDevice`, `benchmarkTask`, `capabilityBenchmark`, `workloadSizer`, `runtimeBudgetGovernor`, `index`).
- [x] Wire into core PeerCompute (`taskRuntime`, `GPUHubManager`, `wasmRuntime`, `ComputeManager`, `NodeKernel`, `PlacementAdmissionPolicy`, `index.js`).
- [x] Add comprehensive unit tests (`peercompute/tests/unit/capabilities.test.js`) + real headless/hardware Chromium browser capability & benchmark tests (`peercompute/tests/runtime/capabilities-browser.mjs`) + npm scripts `test:capabilities` / `test:capabilities:browser`.
- [x] Adopt in `demos/inference`, `demos/webgpuphys`, `demos/planetgen`, `demos/universes`, `demos/schrodinger`, `demos/netviz` (explicitly skipping `demos/multiscale`).
- [x] Verify core tests, demo tests, external Vite builds for all 6 demos, real Chromium Vulkan WebGPU hardware benchmark on NVIDIA Blackwell (catching and fixing an f32 exponential overflow in the initial WGSL FMA loop via the finite-output verifier), ICC freshness/plan gates, docs/log updates, and clean local commit.

## Verified Hardware Snapshot (2026-11-21, Chromium Vulkan WebGPU)

- Hardware: 32 cores, NVIDIA Blackwell hardware WebGPU (`timestamp-query` + `shader-f16`), `GPUHubManager` promoted `maxBufferSize = 4,294,967,292` bytes, WebGL2 `MAX_3D_TEXTURE_SIZE = 16384`.
- Worker microbenchmark (`executedInWorker: true`, total 439.1 ms, `cachedAcrossReload: true`): CPU single `969.93 Mops/s`, 4-worker parallel `4065 Mops/s` (`4.191x` speedup), WASM `750 Mops/s`, GPU compute `19565.27 GFLOPS` (`0.055 ms`), GPU 8 MiB streaming bandwidth `1763.79 GB/s` (`0.038 ms`), 64 KiB readback median `0.2 ms`, `performanceClass: "workstation"`.
