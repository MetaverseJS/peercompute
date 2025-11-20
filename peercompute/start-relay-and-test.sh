#!/bin/bash
set -e

echo "🚀 PeerCompute Relay + Test Automation"
echo "======================================"

RELAY_CONFIG_FILE=".relay-config.json"
RELAY_PID_FILE=".relay.pid"

# Cleanup function
cleanup() {
    echo ""
    echo "🧹 Cleaning up..."
    if [ -f "$RELAY_PID_FILE" ]; then
        RELAY_PID=$(cat "$RELAY_PID_FILE")
        if kill -0 "$RELAY_PID" 2>/dev/null; then
            echo "   Stopping relay server (PID: $RELAY_PID)"
            kill "$RELAY_PID" 2>/dev/null || true
            wait "$RELAY_PID" 2>/dev/null || true
        fi
        rm -f "$RELAY_PID_FILE"
    fi
    rm -f "$RELAY_CONFIG_FILE"
    rm -f public/relay-config.json
    echo "✅ Cleanup complete"
}

# Set up trap to cleanup on exit
trap cleanup EXIT INT TERM

# Check if relay is already running
if [ -f "$RELAY_PID_FILE" ]; then
    OLD_PID=$(cat "$RELAY_PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "⚠️  Relay already running (PID: $OLD_PID)"
        echo "   Using existing relay server..."
        RELAY_ADDR=""
        if [ -f "$RELAY_CONFIG_FILE" ]; then
            RELAY_ADDR=$(grep -o '/ip4/127.0.0.1/tcp/[0-9]*/ws/p2p/[A-Za-z0-9]*' "$RELAY_CONFIG_FILE" | head -1)
        fi
        if [ -z "$RELAY_ADDR" ] && [ -f "relay-output.log" ]; then
            RELAY_ADDR=$(grep -o '/ip4/127.0.0.1/tcp/[0-9]*/ws/p2p/[A-Za-z0-9]*' relay-output.log | head -1)
        fi
        if [ -n "$RELAY_ADDR" ]; then
            echo "   Bootstrap address: $RELAY_ADDR"
            # Ensure both config locations are written even when reusing relay
            DNS_ADDR=$(echo "$RELAY_ADDR" | sed 's|/ip4/127.0.0.1|/dns4/localhost|')
            echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\",\"$DNS_ADDR\"]}" > "$RELAY_CONFIG_FILE"
            mkdir -p public
            echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\",\"$DNS_ADDR\"]}" > public/relay-config.json
        else
            echo "   ⚠️  Could not determine relay address (no config/log). Tests may fail to dial."
        fi
    else
        rm -f "$RELAY_PID_FILE"
    fi
fi

# Start relay server if not already running
if [ ! -f "$RELAY_PID_FILE" ]; then
    echo ""
    echo "1️⃣  Starting relay server..."
    
    # Start relay in background and capture output
    node src/relay/server.js > relay-output.log 2>&1 &
    RELAY_PID=$!
    echo "$RELAY_PID" > "$RELAY_PID_FILE"
    
    echo "   Relay PID: $RELAY_PID"
    echo "   Waiting for relay to initialize..."
    
    # Wait for relay to start and capture the bootstrap address
    MAX_WAIT=10
    WAITED=0
    RELAY_ADDR=""
    
    while [ $WAITED -lt $MAX_WAIT ]; do
        if [ -f "relay-output.log" ]; then
            RELAY_ADDR=$(grep -o '/ip4/127.0.0.1/tcp/[0-9]*/ws/p2p/[A-Za-z0-9]*' relay-output.log | head -1)
            if [ ! -z "$RELAY_ADDR" ]; then
                echo "   ✅ Relay started successfully!"
                break
            fi
        fi
        sleep 1
        WAITED=$((WAITED + 1))
        echo -n "."
    done
    echo ""
    
    if [ -z "$RELAY_ADDR" ]; then
        echo "   ❌ Failed to capture relay address"
        echo "   Check relay-output.log for errors"
        exit 1
    fi
    
# Save config for tests to read (include localhost and 127.0.0.1 variants)
DNS_ADDR=$(echo "$RELAY_ADDR" | sed 's|/ip4/127.0.0.1|/dns4/localhost|')
echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\",\"$DNS_ADDR\"]}" > "$RELAY_CONFIG_FILE"
# Also write to public/ so Vite serves it at /relay-config.json
mkdir -p public
echo "{\"bootstrapPeers\":[\"$RELAY_ADDR\",\"$DNS_ADDR\"]}" > public/relay-config.json
    
    echo ""
    echo "📋 Relay Configuration:"
    echo "   Bootstrap Address: $RELAY_ADDR"
    echo "   Config file: $RELAY_CONFIG_FILE"
fi

echo ""
echo "2️⃣  Running tests..."
echo ""

# Run tests
npm test

echo ""
echo "✅ Tests complete!"
