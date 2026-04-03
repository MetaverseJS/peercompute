## PeerCompute Test Strategy

### Chemistry demo planning gate
- Before any chemistry demo visual polish, lock a deterministic algebra/model suite around the paper invariants: inert CD partner pairs, reactive lower-to-S-layer channels, atomic norm defects limited to `{-4, 0, +4}`, sigma-conjugate sign flips swapping attractive vs anti-bond outcomes, and a sampled `8 -> 2 -> 0` reactivity cascade.
- Command: `node --test demos/tests/fano-reactor.test.mjs`
- Purpose: verify exact sedenion counts, noble-gas inertness, sigma-conjugate bond flips, and the scaffold's reference cascade sample.
- Secondary gate: `npm --prefix demos/fano-reactor run build`
- Purpose: verify the standalone Vite demo still builds into `docs/fano-reactor`.

### Baseline unit suite
- Command: `npm --prefix peercompute run test:unit`
- Purpose: guard core `NetworkManager`, scheduler, topology, and NodeKernel policy behavior.
- Gate: must pass before merging networking policy changes.

### ComputeManager WASM runtime gate
- Command: `node --test peercompute/tests/unit/computeManager.wasm.test.js`
- Purpose: verify `ComputeManager` can execute pure WASM tasks, memory-view IO, result adapters that emit `commitDelta`, and hybrid `wasm-webgpu` host modules without regressing the existing inline fallback path.
- Gate: run when changing `peercompute/src/peercompute/computeManager/**`, new compute workload descriptors, or compute README examples.

### Local relay launcher smoke
- Command: `timeout 20s env DEV_OPEN_OVERVIEW=0 PEERCOMPUTE_NO_OPEN=1 RELAY_IMPL=node bash scripts/dev-local-relay.sh`
- Purpose: verify local dev launcher emits loopback-safe relay env (`RELAY_PUBLIC_HOST=localhost`, `RELAY_LISTEN_HOST=127.0.0.1`) and writes fresh per-demo `relay-config.json` files.
- Expectation: launcher uses strict ports by default (`DEV_STRICT_PORT=1`) so demo port conflicts fail fast instead of silently rebinding to alternate ports.
- Gate: run when changing relay/dev launcher scripts (`scripts/dev-local-relay.sh`, `scripts/dev-all.sh`).

### Relay ICE config sanity check
- Command: `rg -n "stun:stun\\.l\\.google\\.com:19302|turn:secretworkshop\\.net:3478\\?transport=(udp|tcp)" config/relay.json`
- Purpose: verify production relay defaults include Google STUN and coturn UDP/TCP URLs in `webrtc.iceServers`.
- Gate: run when changing `config/relay.json`, `config/relay.env`, or relay config generation scripts.

### Coturn installer script sanity check
- Command: `bash -n scripts/install-coturn-systemd.sh`
- Purpose: verify coturn systemd installer script stays syntactically valid.
- Gate: run when changing coturn service install automation or related README deployment steps.

### Backend server regression gate
- Command: `npm run test:backend`
- Purpose: verify `start-turn-prod.sh` renders managed coturn config from env/config defaults, `pcserver.sh` mode selection stays correct, backend shell scripts remain syntactically valid, the relay systemd installer still targets `pcserver.sh` at `multi-user.target`, and release docs/scripts continue to reference the backend stack.
- Gate: run when changing backend launch scripts, TURN defaults, package backend scripts, deployment docs, or relay systemd installer behavior.

### Production frontend relay-config freshness check
- Command: `python3 - <<'PY'`
- Command: `import json, ssl, urllib.request`
- Command: `ctx = ssl.create_default_context()`
- Command: `demos = ['netviz', 'cubechat', 'sneakywoods', 'hyperborea', 'daddygo']`
- Command: `for demo in demos:`
- Command: `    source_url = f'https://metaversejs.github.io/peercompute/{demo}/relay-config-source.json'`
- Command: `    cfg_url = f'https://metaversejs.github.io/peercompute/{demo}/relay-config.json'`
- Command: `    try:`
- Command: `        with urllib.request.urlopen(source_url, context=ctx, timeout=10) as r:`
- Command: `            source = json.load(r)`
- Command: `        assert source.get('relayConfigUrl') == 'https://secretworkshop.net/peercompute/config/relay-config.json'`
- Command: `    except Exception as exc:`
- Command: `        raise SystemExit(f'{demo}: missing/invalid relay-config-source.json: {exc}')`
- Command: `    with urllib.request.urlopen(cfg_url, context=ctx, timeout=10) as r:`
- Command: `        cfg = json.load(r)`
- Command: `    bootstrap = ' '.join(cfg.get('bootstrapPeers') or [])`
- Command: `    assert 'localhost' not in bootstrap, f'{demo}: stale localhost bootstrap {bootstrap}'`
- Command: `print('prod relay-config freshness OK')`
- Command: `PY`
- Purpose: verify the live GitHub Pages demos ship `relay-config-source.json` pointing at `https://secretworkshop.net/peercompute/config/relay-config.json` and no longer fall back to stale localhost bootstrap peers.
- Gate: run after any GitHub Pages demo build/deploy or when debugging prod frontend connectivity against the production relay.

### Production Go relay advertised-address verification
- Manual gate after any Go relay restart or `peercompute/src/relay-go/main.go` change.
- Open deployed NetViz against prod and evaluate `window.__NETVIZ__?.getStatus?.()` in the browser console.
- Expectation: `addrs` should include public `/dns4/secretworkshop.net/tcp/443/wss/.../p2p-circuit...` or `/dns6/...` entries, not `[]`.
- Expectation: neither `addrs` nor `announceAddrs` should contain `/ip4/127.0.0.1`, `/dns4/localhost`, or other loopback relay addresses.
- Expectation: after the relay-advertisement fix, browser bootstrap/reservation logs should no longer depend on synthetic fallback announce addrs just to remain dialable.

### Overview link-mode check
- Command: `npm run build && rg -n "data-demo-dir|window\\.location\\.port === '4173'|relativeTarget" docs/index.html`
- Purpose: verify demo overview links are production-folder based by default and only switch to dev-port routing on docs dev port `4173` (or explicit query override).
- Expectation: production deploys use folder routes like `./<demo>/...`; local docs dev keeps port-based navigation.
- Gate: run when changing `docs/index.html` demo-card link wiring or overview link-generation logic.

### Overview tile order check
- Command: `node -e "const fs=require('fs'); const html=fs.readFileSync('docs/index.html','utf8'); const names=[...html.matchAll(/<h2>([^<]+)<\\/h2>/g)].map((m)=>m[1]); const expected=['PeerCompute (GitHub)','CubeChat','Universes','PlanetGen','NetViz','Fano Reactor','SneakyWoods','Daddy Go!','Dynamics (WebGpuPhys)','MPM Visual (WebGpuPhys)','PPF Contact Solver (WebGpuPhys)','Hyperborea']; if (!expected.every((label, i) => names[i]===label)) { console.error('Tile order mismatch:', names.slice(0, expected.length)); process.exit(1);} console.log('Overview tile order OK');"`
- Purpose: ensure the overview cards in `docs/index.html` remain in the expected user-facing sequence.
- Gate: run whenever adding/removing/reordering overview cards.

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
- Key signal from logs: `No local /webrtc addrs to announce; using relay-scoped WebRTC announce addrs.`
- Interpretation: nodes are not publishing dialable direct `/webrtc` addresses; only relay-circuit paths are advertised.
- Secondary signal: ICE candidates are host-only (`*.local`) and not exposed as stable direct multiaddrs.
- Working hypothesis: "upgraded webrtc" links are mostly relay-signaled `/p2p-circuit/webrtc` paths, not stable direct peer-to-peer addresses.
- Mitigation in progress: `NetworkManager` now caches observed direct `/webrtc` dial targets per peer (TTL-based) and reuses them when subsequent presence payloads are relay-scoped.
- Mitigation in progress: NetViz now samples selected RTC candidate-pair stats and surfaces direct-vs-relay evidence in node diagnostics (`RTC path evidence`) so relay-scoped multiaddrs do not hide successful direct ICE pairs.
- Validation expectation: `window.__NETVIZ__?.getStatus?.().rtcPath.peerConnectionCount` should be non-zero during active WebRTC sessions; if zero while `Connection upgraded ... -> webrtc` logs are present, the diagnostics hook path is still incomplete.
- Visualization expectation: edge transport selection should prefer aggregated peer telemetry (`via`) across both edge directions, so direct links observed by remote peers are still reflected when the local browser lacks a direct socket for that edge.
- Telemetry classification expectation: `NetworkManager` should preserve relay-scoped WebRTC links as `via=relay-webrtc` (not `webrtc`) while `_hasDirectPeerConnections()` remains false unless a true non-relay direct address is present.
- Path-truth expectation: NetViz edges should treat `signalingPath` and `mediaPath` independently so relay-scoped signaling can still render amber when media is direct, and plain relay can render green even if signaling metadata is missing.
- Remote-edge truth expectation: NetViz `TelemetryStore` should ignore older telemetry snapshots (`ts` monotonic) so remote edge color does not regress from direct (`webrtc`) to relay due out-of-order delta arrival.
- Relay-retention small-room expectation: bootstrap relay drop should not be blocked solely by unreachable `targetConnections` when observed dialable peers are fewer; retention should converge toward `logn` keep-count in small swarms.
- Upgrade-attempt expectation: when a peer only has plain relay (`/p2p-circuit/p2p/...`) and no direct targets, `NetworkManager` should still attempt relay-webrtc upgrade dials (`/p2p-circuit/webrtc/p2p/...`) instead of suppressing attempts solely because relay is already present.
- Targeted unit check: `node --test peercompute/tests/unit/networkManager.webrtc.test.js` should include:
: `NetworkManager prefers remembered direct /webrtc targets after prior direct hint`
: `NetworkManager counts relay-webrtc as direct-capable by default`
: `NetworkManager does not block relay drop on unreachable targetConnections in small rooms`
: `NetworkManager requests relay assist only once per throttle window`
: `NetworkManager handles relay-assist-request by reacquiring relay and replying ready`
: `NetworkManager handles relay-assist-ready by forcing immediate redial`
: `NetworkManager requests relay assist on relay-webrtc NO_RESERVATION dial failure`
: `NetworkManager uses relay-scaling topology defaults`
: `NetworkManager uses lightweight defaults for room-directory nodes`
: `NetworkManager computes transport connection max with bootstrap headroom`
: `NetworkManager setConnectionLimits updates connection manager using transport max`
: `NetworkManager presence payload reports non-bootstrap active peers`
: `NetworkManager ignores closed connections for direct/drop decisions`
: `NetworkManager keeps bootstrap relay when elected keeper even with direct peers`
: `NetworkManager keeps bootstrap relay during direct stability hysteresis window`
: `NetworkManager delays relay prune until direct upgrade grace window passes`
: `NetworkManager applies dial backoff after transient webrtc-relay failures`

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
- probe preflight rates (dns/https/hosts) and infra failure rate
- Serve metrics in a local dashboard (`/api/summary`, `/api/events`).

### Chaos-lab execution gates
- Chaos-lab package gate: `npm --prefix net-chaos-lab run chaos-lab -- --help`
: verifies chaos-lab command ownership remains in `net-chaos-lab/package.json` and root wrappers can stay thin.
- Chaos-lab python deps shortcut metadata gate: `jq -r '.scripts["deps:python"]' net-chaos-lab/package.json`
: validates optional dependency setup command is discoverable without executing heavy installs.
- Dry-run gate: `bash net-chaos-lab/scripts/chaos-lab.sh --mode dry-run --skip-scenario --skip-probes --no-dashboard`
- Unit gate: `PYTHONPATH=net-chaos-lab/src python3 -m unittest net-chaos-lab/tests/test_chaoslab.py`
: includes `test_ip_mode_agents_scope_uses_route_family_toggles` to verify agents-only `ip_mode` uses default-route family switching (`ip route`/`ip -6 route`) rather than filter-drop mutation.
- IPv6 failure triage artifact expectation:
: when `ip_mode=ipv6-only` preflight fails, `payload.network_preflight` should now include router/service fields (`router_ip6_addr`, `router_ip6_route`, `router_ip6tables_forward`, `router_to_service_ipv6`, `service_ip6_addr`, `service_ip6_route`, `service_listeners`).
- Python syntax gate: `python3 -m py_compile net-chaos-lab/src/chaoslab/*.py`
- Matrix gate (multi-scenario + threshold checks): `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/direct-regression.yaml`
: writes matrix-level summary to `net-chaos-lab/artifacts/<matrix-run-id>/matrix-summary.json`.
: expected behavior in non-provisioned/non-root hosts is a controlled failure with gate output; expected behavior in provisioned containernet hosts is full matrix execution with evaluated thresholds.
- NPM matrix shortcut: `npm run chaos-lab:matrix` (non-root wrapper around the same matrix config).
- Cross-demo matrix config gate: `npm run chaos-lab:matrix:demos -- --help`
: validates command wiring for `configs/matrix/demo-regression.yaml` and `probe_mode=peercompute` + simulation argument support.
- Cross-demo matrix containernet shortcut: `npm run chaos-lab:matrix:demos:full`
: same watcher/bootstrap flow as `chaos-lab:matrix:full`, but runs demo-focused matrix scenarios with simulated interactions.
- Probe simulation forwarding unit gate: `PYTHONPATH=net-chaos-lab/src python3 -m unittest discover -s net-chaos-lab/tests -p 'test_chaoslab.py'`
: includes `test_harness_passes_simulation_args_to_probe` to verify `--simulateProfile` and `--simulateMs` are propagated to in-agent probe commands.
- Focused IPv6 triage shortcut: `npm run chaos-lab:ipv6:min`.
: runs containernet with a minimal single-segment topology + `ipv6-only` scenario and default `ip_mode_scope=agents` to isolate agent-family behavior.
: default shortcut now uses lower probe concurrency (`--probe-parallelism 1`) and stronger preflight curl tolerance (`max_time=20`, `attempts=4`, retry delay `1200ms`) to reduce CPU-contention noise while debugging IPv6.
- Focused IPv6 triage infra-stress shortcut: `npm run chaos-lab:ipv6:min:all`.
: same minimal topology/scenario, but forces `CHAOSLAB_IP_MODE_SCOPE=all` to include routers/services in ip_mode stage mutation.
- Focused IPv6 unattended loop shortcut: `npm run chaos-lab:ipv6:loop`.
: repeats minimal ipv6 triage runs with sudo keepalive and per-run summary metrics.
: lightweight validation command: `bash net-chaos-lab/scripts/chaos-lab-ipv6-loop.sh --help`.
- NPM matrix loop shortcut: `npm run chaos-lab:matrix:loop`.
: wraps `matrix:full` in a retry loop; default behavior is unattended repeat-until-pass.
: lightweight validation command (no containernet run): `bash net-chaos-lab/scripts/chaos-lab-matrix-loop.sh --help`.
- NPM matrix watcher shortcut: `npm run chaos-lab:matrix:watch`.
: monitors `net-chaos-lab/artifacts/*/matrix-summary.json` and reports the next completed run (or follows continuously).
: lightweight validation command: `bash net-chaos-lab/scripts/chaos-lab-matrix-watch.sh --help`.
- Matrix smoke gate (headless/local, dry-run): `bash net-chaos-lab/scripts/chaos-lab.sh --matrix net-chaos-lab/configs/matrix/dry-run-smoke.yaml`
: verifies matrix orchestration/gate evaluation without requiring containernet services or browser probing.
: expected result is `probe_total == 0` (no runtime probing in smoke mode).
- Containernet preflight gate: `bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet --skip-scenario --skip-probes --no-dashboard`
: expected behavior in unprovisioned hosts is a fail-fast prerequisite error; expected behavior in provisioned hosts is topology startup with healthy services.
- Root containernet gate (provisioned hosts): `sudo -E env "PATH=$PATH" PYTHON_BIN=/home/$USER/projects/containernet/.venv/bin/python bash net-chaos-lab/scripts/chaos-lab.sh --mode containernet --skip-scenario --skip-probes --no-dashboard`
: use this form to preserve Node 24 path under `sudo` and use containernet venv Python.
- NPM root containernet shortcut: `npm run chaos-lab:full`.
- NPM root matrix shortcut: `npm run chaos-lab:matrix:full`.
: requires an interactive sudo-capable terminal; non-interactive sessions should fail fast with a clear sudo/TTY message.
: default behavior should include `--matrix-stop-on-fail` and `--probe-fail-fast` so long-running containernet matrices abort immediately once infra-only failure is detected.
- Matrix watcher preflight expectation: launcher should clear stale NetViz listeners on the requested watcher port and verify `/chaos-api/api/summary` returns HTTP 200 before matrix execution.
- For watcher runs, always use the printed watcher URL.
- Stale container cleanup shortcut: `npm run chaos-lab:cleanup` (removes lingering `mn.*` containers).
- NetViz chaos overlay dev gate: run NetViz with `?chaosApi=/chaos-api&autoConnect=0` and verify live `/api/summary`, `/api/events`, and `/api/topology` panel updates plus visible chaos topology nodes/links in the 3D view during a chaos-lab run.
- NetViz chaos P2P overlay gate: during an active matrix/full run, verify P2P nodes/edges remain visible in watcher mode (`autoConnect=0`) by consuming latest `probe_result` telemetry from `/chaos-api/api/events`; validate inspector on those nodes/edges reports `Source: chaos probe telemetry` / `P2P Edge ...`.
- NetViz proxy gate: `VITE_CHAOS_API_PROXY_TARGET=http://127.0.0.1:8866 npm --prefix demos/netviz run build` (ensures overlay code and proxy config compile).
- NetViz proxy degradation gate: with an intentionally unreachable proxy target, `/chaos-api/api/summary` should return HTTP `200` with `{..., "degraded": true}` fallback JSON instead of surfacing repeated proxy `500`s in the UI.
- NetViz cross-demo attach gate: run one non-NetViz demo + NetViz on different dev ports, connect NetViz to relay network, ensure "Attach demo" lists active pubsub session beacons and auto-fills topology/room; after attach/reconnect, verify peers and link classifications appear for that demo session.
- NodeKernel NetViz debug unit gate: `node --test peercompute/tests/unit/nodeKernel.netvizDebug.test.js` (validates default debug telemetry settings, telemetry delta publish shape, and attach URL composition).
- NetworkManager NetViz session topic gate: `node --test peercompute/tests/unit/networkManager.webrtc.test.js` (includes additional pubsub topic scope-bypass delivery check for `peercompute-netviz-sessions`).
- NetworkManager logical-cap gate: `node --test peercompute/tests/unit/networkManager.webrtc.test.js` must also cover `maxConnections` reservation behavior across pending topology requests, inbound topology accepts, and in-flight new-peer dials, plus separate reporting for logical peer count vs raw transport connection totals.
- Containernet probe preflight expectation: in matrix/full containernet runs, `preflight_probe_count` should match `probe_total` and `preflight_success_rate` should be > 0 before interpreting direct/relay metrics.
- Containernet routing expectation: NAT routers must have reachability to `core_services.subnet_ipv4/subnet_ipv6`, and service containers must have return routes to NAT uplink subnet(s); otherwise DNS/HTTPS preflight will fail with `infra_failure_rate=1`.
- Containernet service-return-route expectation: service containers must install explicit LAN-subnet routes via each segment router uplink gateway (`ip route ... via <uplink_ip> onlink` and IPv6 equivalent), so HTTPS replies do not blackhole when source traffic is non-SNAT or mixed-mode.
- Containernet interface expectation: docker agents/services must be configured on the Mininet data-plane interface (`<node>-eth0` style via `node.intfNames()`), not Docker bridge `eth0`; otherwise probes time out to core services even when processes are healthy.
- Containernet interface remap expectation: if runtime namespace interfaces are exposed as `ethN` instead of `<node>-ethN`, startup should remap automatically and continue; unresolved data-plane interfaces must fail-fast before probes.
- Container isolation expectation: containernet docker nodes should run with `network_mode=none` so Docker bridge routes do not bypass or pollute Mininet topology routing.
- Container image tooling expectation: all containernet docker nodes must provide the `ip` command (`iproute2`) before topology address/route programming runs; missing `ip` must fail-fast with a clear image-provisioning error (no in-lab apt bootstrap dependency).
- Container image revision expectation: default chaos-lab image should carry the current `org.peercompute.chaoslab.image-rev` label and trigger auto-rebuild when stale (unless `CHAOSLAB_SKIP_IMAGE_BUILD=1`).
- Container privilege expectation: containernet docker agents/services must start with sufficient network capabilities (`NET_ADMIN`/`NET_RAW` or equivalent privileged mode) so interface/address/route programming can succeed.
- Agent route sanity expectation: containernet startup should fail-fast if an agent route to core HTTPS service resolves via Docker bridge `eth0` instead of the configured simulated data-plane interface.
- Core HTTPS reachability expectation: containernet startup should verify that at least one agent per segment can reach core HTTPS `:443`; failures must include service-side diagnostics (`ip addr`, `ip route`, listeners, caddy pid/log tail) to avoid probe-only blind failures.
- Core HTTPS TLS-readiness expectation: service health checks must validate a real HTTPS handshake (`curl -k` with host SNI + IPv4 fallback target), not just open TCP `:443`, before probe cycles begin.
- Agent probe runtime expectation: containernet startup must validate Playwright+Chromium launch inside at least one agent container and fail-fast with a clear image-rebuild hint when package/browser versions drift.
- Agent probe module-resolution expectation: in-agent probe runtime should not depend solely on host-mounted `/workspace/node_modules`; image-provided fallback Playwright module path must be available for containernet agents.
- Host-seeding expectation: `/etc/hosts` seeding for service hostnames must run after agent inventory is populated; `preflight_hosts_entry_rate` should stay above 0 in provisioned containernet runs.
- Containernet probe resilience expectation: if DNS host lookup fails but HTTPS service is reachable via known service IP, probes should continue using IP fallback URL and still emit `network_preflight` diagnostics (do not hard-stop on non-fatal preflight warnings).
- Containernet IP-mode preflight expectation: in `ipv6-only` mode preflight HTTPS checks must force IPv6 (`curl -6`) and prefer IPv6 service fallback addresses; in `ipv4-only` mode they must force IPv4 (`curl -4`) so family-selection ambiguity does not create false infra failures.
- Containernet IP-mode probe URL expectation: in `ipv6-only`/`ipv4-only` stages, in-agent probe navigation should prefer a family-matching literal URL (`https://[ipv6]/...` or `https://ipv4/...`) when service host mappings are known.
- Containernet IPv6 readiness expectation: HTTPS service health readiness should include an explicit IPv6 handshake check (`curl -6`) when service IPv6 is configured, not only localhost/IPv4 checks.
- Containernet IPv6 mode-switch warmup expectation: applying `ip_mode=ipv6-only` to agents should warm gateway/service IPv6 path state (gateway ping and service curl best-effort) before probe cycles.
- Containernet IPv6 mode-switch convergence expectation: agents-only `ip_mode` transitions should set default family routes via verified route programming (same validation path as startup) instead of best-effort route shell writes.
- Containernet router IPv6 forwarding expectation: segment routers should set both global/default IPv6 forwarding and per-interface forwarding (`net.ipv6.conf.<lan>.forwarding=1`, `net.ipv6.conf.<wan>.forwarding=1`) to avoid interface-scope forwarding drift during long runs.
- Containernet IPv6 warmup tuning expectation: `CHAOSLAB_IPV6_WARMUP_TIMEOUT_S` and `CHAOSLAB_IPV6_WARMUP_STEP_MS` should control post-switch agent warmup retry window/cadence.
- Containernet IPv6 warmup safety expectation: neighbor flush during warmup should be opt-in (`CHAOSLAB_IPV6_WARMUP_FLUSH_NEIGH=1`) so default behavior preserves learned NDP state.
- Containernet L2 MAC-stability expectation: agent data-plane interfaces should have unique deterministic MAC addresses per agent to avoid segment bridge FDB flapping and one-agent-only reachability patterns.
- Containernet IPv6 neighbor-seeding expectation: startup and agents-scope `ip_mode` transitions should seed static IPv6 neighbors for agent<->router and router<->HTTPS paths to reduce per-agent `curl_rc=7/28` variance in `ipv6-only` stages.
- Containernet IP-mode safety expectation: `ip_mode` stage switches must not rely on `net.ipv6.conf.*.disable_ipv6` sysctl toggles; mode enforcement should stay in packet filters (`iptables`/`ip6tables`) to avoid destructive IPv6 state loss mid-run.
- Containernet host-forwarding expectation: chaos-lab startup should detect non-`ACCEPT` host `FORWARD` policy and apply temporary `FORWARD=ACCEPT` for `iptables`/`ip6tables` during containernet runtime, then restore previous host policies on shutdown.
- Containernet bridge-netfilter expectation: when host bridge sysctls are available, startup should temporarily set `net.bridge.bridge-nf-call-iptables=0` and `net.bridge.bridge-nf-call-ip6tables=0` during runtime and restore original values on shutdown.
- Containernet router-forwarding expectation: segment NAT routers should reset `FORWARD` chains and seed deterministic allow rules on startup so stale/inherited chain order cannot silently block routed IPv6 flows.
- Containernet IPv6 routing expectation: segment routers should not rely on NAT66; startup should remove stale IPv6 `POSTROUTING MASQUERADE` rules and keep IPv6 path routed/forwarded.
- Containernet IPv6 link-local expectation: interface IPv6 reset steps must preserve link-local addresses (`fe80::/64`) by flushing only `scope global` addresses; removing link-local addresses can destabilize ND/NDP and produce intermittent IPv6 preflight failures.
- Containernet preflight timeout/retry expectation: preflight curl checks should retry transient connect/timeouts (for example rc `7`/`28`) with configurable timeout/backoff using `CHAOSLAB_PREFLIGHT_CURL_MAX_TIME`, `CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS`, and `CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS`.
- Containernet probe classification expectation: when in-agent probe exits non-zero but still emits valid JSON payload, treat it as a functional probe failure (connection metrics) rather than an infra failure, as long as `network_preflight.ok` is true.
- Direct-path classification expectation: when libp2p connection multiaddrs remain relay-scoped, probe classification and stability sampling should still mark direct connectivity if selected WebRTC candidate pairs show active non-relay (`host/srflx/prflx`) paths; this avoids false `direct_connection_rate=0` and under-reported direct sample rates under successful hole-punching.
- NetViz probe URL expectation: when probe mode is `netviz`, missing URL query fields must be auto-filled with `room=telemetry`, `topologyId=netviz-topology`, `topologyType=distributed`, and `autoConnect=1`; otherwise probes can remain permanently disconnected (`localPeerId=null`) despite healthy preflight.
- NetViz asset freshness expectation: containernet probe runs targeting `https://demos.peercompute.test/netviz/` must ensure `docs/netviz` is refreshed from `demos/netviz` when source files change; stale docs bundles can hide new diagnostics fields and produce false gate failures.
- Relay bootstrap config expectation: containernet relay service must publish a local `wss` bootstrap multiaddr into `/workspace/docs/netviz/relay-config.json` (hosted by in-lab HTTPS service), so probe agents do not inherit stale external relay endpoints.
- Relay bootstrap family expectation: when relay public host is a hostname, generated `bootstrapPeers` should include both `/dns4/...` and `/dns6/...` variants so `ipv4-only` and `ipv6-only` stages can both bootstrap.
- Circuit bootstrap family-selection expectation: `NetworkManager` should prefer `/dns6/` or `/ip6/` bootstrap peers for circuit fallback when local IPv6 is available, and fall back to `/dns4/` or `/ip4/` when it is not.
- Focused unit gate for the above: `node --test peercompute/tests/unit/networkManager.webrtc.test.js`
- Relay ICE expectation: containernet relay-generated `relay-config.json` must include in-lab `webrtc.iceServers` that point at `turn.peercompute.test` (`stun:` + `turn:` URLs with test credentials), so WebRTC candidate gathering does not depend on external internet STUN.
- Mixed-content expectation: when probe pages are served over HTTPS, relay transport must be `wss` (not `ws`) or browser bootstrap can fail silently with `connectionState=connected` but `peerCount=0`.
- Probe WebRTC host-candidate expectation: headless Chromium probes should launch with mDNS host obfuscation disabled (`WebRtcHideLocalIpsWithMdns`) so same-segment direct-candidate behavior can be observed and scored in containernet runs.
- Containernet shell-output parsing expectation: command wrappers must strip terminal control sequences and reliably parse sentinel exit codes so DNS/hosts/curl preflight checks are not contaminated by PTY noise.
- Containernet preflight diagnostics expectation: route checks must preserve non-zero `ip route get` exit codes (no masking with `|| true`) so fallback path failures are actionable.
- Containernet endpoint-selection diagnostics expectation: preflight payloads should include curl-selected remote endpoint details (`curl_remote_ip`, `curl_remote_port`, and fallback equivalents) so IPv4-vs-IPv6 path selection can be validated from artifact logs.
- Containernet IPv6 failure-diagnostics expectation: failed `ipv6-only` preflight payloads should include per-agent snapshots of `ip -6 route show default`, `ip -6 route show`, `ip -6 neigh show`, `ip -6 rule show`, and `ip6tables -L FORWARD -n -v`.
- Containernet IPv6 failure-diagnostics expectation (extended): failed `ipv6-only` payloads should also include `agent_ip6_link`, `agent_ip6_addr`, `router_ip6_neigh_lan`, and `router_ipv6_forwarding`.

### NetViz manual diagnosis checklist
- Confirm `Announce addrs` include non-relay `/webrtc` addresses for direct dialing.
- Confirm `window.__NETVIZ__?.getStatus?.().addrs` is non-empty on prod and shows public relay circuit addresses rather than loopback or localhost.
- Check whether upgraded links are `webrtc` direct vs `relay-webrtc` (`/p2p-circuit/webrtc`).
- Confirm relay redial behavior after `remaining: 0` events.
- Capture at least one successful direct candidate pair from WebRTC stats.
- Verify Display toggles render as expected:
: `Show P2P=on, Show IP=off` -> only live libp2p topology is visible.
: `Show P2P=off, Show IP=on` -> only chaos-lab IP topology overlay is visible.
: both on -> merged overlay view with both topologies.
- Verify camera/navigation ergonomics:
: initial framing supports large overlay runs; max zoom-out can reveal full chaos-lab topology footprint.
- Verify inspector detail richness:
: clicking P2P nodes/edges shows connection mode, bandwidth/rates, and address-family hints.
: clicking IP-topology nodes/edges shows segment/NAT/link-profile metadata.
- Record findings and commands in `plan/log.md`.

### CubeChat startup overlay manual regression check
- Run `npm run dev:local-relay` (or `npm --prefix demos/cubechat run dev`) and open CubeChat on Safari/macOS plus iOS/iPadOS.
- Verify the initial welcome overlay dismisses on tap/click even when pointer lock is unavailable or denied.
- Verify first-start settings menu still appears once and gameplay remains usable after closing it.
- Verify desktop users can still re-enter pointer lock by clicking the canvas after the overlay is dismissed.
- Verify player cubes do not render a direction arrow helper above them.
- Verify the local player's cube shows their video feed on the rear-facing face (visible from the default behind-camera view).
- Verify remote players' cubes show video only on the front-facing face (not on the back face).

### CubeChat room-theme sync manual regression check
- In CubeChat settings, verify the `World -> Theme` dropdown includes `Tron`, `Moon`, `Beach`, `Desert`, `Jungle`, `Hyperborea`, and `Ireland`.
- Change `World -> Theme` across multiple options (at minimum `Tron`, `Moon`, `Beach`, `Ireland`, and `Hyperborea`).
- Verify the floor appearance and skybox update immediately on the local client.
- Move long distances in each theme and verify the skybox follows the player/camera position (no visible “reaching the edge of the sky dome” effect).
- Move far enough to trigger grid expansion and verify theme decor (rocks/trees/cows/walls) expands naturally without reshuffling previously seen nearby placements.
- Open two clients in the same area and verify overlapping theme decor placements match (seeded/procedural consistency).
- Verify `Moon` theme includes visible raised terrain variation with pronounced crater rims/ridges and scattered rock geometry.
- Move far enough in `Moon` to trigger grid expansion and verify crater/grain floor markings do not visibly slide/phase-shift relative to nearby terrain after expansion.
- Verify movement in `Moon` theme emits small dust puffs near moving players and stops when stationary.
- Verify landing after a jump in `Moon` emits a larger touchdown dust poof near the player.
- Verify `Beach`, `Desert`, `Jungle`, `Hyperborea`, and `Ireland` all show distinct floor textures/terrain shaping and skyboxes.
- Verify `Beach`, `Desert`, `Jungle`, and `Hyperborea` skybox horizon features (ocean/dunes-jagged mesas/jungle tree-line or hills/ice ridge skyline) are clearly visible above the horizon at normal camera pitch (not clipped to just tips).
- Verify `Jungle` includes dense, tall tree sprites with a canopy that visually covers the sky, and confirm tree trunks visually touch the terrain (no floating gap).
- Verify `Ireland` includes visible cow sprites placed on terrain and low stone-wall pasture dividers (about half player-cube height) across the field.
- Verify `Ireland` pasture walls run in both axis directions (forming squarish fields, not single-direction stripes) with noticeably larger pasture cells than earlier passes (about 4x spacing).
- Verify `Tron` theme skybox shows a neon synthwave sunset with outrun-style mountains/city silhouette, and confirm the city skyline plus most/all of the striped sun are visible above the horizon at normal camera pitch.
- Verify `Tron` theme emits a visible light-train trail behind moving players.
- Verify `Ireland` skybox clearly shows green rolling hills plus a single small distant castle silhouette on the skyline (readable at normal camera pitch), along with gray skies and intermittent rain bursts that start/stop over time.
- Open a second client in the same room and verify it receives the current theme (including late-join after a theme change).
- Verify remote players also show theme-specific movement effects (moon dust / Tron trail) while moving.
- Verify player cubes follow terrain contours in non-`Tron` themes (height conforms to terrain and cubes tilt to slopes rather than floating flat).
- Change theme from one client and verify the other clients in the same room update without changing rooms.
- Switch to a different room and verify the theme is room-scoped (defaults to `Tron` until changed in that room).
- Create/join a private room and verify the browser URL includes `room`, `privacy`, `password`, and `theme` query params.
- Open that URL in a second client and verify it lands in the same private room/theme without manual re-entry.
