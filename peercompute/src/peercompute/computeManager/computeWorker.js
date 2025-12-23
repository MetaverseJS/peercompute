/* eslint-disable no-restricted-globals */

self.onmessage = async (event) => {
  const msg = event.data;
  if (!msg || msg.type !== 'run') return;
  const { id, data, fn, module, exportName } = msg;
  try {
    let handler;
    if (fn) {
      // eslint-disable-next-line no-new-func
      handler = new Function(`return (${fn});`)();
    } else if (module) {
      // Silence webpack's "dependency is an expression" warning by explicitly ignoring bundling here.
      // The worker expects a real URL string passed in from the main thread.
      const mod = await import(
        /* webpackIgnore: true */
        module
      );
      handler = mod[exportName || 'default'];
    }
    if (typeof handler !== 'function') {
      throw new Error('Handler not found for task');
    }
    const result = await handler(data);
    self.postMessage({ type: 'result', id, result });
  } catch (err) {
    self.postMessage({ type: 'error', id, error: err?.message || String(err) });
  }
};
