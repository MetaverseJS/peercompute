Sneaky Woods integration notes:
- Reference: games/sw2.html (full 3D variant)
- Multiplayer path: Use PeerCompute (libp2p) with gameId: 'sneakywoods' and roomId configurable per match/instance.
- State sync: Use StateManager scoped namespace 'sneakywoods' to store current match state (players, positions, actions). Keep Yjs for eventual CRDT safety and send lightweight state-set messages as a fallback for non-CRDT consumers.
- Networking: Room/game scoping already in place; ensure presence filters reject mismatched rooms/games.
- Testing: Playwright room isolation already passes; main connectivity tests cover base layer.

Hyperborea (cb.html) integration notes:
- Pubsub runs on libp2p floodsub (client + relay) for reliable relay-based discovery.
- Time sync is anchored to the first peer to join (TIME_ANCHOR_KEY); late joiners adopt the anchor.
