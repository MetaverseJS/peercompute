#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$repo_root/scripts/ensure-https.mjs"

relay_env_file="${RELAY_ENV_FILE:-$repo_root/config/relay.env}"
if [[ -f "$relay_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$relay_env_file"
fi

relay_config_path="$repo_root/config/relay.json"
if [[ -f "$relay_config_path" ]]; then
  relay_public_host="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.publicHost)process.stdout.write(String(cfg.publicHost));")"
  relay_public_port="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.publicPort)process.stdout.write(String(cfg.publicPort));")"
  relay_listen_host="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.listenHost)process.stdout.write(String(cfg.listenHost));")"
  relay_listen_port="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.listenPort)process.stdout.write(String(cfg.listenPort));")"
  relay_public_protocol="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));const value=cfg.relayProtocol||cfg.publicProtocol;if(value)process.stdout.write(String(value));")"
  relay_identity_file="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.relayIdentityFile)process.stdout.write(String(cfg.relayIdentityFile));")"
  relay_config_file="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.relayConfigFile)process.stdout.write(String(cfg.relayConfigFile));")"
  relay_webrtc_config="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.webrtc)process.stdout.write(JSON.stringify(cfg.webrtc));")"
  relay_pubsub_type="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.pubsubType)process.stdout.write(String(cfg.pubsubType));")"
  relay_gossipsub_config="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$relay_config_path','utf8'));if(cfg.gossipsub)process.stdout.write(JSON.stringify(cfg.gossipsub));")"
  if [[ -n "$relay_public_host" && -z "${RELAY_PUBLIC_HOST:-}" ]]; then
    RELAY_PUBLIC_HOST="$relay_public_host"
  fi
  if [[ -n "$relay_public_port" && -z "${RELAY_PUBLIC_PORT:-}" ]]; then
    RELAY_PUBLIC_PORT="$relay_public_port"
  fi
  if [[ -n "$relay_listen_host" && -z "${RELAY_LISTEN_HOST:-}" ]]; then
    RELAY_LISTEN_HOST="$relay_listen_host"
  fi
  if [[ -n "$relay_listen_port" && -z "${RELAY_LISTEN_PORT:-}" ]]; then
    RELAY_LISTEN_PORT="$relay_listen_port"
  fi
  if [[ -n "$relay_public_protocol" && -z "${RELAY_PUBLIC_PROTOCOL:-}" ]]; then
    RELAY_PUBLIC_PROTOCOL="$relay_public_protocol"
  fi
  if [[ -n "$relay_identity_file" && -z "${RELAY_IDENTITY_FILE:-}" ]]; then
    RELAY_IDENTITY_FILE="$relay_identity_file"
  fi
  if [[ -n "$relay_config_file" && -z "${RELAY_CONFIG_FILE:-}" ]]; then
    RELAY_CONFIG_FILE="$relay_config_file"
  fi
  if [[ -n "$relay_webrtc_config" && -z "${RELAY_WEBRTC_CONFIG:-}" ]]; then
    RELAY_WEBRTC_CONFIG="$relay_webrtc_config"
  fi
  if [[ -n "$relay_pubsub_type" && -z "${RELAY_PUBSUB_TYPE:-}" ]]; then
    RELAY_PUBSUB_TYPE="$relay_pubsub_type"
  fi
  if [[ -n "$relay_gossipsub_config" && -z "${RELAY_GOSSIPSUB_CONFIG:-}" ]]; then
    RELAY_GOSSIPSUB_CONFIG="$relay_gossipsub_config"
  fi
fi

is_loopback_host() {
  local host="${1:-}"
  case "$host" in
    ""|"localhost"|"127.0.0.1"|"0.0.0.0"|"::1")
      return 0
      ;;
  esac
  return 1
}

is_ipv6_host() {
  local host="${1:-}"
  [[ "$host" == *:* ]]
}

to_url_host() {
  local host="$1"
  if [[ "$host" == *:* ]]; then
    printf '[%s]' "$host"
  else
    printf '%s' "$host"
  fi
}

if [[ -z "${RELAY_GOSSIPSUB_CONFIG:-}" ]]; then
  RELAY_GOSSIPSUB_CONFIG='{"D":8,"Dhi":16,"Dout":1,"scoreParams":{"IPColocationFactorWeight":0,"behaviourPenaltyWeight":0,"topics":{"__default":{"meshMessageDeliveriesWeight":0,"meshMessageDeliveriesThreshold":0,"meshFailurePenaltyWeight":0}}}}'
fi

prefer_ipv6=0
case "${RELAY_PREFER_IPV6:-}" in
  1|[Tt][Rr][Uu][Ee]|[Yy][Ee][Ss])
    prefer_ipv6=1
    ;;
esac

RELAY_LISTEN_HOST="${RELAY_LISTEN_HOST:-0.0.0.0}"
resolved_public_host=""
if is_loopback_host "${RELAY_PUBLIC_HOST:-}"; then
  if [[ "$RELAY_LISTEN_HOST" == "127.0.0.1" || "$RELAY_LISTEN_HOST" == "localhost" || "$RELAY_LISTEN_HOST" == "::1" ]]; then
    RELAY_PUBLIC_HOST="$RELAY_LISTEN_HOST"
  else
    resolved_public_host="$(node "$repo_root/scripts/get-local-ip.mjs" || true)"
    if [[ -n "$resolved_public_host" ]]; then
      RELAY_PUBLIC_HOST="$resolved_public_host"
    fi
  fi
fi

if [[ "$prefer_ipv6" == "1" ]]; then
  listen_host_value="${RELAY_LISTEN_HOST:-}"
  if [[ -z "$listen_host_value" || "$listen_host_value" == "0.0.0.0" || "$listen_host_value" == "127.0.0.1" || "$listen_host_value" == "localhost" ]]; then
    if is_ipv6_host "${RELAY_PUBLIC_HOST:-}"; then
      RELAY_LISTEN_HOST="::"
    fi
  fi
fi

if [[ -z "${RELAY_SSL_CERT:-}" ]]; then
  RELAY_SSL_CERT="$repo_root/certs/dev-cert.pem"
fi
if [[ -z "${RELAY_SSL_KEY:-}" ]]; then
  RELAY_SSL_KEY="$repo_root/certs/dev-key.pem"
fi
if [[ -z "${RELAY_PUBLIC_PROTOCOL:-}" ]]; then
  if [[ -n "${RELAY_SSL_CERT:-}" && -n "${RELAY_SSL_KEY:-}" ]]; then
    RELAY_PUBLIC_PROTOCOL="wss"
  else
    RELAY_PUBLIC_PROTOCOL="ws"
  fi
fi

if [[ -z "${RELAY_CONFIG_DIRS:-}" ]]; then
  relay_config_dirs=(
    "$repo_root/demos/hyperborea/public"
    "$repo_root/demos/cubechat/public"
    "$repo_root/demos/sneakywoods/public"
    "$repo_root/demos/daddygo/public"
    "$repo_root/demos/netviz/public"
    "$repo_root/demos/planetgen/public"
    "$repo_root/demos/universes/public"
    "$repo_root/demos/webgpuphys/public"
    "$repo_root/docs/hyperborea"
    "$repo_root/docs/cubechat"
    "$repo_root/docs/sneakywoods"
    "$repo_root/docs/daddygo"
    "$repo_root/docs/netviz"
    "$repo_root/docs/planetgen"
    "$repo_root/docs/universes"
    "$repo_root/docs/webgpuphys"
  )
  RELAY_CONFIG_DIRS="$(IFS=,; echo "${relay_config_dirs[*]}")"
else
  IFS=',' read -r -a relay_config_dirs <<< "$RELAY_CONFIG_DIRS"
  RELAY_CONFIG_DIRS="$(IFS=,; echo "${relay_config_dirs[*]}")"
fi

export RELAY_IMPL
export RELAY_PUBLIC_HOST
export RELAY_PUBLIC_PORT
export RELAY_PUBLIC_PROTOCOL
export RELAY_LISTEN_HOST
export RELAY_LISTEN_PORT
export RELAY_IDENTITY_FILE
export RELAY_CONFIG_FILE
export RELAY_WEBRTC_CONFIG
export RELAY_PUBSUB_TYPE
export RELAY_GOSSIPSUB_CONFIG
export RELAY_PREFER_IPV6
export RELAY_SSL_CERT
export RELAY_SSL_KEY
export RELAY_CONFIG_DIRS
export DEV_OPEN_OVERVIEW
export PEERCOMPUTE_NO_OPEN

for dir in "${relay_config_dirs[@]}"; do
  rm -f "$dir/relay-config-source.json" "$dir/.relay-config-source.json"
done

overview_host="localhost"
if ! is_loopback_host "${RELAY_PUBLIC_HOST:-}"; then
  overview_host="$RELAY_PUBLIC_HOST"
fi
overview_url="https://$(to_url_host "$overview_host"):4173/?dev=1"

vite_host_args="--host"
if is_ipv6_host "${overview_host:-}"; then
  vite_host_args="--host ::"
fi

demo_url_host="$(to_url_host "$overview_host")"
demo_base="https://${demo_url_host}"
export VITE_HYPERBOREA_URL="${demo_base}:5175/"
export VITE_CUBECHAT_URL="${demo_base}:5176/"
export VITE_PLANETGEN_URL="${demo_base}:5177/"
export VITE_UNIVERSES_URL="${demo_base}:5178/"
export VITE_WEBGPUPHYS_TOYCHEST_URL="${demo_base}:5179/demos/toychest.html"
export VITE_WEBGPUPHYS_MPM_URL="${demo_base}:5179/demos/mpm-visual.html"
export VITE_WEBGPUPHYS_PPF_URL="${demo_base}:5179/demos/ppf-contact-solver.html"
export VITE_SNEAKYWOODS_URL="${demo_base}:5180/"
export VITE_DADDYGO_URL="${demo_base}:5181/"
export VITE_NETVIZ_URL="${demo_base}:5182/"
open_overview() {
  local url="$1"
  if [[ -n "${BROWSER:-}" ]]; then
    "$BROWSER" "$url" >/dev/null 2>&1 || true
    return
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  fi
}
if [[ "${DEV_OPEN_OVERVIEW:-1}" != "0" ]]; then
  (sleep 2; open_overview "$overview_url") &
fi

echo "Relay env:"
echo "  RELAY_IMPL=${RELAY_IMPL:-}"
echo "  RELAY_PUBLIC_HOST=${RELAY_PUBLIC_HOST:-}"
echo "  RELAY_PUBLIC_PORT=${RELAY_PUBLIC_PORT:-}"
echo "  RELAY_PUBLIC_PROTOCOL=${RELAY_PUBLIC_PROTOCOL:-}"
echo "  RELAY_LISTEN_HOST=${RELAY_LISTEN_HOST:-}"
echo "  RELAY_LISTEN_PORT=${RELAY_LISTEN_PORT:-}"
echo "  RELAY_PUBSUB_TYPE=${RELAY_PUBSUB_TYPE:-}"
echo "  RELAY_CONFIG_FILE=${RELAY_CONFIG_FILE:-}"
echo "  RELAY_IDENTITY_FILE=${RELAY_IDENTITY_FILE:-}"

echo "Dev servers (HTTPS):"
echo "  relay: dynamic WSS (check relay logs for address)"
echo "  overview: $overview_url"
echo "  hyperborea: https://$(to_url_host "$overview_host"):5175/"
echo "  cubechat:   https://$(to_url_host "$overview_host"):5176/"
echo "  planetgen:  https://$(to_url_host "$overview_host"):5177/"
echo "  universes:  https://$(to_url_host "$overview_host"):5178/"
echo "  webgpuphys: https://$(to_url_host "$overview_host"):5179/"
echo "  sneakywoods: https://$(to_url_host "$overview_host"):5180/"
echo "  daddygo:    https://$(to_url_host "$overview_host"):5181/"
echo "  netviz:     https://$(to_url_host "$overview_host"):5182/"

"$repo_root/node_modules/.bin/concurrently" -k --prefix "[{name}]" --prefix-colors auto -n relay,hyperborea,cubechat,planetgen,universes,webgpuphys,sneakywoods,daddygo,netviz,docs \
  "npm run dev:relay" \
  "npm --prefix \"$repo_root/demos/hyperborea\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/cubechat\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/planetgen\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/universes\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/webgpuphys\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/sneakywoods\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/daddygo\" run dev -- $vite_host_args" \
  "npm --prefix \"$repo_root/demos/netviz\" run dev -- $vite_host_args" \
  "npm run docs:dev -- $vite_host_args"
