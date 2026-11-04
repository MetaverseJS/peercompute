import { createInferenceRuntime, STORAGE_QUOTAS } from './runtime.js';
import { createPanelView, appendMessage } from './ui/panelView.js';
import { readImageAttachment } from './ui/imageAttachment.js';
import './panel.css';

/** Shared chat surface; the facade owns storage, inference and networking. */
export async function mountInferencePanel({ container = document.body, stateManager, computeManager,
  networkManager, getContext, actions, runtimeBaseUrl, onClose, autoConnect = false,
  runtimeFactory = createInferenceRuntime, refreshIntervalMs = 5000 } = {}) {
  const view = createPanelView(container, STORAGE_QUOTAS);
  const encoder = new TextEncoder(), histories = new Map(), preferenceTasks = new Set();
  let runtime, operation, operationDone, requestId, attachment, imageController, imageLoading = false;
  let disposed = false, closing = false, disposingPromise, refreshPromise, refreshController, connectController, connectPromise;
  let refreshTimer, sources = [], targets = [];
  const alive = () => !disposed && !closing;
  const selectedTarget = () => targets.find((target) => target.key === view.target.value);
  const invalidateActions = () => { actions?.invalidate?.(); view.proposed.replaceChildren(); };
  const showError = (error) => { if (alive()) view.status.textContent = (error.name === 'AbortError' ? 'Cancelled: ' : 'Error: ') + error.message; };
  const scrollTranscript = () => {
    while (view.transcript.children.length > 24 || encoder.encode(view.transcript.textContent).byteLength > 128 * 1024) view.transcript.firstElementChild?.remove();
    view.transcript.scrollTop = view.transcript.scrollHeight;
  };
  function updateControls() {
    const target = selectedTarget();
    view.acquire.disabled = !!operation || !sources.some((source) => source.key === view.source.value);
    view.source.disabled = !!operation;
    view.send.disabled = !!operation || imageLoading || !target?.available || (!view.prompt.value.trim() && !attachment);
    view.cancel.hidden = !operation; view.target.disabled = !!operation;
    view.attach.disabled = !!operation || !target?.modalities?.includes('image');
    view.unload.disabled = !!operation;
  }
  function renderLists() {
    const selectedSource = view.source.value, selected = view.target.value || 'local';
    const previousTarget = targets.find((entry) => entry.key === selected);
    const previousLabel = view.target.selectedOptions[0]?.textContent;
    sources = runtime.listModelSources(); targets = runtime.listInferenceTargets();
    view.source.replaceChildren();
    for (const source of sources) {
      const option = document.createElement('option'); option.value = source.key;
      option.textContent = String(source.name).slice(0, 140) + ' · ' + (source.source === 'hf' ? 'Hugging Face' : 'Peers');
      view.source.append(option);
    }
    if (sources.some((entry) => entry.key === selectedSource)) view.source.value = selectedSource;
    else {
      const preferred = sources.find((entry) => entry.modelId === 'smolvlm-256m-q4' && entry.source === 'hf');
      if (preferred) view.source.value = preferred.key;
    }
    view.target.replaceChildren();
    for (const target of targets) {
      const option = document.createElement('option'); option.value = target.key;
      option.textContent = (target.local ? 'Local · ' : 'Peers · ') + String(target.name).slice(0, 140)
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
  function clearAttachment() {
    attachment = null; view.attachment.hidden = true; view.attachmentImage.removeAttribute('src'); view.imageFile.value = ''; updateControls();
  }
  try {
    runtime = await runtimeFactory({ stateManager, computeManager, networkManager, runtimeBaseUrl });
    const preferences = runtime.getPreferences(); view.sharing.checked = preferences.sharing; view.hosting.checked = preferences.hostInference;
    view.quota.value = String(runtime.store.maximumBytes); renderLists(); view.status.textContent = 'Ready.';
  } catch (error) { view.panel.remove(); throw error; }

  view.configure.onclick = () => {
    view.configuration.hidden = !view.configuration.hidden;
    view.configure.setAttribute('aria-expanded', String(!view.configuration.hidden));
  };
  view.source.onchange = updateControls;
  view.target.onchange = () => { invalidateActions(); updateControls(); };
  view.prompt.oninput = updateControls;
  for (const [control, method] of [[view.sharing, 'setSharing'], [view.hosting, 'setHostInference']]) {
    control.onchange = () => {
      if (!alive()) return;
      const desired = control.checked; control.disabled = true;
      const task = (async () => {
        try { await runtime[method](desired); }
        catch (error) { control.checked = !desired; showError(error); }
        finally { if (alive()) control.disabled = false; }
      })();
      preferenceTasks.add(task); task.finally(() => preferenceTasks.delete(task));
    };
  }
  view.acquire.onclick = () => run(async (signal) => {
    invalidateActions(); view.status.textContent = 'Importing and loading model…';
    await runtime.acquireModel(view.source.value, { signal, onProgress: progress, ggufGpuLayers: Number(view.gpuLayers.value) });
    histories.delete('local'); renderLists(); view.target.value = 'local'; updateControls();
    view.status.textContent = 'Model ready. Send a message.';
  });
  view.unload.onclick = () => run(async () => {
    invalidateActions(); await runtime.unload(); histories.delete('local'); view.status.textContent = 'Local model unloaded.';
  });
  view.quota.onchange = () => {
    if (operation) { view.quota.value = String(runtime.store.maximumBytes); return; }
    try { runtime.setStorageQuota(Number(view.quota.value)); }
    catch (error) { view.quota.value = String(runtime.store.maximumBytes); showError(error); }
  };
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
      const text = view.prompt.value.trim(), selectedImage = attachment;
      if (selectedImage && !target.modalities?.includes('image')) throw new Error('This model accepts text only. Remove the image or choose an image model.');
      invalidateActions();
      const context = await getContext?.({ includeImage: false });
      const contextText = (typeof context === 'string' ? context : context?.text ?? '').slice(0, 16000);
      const instructions = String(actions?.instructions ?? '').slice(0, 8000);
      const history = histories.get(targetKey) ?? [], message = text || 'Describe this image.';
      const messages = [...(contextText || instructions ? [{ role: 'system', content: contextText + '\n' + instructions }] : []),
        ...history.slice(-6), { role: 'user', content: message }];
      appendMessage(view, 'user', text, { image: selectedImage?.preview });
      const reply = appendMessage(view, 'assistant', '', { targetName: target.name });
      view.prompt.value = ''; clearAttachment(); scrollTranscript();
      requestId = crypto.randomUUID(); view.status.textContent = target.local ? 'Generating…' : 'Waiting for peer…';
      try {
        const result = await runtime.generate(targetKey, { requestId, messages, signal, image: selectedImage?.image,
          maxNewTokens: 128, onToken(chunk) { if (alive()) { reply.textContent += chunk; scrollTranscript(); } } });
        reply.textContent = result.text;
        history.push({ role: 'user', content: message }, { role: 'assistant', content: result.text });
        while (history.length > 6 || encoder.encode(JSON.stringify(history)).byteLength > 24 * 1024) history.splice(0, 2);
        histories.delete(targetKey); histories.set(targetKey, history);
        if (histories.size > 8) histories.delete(histories.keys().next().value);
        view.status.textContent = 'Ready.';
        try {
          for (const proposal of (actions?.propose(result.text) ?? []).slice(0, 4)) {
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
    closing = true; view.panel.inert = true;
    disposingPromise = (async () => {
      clearInterval(refreshTimer); operation?.abort('Chat closed'); imageController?.abort(); refreshController?.abort(); connectController?.abort();
      invalidateActions(); await operationDone; await refreshPromise; await connectPromise; await Promise.allSettled([...preferenceTasks]);
      await runtime.dispose(); disposed = true; histories.clear(); attachment = null; view.panel.remove(); onClose?.();
    })();
    try { await disposingPromise; } finally { disposingPromise = null; }
  }
  return { element: view.panel, runtime, dispose, refreshPeers };
}
