## PeerCompute Test Strategy

### Baseline unit suite
- Command: `npm --prefix peercompute run test:unit`
- Purpose: guard core `NetworkManager`, scheduler, topology, and NodeKernel policy behavior.
- Gate: must pass before merging networking policy changes.

### Direct-path runtime check
- Command: `npm --prefix peercompute run test:direct-path`
- Purpose: verify payload flow survives relay disruption and confirms relay-independent peer path.
- Gate: run whenever relay-drop/direct classification logic changes.

### NetViz runtime scale check
- Command: `node peercompute/tests/runtime/netviz-scale.mjs --peers <N> --dropRelay true --retention sqrt --retentionMin 2 --radius <R> --maxConnections <M> --targetConnections <T> --settle <MS>`
- Purpose: detect relay churn, isolation, and direct/relay mix under multi-peer load.
- Notes:
- Ensure `https://localhost:5182/` is free before running (harness currently expects 5182).
- Capture `[NetworkManager] ICE candidate`, `Connection upgraded`, and `Connection closed` logs when diagnosing churn.

### Current direct-connection diagnosis target
- Symptom: peers upgrade from relay to `webrtc`, then churn/disconnect and re-dial relay.
- Key signal from logs: `No local /webrtc addrs to announce; direct WebRTC dials will be skipped.`
- Interpretation: nodes are not publishing dialable direct `/webrtc` addresses; only relay-circuit paths are advertised.
- Secondary signal: ICE candidates are host-only (`*.local`) and not exposed as stable direct multiaddrs.
- Working hypothesis: "upgraded webrtc" links are mostly relay-signaled `/p2p-circuit/webrtc` paths, not stable direct peer-to-peer addresses.

### Internet chaos lab (new)
- Root: `net-chaos-lab/`
- Goal: reproducible, configurable network simulation for direct-vs-relay behavior and convergence testing.

### Chaos-lab topology requirements
- Dual-stack core with configurable IPv4-only / IPv6-only switches.
- Multiple NAT segments with distinct link characteristics.
- Built-in DNS, HTTPS, relay, and TURN service containers.
- 10-50 browser agents running headless probes.

### Chaos-lab scenario requirements
- Partition isolate/heal actions.
- Bandwidth/delay/loss shifts per segment uplink.
- Agent churn (drop/restore).
- Optional media loopback probe validation.
- Direct-path diagnostics scenario: `net-chaos-lab/configs/scenarios/direct-diagnostics.yaml`.

### Chaos-lab metrics requirements
- Persist probe events to JSONL.
- Compute run summary with connection success rate, media success rate, convergence average/p95, and scenario event count.
- Include direct-path diagnostics in summary:
- direct announce rate
- direct connection rate
- relay-webrtc connection rate
- direct-connection stability sample rate
- peer-set churn/change counts
- direct/relay connection flip counts
- RTC local/remote candidate type aggregates
- Serve metrics in a local dashboard (`/api/summary`, `/api/events`).

### Chaos-lab execution gates
- Dry-run gate: `bash net-chaos-lab/scripts/chaos-lab.sh --mode dry-run --skip-scenario --skip-probes --no-dashboard`
- Unit gate: `PYTHONPATH=net-chaos-lab/src python3 -m unittest net-chaos-lab/tests/test_chaoslab.py`
- Python syntax gate: `python3 -m py_compile net-chaos-lab/src/chaoslab/*.py`
- Matrix gate (multi-scenario + threshold checks): `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/direct-regression.yaml`
: writes matrix-level summary to `net-chaos-lab/artifacts/<matrix-run-id>/matrix-summary.json`.
: expected behavior in non-provisioned/non-root hosts is a controlled failure with gate output; expected behavior in provisioned containernet hosts is full matrix execution with evaluated thresholds.
- NPM matrix shortcut: `npm run chaos-lab:matrix` (non-root wrapper around the same matrix config).
- Matrix smoke gate (headless/local, dry-run): `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/dry-run-smoke.yaml`
: verifies matrix orchestration/gate evaluation without requiring containernet services or browser probing.
- Containernet preflight gate: `bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet --skip-scenario --skip-probes --no-dashboard`
: expected behavior in unprovisioned hosts is a fail-fast prerequisite error; expected behavior in provisioned hosts is topology startup with healthy services.
- Root containernet gate (provisioned hosts): `sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet --skip-scenario --skip-probes --no-dashboard`
: use this form to preserve Node 24 path under `sudo` and use containernet venv Python.
- NPM root containernet shortcut: `npm run chaos-lab:full`.
- NPM root matrix shortcut: `npm run chaos-lab:matrix:full`.
- Stale container cleanup shortcut: `npm run chaos-lab:cleanup` (removes lingering `mn.*` containers).
- NetViz chaos overlay dev gate: run NetViz with `?chaosApi=/chaos-api` and verify live `/api/summary`, `/api/events`, and `/api/topology` panel updates during a chaos-lab run.
- NetViz proxy gate: `VITE_CHAOS_API_PROXY_TARGET=http://127.0.0.1:8866 npm --prefix demos/netviz run build` (ensures overlay code and proxy config compile).

### NetViz manual diagnosis checklist
- Confirm `Announce addrs` include non-relay `/webrtc` addresses for direct dialing.
- Check whether upgraded links are `webrtc` direct vs `relay-webrtc` (`/p2p-circuit/webrtc`).
- Confirm relay redial behavior after `remaining: 0` events.
- Capture at least one successful direct candidate pair from WebRTC stats.
- Record findings and commands in `plan/log.md`.
