import { createWorldResidentAvatars } from './WorldResidentAvatars.js';
import { createWorldExperience } from './WorldExperience.js';
import { createWorldConversationTurns } from './WorldConversationTurn.js';
import { admitWorldChatTask, chatTaskFailure } from './WorldChatTask.js';
import { createWorldSocialInitiative } from './WorldSocialInitiative.js';
import { createWorldStandingGoalRunner } from './WorldStandingGoal.js';
import { proposeWorldSelfProfile } from './WorldSelfProfile.js';
import { generateWorldSocialDecision } from './WorldSocialIntent.js';
import { createWorldGoalController } from './WorldGoalController.js';
import { generateWorldGoalDecision } from './WorldGoalDecision.js';
import { createResidentMotorService } from './motor/ResidentMotorService.js';
import { originalWorldPrompt, parseWorldReply } from './WorldIntent.js';
import { createResidentProfile, normalizeResidentProfile } from '../../../peercompute/src/peercompute/agents/ResidentProfile.js';
import { normalizeAgentFace } from '../../../peercompute/src/peercompute/agents/WorldAgentContracts.js';
import { createWorldAgentUi } from './worldAgentUi.js';
import { AgentConversationService } from '../../../peercompute/src/peercompute/agents/AgentConversationService.js';
import { normalizePublicAgent, WORLD_AGENT_LIMITS, worldAgentText } from '../../../peercompute/src/peercompute/agents/WorldAgentContracts.js';
import { speechChunks } from '../../../peercompute/src/peercompute/inference/speech/chunks.js';
import { WorldEmbodimentLease } from './WorldEmbodimentLease.js';
import { createWorldAppearance } from './WorldAppearance.js';
import { createWorldAppearancePresenter } from './WorldAppearancePresenter.js';
import { createWorldGeneratedObjects } from './WorldGeneratedObjects.js';
import { createWorldChatResponder } from './WorldChatResponder.js';
import { worldConversationContext, worldReplyPrompt, worldResidentName, worldPublicMessage } from './WorldConversationContext.js';
import { routeAgentTask } from '../../../peercompute/src/peercompute/agents/AgentRouter.js';
export { speechChunks } from '../../../peercompute/src/peercompute/inference/speech/chunks.js';

const encoder = new TextEncoder();
const standingLimits = Object.freeze({ discoveryMs: 60000, generationMs: 45000, decisionMs: 120000 });
const defaultRuntime = async (options) => (await import('../../inference/src/runtime.js')).createInferenceRuntime(options);
const defaultSpeech = async (options) => (await import('./speech/WorldSpeech.js')).createWorldSpeech(options);
const defaultAudio = async (options) => (await import('./speech/WorldAudio.js')).createWorldAudio(options);
const statusOf = (head) => head.recoveryRequired || head.status === 'paused' ? 'paused'
  : ['queued', 'running'].includes(head.activity?.status) ? 'thinking' : 'idle';

export async function worldConversationId(worldId, requester) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`${worldId}\0${requester}`));
  return `world:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

/** Scene-owned bodies and conversations. Closing a window never owns the agent. */
export function installWorldAgents({ worldId, worldLabel, adapter, getRuntimeOptions = () => ({}), beforeOpen,
  exclusiveEmbodiments = false, panelOwnsWindow = false, getModelReturnFocus = () => document.activeElement,
  publishWorldMessage, socialOptions = {}, goalOptions = {}, defaultResident, worldKnowledge = '', generatedObjectAdapter, residentAvatarAdapter,
  runtimeFactory = defaultRuntime, speechFactory = defaultSpeech, audioFactory = defaultAudio,
  uiFactory = createWorldAgentUi, serviceFactory = (options) => new AgentConversationService(options),
  panelFactory = async (options) => (await import('../../inference/src/agentPanel.js')).mountInferencePanel(options) } = {}) {
  worldAgentText(worldId, 240, 'world');
  if (worldKnowledge) worldAgentText(worldKnowledge, 2048, 'world knowledge');
  if (!adapter?.upsert || !adapter?.normalizePosition || !adapter?.dispose) throw new Error('A world agent body adapter is required');
  const lifetime = new AbortController(), bodies = new Map(), heads = new Map(), transcripts = new Map();
  let runtime, agents, network, worldManager, speech, audio, ui, selectedKey, disposed = false, closing, unsubscribe;
  let refreshing, refreshPending = false, networkStarting, modelStarting, networkTimer, navigationTimer, panel, panelOpening, panelClosing, panelShell, panelReturnFocus, embodimentLease;
  let operation, operationDone, voicePreparation, voicePreparationDone, recordingStart, voiceEnabled = false, recording = false;
  let appearance, appearancePresenter, generatedObjects, residentAvatars, worldChat, experience, conversations, motor, memory, social, socialOperation, socialDone;
  let objectives, objectiveStore, unsubscribeObjectives;
  let standing, standingRunner, standingStore;
  const standingStates = new Map();
  const profileStates = new Map();
  const objectiveStates = new Map(), objectiveDecisions = new Map();
  const socialStates = new Map();
  let publicEpoch = 0, privateResponses = 0;
  const appearanceStates = new Map();
  const worldChatDisabled = new Set();
  const pendingPublicCaptions = new Map();
  const localKey = (id) => `local:${id}`;
  const bindingOf = (head) => head?.embodiments?.find((binding) => binding.worldId === worldId);
  const fail = (error) => { if (!disposed) ui?.setStatus(error?.name === 'AbortError' ? 'Cancelled.' : error?.message ?? String(error)); };
  const alive = () => { if (disposed) throw new Error('World agents are closed'); };
  const voiceUnavailable = 'Voice models are no longer loaded. Enable voice to prepare them again.';
  function refreshVoiceAvailability() {
    if (voiceEnabled && speech?.getStatus().status !== 'ready') {
      voiceEnabled = false;
      ui.setVoiceStatus({ enabled: false, recording, preparing: !!voicePreparation });
      ui.setStatus(voiceUnavailable);
    }
    return voiceEnabled;
  }
  function requireConversationIdle() {
    if (operation) throw new Error('Wait for the current conversation or cancel it');
    if (recording || recordingStart) throw new Error('Stop or cancel the microphone recording first');
    if (panel || panelOpening) throw new Error('Close Models before starting a conversation');
  }
  const worldNetwork = () => worldManager ?? runtime.networkManager;
  const objectiveActive = id => ![undefined, 'paused', 'completed', 'cancelled'].includes(objectiveStates.get(id)?.status);
  const objectivePlanning = () => [...objectiveStates.values()].some(goal => goal.status === 'planning');
  const ownsObjective = id => bodies.get(localKey(id))?.local === true && (!embodimentLease || embodimentLease.entries.has(id));
  function ownedObjectiveBody(key) {
    const body = bodies.get(key);
    if (!body?.local || !ownsObjective(body.agentId)) throw new Error('Only the resident owner can manage its objective');
    if (!objectives) throw new Error('Persistent objectives are unavailable for this world');
    return body;
  }
  function presentObjective(record) {
    if (disposed || !record) return;
    objectiveStates.set(record.agentId, record);
    if (!['planning', 'acting'].includes(record.status)) objectiveDecisions.delete(record.goalId);
    const key = localKey(record.agentId);
    if (bodies.get(key)?.local) ui.setGoalStatus?.(key, record);
    social?.sync(); standing?.sync();
  }
  async function assignGoal({ key, objective }) {
    await ready; alive(); requireConversationIdle();
    const body = ownedObjectiveBody(key);
    const head = await agents.get(body.agentId);
    if (head.status === 'paused' || head.recoveryRequired) throw new Error('Resume this resident before starting an objective');
    await interruptSocial('owner');
    return objectives.assign({ agentId: body.agentId, objective, requesterId: `human:${worldNetwork()?.peerId}` });
  }
  async function goalControl(method, { key, goalId, expectedRevision }) {
    await ready; alive(); const body = ownedObjectiveBody(key);
    if (method === 'resume') {
      requireConversationIdle();
      const head = await agents.get(body.agentId);
      if (head.status === 'paused' || head.recoveryRequired) throw new Error('Resume this resident before resuming its objective');
      await interruptSocial('owner');
    }
    return objectives[method]({ agentId: body.agentId, goalId, expectedRevision,
      ...(method === 'resume' ? { requesterId: `human:${worldNetwork()?.peerId}` } : {}) });
  }
  const pauseGoal = input => goalControl('pause', input);
  const resumeGoal = input => goalControl('resume', input);
  const cancelGoal = input => goalControl('cancel', input);
  async function getObjective(key) {
    await ready; alive(); const body = ownedObjectiveBody(key); return objectives.get(body.agentId);
  }
  async function pauseResidentObjective(agentId) {
    if (!objectives || !ownsObjective(agentId)) return;
    const goal = await objectives.get(agentId);
    if (goal && !['paused', 'completed', 'cancelled'].includes(goal.status)) {
      await objectives.pause({ agentId, goalId: goal.goalId, expectedRevision: goal.revision });
    }
  }
  function liveBody(body) {
    const position = body.local ? adapter.getPosition?.(body.key) : null;
    return position ? { ...body, position: adapter.normalizePosition(position) } : body;
  }
  const list = () => [...bodies.values()].map(liveBody);
  function refreshNavigation() {
    if (disposed || !ui?.setNavigationStatus || !adapter.getResidentMotorStatus || ui.isNavigationVisible?.() === false) return;
    // Physical details belong to the owner's inspector, never the public body
    // directory or model prompt. Other scenes need not implement this surface.
    for (const body of bodies.values()) if (body.local) {
      ui.setNavigationStatus(body.key, adapter.getResidentMotorStatus(body.key));
    }
  }
  const updateList = () => {
    if (!disposed) { const entries = list(); ui.setAgents(entries); refreshNavigation(); appearancePresenter?.sync(entries); void residentAvatars?.syncSharing(entries); worldChat?.sync(); social?.sync(); standing?.sync();
      for (const record of objectiveStates.values()) if (bodies.get(localKey(record.agentId))?.local) ui.setGoalStatus?.(localKey(record.agentId), record);
    }
  };
  function setBody(descriptor) {
    // A directory/activity refresh has no new speech. Only an explicit empty
    // caption clears it; the adapter's existing expiry timer remains in charge.
    if (!Object.hasOwn(descriptor, 'caption') && bodies.has(descriptor.key)) {
      descriptor = { caption: bodies.get(descriptor.key).caption, ...descriptor };
    }
    // Metadata/activity updates must not teleport an owner-driven body back to
    // its saved spawn point. Movement is ephemeral, not a per-frame journal.
    if (descriptor.local && bodies.get(descriptor.key)?.local) descriptor = liveBody(descriptor);
    descriptor = { ...descriptor, position: adapter.normalizePosition(descriptor.position) };
    adapter.upsert(descriptor); bodies.set(descriptor.key, descriptor);
  }
  function caption(key, text, status = 'idle') {
    const current = bodies.get(key);
    if (current && !disposed) setBody({ ...current, caption: text.slice(0, 2048), status });
  }
  function showMessages(key) { if (selectedKey === key && !disposed) ui.setMessages(transcripts.get(key) ?? []); }
  function message(key, role, text) {
    const entries = [...(transcripts.get(key) ?? []), { role, text }].slice(-24);
    while (entries.length > 1 && encoder.encode(JSON.stringify(entries)).length > 128 * 1024) entries.shift();
    transcripts.set(key, entries); showMessages(key);
  }
  function refreshLocal() {
    if (disposed) return Promise.resolve();
    refreshPending = true;
    if (refreshing) return refreshing;
    // Mutations during a store/lease read invalidate that pass. Every waiter
    // must see the newer state before returning (not a stale created/paused
    // body after resume). Assign the promise before invoking any collaborator.
    refreshing = Promise.resolve().then(async () => {
      try {
        do { refreshPending = false; await refreshLocalSnapshot(); }
        while (refreshPending && !disposed);
      } finally {
        // Clear in this continuation, without a separate finally microtask
        // that could swallow a new invalidation after the drain finishes.
        refreshing = null;
      }
    });
    return refreshing;
  }
  async function refreshLocalSnapshot() {
      const records = await agents.list();
      if (disposed || refreshPending) return;
      const current = new Set(); heads.clear();
      for (const head of records) {
        heads.set(head.agentId, head);
        const binding = bindingOf(head);
        if (!binding) continue;
        if (current.size >= WORLD_AGENT_LIMITS.agents) break;
        if (embodimentLease && !await embodimentLease.acquire(head.agentId)) continue;
        if (disposed) return;
        const key = localKey(head.agentId); current.add(key);
        try {
          setBody({ ...normalizePublicAgent({ agentId: head.agentId, name: head.identity.name,
            position: binding.position, color: binding.color, status: statusOf(head),
            ...(binding.allowCloning ? { cloneable: binding.shared === true } : {}),
            ...(binding.shareMemories ? { sharesMemories: binding.shared === true && binding.allowCloning === true } : {}),
            ...(binding.sharePrivateMemories ? { sharesPrivateMemories: binding.shared === true && binding.allowCloning === true && binding.shareMemories === true } : {}),
            ...(binding.avatar ? { avatar: binding.avatar } : {}),
            ...(binding.face ? { face: appearance.publicRef(head) } : {}) }),
          key, ownerPeerId: worldNetwork()?.peerId ?? '', local: true,
          recoveryRequired: !!head.recoveryRequired, shared: binding.shared,
          instructions: head.identity.instructions, goals: head.goals, localOnly: head.policy.inferenceMode === 'local-only',
          allowCloning: !!binding.allowCloning, shareMemories: !!binding.shareMemories, sharePrivateMemories: !!binding.sharePrivateMemories, ...(binding.movement ? { movement: binding.movement } : {}),
          respondToWorldChat: !!binding.respondToWorldChat, initiateConversations: !!binding.initiateConversations,
          selfModifiable: !!binding.selfModifiable,
          profileStatus: binding.selfModifiable ? profileStates.get(key) : 'disabled',
          ...(binding.standingGoal ? { standingGoal: binding.standingGoal,
            standingStatus: standingStates.get(key) ?? (binding.standingGoal.enabled ? 'observing' : 'disabled') } : {}),
          socialRevision: head.revision, socialStatus: binding.initiateConversations && binding.shared
            ? socialStates.get(key) ?? 'observing' : '', appearancePrompt: binding.appearancePrompt ?? '',
          appearanceStatus: binding.face ? 'ready' : binding.appearancePrompt ? 'waiting' : '',
          ...appearanceStates.get(head.agentId) });
        } catch (error) { fail(new Error(`Could not restore ${head.identity.name}: ${error.message}`)); }
      }
      for (const [key, body] of bodies) if (body.local && !current.has(key)) {
        await pauseResidentObjective(body.agentId);
        adapter.remove(key); bodies.delete(key); socialStates.delete(key); objectiveStates.delete(body.agentId); appearanceStates.delete(body.agentId); await embodimentLease?.release(body.agentId);
      }
      for (const body of bodies.values()) if (body.local && body.status === 'paused') await pauseResidentObjective(body.agentId);
      if (embodimentLease) for (const id of [...embodimentLease.entries.keys()]) {
        if (!current.has(localKey(id))) await embodimentLease.release(id);
      }
      // A former remote owner can remain in the bounded directory TTL during
      // takeover. Only suppress identities this local store currently owns.
      if (embodimentLease) for (const [key, body] of bodies) {
        if (!body.local && current.has(localKey(body.agentId))) { adapter.remove(key); bodies.delete(key); }
      }
      await objectives?.syncOwnership();
      updateList();
  }
  function directory(entries) {
    if (disposed) return;
    const current = new Set();
    for (const entry of entries.slice(0, 48)) {
      if (embodimentLease && bodies.get(localKey(entry.agentId))?.local) continue;
      const key = `${entry.ownerPeerId}:${entry.agentId}`;
      try {
        const pendingKey = JSON.stringify([entry.ownerPeerId, entry.agentId]), pending = pendingPublicCaptions.get(pendingKey);
        pendingPublicCaptions.delete(pendingKey);
        setBody({ ...normalizePublicAgent(entry), key, ownerPeerId: entry.ownerPeerId, local: false,
          ...(pending && pending.expires > Date.now() ? { caption: pending.text } : {}) }); current.add(key);
        if (pending?.message && pending.expires > Date.now()) {
          worldChat?.receive({ ...pending.message, name: worldResidentName(entry.name) });
        }
      }
      catch { /* Wrong-world positions never enter the renderer. */ }
    }
    for (const [key, body] of bodies) if (!body.local && !current.has(key)) { adapter.remove(key); bodies.delete(key); }
    updateList();
  }
  async function respond({ agentId, prompt, requesterPeerId, signal }) {
    privateResponses++;
    try { await Promise.all([interruptSocial('human'), objectives?.interrupt({ agentId, reason: 'human conversation' })]);
      return await respondToVisitor({ agentId, prompt, requesterPeerId, signal }); }
    finally { privateResponses--; social?.sync(); standing?.sync(); worldChat?.sync(); }
  }
  async function respondToVisitor({ agentId, prompt, requesterPeerId, signal }) {
    alive();
    const head = await agents.get(agentId), binding = bindingOf(head);
    if (!binding || (requesterPeerId && !binding.shared)) throw new Error('This agent is not shared in this world');
    const storedBody = bodies.get(localKey(agentId));
    const descriptor = storedBody && liveBody(storedBody);
    if (!descriptor) throw new Error('This agent has no body in this world');
    if (head.recoveryRequired || head.status === 'paused') throw new Error('This agent is paused; its owner must resume it');
    const conversationId = await worldConversationId(worldId, requesterPeerId || 'owner');
    const context = JSON.stringify(adapter.getContext?.(descriptor) ?? { world: worldLabel, position: descriptor.position });
    if (encoder.encode(context).length > 8192) throw new Error('World observations exceed the conversation budget');
    const turn = await experience?.prepare({ key: descriptor.key, agentId, conversationId, audience: 'private',
      requesterPeerId: requesterPeerId || worldNetwork()?.peerId, prompt, scene: JSON.parse(context),
      publicConversationId: await worldConversationId(worldId, 'public-room'), signal });
    const output = await conversations.run({ key: descriptor.key, agentId, turn,
      prompt: turn?.prompt ?? prompt, message: prompt, conversationId, worldContext: turn?.worldContext ?? context,
      taskInstructions: worldKnowledge,
      allowTask: !requesterPeerId && !!objectives,
      allowObject: !requesterPeerId && !!generatedObjects,
      allowAvatar: !requesterPeerId && !!residentAvatars,
      maxNewTokens: 512, signal, valid: current => !disposed && ownsObjective(agentId) && !!bindingOf(current)
        && (!requesterPeerId || bindingOf(current).shared) });
    if (!requesterPeerId && output.applied) await pauseResidentObjective(agentId);
    if (output.avatar) {
      try {
        if (requesterPeerId || disposed || !ownsObjective(agentId)) throw new Error('Only the resident owner can request an avatar change');
        const result = await residentAvatars.generate({ agentId, action: output.avatar.action,
          expectedRevision: output.avatar.residentRevision, requestId: output.avatar.requestId, signal });
        output.text += `\n[Avatar saved: ${result.name}.]`;
        try {
          await memory?.append({ worldId, agentId, audience: 'private', conversationId, kind: 'action-outcome',
            who: { peerId: descriptor.ownerPeerId || agents.store.hostId, agentId, name: descriptor.name },
            where: descriptor.position, outcome: 'Resident avatar saved on the existing body.',
            text: `Avatar: ${result.name}.${result.avatar ? ` CID: ${result.avatar.artifactCid}` : ''}`,
            source: { kind: 'verified-action', eventId: output.avatar.requestId } });
        } catch (error) { output.text += `\n[Avatar saved; memory update failed: ${String(error.message).slice(0, 160)}]`; }
      } catch (error) {
        signal?.throwIfAborted(); output.text += `\n[Avatar update failed: ${String(error.message).replaceAll('\0', '').slice(0, 240)}]`;
      }
      return { text: output.text, finishReason: output.finishReason };
    }
    if (output.object) {
      try {
        if (requesterPeerId || disposed || !ownsObjective(agentId)) throw new Error('Only the resident owner can request object generation');
        const result = await generatedObjects.generate({ agentId, action: output.object.action,
          expectedRevision: output.object.residentRevision, requestId: output.object.requestId, signal });
        const receipt = `Placed ${result.placement.name} beside the resident. Object CID: ${result.artifactCid}.`;
        output.text += `\n[Placed ${result.placement.name} beside the resident.]`;
        try {
          await memory?.append({ worldId, agentId, audience: 'private', conversationId, kind: 'action-outcome',
            who: { peerId: descriptor.ownerPeerId || agents.store.hostId, agentId, name: descriptor.name },
            where: result.placement.position, outcome: 'Generated object saved and displayed in the world.', text: receipt,
            source: { kind: 'verified-action', eventId: output.object.requestId } });
        } catch (error) { output.text += `\n[Object saved; memory update failed: ${String(error.message).slice(0, 160)}]`; }
      } catch (error) {
        signal?.throwIfAborted(); output.text += `\n[Object not placed: ${String(error.message).replaceAll('\0', '').slice(0, 240)}]`;
      }
      return { text: output.text, finishReason: output.finishReason };
    }
    if (output.task) {
      try {
        await admitWorldChatTask({ proposal: output.task, message: prompt, agentId,
          requesterId: `human:${worldNetwork()?.peerId}`, signal,
          isOwner: () => !requesterPeerId && !disposed && ownsObjective(agentId),
          getHead: id => agents.get(id), assign: input => objectives.assign(input) });
      } catch (error) { signal?.throwIfAborted(); output.text += chatTaskFailure(error); }
      return { text: output.text, finishReason: output.finishReason };
    }
    // Only a conversation from this installation's owner can reshape a resident.
    // Speech is already journaled; a separate structured proposal cannot rewrite
    // the spoken history or grant itself tools, sharing, or network permissions.
    if (!requesterPeerId && binding.selfModifiable) {
      try {
        profileStates.set(descriptor.key, 'updating'); await refreshLocal().catch(fail);
        const current = await agents.get(agentId);
        if (!bindingOf(current)?.selfModifiable || current.status === 'paused' || current.recoveryRequired) return output;
        const patch = await proposeWorldSelfProfile({ inference: agents.inference, head: current, worldId,
          message: prompt, reply: output.text, signal });
        signal?.throwIfAborted();
        if (patch) {
          if (disposed || !ownsObjective(agentId)) throw new Error('Resident ownership changed before saving its profile');
          const next = { ...bindingOf(current) }, { appearancePrompt, ...identity } = patch;
          if (appearancePrompt !== undefined) {
            next.appearancePrompt = appearancePrompt;
            if (appearancePrompt !== bindingOf(current).appearancePrompt) { delete next.face; delete next.appearanceRequestId; appearanceStates.delete(agentId); }
          }
          if (next.shared && next.allowCloning) createResidentProfile({ ...current,
            identity: { name: identity.name ?? current.identity.name, instructions: identity.instructions ?? current.identity.instructions },
            goals: identity.goals ?? current.goals, embodiments: [next] }, worldId);
          await agents.update(agentId, { ...identity,
            embodiments: current.embodiments.map(item => item.worldId === worldId ? next : item) },
          { expectedRevision: current.revision, signal });
          profileStates.set(descriptor.key, 'updated');
          const labels = { name: 'name', instructions: 'personality', goals: 'goals', appearancePrompt: 'appearance' };
          output.text += '\n[Profile updated: ' + Object.keys(patch).map(field => labels[field]).join(', ') + '.]';
        } else profileStates.delete(descriptor.key);
      } catch (error) {
        profileStates.set(descriptor.key, 'failed');
        signal?.throwIfAborted();
        output.text += `\n[Profile not updated: ${String(error.message).replaceAll('\0', '').slice(0, 180)}]`;
      } finally { if (!disposed) await refreshLocal().catch(fail); }
    }
    return { text: output.text, finishReason: output.finishReason };
  }
  async function ensureModelNetwork() {
    if (disposed || runtime.networkReady || modelStarting) return modelStarting;
    modelStarting = runtime.connectBackend({ signal: lifetime.signal }).catch((error) => {
      if (!disposed) ui.setStatus(`Model network unavailable: ${error.message}. Local models still work.`);
    }).finally(() => { modelStarting = null; });
    return modelStarting;
  }
  async function ensureNetwork() {
    if (disposed || networkStarting) return networkStarting;
    const manager = worldNetwork(), node = manager?.getLibp2pNode?.() ?? manager?.libp2p;
    const connected = worldManager ? worldManager.isConnected : runtime.networkReady;
    if (network && (!network.node || (network.node === node && connected))) return;
    networkStarting = (async () => {
      if (network) { await network.close(); network = null; directory([]); }
      if (!worldManager) await ensureModelNetwork();
      else if (!worldManager.isConnected) throw new Error('World peer connection is offline');
      lifetime.signal.throwIfAborted();
      const next = serviceFactory({ networkManager: worldNetwork(), worldId,
        listLocalAgents: () => list().filter((body) => body.local && bindingOf(heads.get(body.agentId))?.shared)
          .map(normalizePublicAgent), respond, onDirectory: directory,
        getAppearance: ({ agentId, signal, sha256 }) => appearance.getLocal(agentId, { signal, sha256, sharedOnly: true }),
        getProfile: async ({ agentId, signal }) => {
          signal?.throwIfAborted(); const head = await agents.get(agentId); signal?.throwIfAborted();
          if (!bodies.get(localKey(agentId))?.local) throw new Error('This node no longer owns the resident body');
          return sharedProfile(head, { signal });
        },
        getProfilePermissions: async ({ agentId, signal }) => {
          // Profile chunks must not rely on a possibly coalesced directory
          // refresh when the owner revokes sharing during a transfer.
          const head = await agents.get(agentId); signal?.throwIfAborted();
          const binding = bindingOf(head), owned = bodies.get(localKey(agentId))?.local === true;
          const cloneable = owned && binding?.shared === true && binding?.allowCloning === true;
          const sharesMemories = cloneable && binding?.shareMemories === true;
          return { cloneable, sharesMemories, sharesPrivateMemories: sharesMemories && binding?.sharePrivateMemories === true };
        } });
      try { await next.start(); lifetime.signal.throwIfAborted(); network = next; }
      catch (error) { await next.close(); throw error; }
      await refreshLocal();
    })().catch((error) => { if (!disposed) ui.setStatus(`World network unavailable: ${error.message}. Local agents still work.`); })
      .finally(() => { networkStarting = null; });
    return networkStarting;
  }
  async function select(key) {
    await ready; alive();
    const descriptor = bodies.get(key);
    if (!descriptor) throw new Error('This agent is no longer in the world');
    if (operation || recording || recordingStart) await cancel();
    selectedKey = key; ui.open(); ui.select(descriptor); adapter.focus?.(key);
    if (descriptor.local) {
      const channel = await worldConversationId(worldId, 'owner');
      const events = [];
      for (let after; ;) {
        const page = await agents.events(descriptor.agentId, { after, limit: 100 }); events.push(...page);
        if (page.length < 100 || events.length >= 300) break;
        after = page.at(-1).sequence;
      }
      transcripts.set(key, events.filter((event) => event.conversationId === channel && ['request', 'result'].includes(event.type))
        .slice(-24).map((event) => ({ role: event.type === 'request' ? 'user' : 'assistant', text: event.type === 'request'
          ? originalWorldPrompt(event.text) : parseWorldReply(event.text).text })));
    }
    showMessages(key);
    // The roster can still contain a coalesced pre-resume snapshot. Chat
    // readiness comes from the current local record, independently of a goal.
    const currentStatus = descriptor.local ? statusOf(await agents.get(descriptor.agentId)) : descriptor.status;
    ui.setStatus(currentStatus === 'paused'
      ? descriptor.local ? 'Paused. Resume to start a new conversation.' : 'Paused. Only its owner can resume this resident.'
      : `Talk to ${descriptor.name}.`);
  }
  async function spawn({ name, goals = [], localOnly = false, shared = true, appearancePrompt = '', respondToWorldChat = false, initiateConversations = false,
    instructions, shareMemories = false, sharePrivateMemories = false, allowCloning = shareMemories, movement = 'stationary', standingGoal, selfModifiable = false }) {
    await ready; alive(); await interruptSocial('owner');
    requireConversationIdle();
    if (list().filter((body) => body.local).length >= WORLD_AGENT_LIMITS.agents) throw new Error('This world already has 16 local agents');
    worldAgentText(name, 240, 'name');
    const position = adapter.normalizePosition(await adapter.getSpawnPosition());
    const head = await agents.create({ name, goals, inferenceMode: localOnly ? 'local-only' : 'network-assisted',
      instructions: instructions ?? `You inhabit a body in ${worldLabel}. Talk directly with the visitor. World observations describe your surroundings. You may propose supported body intentions; the world executes them and reports outcomes. Describe intended actions as intentions, and completed actions only when verified.`,
      embodiments: [{ worldId, position, color: '#8fffd4', shared, appearancePrompt, respondToWorldChat, initiateConversations, allowCloning, shareMemories, sharePrivateMemories, movement, selfModifiable,
        ...(standingGoal ? { standingGoal } : {}) }] });
    await agents.resume(head.agentId); await refreshLocal(); await select(localKey(head.agentId));
    if (appearancePrompt.trim()) void generateAppearance({ key: localKey(head.agentId) }).catch(fail);
    return agents.get(head.agentId);
  }
  async function sharedProfile(head, { signal, ownerCopy = false } = {}) {
    const episodes = memory && bindingOf(head)?.shareMemories ? await memory.snapshot({
      agentId: head.agentId, worldId, includePrivate: bindingOf(head)?.sharePrivateMemories === true,
    }, { signal }) : [];
    const current = await agents.get(head.agentId); signal?.throwIfAborted();
    if (!bodies.get(localKey(head.agentId))?.local) throw new Error('Resident body ownership changed');
    const binding = bindingOf(current);
    if (!binding) throw new Error('Resident body was removed');
    return createResidentProfile(ownerCopy ? { ...current, embodiments: [{ ...binding, shared: true, allowCloning: true }] }
      : current, worldId, { memories: episodes });
  }
  async function edit({ key, name, instructions, goals, appearancePrompt, movement, shared, respondToWorldChat, initiateConversations, allowCloning, shareMemories, sharePrivateMemories, localOnly, standingGoal, selfModifiable }) {
    await ready; alive(); await Promise.all([interruptSocial('owner'), objectives?.interrupt({ reason: 'resident editing' })]); requireConversationIdle();
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can edit this resident; clone it to customize your own');
    const head = await agents.get(body.agentId), binding = bindingOf(head);
    if (!binding) throw new Error('This resident is no longer in this world');
    if (movement === 'follow' && adapter.observe && !adapter.observe(key).participants.some(item => item.kind === 'human' && item.peerId === body.ownerPeerId)) {
      throw new Error('The owner must be nearby before selecting Follow');
    }
    const next = { ...binding };
    for (const [field, value] of Object.entries({ appearancePrompt, movement, shared, respondToWorldChat, initiateConversations, allowCloning, shareMemories, sharePrivateMemories, standingGoal, selfModifiable })) {
      if (value !== undefined) next[field] = value;
    }
    if (appearancePrompt !== undefined && appearancePrompt !== binding.appearancePrompt) {
      delete next.face; delete next.appearanceRequestId; appearanceStates.delete(head.agentId);
    }
    // Detect a profile too large to share before committing the opt-in.
    if (next.shared && next.allowCloning) createResidentProfile({ ...head,
      identity: { name: name ?? head.identity.name, instructions: instructions ?? head.identity.instructions },
      goals: goals ?? head.goals, embodiments: [next] }, worldId);
    const saved = await agents.update(head.agentId, { name, instructions, goals,
      ...(localOnly === undefined ? {} : { inferenceMode: localOnly ? 'local-only' : 'network-assisted' }),
      embodiments: head.embodiments.map(item => item.worldId === worldId ? next : item) }, { expectedRevision: head.revision });
    await refreshLocal();
    if (movement !== undefined) adapter.setMovement?.(key, movement);
    if (selectedKey === key) ui.select(bodies.get(key));
    ui.setStatus('Resident saved. Existing identity and memories are preserved.');
    if (appearancePrompt?.trim() && appearancePrompt !== binding.appearancePrompt) void generateAppearance({ key }).catch(fail);
    return saved;
  }
  async function clone({ key, name }) {
    await ready; alive(); requireConversationIdle();
    const body = bodies.get(key); if (!body) throw new Error('This resident is no longer in the world');
    if (list().filter(item => item.local).length >= WORLD_AGENT_LIMITS.agents) throw new Error('This world already has 16 local agents');
    const created = await runOperation(async signal => {
      let profile;
      if (body.local) {
        const head = await agents.get(body.agentId), binding = bindingOf(head);
        if (!binding) throw new Error('This resident is no longer in the world');
        // Explicit owner cloning does not require publishing the profile.
        profile = await sharedProfile(head, { signal, ownerCopy: true });
      } else {
        if (!body.cloneable) throw new Error('The owner has not enabled cloning for this resident');
        if (!network?.requestProfile) throw new Error('Resident profile sharing is unavailable');
        profile = normalizeResidentProfile(await network.requestProfile(body.ownerPeerId, { agentId: body.agentId }, { signal }), { worldId, includePrivate: body.sharesPrivateMemories === true });
        if (profile.sourceAgentId !== body.agentId) throw new Error('Resident clone identity mismatch');
      }
      let image;
      if (profile.face) {
        image = body.local ? await appearance.getLocal(body.agentId, { signal, sha256: profile.face.sha256 })
          : await appearance.loadRemote({ ...body, face: profile.face }, { network, signal });
        if (!image) throw new Error('Resident appearance changed; retry cloning');
      }
      signal.throwIfAborted();
      const head = await agents.create({ name: name ?? profile.name, instructions: profile.instructions, goals: profile.goals,
        inferenceMode: 'network-assisted', embodiments: [] });
      let clonedAvatar;
      try {
        if (profile.avatar && residentAvatars) clonedAvatar = await residentAvatars.retainClone({ sourceBody: body, avatar: profile.avatar, agentId: head.agentId, signal });
        const inherited = profile.memories ?? [];
        if (inherited.length && !memory) throw new Error('This world cannot save inherited memories');
        // The staged identity stays paused and has no body until the entire
        // selected history is durable. Never advertise a partially copied life.
        if (inherited.length) await memory.inheritSnapshot({ agentId: head.agentId, worldId, episodes: inherited,
          sourceAgentId: profile.sourceAgentId, sourcePeerId: body.ownerPeerId || worldNetwork()?.peerId || agents.store.hostId }, { signal });
        const attachmentId = image ? crypto.randomUUID() : null;
        const binding = { worldId, position: adapter.normalizePosition(await adapter.getSpawnPosition()), color: profile.color,
          shared: true, respondToWorldChat: false, initiateConversations: false, allowCloning: false, movement: 'stationary', appearancePrompt: profile.appearancePrompt,
          ...(clonedAvatar ? { avatar: clonedAvatar } : {}),
          ...(image ? { face: { ...normalizeAgentFace(image), attachmentId } } : {}) };
        await agents.store.withRun(head.agentId, ({ head: current, signal: lockedSignal }) => agents.store.commit(head.agentId, {
          expectedRevision: current.revision, head: { ...current, embodiments: [binding] },
          event: { type: 'cloned-profile', text: `Personality and appearance copied with ${inherited.length} inherited memories.`,
            sourceAgentId: profile.sourceAgentId, ...(attachmentId ? { attachmentIds: [attachmentId] } : {}) },
          attachments: image ? [{ id: attachmentId, width: image.width, height: image.height, channels: 4, data: image.data }] : [],
        }, { signal: lockedSignal }), { signal });
        await agents.resume(head.agentId); await refreshLocal();
        return { ...await agents.get(head.agentId), inheritedMemories: inherited.length };
      } catch (error) {
        try {
          const scopes = new Map((profile.memories ?? []).map(episode => [JSON.stringify([episode.audience, episode.conversationId]),
            { agentId: head.agentId, worldId, audience: episode.audience, conversationId: episode.conversationId }]));
          for (const scope of scopes.values()) await memory?.forget(scope);
          await agents.remove(head.agentId);
          if (clonedAvatar) await residentAvatars.release(clonedAvatar);
        } catch (cleanup) { fail(new Error(`Clone failed; incomplete identity ${head.agentId}: ${cleanup.message}`)); }
        throw error;
      }
    });
    await select(localKey(created.agentId)); ui.setStatus(created.inheritedMemories
      ? `Resident cloned to this node with ${created.inheritedMemories} inherited memories, preserving their public/private channels.`
      : 'Resident cloned to this node with a new identity and fresh memories.');
    return created;
  }
  async function generateAppearance({ key }) {
    await ready; alive(); requireConversationIdle();
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can change this appearance');
    return runOperation(async signal => {
      const result = await appearance.generate(body.agentId, { signal });
      await refreshLocal(); if (!disposed) ui.setStatus(result.message ?? 'Resident appearance saved.');
      return result;
    });
  }
  async function setWorldChat({ key, enabled }) {
    await ready; alive();
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can change world-chat responses');
    if (!enabled) {
      const responding = worldChat?.getStatus().active === key;
      worldChatDisabled.add(key); worldChat?.sync();
      if (responding) await operationDone?.catch(() => {});
    }
    try {
      const head = await agents.get(body.agentId);
      await agents.update(head.agentId, { embodiments: head.embodiments.map(binding => binding.worldId === worldId
        ? { ...binding, respondToWorldChat: !!enabled } : binding) }, { expectedRevision: head.revision });
      await refreshLocal();
    } finally { worldChatDisabled.delete(key); worldChat?.sync(); }
  }
  function receiveWorldMessage(input) {
    if (disposed) return;
    if (input?.agentId) {
      const body = list().find(entry => entry.agentId === input.agentId && entry.ownerPeerId === input.peerId);
      if (body) {
        caption(body.key, input.text);
        return worldChat?.receive({ ...input, name: worldResidentName(body.name) });
      }
      else if (typeof input.text === 'string' && encoder.encode(input.text).length <= 2048) {
        // The first reply can arrive before the next bounded body-directory poll.
        // Keep it only for that authenticated owner and expire it promptly.
        // It cannot trigger inference until the body directory confirms them.
        for (const [key, value] of pendingPublicCaptions) if (value.expires <= Date.now()) pendingPublicCaptions.delete(key);
        const key = JSON.stringify([input.peerId, input.agentId]);
        let message;
        try { message = worldPublicMessage(input); } catch { /* Legacy caption-only event. */ }
        const previous = pendingPublicCaptions.get(key);
        // A replay must not prolong the admission window or replace its text.
        if (message && previous?.message?.id === message.id) return;
        pendingPublicCaptions.delete(key); pendingPublicCaptions.set(key, { text: input.text, message, expires: Date.now() + 15000 });
        while (pendingPublicCaptions.size > 48) pendingPublicCaptions.delete(pendingPublicCaptions.keys().next().value);
      }
      return;
    }
    const received = worldChat?.receive(input);
    if (received?.accepted) { publicEpoch++; void interruptSocial('human'); }
    return received;
  }
  async function replyToWorld(body, incoming, { signal, context, isCurrent = () => true }) {
    if (incoming.social) return socialReply(body, incoming, { signal, context, isCurrent });
    alive(); requireConversationIdle();
    const epoch = publicEpoch;
    return runOperation(async ownedSignal => {
      const combined = AbortSignal.any([ownedSignal, signal]);
      const head = await agents.get(body.agentId), binding = bindingOf(head);
      if (!binding?.respondToWorldChat || !bodies.get(body.key)?.local) throw new Error('World-chat responses are disabled');
      // Check availability without creating a failed persisted agent turn. A room
      // message must not pause an otherwise healthy resident when hosts leave.
      const candidates = await agents.inference.listCandidates({ mode: head.policy.inferenceMode,
        task: 'text-generation', signal: combined, refresh: true });
      combined.throwIfAborted();
      routeAgentTask({ task: 'text-generation', inferenceMode: head.policy.inferenceMode, candidates });
      const currentHead = await agents.get(body.agentId);
      combined.throwIfAborted();
      const ownedBody = bodies.get(body.key);
      if (!ownedBody?.local || !bindingOf(currentHead)?.respondToWorldChat || currentHead.recoveryRequired || currentHead.status === 'paused') {
        throw new Error('World-chat responses are disabled');
      }
      const currentBody = liveBody({ ...ownedBody, name: currentHead.identity.name });
      const observations = worldConversationContext({ world: worldLabel, self: currentBody,
        scene: adapter.getContext?.(currentBody) ?? {}, residents: list(), messages: context.messages, incoming });
      const conversationId = await worldConversationId(worldId, 'public-room');
      const prompt = worldReplyPrompt({ world: worldLabel, self: currentBody, incoming });
      const turn = await experience?.prepare({ key: body.key, agentId: body.agentId, conversationId, audience: 'public',
        requesterPeerId: incoming.peerId, who: { peerId: incoming.peerId, name: incoming.name,
          ...(incoming.agentId ? { agentId: incoming.agentId } : {}) }, eventId: incoming.id,
        prompt, statement: incoming.text, scene: JSON.parse(observations), signal: combined });
      const output = await conversations.run({ key: body.key, agentId: body.agentId, turn, signal: combined,
        conversationId, prompt: turn?.prompt ?? prompt, message: incoming.text,
        worldContext: turn?.worldContext ?? observations, maxNewTokens: 512,
        taskInstructions: worldKnowledge,
        valid: current => !disposed && ownsObjective(body.agentId) && isCurrent() && epoch === publicEpoch
          && bindingOf(current)?.respondToWorldChat && !worldChatDisabled.has(body.key) });
      combined.throwIfAborted();
      const answer = output.text.trim().replaceAll('\0', '');
      if (encoder.encode(answer).length <= 2048) return answer;
      let excerpt = '';
      for (const character of answer) { if (encoder.encode(excerpt + character).length > 2045) break; excerpt += character; }
      return excerpt + '…';
    });
  }
  function interruptSocial(reason = 'human') {
    social?.interrupt(reason); standing?.interrupt(reason);
    socialOperation?.abort(new DOMException('Social decision superseded', 'AbortError'));
    return socialDone?.catch(() => {});
  }
  function runSocial(work, { signal, timeoutMs = 45000, isCurrent } = {}) {
    if (socialOperation || objectivePlanning() || operation || disposed) return Promise.resolve({ status: 'busy' });
    const controller = new AbortController(); socialOperation = controller;
    const timer = setTimeout(() => controller.abort(new DOMException('Social decision deadline exceeded', 'AbortError')), Math.max(1, timeoutMs));
    const watcher = isCurrent ? setInterval(() => {
      try { if (isCurrent()) return; } catch { /* A disappeared body is obsolete too. */ }
      controller.abort(new DOMException('Social encounter is no longer current', 'AbortError'));
    }, 1000) : undefined;
    const combined = AbortSignal.any([controller.signal, lifetime.signal, ...(signal ? [signal] : [])]);
    const pending = Promise.resolve().then(() => { combined.throwIfAborted(); return work(combined); }).finally(() => {
      clearTimeout(timer); clearInterval(watcher);
      if (socialOperation === controller) { socialOperation = null; socialDone = null; worldChat?.sync(); }
    });
    socialDone = pending; return pending;
  }
  function socialAvailable(body, head, initial) {
    const binding = bindingOf(head);
    return !disposed && body?.local && !objectiveActive(body.agentId) && body.shared && !operation && !privateResponses && !panel && !panelOpening && !voicePreparation
      && !recording && !recordingStart && head?.status !== 'paused' && !head?.recoveryRequired
      && !['queued', 'running'].includes(head?.activity?.status)
      && binding?.shared && (initial ? binding.initiateConversations : binding.initiateConversations || binding.respondToWorldChat);
  }
  function standingAvailable(body, head) {
    const binding = bindingOf(head);
    return !!binding?.standingGoal?.enabled && socialAvailable(body,
      { ...head, embodiments: head.embodiments.map(item => item.worldId === worldId ? { ...item, initiateConversations: true } : item) }, true);
  }
  function standingStatus(key, status) {
    const body = bodies.get(key);
    if (disposed || !body?.local) return;
    standingStates.set(key, status); bodies.set(key, { ...body, standingStatus: status }); ui.setAgents(list());
  }
  async function decideStanding({ resident: body, target, signal, isCurrent }) {
    const head = await agents.get(body.agentId), epoch = publicEpoch;
    if (!standingAvailable(bodies.get(body.key), head) || !isCurrent()) return { status: 'cancelled' };
    const goal = bindingOf(head).standingGoal;
    if (target.kind !== 'human' || goal.target === 'owner' && target.peerId !== body.ownerPeerId) return { status: 'cancelled' };
    let candidate;
    try {
      candidate = routeAgentTask({ task: 'text-generation', inferenceMode: head.policy.inferenceMode,
        candidates: await agents.inference.listCandidates({ mode: head.policy.inferenceMode,
          task: 'text-generation', signal: AbortSignal.any([signal, AbortSignal.timeout(standingLimits.discoveryMs)]), refresh: true }) }).candidate;
    } catch (error) {
      if (error.code !== 'ERR_AGENT_NO_MODEL') throw error;
      standingStatus(body.key, 'waiting-for-model'); return { status: 'waiting-for-model' };
    }
    // Session peer IDs rotate on reload. The guide's owner encounter is bound to
    // the private installation ID; other humans are identified only this session.
    const scope = { worldId, agentId: body.agentId, goalId: goal.id,
      targetId: goal.target === 'owner' ? `owner:${agents.store.hostId}` : `human:${target.peerId}` };
    const conversationId = await worldConversationId(worldId, 'public-room');
    let turn;
    const valid = () => !signal.aborted && !disposed && isCurrent() && publicEpoch === epoch
      && heads.get(body.agentId)?.revision === head.revision && standingAvailable(bodies.get(body.key), heads.get(body.agentId))
      && experience.observe(body.key).participants.some(item => item.id === target.id && item.distance <= 60);
    const checkSavedAuthority = async () => {
      const saved = await agents.get(body.agentId);
      signal.throwIfAborted();
      if (!valid() || saved.revision !== head.revision || !ownsObjective(body.agentId)
          || !standingAvailable(bodies.get(body.key), saved)) throw new Error('Standing goal authority changed');
    };
    const result = await standingRunner.run({ scope, signal, isCurrent: valid,
      decide: async ({ signal: decisionSignal, requestId }) => {
        turn = await experience.prepareEncounter({ key: body.key, agentId: body.agentId, conversationId, target, signal: decisionSignal });
        const decision = await generateWorldSocialDecision({ inference: agents.inference, head, candidate, target,
          standingGoal: goal, worldContext: turn.worldContext, worldKnowledge, requestId,
          signal: AbortSignal.any([decisionSignal, AbortSignal.timeout(standingLimits.generationMs)]) });
        await checkSavedAuthority(); return decision;
      },
      publish: async (decision, { signal: sendSignal, requestId }) => {
        await experience.rememberSocialDecision(turn, decision);
        await experience.rememberReply(turn, decision.text, { valid });
        sendSignal.throwIfAborted(); if (!valid()) throw new Error('Standing encounter changed');
        // The welcome never depends on loading motor weights. A model can turn
        // toward its listener; locomotion remains an explicit task/motor action.
        let receipt, turning = false;
        try {
          if (decision.intent?.type === 'look-at') {
            turning = true;
            await experience.applyIntent(turn, decision.intent, { requestId, valid });
          }
          await checkSavedAuthority(); sendSignal.throwIfAborted();
          const startedAt = Date.now();
          receipt = await publishWorldMessage({ agentId: body.agentId, name: worldResidentName(head.identity.name), text: decision.text,
            social: { rootId: requestId, rootPeerId: body.ownerPeerId, rootAgentId: body.agentId,
              targetPeerId: target.peerId, startedAt, expiresAt: startedAt + 60000, turn: 0 } }, { signal: sendSignal });
        } catch (error) {
          if (turning) await experience.cancelIntent(body.key, requestId);
          throw error;
        }
        try { await experience.rememberDelivery({ key: body.key, conversationId, target, text: decision.text, result: receipt, eventId: `${requestId}:0` }); }
        catch { /* Optional episodic observation must not erase an acknowledged send. */ }
        return receipt.delivery;
      } });
    standingStatus(body.key, result.status);
    return result;
  }
  async function decideSocial({ resident: body, target, signal, isCurrent = () => true, incoming, context }) {
    const initial = !incoming, epoch = publicEpoch;
    const head = await agents.get(body.agentId);
    if (!socialAvailable(bodies.get(body.key), head, initial) || !isCurrent()) return { status: 'quiet' };
    let candidate;
    try {
      candidate = routeAgentTask({ task: 'text-generation', inferenceMode: head.policy.inferenceMode,
        candidates: await agents.inference.listCandidates({ mode: head.policy.inferenceMode,
          task: 'text-generation', signal, refresh: true }) }).candidate;
    } catch (error) { if (error.code === 'ERR_AGENT_NO_MODEL') return { status: 'waiting-for-model' }; throw error; }
    signal.throwIfAborted();
    const conversationId = await worldConversationId(worldId, 'public-room');
    const common = { key: body.key, agentId: body.agentId, conversationId, signal };
    const turn = initial ? await experience.prepareEncounter({ ...common, target }) : await experience.prepare({
      ...common, audience: 'public', requesterPeerId: incoming.peerId,
      who: { peerId: incoming.peerId, agentId: incoming.agentId, name: incoming.name }, eventId: incoming.id,
      prompt: 'Consider replying to this public encounter.', statement: incoming.text,
      scene: JSON.parse(worldConversationContext({ world: worldLabel, self: liveBody(body),
        residents: list(), messages: context?.messages ?? [], incoming })) });
    const decision = await generateWorldSocialDecision({ inference: agents.inference, head, candidate,
      target, incoming, worldContext: turn.worldContext, worldKnowledge, signal });
    const after = await agents.get(body.agentId);
    const valid = () => !signal.aborted && isCurrent() && epoch === publicEpoch && after.revision === head.revision
      && socialAvailable(bodies.get(body.key), after, initial)
      && experience.observe(body.key).participants.some(participant => participant.id === target.id
        && (participant.distance ?? Math.hypot(...participant.position.map((v, i) => v - turn.senses.self.position[i]))) <= 60);
    signal.throwIfAborted(); if (!valid()) return { status: 'quiet' };
    await experience.rememberSocialDecision(turn, decision);
    if (decision.decision === 'quiet') return { status: 'quiet' };
    const output = await experience.finish(turn, JSON.stringify({ text: decision.text, intent: decision.intent }), { valid });
    signal.throwIfAborted(); if (!valid()) return { status: 'quiet' };
    if (!initial) return { status: 'spoken', text: output.text };
    const startedAt = Date.now();
    const metadata = { rootId: crypto.randomUUID(), rootPeerId: body.ownerPeerId, rootAgentId: body.agentId,
      targetPeerId: target.peerId || target.ownerPeerId, ...(target.agentId ? { targetAgentId: target.agentId } : {}),
      startedAt, expiresAt: startedAt + 60000, turn: 0 };
    const receipt = await publishWorldMessage({ agentId: body.agentId, name: worldResidentName(head.identity.name),
      text: output.text, social: metadata }, { signal });
    await experience.rememberDelivery({ key: body.key, conversationId, target, text: output.text, result: receipt,
      eventId: `${metadata.rootId}:0` });
    return { status: 'spoken', text: output.text };
  }
  async function socialReply(body, incoming, { signal, context, isCurrent }) {
    if (!experience) return '';
    const target = experience.observe(body.key).participants.find(item => item.id === `resident:${incoming.peerId}:${incoming.agentId}`);
    if (!target) return '';
    const result = await runSocial(combined => decideSocial({ resident: body, target, signal: combined, incoming, context, isCurrent }),
      { signal, timeoutMs: Math.min(45000, incoming.social.expiresAt - Date.now()),
        isCurrent: () => isCurrent() && experience.observe(body.key).participants.some(item => item.id === target.id && item.distance < 60) });
    return result?.text ?? '';
  }
  async function remove(key) {
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can remove this body');
    await cancel(); await agents.cancel(body.agentId);
    const head = await agents.get(body.agentId);
    await agents.update(head.agentId, { embodiments: (head.embodiments ?? []).filter((binding) => binding.worldId !== worldId) }, { expectedRevision: head.revision });
    if (selectedKey === key) { selectedKey = null; ui.select(null); ui.setMessages([]); }
    await refreshLocal();
    if (bindingOf(head)?.avatar) await residentAvatars?.release(bindingOf(head).avatar);
    ui.setStatus('Body removed. Agent identity and memory are still saved.');
  }
  async function resume(key) {
    await ready; alive(); requireConversationIdle();
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can resume this agent');
    await agents.resume(body.agentId); await refreshLocal(); await select(key);
    ui.setStatus(`${body.name} is ready for a new message. No previous request was replayed.`);
  }
  async function converse({ key, text, voiceReply, signal }) {
    signal.throwIfAborted();
    if (typeof text !== 'string' || !text.trim() || encoder.encode(text).length > WORLD_AGENT_LIMITS.promptBytes) throw new Error('Enter a message within 16 KiB');
    const body = bodies.get(key); if (!body) throw new Error('Choose an agent in this world');
    message(key, 'user', text); ui.setStatus(`${body.name} is thinking…`);
    const result = body.local ? await respond({ agentId: body.agentId, prompt: text, signal })
      : await network?.request(body.ownerPeerId, { agentId: body.agentId, prompt: text }, { signal });
    signal.throwIfAborted(); if (!result) throw new Error('The agent owner is not connected');
    message(key, 'assistant', result.text); caption(key, result.text);
    ui.setStatus(result.finishReason === 'length' ? 'Reply reached the output limit. Ask the agent to continue.' : 'Ready.');
    if (voiceReply && voiceEnabled) {
      if (!refreshVoiceAvailability()) ui.setStatus(`Text reply received. ${voiceUnavailable}`);
      else {
        try {
          caption(key, result.text, 'speaking');
          for (const chunk of speechChunks(result.text)) {
            signal.throwIfAborted(); const pcm = await speech.synthesize(chunk, { signal });
            await audio.play(pcm, { key, signal });
          }
        } catch (error) {
          signal.throwIfAborted(); refreshVoiceAvailability();
          ui.setStatus(`Text reply received. Voice: ${error.message}${voiceEnabled ? '' : ` ${voiceUnavailable}`}`);
        }
        finally { caption(key, result.text); }
      }
    }
    return result;
  }
  function runOperation(work) {
    if (operation) throw new Error('Wait for the current conversation or cancel it');
    const controller = new AbortController(); operation = controller;
    const signal = AbortSignal.any([controller.signal, lifetime.signal]); ui.setBusy(true);
    // One owner covers capture completion, transcription, reply and playback.
    // Stop must never replace the controller of an existing typed request.
    const preempted = Promise.all([interruptSocial('human'), objectives?.interrupt({ reason: 'human conversation' })]);
    const pending = Promise.resolve(preempted).then(() => { signal.throwIfAborted(); return work(signal); })
      .catch((error) => { fail(error); throw error; })
      .finally(() => {
        if (operation === controller) { operation = null; operationDone = null; if (!disposed) { ui.setBusy(false); worldChat?.sync(); } }
      });
    operationDone = pending; return pending;
  }
  async function send({ key = selectedKey, text, voiceReply = false }) {
    await ready; alive(); requireConversationIdle();
    return runOperation((signal) => converse({ key, text, voiceReply, signal }));
  }
  async function cancel() {
    const socialCancelled = interruptSocial('human');
    const goalsInterrupted = objectives?.interrupt({ reason: 'human controls' });
    const pendingActions = conversations?.cancelPending();
    operation?.abort(new DOMException('Conversation cancelled', 'AbortError'));
    voicePreparation?.abort(new DOMException('Voice preparation cancelled', 'AbortError'));
    recordingStart?.controller.abort(new DOMException('Recording cancelled', 'AbortError'));
    await audio?.cancelRecording(); recording = false; audio?.stopPlayback();
    await recordingStart?.promise.catch(() => {});
    await voicePreparationDone?.catch(() => {});
    await operationDone?.catch(() => {});
    await socialCancelled;
    await goalsInterrupted;
    await pendingActions;
    if (!disposed) ui.setVoiceStatus({ enabled: voiceEnabled, recording, preparing: !!voicePreparation });
  }
  async function enableVoice(enabled) {
    await ready; alive();
    await Promise.all([interruptSocial('human'), objectives?.interrupt({ reason: 'voice controls' })]);
    if (!enabled) { voiceEnabled = false; await cancel(); await speech?.dispose(); speech = null; ui.setVoiceStatus({ enabled: false, recording: false, preparing: false }); return; }
    if (voicePreparation) return voicePreparationDone;
    const controller = new AbortController(); voicePreparation = controller;
    const signal = AbortSignal.any([controller.signal, lifetime.signal]);
    ui.setVoiceStatus({ enabled: false, recording: false, preparing: true });
    const pending = (async () => {
      try {
        signal.throwIfAborted(); audio ??= await audioFactory({ getAudioPose: (key) => adapter.getAudioPose(key) });
        signal.throwIfAborted(); await audio.unlock(); signal.throwIfAborted();
        speech ??= await speechFactory({ runtime, runtimeAssets: runtime.runtimeAssets }); signal.throwIfAborted();
        await speech.prepare({ signal,
          onProgress: (event) => { if (!disposed) ui.setStatus(`Preparing voice: ${event.modelId ?? ''} ${event.file ?? event.status ?? ''}`); } });
        signal.throwIfAborted(); voiceEnabled = true; ui.setStatus('Voice ready. Talk records up to 20 seconds; press Stop to send.');
      } finally { voicePreparation = null; voicePreparationDone = null; if (!disposed) ui.setVoiceStatus({ enabled: voiceEnabled, recording, preparing: false }); }
    })(); voicePreparationDone = pending; return pending;
  }
  async function record({ key = selectedKey, recording: start, voiceReply = true }) {
    alive();
    if (!voiceEnabled || !bodies.has(key)) throw new Error('Choose an agent and enable voice first');
    if (start) {
      await interruptSocial('human');
      requireConversationIdle();
      if (!refreshVoiceAvailability()) throw new Error(voiceUnavailable);
      if (recording || recordingStart) throw new Error('Microphone is already starting or recording');
      const entry = { controller: new AbortController() }; recordingStart = entry;
      const signal = AbortSignal.any([entry.controller.signal, lifetime.signal]);
      entry.promise = (async () => {
        await audio.unlock(); signal.throwIfAborted();
        await audio.startRecording({ signal, onLimit: () => { void record({ key, recording: false, voiceReply }).catch(fail); } });
        signal.throwIfAborted(); recording = true;
        ui.setVoiceStatus({ enabled: true, recording: true, preparing: false }); ui.setStatus('Listening… press Stop to send.');
      })();
      try { await entry.promise; } finally { if (recordingStart === entry) recordingStart = null; }
    } else {
      if (recordingStart) {
        recordingStart.controller.abort(new DOMException('Recording cancelled', 'AbortError'));
        await audio.cancelRecording(); await recordingStart?.promise.catch(() => {});
        ui.setVoiceStatus({ enabled: voiceEnabled, recording: false, preparing: false });
        ui.setStatus('Recording cancelled.'); return;
      }
      if (!recording) return;
      if (operation) throw new Error('Wait for the current conversation or cancel it');
      recording = false; ui.setVoiceStatus({ enabled: true, recording: false, preparing: false });
      ui.setStatus('Transcribing…');
      return runOperation(async (signal) => {
        const input = await audio.stopRecording();
        signal.throwIfAborted();
        if (!refreshVoiceAvailability()) throw new Error(voiceUnavailable);
        const result = await speech.transcribe(input, { signal });
        signal.throwIfAborted();
        if (!result.text?.trim()) throw new Error('No speech recognized. Try again or type a message.');
        return converse({ key, text: result.text, voiceReply, signal });
      });
    }
  }
  async function closePanel() {
    if (panelClosing) return panelClosing;
    panelClosing = (async () => {
      await panelOpening;
      await panel?.dispose(); panel = null; panelShell?.remove(); panelShell = null;
      if (!disposed) {
        refreshVoiceAvailability();
        worldChat?.sync();
        if (panelReturnFocus?.isConnected && panelReturnFocus.getClientRects().length
            && !panelReturnFocus.closest('[inert]')) panelReturnFocus.focus({ preventScroll: true });
      }
    })();
    try { await panelClosing; } finally { panelClosing = null; }
  }
  async function models() {
    await ready; alive(); if (panel || panelOpening) return;
    await Promise.all([interruptSocial('owner'), objectives?.interrupt({ reason: 'model controls' })]);
    requireConversationIdle();
    if (voicePreparation) throw new Error('Wait for voice preparation or cancel it before opening Models');
    beforeOpen?.();
    panelReturnFocus = getModelReturnFocus();
    panelOpening = (async () => {
      panelShell = document.createElement(panelOwnsWindow ? 'div' : 'dialog');
      panelShell.className = panelOwnsWindow ? 'world-agent-model-host' : 'world-agent-models';
      const content = document.createElement('div');
      if (!panelOwnsWindow) {
        const close = document.createElement('button'); close.textContent = 'Back to world'; close.type = 'button';
        panelShell.append(close); close.onclick = () => { void closePanel().catch(fail); };
        panelShell.addEventListener('cancel', (event) => { event.preventDefault(); void closePanel().catch(fail); });
      }
      panelShell.append(content); document.body.append(panelShell);
      if (!panelOwnsWindow) panelShell.showModal();
      // The panel borrows the scene's runtime. Closing it cancels panel work but
      // does not unload the agent's reasoning or speech services.
      const borrowed = new Proxy(runtime, { get(target, key) { return key === 'dispose' ? async () => {} : Reflect.get(target, key); } });
      try { panel = await panelFactory({ container: content, runtimeFactory: async () => borrowed, autoConnect: false,
        ...(panelOwnsWindow ? { onRequestClose: closePanel } : {}) }); }
      catch (error) { panelShell.remove(); panelShell = null; throw error; }
    })().finally(() => { panelOpening = null; });
    return panelOpening;
  }
  ui = uiFactory({ worldLabel, onOpen: beforeOpen, onSpawn: spawn, onSelect: select, onSend: send, onModels: models,
    onVoice: enableVoice, onRecord: record, onCancel: cancel, onClose: cancel, onRemove: remove, onResume: resume,
    onAppearance: generateAppearance, onWorldChat: setWorldChat, onEdit: edit, onClone: clone,
    onAssignGoal: assignGoal, onPauseGoal: pauseGoal, onResumeGoal: resumeGoal, onCancelGoal: cancelGoal });
  const ready = (async () => {
    const options = await getRuntimeOptions(); worldManager = options.networkManager;
    // World conversations use the room's identity; model discovery uses the
    // global model network so hosts in the standalone console remain eligible.
    runtime = await runtimeFactory({ ...options, networkManager: undefined, residentModelSlots: 3,
      telemetryApplication: worldManager?.config?.gameId ?? 'world',
      auxiliaryWorkerSlots: adapter.setMotor ? 1 : 0 });
    lifetime.signal.throwIfAborted(); agents = await runtime.getAgentController();
    appearance = createWorldAppearance({ runtime, agents, worldId, onStatus: event => {
      if (disposed) return;
      appearanceStates.set(event.agentId, { appearanceStatus: event.status === 'unavailable' ? 'waiting' : event.status,
        appearanceError: ['error', 'unavailable'].includes(event.status) ? event.message : '' });
      void refreshLocal().catch(fail);
    } });
    if (adapter.observe && adapter.setIntent && adapter.subscribeOutcomes) {
      if (runtime.computeManager) { motor = createResidentMotorService({ computeManager: runtime.computeManager }); adapter.setMotor?.(motor); }
      if (runtime.stateManager?.createWorldMemoryStore) {
        const name = `${agents.store?.name ?? 'world-agents'}-episodes`.slice(0, 80);
        memory = runtime.stateManager.getWorldMemoryStore(name) ?? runtime.stateManager.createWorldMemoryStore({ name });
        await memory.open();
      }
      experience = createWorldExperience({ worldId, adapter, memory, getBody: key => bodies.get(key),
        onStatus: text => { if (!disposed) ui.setStatus(text); } });
    }
    conversations = createWorldConversationTurns({ agents, experience, signal: lifetime.signal });
    appearancePresenter = createWorldAppearancePresenter({ appearance, adapter, getNetwork: () => network });
    if (residentAvatarAdapter) residentAvatars = createWorldResidentAvatars({ runtime, agents, adapter: residentAvatarAdapter,
      worldId, ownerHostId: agents.store.hostId, isOwner: ownsObjective, onSaved: refreshLocal,
      onStatus: event => { if (!disposed) ui.setStatus(event.message); } });
    if (generatedObjectAdapter) {
      generatedObjects = createWorldGeneratedObjects({ runtime, agents, adapter: generatedObjectAdapter, worldId,
        ownerHostId: agents.store.hostId, getNetwork: worldNetwork, isOwner: ownsObjective,
        onStatus: event => { if (!disposed) ui.setStatus(event.message); } });
      await generatedObjects.ready;
    }
    if (typeof publishWorldMessage === 'function') worldChat = createWorldChatResponder({
      getResidents: () => list().map(body => ({ ...body,
        respondToWorldChat: body.respondToWorldChat && !worldChatDisabled.has(body.key),
        available: !['thinking', 'speaking'].includes(body.status) && !operation && !socialOperation && !privateResponses && !panel && !panelOpening
          && !voicePreparation && !recording && !recordingStart && !disposed })),
      respond: replyToWorld, publish: publishWorldMessage,
      onDelivered: async ({ body, incoming, output, result }) => {
        if (!incoming.social || !experience) return;
        await experience.rememberDelivery({ key: body.key, conversationId: await worldConversationId(worldId, 'public-room'),
          target: { peerId: incoming.peerId, agentId: incoming.agentId, name: incoming.name }, text: output.text, result,
          eventId: `${incoming.social.rootId}:${incoming.social.turn + 1}` });
      },
      onStatus: event => { if (!disposed && event.status === 'error') ui.setStatus(`World chat: ${event.error}`); },
    });
    if (exclusiveEmbodiments) {
      embodimentLease = new WorldEmbodimentLease({ namespace: agents.store?.lockName ?? options.storeName ?? 'inference-models-agents', worldId });
      if (!embodimentLease.supported) ui.setStatus('Cross-tab body ownership is unavailable in this browser. Keep one window open for this world.');
    }
    if (defaultResident) {
      const records = await agents.list();
      if (records.filter(head => bindingOf(head)).length < WORLD_AGENT_LIMITS.agents) {
        const preset = defaultResident;
        const position = adapter.normalizePosition(await adapter.getSpawnPosition());
        const provisioned = await agents.ensureDefault(preset.key, {
          name: preset.name, instructions: preset.instructions, goals: preset.goals,
          inferenceMode: preset.localOnly ? 'local-only' : 'network-assisted',
          embodiments: [{ worldId, position, color: '#8fffd4', shared: preset.shared,
            movement: preset.movement, standingGoal: preset.standingGoal, selfModifiable: preset.selfModifiable,
            respondToWorldChat: preset.respondToWorldChat, initiateConversations: preset.initiateConversations,
            allowCloning: preset.allowCloning, shareMemories: preset.shareMemories, sharePrivateMemories: preset.sharePrivateMemories }],
        }, { signal: lifetime.signal });
        if (provisioned.created) await agents.resume(provisioned.head.agentId, { signal: lifetime.signal });
      }
    }
    unsubscribe = agents.subscribe((event) => { if (['changed', 'removed', 'activity'].includes(event.type)) void refreshLocal().catch(fail); });
    await refreshLocal(); lifetime.signal.throwIfAborted();
    if (experience && runtime.stateManager?.createWorldGoalStore) {
      const name = `${agents.store.name}-objectives`.slice(0, 80);
      objectiveStore = runtime.stateManager.getWorldGoalStore(name) ?? runtime.stateManager.createWorldGoalStore({ name, hostId: agents.store.hostId });
      await objectiveStore.open(); lifetime.signal.throwIfAborted();
      objectives = createWorldGoalController({ ...goalOptions, store: objectiveStore, worldId,
        owns: ({ agentId }) => ownsObjective(agentId),
        observe: async ({ agentId }, { goal, signal }) => {
          const key = localKey(agentId), head = await agents.get(agentId);
          signal.throwIfAborted();
          if (!ownsObjective(agentId) || !head || !bindingOf(head) || head.status === 'paused' || head.recoveryRequired
              || head.activity?.unsaved) throw new Error('The objective has no available locally owned body');
          const observed = experience.observe(key, worldNetwork()?.peerId);
          if (observed.participants.some(participant => participant.id === goal.requesterId)) observed.requesterId = goal.requesterId;
          else delete observed.requesterId;
          return { ...observed, residentRevision: head.revision };
        },
        canRun: async ({ agentId }) => {
          const body = bodies.get(localKey(agentId));
          if (disposed || !body?.local || body.status === 'paused' || operation || socialOperation || privateResponses
              || panel || panelOpening || voicePreparation || recording || recordingStart
              || worldChat?.getStatus().active || worldChat?.getStatus().pending) return false;
          const head = await agents.get(agentId);
          return !!bindingOf(head) && head.status !== 'paused' && !head.recoveryRequired
            && !['queued', 'running', 'cancelling'].includes(head.activity?.status);
        },
        decide: async ({ agentId }, { goal, observed, signal }) => {
          const head = await agents.get(agentId);
          if (head.revision !== observed.residentRevision) throw new Error('Resident settings changed; observe again');
          objectiveDecisions.set(goal.goalId, head.revision);
          return generateWorldGoalDecision({ inference: agents.inference, head, goal, observed,
            signal: AbortSignal.any([signal, lifetime.signal]) });
        },
        dispatch: async ({ agentId }, { goalId, requestId, intent, observed, authorizedPositions }, { signal }) => {
          const conversationId = await worldConversationId(worldId, `objective:${goalId}`);
          const key = localKey(agentId), body = bodies.get(key), head = await agents.get(agentId);
          if (!ownsObjective(agentId) || !bindingOf(head) || head.status === 'paused' || head.recoveryRequired
              || head.revision !== observed.residentRevision || head.revision !== objectiveDecisions.get(goalId)) {
            throw new Error('Resident authority or settings changed before the objective action');
          }
          const turn = { key, scope: { worldId, agentId, audience: 'private', conversationId }, senses: observed,
            speaker: { peerId: body.ownerPeerId, name: 'Owner' }, signal: AbortSignal.any([signal, lifetime.signal]) };
          try { return await experience.applyIntent(turn, intent, { requestId, authorizedPositions, valid: () => !disposed && ownsObjective(agentId)
            && !operation && !privateResponses }); }
          finally { objectiveDecisions.delete(goalId); }
        },
        stop: ({ agentId }, { requestId }) => experience.cancelIntent(localKey(agentId), requestId),
        onChange: presentObjective,
      });
      unsubscribeObjectives = experience.subscribeVerifiedOutcomes(receipt => objectives.receiveReceipt({ agentId: receipt.agentId }, receipt));
      await objectives.ready;
    }
    if (worldChat && experience) social = createWorldSocialInitiative({ ...socialOptions,
      getResidents: () => list().map(body => ({ ...body, revision: body.socialRevision,
        initiateConversations: body.initiateConversations && !body.standingGoal?.enabled,
        paused: body.status === 'paused', recovery: body.recoveryRequired,
        available: !operation && !socialOperation && !objectivePlanning() && !objectiveActive(body.agentId) && !privateResponses && !['thinking', 'speaking'].includes(body.status)
          && !worldChat.getStatus().active && !worldChat.getStatus().pending
          && !panel && !panelOpening && !voicePreparation && !recording && !recordingStart && !disposed })),
      observe: body => experience.observe(body.key),
      decide: options => runSocial(signal => decideSocial({ ...options, signal }), { signal: options.signal }),
      onStatus: event => {
        const key = event.key ?? event.resident?.key;
        const body = bodies.get(key); if (!body?.initiateConversations || !body.shared || disposed) return;
        const status = ({ deciding: 'considering', quiet: 'resting', spoken: 'resting', cancelled: 'resting', error: 'resting' })[event.status] ?? event.status;
        socialStates.set(key, status); bodies.set(key, { ...body, socialStatus: status }); ui.setAgents(list());
      } });
    if (worldChat && experience && runtime.stateManager?.createWorldStandingGoalStore) {
      const name = `${agents.store.name}-standing-goals`.slice(0, 80);
      standingStore = runtime.stateManager.getWorldStandingGoalStore(name) ?? runtime.stateManager.createWorldStandingGoalStore({ name });
      await standingStore.open(); lifetime.signal.throwIfAborted();
      standingRunner = createWorldStandingGoalRunner({ store: standingStore });
      // Discovery can spend tens of seconds recovering encrypted peer streams.
      // It must not consume the model's separate generation allowance.
      standing = createWorldSocialInitiative({ decisionMs: standingLimits.decisionMs, targetCooldownMs: 90000, ...socialOptions,
        getResidents: () => list().map(body => ({ ...body, revision: body.socialRevision,
          initiateConversations: !!body.standingGoal?.enabled, paused: body.status === 'paused', recovery: body.recoveryRequired,
          available: !operation && !socialOperation && !objectivePlanning() && !objectiveActive(body.agentId) && !privateResponses
            && !['thinking', 'speaking'].includes(body.status) && !worldChat.getStatus().active && !worldChat.getStatus().pending
            && !panel && !panelOpening && !voicePreparation && !recording && !recordingStart && !disposed })),
        observe: body => {
          const observed = experience.observe(body.key);
          return { ...observed, participants: observed.participants.filter(item => item.kind === 'human'
            && (body.standingGoal?.target !== 'owner' || item.peerId === body.ownerPeerId)) };
        },
        decide: options => runSocial(signal => decideStanding({ ...options, signal }),
          { signal: options.signal, timeoutMs: standingLimits.decisionMs }),
        onStatus: event => {
          const key = event.key ?? event.resident?.key;
          if (['deciding', 'waiting-for-model', 'error'].includes(event.status)) standingStatus(key,
            { deciding: 'considering', error: 'failed' }[event.status] ?? event.status);
        } });
    }
    social?.sync(); standing?.sync();
    void ensureModelNetwork(); void ensureNetwork();
    networkTimer = setInterval(() => {
      void ensureModelNetwork(); void ensureNetwork();
      void generatedObjects?.syncNetwork();
      if (embodimentLease) void refreshLocal().catch(fail);
      else updateList();
    }, 5000);
    if (ui.setNavigationStatus && adapter.getResidentMotorStatus) navigationTimer = setInterval(refreshNavigation, 500);
  })();
  ready.catch(fail);
  return {
    ready,
    open() { ui.open(); },
    openConversation(key) { return select(key).catch(fail); },
    getStatus: () => ({ worldId, bodies: list(), selectedKey, voiceEnabled, recording, disposed, network: !!network,
      experience: experience?.getStatus(), motor: motor?.getStatus(), social: social?.getStatus(), standing: standing?.getStatus(), objectives: objectives?.getStatus(),
      generatedObjects: generatedObjects?.getStatus(), residentAvatars: residentAvatars?.getStatus(),
      exclusiveEmbodiments: !!embodimentLease, crossTabOwnership: embodimentLease?.supported ?? null }),
    // The scene owns these operations; exposed for embedding and acceptance
    // checks without invoking GPU work through a hidden global test harness.
    spawn, edit, clone, send, remove, resume, enableVoice, cancel, generateAppearance, setWorldChat, receiveWorldMessage,
    assignGoal, pauseGoal, resumeGoal, cancelGoal, getObjective,
    get residentAvatars() { return residentAvatars; },
    get generatedObjects() { return generatedObjects; },
    get runtime() { return runtime; },
    async dispose() {
      if (closing) return closing;
      disposed = true; lifetime.abort(new DOMException('World closed', 'AbortError')); clearInterval(networkTimer); clearInterval(navigationTimer); unsubscribe?.();
      closing = (async () => {
        await ready.catch(() => {}); await cancel(); await networkStarting; await modelStarting; await closePanel();
        await objectives?.dispose(); unsubscribeObjectives?.();
        await social?.dispose(); await standing?.dispose(); await standingRunner?.dispose(); await worldChat?.dispose();
        await residentAvatars?.dispose();
        await generatedObjects?.dispose(); if (!generatedObjects) generatedObjectAdapter?.dispose();
        await appearancePresenter?.dispose(); await appearance?.dispose();
        await network?.close(); network = null;
        await conversations?.dispose();
        adapter.setMotor?.(null); await experience?.dispose(); await motor?.dispose();
        await speech?.dispose(); await audio?.dispose(); await runtime?.dispose();
        await refreshing; await adapter.dispose(); await embodimentLease?.close();
        ui.dispose(); bodies.clear(); heads.clear(); transcripts.clear(); pendingPublicCaptions.clear(); objectiveStates.clear(); objectiveDecisions.clear();
      })();
      try { await closing; } finally { closing = null; }
    },
  };
}
