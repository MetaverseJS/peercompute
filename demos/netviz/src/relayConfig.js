export const loadRelayConfig = async (explicitUrl = '') => {
  const tryFetch = async (path) => {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (_) {
      // ignore
    }
    return null;
  };

  const getRelayConfigUrlOverride = () => {
    const direct = typeof explicitUrl === 'string' ? explicitUrl.trim() : '';
    if (direct) return direct;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('relayConfigUrl') || params.get('relayConfig') || '';
    } catch (_) {
      return '';
    }
  };

  const loadRelayConfigSourceUrl = async () => {
    const source =
      (await tryFetch('./relay-config-source.json')) ||
      (await tryFetch('./.relay-config-source.json')) ||
      (await tryFetch('/relay-config-source.json')) ||
      (await tryFetch('/.relay-config-source.json'));
    const url = typeof source?.relayConfigUrl === 'string' ? source.relayConfigUrl.trim() : '';
    return url || '';
  };

  const overrideUrl = getRelayConfigUrlOverride();
  const relayConfigUrl = overrideUrl || await loadRelayConfigSourceUrl();
  if (relayConfigUrl) {
    const remote = await tryFetch(relayConfigUrl);
    if (remote) return remote;
  }

  return (
    (await tryFetch('./relay-config.json')) ||
    (await tryFetch('./.relay-config.json')) ||
    (await tryFetch('/relay-config.json')) ||
    (await tryFetch('/.relay-config.json')) ||
    { bootstrapPeers: [] }
  );
};

export const normalizeBootstrapPeers = (peers) => {
  if (!Array.isArray(peers)) return [];
  return peers.filter(Boolean);
};

const extractCircuitRelayIds = (addresses = []) => {
  const relays = new Set();
  for (const addr of Array.isArray(addresses) ? addresses : []) {
    const str = String(addr || '');
    const circuitIdx = str.indexOf('/p2p-circuit');
    if (circuitIdx <= 0) continue;
    const prefix = str.slice(0, circuitIdx);
    const match = prefix.match(/\/p2p\/([^/]+)/);
    if (match?.[1]) relays.add(match[1]);
  }
  return Array.from(relays);
};

export const resolveRootDirectoryUrl = ({ relayConfigUrl = '', relayConfig = null } = {}) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = (params.get('rootDirectoryUrl') || params.get('modelEvidenceUrl') || '').trim();
    if (paramUrl) return paramUrl;
  } catch (_) {
    // ignore outside browser
  }
  if (typeof relayConfig?.rootDirectoryUrl === 'string' && relayConfig.rootDirectoryUrl.trim()) {
    return relayConfig.rootDirectoryUrl.trim();
  }
  const sourceUrl = String(relayConfigUrl || relayConfig?.relayConfigUrl || '').trim();
  if (sourceUrl && /\/relay-config\.json(?:[?#]|$)/i.test(sourceUrl)) {
    return sourceUrl.replace(/\/relay-config\.json(?:[?#].*)?$/i, '/model-evidence.json');
  }
  const peers = Array.isArray(relayConfig?.bootstrapPeers) ? relayConfig.bootstrapPeers : [];
  const hasSecretWorkshop = peers.some((addr) => String(addr || '').includes('/dns4/secretworkshop.net/') || String(addr || '').includes('/dns6/secretworkshop.net/'));
  if (hasSecretWorkshop) {
    return 'https://secretworkshop.net/peercompute/config/model-evidence.json';
  }
  return '';
};

export const loadRootDirectory = async (url = '') => {
  const target = String(url || '').trim();
  if (!target) return null;
  try {
    const res = await fetch(target, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== 'object') return null;
    if (data.schema !== 'peercompute.model-evidence-directory.v1') return null;
    if (typeof data.peerId !== 'string' || !data.peerId.trim()) return null;
    const addresses = Array.isArray(data.addresses)
      ? data.addresses.filter((addr) => typeof addr === 'string' && addr.trim())
      : [];
    return {
      schema: data.schema,
      protocol: typeof data.protocol === 'string' ? data.protocol : '/peercompute/model-evidence/1.0.0',
      peerId: data.peerId.trim(),
      addresses,
      relayPeerIds: extractCircuitRelayIds(addresses),
      expiresAt: Number.isFinite(data.expiresAt) ? data.expiresAt : null,
      fetchedAt: Date.now(),
      sourceUrl: target
    };
  } catch (_) {
    return null;
  }
};
