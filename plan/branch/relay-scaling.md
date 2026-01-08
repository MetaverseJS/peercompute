Instructions: This file contains the plan and implementation strategy for relay scaling to support larger peer networks.

## Branch Goal

Enable the network to scale beyond 10-20 peers by allowing most peers to drop their relay connection after establishing direct WebRTC links, while maintaining mesh connectivity and peer discovery for NAT-restricted peers.

## Problem Analysis

### The Core Issue: Gossipsub Mesh Fragmentation

When peers drop their relay connection completely (via `dropRelayOnDirect`), they create several problems:

1. **Pubsub Mesh Dependencies**: Dropping relay means completely disconnecting from relay's pubsub mesh
2. **NAT Asymmetry**: Direct-capable peers (symmetric NAT) drop relay, while strict NAT peers remain isolated
3. **Discovery Breakdown**: New peers dial relay but can't discover existing peers who dropped it because:
   - Those peers aren't advertising addresses through relay anymore
   - Presence messages don't reach them (no pubsub path)
   - Relay can't forward their info (they're not in its connection list)

### Failure Mode Example
```
Initial state: A↔R↔B↔R↔C (all through relay R)
After direct:  A↔B (direct), C↔R (relay, strict NAT)

A and B drop R completely → gossipsub mesh:
- A and B can communicate (direct pubsub)
- C can only talk to R
- R can't forward A/B messages to C (A/B not subscribed to R anymore)
- New peer D joins → only sees C, never discovers A or B
```

The relay becomes a **one-way door** - new peers enter but can't find existing peers who left.

## Implementation Strategy

### Phase 1: Keep Relay in Gossipsub Mesh (Immediate Priority)

**Goal**: Ensure relay stays in gossipsub mesh even when connection drops

**Approach**: Configure relay as a `directPeer` in gossipsub config

**Benefits**:
- Relay always maintained in mesh
- Relay can forward messages between direct and relayed peers
- New peers get presence announcements from all existing peers
- Mesh stays connected even with asymmetric NAT

**Implementation**:
```javascript
// In NetworkManager.js around line 605
const gossipsubConfig = this.config.gossipsub || {};
const relayPeerId = this.bootstrapPeerIds.values().next().value;
if (relayPeerId && gossipsubConfig) {
  gossipsubConfig.directPeers = [
    ...(gossipsubConfig.directPeers || []),
    {
      id: relayPeerId,
      addrs: this.config.bootstrapPeers
    }
  ];
}
```

**Files to Touch**:
- `peercompute/src/peercompute/networkManager/NetworkManager.js`
- Demo relay configs (test with NetViz first)

**Validation**:
- Use NetViz to verify mesh stays connected as peers join/drop
- Test with 10+ peers where some drop relay
- Verify new peers can discover all existing peers

---

### Phase 2: Separate Control and Data Planes

**Goal**: Keep lightweight presence/discovery connection to relay, drop heavy data connections

**Approach**: Use dedicated topics for different traffic types with different relay policies

**Topic Strategy**:
- `pc.presence`: Always through relay (lightweight, critical for discovery)
- `pc.snapshots`: Prefer direct (heavy bandwidth, can skip relay)
- `pc.commands`: Prefer direct (medium bandwidth)
- `pc.events`: Reliable delivery, prefer direct but fall back to relay

**Implementation Considerations**:
- Requires topic-level connection preferences
- May need separate pubsub subscriptions with different mesh policies
- Could use libp2p streams for direct-only traffic

**Benefits**:
- Relay handles discovery/coordination overhead only
- Bulk data bypasses relay
- Network scales without overwhelming relay bandwidth

---

### Phase 3: Relay Connection Retention Strategy (High Priority)

**Goal**: Keep a subset of peers connected to relay using deterministic selection

**Approach**: Implement `relayRetention` policy (already scaffolded in code!)

**Configuration Options** (from normalizeRelayRetention at line 130-146):
```javascript
relayRetention: {
  mode: 'logn',  // 'logn', 'sqrt', or custom
  min: 2,        // Always keep at least 2 peers connected to relay
  max: 5,        // Never more than 5
  base: 2        // Log base for 'logn' mode
}
```

**Scaling Behavior**:
| Network Size | logn (base 2) | sqrt | min/max bounds |
|--------------|---------------|------|----------------|
| 4 peers      | 2             | 2    | 2 (min)        |
| 8 peers      | 3             | 2.8  | 3              |
| 16 peers     | 4             | 4    | 4              |
| 32 peers     | 5             | 5.6  | 5 (max)        |
| 64 peers     | 6             | 8    | 5 (max)        |

**Deterministic Selection**:
- Use hash(peerId) % totalPeers to select which peers keep relay
- Same peers consistently maintain relay connections
- Provides stable "bridge nodes" for NAT-restricted peers

**Implementation**:
```javascript
// In getConnectionBalance() around line 1750
const retention = this.getRelayRetention();
if (retention && retention.min > 0) {
  const peerCount = connected.length;
  let keepRelayCount = retention.min;

  if (retention.mode === 'logn') {
    keepRelayCount = Math.max(retention.min,
      Math.min(retention.max || Infinity,
        Math.floor(Math.log(peerCount) / Math.log(retention.base || 2))
      )
    );
  } else if (retention.mode === 'sqrt') {
    keepRelayCount = Math.max(retention.min,
      Math.min(retention.max || Infinity,
        Math.floor(Math.sqrt(peerCount))
      )
    );
  }

  // Deterministically select peers to keep relay connection
  const shouldKeepRelay = this._isDeterministicRelayKeeper(peerCount, keepRelayCount);
  if (shouldKeepRelay) {
    protectedIds.add(relayPeerId);
  }
}

// Helper method
_isDeterministicRelayKeeper(totalPeers, keepCount) {
  if (!this.peerId) return false;
  const hash = hashString(this.peerId);
  const slot = hash % totalPeers;
  return slot < keepCount;
}
```

**Files to Touch**:
- `peercompute/src/peercompute/networkManager/NetworkManager.js` (implement retention logic)
- Demo relay configs (add relayRetention settings)

**Validation**:
- NetViz should show consistent subset maintaining relay connections
- New peers should discover all existing peers
- Network should handle 50+ peers without relay overload

---

### Phase 4: Reconnect-on-Demand for Dialing

**Goal**: Peers temporarily reconnect to relay when needed to help new peers establish connections

**Approach**: Monitor peer discovery and reconnect to relay on-demand

**Flow**:
1. Peer drops relay after achieving target connections
2. New peer joins and broadcasts presence via relay
3. Existing peer receives presence announcement
4. Existing peer temporarily dials relay
5. WebRTC connection established with new peer
6. Existing peer drops relay again after 5s

**Implementation**:
```javascript
// In _handlePresenceMessage or peer:discovery event
async _handleNewPeerNeedsRelay(newPeerId) {
  const isConnectedToRelay = this._hasRelayConnection();
  const needsBridge = await this._peerNeedsRelayBridge(newPeerId);

  if (needsBridge && !isConnectedToRelay) {
    debugLog('[NetworkManager] Temporarily reconnecting to relay to help', newPeerId);
    await this._dialBootstrapPeers();

    // Give time for WebRTC to establish
    setTimeout(() => {
      this._maybePruneRelayConnections(relayPeerId);
    }, 5000);
  }
}
```

**Challenges**:
- Determining when a peer "needs" relay assistance
- Coordinating multiple peers reconnecting simultaneously
- Preventing thrashing (connect/disconnect cycles)

**Benefits**:
- Ensures new peers can always establish connections
- Minimizes relay connection overhead
- Network self-heals around relay

---

### Phase 5: Enhanced Peer Directory

**Goal**: Relay maintains authoritative peer address directory, reducing dependency for subsequent connections

**Approach**: Relay periodically broadcasts peer address snapshots

**Implementation**:
1. Relay tracks all peer addresses it observes
2. Every 30s, relay publishes `peer-directory` message with recent addresses
3. Peers cache addresses in peerStore
4. When dialing, try cached addresses before falling back to relay

**Benefits**:
- Peers can dial each other without relay coordination
- Reduces relay traffic for reconnections
- More resilient to relay failures

**Relay-side**:
```javascript
// In relay/server.js
setInterval(() => {
  const directory = Array.from(observedPeers.entries()).map(([peerId, addrs]) => ({
    peerId,
    addrs: addrs.slice(0, 5) // Limit to 5 most recent
  }));

  await pubsub.publish('peercompute-directory', JSON.stringify(directory));
}, 30000);
```

**Client-side**:
```javascript
// In NetworkManager.js
this.libp2p.services.pubsub.subscribe('peercompute-directory');
this.libp2p.services.pubsub.addEventListener('message', (evt) => {
  if (evt.detail.topic === 'peercompute-directory') {
    const directory = JSON.parse(decoder.decode(evt.detail.data));
    directory.forEach(({ peerId, addrs }) => {
      this._rememberPeerAddresses(peerId, addrs);
    });
  }
});
```

---

## Recommended Implementation Order

### Immediate (Week 1)
1. **Phase 1**: Configure gossipsub directPeers for relay
2. **Phase 3**: Implement relayRetention with logn strategy (min: 2, max: 5)
3. **Validation**: Test with NetViz at 10, 20, 30 peers

### Short-term (Week 2-3)
4. **Phase 2**: Separate control/data topics (presence vs snapshots)
5. **Phase 4**: Reconnect-on-demand prototype
6. **Validation**: Load test with 50+ peers, measure relay bandwidth

### Long-term (Week 4+)
7. **Phase 5**: Enhanced peer directory
8. **Optimization**: Tune retention parameters based on real usage
9. **Documentation**: Update plan/arch/netman.md with relay scaling patterns

---

## Success Metrics

- **Scalability**: Support 50+ concurrent peers (vs current ~10 limit)
- **Relay Load**: <10% of peers maintain persistent relay connections
- **Discovery**: 100% of new peers discover all existing peers within 5s
- **Mesh Health**: No isolated subgraphs (NetViz shows full connectivity)
- **Bandwidth**: Relay bandwidth grows sub-linearly with peer count

---

## Open Questions

1. **Gossipsub directPeers limitations**: Does libp2p support dynamic directPeer updates?
2. **Multi-relay support**: Should we support multiple relay servers with load balancing?
3. **NAT detection**: Can we automatically detect which peers need relay retention?
4. **Topic sharding**: Should we implement topic-level sharding for very large networks (100+ peers)?
5. **Relay selection**: For reconnect-on-demand, should we prefer geographic proximity or load balance?

---

## Risks & Mitigations

**Risk**: Gossipsub directPeers may not work as expected with circuit relay
- **Mitigation**: Test early, fall back to Phase 3 only if Phase 1 fails

**Risk**: Deterministic relay keeper selection creates hotspots
- **Mitigation**: Rotate keeper set periodically (every 5-10 minutes)

**Risk**: Reconnect-on-demand creates connection storms
- **Mitigation**: Add jitter and exponential backoff to reconnect attempts

**Risk**: Phase 2 topic separation breaks existing demos
- **Mitigation**: Make it opt-in, keep backward compatibility

---

## Related Files

- `peercompute/src/peercompute/networkManager/NetworkManager.js` - Main implementation
- `peercompute/src/peercompute/networkManager/TopologyController.js` - Peer selection logic
- `peercompute/src/relay/server.js` - Node.js relay (for directory feature)
- `peercompute/src/relay-go/main.go` - Go relay (for directory feature)
- `demos/netviz/` - Validation and visualization tool
- `plan/arch/netman.md` - Architecture documentation to update

---

## Log Entries

### 2026-01-08
- Created relay-scaling.md with comprehensive strategy
- Identified gossipsub mesh fragmentation as root cause
- Proposed 5-phase implementation approach
- Prioritized Phase 1 (directPeers) + Phase 3 (retention) for immediate work
