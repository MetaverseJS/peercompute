import { createInferenceRuntime } from './runtime.js';
import { createPanelView, appendMessage, renderStoredModels, formatModelBytes, renderModelCompatibilityHelp } from './ui/panelView.js';
import { buildModelCompatibilityHelp, detectModelHelpEnvironment } from './ui/modelCompatibilityHelp.js';
import { readImageAttachment } from './ui/imageAttachment.js';
import { createGeneratedImageRenderer } from './ui/generatedImages.js';
import { createModelBrowser } from './ui/modelBrowser.js';
import { createAgentConsole } from './agents/agentConsole.js';
import { createAgentChatSession } from './agents/agentChatSession.js';
import { supportsTask as modelSupportsTask } from '../../../peercompute/src/peercompute/inference/InferenceRouter.js';
import './panel.css';

const defaultVoiceSession = async (options) => (await import('../../shared/inference/VoiceSession.js')).createVoiceSession(options);
const defaultAudio = async () => (await import('../../shared/agents/speech/WorldAudio.js')).createWorldAudio();

/** Shared chat surface; the facade owns storage, inference and networking. */
export async function mountInferencePanel({ container = document.body, stateManager, computeManager,
  networkManager, getContext, actions, runtimeBaseUrl, onClose, autoConnect = false,
  runtimeFactory = createInferenceRuntime, refreshIntervalMs = 5000, pwaInstallController,
  voiceSessionFactory = defaultVoiceSession, audioFactory = defaultAudio } = {}) {
  const view = createPanelView(container);
  const generatedImages = createGeneratedImageRenderer(view.panel);
  const directTranscript = document.createElement('div'); directTranscript.hidden = true; view.panel.append(directTranscript);
  const encoder = new TextEncoder(), histories = new Map(), preferenceTasks = new Set();
  let runtime, operation, operationDone, requestId, attachment, imageController, imageLoading = false;
  let disposed = false, closing = false, disposingPromise, refreshPromise, refreshController, connectController, connectPromise, connectionFailure;
  let storedPromise, storedController, loadingStoredModel = false;
  let refreshTimer, sources = [], targets = [];
  let desiredSourceKey, modelBrowser, hubSelection;
  let helpSource, helpVersion = 0;
  let progressTimer, progressLabel, progressKey, progressStarted;
  let loadingOperation;
  let unsubscribeInstall;
  let agentConsole, openingAgents;
  let agentChat, agentsStarting, agentHeads = [], selectedChat = 'mixed', activeAgentId, voiceAgentId;
  let historyController, historyPromise, historyLoading = false, historyVersion = 0;
  let voiceSession, voiceStarting, voiceAudio;
  let voiceState = { status: 'idle', active: false, recording: false };
  const alive = () => !disposed && !closing;
  const sourceBlocked = (source) => ['checking', 'unavailable'].includes(source?.localAvailability?.status);
  const sourceLabel = (source) => source.source === 'hf' ? 'Hugging Face'
    : source.source === 'stored' ? 'Stored on this device' : 'Peers';
  const sourceReason = (source) => String(source?.localAvailability?.reason
    || (source?.localAvailability?.status === 'checking' ? 'Checking this device…' : 'Unavailable on this device.')).slice(0, 512);
  const memoryEstimate = (source) => {
    const amount = (bytes) => Number.isFinite(bytes) && bytes > 0 && bytes <= 1024 ** 4
      ? `${Number((bytes / 1024 ** 3).toFixed(1))} GiB` : 'unknown';
    return `est. RAM ${amount(source?.localAvailability?.cpuBytes)} / GPU ${amount(source?.localAvailability?.gpuBytes)}`;
  };
  const requestTask = () => view.generateImage.checked ? 'text-to-image' : attachment ? 'image-text-to-text' : 'text-generation';
  const agentIdFor = (key) => typeof key === 'string' && key.startsWith('agent:') ? key.slice(6) : null;
  const agentBlockReason = (head) => !head ? 'This agent is unavailable.'
    : head.activity?.unsaved ? 'Agent changes are not saved. Resume to retry saving before another message.'
      : head.recoveryRequired ? 'This agent has an interrupted task. Resume to acknowledge it; it will not replay.'
        : ['queued', 'running', 'cancelling'].includes(head.activity?.status) ? 'This agent is busy.'
          : head.status === 'paused' ? 'This agent is paused. Resume it to chat.' : '';
  const supportsTask = (target, task) => target?.available === true && (target.agentId
    ? targets.some((model) => (target.local || target.inferenceMode === 'local-only' ? model.local : true)
      && model.available && modelSupportsTask(model, task)) : modelSupportsTask(target, task));
  const selectedTarget = (task = requestTask()) => {
    const key = view.target.value || 'mixed';
    const agentId = agentIdFor(key);
    if (agentId) {
      const head = agentHeads.find((entry) => entry.agentId === agentId);
      const reason = agentBlockReason(head), local = head?.policy?.inferenceMode !== 'network-assisted';
      return { key, agentId, head, name: head?.identity?.name ?? 'Unavailable agent', reason, available: !reason,
        automatic: true, local, inferenceMode: local ? 'local-only' : 'network-assisted',
        modalities: ['text', 'image'], outputModalities: task === 'text-to-image' ? ['image'] : ['text'] };
    }
    if (['mixed', 'local-only'].includes(key)) return { key, automatic: true, task,
      name: key === 'mixed' ? 'Mixed' : 'Local only', local: key === 'local-only',
      available: targets.some((target) => (key === 'mixed' || target.local) && supportsTask(target, task)),
      modalities: task === 'image-text-to-text' ? ['text', 'image'] : ['text'],
      outputModalities: task === 'text-to-image' ? ['image'] : ['text'] };
    return targets.find((target) => target.key === key);
  };
  const invalidateActions = () => { actions?.invalidate?.(); view.proposed.replaceChildren(); };
  const showError = (error) => {
    if (!alive()) return;
    const message = (error.name === 'AbortError' ? 'Cancelled: ' : 'Error: ') + error.message
      + (/context budget/i.test(error.message) ? '. Use Config → Clear conversation to start again, or shorten the prompt.' : '');
    view.status.textContent = message;
    if (view.configuration.open) view.configurationStatus.textContent = message;
    if (view.storedModels.open) view.storedStatus.textContent = message;
  };
  const scrollTranscript = () => {
    while (view.transcript.children.length > 24 || encoder.encode(view.transcript.textContent).byteLength > 128 * 1024) view.transcript.firstElementChild?.remove();
    generatedImages.prune();
    view.transcript.scrollTop = view.transcript.scrollHeight;
  };
  function updateControls() {
    const target = selectedTarget();
    const source = sources.find((entry) => entry.key === desiredSourceKey);
    view.prompt.placeholder = view.generateImage.checked ? 'Describe an image…' : 'Message…';
    view.acquire.disabled = !!operation || !source || sourceBlocked(source);
    view.browse.disabled = !!operation; modelBrowser?.setBusy(!!operation);
    view.agents.disabled = !!operation || !!openingAgents || !runtime?.getAgentController;
    view.sourceHelp.disabled = !!operation;
    view.cpuBudget.disabled = view.gpuBudget.disabled = !!operation || !runtime?.setMemoryBudgets;
    const attachmentConflict = view.generateImage.checked && !!attachment;
    view.send.disabled = !!operation || historyLoading || imageLoading || attachmentConflict || !supportsTask(target, requestTask()) || (!view.prompt.value.trim() && !attachment);
    view.cancel.hidden = !operation || !!loadingOperation; view.target.disabled = !!operation;
    view.attach.disabled = !!operation || view.generateImage.checked || !supportsTask(selectedTarget('image-text-to-text'), 'image-text-to-text');
    view.generateImage.disabled = view.speakReplies.disabled = !!operation;
    const capturing = voiceState.recording || voiceState.status === 'requesting-microphone';
    view.talk.textContent = capturing ? 'Stop recording' : 'Talk';
    view.talk.disabled = !!loadingOperation || (!!operation && !capturing) || historyLoading || imageLoading || attachmentConflict || (!!target?.agentId && !target.available);
    view.resumeAgent.hidden = !target?.agentId || !target.reason || /busy|unavailable/i.test(target.reason);
    view.resumeAgent.disabled = !!operation || historyLoading;
    view.modeStatus.textContent = attachmentConflict
      ? 'Generate image uses a text prompt. Remove the attached image or uncheck Generate image.'
      : target?.agentId ? `${target.name} · ${target.local ? 'Local only, including voice.' : 'Mixed: local first, then peers, including voice.'} Identity and conversation are saved on this device.${target.reason ? ' ' + target.reason : ''}`
        : target?.key === 'mixed' ? 'Mixed uses a compatible loaded local model first, then an online peer. Messages, images and voice may be sent to that peer.'
        : target?.key === 'local-only' || target?.local ? 'Local execution only. Voice also uses compatible local speech models.'
          : 'This target runs on another peer. Messages and attachments go to that host; voice uses available local or peer speech models.';
    if (!attachmentConflict && target && !target.reason && !supportsTask(target, requestTask())) view.modeStatus.textContent +=
      ` No compatible ${view.generateImage.checked ? 'image-generation' : attachment ? 'vision' : 'text'} model is available for this choice. Load one or choose another target.`;
    view.unload.disabled = !!operation;
    view.clearChat.disabled = !!operation || !!target?.agentId;
    view.clearChat.title = target?.agentId ? 'Agent history and memory are persistent. Manage this agent through Agents.' : '';
    view.storedRefresh.disabled = !!operation || !!storedController;
    for (const button of view.storedList.querySelectorAll('button')) button.disabled = !!operation || !!storedController || button.dataset.inactive === 'true';
    view.storedCancel.hidden = !operation || !loadingStoredModel || !!loadingOperation;
    view.storedCancel.disabled = Boolean(operation?.signal.aborted);
  }
  function renderSources() {
    if (!desiredSourceKey) desiredSourceKey = runtime.getPreferredModelSourceKey?.()
      ?? sources.find((entry) => entry.modelId === 'smolvlm-256m-q4' && entry.source === 'hf')?.key
      ?? sources.find((entry) => !sourceBlocked(entry))?.key ?? sources[0]?.key;
    const selected = sources.find((entry) => entry.key === desiredSourceKey);
    view.currentModel.textContent = selected ? `${selected.name} · ${sourceLabel(selected)}` : 'Choose a model';
    view.currentModel.dataset.sourceKey = selected?.key ?? '';
    renderSourceStatus(); modelBrowser?.refresh(); updateControls();
  }
  function renderHelp() {
    if (!helpSource) return;
    helpVersion++;
    renderModelCompatibilityHelp(view, buildModelCompatibilityHelp(helpSource, {
      environment: { browser: view.helpBrowser.value, os: view.helpOs.value },
    }));
  }
  function showCompatibilityHelp(source) {
    if (!alive() || operation) return;
    if (source.needsVerification || source.localAvailability?.code === 'model_verification_required') {
      view.stored.click(); return;
    }
    helpSource = { ...source, localAvailability: source.localAvailability ?? runtime.getModelCompatibility?.(source.package ?? source) };
    const environment = detectModelHelpEnvironment();
    view.helpBrowser.value = environment.browser; view.helpOs.value = environment.os;
    renderHelp(); view.menuWindow.close(); view.configuration.close(); view.storedModels.close(); view.about.close();
    if (!view.compatibility.open) view.compatibility.showModal();
  }
  function renderSourceStatus() {
    const selected = sources.find((entry) => entry.key === desiredSourceKey);
    const notices = selected ? [`${formatModelBytes(selected.totalBytes)} package · ${memoryEstimate(selected)}. Planning estimates; actual memory use varies.`] : [];
    if (selected?.localAvailability?.reason) notices.push(String(selected.localAvailability.reason).slice(0, 512));
    view.sourceStatus.textContent = notices.join(' ');
    view.sourceStatus.hidden = !notices.length;
    view.sourceHelp.hidden = !selected || !sourceBlocked(selected);
  }
  function renderLists() {
    const selected = view.target.value || 'mixed';
    const previousTarget = targets.find((entry) => entry.key === selected);
    const previousLabel = view.target.selectedOptions[0]?.textContent;
    sources = runtime.listModelSources();
    if (hubSelection && !sources.some((entry) => entry.key === hubSelection.key)) sources.push(hubSelection);
    targets = runtime.listInferenceTargets();
    renderSources();
    view.target.replaceChildren();
    for (const [key, label] of [['mixed', 'Mixed · local first, then peers'], ['local-only', 'Local only · automatic']]) {
      const option = document.createElement('option'); option.value = key; option.textContent = label; view.target.append(option);
    }
    for (const head of agentHeads) {
      const option = document.createElement('option'); option.value = `agent:${head.agentId}`;
      option.textContent = `Agent · ${String(head.identity?.name ?? 'Unnamed agent').slice(0, 120)}`
        + (agentBlockReason(head) ? ` (${head.activity?.status || head.status || 'unavailable'})` : '');
      view.target.append(option);
    }
    for (const target of targets.filter((entry) => !['automatic-speech-recognition', 'text-to-speech'].includes(entry.task))) {
      const option = document.createElement('option'); option.value = target.key;
      option.textContent = (target.local ? 'Local · ' : 'Peers · ') + String(target.name).slice(0, 140)
        + (target.task === 'text-to-image' ? ' · Image generation' : '')
        + (target.busy ? ' (busy)' : !target.available ? ' (unavailable)' : '');
      view.target.append(option);
    }
    // A vanished provider must not silently redirect a composed message.
    if (!targets.some((entry) => entry.key === selected) && !agentHeads.some((entry) => `agent:${entry.agentId}` === selected)
        && !['mixed', 'local-only'].includes(selected) && previousLabel) {
      const option = document.createElement('option'); option.value = selected; option.disabled = true;
      option.textContent = (previousTarget?.name ?? previousLabel.replace(/ \(unavailable\)$/, '')) + ' (unavailable)'; view.target.append(option);
    }
    view.target.value = selected;
    if (!view.target.value) view.target.value = 'mixed';
    updateControls();
  }
  function agentsChanged() {
    if (!alive() || !agentChat) return;
    const id = agentIdFor(selectedChat), previous = agentHeads.find((entry) => entry.agentId === id);
    agentHeads = agentChat.list(); renderLists();
    const current = agentHeads.find((entry) => entry.agentId === id);
    if (id && !operation && !historyLoading && previous?.revision !== current?.revision) void restoreAgentHistory(selectedChat);
  }
  async function getAgentChat() {
    if (!agentChat && !agentsStarting) agentsStarting = (async () => {
      const controller = await runtime.getAgentController();
      if (!alive()) throw new DOMException('Console closed', 'AbortError');
      agentChat = createAgentChatSession({ controller, onChange: agentsChanged });
      await agentChat.refresh(); agentHeads = agentChat.list(); renderLists();
      return agentChat;
    })().finally(() => { agentsStarting = null; });
    return agentChat ?? await agentsStarting;
  }
  async function restoreAgentHistory(key) {
    historyController?.abort(); const controller = new AbortController(); historyController = controller;
    const version = ++historyVersion, id = agentIdFor(key);
    if (!id) return;
    historyLoading = true; updateControls();
    const current = () => alive() && !controller.signal.aborted && version === historyVersion && selectedChat === key;
    historyPromise = (async () => {
      try {
        const bridge = await getAgentChat();
        const [head, events] = await Promise.all([bridge.get(id, { signal: controller.signal }), bridge.history(id, { signal: controller.signal })]);
        if (!current()) return;
        if (!head) throw new Error('This saved agent no longer exists. Choose another chat or create an agent.');
        const index = agentHeads.findIndex((item) => item.agentId === id);
        if (index >= 0) agentHeads[index] = head;
        view.transcript.replaceChildren(view.empty); generatedImages.prune();
        const requests = new Set(events.filter((event) => event.type === 'request').map((event) => event.operationId));
        const visible = events.filter((event) => ['request', 'result'].includes(event.type)
          || (['failed', 'cancelled', 'outcome-unknown'].includes(event.type) && requests.has(event.operationId))).slice(-24);
        const seen = new Set();
        const imageEvents = new Set(visible.filter((event) => event.inputAttachmentId || event.imageAttachmentId).slice(-6));
        for (const event of visible) {
          if (!current()) return;
          const identity = `${event.type}:${event.operationId ?? event.sequence}`;
          if (seen.has(identity)) continue; seen.add(identity);
          const body = appendMessage(view, event.type === 'request' ? 'user' : 'assistant', event.text || '',
            { targetName: `Agent · ${head.identity.name}${event.route ? ' · ' + routeLabel(event.route) : ''}` });
          body.parentElement.dataset.operationId = event.operationId ?? '';
          const attachmentId = event.inputAttachmentId || event.imageAttachmentId;
          if (attachmentId) {
            try {
              if (!imageEvents.has(event)) throw new Error('Older preview omitted');
              const image = await bridge.attachment(id, attachmentId, { signal: controller.signal });
              if (!current()) return;
              const preview = await generatedImages.append(body, image, { signal: controller.signal, prompt: event.text });
              if (event.type === 'request') { preview.className = 'pc-chat-image'; preview.alt = 'Saved attached image'; }
            } catch (error) {
              if (!current()) return;
              const note = document.createElement('p'); note.className = 'pc-inference-note';
              note.textContent = 'Saved image preview is unavailable.'; body.after(note);
            }
          }
        }
        scrollTranscript();
      } catch (error) { if (current()) { view.transcript.replaceChildren(view.empty); generatedImages.prune(); showError(error); } }
      finally {
        if (version === historyVersion) { historyLoading = false; historyController = null; if (alive()) updateControls(); }
      }
    })();
    await historyPromise;
  }
  async function selectChat(key) {
    if (!alive() || operation) return;
    const before = selectedChat, wasAgent = !!agentIdFor(before), isAgent = !!agentIdFor(key);
    if (before === key) { if (isAgent) await restoreAgentHistory(key); updateControls(); return; }
    historyController?.abort(); historyVersion++; historyLoading = false;
    selectedChat = key; view.target.value = key;
    if (wasAgent || isAgent) { imageController?.abort(); clearAttachment(); view.prompt.value = ''; }
    invalidateActions();
    if (isAgent) {
      if (!wasAgent) directTranscript.append(...view.transcript.childNodes);
      view.transcript.replaceChildren(view.empty); generatedImages.prune();
      await restoreAgentHistory(key);
    } else if (wasAgent) {
      view.transcript.replaceChildren(...directTranscript.childNodes);
      if (!view.transcript.children.length) view.transcript.append(view.empty);
      generatedImages.prune(); scrollTranscript();
    }
    updateControls();
  }
  function renderNetworkStatus(error) {
    if (!runtime) return;
    const discovery = runtime.getDiscoveryStatus?.();
    const connected = discovery?.connected ?? runtime.networkReady;
    if (connected) connectionFailure = null;
    const text = connected
      ? `Peer network connected${Number.isSafeInteger(discovery?.peerCount) ? ` · ${discovery.peerCount} peers` : ''}`
        + ` · ${discovery?.sharedModelCount ?? sources.filter((source) => source.source === 'peers').length} shared models`
        + ` · ${discovery?.hostedModelCount ?? targets.filter((target) => !target.local && target.available).length} hosted models.`
      : connectController && !connectController.signal.aborted ? 'Connecting to peer network…' : 'Peer network is offline.';
    const notes = [text];
    const issue = error?.message ?? connectionFailure?.message ?? discovery?.errors?.[0]?.message;
    if (issue) notes.push('Discovery issue: ' + String(issue).slice(0, 256));
    else if (connected && discovery?.peerCount === 0) notes.push('Waiting for other peers.');
    else if (connected && discovery?.hostedModelCount === 0) notes.push('No peer is currently advertising a loaded model for inference.');
    const artifacts = runtime.getArtifactNetworkStatus?.();
    if (artifacts?.status === 'starting') notes.push('File sharing is preparing stored models. Inference discovery remains available.');
    if (artifacts?.status === 'error') notes.push('File sharing unavailable: ' + String(artifacts.error ?? 'Initialization failed').slice(0, 256));
    view.discoveryStatus.textContent = view.networkStatus.textContent = notes.join(' ');
  }
  function syncMemoryBudgets() {
    const budgets = runtime.getMemoryBudgets?.() ?? {};
    view.cpuBudget.value = budgets.cpuBytes == null ? '' : String(budgets.cpuBytes / 1024 ** 3);
    view.gpuBudget.value = budgets.gpuBytes == null ? '' : String(budgets.gpuBytes / 1024 ** 3);
    const ram = runtime.getDeviceCapabilities?.()?.deviceMemoryGiB;
    view.memoryNote.textContent = (Number.isFinite(ram) && ram > 0 ? `Browser-reported RAM: approximately ${ram} GiB. ` : '')
      + 'Optional estimates for future model loads. Leave blank for automatic checks. Your browser cannot report free GPU memory. Storage and loaded models are unchanged.';
  }
  function changeMemoryBudgets() {
    if (!alive() || operation || !runtime.setMemoryBudgets) return;
    try {
      const values = [view.cpuBudget, view.gpuBudget].map((input) => {
        input.setCustomValidity(''); input.removeAttribute('aria-invalid');
        const value = input.value.trim();
        const bytes = value ? Math.round(Number(value) * 1024 ** 3) : null;
        if (input.validity.badInput || (value && (!Number.isFinite(Number(value)) || Number(value) <= 0
            || Number(value) > 1024 || !Number.isSafeInteger(bytes) || bytes < 1))) {
          const error = 'Enter a memory budget above 0 and at most 1024 GiB, or leave it blank.';
          input.setCustomValidity(error); input.setAttribute('aria-invalid', 'true'); throw new Error(error);
        }
        return bytes;
      });
      runtime.setMemoryBudgets({ cpuBytes: values[0], gpuBytes: values[1] });
      syncMemoryBudgets(); sources = runtime.listModelSources(); renderSources();
      view.configurationStatus.textContent = 'Memory budgets updated for future loads.';
    } catch (error) { showError(error); }
  }
  async function refreshPeers() {
    if (!alive() || refreshPromise) return refreshPromise;
    const controller = new AbortController(); refreshController = controller;
    refreshPromise = (async () => {
      try {
        await runtime.refreshPeers({ signal: controller.signal });
        if (alive()) {
          // Keep an open native picker and its keyboard focus stable while the
          // directory refreshes. The next closed-picker refresh updates its list.
          const pickerOpen = CSS.supports('selector(:open)') && view.target.matches(':open');
          if (!pickerOpen) renderLists();
          renderNetworkStatus();
        }
      } catch (error) {
        if (alive() && !controller.signal.aborted) renderNetworkStatus(error);
      } finally { refreshPromise = null; refreshController = null; }
    })();
    return refreshPromise;
  }
  const progress = (event) => {
    if (!alive()) return;
    let label;
    if (event.stage === 'import') {
      label = (event.reused ? 'Using saved file ' : 'Downloading ') + (event.index + 1) + '/' + event.total + ': ' + event.path;
      if (Number.isSafeInteger(event.loaded) && Number.isSafeInteger(event.totalBytes) && event.loaded >= 0 && event.totalBytes > 0)
        label += ` · ${formatModelBytes(event.loaded)} / ${formatModelBytes(event.totalBytes)}`;
      if (event.retryAttempt) label += ` · Connection interrupted; retry ${event.retryAttempt}/${event.maxRetries} in ${Math.ceil(event.retryDelayMs / 1000)}s`;
    } else if (event.type === 'model-load') label = 'Loading model: ' + (event.stage || event.status || 'initializing GPU')
      + (event.file ? ' · ' + event.file : '');
    else label = {
      prepare: 'Preparing model…', verify: 'Verifying stored model files…',
      'download-peers': 'Fetching and verifying model files from peers…',
      unload: 'Releasing the previous model…', load: 'Loading model into RAM and GPU memory…',
    }[event.stage];
    if (event.stage === 'verify' && Number.isSafeInteger(event.loaded) && Number.isSafeInteger(event.totalBytes)
        && event.totalBytes > 0) label += ` · ${formatModelBytes(event.loaded)} / ${formatModelBytes(event.totalBytes)}`;
    if (!label) return;
    const key = `${event.type ?? ''}:${event.stage ?? event.status ?? ''}:${event.path ?? event.file ?? ''}`;
    if (key !== progressKey) { progressKey = key; progressStarted = performance.now(); }
    progressLabel = String(label).slice(0, 512); view.status.textContent = progressLabel;
    if (loadingOperation && !loadingOperation.controller.signal.aborted) view.loadingStatus.textContent = progressLabel;
    if (loadingStoredModel && view.storedModels.open) view.storedStatus.textContent = progressLabel;
    if (!progressTimer) progressTimer = setInterval(() => {
      if (alive() && operation && !operation.signal.aborted) {
        view.status.textContent = `${progressLabel} (${Math.floor((performance.now() - progressStarted) / 1000)}s)`;
        if (loadingOperation) view.loadingStatus.textContent = view.status.textContent;
        if (loadingStoredModel && view.storedModels.open) view.storedStatus.textContent = view.status.textContent;
      }
    }, 1000);
  };
  function cancelLoading() {
    if (!loadingOperation || loadingOperation.controller.signal.aborted) return;
    loadingOperation.controller.abort(new DOMException('Model load cancelled', 'AbortError'));
  }
  function showLoading(controller, modelName) {
    const entry = { controller, focus: document.activeElement,
      previousDialog: [...view.panel.querySelectorAll('dialog[open]')].at(-1) };
    loadingOperation = entry;
    view.loadingModel.textContent = String(modelName).slice(0, 256);
    view.loadingStatus.textContent = 'Preparing model…'; view.loadingCancel.disabled = false;
    entry.onAbort = () => {
      view.loadingCancel.disabled = true;
      view.loadingStatus.textContent = 'Cancelling load… Waiting for cleanup.';
      if (alive()) view.loading.focus();
    };
    controller.signal.addEventListener('abort', entry.onAbort, { once: true });
    updateControls(); view.loading.showModal();
  }
  function finishLoading(controller) {
    const entry = loadingOperation;
    if (!entry || entry.controller !== controller) return;
    controller.signal.removeEventListener('abort', entry.onAbort);
    loadingOperation = null; view.loading.close();
    if (!alive()) return;
    const focus = entry.focus?.isConnected && entry.focus.matches('button,input,select,textarea,a[href],[tabindex]')
      && !entry.focus.disabled && entry.focus.getClientRects().length ? entry.focus
      : entry.previousDialog?.open ? entry.previousDialog.querySelector('button:not(:disabled)')
        : !view.acquire.disabled ? view.acquire : view.menu;
    focus?.focus();
  }
  async function run(action, { modelName } = {}) {
    if (!alive() || operation) return;
    const controller = new AbortController(); operation = controller; updateControls();
    operationDone = (async () => {
      try {
        if (modelName !== undefined) showLoading(controller, modelName);
        await action(controller.signal);
      } catch (error) { showError(error); }
      finally {
        clearInterval(progressTimer); progressTimer = null; progressKey = null;
        activeAgentId = null; voiceAgentId = null;
        try { if (alive()) {
          await agentChat?.refresh().catch(showError);
          if (agentIdFor(selectedChat)) await restoreAgentHistory(selectedChat);
          renderLists(); scrollTranscript();
        } }
        finally {
          if (operation === controller) operation = null;
          // Re-enable controls before the loading dialog restores its opener.
          if (alive()) updateControls(); finishLoading(controller);
        }
      }
    })();
    await operationDone;
  }
  async function refreshStoredModels() {
    if (!alive() || storedPromise) return storedPromise;
    const controller = new AbortController(); storedController = controller;
    view.storedStatus.textContent = 'Reading stored models…'; updateControls();
    storedPromise = (async () => {
      try {
        const models = await runtime.listStoredModels({ signal: controller.signal });
        if (alive()) {
          renderStoredModels(view, models, deleteStoredModel, runtime.loadStoredModel ? loadStoredModel : undefined,
            runtime.recoverStoredModel ? recoverStoredModel : undefined, unloadStoredModel);
          view.storedStatus.textContent = `${models.length} model${models.length === 1 ? '' : 's'} stored.`;
        }
        return true;
      } catch (error) { showError(error); return false; }
      finally { storedPromise = null; storedController = null; if (alive()) updateControls(); }
    })();
    return storedPromise;
  }
  function deleteStoredModel(model) {
    return run(async (signal) => {
      view.storedStatus.textContent = `Deleting ${model.name}…`;
      let result;
      try { result = await runtime.deleteStoredModel(model.manifestCid, { signal }); }
      catch (error) { await refreshStoredModels(); throw error; }
      if (result.unloaded) { histories.delete(`local:${model.manifestCid}`); invalidateActions(); }
      if (await refreshStoredModels()) {
        const message = result.deleted ? `Deleted ${model.name}.` : 'This model is no longer stored.';
        view.storedStatus.textContent = message + (result.freedBytes > 0 ? ` Freed ${formatModelBytes(result.freedBytes)}.` : '');
        view.status.textContent = message;
      }
    });
  }
  async function unloadStoredModel(model) {
    if (!alive() || operation || storedController || !model.loaded) return;
    await run(async () => {
      await runtime.unload(model.manifestCid);
      histories.delete(`local:${model.manifestCid}`); invalidateActions();
      await refreshStoredModels(); renderLists();
      view.status.textContent = view.storedStatus.textContent = `Unloaded ${model.name}. Its files remain stored.`;
    });
  }
  async function recoverStoredModel(model) {
    if (!alive() || operation || storedController || !model.needsVerification) return;
    loadingStoredModel = true; view.storedCancel.textContent = 'Cancel verification';
    try {
      await run(async (signal) => {
        progress({ stage: 'verify' });
        try { await runtime.recoverStoredModel(model.manifestCid, { signal,
          onProgress: (event) => { if (!signal.aborted) progress(event); } }); }
        catch (error) { await refreshStoredModels(); throw error; }
        signal.throwIfAborted(); await refreshStoredModels(); renderLists();
        view.status.textContent = view.storedStatus.textContent = `Verified ${model.name} from local files. You can now load it.`;
      });
    } finally {
      loadingStoredModel = false; view.storedCancel.textContent = 'Stop loading';
      if (alive()) updateControls();
    }
  }
  async function loadStoredModel(model) {
    if (!alive() || operation || storedController || model.loaded || model.cleanupPending || model.needsVerification) return;
    if (sourceBlocked(model)) { showCompatibilityHelp(model); return; }
    loadingStoredModel = true;
    let loaded = false;
    try {
      await run(async (signal) => {
        invalidateActions(); progress({ stage: 'verify' });
        try {
          await runtime.loadStoredModel(model.manifestCid, { signal,
            onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) });
        } catch (error) { await refreshStoredModels(); throw error; }
        signal.throwIfAborted();
        desiredSourceKey = runtime.getPreferredModelSourceKey?.() ?? desiredSourceKey;
        renderLists();
        view.status.textContent = view.storedStatus.textContent = `Loaded ${model.name}. Compatible tasks can now use it.`;
        loaded = true;
      }, { modelName: model.name });
    } finally {
      loadingStoredModel = false;
      if (alive()) {
        updateControls();
        if (loaded) { view.storedModels.close(); view.prompt.focus(); }
      }
    }
  }
  function clearAttachment() {
    attachment = null; view.attachment.hidden = true; view.attachmentImage.removeAttribute('src'); view.imageFile.value = ''; updateControls();
  }
  try {
    runtime = await runtimeFactory({ stateManager, computeManager, networkManager, runtimeBaseUrl });
    const preferences = runtime.getPreferences(); view.sharing.checked = preferences.sharing; view.hosting.checked = preferences.hostInference;
    syncMemoryBudgets();
    modelBrowser = createModelBrowser({ container: view.panel,
      getSources: () => sources, getTargets: () => targets,
      searchModels: (options) => runtime.searchModelHub(options),
      inspectModel: (repository, options) => runtime.inspectModelHub(repository, options),
      findConversions: runtime.findModelConversions
        ? (repository, options) => runtime.findModelConversions(repository, options) : undefined,
      getCompatibility: (entry) => entry.localAvailability ?? runtime.getModelCompatibility?.(entry.package ?? entry)
        ?? { status: 'unknown', reason: 'Local memory fit is unverified.' },
      onLoad: loadSelection,
      onUsePeer(key) {
        renderLists();
        const target = targets.find((target) => target.key === key && target.available && !target.local);
        if (!target) {
          showError(new Error('This inference host is no longer available. Refresh the model browser.')); return;
        }
        const speech = ['automatic-speech-recognition', 'text-to-speech'].includes(target.task);
        void selectChat(speech ? 'mixed' : key).then(() => view.prompt.focus()).catch(showError);
        if (speech) view.status.textContent = 'Mixed routing can use compatible peer speech models. Use Talk or Speak replies.';
      },
      onSetup: showCompatibilityHelp,
    });
    view.browse.setAttribute('aria-controls', modelBrowser.element.id);
    renderLists(); view.status.textContent = 'Ready.';
  } catch (error) { view.panel.remove(); throw error; }

  view.configure.onclick = () => {
    if (!alive() || loadingOperation) return;
    view.menuWindow.close(); view.about.close(); view.compatibility.close(); view.storedModels.close(); view.configurationStatus.textContent = ''; view.configuration.showModal();
  };
  view.stored.onclick = () => {
    if (!alive() || loadingOperation) return;
    view.menuWindow.close(); view.about.close(); view.compatibility.close(); view.configuration.close(); view.storedModels.showModal(); void refreshStoredModels();
  };
  view.menu.onclick = () => {
    if (!alive() || loadingOperation) return;
    view.about.close(); view.compatibility.close(); view.configuration.close(); view.storedModels.close(); view.menuWindow.showModal();
  };
  view.aboutButton.onclick = () => {
    if (!alive() || loadingOperation) return;
    view.menuWindow.close(); view.about.showModal();
  };
  for (const modal of [view.menuWindow, view.configuration, view.storedModels, view.about]) {
    modal.addEventListener('close', () => {
      if (alive() && ![view.loading, view.menuWindow, view.configuration, view.storedModels, view.about, view.compatibility].some((entry) => entry.open)
          && document.activeElement !== view.prompt) view.menu.focus();
    });
  }
  if (pwaInstallController) {
    const renderInstall = (state = pwaInstallController.getState()) => {
      if (!alive()) return;
      view.install.hidden = false; view.install.disabled = state.installed || state.installing;
      view.install.textContent = state.installed ? 'Installed' : state.installing ? 'Installing…' : 'Install';
      view.menuStatus.textContent = String(state.instructions ?? '').slice(0, 512);
    };
    renderInstall(); unsubscribeInstall = pwaInstallController.subscribe?.(renderInstall);
    view.install.onclick = async () => {
      if (!alive() || view.install.disabled) return;
      try {
        const result = await pwaInstallController.install();
        if (alive()) {
          renderInstall();
          if (result.instructions) view.menuStatus.textContent = String(result.instructions).slice(0, 512);
        }
      } catch (error) { if (alive()) view.menuStatus.textContent = 'Installation unavailable: ' + String(error.message).slice(0, 256); }
    };
  }
  view.storedRefresh.onclick = () => { void refreshStoredModels(); };
  view.browse.onclick = () => { if (alive() && !operation) modelBrowser.open({ selectedKey: desiredSourceKey }); };
  view.sourceHelp.onclick = () => {
    const selected = sources.find((entry) => entry.key === desiredSourceKey);
    if (selected && sourceBlocked(selected)) showCompatibilityHelp(selected);
  };
  view.helpBrowser.onchange = view.helpOs.onchange = renderHelp;
  view.helpConfig.onclick = () => view.configure.click();
  view.compatibility.addEventListener('close', () => {
    helpVersion++;
    if (alive() && !view.configuration.open && !view.storedModels.open && !view.about.open && !view.menuWindow.open) view.browse.focus();
  });
  view.helpCopy.onclick = async () => {
    const command = view.helpCommand.value;
    if (!command || !alive()) return;
    const version = ++helpVersion;
    const current = () => alive() && view.compatibility.open && helpVersion === version;
    try {
      await navigator.clipboard.writeText(command);
      if (current()) view.helpStatus.textContent = 'Command copied.';
    } catch {
      if (current()) {
        view.helpCommand.focus(); view.helpCommand.select();
        view.helpStatus.textContent = 'Clipboard unavailable. Select and copy the command above.';
      }
    }
  };
  view.cpuBudget.onchange = view.gpuBudget.onchange = changeMemoryBudgets;
  view.target.onchange = () => { void selectChat(view.target.value).catch(showError); };
  view.resumeAgent.onclick = () => {
    const id = agentIdFor(view.target.value); if (!id || operation) return;
    void run(async (signal) => { await (await getAgentChat()).resume(id); signal.throwIfAborted(); view.status.textContent = 'Agent ready. Send a message.'; });
  };
  view.generateImage.onchange = () => { invalidateActions(); updateControls(); };
  view.speakReplies.onchange = updateControls;
  view.prompt.oninput = updateControls;
  for (const [control, method] of [[view.sharing, 'setSharing'], [view.hosting, 'setHostInference']]) {
    control.onchange = () => {
      if (!alive()) return;
      const desired = control.checked; control.disabled = true;
      const task = (async () => {
        try { await runtime[method](desired); if (alive()) view.configurationStatus.textContent = 'Preferences updated.'; }
        catch (error) { control.checked = !desired; showError(error); }
        finally { if (alive()) control.disabled = false; }
      })();
      preferenceTasks.add(task); task.finally(() => preferenceTasks.delete(task));
    };
  }
  async function loadSelection(selection) {
    if (!alive() || operation) return;
    const key = typeof selection === 'string' ? selection : selection?.key;
    sources = runtime.listModelSources();
    let selected = key ? sources.find((entry) => entry.key === key) ?? (hubSelection?.key === key ? hubSelection : null) : selection;
    if (!selected) { renderSources(); return; }
    if (selected.package) selected = { ...selected, localAvailability: runtime.getModelCompatibility(selected.package) };
    // Resolved Hub packages carry a full model/files description; source rows
    // carry their existing controller key. Admission is repeated by the runtime.
    const discovered = !selected.key && selected.model && Array.isArray(selected.files);
    if (discovered) {
      selected = hubSelection = { ...selected, key: `hub:${selected.id}`, source: 'hf', package: selected,
        localAvailability: runtime.getModelCompatibility(selected) };
    }
    if (sourceBlocked(selected)) { showCompatibilityHelp(selected); return; }
    desiredSourceKey = selected.key;
    if (discovered) sources.push(selected);
    renderSources();
    return run(async (signal) => {
      invalidateActions(); progress({ stage: 'prepare' });
      const options = { signal, onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) };
      if (selected.package) await runtime.acquireHubModel(selected.package, options);
      else await runtime.acquireModel(selected.key, options);
      signal.throwIfAborted();
      desiredSourceKey = runtime.getPreferredModelSourceKey?.() ?? desiredSourceKey;
      hubSelection = null;
      renderLists(); updateControls();
      view.status.textContent = runtime.getSharingErrors?.().length
        ? 'Model ready. Sharing is unavailable for some stored models; see Stored Models.' : 'Model ready. Send a message.';
    }, { modelName: selected.name });
  }
  view.acquire.onclick = () => loadSelection(desiredSourceKey);
  view.unload.onclick = () => run(async () => {
    invalidateActions(); await runtime.unload();
    for (const key of histories.keys()) if (key === 'local' || key.startsWith('local:')) histories.delete(key);
    view.status.textContent = 'Local models unloaded. Stored files are kept.';
    view.configurationStatus.textContent = view.status.textContent;
  });
  view.clearChat.onclick = () => {
    if (!alive() || operation || agentIdFor(view.target.value)) return;
    histories.clear(); invalidateActions(); view.transcript.replaceChildren(view.empty); generatedImages.prune();
    view.status.textContent = view.configurationStatus.textContent = 'Conversation cleared. Ready for a new message.';
  };
  view.connect.onclick = () => run(async (signal) => {
    if (view.relay.value.trim()) await runtime.connect(view.relay.value.trim(), { signal });
    else await runtime.connectBackend({ signal });
    await refreshPeers();
  });
  view.file.onchange = () => run(async (signal) => {
    const file = view.file.files[0]; if (!file) return;
    await runtime.store.importFile(file.stream(), { expectedSize: file.size, pin: true, signal });
    view.status.textContent = 'Pinned ' + file.name + ' locally.'; view.file.value = '';
  });
  view.attach.onclick = () => view.imageFile.click();
  view.imageFile.onchange = async () => {
    imageController?.abort(); const controller = new AbortController(); imageController = controller;
    const file = view.imageFile.files[0]; if (!file) return;
    imageLoading = true; updateControls();
    try {
      const next = await readImageAttachment(file, { signal: controller.signal });
      if (!alive() || controller.signal.aborted) return;
      attachment = next; view.attachmentImage.src = next.preview; view.attachmentName.textContent = next.name;
      view.attachment.hidden = false; updateControls(); view.prompt.focus();
    } catch (error) { if (!controller.signal.aborted) showError(error); }
    finally { if (imageController === controller) { imageLoading = false; if (alive()) updateControls(); } }
  };
  view.removeAttachment.onclick = () => { imageController?.abort(); clearAttachment(); };
  view.cancel.onclick = () => {
    if (loadingOperation) { cancelLoading(); return; }
    operation?.abort(new DOMException('User cancelled', 'AbortError'));
    if (voiceState.active) void voiceSession?.cancel().catch(showError);
    if (loadingStoredModel) view.storedStatus.textContent = 'Cancelling verification… Waiting for cleanup.';
    updateControls();
    if (requestId) void runtime.cancel(requestId).catch(showError);
    if (activeAgentId) void agentChat?.cancel(activeAgentId).catch(showError);
  };
  view.loadingCancel.onclick = cancelLoading;
  view.loading.addEventListener('cancel', (event) => { event.preventDefault(); cancelLoading(); });
  view.storedCancel.onclick = () => view.cancel.click();
  const routeLabel = (route) => route && typeof route.local === 'boolean'
    ? `${route.local ? 'Local' : 'Peer'} · ${String(route.modelName ?? route.manifestCid ?? 'model').slice(0, 180)}` : null;
  function showVoiceState(state, signal) {
    voiceState = state;
    if (!alive()) return;
    if (!signal?.aborted && state.status !== 'idle' && state.status !== 'closed') {
      view.status.textContent = ({ 'requesting-microphone': 'Waiting for microphone permission…', recording: 'Listening… press Stop recording to send.',
        transcribing: 'Transcribing voice…', synthesizing: 'Preparing spoken reply…', playing: 'Speaking…' })[state.status] ?? state.status;
    }
    updateControls();
  }
  async function getVoiceSession(signal) {
    if (!voiceSession && !voiceStarting) voiceStarting = (async () => {
      voiceAudio = await audioFactory();
      try {
        voiceSession = await voiceSessionFactory({ audio: voiceAudio, execute: async (target, input) => {
          if (voiceAgentId) {
            const policy = await (await getAgentChat()).speechTarget(voiceAgentId, { signal: input.signal });
            target = target === 'local-only' || policy === 'local-only' ? 'local-only' : 'mixed';
          }
          const id = input.requestId ?? crypto.randomUUID(); requestId = id;
          try { return await runtime.generate(target, { ...input, requestId: id }); }
          finally { if (requestId === id) requestId = null; }
        } });
        return voiceSession;
      } catch (error) { await voiceAudio?.dispose(); voiceAudio = null; throw error; }
    })().finally(() => { voiceStarting = null; });
    const session = voiceSession ?? await voiceStarting; signal?.throwIfAborted(); return session;
  }
  function voiceProgress(event) {
    if (!alive() || operation?.signal.aborted) return;
    const label = routeLabel(event.route ?? (event.type === 'routing' || event.type === 'route' ? event : null));
    if (label) view.status.textContent = `${voiceState.status === 'transcribing' ? 'Speech recognition' : 'Speech'} · ${label}`;
  }
  async function submit(signal, { text = view.prompt.value.trim(), preserveDraft = false } = {}) {
      const target = selectedTarget(), targetKey = target?.key ?? view.target.value;
      const agentId = target?.agentId;
      const task = requestTask(), createsImage = task === 'text-to-image', selectedImage = attachment;
      if (createsImage && selectedImage) throw new Error('Remove the attached image or uncheck Generate image.');
      if (!supportsTask(target, task)) throw new Error('No compatible model is available. Load one in Browse models or choose another target.');
      if (selectedImage && !target.modalities?.includes('image')) throw new Error('This model accepts text only. Remove the image or choose an image model.');
      invalidateActions();
      if (agentId) {
        const bridge = await getAgentChat(), head = await bridge.get(agentId, { signal });
        const reason = agentBlockReason(head); if (reason) throw new Error(reason);
      }
      const context = createsImage || agentId ? null : await getContext?.({ includeImage: false });
      const contextText = (typeof context === 'string' ? context : context?.text ?? '').slice(0, 16000);
      const instructions = createsImage || agentId ? '' : String(actions?.instructions ?? '').slice(0, 8000);
      // Requests carry one image. Replaying an earlier image's text-only answer
      // can make a small VLM describe that image instead of the current pixels.
      // Keep the visible transcript; replace model context only after success.
      const history = selectedImage || agentId ? [] : histories.get(targetKey) ?? [], message = text || 'Describe this image.';
      const messages = createsImage ? undefined : [...(contextText || instructions ? [{ role: 'system', content: contextText + '\n' + instructions }] : []),
        ...history.slice(-6), { role: 'user', content: message }];
      appendMessage(view, 'user', text, { image: selectedImage?.preview });
      const reply = appendMessage(view, 'assistant', '', { targetName: target.automatic ? 'Choosing model…' : target.name });
      const showRoute = (route) => {
        const label = routeLabel(route); if (!label || !alive() || signal.aborted) return;
        reply.parentElement.querySelector('.pc-chat-speaker').textContent = agentId ? `Agent · ${target.name} · ${label}` : label;
        reply.parentElement.dataset.routeTarget = String(route.target ?? '').slice(0, 256);
        view.status.textContent = `Using ${label}`;
      };
      if (!preserveDraft) view.prompt.value = ''; clearAttachment(); scrollTranscript();
      requestId = agentId ? null : crypto.randomUUID(); activeAgentId = agentId; voiceAgentId = agentId;
      view.status.textContent = 'Choosing a compatible model…';
      try {
        const callbacks = {
          onProgress(event) {
            showRoute(event.route ?? (['route', 'routing', 'accepted'].includes(event.type) ? event : null));
            if (alive() && createsImage && Number.isSafeInteger(event.step) && Number.isSafeInteger(event.steps)
                && event.step >= 0 && event.step <= event.steps && event.steps <= 100) {
              view.status.textContent = `Generating image: ${event.step}/${event.steps} steps…`;
            }
          },
          onToken(chunk) { if (alive() && !signal.aborted && !createsImage) { reply.textContent += chunk; scrollTranscript(); } } };
        const result = agentId ? await agentChat.run(agentId, { signal, task, prompt: message,
          ...(selectedImage ? { image: selectedImage.image } : {}), maxNewTokens: 1024, ...callbacks })
          : await runtime.generate(targetKey, { requestId, signal, task,
            ...(createsImage ? { prompt: text } : { messages, image: selectedImage?.image, maxNewTokens: 1024 }), ...callbacks });
        if (signal.aborted) throw new DOMException('Generation cancelled', 'AbortError');
        showRoute(result.route);
        if (createsImage) {
          if (!target.outputModalities?.includes('image')) throw new Error('This target did not advertise image output');
          await generatedImages.append(reply, result.image, { signal, prompt: text });
        } else {
          if (typeof result.text !== 'string') throw new Error('Model returned an invalid text response');
          reply.textContent = result.text;
          if (!agentId) {
            history.push({ role: 'user', content: message }, { role: 'assistant', content: result.text });
            while (history.length > 6 || encoder.encode(JSON.stringify(history)).byteLength > 24 * 1024) history.splice(0, 2);
            histories.delete(targetKey); histories.set(targetKey, history);
            if (histories.size > 8) histories.delete(histories.keys().next().value);
          }
        }
        view.status.textContent = 'Ready.';
        if (!createsImage) {
          const notes = [];
          if (result.finishReason === 'length') notes.push('Response reached the model’s output or context limit and may be incomplete.');
          else if (result.finishReason !== 'stop') notes.push('The model did not report whether this response is complete.');
          if (result.contextTruncated) notes.push('Older conversation turns were omitted to fit the model’s context.');
          if (notes.length) {
            const note = document.createElement('p'); note.className = 'pc-inference-note'; note.textContent = notes.join(' ');
            reply.after(note); view.status.textContent = notes.join(' ');
          }
        }
        try {
          for (const proposal of (createsImage ? [] : actions?.propose(result.text) ?? []).slice(0, 4)) {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Apply: ' + proposal.label;
            button.onclick = async () => { button.disabled = true; try { await proposal.apply(); } catch (error) { showError(error); } };
            view.proposed.append(button);
          }
        } catch { /* Plain chat remains usable when a response is not an action proposal. */ }
        if (!createsImage && view.speakReplies.checked && result.text.trim()) {
          try {
            const session = await getVoiceSession(signal);
            const speechTarget = agentId ? await agentChat.speechTarget(agentId, { signal }) : targetKey;
            await session.speak(result.text, { target: speechTarget, signal, onProgress: voiceProgress,
              onState: (state) => showVoiceState(state, signal) });
            signal.throwIfAborted(); view.status.textContent = 'Ready.';
          } catch (error) {
            signal.throwIfAborted();
            view.status.textContent = `Text reply received. Voice: ${error.message}. Load a speech-synthesis model in Browse models or use a compatible peer.`;
          }
        }
        return result;
      } catch (error) { if (!reply.textContent) reply.textContent = error.name === 'AbortError' ? 'Cancelled.' : 'Request failed.'; throw error; }
      finally { requestId = null; activeAgentId = null; voiceAgentId = null; scrollTranscript(); }
  }
  async function send() {
    if (view.send.disabled) return;
    await run((signal) => submit(signal));
  }
  view.send.onclick = () => { void send(); };
  view.talk.onclick = () => {
    if (!alive() || view.talk.disabled) return;
    if (voiceState.recording || voiceState.status === 'requesting-microphone') {
      void Promise.resolve().then(() => voiceSession.stop()).catch(showError); return;
    }
    void run(async (signal) => {
      const key = view.target.value || 'mixed'; voiceAgentId = agentIdFor(key);
      const target = voiceAgentId ? await (await getAgentChat()).speechTarget(voiceAgentId, { signal }) : key;
      const session = await getVoiceSession(signal);
      let phase, result;
      try {
        result = await session.record({ target, signal, onProgress: voiceProgress,
          onState: (state) => { if (state.status !== 'idle') phase = state.status; showVoiceState(state, signal); } });
      } catch (error) {
        signal.throwIfAborted();
        if (phase === 'transcribing') throw new Error(`${error.message}. Load a speech-recognition model in Browse models or use a compatible peer.`, { cause: error });
        throw error;
      }
      signal.throwIfAborted();
      if (!result.text?.trim()) throw new Error('No speech recognized. Try again or type a message.');
      await submit(signal, { text: result.text.trim(), preserveDraft: true });
    });
  };
  view.agents.onclick = () => {
    if (!alive() || view.agents.disabled) return;
    openingAgents = (async () => {
      try {
        const controller = await runtime.getAgentController();
        if (!alive()) return;
        await getAgentChat();
        agentConsole ??= createAgentConsole({ container: view.panel, controller,
          onChat: async (id) => {
            await agentChat.refresh(); renderLists(); await selectChat(`agent:${id}`);
            requestAnimationFrame(() => { if (alive()) view.prompt.focus(); });
          },
          onBrowseModels: () => { if (alive()) view.browse.click(); } });
        view.menuWindow.close(); view.configuration.close(); view.storedModels.close();
        view.about.close(); view.compatibility.close();
        await agentConsole.open({ selectedId: agentIdFor(view.target.value) });
      } catch (error) { showError(error); }
    })().finally(() => { openingAgents = null; if (alive()) updateControls(); });
    updateControls();
  };
  view.prompt.onkeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); void send(); }
  };
  // Runtime initialization only reads the library. Start exactly one cancellable
  // load after the controls exist, independently of peer connection readiness.
  try {
    const startup = runtime.getStartupModel?.();
    if (startup) {
      desiredSourceKey = startup.sourceKey; renderSources();
      if (sourceBlocked(startup)) {
        view.status.textContent = startup.needsVerification
          ? `${startup.name} is saved but needs local verification. Open Menu → Stored Models → Verify locally. No model download has started.`
          : `Cannot load ${startup.name}: ${sourceReason(startup)}`;
      } else void run(async (signal) => {
        progress({ stage: startup.manifestCid ? 'verify' : 'prepare' });
        const options = { signal, onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) };
        if (startup.manifestCid) await runtime.loadStoredModel(startup.manifestCid, options);
        else await runtime.acquireModel(startup.sourceKey, options);
        signal.throwIfAborted();
        renderLists();
        view.status.textContent = `Loaded ${startup.name}. Send a message.`;
      }, { modelName: startup.name });
    }
  } catch (error) { showError(error); }
  refreshTimer = setInterval(() => { void refreshPeers(); void agentChat?.refresh().catch(showError); }, Math.max(20, refreshIntervalMs));
  if (runtime.getAgentController) void getAgentChat().catch((error) => { if (alive()) showError(error); });
  if (autoConnect && !runtime.networkReady) {
    const controller = new AbortController(); connectController = controller;
    connectPromise = runtime.connectBackend({ signal: controller.signal }).then(() => refreshPeers()).catch((error) => {
      if (alive() && !controller.signal.aborted) connectionFailure = error;
    }).finally(() => {
      if (connectController === controller) connectController = null;
      if (alive()) renderNetworkStatus();
    });
  } else void refreshPeers();
  async function dispose() {
    clearInterval(progressTimer); progressTimer = null;
    if (disposed) return;
    if (disposingPromise) return disposingPromise;
    closing = true; modelBrowser?.dispose(); unsubscribeInstall?.(); generatedImages.dispose(); view.menuWindow.close(); view.compatibility.close(); view.storedModels.close(); view.configuration.close(); view.about.close(); view.panel.inert = true;
    disposingPromise = (async () => {
      clearInterval(refreshTimer); operation?.abort('Chat closed'); historyController?.abort(); imageController?.abort(); refreshController?.abort(); connectController?.abort(); storedController?.abort();
      // Release pending bridge reads before awaiting initialization/finalization.
      // The turn signal, not the read-only bridge, owns execution cancellation.
      await agentChat?.dispose();
      invalidateActions(); await operationDone; await refreshPromise; await connectPromise; await storedPromise; await Promise.allSettled([...preferenceTasks]);
      await openingAgents; await agentsStarting?.catch(() => {}); await historyPromise; await agentConsole?.dispose();
      await voiceStarting; await voiceSession?.dispose();
      await runtime.dispose(); disposed = true; histories.clear(); attachment = null; view.panel.remove(); onClose?.();
    })();
    try { await disposingPromise; } finally { disposingPromise = null; }
  }
  return { element: view.panel, runtime, dispose, refreshPeers };
}
