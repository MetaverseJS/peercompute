import { executeWasmTask, executeWasmWebGPUTask } from './runtime/wasmRuntime.js';
import { getBuiltinTaskModule } from '../runtime/extensionRegistry.js';
import { assertSafeRemoteModuleUrl, assertSafeRemoteTaskUrls } from './remoteModulePolicy.js';

export { assertSafeRemoteModuleUrl, assertSafeRemoteTaskUrls };

function throwIfAborted(signal) {
  if (!signal?.aborted) return;
  const reason = signal.reason;
  if (reason instanceof Error) throw reason;
  throw Object.assign(new Error(String(reason || 'Compute task cancelled')), {
    name: 'AbortError',
    code: 'ERR_COMPUTE_TASK_CANCELLED'
  });
}

async function importTaskModule(modulePath, { remote = false, remoteModulePolicy = null } = {}) {
  if (typeof modulePath !== 'string' || !modulePath.trim()) {
    throw new Error('module path must be a non-empty string');
  }
  if (remote) {
    assertSafeRemoteModuleUrl(modulePath, {
      ...(remoteModulePolicy && typeof remoteModulePolicy === 'object' ? remoteModulePolicy : {}),
      fieldName: 'module'
    });
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
  const signal = context?.signal || payload?.signal || null;
  throwIfAborted(signal);
  const remote = payload?.remote === true || context?.remote === true;
  const remoteModulePolicy = payload?.remoteModulePolicy || context?.remoteModulePolicy || null;
  let handler;

  if (payload.fn) {
    if (remote && remoteModulePolicy?.allowFunctions !== true) {
      const err = new Error('Remote compute function payloads are disabled; use module or WASM tasks');
      err.code = 'ERR_REMOTE_COMPUTE_UNSAFE_TASK';
      throw err;
    }
    // eslint-disable-next-line no-new-func
    handler = new Function(`return (${payload.fn});`)();
  } else if (payload.module) {
    const mod = await importTaskModule(payload.module, { remote, remoteModulePolicy });
    throwIfAborted(signal);
    handler = mod[payload.exportName || 'default'];
  }

  if (typeof handler !== 'function') {
    throw new Error('Handler not found for task');
  }

  throwIfAborted(signal);
  return handler(payload.data, context);
}

export async function executeTaskPayload(payload, context = {}) {
  const signal = context?.signal || payload?.signal || null;
  throwIfAborted(signal);
  const remote = payload?.remote === true || context?.remote === true;
  if (remote) {
    assertSafeRemoteTaskUrls(payload, payload?.remoteModulePolicy || context?.remoteModulePolicy || {});
  }
  const runtime = normalizeRuntime(payload);

  switch (runtime) {
    case 'js':
      return executeJavaScriptTask(payload, context);
    case 'wasm':
      return executeWasmTask(payload, context);
    case 'wasm-webgpu':
      return executeWasmWebGPUTask(payload, context);
    default:
      throw new Error(`Unsupported compute runtime: ${runtime}`);
  }
}

