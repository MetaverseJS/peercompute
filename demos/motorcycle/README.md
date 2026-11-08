# RoadVector

RoadVector is a location-based motorcycle racing demo built from reusable
PeerCompute geospatial, particle-rigid, traffic, and WebXR modules. It loads a
bounded OpenStreetMap-derived seed road scene from `services/geodata`, then
streams AWS Terrarium elevation chunks continuously around a WGS84/ECEF globe
position. The seed graph supplies a deterministic race from real connected OSM
node IDs; the motorcycle and bounded traffic collision cages run on the CPU at
120 Hz.

Startup is a separate CesiumJS north-up hemisphere overview centered on the
permitted browser location. Cesium owns the WGS84 globe, camera, bounded AWS
Terrarium terrain, contours, OSM overlay, and coarse live-player markers. An official
OSM Shortbread z5 window overlays only the regional motorway, trunk, and
primary network. That road overlay is intentionally bounded to a center-out
5×5 / 25-tile window rather than pretending to be complete hemisphere
coverage. A separate persistent FHWA/U.S. DOT National Highway System layer
draws the current versioned nationwide network, including Alaska, from a
small same-origin derived MVT snapshot with the original federal metadata
retained. Click or tap the Cesium globe to request a seed road region at that
point; the overview stays active if no playable OSM road exists. `RIDE THIS
REGION` enters a Three.js/WebXR one-unit-per-metre tangent frame while Cesium,
WGS84, and ECEF remain the persistent planetary authority. The terrain working
set then advances continuously; Earth-scale coordinates never enter the
float/local particle solver.

The ride keeps exact triangle terrain and a six-body particle-rigid motorcycle
for collision and dynamics. A deterministic 3×3 active / 5×5 desired Terrarium
working set publishes complete collision snapshots only at fixed-step
boundaries, retains at most 32 resident chunks, and transforms the local ENU
frame without changing the ECEF bike pose. Missing forward terrain pauses
substeps as `stream-wait`; it never resets the bike or invents a flat
authoritative surface. Terrarium elevations generate bounded genuine Three.js
NURBS contours over a 3.5%-opacity terrain surface. The visible
bike is an optimized derivative of [“Akira Bike” by Ryanwill679 on
Sketchfab](https://sketchfab.com/3d-models/akira-bike-a5b1dc49808b40a9b94f9a4a3073d548),
used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The local
7.5 MB GLB is bounded to 58,870 triangles, 15 authored material draws, and 22
KTX2 textures at no more than 1024 px. It is chassis-relative presentation
only: the original model is unrigged, so its visible wheels do not articulate,
and it never supplies collision or dynamics authority. The six physical bodies,
suspension, wheels, tire contacts, and forces remain authoritative. Append
`?physicsDebug=1` to expose capped collision particles and contact markers for
diagnostics. Full attribution and modification details are packaged in
`public/models/akira-bike/ATTRIBUTION.md`.

The same bounded 5,000 seed-road segments feed rendering and collision. Each road
ribbon is clipped against the exact terrain triangles and lifted by one shared
0.105 m deck clearance; its source footprint is packed into a bounded XZ
spatial index. A single composite static surface samples the same exact terrain
plane plus that clearance inside the footprint and the original terrain
everywhere else, avoiding duplicate road/terrain impulses. Physical tire
contacts retain the OSM way and segment identifiers. These detailed OSM roads,
the race, buildings, and traffic are intentionally seed-region overlays; beyond
them the current release is continuous terrain/off-road riding, not a claim of
globally streamed street geometry.

A manifest-driven 0.12573690675938365 m presentation-only downward offset puts
the calibrated model minimum at the six-body rig's -1.042 m tire-bottom
midpoint. This corrects the apparent hover without rescaling the correct 1.67 m
wheelbase or changing any physics pose, contact, collision, or force.

The one authored glass material is presented as ordinary alpha transparency at
runtime. Its glTF transmission value is disabled after verified loading so
Three.js does not redraw the complete 58,870-triangle model for a transmission
prepass. Runtime alpha materials also set Three.js `forceSinglePass`, including
the authored double-sided glass, so they cannot fall back to two transparent
draws. Race-gate beams use normal frustum culling; neither optimization changes
the physics world or the asset's authored opaque materials.

First-, centered-behind damped third-, and stereo-XR camera placement is
constrained against the same committed terrain/road snapshot with 0.35 m
minimum optical clearance. The sampler, chase state, and XR locomotion root
participate in full rotational/translational ENU frame handoffs; XR
correction raises only the locomotion root and never overwrites the
headset-tracked camera pose. Desktop rendering caps device pixel ratio at 1.5
to bound fragment work on high-density displays; WebXR continues to use the
headset compositor's render target.

The map, race course, and traffic are for gameplay and visualization only.
They are not navigation, live traffic, road-condition, weather-warning, or
terrain-clearance products. Traffic is deterministic application-generated
simulation over real road geometry and is always labeled synthetic.

## Run it locally

From the repository root, start a bounded geodata backend and the HTTPS Vite
app in separate terminals:

```bash
# Low-volume development fallback. Production must use a controlled Overpass.
npm run dev:geodata:public
npm run dev:motorcycle
```

RoadVector normally listens on `https://localhost:5188` and proxies `/api` to
the loopback geodata service on port `8788`. The current direct Tailnet-only
development handoff is:

```text
https://100.68.165.52:5188/
```

It binds directly to the private Tailnet IP and uses an environment-owned
self-signed certificate with that IP in its SAN. It does not use Tailscale
Serve, Funnel, or a public tunnel. Accept or install that development
certificate on the headset/browser before testing geolocation or immersive
WebXR. The same-origin `/api` proxy keeps the geodata service on loopback.

RoadVector's official Shortbread overview tiles and AWS Terrarium source tiles
use a bounded local-only artifact cache owned by PeerCompute `StateManager` and
a second bounded cache at the same-origin geodata backend. The local artifact
tier uses memory plus IndexedDB but is separate from the replicated Yjs
document, so tile bytes and cache metadata are never sent to peers. Fixed
backend routes expose strong ETags and hit/miss/stale state without accepting
caller-supplied upstream URLs. A separate session-local 64-entry decoded
heightmap LRU coalesces overlapping terrain-halo reads, avoiding repeated
PNG/canvas decoding while remaining outside Yjs and below a 16 MiB decoded
payload bound. Detailed normalized OSM ride regions retain the backend's
existing bounded semantic cache.

Production builds do not silently select a cross-origin backend. Build with
`VITE_GEODATA_SAME_ORIGIN=true` (or
`VITE_GEODATA_API_URL=same-origin`) behind an HTTPS reverse proxy, or set an
explicit HTTPS API origin and configure matching `GEODATA_CORS_ORIGINS`.

## Controls

- Desktop: `W`/up throttle, `A` turns left, `D` turns right, `S` applies the
  service brake (front plus rear), space applies front brake only, down applies
  rear brake only, `Q`/`E` manually shift, `C` changes camera, `H` recenters,
  and `R` resets. The checked `AUTOMATIC TRANSMISSION` control is the default;
  it uses the physics RPM/hysteresis gearbox, ignores queued manual shift
  edges, and keeps the bike in a drive gear. Uncheck it to enable `Q`/`E` and
  the touch shift buttons. Mouse steering and pointer lock are off by default
  so pointer drift cannot bias A/D; an embedding app may explicitly opt into
  mouse steering, in which case lock loss clears held controls.
- Mobile: independent Pointer Event steering, throttle, front/rear brake,
  shift, view, and reset controls support simultaneous touches.
- Standard gamepad: left axis steering, triggers for throttle/brake, and
  bounded button mappings through the shared action layer.
- WebXR controller: `xr-standard` handed controls, target-ray terminal UI,
  tracked-head riding, reset, recenter, selection of the non-XR view restored
  after exit, and session-safe cleanup.
- Tracked hands: left target-ray yaw establishes a neutral steering pose;
  select/squeeze provide handed throttle/brake/clutch inputs. Tracking loss
  neutralizes pose steering. The wrist UI excludes its owning ray, and a
  one-source session moves the panel to an XR-root fallback so it remains
  operable.

All devices produce the same immutable normalized `ControlFrame`; the physics
solver never reads browser, Gamepad, or XR objects directly. The UI context
captures ride actions only while an interactive spatial control is hovered or
pressed.

## Simulation and race contract

- Six particle-cloud rigid components: rider/chassis, rear swingarm, rear
  wheel, upper fork/handlebars, lower telescoping fork, and front wheel.
- Deterministic CPU world: fixed 1/120 s, 12 solver iterations, stable IDs,
  surfaced capacity limits, swept translational and rotational particle CCD,
  gyroscopic angular integration, hard suspension travel, and snapshot reset.
- Motorcycle dynamics: engine/reaction torque, separate and service braking,
  one deterministic filtered actuator state per fixed step, a common
  curvature/lateral-acceleration target for fork and lean, explicit automatic
  or manual shifting, steering constraint, suspension springs/dampers, bounded force-based
  rider-foot parking support, tire slip plus friction ellipse, surface material
  grip, and optional physical lean-assist torque.
- Wheel/terrain contact: each wheel retains 32 ring particles for inertia and
  body/body collision while one solver-owned analytic circular tread shape
  supplies continuous terrain contact. Its implicit compliant normal impulse
  and XPBD support use 24,000,000 N/m stiffness and 24,000 N·s/m damping; this
  removes the rotating polygon-contact phase without smoothing, clamping, or
  writing the bike pose. The deterministic smooth-road gate sustains at least
  26.09 m/s, reaches 30.55 m/s, and measures 0.118 mm chassis-height deviation
  plus 0.00177 m/s vertical-speed deviation over its final five seconds.
- Race: a bounded deterministic course derived from the local directed road
  graph, ordered gates, laps/splits/timer/reset, and bright checkpoint visuals.
  The forgiving 14 m crossing corridor is independent of the correctly scaled
  8 m × 4.2 m visual portal.
- Traffic: lane-aware, restriction-aware, seeded synthetic vehicles. All 14
  default vehicles remain visible; at most four nearby seed-region vehicles
  have kinematic particle collision cages. Those cages and the race leave the
  broadphase/progress loop outside the seed region and reactivate on return.
- World coordinates: all physics uses a local ENU metre frame under a
  persistent WGS84/ECEF pose. Full frame handoffs rotate and translate body
  current/previous/predicted state, velocity, gravity, terrain, renderer,
  camera, and XR anchor in one prepared transaction.

The public `window.__motorcycleDemo.getState()` surface exposes source
provenance, load attempts, terrain degradation, physics/overflow/contact
telemetry, wheel loads and slip, suspension travel, traffic/race region state,
stream generations/content epochs/residency/coverage, current WGS84/ECEF pose,
camera/frame/reset snapshots, and XR panel status for browser gates.

## Data, privacy, and limits

- Exact device coordinates remain in browser memory only; bounded road and
  terrain source tiles around that coordinate may remain in the disclosed
  local-only artifact cache. Requests are
  quantized and expanded to a bounded region before reaching the backend; the
  service does not log exact query coordinates.
- Startup requests browser location permission so the opening hemisphere is
  the viewer's own. Permission denial loads a visibly disclosed Anchorage
  fallback rather than claiming it is the device location.
- Real RoadVector peers are shown only in the overview, always in red. Presence
  publishes at most a coarse 0.1° cell for a permitted browser/manual location,
  never publishes the automatic fallback, retains no exact coordinates, caps
  remote markers at 64, and removes entries after 15 seconds. Peer networking
  failure is nonfatal and never substitutes synthetic traffic as a player.
- Roads/buildings retain `© OpenStreetMap contributors`, ODbL 1.0, source base
  time, fetched/freshness/cache state, and derived-database notice.
- Terrain retains AWS Terrain Tiles registry attribution and not-for-navigation
  limitations. The Cesium overview is structurally limited to the complete
  z0–z3 Web Mercator pyramid (85 possible tiles), so moving between locations
  cannot exhaust a session counter. The initial seed relief retains its bounded
  deadline and disclosed degraded-plane fallback. Continuous ride terrain uses
  wrapped z12–z14 keys, a mandatory 3×3 active ring, 5×5 desired prefetch ring,
  six-request concurrency, 32-resident-chunk LRU, and strict byte/vertex caps.
  A missing or failed streamed neighbor pauses physics and remains explicitly
  unavailable; the initial fallback plane is never promoted into global relief.
- The FHWA National Highway System overview retains the exact upstream version,
  item/layer identity, archive/member hashes, source counts, original metadata,
  derivation parameters, tile checksums, and Alaska coverage. It is generalized
  display geometry and does not imply federal road ownership.
- Backend density and response caps fail with a smaller-region instruction;
  the client retries only its fixed bounded radius ladder and never silently
  truncates a drive graph.

## Validation

```bash
npm run test:physics
npm run test:traffic
npm run test:xr
npm run test:xr:browser
npm run test:motorcycle
npm run build:motorcycle
RUNTIME_SMOKE_DEMOS=motorcycle node demos/tests/runtime-smoke.mjs
```

Deterministic tests cover inertia/gyro/CCD/contact math, suspension sag and a
two-metre landing, grip-dependent acceleration/braking, real traffic impulse,
race gates/timing, lane/restriction semantics, controls, render topology,
full ENU/ECEF handoffs, streamed terrain seams/reservations/retries, off-road
coverage waits, resets, and disposal. The mocked Chromium WebXR gate uses
real Three r182 raycasting and mesh transforms while faking only the browser XR
system/session/input boundaries. Overview tests additionally cover north-up
Cesium camera placement, polar/dateline tile wrapping, explicit terrain/road
budgets, Terrarium decoding/resampling, major-road filtering, metric camera/gate scale,
coarse-location privacy, stale/capped presence, fixed-red rendering, and
nonfatal relay failure.

A real headset enter/exit/re-enter, hand/controller, haptics, comfort, and
performance pass remains a manual hardware gate. Do not represent the mocked
browser gate as physical-headset certification.

The final foreground keyboard route sampled 526 animation frames over 9.003
seconds: 17.12 ms mean, 16.7 ms p50, 16.8 ms p95, 33.3 ms p99, and 33.4 ms
maximum. Its ending chase view submitted 42 render calls and 164,922 triangles,
with zero physics-capacity overflow. This is a machine/browser measurement, not
a headset performance certification.
