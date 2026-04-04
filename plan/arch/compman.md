# Compute Manager [compman] (Summary)

Status: active; resource-aware compute dispatcher with JS/WASM/WebGPU task runtimes and commitDelta plumbing.

## Purpose
- Monitor local resources and dispatch compute jobs to JS, WASM, WebGPU, or hybrid WASM+WebGPU workers.

## Responsibilities
- Maintain a job queue and scheduling policy.
- Select JS vs WASM vs WebGPU execution based on workload portability and device limits.
- Track job progress and return results to NodeKernel/StateManager.
- Support isolated GPU workers for out-of-band tasks that emit CPU deltas.
- Support result/import helper modules for worker-safe WASM execution.
- Support hybrid `wasm-webgpu` tasks where WASM preprocessing and WebGPU dispatch happen in the same worker.
- Emit commit deltas from task results when provided.

## Inputs
- Compute job requests from NodeKernel.
- Data buffers or references from DataState.
- WASM module bytes/URLs and hybrid host modules.
- Resource telemetry (GPU availability, CPU load).

## Outputs
- Job results and progress events.
- Backpressure signals when overloaded.
- DataState commit deltas for isolated GPU tasks.

## Execution Context
- Manager on main thread; heavy compute runs in workers.

## Integration Contract
- submitTask(task)
- cancelTask(taskId)
- getCapabilities()
- getStats()
- setCommitDeltaHandler(fn)

## Failure Modes
- GPU device loss, invalid WASM modules, or worker crashes.
- Unbounded queue growth under bursty workloads.

## Testing
- Unit tests for scheduling decisions.
- Integration tests for CPU/GPU worker round-trips.

## Open Questions
- How to preempt or migrate long-running jobs?
