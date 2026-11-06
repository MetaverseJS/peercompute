import { repositoryQuery, safeModelUrl } from './modelBrowserData.js';

const RELATIONSHIPS = new Set(['quantized', 'converted', 'derived', 'finetune', 'merge', 'adapter']);
const bounded = (value, length) => typeof value === 'string' ? value.slice(0, length) : '';
function sourceIdentity(reference) {
  if (typeof reference !== 'string') return null;
  const parsed = repositoryQuery(reference), repository = parsed.repository ?? reference;
  if (parsed.error || !safeModelUrl(repository)) return null;
  return { repository, key: `${repository.toLowerCase()}@${parsed.revision ?? 'main'}`,
    reference: parsed.revision ? `${safeModelUrl(repository)}/tree/${parsed.revision}` : repository };
}

/** Publisher lineage is metadata, not proof of equivalent weights or runtime support. */
export function conversionCandidate(item, sourceRepository) {
  if (!item || !safeModelUrl(item.repository) || item.repository.length > 160
      || typeof item.sourceRepository !== 'string' || item.sourceRepository.toLowerCase() !== sourceRepository.toLowerCase()
      || item.repository.toLowerCase() === sourceRepository.toLowerCase()
      || !RELATIONSHIPS.has(item.relationship) || item.evidence?.kind !== 'publisher-base-model'
      || !/^[a-f0-9]{40}$/i.test(item.evidence.revision ?? '')
      || (item.revision && item.revision !== item.evidence.revision)) return null;
  const formats = [...new Set((Array.isArray(item.formats) ? item.formats : []).filter((format) => ['ONNX', 'GGUF'].includes(format)))];
  if (!formats.length) return null;
  const revision = item.evidence.revision.toLowerCase();
  return { repository: item.repository, name: bounded(item.name, 256) || item.repository,
    description: bounded(item.description, 4000), task: bounded(item.task, 64) || undefined,
    formats, revision, sourceRepository, relationship: item.relationship,
    reference: `${safeModelUrl(item.repository)}/tree/${revision}`,
    status: 'candidate', requiresInspection: true };
}

/** One explicit, cancellable metadata request at a time; completed lookups are reused. */
export function createConversionDiscovery({ findConversions, onChange = () => {} } = {}) {
  const cache = new Map();
  let pending = null, disposed = false;
  function remember(key, state) {
    cache.delete(key); cache.set(key, state);
    // Include failed and cancelled lookups in the same UI metadata bound.
    while (cache.size > 32) cache.delete(cache.keys().next().value);
  }
  function cancel() {
    if (!pending) return;
    const request = pending; pending = null; request.controller.abort();
    remember(request.key, { status: 'cancelled', items: [] }); onChange();
  }
  return {
    get: (reference) => cache.get(sourceIdentity(reference)?.key),
    cancel,
    async find(reference) {
      const source = sourceIdentity(reference);
      if (disposed || !findConversions || !source) return;
      const previous = cache.get(source.key);
      if (previous?.status === 'complete' || (previous?.status === 'pending' && pending?.key === source.key)) return;
      cancel();
      const request = { ...source, controller: new AbortController() }; pending = request;
      remember(request.key, { status: 'pending', items: [] }); onChange();
      try {
        const result = await findConversions(request.reference, { signal: request.controller.signal });
        if (disposed || pending !== request || request.controller.signal.aborted) return;
        if (!result || !Array.isArray(result.items)) throw new Error('Invalid related-model response');
        const items = [...new Map(result.items.slice(0, 100).map((item) => conversionCandidate(item, request.repository))
          .filter(Boolean).map((item) => [`${item.repository}@${item.revision}`, item])).values()].slice(0, 24);
        remember(request.key, { status: 'complete', items, warning: bounded(result.warning, 1000), cached: result.cached === true });
      } catch (error) {
        if (!disposed && pending === request && !request.controller.signal.aborted) {
          remember(request.key, { status: 'error', items: [], error: bounded(error?.message ?? String(error), 1000) });
        }
      } finally {
        if (pending === request) { pending = null; onChange(); }
      }
    },
    dispose() { disposed = true; cancel(); cache.clear(); },
  };
}
