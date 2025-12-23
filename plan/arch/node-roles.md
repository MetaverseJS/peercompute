# Node Roles (Summary)

Status: active; role variants for compute nodes.

## Purpose
- Describe how a compute node behaves based on its position in the topology.

## Roles
### Root Node
- No parent; defines workload and topology config.
- May host or shard global state.
- Anchors authority and policy decisions.

### Grand Parent
- Upstream ancestor of a parent; aggregates or delegates state.
- Provides policy or discovery boundaries for subtrees.

### Parent
- Immediate upstream node for one or more children.
- May act as authority for snapshots or region state.

### Peer
- Lateral node at the same topology level.
- Exchanges snapshots/events for shared rooms.

### Child
- Downstream node that inherits or requests state from a parent.
- Offloads compute or local simulation for its scope.

## Responsibilities (Common)
- Maintain presence, routing, and room membership.
- Respect authority/clock policy when in a hierarchy.

## Failure Modes
- Role confusion (two roots) leading to conflicting authority.
- Parent loss without fallback causing partitioned state.

## Testing
- Multi-node join/leave flows with explicit roles.
- Recovery tests when parent or root disappears.

## Open Questions
- Should authority be role-based or elected dynamically?
