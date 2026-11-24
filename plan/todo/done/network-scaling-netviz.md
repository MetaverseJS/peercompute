# Branch Plan: `feature/network-scaling-netviz`

## Goal

Improve PeerCompute's real-world networking reliability, scaling efficiency, direct LAN/subnet behavior, Go/Node relay parity, and NetViz whole-network/subgroup observability without breaking existing demos — and without running `net-chaos-lab`.

## Phased Slices

### Slice 1 — Core Network Reliability, Speed & Go/Node Relay Parity (Zero Breaking Demo Changes) [DONE — `037d5d5c`]
1. **Eliminate doomed +5,000 ms `queryPeerDirectory` dial stall & double-JSON bug (`NetworkManager.js`)**:
   - Subscribe `directoryTopic` in `connect()`, fix double `JSON.stringify` in `queryPeerDirectory`/`registerWithDirectory`, fast-fail when disconnected or when `directoryTopic` has zero subscribers, clear pending directory timers on `disconnect()`, and check local `peerStore`/remembered targets before ever falling back to a directory query (never blocking ready `direct` or `relay-webrtc` dials, and never re-entering for already-open `relay-webrtc`).
2. **True per-connection ICE path inspection (`RTCPeerConnection.getStats()`), preserve live `via`, and unify `@libp2p/webrtc` initiator/recipient handling (`NetworkManager.js`)**:
   - Sample `conn.maConn?.peerConnection?.getStats()` (throttled per peer/connection) to classify true `icePath` (`lan-host` | `nat-srflx` | `nat-prflx` | `turn-relay` | `circuit-relay` | `direct-ws` | `direct-tcp`), `iceProtocol`, `candidatePairRttMs`, and honest `mediaPath`.
   - Stop `_handlePresence` from overwriting `peer.via` with `'presence'`; derive `via`, `direction`, `connectionCount`, `duplicateConnections`, and cached ICE stats from live open connections.
   - Unify `dropRelayOnDirect` so initiators with `/p2p-circuit/webrtc` still prune plain `/p2p-circuit` connections (while preserving pruning of both when true `/webrtc` exists), and fix `connection:close` fast drop-recovery to work for `relay-webrtc` while skipping intentionally closed topology links (`intentionalCloseUntil`).
3. **Eliminate bilateral dial glare, flapping, deadlocks, and maintenance-stream pinning (`NetworkManager.js`, `PeerConnectionRecovery.js`, `TopologyController.js`, `ThroughputTopologyPolicy.js`)**:
   - Add deterministic bilateral dial glare yield window (`selfPeerId > targetPeerId` yields briefly on unsolicited presence/discovery dials) and deterministic duplicate direct-connection pruning (preserving active application streams and recovery leases).
   - Add standard libp2p maintenance protocol defaults (`/ipfs/id/1.0.0`, `/ipfs/id/push/1.0.0`, `/ipfs/ping/1.0.0`, `/peercompute/keepalive/1.0.0`, meshsub/floodsub) to `_hasActiveApplicationStreams` while keeping active `/libp2p/circuit/relay/0.2.0/hop` circuits protected.
   - Resolve `ThroughputTopologyPolicy.trialMs` (`6000 ms`) vs `PeerConnectionRecovery.freshGraceMs` (`10000 ms`) deadlock by keeping `10000 ms` fresh grace on relay recovery connections and capping non-relay fresh grace to `3000 ms`, returning actual close success from `_closeConnectionsToPeer`, and verifying eviction succeeded before accepting in `_handleTopologyConnectRequest`.
   - Add distance hysteresis (`swapHysteresisRatio`, default `0.15`), bound `noConnections` thundering herd (`maxZeroConnBoost`, default `1`), and enable `_pickLongRange()` even when `hasRadius` is set (bridging spatial islands cleanly) in `TopologyController.js`.
   - Wake `ThroughputTopologyPolicy` out of idle backoff immediately when total flow transitions from `0` to `> 0`, clear `throughputPendingLinks` on dial failure, and track pending start timestamps cleanly.
4. **Fix relay-retention edge cases (`NetworkManager.js`)**:
   - Cap effective `minDirectMeshPeers` by `knownDialablePeers` so small rooms (`N <= 3`) can drop non-keeper relays cleanly.
   - Fix relay-election presence race by advertising `relayKeeper`, honoring peer `relayKeeper` in `_shouldElectRelayRedial`, and re-publishing presence after bootstrap connects.
   - Expose explicit `keepReason` and `role` in `getRelayRetentionDebug()`.
5. **Production Go relay (`peercompute/src/relay-go/main.go`) & Node relay (`peercompute/src/relay/server.js`) parity**:
   - Apply `RELAY_GOSSIPSUB_CONFIG` (`D`, `Dlo`, `Dhi`, `Dout`, `Dlazy`, `heartbeatInterval`, `scoreParams` including `IPColocationFactorWeight = 0` so LAN/NAT siblings aren't penalized!) directly to Go's `pubsub.NewGossipSub(...)`.
   - Port `RELAY_CONTROL_ONLY_MODE`, `RELAY_ENABLE_DIRECTORY` + `RELAY_DIRECTORY_TTL_MS`, bounded circuit limits (`RELAY_CIRCUIT_DURATION_SEC` / `RELAY_CIRCUIT_DATA_MB`, opt-in `RELAY_INFINITE_LIMITS=1`), and idle-topic unsubscribe GC (`RELAY_TOPIC_IDLE_TTL_MS`) to `relay-go/main.go`, plus idle-topic unsubscribe GC and closed-stream guards to `relay/server.js`.

### Slice 2 — Upgrade NetViz (`demos/netviz/`) Into a Whole-Network & Subgroup Analysis Tool [DONE — `9b7b2d46`]
1. Extend `NetworkTelemetryService.js` (backward-compatible v1 optional fields): per-edge `icePath`, `iceProtocol`, `candidatePairRttMs`, `direction`, `duplicateConnections`, `workMesh`; per-node `relayState` (`connected`, `role`, `keepReason`, `relayPeerId`, `gossipMeshCount`), `gossipMeshPeers`, `rewiresPerMin`, `dialFailures`, `capabilities` summary, `hostGroupId`.
2. Upgrade `demos/netviz/`:
   - Fix `observedNetwork.js` edge-merge bug discarding second endpoint telemetry; set `allowDiscoveryDialWhenIsolated: false` in `demos/netviz/src/main.js`.
   - Add subgroup-clustered layout in `All demos` (`Application/Room`, `Relay`, `Topology Mode`, `Transport/LAN`) with translucent hulls, group badges, and non-disruptive drill-down.
   - Add toggleable graph layers (Transport by true ICE path, Gossipsub Mesh, WorkMesh flow, Models/Artifacts), Color-by-Lens selector, `throughput`/`static` topology support, partition & "Relay-Off Resilience" analyzer (connected components with/without relay, isolated peers, bridge edges, per-relay fan-in & `keepReason` breakdown), 5-minute rolling sparklines, JSON snapshot export, and pooled/instanced edge rendering.

### Slice 3 — Transport Scaling, Physical Laptop+Pi LAN Support & Non-Breaking Demo Updates [DONE]
1. Direct unicast stream `/peercompute/direct/1.0.0` for `NetworkManager.sendToPeer()` (pure-ESM 4-byte length-prefixed framing with automatic pubsub fallback & unsupported-protocol cooldown) + direct stream byte accounting (`NetworkManager.recordPeerBytes`, `WorkMeshService`) so `throughputSignal: 'bytes'` measures real P2P data.
2. Goal-conditioned `ThroughputTopologyPolicy` profiles (`batch-throughput`, `low-latency`, `lan-first`, `capability-weighted`) leveraging `lan-host` ICE path, RTT, `hostGroupId`, and capabilities.
3. Multi-relay ordered failover (`bootstrapRelayHealth` RTT/health/LAN/target-relay selection in `_buildCircuitAddr`) + upgraded `NativeCompanion.js` from `floodsub` to LAN-friendly `gossipsub` (`IPColocationFactorWeight: 0`, `fallbackToFloodsub: true`, opt-in `floodsub`) for physical laptop + Raspberry Pi deployments.
4. Non-breaking demo updates: consolidated `__rooms__` directory onto existing `NodeKernel`/`NetworkManager` (`subscribeTopic`/`publishTopic` on `pc.<gameId>.__rooms__.announcements`) in CubeChat/Hyperborea/SneakyWoods, updated Hyperborea's `ensureRelayConnection` watchdog to respect `dropRelayBootstrapOnDirect`, added `faultTolerance: 'no-fatal'` to SneakyWoods, updated `demos/inference/src/runtime.js` manual `connect(relayAddress)` to inherit `relay-config.json` / `gossipsub` + `no-fatal` defaults, fixed EarthGrid's `telemetryApplication` in `WorldAgentHost.js` (keeping global model discovery scope intact), and calmed `WorkMesh` idle state heartbeat (`100ms` → `2000ms` when idle) + bounded `WorkMeshService` outbox (`maxOutbox: 128`).

### Slice 4 — Conjecture Real-Browser & GossipSub Breakthrough + Adaptive WorkMesh Headroom [DONE]
1. Controlled A/B ablations under `BROWSER_REALISM` (`N=20..128`) + live 20-peer headless Chromium WebRTC runs (`browserRun.mjs`), identifying and fixing:
   - Unilateral GossipSub v1.1 `directPeers` PRUNE blackhole (`enableRelayDirectPeers` now defaults `false` in `NetworkManager.js`).
   - LAN/NAT/localhost GossipSub IP-colocation graylist + star-mesh `Dhi=12` pruning across `NetworkManager.js`, Node `relay/server.js`, `NativeCompanion.js`, and Go `relay-go/main.go` (`IPColocationFactorWeight: 0`, `behaviourPenaltyWeight: 0`, `fallbackToFloodsub: true`, relay `D=12, Dlo=6, Dhi=32, Dout=2`).
   - Persistent `/peercompute/direct/1.0.0` stream pinning (`STANDARD_MAINTENANCE_PROTOCOLS` + `_closeDirectUnicastStream` in `_closeConnectionsToPeer`), conflicting `direct-drop-recovery` under `topology: 'throughput'`, `WorkMeshService._directConnection` primary-link alignment, and clean `_drop` on dead connections in `WorkMeshService._flush`.
   - Rate-adaptive `WorkMesh` batch/buffer headroom (`maxWorkBatch: 12, maxResultBatch: 24, maxResultBuffer: 48`, respecting explicit caller overrides) and `ThroughputTopologyPolicy` anti-herd top-band (`15%`) + exploratory (`15%` when `>= 6` candidates) sampling.

### Slice 5 — Turnkey Physical LAN / Raspberry Pi Kit & NetViz Goal/LAN Controls [DONE — `755b297b`]
1. Added `scripts/lan-relay.mjs` (`npm run lan:relay`, `npm run lan:self-test`) with RFC1918/Tailscale auto-detection, `gossipsub` `NativeCompanion` relay, CORS `/relay-config.json` + `/health` endpoint with optional WAN failover, and automated loopback 2-peer `lan-first` self-test (`peercompute/tests/unit/lanRelayTooling.test.js`).
2. Upgraded `demos/netviz/` with `Host Group` subgroup clustering, **Goal profile** (`batch-throughput`, `lan-first`, `low-latency`, `capability-weighted`) + **Host group** session inputs (synced to URL params and inherited from `relay-config.json`), and per-subgroup LAN % / churn / LAN readiness diagnostics.

### Full 17-Demo Build, Runtime & Live P2P Verification Sweep [DONE]
1. Caught and fixed shared-mode `RoomDirectory.stateManager` compatibility seam in `demos/cubechat/src/p2p/roomDirectory.js` and `demos/hyperborea/src/game/roomDirectory.js` (added lightweight `readScoped`/`writeScoped`/`observeNamespace` facade, `room-sync-request` late-join sync, and 1.5s quick rebroadcast on `announceRoom`) plus updated `demos/tests/runtime-p2p.mjs` to open CubeChat's `[data-settings-section="media"]` sub-dialog before clicking `#screen-share-toggle`.
2. Verified **17/17** production Vite builds (isolated `/tmp/all-demos-docs/`), **17/17** demos in headless Chromium, **5/5** live 2-browser P2P suites over Go relay in both `floodsub` and `gossipsub` (confirming halved relay reservations: 1 relay peer per browser tab), all 8 per-demo unit suites, and workspace unit suites (**1,383/1,384** in `peercompute` `test:unit`, 1 unrelated pre-existing external ULG artifact test).

## Validation Strategy (No Chaos Lab)
- Node unit & loopback integration suites: `peercompute/tests/unit/networkManager.*.test.js`, `topologyController.test.js`, `throughputTopologyPolicy.test.js`, `workMesh*.test.js`, `networkTelemetry*.test.js`, `nativeCompanion.test.js`, plus new targeted tests for every Slice 1–3 behavior.
- Go relay unit suite: `cd peercompute/src/relay-go && go test ./... && go build ./...`.
- NetViz unit + headless Chromium analysis verification: `npm run test:network-telemetry`, `demos/netviz/tests/*.test.js`, `npm run build:netviz`, and headless Playwright inspection of subgroup clustering, layers, partition/relay-off diagnostics, sparklines, and JSON export.
- Demo regression checks & builds (CubeChat, Hyperborea, SneakyWoods, Inference, Earth, NetViz) + `demo-ports` / `demo-release`.
