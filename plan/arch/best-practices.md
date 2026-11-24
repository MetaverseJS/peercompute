# Engineering best practices

- **Separation of concerns.** Keep core transport, state, scheduling, resource leases, GPU residency, and optional inference cleanly separated behind explicit interfaces (`peercompute/core` must have zero static, dynamic, or worker-URL import edges into `src/peercompute/inference/` or heavy ONNX/WASM packages).
- **Fail closed at trust and epoch boundaries.** Reject invalid policies, stale epochs, non-owner submissions, unavailable quorum responders, and unverified remote bytes before mutating authoritative state.
- **Modular ES6 modules & fractal design.** Repeat consistent patterns, schemas, and lifecycle contracts (`initialize` / `destroy`, explicit ownership tokens, defensive copies) across the entire codebase.
- **Latest LTS & supported dependencies.** Pin Node.js 24 LTS and prefer mature, battle-tested libraries over ad-hoc shims.
- **Hardware-aware concurrency.** Leverage WebGPU compute concurrency, worker pools, warm affinity reuse, and bounded zero-copy/compact binary exchanges rather than sequential main-thread loops or full-array network syncs.
- **Honest capability & memory reporting.** Label `navigator.deviceMemory` as a coarse browser hint, never equate `maxBufferSize` with physical VRAM, and gate GPU allocations through `ResourceLeaseBroker`.
- **Zero domain physics inside PeerCompute core.** Treat boundary summaries, artifacts, and task payloads as opaque bytes/descriptors with provenance digests.
- **Branch-scoped development history.** Maintain one detailed development log per Git branch under `plan/log/detail/<branch>.md` (replacing `/` with `--`) so parallel branches do not conflict on a monolithic log; keep `plan/log/log-summary.md` concise.
