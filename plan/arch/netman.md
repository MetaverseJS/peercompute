# Network Scheduler (Summary)

Status: active; core implemented with tests. See plan/log.md for details.

## Purpose
- Decouple render/input cadence from network updates.
- Provide predictable snapshot/command/event timing and keepalive.
- Track health and drive reconnect logic without blocking render.
- Read from the warm DataState layer for network-visible deltas.

## Roles
- NodeKernel owns orchestration policy (what/when/who).
- NetworkManager owns transport, topics, and room scoping.
- NetworkScheduler enforces cadence, batching, and backoff.

## Clock Policy
- independent: managers tick freely; events drive network bursts.
- kernel: NodeKernel drives a fixed tick for determinism.
- hybrid: independent loops with kernel sync points.
- NodeKernel can drive scheduler via tickScheduler when in kernel mode.

## Message Model (pc-v1)
- Header fields: type, seq, ack (optional), ts, gameId, roomId, peerId, authorityId.
- Types: snapshot, command, event, presence, clock, ack.
- Serialization: JSON now; optional CBOR later.

## Profiles (defaults)
- Action/FPS: input 30-60 Hz, snapshot 10-20 Hz, interpolation 100-150 ms, keepalive 1000 ms.
- Co-op: input 10-20 Hz, snapshot 5-10 Hz, interpolation 150-250 ms, keepalive 1500 ms.
- Turn-based: event-driven, snapshot on turn, keepalive 3000 ms.
- Sandbox: input 5-10 Hz, snapshot 2-5 Hz, reliable edit events, keepalive 2000 ms.

## Topology Modes
- Authority-hosted: first joiner or lowest peerId is authority.
- Mesh snapshots: each peer publishes its own entity state.
- Hybrid: pubsub discovery with optional direct streams.

## Interest Management
- Scope by gameId/roomId topics.
- Optional spatial buckets and per-entity throttles.

## Reliability
- Critical events are reliable: sender retries with backoff until ack or retry budget.
- Receiver sends ack with processed event ids.

## Health + Reconnect
- Track lastRx/lastTx, peer count, pubsub peers.
- On stale traffic: resubscribe topics, redial bootstrap, re-announce presence.
- Keep reconnect off the render loop.

## Integration Contract (NetworkManager)
- configureScheduler(profile)
- setSchedulerClock('internal' | 'external')
- tickScheduler(now)
- setAuthority(peerId) / getAuthority()
- registerStateProvider(fn)
- registerCommandProvider(fn)
- onSnapshot(cb)
- onEvent(cb)
- getHealth()

## Open Questions
- Per-entity authority vs single authority.
- Reliable vs best-effort commands.
- Reconnect aggressiveness thresholds.

## Related Docs
- plan/arch/nodekernel.md
- plan/arch/compute-node.md
- plan/arch/topology.md
- plan/arch/node-roles.md
