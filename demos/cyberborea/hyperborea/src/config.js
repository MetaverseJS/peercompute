export const GAME_NAMESPACE = 'cb';
export const GAME_VERSION = '0.2.1';
export const PERSIST_KEY = 'cb-player-persist';
// Bundle hash used for persistence/versioning; override by defining globalThis.__BUNDLE_HASH__ at build time.
export const BUNDLE_HASH = typeof globalThis !== 'undefined' && globalThis.__BUNDLE_HASH__ ? globalThis.__BUNDLE_HASH__ : GAME_VERSION;

export const getRenderDistanceFromQuery = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const rd = parseInt(params.get('RD') || params.get('rd') || '', 10);
    if (!Number.isNaN(rd) && rd > 0 && rd < 2000) return rd;
  } catch (_) {
    // ignore query parsing failures
  }
  return null;
};

export const isTerrainGenEnabled = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const tg = params.get('tg');
    if (tg === '0') return false;
  } catch (_) {
    // ignore
  }
  return true;
};

export const CONFIG = {
  DAY_DURATION: 6 * 60 * 1000,
  YEAR_DURATION: 60 * 60 * 1000,
  CHUNK_SIZE: 2048,
  RENDER_DISTANCE: getRenderDistanceFromQuery() ?? 8, // override via ?RD=6
  WORLD_SEED: 12345,
  PLAYER_SPEED: 200, // 50% faster
  JUMP_FORCE: 10,
  GRAVITY: -25
};

export const PRESENCE_HEARTBEAT_MS = 1000;
export const PEER_PRUNE_INTERVAL_MS = 5000;
export const PEER_STALE_MS = 10000;
export const STATE_POS_THRESHOLD = 0.5;
export const STATE_ROT_THRESHOLD = 0.05;
export const STATE_KEEPALIVE_MS = 1500;
export const STATE_EVENT_MIN_MS = 100; // 10 per second cap
export const TIME_ANCHOR_KEY = 'time-anchor';
