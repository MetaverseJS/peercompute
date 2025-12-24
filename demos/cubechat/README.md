# CubeChat (PeerCompute Port)

## Run
```bash
cd demos/cubechat
npm install
npm run dev
```

Open `http://localhost:5176/`.

## Multiplayer
This demo uses the PeerCompute relay for discovery + state sync. Ensure a relay is running and update `public/relay-config.json` with the current bootstrap peer list.

## Notes
- WebRTC signaling and player state sync flow through PeerCompute events; ensure your relay config points at a reachable bootstrap peer.
