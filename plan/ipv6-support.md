# IPv6 Support in PeerCompute

## libp2p IPv6 Support

Yes, modern libp2p v3 has **full IPv6 support**. Here's the breakdown for each component:

### Core libp2p
- ✅ **Fully IPv6-ready** - libp2p is designed to be transport-agnostic and supports both IPv4 and IPv6 multiaddresses
- Uses multiaddr format that explicitly supports IPv6: `/ip6/2001:db8::1/tcp/4001`

### Installed Transports

#### 1. @libp2p/webrtc (Browser-to-Browser)
- ✅ **IPv6 Supported** - WebRTC in browsers automatically handles IPv6
- Modern browsers include both IPv4 and IPv6 ICE candidates when available
- The browser's network stack determines which IP version to use
- No special configuration needed - works automatically if the network supports IPv6

#### 2. @libp2p/websockets (Signaling/Relay)
- ✅ **IPv6 Supported** - WebSocket protocol supports both IPv4 and IPv6
- The WebSocket server must be configured to listen on IPv6
- Format: `wss://[2001:db8::1]:443/p2p`

#### 3. @libp2p/tcp (Node.js)
- ✅ **Full IPv6 Support** - Can bind to and connect via IPv6 addresses
- Requires Node.js environment (not available in browsers)
- Can listen on `::` to accept both IPv4 and IPv6 connections

### Browser Considerations

For browser-based P2P (our primary use case), IPv6 support is **automatic** through WebRTC:

**How it works:**
1. Browser generates ICE candidates including both IPv4 and IPv6 addresses
2. ICE negotiation tests connectivity via all available addresses
3. Best connection path is chosen automatically (could be IPv4, IPv6, or both)
4. Fallback to IPv4 if IPv6 is not available

**Browser Requirements:**
- Chrome, Firefox, Safari, Edge all support IPv6 in WebRTC
- No special configuration needed in our code
- STUN/TURN servers should support IPv6 for best results

### Configuration Recommendations

#### For WebRTC (Browser P2P):
```javascript
// No special IPv6 configuration needed
// Browser handles it automatically
const libp2pNode = await createLibp2p({
  transports: [webRTC()],
  // ... other config
});
```

#### For Dual-Stack (IPv4 + IPv6):
```javascript
// libp2p will automatically use both
// when creating multiaddrs:
const addresses = [
  '/ip4/0.0.0.0/tcp/4001',    // IPv4
  '/ip6/::/tcp/4001'           // IPv6
];
```

#### For STUN/TURN Servers:
```javascript
// Use IPv6-capable STUN servers
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },  // Supports both
    { urls: 'stun:[2001:4860:4860::8888]:19302' }  // Explicit IPv6
  ]
};
```

### Testing IPv6 Connectivity

To test if your implementation works with IPv6:

1. **Browser Environment:**
   - Check browser's WebRTC stats: `chrome://webrtc-internals`
   - Look for ICE candidates with `typ host` and IPv6 addresses
   - Successful connections will show in the ICE candidate pairs

2. **Network Requirements:**
   - Both peers need IPv6 connectivity
   - If only one peer has IPv6, it will fallback to IPv4
   - Some networks use IPv6 prefix delegation

3. **Common Scenarios:**
   - **Dual-stack network**: Works seamlessly, may prefer IPv6
   - **IPv6-only network**: Requires IPv6-capable STUN/TURN or direct connections
   - **IPv4-only network**: Falls back to IPv4 automatically

### Known Limitations

1. **Some ISPs/Networks:**
   - Not all ISPs provide IPv6
   - Some corporate networks block IPv6
   - Mobile networks have varying IPv6 support

2. **NAT64/DNS64:**
   - Some IPv6-only networks use NAT64 to reach IPv4 destinations
   - libp2p/WebRTC handles this automatically

3. **Firewall Configuration:**
   - IPv6 firewalls may have different rules than IPv4
   - Ensure ICE/STUN/TURN traffic is allowed for both

### Best Practices for PeerCompute

1. **Don't force IPv6 or IPv4** - Let libp2p/WebRTC choose the best path
2. **Use dual-stack STUN servers** - Provide connectivity options for all peers
3. **Test on different networks** - IPv6-only, IPv4-only, and dual-stack
4. **Monitor ICE candidate types** - Helps debug connection issues
5. **Provide fallback mechanisms** - Use relay servers if direct connection fails

### Summary

✅ **PeerCompute will support IPv6 out of the box**

The libp2p stack we installed (v3.1.2) has full IPv6 support across all transports. For browser-based P2P via WebRTC, IPv6 support is automatic and transparent - no special configuration needed. The browser and libp2p handle IPv4/IPv6 negotiation automatically, choosing the best available connection path.

**No action required** - IPv6 will work automatically when:
- The network supports IPv6
- Both peers have IPv6 connectivity
- Or it will gracefully fall back to IPv4

The implementation is **future-proof** as IPv6 adoption increases globally.

## Recent Fix Summary (2025-12-21)
- Relay now supports WSS with `RELAY_PUBLIC_HOST` so browsers can connect over HTTPS.
- Pubsub switched to floodsub for reliable discovery over the relay.
