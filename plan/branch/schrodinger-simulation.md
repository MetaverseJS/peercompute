Instructions: This file captures the branch goals, feasibility boundaries, implementation plan, validation gates, and integration notes for the Schrodinger/materials simulation initiative. Keep claims tied to measured tolerances. Do not describe the demo as physically accurate beyond the validation gates it actually passes.

# Schrodinger Materials Simulation

## Branch Goal
Build a PeerCompute + WebGPU materials simulation demo that can act as a validated microphysics/closure provider for later SPH, MPM, finite-volume, dynamics, planetary, and galactic-scale simulations.

The branch should start with a scientifically defensible core:
- small quantum reference solvers for atoms and tiny molecules;
- validated molecular dynamics / equation-of-state paths for water and material properties;
- a property packet interface that higher-level simulations can consume at a fixed cadence;
- PeerCompute sharding for expensive kernels and property aggregation;
- headless tests before visual polish.

## Shared Conversation Impact: Multiscale Runtime Framing
The shared ChatGPT conversation dated around May 15, 2026 reframes the larger initiative in a way that should steer this branch: PeerCompute should become a multiscale physics runtime with plug-in solvers, not a single SPH-centered universal simulator.

Impact on this branch:
- Treat Schrodinger/atomistic work as a **microphysics/closure service**. It should answer local questions like EOS, phase stability, reaction barriers, transport coefficients, conductivity, opacity, moduli, ionization, uncertainty, and validity range.
- Treat material "constants" as state-dependent fields. Pressure, stress, sound speed, bulk/shear modulus, viscosity, thermal conductivity, conductivity, latent heat, yield strength, and reaction rates should be functions of local density, internal energy, temperature, strain, composition, phase fraction, reaction progress, and local structure.
- Treat SPH as one downstream solver, not the only downstream solver. The same packets should be consumable by SPH, MPM, finite-volume AMR/hydro, low-Mach combustion, PIC/plasma patches, FEM/solid mechanics, and N-body/gravity-coupled regions.
- Preserve a conservative state contract before deep integration: mass, momentum, energy, charge, species, phase fraction, and magnetic flux where applicable must not be silently created/destroyed by cross-solver transfers.
- Add explicit unit/dimension metadata, validity-domain metadata, provenance, uncertainty, and optional Jacobian/derivative information to future closure outputs. The current material packet is the warm-delta seed, not the final closure contract.
- Separate **interactive mode** from **scientific mode**. Interactive mode may use reference tables/surrogates and larger timesteps. Scientific mode must require conservation audits, tolerances, deterministic replay, hashes/provenance, and uncertainty reporting.
- Use PeerCompute first for asynchronous/loosely-coupled work: parameter sweeps, ensemble runs, closure table generation, surrogate inference, active-learning microphysics jobs, validation/replay, visualization streaming, and patch refinement. Do not assume browser P2P is the right place for tightly coupled AMR/MHD ghost-cell exchange.
- Plan for adaptive fidelity patches. Quantum/atomistic refinement should run only when local closure uncertainty or event triggers justify the cost.

This changes the strategic language from "Schrodinger feeds SPH" to "Schrodinger/materials emits validated closure results into a solver-agnostic multiscale runtime." The immediate demo remains the same standalone console, but the contract it grows toward should be `state + conservation + closure + coupling + validation + distributed execution`.

### Full Chat Addendum: Reactive Material Closure
The pasted full chat log adds a more concrete near-term material model: use a thermodynamically consistent, quantum-informed reactive material state model rather than fixed property constants.

The preferred core is a free-energy model:

```text
f = f(rho, T, species, phase_fraction, strain, reaction_progress, structure_descriptor)
```

Then derive related quantities from the same source where possible:
- pressure and sound speed from EOS/free-energy derivatives;
- entropy, heat capacity, latent heat, and phase stability from thermal derivatives;
- chemical potentials and reaction affinities from species derivatives;
- stress/moduli from strain derivatives;
- phase and reaction rates from kinetic models tied back to free-energy differences/barriers.

For SPH/MPM-style particles, the evolving local state should include:

```text
rho
specific_internal_energy
temperature
velocity
strain_or_deformation_state
phase_fractions
species_mass_fractions
reaction_progress
structure_descriptor  // crystallinity, coordination, damage, local order, porosity
```

The runtime closure query should return:

```text
pressure
temperature
stress_tensor
sound_speed
bulk_modulus
shear_modulus
viscosity
thermal_conductivity
electrical_conductivity
phase_rates
species_rates
reaction_rates
latent_heat_terms
reaction_heat_terms
uncertainty
validity
```

Phase changes should use smooth phase fractions such as `solid + liquid + vapor = 1` rather than abrupt material id switches. Energy updates must include latent heat, and reactions must consume chemical free energy while updating species, temperature, pressure, and transport consistently.

Recommended fidelity ladder:
- **Level 1 fast closure:** table, analytic model, reduced reaction network, Gaussian process, or neural surrogate queried every macro step.
- **Level 2 atomistic/reactive solver:** ReaxFF, classical MD, or ML interatomic potential for representative state clusters near transitions/reactions.
- **Level 3 quantum labeler:** DFT, AIMD, DFPT/phonons, NEB barriers, or high-level quantum chemistry used sparingly to label uncertain or novel states.

Implementation order should be numerical/reference first, neural surrogate second. The first closure path should use deterministic integrators, analytic/reference potentials, EOS/free-energy tables or formulas, reaction-network kinetics, and conservation tests. Neural MD or ML interatomic potentials should enter after those baselines exist, as optional accelerators/interpolators with provenance, validity ranges, uncertainty estimates, and fallback numerical closures.

Active refinement trigger examples:
- near phase boundary;
- high reaction affinity;
- high surrogate disagreement/uncertainty;
- state outside closure validity range;
- unusual shock/strain/temperature/composition;
- rapid local energy release;
- possible nucleation, decomposition, radiation damage, or charge-transfer event.

### Emergent Base-Layer Intent
The target is not to script macro effects such as "fire is on" or "water suppresses fire." The target is for local microphysics state to create those macro behaviors when the environment allows it.

For a campfire/water-balloon scenario, the base layer should evolve representative local material states:
- fuel/oxygen/water/vapor/product species fractions;
- phase fractions and latent heat;
- temperature, pressure, density, internal energy, and reaction progress;
- reaction heat release, transport coefficients, and suppression/cooling source terms;
- optional charge/ionization/radical state where the model tier supports it.

The SPH/MPM/flow layer should then carry mass, momentum, heat, and species so visible behavior emerges from the coupled source terms: buoyant flame motion, hot-gas rise, water sloshing/spill, steam generation, cooling, and combustion shutdown. Each SPH particle or grid cell represents many molecules, not a single atom. Atomistic/Schrodinger/MD patches are used for closure sampling, validation, and high-interest local refinement, while the real-time macro scene runs on coarse-grained reactive material states.

The same pattern should extend upward through the full runtime scale ladder. This branch owns the lowest closure-producing layer, so it must emit data that can be aggregated by coarse reactive material cells, SPH/MPM/finite-volume solvers, human-scale scene solvers, planetary solvers, solar-system solvers, galactic solvers, and supergalactic/cosmological solvers. The branch should therefore prefer explicit units, conservation deltas, validity domains, uncertainty, provenance, and compact state hashes over display-only fields.

## Current Implementation Status
- Initial standalone demo scaffold exists at `demos/schrodinger`.
- The first local UI runs as a Vite + vanilla JS + Three.js terminal console on port `5184`.
- Reference modules still cover hydrogenic orbital densities, analytic reference energies, water/material property packets, element packets, and packet validation.
- The standalone UI now uses a WebGPU-first orbital probability grid and visual point sampler for the active cloud visualization through `peercompute.schrodinger.orbital-grid-webgpu.v0`, with storage-buffer density evaluation, workgroup reductions, GPU normalization, WebGPU hash-importance point sampling, and explicit unavailable status instead of CPU fallback when WebGPU is unavailable.
- The standalone UI now uses a WebGPU-first one-electron radial Schrodinger basis/Hamiltonian evaluator for the active orbital and reports energy, analytic-energy error, Hamiltonian residual, radial node count, mean radius, samples, and validity warnings through `peercompute.schrodinger.radial-webgpu-eigensolver.v0`. If WebGPU is unavailable, the standalone radial solve reports unavailable instead of running a CPU fallback.
- The older CPU-reference radial finite-difference eigensolver remains validation/migration scaffolding and still feeds compact Multiscale diagnostic fields until that consumer is moved to the WebGPU radial contract.
- Browser WebGPU is probed through a small probability-density compute shader and the radial Hamiltonian compute passes are reported in the UI when available.
- PeerCompute attach is optional; when attached, the current property packet is published as a warm delta under the `materials` scope, and a shared `ClosureState -> ClosureResult` adapter also publishes a normalized closure delta under `multiscale-closures`.
- Visual pass: the demo now opens in water material-cell mode by default, renders explicit H2O molecule groups as O + 2H with O-H bonds, uses the center viewport as the primary work area, and uses stratified spherical jitter to reduce orbital point-cloud grid clumping.
- Bond visibility pass: shared molecule templates now drive both packet `chemical.bondEvents` and Three.js rendering, with visible covalent/ionic bond cylinders and a bond legend for water, NaCl, and the current reference molecules.
- Reactive sandbox pass: the demo now includes `toy-reactive-atoms-v0`, a real-time heuristic atom sandbox where users can set temperature, pressure, and gravity, add counted elements from the local periodic table, and observe toy covalent/ionic/metallic bonding dynamics such as 5 O + 10 H forming H2O groups.
- Sedenion/Fano review: the sedenion periodic-table paper and existing `demos/fano-reactor` exact model should inform a symbolic chemical interaction layer, but must not replace validated Schrodinger/MD/property estimators.
- Remaining work before stronger scientific claims: move Multiscale radial/orbital diagnostics onto the standalone WebGPU contracts, add stable finite-grid time/imaginary-time wavefunction evolution, water MD/phase validation, calibrated molecular/atomistic force or reaction models, and distributed sharding validation.

## Feasibility And Accuracy Stance
The requested end state spans several different physics regimes. A single real-time browser demo cannot honestly produce first-principles, chemically accurate predictions for arbitrary atoms, molecules, water phase changes, optical properties, electromagnetic response, conductivity, elastic moduli, radioactivity, and interactions all from the time-dependent Schrodinger equation.

The plan therefore separates accuracy tiers:
- **Tier A: analytic / exact reference problems.** Hydrogenic atoms, particle-in-box, harmonic oscillator, and tiny Pauli Hamiltonians must match analytic or CPU-reference results.
- **Tier B: validated empirical models.** Water phase behavior, thermodynamics, optical constants, conductivity, and moduli are produced from named force fields, equations of state, or reference tables with explicit tolerances.
- **Tier C: real-time interactive approximation.** WebGPU kernels feed the live multi-scale sim. These are allowed to be approximate, but every property packet must report model id, tolerance status, and freshness.
- **Tier D: interaction prototypes.** Toy dynamics may be used to test UI, state shape, visualization, and control ergonomics, but must be labeled as heuristic and cannot feed scientific-mode closure consumers.

This is the only practical way to keep the demo useful without overclaiming. The Schrodinger layer is a small-system calibrator and explainer; the water/continuum layer is a validated molecular/continuum model.

The closure-service framing strengthens this boundary: quantum/atomistic solvers generate or validate local closures, while macro solvers evolve conserved state. They are coupled through explicit packets, validity reports, and conservative transfer operators rather than by pretending the Schrodinger equation runs the whole simulation.

## Context Read For This Plan
- PeerCompute architecture: `NodeKernel`, `NetworkManager`, `StateManager`, layered `DataState`, `ComputeManager`, and `GPUHubManager`.
- Existing demo surfaces: `Fano Reactor` for algebraic chemistry, `WebGPUPhys` for MLS-MPM material simulation, and `PlanetGen` for WebGPU water/weather and atmospheric optics.
- Existing WebGPU physics buffers: MPM particle state already contains material type, phase, temperature, damage, moduli, density, and phase fraction.
- MoonLab: C/WASM quantum simulator with state-vector, tensor-network, VQE, chemistry, H2/LiH/H2O Pauli Hamiltonian scaffolds, WebGPU/WASM planning, and a website `Schrodinger Sim` orbital demo in `bindings/javascript/demo/src/orbitals/OrbitalDemo.tsx`. Useful as reference math, UI/visualization inspiration, and validation source, not as a direct browser drop-in at first.
- Eshkol: compiler-integrated AD, tensor/math, cost-model, GPU dispatch, and deterministic memory concepts. Useful later for differentiable potential fitting or generated kernels, not a phase-1 dependency.
- Infinite Context Coder: used to inspect MoonLab's architecture summary and confirm MoonLab is already registered in ICC.

## Non-Goals For The First Approval Slice
- No claim of general ab initio chemical accuracy for arbitrary molecules.
- No full periodic DFT, Hartree-Fock, coupled-cluster, or path-integral MD in browser in the first slice.
- No radioactivity-from-electronic-Schrodinger modeling. Radioactivity is a nuclear/isotope decay model and should be separate.
- No coupling into SPH/planetary/galactic demos until the property packet contract and water validation gates exist.
- No TypeScript, React, or non-Vite toolchain additions.

## Proposed Demo Location
Use a new standalone Vite demo:
- `demos/schrodinger/`
- docs build output: `docs/schrodinger/`
- plan folder: `demos/schrodinger/plan/`

The UI should use the repo's retro terminal style. The first screen should be the usable simulation console/visualizer, not a landing page.

The demo must also run as a standalone visualization without requiring a live PeerCompute swarm. PeerCompute attach/sharding should be optional from the UI so the same page can work as:
- a local educational/validation visualizer;
- a single-node WebGPU simulation workbench;
- a distributed property-provider session when peers are available.

## MoonLab Website Demo Findings
MoonLab's website `Schrodinger Sim` is a good conceptual starting point for the standalone visualization, but not a direct codebase starting point for PeerCompute:
- It is React + TypeScript, while this repo requires vanilla JS and no React/TypeScript.
- It renders a Three.js orbital point cloud with orbit controls, adaptive extent, shell coloring, continuous sampling from a 3D probability grid, element selection, and controls for quantum numbers `n`, `l`, and `m`.
- Its main orbital density path computes hydrogen-like amplitudes analytically on the CPU with optional approximate screening/exchange, relativistic/spin-orbit, and correlation/mixing tweaks.
- Its MoonLab WASM path normalizes state vectors, computes measurement probabilities, and can use WebGPU for some probability/circuit paths with CPU fallback.
- Its DMRG path solves a TFIM spin-chain ground state and uses that probability distribution to modulate orbital sampling. That is a valid visualization idea, but it should not be described in our demo as a molecule/atom Schrodinger solver for water or general chemistry.
- It includes a standalone worker (`public/moonlab-worker.js`) that is useful as a pattern for isolation and fallback, but importing that worker would bring MoonLab build artifacts and licensing/versioning questions into this repo.

Decision: port the useful ideas, not the stack. Recreate the visualization in Vite vanilla JS + Three.js, backed first by local CPU reference code and then by PeerCompute/WebGPU kernels. Keep any MoonLab WASM bridge as a later, separately approved comparison backend.

## Architecture

### Core Modules
- `src/core/complex.js`: CPU reference complex arithmetic and vector helpers.
- `src/core/grids.js`: finite-difference grids, boundary conditions, and normalization helpers.
- `src/quantum/atomSolver.js`: hydrogenic and small finite-grid Schrodinger reference solvers.
- `src/quantum/webgpuWaveSolver.js`: WGSL kernels for complex wavefunction evolution and imaginary-time relaxation.
- `src/quantum/pauliHamiltonian.js`: compact Pauli-term representation compatible with MoonLab-style VQE references.
- `src/chemistry/reactionGrammar.js`: optional symbolic reaction-channel layer that can consume Fano Reactor / sedenion descriptors and emit candidate bond classes into `chemical.bondEvents`.
- `src/md/forceFields/`: force-field parameter packs and pair-potential code.
- `src/md/waterModel.js`: water molecule layout, charges/sites, constraints, and phase-state hooks.
- `src/md/propertyEstimators.js`: thermodynamic, optical, EM, conductivity, and modulus estimators.
- `src/materials/propertyPacket.js`: public property packet schema.
- `src/peercompute/scheduler.js`: PeerCompute sharding and warm-delta publication.
- `src/visualization/orbitalCloud.js`: Three.js orbital density point cloud based on validated CPU/WebGPU probability grids.
- `src/visualization/wavefunctionView.js`: density slices/isosurface-style views for finite-grid wavefunction runs.
- `src/visualization/waterPhaseView.js`: molecule/property/phase overlay for the water cell.
- `src/ui/terminalConsole.js`: retro terminal controls, diagnostics, and validation status.

### Standalone Visualization Modes
- **Orbital cloud mode:** MoonLab-inspired atom/orbital view with element selection, `n/l/m` controls, shell/radial-node coloring, normalization stats, reference-energy error, and backend indicator (`webgpu-radial`, `webgpu-grid`, `peercompute-sharded`; no CPU fallback in the standalone radial solve).
- **Wavefunction grid mode:** small finite-difference Schrodinger references, including density/phase slices, norm drift, and imaginary-time energy trend.
- **Water cell mode:** molecule/phase-change visualization with temperature/pressure controls, phase label, density/viscosity/thermal/optical/mechanical packet readouts, and explicit out-of-domain warnings.

The standalone demo should render nonblank and remain interactive with PeerCompute disabled. Network/distributed state should be an attachable capability, not a prerequisite for basic visual inspection.

### Hot/Warm/Cold State Mapping
- **Hot GPU buffers:** wavefunction tiles, particle positions, velocities, forces, neighbor grids, property accumulators.
- **Warm CPU deltas:** property packets, closure results, model ids, validation status, uncertainty, task timings, peer shard ownership, sampled observables, conservation diagnostics.
- **Cold persistence:** reference tables, closure tables, seeds, calibration results, scenario presets, saved validation runs, provenance manifests.

### Solver-Agnostic Closure Contract
Future material packets should evolve into closure results that macro solvers can call without caring whether the source is a table, analytic formula, MD run, quantum probe, surrogate, or PeerCompute shard.

Minimum future closure fields:
- input local state hash, model id, parameter hash, and code hash;
- units/dimensions for every returned field;
- pressure, temperature, sound speed, stress, transport coefficients, phase rates, species rates, reaction rates, source terms, free-energy/chemical-potential metadata, and optional Jacobians where meaningful;
- validity-domain report, uncertainty estimate, and provenance;
- conservation impact report for mass, momentum, energy, charge, species, and phase fraction.

The existing `createMaterialPropertyPacket` remains the first warm-delta packet for the standalone demo. Shared adapters in `demos/shared/closureContract.js` convert property packets to/from `ClosureResult` without replacing the UI packet shape. Do not overload either packet with large field arrays; large state stays in hot buffers or cold tabular assets.

### Property Packet Contract
Every low-level simulation output must be serializable and consumable by SPH/MPM/dynamics layers:

```js
{
  materialId: "water.tip4p2005",
  sampleId: "cell-42",
  modelTier: "empirical-md",
  timestamp,
  validUntil,
  state: {
    temperatureK,
    pressurePa,
    phase,              // solid | liquid | gas | mixed | plasma | isotope-mixture
    composition,        // element/isotope/molecule fractions
    densityKgM3
  },
  mechanics: {
    bulkModulusPa,
    youngsModulusPa,
    shearModulusPa,
    viscosityPaS,
    surfaceTensionNpm
  },
  thermal: {
    heatCapacityJkgK,
    thermalConductivityWmK,
    latentHeatJkg,
    eosParams
  },
  optical: {
    refractiveIndex,
    absorptionRgb,
    scatteringRgb,
    polarizability
  },
  electromagnetic: {
    dielectricConstant,
    electricalConductivitySpm,
    magneticSusceptibility
  },
  chemical: {
    reactionRates,
    bondEvents,
    ph,
    ionFractions
  },
  nuclear: {
    isotopeFractions,
    activityBqKg,
    decayHeatWKg,
    radiationSourceTerms
  },
  validation: {
    status,             // reference-pass | approximate | out-of-domain
    referenceSet,
    tolerances,
    warnings
  }
}
```

Keep the packet compact enough for warm deltas. Large field arrays stay in hot GPU buffers.

## Solver Stack

### Quantum Layer
Start with small systems that have hard references:
- Hydrogenic atom energies and simple orbital densities.
- Particle-in-box and harmonic oscillator finite-difference tests.
- Imaginary-time evolution to ground state with CPU and WebGPU parity.
- Tiny Pauli Hamiltonian evaluator for H2-like examples, aligned with MoonLab's VQE/Hamiltonian shape.

Use WebGPU f32 for interactive kernels. Use CPU/WASM f64 references for validation where possible. Browser WebGPU does not guarantee f64, so chemical-accuracy claims must not depend on pure WGSL f32.

### Molecular Dynamics Layer
For water phase changes, use a validated classical model rather than pretending full Schrodinger evolution is real-time:
- rigid or constrained water molecule representation;
- Lennard-Jones + Coulomb terms with neighbor lists;
- thermostat/barostat options for NVT/NPT validation;
- EOS and phase-state estimators for real-time coupling;
- property estimators for density, heat capacity, diffusion, viscosity, dielectric response, conductivity, refractive index, and bulk modulus.

The first accepted water model should be chosen explicitly during implementation. Candidate families include TIP4P-style water models for phase behavior and simpler SPC/E/TIP3P-style models for fast demos. The branch must document why the selected model is acceptable and what it cannot predict.

### Quantum-Informed Reactive Material Layer
For phase changes and chemical reactions, prefer free-energy/EOS/kinetics closures generated from quantum/atomistic data instead of live Schrodinger solves at every macro timestep.

Build order:
1. Add thermodynamic state variables: internal energy, temperature, phase fractions, species mass fractions, reaction progress, and optional structure descriptors.
2. Add a placeholder free-energy/EOS closure that returns pressure, temperature, sound speed, phase rates, and heat terms with conservation checks.
3. Replace placeholder curves with tabular/literature/DFT/AIMD/MD-informed data when reference sources are chosen.
4. Add a reaction network with species updates and heat release tied to enthalpy/free-energy changes.
5. Add atomistic callback hooks for flagged representative states; keep DFT/AIMD as sparse labelers, not per-particle runtime loops.

Numerical cautions:
- avoid discontinuous jumps in modulus, pressure, latent heat, viscosity, or sound speed at phase boundaries;
- keep phase transitions smooth enough for the macro solver while reporting the chosen transition width;
- never let chemistry create heat without a corresponding species/free-energy update;
- subcycle or use semi-implicit/implicit handling for stiff phase, chemistry, radiation, ionization, heat-conduction, and nuclear source terms.

### Continuum Coupling Layer
Integrate with existing WebGPUPhys/MPM material state through property packets:
- MPM consumes density, viscosity, moduli, EOS constants, latent heat, and phase.
- Future SPH consumes density, pressure/EOS, viscosity, surface tension, heat transfer, and reaction source terms.
- Future finite-volume/AMR/hydro solvers consume EOS, sound speed, source terms, species/phase rates, opacity/conductivity where applicable, and derivatives/Jacobians for stable integration.
- Higher scales consume averaged material response and closure summaries, not raw quantum wavefunctions.

State transfer operators become first-class integration work:
- particle-to-grid and grid-to-particle transfer;
- micro-to-macro closure evaluation;
- macro-to-micro initial-condition extraction for active refinement;
- restriction/prolongation for adaptive resolution/fidelity;
- conservation audits across every transfer.

### Chemical Interactions
Chemical reactions are a later phase after water and property packets work:
- start with reaction-rate tables and simple bond-order events;
- only use quantum kernels for tiny local reaction probes;
- publish reaction source terms into warm deltas.

### Sedenion / Fano Reactor Usage
The sedenion periodic-table paper is useful as an exact symbolic classifier, not as a direct substitute for quantum chemistry or molecular dynamics.

What can transfer into this simulation:
- **Reaction-channel prefilter:** use the exact Fano Reactor catalog to propose which period-family / sign-state pairs are allowed, inert, attractive, neutral, or repulsive before running heavier local probes.
- **Bond event taxonomy:** map composition norm defect classes into symbolic `chemical.bondEvents` hints:
  - `Delta = -4` -> attraction / ionic-style candidate;
  - `Delta = 0` -> neutral / covalent-style candidate;
  - `Delta = +4` -> repulsive / anti-bond candidate.
- **Inertness guard:** CD partner pairs provide a deterministic "noble-channel" check that can suppress impossible symbolic reaction candidates.
- **Stability heuristic:** the paper's `8 -> 2 -> 0` reactivity cascade can inform a coarse `reactiveDegree` field for molecule graphs and can help prioritize which local chemistry probes are worth spending WebGPU/PeerCompute time on.
- **Topology-friendly sharding:** dense pair classification over many candidate species is an exact integer/algebra workload, so it is a good PeerCompute shard target and an easy NetViz/debug surface.

What must remain outside the sedenion layer:
- It does not compute physical bond lengths, spectra, conductivity, dielectric response, phase changes, isotope decay, or thermodynamic properties.
- It does not remove the need for validated quantum references, MD force fields, EOS/reference tables, or isotope tables.
- It should be reported in packets as a symbolic/model-tier hint, not as validated physical chemistry.

Integration contract idea:

```js
chemical: {
  reactionRates: {},
  bondEvents: [
    {
      model: "sedenion-fano-v0",
      leftDescriptor,
      rightDescriptor,
      delta,
      bondClass,
      reactiveDegreeBefore,
      reactiveDegreeAfter,
      confidence: "symbolic"
    }
  ],
  ph,
  ionFractions
}
```

The existing Fano Reactor implementation already exposes exact Cayley-Dickson multiplication, Fano triples, zero-divisor target discovery, sigma-conjugate flipping, noble-gas inertness, and cascade tests. The Schrodinger demo should import or factor out those plain ES modules only after the local water/property and quantum validation gates remain green.

### Radioactivity
Radioactivity is a nuclear/isotope model:
- isotope table with half-life, decay mode, daughter products, Q value, radiation class, and branching ratios;
- deterministic expected decay plus optional stochastic sampling;
- energy deposition and decay heat feed thermal source terms;
- stable isotopes produce zero activity.

## PeerCompute Integration
- `NodeKernel` owns the simulation session, topology id, room id, and property publication policy.
- `ComputeManager` dispatches CPU/WASM/WebGPU property kernels.
- `GPUHubManager` owns render-coupled wavefunction/particle/property buffers.
- `DataState.commitDelta` publishes warm property packets at a configurable interval.
- Sharding strategies:
  - quantum Pauli-term batches by term range;
  - MD pair-force tiles by cell pair / neighbor-grid block;
  - property estimators by molecule cluster or continuum cell;
  - validation sweeps by scenario seed.
- NetViz/debug:
  - expose task ownership, peer capability, queue depth, property packet age, and validation status.

## MoonLab Usage
Use MoonLab as a reference and math source:
- mirror its Pauli Hamiltonian data shape where practical;
- use its VQE/H2/H2O docs and tests as comparison targets for tiny problems;
- use its website orbital demo as a visual/reference-model study for hydrogenic orbital controls, adaptive spatial extents, point-cloud sampling, shell coloring, worker isolation, and backend fallback messaging;
- consider a WASM bridge only after the JS/WGSL reference path and tests exist.

Do not vendor large MoonLab native code into the demo without a separate approval step.

Do not copy the MoonLab website stack directly. Our implementation must stay vanilla JS, Vite, Three.js, WebGPU, and PeerCompute-compatible.

## Eshkol Usage
Use Eshkol later if it earns its place:
- differentiable potential fitting;
- generated kernels or AD-based calibration;
- exact arithmetic / symbolic checks for small reference problems.

Do not make the first implementation depend on Eshkol's compiler/runtime.

## Implementation Phases

### Phase 0: Approval And Accuracy Contract
- Review this branch plan.
- Decide the minimum scientific claim for the first demo.
- Pick the first water model and reference datasets.
- Define tolerances per observable before implementation.

### Phase 1: Scaffold And Reference Tests
- Create `demos/schrodinger` Vite scaffold with vanilla JS.
- Add tests for complex math, normalization, analytic energies, property packet validation, and reference-table lookup.
- Add a tiny terminal UI that can run a hydrogenic/water-property scenario.
- Add the first standalone Three.js orbital cloud shell after CPU reference tests exist, using MoonLab-inspired controls without React/TypeScript.
- Status: initial scaffold, reference tests, Three.js orbital/material UI, water-first H2O material visualization, orbital sampler visual-spread guard, standalone WebGPU orbital-grid density evaluation, standalone WebGPU point-cloud sampling, and standalone WebGPU radial Hamiltonian diagnostics are implemented.

### Phase 2: WebGPU Quantum Kernels
- Implement complex wavefunction buffers as `vec2<f32>` arrays with explicit 16-byte alignment where needed.
- Add finite-difference Laplacian and potential kernels.
- Add imaginary-time relaxation and normalization passes.
- Validate WebGPU kernels against analytic hydrogenic references, normalization, residual, node-count, and grid-refinement gates before promoting stronger claims.
- Status: standalone orbital-grid density evaluation, point-cloud sampling, and radial basis/Hamiltonian diagnostics now run through WebGPU without CPU fallback; remaining work is full finite-grid evolution and moving the Multiscale radial/orbital consumer onto WebGPU-first paths.

### Phase 3: Water MD And Phase Model
- Implement water molecule initialization, neighbor list, pair force, thermostat, and simple property estimators.
- Add heating/cooling scenario at 1 atm with latent heat and hysteresis.
- Publish phase/property packets for ice, liquid, and steam.
- Connect property packets to existing MPM material parameters in a controlled adapter.

### Phase 3A: Free-Energy Closure Prototype
- Add an internal closure-state schema with density, internal energy, temperature, phase fractions, species fractions, reaction progress, and validity metadata.
- Implement a toy free-energy/EOS closure for one material family that returns pressure, temperature, sound speed, phase rate, latent heat term, and uncertainty.
- Add conservation tests proving phase/reaction updates keep energy and species accounting consistent within documented tolerance.
- Keep this prototype behind explicit `modelTier: toy-closure` or equivalent labels until backed by reference data.

### Phase 4: Optical, EM, Mechanical, Thermal Properties
- Add estimators/reference-table paths for:
  - refractive index and absorption/scattering;
  - dielectric constant and conductivity;
  - bulk modulus, shear/Young's modulus where physically meaningful;
  - heat capacity, thermal conductivity, latent heat.
- Mark out-of-domain outputs explicitly.

### Phase 5: PeerCompute Sharding
- Add single-machine task partitioning first.
- Add multi-peer sharding for pair-force/property tiles.
- Commit warm deltas for property packets and shard timings.
- Add NetViz attach metadata for the demo.

### Phase 6: Chemistry And Radioactivity Extensions
- Add reaction source terms and small quantum reaction probes.
- Add a sedenion/Fano reaction-channel prefilter as a symbolic candidate generator, backed by the existing Fano Reactor exact tests.
- Add active-refinement hooks that can cluster uncertain local states and queue atomistic/quantum label tasks through PeerCompute.
- Add isotope table and decay-chain source terms.
- Keep nuclear/radioactive behavior separate from electronic chemistry.

### Phase 7: Multi-Scale Integration
- Feed validated water/material packets into WebGPUPhys MPM.
- Define the SPH handoff buffer schema.
- Define a solver-agnostic closure adapter so SPH is one consumer alongside MPM and future grid/AMR solvers.
- Add conservation/validity checks around state transfer before routing outputs toward dynamics, planetary, and larger-scale demos.

## Validation Gates

### Required Before Visual Polish
- CPU analytic tests:
  - particle in a box energy levels within fixed tolerance;
  - harmonic oscillator energy spacing within fixed tolerance;
  - hydrogenic ground energy within tolerance for the selected discretization.
- GPU parity tests:
  - wavefunction norm drift bound;
  - imaginary-time energy decreases monotonically for reference problems;
  - GPU/CPU observables match within f32 tolerance on small grids.
- Property packet schema tests:
  - required fields exist;
  - stale/out-of-domain flags work;
  - packets are JSON-serializable warm deltas.

### Standalone Visualization Gate
- `npm --prefix demos/schrodinger run build`
- Headless browser smoke for the standalone route:
  - renders a nonblank Three.js canvas without joining a PeerCompute swarm;
  - exposes atom/orbital controls and validation status;
  - toggles PeerCompute attach without breaking local mode;
  - skips WebGPU-only checks cleanly when no adapter is available;
  - verifies controls do not overlap on desktop and mobile viewports.

### Water Minimum Gate
- Heating/cooling at 1 atm produces solid, liquid, and gas states in the expected order.
- Phase transitions show hysteresis or latent-heat plateau behavior.
- Density, heat capacity, viscosity, thermal conductivity, dielectric constant, refractive index, and bulk modulus compare against chosen references within documented tolerances.
- Ice uses a solid-appropriate model; liquid water does not report a misleading Young's modulus.

### PeerCompute Gate
- Single-peer and two-peer task splits produce the same property packet within tolerance.
- Warm deltas converge across peers.
- Shard ownership and task timings are visible through NetViz/debug telemetry.

### Runtime Gate
- `npm --prefix demos/schrodinger run build`
- `node --test demos/schrodinger/tests/*.test.mjs`
- headless browser smoke that skips cleanly when WebGPU is unavailable and fails on GPU validation errors when it is available.

## Initial Implementation Slice
1. Add `demos/schrodinger` scaffold and per-demo plan/log files.
2. Implement property packet schema and tests.
3. Implement analytic/reference quantum problems and tests.
4. Implement WebGPU probability/radial Hamiltonian kernels with browser smoke checks.
5. Add the standalone MoonLab-inspired Three.js orbital visualization shell and continue migrating the orbital probability/sampling path to WebGPU.
6. Add water reference-data scaffold and phase/property estimator with explicit model limits.
7. Update root docs only after the demo actually runs.

## Risks
- Browser WebGPU f32 precision is not enough for broad chemical accuracy.
- Real water phase behavior is difficult even for classical MD; the model choice must be explicit.
- Pairwise force kernels can become bandwidth-bound and need careful buffer layouts.
- Distributed floating-point reductions are not bitwise deterministic; validation needs tolerances and stable aggregation order where possible.
- Property update cadence may lag the SPH/dynamics timestep; consumers must use `validUntil` and smoothing.

## Open Questions
- Which water model should be the first target: fast interactive model or phase-accuracy-oriented model?
- Should we import MoonLab as WASM later, or keep a smaller JS/WGSL reference implementation?
- Should the first visual shell include only orbital-cloud mode, or also a minimal wavefunction-slice mode before water work starts?
- What error tolerances are acceptable for each property before higher-level simulations consume it?
- What update cadence should the first SPH handoff expect?
- Which reference datasets should be vendored locally, and under what licenses?
