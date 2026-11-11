#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

# Preserve one previous active release, not an ever-growing chain of old bundles.
release_snapshot="$(mktemp -d "${TMPDIR:-/tmp}/peercompute-pages-release.XXXXXXXX")"
trap 'rm -rf -- "$release_snapshot"' EXIT
capture_args=(capture --repo "$repo_root" --snapshot "$release_snapshot")
if [[ -n "${PEERCOMPUTE_PAGES_MIGRATION_MANIFEST:-}" ]]; then
  capture_args+=(--migration-manifest "$PEERCOMPUTE_PAGES_MIGRATION_MANIFEST"
    --migration-revision "${PEERCOMPUTE_PAGES_MIGRATION_REVISION:?Set the previous release revision}")
fi
node "$repo_root/scripts/pagesReleaseAssets.mjs" "${capture_args[@]}"
# This directory contains only pooled generated runtimes; fresh builds repopulate it.
rm -rf -- "$repo_root/docs/assets/runtime"
npm run build:peercompute
node "$repo_root/scripts/write-prod-relay-config.mjs"
PEERCOMPUTE_PAGES_SHARED_RUNTIME=1 npm run build:demos
node "$repo_root/scripts/pagesReleaseAssets.mjs" finalize --repo "$repo_root" --snapshot "$release_snapshot"
