# Implementation Log

## Initial Setup
-   Switched from React (`index.tsx`) to Vanilla JS (`main.js`).
-   Configured `index.html` to load ES modules.
-   Added `plan/plan.md` and `metadata.json`.

## Graphics Pipeline
-   Chosen `Three.js` (r167+) for `WebGPURenderer`.
-   Implemented a `Galaxy` class that uses TSL (Three Shading Language) or raw compute nodes to position millions of stars.
-   The "Time" variable is passed as a uniform to animate orbits.

## UI
-   Created a "Green Screen" CSS overlay.
-   Added scanline effects using CSS for the retro vibe.
