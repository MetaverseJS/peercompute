import { PeerServer } from 'peer';
import fs from 'fs';

const sslCert = process.env.SSL_CERT;
const sslKey = process.env.SSL_KEY;
const ssl = sslCert && sslKey ? {
  cert: fs.readFileSync(sslCert),
  key: fs.readFileSync(sslKey)
} : undefined;

const port = 9000;
const path = '/peerjs';

// allow_discovery enables client-side listAllPeers for simple room discovery
const server = PeerServer({
  port,
  path,
  proxied: true,
  allow_discovery: true,
  ssl
}, () => {
  const proto = ssl ? 'wss' : 'ws';
  console.log(`[PeerServer] Listening on ${proto}://localhost:${port}${path}`);
});

server.on('connection', (client) => {
  console.log('[PeerServer] Peer connected:', client.getId());
});

server.on('disconnect', (client) => {
  console.log('[PeerServer] Peer disconnected:', client.getId());
});
