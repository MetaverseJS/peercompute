#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_dir="$repo_root/peercompute/src/relay-go"

if ! command -v go >/dev/null 2>&1; then
  echo "[relay] Go not found. Install Go to run the Go relay." >&2
  exit 1
fi

cd "$relay_dir"
exec go run .
