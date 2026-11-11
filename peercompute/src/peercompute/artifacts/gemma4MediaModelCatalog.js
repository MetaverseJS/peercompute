import { GEMMA4_MODEL_CATALOG } from './gemma4ModelCatalog.js';
import { GEMMA4_PROJECTOR_RECIPE, GEMMA4_PROJECTOR_FILE } from './gemma4ProjectorRecipe.js';

const text = GEMMA4_MODEL_CATALOG['gemma4-12b-uncensored-q4-k-m-gguf'];
const id = 'gemma4-12b-uncensored-q4-k-m-multimodal-gguf';
const files = [...text.files, GEMMA4_PROJECTOR_FILE];
const recipe = GEMMA4_PROJECTOR_RECIPE;
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}

// A separate manifest preserves existing text-package CIDs and reuses its exact
// decoder bytes. Media capability is admitted only with the derived companion.
export const GEMMA4_MEDIA_MODEL_CATALOG = freeze({
  [id]: {
    ...text, id, name: 'Gemma 4 12B Uncensored (Q4_K_M, vision + audio)', files,
    description: 'Image and audio understanding with text replies. Reuses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading this package to avoid keeping two 12B models in GPU memory.',
    capabilities: { ...text.capabilities, executionStatus: 'candidate',
      executionReason: 'Unverified multimodal candidate. Requires the managed llama.cpp Gemma4Unified media runtime, its pinned companion projector and normal device admission. Audio input produces text; speech synthesis uses a separate model.' },
    model: { ...text.model, modalities: ['text', 'image', 'audio'],
      ggufMedia: { profile: 'gemma4-unified-v1', projectorPath: GEMMA4_PROJECTOR_FILE.path } },
    provenance: { ...text.provenance,
      vision: 'A separately derived Gemma4Unified companion supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browser execution remains unverified.',
      derivedArtifacts: [{ path: GEMMA4_PROJECTOR_FILE.path, recipe: recipe.id,
        sourceRepository: recipe.source.repository, sourceRevision: recipe.source.revision,
        sourcePath: 'model.safetensors', sourceFileSha256: recipe.source.publisherSha256,
        sourceDigestVerification: 'Publisher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source checkpoint is not downloaded.',
        converter: { repository: 'ggml-org/llama.cpp', revision: recipe.converterRevision, outputType: 'f16' },
        processor: { repository: 'google/gemma-4-12B-it', revision: '43c9d014b231474fa7212dbb48a762566c2b255d',
          path: 'processor_config.json', sha256: '6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9',
          notice: 'Processor settings are sourced explicitly from Google because the Trevor source omits this file.' } }],
      outputModalities: 'Text only. Image/audio understanding and transcription are distinct from image or speech generation.',
    },
    totalBytes: files.reduce((sum, file) => sum + file.size, 0),
  },
});
