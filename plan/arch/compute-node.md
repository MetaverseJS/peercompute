# Compute Node (CN) (Summary)

Status: active; browser-based peer in the network.

## Purpose
- Provide a single peer unit that can host state, compute, IO, and networking.
- Participate in hierarchical or mesh topologies as a root, parent, peer, or child.

## Composition
- NodeKernel orchestrator.
- Managers: StateManager, NetworkManager, ComputeManager; application-owned I/O.
- DataState store; general State Workers remain planned.
- CPU, WASM, and WebGPU compute workers.
- GPU hub on main thread for shared-GPU tasks.

## Responsibilities
- Join/leave rooms and topologies via NetworkManager.
- Maintain local DataState and replicate approved updates.
- Execute JS/WASM/WebGPU compute jobs locally and optionally for children.
- Drive local input, simulation, and rendering.
- Use hot/warm/cold DataState layers for GPU, network/UI, and persistence needs.

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
- Managed Web Workers for compute. Dedicated state/network workers remain planned;
  demo service workers provide shell caching/isolation rather than background P2P.

## Security
- Root nodes served over HTTPS/WSS.
- Shared state is data. Opt-in remote compute can request application module
  execution; addressed pubsub is not an authenticated execution boundary.

## Testing
- Integration tests for join/leave, state sync, and scheduler behavior.
- Manual multi-peer smoke tests for topology roles.

## Open Questions
- What runs in Service Worker vs dedicated workers in the long term?
