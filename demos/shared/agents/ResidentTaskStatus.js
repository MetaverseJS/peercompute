import { activeWorldGoalMilestone, worldGoalMilestonesComplete }
  from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';

const terminal = status => ['completed', 'cancelled'].includes(status);
const automaticPause = goal => goal?.status === 'paused' && ['system', 'model', 'uncertain'].includes(goal.pauseSource);
const short = value => String(value ?? '').replaceAll('\0', '').slice(0, 1024);
const labels = { ready: 'Task accepted', planning: 'Planning', acting: 'Moving', paused: 'Paused',
  'waiting-for-model': 'Waiting for an available model', completed: 'Completed', cancelled: 'Cancelled' };

/** Presentation only: completed steps come from the same acknowledged receipt
 * contract used by the scheduler, never from the conversational model's claims. */
export function describeResidentTask(goal) {
  if (!goal) return '';
  let progress = '';
  if (goal.plan) {
    try {
      const active = activeWorldGoalMilestone(goal), done = worldGoalMilestonesComplete(goal);
      progress = done ? `${goal.plan.milestones.length}/${goal.plan.milestones.length} steps physically verified`
        : `Step ${active.index + 1}/${goal.plan.milestones.length}: ${short(active.milestone.label)}`;
    } catch { progress = 'Physical progress needs owner review'; }
  }
  const last = goal.receipts?.at(-1);
  const blocked = last?.status === 'blocked' && !terminal(goal.status) && goal.status !== 'acting';
  return [automaticPause(goal) ? 'Recovering automatically' : blocked ? 'Blocked' : labels[goal.status] ?? 'Task', progress,
    goal.reason && short(goal.reason)].filter(Boolean).join(' · ');
}

/** Compact owner task controls for a native conversation. World-specific UI
 * supplies the selected resident; peer snapshots can never enable controls. */
export function createResidentTaskStatus({ onPauseGoal, onResumeGoal, onCancelGoal } = {}) {
  const element = document.createElement('section'); element.dataset.residentTask = ''; element.hidden = true;
  element.setAttribute('aria-label', 'Current resident task');
  element.style.cssText = 'border-top:1px solid currentColor;padding-top:6px;min-width:0';
  const objective = document.createElement('div'), status = document.createElement('div'), controls = document.createElement('div');
  objective.style.cssText = 'overflow-wrap:anywhere;max-height:3em;overflow:auto;font-size:.85em';
  status.setAttribute('role', 'status'); status.dataset.taskStatus = '';
  status.style.cssText = 'overflow-wrap:anywhere;font-size:.85em';
  controls.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:4px';
  let resident, goal, enabled = true, pending = false, closed = false, error = '';
  const buttons = Object.entries({ pause: ['Pause task', onPauseGoal], resume: ['Resume task', onResumeGoal],
    cancel: ['Cancel task', onCancelGoal] }).map(([method, [label, handler]]) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.onclick = async () => {
      if (closed || pending || !enabled || !resident?.local || !goal || typeof handler !== 'function') return;
      const key = resident.key, goalId = goal.goalId, expectedRevision = goal.revision;
      pending = true; error = ''; render();
      try { await handler({ key, goalId, expectedRevision }); }
      catch (cause) { if (resident?.key === key && goal?.goalId === goalId) error = short(cause?.message || cause); }
      finally { pending = false; render(); }
    };
    controls.append(button); return { method, button, handler };
  });
  element.append(objective, status, controls);
  function render() {
    if (closed) return;
    element.hidden = !resident?.local || !goal;
    objective.textContent = short(goal?.objective);
    status.textContent = error || describeResidentTask(goal);
    for (const { method, button, handler } of buttons) {
      button.hidden = !goal || terminal(goal.status) || (method === 'resume' ? goal.status !== 'paused' : method === 'pause' && goal.status === 'paused' && !automaticPause(goal));
      button.disabled = !enabled || pending || !resident?.local || typeof handler !== 'function';
    }
  }
  return { element,
    set(nextResident, nextGoal) {
      if (resident?.key !== nextResident?.key || goal?.goalId !== nextGoal?.goalId) error = '';
      resident = nextResident; goal = nextGoal; render();
    },
    setEnabled(value) { enabled = value === true; render(); },
    dispose() { closed = true; element.remove(); }
  };
}
