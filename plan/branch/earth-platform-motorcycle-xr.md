# Earth Platform, Motorcycle, And WebXR Branch Contract

## Mission

Build four real, reusable deliverables rather than one coupled showcase:

1. a non-aviation Earth/GIS viewer that preserves WXGlobe's real terrain,
   bathymetry, weather context, black background, and bright parallel contour
   style while adding OpenStreetMap streets and buildings;
2. a generic bounded geodata backend that can support this and later
   location-based applications without becoming an unrestricted upstream
   proxy;
3. a first/third-person motorcycle game on real nearby roads with
   particle-cloud rigid components, traffic, desktop/mobile/WebXR control, and
   an honest deterministic physics boundary; and
4. reusable geospatial, particle-rigid vehicle, and WebXR input/UI packages.

The focused `demos/wxglobe` terrain proof remains supported. Shared modules are
extracted or wrapped without breaking its public runtime or its existing tests.

## Truth, Privacy, And Safety Boundaries

- Real terrain, weather, roads, buildings, source timestamps, licenses, and
  coverage limitations stay attributable and visible. A source being official
  does not make this a navigation, weather-warning, routing, or traffic service.
- The game road graph is derived from OpenStreetMap and is explicitly
  non-navigation-grade. Coordinate crossings are never treated as junctions;
  graph connectivity uses shared OSM node identifiers.
- Traffic is a deterministic game simulation over real road geometry. It must
  be labeled synthetic and never presented as live traffic.
- Browser geolocation is user-triggered, remains in memory, is quantized and
  expanded before backend requests, and is never written to logs, analytics,
  cache keys, or durable storage in exact form.
- Remote use requires HTTPS for geolocation and immersive WebXR. Permission
  denial gets a disclosed fallback location and never masquerades as a real
  user fix.
- Remote data failures are explicit unavailable/stale states. Fixtures are
  deterministic tests only and are never silent production fallbacks.

## Source And Rendering Contract

### Terrain

- Default whole-Earth terrain remains NOAA ETOPO 2022
  `ETOPO_2022_v1_60s_surface` through the proven signed-heightmap provider.
- Optional close-detail terrain remains the AWS public Terrarium composite,
  with its Web Mercator latitude limit and mixed ETOPO1 bathymetry disclosed.
- The canonical shared package is `packages/geo-core`. WXGlobe may temporarily
  re-export its existing modules during migration, but both demos ultimately
  consume one terrain/projection contract.
- Cesium Earth rendering keeps an opaque black globe and bright elevation
  contours. The motorcycle uses a local ENU meter frame and a Three.js terrain
  mesh sampled from the same provider contract; it never performs rigid-body
  physics in ECEF float coordinates.

### OpenStreetMap

- Global display context uses the official OSM Shortbread vector TileJSON at
  `https://vector.openstreetmap.org/shortbread_v1/tilejson.json`, honoring its
  zoom, caching, Referer, attribution, and usage policy. Browser-side tiles are
  decoded with current supported MVT/PBF libraries and rendered as transparent
  bright road/building overlays.
- Local 3D/game data uses bounded raw Overpass JSON through `services/geodata`.
  Production configuration requires a controlled/self-hosted compatible
  endpoint; the public main instance is an explicit low-volume demo/developer
  fallback, not a production SLA.
- The normalized region preserves source way/relation/node IDs, ordered nodes,
  raw tags, base timestamp, access/oneway/surface/layer/bridge/tunnel/lanes/
  speed semantics, multipolygon topology, building parts, and height
  provenance. Building height precedence is source `height`, then
  `building:levels * 3 m`, then a labeled/clamped category default.
- Every visible and serialized result carries `© OpenStreetMap contributors`,
  the ODbL link, a derived-database notice, and a non-navigation disclaimer.

### Weather

- Weather display is sourced from fixed official NOAA descriptors. The first
  tranche uses nowCOAST WMS capabilities/layer-time metadata directly from the
  browser; the backend catalog describes source, layer, coverage, cadence,
  access mode, and attribution and does not proxy pixels.
- Weather imagery is optional and time-qualified. It cannot make the core Earth
  or game runtime fail. Missing/expired capabilities remain visibly
  unavailable; no fixture or old frame is called current.

## Generic Backend Contract

`services/geodata` is a standalone Fastify service on port `8788` with strict
Zod validation, exact-origin CORS, rate limiting, response compression, fixed
upstream origins, bounded redirects/body/content types, subscriber-safe aborts,
global concurrency control, coalesced TTL/LRU caching, ETags, and secret-free
public errors.

### Endpoints

- `GET /healthz`: process/version/readiness/source capabilities/cache counts;
  never includes secrets, exact user coordinates, or raw internal exceptions.
- `GET /api/v1/catalog`: terrain, Shortbread, local OSM adapter, and nowCOAST
  descriptors with URLs, access mode, cadence, license, attribution, coverage,
  configured state, and transport authority.
- `GET /api/v1/geo/osm?bbox=s,w,n,e&layers=roads,buildings&vehicle=motorcycle`:
  one normalized, cacheable region envelope containing road and building
  FeatureCollections plus the exact directed road graph and source/provenance
  metadata.

### Resource Bounds

- Reject dateline-spanning v1 bboxes and any axis over 8 km or area over
  64 km². EarthGrid and RoadVector use a fixed 1,200/800/500 m radius ladder
  and narrow only on declared density or verified-response-size errors.
- Upstream Overpass query timeout is 20 seconds and whole-call timeout is 25
  seconds; raw response is at most 8 MiB.
- Hard maxima are 5,000 road ways, 5,000 buildings, 50,000 unique nodes, and
  100,000 directed graph edges. Exceeding a bound fails with a smaller-region
  instruction; it never silently truncates a drive graph.
- At most two Overpass upstream calls run concurrently. Identical requests
  coalesce. Cache holds at most 128 expanded region keys, is fresh for six
  hours, and may serve a visibly stale previously verified entry for at most
  seven days after an upstream failure.
- Cache/log keys use outward-snapped regions and query hashes, never raw user
  coordinates. Public region responses use strong ETags and conservative
  cache-control.

## Particle-Rigid Physics Contract

The useful Dynamics idea is retained: each rigid component owns a pose,
inertia, and body-local cloud of collision/mass particles. The existing MPM
domain, TODO `PhysicsEngine`, and current Dynamics `World` are not production
motorcycle solvers.

The reusable package exposes a CPU-authoritative fixed-step world:

```js
createParticleRigidWorld({ fixedDt: 1 / 120, solverIterations: 12 })
world.addBody({ id, motionType, position, orientation, mass, particleCloud, material, groups })
world.addJoint({ type, bodyA, bodyB, anchors, axes, limits, compliance, damping, motor })
world.addSurfaceCollider({ sampleSphere, sweepSphere })
world.applyForce(bodyId, force)
world.applyTorque(bodyId, torque)
world.applyForceAtPoint(bodyId, force, point)
world.stepFrame(frameDt, controlFrame)
world.getInterpolatedTransforms(alpha)
world.getSnapshot()
world.reset(snapshot)
world.dispose()
```

- The canonical CPU backend uses `Float32Array`, `Math.fround`, fixed 1/120 s
  steps, stable IDs/contact ordering, a deterministic spatial hash, fixed
  iteration counts, bounded accumulator time, and surfaced overflow.
- Per step: apply controls/forces; integrate velocity with the gyroscopic term;
  predict poses; run swept sphere/static and particle broadphase; apply cubic
  pre-contact plus unilateral contact; solve joints; apply bounded Coulomb/tire
  impulses; commit; publish diagnostics.
- An optional WebGPU backend may share packed 16-byte-aligned schemas and phase
  order, but remains non-authoritative until short-horizon CPU/GPU parity and
  device-loss snapshot fallback pass. GPU atomics are not called deterministic.

The motorcycle has six rigid particle-cloud components: chassis/rider cage,
rear swingarm, rear wheel ring, upper fork/handlebars, lower telescoping fork,
and front wheel ring. Hinge, spring/damper, steering, prismatic, axle, engine,
and brake constraints act through forces/impulses. Tire ring contacts derive
normal load, longitudinal slip, lateral slip, and a combined friction ellipse.
Lean assist is an optional bounded torque controller, never a pose overwrite.

## Unified Input And WebXR Contract

Physics consumes one device-independent control frame:

```js
{
  sequence,
  steer,
  throttle,
  frontBrake,
  rearBrake,
  clutch,
  shiftDelta,
  handbrake,
  reset,
  cameraToggle,
  recenter
}
```

Keyboard/pointer, mobile multi-touch, gamepad, and WebXR adapters live outside
physics. The reusable XR package:

- owns actual enter/exit session lifecycle and restores non-XR camera/control
  state;
- maps `xr-standard` buttons/axes by handedness and role rather than controller
  index, snapshots live Gamepad state before edge detection, and clears held
  actions on input removal or session end;
- distinguishes target-ray controllers from grip-space models, uses the
  official Three controller-model addon, and supports hand-tracking input when
  available without requiring it;
- provides ray/poke/focus UI interaction over reusable panel/button/slider
  primitives. Three's `InteractiveGroup`/`HTMLMesh` may bridge accessible DOM
  controls, but a rendered in-scene fallback remains available;
- treats DOM overlay as optional and feature-detected. `layers` remains opt-in
  until a real headset gate proves it does not reproduce the existing black-
  canvas exit issue;
- reports capability/session/input/action state and exposes explicit cleanup.

## Motorcycle World And Rendering

- Geolocation selects a quantized OSM region, then the game builds a local ENU
  frame, terrain mesh, road ribbon/graph, buildings, and deterministic traffic.
- Terrain is black with bright parallel contour rings. Roads, buildings,
  player bike, traffic classes, contact particles, and checkpoints use
  distinct high-luminance world colors; warnings use the terminal HUD's
  yellow/error states rather than invented map geometry. Time-qualified nowCOAST weather
  remains an EarthGrid-only display layer in this tranche; RoadVector makes no
  weather or road-condition claim and does not project raster weather into its
  local Three scene.
- First-person camera follows the rider/head frame; third-person camera uses a
  damped chase rig. WebXR uses tracked head pose while the vehicle remains in
  the same physical simulation.
- Traffic follows real graph connectivity and obeys game lane/oneway rules. It
  uses particle-cloud collision bodies, seeded spawn/routes, bounded density,
  and synthetic status/provenance.
- Origin rebases are deterministic events and shift world, physics, traffic,
  cameras, and telemetry together without changing relative state.

## Release And Completion Gates

- Preserve all existing WXGlobe terrain tests and runtime behavior.
- Unit-test bbox/projection/source envelopes, cache/fetch bounds, OSM topology,
  building normalization, terrain/MVT/weather descriptors, particle inertia,
  contacts/joints/tire forces, deterministic replay, input edge/held behavior,
  XR lifecycle, and cleanup.
- Browser-test Earth real-data and deterministic fixture modes, visible
  attribution, geolocation permission/denial, source failure/staleness, and no
  stale-scope rendering.
- Browser-test motorcycle desktop/mobile controls, cameras, particle rig,
  traffic collision, road placement, reset/rebase, telemetry, and stale async
  request suppression.
- WebXR automated tests use mocked sessions/input sources; a real headset is a
  separate manual gate. Remote geolocation/WebXR previews must be HTTPS.
- Production builds output `docs/earth` and `docs/motorcycle`, ship licenses,
  work beneath nested paths, and are linked from the gallery. Backend/live
  source smoke is opt-in and bounded; ordinary CI uses committed fixtures.
- Completion requires a requirement-by-requirement audit of the actual
  runtime, not merely green unit tests or a visually plausible page.

## Requirement Audit - 2026-08-23 AKDT

| Requirement | Actual evidence | Status |
| --- | --- | --- |
| Reusable generic GIS/backend foundation | `packages/geo-core` plus bounded `services/geodata`; canonical catalog, exact-origin CORS, resource caps, cache/coalescing, source/license/freshness envelopes, and verified production same-origin selection; geo-core `23/23`, geodata `44/44` | PASS |
| Preserve WXGlobe | Compatibility re-exports, WXGlobe `26/26`, fresh `docs/wxglobe`, and built runtime smoke in the aggregate release command | PASS |
| EarthGrid real-data viewer | NOAA/AWS terrain, Shortbread context, local OSM roads/buildings, cadence-qualified nowCOAST, geolocation/fallback, provenance; Earth `27/27`, built and live gates | PASS |
| Particle motorcycle physics | Six components, joints/suspension, gyro, tire/surface grip, swept translational/rotational CCD, deterministic snapshots at 120 Hz/12 iterations; physics `32/32` | PASS |
| RoadVector race/game | Real directed OSM graph, deterministic gates/laps/timing, 14 synthetic lane/restriction-aware physical traffic cages, collision impulse, rebase and boundary handling; RoadVector `44/44` | PASS |
| Reusable input/WebXR | Application-defined action schema, desktop/mobile/gamepad/XR sources, controller/hand lifecycle, haptics, view rig, spatial terminal UI and cleanup; XR `21/21` plus mocked Chromium | PASS (automated) |
| Browser behavior | Combined fresh built smoke proves WXGlobe, EarthGrid, RoadVector, attribution, permission success/denial, density narrowing, failure/stale recovery, controls, collision, telemetry, reset and rebase | PASS |
| Live contracts | Opt-in bounded Shortbread, tiny Overpass, nowCOAST, ETOPO and Terrarium probe passed with exact current evidence recorded in `plan/tests.md` | PASS |
| Production artifacts/docs | Nested builds, Cesium notices, gallery/dev/port/release wiring, current real-source screenshots, root and demo README coverage; static release `44/44` | PASS |
| Weather scope | Time-qualified raster weather is an EarthGrid display layer only. RoadVector makes no weather/road-condition claim and remains playable if optional Earth weather is unavailable | PASS (scoped clarification) |
| Real physical headset | Mocked browser exercises actual Three ray/mesh transforms while faking XR system/session boundaries; no physical headset was available for the manual matrix | NOT RUN / no certification claim |
| Remote secure handoff | Verified loopback RoadVector HTTPS plus same-origin geodata candidate; Tailnet Serve is not enabled and therefore no reachable trusted URL exists yet | BLOCKED BY TAILSCALE ADMIN ENABLEMENT |

The implementation and deterministic/live software gates are complete. The
manual physical-headset matrix and Tailnet HTTPS publication remain explicit
external handoff items; neither is silently counted as a pass.
