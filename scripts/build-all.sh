#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$repo_root"

npm run build:peercompute
node "$repo_root/scripts/write-prod-relay-config.mjs"
npm run build:demos
