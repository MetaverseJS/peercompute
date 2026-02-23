#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_env_file="${RELAY_ENV_FILE:-$repo_root/config/relay.env}"
if [[ -f "$relay_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$relay_env_file"
fi
relay_dir="$repo_root/peercompute/src/relay-go"

if ! command -v go >/dev/null 2>&1; then
  echo "[relay] Go not found. Install Go to run the Go relay." >&2
  exit 1
fi

can_write_path_or_parent() {
  local path="${1:-}"
  if [[ -z "$path" ]]; then
    return 1
  fi
  local target_dir="$path"
  if [[ ! -e "$target_dir" ]]; then
    target_dir="$(dirname "$target_dir")"
  fi
  if [[ ! -d "$target_dir" ]]; then
    return 1
  fi
  local probe="$target_dir/.peercompute-writecheck-$$"
  if ( : > "$probe" ) 2>/dev/null; then
    rm -f "$probe" 2>/dev/null || true
    return 0
  fi
  return 1
}

if [[ -z "${CGO_ENABLED:-}" ]]; then
  export CGO_ENABLED=0
fi

if [[ -z "${GOCACHE:-}" ]]; then
  default_gocache="$(go env GOCACHE 2>/dev/null || true)"
  if ! can_write_path_or_parent "$default_gocache"; then
    export GOCACHE="${TMPDIR:-/tmp}/peercompute-go-build"
    echo "[relay] using fallback GOCACHE=$GOCACHE" >&2
  fi
fi
if [[ -n "${GOCACHE:-}" ]]; then
  mkdir -p "$GOCACHE"
fi

if [[ -z "${GOMODCACHE:-}" ]]; then
  default_gomodcache="$(go env GOMODCACHE 2>/dev/null || true)"
  if ! can_write_path_or_parent "$default_gomodcache"; then
    export GOMODCACHE="${TMPDIR:-/tmp}/peercompute-go-modcache"
    echo "[relay] using fallback GOMODCACHE=$GOMODCACHE" >&2
  fi
fi
if [[ -n "${GOMODCACHE:-}" ]]; then
  mkdir -p "$GOMODCACHE"
fi

cd "$relay_dir"
exec go run .
