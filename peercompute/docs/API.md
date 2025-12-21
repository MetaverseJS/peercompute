# PeerCompute API Documentation

## Overview

This document provides a comprehensive overview of all modules, classes, and methods in the PeerCompute library.

## Core Modules

### NodeKernel

**Location:** `src/peercompute/nodeKernel/NodeKernel.js`

Main orchestrator for a PeerCompute node. Manages State, Network, and Compute managers as child threads.

#### Constructor
```javascript
new NodeKernel(config)
```

**Parameters:**
- `config.topology` (string): Network topology - 'hierarchy' | 'distributed' | 'emergent'
- `config.storageMode` (string): Data storage mode - 'local' | 'propagate'
- `config.enableWebGPU` (boolean): Enable WebGPU compute capabilities

#### Methods

- `async initialize()` - Initialize the node kernel and spawn child manager threads
- `async start()` - Start the node and connect to the P2P network
- `async stop()` - Stop the node and cleanup resources
- `async submitTask(task)` - Submit a compute task to the network
- `getStatus()` - Get current node status

---

### StateManager

**Location:** `src/peercompute/stateManager/StateManager.js`

Manages shared data state across the node. Coordinates read/write access and provides CRDT-based synchronization.

#### Methods

- `async initialize(initialState)` - Initialize the state manager
- `read(key)` - Read value from state
- `async write(key, value)` - Write value to state (coordinated)
- `async batchWrite(updates)` - Batch write multiple key-value pairs
- `subscribe(key, callback)` - Subscribe to state changes
- `async synchronize(peerStates)` - Synchronize state with network peers
- `snapshot()` - Create a snapshot of current state

---

### NetworkManager

**Location:** `src/peercompute/networkManager/NetworkManager.js`

Handles P2P networking using libp2p. Manages peer connections, topology, and message routing.

#### Constructor
```javascript
new NetworkManager(config)
```

**Parameters:**
- `config.topology` (string): 'hierarchy' | 'distributed' | 'emergent'

#### Methods

- `async initialize()` - Initialize the network manager and libp2p node
- `async connect(bootstrapPeers)` - Connect to the P2P network
- `async disconnect()` - Disconnect from the network
- `async sendToPeer(peerId, message)` - Send message to specific peer
- `async broadcast(message, options)` - Broadcast message to all connected peers
- `async joinParent(parentPeerId)` - Join a parent node (hierarchy topology)
- `async acceptChild(childPeerId)` - Accept a child node (hierarchy topology)
- `async discoverNearbyPeers()` - Discover nearby peers with high bandwidth/compute
- `async optimizeTopology()` - Optimize topology based on network conditions
- `getConnectedPeers()` - Get list of connected peers
- `getNetworkStats()` - Get network statistics

---

### ComputeManager

**Location:** `src/peercompute/computeManager/ComputeManager.js`

Manages distributed compute tasks. Coordinates task distribution, execution, and result aggregation.

#### Constructor
```javascript
new ComputeManager(config)
```

**Parameters:**
- `config.enableWebGPU` (boolean): Enable WebGPU acceleration
- `config.maxWorkers` (number): Maximum number of compute workers

#### Methods

- `async initialize()` - Initialize compute manager and spawn compute workers
- `async submitTask(task)` - Submit a compute task
  - `task.id` (string): Unique task ID
  - `task.type` (string): Task type - 'webgpu' | 'cpu' | 'physics'
  - `task.data` (Object): Task input data
  - `task.compute` (Function): Compute function (for CPU tasks)
  - `task.shader` (string): WGSL shader code (for WebGPU tasks)
- `async distributeTask(task, targetNodes)` - Distribute task across multiple nodes
- `async cancelTask(taskId)` - Cancel a running task
- `getCapabilities()` - Get compute capabilities of this node
- `getStats()` - Get compute statistics

---

## Subsystem Modules

### PhysicsEngine

**Location:** `src/peercompute/physics/PhysicsEngine.js`

Manages physics simulation with rigid body dynamics, collisions, and constraints.

#### Constructor
```javascript
new PhysicsEngine(config)
```

**Parameters:**
- `config.gravity` (Object): Gravity vector - {x, y, z}
- `config.timeStep` (number): Time step in seconds
- `config.substeps` (number): Physics substeps per frame

#### Methods

- `async initialize()` - Initialize the physics engine
- `addBody(bodyDef)` - Add a rigid body to the simulation
  - `bodyDef.id` (string): Unique body ID
  - `bodyDef.position` (Object): Initial position {x, y, z}
  - `bodyDef.velocity` (Object): Initial velocity {x, y, z}
  - `bodyDef.mass` (number): Body mass
  - `bodyDef.shape` (string): Collision shape type
- `removeBody(bodyId)` - Remove a body from the simulation
- `step(deltaTime)` - Step the physics simulation forward
- `getBodyState(bodyId)` - Get body state
- `getAllBodies()` - Get all body states
- `start()` - Start continuous physics simulation
- `stop()` - Stop physics simulation
- `reset()` - Reset physics simulation

---

### InputManager

**Location:** `src/peercompute/input/InputManager.js`

Manages input handling and synchronization across the network. Supports keyboard, mouse, gamepad, and touch input.

#### Methods

- `async initialize(config)` - Initialize the input manager
  - `config.networkSync` (boolean): Enable network input synchronization
- `on(eventType, callback)` - Register input event listener
- `isKeyPressed(key)` - Get current key state
- `getMousePosition()` - Get current mouse position
- `isMouseButtonPressed(button)` - Get current mouse button state
- `getGamepadState(gamepadIndex)` - Get gamepad state
- `getTouchState(touchId)` - Get touch state
- `serializeState()` - Serialize input state for network transmission
- `applyNetworkState(peerId, inputState)` - Apply received network input state
- `destroy()` - Cleanup input manager

---

## Worker Modules

### WebGPUComputeWorker

**Location:** `src/peercompute/computeManager/compute/WebGPUComputeWorker.js`

Worker thread that executes GPU-accelerated compute tasks using WebGPU.

**Message Types:**
- `initialize` - Initialize WebGPU device
- `execute` - Execute a compute shader
- `terminate` - Cleanup and close worker

**Task Format:**
```javascript
{
  shader: 'WGSL shader code',
  data: { /* input buffers */ },
  workgroupSize: [x, y, z]
}
```

---

### CPUComputeWorker

**Location:** `src/peercompute/computeManager/compute/CPUComputeWorker.js`

Worker thread that executes CPU-based compute tasks.

**Message Types:**
- `initialize` - Initialize worker
- `execute` - Execute a compute task
- `terminate` - Cleanup and close worker

**Task Types:**
- `function` - Execute arbitrary compute function
- `physics` - Execute physics simulation step
- `data` - Execute data processing task

---

## Utility Functions

**Location:** `src/peercompute/utils/Utils.js`

### Core Utilities

- `generateId()` - Generate a unique ID
- `deepClone(obj)` - Deep clone an object
- `serialize(data)` - Serialize data for network transmission
- `deserialize(buffer)` - Deserialize data from network
- `hash(data)` - Calculate hash of data (SHA-256)
- `nextTick()` - Defer execution to next tick

### Performance Utilities

- `measureTime(fn)` - Measure execution time of a function
- `retry(fn, options)` - Retry a function with exponential backoff
- `throttle(fn, delay)` - Throttle function execution
- `debounce(fn, delay)` - Debounce function execution

### Math Utilities

- `clamp(value, min, max)` - Clamp value between min and max
- `lerp(a, b, t)` - Linear interpolation

---

## Main Entry Point

**Location:** `src/peercompute/index.js`

### Exports

- `NodeKernel` - NodeKernel class
- `StateManager` - StateManager class
- `NetworkManager` - NetworkManager class
- `ComputeManager` - ComputeManager class
- `PhysicsEngine` - PhysicsEngine class
- `InputManager` - InputManager class
- `Utils` - Utility functions namespace
- `VERSION` - Library version string
- `DEFAULT_CONFIG` - Default configuration object

### createNode Function

```javascript
async function createNode(config)
```

Convenience function to initialize a complete node with all managers.

**Parameters:**
- `config.topology` (string): Network topology
- `config.storageMode` (string): Data storage mode
- `config.enableWebGPU` (boolean): Enable WebGPU
- `config.enablePhysics` (boolean): Enable physics engine
- `config.enableInput` (boolean): Enable input manager
- `config.bootstrapPeers` (Array<string>): Bootstrap peer addresses

**Returns:** Promise<NodeKernel>

---

## Usage Example

```javascript
import { createNode } from './peercompute/index.js';

// Create and initialize a node
const node = await createNode({
  topology: 'distributed',
  enableWebGPU: true,
  enablePhysics: true
});

// Start the node
await node.start();

// Submit a compute task
const result = await node.submitTask({
  id: 'task-1',
  type: 'webgpu',
  shader: `
    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      // Compute shader code
    }
  `,
  data: { /* input data */ }
});

// Get status
const status = node.getStatus();
```

---

## Implementation Status

**Current Phase:** P2P Networking (libp2p) 🔧

Core modules are wired and functional, with libp2p-based networking and Yjs state synchronization in place.

**Next Steps:**
1. Harden libp2p relay/presence behavior for browser discovery
2. Expand compute worker spawning and task execution
3. Add WebGPU shader execution
4. Complete physics engine implementation
5. Add comprehensive test coverage
