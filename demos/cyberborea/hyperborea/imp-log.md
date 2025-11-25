# Cyberborea Implementation Log

- 2025-11-24: Initialized the Hyperborea project with `npm init`, added webpack dev/build setup that reuses PeerCompute HTTPS cert env vars, installed Three r181 and supporting dependencies, and created the project public scaffold.
- 2025-11-24: Migrated `cb.html` into modular ES modules (config/time/terrain + game loop), pulling NodeKernel via alias and serving `peer-config.json` from PeerCompute through webpack with CSS/HTML templates.
- 2025-11-24: Added unit tests for config/time/terrain plus a build smoke check wired to `npm run tests`, and documented run/test steps in README.
- 2025-11-24: Added kill-tracking growth (5% size and spear reach per kill) synced over state, and made joiners adopt any existing time anchor/speed from the room.
