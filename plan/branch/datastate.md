Instructions: This file contains short term goals for the current branch.

## Implementation Plan: Layered DataState + GPU Hub

### Phase 0: Definitions + Contracts
- Define `commitDelta({ taskId, scope, version, payload, timestamp })` contract.
- Define warm-layer schemas per scope (netman/UI vs compute outputs).
- Define hot-layer ownership (GPU hub on main thread).

### Phase 1: Core DataState Layering
- Add `DataState` wrapper for hot/warm/cold layers.
- Implement hot GPU store (Map of taskId -> GPUBuffer set).
- Implement warm layer on Yjs map with optional namespaces.
- Treat IndexedDB persistence as the cold layer via y-indexeddb.

### Phase 2: StateManager Integration
- Instantiate DataState inside StateManager.
- Add `commitDelta` and hot-layer accessors.
- Provide `getDataState()` and warm-layer read helpers.

### Phase 3: GPU Hub + Compute Manager Wiring
- Add a `GPUHubManager` (main thread) to own shared-GPU buffers.
- NodeKernel creates GPU hub and passes hot-store to StateManager.
- ComputeManager gains `setCommitDeltaHandler` and auto-commit support.

### Phase 4: Netman + IO Expectations
- Netman reads only warm-layer deltas.
- IO/render uses hot GPU buffers when present.

### Phase 5: Validation
- Manual: verify commitDelta updates appear in warm layer and broadcast.
- Manual: ensure isolated compute tasks emit CPU deltas to warm layer.
- Log decisions and follow-up tasks in plan/log.md.

## Current Decisions
- GPU hub lives on the main thread.
- Isolated GPU workers emit CPU deltas.
- DataState is layered (hot GPU, warm CPU, cold IndexedDB).
