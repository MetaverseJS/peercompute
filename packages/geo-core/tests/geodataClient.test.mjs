import assert from 'node:assert/strict';
import test from 'node:test';

import {
  GeodataClient,
  configuredGeodataBaseUrl,
} from '../src/client/geodata.js';

test('resolves explicit production same-origin configuration', () => {
  assert.equal(configuredGeodataBaseUrl({ DEV: false }), null);
  assert.equal(configuredGeodataBaseUrl({
    DEV: false,
    VITE_GEODATA_SAME_ORIGIN: 'true',
  }), '');
  assert.equal(configuredGeodataBaseUrl({
    DEV: false,
    VITE_GEODATA_API_URL: 'same-origin',
  }), '');
  assert.equal(configuredGeodataBaseUrl({
    DEV: false,
    VITE_GEODATA_API_URL: 'https://geo.example',
  }), 'https://geo.example');
});

test('rejects ambiguous or malformed production configuration', () => {
  assert.throws(() => configuredGeodataBaseUrl({
    DEV: false,
    VITE_GEODATA_SAME_ORIGIN: 'true',
    VITE_GEODATA_API_URL: 'https://geo.example',
  }), /either/u);
  assert.throws(() => configuredGeodataBaseUrl({
    DEV: false,
    VITE_GEODATA_SAME_ORIGIN: 'sometimes',
  }), /explicit boolean/u);
});

test('accepts the same-origin sentinel at the client boundary', () => {
  const client = new GeodataClient({
    baseUrl: 'same-origin',
    fetchImpl: async () => {
      throw new Error('not called');
    },
  });
  assert.equal(client.baseUrl, '');
  assert.equal(client.configured, true);
});
