import {
  ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA
} from './UlgHandoffServiceHost.js';

export const ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA = 'peercompute.ulg.dispatch-service-adapter.v0';
export const ULG_DISPATCH_SERVICE_RESULT_SCHEMA = 'peercompute.ulg.dispatch-service-result.v0';
export const ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA = 'peercompute.ulg.dispatch-service-telemetry.v0';
export const ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA = 'peercompute.ulg.dispatch-service-artifact.v0';
export const ULG_DISPATCH_SERVICE_HANDLER_CONTEXT_SCHEMA = 'peercompute.ulg.dispatch-service-handler-context.v0';

const ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA = 'eshkol.ulg.closure-output-semantics.v0';
const ESHKOL_HOST_RUNTIME_EXECUTION_SCHEMA = 'peercompute.ulg.eshkol-host-runtime-execution.v0';
const ESHKOL_OUTPUT_SEMANTICS_VALIDATION_SCHEMA = 'peercompute.ulg.eshkol-output-semantics-validation.v0';
const ESHKOL_MAGNETAR_INTERPOLATION_TABLE_SCHEMA = 'eshkol.ulg.magnetar-closure-interpolation-table.v0';
const ESHKOL_MAGNETAR_INTERPOLATION_TABLE_FIXTURE_SCOPE = 'reduced-smoke-fixture-not-magnetar-physics';
const ESHKOL_MAGNETAR_TENSOR_RUNTIME_CONTRACT_SCHEMA = 'eshkol.ulg.magnetar-closure-tensor-runtime-contract.v0';
const ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA = 'eshkol.ulg.production-handler-boundary.v0';
const ESHKOL_INTERPOLATION_TABLE_STATUSES = new Set(['declared-not-computed', 'computed-fixture']);

const DEFAULT_ADAPTERS = Object.freeze({
  moonlab: {
    sourceService: 'moonlab',
    serviceId: 'moonlab-ulg-fixture',
    workerModule: '/peercompute/ulg/moonlab-dispatch-service-host.js',
    childWorkerModule: '/peercompute/ulg/moonlab-core-dispatch.worker.js',
    taskKinds: ['moonlab.ulg.quantum-response.ingest'],
    capabilities: ['ulg.dispatch.moonlab.ingest', 'ulg.quantum-response.ingest'],
    acceptedArtifactKinds: ['quantum-response']
  },
  eshkol: {
    sourceService: 'eshkol',
    serviceId: 'eshkol-ulg-fixture',
    workerModule: '/peercompute/ulg/eshkol-dispatch-service-host.js',
    childWorkerModule: '/peercompute/ulg/eshkol-closure-dispatch.worker.js',
    taskKinds: ['eshkol.ulg.closure-artifact.ingest', 'eshkol.ulg.closure.descriptor-bind'],
    capabilities: ['ulg.dispatch.eshkol.ingest', 'ulg.closure-artifact.ingest'],
    acceptedArtifactKinds: ['closure']
  }
});

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function stringOrNull(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => stringOrNull(value)).filter(Boolean))];
}

function canonicalSha256Digest(value) {
  return /^sha256:[a-f0-9]{64}$/i.test(String(value || ''));
}

function createArtifactContentHash(payload = {}, task = {}, serviceId = 'ulg-dispatch-service') {
  return payload.artifactContentHash
    || payload.artifactRefUri
    || `${serviceId}:${payload.dispatchId || task.taskId || 'dispatch-artifact'}`;
}

function finiteNumberOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function normalizeWasmBytes(value) {
  if (!value) return null;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
  }
  if (Array.isArray(value)) return new Uint8Array(value);
  if (value?.type === 'Buffer' && Array.isArray(value.data)) return new Uint8Array(value.data);
  return null;
}

function wasmEntriesByKind(entries = []) {
  return entries.reduce((counts, entry) => {
    const kind = entry?.kind || 'unknown';
    counts[kind] = (counts[kind] || 0) + 1;
    return counts;
  }, {});
}

function countReadyReferences(references = []) {
  return Array.isArray(references)
    ? references.filter((entry) => entry?.ready === true).length
    : 0;
}

function objectOrNull(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function createBoundaryFromSummaryFields(summary = {}) {
  if (summary.eshkolProductionHandlerBoundarySchema !== ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA) return null;
  return {
    schema: summary.eshkolProductionHandlerBoundarySchema,
    status: summary.eshkolProductionHandlerBoundaryStatus || null,
    handlerReady: summary.eshkolProductionHandlerBoundaryHandlerReady,
    runtimeExecution: summary.eshkolProductionHandlerBoundaryRuntimeExecution,
    scientificValidation: summary.eshkolProductionHandlerBoundaryScientificValidation,
    fullPhysicsValidation: summary.eshkolProductionHandlerBoundaryFullPhysicsValidation,
    fullFidelityMagnetarSimulation: summary.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation
  };
}

function findEshkolProductionHandlerBoundary({ artifact = {}, summary = {}, descriptor = null, binding = null } = {}) {
  const candidates = [
    summary.eshkolProductionHandlerBoundary,
    createBoundaryFromSummaryFields(summary),
    artifact.productionHandlerBoundary,
    artifact.validation?.productionHandlerBoundary,
    artifact.runtime?.productionHandlerBoundary,
    artifact.metadata?.productionHandlerBoundary,
    descriptor?.productionHandlerBoundary,
    binding?.productionHandlerBoundary,
    binding?.runtimeBinding?.productionHandlerBoundary,
    binding?.closureTensorRuntimeContract?.productionHandlerBoundary
  ];
  return candidates
    .map((entry) => objectOrNull(entry))
    .find((entry) => entry?.schema === ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA)
    || null;
}

function normalizeEshkolProductionHandlerBoundary(boundary = null) {
  if (!boundary) return null;
  const runtimeExecution = typeof boundary.runtimeExecution === 'boolean'
    ? boundary.runtimeExecution
    : (typeof boundary.runtimeExecuted === 'boolean' ? boundary.runtimeExecuted : null);
  const validationBlockers = uniqueStrings([
    boundary.schema === ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA
      ? null
      : 'eshkol-production-handler-boundary-schema-mismatch',
    boundary.handlerReady === false
      ? null
      : 'eshkol-production-handler-boundary-handler-readiness-overstated',
    runtimeExecution === false
      ? null
      : 'eshkol-production-handler-boundary-runtime-execution-overstated',
    boundary.scientificValidation === false
      ? null
      : 'eshkol-production-handler-boundary-scientific-validation-overstated',
    boundary.fullPhysicsValidation === false
      ? null
      : 'eshkol-production-handler-boundary-full-physics-validation-overstated',
    boundary.fullFidelityMagnetarSimulation === false
      ? null
      : 'eshkol-production-handler-boundary-full-fidelity-overstated'
  ]);
  const ready = validationBlockers.length === 0;
  return {
    schema: boundary.schema || null,
    status: boundary.status || (ready ? 'production-handler-boundary-declared-not-executed' : 'production-handler-boundary-blocked'),
    ready,
    handlerReady: typeof boundary.handlerReady === 'boolean' ? boundary.handlerReady : null,
    runtimeExecution,
    scientificValidation: typeof boundary.scientificValidation === 'boolean'
      ? boundary.scientificValidation
      : null,
    fullPhysicsValidation: typeof boundary.fullPhysicsValidation === 'boolean'
      ? boundary.fullPhysicsValidation
      : null,
    fullFidelityMagnetarSimulation: typeof boundary.fullFidelityMagnetarSimulation === 'boolean'
      ? boundary.fullFidelityMagnetarSimulation
      : null,
    boundaryId: stringOrNull(boundary.boundaryId || boundary.id),
    handlerProtocol: stringOrNull(boundary.handlerProtocol || boundary.protocol),
    validationBlockerCount: validationBlockers.length,
    validationBlockers
  };
}

function idsFromDescriptors(entries = []) {
  return Array.isArray(entries)
    ? entries.map((entry) => stringOrNull(entry?.id)).filter(Boolean)
    : [];
}

function arraysEqual(left = [], right = []) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function arrayProduct(values = []) {
  return Array.isArray(values) && values.length > 0
    ? values.reduce((product, value) => product * Number(value), 1)
    : null;
}

function expectedTensorByteLength(descriptor = {}) {
  const elementCount = arrayProduct(descriptor.shape);
  if (!Number.isFinite(elementCount) || elementCount <= 0) return null;
  if (descriptor.dtype === 'f64') return elementCount * 8;
  if (descriptor.dtype === 'f32') return elementCount * 4;
  return null;
}

function wasmImportKey(entry = {}) {
  return `${entry.module || ''}:${entry.name || ''}:${entry.kind || ''}`;
}

function wasmExportKey(entry = {}) {
  return `${entry.name || ''}:${entry.kind || ''}`;
}

function wasmMetadataMatches(observed = [], declared = [], keyFn) {
  if (!Array.isArray(declared) || declared.length === 0) return null;
  const observedKeys = new Set(observed.map(keyFn));
  const declaredKeys = declared.map(keyFn);
  return observed.length === declared.length && declaredKeys.every((key) => observedKeys.has(key));
}

function declaredCount(summaryValue, declaredEntries = []) {
  const summaryCount = finiteNumberOrNull(summaryValue);
  if (summaryCount != null) return summaryCount;
  return Array.isArray(declaredEntries) && declaredEntries.length > 0 ? declaredEntries.length : null;
}

function readUnsignedLeb128(bytes, offset = 0) {
  let result = 0;
  let shift = 0;
  let nextOffset = offset;
  while (nextOffset < bytes.length) {
    const byte = bytes[nextOffset];
    nextOffset += 1;
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      return { value: result >>> 0, offset: nextOffset };
    }
    shift += 7;
  }
  throw new Error('Malformed WASM varuint');
}

function getWasmStartFunctionIndex(wasmBytes) {
  const bytes = wasmBytes instanceof Uint8Array ? wasmBytes : new Uint8Array(wasmBytes);
  if (bytes.length < 8) return null;
  const magicOk = bytes[0] === 0x00 && bytes[1] === 0x61 && bytes[2] === 0x73 && bytes[3] === 0x6d;
  if (!magicOk) return null;
  let offset = 8;
  while (offset < bytes.length) {
    const sectionId = bytes[offset];
    offset += 1;
    const sectionSize = readUnsignedLeb128(bytes, offset);
    offset = sectionSize.offset;
    const sectionEnd = offset + sectionSize.value;
    if (sectionEnd > bytes.length) return null;
    if (sectionId === 8) {
      return readUnsignedLeb128(bytes, offset).value;
    }
    offset = sectionEnd;
  }
  return null;
}

function createClosureHostRuntimeTable(initial = 64) {
  try {
    return new WebAssembly.Table({ initial, element: 'anyfunc' });
  } catch {
    return new WebAssembly.Table({ initial, element: 'funcref' });
  }
}

function findDeclaredImportEntry(observed = {}, declaredImports = []) {
  return declaredImports.find((entry) => (
    entry?.module === observed.module
    && entry?.name === observed.name
    && entry?.kind === observed.kind
  )) || null;
}

function createEshkolHostRuntimeStubImports(observedImports = [], declaredImports = [], options = {}) {
  const importObject = {};
  const calls = [];
  let functionStubCount = 0;
  let memoryStubCount = 0;
  let globalStubCount = 0;
  let tableStubCount = 0;

  const ensureModule = (moduleName = 'env') => {
    if (!importObject[moduleName]) importObject[moduleName] = {};
    return importObject[moduleName];
  };

  for (const entry of observedImports) {
    const moduleName = entry.module || 'env';
    const name = entry.name || '';
    const moduleImports = ensureModule(moduleName);
    if (!name || moduleImports[name]) continue;
    const declared = findDeclaredImportEntry(entry, declaredImports);
    if (entry.kind === 'function') {
      functionStubCount += 1;
      moduleImports[name] = (...args) => {
        calls.push({ module: moduleName, name, argCount: args.length });
        return 0;
      };
    } else if (entry.kind === 'memory') {
      memoryStubCount += 1;
      const limits = objectOrNull(declared?.limits);
      const fallbackInitial = Math.max(1, Math.floor(Number(options.memoryInitialPages || 256)));
      const initial = Number.isFinite(Number(limits?.minimum))
        ? Math.max(fallbackInitial, Math.floor(Number(limits.minimum)))
        : fallbackInitial;
      const descriptor = { initial };
      if (limits?.hasMaximum === true && Number.isFinite(Number(limits.maximum))) {
        descriptor.maximum = Math.max(initial, Math.floor(Number(limits.maximum)));
      }
      moduleImports[name] = new WebAssembly.Memory(descriptor);
    } else if (entry.kind === 'global') {
      globalStubCount += 1;
      const valueType = declared?.valueType === 'i64' ? 'i64' : 'i32';
      const mutable = typeof declared?.mutable === 'boolean' ? declared.mutable : true;
      const initialValue = valueType === 'i64'
        ? 0n
        : (name === '__stack_pointer' ? (options.stackPointerValue || 1048576) : 0);
      moduleImports[name] = new WebAssembly.Global({ value: valueType, mutable }, initialValue);
    } else if (entry.kind === 'table') {
      tableStubCount += 1;
      const limits = objectOrNull(declared?.limits);
      const fallbackInitial = Math.max(0, Math.floor(Number(options.tableInitial || 256)));
      const initial = Number.isFinite(Number(limits?.minimum))
        ? Math.max(fallbackInitial, Math.floor(Number(limits.minimum)))
        : fallbackInitial;
      moduleImports[name] = createClosureHostRuntimeTable(initial);
    }
  }

  return {
    importObject,
    calls,
    functionStubCount,
    memoryStubCount,
    globalStubCount,
    tableStubCount
  };
}

async function dryProbeEshkolHostRuntime({ module, wasmBytes, observedImports = [], declaredImports = [], entryExport = 'main' }) {
  const startFunctionIndex = getWasmStartFunctionIndex(wasmBytes);
  if (startFunctionIndex !== null) {
    return {
      schema: 'peercompute.ulg.eshkol-host-runtime-dry-probe.v0',
      status: 'blocked-start-section',
      ready: false,
      mode: 'stub-import-dry-instantiate-v0',
      stubbed: false,
      importObjectCreated: false,
      instantiated: false,
      importCount: observedImports.length,
      functionStubCount: 0,
      memoryStubCount: 0,
      globalStubCount: 0,
      tableStubCount: 0,
      stubCallCount: 0,
      startFunctionIndex,
      entryExport,
      entryExportAvailable: false,
      mainInvoked: false,
      scientificExecution: false,
      error: 'WASM start section present; dry instantiate with inert host imports is blocked.'
    };
  }

  const stub = createEshkolHostRuntimeStubImports(observedImports, declaredImports);
  let instance = null;
  let error = null;
  try {
    instance = await WebAssembly.instantiate(module, stub.importObject);
  } catch (err) {
    error = err?.message || String(err);
  }
  const exports = instance?.exports || {};
  const entryExportAvailable = typeof exports[entryExport] === 'function';
  const ready = Boolean(instance && entryExportAvailable);
  return {
    schema: 'peercompute.ulg.eshkol-host-runtime-dry-probe.v0',
    status: ready ? 'host-runtime-dry-probe-ready' : 'host-runtime-dry-probe-pending',
    ready,
    mode: 'stub-import-dry-instantiate-v0',
    stubbed: true,
    importObjectCreated: true,
    instantiated: Boolean(instance),
    importCount: observedImports.length,
    functionStubCount: stub.functionStubCount,
    memoryStubCount: stub.memoryStubCount,
    globalStubCount: stub.globalStubCount,
    tableStubCount: stub.tableStubCount,
    stubCallCount: stub.calls.length,
    startFunctionIndex,
    entryExport,
    entryExportAvailable,
    mainInvoked: false,
    scientificExecution: false,
    error
  };
}

function entryArgsForSignature(signature = {}, fallbackExport = 'main') {
  const parameters = Array.isArray(signature?.parameters) ? signature.parameters : [];
  if (parameters.length === 0) return [];
  if (parameters.length === 0 && fallbackExport === 'main') return [0, 0];
  return parameters.map((type) => (type === 'i64' ? 0n : 0));
}

function serializeWasmValue(value) {
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || value == null) return value;
  return String(value);
}

function compareSerializedScalar(actual, expected) {
  if (actual == null || expected == null) return actual == null && expected == null;
  return String(serializeWasmValue(actual)) === String(serializeWasmValue(expected));
}

function compareSerializedArray(actual = [], expected = []) {
  if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) return false;
  return actual.every((value, index) => compareSerializedScalar(value, expected[index]));
}

function entryArgsMatchSignature(entryArgs = [], signature = {}) {
  const parameters = Array.isArray(signature?.parameters) ? signature.parameters : [];
  return Array.isArray(entryArgs) && entryArgs.length === parameters.length;
}

async function sha256Utf8(text) {
  if (!globalThis.crypto?.subtle) return null;
  const encoded = new TextEncoder().encode(String(text));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
  return `sha256:${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')}`;
}

function createEshkolHostRuntimeExecutionImports(observedImports = [], declaredImports = [], options = {}) {
  const stub = createEshkolHostRuntimeStubImports(observedImports, declaredImports, {
    ...options,
    memoryInitialPages: options.memoryInitialPages || 256,
    tableInitial: options.tableInitial || 256,
    stackPointerValue: options.stackPointerValue || 1048576
  });
  const output = [];
  const calls = [];
  const env = stub.importObject.env || {};
  stub.importObject.env = env;
  const record = (name, args) => {
    calls.push({ name, argCount: args.length });
  };
  const pushChar = (value) => {
    const charCode = Number(value) & 0xff;
    output.push(String.fromCharCode(charCode));
    return charCode;
  };

  env.__eshkol_register_parallel_workers = (...args) => { record('__eshkol_register_parallel_workers', args); };
  env.eshkol_init_stack_size = (...args) => { record('eshkol_init_stack_size', args); };
  env.eshkol_runtime_init = (...args) => { record('eshkol_runtime_init', args); return 0; };
  env.get_global_arena = (...args) => { record('get_global_arena', args); return options.globalArenaPtr || 1; };
  env.eshkol_lambda_registry_init = (...args) => { record('eshkol_lambda_registry_init', args); };
  env.__eshkol_lib_init__ = (...args) => { record('__eshkol_lib_init__', args); };
  env.eshkol_display_value = (value, ...args) => {
    record('eshkol_display_value', [value, ...args]);
    output.push(String(value));
  };
  env.eshkol_runtime_current_output_fp = (...args) => {
    record('eshkol_runtime_current_output_fp', args);
    return options.outputFilePointer || 0;
  };
  env.fputc = (charCode, fp) => {
    record('fputc', [charCode, fp]);
    return pushChar(charCode);
  };

  return { ...stub, output, calls };
}

async function validateEshkolOutputSemantics(execution = {}, outputSemantics = null) {
  const blockers = [];
  const semantics = objectOrNull(outputSemantics);
  const stdout = objectOrNull(semantics?.stdout) || {};
  const outputText = String(execution.outputText || '');
  const outputByteLength = new TextEncoder().encode(outputText).length;
  const outputSha256 = await sha256Utf8(outputText);
  if (!semantics) {
    blockers.push('eshkol-output-semantics-missing');
  }
  if (semantics && semantics.schema !== ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA) {
    blockers.push('eshkol-output-semantics-schema-unrecognized');
  }
  if (semantics && semantics.semanticScope !== 'smoke-fixture') {
    blockers.push('eshkol-output-semantics-scope-unsupported');
  }
  if (semantics && semantics.scientificValidation !== false) {
    blockers.push('eshkol-output-semantics-scientific-scope-invalid');
  }
  if (semantics?.entryExport && semantics.entryExport !== execution.entryExport) {
    blockers.push('eshkol-output-entry-export-mismatch');
  }
  if (Array.isArray(semantics?.entryArgs) && !compareSerializedArray(execution.entryArgs || [], semantics.entryArgs)) {
    blockers.push('eshkol-output-entry-args-mismatch');
  }
  if (
    semantics
    && Object.prototype.hasOwnProperty.call(semantics, 'expectedEntryResult')
    && !compareSerializedScalar(execution.entryResult, semantics.expectedEntryResult)
  ) {
    blockers.push('eshkol-output-entry-result-mismatch');
  }
  if (Number.isFinite(Number(stdout.byteLength)) && Number(stdout.byteLength) !== outputByteLength) {
    blockers.push('eshkol-output-stdout-byte-length-mismatch');
  }
  if (stdout.sha256 && (!outputSha256 || stdout.sha256 !== outputSha256)) {
    blockers.push(outputSha256 ? 'eshkol-output-stdout-sha256-mismatch' : 'eshkol-output-stdout-sha256-unavailable');
  }
  if (typeof stdout.expectedText === 'string' && stdout.expectedText !== outputText) {
    blockers.push('eshkol-output-stdout-text-mismatch');
  }
  if (execution.ready !== true) {
    blockers.push('eshkol-host-runtime-execution-not-ready');
  }
  return {
    schema: ESHKOL_OUTPUT_SEMANTICS_VALIDATION_SCHEMA,
    status: blockers.length === 0 ? 'output-semantics-validated' : 'output-semantics-pending',
    ready: blockers.length === 0,
    sourceSchema: semantics?.schema || null,
    semanticScope: semantics?.semanticScope || null,
    scientificScope: semantics?.scientificScope || null,
    scientificValidation: semantics?.scientificValidation === true,
    expected: {
      entryExport: semantics?.entryExport || null,
      entryArgs: Array.isArray(semantics?.entryArgs) ? [...semantics.entryArgs] : null,
      entryResult: semantics?.expectedEntryResult ?? null,
      stdoutSha256: stdout.sha256 || null,
      stdoutByteLength: Number.isFinite(Number(stdout.byteLength)) ? Number(stdout.byteLength) : null,
      stdoutExpectedTextProvided: typeof stdout.expectedText === 'string'
    },
    observed: {
      entryExport: execution.entryExport || null,
      entryArgs: Array.isArray(execution.entryArgs) ? [...execution.entryArgs.map(serializeWasmValue)] : [],
      entryResult: serializeWasmValue(execution.entryResult),
      stdoutSha256: outputSha256,
      stdoutByteLength: outputByteLength
    },
    blockers: uniqueStrings(blockers)
  };
}

function preflightEshkolOutputSemantics({
  outputSemantics = null,
  artifact = {},
  entryExport = 'main',
  hasEntryExport = false,
  startFunctionIndex = null,
  importMetadataMatches = null,
  exportMetadataMatches = null
} = {}) {
  const blockers = [];
  const semantics = objectOrNull(outputSemantics);
  const stdout = objectOrNull(semantics?.stdout) || {};
  const artifactEntryExport = artifact.execution?.entryExport || entryExport;
  if (!semantics) {
    blockers.push('eshkol-output-semantics-missing');
  }
  if (semantics && semantics.schema !== ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA) {
    blockers.push('eshkol-output-semantics-schema-unrecognized');
  }
  if (semantics && semantics.semanticScope !== 'smoke-fixture') {
    blockers.push('eshkol-output-semantics-scope-unsupported');
  }
  if (semantics && semantics.scientificScope !== 'none') {
    blockers.push('eshkol-output-semantics-scientific-scope-invalid');
  }
  if (semantics && semantics.scientificValidation !== false) {
    blockers.push('eshkol-output-semantics-scientific-validation-overstated');
  }
  if (!semantics?.entryExport || semantics.entryExport !== artifactEntryExport) {
    blockers.push('eshkol-output-entry-export-mismatch');
  }
  if (!Array.isArray(semantics?.entryArgs) || !entryArgsMatchSignature(semantics.entryArgs, artifact.execution?.entrySignature || {})) {
    blockers.push('eshkol-output-entry-args-mismatch');
  }
  if (!semantics || !Object.prototype.hasOwnProperty.call(semantics, 'expectedEntryResult')) {
    blockers.push('eshkol-output-expected-entry-result-missing');
  }
  if (!stdout.sha256 && !Number.isFinite(Number(stdout.byteLength)) && typeof stdout.expectedText !== 'string') {
    blockers.push('eshkol-output-stdout-expectation-missing');
  }
  if (startFunctionIndex !== null || artifact.execution?.hasStartSection === true) {
    blockers.push('eshkol-output-start-section-present');
  }
  if (artifact.execution?.serviceWorkerSafe !== true) {
    blockers.push('eshkol-output-service-worker-safe-missing');
  }
  if (artifact.validity?.requiresDynamicCode !== false) {
    blockers.push('eshkol-output-dynamic-code-policy-invalid');
  }
  if (hasEntryExport !== true) {
    blockers.push('eshkol-output-entry-export-unavailable');
  }
  if (importMetadataMatches === false) {
    blockers.push('eshkol-output-import-metadata-mismatch');
  }
  if (exportMetadataMatches === false) {
    blockers.push('eshkol-output-export-metadata-mismatch');
  }
  return {
    schema: 'peercompute.ulg.eshkol-output-semantics-preflight.v0',
    status: blockers.length === 0 ? 'output-semantics-execution-allowed' : 'output-semantics-execution-blocked',
    ready: blockers.length === 0,
    blockers: uniqueStrings(blockers),
    sourceSchema: semantics?.schema || null,
    semanticScope: semantics?.semanticScope || null,
    scientificScope: semantics?.scientificScope || null,
    scientificValidation: semantics?.scientificValidation === true,
    entryExport: semantics?.entryExport || null,
    entryArgs: Array.isArray(semantics?.entryArgs) ? [...semantics.entryArgs] : null,
    expectedEntryResultDeclared: semantics
      ? Object.prototype.hasOwnProperty.call(semantics, 'expectedEntryResult')
      : false,
    stdoutExpectationDeclared: Boolean(
      stdout.sha256 || Number.isFinite(Number(stdout.byteLength)) || typeof stdout.expectedText === 'string'
    ),
    startFunctionIndex,
    hasEntryExport
  };
}

async function executeEshkolHostRuntime({ module, observedImports = [], declaredImports = [], entryExport = 'main', entrySignature = null, outputSemantics = null, preflight = null }) {
  if (preflight?.ready !== true) {
    return {
      schema: ESHKOL_HOST_RUNTIME_EXECUTION_SCHEMA,
      status: 'host-runtime-execution-preflight-blocked',
      ready: false,
      mode: 'dom-free-eshkol-host-imports-v0',
      instantiated: false,
      entryInvoked: false,
      entryExport,
      entryArgs: Array.isArray(outputSemantics?.entryArgs) ? [...outputSemantics.entryArgs] : [],
      entryResult: null,
      outputPreview: '',
      outputByteLength: 0,
      runtimeCallCount: 0,
      calledImports: [],
      mainInvoked: false,
      scientificExecution: false,
      preflight: clonePlain(preflight),
      outputSemanticsValidation: null,
      blockers: clonePlain(preflight?.blockers || ['eshkol-output-semantics-preflight-blocked']),
      error: null
    };
  }
  const stub = createEshkolHostRuntimeExecutionImports(observedImports, declaredImports);
  let instance = null;
  let entryInvoked = false;
  let entryResult = null;
  let error = null;
  const entryArgs = Array.isArray(outputSemantics?.entryArgs)
    ? [...outputSemantics.entryArgs]
    : entryArgsForSignature(entrySignature, entryExport);
  try {
    instance = await WebAssembly.instantiate(module, stub.importObject);
    const entry = instance.exports?.[entryExport];
    if (typeof entry !== 'function') {
      throw new Error(`Entry export ${entryExport} is unavailable`);
    }
    entryResult = entry(...entryArgs);
    entryInvoked = true;
  } catch (err) {
    error = err?.message || String(err);
  }
  const outputText = stub.output.join('');
  const execution = {
    schema: ESHKOL_HOST_RUNTIME_EXECUTION_SCHEMA,
    status: entryInvoked && !error ? 'host-runtime-executed' : 'host-runtime-execution-blocked',
    ready: entryInvoked && !error,
    mode: 'dom-free-eshkol-host-imports-v0',
    instantiated: Boolean(instance),
    entryInvoked,
    entryExport,
    entryArgs: entryArgs.map(serializeWasmValue),
    entryResult: serializeWasmValue(entryResult),
    outputPreview: outputText.slice(0, 120),
    outputByteLength: new TextEncoder().encode(outputText).length,
    outputText,
    runtimeCallCount: stub.calls.length,
    calledImports: stub.calls.map((entry) => entry.name),
    mainInvoked: entryExport === 'main' && entryInvoked,
    scientificExecution: false,
    preflight: clonePlain(preflight),
    error
  };
  const outputSemanticsValidation = await validateEshkolOutputSemantics(execution, outputSemantics);
  return {
    ...execution,
    outputText: undefined,
    outputSemanticsValidation,
    ready: execution.ready === true && outputSemanticsValidation.ready === true,
    status: execution.ready === true && outputSemanticsValidation.ready === true
      ? 'host-runtime-output-semantics-validated'
      : execution.status,
    blockers: uniqueStrings([
      ...(outputSemanticsValidation.blockers || []),
      execution.ready === true ? null : 'eshkol-host-runtime-execution-not-ready'
    ])
  };
}

function adapterConfig(sourceService, options = {}) {
  const key = String(sourceService || '').trim().toLowerCase();
  const defaults = DEFAULT_ADAPTERS[key];
  if (!defaults) {
    throw new Error(`Unsupported ULG dispatch adapter sourceService: ${sourceService}`);
  }
  const serviceIds = options.serviceIds || {};
  return {
    ...defaults,
    ...clonePlain(options),
    sourceService: defaults.sourceService,
    serviceId: options.serviceId || serviceIds[key] || defaults.serviceId,
    taskKinds: [...(options.taskKinds || defaults.taskKinds)],
    capabilities: [...(options.capabilities || defaults.capabilities)],
    acceptedArtifactKinds: [...(options.acceptedArtifactKinds || defaults.acceptedArtifactKinds)]
  };
}

function createManifestForSource(sourceService, options = {}) {
  const config = adapterConfig(sourceService, options);
  const childWorkerModule = options.childWorkerModule || config.childWorkerModule;
  const allowedModules = uniqueStrings([
    childWorkerModule,
    ...(options.childWorkers?.allowedModules || [])
  ]);
  const childWorkers = {
    allowed: options.childWorkers?.allowed ?? true,
    maxChildren: options.childWorkers?.maxChildren ?? 1,
    allowedModules,
    sameOriginOnly: options.childWorkers?.sameOriginOnly ?? true
  };
  return {
    serviceId: config.serviceId,
    version: options.version || '0.1.0',
    runtime: options.runtime || 'js',
    entry: {
      adapter: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
      workerModule: options.workerModule || config.workerModule
    },
    childWorkers,
    resources: clonePlain(options.resources || {}),
    capabilities: config.capabilities,
    taskKinds: config.taskKinds,
    abi: {
      inputEnvelopeSchema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      outputEnvelopeSchema: ULG_DISPATCH_SERVICE_RESULT_SCHEMA,
      artifactSchema: ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA,
      ...(clonePlain(options.abi || {}))
    },
    contract: {
      schema: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
      serviceId: config.serviceId,
      sourceService: config.sourceService,
      inputSchemas: [ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA],
      outputSchemas: [ULG_DISPATCH_SERVICE_RESULT_SCHEMA, ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA],
      acceptedArtifactKinds: config.acceptedArtifactKinds,
      relaySafeArtifactsRequired: true,
      contentAddressedArtifactsRequired: true
    },
    validation: {
      requiresArtifactPayload: true,
      requiresArtifactRef: true,
      requiresContentHash: true,
      ...(clonePlain(options.validation || {}))
    },
    metadata: {
      ...(clonePlain(options.metadata || {})),
      domain: config.sourceService,
      dispatchAdapter: true,
      fixture: false,
      acceptedArtifactKinds: config.acceptedArtifactKinds
    }
  };
}

export function createUlgMoonLabDispatchServiceManifest(options = {}) {
  return createManifestForSource('moonlab', options);
}

export function createUlgEshkolDispatchServiceManifest(options = {}) {
  return createManifestForSource('eshkol', options);
}

export function createUlgDispatchServiceManifests(options = {}) {
  const workerModules = options.workerModules || {};
  const childWorkerModules = options.childWorkerModules || {};
  return [
    createUlgMoonLabDispatchServiceManifest({
      ...options,
      serviceId: options.serviceIds?.moonlab || options.moonlabServiceId || options.serviceId,
      workerModule: workerModules.moonlab || options.moonlabWorkerModule || options.workerModule,
      childWorkerModule: childWorkerModules.moonlab || options.moonlabChildWorkerModule || options.childWorkerModule
    }),
    createUlgEshkolDispatchServiceManifest({
      ...options,
      serviceId: options.serviceIds?.eshkol || options.eshkolServiceId || options.serviceId,
      workerModule: workerModules.eshkol || options.eshkolWorkerModule || options.workerModule,
      childWorkerModule: childWorkerModules.eshkol || options.eshkolChildWorkerModule || options.childWorkerModule
    })
  ];
}

function normalizeExpectedSource(manifest = {}) {
  return stringOrNull(manifest.metadata?.domain)
    || (String(manifest.serviceId || '').includes('eshkol') ? 'eshkol' : null)
    || (String(manifest.serviceId || '').includes('moonlab') ? 'moonlab' : null);
}

function acceptedArtifactKinds(manifest = {}) {
  return Array.isArray(manifest.metadata?.acceptedArtifactKinds)
    ? manifest.metadata.acceptedArtifactKinds
    : [];
}

function validateDispatchPayload(task = {}, manifest = {}) {
  const payload = task.artifactPayload;
  const expectedSource = normalizeExpectedSource(manifest);
  const acceptedKinds = acceptedArtifactKinds(manifest);
  const blockers = [];
  if (!payload || typeof payload !== 'object') {
    blockers.push('ulg-dispatch-artifact-payload-missing');
    return { payload: null, blockers, ready: false, expectedSource, acceptedKinds };
  }
  if (payload.schema !== ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA) {
    blockers.push('ulg-dispatch-artifact-payload-schema-mismatch');
  }
  if (expectedSource && payload.sourceService !== expectedSource) {
    blockers.push('ulg-dispatch-artifact-source-mismatch');
  }
  if (acceptedKinds.length > 0 && !acceptedKinds.includes(payload.artifactKind)) {
    blockers.push('ulg-dispatch-artifact-kind-mismatch');
  }
  if (!payload.artifactRefUri) {
    blockers.push('ulg-dispatch-artifact-ref-uri-missing');
  }
  if (!payload.artifactContentHash) {
    blockers.push('ulg-dispatch-artifact-content-hash-missing');
  }
  if (payload.sourceService === 'moonlab' && payload.artifactKind === 'quantum-response') {
    if (payload.artifactSummary?.magnetarDipoleIsingReady !== true) {
      blockers.push('moonlab-quantum-response-calibration-not-ready');
    }
  }
  if (payload.sourceService === 'eshkol' && payload.artifactKind === 'closure') {
    const summary = payload.artifactSummary || {};
    const closureReady = summary.closureReady === true || summary.closureDescriptorReady === true;
    if (!closureReady) {
      blockers.push('eshkol-closure-summary-not-ready');
    }
    const needsWasmBytes = task.taskKind === 'eshkol.ulg.closure-artifact.ingest'
      || payload.hasTransferredWasmBytes === true;
    if (needsWasmBytes && !(payload.wasmByteLength > 0)) {
      blockers.push('eshkol-closure-wasm-bytes-missing');
    }
  }
  return {
    payload,
    blockers: uniqueStrings(blockers),
    ready: blockers.length === 0,
    expectedSource,
    acceptedKinds
  };
}

async function createMoonLabDispatchProbe(payload = {}) {
  const artifact = payload.artifact || {};
  const summary = payload.artifactSummary || {};
  const outputReferences = Array.isArray(artifact.outputs?.references)
    ? artifact.outputs.references
    : [];
  const outputReferenceReadyCount = countReadyReferences(outputReferences);
  const calibration = artifact.calibrationArtifacts?.magnetarDipoleIsing || null;
  const blockers = uniqueStrings([
    summary.magnetarDipoleIsingReady === true
      ? null
      : 'moonlab-magnetar-dipole-ising-not-ready'
  ]);
  return {
    schema: 'peercompute.ulg.moonlab-dispatch-payload-probe.v0',
    status: blockers.length === 0 ? 'pass' : 'blocked',
    ready: blockers.length === 0,
    blockers,
    responseDescriptorSchema: artifact.responseDescriptor?.schema || summary.responseDescriptorSchema || null,
    paritySchema: artifact.parity?.schema || summary.paritySchema || null,
    parityStatus: artifact.parity?.status || summary.parityStatus || null,
    calibrationSchema: calibration?.schema || null,
    calibrationStatus: calibration?.validation?.status || summary.magnetarDipoleIsingStatus || null,
    outputReferenceCount: summary.outputReferenceCount ?? outputReferences.length,
    outputReferenceReadyCount: summary.outputReferenceReadyCount ?? outputReferenceReadyCount,
    magnetarCalibratedReferenceCount: summary.magnetarCalibratedReferenceCount ?? null,
    magnetarCalibratedReferenceReadyCount: summary.magnetarCalibratedReferenceReadyCount ?? null,
    magnetarCalibratedReferenceScientificCoverageCount:
      summary.magnetarCalibratedReferenceScientificCoverageCount ?? null,
    moonlabWebGpuParityScopeReady: summary.moonlabWebGpuParityScopeReady ?? null,
    moonlabWebGpuParityScopeSchema: summary.moonlabWebGpuParityScopeSchema || null,
    moonlabWebGpuParityScopeStatus: summary.moonlabWebGpuParityScopeStatus || null,
    moonlabWebGpuParityScopeBackendAvailable: summary.moonlabWebGpuParityScopeBackendAvailable ?? null,
    moonlabWebGpuParityScopeWebgpuParityExecuted:
      summary.moonlabWebGpuParityScopeWebgpuParityExecuted ?? null,
    moonlabWebGpuParityScopeFullFidelityMagnetarSimulation:
      summary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation ?? null,
    moonlabWebGpuParityScopeFullPhysicsValidation:
      summary.moonlabWebGpuParityScopeFullPhysicsValidation ?? null,
    moonlabWebGpuParityScope: clonePlain(summary.moonlabWebGpuParityScope || null)
  };
}

function createEshkolDescriptorContractProbe(payload = {}, moduleProbe = {}) {
  const summary = payload.artifactSummary || {};
  const artifact = payload.artifact || {};
  const descriptor = objectOrNull(artifact.validation?.closureDescriptor);
  const blockers = [];
  const summaryReady = summary.closureDescriptorReady === true;

  if (!descriptor) {
    return {
      schema: 'peercompute.ulg.eshkol-descriptor-contract-probe.v0',
      status: summaryReady ? 'summary-only-ready' : 'descriptor-not-present',
      ready: summaryReady,
      blockers: [],
      descriptorPresent: false,
      closureDescriptorReady: summaryReady,
      closureDescriptorSchema: summary.closureDescriptorSchema || null,
      scientificExecution: false,
      scientificValidation: false
    };
  }

  const binding = objectOrNull(descriptor.descriptorBinding);
  const tensorContract = objectOrNull(descriptor.tensorContract);
  const handoffEnvelope = objectOrNull(binding?.handoffEnvelope);
  const interpolationTable = objectOrNull(binding?.ulgInterpolationTable);
  const moonlabSuite = objectOrNull(binding?.moonlabNormalizedReferenceSuite);
  const productTopologyBinding = objectOrNull(binding?.peercomputeProductTopologyBinding);
  const tensorRuntimeContract = objectOrNull(binding?.closureTensorRuntimeContract);
  const tensorRuntimeInterpolationTable = objectOrNull(tensorRuntimeContract?.interpolationTable);
  const tensorRuntimeSampleShapeValidation = objectOrNull(tensorRuntimeContract?.sampleShapeValidation);
  const tensorRuntimeDescriptors = objectOrNull(tensorRuntimeContract?.tensorDescriptors) || {};
  const runtimeBinding = objectOrNull(binding?.runtimeBinding);
  const productionHandlerBoundary = normalizeEshkolProductionHandlerBoundary(
    findEshkolProductionHandlerBoundary({ artifact, summary, descriptor, binding })
  );
  const artifactInputIds = idsFromDescriptors(artifact.inputs);
  const artifactOutputIds = idsFromDescriptors(artifact.outputs);
  const tensorInputIds = Array.isArray(tensorContract?.inputIds) ? [...tensorContract.inputIds] : [];
  const tensorOutputIds = Array.isArray(tensorContract?.outputIds) ? [...tensorContract.outputIds] : [];
  const tableInputIds = Array.isArray(interpolationTable?.inputTensorIds) ? [...interpolationTable.inputTensorIds] : [];
  const tableOutputIds = Array.isArray(interpolationTable?.outputTensorIds) ? [...interpolationTable.outputTensorIds] : [];
  const productInputIds = Array.isArray(productTopologyBinding?.inputTensorIds) ? [...productTopologyBinding.inputTensorIds] : [];
  const productOutputIds = Array.isArray(productTopologyBinding?.outputTensorIds) ? [...productTopologyBinding.outputTensorIds] : [];
  const tensorRuntimeInputIds = Array.isArray(tensorRuntimeContract?.inputTensorIds) ? [...tensorRuntimeContract.inputTensorIds] : [];
  const tensorRuntimeOutputIds = Array.isArray(tensorRuntimeContract?.outputTensorIds) ? [...tensorRuntimeContract.outputTensorIds] : [];
  const tensorRuntimeSampleShapeInputIds = Array.isArray(tensorRuntimeSampleShapeValidation?.validatedInputTensorIds)
    ? [...tensorRuntimeSampleShapeValidation.validatedInputTensorIds]
    : [];
  const tensorRuntimeSampleShapeOutputIds = Array.isArray(tensorRuntimeSampleShapeValidation?.validatedOutputTensorIds)
    ? [...tensorRuntimeSampleShapeValidation.validatedOutputTensorIds]
    : [];
  const descriptorEntryExport = descriptor.entryExport || null;
  const moduleEntryExport = moduleProbe.entryExport || summary.closureEntryExport || artifact.execution?.entryExport || null;
  const tensorContractMatches = arraysEqual(artifactInputIds, tensorInputIds)
    && arraysEqual(artifactOutputIds, tensorOutputIds);
  const interpolationTableMatches = arraysEqual(tableInputIds, tensorInputIds)
    && arraysEqual(tableOutputIds, tensorOutputIds)
    && (!interpolationTable?.coordinateSystem || interpolationTable.coordinateSystem === tensorContract?.coordinateSystem);
  const productTopologyMatches = arraysEqual(productInputIds, tensorInputIds)
    && arraysEqual(productOutputIds, tensorOutputIds);
  const entryExportMatches = !descriptorEntryExport
    || !moduleEntryExport
    || descriptorEntryExport === moduleEntryExport;
  const moduleEntryExportAvailable = moduleProbe.hasEntryExport == null
    ? null
    : moduleProbe.hasEntryExport === true;
  const referenceIds = Array.isArray(moonlabSuite?.referenceIds) ? [...moonlabSuite.referenceIds] : [];
  const sampleIds = Array.isArray(binding?.moonlabClosureSurfaceSampleIds) ? [...binding.moonlabClosureSurfaceSampleIds] : [];
  const tableSampleIds = Array.isArray(interpolationTable?.sampleIds) ? [...interpolationTable.sampleIds] : [];
  const tableSamples = Array.isArray(interpolationTable?.samples) ? interpolationTable.samples.filter(objectOrNull) : [];
  const tableSampleCount = finiteNumberOrNull(interpolationTable?.sampleCount);
  const interpolationTableComputedFixture = interpolationTable?.status === 'computed-fixture';
  const tensorRuntimeDescriptorIds = [...tensorRuntimeInputIds, ...tensorRuntimeOutputIds];
  const tensorRuntimeDescriptorsReady = tensorRuntimeDescriptorIds.length > 0
    && tensorRuntimeDescriptorIds.every((id) => {
      const descriptorEntry = objectOrNull(tensorRuntimeDescriptors[id]);
      const expectedDirection = tensorRuntimeInputIds.includes(id) ? 'input' : 'output';
      const expectedByteLength = expectedTensorByteLength(descriptorEntry || {});
      return descriptorEntry
        && descriptorEntry.direction === expectedDirection
        && descriptorEntry.dtype === 'f64'
        && descriptorEntry.layout === 'dense-row-major'
        && Number.isInteger(descriptorEntry.componentCount)
        && descriptorEntry.componentCount > 0
        && expectedByteLength === descriptorEntry.byteLength;
    });
  const tensorRuntimeMatchesTensorContract = arraysEqual(tensorRuntimeInputIds, tensorInputIds)
    && arraysEqual(tensorRuntimeOutputIds, tensorOutputIds);
  const tensorRuntimeMatchesInterpolationTable = tensorRuntimeInterpolationTable?.id === interpolationTable?.id
    && tensorRuntimeInterpolationTable?.schema === interpolationTable?.schema
    && tensorRuntimeInterpolationTable?.contentHash === interpolationTable?.contentHash
    && finiteNumberOrNull(tensorRuntimeInterpolationTable?.sampleCount) === tableSampleCount;
  const tensorRuntimeSampleShapeValidationMatchesTensorContract = arraysEqual(
    tensorRuntimeSampleShapeInputIds,
    tensorInputIds
  ) && arraysEqual(tensorRuntimeSampleShapeOutputIds, tensorOutputIds);
  const tensorRuntimeSampleShapeValidationReady =
    tensorRuntimeSampleShapeValidation?.schema === 'eshkol.ulg.tensor-sample-shape-validation.v0'
    && tensorRuntimeSampleShapeValidation?.status === 'pass'
    && finiteNumberOrNull(tensorRuntimeSampleShapeValidation?.validatedSampleCount) === tableSampleCount
    && tensorRuntimeSampleShapeValidationMatchesTensorContract
    && tensorRuntimeSampleShapeValidation?.scientificValidation === false;
  const interpolationTableDescriptorBindingReady = interpolationTableMatches
    && tensorRuntimeMatchesTensorContract
    && tensorRuntimeMatchesInterpolationTable
    && tensorRuntimeSampleShapeValidationReady;

  if (summary.closureDescriptorSchema && descriptor.schema !== summary.closureDescriptorSchema) {
    blockers.push('eshkol-descriptor-schema-summary-mismatch');
  }
  if (descriptor.scientificValidation !== false) {
    blockers.push('eshkol-descriptor-scientific-validation-overstated');
  }
  if (!tensorContractMatches) {
    blockers.push('eshkol-descriptor-tensor-contract-mismatch');
  }
  if (binding) {
    if (handoffEnvelope?.schema !== 'peercompute.ulg.handoff-service-envelope.v0') {
      blockers.push('eshkol-descriptor-handoff-envelope-schema-mismatch');
    }
    if (handoffEnvelope?.artifactKind !== 'closure' || handoffEnvelope?.sourceService !== 'eshkol') {
      blockers.push('eshkol-descriptor-handoff-artifact-binding-mismatch');
    }
    if (handoffEnvelope?.contentAddressing !== 'required') {
      blockers.push('eshkol-descriptor-content-addressing-not-required');
    }
    if (handoffEnvelope?.relaySafeTransfer !== 'required') {
      blockers.push('eshkol-descriptor-relay-safe-transfer-not-required');
    }
    if (!interpolationTableMatches) {
      blockers.push('eshkol-descriptor-interpolation-table-mismatch');
    }
    if (interpolationTable?.status && !ESHKOL_INTERPOLATION_TABLE_STATUSES.has(interpolationTable.status)) {
      blockers.push('eshkol-descriptor-interpolation-table-status-unsupported');
    }
    if (interpolationTableComputedFixture) {
      if (interpolationTable.schema !== ESHKOL_MAGNETAR_INTERPOLATION_TABLE_SCHEMA) {
        blockers.push('eshkol-descriptor-interpolation-table-schema-mismatch');
      }
      if (interpolationTable.fixtureScope !== ESHKOL_MAGNETAR_INTERPOLATION_TABLE_FIXTURE_SCOPE) {
        blockers.push('eshkol-descriptor-interpolation-table-fixture-scope-mismatch');
      }
      if (interpolationTable.scientificValidation !== false) {
        blockers.push('eshkol-descriptor-interpolation-table-scientific-validation-overstated');
      }
      if (!Number.isInteger(tableSampleCount) || tableSampleCount <= 0) {
        blockers.push('eshkol-descriptor-interpolation-table-sample-count-invalid');
      }
      if (!arraysEqual(tableSampleIds, sampleIds)) {
        blockers.push('eshkol-descriptor-interpolation-table-sample-ids-mismatch');
      }
      if (Number.isInteger(tableSampleCount) && tableSampleCount !== tableSampleIds.length) {
        blockers.push('eshkol-descriptor-interpolation-table-sample-count-mismatch');
      }
      if (tableSamples.length !== tableSampleIds.length) {
        blockers.push('eshkol-descriptor-interpolation-table-sample-payload-mismatch');
      }
      if (!canonicalSha256Digest(interpolationTable.contentHash)) {
        blockers.push('eshkol-descriptor-interpolation-table-content-hash-invalid');
      }
    }
    if (moonlabSuite?.ready !== true) {
      blockers.push('eshkol-descriptor-moonlab-suite-not-ready');
    }
    if (moonlabSuite?.contentHash && !String(moonlabSuite.contentHash).startsWith('sha256:')) {
      blockers.push('eshkol-descriptor-moonlab-suite-hash-invalid');
    }
    if (!productTopologyMatches) {
      blockers.push('eshkol-descriptor-product-topology-mismatch');
    }
    if (productTopologyBinding?.status && productTopologyBinding.status !== 'descriptor-bound-not-executed') {
      blockers.push('eshkol-descriptor-product-topology-overstates-execution');
    }
    if (productTopologyBinding?.scientificValidation !== false) {
      blockers.push('eshkol-descriptor-product-topology-scientific-validation-overstated');
    }
    if (!tensorRuntimeContract) {
      blockers.push('eshkol-descriptor-tensor-runtime-contract-missing');
    } else {
      if (tensorRuntimeContract.schema !== ESHKOL_MAGNETAR_TENSOR_RUNTIME_CONTRACT_SCHEMA) {
        blockers.push('eshkol-descriptor-tensor-runtime-contract-schema-mismatch');
      }
      if (tensorRuntimeContract.status !== 'declared-fixture-contract') {
        blockers.push('eshkol-descriptor-tensor-runtime-contract-status-unsupported');
      }
      if (!canonicalSha256Digest(tensorRuntimeContract.contractHash)) {
        blockers.push('eshkol-descriptor-tensor-runtime-contract-hash-invalid');
      }
      if (tensorRuntimeContract.entryExport !== descriptorEntryExport) {
        blockers.push('eshkol-descriptor-tensor-runtime-entry-export-mismatch');
      }
      if (tensorRuntimeContract.coordinateSystem !== tensorContract?.coordinateSystem) {
        blockers.push('eshkol-descriptor-tensor-runtime-coordinate-system-mismatch');
      }
      if (!tensorRuntimeMatchesTensorContract) {
        blockers.push('eshkol-descriptor-tensor-runtime-ids-mismatch');
      }
      if (!tensorRuntimeDescriptorsReady) {
        blockers.push('eshkol-descriptor-tensor-runtime-descriptors-invalid');
      }
      if (!tensorRuntimeMatchesInterpolationTable) {
        blockers.push('eshkol-descriptor-tensor-runtime-interpolation-table-mismatch');
      }
      if (!tensorRuntimeSampleShapeValidationMatchesTensorContract) {
        blockers.push('eshkol-descriptor-tensor-runtime-sample-shape-validation-ids-mismatch');
      }
      if (!tensorRuntimeSampleShapeValidationReady) {
        blockers.push('eshkol-descriptor-tensor-runtime-sample-shape-validation-not-ready');
      }
      if (tensorRuntimeContract.runtimeStatus !== 'declared-not-executed') {
        blockers.push('eshkol-descriptor-tensor-runtime-overstates-execution');
      }
      if (tensorRuntimeContract.scientificValidation !== false || tensorRuntimeContract.fullPhysicsValidation !== false) {
        blockers.push('eshkol-descriptor-tensor-runtime-scientific-validation-overstated');
      }
    }
    if (runtimeBinding?.runtimeStatus && runtimeBinding.runtimeStatus !== 'declared-not-executed') {
      blockers.push('eshkol-descriptor-runtime-overstates-execution');
    }
    if (runtimeBinding?.derivativeStatus && runtimeBinding.derivativeStatus !== 'declared-not-computed') {
      blockers.push('eshkol-descriptor-runtime-overstates-derivative-computation');
    }
    if (runtimeBinding?.scientificValidation !== false) {
      blockers.push('eshkol-descriptor-runtime-scientific-validation-overstated');
    }
  }
  if (productionHandlerBoundary && productionHandlerBoundary.ready !== true) {
    blockers.push(...productionHandlerBoundary.validationBlockers);
  }
  if (!entryExportMatches) {
    blockers.push('eshkol-descriptor-entry-export-mismatch');
  }
  if (moduleEntryExportAvailable === false) {
    blockers.push('eshkol-descriptor-entry-export-missing');
  }

  return {
    schema: 'peercompute.ulg.eshkol-descriptor-contract-probe.v0',
    status: blockers.length === 0 ? 'descriptor-contract-ready' : 'descriptor-contract-blocked',
    ready: blockers.length === 0,
    blockers: uniqueStrings(blockers),
    descriptorPresent: true,
    closureDescriptorReady: summaryReady,
    closureDescriptorSchema: descriptor.schema || null,
    descriptorRole: descriptor.descriptorRole || null,
    descriptorEntryExport,
    moduleEntryExport,
    entryExportMatches,
    moduleEntryExportAvailable,
    scientificExecution: false,
    scientificValidation: descriptor.scientificValidation === true,
    tensorContract: {
      inputIds: tensorInputIds,
      outputIds: tensorOutputIds,
      coordinateSystem: tensorContract?.coordinateSystem || null,
      interpolation: tensorContract?.interpolation || null,
      artifactInputIds,
      artifactOutputIds,
      matchesArtifactDescriptors: tensorContractMatches
    },
    descriptorBinding: binding ? {
      schema: binding.schema || null,
      bindingId: binding.bindingId || null,
      handoffEnvelopeSchema: handoffEnvelope?.schema || null,
      handoffArtifactKind: handoffEnvelope?.artifactKind || null,
      handoffSourceService: handoffEnvelope?.sourceService || null,
      contentAddressing: handoffEnvelope?.contentAddressing || null,
      relaySafeTransfer: handoffEnvelope?.relaySafeTransfer || null
    } : null,
    interpolationTable: interpolationTable ? {
      schema: interpolationTable.schema || null,
      id: interpolationTable.id || null,
      status: interpolationTable.status || null,
      fixtureScope: interpolationTable.fixtureScope || null,
      scientificValidation: typeof interpolationTable.scientificValidation === 'boolean'
        ? interpolationTable.scientificValidation
        : null,
      computedFixture: interpolationTableComputedFixture,
      sampleCount: tableSampleCount,
      sampleIds: tableSampleIds,
      samplePayloadCount: tableSamples.length,
      contentHash: interpolationTable.contentHash || null,
      coordinateSystem: interpolationTable.coordinateSystem || null,
      inputTensorIds: tableInputIds,
      outputTensorIds: tableOutputIds,
      matchesTensorContract: interpolationTableMatches,
      descriptorBindingReady: interpolationTableDescriptorBindingReady,
      tensorRuntimeMatchesInterpolationTable,
      tensorRuntimeSampleShapeValidationReady
    } : null,
    moonlabNormalizedReferenceSuite: moonlabSuite ? {
      schema: moonlabSuite.schema || null,
      assetId: moonlabSuite.assetId || null,
      contentHash: moonlabSuite.contentHash || null,
      status: moonlabSuite.status || null,
      ready: moonlabSuite.ready === true,
      fidelityRuntimeScope: clonePlain(objectOrNull(moonlabSuite.fidelityRuntimeScope)),
      referenceCount: referenceIds.length,
      referenceFamilyCount: Array.isArray(moonlabSuite.referenceFamilies)
        ? moonlabSuite.referenceFamilies.length
        : 0,
      closureSurfaceSampleCount: sampleIds.length
    } : null,
    productTopologyBinding: productTopologyBinding ? {
      schema: productTopologyBinding.schema || null,
      bindingId: productTopologyBinding.bindingId || null,
      topologyId: productTopologyBinding.topologyId || null,
      status: productTopologyBinding.status || null,
      scientificValidation: productTopologyBinding.scientificValidation === true,
      inputTensorIds: productInputIds,
      outputTensorIds: productOutputIds,
      matchesTensorContract: productTopologyMatches
    } : null,
    tensorRuntimeContract: tensorRuntimeContract ? {
      schema: tensorRuntimeContract.schema || null,
      contractId: tensorRuntimeContract.contractId || null,
      status: tensorRuntimeContract.status || null,
      ready: blockers.length === 0
        && tensorRuntimeContract.schema === ESHKOL_MAGNETAR_TENSOR_RUNTIME_CONTRACT_SCHEMA
        && tensorRuntimeMatchesTensorContract
        && tensorRuntimeMatchesInterpolationTable
        && tensorRuntimeDescriptorsReady,
      contractHash: tensorRuntimeContract.contractHash || null,
      runtimeAbi: tensorRuntimeContract.runtimeAbi || null,
      executionClaim: tensorRuntimeContract.executionClaim || null,
      entryExport: tensorRuntimeContract.entryExport || null,
      tensorMemoryModel: tensorRuntimeContract.tensorMemoryModel || null,
      coordinateSystem: tensorRuntimeContract.coordinateSystem || null,
      inputTensorIds: tensorRuntimeInputIds,
      outputTensorIds: tensorRuntimeOutputIds,
      descriptorCount: tensorRuntimeDescriptorIds.length,
      descriptorsReady: tensorRuntimeDescriptorsReady,
      matchesTensorContract: tensorRuntimeMatchesTensorContract,
      matchesInterpolationTable: tensorRuntimeMatchesInterpolationTable,
      interpolationTableId: tensorRuntimeInterpolationTable?.id || null,
      interpolationTableContentHash: tensorRuntimeInterpolationTable?.contentHash || null,
      interpolationTableSampleCount: finiteNumberOrNull(tensorRuntimeInterpolationTable?.sampleCount),
      sampleShapeValidationSchema: tensorRuntimeSampleShapeValidation?.schema || null,
      sampleShapeValidationStatus: tensorRuntimeSampleShapeValidation?.status || null,
      sampleShapeValidatedSampleCount: finiteNumberOrNull(tensorRuntimeSampleShapeValidation?.validatedSampleCount),
      sampleShapeValidatedInputTensorIds: tensorRuntimeSampleShapeInputIds,
      sampleShapeValidatedOutputTensorIds: tensorRuntimeSampleShapeOutputIds,
      sampleShapeValidationMatchesTensorContract: tensorRuntimeSampleShapeValidationMatchesTensorContract,
      sampleShapeValidationReady: tensorRuntimeSampleShapeValidationReady,
      scientificValidation: tensorRuntimeContract.scientificValidation === true,
      fullPhysicsValidation: tensorRuntimeContract.fullPhysicsValidation === true
    } : null,
    runtimeBinding: runtimeBinding ? {
      schema: runtimeBinding.schema || null,
      runtimeStatus: runtimeBinding.runtimeStatus || null,
      derivativeStatus: runtimeBinding.derivativeStatus || null,
      scientificValidation: runtimeBinding.scientificValidation === true
    } : null,
    productionHandlerBoundary
  };
}

async function createEshkolDispatchProbe(payload = {}, task = {}) {
  const bytes = normalizeWasmBytes(payload.wasmBytes);
  const declaredLength = finiteNumberOrNull(payload.wasmByteLength);
  const summary = payload.artifactSummary || {};
  const artifact = payload.artifact || {};
  const declaredImports = Array.isArray(artifact.execution?.imports) ? artifact.execution.imports : [];
  const declaredExports = Array.isArray(artifact.execution?.exports) ? artifact.execution.exports : [];
  const declaredEntryExport = summary.closureEntryExport || artifact.execution?.entryExport || null;
  const descriptorProbeBase = {
    entryExport: declaredEntryExport,
    hasEntryExport: null
  };
  const descriptorProbe = createEshkolDescriptorContractProbe(payload, descriptorProbeBase);
  const blockers = [];
  blockers.push(...(descriptorProbe.blockers || []));
  const descriptorOnlyTask = task.taskKind === 'eshkol.ulg.closure.descriptor-bind'
    || (summary.closureDescriptorReady === true && payload.hasTransferredWasmBytes !== true);
  if (!bytes || bytes.byteLength === 0) {
    if (descriptorOnlyTask) {
      const descriptorBlockers = uniqueStrings(descriptorProbe.blockers || []);
      return {
        schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
        status: descriptorBlockers.length === 0 ? 'descriptor-contract-ready' : 'blocked',
        ready: descriptorBlockers.length === 0,
        blockers: descriptorBlockers,
        wasmByteLength: declaredLength,
        moduleCompiled: false,
        probeMode: 'descriptor-contract-metadata-only',
        descriptorProbe
      };
    }
    blockers.push('eshkol-wasm-bytes-missing');
    return {
      schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
      status: 'blocked',
      ready: false,
      blockers: uniqueStrings(blockers),
      wasmByteLength: declaredLength,
      moduleCompiled: false,
      probeMode: 'wasm-module-compile',
      descriptorProbe
    };
  }
  if (declaredLength != null && declaredLength !== bytes.byteLength) {
    blockers.push('eshkol-wasm-byte-length-mismatch');
  }
  if (bytes.byteLength < 8) {
    return {
      schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
      status: blockers.length === 0 ? 'skipped-short-wasm-header' : 'blocked',
      ready: blockers.length === 0,
      blockers: uniqueStrings(blockers),
      wasmByteLength: bytes.byteLength,
      declaredWasmByteLength: declaredLength,
      moduleCompiled: false,
      probeMode: 'wasm-module-compile',
      descriptorProbe,
      notes: ['WASM bytes contain a magic-header fixture but not a complete module.']
    };
  }

  let imports = [];
  let exports = [];
  let module = null;
  try {
    module = await WebAssembly.compile(bytes);
    imports = WebAssembly.Module.imports(module);
    exports = WebAssembly.Module.exports(module);
  } catch (error) {
    blockers.push('eshkol-wasm-module-compile-failed');
    return {
      schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
      status: 'blocked',
      ready: false,
      blockers: uniqueStrings(blockers),
      error: error?.message || String(error),
      wasmByteLength: bytes.byteLength,
      declaredWasmByteLength: declaredLength,
      moduleCompiled: false,
      probeMode: 'wasm-module-compile',
      descriptorProbe
    };
  }

  const entryExport = declaredEntryExport || 'main';
  const hasEntryExport = exports.some((entry) => entry.name === entryExport);
  const importMetadataMatches = wasmMetadataMatches(imports, declaredImports, wasmImportKey);
  const exportMetadataMatches = wasmMetadataMatches(exports, declaredExports, wasmExportKey);
  const expectedImportCount = declaredCount(summary.closureImportCount, declaredImports);
  const expectedExportCount = declaredCount(summary.closureExportCount, declaredExports);
  if (expectedImportCount != null && expectedImportCount !== imports.length) {
    blockers.push('eshkol-wasm-import-count-mismatch');
  }
  if (expectedExportCount != null && expectedExportCount !== exports.length) {
    blockers.push('eshkol-wasm-export-count-mismatch');
  }
  if (importMetadataMatches === false) {
    blockers.push('eshkol-wasm-import-metadata-mismatch');
  }
  if (exportMetadataMatches === false) {
    blockers.push('eshkol-wasm-export-metadata-mismatch');
  }
  if (!hasEntryExport) {
    blockers.push('eshkol-wasm-entry-export-missing');
  }
  const compiledDescriptorProbe = createEshkolDescriptorContractProbe(payload, {
    entryExport,
    hasEntryExport
  });
  blockers.push(...(compiledDescriptorProbe.blockers || []));
  const hostRuntimeProbe = await dryProbeEshkolHostRuntime({
    module,
    wasmBytes: bytes,
    observedImports: imports,
    declaredImports,
    entryExport
  });
  if (hostRuntimeProbe.ready !== true) {
    blockers.push('eshkol-host-runtime-dry-probe-not-ready');
  }
  const outputSemantics = objectOrNull(artifact.validation?.outputSemantics);
  const outputSemanticsPreflight = outputSemantics
    ? preflightEshkolOutputSemantics({
      outputSemantics,
      artifact,
      entryExport: outputSemantics.entryExport || entryExport,
      hasEntryExport,
      startFunctionIndex: hostRuntimeProbe.startFunctionIndex ?? null,
      importMetadataMatches,
      exportMetadataMatches
    })
    : null;
  const hostRuntimeExecution = outputSemantics
    ? await executeEshkolHostRuntime({
      module,
      observedImports: imports,
      declaredImports,
      entryExport: outputSemantics.entryExport || entryExport,
      entrySignature: artifact.execution?.entrySignature || null,
      outputSemantics,
      preflight: outputSemanticsPreflight
    })
    : null;
  if (hostRuntimeExecution && hostRuntimeExecution.ready !== true) {
    blockers.push(...(hostRuntimeExecution.blockers || ['eshkol-host-runtime-output-semantics-not-ready']));
  }
  const uniqueBlockers = uniqueStrings(blockers);

  return {
    schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
    status: uniqueBlockers.length === 0 ? 'pass' : 'blocked',
    ready: uniqueBlockers.length === 0,
    blockers: uniqueBlockers,
    wasmByteLength: bytes.byteLength,
    declaredWasmByteLength: declaredLength,
    wasmSha256: payload.wasmSha256 || null,
    moduleCompiled: true,
    probeMode: 'wasm-module-compile',
    importCount: imports.length,
    exportCount: exports.length,
    importKinds: wasmEntriesByKind(imports),
    exportKinds: wasmEntriesByKind(exports),
    declaredImportCount: expectedImportCount,
    declaredExportCount: expectedExportCount,
    importMetadataMatches,
    exportMetadataMatches,
    entryExport,
    hasEntryExport,
    serviceWorkerSafe: summary.closureServiceWorkerSafe === true || artifact.execution?.serviceWorkerSafe === true,
    requiresDynamicCode: summary.closureRequiresDynamicCode ?? artifact.validity?.requiresDynamicCode ?? null,
    descriptorProbe: compiledDescriptorProbe,
    hostRuntimeProbe,
    hostRuntimeExecution
  };
}

async function createDispatchAdapterProbe(payload = {}, task = {}) {
  if (payload.sourceService === 'moonlab') return createMoonLabDispatchProbe(payload);
  if (payload.sourceService === 'eshkol') return createEshkolDispatchProbe(payload, task);
  return {
    schema: 'peercompute.ulg.dispatch-payload-probe.v0',
    status: 'pass',
    ready: true,
    blockers: []
  };
}

function createMoonLabIngestSummary(payload = {}, probe = null) {
  const summary = payload.artifactSummary || {};
  const artifact = payload.artifact || {};
  const outputReferences = Array.isArray(artifact.outputs?.references)
    ? artifact.outputs.references
    : [];
  return {
    schema: 'peercompute.ulg.moonlab-dispatch-ingest.v0',
    magnetarDipoleIsingReady: summary.magnetarDipoleIsingReady === true,
    magnetarDipoleIsingStatus: summary.magnetarDipoleIsingStatus || null,
    magnetarReferenceReady: summary.magnetarReferenceReady === true,
    outputReferenceReadyCount: summary.outputReferenceReadyCount ?? null,
    outputReferenceCount: summary.outputReferenceCount ?? outputReferences.length,
    magnetarCalibratedReferenceReadyCount: summary.magnetarCalibratedReferenceReadyCount ?? null,
    magnetarCalibratedReferenceCount: summary.magnetarCalibratedReferenceCount ?? null,
    moonlabWebGpuParityScopeReady: summary.moonlabWebGpuParityScopeReady ?? null,
    moonlabWebGpuParityScopeSchema: summary.moonlabWebGpuParityScopeSchema || null,
    moonlabWebGpuParityScopeStatus: summary.moonlabWebGpuParityScopeStatus || null,
    moonlabWebGpuParityScopeBackendAvailable: summary.moonlabWebGpuParityScopeBackendAvailable ?? null,
    moonlabWebGpuParityScopeWebgpuParityExecuted:
      summary.moonlabWebGpuParityScopeWebgpuParityExecuted ?? null,
    moonlabWebGpuParityScopeFullFidelityMagnetarSimulation:
      summary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation ?? null,
    moonlabWebGpuParityScopeFullPhysicsValidation:
      summary.moonlabWebGpuParityScopeFullPhysicsValidation ?? null,
    moonlabWebGpuParityScope: clonePlain(summary.moonlabWebGpuParityScope || null),
    adapterProbe: clonePlain(probe)
  };
}

function createEshkolIngestSummary(payload = {}, probe = null) {
  const summary = payload.artifactSummary || {};
  return {
    schema: 'peercompute.ulg.eshkol-dispatch-ingest.v0',
    closureReady: summary.closureReady === true,
    closureDescriptorReady: summary.closureDescriptorReady === true,
    closureOutputSemanticsReady: summary.closureOutputSemanticsReady === true,
    closureKind: summary.closureKind || payload.artifact?.closureKind || null,
    closureDescriptorSchema: summary.closureDescriptorSchema || null,
    wasmByteLength: payload.wasmByteLength ?? null,
    wasmSha256: payload.wasmSha256 || null,
    wasmTransferMode: payload.wasmTransferMode || null,
    hasTransferredWasmBytes: payload.hasTransferredWasmBytes === true,
    moduleCompiled: probe?.moduleCompiled === true,
    moduleImportCount: probe?.importCount ?? null,
    moduleExportCount: probe?.exportCount ?? null,
    moduleImportMetadataMatches: probe?.importMetadataMatches ?? null,
    moduleExportMetadataMatches: probe?.exportMetadataMatches ?? null,
    descriptorContractReady: probe?.descriptorProbe?.ready === true,
    descriptorContractSchema: probe?.descriptorProbe?.schema || null,
    descriptorContractStatus: probe?.descriptorProbe?.status || null,
    descriptorTensorRuntimeContractReady: probe?.descriptorProbe?.tensorRuntimeContract?.ready === true,
    descriptorTensorRuntimeContractSchema: probe?.descriptorProbe?.tensorRuntimeContract?.schema || null,
    descriptorTensorRuntimeContractStatus: probe?.descriptorProbe?.tensorRuntimeContract?.status || null,
    descriptorTensorRuntimeContractHash: probe?.descriptorProbe?.tensorRuntimeContract?.contractHash || null,
    eshkolProductionHandlerBoundaryReady:
      summary.eshkolProductionHandlerBoundaryReady ?? probe?.descriptorProbe?.productionHandlerBoundary?.ready ?? null,
    eshkolProductionHandlerBoundarySchema:
      summary.eshkolProductionHandlerBoundarySchema || probe?.descriptorProbe?.productionHandlerBoundary?.schema || null,
    eshkolProductionHandlerBoundaryStatus:
      summary.eshkolProductionHandlerBoundaryStatus || probe?.descriptorProbe?.productionHandlerBoundary?.status || null,
    eshkolProductionHandlerBoundaryHandlerReady:
      summary.eshkolProductionHandlerBoundaryHandlerReady
      ?? probe?.descriptorProbe?.productionHandlerBoundary?.handlerReady
      ?? null,
    eshkolProductionHandlerBoundaryRuntimeExecution:
      summary.eshkolProductionHandlerBoundaryRuntimeExecution
      ?? probe?.descriptorProbe?.productionHandlerBoundary?.runtimeExecution
      ?? null,
    eshkolProductionHandlerBoundaryScientificValidation:
      summary.eshkolProductionHandlerBoundaryScientificValidation
      ?? probe?.descriptorProbe?.productionHandlerBoundary?.scientificValidation
      ?? null,
    eshkolProductionHandlerBoundaryFullPhysicsValidation:
      summary.eshkolProductionHandlerBoundaryFullPhysicsValidation
      ?? probe?.descriptorProbe?.productionHandlerBoundary?.fullPhysicsValidation
      ?? null,
    eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation:
      summary.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation
      ?? probe?.descriptorProbe?.productionHandlerBoundary?.fullFidelityMagnetarSimulation
      ?? null,
    eshkolProductionHandlerBoundary:
      clonePlain(summary.eshkolProductionHandlerBoundary || probe?.descriptorProbe?.productionHandlerBoundary || null),
    hostRuntimeProbeReady: probe?.hostRuntimeProbe?.ready === true,
    hostRuntimeProbeSchema: probe?.hostRuntimeProbe?.schema || null,
    hostRuntimeProbeStatus: probe?.hostRuntimeProbe?.status || null,
    hostRuntimeInstantiated: probe?.hostRuntimeProbe?.instantiated === true,
    hostRuntimeStubCallCount: probe?.hostRuntimeProbe?.stubCallCount ?? null,
    hostRuntimeExecutionReady: probe?.hostRuntimeExecution?.ready === true,
    hostRuntimeExecutionSchema: probe?.hostRuntimeExecution?.schema || null,
    hostRuntimeExecutionStatus: probe?.hostRuntimeExecution?.status || null,
    hostRuntimeExecutionInvoked: probe?.hostRuntimeExecution?.entryInvoked === true,
    hostRuntimeExecutionScientificExecution: probe?.hostRuntimeExecution?.scientificExecution === true,
    outputSemanticsValidationReady: probe?.hostRuntimeExecution?.outputSemanticsValidation?.ready === true,
    outputSemanticsValidationSchema: probe?.hostRuntimeExecution?.outputSemanticsValidation?.schema || null,
    adapterProbe: clonePlain(probe)
  };
}

function createIngestSummary(payload = {}, probe = null) {
  if (payload.sourceService === 'moonlab') return createMoonLabIngestSummary(payload, probe);
  if (payload.sourceService === 'eshkol') return createEshkolIngestSummary(payload, probe);
  return {
    schema: 'peercompute.ulg.dispatch-ingest.v0',
    artifactKind: payload.artifactKind || null,
    sourceService: payload.sourceService || null,
    adapterProbe: clonePlain(probe)
  };
}

function createResultArtifact({ manifest, task, payload, ingest, validation, lease, probe, serviceOutput }) {
  return {
    schema: ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA,
    artifactKind: `${payload.sourceService || 'ulg'}-dispatch-ingest`,
    sourceService: manifest.serviceId,
    contentHash: createArtifactContentHash(payload, task, manifest.serviceId),
    handoffId: payload.handoffId || task.handoffId || null,
    dispatchId: payload.dispatchId || task.dispatch?.dispatchId || null,
    artifactRefUri: payload.artifactRefUri || null,
    artifactContentHash: payload.artifactContentHash || null,
    payloadSchema: payload.schema || null,
    payloadSourceService: payload.sourceService || null,
    payloadArtifactKind: payload.artifactKind || null,
    validation: clonePlain(validation),
    ingest: clonePlain(ingest),
    childLease: lease ? {
      schema: lease.schema,
      leaseId: lease.leaseId,
      module: lease.module,
      workerType: lease.workerType,
      count: lease.count
    } : null,
    probe: clonePlain(probe),
    serviceOutput: clonePlain(serviceOutput),
    artifactPayload: clonePlain(payload)
  };
}

function normalizeDispatchHandlerOutput(output) {
  if (output == null) {
    return {
      output: null,
      ready: true,
      blockers: []
    };
  }
  const body = output && typeof output === 'object' ? clonePlain(output) : { value: output };
  const blockers = uniqueStrings(Array.isArray(body.blockers) ? body.blockers : []);
  const status = stringOrNull(body.serviceStatus || body.status);
  const ready = body.ready !== false
    && status !== 'blocked'
    && status !== 'error'
    && blockers.length === 0;
  return {
    output: body,
    ready,
    blockers
  };
}

function resolveDispatchHandler(options = {}, manifest = {}) {
  if (typeof options.dispatchHandler === 'function') return options.dispatchHandler;
  const handlers = options.dispatchHandlers || options.serviceHandlers || {};
  const expectedSource = normalizeExpectedSource(manifest);
  return handlers[manifest.serviceId]
    || handlers[expectedSource]
    || null;
}

export class UlgDispatchServiceHost {
  constructor(manifest, options = {}) {
    this.manifest = manifest;
    this.options = options;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.workerId = null;
    this.task = null;
    this.validation = null;
    this.probe = null;
    this.serviceOutput = null;
    this.serviceHandlerReady = null;
    this.serviceHandlerBlockers = [];
    this.closed = false;
  }

  addEventListener(type, listener) {
    this.listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  postMessage(message = {}) {
    if (this.closed && message.type !== 'init') return;
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.manifest = message.manifest || this.manifest;
      this.#emit({
        type: 'ready',
        workerId: this.workerId,
        serviceId: this.manifest.serviceId
      });
      this.#emitHeartbeat('ready');
      return;
    }
    if (message.type === 'submit-task') {
      this.#startTask(message.task || {}).catch((error) => {
        this.#emit({
          type: 'task-error',
          rootTaskId: message.task?.rootTaskId,
          error: error?.message || String(error)
        });
      });
      return;
    }
    if (message.type === 'lease-granted') {
      this.#completeTask(message.lease || null).catch((error) => {
        this.#emit({
          type: 'task-error',
          rootTaskId: message.lease?.rootTaskId || this.task?.rootTaskId,
          error: error?.message || String(error)
        });
      });
      return;
    }
    if (message.type === 'lease-denied') {
      this.#completeTask(null, ['ulg-dispatch-child-lease-denied', message.error]).catch((error) => {
        this.#emit({
          type: 'task-error',
          rootTaskId: this.task?.rootTaskId,
          error: error?.message || String(error)
        });
      });
      return;
    }
    if (message.type === 'cancel-task') {
      this.#emit({
        type: 'task-cancelled',
        rootTaskId: message.rootTaskId,
        result: this.#createResult({
          status: 'cancelled',
          ready: false,
          blockers: ['ulg-dispatch-task-cancelled'],
          lease: null
        })
      });
      return;
    }
    if (message.type === 'shutdown') {
      this.terminate();
    }
  }

  terminate() {
    this.closed = true;
  }

  async #startTask(task = {}) {
    this.task = task;
    this.validation = validateDispatchPayload(task, this.manifest);
    this.probe = null;
    this.serviceOutput = null;
    this.serviceHandlerReady = null;
    this.serviceHandlerBlockers = [];
    this.#emitHeartbeat('validating-dispatch');
    this.#emit({
      type: 'task-status',
      rootTaskId: task.rootTaskId,
      status: this.validation.ready ? 'validating-dispatch-payload' : 'blocked-dispatch-payload',
      progress: this.validation.ready ? 0.25 : 1,
      children: []
    });
    if (!this.validation.ready) {
      this.#emit({
        type: 'task-result',
        rootTaskId: task.rootTaskId,
        result: this.#createResult({
          status: 'blocked',
          ready: false,
          blockers: this.validation.blockers,
          lease: null
        })
      });
      return;
    }
    this.probe = await createDispatchAdapterProbe(this.validation.payload, task, this.manifest);
    const probeBlockers = uniqueStrings(this.probe?.blockers || []);
    if (probeBlockers.length > 0) {
      this.validation = {
        ...this.validation,
        blockers: uniqueStrings([...(this.validation.blockers || []), ...probeBlockers]),
        ready: false
      };
      this.#emit({
        type: 'task-result',
        rootTaskId: task.rootTaskId,
        result: this.#createResult({
          status: 'blocked',
          ready: false,
          blockers: this.validation.blockers,
          lease: null
        })
      });
      return;
    }

    const module = this.options.childWorkerModule
      || this.manifest.childWorkers?.allowedModules?.[0]
      || null;
    const shouldRequestLease = this.options.requestChildLease !== false
      && this.manifest.childWorkers?.allowed === true
      && module;
    if (!shouldRequestLease) {
      await this.#completeTask(null);
      return;
    }
    this.#emit({
      type: 'lease-request',
      requestId: `${task.rootTaskId}:dispatch-lease`,
      rootTaskId: task.rootTaskId,
      module,
      workerType: this.options.workerType || 'module',
      count: task.resources?.childWorkers || 1,
      ttlMs: this.options.leaseTtlMs || 5_000,
      resources: {
        sourceService: this.validation.payload.sourceService || null,
        artifactKind: this.validation.payload.artifactKind || null,
        payloadSchema: this.validation.payload.schema || null,
        wasmByteLength: this.validation.payload.wasmByteLength ?? null
      }
    });
  }

  async #completeTask(lease = null, extraBlockers = []) {
    const baseBlockers = uniqueStrings([
      ...(this.validation?.blockers || []),
      ...extraBlockers
    ]);
    const handlerBlockers = await this.#runDispatchHandler(lease, baseBlockers);
    const blockers = uniqueStrings([...baseBlockers, ...handlerBlockers]);
    const ready = this.validation?.ready === true && blockers.length === 0;
    const task = this.task || {};
    if (lease) {
      this.#emit({
        type: 'task-status',
        rootTaskId: lease.rootTaskId,
        status: 'running-dispatch-adapter',
        progress: 0.75,
        children: [{
          childId: `${lease.rootTaskId}:dispatch-child`,
          leaseId: lease.leaseId,
          module: lease.module,
          serviceId: this.manifest.serviceId,
          status: 'running',
          progress: 0.75
        }]
      });
      this.#emit({ type: 'lease-release', leaseId: lease.leaseId });
    }
    this.#emitHeartbeat(ready ? 'accepted' : 'blocked', lease);
    this.#emit({
      type: 'task-result',
      rootTaskId: task.rootTaskId || lease?.rootTaskId,
      result: this.#createResult({
        status: ready ? 'accepted' : 'blocked',
        ready,
        blockers,
        lease
      })
    });
  }

  #createResult({ status, ready, blockers, lease }) {
    const task = this.task || {};
    const payload = this.validation?.payload || task.artifactPayload || {};
    const ingest = payload && typeof payload === 'object' ? createIngestSummary(payload, this.probe) : null;
    const validation = {
      schema: 'peercompute.ulg.dispatch-service-validation.v0',
      status: ready ? 'pass' : 'blocked',
      ready,
      blockers: clonePlain(blockers || []),
      expectedSourceService: this.validation?.expectedSource || null,
      acceptedArtifactKinds: clonePlain(this.validation?.acceptedKinds || []),
      adapterProbeSchema: this.probe?.schema || null,
      adapterProbeStatus: this.probe?.status || null,
      adapterProbeReady: this.probe?.ready === true,
      serviceHandlerReady: this.serviceHandlerReady,
      serviceHandlerBlockers: clonePlain(this.serviceHandlerBlockers || [])
    };
    const artifact = ready && payload
      ? createResultArtifact({
        manifest: this.manifest,
        task,
        payload,
        ingest,
        validation,
        lease,
        probe: this.probe,
        serviceOutput: this.serviceOutput
      })
      : null;
    return {
      schema: ULG_DISPATCH_SERVICE_RESULT_SCHEMA,
      adapterSchema: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
      serviceId: this.manifest.serviceId,
      serviceStatus: status,
      ready,
      blockers: clonePlain(blockers || []),
      taskId: task.taskId || null,
      taskKind: task.taskKind || null,
      handoffId: payload.handoffId || task.handoffId || null,
      dispatchId: payload.dispatchId || task.dispatch?.dispatchId || null,
      artifactKind: payload.artifactKind || null,
      sourceService: payload.sourceService || null,
      artifactRefUri: payload.artifactRefUri || null,
      artifactContentHash: payload.artifactContentHash || null,
      ingest,
      probe: clonePlain(this.probe),
      serviceOutput: clonePlain(this.serviceOutput),
      validation,
      childLease: lease ? {
        schema: lease.schema,
        leaseId: lease.leaseId,
        module: lease.module,
        workerType: lease.workerType,
        count: lease.count
      } : null,
      artifact
    };
  }

  #emitHeartbeat(status, lease = null) {
    this.#emit({
      type: 'heartbeat',
      telemetry: {
        schema: ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA,
        adapterSchema: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
        serviceId: this.manifest.serviceId,
        status,
        sourceService: normalizeExpectedSource(this.manifest),
        payloadSchema: this.task?.artifactPayload?.schema || null,
        artifactKind: this.task?.artifactPayload?.artifactKind || null,
        taskKind: this.task?.taskKind || null,
        probeSchema: this.probe?.schema || null,
        probeStatus: this.probe?.status || null,
        probeReady: this.probe?.ready === true,
        serviceHandlerReady: this.serviceHandlerReady,
        blockers: uniqueStrings([
          ...(this.validation?.blockers || []),
          ...(this.serviceHandlerBlockers || [])
        ]),
        activeLeaseId: lease?.leaseId || null
      }
    });
  }

  async #runDispatchHandler(lease = null, blockers = []) {
    this.serviceOutput = null;
    this.serviceHandlerReady = null;
    this.serviceHandlerBlockers = [];
    if (blockers.length > 0 || this.validation?.ready !== true) return [];
    const handler = resolveDispatchHandler(this.options, this.manifest);
    if (typeof handler !== 'function') return [];
    const task = this.task || {};
    const payload = this.validation.payload || task.artifactPayload || {};
    const ingest = createIngestSummary(payload, this.probe);
    const context = {
      schema: ULG_DISPATCH_SERVICE_HANDLER_CONTEXT_SCHEMA,
      serviceId: this.manifest.serviceId,
      sourceService: payload.sourceService || normalizeExpectedSource(this.manifest),
      artifactKind: payload.artifactKind || null,
      taskKind: task.taskKind || null,
      manifest: clonePlain(this.manifest),
      task: clonePlain(task),
      payload: clonePlain(payload),
      validation: clonePlain(this.validation),
      probe: clonePlain(this.probe),
      ingest: clonePlain(ingest),
      lease: clonePlain(lease)
    };
    try {
      const output = await handler(context);
      const normalized = normalizeDispatchHandlerOutput(output);
      this.serviceOutput = normalized.output;
      this.serviceHandlerReady = normalized.ready;
      this.serviceHandlerBlockers = normalized.ready
        ? []
        : uniqueStrings(['ulg-dispatch-service-handler-blocked', ...normalized.blockers]);
      return this.serviceHandlerBlockers;
    } catch (error) {
      this.serviceOutput = {
        schema: 'peercompute.ulg.dispatch-service-handler-error.v0',
        ready: false,
        error: error?.message || String(error)
      };
      this.serviceHandlerReady = false;
      this.serviceHandlerBlockers = ['ulg-dispatch-service-handler-error'];
      return this.serviceHandlerBlockers;
    }
  }

  #emit(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }
}

export function createUlgDispatchServiceHostFactory(options = {}) {
  return function createUlgDispatchServiceHost(manifest) {
    return new UlgDispatchServiceHost(manifest, options);
  };
}
