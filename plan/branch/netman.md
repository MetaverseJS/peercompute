Instructions: This file contains short term goals for the current branch. 

## Branch Goals

### Completed:
- libp2p-only networking with relay bootstrap + floodsub.
- Relay config flow for dev/test; WSS support.
- NetworkScheduler core + unit tests; clock policy scaffolding.
- Room isolation and time sync anchor in cb.

### TODO:
- Re-run Playwright suite outside sandbox and record results in plan/log.md.
- Verify time sync anchor stability after reconnects.
- Confirm dev/test scripts work in a clean env and update docs if needed.
- Resume ComputeManager work once P2P stack is stable.
- Document and implement layered DataState (hot/warm/cold) and commit deltas.
- Add GPU hub ownership notes (main thread) and isolated compute worker path.

### TODONT:
- Compute/physics feature work.
- CRDT format redesign or y-libp2p reintroduction.
- New topology modes beyond relay + pubsub.

## Scope:
- NetworkManager scheduler, relay keepalive/config, dev/test scripts, docs/log alignment.

## Constraints:
- Keep bootstrapPeers and pubsub topic conventions stable.
- Keep NodeKernel/StateManager APIs stable for games/tests.

## Focus Files:
- peercompute/src/peercompute/networkManager/NetworkManager.js
- peercompute/src/peercompute/networkManager/NetworkScheduler.js
- peercompute/src/relay/server.js
- peercompute/start-dev.sh
- peercompute/start-relay-and-test.sh

## Risks:
- Pubsub mesh stalls over relay; HTTP/WSS mismatches.
- Sandbox/CI restrictions blocking Playwright.
- Presence-only discovery can mask pubsub failures.

## Open Questions:
- Keepalive strategy: ping-only vs a dedicated stream if disconnects return?

## Validation:
- npm run test:auto (relay + Playwright).
- npm test after HTTPS=0 ./start-dev.sh.
- Manual: load test-p2p.html in a browser, start two nodes, verify peer presence.
