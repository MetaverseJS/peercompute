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

# run the regression matrix (multi-scenario + gate checks)
npm run chaos-lab:matrix

# root regression matrix run (containernet)
npm run chaos-lab:matrix:full

# run a fast matrix smoke check (dry-run, no probes/scenario execution)
npm run chaos-lab:matrix:smoke

# remove stale containernet docker nodes (mn.*)
npm run chaos-lab:cleanup
```

`npm run chaos-lab:matrix:full` now starts a local NetViz watcher server automatically and prints a watcher URL with chaos-lab defaults (including `chaosApi=/chaos-api`) so you can observe the run live.

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

# Matrix run with stop-on-first-failure behavior
bash net-chaos-lab/scripts/chaos-lab.sh \
  --matrix net-chaos-lab/configs/matrix/direct-regression.yaml \
  --matrix-stop-on-fail

# Dry-run matrix validation (good for local CI-like smoke checks)
bash net-chaos-lab/scripts/chaos-lab.sh \
  --matrix net-chaos-lab/configs/matrix/dry-run-smoke.yaml

# Probe after every scenario stage
bash net-chaos-lab/scripts/chaos-lab.sh --probe-each-stage

# Enable media loopback validation
bash net-chaos-lab/scripts/chaos-lab.sh --media
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

Disable it with `--no-dashboard`.

NetViz can overlay this feed directly by opening it with:
- `?chaosApi=/chaos-api` (via NetViz Vite proxy during local dev), or
- `?chaosApi=http://127.0.0.1:8866` when not using the proxy.

## Topology Config
Default topology: `configs/topology.default.yaml`

Key sections:
- `network`: global network properties
- `agents`: browser-agent container count/image/command
- `segments`: per-LAN CIDR + NAT metadata
- `core_services`: dns/https/relay/turn definitions
- `links`: base profile + per-segment overrides
- `harness`: default probe URL and thresholds

Default topology uses `node:24-bookworm` for core services so Containernet shell commands work reliably (`bash` + `sleep` present). DNS/HTTPS/TURN service binaries are installed on-demand during service bootstrap.

## Scenario Config
Default scenario: `configs/scenarios/default-chaos.yaml`

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
- In containernet mode, service start commands are best-effort; inspect run logs for service-specific failures.
- Containernet mode runs `mn -c` at startup (when root) to clean stale Mininet interfaces from prior failed runs.
- Containernet mode preflights all planned docker node names and force-removes stale `mn.<node>` containers before creating lab nodes.
- First containernet run may take longer because DNS/HTTPS/TURN service packages are installed inside service containers.
- For production-like TLS/DNS behavior, point demo hostnames to the in-lab HTTPS service host.
