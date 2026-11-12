import { validateImageInput } from '../../../peercompute/src/peercompute/inference/modelTask.js';
import { normalizeWorldAvatarAction } from './WorldAvatarAction.js';

export const AVATAR_IMAGE_PROMPT = 'Use this image as your avatar.';

/** Explicit owner commands bypass conversational prompt rewriting. Ordinary
 * chat remains ordinary chat; this parser never searches inside quoted prose. */
export function ownerAvatarInput(text, image) {
  if (image != null) {
    const checked = validateImageInput(image);
    // Leave size unspecified so the owner service can use the saved appearance
    // and actual mesh height, rather than the generic six-unit object default.
    return { action: { name: 'Reference avatar', prompt: AVATAR_IMAGE_PROMPT },
      image: { ...checked, data: new Uint8Array(checked.data) }, exactPrompt: false };
  }
  if (typeof text !== 'string') return null;
  const match = text.match(/^\s*(?:avatar prompt|use (?:this |the following )?exact prompt(?: for (?:your|the) (?:avatar|body|model))?|use this prompt exactly)\s*:\s*([\s\S]*)$/i);
  if (!match) return null;
  return { action: normalizeWorldAvatarAction({ name: 'Custom avatar', prompt: match[1] }), exactPrompt: true };
}
