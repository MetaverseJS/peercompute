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

### In Progress
- Real Containernet-mode execution validation on host with required Mininet/Containernet stack.
- Full service lifecycle validation in provisioned environments (startup, readiness, and stability under scenario load).
- Matrix threshold tuning from real probe data (default gates are currently conservative starter values).

### Not Started
- CI profile for dry-run verification + optional privileged runner profile for Containernet.

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
- `npm run chaos-lab:matrix:full`
- `npm run chaos-lab:matrix:smoke`
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
