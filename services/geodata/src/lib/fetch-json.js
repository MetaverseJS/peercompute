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
    const declaredLength = Number(contentLength);
    if (!Number.isFinite(declaredLength) || declaredLength < 0) {
      throw new GeodataError('UPSTREAM_INVALID_LENGTH', 'The OSM source returned an invalid body length.', {
        statusCode: 502,
        retryable: true
      });
    }
    if (declaredLength > maxResponseBytes) {
      throw new GeodataError('UPSTREAM_BODY_TOO_LARGE', 'The OSM source response exceeded the 8 MiB limit; request a smaller region.', {
        statusCode: 502,
        retryable: true
      });
    }
  }

  if (!response.body?.getReader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxResponseBytes) {
      throw new GeodataError('UPSTREAM_BODY_TOO_LARGE', 'The OSM source response exceeded the 8 MiB limit; request a smaller region.', {
        statusCode: 502,
        retryable: true
      });
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
        throw new GeodataError('UPSTREAM_BODY_TOO_LARGE', 'The OSM source response exceeded the 8 MiB limit; request a smaller region.', {
          statusCode: 502,
          retryable: true
        });
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

export async function fetchBoundedJson({
  fetchImpl = globalThis.fetch,
  url,
  method = 'POST',
  headers = {},
  body,
  signal,
  timeoutMs,
  maxRequestBytes,
  maxResponseBytes,
  allowedContentTypes = ['application/json']
}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');
  const requestBytes = body === undefined ? 0 : Buffer.byteLength(body);
  if (requestBytes > maxRequestBytes) {
    throw new GeodataError('UPSTREAM_REQUEST_TOO_LARGE', 'The bounded OSM query exceeded its request limit.', {
      statusCode: 500
    });
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method,
      headers,
      body,
      redirect: 'manual',
      signal: joinSignals([signal, timeoutSignal])
    });

    if (response.status >= 300 && response.status < 400) {
      throw new GeodataError('UPSTREAM_REDIRECT_FORBIDDEN', 'The configured OSM source attempted an untrusted redirect.', {
        statusCode: 502,
        retryable: false
      });
    }
    if (!response.ok) {
      throw new GeodataError('UPSTREAM_HTTP_ERROR', 'The configured OSM source is temporarily unavailable.', {
        statusCode: response.status === 429 ? 503 : 502,
        retryable: response.status === 408 || response.status === 429 || response.status >= 500
      });
    }

    const contentType = (response.headers.get('content-type') ?? '').split(';', 1)[0].trim().toLowerCase();
    if (!allowedContentTypes.includes(contentType)) {
      throw new GeodataError('UPSTREAM_CONTENT_TYPE_REJECTED', 'The configured OSM source returned an unsupported content type.', {
        statusCode: 502,
        retryable: false
      });
    }

    const bytes = await readBoundedBody(response, maxResponseBytes);
    let text;
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch (error) {
      throw new GeodataError('UPSTREAM_INVALID_UTF8', 'The configured OSM source returned invalid UTF-8.', {
        statusCode: 502,
        retryable: false,
        cause: error
      });
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new GeodataError('UPSTREAM_INVALID_JSON', 'The configured OSM source returned invalid JSON.', {
        statusCode: 502,
        retryable: false,
        cause: error
      });
    }
  } catch (error) {
    if (error instanceof GeodataError) throw error;
    if (signal?.aborted && !timeoutSignal.aborted) {
      throw signal.reason instanceof Error ? signal.reason : error;
    }
    if (isAbortError(error) || timeoutSignal.aborted) {
      throw new GeodataError('UPSTREAM_TIMEOUT', 'The configured OSM source did not respond within 25 seconds.', {
        statusCode: 504,
        retryable: true,
        cause: error
      });
    }
    throw new GeodataError('UPSTREAM_FETCH_FAILED', 'The configured OSM source could not be reached.', {
      statusCode: 502,
      retryable: true,
      cause: error
    });
  }
}
