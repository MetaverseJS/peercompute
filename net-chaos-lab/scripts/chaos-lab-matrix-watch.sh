#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
artifacts_root="$repo_root/net-chaos-lab/artifacts"

sleep_seconds="${CHAOS_MATRIX_WATCH_SLEEP_SECONDS:-2}"
follow=0
since_latest=1

usage() {
  cat <<'USAGE'
Usage: bash net-chaos-lab/scripts/chaos-lab-matrix-watch.sh [options]

Watches chaos-lab artifact output for matrix completion and prints a compact summary.

Options:
  --once             Exit after the first detected completed matrix run (default).
  --follow           Keep watching and print every newly completed matrix run.
  --since-latest     Ignore current latest summary and wait for a newer one (default).
  --include-current  Allow current latest summary to be reported immediately.
  --sleep <seconds>  Poll interval in seconds. Default: 2.
  --help             Show this help text.

Examples:
  npm run chaos-lab:matrix:watch
  npm run chaos-lab:matrix:watch -- --include-current --once
  npm run chaos-lab:matrix:watch -- --follow --sleep 1
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --once)
      follow=0
      shift
      ;;
    --follow)
      follow=1
      shift
      ;;
    --since-latest)
      since_latest=1
      shift
      ;;
    --include-current)
      since_latest=0
      shift
      ;;
    --sleep)
      [[ $# -ge 2 ]] || { echo "[chaos-lab-watch] missing value for --sleep" >&2; exit 2; }
      sleep_seconds="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "[chaos-lab-watch] unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if ! [[ "$sleep_seconds" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "[chaos-lab-watch] --sleep must be numeric (got: $sleep_seconds)" >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "[chaos-lab-watch] jq is required for matrix summary parsing." >&2
  exit 2
fi

latest_summary_path() {
  ls -1t "$artifacts_root"/20*/matrix-summary.json 2>/dev/null | head -n1 || true
}

summary_is_ready() {
  local summary_path="$1"
  [[ -f "$summary_path" ]] || return 1
  jq -e . "$summary_path" >/dev/null 2>&1
}

print_summary() {
  local summary_path="$1"
  echo "[chaos-lab-watch] detected completed matrix summary"
  echo "[chaos-lab-watch] path=$summary_path"
  jq -r '
    "[chaos-lab-watch] matrix=" + (.matrix_name // "unknown") +
    " run_id=" + (.matrix_run_id // "unknown") +
    " all_passed=" + ((.all_passed // false)|tostring) +
    " passed=" + ((.run_passed // 0)|tostring) + "/" + ((.run_total // 0)|tostring) +
    " failed=" + ((.run_failed // 0)|tostring),
    (.results[]? |
      "[chaos-lab-watch] run=" + (.id // "unknown") +
      " conn=" + ((.summary.connection_success_rate // 0)|tostring) +
      " direct=" + ((.summary.direct_connection_rate // 0)|tostring) +
      " announce=" + ((.summary.avg_announced_direct_webrtc_addrs // 0)|tostring) +
      " preflight=" + ((.summary.preflight_success_rate // 0)|tostring) +
      " infra=" + ((.summary.infra_failure_rate // 0)|tostring)
    )
  ' "$summary_path"

  local gate_failures
  gate_failures="$(jq -r '
    [ .results[]? as $r
      | $r.gates[]?
      | select((.passed // false) | not)
      | "[chaos-lab-watch] gate_fail run=" + ($r.id // "unknown") +
        " metric=" + (.metric // "unknown") +
        " op=" + (.op // "?") +
        " expected=" + ((.expected // "?")|tostring) +
        " actual=" + ((.actual // "?")|tostring) +
        " required=" + ((.required // false)|tostring)
    ] | .[]
  ' "$summary_path")"

  if [[ -n "${gate_failures:-}" ]]; then
    echo "$gate_failures"
  else
    echo "[chaos-lab-watch] no failing gates in this matrix summary"
  fi
}

declare -A seen=()
seed_path=""
if (( since_latest == 1 )); then
  seed_path="$(latest_summary_path)"
  if [[ -n "$seed_path" ]]; then
    seen["$seed_path"]=1
    echo "[chaos-lab-watch] waiting for a summary newer than: $seed_path"
  else
    echo "[chaos-lab-watch] waiting for first matrix summary under $artifacts_root"
  fi
else
  echo "[chaos-lab-watch] include-current enabled; reporting latest ready summary when found"
fi

while true; do
  summary_path="$(latest_summary_path)"
  if [[ -n "$summary_path" ]] && [[ -z "${seen[$summary_path]+x}" ]] && summary_is_ready "$summary_path"; then
    seen["$summary_path"]=1
    print_summary "$summary_path"
    if (( follow == 0 )); then
      exit 0
    fi
  fi
  sleep "$sleep_seconds"
done
