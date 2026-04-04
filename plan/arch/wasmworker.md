# WASM Compute Worker [wasmworker] (Summary)

Status: active; portable WebAssembly workload runtime.

## Purpose
- Execute portable compute kernels compiled to WASM when plain JS is too slow or when the same workload must run across CPU-only peers.

## Responsibilities
- Instantiate WASM modules from URLs or in-memory bytes.
- Populate exported memory from structured-cloneable task payloads.
- Run exported entry points and read typed-array outputs back to CPU-friendly deltas.
- Support adapter modules that convert WASM return values into `commitDelta` payloads.
- Provide the WASM half of hybrid `wasm-webgpu` workloads.

## Inputs
- Task descriptors with `wasm.source`, `entry`, args, imports, and memory view metadata.
- Optional result/import helper modules for worker-safe setup.

## Outputs
- Structured-cloneable results.
- Warm-layer `commitDelta` payloads via ComputeManager when adapter modules emit them.

## Execution Context
- Dedicated compute worker when available; inline fallback when workers are unavailable.

## Failure Modes
- Invalid module bytes or missing exports.
- Memory view descriptors that overrun the module's linear memory.
- Non-cloneable import objects passed to worker-backed tasks.

## Testing
- Unit tests for entry dispatch, memory view IO, adapter modules, and hybrid WASM+WebGPU host orchestration.

## Open Questions
- When do we cache compiled modules/device bindings across long-running tasks vs rebuilding for isolation?

