import './agentConsole.css';
import { buildAgentConsoleView } from './agentConsoleView.js';
import { readImageAttachment } from '../ui/imageAttachment.js';
import { createGeneratedImageRenderer } from '../ui/generatedImages.js';

const message = (error) => String(error?.message || error || 'Agent operation failed');
const activeStatuses = new Set(['queued', 'running', 'cancelling']);

/** UI only: the caller owns the persistent controller and its lifecycle. */
export function createAgentConsole({ container, controller, onBrowseModels } = {}) {
  if (!container || !controller) throw new TypeError('Agent Console needs a container and controller');
  const view = buildAgentConsoleView(container);
  let disposed = false, selectedId = null, head = null, heads = [], refreshGeneration = 0;
  let mutation = null, running = null, cancelling = false, editing = null, attachment = null, attachmentOperation = null;
  let returnFocus = null, refreshPending = false, refreshPromise = null;
  let disposal = null;
  const downloads = new Map();
  const images = createGeneratedImageRenderer(view.live);

  function status(text, error = false) { if (disposed) return; view.status.textContent = text; view.status.dataset.error = String(error); }
  function controls() {
    const busy = Boolean(mutation || running || cancelling || (selectedId && selectedId !== head?.agentId) || activeStatuses.has(head?.activity?.status));
    const exists = Boolean(head), paused = head?.status === 'paused';
    const recovery = Boolean(head?.activity?.unsaved || head?.recoveryRequired);
    for (const control of [view.create, view.restore, view.edit, view.remove, view.exportButton]) control.disabled = busy || (control !== view.create && control !== view.restore && !exists);
    view.restore.hidden = typeof controller.importAsNew !== 'function';
    view.exportButton.hidden = typeof controller.export !== 'function';
    view.pause.disabled = !exists || paused || Boolean(mutation) || cancelling;
    view.resume.disabled = !exists || (!paused && !recovery) || busy;
    view.cancel.disabled = !running || cancelling || Boolean(mutation);
    view.cancel.textContent = cancelling ? 'Cancelling…' : 'Cancel task';
    view.send.disabled = !exists || paused || recovery || busy || !view.prompt.value.trim() || Boolean(attachmentOperation);
    for (const control of [view.prompt, view.output, view.attach, view.clearImage]) control.disabled = !exists || busy || Boolean(attachmentOperation);
    view.attach.disabled ||= view.output.value === 'image';
    for (const control of [view.agentName, view.instructions, view.goals, view.summary, view.mode, view.save, view.cancelEdit]) control.disabled = Boolean(mutation);
    for (const button of view.list.querySelectorAll('button')) button.disabled = busy;
    view.browse.hidden = typeof onBrowseModels !== 'function'; view.browse.disabled = busy;
    view.element.setAttribute('aria-busy', String(Boolean(mutation || running || attachmentOperation)));
  }

  function showRoute(route) {
    if (!route) { view.routeText.textContent = 'No task has been routed.'; return; }
    // Plain text only; route diagnostics must never become executable markup.
    view.routeText.textContent = 'Baseline routing\n' + JSON.stringify(route, null, 2).slice(0, 12000);
  }

  function renderHeads() {
    view.list.replaceChildren();
    if (!heads.length) { const empty = document.createElement('p'); empty.className = 'pc-agent-note'; empty.textContent = 'No saved agents. Create one to keep its identity and context on this device.'; view.list.append(empty); }
    for (const item of heads) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.agentId = item.agentId;
      button.setAttribute('aria-current', String(item.agentId === selectedId));
      button.append(document.createTextNode(item.identity?.name || 'Unnamed agent'));
      const small = document.createElement('small'); small.textContent = item.activity?.status || item.status || 'Saved'; button.append(small);
      button.addEventListener('click', () => { if (running || mutation || cancelling) return; selectedId = item.agentId; clearAttachment(); view.prompt.value = ''; view.live.replaceChildren(); images.prune(); controls(); void refresh(); });
      view.list.append(button);
    }
  }

  function renderRecord(events) {
    view.name.textContent = head?.identity?.name || 'Create or select an agent';
    view.metadata.textContent = head ? `${head.activity?.status || head.status} · Saved revision ${head.revision} · ${new Date(head.updatedAt).toLocaleString()}` : '';
    if (head?.activity?.unsaved) view.metadata.textContent += ' · Unsaved outcome — resolve storage before more tasks';
    view.identity.textContent = head?.goals?.length ? head.goals.join(' · ') : '';
    view.policy.textContent = !head ? '' : head.policy?.inferenceMode === 'network-assisted'
      ? 'Peer inference allowed. Selected agent context and task inputs may be sent to the executing peer.'
      : 'Local only. Tasks use a ready model on this device; no peer fallback.';
    view.history.replaceChildren();
    for (const event of events) {
      const article = document.createElement('article');
      const label = document.createElement('strong'); label.textContent = event.type === 'request' ? 'You' : event.type === 'result' ? 'Agent' : event.type;
      const text = document.createElement('p'); text.textContent = event.text || '';
      article.append(label, text);
      if (event.imageAttachmentId || event.inputAttachmentId) { const note = document.createElement('p'); note.className = 'pc-agent-note'; note.textContent = 'Image attachment recorded. This history view shows text; image previews are not restored here.'; article.append(note); }
      view.history.append(article);
    }
    if (!events.length) view.history.textContent = 'No saved task history yet.';
    const latestRoute = [...events].reverse().find((event) => event.route)?.route;
    showRoute(head?.activity?.route || latestRoute);
    view.history.scrollTop = view.history.scrollHeight;
    renderHeads(); controls();
  }

  async function savedEvents(id, generation) {
    if (!controller.events) return [];
    const result = []; let after;
    // The store admits at most 256 events per agent, in pages of at most 100.
    for (let page = 0; page < 3; page++) {
      const items = await controller.events(id, { limit: 100, ...(after === undefined ? {} : { after }) });
      if (disposed || generation !== refreshGeneration) return [];
      result.push(...items);
      if (items.length < 100) break;
      const cursor = items.at(-1)?.sequence;
      if (!Number.isSafeInteger(cursor) || cursor === after) break;
      after = cursor;
    }
    return result;
  }

  async function refresh() {
    const generation = ++refreshGeneration;
    try {
      const records = await controller.list({ limit: 100 });
      if (disposed || generation !== refreshGeneration) return;
      heads = records;
      if (!heads.some((item) => item.agentId === selectedId)) selectedId = heads[0]?.agentId ?? null;
      const id = selectedId;
      const [record, events] = id ? await Promise.all([controller.get(id), savedEvents(id, generation)]) : [null, []];
      if (disposed || generation !== refreshGeneration || selectedId !== id) return;
      head = record; renderRecord(events);
    } catch (error) { if (!disposed && generation === refreshGeneration) status(`Could not read saved agents: ${message(error)}`, true); }
  }

  function scheduleRefresh() {
    refreshPending = true;
    if (refreshPromise) return;
    refreshPromise = (async () => {
      while (refreshPending && !disposed) { refreshPending = false; await refresh(); }
    })().finally(() => { refreshPromise = null; });
  }

  async function mutate(label, action, success) {
    if (mutation || running || disposed) return;
    status(label);
    mutation = Promise.resolve().then(action); controls();
    try { const result = await mutation; if (!disposed) { await success?.(result); status('Saved.'); await refresh(); } return result; }
    catch (error) { status(message(error), true); }
    finally { mutation = null; if (!disposed) controls(); }
  }

  function showEditor(record) {
    editing = record ? { id: record.agentId, revision: record.revision } : {};
    view.editorHeading.textContent = record ? 'Edit agent' : 'New general agent';
    view.agentName.value = record?.identity?.name || '';
    view.instructions.value = record?.identity?.instructions || '';
    view.goals.value = (record?.goals || []).join('\n');
    view.summary.value = record?.context?.summary || '';
    view.mode.value = record?.policy?.inferenceMode || 'local-only';
    view.main.hidden = true; view.editor.hidden = false; status(''); controls(); view.agentName.focus();
  }
  function hideEditor() { editing = null; view.main.hidden = false; view.editor.hidden = true; view.create.focus(); }
  function clearAttachment() { attachment = null; view.imageFile.value = ''; view.attachment.hidden = true; }

  async function runTask() {
    if (!head || head.agentId !== selectedId || running || mutation || cancelling || head.status === 'paused' || head.activity?.unsaved || head.recoveryRequired || activeStatuses.has(head.activity?.status) || !view.prompt.value.trim() || attachmentOperation) return;
    if (attachment && view.output.value === 'image') { status('Remove the attached image before generating an image from text.', true); return; }
    const id = selectedId, abort = new AbortController(), prompt = view.prompt.value.trim();
    const task = view.output.value === 'image' ? 'text-to-image' : attachment ? 'image-text-to-text' : 'text-generation';
    view.live.replaceChildren(); images.prune(); status('Routing one task…');
    const operation = { id, abort, promise: null }; running = operation; controls();
    operation.promise = (async () => {
      try {
        const outcome = await controller.run(id, { task, prompt, ...(attachment ? { image: attachment.image } : {}), signal: abort.signal });
        abort.signal.throwIfAborted();
        if (disposed) return;
        const result = outcome?.result || {};
        view.live.replaceChildren(); images.prune();
        const text = document.createElement('p'); text.textContent = result.text || (result.image ? 'Generated image' : 'Task complete.'); view.live.append(text);
        if (result.image) await images.append(text, result.image, { signal: abort.signal, prompt });
        showRoute(outcome?.route); view.prompt.value = ''; clearAttachment(); status('Task complete.');
      } catch (error) { status(error?.name === 'AbortError' ? 'Task cancelled.' : message(error), error?.name !== 'AbortError'); }
      finally { if (running === operation) running = null; if (!disposed) { await refresh(); controls(); } }
    })();
    await operation.promise;
  }

  async function stopTask(pause = false) {
    if (!head || cancelling || mutation) return;
    const id = selectedId, operation = running;
    cancelling = true; status(pause ? 'Pausing; waiting for task cleanup…' : 'Cancelling; waiting for task cleanup…'); controls();
    operation?.abort.abort();
    try {
      await (pause ? controller.pause(id) : controller.cancel(id));
      await operation?.promise;
      if (!disposed) { await refresh(); status(pause ? 'Paused. Resume allows new tasks but does not run them.' : 'Task cancelled.'); }
    } catch (error) { status(`Cleanup incomplete: ${message(error)}`, true); }
    finally { cancelling = false; if (!disposed) controls(); }
  }

  view.close.addEventListener('click', () => view.element.close());
  view.element.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus(); });
  view.element.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...view.element.querySelectorAll('button,input,textarea,select,[tabindex]')].filter((el) => !el.disabled && el.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  view.create.addEventListener('click', () => showEditor());
  view.edit.addEventListener('click', () => { if (head) showEditor(head); });
  view.cancelEdit.addEventListener('click', hideEditor);
  view.editor.addEventListener('submit', (event) => {
    event.preventDefault(); if (!editing || !view.agentName.value.trim()) return;
    const input = { name: view.agentName.value.trim(), instructions: view.instructions.value, goals: view.goals.value.split('\n').map((goal) => goal.trim()).filter(Boolean), summary: view.summary.value, inferenceMode: view.mode.value };
    const edit = editing;
    void mutate('Saving agent…', () => edit.id ? controller.update(edit.id, input, { expectedRevision: edit.revision }) : controller.create(input), (record) => { selectedId = record.agentId; hideEditor(); });
  });
  view.remove.addEventListener('click', () => { if (head) void mutate('Deleting agent…', () => controller.remove(head.agentId), () => { selectedId = null; head = null; clearAttachment(); view.live.replaceChildren(); images.prune(); }); });
  view.resume.addEventListener('click', () => { if (head) void mutate('Resuming agent…', () => controller.resume(head.agentId)); });
  view.pause.addEventListener('click', () => { void stopTask(true); });
  view.cancel.addEventListener('click', () => { void stopTask(); });
  view.composer.addEventListener('submit', (event) => { event.preventDefault(); void runTask(); });
  view.prompt.addEventListener('input', controls);
  view.prompt.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); void runTask(); } });
  view.output.addEventListener('change', controls);
  view.attach.addEventListener('click', () => view.imageFile.click());
  view.clearImage.addEventListener('click', () => { clearAttachment(); controls(); });
  view.imageFile.addEventListener('change', () => {
    const file = view.imageFile.files?.[0]; if (!file || running || mutation) return;
    attachmentOperation?.abort(); const abort = new AbortController(); attachmentOperation = abort; controls();
    void readImageAttachment(file, { signal: abort.signal }).then((value) => { if (disposed || abort.signal.aborted) return; attachment = value; view.attachmentName.textContent = value.name; view.attachment.hidden = false; status('Image attached for a vision task.'); })
      .catch((error) => { if (!abort.signal.aborted) status(message(error), true); })
      .finally(() => { if (attachmentOperation === abort) attachmentOperation = null; if (!disposed) controls(); });
  });
  view.browse.addEventListener('click', () => { view.element.close(); Promise.resolve().then(() => onBrowseModels?.()).catch((error) => status(message(error), true)); });
  view.exportButton.addEventListener('click', () => { if (!head) return; void mutate('Preparing export…', () => controller.export(head.agentId), (bundle) => {
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `agent-${selectedId}.json`; a.click();
    const timer = setTimeout(() => { URL.revokeObjectURL(url); downloads.delete(url); }, 1000); downloads.set(url, timer);
  }); });
  view.restore.addEventListener('click', () => view.restoreFile.click());
  view.restoreFile.addEventListener('change', () => { const file = view.restoreFile.files?.[0]; view.restoreFile.value = ''; if (!file) return;
    void mutate('Restoring as a new paused agent…', async () => { if (file.size > 12 * 1024 * 1024) throw new Error('Agent backup exceeds 12 MiB'); return controller.importAsNew(JSON.parse(await file.text())); }, (record) => { selectedId = record.agentId; });
  });
  const unsubscribe = controller.subscribe?.((event) => {
    if (disposed) return;
    if (event.type === 'token' && event.agentId === selectedId && running) { view.live.textContent += String(event.text || ''); return; }
    if (event.agentId === selectedId && running && !cancelling) {
      if (event.type === 'activity' && event.activity?.status === 'running') status('Running task…');
      if (event.type === 'activity' && event.activity?.status === 'queued') status('Waiting for an execution slot…');
      if (event.type === 'progress') {
        const progress = event.event || {};
        if (typeof progress.stage === 'string') status(`Running task · ${progress.stage.slice(0, 120)}`);
      }
    }
    if (event.type === 'changed' || event.type === 'activity' || event.type === 'removed') scheduleRefresh();
  });
  controls();
  return {
    element: view.element,
    async open() { if (disposed) throw new Error('Agent Console is closed'); returnFocus = document.activeElement; if (!view.element.open) view.element.showModal(); await refresh(); },
    dispose() {
      if (disposal) return disposal; disposed = true; ++refreshGeneration; refreshPending = false; unsubscribe?.(); attachmentOperation?.abort();
      view.element.close(); images.dispose(); for (const [url, timer] of downloads) { clearTimeout(timer); URL.revokeObjectURL(url); } downloads.clear();
      const operation = running; operation?.abort.abort();
      disposal = (async () => {
        try { await Promise.all([operation ? controller.cancel(operation.id) : null, operation?.promise, mutation, refreshPromise]); }
        finally { view.element.remove(); }
      })();
      return disposal;
    },
  };
}
