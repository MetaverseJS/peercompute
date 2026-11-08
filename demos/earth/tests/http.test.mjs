import assert from 'node:assert/strict';
import test from 'node:test';

import { readResponseBytesBounded } from '../src/http.js';

function streamingResponse(chunks, { contentLength = null } = {}) {
  let index = 0;
  let cancelled = false;
  let released = false;
  const reader = {
    async read() {
      if (index >= chunks.length) return { done: true, value: undefined };
      const value = chunks[index];
      index += 1;
      return { done: false, value };
    },
    async cancel() { cancelled = true; },
    releaseLock() { released = true; }
  };
  return {
    response: {
      headers: new Headers(contentLength === null ? {} : { 'content-length': String(contentLength) }),
      body: { getReader: () => reader },
      arrayBuffer: async () => { throw new Error('streaming response must not buffer through arrayBuffer'); }
    },
    state: () => ({ cancelled, released, reads: index })
  };
}

test('assembles a response stream while staying within the decoded byte cap', async () => {
  const source = streamingResponse([
    new Uint8Array([1, 2]),
    new Uint8Array([3, 4, 5])
  ]);
  const bytes = await readResponseBytesBounded(source.response, {
    maximumBytes: 5,
    label: 'Fixture response'
  });
  assert.deepEqual([...bytes], [1, 2, 3, 4, 5]);
  assert.deepEqual(source.state(), { cancelled: false, released: true, reads: 2 });
});

test('cancels a stream as soon as an undeclared body crosses its byte cap', async () => {
  const source = streamingResponse([
    new Uint8Array(700),
    new Uint8Array(400),
    new Uint8Array(100)
  ]);
  await assert.rejects(() => readResponseBytesBounded(source.response, {
    maximumBytes: 1_024,
    label: 'Fixture response',
    tooLargeCode: 'ERR_FIXTURE_TOO_LARGE'
  }), (error) => error.code === 'ERR_FIXTURE_TOO_LARGE');
  assert.deepEqual(source.state(), { cancelled: true, released: true, reads: 2 });
});

test('rejects an over-cap or malformed declared length before reading the body', async () => {
  const oversized = streamingResponse([new Uint8Array(1)], { contentLength: 2_048 });
  await assert.rejects(() => readResponseBytesBounded(oversized.response, {
    maximumBytes: 1_024,
    tooLargeCode: 'ERR_FIXTURE_TOO_LARGE'
  }), (error) => error.code === 'ERR_FIXTURE_TOO_LARGE');
  assert.deepEqual(oversized.state(), { cancelled: false, released: false, reads: 0 });

  const invalid = streamingResponse([new Uint8Array(1)]);
  invalid.response.headers = new Headers({ 'content-length': '-1' });
  await assert.rejects(() => readResponseBytesBounded(invalid.response, {
    maximumBytes: 1_024
  }), (error) => error.code === 'ERR_RESPONSE_LENGTH_INVALID');
});
