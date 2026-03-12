Instructions: This file captures the chemistry demo scope, goals, and implementation notes for the `chem` branch.

# Fano Reactor

## Purpose
Turn the sedenion chemistry paper into an interactive PeerCompute demo instead of a static explainer. The demo should make the algebra visible: atoms are two-term sedenion states, bonding outcomes come from the composition norm defect, and the network can shard the pairwise interaction workload across peers.

## Status Snapshot (2026-03-10)
- Implemented: standalone Vite scaffold at `demos/fano-reactor/` with exact sedenion multiplication, deterministic chemistry catalog generation, retro-terminal `bond-lab`, Fano-plane period map, noble-gas inertness check, and executable headless tests.
- Next: add chamber animation / particle motion, then layer in PeerCompute `swarm` job sharding and warm-delta telemetry.
- Current shape: 2D first release for correctness and readability; 3D chamber remains a later polish pass once the distributed mode exists.

## Paper Hooks To Preserve
- 7 Fano-governed period families.
- 7 inert Cayley-Dickson partner pairs as noble-gas equivalents.
- 3 atomic bond classes from `Delta in {-4, 0, +4}`.
- Reactive atomic states expose at most 4 meaningful targets/ports.
- Sign flips change targeting (`sigma`-conjugate ion selectivity).
- Bonding should visibly reduce reactivity along the paper's `8 -> 2 -> 0` cascade.

## Core User Story
- A host opens a retro-terminal reaction chamber and selects a scenario: `fano-map`, `bond-lab`, `cascade`, or `swarm`.
- Atoms spawn as exact states like `e1 + e10` or `e4 - e15`.
- When atoms approach, the simulation computes `A * B`, `A + B`, `N(A * B)`, and `Delta`.
- Outcome rules:
- `Delta = -4`: ionic bond, visible energy release, merge or capture event.
- `Delta = 0`: covalent / neutral lock, stable bond with no burst.
- `Delta = +4`: anti-bond / metallic pressure, repel unless energy is injected.
- inert CD partners: no reaction and no bond path.
- As molecules form, their displayed reactivity score drops so the stability cascade is immediately visible.

## Visual Direction
- Retro terminal HUD with green, amber, and red status text.
- Main viewport: a 3D reaction chamber or flat Fano-plane arena with seven period sectors.
- Each sector maps to one Fano point / period family.
- Noble gases sit on shielded perimeter slots to emphasize inertness.
- Bonds render as color-coded beams: cyan ionic, amber covalent, red anti-bond.
- A side console prints the exact algebra for the currently selected interaction.

## Demo Modes
1. `fano-map`
- Shows the 7 period sectors and the 42 reactive channels.
- Selecting a state highlights only the targets permitted by the Fano structure.

2. `bond-lab`
- Lets the user manually combine two atoms and inspect the full algebraic result.
- Best for explaining sign flips, ion targeting, and noble-gas inertness.

3. `cascade`
- Auto-runs a chamber of atoms and visualizes reactivity dropping from atoms to molecules to super-molecules.
- Best for showing the paper's stability claim.

4. `swarm`
- Uses PeerCompute to shard pair-evaluation tiles across peers.
- Adds a lightweight topology/work queue overlay so the chemistry demo also serves as a real distributed compute example.

## Architecture Mapping
- `NodeKernel`: room/session ownership, scenario selection, peer orchestration.
- `StateManager` / `DataState`:
- hot: instance transforms, bond beams, chamber heat textures.
- warm: atom descriptors, interaction outcomes, molecule graph, peer job stats.
- cold: saved seeds, presets, and replay snapshots.
- `ComputeManager`:
- CPU baseline for exact sedenion multiplication and reaction classification.
- Optional WebGPU kernel for dense pair scans, field visualizations, or chamber heatmaps.
- Optional later WASM path if exact arithmetic should be portable across runtimes.
- GPU hub: shared render buffers for atoms, bonds, and reaction overlays.
- `NetworkScheduler`: shard pairwise work by atom block or adjacency tile.

## Data Model Sketch
- `atom`: `{ id, period, stateKey, signs, charge, reactiveDegree, position, velocity }`
- `interaction`: `{ aId, bId, productKey, delta, bondType, allowed, energy }`
- `molecule`: `{ id, memberIds, norm, reactiveDegree, stabilityTier }`
- `job`: `{ peerId, tileId, pairCount, ms, accepted, rejected }`

## Milestones
1. Build a deterministic sedenion chemistry model in plain ES modules with exact arithmetic tests.
- Status: done in the current scaffold.
2. Ship a single-user `bond-lab` + `fano-map` interface with retro-terminal styling.
- Status: done in the current scaffold.
3. Add the `cascade` chamber and track reactivity scores as structures grow.
4. Shard pair evaluation across peers and visualize work ownership in `swarm`.
5. Add optional NetViz attach/debug hooks if the distributed mode needs deeper telemetry.

## Validation
- Deterministic model tests for the paper invariants before any render-heavy work.
- Headless seeded chamber test that verifies stable bond-class counts and repeatable cascade behavior.
- Multiplayer smoke where two peers split work tiles and converge on the same molecule graph.

## Open Questions
- Whether to hard-code the multiplication table or derive it from Cayley-Dickson rules at runtime.
- Whether the first release should be a simpler 2D/Fano-plane experience or go straight to a 3D chamber.
- Whether molecule formation should remain paper-faithful first (`A + B` as the bond choice) before adding more game-like chamber dynamics.
