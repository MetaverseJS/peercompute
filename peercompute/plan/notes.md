Sneaky Woods integration notes:
- Reference: games/sw2.html (full 3D variant)
- Multiplayer path: Use PeerCompute (PeerJS) with gameId: 'sneakywoods' and roomId configurable per match/instance.
- State sync: Use StateManager scoped namespace 'sneakywoods' to store current match state (players, positions, actions). Keep Yjs for eventual CRDT safety and send lightweight state-set messages as a fallback for non-CRDT consumers.
- Networking: Add room/game scoping already in place; ensure handshake rejects mismatched rooms/games.
- Testing: Playwright room isolation already passes; main connectivity tests cover base layer.
