## Keystone Demo
- We need a demo to visually demonstrate the key innovation from the readme in realtime. where one user is defined as the root node (maybe in a room that they create and others can join) a predefined workload can be selected from a list of varying types. and then you get to see a visualization of the evolution of the network as it reconfigures while computing the workload. 
- Details: plan/branch/keystone-demo.md.


## TODO Demos

- 3d network visualizer to view the p2p network graph and edges and data flows live (do this in a tron style grid with nodes represented as cubes and connections between nodes ans glowing nurbs curves.)


- WASM-backed demo workloads that exercise the new ComputeManager runtime
- REAL distributed compute workload examples. 
- Chemistry demo: retro-terminal `Fano Reactor` that turns the sedenion chemistry paper into an interactive reaction chamber and distributed pair-compute workload.
- Details: plan/branch/chem.md.
- Demos for each network topology

- shared 3d editing environment based on https://threejs.org/editor/ where users can make 3d models together github https://github.com/mrdoob/three.js/tree/master/editor
- motorcycle game similar to road rash and the tron lightcycle game
- shared "VR CHAT" style world that uses your webcam to pose your 3d model. based on the input model from daddy go. 


# Physics and engine upgrades
- Apply PPF model to other physics demos
- create a better input model that abstracts/unifies the camera / vr / keyboard / mobile / controller inputs

-fully integrated engine demo that uses the best of webgpuphys, input abstraction, videochat/pose detection, collaborative editing etc. 

- integrated procedural generation library that ties the universe generation up to the planet generator. 

## detailed plan and architecture. 

## Branch Goal
Use the demo suite to prove the PeerCompute architecture end-to-end: layered DataState, NetworkScheduler profiles/topologies, ComputeManager (CPU/GPU/WASM), and GPU hub interop. The demos should double as validation tools for the distributed compute roadmap.

## Status Snapshot (2026-03-12)

### In Progress
- Phase 2b: WebRTC direct connection stability root-cause analysis complete; implementation planned (see Phase 2b section below).

### Recently Updated
- Node relay remains the default in dev scripts; prod/systemd now respects `RELAY_IMPL`.
- Go relay now joins pubsub topics with relay participation to forward traffic.
- Dev gossipsub defaults tuned for testing (neutral scoring + wider mesh bounds).
- Fano Reactor demo scaffolded with exact sedenion algebra, bond-lab UI, and headless chemistry tests.
- 2026-04-03: fresh `docs/*/relay-config-source.json` + prod `relay-config.json` artifacts were built and deployed; live GitHub Pages demos now fetch prod relay config from `https://secretworkshop.net/peercompute/config/relay-config.json`.
- 2026-04-03: after the old `peercompute-relay` service was stopped on the host, the production relay was relaunched successfully with the detached current Node relay on `127.0.0.1:8080`; public `wss://secretworkshop.net/` and TURN `:3478` were re-verified.
- 2026-04-03: live NetViz browser runs now start successfully against prod; current production runtime is Node, not Go, though browser logs still show some relay-webrtc signal timeouts and a leaked `/ip4/127.0.0.1/...` relay-scoped address.
- 2026-04-03: docs and launchers were aligned so production explicitly targets the Go relay under systemd; prod launchers now fail closed when `RELAY_IMPL=go` but `go` is unavailable.
- 2026-04-03: added `scripts/install-prod-systemd-services.sh` as the one-command production installer; it defaults to split Go relay + coturn systemd services and supports `--dry-run` for tmux-safe copyless setup.
- 2026-04-03: prod host now shows enabled split systemd units (`peercompute-relay`, `peercompute-coturn`); live process table shows `pcserver.sh` + `go run .` + `peercompute-relay-go` + `turnserver`, and the old Node relay process is gone.
- 2026-04-03: post-cutover NetViz browser smoke shows healthy bootstrap on the Go relay plus a mixed transport set (`direct-websocket`, `relay-webrtc`, `relay`, and at least one `webrtc-direct`). Remaining browser-side imperfection: `Libp2p addrs: []` and a still-high proportion of relay-scoped WebRTC links.
- 2026-04-03: fixed a peer-level relay-drop bug in `NetworkManager`: relay pruning now retries after `directUpgradeGraceMs` and closes both `relay` and `relay-webrtc` once a true direct path is stable. Fresh docs bundles were rebuilt; GitHub Pages redeploy is required for the live demos to pick up the fix.
- 2026-04-03: traced the post-cutover empty browser `Libp2p addrs` issue to the Go relay advertising only its internal listen address behind nginx. `peercompute/src/relay-go/main.go` now uses libp2p `AddrsFactory` plus dual-family public bootstrap generation from `RELAY_PUBLIC_*`, so relay reservations should advertise `secretworkshop.net:443/wss` instead of loopback/private addresses after the prod service is restarted.
- 2026-04-03: confirmed this workspace is now running under the npm Codex shell with full host access (`HOME=/home/cos`; `node` v24.14.1, `tmux`, `go`, `systemctl`, and `journalctl` all available), so prod service inspection/restarts and normal headless test runs can now be executed directly from here.
- 2026-04-03: restarted `peercompute-relay` after commit `b3a89933`; fresh journal startup logs now show `Advertised addresses:` with `/dns4/secretworkshop.net/tcp/443/wss` and `/dns6/secretworkshop.net/tcp/443/wss`, and both local plus public `config/relay-config.json` now serve the matching dual-family bootstrap peers.
- 2026-04-03: re-traced the older chaos-lab empty-`getMultiaddrs()` fix. That historical fix was browser-side `NetworkManager` work, not the Go-relay patch: use specific bootstrap `/.../p2p/<relay>/p2p-circuit` listen addrs (not generic `/p2p-circuit`) so circuit reservations hit `CircuitListen`/`addedRelay()`, plus enough transport upgrade-overlap headroom so the bootstrap relay is not pruned mid-WebRTC-upgrade. Both fixes are still present in the current tree and the focused `peercompute/tests/unit/networkManager.webrtc.test.js` suite still passes, so the remaining prod symptom likely differs from the original chaos-lab regression.
- 2026-04-03: cleaned up the host TURN split-brain: `coturn.service` is now disabled/stopped and only `peercompute-coturn.service` remains active.
- 2026-04-03: installed `libasound2` on the host so Playwright Chromium can run headlessly from this shell; clean headless checks now show non-empty public relay circuit addrs on both the locally rebuilt NetViz and the live GitHub Pages NetViz, including the shared `room=telemetry`, so the earlier empty-address symptom is not currently reproducible from a fresh browser session.
- 2026-04-03: Go relay reservation TTL parity hardening landed locally in `peercompute/src/relay-go/main.go` (`1 minute -> 1 hour`) and `peercompute-relay` was restarted at `22:27 UTC` to pick it up. This is now live on the host but still needs a normal git commit/push if we want branch history/origin to match the running service exactly.
- 2026-04-04: reproduced the sticky-relay / over-cap browser behavior locally with `node peercompute/tests/runtime/netviz-scale.mjs --peers 6 --wait 30000 --maxConnections 3 --targetConnections 2 --dropRelay true --relayRetention logn --retentionMin 2` (`Relay-connected peers: 6`, `Avg connections: 3.67`). Fixed it in `NetworkManager` by treating active direct-capable peers as a mesh-health fallback when gossipsub mesh views lag and by pruning excess unsolicited peers back to logical `maxConnections` on topology ticks. The same headless scale harness now converges to `Relay-connected peers: 3`, `Avg connections: 2.67`, and a local NetViz client pointed at the live prod relay config converges to only the earliest logN keepers retaining bootstrap relay.
- 2026-04-04: tightened NetViz relay-line semantics so the light-blue relay/pubsub line is only drawn when telemetry reports an active direct relay transport neighbor (`connectedAt` + direct signaling/transport to the relay), and added focused overlay tests in `demos/netviz/tests/relayOverlay.test.js`.
- 2026-04-04: strengthened multiplayer validation around the deploy by expanding `demos/tests/runtime-p2p.mjs` to support demo filtering, local relay-config-source cleanup, and NetViz attach coverage; fixed a CubeChat WebRTC glare/order race (renegotiation rollback + queued early remote video streams) and added DaddyGo `?e2e=1` hooks so headless Chromium can assert real score replication. Local Go-relay runtime now passes for `cubechat`, `sneakywoods`, `daddygo`, and `netviz`; Hyperborea still needs prod Chromium validation because its local relay-circuit listen path times out under the current harness.
- 2026-04-04: unlocked the existing SSH deploy key with the user-provided passphrase and pushed `f69fb9de` to `origin/demo-fixes`. Follow-up multiplayer fixes then added a `transportManager.faultTolerance = no-fatal` pass-through in PeerCompute so Hyperborea browser nodes can survive transient circuit-listen timeouts, hardened CubeChat async signaling against unhandled answer/ICE races, and switched Hyperborea's runtime gate to a real `?e2e=1` remote-player replication check. The full local Chromium gate `npm run test:runtime:p2p` now passes for `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, and `netviz`.
- 2026-04-04: live GitHub Pages verification must use `https://metaversejs.github.io/peercompute/...` rather than the old root-path URLs. As of `2026-04-04 01:29 UTC`, the live `/peercompute/netviz/` and `/peercompute/hyperborea/cb.html` pages were still serving the previous asset hashes (`index-RprJ9kUE.js`, `cb-DA2AY05c.js`), so another push with the newer source/docs commit is required before rechecking production Chromium behavior.

### Next Up
- Implement Phase 2b fixes (direct-drop recovery, relay safety window, election broadcast, reservation pruning).
- Capture a browser-session-specific repro if `Libp2p addrs: []` appears again: asset hash, hard-refresh/incognito behavior, room, and whether `?debugoutput=1` changes the outcome.
- Investigate remaining live `webrtc-relay` signal-timeout / `RTCErrorEvent` churn during browser relay-assisted dials.
- Sync the verified local Go relay TTL hardening back into git history/origin so the running host and branch tip do not drift.
- Decide whether to GitHub Pages deploy the browser-side relay/cap hardening now that local client checks against the live prod relay config look correct.
- Add supervised restart or closed-stream guards for the Node relay gossipsub crash.
- Implement relay drop/rejoin strategy after nodes hit target peers to reduce relay load.
- Add scoped + sharded Yjs update modes so global state is not broadcast to every node.
- Keep `metaversejs.github.io/peercompute/` deploys in sync whenever prod relay config/bootstrap changes.

### Blocked / Risks
- Node relay can still crash on StreamStateError when gossipsub writes to closed streams.
- Live prod browser logs still show intermittent `webrtc-relay` signal timeouts even though fresh headless sessions on 2026-04-03 now report healthy non-empty public relay circuit addrs; any remaining empty-address complaints are likely browser/session-specific and still need a deterministic repro.
- Host/runtime drift risk: the relay service now includes a local uncommitted TTL hardening change in `peercompute/src/relay-go/main.go`; commit/push that change if we want the branch tip and running prod host to stay aligned.

## Scale Plan (current focus)
Goal: reduce relay load so it behaves as a rendezvous/fallback path, not the main pipe.

### Phase 1: Local relay sandbox + config wiring (now)
- Stand up a local relay target for iterative changes (avoid breaking prod).
- Add `pubsubType` + gossipsub options to relay-config outputs and demo bootstraps.
- Ensure relay server can toggle floodsub/gossipsub via config/env.

### Phase 2: WebRTC direct-first + relay pruning (in progress)
- Prefer direct `/webrtc` dialing and drop relayed connections once direct is established.
- Confirm pubsub traffic flows peer-to-peer over direct links.

### Phase 2b: WebRTC Direct Connection Stability (planned)

**Root causes of direct connections not staying connected:**

1. **Relay pruned before direct is truly stable.** `_maybePruneRelayConnections` (NM:3611) closes relay connections after `directUpgradeGraceMs` (default 10 s). Once the relay is gone there is no fallback if ICE later fails (NAT rebind, DTLS timeout, etc.).

2. **No targeted redial scheduled on direct drop.** When `connection:close` fires for a direct WebRTC connection, only two things happen: `_scheduleIsolationRelayRedial` (fires only when ALL active connections reach zero) and `_maybeUpdateBootstrapRelayConnections` (fixes bootstrap only). Neither schedules a redial to the specific lost peer. Recovery depends entirely on the next presence tick (default every 3 s).

3. **Dial throttle blocks fast reconnect.** `recentDialAttempts` still holds the peer's last dial time at the moment of drop. `_maybeDialPeer` (NM:3302) skips the peer for up to `PEER_DIAL_THROTTLE_MS` (5 s) even after the connection has fully closed. Combined with the presence interval, worst-case reconnect window is ~8 s.

4. **`dropRelayBootstrapOnDirect` burns the relay bridge.** When this flag (default `true`) prunes the bootstrap relay because direct connections exist, and those direct connections then drop, reconnection requires a fresh bootstrap dial. The relay reconnect path in `_reconnectRelayForDial` (NM:1968) checks `_hasBootstrapRelayConnections()` and bails early if the relay is mid-close, creating a race.

5. **Election race: multiple peers can simultaneously be relay keepers.** `_shouldElectRelayRedial` (NM:2172) reads `_getScopedPeers()` and elects the peer with fewest connections, but winner status is set only in local state (`relayKeeperUntil`). No presence broadcast is forced after winning, so other peers remain unaware for up to one full presence interval. With symmetric load, two peers can both win at the same time.

6. **`relayReservationPeers` Set never pruned.** Peer IDs are added to the Set in `_reserveRelayForPeer` (NM:3240) but never removed on peer disconnect or stale-peer pruning → unbounded growth at scale.

7. **Duplicate `toString()` copy-paste.** NM:1462, 1504, 1769, 1800, 1837, 1855: both sides of the `||` call the same method, e.g. `conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.()`. The apparent intent is a fallback (likely `remotePeer?.toString?.() || remotePeer?.toString?.()` vs `remotePeer?.peerId?.toString?.()`), so the real fallback is silently missing.

**Implementation plan (ordered by impact):**

- **Fix A – On direct-drop, clear dial throttle and schedule immediate relay-via-redial.**
  In the `connection:close` handler (NM:1460): if the closing connection is a direct WebRTC link and no direct connections remain for that peer, delete `recentDialAttempts[peerId]` (clear throttle) then call `_maybeDialPeer(peerId, 'direct-drop-recovery')` asynchronously. This collapses the worst-case 8 s window to near-instant.

- **Fix B – "Relay safety window" after first direct upgrade.**
  After `_maybePruneRelayConnections` decides to drop relay, keep the bootstrap relay alive for an extra configurable `relayPostDirectHoldMs` (suggest 60 s default) before fully closing it. This gives ICE-flapping connections a fast fallback path without holding the relay for ever.

- **Fix C – Force presence broadcast after winning relay election.**
  In `_shouldElectRelayRedial` (NM:2205), when `isWinner` is set, call `_publishPresenceNow()` immediately to propagate `relayConnected: true`. Prevents double-election race.

- **Fix D – Prune `relayReservationPeers` on peer disconnect and in `_pruneStalePeers`.**
  In the `peer:disconnect` handler (NM:1538): `this.relayReservationPeers.delete(peerId)`.
  In `_pruneStalePeers` (NM:2267): delete from `relayReservationPeers` alongside the other per-peer cleanup.

- **Fix E – Prune `relayAssistState` Maps in `_pruneStalePeers`.**
  In `_pruneStalePeers`, clear `lastRequestAt`, `inboundRequestAt`, and cancel/delete `pendingReadyTimeouts` for stale peers.

- **Fix F – Cancel `autoDisconnectTimer` in `stop()`.**
  Add `clearTimeout(this.relayReconnectState.autoDisconnectTimer)` to the `stop()` / teardown path so it cannot fire after the instance is destroyed.

- **Fix G – Repair duplicate `toString()` fallbacks.**
  Replace every instance of `conn?.remotePeer?.toString?.() || conn?.remotePeer?.toString?.()` with the correct fallback `conn?.remotePeer?.toString?.() || conn?.remotePeer?.peerId?.toString?.()` (or whichever field is the real fallback in each context).

**Testing plan:**

- *Headless unit tests* (`demos/tests/`):
  - Simulate peer connect → direct upgrade → relay prune → direct drop → assert reconnect fires within 1 s.
  - Assert `relayReservationPeers` size stays bounded when peers join and leave.
  - Assert duplicate relay election doesn't fire when `relayConnected: true` is present in peer list.

- *Chaos lab scenarios* (add to `net-chaos-lab/configs/`):
  - `webrtc-flap`: NAT rebind mid-session, verify reconnect < 5 s and connection type returns to `webrtc` after relay assist.
  - `relay-drop-rejoin`: Bootstrap relay drops and re-appears; verify clients redial within 2 presence ticks.
  - `direct-churn`: 10-peer room, random ICE failures every 30 s for 5 min; check no peer count decay.

- *NetViz manual smoke*: Open two tabs on the same room, observe connection badge transitions `relay → webrtc → relay → webrtc` after simulating a tab background (visibility-throttled ICE). Confirm no stuck `disconnected` state.

### Phase 3: Gossipsub rollout (next)
- Switch browsers + relay to gossipsub; keep floodsub as fallback until stable.
- Tune gossipsub mesh (directPeers = relay, allowPublishToZeroPeers).

### Phase 4: Topic scoping + throttles (next)
- Add optional room-scoped topics (per game/room) to reduce cross-room fanout.
- Lower snapshot/presence defaults where safe and expose per-demo overrides.

### Phase 5: Interest management (next)
- Add simple topic filters (only subscribe to required namespaces).
- Gate heavy event topics behind explicit opt-in in demos.

### Phase 6: Multi-relay fallback (later)
- Support multiple relay bootstrap peers with health checks and dial rotation.
- Prefer closest relay; keep relay as fallback when WebRTC fails.

## How this ties to the larger PeerCompute plan
- Roadmap alignment: the demo work validates "Scheduler adoption" and "Compute" phases in plan/plan.md while stress-testing network hardening (relay, rooms, warm deltas).
- Architecture alignment: new demos should use layered DataState, hot/warm deltas, and shared-GPU hub where render-coupled buffers are needed (plan/arch/*).
- Distributed compute alignment: "real distributed compute examples" should exercise placement, topology roles, and scheduler profiles (plan/branch/distributed-compute.md).

## Prereqs / dependencies (do first or in parallel)
- Finish warm DataState delta publishing end-to-end so demos can visualize and replicate state safely.
- Stabilize room selection + relay config defaults (shared with the demo-ports release tasks).
- Keep ComputeManager scheduling + GPU hub integration stable before adding new compute-heavy demos.

## Branch breakdown (two branches)

### Branch A: demo-foundations (engine + tooling)
Goal: build shared systems that multiple demos reuse, and unblock the larger compute/topology story.
- Input abstraction layer (keyboard/mouse/gamepad/touch/VR) with unified action mapping.
- Physics upgrades: apply the PPF contact model to other physics demos and expose a shared physics adapter.
- WASM-backed demo integrations for ComputeManager (portable kernels, hybrid WASM+WebGPU tasks, DataState commitDelta hooks).
- Network telemetry + metrics feed (peer graph, RTT/throughput, message counts), exposed via warm deltas.
- 3d network visualizer core (tron grid, nodes/edges, nurbs links) built on the telemetry feed.
- WebRTC direct-connection upgrade (relay only for bootstrap/fallback): prefer `/webrtc` addrs over `/p2p-circuit`, allow STUN/TURN config, and optionally drop relayed connections once direct links are established. Difficulty: medium (2-4 days, mostly config + dialing/connection policy + validation).
- Shared procedural generation library that links universes + planetgen with a common data model and task API.

### Branch B: demo-experiences (showcase demos)
Goal: build new demos that prove the platform and the distributed compute narrative.
- Distributed compute workload examples (batch + streaming) that show real scaling across peers.
- Topology demo suite (authority-hosted, mesh snapshots, hierarchical) with an explorable UI and live stats.
- Keystone demo (flagship showcase; see plan/branch/keystone-demo.md).
- Shared 3d editor based on three.js editor, with multi-user scene graph sync and reliable edit events.
- Motorcycle/lightcycle game that exercises input abstraction + physics + network prediction.
- Shared VR world with webcam pose (DaddyGo input model) and avatar sync.
- Fully integrated engine demo that combines webgpuphys + input + pose/video + collaborative editing.

## Suggested order (what to do first)
1) Network telemetry + minimal visualizer: gives visibility into peers/topology and de-risks later demos.
2) WASM-backed demo workloads: exercise the new portable `ComputeManager` runtimes beyond pure WebGPU.
3) Shared procedural generation API: unlocks planetgen/universes cross-demo reuse.
4) Input abstraction + PPF rollouts: foundation for the motorcycle game and the integrated engine demo.
5) Distributed compute examples + topology demos: validate scheduler profiles and topology roles.
6) Keystone demo as a flagship integration once the foundations above are stable.
7) Collaboration-heavy demos (3d editor, VR world), then the fully integrated engine demo last.

## Deliverables / definition of done
- Each demo uses PeerCompute APIs directly (NodeKernel + NetworkScheduler + DataState).
- Every demo includes a minimal README update and a short "what this validates" section.
- The network visualizer and topology demos become the debugging tools for future work.

## Progress
- Done (baseline): NetViz (network telemetry + minimal visualizer demo scaffolded).
- Done: NetViz upgrades (RTT/throughput telemetry, NURBS edges, node/edge inspection).
- Done (2026-02-27): Overview tile order updated to `GitHub -> CubeChat -> Universes -> PlanetGen -> NetViz -> SneakyWoods -> Daddy Go -> Dynamics -> MPM -> PPF -> Hyperborea`.
- Done (2026-03-01): NetworkManager transport-limit decoupling landed (`logical maxConnections` vs `transport maxConnections` with bootstrap/upgrade headroom), and topology/presence active-connection accounting now excludes bootstrap links to reduce relay-webrtc upgrade churn under low logical caps (static checks complete in constrained env).
- Done (2026-03-10): `Fano Reactor` scaffold landed with exact sedenion algebra, a retro-terminal `bond-lab` + `fano-map`, docs/build wiring, and headless chemistry invariants tests.
- Done (2026-03-12): Phase 2b relay scaling fixes implemented (Fixes A–G): direct-drop recovery redial, relay safety window (`relayPostDirectHoldMs` 60 s), election presence broadcast, `relayReservationPeers`/`relayAssistState` pruning, `autoDisconnectTimer` cleanup in `disconnect()`, duplicate `toString()` removal. 9 new headless tests in `demos/tests/relay-scaling.test.mjs`. All 37 tests pass.
- Done (2026-03-12): Relay role separation — relay excluded from gossipsub `directPeers` when `dropRelayBootstrapOnDirect` is enabled (fixes gossipsub re-dialing relay and undoing drop logic). Relay drop now gated on gossipsub mesh health (`_hasHealthyGossipsubMesh`) instead of fixed 60 s timer. `relayPostDirectHoldMs` reduced from 60 s to 15 s as secondary guard.
- Done (2026-03-12): Restructured `_maybeUpdateBootstrapRelayConnections` — retention check now runs BEFORE the election, so the election keeper cannot override the drop decision. Election only fires as a last resort when no peer reports `relayConnected`. This was the primary cause of sticky relay: the election winner re-dialed bootstrap every 3 s tick, undoing the drop. 14 headless tests, 42 total, all pass.
- Done (2026-03-13): Fixed empty `getMultiaddrs()` — circuit relay reservations were never picked up by the listener because `_reserveRelayForPeer` used `'configured'` type but the generic `/p2p-circuit` listener skips configured reservations. Fix: use specific bootstrap relay circuit addresses in listen config (e.g. `/dns4/localhost/tcp/8080/wss/p2p/<id>/p2p-circuit`) instead of generic `/p2p-circuit`. This triggers `CircuitListen` mode which properly calls `addedRelay()`, giving nodes externally-reachable multiaddrs so WebRTC signaling can succeed. 42 tests pass.
- Done (2026-03-17): `ComputeManager` now supports pure WASM tasks and hybrid `wasm-webgpu` host modules, including typed memory views, worker-safe helper modules, inline fallback behavior, and `commitDelta` adapters covered by unit tests.
- Done (2026-04-03): Fixed logical `maxConnections` oversubscription in `NetworkManager` by reserving slots for pending topology requests, inbound topology accepts, and in-flight new-peer dials. Added explicit logical-vs-raw connection counters for diagnosis and refreshed `networkManager.webrtc` coverage so the current relay/transport policy and the new `maxConnections=3` regression cases all pass.
