import { agentIdentifier } from './AgentContracts.js';

export const WORLD_GOAL_PLAN_LIMITS = Object.freeze({ maxMilestones: 6, maxLabelBytes: 64 });
const ACTIONS = new Set(['approach', 'look-at', 'stop']);
const encoder = new TextEncoder(), decoder = new TextDecoder();
function fields(value, allowed) {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
      || Reflect.ownKeys(value).some(key => !allowed.includes(key))) throw new TypeError('Invalid goal milestone fields');
}
function text(value, maximum) {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0') || encoder.encode(value).length > maximum
      || decoder.decode(encoder.encode(value)) !== value) throw new TypeError('Invalid goal milestone text');
  return value;
}
function denseArray(value, maximum) {
  if (!Array.isArray(value) || value.length > maximum || Reflect.ownKeys(value).length !== value.length + 1) return false;
  for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index)) return false;
  return true;
}

/** Durable plans contain resolved identities or the explicit requester role.
 * Request-local aliases must be resolved by the observation-aware caller. */
export function normalizeWorldGoalPlan(value) {
  fields(value, ['version', 'milestones']);
  if (value.version !== 1 || !denseArray(value.milestones, WORLD_GOAL_PLAN_LIMITS.maxMilestones) || !value.milestones.length) {
    throw new TypeError('Invalid bounded goal milestone plan');
  }
  const milestones = value.milestones.map(milestone => {
    fields(milestone, ['label', 'type', 'targetId', 'targetRole']);
    if (!ACTIONS.has(milestone.type)) throw new TypeError('Invalid goal milestone action');
    const result = { label: text(milestone.label, WORLD_GOAL_PLAN_LIMITS.maxLabelBytes), type: milestone.type };
    const hasId = Object.hasOwn(milestone, 'targetId'), hasRole = Object.hasOwn(milestone, 'targetRole');
    if (milestone.type === 'stop') {
      if (hasId || hasRole) throw new TypeError('Goal stop milestone has no target');
    } else {
      if (hasId === hasRole) throw new TypeError('Goal milestone requires one target');
      if (hasId) result.targetId = text(milestone.targetId, 320);
      else {
        if (milestone.targetRole !== 'requester') throw new TypeError('Invalid goal milestone target role');
        result.targetRole = 'requester';
      }
    }
    return result;
  });
  return { version: 1, milestones };
}

function progress(goal) {
  try {
    const plan = normalizeWorldGoalPlan(goal?.plan), completed = goal.completedMilestones;
    if (!denseArray(completed, plan.milestones.length) || !Array.isArray(goal.receipts)) return null;
    const used = new Set();
    for (let index = 0; index < completed.length; index++) {
      const item = completed[index]; fields(item, ['index', 'requestId']);
      agentIdentifier(item.requestId, 'milestone receipt ID');
      if (item.index !== index || used.has(item.requestId)) return null;
      const receipts = goal.receipts.filter(receipt => receipt?.requestId === item.requestId);
      if (receipts.length !== 1) return null;
      const receipt = receipts[0], milestone = plan.milestones[index];
      if (receipt.type !== milestone.type || receipt.status !== (milestone.type === 'stop' ? 'stopped' : 'arrived')) return null;
      if (milestone.type === 'stop') {
        if (Object.hasOwn(receipt, 'targetId')) return null;
      } else {
        text(receipt.targetId, 320);
        if (milestone.targetRole !== 'requester' && receipt.targetId !== milestone.targetId) return null;
      }
      // A requester's earlier identity belongs to its receipt. The store proved
      // that identity against the acknowledged action before appending progress.
      used.add(item.requestId);
    }
    return { plan, count: completed.length };
  } catch { return null; }
}

export function activeWorldGoalMilestone(goal) {
  const state = progress(goal);
  if (!state || state.count === state.plan.milestones.length) return null;
  const milestone = state.plan.milestones[state.count], intent = { type: milestone.type };
  if (milestone.type !== 'stop') {
    try { intent.targetId = text(milestone.targetRole === 'requester' ? goal.requesterId : milestone.targetId, 320); }
    catch { return null; }
  }
  return { index: state.count, milestone, intent };
}

export function worldGoalMilestoneMatchesAction(goal, action) {
  const active = activeWorldGoalMilestone(goal);
  return !!active && action?.milestoneIndex === active.index && action.intent?.type === active.intent.type
    && action.intent.targetId === active.intent.targetId;
}

export function worldGoalMilestonesComplete(goal) {
  const state = progress(goal);
  return !!state && state.count === state.plan.milestones.length;
}
