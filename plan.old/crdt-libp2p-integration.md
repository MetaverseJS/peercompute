# CRDT and libp2p Integration Analysis (Legacy)

Status: Archived. This document reflects an earlier exploration of y-libp2p. The current stack uses Yjs + PeerComputeProvider over libp2p floodsub. Keep for historical context only.

## Current Direction (Active)
- Yjs + `PeerComputeProvider` (custom) in `peercompute/src/peercompute/stateManager/PeerComputeProvider.js`
- NetworkManager publishes Yjs updates over floodsub topics
- No y-libp2p dependency in the runtime path

## Recent Fix Summary (2025-12-21)
- Switched pubsub from gossipsub to floodsub to match the working browser example.
- Relay and clients now exchange presence/state messages reliably over the relay.

## Historical Notes (y-libp2p exploration)

### libp2p-crdt-synchronizer Status
The package `libp2p-crdt-synchronizer` does not exist in the npm registry.

### Option Considered: Yjs with y-libp2p (Historical)
We already have Yjs installed. We previously considered adding `y-libp2p` as a connector:

```bash
npm install y-libp2p
```

```javascript
import * as Y from 'yjs';
import { createLibp2p } from 'libp2p';
import { Libp2pProvider } from 'y-libp2p';

const ydoc = new Y.Doc();
const libp2pNode = await createLibp2p({...});
const provider = new Libp2pProvider(libp2pNode, ydoc, {
  topic: 'my-shared-doc'
});
```

**Why this was deprecated:** We replaced it with a custom `PeerComputeProvider` to avoid compatibility issues and to keep the integration in our control.

### Other Options Considered (Historical)
- orbit-db (IPFS/Helia-based, heavier)
- ipfs-log / custom CRDT
- Automerge + custom libp2p connector

These alternatives are preserved here for context only and should not be used for the current branch.
