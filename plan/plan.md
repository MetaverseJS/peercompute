Instructions: This file contains high level goals for the project and a roadmap.

## Project Overview:
PeerCompute is a browser based p2p compute network library leveraging webGPU and built on top of libp2p.  Use cases for this would range from a networking library for player hosted online gaming, procedural world generation, large scale physics simulations,  backend for a metaverse network etc. 

The most interesting potential configuration for this would be a compute network which dynamically self organizes (hierarchically or otherwise) to optimally compute a workload based on mutual bandwidth and compute resources.

for example, where a high degree of peer communication is necessary nodes should be able to recognize and automatically form fully connected peer sub-groups when located together on a LAN with high mutual bandwidth/compute but perhaps a bottle necked uplink. 

In an example metaverse configuration the root node would set out the basis for interaction in a overworld where players (each a compute node themselves) could explore and interact.  Players could also discover and join another compute node (becoming their child) where the parent could lay out a different basis for interaction (a customized personal sub world or game) 

Security:
The root node should exist on a domain secured with SSL enabling all executable code to be signed with Compute Nodes exchanging non executable data in json (3d models, arrays etc) 

## Project Goals:

### Completed:
- libp2p-first browser stack (relay bootstrap + gossipsub, floodsub fallback, pubsubPeerDiscovery).
- Yjs state sync via PeerComputeProvider (no y-libp2p dependency).
- NetworkScheduler core with clock policy scaffolding.
- cb time sync anchored to the first joiner.
- Layered DataState wrapper (hot/warm/cold) with commit deltas and unit tests.
- GPU hub scaffolding and warm delta provider hook.
- ComputeManager runtime support for worker-safe WASM tasks, hybrid WASM+WebGPU tasks, and DataState commitDelta adapters.
- Backend `pcserver.sh` launcher for relay + local TURN/STUN, with systemd wiring at the relay runlevel.
- Production relay/demo config refresh: `npm run build` now emits GitHub Pages demo `relay-config-source.json` files that point at `https://secretworkshop.net/peercompute/config/relay-config.json`, and the live prod relay/TURN endpoints have been revalidated against `wss://secretworkshop.net/` and `secretworkshop.net:3478`.
- Production relay runtime guard: `scripts/start-relay-prod.sh` and `scripts/install-relay-systemd.sh` now enforce Go when `RELAY_IMPL=go` so prod/systemd launchers fail closed instead of silently falling back to the Node relay.
- Production backend installer wrapper: `scripts/install-prod-systemd-services.sh` now provides a one-command Go+systemd setup path, defaulting to split `peercompute-relay` + `peercompute-coturn` services with a `--dry-run` preview mode.
- Production service split confirmed on host: enabled `peercompute-relay` + `peercompute-coturn` units now back the live prod stack, with `pcserver.sh` supervising the Go relay and coturn and no remaining live Node relay process.
- Go relay public-address advertisement guard: `peercompute/src/relay-go/main.go` now feeds `RELAY_PUBLIC_HOST` / `RELAY_PUBLIC_PORT` / `RELAY_PUBLIC_PROTOCOL` into libp2p `AddrsFactory` and emits dual-family bootstrap peers, so browser relay reservations no longer inherit localhost/private listen addrs when prod runs behind nginx/TLS termination.
- Network chaos-lab scaffolding (`net-chaos-lab/`) with topology config, scenario runner, metrics dashboard, and probe harness.
- Net chaos-lab fail-fast containernet preflight checks (host tooling + Docker daemon) and service health checks (PID/port verification).
- Net chaos-lab matrix runner with per-scenario metric gates and matrix summary artifacts (`--matrix` + `configs/matrix/direct-regression.yaml`).
- Net chaos-lab probe stability diagnostics (post-convergence churn/change sampling for direct-vs-relay persistence metrics).
- NetViz chaos overlay integration: live chaos-lab summary/event/topology feed in NetViz (`?chaosApi=...`), 3D chaos topology overlay rendering, and matrix-full watcher bootstrap (`npm run chaos-lab:matrix:full`, default observer mode via `autoConnect=0`).
- NetViz topology observability upgrade: enlarged scene bounds/zoom, simultaneous P2P + IP overlay rendering controls, and richer node/edge inspection metadata (transport mode, relay/direct hints, bandwidth, address families, NAT hints).
- NetViz chaos-feed P2P synthesis: watcher can now build/render swarm P2P topology from chaos-lab `probe_result` telemetry events (latest per-agent `localPeerId` + peer links) even when the observer browser itself is not directly peered.
- Cross-demo NetViz attach/debug: NodeKernel now auto-publishes `telemetry:<peerId>` warm deltas for all demos, publishes active demo sessions on shared pubsub topic `peercompute-netviz-sessions`, and still mirrors same-origin session hints via BroadcastChannel so NetViz can attach to live demo topology+room without manual re-entry.
- Net chaos-lab containernet image hardening: default docker image now includes `iproute2` + DNS/HTTPS/TURN binaries, with startup image preflight/auto-build to avoid runtime apt failures inside isolated lab nodes.
- Net chaos-lab containernet probe-runtime guard: startup validates in-agent Playwright+Chromium launch and fails fast with a rebuild hint when workspace/image versions drift.
- Net chaos-lab image revision guard: default image now carries an explicit revision label and auto-rebuilds when stale to avoid drift across rebooted/dev hosts.
- Net chaos-lab probe classification guard: nonzero in-agent probe exits that still emit valid JSON payloads are now treated as functional probe failures (not infra failures) when preflight is healthy.
- Net chaos-lab NetViz probe URL guard: harness now auto-injects NetViz query defaults (including `autoConnect=1`) when omitted so in-agent probes initiate libp2p sessions instead of idling disconnected.
- Net chaos-lab relay bootstrap guard: containernet relay service now runs `wss` with an in-lab cert and rewrites `docs/netviz/relay-config.json` to local relay bootstrap addresses to avoid stale external relay endpoints in probes.
- Net chaos-lab relay dual-family bootstrap guard: relay-generated `relay-config.json` now publishes both `/dns4/...` and `/dns6/...` bootstrap peers when a hostname is used, and `NetworkManager` now picks the family-appropriate bootstrap address for circuit-dial fallback (`dns6` when local IPv6 is present, `dns4` otherwise).
- Net chaos-lab ICE guard: containernet relay now injects an in-lab TURN/STUN `webrtc.iceServers` config into generated relay config, and probe Chromium now disables mDNS host obfuscation so direct-candidate behavior is measurable inside the simulated lab.
- Net chaos-lab NetViz asset freshness guard: containernet probe runs now auto-refresh `docs/netviz` from `demos/netviz` when sources are newer, preventing stale static bundles from masking new probe diagnostics/metrics fields.
- Net chaos-lab unattended loop launcher: added `npm run chaos-lab:matrix:loop` to repeat `matrix:full` runs until matrix pass (or configured stop conditions), enabling long-running regression tuning without manual re-invocation.
- Net chaos-lab IPv6 unattended loop launcher: added `npm run chaos-lab:ipv6:loop` to repeat focused `ipv6:min` runs overnight with metric targets (`conn/direct/preflight/infra`) and sudo keepalive.
- Net chaos-lab matrix artifact watcher: added `npm run chaos-lab:matrix:watch` to detect and summarize newly completed matrix runs launched externally (e.g., sudo-run in another terminal), reducing manual log handoff overhead.
- Net chaos-lab direct-path classification guard: probe runtime now infers direct connectivity (including stability sampling) from active selected RTC candidate pairs (`host`/`srflx`/`prflx`) when libp2p multiaddrs remain relay-scoped, reducing false `direct_connection_rate=0` and under-reported direct sample outcomes during successful hole-punch runs.
- Net chaos-lab IP-mode preflight guard: in-agent HTTPS preflight now enforces address-family selection (`curl -6` for `ipv6-only`, `curl -4` for `ipv4-only`) and mode-matching service-IP fallback selection, reducing false infra failures during IP-mode scenario stages.
- Net chaos-lab IP-mode scope guard: topology `ip_mode` stage application now defaults to `network.ip_mode_scope: agents` (configurable to `all`) so mode toggles do not mutate core infra/router nodes unless explicitly requested.
- Net chaos-lab IP-mode firewall guard: mode toggles now use `iptables`/`ip6tables` packet-filter rules instead of `net.ipv6.conf.*.disable_ipv6` sysctl flips to avoid destructive IPv6 route/address resets during stage transitions.
- Net chaos-lab IP-mode agent-route guard: for `ip_mode_scope=agents`, mode toggles now switch family reachability via default-route changes (`ip route` / `ip -6 route`) instead of OUTPUT filter drops, reducing unintended IPv6 data-plane disruption during `ipv6-only` stages.
- Net chaos-lab host-forwarding guard: containernet startup now captures host `FORWARD` policy, applies temporary `FORWARD=ACCEPT` for `iptables`/`ip6tables` during lab runtime, and restores prior policy on shutdown.
- Net chaos-lab router-forwarding guard: segment NAT router setup now flushes/reseeds deterministic `FORWARD` allow chains (`iptables`/`ip6tables`) to avoid stale/inherited chain state producing asymmetric routed-path drops.
- Net chaos-lab preflight endpoint diagnostics: preflight now records curl-selected remote endpoint metadata (`curl_remote_ip`/`curl_remote_port` and fallback equivalents) to distinguish family-selection vs path failures in artifacts.
- Net chaos-lab host bridge-netfilter guard: containernet startup now captures/sets `net.bridge.bridge-nf-call-iptables=0` and `net.bridge.bridge-nf-call-ip6tables=0` (when available) during runtime, then restores prior host values on shutdown/fallback.
- Net chaos-lab IPv6 routing clarity guard: segment routers now explicitly remove stale IPv6 NAT66 masquerade rules and keep IPv6 routed-only forwarding behavior.
- Net chaos-lab IPv6 link-local preservation guard: interface reconfiguration now flushes only IPv6 `scope global` addresses (agents/routers/services) so required link-local addresses remain intact for reliable ND/NDP.
- Net chaos-lab preflight timeout/retry guard: probe preflight HTTPS checks now support configurable curl timeout/retry/backoff (`CHAOSLAB_PREFLIGHT_CURL_MAX_TIME`, `CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS`, `CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS`) to reduce transient CPU-contention false negatives during containernet runs.
- Net chaos-lab IP-mode probe URL guard: in `ipv6-only`/`ipv4-only` modes, probes now prefer a family-matching literal service URL when host mappings are available, reducing browser family-selection ambiguity after route-mode stage switches.
- Net chaos-lab IPv6 readiness/warmup guard: HTTPS service startup health checks now include an explicit IPv6 `curl -6` readiness probe when IPv6 is configured, and `ip_mode=ipv6-only` agent switches now warm IPv6 neighbor/path state (gateway ping + service curl) to reduce transient first-dial failures.
- Net chaos-lab IPv6 mode-switch convergence guard: agents now apply `ip_mode` family routes through verified default-route setup (same `_ensure_default_route` path used at startup) before family pruning, and `ipv6-only` warmup now retries with neighbor/cache refresh until convergence timeout.
- Net chaos-lab router IPv6 interface-forwarding guard: segment routers now explicitly set `net.ipv6.conf.<lan>.forwarding=1` and `net.ipv6.conf.<wan>.forwarding=1` in addition to global/default forwarding sysctls.
- Net chaos-lab L2-stability guard: containernet agent data-plane interfaces now receive deterministic per-agent MAC addresses during setup to avoid possible FDB/MAC-flap-induced partial reachability during `ipv6-only` stages.
- Net chaos-lab IPv6 neighbor-seeding guard: containernet startup and agent `ip_mode` transitions now seed static IPv6 neighbors on agent/router/service data-plane links (agent<->router gateway + router<->HTTPS service) to reduce NDP convergence flake.
- Net chaos-lab IPv6 warmup safety guard: `ipv6-only` warmup no longer flushes neighbor state by default; optional neighbor flush is now opt-in via `CHAOSLAB_IPV6_WARMUP_FLUSH_NEIGH=1`.
- Net chaos-lab IPv6 triage depth guard: failed `ipv6-only` preflight payloads now also capture agent link snapshots (`agent_ip6_link`, `agent_ip6_addr`), router LAN neighbor table (`router_ip6_neigh_lan`), and router forwarding sysctl summary (`router_ipv6_forwarding`).
- Net chaos-lab IPv6 failure triage diagnostics: failed `ipv6-only` preflight payloads now include per-agent `ip -6 route`, `ip -6 neigh`, `ip -6 rule`, and `ip6tables FORWARD` snapshots.
- Net chaos-lab IPv6 path triage diagnostics: failed `ipv6-only` preflight payloads now also include segment-router and HTTPS-service IPv6 snapshots (`ip -6 addr`, `ip -6 route`, router `ip6tables FORWARD`, router->service curl probe, service `ss -lnt`) to localize path failures.
- Net chaos-lab minimal IPv6 triage profile: added focused single-segment topology/scenario (`topology.ipv6-minimal.yaml` + `ipv6-only-minimal.yaml`) and npm launchers `chaos-lab:ipv6:min` (agents-only scope) plus `chaos-lab:ipv6:min:all` (infra/routers included) for faster root-cause iteration.
- Local relay dev hardening: `dev` / `dev:local-relay` now default to loopback-safe relay addressing (`localhost` + `127.0.0.1`) unless explicitly opted into LAN exposure (`RELAY_DEV_EXPOSE_LAN=1`), reducing WSS certificate-host mismatches and demo peer-discovery failures.
- Local relay stale-config guard: dev launcher scripts now clear stale per-demo `relay-config*.json` source/fallback files before startup so first-load demos do not bootstrap to outdated relay endpoints.
- Local relay strict-port guard: `dev` / `dev:local-relay` now pass `--strictPort` to demo/docs Vite servers by default (`DEV_STRICT_PORT=1`) so port collisions fail fast instead of silently remapping demos to unexpected ports.
- Production relay ICE defaults: `config/relay.json`/`config/relay.env` now default to Google STUN + coturn UDP/TCP entries, and repo automation includes a hardened coturn systemd installer helper (`scripts/install-coturn-systemd.sh`).
- NetworkManager direct-redial hint cache: peers now remember observed direct `/webrtc` dial targets (with TTL) and reuse them when presence/directory inputs are relay-scoped, reducing unnecessary relay-webrtc-only redial loops after earlier direct upgrades.
- Go relay launcher env hardening: `scripts/run-go-relay.sh` now defaults `CGO_ENABLED=0` (unless set) and probes real cache write access, falling back to `/tmp` Go caches when home-cache writes are blocked (sandbox/CI) to avoid misleading `imports net: cannot find package` startup failures.
- Chaos-lab package split: chaos-lab command ownership now lives in `net-chaos-lab/package.json`; root `npm run chaos-lab:*` entries are thin wrappers and core demo workflows stay decoupled from protocol-lab setup.
- Net chaos-lab cross-demo regression matrix: added `net-chaos-lab/configs/matrix/demo-regression.yaml` plus root/package scripts (`chaos-lab:matrix:demos`, `chaos-lab:matrix:demos:full`, `chaos-lab:matrix:demos:loop`) to validate PeerCompute-enabled demos under shared scenario gates.
- Net chaos-lab cross-demo probe runtime: added generic browser kernel discovery (`__PEERCOMPUTE_KERNELS__` registry), `probe_mode=peercompute`, and optional simulated interaction profiles (`--simulate-profile`, `--simulate-ms`) so demos can be probed without NetViz-only assumptions.
- NetViz RTC path diagnostics: NetViz now tracks browser RTCPeerConnection selected candidate pairs (host/srflx/prflx/relay) and uses that evidence in local NAT/direct heuristics while still keeping relay-scoped WebRTC signaling explicit in inspector/debug status.
- NetViz RTC tracker hardening: RTCPeerConnection diagnostics now track both constructor-created and prototype-method-observed peer connections (for cached constructor paths), and edge transport rendering now aggregates per-edge telemetry `via` from all peers so remote direct links are represented more consistently.
- NetworkManager/NetViz transport truth guard: peer telemetry now preserves distinct transport states (`webrtc`, `relay-webrtc`, `relay`, `direct`) so visualization does not collapse relay-scoped WebRTC into direct links.
- NetworkManager/NetViz path-truth split: telemetry and rendering now track `signalingPath` (`direct` vs `relay-scoped`) separately from `mediaPath` (`direct` vs `turn-relay` vs `unknown`) so relay-scoped signaling does not get mislabeled as direct media and remote edge color reflects endpoint-reported transport truth.
- NetViz telemetry ordering guard: `TelemetryStore` now rejects out-of-order older snapshots (`ts` monotonic), preventing stale remote transport state from overwriting newer edge truth.
- NetworkManager relay-upgrade retry guard: peers with only plain relay links now continue attempting relay-webrtc upgrade dials (while avoiding redundant redials when relay-webrtc is already active), improving direct-upgrade opportunities after initial relay bootstrap.
- Relay-drop small-room parity guard: bootstrap relay retention now accounts for observed dialable peer count (not only `targetConnections`) and can treat relay-webrtc as direct-capable by config so production behavior matches chaos-lab intent in smaller swarms.
- NetworkManager relay-assist signaling guard: when relay-webrtc dials fail with `NO_RESERVATION`, peers now send targeted mesh control requests (`relay-assist-request` / `relay-assist-ready`) so the remote peer can temporarily reacquire bootstrap relay, republish announce addrs, and trigger immediate forced redial without reverting to permanent full-mesh relay retention.
- NetworkManager relay-scaling defaults tuned: default topology now starts at `connectionRadius=1`, `targetConnections=3`, `maxConnections=4`, with bootstrap relay drop enabled by default and logN relay retention active out-of-the-box.
- NetworkManager transport-limit decoupling: logical topology cap (`maxConnections`) is now separated from libp2p transport cap via `transportConnectionHeadroom`/`transportMaxConnections`, preventing bootstrap/control churn while keeping relay-scaling topology defaults intact.
- NetworkManager logical-cap reservation guard: pending topology requests, inbound accepts, and in-flight peer dials now reserve logical peer slots, preventing `maxConnections` overshoot during concurrent discovery/topology churn and exposing separate logical-vs-raw connection counters for diagnosis.
- CubeChat polish: Safari/iOS/macOS welcome overlay dismissal fix, room-scoped multi-biome world themes (`Tron`, `Moon`, `Beach`, `Desert`, `Jungle`, `Hyperborea`, `Ireland`), moon terrain/rocks/dust (including landing dust poofs + stronger crater ridges) plus world-anchored moon surface texture phase to prevent crater/grain sliding during floor expansion, synthwave Tron skybox (sunset/mountains/city, with horizon/sun/city visibility tuning), cross-theme skybox horizon visibility tuning for `Beach`/`Desert`/`Jungle`/`Hyperborea` (including a stronger second-pass raise), skybox anchoring to player/camera for infinite-space feel, seeded world-coordinate decor streaming for stable cross-client procedural placements during expansion (moon/jungle/ireland decor), Ireland gray-sky intermittent rain weather + cow sprites + green rolling hills + a single smaller skyline castle (visibility/readability tuned) plus low stone-wall pasture dividers (two-axis generation with larger pasture spacing), taller/denser jungle tree sprites with full-canopy sky coverage (plus ground-contact grounding fix), terrain-contour-following player cubes on non-`Tron` themes, Tron movement light-trails, avatar visual cleanup (no direction arrow, local rear-facing video / remote front-facing video), and room/theme/password deep-link query params for shareable private-room links.

### TODO:
- Stabilize dev/test workflow for relay + Playwright in a non-sandboxed env.
- Improve relay scaling: drop relay connection after hitting target peers, rejoin relay only to assist new WebRTC dials, then drop again.
- Execute and validate full net-chaos-lab containernet matrix runs in a properly provisioned host (docker + mininet + containernet), then calibrate gate thresholds from observed data.
- Align net-chaos-lab containernet route/interface wiring with proven Containernet NAT/router reference patterns (`natnet`/`linuxrouter`) and keep fail-fast checks enabled for interface mismatch.
- Add scoped + sharded Yjs update modes so state sync can be workload-specific instead of global.
- Validate time sync anchor behavior after reconnects.
- Finish ComputeManager scheduling + GPU hub runtime integration.
- Wire warm DataState deltas into netman publishing end-to-end.
- Implement explicit topology selection (topologyId + topologyType) and sharded state/interest management.
- Chemistry demo (`plan/branch/chem.md`): build a distributed "Fano Reactor" / zero-divisor chemistry sandbox around the sedenion periodic-table paper.
- Keep plan/ and log aligned with ongoing changes.
- Demo release polish: room system for multiplayer demos, DaddyGo high score sync, and docs/README refresh.
- Keystone demo: flagship visualization of self-organizing topology + workload placement.

### TODONT:
- Reintroduce PeerJS or legacy CRDT experiments.
- Redesign NodeKernel/StateManager public APIs mid-branch.
- Add emergent/ad hoc topology until fully distributed + hierarchical modes are stable.

## RoadMap:
1. Hardening: relay config, WSS/HTTP parity, test automation in a real env.
2. Scheduler adoption: migrate demos to snapshots/events; tune profiles.
3. Scale: interest management, topology selection, sharded state, health metrics, reliability tiers.
4. Compute: resume WebGPU workloads, portable WASM workloads, and worker/service-worker isolation.

## Known Issues / Blockers:
- Playwright tests blocked in sandbox (Chromium EPERM, report port bind).
- WSS relay requires valid certs; use HTTP for local tests if needed.
- Production browser logs still show intermittent `webrtc-relay` signal timeouts, and the new Go-relay public-address advertisement fix still needs a prod service restart plus browser re-verification to confirm `Libp2p addrs` stops coming back empty / loopback-scoped.

## Design Principles:
- Modular ES6 modules; managers should be worker-ready where practical.
- Networking layer should be runnable in a worker or service worker.
- NodeKernel owns orchestration policy; NetworkManager owns transport.
- Keep clear module boundaries (input, physics, networking).
- Prefer data/layout choices that keep buffer interop simple.
- DataState is hierarchical and persisted in IndexedDB; state workers handle parallel access.
- Compute runs in CPU/WASM/WebGPU workers; IO stays on the main thread.
- Shared-GPU tasks run under a main-thread GPU hub; isolated GPU tasks emit CPU deltas.
- DataState is layered (hot GPU, warm CPU, cold IndexedDB) with explicit commit deltas.

## Architecture Docs:
- See plan/arch for component summaries and topology notes.

## Long-term Intent:
- Browser-based P2P compute network using WebGPU.
- Support hierarchical or emergent topologies based on bandwidth/compute affinity.
- HTTPS/WSS deployment with signed code and data-only replication.
