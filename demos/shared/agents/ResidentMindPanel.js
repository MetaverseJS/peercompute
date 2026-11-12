import './ResidentMindPanel.css';

const encoder = new TextEncoder();
const sourceNames = { 'verified-action': 'Verified world action', 'authenticated-message': 'Conversation message',
  'local-observation': 'World observation', 'shared-memory': 'Shared memory' };
const text = value => typeof value === 'string' ? value : '';
const date = value => Number.isSafeInteger(value) && value >= 0 ? new Date(value).toLocaleString() : 'Unknown';
const errorText = error => text(error?.message).slice(0, 600) || 'The request could not be completed.';
function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function button(label, callback) {
  const node = element('button', '', label); node.type = 'button'; node.addEventListener('click', callback); return node;
}
function validText(value, maximum, required = false) {
  return (!required || Boolean(value.trim())) && !value.includes('\0') && encoder.encode(value).length <= maximum
    && new TextDecoder().decode(encoder.encode(value)) === value;
}

/** Owner-local presentation only. The host authorizes reads/writes, checks the
 * revision, and supplies fresh/stale/unverified status; this panel never infers
 * that a remembered person is still at their last observed position. */
export function createResidentMindPanel({ onList, onCorrect, onForget, container = document.body } = {}) {
  if (typeof onList !== 'function') throw new TypeError('Resident Mind requires an onList callback');
  const dialog = element('dialog', 'pc-resident-mind');
  dialog.setAttribute('aria-label', 'Resident Mind');
  const header = element('header', 'pc-resident-mind__header');
  const title = element('h2', '', 'Mind');
  const done = button('Done', () => close());
  header.append(title, done);
  const body = element('div', 'pc-resident-mind__body');
  const introduction = element('p', 'pc-resident-mind__help', 'Remembered people and places. Observations describe the past; they do not establish where someone is now.');
  const toolbar = element('div', 'pc-resident-mind__toolbar');
  const filterLabel = element('label', '', 'Show ');
  const filter = element('select'); filter.setAttribute('aria-label', 'Knowledge category');
  for (const [value, label] of [['all', 'All knowledge'], ['place', 'Places'], ['person', 'People']]) {
    const option = element('option', '', label); option.value = value; filter.append(option);
  }
  filterLabel.append(filter);
  const refresh = button('Refresh', () => { if (!busy && active()) void read(); });
  toolbar.append(filterLabel, refresh);
  const status = element('p', 'pc-resident-mind__status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const list = element('div', 'pc-resident-mind__list'); list.setAttribute('aria-label', 'Remembered knowledge');
  body.append(introduction, toolbar, status, list); dialog.append(header, body); container.append(dialog);
  let key = '', records = [], epoch = 0, controller = null, disposed = false, busy = false, focusTarget = null;
  const drafts = new Map();
  const active = () => !disposed && Boolean(key) && dialog.open && !controller?.signal.aborted;
  const current = token => active() && token === epoch;
  const setStatus = (message, failed = false) => { status.textContent = message; status.dataset.error = String(failed); };
  function lock(value) {
    busy = value; refresh.disabled = value; filter.disabled = value;
    list.setAttribute('aria-busy', String(value));
    for (const control of list.querySelectorAll('button,input,textarea')) control.disabled = value || control.dataset.invalid === 'true';
  }
  function stop(restore = true) {
    epoch += 1; controller?.abort(); controller = null; key = ''; busy = false; records = []; drafts.clear();
    list.replaceChildren(); setStatus('');
    const target = focusTarget; focusTarget = null;
    if (restore && target?.isConnected && typeof target.focus === 'function') target.focus();
  }
  function close() {
    if (disposed) return;
    const target = focusTarget;
    stop(false); if (dialog.open) dialog.close();
    if (target?.isConnected && typeof target.focus === 'function') target.focus();
  }
  async function read(prefix = '') {
    if (!active() || busy) return;
    const token = epoch, requestKey = key, signal = controller.signal;
    lock(true); setStatus(prefix ? `${prefix} Refreshing…` : 'Reading remembered knowledge…');
    try {
      const result = await onList({ key: requestKey, signal });
      if (!current(token)) return;
      if (!Array.isArray(result) || result.length > 256 || result.some(record => !record || !['place', 'person'].includes(record.kind)
          || !text(record.id) || !Number.isSafeInteger(record.revision) || record.revision < 1)) {
        throw new TypeError('The knowledge list could not be read.');
      }
      records = result;
      for (const id of drafts.keys()) if (!records.some(record => record.id === id)) drafts.delete(id);
      render(); setStatus(prefix || '');
    } catch (error) {
      if (current(token)) setStatus(`${prefix ? `${prefix} ` : ''}Could not refresh: ${errorText(error)}`, true);
    } finally { if (current(token)) lock(false); }
  }
  async function mutate(record, kind, patch) {
    const callback = kind === 'correct' ? onCorrect : onForget;
    if (!active() || busy || typeof callback !== 'function' || drafts.get(record.id)?.record !== record
        || !records.some(item => item.id === record.id)) return;
    const token = epoch, requestKey = key, signal = controller.signal;
    lock(true); setStatus(kind === 'correct' ? 'Saving correction…' : 'Forgetting entry…');
    let acknowledged = false;
    try {
      await callback({ key: requestKey, id: record.id, expectedRevision: record.revision, ...(patch ? { patch } : {}), signal });
      if (!current(token)) return;
      acknowledged = true; drafts.delete(record.id);
      // Never expose a stale mutation after an acknowledged write, even if the
      // subsequent read fails. Refresh is safe; replaying the write is not.
      records = records.filter(item => item.id !== record.id); render();
    } catch (error) {
      if (current(token)) setStatus(errorText(error), true);
    } finally { if (current(token)) lock(false); }
    if (acknowledged && current(token)) await read(kind === 'correct' ? 'Correction saved.' : 'Entry forgotten.');
  }
  function editForm(record, draft) {
    const form = element('form', 'pc-resident-mind__edit');
    const labelText = element('label', '', 'Name');
    const label = element('input'); label.type = 'text'; label.value = draft.label; label.setAttribute('aria-label', 'Knowledge name');
    labelText.append(label);
    const noteText = element('label', '', 'Note');
    const note = element('textarea'); note.rows = 4; note.value = draft.note; note.setAttribute('aria-label', 'Knowledge note');
    noteText.append(note);
    const help = element('p', 'pc-resident-mind__help');
    const actions = element('div', 'pc-resident-mind__actions');
    const save = element('button', '', 'Save correction'); save.type = 'submit';
    const cancel = button('Cancel correction', () => {
      if (!busy && drafts.get(record.id) === draft) { drafts.delete(record.id); render(record.id); }
    });
    actions.append(save, cancel); form.append(labelText, noteText, help, actions);
    function validate() {
      draft.label = label.value; draft.note = note.value;
      const labelOk = validText(draft.label, 240, true), noteOk = validText(draft.note, 1024);
      label.setAttribute('aria-invalid', String(!labelOk)); note.setAttribute('aria-invalid', String(!noteOk));
      save.dataset.invalid = String(!labelOk || !noteOk); save.disabled = busy || !labelOk || !noteOk;
      help.textContent = !labelOk ? 'Enter a name using at most 240 UTF-8 bytes.' : !noteOk ? 'Shorten the note to at most 1024 UTF-8 bytes.'
        : record.revision !== draft.record.revision ? 'This entry changed while you were editing. Cancel and reopen the correction to use its latest version.'
          : 'Corrections change the name and note, and record an owner report. Audience and observed position stay unchanged.';
    }
    label.addEventListener('input', validate); note.addEventListener('input', validate); validate();
    form.addEventListener('submit', event => {
      event.preventDefault(); validate();
      if (!save.disabled) void mutate(draft.record, 'correct', { label: draft.label.trim(), note: draft.note });
    });
    return form;
  }
  function render(focusId) {
    list.replaceChildren();
    const renderedEpoch = epoch;
    const visible = records.filter(record => filter.value === 'all' || record.kind === filter.value);
    if (!visible.length) list.append(element('p', 'pc-resident-mind__empty', records.length ? 'No entries in this category.' : 'No people or places remembered yet.'));
    for (const record of visible) {
      const card = element('article', 'pc-resident-mind__entry'); card.dataset.knowledgeId = record.id;
      const heading = element('h3', '', text(record.label)); card.append(heading);
      const scope = record.audience === 'public' ? 'World conversation' : record.audience === 'private' ? 'Private conversation' : 'Unknown audience';
      const confidence = ['observed', 'reported', 'inferred', 'shared'].includes(record.confidence) ? record.confidence : 'unknown source';
      const age = { fresh: 'recent evidence', stale: 'stale evidence', unverified: 'unverified' }[record.status] || 'unverified';
      card.append(element('p', 'pc-resident-mind__meta', `${record.kind === 'place' ? 'Place' : 'Person'} · ${scope} · ${confidence} · ${age}`));
      if (record.note) card.append(element('p', 'pc-resident-mind__note', text(record.note)));
      card.append(element('p', 'pc-resident-mind__help', `${Number.isSafeInteger(record.lastSeenAt) ? 'Last observed' : 'Last recorded'}: ${date(record.lastSeenAt ?? record.updatedAt)}`));
      if (record.position) card.append(element('p', 'pc-resident-mind__help', record.kind === 'person'
        ? 'A historical position is saved; current whereabouts are unknown.' : 'An observed world position is saved.'));
      const evidence = element('details', 'pc-resident-mind__evidence'); evidence.append(element('summary', '', 'Source and audience'));
      evidence.append(element('p', '', `World: ${text(record.worldId)}\nConversation: ${text(record.conversationId)}\nAudience: ${scope}`));
      if (record.origin) evidence.append(element('p', '', 'Inherited from shared resident history; it has not necessarily been re-observed here.'));
      const sources = element('ul');
      for (const item of (Array.isArray(record.evidence) ? record.evidence : []).slice(0, 4)) {
        sources.append(element('li', '', `${sourceNames[item.sourceKind] || 'Unknown source'} · ${item.provenance === 'shared' ? 'inherited' : 'original record'} · ${date(item.when)}`));
      }
      if (!sources.children.length) sources.append(element('li', '', 'Source details unavailable.'));
      evidence.append(sources); card.append(evidence);
      const draft = drafts.get(record.id);
      if (draft?.mode === 'edit') card.append(editForm(record, draft));
      else if (draft?.mode === 'forget') {
        const confirmation = element('div', 'pc-resident-mind__confirmation');
        confirmation.append(element('p', '', 'Forget this entry? This removes the knowledge entry, not the original conversation history. An already dispatched physical task keeps its saved destination; cancel it in objective controls.'));
        const actions = element('div', 'pc-resident-mind__actions');
        actions.append(button('Forget entry', () => void mutate(draft.record, 'forget')),
          button('Keep entry', () => {
            if (!busy && drafts.get(record.id) === draft) { drafts.delete(record.id); render(record.id); }
          }));
        confirmation.append(actions); card.append(confirmation);
      } else {
        const actions = element('div', 'pc-resident-mind__actions');
        if (typeof onCorrect === 'function') actions.append(button('Correct', () => {
          if (busy || !current(renderedEpoch) || !records.includes(record)) return;
          drafts.set(record.id, { mode: 'edit', record, label: text(record.label), note: text(record.note) });
          render(); list.querySelectorAll('article').forEach(item => { if (item.dataset.knowledgeId === record.id) item.querySelector('input')?.focus(); });
        }));
        if (typeof onForget === 'function') actions.append(button('Forget', () => {
          if (busy || !current(renderedEpoch) || !records.includes(record)) return;
          drafts.set(record.id, { mode: 'forget', record }); render(record.id);
        }));
        card.append(actions);
      }
      list.append(card);
      if (focusId === record.id) card.querySelector('button')?.focus();
    }
    lock(busy);
  }
  filter.addEventListener('change', () => { if (!busy) render(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { if (!dialog.open && key) stop(); });
  for (const name of ['keydown', 'keyup', 'keypress']) dialog.addEventListener(name, event => event.stopPropagation());
  return {
    get selectedKey() { return key; },
    open({ key: nextKey, name, returnFocus } = {}) {
      if (disposed || !text(nextKey)) return;
      if (active() && key === nextKey) { done.focus(); return; }
      const nextFocus = returnFocus ?? (dialog.contains(document.activeElement) ? focusTarget : document.activeElement);
      stop(false); key = nextKey; controller = new AbortController(); focusTarget = nextFocus;
      title.textContent = `Mind · ${text(name) || 'Resident'}`; filter.value = 'all';
      if (!dialog.open) dialog.showModal();
      done.focus(); void read();
    },
    close,
    dispose() { if (disposed) return; stop(false); if (dialog.open) dialog.close(); dialog.remove(); disposed = true; },
  };
}
