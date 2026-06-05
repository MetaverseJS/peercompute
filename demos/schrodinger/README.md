# Schrodinger Materials Console

Standalone atom/orbital and material-property workbench for the Schrodinger/materials branch.

## Development

```bash
npm --prefix demos/schrodinger run dev -- --host
```

Default local URL:

- `https://localhost:5184/`

## Current Scope

- WebGPU-generated hydrogenic/effective-charge orbital probability grid plus WebGPU-sampled point cloud visualization for selected elements.
- WebGPU-first one-electron radial Schrodinger basis/Hamiltonian evaluator for selected `n/l` states, with energy/error/residual/node diagnostics shown in the live stats panel. If WebGPU is unavailable, the orbital grid and radial solve report unavailable instead of using a CPU fallback.
- Water-first material-cell visualization with explicit H2O geometry, visible covalent/ionic bond classes, and molecule property packets across temperature and pressure conditions.
- Reactive atom sandbox with environment controls for temperature, ambient pressure, and gravity, plus toy real-time bonding for selected element pairs.
- Browser WebGPU capability/probability smoke plus orbital-grid, orbital point-sampling, and radial-Hamiltonian compute passes.
- Optional PeerCompute attach for warm property-packet publication plus shared `ClosureState -> ClosureResult` deltas under `multiscale-closures`.

The demo reports validation status and model IDs in every property packet. Property packets stay as the UI compatibility layer, while shared closure adapters let multiscale consumers read thermodynamic, transport, mechanics, electromagnetic, chemistry, phase, validity, uncertainty, and conservation fields consistently. The reactive atom sandbox is labeled `toy-reactive-atoms-v0`; it is for interaction design and does not claim ab initio molecular accuracy.
