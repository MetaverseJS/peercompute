Instructions: This file contains short term goals for the current branch.

## Branch Decisions
- GPU hub is owned by the main thread for shared-GPU render/compute tasks.
- ComputeManager supports isolated GPU workers for out-of-band workloads.
- DataState uses a hot/warm/cold layered model with explicit commit deltas.

## Completed This Branch
- commitDelta support wired through DataState, StateManager, and ComputeManager.
- GPUHubManager scaffolding for hot buffer sets and shared-GPU ownership.
- Warm delta provider hook on NetworkManager (pending publish path).

## Immediate Follow-ups
- Define warm-layer schemas for netman/UI.
- Wire warm deltas into netman publishing end-to-end.
- Add GPU hub scheduling budgets and telemetry.
