# DataState [datastate] (Summary)

Status: active; hierarchical shared state store.

## Purpose
- Provide a single source of truth for gameplay, simulation, and compute.

## Responsibilities
- Store hierarchical, namespaced state with predictable layouts.
- Support parallel reads/writes via State Workers.
- Persist to IndexedDB for durability.

## Layered DataState (Adopted)
- Hot GPU layer: per-task GPUBuffers (fast, transient) owned by the GPU hub context.
- Warm CPU layer: typed arrays + compact structs for netman, UI, and Yjs metadata.
- Cold layer: IndexedDB snapshots/journal for persistence; optional VideoDB hot-store accelerator.

## Commit Contract
- Tasks publish deltas, not raw buffers.
- `commitDelta({ taskId, scope, version, payload })` where payload is CPU-friendly (typed arrays, JSON, or binary packets).
- DataState applies ordering (seq/vector clock) and updates hot/warm/cold layers as needed.
 

## Shape + Conventions
- Namespaced keys per game/room.
- JSON for metadata; typed arrays for large numeric buffers.
- Non-executable data only.

## Access Patterns
- Latest-wins snapshots for render and networking.
- Incremental deltas for low-latency updates.

## Execution Context
- Backed by IndexedDB; accessed via StateManager/State Workers.
- GPU hub on main thread owns shared-GPU hot layer; isolated compute workers emit CPU deltas.

## Failure Modes
- Partial writes if workers crash mid-transaction.
- Excessive churn if large buffers are rewritten too often.

## Testing
- Persistence smoke tests (reload + restore).
- Concurrency tests for parallel worker access.

## Open Questions
- When to adopt binary encoding (CBOR) for deltas?
- What is the conflict authority: per-task, per-room, or global?
