const helperModuleCache = new Map();
const wasmModuleCache = new Map();

const TYPED_ARRAYS = {
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array
};

function getTypedArrayCtor(viewName = 'Uint8Array') {
  const ctor = TYPED_ARRAYS[viewName];
  if (!ctor) {
    throw new Error(`Unsupported typed array view: ${viewName}`);
  }
  return ctor;
}

function cloneTypedArray(view) {
  return new view.constructor(view);
}

function isBinaryView(value) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

function normalizeSourceToUint8Array(source) {
  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }
  if (isBinaryView(source)) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }
  if (Array.isArray(source)) {
    return Uint8Array.from(source);
  }
  return null;
}

async function loadHelperModule(modulePath) {
  const cacheKey = String(modulePath);
  if (!helperModuleCache.has(cacheKey)) {
    helperModuleCache.set(
      cacheKey,
      import(
        /* webpackChunkName: "compute-task-helper" */
        /* webpackMode: "lazy" */
        /* @vite-ignore */
        `${cacheKey}`
      )
    );
  }
  return helperModuleCache.get(cacheKey);
}

async function loadWasmBytes(source) {
  const inlineBytes = normalizeSourceToUint8Array(source);
  if (inlineBytes) return inlineBytes;

  if (typeof source === 'string' || source instanceof URL) {
    const response = await fetch(String(source));
    if (!response.ok) {
      throw new Error(`Failed to fetch wasm module: ${response.status} ${response.statusText}`);
    }
    const bytes = await response.arrayBuffer();
    return new Uint8Array(bytes);
  }

  throw new Error('wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array');
}

async function compileWasmModule(source) {
  if (typeof source === 'string' || source instanceof URL) {
    const cacheKey = String(source);
    if (!wasmModuleCache.has(cacheKey)) {
      wasmModuleCache.set(
        cacheKey,
        (async () => {
          const bytes = await loadWasmBytes(source);
          return WebAssembly.compile(bytes);
        })()
      );
    }
    return wasmModuleCache.get(cacheKey);
  }

  const bytes = await loadWasmBytes(source);
  return WebAssembly.compile(bytes);
}

async function resolveImports(wasmConfig, context) {
  if (wasmConfig.importsModule) {
    const mod = await loadHelperModule(wasmConfig.importsModule);
    const exportName = wasmConfig.importsExport || 'default';
    const imported = mod[exportName];
    if (typeof imported === 'function') {
      return (await imported(context)) || {};
    }
    if (imported && typeof imported === 'object') {
      return imported;
    }
    throw new Error(`WASM imports export "${exportName}" must be a function or object`);
  }

  if (wasmConfig.imports && typeof wasmConfig.imports === 'object') {
    return wasmConfig.imports;
  }

  return {};
}

function getMemory(instance, wasmConfig, descriptor = {}) {
  const exportName = descriptor.exportName || wasmConfig.memoryExport || 'memory';
  const memory = instance.exports?.[exportName];
  if (!(memory instanceof WebAssembly.Memory)) {
    throw new Error(`WASM memory export "${exportName}" was not found`);
  }
  return memory;
}

function resolveDescriptorValues(descriptor, data) {
  if (Object.prototype.hasOwnProperty.call(descriptor, 'values')) {
    return descriptor.values;
  }
  const key = descriptor.dataKey || descriptor.name;
  if (key && data && Object.prototype.hasOwnProperty.call(data, key)) {
    return data[key];
  }
  return undefined;
}

function normalizeTypedArrayInput(value, ctor) {
  if (value == null) return null;
  if (value instanceof ctor) return value;
  if (isBinaryView(value)) {
    return new ctor(value.buffer, value.byteOffset, Math.floor(value.byteLength / ctor.BYTES_PER_ELEMENT));
  }
  if (value instanceof ArrayBuffer) {
    return new ctor(value);
  }
  if (Array.isArray(value)) {
    return ctor.from(value);
  }
  throw new Error(`Unsupported memory input for ${ctor.name}`);
}

function writeInputViews(instance, wasmConfig, data) {
  const descriptors = Array.isArray(wasmConfig.inputViews) ? wasmConfig.inputViews : [];
  descriptors.forEach((descriptor) => {
    const ctor = getTypedArrayCtor(descriptor.view);
    const values = normalizeTypedArrayInput(resolveDescriptorValues(descriptor, data), ctor);
    if (!values) return;

    const memory = getMemory(instance, wasmConfig, descriptor);
    const byteOffset = Number.isFinite(descriptor.byteOffset) ? descriptor.byteOffset : 0;
    const target = new ctor(memory.buffer, byteOffset, values.length);
    target.set(values);
  });
}

function readOutputViews(instance, wasmConfig) {
  const descriptors = Array.isArray(wasmConfig.outputViews) ? wasmConfig.outputViews : [];
  if (descriptors.length === 0) return null;

  const outputs = {};
  descriptors.forEach((descriptor, index) => {
    const ctor = getTypedArrayCtor(descriptor.view);
    const memory = getMemory(instance, wasmConfig, descriptor);
    const byteOffset = Number.isFinite(descriptor.byteOffset) ? descriptor.byteOffset : 0;
    const length = Number.isFinite(descriptor.length) ? descriptor.length : 0;
    if (length <= 0) {
      throw new Error(`WASM output view "${descriptor.name || index}" must provide a positive length`);
    }
    const key = descriptor.name || `output${index}`;
    outputs[key] = cloneTypedArray(new ctor(memory.buffer, byteOffset, length));
  });
  return outputs;
}

function normalizeArgs(task, wasmConfig) {
  if (Array.isArray(wasmConfig.args)) return wasmConfig.args;
  if (Array.isArray(task.args)) return task.args;
  if (Array.isArray(task.data?.args)) return task.data.args;
  return [];
}

function createWebGPUContext(task = {}) {
  const gpu = globalThis.navigator?.gpu ?? null;
  const required = task.webgpu?.required === true;
  if (required && !gpu) {
    throw new Error('WebGPU is required for this task but navigator.gpu is unavailable');
  }

  return {
    supported: !!gpu,
    gpu,
    async requestAdapter(options = task.webgpu?.adapterOptions) {
      if (!gpu) return null;
      return gpu.requestAdapter(options);
    },
    async requestDevice(options = {}) {
      if (!gpu) return null;
      const adapter = options.adapter || await gpu.requestAdapter(options.adapterOptions || task.webgpu?.adapterOptions);
      if (!adapter) return null;
      return adapter.requestDevice(options.deviceDescriptor || task.webgpu?.deviceDescriptor);
    }
  };
}

async function createWasmContext(task) {
  const wasmConfig = task.wasm || {};
  const source = wasmConfig.source ?? task.wasmSource ?? task.source;
  if (!source) {
    throw new Error('wasm tasks require wasm.source');
  }

  const module = await compileWasmModule(source);
  const imports = await resolveImports(wasmConfig, {
    task,
    data: task.data ?? null,
    WebAssembly
  });
  const instance = await WebAssembly.instantiate(module, imports);
  writeInputViews(instance, wasmConfig, task.data ?? null);

  return {
    module,
    instance,
    exports: instance.exports,
    imports,
    task,
    data: task.data ?? null,
    callExport(name, args = []) {
      const fn = instance.exports?.[name];
      if (typeof fn !== 'function') {
        throw new Error(`WASM export "${name}" was not found`);
      }
      return fn(...args);
    },
    readOutputViews() {
      return readOutputViews(instance, wasmConfig);
    },
    writeInputViews(data) {
      writeInputViews(instance, wasmConfig, data);
    }
  };
}

async function adaptWasmResult(task, wasm, payload) {
  const wasmConfig = task.wasm || {};
  if (!wasmConfig.resultModule) {
    return payload.value;
  }

  const mod = await loadHelperModule(wasmConfig.resultModule);
  const exportName = wasmConfig.resultExport || 'default';
  const adapter = mod[exportName];
  if (typeof adapter !== 'function') {
    throw new Error(`WASM result export "${exportName}" must be a function`);
  }

  const adapted = await adapter({
    ...payload,
    wasm,
    task,
    data: task.data ?? null
  });

  return typeof adapted === 'undefined' ? payload : adapted;
}

export async function executeWasmTask(task) {
  const wasm = await createWasmContext(task);
  const wasmConfig = task.wasm || {};
  const args = normalizeArgs(task, wasmConfig);
  const returnValue = wasmConfig.entry ? await wasm.callExport(wasmConfig.entry, args) : undefined;
  const outputs = wasm.readOutputViews();

  const defaultPayload = outputs
    ? (typeof returnValue === 'undefined' ? outputs : { returnValue, outputs })
    : returnValue;

  return adaptWasmResult(task, wasm, {
    returnValue,
    outputs,
    value: defaultPayload
  });
}

export async function executeWasmWebGPUTask(task) {
  const wasm = await createWasmContext(task);
  const modulePath = task.hostModule || task.module;
  if (!modulePath) {
    throw new Error('wasm-webgpu tasks require hostModule or module');
  }

  if (task.wasm?.callEntryBeforeHost && task.wasm.entry) {
    wasm.entryResult = await wasm.callExport(task.wasm.entry, normalizeArgs(task, task.wasm));
  }

  const mod = await loadHelperModule(modulePath);
  const exportName = task.hostExport || task.exportName || 'default';
  const handler = mod[exportName];
  if (typeof handler !== 'function') {
    throw new Error(`wasm-webgpu host export "${exportName}" must be a function`);
  }

  return handler({
    task,
    data: task.data ?? null,
    wasm,
    webgpu: createWebGPUContext(task)
  });
}
