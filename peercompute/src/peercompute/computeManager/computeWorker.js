/* eslint-disable no-restricted-globals */

import { executeTaskPayload } from './taskRuntime.js';

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
