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
