Instructions: This file contains branch goals and implementation status for large-scale network simulation and validation.

## Branch Goal
Build a reproducible, one-command "internet chaos lab" for PeerCompute that can model dual-stack internet conditions, NAT diversity, relay/TURN behavior, and large peer populations so we can diagnose and improve direct WebRTC connectivity and relay scaling.

## Why This Branch Exists
Current NetViz/runtime behavior shows peers frequently upgrading to relay-assisted WebRTC paths and then churning, with repeated logs indicating no locally announced direct `/webrtc` multiaddrs. This branch provides the testbed required to reproduce, instrument, and fix that behavior under controlled conditions.

## Scope
- New harness root: `net-chaos-lab/`
- Topology orchestration (Containernet-first, dry-run fallback)
- Scenario execution (partitions, IP-mode shifts, link profile changes, churn)
- Browser-agent probing (headless, optional media loopback)
- Metrics + dashboard for convergence and success tracking
- Integration path to run PeerCompute demos within the simulated network

## Out of Scope (for now)
- Replacing libp2p transport architecture
- Production deployment automation for the chaos lab
- Full physical-network fidelity beyond what Linux tc/netns/container routing can represent

## Implementation Status (2026-02-08)

### Completed
- `net-chaos-lab/` scaffold created with configs, probe agent, dashboard, and orchestrator modules.
- Topology manager implemented in `net-chaos-lab/src/chaoslab/topology.py`:
- dual-stack segments
- NAT-segment modeling and uplink profile controls
- 10-50 agent allocation support
- service records for DNS/HTTPS/relay/TURN
- Scenario runner implemented in `net-chaos-lab/src/chaoslab/scenario.py`:
- partition isolate/heal
- bandwidth shifts
- IPv4-only/IPv6-only toggles
- agent churn with auto-revert timing
- Harness implemented in `net-chaos-lab/src/chaoslab/harness.py`:
- optional demo process lifecycle
- parallel probe execution
- probe event recording
- Main runner + one-command launcher implemented:
- `net-chaos-lab/src/chaoslab/main.py`
- `net-chaos-lab/scripts/chaos-lab.sh`
- Dashboard API + UI wired:
- `net-chaos-lab/src/chaoslab/dashboard.py`
- `net-chaos-lab/dashboard/index.html`
- Tests and validation added:
- `net-chaos-lab/tests/test_chaoslab.py`
- dry-run orchestration passes
- Python compile checks pass
- Containernet host preflight checks added (docker, mn, ip/iptables/tc, docker daemon reachability).
- Fail-fast service startup and health checks added for DNS/HTTPS/relay/TURN (PID and TCP readiness where applicable).
- Headless probe diagnostics expanded:
- direct-vs-relay connection indicators
- announced direct `/webrtc` address counts
- RTC candidate type aggregation hooks
- post-convergence direct/relay stability sampling (peer-set churn + connection flip counts + sample-rate metrics)
- Added direct diagnostics scenario config: `net-chaos-lab/configs/scenarios/direct-diagnostics.yaml`.
- Added live chaos overlay feed for NetViz:
- chaos-lab dashboard now serves `/api/topology` alongside summary/events.
- NetViz can render chaos-lab topology + stage behavior via `?chaosApi=...`.
- Added matrix-full watcher workflow:
- `npm run chaos-lab:matrix:full` boots NetViz watcher and prints a preconfigured watch URL while matrix runs.
- Added unattended matrix loop launcher:
- `npm run chaos-lab:matrix:loop` repeats `matrix:full` until the matrix passes (or user-defined stop conditions are reached).
- Added unattended IPv6 triage loop launcher:
- `npm run chaos-lab:ipv6:loop` repeats focused `ipv6:min` runs with target-based stop conditions and sudo keepalive for overnight debugging.
- Added matrix artifact watcher launcher:
- `npm run chaos-lab:matrix:watch` waits for the next completed matrix summary and prints key metrics/failing gates for rapid debug iteration when runs are launched from another terminal.
- NetViz now renders a persistent 3D chaos topology overlay (core/segments/services/agents) from `/api/topology` even when relay bootstrap is unavailable.
- Matrix watcher default URL now includes `autoConnect=0` to avoid bootstrap dial spam and keep observer mode stable until manual connect.
- Matrix watcher now detects the actual Vite port and prints a correct watcher URL when 5182 is already occupied; dashboard port defaults to an auto-picked free port to avoid stale `8866` collisions.
- Matrix watcher launch now pre-cleans stale NetViz listeners on the requested watcher port and enforces a `/chaos-api/api/summary` HTTP 200 preflight before matrix execution.
- NetViz chaos feed polling now degrades gracefully on transient/non-200 chaos-api responses instead of throwing and dropping the panel entirely.
- Containernet image provisioning hardened:
- added `net-chaos-lab/docker/chaos-node.Dockerfile` (`iproute2`, `dnsmasq`, `caddy`, `coturn`, `iptables`) and switched default agent/core-service images to `peercompute/net-chaos-lab-node:latest`.
- containernet startup now preflights required docker images and auto-builds the default chaos-lab image when missing, eliminating runtime apt dependency in isolated containers.
- Relay startup now injects in-lab ICE config (`RELAY_WEBRTC_CONFIG`) pointing at `turn.peercompute.test` and validates generated `relay-config.json` includes `iceServers` + TURN host entries.
- NetViz debug status now exposes advertised `announceAddrs` from `NetworkManager` so probe diagnostics can score advertised WebRTC paths instead of empty local multiaddr snapshots.
- Probe runner now disables Chromium mDNS host obfuscation (`WebRtcHideLocalIpsWithMdns`) to improve direct-candidate observability in containernet measurements.
- Chaos runner now auto-refreshes `docs/netviz` from `demos/netviz` before containernet probe runs when sources are newer, so in-lab HTTPS probes always execute current NetViz diagnostics code.
- Probe direct-path classification now uses WebRTC stats fallback in `net-chaos-lab/agent/probe.mjs`: if selected RTC candidate pairs show active non-relay (`host`/`srflx`/`prflx`) paths, probes and stability sampling mark direct connectivity even when libp2p multiaddrs remain relay-scoped. This addresses false-negative direct-rate scoring and under-reported direct stability samples during successful hole-punch runs.
- Agent preflight now honors chaos IP mode family constraints in `net-chaos-lab/src/chaoslab/harness.py`: HTTPS preflight uses `curl -6` in `ipv6-only` and `curl -4` in `ipv4-only`, and fallback service IP selection prefers matching-family addresses to avoid false infra failures during IP-mode scenario stages.

### In Progress
- Real Containernet-mode execution validation on host with required Mininet/Containernet stack.
- Full service lifecycle validation in provisioned environments (startup, readiness, and stability under scenario load).
- Matrix threshold tuning from real probe data (default gates are currently conservative starter values).

### Not Started
- CI profile for dry-run verification + optional privileged runner profile for Containernet.

## Implementation Status (2026-02-20 Update)

### Completed This Cycle
- `ip_mode` stage handling in `net-chaos-lab/src/chaoslab/topology.py` was converted to packet-filter toggles only (`iptables`/`ip6tables`) and no longer writes `net.ipv6.conf.*.disable_ipv6` during runtime mode transitions.
- Added containernet host-forward policy guard in topology startup/shutdown:
- capture host `iptables`/`ip6tables` FORWARD policy,
- set temporary `FORWARD=ACCEPT` during lab runtime,
- restore original policy on shutdown/startup failure.
- Added router forwarding-chain stabilization in `net-chaos-lab/src/chaoslab/topology.py`:
- flush/reseed router `FORWARD` chains (`iptables` + `ip6tables`) to deterministic allow state during startup,
- reduce asymmetric routed-path failures from inherited/stale chain ordering.
- Extended preflight diagnostics in `net-chaos-lab/src/chaoslab/harness.py` with remote endpoint fields:
- `curl_remote_ip`, `curl_remote_port`,
- `fallback_remote_ip`, `fallback_remote_port`.
- Added/updated unit coverage in `net-chaos-lab/tests/test_chaoslab.py` for the new ip-mode behavior and updated preflight command stubs.

### Completed This Cycle (2026-02-20 IPv6 Triage Pass)
- Added host bridge netfilter runtime guard in `net-chaos-lab/src/chaoslab/topology.py`:
- capture/restore `net.bridge.bridge-nf-call-iptables` and `net.bridge.bridge-nf-call-ip6tables` when exposed by host kernel,
- temporarily set both to `0` during containernet runtime.
- Extended startup-failure/stop restoration to always revert both host FORWARD policy and bridge-netfilter sysctls.
- Updated router setup to keep IPv6 explicitly routed-only by removing stale IPv6 NAT66 masquerade rules (`ip6tables -t nat -D POSTROUTING ... MASQUERADE`).
- Extended `ipv6-only` preflight diagnostics in `net-chaos-lab/src/chaoslab/harness.py` with per-agent snapshots:
- `ip -6 route show default`,
- `ip -6 route show`,
- `ip -6 neigh show`,
- `ip -6 rule show`,
- `ip6tables -L FORWARD -n -v`.
- Hardened IPv6 interface reset behavior in `net-chaos-lab/src/chaoslab/topology.py`:
- replaced `ip -6 addr flush dev <if>` with `ip -6 addr flush dev <if> scope global` for agents/routers/services so link-local (`fe80::/64`) addresses remain available for ND/NDP.
- Hardened preflight resilience in `net-chaos-lab/src/chaoslab/harness.py`:
- added configurable preflight curl timeout/retry/backoff (`CHAOSLAB_PREFLIGHT_CURL_MAX_TIME`, `CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS`, `CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS`) and retry handling for transient connect/timeouts.
- wired stronger defaults for focused IPv6 triage npm scripts (`chaos-lab:ipv6:min*`) to reduce CPU-contention false negatives (`max_time=20`, `attempts=4`, retry delay `1200ms`, probe parallelism `1`).
- Added focused triage configs:
- `net-chaos-lab/configs/topology.ipv6-minimal.yaml`,
- `net-chaos-lab/configs/scenarios/ipv6-only-minimal.yaml`.
- Added npm launch shortcuts for focused triage:
- `npm run chaos-lab:ipv6:min` (agents-only ip_mode scope),
- `npm run chaos-lab:ipv6:min:all` (forces ip_mode scope across agents+routers+services).
- Updated agents-only `ip_mode` runtime behavior to family route toggles (`ip route` / `ip -6 route`) instead of OUTPUT filter drops, to avoid collateral IPv6 path breakage during `ipv6-only` stages.
- Added deeper `ipv6-only` preflight diagnostics to include router/service-side IPv6 snapshots (router addr/route/forward chain + router-to-service curl + service addr/route/listeners) so failures can be localized beyond agent-only route state.
- Added IP-mode probe URL family preference in `net-chaos-lab/src/chaoslab/harness.py`:
- in `ipv6-only`/`ipv4-only`, probes now prefer a family-matching literal service URL when service mappings are available, even when hostname preflight succeeds.
- added unit coverage in `net-chaos-lab/tests/test_chaoslab.py` to assert literal IPv6 URL selection during `ipv6-only` probing.
- Added IPv6 startup/warmup hardening in `net-chaos-lab/src/chaoslab/topology.py`:
- HTTPS service health checks now include IPv6 readiness (`curl -6 https://[service-ipv6]/netviz/`) when service IPv6 is present.
- `ip_mode=ipv6-only` agent toggles now warm path state (gateway ping + best-effort HTTPS curl to service IPv6) to reduce transient post-switch dial failures.
- Hardened `ip_mode` route transitions in `net-chaos-lab/src/chaoslab/topology.py`:
- agents now use verified default-route programming (`_ensure_default_route`) during runtime mode switches (dual-stack/ipv4-only/ipv6-only), matching startup route validation behavior.
- added convergent IPv6 warmup retries (neighbor/cache refresh + repeated IPv6 HTTPS checks) with env-tunable controls (`CHAOSLAB_IPV6_WARMUP_TIMEOUT_S`, `CHAOSLAB_IPV6_WARMUP_STEP_MS`).
- extended router IPv6 forwarding setup to force per-interface forwarding (`net.ipv6.conf.<lan>.forwarding=1`, `net.ipv6.conf.<wan>.forwarding=1`) in addition to global/default sysctls.
- Added deterministic per-agent MAC assignment in `net-chaos-lab/src/chaoslab/topology.py` during containernet agent interface setup to reduce possible L2/FDB flapping under single-segment IPv6 runs.
- Added static IPv6 neighbor seeding in `net-chaos-lab/src/chaoslab/topology.py` for agent<->router gateway and router<->HTTPS service paths; seeding now runs at containernet startup and after agents-scope `ip_mode` transitions to `dual-stack`/`ipv6-only`.
- Updated `ipv6-only` warmup in `net-chaos-lab/src/chaoslab/topology.py` to preserve neighbor cache by default (no per-attempt flush), with optional opt-in flush via `CHAOSLAB_IPV6_WARMUP_FLUSH_NEIGH=1`.
- Extended failed `ipv6-only` diagnostics in `net-chaos-lab/src/chaoslab/harness.py` with:
- agent link snapshots (`agent_ip6_link`, `agent_ip6_addr`)
- router LAN neighbor table (`router_ip6_neigh_lan`)
- router forwarding sysctl summary (`router_ipv6_forwarding`)
- Extended unit coverage in `net-chaos-lab/tests/test_chaoslab.py` to assert HTTPS service spec includes IPv6 readiness checks.
- Fixed relay bootstrap address-family publication in `peercompute/src/relay/server.js`:
- relay-config generation now emits both `/dns4/...` and `/dns6/...` bootstrap peers for hostname-based relay endpoints,
- generated config keeps `wss`/port normalization while deduplicating emitted bootstrap peers.
- Fixed circuit fallback bootstrap family selection in `peercompute/src/peercompute/networkManager/NetworkManager.js`:
- `_buildCircuitAddr` now prefers `/dns6`/`/ip6` bootstrap entries when local IPv6 is available and falls back to `/dns4`/`/ip4` otherwise.
- Added/ran focused unit coverage for the above behavior in `peercompute/tests/unit/networkManager.webrtc.test.js`.
- Unit/syntax validation passed after this patch:
- `PYTHONPATH=net-chaos-lab/src python3 -m unittest net-chaos-lab/tests/test_chaoslab.py` (`Ran 50 tests ... OK`),
- `python3 -m py_compile net-chaos-lab/src/chaoslab/*.py`.
- `node --test peercompute/tests/unit/networkManager.webrtc.test.js` (`13/13 passing`).

### Completed This Cycle (2026-02-21 Optionalization + Local Relay UX)
- Split chaos-lab command ownership into `net-chaos-lab/package.json` with dedicated scripts (`chaos-lab`, `matrix*`, `ipv6*`, `cleanup`, `image:build`, `deps:python`).
- Converted root `package.json` `chaos-lab:*` entries into thin wrappers (`npm --prefix net-chaos-lab run ...`) so protocol-lab execution is clearly optional from the main app/demo workflow.
- Added root `chaos-lab:deps` wrapper to optional python dependency bootstrap (`pip install -r net-chaos-lab/requirements.txt`) without mixing that setup into normal demo usage.
- Hardened local demo launchers (`scripts/dev-local-relay.sh`, `scripts/dev-all.sh`) with strict Vite ports by default (`DEV_STRICT_PORT=1`) so occupied ports fail fast instead of silently remapping demos (which caused misleading \"not seeing peers\" reports).
- Verified wrapper arg forwarding (`npm run chaos-lab:matrix:watch -- --help`) and local relay strict-port behavior in validation runs.
- Added cross-demo NetViz attach plumbing:
: `NodeKernel` now publishes `telemetry:<peerId>` warm deltas by default and publishes active demo session metadata over pubsub topic `peercompute-netviz-sessions` (with same-origin BroadcastChannel hints retained for instant local attach UX).
: NetViz now exposes an "Attach demo" picker that auto-loads topology/room from active demo sessions and reconnects to that target session for P2P link debugging.

### Completed This Cycle (2026-02-21 Cross-Demo Chaos Probe Matrix)
- Added browser-kernel registry hooks in `peercompute/src/peercompute/nodeKernel/NodeKernel.js`:
: kernels self-register to `window.__PEERCOMPUTE_KERNELS__` and expose `window.__PEERCOMPUTE_LAST_KERNEL__` for probe discovery across demos.
- Extended chaos harness/main CLI plumbing for demo probing:
: `net-chaos-lab/src/chaoslab/main.py` now supports `--probe-mode`, `--simulate-profile`, and `--simulate-ms`.
: `net-chaos-lab/src/chaoslab/harness.py` now forwards `--simulateProfile` and `--simulateMs` into probe invocations.
- Upgraded `net-chaos-lab/agent/probe.mjs`:
: added `peercompute` probe diagnostics path (kernel status + telemetry snapshot extraction),
: added stability sampling helpers in peercompute mode,
: added optional simulation profiles (`basic`, `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, `none`).
- Added cross-demo matrix config `net-chaos-lab/configs/matrix/demo-regression.yaml` with demo URLs and per-demo simulation profiles.
- Added npm scripts for demo matrix runs:
: package-local (`matrix:demos`, `matrix:demos:full`, `matrix:demos:loop`) and root wrappers (`chaos-lab:matrix:demos*`).
- Added/validated unit coverage:
: `test_harness_passes_simulation_args_to_probe` in `net-chaos-lab/tests/test_chaoslab.py`,
: `nodeKernel.netvizDebug` tests pass with new kernel registry behavior.

### Current Blocker
- Post-fix verification run pending for the latest relay bootstrap family patch. Prior failing artifacts showed `/dns4/...`-only relay announce/bootstrap addrs during `ipv6-only` stages, which can strand peers once IPv4 default routes are removed.
- If `ipv6-only` still fails after this patch, remaining likely root cause is intermittent routed IPv6 path instability (agent->router->service), with router/service diagnostics already available in `network_preflight` for follow-up.

## Direct-Connection Diagnosis Focus
Primary hypothesis to validate/falsify with this branch:
- Peers are missing stable, dialable direct `/webrtc` addresses in announce/peerstore state.
- As a result, dialing prefers relay-circuit targets (`/p2p-circuit/webrtc`) and direct sessions are unstable or absent.

Evidence to track in chaos-lab runs:
- Presence/announce contains direct non-relay `/webrtc` multiaddrs.
- ICE candidate classes (host/srflx/relay) and selected pair type.
- Ratio of direct WebRTC vs relay-assisted WebRTC over time.
- Convergence time and post-convergence churn rate.

## Milestones

### M1: Foundation Harness (done)
- Deliver runnable orchestrator + scenario runner + metrics dashboard.
- Dry-run validation and unit test coverage.

### M2: Real Network Backend Validation (next)
- Execute same scenarios in Containernet mode.
- Confirm segment routing/NAT behavior and service reachability.
- Validate probe execution from agent containers.

### M3: Demo Integration Matrix
- Run NetViz and selected demos under scenario profiles.
- Capture direct/relay path quality metrics per scenario.
Status:
- Implemented cross-demo matrix profile (`configs/matrix/demo-regression.yaml`) for PeerCompute-enabled demos with simulated interactions and peercompute-mode probes.

### M4: Regression Gates for Relay Scaling
- Codify pass/fail thresholds:
- minimum direct-connection success rate
- maximum relay dependency after stabilization window
- maximum convergence p95 and churn rate
Status:
- Implemented matrix mode in chaos-lab runner (`--matrix`) with per-run gate operators (`>`, `>=`, `<`, `<=`, `==`, `!=`).
- Added default regression matrix config: `net-chaos-lab/configs/matrix/direct-regression.yaml`.
- Added matrix summary artifact output: `net-chaos-lab/artifacts/<matrix-run-id>/matrix-summary.json`.

## Definition of Done
- Single command runs topology + scenario + probes + dashboard with reproducible artifacts.
- At least one Containernet scenario with 10+ agents completes successfully.
- Metrics clearly separate direct vs relay-assisted outcomes and convergence behavior.
- Results are actionable enough to confirm root cause(s) of missing stable direct links.

## Command Reference
- `npm run chaos:lab`
- `npm run chaos-lab:matrix`
- `npm run chaos-lab:matrix:demos`
- `npm run chaos-lab:matrix:full`
- `npm run chaos-lab:matrix:demos:full`
- `npm run chaos-lab:matrix:loop`
- `npm run chaos-lab:matrix:demos:loop`
- `npm run chaos-lab:matrix:watch`
- `npm run chaos-lab:matrix:smoke`
- `npm run chaos-lab:deps`
- `npm --prefix net-chaos-lab run chaos-lab`
- `bash net-chaos-lab/scripts/chaos-lab.sh --mode dry-run --skip-scenario --skip-probes --no-dashboard`
- `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/direct-regression.yaml`
- `PYTHONPATH=net-chaos-lab/src python3 -m unittest net-chaos-lab/tests/test_chaoslab.py`
- `python3 -m py_compile net-chaos-lab/src/chaoslab/*.py`

## Next Steps (Priority Order)
1. Validate Containernet mode on a host with required privileges/tooling.
2. Run the new matrix in containernet mode and tune gate thresholds from real probe artifacts.
3. Add a scenario pack focused on direct-address publication failures and recovery.
4. Add NetViz-oriented assertions for direct path persistence vs relay fallback churn.
5. Promote stable scenario(s) into CI-ready regression scripts.
