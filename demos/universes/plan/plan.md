# Universe Simulator Plan

## Goal
Create a continuous, scalable, procedural universe simulator.
- **Tech Stack**: Vanilla JS, Vite, Three.js (WebGPURenderer), WebGPU Compute.
- **Aesthetic**: Retro Green Terminal (CRT style).
- **Platform**: High-end GPU focused.

## Architecture
1.  **Entry (`main.js`)**: Bootstraps the app, handles UI/Canvas injection.
2.  **Engine (`engine/`)**:
    -   `Loop.js`: Handles the requestAnimationFrame loop.
    -   `Renderer.js`: Wraps Three.js WebGPURenderer.
    -   `CameraRig.js`: Manages camera movement and "floating origin" simulation logic.
3.  **Simulation (`simulation/`)**:
    -   `Universe.js`: Manages the state of the cosmos.
    -   `Compute.js`: WebGPU compute pipelines for star generation/physics.
    -   `LODSystem.js`: Handles switching between Galactic view and Star System view.
4.  **UI (`ui/`)**:
    -   `Terminal.js`: HTML/CSS overlay for stats and controls.

## Astrophysics & Evolution Roadmap
*   **Galactic Evolution**:
    *   **Early Universe (< 2 Bn YR)**: High star formation (Blue), Irregular/Proto-galaxies.
    *   **Mid Universe**: Peak metallicity, Spiral structures.
    *   **Late Universe (> 10 Bn YR)**: "Red and Dead" populations, dominance of Red Dwarfs and Remnants (Black Holes/Neutron Stars).
*   **Stellar Lifecycle (Detailed)**:
    *   **Accretion Phase (< 50 MYR)**: Protoplanetary Disks, no discrete planets.
    *   **Main Sequence**: Stable planetary orbits.
    *   **Red Giant Phase**: Star expansion, inner planet destruction.
    *   **Death States**: 
        *   Planetary Nebulae (White Dwarfs).
        *   Supernova Remnants (Neutron Stars/Black Holes).
*   **Implementation Strategy**:
    *   Use deterministic PRNG seeded by spatial coordinates.
    *   Apply `f(Seed, UniverseAge)` to determine the current state of an object.

## Features
-   **Seedable PRNG**: Universe is deterministic based on a seed.
-   **Scale Handling**:
    -   **Macro**: Galaxies represented as point clouds or billboards.
    -   **Micro**: Individual star systems with orbiting planets.
-   **Interactive Scanning**:
    -   **2-Phase Travel**: Click to Scan (Identify Type, Mass, Spectrum) -> Click 'Warp' to Travel.
    -   **Spectrograph**: Visual readout of stellar composition.
-   **Advanced Physics**:
    -   N-Body gravity for star systems (Planets affect Stars, etc).
    -   Passive body scattering (Comets/Asteroids).
-   **Visual Fidelity**:
    -   Realistic Black Hole rendering (Lensing, Red/Blue Shift).
    -   Volumetric Nebulae in galaxies.
    -   Active Galactic Nuclei (Jets/Accretion).

## Milestones
-   [x] Basic Project Structure.
-   [x] WebGPU Renderer Setup.
-   [x] Retro UI Overlay.
-   [x] Procedural Galaxy Generator (Compute Shader).
-   [x] "Big Bang" Reset Pipeline.
-   [x] Interactive Scanner UI (Star Classes & Galaxy Types).
-   [x] Galactic & Stellar Lifecycles (Evolutionary Logic).
-   [x] N-Body Physics Integration.
-   [x] Black Hole & Nebula Rendering.
-   [ ] Infinite Scrolling / Sector Management (Deferred).
-   [ ] Star System Zoom-in (3D Meshes).