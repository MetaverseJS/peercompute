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

dev_expose_lan=0
case "${RELAY_DEV_EXPOSE_LAN:-0}" in
  1|[Tt][Rr][Uu][Ee]|[Yy][Ee][Ss])
    dev_expose_lan=1
    ;;
esac

if [[ "$dev_expose_lan" != "1" ]]; then
  # Default local dev to loopback to avoid TLS SAN/certificate mismatches on LAN/IPv6 hosts.
  if [[ -n "${RELAY_PUBLIC_HOST:-}" ]] && ! is_loopback_host "${RELAY_PUBLIC_HOST:-}"; then
    echo "[dev] overriding RELAY_PUBLIC_HOST=${RELAY_PUBLIC_HOST} -> localhost (set RELAY_DEV_EXPOSE_LAN=1 to keep LAN host)"
  fi
  RELAY_PUBLIC_HOST="localhost"
  if [[ -z "${RELAY_LISTEN_HOST:-}" || "${RELAY_LISTEN_HOST}" == "0.0.0.0" || "${RELAY_LISTEN_HOST}" == "::" ]]; then
    RELAY_LISTEN_HOST="127.0.0.1"
  fi
  RELAY_PREFER_IPV6=0
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
  if [[ "$dev_expose_lan" == "1" ]]; then
    resolved_public_host="$(node "$repo_root/scripts/get-local-ip.mjs" || true)"
    if [[ -n "$resolved_public_host" ]]; then
      RELAY_PUBLIC_HOST="$resolved_public_host"
    fi
  else
    RELAY_PUBLIC_HOST="localhost"
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
if [[ -z "${RELAY_CONFIG_DIRS:-}" ]]; then
  relay_config_dirs=(
    "$repo_root/demos/hyperborea/public"
    "$repo_root/demos/cubechat/public"
    "$repo_root/demos/planetgen/public"
    "$repo_root/demos/multiscale/public"
    "$repo_root/demos/universes/public"
    "$repo_root/demos/webgpuphys/public"
    "$repo_root/demos/sneakywoods/public"
    "$repo_root/demos/daddygo/public"
    "$repo_root/demos/fano-reactor/public"
    "$repo_root/demos/schrodinger/public"
    "$repo_root/demos/netviz/public"
    "$repo_root/docs/hyperborea"
    "$repo_root/docs/cubechat"
    "$repo_root/docs/planetgen"
    "$repo_root/docs/multiscale"
    "$repo_root/docs/universes"
    "$repo_root/docs/webgpuphys"
    "$repo_root/docs/sneakywoods"
    "$repo_root/docs/daddygo"
    "$repo_root/docs/fano-reactor"
    "$repo_root/docs/schrodinger"
    "$repo_root/docs/netviz"
  )
  RELAY_CONFIG_DIRS="$(IFS=,; echo "${relay_config_dirs[*]}")"
else
  IFS=',' read -r -a relay_config_dirs <<< "$RELAY_CONFIG_DIRS"
  RELAY_CONFIG_DIRS="$(IFS=,; echo "${relay_config_dirs[*]}")"
fi
if [[ -z "${RELAY_GOSSIPSUB_CONFIG:-}" ]]; then
  RELAY_GOSSIPSUB_CONFIG='{"D":8,"Dhi":16,"Dout":1,"scoreParams":{"IPColocationFactorWeight":0,"behaviourPenaltyWeight":0,"topics":{"__default":{"meshMessageDeliveriesWeight":0,"meshMessageDeliveriesThreshold":0,"meshFailurePenaltyWeight":0}}}}'
fi

export RELAY_IMPL
export RELAY_PUBLIC_HOST
export RELAY_PUBLIC_PORT
export RELAY_PUBLIC_PROTOCOL
export RELAY_LISTEN_HOST
export RELAY_LISTEN_PORT
export RELAY_PREFER_IPV6
export RELAY_DEV_EXPOSE_LAN
export RELAY_SSL_CERT
export RELAY_SSL_KEY
export RELAY_CONFIG_DIRS
export RELAY_GOSSIPSUB_CONFIG

for dir in "${relay_config_dirs[@]}"; do
  rm -f \
    "$dir/relay-config-source.json" \
    "$dir/.relay-config-source.json" \
    "$dir/relay-config.json" \
    "$dir/.relay-config.json"
done

overview_host="localhost"
if ! is_loopback_host "${RELAY_PUBLIC_HOST:-}"; then
  overview_host="$RELAY_PUBLIC_HOST"
fi

vite_host_args="--host"
if is_ipv6_host "${overview_host:-}"; then
  vite_host_args="--host ::"
fi
vite_extra_args="$vite_host_args"
if [[ "${DEV_STRICT_PORT:-1}" != "0" ]]; then
  vite_extra_args="$vite_extra_args --strictPort"
fi

echo "Dev servers (HTTPS):"
echo "  relay: dynamic WSS (check relay logs for address)"
echo "  hyperborea: https://$(to_url_host "$overview_host"):5175/"
echo "  cubechat:   https://$(to_url_host "$overview_host"):5176/"
echo "  planetgen:  https://$(to_url_host "$overview_host"):5177/"
echo "  multiscale: https://$(to_url_host "$overview_host"):5185/"
echo "  universes:  https://$(to_url_host "$overview_host"):5178/"
echo "  webgpuphys: https://$(to_url_host "$overview_host"):5179/"
echo "  sneakywoods: https://$(to_url_host "$overview_host"):5180/"
echo "  daddygo:    https://$(to_url_host "$overview_host"):5181/"
echo "  fano-reactor: https://$(to_url_host "$overview_host"):5183/"
echo "  schrodinger: https://$(to_url_host "$overview_host"):5184/"
echo "  netviz:     https://$(to_url_host "$overview_host"):5182/"

"$repo_root/node_modules/.bin/concurrently" -k -n relay,hyperborea,cubechat,planetgen,multiscale,universes,webgpuphys,sneakywoods,daddygo,fano,schrodinger,netviz \
  "npm run dev:relay" \
  "npm --prefix \"$repo_root/demos/hyperborea\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/cubechat\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/planetgen\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/multiscale\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/universes\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/webgpuphys\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/sneakywoods\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/daddygo\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/fano-reactor\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/schrodinger\" run dev -- $vite_extra_args" \
  "npm --prefix \"$repo_root/demos/netviz\" run dev -- $vite_extra_args"
