#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
python_bin="${PYTHON_BIN:-python3}"

if ! command -v "$python_bin" >/dev/null 2>&1; then
  echo "[chaos-lab] Python runtime not found: $python_bin" >&2
  exit 1
fi

if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
  if [[ "$node_major" =~ ^[0-9]+$ ]] && (( node_major < 24 )); then
    echo "[chaos-lab] warning: Node.js $node_major detected; Node.js 24 LTS is recommended." >&2
  fi
fi

export PYTHONPATH="$repo_root/net-chaos-lab/src${PYTHONPATH:+:$PYTHONPATH}"

exec "$python_bin" -m chaoslab.main "$@"
