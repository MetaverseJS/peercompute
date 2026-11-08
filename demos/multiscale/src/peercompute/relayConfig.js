export const MULTISCALE_NODE_KERNEL_STATUS_SCHEMA = 'peercompute.multiscale.node-kernel-status.v0';

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
const FALSE_VALUES = new Set(['0', 'false', 'no', 'off']);

function normalizeSearchParams(search = '') {
  if (search instanceof URLSearchParams) return search;
  if (typeof search === 'string') return new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (search && typeof search === 'object') return new URLSearchParams(search);
  return new URLSearchParams();
}

export function normalizePeerNetworkBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value == null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  return fallback;
}

function firstParam(params, keys) {
  for (const key of keys) {
    if (params.has(key)) return params.get(key);
  }
  return null;
}

export function readPeerNetworkOverrides(search = globalThis.location?.search || '') {
  const params = normalizeSearchParams(search);
  const enable = firstParam(params, [
    'enablePeerNetwork',
    'enableNodeKernel',
    'enableMultiscaleKernel',
    'peercomputeNetwork'
  ]);
  const responder = firstParam(params, ['enableRemoteComputeResponder', 'remoteComputeResponder']);
  const functionTasks = firstParam(params, ['allowRemoteFunctionTasks', 'remoteFunctionTasks']);
  const autoWire = firstParam(params, ['autoWireRemotePlacement', 'autoWireNodeKernelPlacement']);
  const remoteTimeout = firstParam(params, ['remoteComputeTimeoutMs', 'nodeKernelRemoteTimeoutMs']);
  const debugOutput = firstParam(params, ['peerNetworkDebug', 'nodeKernelDebug', 'debugoutput']);
  const roomId = firstParam(params, ['peerRoomId', 'roomId', 'room']) || 'multiscale';
  const topologyId = firstParam(params, ['peerTopologyId', 'topologyId']) || 'multiscale-ladder';
  const topology = firstParam(params, ['peerTopology', 'topologyType', 'topology']) || 'distributed';
  const stateTopic = firstParam(params, ['peerStateTopic', 'stateTopic']) || `pc.${topologyId}.${roomId}.state`;

  const timeoutMs = Number(remoteTimeout);

  return {
    enablePeerNetwork: normalizePeerNetworkBoolean(enable, false),
    roomId: String(roomId || 'multiscale').trim() || 'multiscale',
    topologyId: String(topologyId || 'multiscale-ladder').trim() || 'multiscale-ladder',
    topology: String(topology || 'distributed').trim() || 'distributed',
    stateTopic: String(stateTopic || `pc.${topologyId}.${roomId}.state`).trim(),
    enableRemoteComputeResponder: normalizePeerNetworkBoolean(responder, false),
    allowRemoteFunctionTasks: normalizePeerNetworkBoolean(functionTasks, false),
    autoWireRemotePlacement: normalizePeerNetworkBoolean(autoWire, true),
    remoteComputeTimeoutMs: Number.isFinite(timeoutMs) ? Math.max(1000, Math.min(3600000, Math.round(timeoutMs))) : 30000,
    debugOutput: normalizePeerNetworkBoolean(debugOutput, false)
  };
}

async function tryFetchJson(fetchFn, path) {
  if (typeof fetchFn !== 'function' || !path) return null;
  try {
    const response = await fetchFn(path, { cache: 'no-store' });
    if (response?.ok) return await response.json();
  } catch (_) {
    // Optional relay config lookup.
  }
  return null;
}

export function normalizeBootstrapPeers(peers) {
  if (!Array.isArray(peers)) return [];
  return [...new Set(
    peers
      .map((peer) => String(peer || '').trim())
      .filter(Boolean)
  )];
}

export async function loadRelayConfig({
  search = globalThis.location?.search || '',
  fetchFn = globalThis.fetch?.bind(globalThis)
} = {}) {
  const params = normalizeSearchParams(search);
  const overrideUrl = firstParam(params, ['relayConfigUrl', 'relayConfig']);
  if (overrideUrl) {
    const remote = await tryFetchJson(fetchFn, overrideUrl);
    if (remote) return remote;
  }

  const sourcePaths = [
    './relay-config-source.json',
    './.relay-config-source.json',
    '/relay-config-source.json',
    '/.relay-config-source.json'
  ];
  for (const path of sourcePaths) {
    const source = await tryFetchJson(fetchFn, path);
    const relayConfigUrl = typeof source?.relayConfigUrl === 'string' ? source.relayConfigUrl.trim() : '';
    if (relayConfigUrl) {
      const remote = await tryFetchJson(fetchFn, relayConfigUrl);
      if (remote) return remote;
    }
  }

  const fallbackPaths = [
    './relay-config.json',
    './.relay-config.json',
    '/relay-config.json',
    '/.relay-config.json'
  ];
  for (const path of fallbackPaths) {
    const local = await tryFetchJson(fetchFn, path);
    if (local) return local;
  }
  return { bootstrapPeers: [] };
}
