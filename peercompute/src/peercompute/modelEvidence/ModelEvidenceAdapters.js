import { modelPackageFingerprint, evidenceDigest } from './ModelEvidenceContracts.js';

const integer = value => Number.isSafeInteger(value) && value >= 0;
export function evidenceFailure(error) {
  const code = String(error?.code ?? ''), name = error?.name, message = String(error?.message ?? error ?? '');
  const reason = /device.lost|session.lost|worker.terminated/i.test(code + message) ? 'device-lost'
    : /deadline|timeout/i.test(code + message) ? 'timeout'
      : name === 'AbortError' ? 'cancelled'
        : /out.of.memory|allocation.failed|resource.exhaust|quota/i.test(code + message) ? 'resource-exhausted'
          : /shader-f16|missing.*feature|GPU.*unavailable/i.test(message) ? 'feature-unavailable'
            : /architecture|unsupported.*model/i.test(message) ? 'architecture-unsupported'
              : /budget|admission|envelope/i.test(message) ? 'policy-budget'
                : /fetch|network|transport|dial/i.test(message) ? 'transport'
                  : /hash|digest|manifest|artifact/i.test(message) ? 'artifact-invalid' : 'runtime-error';
  return { outcome: reason === 'cancelled' ? 'cancelled' : 'failed', reason,
    ...(/^ERR_[A-Z0-9_]{1,76}$/.test(code) ? { errorCode: code } : {}) };
}
export function evidenceSource(entry, manifestCid) {
  const model = entry?.model ?? entry ?? {}, source = {};
  const repository = entry?.repository ?? model.repository, revision = entry?.revision ?? model.revision;
  if (/^[\w.-]+\/[\w.-]+$/.test(repository) && /^[a-f0-9]{40}$/.test(revision)) Object.assign(source, { repository, revision });
  if (manifestCid) source.manifestCid = manifestCid;
  try { source.packageFingerprint = modelPackageFingerprint(entry.files); } catch { /* Exact CID/revision can still identify the observation. */ }
  // A pinned repository revision plus its selected paths identifies the source
  // closure before download. Keep this separate from the verified byte digest:
  // Git blob SHA-1 metadata becomes whole-file SHA-256 in stored manifests.
  if (source.repository && entry?.files?.length) source.selectionDigest = evidenceDigest({ repository, revision,
    files: entry.files.map(({ path, size }) => ({ path, size })).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0) });
  const variant = entry?.files?.find(file => /\.gguf$/i.test(file.path))?.path;
  if (variant) source.variant = variant;
  return source;
}
export function evidenceWorkload(input = {}, task) {
  const result = {};
  if (task) result.task = task;
  for (const [key, value] of Object.entries({ maxNewTokens: input.maxNewTokens, steps: input.steps,
    imageWidth: input.image?.width ?? input.width, imageHeight: input.image?.height ?? input.height,
    audioSamples: input.audio?.samples?.length, audioSampleRate: input.audio?.sampleRate })) if (integer(value)) result[key] = value;
  return result;
}
/** Called on the executing host; extracts only structural facts before an observer sees them. */
export function executionEvidence({ entry, stage, result, error, startedAt, workload, runtime }) {
  const metrics = [], metric = (name, value, unit, scope, method) => {
    if (integer(value)) metrics.push({ name, value, unit, scope, method });
  };
  if (Number.isFinite(startedAt)) metric('durationMs', Math.max(0, Math.round(performance.now() - startedAt)), 'ms', 'operation', 'clock');
  for (const name of ['Cpu', 'Gpu']) metric(`estimated${name}Bytes`, entry.estimate?.[name.toLowerCase() + 'Bytes'], 'bytes', 'model-planning-envelope', 'planner');
  // Runtime counters describe requested buffers, never physical VRAM or process RSS.
  metric('requestedGpuBufferPeakBytes', result?.requestedGpuBufferPeakBytes ?? result?.peakBufferBytes, 'bytes', 'runtime-owned-buffers', 'allocation-counter');
  metric('wasmMemoryBytes', result?.wasmMemoryBytes, 'bytes', 'worker-wasm-memory', 'wasm-memory-buffer');
  for (const name of ['gpuDispatches', 'gpuSubmissions']) if (result?.[name] > 0) metric(name, result[name], 'count', stage === 'generation' ? 'operation' : 'runtime-session', 'dispatch-counter');
  const observedWorkload = { ...(workload ?? {}) };
  for (const name of ['inputTokens', 'outputTokens']) if (integer(result?.[name])) observedWorkload[name] = result[name];
  const runtimeOptions = {};
  for (const [key, target] of Object.entries({ n_ctx: 'contextTokens', n_gpu_layers: 'gpuLayers', n_threads: 'threads', n_batch: 'batchSize' })) {
    if (integer(entry.runtimeOptions?.[key])) runtimeOptions[target] = entry.runtimeOptions[key];
  }
  return { source: evidenceSource(entry.manifest, entry.manifestCid), stage,
    ...(error ? evidenceFailure(error) : { outcome: 'success' }), workload: observedWorkload, runtimeOptions, metrics,
    runtime: runtime ?? entry.manifest?.model?.runtime, runtimeVersion: entry.manifest?.model?.runtimeVersion ?? 'managed-v1',
    adapter: result?.runtimeAdapter ?? result?.adapter ?? entry.evidence?.runtimeAdapter ?? entry.evidence?.adapter };
}
export function inspectionEvidence(result) {
  return (result?.variants ?? []).slice(0, 128).map(variant => {
    const source = evidenceSource(variant.package ?? variant);
    Object.assign(source, { repository: result.repository, revision: result.revision });
    const reason = String(variant.reason ?? '');
    const outcome = result.gated ? 'blocked' : variant.requiresInspection ? 'incomplete' : variant.loadable === true ? 'success' : 'unsupported';
    return { source, stage: 'inspection', outcome,
      ...(outcome === 'success' ? {} : { reason: result.gated ? 'access-required'
        : variant.requiresInspection || /complete package|configuration unavailable/i.test(reason) ? 'incomplete-package'
          : /architecture/i.test(reason) ? 'architecture-unsupported' : /budget/i.test(reason) ? 'policy-budget' : 'unknown' }),
      runtime: variant.model?.runtime, runtimeVersion: variant.model?.runtimeVersion };
  });
}
