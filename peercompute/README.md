# PeerCompute

A browser-based P2P distributed compute network leveraging WebGPU and libp2p for distributed computing, multiplayer gaming, and metaverse applications.

## Architecture

PeerCompute follows a modular architecture with the following core components:

### Core Components

- **NodeKernel** - Central orchestrator that manages all subsystems
- **StateManager** - Coordinates read/write access to shared state with CRDT-based synchronization
- **NetworkManager** - Handles P2P networking using libp2p with configurable topologies
- **ComputeManager** - Manages distributed compute tasks across CPU and WebGPU workers

### Subsystems

- **PhysicsEngine** - Rigid body physics simulation
- **InputManager** - Multi-device input handling with network synchronization
- **Utils** - Common utility functions

## Project Structure

```
peercompute/src/peercompute/
├── index.js                          # Main entry point
├── nodeKernel/
│   └── NodeKernel.js                # Node orchestrator
├── stateManager/
│   └── StateManager.js              # State management
├── networkManager/
│   └── NetworkManager.js            # P2P networking
├── computeManager/
│   ├── ComputeManager.js            # Compute coordination
│   └── compute/
│       ├── WebGPUComputeWorker.js   # GPU compute worker
│       └── CPUComputeWorker.js      # CPU compute worker
├── physics/
│   └── PhysicsEngine.js             # Physics simulation
├── input/
│   └── InputManager.js              # Input handling
└── utils/
    └── Utils.js                     # Utility functions
```

## Features

### Network Topologies

- **Hierarchy** - Tree-based structure with parent/child relationships
- **Distributed** - Fully connected peer-to-peer mesh
- **Emergent** - Self-organizing topology based on network conditions

### Compute Capabilities

- CPU-based parallel compute workers
- WebGPU-accelerated compute shaders (WGSL)
- Distributed task execution across network
- Automatic work distribution and result aggregation

### State Management

- Shared state access across all managers
- CRDT-based conflict-free state synchronization
- Efficient network state propagation
- Snapshot and versioning support

### Use Cases

- Player-hosted online gaming
- Distributed physics simulations
- Procedural world generation
- Metaverse backend infrastructure
- Collaborative computing workloads

## Usage

```javascript
import { createNode } from './peercompute/index.js';

// Create and initialize a node
const node = await createNode({
  topology: 'distributed',
  storageMode: 'local',
  enableWebGPU: true,
  enablePhysics: true,
  enableInput: true
});

// Start the node and connect to network
await node.start();

// Submit a compute task
const result = await node.submitTask({
  id: 'task-1',
  type: 'webgpu',
  shader: `
    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      // WGSL shader code
    }
  `,
  data: { /* input data */ }
});

// Get node status
const status = node.getStatus();
console.log('Node status:', status);
```

## Current Status

**Phase: Initial Stubbing** ✓

All core modules have been stubbed out with:
- JSDoc documentation
- Method signatures
- TODO comments for implementation
- Proper ES6 module structure

## Next Steps

1. Add libp2p dependency and implement NetworkManager
2. Implement StateManager with SharedArrayBuffer/CRDT
3. Implement ComputeManager worker spawning and task distribution
4. Add WebGPU compute shader execution
5. Implement PhysicsEngine
6. Add comprehensive tests
7. Create example applications

## Dependencies

To be added:
- libp2p (P2P networking)
- Additional libraries as needed for CRDT, physics, etc.

## Design Principles

1. **Modularity** - ES6 modules with clear separation of concerns
2. **Worker Threads** - Heavy computation runs in separate threads
3. **Security** - SSL-secured domains, signed executable code, non-executable JSON data
4. **Performance** - WebGPU acceleration, efficient state synchronization
5. **Flexibility** - Configurable topologies, storage modes, and capabilities

## License

TBD
