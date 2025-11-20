# libp2p Circuit Relay v2 Server

This is a local relay server for PeerCompute that enables browser-to-browser P2P connections.

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
- WebSocket address for browsers (port 9090)
- TCP address for Node.js clients (port 9091)

### 2. Copy the WebSocket Address

Look for output like:
```
🌐 Browser clients should use:
  /ip4/127.0.0.1/tcp/9090/ws/p2p/12D3KooW...
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

The `test:with-relay` script automatically starts the relay and runs tests:

```bash
npm run test:with-relay
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

The relay server is configured in `relay-server.js`:

### Ports
- **WebSocket**: 9090 (for browsers)
- **TCP**: 9091 (for Node.js)

### Limits
- **Max Reservations**: 100 simultaneous clients
- **Reservation TTL**: 1 hour
- **Max Data per Client**: 50 MB
- **Max Connection Time**: 10 minutes

### Modify Configuration

Edit `relay-server.js` to change:
```javascript
const WEBSOCKET_PORT = 9090;  // Change WebSocket port
const TCP_PORT = 9091;         // Change TCP port

reservations: {
  maxReservations: 100,              // Max simultaneous clients
  reservationTtl: 60 * 60 * 1000,    // How long reservations last
  defaultDataLimit: BigInt(50 * 1024 * 1024)  // Max data per connection
}
```

## Production Deployment

### Running on a Server

For production, you'll want to:

1. **Use a process manager** (PM2, systemd, etc.):
```bash
pm2 start relay-server.js --name peercompute-relay
```

2. **Use a reverse proxy** (nginx, Caddy) for SSL:
```nginx
location /relay {
    proxy_pass http://localhost:9090;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

3. **Update bootstrap addresses** to use your domain:
```javascript
bootstrapPeers: [
  '/dns4/your-domain.com/tcp/443/wss/p2p/12D3KooW...'
]
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

Another process is using port 9090 or 9091.

**Solution**: Change ports in `relay-server.js` or kill the conflicting process:
```bash
lsof -ti:9090 | xargs kill
lsof -ti:9091 | xargs kill
```

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

Node.js clients can use the TCP address for better performance:

```javascript
const node = new NodeKernel({
  topology: 'distributed',
  bootstrapPeers: [
    '/ip4/127.0.0.1/tcp/9091/p2p/12D3KooW...'  // TCP for Node.js
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
