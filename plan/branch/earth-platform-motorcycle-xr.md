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

## User Addendum - 2026-08-24 AKDT - NURBS Shorelines And Submerged Contours

- Outline every valid `ocean` and non-glacier `water_polygons` ring with an
  exact bright-blue `#24cfff` NURBS path. Use unit-weight degree-one,
  open-clamped fragments so the displayed boundary has zero source-coordinate
  deviation; holes and multipart bodies remain independent paths.
- Do not draw synthetic MVT clipping edges. Suppress segments whose endpoints
  share one tile/outside boundary, split the remaining shoreline into open
  butt-capped fragments, and keep fully clipped tile boxes outline-free.
- Never downsample or partially omit a body. Reject invalid or over-cap tiles
  before canvas mutation; hard bounds are 4,096 rings, 8,192 curve fragments,
  65,536 source points, and 131,072 sampled vertices per tile, with cap/error
  telemetry.
- Use the exact shoreline blue for every terrain contour where Cesium's active
  source height is `<= 0`. The threshold is
  `terrain-source-native-zero`: ETOPO 2022 is EGM2008 height and Terrarium
  remains provider-native. Do not call this a universal MSL datum.
- Shortbread supplies water boundaries but no numeric inland-water elevation.
  Describe the outline as exact source geometry terrain-draped by Cesium, not
  a measured lake/river isocontour or a source water mask.
- Keep the shared provider water opt-in Earth-only. RoadVector's road-filtered
  overview and WXGlobe's imagery-free contour material must not change.
- Composite each tile in the strict order `water fill -> water NURBS outline ->
  buildings -> roads`. Road strokes take precedence over every water pixel at
  bridges, causeways, shoreline crossings, and overlapping source geometry.

## User Addendum - 2026-08-24 AKDT - Actual GIS Geometry, Not Painted Glow

This addendum supersedes EarthGrid's Shortbread canvas-compositing and
elevation-contour globe-material presentation. It does not change RoadVector's
separate local Three/WebXR renderer or WXGlobe's compatibility contract.

- EarthGrid must render ordinary GIS context as actual Cesium geometry. Water
  is a terrain-clamped ground polygon at exactly 50% blue opacity; shorelines,
  terrain contours, building footprints, and roads are ground polyline
  geometry. The normal GIS base creates no canvas tile, imagery texture,
  `PolylineGlow` material, blur, bloom, depth-fail glow, or duplicate halo
  pass.
- A source road, shoreline, building ring, or terrain isocontour is represented
  by exactly one solid unlit line geometry. Its brightness, width, and color
  belong to that represented line. Exact source paths use unit-weight
  degree-one NURBS semantics so authoritative points are not rounded or moved
  before Cesium consumes the sampled polyline.
- Ground ordering is public and deterministic rather than dependent on decode
  order: terrain contours `zIndex=0`, water surfaces `10`, shoreline NURBS
  `20`, building wires `30`, global Shortbread roads `40`, and bounded local
  OSM roads above the global context. Roads therefore take precedence over
  every water fill or boundary at bridges, causeways, and crossings.
- The globe keeps its real NOAA/AWS terrain mesh but removes the painted
  elevation-contour material. Its front face is 3.5%-opaque black and its back
  face is transparent. Successful provider height grids drive bounded
  marching-triangle contour extraction; source-native levels at or below zero
  are `#24cfff`, positive levels remain green, and all paths are clamped back
  to the same Cesium terrain.
- Shortbread selection is owned by an explicit camera/move-end vector-tile
  scheduler, never by an invisible imagery-provider shim. Selection is
  antimeridian-aware, lowers LOD until no more than 24 tiles are active, uses
  at most six concurrent requests, retains at most 96 decoded tiles, and keeps
  the existing 2 MiB tile, 10,000-feature, 192 MiB session, and 4,000,000
  active-vertex bounds. Replaced generations abort and cannot leave stale
  geometry.
- NOAA nowCOAST radar/satellite remains an optional raster imagery layer
  because the upstream weather product is raster. It is off by default, is
  not a synthetic glow texture, and is the only permitted EarthGrid imagery
  layer in this slice: zero imagery layers normally and one while current
  weather is enabled.
- Keep the legacy shared `ShortbreadImageryProvider` and default topo material
  for existing RoadVector/WXGlobe consumers until those demos are separately
  migrated. EarthGrid itself must report `rasterPainted:false`, `glow:false`,
  actual polygon/polyline/NURBS counts, cap failures, category z-indices, and
  source/lifecycle status through its public browser state.

## Implementation Correction - 2026-08-24 AKDT - Cesium Buffer Geometry

This correction supersedes the ground-clamping, ground-primitive, and
`zIndex` implementation details in the preceding addendum. Cesium's public
ground entity path proved unable to compile the root ocean plus concurrent
terrain generations within a bounded startup, and its worker readiness could
not be observed without private APIs. The user-facing actual-geometry and
road-precedence requirements remain unchanged.

- Pin Cesium to exact `1.144.0` because the selected
  `BufferPolygonCollection` / `BufferPolylineCollection` API is experimental
  and outside Cesium's normal deprecation guarantee. Use immutable,
  exact-capacity snapshots; never inspect private renderer state.
- Render water as triangulated, geodetically subdivided buffer polygons and
  every shoreline, building ring, road, and terrain contour as one solid
  buffer polyline. Low-zoom paths and polygon interiors must be subdivided on
  the curved ellipsoid so sparse WGS84 geometry cannot become a chord hidden
  inside the globe. All generated vertices and triangles remain inside the
  published active caps.
- Replace `zIndex` with an explicit physical-height contract. Terrain contours
  retain their source elevation plus `0.25 m`; oceans are flat at source-native
  zero plus `0.5 m`; inland bodies use one bounded terrain-sample median plus
  `0.5 m`, falling back visibly to zero; shorelines reuse the matching body
  level plus `0.75 m`; building wires use sampled terrain plus `1 m`; global
  roads use the greater of sampled terrain, zero, and every crossed water-body
  level plus `2 m`; local roads use sampled terrain plus `4 m`. Category
  submission order is stable but never substitutes for the height proof.
- Buffer readiness means exact CPU buffer counts followed by a successful
  public Cesium `scene.postRender` for the current immutable revision. A public
  `scene.renderError` while that revision awaits presentation invalidates the
  revision; the app transiently revokes readiness and may recover only after a
  later fully qualified frame. An unrelated error after presentation is not
  retroactively attributed to the already-presented layer revision. No worker
  count or private render-context inspection is allowed.
- The ordinary EarthGrid base has zero imagery layers. Time-qualified NOAA
  nowCOAST remains the sole optional source-raster overlay. The public contract
  must report ocean and bounded-median inland display-height modes separately;
  it must not claim that Shortbread publishes measured water elevations.

## RoadVector Terrain Reliability Addendum - 2026-08-24 AKDT

This addendum replaces RoadVector's NOAA-specific terrain startup contract; it
does not change EarthGrid's independently selectable terrain sources or
WXGlobe's NOAA compatibility gate.

- RoadVector's Cesium hemisphere and local ride use AWS Terrain Tiles in
  Terrarium encoding. The overview is fixed to the complete z0–z3 Web Mercator
  pyramid, a structural maximum of 85 tiles rather than an exhaustible session
  counter. Location changes replace and abort the prior terrain generation.
- A local region resamples at most nine z12 Terrarium tiles onto the exact
  bounded WGS84/ENU grid shared by visual triangles and physics collision.
  Source provenance, fetch time, attribution, and non-operational-use status
  remain public.
- Local terrain has a 10-second deadline. Timeout or source failure must reach
  the explicitly non-authoritative derived-plane fallback; it may never leave
  the app indefinitely loading. Caller cancellation remains an abort and must
  not be relabeled as source degradation.
- Cesium road/highway imagery is not considered current until terrain allows
  its installed providers to request and render. Built smoke must observe
  current Terrarium, current bounded Shortbread roads, and the versioned FHWA
  NHS layer before enabling the ride transition.

## EarthGrid Broad-View Buffer Safety Addendum - 2026-08-24 AKDT

- Detailed Shortbread buffer geometry starts at zoom 5. A camera rectangle
  selecting a lower zoom must settle as an explicit `viewDeferred` revision:
  source commands and deferred counts are retained, but no Cesium polygon or
  polyline buffer and no GPU submission may be invented.
- Every polygon must pass source-ring and source-point preflight caps before
  `Cesium.PolygonGeometry.createGeometry`. In particular, the z0 world-ocean
  polygon with continent holes may never enter a monolithic synchronous
  triangulation path; a regional camera movement retries through the ordinary
  bounded scheduler.
- Built smoke must prove both scales: ready transparent terrain plus actual
  blue/green terrain contours at the whole-world view, followed by a regional
  zoom with presented water, shoreline, building-wire, and road buffers.
- Local-road precedence is an exact point-and-segment contract. Every
  densified road chord queries the active water index for the maximum
  intersected display height, including narrow bodies whose endpoints are
  outside the polygon, before applying the local-road offset. Matched global
  and local revisions are required before local geometry becomes visible.

## User Addendum - 2026-08-25 AKDT - Land-Side Shoreline Pair And Shared Caches

- Every rendered blue water boundary receives a separate green companion curve
  immediately on its land side. It is actual buffer/NURBS geometry with one
  solid color pass, not an outline material, texture, bloom, duplicated halo,
  or source-boundary claim. Ocean/lake outer rings and land-island holes must
  choose opposite offset directions correctly.
- Preserve exact blue source geometry, suppress synthetic vector-tile closure
  edges for both curves, keep open fragments open, bound sharp-corner miters,
  and report the companion's source/curve/control/tessellated vertex counts and
  display-derived offset policy.
- Cache validated road and terrain artifacts locally through PeerCompute
  `StateManager` and at the loopback geodata backend. Large or precise payloads
  remain local/backend-only and must not be replicated over Yjs or presence.
- Both cache tiers require hard entry/byte/session bounds, deterministic keys,
  source-specific TTL/stale policy, coalescing, integrity/content validation,
  abort isolation, eviction/clear lifecycle, and public hit/miss/stale/error
  telemetry. Backend source routing is fixed/allowlisted; clients cannot supply
  arbitrary proxy URLs.
- EarthGrid and RoadVector use same-origin cached source routes when available,
  with a truthful direct-source fallback for static hosting. Cache hits may not
  weaken attribution, freshness, source-status, request caps, or generated
  geometry caps.

## Implementation Result - 2026-08-25 AKDT - Land Pair, Cache Tiers, And Performance

- COMPLETE: every rendered blue shoreline has one distinct green land-side
  curve. The final private Anchorage frame reports `175` blue plus `175` green
  curves, zero unpaired curves, actual Cesium buffers, one solid pass per
  curve, and no raster paint, glow, halo, or duplicate line pass.
- COMPLETE: StateManager owns local-only memory/IndexedDB road and terrain
  artifact caches outside Yjs. The backend owns independent byte-bounded
  Shortbread/Terrarium and normalized-region caches behind fixed same-origin
  routes. NOAA ETOPO stays direct and every source retains its real authority,
  license, freshness, and degraded state.
- COMPLETE: the shared Shortbread feature hard limit is 25,000 after the
  official Alaska z5 tile demonstrated 12,848 selected features. Backend,
  local cache validator, EarthGrid buffers, and RoadVector imagery share that
  bound; 25,001 rejects without weakening byte, coordinate, or vertex caps.
- COMPLETE: request-render mode, bounded z10 Terrarium detail, relaxed
  screen-space error, terrain-burst reconciliation, and warm cache reuse reduce
  EarthGrid churn while retaining progressive real terrain and truthful
  telemetry. Detailed Shortbread geometry is still deferred at broad views.
- VERIFIED: aggregate unit `349/349` plus mocked WebXR, release build/static
  `44/44` plus combined browser smoke, private EarthGrid paired-line frame,
  RoadVector 25/25-tile frame, backend ETag/304, and private WXGlobe readiness
  all pass. Physical-headset validation remains explicitly NOT RUN.

## User Addendum - 2026-08-25 AKDT - RoadVector Akira-Style Visual And Ride Feel

- Replace RoadVector's minimalist motorcycle presentation with the specific
  downloadable Sketchfab “Akira Bike” model selected by the user, subject to
  the model's official download and CC BY 4.0 attribution requirements.
- The imported model is presentation only. The existing multi-body particle
  motorcycle, suspension constraints, tire/contact model, collision response,
  and fixed-step solver remain the source of motion; no animation, scripted
  path, raycast vehicle, or kinematic shortcut may replace them.
- Optimize the model before shipping and disclose runtime triangle, material,
  draw-call, texture-memory, asset-byte, scale, and orientation bounds. Default
  rendering must not reintroduce the old duplicate halo/core passes or debug
  particle/contact geometry.
- Improve keyboard control and physical behavior through measured driving:
  progressive power/brakes, bounded speed-aware counter-steer and lean, stable
  release/recovery, sane reset/parking behavior, and an intentional gearbox.
  Preserve normalized input signs and cross-device actuator consistency.
- Improve foreground performance at the measured CPU bottlenecks while keeping
  the 120 Hz/twelve-iteration physics contract, physical traffic and terrain
  contacts, deterministic ordering, and bounded resource/error telemetry.
- Release evidence includes licensed-asset provenance, focused deterministic
  physics tests, before/after foreground keyboard-drive profiles, rebuilt
  browser smoke, private HTTPS proof, and an explicit physical-headset status.

## Implementation Result - 2026-08-25 AKDT - RoadVector Licensed Visual, Controls, And Performance

- The runtime now ships a locally packaged optimized derivative of “Akira
  Bike” by Ryanwill679 under CC BY 4.0. Its bounded manifest records 7,508,640
  bytes, 58,870 triangles, fifteen material draws, twenty-two KTX2 textures,
  exact hashes, scale/orientation, and all modification/limitation disclosures.
  The model has no physics/collision authority and follows only the physical
  chassis; the six-body simulation and debug geometry contract are preserved.
- The desktop path now uses deterministic fixed-step actuator filtering and a
  single lateral-acceleration request for compatible fork/lean targets. S is a
  balanced service brake, dedicated brakes remain, default mouse steering no
  longer biases A/D, traction/load limiting is physical, automatic shift has
  hysteresis, and low-speed parking remains bounded forces/torques.
- Exact 8 and 20 m/s right-turn probes produce 23.19° and 13.88° physical right
  yaw with 0.118/0.143 lateral slip. Nine seconds of W stays upright (1.44° max
  tilt), reaches 15.93 m/s, shifts once, and replays byte-identically. S stops
  an 8 m/s bike in 1.083 seconds / 4.608 m.
- Terrain/simulation/render hot paths were optimized without reducing the
  120 Hz/twelve-iteration/traffic/contact contract. The identical physics
  benchmark is 65.63% faster with unchanged state hash; the foreground browser
  route improves from a 58.84 ms intake mean to 24.74 ms aggregate.
- Physics `41/41`, RoadVector `75/75`, XR `23/23` plus mocked browser, static
  release `17/17`, built-doc runtime smoke, and current private Tailnet HTTPS
  all pass. Physical-headset comfort/performance is explicitly NOT RUN.
- The final measured follow-up removes redundant per-cell broadphase sorting,
  disables the one glass transmission prepass while preserving alpha, and
  enables race-gate frustum culling. The final live keyboard drive averaged
  `17.12 ms` over `526` frames with p95 `16.8 ms`; its ending view submitted
  `42` calls / `164,922` triangles with zero physics overflow. Physics now passes
  `42/42`; RoadVector remains `75/75`; the rebuilt smoke and static `17/17`
  release gate pass. None of these presentation/ordering optimizations changes
  the six-body, 120 Hz, twelve-iteration authority contract.

## Audit Hardening Result - 2026-08-25 AKDT - Rebase, One-Pass Alpha, And Grounding

- COMPLETE: the active rider-foot parking anchor now shifts in the same local
  coordinate frame as every rigid body and reset snapshot. A paired baseline/
  rebased one-second regression proves no force saturation, velocity kick, or
  physical-position discontinuity while parked.
- COMPLETE: verified model loading forces every alpha-transparent material to
  one Three.js pass. The actual authored double-sided glass keeps its opacity,
  disables transmission/depth writes, sets `forceSinglePass`, and reports zero
  two-pass transparent materials; opaque authored materials remain unchanged.
- COMPLETE: a manifest-validated `-0.12573690675938365 m` presentation-only Y
  offset aligns the calibrated model minimum exactly with the authoritative
  `-1.042 m` physics tire-bottom midpoint. Wheelbase stays `1.67 m`; physics
  poses, rolling radius, particles, contacts, and collision authority do not
  change. Numeric-string/nonfinite offsets and inconsistent grounding equations
  fail before Three.js receives the model.
- VERIFIED: final physics `43/43`, RoadVector `75/75`, model `7/7`, static
  release `17/17`, and rebuilt RoadVector browser smoke on owned port `43978`
  pass. Independent blocker-only source audit is clean. Physical-headset
  comfort/performance remains NOT RUN.

## User Addendum - 2026-08-25 AKDT - Centered Chase, Physical Roads, Automatic Mode, And Resident EarthGrid Roads

- Center RoadVector's third-person chase camera directly behind the physical
  motorcycle. Presentation calibration may not introduce a permanent lateral
  camera offset.
- Make the rendered local road deck and the particle motorcycle share one
  bounded, terrain-draped physical surface. Tire/road response remains fixed-
  step contact, friction, suspension, and force/torque based; no pose or
  velocity clamping to a road path is allowed.
- Expose an explicit automatic-transmission mode, enabled by default, so a
  rider can accelerate and brake without manual shifts. Manual mode may remain
  available, but state and shift behavior must be visible and deterministic.
- Preserve already compiled EarthGrid Shortbread geometry across camera
  selections within explicit resident tile/vertex/byte caps. A warm revisit
  reuses compiled buffers; height revisions and eviction remain truthful.
- Reproduce all four reports in the private browser apps, add deterministic
  regressions, rebuild both generated demos, and retain direct Tailnet HTTPS.
  Physical-headset validation remains a separate manual gate.

## Completion Result - 2026-08-25 AKDT - Centered Chase, Physical Roads, Automatic Mode, And Resident EarthGrid Roads

- RoadVector's third-person camera now trails on the motorcycle centerline.
  The production browser gate verifies both configuration and the inverse-
  transformed live camera pose; terrain clearance and origin rebasing remain.
- The exact bounded road surface is shared between Three rendering and one
  composite particle heightfield. Front and rear tires physically contact the
  rendered deck and retain OSM provenance. Adaptive CCD retains a maximum of
  eight sweep segments but stationary/normal motion ordinarily samples only
  its endpoint; the fixed 120 Hz/twelve-iteration authority is unchanged.
- Automatic transmission is a first-class mutable physics mode and defaults on.
  HUD, checkbox, touch-shift availability, public state, reset behavior, manual
  fallback, and queued shift-edge cleanup are all executable contracts.
- EarthGrid keeps inactive compiled Shortbread buffers detached but resident.
  Exact reuse is allowed only when their height dependency is unchanged; a
  height refresh marks residents stale, rebuilds active geometry eagerly, and
  lazily rebuilds stale inactive geometry on return without another road fetch.
- Aggregate unit/release/browser gates pass and current generated artifacts are
  rebuilt. Direct private URLs remain `https://100.68.165.52:5187/` (EarthGrid)
  and `https://100.68.165.52:5188/` (RoadVector), with the existing explicitly
  trusted self-signed Tailnet certificate and no Serve/Funnel. Physical-headset
  certification remains NOT RUN.

## User Addendum - 2026-08-25 AKDT - Continuous Cesium Globe, Faster Stable Physics, And Off-Road Mountains

- The ride may no longer be confined to one bounded local region or reset at
  its edge. Cesium's WGS84/ECEF globe is the persistent world authority while
  the deterministic motorcycle solver continues in bounded local metres with
  explicit origin and terrain-window transitions.
- Stream and cache real terrain around the moving bike with overlap and
  generation ownership. A committed transition must keep body poses,
  orientations, velocities, suspension state, tire contact, cameras, and XR
  locomotion continuous. An unavailable next window must be disclosed and
  handled safely without pretending fallback relief is real.
- Allow unrestricted physical off-road travel wherever current terrain is
  available, including steep and rough mountain terrain. Roads remain optional
  terrain-draped surface overlays with higher contact precedence inside their
  footprints; they must not constrain or snap the bike to a route.
- Improve visible ride smoothness at the physics/interpolation source and raise
  the stable physical top-speed envelope well beyond the current result.
  Preserve the six rigid bodies, fixed 120 Hz step, twelve iterations, tire and
  suspension forces, CCD, traffic collision, and deterministic replay. Pose or
  velocity clamping, scripted motion, and kinematic vehicle shortcuts remain
  forbidden.
- Keep automatic transmission default, preserve all input/view modes and the
  licensed model, report world/stream/contact/speed truth publicly, and add
  focused plus built-headless gates. Physical-headset comfort/performance is a
  separate manual gate; `terminal-browser` is prohibited.

### Architecture clarification

- “Cesium globe” means Cesium/WGS84/ECEF is the canonical planetary position,
  selection, and far-field authority. Three.js remains the near-field ride and
  WebXR renderer because Cesium terrain sampling is asynchronous/view-loaded
  and cannot be the deterministic 120 Hz collision oracle. Both consume the
  same bounded cached terrain/road tile keys; public state must distinguish
  globe authority from the local ride renderer rather than claiming Cesium
  owns the physics canvas.
- Continuous travel is implemented through atomic streamed tangent frames,
  not one unlimited flat local grid. Source Web Mercator coverage truthfully
  ends at approximately `±85.051°`; crossing that limit requires a future polar
  DEM and must report unsupported terrain rather than silently clamp.

## Implementation Result - 2026-08-25 AKDT - Continuous Globe Terrain And Continuous Tread Physics

- Cesium/WGS84/ECEF now remains RoadVector's global authority while Three.js,
  WebXR, and the deterministic solver move through bounded ENU frames. A full
  rigid frame transaction preserves physical state, local radial gravity,
  renderer chunks, chase/camera-floor state, and the XR locomotion root.
- The ride publishes immutable z12-z14 Terrarium generations with a 3x3 active
  collision ring, 5x5 desired prefetch ring, 32 resident chunks, six requests,
  strict byte/vertex limits, retries, reservations, and exact disposal. It
  pauses as `stream-wait` before coverage loss and no longer resets at the old
  local boundary. Real off-road/mountain terrain is physically rideable.
- Streamed terrain and the seed road fallback share one stable collider and one
  renderer revision. Roads, buildings, race, and traffic remain a truthful
  bounded seed overlay in this release; global road streaming is not claimed.
- A solver-owned analytic tread contact removes wheel-ring phase chatter while
  retaining 32 ring particles per wheel for inertia and body impacts. The
  final automatic bike reaches 30.55 m/s, sustains at least 26.09 m/s, and
  measures 0.118 mm chassis-height deviation without pose/velocity correction.
- A local-only decoded Terrarium cache reduces one desired window from 225
  repeated source decodes to 49 unique decodes within an exact 64-entry/16 MiB
  bound. It coalesces readers, isolates caller abort, cancels orphan work,
  rejects late completion after teardown, and never enters Yjs.
- Node 24 verification passes geo-core `87/87`, physics `54/54`, traffic
  `12/12`, XR `24/24` plus mocked browser, RoadVector `117/117`, production
  build, static release `17/17`, and rebuilt standalone Playwright/system-
  Chromium smoke. The owned listener is closed; physical-headset validation is
  explicitly NOT RUN; `terminal-browser` was not used.

## Pages verification - 2026-11-03 AKST

- RoadVector presence snapshots now expose up to8sanitized public libp2p connections and derive connected state from actual open connections. Overview13/13 tests and native Pages browser proof pass against SecretWorkshop.
- Earth and WXGlobe real-source contour globes render on the production-shaped nested site; Earth’s optional model panel acquires static-host isolation.
- No deployed compatible geodata origin was found on SecretWorkshop; root geodata routes redirect to HTML. RoadVector overview/presence pass, while riding stays explicitly disabled. Do not configure that redirect as VITE_GEODATA_API_URL or claim riding/physical XR validated.
