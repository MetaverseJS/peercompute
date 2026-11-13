import test from 'node:test';
import assert from 'node:assert/strict';
import { worldActionCapabilityFacts } from '../shared/agents/WorldActionCapabilities.js';

const candidate = (task, change = {}) => ({ key: `peer:${task}`, manifestCid: task, runtime: 'fixture', local: false, available: true,
  task, modalities: [task === 'image-to-3d' ? 'image' : 'text'], outputModalities: [task === 'image-to-3d' ? 'mesh' : 'image'], ...change });
const facts = change => worldActionCapabilityFacts({ allowObject: true, allowAvatar: true, inferenceMode: 'network-assisted', ...change });

test('capability facts identify virtual nearby tools, current providers and verified receipts concisely', () => {
  const text = facts({ targets: [candidate('text-to-image'), candidate('image-to-3d')] });
  assert.match(text, /create\/place nearby virtual 3D objects; replace avatar/);
  assert.match(text, /image=ready, mesh=ready/); assert.match(text, /verified receipts/); assert.match(text, /Not physical manufacturing/);
  assert(text.split(/\s+/).length < 60); assert(new TextEncoder().encode(text).length < 512);
});

test('readiness respects local-only routing and distinguishes busy from absent providers', () => {
  const targets = [candidate('text-to-image'), candidate('image-to-3d', { busy: true, queueAvailable: false })];
  assert.match(facts({ targets }), /image=ready, mesh=busy/);
  assert.match(facts({ targets, inferenceMode: 'local-only' }), /image=not-advertised, mesh=not-advertised/);
  targets.push(candidate('image-to-3d', { key: 'local:mesh', local: true }));
  assert.match(facts({ targets, inferenceMode: 'local-only' }), /image=not-advertised, mesh=ready/);
  assert.match(facts({ targets: [] }), /not-advertised/); assert.match(facts({ targets: [] }), /Missing\/busy means wait/);
});

test('a busy matching host cannot borrow readiness from an incompatible host in its directory group', () => {
  const mesh = candidate('image-to-3d', { hosts: [{ busy: true, queueAvailable: false },
    { task: 'text-generation', modalities: ['text'], outputModalities: ['text'], busy: false }] });
  assert.match(facts({ targets: [mesh] }), /mesh=busy/);
});

test('a supplied image bypasses image-generation needs while mesh readiness remains required', () => {
  assert.match(facts({ hasImage: true, targets: [candidate('image-to-3d')] }), /image=supplied \(skip image generation\), mesh=ready/);
  assert.match(facts({ hasImage: true, targets: [] }), /mesh=not-advertised/);
});

test('unadmitted tools produce no prompt additions and missing snapshots never assert permanent inability', () => {
  assert.equal(worldActionCapabilityFacts(), '');
  assert.equal(facts({ allowObject: false, allowAvatar: false }), '');
  assert.match(facts({ targets: undefined }), /image=unknown, mesh=unknown/);
  const avatar = facts({ allowObject: false, targets: [] }); assert(!avatar.includes('create/place')); assert(avatar.includes('replace avatar'));
  assert.doesNotMatch(avatar, /cannot|incapable|unable/i);
});

test('provider names, descriptions and other private data never enter the system capability block', () => {
  const text = facts({ targets: [candidate('text-to-image', { name: 'PRIVATE_NAME', description: 'PRIVATE_DESCRIPTION', profile: 'PRIVATE_PROFILE' }), candidate('image-to-3d')] });
  assert(!text.includes('PRIVATE')); assert.match(text, /image=ready/);
});

test('observed-destination capability is only advertised when the world adapter supports it', () => {
  assert.match(facts({ allowPlacement: true }), /at observed places or beside people/);
  assert.doesNotMatch(facts({ allowPlacement: false }), /observed places/);
  assert.doesNotMatch(facts({ allowPlacement: true, allowObject: false }), /observed places/);
  assert(facts({ allowPlacement: true }).split(/\s+/).length < 60);
});
