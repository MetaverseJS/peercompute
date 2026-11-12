import './cube-objects.css';

const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
let sequence = 0;

/** A scene-owned object list. The injected service remains the authority for deletion. */
export function createCubeObjectUi({ container = document.body, getGeneratedObjects, beforeOpen = () => {},
  getReturnFocus = () => document.getElementById('settings-button') } = {}) {
  const dialog = node('dialog', undefined, 'cube-settings cube-objects');
  const title = node('h2', 'Placed objects'); title.id = `cube-objects-title-${++sequence}`;
  dialog.setAttribute('aria-labelledby', title.id);
  const header = node('header'), done = node('button', 'Done'); header.append(title, done);
  const note = node('p', 'Objects placed by this device in this room. Other players manage their own objects.', 'cube-settings-note');
  const list = node('div', undefined, 'cube-objects-list'); list.setAttribute('aria-label', 'Objects placed by this device');
  const empty = node('p', 'No objects placed by this device in this room.', 'cube-settings-note');
  const status = node('p', '', 'cube-settings-note'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const actions = node('div', undefined, 'cube-objects-actions'), selectAll = node('button', 'Select all');
  const refreshButton = node('button', 'Refresh'), removeButton = node('button', 'Delete selected');
  actions.append(selectAll, refreshButton, removeButton); dialog.append(header, note, list, empty, actions, status); container.append(dialog);
  const lifetime = new AbortController(), selected = new Set(), rows = new Map();
  let disposed = false, service, epoch = 0, loading = false, deleting = false, operation, returnFocus;
  const listen = (element, type, callback) => element.addEventListener(type, callback, { signal: lifetime.signal });
  const errorText = error => String(error?.message ?? error).replaceAll('\0', '').slice(0, 240);
  function update() {
    if (disposed) return;
    for (const [id, row] of rows) { row.check.checked = selected.has(id); row.check.disabled = loading || deleting; }
    selectAll.disabled = loading || deleting || rows.size === 0;
    selectAll.textContent = rows.size > 0 && selected.size === rows.size ? 'Clear selection' : 'Select all';
    refreshButton.disabled = loading || deleting;
    removeButton.disabled = loading || deleting || selected.size === 0;
    removeButton.textContent = deleting ? 'Deleting…' : 'Delete selected';
    empty.hidden = loading || rows.size !== 0;
  }
  function render(values) {
    const owned = values.filter(value => value.local !== false), ids = new Set(owned.map(value => value.placement.objectId));
    for (const [id, row] of rows) if (!ids.has(id)) { row.element.remove(); rows.delete(id); selected.delete(id); }
    for (const value of owned) {
      const { objectId, name } = value.placement;
      let row = rows.get(objectId);
      if (!row) {
        const element = node('label', undefined, 'cube-object-row'), check = node('input'), label = node('span');
        check.type = 'checkbox'; element.dataset.objectId = objectId; element.append(check, label); list.append(element);
        row = { element, check, label }; rows.set(objectId, row);
        listen(check, 'change', () => { if (check.checked) selected.add(objectId); else selected.delete(objectId); update(); });
      }
      row.label.textContent = name;
    }
    update();
  }
  async function refresh({ message } = {}) {
    if (disposed || !dialog.open || deleting) return;
    const current = ++epoch; loading = true; status.textContent = 'Loading placed objects…'; update();
    try {
      const next = await getGeneratedObjects?.();
      if (!next) throw new Error('Object controls are still starting. Try Refresh.');
      await next.ready;
      if (disposed || !dialog.open || current !== epoch) return;
      if (service !== next) { selected.clear(); render([]); }
      service = next; render(service.list());
      status.textContent = message ?? `${rows.size} object${rows.size === 1 ? '' : 's'} placed by this device.`;
    } catch (error) {
      if (!disposed && dialog.open && current === epoch) { service = null; selected.clear(); render([]); status.textContent = errorText(error); }
    } finally { if (current === epoch) loading = false; update(); }
  }
  function close({ restore = true } = {}) {
    ++epoch; loading = false;
    // Abort only unfinished work. The service owns the durable commit boundary;
    // completed removals are never restored or replayed on behalf of the UI.
    operation?.abort(new DOMException('Object window closed', 'AbortError'));
    if (dialog.open) dialog.close();
    if (restore && !disposed) {
      const target = returnFocus?.isConnected && returnFocus.getClientRects().length ? returnFocus : getReturnFocus();
      target?.focus?.();
    }
  }
  async function removeSelected() {
    if (disposed || !dialog.open || deleting || loading || !selected.size) return;
    const ids = [...selected], owner = service, controller = new AbortController();
    operation = controller; deleting = true; status.textContent = 'Removing selected objects…'; update();
    let removed = 0, changedRoom = false; const failures = [];
    try {
      for (const id of ids) {
        controller.signal.throwIfAborted();
        const current = await getGeneratedObjects?.(); controller.signal.throwIfAborted();
        if (current !== owner) { changedRoom = true; break; }
        // Service.list() is the owned directory. Recheck before each removal;
        // a disappeared object must not become a deletion request for another host.
        const item = owner.list().find(value => value.local !== false && value.placement.objectId === id);
        if (!item) { selected.delete(id); continue; }
        try { await owner.remove(id, { signal: controller.signal }); selected.delete(id); removed++; }
        catch (error) {
          controller.signal.throwIfAborted(); failures.push(`${item.placement.name}: ${errorText(error)}`);
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) failures.push(errorText(error));
    } finally {
      if (operation === controller) operation = null;
      deleting = false; update();
      if (!disposed && dialog.open) {
        const message = changedRoom ? 'The room changed. Review its objects before deleting.'
          : `Removed ${removed} object${removed === 1 ? '' : 's'}.${failures.length ? ` Could not remove: ${failures.join('; ')}` : ''}`;
        await refresh({ message });
      }
    }
  }
  listen(done, 'click', () => close());
  listen(dialog, 'cancel', event => { event.preventDefault(); close(); });
  listen(dialog, 'keydown', event => event.stopPropagation());
  listen(selectAll, 'click', () => {
    if (selected.size === rows.size) selected.clear(); else for (const id of rows.keys()) selected.add(id);
    update();
  });
  listen(refreshButton, 'click', () => { void refresh(); });
  listen(removeButton, 'click', () => { void removeSelected(); });
  update();
  return { dialog, close,
    open({ returnFocus: opener } = {}) {
      if (disposed || dialog.open) return;
      returnFocus = opener ?? document.activeElement; beforeOpen(); dialog.showModal();
      if (!deleting) void refresh(); else { status.textContent = 'Finishing the previous removal…'; update(); }
    },
    dispose() { if (disposed) return; disposed = true; close({ restore: false }); lifetime.abort(); dialog.remove(); }
  };
}
