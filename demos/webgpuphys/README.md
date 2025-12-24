# WebGPU Physics

## Acknowledgements & Attribution

This project is a WebGPU port and modernization of the incredible **gpu-physics.js** library by **Stefan Hedman (schteppe)**.
Original Repository: [https://github.com/schteppe/gpu-physics.js/](https://github.com/schteppe/gpu-physics.js/)

We heap massive praise upon Schteppe for his pioneering work in GPU-accelerated physics simulation on the web. His original WebGL 2 implementation paved the way for high-performance rigid body simulations in the browser, demonstrating ingenious techniques for mapping physics concepts to graphics hardware. This project stands on the shoulders of that giant, leveraging the modern compute capabilities of WebGPU to push the boundaries even further.
![screenshot](image.png)
## Overview
https://ubernaut.github.io/webGPUphysics/demos/toychest.html 
WebGPU Physics is a high-performance, GPU-accelerated 3D rigid body physics engine. It runs the entire physics simulation loop on the GPU using WebGPU Compute Shaders (WGSL), allowing for the simulation of tens of thousands of interacting bodies in real-time.

The core idea is to represent rigid bodies as clouds of spherical particles. Collision detection and response are performed at the particle level, and the resulting forces are aggregated to drive the motion of the rigid bodies.

## MLS-MPM (Materials) Progress
- New WebGPU MLS-MPM scaffolding (water-first) lives under `src/domains/mpm/` with:
  - Schema: 128B particle layout, 16B cell layout, fixed-point atomics helpers.
  - WGSL kernels: clearGrid, p2g1, p2g2, updateGrid, g2p, copyPosition.
  - Factories/headless helper: buffer/pipeline/bind-group setup, block particle initialization, and a `createHeadlessMpm` runner.
- A minimal `Engine` (`src/engine.js`) sequences domains; exported from `src/index.js` along with the `mpm` namespace.
- Headless demo: `demos/mpm-headless.html` runs the MLS-MPM pipeline without rendering, shows mass/momentum and drift diagnostics. Default compute mode uses the PeerCompute `ComputeManager` in an isolated worker; add `?compute=shared` to run on a shared GPU hub device. Access via `npm run dev` → `/demos/mpm-headless.html` or open `docs/webgpuphys/demos/mpm-headless.html` after build.
- Visual demo: `demos/mpm-visual.html` renders MLS-MPM particles with orbit controls (WebGPU). Access via `npm run dev` → `/demos/mpm-visual.html` or open `docs/webgpuphys/demos/mpm-visual.html` after build.

## Simulation Algorithms

### 1. Rigid Body Representation
Each rigid body is approximated by a set of "collision particles" rigidly attached to it.
-   **Shape Approximation**: Complex shapes (Boxes, Cylinders, Tetris blocks) are constructed by filling their volume (or surface) with spheres.
-   **Inertia**: The moment of inertia for the rigid body is calculated based on the distribution of these particles (or analytically for simple shapes) and stored on the GPU.
-   **State**: Each body has a Position (vec3), Quaternion (vec4), Linear Velocity (vec3), and Angular Velocity (vec3).

### 2. Collision Detection (Broadphase)
Collision detection is accelerated using a **Uniform Spatial Hash Grid**.
-   The simulation domain is divided into a 3D grid of cells.
-   **Grid Construction**: In each step, every particle computes which cell it belongs to based on its world position.
-   The grid is built on the GPU using atomic operations to count particles per cell and store their indices.
-   This allows each particle to efficiently query its neighbors by checking only its own cell and the 26 surrounding cells, reducing the complexity from O(N^2) to O(N) on average.

### 3. Collision Response (Narrowphase)
-   **Particle-Particle**: When two particles from different bodies overlap, a repulsive force is calculated.
-   **Force Model**: The engine uses a penalty-based spring-damper model.
    -   **Stiffness**: A spring force pushes particles apart proportional to the penetration depth.
    -   **Damping**: A viscous force resists relative velocity along the collision normal, dissipating energy (restitution).
    -   **Friction**: A tangential force opposes the relative tangential velocity, simulating surface friction.
-   **Particle-Boundary**: Particles also collide with the walls and floor of the simulation container using a similar penalty method.

### 4. Force Aggregation
Since collisions happen at the particle level, the resulting forces and torques must be applied to the rigid center of mass.
-   **Force Reduction**: A parallel reduction (or atomic accumulation) step sums up all forces applied to the particles of a specific body.
-   **Torque Calculation**: For each particle, the force creates a torque `T = r x F`, where `r` is the vector from the body's center of mass to the particle. These torques are also summed up for each body.

### 5. Integration
The engine uses **Semi-Implicit Euler** integration for stability and performance.
1.  **Velocity Update**: Body linear and angular velocities are updated based on the accumulated forces, torques, gravity, and drag.
    -   `v_new = v_old + (F / m) * dt`
    -   `w_new = w_old + (I^-1 * T) * dt` (using the world-space inverse inertia tensor).
2.  **Position Update**: Body positions and orientations are updated using the new velocities.
    -   `pos_new = pos_old + v_new * dt`
    -   `quat_new = integrate(quat_old, w_new, dt)`

## WebGPU Compute Pipeline

The simulation loop consists of a series of Compute Shader passes executed every time step. Data is kept entirely in GPU `StorageBuffers` to minimize CPU-GPU bandwidth usage.

1.  **`local_to_world`**:
    -   Transforms particle positions from local space (relative to body) to world space using the body's current position and rotation.
2.  **`local_to_relative`**:
    -   Calculates particle positions relative to the body's center of mass in world space (needed for torque calculation).
3.  **`body_vel_to_particle_vel`**:
    -   Computes the velocity of each particle based on the body's linear and angular velocity.
4.  **`clear_grid`**:
    -   Resets the spatial hash grid counters to zero. (Uses 2D dispatch to handle large grids).
5.  **`build_grid`**:
    -   Populates the grid. Each particle atomically increments the counter for its cell and writes its index into the grid bucket.
6.  **`update_force`**:
    -   The heavy lifting. For each particle, queries the grid for neighbors, detects collisions, and calculates spring-damper forces.
    -   Also handles boundary collisions and interaction sphere collisions.
    -   Writes forces to a per-particle force buffer.
7.  **`update_torque`**:
    -   Calculates the torque contribution for each particle based on the force calculated in the previous step (`r x F`).
8.  **`reduce_force` & `reduce_torque`**:
    -   Aggregates the per-particle forces and torques into per-body force and torque accumulators using atomic operations.
9.  **`update_body_velocity`**:
    -   Applies gravity, accumulated forces, and drag to update the body's linear velocity.
10. **`update_body_angular_velocity`**:
    -   Applies accumulated torques and drag to update the body's angular velocity, using the inertia tensor.
11. **`update_body_position`**:
    -   Moves the body based on linear velocity.
12. **`update_body_quaternion`**:
    -   Rotates the body based on angular velocity (quaternion integration).

This pipeline ensures that all physics state remains on the GPU, allowing the renderer (also WebGPU) to directly access the position and rotation buffers for drawing without expensive readbacks to the CPU.
