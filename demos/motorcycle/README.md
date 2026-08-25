# RoadVector

RoadVector is a location-based motorcycle racing demo built from reusable
PeerCompute geospatial, particle-rigid, traffic, and WebXR modules. It loads a
bounded OpenStreetMap-derived road scene from `services/geodata`, samples AWS
Terrarium elevation tiles into a local ENU terrain mesh, derives a deterministic
race course from real connected OSM node IDs, and simulates the motorcycle and
traffic collision cages on the CPU at 120 Hz.

Startup is a separate CesiumJS north-up hemisphere overview centered on the
permitted browser location. Cesium owns the WGS84 globe, camera, bounded AWS
Terrarium terrain, contours, OSM overlay, and coarse live-player markers. An official
OSM Shortbread z5 window overlays only the regional motorway, trunk, and
primary network. That road overlay is intentionally bounded to a center-out
5×5 / 25-tile window rather than pretending to be complete hemisphere
coverage. A separate persistent FHWA/U.S. DOT National Highway System layer
draws the current versioned nationwide network, including Alaska, from a
small same-origin derived MVT snapshot with the original federal metadata
retained. Click or tap the Cesium globe to request a local road region at that
point; the overview stays active if no playable OSM road exists. Physics remains
paused until `RIDE THIS REGION` switches discretely
into the Three.js local one-unit-per-meter world. Earth-scale ECEF coordinates
never enter the particle solver or WebXR ride scene.

The local ride keeps its exact triangle terrain and six-body particle-rigid
motorcycle for collision and dynamics, but no longer exposes that dense
geometry by default. Terrarium elevations generate bounded genuine Three.js
NURBS contours over a 3.5%-opacity terrain surface. The visible motorcycle is exactly
two rational NURBS wheel loops at the physical rolling radius, five sparse
frame/fork/swingarm curves, and a six-curve stick rider. Append
`?physicsDebug=1` to expose capped collision particles and contact markers for
diagnostics.

First-, damped third-, and stereo-XR camera placement is constrained against
the same exact terrain triangles with 0.35 m minimum optical clearance. The
sampler remains correct through origin rebases; XR correction raises only the
locomotion root and never overwrites the headset-tracked camera pose.

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
caller-supplied upstream URLs. Detailed normalized OSM ride regions retain the
backend's existing bounded semantic cache.

Production builds do not silently select a cross-origin backend. Build with
`VITE_GEODATA_SAME_ORIGIN=true` (or
`VITE_GEODATA_API_URL=same-origin`) behind an HTTPS reverse proxy, or set an
explicit HTTPS API origin and configure matching `GEODATA_CORS_ORIGINS`.

## Controls

- Desktop: `W`/up throttle, `A` turns left, `D` turns right, space front brake, `S`/down rear
  brake, `Q`/`E` shift, `C` camera, `H` recenter, and `R` reset. Clicking the
  viewport requests pointer lock; lock loss clears held controls.
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
- Motorcycle dynamics: engine/reaction torque, separate brakes, steering
  constraint, suspension springs/dampers, bounded rider-foot parking support,
  tire slip plus friction ellipse, surface material grip, and optional physical
  lean-assist torque.
- Race: a bounded deterministic course derived from the local directed road
  graph, ordered gates, laps/splits/timer/reset, and bright checkpoint visuals.
  The forgiving 14 m crossing corridor is independent of the correctly scaled
  8 m × 4.2 m visual portal.
- Traffic: lane-aware, restriction-aware, seeded synthetic vehicles. All 14
  default vehicles have bounded kinematic particle collision cages; this is
  not a live traffic feed.
- World coordinates: all physics uses a local ENU meter frame. Origin rebases
  shift terrain, motorcycle, traffic, race, renderer, and camera/XR anchor in
  one transaction.

The public `window.__motorcycleDemo.getState()` surface exposes source
provenance, load attempts, terrain degradation, physics/overflow/contact
telemetry, wheel loads and slip, suspension travel, traffic/race state, input
sources, camera/rebase/reset snapshots, and XR panel status for browser gates.

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
  cannot exhaust a session counter. Local relief loads at most nine z12 source
  tiles and has a 10-second deadline. A failed or timed-out local sample becomes
  an explicitly labeled degraded plane; it is never called live relief.
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
origin rebasing, resets, and disposal. The mocked Chromium WebXR gate uses
real Three r182 raycasting and mesh transforms while faking only the browser XR
system/session/input boundaries. Overview tests additionally cover north-up
Cesium camera placement, polar/dateline tile wrapping, explicit terrain/road
budgets, Terrarium decoding/resampling, major-road filtering, metric camera/gate scale,
coarse-location privacy, stale/capped presence, fixed-red rendering, and
nonfatal relay failure.

A real headset enter/exit/re-enter, hand/controller, haptics, comfort, and
performance pass remains a manual hardware gate. Do not represent the mocked
browser gate as physical-headset certification.
