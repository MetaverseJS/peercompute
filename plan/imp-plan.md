# PeerCompute Project Status & Next Steps (libp2p-first)

## Current Status
- libp2p-first stack (v3.1.2) with relay bootstrap + floodsub + pubsubPeerDiscovery
- Webpack 5 browser client + Node.js relay server (WSS supported)
- State sync via Yjs + PeerComputeProvider (custom, no y-libp2p dependency)
- NodeKernel/StateManager/NetworkManager wiring in place
- cb time sync anchored to first-join peer
- PeerJS is not part of the runtime path

## Known Issues / Blockers
- Playwright tests blocked in sandbox (Chromium EPERM + report port bind).
- WSS relay requires valid certs; ensure local trust or use HTTP for tests.

## Architecture Summary
1. NodeKernel orchestrates NetworkManager + StateManager + ComputeManager.
2. Browser node dials the relay (WebSocket), subscribes to the discovery topic, and announces via pubsub.
3. Peers dial each other via the relay (`/p2p-circuit`) and exchange pubsub messages (floodsub).
4. Yjs updates broadcast through PeerComputeProvider.

## Immediate Next Steps
1. Re-run Playwright suite and update `plan/imp-log.md` (may require non-sandboxed env).
2. Verify cb time sync anchor in multi-peer session after reconnects.
3. Resume ComputeManager implementation after P2P is stable.

## Reference
- `plan/imp-log.md` for the chronological investigation log.
