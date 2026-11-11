const LANGUAGE_TASKS = new Set(['text-generation', 'image-text-to-text', 'audio-text-to-text']);

/** Apply per-turn style only at the language-model boundary. Keep original
 * user text in transcripts and persisted memory; never style ASR/TTS or images.
 */
export function styleLanguagePrompt(prompt, { task = 'text-generation', concise = false } = {}) {
  return concise && LANGUAGE_TASKS.has(task) ? `${prompt}\n\nBe concise.` : prompt;
}
