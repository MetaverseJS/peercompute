# Compute Node (CN) (Summary)

Status: active; browser-based peer in the network.

## Purpose
- Provide a single peer unit that can host state, compute, IO, and networking.
- Participate in hierarchical or mesh topologies as a root, parent, peer, or child.

## Composition
- NodeKernel orchestrator.
- Managers: StateManager, NetworkManager, ComputeManager, Local IO Manager.
- DataState store + State Workers.
- CPU and WebGPU compute workers.

## Responsibilities
- Join/leave rooms and topologies via NetworkManager.
- Maintain local DataState and replicate approved updates.
- Execute compute jobs locally and optionally for children.
- Drive local input, simulation, and rendering.

## Inputs
- Local input events and UI actions.
- Network snapshots/events/commands.
- Compute job requests and results.
- Config: gameId, roomId, clockPolicy, network profile.

## Outputs
- Pubsub messages, snapshots, presence, and events.
- State updates to DataState.
- Rendered output to the user.

## Execution Context
- Main browser thread for orchestration + UI.
- Web Workers for state and compute; optional Service Worker for networking.

## Security
- Root nodes served over HTTPS/WSS.
- Nodes exchange non-executable data (JSON or binary buffers).

## Testing
- Integration tests for join/leave, state sync, and scheduler behavior.
- Manual multi-peer smoke tests for topology roles.

## Open Questions
- What runs in Service Worker vs dedicated workers in the long term?
