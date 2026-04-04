import { clamp, createDeterministicRng } from './math.mjs';

export const DEFAULT_Q3_PERSONALITY = Object.freeze({
  aggressiveness: 0.72,
  preferredRange: 9,
  retreatRange: 4.25,
  chaseRange: 18,
  attackFov: 0.46,
  turnStep: 0.22,
  pitchStep: 0.12,
  roamRadius: 9,
  roamTurnStep: 0.16,
  strafeFlipMinMs: 1400,
  strafeFlipJitterMs: 900,
  jumpIntervalMs: 1500,
  jumpJitterMs: 1200,
  retargetMs: 1800,
  primaryCooldownMs: 500,
  routeSearchDistance: 14,
  routeMemoryMs: 6000,
  goalMemoryMs: 7000,
  pickupBias: 1,
  objectiveBias: 1,
  hazardAvoidance: 1
});

export const Q3_PERSONALITY_PRESETS = Object.freeze({
  arena: {},
  aggressor: {
    aggressiveness: 0.92,
    preferredRange: 7.5,
    retreatRange: 3.4,
    chaseRange: 23,
    attackFov: 0.58,
    primaryCooldownMs: 320,
    pickupBias: 0.8,
    objectiveBias: 0.7,
    hazardAvoidance: 0.7
  },
  skirmisher: {
    aggressiveness: 0.68,
    preferredRange: 10.5,
    retreatRange: 4.8,
    chaseRange: 19,
    strafeFlipMinMs: 900,
    strafeFlipJitterMs: 650,
    jumpIntervalMs: 1200,
    jumpJitterMs: 700,
    primaryCooldownMs: 420,
    routeSearchDistance: 16
  },
  scavenger: {
    aggressiveness: 0.48,
    preferredRange: 9.5,
    retreatRange: 5.4,
    chaseRange: 15,
    primaryCooldownMs: 650,
    pickupBias: 1.45,
    objectiveBias: 1.15,
    hazardAvoidance: 1.25,
    goalMemoryMs: 9000,
    routeMemoryMs: 8000
  },
  sentinel: {
    aggressiveness: 0.6,
    preferredRange: 11.5,
    retreatRange: 4.4,
    chaseRange: 14,
    roamRadius: 6.5,
    primaryCooldownMs: 540,
    objectiveBias: 1.35,
    pickupBias: 0.9,
    hazardAvoidance: 1.4
  }
});

const blend = (min, max, factor) => min + ((max - min) * factor);

export const resolveQuake3PersonalityName = (requested = 'arena') => {
  const normalized = String(requested || 'arena').trim().toLowerCase();
  if (normalized && Q3_PERSONALITY_PRESETS[normalized]) {
    return normalized;
  }
  return 'arena';
};

export const createQuake3BotPersonality = (seed = 1, options = {}) => {
  const source = (options && typeof options === 'object') ? options : {};
  const presetName = resolveQuake3PersonalityName(source.preset || source.name || 'arena');
  const preset = Q3_PERSONALITY_PRESETS[presetName] || Q3_PERSONALITY_PRESETS.arena;
  const rng = createDeterministicRng(seed + 73);
  const jittered = {
    aggressiveness: clamp(blend(0.58, 0.9, rng()), 0.25, 1),
    preferredRange: blend(7, 12, rng()),
    retreatRange: blend(3.2, 5.8, rng()),
    chaseRange: blend(15, 22, rng()),
    attackFov: blend(0.34, 0.58, rng()),
    roamRadius: blend(8, 15, rng())
  };
  const overrides = { ...source };
  delete overrides.preset;
  delete overrides.name;
  return {
    ...DEFAULT_Q3_PERSONALITY,
    ...jittered,
    ...preset,
    ...overrides,
    preset: presetName
  };
};
