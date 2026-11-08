Instructions: This file tracks the per-demo implementation plan for `demos/schrodinger`. Keep it aligned with `plan/branch/schrodinger-simulation.md` and record test results in `plan/log.md`.

# Schrodinger Demo Plan

## Goal
Ship a standalone Vite + vanilla JS + Three.js materials console that can run locally without a PeerCompute swarm, while exposing optional PeerCompute attach/publish behavior for property packets that can grow into solver-agnostic microphysics/closure results.

## First Slice
- WebGPU-generated hydrogenic orbital probability grid and WebGPU-sampled point cloud for selectable elements and quantum numbers.
- CPU-reference material property packets for water and a small set of common molecules across temperature/pressure conditions.
- Shared closure adapters convert material property packets to/from `ClosureState -> ClosureResult` summaries for multiscale consumers while preserving the standalone UI packet shape.
- WebGPU capability/probability-smoke path that reports whether browser WebGPU is available.
- WebGPU-first orbital probability grid and visual point sampler for the active cloud visualization, exposed as `peercompute.schrodinger.orbital-grid-webgpu.v0`. If WebGPU is unavailable, the standalone grid/cloud reports unavailable instead of using CPU fallback.
- WebGPU-first radial Schrodinger basis/Hamiltonian evaluator for the active one-electron orbital, exposed in the standalone stats panel. If WebGPU is unavailable, the standalone radial solve reports unavailable instead of using CPU fallback.
- Legacy CPU finite-difference radial tests and compact Multiscale diagnostic wiring still exist as validation/migration scaffolding until the Multiscale orbital consumer is moved to the WebGPU radial contract.
- Retro terminal UI with orbital, wavefunction/status, and water/material views.
- Deterministic Node tests for reference math, packet schema, and water phase/property behavior.
- Visual defaults and checks: the app opens in water/material-cell mode, H2O molecules render as one oxygen plus two hydrogens with O-H bonds, the viewport is the central work area, and the orbital sampler uses deterministic stratified spherical jitter to avoid grid-cell clumping.
- Molecule-structure visibility: reference templates emit `chemical.bondEvents` and render colored bond cylinders/legend entries for covalent and ionic bonds.
- Reactive atom sandbox: users can set temperature, pressure, and gravity, add counts of elements from the local periodic table, and watch toy covalent/ionic/metallic bond dynamics in the main viewport.

## Current Limits
- Orbital visualizations are WebGPU-evaluated hydrogenic/effective-charge approximations plus a WebGPU radial Hamiltonian/residual evaluator, not many-electron ab initio predictions.
- Water/material properties are reference-table/EOS approximations, not full molecular dynamics yet.
- Current molecule bonds are reference templates used for visualization and packet plumbing, not predicted quantum bond formation.
- Reactive atom dynamics are heuristic `toy-reactive-atoms-v0` rules. They support interaction design and state/visual plumbing, not validated quantum chemistry or thermodynamic closure.
- Current packets are material-property warm deltas plus shared closure summaries. They do not yet include strict unit/dimension metadata, closure Jacobians, or full conservation-impact audits required by the broader multiscale runtime.
- PeerCompute attach is optional and publishes compact material warm deltas under `materials` plus normalized closure deltas under `multiscale-closures` when a relay/session is available.
- The sedenion/Fano Reactor work can become a symbolic reaction-channel prefilter later, but it must be labeled separately from validated physical property estimators.

## Architecture Direction
- The Schrodinger demo should stay usable as a standalone visualizer, but its deeper role is a microphysics/closure provider.
- Do not hard-code the downstream assumption that SPH is the only consumer. Future packets should support MPM, SPH, finite-volume/AMR, combustion, plasma, and other solver families through a common closure contract.
- Future closure outputs should add units, validity ranges, provenance, uncertainty, optional Jacobians, and conservation-impact reports before any scientific-mode integration.
- Phase-change and reaction work should move toward free-energy/EOS-style closures where pressure, sound speed, phase rates, latent heat, species rates, and heat release are derived consistently from local state rather than independent constants.
- Future material state should include density, internal energy, temperature, phase fractions, species fractions, reaction progress, strain/deformation, and local structure descriptors such as crystallinity, coordination, damage, or porosity.
- Live quantum/atomistic work should be an adaptive refinement path for uncertain/interesting states; the per-frame demo should query fast closures, tables, or surrogates.
- Interactive-mode approximations and scientific-mode validation gates must stay visibly separate in the UI and packets.

## Next Planning Slice
- Migrate Multiscale radial/orbital diagnostic consumers onto the standalone WebGPU-first contracts, then remove the legacy CPU finite-difference path from runtime consumers.
- Extend the shared `ClosureState`/`ClosureResult` schema with explicit unit/dimension metadata and scientific-mode validity tolerances without breaking the current UI.
- Add a toy free-energy/phase closure for one material, clearly labeled as `toy-closure`, to validate data flow and conservation accounting.
- Add tests for smooth phase-fraction evolution, latent-heat energy accounting, and out-of-domain uncertainty reporting before visualizing reactive dynamics.
- Replace or wrap `toy-reactive-atoms-v0` with a closure-backed reaction/phase model only after those conservation tests exist.
