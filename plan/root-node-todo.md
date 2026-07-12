# Deno Root Node TODO

Status: planning artifact created 2026-06-18 AKDT.

## Purpose

Build a real PeerCompute root node for implementations that need durable
orchestration, synchronization, and data saving. The existing docs describe a
root node as a special compute node with no parent, but the repo currently has
browser `NodeKernel` peers, relay/TURN infrastructure, topology controllers,
and authority hooks rather than a server-side root-node service.

This todo scopes a new Deno service that acts as the root authority/control
plane for selected PeerCompute sessions. It should run on a domain over
HTTPS/WSS, publish signed policy and session data, coordinate room/topology
authority, and save/replay approved state. It should not replace the current Go
relay/coturn backend or the browser compute/runtime stack.

## Current Ground Truth

- `plan/arch/node-roles.md` defines the root node as a node with no parent that
  defines workload/topology config, may host or shard global state, and anchors
  authority/policy decisions.
- `plan/arch/compute-node.md` defines browser compute nodes as `NodeKernel`
  plus `NetworkManager`, `StateManager`, `ComputeManager`, IO, `DataState`, and
  CPU/WASM/WebGPU workers.
- `plan/arch/nodekernel.md` gives `NodeKernel` the browser-side authority hooks:
  topology role, clock policy, scheduler ticks, warm-delta provider, state
  mutation routing, and compute result routing.
- `plan/arch/datastate.md` defines the hot/warm/cold state model and
  `commitDelta()` contract. The root node should consume cold/warm state
  records; it should not claim ownership of browser GPU hot buffers.
- `peercompute/docs/RELAY_SERVER.md` says the Deno relay is legacy. New root
  node work should use Deno for orchestration/control-plane service code, not
  revive `peercompute/src/relay/server.ts` as the production relay.
- Current production backend direction is Go relay plus coturn, launched via
  repo scripts and systemd helpers. The root node should integrate with that
  fabric by advertising relay/ICE config and control metadata.

## Non-Goals

- Do not replace browser `NodeKernel` as the per-client runtime.
- Do not replace the Go relay or coturn TURN/STUN service.
- Do not run browser-only WebGPU workloads in Deno.
- Do not silently accept executable code from peers. Root-node messages should
  be JSON, binary packets, hashes, manifests, and signed metadata.
- Do not redesign the public `NodeKernel` and `StateManager` APIs wholesale.
  Prefer optional adapters/config fields.
- Do not promote untrusted remote compute results to authoritative state
  without admission, quorum, provenance, and replay policy.

## Target Capabilities

- Durable root identity for a PeerCompute implementation.
- Session registry for `gameId`, `topologyId`, `roomId`, implementation id,
  policy revision, and root authority term.
- Signed root manifests describing topology, scheduler profile, persistence
  policy, admission policy, storage scopes, relay/ICE config URL, and trusted
  code/manifests.
- Root-controlled clock and authority options for sessions that need a
  server-backed source of truth.
- Optional persistent snapshots, journals, checkpoints, and replay manifests.
- Browser-client bootstrap endpoint that tells a `NodeKernel` how to join a
  root-coordinated PeerCompute session.
- Control-plane WebSocket for leases, heartbeats, role assignments, policy
  updates, checkpoint acknowledgements, and root events.
- State ingest pipeline for warm deltas, selected Yjs/CRDT updates, and
  application-specific save records.
- Query/download APIs for saved sessions, snapshots, replay packets, and audit
  logs.
- NetViz/operator visibility into root-managed sessions, roles, leases, shard
  summaries, checkpoint age, and policy revision.

## Proposed Repo Shape

Preferred first layout:

```text
root-node/
  deno.json
  src/
    main.js
    config.js
    rootNodeService.js
    identity.js
    sessionRegistry.js
    policyStore.js
    leaseManager.js
    topologyOrchestrator.js
    syncCoordinator.js
    checkpointStore.js
    storage/
      adapter.js
      memoryStore.js
      sqliteStore.js
    http/
      routes.js
      websocket.js
    schemas/
      rootSchemas.js
  tests/
    *.test.js
scripts/
  start-root-node.sh
  install-root-node-systemd.sh
```

Alternative if the package boundary should live under the library:

```text
peercompute/root-node/
```

Choose the boundary before implementation. The root-level `root-node/` layout
keeps the server product separate from the browser library and legacy relay
folder, which is cleaner for Deno permissions and deployment.

## Core Schemas To Define

- `peercompute.root.identity.v0`
  - root id, public key, created time, implementation id, allowed origins.
- `peercompute.root.session-manifest.v0`
  - session id, `gameId`, `roomId`, `topologyId`, topology type, policy
    revision, clock mode, scheduler profile, relay config URL, persistence
    scopes, admission mode.
- `peercompute.root.policy.v0`
  - root authority mode, role rules, shard rules, task placement mode, state
    admission rules, save/checkpoint cadence, rate limits.
- `peercompute.root.lease.v0`
  - peer id, role, term, expiresAt, parent id, shard id, host capacity,
    authority permissions.
- `peercompute.root.heartbeat.v0`
  - peer id, session id, term, current role, topology metric, resource summary,
    queue pressure, last checkpoint sequence.
- `peercompute.root.warm-delta-ingest.v0`
  - source peer id, namespace, sequence, vector/clock metadata, content hash,
    compact payload or artifact ref.
- `peercompute.root.checkpoint.v0`
  - session id, sequence, policy revision, accepted namespaces, state hashes,
    artifact refs, retained snapshot pointer.
- `peercompute.root.replay-manifest.v0`
  - session id, starting checkpoint, ordered delta refs, root policy refs,
    deterministic replay options.
- `peercompute.root.audit-event.v0`
  - timestamp, actor, action, schema, hash, admission status, reason.

Keep schemas explicit and versioned so browser demos, NetViz, and chaos-lab can
test against stable contracts.

## Public API Sketch

HTTP:

- `GET /.well-known/peercompute-root.json`
  - root id, public key, root API URL, WebSocket URL, supported schema
    versions, relay config URL.
- `GET /healthz`
  - process, storage, root identity, and relay config health.
- `GET /api/root/manifest`
  - root-level signed manifest.
- `POST /api/sessions`
  - create or resume a root-managed session.
- `GET /api/sessions/:sessionId`
  - fetch signed session manifest and current policy revision.
- `GET /api/sessions/:sessionId/bootstrap`
  - browser bootstrap payload for `NodeKernel`: relay config, room/topic
    scope, root WebSocket URL, authority mode, initial scheduler profile.
- `POST /api/sessions/:sessionId/checkpoints`
  - submit a checkpoint candidate or root-side checkpoint command result.
- `GET /api/sessions/:sessionId/checkpoints/:sequence`
  - fetch checkpoint metadata and artifact refs.
- `GET /api/sessions/:sessionId/replay`
  - fetch replay manifest for saved state.
- `GET /api/sessions/:sessionId/audit`
  - root admission and control-plane audit stream.

WebSocket:

- `root-hello`
  - browser peer announces peer id, implementation id, session id, capability
    summary, schema support, and optional auth token.
- `root-welcome`
  - root returns lease, term, role, scheduler profile, state sync plan,
    checkpoint cursor, and signed policy hash.
- `root-heartbeat`
  - peer publishes liveness/resource/topology/status metadata.
- `root-policy-update`
  - root sends scheduler/topology/admission changes.
- `root-lease-update`
  - role/parent/shard/authority lease changes.
- `root-warm-delta`
  - peer submits compact deltas for admitted namespaces.
- `root-checkpoint-command`
  - root requests a checkpoint/save operation from an authority peer.
- `root-checkpoint-ack`
  - peer reports checkpoint success/failure with hashes.
- `root-event`
  - join/leave, policy, admission, storage, or failover event.

## Browser Integration TODO

- Add a small `RootAuthorityClient` module in the browser library.
  - Inputs: `rootNodeUrl`, `sessionId`, optional auth token, schema versions,
    `NodeKernel` peer id.
  - Outputs: bootstrap config, lease state, policy updates, checkpoint cursors,
    root status.
- Add optional `NodeKernel` config fields without breaking existing demos:
  - `rootNodeUrl`
  - `rootSessionId`
  - `rootAuthorityMode: "none" | "advisory" | "authoritative"`
  - `rootStateNamespaces`
  - `rootCheckpointPolicy`
- Wire root-provided scheduler profile into `NetworkManager.configureScheduler()`
  when `rootAuthorityMode` is not `none`.
- Map root lease roles onto existing topology roles:
  - root-managed host
  - parent/cluster leader
  - child/leaf
  - peer/mesh participant
- Let `StateManager` expose an explicit save/checkpoint export:
  - warm namespace summaries
  - Yjs update vector or state vector, if enabled for that namespace
  - content-addressed artifact refs instead of large inline blobs
- Let `StateManager` import a root checkpoint on cold start or reconnect, with
  schema/hash validation before applying it.
- Publish root status to NetViz metadata so operators can see whether a demo is
  self-hosted, advisory-rooted, or authoritative-rooted.

## Deno Service TODO

### Phase 0 - Design Lock

- [ ] Decide final folder boundary: `root-node/` vs `peercompute/root-node/`.
- [ ] Decide storage baseline:
  - memory store for tests;
  - SQLite for first durable local/prod store;
  - optional Deno KV adapter only after the current Deno deployment target is
    confirmed.
- [ ] Decide whether the root node joins libp2p directly later, or remains an
  HTTP/WSS control plane that relies on the current Go relay for browser P2P.
  MVP should use HTTP/WSS control plane plus existing relay.
- [ ] Define threat model: trusted demo root, semi-trusted peers, untrusted
  compute results, private rooms, and public demo sessions.
- [ ] Define session id and implementation id formats.
- [ ] Decide root clock behavior:
  - advisory time anchor;
  - authoritative scheduler ticks;
  - checkpoint epoch only.

### Phase 1 - Deno Scaffold

- [ ] Add `root-node/deno.json` with `check`, `test`, `dev`, and `start`
  tasks.
- [ ] Add a permission-minimal dev command:
  - `--allow-net=127.0.0.1:PORT`
  - `--allow-read=<config paths>`
  - `--allow-write=<data dir>`
  - `--allow-env=PEERCOMPUTE_ROOT_*`
- [ ] Add `src/main.js` process entrypoint with signal handling.
- [ ] Add `src/config.js` for env/config file loading.
- [ ] Add `src/rootNodeService.js` for lifecycle start/stop.
- [ ] Add `src/http/routes.js` and `src/http/websocket.js`.
- [ ] Add `scripts/start-root-node.sh` with dry-run mode.
- [ ] Add `scripts/install-root-node-systemd.sh` after the dev process is
  stable.

### Phase 2 - Identity And Signing

- [ ] Generate or load a stable root signing key.
- [ ] Store key material outside the repo by default.
- [ ] Expose root public key through `/.well-known/peercompute-root.json`.
- [ ] Sign root manifests, session manifests, policies, checkpoints, and replay
  manifests.
- [ ] Add hash helpers for JSON canonicalization and binary artifact refs.
- [ ] Add replay-safe audit records for every signed control-plane change.

### Phase 3 - Session Registry

- [ ] Implement `SessionRegistry`.
- [ ] Support create/resume/close session lifecycle.
- [ ] Record:
  - implementation id;
  - `gameId`;
  - `roomId`;
  - `topologyId`;
  - policy revision;
  - root authority term;
  - created/updated timestamps;
  - current checkpoint cursor.
- [ ] Add per-session origin/auth policy.
- [ ] Add session garbage-collection and archive states.
- [ ] Add `GET /api/sessions/:sessionId/bootstrap`.

### Phase 4 - Lease And Authority Manager

- [ ] Implement peer leases with monotonic root term.
- [ ] Track role assignments and expiry.
- [ ] Provide host/parent/child role suggestions for hierarchical sessions.
- [ ] Provide an authority handoff model for reconnects:
  - root lease expires;
  - standby host promotion;
  - peer reconnect gets new term;
  - stale term writes are rejected.
- [ ] Map root lease authority into existing scheduler authority fields.
- [ ] Add split-brain prevention tests: two roots must not both own the same
  authoritative session unless explicitly configured as separate terms.

### Phase 5 - Policy Store

- [ ] Implement signed policy revisions.
- [ ] Include scheduler profile, role rules, shard rules, checkpoint cadence,
  namespace admission rules, task placement hints, and storage retention.
- [ ] Add policy diffing for operator clarity.
- [ ] Push `root-policy-update` over WebSocket.
- [ ] Require peers to include policy revision in warm-delta/checkpoint
  submissions.

### Phase 6 - Synchronization Coordinator

- [ ] Implement root-side `SyncCoordinator`.
- [ ] Accept warm deltas only for admitted namespaces.
- [ ] Validate sequence, policy revision, source peer lease, schema version, and
  content hash.
- [ ] Store accepted deltas in an append-only journal before updating snapshot
  state.
- [ ] Record rejected deltas with reasons.
- [ ] Support state-vector/Yjs update ingest only behind a namespace flag so
  root storage is not accidentally global.
- [ ] Provide checkpoint cursor to reconnecting peers.
- [ ] Provide root-to-peer resync plan:
  - latest checkpoint;
  - missing delta range;
  - policy revision mismatch handling.

### Phase 7 - Durable Storage

- [ ] Implement `StorageAdapter` interface.
- [ ] Implement `MemoryStore` for tests.
- [ ] Implement `SQLiteStore` for local/prod default.
- [ ] Store session manifests, policies, leases, audit events, delta journal,
  checkpoints, replay manifests, and artifact refs.
- [ ] Add snapshot compaction.
- [ ] Add retention policy:
  - max checkpoints;
  - max delta age;
  - archive/export path.
- [ ] Add backup/export command for saved sessions.
- [ ] Add restore command that can replay from checkpoint plus deltas.

### Phase 8 - Topology Orchestration

- [ ] Consume peer heartbeats with RTT/resource/topology metric summaries.
- [ ] Emit root-side role recommendations:
  - host;
  - backup host;
  - parent;
  - child/leaf;
  - mesh peer.
- [ ] Emit shard assignments and parent referrals.
- [ ] Integrate with `plan/branch/topologies.md` rules:
  - three-layer Root -> Hosts -> Clients;
  - standby promotion;
  - room capacity/referral;
  - sharded state topics;
  - relay retention policy.
- [ ] Keep actual P2P connection dials in browser `NetworkManager`; root should
  recommend/referee, not own browser sockets.

### Phase 9 - Task And Service Orchestration

- [ ] Let root policies publish workload descriptors and task placement hints.
- [ ] Persist `ComputeManager` task-graph/result metadata as admitted records.
- [ ] Integrate with existing schemas:
  - `peercompute.nodekernel.task-graph-authority.v0`
  - `peercompute.nodekernel.remote-task-graph-request.v0`
  - `peercompute.compute.task-packet.v0`
  - `peercompute.compute.remote-task-envelope.v0`
  - service-orchestration manifest schemas.
- [ ] Keep root admission metadata-only until redundant/quorum validation exists.
- [ ] Add hooks for root-managed ULG service manifests without requiring ULG to
  be checked out locally.

### Phase 10 - Data Saving And Replay

- [ ] Define saved-session format.
- [ ] Add explicit save triggers:
  - periodic checkpoint;
  - operator request;
  - before policy change;
  - before root shutdown;
  - demo-specific milestone.
- [ ] Add replay manifest generation.
- [ ] Add deterministic replay smoke for a simple state namespace.
- [ ] Add saved-session browser resume path:
  - root sends checkpoint;
  - peer imports state;
  - peer rejoins relay/P2P fabric;
  - peer resumes deltas from checkpoint cursor.
- [ ] Add export/import CLI for saved sessions.

### Phase 11 - NetViz And Operator UI

- [ ] Extend NetViz attach metadata with root node status.
- [ ] Show root id, policy revision, authority mode, session id, checkpoint age,
  peer leases, role map, shard map, and rejected delta counts.
- [ ] Add root audit stream viewer in NetViz or a minimal retro-terminal
  operator page served by Deno.
- [ ] Add root health warnings:
  - storage lag;
  - stale checkpoints;
  - lease churn;
  - policy mismatch;
  - rejected writes;
  - relay config mismatch.

### Phase 12 - Deployment

- [ ] Add systemd service installer after MVP tests pass.
- [ ] Keep root-node service separate from relay/coturn units.
- [ ] Add nginx/Caddy reverse-proxy example for HTTPS/WSS.
- [ ] Add data directory and key directory defaults:
  - `/var/lib/peercompute-root`
  - `/etc/peercompute-root`
- [ ] Add dry-run production preflight:
  - config valid;
  - key readable;
  - storage writable;
  - public root URL reachable;
  - relay config URL reachable;
  - allowed origins configured.

## Test Plan

### Deno Unit Tests

- [ ] Schema validation tests for all root schemas.
- [ ] Identity/signature tests for manifests and checkpoints.
- [ ] Session registry lifecycle tests.
- [ ] Lease expiry/renewal/term tests.
- [ ] Policy revision and diff tests.
- [ ] Storage adapter parity tests: memory and SQLite.
- [ ] Sync coordinator admission/rejection tests.
- [ ] Checkpoint/replay manifest tests.

### Node/Browser Contract Tests

- [ ] `RootAuthorityClient` can fetch bootstrap manifest from a local Deno root.
- [ ] `NodeKernel` can accept root-provided scheduler profile without breaking
  non-root demos.
- [ ] `StateManager` can export a checkpoint candidate for admitted namespaces.
- [ ] `StateManager` can import a root checkpoint in a fresh browser context.
- [ ] NetViz can render root session metadata.

### Integration Tests

- [ ] Spawn Deno root node plus local relay.
- [ ] Start two headless browser peers in the same root-managed session.
- [ ] Verify both peers receive root leases and the same policy revision.
- [ ] Verify warm deltas are accepted into the root journal.
- [ ] Force one browser peer restart and restore from the root checkpoint.
- [ ] Restart the root process and verify it restores sessions/checkpoints from
  durable storage.
- [ ] Run root-managed CubeChat or Keystone smoke with relay/TURN local infra.
- [ ] Run chaos-lab scenario with root-managed sessions once the MVP path is
  stable.

### Security Tests

- [ ] Reject writes with stale lease term.
- [ ] Reject writes for unadmitted namespace.
- [ ] Reject checkpoint with invalid hash.
- [ ] Reject unsigned or invalidly signed policy.
- [ ] Enforce allowed origin/session auth policy.
- [ ] Rate-limit repeated bad WebSocket messages.

## First Implementation Slice

Build the smallest useful root node before adding topology intelligence:

1. `root-node/` Deno scaffold with health endpoint and WebSocket.
2. Stable root identity and signed root manifest.
3. In-memory session registry.
4. Browser `RootAuthorityClient` that fetches bootstrap and opens WebSocket.
5. Root lease handshake with one browser `NodeKernel`.
6. Warm-delta ingest for one admitted namespace.
7. Memory-store checkpoint and replay manifest.
8. Unit tests plus one two-peer browser smoke.

Definition of done for slice 1:

- `deno test` passes for root-node modules.
- `node --test` passes for browser/client contract tests.
- A local Deno root and local relay can host two browser peers.
- The root journal records at least one accepted warm delta and one checkpoint.
- Restarting the root process preserves or intentionally resets state according
  to the selected storage mode, with the behavior documented in test output.

## Open Questions

- Should the root node ever join libp2p directly, or should it remain a
  conventional HTTPS/WSS authority while browser peers use libp2p through the
  relay?
- Should authoritative root state use Yjs updates, a PeerCompute-specific
  warm-delta journal, or both by namespace?
- Should public demos use auth-free advisory roots while private rooms require
  signed room tokens?
- Should Keystone use a browser-host root for the visual story first, then add
  Deno-root mode, or should Keystone wait for Deno root MVP?
- Should root-managed sessions be one root per implementation, one root per
  room, or one root per deployment with multiple implementation namespaces?
- What storage backend should be considered production-default after SQLite:
  Postgres, object storage plus SQLite index, or Deno KV if the deployment
  target supports it cleanly?

## References

- `README.md`
- `plan/plan.md`
- `plan/arch/node-roles.md`
- `plan/arch/compute-node.md`
- `plan/arch/nodekernel.md`
- `plan/arch/datastate.md`
- `plan/branch/topologies.md`
- `plan/branch/distributed-compute.md`
- `plan/branch/keystone-demo.md`
- `peercompute/docs/RELAY_SERVER.md`
