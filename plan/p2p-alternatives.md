# P2P Networking Alternatives Analysis (Legacy)

Status: Archived. This document captures alternatives explored before the libp2p-first decision. Keep for historical reference only.

## Current Direction (Active)
- libp2p v3.x in browsers (WebRTC + WebSockets + Circuit Relay v2)
- Relay server as the bootstrap rendezvous point
- pubsubPeerDiscovery + floodsub for discovery and messaging
- PeerJS/Gun/Trystero are not part of the runtime path

## Recent Fix Summary (2025-12-21)
- Switched pubsub to floodsub (client + relay) after gossipsub failed to form a mesh over the relay.
- Confirmed relay logs show presence/state messages after the switch.

## Historical Context
At the time of this evaluation, libp2p v3.1.2 was considered old and the browser setup felt complex. We explored alternatives for faster progress. The notes below are preserved but are not recommended for the current branch.

## Archived Alternatives (Do Not Implement)

### Option 1: PeerJS (Deprecated)
**Pros:**
- Specifically designed for browser WebRTC
- Very simple API
- Handles signaling server automatically (or can self-host)
- Mature and widely used
- Fast to prototype

**Cons:**
- Less control over low-level networking
- Requires signaling server for initial connection

**Use Case Fit:** Deprecated for PeerCompute; kept for historical reference only

```javascript
// Example usage
const peer = new Peer();
const conn = peer.connect('peer-id');
conn.on('data', (data) => console.log(data));
```

---

### Option 2: Gun.js (Historical)
**Pros:**
- Built-in CRDT state synchronization
- P2P networking built-in
- Decentralized graph database
- Works seamlessly in browsers
- No central server required (can use public relay peers)

**Cons:**
- Different paradigm (graph database)
- Overkill if not using database features

**Use Case Fit:** Historical consideration for distributed state

```javascript
// Example usage
const gun = Gun(['https://relay-peer.com/gun']);
gun.get('shared-state').on((data) => console.log(data));
```

---

### Option 3: Trystero (Historical)
**Pros:**
- Modern, lightweight
- Serverless discovery options
- Simple API

**Cons:**
- Newer library (less battle-tested)
- Discovery latency in some topologies

**Use Case Fit:** Historical consideration for serverless P2P

```javascript
// Example usage
import { joinRoom } from 'trystero'
const room = joinRoom({appId: 'myapp'}, 'room1')
room.onPeerJoin(peerId => console.log(`${peerId} joined`))
```

---

### Option 4: Simple-peer + Custom Signaling (Historical)
**Pros:**
- Lightweight WebRTC wrapper
- Full control over signaling
- Well-tested

**Cons:**
- Requires custom signaling infrastructure

**Use Case Fit:** When full signaling control is required

---

### Option 5: Modern libp2p (js-libp2p 1.x+)
**Pros:**
- Most powerful and flexible
- Used by IPFS
- Supports multiple transports

**Cons:**
- Complex setup for browsers
- Larger bundle size
- Steep learning curve

**Use Case Fit:** This is the active direction (see Current Direction above)

---

## Archived Recommendations (Superseded)
- Prior suggestions to pivot to Gun.js or PeerJS are superseded by the libp2p-first decision.
- Any dependency changes or proofs-of-concept proposed here should be treated as historical notes only.
