#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
python_bin="${PYTHON_BIN:-/home/$USER/projects/containernet/.venv/bin/python}"
matrix_config="$repo_root/net-chaos-lab/configs/matrix/direct-regression.yaml"

dashboard_host="${CHAOS_DASHBOARD_HOST:-127.0.0.1}"
dashboard_port="${CHAOS_DASHBOARD_PORT:-8866}"
netviz_host="${CHAOS_NETVIZ_HOST:-0.0.0.0}"
netviz_port="${CHAOS_NETVIZ_PORT:-5182}"

chaos_api_base="${CHAOS_NETVIZ_API_BASE:-/chaos-api}"
chaos_proxy_target="${CHAOS_NETVIZ_PROXY_TARGET:-http://${dashboard_host}:${dashboard_port}}"
chaos_api_encoded="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1] || ""))' "$chaos_api_base")"
default_watch_url="https://localhost:${netviz_port}/?room=telemetry&topologyId=netviz-topology&topologyType=distributed&render=low&dropRelay=true&relayRetentionMode=sqrt&relayRetentionMin=2&chaosApi=${chaos_api_encoded}"
watch_url="${CHAOS_NETVIZ_WATCH_URL:-$default_watch_url}"

netviz_log="$repo_root/net-chaos-lab/artifacts/netviz-watch.log"
mkdir -p "$(dirname "$netviz_log")"
: >"$netviz_log"

netviz_command="${CHAOS_NETVIZ_COMMAND:-npm --prefix \"$repo_root/demos/netviz\" run dev -- --host ${netviz_host} --port ${netviz_port}}"

echo "[chaos-lab] launching NetViz watcher..."
echo "[chaos-lab] netviz command: $netviz_command"
echo "[chaos-lab] netviz log: $netviz_log"

PEERCOMPUTE_NO_OPEN=1 DEV_OPEN_OVERVIEW=0 VITE_CHAOS_API_PROXY_TARGET="$chaos_proxy_target" bash -lc "$netviz_command" >>"$netviz_log" 2>&1 &
netviz_pid=$!

cleanup() {
  if [[ -n "${netviz_pid:-}" ]] && kill -0 "$netviz_pid" >/dev/null 2>&1; then
    kill "$netviz_pid" >/dev/null 2>&1 || true
    wait "$netviz_pid" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

sleep 2
if ! kill -0 "$netviz_pid" >/dev/null 2>&1; then
  echo "[chaos-lab] failed to keep NetViz running; recent log lines:" >&2
  tail -n 40 "$netviz_log" >&2 || true
  exit 1
fi

echo "[chaos-lab] open NetViz watcher URL:"
echo "  $watch_url"
echo "[chaos-lab] netviz chaos proxy target: $chaos_proxy_target"

cmd=(
  bash "$repo_root/net-chaos-lab/scripts/chaos-lab.sh"
  --matrix "$matrix_config"
  --dashboard-host "$dashboard_host"
  --dashboard-port "$dashboard_port"
)
if [[ "$#" -gt 0 ]]; then
  cmd+=("$@")
fi

sudo -E env "PATH=$PATH" PYTHON_BIN="$python_bin" "${cmd[@]}"
