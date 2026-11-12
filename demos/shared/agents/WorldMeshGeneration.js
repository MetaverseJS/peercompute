import { routeAgentTask } from '../../../peercompute/src/peercompute/agents/AgentRouter.js';
import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { validateGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';

/** Generation only: callers own authorization, persistence and scene placement. */
export async function generateWorldMesh({ inference, head, description, name, image: reference, exactPrompt = false, signal,
  assertCurrent = () => {}, onEvent = () => {} }) {
  if (typeof exactPrompt !== 'boolean') throw new TypeError('Exact prompt must be a boolean');
  const check = async () => { signal?.throwIfAborted(); await assertCurrent(); signal?.throwIfAborted(); };
  await check();
  const imageInput = reference ? { ...validateImageInput(reference), data: reference.data.slice() } : null;
  async function candidate(task) {
    const candidates = await inference.listCandidates({ task, mode: head.policy.inferenceMode, signal, refresh: true });
    await check();
    try { return routeAgentTask({ task, inferenceMode: head.policy.inferenceMode, candidates }).candidate; }
    catch (error) {
      if (error.code !== 'ERR_AGENT_NO_MODEL') throw error;
      throw new Error(task === 'image-to-3d' ? 'No 3D generation model is available. Load or connect to an image-to-3D model first.'
        : 'A text-to-image model is needed to create the reference image. Load one locally or connect to a host.');
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
