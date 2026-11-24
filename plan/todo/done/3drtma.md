Instructions: preserve the useful Cesium terrain lineage from the historical
`3drtma` branch, but do not restore RTMA or another weather feed without a new
availability, licensing, architecture, and validation review. Keep WXGlobe's
default renderer imagery-free and its source/coverage limits visible.

# 3DRTMA Branch Goal And WXGlobe Pivot

## User direction recorded 2026-08-22

- Create a Cesium globe renderer with terrain and bathymetry for the whole
  planet.
- Default to black terrain with green curves of equal elevation and no tiled
  imagery.
- Reuse the published `3drtma` demo work where useful, while omitting RTMA data
  because that feed is no longer offered.

## Archaeology result

- `origin/3drtma` points to `7f08141f`; its useful pieces were the Cesium Vite
  setup, Terrarium height decoder/provider concept, and terminal visual style.
- The old folder does not build unchanged against the current repository. Its
  obsolete `@peercompute` import reaches a missing legacy libp2p dependency,
  while the RTMA/RAP workers, GRIB payload, weather controls, and local data
  symlink no longer match the requested or available data path.
- WXGlobe therefore keeps the historical folder identity and selectively ports
  terrain concepts into current modular ES6 code instead of merging the stale
  branch wholesale.

## Current implementation boundary

- Default: NOAA/NCEI ETOPO 2022 Ice Surface, one arc-minute, CC0, geographic
  pole-to-pole topography and bathymetry, with native source requests capped at
  Cesium geographic z6. Cesium may render virtual upsampled descendants above
  that source-request cap.
- Optional detail: the public US AWS/Mapzen Terrarium endpoint through z15;
  mixed land sources and ETOPO1 ocean bathymetry, limited to Web Mercator
  ±85.051° and subject to composite attribution/service-availability limits.
- No RTMA, RAP, URMA, NOMADS, GRIB, wind field, tiled color imagery, Cesium ion
  token, PeerCompute stub, or chaos-lab dependency is part of this demo.
- Follow-up weather work should be a separate data-source decision and should
  compose with WXGlobe rather than being embedded in its terrain provider.
