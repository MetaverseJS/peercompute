import { routeAgentTask } from '../../../peercompute/src/peercompute/agents/AgentRouter.js';
import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { validateGeneratedMesh } from '../../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';

/** Generation only: callers own authorization, persistence and scene placement. */
export async function generateWorldMesh({ inference, head, description, name, image: reference, signal,
  assertCurrent = () => {}, onEvent = () => {} }) {
  const check = async () => { signal?.throwIfAborted(); await assertCurrent(); signal?.throwIfAborted(); };
  await check();
  const imageInput = reference ? { ...validateImageInput(reference), data: reference.data.slice() } : null;
  async function candidate(task) {
    const candidates = await inference.listCandidates({ task, mode: head.policy.inferenceMode, signal });
    await check();
    try { return routeAgentTask({ task, inferenceMode: head.policy.inferenceMode, candidates }).candidate; }
    catch (error) {
      if (error.code !== 'ERR_AGENT_NO_MODEL') throw error;
      throw new Error(task === 'image-to-3d' ? 'No 3D generation model is available. Load or connect to an image-to-3D model first.'
        : 'A text-to-image model is needed to create the reference image. Load one locally or connect to a host.');
    }
  }
  const meshCandidate = await candidate('image-to-3d');
  const imageCandidate = imageInput ? null : await candidate('text-to-image');
  if (!imageInput) onEvent({ status: 'image', message: `Creating a reference image for ${name}…` });
  const image = imageInput ? { image: imageInput } : await inference.generate(imageCandidate,
    { requestId: crypto.randomUUID(), task: 'text-to-image', prompt: `${description}. Single isolated object, plain white background, no text.` }, { signal });
  await check();
  if (!image?.image) throw new Error('The image model returned no reference image');
  onEvent({ status: 'mesh', message: `Generating 3D shape for ${name}…` });
  const output = await inference.generate(meshCandidate,
    { requestId: crypto.randomUUID(), task: 'image-to-3d', image: image.image }, { signal });
  await check();
  return validateGeneratedMesh(output?.mesh);
}
