# PeerCompute Geodata Service

This standalone Node 24/Fastify service publishes a fixed source catalog and a
bounded OpenStreetMap region adapter for the Earth and motorcycle demos. It is
not an unrestricted proxy, navigation service, traffic feed, or safety/weather
warning service.

## Routes

- `GET /healthz`
- `GET /api/v1/catalog`
- `GET /api/v1/geo/osm?bbox=s,w,n,e&layers=roads,buildings&vehicle=motorcycle`
- `GET /api/v1/cache/osm-shortbread/tilejson`
- `GET /api/v1/cache/osm-shortbread/:z/:x/:y.mvt`
- `GET /api/v1/cache/aws-terrarium/:z/:x/:y.png`

The catalog is generated in the canonical `@peercompute/geo-core` source order
used by EarthGrid. Its `data.sources` entries have exact source-ID parity, and
`data.layers` publishes every supported nowCOAST radar and satellite layer.
Each weather source's `layerIds` is derived from those same layer descriptors,
so satellite layers cannot silently disappear from source discovery.

The OSM route snaps the requested region outward before querying or caching,
rejects dateline-spanning boxes and boxes over 8 km per axis or 64 km², and
returns `peercompute.geo.osm-region.v1`. Roads, buildings, the directed
motorcycle graph, timestamps, raw OSM tags, height provenance, ODbL links, and
the non-navigation disclaimer remain explicit. Coordinate crossings become
junctions only when their ways share an OSM node ID.

Raw upstream JSON and the complete normalized UTF-8 response are independently
capped at 8 MiB by default. A response that reaches an upstream element/category
bound or exceeds the complete serialized-response bound fails with HTTP `422`
and asks the client to request a smaller region. The service never slices,
truncates, paginates, or caches a partial normalized region.

## Bounded source caching

The OSM region cache is limited to 128 entries and 128 MiB, with an 8 MiB
entry bound. Shortbread and Terrarium share a separate 512-entry, 128 MiB
cache: TileJSON and PNG responses are capped at 512 KiB and MVT responses at
2 MiB. Shortbread admission also caps selected decoded features at 25,000 and
coordinate positions at 1,000,000 per tile. Identical misses are coalesced and
pending loads reserve capacity before fetching.

Verified bytes retain strong SHA-256 ETags and support `If-None-Match`/`304`.
Shortbread is fresh for five minutes with a 24-hour stale-on-error bound;
Terrarium is fresh for seven days with a 30-day stale-on-error bound. Fixed
source routes have a 360-request-per-minute client budget. An Overpass cold
fill makes at most two attempts under one 25-second deadline, with one 150 ms
backoff, and retries only transport failures or HTTP 408, 429, and 5xx
responses. Schema, size, truncation, redirect, and other 4xx failures are not
retried.

Source hosts and paths are compiled into the service. Cache routes reject
query parameters and never accept a caller-provided URL or host. NOAA ETOPO
and nowCOAST remain browser-direct catalog sources; this service does not
provide an arbitrary NOAA or general-purpose proxy.

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `GEODATA_HOST` | `127.0.0.1` | Listener host. |
| `GEODATA_PORT` | `8788` | Listener port. |
| `GEODATA_CORS_ORIGINS` | Local Earth/motorcycle origins in development; empty in test/production | Comma-separated exact origins; wildcards are rejected. |
| `GEODATA_OVERPASS_URL` | unset | Fixed controlled/self-hosted Overpass interpreter URL. |
| `GEODATA_ALLOW_PUBLIC_OVERPASS` | `false` | Explicitly enables the low-volume `overpass-api.de` fallback in development/test only. |
| `GEODATA_USER_AGENT` | identifiable PeerCompute project URL | Bounded upstream identification header. |

Production remains OSM-unconfigured unless `GEODATA_OVERPASS_URL` is supplied.
The public `overpass-api.de` host family is rejected in production even when it
is supplied directly through `GEODATA_OVERPASS_URL`; production must use a
controlled/self-hosted endpoint. Configured URLs cannot contain credentials,
query parameters, or fragments. The service never logs request URLs, so exact
inbound coordinates do not enter its logs.

```bash
npm install --prefix services/geodata
npm --prefix services/geodata test
GEODATA_ALLOW_PUBLIC_OVERPASS=true npm --prefix services/geodata start
```

The public fallback is for bounded developer/demo use only. Production should
point `GEODATA_OVERPASS_URL` at a controlled compatible service and follow
OpenStreetMap attribution and usage requirements.
