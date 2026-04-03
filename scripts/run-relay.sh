#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_env_file="${RELAY_ENV_FILE:-$repo_root/config/relay.env}"
if [[ -f "$relay_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$relay_env_file"
fi
relay_impl="${RELAY_IMPL:-go}"
require_go="${RELAY_REQUIRE_GO:-0}"

is_truthy() {
  case "${1:-}" in
    1|[Tt][Rr][Uu][Ee]|[Yy][Ee][Ss]|[Oo][Nn]) return 0 ;;
    *) return 1 ;;
  esac
}

if [[ "$relay_impl" == "go" ]]; then
  if command -v go >/dev/null 2>&1; then
    exec "$repo_root/scripts/run-go-relay.sh"
  fi
  if is_truthy "$require_go"; then
    echo "[relay] RELAY_IMPL=go requested but go is not installed; aborting because RELAY_REQUIRE_GO=$require_go." >&2
    exit 1
  fi
  echo "[relay] RELAY_IMPL=go requested but go is not installed; falling back to node." >&2
  relay_impl="node"
fi

if [[ "$relay_impl" != "node" ]]; then
  echo "[relay] Unknown RELAY_IMPL=$relay_impl (expected 'node' or 'go')." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[relay] Node.js not found in PATH; cannot launch the Node relay fallback." >&2
  exit 1
fi

exec node "$repo_root/peercompute/src/relay/server.js"
