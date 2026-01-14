Instructions: capture the wxglobe demo scope, TODOs, and dataset choices. Keep this file updated as the implementation evolves.

# wxglobe Demo Plan
- Goal: Cesium-based globe demo with a custom Terrarium TerrainProvider (AWS elevation-tiles Terrarium) supporting both ~30m (z<=14) and ~90m (z<=11) modes. Vanilla JS + Vite, no React/TS.
- PeerCompute: include a minimal hookup (NodeKernel scaffold + relay config loader) to align with other demos; keep compute/network minimal for now.
- UI: retro-terminal styling; controls to toggle 30m/90m source and basic layer toggles (base imagery from Cesium Ion default token-less Bing); show provider health (tile fetch errors).
- Cesium: copy Workers/Assets/ThirdParty/Widgets via vite-plugin-static-copy; set CESIUM_BASE_URL to `/cesium`.
- TerrainProvider: decode Terrarium tiles (height = R*256 + G + B/256 - 32768), return HeightmapTerrainData; clamp zoom to provider limits; handle tile fetch failures with graceful fallback.
- Data: use `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png` (30m) and a 90m variant by clamping zoom to 11 (Terrarium reuses same source at lower zoom for ~90m effective resolution).

# RTMA dataset notes (for 3D weather like windy.com + elevation)
- Source root: https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/
- RTMA/URMA directories (rtma2p5.*) are surface-only analyses (2.5 km CONUS); good for near-sfc winds/temp/pressure but **no vertical levels**.
- Best 3D candidate on the same host: RAP pressure-level grids under `/pub/data/nccf/com/rap/prod/rap.YYYYMMDD/rap.tHHz.awp130pgrbf00.grib2` (13 km CONUS, 3D pressure levels with UGRD/VGRD/HGT).
  - Variables: UGRD/VGRD at multiple pressure levels (1000–100 hPa), HGT (geopotential height) per level, ORO/ surface height.
  - Example URL: `https://nomads.ncep.noaa.gov/pub/data/nccf/com/rap/prod/rap.20260112/rap.t21z.awp130pgrbf00.grib2`.
  - Subset command (wgrib2): `wgrib2 rap.t21z.awp130pgrbf00.grib2 -match '(UGRD|VGRD|HGT):(pressure|surface)' -netcdf rap-levels.nc`
- Planned approach: ingest RAP pressure-level winds + heights for multi-altitude wind viz; fuse surface elevation from Terrarium to align the ground layer; keep RTMA surface winds as optional near-ground layer.

# Data source abstraction (wxglobe)
- Registry per source (id, title, region, resolution, cadence, dimension, variables, urlPattern, example, notes) lives in `src/dataSources.js`.
- Default: RTMA2p5 (CONUS surface) to avoid RAP CORS failures on load. RAP 13 km pressure levels remain available but require a proxy/mirror. Surface variants: RTMA2p5 (CONUS), HIRTMA (HI), PRRTMA (PR), GURTMA (Guam).
- Selection UI populates from the registry; renderer currently logs selection and shows metadata; decoding/fetch to be wired next with per-source handlers (GRIB2 subset via wgrib2/netcdf or client-side parser if feasible).
- WeatherManager (`src/weatherManager.js`) builds time-aware URLs and, for RAP, calls NOMADS `filter_rap.pl` to request a NetCDF subset (CONUS box, selected pressure levels/UGRD/VGRD/HGT). A module worker (`src/weatherWorker.js`) fetches and parses NetCDF (netcdfjs), samples the grid, and returns level data. RTMA variants remain stubbed until a surface pipeline is wired.
- CORS caveat: NOMADS `filter_rap.pl` does not send `Access-Control-Allow-Origin`, so client-side fetch fails in browsers. To use RAP live, add a proxy (dev server middleware) or pre-fetch/host subsets. Surface sources remain stubbed until proxied or mirrored.

# TODO (initial)
- [ ] Wire relay-config loader shared with other demos.
- [ ] Add terrain provider class + selector UI (30m vs 90m).
- [ ] Add basic Cesium view with provider status indicator.
- [ ] Decide on RTMA/RAP/URMA dataset and document fetch URLs/fields.
