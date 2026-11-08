import { createWorldAgentUi } from './worldAgentUi.js';
import { AgentConversationService } from '../../../peercompute/src/peercompute/agents/AgentConversationService.js';
import { normalizePublicAgent, WORLD_AGENT_LIMITS, worldAgentText } from '../../../peercompute/src/peercompute/agents/WorldAgentContracts.js';
import { speechChunks } from '../../../peercompute/src/peercompute/inference/speech/chunks.js';
import { WorldEmbodimentLease } from './WorldEmbodimentLease.js';
export { speechChunks } from '../../../peercompute/src/peercompute/inference/speech/chunks.js';

const encoder = new TextEncoder();
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
  exclusiveEmbodiments = false,
  runtimeFactory = defaultRuntime, speechFactory = defaultSpeech, audioFactory = defaultAudio,
  uiFactory = createWorldAgentUi, serviceFactory = (options) => new AgentConversationService(options),
  panelFactory = async (options) => (await import('../../inference/src/agentPanel.js')).mountInferencePanel(options) } = {}) {
  worldAgentText(worldId, 240, 'world');
  if (!adapter?.upsert || !adapter?.normalizePosition || !adapter?.dispose) throw new Error('A world agent body adapter is required');
  const lifetime = new AbortController(), bodies = new Map(), heads = new Map(), transcripts = new Map();
  let runtime, agents, network, worldManager, speech, audio, ui, selectedKey, disposed = false, closing, unsubscribe;
  let refreshing, networkStarting, modelStarting, networkTimer, panel, panelOpening, panelShell, embodimentLease;
  let operation, operationDone, voicePreparation, voicePreparationDone, recordingStart, voiceEnabled = false, recording = false;
  const localKey = (id) => `local:${id}`;
  const bindingOf = (head) => head.embodiments?.find((binding) => binding.worldId === worldId);
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
  function liveBody(body) {
    const position = body.local ? adapter.getPosition?.(body.key) : null;
    return position ? { ...body, position: adapter.normalizePosition(position) } : body;
  }
  const list = () => [...bodies.values()].map(liveBody);
  const updateList = () => { if (!disposed) ui.setAgents(list()); };
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
  async function refreshLocal() {
    if (refreshing) return refreshing;
    refreshing = (async () => {
      const records = await agents.list();
      if (disposed) return;
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
            position: binding.position, color: binding.color, status: statusOf(head) }),
          key, ownerPeerId: worldNetwork()?.peerId ?? '', local: true,
          recoveryRequired: !!head.recoveryRequired, shared: binding.shared });
        } catch (error) { fail(new Error(`Could not restore ${head.identity.name}: ${error.message}`)); }
      }
      for (const [key, body] of bodies) if (body.local && !current.has(key)) {
        adapter.remove(key); bodies.delete(key); await embodimentLease?.release(body.agentId);
      }
      if (embodimentLease) for (const id of [...embodimentLease.entries.keys()]) {
        if (!current.has(localKey(id))) await embodimentLease.release(id);
      }
      // A former remote owner can remain in the bounded directory TTL during
      // takeover. Only suppress identities this local store currently owns.
      if (embodimentLease) for (const [key, body] of bodies) {
        if (!body.local && current.has(localKey(body.agentId))) { adapter.remove(key); bodies.delete(key); }
      }
      updateList();
    })().finally(() => { refreshing = null; });
    return refreshing;
  }
  function directory(entries) {
    if (disposed) return;
    const current = new Set();
    for (const entry of entries.slice(0, 48)) {
      if (embodimentLease && bodies.get(localKey(entry.agentId))?.local) continue;
      const key = `${entry.ownerPeerId}:${entry.agentId}`;
      try { setBody({ ...normalizePublicAgent(entry), key, ownerPeerId: entry.ownerPeerId, local: false }); current.add(key); }
      catch { /* Wrong-world positions never enter the renderer. */ }
    }
    for (const [key, body] of bodies) if (!body.local && !current.has(key)) { adapter.remove(key); bodies.delete(key); }
    updateList();
  }
  async function respond({ agentId, prompt, requesterPeerId, signal }) {
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
    const result = await agents.run(agentId, { prompt, conversationId, worldContext: context,
      maxNewTokens: 512, task: 'text-generation', signal });
    return { text: result.result.text, finishReason: result.result.finishReason ?? 'stop' };
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
          .map(normalizePublicAgent), respond, onDirectory: directory });
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
        .slice(-24).map((event) => ({ role: event.type === 'request' ? 'user' : 'assistant', text: event.text })));
    }
    showMessages(key);
    ui.setStatus(descriptor.status === 'paused' ? 'Paused. Resume to start a new conversation.' : `Talk to ${descriptor.name}.`);
  }
  async function spawn({ name, goals = [], localOnly = false, shared = true }) {
    await ready; alive();
    requireConversationIdle();
    if (list().filter((body) => body.local).length >= WORLD_AGENT_LIMITS.agents) throw new Error('This world already has 16 local agents');
    worldAgentText(name, 240, 'name');
    const position = adapter.normalizePosition(await adapter.getSpawnPosition());
    const head = await agents.create({ name, goals, inferenceMode: localOnly ? 'local-only' : 'network-assisted',
      instructions: `You inhabit a body in ${worldLabel}. Talk directly with the visitor. World observations describe your surroundings. Do not claim to move or act when no action was executed.`,
      embodiments: [{ worldId, position, color: '#8fffd4', shared }] });
    await agents.resume(head.agentId); await refreshLocal(); await select(localKey(head.agentId));
  }
  async function remove(key) {
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can remove this body');
    await cancel(); await agents.cancel(body.agentId);
    const head = await agents.get(body.agentId);
    await agents.update(head.agentId, { embodiments: (head.embodiments ?? []).filter((binding) => binding.worldId !== worldId) }, { expectedRevision: head.revision });
    if (selectedKey === key) { selectedKey = null; ui.select(null); ui.setMessages([]); }
    await refreshLocal(); ui.setStatus('Body removed. Agent identity and memory are still saved.');
  }
  async function resume(key) {
    requireConversationIdle();
    const body = bodies.get(key); if (!body?.local) throw new Error('Only the owner can resume this agent');
    await agents.resume(body.agentId); await refreshLocal(); await select(key);
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
    const pending = Promise.resolve().then(() => { signal.throwIfAborted(); return work(signal); })
      .catch((error) => { fail(error); throw error; })
      .finally(() => {
        if (operation === controller) { operation = null; operationDone = null; if (!disposed) ui.setBusy(false); }
      });
    operationDone = pending; return pending;
  }
  async function send({ key = selectedKey, text, voiceReply = false }) {
    await ready; alive(); requireConversationIdle();
    return runOperation((signal) => converse({ key, text, voiceReply, signal }));
  }
  async function cancel() {
    operation?.abort(new DOMException('Conversation cancelled', 'AbortError'));
    voicePreparation?.abort(new DOMException('Voice preparation cancelled', 'AbortError'));
    recordingStart?.controller.abort(new DOMException('Recording cancelled', 'AbortError'));
    await audio?.cancelRecording(); recording = false; audio?.stopPlayback();
    await recordingStart?.promise.catch(() => {});
    await voicePreparationDone?.catch(() => {});
    await operationDone?.catch(() => {});
    if (!disposed) ui.setVoiceStatus({ enabled: voiceEnabled, recording, preparing: !!voicePreparation });
  }
  async function enableVoice(enabled) {
    await ready; alive();
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
    await panelOpening;
    await panel?.dispose(); panel = null; panelShell?.remove(); panelShell = null;
    if (!disposed) refreshVoiceAvailability();
  }
  async function models() {
    await ready; alive(); if (panel || panelOpening) return;
    requireConversationIdle();
    if (voicePreparation) throw new Error('Wait for voice preparation or cancel it before opening Models');
    beforeOpen?.();
    panelOpening = (async () => {
      panelShell = document.createElement('dialog'); panelShell.className = 'world-agent-models';
      const close = document.createElement('button'); close.textContent = 'Back to world'; close.type = 'button';
      const content = document.createElement('div'); panelShell.append(close, content); document.body.append(panelShell); panelShell.showModal();
      close.onclick = () => { void closePanel().catch(fail); };
      panelShell.addEventListener('cancel', (event) => { event.preventDefault(); void closePanel().catch(fail); });
      // The panel borrows the scene's runtime. Closing it cancels panel work but
      // does not unload the agent's reasoning or speech services.
      const borrowed = new Proxy(runtime, { get(target, key) { return key === 'dispose' ? async () => {} : Reflect.get(target, key); } });
      try { panel = await panelFactory({ container: content, runtimeFactory: async () => borrowed, autoConnect: false }); }
      catch (error) { panelShell.remove(); panelShell = null; throw error; }
    })().finally(() => { panelOpening = null; });
    return panelOpening;
  }
  ui = uiFactory({ worldLabel, onOpen: beforeOpen, onSpawn: spawn, onSelect: select, onSend: send, onModels: models,
    onVoice: enableVoice, onRecord: record, onCancel: cancel, onClose: cancel, onRemove: remove, onResume: resume });
  const ready = (async () => {
    const options = await getRuntimeOptions(); worldManager = options.networkManager;
    // World conversations use the room's identity; model discovery uses the
    // global model network so hosts in the standalone console remain eligible.
    runtime = await runtimeFactory({ ...options, networkManager: undefined, residentModelSlots: 3 });
    lifetime.signal.throwIfAborted(); agents = await runtime.getAgentController();
    if (exclusiveEmbodiments) {
      embodimentLease = new WorldEmbodimentLease({ namespace: agents.store?.lockName ?? options.storeName ?? 'inference-models-agents', worldId });
      if (!embodimentLease.supported) ui.setStatus('Cross-tab body ownership is unavailable in this browser. Keep one window open for this world.');
    }
    unsubscribe = agents.subscribe((event) => { if (['changed', 'removed', 'activity'].includes(event.type)) void refreshLocal().catch(fail); });
    await refreshLocal(); lifetime.signal.throwIfAborted();
    void ensureModelNetwork(); void ensureNetwork();
    networkTimer = setInterval(() => {
      void ensureModelNetwork(); void ensureNetwork();
      if (embodimentLease) void refreshLocal().catch(fail);
    }, 5000);
  })();
  ready.catch(fail);
  return {
    ready,
    open() { ui.open(); },
    openConversation(key) { return select(key).catch(fail); },
    getStatus: () => ({ worldId, bodies: list(), selectedKey, voiceEnabled, recording, disposed, network: !!network,
      exclusiveEmbodiments: !!embodimentLease, crossTabOwnership: embodimentLease?.supported ?? null }),
    // The scene owns these operations; exposed for embedding and acceptance
    // checks without invoking GPU work through a hidden global test harness.
    spawn, send, remove, resume, enableVoice, cancel,
    get runtime() { return runtime; },
    async dispose() {
      if (closing) return closing;
      disposed = true; lifetime.abort(new DOMException('World closed', 'AbortError')); clearInterval(networkTimer); unsubscribe?.();
      closing = (async () => {
        await ready.catch(() => {}); await cancel(); await networkStarting; await modelStarting; await closePanel();
        await network?.close(); network = null;
        await speech?.dispose(); await audio?.dispose(); await runtime?.dispose();
        await refreshing; await adapter.dispose(); await embodimentLease?.close();
        ui.dispose(); bodies.clear(); heads.clear(); transcripts.clear();
      })();
      try { await closing; } finally { closing = null; }
    },
  };
}
