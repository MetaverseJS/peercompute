llm instructions for this file:

this file contains a list of suggested changes to peercompute that will aid in the implementation of this library. 

# Peercompute Integration & Contract

To ensure the `gpu-physics.js` engine can run effectively within the `peercompute` distributed environment, we require the following contract for data exchange and execution.

## 1. Buffer Data Contract
The physics engine operates on raw binary data. Peercompute nodes must handle this data without requiring complex object serialization.

*   **Format:** All simulation state (particles, grid, etc.) is stored in flat `ArrayBuffer`s (or `SharedArrayBuffer`s).
*   **Layout:**
    *   **Structure-of-Arrays (SoA):** Preferred for GPU memory coalescing.
    *   **Alignment:** All per-particle or per-cell struct elements must be aligned to **16 bytes** (WebGPU `storage` buffer requirement).
    *   **Explicit Offsets:** The engine will provide a JSON schema defining exact byte offsets for every field (e.g., `position: offset 0`, `velocity: offset 16`). Peercompute should use these offsets rather than assuming packed arrays.
*   **Transfer:** Buffers should be transferable (using `postMessage` transfer list) where possible to avoid copies between the main thread and workers.

## 2. Kernel Execution & Bind Groups
Peercompute needs to execute WebGPU compute pipelines defined by the engine.

*   **Stateless Kernels:** Compute shaders will be designed to be as stateless as possible, depending only on the input buffers and uniform parameters (dt, time).
*   **Bind Group Stability:** The engine will maintain stable BindGroupLayouts. Peercompute should ideally cache these layouts/pipelines if reusing the same physics module across frames.

## 3. Recommended Changes to Peercompute
*   **Raw Buffer Support:** Ensure the peercompute task scheduler can accept a task payload that consists of raw `ArrayBuffer`s + a configuration object, rather than requiring JSON-serialized objects.
*   **WebGPU Device Sharing:** If possible, investigate mechanisms for sharing a `GPUDevice` or at least `GPUBuffer` handles between contexts (though currently limited by browser security models, `SharedArrayBuffer` is the primary fallback).
*   **Asset/Material Registry:** Allow the "job" description to include a lightweight material registry (small JSON struct) that defines constants for the kernels, preventing the need to recompile shaders for different material parameters.
