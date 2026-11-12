import test from 'node:test';
import assert from 'node:assert/strict';
import { ownerAvatarInput } from '../shared/agents/WorldAvatarInput.js';
import { residentDeclinedAction, residentReplyModelLabel } from '../shared/agents/WorldReplyDisposition.js';

test('only explicit owner prompt commands bypass language-model rewriting', () => {
  for (const prefix of ['Avatar prompt:', 'Use this exact prompt:', 'Use this exact prompt for your avatar:', 'Use this prompt exactly:']) {
    const input = ownerAvatarInput(`${prefix} A copper robot, blue eyes.\nRound hands.`);
    assert.equal(input.action.prompt, 'A copper robot, blue eyes.\nRound hands.'); assert.equal(input.exactPrompt, true);
  }
  for (const text of ['Become a robot', 'What does "Avatar prompt: robot" mean?', 'He said use this exact prompt: robot']) assert.equal(ownerAvatarInput(text), null);
  assert.throws(() => ownerAvatarInput('Avatar prompt: '));
  assert.throws(() => ownerAvatarInput('Avatar prompt: ' + 'x'.repeat(1025)));
});
test('reference image bytes are copied and bounded, without interpreting the accompanying chat as a prompt', () => {
  const image = { width: 1, height: 1, channels: 4, data: new Uint8Array([1,2,3,255]) };
  const input = ownerAvatarInput('Use this for your body', image); image.data.fill(0);
  assert.deepEqual([...input.image.data], [1,2,3,255]); assert.equal(input.exactPrompt, false);
  assert.throws(() => ownerAvatarInput('', { ...image, width: 9999 }));
});
test('decline disposition is based on explicit resident speech, not the user request topic', () => {
  for (const text of ['I cannot generate that.', "Sorry, I can't create that avatar.", 'I’m unable to help with that.']) assert.equal(residentDeclinedAction(text), true);
  for (const text of ['I cannot wait to help.', 'You said I cannot create that.', 'A sign reading "I cannot help".', 'Sure, a robot.']) assert.equal(residentDeclinedAction(text), false);
  assert.equal(residentReplyModelLabel({ modelName: 'Model X', local: false }), 'Model X · peer');
  assert.equal(residentReplyModelLabel(undefined), '');
});
