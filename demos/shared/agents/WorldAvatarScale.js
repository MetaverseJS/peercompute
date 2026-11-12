import { normalizeWorldModelSize, worldModelSizeForHeight } from '../world/WorldModelScale.js';

export const REFERENCE_AVATAR_HEIGHT = 12;
// These are local presentation hints, not a language-model prompt. Keep body
// modifiers separate from details such as small eyes or a giant sword.
const body = '(?:body|avatar|resident|character|figure|creature|person|human|humanoid|robot|android|skeleton|knight|elf|fairy|goblin|dwarf|cat|dog|dragon)';
function bodyModifier(text, words) {
  return new RegExp(`\\b(?:${words})\\s+(?:[a-z-]+\\s+){0,2}${body}\\b`, 'i').test(text)
    || new RegExp(`\\b(?:${body}|height|stature|build)\\s+(?:is\\s+|looks\\s+)?(?:very\\s+)?(?:${words})\\b`, 'i').test(text)
    || new RegExp(`^(?:${words})[.!]?$`, 'i').test(text.trim());
}

export function referenceAvatarHeight(appearance = '') {
  if (typeof appearance !== 'string') throw new TypeError('Avatar appearance must be text');
  const explicit = appearance.match(/\b(\d+(?:\.\d+)?)\s+world units?\s+(?:tall|high)\b/i);
  if (explicit) return normalizeWorldModelSize(Number(explicit[1]));
  if (bodyModifier(appearance, 'miniature|tiny|toy')) return 3;
  if (bodyModifier(appearance, 'giant|towering|colossal|enormous')) return 24;
  if (bodyModifier(appearance, 'short|small|petite')) return 9;
  if (bodyModifier(appearance, 'tall|large')) return 15;
  return REFERENCE_AVATAR_HEIGHT;
}

export function referenceAvatarSize(mesh, appearance) {
  return worldModelSizeForHeight(mesh.bounds, referenceAvatarHeight(appearance));
}
