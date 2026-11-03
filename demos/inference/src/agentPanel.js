import { createInferenceRuntime, MODEL_CATALOG, STORAGE_QUOTAS } from './runtime.js';
import './panel.css';

const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

/** Explicit local-model controls, reusable by demos without loading weights on normal startup. */
export async function mountInferencePanel({ container = document.body, stateManager, computeManager,
  networkManager, getContext, actions, runtimeBaseUrl, onClose, autoConnect = false } = {}) {
  const panel = element('section', undefined, 'pc-inference-panel');
  panel.setAttribute('aria-label', 'PeerCompute local model console');
  const header = element('header');
  header.append(element('strong', 'PEERCOMPUTE // MODEL CONSOLE'));
  const close = element('button', 'Close');
  header.append(close); panel.append(header);
  const status = element('p', 'Opening local artifact storage…', 'pc-inference-status');
  status.setAttribute('role', 'status'); panel.append(status);
  const select = element('select'); select.setAttribute('aria-label', 'Approved model package');
  for (const entry of Object.values(MODEL_CATALOG)) {
    const option = element('option', `${entry.name} · ${(entry.totalBytes / 1024 ** 2).toFixed(0)} MiB${entry.capabilities?.browserInference === false ? ' · storage only' : ''}`);
    option.value = entry.id; select.append(option);
  }
  select.value = 'smolvlm-256m-q4';
  const acquire = element('button', 'Import pinned HF package');
  const row = element('div', undefined, 'pc-inference-row'); row.append(select, acquire); panel.append(row);
  const capability = element('p', '', 'pc-inference-note'); panel.append(capability);
  const quota = element('select'); quota.setAttribute('aria-label', 'Local artifact storage limit');
  for (const bytes of STORAGE_QUOTAS) { const option = element('option', `${bytes / 1024 ** 3} GiB local limit`); option.value = String(bytes); quota.append(option); }
  const quotaRow = element('div', undefined, 'pc-inference-row'); quotaRow.append(element('label', 'Local artifact storage '), quota); panel.append(quotaRow);
  const cid = element('input'); cid.placeholder = 'Model manifest CID'; cid.setAttribute('aria-label', 'Model manifest CID');
  const load = element('button', 'Load on this GPU');
  const fetchPeer = element('button', 'Fetch CID from peers'); fetchPeer.disabled = !networkManager;
  const unload = element('button', 'Unload');
  const publish = element('button', 'Host CID for peers'); publish.disabled = !networkManager;
  const withdraw = element('button', 'Withdraw CID'); withdraw.disabled = !networkManager;
  const cidRow = element('div', undefined, 'pc-inference-row'); cidRow.append(cid, load, fetchPeer, unload, publish, withdraw); panel.append(cidRow);
  const relay = element('input'); relay.placeholder = 'Relay multiaddress /dns4/…/tcp/…/wss/p2p/…';
  relay.setAttribute('aria-label', 'Artifact relay multiaddress');
  const connect = element('button', 'Connect artifact network');
  const networkRow = element('div', undefined, 'pc-inference-row'); networkRow.append(relay, connect);
  if (!networkManager) panel.append(networkRow);
  const fileLabel = element('label', 'Pin any file locally ');
  const file = element('input'); file.type = 'file'; fileLabel.append(file); panel.append(fileLabel);
  panel.append(element('p', 'Files stay in this browser’s IndexedDB. A loaded model runs locally. Peer serving requires an active artifact transport.', 'pc-inference-note'));
  const transcript = element('div', undefined, 'pc-inference-transcript');
  transcript.setAttribute('aria-live', 'polite'); panel.append(transcript);
  const prompt = element('textarea'); prompt.rows = 3; prompt.maxLength = 16000; prompt.placeholder = 'Ask the model about this scene…';
  prompt.setAttribute('aria-label', 'Message to the local model'); panel.append(prompt);
  const captureLabel = element('label', ' Include a scene image on the next request');
  const capture = element('input'); capture.type = 'checkbox'; captureLabel.prepend(capture); panel.append(captureLabel);
  const send = element('button', 'Send'); const cancel = element('button', 'Cancel');
  const controls = element('div', undefined, 'pc-inference-row'); controls.append(send, cancel); panel.append(controls);
  const proposed = element('div', undefined, 'pc-inference-actions'); panel.append(proposed);
  container.append(panel);
  let runtime;
  let requestId;
  let operation;
  let disposed = false;
  let disposingPromise;
  let operationDone;
  const history = [];
  const encoder = new TextEncoder();
  const invalidateActions = () => { actions?.invalidate?.(); proposed.replaceChildren(); };
  const trimTranscript = () => {
    while (transcript.children.length > 24 || encoder.encode(transcript.textContent).byteLength > 128 * 1024) {
      transcript.firstElementChild?.remove();
    }
  };
  const showError = (error) => { status.textContent = `${error.name === 'AbortError' ? 'Cancelled' : 'Error'}: ${error.message}`; };
  const progress = (event) => {
    if (event.stage === 'import') status.textContent = `Importing ${event.index + 1}/${event.total}: ${event.path}`;
    else if (event.type === 'model-load') status.textContent = `Loading model: ${event.status}${event.loaded ? ` (${Math.round(event.loaded / 1024 ** 2)} MiB)` : ''}`;
  };
  try {
    runtime = await createInferenceRuntime({ stateManager, computeManager, networkManager, runtimeBaseUrl });
    quota.value = String(runtime.store.maximumBytes);
    fetchPeer.disabled = publish.disabled = withdraw.disabled = !runtime.networkReady;
    if (networkManager && !runtime.networkReady) {
      relay.hidden = true; connect.textContent = 'Retry artifact network'; panel.append(networkRow);
    }
    status.textContent = runtime.networkError
      ? 'Local inference ready. Peer transport could not connect; retry when the relay is available.'
      : 'Ready. Import a pinned package or load a retained manifest CID.';
  } catch (error) { showError(error); panel.remove(); throw error; }

  async function run(action) {
    if (disposed || disposingPromise) return;
    if (operation) { status.textContent = 'Wait for the current operation or cancel it.'; return; }
    const controller = new AbortController(); operation = controller;
    operationDone = (async () => {
      try { await action(controller.signal); } catch (error) { showError(error); }
      finally { if (operation === controller) operation = null; trimTranscript(); }
    })();
    await operationDone;
  }
  const updateCapability = () => {
    const entry = MODEL_CATALOG[select.value];
    const canRun = entry.capabilities?.browserInference !== false;
    load.disabled = !canRun;
    capability.textContent = canRun ? 'Text and supported image requests run locally after loading.'
      : 'This GGUF package can be pinned and hosted. Local execution is unavailable in the current browser adapter. Import requires a larger storage limit and starts only when clicked.';
  };
  select.onchange = updateCapability; updateCapability();
  quota.onchange = () => {
    if (operation || disposingPromise) {
      quota.value = String(runtime.store.maximumBytes);
      status.textContent = 'Wait for the current operation before changing the storage limit.'; return;
    }
    try { runtime.setStorageQuota(Number(quota.value)); status.textContent = `Local artifact limit set to ${Number(quota.value) / 1024 ** 3} GiB.`; }
    catch (error) { quota.value = String(runtime.store.maximumBytes); showError(error); }
  };
  connect.onclick = () => run(async (signal) => {
    status.textContent = 'Connecting artifact network…';
    if (autoConnect && !relay.value.trim() && !runtime.networkManager) await runtime.connectBackend({ signal });
    else await runtime.connect(relay.value.trim(), { signal });
    fetchPeer.disabled = publish.disabled = withdraw.disabled = false;
    networkRow.remove(); status.textContent = 'Artifact network connected. Hosting requires Host CID.';
  });
  publish.onclick = () => run(async () => {
    await runtime.publish(cid.value.trim()); status.textContent = `Hosting pinned CID for peers: ${cid.value.trim()}`;
  });
  withdraw.onclick = () => run(async () => {
    await runtime.withdraw(cid.value.trim()); status.textContent = 'CID withdrawn; local files retained.';
  });
  acquire.onclick = () => run(async (signal) => {
    const record = await runtime.importCatalog(select.value, { signal, onProgress: progress });
    cid.value = record.cid; status.textContent = `Pinned package: ${record.cid}`;
  });
  load.onclick = () => run(async (signal) => {
    invalidateActions();
    const result = await runtime.load(cid.value.trim(), { signal, onProgress: progress });
    status.textContent = `Resident on worker ${result.workerId} · ${result.adapter.vendor} ${result.adapter.architecture}`;
    history.length = 0;
  });
  fetchPeer.onclick = () => run(async (signal) => {
    const result = await runtime.ensure(cid.value.trim(), { signal });
    status.textContent = `Verified peer package retained: ${result.cid}`;
  });
  unload.onclick = () => run(async () => {
    invalidateActions(); await runtime.service.unloadModel(); history.length = 0;
    status.textContent = 'Model unloaded; pinned files retained.';
  });
  file.onchange = () => run(async (signal) => {
    const selected = file.files[0]; if (!selected) return;
    const result = await runtime.store.importFile(selected.stream(), { expectedSize: selected.size, pin: true, signal });
    status.textContent = `Pinned ${selected.name}: ${result.cid}`;
    transcript.append(element('p', `${selected.name}\n${result.cid}`, 'pc-inference-note'));
  });
  cancel.onclick = () => {
    operation?.abort('User cancelled');
    if (requestId) void runtime.service.cancel(requestId).catch(showError);
  };
  send.onclick = () => run(async (signal) => {
    const text = prompt.value.trim(); if (!text) return;
    invalidateActions();
    const context = await getContext?.({ includeImage: capture.checked });
    const contextText = (typeof context === 'string' ? context : context?.text ?? '').slice(0, 16000);
    const instructions = String(actions?.instructions ?? '').slice(0, 8000);
    const messages = [
      ...(contextText || instructions ? [{ role: 'system', content: `${contextText}\n${instructions}` }] : []),
      ...history.slice(-6), { role: 'user', content: text },
    ];
    transcript.append(element('p', `YOU > ${text}`));
    const reply = element('p', 'MODEL > '); transcript.append(reply);
    proposed.replaceChildren();
    requestId = crypto.randomUUID();
    status.textContent = 'Generating locally…';
    try {
      const result = await runtime.service.generate({ requestId, messages, signal,
        image: capture.checked && typeof context === 'object' ? context.image : undefined,
        maxNewTokens: 128, onToken: (chunk) => { reply.textContent += chunk; trimTranscript(); } });
      reply.textContent = `MODEL > ${result.text}`;
      history.push({ role: 'user', content: text }, { role: 'assistant', content: result.text });
      if (history.length > 6) history.splice(0, history.length - 6);
      while (history.length && encoder.encode(JSON.stringify(history)).byteLength > 24 * 1024) history.splice(0, 2);
      status.textContent = `Complete · ${result.inputTokens} input / ${result.outputTokens} output tokens`;
      try {
        for (const proposal of (actions?.propose(result.text) ?? []).slice(0, 4)) {
          const button = element('button', `Apply: ${proposal.label}`);
          button.onclick = async () => {
            button.disabled = true;
            try { await proposal.apply(); status.textContent = 'Approved action applied.'; }
            catch (error) { showError(error); }
          };
          proposed.append(button);
        }
      } catch { /* Unstructured replies remain visible as text. */ }
    } finally { requestId = null; }
  });
  async function dispose() {
    if (disposed) return;
    if (disposingPromise) return disposingPromise;
    disposingPromise = (async () => {
      operation?.abort('Panel closed'); invalidateActions();
      await operationDone;
      await runtime.dispose();
      disposed = true; panel.remove(); onClose?.();
    })();
    try { await disposingPromise; } finally { disposingPromise = null; }
  }
  close.onclick = () => { void dispose().catch(showError); };
  if (autoConnect && !runtime.networkReady) {
    connect.textContent = 'Connect Secret Workshop';
    void run(async (signal) => {
      status.textContent = 'Connecting Secret Workshop artifact network…';
      try {
        await runtime.connectBackend({ signal });
        fetchPeer.disabled = publish.disabled = withdraw.disabled = false; networkRow.remove();
        status.textContent = 'Secret Workshop connected. Import or fetch a package; Host CID explicitly enables serving.';
      } catch (error) {
        if (!signal.aborted) status.textContent = `Local inference ready. Backend connection failed: ${error.message}`;
      }
    });
  }
  return { element: panel, runtime, dispose };
}
