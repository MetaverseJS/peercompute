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

## User Addendum - 2026-08-23 AKDT - Hemisphere Start, Steering, Scale, And Presence

This addendum supersedes the earlier RoadVector startup and remote-handoff
assumptions where they conflict:

- RoadVector opens in a separate north-up hemisphere overview centered on the
  permitted browser location. Startup may request browser location permission
  for this explicitly requested behavior; denial or an unavailable API uses the
  disclosed Anchorage fallback and never labels it as a device fix.
- The hemisphere uses one bounded NOAA ETOPO global relief request and a
  center-out official OSM Shortbread z5 5×5 window for regional motorway,
  trunk, and primary roads. It must disclose that the road overlay is regional,
  not complete hemisphere coverage. Physics stays paused until the user enters
  the independent local meter-scale scene.
- Real RoadVector peers use PeerCompute presence, not synthetic traffic. Only a
  coarse 0.1° cell from a permitted browser/manual location may be published;
  the automatic fallback is never published. Remote markers are fixed red,
  capped at 64, expire after 15 seconds, and disappear nonfatally on network
  failure.
- Normalized input remains rider-centric (`-1` left, `+1` right). The vehicle
  actuator converts that contract once into the rig's local hinge convention;
  desktop `A` turns left and `D` turns right, with matching lean direction.
- Local world data remains one unit per meter. The chase view uses a 60° FOV,
  a 4.8 m rear / 2.1 m up offset, and lighter metric fog. The forgiving 14 m ×
  7 m checkpoint crossing corridor is separate from the 8 m × 4.2 m visual
  portal. Wheel kinematics use the full rolling radius including tire radius.
- The verified user-selected remote handoff is direct Tailnet HTTPS at
  `https://100.68.165.52:5188/`, with same-origin API proxying and an
  environment-owned IP-SAN self-signed development certificate. It does not
  use Tailscale Serve, Funnel, or a public tunnel; the headset/browser must
  accept or trust the certificate.

The earlier requirement-audit row saying the handoff is blocked on Tailscale
Serve is historical and superseded by this direct private-IP mode. A physical
headset enter/exit/controller/hand/haptics/comfort/performance run remains a
manual NOT RUN gate until the user exercises this URL.

## User Addendum - 2026-08-24 AKDT - Cesium-First RoadVector Overview

This addendum supersedes the custom Three.js hemisphere implementation while
preserving the local ride contract:

- CesiumJS owns the WGS84 hemisphere, camera, terrain, contour material,
  official Shortbread road overlay, attribution, and coarse real-player
  markers. RoadVector ships the same release-relative Cesium workers, assets,
  Apache license, and third-party manifest as EarthGrid and WXGlobe.
- Three.js remains the only local ENU meter-scale motorcycle, traffic,
  building, race, particle/contact, and WebXR renderer. The mode transition is
  discrete; Cesium ECEF coordinates never enter the deterministic physics
  buffers.
- The Cesium loop is application-owned (`useDefaultRenderLoop:false`) and runs
  only in overview mode. Entering the ride hides/inerts the Cesium canvas;
  returning to the overview hides/inerts the Three canvas and clears pointer
  lock/held inputs. Location changes are rejected during an active XR session.
- NOAA ETOPO uses the shared capped heightmap provider with a fresh
  128-unique-tile session budget per selected location. Replacing a location
  aborts the prior terrain generation. The z5 Shortbread overlay remains an
  explicit center-out 5×5 allowlist with 1 MiB per tile, 8 MiB aggregate,
  100,000 rendered vertices, and motorway/trunk/primary-only filtering.
- RoadVector must report actual Cesium post-render frames, terrain/road budget
  telemetry, regional-not-global road coverage, fixed-red remote players, and
  the explicit WGS84-to-local-meter scale transition through its public state.
- Release gates require RoadVector Cesium runtime assets/notices, no root-only
  asset URLs, a nonblank rendered major-road fixture, terrain generation reset,
  imagery abort/disposal, polar/dateline tile bounds, and a built-browser smoke
  with physics still paused in overview mode.

The direct Tailnet HTTPS handoff remains
`https://100.68.165.52:5188/`; this architecture change does not introduce
Tailscale Serve, Funnel, or a public endpoint. Physical headset validation
remains a manual gate.

## User Addendum - 2026-08-24 AKDT - Official U.S. Highway Overview And Globe Start

- Add a clearly attributed official USDOT/FHWA nationwide highway layer to the
  Cesium overview, covering Alaska and the United States. It must be bounded,
  abortable, cache-aware, source-versioned, and explicit about whether its
  geometry represents the current National Highway System or an older National
  Highway Planning Network display product.
- Draw the federal/national network as a distinct bright category without
  replacing NOAA terrain, the bounded regional OSM context, or fixed-red live
  PeerCompute players.
- Let a user click the visible Cesium globe to choose a WGS84 start point.
  Picking must reject sky/non-globe clicks, preserve exact selection and
  generation ordering, start the bounded local terrain/road load, and enter
  the ride only after that load succeeds. A failed/no-road location remains a
  truthful overview error rather than leaving stale local geometry.
- Treat a Cesium click as an explicit user-selected location for the existing
  coarse 0.1-degree presence policy; do not publish automatic fallbacks.
- Keep the generic EarthGrid GIS app available separately over direct private
  Tailnet HTTPS on port `5187`, with its same-origin loopback geodata proxy and
  Cesium assets verified. Do not use Tailscale Serve, Funnel, or an in-terminal
  browser pane.
## 2026-08-24 RoadVector visual simplification addendum

- Keep the canonical local terrain, road, traffic, and motorcycle physics coordinate system at one world unit per meter. Do not hide visual scale problems by rescaling authoritative geometry.
- Render local terrain as a very low-opacity, non-authoritative display surface overlaid by bounded glowing contour curves generated with the Three.js NURBS curve implementation. Report the effective contour interval, source/control/sample counts, and any curve/vertex omissions.
- The normal motorcycle presentation is a minimalist line drawing: exactly two luminous NURBS wheel loops, a small bounded set of frame/fork/swingarm line segments, and a stick-figure rider with a line-and-loop silhouette. Dense rigid-component cages, collision particles, and contact markers are diagnostics, not default presentation.
- Preserve the six-body particle-rigid simulation, collision particles, joints, tire contacts, telemetry, reset/rebase behavior, and WebXR/desktop controls underneath the simplified visuals.
- Add deterministic renderer tests for transparent terrain material, finite/capped NURBS contour output, two wheel curves, line-only frame/rider output, default-hidden diagnostic geometry, interpolation, origin rebasing, resource disposal, and fresh built-browser rendering.

## 2026-08-24 Terrain-Safe Camera And Follow-Up Audit

- First-, third-, and WebXR views must never place an optical point below the
  exact rendered local terrain. The shared view rig accepts a reusable minimum
  view-height constraint; the RoadVector adapter samples original ENU terrain
  coordinates after undoing the current origin offset.
- The minimum optical clearance is 0.35 m. Queries outside the bounded local
  grid use its nearest edge; a non-finite exact triangle sample fails safe to
  the grid's maximum height. The constraint never lowers a view or changes its
  horizontal position.
- Third-person correction becomes the next damping state. Stereo XR evaluates
  every published eye offset and raises only `xrRoot` by the largest required
  correction; it never mutates the headset-controlled camera. Reset/rebase
  telemetry reports the constrained coordinate space.

### Follow-up requirement audit

| Requirement | Evidence | Status |
| --- | --- | --- |
| Current official Alaska/U.S. highway overview | USDOT/BTS FHWA NHS `2025.08.08`; DBF version/count verification; exact archive/member/tile hashes; 1,028 bounded tiles; live/private browser rendering | PASS |
| Click the globe to choose a ride | Cesium terrain/ellipsoid pick preserved exactly, same-coordinate generation ownership, generalized FHWA geometry excluded from the operational request, local-road fail-closed state, built browser click smoke | PASS |
| Transparent NURBS terrain | Exact degree-one NURBS contour paths over 3.5%-opacity mesh; hard 96-level/512-curve/60,000-vertex caps and omission telemetry | PASS |
| Minimal line motorcycle/rider | Two rational NURBS wheels, five frame strokes, six rider strokes; dense 123-particle rig hidden by default but physics-authoritative | PASS |
| Camera cannot enter terrain | First/third/stereo-XR unit coverage, rebase-safe exact triangle sampling, built and private-browser clearance telemetry | PASS |
| Generic GIS globe handoff | EarthGrid direct private HTTPS root/API/Cesium probes plus secure-context browser readiness at `https://100.68.165.52:5187/` | PASS |
| RoadVector headset handoff | Direct private HTTPS at `https://100.68.165.52:5188/`; secure context and app/runtime verified | PASS (service) |
| Physical WebXR hardware matrix | User headset run has not yet been performed | NOT RUN / no certification claim |

## User Addendum - 2026-08-24 AKDT - EarthGrid Water Surfaces

- Add bodies of water to the generic EarthGrid GIS demo through the existing
  official OpenStreetMap Shortbread imagery provider. Do not add a duplicate
  Overpass query, backend route, Cesium imagery layer, or bulk-prefetch path.
- Render `ocean` and non-glacier `water_polygons` before buildings and roads as
  fill-only blue `#0080ff` / `rgba(0, 128, 255, 0.5)`, with opacity exactly
  `0.5`. “Flat” means non-extruded, non-animated, non-glowing imagery draped on
  the authoritative terrain; it does not claim a constant-elevation physical
  water plane.
- Exclude `kind=glacier` and centerline-only `water_lines`. Polygonal wide
  rivers, lakes, reservoirs, basins, docks, canals, and oceans are in scope;
  narrow stream/ditch centerlines are not water surfaces in this tranche.
- Keep water opt-in at the shared provider boundary so RoadVector's bounded
  major-road overview remains road-only. Preserve one imagery layer normally
  and two only when a NOAA weather layer is enabled.
- Retain exact OSM/ODbL attribution and expose water source/style/count/vertex
  telemetry. EarthGrid hard-bounds each MVT to 2 MiB, its canvas LRU to 96
  tiles, and the provider session to 192 MiB / 4,000,000 rendered vertices;
  the aggregate counters are explicitly session-lifetime budgets.
- Deterministic gates must cover official layer validation, water-first draw
  order, even-odd polygon holes, glacier omission, no water stroke/shadow,
  exact 50% opacity, shared-provider opt-in isolation, one/two imagery counts,
  built-bundle markers, and live Anchorage ocean/inland-water decoding.
- Preserve the direct private HTTPS EarthGrid handoff at
  `https://100.68.165.52:5187/` with same-origin geodata and Cesium assets. Do
  not open an in-terminal browser or introduce Tailscale Serve/Funnel.
