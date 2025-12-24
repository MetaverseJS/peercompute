# GPU Hub (Main Thread) (Summary)

Status: active; shared-GPU owner scaffolding implemented.

## Purpose
- Own the shared WebGPU device/context for render-coupled compute tasks.
- Provide zero-copy GPU->render paths when tasks share the renderer.

## Responsibilities
- Allocate and manage shared GPUBuffers for hot-layer state.
- Provide a hot buffer registry for shared-GPU tasks.
- Schedule shared-GPU tasks within a frame budget.
- Export CPU deltas for netman/UI via staged readbacks.

## Inputs
- Task registrations from ComputeManager/NodeKernel.
- Render loop timing and frame budgets.
- DataState deltas to mirror into hot buffers.

## Outputs
- Render-ready buffers for the renderer.
- Warm-layer deltas for StateManager/NetworkManager.

## Constraints
- Must avoid blocking the main thread; use tight budgets and staging reads.
- WebXR requires main-thread ownership today.

## Testing
- Frame-time regression checks under load.
- GPU readback latency profiling.

## Open Questions
- How to prioritize shared-GPU tasks when frame budget is exceeded?
