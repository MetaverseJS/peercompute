llm instructions for this file:
This file contains a high level plan for the project. with development phases and feature / architecture implementation goals for each phase. critical path etc. 

## Project Goal
- Build a WebGPU materials simulation engine that eventually covers solids/fluids/gases/plasmas with thermodynamics, basic chemistry, and EM fields, starting from MLS-MPM water and integrating with or replacing the current toychest-style sim.  This simulation engine should also be able to support astrophysics like n-body gravity simulation black hole and star formation and interactions between all of these items. these different simulation domains should be implemented in modular webgpu compute pipelines with varying timesteps depending on practicality. these modular domains should all be able to operate on the same underlying datastructure. 

this library should be compatible with the peercompute library found in /home/cos/projects/peercompute/peercompute/


## Branch Goal
- Build a modular WebGPU materials simulation engine using MLS-MPM (inspired by WebGPU-Ocean) that can run in/alongside `demos/toychest.html`, starting with water and extending to other materials and water’s three phases.

## High-Level Plan

### Phase 1: Architecture & Refactoring (Engine Core)
- **Refactor `src/world.js`:** Extract current rigid body logic into a `RigidDomain` class implementing a minimal `DomainInterface`.
- **Create `Engine` class:** Implement the main loop and `SimulationContext` that manages the WebGPU device and sequences domains.
- **Outcome:** The existing `toychest` demo runs exactly as before, but driven by `Engine -> RigidDomain`.

### Phase 2: Core Infrastructure & Prototyping
- **Fixed-Point Atomics Prototype (Critical Path):**
  - Write a standalone WebGPU test to validate `atomicAdd` on `i32` buffers for P2G scattering.
  - Test scaling factors ($2^{16}$ vs $2^{20}$) and check for overflow/precision loss against a CPU reference.
- **Data Structures:** Implement the `Particle` (160-byte extended) and `Grid` (16-byte) buffer structures defined in `imp-arch.md`.
- **Material Registry:** Create the initial struct layouts for material properties.

### Phase 3: Liquid MVP - Headless
- **Kernels:** Implement P2G (using fixed-point), Grid Update (Tait EOS for pressure, gravity), and G2P (APIC transfer).
- **Constitutive Model:** Tait EOS for weakly compressible fluid: `P = B * ((ρ/ρ₀)^γ - 1)`
- **Headless Validation Harness:**
  - Create a Node.js/headless browser script that steps the engine without rendering.
  - **Tests:** Verify Mass Conservation, Momentum Conservation (closed box), and Energy Bounds.
- **Outcome:** A running simulation that numerically behaves like water.

### Phase 4: Multi-Material Constitutive Model Framework
**This is the key architectural change for supporting diverse materials.**

- **Material Type Enum:** Define `BRITTLE_SOLID`, `ELASTIC_SOLID`, `LIQUID`, `GAS`, `GRANULAR`
- **Per-Particle Properties:** Add `material_type`, `damage`, `mu`, `lambda` to particle buffer
- **Constitutive Dispatch Shader:** Implement stress computation branching on material type:
  ```wgsl
  switch (material_type) {
      case BRITTLE_SOLID: { /* Linear Elastic + Fracture */ }
      case ELASTIC_SOLID: { /* Neo-Hookean / Corotational */ }
      case LIQUID:        { /* Tait EOS */ }
      case GAS:           { /* Ideal Gas Law */ }
      case GRANULAR:      { /* Drucker-Prager */ }
  }
  ```
- **Outcome:** Single simulation loop handles all material types via constitutive model dispatch.

### Phase 5: Brittle Solid (Ice) Implementation
- **Linear Elastic Model:** σ = λ·tr(ε)·I + 2μ·ε for small strain
- **Fracture Criterion:** Principal stress-based damage accumulation
- **Damage System:**
  - Per-particle damage variable [0,1]
  - Damage rate when max principal stress > tensile strength
  - Stiffness reduction: `effective_mu = mu * (1 - damage)`
- **Phase Transition:** Fully damaged ice (d=1.0) converts to liquid particles
- **Stability:**
  - Implement sub-stepping for stiff materials
  - Consider implicit integration for production quality
- **Outcome:** Ice that maintains shape, fractures under stress, and shatters into water.

### Phase 6: Gas Phase Implementation
- **Ideal Gas EOS:** P = ρRT (pressure proportional to density × temperature)
- **Low Viscosity:** Near-zero shear stress
- **Expansion Behavior:** High-temperature particles repel strongly
- **Outcome:** Steam/gas that expands to fill available space.

### Phase 7: Granular Materials (Optional)
- **Drucker-Prager Model:** Friction-based yield surface
- **Parameters:** Friction angle, cohesion
- **Applications:** Sand, snow, soil
- **Outcome:** Materials that pile and flow like granular media.

### Phase 8: Phase Transitions (Thermodynamics)
- **Temperature Advection:** Heat moves with particles
- **Temperature Diffusion:** Heat conducts between neighboring particles (via grid)
- **Phase Transition Logic:**
  ```
  if (T < T_freeze - hysteresis) → become SOLID
  if (T > T_boil + hysteresis) → become GAS
  else if (was SOLID and T > T_freeze + hysteresis) → become LIQUID
  else if (was GAS and T < T_boil - hysteresis) → become LIQUID
  ```
- **Latent Heat:** Energy absorbed/released during phase change
- **Outcome:** Water that freezes, melts, boils based on temperature.

### Phase 9: Demo Integration & Visualization
- **Particle Renderer:** Color by material type, temperature, or damage
- **Fluid Renderer:** Screen-space fluid rendering for liquids
- **Multi-Material Scenes:** Ice cube melting in water, boiling pot, etc.
- **UI Controls:** Material spawner, temperature brush, property sliders
- **Integration:** Wire MPM solver into `toychest` alongside rigid body solver.

### Phase 10: Testing, Profiling, and Stabilization
- **Unit Tests:** Coverage for math helpers, buffer layouts, constitutive models
- **Conservation Tests:** Mass, momentum, energy validation per material type
- **Benchmark Scenes:** Dam break, ice compression, gas expansion
- **Profiling:** WebGPU timestamp queries to optimize P2G/G2P workgroup sizes
- **Documentation:** Finalize `imp-log.md` with validation results

## Critical Path

```
Phase 1 → Phase 2 → Phase 3 (Liquid MVP)
                          ↓
                    Phase 4 (Multi-Material Framework) ← ARCHITECTURAL KEY
                          ↓
              ┌───────────┼───────────┐
              ↓           ↓           ↓
        Phase 5      Phase 6      Phase 7
        (Ice)        (Gas)        (Granular)
              └───────────┼───────────┘
                          ↓
                    Phase 8 (Phase Transitions)
                          ↓
                    Phase 9 (Demo Integration)
                          ↓
                    Phase 10 (Testing)
```

Phase 4 is the architectural lynchpin—once the constitutive dispatch framework exists, adding new material types is incremental.

## Phase Transition Strategy (Plan B - Emergent Phases)
- Treat `materialType` as element identity; phase is emergent from state (temperature, pressure, density) via an order parameter/phase fraction.
- Add phase fraction/order-parameter field; latent heat handled via energy budget rather than hard switches; constitutive blending based on phase fraction (solid/liquid/gas).
- Properties derived per element from state: density with thermal expansion, bulk/shear moduli (solids), bulk+viscosity (liquids), gas constant (gases). Clamp/soften for stability at dt≈0.1s.
- Keep per-material branches only for complex microstructures (e.g., wood, carbon fiber) on top of phase blending.
- Frontend: element dropdowns spawn two blocks (50/50). Phase, pressure, and temperature drive behavior; no material flip on phase change.
- Testing: headless harness to compare derived properties and gross behaviors (density, speed of sound, ideal-gas pressure) against reference tables per element/phase.

## Key Design Decisions

### Why Linear Elastic for Ice (Not Neo-Hookean)
- Neo-Hookean is designed for rubber-like materials with large elastic deformation
- Ice deforms minimally before fracturing (brittle)
- Linear elasticity is valid for small strains and computationally simpler
- High stiffness + fracture gives proper brittle behavior

### Why Per-Particle Material Properties
- Allows material mixing (ice shattering into water particles)
- Enables damage evolution per particle
- Supports heterogeneous materials
- Minimal memory overhead (8 extra floats per particle)

### Why Unified MPM Loop
- All materials share P2G/G2P transfers
- Grid operations are material-agnostic
- Multi-material interaction emerges naturally from shared grid
- Single codebase to maintain
