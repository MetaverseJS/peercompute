# Retire `demos/multiscale` & migrate `peercompute` standalone build to Vite

## Outcome

1. Retire `demos/multiscale` cleanly once ULG supersedes it (removing its gallery tile, Pages build entry, and demo port wiring while preserving ULG service orchestration primitives in `peercompute/core`).
2. Replace `peercompute`'s legacy `webpack.config.js` build/dev scripts with Vite to align fully with `plan/arch/stack.md` and `AGENTS.md`.

## Acceptance checks

- [ ] Explicit user go-ahead to retire `demos/multiscale` and remove webpack from `peercompute/package.json`.
- [ ] `npm --prefix peercompute run build` succeeds via Vite with clean `.` / `./core` / `./inference` outputs.
- [ ] `demo-ports.test.js`, `demo-release.test.js`, and `npm run build:all` pass cleanly.
