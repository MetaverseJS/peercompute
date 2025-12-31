#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$repo_root/scripts/ensure-https.mjs"

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
    export RELAY_PUBLIC_HOST="$relay_public_host"
  fi
  if [[ -n "$relay_public_port" && -z "${RELAY_PUBLIC_PORT:-}" ]]; then
    export RELAY_PUBLIC_PORT="$relay_public_port"
  fi
  if [[ -n "$relay_listen_host" && -z "${RELAY_LISTEN_HOST:-}" ]]; then
    export RELAY_LISTEN_HOST="$relay_listen_host"
  fi
  if [[ -n "$relay_listen_port" && -z "${RELAY_LISTEN_PORT:-}" ]]; then
    export RELAY_LISTEN_PORT="$relay_listen_port"
  fi
  if [[ -n "$relay_public_protocol" && -z "${RELAY_PUBLIC_PROTOCOL:-}" ]]; then
    export RELAY_PUBLIC_PROTOCOL="$relay_public_protocol"
  fi
  if [[ -n "$relay_identity_file" && -z "${RELAY_IDENTITY_FILE:-}" ]]; then
    export RELAY_IDENTITY_FILE="$relay_identity_file"
  fi
  if [[ -n "$relay_config_file" && -z "${RELAY_CONFIG_FILE:-}" ]]; then
    export RELAY_CONFIG_FILE="$relay_config_file"
  fi
  if [[ -n "$relay_webrtc_config" && -z "${RELAY_WEBRTC_CONFIG:-}" ]]; then
    export RELAY_WEBRTC_CONFIG="$relay_webrtc_config"
  fi
  if [[ -n "$relay_pubsub_type" && -z "${RELAY_PUBSUB_TYPE:-}" ]]; then
    export RELAY_PUBSUB_TYPE="$relay_pubsub_type"
  fi
  if [[ -n "$relay_gossipsub_config" && -z "${RELAY_GOSSIPSUB_CONFIG:-}" ]]; then
    export RELAY_GOSSIPSUB_CONFIG="$relay_gossipsub_config"
  fi
fi

export RELAY_LISTEN_HOST="${RELAY_LISTEN_HOST:-0.0.0.0}"
if [[ -z "${RELAY_PUBLIC_HOST:-}" ]]; then
  if [[ "$RELAY_LISTEN_HOST" == "127.0.0.1" || "$RELAY_LISTEN_HOST" == "localhost" || "$RELAY_LISTEN_HOST" == "::1" ]]; then
    export RELAY_PUBLIC_HOST="$RELAY_LISTEN_HOST"
  else
    RELAY_PUBLIC_HOST="$(node "$repo_root/scripts/get-local-ip.mjs" || true)"
    if [[ -n "$RELAY_PUBLIC_HOST" ]]; then
      export RELAY_PUBLIC_HOST
    fi
  fi
fi

export RELAY_SSL_CERT="$repo_root/certs/dev-cert.pem"
export RELAY_SSL_KEY="$repo_root/certs/dev-key.pem"
if [[ -z "${RELAY_PUBLIC_PROTOCOL:-}" ]]; then
  if [[ -n "${RELAY_SSL_CERT:-}" && -n "${RELAY_SSL_KEY:-}" ]]; then
    export RELAY_PUBLIC_PROTOCOL="wss"
  else
    export RELAY_PUBLIC_PROTOCOL="ws"
  fi
fi

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

export RELAY_CONFIG_DIRS="$(IFS=,; echo "${relay_config_dirs[*]}")"

for dir in "${relay_config_dirs[@]}"; do
  rm -f "$dir/relay-config-source.json" "$dir/.relay-config-source.json"
done

overview_url="https://localhost:4173/?dev=1"
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
echo "  hyperborea: https://localhost:5175/"
echo "  cubechat:   https://localhost:5176/"
echo "  planetgen:  https://localhost:5177/"
echo "  universes:  https://localhost:5178/"
echo "  webgpuphys: https://localhost:5179/"
echo "  sneakywoods: https://localhost:5180/"
echo "  daddygo:    https://localhost:5181/"
echo "  netviz:     https://localhost:5182/"

"$repo_root/node_modules/.bin/concurrently" -k --prefix "[{name}]" --prefix-colors auto -n relay,hyperborea,cubechat,planetgen,universes,webgpuphys,sneakywoods,daddygo,netviz,docs \
  "npm run dev:relay" \
  "npm run dev:hyperborea" \
  "npm run dev:cubechat" \
  "npm run dev:planetgen" \
  "npm run dev:universes" \
  "npm run dev:webgpuphys" \
  "npm run dev:sneakywoods" \
  "npm run dev:daddygo" \
  "npm run dev:netviz" \
  "npm run docs:dev"
