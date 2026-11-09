/** Safe text-only rendering for remote metadata. */
export function renderObservedSummary({ summaryElement, modelsElement, applicationSelect }, view) {
  if (applicationSelect) {
    const selected = applicationSelect.value;
    const values = ['', ...view.applications];
    if (selected && !values.includes(selected)) values.push(selected);
    if ([...applicationSelect.options].map((o) => o.value).join('\n') !== values.join('\n')) {
      applicationSelect.replaceChildren(...values.map((value) => {
        const option = document.createElement('option'); option.value = value;
        option.textContent = value || 'All applications'; return option;
      }));
      applicationSelect.value = selected;
    }
  }
  const { summary, compute } = view;
  if (summaryElement) summaryElement.textContent = [
    `${summary.active} reporting peers · ${summary.stale} stale · ${summary.sessionOnly} session only`,
    `${compute.workerCount} workers · ${compute.activeTasks} active tasks · ${compute.queuedTasks} queued`,
    'Reachable reporting network instances; coverage is partial.',
    ...(summary.sessionOnly ? ['Older demo tabs need an updated build for full telemetry.'] : [])
  ].join('\n');
  const modelText = view.models.length
    ? view.models.map((model) => `${model.name || model.manifestCid}\n${model.task || 'unknown'} · ${model.hostCount} hosting peer${model.hostCount === 1 ? '' : 's'} · ${model.busyCount} busy${model.busy ? ' (all busy)' : ''}`).join('\n\n')
    : 'No fresh reports advertise hosted models.';
  if (modelsElement) modelsElement.textContent = modelText + (summary.modelsUnavailable
    ? `\n\nHosting status unavailable from ${summary.modelsUnavailable} reporting peer${summary.modelsUnavailable === 1 ? '' : 's'}; counts are partial.` : '');
}
