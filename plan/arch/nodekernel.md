# Node Kernel [nodekernel] (Summary)

Status: active; orchestrates managers and policies.

## Purpose
- Coordinate StateManager, NetworkManager, ComputeManager, and Local IO.
- Own orchestration policy (what/when/who) and clock mode.

## Responsibilities
- Instantiate and configure managers/workers.
- Set topology role and authority decisions.
- Drive NetworkScheduler when kernel clock is enabled.
- Route input, network events, and compute results into state updates.
- Coordinate task modes (shared-GPU vs isolated GPU) with ComputeManager/GPU hub.

## Inputs
- Input commands from Input Handler.
- Network snapshots/events from NetworkManager.
- Compute results from ComputeManager.
- Config: gameId, roomId, clockPolicy, network profile.

## Outputs
- Scheduler ticks/policy updates to NetworkManager.
- State mutations to StateManager.
- Job dispatches to ComputeManager.
- High-level game/control events to IO.

## Execution Context
- Main thread coordinator; should avoid heavy compute.

## Integration Contract
- start(config), stop()
- setClockPolicy(policy)
- setTopologyRole(role)
- tickScheduler(now) -> NetworkManager
- observeStatus(cb)

## Failure Modes
- Clock drift or misconfigured rates causing jitter.
- Managers out of sync (stale subscriptions or workers).

## Testing
- Unit tests for clock policy defaults.
- Integration tests for scheduler tick routing.

## Open Questions
- Persist kernel policy/state across reloads?
