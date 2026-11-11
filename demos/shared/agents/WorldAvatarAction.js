import { objectText } from './WorldObjectAction.js';

export function normalizeWorldAvatarAction(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new TypeError('Invalid avatar proposal');
  if (value.reset === true && Object.keys(value).length === 1) return { reset: true };
  if (Object.keys(value).some(key => !['name', 'prompt'].includes(key))) throw new TypeError('Unexpected avatar proposal fields');
  return { name: objectText(value.name, 120, 'avatar name'), prompt: objectText(value.prompt, 1024, 'avatar description') };
}
export const WORLD_AVATAR_ACTION_INSTRUCTIONS = 'When the owner asks you to change your body/model/avatar, become a car or robot, '
  + 'or design an avatar for yourself, return {"avatar":{"name":"short name","prompt":"visual description of your chosen isolated body"}}. '
  + 'Choose a concrete creative design yourself when asked. This replaces your own cosmetic body; it does not place a separate object. '
  + 'For an explicit request to return to your original cube, return {"avatar":{"reset":true}}. '
  + 'Questions or hypothetical discussion do not request a change. Generate only one action. Never claim a proposed avatar has already been saved.';
