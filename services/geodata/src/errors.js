export class GeodataError extends Error {
  constructor(code, publicMessage, options = {}) {
    super(publicMessage, { cause: options.cause });
    this.name = 'GeodataError';
    this.code = code;
    this.statusCode = options.statusCode ?? 500;
    this.retryable = options.retryable ?? false;
    this.notes = Array.isArray(options.notes) ? [...options.notes] : [];
  }
}

export function isAbortError(error) {
  return error?.name === 'AbortError'
    || error?.name === 'TimeoutError'
    || error?.code === 'ABORT_ERR'
    || error?.code === 'ERR_REQUEST_ABORTED';
}

export function asPublicError(error) {
  if (error instanceof GeodataError) return error;

  if (isAbortError(error)) {
    return new GeodataError(
      'REQUEST_ABORTED',
      'The request ended before geodata was ready.',
      { statusCode: 499, retryable: true, cause: error }
    );
  }

  return new GeodataError(
    'INTERNAL_ERROR',
    'The geodata service could not complete the request.',
    { statusCode: 500, retryable: false, cause: error }
  );
}

export function createErrorEnvelope(error, now = Date.now()) {
  const publicError = asPublicError(error);
  return {
    schemaVersion: 'peercompute.geodata.error.v1',
    source: 'peercompute-geodata',
    status: 'error',
    synthetic: false,
    operationalUse: 'visualization and gameplay only; not for navigation or safety decisions',
    fetchedAt: new Date(now).toISOString(),
    staleAt: null,
    notes: [...publicError.notes],
    data: null,
    error: {
      code: publicError.code,
      message: publicError.message,
      retryable: publicError.retryable
    }
  };
}
