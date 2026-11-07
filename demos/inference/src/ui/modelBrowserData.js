const TASKS = new Set(['text-generation', 'image-text-to-text', 'text-to-image', 'automatic-speech-recognition', 'text-to-speech']);
export const knownBytes = (value) => Number.isSafeInteger(value) && value >= 0;
export function modelBytes(value) {
  if (!knownBytes(value)) return 'Unknown size';
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(2)} GiB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(1)} MiB`;
  return `${Math.ceil(value / 1024)} KiB`;
}
export function modelTask(source) {
  return source.task ?? source.model?.task ?? (source.browserSummary ? 'unknown'
    : source.modalities?.includes('image') ? 'image-text-to-text' : 'text-generation');
}
export function modelPrecision(source) {
  const dtype = source.dtype ?? source.model?.dtype;
  if (typeof dtype === 'string') return dtype.toLowerCase();
  if (dtype && typeof dtype === 'object' && !Array.isArray(dtype)) {
    const values = [...new Set(Object.values(dtype).filter((value) => typeof value === 'string').map((value) => value.toLowerCase()))];
    if (values.length === 1) return values[0];
    if (values.length) return `mixed (${values.sort().join(', ')})`;
  }
  return '';
}
export function repositoryQuery(query) {
  const input = query.trim();
  if (!/^https?:\/\//i.test(input)) return { query: input, repository: null };
  try {
    const parsed = parseHuggingFaceRepository(input);
    return { query: parsed.repository, ...parsed, reference: input };
  } catch { return { query: '', repository: null, error: 'Enter a Hugging Face model URL or search by name and description.' }; }
}
export function compatibilityFor(source, getCompatibility) {
  try {
    const result = getCompatibility?.(source) ?? source.localAvailability;
    if (result && typeof result.then !== 'function') return result;
    // The UI contract is synchronous. A rejected accidental promise must not leak.
    result?.catch?.(() => {});
  } catch { return { status: 'unknown', reason: 'Device compatibility could not be checked.' }; }
  return { status: 'unknown', reason: 'Memory fit has not been verified on this device.' };
}
export const blocksLocal = (availability) => ['checking', 'unavailable'].includes(availability?.status);
export const needsInspection = (source) => Boolean(source.browserSummary || source.requiresInspection);
export function filterBrowserModels(models, filters, getCompatibility, { includeUninspected = false } = {}) {
  const terms = repositoryQuery(filters.query).query.toLowerCase().split(/\s+/).filter(Boolean);
  function matchesSource(source) {
    const pending = includeUninspected && needsInspection(source);
    const origin = source.browserOrigin ?? (source.source === 'stored' ? 'stored' : source.source === 'peers' ? 'peers' : 'catalog');
    if (filters.source !== 'all' && origin !== filters.source && !(filters.source === 'stored' && source.stored === true)) return false;
    const task = modelTask(source), precision = modelPrecision(source);
    if (filters.task !== 'all' && task !== filters.task && !(pending && task === 'unknown')) return false;
    if (filters.precision !== 'all' && precision !== filters.precision && !(pending && (!precision || precision === 'unknown'))) return false;
    // Hub search owns relevance (including description search). Local sources use AND terms.
    if (origin !== 'hub') {
      const haystack = [source.name, source.modelId, source.id, source.description, source.repository,
        source.model?.repository, task, source.runtime, source.model?.runtime, precision, source.source,
        origin, origin === 'stored' ? 'local stored on this device' : '', ...(source.tags ?? [])].join(' ').toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    const size = source.totalBytes;
    if (filters.size === 'unknown' && knownBytes(size)) return false;
    if (filters.size !== 'all' && filters.size !== 'unknown') {
      if (!knownBytes(size)) { if (!pending) return false; }
      else if (filters.size === 'large' ? size < 8 * 1024 ** 3 : size > Number(filters.size)) return false;
    }
    const availability = compatibilityFor(source, getCompatibility);
    if (!pending) {
      if (filters.compatibility === 'eligible' && !source.browserPeerAvailable
          && (blocksLocal(availability) || source.loadable === false || needsInspection(source))) return false;
      if (filters.compatibility === 'setup' && (needsInspection(source) || (!blocksLocal(availability) && source.loadable !== false))) return false;
    }
    return true;
  }
  const matches = models.flatMap((source) => {
    // Keep one repository row, including when a different quantization matches.
    // The explicit selection stays unchanged; the UI names the matching variant.
    const candidates = [source, ...(source.browserVariants ?? [])].filter(matchesSource);
    const match = candidates.find((item) => !needsInspection(item)) ?? candidates[0];
    if (!match) return [];
    return [{ ...source, browserFilterPending: needsInspection(match),
      browserMatchingVariant: match === source ? null : match.name ?? match.id }];
  });
  const size = (model) => knownBytes(model.totalBytes) ? model.totalBytes : Infinity;
  return matches.sort((a, b) => {
    if (filters.sort !== 'name') {
      // Unknown sizes stay last in both directions.
      if (size(a) === Infinity && size(b) !== Infinity) return 1;
      if (size(b) === Infinity && size(a) !== Infinity) return -1;
      const difference = (size(a) - size(b)) * (filters.sort === 'largest' ? -1 : 1);
      if (difference) return difference;
    }
    return String(a.name ?? a.repository).localeCompare(String(b.name ?? b.repository)) || String(a.key).localeCompare(String(b.key));
  });
}
export function matchingPeerTargets(source, targets) {
  const cid = source.manifestCid ?? source.package?.manifestCid;
  return targets.filter((target) => !target.local && target.available === true
    && (target.key === source.key || (cid && target.key === `peer:${cid}`)));
}
export function safeModelUrl(repository) {
  return typeof repository === 'string' && /^[\w.-]+\/[\w.-]+$/.test(repository)
    ? `https://huggingface.co/${repository}` : null;
}
export { TASKS };
import { parseHuggingFaceRepository } from '../huggingface/hubClient.js';

