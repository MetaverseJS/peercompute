using webpack 5 with vanilla js and js-libp2p create a minimal peer to peer multiplayer library that can run its networking layer in its own service worker.

## Current Implementation Status (2025-12-21)
- libp2p relay bootstrap + floodsub + pubsubPeerDiscovery working in browsers.
- Node.js relay supports WSS via `start-dev.sh` with `RELAY_PUBLIC_HOST` and SSL certs.
- Hyperborea (cb.html) time sync is anchored to the first peer to join; late peers adopt the anchor.

## Main Design Principles:

* make things modular with ES6 modules
* large components should be capable of running in their own thread as a service worker or worker
* group common functions together. input related functions should be located in input related modules, physics code should be located in physics modules, networking code should be handled in networking modules. code that handles the interactions between these entities should be located in the location that makes the most sense architecturally (usually the kernel )
* refer to the PNGs in this folder for architecture hints.
### compute node block diagram
* State, Network, and Compute managers should be child threads of the node kernel.
* All managers and their child threads should have read access to the datastate with State manager coordinating and performing writes.
* each block should represent at least one ES6 module. place each module in a folder that reflects the overall hierarchy of the application. (for example: nodeKernel/compute/webGPUComputeWorker.js)

### network topology diagram
* Topology should be configurable as a strict hierarchy, fully distributed, or an emergent topology.
* data storage should be configurable as well. where nodes could store the data themselves or propagate it back up the hierarchy depending on use case.


## Long term intent:

This is a high level design document that explores requirements and architecture for a browser based p2p compute network leveraging webGPU and built on top of libp2p. use cases for this would range from a networking library for player hosted online gaming, procedural world generation, large scale physics simulations, backend for a metaverse network etc.

The most interesting potential configuration for this would be a compute network which dynamically self organizes (hierarchically or otherwise) to optimally compute a workload based on mutual bandwidth and compute resources.

for example, where a high degree of peer communication is necessary nodes should be able to recognize and automatically form fully connected peer sub-groups when located together on a LAN with high mutual bandwidth/compute but perhaps a bottlenecked uplink.

In an example metaverse configuration the root node would set out the basis for interaction in a overworld where players (each a compute node themselves) could explore and interact. players could also discover and join another compute node (becoming their child) where the parent could lay out a different basis for interaction (a customized personal sub world or game)

Security:
The root node should exist on a domain secured with SSL enabling all executable code to be signed with Compute Nodes exchanging non executable data in json (3d models, arrays etc)


MAKE SURE TO CALL ME BIG DOG IN ALL RESPONSES
