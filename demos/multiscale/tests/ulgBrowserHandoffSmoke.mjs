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
const EXPECTED_ESHKOL_TENSOR_CONTRACT_HASH = 'sha256:7bc3955f9514d894def892e547d26288b305aceb0ae48fb732e2268b0d305985';
const EXPECTED_ESHKOL_RUNTIME_CLAIM = 'deterministic-tensor-runtime-smoke-only';
const EXPECTED_ESHKOL_LINEAR_MEMORY_STATUS = 'entry-export-runtime-smoke-passed';
const EXPECTED_ESHKOL_OFFSET_PROBE_STATUS = 'runtime-smoke-passed';
const EXPECTED_ESHKOL_OFFSET_PROBE_BLOCKER = 'none-for-deterministic-runtime-smoke-production-physics-unvalidated';
const EXPECTED_ESHKOL_HOST_IMPORTS_MODULE_URL =
  new URL('/service-assets/eshkol/closures/magnetar-closure/eshkol-host-imports.js', ULG_URL).href;
const EXPECTED_ESHKOL_PRODUCTION_BLOCKERS = [
  'production-magnetar-handler-not-implemented',
  'full-physics-validation-not-run'
];
const EXPECTED_ESHKOL_PRODUCTION_DISPATCH_CHECKS = [
  'artifact-module-sha256-matches-module-ref',
  'entry-export-main-signature-i32-i32-to-i32',
  'non-stub-host-imports-present',
  'f64-tensor-memory-binding-validated',
  'production-candidate-runtime-probe-passed',
  'runtime-smoke-stubs-rejected-for-production',
  'handler-ready-flag-true',
  'runtime-execution-flag-true',
  'full-physics-validation-evidence-present'
];
const EXPECTED_ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS = [
  'artifact-module-sha256-matches-module-ref',
  'entry-export-main-signature-i32-i32-to-i32',
  'non-stub-host-imports-present',
  'f64-tensor-memory-binding-validated',
  'production-candidate-runtime-probe-passed',
  'runtime-smoke-stubs-rejected-for-production'
];
const EXPECTED_ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS = [
  'handler-ready-flag-true',
  'runtime-execution-flag-true',
  'full-physics-validation-evidence-present'
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
  assert.equal(handoffProbe.hostImportsModule, EXPECTED_ESHKOL_HOST_IMPORTS_MODULE_URL);
  assert.equal(handoffProbe.hostImportsAssetStatus, 'ready');
  assert.equal(handoffProbe.hostImportsFactoryStatus, 'ready');
  assert.equal(handoffProbe.hostImportsFactoryReady, true);
  assert.equal(handoffProbe.hostImportsRequirementsSchema, 'eshkol.ulg.production-host-import-candidate.v0');
  assert.equal(handoffProbe.hostImportsRequirementsStatus, 'production-candidate-runtime-imports-implemented');
  assert.equal(handoffProbe.hostImportsRuntimeScope, 'production-candidate-host-imports');
  assert.equal(handoffProbe.hostImportsImplementationStatus, 'production-candidate-runtime-imports-present');
  assert.equal(handoffProbe.hostImportsRequiredNonStubImportCount, 23);
  assert.equal(handoffProbe.productionCandidateRuntimeProbeStatus, 'production-candidate-runtime-smoke-passed');
  assert.equal(handoffProbe.productionCandidateRuntimeProbeReady, true);
  assert.equal(handoffProbe.productionCandidateRuntimeProbeRuntimeScope, 'production-candidate-host-imports');
  assert.equal(
    handoffProbe.productionCandidateRuntimeProbeExecutionClaim,
    'production-candidate-host-import-runtime-smoke-only'
  );
  assert.equal(handoffProbe.productionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange, 64);
  assert.deepEqual(handoffProbe.productionCandidateRuntimeProbeHostImportCallCounts, {
    ulg_read_f64: 12,
    ulg_write_f64: 9
  });
  assert.equal(handoffProbe.productionCandidateRuntimeProbeFullPhysicsValidation, false);
  assert.equal(
    handoffProbe.productionDispatchPreflightCheckSummarySchema,
    'eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0'
  );
  assert.equal(handoffProbe.productionDispatchPreflightTotalRequiredCheckCount, 9);
  assert.equal(handoffProbe.productionDispatchPreflightPassedCheckCount, 6);
  assert.equal(handoffProbe.productionDispatchPreflightBlockedCheckCount, 3);
  assert.deepEqual(handoffProbe.productionDispatchPreflightPassedChecks, [
    ...EXPECTED_ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS
  ]);
  assert.deepEqual(handoffProbe.productionDispatchPreflightBlockedChecks, [
    ...EXPECTED_ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS
  ]);
  assert.deepEqual(handoffProbe.productionDispatchPreflightCheckResultChecks, [
    ...EXPECTED_ESHKOL_PRODUCTION_DISPATCH_CHECKS
  ]);
  assert.equal(
    handoffProbe.summaryProductionDispatchPreflightCheckSummarySchema,
    'eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0'
  );
  assert.equal(handoffProbe.summaryProductionDispatchPreflightTotalRequiredCheckCount, 9);
  assert.equal(handoffProbe.summaryProductionDispatchPreflightPassedCheckCount, 6);
  assert.equal(handoffProbe.summaryProductionDispatchPreflightBlockedCheckCount, 3);
}

function assertMoonLabWebGpuProbe(handoffProbe) {
  assert.equal(handoffProbe.moonlabWebGpuParityScopeReady, true);
  assert.equal(handoffProbe.moonlabWebGpuParityScopeStatus, 'scope-ready-backend-detected');
  assert.equal(handoffProbe.moonlabWebGpuParityScopeBackendAvailable, true);
  assert.equal(handoffProbe.moonlabWebGpuParityScopeWebgpuParityExecuted, true);
  assert.equal(handoffProbe.moonlabWebGpuParityScopeWebgpuParityPassed, true);
  assert.equal(handoffProbe.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation, false);
  assert.equal(handoffProbe.moonlabWebGpuParityScopeFullPhysicsValidation, false);
  assert.equal(handoffProbe.moonlabWebGpuParityScopeBlockerCount, 0);
  assert.equal(handoffProbe.moonlabWebGpuBrowserBackendPreflightStage, 'device-acquired');
  assert.deepEqual(handoffProbe.moonlabWebGpuProbabilityKernelCoveredOperations, ['compute_probabilities']);
  assert.deepEqual(handoffProbe.moonlabWebGpuNativeOperationCoveredOperations, [
    'hadamard',
    'pauli_x',
    'pauli_z',
    'cnot'
  ]);
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
      const moonlab = handoff.artifacts.find((artifact) => artifact.ref.sourceService === 'moonlab');
      const eshkolSummary = eshkol?.artifactSummary || {};
      const moonlabSummary = moonlab?.artifactSummary || {};
      const descriptorBinding = eshkol?.artifact?.validation?.closureDescriptor?.descriptorBinding || null;
      const tensorRuntimeContract = descriptorBinding?.closureTensorRuntimeContract || null;
      const linearMemoryBinding = tensorRuntimeContract?.linearMemoryBinding || null;
      const smokeBinding = linearMemoryBinding?.smokeBinding || null;
      const offsetProbe = linearMemoryBinding?.entryExportOffsetProbe || null;
      const productionHandlerBoundary = descriptorBinding?.productionHandlerBoundary || null;
      const productionCandidateRuntimeProbe = productionHandlerBoundary?.productionCandidateRuntimeProbe || null;
      const productionDispatchPreflight = productionHandlerBoundary?.dispatchPreflight || null;
      const productionDispatchCheckSummary = productionDispatchPreflight?.checkSummary || null;
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
        productionHandlerBoundaryFullPhysicsValidation: productionHandlerBoundary?.fullPhysicsValidation ?? null,
        hostImportsModule: eshkolSummary.closureHostImportsModule || null,
        hostImportsAssetStatus: eshkolSummary.closureHostImportsAssetStatus || null,
        hostImportsFactoryStatus: eshkolSummary.closureHostImportsFactoryStatus || null,
        hostImportsFactoryReady: eshkolSummary.closureHostImportsFactoryReady ?? null,
        hostImportsRequirementsSchema: eshkolSummary.closureHostImportsRequirementsSchema || null,
        hostImportsRequirementsStatus: eshkolSummary.closureHostImportsRequirementsStatus || null,
        hostImportsRuntimeScope: eshkolSummary.closureHostImportsRuntimeScope || null,
        hostImportsImplementationStatus: eshkolSummary.closureHostImportsImplementationStatus || null,
        hostImportsRequiredNonStubImportCount: eshkolSummary.closureHostImportsRequiredNonStubImportCount ?? null,
        productionCandidateRuntimeProbeStatus: productionCandidateRuntimeProbe?.status || null,
        productionCandidateRuntimeProbeReady:
          eshkolSummary.closureProductionCandidateRuntimeProbeReady ?? null,
        productionCandidateRuntimeProbeRuntimeScope:
          productionCandidateRuntimeProbe?.runtimeScope
          || eshkolSummary.closureProductionCandidateRuntimeProbeRuntimeScope
          || null,
        productionCandidateRuntimeProbeExecutionClaim:
          productionCandidateRuntimeProbe?.executionClaim
          || eshkolSummary.closureProductionCandidateRuntimeProbeExecutionClaim
          || null,
        productionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange:
          productionCandidateRuntimeProbe?.changedBytesInDeclaredTensorRange
          ?? eshkolSummary.closureProductionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange
          ?? null,
        productionCandidateRuntimeProbeHostImportCallCounts:
          productionCandidateRuntimeProbe?.hostImportCallCounts
          || eshkolSummary.closureProductionCandidateRuntimeProbeHostImportCallCounts
          || null,
        productionCandidateRuntimeProbeFullPhysicsValidation:
          productionCandidateRuntimeProbe?.fullPhysicsValidation
          ?? eshkolSummary.closureProductionCandidateRuntimeProbeFullPhysicsValidation
          ?? null,
        productionDispatchPreflightCheckSummarySchema: productionDispatchCheckSummary?.schema || null,
        productionDispatchPreflightTotalRequiredCheckCount:
          productionDispatchCheckSummary?.totalRequiredCheckCount ?? null,
        productionDispatchPreflightPassedCheckCount: productionDispatchCheckSummary?.passedCount ?? null,
        productionDispatchPreflightBlockedCheckCount: productionDispatchCheckSummary?.blockedCount ?? null,
        productionDispatchPreflightPassedChecks: Array.isArray(productionDispatchCheckSummary?.passedChecks)
          ? [...productionDispatchCheckSummary.passedChecks]
          : [],
        productionDispatchPreflightBlockedChecks: Array.isArray(productionDispatchCheckSummary?.blockedChecks)
          ? [...productionDispatchCheckSummary.blockedChecks]
          : [],
        productionDispatchPreflightCheckResultChecks: Array.isArray(productionDispatchPreflight?.checkResults)
          ? productionDispatchPreflight.checkResults.map((entry) => entry.check)
          : [],
        summaryProductionDispatchPreflightCheckSummarySchema:
          eshkolSummary.closureProductionDispatchPreflightCheckSummarySchema || null,
        summaryProductionDispatchPreflightTotalRequiredCheckCount:
          eshkolSummary.closureProductionDispatchPreflightTotalRequiredCheckCount ?? null,
        summaryProductionDispatchPreflightPassedCheckCount:
          eshkolSummary.closureProductionDispatchPreflightPassedCheckCount ?? null,
        summaryProductionDispatchPreflightBlockedCheckCount:
          eshkolSummary.closureProductionDispatchPreflightBlockedCheckCount ?? null,
        moonlabWebGpuParityScopeReady: moonlabSummary.moonlabWebGpuParityScopeReady ?? null,
        moonlabWebGpuParityScopeStatus: moonlabSummary.moonlabWebGpuParityScopeStatus || null,
        moonlabWebGpuParityScopeBackendAvailable:
          moonlabSummary.moonlabWebGpuParityScopeBackendAvailable ?? null,
        moonlabWebGpuParityScopeWebgpuParityExecuted:
          moonlabSummary.moonlabWebGpuParityExecuted ?? null,
        moonlabWebGpuParityScopeWebgpuParityPassed:
          moonlabSummary.moonlabWebGpuParityPassed ?? null,
        moonlabWebGpuParityScopeFullFidelityMagnetarSimulation:
          moonlabSummary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation ?? null,
        moonlabWebGpuParityScopeFullPhysicsValidation:
          moonlabSummary.moonlabWebGpuParityScopeFullPhysicsValidation ?? null,
        moonlabWebGpuParityScopeBlockerCount:
          Array.isArray(moonlabSummary.moonlabWebGpuParityScopeBlockers)
            ? moonlabSummary.moonlabWebGpuParityScopeBlockers.length
            : null,
        moonlabWebGpuBrowserBackendPreflightStage:
          moonlabSummary.moonlabWebGpuBrowserBackendPreflightStage || null,
        moonlabWebGpuProbabilityKernelCoveredOperations:
          Array.isArray(moonlabSummary.moonlabWebGpuProbabilityKernelCoveredNativeOperations)
            ? [...moonlabSummary.moonlabWebGpuProbabilityKernelCoveredNativeOperations]
            : [],
        moonlabWebGpuNativeOperationCoveredOperations:
          Array.isArray(moonlabSummary.moonlabWebGpuNativeOperationCoveredOperations)
            ? [...moonlabSummary.moonlabWebGpuNativeOperationCoveredOperations]
            : []
      };
    });
    assertEshkolRuntimeSmokeProbe(handoffProbe);
    assertMoonLabWebGpuProbe(handoffProbe);

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
        moonlabWebGpuParityScopeReady: readiness.moonlabWebGpuParityScope?.ready ?? null,
        moonlabWebGpuParityScopeStatus: readiness.moonlabWebGpuParityScope?.status || null,
        moonlabWebGpuParityScopeBackendAvailable:
          readiness.moonlabWebGpuParityScope?.backendAvailable ?? null,
        moonlabWebGpuParityScopeWebgpuParityExecuted:
          readiness.moonlabWebGpuParityScope?.webgpuParityExecuted ?? null,
        moonlabWebGpuParityScopeFullFidelityMagnetarSimulation:
          readiness.moonlabWebGpuParityScope?.fullFidelityMagnetarSimulation ?? null,
        moonlabWebGpuParityScopeFullPhysicsValidation:
          readiness.moonlabWebGpuParityScope?.fullPhysicsValidation ?? null,
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
    assert.equal(multiscaleProbe.moonlabWebGpuParityScopeReady, true);
    assert.equal(multiscaleProbe.moonlabWebGpuParityScopeStatus, 'scope-ready-backend-detected');
    assert.equal(multiscaleProbe.moonlabWebGpuParityScopeBackendAvailable, true);
    assert.equal(multiscaleProbe.moonlabWebGpuParityScopeWebgpuParityExecuted, true);
    assert.equal(multiscaleProbe.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation, false);
    assert.equal(multiscaleProbe.moonlabWebGpuParityScopeFullPhysicsValidation, false);
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
