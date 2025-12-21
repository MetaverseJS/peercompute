#!/bin/bash
set -e

echo "🚀 PeerCompute Relay + Test Automation"
echo "======================================"

RELAY_CONFIG_FILE=".relay-config.json"
RELAY_PID_FILE=".relay.pid"
STARTED_RELAY=0

# Cleanup function
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
        rm -f "$RELAY_CONFIG_FILE"
        rm -f public/relay-config.json
    fi
    echo "✅ Cleanup complete"
}

# Set up trap to cleanup on exit
trap cleanup EXIT INT TERM

# Start relay server if not already running
if [ -f "$RELAY_PID_FILE" ]; then
    OLD_PID=$(cat "$RELAY_PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "⚠️  Relay server already running (PID: $OLD_PID)"
        echo "   Using existing server..."
        RELAY_ADDR=$(grep -m1 "Relay Address:" logs/relay-server.log | awk '{print $3}') || true
        if [ -z "$RELAY_ADDR" ]; then
            RELAY_ADDR=$(grep -m1 "Relay Address:" logs/relay-server-dev.log | awk '{print $3}') || true
        fi
        mkdir -p public
        if [ -n "$RELAY_ADDR" ]; then
            echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > "$RELAY_CONFIG_FILE"
            echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > public/relay-config.json
            echo ""
            echo "📋 Relay Configuration:"
            echo "   Relay: $RELAY_ADDR"
            echo "   Config file: $RELAY_CONFIG_FILE"
        else
            echo "{\"bootstrapPeers\":[]}" > "$RELAY_CONFIG_FILE"
            echo "{\"bootstrapPeers\":[]}" > public/relay-config.json
            echo "   Relay address not detected; wrote empty relay-config.json."
        fi
    else
        rm -f "$RELAY_PID_FILE"
    fi
fi

# Start relay server if not already running
if [ ! -f "$RELAY_PID_FILE" ]; then
    echo ""
    echo "1️⃣  Starting libp2p relay server..."
    
    # Start relay in background and capture output
    mkdir -p logs
    node src/relay/server.js > logs/relay-server.log 2>&1 &
    RELAY_PID=$!
    STARTED_RELAY=1
    echo "$RELAY_PID" > "$RELAY_PID_FILE"
    
    echo "   Relay PID: $RELAY_PID"
    echo "   Waiting for relay server to initialize..."
    RELAY_ADDR=""
    for i in $(seq 1 30); do
        RELAY_ADDR=$(grep -m1 "Relay Address:" logs/relay-server.log | awk '{print $3}') || true
        if [ -n "$RELAY_ADDR" ]; then
            break
        fi
        sleep 0.5
    done
    mkdir -p public
    if [ -n "$RELAY_ADDR" ]; then
        echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > "$RELAY_CONFIG_FILE"
        echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\"]}" > public/relay-config.json
        echo ""
        echo "📋 Relay Configuration:"
        echo "   Relay: $RELAY_ADDR"
        echo "   Config file: $RELAY_CONFIG_FILE"
    else
        echo "{\"bootstrapPeers\":[]}" > "$RELAY_CONFIG_FILE"
        echo "{\"bootstrapPeers\":[]}" > public/relay-config.json
        echo "   Relay address not detected; wrote empty relay-config.json."
    fi
fi

echo ""
echo "2️⃣  Running tests..."
echo ""

# Run tests (reuse the relay we just started)
DEV_SERVER_RUNNING=0
if command -v ss >/dev/null 2>&1; then
    if ss -ltn | awk 'NR>1 {split($4,a,":"); if (a[length(a)]=="5173") found=1} END {exit !found}'; then
        DEV_SERVER_RUNNING=1
    fi
elif command -v lsof >/dev/null 2>&1; then
    if lsof -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
        DEV_SERVER_RUNNING=1
    fi
fi

if [ "$DEV_SERVER_RUNNING" -eq 1 ]; then
    echo "⚠️  Dev server already running on port 5173; reusing existing server."
    USE_EXISTING_SERVER=1 SKIP_RELAY=1 npm test
else
    SKIP_RELAY=1 npm test
fi

echo ""
echo "✅ Tests complete!"
