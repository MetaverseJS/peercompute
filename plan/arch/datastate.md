# DataState [datastate] (Summary)

Status: active; hierarchical shared state store.

## Purpose
- Provide a single source of truth for gameplay, simulation, and compute.

## Responsibilities
- Store hierarchical, namespaced state with predictable layouts.
- Support parallel reads/writes via State Workers.
- Persist to IndexedDB for durability.

### Big Possible Change
    - layered datastate architecture. 
        -   a high performance, in memory representation in webGPU buffers 
        -   a videoDB representation https://github.com/dgriebel2014/VideoDBProject
        -   a persistant storage representation kept in indexeddb
 

## Shape + Conventions
- Namespaced keys per game/room.
- JSON for metadata; typed arrays for large numeric buffers.
- Non-executable data only.

## Access Patterns
- Latest-wins snapshots for render and networking.
- Incremental deltas for low-latency updates.

## Execution Context
- Backed by IndexedDB; accessed via StateManager/State Workers.

## Failure Modes
- Partial writes if workers crash mid-transaction.
- Excessive churn if large buffers are rewritten too often.

## Testing
- Persistence smoke tests (reload + restore).
- Concurrency tests for parallel worker access.

## Open Questions
- When to adopt binary encoding (CBOR) for deltas?
