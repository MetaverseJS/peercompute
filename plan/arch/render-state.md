# Render State Object (Summary)

Status: draft; visual state view for rendering.

## Purpose
- Provide a render-friendly view of DataState for the UI/renderer.

## Responsibilities
- Translate DataState into scene-ready data.
- Maintain minimal derived state for fast render updates.
- Avoid heavy allocations in the render loop.

## Inputs
- DataState snapshots/deltas from StateManager.
- Render configuration (quality, LOD, perf caps).

## Outputs
- Scene updates for the renderer (three.js).
- Render metrics for performance tuning.

## Execution Context
- Main thread (renderer), optionally assisted by workers.

## Failure Modes
- Stale or partial state leading to visual glitches.
- Large diffs causing frame drops.

## Testing
- Visual regression checks.
- Performance profiling on low-end devices.

## Open Questions
- How much derived state should live here vs in DataState?
