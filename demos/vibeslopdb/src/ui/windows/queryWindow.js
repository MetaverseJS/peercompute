import { formatAsciiTable, formatCellValue } from '../../db/sqlUtils.js';

/**
 * Reusable spawnable SQL Query Input + Table Results ExoWebTUI window.
 * Multiple independent query windows can be spawned at once to watch
 * different slices of the carnage in real time.
 */
export function createQueryWindow({
  container,
  sessionManager,
  initialSql = '',
  windowLabel = 'Query 1'
} = {}) {
  const root = document.createElement('div');
  root.className = 'vs-query-win';

  const editorWrap = document.createElement('div');
  editorWrap.className = 'vs-query-editor-wrap';

  const editor = document.createElement('textarea');
  editor.className = 'vs-sql-input';
  editor.spellcheck = false;
  editor.rows = 4;
  editor.placeholder = '-- Type SQL and press Ctrl+Enter or Run SQL\nSELECT * FROM users LIMIT 20;';
  editor.value = initialSql;
  editor.setAttribute('aria-label', `${windowLabel} SQL input`);

  const controls = document.createElement('div');
  controls.className = 'vs-query-controls';

  const runBtn = document.createElement('button');
  runBtn.type = 'button';
  runBtn.className = 'vs-btn vs-btn-accent';
  runBtn.textContent = '▶ Run SQL (Ctrl+↵)';

  const asciiToggle = document.createElement('button');
  asciiToggle.type = 'button';
  asciiToggle.className = 'vs-btn';
  asciiToggle.textContent = 'ASCII';
  asciiToggle.title = 'Toggle formatted HTML table vs retro ASCII box table';

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'vs-btn';
  clearBtn.textContent = 'Clear';

  const stats = document.createElement('span');
  stats.className = 'vs-query-stats';
  stats.textContent = 'Idle';

  controls.append(runBtn, asciiToggle, clearBtn, stats);
  editorWrap.append(editor, controls);

  const output = document.createElement('div');
  output.className = 'vs-query-output';
  output.innerHTML = '<div class="vs-empty-note">Run a query or click any entity in the Mermaid ER diagram to populate results.</div>';

  root.append(editorWrap, output);
  container.append(root);

  let asciiMode = false;
  let lastResult = null;
  let running = false;

  function renderOutput() {
    output.replaceChildren();
    if (!lastResult) {
      output.innerHTML = '<div class="vs-empty-note">Run a query to inspect live rows.</div>';
      return;
    }
    if (!lastResult.ok) {
      const errBox = document.createElement('pre');
      errBox.className = 'vs-error-box';
      errBox.textContent = `SQL ERROR (${lastResult.durationMs ?? 0}ms):\n${lastResult.error}`;
      output.append(errBox);
      return;
    }

    const sets = lastResult.results || [];
    if (sets.length === 0) {
      const note = document.createElement('div');
      note.className = 'vs-empty-note';
      note.textContent = 'OK (no statements)';
      output.append(note);
      return;
    }

    // Prefer displaying the last statement that returned columns, plus a summary of all statements.
    const withCols = sets.filter((r) => Array.isArray(r.columns) && r.columns.length > 0);
    if (withCols.length === 0) {
      const totalChanges = sets.reduce((sum, s) => sum + (s.changes || 0), 0);
      const okBox = document.createElement('pre');
      okBox.className = 'vs-ok-box';
      okBox.textContent = `✓ Executed ${sets.length} statement${sets.length === 1 ? '' : 's'} in ${lastResult.durationMs}ms`
        + (totalChanges ? ` · ${totalChanges} row(s) modified` : '');
      output.append(okBox);
      return;
    }

    for (const set of withCols) {
      const caption = document.createElement('div');
      caption.className = 'vs-result-caption';
      caption.textContent = `${set.rowCount} row${set.rowCount === 1 ? '' : 's'} · ${set.columns.length} cols · ${set.durationMs}ms`;
      output.append(caption);

      if (asciiMode) {
        const pre = document.createElement('pre');
        pre.className = 'vs-ascii-table';
        pre.textContent = formatAsciiTable(set.columns, set.rows);
        output.append(pre);
      } else {
        const wrap = document.createElement('div');
        wrap.className = 'vs-table-wrap';
        const table = document.createElement('table');
        table.className = 'vs-table';

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        for (const col of set.columns) {
          const th = document.createElement('th');
          th.textContent = col;
          headRow.append(th);
        }
        thead.append(headRow);

        const tbody = document.createElement('tbody');
        const maxRows = 300;
        for (const row of set.rows.slice(0, maxRows)) {
          const tr = document.createElement('tr');
          for (let i = 0; i < set.columns.length; i += 1) {
            const td = document.createElement('td');
            const rawVal = row[i];
            if (rawVal === null || rawVal === undefined) {
              td.className = 'is-null';
              td.textContent = 'NULL';
            } else {
              td.textContent = formatCellValue(rawVal);
            }
            tr.append(td);
          }
          tbody.append(tr);
        }
        if (set.rows.length > maxRows) {
          const tr = document.createElement('tr');
          const td = document.createElement('td');
          td.colSpan = Math.max(1, set.columns.length);
          td.className = 'is-truncated';
          td.textContent = `… ${set.rows.length - maxRows} additional rows truncated`;
          tr.append(td);
          tbody.append(tr);
        }

        table.append(thead, tbody);
        wrap.append(table);
        output.append(wrap);
      }
    }
  }

  async function runSql(sqlOverride = null, actor = 'USER') {
    if (running) return null;
    if (typeof sqlOverride === 'string') editor.value = sqlOverride;
    const text = editor.value.trim();
    if (!text) return null;

    running = true;
    runBtn.disabled = true;
    stats.textContent = 'Running…';
    try {
      const result = await sessionManager.executeSql(text, { actor });
      lastResult = result;
      if (result.ok) {
        const lastWithRows = [...(result.results || [])].reverse().find((r) => r.columns?.length);
        stats.textContent = lastWithRows
          ? `OK · ${lastWithRows.rowCount} rows · ${result.durationMs}ms`
          : `OK · ${result.results?.length || 0} stmt · ${result.durationMs}ms`;
      } else {
        stats.textContent = `ERR · ${result.durationMs}ms`;
      }
      renderOutput();
      return result;
    } finally {
      running = false;
      runBtn.disabled = false;
    }
  }

  runBtn.addEventListener('click', () => { void runSql(); });
  asciiToggle.addEventListener('click', () => {
    asciiMode = !asciiMode;
    asciiToggle.classList.toggle('is-active', asciiMode);
    renderOutput();
  });
  clearBtn.addEventListener('click', () => {
    editor.value = '';
    lastResult = null;
    stats.textContent = 'Cleared';
    renderOutput();
    editor.focus();
  });
  editor.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      void runSql();
    }
  });

  return {
    element: root,
    setSql(sql) {
      editor.value = String(sql ?? '');
    },
    getSql: () => editor.value,
    runSql,
    showExternalResult(result, sqlText) {
      if (typeof sqlText === 'string') editor.value = sqlText;
      lastResult = result;
      stats.textContent = result?.ok
        ? `SYNC · ${result.durationMs ?? 0}ms`
        : `ERR · ${result?.durationMs ?? 0}ms`;
      renderOutput();
    },
    dispose() {
      root.remove();
    }
  };
}
