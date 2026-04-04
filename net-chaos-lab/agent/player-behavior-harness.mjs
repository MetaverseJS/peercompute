import {
  angleDelta,
  createArenaBotState,
  createDeterministicRng,
  createQuake3BotState,
  decideArenaBotAction,
  decideQuake3BotAction,
  normalizeAngle
} from './quake3/index.mjs';

const DEFAULT_SIMULATION_MS = 2500;
const DEFAULT_TICK_MS = 120;
const MAX_LOG_ENTRIES = 24;
const BOT_BRIDGE_REGISTRY_KEY = '__PEERCOMPUTE_BOT_BRIDGES__';
const BOT_BRIDGE_LAST_KEY = '__PEERCOMPUTE_LAST_BOT_BRIDGE__';

const pushSimulationLog = (entries, value) => {
  if (!value) return;
  entries.push(String(value));
  while (entries.length > MAX_LOG_ENTRIES) entries.shift();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clickFirst = async (page, selectors, simulationLog) => {
  for (const selector of selectors) {
    try {
      const handle = await page.$(selector);
      if (!handle) continue;
      await handle.click({ force: true });
      pushSimulationLog(simulationLog, `click:${selector}`);
      return selector;
    } catch (_) {
      // Try the next selector.
    }
  }
  return null;
};

const KEYBOARD_PRESETS = {
  basic: {
    clickSelectors: ['canvas', '#gameCanvas', '#scene-container', '#canvas3d', 'body'],
    keys: {
      forward: 'KeyW',
      back: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
      turnLeft: 'ArrowLeft',
      turnRight: 'ArrowRight',
      jump: 'Space',
      interact: null
    }
  },
  cubechat: {
    clickSelectors: ['#scene-container', 'canvas', '#settings-close-x', '#close-settings', 'body'],
    keys: {
      forward: 'KeyW',
      back: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
      turnLeft: 'ArrowLeft',
      turnRight: 'ArrowRight',
      jump: 'Space',
      interact: null
    }
  },
  hyperborea: {
    clickSelectors: ['canvas', '#gameCanvas', '#scene-container', 'body'],
    keys: {
      forward: 'KeyW',
      back: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
      turnLeft: 'ArrowLeft',
      turnRight: 'ArrowRight',
      jump: 'Space',
      interact: 'KeyF'
    }
  },
  sneakywoods: {
    clickSelectors: ['canvas', '#gameCanvas', '#scene-container', 'body'],
    keys: {
      forward: 'KeyW',
      back: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
      turnLeft: 'ArrowLeft',
      turnRight: 'ArrowRight',
      jump: 'Space',
      interact: 'Space'
    }
  },
  daddygo: {
    clickSelectors: ['#canvas3d', 'canvas', '#scene-container', 'body'],
    keys: {
      forward: 'ArrowUp',
      back: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      turnLeft: 'ArrowLeft',
      turnRight: 'ArrowRight',
      jump: 'Space',
      interact: 'Space'
    }
  }
};

export const buildKeyboardBehaviorPlan = (
  profile,
  { durationMs = DEFAULT_SIMULATION_MS, seed = 1 } = {}
) => {
  const selected = String(profile || 'basic').trim().toLowerCase();
  const preset = KEYBOARD_PRESETS[selected] || KEYBOARD_PRESETS.basic;
  const rng = createDeterministicRng(seed);
  const leftFirst = rng() < 0.5;
  const turnLeftFirst = rng() < 0.5;
  const baseHold = 220 + Math.floor(rng() * 90);
  const steps = [
    { kind: 'click', selectors: preset.clickSelectors, label: 'focus' },
    { kind: 'hold', keys: [preset.keys.forward], ms: baseHold + 120, label: 'advance' },
    {
      kind: 'hold',
      keys: [
        preset.keys.forward,
        leftFirst ? preset.keys.left : preset.keys.right
      ],
      ms: baseHold + 160,
      label: leftFirst ? 'strafe-left' : 'strafe-right'
    },
    {
      kind: 'hold',
      keys: [turnLeftFirst ? preset.keys.turnLeft : preset.keys.turnRight],
      ms: baseHold,
      label: turnLeftFirst ? 'snap-left' : 'snap-right'
    },
    {
      kind: 'hold',
      keys: [
        preset.keys.forward,
        leftFirst ? preset.keys.right : preset.keys.left,
        preset.keys.jump
      ].filter(Boolean),
      ms: baseHold + 80,
      label: 'jump-peek'
    },
    {
      kind: 'hold',
      keys: [preset.keys.back, leftFirst ? preset.keys.left : preset.keys.right],
      ms: baseHold,
      label: 'retreat'
    }
  ];

  if (preset.keys.interact) {
    steps.push({
      kind: 'hold',
      keys: [preset.keys.interact],
      ms: 140,
      label: 'interact'
    });
  }

  const minimumBudget = steps.reduce((total, step) => total + (step.ms || 0), 0);
  const targetBudget = Math.max(minimumBudget, Math.max(0, Math.floor(durationMs || 0)));
  const plan = [];
  let spent = 0;

  while (spent < targetBudget) {
    for (const step of steps) {
      if (spent >= targetBudget) break;
      const next = { ...step };
      if (next.kind === 'hold') {
        next.ms = Math.min(next.ms, targetBudget - spent);
        spent += next.ms;
      }
      plan.push(next);
    }
  }

  return plan.filter((step) => step.kind !== 'hold' || step.ms > 0);
};

export { angleDelta, createArenaBotState, createDeterministicRng, normalizeAngle };
export const createCubechatArenaState = createQuake3BotState;
export const decideCubechatArenaAction = decideQuake3BotAction;

const cubechatActionToKeyState = (action) => ({
  w: Number(action?.forward || 0) > 0.25,
  s: Number(action?.forward || 0) < -0.25,
  a: Number(action?.strafe || 0) < -0.25,
  d: Number(action?.strafe || 0) > 0.25,
  ' ': Boolean(action?.jump)
});

const clearKeyboardKeys = async (page, keys) => {
  const unique = [...new Set((keys || []).filter(Boolean))];
  for (const key of unique) {
    try {
      await page.keyboard.up(key);
    } catch (_) {
      // Ignore stale key-up errors.
    }
  }
};

const runKeyboardPlan = async (page, profile, durationMs, simulationLog) => {
  const seed = Date.now() % 2147483647;
  const plan = buildKeyboardBehaviorPlan(profile, { durationMs, seed });
  const activeKeys = new Set();
  try {
    for (const step of plan) {
      if (step.kind === 'click') {
        await clickFirst(page, step.selectors || [], simulationLog);
        continue;
      }
      const keys = Array.isArray(step.keys) ? step.keys.filter(Boolean) : [];
      pushSimulationLog(simulationLog, `step:${step.label}`);
      for (const key of keys) {
        activeKeys.add(key);
        await page.keyboard.down(key);
      }
      await sleep(Math.max(10, Number(step.ms || 0)));
      for (const key of keys) {
        await page.keyboard.up(key);
        activeKeys.delete(key);
      }
    }
  } finally {
    await clearKeyboardKeys(page, [...activeKeys]);
  }

  return {
    driver: 'keyboard-plan',
    behavior: 'arena-phases',
    seed,
    plan
  };
};

const hasBotBridge = async (page, bridgeId) => {
  return page.evaluate(({ bridgeId: preferredId, registryKey, lastKey }) => {
    const registry = window[registryKey];
    if (!registry || typeof registry !== 'object') return false;
    const normalizedId = String(preferredId || '').trim().toLowerCase();
    const bridge = (
      (normalizedId && registry[normalizedId])
      || (window[lastKey] && registry[window[lastKey]])
      || null
    );
    return Boolean(
      bridge
      && typeof bridge.snapshot === 'function'
      && typeof bridge.applyAction === 'function'
      && typeof bridge.clearAction === 'function'
    );
  }, {
    bridgeId,
    registryKey: BOT_BRIDGE_REGISTRY_KEY,
    lastKey: BOT_BRIDGE_LAST_KEY
  });
};

const readBotBridgeSnapshot = async (page, bridgeId) => {
  return page.evaluate(({ bridgeId: preferredId, registryKey, lastKey }) => {
    const registry = window[registryKey];
    if (!registry || typeof registry !== 'object') return null;
    const normalizedId = String(preferredId || '').trim().toLowerCase();
    const bridge = (
      (normalizedId && registry[normalizedId])
      || (window[lastKey] && registry[window[lastKey]])
      || null
    );
    if (!bridge || typeof bridge.snapshot !== 'function') return null;
    return bridge.snapshot() || null;
  }, {
    bridgeId,
    registryKey: BOT_BRIDGE_REGISTRY_KEY,
    lastKey: BOT_BRIDGE_LAST_KEY
  });
};

const applyBotBridgeAction = async (page, bridgeId, action) => {
  return page.evaluate(({ bridgeId: preferredId, action: nextAction, registryKey, lastKey }) => {
    const registry = window[registryKey];
    if (!registry || typeof registry !== 'object') return false;
    const normalizedId = String(preferredId || '').trim().toLowerCase();
    const bridge = (
      (normalizedId && registry[normalizedId])
      || (window[lastKey] && registry[window[lastKey]])
      || null
    );
    if (!bridge || typeof bridge.applyAction !== 'function') return false;
    return Boolean(bridge.applyAction(nextAction));
  }, {
    bridgeId,
    action,
    registryKey: BOT_BRIDGE_REGISTRY_KEY,
    lastKey: BOT_BRIDGE_LAST_KEY
  });
};

const clearBotBridgeAction = async (page, bridgeId) => {
  return page.evaluate(({ bridgeId: preferredId, registryKey, lastKey }) => {
    const registry = window[registryKey];
    if (!registry || typeof registry !== 'object') return false;
    const normalizedId = String(preferredId || '').trim().toLowerCase();
    const bridge = (
      (normalizedId && registry[normalizedId])
      || (window[lastKey] && registry[window[lastKey]])
      || null
    );
    if (!bridge || typeof bridge.clearAction !== 'function') return false;
    return Boolean(bridge.clearAction());
  }, {
    bridgeId,
    registryKey: BOT_BRIDGE_REGISTRY_KEY,
    lastKey: BOT_BRIDGE_LAST_KEY
  });
};

const runBridgeArenaHarness = async (page, bridgeId, durationMs, simulationLog) => {
  const preset = KEYBOARD_PRESETS[bridgeId] || KEYBOARD_PRESETS.basic;
  if (bridgeId === 'cubechat') {
    await page.evaluate(() => {
      const loading = document.getElementById('loading');
      if (loading) loading.style.display = 'none';
    });
  }
  await clickFirst(page, preset.clickSelectors || KEYBOARD_PRESETS.basic.clickSelectors, simulationLog);

  const seed = Date.now() % 2147483647;
  const rng = createDeterministicRng(seed);
  const state = createArenaBotState(seed);
  const startedAt = Date.now();
  let tickCount = 0;
  let lastMode = '';
  let lastTargetId = null;
  try {
    while (Date.now() - startedAt < durationMs) {
      const snapshot = await readBotBridgeSnapshot(page, bridgeId);
      if (!snapshot?.localPosition) {
        await sleep(DEFAULT_TICK_MS);
        continue;
      }

      const action = decideArenaBotAction(snapshot, state, Date.now() - startedAt, rng);
      await applyBotBridgeAction(page, bridgeId, action);

      if (action.mode && action.mode !== lastMode) {
        pushSimulationLog(simulationLog, `mode:${action.mode}`);
        lastMode = action.mode;
      }
      if (action.targetId && action.targetId !== lastTargetId) {
        pushSimulationLog(simulationLog, `target:${action.targetId.slice(0, 8)}`);
        lastTargetId = action.targetId;
      }
      if (action.jump) {
        pushSimulationLog(simulationLog, 'jump');
      }
      if (action.primary) {
        pushSimulationLog(simulationLog, 'primary');
      }

      tickCount += 1;
      await sleep(DEFAULT_TICK_MS);
    }
  } finally {
    await clearBotBridgeAction(page, bridgeId);
  }

  const finalSnapshot = await readBotBridgeSnapshot(page, bridgeId);
  return {
    driver: 'peercompute-bot-bridge',
    behavior: 'quake3-bot-core',
    bridgeId,
    seed,
    tickCount,
    finalSnapshot
  };
};

const readCubechatSnapshot = async (page) => {
  return page.evaluate(() => {
    const app = window.__cubechat;
    const localId = app?.network?.localPlayer?.id || null;
    if (!app || !localId) return null;

    const physicsPosition = app.physics?.getPosition?.(localId) || null;
    const physicsVelocity = app.physics?.getVelocity?.(localId) || null;
    const peers = typeof app.network?.getPeers === 'function' ? app.network.getPeers() : [];

    return {
      localId,
      localPosition: physicsPosition || app.network?.localPlayer?.position || null,
      localVelocity: physicsVelocity || app.network?.localPlayer?.velocity || null,
      localRotation: Number(app.controller?.rotation || 0),
      localPitch: Number(app.controller?.pitch || 0),
      peerCount: Array.isArray(peers) ? peers.length : 0,
      peers: Array.isArray(peers)
        ? peers.map((peer) => ({
            id: peer?.id || null,
            position: peer?.position || null,
            hasMedia: Boolean(peer?.hasMedia),
            screenSharing: Boolean(peer?.screenSharing),
            lastSeenAgeMs: Number.isFinite(peer?.lastSeen) ? (Date.now() - peer.lastSeen) : null
          }))
        : []
    };
  });
};

const applyCubechatAction = async (page, action) => {
  const keyState = cubechatActionToKeyState(action);
  await page.evaluate(({ keyState: nextKeyState, rotation, pitch }) => {
    const app = window.__cubechat;
    if (!app?.controller) return false;
    const keys = app.controller.keys || {};
    Object.keys(nextKeyState).forEach((key) => {
      keys[key] = Boolean(nextKeyState[key]);
    });
    app.controller.keys = keys;
    if (Number.isFinite(rotation)) {
      app.controller.rotation = rotation;
    }
    if (Number.isFinite(pitch)) {
      app.controller.pitch = pitch;
    }
    return true;
  }, {
    keyState,
    rotation: Number(action?.rotation || 0),
    pitch: Number(action?.pitch || 0)
  });
};

const clearCubechatControls = async (page) => {
  await page.evaluate(() => {
    const app = window.__cubechat;
    if (!app?.controller?.keys) return false;
    ['w', 'a', 's', 'd', ' '].forEach((key) => {
      app.controller.keys[key] = false;
    });
    return true;
  });
};

const runCubechatArenaHarness = async (page, durationMs, simulationLog) => {
  await page.evaluate(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
  });
  await clickFirst(page, KEYBOARD_PRESETS.cubechat.clickSelectors, simulationLog);

  const seed = Date.now() % 2147483647;
  const rng = createDeterministicRng(seed);
  const state = createCubechatArenaState(seed);
  const startedAt = Date.now();
  let tickCount = 0;
  let lastMode = '';
  let lastTargetId = null;
  try {
    while (Date.now() - startedAt < durationMs) {
      const snapshot = await readCubechatSnapshot(page);
      if (!snapshot?.localPosition) {
        await sleep(DEFAULT_TICK_MS);
        continue;
      }

      const action = decideCubechatArenaAction(snapshot, state, Date.now() - startedAt, rng);
      await applyCubechatAction(page, action);

      if (action.mode && action.mode !== lastMode) {
        pushSimulationLog(simulationLog, `mode:${action.mode}`);
        lastMode = action.mode;
      }
      if (action.targetId && action.targetId !== lastTargetId) {
        pushSimulationLog(simulationLog, `target:${action.targetId.slice(0, 8)}`);
        lastTargetId = action.targetId;
      }
      if (action.jump) {
        pushSimulationLog(simulationLog, 'jump');
      }
      if (action.primary) {
        pushSimulationLog(simulationLog, 'primary');
      }

      tickCount += 1;
      await sleep(DEFAULT_TICK_MS);
    }
  } finally {
    await clearCubechatControls(page);
  }

  const finalSnapshot = await readCubechatSnapshot(page);
  return {
    driver: 'cubechat-controller',
    behavior: 'quake3-bot-core',
    seed,
    tickCount,
    finalSnapshot
  };
};

export const resolveSimulationProfile = (requestedProfile, url) => {
  const requested = String(requestedProfile || '').trim().toLowerCase();
  if (requested && requested !== 'auto') return requested;
  if (!url) return requested || 'none';

  let pathname = '';
  try {
    pathname = new URL(url).pathname || '';
  } catch (_) {
    pathname = '';
  }
  const normalized = pathname.toLowerCase();
  if (normalized.includes('/cubechat/')) return 'cubechat';
  if (normalized.includes('/daddygo/')) return 'daddygo';
  if (normalized.includes('/sneakywoods/')) return 'sneakywoods';
  if (normalized.includes('/hyperborea/')) return 'hyperborea';
  if (normalized.includes('/netviz/')) return 'none';
  return 'basic';
};

export const runSimulationProfile = async (page, profile, durationMs = 0) => {
  const startedAt = Date.now();
  const selected = String(profile || '').trim().toLowerCase();
  if (!selected || selected === 'none') {
    return {
      profile: selected || 'none',
      applied: false,
      durationMs: 0
    };
  }

  const simulationLog = [];
  const budgetMs = Math.max(
    DEFAULT_SIMULATION_MS,
    Number.isFinite(durationMs) ? Math.floor(durationMs) : 0
  );

  try {
    let driverResult = null;
    const bridgeCapable = await hasBotBridge(page, selected);
    if (bridgeCapable) {
      driverResult = await runBridgeArenaHarness(page, selected, budgetMs, simulationLog);
    } else if (selected === 'cubechat' || selected === 'cubechat-arena' || selected === 'arena') {
      driverResult = await runCubechatArenaHarness(page, budgetMs, simulationLog);
    } else {
      driverResult = await runKeyboardPlan(page, selected, budgetMs, simulationLog);
    }
    return {
      profile: selected,
      applied: true,
      durationMs: Date.now() - startedAt,
      steps: simulationLog,
      ...driverResult
    };
  } catch (err) {
    pushSimulationLog(simulationLog, `error:${err?.message || err}`);
    return {
      profile: selected,
      applied: false,
      durationMs: Date.now() - startedAt,
      steps: simulationLog,
      error: err?.message || String(err)
    };
  }
};
