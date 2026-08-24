export async function readCappedResponse(response, maximumBytes, label = 'Response') {
  if (!Number.isInteger(maximumBytes) || maximumBytes < 1) throw new RangeError('Response cap must be positive.');
  const declared = Number(response?.headers?.get?.('content-length'));
  if (Number.isFinite(declared) && declared > maximumBytes) {
    throw new RangeError(`${label} declares ${declared} bytes, exceeding the ${maximumBytes}-byte cap.`);
  }
  if (!response?.body?.getReader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maximumBytes) throw new RangeError(`${label} exceeds the ${maximumBytes}-byte cap.`);
    return bytes;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
      total += chunk.byteLength;
      if (total > maximumBytes) {
        await reader.cancel(`${label} byte cap exceeded.`).catch(() => {});
        throw new RangeError(`${label} exceeds the ${maximumBytes}-byte cap.`);
      }
      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock?.();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function fetchCappedJson(url, {
  fetchImpl = globalThis.fetch,
  maximumBytes = 256 * 1024,
  signal,
  cache = 'force-cache',
  label = 'JSON response',
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  const response = await fetchImpl(url, { mode: 'cors', cache, signal });
  if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}.`);
  const type = String(response.headers?.get?.('content-type') ?? '').toLowerCase();
  if (type && !type.includes('json')) throw new TypeError(`${label} returned an unexpected content type.`);
  const bytes = await readCappedResponse(response, maximumBytes, label);
  return JSON.parse(new TextDecoder().decode(bytes));
}
