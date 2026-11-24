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
