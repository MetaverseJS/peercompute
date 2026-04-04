# Net Chaos Lab

This folder provides a one-command "internet chaos lab" for PeerCompute demos.
It is intended for heavy-duty protocol-level validation of PeerCompute networking behavior and is optional for normal PeerCompute usage.

## What It Includes
- Containernet topology runner with:
  - dual-stack addressing (IPv4 + IPv6)
  - multiple NAT segments
  - core service containers (DNS/HTTPS/relay/TURN)
  - 10-50 browser-agent containers
- Scenario runner for:
  - partitions/isolation + healing
  - IPv4-only and IPv6-only mode toggles
  - bandwidth/delay/loss shifts
  - agent drop/restore churn
- Metrics pipeline:
  - probe result JSONL events
  - summary metrics (success rate, convergence avg/p95)
  - terminal-style dashboard (`dashboard/index.html`)
- Probe harness:
  - headless Playwright agent probe (`agent/probe.mjs`)
  - optional media loopback probe
  - reusable simulated player behavior harness with per-demo profiles

## Prerequisites (Protocol Testing Only)
- Linux host with network namespace support (Containernet mode is Linux-only).
- Node.js 24 LTS + npm.
- Python 3.10+ and pip.
- Docker Engine running locally.
- Mininet installed (`mn` command available).
- Containernet Python package/modules available.
- Host networking tools: `iproute2`, `iptables`, and `tc`.

Quick checks:

```bash
node --version
npm --version
python3 --version
docker --version
mn --version
python3 -c "from mininet.net import Containernet; print('containernet ok')"
```

Dependency install for runner code:

```bash
python3 -m pip install -r net-chaos-lab/requirements.txt
# or from repo root:
npm run chaos-lab:deps

# prebuild the containernet node image (recommended before full matrix runs)
npm run chaos-lab:image:build
```

Notes:
- Dry-run mode can run without Docker/Mininet/Containernet.
- Real Containernet mode usually requires elevated privileges and a host configured for Docker + Mininet networking.

## Quick Start

```bash
# run the chaos lab with default topology + scenario
npm run chaos-lab

# root containernet startup check (no scenario/probes/dashboard)
npm run chaos-lab:full

# focused minimal IPv6 triage run (single segment, ip_mode_scope=agents)
npm run chaos-lab:ipv6:min

# focused minimal IPv6 triage run with infra + routers included (stress mode)
npm run chaos-lab:ipv6:min:all

# focused minimal IPv6 triage loop (unattended)
npm run chaos-lab:ipv6:loop

# run the regression matrix (multi-scenario + gate checks)
npm run chaos-lab:matrix

# run the cross-demo regression matrix (cubechat/hyperborea/sneakywoods/daddygo)
npm run chaos-lab:matrix:demos

# root regression matrix run (containernet)
npm run chaos-lab:matrix:full

# root cross-demo regression matrix run (containernet + NetViz watcher)
npm run chaos-lab:matrix:demos:full

# root regression matrix run loop (repeats until pass by default)
npm run chaos-lab:matrix:loop

# root cross-demo regression matrix loop
npm run chaos-lab:matrix:demos:loop

# watch for next completed matrix summary (from runs launched in another terminal)
npm run chaos-lab:matrix:watch

# run a fast matrix smoke check (dry-run, no probes/scenario execution)
npm run chaos-lab:matrix:smoke

# remove stale containernet docker nodes (mn.*)
npm run chaos-lab:cleanup
```

Root scripts are wrappers. You can run directly inside the chaos-lab package too:

```bash
npm --prefix net-chaos-lab run chaos-lab
npm --prefix net-chaos-lab run matrix:full
```

`npm run chaos-lab:matrix:full` now starts a local NetViz watcher server automatically and prints a watcher URL with chaos-lab defaults (including `chaosApi=/chaos-api` and `autoConnect=0`). The watcher renders both IP topology and P2P topology from live chaos-lab probe events, so you can observe swarm structure even if the observer browser itself is not directly peered. Use the NetViz `Connect` button only when you also want the observer browser to join the relay-backed session directly. The launcher cleans stale NetViz listeners on the watcher port and performs a `/chaos-api/api/summary` HTTP 200 preflight before matrix execution, so stale proxy servers fail fast instead of silently serving repeated 500s.
`npm run chaos-lab:matrix:demos:full` uses the same watcher/bootstrap flow as `matrix:full` but runs `configs/matrix/demo-regression.yaml`.
`npm run chaos-lab:ipv6:min` and `npm run chaos-lab:ipv6:min:all` now run with higher preflight curl tolerance by default (`CHAOSLAB_PREFLIGHT_CURL_MAX_TIME=20`, `CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS=4`, `CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS=1200`) and lower probe concurrency (`--probe-parallelism 1`) to reduce CPU-contention false negatives in IPv6 triage.
`npm run chaos-lab:ipv6:loop` runs `chaos-lab:ipv6:min` repeatedly with sudo keepalive and per-run summary output:
- default: runs until target metrics are met (`conn>=0.95`, `direct>=0.60`, `preflight>=0.90`, `infra<=0.10`).
- run indefinitely without target-stop: `npm run chaos-lab:ipv6:loop -- --no-until-target`.
- hard stop after N runs: `npm run chaos-lab:ipv6:loop -- --max-runs 500`.
- include routers/services in ip_mode stages: `npm run chaos-lab:ipv6:loop -- --all`.

`npm run chaos-lab:matrix:smoke` is intentionally a dry-run orchestration gate; it should report `probe_total: 0` and does not validate direct/relay networking behavior.

`npm run chaos-lab:matrix:full` requires an interactive sudo-capable terminal for containernet execution.
`npm run chaos-lab:matrix:loop` runs `matrix:full` repeatedly with unattended retry behavior:
- default: runs indefinitely and stops on first `all_passed=true` matrix result.
- customize with arguments: `npm run chaos-lab:matrix:loop -- --max-runs 10 --sleep 30`.
- disable pass-stop mode: `npm run chaos-lab:matrix:loop -- --no-until-pass --max-runs 20`.
- stop manually any time with `Ctrl+C`.
`npm run chaos-lab:matrix:watch` watches artifact output and reports when a matrix run completes:
- default behavior waits for a summary newer than the current latest, prints metrics/failing gates once, then exits.
- include current latest immediately: `npm run chaos-lab:matrix:watch -- --include-current --once`.
- continuous watch mode: `npm run chaos-lab:matrix:watch -- --follow --sleep 1`.

If Containernet is unavailable, `--mode auto` falls back to dry-run orchestration.

## Useful Commands

```bash
# Force dry-run mode (good for local smoke checks)
bash net-chaos-lab/scripts/chaos-lab.sh --mode dry-run --skip-scenario --probe-agents 1 --wait-ms 5000

# Remove stale containernet docker nodes by name
npm run chaos-lab:cleanup

# Force real containernet mode
bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet

# If Mininet requires root, preserve your Node 24 PATH under sudo:
sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python \
  bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet

# IPv4-only scenario
bash net-chaos-lab/scripts/chaos-lab.sh --scenario net-chaos-lab/configs/scenarios/ipv4-only.yaml

# Direct-path diagnostics scenario
bash net-chaos-lab/scripts/chaos-lab.sh --scenario net-chaos-lab/configs/scenarios/direct-diagnostics.yaml --probe-each-stage

# Minimal IPv6-only topology/scenario (routed IPv6 triage, agents-only ip_mode scope)
sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python \
  bash net-chaos-lab/scripts/chaos-lab.sh \
    --mode containernet \
    --topology net-chaos-lab/configs/topology.ipv6-minimal.yaml \
    --scenario net-chaos-lab/configs/scenarios/ipv6-only-minimal.yaml \
    --probe-each-stage \
    --probe-fail-fast \
    --no-dashboard

# Minimal IPv6-only topology/scenario with ip_mode applied to all nodes (agents+routers+services)
sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python \
  CHAOSLAB_IP_MODE_SCOPE=all \
  bash net-chaos-lab/scripts/chaos-lab.sh \
    --mode containernet \
    --topology net-chaos-lab/configs/topology.ipv6-minimal.yaml \
    --scenario net-chaos-lab/configs/scenarios/ipv6-only-minimal.yaml \
    --probe-each-stage \
    --probe-fail-fast \
    --no-dashboard

# Matrix run with stop-on-first-failure behavior
bash net-chaos-lab/scripts/chaos-lab.sh \
  --matrix net-chaos-lab/configs/matrix/direct-regression.yaml \
  --matrix-stop-on-fail

# Cross-demo matrix run (PeerCompute demo pages + simulated interactions)
bash net-chaos-lab/scripts/chaos-lab.sh \
  --matrix net-chaos-lab/configs/matrix/demo-regression.yaml \
  --matrix-stop-on-fail

# Dry-run matrix validation (good for local CI-like smoke checks)
bash net-chaos-lab/scripts/chaos-lab.sh \
  --matrix net-chaos-lab/configs/matrix/dry-run-smoke.yaml

# Probe after every scenario stage
bash net-chaos-lab/scripts/chaos-lab.sh --probe-each-stage

# Enable media loopback validation
bash net-chaos-lab/scripts/chaos-lab.sh --media

# Probe a non-NetViz demo by inspecting NodeKernel status directly
bash net-chaos-lab/scripts/chaos-lab.sh \
  --url "https://demos.peercompute.test/cubechat/?e2e=1" \
  --probe-mode peercompute \
  --simulate-profile cubechat \
  --simulate-ms 2500
```

## Dashboard
By default, the runner serves a local dashboard:
- URL: `http://127.0.0.1:8866`
- APIs:
  - `/api/summary`
  - `/api/events?limit=60`
  - `/api/topology`

Summary now includes direct-path diagnostics fields:
- `direct_announce_rate`
- `direct_connection_rate`
- `relay_webrtc_connection_rate`
- `avg_direct_connection_sample_rate`
- `avg_peer_set_change_count`
- `avg_direct_connection_flip_count`
- `avg_relay_connection_flip_count`
- `rtc_host_only_local_rate`
- `rtc_local_candidate_types`
- `rtc_remote_candidate_types`
- `preflight_probe_count`
- `preflight_success_rate`
- `preflight_dns_success_rate`
- `preflight_https_success_rate`
- `preflight_hosts_entry_rate`
- `infra_failure_rate`

`direct_connection_rate` and direct stability sample metrics are computed from probe payloads that prefer explicit direct libp2p `/webrtc` connection addrs, with a fallback to selected RTC candidate-pair evidence (`host`/`srflx`/`prflx`) when libp2p multiaddrs stay relay-scoped during hole-punching.

Disable it with `--no-dashboard`.

NetViz can overlay this feed directly by opening it with:
- `?chaosApi=/chaos-api` (via NetViz Vite proxy during local dev), or
- `?chaosApi=http://127.0.0.1:8866` when not using the proxy.
- Add `&autoConnect=0` to keep NetViz in observer mode (no immediate relay dial attempts).

## Topology Config
Default topology: `configs/topology.default.yaml`
Minimal IPv6 debug topology: `configs/topology.ipv6-minimal.yaml`

Key sections:
- `network`: global network properties
- `network.ip_mode_scope`: where `ip_mode` stages are applied (`agents` default, `all` optional)
- `agents`: browser-agent container count/image/command
- `segments`: per-LAN CIDR + NAT metadata
- `core_services`: dns/https/relay/turn definitions
- `links`: base profile + per-segment overrides
- `harness`: default probe URL and thresholds

Default topology uses `peercompute/net-chaos-lab-node:latest` for both agents and core services. This image includes `iproute2`, `dnsmasq`, `caddy`, `coturn`, and a pinned Playwright runtime module so containernet startup does not depend on in-lab apt/DNS availability or host-mounted Node module resolution.
By default, `ip_mode` scenario stages only mutate agent nodes; set `network.ip_mode_scope: all` (or `CHAOSLAB_IP_MODE_SCOPE=all`) to apply mode toggles to routers/services too.
For agents-only scope, mode switching is route-based (`ip route` / `ip -6 route` default-route toggles) instead of OUTPUT packet-filter drops to reduce unintended side effects on IPv6 data-plane behavior.
Containernet interface reconfiguration preserves IPv6 link-local addresses by flushing only `scope global` IPv6 addresses, which avoids breaking ND/NDP during repeated scenario mode changes.

## Scenario Config
Default scenario: `configs/scenarios/default-chaos.yaml`
Minimal IPv6 debug scenario: `configs/scenarios/ipv6-only-minimal.yaml`

Supported stage `type` values:
- `bandwidth_shift`
- `partition`
- `ip_mode`
- `agent_churn`

Optional `duration_seconds` auto-creates a revert stage for:
- `partition` isolate -> heal
- `ip_mode` -> dual-stack
- `agent_churn` drop -> restore

## Matrix Config
Default regression matrix: `configs/matrix/direct-regression.yaml`
Cross-demo regression matrix: `configs/matrix/demo-regression.yaml`
Dry-run smoke matrix: `configs/matrix/dry-run-smoke.yaml`

Matrix mode runs multiple scenarios sequentially and evaluates metric gates per run.

CLI:
- `--matrix <path>`: execute matrix config instead of a single scenario run.
- `--matrix-stop-on-fail`: stop matrix execution after the first failed run/gate set.

Per-run gate format:

```yaml
gates:
  - metric: direct_connection_rate
    op: ">="
    value: 0.40
  - metric: avg_peer_set_change_count
    op: "<="
    value: 6
```

Supported operators: `>`, `>=`, `<`, `<=`, `==`, `!=`.

## Artifacts
Each run writes to:
- `net-chaos-lab/artifacts/<run-id>/metrics-events.jsonl`
- `net-chaos-lab/artifacts/<run-id>/metrics-summary.json`
- `net-chaos-lab/artifacts/<run-id>/demo.log` (if demo process started)

Matrix runs also write:
- `net-chaos-lab/artifacts/<matrix-run-id>/matrix-summary.json`
- `net-chaos-lab/artifacts/<matrix-run-id>/runs/<matrix-run-id>-<run-id>/...`

## Demo Harness Integration
Use `--demo-command` to boot a demo before probes:

```bash
bash net-chaos-lab/scripts/chaos-lab.sh \
  --demo-command "npm run dev:netviz -- --host 0.0.0.0 --port 5182" \
  --url "https://demos.peercompute.test/netviz/"
```

`--demo-cwd` can override the working directory.

## Notes
- Real browser-agent probing inside container agents assumes the repo is mounted at `/workspace` in agents.
- In containernet mode, probes now run in-agent using `/workspace/net-chaos-lab/agent/probe.mjs`; host fallback is disabled by default to avoid false diagnostics.
- Before containernet probe runs, chaos-lab now auto-builds `docs/netviz` from `demos/netviz` when sources are newer (or bundle is missing) so in-lab HTTPS probes do not run stale NetViz assets. Set `CHAOSLAB_SKIP_NETVIZ_BUILD=1` to skip this refresh.
- NetViz probe URLs are auto-normalized when query params are missing (`room=telemetry`, `topologyId=netviz-topology`, `topologyType=distributed`, `autoConnect=1`) so headless probes actually initiate network sessions.
- In containernet mode, relay service now self-generates a short-lived TLS cert, serves `wss`, and rewrites `/workspace/docs/netviz/relay-config.json` to in-lab relay bootstrap addresses so probe agents do not use stale external relay endpoints.
- Relay-generated bootstrap peers now include both `/dns4/...` and `/dns6/...` variants when using a hostname, so `ipv4-only` and `ipv6-only` stage probes can bootstrap against the same relay host.
- In containernet mode, relay service also injects local TURN/STUN (`turn.peercompute.test`) into generated relay config (`webrtc.iceServers`) so WebRTC attempts stay inside the lab and do not depend on public STUN.
- Probe Chromium launches with `WebRtcHideLocalIpsWithMdns` disabled to make local host-candidate diagnostics visible during direct-path scoring.
- Probe mode supports both `netviz` and `peercompute`:
- `netviz`: reads `window.__NETVIZ__.getStatus()` telemetry.
- `peercompute`: discovers active `NodeKernel` instances from browser debug handles and derives peer/direct/relay metrics from `getStatus()` + `NetworkManager` telemetry.
- Optional simulated input profiles are available via:
- `--simulate-profile <name>` (`basic`, `cubechat`, `hyperborea`, `sneakywoods`, `daddygo`, `none`)
- `--simulate-ms <duration>` to keep interaction active for a bounded window.
- Games can opt into richer bot control by registering a browser bridge under `window.__PEERCOMPUTE_BOT_BRIDGES__` via `demos/shared/peercomputeBotBridge.js`. A bridge exposes `snapshot()`, `applyAction(action)`, and `clearAction()` so the harness can drive real game state without hard-coded page internals.
- The reusable bot logic now lives under `net-chaos-lab/agent/quake3/` as a standalone Quake III-style bot core:
  - `world-model.mjs` normalizes generic snapshots (`localPosition`, `peers`, `items`, `objectives`, `capabilities`)
  - `personalities.mjs` provides named archetypes (`arena`, `aggressor`, `skirmisher`, `scavenger`, `sentinel`) plus deterministic seeded variation
  - `memory.mjs` tracks recent goals/nav points so bots do not thrash on the same pickup or route node
  - `navigation.mjs` handles nav-point route selection and hazard-aware steering adjustments
  - `bot-core.mjs` coordinates target scoring, patrol routing, strafe/retreat/pursue decisions, attack cadence, and metadata-driven personality selection
  - `math.mjs` provides deterministic steering/angle helpers shared by the harness and tests
- `cubechat`, `hyperborea`, and `sneakywoods` now expose the shared bot-bridge contract, so the same Quake-style bot core can drive different movement/combat models without probe-specific adapters.
- `cubechat` remains movement-focused (`primaryAttack: false`), while `hyperborea` and `sneakywoods` now map the generic `primary` action into real spear/melee attacks.
- `basic` and `daddygo` still use repeatable skirmish phase plans (`advance`, `strafe`, `snap-turn`, `jump-peek`, `retreat`) when a full bridge adapter is not present.
- Set `CHAOSLAB_ALLOW_HOST_PROBE_FALLBACK=1` only when you intentionally want host fallback behavior for troubleshooting.
- Probe preflight now treats missing probe script/curl as hard failures, but continues past non-fatal DNS/HTTPS warnings and can fall back to a known in-lab service IP URL when available; `network_preflight` still records the warning state.
- Probe preflight curl behavior is tunable via environment variables:
- `CHAOSLAB_PREFLIGHT_CURL_MAX_TIME` (seconds, default `8`)
- `CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS` (default `2`)
- `CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS` (default `700`)
- Probe preflight is IP-mode aware: in `ipv6-only` it forces IPv6 HTTPS checks (`curl -6`) and prefers IPv6 fallback service IPs; in `ipv4-only` it forces IPv4 (`curl -4`).
- In `ipv6-only`/`ipv4-only` modes, probe navigation now prefers a family-matching literal URL (`https://[ipv6]/...` or `https://ipv4/...`) when service host mappings are available, reducing browser family-selection ambiguity after route-mode switches.
- HTTPS service startup readiness now includes an explicit IPv6 handshake check (`curl -6`) when service IPv6 is configured, so probe cycles do not begin before IPv6 listeners are actually responsive.
- Agents switching to `ipv6-only` now perform best-effort IPv6 path warmup (gateway ping + service HTTPS curl) to reduce transient first-probe failures after mode flips.
- `ipv6-only` warmup retry behavior is tunable via:
- `CHAOSLAB_IPV6_WARMUP_TIMEOUT_S` (seconds, default `12`)
- `CHAOSLAB_IPV6_WARMUP_STEP_MS` (milliseconds between retries, default `600`)
- `CHAOSLAB_IPV6_WARMUP_FLUSH_NEIGH` (set `1` to force neighbor flush before warmup; default `0` keeps learned neighbor state intact)
- Agent interfaces now get deterministic per-agent MAC addresses during containernet setup to avoid possible L2/FDB instability when many docker-backed peers share a segment.
- Containernet startup and agent `ip_mode` transitions now seed static IPv6 neighbor entries for agent<->router and router<->HTTPS service paths to reduce NDP convergence flake during `ipv6-only` stages.
- IP-mode stage switching no longer uses `disable_ipv6` sysctl flips; agents-only scope now uses default-route family toggles, and all-node scope falls back to packet-filter toggles (`iptables`/`ip6tables`).
- Agents-only `ip_mode` route toggles now use verified default-route programming (`_ensure_default_route`) during stage transitions, matching startup route validation.
- In containernet mode, startup now captures host `FORWARD` policy and temporarily sets host `iptables`/`ip6tables` `FORWARD=ACCEPT` while the lab is running, then restores prior policies on shutdown. This reduces host-firewall-induced forwarding asymmetry during dual-stack tests.
- Segment NAT routers now reset/seed deterministic `FORWARD` allow rules during startup (`iptables` + `ip6tables`) to avoid stale chain state from previous runs causing asymmetric routed-path drops.
- Segment NAT routers now also force per-interface IPv6 forwarding (`net.ipv6.conf.<lan>.forwarding=1`, `net.ipv6.conf.<wan>.forwarding=1`) in addition to global/default forwarding sysctls.
- Host startup now also forces `net.bridge.bridge-nf-call-iptables=0` and `net.bridge.bridge-nf-call-ip6tables=0` (restored on shutdown) when available, to reduce bridge netfilter clipping during containernet forwarding.
- Segment routers are now explicit routed-IPv6 only; startup removes stale IPv6 NAT66 masquerade rules if present.
- Preflight curl diagnostics now include resolved remote endpoint fields (`curl_remote_ip`, `curl_remote_port`, and fallback equivalents) to make family/path selection visible in artifact logs.
- On failed `ipv6-only` preflight, per-agent diagnostics now also capture `ip -6 route`, `ip -6 neigh`, `ip -6 rule`, and `ip6tables FORWARD` snapshots for faster drop-point analysis.
- On failed `ipv6-only` preflight, diagnostics now also capture router/service-side snapshots: `router_ip6_addr`, `router_ip6_route`, `router_ip6tables_forward`, `router_to_service_ipv6`, `service_ip6_addr`, `service_ip6_route`, and `service_listeners`.
- On failed `ipv6-only` preflight, diagnostics now include additional link-layer/forwarding state:
- agent link and IPv6 address snapshots (`agent_ip6_link`, `agent_ip6_addr`)
- router LAN neighbor table (`router_ip6_neigh_lan`)
- router forwarding sysctls summary (`router_ipv6_forwarding`)
- In containernet mode, service start commands are best-effort; inspect run logs for service-specific failures.
- Containernet mode runs `mn -c` at startup (when root) to clean stale Mininet interfaces from prior failed runs.
- Containernet mode preflights all planned docker node names and force-removes stale `mn.<node>` containers before creating lab nodes.
- Containernet mode auto-builds `peercompute/net-chaos-lab-node:latest` from `net-chaos-lab/docker/chaos-node.Dockerfile` when missing, and auto-rebuilds when the image revision label is stale. Set `CHAOSLAB_SKIP_IMAGE_BUILD=1` to disable auto-build and require manual image provisioning.
- Containernet startup now validates in-agent Playwright+Chromium runtime before probes begin. If this fails, rebuild the image with `npm run chaos-lab:image:build` so image browser binaries stay aligned with workspace Playwright package versions.
- For production-like TLS/DNS behavior, point demo hostnames to the in-lab HTTPS service host.
