#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
python_bin="${PYTHON_BIN:-/home/$USER/projects/containernet/.venv/bin/python}"
matrix_config_default="$repo_root/net-chaos-lab/configs/matrix/direct-regression.yaml"
matrix_config="${CHAOSLAB_MATRIX_CONFIG:-$matrix_config_default}"
if [[ ! -f "$matrix_config" ]]; then
  echo "[chaos-lab] matrix config not found: $matrix_config" >&2
  exit 2
fi

pick_free_port() {
  python3 - <<'PY'
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('127.0.0.1', 0))
print(s.getsockname()[1])
s.close()
PY
}

cleanup_stale_netviz_listener() {
  local port="$1"
  if ! command -v lsof >/dev/null 2>&1; then
    return
  fi
  local removed=0
  while IFS= read -r pid; do
    [[ -z "${pid:-}" ]] && continue
    local cmdline
    cmdline="$(ps -p "$pid" -o args= 2>/dev/null || true)"
    if [[ "$cmdline" == *"demos/netviz"* || "$cmdline" == *"vite"* ]]; then
      kill "$pid" >/dev/null 2>&1 || true
      removed=$((removed + 1))
      echo "[chaos-lab] removed stale NetViz listener on :$port (pid=$pid)"
    fi
  done < <(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if (( removed > 0 )); then
    sleep 0.4
  fi
}

wait_for_netviz_chaos_api() {
  local url="$1"
  local retries="${2:-40}"
  for _ in $(seq 1 "$retries"); do
    local code
    code="$(curl -k -sS -o /dev/null -w '%{http_code}' "$url" || true)"
    if [[ "$code" == "200" ]]; then
      return 0
    fi
    sleep 0.25
  done
  return 1
}

ensure_sudo_ready() {
  if sudo -n true >/dev/null 2>&1; then
    return 0
  fi
  if [[ ! -t 0 ]]; then
    echo "[chaos-lab] sudo requires an interactive terminal for matrix:full." >&2
    echo "[chaos-lab] run this command directly in your shell and enter your sudo password when prompted." >&2
    return 1
  fi
  echo "[chaos-lab] requesting sudo for containernet matrix execution..."
  sudo -v
}

ensure_sudo_ready

dashboard_host="${CHAOS_DASHBOARD_HOST:-127.0.0.1}"
if [[ -n "${CHAOS_DASHBOARD_PORT:-}" ]]; then
  dashboard_port="${CHAOS_DASHBOARD_PORT}"
else
  dashboard_port="$(pick_free_port)"
fi
netviz_host="${CHAOS_NETVIZ_HOST:-0.0.0.0}"
netviz_port="${CHAOS_NETVIZ_PORT:-5182}"

chaos_api_base="${CHAOS_NETVIZ_API_BASE:-/chaos-api}"
chaos_proxy_target="${CHAOS_NETVIZ_PROXY_TARGET:-http://${dashboard_host}:${dashboard_port}}"
chaos_api_encoded="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1] || ""))' "$chaos_api_base")"
watch_query="room=telemetry&topologyId=netviz-topology&topologyType=distributed&render=low&dropRelay=true&relayRetentionMode=sqrt&relayRetentionMin=2&autoConnect=0&chaosApi=${chaos_api_encoded}"
watch_url_override="${CHAOS_NETVIZ_WATCH_URL:-}"

netviz_log="$repo_root/net-chaos-lab/artifacts/netviz-watch.log"
mkdir -p "$(dirname "$netviz_log")"
: >"$netviz_log"

cleanup_stale_netviz_listener "$netviz_port"

netviz_command="${CHAOS_NETVIZ_COMMAND:-npm --prefix \"$repo_root/demos/netviz\" run dev -- --host ${netviz_host} --port ${netviz_port} --strictPort}"

echo "[chaos-lab] launching NetViz watcher..."
echo "[chaos-lab] netviz command: $netviz_command"
echo "[chaos-lab] netviz log: $netviz_log"
echo "[chaos-lab] dashboard port: $dashboard_port"

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

actual_netviz_port="$netviz_port"
for _ in {1..30}; do
  local_url="$(rg -o 'https://localhost:[0-9]+' "$netviz_log" | tail -n 1 || true)"
  if [[ -n "$local_url" ]]; then
    actual_netviz_port="${local_url##*:}"
    break
  fi
  sleep 0.2
done

if [[ -n "$watch_url_override" ]]; then
  watch_url="$watch_url_override"
else
  watch_url="https://localhost:${actual_netviz_port}/?${watch_query}"
fi

if [[ "$actual_netviz_port" != "$netviz_port" ]]; then
  echo "[chaos-lab] note: requested NetViz port ${netviz_port} was busy; using ${actual_netviz_port}."
fi

echo "[chaos-lab] open NetViz watcher URL:"
echo "  $watch_url"
echo "[chaos-lab] netviz chaos proxy target: $chaos_proxy_target"

chaos_probe_url="https://localhost:${actual_netviz_port}${chaos_api_base}/api/summary"
if ! wait_for_netviz_chaos_api "$chaos_probe_url"; then
  echo "[chaos-lab] NetViz chaos-api preflight failed at $chaos_probe_url (expected HTTP 200)." >&2
  echo "[chaos-lab] recent NetViz log lines:" >&2
  tail -n 60 "$netviz_log" >&2 || true
  exit 1
fi

cmd=(
  bash "$repo_root/net-chaos-lab/scripts/chaos-lab.sh"
  --matrix "$matrix_config"
  --matrix-stop-on-fail
  --probe-fail-fast
  --dashboard-host "$dashboard_host"
  --dashboard-port "$dashboard_port"
)
if [[ "$#" -gt 0 ]]; then
  cmd+=("$@")
fi

sudo -E env "PATH=$PATH" PYTHON_BIN="$python_bin" "${cmd[@]}"
