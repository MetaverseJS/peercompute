#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_impl="${RELAY_IMPL:-node}"

if [[ "$relay_impl" == "go" ]]; then
  if command -v go >/dev/null 2>&1; then
    exec "$repo_root/scripts/run-go-relay.sh"
  fi
  echo "[relay] RELAY_IMPL=go requested but go is not installed; falling back to node." >&2
  relay_impl="node"
fi

if [[ "$relay_impl" != "node" ]]; then
  echo "[relay] Unknown RELAY_IMPL=$relay_impl (expected 'node' or 'go')." >&2
  exit 1
fi

exec node "$repo_root/peercompute/src/relay/server.js"
