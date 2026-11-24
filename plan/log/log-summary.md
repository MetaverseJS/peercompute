# Development summary

Concise reverse-chronological record of durable PeerCompute progress, decisions, and pivots. Detailed per-branch prompt logs live under `plan/log/detail/`.

> **Historical archive:** Pre-`vibe-plan` granular logs and test run logs are preserved in Git history at commit `c5c24a76` (`git show c5c24a76:plan/log.md` and `git show c5c24a76:plan/tests.md`).

## 2026-11-23

- **Migrated `plan/` to `vibe-plan` structure & cleaned repo hygiene (`feature/vibe-plan-and-repo-hygiene`):**
  - Replaced the `5.25 MB` monolithic `plan/log.md`, `618 KB` `plan/tests.md`, `390 KB` changelog-style `plan/plan.md`, and `plan/branch/` directory with `vibe-plan` (`plan/README.md`, user-owned `plan/plan.md`, `plan/arch/{best-practices,stack}.md`, `plan/arch/diagrams/`, `plan/todo/{priority.md,_template.md,done/,hiatus/}`, `plan/test/test.md`, `plan/workflow/{development,version-control}.md`, `plan/log/{log-summary.md,detail/}`).
  - Removed tracked stray debug/PID/binary artifacts (`.relay.pid`, `.webpack.pid`, `a.out`, `webpack.log`, `webrtc_internals_dump.txt`, `rtcstats_dump.gz`, stale duplicate `package-lock.json`s, legacy `peercompute/{deno.json,test-multiaddr.js,test-y-libp2p.js,test-automated.html,playwright-report/,test-results/}`, `demos/cubechat/sneakywoods.html`, 21 stale tracked `demos/*/docs/` files, and superseded `v0.3` ULG zip); moved `secretworkshop.net` nginx config to `config/nginx/secretworkshop.net`.
  - Published `peercompute@0.1.0-alpha.1` (`744.5 kB`, 214 files) and `exopute@0.1.0-alpha.1` (`1.8 kB`, 6 files, thin real wrapper in `packages/exopute/`) to `registry.npmjs.org` under `ubernaut` (`--access public --tag alpha`), matching newly acquired `exopute.{com,net,io,org}` domains without triggering a global repo rename yet.
- **Shipped all 4 ULG scale-ladder PeerCompute core extensions (`feat/ulg-scale-ladder-extensions` → `main` `c5c24a76`):**
  - Added slim `peercompute/core` and `peercompute/inference` entrypoints with `package.json` `exports` and zero-dep `runtime/extensionRegistry.js` (`0` `.wasm` files / `2.77 MiB` Vite core bundle vs `82.2 MiB` ONNX assets in full `index.js`).
  - Added epoch-fenced `SpatialTileLeaseBroker` over `ReservationLedger` + `StateManager` with opaque binary boundary summary admission.
  - Surfaced `network.iceServers`, fail-closed `network.iceTransportPolicy`, honest `classifyConnectionPath` (`direct-webrtc` / `turn-relay` / `ws-relay`), and fail-closed `NodeKernel` disconnect/reconnect hooks bound into `RemoteResultQuorumValidator`.
  - Added priority-aware warm worker lease affinity in `ChildWorkerLeaseManager`, `ComputeManager`, and `WorkerSupervisor` bounded by `ResourceLeaseBroker`.
  - Verified across all 17 demo Vite builds, headless Chromium smoke, live 2-browser P2P (`floodsub` & `gossipsub`), and 1,399/1,400 core unit tests.
- **NetViz root visibility, dual-role subgroup clarity & CubeChat model discovery fixes (`main` `62484e70` → `47b0cbfd`):**
  - Exposed `#analysis-panel` in Session view, added opt-in persistent root node discovery (`peercompute-root`), coalesced global `role === 'models'` peers into `models / default-room` cyan hex pillars, raised model-network connection limits (`16/8/16`), paced `PeerInferenceService.refresh()`, added CubeChat background `refreshModelPeers()`, and eliminated bare-`/webrtc` dial churn; published live to GitHub Pages.

## 2026-11-22

- **Production GitHub Pages release & `secretworkshop.net` Go relay cutover (`main` `dc509f73`):** tuned `gossipsub.Dhi = 32`, rebuilt all 17 demos + ExoWebTUI gallery (`717 MB` < `1 GB`), updated and restarted `peercompute-relay.service` on `secretworkshop.net`, and verified 25/25 live GitHub Pages routes + live 2-browser CubeChat/NetViz P2P.
- **Network scaling & conjecture breakthrough (`feature/network-scaling-netviz` Slices 1–5):** fixed `queryPeerDirectory` 5s stall, added real `RTCPeerConnection.getStats()` ICE-path classification, direct unicast `/peercompute/direct/1.0.0`, goal-conditioned `ThroughputTopologyPolicy` profiles, LAN/Pi relay kit (`scripts/lan-relay.mjs`), GossipSub scaling fixes breaking the 12-peer localhost ceiling (`81.7 tasks/s` 20-peer Chrome WebRTC, `3.40×` random), and Go relay parity.
- **ExoWebTUI gallery fused GLSL shader stack + Eshkols in Space & VibeSlopDB demos:** integrated `demos/eshkols-in-space/` (up to 2M WebGPU bodies via Barnes–Hut octree) and `demos/vibeslopdb/` (SQLite/PGlite/IDB SQL + multi-window ExoWebTUI host), fused the 5-pass CRT/VHS/phosphor shader stack to hit 60 FPS on RTX 5060 Ti, and fixed embedded iframe canvas clipping + mobile header overflow.

## 2026-11-21 & Earlier

- **Hardware capabilities subsystem (`feature/capabilities-detection`):** unified `probeCapabilities`, `requestManagedGpuDevice`, worker microbenchmark, `sizeWorkload`, and `RuntimeBudgetGovernor` with honest browser memory labels.
- **Conjecture first real-network experiment (`feature/conjecture-experiment`):** 20-peer Chrome WebRTC `topology: 'throughput'` + `WorkMesh` beat spatial topology 16/16 by `>= 1.6×`.
- **ULG G5 `ReservationLedger` CAS lifecycle, persistent Chromium `root-node/` model-evidence registry on `secretworkshop.net`, IPFS/UnixFS `ArtifactStore` & multimodal P2P inference (`transformers.js`, `wllama`, ONNX diffusion/mesh, SF3D, speech), and `EarthGrid` / `RoadVector` / `WXGlobe` geodata & 6-body physics platform.**
