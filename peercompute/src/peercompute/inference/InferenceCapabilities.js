/** Operations describe requested work; a model's primary task is not its full
 * capability set. Only advertise modalities admitted by its executable adapter. */
export const INFERENCE_TASKS = Object.freeze(['text-generation', 'image-text-to-text', 'audio-text-to-text',
  'text-to-image', 'automatic-speech-recognition', 'text-to-speech', 'image-to-3d']);
const conversationTasks = new Set(['text-generation', 'image-text-to-text', 'audio-text-to-text']);

function modelSupportsTask(candidate, task) {
  const input = candidate?.modalities, output = candidate?.outputModalities;
  if (!Array.isArray(input) || !Array.isArray(output) || !INFERENCE_TASKS.includes(task)) return false;
  if (conversationTasks.has(task)) {
    return conversationTasks.has(candidate.task) && input.includes('text') && output.includes('text')
      && (task !== 'image-text-to-text' || input.includes('image'))
      && (task !== 'audio-text-to-text' || input.includes('audio'));
  }
  if (candidate.task !== task) return false;
  if (task === 'image-to-3d') return input.includes('image') && output.includes('mesh');
  if (task === 'automatic-speech-recognition') return input.includes('audio') && output.includes('text');
  return input.includes('text') && output.includes(task === 'text-to-image' ? 'image' : 'audio');
}

export function supportsTask(candidate, task) {
  if (!modelSupportsTask(candidate, task)) return false;
  // Directory groups may contain a modern local host and legacy remote hosts.
  // Filtering out that local host must also remove its advertised capabilities.
  return !Array.isArray(candidate.hosts) || candidate.hosts.some((host) => modelSupportsTask({ ...candidate, ...host }, task));
}

/** Audio with conversational context is native audio understanding. A bare PCM
 * request remains transcription unless its caller explicitly selects otherwise. */
export function inferInferenceTask(input = {}, fallback = 'text-generation') {
  if (input.task != null) return input.task;
  if (input.audio != null) return input.messages != null || input.prompt != null || input.image != null
    ? 'audio-text-to-text' : 'automatic-speech-recognition';
  return input.image != null ? 'image-text-to-text' : fallback;
}

export function supportsInferenceInput(candidate, input = {}) {
  return supportsTask(candidate, inferInferenceTask(input))
    && (input.image == null || candidate.modalities.includes('image'))
    && (input.audio == null || candidate.modalities.includes('audio'));
}
