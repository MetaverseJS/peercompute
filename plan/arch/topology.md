# Topology Examples (Summary)

Status: draft; sourced from topology diagram.

## Purpose
- Capture supported topology shapes and their use cases.

## Fully Distributed
- Mesh of peers with no strict hierarchy.
- Suited for emergent worlds and small rooms.
- Requires strong interest management to scale.

## Three-Layer Configuration
- Root node defines rules; parents host clusters; children/peers join subtrees.
- Fits player-hosted games with shared rulesets.

## Dynamic Hierarchical Depth
- Topology adapts to bandwidth/compute affinity.
- Nodes self-organize into subtrees and mesh clusters.
- Supports emergent metaverse-style sharding.

## Implications
- Authority election and state sharding depend on topology.
- NetworkManager must adapt topic scopes per level.

## Open Questions
- What metrics trigger topology reshaping?
