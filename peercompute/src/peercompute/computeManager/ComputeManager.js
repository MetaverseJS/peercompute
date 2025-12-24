/**
 * @fileoverview Compute Manager - Manages distributed compute tasks
 * Coordinates task distribution, execution, and result aggregation
 * Runs as a worker thread under the Node Kernel
 */

/**
 * ComputeManager class - Handles compute task distribution and execution
 * Manages CPU and WebGPU compute workers
 */
export class ComputeManager {
  /**
   * @param {Object} config - Compute configuration
   * @param {boolean} config.enableWebGPU - Enable WebGPU acceleration
   * @param {number} config.maxWorkers - Maximum number of compute workers
   * @param {boolean} config.enableWorkers - Allow spawning Web Workers (browser environments)
   */
  constructor(config = {}) {
    const defaultWorkers = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4;
    this.config = {
      enableWebGPU: config.enableWebGPU || false,
      enableWorkers: config.enableWorkers !== false,
      maxWorkers: config.maxWorkers || defaultWorkers,
      ...config
    };

    this.workers = [];
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.commitDeltaHandler = null;
    this.capabilities = {
      cpu: true,
      webgpu: false
    };
    this.initialized = false;
  }

  /**
   * Register a handler to commit CPU deltas to DataState
   * @param {Function} handler
   */
  setCommitDeltaHandler(handler) {
    this.commitDeltaHandler = handler;
  }

  commitDelta(delta) {
    if (!this.commitDeltaHandler) return;
    this.commitDeltaHandler(delta);
  }

  /**
   * Initialize compute manager and spawn compute workers
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    const supportsWorkers = typeof Worker !== 'undefined' && this.config.enableWorkers;
    if (!supportsWorkers) {
      console.warn('[ComputeManager] Web Workers not available; falling back to inline execution');
      return;
    }

    const workerURL = new URL('./computeWorker.js', import.meta.url);
    const count = Math.max(1, Math.min(this.config.maxWorkers, 128));
    for (let i = 0; i < count; i++) {
      const worker = new Worker(workerURL, { type: 'module' });
      worker.onmessage = (evt) => this._handleWorkerMessage(worker, evt.data);
      worker.onerror = (err) => console.error('[ComputeManager] Worker error', err);
      this.workers.push(worker);
    }
  }

  /**
   * Submit a compute task
   * @param {Object} task - Task definition
   * @param {string} task.id - Unique task ID
   * @param {Object} task.data - Task input data (structured cloneable)
   * @param {Function} task.fn - Inline function to run (will be serialized)
   * @param {string} task.module - Module URL to import inside the worker
   * @param {string} task.exportName - Exported function name in module (defaults to 'default')
   * @returns {Promise<any>} Task result
   */
  async submitTask(task) {
    if (!task) throw new Error('Task is required');
    if (!task.fn && !task.module) throw new Error('Task must provide fn or module');

    const idSource = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
    const id = task.id || idSource;
    const payload = {
      id,
      data: task.data ?? null,
      fn: task.fn ? task.fn.toString() : undefined,
      module: task.module,
      exportName: task.exportName || 'default'
    };

    if (!this.initialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const wrapped = { id, payload, resolve, reject };
      if (this._dispatchToWorker(wrapped)) return;
      this.taskQueue.push(wrapped);
      this._scheduleNext();
    });
  }

  /**
   * Distribute task across multiple nodes
   * @param {Object} task - Task to distribute
   * @param {Array<string>} targetNodes - Node IDs to distribute to
   * @returns {Promise<Array>} Results from all nodes
   */
  async distributeTask(task, targetNodes) {
    // TODO: Split task into subtasks
    // TODO: Distribute to network nodes via NetworkManager
    // TODO: Collect results
    // TODO: Aggregate results
  }

  /**
   * Cancel a running task
   * @param {string} taskId - Task ID to cancel
   * @returns {Promise<void>}
   */
  async cancelTask(taskId) {
    // TODO: Find task in active tasks
    // TODO: Terminate worker executing task
    // TODO: Clean up resources
  }

  /**
   * Get compute capabilities of this node
   * @returns {Object} Capability information
   */
  getCapabilities() {
    // TODO: Return detailed capability info
    return {
      ...this.capabilities,
      workers: this.workers.length,
      activeTaskCount: this.activeTasks.size,
      queuedTaskCount: this.taskQueue.length
    };
  }

  /**
   * Get compute statistics
   * @returns {Object} Compute stats
   */
  getStats() {
    // TODO: Aggregate compute statistics
    return {
      totalTasksCompleted: 0,
      averageTaskDuration: 0,
      currentLoad: 0,
      // TODO: Add more metrics
    };
  }

  /**
   * Execute task on appropriate worker
   * @private
   * @param {Object} task - Task to execute
   * @returns {Promise<any>} Task result
   */
  async _executeTask(task) {
    // TODO: Select appropriate worker based on task type
    // TODO: Send task to worker
    // TODO: Wait for result
    // TODO: Handle errors
  }

  /**
   * Schedule next task from queue
   * @private
   */
  _scheduleNext() {
    // TODO: Check for available workers
    // TODO: Get next task from queue
    // TODO: Execute task
  }

  /**
   * Handle task completion
   * @private
   * @param {string} taskId - Completed task ID
   * @param {any} result - Task result
   */
  _handleTaskComplete(taskId, result) {
    // TODO: Remove from active tasks
    // TODO: Return result to submitter
    // TODO: Schedule next queued task
  }

  /**
   * Handle task error
   * @private
   * @param {string} taskId - Failed task ID
   * @param {Error} error - Error details
   */
  _handleTaskError(taskId, error) {
    // TODO: Log error
    // TODO: Retry task if appropriate
    // TODO: Return error to submitter
  }

  /* Internal helpers */
  _dispatchToWorker(task) {
    const worker = this.workers.find((w) => !Array.from(this.activeTasks.values()).some(t => t.worker === w));
    if (!worker) return false;
    this.activeTasks.set(task.id, { ...task, worker });
    worker.postMessage({ type: 'run', ...task.payload });
    return true;
  }

  async _executeInline(task) {
    try {
      let fn;
      if (task.payload.fn) {
        // eslint-disable-next-line no-new-func
        fn = new Function(`return (${task.payload.fn});`)();
      } else if (task.payload.module) {
        // Hint webpack to allow dynamic import while restricting to JS assets
        if (typeof task.payload.module !== 'string') {
          throw new Error('module path must be a string');
        }
        const mod = await import(
          /* webpackChunkName: "compute-task" */
          /* webpackMode: "lazy" */
          /* webpackInclude: /\.js$/ */
          `${task.payload.module}`
        );
        fn = mod[task.payload.exportName || 'default'];
      }
      const result = await fn(task.payload.data);
      if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
        this.commitDelta(result.commitDelta);
        const finalResult = Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result.result;
        task.resolve(finalResult);
        return;
      }
      task.resolve(result);
    } catch (err) {
      task.reject(err);
    }
  }

  _handleWorkerMessage(worker, message) {
    const { id, type, result, error } = message || {};
    const task = this.activeTasks.get(id);
    if (!task) return;

    if (type === 'result') {
      let finalResult = result;
      if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
        this.commitDelta(result.commitDelta);
        finalResult = Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result.result;
      }
      task.resolve(finalResult);
    } else if (type === 'error') {
      task.reject(new Error(error || 'Worker task failed'));
    }
    this.activeTasks.delete(id);
    this._scheduleNext();
  }

  _scheduleNext() {
    if (this.taskQueue.length === 0) return;
    const next = this.taskQueue.shift();
    if (this.workers.length === 0) {
      this._executeInline(next);
      return;
    }
    if (!this._dispatchToWorker(next)) {
      // No worker free; push back and try later
      this.taskQueue.unshift(next);
    }
  }
}
