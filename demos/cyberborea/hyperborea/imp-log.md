# Cyberborea Implementation Log

- 2025-11-24: Initialized the Hyperborea project with `npm init`, added webpack dev/build setup that reuses PeerCompute HTTPS cert env vars, installed Three r181 and supporting dependencies, and created the project public scaffold.
- 2025-11-24: Migrated `cb.html` into modular ES modules (config/time/terrain + game loop), pulling NodeKernel via alias and serving `relay-config.json` from PeerCompute through webpack with CSS/HTML templates.
- 2025-11-24: Added unit tests for config/time/terrain plus a build smoke check wired to `npm run tests`, and documented run/test steps in README.
- 2025-11-24: Added kill-tracking growth (5% size and spear reach per kill) synced over state, and made joiners adopt any existing time anchor/speed from the room.
- 2025-11-24: Centralized world elevation thresholds (ELEV_MAX/biome bands/tree band/summit scan) into `world/constants.js` to remove duplicated magic numbers in terrain generation.
- 2025-11-24: Added a generic StateStore + TerrainCache that persists chunk data via PeerCompute's StateManager/IndexedDB (enablePersistence on), so previously generated terrain can be reused across sessions/peers without a game-specific state API.
- 2025-11-24: Added versioned terrain cache with wipe-on-upgrade plus unit tests for cache versioning and PeerCompute StateManager namespace helpers.
- 2025-11-24: Fixed terrain cache reuse by validating grid size/LOD before applying cached heights (prevents corrupted terrain after LOD changes) and bumped `GAME_VERSION` to 0.2.1.
- 2025-11-24: Offloaded terrain chunk computation to PeerCompute's new worker-backed ComputeManager (module task), added async chunk jobs, worker fallback, and tests for ComputeManager/terrain task execution.
- 2025-11-24: Re-enabled full terrain persistence to IndexedDB (local-only sync) and increased compute workers to 128 to speed up chunk generation (monitor browser limits/thread contention).
- 2025-11-24: Increased terrain compute workers to 128 to speed up chunk generation (monitor browser limits/thread contention).
