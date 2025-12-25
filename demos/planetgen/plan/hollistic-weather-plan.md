Instructions: Holistic weather/ocean plan for PlanetGen using PeerCompute + WebGPU. Keep this as the authoritative plan for the holistic mode. Append status notes; do not rewrite history.

# Holistic Weather + Ocean Plan (PeerCompute)

## Goals
- Replace the current static, symmetric wind/ocean behavior with a physics-based, emergent system.
- Couple ocean, atmosphere, and water cycle with land/ice/albedo feedback.
- Scale across WebGPU and PeerCompute for high concurrency and interactive framerates.
- Keep the model modular so components can be swapped or refined without full rewrites.

## Why Start Over
- Current wind/ocean patterns are static and lack asymmetry from heating, land, and clouds.
- Waves advect across the globe without realistic energy sources/sinks.
- The water cycle lacks dynamic coupling between heat, humidity, and circulation.

## Research Targets (needs network access to verify latest)
We need to validate and adapt current state-of-the-art methods to a WebGPU-first, real-time environment.
- Atmosphere: primitive equations (hydrostatic), split-explicit or semi-Lagrangian cores. Reference families: ICON, MPAS, FV3.
- Ocean: Boussinesq primitive equations or shallow-water; split-explicit barotropic/baroclinic steps. Reference families: MOM6, NEMO, ROMS, MITgcm.
- Coupling: bulk flux formulations (latent/sensible heat, momentum) and simplified radiation balance.
- Microphysics: Kessler-type warm rain + optional ice/snow phase for temperature thresholds.
- Turbulence/eddy: Smagorinsky or K-profile parameterization for stable subgrid mixing.

If network access is approved, pull citations and parameter values from current papers and model docs.

## Simulation Architecture
### Grid Choice (fix pole pathologies)
- Use a cubed-sphere or icosahedral grid for global fields.
- Maintain a consistent indexing scheme for seamless GPU tiling and halo exchange.
- Keep an optional equirect render grid for visualization only (sample from sim grid).

### Core State
Atmosphere (per cell per layer, 2-4 layers initially):
- Temp (K), pressure (Pa), humidity (qv), cloud water (qc), rain (qr)
- Wind (u, v) on a staggered C-grid
- Optional: ice/snow, cloud fraction, aerosol proxy

Ocean (per cell, 1-2 layers initially):
- Sea surface height (eta), currents (u, v), temperature (SST)
- Optional: salinity, mixed layer depth, sea ice fraction

Land (per cell):
- Soil moisture, albedo, heat capacity, snowpack

### Coupling
- Fluxes every step (or every N steps):
  - Momentum: wind stress drives ocean surface currents.
  - Heat: shortwave/longwave + sensible heat + latent heat.
  - Moisture: evaporation (ocean/land) and precipitation deposition.
- Albedo feedback: clouds/snow/ice modulate absorbed solar radiation.

### Time Integration
- Atmosphere: split-explicit or semi-Lagrangian advection, Coriolis, pressure gradient.
- Ocean: shallow-water or reduced primitive equations with Coriolis and bottom friction.
- Use CFL-limited substeps to avoid blowups; separate barotropic and baroclinic updates.
- Use energy-conserving advection schemes where feasible.

## WebGPU Compute Pipeline
### Data Layout
- Structure-of-arrays buffers for coalesced access.
- Use ping-pong buffers per subsystem (atmo, ocean, land).
- Store halos in separate buffers for peer exchange.

### Passes (per tick)
1) Radiation and surface energy balance
2) Atmosphere advection + pressure solve + Coriolis
3) Microphysics (condense, precip, cloud fraction)
4) Ocean advection + Coriolis + friction
5) Coupling (flux exchange, moisture, heat, momentum)
6) Diagnostics + packing for render maps

### Multi-Rate Updates
- Fast: advection + winds (every frame)
- Medium: clouds + precipitation (2-4 Hz)
- Slow: ocean temperature and large-scale currents (0.5-1 Hz)

## PeerCompute Concurrency
### Partitioning
- Tile the global grid into patches with 1-2 cell halos.
- Each peer gets one or more tiles (work-stealing ready).
- Use PeerCompute DataState warm deltas for halo exchange and global diagnostics.

### Scheduling
- Use ComputeManager per tile; GPU hub for shared device, isolated workers for headless steps.
- Exchange halos asynchronously; integrate when all neighbors arrive or after a timeout.
- Use deterministic seeds for reproducible tests.

### Failover
- If peers drop, dynamically reassign tiles or fall back to local compute.

## Rendering Integration
- Use compact textures (cloud, rain, pressure, wind, SST) for planet shaders.
- Use volumetric cloud raymarch only when 3D volumes are enabled.
- Ocean surface waves: driven by wind stress and a wave spectrum update (Phillips/JONSWAP).

## Implementation Phases
### Phase 0: Grounding
- Extract current water/wind/ocean code into a dedicated module hierarchy.
- Add a diagnostic UI to show wind vectors, SST, cloud density, and precipitation.

### Phase 1: New Dynamics Core
- Implement cubed-sphere grid and conversion to render UVs.
- Build atmosphere and ocean solvers with minimal layers.
- Integrate Coriolis, pressure gradient, and drag.

### Phase 2: Coupled Water Cycle
- Add humidity, condensation, precipitation, and soil moisture.
- Add surface flux coupling and albedo feedback.

### Phase 3: PeerCompute Scaling
- Tile-based scheduling with halo exchange.
- Integrate compute budgets and auto-scaling tiers.

### Phase 4: Visual Fidelity
- Improve clouds with volumetric sampling.
- Integrate wave spectra and foam generation from wind and storms.

## Tests (runtime and automated)
- Conservation: mass of water (qv + qc + qr + soil + ocean) should remain within tolerance.
- Stability: no NaN/Inf; bounded wind speeds and temperatures.
- Emergence: detect zonal jet formation and gyre circulation metrics.
- Regression: fixed seed, fixed dt produces stable summary hashes (cloud/rain coverage).
- Performance: tile scheduling keeps frame time under budget at target resolution.

## Status / Changes
- 2025-12-25: Drafted holistic plan document and added Holistic mode entry in UI; mode currently falls back to 3D volume sim until the new solver is implemented.
