# PeerCompute state and roadmap survey — 2026-09-14

PeerCompute is an advanced browser-runtime and demo prototype. Its networking,
state, local compute, service orchestration, and Earth/game foundations are
substantial. The original goal of a network that automatically organizes and
places arbitrary workloads according to measured bandwidth and compute capacity
is still incomplete. Scientific multiscale simulation is a separate unfinished
track; working kernels and handoff contracts do not establish calibrated physics.

## Scope and evidence

- Surveyed branch: `ulg`, initially clean at
  `aaa729ebd8330a1f73263948a38fb098f633f246`, dated August 25, 2026.
  It was 27 commits ahead of the locally stored `origin/ulg`; no remote fetch,
  push, or deployment was performed.
- Reviewed the main roadmap, recent log entries, branch plans, READMEs, package
  scripts, live core/runtime source, and the latest recorded release evidence.
- Node: `v24.18.0`. Eleven existing test commands were executed: **873 passed,
  one failed, zero skipped** across 874 tests. See the table below.
- No application source or generated demo output was edited. The Multiscale
  test suite itself includes a fresh temporary production-build/import-closure
  regression. Full builds, browser/P2P/WebGPU runs, public-source checks,
  private HTTPS links, chaos matrices, and physical headsets were not retested.

## Position in the original four-stage roadmap

The stages in [the main plan](../plan.md#roadmap) now overlap; treating them as
a sequential checklist understates the compute work and overstates scale readiness.

| Original stage | Current assessment | What remains |
|---|---|---|
| 1. Hardening | Substantially implemented, with focused release evidence | Close the recorded multiplayer/matrix failures and repeat sustained network/production gates. |
| 2. Scheduler adoption | Substantially implemented | Broaden consistent adoption and measured tuning across demos; validate reconnect/clock behavior in realistic runs. |
| 3. Scale | Partially implemented; the principal gap in the original vision | Measured resource-driven clustering/placement, robust hierarchical authority/failover, general workload-specific state partitioning, and LAN/WAN/churn/load evidence. |
| 4. Compute | Local execution and orchestration substantially implemented; distributed execution partial | Turn existing remote execution/admission paths into a routinely verified multi-peer workflow, including migration, result validation, and failure recovery. |

No defensible single completion percentage exists: the plan combines a library,
many demos, a prospective root service, and a scientific research roadmap with
different acceptance criteria.

## Implemented foundations and their boundaries

**Core networking and state.** `NodeKernel`, `NetworkManager`, and
`NetworkScheduler` provide scoped rooms/topology IDs, relay-assisted discovery,
WebRTC upgrade and retention policy, snapshots/events/commands, and telemetry.
`StateManager`/`DataState` implement Yjs namespaces, hot/warm/cold storage,
warm-delta commits, and local artifact caching. Vicinity shard subscriptions and
snapshot topics exist. However, the Yjs provider still synchronizes its document
on one selected topic; namespace APIs and sharded snapshots are not a general
per-namespace/per-shard Yjs replication system.

Evidence: [NetworkManager](../../peercompute/src/peercompute/networkManager/NetworkManager.js),
[StateManager](../../peercompute/src/peercompute/stateManager/StateManager.js),
[PeerComputeProvider](../../peercompute/src/peercompute/stateManager/PeerComputeProvider.js),
and the core sharding, topology, scheduler, and warm-delta tests.

**Compute and remote execution.** The manager runs JS, WASM, worker-local
WebGPU, hybrid tasks, task graphs, worker resizing, and resident GPU lane plans.
Required workers acknowledge module startup and fail closed if unavailable.
NodeKernel has real remote task/task-graph request/respond paths, admission and
quorum policies, cache/state import authority, and injectable GPU-stage executors.
Some paths intentionally execute locally when placement is advisory; unsupported
non-advisory execution is blocked. This is more than a paper design, but it is
not proof of an autonomous distributed scheduler. The older public
`ComputeManager.distributeTask()` and `cancelTask()` methods remain empty TODO
bodies; the implemented graph and NodeKernel execution paths must be distinguished
from those incomplete APIs. Several legacy helper classes also remain scaffolds.

Evidence: [ComputeManager](../../peercompute/src/peercompute/computeManager/ComputeManager.js),
[NodeKernel](../../peercompute/src/peercompute/nodeKernel/NodeKernel.js),
[GPUHubManager](../../peercompute/src/peercompute/gpu/GPUHubManager.js), and
[remote-compute tests](../../peercompute/tests/unit/nodeKernel.remoteCompute.test.js).

**Self-organization and Keystone.** The topology controller actually chooses
neighbors using supplied spatial metrics, distance, caps, referrals, and isolation
fallback. That does not implement the distributed-compute plan's measured
bandwidth/CPU/GPU clustering and leader election. No standalone `MetricsManager`
implementation or proposed Deno root-node package was found in the live tree.
NetViz and Multiscale supply useful visibility and integration foundations, but
Keystone's measurable scaling and resource-driven reconfiguration gates remain
unproven. The existing legacy Deno relay is not the planned root service.

Evidence: [TopologyController](../../peercompute/src/peercompute/networkManager/TopologyController.js),
[distributed-compute plan](../branch/distributed-compute.md),
[Keystone acceptance criteria](../branch/keystone-demo.md), and
[root-node TODO](../root-node-todo.md).

**EarthGrid/RoadVector.** This is the latest completed implementation slice.
Shared geo-core, bounded geodata, EarthGrid, WXGlobe, particle-rigid vehicle
physics, traffic, and input/XR packages all have passing Node suites today.
RoadVector implements continuous WGS84/ECEF terrain travel through bounded ENU
frame changes, off-road collision, source caching, and physical speed/jitter
improvements. Its OSM roads, buildings, race, and traffic remain a roughly 2.4 km
seed overlay: `loadRoadTile: null` is explicit. Terrarium does not cover the polar
caps beyond Web Mercator. PeerCompute integration supplies coarse player presence;
this does not establish shared authoritative multiplayer motorcycle physics or
distributed execution of the bike solver. Physical headset validation remains open.

Evidence: [RoadVector integration](../../demos/motorcycle/src/main.js),
[game runtime](../../demos/motorcycle/src/runtime/gameRuntime.js),
[player presence](../../demos/motorcycle/src/overview/playerPresence.js), and
[Earth/game branch plan](../branch/earth-platform-motorcycle-xr.md).

**Multiscale/ULG and science.** The integration surface is extensive: solver
registry, closure/source-sink contracts, law graphs, compute workers, warm deltas,
ULG/MoonLab/Eshkol service handoffs, and many reduced physics kernels. The 206
Multiscale tests pass today. The physics roadmap is strongest in contracts,
interactive workbenches, and reduced kernel execution; conservative cross-solver
mutation, calibrated force fields/EOS/reaction models, reference tolerances,
scientific replay, and advanced-regime validation remain partial or future work.
The water-balloon/campfire slice remains a candidate with unresolved component
and coupling gates. Do not promote magnetar or material full-physics readiness
from schema, runtime, or toy/proxy evidence.

Evidence: [Multiscale near-term build order](../branch/multiscale-ladder.md#near-term-build-order)
and [accuracy boundary](../plan.md#multiscale-accuracy-boundary).

## Fresh validation

| Command | Passed / total | Result |
|---|---:|---|
| `npm --prefix peercompute run test:unit` | 213 / 214 | FAIL: staged Eshkol artifact candidate |
| `npm --prefix demos/multiscale test` | 206 / 206 | PASS, including temporary production worker build |
| `npm run test:geo-core` | 87 / 87 | PASS |
| `npm run test:geodata` | 60 / 60 | PASS |
| `npm run test:earth` | 48 / 48 | PASS |
| `npm run test:wxglobe` | 28 / 28 | PASS |
| `npm run test:xr` | 24 / 24 | PASS, Node fixtures only |
| `npm run test:physics` | 54 / 54 | PASS |
| `npm run test:traffic` | 12 / 12 | PASS |
| `npm run test:motorcycle` | 117 / 117 | PASS |
| `npm run test:backend` | 24 / 24 | PASS, includes static demo-release assertions |

The failing test is in `peercompute/tests/unit/serviceOrchestration.test.js`
at the staged ULG tensor-runtime candidate case. It conditionally reads JSON and
WASM under `/home/cos/projects/ulg/public/service-assets/eshkol/closures/magnetar-closure/`.
Those external files exist on this host, so the test runs rather than skips.
A separate read-only reproduction confirms both
`eshkol-tensor-runtime-candidate-changed-bytes-mismatch` and
`eshkol-tensor-runtime-candidate-output-tensors-mismatch`: execution changes 16
bytes rather than the declared 64, produces first closure value `0.00125` rather
than `0.010900000000000002`, and residual `0.0025` rather than
`0.10800000000000001`. The adapter rejects the result. Ownership of the mismatch
between staged artifact, WASM, and consumer expectations needs investigation;
this survey does not attribute it to a particular recent code change.

## Open release evidence and stale documentation

- The August 21 record proves selected two-peer interactions and production
  TURN media. It explicitly leaves live four-peer CubeChat convergence and the
  full chaos/ordered demo matrices open. June's direct `Launch Magnetar`, NaCl
  append, remote-placement `quorum-mismatch`, and ordered-demo failures have
  no fresh closure proof in this survey. They remain an evidence backlog, not
  newly reproduced failures. See [June report](2026-06-18-ulg-demo-regression-report.md)
  and [test history](../tests.md).
- The old implementation-status page was dated June 8 and focused only on ULG;
  it omitted the August platform work. The main plan's broad worker/GPU-hub,
  topology-ID, warm-delta, and Fano scaffold TODOs understate implemented work.
  Conversely, sharded snapshots must not be used to mark general Yjs sharding done.
- The old sandbox blocker and Tailscale Serve blocker are historical: later
  records show successful standalone browser checks and an authorized direct
  Tailnet HTTPS approach. No historical URL was reverified today.
- Packaging remains pre-release: `peercompute/package.json` is private at
  version `0.0.0`, while the entry module reports `0.0.1`. The library build
  still uses Webpack; demos use Vite. This is an SDK/release cleanup item, not
  evidence that the working runtime is missing.
- ICC source fingerprints and HEAD matched at intake. Memory was current;
  optional graph/search stores were not built, and substrate provenance was
  based on file counts. The untargeted audit returned WARN for heuristic shell/
  Python findings, two parser blind spots, and stale saved tasks. The survey
  dossier's generic readiness FAIL is not a roadmap completion score or a
  reason to begin unrelated fixes.

## Recommended next milestone

First restore a reproducible baseline: reconcile the staged Eshkol contract,
make its fixture dependency explicit, and run the existing focused remote
placement and multiplayer gates to close or reclassify the recorded failures.

Then use the existing Keystone plan to prove **one deterministic workload across
a small real peer network**: publish measured network/compute capacity, place
work, validate results into warm state, handle a peer leaving, and show the
result and measured scaling/cost in NetViz. Exercise two LAN clients plus a WAN
client and compare against the single-peer baseline. Completion must be defined
by those observations, not additional task schemas. Keep the root service optional;
its first implementation slice is separately specified in `plan/root-node-todo.md`.

For a science-focused follow-up, use the existing bottom-up build order and
choose one named microphysics/material benchmark with conservative coupling and
tolerances. For a RoadVector-focused follow-up, the remaining product boundaries
are continuously streamed road/building/traffic data, actual headset evidence,
and any newly specified shared riding behavior. Neither track substitutes for
the distributed-network milestone.
