Instructions: keep this file current as the WXGlobe terrain demo evolves. Record source limits and do not reintroduce retired RTMA endpoints without a new evidence-backed plan.

# WXGlobe Demo Plan

## Goal

- Render a token-free Cesium globe with a pole-to-pole NOAA ETOPO 2022 default and an optional public AWS Terrain Tiles detail source.
- Make the default view imagery-free: opaque black terrain with bright green lines of equal elevation.
- Preserve negative terrain heights so the same contours reveal NOAA ETOPO
  2022 bathymetry by default and ETOPO1 bathymetry in optional AWS mode.
- Keep the implementation modular, Vite-based, vanilla JavaScript, and suitable for the nested GitHub Pages path.

## Source boundaries

- Whole-Earth default: NOAA/NCEI's public `DEM_all` ArcGIS ImageServer pinned
  to the `ETOPO_2022_v1_60s_surface` mosaic. Request geographic EPSG:4326,
  signed 16-bit BIP heightmaps. This covers both poles and ocean bathymetry at
  one arc-minute / about 1.85 km north-south at the equator. Cap native source
  requests at geographic z6, the first level that captures the source spacing;
  Cesium may still create virtual upsampled descendants for screen-space error.
- ETOPO 2022 is NOAA's current global relief product, released under CC0 with requested NOAA/NCEI citation and DOI `10.25921/fd45-gt74`. It is explicitly not for navigation.

- Optional detail URL: `https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png`.
- Decode: `height = red * 256 + green + blue / 256 - 32768` meters.
- Useful tiles extend through z15. Native resolution varies by source: much
  land is SRTM-scale while ocean bathymetry is ETOPO1 at one arc-minute and is
  oversampled at high zoom.
- The AWS tile matrix is EPSG:3857 and therefore ends at ±85.05112878°. Use the NOAA default for a literal pole-to-pole view.
- Use the live US S3 endpoint. Do not depend on the registry's EU mirror until its unauthenticated object access works again.
- Preserve the publisher's exact required source-attribution block in an
  accessible local panel linked by the Cesium credit display.

## Terrain-mesh contract

- Use `257 × 257` endpoint posts for 256 dyadic intervals. NOAA requests pad
  each export by half a post so ArcGIS pixel centers land on Cesium vertices;
  exact `getSamples` strips repair the shared antimeridian and poles. A bounded
  numeric LRU canonicalizes active shared boundary vertices, including nested
  parent/child posts, without accumulating a whole-globe cache.
- AWS keeps decoded 256-cell Terrarium tiles in a bounded promise cache, loads
  a symmetric 3 × 3 halo, wraps longitude, clamps Web Mercator latitude, and
  bilinearly resamples `(i - 0.5, j - 0.5)` into 257 endpoint posts. Adjacent
  output edges and corners must be byte-identical.
- A TerrainProvider-shaped adapter exposes native request availability, returns
  `HeightmapTerrainData` with `childTileMask: 0` at z6/z15, and never uses
  `undefined` as a logical cutoff. Bounded retries are abortable; root failure
  is fatal, non-root terminal failure is degraded, and retired provider
  generations cannot update the current UI.
- Keep contour ink off the zero-width skirt texture boundary. This retains
  Cesium crack guards without drawing false straight contour meridians.

## Explicit exclusions

- RTMA, RAP, URMA, NOMADS, GRIB middleware, local weather data symlinks, and wind rendering are not part of this version.
- Blue Marble, OpenStreetMap, Carto, Cesium ion, and all other tiled imagery are absent from the default renderer.
- No PeerCompute networking or compute stub is included until the demo has a real distributed workload.

## Validation

- Pure Node tests cover ETOPO 2022 little-endian BIP/mask decoding, padded and
  pinned requests, pole/dateline repair, bounded same/cross-level boundary
  canonicalization, Terrarium decoding, 3 × 3 endpoint resampling, cache-race
  safety, native request caps/child masks, abortable retries, persistent failure
  diagnostics, telemetry, and the contour material contract against real
  Cesium terrain primitives where relevant.
- The focused build must emit the four Cesium runtime directories plus
  `LICENSE.md` and `ThirdParty.json` beneath `docs/wxglobe/cesium/`, and must not
  contain a domain-root `/cesium` asset dependency.
- The built-doc browser smoke must render current-generation terrain with zero
  imagery, no terminal failures, settled globe tiles, and actual scene-derived
  material/provider identities. It must switch NOAA→AWS, successfully fetch a
  real z15 terminal tile, prove request counters stabilize, then switch back to
  a newly rendered NOAA generation.
- Visually inspect whole-world and close bathymetry/land presets before release.
