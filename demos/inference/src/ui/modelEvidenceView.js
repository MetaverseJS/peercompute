const node = (tag, text) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; return element; };
const bytes = value => `${(value / 1024 ** 3).toFixed(2)} GiB`;
/** Read-only evidence. Never changes compatibility admission or triggers model execution. */
export function createModelEvidenceView({ source, query }) {
  const element = node('section'), title = node('h4', 'Model observations'), status = node('p');
  const check = node('button', 'Check observations'); check.type = 'button';
  const list = node('ul'); element.className = 'pc-browser-evidence'; status.className = 'pc-browser-note';
  element.append(title, node('p', 'Inspecting a package is not a successful execution test. Reports are peer claims scoped to a package, runtime, device and workload.'), check, status, list);
  let controller, closed = false;
  check.onclick = async () => {
    controller?.abort(); controller = new AbortController(); check.disabled = true; status.textContent = 'Checking local and root observations…';
    try {
      const result = await query(source.package ?? source, { signal: controller.signal });
      if (closed) return;
      status.textContent = result.network === 'connected' ? 'Root connected. Historical failures never disable loading.'
        : 'Root unavailable. Showing local observations; model loading is unaffected.';
      list.replaceChildren();
      if (!result.records.length) list.append(node('li', 'No observations for this exact package yet.'));
      for (const { report, applicability } of result.records) {
        const row = node('li');
        const scope = applicability.current ? 'Same runtime/device profile; compare workloads' : `Historical / different profile: ${applicability.changed.join(', ')}. Reinspect or retest.`;
        const environment = report.environment;
        row.append(node('strong', `${report.stage}: ${report.outcome}${report.reason ? ` (${report.reason})` : ''}`),
          node('p', `${environment.browserFamily ?? environment.kind} ${environment.browserVersion ?? ''} · ${environment.os ?? 'OS unknown'} · ${environment.gpu?.vendor ?? 'GPU unknown'} ${environment.gpu?.architecture ?? ''}`),
          node('p', scope), node('p', `${new Date(report.observedAt).toLocaleString()} · client ${report.compatibility.clientBuild} · runtime ${report.compatibility.runtime ?? 'inspection'} ${report.compatibility.runtimeVersion ?? ''}`));
        for (const metric of report.metrics ?? []) {
          const label = { durationMs: 'Operation time', estimatedCpuBytes: 'Planning RAM estimate', estimatedGpuBytes: 'Planning GPU estimate',
            requestedGpuBufferPeakBytes: 'Peak requested runtime buffers (not physical VRAM)', wasmMemoryBytes: 'WASM memory buffer' }[metric.name];
          if (label) row.append(node('p', `${label}: ${metric.unit === 'bytes' ? bytes(metric.value) : `${metric.value} ms`}`));
        }
        if (report.workload) row.append(node('p', Object.entries(report.workload).map(([key, value]) => `${key}: ${value}`).join(' · ')));
        list.append(row);
      }
    } catch (error) { if (!closed && !controller.signal.aborted) status.textContent = 'Observations unavailable. Model loading is unaffected.'; }
    finally { if (!closed) check.disabled = false; }
  };
  return { element, dispose() { closed = true; controller?.abort(); } };
}
