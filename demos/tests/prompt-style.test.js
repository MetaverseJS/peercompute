import test from 'node:test';
import assert from 'node:assert/strict';
import { styleLanguagePrompt } from '../../peercompute/src/peercompute/inference/promptStyle.js';
import { normalizeAgentTask, packAgentContext } from '../../peercompute/src/peercompute/agents/AgentRouter.js';
import { MODEL_POLICY } from '../../peercompute/src/peercompute/inference/modelManifest.js';

test('concision applies only to opted-in language tasks', () => {
  for (const task of ['text-generation', 'image-text-to-text', 'audio-text-to-text']) {
    assert.equal(styleLanguagePrompt('Hello', { task, concise: true }), 'Hello\n\nBe concise.');
    assert.equal(styleLanguagePrompt('Hello', { task, concise: false }), 'Hello');
  }
  for (const task of ['text-to-image', 'automatic-speech-recognition', 'text-to-speech']) {
    assert.equal(styleLanguagePrompt('Hello', { task, concise: true }), 'Hello');
  }
});

test('agent style reaches the current model message without changing saved prompt or history', () => {
  const input = normalizeAgentTask({ prompt: 'Next question', concise: true });
  const events = [{ type: 'request', task: 'text-generation', operationId: 'old', text: 'Old question' },
    { type: 'result', task: 'text-generation', operationId: 'old', text: 'Old answer' }];
  const packed = packAgentContext({ identity: { name: 'Ada' } }, input, events);
  assert.equal(packed.prompt, 'Next question');
  assert.deepEqual(packed.messages.slice(1), [{ role: 'user', content: 'Old question' },
    { role: 'assistant', content: 'Old answer' }, { role: 'user', content: 'Next question\n\nBe concise.' }]);
  assert.equal(input.prompt, 'Next question');
  assert.equal(packAgentContext({}, normalizeAgentTask({ prompt: 'Next question' })).messages.at(-1).content, 'Next question');
  assert.throws(() => normalizeAgentTask({ prompt: 'Next question', concise: 'yes' }), /boolean/);
});

test('vision gets current-turn style and generation keeps the exact image prompt', () => {
  const image = { width: 1, height: 1, channels: 4, data: new Uint8Array(4) };
  const vision = normalizeAgentTask({ prompt: 'Describe', image, concise: true });
  assert.equal(packAgentContext({}, vision).messages.at(-1).content, 'Describe\n\nBe concise.');
  const diffusion = normalizeAgentTask({ task: 'text-to-image', prompt: 'A forest', concise: true });
  assert.deepEqual(packAgentContext({}, diffusion).messages, [{ role: 'user', content: 'A forest' }]);
});

test('appended instructions remain within the normal agent context budget', () => {
  const task = normalizeAgentTask({ prompt: 'a'.repeat(MODEL_POLICY.maxPromptBytes), concise: true });
  assert.throws(() => packAgentContext({}, task), /byte budget/);
});
