# Version-control workflow

Use trunk-based development. `main` is the trunk and should remain releasable.

## Working rules

- Start substantive changes from current `main` on a short-lived `feature/` or `bug/` branch.
- Keep commits local at coherent clean points (relevant validation passed, planning docs updated, no validation commands still running). **Push to `origin` only when explicitly told to push.**
- Never force-push `main`.
- Preserve unrelated local changes; never discard or accidentally stage someone else's WIP without authorization.
- Keep credentials, API tokens, PID/log files, generated runtime dumps, and large disposable artifacts out of version control.

## Typical loop

1. **Branch from `main`.** Confirm worktree state, create a short-lived `feature/` or `bug/` branch, and start its detail log under `plan/log/detail/<branch>.md` (replacing `/` with `--`).
2. **Develop & verify locally.** Make focused commits at coherent clean points as tests pass.
3. **Reconcile with `main`.** Sync/rebase if `main` moved, rerun affected checks, and update `plan/log/log-summary.md` + `plan/todo/` state (`todo/done/` or `todo/hiatus/`).
4. **Merge to `main`.** Fast-forward or clean merge into `main` once local verification is green.
5. **Push & deploy (when authorized).** Push `main` to `origin` and run deployment / live Pages / `secretworkshop.net` verification only when explicitly requested.
