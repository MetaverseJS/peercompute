#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

script_name="${CHAOS_IPV6_LOOP_SCRIPT:-chaos-lab:ipv6:min}"
max_runs="${CHAOS_IPV6_LOOP_MAX_RUNS:-0}"
sleep_seconds="${CHAOS_IPV6_LOOP_SLEEP_SECONDS:-10}"
until_target=1
sudo_keepalive=1

target_conn="${CHAOS_IPV6_LOOP_TARGET_CONN:-0.95}"
target_direct="${CHAOS_IPV6_LOOP_TARGET_DIRECT:-0.60}"
target_preflight="${CHAOS_IPV6_LOOP_TARGET_PREFLIGHT:-0.90}"
target_infra_max="${CHAOS_IPV6_LOOP_TARGET_INFRA_MAX:-0.10}"

usage() {
  cat <<'EOF'
Usage: bash net-chaos-lab/scripts/chaos-lab-ipv6-loop.sh [options]

Runs chaos-lab IPv6 minimal scenario repeatedly and prints summary metrics after each run.

Options:
  --max-runs <N>          Stop after N iterations (0 = run indefinitely). Default: 0
  --sleep <seconds>       Sleep interval between iterations. Default: 10
  --until-target          Stop when configured metric targets are met (default).
  --no-until-target       Ignore metric targets; stop only on max-runs or Ctrl-C.
  --target-conn <value>   Required connection_success_rate. Default: 0.95
  --target-direct <value> Required direct_connection_rate. Default: 0.60
  --target-preflight <v>  Required preflight_success_rate. Default: 0.90
  --target-infra-max <v>  Maximum infra_failure_rate. Default: 0.10
  --script <name>         NPM script to run (chaos-lab:ipv6:min or :all).
  --all                   Shortcut for --script chaos-lab:ipv6:min:all
  --no-sudo-keepalive     Do not maintain sudo timestamp in background.
  --help                  Show this help text.

Examples:
  npm run chaos-lab:ipv6:loop
  npm run chaos-lab:ipv6:loop -- --max-runs 100 --sleep 15
  npm run chaos-lab:ipv6:loop -- --no-until-target --max-runs 500
  npm run chaos-lab:ipv6:loop -- --all --target-direct 0.40
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --max-runs)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --max-runs" >&2; exit 2; }
      max_runs="$2"
      shift 2
      ;;
    --sleep)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --sleep" >&2; exit 2; }
      sleep_seconds="$2"
      shift 2
      ;;
    --until-target)
      until_target=1
      shift
      ;;
    --no-until-target)
      until_target=0
      shift
      ;;
    --target-conn)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --target-conn" >&2; exit 2; }
      target_conn="$2"
      shift 2
      ;;
    --target-direct)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --target-direct" >&2; exit 2; }
      target_direct="$2"
      shift 2
      ;;
    --target-preflight)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --target-preflight" >&2; exit 2; }
      target_preflight="$2"
      shift 2
      ;;
    --target-infra-max)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --target-infra-max" >&2; exit 2; }
      target_infra_max="$2"
      shift 2
      ;;
    --script)
      [[ $# -ge 2 ]] || { echo "[chaos-ipv6-loop] missing value for --script" >&2; exit 2; }
      script_name="$2"
      shift 2
      ;;
    --all)
      script_name="chaos-lab:ipv6:min:all"
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
    *)
      echo "[chaos-ipv6-loop] unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if ! [[ "$max_runs" =~ ^[0-9]+$ ]]; then
  echo "[chaos-ipv6-loop] --max-runs must be an integer >= 0 (got: $max_runs)" >&2
  exit 2
fi
if ! [[ "$sleep_seconds" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "[chaos-ipv6-loop] --sleep must be numeric (got: $sleep_seconds)" >&2
  exit 2
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "[chaos-ipv6-loop] jq is required to parse run summaries." >&2
  exit 2
fi

numeric_re='^-?[0-9]+([.][0-9]+)?$'
for value in "$target_conn" "$target_direct" "$target_preflight" "$target_infra_max"; do
  if ! [[ "$value" =~ $numeric_re ]]; then
    echo "[chaos-ipv6-loop] target values must be numeric (got: $value)" >&2
    exit 2
  fi
done

ge() {
  awk -v a="$1" -v b="$2" 'BEGIN { exit !((a+0) >= (b+0)) }'
}

le() {
  awk -v a="$1" -v b="$2" 'BEGIN { exit !((a+0) <= (b+0)) }'
}

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
      echo "[chaos-ipv6-loop] warning: sudo credentials are not cached and no tty is available; runs may fail." >&2
      return
    fi
    echo "[chaos-ipv6-loop] requesting sudo once for unattended loop..."
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
  echo "[chaos-ipv6-loop] iteration=$iteration started_at=$started_at script=$script_name"

  set +e
  (cd "$repo_root" && npm run "$script_name")
  rc=$?
  set -e

  latest_dir="$(ls -1dt "$repo_root"/net-chaos-lab/artifacts/20* 2>/dev/null | head -n1 || true)"
  summary_path=""
  conn="0"
  direct="0"
  preflight="0"
  infra="1"
  run_id="unknown"
  if [[ -n "$latest_dir" ]] && [[ -f "$latest_dir/metrics-summary.json" ]]; then
    summary_path="$latest_dir/metrics-summary.json"
    run_id="$(jq -r '.run_id // "unknown"' "$summary_path")"
    conn="$(jq -r '.connection_success_rate // 0' "$summary_path")"
    direct="$(jq -r '.direct_connection_rate // 0' "$summary_path")"
    preflight="$(jq -r '.preflight_success_rate // 0' "$summary_path")"
    infra="$(jq -r '.infra_failure_rate // 1' "$summary_path")"
    echo "[chaos-ipv6-loop] iteration=$iteration rc=$rc run_id=$run_id conn=$conn direct=$direct preflight=$preflight infra=$infra"
    echo "[chaos-ipv6-loop] summary=$summary_path"
  else
    echo "[chaos-ipv6-loop] iteration=$iteration rc=$rc summary unavailable"
  fi

  if (( until_target == 1 )) && [[ -n "$summary_path" ]]; then
    if ge "$conn" "$target_conn" && ge "$direct" "$target_direct" && ge "$preflight" "$target_preflight" && le "$infra" "$target_infra_max"; then
      echo "[chaos-ipv6-loop] target reached at iteration=$iteration (conn>=${target_conn}, direct>=${target_direct}, preflight>=${target_preflight}, infra<=${target_infra_max})."
      break
    fi
  fi

  if (( max_runs > 0 && iteration >= max_runs )); then
    echo "[chaos-ipv6-loop] stopping at max-runs=$max_runs."
    break
  fi

  echo "[chaos-ipv6-loop] sleeping ${sleep_seconds}s before next iteration..."
  sleep "$sleep_seconds"
done
