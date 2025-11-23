#!/bin/bash
 HTTPS=1 
 SSL_CERT=./certs/dev.crt 
 SSL_KEY=./certs/dev.key
SSL_CA=~/.local/share/mkcert/rootCA.pem
set -e

echo "🚀 PeerCompute Dev Environment (PeerJS)"
echo "======================================="

PEER_PID_FILE=".peer.pid"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEFAULT_CERT="$ROOT_DIR/certs/dev.crt"
DEFAULT_KEY="$ROOT_DIR/certs/dev.key"
EXPORT_CERT_DIR="$ROOT_DIR/public/certs"

# If HTTPS=1 is set, prefer provided SSL_CERT/SSL_KEY, else fall back to dev certs
if [ "${HTTPS:-}" = "1" ]; then
  if [ -z "${SSL_CERT:-}" ] && [ -f "$DEFAULT_CERT" ]; then
    SSL_CERT="$DEFAULT_CERT"
  fi
  if [ -z "${SSL_KEY:-}" ] && [ -f "$DEFAULT_KEY" ]; then
    SSL_KEY="$DEFAULT_KEY"
  fi
fi

# If we have certs/keys, force HTTPS=1 for both servers
if [ -n "${SSL_CERT:-}" ] && [ -n "${SSL_KEY:-}" ]; then
  export HTTPS=1
fi

# Export so both peer server and webpack see them
export SSL_CERT SSL_KEY

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
  if [ -f "$PEER_PID_FILE" ]; then
    PEER_PID=$(cat "$PEER_PID_FILE")
    if kill -0 "$PEER_PID" 2>/dev/null; then
      echo "   Stopping PeerJS server (PID: $PEER_PID)"
      kill "$PEER_PID" 2>/dev/null || true
      wait "$PEER_PID" 2>/dev/null || true
    fi
    rm -f "$PEER_PID_FILE"
  fi
  echo "✅ Cleanup complete"
}

trap cleanup EXIT INT TERM

echo ""
echo "1️⃣  Starting PeerJS signaling server..."
if [ -z "$SSL_CERT" ] || [ -z "$SSL_KEY" ]; then
  echo "   SSL_CERT/SSL_KEY not set, running PeerJS over WS (port 9000)."
else
  echo "   Using SSL_CERT=$SSL_CERT"
  echo "   Using SSL_KEY=$SSL_KEY"
fi
node src/peer-server.js > logs/peer-server-dev.log 2>&1 &
PEER_PID=$!
echo "$PEER_PID" > "$PEER_PID_FILE"
PROTO="ws"
if [ -n "$SSL_CERT" ] && [ -n "$SSL_KEY" ]; then PROTO="wss"; fi
echo "   PeerJS PID: $PEER_PID (${PROTO}://localhost:9000/peerjs)"

echo ""
echo "2️⃣  Starting Webpack Dev Server..."
if [ -n "$SSL_CERT" ] && [ -n "$SSL_KEY" ]; then
  echo "   HTTPS=1 with SSL cert/key detected; dev server will use HTTPS"
  HTTPS=1 SSL_CERT="$SSL_CERT" SSL_KEY="$SSL_KEY" npm run dev
else
  npm run dev
fi
