# CPU Compute Worker [cpuworker] (Summary)

Status: draft; CPU-bound compute worker.

## Purpose
- Execute compute jobs that are not GPU-friendly or are low-latency.

## Responsibilities
- Run deterministic CPU tasks off the main thread.
- Return results and timing metrics to ComputeManager.

## Inputs
- Job payloads and data buffers.
- Execution hints (priority, timeout).

## Outputs
- Result buffers or structured outputs.
- Error and timeout signals.

## Execution Context
- Web Worker; no DOM access.

## Failure Modes
- Timeouts or stalled workers.
- Large payload transfers causing frame stalls.

## Testing
- Unit tests for job handlers.
- Performance tests for transfer costs.

## Open Questions
- When to use transferable buffers vs shared memory?
