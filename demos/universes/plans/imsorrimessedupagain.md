# Migration Plan: WebGL to WebGPU Compute

## The Failure
The project was intended to be built on WebGPU Compute Pipelines to handle massive scale astrophysics simulations efficiently. The current implementation mistakenly utilized `THREE.WebGLRenderer` and standard GLSL shaders. This limits the scale of the simulation (CPU bottlenecks on geometry generation) and violates the core architectural directive.

## The Strategy

### 1. Renderer Swap
*   **Action**: Replace `THREE.WebGLRenderer` with `THREE.WebGPURenderer` (available in r167+ via `three/webgpu`).
*   **Impact**: This will break all existing `ShaderMaterial` implementations (GLSL is not directly supported in the new renderer without transpilation, but TSL is preferred).

### 2. Compute Shader Integration
We will move the `generateUniverse` CPU logic into a GPU Compute Buffer.

*   **Structure**:
    *   Create a `StorageBufferAttribute` to hold star data (Position `vec3`, Color `vec3`, Mass `float`, Velocity `vec3`).
    *   Write a **Compute Shader** (using TSL `Fn` or WGSL) to:
        1.  Initialize star positions based on the filament noise algorithm (migrating the PRNG to the GPU).
        2.  Update star positions every frame based on N-body gravity or expansion physics.

### 3. Rendering Logic
*   **Replacement**: Replace `THREE.Points` + `ShaderMaterial` with `THREE.SpriteNodeMaterial`.
*   **TSL (Three Shading Language)**:
    *   Use `positionLocal` bound to the storage buffer.
    *   Re-implement the "Inflation" and "Heat" logic using TSL nodes (`mix`, `exp`, `timer`).

### 4. Step-by-Step Migration Plan
1.  **Dependency Check**: Ensure `three/webgpu` is correctly imported.
2.  **Point Cloud Migration**:
    *   Create `const positionBuffer = new THREE.StorageInstancedBufferAttribute(count, 3)`.
    *   Write `computeUniverseInit` TSL function to populate it.
3.  **Physics Migration**:
    *   Write `computeUniverseUpdate` TSL function to handle `uTime` expansion.
4.  **Material Swap**:
    *   Convert `CRTShader` and `LensingShader` to `PostProcessing` nodes in the new WebGPU post-processing system.

## Risks
*   **Browser Support**: WebGPU is only supported in Chrome/Edge on Desktop. A fallback or error message is required.
*   **Syntax Overhead**: TSL syntax is verbose compared to GLSL.
*   **Post-Processing**: `EffectComposer` does not work with `WebGPURenderer`. We must use the new Node-based Post Processing system.

## Immediate Next Steps
Once the Big Bang animation is confirmed working in the current Legacy WebGL mode, we will create a new branch/file structure to begin the WebGPU port without breaking the live demo.
