import { routeAgentTask } from '../../../peercompute/src/peercompute/agents/AgentRouter.js';
import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { validateGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { classifyInferenceAvailability } from '../../../peercompute/src/peercompute/inference/InferenceAvailability.js';

const MODEL_DISCOVERY_WAIT_MS = 15_000;

/** Generation only: callers own authorization, persistence and scene placement. */
export async function generateWorldMesh({ inference, head, description, name, image: reference, exactPrompt = false, signal,
  assertCurrent = () => {}, onEvent = () => {} }) {
  if (typeof exactPrompt !== 'boolean') throw new TypeError('Exact prompt must be a boolean');
  const check = async () => { signal?.throwIfAborted(); await assertCurrent(); signal?.throwIfAborted(); };
  await check();
  const imageInput = reference ? { ...validateImageInput(reference), data: reference.data.slice() } : null;
  async function candidate(task) {
    const mode = head.policy.inferenceMode;
    const candidates = await inference.listCandidates({ task, mode, signal, refresh: true });
    await check();
    try { return routeAgentTask({ task, inferenceMode: mode, candidates }).candidate; }
    catch (error) {
      let lastError = error;
      const label = task === 'image-to-3d' ? '3D generation' : 'text-to-image';
      if (mode === 'network-assisted' && inference.waitForCandidate && classifyInferenceAvailability(error)) {
        // Discovery snapshots can briefly lose a peer. Wait on selection only;
        // never replay a reference image or a mesh request already dispatched.
        onEvent({ status: 'waiting', message: `Waiting for an available ${label} model…` });
        try {
          const result = await inference.waitForCandidate({ task, mode, signal, timeoutMs: MODEL_DISCOVERY_WAIT_MS });
          await check();
          return result.candidate;
        } catch (waitError) {
          await check();
          lastError = waitError;
        }
      }
      const available = classifyInferenceAvailability(lastError);
      if (available?.kind === 'busy') throw new Error(`Compatible ${label} models are busy. Try again when a queue has room.`, { cause: lastError });
      if (available?.kind !== 'model-unavailable') throw lastError;
      const guidance = mode === 'local-only'
        ? 'Load a compatible model on this device, or turn off “Use only models on this device” in the resident’s Profile to use peers.'
        : task === 'image-to-3d' ? 'Load or connect to an image-to-3D model first.' : 'Load one locally or connect to a host.';
      throw new Error(`${task === 'image-to-3d' ? 'No 3D generation model is available.'
        : 'A text-to-image model is needed to create the reference image.'} ${guidance}`, { cause: lastError });
    }
  }
  // Avoid generating a reference image when no mesh provider can use it.
  await candidate('image-to-3d');
  const imageCandidate = imageInput ? null : await candidate('text-to-image');
  if (!imageInput) onEvent({ status: 'image', message: `Creating a reference image for ${name}…` });
  const image = imageInput ? { image: imageInput } : await inference.generate(imageCandidate,
    { requestId: crypto.randomUUID(), task: 'text-to-image',
      prompt: exactPrompt ? description : `${description}. Single isolated object, plain white background, no text.` }, { signal });
  await check();
  if (!image?.image) throw new Error('The image model returned no reference image');
  // Image generation can outlast a peer session. Route against current
  // availability again; never dispatch the earlier snapshot or retry inference.
  const meshCandidate = await candidate('image-to-3d');
  onEvent({ status: 'mesh', message: `Generating 3D shape for ${name}…` });
  const output = await inference.generate(meshCandidate,
    { requestId: crypto.randomUUID(), task: 'image-to-3d', image: image.image }, { signal });
  await check();
  return validateGeneratedMesh(output?.mesh);
}
