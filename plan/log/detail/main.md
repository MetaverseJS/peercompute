# Detailed development log: `main`

- **Branch:** `main`
- **Started:** 2026-11-23

## 2026-11-23 17:10:05 AKST — Publish `peercompute@0.1.0-alpha.1` & `exopute@0.1.0-alpha.1` to npm

- **Prompt time/date:** `2026-11-23 17:09:51 AKST` (`2026-11-23T17:09:51-09:00`)
- **Prompt:** *"ok I logged in go ahead and publish"*

### Actions & status

- Verified `npm whoami` succeeded and started `(cd peercompute && npm publish --access public --tag alpha)` (`task-2374`).
- npm requested interactive browser 2FA confirmation at `https://www.npmjs.com/auth/cli/3362cb0a-a449-45f1-a3f5-8d5f7e29257d`. Left task waiting and handed the exact auth URL to the user to approve.


## 2026-11-23 17:14:15 AKST — `peercompute@0.1.0-alpha.1` Published; Awaiting 2FA Approval for `exopute@0.1.0-alpha.1`

- **Prompt time/date:** `2026-11-23 17:14:02 AKST` (`2026-11-23T17:14:02-09:00`)
- **Prompt:** *"sweet are we done?"*

### Actions & status

- Confirmed `+ peercompute@0.1.0-alpha.1` published cleanly to `registry.npmjs.org` (`task-2374`, propagating on npm CDN).
- `task-2374` advanced to `packages/exopute` (`exopute@0.1.0-alpha.1`, `1.8 kB`, 6 files) and is waiting on browser 2FA confirmation at `https://www.npmjs.com/auth/cli/73710cb5-6ca6-4ccb-83c3-9635995b3419`.


## 2026-11-23 17:17:15 AKST — Confirmed Both `peercompute@0.1.0-alpha.1` & `exopute@0.1.0-alpha.1` Published on npm

- **Prompt time/date:** `2026-11-23 17:17:00 AKST` (`2026-11-23T17:17:00-09:00`)
- **Prompt:** *"done"*

### Actions & results

- Confirmed `+ peercompute@0.1.0-alpha.1` (`shasum: afb7ae7b5ea8db1fdd1cbebf3a83dc28d8ff445b`) and `+ exopute@0.1.0-alpha.1` (`shasum: 1ddc7b9865f338ea6ad24ba7b44933b04f90d429`) both published cleanly to `registry.npmjs.org` under `ubernaut`.
- `npm view peercompute` and `npm view exopute` both now return `200 OK` (`0.0.0-stage` while npm finishes its new-package async processing window to promote `0.1.0-alpha.1`).
- Updated `plan/todo/npm-package-reservation.md`, `plan/log/log-summary.md`, and `plan/log/detail/main.md`, and committed locally on `main`.


## 2026-11-23 17:22:25 AKST — Analyzed Demo Port Topology, Disk Footprint & Consolidation Architecture Options
- **Prompt time/date:** `2026-11-23 17:22:12 AKST` (`2026-11-23T17:22:12-09:00`)
- **Prompt:** *"can you think of a better way for us to structure our demos? it seems kinda heavy and wasteful to need all these ports and whatnot. it also seems to use a lot of space. don't act on it just provide some suggestions."*

### Actions & findings

- Measured actual disk footprint across `docs/` and `demos/`, duplicate `>1 MB` assets/WASM/Cesium copies, per-demo `node_modules/`, and `scripts/dev-all.sh` / `vite.docs.config.mjs` multi-port dev topology.
- Provided ranked architectural recommendations without making any repository edits (read-only analysis as requested).


## 2026-11-23 17:26:55 AKST — Discussed Zero-Demo Lean Core Library Repo vs Separate Demos Repo Boundary
- **Prompt time/date:** `2026-11-23 17:26:41 AKST` (`2026-11-23T17:26:41-09:00`)
- **Prompt:** *"I like evertying but I wonder if ANY demos should be included inside core. I feel like they could depend on it but not get sucked in there. does that make sense? core should be the lean mean library only I think"*

### Actions & findings

- Validated strict library-only core repo architecture (`0` demos inside core; demos/gallery/geodata in a separate consumer repo on 1 multi-page Vite port + GitHub Actions deploy), noting the 1 reverse-dependency seam to clean up before splitting (`peercompute/tests/unit/modelMemoryBudgets.test.js` importing from `demos/inference/src/`) and local side-by-side dev ergonomics (`npm link` / `file:` override). No code edits made.


## 2026-11-23 17:28:55 AKST — Discussed Single-Repo Strict Workspace Architecture (1 Port, Zero Core Leakage)
- **Prompt time/date:** `2026-11-23 17:28:42 AKST` (`2026-11-23T17:28:42-09:00`)
- **Prompt:** *"hmm are we able to do this without actually breaking it into two repos? sorry if this is complicates things"*

### Actions & findings

- Outlined the strict single-repo workspace alternative: enforce a one-way public-export boundary (`demos/` imports only `peercompute/core` or `peercompute/inference`; `peercompute/` never imports from `demos/`), collapse 17 demo Vite servers/packages into one single-port multi-page Vite app under `demos/`, dedupe shared WASM/dependencies, and optionally move `docs/` builds to GitHub Actions Pages deploy. No code edits made.


## 2026-11-23 17:29:45 AKST — Reviewed `three.js` Single-Repo Core + Examples Architecture Pattern
- **Prompt time/date:** `2026-11-23 17:29:34 AKST` (`2026-11-23T17:29:34-09:00`)
- **Prompt:** *"how does three.js do it for example?"*

### Actions & findings

- Inspected `node_modules/three/package.json` (`files`, `exports`, `sideEffects`) and mapped `mrdoob/three.js`'s single-repo architecture (1 repo, strict `files`/`exports` npm publishing whitelist excluding all demos, 1 dev server / 1 port, single `examples/files.json` catalog, zero per-example `package.json`/`node_modules`) directly onto PeerCompute/ExoPute. No code edits made.


## 2026-11-23 17:33:15 AKST — Confirmed Alignment on Three.js-Style Single-Repo Demo Consolidation Strategy
- **Prompt time/date:** `2026-11-23 17:33:03 AKST` (`2026-11-23T17:33:03-09:00`)
- **Prompt:** *"that seems like the right move to me. how about you?"*

### Actions & strategy

- Confirmed strong alignment on the Three.js-style single-repo / 1-port / strict-boundary architecture and proposed a safe 3-phase incremental rollout (Phase 1: core boundary + `peercompute/core` diet + shared WASM + legacy `demos/cubechat/server/node_modules` cleanup; Phase 2: single-port multi-page Vite dev+build server + unified `demos/` deps; Phase 3: GitHub Actions Pages deploy to remove committed `docs/`). Still read-only awaiting user go-ahead.


## 2026-11-24 08:22:30 AKST — Merged `feature/unified-demos-threejs-layout` into `main`, Collapsed Worktree, Synced Dependencies & Pushed to `origin/main`

- **Prompt time/date:** `2026-11-24 08:21:15 AKST` (`2026-11-24T08:21:15-09:00`)
- **Prompt:** *"ok I think we can merge and push and collapse the worktree"*

### Actions & verification

- Verified zero overlap between uncommitted `peercompute/experiments/conjecture/*` files on `main` and `feature/unified-demos-threejs-layout`, and verified untracked `scripts/gallery-pointer.patch` was byte-for-byte identical to the committed copy on the feature branch.
- Removed the duplicate untracked `scripts/gallery-pointer.patch`, fast-forward merged `feature/unified-demos-threejs-layout` (`396308a5..adbabc60`, Phases 1–3) onto `main`, removed the `/home/cos/projects/peercompute-demo-consolidation` worktree, and deleted the merged local branch `feature/unified-demos-threejs-layout`.
- Cleaned any stale per-demo `demos/*/node_modules` directories, ran `npm ci` in `/home/cos/projects/peercompute` (verifying lockfile integrity for CI), and re-verified core boundary + entrypoint + `exopute` unit suites.
- Switched GitHub Pages build source for `MetaverseJS/peercompute` to GitHub Actions (`build_type=workflow`), committed this log update on `main`, pushed `main` to `origin/main`, and confirmed the `.github/workflows/pages.yml` deployment workflow triggered cleanly.
