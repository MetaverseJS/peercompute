using vite with vanilla js and js lib p2p create a minimal peer to peer miltiplayer library that runs in it's own service worker. 

## Main Design Principles:

* make things modular with ES6 modules
* large components should be capable of running in their own thread as a service worker
* goup common functions together. input related functions should be located in input related modules, physics code should be located in physics modules, networking code should be handled in networking modules.  Code that handles the interactions between these entities should be located in the location that makes the most sense architecturally (usually the kernel )
* refer to the PNGs in this folder for architecture hints. 
### compute node block diagram
* State, Network, and Compute managers should be child threads of the node kernel. 
* All managers and their child threads should have read access to the datastate with State manager coordinating and performing writes. 
* each block should represent at least one ES6 module. place each module in a folder that reflects the overall heirarchy of the application. (for example: nodeKernel/compute/webGPUComputeWorker.js)

### network topology diagram
* Topology should be configurable as a strict heirarchy, fully distributed, or an emergent topology. 
* data storage should be configurable as well. where nodes could store the data themselves or propagate it back up the heirarchy depending on use case. 


## Long term intent:

This is a high level design document that explores requirements and architecture for a browser based p2p compute network leveraging webGPU and built on top of libp2p.  Use cases for this would range from a networking library for player hosted online gaming, procedural world generation, large scale physics simulations,  backend for a metaverse network etc. 

The most interesting potential configuration for this would be a compute network which dynamically self organizes (hierarchically or otherwise) to optimally compute a workload based on mutual bandwidth and compute resources.

for example, where a high degree of peer communication is necessary nodes should be able to recognize and automatically form fully connected peer sub-groups when located together on a LAN with high mutual bandwidth/compute but perhaps a bottle necked uplink. 

In an example metaverse configuration the root node would set out the basis for interaction in a overworld where players (each a compute node themselves) could explore and interact.  Players could also discover and join another compute node (becoming their child) where the parent could lay out a different basis for interaction (a customized personal sub world or game) 

Security:
The root node should exist on a domain secured with SSL enabling all executable code to be signed with Compute Nodes exchanging non executable data in json (3d models, arrays etc) 