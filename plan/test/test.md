# Test strategy

Project-wide verification expectations for PeerCompute. Task-specific acceptance checks belong in each task file under `plan/todo/`.

## Completion standard

Before any coherent clean commit or merge to `main`:
1. Run the most focused unit/integration suites covering every touched module.
2. When core library exports, networking, state, or scheduling change, verify:
   - `peercompute/tests/unit/coreEntrypoint.test.js` (zero inference/WASM import edges from `peercompute/core` + `package.json` exports)
   - `peercompute/tests/unit/workspaceBoundary.test.js` (zero reverse imports `peercompute/` → `demos/`, zero inference/WASM imports from non-inference demos)
   - Full `npm --prefix peercompute run test:unit` (note: pre-existing external staged-ULG fixture at `serviceOrchestration.test.js:4095` is tracked separately; zero new regressions allowed)
   - `npm run test:network-telemetry`, `npm run test:inference`, `npm run test:peer-inference`
   - `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/gallery-guides.test.mjs`
3. When demos, gallery, or public release assets change, build affected demos (isolated temp `outDir` when verifying without touching `docs/`, or `npm run build:all` for a Pages release) and run headless Chromium runtime smoke + live 2-browser P2P (`demos/tests/runtime-p2p.mjs`).
4. Shut down all test servers, relays, and headless browsers cleanly before finishing.

## Test levels

- **Core unit & isolation tests (`node:test`):**
  - `npm --prefix peercompute run test:unit`
  - `node --test peercompute/tests/unit/workspaceBoundary.test.js peercompute/tests/unit/coreEntrypoint.test.js`
  - `node --test packages/exopute/tests/exopute.test.js`
  - `npm run test:capabilities`, `npm run test:artifacts`, `npm run test:network-telemetry`, `npm run test:inference`, `npm run test:peer-inference`, `npm run test:diffusion`, `npm run test:gguf`, `npm run test:agent-layer`, `npm run test:model-library`, `npm run test:root-host`
- **Demo & platform unit suites:**
  - `npm run test:earth`, `npm run test:eshkols-in-space`, `npm run test:motorcycle`, `npm run test:multiscale`, `npm run test:planetgen`, `npm run test:schrodinger`, `npm run test:vibeslopdb`, `npm run test:wxglobe`, `node --test demos/netviz/tests/*.test.js`
  - `npm run test:geo-core`, `npm run test:geodata`, `npm run test:physics`, `npm run test:traffic`, `npm run test:xr`, `npm run test:global-chat`, `npm run test:inference:ui`
  - `node --test demos/tests/model-compatibility-help.test.js demos/tests/room-directory.test.js demos/tests/pages-shared-runtime.test.js demos/tests/pages-release-assets.test.mjs demos/tests/pages-isolation.test.mjs demos/tests/gallery-guides.test.mjs`
- **Release & packaging checks:**
  - `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/backend-server.test.js demos/tests/gallery-guides.test.mjs`
  - `npm --prefix peercompute pack --dry-run` and `npm --prefix packages/exopute pack --dry-run`
  - Go relay: `cd peercompute/src/relay-go && go test -v ./... && CGO_ENABLED=0 go build`
- **Headless Chromium & live P2P verification:**
  - `CHROME_BIN=/usr/bin/google-chrome node --test demos/tests/gallery-browser.mjs`
  - `CHROME_BIN=/usr/bin/google-chrome node demos/netviz/tests/analysisBrowserCheck.mjs`
  - `CHROME_BIN=/usr/bin/google-chrome node demos/eshkols-in-space/scripts/browser-check.mjs`
  - `CHROME_BIN=/usr/bin/google-chrome node --test demos/tests/world-agent-host.test.js demos/tests/cubechat-native-ui.test.js`
  - `CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome node demos/tests/runtime-smoke.mjs`
  - `CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome node demos/tests/runtime-p2p.mjs` (both default `floodsub` and `RELAY_PUBSUB=gossipsub`)
  - `npm run lan:self-test`
  - `PAGES_BASE_URL=https://metaversejs.github.io/peercompute/ node demos/tests/pages-runtime.mjs` (post-deploy Pages gate)

## Special environments & constraints

- **Node.js 24 LTS** required (`nvm use 24` if drifted).
- **Headless browser automation only:** use Playwright + `/usr/bin/google-chrome` (`CHROME_BIN=/usr/bin/google-chrome`). Never invoke `terminal-browser` or open an in-terminal split.
- **Hardware WebGPU vs SwiftShader:** `webgpuphys` rejects fallback software adapters per capability policy and requires native Vulkan WebGPU (`--enable-unsafe-webgpu --enable-gpu --enable-features=Vulkan,VulkanFromANGLE --use-angle=vulkan --use-vulkan=native --disable-vulkan-surface`).
- **COOP/COEP isolation:** demos using `SharedArrayBuffer`/WASM threads (`inference`, `vibeslopdb`, `earth`, `cubechat`) require either `http://127.0.0.1` with COOP/COEP headers or trusted TLS (self-signed HTTPS rejects ServiceWorkers).
- **Chaos lab (`net-chaos-lab`):** run only when explicitly requested.
- **Historical test archive:** granular pre-`vibe-plan` test run logs are preserved in Git history at `git show c5c24a76:plan/tests.md`.
