## PeerCompute Test Strategy

### Baseline unit suite
- Command: `npm --prefix peercompute run test:unit`
- Purpose: guard core NetworkManager, TopologyController, scheduler, NodeKernel policy behavior.
- Gate: must pass before merging networking policy changes.

### Direct-path runtime check
- Command: `npm --prefix peercompute run test:direct-path`
- Purpose: verify payload flow survives relay disruption and confirms relay-independent peer path.
- Gate: run whenever relay-drop/direct classification logic changes.

### NetViz runtime scale check
- Command: `node peercompute/tests/runtime/netviz-scale.mjs --peers <N> --dropRelay true --retention sqrt --retentionMin 2 --radius <R> --maxConnections <M> --targetConnections <T> --settle <MS>`
- Purpose: detect relay churn, isolation, and direct/relay mix under multi-peer load.
- Notes:
- Ensure `https://localhost:5182/` is free before running (harness currently expects 5182).
- Capture `[NetworkManager] ICE gathering done` and `Connection upgraded/closed` logs when diagnosing churn.

### NetViz manual diagnosis checklist
- Confirm `Announce addrs` include expected entries.
- Check whether upgraded links are `webrtc` or `relay-webrtc`.
- Confirm relay redial behavior after `remaining: 0` events.
- Record findings and commands in `plan/log.md`.
