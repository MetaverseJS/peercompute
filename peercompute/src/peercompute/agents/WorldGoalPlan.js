import { agentIdentifier } from './AgentContracts.js';

export const WORLD_GOAL_PLAN_LIMITS = Object.freeze({ maxMilestones: 6, maxLabelBytes: 64 });
const ACTIONS = new Set(['approach', 'look-at', 'move-to', 'stop']);
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

/** Fixed destinations are detached, dense triplets. A world adapter must also
 * authorize their terrain and movement bounds before an action is dispatched. */
export function normalizeWorldGoalPosition(value) {
  if (!denseArray(value, 3) || Object.getPrototypeOf(value) !== Array.prototype || value.length !== 3
      || value.some(coordinate => !Number.isFinite(coordinate) || Math.abs(coordinate) > 1e8)) {
    throw new TypeError('Goal position must contain three bounded coordinates');
  }
  return [...value];
}

function samePosition(a, b) {
  try {
    const left = normalizeWorldGoalPosition(a), right = normalizeWorldGoalPosition(b);
    return left.every((coordinate, index) => coordinate === right[index]);
  } catch { return false; }
}

/** Durable plans contain fixed points, resolved identities, or the explicit
 * requester role. The observation-aware caller resolves all temporary aliases. */
export function normalizeWorldGoalPlan(value) {
  fields(value, ['version', 'milestones']);
  if (value.version !== 1 || !denseArray(value.milestones, WORLD_GOAL_PLAN_LIMITS.maxMilestones) || !value.milestones.length) {
    throw new TypeError('Invalid bounded goal milestone plan');
  }
  const milestones = value.milestones.map(milestone => {
    fields(milestone, ['label', 'type', 'targetId', 'targetRole', 'position']);
    if (!ACTIONS.has(milestone.type)) throw new TypeError('Invalid goal milestone action');
    const result = { label: text(milestone.label, WORLD_GOAL_PLAN_LIMITS.maxLabelBytes), type: milestone.type };
    const hasId = Object.hasOwn(milestone, 'targetId'), hasRole = Object.hasOwn(milestone, 'targetRole');
    const hasPosition = Object.hasOwn(milestone, 'position');
    if (milestone.type === 'stop') {
      if (hasId || hasRole || hasPosition) throw new TypeError('Goal stop milestone has no target');
    } else if (milestone.type === 'move-to') {
      if (hasId || hasRole) throw new TypeError('Goal point milestone has no participant target');
      result.position = normalizeWorldGoalPosition(milestone.position);
    } else {
      if (hasPosition) throw new TypeError('Goal participant milestone has no position');
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
        if (Object.hasOwn(receipt, 'targetId') || Object.hasOwn(receipt, 'targetPosition')) return null;
      } else if (milestone.type === 'move-to') {
        if (Object.hasOwn(receipt, 'targetId') || !samePosition(receipt.targetPosition, milestone.position)) return null;
        normalizeWorldGoalPosition(receipt.position);
      } else {
        if (Object.hasOwn(receipt, 'targetPosition')) return null;
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
  if (milestone.type === 'move-to') intent.position = [...milestone.position];
  else if (milestone.type !== 'stop') {
    try { intent.targetId = text(milestone.targetRole === 'requester' ? goal.requesterId : milestone.targetId, 320); }
    catch { return null; }
  }
  return { index: state.count, milestone, intent };
}

export function worldGoalMilestoneMatchesAction(goal, action) {
  const active = activeWorldGoalMilestone(goal);
  return !!active && action?.milestoneIndex === active.index && action.intent?.type === active.intent.type
    && action.intent.targetId === active.intent.targetId
    && (active.intent.type === 'move-to' ? samePosition(action.intent.position, active.intent.position)
      : !Object.hasOwn(action.intent, 'position'));
}

export function worldGoalMilestonesComplete(goal) {
  const state = progress(goal);
  return !!state && state.count === state.plan.milestones.length;
}
