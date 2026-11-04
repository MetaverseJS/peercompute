import { createInferenceRuntime } from './runtime.js';
import { createPanelView, appendMessage, renderStoredModels, formatModelBytes, renderModelCompatibilityHelp } from './ui/panelView.js';
import { buildModelCompatibilityHelp, detectModelHelpEnvironment } from './ui/modelCompatibilityHelp.js';
import { readImageAttachment } from './ui/imageAttachment.js';
import { createGeneratedImageRenderer } from './ui/generatedImages.js';
import './panel.css';

/** Shared chat surface; the facade owns storage, inference and networking. */
export async function mountInferencePanel({ container = document.body, stateManager, computeManager,
  networkManager, getContext, actions, runtimeBaseUrl, onClose, autoConnect = false,
  runtimeFactory = createInferenceRuntime, refreshIntervalMs = 5000 } = {}) {
  const view = createPanelView(container);
  const generatedImages = createGeneratedImageRenderer(view.transcript);
  const encoder = new TextEncoder(), histories = new Map(), preferenceTasks = new Set();
  let runtime, operation, operationDone, requestId, attachment, imageController, imageLoading = false;
  let disposed = false, closing = false, disposingPromise, refreshPromise, refreshController, connectController, connectPromise, connectionFailure;
  let storedPromise, storedController;
  let refreshTimer, sources = [], targets = [];
  let desiredSourceKey;
  let helpSource, helpVersion = 0;
  let progressTimer, progressLabel, progressKey, progressStarted;
  const alive = () => !disposed && !closing;
  const sourceBlocked = (source) => ['checking', 'unavailable'].includes(source?.localAvailability?.status);
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
    const source = sources.find((entry) => entry.key === view.source.value);
    view.prompt.placeholder = target?.task === 'text-to-image' ? 'Describe an image…' : 'Message…';
    view.acquire.disabled = !!operation || !source || sourceBlocked(source);
    view.source.disabled = !!operation; view.sourceFilter.disabled = !!operation;
    view.cpuBudget.disabled = view.gpuBudget.disabled = !!operation || !runtime?.setMemoryBudgets;
    view.send.disabled = !!operation || imageLoading || !target?.available || (!view.prompt.value.trim() && !attachment);
    view.cancel.hidden = !operation; view.target.disabled = !!operation;
    view.attach.disabled = !!operation || !target?.modalities?.includes('image');
    view.unload.disabled = !!operation;
    view.clearChat.disabled = !!operation;
    view.storedRefresh.disabled = !!operation || !!storedController;
    for (const button of view.storedList.querySelectorAll('button')) button.disabled = !!operation || !!storedController;
  }
  function renderSources() {
    const previous = view.source.value;
    const terms = view.sourceFilter.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = sources.filter((source) => {
      const text = [source.name, source.modelId, source.task, source.runtime, source.source,
        source.source === 'hf' ? 'Hugging Face' : 'Peers', source.task === 'text-to-image' ? 'Image generation' : ''].join(' ').toLowerCase();
      return terms.every((term) => text.includes(term));
    });
    if (!desiredSourceKey) desiredSourceKey = sources.find((entry) => entry.modelId === 'smolvlm-256m-q4' && entry.source === 'hf')?.key
      ?? sources.find((entry) => !sourceBlocked(entry))?.key ?? sources[0]?.key;
    view.source.replaceChildren();
    for (const source of matches) {
      const option = document.createElement('option'); option.value = source.key;
      option.textContent = String(source.name).slice(0, 140) + (source.task === 'text-to-image' ? ' · Image generation' : '')
        + ' · ' + (source.source === 'hf' ? 'Hugging Face' : 'Peers')
        + ' · ' + memoryEstimate(source)
        + (sourceBlocked(source) ? ' · Setup required — select for help' : '');
      // A disabled native option cannot receive clicks or keyboard activation.
      // These choices open setup help; import admission remains independently blocked.
      option.dataset.unavailable = String(sourceBlocked(source));
      view.source.append(option);
    }
    if (!matches.length) {
      const option = document.createElement('option'); option.value = ''; option.disabled = true;
      option.textContent = 'No matching models'; view.source.append(option); view.source.value = '';
    } else {
      const preferred = matches.find((entry) => entry.key === desiredSourceKey)
        ?? matches.find((entry) => entry.key === previous)
        ?? matches.find((entry) => !sourceBlocked(entry)) ?? matches[0];
      if (sourceBlocked(preferred)) {
        const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.disabled = true;
        placeholder.textContent = 'Choose a model — select unavailable models for help'; view.source.prepend(placeholder);
        view.source.value = '';
      } else view.source.value = preferred.key;
    }
    renderSourceStatus(matches); updateControls();
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
    helpSource = source;
    const environment = detectModelHelpEnvironment();
    view.helpBrowser.value = environment.browser; view.helpOs.value = environment.os;
    renderHelp(); view.configuration.close(); view.storedModels.close();
    if (!view.compatibility.open) view.compatibility.showModal();
  }
  function renderSourceStatus(matches) {
    const selected = sources.find((entry) => entry.key === view.source.value);
    const blocked = matches.filter(sourceBlocked);
    const notices = selected ? [memoryEstimate(selected) + '. Planning estimates; actual memory use varies.'] : [];
    if (!matches.length) notices.push('No matching models. Clear or change the filter.');
    else if (selected?.localAvailability?.reason && !sourceBlocked(selected)) notices.push(String(selected.localAvailability.reason).slice(0, 512));
    if (blocked.length) {
      const groups = new Map();
      for (const entry of blocked) {
        const reason = sourceReason(entry); const names = groups.get(reason) ?? [];
        names.push(String(entry.name).slice(0, 140)); groups.set(reason, names);
      }
      notices.push([...groups].map(([reason, names]) => `${names.join(', ')}: ${reason}`).join(' '));
    }
    view.sourceStatus.textContent = notices.join(' ');
    view.sourceStatus.hidden = !notices.length;
  }
  function renderLists() {
    const selected = view.target.value || 'local';
    const previousTarget = targets.find((entry) => entry.key === selected);
    const previousLabel = view.target.selectedOptions[0]?.textContent;
    sources = runtime.listModelSources(); targets = runtime.listInferenceTargets();
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
      view.configurationStatus.textContent = 'Memory budgets updated for future imports.';
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
          const pickerOpen = CSS.supports('selector(:open)') && (view.source.matches(':open') || view.target.matches(':open'));
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
      prepare: 'Preparing model import…', verify: 'Verifying stored model files…',
      'download-peers': 'Fetching and verifying model files from peers…',
      unload: 'Releasing the previous model…', load: 'Loading model into RAM and GPU memory…',
    }[event.stage];
    if (!label) return;
    const key = `${event.type ?? ''}:${event.stage ?? event.status ?? ''}:${event.path ?? event.file ?? ''}`;
    if (key !== progressKey) { progressKey = key; progressStarted = performance.now(); }
    progressLabel = String(label).slice(0, 512); view.status.textContent = progressLabel;
    if (!progressTimer) progressTimer = setInterval(() => {
      if (alive() && operation && !operation.signal.aborted) {
        view.status.textContent = `${progressLabel} (${Math.floor((performance.now() - progressStarted) / 1000)}s)`;
      }
    }, 1000);
  };
  async function run(action) {
    if (!alive() || operation) return;
    const controller = new AbortController(); operation = controller; updateControls();
    operationDone = (async () => {
      try { await action(controller.signal); } catch (error) { showError(error); }
      finally {
        clearInterval(progressTimer); progressTimer = null; progressKey = null;
        if (operation === controller) operation = null; if (alive()) { renderLists(); scrollTranscript(); }
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
          renderStoredModels(view, models, deleteStoredModel);
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
  function clearAttachment() {
    attachment = null; view.attachment.hidden = true; view.attachmentImage.removeAttribute('src'); view.imageFile.value = ''; updateControls();
  }
  try {
    runtime = await runtimeFactory({ stateManager, computeManager, networkManager, runtimeBaseUrl });
    const preferences = runtime.getPreferences(); view.sharing.checked = preferences.sharing; view.hosting.checked = preferences.hostInference;
    syncMemoryBudgets();
    renderLists(); view.status.textContent = 'Ready.';
  } catch (error) { view.panel.remove(); throw error; }

  view.configure.onclick = () => {
    if (!alive()) return;
    view.compatibility.close(); view.storedModels.close(); view.configurationStatus.textContent = ''; view.configuration.showModal();
  };
  view.stored.onclick = () => {
    if (!alive()) return;
    view.compatibility.close(); view.configuration.close(); view.storedModels.showModal(); void refreshStoredModels();
  };
  view.storedRefresh.onclick = () => { void refreshStoredModels(); };
  view.sourceFilter.oninput = renderSources;
  view.source.onchange = () => {
    if (!alive() || operation) return;
    const key = view.source.value;
    sources = runtime.listModelSources();
    const selected = sources.find((entry) => entry.key === key);
    if (selected && sourceBlocked(selected)) { renderSources(); showCompatibilityHelp(selected); }
    else { desiredSourceKey = key; renderSources(); }
  };
  view.helpBrowser.onchange = view.helpOs.onchange = renderHelp;
  view.helpConfig.onclick = () => view.configure.click();
  view.compatibility.addEventListener('close', () => {
    helpVersion++;
    if (alive() && !view.configuration.open && !view.storedModels.open) view.source.focus();
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
  view.acquire.onclick = () => {
    if (!alive() || operation) return;
    const key = view.source.value;
    sources = runtime.listModelSources();
    const selected = sources.find((entry) => entry.key === key);
    if (!selected || sourceBlocked(selected)) {
      renderSources();
      if (selected) showCompatibilityHelp(selected);
      return;
    }
    return run(async (signal) => {
    invalidateActions(); progress({ stage: 'prepare' });
    await runtime.acquireModel(key, { signal, onProgress: (event) => { if (!signal.aborted) progress(event); }, ggufGpuLayers: Number(view.gpuLayers.value) });
    histories.delete('local'); renderLists(); view.target.value = 'local'; updateControls();
    view.status.textContent = runtime.getSharingErrors?.().length
      ? 'Model ready. Sharing is unavailable for some stored models; see Stored Models.' : 'Model ready. Send a message.';
    });
  };
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
    operation?.abort('User cancelled');
    if (requestId) void runtime.cancel(requestId).catch(showError);
  };
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
    closing = true; generatedImages.dispose(); view.compatibility.close(); view.storedModels.close(); view.configuration.close(); view.panel.inert = true;
    disposingPromise = (async () => {
      clearInterval(refreshTimer); operation?.abort('Chat closed'); imageController?.abort(); refreshController?.abort(); connectController?.abort(); storedController?.abort();
      invalidateActions(); await operationDone; await refreshPromise; await connectPromise; await storedPromise; await Promise.allSettled([...preferenceTasks]);
      await runtime.dispose(); disposed = true; histories.clear(); attachment = null; view.panel.remove(); onClose?.();
    })();
    try { await disposingPromise; } finally { disposingPromise = null; }
  }
  return { element: view.panel, runtime, dispose, refreshPeers };
}
