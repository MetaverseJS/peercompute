export const loadRelayConfig = async () => {
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
