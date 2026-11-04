import { createInferenceRuntime } from './runtime.js';
import { createPanelView, appendMessage, renderStoredModels, formatModelBytes } from './ui/panelView.js';
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
  let disposed = false, closing = false, disposingPromise, refreshPromise, refreshController, connectController, connectPromise;
  let storedPromise, storedController;
  let refreshTimer, sources = [], targets = [];
  let desiredSourceKey;
  const alive = () => !disposed && !closing;
  const sourceBlocked = (source) => ['checking', 'unavailable'].includes(source?.localAvailability?.status);
  const sourceReason = (source) => String(source?.localAvailability?.reason
    || (source?.localAvailability?.status === 'checking' ? 'Checking this device…' : 'Unavailable on this device.')).slice(0, 512);
  const selectedTarget = () => targets.find((target) => target.key === view.target.value);
  const invalidateActions = () => { actions?.invalidate?.(); view.proposed.replaceChildren(); };
  const showError = (error) => {
    if (!alive()) return;
    const message = (error.name === 'AbortError' ? 'Cancelled: ' : 'Error: ') + error.message;
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
        + (sourceBlocked(source) ? ' · ' + sourceReason(source) : '');
      option.disabled = sourceBlocked(source);
      view.source.append(option);
    }
    if (!matches.length) {
      const option = document.createElement('option'); option.value = ''; option.disabled = true;
      option.textContent = 'No matching models'; view.source.append(option); view.source.value = '';
    } else {
      view.source.value = matches.find((entry) => entry.key === desiredSourceKey)?.key
        ?? matches.find((entry) => entry.key === previous)?.key
        ?? matches.find((entry) => !sourceBlocked(entry))?.key ?? matches[0].key;
    }
    renderSourceStatus(matches); updateControls();
  }
  function renderSourceStatus(matches) {
    const selected = sources.find((entry) => entry.key === view.source.value);
    const blocked = matches.filter(sourceBlocked);
    const notices = [];
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
        if (alive()) { renderLists(); view.networkStatus.textContent = runtime.networkReady ? 'Peer network connected.' : 'Peer network is offline.'; }
      } catch (error) {
        if (alive() && !controller.signal.aborted) view.networkStatus.textContent = 'Peer refresh unavailable: ' + error.message;
      } finally { refreshPromise = null; refreshController = null; }
    })();
    return refreshPromise;
  }
  const progress = (event) => {
    if (!alive()) return;
    if (event.stage === 'import') view.status.textContent = 'Importing ' + (event.index + 1) + '/' + event.total + ': ' + event.path;
    else if (event.type === 'model-load') view.status.textContent = 'Loading model: ' + event.status;
  };
  async function run(action) {
    if (!alive() || operation) return;
    const controller = new AbortController(); operation = controller; updateControls();
    operationDone = (async () => {
      try { await action(controller.signal); } catch (error) { showError(error); }
      finally { if (operation === controller) operation = null; if (alive()) { renderLists(); scrollTranscript(); } }
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
    view.storedModels.close(); view.configurationStatus.textContent = ''; view.configuration.showModal();
  };
  view.stored.onclick = () => {
    if (!alive()) return;
    view.configuration.close(); view.storedModels.showModal(); void refreshStoredModels();
  };
  view.storedRefresh.onclick = () => { void refreshStoredModels(); };
  view.sourceFilter.oninput = renderSources;
  view.source.onchange = () => { desiredSourceKey = view.source.value; renderSources(); };
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
    if (!selected || sourceBlocked(selected)) { renderSources(); return; }
    return run(async (signal) => {
    invalidateActions(); view.status.textContent = 'Importing and loading model…';
    await runtime.acquireModel(key, { signal, onProgress: progress, ggufGpuLayers: Number(view.gpuLayers.value) });
    histories.delete('local'); renderLists(); view.target.value = 'local'; updateControls();
    view.status.textContent = runtime.getSharingErrors?.().length
      ? 'Model ready. Sharing is unavailable for some stored models; see Stored Models.' : 'Model ready. Send a message.';
    });
  };
  view.unload.onclick = () => run(async () => {
    invalidateActions(); await runtime.unload(); histories.delete('local'); view.status.textContent = 'Local model unloaded.';
    view.configurationStatus.textContent = view.status.textContent;
  });
  view.connect.onclick = () => run(async (signal) => {
    if (view.relay.value.trim()) await runtime.connect(view.relay.value.trim(), { signal });
    else await runtime.connectBackend({ signal });
    view.networkStatus.textContent = 'Peer network connected.'; await refreshPeers();
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
          ...(createsImage ? { prompt: text } : { messages, image: selectedImage?.image, maxNewTokens: 128 }),
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
    connectController = new AbortController();
    connectPromise = runtime.connectBackend({ signal: connectController.signal }).then(() => refreshPeers()).catch((error) => {
      if (alive() && !connectController.signal.aborted) view.networkStatus.textContent = 'Peer network unavailable: ' + error.message;
    });
  } else void refreshPeers();
  async function dispose() {
    if (disposed) return;
    if (disposingPromise) return disposingPromise;
    closing = true; generatedImages.dispose(); view.storedModels.close(); view.configuration.close(); view.panel.inert = true;
    disposingPromise = (async () => {
      clearInterval(refreshTimer); operation?.abort('Chat closed'); imageController?.abort(); refreshController?.abort(); connectController?.abort(); storedController?.abort();
      invalidateActions(); await operationDone; await refreshPromise; await connectPromise; await storedPromise; await Promise.allSettled([...preferenceTasks]);
      await runtime.dispose(); disposed = true; histories.clear(); attachment = null; view.panel.remove(); onClose?.();
    })();
    try { await disposingPromise; } finally { disposingPromise = null; }
  }
  return { element: view.panel, runtime, dispose, refreshPeers };
}
