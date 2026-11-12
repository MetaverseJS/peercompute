import { generateWorldOodaDecision } from './WorldOodaDecision.js';
import { observeVision } from './WorldVision.js';
import { worldResidentName } from './WorldConversationContext.js';
import { classifyInferenceAvailability } from '../../../peercompute/src/peercompute/inference/InferenceAvailability.js';

function queryExcerpt(value) {
  let result = ''; const encoder = new TextEncoder();
  for (const character of value) { if (encoder.encode(result + character).length > 512) break; result += character; }
  return result;
}

/** Connect slow cognition to borrowed memory, inference, physical receipts and
 * the authenticated room-chat protocol. No raw camera frame enters storage. */
export function createWorldOodaResident({ worldId, agents, experience, adapter, memory, knowledge, getBody, owns,
  publish, conversationId, now = Date.now, decide = generateWorldOodaDecision, see = observeVision } = {}) {
  const bindingOf = head => head?.embodiments?.find(item => item.worldId === worldId);
  return async function deliberate({ resident, signal, isCurrent, stage }) {
    const key = resident.key, head = await agents.get(resident.agentId), binding = bindingOf(head);
    const valid = () => !signal.aborted && isCurrent() && owns(resident.agentId) && getBody(key)?.local;
    const check = async () => {
      signal.throwIfAborted();
      const current = await agents.get(resident.agentId);
      if (!valid() || current.revision !== head.revision || current.status === 'paused' || current.recoveryRequired
          || bindingOf(current)?.autonomous === false) throw new DOMException('Resident deliberation changed', 'AbortError');
    };
    await check();
    const canSpeak = !!publish && binding.shared && binding.initiateConversations === true;
    // A reflection informed by owner-private knowledge must never be retrieved
    // later by a cycle permitted to publish speech. Keep separate exact scopes.
    const id = await conversationId(worldId, canSpeak ? 'resident-reflection' : 'resident-private-reflection');
    const scope = { worldId, agentId: head.agentId, audience: 'private', conversationId: id };
    let observed = experience.observe(key), memories = [], publicMemories = [];
    if (memory) {
      memories = await memory.retrieve({ ...scope, query: queryExcerpt(head.goals.join(' ')), limit: 3 }, { signal });
      publicMemories = await memory.retrieve({ ...scope, audience: 'public',
        conversationId: await conversationId(worldId, 'public-room'), query: '', limit: 3 }, { signal });
    }
    const knowledgeAudience = canSpeak ? 'public' : 'private';
    if (knowledge) observed = await knowledge.observe({ key, agentId: head.agentId, observed, audience: knowledgeAudience, query: head.goals.join(' '), signal });
    await check(); stage('orienting');
    const options = { inference: agents.inference, head, memories, publicMemories, canSpeak,
      canAct: observed.self.motion?.type !== 'follow', canSee: typeof adapter.captureVision === 'function', signal };
    let decision = await decide({ ...options, observed });
    await check();
    async function remember(kind, text, outcome, when = now()) {
      if (!memory || !text) return;
      await memory.append({ ...scope, kind, when, where: observed.self.position,
        who: { agentId: head.agentId, name: head.identity.name }, text, outcome,
        source: { kind: 'local-observation', eventId: crypto.randomUUID() } }, { signal });
    }
    if (decision.decision === 'look') {
      stage('looking');
      let vision;
      try { vision = await see({ adapter, inference: agents.inference, head, key, question: decision.question, signal }); }
      catch (error) {
        // An optional specialist must not trap text-only networks in a look/wait
        // loop. Only proven admission failure permits a fresh nonvisual decision;
        // unknown execution is left for the normal recovery cooldown.
        if (!classifyInferenceAvailability(error)) throw error;
      }
      await check();
      observed = experience.observe(key);
      if (knowledge) observed = await knowledge.observe({ key, agentId: head.agentId, observed, audience: knowledgeAudience, query: head.goals.join(' '), signal });
      if (vision) await remember('visual-interpretation', vision.description,
        'A vision model interpreted a resident-view frame; this is uncertain visual evidence, not verified physics.', vision.observedAt);
      stage('deciding');
      decision = await decide({ ...options, canSee: false, canAct: options.canAct && observed.self.motion?.type !== 'follow', observed, vision });
      await check();
    }
    await knowledge?.assertCurrent(observed, { signal });
    await remember('reflection', decision.reflection, 'The resident reflected privately; this is a proposal, not a verified fact.');
    await check();
    if (decision.decision === 'wait') return { status: 'resting' };
    if (decision.decision === 'act') {
      if (!options.canAct || experience.observe(key).self.motion?.type === 'follow') {
        return { status: 'resting', reason: 'The current follow task keeps control of movement.' };
      }
      await knowledge?.assertCurrent(observed, { signal });
      stage('acting');
      const turn = { key, scope, senses: observed, signal, speaker: { agentId: head.agentId, peerId: resident.ownerPeerId, name: head.identity.name } };
      await experience.applyIntent(turn, decision.intent, { requestId: crypto.randomUUID(), valid });
      return { status: 'acting' };
    }
    if (decision.decision !== 'speak' || !canSpeak) throw new Error('Unsupported resident deliberation');
    const target = experience.observe(key).participants.find(item => item.id === decision.targetId && item.distance < 60);
    if (!target) return { status: 'resting', reason: 'The participant moved away.' };
    await check(); await knowledge?.assertCurrent(observed, { signal }); stage('speaking');
    const startedAt = now();
    const social = { rootId: crypto.randomUUID(), rootPeerId: resident.ownerPeerId, rootAgentId: head.agentId,
      targetPeerId: target.peerId || target.ownerPeerId, ...(target.agentId ? { targetAgentId: target.agentId } : {}),
      startedAt, expiresAt: startedAt + 120000, turn: 0 };
    // This exact publication is attempted once. Uncertain delivery must never
    // cause the same utterance/root to be retried by a recovery timer.
    const result = await publish({ agentId: head.agentId, name: worldResidentName(head.identity.name), text: decision.text, social }, { signal });
    await experience.rememberDelivery({ key, conversationId: await conversationId(worldId, 'public-room'),
      target, text: decision.text, result, eventId: `${social.rootId}:0`, signal });
    await remember('social-delivery', decision.text, 'A public utterance was submitted; it must not be replayed.');
    return { status: 'spoken' };
  };
}
