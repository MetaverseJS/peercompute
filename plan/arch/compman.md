# Compute Manager [compman] (Summary)

Status: active; resource-aware compute dispatcher with commitDelta plumbing.

## Purpose
- Monitor local resources and dispatch compute jobs to CPU/WebGPU workers.

## Responsibilities
- Maintain a job queue and scheduling policy.
- Select CPU vs WebGPU execution based on workload and device limits.
- Track job progress and return results to NodeKernel/StateManager.
- Support isolated GPU workers for out-of-band tasks that emit CPU deltas.
- Emit commit deltas from task results when provided.

## Inputs
- Compute job requests from NodeKernel.
- Data buffers or references from DataState.
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
- GPU device loss or worker crashes.
- Unbounded queue growth under bursty workloads.

## Testing
- Unit tests for scheduling decisions.
- Integration tests for CPU/GPU worker round-trips.

## Open Questions
- How to preempt or migrate long-running jobs?
