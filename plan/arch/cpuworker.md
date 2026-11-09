# CPU Compute Worker [cpuworker] (Summary)

Status: implemented through computeManager/computeWorker.js → workerTaskHost.js → taskRuntime.js. The older compute/CPUComputeWorker.js is a scaffold, not this runtime.

## Purpose
- Execute compute jobs that are not GPU-friendly or are low-latency.

## Responsibilities
- Run CPU tasks off the main thread; deterministic behavior is the application's responsibility.
- Return results and timing metrics to ComputeManager.

## Inputs
- Job payloads and data buffers.
- Cancellation signal, progress callback, transferables and worker affinity.

## Outputs
- Result buffers or structured outputs.
- Error and timeout signals.

## Execution Context
- Web Worker; no DOM access.

## Failure Modes
- Stalled workers; ordinary local tasks do not enforce a per-task execution timeout.
- Large payload transfers causing frame stalls.

## Testing
- Unit tests for job handlers.
- Performance tests for transfer costs.

## Open Questions
- When to use transferable buffers vs shared memory?
