export const PERSIST_KEY = 'hyperborea-player-persist';

export const getRenderDistanceFromQuery = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const rd = parseInt(params.get('RD') || params.get('rd') || '', 10);
    if (!Number.isNaN(rd) && rd > 0 && rd < 2000) return rd;
  } catch (_) {
    // ignore query parsing errors
  }
  return null;
};

export const getNetHzFromQuery = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('netHz') || params.get('nethz') || params.get('net') || '';
    const hz = parseInt(raw, 10);
    if (!Number.isNaN(hz) && hz > 0 && hz <= 60) return hz;
  } catch (_) {
    // ignore query parsing errors
  }
  return 20;
};

export const CONFIG = {
  DAY_DURATION: 6 * 60 * 1000,
  YEAR_DURATION: 60 * 60 * 1000,
  CHUNK_SIZE: 2048,
  RENDER_DISTANCE: getRenderDistanceFromQuery() ?? 8,
  WORLD_SEED: 12345,
  PLAYER_SPEED: 150,
  JUMP_FORCE: 10,
  GRAVITY: -25
};

export const PRESENCE_HEARTBEAT_MS = 1000;
export const PEER_PRUNE_INTERVAL_MS = 5000;
export const PEER_STALE_MS = 15000;
export const STATE_POS_THRESHOLD = 0.5;
export const STATE_ROT_THRESHOLD = 0.05;
export const STATE_KEEPALIVE_MS = 1500;
export const STATE_EVENT_MIN_MS = Math.round(1000 / getNetHzFromQuery());
export const TIME_ANCHOR_KEY = 'time-anchor';
export const RECONNECT_INTERVAL_MS = 4000;
export const RECONNECT_MIN_GAP_MS = 2000;
