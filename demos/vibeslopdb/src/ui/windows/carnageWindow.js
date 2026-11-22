import { listStarterSchemas } from '../../db/starterSchemas.js';

/**
 * Carnage Log & Time-Travel ExoWebTUI window:
 *  - Live DB Engine Switcher (SQLite WASM, PostgreSQL PGlite WASM, IndexedDB)
 *  - Starter Schema Switcher
 *  - Snapshot Time-Travel ([Rewind]) & Reset
 *  - Live scrollable carnage receipt feed with click-to-load into Query window
 */
export function createCarnageWindow({
  container,
  sessionManager,
  getPersistedSnapshot,
  onCopyMermaid,
  onReplaySql,
  onEngineSwitched
} = {}) {
  const root = document.createElement('div');
  root.className = 'vs-carnage-win';

  const controls = document.createElement('div');
  controls.className = 'vs-carnage-controls';

  const engineSelect = document.createElement('select');
  engineSelect.className = 'vs-select';
  engineSelect.setAttribute('aria-label', 'Database Engine');
  engineSelect.innerHTML = `
    <option value="sqlite">SQLite WASM (sql.js)</option>
    <option value="pglite">PostgreSQL 17 WASM (PGlite)</option>
    <option value="indexeddb">IndexedDB (Browser Native)</option>
  `;

  const starterSelect = document.createElement('select');
  starterSelect.className = 'vs-select';
  starterSelect.setAttribute('aria-label', 'Starter Schema');
  for (const starter of listStarterSchemas()) {
    const opt = document.createElement('option');
    opt.value = starter.id;
    opt.textContent = starter.label;
    starterSelect.append(opt);
  }

  const rewindBtn = document.createElement('button');
  rewindBtn.type = 'button';
  rewindBtn.className = 'vs-btn vs-btn-warn';
  rewindBtn.textContent = '⟲ Rewind (0)';
  rewindBtn.disabled = true;

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'vs-btn';
  resetBtn.textContent = 'Reset DB';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'vs-btn';
  copyBtn.textContent = 'Copy ER';

  controls.append(engineSelect, starterSelect, rewindBtn, resetBtn, copyBtn);

  const feed = document.createElement('div');
  feed.className = 'vs-carnage-feed';
  feed.setAttribute('role', 'log');
  feed.setAttribute('aria-live', 'polite');

  root.append(controls, feed);
  container.append(root);

  function renderState(state) {
    engineSelect.value = state.engineId;
    starterSelect.value = state.starterId;
    engineSelect.disabled = state.busy;
    starterSelect.disabled = state.busy;
    resetBtn.disabled = state.busy;
    rewindBtn.disabled = state.busy || state.snapshotCount === 0;
    rewindBtn.textContent = `⟲ Rewind (${state.snapshotCount})`;

    feed.replaceChildren();
    const entries = [...(state.carnageLog || [])].reverse();
    if (entries.length === 0) {
      feed.innerHTML = '<div class="vs-empty-note">No SQL carnage recorded yet.</div>';
      return;
    }

    for (const entry of entries) {
      const card = document.createElement('article');
      card.className = `vs-log-entry ${entry.ok ? 'is-ok' : 'is-err'}`;

      const header = document.createElement('div');
      header.className = 'vs-log-header';

      const badge = document.createElement('span');
      badge.className = `vs-actor-badge actor-${String(entry.actor || 'user').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      badge.textContent = `[${entry.actor}]`;

      const meta = document.createElement('span');
      meta.className = 'vs-log-meta';
      meta.textContent = `#${entry.id} · ${entry.engine} · ${entry.ok ? `${entry.durationMs}ms` : 'ERROR'}`;

      const replayBtn = document.createElement('button');
      replayBtn.type = 'button';
      replayBtn.className = 'vs-btn vs-btn-xs';
      replayBtn.textContent = '→ Query';
      replayBtn.addEventListener('click', () => onReplaySql?.(entry.sql));

      header.append(badge, meta, replayBtn);

      const sqlPre = document.createElement('pre');
      sqlPre.className = 'vs-log-sql';
      sqlPre.textContent = entry.sql;

      card.append(header, sqlPre);

      if (!entry.ok && entry.error) {
        const err = document.createElement('div');
        err.className = 'vs-log-error';
        err.textContent = entry.error;
        card.append(err);
      }

      const diff = entry.diff;
      if (diff && (diff.addedTables?.length || diff.droppedTables?.length || diff.alteredTables?.length)) {
        const pills = document.createElement('div');
        pills.className = 'vs-diff-pills';
        for (const t of diff.addedTables || []) {
          const p = document.createElement('span');
          p.className = 'vs-pill vs-pill-add';
          p.textContent = `+${t}`;
          pills.append(p);
        }
        for (const t of diff.alteredTables || []) {
          const p = document.createElement('span');
          p.className = 'vs-pill vs-pill-alt';
          p.textContent = `~${t}`;
          pills.append(p);
        }
        for (const t of diff.droppedTables || []) {
          const p = document.createElement('span');
          p.className = 'vs-pill vs-pill-drop';
          p.textContent = `-${t}`;
          pills.append(p);
        }
        card.append(pills);
      }

      feed.append(card);
    }
  }

  engineSelect.addEventListener('change', async () => {
    const nextEngine = engineSelect.value;
    const saved = getPersistedSnapshot?.(nextEngine) || null;
    await sessionManager.switchEngine(nextEngine, {
      starterId: saved?.starterId || starterSelect.value,
      persistedSnapshot: saved?.snapshot || null
    });
    onEngineSwitched?.(nextEngine, sessionManager.getState().starterId, { restored: Boolean(saved?.snapshot) });
  });

  starterSelect.addEventListener('change', async () => {
    const nextStarter = starterSelect.value;
    await sessionManager.loadStarter(nextStarter);
    onEngineSwitched?.(engineSelect.value, nextStarter, { restored: false });
  });

  rewindBtn.addEventListener('click', async () => {
    await sessionManager.rewind();
  });

  resetBtn.addEventListener('click', async () => {
    await sessionManager.loadStarter(starterSelect.value);
    onEngineSwitched?.(engineSelect.value, starterSelect.value, { restored: false });
  });

  copyBtn.addEventListener('click', async () => {
    const ok = await onCopyMermaid?.();
    copyBtn.textContent = ok ? 'Copied ✓' : 'Copy ER';
    if (ok) window.setTimeout(() => { copyBtn.textContent = 'Copy ER'; }, 1400);
  });

  const unsub = sessionManager.subscribe((ev) => {
    renderState(ev.state);
  });

  renderState(sessionManager.getState());

  return {
    element: root,
    renderState,
    setEngineUi(engineId) {
      engineSelect.value = engineId;
    },
    dispose() {
      unsub();
      root.remove();
    }
  };
}
