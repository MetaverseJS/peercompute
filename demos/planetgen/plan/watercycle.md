llm instructions for this file: this file is the detailed implementation plan for the WebGPU water cycle + weather system (evaporation → clouds → precipitation, winds, pressure). Keep it concrete and actionable. When updates happen, append “Status / Changes” notes instead of rewriting the whole plan so it remains a living roadmap.

# WebGPU Water Cycle / Weather Plan

## Goal
Implement a physically grounded, GPU-simulated water cycle that drives:
- Evaporation from sunlit oceans (and weaker land evap via soil moisture).
- Cloud formation via condensation (uplift + cooling).
- Precipitation with realistic spatial patterns (orographic rain + convergence).
- Large-scale wind from pressure gradients + Coriolis.
- High/low pressure systems that evolve with latent heat + temperature.

The simulation runs in WebGPU compute pipelines and feeds Three.js rendering via a low-res weather texture.

## Constraints & Design Choices
- **WebGPU compute, Three.js WebGL render**: WebGPU→WebGL interop is not portable, so we **read back** a compact RGBA buffer and upload to `THREE.DataTexture`.
- **Spherical planet, 2D grid**: Use an equirectangular grid (`lon × lat`) with longitude wrap and clamped poles. Use spherical cell sizes (dx varies with `cos(lat)`).
- **Column model (single-layer)**: Start with a 2D “atmospheric column” per cell: temperature, vapor, cloud water, rain, pressure anomaly, wind, soil moisture.
- **Stability first**: Semi‑Lagrangian advection + relaxed (“nudged”) pressure/wind avoids explosions at interactive time scales.

## State & Units (v0)
Grid size (recommended start): `256×128` (≈33k cells).

Per-cell fields (in SI-ish units where reasonable):
- `T` (K): column temperature proxy.
- `q` (kg/kg): specific humidity.
- `qc` (kg/kg): cloud liquid water.
- `rain` (kg/kg): precipitating water proxy (for display + deposition).
- `p` (Pa): surface pressure anomaly proxy.
- `u,v` (m/s): horizontal wind components.
- `soil` (0..1): surface wetness proxy (deposition + evap).

Static per-cell surface inputs:
- `ocean` (0/1): ocean mask.
- `elev01` (0..1): elevation normalized above sea level.
- optional later: `albedo`, `landClass`, `heatCapacity`, `seaSurfaceTemp`.

## Core Physics (v0)
### Insolation
Compute normal from lat/lon; `I = max(dot(n, sunDirLocal), 0)`.

### Radiative equilibrium temperature (nudging)
`T_eq(lat, alt, I) = T0 - ΔT_lat*|sin(lat)| + ΔT_sun*I - lapse*alt`
`T ← mix(T, T_eq, dt*tempRelax)`

### Evaporation
- Ocean: `q += ocean * evapOcean * I * max(0, qsat(T) - q) * dt`
- Land (weak): `q += (1-ocean) * evapLand * I * soil * dt`

### Lift cooling (cloud genesis driver)
Two lift sources:
- **Convergence lift**: `w_conv ≈ max(0, -div(u,v)) * H` (H ≈ scale height).
- **Orographic lift**: `w_orog ≈ max(0, u*dhdx + v*dhdy)` with slopes from elevation.
Cooling: `T -= Γ * (w_conv + w_orog) * dt` (Γ ≈ 9.8 K/km).

### Condensation / Cloud water
Use Clausius‑Clapeyron saturation mixing ratio:
- if `q > qsat(T)`: `cond = (q - qsat) * clamp(dt/τ_cond, 0..1)`
  - `q -= cond`, `qc += cond`
  - `T += (L/Cp)*cond` (latent heating; scaled if needed for stability)
- if `q < qsat` and `qc > 0`: allow evaporation back toward saturation with longer timescale.

### Precipitation + deposition
Autoconversion threshold:
- `pr = max(0, qc - qcThresh) * clamp(dt/τ_precip, 0..1)`
- `qc -= pr`, `rain = rain*exp(-dt/τ_rainDecay) + pr`
- `soil += pr * soilGain * (1-ocean)` then `soil` decays over ~days.

### Pressure & Wind
Pressure anomaly target from temperature/humidity/altitude:
`p_eq = -a(T - T0) - b*q - c*alt`
`p ← mix(p, p_eq, dt*τ_p)`

Wind from geostrophic balance (regularized near equator):
- `dp/dx, dp/dy` via central differences with spherical dx/dy.
- `f = 2Ω sin(lat)`, clamp `|f| >= fMin`
- `u_geo = -(1/(ρf)) dp/dy`, `v_geo = (1/(ρf)) dp/dx`
- `u,v ← mix(u,v, u_geo,v_geo, dt*τ_w)` then apply drag and max-wind clamp.

### Advection
Semi‑Lagrangian backtrace with spherical cell sizes:
- `xB = x - u*dt/dx(lat)`
- `yB = y - v*dt/dy`
Bilinear sample from previous state for `(T,q,qc)` (optionally also `p` later).

## WebGPU Compute Architecture
### Buffers
- `stateA/stateB`: storage buffers, 2×`vec4<f32>` per cell.
- `surface`: storage buffer, `vec4<f32>` per cell `(ocean, elev01, rawHeight, _)`.
- `params`: uniform buffer as `array<vec4<f32>, N>` (avoid padding pitfalls).
- `outRGBA`: storage buffer `array<u32>` packed RGBA8 (little-endian).
- `readback[2]`: MAP_READ buffers for async readback ping-pong.

### Pipelines
**v0**: single compute pipeline that:
1. Reads `stateSrc` + `surface`.
2. Computes `stateDst`.
3. Packs display channels into `outRGBA`.

Future split (v1+):
- separate passes for: wind/pressure, advection, microphysics (condense/precip), packing.
- optionally move “packing” to storage texture (if rendering path becomes WebGPU).

### Dispatch
Workgroup: `8×8` threads; dispatch `ceil(W/8) × ceil(H/8)`.

### Readback cadence
- Simulate every frame (dt scaled), but **read back at ~6–10 Hz** for UI/visuals.
- Use double-buffered readback to avoid mapping buffers still in use.

## Rendering Integration
### Weather texture channels (RGBA8)
- `R`: cloud density proxy (from `qc`)
- `G`: rain intensity proxy
- `B`: pressure anomaly normalized
- `A`: soil wetness proxy

### Volumetric clouds
- Render as a spherical shell with raymarching in fragment shader.
- Sample `weatherMap` (`R`,`G`) by mapping direction → lat/lon UV.
- Add 3D noise for detail; modulate density by vertical profile in shell.
- Darken/thicken where `rain` is high; light by sun direction.

### Surface wetness
- Inject `uWeatherMap` into planet shader and darken land by `max(rain, soil)` while avoiding snow/ice regions.

## Validation / Debug Plan
- Add a debug toggle to show `pressure` or `wind` as false-color overlays on a thin sphere.
- Add a one-shot “step sim” button + pause to inspect stability.
- Basic unit tests for CPU preprocessing (downsample/triplanar sampling).

## Roadmap (Next Iterations)
1. **Two-layer atmosphere** (boundary layer + cloud layer): better humidity transport and realistic cloud bases.
2. **Mass/energy consistency**: explicit budgets for vapor/cloud/precip and better latent heating scaling.
3. **Snow/ice precipitation**: temperature-dependent phase change; accumulate snowpack and melt.
4. **Ocean heat capacity**: slow SST, diurnal cycle, land/ocean contrast.
5. **Improved dynamics**: shallow-water-like momentum with explicit vorticity, jet formation, and less “diagnostic” wind.
6. **Orographic rain shadows**: refine lift using true slopes and wind direction; add lee-side drying.
7. **Visual rain**: GPU particle/line rain in active precip regions + splash/atmospheric haze.

## Status / Changes
- 2025-12-14: v0 implementation landed (WebGPU compute + readback weather texture, volumetric cloud shader sampling weather map, surface wetness modulation).
- 2025-12-15: Added Water Cycle config controls (enable, speed, update rate, evap/precip/wind multipliers, wetness strength) and wired them into the sim + surface shading.
- 2025-12-15: Implemented v1 iteration pieces: two-layer humidity (boundary layer + free troposphere), snow/rain phase split (cold precip no longer counts as rain/wetness), ocean thermal inertia for temperature relaxation, and a terrain debug view + pause/step controls for inspection.
- 2025-12-15: Added an aux weather texture (temp, snowpack, wind) alongside the main weather map, implemented snowpack accumulation + melt, and extended terrain debug to visualize temp/snow/wind; terrain snow shading now includes dynamic snowpack.
- 2025-12-15: Added visual rain streak FX driven by the weather rain channel + local wind tilt, and updated the volumetric cloud shader to advect detail using the simulated wind field (aux map).
- 2025-12-15: Added rain haze in the atmosphere shader by sampling the weather rain channel to boost Mie scattering in rainy regions; exposed a HUD control for haze strength.
- 2025-12-15: Made the number of vertical moisture layers configurable (1–4). Default is 2 (boundary + free troposphere), with optional upper layers for richer transport.
- 2025-12-16: Added HUD controls for volumetric cloud raymarch min/max steps and ray bundling (pixel block) sizing; wired through to the volume cloud shader.

## Configuration (HUD)
- `Water cycle enabled (WebGPU)`: gates simulation updates and whether the weather texture is used for rendering.
- `Run simulation`: pauses/resumes updates while keeping the current weather texture visible.
- `Step simulation`: advances the sim by a fixed dt and forces a readback (useful while paused).
- `Weather debug view`: overrides terrain shading to show `cloud/rain/pressure/soil/temp/snow/wind`.
- `Weather speed (minutes/sec)`: maps to `timeScale = minutesPerSec * 60`.
- `Weather update rate (Hz)`: maps to `readbackIntervalS = 1 / hz` (visual texture refresh cadence).
- `Moisture layers`: sets the number of vertical moisture layers in the sim (1–4). (Evaporation feeds the bottom layer; condensation targets layer 1 when present.)
- `Evaporation strength`: multiplies ocean + land evaporation rates.
- `Precipitation strength`: multiplies precipitation/autoconversion rate.
- `Wind strength`: multiplies wind relaxation rate and max wind.
- `Surface wetness strength`: sets terrain shader `uWeatherStrength` (darkens wet land by `max(rain, soil)`).
- `Ocean thermal inertia`: multiplies ocean temperature relaxation rate (lower = slower ocean temperature response).
- `Visual rain`: enables/disables GPU rain streaks near the camera (driven by the weather rain channel).
- `Rain FX strength`: scales rain streak density/opacity and volume sizing.
- `Rain haze`: boosts near-ground atmospheric haze in rainy regions.

## v2 (Pivot): True 3D Voxel Atmosphere (Equal-Volume Cells)
### Why pivot from 2D lat/lon columns
- The 2D equirect grid has inherent **pole singularities** (longitude collapse) and produces artifacts when fields vary with longitude near the poles.
- A real volumetric cloud field is better represented as a **3D grid**, which also helps with “clouds only visible from ground” (thin-shell path length issues from orbit).

### Core idea
- Simulate atmosphere as a **Cartesian voxel grid** over a cube centered on the planet.
- Voxels are **equal size and volume everywhere**; we simulate only voxels inside a **spherical shell mask**:
  - `rInner(dir) ≈ planetRadius + terrainHeight(dir)` (optionally start with `planetRadius` only for stability)
  - `rOuter = planetRadius + atmoThickness`
- WebGPU pattern: **read neighbors, write only your own cell** via **ping‑pong** buffers. This avoids race conditions and removes the need for locks/atomics for the core update.

### Grid + atlas packing (GLSL-friendly)
- Resolution configurable: `Nx × Ny × Nz` (start with cubic `N³`).
  - Suggested defaults: `N=64` (262k voxels) or `N=80` (~512k) depending on GPU.
- Physical extent: `extent = rOuter` in planet-local units (same space as cloud raymarch).
- To render in WebGL/Three without `sampler3D`, pack Z slices into a **2D atlas**:
  - `tilesX = ceil(sqrt(Nz))`, `tilesY = ceil(Nz / tilesX)`
  - `atlasW = tilesX * Nx`, `atlasH = tilesY * Ny`
  - Slice `z` maps to tile `(z % tilesX, z / tilesX)`; within-tile UV from `(x,y)`.

### State per voxel (v2.0 minimal set)
We keep it compact at first so performance scales with `N³`:
- `T` (K): temperature proxy
- `qv` (kg/kg): vapor
- `qc` (kg/kg): cloud condensate
- `qr` (kg/kg): precipitating water
- `p` (Pa): pressure anomaly proxy (or derived diagnostic at first)
- `vel` (m/s): `vx, vy, vz` (diagnostic wind is OK initially; later make it prognostic)
- Optional later: aerosols/CCN, ice phase, turbulence/K, etc.

### Update scheme (compute passes)
Start stable with 2–3 passes; split only when necessary:
1. **Advection (semi‑Lagrangian)**: backtrace using `vel` and sample `(T,qv,qc,qr)` from `stateSrc`.
2. **Forcing + microphysics**:
   - Radiative relaxation toward `Teq` (lat + insolation + altitude).
   - **Evaporation**: inject `qv` into cells near the surface (within `Δr` of `rInner`) with strongest effect over sunlit oceans.
   - **Condensation**: if `qv > qsat(T)` convert to `qc`, apply latent heating.
   - **Autoconversion/precip**: convert `qc → qr` beyond threshold; apply `qr` decay.
   - **Sedimentation**: move `qr` “down” (radially inward) by one voxel per step (or fractional via flux) and **deposit to surface** when hitting ground (update `soil`).
3. **Dynamics (wind/pressure)** (start diagnostic, evolve to prognostic):
   - Compute `p` target from `T/qv/alt`.
   - Drive `vel` from `-∇p` + drag; add simple Coriolis using planet rotation.
   - Buoyancy/convection: add upward `vy` where warm/moist; clamp + damp for stability.

All passes use the same concurrency rule: **each invocation writes only its own voxel**.

### Boundary conditions
- Inside planet (`r < rInner`): clamp state to “solid” (no moisture; strong damping).
- Above top of atmosphere (`r > rOuter`): clamp to vacuum; damp `vel`.
- Near boundaries: use one-sided differences; apply damping layers to prevent reflections.

### Outputs (for visuals + surface coupling)
- **Cloud volume atlas RGBA8** (readback):
  - `R`: cloud density (from `qc`, optionally combined with `qv` and vertical profile)
  - `G`: rain intensity (from `qr`)
  - `B`: optional (e.g. `p` or `T` for debug)
  - `A`: optional (e.g. relative humidity)
- **Surface 2D weather map** (separate pass or extracted at readback time):
  - `rainSurface`, `soil`, `snow` (if ice phase enabled), and optionally `surfaceWind`.
  - This keeps existing wetness shading / rain FX / rain haze working while clouds use the true 3D volume.

### Debug + validation (v2)
- Add “slice debug” (Z slice index) + “show shell mask” modes.
- Budget checks: global sums of `(qv+qc+qr)` should be stable except for explicit sources/sinks.
- Performance: measure ms per dispatch at `N=48/64/80` and adjust workgroup size (e.g. `4×4×4` or `8×4×4`).

## Status / Changes
- 2025-12-15: Started v2 pivot planning toward a true 3D voxel atmosphere (equal-volume cells + atlas-packed cloud volume) to eliminate pole artifacts and improve orbit visibility.
- 2025-12-15: Implemented a first v2 prototype: `WaterCycleVolumeSystem` runs an N³ voxel atmosphere in WebGPU compute, outputs a slice-atlas 3D cloud volume plus derived 2D weather/aux maps, and water-cycle clouds now have their own toggle and can raymarch density by sampling the atlas in world-position space.
- 2025-12-15: Fixed v2 low-resolution artifacts: treat voxels as intersecting the atmosphere shell (radial half-extent) so surface sampling isn’t biased cold, and clamp cloud raymarch to the shell segment so clouds are visible from orbit with stable step sizes.
- 2025-12-15: Tuned v2 microphysics for stability: increased ocean/land evaporation, further slowed condensation→rain autoconversion, rain/cloud decay, and reduced precipitation fall speed so moisture and clouds persist instead of vanishing a split second after startup.
- 2025-12-15: Stabilized v2 time integration: added per-frame substepping with a CFL-style cap based on voxel size and max wind so advection can’t jump into empty/out-of-shell voxels (a major cause of “weather disappears instantly”).
- 2025-12-15: Fixed v2 terrain coupling bugs that made maps look like they “disappeared”: collapse pass now samples columns starting at terrain-aware ground radius (not `planetRadius`), and the volume state now initializes with a humid lower troposphere so clouds can form immediately instead of waiting on slow evaporation spin-up.
- 2025-12-15: Added a 3D volume atlas debug view option to the Weather debug selector; when selected it overlays the packed atlas in-screen so we can see if the volume produces qc/qr even when the column maps look empty.
- 2025-12-15: Cranked v2 moisture sources and relaxed sinks: stronger evap (esp. ocean), easier condensation, slower rain-out/evap, lower fall speed, seeded boundary-layer qc/qv, and increased collapse sampling to 28 layers so 2D maps pick up thin clouds; boosted atlas contrast again.
- 2025-12-15: Added vertical slice thickness control (km) and stronger high-res scaling: evap/condense boosted with resolution, rain-out slowed and fall speed reduced with resolution, atlas contrast scales with `64/N`, and raymarch steps increase with N to keep high-res clouds visible.
- 2025-12-16: Added auto weather scaling (HUD toggle) that steps volume resolution/readback Hz/raymarch bundle up or down based on frame-time budget.

## Upcoming (Seasons, Moon, Surface coupling)
- Axial tilt & seasons: add axial tilt slider and orbital day-of-year to drive sun declination; update sunDir each frame from tilt + orbital position so hemispheres alternate seasons.
- Physical sun/moon: position sun by orbital angle; add a moon with orbital plane/phase; compute moon phase/illumination for rendering and potential tidal coupling later.
- Cloud altitude/surface alignment: ensure `altCenter` uses `planetRadius + seaOffset + terrain` in sim and collapse; recompute inner/outer radii per run to match sea level; clamp dt to voxelSize/maxWind to prevent blowout at high N.
- Precipitation deposition: accumulate snow physically (temp-based) into a snowpack buffer that can flow into glaciers; route rain/snowmelt into soil/rivers/lakes and feed erosion/wetness/greening (wetness → darker albedo/greener biomes, dryness → desert).
- Render/debug: keep atlas/slice debug; add a slice-index debug uniform for clouds to confirm sampling; add per-frame max qc/qr diagnostics for high N.
