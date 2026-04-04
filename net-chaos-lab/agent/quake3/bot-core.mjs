import {
  angleDelta,
  approachAngle,
  bearingTo,
  createDeterministicRng,
  distance2d,
  pitchTo
} from './math.mjs';
import { normalizeQuake3Snapshot } from './world-model.mjs';
import {
  createQuake3BotPersonality,
  resolveQuake3PersonalityName
} from './personalities.mjs';
import { recentPenaltyForId, rememberRecentId } from './memory.mjs';
import { selectRouteTarget } from './navigation.mjs';

export const createQuake3BotState = (seed = 1, options = {}) => {
  const rng = createDeterministicRng(seed);
  const source = options && typeof options === 'object' ? options : {};
  const personality = createQuake3BotPersonality(seed, source.personality || source);
  const personalityName = resolveQuake3PersonalityName(
    source.personality?.preset || source.personality?.name || source.preset || source.name || personality.preset
  );
  return {
    seed,
    personality,
    personalityName,
    anchor: null,
    targetId: null,
    goalId: null,
    goalType: 'bootstrap',
    mode: 'bootstrap',
    nextRetargetAt: 0,
    strafeDir: rng() < 0.5 ? -1 : 1,
    nextStrafeFlipAt: Math.floor(
      personality.strafeFlipMinMs + (rng() * personality.strafeFlipJitterMs)
    ),
    nextJumpAt: Math.floor(personality.jumpIntervalMs + (rng() * personality.jumpJitterMs)),
    patrolAngle: rng() * Math.PI * 2,
    patrolNavId: null,
    nextPatrolRetargetAt: 0,
    lastLocalPosition: null,
    stuckTicks: 0,
    nextPrimaryAt: 0,
    goalMemory: [],
    navMemory: [],
    routeNavId: null,
    routeTargetId: null,
    routeUntil: 0
  };
};

export const createArenaBotState = createQuake3BotState;

const idleAction = (world) => ({
  goalType: 'idle',
  mode: 'idle',
  rotation: Number(world?.localRotation || 0),
  pitch: Number(world?.localPitch || 0),
  forward: 0,
  strafe: 0,
  jump: false,
  descend: false,
  primary: false,
  interact: false,
  targetId: null,
  goalId: null,
  distanceToTarget: null
});

const syncPersonalityFromMetadata = (world, state) => {
  const requestedName = resolveQuake3PersonalityName(
    world?.metadata?.botPersonality || world?.metadata?.botPreset || state.personalityName
  );
  const metadataOverrides = (
    world?.metadata?.botPersonalityOverrides
    && typeof world.metadata.botPersonalityOverrides === 'object'
  )
    ? world.metadata.botPersonalityOverrides
    : null;
  if (
    requestedName === state.personalityName
    && !metadataOverrides
  ) {
    return;
  }
  state.personalityName = requestedName;
  state.personality = createQuake3BotPersonality(state.seed, {
    preset: requestedName,
    ...(metadataOverrides || {})
  });
};

const refreshMotionState = (world, state, nowMs, rng) => {
  if (!world.localPosition) return;
  if (!state.anchor) {
    state.anchor = {
      x: world.localPosition.x,
      y: world.localPosition.y,
      z: world.localPosition.z
    };
  }

  if (state.lastLocalPosition) {
    const moved = distance2d(world.localPosition, state.lastLocalPosition);
    state.stuckTicks = moved < 0.15 ? state.stuckTicks + 1 : 0;
  }
  state.lastLocalPosition = {
    x: world.localPosition.x,
    y: world.localPosition.y,
    z: world.localPosition.z
  };

  if (nowMs >= state.nextStrafeFlipAt) {
    state.strafeDir *= -1;
    state.nextStrafeFlipAt = nowMs
      + state.personality.strafeFlipMinMs
      + Math.floor(rng() * state.personality.strafeFlipJitterMs);
  }
};

const selectCombatTarget = (world, state, nowMs) => {
  const peers = world.visiblePeers.length ? world.visiblePeers : world.freshPeers;
  if (!peers.length) {
    state.targetId = null;
    return null;
  }

  if (state.targetId && nowMs < state.nextRetargetAt) {
    const retained = peers.find((peer) => peer.id === state.targetId);
    if (retained) return retained;
  }

  const scored = peers
    .map((peer) => {
      const score = (
        (state.personality.aggressiveness * 18)
        + Math.max(0, 22 - peer.distance2d)
        + (peer.threat * 6)
        + (peer.id === state.targetId ? 2 : 0)
      );
      return { peer, score };
    })
    .sort((left, right) => right.score - left.score);

  const next = scored[0]?.peer || null;
  state.targetId = next?.id || null;
  state.nextRetargetAt = nowMs + state.personality.retargetMs;
  return next;
};

const scorePickupGoal = (world, state, nowMs) => {
  if (!world.items.length) return null;
  const localHealth = world.localHealth;
  const desiredKinds = [];
  if (localHealth !== null && localHealth < 0.55) {
    desiredKinds.push('health', 'armor');
  }
  desiredKinds.push('weapon', 'powerup', 'generic');

  let best = null;
  for (const item of world.items) {
    const kindBias = desiredKinds.includes(item.kind) ? 1.4 : 1;
    const recencyPenalty = recentPenaltyForId(state.goalMemory, item.id, nowMs, { maxPenalty: 14 });
    const score = (
      (item.value * 8 * kindBias * state.personality.pickupBias)
      - item.distance2d
      - recencyPenalty
    );
    if (!best || score > best.score) {
      best = { type: 'pickup', score, target: item };
    }
  }
  return best;
};

const scoreObjectiveGoal = (world, state, nowMs) => {
  if (!world.objectives.length) return null;
  let best = null;
  for (const target of world.objectives) {
    const recencyPenalty = recentPenaltyForId(state.goalMemory, target.id, nowMs, { maxPenalty: 12 });
    const score = Math.max(
      4,
      ((14 + (target.value * 2) - target.distance2d) * state.personality.objectiveBias) - recencyPenalty
    );
    if (!best || score > best.score) {
      best = {
        type: 'objective',
        score,
        target
      };
    }
  }
  return best;
};

export const scoreQuake3Goals = (world, state, nowMs) => {
  const goals = [];
  const combatTarget = selectCombatTarget(world, state, nowMs);
  if (combatTarget) {
    const combatScore = 28 + (state.personality.aggressiveness * 12) - (combatTarget.distance2d * 0.4);
    goals.push({
      type: world.localHealth !== null && world.localHealth < 0.28 ? 'retreat' : 'combat',
      score: combatScore,
      target: combatTarget
    });
  }

  const pickupGoal = scorePickupGoal(world, state, nowMs);
  if (pickupGoal) goals.push(pickupGoal);

  const objectiveGoal = scoreObjectiveGoal(world, state, nowMs);
  if (objectiveGoal) goals.push(objectiveGoal);

  goals.push({
    type: 'roam',
    score: 6,
    target: null
  });

  return goals.sort((left, right) => right.score - left.score);
};

const choosePatrolTarget = (world, state, nowMs, rng) => {
  if (world.navPoints.length) {
    const retained = world.navPoints.find((navPoint) => navPoint.id === state.patrolNavId);
    if (retained && nowMs < state.nextPatrolRetargetAt && retained.distance2d > 2) {
      return retained.position;
    }
    const next = world.navPoints[Math.floor(rng() * world.navPoints.length)] || world.navPoints[0];
    if (next) {
      state.patrolNavId = next.id;
      state.nextPatrolRetargetAt = nowMs + 2200;
      return next.position;
    }
  }

  const patrolRadius = state.personality.roamRadius;
  const waypoint = {
    x: state.anchor.x + (Math.cos(state.patrolAngle) * patrolRadius),
    y: world.localPosition.y,
    z: state.anchor.z + (Math.sin(state.patrolAngle) * patrolRadius)
  };
  if (distance2d(world.localPosition, waypoint) < 2.5) {
    state.patrolAngle += 0.9 + (rng() * 0.7);
  }
  return waypoint;
};

const buildTraverseAction = (world, state, nowMs, rng, targetPosition, mode, goalType, goalId) => {
  const route = selectRouteTarget(world, state, targetPosition, goalId, nowMs, rng, state.personality);
  const effectiveTarget = route.position || targetPosition;
  const desiredYaw = bearingTo(world.localPosition, effectiveTarget);
  const desiredPitch = Math.max(-0.35, Math.min(0.35, pitchTo(world.localPosition, effectiveTarget)));
  const angleError = angleDelta(world.localRotation, desiredYaw);
  let forward = Math.abs(angleError) < 1.1 ? 1 : 0.45;
  let strafe = Math.max(-0.55, Math.min(0.55, angleError * 0.55));

  if (state.stuckTicks >= 4) {
    forward = 0.9;
    strafe = state.strafeDir;
    state.strafeDir *= -1;
    state.stuckTicks = 0;
    mode = 'unstick';
  }

  let jump = false;
  if (nowMs >= state.nextJumpAt && rng() > 0.7) {
    jump = true;
    state.nextJumpAt = nowMs
      + state.personality.jumpIntervalMs
      + Math.floor(rng() * state.personality.jumpJitterMs);
  }

  if (world.capabilities.verticalMovement && effectiveTarget.y > world.localPosition.y + 2) {
    jump = true;
  }

  const descend = Boolean(
    world.capabilities.descend
    && world.capabilities.verticalMovement
    && effectiveTarget.y < world.localPosition.y - 2
  );

  if (!route.usedNav && goalId && distance2d(world.localPosition, targetPosition) < 1.8) {
    state.goalMemory = rememberRecentId(state.goalMemory, goalId, nowMs, {
      ttlMs: state.personality.goalMemoryMs,
      maxEntries: 10,
      meta: { goalType }
    });
  }
  if (route.usedNav && route.navPoint && route.navPoint.distance2d < 2.2) {
    state.navMemory = rememberRecentId(state.navMemory, route.navPoint.id, nowMs, {
      ttlMs: state.personality.routeMemoryMs,
      maxEntries: 12,
      meta: { goalId }
    });
    state.routeNavId = null;
  }

  state.goalType = goalType;
  state.goalId = goalId || null;
  state.mode = mode;

  return {
    goalType,
    mode,
    rotation: approachAngle(world.localRotation, desiredYaw, state.personality.roamTurnStep),
    pitch: approachAngle(world.localPitch, desiredPitch, state.personality.pitchStep),
    forward,
    strafe,
    jump,
    descend,
    primary: false,
    interact: world.capabilities.interact && distance2d(world.localPosition, targetPosition) < 1.8,
    targetId: goalId || null,
    goalId: goalId || null,
    routeNavId: route.navPoint?.id || null,
    distanceToTarget: distance2d(world.localPosition, targetPosition)
  };
};

const buildCombatAction = (world, state, nowMs, rng, goal) => {
  const target = goal.target;
  if (!target?.position) return idleAction(world);

  const route = selectRouteTarget(world, state, target.position, target.id, nowMs, rng, state.personality);
  const steeringTarget = route.usedNav ? route.position : target.position;
  const desiredYaw = bearingTo(world.localPosition, steeringTarget);
  const desiredPitch = Math.max(-0.45, Math.min(0.45, pitchTo(world.localPosition, target.position)));
  const distance = target.distance2d;
  const primaryRange = Number(world.capabilities.primaryRange || target.primaryRange || state.personality.preferredRange);
  const aimError = Math.abs(angleDelta(world.localRotation, desiredYaw));

  let mode = 'strafe';
  let forward = 0.2;
  let strafe = 0.9 * state.strafeDir;
  let rotation = approachAngle(
    world.localRotation,
    desiredYaw + (state.strafeDir * Math.max(-0.3, Math.min(0.3, (state.personality.preferredRange - distance) * 0.03))),
    state.personality.turnStep
  );

  if (distance > state.personality.chaseRange) {
    mode = 'pursue';
    forward = 1;
    strafe = 0.2 * state.strafeDir;
    rotation = approachAngle(world.localRotation, desiredYaw, state.personality.turnStep + 0.04);
  } else if (distance > state.personality.preferredRange + 1.5) {
    mode = 'close-in';
    forward = 0.95;
    strafe = 0.4 * state.strafeDir;
  } else if (goal.type === 'retreat' || distance < state.personality.retreatRange) {
    mode = 'retreat';
    forward = -0.6;
    strafe = state.strafeDir;
  }

  if (state.stuckTicks >= 3) {
    mode = 'unstick';
    forward = 1;
    strafe = state.strafeDir;
    state.strafeDir *= -1;
    state.stuckTicks = 0;
    state.nextStrafeFlipAt = nowMs + 900;
  }

  let jump = false;
  if (nowMs >= state.nextJumpAt && (distance < state.personality.preferredRange + 4 || mode === 'unstick')) {
    jump = rng() > 0.4;
    state.nextJumpAt = nowMs
      + state.personality.jumpIntervalMs
      + Math.floor(rng() * state.personality.jumpJitterMs);
  }

  const primary = Boolean(
    world.capabilities.primaryAttack
    && distance <= primaryRange
    && aimError <= state.personality.attackFov
    && nowMs >= Number(state.nextPrimaryAt || 0)
  );
  if (primary) {
    state.nextPrimaryAt = nowMs + state.personality.primaryCooldownMs;
  }

  if (route.usedNav && route.navPoint && route.navPoint.distance2d < 2.2) {
    state.navMemory = rememberRecentId(state.navMemory, route.navPoint.id, nowMs, {
      ttlMs: state.personality.routeMemoryMs,
      maxEntries: 12,
      meta: { goalId: target.id }
    });
    state.routeNavId = null;
  }

  const descend = Boolean(
    world.capabilities.descend
    && world.capabilities.verticalMovement
    && target.position.y < world.localPosition.y - 2
  );
  if (world.capabilities.verticalMovement && target.position.y > world.localPosition.y + 2) {
    jump = true;
  }

  state.goalType = goal.type;
  state.goalId = target.id;
  state.mode = mode;

  return {
    goalType: goal.type,
    mode,
    rotation,
    pitch: approachAngle(world.localPitch, desiredPitch, state.personality.pitchStep),
    forward,
    strafe,
    jump,
    descend,
    primary,
    interact: false,
    targetId: target.id,
    goalId: target.id,
    routeNavId: route.navPoint?.id || null,
    distanceToTarget: distance,
    aimError
  };
};

export const decideQuake3BotAction = (
  snapshot,
  state,
  nowMs,
  rng = createDeterministicRng(state?.seed || 1)
) => {
  const world = normalizeQuake3Snapshot(snapshot);
  if (!world.localPosition || !state) {
    return idleAction(world);
  }

  syncPersonalityFromMetadata(world, state);
  refreshMotionState(world, state, nowMs, rng);
  const [goal] = scoreQuake3Goals(world, state, nowMs);
  if (!goal) {
    return idleAction(world);
  }

  if (goal.type === 'combat' || goal.type === 'retreat') {
    return buildCombatAction(world, state, nowMs, rng, goal);
  }

  if (goal.type === 'pickup' || goal.type === 'objective') {
    return buildTraverseAction(
      world,
      state,
      nowMs,
      rng,
      goal.target.position,
      goal.type,
      goal.type,
      goal.target.id
    );
  }

  const patrolTarget = choosePatrolTarget(world, state, nowMs, rng);
  return buildTraverseAction(world, state, nowMs, rng, patrolTarget, 'patrol', 'roam', null);
};

export const decideArenaBotAction = decideQuake3BotAction;
