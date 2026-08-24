function boundedResponseError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function normalizeChunk(value) {
  if (value instanceof Uint8Array) return value;
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  throw boundedResponseError(
    'ERR_RESPONSE_STREAM_INVALID',
    'The response stream returned a non-byte chunk.'
  );
}

function declaredContentLength(response) {
  const value = response?.headers?.get?.('content-length');
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).trim();
  if (!/^\d+$/u.test(normalized)) {
    throw boundedResponseError(
      'ERR_RESPONSE_LENGTH_INVALID',
      'The response declared an invalid Content-Length.'
    );
  }
  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed)) {
    throw boundedResponseError(
      'ERR_RESPONSE_LENGTH_INVALID',
      'The response declared an invalid Content-Length.'
    );
  }
  return parsed;
}

export async function invokeFetch(fetchImpl, input, init) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  return Reflect.apply(fetchImpl, globalThis, [input, init]);
}

export async function readResponseBytesBounded(response, {
  maximumBytes,
  label = 'Response',
  tooLargeCode = 'ERR_RESPONSE_TOO_LARGE'
} = {}) {
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1) {
    throw new RangeError('maximumBytes must be a positive safe integer.');
  }

  const declared = declaredContentLength(response);
  if (declared !== null && declared > maximumBytes) {
    throw boundedResponseError(tooLargeCode, `${label} exceeds the ${maximumBytes}-byte cap.`);
  }

  const reader = response?.body?.getReader?.();
  if (reader) {
    const chunks = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = normalizeChunk(value);
        if (chunk.byteLength > maximumBytes - total) {
          try {
            await reader.cancel(`${label} exceeded its byte cap.`);
          } catch {
            // Preserve the public cap error even when a transport rejects cancel().
          }
          throw boundedResponseError(tooLargeCode, `${label} exceeds the ${maximumBytes}-byte cap.`);
        }
        chunks.push(chunk);
        total += chunk.byteLength;
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

  if (typeof response?.arrayBuffer !== 'function') {
    throw boundedResponseError('ERR_RESPONSE_BODY_UNAVAILABLE', `${label} did not provide a readable body.`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > maximumBytes) {
    throw boundedResponseError(tooLargeCode, `${label} exceeds the ${maximumBytes}-byte cap.`);
  }
  return bytes;
}
