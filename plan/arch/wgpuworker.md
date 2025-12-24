# WebGPU Compute Worker [wgpuworker] (Summary)

Status: draft; GPU compute worker.

## Purpose
- Execute WebGPU compute pipelines for heavy parallel workloads.

## Responsibilities
- Initialize and manage WebGPU devices/queues.
- Run compute pipelines and return results to ComputeManager.
- Emit CPU-friendly deltas for DataState when running isolated workloads.
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
