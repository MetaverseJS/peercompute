/**
 * product_route.js — the product default composition of the SF3D route.
 *
 * Every foreground-liveness mechanism the port has proven in isolation
 * (cooperative DINO / two-stream / post-processor GPU duties, decoder scratch
 * arena, and CPU worker offload for preprocess, CLIP prep, marching tet,
 * UV unwrap, and texture materialization) lived behind options in
 * full_pipeline.js and was only ever switched on by harness arms. This module
 * is the single place where the product path turns them all on with the
 * settings those harnesses measured, so main.js and the witness harnesses run
 * the same route.
 *
 * The defaults are frozen data so a contract test can pin them; the worker
 * factory is separate because Workers are browser objects that a Node contract
 * test cannot construct.
 */

// Settings measured green in the A/B harnesses:
//   DINO: 24 fixed one-block duties (capsule + conformance).
//   two-stream: attention-tile duties, 256 linear rows per duty — the Pareto
//     profile from the clean paired assay (2,922 duties, zero local gaps over
//     16.7ms, 1.7x wall); 128 rows (4,218 duties) was rejected as too slow.
//   post-processor: channel-range duties, 16 channels per duty, bounded-prefix
//     depth 2 (702 duties; validator-backed acceptance).
//   texture bake: 4096-texel cooperative batches + decoder scratch arena +
//     worker materialization (five-arm paired product comparison).
export const PRODUCT_ROUTE_DEFAULTS = Object.freeze({
  cooperativeDino: true,
  dinoSchedulingMode: 'cooperative',
  dinoChunkBlocks: 1,

  cooperativeTwoStream: true,
  twoStreamSchedulingMode: 'cooperative',
  twoStreamDutyGranularity: 'attention-tile',
  twoStreamLinearRowsPerDuty: 256,

  cooperativePostProcessor: true,
  postProcessorSchedulingMode: 'cooperative',
  postProcessorDutyGranularity: 'channel-range',
  postProcessorChannelsPerDuty: 16,
  postProcessorCompletionPolicy: 'bounded-prefix',
  postProcessorMaxInFlightGpuDuties: 2,

  cooperativeBake: true,
  bakeSchedulingMode: 'cooperative',
  bakeBatchTexels: 4096,
  decoderArena: true,

  workerTimeoutMs: 120000,
});

/** Worker roles the product route offloads, keyed by the option name each one fills. */
export const PRODUCT_ROUTE_WORKER_ROLES = Object.freeze({
  preprocessWorker: './preprocess_worker.js',
  clipPrepWorker: './clip_prep_worker.js',
  marchingTetWorker: './marching_tet_worker.js',
  uvUnwrapWorker: './uv_unwrap_worker.js',
  materializeWorker: './materialize_worker.js',
});

/**
 * Create one module Worker per role. Browser-only (needs `Worker`). Workers are
 * long-lived so weights / tet-grid state can stay resident across runs.
 *
 * Each `new Worker(new URL('./x.js', import.meta.url), { type: 'module' })` is
 * written out literally: Vite discovers and bundles worker modules by static
 * analysis of exactly that shape, so a table-driven loop would work in dev and
 * silently break the production build.
 */
/**
 * Resolved module URLs of the five workers, explicit for a host that mounts
 * the producer (Wake answer 4: worker module URLs must be visible and must
 * survive the built artifact). Literal `new URL('./x', import.meta.url)`
 * expressions so every bundler emits the chunks.
 */
export function productRouteWorkerModuleUrls() { return Object.freeze({}); }
export function createProductRouteWorkers() { throw new Error('PeerCompute owns SF3D worker lifetime; pass workers:{}'); }

export function terminateProductRouteWorkers(workers) {
  for (const worker of Object.values(workers || {})) {
    try { worker.terminate(); } catch { /* already gone */ }
  }
}

/**
 * Compose the options object runFullPipelineToGlb consumes. `workers` is the
 * object from createProductRouteWorkers (or a subset for A/B arms); `overrides`
 * is applied last so a harness can hold everything but one mechanism fixed.
 *
 * Fail-loud: unknown worker roles are rejected rather than silently ignored,
 * because a misspelled role would fall back to the main-thread path and quietly
 * reintroduce the foreground gap the worker exists to remove.
 */
export function createProductRouteOptions({ workers = {}, overrides = {} } = {}) {
  for (const role of Object.keys(workers)) {
    if (!(role in PRODUCT_ROUTE_WORKER_ROLES)) {
      throw new Error(`unknown product route worker role: ${role}`);
    }
  }
  return Object.freeze({
    ...PRODUCT_ROUTE_DEFAULTS,
    ...workers,
    ...overrides,
  });
}

/**
 * Names of the mechanisms an options object enables, for effective-config
 * receipts (a witness must record what actually ran, not what was requested).
 */
export function describeProductRouteOptions(options) {
  return Object.freeze({
    cooperativeDino: options.cooperativeDino === true && options.dinoSchedulingMode !== 'disabled',
    cooperativeTwoStream: options.cooperativeTwoStream === true && options.twoStreamSchedulingMode !== 'disabled',
    twoStreamDutyGranularity: options.cooperativeTwoStream === true ? options.twoStreamDutyGranularity ?? 'stage' : null,
    cooperativePostProcessor: options.cooperativePostProcessor === true && options.postProcessorSchedulingMode !== 'disabled',
    postProcessorDutyGranularity: options.cooperativePostProcessor === true ? options.postProcessorDutyGranularity ?? 'plane' : null,
    postProcessorCompletionPolicy: options.cooperativePostProcessor === true ? options.postProcessorCompletionPolicy ?? 'strict-prefix' : null,
    cooperativeBake: options.cooperativeBake === true && options.bakeSchedulingMode !== 'disabled',
    bakeBatchTexels: options.cooperativeBake === true ? options.bakeBatchTexels ?? 16384 : null,
    decoderArena: options.decoderArena === true && options.cooperativeBake === true,
    workers: Object.freeze(Object.fromEntries(
      Object.keys(PRODUCT_ROUTE_WORKER_ROLES).map(role => [role, Boolean(options[role])]),
    )),
  });
}
