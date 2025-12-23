#!/bin/bash
HTTPS="${HTTPS:-1}"
SSL_CERT="${SSL_CERT:-}"
SSL_KEY="${SSL_KEY:-}"
SSL_CA="${SSL_CA:-~/.local/share/mkcert/rootCA.pem}"
PEERCOMPUTE_DEBUG="${PEERCOMPUTE_DEBUG:-0}"
set -e

echo "🚀 PeerCompute Dev Environment (libp2p)"
echo "======================================="

RELAY_PID_FILE=".relay.pid"
RELAY_CONFIG_FILE=".relay-config.json"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEFAULT_CERT="$ROOT_DIR/certs/dev.crt"
DEFAULT_KEY="$ROOT_DIR/certs/dev.key"
EXPORT_CERT_DIR="$ROOT_DIR/public/certs"
SKIP_RELAY="${SKIP_RELAY:-0}"
STARTED_RELAY=0

# Auto-detect LAN IP if RELAY_PUBLIC_HOST is not set
if [ -z "${RELAY_PUBLIC_HOST:-}" ]; then
  LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{for (i=1; i<=NF; i++) if ($i=="src") {print $(i+1); exit}}') || true
  if [ -n "$LOCAL_IP" ]; then
    export RELAY_PUBLIC_HOST="$LOCAL_IP"
    echo "   Auto-detected RELAY_PUBLIC_HOST=$RELAY_PUBLIC_HOST"
  fi
fi

# If HTTPS=1 is set, prefer provided SSL_CERT/SSL_KEY, else fall back to dev certs
if [ "${HTTPS:-}" = "1" ]; then
  if [ -z "${SSL_CERT:-}" ] && [ -f "$DEFAULT_CERT" ]; then
    SSL_CERT="$DEFAULT_CERT"
  fi
  if [ -z "${SSL_KEY:-}" ] && [ -f "$DEFAULT_KEY" ]; then
    SSL_KEY="$DEFAULT_KEY"
  fi
fi

# If advertising a public host, ensure we listen on all interfaces by default
if [ -n "${RELAY_PUBLIC_HOST:-}" ] && [ -z "${RELAY_LISTEN_HOST:-}" ]; then
  export RELAY_LISTEN_HOST="0.0.0.0"
fi

# If we have certs/keys, force HTTPS=1 for both servers
if [ -n "${SSL_CERT:-}" ] && [ -n "${SSL_KEY:-}" ]; then
  export HTTPS=1
fi

# Export so both peer server and webpack see them
export SSL_CERT SSL_KEY
export PEERCOMPUTE_DEBUG

# Export certs for download (Quest/etc.)
mkdir -p "$EXPORT_CERT_DIR"
if [ -n "${SSL_CERT:-}" ] && [ -f "$SSL_CERT" ]; then
  cp "$SSL_CERT" "$EXPORT_CERT_DIR/server.crt"
fi
# Try to export mkcert root CA if present (best for device trust)
CA_ROOT=""
if [ -n "${SSL_CA:-}" ] && [ -f "$SSL_CA" ]; then
  CA_ROOT="$SSL_CA"
elif command -v mkcert >/dev/null 2>&1; then
  CAROOT_PATH=$(mkcert -CAROOT 2>/dev/null || true)
  if [ -n "$CAROOT_PATH" ] && [ -f "$CAROOT_PATH/rootCA.pem" ]; then
    CA_ROOT="$CAROOT_PATH/rootCA.pem"
  elif [ -f "$HOME/.local/share/mkcert/rootCA.pem" ]; then
    CA_ROOT="$HOME/.local/share/mkcert/rootCA.pem"
  elif [ -f "/home/cos/snap/code/211/.local/share/mkcert/rootCA.pem" ]; then
    CA_ROOT="/home/cos/snap/code/211/.local/share/mkcert/rootCA.pem"
  elif [ -f "$ROOT_DIR/certs/rootCA.pem" ]; then
    CA_ROOT="$ROOT_DIR/certs/rootCA.pem"
  fi
fi
if [ -n "$CA_ROOT" ] && [ -f "$CA_ROOT" ]; then
  cp "$CA_ROOT" "$EXPORT_CERT_DIR/rootCA.pem"
else
  echo "   (mkcert root CA not found; set SSL_CA=/path/to/rootCA.pem to export it)"
fi

cleanup() {
  echo ""
  echo "🧹 Cleaning up..."
  if [ "$STARTED_RELAY" -eq 1 ] && [ -f "$RELAY_PID_FILE" ]; then
    RELAY_PID=$(cat "$RELAY_PID_FILE")
    if kill -0 "$RELAY_PID" 2>/dev/null; then
      echo "   Stopping relay server (PID: $RELAY_PID)"
      kill "$RELAY_PID" 2>/dev/null || true
      wait "$RELAY_PID" 2>/dev/null || true
    fi
    rm -f "$RELAY_PID_FILE"
  fi
  if [ "$STARTED_RELAY" -eq 1 ]; then
    rm -f "$RELAY_CONFIG_FILE" public/relay-config.json
  fi
  echo "✅ Cleanup complete"
}

trap cleanup EXIT INT TERM

echo ""
echo "1️⃣  Starting libp2p relay server..."
if [ "$SKIP_RELAY" = "1" ]; then
  echo "   SKIP_RELAY=1 set; using existing relay."
  if [ ! -f "$RELAY_CONFIG_FILE" ]; then
    RELAY_ADDR=$(grep -m1 "Relay Address:" logs/relay-server-dev.log | awk '{print $3}') || true
    if [ -z "$RELAY_ADDR" ]; then
      RELAY_ADDR=$(grep -m1 "Relay Address:" logs/relay-server.log | awk '{print $3}') || true
    fi
    if [ -n "$RELAY_ADDR" ]; then
      echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > "$RELAY_CONFIG_FILE"
    fi
  fi
  mkdir -p public
  if [ -f "$RELAY_CONFIG_FILE" ]; then
    cp "$RELAY_CONFIG_FILE" public/relay-config.json
  elif [ ! -f public/relay-config.json ]; then
    echo "{\"bootstrapPeers\":[]}" > public/relay-config.json
  fi
else
  if [ -z "$SSL_CERT" ] || [ -z "$SSL_KEY" ]; then
    echo "   SSL_CERT/SSL_KEY not set; relay server will listen on ws."
  else
    echo "   Using SSL_CERT=$SSL_CERT"
    echo "   Using SSL_KEY=$SSL_KEY"
  fi
  mkdir -p logs
  node src/relay/server.js > logs/relay-server-dev.log 2>&1 &
  RELAY_PID=$!
  STARTED_RELAY=1
  echo "$RELAY_PID" > "$RELAY_PID_FILE"

  # Capture relay address for browser bootstrap config
RELAY_ADDR=""
for i in $(seq 1 30); do
    RELAY_ADDR=$(grep -m1 "Relay Address:" logs/relay-server-dev.log | awk '{print $3}') || true
    if [ -n "$RELAY_ADDR" ]; then
      break
    fi
    sleep 0.5
  done

  if [ -n "$RELAY_ADDR" ]; then
    echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > "$RELAY_CONFIG_FILE"
    mkdir -p public
    echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > public/relay-config.json
    echo "   Relay address: $RELAY_ADDR"
  else
    echo "   Relay address not detected yet; update relay-config.json manually if needed."
  fi
fi

echo ""
echo "2️⃣  Starting Webpack Dev Server..."
DEV_PROTO="http"
if [ -n "$SSL_CERT" ] && [ -n "$SSL_KEY" ]; then
  DEV_PROTO="https"
fi
DEV_HOST="${DEV_HOST:-${RELAY_PUBLIC_HOST:-localhost}}"
echo "   Game links:"
echo "     ${DEV_PROTO}://localhost:5173/games/sw2.html"
echo "     ${DEV_PROTO}://localhost:5173/games/cb.html"
if [ "$DEV_HOST" != "localhost" ]; then
  echo "     ${DEV_PROTO}://${DEV_HOST}:5173/games/sw2.html"
  echo "     ${DEV_PROTO}://${DEV_HOST}:5173/games/cb.html"
fi
if [ -n "$SSL_CERT" ] && [ -n "$SSL_KEY" ]; then
  echo "   HTTPS=1 with SSL cert/key detected; dev server will use HTTPS"
  HTTPS=1 SSL_CERT="$SSL_CERT" SSL_KEY="$SSL_KEY" npm run dev
else
  npm run dev
fi
