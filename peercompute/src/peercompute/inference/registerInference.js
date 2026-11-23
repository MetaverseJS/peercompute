import {
  registerDefaultWorkerBootstrapURL,
  registerModelInferenceFactory,
  registerPeerInferenceServiceFactory
} from '../runtime/extensionRegistry.js';
import { registerInferenceTaskModules } from './registerTaskModules.js';

const SUPPORTED_MODEL_RUNTIMES = Object.freeze([
  'transformers.js',
  'llama.cpp',
  'onnx-diffusion',
  'transformers-speech',
  'onnx-mesh',
  'webgpu-sf3d'
]);

let registered = false;

async function defaultModelInferenceFactory(computeManager, {
  artifactStore,
  resourceBroker,
  resourceBudgets,
  runtime = 'transformers.js',
  admissionOptions = {},
  ...options
} = {}) {
  if (!SUPPORTED_MODEL_RUNTIMES.includes(runtime)) {
    throw new Error('Unsupported model execution runtime');
  }
  const lifecycle = computeManager.workerLifecycleRevision;
  const [{ ModelInferenceService }, { ResourceLeaseBroker }, { ResidentModelAdmission }, runtimeDefinition] = await Promise.all([
    import('./ModelInferenceService.js'),
    import('../serviceOrchestration/ResourceLeaseBroker.js'),
    import('../serviceOrchestration/ResidentModelAdmission.js'),
    runtime === 'llama.cpp'
      ? import('./gguf/runtimeDefinition.js').then((module) => module.ggufRuntimeDefinition)
      : runtime === 'onnx-diffusion'
        ? import('./diffusion/runtimeDefinition.js').then((module) => module.diffusionRuntimeDefinition)
        : runtime === 'onnx-mesh'
          ? import('./mesh/runtimeDefinition.js').then((module) => module.meshRuntimeDefinition)
          : runtime === 'webgpu-sf3d'
            ? import('./sf3dRuntimeDefinition.js').then((module) => module.sf3dRuntimeDefinition)
            : runtime === 'transformers-speech'
              ? import('./speech/runtimeDefinition.js').then((module) => module.speechRuntimeDefinition)
              : null
  ]);
  if (computeManager.destroying || lifecycle !== computeManager.workerLifecycleRevision) {
    throw new Error('ComputeManager shutdown interrupted service creation');
  }
  if (resourceBroker && computeManager.resourceBroker && resourceBroker !== computeManager.resourceBroker) {
    throw new Error('Model sessions must share the ComputeManager resource broker');
  }
  if (!computeManager.resourceBroker) {
    if (!resourceBroker && !resourceBudgets) {
      throw new Error('Configure inference CPU/GPU resource budgets');
    }
    computeManager.resourceBroker = resourceBroker || new ResourceLeaseBroker({ capacities: resourceBudgets });
  }
  const service = new ModelInferenceService({
    ...options,
    runtimeDefinition,
    artifactStore,
    computeManager,
    admission: new ResidentModelAdmission({ ...admissionOptions, broker: computeManager.resourceBroker })
  });
  computeManager.modelServices.add(service);
  const dispose = service.dispose.bind(service);
  service.dispose = async () => {
    const result = await dispose();
    computeManager.modelServices.delete(service);
    return result;
  };
  return service;
}

async function defaultPeerInferenceServiceFactory(networkManager, options = {}) {
  const { PeerInferenceService } = await import('../networkManager/inference/PeerInferenceService.js');
  return new PeerInferenceService(networkManager, options);
}

/**
 * Register optional inference runtime plugins (ModelInferenceService,
 * PeerInferenceService, built-in `peercompute:*-inference` worker task loaders,
 * and the inference-enabled compute worker bootstrap URL).
 */
export function registerInferenceRuntime() {
  if (registered) return;
  registered = true;
  registerInferenceTaskModules();
  registerModelInferenceFactory(defaultModelInferenceFactory);
  registerPeerInferenceServiceFactory(defaultPeerInferenceServiceFactory);
  registerDefaultWorkerBootstrapURL(new URL('./computeWorker.js', import.meta.url));
}

registerInferenceRuntime();
