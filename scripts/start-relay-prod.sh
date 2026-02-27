#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/start-relay-prod.sh" >&2
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

cd "$repo_root"

relay_host=""
relay_port=""
listen_host=""
listen_port=""
relay_protocol=""
ssl_cert=""
ssl_key=""
identity_file=""
relay_config_file=""
webrtc_config=""
pubsub_type=""
gossipsub_config=""

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

to_abs_path() {
  local value="${1:-}"
  if [[ -z "$value" ]]; then
    echo ""
    return 0
  fi
  if [[ "$value" == /* ]]; then
    echo "$value"
    return 0
  fi
  echo "$repo_root/$value"
}

if [[ -f "$prod_config" ]]; then
  node_bin="${NODE_BIN:-}"
  if [[ -z "$node_bin" ]]; then
    if ! node_bin="$(resolve_node_bin)"; then
      echo "[relay] Node.js is required to parse $prod_config but was not found in PATH or NVM." >&2
      exit 127
    fi
  fi
  relay_host="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayHost)process.stdout.write(String(cfg.relayHost));")"
  relay_port="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayPort)process.stdout.write(String(cfg.relayPort));")"
  listen_host="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.listenHost)process.stdout.write(String(cfg.listenHost));")"
  listen_port="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.listenPort)process.stdout.write(String(cfg.listenPort));")"
  relay_protocol="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayProtocol)process.stdout.write(String(cfg.relayProtocol));")"
  ssl_cert="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.sslCert)process.stdout.write(String(cfg.sslCert));")"
  ssl_key="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.sslKey)process.stdout.write(String(cfg.sslKey));")"
  identity_file="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayIdentityFile)process.stdout.write(String(cfg.relayIdentityFile));")"
  relay_config_file="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayConfigFile)process.stdout.write(String(cfg.relayConfigFile));")"
  webrtc_config="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.webrtc)process.stdout.write(JSON.stringify(cfg.webrtc));")"
  pubsub_type="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.pubsubType)process.stdout.write(String(cfg.pubsubType));")"
  gossipsub_config="$("$node_bin" -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.gossipsub)process.stdout.write(JSON.stringify(cfg.gossipsub));")"
fi

if [[ -x "$repo_root/scripts/ensure-relay-config-perms.sh" ]]; then
  RELAY_ACL_USER="${RELAY_ACL_USER:-${NGINX_USER:-}}"
  export RELAY_ACL_USER
  bash "$repo_root/scripts/ensure-relay-config-perms.sh"
fi

if [[ -n "$relay_host" && -z "${RELAY_PUBLIC_HOST:-}" ]]; then
  RELAY_PUBLIC_HOST="$relay_host"
fi
if [[ -n "$relay_port" && -z "${RELAY_PUBLIC_PORT:-}" ]]; then
  RELAY_PUBLIC_PORT="$relay_port"
fi
if [[ -n "$relay_protocol" && -z "${RELAY_PUBLIC_PROTOCOL:-}" ]]; then
  RELAY_PUBLIC_PROTOCOL="$relay_protocol"
fi
if [[ -n "$listen_host" && -z "${RELAY_LISTEN_HOST:-}" ]]; then
  RELAY_LISTEN_HOST="$listen_host"
fi
if [[ -n "$listen_port" && -z "${RELAY_LISTEN_PORT:-}" ]]; then
  RELAY_LISTEN_PORT="$listen_port"
fi
if [[ -n "$ssl_cert" && -z "${RELAY_SSL_CERT:-}" ]]; then
  RELAY_SSL_CERT="$ssl_cert"
fi
if [[ -n "$ssl_key" && -z "${RELAY_SSL_KEY:-}" ]]; then
  RELAY_SSL_KEY="$ssl_key"
fi
if [[ -n "$identity_file" && -z "${RELAY_IDENTITY_FILE:-}" ]]; then
  RELAY_IDENTITY_FILE="$identity_file"
fi
if [[ -n "$relay_config_file" && -z "${RELAY_CONFIG_FILE:-}" ]]; then
  RELAY_CONFIG_FILE="$relay_config_file"
fi
if [[ -n "$webrtc_config" && -z "${RELAY_WEBRTC_CONFIG:-}" ]]; then
  RELAY_WEBRTC_CONFIG="$webrtc_config"
fi
if [[ -n "$pubsub_type" && -z "${RELAY_PUBSUB_TYPE:-}" ]]; then
  RELAY_PUBSUB_TYPE="$pubsub_type"
fi
if [[ -n "$gossipsub_config" && -z "${RELAY_GOSSIPSUB_CONFIG:-}" ]]; then
  RELAY_GOSSIPSUB_CONFIG="$gossipsub_config"
fi

prefer_ipv6=0
case "${RELAY_PREFER_IPV6:-}" in
  1|[Tt][Rr][Uu][Ee]|[Yy][Ee][Ss])
    prefer_ipv6=1
    ;;
esac
if [[ "$prefer_ipv6" == "1" ]]; then
  listen_host_value="${RELAY_LISTEN_HOST:-}"
  if [[ -z "$listen_host_value" || "$listen_host_value" == "0.0.0.0" || "$listen_host_value" == "127.0.0.1" || "$listen_host_value" == "localhost" ]]; then
    RELAY_LISTEN_HOST="::"
  fi
fi

RELAY_LISTEN_HOST="${RELAY_LISTEN_HOST:-0.0.0.0}"
if [[ -z "${RELAY_LISTEN_PORT:-}" && -n "${RELAY_PUBLIC_PORT:-}" ]]; then
  RELAY_LISTEN_PORT="$RELAY_PUBLIC_PORT"
fi
if [[ -z "${RELAY_PUBLIC_PORT:-}" && -n "${RELAY_LISTEN_PORT:-}" ]]; then
  RELAY_PUBLIC_PORT="$RELAY_LISTEN_PORT"
fi

if [[ -n "${RELAY_PUBLIC_PROTOCOL:-}" ]] && [[ "${RELAY_PUBLIC_PROTOCOL,,}" == "wss" ]]; then
  if [[ -z "${RELAY_SSL_CERT:-}" || -z "${RELAY_SSL_KEY:-}" ]]; then
    echo "Warning: relayProtocol=wss but RELAY_SSL_CERT/RELAY_SSL_KEY not set. Relay will listen with ws; ensure TLS is terminated by nginx."
  fi
fi

# run-go-relay executes from peercompute/src/relay-go, so normalize file paths
# against repo_root to keep identity/config/cert paths stable under systemd.
if [[ -n "${RELAY_IDENTITY_FILE:-}" ]]; then
  RELAY_IDENTITY_FILE="$(to_abs_path "$RELAY_IDENTITY_FILE")"
fi
if [[ -n "${RELAY_CONFIG_FILE:-}" ]]; then
  RELAY_CONFIG_FILE="$(to_abs_path "$RELAY_CONFIG_FILE")"
fi
if [[ -n "${RELAY_SSL_CERT:-}" ]]; then
  RELAY_SSL_CERT="$(to_abs_path "$RELAY_SSL_CERT")"
fi
if [[ -n "${RELAY_SSL_KEY:-}" ]]; then
  RELAY_SSL_KEY="$(to_abs_path "$RELAY_SSL_KEY")"
fi

RELAY_IMPL="${RELAY_IMPL:-go}"

export RELAY_PUBLIC_HOST
export RELAY_PUBLIC_PORT
export RELAY_PUBLIC_PROTOCOL
export RELAY_LISTEN_HOST
export RELAY_LISTEN_PORT
export RELAY_SSL_CERT
export RELAY_SSL_KEY
export RELAY_IDENTITY_FILE
export RELAY_CONFIG_FILE
export RELAY_WEBRTC_CONFIG
export RELAY_PUBSUB_TYPE
export RELAY_GOSSIPSUB_CONFIG
export RELAY_PREFER_IPV6
export RELAY_IMPL

echo "Starting PeerCompute relay server (production)..."
echo "  RELAY_PUBLIC_HOST=${RELAY_PUBLIC_HOST:-}"
echo "  RELAY_PUBLIC_PORT=${RELAY_PUBLIC_PORT:-}"
echo "  RELAY_PUBLIC_PROTOCOL=${RELAY_PUBLIC_PROTOCOL:-}"
echo "  RELAY_LISTEN_HOST=${RELAY_LISTEN_HOST:-}"
echo "  RELAY_LISTEN_PORT=${RELAY_LISTEN_PORT:-}"

exec bash "$repo_root/scripts/run-relay.sh"
