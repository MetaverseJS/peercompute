# State Worker [stateworker] (Summary)

Status: active; parallel DataState worker.

## Purpose
- Perform DataState reads/writes without blocking the main thread.

## Responsibilities
- Execute queued state mutations and queries.
- Apply merge rules provided by StateManager.
- Return snapshots/deltas back to the manager.

## Inputs
- Work items from StateManager (read, write, merge).
- Access tokens/locks for scoped state paths.

## Outputs
- Query results and mutation acknowledgements.
- Error signals for failed transactions.

## Execution Context
- Web Worker or dedicated worker thread.

## Failure Modes
- Dropped responses or hung workers.
- Conflicting writes if lock discipline is violated.

## Testing
- Unit tests for worker message handling.
- Stress tests for parallel read/write sequences.

## Open Questions
- Should workers own a per-scope queue or a global queue?
