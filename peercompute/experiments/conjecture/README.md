# Conjecture experiment

A deterministic simulation that tests PeerCompute's core conjecture: nodes that
each follow a local rule to increase their own measured throughput can form a
compute topology as good as one planned with global knowledge.

**Result (simulation only):** where topology matters, the local rule delivers
1.07–2.99 times the throughput of the library's current spatial neighbour
selection at 32 nodes, and matches or beats a centralized greedy planner
(1.00–1.45 times). It reaches 71–100% of a ceiling no topology can exceed. Where
topology does not matter, every policy performs the same, with one exception
noted below. A control that rewires just as often but ignores the measurement
does no better than a random graph. The rule changes about 2 links per node per
minute once settled.

This is evidence about the rule in a model. It is not evidence about real
browsers, WebRTC or the live library, which do not use the rule yet.

## Run it

```sh
node --test peercompute/tests/unit/throughputTopologyPolicy.test.js peercompute/tests/unit/conjectureSimulation.test.js
node peercompute/experiments/conjecture/run.mjs --seeds 20 --nodes 32 --out results.json   # about 8 minutes
node peercompute/experiments/conjecture/controls.mjs --seeds 20 --out controls.json
```

Runs are seeded and repeatable. The data behind the tables is in `results/`.

## The rule

`src/peercompute/networkManager/ThroughputTopologyPolicy.js` is a pure
function. A node gives it the work rate it measured over each of its own links
and the peers it knows of. It never sees another peer's bandwidth or compute.

1. Below its target number of links, connect to a known peer, preferring peers
   that are short of links themselves. Repeated repairs wait longer each time.
2. Otherwise keep one spare slot for a trial link to another peer.
3. When the trial is over, compare the work the node moves now with what it
   moved before the new link appeared. If the total grew by at least 5%, keep
   the target number of links that carried the most work (a new link must beat
   an established one by 10%). Otherwise drop the new link: a link that only
   takes work from another link is not a gain.
4. A failed trial doubles the wait before the next one, up to 5 minutes. A
   successful one halves it.

Half of the trial candidates are referrals: neighbours of the node's busiest
neighbour.

## The model

- **Nodes** have a compute rate (tasks per second) and an access capacity shared
  by all of their links in each direction. A link's capacity is the smaller
  access capacity of its two ends times a path quality.
- **One source** offers an unlimited supply of independent tasks. Work flows
  toward emptier queues, each node computes at its own rate, and results return
  along the cheapest path. Nodes hold at most 4–5 links.
- **A new link** carries nothing for 2 seconds.
- **Throughput** is the source's own computing plus the lower of the rate it
  issues work and the rate results return.
- **Ceiling:** per node, the least of its compute, its access capacity and its
  five best possible links; in total, no more than the source can send. It
  ignores bottlenecks in the middle of the network, so it is loose there.

Scenarios (32 nodes, log-normal compute and access capacity):

| Scenario | Network |
|---|---|
| sites | Four LAN sites. Links between sites are poor except between two gateways per site. Position predicts link quality. |
| decorrelated | Link quality is unrelated to position. |
| far-compute | Sites, with most compute in three nodes at a site the source is not in. |
| uniform | Identical nodes and links (control). |

Task sizes: compute-bound (0.02 MB out, 0.005 MB back), balanced (0.2 / 0.05)
and data-bound (1 / 0.1). The source is either a typical node or a
well-connected host (160 MB/s), which moves the bottleneck into the network.

Policies:

| Policy | How links are chosen |
|---|---|
| Spatial | The library today: `TopologyController` nearest peers by position, plus one hash-chosen long-range link. |
| Random | Random peers up to the target. |
| Central greedy | A planner that knows every capacity grows a tree from the source by best usable compute. A heuristic, not an optimum. |
| Local rule | Starts from the random graph and applies the rule. |

## Results: 32 nodes, 20 seeds

Tasks per second, mean ± 95% interval across seeds, measured over the last two
minutes before the peer loss at 600 s. "Settle" is how long the local rule took
to reach 90% of its final rate. The provisioned compute-bound rows are omitted:
they equal the typical ones.

| Source | Task size | Scenario | Ceiling | Spatial | Random | Central greedy | Local rule | Rule ÷ spatial | Settle (s) |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| typical | compute-bound | sites | 165 | 165 ± 11 | 165 ± 12 | 165 ± 12 | 165 ± 12 | 1.00 | 0 |
| typical | compute-bound | decorrelated | 172 | 172 ± 22 | 172 ± 22 | 172 ± 22 | 172 ± 22 | 1.00 | 0 |
| typical | compute-bound | far-compute | 153 | 153 ± 2 | 153 ± 2 | 153 ± 2 | 153 ± 2 | 1.00 | 0 |
| typical | compute-bound | uniform | 128 | 128 ± 0 | 128 ± 0 | 128 ± 0 | 128 ± 0 | 1.00 | 0 |
| typical | balanced | sites | 109 | 89 ± 14 | 84 ± 16 | 109 ± 19 | 109 ± 19 | 1.22 | 11 |
| typical | balanced | decorrelated | 114 | 102 ± 21 | 105 ± 22 | 114 ± 23 | 114 ± 23 | 1.11 | 2 |
| typical | balanced | far-compute | 104 | 63 ± 10 | 82 ± 17 | 101 ± 17 | 104 ± 17 | 1.64 | 10 |
| typical | balanced | uniform | 104 | 104 ± 0 | 104 ± 0 | 104 ± 0 | 104 ± 0 | 1.00 | 0 |
| typical | data-bound | sites | 29 | 27 ± 5 | 23 ± 5 | 29 ± 6 | 29 ± 6 | 1.07 | 9 |
| typical | data-bound | decorrelated | 31 | 26 ± 6 | 27 ± 7 | 31 ± 8 | 31 ± 8 | 1.20 | 8 |
| typical | data-bound | far-compute | 28 | 20 ± 3 | 19 ± 5 | 26 ± 7 | 27 ± 7 | 1.35 | 65 |
| typical | data-bound | uniform | 24 | 24 ± 0 | 24 ± 0 | 24 ± 0 | 24 ± 0 | 1.00 | 0 |
| provisioned | balanced | sites | 165 | 119 ± 17 | 116 ± 18 | 160 ± 14 | 165 ± 12 | 1.38 | 21 |
| provisioned | balanced | decorrelated | 170 | 135 ± 20 | 144 ± 22 | 170 ± 21 | 170 ± 21 | 1.26 | 6 |
| provisioned | balanced | far-compute | 145 | 74 ± 14 | 115 ± 17 | 139 ± 8 | 144 ± 6 | 1.95 | 12 |
| provisioned | balanced | uniform | 128 | 128 ± 0 | 128 ± 0 | 128 ± 0 | 128 ± 0 | 1.00 | 0 |
| provisioned | data-bound | sites | 147 | 52 ± 7 | 38 ± 9 | 85 ± 10 | 105 ± 10 | 1.99 | 194 |
| provisioned | data-bound | decorrelated | 142 | 46 ± 10 | 49 ± 10 | 118 ± 12 | 117 ± 12 | 2.53 | 131 |
| provisioned | data-bound | far-compute | 94 | 27 ± 3 | 32 ± 7 | 56 ± 9 | 82 ± 7 | 2.99 | 155 |
| provisioned | data-bound | uniform | 128 | 84 ± 2 | 87 ± 4 | 90 ± 0 | 80 ± 0 | 0.95 | 0 |

Starting the rule from the spatial graph instead of a random one ends within 6%
of the same throughput.

With data-bound tasks from a well-connected source on identical nodes, the rule
ends 5% below spatial (80 against 84). Every other case is equal or better.

### After losing a quarter of the peers

The same peers fail under every policy at 600 s. Spatial and central greedy
re-plan at once; random only replaces lost links. Tasks per second over the last
two minutes; "Recover" is the local rule's time to 90% of its new rate.

| Source | Task size | Scenario | Spatial | Random | Central greedy | Local rule | Rule ÷ spatial | Recover (s) |
|---|---|---|---:|---:|---:|---:|---:|---:|
| typical | balanced | sites | 88 | 77 | 95 | 95 | 1.07 | 2 |
| typical | balanced | decorrelated | 94 | 91 | 98 | 98 | 1.05 | 0 |
| typical | balanced | far-compute | 51 | 67 | 82 | 88 | 1.73 | 11 |
| typical | data-bound | sites | 28 | 24 | 28 | 29 | 1.06 | 7 |
| typical | data-bound | decorrelated | 27 | 25 | 31 | 31 | 1.16 | 12 |
| typical | data-bound | far-compute | 16 | 17 | 24 | 25 | 1.51 | 16 |
| provisioned | balanced | sites | 110 | 98 | 120 | 123 | 1.12 | 4 |
| provisioned | balanced | decorrelated | 113 | 116 | 124 | 125 | 1.10 | 1 |
| provisioned | balanced | far-compute | 59 | 85 | 104 | 111 | 1.88 | 2 |
| provisioned | data-bound | sites | 52 | 34 | 69 | 83 | 1.60 | 43 |
| provisioned | data-bound | decorrelated | 45 | 45 | 93 | 95 | 2.10 | 29 |
| provisioned | data-bound | far-compute | 21 | 27 | 42 | 55 | 2.63 | 15 |

### Controls and sensitivity

Twelve cases where topology matters, 20 seeds, 600 s (`results/2026-11-19-controls.json`):

- **Blind rewiring** (same cadence, links ranked at random) gave 14–128 tasks/s
  against 27–170 for the rule, and 74–97% of the random graph. The gain comes
  from the measurement, not from rewiring.
- **Referrals** made little difference: referral-only or random-only candidates
  were within 7% of the default.
- **Trial length:** 3-second or 12-second trials cost up to 12% throughput and
  rewire somewhat less (0.6–1.9 link changes per node per minute).
- **Rewiring against throughput.** Three settings of the wait between trials:

  | Wait after a successful trial | Link changes per node per minute | Throughput against the default |
  |---|---:|---:|
  | Halved (default) | 1.8–2.7 | 1.00 |
  | Reset to 3 s | 3.3–4.0 | 1.00–1.04 |
  | No waiting at all | 8.0–8.2 | 1.00–1.17 |

  The extra throughput from rewiring faster appears only with data-bound tasks
  from a well-connected source, and mostly reflects faster convergence: over
  40 simulated minutes (8 seeds, the three hardest cases) the default reached
  121, 122 and 92 tasks/s against 127, 123 and 92 for the 3-second reset, while
  its rewiring fell to 1.6–1.9 per node per minute.

### 64 nodes, 10 seeds

Balanced and data-bound tasks only. The rule gave 1.00–3.04 times spatial and
0.96–1.34 times central greedy, at 62–100% of the ceiling, changing 1.9–2.6
links per node per minute. It took up to 238 s to settle and up to 52 s to
recover from the loss.

## Limits

- **A model.** Transfers are fluid, links are lossless and latency is ignored.
  Opening a link costs 2 seconds and nothing else.
- **One source and independent tasks.** Several sources, or tasks that depend on
  each other, are not modelled.
- **Rewiring does not stop.** The first version of the rule changed about 8
  links per node per minute. The current one changes about 2, falling slowly
  with time. Much of what remains is nodes taking each other's supply when the
  source cannot feed everyone: each move is a real gain for the node and none
  for the network, and a node cannot tell the difference from its own
  measurements. Real WebRTC connections cost more than the model charges.
- **Slow convergence when data-bound.** Up to 3.2 minutes at 32 nodes and 4 at
  64 to reach 90% of the final rate, which itself keeps rising for 20 minutes or
  more in the hardest cases.
- **The centralized baseline is a greedy heuristic.** Beating it does not show
  the rule is near optimal; the ceiling comparison is the better guide, and the
  rule sits 13–29% below it in the hardest cases (data-bound tasks from a
  well-connected source).
- **Scenarios and constants were chosen by hand.** The first scenario set made
  the source's own uplink the bottleneck everywhere, so the well-connected
  source was added to expose bottlenecks inside the network. Both are reported.
