# libp2p Circuit Relay v2 Server

This is a local relay server for PeerCompute that enables browser-to-browser P2P connections.

**Runtime summary:**
- Local dev/test defaults to the Node relay via `src/relay/server.js`.
- Production should run the Go relay via `src/relay-go/main.go`, launched through `scripts/start-relay-prod.sh` or `scripts/install-relay-systemd.sh`.
- The Deno relay (`src/relay/server.ts`) is legacy and not used by the current scripts.

## Why Do We Need a Relay Server?

Browsers have fundamental limitations for P2P networking:
- ❌ **Cannot listen for incoming connections** (no server capability)
- ❌ **Cannot open TCP sockets** (only WebSockets/WebRTC)
- ❌ **Cannot directly dial other browsers** (NAT traversal required)

A relay server solves these problems by:
- ✅ Acting as a rendezvous point for browser nodes
- ✅ Providing WebSocket connectivity (browsers can connect via WS/WSS)
- ✅ Enabling circuit relay for NAT traversal
- ✅ Facilitating peer discovery via pubsub

## Quick Start

### 1. Start the Relay Server

```bash
cd peercompute
npm run relay
```

The server will start and display:
- Peer ID
- WebSocket address for browsers (WS/WSS)

### 2. Copy the WebSocket Address

Look for output like:
```
Relay Address: /ip4/127.0.0.1/tcp/12345/ws/p2p/12D3KooW...
```

### 3. Use in Your Application

When creating a NodeKernel, pass the relay address:

```javascript
const node = new NodeKernel({
  topology: 'distributed',
  bootstrapPeers: [
    '/ip4/127.0.0.1/tcp/9090/ws/p2p/12D3KooW...'  // Use the address from step 2
  ]
});
```

## Running Tests with Relay

### Automated Test with Relay

The `test:auto` script automatically starts the relay and runs tests:

```bash
npm run test:auto
```

This will:
1. Start the relay server
2. Wait for it to initialize
3. Run the Playwright tests
4. Clean up when done

### Manual Testing

Terminal 1 - Start relay:
```bash
npm run relay
```

Terminal 2 - Run tests:
```bash
npm test
```

Terminal 3 - Run dev server (optional):
```bash
npm run dev
```

## Configuration

The relay server is configured in `src/relay/server.js`. It binds to a random port (`/tcp/0`) and prints the selected WebSocket multiaddr on startup.

### Environment Variables

- `RELAY_PUBLIC_HOST`: Public IP/hostname to announce (e.g. `192.168.1.174`).
- `RELAY_PUBLIC_PORT` / `RELAY_PUBLIC_PROTOCOL`: Public port/protocol to announce (`443` / `wss` when TLS is terminated upstream).
- `RELAY_LISTEN_HOST`: Interface to bind (defaults to `127.0.0.1`, or `0.0.0.0` when `RELAY_PUBLIC_HOST` is set).
- `RELAY_SSL_CERT` / `RELAY_SSL_KEY`: TLS certificate and key for WSS (falls back to `SSL_CERT` / `SSL_KEY`).

For the Go relay, the `RELAY_PUBLIC_*` values now drive both generated `relay-config.json` output and the relay's advertised libp2p addresses.
That matters for reverse-proxy deployments: circuit reservations inherit the public WSS addresses instead of leaking loopback/private listen addresses.

### Modify Configuration

Edit `src/relay/server.js` to adjust:
- transport options
- relay reservation limits
- pubsub implementation

## Production Deployment

### Running on a Server

For production, use the Go relay under systemd.

If you want the repo-managed one-command path, run:

```bash
sudo -E env "PATH=$PATH" bash scripts/install-prod-systemd-services.sh
```

That wrapper defaults to the split production layout:
- `peercompute-relay.service` for the Go relay
- `peercompute-coturn.service` for TURN/STUN

1. **Install the combined backend service** (recommended):
```bash
sudo -E bash scripts/install-relay-systemd.sh
```

This installs `peercompute-relay.service`, which runs `scripts/pcserver.sh` and starts:
- the Go relay (`RELAY_IMPL=go` by default)
- the local TURN/STUN service

The generated service also sets `RELAY_REQUIRE_GO=1` when `RELAY_IMPL=go`, so the production launcher fails instead of silently falling back to Node.
The installer also records the install-time `PATH` in the unit so systemd can still find `go` when it lives outside the default service path.
If you want relay and coturn split into separate units, install the relay service with `PCSERVER_ENABLE_TURN=0` and then install coturn with `scripts/install-coturn-systemd.sh`.

2. **Or launch manually for a one-off production test**:
```bash
RELAY_IMPL=go RELAY_SSL_CERT=/path/to/fullchain.pem RELAY_SSL_KEY=/path/to/privkey.pem bash scripts/pcserver.sh
```

3. **Use a reverse proxy** (nginx, Caddy) for SSL termination when needed:
```nginx
location /relay {
    proxy_pass http://localhost:9090;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

In this setup, make sure the relay service environment still sets `RELAY_PUBLIC_HOST`, `RELAY_PUBLIC_PORT=443`, and `RELAY_PUBLIC_PROTOCOL=wss`.
Those values must match the proxy-facing address or browser relay reservations can learn unusable local addrs.

4. **Update bootstrap addresses** to use your domain:
```javascript
bootstrapPeers: [
  '/dns4/your-domain.com/tcp/443/wss/p2p/12D3KooW...'
]
```

If you want TURN/STUN isolated from the combined backend unit, install a dedicated coturn systemd unit with:

```bash
sudo -E bash scripts/install-coturn-systemd.sh
```

### Security Considerations

- **Rate limiting**: The relay includes bandwidth limits per client
- **Reservation limits**: Max 100 simultaneous reservations by default
- **Connection timeouts**: 10-minute max connection duration
- **Data limits**: 50 MB max per relayed connection

### Monitoring

The relay logs:
- New peer connections
- Peer disconnections
- Active connection count
- Periodic status updates (every 60 seconds)

Watch the logs:
```bash
npm run relay | tee relay.log
```

## Troubleshooting

### Issue: "Address already in use"

Another process is using the chosen port.

**Solution**: Restart the relay to pick a new port, or change the listen address in `src/relay/server.js`.

### Issue: Browser can't connect to relay

**Check**:
1. Is the relay server running? (`npm run relay`)
2. Is the WebSocket address correct? (Check console output)
3. Is there a firewall blocking port 9090?
4. Are you using the WebSocket address (not TCP)?

**Test connectivity**:
```bash
# Should show connection info
curl http://localhost:9090
```

### Issue: Nodes connect but don't discover each other

**This is expected** with just a relay! The relay allows connections, but peer discovery still requires:
1. Both nodes connected to the same relay
2. Pubsub peer discovery enabled (already configured)
3. Nodes subscribing to the same discovery topic

**Verify both nodes are connected**:
- Check relay console for "Peer connected" messages
- Should show 2+ active connections

## Relay Config for Browsers

The dev/test scripts write a `relay-config.json` file with bootstrap peers:

```json
{ \"bootstrapPeers\": [\"/ip4/127.0.0.1/tcp/9090/ws/p2p/12D3KooW...\"] }
```

Browser clients should load this file and pass it into `NodeKernel` as `bootstrapPeers`.

## Advanced Usage

### Multiple Relay Servers

For redundancy, run multiple relays and provide all addresses:

```javascript
bootstrapPeers: [
  '/ip4/127.0.0.1/tcp/9090/ws/p2p/12D3KooW...',
  '/ip4/192.168.1.100/tcp/9090/ws/p2p/12D3KooW...',
  '/dns4/relay.example.com/tcp/443/wss/p2p/12D3KooW...'
]
```

### Custom Discovery Topics

Modify the discovery topic in `NetworkManager.js`:
```javascript
pubsubPeerDiscovery({
  interval: 1000,
  topics: ['my-custom-app._peer-discovery._p2p._pubsub']
})
```

### Node.js Client Example

Node.js clients can use the same WebSocket multiaddr shown by the relay:

```javascript
const node = new NodeKernel({
  topology: 'distributed',
  bootstrapPeers: [
    '/ip4/127.0.0.1/tcp/12345/ws/p2p/12D3KooW...'
  ]
});
```

## Architecture

```
┌─────────────┐         ┌─────────────┐
│  Browser A  │         │  Browser B  │
│   (Node 1)  │         │   (Node 2)  │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │ WebSocket (WS)        │ WebSocket (WS)
       │                       │
       ├───────────────────────┤
       │                       │
       ▼                       ▼
┌─────────────────────────────────────┐
│      libp2p Relay Server            │
│   - WebSocket Transport (Port 9090) │
│   - TCP Transport (Port 9091)       │
│   - Circuit Relay v2                │
│   - Pubsub (Gossipsub)              │
└─────────────────────────────────────┘
```

## References

- [libp2p Circuit Relay Spec](https://github.com/libp2p/specs/blob/master/relay/circuit-v2.md)
- [js-libp2p Documentation](https://github.com/libp2p/js-libp2p)
- [Circuit Relay v2 Transport](https://github.com/libp2p/js-libp2p/tree/main/packages/transport-circuit-relay-v2)
