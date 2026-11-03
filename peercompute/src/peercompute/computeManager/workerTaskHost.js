import { executeTaskPayload } from './taskRuntime.js';

/** Install the managed worker protocol. Runtime modules retain worker-local state. */
export function installComputeWorkerHost(scope = globalThis.self) {
  const controllers = new Map();
  scope.onmessage = async ({ data: message }) => {
    if (!message || typeof message !== 'object') return;
    const { id, type } = message;
    if (type === 'cancel') {
      controllers.get(id)?.abort(new DOMException('Compute task cancelled', 'AbortError'));
      return;
    }
    if (type !== 'run') return;
    // ComputeManager dispatches one task per worker. Reject protocol violations
    // rather than allowing overlapping access to a resident model/device.
    if (controllers.size) {
      scope.postMessage({ type: 'error', id, error: 'Compute worker is busy', code: 'ERR_COMPUTE_WORKER_BUSY' });
      return;
    }
    const controller = new AbortController();
    controllers.set(id, controller);
    try {
      const result = await executeTaskPayload(message, {
        taskId: id,
        workerId: message.workerId,
        signal: controller.signal,
        emitProgress(value) {
          if (!controller.signal.aborted) scope.postMessage({ type: 'progress', id, value });
        }
      });
      controller.signal.throwIfAborted();
      scope.postMessage({ type: 'result', id, result });
    } catch (error) {
      scope.postMessage({
        type: 'error', id, error: error?.message || String(error),
        name: error?.name, code: error?.code
      });
    } finally {
      controllers.delete(id);
    }
  };
  scope.postMessage({ type: 'ready', protocolVersion: 2 });
}
