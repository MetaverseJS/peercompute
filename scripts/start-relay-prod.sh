#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
prod_config="$repo_root/prod-config.json"

cd "$repo_root"

relay_host=""
relay_port=""
listen_host=""
listen_port=""
relay_protocol=""
ssl_cert=""
ssl_key=""
identity_file=""

if [[ -f "$prod_config" ]]; then
  relay_host="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayHost)process.stdout.write(String(cfg.relayHost));")"
  relay_port="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayPort)process.stdout.write(String(cfg.relayPort));")"
  listen_host="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.listenHost)process.stdout.write(String(cfg.listenHost));")"
  listen_port="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.listenPort)process.stdout.write(String(cfg.listenPort));")"
  relay_protocol="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayProtocol)process.stdout.write(String(cfg.relayProtocol));")"
  ssl_cert="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.sslCert)process.stdout.write(String(cfg.sslCert));")"
  ssl_key="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.sslKey)process.stdout.write(String(cfg.sslKey));")"
  identity_file="$(node -e "const fs=require('fs');const cfg=JSON.parse(fs.readFileSync('$prod_config','utf8'));if(cfg.relayIdentityFile)process.stdout.write(String(cfg.relayIdentityFile));")"
fi

if [[ -n "$relay_host" && -z "${RELAY_PUBLIC_HOST:-}" ]]; then
  export RELAY_PUBLIC_HOST="$relay_host"
fi
if [[ -n "$relay_port" && -z "${RELAY_PUBLIC_PORT:-}" ]]; then
  export RELAY_PUBLIC_PORT="$relay_port"
fi
if [[ -n "$listen_host" && -z "${RELAY_LISTEN_HOST:-}" ]]; then
  export RELAY_LISTEN_HOST="$listen_host"
fi
if [[ -n "$listen_port" && -z "${RELAY_LISTEN_PORT:-}" ]]; then
  export RELAY_LISTEN_PORT="$listen_port"
fi
if [[ -n "$ssl_cert" && -z "${RELAY_SSL_CERT:-}" ]]; then
  export RELAY_SSL_CERT="$ssl_cert"
fi
if [[ -n "$ssl_key" && -z "${RELAY_SSL_KEY:-}" ]]; then
  export RELAY_SSL_KEY="$ssl_key"
fi
if [[ -n "$identity_file" && -z "${RELAY_IDENTITY_FILE:-}" ]]; then
  export RELAY_IDENTITY_FILE="$identity_file"
fi

export RELAY_LISTEN_HOST="${RELAY_LISTEN_HOST:-0.0.0.0}"
if [[ -z "${RELAY_LISTEN_PORT:-}" && -n "${RELAY_PUBLIC_PORT:-}" ]]; then
  export RELAY_LISTEN_PORT="$RELAY_PUBLIC_PORT"
fi
if [[ -z "${RELAY_PUBLIC_PORT:-}" && -n "${RELAY_LISTEN_PORT:-}" ]]; then
  export RELAY_PUBLIC_PORT="$RELAY_LISTEN_PORT"
fi

if [[ -n "${relay_protocol:-}" ]] && [[ "${relay_protocol,,}" == "wss" ]]; then
  if [[ -z "${RELAY_SSL_CERT:-}" || -z "${RELAY_SSL_KEY:-}" ]]; then
    echo "Warning: relayProtocol=wss but RELAY_SSL_CERT/RELAY_SSL_KEY not set. Relay will use ws."
  fi
fi

echo "Starting PeerCompute relay server (production)..."
echo "  RELAY_PUBLIC_HOST=${RELAY_PUBLIC_HOST:-}"
echo "  RELAY_PUBLIC_PORT=${RELAY_PUBLIC_PORT:-}"
echo "  RELAY_LISTEN_HOST=${RELAY_LISTEN_HOST:-}"
echo "  RELAY_LISTEN_PORT=${RELAY_LISTEN_PORT:-}"

node "$repo_root/peercompute/src/relay/server.js"
