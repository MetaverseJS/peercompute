import './agentConsole.css';
import { buildAgentConsoleView } from './agentConsoleView.js';

const message = (error) => String(error?.message || error || 'Agent operation failed');
const activeStatuses = new Set(['queued', 'running', 'cancelling']);

/** Identity management only. The caller owns conversations and controller lifetime. */
export function createAgentConsole({ container, controller, onChat } = {}) {
  if (!container || !controller) throw new TypeError('Agent Console needs a container and controller');
  const view = buildAgentConsoleView(container);
  let disposed = false, selectedId = null, head = null, heads = [], refreshGeneration = 0;
  let mutation = null, handoff = null, editing = null, returnFocus = null, restoreFocus = true;
  let refreshPending = false, refreshPromise = null, disposal = null;
  const downloads = new Map();
  const busy = () => Boolean(mutation || handoff || (selectedId && selectedId !== head?.agentId) || activeStatuses.has(head?.activity?.status));
  function status(text, error = false) { if (disposed) return; view.status.textContent = text; view.status.dataset.error = String(error); }
  function controls() {
    const blocked = busy(), exists = Boolean(head), paused = head?.status === 'paused';
    const recovery = Boolean(head?.activity?.unsaved || head?.recoveryRequired);
    for (const control of [view.create, view.restore, view.edit, view.remove, view.exportButton]) {
      control.disabled = blocked || (control !== view.create && control !== view.restore && !exists);
    }
    view.restore.hidden = typeof controller.importAsNew !== 'function';
    view.exportButton.hidden = typeof controller.export !== 'function';
    view.chat.hidden = typeof onChat !== 'function'; view.chat.disabled = !exists || blocked;
    view.pause.disabled = !exists || paused || Boolean(mutation || handoff);
    view.resume.disabled = !exists || (!paused && !recovery) || blocked;
    for (const control of [view.agentName, view.instructions, view.goals, view.summary, view.mode, view.save, view.cancelEdit]) control.disabled = Boolean(mutation || handoff);
    for (const button of view.list.querySelectorAll('button')) button.disabled = blocked;
    view.element.setAttribute('aria-busy', String(Boolean(mutation || handoff)));
  }
  function renderHeads() {
    view.list.replaceChildren();
    if (!heads.length) {
      const empty = document.createElement('p'); empty.className = 'pc-agent-note';
      empty.textContent = 'No saved agents. Create one to keep its identity and context on this device.'; view.list.append(empty);
    }
    for (const item of heads) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.agentId = item.agentId;
      button.setAttribute('aria-current', String(item.agentId === selectedId));
      button.append(document.createTextNode(item.identity?.name || 'Unnamed agent'));
      const small = document.createElement('small'); small.textContent = item.activity?.status || item.status || 'Saved'; button.append(small);
      button.addEventListener('click', () => { if (busy() || disposed) return; selectedId = item.agentId; controls(); void refresh(); });
      view.list.append(button);
    }
  }
  function renderRecord() {
    view.name.textContent = head?.identity?.name || 'Create or select an agent';
    view.metadata.textContent = head ? `${head.activity?.status || head.status} · Saved revision ${head.revision} · ${new Date(head.updatedAt).toLocaleString()}` : '';
    if (head?.activity?.unsaved) view.metadata.textContent += ' · Unsaved outcome — resolve storage before more messages';
    if (head?.recoveryRequired) view.metadata.textContent += ' · Interrupted outcome — Resume acknowledges it without replay';
    view.instructionsText.textContent = head?.identity?.instructions || 'No instructions saved.';
    view.identity.textContent = head?.goals?.join('\n') || 'No goals saved.';
    view.summaryText.textContent = head?.context?.summary || 'No memory summary saved.';
    view.policy.textContent = !head ? '' : head.policy?.inferenceMode === 'network-assisted'
      ? 'Mixed · local first, then peers. Selected agent context and message inputs may be sent to the executing peer.'
      : 'Local only. Tasks use a ready model on this device; no peer fallback.';
    renderHeads(); controls();
  }
  async function refresh() {
    const generation = ++refreshGeneration;
    try {
      const records = await controller.list({ limit: 100 });
      if (disposed || generation !== refreshGeneration) return;
      heads = records;
      if (!heads.some((item) => item.agentId === selectedId)) selectedId = heads[0]?.agentId ?? null;
      const id = selectedId, record = id ? await controller.get(id) : null;
      if (disposed || generation !== refreshGeneration || selectedId !== id) return;
      head = record; renderRecord(); return true;
    } catch (error) { if (!disposed && generation === refreshGeneration) status(`Could not read saved agents: ${message(error)}`, true); return false; }
  }
  function scheduleRefresh() {
    refreshPending = true;
    if (refreshPromise) return;
    refreshPromise = (async () => {
      while (refreshPending && !disposed) { refreshPending = false; await refresh(); }
    })().finally(() => { refreshPromise = null; });
  }
  async function mutate(label, action, success, done = 'Saved.', failurePrefix = '') {
    if (mutation || handoff || disposed) return;
    status(label);
    const pending = Promise.resolve().then(async () => {
      try {
        const result = await action();
        if (!disposed) { await success?.(result); if (await refresh()) status(done); }
        return result;
      } catch (error) { status(failurePrefix + message(error), true); }
    });
    mutation = pending; controls();
    try { return await pending; } finally { if (mutation === pending) mutation = null; if (!disposed) controls(); }
  }
  function showEditor(record) {
    if (busy() || disposed) return;
    editing = record ? { id: record.agentId, revision: record.revision } : {};
    view.editorHeading.textContent = record ? 'Edit agent' : 'New general agent';
    view.agentName.value = record?.identity?.name || '';
    view.instructions.value = record?.identity?.instructions || '';
    view.goals.value = (record?.goals || []).join('\n'); view.summary.value = record?.context?.summary || '';
    view.mode.value = record?.policy?.inferenceMode || 'network-assisted';
    view.main.hidden = true; view.editor.hidden = false; status(''); controls(); view.agentName.focus();
  }
  function hideEditor() { editing = null; view.main.hidden = false; view.editor.hidden = true; view.create.focus(); }

  view.close.addEventListener('click', () => view.element.close());
  view.element.addEventListener('close', () => { if (!disposed && !view.element.open && restoreFocus && returnFocus?.isConnected) returnFocus.focus(); });
  view.element.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...view.element.querySelectorAll('button,input,textarea,select,[tabindex]')].filter((el) => !el.disabled && el.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  view.chat.addEventListener('click', () => {
    if (!head || busy() || disposed || typeof onChat !== 'function') return;
    const id = head.agentId; status('Opening conversation…');
    const pending = Promise.resolve().then(() => onChat(id)); handoff = pending; controls();
    void pending.then(() => { if (!disposed) { restoreFocus = false; view.element.close(); } }, (error) => status(`Could not open chat: ${message(error)}`, true))
      .finally(() => { if (handoff === pending) handoff = null; if (!disposed) controls(); });
  });
  view.create.addEventListener('click', () => showEditor());
  view.edit.addEventListener('click', () => { if (head) showEditor(head); });
  view.cancelEdit.addEventListener('click', hideEditor);
  view.editor.addEventListener('submit', (event) => {
    event.preventDefault(); if (!editing || !view.agentName.value.trim()) return;
    const input = { name: view.agentName.value.trim(), instructions: view.instructions.value,
      goals: view.goals.value.split('\n').map((goal) => goal.trim()).filter(Boolean), summary: view.summary.value, inferenceMode: view.mode.value };
    const edit = editing;
    void mutate('Saving agent…', () => edit.id ? controller.update(edit.id, input, { expectedRevision: edit.revision }) : controller.create(input),
      (record) => { selectedId = record.agentId; hideEditor(); });
  });
  view.remove.addEventListener('click', () => { if (head && !busy()) { const id = head.agentId;
    void mutate('Deleting agent…', () => controller.remove(id), () => { selectedId = null; head = null; }); } });
  view.resume.addEventListener('click', () => { if (head && !view.resume.disabled) { const id = head.agentId;
    void mutate('Resuming agent…', () => controller.resume(id), null, 'Resumed. Send a message in the main chat when ready.'); } });
  view.pause.addEventListener('click', () => { if (head && !view.pause.disabled) { const id = head.agentId;
    void mutate('Pausing; waiting for task cleanup…', () => controller.pause(id), null,
      'Paused. Resume allows new messages but does not run them.', 'Cleanup incomplete: '); } });
  view.exportButton.addEventListener('click', () => { if (!head || busy()) return; const id = head.agentId;
    void mutate('Preparing export…', () => controller.export(id), (bundle) => {
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `agent-${id}.json`; anchor.click();
      const timer = setTimeout(() => { URL.revokeObjectURL(url); downloads.delete(url); }, 1000); downloads.set(url, timer);
    });
  });
  view.restore.addEventListener('click', () => view.restoreFile.click());
  view.restoreFile.addEventListener('change', () => { const file = view.restoreFile.files?.[0]; view.restoreFile.value = ''; if (!file || busy()) return;
    void mutate('Restoring as a new paused agent…', async () => {
      if (file.size > 12 * 1024 * 1024) throw new Error('Agent backup exceeds 12 MiB');
      return controller.importAsNew(JSON.parse(await file.text()));
    }, (record) => { selectedId = record.agentId; });
  });
  const unsubscribe = controller.subscribe?.((event) => {
    if (!disposed && ['changed', 'activity', 'removed'].includes(event.type)) scheduleRefresh();
  });
  controls();
  return {
    element: view.element,
    async open(options = {}) {
      if (disposed) throw new Error('Agent Console is closed');
      if (options.selectedId !== undefined && !mutation && !handoff) selectedId = options.selectedId;
      returnFocus = document.activeElement; restoreFocus = true;
      if (!view.element.open) view.element.showModal(); await refresh();
    },
    dispose() {
      if (disposal) return disposal;
      disposed = true; ++refreshGeneration; refreshPending = false; unsubscribe?.(); view.element.close();
      for (const [url, timer] of downloads) { clearTimeout(timer); URL.revokeObjectURL(url); } downloads.clear();
      // Never cancel or dispose the caller's conversation/controller.
      disposal = Promise.allSettled([mutation, handoff, refreshPromise]).then(() => { view.element.remove(); });
      return disposal;
    },
  };
}
