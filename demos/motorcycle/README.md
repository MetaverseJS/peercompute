# RoadVector

RoadVector is a location-based motorcycle racing demo built from reusable
PeerCompute geospatial, particle-rigid, traffic, and WebXR modules. It loads a
bounded OpenStreetMap-derived road/building scene from `services/geodata`,
samples NOAA ETOPO 2022 into a local ENU terrain mesh, derives a deterministic
race course from real connected OSM node IDs, and simulates the motorcycle and
traffic collision cages on the CPU at 120 Hz.

Startup is a separate north-up hemisphere overview centered on the permitted
browser location. NOAA ETOPO supplies the real topographic relief and contours;
an official OSM Shortbread z5 window overlays only the regional motorway,
trunk, and primary network. That road overlay is intentionally bounded to a
center-out 5×5 / 25-tile window rather than pretending to be complete
hemisphere coverage. Physics remains paused until `RIDE THIS REGION` switches
discretely into the local one-unit-per-meter world.

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

- Exact device coordinates remain in browser memory only. Requests are
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
- Terrain retains NOAA/NCEI ETOPO 2022 attribution and not-for-navigation
  limitations. A failed terrain sample becomes an explicitly labeled degraded
  plane; it is never called live relief.
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
projection, tile wrapping/caps, ETOPO decoding, major-road filtering, metric
camera/gate scale, coarse-location privacy, stale/capped presence, fixed-red
rendering, and nonfatal relay failure.

A real headset enter/exit/re-enter, hand/controller, haptics, comfort, and
performance pass remains a manual hardware gate. Do not represent the mocked
browser gate as physical-headset certification.
