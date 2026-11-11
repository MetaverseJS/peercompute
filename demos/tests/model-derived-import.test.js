import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { GEMMA4_MEDIA_MODEL_CATALOG } from '../../peercompute/src/peercompute/artifacts/gemma4MediaModelCatalog.js';
import { GEMMA4_MODEL_CATALOG } from '../../peercompute/src/peercompute/artifacts/gemma4ModelCatalog.js';
import { trustedCatalogSource } from '../inference/src/modelCatalogSources.js';
import { importModelPackage } from '../inference/src/modelLibrary.js';
import { downloadFile } from '../../scripts/import-ipfs-artifact.mjs';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

test('derived sources require the exact trusted model and complete immutable package', () => {
  const entry = Object.values(GEMMA4_MEDIA_MODEL_CATALOG)[0];
  const source = trustedCatalogSource(entry);
  assert(source);
  assert.match(source.sourceUrl(entry.files[0].path), /TrevorJS\/gemma-4-12B-it-uncensored-GGUF\/resolve\/[a-f0-9]{40}\//);
  assert.equal(trustedCatalogSource(Object.values(GEMMA4_MODEL_CATALOG)[0]), null);
  for (const change of [
    (copy) => { copy.model.ggufMedia.profile = 'untrusted-recipe'; },
    (copy) => { copy.files.pop(); },
    (copy) => { copy.files.at(-1).sha256 = 'a'.repeat(64); },
    (copy) => { copy.files.at(-1).size++; },
    (copy) => { copy.model.revision = 'a'.repeat(40); },
  ]) {
    const copy = structuredClone(entry); change(copy);
    assert.equal(trustedCatalogSource(copy), null);
  }
});

test('import reuses decoder bytes and verifies the derived companion before retaining a new manifest', async () => {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const weights = new TextEncoder().encode('Saved decoder'), companion = new TextEncoder().encode('Derived projection');
  const file = (path, bytes) => ({ path, size: bytes.length, sha256: bytesToHex(sha256(bytes)) });
  const decoder = file('decoder.gguf', weights), projector = file('projector.gguf', companion);
  const original = { schema: 'peercompute.artifact.manifest.v1', name: 'Text fixture',
    model: { runtime: 'fixture' }, files: [decoder] };
  try {
    const saved = await importModelPackage(store, original, () => 'fixture', { fetchImpl: async () => new Response(weights) });
    const calls = [];
    const enhanced = { ...original, name: 'Media fixture', files: [decoder, projector] };
    const imported = await importModelPackage(store, enhanced, () => { throw new Error('No decoder re-download'); }, {
      async *openSource(requested) { calls.push(requested.path); yield companion; },
    });
    assert.deepEqual(calls, ['projector.gguf']);
    assert.equal(imported.manifest.files[0].cid, saved.manifest.files[0].cid);
    assert.equal(imported.manifest.files[1].sha256, projector.sha256);
    assert.equal((await store.getManifest(saved.cid)).name, 'Text fixture');
    assert.notEqual(imported.cid, saved.cid);
  } finally { await store.destroy(); }
});

test('a corrupt or cancelled derived artifact cannot publish its package', async () => {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const spec = { schema: 'peercompute.artifact.manifest.v1', name: 'Invalid derived fixture', model: { runtime: 'fixture' },
    files: [{ path: 'projection.gguf', size: 4, sha256: bytesToHex(sha256(new Uint8Array([1, 2, 3, 4]))) }] };
  try {
    await assert.rejects(importModelPackage(store, spec, () => 'unused', {
      async *openSource() { yield new Uint8Array(4); },
    }), /mismatch|does not match/i);
    const controller = new AbortController();
    await assert.rejects(importModelPackage(store, spec, () => 'unused', {
      signal: controller.signal,
      async *openSource() { controller.abort(); yield new Uint8Array([1, 2, 3, 4]); },
    }), { name: 'AbortError' });
    const manifests = [];
    for await (const record of store.list()) if (record.kind === 'manifest') manifests.push(record);
    assert.deepEqual(manifests, []);
  } finally { await store.destroy(); }
});

test('CLI companion import uses bounded source ranges and removes corrupt temporary output', async () => {
  const entry = Object.values(GEMMA4_MEDIA_MODEL_CATALOG)[0], file = entry.files.at(-1);
  const directory = await mkdtemp(join(tmpdir(), 'peercompute-derived-cli-')), requests = [];
  try {
    await assert.rejects(downloadFile(entry, file, join(directory, file.path), {
      async fetchImpl(url, { headers }) {
        assert.match(url, /model\.safetensors$/); assert(!url.includes(file.path));
        const match = /^bytes=(\d+)-(\d+)$/.exec(headers.Range); assert(match);
        const start = Number(match[1]), end = Number(match[2]), size = end - start + 1;
        assert(size > 0 && size <= 1024 ** 2); requests.push({ start, end });
        return new Response(new Uint8Array(size), { status: 206,
          headers: { 'Content-Range': `bytes ${start}-${end}/23919549408`, 'Content-Length': String(size) } });
      },
    }), /source tensor digest mismatch/);
    assert.equal(requests.length, 5, 'the first source tensor is verified before fetching another');
    assert.deepEqual(await readdir(directory), []);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
