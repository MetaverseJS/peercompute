# PeerCompute Project

A monorepo containing PeerCompute - a browser-based P2P distributed compute network - and related projects.

## Project Structure

```
.
├── peercompute/          # Main PeerCompute library
│   ├── src/              # Source code
│   ├── tests/            # Playwright tests
│   ├── docs/             # Documentation
│   └── README.md         # Detailed project documentation
├── games/                # Game artifacts (e.g., sw2.html)
├── cyberborea/           # Cyberborea metaverse project
├── plan/                 # Planning and implementation docs
│   ├── imp-plan.md       # Implementation plan
│   ├── imp-log.md        # Implementation log
│   └── *.md              # Various design documents
└── README.md             # This file
```

## PeerCompute

Browser-based P2P distributed compute network leveraging WebGPU and libp2p.

**Status:** Development - P2P Networking Phase 🔧

### Quick Start

```bash
cd peercompute

# Install dependencies
npm install

# Run automated tests
npm run test:auto

# Start development server
npm run dev
```

See `peercompute/README.md` for detailed documentation.

### Using PeerCompute for Multiplayer Games

The current multiplayer stack uses libp2p (relay + pubsub + presence) with Yjs state sync, wrapped by `NodeKernel`:

1) **Start the dev stack**  
   ```bash
   cd peercompute
   ./start-dev.sh
   ```  
   - Spins up the libp2p relay server and webpack dev server on `http://localhost:5173`.
   - `relay-config.json` (in `public/`) is auto-served; games fetch it.
   - **HTTPS / WebXR**: for VR on LAN you need HTTPS + WSS. Use a local cert (e.g., `mkcert`) and run:  
     ```bash
     HTTPS=1 SSL_CERT=/path/to/cert.pem SSL_KEY=/path/to/key.pem ./start-dev.sh
     ```  
     This enables `https://localhost:5173`; proxy the relay server behind WSS if your clients require secure WebSocket transport.
   - **mkcert quickstart (self-signed but trusted locally)**:  
     ```bash
     sudo apt-get install libnss3-tools         # so mkcert can trust Chrome/Chromium profiles
     cd peercompute
     mkcert -install                            # installs local CA
     mkcert -key-file certs/dev.key -cert-file certs/dev.crt 192.168.x.x localhost 127.0.0.1 ::1
     HTTPS=1 ./start-dev.sh                     # auto-picks certs/dev.* if present
     ```  
     - Trust on other devices (e.g., Meta Quest): install the mkcert root CA on the device, or use a public tunnel with a real cert. Without trust, WSS will be blocked.

2) **Initialize networking in your game** (see `games/sw2.html` or `games/cb.html`):  
   ```js
   const cfg = await fetch('/relay-config.json').then(r => r.ok ? r.json() : null).catch(() => null);
   const node = new window.NodeKernel({
     bootstrapPeers: cfg?.bootstrapPeers || [],
     enablePersistence: false,
     gameId: 'my-game',    // scope connectivity to a game
     roomId: 'lobby-1'     // scope to a room/instance
   });
   await node.initialize();
   await node.start();
   const state = node.getStateManager();
   ```

3) **Publish player state** (namespaced to avoid collisions):  
   ```js
   const ns = 'my-game';
   const myId = node.getStatus().network.peerId;
   state.writeScoped(ns, `player-${myId}`, {
     name: 'Alice',
     position: { x, y, z },
     rotation: yaw,
     color: 0xff00ff,
     ts: Date.now()
   });
   ```

4) **Listen for other players**:  
   ```js
   state.observeNamespace(ns, (value, key) => {
     if (!key.startsWith('player-')) return;
     const id = key.replace('player-', '');
     if (id === myId) return;
     // create/update remote avatar with `value`
   });
   ```

5) **Broadcast transient events** (e.g., attacks) with state keys like `attack-<peerId>` and observe similarly.  
   Filtering by `gameId`/`roomId` is handled by NetworkManager scope filters; use consistent IDs across clients to stay in the same match.

6) **Test pages**  
   - `http://localhost:5173/test-p2p.html` for quick connectivity checks.  
   - `games/sw2.html`, `games/cb.html` show end-to-end integration (desktop + mobile + VR for CB).

### Current Development Status

**Implemented:**
- ✅ NodeKernel orchestration
- ✅ StateManager with Yjs CRDT
- ✅ NetworkManager (partial - libp2p v2)
- ✅ Circuit Relay v2 server
- ✅ Automated test suite

**In Progress:**
- 🔄 P2P connectivity (critical issue - see below)
- 🔄 ComputeManager
- 🔄 PhysicsEngine

### Known Issues

**Critical: P2P Connectivity** 🔴
- Relay connections drop after ~10 seconds
- Root cause: libp2p v2 stream API changes
- See `plan/imp-log.md` for detailed investigation
- Test status: 2/3 passing (1 failing - connectivity)

## Cyberborea

Metaverse/multiplayer project utilizing PeerCompute.

## Development Documentation

Planning and implementation documentation in `plan/`:

- **imp-plan.md** - High-level implementation roadmap
- **imp-log.md** - Detailed log of implementation attempts and issues
- **crdt-libp2p-integration.md** - CRDT and libp2p integration design
- **p2p-alternatives.md** - P2P networking alternatives analysis
- **ipv6-support.md** - IPv6 support considerations

## Contributing

This is currently a development project. See individual project READMEs for specific contribution guidelines once established.

## License

TBD
