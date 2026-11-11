import { GGUF_MODEL_CATALOG, ggufModelFileUrl } from '../../../peercompute/src/peercompute/artifacts/ggufModelCatalog.js';
import { createGemma4ProjectorSource } from '../../../peercompute/src/peercompute/artifacts/gemma4ProjectorSource.js';
import { matchesHubPackage } from './modelHubPackage.js';
import { downloadModelFile } from './modelDownload.js';

/** Catalog derivations are executable application code, never instructions from
 * a Hub response or peer manifest. Resolve the complete immutable package before
 * selecting a source. The ordinary importer still checks the resulting SHA/CID.
 */
export function trustedCatalogSource(manifest) {
  const entry = Object.values(GGUF_MODEL_CATALOG).find((candidate) => candidate.model.ggufMedia
    && matchesHubPackage(manifest, candidate));
  if (!entry) return null;
  return {
    sourceUrl: (path) => ggufModelFileUrl(entry.id, path),
    async *openSource(file, sourceUrl, options) {
      const approved = entry.files.find((candidate) => candidate.path === file.path);
      if (!approved || approved.size !== file.size || approved.sha256 !== file.sha256) {
        throw new Error('Catalog artifact identity changed before import');
      }
      if (file.path === entry.model.ggufMedia.projectorPath) {
        yield* createGemma4ProjectorSource({ signal: options.signal, fetchImpl: options.fetchImpl,
          onProgress: (progress) => options.onRetry?.({ preparation: progress }) });
      } else {
        yield* downloadModelFile(file, sourceUrl, options);
      }
    },
  };
}
