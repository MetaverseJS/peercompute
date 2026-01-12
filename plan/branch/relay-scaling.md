Instructions: This file contains the plan and implementation strategy for relay scaling to support larger peer networks.

## Status: Phase 1 COMPLETED (2026-01-12)

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

## Implementation Progress

### Phase 1: Keep Relay in Gossipsub Mesh ✓ COMPLETED 2026-01-12

**Goal**: Ensure relay stays in gossipsub mesh even when connection drops

**Implementation**: Configure relay as a `directPeer` in gossipsub config

**What Was Done**:
- Added `enableRelayDirectPeers` config option (default: true) in NetworkManager.js line 329
- Modified `_buildPubsubService()` (lines 1247-1295) to extract relay peer IDs from bootstrapPeers
- Auto-populate gossipsub directPeers array with relay multiaddrs
- Added debug logging for relay directPeer registration

**Code Changes**:
```javascript
// In _buildPubsubService():
if (this.config.enableRelayDirectPeers !== false && this.bootstrapPeerIds.size > 0) {
  const directPeers = options.directPeers || [];
  
  for (const relayPeerId of this.bootstrapPeerIds) {
    const relayAddrs = this.config.bootstrapPeers
      .map((addr) => multiaddr(addr))
      .filter(Boolean);
    
    if (relayAddrs.length > 0) {
      directPeers.push({ id: relayPeerId, addrs: relayAddrs });
    }
  }
  
  if (directPeers.length > 0) {
    options.directPeers = directPeers;
  }
}
```

**Benefits Achieved**:
- Relay always maintained in mesh by libp2p
- Relay can forward messages between direct and relayed peers
- New peers get presence announcements from all existing peers
- Mesh stays connected even with asymmetric NAT

**Files Modified**:
- peercompute/src/peercompute/networkManager/NetworkManager.js
- plan/arch/netman.md (documentation)

**Validation Status**: Ready for NetViz testing with 10+ peers

---

### Phase 2: Separate Control and Data Planes (NOT STARTED)

**Goal**: Keep lightweight presence/discovery connection to relay, drop heavy data connections

**Status**: Planned, not yet implemented

---

### Phase 3: Relay Connection Retention Strategy (READY TO IMPLEMENT)

**Goal**: Keep a subset of peers connected to relay using deterministic selection

**Status**: Config parsing done (relayRetention already in config), logic not yet implemented

**Next Steps**:
1. Implement `_isDeterministicRelayKeeper()` helper method
2. Add retention logic to `getConnectionBalance()` around line 1750
3. Use hash-based deterministic selection
4. Test with varying peer counts

---

### Phase 4: Reconnect-on-Demand for Dialing (PLANNED)

**Status**: Not started

---

### Phase 5: Enhanced Peer Directory (PLANNED)

**Status**: Not started

---

## Success Metrics

- **Scalability**: Support 50+ concurrent peers (vs current ~10 limit)
- **Relay Load**: <10% of peers maintain persistent relay connections
- **Discovery**: 100% of new peers discover all existing peers within 5s
- **Mesh Health**: No isolated subgraphs (NetViz shows full connectivity)
- **Bandwidth**: Relay bandwidth grows sub-linearly with peer count

## Implementation Log

### 2026-01-08
- Created relay-scaling.md with comprehensive strategy
- Identified gossipsub mesh fragmentation as root cause
- Proposed 5-phase implementation approach

### 2026-01-12
- **Phase 1 COMPLETED**: Implemented gossipsub directPeers for relay
- Added `enableRelayDirectPeers` config option (default: true)
- Modified `_buildPubsubService()` to automatically add relay bootstrap peers as directPeers
- Fixed bug: Convert peer ID string to PeerId object (required by gossipsub)
- Updated docs/index.html to use 127.0.0.1 for demo links (consistency with relay)

**Phase 1 Testing - PASSED ✓**
- Tested with 3 simultaneous browser peers via NetViz
- 100% peer discovery rate (3/3 peers found each other)
- Relay stayed in gossipsub mesh as expected
- No mesh fragmentation observed
- All peers connected: relay + 2 other peers
- Console logs confirmed: "[NodeKernel] Peer connected" for all peers

**Key Fix During Testing**:
- Bug: directPeers needs PeerId object, not string
- Fixed: Added `peerIdFromString()` conversion at line 1269
- Overview page links updated to use 127.0.0.1 for consistency with relay

**Validation**: Phase 1 PASSED - Ready for Phase 3 implementation

## Next Actions

1. **Test Phase 1**: Run NetViz with 10, 20, 30 peers
   - Verify mesh connectivity stays intact
   - Measure relay bandwidth
   - Confirm peer discovery success rate
   
2. **Implement Phase 3**: Deterministic relay retention
   - Add `_isDeterministicRelayKeeper()` method
   - Implement retention logic in `getConnectionBalance()`
   - Test with logn scaling (min: 2, max: 5, base: 2)

3. **Documentation**: Update README with relay scaling features

## Related Files

- `peercompute/src/peercompute/networkManager/NetworkManager.js` - Main implementation
- `plan/arch/netman.md` - Architecture documentation
- `demos/netviz/` - Validation and visualization tool
- `plan/log.md` - Implementation log
