# WebGPU Compute Worker [wgpuworker] (Summary)

Status: implemented through the managed module-worker runtime. Tasks initialize WebGPU in their host module; the older compute/WebGPUComputeWorker.js remains a scaffold.

## Purpose
- Execute WebGPU compute pipelines for heavy parallel workloads.

## Responsibilities
- Initialize and manage WebGPU devices/queues.
- Run compute pipelines and return results to ComputeManager.
- Emit CPU-friendly deltas for DataState when running isolated workloads.
- Cooperate with WASM host modules for hybrid `wasm-webgpu` pipelines.
- Handle device loss and reinit when needed.

## Inputs
- Compute pipeline definitions and buffers.
- Dispatch parameters (workgroup sizes, iterations).

## Outputs
- Result buffers and timing metrics.
- Device/validation errors.
- CPU deltas for warm DataState commits.

## Execution Context
- Web Worker with WebGPU access.

## Failure Modes
- GPU device loss or validation errors.
- Overlapping GPU jobs causing queue starvation.

## Testing
- Smoke tests for pipeline setup and dispatch.
- Regression tests for buffer layout compatibility.

## Open Questions
- How to share GPU resources between jobs safely?

## Managed Model Inference Contract - 2026-11-03

[IPFS-01](../branch/ipfs-large-files-model-inference.md) requires Transformers.js
and ONNX Runtime to initialize and execute inside a WebGPU-capable module worker
owned by ComputeManager. A registered JS host module invokes the WebGPU backend;
the host-language tag and GPU execution provider are separate properties.
ComputeManager owns admission, worker affinity/residency, scheduling, cancellation,
and teardown. ONNX Runtime owns the model's GPU operators and buffers within that
worker. Required-worker admission prevents inline fallback. Keep ORT proxy workers
disabled and initially cap WASM support threads at one. Verify worker ownership
and actual GPU execution; worker-only tokenization is insufficient.

The implemented path is computeWorker.js → workerTaskHost.js → taskRuntime.js
→ fixed lazy module peercompute:model-inference. The older standalone
compute/WebGPUComputeWorker.js skeleton is not this execution path. Protocol v2
adds progress, abort and worker/task identity; resident reservations survive idle
pool resizing. Failed termination retains ownership and memory admission for
retry. Actual Qwen/SmolVLM browser GPU acceptance is tracked in the branch plan.
