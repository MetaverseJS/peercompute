Instructions: This file contains the goals, architecture, implementation order,
and acceptance gates for IPFS large files and model inference. Keep the generic
artifact layer reusable, distinguish proposed work from executed evidence, and
record implementation decisions and results in ../log.md and ../tests.md.

# IPFS large files and WebGPU model inference

Updated: 2026-11-03 AKST. Status: **planned; implementation has not started**.
Roadmap TODO: **IPFS-01**. Parent: [overall plan](../plan.md) and
[distributed compute](distributed-compute.md).

## Requested outcome and roadmap position

Add IPFS support for large files generally, including small Hugging Face Qwen
models. PeerCompute participants should acquire, verify, retain, and serve these
files to other participants, and capable peers should run approved models through
the existing WebGPU compute structure.

This supplies the missing artifact distribution layer beneath distributed
compute. The current networking, worker, service, and GPU primitives are useful
foundations; they do not yet provide IPFS storage or an LLM inference runtime.
It is a concrete workload for the unfinished placement/resource-management work,
not completion of automatic network organization or scientific calibration.

- [ ] **IPFS-01:** Deliver a generic, bounded, persistent IPFS artifact service,
  prove peer-to-peer reseeding, import a revision-pinned Qwen model package, and
  run it in a resident ComputeManager worker with explicit WebGPU admission,
  streamed output, cancellation, and cleanup. Then support whole inference
  requests on an explicitly selected capable peer.

The first inference milestone runs the entire model on one capable peer. Model
files can come from several providers; that does not split the forward pass
across GPUs. Tensor/pipeline parallel inference, training, arbitrary remote code,
and an inference marketplace are separate future proposals. Storage and local
inference do not depend on the unimplemented Deno root service.

## Repository evidence and review scope

The review inventoried all **4,373 tracked files (173,214,385 bytes)**, scanned
authored source/documentation across the core, all 14 demos, shared packages,
services, scripts, lab, and plans, and deeply inspected the relevant execution,
storage, network, build, and test paths. Generated `docs/` bundles, copied vendor
assets, binary models/images/PDFs, lockfile bodies, credentials, and runtime dumps
were not treated as authored source or read line by line. This is a repository
survey with focused source review, not a claim that every binary was interpreted.

| Existing seam | Finding and consequence |
| --- | --- |
| `stateManager/LocalArtifactCache.js`, `StateManager.createLocalArtifactCache()` | Local-only small-file tier; defaults are 8 MiB/item and 32 MiB total. Whole-buffer copying/hashing and IndexedDB `getAll()` make raising the caps insufficient for models. Keep existing Earth/RoadVector behavior and add a block-oriented store. |
| `stateManager/DataState.js`, Yjs/PeerComputeProvider | Shared commit path replicates state. Store only approved compact artifact descriptors and availability here; keep blocks, model weights, prompts, and token history outside it. |
| `networkManager/NetworkManager.js` | Existing libp2p v3 transports and discovery, but no IPFS Bitswap/DHT service. `sendToPeer()` uses targeted pubsub; it is not a private byte stream. |
| `computeManager/ComputeManager.js`, `taskRuntime.js`, `computeWorker.js` | Module tasks, worker affinity, and required-worker readiness exist. Handler invocation is currently one-shot; resident model sessions, progress streams, abort propagation, and protection against worker resizing need explicit support. `cancelTask()` remains a TODO. |
| `serviceOrchestration/{WorkerSupervisor,ResourceLeaseBroker,ComputeManagerServiceAdapter}.js` | Reusable registry, service, and lease abstractions exist. Adapter cancellation currently discards bookkeeping/results; broker preemption does not stop GPU work. NodeKernel does not automatically construct these services. |
| `gpu/GPUHubManager.js` | GPU ownership policy exists. A third-party inference runtime does not automatically share its device or buffers with Three.js/the hub. |
| `nodeKernel/NodeKernel.js` | Owns manager startup/shutdown and remote execution admission. Add opt-in artifact and model-service lifecycle here; accept registered runtime/model IDs, not model-provided executable URLs. |
| `demos/motorcycle/src/render/motorcycleModel.js` | Bounded fetch plus manifest/hash/license checks provide a useful non-LLM consumer pattern. Its whole-file buffer is appropriate for that small asset, not generic large-file ingestion. |
| Multiscale worker builds, `demos/shared/mpmComputeTasks.js`, `scripts/sync-federal-highways.mjs` | Reuse production worker import-closure testing, persistent GPU task patterns, and streamed source/provenance practices. |
| `peercompute/src/relay-go`, `services/geodata` | Relay connectivity and fixed-source geodata service are not IPFS storage hosts. Keep those responsibilities separate. |

Paths in the first seven rows are relative to `peercompute/src/peercompute/`.
Current project state remains described by the
[September survey](../reports/2026-09-14-project-state-survey.md). Its 873/874
passing-test result is historical; no application suite was rerun for this plan.

## Architecture and ownership

```text
File / revision-pinned Hugging Face import
                  |
     immutable manifest + UnixFS directory/file CIDs
                  |
       ArtifactManager: policy, pins, verified reads
          |                         |
  local block store          IPFS block exchange
  IndexedDB + journal        browser peers / durable seeds
          |
  bounded stream bridge to resident ComputeManager worker
          |
  registered inference adapter -> runtime-owned WebGPU device
          |
  streamed text to requester; compact lifecycle metrics to NetViz
```

### 1. Generic artifacts before model-specific behavior

Proposed modules belong under `peercompute/src/peercompute/artifacts/`:
`ArtifactManager`, a manifest validator, `ArtifactStore`, and an IPFS transport
adapter. Names are implementation targets, not current exports.

- Provide `importStream`, `resolveManifest`, `stat`, `openRead`, `ensureLocal`,
  `pin`, `unpin`, `remove`, `list`, and `getAvailability` operations. Reads accept
  byte ranges and AbortSignals. Import returns a CID only after verification and
  commit. File storage works without any model runtime installed or GPU present.
- Start with persistent IndexedDB block/metadata adapters (`blockstore-idb`,
  `datastore-idb`) behind an interface. Use bounded cursor batches and incremental
  reachability/GC, never load the entire block database into memory. Evaluate
  OPFS only if measured browser storage throughput warrants a second adapter.
- Separate incomplete imports, verified blocks, complete file/directory records,
  pin intent, and active reader leases. Journal crash recovery and resume missing
  blocks. A pin becomes complete only when its whole reachable DAG is available.
  Deduplicate blocks; unpinning one artifact must not delete another artifact's
  shared blocks. Readers/importers/pins protect data from concurrent GC.
- Coordinate multiple tabs/workers using a single store owner or explicit writer
  locking. Test interrupted transactions and cross-tab races; a JS in-memory
  mutex alone does not protect independent browser contexts.
- Track storage quota, request persistent storage when available, and handle
  denied persistence and `QuotaExceededError`. A browser pin protects against
  application GC, not browser eviction, user deletion, suspension, or shutdown.
- NodeKernel owns optional startup/shutdown; StateManager exposes local handles
  and compact descriptor registration. Existing LocalArtifactCache consumers
  retain their small local caches. No file bytes go through Yjs or pubsub.

Define versioned, data-only `peercompute.artifact.manifest.v1` and a model
extension `peercompute.model.manifest.v1`. A generic manifest records a directory
or file root CID, normalized paths, sizes, media types, per-file CIDs and SHA-256
digests, import profile, provenance, and licensing. A model extension adds exact
upstream repository/revision, runtime ID/version compatibility, architecture,
quantization, tokenizer/configuration files, external weight shards, and required
GPU features. Runtime code is an application dependency, never a model file.

The manifest's CID is computed over the finished manifest; do not put that CID
inside its own hashed body. A separately published descriptor names the manifest
CID and optional publisher signature. CID integrity does not establish publisher
trust or model suitability. Validate provenance against local import/admission
policy. Existing task/cache hashes are not interchangeable with IPFS CIDs.

Use deterministic UnixFS imports: CIDv1, SHA-256 multihash, raw leaves, fixed
256 KiB chunks, balanced file layout, stable sorted paths, and explicitly fixed
directory/sharding options. Record the complete importer profile and golden
fixtures so equivalent imports agree across Node/browser implementations. A
UnixFS DAG root is not the SHA-256 digest of the concatenated file bytes; verify
both where the upstream provides a whole-file digest. CAR is an optional exchange
format for the same verified blocks, not a second identity scheme.

Reject path traversal, duplicate/ambiguous paths, unsupported symlinks/codecs,
over-limit manifests/DAGs, inconsistent sizes, unexpected external weight URLs,
and corrupt blocks before publishing completion. Verify each block against its
CID before persistence/use. Whole-file hash validation must be incremental;
WebCrypto's whole-buffer digest alone is insufficient for generic large files.
Authentication tokens for private imports stay local and never enter manifests,
telemetry, Git, or IPFS. Publishing/pinning for other peers is explicit user policy.
The first hosting milestone distributes explicitly published public artifacts;
keeping HF credentials local does not make IPFS content private. Encrypted private
artifact distribution and key management require a separate design.

### 2. Actual IPFS hosting, discovery, and durable availability

Use standard Bitswap/UnixFS so files interoperate with external IPFS hosts.
Availability advertisements carry only bounded descriptors, provider identity,
expiry, and coarse capacity; verify reachability and blocks when selecting a
provider. A stale advertisement is not proof that a file can still be served.

**Dependency compatibility is the first spike.** On November 3 the registry
reported Helia 7.1.16, `@helia/libp2p` 2.1.5, `@helia/unixfs` 8.0.9,
`@helia/verified-fetch` 8.1.2, `blockstore-idb` 4.0.1, and `datastore-idb` 5.0.1.
The repository declares libp2p `^3.1.2`; compatibility includes transport and
interface versions, not just the major number. Pin the tested dependency set in
the lockfile during implementation rather than updating every networking package.

Helia 7's `libp2p` initialization option is **creation options**, not a supported
way to borrow the existing running NetworkManager node: its wrapper creates and
stops a node itself. The supported starting design is a separately owned artifact
libp2p node coordinated by NetworkManager, with explicit connection/relay budgets,
startup rollback, shutdown, and validated binding between its peer identity and
the application peer identity. Bind both identities with a domain-separated signed
record containing session/scope/expiry and proof of artifact-key possession;
reject forged, replayed, expired, and incorrectly rebound records. Do not reuse
one private identity across two live
nodes or let Helia shutdown stop the application network. A shared-node/custom
block-broker integration is an optional P0 optimization only if documented APIs
and lifecycle tests prove it. Browser transport support determines execution
context; do not assume WebRTC can be moved into a dedicated worker.

Configure bootstrap, discovery, routers, relay use, and gateway fallback
explicitly. Default to approved PeerCompute providers; no hidden public gateway
or provider lookup should turn a supposed P2P/offline test into an HTTP download.
Use verified CAR/raw block retrieval for an optional operator-configured HTTP
fallback. Unverified gateway response bytes must never be accepted as proof of a
CID. Expose transport/source bytes and failures separately in telemetry.

Browser participants are opportunistic hosts while active. For durable hosting,
provide an operator-run IPFS seed recipe (initially a standard Kubo node and Node
24 importer), persistent volumes, recursive pins, health checks, and explicit
retention policy. Prove at least two independent durable providers can retain the
model package and survive one provider's loss. A browser-reachable seed needs
tested compatible transports/relay configuration; an HTTP gateway alone does
not prove browser Bitswap hosting. The existing Go relay does not pin files.
Expose Kubo administrative RPC only to the importer/operator, not to browsers.

### 3. A reproducible first model package

Start with **`onnx-community/Qwen3-0.6B-ONNX`**, revision
`58ca03a5e7b354b480b1a82b34bde8dc7b854cc0`, using the model card's `q4f16`
WebGPU variant. Its `onnx/model_q4f16.onnx` is **569,789,750 bytes (543.4 MiB)**,
with upstream LFS SHA-256
`9e33a5911974174761d0dfdcc0bec975d9c45af0eae5e9eb647b8ba9442a8f91`.
These identify the inspected upstream file, not an already imported IPFS CID.

Build a Node 24 CLI importer that resolves an immutable HF revision, selects one
runtime/quantization variant, downloads with streaming bounds and digest checks,
includes its complete tokenizer/config/generation/chat-template/external-data
closure, and emits a manifest plus UnixFS directory (optionally CAR). Do not
download every weight variant in the repository. Preserve upstream Qwen's Apache
2.0 license, conversion provenance, notices, and file digests; verify the converted
package's redistribution metadata explicitly because its inspected card does not
provide a complete license declaration. Support local-file/directory import for
non-HF assets using the same manifest and storage contracts.

Use **Transformers.js 4.3.2** as the initial inference adapter candidate. Its
versioned source exposes `env.fetch`, making an IPFS-backed verified stream bridge
possible without a mandatory service worker. Set a manifest-scoped virtual local
model path, `allowLocalModels=true`, `allowRemoteModels=false`, and route allowed
paths through the ArtifactManager. Reject unlisted paths; disable redundant
browser/filesystem runtime caches. Transfer bounded chunks over MessagePorts
where the store and inference worker differ, with credits and abort propagation.
The current loader calls `env.fetch` without forwarding an AbortSignal: the
adapter must capture a per-load abort controller, cancel outstanding reads, and
reject/dispose a session that finishes loading after cancellation. Test that race.

Bundle trusted runtime `.mjs`/WASM assets locally with explicit Vite-relative paths.
Transformers.js 4.3.2 declares ONNX Runtime Web
`1.31.0-dev.20260914-8d85527a0`; test that declared dependency set. Do not override it
with the independently newer ORT package without compatibility evidence. Ensure
the production build's fetch hook, worker imports, wasmPaths, CSP, and any required
cross-origin isolation actually work from a nested deployment path.
Set `wasmPaths` before the first load and initially disable `env.useWasmCache`
unless the spike proves its blob-import/CSP behavior is required and acceptable.
`allowRemoteModels=false` does not block runtime CDN downloads. Cold-worker and
reload gates must block both HF and public runtime CDNs and use bundled trusted
runtime assets plus approved artifact transport only.

Transport can be streamed, but the current model loader still materializes model
buffers and the runtime allocates CPU/GPU state. Do not claim constant-memory
inference, zero-copy GPU uploads, or a 543 MiB total runtime footprint. P0 measures
load-time CPU peak, GPU allocation behavior, context/KV-cache cost, and disposal
on actual supported hardware before setting admission limits.

WebLLM 0.2.87 is a fallback candidate, not a second initial implementation. The
Qwen3-0.6B q4f16 MLC variant has smaller inspected weight shards (~320 MiB), but
needs its matching compiled model WASM and a proven IPFS loading adapter or
verified same-origin route. Its documented URL/cache path is not evidence of an
equivalent `env.fetch` hook. Re-evaluate after the primary runtime spike if needed.

### 4. Resident inference through existing compute orchestration

Register a `ModelInferenceService` through ComputeServiceRegistry and the existing
ComputeManagerServiceAdapter. Inject NodeKernel's existing ComputeManager; do not
create another task pool or a convenience inference worker hidden inside a worker.
Provide explicit `loadModel`, `generate`, `cancel`, `unloadModel`, and status APIs.
Bind each loaded session to an affinity worker until acknowledged disposal.

- Extend task/worker messaging compatibly for progress, token chunks, AbortSignal
  propagation, request/session IDs, bounded queues, readiness, and terminal
  completion. Existing one-shot module handlers must continue to work. Supervisor
  startup must await readiness and reject pending work on worker failure/shutdown.
- The inference worker initially owns its runtime's GPUDevice. Reserve GPU/CPU
  capacity via ResourceLeaseBroker for **the entire model residency**, plus
  separate transient load/KV/generation/transfer reservations. Weight memory does
  not become free after each reply. WebGPU does not expose reliable free VRAM;
  use conservative policy budgets and measured envelopes, not invented capacity.
- Add residency renewal and safe expiry: today's broker defaults to a 30-second
  lease and expiry removes accounting without stopping resident work. Keep expired
  residency counted/quarantined until disposal or worker termination is
  acknowledged. Test idle and generating sessions beyond TTL. Avoid charging two
  GPU execution units for residency plus generation on a one-unit pool: use one
  execution reservation with memory sub-reservations, or an equivalent explicitly
  tested accounting model; current `requestLease` enforces a minimum unit of one.
- Require actual WebGPU support and model-required features (including
  `shader-f16` for the selected variant), fail admission clearly if unsupported,
  and load with `{ device: 'webgpu', dtype: 'q4f16' }`; callers cannot override the
  admitted provider. Verify actual GPU execution. CPU tokenization/helper operators are allowed;
  silent replacement of the inference backend with CPU is not a passing gate.
- Use the runtime's streamer and interruptible stopping criteria for bounded
  generation cancellation. Stop/dispose acknowledgment precedes lease release.
  If cooperative stop times out, terminate/recreate only the owned worker and
  invalidate its sessions. Broker preemption must invoke this path rather than
  merely deleting a lease. Test GPU device loss and pool resize while resident.
- TextStreamer callbacks are synchronous and do not await returned promises.
  Transport credits alone cannot pause decoding. Bound/coalesce output buffers
  and cancel on overflow or sustained slow consumption unless P0 proves a real
  decode-pause mechanism. Never let a slow requester accumulate unbounded tokens.
- Prioritize interactive rendering; initially allow one resident model and one
  active generation per admitted device. Queue/reject explicitly when physics or
  rendering already consumes the budget. Keep outputs CPU-friendly; future
  same-device tensor interop is a separate measured integration.

### 5. Remote requests after local execution is proven

Add an authenticated libp2p stream protocol for inference request/response/cancel.
Do not carry prompts or token streams over `sendToPeer()` pubsub or Yjs. The
selected peer can see the prompt; the UI must identify that peer before sending.
Publish no prompt/history/token content in public telemetry.

Requests name a locally allowlisted runtime and immutable model manifest CID,
bounded generation parameters, and request/session IDs. They cannot supply code
or arbitrary runtime URLs. Apply per-peer admission, queue limits, stream credits,
sequencing, deadlines, cancellation, and terminal-result acknowledgment. Handle
peer loss and duplicate requests explicitly; do not silently replay generation
after output has started. First placement is local or a user-selected peer with
verified capabilities/model readiness. Automated placement can later consider
model locality, cold-load cost, network speed, available budgets, and measured
token throughput through existing scheduler hooks.

Artifact integrity does not prove a remote peer computed honestly. Text generation
may be nondeterministic across runtimes/devices, so existing exact-hash result
quorums must not be advertised as general LLM correctness verification.

## Initial policy bounds to implement and measure

These are proposed defaults, not performance results. Keep them configurable and
reject over-budget work before allocation; P0 may tighten them with measurements.

| Area | Initial bound / behavior |
| --- | --- |
| Metadata | Manifest ≤256 KiB, ≤1,024 files, normalized path ≤512 bytes; separate bounded DAG depth/block count; reject overflow. |
| File transport | 256 KiB import chunks, ≤4 outstanding block requests per transfer, ≤32 MiB total transient transfer buffers per node including bridges/verification. Measure overhead separately. |
| Storage | 2 GiB application quota by default, constrained by available browser quota; configurable larger quota for generic multi-GiB files. File/import closure must fit admitted quota; no eviction of pins or active readers. |
| Model baseline | Admit only the selected complete variant; download bytes, materialized CPU bytes, GPU/KV estimates, and current resident allocations are separate budgets. No claim that storage quota establishes GPU capacity. |
| Generation | One resident model and active generation initially; queue ≤4; input + output ≤2,048 tokens, output ≤256; caller cancellation and explicit load/generation deadlines. Reject overlong prompts rather than silently truncating history. |
| Serving | Explicit hosting opt-in; configurable upload/connection ceilings; short-lived availability records and bounded retries. Public advertisements reveal only approved manifest IDs and coarse capacity. |

## Ordered implementation TODOs

Every item is **pending**. Each slice updates this file, `plan/log.md`, and
`plan/tests.md`, runs its relevant gates, and reaches a local validated commit.

| ID | Work and main file targets | Exit gate |
| --- | --- | --- |
| IPFS-01.0 | Compatibility spike: exact Helia/libp2p/IDB dependency set, browser Bitswap reachability, node ownership, Transformers worker fetch hook and pinned runtime assets. Measure the selected Qwen on actual WebGPU. | Two independent browser contexts exchange a verified block; artifact shutdown leaves application networking alive; production worker loads the pinned model through the adapter, generates text, and disposes. Record hardware/browser/peaks and dependency lock. No production-wide networking upgrade. |
| IPFS-01.1 | `artifacts/` schemas/store/import/read/range/pins/resume/GC/quota; StateManager local handle; exports and pure tests. | Deterministic CID fixtures; corruption/path/size rejection; bounded 128 MiB ingestion; crash recovery, dedup, GC, pin and active-read safety. Non-model files work without inference dependencies. |
| IPFS-01.2 | NetworkManager-coordinated IPFS adapter, provider binding/discovery, bounded blocks and advertisements, optional verified HTTP fallback. | A→B→C reseeding test below, independent identities/storage, actual serving counters, no origin/gateway escape, relay/peer-loss cleanup. |
| IPFS-01.3 | Node importer under `scripts/`, generic file and HF manifest workflow, operator seed recipe and pin inventory; no weights in Git. | Exact revision/digests/complete variant closure, reproducible directory CID, two durable providers, seed restart and one-provider-loss recovery. |
| IPFS-01.4 | ModelInferenceService adapter, compatible compute worker streaming/cancel/residency, broker/supervisor/NodeKernel lifecycle, actual GPU admission. | Model acquired by CID generates on real WebGPU; second request reuses residency; restart uses retained artifacts with origin blocked; abort/dispose/device loss/preemption release resources correctly. |
| IPFS-01.5 | Authenticated remote inference protocol, registered-model admission, explicit peer selection, limited placement hooks and NetViz metadata. | Two physical capable peers serve and request bounded generation; output/cancel/backpressure/peer-loss behavior proven; no prompt/token leakage to shared state. |
| IPFS-01.6 | `demos/inference` retro-terminal artifact/model console, generic non-LLM consumer, workspace/dev/build/gallery/static-test registration, nested Vite worker/runtime packaging, bounded chaos regression. | Production build works at a nested HTTPS path with no live HF dependency; same files reseed to fresh peers; NetViz distinguishes fetching/hosting/loaded/running; existing relevant suites and release checks pass. |

Suggested first implementation slice: IPFS-01.0 followed by the generic store
contract in IPFS-01.1. Do not begin with a standalone chat UI that bypasses
ComputeManager, or treat loading a model from an HTTP gateway as network hosting.

## Acceptance tests and completion definition

The detailed matrix is part of [the test strategy](../tests.md). No tests listed
in this section have been implemented or executed by this planning change.

1. **Generic large-file hosting:** A imports a deterministic 128 MiB file, B with
   empty storage retrieves and verifies it over actual IPFS block exchange. Close
   A; a fresh C retrieves from B with origin/public gateway fallback blocked.
   Verify source/transport counters and digests. Separate BrowserContexts/profiles
   and libp2p identities are mandatory: several existing P2P tests use pages in
   one BrowserContext, which can share IndexedDB and produce a false pass here.
   Add a slower >2 GiB fixture with an explicitly raised store quota to cover
   integer/range/streaming boundaries; measure transient memory independently.
2. **Failure and retention:** interrupt/resume, corrupt/missing blocks, malicious
   manifests, quota denial/exhaustion, cancelled reads, duplicate imports, mixed
   pins, cross-tab GC, seed restart, relay loss, and all providers unavailable.
   Show an honest unavailable state when the last complete provider disappears.
3. **Model package:** fetch the exact variant through its manifest CID, validate
   every required file, and generate on a real WebGPU adapter. Verify a second
   request does not reload weights, retained files survive restart, and HF plus
   public runtime CDNs are blocked after import, including a cold worker/reload.
   Document model/runtime/revision/browser/GPU, cold/warm
   timings, transfer bytes, estimated/measured memory, and actual backend evidence.
   Headless software GPU or mocked inference is not hardware-performance proof.
4. **Compute integration:** real worker readiness, required-worker failure,
   token ordering/backpressure and slow-consumer overflow, abort during
   download/load/generation including late load completion after abort, unload,
   device loss, preemption, lease renewal/expiry beyond TTL, no double-counted GPU
   units, queue bounds, worker crash/resize and NodeKernel
   teardown. Releasing a bookkeeping record alone is not successful cancellation.
5. **Remote inference:** independent machines, explicit selected provider,
   authorized model/runtime IDs, over-limit rejection, privacy checks, timeout,
   duplicate/late messages, requester/provider loss, and clear partial-output
   behavior. Availability metadata must expire and cannot override local admission.
6. **Release/regression:** nested-path Vite worker/WASM/import closure, explicit
   runtime cache policy, correct range/HEAD semantics where the adapter exposes
   HTTP, generic-file consumer, and bounded network chaos while rendering stays
   responsive. Close all owned test browsers/servers. Rerun existing relevant
   core/service/network/cache and Multiscale build tests plus changed demo/static
   checks. Reconcile or explicitly preserve the historical staged Eshkol failure;
   this plan does not waive it or claim a new green baseline.

Storage MVP closes after .0–.3's applicable storage gates; local model inference
closes after .4; the complete IPFS-01 item also requires .5–.6. No model-size,
throughput, production-readiness, or multi-GPU claim is earned by planning alone.

## Primary references checked on 2026-11-03

- IPFS browser limitations and long-running providers:
  [IPFS in web apps](https://docs.ipfs.tech/how-to/ipfs-in-web-apps/),
  [pinning](https://docs.ipfs.tech/how-to/pin-files/),
  [Bitswap](https://docs.ipfs.tech/concepts/bitswap/),
  [UnixFS](https://specs.ipfs.tech/unixfs/), and
  [trustless gateways](https://specs.ipfs.tech/http-gateways/trustless-gateway/).
- Helia's current lifecycle/composition contracts:
  [Helia 7.1.16 source](https://github.com/ipfs/helia/blob/helia-v7.1.16/packages/helia/src/index.ts),
  [libp2p wrapper 2.1.5 source](https://github.com/ipfs/helia/blob/libp2p-v2.1.5/packages/libp2p/src/index.ts),
  [verified fetch](https://github.com/ipfs/helia-verified-fetch/blob/main/packages/verified-fetch/README.md).
  Package versions were cross-checked against their npm registry metadata.
- Browser persistence limits:
  [MDN storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- Model identity and packaging:
  [converted Qwen model card](https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX),
  [immutable ONNX file metadata](https://huggingface.co/api/models/onnx-community/Qwen3-0.6B-ONNX/tree/58ca03a5e7b354b480b1a82b34bde8dc7b854cc0/onnx),
  [upstream Qwen/license](https://huggingface.co/Qwen/Qwen3-0.6B).
- Runtime integration:
  [Transformers.js 4.3.2 environment](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/env.js),
  [loader](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/utils/hub.js),
  [streamers](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/generation/streamers.js),
  [stopping criteria](https://github.com/huggingface/transformers.js/blob/4.3.2/packages/transformers/src/generation/stopping_criteria.js),
  [ORT large-model constraints](https://onnxruntime.ai/docs/tutorials/web/large-models.html),
  [ORT WebGPU device options](https://onnxruntime.ai/docs/api/js/interfaces/Env.WebGpuFlags.html).
- Alternative runtime investigation:
  [WebLLM 0.2.87 model/runtime config](https://github.com/mlc-ai/web-llm/blob/v0.2.87/src/config.ts),
  [MLC Qwen package revision](https://huggingface.co/mlc-ai/Qwen3-0.6B-q4f16_1-MLC/tree/8c14ce481d4c692769976ad52afea453a102df19).

## Decisions still requiring implementation evidence

- Confirm the minimal mutually compatible IPFS/browser transport versions and
  whether shared-node composition is practical. Separate ownership is the
  baseline until proven otherwise.
- Confirm Qwen q4f16 load/generation/disposal on the target GPUs and exact
  Transformers/ORT build. Reduce the baseline model/context if measurements do
  not fit; update the manifest and gates explicitly.
- Measure IDB throughput and peak memory before selecting OPFS or setting wider
  file/model limits. Ensure chosen import and range APIs genuinely stream.
- Select operator seed locations, quotas, and retention during deployment work.
  No external service, paid pinning account, or live deployment is created here.
