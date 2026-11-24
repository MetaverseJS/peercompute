# Publish `peercompute` and `exopute` on npm (`0.1.0-alpha.1`)

## Outcome

Legitimately reserve both `peercompute` and `exopute` on npm by publishing real, working `0.1.0-alpha.1` packages (`peercompute` with `.` / `./core` / `./inference`, and thin real `exopute` wrapper in `packages/exopute/` re-exporting from `peercompute`) without performing a global repo rename yet.

## Context

- `exopute.com`, `exopute.net`, `exopute.io`, and `exopute.org` are registered.
- npm's Package Name Disputes policy disallows empty placeholder packages; publishing the actual working library (`peercompute`) plus a real thin re-export package (`exopute`) avoids squatting risk while letting consumers import from either name.
- Package manifests, MIT `LICENSE` files, `files` whitelists, and `packages/exopute/` wrapper + unit tests are already prepared on `main`.

## Acceptance checks

- [x] `peercompute/package.json` cleaned for publish (`version: "0.1.0-alpha.1"`, `private` removed, `files` whitelist added, duplicate `playwright` removed from `dependencies`, MIT `LICENSE` added).
- [x] `packages/exopute/` created with real `.`, `./core`, `./inference` re-exports, `LICENSE`, `README.md`, and passing unit tests.
- [x] `(cd peercompute && npm pack --dry-run)` (`744.5 kB`, 214 files) and `(cd packages/exopute && npm pack --dry-run)` (`1.8 kB`, 6 files) emit clean tarballs with zero test/dist/relay clutter.
- [ ] Run `npm login` and claim free public npm orgs `@exopute` and `@peercompute` (plus `github.com/exopute`).
- [ ] Run `(cd peercompute && npm publish --access public --tag alpha)` followed by `(cd packages/exopute && npm publish --access public --tag alpha)`.
- [ ] Verify `npm view peercompute` and `npm view exopute` resolve cleanly from `registry.npmjs.org`.
