# EarthGrid Real-Data Platform

EarthGrid is the reusable, non-aviation Earth/GIS base for PeerCompute demos.
It combines NOAA/AWS elevation with actual Cesium buffer geometry derived from
official OpenStreetMap Shortbread: blue polygons for ocean and inland water,
degree-one NURBS shoreline polylines, building footprint wires, solid road
curves, and degree-one NURBS elevation contours. Water is non-extruded,
non-animated geometry with opacity exactly `0.5`. Terrain contours at or below
the active provider's native zero-height reference use the shoreline blue;
positive contours use green. Cesium's buffer API has no public ground z-index,
so every category carries an explicit source/sampled height and a small
monotonic radial bias: terrain contours `0.25 m`, water `0.5 m`, shorelines
`0.75 m`, building wires `1 m`, global roads `2 m`, and local roads `4 m`.
Roads therefore remain above water regardless of decoder order. The normal GIS
base uses no canvas-painted imagery, texture glow, blur, bloom, halo, or
duplicate line pass. Optional time-qualified NOAA nowCOAST radar or satellite
imagery remains source raster data and is the sole permitted imagery overlay.

The display is for visualization and gameplay only. It is not a navigation,
routing, warning, or traffic product. OpenStreetMap content and the normalized
road graph are an ODbL-derived database and retain visible attribution.
AWS Terrarium is the default interactive terrain source; NOAA ETOPO 2022
remains a selectable pole-to-pole source rather than a startup dependency.
For each loaded local region the UI exposes the OSM base timestamp, adapter
fetch time, freshness boundary, cache state, provider mode, and whether a
verified stale-on-error response is being shown.

## Development

From the repository root:

```bash
npm run dev:geodata:public
npm run dev:earth
```

The public Overpass command is explicitly a low-volume development fallback.
For sustained use, set `GEODATA_OVERPASS_URL` to a controlled/self-hosted
compatible interpreter and run `npm run dev:geodata`. Earth's Vite server is
HTTPS on port 5187 and proxies `/healthz` plus `/api` to the loopback service on
8788, avoiding mixed content and cross-origin coordinate disclosure.

The current private Tailnet development listener is
`https://100.68.165.52:5187/`. It binds directly to the Tailnet IP with the
same IP-SAN self-signed development certificate as RoadVector and does not use
Tailscale Serve or Funnel. Accept or install that certificate on the viewing
device first; `/api` remains a same-origin proxy to loopback `8788`.

Browser geolocation is user-triggered, requires a secure context, is rounded to
four decimal places, and is retained in memory only. The local query starts at
a 1.2 km radius and retries bounded 800 m and 500 m regions when source or
normalized-result density exceeds a hard cap.

## Production

The static build intentionally has no implicit cross-origin backend. Either:

- terminate HTTPS in front of the built app and reverse-proxy `/api` and
  `/healthz` to the loopback geodata service, then build with
  `VITE_GEODATA_SAME_ORIGIN=true` (or
  `VITE_GEODATA_API_URL=same-origin`); or
- set `VITE_GEODATA_API_URL=https://geo.example` at build time and add the
  exact Earth origin to `GEODATA_CORS_ORIGINS`.

`VITE_GEODATA_API_URL` must be an origin without credentials, a path prefix,
query, or fragment. An HTTPS Earth page will reject an HTTP API. Production
geodata requires `GEODATA_OVERPASS_URL`; `GEODATA_ALLOW_PUBLIC_OVERPASS` is
rejected under `NODE_ENV=production`.

For an already-built diagnostic preview, `?geodata=same-origin` opts into the
same root-relative `/api` and `/healthz` routes, while `?geodata=off` disables
the local adapter. Neither query option accepts an arbitrary upstream URL.

All geodata JSON, Shortbread TileJSON/MVT, and nowCOAST capabilities bodies are
read through decoded response streams with hard byte caps; a missing or
compressed `Content-Length` cannot bypass those caps. Successful geodata
responses are accepted only when their exact schema discriminator, source,
status/freshness, bbox, counts, graph references, and OSM/ODbL provenance are
coherent.

EarthGrid opts into the official Shortbread `ocean` and `water_polygons`
layers. It renders oceans plus non-glacier polygonal lakes, reservoirs, wide
rivers, basins, docks, and canals. Glaciers are not classified as water, and
centerline-only `water_lines` (including narrow streams) are intentionally
outside this surface-only layer. One camera-bounded Shortbread scheduler feeds
immutable `Cesium.BufferPolygonCollection` and
`Cesium.BufferPolylineCollection` snapshots: at most 24 active tiles, six
concurrent requests, a 96-tile decoded LRU, 2 MiB per tile, 192 MiB per
layer-session, 10,000 decoded features per tile, and 4,000,000 active vertices.
The aggregate byte counter is a lifetime session budget, not resident-cache
accounting. Cesium is pinned to exact `1.144.0` because the high-throughput
Buffer geometry API is explicitly experimental and is not covered by Cesium's
normal deprecation policy.

The whole-world camera intentionally defers detailed Shortbread buffer
construction below zoom 5. That state is exposed as a successful, settled
`viewDeferred` revision with no invented GPU submission; moving to a regional
view requests and atomically presents the bounded vector buffers. This avoids
feeding the global z0 ocean-with-holes polygon to Cesium as one unbounded
triangulation job while preserving the transparent terrain globe and its real
NURBS elevation contours.

Sparse WGS84 lines are subdivided as bounded RHUMB segments before packing,
and water polygons use Cesium's synchronous curved-ellipsoid triangulation.
This prevents low-zoom roads or water triangles from becoming straight ECEF
chords hidden inside the globe. Added line, polygon, and triangle work is
charged to explicit vertex/operation caps. Global roads test their tile-space
segments against an indexed set of water bodies; bounded local roads query the
same active-water index and use the higher of terrain, zero, or matched water
level before applying their category offset.

The shoreline renderer preserves every source vertex with unit-weight,
open-clamped degree-one NURBS fragments. It suppresses synthetic MVT tile-edge
closure segments, retains holes and multipart bodies, never downsamples, and
rejects a tile before changing the active Cesium buffer snapshot if its 4,096-ring,
8,192-curve, 65,536-source-point, or 131,072-sampled-vertex hard limit is
exceeded. Telemetry exposes open/closed curves, clipped segments, fully clipped
rings, cap rejections, and zero source deviation.

Shortbread does not publish numeric lake/river/ocean elevations. Oceans use the
active terrain source's native-zero display level. Each inland polygon uses
one bounded median derived from available terrain samples, and its shoreline
reuses that exact flat level; unresolved bodies visibly fall back to
source-native zero until an atomic height refresh. These are display
elevations, not measured per-body isocontours. Terrain contour geometry
classifies source levels `<= 0` in the active terrain provider's native
reference. NOAA ETOPO 2022 supplies EGM2008 heights; the optional Terrarium
provider retains its provider-native reference. EarthGrid does not mislabel
both as universal MSL or claim that elevated inland-lake beds are source water
masks.

## Validation

```bash
npm --prefix demos/earth test
npm --prefix demos/earth run build
npm run test:earth-platform
```

`window.__earthDemo.getState()` exposes bounded source status, actual OSM
freshness/provenance/notes, rendered/omitted counts, chosen local radius,
same-origin/external/unconfigured backend mode, terrain telemetry, and weather
time for browser gates. It also exposes `waterStatus`, `waterVisible`, exact
water geometry metadata, NURBS shoreline and terrain-curve telemetry, category
order and physical height offsets, explicit `rasterPainted:false` /
`glow:false`, exact buffer/vertex counts, post-render submission state, and the
source-native-zero contour contract. With weather off,
the imagery-layer count is zero; enabling a current nowCOAST source makes it
exactly one.

Geometry readiness is revision-specific: a non-empty detailed revision needs
exact CPU buffer counts followed by a successful public Cesium
`scene.postRender`; a deliberately deferred broad-view revision settles empty
without claiming GPU work. A current `scene.renderError`, source/cap failure,
or stale replacement invalidates ready state. EarthGrid does not use private
renderer state or claim an unintended blank layer is live.
