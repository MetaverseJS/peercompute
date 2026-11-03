export const INFERENCE_RELAY_CONFIG_URL = 'https://secretworkshop.net/peercompute/config/relay-config.json';

async function readJson(url, { fetchImpl, signal, maximumBytes }) {
  const response = await fetchImpl(url, { cache: 'no-store', signal });
  if (!response.ok || !response.body) throw new Error(`Relay configuration unavailable (${response.status})`);
  const chunks = [];
  let length = 0;
  for await (const bytes of response.body) {
    length += bytes.byteLength;
    if (length > maximumBytes) throw new Error('Relay configuration exceeds its byte limit');
    chunks.push(bytes);
  }
  const data = new Uint8Array(length);
  let offset = 0;
  for (const bytes of chunks) { data.set(bytes, offset); offset += bytes.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(data));
}

/** Same source-file convention as the other demos, restricted to the production HTTPS backend. */
export async function loadInferenceRelayConfig({ fetchImpl = globalThis.fetch, signal,
  baseUrl = globalThis.location?.href } = {}) {
  const timeout = AbortSignal.timeout(20_000);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  let source;
  try {
    source = await readJson(new URL('./relay-config-source.json', baseUrl).href,
      { fetchImpl, signal: requestSignal, maximumBytes: 16 * 1024 });
  } catch (error) { if (requestSignal.aborted) throw error; }
  const url = new URL(source?.relayConfigUrl ?? INFERENCE_RELAY_CONFIG_URL);
  if (url.protocol !== 'https:' || url.hostname !== 'secretworkshop.net' || url.username || url.password) {
    throw new Error('Relay configuration must use the approved Secret Workshop HTTPS backend');
  }
  const config = await readJson(url.href, { fetchImpl, signal: requestSignal, maximumBytes: 64 * 1024 });
  const bootstrapPeers = [...new Set((Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers : [])
    .filter((address) => typeof address === 'string' && address.length <= 2048 && address.startsWith('/')
      && address.includes('/wss/') && address.includes('/p2p/')))].slice(0, 16);
  if (!bootstrapPeers.length) throw new Error('Production relay configuration contains no secure bootstrap peers');
  return { bootstrapPeers, transportManager: { faultTolerance: 'no-fatal' },
    ...(config.webrtc && typeof config.webrtc === 'object' ? { webrtc: config.webrtc } : {}),
    pubsubType: config.pubsubType === 'gossipsub' ? 'gossipsub' : 'floodsub',
    ...(config.gossipsub && typeof config.gossipsub === 'object' ? { gossipsub: config.gossipsub } : {}) };
}
