import { HUGGING_FACE_ORIGIN, parseHuggingFaceRepository, plainDescription, validateHubPath, validateRevision } from './hubClient.js';

const MAX_CANDIDATES = 12;
const CONCURRENCY = 3;
const LINEAGE_NOTICE = 'These are publisher-declared base-model relationships, not proof of identical weights or conversion from the selected source revision. Inspect a candidate before importing.';
const key = (repository) => repository.toLowerCase();

function repositoryOf(value) {
  try { return parseHuggingFaceRepository(value).repository; } catch { return null; }
}

function baseModels(info) {
  const values = info?.cardData?.base_model;
  return (Array.isArray(values) ? values : [values]).slice(0, 32).map(repositoryOf).filter(Boolean);
}

function formatsOf(info) {
  const formats = new Set();
  for (const file of (Array.isArray(info?.siblings) ? info.siblings : []).slice(0, 8192)) {
    let path;
    try { path = validateHubPath(file.rfilename ?? file.path); } catch { continue; }
    if (/\.onnx$/i.test(path)) formats.add('ONNX');
    if (/\.gguf$/i.test(path) && !/mmproj|projector/i.test(path)) formats.add('GGUF');
  }
  return [...formats].sort();
}

function relationshipOf(info, source) {
  const explicit = info.cardData?.base_model_relation;
  if (['quantized', 'converted', 'finetune', 'merge', 'adapter'].includes(explicit)) return explicit;
  const tags = Array.isArray(info.tags) ? info.tags : [];
  for (const relation of ['merge', 'adapter', 'finetune', 'quantized']) {
    if (tags.some((tag) => typeof tag === 'string' && key(tag) === `base_model:${relation}:${key(source)}`)) return relation;
  }
  return 'derived';
}

/** Metadata-only discovery. File manifests and execution support are inspected
 * separately; a matching name or a Hub tag alone never establishes lineage. */
export async function findHuggingFaceConversions(input, { client, signal } = {}) {
  if (!client?.getModel || !client?.listDerivedModels) throw new Error('A Hugging Face lineage metadata client is required');
  signal?.throwIfAborted();
  const parsed = parseHuggingFaceRepository(input);
  const source = await client.getModel(parsed.repository, { revision: parsed.revision, signal });
  signal?.throwIfAborted();
  const sourceRepository = repositoryOf(source.id ?? source.modelId) ?? parsed.repository;
  if (key(sourceRepository) !== key(parsed.repository)) throw new Error('Hugging Face returned a different source repository');
  const sourceRevision = validateRevision(source.sha);
  if (parsed.revision && sourceRevision !== parsed.revision) throw new Error('Hugging Face returned a different source revision');
  const listing = await client.listDerivedModels(sourceRepository, { signal });
  signal?.throwIfAborted();
  if (!Array.isArray(listing.items) || listing.items.length > 40) throw new Error('Related-model listing exceeds its metadata budget');
  const warnings = [source.warning, listing.warning].filter(Boolean);
  let cached = Boolean(source.cached || listing.cached);
  const seen = new Set();
  const candidates = listing.items.filter((info) => {
    const repository = repositoryOf(info?.id ?? info?.modelId);
    if (!repository || seen.has(key(repository)) || key(repository) === key(sourceRepository)
        || info.private || info.disabled || !formatsOf(info).length
        || !baseModels(info).some((base) => key(base) === key(sourceRepository))) return false;
    seen.add(key(repository)); return true;
  }).sort((a, b) => Number(formatsOf(b).includes('ONNX')) - Number(formatsOf(a).includes('ONNX')));
  if (listing.truncated || candidates.length > MAX_CANDIDATES) warnings.push(`Discovery is bounded to 40 related repositories and ${MAX_CANDIDATES} pinned candidate inspections; more exports may exist.`);
  const selected = candidates.slice(0, MAX_CANDIDATES), results = new Array(selected.length);
  let next = 0, failed = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, selected.length) }, async () => {
    while (next < selected.length) {
      signal?.throwIfAborted();
      const index = next++, listed = selected[index];
      const repository = repositoryOf(listed.id ?? listed.modelId);
      try {
        const revision = validateRevision(listed.sha);
        const info = await client.getModel(repository, { revision, signal });
        signal?.throwIfAborted();
        if (validateRevision(info.sha) !== revision || key(repositoryOf(info.id ?? info.modelId) ?? repository) !== key(repository)) {
          throw new Error('Candidate identity changed during pinned inspection');
        }
        const parents = baseModels(info), formats = formatsOf(info);
        if (!parents.some((base) => key(base) === key(sourceRepository)) || !formats.length || info.private || info.disabled) {
          throw new Error('Candidate has no matching pinned source lineage and export files');
        }
        cached ||= Boolean(info.cached);
        if (info.warning) warnings.push(info.warning);
        const relationship = relationshipOf(info, sourceRepository);
        results[index] = { repository, revision, name: repository.split('/')[1],
          task: typeof info.pipeline_tag === 'string' ? info.pipeline_tag.slice(0, 100) : null,
          formats, sourceRepository, sourceRevision, relationship,
          evidence: { kind: 'publisher-base-model', revision,
            url: `${HUGGING_FACE_ORIGIN}/${repository}/blob/${revision}/README.md`,
            sourceRevisionVerified: false },
          description: plainDescription(info.description ?? info.cardData?.model_description ?? ''),
          license: typeof info.cardData?.license === 'string' ? info.cardData.license.slice(0, 100) : null,
          url: `${HUGGING_FACE_ORIGIN}/${repository}/tree/${revision}`,
          status: 'candidate', requiresInspection: true, gated: Boolean(info.gated) };
      } catch (error) {
        signal?.throwIfAborted(); failed += 1;
        if (failed <= 3) warnings.push(`${repository}: ${String(error.message).slice(0, 180)}`);
      }
    }
  }));
  signal?.throwIfAborted();
  if (failed > 3) warnings.push(`${failed - 3} further candidate metadata requests failed.`);
  return { sourceRepository, sourceRevision, items: results.filter(Boolean), lineageNotice: LINEAGE_NOTICE,
    ...(warnings.length ? { warning: [...new Set(warnings)].join(' ') } : {}), ...(cached ? { cached: true } : {}) };
}
