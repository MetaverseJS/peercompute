#!/bin/bash
set -e

echo "🚀 PeerCompute Relay + Test Automation"
echo "======================================"

PEER_CONFIG_FILE=".peer-config.json"
PEER_PID_FILE=".peer.pid"

# Cleanup function
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
    rm -f "$PEER_CONFIG_FILE"
    rm -f public/peer-config.json
    echo "✅ Cleanup complete"
}

# Set up trap to cleanup on exit
trap cleanup EXIT INT TERM

# Start PeerJS server if not already running
if [ -f "$PEER_PID_FILE" ]; then
    OLD_PID=$(cat "$PEER_PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "⚠️  PeerJS server already running (PID: $OLD_PID)"
        echo "   Using existing server..."
    else
        rm -f "$PEER_PID_FILE"
    fi
fi

# Start peer server if not already running
if [ ! -f "$PEER_PID_FILE" ]; then
    echo ""
    echo "1️⃣  Starting PeerJS server..."
    
    # Start relay in background and capture output
    mkdir -p logs
    node src/peer-server.js > logs/peer-server.log 2>&1 &
    PEER_PID=$!
    echo "$PEER_PID" > "$PEER_PID_FILE"
    
    echo "   PeerJS PID: $PEER_PID"
    echo "   Waiting for PeerJS server to initialize..."
    sleep 2

# Save config for tests to read
SERVER_PORT=9000
echo "{\"host\":\"localhost\",\"port\":$SERVER_PORT,\"path\":\"/peerjs\",\"secure\":false}" > "$PEER_CONFIG_FILE"
mkdir -p public
echo "{\"host\":\"localhost\",\"port\":$SERVER_PORT,\"path\":\"/peerjs\",\"secure\":false}" > public/peer-config.json
    
    echo ""
    echo "📋 PeerJS Configuration:"
    echo "   Server: ws://localhost:$SERVER_PORT/peerjs"
    echo "   Config file: $PEER_CONFIG_FILE"
fi

echo ""
echo "2️⃣  Running tests..."
echo ""

# Run tests
npm test

echo ""
echo "✅ Tests complete!"
