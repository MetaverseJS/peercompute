#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/pcserver.sh" >&2
  exit 1
fi
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_env_file="${RELAY_ENV_FILE:-$repo_root/config/relay.env}"
if [[ -f "$relay_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$relay_env_file"
fi

enable_relay="${PCSERVER_ENABLE_RELAY:-1}"
enable_turn="${PCSERVER_ENABLE_TURN:-1}"
dry_run=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=1
      shift
      ;;
    --relay-only)
      enable_relay=1
      enable_turn=0
      shift
      ;;
    --turn-only)
      enable_relay=0
      enable_turn=1
      shift
      ;;
    --no-relay)
      enable_relay=0
      shift
      ;;
    --no-turn)
      enable_turn=0
      shift
      ;;
    *)
      echo "[pcserver] unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

case "$enable_relay" in
  0|[Ff][Aa][Ll][Ss][Ee]|[Nn][Oo]) enable_relay=0 ;;
  *) enable_relay=1 ;;
esac
case "$enable_turn" in
  0|[Ff][Aa][Ll][Ss][Ee]|[Nn][Oo]) enable_turn=0 ;;
  *) enable_turn=1 ;;
esac

if [[ "$enable_relay" != "1" && "$enable_turn" != "1" ]]; then
  echo "[pcserver] nothing to start; enable relay and/or turn." >&2
  exit 2
fi

if [[ "$dry_run" == "1" ]]; then
  echo "[pcserver] dry-run"
  if [[ "$enable_relay" == "1" ]]; then
    echo "[pcserver] would run: bash $repo_root/scripts/start-relay-prod.sh"
  fi
  if [[ "$enable_turn" == "1" ]]; then
    PCSERVER_ENABLE_TURN=1 bash "$repo_root/scripts/start-turn-prod.sh" --dry-run
  fi
  exit 0
fi

declare -a child_pids=()

shutdown_children() {
  local sig="${1:-TERM}"
  local pid
  for pid in "${child_pids[@]:-}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "-$sig" "$pid" >/dev/null 2>&1 || true
    fi
  done
}

trap 'shutdown_children TERM' TERM INT HUP
trap 'shutdown_children KILL' EXIT

start_child() {
  local name="$1"
  shift
  echo "[pcserver] starting $name..."
  "$@" &
  local pid=$!
  child_pids+=("$pid")
  echo "[pcserver] $name pid=$pid"
}

if [[ "$enable_turn" == "1" ]]; then
  start_child turn bash "$repo_root/scripts/start-turn-prod.sh"
fi

if [[ "$enable_relay" == "1" ]]; then
  start_child relay bash "$repo_root/scripts/start-relay-prod.sh"
fi

set +e
wait -n "${child_pids[@]}"
rc=$?
set -e

if [[ "$rc" -ne 0 ]]; then
  echo "[pcserver] a backend service exited with rc=$rc; stopping remaining children." >&2
else
  echo "[pcserver] a backend service exited cleanly; stopping remaining children."
fi

shutdown_children TERM
wait || true
trap - EXIT
exit "$rc"
