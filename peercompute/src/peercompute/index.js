/**
 * @fileoverview PeerCompute - P2P Distributed Compute Network Library
 * Main entry point for the PeerCompute library
 * 
 * @module PeerCompute
 * @version 0.0.1
 * @description A browser-based P2P compute network leveraging WebGPU and libp2p
 * for distributed computing, multiplayer gaming, and metaverse applications.
 */

// Core components
import { NodeKernel } from './nodeKernel/NodeKernel.js';
export { NodeKernel };
export { StateManager } from './stateManager/StateManager.js';
export { NetworkManager } from './networkManager/NetworkManager.js';
export { ComputeManager } from './computeManager/ComputeManager.js';

// Subsystems
export { PhysicsEngine } from './physics/PhysicsEngine.js';
export { InputManager } from './input/InputManager.js';

// Utilities
export * as Utils from './utils/Utils.js';

/**
 * Create a new PeerCompute node
 * Convenience function to initialize a complete node with all managers
 * 
 * @param {Object} config - Node configuration
 * @param {string} config.topology - Network topology: 'hierarchy' | 'distributed' | 'emergent'
 * @param {string} config.storageMode - Data storage mode: 'local' | 'propagate'
 * @param {boolean} config.enableWebGPU - Enable WebGPU compute capabilities
 * @param {boolean} config.enablePhysics - Enable physics engine
 * @param {boolean} config.enableInput - Enable input manager
 * @param {Array<string>} config.bootstrapPeers - Bootstrap peer addresses
 * @param {Object} config.clockPolicy - Clock policy for orchestration
 * @param {string} config.clockPolicy.mode - 'independent' | 'kernel'
 * @param {number} config.clockPolicy.tickHz - Kernel tick rate when mode is 'kernel'
 * @param {Object|null} config.clockPolicy.networkProfile - Network scheduler profile overrides
 * @returns {Promise<NodeKernel>} Initialized node
 * 
 * @example
 * ```javascript
 * import { createNode } from './peercompute/index.js';
 * 
 * const node = await createNode({
 *   topology: 'distributed',
 *   enableWebGPU: true,
 *   enablePhysics: true
 * });
 * 
 * await node.start();
 * 
 * // Submit a compute task
 * const result = await node.submitTask({
 *   type: 'webgpu',
 *   shader: '...',
 *   data: {...}
 * });
 * ```
 */
export async function createNode(config = {}) {
  // TODO: Create and initialize node with all requested components
  // TODO: Wire up managers based on config
  // TODO: Return initialized node
  
  const node = new NodeKernel(config);
  await node.initialize();
  
  return node;
}

/**
 * Library version
 */
export const VERSION = '0.0.1';

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  topology: 'distributed',
  storageMode: 'local',
  enableWebGPU: false,
  enablePhysics: false,
  enableInput: false,
  bootstrapPeers: [],
  clockPolicy: {
    mode: 'independent',
    tickHz: 30,
    networkProfile: null
  }
};
