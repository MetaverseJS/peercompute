# ULG Demo Regression Report - 2026-06-18

Prompt time: 2026-06-18 10:35:03 AKDT

## Scope
- Branch: `multi-scale-physics-sim`.
- Runtime: Node `v24.17.0`, npm `11.13.0`.
- Target ULG server: pre-existing HTTPS Vite server at `https://127.0.0.1:5173/`.
- Local ICE/TURN coverage: test-owned coturn on `127.0.0.1:34790` with STUN plus TURN UDP/TCP credentials `peer` / `compute`.
- Relay coverage: dynamic local PeerCompute Go relays started by the browser P2P and Multiscale relay tests, with relay config injected from the local coturn ICE config.

## Regressions Found

### DaddyGo P2P fails after the full demo matrix
- Command:
  `env RELAY_CONFIG_TIMEOUT_MS=60000 RELAY_WEBRTC_CONFIG='<local coturn ICE JSON>' npm run test:runtime:p2p`
- Result: failed in the DaddyGo step after CubeChat, Hyperborea, and SneakyWoods had already run.
- Main error:
  `DaddyGo P2P wait failed: page.waitForFunction: Timeout 30000ms exceeded`
- Longer timeout result:
  `RUNTIME_P2P_DEMOS=cubechat,hyperborea,sneakywoods,daddygo DEMO_TIMEOUT_MS=90000 ... npm run test:runtime:p2p` still failed in DaddyGo.
- Narrow repro:
  `RUNTIME_P2P_DEMOS=daddygo DEMO_TIMEOUT_MS=90000 ... npm run test:runtime:p2p` passed.
- Two-demo repro:
  `RUNTIME_P2P_DEMOS=sneakywoods,daddygo DEMO_TIMEOUT_MS=90000 ... npm run test:runtime:p2p` passed.
- Evidence: failing run showed repeated DaddyGo page logs for unknown `yjs-sync-request` / `yjs-sync-response` message types, a direct dial failure with `No transport available for address /p2p/<peer>`, and a relay WebRTC dial timeout on a `/p2p-circuit/webrtc` address.
- Assessment: DaddyGo is not broken in isolation, but the ordered multi-demo P2P matrix exposes a churn/settlement/state-sync problem before the DaddyGo score sync condition becomes true.

### Direct ULG browser handoff no longer reaches handoff-ready
- Commands:
  `env ULG_HANDOFF_URL=https://127.0.0.1:5173/ npm --prefix demos/multiscale run test:ulg-handoff`
  and
  `env ULG_HANDOFF_URL=https://127.0.0.1:5173/ ULG_HANDOFF_TIMEOUT_MS=120000 npm --prefix demos/multiscale run test:ulg-handoff`
- Result: both failed waiting for Multiscale handoff readiness after the ULG page clicked `Launch Magnetar`.
- Error:
  `page.waitForFunction: Timeout 120000ms exceeded at demos/multiscale/tests/ulgBrowserHandoffSmoke.mjs:580`
- The timeout is on:
  `window.__multiscaleDemo?.getScenarioHandoffReadiness?.()?.status === 'handoff-ready'`
- Assessment: ULG artifacts are valid enough for the pre-launch ULG artifact probes, but the direct ULG-launched Multiscale popup never reaches `handoff-ready`. The relay-backed service-envelope path passed, so this appears specific to the direct browser popup handoff path.

### Multiscale molecular append loses the NaCl pair in packet state
- Command:
  `npm --prefix demos/multiscale run test:visual`
- Result: failed after the Na/Cl live append check.
- Error:
  `Error: Molecular append API did not propagate NaCl pair to packet state`
- Diagnostics: the smoke saw `atomCount: 17` and `bondCount: 10`, while the test expects the appended NaCl pair to produce `Na:1`, `Cl:1`, and `bondCount >= 11`.
- Assessment: Na and Cl survive compositionally, but the reduced MD append/bond propagation does not classify or publish the NaCl ionic pair into packet state. This is a direct regression in the molecular live append path.

### Built docs Multiscale visual smoke also timed out on the quantum readout
- Command:
  `env MULTISCALE_SMOKE_URL=https://127.0.0.1:4173/multiscale/ npm --prefix demos/multiscale run test:visual`
- Result: failed waiting for the layer readout to include `quantum basis`, `quantum worker`, and finite-grid evidence.
- Assessment: the dev-server visual smoke reached the later NaCl failure, so the docs timeout is likely an additional built-bundle/readout-settlement issue rather than the only visual-smoke failure.

### Multiscale live remote placement fails validation after relay discovery
- Command:
  `env RELAY_CONFIG_TIMEOUT_MS=60000 RELAY_WEBRTC_CONFIG='<local coturn ICE JSON>' npm --prefix demos/multiscale run test:remote-placement`
- Result: failed after four Multiscale browser peers exchanged relay discovery.
- Error:
  `Runtime remote policy wait failed: page.waitForFunction: Timeout 45000ms exceeded.`
- Diagnostics:
  `policy.ok=true`, `remotePlacementDispatchReady=true`, `remotePlacementReason="ready"`, `promoted=["cosmologyExpansion"]`, `remoteRequested=5`, `remoteExecuted=0`, `remoteFailed=4`, `remoteValidationFailed=4`.
- Last remote-placement error:
  `validation-failed`, `Remote placement result validation failed for remote-peer: quorum-mismatch`
- Assessment: peer discovery and policy promotion work, but remote execution/admission fails the quorum validation path.

### Multiscale performance probe is passing but too slow
- Command:
  `npm --prefix demos/multiscale run test:perf`
- Result: passed, but the measured frame cadence is poor.
- Metrics: `sampleCount=26`, `average=233.323ms`, `fpsAverage=4.29`, `p50=216.7ms`, `p95=283.2ms`, `p99/max=583.3ms`; every sampled frame exceeded 16.67 ms, 33 ms, 50 ms, and 100 ms.
- Browser warnings included WebGL `ReadPixels` stalls.
- Assessment: not a test failure, but the current Multiscale demo is far below interactive frame rate in this environment.

## Passing Coverage
- `npm --prefix peercompute run test:unit`: passed `187/187`.
- `npm run test:backend`: passed `20/20`.
- `npm --prefix demos/planetgen test`: passed all PlanetGen unit tests.
- `npm --prefix demos/multiscale test`: passed `203/203`.
- `npm --prefix demos/schrodinger test`: passed `20/20`.
- `npm --prefix net-chaos-lab run test:behavior`: passed `13/13`.
- `npm run build:all`: passed. Notable warnings were the known PeerCompute webpack circular chunk warning, bundle-size warnings, PlanetGen `WebGL1Renderer` import warning, and large Vite chunk warnings.
- Root runtime docs smoke from `npm run test:runtime`: passed the non-P2P browser load half for Hyperborea, CubeChat, SneakyWoods, DaddyGo, PlanetGen, Universes, Fano Reactor, and WebGpuPhys.
- `env RELAY_CONFIG_TIMEOUT_MS=60000 RELAY_WEBRTC_CONFIG='<local coturn ICE JSON>' npm run test:runtime:p2p`: passed CubeChat, Hyperborea, and SneakyWoods before the DaddyGo sequence failure.
- NetViz session smoke passed after starting a local docs Vite server:
  `npm --prefix demos/netviz run test:session`.
- ULG relay handoff passed:
  `env ULG_HANDOFF_URL=https://127.0.0.1:5173/ ULG_RELAY_HANDOFF_TIMEOUT_MS=180000 RELAY_CONFIG_TIMEOUT_MS=60000 ULG_RELAY_HANDOFF_RUN_DISPATCH=1 ULG_RELAY_HANDOFF_WEBRTC_CONFIG='<local coturn ICE JSON>' npm --prefix demos/multiscale run test:ulg-relay-handoff`.
- ULG relay handoff evidence included `handoff-ready`, `blockerCount=0`, `simulationStatus="scientific-ready"`, two connected Multiscale peers, service envelope ready, dispatch plan/adapters ready, `acceptedDispatchCount=2`, full-physics compatibility status `runtime-evidence-compatible-pending-full-physics-validation`, `runtimeEvidenceCompatible=true`, and final full-physics readiness still false.
- Extra PeerCompute runtime/unit checks passed:
  `node --test peercompute/tests/computeManager.unit.test.js peercompute/tests/stateManager.unit.test.js peercompute/tests/runtime/gossipsub-mesh.test.js`
  and
  `node peercompute/tests/runtime/webrtc-config.smoke.js`.
- WebGpuPhys browser smokes passed after the test harness was adjusted to use a system Chrome executable when the matching Playwright managed browser is absent:
  `npm --prefix demos/webgpuphys run test:headless`,
  `npm --prefix demos/webgpuphys run test:ppf`,
  and
  `npm --prefix demos/webgpuphys run test:ppf-contact`.

## Harness Change Made During This Sweep
- Files:
  `demos/webgpuphys/tests/headless-runtime.js`,
  `demos/webgpuphys/tests/ppf-runtime.js`,
  `demos/webgpuphys/tests/ppf-contact-runtime.js`.
- Change: the tests now honor `CHROME_BIN`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, or `CHROME_EXECUTABLE_PATH`, and fall back to `/bin/google-chrome` when present.
- Reason: the local Playwright managed `chromium_headless_shell-1200` was absent/incomplete, and `npx playwright install chromium-headless-shell` hung after a partial extraction. The partial cache was removed after testing.

## Blocked Or Not Run
- `npm --prefix peercompute run test:auto`, `npm --prefix peercompute test`, and `npm --prefix peercompute run test:direct-path` were not run because the PeerCompute dev/test harness is fixed to `http://localhost:5173`, and that port was occupied by the pre-existing ULG HTTPS Vite server being validated. Killing or replacing that server would have invalidated the ULG handoff target.
- `peercompute` LAN agent/controller tests require a paired controller/agent setup and were not appropriate for this single-host sweep.

## Cleanup
- Test-owned coturn on `127.0.0.1:34790` was stopped.
- Test-owned docs Vite server on `127.0.0.1:4173` was stopped.
- Test-owned Multiscale Vite server on `127.0.0.1:5185` was stopped.
- Dynamic local Go relay processes launched by the runtime tests were cleaned up by the test harnesses.
- Generated docs build output and generated relay config sources were restored/removed after the report capture so the repository diff only contains the intentional harness and plan/report changes.

## Notes
- The test coturn relay used a narrow relay port range `50080-50100`. During cleanup it emitted `create_relay_ioa_sockets: no available ports 3`, indicating the stress run exhausted the tiny relay allocation range. That is useful pressure evidence, but for longer soak testing the range should be widened to avoid conflating relay capacity with demo failures.
