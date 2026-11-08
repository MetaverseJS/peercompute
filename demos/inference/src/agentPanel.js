import { createInferenceRuntime } from './runtime.js';
import { createPanelView, appendMessage, renderStoredModels, canSelectStoredModel, canLoadStoredModel, formatModelBytes, renderModelCompatibilityHelp } from './ui/panelView.js';
import { buildModelCompatibilityHelp, detectModelHelpEnvironment } from './ui/modelCompatibilityHelp.js';
import { readImageAttachment } from './ui/imageAttachment.js';
import { bindChatImageInput } from './ui/chatImageInput.js';
import { createGeneratedImageRenderer } from './ui/generatedImages.js';
import { createModelBrowser } from './ui/modelBrowser.js';
import { createModelManagementWindow } from './ui/modelManagementWindow.js';
import { createAgentConsole } from './agents/agentConsole.js';
import { createAgentChatSession } from './agents/agentChatSession.js';
import { supportsTask as modelSupportsTask, hasInferenceCapacity } from '../../../peercompute/src/peercompute/inference/InferenceRouter.js';
import './panel.css';

const defaultVoiceSession = async (options) => (await import('../../shared/inference/VoiceSession.js')).createVoiceSession(options);
const defaultAudio = async () => (await import('../../shared/agents/speech/WorldAudio.js')).createWorldAudio();

/** Shared chat surface; the facade owns storage, inference and networking. */
export async function mountInferencePanel({ container = document.body, stateManager, computeManager,
  networkManager, getContext, actions, runtimeBaseUrl, onClose, onRequestClose, autoConnect = false, managementOnly = false,
  runtimeFactory = createInferenceRuntime, refreshIntervalMs = 5000, pwaInstallController,
  voiceSessionFactory = defaultVoiceSession, audioFactory = defaultAudio, navigate = (url) => location.assign(url) } = {}) {
  const view = createPanelView(container);
  if (managementOnly) {
    // Embodied applications already own their conversation. Reuse the library
    // and lifecycle controls without exposing a second composer or auto-load.
    view.panel.setAttribute('aria-label', 'Model management');
    view.panel.classList.add('pc-model-management');
    for (const element of [view.back, view.agents, view.transcript, view.proposed, view.attachment,
      view.prompt, view.resumeAgent, view.send.parentElement, view.clearChat, view.clearChat.nextElementSibling]) {
      if (element) element.style.display = 'none';
    }
    const note = document.createElement('p'); note.className = 'pc-inference-note';
    note.textContent = 'Manage models for this world. Loaded models remain available to residents when you return to the world.';
    view.panel.append(note);
  }
  const generatedImages = createGeneratedImageRenderer(view.panel);
  const directTranscript = document.createElement('div'); directTranscript.hidden = true; view.panel.append(directTranscript);
  const encoder = new TextEncoder(), histories = new Map(), preferenceTasks = new Set();
  let runtime, operation, operationDone, requestId, attachment, imageController, imageLoading = false;
  let disposed = false, closing = false, disposingPromise, refreshPromise, refreshController, connectController, connectPromise, connectionFailure;
  let storedPromise, storedController, storedReadSignal, loadingStoredModel = false, deletingStoredModels = false;
  let storedRows = [], startupReading = true, imageInput, imageTransferPending = false, leaving = false;
  const selectedStored = new Set();
  let refreshTimer, sources = [], targets = [];
  let desiredSourceKey, modelBrowser, managementWindow, hubSelection;
  let helpSource, helpVersion = 0;
  let progressTimer, progressLabel, progressKey, progressStarted;
  let loadingOperation;
  let cancelledLoadCleanupError;
  let unsubscribeInstall;
  let agentConsole, openingAgents;
  let agentChat, agentsStarting, agentHeads = [], selectedChat = 'mixed', activeAgentId, voiceAgentId;
  let historyController, historyPromise, historyLoading = false, historyVersion = 0;
  let voiceSession, voiceStarting, voiceAudio;
  let voiceState = { status: 'idle', active: false, recording: false };
  const alive = () => !disposed && !closing;
  const sourceBlocked = (source) => ['checking', 'unavailable'].includes(source?.localAvailability?.status);
  const sourceReason = (source) => String(source?.localAvailability?.reason
    || (source?.localAvailability?.status === 'checking' ? 'Checking this device…' : 'Unavailable on this device.')).slice(0, 512);
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
  // Image capability survives temporary queue saturation; sending uses the
  // same admission rules as execution, including a selected agent's locality.
  const hasCapacity = (target, task) => {
    if (!supportsTask(target, task)) return false;
    return (target.automatic ? targets : [target]).some((model) => (!target.local || model.local)
      && modelSupportsTask(model, task) && hasInferenceCapacity(model));
  };
  const invalidateActions = () => { actions?.invalidate?.(); view.proposed.replaceChildren(); };
  function setStatus(message, { quiet = false } = {}) {
    view.status.textContent = message;
    view.status.classList.toggle('pc-status-quiet', quiet);
    if (managementOnly) modelBrowser?.setFeedback(message);
    return message;
  }
  const showError = (error) => {
    if (!alive()) return;
    const message = (error.name === 'AbortError' ? 'Cancelled: ' : 'Error: ') + error.message
      + (/context budget/i.test(error.message) ? '. Use Config → Clear conversation to start again, or shorten the prompt.' : '');
    setStatus(message);
    if (view.chatOptions.open) {
      view.chatOptionsStatus.textContent = message; view.chatOptionsStatus.hidden = false;
    }
    if (view.configuration.open || managementWindow?.isShowing(view.configuration)) view.configurationStatus.textContent = message;
    if (modelBrowser?.isStoredOpen()) view.storedStatus.textContent = message;
  };
  const scrollTranscript = () => {
    while (view.transcript.children.length > 24 || encoder.encode(view.transcript.textContent).byteLength > 128 * 1024) view.transcript.firstElementChild?.remove();
    generatedImages.prune();
    view.transcript.scrollTop = view.transcript.scrollHeight;
  };
  function updateControls() {
    const target = selectedTarget();
    view.prompt.placeholder = view.generateImage.checked ? 'Describe an image…' : 'Message…';
    view.browse.disabled = startupReading || !!operation;
    view.modelsMenu.disabled = startupReading || !!loadingOperation;
    view.chatConfigure.disabled = startupReading || !!operation;
    modelBrowser?.setBusy(closing || startupReading || !!operation);
    view.agents.disabled = !!operation || !!openingAgents || !runtime?.getAgentController;
    view.cpuBudget.disabled = view.gpuBudget.disabled = !!operation || !runtime?.setMemoryBudgets;
    const attachmentConflict = view.generateImage.checked && !!attachment;
    view.send.disabled = !!operation || historyLoading || imageLoading || imageTransferPending || attachmentConflict || !hasCapacity(target, requestTask()) || (!view.prompt.value.trim() && !attachment);
    view.cancel.hidden = !operation || !!loadingOperation; view.target.disabled = !!operation;
    view.attach.disabled = !!operation || view.generateImage.checked || !supportsTask(selectedTarget('image-text-to-text'), 'image-text-to-text');
    view.attach.title = view.generateImage.checked ? 'Generate image uses a text prompt. Uncheck it to attach an image.'
      : !supportsTask(selectedTarget('image-text-to-text'), 'image-text-to-text')
        ? 'Choose Mixed or a loaded local or peer vision model to attach an image.' : 'Attach an image for a vision model';
    view.generateImage.disabled = view.speakReplies.disabled = !!operation;
    const capturing = voiceState.recording || voiceState.status === 'requesting-microphone';
    view.talk.textContent = capturing ? 'Stop recording' : 'Talk';
    view.talk.disabled = !!loadingOperation || (!!operation && !capturing) || historyLoading || imageLoading || imageTransferPending || attachmentConflict || (!!target?.agentId && !target.available);
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
    else if (!attachmentConflict && target && !target.reason && !hasCapacity(target, requestTask())) view.modeStatus.textContent +=
      ' Compatible models have no available queue capacity. You can keep drafting; sending resumes when capacity is available.';
    view.empty.textContent = target?.agentId && target.reason ? `${target.name}: ${target.reason}`
      : supportsTask(target, requestTask()) ? view.generateImage.checked
        ? 'Describe an image to get started. Use ⚙ for chat options.'
        : 'Ask a question to get started. Use ⚙ for models, images and voice.'
      : 'Open Models to load one, or use ⚙ to choose a peer model.';
    view.unload.disabled = !!operation;
    view.clearChat.disabled = !!operation || !!target?.agentId;
    view.clearChat.title = target?.agentId ? 'Agent history and memory are persistent. Manage this agent through Agents.' : '';
    if (view.configuration.open || managementWindow?.isShowing(view.configuration)) renderMemoryUsage();
    view.storedRefresh.disabled = !!operation || !!storedController;
    for (const control of view.storedList.querySelectorAll('button,input')) control.disabled = !!operation || !!storedController || control.dataset.inactive === 'true';
    const selectedRows = storedRows.filter((model) => selectedStored.has(model.manifestCid));
    const loadableCount = runtime?.loadStoredModel ? selectedRows.filter(canLoadStoredModel).length : 0;
    view.storedLoadSelected.disabled = !!operation || !!storedController || !loadableCount;
    view.storedDeleteSelected.disabled = !!operation || !!storedController || !runtime?.deleteStoredModel || !selectedRows.length;
    view.storedSelection.textContent = `${selectedRows.length} model${selectedRows.length === 1 ? '' : 's'} selected.`
      + (selectedRows.length !== loadableCount ? ` ${loadableCount} ready to load.` : '');
    view.storedCancel.hidden = !operation || !(loadingStoredModel || deletingStoredModels) || !!loadingOperation;
    view.storedCancel.disabled = Boolean(operation?.signal.aborted);
  }
  function renderSources() {
    if (!desiredSourceKey) desiredSourceKey = runtime.getPreferredModelSourceKey?.()
      ?? sources.find((entry) => entry.modelId === 'smolvlm-256m-q4' && entry.source === 'hf')?.key
      ?? sources.find((entry) => !sourceBlocked(entry))?.key ?? sources[0]?.key;
    modelBrowser?.refresh(); updateControls();
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
      openModels({ tab: 'stored' }); return;
    }
    helpSource = { ...source, localAvailability: source.localAvailability ?? runtime.getModelCompatibility?.(source.package ?? source) };
    const environment = detectModelHelpEnvironment();
    view.helpBrowser.value = environment.browser; view.helpOs.value = environment.os;
    renderHelp();
    if (managementWindow) { managementWindow.show(view.compatibility); return; }
    view.networkInfo.close(); view.chatOptions.close(); view.menuWindow.close(); view.configuration.close(); modelBrowser?.close(); view.about.close();
    if (!view.compatibility.open) view.compatibility.showModal();
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
    if (wasAgent || isAgent) { imageInput?.cancel(); imageController?.abort(); clearAttachment(); view.prompt.value = ''; }
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
    const issue = error?.message ?? connectionFailure?.message ?? discovery?.errors?.[0]?.message;
    view.networkStatus.textContent = view.networkInfo.update({ connected,
      connecting: !!connectController && !connectController.signal.aborted,
      peerCount: discovery?.peerCount,
      sharedModelCount: discovery?.sharedModelCount ?? sources.filter((source) => source.source === 'peers').length,
      hostedModelCount: discovery?.hostedModelCount ?? targets.filter((target) => !target.local && target.available).length,
      issue, artifacts: runtime.getArtifactNetworkStatus?.() });
  }
  function syncMemoryBudgets() {
    const budgets = runtime.getMemoryBudgets?.() ?? {};
    view.cpuBudget.value = budgets.cpuBytes == null ? '' : String(budgets.cpuBytes / 1024 ** 3);
    view.gpuBudget.value = budgets.gpuBytes == null ? '' : String(budgets.gpuBytes / 1024 ** 3);
    const ram = runtime.getDeviceCapabilities?.()?.deviceMemoryGiB;
    view.memoryNote.textContent = (Number.isFinite(ram) && ram > 0 ? `Browser-reported RAM: approximately ${ram} GiB. ` : '')
      + 'Optional combined limits for all loaded models, using conservative estimates. Auto sets no application byte cap; an embedding app’s limits still apply. Your browser cannot report free GPU memory. Actual allocations may fail. Lowering a limit keeps loaded models and restricts future loads.';
    renderMemoryUsage();
  }
  function renderMemoryUsage() {
    const pressure = runtime?.getMemoryBudgetStatus?.();
    view.memoryPressure.hidden = !pressure;
    if (pressure) {
      const describe = (kind, label) => {
        const pool = pressure[kind];
        return `${label}: ${formatModelBytes(pool.reservedBytes)} estimated reserved; ${pool.budgetBytes === null
          ? 'no application cap' : `${formatModelBytes(pool.budgetBytes)} combined budget`}${pool.overBudget ? ' (over budget; unload a model or raise the limit before adding another)' : ''}.`;
      };
      view.memoryPressure.textContent = describe('cpu', 'RAM') + ' ' + describe('gpu', 'GPU')
        + (!pressure.owned ? ' The embedding app owns the shared resource pool; its limits cannot be raised here.' : '')
        + ' These totals are estimates, not measured RAM or VRAM use.';
    }
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
      view.configurationStatus.textContent = 'Combined memory budgets updated for future loads.';
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
    progressLabel = String(label).slice(0, 512); setStatus(progressLabel);
    if (loadingOperation && !loadingOperation.controller.signal.aborted) view.loadingStatus.textContent = progressLabel;
    if (loadingStoredModel && modelBrowser?.isStoredOpen()) view.storedStatus.textContent = progressLabel;
    if (!progressTimer) progressTimer = setInterval(() => {
      if (alive() && operation && !operation.signal.aborted) {
        setStatus(`${progressLabel} (${Math.floor((performance.now() - progressStarted) / 1000)}s)`);
        if (loadingOperation) view.loadingStatus.textContent = view.status.textContent;
        if (loadingStoredModel && modelBrowser?.isStoredOpen()) view.storedStatus.textContent = view.status.textContent;
      }
    }, 1000);
  };
  function cancelLoading() {
    if (!loadingOperation || loadingOperation.controller.signal.aborted) return;
    loadingOperation.controller.abort(new DOMException('Model load cancelled', 'AbortError'));
  }
  async function requestManagementClose() {
    // Finish a panel-owned load before beginning teardown of the view. A failed
    // cancellation must leave its Unload controls available, not hide the error
    // behind the world's intentionally no-op borrowed-runtime dispose.
    if (operation) {
      operation.abort(new DOMException('Models window closed', 'AbortError'));
      await operationDone;
    }
    if (cancelledLoadCleanupError) throw new Error('Model cleanup is incomplete. Retry Unload in Stored models or Config before closing.',
      { cause: cancelledLoadCleanupError });
    return onRequestClose ? onRequestClose() : dispose();
  }
  function acknowledgeUnloadCleanup() {
    const states = runtime.getResidentModelStates?.() ?? runtime.listResidentModels?.();
    if (!states || !states.some((entry) => !['ready', 'idle', 'closed'].includes(entry.status))) cancelledLoadCleanupError = null;
  }
  function showLoading(controller, modelName) {
    view.networkInfo.close(); view.chatOptions.close();
    const entry = { controller, focus: document.activeElement,
      previousDialog: [...view.panel.querySelectorAll('dialog[open]')].at(-1) };
    loadingOperation = entry;
    view.loadingModel.textContent = String(modelName).slice(0, 256);
    view.loadingStatus.textContent = 'Preparing model…'; view.loadingCancel.disabled = false;
    entry.onAbort = () => {
      view.loadingCancel.disabled = true;
      view.loadingStatus.textContent = 'Cancelling load… Waiting for cleanup.';
      if (alive()) (managementWindow ? modelBrowser.element : view.loading).focus();
    };
    controller.signal.addEventListener('abort', entry.onAbort, { once: true });
    updateControls();
    if (managementWindow) managementWindow.show(view.loading, { closeWindow: true });
    else view.loading.showModal();
  }
  function finishLoading(controller) {
    const entry = loadingOperation;
    if (!entry || entry.controller !== controller) return;
    controller.signal.removeEventListener('abort', entry.onAbort);
    loadingOperation = null; view.loading.close();
    if (!alive()) return;
    if (managementWindow) { managementWindow.showLibrary(); return; }
    const focus = entry.focus?.isConnected && entry.focus.matches('button,input,select,textarea,a[href],[tabindex]')
      && !entry.focus.disabled && entry.focus.getClientRects().length ? entry.focus
      : entry.previousDialog?.open ? entry.previousDialog.querySelector('button:not(:disabled)')
        : !view.browse.disabled ? view.browse : view.menu;
    focus?.focus();
  }
  async function run(action, { modelName } = {}) {
    if (!alive() || operation) return;
    const controller = new AbortController(); operation = controller; updateControls();
    operationDone = (async () => {
      try {
        if (modelName !== undefined) showLoading(controller, modelName);
        await action(controller.signal);
      } catch (error) {
        if (managementOnly && modelName !== undefined && controller.signal.aborted && error instanceof AggregateError) cancelledLoadCleanupError = error;
        showError(error);
      }
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
  function restoreStoredFocus(previous) {
    if (!alive() || !modelBrowser?.isStoredOpen() || !previous
        || (document.activeElement !== document.body && document.activeElement?.getClientRects().length)) return;
    const control = previous.isConnected && !previous.disabled && previous.getClientRects().length
      ? previous : view.storedContent.querySelector('button:not(:disabled)');
    control?.focus();
  }
  async function refreshStoredModels({ signal, preserveStatus = false, quietCancellation = false } = {}) {
    if (!alive()) return false;
    if (storedPromise) {
      if (!storedReadSignal?.aborted) return storedPromise;
      // A newly opened tab must not inherit the previous tab's cancelled read.
      // Wait for that owner to release the storage operation, then read afresh.
      await storedPromise;
      if (!alive() || signal?.aborted) return false;
      return refreshStoredModels({ signal, preserveStatus, quietCancellation });
    }
    const controller = new AbortController(); storedController = controller;
    const readSignal = signal ? AbortSignal.any([controller.signal, signal]) : controller.signal;
    storedReadSignal = readSignal;
    const focusedStoredControl = view.storedContent.contains(document.activeElement) ? document.activeElement : null;
    if (!preserveStatus) view.storedStatus.textContent = 'Reading stored models…'; updateControls();
    storedPromise = (async () => {
      // Publish ownership before even an already-aborted read can finish.
      await Promise.resolve();
      try {
        readSignal.throwIfAborted();
        const models = await runtime.listStoredModels({ signal: readSignal });
        readSignal.throwIfAborted();
        if (alive()) {
          storedRows = models;
          const eligible = new Set(models.filter(canSelectStoredModel).map((model) => model.manifestCid));
          for (const cid of selectedStored) if (!eligible.has(cid)) selectedStored.delete(cid);
          renderStoredModels(view, models, { selected: selectedStored,
              onRecover: runtime.recoverStoredModel ? recoverStoredModel : undefined, onUnload: unloadStoredModel,
              onSelect: (model, checked) => {
                if (!alive() || operation || storedController || !canSelectStoredModel(model)
                    || !storedRows.some((entry) => entry.manifestCid === model.manifestCid)) return;
                if (checked) selectedStored.add(model.manifestCid); else selectedStored.delete(model.manifestCid);
                updateControls();
              } });
          if (!preserveStatus) view.storedStatus.textContent = `${models.length} model${models.length === 1 ? '' : 's'} stored.`;
        }
        return true;
      } catch (error) {
        if (quietCancellation && (signal?.aborted || controller.signal.aborted)) return false;
        if (!preserveStatus) {
          showError(error);
          if (alive()) view.storedStatus.textContent = 'Error: ' + error.message;
        }
        return false;
      }
      finally {
        storedPromise = null; storedController = null; storedReadSignal = null;
        if (alive()) {
          updateControls();
          restoreStoredFocus(focusedStoredControl);
        }
      }
    })();
    return storedPromise;
  }
  async function deleteStoredModels(models) {
    if (!alive() || operation || storedController || !runtime.deleteStoredModel) return;
    const batch = [...new Map(models.filter(canSelectStoredModel).map((model) => [model.manifestCid, model])).values()];
    if (!batch.length) return;
    const previousFocus = view.storedContent.contains(document.activeElement) ? document.activeElement : null;
    deletingStoredModels = true; view.storedCancel.textContent = 'Stop deleting';
    try {
      await run(async (signal) => {
        let completed = 0, deleted = 0, freedBytes = 0, failure;
        try {
          for (const model of batch) {
            signal.throwIfAborted();
            view.storedStatus.textContent = `Deleting ${completed + 1} / ${batch.length}: ${model.name}…`;
            const result = await runtime.deleteStoredModel(model.manifestCid, { signal });
            // Acknowledged deletion remains completed even if Stop arrives now.
            completed++; if (result.deleted) deleted++;
            if (Number.isSafeInteger(result.freedBytes) && result.freedBytes > 0) freedBytes += result.freedBytes;
            selectedStored.delete(model.manifestCid);
            if (result.unloaded) { histories.delete(`local:${model.manifestCid}`); invalidateActions(); }
          }
        } catch (error) { failure = error; }
        // Cancellation may leave a tombstone or an unloaded resident. Reconcile
        // actual storage under a fresh read signal before releasing ownership.
        if (storedPromise) await storedPromise;
        const refreshed = await refreshStoredModels({ preserveStatus: true });
        const freed = freedBytes > 0 ? ` Freed ${formatModelBytes(freedBytes)}.` : '';
        if (failure) {
          const error = new Error(`Completed ${completed} of ${batch.length} deletions.${freed} ${failure.message}`
            + (refreshed ? '' : ' Use Refresh to check the stored library.'), { cause: failure });
          error.name = failure.name; throw error;
        }
        if (!refreshed) throw new Error('Deletion finished, but the stored library could not be refreshed. Use Refresh to check its state.');
        const message = batch.length === 1 ? deleted ? `Deleted ${batch[0].name}.` : 'This model is no longer stored.'
          : `Deleted ${deleted} models.` + (deleted < completed ? ` ${completed - deleted} already absent.` : '');
        view.storedStatus.textContent = message + freed; setStatus(message, { quiet: true });
      });
    } finally {
      deletingStoredModels = false; view.storedCancel.textContent = 'Stop loading';
      if (alive()) { updateControls(); restoreStoredFocus(previousFocus); }
    }
  }
  async function unloadStoredModel(model) {
    if (!alive() || operation || storedController || !model.loaded) return;
    await run(async () => {
      await runtime.unload(model.manifestCid); acknowledgeUnloadCleanup();
      histories.delete(`local:${model.manifestCid}`); invalidateActions();
      await refreshStoredModels(); renderLists();
      setStatus(view.storedStatus.textContent = `Unloaded ${model.name}. Its files remain stored.`, { quiet: true });
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
        setStatus(view.storedStatus.textContent = `Verified ${model.name} from local files. You can now load it.`, { quiet: true });
      });
    } finally {
      loadingStoredModel = false; view.storedCancel.textContent = 'Stop loading';
      if (alive()) updateControls();
    }
  }
  async function loadStoredModels(models) {
    if (!alive() || operation || storedController || !runtime.loadStoredModel) return;
    const batch = [...new Map(models.filter(canLoadStoredModel).map((model) => [model.manifestCid, model])).values()];
    if (!batch.length) return;
    loadingStoredModel = true;
    let completed = false, cancelled = false;
    try {
      await run(async (signal) => {
        invalidateActions(); const failures = []; let loaded = 0, refreshed = false;
        try {
          for (const [index, model] of batch.entries()) {
            signal.throwIfAborted();
            view.loadingModel.textContent = batch.length > 1 ? `${index + 1} / ${batch.length} · ${model.name}` : model.name;
            progress({ stage: 'verify' });
            try {
              await runtime.loadStoredModel(model.manifestCid, { signal,
                onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) });
              signal.throwIfAborted(); loaded++; selectedStored.delete(model.manifestCid);
            } catch (error) {
              // Keep a cleanup failure distinct from successful cancellation.
              const resident = runtime.listResidentModels?.().find((entry) => entry.manifestCid === model.manifestCid);
              if (error instanceof AggregateError || (resident && !['ready', 'idle'].includes(resident.status))) throw error;
              signal.throwIfAborted();
              if (error.name === 'AbortError') throw error;
              failures.push({ model, error });
            }
          }
        } finally {
          refreshed = await refreshStoredModels({ signal });
          cancelled = signal.aborted;
        }
        signal.throwIfAborted();
        if (!refreshed) throw new Error('Model loading finished, but the stored library could not be refreshed. Use Refresh to check its state.');
        desiredSourceKey = runtime.getPreferredModelSourceKey?.() ?? desiredSourceKey;
        renderLists();
        if (failures.length) throw new Error(batch.length === 1 ? failures[0].error.message
          : `Loaded ${loaded} of ${batch.length} models. ${failures.map(({ model, error }) => `${model.name}: ${error.message}`).join('; ')}`);
        setStatus(view.storedStatus.textContent = batch.length === 1
          ? `Loaded ${batch[0].name}. Compatible tasks can now use it.` : `Loaded ${loaded} models. Compatible tasks can now use them.`, { quiet: true });
        completed = true;
      }, { modelName: batch.length === 1 ? batch[0].name : `${batch.length} selected models` });
    } finally {
      loadingStoredModel = false;
      if (alive()) {
        updateControls();
        if (completed && !selectedStored.size && !managementOnly) { modelBrowser?.close(); view.prompt.focus(); }
        else if (cancelled) void refreshStoredModels({ preserveStatus: true });
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
      keepOpenOnAction: managementOnly,
      onConfigure: managementOnly ? () => view.configure.click() : undefined,
      onDismiss: managementOnly ? () => managementWindow.requestClose() : undefined,
      storedContent: view.storedContent,
      hasStoredModels: () => storedRows.length > 0 || sources.some((entry) => entry.source === 'stored'),
      onStoredOpen: ({ signal } = {}) => refreshStoredModels({ signal, quietCancellation: true }),
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
        if (managementOnly) {
          setStatus('This peer model is available to residents with network-assisted routing. Return to the world to chat.');
          return;
        }
        const speech = ['automatic-speech-recognition', 'text-to-speech'].includes(target.task);
        void selectChat(speech ? 'mixed' : key).then(() => view.prompt.focus()).catch(showError);
        if (speech) setStatus('Mixed routing can use compatible peer speech models. Use Talk or Speak replies.', { quiet: true });
      },
      onSetup: showCompatibilityHelp,
    });
    if (managementOnly) managementWindow = createModelManagementWindow({ browser: modelBrowser,
      onRequestClose: requestManagementClose });
    for (const trigger of [view.browse, view.modelsMenu]) trigger.setAttribute('aria-controls', modelBrowser.element.id);
    modelBrowser.element.addEventListener('close', () => {
      if (!managementOnly && alive() && !view.panel.querySelector('dialog[open]')
          && (document.activeElement === document.body || !document.activeElement?.getClientRects().length)) view.browse.focus();
    });
    renderLists(); setStatus('Ready.', { quiet: true });
  } catch (error) { view.networkInfo.dispose(); view.panel.remove(); throw error; }

  view.chatConfigure.onclick = () => {
    if (!alive() || startupReading || operation) return;
    view.chatOptionsStatus.textContent = ''; view.chatOptionsStatus.hidden = true;
    view.networkInfo.close(); view.menuWindow.close(); view.configuration.close(); view.about.close();
    view.compatibility.close(); modelBrowser?.close();
    if (!view.chatOptions.open) view.chatOptions.showModal();
  };
  view.chatOptions.addEventListener('close', () => {
    // Native close restores focus synchronously; its queued event must not
    // override a newer click or focus on the message field.
    if (alive() && !view.panel.querySelector('dialog[open]')
        && (document.activeElement === document.body || !document.activeElement?.getClientRects().length)) view.chatConfigure.focus();
  });
  view.configure.onclick = () => {
    if (!alive() || loadingOperation) return;
    if (managementWindow) {
      view.configurationStatus.textContent = ''; renderMemoryUsage(); managementWindow.show(view.configuration, { refreshStoredOnReturn: true }); return;
    }
    view.networkInfo.close(); view.chatOptions.close();
    view.menuWindow.close(); view.about.close(); view.compatibility.close(); modelBrowser?.close(); view.configurationStatus.textContent = ''; view.configuration.showModal();
  };
  function openModels(options = {}) {
    if (!alive() || startupReading || loadingOperation) return;
    if (managementWindow) managementWindow.showLibrary();
    view.networkInfo.close(); view.chatOptions.close();
    view.menuWindow.close(); view.about.close(); view.compatibility.close(); view.configuration.close();
    modelBrowser.open({ selectedKey: desiredSourceKey, ...options });
  }
  view.browse.onclick = view.modelsMenu.onclick = () => openModels();
  view.menu.onclick = () => {
    if (!alive() || loadingOperation) return;
    view.networkInfo.close(); view.chatOptions.close();
    view.about.close(); view.compatibility.close(); view.configuration.close(); modelBrowser?.close(); view.menuWindow.showModal();
  };
  view.aboutButton.onclick = () => {
    if (!alive() || loadingOperation) return;
    view.networkInfo.close(); view.chatOptions.close();
    view.menuWindow.close(); view.about.showModal();
  };
  for (const modal of [view.menuWindow, view.configuration, view.about]) {
    modal.addEventListener('close', () => {
      if (alive() && ![view.loading, view.menuWindow, view.configuration, view.about, view.compatibility, view.chatOptions, modelBrowser.element].some((entry) => entry.open)
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
  view.storedLoadSelected.onclick = () => { void loadStoredModels(storedRows.filter((model) => selectedStored.has(model.manifestCid))); };
  view.storedDeleteSelected.onclick = () => { void deleteStoredModels(storedRows.filter((model) => selectedStored.has(model.manifestCid))); };
  view.back.onclick = (event) => {
    event.preventDefault();
    if (alive() && !view.leaveConfirmation.open) {
      view.networkInfo.close(); view.chatOptions.close(); view.leaveConfirmation.showModal();
    }
  };
  view.stay.onclick = () => { if (!leaving) { view.leaveConfirmation.close(); view.back.focus(); } };
  view.leaveConfirmation.addEventListener('cancel', (event) => {
    if (leaving) event.preventDefault();
  });
  view.leave.onclick = async () => {
    if (view.leave.disabled) return;
    const destination = view.back.href;
    leaving = true; view.leave.disabled = view.stay.disabled = true;
    view.leaveStatus.textContent = 'Stopping models and closing connections…';
    try { await dispose(); navigate(destination); }
    catch (error) {
      // A failed worker stop must remain owned, with an explicit cleanup retry.
      view.panel.inert = false; view.leave.disabled = false;
      view.leaveStatus.textContent = `Could not finish cleanup: ${error.message}. Click Leave to retry.`;
      if (!view.leaveConfirmation.open) view.leaveConfirmation.showModal();
      view.leave.focus();
    }
  };
  view.helpBrowser.onchange = view.helpOs.onchange = renderHelp;
  view.helpConfig.onclick = () => view.configure.click();
  view.compatibility.addEventListener('close', () => {
    helpVersion++;
    if (alive() && !view.configuration.open && !modelBrowser?.element.open && !view.about.open && !view.menuWindow.open && !view.chatOptions.open) view.browse.focus();
  });
  view.helpCopy.onclick = async () => {
    const command = view.helpCommand.value;
    if (!command || !alive()) return;
    const version = ++helpVersion;
    const current = () => alive() && (view.compatibility.open || managementWindow?.isShowing(view.compatibility)) && helpVersion === version;
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
  view.target.onchange = () => {
    view.chatOptionsStatus.textContent = ''; view.chatOptionsStatus.hidden = true;
    void selectChat(view.target.value).catch(showError);
  };
  view.resumeAgent.onclick = () => {
    const id = agentIdFor(view.target.value); if (!id || operation) return;
    void run(async (signal) => { await (await getAgentChat()).resume(id); signal.throwIfAborted(); setStatus('Agent ready. Send a message.', { quiet: true }); });
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
      const sharingIssue = !!runtime.getSharingErrors?.().length;
      setStatus(sharingIssue
        ? 'Model ready. Sharing is unavailable for some stored models; see Models → Stored models.'
        : managementOnly ? 'Model ready. Return to the world to use it.' : 'Model ready. Send a message.', { quiet: !sharingIssue });
    }, { modelName: selected.name });
  }
  view.unload.onclick = () => run(async () => {
    invalidateActions(); await runtime.unload(); acknowledgeUnloadCleanup();
    for (const key of histories.keys()) if (key === 'local' || key.startsWith('local:')) histories.delete(key);
    setStatus('Local models unloaded. Stored files are kept.', { quiet: true });
    view.configurationStatus.textContent = view.status.textContent;
  });
  view.clearChat.onclick = () => {
    if (!alive() || operation || agentIdFor(view.target.value)) return;
    histories.clear(); invalidateActions(); view.transcript.replaceChildren(view.empty); generatedImages.prune();
    setStatus(view.configurationStatus.textContent = 'Conversation cleared. Ready for a new message.', { quiet: true });
  };
  view.connect.onclick = () => run(async (signal) => {
    if (view.relay.value.trim()) await runtime.connect(view.relay.value.trim(), { signal });
    else await runtime.connectBackend({ signal });
    await refreshPeers();
  });
  view.file.onchange = () => run(async (signal) => {
    const file = view.file.files[0]; if (!file) return;
    await runtime.store.importFile(file.stream(), { expectedSize: file.size, pin: true, signal });
    setStatus('Pinned ' + file.name + ' locally.', { quiet: true }); view.file.value = '';
  });
  view.attach.onclick = () => view.imageFile.click();
  async function attachImageFile(file, { signal } = {}) {
    if (!file || !alive()) return;
    imageController?.abort(); const controller = new AbortController(); imageController = controller;
    const imageSignal = signal ? AbortSignal.any([controller.signal, signal]) : controller.signal;
    imageLoading = true; updateControls();
    try {
      const next = await readImageAttachment(file, { signal: imageSignal });
      if (!alive() || imageSignal.aborted) return;
      attachment = next; view.attachmentImage.src = next.preview; view.attachmentName.textContent = next.name;
      view.attachment.hidden = false; updateControls(); view.prompt.focus();
    } catch (error) { if (!imageSignal.aborted) showError(error); }
    finally { if (imageController === controller) { imageLoading = false; if (alive()) updateControls(); } }
  }
  imageInput = bindChatImageInput({ textarea: view.prompt, onFile: attachImageFile, onError: showError,
    onPendingChange: (pending) => {
      if (pending) imageController?.abort();
      imageTransferPending = pending; if (alive()) updateControls();
    },
    canAccept: () => !alive() ? 'This chat is closing.' : operation || historyLoading ? 'Wait for the current chat operation to finish.'
      : view.generateImage.checked ? 'Uncheck Generate image to attach an image for a vision model.'
        : supportsTask(selectedTarget('image-text-to-text'), 'image-text-to-text') || 'Choose Mixed or a loaded local or peer vision model to attach an image.',
  });
  view.imageFile.onchange = () => {
    imageInput.cancel(); void attachImageFile(view.imageFile.files[0]);
  };
  view.removeAttachment.onclick = () => { imageInput.cancel(); imageController?.abort(); clearAttachment(); };
  view.cancel.onclick = () => {
    if (loadingOperation) { cancelLoading(); return; }
    operation?.abort(new DOMException('User cancelled', 'AbortError'));
    if (voiceState.active) void voiceSession?.cancel().catch(showError);
    if (loadingStoredModel) view.storedStatus.textContent = 'Cancelling verification… Waiting for cleanup.';
    if (deletingStoredModels) view.storedStatus.textContent = 'Cancelling deletion… Waiting for cleanup.';
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
      setStatus(({ 'requesting-microphone': 'Waiting for microphone permission…', recording: 'Listening… press Stop recording to send.',
        transcribing: 'Transcribing voice…', synthesizing: 'Preparing spoken reply…', playing: 'Speaking…' })[state.status] ?? state.status);
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
    if (label) setStatus(`${voiceState.status === 'transcribing' ? 'Speech recognition' : 'Speech'} · ${label}`);
  }
  async function submit(signal, { text = view.prompt.value.trim(), preserveDraft = false } = {}) {
      const target = selectedTarget(), targetKey = target?.key ?? view.target.value;
      const agentId = target?.agentId;
      const task = requestTask(), createsImage = task === 'text-to-image', selectedImage = attachment;
      if (createsImage && selectedImage) throw new Error('Remove the attached image or uncheck Generate image.');
      if (!supportsTask(target, task)) throw new Error('No compatible model is available. Load one in Models or choose another target.');
      if (!hasCapacity(target, task)) throw new Error('Compatible models have no available queue capacity. Wait for capacity or choose another target.');
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
        setStatus(`Using ${label}`);
      };
      if (!preserveDraft) view.prompt.value = ''; clearAttachment(); scrollTranscript();
      requestId = agentId ? null : crypto.randomUUID(); activeAgentId = agentId; voiceAgentId = agentId;
      setStatus('Choosing a compatible model…');
      try {
        const callbacks = {
          onProgress(event) {
            showRoute(event.route ?? (['route', 'routing', 'accepted'].includes(event.type) ? event : null));
            if (alive() && createsImage && Number.isSafeInteger(event.step) && Number.isSafeInteger(event.steps)
                && event.step >= 0 && event.step <= event.steps && event.steps <= 100) {
              setStatus(`Generating image: ${event.step}/${event.steps} steps…`);
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
        setStatus('Ready.', { quiet: true });
        if (!createsImage) {
          const notes = [];
          if (result.finishReason === 'length') notes.push('Response reached the model’s output or context limit and may be incomplete.');
          else if (result.finishReason !== 'stop') notes.push('The model did not report whether this response is complete.');
          if (result.contextTruncated) notes.push('Older conversation turns were omitted to fit the model’s context.');
          if (notes.length) {
            const note = document.createElement('p'); note.className = 'pc-inference-note'; note.textContent = notes.join(' ');
            reply.after(note); setStatus(notes.join(' '));
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
            signal.throwIfAborted(); setStatus('Ready.', { quiet: true });
          } catch (error) {
            signal.throwIfAborted();
            setStatus(`Text reply received. Voice: ${error.message}. Load a speech-synthesis model in Models or use a compatible peer.`);
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
        if (phase === 'transcribing') throw new Error(`${error.message}. Load a speech-recognition model in Models or use a compatible peer.`, { cause: error });
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
        view.networkInfo.close(); view.chatOptions.close(); view.menuWindow.close(); view.configuration.close(); modelBrowser?.close();
        view.about.close(); view.compatibility.close();
        await agentConsole.open({ selectedId: agentIdFor(view.target.value) });
      } catch (error) { showError(error); }
    })().finally(() => { openingAgents = null; if (alive()) updateControls(); });
    updateControls();
  };
  view.prompt.onkeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); void send(); }
  };
  // A retained library is a choice, never a trigger for an automatic download.
  // Keep this read independent of peer connectivity and track it through teardown.
  const startupReady = (async () => {
    const listed = await refreshStoredModels();
    if (!alive()) return;
    startupReading = false; updateControls();
    if (managementOnly) {
      modelBrowser.open({ tab: !listed || storedRows.length ? 'stored' : 'browse', refreshStored: false, selectedKey: desiredSourceKey });
      return;
    }
    if (!listed || storedRows.length) {
      modelBrowser.open({ tab: 'stored', refreshStored: false, selectedKey: desiredSourceKey });
      if (listed) setStatus('Choose stored models to load, or close the library to use peers.', { quiet: true });
      return;
    }
    try {
      const startup = runtime.getStartupModel?.();
      if (startup) {
        desiredSourceKey = startup.sourceKey; renderSources();
        // A stale remembered CID after a concurrent deletion is not an empty
        // library default. Let the user choose instead of silently downloading.
        if (startup.manifestCid) {
          setStatus('The remembered model is no longer in the stored library. Choose a model to load.');
        } else if (sourceBlocked(startup)) {
          setStatus(startup.needsVerification
            ? `${startup.name} is saved but needs local verification. Open Models → Stored models → Verify locally. No model download has started.`
            : `Cannot load ${startup.name}: ${sourceReason(startup)}`);
        } else void run(async (signal) => {
          progress({ stage: 'prepare' });
          const options = { signal, onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) };
          await runtime.acquireModel(startup.sourceKey, options);
          signal.throwIfAborted();
          renderLists();
          setStatus(`Loaded ${startup.name}. Send a message.`, { quiet: true });
        }, { modelName: startup.name });
      }
    } catch (error) { showError(error); }
  })();
  refreshTimer = setInterval(() => { void refreshPeers(); void agentChat?.refresh().catch(showError); }, Math.max(20, refreshIntervalMs));
  if (!managementOnly && runtime.getAgentController) void getAgentChat().catch((error) => { if (alive()) showError(error); });
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
    closing = true; view.networkInfo.dispose(); view.chatOptions.close();
    if (managementWindow) {
      modelBrowser.setBusy(true); modelBrowser.setFeedback('Closing Models… Waiting for cleanup.');
      for (const control of view.storedContent.querySelectorAll('button,input')) control.disabled = true;
    }
    else { modelBrowser?.dispose(); view.panel.inert = true; }
    unsubscribeInstall?.(); generatedImages.dispose(); view.menuWindow.close(); view.compatibility.close(); view.configuration.close(); view.about.close();
    disposingPromise = (async () => {
      clearInterval(refreshTimer); operation?.abort('Chat closed'); historyController?.abort(); imageController?.abort(); refreshController?.abort(); connectController?.abort(); storedController?.abort();
      await imageInput?.dispose();
      // Release pending bridge reads before awaiting initialization/finalization.
      // The turn signal, not the read-only bridge, owns execution cancellation.
      await agentChat?.dispose();
      invalidateActions(); await operationDone; await refreshPromise; await connectPromise; await storedPromise; await startupReady; await Promise.allSettled([...preferenceTasks]);
      await openingAgents; await agentsStarting?.catch(() => {}); await historyPromise; await agentConsole?.dispose();
      await voiceStarting; await voiceSession?.dispose();
      await runtime.dispose(); disposed = true; modelBrowser?.dispose(); histories.clear(); attachment = null; view.panel.remove(); onClose?.();
    })();
    try { await disposingPromise; }
    catch (error) {
      if (managementWindow) {
        // Cleanup may already have disposed some services. Keep mutations
        // stopped, while allowing the window's Done control to retry cleanup.
        managementWindow.showLibrary(); modelBrowser.setBusy(true);
        modelBrowser.setFeedback(`Could not close Models: ${error.message}. Click Done to retry.`);
      }
      throw error;
    } finally { disposingPromise = null; }
  }
  return { element: view.panel, runtime, dispose, refreshPeers, startupReady, openModels };
}
