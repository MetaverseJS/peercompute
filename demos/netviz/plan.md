# NetViz implementation and verification

## November 9, 2026 — cross-demo observer

The default All demos view consumes bounded `NetworkManager` operational reports.
The pure `observedNetwork.js` module aggregates identities, reported links, current
model hosts and compute counters; `observedNetworkUi.js` renders remote values as
text. `main.js` connects these components to the existing graph, inspector, chaos
overlay and native controls. The selected-session mode preserves normal room
scoping and now passes the attached game's identifier into NodeKernel.

An application or connection-role filter applies to reporters. Filtered reporters
cannot reappear as ghosts. Link endpoints without their own report remain distinct
from reporting peers. Known relay endpoints appear only when a report names their
connection. Reports become stale at 15 seconds and expire at 60; stale or unavailable
model summaries do not count as current hosts. Legacy session beacons are labeled
session only, with no inferred compute or model data. A peer represents a network
instance, not a physical device. The view remains a partial observation.

## Verification

- `node --test demos/netviz/tests/observedNetwork.test.js demos/netviz/tests/relayOverlay.test.js`:
  12/12 pass. Covers duplicate identities/hosts, filtering, actual reported edges,
  bandwidth deduplication, freshness, legacy evidence, attached scope, busy groups
  and unavailable hosting summaries, plus relay overlay regression.
- Existing `sessionInspectorSmoke.mjs` passes against an owned development server.
- `observedNetworkSmoke.mjs` passes: controlled report fixtures exercise native
  filters, grouped hosts, compute counters, stale display, text-only remote names,
  desktop/mobile layout, and an actual reconnect to an isolated game scope through
  SecretWorkshop. Zero page errors. The report fixtures are UI evidence, not proof
  of remote telemetry delivery.
- The external NetViz build passed (12.84 s), with existing large-chunk warnings.
  The root task rebuilds against final shared-core changes and supplies actual
  multiple-publisher integration evidence separately.
- Evidence and inspected screenshots are under
  `/home/cos/.cache/peercompute-netviz-global-20261109/`; no generated assets go in
  this demo or public `docs/` during the deployment hold.

The owned test browser and port 5292 development server are closed after checks.
