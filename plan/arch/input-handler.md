# Handle Input (Summary)

Status: draft; input capture and mapping.

## Purpose
- Normalize device input into commands and state deltas.

## Responsibilities
- Listen to keyboard/mouse/touch/gamepad events.
- Sample input at a stable cadence.
- Map raw input to game/room command payloads.

## Inputs
- DOM events and device APIs.
- Input mapping configuration.

## Outputs
- Command payloads to NodeKernel.
- Local input state snapshots for prediction.

## Execution Context
- Main thread (browser event loop).

## Failure Modes
- High-frequency events flooding the command queue.
- Missing device support across browsers.

## Testing
- Manual device checks.
- Unit tests for mapping tables.

## Open Questions
- How to reconcile local prediction with remote authority?
