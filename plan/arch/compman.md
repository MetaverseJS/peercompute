# Compute Manager [compman] (Summary)

Status: draft; resource-aware compute dispatcher.

## Purpose
- Monitor local resources and dispatch compute jobs to CPU/WebGPU workers.

## Responsibilities
- Maintain a job queue and scheduling policy.
- Select CPU vs WebGPU execution based on workload and device limits.
- Track job progress and return results to NodeKernel/StateManager.

## Inputs
- Compute job requests from NodeKernel.
- Data buffers or references from DataState.
- Resource telemetry (GPU availability, CPU load).

## Outputs
- Job results and progress events.
- Backpressure signals when overloaded.

## Execution Context
- Manager on main thread; heavy compute runs in workers.

## Integration Contract
- enqueueJob(job)
- cancelJob(jobId)
- getMetrics()

## Failure Modes
- GPU device loss or worker crashes.
- Unbounded queue growth under bursty workloads.

## Testing
- Unit tests for scheduling decisions.
- Integration tests for CPU/GPU worker round-trips.

## Open Questions
- How to preempt or migrate long-running jobs?
