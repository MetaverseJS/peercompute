# EarthGrid Real-Data Platform

EarthGrid is the reusable, non-aviation Earth/GIS base for PeerCompute demos.
It combines the existing NOAA/AWS elevation providers and bright parallel
topographic rings with official OpenStreetMap Shortbread context, bounded local
OSM roads/buildings from the geodata service, and optional time-qualified NOAA
nowCOAST radar or satellite imagery.

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

## Validation

```bash
npm --prefix demos/earth test
npm --prefix demos/earth run build
npm run test:earth-platform
```

`window.__earthDemo.getState()` exposes bounded source status, actual OSM
freshness/provenance/notes, rendered/omitted counts, chosen local radius,
same-origin/external/unconfigured backend mode, terrain telemetry, and weather
time for browser gates.
