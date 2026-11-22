import { createInteractiveDiagramStage } from '../../mermaid/interactiveDiagramStage.js';

/**
 * Live Mermaid ER Schema ExoWebTUI window:
 *  - Re-renders automatically on every DbSessionManager schema mutation
 *  - Shows schema diff pills (+added, -dropped, ~altered)
 *  - Embeds the interactive draggable Mermaid stage (SVG + ExoTUI ASCII Cells + Source)
 */
export function createSchemaWindow({
  container,
  sessionManager,
  getTheme,
  onSelectEntityQuery,
  onOffsetsChange
} = {}) {
  const root = document.createElement('div');
  root.className = 'vs-schema-win';

  const summaryBar = document.createElement('div');
  summaryBar.className = 'vs-schema-summary';

  const metricsEl = document.createElement('span');
  metricsEl.className = 'vs-schema-metrics';
  metricsEl.textContent = 'Booting database…';

  const diffPills = document.createElement('div');
  diffPills.className = 'vs-diff-pills';

  summaryBar.append(metricsEl, diffPills);

  const stageHost = document.createElement('div');
  stageHost.className = 'vs-schema-stage-host';

  root.append(summaryBar, stageHost);
  container.append(root);

  const stage = createInteractiveDiagramStage({
    container: stageHost,
    onSelectEntityQuery,
    onOffsetsChange,
    onExecuteSql: async (sql, actor) => sessionManager.executeSql(sql, { actor })
  });

  function renderDiffPills(diff) {
    diffPills.replaceChildren();
    if (!diff) return;
    for (const t of diff.addedTables || []) {
      const span = document.createElement('span');
      span.className = 'vs-pill vs-pill-add';
      span.textContent = `+${t}`;
      diffPills.append(span);
    }
    for (const t of diff.alteredTables || []) {
      const span = document.createElement('span');
      span.className = 'vs-pill vs-pill-alt';
      span.textContent = `~${t}`;
      diffPills.append(span);
    }
    for (const t of diff.droppedTables || []) {
      const span = document.createElement('span');
      span.className = 'vs-pill vs-pill-drop';
      span.textContent = `-${t}`;
      diffPills.append(span);
    }
  }

  async function refresh({ autoFit = false } = {}) {
    const state = sessionManager.getState();
    const schema = state.schema;
    const totalRows = (schema.tables || []).reduce((sum, t) => sum + (t.rowCount || 0), 0);
    metricsEl.textContent = `${state.engineLabel} · ${schema.tables.length} tables · ${schema.relations.length} FKs · ${totalRows} rows`;
    renderDiffPills(state.lastDiff);
    await stage.render({
      schema,
      diff: state.lastDiff,
      theme: getTheme?.(),
      autoFit
    });
  }

  const unsub = sessionManager.subscribe((event) => {
    if (event.type === 'schema-updated') {
      const autoFit = event.reason === 'engine-switch' || event.reason === 'starter-load';
      void refresh({ autoFit });
    }
  });

  return {
    element: root,
    stage,
    refresh,
    dispose() {
      unsub();
      stage.dispose();
      root.remove();
    }
  };
}
