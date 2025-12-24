#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$repo_root/scripts/ensure-https.mjs"

export RELAY_LISTEN_HOST="${RELAY_LISTEN_HOST:-0.0.0.0}"
if [[ -z "${RELAY_PUBLIC_HOST:-}" ]]; then
  RELAY_PUBLIC_HOST="$(node "$repo_root/scripts/get-local-ip.mjs" || true)"
  if [[ -n "$RELAY_PUBLIC_HOST" ]]; then
    export RELAY_PUBLIC_HOST
  fi
fi

export RELAY_SSL_CERT="$repo_root/certs/dev-cert.pem"
export RELAY_SSL_KEY="$repo_root/certs/dev-key.pem"
export RELAY_CONFIG_DIRS="$repo_root/demos/hyperborea/public,$repo_root/demos/cubechat/public,$repo_root/demos/sneakywoods/public,$repo_root/docs/hyperborea,$repo_root/docs/cubechat,$repo_root/docs/sneakywoods"

echo "Dev servers (HTTPS):"
echo "  relay: dynamic WSS (check relay logs for address)"
echo "  hyperborea: https://localhost:5175/"
echo "  cubechat:   https://localhost:5176/"
echo "  planetgen:  https://localhost:5177/"
echo "  universes:  https://localhost:5178/"
echo "  webgpuphys: https://localhost:5179/"
echo "  sneakywoods: https://localhost:5180/"

"$repo_root/node_modules/.bin/concurrently" -k -n relay,hyperborea,cubechat,planetgen,universes,webgpuphys,sneakywoods \
  "npm run dev:relay" \
  "npm run dev:hyperborea" \
  "npm run dev:cubechat" \
  "npm run dev:planetgen" \
  "npm run dev:universes" \
  "npm run dev:webgpuphys" \
  "npm run dev:sneakywoods"
