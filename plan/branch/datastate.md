Instructions: This file contains short term goals for the current branch.

## Implementation Plan: Layered DataState + GPU Hub

### Phase 0: Definitions + Contracts
- Define `commitDelta({ taskId, scope, version, payload, timestamp })` contract. (done)
- Define warm-layer schemas per scope (netman/UI vs compute outputs). (pending)
- Define hot-layer ownership (GPU hub on main thread). (done)

### Phase 1: Core DataState Layering
- Add `DataState` wrapper for hot/warm/cold layers. (done)
- Implement hot GPU store (Map of taskId -> GPUBuffer set). (done)
- Implement warm layer on Yjs map with optional namespaces. (done)
- Treat IndexedDB persistence as the cold layer via y-indexeddb. (done)

### Phase 2: StateManager Integration
- Instantiate DataState inside StateManager. (done)
- Add `commitDelta` and hot-layer accessors. (done)
- Provide `getDataState()` and warm-layer read helpers. (done)

### Phase 3: GPU Hub + Compute Manager Wiring
- Add a `GPUHubManager` (main thread) to own shared-GPU buffers. (done)
- NodeKernel creates GPU hub and passes hot-store to StateManager. (done)
- ComputeManager gains `setCommitDeltaHandler` and auto-commit support. (done)

### Phase 4: Netman + IO Expectations
- Netman reads only warm-layer deltas (provider available; schema pending).
- IO/render uses hot GPU buffers when present. (pending)

### Phase 5: Validation
- Unit: commitDelta and hot-store coverage. (done)
- Unit: compute -> commitDelta flow. (done)
- Unit: warm delta provider registration. (done)
- Manual: verify warm deltas are broadcast over netman. (pending)

## Current Decisions
- GPU hub lives on the main thread.
- Isolated GPU workers emit CPU deltas.
- DataState is layered (hot GPU, warm CPU, cold IndexedDB).

## Next Focus
- Define warm-layer schemas and network payload shape.
- Wire GPU hub into a real WebGPU render loop and register hot buffers.
- Confirm netman publishes warm deltas end-to-end.
