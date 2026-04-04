export {
  angleDelta,
  approachAngle,
  bearingTo,
  clamp,
  createDeterministicRng,
  distance2d,
  distance3d,
  normalizeAngle,
  pitchTo
} from './math.mjs';

export {
  DEFAULT_STALE_PEER_MS,
  DEFAULT_Q3_CAPABILITIES,
  normalizeQuake3Snapshot
} from './world-model.mjs';

export {
  createArenaBotState,
  createQuake3BotState,
  decideArenaBotAction,
  decideQuake3BotAction,
  scoreQuake3Goals
} from './bot-core.mjs';

export {
  DEFAULT_Q3_PERSONALITY,
  Q3_PERSONALITY_PRESETS,
  createQuake3BotPersonality,
  resolveQuake3PersonalityName
} from './personalities.mjs';

export {
  rememberRecentId,
  recentPenaltyForId
} from './memory.mjs';

export {
  adjustTargetForHazards,
  selectRouteTarget
} from './navigation.mjs';
