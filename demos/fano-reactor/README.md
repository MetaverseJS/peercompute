# Fano Reactor

Fano Reactor is an algebraic chemistry sandbox inspired by the sedenion periodic-table paper in [`plan/refs/sedenion periodic table.pdf`](../../plan/refs/sedenion%20periodic%20table.pdf). It currently ships a deterministic local `bond-lab` and `fano-map` interface:

- atoms are canonical two-term sedenion states `e_i +/- e_j`
- reactions are classified from the exact composition norm defect `Delta`
- the Fano plane highlights which period families can interact
- the UI reports zero-divisor targets, inert Cayley-Dickson partners, and a sampled stability cascade

## Development

```bash
npm --prefix demos/fano-reactor run dev -- --host
```

Default local URL:

- `https://localhost:5183/`

## What This Validates

- Exact Cayley-Dickson / sedenion multiplication in plain ES modules.
- Deterministic classification of atomic bond classes `Delta in {-4, 0, +4}`.
- Fano-governed target discovery for reactive states.
- A clean path toward a later PeerCompute `swarm` mode that shards pair evaluation across peers.
