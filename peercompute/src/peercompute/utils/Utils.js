/**
 * @fileoverview Utility functions for PeerCompute library
 * Common helper functions used across modules
 */

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export function generateId() {
  // TODO: Implement UUID generation
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  // TODO: Implement deep cloning
  // TODO: Handle special types (Date, Map, Set, etc)
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Serialize data for network transmission
 * @param {any} data - Data to serialize
 * @returns {ArrayBuffer} Serialized data
 */
export function serialize(data) {
  // TODO: Implement efficient serialization
  // TODO: Support binary data, typed arrays, etc
  const json = JSON.stringify(data);
  return new TextEncoder().encode(json);
}

/**
 * Deserialize data from network
 * @param {ArrayBuffer} buffer - Serialized data
 * @returns {any} Deserialized data
 */
export function deserialize(buffer) {
  // TODO: Implement deserialization
  const json = new TextDecoder().decode(buffer);
  return JSON.parse(json);
}

/**
 * Calculate hash of data
 * @param {any} data - Data to hash
 * @returns {Promise<string>} Hash string
 */
export async function hash(data) {
  // TODO: Implement cryptographic hash (SHA-256)
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  const buffer = new TextEncoder().encode(serialized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Defer execution to next tick
 * @returns {Promise<void>}
 */
export function nextTick() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @returns {Promise<{result: any, duration: number}>}
 */
export async function measureTime(fn) {
  // TODO: Implement high-precision timing
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum retry attempts
 * @param {number} options.initialDelay - Initial delay in ms
 * @param {number} options.maxDelay - Maximum delay in ms
 * @returns {Promise<any>} Function result
 */
export async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 100,
    maxDelay = 5000
  } = options;

  // TODO: Implement retry logic with exponential backoff
  // TODO: Handle specific error types
  let lastError;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Throttle function execution
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Throttle delay in ms
 * @returns {Function} Throttled function
 */
export function throttle(fn, delay) {
  // TODO: Implement throttling
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  // TODO: Implement debouncing
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}
