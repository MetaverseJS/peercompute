import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir, hostname } from 'node:os';
import { join } from 'node:path';
import { acquireProfileLock } from '../host/profileLock.mjs';
import { normalizeHostConfig, companionBootstrapAddresses } from '../host/config.mjs';
import { startHostServer } from '../host/staticServer.mjs';
import { BrowserHost } from '../host/BrowserHost.mjs';
import { get } from 'node:http';

test('exclusive profile ownership, release and crashed-supervisor recovery', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'peercompute-host-lock-'));
  try {
    const release = await acquireProfileLock(dir);
    await assert.rejects(acquireProfileLock(dir), /already owned/);
    await release(); await release();
    await mkdir(join(dir, 'host.lock'));
    await writeFile(join(dir, 'host.lock/owner.json'), JSON.stringify({ pid: 2147483647, hostname: hostname(), token: 'crashed' }));
    const recovered = await acquireProfileLock(dir);
    await recovered();
    await mkdir(join(dir, 'host.lock'));
    await writeFile(join(dir, 'host.lock/owner.json'), '{');
    await assert.rejects(acquireProfileLock(dir), /inspect/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('configuration keeps identities outside source and validates ports/options', () => {
  assert.throws(() => normalizeHostConfig({ dataDir: process.cwd() }), /outside the repository/);
  assert.throws(() => normalizeHostConfig({ port: -1 }), /Invalid port/);
  assert.throws(() => normalizeHostConfig({ chromeArgs: '--flag' }), /contain strings/);
  assert.throws(() => normalizeHostConfig({ requireHardwareGpu: 'false' }), /boolean/);
  assert.throws(() => normalizeHostConfig({ typo: true }), /Unknown/);
  assert.throws(() => normalizeHostConfig({ companion: { enabled: 'false' } }), /boolean/);
  assert.equal(normalizeHostConfig().companion.enabled, true);
  assert.deepEqual(normalizeHostConfig().bootstrapPeers, []);
});

test('TLS bootstrap uses certificate hostname with the actual bound port', () => {
  const status = { peerId: 'peer', localMultiaddrs: ['/ip4/127.0.0.1/tcp/2345/wss/p2p/peer'] };
  assert.deepEqual(companionBootstrapAddresses(status, { tls: {}, connectHost: 'host.example' }), ['/dns4/host.example/tcp/2345/wss/p2p/peer']);
  assert.deepEqual(companionBootstrapAddresses(status, { tls: {}, announce: ['/dns4/public.example/tcp/443/wss'] }), ['/dns4/public.example/tcp/443/wss/p2p/peer']);
});

test('bootstrap serves isolated assets and read-only health with no control endpoint', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'peercompute-host-http-'));
  let server;
  try {
    await writeFile(join(dir, 'index.html'), '<!doctype html><title>Host</title>');
    server = await startHostServer({ directory: dir, port: 0, status: () => ({ state: 'running' }) });
    const page = await fetch(server.origin);
    assert.equal(page.status, 200);
    assert.equal(page.headers.get('cross-origin-embedder-policy'), 'require-corp');
    assert.deepEqual(await (await fetch(`${server.origin}/health`)).json(), { state: 'running' });
    assert.equal((await fetch(`${server.origin}/health`, { method: 'POST' })).status, 405);
    const foreignHostStatus = await new Promise((resolve, reject) => {
      get(`${server.origin}/health`, { headers: { Host: 'foreign.example' } }, response => {
        response.resume(); resolve(response.statusCode);
      }).on('error', reject);
    });
    assert.equal(foreignHostStatus, 403);
    assert.equal((await fetch(`${server.origin}/%2e%2e%2foutside`)).status, 404);
    assert.equal((await fetch(`${server.origin}/control`)).status, 404);
  } finally { await server?.stop(); await rm(dir, { recursive: true, force: true }); }
});

test('failed cleanup keeps resource ownership for retry and does not release profile', async () => {
  const host = new BrowserHost({ dataDir: join(tmpdir(), 'peercompute-cleanup-fixture') });
  let attempts = 0, releases = 0;
  const companion = { stop: async () => { if (++attempts === 1) throw new Error('temporary shutdown failure'); } };
  host.companion = companion;
  host.releaseLock = async () => { releases++; };
  await assert.rejects(host.stop(), /ownership retained/);
  assert.equal(host.companion, companion);
  assert.equal(releases, 0);
  await host.stop();
  assert.equal(attempts, 2);
  assert.equal(releases, 1);
  assert.equal(host.state, 'stopped');
});


test('public root directory exposes only live secure DNS relay routes and expires quickly', async () => {
  const { publicEvidenceDirectory } = await import('../host/evidenceDirectory.mjs');
  const address = '/dns4/secretworkshop.net/tcp/443/wss/p2p/relay/p2p-circuit/p2p/root';
  const status = { phase: 'ready', connected: true, evidence: { network: { serving: true } }, identity: { peerId: 'root' }, addresses: [address,
    '/ip4/127.0.0.1/tcp/123/ws/p2p/root', address.replace('secretworkshop.net', 'localhost')] };
  const result = publicEvidenceDirectory(status, 1000);
  assert.deepEqual(result.addresses, [address]); assert.equal(result.expiresAt, 121000);
  assert.equal(publicEvidenceDirectory({ ...status, phase: 'stopped' }), null);
  assert.equal(publicEvidenceDirectory({ ...status, addresses: [] }), null);
});
