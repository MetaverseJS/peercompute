# PeerCompute API guide

This guide covers the implemented integration surface as audited on 2026-11-08.
The [source entry point](../src/peercompute/index.js) exports the complete set of
modules; the [library guide](../README.md) has larger examples. The package is a
private repository workspace, not a documented public npm release.

## Lifecycle and shared state

`createNode(config)` constructs and **initializes** a `NodeKernel`. Call `start()`
separately. With `new NodeKernel(config)`, call both `initialize()` and `start()`.
Supply bootstrap addresses in the constructor configuration.

```js
// Import path relative to an application at the repository root.
import { createNode } from './peercompute/src/peercompute/index.js';

const { bootstrapPeers } = await fetch('/relay-config.json').then(r => r.json());
const node = await createNode({
  bootstrapPeers,
  gameId: 'example',
  roomId: 'lobby',
  enablePersistence: false
});
await node.start();

const state = node.getStateManager();
const unsubscribe = state.subscribe('message', (value, key) => console.log(key, value));
state.write('message', 'Hello peers');

// When this application instance closes:
unsubscribe();
await node.stop();
```

Managers coordinate on the main thread; compute tasks can run in managed workers.
`stop()` awaits compute, network and state cleanup. Compute/network cleanup failures
retain their owners for retry; state cleanup errors are reported, but NodeKernel
currently clears its manager references after that final phase.

| Configuration | Current behavior |
| --- | --- |
| `gameId`, `roomId`, `topologyId` | Scope application discovery/state topics; not authentication. |
| `bootstrapPeers` | Relay/bootstrap multiaddresses; see the [relay guide](RELAY_SERVER.md). |
| `enablePersistence` | Yjs IndexedDB persistence, enabled by default; distinct from binary artifact retention. |
| `enableWebGPU` | Compute capability/configuration flag, default false; does not make arbitrary tasks GPU programs. |
| `enableGPUHub` | Main-thread GPU hub ownership, enabled by default; actual device use requires initialization/support. |
| `clockPolicy` | Object such as `{ mode: 'kernel', tickHz: 30 }`; mode defaults to `independent`. Cadence is not distributed determinism. |
| `enableRemoteComputeResponder` | Explicit opt-in to execute incoming remote tasks; default false. |
| `enableRemoteTaskGraphResponder` | Defaults to the remote-compute setting; can be configured independently. |

`getStatus()`, `getNetworkManager()`, `getStateManager()`, `getComputeManager()` and
`getGPUHub()` expose the current owners. See
[NodeKernel](../src/peercompute/nodeKernel/NodeKernel.js) for advanced policies.

## StateManager and DataState

| API | Purpose |
| --- | --- |
| `read(key)`, `write(key, value)`, `delete(key)`, `batchWrite(updates)` | Read/mutate shared Yjs state. Writes are synchronous local mutations. |
| `subscribe(key, callback)` | Observe a key or `'*'`; returns an unsubscribe function. |
| `writeScoped(namespace, key, value)`, `readScoped(namespace, key)` | Named shared maps. |
| `observeNamespace(namespace, callback)` | Observe a named map, including map replacement. |
| `snapshot()`, `getYDoc()` | Inspect current state/Y.Doc. |
| `commitDelta(delta)`, `getWarmDeltas(namespace)` | Apply/expose CPU-visible task deltas. |
| `getDataState()`, `setHotBuffer(key, buffer)`, `getHotBuffer(key)` | Layered local state and process-local GPU references. |
| `createArtifactStore(options)`, `getArtifactStore(name)` | Optional verified binary storage outside Yjs. |
| `ensureArtifact(cid, options)`, `publishArtifact(cid)`, `unpublishArtifact(cid, options)` | Artifact completeness and configured network publication. |
| `createAgentRecordStore(options)`, `getAgentRecordStore(name)` | Private persistent agent identity/context outside shared Yjs. |

Yjs synchronization uses `PeerComputeProvider`. `synchronize()` is a compatibility
no-op, not a manual merge API. A namespace does not make data private: the provider
replicates the document. Keep private records and large files in their dedicated
stores. Cold persistence, retained file availability and loaded GPU residency are
different states. See [StateManager](../src/peercompute/stateManager/StateManager.js)
and [DataState](../src/peercompute/stateManager/DataState.js).

## NetworkManager and NetworkScheduler

Configure cadence with `configureScheduler(profile)`. Register snapshot producers
with `registerStateProvider(fn, options)` and listeners with
`addSnapshotHandler((peerId, message) => {})`. `queueEvent(payload, options)` and
`addEventHandler(handler)` provide event delivery. Producers can be removed with
`unregisterStateProvider(id)` or `unregisterCommandProvider(id)`; snapshot/event
listeners currently have no corresponding removal API. See the
[source](../src/peercompute/networkManager/NetworkManager.js).

`getConnectedPeers()`, `getHealth()` and `getTelemetrySnapshot()` expose discovery,
connection and traffic observations. Presence entries can outlive an immediately
usable inference connection; traffic byte rates are not link-capacity measurements.

The implementation supports WebSockets, WebRTC and circuit relays, Floodsub by
default and configurable Gossipsub. Topology management uses supplied spatial
metrics, neighbor budgets, referrals and recovery. It does not yet optimize a
measured end-to-end compute-throughput objective.

`broadcast(message)` and `sendToPeer(peerId, message)` use shared pubsub with scope
and recipient fields. They are not confidential unicast APIs; resolved sends do
not establish delivery. Reliable scheduler events retry with acknowledgements,
but consumers must tolerate duplicates. Private model inference and agent
conversations use their separate authenticated stream services.

## Managed compute

`node.submitTask(task)` delegates to local `ComputeManager`. A JavaScript task
uses `fn` or an importable `module`/`exportName`, not a `shader` property:

```js
const answer = await node.submitTask({
  id: 'sum-example',
  data: { values: [1, 2, 3] },
  fn: ({ values }) => values.reduce((sum, value) => sum + value, 0)
});
```

Functions are serialized and cannot capture surrounding variables. Prefer modules
for reusable work. `requireWorker: true` prevents inline fallback; module code and
inputs must be worker-compatible. Tasks support `signal`, `onProgress`,
`transferables` and affinity. Active inline work cannot promise worker-style
cancellation; failed worker cleanup retains ownership until confirmed.

| Runtime | Execution contract |
| --- | --- |
| JS | `fn` or `module` plus optional `exportName`; structured-cloneable inputs/results. |
| WASM | `runtime: 'wasm'`, `wasm.source`, entry/args and optional memory input/output views/result adapter. |
| WebGPU | A JS module initializes and dispatches WebGPU work inside the managed worker, or an application uses the main-thread GPU hub. |
| Hybrid | `runtime: 'wasm-webgpu'`, WASM definition and a worker-local host module. |

Results may contain `commitDelta` for StateManager. GPU buffers remain local;
remote buffer references are metadata and require explicit local reconstruction.
See [worker/runtime examples](../README.md#datastate--compute-examples),
[ComputeManager](../src/peercompute/computeManager/ComputeManager.js) and
[taskRuntime](../src/peercompute/computeManager/taskRuntime.js).

`submitTaskGraph({ nodes })` supports dependency batches (`id`, `dependsOn`, `task`),
result wiring, explicit cache policies and admission metadata. It does not
automatically partition a graph across peers. GPU-resident stage plans require
registered executors. Lease and fence metadata are ownership contracts, not
independent evidence of GPU completion or numerical correctness.

## Explicit remote execution

NodeKernel exposes `submitRemoteComputeTask(peerId, payload, options)`,
`submitRemoteTaskGraph(peerId, graph, options)`, `createNetworkPlacementExecutor(peerId, options)`
and `createRedundantNetworkPlacementExecutor(peerIds, options)`. A responder must opt in; remote
JS tasks require a module by default. Applications supply eligible peers,
placement/admission policy and result validation. Ordinary `submitTask()` and
`ComputeManager.distributeTask()` do not provide automatic network distribution;
the latter is still a placeholder.

Treat the general remote-task path as experimental trusted-peer machinery.
Its addressed pubsub and consistency hashes do not establish authenticated code
execution or correct results. Replica comparisons are configurable checks, not
Byzantine consensus. See the [audit's remaining gates](../../plan/reports/2026-11-08-library-status-audit.md#next-gates).

## Optional artifacts, models and agents

`ArtifactStore` supports SHA-256-verified UnixFS/CIDs, bounded reads, retention,
recovery, leases and garbage collection. Browser retention uses IndexedDB; a
Node filesystem backend also exists. `IpfsArtifactTransport` uses Helia/Bitswap
with explicitly authorized peers; public DHT discovery and permanent pinning
services are not configured.

`ComputeManager.createModelInferenceService({ artifactStore, runtime, ... })`
creates a managed lifecycle with a shared resource broker. Runtime values are
`transformers.js`, `llama.cpp`, `onnx-diffusion` and `transformers-speech`.
Supported manifests, browser features and admission policy must pass before load.
`ResidentModelRegistry`, `InferenceRouter` and `PeerInferenceService` support
multiple loaded models and whole-request local/peer routing. They do not shard a
single neural model across GPUs. RAM/VRAM budgets are estimates, not free-memory
measurements. The [model demo guide](../../demos/inference/README.md) owns catalog,
browser, storage, voice and UI instructions.

`AgentRecordStore`, `AgentRouter` and `AgentRuntime` provide persistent private
identity/context, bounded request routing and execution checkpoints. Learned
routing, autonomous planning/training, host provisioning, cloning and migration
remain [planned](../../plan/demos/inference/agent-layer-plan.md).

## Historical scaffolds

Exported `PhysicsEngine` and `InputManager`, and the older
`compute/CPUComputeWorker.js` and `compute/WebGPUComputeWorker.js`, remain
scaffolds. The active worker path is `computeWorker.js` → `workerTaskHost.js` →
`taskRuntime.js`. The demos supply their own input and physics implementations.
Consult the [current status report](../../plan/reports/2026-11-08-library-status-audit.md)
before interpreting old plans, diagrams or readiness flags as shipped behavior.
