llm instructions for this file: This file contains the architecture plan for the project. update as necessary

current architecture overview:
- UI shell: single-page HTML (`index.html`) with a HUD overlay that hosts all controls. HUD can collapse (auto-collapses on mobile). Styling is inline CSS; fonts via Google Fonts. Canvas fills viewport for Three.js render.
- Renderer: `index.js` bootstraps Three.js (`WebGLRenderer`, scene, camera, lights), orbit controls, and a custom Tiny Planet first-person mode (`TinyPlanetControls`). It also owns UI wiring (sliders/selects) and regenerates worlds via `PlanetForge`.
- Generation core: `worldgen.js` exports `PlanetForge`, handling tectonics (Voronoi-like plate simulation), hydraulic erosion, water masks, and mesh creation (icosahedron subdivisions + vertex displacement + attributes). Produces geometry, water masks, and settings stored on the planet mesh (`userData`).
- Exploration controls: `TinyPlanetControls.js` implements a player rig attached to the planet mesh with walking/flying/swimming, gravity alignment, pointer lock, and WASD/mouse input. It reads `planetMesh.userData.forge/settings` for terrain/water heights to manage swim/ground states.
- Atmosphere/clouds: handled via AtmosphereSystem/CloudSystem with UI-driven rebuilds, plus volumetric cloud raymarch controls (step bounds and ray bundling) for tuning quality vs. performance.
- UX/logic glue: `index.js` manages presets, auto-regeneration on parameter change, range label updates, resize handling, and status text.

notable data/flow:
- UI -> `index.js` listeners -> settings object -> `PlanetForge` generation -> planet mesh + water/atmosphere/clouds instantiated and attached to scene.
- `planet.userData` carries `{ forge, settings }` consumed by controls (movement/height checks) and visual rebuilds.
- Controls: OrbitControls for overview; TinyPlanetControls for first-person. Middle-click enters TinyPlanet mode at raycast hit on planet.

gaps / risks:
- Input is desktop-centric; no abstraction for mobile/VR. HUD collapse helps but touch controls are not implemented.
- Pointer-lock exit leaves orbit camera possibly mis-framed (zoom/position jump noted in branch goals).
- Atmosphere/cloud pipeline is tied to UI module; no reusable module boundary.
- No testing/validation harness; changes rely on manual play.

suggested structural direction:
- Introduce an input multiplexer layer (desktop/mouse, touch, VR) that normalizes actions (move/strafe/jump/fly/swim) and feeds both Orbit and TinyPlanet modes. This will also host mobile on-screen controls.
- Extract rendering setup into a `scene/bootstrap` module (renderer/camera/lights/starfield) to isolate UI wiring from rendering.
- Modularize visuals: separate atmosphere/cloud builders into their own modules that accept settings and a light direction, returning meshes/uniform refs. Keep UI thin.
- Encapsulate planet generation/config in a `planet` module that owns presets, scaling (diameter), and regeneration, exposing callbacks for UI and controls.
- Add a small state store for settings + dirty flags to cut coupling between DOM and render logic.
- Testing: headless generation sanity checks (heightmap ranges, erosion invariants) and smoke tests for control state transitions (walk/swim/fly) to guard regressions. 
