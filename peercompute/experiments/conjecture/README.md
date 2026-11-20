# Conjecture experiment

A deterministic simulation that tests PeerCompute's core conjecture: nodes that
each follow a local rule to increase their own measured throughput can form a
compute topology as good as one planned with global knowledge.

**Result (simulation only):** where topology matters, the local rule delivers
1.07–3.13 times the throughput of the library's current spatial neighbour
selection at 32 nodes, and matches or beats a centralized greedy planner
(1.00–1.52 times). It reaches 78–100% of a ceiling no topology can exceed. Where
topology does not matter, every policy performs the same. A control that
rewires just as often but ignores the measurement performs like a random graph.

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

1. Below its target number of links, connect to a known peer.
2. Otherwise keep one spare slot for a trial link to another peer.
3. When the trial is over, keep the target number of links that carried the most
   work and drop the rest. A new link must beat an established one by 10%.
4. Wait longer between trials after each failed one.

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
| typical | balanced | sites | 109 | 89 ± 14 | 84 ± 16 | 109 ± 19 | 109 ± 19 | 1.22 | 15 |
| typical | balanced | decorrelated | 114 | 102 ± 21 | 105 ± 22 | 114 ± 23 | 114 ± 23 | 1.11 | 2 |
| typical | balanced | far-compute | 104 | 63 ± 10 | 82 ± 17 | 101 ± 17 | 104 ± 17 | 1.64 | 16 |
| typical | balanced | uniform | 104 | 104 ± 0 | 104 ± 0 | 104 ± 0 | 104 ± 0 | 1.00 | 0 |
| typical | data-bound | sites | 29 | 27 ± 5 | 23 ± 5 | 29 ± 6 | 29 ± 6 | 1.07 | 8 |
| typical | data-bound | decorrelated | 31 | 26 ± 6 | 27 ± 7 | 31 ± 8 | 31 ± 8 | 1.20 | 4 |
| typical | data-bound | far-compute | 28 | 20 ± 3 | 19 ± 5 | 26 ± 7 | 28 ± 8 | 1.40 | 28 |
| typical | data-bound | uniform | 24 | 24 ± 0 | 24 ± 0 | 24 ± 0 | 24 ± 0 | 1.00 | 0 |
| provisioned | balanced | sites | 165 | 119 ± 17 | 116 ± 18 | 160 ± 14 | 165 ± 12 | 1.38 | 19 |
| provisioned | balanced | decorrelated | 170 | 135 ± 20 | 144 ± 22 | 170 ± 21 | 170 ± 21 | 1.26 | 8 |
| provisioned | balanced | far-compute | 145 | 74 ± 14 | 115 ± 17 | 139 ± 8 | 145 ± 6 | 1.95 | 10 |
| provisioned | balanced | uniform | 128 | 128 ± 0 | 128 ± 0 | 128 ± 0 | 128 ± 0 | 1.00 | 0 |
| provisioned | data-bound | sites | 147 | 52 ± 7 | 38 ± 9 | 85 ± 10 | 115 ± 12 | 2.20 | 174 |
| provisioned | data-bound | decorrelated | 142 | 46 ± 10 | 49 ± 10 | 118 ± 12 | 124 ± 14 | 2.68 | 142 |
| provisioned | data-bound | far-compute | 94 | 27 ± 3 | 32 ± 7 | 56 ± 9 | 86 ± 7 | 3.13 | 98 |
| provisioned | data-bound | uniform | 128 | 84 ± 2 | 87 ± 4 | 90 ± 0 | 85 ± 0 | 1.01 | 0 |

Starting the rule from the spatial graph instead of a random one ends within 1%
of the same throughput.

### After losing a quarter of the peers

The same peers fail under every policy at 600 s. Spatial and central greedy
re-plan at once; random only replaces lost links. Tasks per second over the last
two minutes; "Recover" is the local rule's time to 90% of its new rate.

| Source | Task size | Scenario | Spatial | Random | Central greedy | Local rule | Rule ÷ spatial | Recover (s) |
|---|---|---|---:|---:|---:|---:|---:|---:|
| typical | balanced | sites | 88 | 81 | 95 | 96 | 1.09 | 0 |
| typical | balanced | decorrelated | 94 | 92 | 98 | 98 | 1.05 | 0 |
| typical | balanced | far-compute | 51 | 73 | 82 | 88 | 1.73 | 5 |
| typical | data-bound | sites | 28 | 24 | 28 | 29 | 1.07 | 3 |
| typical | data-bound | decorrelated | 27 | 28 | 31 | 31 | 1.17 | 2 |
| typical | data-bound | far-compute | 16 | 19 | 24 | 27 | 1.62 | 5 |
| provisioned | balanced | sites | 110 | 99 | 120 | 123 | 1.12 | 0 |
| provisioned | balanced | decorrelated | 113 | 115 | 124 | 125 | 1.10 | 2 |
| provisioned | balanced | far-compute | 59 | 89 | 104 | 112 | 1.90 | 5 |
| provisioned | data-bound | sites | 52 | 38 | 69 | 95 | 1.84 | 16 |
| provisioned | data-bound | decorrelated | 45 | 56 | 93 | 99 | 2.19 | 23 |
| provisioned | data-bound | far-compute | 21 | 28 | 42 | 59 | 2.85 | 19 |

### Controls and sensitivity

Twelve cases where topology matters, 20 seeds, 600 s (`results/2026-11-19-controls.json`):

- **Blind rewiring** (same cadence, links ranked at random) gave 18–140 tasks/s
  against 28–170 for the rule, and stayed within 11% of the random graph in
  every case. The gain comes from the measurement, not from rewiring.
- **Referrals** made little difference: referral-only or random-only candidates
  were within 6% of the default.
- **Trial length:** 12-second trials cut rewiring from about 8 to 4.6 link
  changes per node per minute and cost at most 9% throughput (one case).
- **Backoff** barely changed rewiring (7.3–8.7 per node per minute across
  settings). As written it does not do its job.

### 64 nodes, 10 seeds

Balanced and data-bound tasks only. The rule gave 1.00–3.74 times spatial and
1.00–1.80 times central greedy, at 71–100% of the ceiling. It took up to 250 s
to settle and up to 33 s to recover from the loss.

## Limits

- **A model.** Transfers are fluid, links are lossless and latency is ignored.
  Opening a link costs 2 seconds and nothing else.
- **One source and independent tasks.** Several sources, or tasks that depend on
  each other, are not modelled.
- **Constant rewiring.** The rule changes about 8 links per node per minute even
  once throughput has settled. Real WebRTC connections cost more than the model
  charges, so this needs to come down before the rule is used live.
- **Slow convergence when data-bound.** Up to 3 minutes at 32 nodes and 4 at 64.
- **The centralized baseline is a greedy heuristic.** Beating it does not show
  the rule is near optimal; the ceiling comparison is the better guide, and the
  rule sits 9–22% below it in the hardest cases (data-bound tasks from a
  well-connected source).
- **Scenarios and constants were chosen by hand.** The first scenario set made
  the source's own uplink the bottleneck everywhere, so the well-connected
  source was added to expose bottlenecks inside the network. Both are reported.
