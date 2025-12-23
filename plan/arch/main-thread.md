# Main Browser Thread (Summary)

Status: active; primary UI/event loop.

## Purpose
- Host UI, input handling, and rendering without blocking.

## Responsibilities
- Run Local IO Manager, Input Handler, and Render State updates.
- Keep frame time stable and avoid heavy compute.

## Constraints
- Single-threaded; long tasks cause visible jank.
- DOM and WebGL/WebGPU renderers must run here.

## Testing
- Manual responsiveness checks under load.
- Performance profiling for long tasks.

## Open Questions
- Which tasks should migrate to workers or a Service Worker?
