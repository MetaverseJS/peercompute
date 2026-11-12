import { createMeshTaskHandler } from './mesh/modelTask.js';
import { createSf3dEngine } from './sf3d/engine.js';
import { validateSf3dManifest, normalizeSf3dInput } from './sf3dRuntimeDefinition.js';

export const handleModelTask = createMeshTaskHandler({
  createEngine: createSf3dEngine, validateManifest: validateSf3dManifest, normalizeInput: normalizeSf3dInput,
});
