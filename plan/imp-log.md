# Implementation Log - PeerCompute P2P Connectivity Issue

Ordering: entries are oldest to newest (most recent last).

Note: entries from the temporary PeerJS branch (2025-11-21 later updates through 2025-11-23) are historical only; the current branch is libp2p-first.

## Date: 2025-11-20

### Issue
P2P connectivity tests failing - relay connections dropping after ~10 seconds, causing test failures.

### Root Cause Analysis
After extensive investigation, determined the issue is:
1. **Yamux muxer closes connections with no active streams** - libp2p's stream multiplexer (Yamux) closes connections when there are no active streams, even if the connection is needed
2. **Ping protocol creates temporary streams** - The ping service creates short-lived streams that close immediately, leaving the connection idle
3. **Circuit relay v2 timeout behavior** - WebSocket connections through circuit relay appear to have aggressive timeout/keepalive requirements

### Attempted Solutions

#### Attempt 1: Connection Manager Configuration
- Set `minConnections: 2`, `autoDial: true`, `inboundConnectionThreshold: Infinity`
- Result: **Failed** - Connections still dropped after ~10 seconds

#### Attempt 2: Ping-based Keep-Alive
- Used libp2p's ping service with 5-second intervals
- Result: **Failed** - Ping creates temporary streams that close, doesn't keep muxer active

#### Attempt 3: Custom Keep-Alive Protocol (Multiple Iterations)
- Registered `/peercompute/keepalive/1.0.0` protocol on both client and relay
- Attempted to maintain persistent bidirectional streams
- Tried various approaches:
  - Stream with periodic heartbeats (30s intervals)
  - Stream with faster heartbeats (5s intervals)  
  - Bidirectional stream reading with `for await` loops
  - Immediate heartbeat on connection + periodic heartbeats
  - Auto-reconnect logic on disconnect

Result: **Failed** - Final blocker: `stream.sink is not a function`

### Final Blocker
The libp2p v2 stream API has changed. The stream object returned by `dialProtocol()` does not have a `sink` method directly accessible. The stream handling API in libp2p v2 differs from documentation/examples, requiring:
- Different stream writing approach (not `stream.sink([data])`)
- Proper usage of libp2p v2's duplex stream API
- Potentially using `pipe()` or other stream primitives

### What Would Be Needed to Fix
1. **Research libp2p v2 stream API** - Understand the correct way to write data to streams in libp2p v2
2. **Implement proper bidirectional stream handling** - Use correct libp2p v2 stream primitives
3. **Alternative: Use libp2p's built-in connection warming** - If available in v2, use official connection keep-alive mechanisms
4. **Consider circuit relay alternatives** - May need to explore if WebRTC direct connections work better than relay

### Code Changes Made
Files modified:
- `peercompute/src/peercompute/networkManager/NetworkManager.js` - Added keep-alive protocol, connection manager settings, gossipsub subscription timing
- `peercompute/src/relay/server.js` - Added keep-alive protocol handler on relay

### Test Results
- 2 of 3 tests passing (status metrics, lifecycle)
- 1 test failing: "should initialize two nodes and test connectivity" - connections drop before 10-second mark

### Recommendations
1. Study lib p2p v2 documentation for proper stream API usage
2. Consider using it-pipe and it-length-prefixed for proper stream handling
3. May need to implement circuit relay reservation to maintain relay connections
4. Alternative: Switch to WebRTC direct connections if possible (avoiding relay entirely)

## Date: 2025-11-21

### Changes
- Updated libp2p stream handling to the v3 API (`stream.send` + async iteration) in `NetworkManager` and relay keep-alive.
- Added relay circuit announce addresses (derived from bootstrap peers) so pubsub discovery can advertise dialable `/p2p-circuit` addrs.
- Added a manual discovery heartbeat over gossipsub (JSON payload with peer id + announced addrs) as a fallback when pubsub-peer-discovery skips broadcasts.
- Surfaced bootstrap/announce info in `test-p2p.html` to aid debugging.

### Results
- Relay connections now stay up longer; keep-alive streams still occasionally reset, but reconnect logic recovers.
- Playwright connectivity test still failing: nodes stay connected only to the relay and never discover each other.
- Manual discovery broadcasts are failing with `PublishError.NoPeersSubscribedToTopic` (pubsub reports zero subscribers on the discovery topic even though the relay subscribes).
- No peer::discovery events for the other browser node; only the relay is discovered.

### Next Hypothesis / Follow-ups
- Investigate why gossipsub does not see subscribers on the discovery topic (perhaps relay subscription not propagating, or gossipsub mesh not forming over the relay).
- Verify relay keep-alive handler is using the new async iterator API (logs still show `Symbol.asyncIterator` errors from older handler).
- Consider bypassing subscriber checks by forcing publish with `allowPublishToZeroPeers` or publishing after confirming relay subscription via control messages.
- If pubsub discovery remains stuck, implement explicit circuit dialing using relay + discovered peer IDs (or a simple REST bootstrap of peer IDs + circuit addrs).

## Date: 2025-11-21 (later updates)

### Changes
- Aligned gossipsub options with canonical API: use `allowPublishToZeroTopicPeers`; add `directPeers` from bootstrap relay multiaddrs so gossipsub keeps the relay in-mesh.
- Added gossipsub subscription-change logging and delayed discovery heartbeat to give mesh time to form.
- Hardened relay keep-alive handler to accept both async iterator streams and legacy source/sink.

### Results
- Libp2p attempts still stalled discovery; mesh never formed reliably.

### Pivot (new branch)
- Gut libp2p stack and move to PeerJS for signaling/data.
- Added PeerJS dependency (pending install) and new PeerJS-based NetworkManager using BroadcastChannel for discovery and PeerJS data connections for messaging.
- Added local PeerJS server script (`src/peer-server.js`) and repurposed `start-relay-and-test.sh` to start the peer server and expose `peer-config.json`.
- Updated `test-p2p.html` to read `peer-config.json` and show PeerJS server info.
- Updated NodeKernel/StateManager wiring to drop libp2p specifics and to route Yjs sync over the new NetworkManager.

### Resolution
- Installed `peerjs`/`peer` deps.
- Implemented PeerJS-based NetworkManager + BroadcastChannel discovery; Yjs sync routed via PeerComputeProvider + state-set fallback.
- Playwright suite now passes (connectivity, status metrics, lifecycle).

### Next Steps
- Optional: serve `peer-config.json` to avoid 404 warnings in test logs (defaults already work).
- Harden PeerJS server startup for CI (currently started via `npm run dev:peer` in Playwright config).

## Date: 2025-11-22

### Changes
- Networking: added game/room scoping to PeerJS layer (handshake + discovery filtering) to support multiple games/instances. Broadcast now filters by matched room/game.
- StateManager: added scoped read/write/delete and namespace observers; improved remote state-set handling and fallback broadcast.
- New Playwright test (`p2p-room-isolation.spec.js`) verifies nodes in different rooms do not connect.
- Sneaky Woods demo rewritten to use PeerCompute/PeerJS: room-select UI, state stored under `sneakywoods` namespace, shared player positions with heartbeat pruning, top-down canvas renderer.
- Dev tooling: `start-dev.sh` now starts PeerJS server + webpack; default `peer-config.json` added to `public/`.

### Results
- Playwright suite passes (including new room isolation test). State sync works in-game via Yjs + state-set fallback.
- Room/game isolation confirmed by handshake gate; discovery only dials matching room/game.

### Sneaky Woods (sw2.html) Integration
- Adapted the 3D Sneaky Woods game to use PeerCompute/PeerJS with a single global match (gameId: sneakywoods, roomId: global).
- Player state (name/position/rotation/color) syncs via StateManager scoped namespace `sw2`; users can update their name anytime.
- Removed fake P2P simulation; attacks remain local-only for now. Gameplay otherwise intact.

### Follow-ups
- Add teardown/TTL cleanup for player entries on shutdown to reduce stale entries further.
- Consider richer game state channels (actions/events) and replication frequency controls before scaling to overworld/instance hopping.

### Time Spent
Approximately 3-4 hours of iterative debugging and implementation attempts.

## Date: 2025-11-23

### Changes
- Fixed runtime gaps in `games/sw2.html`: defined `broadcastPosition`, added attack broadcast stub, removed unused peer movement simulation, and wired `log` helper to avoid ReferenceError.
- Added player naming UI wiring (enter name + update button) that republishes presence through the PeerCompute state layer; HUD now shows peer names.
- Added stale-peer pruning and throttled position heartbeats (single global match, room `global`, game `sneakywoods`).
- Synced the updated `sw2.html` into the root `games/` copies to avoid drift between served and checked-in assets.

### Tests
- Attempted `npm test -- tests/p2p-room-isolation.spec.js`; dev server failed to bind to localhost:5173/9000 in the sandbox (`EPERM`), so the suite did not run. No additional automated results.

### Follow-up (same day)
- Fixed cross-browser discovery: enabled `allow_discovery` on the PeerJS server and added `listAllPeers` polling in NetworkManager so remote browsers can find each other (BroadcastChannel only worked per-device).
- Restored continuous state heartbeats in `sw2.html` (requestAnimationFrame loop) and removed redundant per-frame broadcast call to avoid duplicate scheduling.
- Added peer spotlights and replicated attacks via shared state in `sw2.html` so other players' flashlights render and attacks trigger remote hits/respawns.
- Enhanced sw2 demo: peer spotlights now cast shadows and only enable on movement/attacks; added name labels above players; synced score/killstreak across peers with a shared high-score HUD and death resets.
- World parity + UX tweaks: deterministic terrain generation via per-cell seeded RNG, reduced/hid self nameplates (smaller labels for others only), shadows remain, and spawning now favors periphery near existing players.
- Added peer movement smoothing (lerp position/rotation) to reduce jerkiness between network updates.
- Added player color picker; color syncs via state so remote players display the chosen cube tint.
- Color rendering improved: we apply color (including emissive) to self immediately and to peers on receipt so hues are visible even without a flashlight.
- Added inactivity safeguards: background heartbeat keeps presence/position updating when the tab is hidden, and the render loop skips heavy work while hidden to reduce performance impact from throttled tabs.
- Began Hyperborea (cb.html) multiplayer refactor: added PeerCompute hookup (gameId cb/global), broadcast/receive player transforms and avatar meshes, softened renderer shadow type, skipped heavy color/shadow updates when tab is hidden, and synced chunk copy.
- Fixed cb.html WebXR black screen: replaced broken VRButton with minimal XR-safe version and moved render loop to `renderer.setAnimationLoop` (XR-friendly) instead of nested requestAnimationFrame.
- Added spear combat to cb: desktop (LMB/Ctrl) + mobile attack button, VR spear on controller grip with continuous collision; spear tip hitboxes broadcast kills via state (`attack-*`) and victims respawn near other players.

## Date: 2025-11-23 (presence cleanup follow-up)

### Changes
- Added timestamped presence heartbeats for Hyperborea (`games/cb.html` + synced root copy) so peers stay discoverable while the tab is hidden.
- Added stale-peer pruning (10s idle) and teardown of heartbeat/cleanup listeners on unload so orphaned avatars get removed promptly.

### Tests
- Not run (browser-only change; sandbox still blocks binding dev ports for Playwright).

## Date: 2025-11-23 (time sync)

### Changes
- Added cross-peer time sync in `games/cb.html`: any peer adjusting speed (+=/-= keys) broadcasts the time multiplier + current world time; other peers apply the remote time anchor to keep day/season progression in lockstep.
- Added `/peer-config.json` back under `peercompute/public/` to avoid 404s when fetching config over LAN/HTTPS; game still falls back to host/protocol if missing.

### Tests
- Not run (manual browser validation required).

## Date: 2025-11-23 (evented state sync)

### Changes
- Switched Hyperborea player updates to event-based state sync with movement/rotation thresholds and a keepalive: peers now emit `evt-<peerId>` packets only when moving, turning, color-changing, or after 1.5s idle, reducing traffic. Presence is still mirrored onto `player-<peerId>` for late joiners/stale-prune.

### Tests
- Not run (manual browser validation required).

## Date: 2025-11-23 (LOD zones)

### Changes
- Added distance-based terrain/tree LOD in `games/cb.html`: far chunks render coarse terrain only, medium chunks use slimmer terrain/3-sided trees, and close chunks keep the full detail plus 6-sided trees. Trees now live in two instanced mesh layers so each zone can use the appropriate geometry while removal/regen still hides the right indices.

### Tests
- Not run (visual check in browser recommended).

## Date: 2025-11-26

### Changes
- Pivoted back to libp2p: replaced PeerJS NetworkManager with libp2p pubsub/presence transport.
- Updated relay config flow (`relay-config.json`) and dev/test scripts to start the libp2p relay.
- Refreshed docs/tests to remove PeerJS references.

### Results
- Libp2p stack is the single supported networking path; PeerJS is no longer used.
- Note: Older log entries below reference PeerJS; those are historical and no longer reflect the current architecture.

## Date: 2025-12-21

### Changes
- Aligned plan/log docs to the libp2p-first direction; marked CRDT/alternatives docs as legacy.
- Updated Playwright webServer to use `start-dev.sh` with `HTTPS=0` for relay + config in tests.
- Added `DEV_HOST=127.0.0.1` for Playwright to avoid EPERM bind on 0.0.0.0.
- Added `USE_EXISTING_SERVER` support to reuse a running dev server in Playwright.
- Made `start-dev.sh` respect HTTPS overrides so tests can run on HTTP.
- Set `SKIP_RELAY=1` for `test:auto` so Playwright reuses the relay started by the script.
- Extended relay address polling in `start-relay-and-test.sh` for more reliable config generation.
- Reuse running relay log to generate `relay-config.json` when the PID already exists.
- Fixed relay address logging to avoid double `/p2p/` segments in bootstrap multiaddrs.
- Added relay listen/public host overrides (`RELAY_LISTEN_HOST`, `RELAY_PUBLIC_HOST`) for LAN testing.
- Added `@libp2p/ping` dependency for NetworkManager/relay.
- Normalized bootstrap multiaddrs and parsed them before dialing to avoid `getComponents` errors.
- Updated gossipsub config to allow publishing when zero peers are subscribed.
- Prevented `start-relay-and-test.sh` from stopping relays it did not start and added dev-server reuse detection.
- Switched relay address polling loops to `seq` so running scripts via `sh` still waits correctly.
- Added browser listen addrs (`/p2p-circuit`, `/webrtc`) and a local-dial override in NetworkManager to match the libp2p browser example.

### Results
- Dev/test flow starts relay + dev server with `relay-config.json` (pending verification).
- Build no longer fails on missing `@libp2p/ping` once installed.
- Playwright connectivity test failed with `multiaddrs[0].getComponents is not a function` and 0 connections; relay config contained a double `/p2p/` segment. Fixed relay address logging to avoid duplicate segments.

### Tests
- `npm run test:auto` (host) ran 4 tests; 1 failed (connectivity), 3 passed.
- `npm run test:auto` with `start-dev.sh` already running failed with EADDRINUSE on 127.0.0.1:5173.
- `npm run test:auto` (sandbox) failed: relay server could not bind to 127.0.0.1 (EPERM) and webpack-dev-server could not bind to 127.0.0.1:5173 (EPERM).

## Date: 2025-12-21 (libp2p relay recovery + floodsub pivot + time anchor)

### Starting symptoms
- Playwright connectivity test and manual cb sessions showed peers connecting to the relay but never seeing each other.
- Console warnings: `PublishError.NoPeersSubscribedToTopic`, `multiaddrs[0].getComponents is not a function`, and mixed-content blocks when HTTPS pages tried to dial `ws://`.
- Relay logs showed peer connects/disconnects but no pubsub messages.

### What we tried (in order)
1. **Bootstrap multiaddr cleanup**
   - Fixed double `/p2p/<peerId>` segments in relay address logging.
   - Normalized bootstrap multiaddrs before dialing; added `toMultiaddr` guards.
   - Added `@libp2p/ping` and later `@libp2p/peer-id` deps to satisfy the refactored NetworkManager.
2. **Browser relay dial parity**
   - Allowed local dial addresses in the browser to match the example.
   - Ensured browser nodes listen on `/p2p-circuit` and `/webrtc`.
   - Disabled `abortConnectionOnPingFailure` to avoid relay churn.
3. **WSS + LAN relay**
   - Added WSS support to the Node.js relay with `SSL_CERT`/`SSL_KEY`.
   - Added `RELAY_PUBLIC_HOST`/`RELAY_LISTEN_HOST` so the relay advertises the LAN IP.
   - Updated `start-dev.sh`/`start-relay-and-test.sh` to write `relay-config.json` from the relay log.
   - This fixed mixed-content failures (HTTPS pages can dial WSS).
4. **Gossipsub tuning**
   - Set `allowPublishToZeroTopicPeers` and `runOnLimitedConnection`.
   - Added `directPeers` from bootstrap multiaddrs and enabled flood publishing.
   - Added pubsub health logs to confirm mesh formation.
   - Outcome: gossipsub still reported no peers/subscribers and no announce addrs.
5. **Pivot to floodsub (match working example)**
   - Switched pubsub to `@libp2p/floodsub` on both client and relay.
   - Updated the legacy Deno relay to match for completeness.
   - Relay logs immediately showed discovery + presence + state messages.
6. **Time sync anchor in cb**
   - Added a time anchor (`TIME_ANCHOR_KEY`) that selects the first-joiner by `joinedAt`.
   - Only the anchor can broadcast time updates; others adopt it.
   - Anchor reasserts if a later peer tries to override.

### What ultimately worked
- Floodsub + WSS relay resolved pubsub visibility; peers discovered each other and state sync flowed.
- First-joiner time anchor kept day/season progression consistent across peers.

### Evidence
- `logs/relay-server-dev.log` now shows discovery + presence + state messages.
- Browser consoles show peer connections and stable state sync after floodsub switch.

### Tests
- Manual validation with `RELAY_PUBLIC_HOST=192.168.1.174 sh start-dev.sh` + two cb tabs.
- Playwright still blocked in sandbox (Chromium EPERM/report port bind).
