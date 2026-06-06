import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ULG_URL = process.env.ULG_HANDOFF_URL || 'http://127.0.0.1:5173/';
const CHROME_BIN = process.env.CHROME_BIN || '/bin/google-chrome';
const HEADLESS = process.env.HEADLESS !== '0';
const TIMEOUT_MS = Number(process.env.ULG_HANDOFF_TIMEOUT_MS || 45000);
const EXPECTED_CANONICAL_SUITE_HASH = 'sha256:7d4e6372e49689d2202914e210af84d19d776dc6fbc5b7e08b19cbedfb71b455';
const EXPECTED_ESHKOL_SOURCE_HASH = 'sha256:73f2a89ffe3434d995ffe1174185462cf0c2edb653fbe4d1286342b788763052';
const EXPECTED_ESHKOL_WASM_HASH = 'sha256:38902bb4b3f5ed8abf513a4d739ff9ca99727696df271c3ff17127575785b947';

function getUlgOrigin() {
  return new URL(ULG_URL).origin;
}

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME_BIN,
    headless: HEADLESS,
    args: [
      '--ignore-certificate-errors',
      '--enable-unsafe-webgpu',
      '--enable-unsafe-swiftshader'
    ]
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 920 }
  });
  const page = await context.newPage();

  try {
    await page.goto(ULG_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
    await page.waitForFunction(() => window.__ulgDemo?.telemetry?.artifacts?.length >= 2, null, {
      timeout: TIMEOUT_MS
    });

    const handoffProbe = await page.evaluate(async () => {
      const handoff = await window.__ulgDemo.createPeerComputeHandoff();
      const eshkol = handoff.artifacts.find((artifact) => artifact.ref.sourceService === 'eshkol');
      return {
        artifactCount: handoff.artifactCount,
        canonicalSuiteHash: eshkol?.artifact?.validation?.closureDescriptor?.descriptorBinding?.moonlabNormalizedReferenceSuite?.contentHash || null,
        sourceSha256: eshkol?.artifact?.provenance?.sourceSha256 || null,
        wasmSha256: eshkol?.artifact?.provenance?.wasmSha256 || null,
        sourceMetadataPath: eshkol?.artifact?.provenance?.sourceContracts?.[0]?.metadataPath || null
      };
    });
    assert.equal(handoffProbe.artifactCount, 2);
    assert.equal(handoffProbe.canonicalSuiteHash, EXPECTED_CANONICAL_SUITE_HASH);
    assert.equal(handoffProbe.sourceSha256, EXPECTED_ESHKOL_SOURCE_HASH);
    assert.equal(handoffProbe.wasmSha256, EXPECTED_ESHKOL_WASM_HASH);
    assert.equal(handoffProbe.sourceMetadataPath, 'magnetar_closure.ulg-metadata.json');

    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }),
      page.getByRole('button', { name: 'Launch Magnetar' }).click()
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForFunction(() => window.__multiscaleDemo?.getScenarioHandoffReadiness?.()?.status === 'handoff-ready', null, {
      timeout: TIMEOUT_MS
    });
    await page.waitForFunction(() => /^handoff ready/i.test(document.querySelector('#handoff-status')?.textContent || ''), null, {
      timeout: 10000
    });

    const multiscaleProbe = await popup.evaluate((ulgOrigin) => {
      const readiness = window.__multiscaleDemo.getScenarioHandoffReadiness();
      const state = window.__multiscaleDemo.getState();
      const bridge = window.__multiscaleDemo.getUlgBrowserHandoffImportState();
      return {
        multiscaleUrl: window.location.href,
        trustedUlgOrigin: window.__multiscaleDemo.isTrustedUlgBrowserHandoffOrigin(ulgOrigin),
        rejectsWrongPort: window.__multiscaleDemo.isTrustedUlgBrowserHandoffOrigin(ulgOrigin.replace(/:5173$/, ':5174')),
        rejectsForeignHost: window.__multiscaleDemo.isTrustedUlgBrowserHandoffOrigin('http://example.com:5173'),
        readinessStatus: readiness.status,
        blockerCount: readiness.blockerCount,
        simulationStatus: readiness.simulationStatus,
        bridgeAckStatus: bridge.ack?.status || null,
        bridgeAckBlockers: bridge.ack?.blockerCount ?? null,
        magnetarVisible: state.magnetarProxyVisual.visible,
        magnetarLayer: state.magnetarProxyVisual.activeLayerId,
        hudStatus: document.querySelector('#scenario-handoff-status')?.textContent || null
      };
    }, getUlgOrigin());
    assert.equal(multiscaleProbe.trustedUlgOrigin, true);
    assert.equal(multiscaleProbe.rejectsWrongPort, false);
    assert.equal(multiscaleProbe.rejectsForeignHost, false);
    assert.equal(multiscaleProbe.readinessStatus, 'handoff-ready');
    assert.equal(multiscaleProbe.blockerCount, 0);
    assert.equal(multiscaleProbe.simulationStatus, 'scientific-ready');
    assert.equal(multiscaleProbe.bridgeAckStatus, 'handoff-ready');
    assert.equal(multiscaleProbe.bridgeAckBlockers, 0);
    assert.equal(multiscaleProbe.magnetarVisible, true);
    assert.equal(multiscaleProbe.magnetarLayer, 'solar');
    assert.match(multiscaleProbe.hudStatus, /status handoff ready \/ blockers 0/i);

    const ulgStatus = await page.locator('#handoff-status').textContent();
    assert.match(ulgStatus || '', /^handoff ready \/ blockers 0/i);
    console.log(JSON.stringify({
      schema: 'peercompute.multiscale.ulg-browser-handoff-smoke.v0',
      ulgUrl: ULG_URL,
      ulgStatus,
      handoff: handoffProbe,
      multiscale: multiscaleProbe
    }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
