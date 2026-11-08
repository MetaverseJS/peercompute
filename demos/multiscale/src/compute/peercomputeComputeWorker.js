import { executeTaskPayload } from '../../../../peercompute/src/peercompute/computeManager/taskRuntime.js';

// Required-worker clients admit this worker only after its module graph has
// evaluated successfully. Emit readiness before accepting the first task.
globalThis.self.postMessage({ type: 'ready' });

globalThis.self.onmessage = async (event) => {
  const msg = event.data;
  if (!msg || msg.type !== 'run') return;
  const { id } = msg;
  try {
    const result = await executeTaskPayload(msg);
    globalThis.self.postMessage({ type: 'result', id, result });
  } catch (error) {
    globalThis.self.postMessage({
      type: 'error',
      id,
      error: error?.message || String(error)
    });
  }
};
