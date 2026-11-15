import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BrowserHost } from '../host/BrowserHost.mjs';
import { chromium } from 'playwright';

const dir = await mkdtemp(join(tmpdir(), 'peercompute-root-browser-'));
const evidence = { startedAt: new Date().toISOString(), checks: [] };
const config = { dataDir: dir, port: 0, requireHardwareGpu: true,
  chromeArgs: process.env.PEERCOMPUTE_HOST_CHROME_ARGS ? JSON.parse(process.env.PEERCOMPUTE_HOST_CHROME_ARGS) : [
    '--enable-gpu', '--enable-unsafe-webgpu',
    ...(process.platform === 'linux' ? ['--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] : []),
  ], watchdogIntervalMs: 1000, maxBrowserRestarts: 2 };
let host, requester;
let reportId;
async function waitFor(action, label, timeout = 45000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) { if (await action()) return; await new Promise(resolve => setTimeout(resolve, 200)); }
  throw new Error(`Timed out: ${label}`);
}
try {
  host = new BrowserHost(config);
  const started = await host.start();
  evidence.origin = started.origin;
  const identity = started.browser.identity.peerId;
  const relayId = started.companion.peerId;
  assert.notEqual(identity, relayId);
  assert.equal(started.browser.environment.secureContext, true);
  assert.equal(started.browser.environment.crossOriginIsolated, true);
  await waitFor(async () => {
    const status = await host.page.evaluate(() => window.peercomputeRoot.status());
    return status.addresses.some(address => address.includes('/p2p-circuit'));
  }, 'browser relay reservation');
  const status = await host.page.evaluate(() => window.peercomputeRoot.status());
  assert(status.connections.some(connection => connection.remotePeer === relayId && connection.encryption === '/noise'));
  assert.equal(host.companion.getStatus().relay.mode, 'hosted-only');
  evidence.checks.push('distinct browser/native identities, own relay reservation, encrypted Noise transport');
  evidence.gpu = await host.qualifyCompute();
  assert.equal(evidence.gpu.worker, true);
  assert.equal(evidence.gpu.adapter.isFallbackAdapter, false);
  assert.equal(evidence.gpu.results.length, 64);
  assert.equal(evidence.gpu.results[63], (63 * 63 + 1) * 3 + 7);
  evidence.checks.push('actual hardware WGSL through ComputeManager managed worker, exact 64-value readback');
  await host.page.evaluate(() => window.peercomputeRoot.writeMarker({ key: 'restart-proof', value: { acknowledged: true, n: 42 } }));
  const duplicate = await host.context.newPage();
  await duplicate.goto(started.origin);
  await duplicate.waitForFunction(() => Boolean(window.peercomputeRoot));
  await assert.rejects(duplicate.evaluate(id => window.peercomputeRoot.prepare({ installationId: id }), started.installationId), /already running/);
  await duplicate.close();
  evidence.checks.push('Web Lock rejects second runtime in the same installation');
  requester = await chromium.launchPersistentContext(join(dir, 'requester-profile'), {
    executablePath: config.chromePath || process.env.CHROME_PATH || '/usr/bin/google-chrome',
    headless: true, args: ['--disable-gpu'],
  });
  const peerPage = await requester.newPage();
  await peerPage.goto(started.origin);
  await peerPage.waitForFunction(() => Boolean(window.peercomputeRoot));
  const peerIdentity = await peerPage.evaluate(() => window.peercomputeRoot.prepare({ installationId: 'requester' }));
  await host.companion.setHostedPeerIds([identity, peerIdentity.peerId]);
  await peerPage.evaluate(bootstrapPeers => window.peercomputeRoot.start({ installationId: 'requester',
    bootstrapPeers, connectNetwork: true, requireHardwareGpu: false, allowLocalDial: true }), host.companion.getStatus().localMultiaddrs);
  const rootAddress = status.addresses.find(address => address.includes('/p2p-circuit') && !address.includes('/webrtc'));
  assert(rootAddress, 'root has a circuit address');
  const peerConnection = await peerPage.evaluate(address => window.peercomputeRoot.connectPeer(address), rootAddress);
  assert.equal(peerConnection.peerId, identity);
  assert.equal(peerConnection.encryption, '/noise');
  // A protocol fixture, not a claim that an actual HF model was inspected.
  const fixture = { schema: 'peercompute.model-evidence.v1', observedAt: Date.now(),
    source: { repository: 'peercompute/host-protocol-fixture', revision: 'a'.repeat(40) },
    compatibility: { clientBuild: 'host-test', inspectorVersion: 'fixture-1', policyVersion: 'fixture-1' },
    environment: { kind: 'browser' }, stage: 'inspection', outcome: 'incomplete',
    prompt: 'PRIVATE_FIXTURE_MUST_NOT_BE_RECORDED', error: 'PRIVATE_ERROR' };
  const accepted = await peerPage.evaluate(({ peerId, fixture }) => window.peercomputeRoot.submitEvidence(peerId, [fixture]), { peerId: identity, fixture });
  reportId = accepted.ids[0];
  const fetched = await peerPage.evaluate(peerId => window.peercomputeRoot.queryPeerEvidence(peerId, { repository: 'peercompute/host-protocol-fixture' }), identity);
  assert.equal(fetched.length, 1);
  assert.equal(fetched[0].id, reportId);
  assert.equal(fetched[0].reporterPeerId, peerIdentity.peerId);
  assert.equal(fetched[0].provenance, 'authenticated-peer');
  assert(!JSON.stringify(fetched).includes('PRIVATE_'));
  await peerPage.evaluate(({ peerId, fixture }) => window.peercomputeRoot.submitEvidence(peerId, [fixture]), { peerId: identity, fixture });
  assert.equal((await host.page.evaluate(() => window.peercomputeRoot.queryEvidence({ repository: 'peercompute/host-protocol-fixture' }))).length, 1);
  await peerPage.evaluate(() => window.peercomputeRoot.stop());
  await requester.close(); requester = null;
  evidence.checks.push('independent browser submits/queries durable evidence over encrypted native relay; authenticated provenance, deduplication and private-field projection');
  // Closing the owned browser externally exercises supervisor recovery without
  // gracefully stopping its JavaScript kernel or touching any user browser.
  const exited = host.context;
  await exited.close();
  await waitFor(() => host.state === 'running' && host.context !== exited && host.restarts === 1, 'automatic browser recovery');
  assert.equal((await host.page.evaluate(() => window.peercomputeRoot.status())).identity.peerId, identity);
  assert.deepEqual((await host.page.evaluate(() => window.peercomputeRoot.readMarker('restart-proof'))).value, { acknowledged: true, n: 42 });
  assert.equal((await host.page.evaluate(() => window.peercomputeRoot.queryEvidence({ repository: 'peercompute/host-protocol-fixture' })))[0].id, reportId);
  evidence.checks.push('external browser exit recovers automatically with committed IndexedDB and peer identity');
  await host.stop();
  host = new BrowserHost(config);
  const restarted = await host.start({ rebuild: false });
  assert.equal(restarted.origin, evidence.origin);
  assert.equal(restarted.browser.identity.peerId, identity);
  assert.equal(restarted.companion.peerId, relayId);
  assert.deepEqual((await host.page.evaluate(() => window.peercomputeRoot.readMarker('restart-proof'))).value, { acknowledged: true, n: 42 });
  assert.equal((await host.page.evaluate(() => window.peercomputeRoot.queryEvidence({ repository: 'peercompute/host-protocol-fixture' })))[0].id, reportId);
  evidence.gpuAfterRestart = await host.qualifyCompute();
  assert.deepEqual(evidence.gpuAfterRestart.results, evidence.gpu.results);
  assert.deepEqual(host.pageErrors, []);
  evidence.checks.push('full supervisor restart restores origin, both identities, committed data and real GPU execution');
  evidence.status = 'passed';
} catch (error) {
  evidence.status = 'failed'; evidence.error = error.stack;
  throw error;
} finally {
  await requester?.close();
  await host?.stop();
  if (process.env.PEERCOMPUTE_HOST_REPORT) await writeFile(process.env.PEERCOMPUTE_HOST_REPORT, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
  await rm(dir, { recursive: true, force: true });
}
