# Detailed development log: `feature/vibe-plan-and-repo-hygiene`

- **Branch:** `feature/vibe-plan-and-repo-hygiene` (branched off `main` `c5c24a76`)
- **Started:** 2026-11-23

## 2026-11-23 12:04–16:55 AKST — Pre-branch Brand Exploration (`exopute`) & Hygiene Audit (Carried Forward)

- Brainstormed rebrand candidates (`chaosCompute`, Celtic myth, Irish Gaelic, `exopute`), verified zero npm/GitHub/PyPI/crates.io collisions for `exopute`, and noted user acquired `exopute.{com,net,io,org}`.
- Audited `plan/` (`29 MB`, `5.25 MB` monolithic `plan/log.md`, `618 KB` `plan/tests.md`, `390 KB` `plan/plan.md`), tracked root/subdir clutter, and npm publish readiness against `/home/cos/projects/vibe-plan`.

## 2026-11-23 16:59:27 AKST — Migrate `plan/` to `vibe-plan`, Clean Tracked Clutter & Prep `peercompute` / `exopute` npm Reservation

- **Prompt time/date:** `2026-11-23 16:59:27 AKST` (`2026-11-23T16:59:27-09:00`)
- **Prompt:** *"ok go ahead and do it. we'll want to do this in a new branch I think. then merge back to main. have we already merged and committed the changes requested for ulg?"*

### Actions & strategy

1. Confirmed ULG scale-ladder extensions were already fast-forward merged to `main` and pushed to `origin/main` at `c5c24a76`.
2. Checked out branch `feature/vibe-plan-and-repo-hygiene` off `main` `c5c24a76` while preserving the 4 pre-existing untouched conjecture/patch WIP files (`peercompute/experiments/conjecture/{meshRun.js,results/2026-11-20-calibration.json,scaleCalibrated.mjs}`, `scripts/gallery-pointer.patch`) unstaged and intact.
3. **Migrated `plan/` to `/home/cos/projects/vibe-plan` layout:**
   - Added `plan/README.md`, distilled user-owned `plan/plan.md`, created `plan/arch/{best-practices,stack}.md`, moved `.drawio` sources to `plan/arch/diagrams/` (keeping README-linked PNGs at `plan/arch/*.png`), created `plan/test/test.md`, `plan/workflow/{development,version-control}.md`, `plan/todo/{priority.md,_template.md,npm-package-reservation.md,retire-multiscale-and-webpack.md,done/,hiatus/}`, and `plan/log/{log-summary.md,detail/_template.md,detail/feature--vibe-plan-and-repo-hygiene.md}`.
   - Moved `plan/branch/keystone-demo.md` → `plan/todo/keystone-demo.md`, `plan/root-node-todo.md` → `plan/todo/root-node.md`, completed `plan/todo/ulg-scale-ladder-peercompute-extensions.md` + remaining `plan/branch/*.md` → `plan/todo/done/`, removed stale symlink `plan/branch/current-branch.md`, retired monolithic `plan/log.md` (`5.25 MB`) and `plan/tests.md` (`618 KB`) (preserved in Git at `c5c24a76`), and removed superseded `plan/refs/ULG_PeerCompute_Star_Spec_v0.3_Bundle.zip`.
   - Updated `AGENTS.md`, `README.md`, and `demos/inference/README.md` links.
4. **Cleaned tracked repo clutter (keeping actively referenced `peercompute/test-p2p.html` intact!):**
   - Removed tracked `.relay.pid`, `.webpack.pid`, `a.out`, `webpack.log`, `webrtc_internals_dump.txt`, `rtcstats_dump.gz`, `peercompute/{package-lock.json,deno.json,test-multiaddr.js,test-y-libp2p.js,test-automated.html,playwright-report/index.html,test-results/.last-run.json}`, `demos/cubechat/{package-lock.json,sneakywoods.html}`, and 21 stale tracked files under `demos/{cubechat,planetgen,universes,webgpuphys}/docs/`.
   - Moved bare root `secretworkshop.net` nginx config to `config/nginx/secretworkshop.net` and hardened `.gitignore`.
5. **Prepared npm reservation packages (`peercompute@0.1.0-alpha.1` + `exopute@0.1.0-alpha.1`):**
   - Added MIT `LICENSE` to root, `peercompute/`, and `packages/exopute/`.
   - Cleaned `peercompute/package.json` (version `0.1.0-alpha.1`, removed `private: true`, added `files` whitelist, removed duplicate `playwright` from `dependencies`, added metadata).
   - Added real thin wrapper workspace `packages/exopute/` (re-exporting `.`, `./core`, `./inference` from `peercompute`) + unit test `packages/exopute/tests/exopute.test.js` + added `packages/exopute` to root `package.json` `workspaces`.
   - Note: intentionally kept root `package.json` without `"type": "module"` because `demos/tests/demo-ports.test.js` and `demos/tests/demo-release.test.js` use CommonJS `require()`.

### Files touched

- `AGENTS.md`, `README.md`, `demos/inference/README.md`, `.gitignore`, `LICENSE`, `package.json`, `config/nginx/secretworkshop.net`
- `plan/**` (`vibe-plan` migration)
- `peercompute/package.json`, `peercompute/LICENSE`
- `packages/exopute/{package.json,README.md,LICENSE,src/index.js,src/core.js,src/inference.js,tests/exopute.test.js}`
- Removed tracked stray/obsolete files listed above.

### Commands & test results (Node `v24.18.0`)

- `node --test packages/exopute/tests/exopute.test.js peercompute/tests/unit/coreEntrypoint.test.js peercompute/tests/unit/spatialTileLeaseBroker.test.js peercompute/tests/unit/webrtcIceSurfacing.test.js peercompute/tests/unit/warmWorkerAffinity.test.js` — **16/16 PASS**.
- `node --test demos/tests/demo-ports.test.js demos/tests/demo-release.test.js demos/tests/backend-server.test.js` — **56/56 PASS** (verifying all root README links, demo wiring, and backend scripts intact).
- `(cd peercompute && npm pack --dry-run)` — **PASS** (`peercompute-0.1.0-alpha.1.tgz`, `744.5 kB` packed, `3.2 MB` unpacked, `214` files, zero test/dist/relay clutter).
- `(cd packages/exopute && npm pack --dry-run)` — **PASS** (`exopute-0.1.0-alpha.1.tgz`, `1.8 kB` packed, `3.2 kB` unpacked, `6` files).
- Committed cleanly on `feature/vibe-plan-and-repo-hygiene` and fast-forward merged back to `main` (kept local; not pushed). Pre-existing conjecture/patch WIP files preserved untouched and unstaged.
