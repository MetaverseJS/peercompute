# EarthGrid inhabited-agent integration

## Instructions

Keep the GIS source/geometry contracts and local-only source caches intact.
Persistent agent identity, permissions, inference routing and networking belong
to the shared PeerCompute agent host, not to an Earth-specific second runtime.
Record source changes and verification results here and in the root task log.

## November 6 2026 — bounded world adapter

- Add `src/agents/EarthAgentLayer.js` with a lazy, independently named Cesium data
  source and a maximum of 64 public body descriptors. Bodies have a georeferenced
  cube, globe-scale point marker and bounded name/status/caption labels.
- Store adapter positions as `[longitudeDegrees, latitudeDegrees, heightMeters]`.
  Prefer the center-view terrain pick; fall back to resident terrain or zero,
  never the camera's orbital altitude. The height is a visualization surface
  coordinate, not a surveyed vertical datum.
- Select only actual entities belonging to this layer. The host opens the
  conversation and owns local/remote authorization. Focus flies near the body;
  audio poses use camera-relative ECEF metres with world-space direction/up.
- Replace the old floating model-console launcher in `src/main.js` with
  `installWorldAgents` for `earthgrid:global`. Continue passing the existing
  StateManager for private artifacts/agent records; keep its GIS cache network
  provider and broadcast disabled. The shared host separately owns any explicit
  peer network connection.
- Await host disposal before storage/viewer cleanup. Expose explicit awaited
  `__earthDemo.dispose()` and separate `getState().agents` telemetry. Browser
  page termination remains best-effort; no unattended persistence claim.

## Verification

- `node --test demos/earth/tests/agentLayer.test.mjs`: six tests passed for actual
  Cesium entity geometry, lazy source ownership, position/appearance bounds,
  terrain fallback, picking, focus/audio/context and late-install cleanup.
- `node --test demos/tests/earth-agent-browser.test.mjs`: software-WebGL fixture
  checks actual globe-scale marker picking, nearby body focus and disposal,
  with no external requests or models. Initial pass exposed an over-broad Vite
  dependency scan of unrelated demos; the fixture now disables discovery and
  explicitly prebundles only Cesium. Final rerun PASS 1/1 (9.8 seconds), including
  a public WebGL renderer check confirming SwiftShader, with no external
  requests or page errors and all owned browser/server/cache resources closed.
- `npm --prefix demos/earth test`: PASS 54/54 (1.36 seconds). Main-module syntax
  and scoped `git diff --check` also pass. No GIS source/geometry regression was
  found by the existing suite.
- Shared-host production/browser integration remains a completion gate; shared
  speech and remote-authority evidence is owned by the overall task, not inferred
  from the renderer fixture.

## Final shared integration checks

- Public descriptor alignment adds paused state and bounded240-byte names;
  the focused Earth adapter suite now has7 passing cases.
- The complete production scene passes actual selectable bodies, close/reload
  identity persistence, desktop/mobile visuals and trusted HTTPS5187 connection
  to SecretWorkshop over `/noise`, with zero page/console errors or model
  downloads. Live terrain renders; the existing local geodata backend remains
  unconfigured in this preview.
- Shared core qualification separately proves actual managed peer replies,
  private visitor histories and simultaneous reasoning/ASR/TTS workers with
  spatial PCM playback. This is shared-host/CubeAgentLayer fixture evidence,
  not a claim that a recorded voice conversation ran in the full Earth scene.
- Combined `npm run test:world-agents`:70/70 PASS. Existing regression slice:
  79/79 PASS. Stationary embodiment only; Earth navigation will need local ENU
  metres and terrain/slope/collision checks as documented in the root plan.
