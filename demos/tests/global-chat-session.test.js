import assert from 'node:assert/strict';
import test from 'node:test';
import { setImmediate as settle } from 'node:timers/promises';
import { createGlobalChatSession } from '../inference/src/ui/globalChatSession.js';
import { prepareGlobalChatInput } from '../shared/chat/globalInferenceChatContracts.js';
import { describeResultImage, readResultImage } from '../../peercompute/src/peercompute/networkManager/inference/imageResult.js';

const pixels = () => ({ width: 2, height: 1, channels: 4, data: new Uint8Array([12, 34, 56, 255, 78, 90, 123, 255]) });
const event = (image, phase = 'result') => ({ turnId: crypto.randomUUID(), phase, name: 'Alice', text: '', image });
function fixture(t) {
  const visible = [], sent = [], statuses = [], manager = {};
  const session = createGlobalChatSession({ getNetworkManager: () => manager,
    onEvent: (value) => visible.push(value), onStatus: (value) => statuses.push(value),
    serviceFactory: () => ({ async start() {}, async close() {}, async refresh() {},
      getStatus: () => ({ connected: true }), async publish(input) {
        // Keep the service's strict canonical contract at the real boundary.
        sent.push(prepareGlobalChatInput(input).input); return { delivery: { status: 'delivered' } };
      } }),
  });
  t.after(() => session.close());
  return { session, visible, sent, statuses, async flush() { await session.refresh(); await settle(); } };
}

test('Global accepts a verified peer image result while publishing only owned public pixels', async (t) => {
  const state = fixture(t), image = pixels(), metadata = describeResultImage(image), credits = [];
  const decoded = await readResultImage({ write: async (frame) => credits.push(frame),
    rpc: { read: async () => image.data } }, { image: metadata, requestId: 'peer-image', signal: AbortSignal.timeout(1000) });
  assert.equal(decoded.sha256, metadata.sha256);
  assert.deepEqual(credits.map(({ offset }) => offset), [0, image.data.length]);
  assert.throws(() => prepareGlobalChatInput(event(decoded)), /Unexpected global chat fields/,
    'The canonical service contract must stay strict; the UI owns result projection');
  state.session.publish({ ...event({ ...decoded, sourceUrl: 'https://private.invalid/', privateContext: 'DO_NOT_SHARE' }),
    messages: [{ role: 'system', content: 'DO_NOT_SHARE' }] });
  assert.equal(state.visible.length, 1, 'Peer-generated image must appear locally in Global');
  decoded.data.fill(0);
  await state.flush();
  assert.equal(state.sent.length, 1, 'Peer-generated image must enter the public outbox');
  assert.deepEqual(state.sent[0].image, image);
  assert.deepEqual(Object.keys(state.sent[0].image).sort(), ['channels', 'data', 'height', 'width']);
  assert.doesNotMatch(JSON.stringify(state.sent), /DO_NOT_SHARE|private.invalid|sha256|messages/);
  assert(!state.statuses.some((value) => value.includes('could not be shared')));
});

test('Global preserves attachments and local generated images as independent snapshots', async (t) => {
  const state = fixture(t), attachment = pixels(), generated = pixels(); generated.data[0] = 201;
  const expectedAttachment = structuredClone(attachment), expectedGenerated = structuredClone(generated);
  state.session.publish(event(attachment, 'prompt')); state.session.publish(event(generated));
  attachment.data.fill(0); generated.data.fill(0);
  await state.flush();
  assert.equal(state.visible.length, 2); assert.equal(state.sent.length, 2);
  assert.deepEqual(state.sent.map((value) => value.image), [expectedAttachment, expectedGenerated]);
});

test('Global image projection still rejects invalid pixels, dimensions and URLs before echo or send', async (t) => {
  const state = fixture(t);
  for (const image of [null, 'blob:https://private.invalid/image', { ...pixels(), data: new Uint8Array(3) },
    { ...pixels(), width: 1025 }, { ...pixels(), channels: 3 }, { ...pixels(), data: [1, 2, 3, 4] }]) {
    state.session.publish(event(image));
  }
  await state.flush();
  assert.equal(state.visible.length, 0); assert.equal(state.sent.length, 0);
  assert(state.statuses.some((value) => value.includes('could not be shared')));
});
