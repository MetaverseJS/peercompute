import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

const DANGEROUS_MODULE_SCHEMES = /^(?:data|blob|javascript|vbscript|about|chrome|chrome-extension|filesystem):/i;
const CONTROL_CHAR_PATTERN = /[\u0000-\u001f\u007f]/;
const UTF8_ENCODER = new TextEncoder();

function normalizeStringSet(values) {
  if (!Array.isArray(values)) return new Set();
  return new Set(values.map((entry) => String(entry || '').trim()).filter(Boolean));
}

function createUnsafeModuleUrlError(message, { url = null, fieldName = 'module', reason = 'unsafe-module-url' } = {}) {
  const err = new Error(message);
  err.code = 'ERR_REMOTE_COMPUTE_UNSAFE_MODULE_URL';
  err.url = url;
  err.fieldName = fieldName;
  err.reason = reason;
  return err;
}

/**
 * Validate a module or WASM URL supplied by an untrusted remote compute request.
 *
 * By default, permits only:
 * - registered built-in `peercompute:*` modules (gated separately by extensionRegistry)
 * - explicit entries in `allowedRemoteModules`
 * - relative same-origin paths (`/foo.js`, `./foo.js`, `../foo.js`)
 * - same-origin `http:`/`https:` URLs matching `baseUrl` or `globalThis.location.origin`
 * - `http:`/`https:` URLs whose origin appears in `allowedRemoteModuleOrigins`
 *
 * Explicitly blocks `data:`, `blob:`, `javascript:`, `vbscript:`, `file:` (unless
 * `allowLocalFileModules === true`), protocol-relative `//...`, and cross-origin URLs
 * unless `allowUntrustedRemoteModules === true`.
 */
export function assertSafeRemoteModuleUrl(moduleUrl, options = {}) {
  if (moduleUrl == null || moduleUrl === '') return;
  if (typeof moduleUrl !== 'string' && !(moduleUrl instanceof URL)) {
    // Non-URL sources (e.g. inline WASM Uint8Array / ArrayBuffer / WebAssembly.Module)
    return;
  }

  const fieldName = String(options.fieldName || 'module');
  const raw = String(moduleUrl).trim();
  if (!raw) return;

  if (CONTROL_CHAR_PATTERN.test(raw) || raw.includes('\\')) {
    throw createUnsafeModuleUrlError(
      `Remote compute ${fieldName} URL contains illegal control or backslash characters`,
      { url: raw, fieldName, reason: 'illegal-characters' }
    );
  }

  if (options.allowUntrustedRemoteModules === true) {
    return;
  }

  if (raw.startsWith('peercompute:')) {
    return;
  }

  const allowedModules = normalizeStringSet(options.allowedRemoteModules);
  if (allowedModules.has(raw)) {
    return;
  }

  if (raw.startsWith('//')) {
    throw createUnsafeModuleUrlError(
      `Remote compute ${fieldName} URL cannot use protocol-relative scheme: ${raw}`,
      { url: raw, fieldName, reason: 'protocol-relative-url' }
    );
  }

  if (DANGEROUS_MODULE_SCHEMES.test(raw)) {
    throw createUnsafeModuleUrlError(
      `Remote compute ${fieldName} URL uses a disallowed scheme: ${raw}`,
      { url: raw, fieldName, reason: 'disallowed-scheme' }
    );
  }

  const effectiveBase = options.baseUrl
    || (typeof globalThis.location?.href === 'string' && globalThis.location.href ? globalThis.location.href : null);

  if (raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../')) {
    if (effectiveBase) {
      let baseParsed;
      let resolved;
      try {
        baseParsed = new URL(effectiveBase);
        resolved = new URL(raw, baseParsed);
      } catch {
        throw createUnsafeModuleUrlError(
          `Remote compute ${fieldName} relative URL failed origin validation: ${raw}`,
          { url: raw, fieldName, reason: 'invalid-relative-url' }
        );
      }
      if (baseParsed.origin !== 'null' && resolved.origin !== baseParsed.origin) {
        throw createUnsafeModuleUrlError(
          `Remote compute ${fieldName} URL must remain same-origin: ${raw}`,
          { url: raw, fieldName, reason: 'cross-origin-url' }
        );
      }
    }
    return;
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw createUnsafeModuleUrlError(
      `Remote compute ${fieldName} URL is not a valid relative path or URL: ${raw}`,
      { url: raw, fieldName, reason: 'invalid-url' }
    );
  }

  if (parsed.protocol === 'file:') {
    if (options.allowLocalFileModules === true) {
      return;
    }
    throw createUnsafeModuleUrlError(
      `Remote compute ${fieldName} URL cannot load local file:// modules without explicit allowlist: ${raw}`,
      { url: raw, fieldName, reason: 'local-file-disallowed' }
    );
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createUnsafeModuleUrlError(
      `Remote compute ${fieldName} URL uses unsupported scheme "${parsed.protocol}": ${raw}`,
      { url: raw, fieldName, reason: 'unsupported-scheme' }
    );
  }

  const allowedOrigins = normalizeStringSet(options.allowedRemoteModuleOrigins);
  if (allowedOrigins.has(parsed.origin)) {
    return;
  }

  if (effectiveBase) {
    try {
      const baseParsed = new URL(effectiveBase);
      if (baseParsed.origin !== 'null' && parsed.origin === baseParsed.origin) {
        return;
      }
    } catch {
      // Fall through to fail-closed error
    }
  }

  throw createUnsafeModuleUrlError(
    `Remote compute ${fieldName} URL must be same-origin or explicitly allowlisted: ${raw}`,
    { url: raw, fieldName, reason: 'cross-origin-url' }
  );
}

/**
 * Validate all module and WASM URL fields on a remote compute task payload.
 */
export function assertSafeRemoteTaskUrls(task = {}, options = {}) {
  if (!task || typeof task !== 'object') return;
  const wasm = task.wasm && typeof task.wasm === 'object' ? task.wasm : null;
  const checks = [
    ['module', task.module],
    ['hostModule', task.hostModule],
    ['wasmSource', task.wasmSource],
    ['source', task.source],
    ['wasm.source', wasm?.source],
    ['wasm.importsModule', wasm?.importsModule],
    ['wasm.resultModule', wasm?.resultModule]
  ];
  for (const [fieldName, value] of checks) {
    assertSafeRemoteModuleUrl(value, { ...options, fieldName });
  }
}

/**
 * Deterministically canonicalize arbitrary JS values (including DataView,
 * TypedArrays, ArrayBuffer, BigInt, non-finite numbers, -0, and cyclic objects)
 * into a JSON-serializable structure for hashing.
 */
export function stableCanonicalValue(value, { omitKeys = null, seen = new WeakSet() } = {}) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'number') {
    if (Object.is(value, -0)) return '-0';
    return Number.isFinite(value) ? value : String(value);
  }
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (typeof value === 'function') return `[Function:${value.name || 'anonymous'}]`;
  if (value instanceof DataView) {
    return {
      typedArray: 'DataView',
      values: Array.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength))
    };
  }
  if (ArrayBuffer.isView(value)) {
    return {
      typedArray: value.constructor?.name || 'TypedArray',
      values: Array.from(value, (entry) => (typeof entry === 'bigint' ? `${entry.toString()}n` : entry))
    };
  }
  if (value instanceof ArrayBuffer) {
    return {
      arrayBufferBytes: Array.from(new Uint8Array(value))
    };
  }
  if (typeof value === 'object') {
    if (seen.has(value)) {
      return '[Circular]';
    }
    seen.add(value);
    try {
      if (Array.isArray(value)) {
        return value.map((entry) => stableCanonicalValue(entry, { omitKeys, seen }));
      }
      const out = {};
      for (const key of Object.keys(value).sort()) {
        if (omitKeys && omitKeys.has(key)) continue;
        const entry = stableCanonicalValue(value[key], { omitKeys, seen });
        if (entry !== undefined) out[key] = entry;
      }
      return out;
    } finally {
      seen.delete(value);
    }
  }
  return String(value);
}

export function sha256StableHash(value, options = {}) {
  if (value === undefined) return null;
  const serialized = JSON.stringify(stableCanonicalValue(value, options));
  const digest = sha256(UTF8_ENCODER.encode(String(serialized ?? '')));
  return `sha256-${bytesToHex(digest)}`;
}

export function fnv1a32StableHash(value, options = {}) {
  if (value === undefined) return null;
  const input = String(JSON.stringify(stableCanonicalValue(value, options)) ?? '');
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32-${hash.toString(16).padStart(8, '0')}`;
}
