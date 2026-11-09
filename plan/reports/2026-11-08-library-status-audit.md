# PeerCompute library status audit — 2026-11-08

## Assessment

PeerCompute has grown into a substantial experimental browser-compute library:
networking and shared state, managed local workers, explicit remote execution,
persistent content-addressed artifacts and reusable inference/agent services are
implemented. It is beyond the original networking scaffold. It has not yet
established its **core conjecture**: that locally optimizing cellular automata
will cause a globally distributed, heterogeneous set of devices to form the
optimal compute topology, like slime mold forming an efficient transit network.

The next library milestone is a measured topology/placement experiment with a
known workload and independent result checks. More demos or more model choices
alone do not close that gap. The current controller uses supplied coordinates,
neighbor limits and recovery heuristics; placement policy and model routing are
separate mechanisms.

## Review scope and evidence

The review covered all **1,047 first-party source, documentation and supporting metadata files: 25,002,942 bytes and
466,636 lines**, at baseline `173270e1003e2075f75952bc3ec0eb6299031034`.
This includes the complete root log (61,469 lines), complete Multiscale log
(23,930 lines), all plans, library/runtime/test code, shared modules, demos,
packages, services and tooling. Four collaborating readers kept file hashes and
range ledgers; exact duplicate passages were mapped to previously read sources.
Truncated tool output was excluded until reread. The final union has no gaps,
hash conflicts or unclassified baseline paths.

All 5,283 tracked paths were accounted for. The other 4,236 are generated site
copies/builds, dependency/vendor files, external references, data/media/binary
assets, historical runtime artifacts or credential material. They are explicitly
excluded from authored-source reading; credential files were not opened.
Original README media references and bytes are preserved. Raw coverage, command
logs and probes remain outside Git under
`/home/cos/.cache/peercompute-full-audit-20261108/`.

Source inspection, fresh automated checks and historical browser/GPU receipts
are identified separately below. This audit did not rerun the full live site,
physical GPUs, microphones, headsets, public peers or multi-machine experiments.
A passing unit suite does not establish those outcomes.

## Implemented library capabilities

| Area | Current implementation | Important boundary |
| --- | --- | --- |
| Lifecycle | NodeKernel initializes managers, starts networking, coordinates policy and awaits owned cleanup. | Managers run on the main thread; no general Local IO Manager or State Worker pool. |
| Network | libp2p WebSockets/WebRTC/circuit relays, room/topic scoping, presence, neighbor/referral policies, recovery and traffic/RTT telemetry. Root backend defaults to Go relay. | Spatial graph maintenance and observed traffic do not measure optimal topology or link capacity. |
| State | Yjs/PeerComputeProvider, optional IndexedDB persistence, namespace observers, local hot buffers and warm commit deltas. | Hot GPU references stay local; namespaces are not confidentiality boundaries. |
| Local compute | Actual managed module workers, JS/WASM/WebGPU/hybrid hosts, readiness, affinity, progress, cancellation, resident ownership and dependency graphs. | Runtime is requested by the application; no universal shader-task or cross-runtime compiler. |
| Remote compute | Opt-in tasks/graphs, explicit target/executor selection, requester-owned commits, admission hooks, bounded requests and replica comparison/failover. | Experimental trusted-peer path; no automatic optimal DAG partitioning or Byzantine consensus. |
| GPU/resource coordination | GPU hub buffers/stage executors, resident lanes, CPU/GPU budget leases and cleanup retention. | Accounting is not free-memory measurement; generic lease/fence metadata alone does not prove physical completion. |
| Artifacts | Verified SHA-256 UnixFS/CIDs, bounded reads, IndexedDB/filesystem retention, pinning, recovery, leases and GC; authorized Helia/Bitswap peers. | Explicit peer network, not public DHT discovery or guaranteed permanent hosting. |
| Models | Managed Transformers.js/ONNX, llama.cpp GGUF, fixed diffusion and speech runtimes; multiple resident services; authenticated credited peer requests. | Whole-request routing, not tensor/layer distribution. Catalog admission is not device qualification. |
| Agents | Private persistent identity/context, bounded history, checkpoints, baseline routing and public scoped conversations/appearances. | No learned router, autonomous goal loop, model provisioning, cloning or migration. |

Primary source: [NodeKernel](../../peercompute/src/peercompute/nodeKernel/NodeKernel.js),
[TopologyController](../../peercompute/src/peercompute/networkManager/TopologyController.js),
[NetworkManager](../../peercompute/src/peercompute/networkManager/NetworkManager.js),
[StateManager](../../peercompute/src/peercompute/stateManager/StateManager.js),
[ComputeManager](../../peercompute/src/peercompute/computeManager/ComputeManager.js),
[ArtifactStore](../../peercompute/src/peercompute/artifacts/ArtifactStore.js),
[AgentRuntime](../../peercompute/src/peercompute/agents/AgentRuntime.js).

The active compute path is `computeWorker.js → workerTaskHost.js → taskRuntime.js`.
Old `CPUComputeWorker`, `WebGPUComputeWorker`, `PhysicsEngine` and `InputManager`
scaffolds coexist with it. Neither their TODOs nor old documentation accurately
summarize the newer runtime. The API and architecture documents were corrected
as part of this audit.

## What the demos actually establish

| Demo | Role and present integration |
| --- | --- |
| NetViz | Real peer/session telemetry and topology controls; not a global network census or throughput optimizer. |
| CubeChat | Shared player state, native RTC media, authenticated text chat and owned agent cube bodies. Physics is local; resident locomotion is scripted roam/follow/stationary. |
| Models and agents | Reuses library stores, managers and protocols for retained models, local/peer multimodal requests and persistent agents. The standalone app composes managers directly. |
| EarthGrid | Cesium/geodata rendering, bounded StateManager source caches and optional world agents. Geometry is local; resident bodies are stationary. |
| RoadVector | Local rigid-body motorcycle/traffic simulation, reusable geo/physics modules and peer presence. Not distributed vehicle physics. |
| Hyperborea / SneakyWoods / Daddy Go | Multiplayer transforms/events or scores around local rendering/gameplay. Scripted bots and local mechanics are not distributed neural simulation. |
| PlanetGen | Local procedural planet/weather/ocean work. Its visual physical models remain approximations. |
| Universes | Local ComputeManager generation plus local system simulation; no active remote universe computation. |
| WebGPUPhys | Real local GPU MPM/particle rigid-body experiments and managed worker/GPU-hub integration. Not distributed domains or calibrated full material physics. |
| Schrodinger | GPU one-electron basis/Hamiltonian evaluation and a separate CPU reference eigensolver; optional shared closure packets. Not general many-electron ab-initio simulation. |
| Multiscale Ladder | Local worker/GPU task families, opt-in remote tasks, ULG handoff and extensive coupling/admission contracts. Scientific and authoritative mutation gates remain incomplete. |
| Fano Reactor | Local algebraic enumeration; distributed chemistry remains planned. |
| WXGlobe | Standalone bounded Cesium terrain/bathymetry renderer; no active peer compute. |

Setup and detailed controls belong in the [demo directory](../../demos/README.md)
and individual guides. A rendered canvas or relay connection is only a smoke
check; it does not validate every interaction, numerical result or network path.

## Where the plans stand

**Foundation:** network/state integration, layered buffers and managed worker
execution are present. Worker affinity, task graphs, resource leases and explicit
remote execution are implemented beyond the original API sketch. Remaining work
is qualification and stronger distributed contracts, not starting these systems
from scratch.

**Topology conjecture:** not demonstrated. Neither supplied spatial coordinates,
advertised capacity nor successful two/four-browser tests prove that local rules
maximize global throughput. The [Keystone plan](../branch/keystone-demo.md) and
[September survey](2026-09-14-project-state-survey.md) already identify a known
workload under heterogeneous network conditions as the next useful proof.

**Artifacts/inference:** substantial implementation and recorded real browser/GPU
acceptance exist. Retained bytes, sharing and inference hosting are independent.
Completed files survive reload; interrupted HTTP range continuation is currently
within an active import, not a general cross-reload partial-download journal.
The 27B qualification used a constrained context and an external range bridge;
it does not establish full browser-to-browser persistence/reseed acceptance for
that package. RAM/VRAM estimates and capability checks are not measured fit.

**Humunculus/agents:** identity, private context, request routing and replaceable
world-body/motor interfaces provide the first layer. Learned behavior, perception-
action training, autonomous task generation and mobility remain future phases.
Public world responders intentionally reject agent-authored messages, so current
chat behavior does not provide an autonomous agent-to-agent society. See the
[agent plan](../demos/inference/agent-layer-plan.md) and
[inhabited-world plan](../demos/inference/inhabited-agents.md).

**Scientific stack:** real kernels and useful integration machinery coexist with
reduced models and report-only contracts. Law-graph consistency counts blockers
rather than solving a coupled physical residual. Some transfer/write reports
update reduced summary objects, not authoritative simulation buffers. Several
calibrated-readiness paths consume supplied values/hashes without independently
reproducing the reference problem. ULG WASM compilation, tensor smoke, handoff
readiness and validated full physics must remain distinct claims.

Concrete audit probes reproduced three boundary defects: negative or nonfinite
ULG residuals could pass invariant status; changing a state value without changing
its keys left the reported input hash unchanged; a missing affine source could
become zero with zero reported residual. These are source/Node probes, not
physical solver experiments. Relevant paths:
[ULG runtime](../../demos/multiscale/src/simulation/ulgRuntime.js),
[law-graph solve](../../demos/multiscale/src/simulation/lawGraphConsistencySolve.js),
[Multiscale model](../../demos/multiscale/src/simulation/multiscaleModel.js).

## Fresh verification and unresolved results

Node **24.18.0** was used. These results are audit-time executions, not inferred
from the presence of test files:

| Scope | Result | Evidence limit |
| --- | --- | --- |
| Core `node --test --test-concurrency=2 tests/unit/*.test.js` (inside peercompute/) | **834 passed / 837; 3 failed**, no skips | Includes local encrypted transport and native browser storage fixtures, many mocked model/GPU cases; no new hardware model qualification. |
| Multiscale `node --test tests/*.test.mjs` | **206/206 passed** | Includes temporary build/import checks; many GPU/result fixtures are synthetic. |
| Geo core / geodata service | **87/87 / 60/60 passed** | Geometry, contracts and injected service tests. |
| Earth / motorcycle / WXGlobe / Schrodinger | **55/55 / 120/120 / 28/28 / 20/20 passed** | Local contracts, reference math and physics; not live GPU/world/network acceptance. |
| CubeChat RTC / NetViz relay overlay | **5/5 / 3/3 passed** | Configuration and telemetry classification. |
| Shared nested suite / selected 13 cross-demo Node files | **90/90 / 83/83 passed** | Physics, routing, ownership, voice lifecycle and scripted movement contracts. |
| WebGPUPhys | Worker bundle/import check **1/1 passed**; element script passed | No GPU execution; element math largely checks its own model. |
| Chaos lab | **13/13 JS; 54/54 Python passed** | Pure/mocked harness tests; no container network impairment run. |

The three core failures are retained, not repaired in this documentation task:

1. `additionalModelCatalog.test.js:24` expects two packages; the catalog also
   includes Nemotron Nano 4B.
2. `additionalModelCatalog.test.js:63` expects an old rejection message; validation
   now reports a model-memory architecture mismatch.
3. `serviceOrchestration.test.js:4137` expects a staged sibling Eshkol artifact to
   be accepted. A fresh invocation produced **16 changed bytes against an expected
   64**, with incompatible tensor values. Admission correctly blocks it. Align
   the producer/contract using independent expected outputs; do not weaken the gate.

Historical results also need their scope preserved. June 18 records unresolved
Multiscale popup/readout, NaCl append and remote quorum failures. Its performance
probe passed at approximately **4.29 FPS** because it lacked an appropriate
performance threshold. Later all-demo rendering/Pages/relay checks do not close
those failures. The later SPH ordered-interaction gate also needs requalification.
The repeated old TURN setup failure was subsequently resolved and is not being
reintroduced as a current blocker.

## Next gates

1. **Restore a reproducible baseline.** Reconcile the three core failures and
   staged Eshkol contract; reproduce and close ordered Multiscale interaction,
   replica/quorum and performance failures with bounded named fixtures. Keep
   build, numerical, physical-GPU and user-visible performance verdicts separate.
2. **Run the core conjecture experiment.** Define a local throughput objective;
   measure peer-pair bandwidth/latency and task/transfer cost. Compare local-rule
   adaptation against fixed/random/centralized baselines under heterogeneous
   resources, LAN/WAN bottlenecks and peer loss. Report throughput, correctness,
   convergence time, communication overhead and oscillation. NetViz should expose
   those measurements, not infer optimality from graph appearance.
3. **Qualify general remote execution.** Bind sender identity to authenticated
   transport, restrict executable modules, enforce authority/replay rules and
   independently validate results. Current general addressed pubsub accepts
   body-supplied sender metadata; private inference has a stronger separate
   protocol. Resource leases, FNV consistency hashes and replica counts do not
   establish secure or scientifically correct computation.
4. **Validate the experiment harness itself.** Source inspection found an alternate
   routed lab path around the link targeted by impairment, hardcoded churn
   interface selection, ignored matrix probe overrides and stale-summary retry
   risks. Confirm actual packet paths and persistent participants before trusting
   a chaos-matrix pass as topology evidence. Existing 67 unit tests do not prove
   the live network is impaired as configured.
5. **Advance science and agents through their own gates.** Use independent
   reference/tolerance tests and real worker-buffer mutations before scientific
   readiness. For Humunculus, add a bounded learned motor/perception loop with
   explicit training/evaluation rather than relabeling scripted movement. For
   applications, finish physical Android/Safari/XR and sustained multi-host model
   qualification without conflating these with topology research.

No runtime implementation, model weights, deployment or remote branch was changed
by this audit. The README stays library-first and concise; this report carries the
status detail and supersedes conflicting undated readiness claims.
