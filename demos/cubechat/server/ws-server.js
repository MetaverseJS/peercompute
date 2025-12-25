import { WebSocketServer } from 'ws';
import os from 'os';

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ 
  port: PORT,
  host: '0.0.0.0' // Listen on all network interfaces
});

// Helper function to get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Store all connected clients with metadata
const clients = new Map();

// Ping interval to keep connections alive (30 seconds)
const PING_INTERVAL = 30000;

wss.on('connection', (ws) => {
  let clientId = null;
  let isAlive = true;
  
  console.log('New client connected');
  
  // Set up ping/pong to keep connection alive
  ws.on('pong', () => {
    isAlive = true;
  });
  
  // Send ping every 30 seconds
  const pingInterval = setInterval(() => {
    if (isAlive === false) {
      console.log('Client timeout, terminating connection:', clientId);
      clearInterval(pingInterval);
      ws.terminate();
      return;
    }
    
    isAlive = false;
    ws.ping();
  }, PING_INTERVAL);
  
  // Clear interval on close
  ws.on('close', () => {
    clearInterval(pingInterval);
    
    if (clientId) {
      clients.delete(clientId);
      console.log(`Player left: ${clientId}`);

      // Notify others about player leaving
      const leaveMessage = JSON.stringify({
        type: 'player_leave',
        peerId: clientId
      });

      clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(leaveMessage);
        }
      });
    }
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Store client ID on join
      if (message.type === 'join') {
        clientId = message.peerId;
        clients.set(clientId, ws);
        console.log(`Player joined: ${clientId}`);
      }

      // Handle WebRTC signaling - send to specific peer
      if (message.targetPeer && (message.type === 'webrtc-offer' || 
          message.type === 'webrtc-answer' || message.type === 'webrtc-ice')) {
        const targetClient = clients.get(message.targetPeer);
        if (targetClient && targetClient.readyState === 1) {
          targetClient.send(data.toString());
        }
      } else {
        // Broadcast message to all other clients
        clients.forEach((client, id) => {
          if (id !== clientId && client.readyState === 1) {
            client.send(data.toString());
          }
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(pingInterval);
  });
});

const localIP = getLocalIP();
console.log(`WebSocket relay server running on:`);
console.log(`  - Local:   ws://localhost:${PORT}`);
console.log(`  - Network: ws://${localIP}:${PORT}`);
console.log('\nPlayers can now connect and see each other!');
console.log(`\nFor LAN connections, use: ws://${localIP}:${PORT}`);
