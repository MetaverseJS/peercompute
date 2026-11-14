# Root node: client parity and model evidence

Status: recommendation, 2026-11-14. No root runtime implemented or qualified.
This updates the runtime choice and first slice in [the June root plan](root-node-todo.md).

## Follow-up: prefer native Bun qualification first

The user's dependency-size objection changes the recommendation: qualify a
native Bun root before adopting Chromium as a production dependency. The
browser-host design below remains the compatibility fallback/reference.
Use the same managers, protocols and service contracts with platform adapters;
root-as-client does not require identical storage implementation or browser UI.
If literal IndexedDB API compatibility is required on the root, it remains
additional work; SQLite behind StateManager preserves the service contract,
not the entire IndexedDB API.

Bun can execute WebGPU through [bun-webgpu's Dawn FFI binding](https://github.com/kommander/bun-webgpu).
This is a native dependency, not built-in WebGPU or Chromium. The binding's
published conformance results include failures/skips; qualify our actual
operations and model engines. The [Dawn Node binding](https://github.com/dawn-gpu/node-webgpu)
is another candidate, subject to Bun native-addon compatibility testing.

Current [Bun 1.4 release notes](https://bun.sh/blog/bun-v1.4) document JSPI and
memory64, improving prospects for the existing GGUF WASM runtime. Its exact
shared-memory64 configuration, loader and GPU binding still need execution
tests. [Bun.Image](https://bun.com/docs/runtime/image) may cover native image
decoding/resizing/encoding. [Workers](https://bun.com/docs/runtime/workers)
remain experimental, particularly termination. These are qualification items,
not proof that all existing inference engines work unchanged.

| Native scope | Expected difficulty and acceptance |
| --- | --- |
| Evidence registry | Bounded service/storage work. Bun HTTP/WSS and built-in SQLite; browser IDB outbox. Reuse StateManager and shared schemas; prove durable restart and browser submissions. Native P2P still needs transport qualification. |
| General WebGPU compute | Moderate platform-adapter work: initialize native GPU inside a managed worker, execute actual WGSL, transfer results, cancel and release resources. |
| Existing ONNX/GGUF/media engines | Largest uncertainty: qualify engine asset loading, WASM features, GPU API coverage, ports, image/audio processing and cleanup per backend. Separate native-engine results from browser-engine evidence. |

StateManager already permits browser persistence to be disabled; the inference
demo uses that mode. A read-only lifecycle probe on installed Bun1.3.9 initialized
and destroyed the current StateManager successfully. That older local runtime
lacks built-in navigator.gpu, IndexedDB and JSPI; it is not evidence against
the newer1.4 release. No new Bun version or GPU binding was installed/tested.
Add real SQLite persistence for the native registry; disabling IDB alone is
not persistence. Native WebGPU means one JS runtime plus a GPU library, not
zero native dependencies. Keep Node24/Vite tooling unchanged.

Revised order: registry plus small native worker/GPU feasibility spike, then
one actual ONNX and GGUF execution, then wider modality parity. Chromium is
optional qualification infrastructure unless native blockers justify it.

IndexedDB follow-up: a native persistent implementation could reduce adapter
work, but no official Bun-native experimental API was verified in the current
documentation. The [native support request](https://github.com/oven-sh/bun/issues/2659)
remains open; documented experimental WebView storage uses a browser backend.
Before choosing a candidate, require restart/crash durability, transactional
rollback, worker concurrency, schema upgrades and existing store/Yjs contract
tests. An in-memory testing implementation does not meet root durability.
Keep the backend replaceable; a link/version for the proposed implementation
is still requested. No new storage dependency is selected or tested here.

## Original intent and current implementation

The original plan (`16b2f828`, 2025-11-11) allows hierarchical, distributed and
emergent topologies. A root defines a workload/overworld; ordinary nodes may
parent their own subworlds. The December architecture (`8059da16`) explicitly
makes root a role of the same Compute Node, with no parent and potentially
delegated/sharded global state. See [node roles](arch/node-roles.md),
[compute node](arch/compute-node.md) and [original state discussion](discussions/datastate.md).

The June 18 request, recorded at 2026-06-18 17:21:49 AKDT in log.md, led to a
Deno authority/storage sidecar proposal, later committed in `2834322f`. It
deliberately excluded browser GPU execution. The November request restores
full client capabilities as the desired boundary. Retain optional authority,
stable identity, signed/versioned policy, session namespaces, leases,
checkpoints/replay and NetViz visibility from that plan. Keep Go relay/coturn
independent. A root is scoped to a deployment/session, not a mandatory global
coordinator. Root federation and election still need design and testing.

Source review at `e8f4c3cf` found no implemented root service. Existing useful
seams and constraints:

- `NodeKernel` constructs NetworkManager, StateManager and ComputeManager and
  has optional inference initialization. The demo separately composes its full
  inference runtime; NodeKernel alone does not reproduce that composition.
  Extract a reusable client-service composition, with additional root roles.
- StateManager uses y-indexeddb; AgentRecordStore uses IndexedDB/browser locks.
  ArtifactStore accepts a backend, with atomic retention/GC requirements.
- Managed inference assumes browser Workers, WorkerGlobalScope, transferable
  MessagePorts, navigator.gpu, and image/canvas APIs. Native JS plus a GPU
  binding alone does not provide this environment.
- NetworkManager's native branch selects TCP addressing without installing a
  TCP transport in its current transport list. It is not a qualified native
  Bun/Node peer. Its application peer key is newly generated at initialization;
  root identity needs explicit persisted/injected keys. Artifact identity is
  already separate and must be bound explicitly, not confused with it.
- Model inspection results are UI-memory entries. Hugging Face HTTP metadata
  has a bounded localStorage cache; catalog execution notes are manually
  recorded. These are not a shared compatibility evidence service.

## Initial browser-host recommendation (fallback after follow-up)

Prefer **Bun as a replaceable host supervisor, with an owned persistent
Chromium process executing the actual browser client modules**. Keep Node 24
and the existing Vite/build toolchain. Node 24 plus existing browser automation
is a low-change qualification baseline and fallback supervisor.

| Candidate | Assessment for the requested root |
| --- | --- |
| Deno | Maintainers provide bug/security maintenance until October 2027, with no new features. Existing binaries do not expire, but this is a poor foundation for new long-lived work. [Maintainer announcement](https://github.com/denoland/deno/issues/37030). |
| workerd | Suitable to consider for a separate HTTP ingestion/query service, but not the current client execution environment. Its former experimental WebGPU API was removed. [Current source](https://github.com/cloudflare/workerd/blob/main/src/workerd/io/compatibility-date.capnp). |
| Bun alone | Useful server runtime, but not drop-in browser parity. Native IndexedDB remains an open request; third-party GPU bindings require their own qualification. [IndexedDB issue](https://github.com/oven-sh/bun/issues/2659). |
| Bun + Chromium | Recommended candidate: share real client modules and browser semantics; Bun manages process lifetime, HTTPS/WSS, health and host metrics. Qualification remains pending. |

Bun's experimental WebView API can drive installed Chromium and use a
persistent profile. Force the Chrome backend: macOS defaults to WebKit. Force
an owned process rather than auto-attaching, pin its browser binary, and use
an explicit profile directory; default storage is ephemeral. Isolate this
choice behind a BrowserHost adapter. [Bun WebView documentation](https://bun.com/docs/runtime/webview).

Headless WebGPU needs a functioning GPU/driver/backend, not just a browser
process. Qualify it on the target server. Metadata-only roots can run without
a GPU and advertise that honestly. [Chrome headless WebGPU guidance](https://developer.chrome.com/docs/web-platform/webgpu/colab-headless).

## Composition

```mermaid
flowchart TB
  peers[Browser PeerCompute clients] <-->|PeerCompute evidence protocol| root
  subgraph host[Root host]
    supervisor[Bun supervisor: HTTPS, health, restart, OS metrics]
    subgraph root[Persistent Chromium client]
      kernel[Shared client composition / NodeKernel]
      network[NetworkManager]
      state[StateManager + model evidence store]
      compute[ComputeManager + existing inference workers]
      registry[Optional root evidence service]
      kernel --> network
      kernel --> state
      kernel --> compute
      registry --> state
      network <--> registry
      compute -->|Execution observations| registry
    end
    supervisor <-->|Bounded authenticated local bridge| root
    state --> journal[(IndexedDB report journal)]
    journal --> backups[Versioned exports / backup]
  end
```

The service schemas, aggregation and collector belong in the library, with a
thin root entrypoint. Any authorized ordinary client could host the same
service. Root operation adds uptime, retention, stable identity and operator
policy. Do not duplicate inference routing/scheduling in Bun or automate demo
buttons. Start with one authoritative IndexedDB journal and acknowledged
durable writes. Add SQLite as a derived query index or an explicit store
backend later, with recovery/migration semantics; avoid two authoritative
stores requiring fragile dual writes. Profile backup must use a consistent
export or a stopped browser, not a blind live-directory copy.
Keep the storage origin stable and the profile exclusively owned. Run bulk
model qualification in a separately supervised client process so GPU/model
failures do not take down registry ingestion. The initial registry needs no
loaded model. Keep browser debugging and the host bridge private.

Use bounded query/ingestion messages, cursors and local outboxes. Do not
replicate the entire historical corpus through Yjs or public presence. Signed
snapshots/CIDs and multiple providers can follow. Root outages must leave
local inspection/inference working. Existing generic remote execution stays
default-off: accepting a report does not authorize importing its code.

## First useful service: versioned model evidence

Keep facts and observations immutable; derive the current recommendation for
the requesting environment. Avoid a permanent boolean supported-model list.

| Record | Required distinction |
| --- | --- |
| Package facts | Repository and pinned revision; selected files, sizes and hashes; architecture, format and quantization; projector/LoRA composition. Separate package-byte fingerprint from manifest CID, which can change with runtime metadata. |
| Inspection | Package identity, inspector/resolver/admission revisions, extracted facts, complete or bounded search, structural outcome and reason. A first-32-GGUF search with no admitted candidate does not prove the repository contains none. |
| Execution | Actual executing peer, package, client build, engine/adapter/assets, device profile, workload settings, lifecycle stage, outcome and measurements. Successful loading is distinct from successful text, vision, audio or 3D execution. |

Client configuration should capture browser/OS version, GPU adapter information
when exposed, feature/limit set, execution backend, WASM capabilities, relevant
runtime options and client build. Missing hardware/driver values remain
unknown. Hardware fingerprints should be capability-oriented and avoid unique
device identifiers. For remote inference, attach the **executor's** profile,
not the requester's; correlate request/execution IDs without counting both as
independent tests.

Separate source/build identity from capability revision digests for inspection,
architecture admission, engine/shader/WASM assets and resource policy. Package
version strings alone miss our local engine patches. A UI-only change should
not invalidate every result. A relevant capability change should:

1. Preserve the old observation and its environment.
2. Recompute metadata admission against new rules where possible.
3. Change a stale negative to **needs reinspection/retest**, not to success.
4. Require new execution evidence for newly supported runtime/task combinations.

For example, a GGUF rejected by an old architecture allowlist may become a
candidate after an engine upgrade, while a previous GPU OOM remains evidence
only for its context size, offload settings and other resident models. A CDN
disconnect is an acquisition failure, never architecture incompatibility.

Normalize failures by stage: inspect, resolve/auth/download, verify/store,
load/compile, execute, device/session loss and cleanup. Record cancellation,
resource-policy rejection and unsupported architecture separately. Persist a
pending execution before running; after a crash, report interrupted/unknown
unless evidence establishes a cause. Do not invent an OOM diagnosis.

## Resource measurements and credibility

Record package size, load time, execution time/throughput, context/output
tokens, image resolution/steps, batch, GPU offload, cold/warm state and
co-resident workloads. A peak without its workload is misleading.

Every memory number needs units, method, scope, sample interval and whether it
is estimated, tracked allocation or sampled physical usage. Track separately:
JS/WASM memory, worker/process RSS, requested GPU buffers and GPU/driver memory
where available. Standard WebGPU does not expose portable exact per-model
physical VRAM peaks; maxBufferSize is a per-buffer limit, not VRAM capacity.
Adapter details may be withheld. [WebGPU specification](https://gpuweb.github.io/gpuweb/).

Our SF3D accounting excludes ORT/driver allocations; GGUF reports WASM memory;
neither is total model VRAM. Root-host OS sampling can improve measurements in
isolated runs. Shared GPU processes, unified memory and concurrent models need
explicit attribution limits. Display unknown/partial rather than false precision.

Distinguish user-reported, instrumented client-observed and root-reproduced
results. Signatures establish report authorship, not measurement honesty.
Deduplicate retries/replays, retain conflicts, show sample counts and separate
matching configurations from merely similar ones. Shared successes are
advisory; local capability/integrity checks still apply. Sharing should exclude
private prompts, images, generated responses, secrets and raw unrestricted
logs; keep bounded redacted error codes and diagnostics. Reporting policy and
retention/deletion controls must be explicit.

## Ordered implementation and acceptance

All items below are proposed and **unimplemented**.

1. **Qualify the root client host.** Compare Bun/Chromium with the Node 24
   baseline using the existing managed worker, artifact MessagePort and a small
   actual GPU workload. Verify stable identity, IndexedDB/locks after restart,
   cancellation/worker cleanup, SecretWorkshop connectivity and watchdog
   recovery with an owned profile. No new scheduler or demo UI dependency.
2. **Ship the evidence MVP.** Add shared schemas, local StateManager store/outbox,
   collector hooks at inspection and ModelInferenceService lifecycle, optional
   root ingestion/query and durable acknowledgements. Reuse/extract the existing
   Hugging Face inspector; do not create a competing compatibility engine.
3. **Use it in model discovery.** Show exact versus similar-device evidence,
   modality tested, measured versus estimated resources and stale-result
   reasons. Reinspect on relevant capability changes; offer focused retesting.
   Metadata queries must not force weight downloads or model loading.
4. **Add reproducible qualification.** Opt-in root runs with versioned workload
   recipes, OS metrics and targeted regression queues. Preserve prior releases'
   results. Rank tests affected by an engine change instead of retesting every
   model after every UI build.
5. **Extend original root duties.** Signed session bootstrap/policy, leases,
   state journal/checkpoint/replay, NetViz and eventual multi-root recovery.
   Keep none/advisory/authoritative modes and root-free sessions. Evidence may
   inform local cellular-automata decisions; it does not establish the core
   conjecture or require centralized scheduling.

Required regressions include offline outbox/restart/idempotence, exact model and
adapter identities, partial inspection, matching executor profiles, relevant
versus irrelevant version changes, contradictory observations, honest unknown
memory, crash recovery, invalid reports and unaffected root-free clients.
See [test strategy](tests.md#planned-root-node-validation).

This analysis used live source/history and current primary-source runtime
documentation. It does not establish Bun/Chromium execution parity or server
operational readiness; those are the first implementation gates.
