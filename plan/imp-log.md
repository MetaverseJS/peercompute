# Implementation Log - PeerCompute P2P Connectivity Issue

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

###Recommendations
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

### Time Spent
Approximately 3-4 hours of iterative debugging and implementation attempts.
