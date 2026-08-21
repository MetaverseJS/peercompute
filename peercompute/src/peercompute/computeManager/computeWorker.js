/* eslint-disable no-restricted-globals */

import { executeTaskPayload } from './taskRuntime.js';

// A parent that marks workers as required needs a real module-evaluation
// acknowledgement before it is allowed to admit work. This is intentionally
// emitted before the first task so a bad worker URL/import fails closed.
self.postMessage({ type: 'ready' });

self.onmessage = async (event) => {
  const msg = event.data;
  if (!msg || msg.type !== 'run') return;
  const { id } = msg;
  try {
    const result = await executeTaskPayload(msg);
    self.postMessage({ type: 'result', id, result });
  } catch (err) {
    self.postMessage({ type: 'error', id, error: err?.message || String(err) });
  }
};
