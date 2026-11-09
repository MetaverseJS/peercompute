# State Manager [stateman] (Summary)

Status: active; owns Yjs/DataState and optional artifact/agent stores on the main thread. A general State Worker pool remains planned.

## Purpose
- Maintain the authoritative local DataState.
- Apply updates from network, IO, and compute in a consistent order.

## Responsibilities
- Apply local Yjs transactions and manage explicit storage owners.
- Apply CRDT/merge rules (Yjs-based) for concurrent edits.
- Emit snapshots/deltas for NetworkManager and render paths.
- Persist state to IndexedDB for reloads/offline recovery.
- Apply commit deltas from shared-GPU and isolated compute tasks.
- Maintain the layered DataState wrapper (hot/warm/cold).

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
- Warm deltas are stored under a configurable namespace for netman/UI.

## Execution Context
- Manager on main thread; no general State Worker dispatch pool is instantiated.

## Integration Contract
- read(key), write(key, value), snapshot()
- subscribe(key, cb), observeNamespace(namespace, cb)
- readScoped(namespace, key), writeScoped(namespace, key, value)
- applyRemoteUpdate(updateArr), requestProviderSync()
- commitDelta(delta)
- getWarmDeltas(namespace)
- getDataState()
- setHotBuffer(key, buffer)
- getHotBuffer(key)

## Failure Modes
- Write contention or stale snapshots under heavy load.
- IndexedDB failures leading to non-persistent state.

## Testing
- Tests for Yjs merge/namespace observers, persistence, artifact leases and cleanup.
- Integration tests for network state sync.

## Open Questions
- How to version large binary payloads without churn?

## IPFS Artifact Ownership - 2026-11-03

[IPFS-01](../branch/ipfs-large-files-model-inference.md) places the optional
ArtifactService/ArtifactStore under StateManager ownership. It manages verified
binary blocks, immutable manifests/CIDs, local completeness, pins, quota, GC,
read leases, and restart recovery outside the Y.Doc and y-indexeddb state store.
Only policy-approved compact descriptors may enter shared state.

NetworkManager discovers providers and transfers/serves blocks through that store
contract. ComputeManager consumes bounded artifact read handles and owns the
resident model's worker/GPU resources; persisted availability and GPU residency
are different states. NodeKernel injects the transport and orders lifecycle:
restore before advertising; withdraw/drain serving before store teardown. Local
artifact access must work without active networking/Yjs. Test ownership, startup
rollback, restart/reannouncement, transfer/GC races, and complete teardown.
Implemented APIs: createArtifactStore/getArtifactStore, ensureArtifact,
publishArtifact and unpublishArtifact. DataState holds a local registry only.
Destroy aborts/drains store operations and reports cleanup failures while still
attempting provider/Yjs cleanup. NodeKernel closes compute and network first.
The browser reseeding gate passes; model execution acceptance remains separate.
