/**
 * @fileoverview URL-driven debug output controls for browser clients.
 */

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

let cachedDebugOutputEnabled = null;

export function isDebugOutputEnabled() {
  if (typeof cachedDebugOutputEnabled === 'boolean') {
    return cachedDebugOutputEnabled;
  }

  if (typeof globalThis !== 'undefined' && typeof globalThis.__PC_DEBUG_OUTPUT__ === 'boolean') {
    cachedDebugOutputEnabled = globalThis.__PC_DEBUG_OUTPUT__;
    return cachedDebugOutputEnabled;
  }

  if (typeof window === 'undefined' || !window.location) {
    cachedDebugOutputEnabled = false;
    return cachedDebugOutputEnabled;
  }

  try {
    const params = new URLSearchParams(window.location.search || '');
    const rawValue = String(params.get('debugoutput') || '').trim().toLowerCase();
    cachedDebugOutputEnabled = TRUE_VALUES.has(rawValue);
  } catch (_) {
    cachedDebugOutputEnabled = false;
  }

  return cachedDebugOutputEnabled;
}
