# State Manager [stateman] (Summary)

Status: active; coordinates DataState and State Workers.

## Purpose
- Maintain the authoritative local DataState.
- Apply updates from network, IO, and compute in a consistent order.

## Responsibilities
- Dispatch State Workers to read/write DataState in parallel.
- Apply CRDT/merge rules (Yjs-based) for concurrent edits.
- Emit snapshots/deltas for NetworkManager and render paths.
- Persist state to IndexedDB for reloads/offline recovery.

## Inputs
- Local input-driven mutations.
- Network snapshots/events/clock updates.
- Compute results and derived data.

## Outputs
- State snapshots/deltas to NetworkManager.
- Render-ready state to Render State Object.
- Storage commits and local cache updates.

## Data + Storage
- Hierarchical DataState persisted in IndexedDB (y-indexeddb).
- Structured to keep buffer interop simple (arrays, typed arrays).

## Execution Context
- Manager on main thread; heavy reads/writes offloaded to State Workers.

## Integration Contract
- applyUpdate(update, source)
- getSnapshot(scope)
- observe(scope, cb)
- registerWorkerPool(pool)

## Failure Modes
- Write contention or stale snapshots under heavy load.
- IndexedDB failures leading to non-persistent state.

## Testing
- Unit tests for worker dispatch and merge order.
- Integration tests for network state sync.

## Open Questions
- How to version large binary payloads without churn?
