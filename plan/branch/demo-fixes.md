## Keystone Demo
- We need a demo to visually demonstrate the key innovation from the readme in realtime. where one user is defined as the root node (maybe in a room that they create and others can join) a predefined workload can be selected from a list of varying types. and then you get to see a visualization of the evolution of the network as it reconfigures while computing the workload. 
- Details: plan/branch/keystone-demo.md.


## TODO Demos

- 3d network visualizer to view the p2p network graph and edges and data flows live (do this in a tron style grid with nodes represented as cubes and connections between nodes ans glowing nurbs curves.)


- WASM support for compute workloads
- REAL distributed compute workload examples. 
- Demos for each network topology

- shared 3d editing environment based on https://threejs.org/editor/ where users can make 3d models together github https://github.com/mrdoob/three.js/tree/master/editor
- motorcycle game similar to road rash and the tron lightcycle game
- shared "VR CHAT" style world that uses your webcam to pose your 3d model. based on the input model from daddy go. 


# Physics and engine upgrades
- Apply PPF model to other physics demos
- create a better input model that abstracts/unifies the camera / vr / keyboard / mobile / controller inputs

-fully integrated engine demo that uses the best of webgpuphys, input abstraction, videochat/pose detection, collaborative editing etc. 

- integrated procedural generation library that ties the universe generation up to the planet generator. 

## detailed plan and architecture. 

## Branch Goal
Use the demo suite to prove the PeerCompute architecture end-to-end: layered DataState, NetworkScheduler profiles/topologies, ComputeManager (CPU/GPU/WASM), and GPU hub interop. The demos should double as validation tools for the distributed compute roadmap.

## How this ties to the larger PeerCompute plan
- Roadmap alignment: the demo work validates "Scheduler adoption" and "Compute" phases in plan/plan.md while stress-testing network hardening (relay, rooms, warm deltas).
- Architecture alignment: new demos should use layered DataState, hot/warm deltas, and shared-GPU hub where render-coupled buffers are needed (plan/arch/*).
- Distributed compute alignment: "real distributed compute examples" should exercise placement, topology roles, and scheduler profiles (plan/branch/distributed-compute.md).

## Prereqs / dependencies (do first or in parallel)
- Finish warm DataState delta publishing end-to-end so demos can visualize and replicate state safely.
- Stabilize room selection + relay config defaults (shared with the demo-ports release tasks).
- Keep ComputeManager scheduling + GPU hub integration stable before adding new compute-heavy demos.

## Branch breakdown (two branches)

### Branch A: demo-foundations (engine + tooling)
Goal: build shared systems that multiple demos reuse, and unblock the larger compute/topology story.
- Input abstraction layer (keyboard/mouse/gamepad/touch/VR) with unified action mapping.
- Physics upgrades: apply the PPF contact model to other physics demos and expose a shared physics adapter.
- WASM compute support in ComputeManager (task type, worker instantiation, DataState commitDelta hooks).
- Network telemetry + metrics feed (peer graph, RTT/throughput, message counts), exposed via warm deltas.
- 3d network visualizer core (tron grid, nodes/edges, nurbs links) built on the telemetry feed.
- Shared procedural generation library that links universes + planetgen with a common data model and task API.

### Branch B: demo-experiences (showcase demos)
Goal: build new demos that prove the platform and the distributed compute narrative.
- Distributed compute workload examples (batch + streaming) that show real scaling across peers.
- Topology demo suite (authority-hosted, mesh snapshots, hierarchical) with an explorable UI and live stats.
- Keystone demo (flagship showcase; see plan/branch/keystone-demo.md).
- Shared 3d editor based on three.js editor, with multi-user scene graph sync and reliable edit events.
- Motorcycle/lightcycle game that exercises input abstraction + physics + network prediction.
- Shared VR world with webcam pose (DaddyGo input model) and avatar sync.
- Fully integrated engine demo that combines webgpuphys + input + pose/video + collaborative editing.

## Suggested order (what to do first)
1) Network telemetry + minimal visualizer: gives visibility into peers/topology and de-risks later demos.
2) Input abstraction + PPF rollouts: foundation for the motorcycle game and the integrated engine demo.
3) WASM compute support: needed for portable distributed compute tasks beyond WebGPU.
4) Shared procedural generation API: unlocks planetgen/universes cross-demo reuse.
5) Distributed compute examples + topology demos: validate scheduler profiles and topology roles.
6) Keystone demo as a flagship integration once the foundations above are stable.
7) Collaboration-heavy demos (3d editor, VR world), then the fully integrated engine demo last.

## Deliverables / definition of done
- Each demo uses PeerCompute APIs directly (NodeKernel + NetworkScheduler + DataState).
- Every demo includes a minimal README update and a short "what this validates" section.
- The network visualizer and topology demos become the debugging tools for future work.
