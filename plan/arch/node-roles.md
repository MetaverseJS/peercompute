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

## Optional installed-host capability: Supernode

Proposed November14,2026; not yet an installed-client implementation.
- Runs the same PeerCompute client/services with a native networking companion.
- Can advertise qualified inbound endpoints and optionally relay other peers'
  connections, subject to independent host options and resource budgets.
- Is orthogonal to root/parent/child roles: a supernode gains no authority merely
  by accepting connections or relaying. A root may also be a supernode.
- Direct reachability depends on network/firewall/NAT and browser-compatible
  transports. Ordinary browser peers already support direct WebRTC paths.
- Preserve independent application/artifact/relay identities and explicit
  association when multiple networking processes exist. Define ownership before
  bridging a native endpoint into the browser NetworkManager.
- See [root and installed-host direction](../root-node-runtime-model-evidence.md).

## Failure Modes
- Role confusion (two roots) leading to conflicting authority.
- Parent loss without fallback causing partitioned state.

## Testing
- Multi-node join/leave flows with explicit roles.
- Recovery tests when parent or root disappears.

## Open Questions
- Should authority be role-based or elected dynamically?
