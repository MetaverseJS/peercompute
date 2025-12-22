# Plan

Finalize the libp2p-first stack by making the dev/test workflow reliable, documenting the current libp2p architecture, and clearing legacy PeerJS/CRDT detours. Keep NodeKernel/StateManager APIs stable and focus on relay-based discovery + pubsub messaging. See `plan/netman.md` for the NetworkManager scheduler spec + plan.

## Requirements
- libp2p-only networking (relay bootstrap + pubsub discovery + floodsub messaging).
- Keep NodeKernel/StateManager APIs stable for games and tests.
- Relay-config flow works in dev/test (browser fetchable).
- Plan/log docs reflect the libp2p-first direction and current stack.
- Time sync in cb should follow the first peer to join (anchor) and propagate to late joiners.

## Scope
- In: NetworkManager/relay keepalive deps, dev/test scripts, Playwright config, plan/log alignment.
- Out: Compute/physics feature work, CRDT format redesign, new topology modes.

## Files and entry points
- `peercompute/src/peercompute/networkManager/NetworkManager.js`
- `peercompute/src/relay/server.js`
- `peercompute/src/peercompute/stateManager/StateManager.js`
- `peercompute/playwright.config.js`
- `peercompute/start-dev.sh`
- `peercompute/start-relay-and-test.sh`
- `peercompute/package.json`
- `plan/netman.md`
- `plan/*.md`

## Data model / API changes
- None expected; keep `bootstrapPeers` and pubsub topic conventions stable.

## Action items
[x] Mark legacy plan docs (CRDT + alternatives) and sync plan/logs to libp2p-first direction.
[x] Fix missing libp2p ping dependency and verify relay keepalive service compiles.
[x] Ensure dev/test server path serves `relay-config.json` for Playwright.
[x] Update Playwright webServer command to start relay + dev server on HTTP.
[x] Normalize bootstrap multiaddrs before dialing and allow publish-to-zero in gossipsub.
[x] Allow Playwright to reuse an existing dev server when start-dev is already running.
[x] Align browser libp2p config with example (local dial allowed, listen on `/p2p-circuit` + `/webrtc`).
[x] Restart relay and verify bootstrap multiaddr is valid (single `/p2p/<peerId>` segment).
[x] Switch pubsub to floodsub (client + relay) to match the working browser example.
[x] Add first-joiner time anchor logic for cb time sync.
[x] Draft NetworkManager scheduler spec + plan (`plan/netman.md`).
[ ] Re-run Playwright suite and record results in `plan/imp-log.md` (blocked by sandbox EPERM).

## Testing and validation
- `npm run test:auto` (relay + Playwright)
- `npm test` (Playwright) after `HTTPS=0 ./start-dev.sh`
- Manual: open `test-p2p.html`, start two nodes, verify peer presence.

## Risks and edge cases
- Pubsub mesh formation over relay can still stall; presence-only discovery may mask failures.
- HTTPS dev server + ws relay mismatch can block local testing.

## Open questions
- Relay keepalive: keep ping only, or reintroduce a dedicated keepalive stream if we see disconnects again?
