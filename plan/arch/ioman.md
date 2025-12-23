# Local IO Manager [ioman] (Summary)

Status: draft; main-thread IO orchestration.

## Purpose
- Handle local input and display responsibilities for a compute node.

## Responsibilities
- Collect input events via Input Handler.
- Update Render State Object for visualization.
- Forward input commands to NodeKernel.

## Inputs
- DOM input events (keyboard, mouse, touch, gamepad).
- Render updates from StateManager/DataState.

## Outputs
- Input commands to NodeKernel.
- Render frames via renderer (three.js).

## Execution Context
- Main browser thread.

## Integration Contract
- start()
- stop()
- setInputHandler(handler)
- setRenderer(renderer)

## Failure Modes
- Event storms causing input lag.
- Render updates out of sync with state ticks.

## Testing
- Manual input/latency checks.
- Unit tests for input mapping.

## Open Questions
- Should IO be split into separate input/render workers?
