llm instructions for this file:
This file contains the architecture plan for the project. update as necessary

# Architecture Design

## High-level structure
- **Core Engine (`Engine` / `SimulationContext`):**
  - Manages WebGPU device/adapter (reusing `src/device.js`).
  - Manages the main timeline/scheduler.
  - Sequences "Domains" (solvers) through a unified step interface.
  - Decoupled from specific physics logic.

- **Domains (Solvers):**
  - Implement a common `DomainInterface`:
    - `createBuffers(device)`
    - `createPipelines(device, sharedCode)`
    - `step(encoder, params)`
    - `getExposedBuffers()`
  - **`domains/rigid`:** Wraps the existing rigid-body logic (currently `src/world.js`).
  - **`domains/mpm`:** New MLS-MPM solver for fluids/deformables.
  - **`domains/astro`:** Future N-body/gravity solvers.
  - **`domains/em`:** Future Electromagnetism solvers.

- **Data Model:**
  - Structure-of-Arrays (SoA) for maximum throughput.
  - 16-byte alignment for all per-particle/per-cell data.
  - Explicit byte offsets defined in schema to ensure interoperability with peercompute.

## Buffer Schema (v1)

### MPM Particle Buffer (128 bytes/particle)
Standardized layout for MLS-MPM particles. 16-byte alignment.

| Field | Type | Offset (floats) | Byte Offset | Notes |
|-------|------|-----------------|-------------|-------|
| `position` | `vec3<f32>` | 0-2 | 0 | + 1 float padding (used for material_id) |
| `material_id`| `f32` | 3 | 12 | (uint cast to float) |
| `velocity` | `vec3<f32>` | 4-6 | 16 | + 1 float padding (used for phase) |
| `phase` | `f32` | 7 | 28 | 0=solid, 1=liquid, 2=gas |
| `mass` | `f32` | 8 | 32 | |
| `volume` | `f32` | 9 | 36 | Computed per-step for fluids |
| `temperature`| `f32` | 10 | 40 | Kelvin |
| `padding` | `f32` | 11 | 44 | Explicit padding for alignment |
| `F` (DefGrad)| `mat3x3<f32>`| 12-20 | 48 | Deformation Gradient (9 floats, row-major) |
| `C` (Affine) | `mat3x3<f32>`| 21-29 | 84 | APIC Affine Matrix (9 floats, row-major) |
| `padding` | `vec2<f32>` | 30-31 | 120 | Align to 128 bytes |

### MPM Grid Buffer (16 bytes/cell)
Dense grid for MLS-MPM.

| Field | Type | Offset (floats) | Byte Offset | Notes |
|-------|------|-----------------|-------------|-------|
| `velocity` | `vec3<f32>` | 0-2 | 0 | Accumulated momentum (during P2G) / Velocity (after update) |
| `mass` | `f32` | 3 | 12 | Accumulated mass |

**Note on P2G Scattering:** WebGPU lacks floating-point atomics.
- **Strategy:** Use `atomicAdd` on `i32` buffers.
- **Scaling:** Float values are scaled by a fixed factor (e.g., $2^{16}$ or $2^{20}$) and cast to integer.
- **Reconstruction:** During grid update, read `i32`, cast to float, and multiply by inverse scale factor.
- **Baseline (WebGPU-Ocean):** Uses 80-byte AoS particle structs (pos, vel, C), 16-byte cells (vx, vy, vz, mass), fixed-point multiplier 1e7, workgroup size 64, dt=0.2, stiffness=3, rest_density=4, dynamic_viscosity=0.1, grid up to 64^3.

### Material Registry
- Structs defining physical properties per material ID:
  - Density, stiffness (E/Bulk), Poisson's ratio.
  - Viscosity, drag.
  - Thermal conductivity, heat capacity.
  - Phase transition temperatures and latent heat.

### Extended Particle Buffer for Multi-Material Support (160 bytes/particle)
To support brittle crystalline solids, granular materials, and proper phase transitions:

| Field | Type | Offset (bytes) | Notes |
|-------|------|----------------|-------|
| `position` | `vec3<f32>` | 0 | xyz position |
| `material_type` | `u32` | 12 | Enum: BRITTLE_SOLID, ELASTIC_SOLID, LIQUID, GAS, GRANULAR |
| `velocity` | `vec3<f32>` | 16 | xyz velocity |
| `phase` | `u32` | 28 | 0=solid, 1=liquid, 2=gas (for phase-changing materials) |
| `mass` | `f32` | 32 | per-particle mass |
| `volume0` | `f32` | 36 | **Initial** volume (reference configuration) |
| `temperature` | `f32` | 40 | Kelvin |
| `damage` | `f32` | 44 | Fracture state [0,1] for brittle materials |
| `F` (DefGrad) | `mat3x3<f32>` | 48 | Deformation Gradient (48 bytes with alignment) |
| `C` (Affine) | `mat3x3<f32>` | 96 | APIC Affine Matrix (48 bytes with alignment) |
| `mu` | `f32` | 144 | Per-particle shear modulus (can vary) |
| `lambda` | `f32` | 148 | Per-particle bulk modulus |
| `padding` | `vec2<f32>` | 152 | Align to 160 bytes |

## Constitutive Model Architecture

The key insight for unified multi-material simulation: **all materials use the same MPM loop, only stress computation differs**.

### Constitutive Model Dispatch System

```
┌─────────────────────────────────────────────────────────┐
│                    MPM SIMULATION LOOP                  │
│                                                         │
│  1. Clear Grid                                          │
│  2. Particles → Grid (P2G transfer)                     │
│  3. Grid velocity update (forces, boundaries)           │
│  4. Grid → Particles (G2P transfer)                     │
│  5. Update particle positions                           │
│  6. ★ Compute stress using CONSTITUTIVE MODEL ★         │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              CONSTITUTIVE MODEL DISPATCH                │
│                  (per particle material_type)           │
│                                                         │
│  BRITTLE_SOLID (ice/glass):                            │
│    - Linear Elastic stress: σ = λ·tr(ε)·I + 2μ·ε       │
│    - Small strain: ε = (F + Fᵀ)/2 - I                  │
│    - Principal stress fracture criterion               │
│    - Damage accumulation: d += rate when σ > strength  │
│    - Damaged particles → reduced stiffness or fluid    │
│                                                         │
│  ELASTIC_SOLID (rubber):                               │
│    - Neo-Hookean: τ = μ(F·Fᵀ - I) + λ·J·(J-1)·I       │
│    - Corotational variant for stability                │
│                                                         │
│  GRANULAR (sand/snow):                                 │
│    - Drucker-Prager elastoplasticity                   │
│    - Friction angle, cohesion parameters               │
│    - Hardening/softening based on plastic strain       │
│                                                         │
│  LIQUID (water):                                       │
│    - Tait EOS: P = B·((ρ/ρ₀)^γ - 1)                   │
│    - Stress: σ = -P·I (isotropic pressure only)        │
│    - Optional viscosity: σ += μ·(∇v + ∇vᵀ)            │
│                                                         │
│  GAS (steam/air):                                      │
│    - Ideal Gas: P = ρRT or P ∝ ρ·T                    │
│    - Very low viscosity                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Brittle Solid (Ice) Implementation Strategy

Ice and other crystalline solids require special handling that differs from Neo-Hookean:

1. **Linear Elastic Model** (valid for small strains before fracture):
   ```wgsl
   // Small strain tensor (valid when deformation is small)
   let eps = 0.5 * (F + transpose(F)) - mat3x3f(1,0,0, 0,1,0, 0,0,1);
   
   // Linear elastic stress
   let trace_eps = eps[0][0] + eps[1][1] + eps[2][2];
   let stress = lambda * trace_eps * I + 2.0 * mu * eps;
   ```

2. **Principal Stress Fracture**:
   ```wgsl
   // Compute principal stresses via eigenvalue analysis
   let principal_stresses = eigenvalues(stress);
   let max_principal = max(principal_stresses);
   
   // Fracture criterion: tensile strength exceeded
   if (max_principal > tensile_strength) {
       damage += damage_rate * dt;
       damage = min(damage, 1.0);
   }
   
   // Apply damage to stiffness
   let effective_mu = mu * (1.0 - damage);
   let effective_lambda = lambda * (1.0 - damage);
   ```

3. **Phase Transition on Full Damage**:
   ```wgsl
   if (damage >= 1.0) {
       material_type = LIQUID;  // Shattered ice becomes water
       F = mat3x3f(1,0,0, 0,1,0, 0,0,1);  // Reset deformation gradient
   }
   ```

### Material Property Reference Values

| Material | E (GPa) | ν | Tensile Strength (MPa) | Notes |
|----------|---------|---|------------------------|-------|
| Ice | 9-10 | 0.33 | 0.7-3.0 | Brittle, crystalline |
| Glass | 50-90 | 0.22 | 20-170 | Very brittle |
| Rubber | 0.001-0.1 | 0.49 | N/A | Hyperelastic |
| Steel | 200 | 0.30 | 250-2000 | Ductile yield |
| Water | N/A | N/A | N/A | Bulk modulus ~2.2 GPa |

### Stability Considerations for Stiff Materials

1. **CFL Condition**: `dt < C * sqrt(ρ/E) * dx`
   - For ice (E=10 GPa, ρ=920 kg/m³, dx=0.01m): dt_crit ≈ 3μs
   - **Implication**: Either use implicit integration or accept unrealistically soft "ice"

2. **Practical Approaches**:
   - **Sub-stepping**: Multiple physics steps per render frame
   - **Implicit Integration**: Solve `(I - dt²·K)·v = b` for velocity
   - **Softened Parameters**: Use E/1000 for visual "ice" that's stable
   - **Hybrid Solver**: Switch to rigid body/constraint solver when phase=solid

## Emergent Phase / Order Parameter Plan (Plan B)
- **Element Identity:** `materialType` encodes element (H, O, Na, K, Mg, Al, Si, Ca, Ti, Fe, Pb, etc.); phase is inferred from state, not by mutating `materialType`.
- **State Fields:** Temperature, density/pressure, plus a phase fraction/order parameter to blend solid/liquid/gas; latent heat handled via energy budget instead of hard switches.
- **Property Derivation:** Per element, derive densities (thermal expansion), bulk/shear moduli (solids), bulk + viscosity (liquids), gas constant (gases) each step from current state; clamp/soften for stability (target dt ≈ 0.1s).
- **Constitutive Blending:** Stress model chooses solid/liquid/gas branch based on phase fraction; per-material branches remain only for microstructured/anisotropic materials (wood, carbon fiber).
- **Future Coupling:** Extend element tables with atomic mass, heat capacity, charge/ionization, conductivity, reaction energetics to support chemistry, EM, and radioactivity. Phase fraction can feed reaction/EM property changes.

## Compute Pipelines (MPM Sequence)

1.  **Clear Grid:** Zero out mass/momentum grid buffers.
2.  **P2G (Particles to Grid):**
    - Scatter mass and momentum ($v + C \cdot dist$) to 3x3x3 neighboring nodes.
    - Use quadratic B-spline weights.
    - **Critical:** Use fixed-point atomics for scattering.
3.  **Grid Update (Forces & BCs):**
    - Convert fixed-point grid data back to float.
    - Compute grid velocities ($v = p / m$).
    - Apply external forces (gravity).
    - Apply constitutive model (Stress $\to$ Force).
        - Fluids: Tait EOS (Pressure only).
        - Solids: Neo-Hookean or similar.
    - Apply boundary conditions (collide with box/shapes).
4.  **G2P (Grid to Particles):**
    - Gather velocity from grid (FLIP/PIC/APIC blend).
    - Update deformation gradient ($F$) and affine matrix ($C$).
    - Advect particles ($x += v \cdot dt$).
5.  **Phase Update (Thermodynamics):**
    - Update temperature (conduction/advection).
    - Check phase transition thresholds -> update phase ID and material params.

## Integration strategy (near term)
- Wrap existing rigid-body `World` into a `RigidDomain` (thin adapter) to avoid churn.
- Introduce a simple `Engine` that sequences domains (Rigid + MPM) in order; upgrade to a timeline scheduler later.
- Keep MLS-MPM core headless-testable; demos consume exposed buffers. Start with side-by-side rendering in toychest (rigid + MPM) via shared adapter.

## Scheduling and Timesteps
- **Master Timeline:** Controls global time.
- **Substepping:** MPM requires small $dt$ (CFL condition). Rigid bodies can run larger $dt$.
- **Engine Loop:**
  ```javascript
  while (lag >= dt_min) {
     for (domain of domains) {
       domain.step(encoder, dt_min);
     }
     lag -= dt_min;
  }
  ```

## Peercompute Compatibility
- **Contract:**
  - Buffers are raw `ArrayBuffer`s.
  - Layouts are strictly defined (as above).
  - No dependence on runtime object wrappers; data is "Just Bytes".
- **Interop:**
  - Allow passing `GPUBuffer` handles or mapped `ArrayBuffer`s to peercompute nodes.
  - Metadata (JSON) describes the schema version and active particle count.

## Rendering/Demo Integration
- **Headless First:** Core logic depends only on `src/device.js` and WGSL.
- **Visualization:** `demos/toychest` or similar reads GPU buffers (copy to CPU or direct vertex buffer binding) to render sprites/meshes.
