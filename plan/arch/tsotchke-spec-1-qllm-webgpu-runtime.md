# Tsotchke Handoff Spec Sheet 1: `semiclassical_qllm` WebGPU-Enabled WASM Runtime for PeerCompute (`demos/inference/`)

- **Document ID:** `PC-SPEC-QLLM-RT-001` (`v1.0`)
- **Date:** 2026-11-25
- **Owner / Implementer:** Tsotchke (`semiclassical_qllm` C / WASM / WebGPU runtime team)
- **Consumer / Integrator:** PeerCompute (`peercompute/inference` & `demos/inference/`)
- **Companion Spec:** [Spec Sheet 2 — Custom `qLLM` Model Suite for Humunculus](tsotchke-spec-2-humunculus-qllm-models.md)
- **Grounded Baselines:**
  - `semiclassical_qllm`: `codex/qwen35-native-hybrid-parity-20260908` @ `5d9e9d2` (`backend.h`, `shaders_manifest.json`, `eskb_checkpoint.h`, `grr_inference.h`, `hybrid_inference.h`, `directed_sheaf.h`, `geometric_vocabulary.h`, `CMakeLists.txt`)
  - PeerCompute: `main` @ `81f7dc6d` (`ModelInferenceService.js`, `ArtifactReadBridge.js`, `GgufArtifactReader.js`, `gguf/{runtimeDefinition,engine,modelTask}.js`, `PeerInferenceService.js`, `ModelEvidenceStore`, `tsotchkeModelCatalog.js`)

---

## 1. Objective & Scope

Build a **WebGPU-enabled WebAssembly runtime (`qllm-wasm`)** from `semiclassical_qllm` so PeerCompute's browser inference demo (`demos/inference/`) and optional inference layer (`peercompute/inference`) can load, verify, stream-generate from, cancel, and peer-host models produced by `semiclassical_qllm` and `GeoRefine`.

### In Scope (This Spec Sheet)
1. A trimmed, Emscripten-compilable inference-only CMake target (`-DQLLM_WASM_INFERENCE=ON`) in `semiclassical_qllm`.
2. A new `QLLM_BACKEND_WEBGPU` compute backend (`src/backend/backend_webgpu.c`) written against standard `webgpu/webgpu.h` (`emdawnwebgpu` for browsers; Dawn / `wgpu-native` for native headless `ctest` parity) with WGSL compute kernels.
3. Bounded virtual-filesystem (`qllm_vfs_t`) range-read integration compatible with PeerCompute's `ArtifactReadBridge` (CID + SHA-256 verified, zero `mmap`, zero unmanaged network calls).
4. A fixed same-origin JS/WASM artifact deliverable and ABI contract that plugs cleanly into PeerCompute's `ModelInferenceService` (`peercompute:qllm-inference`), `PeerInferenceService`, `ModelEvidenceStore`, and `demos/inference/` console.
5. Support for `semiclassical_qllm`'s inference artifact formats:
   - **`WESKB001` (`.eskb`)** FP32 GeometricLM checkpoints (including A4 causal directed sheaf, Poincaré/spherical embeddings, Born heads, KAN).
   - **`qllm-grr`** GRR networks + streaming binary geometric vocabularies (`*.gvocab`) + hybrid Transformer+GRR contexts.
   - **`georefine-v2`** export directories (`compression_info.json` schema ≤ 2 + SafeTensors + optional `head_importance*.safetensors` / `class_codebook.safetensors`), including `5d9e9d2` Qwen3.5/3.6 hybrid DeltaNet/GQA + fused/shared MoE.
6. Explicit hooks required by Spec Sheet 2 (`step`, multi-entity isolated state slots, and `QLLMST01` portable state serialization) exposed cleanly at the ABI boundary so Humunculus models can run on the exact same runtime without a rewrite.

### Out of Scope (Non-Goals for v1)
- Modifying `peercompute/core` (must remain **0 `.wasm` files** and zero inference dependencies).
- Browser-side model training, backpropagation, or Riemannian optimizer updates (`qllm_training`, `qllm_gradient_tape_t` remain excluded from the v1 browser runtime).
- Executing CUDA-only GeoRefine codec containers (`BCTX`/`PPCX` or `georefine.tbe.serve.v1`) — these must be rejected cleanly at admission.
- Executing Torch-only output heads (`born_mix`, `mos`) that have no native C forward kernel — must fail closed at admission.
- TypeScript or React runtime wrappers (PeerCompute ships vanilla ES6 modules bundled by Vite).

---

## 2. Deliverable Artifacts & Dual Browser Profiles

Tsotchke delivers **two pinned Emscripten build profiles** from the same `QLLM_WASM_INFERENCE` source tree, packaged as fixed same-origin static files (never downloaded from untrusted model manifests):

| Profile | Deliverable Files | Target Models | Browser Capability Requirements |
|---|---|---|---|
| **`compact-wasm32`** | `qllm-webgpu-compact.mjs`<br>`qllm-webgpu-compact.wasm` | Models ≤ **256 MiB** weights (small `.eskb` GeometricLMs, GRR heads, and Spec Sheet 2 Humunculus policies/routers/world models). | Hardware WebGPU adapter (`!isFallbackAdapter`). **Must NOT require `shader-f16`, `memory64`, JSPI, or `crossOriginIsolated`.** |
| **`large-wasm64`** | `qllm-webgpu-large.mjs`<br>`qllm-webgpu-large.wasm` | Models **> 256 MiB** up to browser admission caps (`qLLM-Small` 192M, GeoRefine v2 text/VLM exports, Qwen3.5/3.6 hybrids). | `crossOriginIsolated`, `SharedArrayBuffer`, WebAssembly JSPI (`Suspending`/`promising`), shared `memory64` (`address: 'i64'`), and hardware WebGPU adapter (`shader-f16` required **only** if manifest requests f16 kernels). |

### Packaging Rules
- **Single-threaded WASM inside PeerCompute's managed worker:** Compile with `pthreadPoolSize = 0` / no background Emscripten worker spawning. PeerCompute's `ComputeManager` exclusively owns worker lifecycle, affinity, cancellation, and termination.
- **No dynamic `eval`, no CDN fetches, no sidecar URLs:** `locateFile(name)` must accept ONLY the exact pinned `.wasm` filename; WGSL shaders should be embedded inside the `.wasm` binary (minified const strings in C) so runtime asset validation needs only `{ mjs, wasm }` (matching PeerCompute's `validateRuntimeAssets`).
- **Explicit CPU-WASM fallback policy:** The runtime may include `backend_cpu.c` (compiled with `-msimd128`) ONLY for explicit caller-selected `backend: 'wasm-cpu'` (e.g., tiny ≤ 32 MiB diagnostic/control tasks or CI unit tests). When `backend: 'webgpu'` is requested, **CPU fallback is disabled and must fail closed**.

---

## 3. Lean CMake Target (`-DQLLM_WASM_INFERENCE=ON`)

`semiclassical_qllm` must provide a dedicated CMake option `-DQLLM_WASM_INFERENCE=ON` (buildable with pinned `emsdk` via `emcmake cmake`) that compiles only the portable inference subset:

### 3.1 Included Subsystems
- **`qllm_core` (trimmed):** `tensor.c`, `tensor_math.c`, `tensor_pool.c`, `memory.c`, `error.c`, `kv_cache.c`, `safetensors.c`, `config.c`, `fourier_optimized.c`, `rational_function.cpp`, plus statically linked/vendored `cJSON`.
- **`qllm_geometric`:** Poincaré ball (`hyperbolic*.c`), spherical (`spherical*.c`), product manifold (`product*.c`), geodesic solvers, projection, `geometric_simd.c` (portable scalar + WASM SIMD128 path).
- **`qllm_model` (inference subset):** `eskb` forward runner, `attention.c`, `attention_directed_sheaf.c`, `directed_sheaf.c`, `born_rule.c`, `born_head_complex.c`, `born_head_magnitude.c`, `grr.c`, `grr_inference.c`, `hybrid_inference.c`, `deltanet_cpu.c`, `transformer_with_embedding.c`, `moe.c`, `kan*.cpp`, `geometric_vocabulary.c`, `tokenizer_bpe.c`, `streaming_tokenizer.c`, `generation.c`, `constrained_decode.c`, `vision.c`, `vlm.c`.
- **`qllm_loader`:** `eskb_checkpoint.c`, `hf_loader.c`, `lora_loader.c`, `model_loader.c` compiled with `-DQLLM_NO_MMAP=1` and routed through the pluggable `qllm_vfs_t` byte-range reader.
- **`qllm_quantization`:** Weight unpackers / dequantization helpers for quantized GeoRefine exports.
- **`qllm_backend`:** `backend.c`, `backend_cpu.c`, and **new `backend_webgpu.c`**.

### 3.2 Explicitly Excluded from `QLLM_WASM_INFERENCE`
- `qllm_network` (OpenSSL / `http_client.c`) — zero network sockets from WASM.
- `qllm_agent` (`subprocess.c`, `system_bridge.c`, `agent_bridge.c`).
- `qllm_training`, `qllm_optimization`, `qllm_ffi` (`eshkol_ffi.c`), `grr_training.c`.
- `backend_cuda.c`, `kernels.cu`, `backend_metal.m`, `backend_metal_sheaf.m`, `tensorcore_adapter.c`, `qgtl_bridge.c`.
- `OpenMP`, `Accelerate`, `OpenBLAS`, `dlopen`, `mmap`, and POSIX signal/backtrace handlers (`execinfo.h`).

---

## 4. `QLLM_BACKEND_WEBGPU` & WGSL Kernel Specification

### 4.1 C Backend Interface (`webgpu/webgpu.h`)
Add `QLLM_BACKEND_WEBGPU` to `qllm_backend_type_t` in `include/semiclassical_qllm/backend.h` and implement `src/backend/backend_webgpu.c` against the standardized **`webgpu/webgpu.h` C API**:
- **Browser target:** Build with Emscripten `--use-port=emdawnwebgpu`.
- **Native test target:** Build the exact same `backend_webgpu.c` against Dawn or `wgpu-native` on Linux/macOS (`old-donkey`) so every WGSL kernel runs under native `ctest` parity checks against `backend_cpu.c` and PyTorch goldens.

### 4.2 PeerCompute `GPUDevice` Ownership & Telemetry Injection
PeerCompute MUST retain visibility over the WebGPU device to enforce hardware-only execution, memory tracking, and device-loss cleanup (matching PeerCompute's `gguf/engine.js:71-107` pattern):
- The Emscripten module initialization MUST invoke a host callback `peercomputeOnDevice(gpuDevice)` (or accept an externally created `GPUDevice` passed at init) **before** creating buffers or pipelines.
- PeerCompute wraps `device.createBuffer`, `device.createCommandEncoder`, `device.queue.submit`, and `device.lost` to collect verifiable evidence:
  - `runtimeAdapter` (`vendor`, `architecture`, `isFallbackAdapter === false`),
  - `runtimeFeatures` (exact enabled WebGPU feature list),
  - `gpuDispatches` & `gpuSubmissions` (proving real GPU work happened),
  - `requestedGpuBufferPeakBytes`, and
  - immediate fatal session quarantine on `device.lost`.

### 4.3 Mandatory GPU Execution & Precision Invariants
1. **GPU-resident graph execution:** Weights, KV caches, DeltaNet recurrent matrices, and directed-sheaf caches MUST remain in `WGPUBuffer`s across tokens. Never bounce intermediate layer activations back to WASM CPU memory.
2. **Batched command submission:** Record an entire token decode step (or bounded layer group) into a single `WGPUCommandEncoder` and submit once per step; read back only the minimal output (sampled token ID / bounded logits / action vector + scalar telemetry).
3. **Automatic multi-buffer tensor sharding:** Query `device.limits.maxStorageBufferBindingSize` and `device.limits.maxBufferSize` at init. Any tensor exceeding `maxStorageBufferBindingSize` (notably 248,320-token FP32 embedding and LM-head matrices) MUST be automatically row-sharded across multiple `WGPUBuffer`s inside `backend_webgpu.c`.
4. **FP32 numerical safety on curved manifolds:** Even when `shader-f16` is enabled for linear GEMMs, **all** Poincaré ball ops (`exp_map`, `log_map`, `mobius_add`, `hyperbolic_distance`, `conformal_factor`), RMSNorm/LayerNorm reductions, softmax/Born normalizers, and causal directed-sheaf CFL norm certificates MUST execute in **FP32** to avoid boundary NaN/Inf divergence near `‖x‖ → 1/√c`.
5. **No WebGPU `timestamp-query` hard requirement:** Timing telemetry uses wall-clock performance counters unless `timestamp-query` is optionally negotiated.

### 4.4 Phased WGSL Kernel Matrix (Mapped from `src/backend/shaders_manifest.json`)

| Phase | Target Workloads | Required WGSL Kernels | Special Constraints |
|---|---|---|---|
| **Phase 1 (MVP)** | `.eskb` (`WESKB001`) GeometricLMs, A4 causal directed sheaf, Born heads, KAN, and Spec Sheet 2 compact policies | `gemm_f32` / `gemv_f32` (tiled workgroup shared mem) + optional `gemm_f16_acc_f32`, `rmsnorm`, `layernorm`, `residual_add`, `vec_{add,mul,scale}`, `relu`/`gelu`/`silu`, `fused_swiglu_{gate_up,down}`, `embedding_gather` (row-sharded), `fused_rope`, `kv_cache_append`, `flash_attention` (causal tiled), `mha_decode`, `masked_softmax`, `reduce_{max,sum}`, `exp_map`, `log_map`, `mobius_add`, `hyperbolic_distance`, `spherical_distance`, `product_manifold_distance`, `born_rule_{amplitudes,normalize}`, `complex_born_readout`, `born_magnitude_readout`, `kan_basis_eval`, **fused `directed_sheaf_score_topk` + `directed_sheaf_d_apply`**. | **Fused directed sheaf is load-bearing:** `old-donkey`'s `selection_is_constant_not_exponent` evidence proved 90.6% of sheaf time was unfused top-k selection (`22–39×` over GEMM floor). Fuse causal Q·Kᵀ scoring (Euclidean or HELM Lorentzian `-d_L²/√m` using A.4 sign & eq. 7 fix) + per-row top-`k` + PSD degree `diag(Σ\|w\|)` + CFL check `dt·D_i < 1` in workgroup memory; emit per-layer `max_norm` telemetry. |
| **Phase 2 (Hybrid & GeoRefine)** | Qwen3.5/3.6 hybrid (`5d9e9d2`), GRR + binary vocab, GeoRefine v2 text exports | `deltanet_conv_silu`, `deltanet_recurrence` (asymmetric stateful), `attention_gate`, `moe_gate_topk` + fused/shared expert GEMV, `fused_rmsnorm_gemv`, `product_manifold_attention`, `geodesic_attention`, `phase_attention_forward`, `frechet_mean_step`, `parallel_transport_{hyp,sph}`, INT8 / INT4 / Q4_K / IQ4_XS dequant-in-register GEMV. | Must match `5d9e9d2` `tests/fixtures/qwen_hybrid/` CPU reference golden within `abs ≤ 1e-4, rel ≤ 1e-3`. |
| **Phase 3 (Vision/VLM)** | GeoRefine v2 ViT / VLM exports (`batch = 1`) | ViT patch embedding, 2D positional interpolation, vision attention/MLP blocks, multimodal splice (`batch = 1` enforced, rejecting learned text pos-encodings per `README.md`). | Strictly `batch = 1`; reject `text_tokens->shape[0] > 1` with `QLLM_ERROR_INVALID_ARGUMENT`. |

---

## 5. Virtual File I/O & Host ↔ WASM ABI Contract

### 5.1 Bounded Virtual File System (`qllm_vfs_t`)
PeerCompute never hands a multi-GB `ArrayBuffer` or HTTP fetch capability to WASM. Every model file is served over a `MessagePort` (`peercompute.model-artifact-read.v1`) in verified `≤ 4 MiB` chunks via `ArtifactRangeReader`:

```c
typedef struct qllm_vfs {
    void* user_data;
    int64_t (*file_size)(void* user_data, const char* path);
    /** Read exact [offset, offset+len) into dst (len <= 4 MiB). Returns bytes read or <0 on error/abort. */
    int64_t (*read_range)(void* user_data, const char* path,
                          uint64_t offset, uint64_t len, uint8_t* dst);
} qllm_vfs_t;
```

- **`large-wasm64`:** Bridges `read_range` directly to JS `async read(path, offset, len, { signal })` via WebAssembly JSPI (`WebAssembly.Suspending`). `eskb_checkpoint.c`, `safetensors.c`, and `hf_loader.c` stream one tensor at a time into a reusable `≤ 16 MiB` staging buffer and immediately upload to `WGPUBuffer` via `wgpuQueueWriteBuffer`, keeping WASM linear memory bounded.
- **`compact-wasm32`:** Does not require JSPI. Host JS pre-streams manifest files in `4 MiB` chunks via an explicit chunk-push API (`qllm_wasm_stage_begin / qllm_wasm_stage_chunk / qllm_wasm_stage_commit`) that uploads tensors directly into GPU buffers before model init.
- **No `mmap`:** Attempting `mmap` on `/models/*` must fail immediately.

### 5.2 Exported C / WASM ABI (`qllm_wasm_api.h`)
All functions use opaque `uint64_t` handles (`0 == invalid`) and bounded length-prefixed buffers (max control message `1 MiB`, matching `gguf/engine.js:8`):

| Exported Symbol | Purpose | Notes |
|---|---|---|
| `qllm_wasm_abi_version()` | Returns `uint32_t` ABI version (`1`) + capability bitmask (`WEBGPU`, `SIMD128`, `MEMORY64`, `JSPI`). | Verified on worker bind; mismatch fails closed. |
| `qllm_wasm_alloc(size)` / `qllm_wasm_free(ptr)` | Bounded WASM heap allocation for request/response buffers. | `uint64_t` offsets on `wasm64`, `uint32_t` on `wasm32`. |
| `qllm_wasm_init(config_json_ptr, len)` | Initializes backend (`webgpu` or explicit `cpu`), queries `GPUDevice` limits, returns JSON device/limit report. | Fails closed if requested `webgpu` device is unavailable or fallback. |
| `qllm_wasm_load(req_json_ptr, len)` | Opens & validates model (`eskb` / `qllm-grr` / `georefine-v2`) from VFS, allocates GPU weights + `max_entities` state slots, returns JSON load report (`n_ctx`, buffer sizes, sharded tensors, geometry metadata, `actual_backend`). | Rejects `born_mix`/`mos`, bad magic, shape overflow, `BCTX`/`TBE` codecs, `cn` solver above seq cap. |
| `qllm_wasm_generate_start(req_json_ptr, len)` | Starts chat/text/VLM request (`messages` or `token_ids`, `max_tokens`, sampling params, optional grammar/JSON constraint, `seed`). Returns `req_id`. | Native C `streaming_tokenizer.c` / `tokenizer_bpe.c` tokenizes inside WASM (zero Python/Torch deps). |
| `qllm_wasm_generate_step(req_id, out_ptr, cap)` | Advances **one token** (yielding cleanly to worker event loop so PeerCompute `AbortSignal` / `cancel` takes effect between tokens). Writes JSON delta (`text`, `token_id`, `finish_reason`, `prompt_tokens`, `predicted_tokens`, `operating_point_u`, `sheaf_max_norm`, `born_entropy`, `has_more`). | Never buffers unbounded output; enforces `max_output_bytes`. |
| `qllm_wasm_cancel(req_id)` | Cancels active generation and marks request drained. | Host calls `device.queue.onSubmittedWorkDone()` before reusing session. |
| `qllm_wasm_step(req_ptr, obs_f32_ptr, mask_u8_ptr, out_action_f32_ptr, out_meta_ptr)` | **Humunculus hook (Spec Sheet 2):** Executes one deterministic forward pass for `entity_id` with zero-copy `Float32Array` observation input and action output + telemetry. | Supports `max_entities` isolated state slots over shared GPU weights. |
| `qllm_wasm_checkpoint_state(entity_id, meta_json_ptr, out_buf_ptr, out_len_ptr)` | **Humunculus hook (Spec Sheet 2):** Flushes GPU queue and serializes `entity_id`'s state tensors into portable little-endian FP32 **`QLLMST01`** bytes. | Zero vendor-specific GPU memory layouts. |
| `qllm_wasm_restore_state(entity_id, buf_ptr, buf_len)` | **Humunculus hook (Spec Sheet 2):** Validates `QLLMST01` header, policy CID, tensor shapes, and finite values (`!NaN/Inf`), and uploads into `entity_id`'s GPU slot. | Rejects corrupt, mismatched-policy, or non-finite state fail-closed. |
| `qllm_wasm_reset_entity(entity_id)` | Resets one entity's KV / directed-sheaf / DeltaNet / GRR state without touching weights or other entities. | Safe between episodes or on cancellation. |
| `qllm_wasm_unload()` / `qllm_wasm_shutdown()` | Releases all `WGPUBuffer`s, pipelines, and WASM arenas. | PeerCompute also terminates the dedicated worker on unload (`terminateOnUnload: true`). |
| `qllm_wasm_last_error_code()` | Returns structured `qllm_error_code_t` + sanitized category string. | **Never** echoes prompt text, tokens, or raw user data in error strings. |

---

## 6. PeerCompute `demos/inference/` Integration Contract

PeerCompute will wrap Tsotchke's delivered JS/WASM bundle under `peercompute/src/peercompute/inference/qllm/` following the exact architecture of `peercompute/src/peercompute/inference/gguf/`:

### 6.1 Manifest Schema (`peercompute.artifact.manifest.v1`)
```json
{
  "schema": "peercompute.artifact.manifest.v1",
  "id": "qllm-small-sheaf-v1",
  "files": [
    { "path": "model.eskb", "cid": "bafkrei...", "size": 768000000, "sha256": "<64-hex>" },
    { "path": "tokenizer.json", "cid": "bafkrei...", "size": 4194304, "sha256": "<64-hex>" },
    { "path": "qllm-attestation.json", "cid": "bafkrei...", "size": 1024, "sha256": "<64-hex>" }
  ],
  "model": {
    "runtime": "semiclassical-qllm",
    "runtimeVersion": "0.1.0",
    "format": "eskb",
    "profile": "large-wasm64",
    "architecture": "qllm_geometric_lm",
    "task": "text-generation",
    "dtype": "fp32",
    "modalities": ["text"],
    "requiredFeatures": [],
    "qllm": {
      "attentionKind": "sheaf",
      "sheafMode": "causal_directed",
      "outputHeadMode": "linear",
      "maxSeqLen": 2048
    },
    "provenance": {
      "sourceRepo": "Tsotchke-Corporation/semiclassical_qllm",
      "sourceCommit": "5d9e9d2",
      "campaignStage": "P4/V4",
      "parityReceipt": "abs<=1e-4,rel<=1e-3",
      "limitations": "State exact tested scope and known limits here."
    }
  }
}
```

### 6.2 Registration, Admission & Peer Hosting
- **Task Module Registration:** `registerBuiltinTaskModule('peercompute:qllm-inference', () => import('./qllm/modelTask.js'))` inside `peercompute/src/peercompute/inference/registerTaskModules.js`.
- **Resource Admission:** Conservative `{ cpuBytes, gpuBytes }` envelope computed from the inspected `WESKB001` / `GeoRefine v2` config (mirroring `qllm_hybrid_estimate_memory_budget`) before worker dispatch; never derived from `navigator.deviceMemory` or `adapter.limits.maxBufferSize`.
- **Peer Hosting (`PeerInferenceService`):** Because `qllmRuntimeDefinition` runs through `ModelInferenceService`, any `qllm` model loaded in `demos/inference/` automatically works with PeerCompute's authenticated Noise `PeerInferenceService` (including native Root Nodes running `libsemiclassical_qllm.{so,dylib}` on `old-donkey` / `cosbox` / `atlas` serving larger models over the same peer protocol!).
- **Telemetry (`ModelEvidenceStore`):** Every load and generation logs `runtime: 'semiclassical-qllm'`, `profile`, `actualBackend`, `adapter`, `runtimeFeatures`, `gpuDispatches`, `gpuSubmissions`, `requestedGpuBufferPeakBytes`, `wasmMemoryBytes`, `operatingPointU`, and `sheafMaxNorm`.

---

## 7. Handoff Verification & Acceptance Gates

Tsotchke's runtime deliverable is ready for PeerCompute integration when **all** gates below pass with reproducible scripts and receipts:

| Gate | Requirement | Pass Criterion |
|---|---|---|
| **RT-0 · Clean Emscripten Build** | Build both `compact-wasm32` and `large-wasm64` from pinned `emsdk` with `-DQLLM_WASM_INFERENCE=ON`. | Zero host POSIX/OpenSSL/OpenMP/CUDA/Metal link dependencies; `compact-wasm32` gzipped `.wasm` ≤ **3 MB** target; `0` `mmap` calls during load. |
| **RT-1 · WASM-CPU Reference Parity** | Run `tests/fixtures/qwen_hybrid/` (`5d9e9d2`) and synthetic `.eskb` fixtures (`softmax`, `causal_directed` sheaf, `complex_born`, `born_magnitude`, `kan`) in Node WASM. | Max abs logit delta vs native C CPU reference **`≤ 1e-5`**; deterministic token IDs match 100%. |
| **RT-2 · Native & Browser WebGPU Parity** | Run the same fixtures through `backend_webgpu.c` on native Dawn/`wgpu-native` (`ctest`) AND headless Chrome WebGPU. | FP32 **`abs ≤ 1e-4`**, **`rel ≤ 1e-3`** vs native C CPU reference; **0** NaN/Inf on Poincaré boundary stress test (`‖x‖ = 0.999/√c`); directed-sheaf certificate **`max_norm ≤ 1.000001`**; `gpuDispatches > 0` and `gpuSubmissions > 0`. |
| **RT-3 · Oversized Buffer Sharding** | Load a fixture whose embedding/LM-head tensor exceeds a tightened `maxStorageBufferBindingSize` (e.g., artificially clamped to 16 MiB). | Automatic row-sharding succeeds with identical logits (`abs ≤ 1e-4`), zero WebGPU validation errors. |
| **RT-4 · Bounded Streaming I/O** | Load a > 256 MiB fixture in `large-wasm64` via `qllm_vfs_t` with `4 MiB` chunk cap. | Peak WASM linear memory stays bounded (no whole-file copy); zero `Blob`/whole-file allocation; `AbortSignal` mid-load aborts cleanly within 250 ms. |
| **RT-5 · Fail-Closed Security & Negative Gates** | Feed corrupt WESKB magic, truncated files, `..` paths in `compression_info.json`, `output_head_mode: 'born_mix'` / `'mos'`, `BCTX`/`TBE` codec package, fallback WebGPU adapter, and forced `device.lost`. | Every negative case rejects with structured error code, zero prompt leakage in error text, zero silent CPU fallback, and clean worker termination / memory release. |
| **RT-6 · Directed-Sheaf Throughput Receipt** | Benchmark WGSL fused `directed_sheaf` (`K=1`) vs WGSL `flash_attention` across `S ∈ {256, 512, 1024, 2048}` on reference desktop WebGPU. | Raw wall-clock ratio and tok/s published honestly alongside parity receipts (disclosing cost per `QLLM_PAPER_CLAIMS_LEDGER.md` T8 obligation). |
| **RT-7 · PeerCompute `demos/inference/` End-to-End** | Load a real `.eskb` (and Phase-2 GeoRefine v2) bundle from `ArtifactStore` inside headless Chrome `demos/inference/` + verify `demo-release.test.js`. | Streaming chat generation + cancellation + reload passes; **0** `.wasm` files in `peercompute/core`; **0** raw base64 unbundled worker leaks. |
