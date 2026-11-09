const labels = Object.freeze({ idle: 'Learned controller idle', stopped: 'Stopped', loading: 'Preparing controller', moving: 'Moving',
  detouring: 'Going around an obstacle', arrived: 'Reached stopping distance', blocked: 'Blocked',
  'target-lost': 'Target no longer visible', failed: 'Movement unavailable', paused: 'Paused' });
const actions = Object.freeze({ approach: 'Approach', follow: 'Follow', 'look-at': 'Look at', stop: 'Stop',
  roam: 'Roam (scripted)', stationary: 'Stay here' });
const short = (value, maximum = 160) => typeof value === 'string' ? value.replace(/[\u0000-\u001f]/g, ' ').slice(0, maximum) : '';
const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1_000_000;
const number = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
const node = (tag, content) => { const element = document.createElement(tag); if (content !== undefined) element.textContent = content; return element; };

/** Presentation only: measured owner-local navigation, with no inferred route or completion percentage.
 * Embedders supply bounded snapshots; this component owns no physics, polling or worker lifecycle. */
export function createResidentNavigationInspector({ name = 'Resident' } = {}) {
  const element = node('details'); element.dataset.residentNavigation = ''; element.style.marginTop = '6px';
  const summary = node('summary', 'Movement details');
  const values = node('dl'); values.style.cssText = 'display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 10px;margin:6px 0 10px;font-size:.85em';
  const fields = new Map();
  for (const label of ['Status', 'Action', 'Target', 'Distance', 'Progress', 'Direct path', 'Controller', 'Policy', 'Details']) {
    const term = node('dt', label), value = node('dd'); term.style.opacity = '.8';
    value.style.cssText = 'margin:0;overflow-wrap:anywhere;min-width:0'; value.dataset.navigationField = label.toLowerCase().replaceAll(' ', '-');
    values.append(term,value); fields.set(label,{term,value});
  }
  element.append(summary,values);
  const put = (label,value) => {
    const field = fields.get(label); field.value.textContent = value;
    field.term.hidden = field.value.hidden = !value;
  };
  function setName(value) { name = short(value) || 'Resident'; summary.setAttribute('aria-label', `Movement details for ${name}`); }
  function setStatus(snapshot) {
    const status = snapshot && Object.hasOwn(labels,snapshot.status) ? labels[snapshot.status] : 'Waiting for status';
    element.dataset.navigationStatus = snapshot && Object.hasOwn(labels,snapshot.status) ? snapshot.status : 'unknown';
    summary.textContent = `Movement · ${snapshot?.status === 'idle' && snapshot.type === 'roam' ? 'Roam (scripted)' : status}`;
    put('Status',status);
    put('Action',snapshot && Object.hasOwn(actions,snapshot.type) ? actions[snapshot.type] : 'No movement intention');
    put('Target',short(snapshot?.targetName) || short(snapshot?.targetId) || 'None');
    put('Distance',finite(snapshot?.distance) ? `${number(snapshot.distance)} units${finite(snapshot.stopDistance) ? ` · stop at ${number(snapshot.stopDistance)}` : ''}` : 'Unavailable');
    const progress = snapshot?.progress, measured = [];
    if (finite(progress?.distanceTravelled)) measured.push(`${number(progress.distanceTravelled)} units travelled`);
    if (finite(progress?.unproductiveSeconds)) measured.push(`${number(progress.unproductiveSeconds)}s since progress`);
    put('Progress',measured.join(' · ') || 'No measurements yet');
    put('Direct path',progress?.targetClear === true ? 'Clear' : progress?.targetClear === false ? 'Obstructed' : 'Unknown');
    put('Controller',snapshot?.backend === 'webgpu' && snapshot.worker === true ? 'WebGPU · managed worker'
      : snapshot?.backend ? 'Execution not verified' : 'Not yet confirmed');
    const policy = short(snapshot?.policyId,100);
    put('Policy',policy ? `${policy}${Number.isSafeInteger(snapshot.dispatches) && snapshot.dispatches >= 0 ? ` · ${Math.min(snapshot.dispatches,1_000_000)} updates` : ''}` : '');
    put('Details',short(snapshot?.blockedReason,240));
  }
  setName(name); setStatus(null);
  return { element, setName, setStatus, dispose() { element.remove(); fields.clear(); } };
}
