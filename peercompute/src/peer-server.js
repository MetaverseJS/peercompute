import { PeerServer } from 'peer';

const port = 9000;
const path = '/peerjs';

const server = PeerServer({ port, path, proxied: true }, () => {
  console.log(`[PeerServer] Listening on ws://localhost:${port}${path}`);
});

server.on('connection', (client) => {
  console.log('[PeerServer] Peer connected:', client.getId());
});

server.on('disconnect', (client) => {
  console.log('[PeerServer] Peer disconnected:', client.getId());
});
