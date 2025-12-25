# Tron Overworld P2P Server

This is the libp2p signaling and relay server for the Tron Overworld multiplayer game.

## Purpose

The server acts as:
- **Bootstrap Node**: Helps clients discover each other
- **Relay Server**: Facilitates connections between peers behind NATs
- **Message Relay**: Forwards game state updates between players

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
npm start
```

The server will start on:
- WebSocket: `ws://localhost:9090`
- TCP: `localhost:9091`

## Configuration

You can change the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## How It Works

1. **Clients connect** to the server via WebSocket
2. **Server relays** pub/sub messages between all connected clients
3. **Players discover** each other through the server
4. **Game state** (position, rotation, color) is broadcast through gossipsub

## Server Peer ID

When the server starts, it will display its Peer ID. You need to update the client code (`src/p2p/network.js`) with this Peer ID in the bootstrap list.

Look for this line and replace the placeholder peer ID:
```javascript
list: [
  `${SERVER_ADDR}/p2p/YOUR_SERVER_PEER_ID_HERE`
]
```

## Technical Details

- **Protocol**: libp2p
- **Transport**: WebSockets (for browser compatibility) and TCP
- **Pub/Sub**: GossipSub
- **Topic**: `/tron-overworld/1.0.0`
- **Encryption**: Noise protocol
- **Stream Multiplexing**: Yamux and Mplex

## Logs

The server logs:
- Peer connections and disconnections
- Message relay activity
- Server multiaddresses

## Production Deployment

For production, you should:
1. Use a proper domain with HTTPS/WSS
2. Configure firewall rules for the ports
3. Consider using a process manager like PM2
4. Set up monitoring and logging
