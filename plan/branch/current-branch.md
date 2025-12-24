Instructions: This file contains short term goals for the current branch.

## Branch Decisions
- GPU hub is owned by the main thread for shared-GPU render/compute tasks.
- ComputeManager supports isolated GPU workers for out-of-band workloads.
- DataState uses a hot/warm/cold layered model with explicit commit deltas.

## Immediate Follow-ups
- Update DataState interfaces to accept commitDelta payloads.
- Define warm-layer schemas for netman/UI.
- Add GPU hub scheduling budgets and telemetry.
