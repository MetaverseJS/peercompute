#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
loop_command=("$repo_root/net-chaos-lab/scripts/chaos-lab-matrix-full.sh")

max_runs="${CHAOS_MATRIX_LOOP_MAX_RUNS:-0}"
sleep_seconds="${CHAOS_MATRIX_LOOP_SLEEP_SECONDS:-10}"
until_pass=1
sudo_keepalive=1

declare -a forward_args=()

usage() {
  cat <<'EOF'
Usage: bash net-chaos-lab/scripts/chaos-lab-matrix-loop.sh [options] [-- <matrix-full args>]

Options:
  --max-runs <N>        Stop after N iterations (0 = run indefinitely). Default: 0
  --sleep <seconds>     Sleep interval between iterations. Default: 10
  --until-pass          Stop when matrix summary reports all_passed=true (default).
  --no-until-pass       Ignore pass condition; only stop on max-runs or Ctrl-C.
  --no-sudo-keepalive   Do not maintain sudo timestamp in background.
  --help                Show this help text.

Examples:
  npm run chaos-lab:matrix:loop
  npm run chaos-lab:matrix:loop -- --max-runs 5 --sleep 20
  npm run chaos-lab:matrix:loop -- --no-until-pass --max-runs 20
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --max-runs)
      [[ $# -ge 2 ]] || { echo "[chaos-lab-loop] missing value for --max-runs" >&2; exit 2; }
      max_runs="$2"
      shift 2
      ;;
    --sleep)
      [[ $# -ge 2 ]] || { echo "[chaos-lab-loop] missing value for --sleep" >&2; exit 2; }
      sleep_seconds="$2"
      shift 2
      ;;
    --until-pass)
      until_pass=1
      shift
      ;;
    --no-until-pass)
      until_pass=0
      shift
      ;;
    --no-sudo-keepalive)
      sudo_keepalive=0
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --)
      shift
      forward_args+=("$@")
      break
      ;;
    *)
      forward_args+=("$1")
      shift
      ;;
  esac
done

if ! [[ "$max_runs" =~ ^[0-9]+$ ]]; then
  echo "[chaos-lab-loop] --max-runs must be an integer >= 0 (got: $max_runs)" >&2
  exit 2
fi
if ! [[ "$sleep_seconds" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "[chaos-lab-loop] --sleep must be numeric (got: $sleep_seconds)" >&2
  exit 2
fi

keepalive_pid=""

start_sudo_keepalive() {
  if (( sudo_keepalive == 0 )); then
    return
  fi
  if ! command -v sudo >/dev/null 2>&1; then
    return
  fi
  if ! sudo -n true >/dev/null 2>&1; then
    if [[ ! -t 0 ]]; then
      echo "[chaos-lab-loop] warning: sudo credentials are not cached and no tty is available; loop runs may fail." >&2
      return
    fi
    echo "[chaos-lab-loop] requesting sudo once for unattended loop..."
    sudo -v
  fi
  (
    while true; do
      sudo -n true >/dev/null 2>&1 || exit 0
      sleep 50
    done
  ) &
  keepalive_pid="$!"
}

cleanup() {
  if [[ -n "$keepalive_pid" ]] && kill -0 "$keepalive_pid" >/dev/null 2>&1; then
    kill "$keepalive_pid" >/dev/null 2>&1 || true
    wait "$keepalive_pid" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

start_sudo_keepalive

iteration=0
while true; do
  iteration=$((iteration + 1))
  started_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[chaos-lab-loop] iteration=$iteration started_at=$started_at"

  set +e
  bash "${loop_command[@]}" "${forward_args[@]}"
  rc=$?
  set -e

  summary_path="$(ls -1t "$repo_root"/net-chaos-lab/artifacts/20*/matrix-summary.json 2>/dev/null | head -n1 || true)"
  all_passed="false"
  if [[ -n "$summary_path" ]] && command -v jq >/dev/null 2>&1; then
    matrix_name="$(jq -r '.matrix_name // "unknown"' "$summary_path")"
    all_passed="$(jq -r '.all_passed // false' "$summary_path")"
    run_failed="$(jq -r '.run_failed // 0' "$summary_path")"
    run_total="$(jq -r '.run_total // 0' "$summary_path")"
    conn_rate="$(jq -r '.results[0].summary.connection_success_rate // 0' "$summary_path")"
    direct_rate="$(jq -r '.results[0].summary.direct_connection_rate // 0' "$summary_path")"
    announce_rate="$(jq -r '.results[0].summary.avg_announced_direct_webrtc_addrs // 0' "$summary_path")"
    echo "[chaos-lab-loop] iteration=$iteration rc=$rc matrix=$matrix_name pass=$all_passed failed=$run_failed/$run_total conn=$conn_rate direct=$direct_rate announce=$announce_rate"
    echo "[chaos-lab-loop] summary=$summary_path"
  else
    echo "[chaos-lab-loop] iteration=$iteration rc=$rc summary unavailable"
  fi

  if (( until_pass == 1 )) && [[ "$all_passed" == "true" ]]; then
    echo "[chaos-lab-loop] stopping after pass (iteration=$iteration)."
    break
  fi
  if (( max_runs > 0 && iteration >= max_runs )); then
    echo "[chaos-lab-loop] stopping at max-runs=$max_runs."
    break
  fi

  echo "[chaos-lab-loop] sleeping ${sleep_seconds}s before next iteration..."
  sleep "$sleep_seconds"
done
