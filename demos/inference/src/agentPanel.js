import { createInferenceRuntime } from './runtime.js';
import { createPanelView, appendMessage, renderStoredModels, formatModelBytes, renderModelCompatibilityHelp } from './ui/panelView.js';
import { buildModelCompatibilityHelp, detectModelHelpEnvironment } from './ui/modelCompatibilityHelp.js';
import { readImageAttachment } from './ui/imageAttachment.js';
import { createGeneratedImageRenderer } from './ui/generatedImages.js';
import { createModelBrowser } from './ui/modelBrowser.js';
import './panel.css';

/** Shared chat surface; the facade owns storage, inference and networking. */
export async function mountInferencePanel({ container = document.body, stateManager, computeManager,
  networkManager, getContext, actions, runtimeBaseUrl, onClose, autoConnect = false,
  runtimeFactory = createInferenceRuntime, refreshIntervalMs = 5000, pwaInstallController } = {}) {
  const view = createPanelView(container);
  const generatedImages = createGeneratedImageRenderer(view.transcript);
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
  const selectedTarget = () => targets.find((target) => target.key === view.target.value);
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
    view.prompt.placeholder = target?.task === 'text-to-image' ? 'Describe an image…' : 'Message…';
    view.acquire.disabled = !!operation || !source || sourceBlocked(source);
    view.browse.disabled = !!operation; modelBrowser?.setBusy(!!operation);
    view.sourceHelp.disabled = !!operation;
    view.cpuBudget.disabled = view.gpuBudget.disabled = !!operation || !runtime?.setMemoryBudgets;
    view.send.disabled = !!operation || imageLoading || !target?.available || (!view.prompt.value.trim() && !attachment);
    view.cancel.hidden = !operation || !!loadingOperation; view.target.disabled = !!operation;
    view.attach.disabled = !!operation || !target?.modalities?.includes('image');
    view.unload.disabled = !!operation;
    view.clearChat.disabled = !!operation;
    view.storedRefresh.disabled = !!operation || !!storedController;
    for (const button of view.storedList.querySelectorAll('button')) button.disabled = !!operation || !!storedController || button.dataset.inactive === 'true';
    view.storedCancel.hidden = !operation || !loadingStoredModel || !!loadingOperation;
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
    const selected = view.target.value || 'local';
    const previousTarget = targets.find((entry) => entry.key === selected);
    const previousLabel = view.target.selectedOptions[0]?.textContent;
    sources = runtime.listModelSources();
    if (hubSelection && !sources.some((entry) => entry.key === hubSelection.key)) sources.push(hubSelection);
    targets = runtime.listInferenceTargets();
    renderSources();
    view.target.replaceChildren();
    for (const target of targets) {
      const option = document.createElement('option'); option.value = target.key;
      option.textContent = (target.local ? 'Local · ' : 'Peers · ') + String(target.name).slice(0, 140)
        + (target.task === 'text-to-image' ? ' · Image generation' : '')
        + (target.busy ? ' (busy)' : !target.available ? ' (unavailable)' : '');
      view.target.append(option);
    }
    // A vanished provider must not silently redirect a composed message.
    if (!targets.some((entry) => entry.key === selected) && selected !== 'local' && previousLabel) {
      const option = document.createElement('option'); option.value = selected; option.disabled = true;
      option.textContent = (previousTarget?.name ?? previousLabel.replace(/ \(unavailable\)$/, '')) + ' (unavailable)'; view.target.append(option);
    }
    view.target.value = selected;
    if (!view.target.value && targets.some((target) => target.key === 'local')) view.target.value = 'local';
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
      label = 'Downloading ' + (event.index + 1) + '/' + event.total + ': ' + event.path;
      if (Number.isSafeInteger(event.loaded) && Number.isSafeInteger(event.totalBytes) && event.loaded >= 0 && event.totalBytes > 0)
        label += ` · ${formatModelBytes(event.loaded)} / ${formatModelBytes(event.totalBytes)}`;
    } else if (event.type === 'model-load') label = 'Loading model: ' + (event.stage || event.status || 'initializing GPU')
      + (event.file ? ' · ' + event.file : '');
    else label = {
      prepare: 'Preparing model…', verify: 'Verifying stored model files…',
      'download-peers': 'Fetching and verifying model files from peers…',
      unload: 'Releasing the previous model…', load: 'Loading model into RAM and GPU memory…',
    }[event.stage];
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
        if (operation === controller) operation = null;
        try { if (alive()) { renderLists(); scrollTranscript(); } }
        finally { finishLoading(controller); }
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
          renderStoredModels(view, models, deleteStoredModel, runtime.loadStoredModel ? loadStoredModel : undefined);
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
      if (result.unloaded) { histories.delete('local'); invalidateActions(); }
      if (await refreshStoredModels()) {
        const message = result.deleted ? `Deleted ${model.name}.` : 'This model is no longer stored.';
        view.storedStatus.textContent = message + (result.freedBytes > 0 ? ` Freed ${formatModelBytes(result.freedBytes)}.` : '');
        view.status.textContent = message;
      }
    });
  }
  async function loadStoredModel(model) {
    if (!alive() || operation || storedController || model.loaded || model.cleanupPending) return;
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
        histories.delete('local');
        desiredSourceKey = runtime.getPreferredModelSourceKey?.() ?? desiredSourceKey;
        renderLists(); view.target.value = 'local';
        view.status.textContent = view.storedStatus.textContent = `Loaded ${model.name}. Send a message.`;
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
        if (!targets.some((target) => target.key === key && target.available && !target.local)) {
          showError(new Error('This inference host is no longer available. Refresh the model browser.')); return;
        }
        view.target.value = key; invalidateActions(); updateControls(); view.prompt.focus();
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
  view.target.onchange = () => { invalidateActions(); updateControls(); };
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
      histories.delete('local'); renderLists(); view.target.value = 'local'; updateControls();
      view.status.textContent = runtime.getSharingErrors?.().length
        ? 'Model ready. Sharing is unavailable for some stored models; see Stored Models.' : 'Model ready. Send a message.';
    }, { modelName: selected.name });
  }
  view.acquire.onclick = () => loadSelection(desiredSourceKey);
  view.unload.onclick = () => run(async () => {
    invalidateActions(); await runtime.unload(); histories.delete('local'); view.status.textContent = 'Local model unloaded.';
    view.configurationStatus.textContent = view.status.textContent;
  });
  view.clearChat.onclick = () => {
    if (!alive() || operation) return;
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
    if (requestId) void runtime.cancel(requestId).catch(showError);
  };
  view.loadingCancel.onclick = cancelLoading;
  view.loading.addEventListener('cancel', (event) => { event.preventDefault(); cancelLoading(); });
  view.storedCancel.onclick = () => view.cancel.click();
  async function send() {
    if (view.send.disabled) return;
    await run(async (signal) => {
      const target = selectedTarget(), targetKey = target.key;
      const createsImage = target.task === 'text-to-image';
      const text = view.prompt.value.trim(), selectedImage = attachment;
      if (selectedImage && !target.modalities?.includes('image')) throw new Error('This model accepts text only. Remove the image or choose an image model.');
      invalidateActions();
      const context = createsImage ? null : await getContext?.({ includeImage: false });
      const contextText = (typeof context === 'string' ? context : context?.text ?? '').slice(0, 16000);
      const instructions = createsImage ? '' : String(actions?.instructions ?? '').slice(0, 8000);
      const history = histories.get(targetKey) ?? [], message = text || 'Describe this image.';
      const messages = createsImage ? undefined : [...(contextText || instructions ? [{ role: 'system', content: contextText + '\n' + instructions }] : []),
        ...history.slice(-6), { role: 'user', content: message }];
      appendMessage(view, 'user', text, { image: selectedImage?.preview });
      const reply = appendMessage(view, 'assistant', '', { targetName: target.name });
      view.prompt.value = ''; clearAttachment(); scrollTranscript();
      requestId = crypto.randomUUID(); view.status.textContent = target.local ? (createsImage ? 'Generating image…' : 'Generating…') : 'Waiting for peer…';
      try {
        const result = await runtime.generate(targetKey, { requestId, signal,
          ...(createsImage ? { prompt: text } : { messages, image: selectedImage?.image, maxNewTokens: 1024 }),
          onProgress(event) {
            if (alive() && createsImage && Number.isSafeInteger(event.step) && Number.isSafeInteger(event.steps)
                && event.step >= 0 && event.step <= event.steps && event.steps <= 100) {
              view.status.textContent = `Generating image: ${event.step}/${event.steps} steps…`;
            }
          },
          onToken(chunk) { if (alive() && !createsImage) { reply.textContent += chunk; scrollTranscript(); } } });
        if (signal.aborted) throw new DOMException('Generation cancelled', 'AbortError');
        if (createsImage) {
          if (!target.outputModalities?.includes('image')) throw new Error('This target did not advertise image output');
          await generatedImages.append(reply, result.image, { signal, prompt: text });
        } else {
          if (typeof result.text !== 'string') throw new Error('Model returned an invalid text response');
          reply.textContent = result.text;
          history.push({ role: 'user', content: message }, { role: 'assistant', content: result.text });
          while (history.length > 6 || encoder.encode(JSON.stringify(history)).byteLength > 24 * 1024) history.splice(0, 2);
          histories.delete(targetKey); histories.set(targetKey, history);
          if (histories.size > 8) histories.delete(histories.keys().next().value);
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
      } catch (error) { if (!reply.textContent) reply.textContent = error.name === 'AbortError' ? 'Cancelled.' : 'Request failed.'; throw error; }
      finally { requestId = null; scrollTranscript(); }
    });
  }
  view.send.onclick = () => { void send(); };
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
        view.status.textContent = `Cannot load ${startup.name}: ${sourceReason(startup)}`;
      } else void run(async (signal) => {
        progress({ stage: startup.manifestCid ? 'verify' : 'prepare' });
        const options = { signal, onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) };
        if (startup.manifestCid) await runtime.loadStoredModel(startup.manifestCid, options);
        else await runtime.acquireModel(startup.sourceKey, options);
        signal.throwIfAborted();
        histories.delete('local'); renderLists();
        view.status.textContent = `Loaded ${startup.name}. Send a message.`;
      }, { modelName: startup.name });
    }
  } catch (error) { showError(error); }
  refreshTimer = setInterval(() => { void refreshPeers(); }, Math.max(20, refreshIntervalMs));
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
      clearInterval(refreshTimer); operation?.abort('Chat closed'); imageController?.abort(); refreshController?.abort(); connectController?.abort(); storedController?.abort();
      invalidateActions(); await operationDone; await refreshPromise; await connectPromise; await storedPromise; await Promise.allSettled([...preferenceTasks]);
      await runtime.dispose(); disposed = true; histories.clear(); attachment = null; view.panel.remove(); onClose?.();
    })();
    try { await disposingPromise; } finally { disposingPromise = null; }
  }
  return { element: view.panel, runtime, dispose, refreshPeers };
}
