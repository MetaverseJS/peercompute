# Network Manager Scheduler (Spec + Plan)

Status: draft

## Summary
Define a NetworkManager-owned scheduler that decouples local render/input from network traffic and supports multiple game types, room sizes, and topology modes. The scheduler provides predictable update rates, event-driven bursts, and reconnection health checks while keeping NodeKernel/StateManager APIs stable.

## Orchestration vs Transport
- **NodeKernel** owns policy (what/when/who): decides cadence, targets, and dynamic throttling per workload.
- **NetworkManager** owns transport (dial, pubsub, room scoping) and executes the policy.
- **NetworkScheduler** is a timing primitive: it enforces cadence, batching, keepalive, and backoff once policy is set.

## Clock Policy (Configurable)
PeerCompute should allow per-room clock policies so workloads can choose between throughput and determinism.

### Independent clocks (event-driven)
- Managers tick as fast as they need and emit events to NodeKernel.
- Pros: max throughput, low latency for local input/compute.
- Cons: nondeterministic ordering; requires conflict resolution and versioning.

### Kernel clock (lockstep)
- NodeKernel drives a fixed tick and tells managers when to publish.
- Pros: deterministic ordering, easier replay/debugging.
- Cons: throughput bounded by tick rate; higher input latency.

### Hybrid
- Managers run independently but sync on kernel-defined boundaries.
- Pros: good balance of latency and determinism.
- Cons: more coordination logic at sync boundaries.

### Example Config
```js
const node = new NodeKernel({
  gameId: 'cb',
  roomId: 'global',
  clockPolicy: {
    mode: 'kernel', // 'independent' | 'kernel'
    tickHz: 30,
    networkProfile: {
      snapshotHz: 15,
      keepaliveMs: 1000
    }
  }
});
```

## Goals
- Keep local framerate and input responsiveness independent from network update frequency.
- Support multiple network profiles (action, co-op, turn-based, sandbox) with different rates.
- Scale to many peers via rate limits, interest management, and room/topic scoping.
- Provide reconnection/health behavior when peers go idle or pubsub stalls.
- Preserve libp2p-first architecture (relay bootstrap + floodsub) and current APIs.

## Non-goals
- No immediate protocol rewrite to binary or compression (future work only).
- No sweeping changes to NodeKernel/StateManager public APIs.
- No authoritative server requirement (still P2P, authority optional).

## QuakeWorld-Inspired Model (Adapted to P2P)
QuakeWorld separated client input from server snapshots, using prediction and interpolation buffers. For P2P:
- Elect an authority peer per room (first-joiner or lowest peer ID).
- Peers send **inputs/commands** to authority at higher Hz.
- Authority broadcasts **snapshots** at lower Hz.
- Clients predict locally and reconcile when snapshots arrive.
- Keep a small interpolation buffer (100-150ms) to smooth remote players.

## Architecture Overview
NetworkManager owns a scheduler object:
- **Local render loop** runs at device FPS (game code).
- **Network scheduler** runs at fixed Hz and is independent of render loop.
- **Event-driven updates** mark state dirty and allow short bursts.

### Scheduler Responsibilities
- Rate-limit outbound snapshots/commands.
- Drop stale inbound updates (latest-wins for state).
- Maintain interpolation buffers per peer.
- Track network health (lastRx, lastTx, peer count).
- Trigger reconnect logic on stalls.

## Core Data Model
### Message Header (pc-v1)
All messages include a header:
- `type`: snapshot | command | event | presence | clock
- `seq`: per-sender sequence
- `ack`: last received seq (optional)
- `ts`: sender timestamp (ms)
- `gameId`, `roomId`
- `peerId` (sender)
- `authorityId` (current authority peer)

### Message Types
- **snapshot**: authoritative or peer state (position, rotation, velocity, flags)
- **command**: input events (move, look, action buttons)
- **event**: low-frequency gameplay events (hits, spawns, chat)
- **ack**: delivery receipts for reliable events (ids only)
- **presence**: keepalive + capability flags
- **clock**: time sync anchor payloads

### Serialization
Start with JSON payloads (current stack). Plan for optional binary encoding (CBOR) later.

## Profiles (Per Game / Room)
Profiles control scheduler rates and buffers:

### Action / FPS
- inputHz: 30-60
- snapshotHz: 10-20
- interpolationMs: 100-150
- keepaliveMs: 1000
- maxBurst: 2-3 updates
- reliableEventTypes: spawn, join, attack

### Co-op / Survival
- inputHz: 10-20
- snapshotHz: 5-10
- interpolationMs: 150-250
- keepaliveMs: 1500
- reliableEventTypes: spawn, join, revive

### Turn-based / Strategy
- inputHz: event-driven only
- snapshotHz: on turn/phase
- interpolationMs: 0
- keepaliveMs: 3000
- reliableEventTypes: join, turn, commit

### Sandbox / Builder
- inputHz: 5-10
- snapshotHz: 2-5
- events: reliable edit logs
- keepaliveMs: 2000
- reliableEventTypes: place, delete, join, commit

## Topology Modes
1) **Authority-hosted** (default):
   - First peer (join time or lowest peerId) is authority.
   - Authority receives inputs, emits snapshots.
2) **Mesh snapshots**:
   - Each peer emits snapshots for its own entity only.
   - No global authority; best for small co-op.
3) **Hybrid**:
   - Pubsub for discovery/presence.
   - Direct streams for snapshots/commands if needed.

## Interest Management
Reduce traffic by scoping updates:
- Room/topic per game: `peercompute.<roomId>.<type>`
- Optional spatial buckets: only send peers within range.
- Per-entity throttles (NPCs vs players).

## Health + Reconnect Behavior
Maintain `NetworkHealth`:
- `lastRx`, `lastTx`, `peerCount`, `pubsubPeers`
- If no inbound traffic for `staleMs`, trigger:
  - re-subscribe to topics
  - redial bootstrap peers
  - re-announce presence
- Never block render loop when network is stale.

## Reliability Tier (Events)
Default events are best-effort. For critical actions (spawns, kills, room joins), mark events as reliable:
- Sender assigns an event id and retries with backoff until an ack is received (bounded retries).
- Receiver returns an ack message with the event ids it processed.
- Reliable events are scoped to room/game and can target a peer to reduce mesh noise.

## Integration Contract (NetworkManager)
NetworkManager exposes a scheduler config and hooks:
- `configureScheduler(profile)`
- `setSchedulerClock('internal' | 'external')` (internal timer vs kernel-driven tick)
- `tickScheduler(now)` (for kernel-driven clocks)
- `setAuthority(peerId)` / `getAuthority()`
- `registerStateProvider(fn)` -> returns local state snapshot
- `registerCommandProvider(fn)` -> returns queued inputs
- `onSnapshot(cb)` -> remote state updates
- `onEvent(cb)` -> gameplay events
- `getHealth()` -> lastRx, peerCount, pubsubPeers, status

Games (cb/sw2/etc.) only provide local input/state; NetworkManager handles rates.

## Plan of Work
### Phase 0: Spec + Metrics (done in this doc)
- Finalize message header fields and profile defaults.
- Decide authority election rule.

### Phase 0.5: Clock Policy Plumbing
- Add NodeKernel clock policy config (mode + tick Hz + network profile).
- Allow NodeKernel to drive scheduler ticks when configured.
- Expose scheduler clock mode in status/telemetry.

### Phase 1: Scheduler Skeleton
- Add scheduler loop in NetworkManager (setInterval, not tied to render).
- Add `NetworkProfile` config and default action profile.
- Add basic `stateDirty` + keepalive logic in NetworkManager.

### Phase 2: Authority + Snapshot Streams
- Implement authority election (first-joiner + stable tiebreak).
- Add snapshot vs command message types.
- Add interpolation buffer per peer and drop stale snapshots.

### Phase 3: Interest + Health
- Add room/topic scoping (roomId => topic).
- Add health monitor and reconnect triggers.
- Add dev HUD for health metrics.

### Phase 4: Game Integration
- Replace per-game broadcast loops with `NetworkManager` scheduler hooks.
- Keep StateManager APIs stable; adapt via wrappers.

### Phase 5: Optimization / Hardening
- Optional binary encoding.
- Backpressure handling and message size budgets.
- Automated tests for scheduler timing and reconnection.

## Open Questions
- Do we want a single global authority or per-entity authority?
- Should commands be reliable (ack/seq) or best-effort?
- How aggressively should reconnect behavior re-dial when peers idle?
