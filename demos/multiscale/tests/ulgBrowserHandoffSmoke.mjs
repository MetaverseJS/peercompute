import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ULG_URL = process.env.ULG_HANDOFF_URL || 'http://127.0.0.1:5173/';
const CHROME_BIN = process.env.CHROME_BIN || '/bin/google-chrome';
const HEADLESS = process.env.HEADLESS !== '0';
const TIMEOUT_MS = Number(process.env.ULG_HANDOFF_TIMEOUT_MS || 45000);
const EXPECTED_CANONICAL_SUITE_HASH = 'sha256:7d4e6372e49689d2202914e210af84d19d776dc6fbc5b7e08b19cbedfb71b455';
const EXPECTED_ESHKOL_SOURCE_HASH = 'sha256:630b20dd243be58f8e53631e934d09298696fe7e7ea84b15e7d7b89d18809b69';
const EXPECTED_ESHKOL_WASM_HASH = 'sha256:e0a3c7d280678a8c1e40865daeab6601dc8a6a64cfa5b29b7b6bfcaddc86c5aa';
const EXPECTED_ESHKOL_WASM_BYTE_LENGTH = 169528;
const EXPECTED_ESHKOL_TENSOR_CONTRACT_HASH = 'sha256:2289b8c8068f1a033cda20f09f30a33f2e41588b8ee2ccd1143100f2fe87dd64';
const EXPECTED_ESHKOL_RUNTIME_CLAIM = 'deterministic-tensor-runtime-smoke-only';
const EXPECTED_ESHKOL_LINEAR_MEMORY_STATUS = 'entry-export-runtime-smoke-passed';
const EXPECTED_ESHKOL_OFFSET_PROBE_STATUS = 'runtime-smoke-passed';
const EXPECTED_ESHKOL_OFFSET_PROBE_BLOCKER = 'none-for-deterministic-runtime-smoke-production-physics-unvalidated';
const EXPECTED_ESHKOL_PRODUCTION_BLOCKERS = [
  'production-magnetar-handler-not-implemented',
  'host-imports-are-deterministic-runtime-smoke-stubs-not-production',
  'full-physics-validation-not-run'
];

function getUlgOrigin() {
  return new URL(ULG_URL).origin;
}

function assertEshkolRuntimeSmokeProbe(handoffProbe) {
  assert.equal(handoffProbe.artifactCount, 2);
  assert.equal(handoffProbe.canonicalSuiteHash, EXPECTED_CANONICAL_SUITE_HASH);
  assert.equal(handoffProbe.sourceSha256, EXPECTED_ESHKOL_SOURCE_HASH);
  assert.equal(handoffProbe.wasmSha256, EXPECTED_ESHKOL_WASM_HASH);
  assert.equal(handoffProbe.executionModuleSha256, EXPECTED_ESHKOL_WASM_HASH);
  assert.equal(handoffProbe.wasmByteLength, EXPECTED_ESHKOL_WASM_BYTE_LENGTH);
  assert.equal(handoffProbe.sourceMetadataPath, 'magnetar_closure.ulg-metadata.json');
  assert.equal(handoffProbe.tensorRuntimeContractHash, EXPECTED_ESHKOL_TENSOR_CONTRACT_HASH);
  assert.equal(handoffProbe.tensorRuntimeStatus, 'declared-fixture-contract');
  assert.equal(handoffProbe.tensorRuntimeRuntimeStatus, 'deterministic-runtime-smoke-executed');
  assert.equal(handoffProbe.tensorRuntimeExecutionClaim, EXPECTED_ESHKOL_RUNTIME_CLAIM);
  assert.equal(handoffProbe.tensorRuntimeScientificValidation, false);
  assert.equal(handoffProbe.tensorRuntimeFullPhysicsValidation, false);
  assert.equal(handoffProbe.linearMemoryStatus, EXPECTED_ESHKOL_LINEAR_MEMORY_STATUS);
  assert.equal(handoffProbe.linearMemoryRuntimeStatus, 'deterministic-host-runtime-smoke-executed');
  assert.equal(handoffProbe.linearMemoryExecutionClaim, EXPECTED_ESHKOL_RUNTIME_CLAIM);
  assert.equal(handoffProbe.linearMemoryEntryExportConsumesOffsets, true);
  assert.deepEqual(handoffProbe.linearMemoryTensorConsumedByEntryExport, [true, true, true, true]);
  assert.equal(handoffProbe.smokeBindingStatus, EXPECTED_ESHKOL_LINEAR_MEMORY_STATUS);
  assert.equal(handoffProbe.smokeBindingEntryExportConsumesOffsets, true);
  assert.equal(handoffProbe.smokeBindingOutputInitialization, 'entry-export-produced');
  assert.equal(handoffProbe.offsetProbeStatus, EXPECTED_ESHKOL_OFFSET_PROBE_STATUS);
  assert.equal(handoffProbe.offsetProbeBlocker, EXPECTED_ESHKOL_OFFSET_PROBE_BLOCKER);
  assert.equal(handoffProbe.offsetProbeChangedBytesInDeclaredTensorRange, 64);
  assert.equal(handoffProbe.offsetProbeEntryExportConsumesOffsets, true);
  assert.equal(handoffProbe.offsetProbeOutputTensorsProducedByEntryExport, true);
  assert.equal(handoffProbe.offsetProbeObservedStdoutInvariantAcrossArgs, false);
  assert.equal(handoffProbe.productionHandlerBoundaryStatus, 'declared-not-executed');
  assert.deepEqual(handoffProbe.productionHandlerBoundaryBlockers, EXPECTED_ESHKOL_PRODUCTION_BLOCKERS);
  assert.deepEqual(handoffProbe.productionHandlerBoundaryAllowedExecutionClaims, [EXPECTED_ESHKOL_RUNTIME_CLAIM]);
  assert.equal(handoffProbe.productionHandlerBoundaryTensorMemoryStatus, EXPECTED_ESHKOL_LINEAR_MEMORY_STATUS);
  assert.equal(handoffProbe.productionHandlerBoundaryTensorMemoryEntryExportConsumesOffsets, true);
  assert.equal(handoffProbe.productionHandlerBoundaryRuntimeExecution, false);
  assert.equal(handoffProbe.productionHandlerBoundaryScientificValidation, false);
  assert.equal(handoffProbe.productionHandlerBoundaryFullPhysicsValidation, false);
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
      const descriptorBinding = eshkol?.artifact?.validation?.closureDescriptor?.descriptorBinding || null;
      const tensorRuntimeContract = descriptorBinding?.closureTensorRuntimeContract || null;
      const linearMemoryBinding = tensorRuntimeContract?.linearMemoryBinding || null;
      const smokeBinding = linearMemoryBinding?.smokeBinding || null;
      const offsetProbe = linearMemoryBinding?.entryExportOffsetProbe || null;
      const productionHandlerBoundary = descriptorBinding?.productionHandlerBoundary || null;
      return {
        artifactCount: handoff.artifactCount,
        canonicalSuiteHash: eshkol?.artifact?.validation?.closureDescriptor?.descriptorBinding?.moonlabNormalizedReferenceSuite?.contentHash || null,
        sourceSha256: eshkol?.artifact?.provenance?.sourceSha256 || null,
        wasmSha256: eshkol?.artifact?.provenance?.wasmSha256 || null,
        executionModuleSha256: eshkol?.artifact?.execution?.module?.sha256 || null,
        wasmByteLength: eshkol?.artifact?.execution?.module?.byteLength || null,
        sourceMetadataPath: eshkol?.artifact?.provenance?.sourceContracts?.[0]?.metadataPath || null,
        tensorRuntimeContractHash: tensorRuntimeContract?.contractHash || null,
        tensorRuntimeStatus: tensorRuntimeContract?.status || null,
        tensorRuntimeRuntimeStatus: tensorRuntimeContract?.runtimeStatus || null,
        tensorRuntimeExecutionClaim: tensorRuntimeContract?.executionClaim || null,
        tensorRuntimeScientificValidation: tensorRuntimeContract?.scientificValidation ?? null,
        tensorRuntimeFullPhysicsValidation: tensorRuntimeContract?.fullPhysicsValidation ?? null,
        linearMemoryStatus: linearMemoryBinding?.status || null,
        linearMemoryRuntimeStatus: linearMemoryBinding?.runtimeStatus || null,
        linearMemoryExecutionClaim: linearMemoryBinding?.executionClaim || null,
        linearMemoryEntryExportConsumesOffsets: linearMemoryBinding?.entryExportConsumesOffsets ?? null,
        linearMemoryTensorConsumedByEntryExport: Array.isArray(linearMemoryBinding?.tensors)
          ? linearMemoryBinding.tensors.map((tensor) => tensor.consumedByEntryExport === true)
          : [],
        smokeBindingStatus: smokeBinding?.status || null,
        smokeBindingEntryExportConsumesOffsets: smokeBinding?.entryExportConsumesOffsets ?? null,
        smokeBindingOutputInitialization: smokeBinding?.outputInitialization || null,
        offsetProbeStatus: offsetProbe?.status || null,
        offsetProbeBlocker: offsetProbe?.blocker || null,
        offsetProbeChangedBytesInDeclaredTensorRange: offsetProbe?.changedBytesInDeclaredTensorRange ?? null,
        offsetProbeEntryExportConsumesOffsets: offsetProbe?.entryExportConsumesOffsets ?? null,
        offsetProbeOutputTensorsProducedByEntryExport: offsetProbe?.outputTensorsProducedByEntryExport ?? null,
        offsetProbeObservedStdoutInvariantAcrossArgs: offsetProbe?.observedStdoutInvariantAcrossArgs ?? null,
        productionHandlerBoundaryStatus: productionHandlerBoundary?.status || null,
        productionHandlerBoundaryBlockers: Array.isArray(productionHandlerBoundary?.blockers)
          ? [...productionHandlerBoundary.blockers]
          : [],
        productionHandlerBoundaryAllowedExecutionClaims: Array.isArray(productionHandlerBoundary?.allowedExecutionClaims)
          ? [...productionHandlerBoundary.allowedExecutionClaims]
          : [],
        productionHandlerBoundaryTensorMemoryStatus: productionHandlerBoundary?.tensorMemoryBinding?.status || null,
        productionHandlerBoundaryTensorMemoryEntryExportConsumesOffsets:
          productionHandlerBoundary?.tensorMemoryBinding?.entryExportConsumesOffsets ?? null,
        productionHandlerBoundaryRuntimeExecution: productionHandlerBoundary?.runtimeExecution ?? null,
        productionHandlerBoundaryScientificValidation: productionHandlerBoundary?.scientificValidation ?? null,
        productionHandlerBoundaryFullPhysicsValidation: productionHandlerBoundary?.fullPhysicsValidation ?? null
      };
    });
    assertEshkolRuntimeSmokeProbe(handoffProbe);

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
