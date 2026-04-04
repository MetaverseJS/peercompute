import {
  createDeterministicRng,
  createQuake3BotState,
  decideQuake3BotAction
} from '../../net-chaos-lab/agent/quake3/index.mjs';
import { listPeercomputeBotBridges } from './peercomputeBotBridge.js';

export const PEERCOMPUTE_BOT_PRESETS = [
  { id: 'arena', label: 'Arena' },
  { id: 'aggressor', label: 'Aggressor' },
  { id: 'skirmisher', label: 'Skirmisher' },
  { id: 'scavenger', label: 'Scavenger' },
  { id: 'sentinel', label: 'Sentinel' }
];

const BOT_QUERY_KEY = 'peercomputeBot';
const BOT_STATUS_KEY = '__PEERCOMPUTE_LOCAL_BOT_STATUS__';
const BOT_HOST_REGISTRY_KEY = '__PEERCOMPUTE_BOT_HOSTS__';
const BOT_HOST_CONTAINER_PREFIX = 'peercompute-bot-host-';
const DEFAULT_TICK_MS = 120;
const DEFAULT_STATUS_POLL_MS = 500;
const DEFAULT_BOT_FRAME_WIDTH = 480;
const DEFAULT_BOT_FRAME_HEIGHT = 270;
const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
const FALSE_VALUES = new Set(['0', 'false', 'no', 'off']);

const DEMO_LABELS = {
  cubechat: 'CubeChat',
  hyperborea: 'Hyperborea',
  sneakywoods: 'SneakyWoods'
};

const cloneSearchParams = (value) => {
  if (value instanceof URLSearchParams) {
    return new URLSearchParams(value);
  }
  if (typeof value === 'string') {
    const normalized = value.startsWith('?') ? value.slice(1) : value;
    return new URLSearchParams(normalized);
  }
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search || '');
  }
  return new URLSearchParams();
};

const normalizePreset = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return 'arena';
  return PEERCOMPUTE_BOT_PRESETS.some((preset) => preset.id === normalized)
    ? normalized
    : 'arena';
};

const parseBooleanParam = (params, key, fallback = false) => {
  const raw = params.get(key);
  if (raw === null || raw === undefined || raw === '') return fallback;
  const normalized = String(raw).trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  return fallback;
};

const parseIntegerParam = (params, key, fallback = 0) => {
  const value = Number.parseInt(params.get(key) || '', 10);
  return Number.isFinite(value) ? value : fallback;
};

const hashString = (value) => {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
};

const hueToRgb = (p, q, t) => {
  let next = t;
  if (next < 0) next += 1;
  if (next > 1) next -= 1;
  if (next < 1 / 6) return p + ((q - p) * 6 * next);
  if (next < 1 / 2) return q;
  if (next < 2 / 3) return p + ((q - p) * ((2 / 3) - next) * 6);
  return p;
};

const hslToHex = (h, s, l) => {
  const hue = (((h % 360) + 360) % 360) / 360;
  const sat = Math.max(0, Math.min(1, s));
  const light = Math.max(0, Math.min(1, l));
  let r = light;
  let g = light;
  let b = light;
  if (sat > 0) {
    const q = light < 0.5 ? light * (1 + sat) : (light + sat) - (light * sat);
    const p = (2 * light) - q;
    r = hueToRgb(p, q, hue + (1 / 3));
    g = hueToRgb(p, q, hue);
    b = hueToRgb(p, q, hue - (1 / 3));
  }
  const toHex = (value) => Math.round(value * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const readWindowRegistry = (key) => {
  if (typeof window === 'undefined') return null;
  if (!window[key] || typeof window[key] !== 'object') {
    window[key] = Object.create(null);
  }
  return window[key];
};

const normalizeBotCount = (value, fallback = 1) => {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(8, parsed));
};

const findBotBridge = (preferredId) => {
  const normalizedId = String(preferredId || '').trim().toLowerCase();
  const bridges = listPeercomputeBotBridges();
  if (!bridges.length) return null;
  if (normalizedId) {
    const match = bridges.find((bridge) => bridge?.id === normalizedId);
    if (match) return match;
  }
  return bridges[0] || null;
};

const setElementText = (element, text) => {
  if (element) {
    element.textContent = text;
  }
};

const renderBotControlStatus = (status) => {
  const total = Number(status?.totalBots || 0);
  const ready = Number(status?.readyBots || 0);
  const running = Number(status?.runningBots || 0);
  if (!total) return 'No bot peers running.';
  return `Bot peers: ${total} active | ${ready} ready | ${running} ticking`;
};

const createBotFrameContainer = (demoId) => {
  if (typeof document === 'undefined') return null;
  const containerId = `${BOT_HOST_CONTAINER_PREFIX}${demoId}`;
  let container = document.getElementById(containerId);
  if (container) return container;
  container = document.createElement('div');
  container.id = containerId;
  container.dataset.peercomputeBotHost = demoId;
  container.style.cssText = [
    'position:fixed',
    'right:0',
    'bottom:0',
    'width:960px',
    'max-width:960px',
    'display:flex',
    'flex-wrap:wrap',
    'gap:8px',
    'opacity:0.01',
    'transform:scale(0.01)',
    'transform-origin:100% 100%',
    'pointer-events:none',
    'overflow:hidden',
    'z-index:0'
  ].join(';');
  document.body.appendChild(container);
  return container;
};

const readFrameStatus = (frame) => {
  try {
    const status = frame?.contentWindow?.[BOT_STATUS_KEY];
    return status && typeof status === 'object' ? { ...status } : null;
  } catch (_) {
    return null;
  }
};

export const buildPeercomputeBotDisplayName = (demoId, botIndex = 0) => {
  const base = DEMO_LABELS[String(demoId || '').trim().toLowerCase()] || 'PeerCompute';
  return `${base} Bot ${Math.max(1, botIndex + 1)}`;
};

export const buildPeercomputeBotColor = (botIndex = 0) => {
  const hue = (Math.abs(Number(botIndex) || 0) * 53) % 360;
  return hslToHex(hue, 0.72, 0.54);
};

export const readPeercomputeBotParams = (source) => {
  const params = cloneSearchParams(source);
  const enabled = parseBooleanParam(params, BOT_QUERY_KEY, false);
  const demoId = String(params.get('botDemo') || '').trim().toLowerCase();
  const botIndex = Math.max(0, parseIntegerParam(params, 'botIndex', 0));
  const preset = normalizePreset(params.get('botPreset') || params.get('botPersonality'));
  const profile = String(params.get('botProfile') || 'arena').trim().toLowerCase() || 'arena';
  const name = String(params.get('botName') || '').trim();
  const colorHex = String(params.get('botColor') || '').trim();
  return {
    enabled,
    demoId,
    botIndex,
    preset,
    profile,
    name,
    colorHex,
    mediaEnabled: parseBooleanParam(params, 'botMedia', !enabled)
  };
};

export const readPeercomputeBotIdentity = (source, { demoId = '' } = {}) => {
  const params = readPeercomputeBotParams(source);
  if (!params.enabled) {
    return {
      enabled: false,
      name: '',
      colorHex: '',
      colorInt: null
    };
  }
  const colorHex = params.colorHex || buildPeercomputeBotColor(params.botIndex);
  const parsedColor = Number.parseInt(colorHex.replace('#', ''), 16);
  return {
    enabled: true,
    name: params.name || buildPeercomputeBotDisplayName(demoId || params.demoId || 'peercompute', params.botIndex),
    colorHex,
    colorInt: Number.isFinite(parsedColor) ? parsedColor : null
  };
};

export const readPeercomputeRoomParams = (
  source,
  {
    buildRoomId = null,
    normalizeRoomName = null
  } = {}
) => {
  const params = cloneSearchParams(source);
  const rawName = String(params.get('room') || '').trim();
  if (!rawName) return null;
  const password = String(params.get('password') || '');
  const privacyParam = String(params.get('privacy') || '').trim().toLowerCase();
  const visibility = privacyParam === 'private' || (password && privacyParam !== 'public')
    ? 'private'
    : 'public';
  const normalize = typeof normalizeRoomName === 'function'
    ? normalizeRoomName
    : (value) => String(value || '').trim().toLowerCase() || 'global';
  const normalizedName = normalize(rawName);
  const roomId = typeof buildRoomId === 'function'
    ? buildRoomId({ name: normalizedName, visibility, password })
    : normalizedName;
  return {
    name: rawName,
    visibility,
    password,
    roomId
  };
};

export const buildPeercomputeBotUrl = (
  baseUrl,
  roomState = {},
  {
    demoId = '',
    botIndex = 0,
    name = '',
    preset = 'arena',
    profile = 'arena',
    mediaEnabled = false,
    colorHex = '',
    extraParams = null
  } = {}
) => {
  const origin = typeof window !== 'undefined' ? window.location.href : 'http://localhost/';
  const url = new URL(baseUrl || origin, origin);
  const params = url.searchParams;
  const room = roomState.room || roomState;
  const visibility = String(room?.visibility || 'public').trim().toLowerCase() === 'private'
    ? 'private'
    : 'public';
  const roomName = String(room?.name || 'global').trim() || 'global';
  const password = visibility === 'private'
    ? String(roomState.password || room?.password || '')
    : '';
  const resolvedName = String(name || buildPeercomputeBotDisplayName(demoId || roomState.demoId || 'peercompute', botIndex)).trim();
  const resolvedColor = String(colorHex || buildPeercomputeBotColor(botIndex)).trim();

  params.set(BOT_QUERY_KEY, '1');
  params.set('botDemo', String(demoId || '').trim().toLowerCase());
  params.set('botIndex', String(Math.max(0, botIndex)));
  params.set('botProfile', String(profile || 'arena').trim().toLowerCase() || 'arena');
  params.set('botPreset', normalizePreset(preset));
  params.set('botName', resolvedName);
  params.set('botColor', resolvedColor);
  params.set('botMedia', mediaEnabled ? '1' : '0');
  params.set('room', roomName);
  params.set('privacy', visibility);
  if (password) {
    params.set('password', password);
  } else {
    params.delete('password');
  }

  if (extraParams && typeof extraParams === 'object') {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
  }

  return url.toString();
};

export const createPeercomputeLocalBotRuntime = ({
  bridgeId = '',
  demoId = '',
  tickMs = DEFAULT_TICK_MS,
  preset = 'arena',
  profile = 'arena',
  hideSelectors = [],
  seed = null
} = {}) => {
  const normalizedBridgeId = String(bridgeId || demoId || '').trim().toLowerCase();
  const launch = readPeercomputeBotParams();
  const launchSeed = seed || hashString(`${normalizedBridgeId}:${launch.botIndex}:${launch.name}`);
  const state = {
    running: false,
    ready: false,
    tickHandle: null,
    tickCount: 0,
    startedAt: 0,
    lastTickAt: 0,
    lastMode: '',
    error: null,
    peerCount: 0,
    localId: null
  };
  const personalityPreset = normalizePreset(preset || launch.preset);
  const rng = createDeterministicRng(launchSeed);
  const botState = createQuake3BotState(launchSeed, { preset: personalityPreset });

  const applyBotChromeState = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.peercomputeBot = '1';
    hideSelectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = 'none';
      }
    });
  };

  const writeStatus = (next = {}) => {
    if (typeof window === 'undefined') return null;
    const status = {
      running: state.running,
      ready: state.ready,
      bridgeId: normalizedBridgeId,
      demoId: String(demoId || launch.demoId || normalizedBridgeId || '').trim().toLowerCase(),
      preset: personalityPreset,
      profile: String(profile || launch.profile || 'arena').trim().toLowerCase(),
      tickCount: state.tickCount,
      startedAt: state.startedAt || null,
      lastTickAt: state.lastTickAt || null,
      lastMode: state.lastMode || '',
      localId: state.localId || null,
      peerCount: state.peerCount || 0,
      error: state.error || '',
      ...next
    };
    window[BOT_STATUS_KEY] = status;
    return status;
  };

  const stop = () => {
    if (state.tickHandle) {
      window.clearTimeout(state.tickHandle);
      state.tickHandle = null;
    }
    state.running = false;
    const bridge = findBotBridge(normalizedBridgeId);
    if (bridge?.clearAction) {
      try {
        bridge.clearAction();
      } catch (_) {
        // ignore stale bridge cleanup
      }
    }
    writeStatus({ running: false });
  };

  const scheduleTick = () => {
    state.tickHandle = window.setTimeout(runTick, Math.max(40, Number(tickMs) || DEFAULT_TICK_MS));
  };

  const runTick = () => {
    if (!state.running) return;
    applyBotChromeState();
    const bridge = findBotBridge(normalizedBridgeId);
    if (!bridge) {
      state.ready = false;
      writeStatus({ ready: false });
      scheduleTick();
      return;
    }

    state.ready = true;
    try {
      const snapshot = bridge.snapshot?.() || null;
      state.localId = snapshot?.localId || null;
      state.peerCount = Array.isArray(snapshot?.peers)
        ? snapshot.peers.length
        : Number(snapshot?.peerCount || 0);
      if (snapshot?.localPosition) {
        const world = {
          ...(snapshot || {}),
          metadata: {
            ...(snapshot?.metadata || {}),
            botPersonality: personalityPreset,
            botPreset: personalityPreset,
            botName: launch.name || null
          }
        };
        const action = decideQuake3BotAction(world, botState, Date.now() - state.startedAt, rng);
        bridge.applyAction?.(action);
        state.lastMode = action?.mode || state.lastMode;
        state.tickCount += 1;
        state.lastTickAt = Date.now();
      }
      state.error = null;
    } catch (err) {
      state.error = err?.message || String(err);
    }
    writeStatus();
    scheduleTick();
  };

  return {
    start() {
      if (typeof window === 'undefined' || state.running) return this;
      state.running = true;
      state.startedAt = Date.now();
      state.tickCount = 0;
      state.lastTickAt = 0;
      state.lastMode = '';
      state.error = null;
      applyBotChromeState();
      writeStatus({ running: true, ready: false });
      scheduleTick();
      return this;
    },
    stop,
    getStatus() {
      return writeStatus();
    }
  };
};

export const maybeStartPeercomputeLocalBotRuntime = (options = {}) => {
  const launch = readPeercomputeBotParams();
  if (!launch.enabled) return null;
  const runtime = createPeercomputeLocalBotRuntime({
    ...options,
    bridgeId: options.bridgeId || launch.demoId || options.demoId,
    demoId: options.demoId || launch.demoId,
    preset: options.preset || launch.preset,
    profile: options.profile || launch.profile
  });
  runtime.start();
  return runtime;
};

export const createPeercomputeBotHost = ({
  demoId = '',
  baseUrl = '',
  getRoomState = null,
  mediaEnabled = false,
  profile = 'arena'
} = {}) => {
  if (typeof window === 'undefined' || readPeercomputeBotParams().enabled) return null;
  const normalizedDemoId = String(demoId || '').trim().toLowerCase();
  if (!normalizedDemoId) return null;
  const registry = readWindowRegistry(BOT_HOST_REGISTRY_KEY);
  if (registry?.[normalizedDemoId]) {
    return registry[normalizedDemoId];
  }

  const container = createBotFrameContainer(normalizedDemoId);
  const listeners = new Set();
  const state = {
    botSeq: 0,
    bots: new Map(),
    statusTimer: null,
    lastStatus: null,
    destroyed: false
  };

  const emitStatus = () => {
    const bots = [];
    let readyBots = 0;
    let runningBots = 0;
    state.bots.forEach((bot) => {
      const runtime = readFrameStatus(bot.frame);
      const entry = {
        id: bot.id,
        name: bot.name,
        preset: bot.preset,
        loaded: Boolean(bot.frame?.contentWindow),
        ready: Boolean(runtime?.ready),
        running: Boolean(runtime?.running),
        peerCount: Number(runtime?.peerCount || 0),
        mode: runtime?.lastMode || '',
        lastTickAt: runtime?.lastTickAt || null
      };
      if (entry.ready) readyBots += 1;
      if (entry.running) runningBots += 1;
      bots.push(entry);
    });
    const nextStatus = {
      demoId: normalizedDemoId,
      totalBots: state.bots.size,
      readyBots,
      runningBots,
      bots
    };
    state.lastStatus = nextStatus;
    listeners.forEach((listener) => {
      try {
        listener(nextStatus);
      } catch (_) {
        // ignore listener errors
      }
    });
    return nextStatus;
  };

  const stopStatusTimer = () => {
    if (state.statusTimer) {
      window.clearInterval(state.statusTimer);
      state.statusTimer = null;
    }
  };

  const ensureStatusTimer = () => {
    if (state.statusTimer || !state.bots.size) return;
    state.statusTimer = window.setInterval(() => {
      emitStatus();
    }, DEFAULT_STATUS_POLL_MS);
  };

  const buildFrameUrl = (bot) => {
    const roomState = typeof getRoomState === 'function' ? (getRoomState() || {}) : {};
    return buildPeercomputeBotUrl(
      baseUrl || window.location.href,
      roomState,
      {
        demoId: normalizedDemoId,
        botIndex: bot.index,
        name: bot.name,
        preset: bot.preset,
        profile,
        mediaEnabled,
        colorHex: bot.colorHex,
        extraParams: roomState.extraParams || null
      }
    );
  };

  const destroyBot = (bot) => {
    if (!bot) return;
    try {
      if (bot.frame) {
        bot.frame.src = 'about:blank';
        bot.frame.remove();
      }
    } catch (_) {
      // ignore iframe teardown issues
    }
  };

  const api = {
    addBots(count = 1, options = {}) {
      if (state.destroyed || !container) return emitStatus();
      const batchSize = normalizeBotCount(count, 1);
      const preset = normalizePreset(options.preset);
      for (let i = 0; i < batchSize; i += 1) {
        const index = state.botSeq;
        state.botSeq += 1;
        const botId = `${normalizedDemoId}-bot-${index + 1}`;
        const frame = document.createElement('iframe');
        const name = buildPeercomputeBotDisplayName(normalizedDemoId, index);
        const colorHex = buildPeercomputeBotColor(index);
        frame.dataset.peercomputeBotId = botId;
        frame.setAttribute('title', name);
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = [
          `width:${DEFAULT_BOT_FRAME_WIDTH}px`,
          `height:${DEFAULT_BOT_FRAME_HEIGHT}px`,
          'border:0',
          'background:#000'
        ].join(';');
        const bot = {
          id: botId,
          index,
          frame,
          name,
          colorHex,
          preset
        };
        frame.src = buildFrameUrl(bot);
        container.appendChild(frame);
        state.bots.set(botId, bot);
      }
      ensureStatusTimer();
      return emitStatus();
    },
    clearBots() {
      state.bots.forEach((bot) => destroyBot(bot));
      state.bots.clear();
      stopStatusTimer();
      return emitStatus();
    },
    refreshBots() {
      state.bots.forEach((bot) => {
        if (bot.frame) {
          bot.frame.src = buildFrameUrl(bot);
        }
      });
      ensureStatusTimer();
      return emitStatus();
    },
    subscribe(listener) {
      if (typeof listener !== 'function') {
        return () => {};
      }
      listeners.add(listener);
      listener(state.lastStatus || emitStatus());
      return () => {
        listeners.delete(listener);
      };
    },
    getStatus() {
      return state.lastStatus || emitStatus();
    },
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      api.clearBots();
      stopStatusTimer();
      listeners.clear();
      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (registry?.[normalizedDemoId] === api) {
        delete registry[normalizedDemoId];
      }
    }
  };

  registry[normalizedDemoId] = api;
  window.addEventListener('beforeunload', () => {
    api.destroy();
  }, { once: true });
  return api;
};

export const bindPeercomputeBotSettingsControls = ({
  host = null,
  countInput = null,
  presetInput = null,
  addButton = null,
  clearButton = null,
  statusEl = null
} = {}) => {
  if (presetInput && !presetInput.dataset.peercomputeBotOptions) {
    presetInput.innerHTML = PEERCOMPUTE_BOT_PRESETS
      .map((preset) => `<option value="${preset.id}">${preset.label}</option>`)
      .join('');
    presetInput.dataset.peercomputeBotOptions = '1';
  }

  if (!host) {
    setElementText(statusEl, 'Bot peers are controlled by the parent host.');
    return () => {};
  }

  const render = (status) => {
    setElementText(statusEl, renderBotControlStatus(status));
  };

  const unsubscribe = host.subscribe(render);

  if (addButton) {
    addButton.addEventListener('click', () => {
      const count = normalizeBotCount(countInput?.value || 1, 1);
      const preset = normalizePreset(presetInput?.value || 'arena');
      host.addBots(count, { preset });
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      host.clearBots();
    });
  }

  render(host.getStatus());
  return unsubscribe;
};
