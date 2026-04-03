#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/install-prod-systemd-services.sh" >&2
  exit 1
fi
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_env_file="${RELAY_ENV_FILE:-$repo_root/config/relay.env}"
if [[ -f "$relay_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$relay_env_file"
fi

mode="${BACKEND_INSTALL_MODE:-split}"
dry_run=0
auto_install_coturn="${AUTO_INSTALL_COTURN:-1}"
write_turn_config="${WRITE_COTURN_CONFIG:-1}"

relay_service_name="${RELAY_SERVICE_NAME:-peercompute-relay}"
relay_service_user="${RELAY_SERVICE_USER:-${SUDO_USER:-$USER}}"
relay_service_group="${RELAY_SERVICE_GROUP:-$relay_service_user}"
coturn_service_name="${COTURN_SERVICE_NAME:-peercompute-coturn}"
coturn_service_user="${COTURN_SERVICE_USER:-turnserver}"
coturn_service_group="${COTURN_SERVICE_GROUP:-$coturn_service_user}"
turn_config_file="${COTURN_CONFIG_FILE:-/etc/turnserver.conf}"

turn_host="${RELAY_TURN_HOST:-secretworkshop.net}"
turn_port="${RELAY_TURN_PORT:-3478}"
turn_username="${RELAY_TURN_USERNAME:-peer}"
turn_credential="${RELAY_TURN_CREDENTIAL:-compute}"
turn_realm="${PCSERVER_TURN_REALM:-$turn_host}"
turn_min_port="${PCSERVER_TURN_MIN_PORT:-49152}"
turn_max_port="${PCSERVER_TURN_MAX_PORT:-65535}"
turn_listen_ip="${PCSERVER_TURN_LISTEN_IP:-}"
turn_listen_ip6="${PCSERVER_TURN_LISTEN_IP6:-}"
turn_external_ip="${PCSERVER_TURN_EXTERNAL_IP:-}"
turn_relay_ip="${PCSERVER_TURN_RELAY_IP:-}"

usage() {
  cat <<EOF
Usage: sudo -E env "PATH=\$PATH" bash scripts/install-prod-systemd-services.sh [options]

Installs the production backend using the repo's systemd helpers.
Default mode is split services:
  - peercompute-relay.service (Go relay only)
  - peercompute-coturn.service (TURN/STUN only)

Options:
  --split                 Install relay + coturn as separate services (default)
  --combined              Install a single combined peercompute-relay service
  --dry-run               Print the commands without executing them
  --no-install-coturn     Fail instead of apt-installing coturn when missing
  --no-write-turn-config  Fail instead of creating /etc/turnserver.conf when missing
  -h, --help              Show this help

Environment overrides:
  RELAY_SERVICE_NAME, RELAY_SERVICE_USER, RELAY_SERVICE_GROUP
  COTURN_SERVICE_NAME, COTURN_SERVICE_USER, COTURN_SERVICE_GROUP, COTURN_CONFIG_FILE
  RELAY_TURN_HOST, RELAY_TURN_PORT, RELAY_TURN_USERNAME, RELAY_TURN_CREDENTIAL
  PCSERVER_TURN_REALM, PCSERVER_TURN_MIN_PORT, PCSERVER_TURN_MAX_PORT
  PCSERVER_TURN_LISTEN_IP, PCSERVER_TURN_LISTEN_IP6, PCSERVER_TURN_EXTERNAL_IP, PCSERVER_TURN_RELAY_IP
EOF
}

is_truthy() {
  case "${1:-}" in
    1|[Tt][Rr][Uu][Ee]|[Yy][Ee][Ss]|[Oo][Nn]) return 0 ;;
    *) return 1 ;;
  esac
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --split)
      mode="split"
      ;;
    --combined)
      mode="combined"
      ;;
    --dry-run)
      dry_run=1
      ;;
    --no-install-coturn)
      auto_install_coturn=0
      ;;
    --no-write-turn-config)
      write_turn_config=0
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

case "$mode" in
  split|combined) ;;
  *)
    echo "Unsupported mode: $mode" >&2
    exit 2
    ;;
esac

if is_truthy "$auto_install_coturn"; then
  auto_install_coturn=1
else
  auto_install_coturn=0
fi
if is_truthy "$write_turn_config"; then
  write_turn_config=1
else
  write_turn_config=0
fi

if [[ "$dry_run" != "1" ]]; then
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Re-run with sudo and preserve PATH so systemd can see your Go toolchain:" >&2
    echo "  sudo -E env PATH=\"$PATH\" bash $0 ${mode:+--$mode}" >&2
    exit 1
  fi

  if ! command -v go >/dev/null 2>&1; then
    echo "Go not found in PATH. Re-run with sudo -E env PATH=\"\$PATH\" so the installer can capture the correct toolchain path." >&2
    exit 1
  fi
fi

run_cmd() {
  printf '+'
  printf ' %q' "$@"
  printf '\n'
  if [[ "$dry_run" != "1" ]]; then
    "$@"
  fi
}

run_cmd_allow_fail() {
  printf '+'
  printf ' %q' "$@"
  printf '\n'
  if [[ "$dry_run" != "1" ]]; then
    "$@" || true
  fi
}

write_turn_config_if_missing() {
  if [[ -f "$turn_config_file" ]]; then
    echo "[install-prod] preserving existing coturn config: $turn_config_file"
    return 0
  fi
  if [[ "$write_turn_config" != "1" ]]; then
    echo "Coturn config is missing and WRITE_COTURN_CONFIG is disabled: $turn_config_file" >&2
    exit 1
  fi
  local config_dir
  config_dir="$(dirname "$turn_config_file")"
  run_cmd mkdir -p "$config_dir"
  if [[ "$dry_run" == "1" ]]; then
    cat <<EOF
+ write $turn_config_file
listening-port=$turn_port
fingerprint
lt-cred-mech
user=$turn_username:$turn_credential
realm=$turn_realm
stale-nonce
no-loopback-peers
no-multicast-peers
min-port=$turn_min_port
max-port=$turn_max_port
EOF
    if [[ -n "$turn_listen_ip" ]]; then
      echo "listening-ip=$turn_listen_ip"
    fi
    if [[ -n "$turn_listen_ip6" ]]; then
      echo "listening-ip=$turn_listen_ip6"
    fi
    if [[ -n "$turn_external_ip" ]]; then
      echo "external-ip=$turn_external_ip"
    fi
    if [[ -n "$turn_relay_ip" ]]; then
      echo "relay-ip=$turn_relay_ip"
    fi
    return 0
  fi
  cat > "$turn_config_file" <<EOF
listening-port=$turn_port
fingerprint
lt-cred-mech
user=$turn_username:$turn_credential
realm=$turn_realm
stale-nonce
no-loopback-peers
no-multicast-peers
min-port=$turn_min_port
max-port=$turn_max_port
EOF
  if [[ -n "$turn_listen_ip" ]]; then
    echo "listening-ip=$turn_listen_ip" >> "$turn_config_file"
  fi
  if [[ -n "$turn_listen_ip6" ]]; then
    echo "listening-ip=$turn_listen_ip6" >> "$turn_config_file"
  fi
  if [[ -n "$turn_external_ip" ]]; then
    echo "external-ip=$turn_external_ip" >> "$turn_config_file"
  fi
  if [[ -n "$turn_relay_ip" ]]; then
    echo "relay-ip=$turn_relay_ip" >> "$turn_config_file"
  fi
  chmod 640 "$turn_config_file"
}

ensure_coturn_available() {
  if command -v turnserver >/dev/null 2>&1; then
    return 0
  fi
  if [[ "$auto_install_coturn" != "1" ]]; then
    echo "coturn is not installed and AUTO_INSTALL_COTURN is disabled." >&2
    exit 1
  fi
  run_cmd apt-get update
  run_cmd env DEBIAN_FRONTEND=noninteractive apt-get install -y coturn
}

echo "[install-prod] mode=$mode"
echo "[install-prod] relay service=$relay_service_name user=$relay_service_user group=$relay_service_group"
if [[ "$mode" == "split" ]]; then
  echo "[install-prod] coturn service=$coturn_service_name user=$coturn_service_user group=$coturn_service_group config=$turn_config_file"
fi

run_cmd_allow_fail pkill -f "$repo_root/peercompute/src/relay/server.js"
run_cmd_allow_fail systemctl stop "$relay_service_name"
run_cmd_allow_fail systemctl disable "$relay_service_name"
run_cmd_allow_fail systemctl stop "$coturn_service_name"
run_cmd_allow_fail systemctl disable "$coturn_service_name"

if [[ "$mode" == "split" ]]; then
  ensure_coturn_available
  write_turn_config_if_missing
fi

if [[ "$mode" == "combined" ]]; then
  ensure_coturn_available
  run_cmd env "PATH=$PATH" \
    "RELAY_IMPL=go" \
    "RELAY_SERVICE_NAME=$relay_service_name" \
    "RELAY_SERVICE_USER=$relay_service_user" \
    "RELAY_SERVICE_GROUP=$relay_service_group" \
    "PCSERVER_ENABLE_RELAY=1" \
    "PCSERVER_ENABLE_TURN=1" \
    bash "$repo_root/scripts/install-relay-systemd.sh"
else
  run_cmd env "PATH=$PATH" \
    "RELAY_IMPL=go" \
    "RELAY_SERVICE_NAME=$relay_service_name" \
    "RELAY_SERVICE_USER=$relay_service_user" \
    "RELAY_SERVICE_GROUP=$relay_service_group" \
    "PCSERVER_ENABLE_RELAY=1" \
    "PCSERVER_ENABLE_TURN=0" \
    bash "$repo_root/scripts/install-relay-systemd.sh"

  run_cmd env \
    "COTURN_SERVICE_NAME=$coturn_service_name" \
    "COTURN_SERVICE_USER=$coturn_service_user" \
    "COTURN_SERVICE_GROUP=$coturn_service_group" \
    "COTURN_CONFIG_FILE=$turn_config_file" \
    bash "$repo_root/scripts/install-coturn-systemd.sh"
fi

run_cmd systemctl status "$relay_service_name" --no-pager
if [[ "$mode" == "split" ]]; then
  run_cmd systemctl status "$coturn_service_name" --no-pager
fi

echo "[install-prod] done"
if [[ "$dry_run" == "1" ]]; then
  echo "[install-prod] dry-run only; no changes were applied."
fi
