Instructions: This file contains the goals for the `feature/conjecture-experiment` branch. Append new instructions as they are given.

# Conjecture experiment

Branch `feature/conjecture-experiment` starts at `ffae822b` on `feature/ipfs-artifacts-webgpu`.

## Goal

Test the core conjecture from the root README with evidence: can nodes that each
follow a local rule to increase their own measured throughput form a compute
topology that performs as well as one planned with global knowledge?

User instruction, 2026-11-19: after the larger-picture review recommended
(1) restoring the test baseline, (2) building the minimum conjecture experiment,
(3) Keystone as its visualization and (4) plan clean-up, the user said
“alright go for it”.

## Steps

1. [x] Restore the baseline. Three stale core test expectations updated; the
   remaining failure is the staged Eshkol artifact owned by the ULG repository.
2. [x] Write the local rule as a pure module:
   `peercompute/src/peercompute/networkManager/ThroughputTopologyPolicy.js`.
3. [x] Build a deterministic headless simulator and compare the rule with the
   current spatial selection, a random graph and a centralized greedy planner:
   `peercompute/experiments/conjecture/`.
4. [~] Wire the rule into the live runtime behind a new topology type.
   - [x] `topology: 'throughput'` in `NetworkManager`: the rule drives the
     topology tick; `recordPeerWork` counts work per peer; `NodeKernel` counts
     completed remote compute tasks and graphs. Opt-in; other topologies,
     including NetViz's `emergent`, are unchanged.
   - [x] `WorkMesh` (`src/peercompute/workMesh/WorkMesh.js`): a divisible job
     spreads over directly linked neighbours and results return to the origin.
     Transport-free; tested on an in-memory network and compared across
     topologies with simulated links (`experiments/conjecture/meshRun.js`).
   - [ ] Connect `WorkMesh` to libp2p streams between linked peers. Remote
     compute messages are published on the shared pubsub topic today, so every
     peer in the mesh receives them and link choice cannot affect throughput.
   - [ ] A real multi-browser run of the `throughput` topology with `WorkMesh`.
     Only unit tests and simulated links cover them so far.
5. [ ] Repeat the comparison with real browsers over shaped links (chaos lab),
   after checking the harness defects listed in the November 8 audit.
6. [ ] Keystone demo as the visualization of steps 4–5.
7. [ ] Bring the stale plan files in line (implementation-status.md,
   distributed-compute.md, keystone-demo.md, root-node-runtime-model-evidence.md).

## Decisions

- Simulator before chaos lab. The simulation is deterministic, runs in seconds
  and has no container or WebRTC dependencies, so the rule can be rejected or
  improved cheaply. It is a model, not network evidence; step 5 is still needed.
- The rule reads only what a node can measure itself (work moved over each of
  its links). It never reads another peer's capacity.
- The same module is meant to drive both the simulator and the runtime.

Results and limits are in
[the experiment README](../../peercompute/experiments/conjecture/README.md).

User instruction, 2026-11-19: “be careful that this doesn't break any existing
demo functionality”. The new mode has its own name and does nothing unless
selected; the default path is checked by the core suite, the demo suites and a
two-browser smoke test on builds of the changed source.
