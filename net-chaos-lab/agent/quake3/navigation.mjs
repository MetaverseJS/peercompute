import { clamp, distance2d } from './math.mjs';
import { recentPenaltyForId } from './memory.mjs';

const hazardPenaltyAt = (world, position, hazardAvoidance = 1) => {
  if (!Array.isArray(world?.hazards) || !position) return 0;
  let penalty = 0;
  for (const hazard of world.hazards) {
    const distance = distance2d(position, hazard.position);
    const limit = Math.max(0, Number(hazard.radius || 0)) + 5;
    if (distance >= limit) continue;
    const overlap = (limit - distance) / Math.max(1, limit);
    penalty += overlap * overlap * 18 * Number(hazard.intensity || 1) * hazardAvoidance;
  }
  return penalty;
};

export const adjustTargetForHazards = (world, targetPosition, hazardAvoidance = 1) => {
  if (!targetPosition) return null;
  const adjusted = {
    x: Number(targetPosition.x || 0),
    y: Number(targetPosition.y || 0),
    z: Number(targetPosition.z || 0)
  };
  if (!Array.isArray(world?.hazards) || !world.localPosition) return adjusted;

  for (const hazard of world.hazards) {
    const distance = distance2d(world.localPosition, hazard.position);
    const limit = Math.max(0, Number(hazard.radius || 0)) + 4;
    if (distance >= limit) continue;
    const dx = adjusted.x - hazard.position.x;
    const dz = adjusted.z - hazard.position.z;
    const length = Math.hypot(dx, dz) || 1;
    const strength = ((limit - distance) / Math.max(1, limit)) * 4 * hazardAvoidance;
    adjusted.x += (dx / length) * strength;
    adjusted.z += (dz / length) * strength;
  }
  return adjusted;
};

export const selectRouteTarget = (
  world,
  state,
  targetPosition,
  goalId,
  nowMs,
  rng,
  personality
) => {
  if (!targetPosition || !world?.localPosition) {
    return { position: targetPosition, navPoint: null, usedNav: false };
  }

  const adjustedTarget = adjustTargetForHazards(world, targetPosition, personality.hazardAvoidance);
  const directDistance = distance2d(world.localPosition, adjustedTarget);
  if (!Array.isArray(world.navPoints) || world.navPoints.length === 0 || directDistance < personality.routeSearchDistance) {
    state.routeNavId = null;
    state.routeTargetId = goalId || null;
    return { position: adjustedTarget, navPoint: null, usedNav: false };
  }

  const retained = world.navPoints.find((navPoint) => navPoint.id === state.routeNavId);
  if (
    retained
    && state.routeTargetId === (goalId || null)
    && Number(state.routeUntil || 0) > nowMs
    && retained.distance2d > 2
  ) {
    return { position: retained.position, navPoint: retained, usedNav: true };
  }

  let best = null;
  for (const navPoint of world.navPoints) {
    const toGoal = distance2d(navPoint.position, adjustedTarget);
    const recentPenalty = recentPenaltyForId(state.navMemory, navPoint.id, nowMs, { maxPenalty: 16 });
    const hazardPenalty = hazardPenaltyAt(world, navPoint.position, personality.hazardAvoidance);
    const score = (
      (navPoint.distance2d * 0.65)
      + (toGoal * 0.9)
      + recentPenalty
      + hazardPenalty
      - clamp(directDistance - toGoal, 0, 30) * 0.55
    );
    if (!best || score < best.score) {
      best = { navPoint, score, toGoal };
    }
  }

  if (!best) {
    state.routeNavId = null;
    state.routeTargetId = goalId || null;
    return { position: adjustedTarget, navPoint: null, usedNav: false };
  }

  const shouldUseNav = (
    best.toGoal + best.navPoint.distance2d < (directDistance * 1.6)
    || directDistance > personality.routeSearchDistance * 1.6
  );
  if (!shouldUseNav) {
    state.routeNavId = null;
    state.routeTargetId = goalId || null;
    return { position: adjustedTarget, navPoint: null, usedNav: false };
  }

  state.routeTargetId = goalId || null;
  state.routeNavId = best.navPoint.id;
  state.routeUntil = nowMs + 2600 + Math.floor((rng?.() || 0) * 600);
  return { position: best.navPoint.position, navPoint: best.navPoint, usedNav: true };
};
