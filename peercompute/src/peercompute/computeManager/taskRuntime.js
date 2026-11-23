import { executeWasmTask, executeWasmWebGPUTask } from './runtime/wasmRuntime.js';
import { getBuiltinTaskModule } from '../runtime/extensionRegistry.js';

async function importTaskModule(modulePath) {
  if (typeof modulePath !== 'string' || !modulePath.trim()) {
    throw new Error('module path must be a non-empty string');
  }

  // Optional built-in modules (such as inference task handlers) register via
  // `extensionRegistry` so `peercompute/core` stays strictly free of inference
  // and heavy WASM import edges.
  const registeredLoader = getBuiltinTaskModule(modulePath);
  if (registeredLoader) {
    return registeredLoader();
  }
  if (modulePath === 'peercompute:capability-benchmark') {
    return import('../capabilities/benchmarkTask.js');
  }
  if (modulePath.startsWith('peercompute:')) {
    throw Object.assign(
      new Error(`Built-in compute task module "${modulePath}" is not registered; load the optional peercompute inference entrypoint or register it via registerBuiltinTaskModule()`),
      { code: 'ERR_COMPUTE_BUILTIN_MODULE_NOT_REGISTERED', modulePath }
    );
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

async function executeJavaScriptTask(payload, context) {
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

  return handler(payload.data, context);
}

export async function executeTaskPayload(payload, context = {}) {
  const runtime = normalizeRuntime(payload);

  switch (runtime) {
    case 'js':
      return executeJavaScriptTask(payload, context);
    case 'wasm':
      return executeWasmTask(payload);
    case 'wasm-webgpu':
      return executeWasmWebGPUTask(payload);
    default:
      throw new Error(`Unsupported compute runtime: ${runtime}`);
  }
}

