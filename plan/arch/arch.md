##Instructions for LLM
This file and the arch folder contain a description of the current and future architectures. it should identify entities and their functions. what those entities are responsible for and what they interact with and how they should be tested. this must be updated continuously. 
### Current architecture — source audit 2026-11-08

See the [full status audit](../reports/2026-11-08-library-status-audit.md) and
[current API guide](../../peercompute/docs/API.md). These supersede undated
implementation claims in older component summaries; preserve the design diagrams.

- NodeKernel coordinates NetworkManager, StateManager and ComputeManager on the
  main thread. Applications own input/rendering. Local IO Manager and a general
  State Worker pool remain design concepts, not instantiated runtime components.
- NetworkManager uses libp2p WebRTC, WebSockets and circuit relays, with Floodsub
  default/configurable Gossipsub, scoped discovery, presence, referrals and recovery.
  The root backend defaults to the Go relay; the legacy package harness uses Node.
- TopologyController selects neighbors from supplied spatial metrics and budgets.
  PlacementAdmissionPolicy separately consumes supplied network/resource evidence.
  The cellular-automata throughput-maximizing topology remains the core conjecture.
- StateManager uses Yjs plus PeerComputeProvider, optional y-indexeddb persistence
  and DataState hot GPU / warm CPU / cold persistent layers. Hot GPU references
  stay local. Namespace scoping alone does not make Yjs data private.
- NetworkScheduler handles snapshot/command/event cadence and bounded ack/retry.
  Clock modes are independent or kernel-driven; neither proves deterministic
  distributed execution. Event consumers must handle duplicates.
- ComputeManager executes JS, WASM, WebGPU module tasks and hybrid WASM+WebGPU
  through computeWorker → workerTaskHost → taskRuntime. Worker readiness, affinity,
  resident ownership, cancellation and resource accounting are implemented.
- Local task graphs, cache/admission metadata and GPU-resident lane contracts are
  implemented. Remote task/graph responders are opt-in; explicit peers/executors
  and application validation are required. No automatic optimal DAG partitioning.
- GPUHub manages main-thread devices/buffers and registered stage executors;
  it is not a complete central frame scheduler. Resource/fence records are not
  independent numerical or physical GPU completion evidence.
- StateManager owns optional verified UnixFS artifact storage and private agent
  records outside Yjs. NetworkManager owns authenticated provider discovery,
  explicitly peered Helia/Bitswap and private inference/conversation streams.
  ComputeManager owns loaded model workers and GPU resources. Stored, shared and
  resident are independent states.
- Models/agents are optional applications of this infrastructure. Whole-request
  inference supports managed text/vision, fixed image-generation and speech paths.
  Persistent agents use baseline routing and scripted world bodies; learned
  behavior, autonomous training, cloning and migration remain planned.
- General sendToPeer is addressed pubsub, distinct from authenticated private
  inference streams. Room IDs and task consistency hashes are not access-control
  or scientific-validation guarantees. Keep open-network execution experimental.

### Remaining architecture work

- Measure mutual link capacity and task cost; compare adaptive local topology rules
  against fixed baselines on heterogeneous hosts under churn (Keystone).
- Qualify remote identity/result admission, authority, replay, checkpoint recovery
  and hot-buffer reconstruction before general untrusted execution.
- Complete independent numerical acceptance for scientific adapters and worker
  buffer mutation; distinguish metadata-ready, runtime-smoke and scientific-ready.
- Explore dedicated network/state workers, richer authority/interest management
  and portable graph placement after their measurable acceptance gates are defined.

### Design references

- Diagrams: [compute node](compute-node-block-diagram.png),
  [topologies](p2p-network-topology-examples.png), [editable source](PeerCompute.drawio).
- Components: [NodeKernel](nodekernel.md), [StateManager](stateman.md),
  [DataState](datastate.md), [NetworkManager/scheduler](netman.md),
  [ComputeManager](compman.md), [GPU hub](gpuhub.md), [topology](topology.md).
- [IPFS/model implementation plan](../branch/ipfs-large-files-model-inference.md).
