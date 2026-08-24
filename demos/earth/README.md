# EarthGrid Real-Data Platform

EarthGrid is the reusable, non-aviation Earth/GIS base for PeerCompute demos.
It combines the existing NOAA/AWS elevation providers and bright parallel
topographic rings with official OpenStreetMap Shortbread ocean and inland-water
surfaces, roads, and buildings; bounded local OSM roads/buildings from the
geodata service; and optional time-qualified NOAA nowCOAST radar or satellite
imagery. Water is a non-extruded, non-animated blue terrain-draped fill with
opacity exactly `0.5`, drawn beneath the road and building context. Every valid
water-polygon ring also has an exact `#24cfff` degree-one NURBS shoreline; the
same blue is used for terrain contours at or below the active provider's
native zero-height reference. Tile compositing is water fill, shoreline,
buildings, then roads, so roads always take precedence over water at overlaps.

The display is for visualization and gameplay only. It is not a navigation,
routing, warning, or traffic product. OpenStreetMap content and the normalized
road graph are an ODbL-derived database and retain visible attribution.
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
outside this surface-only layer. The shared Shortbread path remains one imagery
provider and one request stream, with a 2 MiB per-tile limit, 96-tile LRU, and
explicit 192 MiB / 4,000,000-rendered-vertex provider-session budgets. These
aggregate counters are lifetime session budgets, not resident-cache accounting.

The shoreline renderer preserves every source vertex with unit-weight,
open-clamped degree-one NURBS fragments. It suppresses synthetic MVT tile-edge
closure segments instead of drawing a glowing tile grid, retains holes and
multipart bodies, never downsamples, and rejects a tile before canvas mutation
if its 4,096-ring, 8,192-curve, 65,536-source-point, or 131,072-sampled-vertex
hard limit is exceeded. Telemetry exposes open/closed curves, clipped segments,
fully clipped rings, cap rejections, and zero source deviation.

Shortbread does not publish numeric lake/river/ocean elevations. The NURBS line
therefore means an exact source water boundary draped on the terrain, not a
measured per-body elevation isocontour. Likewise, the submerged contour shader
uses `height <= 0` in the active terrain provider's native reference. NOAA
ETOPO 2022 supplies EGM2008 heights; the optional Terrarium provider retains
its provider-native reference. EarthGrid does not mislabel both as universal
MSL or claim that elevated inland-lake beds are water-masked.

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
water style metadata, NURBS ring/curve/control/sample/cap telemetry, the
source-native-zero terrain-contour contract, and ocean/inland-water command and
vertex telemetry.
