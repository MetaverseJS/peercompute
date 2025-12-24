/**
 * @fileoverview GPUHubManager - Main-thread GPU hub for shared render+compute
 */

export class GPUHubManager {
  /**
   * @param {Object} config
   * @param {number} [config.frameBudgetMs]
   * @param {Map<string, any>} [config.hotStore]
   */
  constructor(config = {}) {
    this.frameBudgetMs = config.frameBudgetMs ?? 4;
    this.hotStore = config.hotStore || new Map();
    this.device = null;
    this.tasks = new Map();
  }

  async initialize(options = {}) {
    if (options.device) {
      this.device = options.device;
      return this.device;
    }
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      throw new Error('[GPUHubManager] WebGPU not available in this environment');
    }
    const adapter = await navigator.gpu.requestAdapter(options.adapterOptions);
    if (!adapter) {
      throw new Error('[GPUHubManager] Failed to acquire GPU adapter');
    }
    this.device = await adapter.requestDevice(options.deviceDescriptor);
    return this.device;
  }

  setDevice(device) {
    this.device = device;
  }

  getHotStore() {
    return this.hotStore;
  }

  registerHotBuffer(key, buffer) {
    this.hotStore.set(key, buffer);
  }

  registerHotBufferSet(taskId, buffers) {
    this.hotStore.set(taskId, buffers);
  }

  getHotBufferSet(taskId) {
    return this.hotStore.get(taskId);
  }

  getHotBuffer(key) {
    return this.hotStore.get(key);
  }

  createHotBuffer(key, size, usage, label) {
    if (!this.device) {
      throw new Error('[GPUHubManager] Device not initialized');
    }
    const buffer = this.device.createBuffer({
      size,
      usage,
      label
    });
    this.hotStore.set(key, buffer);
    return buffer;
  }

  removeHotBuffer(key) {
    this.hotStore.delete(key);
  }

  registerTask(id, task) {
    this.tasks.set(id, task);
  }

  unregisterTask(id) {
    this.tasks.delete(id);
  }

  /**
   * Placeholder tick for shared-GPU tasks.
   * The caller should integrate this into the render loop.
   */
  tick() {
    // Intentionally minimal: scheduling is handled by the render loop.
  }
}
