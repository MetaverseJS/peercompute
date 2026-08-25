import { GeodataError, isAbortError } from '../errors.js';

function joinSignals(signals) {
  const active = signals.filter(Boolean);
  if (active.length === 0) return undefined;
  if (active.length === 1) return active[0];
  return AbortSignal.any(active);
}

async function readBoundedBody(response, maxResponseBytes) {
  const contentLength = response.headers.get('content-length');
  if (contentLength !== null) {
    if (!/^(?:0|[1-9][0-9]*)$/u.test(contentLength)) {
      throw new GeodataError(
        'UPSTREAM_INVALID_LENGTH',
        'The fixed geodata source returned an invalid body length.',
        { statusCode: 502, retryable: true }
      );
    }
    const declaredLength = Number(contentLength);
    if (!Number.isSafeInteger(declaredLength) || declaredLength > maxResponseBytes) {
      throw new GeodataError(
        'UPSTREAM_BODY_TOO_LARGE',
        'The fixed geodata source response exceeded its byte limit.',
        { statusCode: 502, retryable: true }
      );
    }
  }

  if (!response.body?.getReader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxResponseBytes) {
      throw new GeodataError(
        'UPSTREAM_BODY_TOO_LARGE',
        'The fixed geodata source response exceeded its byte limit.',
        { statusCode: 502, retryable: true }
      );
    }
    return bytes;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxResponseBytes) {
        await reader.cancel('response limit exceeded');
        throw new GeodataError(
          'UPSTREAM_BODY_TOO_LARGE',
          'The fixed geodata source response exceeded its byte limit.',
          { statusCode: 502, retryable: true }
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock?.();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function fetchBoundedBytes({
  fetchImpl = globalThis.fetch,
  url,
  headers = {},
  signal,
  timeoutMs,
  maxResponseBytes,
  allowedContentTypes
}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  if (!(url instanceof URL) || url.protocol !== 'https:' || url.username || url.password) {
    throw new TypeError('A fixed credential-free HTTPS source URL is required.');
  }
  if (!Number.isSafeInteger(maxResponseBytes) || maxResponseBytes < 1) {
    throw new RangeError('A positive source response byte limit is required.');
  }
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) {
    throw new RangeError('A positive source request timeout is required.');
  }
  if (!Array.isArray(allowedContentTypes) || allowedContentTypes.length === 0) {
    throw new TypeError('At least one fixed source content type is required.');
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      headers,
      redirect: 'manual',
      signal: joinSignals([signal, timeoutSignal])
    });
    if (response.status >= 300 && response.status < 400) {
      throw new GeodataError(
        'UPSTREAM_REDIRECT_FORBIDDEN',
        'The fixed geodata source attempted an untrusted redirect.',
        { statusCode: 502, retryable: false }
      );
    }
    if (!response.ok) {
      throw new GeodataError(
        'UPSTREAM_HTTP_ERROR',
        'The fixed geodata source is temporarily unavailable.',
        {
          statusCode: response.status === 408 || response.status === 429 ? 503 : 502,
          retryable: response.status === 408 || response.status === 429 || response.status >= 500
        }
      );
    }

    const contentType = (response.headers.get('content-type') ?? '').split(';', 1)[0].trim().toLowerCase();
    if (!allowedContentTypes.includes(contentType)) {
      throw new GeodataError(
        'UPSTREAM_CONTENT_TYPE_REJECTED',
        'The fixed geodata source returned an unsupported content type.',
        { statusCode: 502, retryable: false }
      );
    }
    const bytes = await readBoundedBody(response, maxResponseBytes);
    return Object.freeze({ bytes, contentType });
  } catch (error) {
    if (error instanceof GeodataError) throw error;
    if (isAbortError(error) || timeoutSignal.aborted) {
      throw new GeodataError(
        'UPSTREAM_TIMEOUT',
        'The fixed geodata source did not respond before its deadline.',
        { statusCode: 504, retryable: true, cause: error }
      );
    }
    throw new GeodataError(
      'UPSTREAM_FETCH_FAILED',
      'The fixed geodata source could not be reached.',
      { statusCode: 502, retryable: true, cause: error }
    );
  }
}

export { readBoundedBody };
