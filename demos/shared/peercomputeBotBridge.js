const REGISTRY_KEY = '__PEERCOMPUTE_BOT_BRIDGES__';
const LAST_BRIDGE_KEY = '__PEERCOMPUTE_LAST_BOT_BRIDGE__';

const getRegistry = () => {
  if (typeof window === 'undefined') return null;
  const globalAny = window;
  if (!globalAny[REGISTRY_KEY] || typeof globalAny[REGISTRY_KEY] !== 'object') {
    globalAny[REGISTRY_KEY] = Object.create(null);
  }
  return globalAny[REGISTRY_KEY];
};

export const registerPeercomputeBotBridge = (id, bridge) => {
  const registry = getRegistry();
  if (!registry || !id || !bridge || typeof bridge !== 'object') return null;
  const normalizedId = String(id).trim().toLowerCase();
  if (!normalizedId) return null;
  registry[normalizedId] = {
    id: normalizedId,
    ...bridge
  };
  window[LAST_BRIDGE_KEY] = normalizedId;
  return registry[normalizedId];
};

export const unregisterPeercomputeBotBridge = (id) => {
  const registry = getRegistry();
  if (!registry || !id) return false;
  const normalizedId = String(id).trim().toLowerCase();
  if (!normalizedId || !registry[normalizedId]) return false;
  delete registry[normalizedId];
  if (window[LAST_BRIDGE_KEY] === normalizedId) {
    const [nextId] = Object.keys(registry);
    if (nextId) {
      window[LAST_BRIDGE_KEY] = nextId;
    } else {
      delete window[LAST_BRIDGE_KEY];
    }
  }
  return true;
};

export const listPeercomputeBotBridges = () => {
  const registry = getRegistry();
  if (!registry) return [];
  return Object.keys(registry).map((id) => registry[id]).filter(Boolean);
};
