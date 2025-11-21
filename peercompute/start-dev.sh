#!/bin/bash
set -e

echo "🚀 PeerCompute Dev Environment (PeerJS)"
echo "======================================="

PEER_PID_FILE=".peer.pid"

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
node src/peer-server.js > logs/peer-server-dev.log 2>&1 &
PEER_PID=$!
echo "$PEER_PID" > "$PEER_PID_FILE"
echo "   PeerJS PID: $PEER_PID (ws://localhost:9000/peerjs)"

echo ""
echo "2️⃣  Starting Webpack Dev Server..."
npm run dev
