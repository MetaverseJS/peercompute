import { executeWasmTask, executeWasmWebGPUTask } from './runtime/wasmRuntime.js';

async function importTaskModule(modulePath) {
  if (typeof modulePath !== 'string' || !modulePath.trim()) {
    throw new Error('module path must be a non-empty string');
  }

  return import(
    /* webpackChunkName: "compute-task" */
    /* webpackMode: "lazy" */
    /* webpackInclude: /\.js$/ */
    /* @vite-ignore */
    `${modulePath}`
  );
}

function normalizeRuntime(payload = {}) {
  if (typeof payload.runtime === 'string' && payload.runtime.trim()) {
    return payload.runtime.trim().toLowerCase();
  }
  if (payload.wasm) {
    return payload.hostModule || payload.module ? 'wasm-webgpu' : 'wasm';
  }
  return 'js';
}

async function executeJavaScriptTask(payload) {
  let handler;

  if (payload.fn) {
    // eslint-disable-next-line no-new-func
    handler = new Function(`return (${payload.fn});`)();
  } else if (payload.module) {
    const mod = await importTaskModule(payload.module);
    handler = mod[payload.exportName || 'default'];
  }

  if (typeof handler !== 'function') {
    throw new Error('Handler not found for task');
  }

  return handler(payload.data);
}

export async function executeTaskPayload(payload) {
  const runtime = normalizeRuntime(payload);

  switch (runtime) {
    case 'js':
      return executeJavaScriptTask(payload);
    case 'wasm':
      return executeWasmTask(payload);
    case 'wasm-webgpu':
      return executeWasmWebGPUTask(payload);
    default:
      throw new Error(`Unsupported compute runtime: ${runtime}`);
  }
}

