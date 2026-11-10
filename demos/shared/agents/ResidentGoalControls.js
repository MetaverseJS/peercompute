import { normalizeWorldGoalPlan, activeWorldGoalMilestone, worldGoalMilestonesComplete }
  from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';

const encoder = new TextEncoder();
const labels = Object.freeze({ ready: 'Ready', planning: 'Choosing the next step', acting: 'Acting',
  'waiting-for-model': 'Waiting for a model', paused: 'Paused', completed: 'Complete · model assessment', cancelled: 'Cancelled' });
const terminal = new Set(['completed', 'cancelled']);
const actions = Object.freeze({ approach: 'Approach', 'look-at': 'Look at', stop: 'Stop', 'move-to': 'Move to saved place' });
const outcomes = Object.freeze({ arrived: 'Reached stopping distance', stopped: 'Stopped', 'target-lost': 'Target lost',
  blocked: 'Blocked', cancelled: 'Cancelled', failed: 'Failed' });
const objectiveText = value => typeof value === 'string' ? value.replaceAll('\0', '').slice(0, 1024) : '';
const short = (value, maximum = 512) => typeof value === 'string' ? value.replace(/[\u0000-\u001f]/g, ' ').slice(0, maximum) : '';
const node = (tag, content) => { const element = document.createElement(tag); if (content !== undefined) element.textContent = content; return element; };
const button = label => { const element = node('button', label); element.type = 'button'; return element; };

function planPresentation(snapshot) {
  if (!snapshot?.plan) return { rows: [], message: 'No milestone plan saved yet.' };
  try {
    const plan = normalizeWorldGoalPlan(snapshot.plan), goal = { ...snapshot, plan };
    const active = activeWorldGoalMilestone(goal), complete = worldGoalMilestonesComplete(goal);
    const finished = complete ? plan.milestones.length : active.index;
    return { message: `${finished} of ${plan.milestones.length} milestones verified`,
      rows: plan.milestones.map((milestone, index) => {
        const done = index < finished;
        const receiptId = done ? snapshot.completedMilestones[index].requestId : null;
        const receipt = done ? snapshot.receipts.find(item => item.requestId === receiptId) : null;
        return { label: milestone.label, status: done ? 'completed' : index === finished ? 'current' : 'pending',
          detail: done ? outcomes[receipt.status] : terminal.has(snapshot.status) ? 'Unfinished'
            : index === finished ? (snapshot.status === 'acting' ? 'In progress' : 'Next') : 'Pending' };
      }) };
  } catch { return { rows: [], message: 'Milestone evidence is unavailable. Refresh the objective before resuming.' }; }
}

/** Owner-local presentation only. The host owns authority, persistence, scheduling
 * and physical verification; snapshots never rewrite a draft or launch work. */
export function createResidentGoalControls({ key, name = 'Resident', onAssignGoal, onPauseGoal, onResumeGoal, onCancelGoal } = {}) {
  if (typeof key !== 'string' || !key) throw new TypeError('A resident key is required');
  const element = node('details'); element.dataset.residentGoal = ''; element.style.marginTop = '6px';
  const summary = node('summary', 'Objective · Not assigned');
  const objective = node('p'); objective.dataset.goalField = 'objective'; objective.style.cssText = 'overflow-wrap:anywhere;white-space:pre-wrap';
  const form = node('form'); form.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin:8px 0;min-width:0';
  const label = node('label', 'Objective'); label.style.cssText = 'display:flex;flex-direction:column;gap:6px;min-width:0';
  const input = node('textarea'); input.rows = 3; input.maxLength = 1024; input.placeholder = 'What should this resident try to do?';
  input.style.cssText = 'box-sizing:border-box;width:100%;min-width:0'; label.append(input);
  const start = button('Start'); start.type = 'submit'; start.style.alignSelf = 'flex-start'; form.append(label, start);
  const values = node('dl'); values.style.cssText = 'display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 10px;margin:8px 0;font-size:.85em';
  const fields = new Map();
  for (const [id, title] of [['status', 'Status'], ['step', 'Current step'], ['receipt', 'Last physical result'], ['assessment', 'Model assessment'], ['reason', 'Details']]) {
    const term = node('dt', title), value = node('dd'); term.style.opacity = '.8';
    value.style.cssText = 'margin:0;overflow-wrap:anywhere;min-width:0'; value.dataset.goalField = id;
    values.append(term, value); fields.set(id, { term, value });
  }
  const controls = node('div'); controls.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin:8px 0';
  const pause = button('Pause'), resume = button('Resume'), cancel = button('Cancel'); controls.append(pause, resume, cancel);
  const message = node('p'); message.setAttribute('role', 'status'); message.style.cssText = 'overflow-wrap:anywhere;color:inherit';
  const milestones = node('section'); milestones.setAttribute('aria-label', 'Objective milestones');
  const progress = node('p'); progress.dataset.goalField = 'progress';
  const itinerary = node('ol'); itinerary.dataset.goalMilestones = '';
  itinerary.style.cssText = 'padding-left:1.6em;overflow-wrap:anywhere;margin:8px 0';
  milestones.append(progress, itinerary);
  element.append(summary, objective, form, values, milestones, controls, message);
  let current = null, enabled = true, disposed = false, pending = null, dirty = false, error = '';
  const put = (id, value) => {
    const field = fields.get(id); if (field.value.textContent !== value) field.value.textContent = value;
    field.term.hidden = field.value.hidden = !value;
  };
  const validDraft = () => !!input.value.trim() && encoder.encode(input.value.trim()).length <= 1024;
  const canStart = () => !current || terminal.has(current.status);
  function update() {
    if (disposed) return;
    const status = current?.status, locked = !enabled || !!pending;
    const invalid = !!input.value.trim() && !validDraft(); input.setAttribute('aria-invalid', String(invalid));
    form.hidden = !canStart(); form.style.display = form.hidden ? 'none' : 'flex'; input.disabled = locked;
    start.disabled = locked || !canStart() || !validDraft() || typeof onAssignGoal !== 'function';
    start.textContent = pending === 'assign' ? 'Starting…' : 'Start';
    pause.hidden = !current || status === 'paused' || terminal.has(status);
    resume.hidden = status !== 'paused'; cancel.hidden = !current || terminal.has(status);
    pause.disabled = locked || typeof onPauseGoal !== 'function'; resume.disabled = locked || typeof onResumeGoal !== 'function';
    cancel.disabled = locked || typeof onCancelGoal !== 'function';
    pause.textContent = pending === 'pause' ? 'Pausing…' : 'Pause'; resume.textContent = pending === 'resume' ? 'Resuming…' : 'Resume';
    cancel.textContent = pending === 'cancel' ? 'Cancelling…' : 'Cancel';
    summary.textContent = `Objective · ${current ? labels[status] : 'Not assigned'}`;
    element.dataset.goalStatus = status ?? 'idle';
    objective.hidden = !current; objective.textContent = objectiveText(current?.objective);
    put('status', current ? labels[status] : 'No objective assigned');
    put('step', short(current?.currentStep, 240));
    const receipt = current?.lastReceipt;
    put('receipt', receipt && Object.hasOwn(actions, receipt.type) && Object.hasOwn(outcomes, receipt.status)
      ? `${actions[receipt.type]} · ${outcomes[receipt.status]}${short(receipt.reason, 240) ? ` · ${short(receipt.reason, 240)}` : ''}` : 'No physical result yet');
    put('assessment', short(current?.modelAssessment, 512)); put('reason', short(current?.reason, 512));
    milestones.hidden = !current;
    progress.textContent = current?.planView.message ?? '';
    itinerary.replaceChildren(...(current?.planView.rows ?? []).map(row => {
      const item = node('li'); item.dataset.milestoneStatus = row.status; item.style.marginBottom = '6px';
      const title = node('span', row.label), detail = node('small', row.detail);
      detail.style.cssText = 'display:block;opacity:.8'; item.append(title, detail); return item;
    }));
    message.textContent = error || (invalid ? 'Shorten this objective before starting.' : ''); message.hidden = !message.textContent;
  }
  function setName(value) {
    name = short(value, 240) || 'Resident';
    summary.setAttribute('aria-label', `Objective details for ${name}`); input.setAttribute('aria-label', `Objective for ${name}`);
    for (const [control, action] of [[start, 'Start'], [pause, 'Pause'], [resume, 'Resume'], [cancel, 'Cancel']]) control.setAttribute('aria-label', `${action} objective for ${name}`);
  }
  function setStatus(snapshot) {
    if (disposed) return;
    if (snapshot != null && (typeof snapshot.goalId !== 'string' || !snapshot.goalId || snapshot.goalId.length > 128
      || !Number.isSafeInteger(snapshot.revision) || snapshot.revision < 1 || !Object.hasOwn(labels, snapshot.status))) return;
    if (current && snapshot?.goalId === current.goalId && snapshot.revision < current.revision) return;
    const changed = current?.goalId !== snapshot?.goalId || current?.revision !== snapshot?.revision;
    current = snapshot ? { goalId: snapshot.goalId, revision: snapshot.revision, status: snapshot.status,
      objective: objectiveText(snapshot.objective), currentStep: short(snapshot.currentStep, 240), reason: short(snapshot.reason),
      modelAssessment: short(snapshot.modelAssessment), planView: planPresentation(snapshot), lastReceipt: snapshot.lastReceipt ? { type: snapshot.lastReceipt.type,
        status: snapshot.lastReceipt.status, reason: short(snapshot.lastReceipt.reason, 240) } : null } : null;
    if (!dirty && current) input.value = current.objective;
    if (changed) error = '';
    update();
  }
  async function invoke(kind, callback) {
    if (disposed || !enabled || pending || typeof callback !== 'function') return;
    if (kind === 'assign' ? !canStart() || !validDraft() : !current || terminal.has(current.status)
      || (kind === 'resume' ? current.status !== 'paused' : kind === 'pause' && current.status === 'paused')) return;
    const payload = kind === 'assign' ? { key, objective: input.value.trim() }
      : { key, goalId: current.goalId, expectedRevision: current.revision };
    pending = kind; error = ''; update();
    try {
      await callback(payload);
      if (!disposed && kind === 'assign' && input.value.trim() === payload.objective) dirty = false;
    } catch (cause) { if (!disposed) error = short(cause?.message ?? String(cause)); }
    finally { if (!disposed) { pending = null; update(); } }
  }
  input.addEventListener('input', () => { dirty = true; error = ''; update(); });
  form.addEventListener('submit', event => { event.preventDefault(); void invoke('assign', onAssignGoal); });
  pause.onclick = () => void invoke('pause', onPauseGoal);
  resume.onclick = () => void invoke('resume', onResumeGoal);
  cancel.onclick = () => void invoke('cancel', onCancelGoal);
  setName(name); update();
  return { element, setName, setStatus, setEnabled(value) { enabled = !!value; update(); },
    dispose() { if (disposed) return; disposed = true; element.remove(); fields.clear(); } };
}
