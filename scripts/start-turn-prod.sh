#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/start-turn-prod.sh" >&2
  exit 1
fi
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
prod_config="$repo_root/config/relay.json"
relay_env_file="${RELAY_ENV_FILE:-$repo_root/config/relay.env}"
if [[ -f "$relay_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$relay_env_file"
fi

dry_run=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=1
      shift
      ;;
    *)
      echo "[turn] unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

resolve_node_bin() {
  if command -v node >/dev/null 2>&1; then
    command -v node
    return 0
  fi
  local nvm_dir="${NVM_DIR:-${HOME:-}/.nvm}"
  local versions_dir="$nvm_dir/versions/node"
  if [[ -d "$versions_dir" ]]; then
    local latest_version=""
    latest_version="$(ls -1 "$versions_dir" 2>/dev/null | sort -V | tail -n1 || true)"
    if [[ -n "$latest_version" ]]; then
      local candidate="$versions_dir/$latest_version/bin/node"
      if [[ -x "$candidate" ]]; then
        echo "$candidate"
        return 0
      fi
    fi
  fi
  return 1
}

parse_config_defaults() {
  local node_bin="$1"
  IFS=$'\t' read -r cfg_turn_host cfg_turn_port cfg_turn_user cfg_turn_credential cfg_relay_host cfg_public_host < <(
    "$node_bin" -e "
      const fs = require('fs');
      const cfg = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
      const iceServers = Array.isArray(cfg?.webrtc?.iceServers) ? cfg.webrtc.iceServers : [];
      let turnHost = '';
      let turnPort = '';
      let turnUser = '';
      let turnCredential = '';
      for (const server of iceServers) {
        const urls = Array.isArray(server?.urls) ? server.urls : [server?.urls];
        const turnUrl = urls.find((value) => typeof value === 'string' && value.startsWith('turn:'));
        if (!turnUrl) continue;
        try {
          const parsed = new URL(turnUrl.replace(/^turn:/, 'turn://'));
          turnHost = parsed.hostname || '';
          turnPort = parsed.port || '';
        } catch (_) {}
        if (server?.username) turnUser = String(server.username);
        if (server?.credential) turnCredential = String(server.credential);
        break;
      }
      const values = [
        turnHost,
        turnPort,
        turnUser,
        turnCredential,
        cfg?.relayHost || '',
        cfg?.publicHost || ''
      ];
      process.stdout.write(values.join('\t') + '\n');
    " "$prod_config"
  )
}

is_ip_literal() {
  local value="${1:-}"
  [[ "$value" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ || "$value" == *:* ]]
}

turn_enabled=1
case "${PCSERVER_ENABLE_TURN:-1}" in
  0|[Ff][Aa][Ll][Ss][Ee]|[Nn][Oo])
    turn_enabled=0
    ;;
esac

if [[ "$turn_enabled" != "1" ]]; then
  echo "[turn] disabled via PCSERVER_ENABLE_TURN"
  exit 0
fi

cfg_turn_host=""
cfg_turn_port=""
cfg_turn_user=""
cfg_turn_credential=""
cfg_relay_host=""
cfg_public_host=""
if [[ -f "$prod_config" ]]; then
  node_bin="${NODE_BIN:-}"
  if [[ -z "$node_bin" ]]; then
    if ! node_bin="$(resolve_node_bin)"; then
      echo "[turn] Node.js is required to parse $prod_config but was not found in PATH or NVM." >&2
      exit 127
    fi
  fi
  parse_config_defaults "$node_bin"
fi

turn_host="${RELAY_TURN_HOST:-$cfg_turn_host}"
if [[ -z "$turn_host" ]]; then
  turn_host="${cfg_public_host:-$cfg_relay_host}"
fi
turn_port="${RELAY_TURN_PORT:-$cfg_turn_port}"
turn_port="${turn_port:-3478}"
turn_username="${RELAY_TURN_USERNAME:-$cfg_turn_user}"
turn_username="${turn_username:-peer}"
turn_credential="${RELAY_TURN_CREDENTIAL:-$cfg_turn_credential}"
turn_credential="${turn_credential:-compute}"
turn_realm="${PCSERVER_TURN_REALM:-$turn_host}"
turn_realm="${turn_realm:-peercompute.test}"
turn_listen_ip="${PCSERVER_TURN_LISTEN_IP:-0.0.0.0}"
turn_listen_ip6="${PCSERVER_TURN_LISTEN_IP6:-}"
turn_min_port="${PCSERVER_TURN_MIN_PORT:-49152}"
turn_max_port="${PCSERVER_TURN_MAX_PORT:-65535}"
turn_total_quota="${PCSERVER_TURN_TOTAL_QUOTA:-200}"
turn_bps_capacity="${PCSERVER_TURN_BPS_CAPACITY:-0}"
turn_external_ip="${PCSERVER_TURN_EXTERNAL_IP:-}"
turn_relay_ip="${PCSERVER_TURN_RELAY_IP:-}"
if [[ -z "$turn_external_ip" && -n "$cfg_public_host" ]] && is_ip_literal "$cfg_public_host"; then
  turn_external_ip="$cfg_public_host"
fi

runtime_dir="${PCSERVER_RUNTIME_DIR:-${XDG_RUNTIME_DIR:-/tmp}}"
mkdir -p "$runtime_dir"
turn_config_file="${PCSERVER_TURN_CONFIG_FILE:-$runtime_dir/peercompute-turnserver.conf}"

turn_bin="${COTURN_BIN:-$(command -v turnserver || true)}"
if [[ -z "$turn_bin" ]]; then
  if [[ "$dry_run" == "1" ]]; then
    turn_bin="turnserver"
  else
    echo "[turn] turnserver binary not found. Install coturn (e.g. sudo apt install coturn)." >&2
    exit 127
  fi
fi

config_lines=(
  "listening-port=${turn_port}"
  "fingerprint"
  "lt-cred-mech"
  "user=${turn_username}:${turn_credential}"
  "realm=${turn_realm}"
  "stale-nonce"
  "no-loopback-peers"
  "no-multicast-peers"
  "min-port=${turn_min_port}"
  "max-port=${turn_max_port}"
  "total-quota=${turn_total_quota}"
  "bps-capacity=${turn_bps_capacity}"
  "no-cli"
  "simple-log"
  "log-file=stdout"
)

if [[ -n "$turn_listen_ip" ]]; then
  config_lines+=("listening-ip=${turn_listen_ip}")
fi
if [[ -n "$turn_listen_ip6" ]]; then
  config_lines+=("listening-ip=${turn_listen_ip6}")
fi
if [[ -n "$turn_relay_ip" ]]; then
  config_lines+=("relay-ip=${turn_relay_ip}")
fi
if [[ -n "$turn_external_ip" ]]; then
  config_lines+=("external-ip=${turn_external_ip}")
fi
if [[ -n "${PCSERVER_TURN_EXTRA_LINES:-}" ]]; then
  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    config_lines+=("$line")
  done <<< "${PCSERVER_TURN_EXTRA_LINES}"
fi

printf '%s\n' "${config_lines[@]}" > "$turn_config_file"

echo "[turn] config file: $turn_config_file"
echo "[turn] host=${turn_host}"
echo "[turn] port=${turn_port}"
echo "[turn] realm=${turn_realm}"

if [[ "$dry_run" == "1" ]]; then
  echo "[turn] dry-run command: $turn_bin -c $turn_config_file"
  exit 0
fi

exec "$turn_bin" -c "$turn_config_file"
