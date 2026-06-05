import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync, unlinkSync } from 'node:fs';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const multiscaleDocsRoot = path.join(docsRoot, 'multiscale');
const host = process.env.MULTISCALE_REMOTE_SMOKE_HOST || '127.0.0.1';
const port = Number(process.env.MULTISCALE_REMOTE_SMOKE_PORT || 4195);
const baseUrl = `http://${host}:${port}/multiscale/`;
const timeoutMs = Number(process.env.MULTISCALE_REMOTE_SMOKE_TIMEOUT_MS || 90000);
const remoteComputeTimeoutMs = Number(process.env.MULTISCALE_REMOTE_COMPUTE_TIMEOUT_MS || 45000);
const relayConfigTimeoutMs = Number(process.env.RELAY_CONFIG_TIMEOUT_MS || 60000);
const chromeBin = process.env.CHROME_BIN || '/bin/google-chrome';
const headless = process.env.HEADLESS !== '0';
const redundantPlacementSchema = 'peercompute.nodekernel.redundant-network-placement.v0';
const redundantExecutorPrefix = 'nodekernel-redundant-network-placement:';

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function resolveRequestPath(reqUrl) {
  const reqPath = decodeURIComponent((reqUrl || '/').split('?')[0]);
  const trimmed = reqPath.replace(/^\/+/, '');
  const rawPath = trimmed.endsWith('/') || trimmed === ''
    ? `${trimmed}index.html`
    : trimmed;
  const normalized = path.normalize(path.join(docsRoot, rawPath));
  if (!normalized.startsWith(docsRoot)) return null;
  return normalized;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const filePath = resolveRequestPath(req.url);
    if (!filePath) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      const ext = path.extname(filePath);
      const stat = statSync(filePath);
      res.writeHead(200, {
        'Content-Type': mime[ext] || 'application/octet-stream',
        'Content-Length': stat.size
      });
      createReadStream(filePath).pipe(res);
    } catch (_) {
      res.writeHead(404);
      res.end();
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

function waitForFiles(filePaths, waitMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (filePaths.every((filePath) => existsSync(filePath))) {
        resolve();
        return;
      }
      if (Date.now() - start > waitMs) {
        reject(new Error(`Timed out waiting for ${filePaths.join(', ')}`));
        return;
      }
      setTimeout(tick, 200);
    };
    tick();
  });
}

function startRelay() {
  const relayConfigFiles = [
    path.join(multiscaleDocsRoot, 'relay-config.json'),
    path.join(multiscaleDocsRoot, '.relay-config.json'),
    path.join(multiscaleDocsRoot, 'relay-config-source.json'),
    path.join(multiscaleDocsRoot, '.relay-config-source.json')
  ];
  relayConfigFiles.forEach((filePath) => {
    if (!existsSync(filePath)) return;
    try {
      unlinkSync(filePath);
    } catch (_) {
      // Best-effort cleanup; the relay will overwrite local config when possible.
    }
  });

  const child = spawn('bash', [path.join(repoRoot, 'scripts', 'run-relay.sh')], {
    env: {
      ...process.env,
      RELAY_IMPL: process.env.RELAY_IMPL || 'node',
      RELAY_LISTEN_HOST: host,
      RELAY_LISTEN_PORT: '0',
      RELAY_PUBLIC_HOST: host,
      RELAY_CONFIG_DIRS: multiscaleDocsRoot
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', (chunk) => process.stdout.write(chunk));
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  return {
    child,
    relayConfigPath: path.join(multiscaleDocsRoot, 'relay-config.json')
  };
}

function attachDiagnostics(page, label, errors) {
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      if (/Failed to acquire a WebGPU adapter|WebGPU is not supported|WebGPU device lost|Device was destroyed/i.test(text)) {
        return;
      }
      errors.push(`[${label} console] ${text}`);
    }
  });
  page.on('pageerror', (error) => {
    errors.push(`[${label} pageerror] ${error.message}`);
  });
}

function buildPageUrl(roomId) {
  const params = new URLSearchParams({
    relayConfigUrl: './relay-config.json',
    enablePeerNetwork: '1',
    enableRemoteComputeResponder: '1',
    autoWireRemotePlacement: '0',
    remoteComputeTimeoutMs: String(remoteComputeTimeoutMs),
    peerRoomId: roomId,
    peerTopologyId: `${roomId}-topology`,
    peerStateTopic: `pc.${roomId}.state`,
    autoScaleWorkloads: 'false',
    enableRemotePlacement: '0',
    enableRemoteSolverPlacement: '0'
  });
  return `${baseUrl}?${params.toString()}`;
}

async function waitForMultiscaleApi(page, label) {
  await page.waitForFunction(() => window.__multiscaleDemo?.getState, null, { timeout: timeoutMs });
  await page.waitForFunction(() => window.__multiscaleDemo?.startPeerNetwork, null, { timeout: timeoutMs });
  return page.evaluate(() => ({
    hasState: typeof window.__multiscaleDemo.getState === 'function',
    hasStartPeerNetwork: typeof window.__multiscaleDemo.startPeerNetwork === 'function',
    hasRunRemoteSolverPlacementProbe: typeof window.__multiscaleDemo.runRemoteSolverPlacementProbe === 'function'
  })).then((api) => {
    if (!api.hasRunRemoteSolverPlacementProbe) {
      throw new Error(`${label} missing runRemoteSolverPlacementProbe API`);
    }
    return api;
  });
}

async function startPeerNetwork(page) {
  return page.evaluate(() => window.__multiscaleDemo.startPeerNetwork({
    enablePeerNetwork: true,
    enableRemoteComputeResponder: true,
    autoWireRemotePlacement: false,
    remoteComputeTimeoutMs: 45000
  }));
}

async function waitForStartedPeer(page, label) {
  await page.waitForFunction(() => {
    const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
    return status?.isStarted === true && Boolean(status?.peerId) && status?.networkConnected === true;
  }, null, { timeout: timeoutMs });
  const status = await page.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
  if (!status.peerId) throw new Error(`${label} did not expose a peer id`);
  return status;
}

async function prepareRequester(page, remotePeerId, {
  replicaPeerIds = [],
  targetReplicaCount = 1,
  quorumResultCount = null,
  timeoutMs: requestedTimeoutMs = remoteComputeTimeoutMs,
  primaryTimeoutMs = null,
  replicaTimeoutMs = null,
  balanceRemotePlacementPeers = false,
  remotePlacementBalanceSeed = null,
  clearExistingPlacement = false
} = {}) {
  return page.evaluate(async ({
    peerId,
    replicaPeerIds: requestedReplicaPeerIds,
    targetReplicaCount: requestedTargetReplicaCount,
    quorumResultCount: requestedQuorumResultCount,
    primaryTimeoutMs: requestedPrimaryTimeoutMs,
    replicaTimeoutMs: requestedReplicaTimeoutMs,
    balanceRemotePlacementPeers: requestedBalanceRemotePlacementPeers,
    remotePlacementBalanceSeed: requestedRemotePlacementBalanceSeed,
    clearExistingPlacement: requestedClearExistingPlacement,
    timeout
  }) => {
    const api = window.__multiscaleDemo;
    const replicas = Array.isArray(requestedReplicaPeerIds)
      ? requestedReplicaPeerIds.filter(Boolean)
      : [];
    const targetCount = Math.max(1, Number(requestedTargetReplicaCount) || (1 + replicas.length));
    const quorumCount = Math.max(1, Number(requestedQuorumResultCount) || targetCount);
    const cleanPeerId = String(peerId || '').trim();
    if (requestedClearExistingPlacement) {
      api.configureRemotePlacement({
        clearOverrides: true,
        clearHooks: true
      });
    }
    const placementConfig = {
      enableRemotePlacement: true,
      remotePlacementReplicaPeerIds: replicas,
      remotePlacementTargetReplicaCount: targetCount,
      remotePlacementQuorumResultCount: quorumCount,
      autoSelectRemotePlacementPeer: true,
      balanceRemotePlacementPeers: requestedBalanceRemotePlacementPeers === true,
      remotePlacementMode: 'peer',
      remotePlacementTimeoutMs: timeout,
      metadataSigner: true,
      quorumValidator: {
        validationId: 'multiscale-live-remote-quorum',
        minReplicaCount: quorumCount,
        minMatchingReplicas: quorumCount,
        compareCommitDeltaHash: false
      },
      remoteResultVerification: true
    };
    if (requestedPrimaryTimeoutMs != null
      && requestedPrimaryTimeoutMs !== ''
      && Number.isFinite(Number(requestedPrimaryTimeoutMs))) {
      placementConfig.remotePlacementPrimaryTimeoutMs = Number(requestedPrimaryTimeoutMs);
    }
    if (requestedReplicaTimeoutMs != null
      && requestedReplicaTimeoutMs !== ''
      && Number.isFinite(Number(requestedReplicaTimeoutMs))) {
      placementConfig.remotePlacementReplicaTimeoutMs = Number(requestedReplicaTimeoutMs);
    }
    if (cleanPeerId) placementConfig.remotePlacementPeerId = cleanPeerId;
    if (Number.isFinite(Number(requestedRemotePlacementBalanceSeed))) {
      placementConfig.remotePlacementBalanceSeed = Number(requestedRemotePlacementBalanceSeed);
    }
    const initial = api.configureRemotePlacement({
      ...placementConfig
    });
    const status = await api.startPeerNetwork({
      enablePeerNetwork: true,
      enableRemoteComputeResponder: true,
      autoWireRemotePlacement: true,
      remoteComputeTimeoutMs: timeout
    });
    const state = api.getState();
    return {
      initial,
      status,
      remotePlacementReadiness: state.remotePlacementReadiness,
      remotePlacementConfiguration: state.remotePlacementConfiguration,
      remotePeerSelection: state.remotePeerSelection,
      remotePeerPlacementPlan: state.remotePeerPlacementPlan,
      selectedRemotePlacementPeerId: state.remotePlacementConfiguration?.peerId || state.remotePlacementReadiness?.peerId || null,
      nodeKernel: state.nodeKernel
    };
  }, {
    peerId: remotePeerId,
    replicaPeerIds,
    targetReplicaCount,
    quorumResultCount,
    primaryTimeoutMs,
    replicaTimeoutMs,
    balanceRemotePlacementPeers,
    remotePlacementBalanceSeed,
    clearExistingPlacement,
    timeout: requestedTimeoutMs
  });
}

async function runRemoteProbe(page, remotePeerId, {
  stateKey = 'live:remote-placement:cosmology',
  timeoutMs: requestedTimeoutMs = remoteComputeTimeoutMs,
  attachNodeKernelExecutor = true
} = {}) {
  return page.evaluate(async ({
    peerId,
    timeout,
    stateKey: requestedStateKey,
    attachNodeKernelExecutor: requestedAttachNodeKernelExecutor
  }) => {
    let result = null;
    try {
      result = await window.__multiscaleDemo.runRemoteSolverPlacementProbe({
        peerId,
        remotePlacementMode: 'peer',
        remotePlacementTimeoutMs: timeout,
        configureRemotePlacement: false,
        attachNodeKernelExecutor: requestedAttachNodeKernelExecutor,
        sampleCount: 8,
        stateKey: requestedStateKey
      });
    } catch (error) {
      result = {
        ok: false,
        schema: 'peercompute.multiscale.remote-solver-placement-probe-error.v0',
        errorName: error?.name || null,
        errorCode: error?.code || null,
        reason: error?.reason || null,
        message: error?.message || String(error || ''),
        validation: error?.validation || null,
        provenance: error?.provenance || null,
        retry: error?.retry || null
      };
    }
    const state = window.__multiscaleDemo.getState();
    return {
      result,
      remotePlacementReadiness: state.remotePlacementReadiness,
      remotePlacementConfiguration: state.remotePlacementConfiguration,
      remotePeerSelection: state.remotePeerSelection,
      remotePeerPlacementPlan: state.remotePeerPlacementPlan,
      remotePeerReliability: state.remotePeerReliability,
      remoteSolverPlacementPolicy: state.remoteSolverPlacementPolicy,
      remoteSolverPlacementDecisions: state.remoteSolverPlacementDecisions,
      taskPlacement: state.taskPlacement,
      nodeKernel: state.nodeKernel,
      managerStats: state.compute?.peercompute?.managerCapabilities?.stats,
      readoutText: document.querySelector('#layer-readout')?.textContent || '',
      runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent || ''
    };
  }, {
    peerId: remotePeerId,
    timeout: requestedTimeoutMs,
    stateKey,
    attachNodeKernelExecutor
  });
}

async function readResponderCompletedTasks(page) {
  return page.evaluate(() => (
    window.__multiscaleDemo.getPeerNetworkStatus?.()?.computeStats?.totalTasksCompleted || 0
  ));
}

async function waitForResponderTasks(page, baseline) {
  await page.waitForFunction((before) => (
    (window.__multiscaleDemo.getPeerNetworkStatus?.()?.computeStats?.totalTasksCompleted || 0) > before
  ), baseline, { timeout: remoteComputeTimeoutMs });
}

async function collectRemoteRuntimeDiagnostics(requester, responder, replica = null) {
  const requesterState = await requester.evaluate(() => {
    const state = window.__multiscaleDemo.getState();
    return {
      remotePlacementReadiness: state.remotePlacementReadiness,
      remotePlacementConfiguration: state.remotePlacementConfiguration,
      remotePeerSelection: state.remotePeerSelection,
      remotePeerReliability: state.remotePeerReliability,
      remoteSolverPlacementPolicy: state.remoteSolverPlacementPolicy,
      remoteSolverPlacementDecisions: state.remoteSolverPlacementDecisions,
      taskPlacement: state.taskPlacement,
      solverRuntime: state.solverRuntime,
      computeStats: state.compute?.peercompute?.managerCapabilities?.stats,
      nodeKernel: state.nodeKernel,
      peerNetwork: window.__multiscaleDemo.getPeerNetworkStatus?.() || null,
      nodeKernelStatus: window.__multiscaleDemo.getNodeKernelStatus?.() || null,
      runtimeDebug: window.__multiscaleDemo.getRuntimeDebug?.() || null
    };
  });
  const responderStatus = await responder.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus?.() || null);
  const replicaStatus = replica
    ? await replica.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus?.() || null)
    : null;
  return {
    requesterState,
    responderStatus,
    replicaStatus
  };
}

async function runRuntimeRemotePolicyStep(requester, responder, remotePeerId, replica = null, replicaPeerId = null) {
  const before = await requester.evaluate(() => {
    const state = window.__multiscaleDemo.getState();
    const taskPlacement = state.taskPlacement || {};
    const stats = state.compute?.peercompute?.managerCapabilities?.stats || {};
    const remoteBucket = taskPlacement.byActualPlacement?.['remote-peer'] || {};
    return {
      remotePeerCompleted: remoteBucket.completed || 0,
      remoteTasksCompleted: stats.remoteTasksCompleted || 0,
      cosmologyCompleted: state.solverRuntime?.cosmologyExpansion?.completedTasks || 0
    };
  });
  const responderBefore = await readResponderCompletedTasks(responder);
  const replicaBefore = replica ? await readResponderCompletedTasks(replica) : null;
  const policy = await requester.evaluate(() => window.__multiscaleDemo.configureRemoteSolverPlacement({
    enabled: true,
    families: ['cosmologyExpansion'],
    mode: 'peer',
    nonAdvisory: true,
    minimumConfidence: 0.4,
    allowLocalPlanPromotion: true,
    allowedRemoteClasses: ['coarse'],
    source: 'live-runtime-remote-policy-smoke'
  }));
  try {
    await requester.waitForFunction(({
      before: baseline,
      peerId,
      replicaPeerId: expectedReplicaPeerId,
      schema,
      timeout
    }) => {
      const state = window.__multiscaleDemo.getState();
      const taskPlacement = state.taskPlacement || {};
      const stats = state.compute?.peercompute?.managerCapabilities?.stats || {};
      const remoteBucket = taskPlacement.byActualPlacement?.['remote-peer'] || {};
      const lastRemote = taskPlacement.lastRemotePlacement || null;
      const cosmology = state.solverRuntime?.cosmologyExpansion || {};
      const provenance = lastRemote?.provenance || {};
      const redundant = provenance.redundantPlacement || {};
      const replicas = Array.isArray(provenance.replicas) ? provenance.replicas : [];
      const sawExpectedReplica = !expectedReplicaPeerId || replicas.some((entry) => entry?.ok !== false
        && [
          entry.targetPeerId,
          entry.transportPeerId,
          entry.remotePeerId,
          entry.peerId
        ].includes(expectedReplicaPeerId));
      return (remoteBucket.completed || 0) > baseline.remotePeerCompleted
        && (stats.remoteTasksCompleted || 0) > baseline.remoteTasksCompleted
        && (cosmology.completedTasks || 0) > baseline.cosmologyCompleted
        && lastRemote?.actualPlacement === 'remote-peer'
        && lastRemote?.taskFamily === 'cosmology-expansion'
        && lastRemote?.peerId === peerId
        && lastRemote?.provenance?.verified === true
        && lastRemote?.provenance?.validation?.valid === true
        && lastRemote?.provenance?.durationMs >= 0
        && lastRemote?.provenance?.durationMs < timeout
        && (!expectedReplicaPeerId
          || (
            redundant.schema === schema
            && redundant.primaryPeerId === peerId
            && Array.isArray(redundant.replicaPeerIds)
            && redundant.replicaPeerIds.includes(expectedReplicaPeerId)
            && provenance.replicaSuccessCount >= 1
            && sawExpectedReplica
          ));
    }, {
      before,
      peerId: remotePeerId,
      replicaPeerId,
      schema: redundantPlacementSchema,
      timeout: remoteComputeTimeoutMs
    }, { timeout: remoteComputeTimeoutMs });
  } catch (error) {
    const diagnostics = await collectRemoteRuntimeDiagnostics(requester, responder, replica);
    throw new Error(`Runtime remote policy wait failed: ${error.message}\n${JSON.stringify({
      before,
      responderBefore,
      replicaBefore,
      policy,
      primaryPeerId: remotePeerId,
      replicaPeerId,
      diagnostics
    }, null, 2)}`);
  }
  await waitForResponderTasks(responder, responderBefore);
  if (replica) {
    await waitForResponderTasks(replica, replicaBefore);
  }
  const after = await requester.evaluate(() => {
    const state = window.__multiscaleDemo.getState();
    return {
      remotePlacementReadiness: state.remotePlacementReadiness,
      remotePeerSelection: state.remotePeerSelection,
      remotePeerReliability: state.remotePeerReliability,
      remoteSolverPlacementPolicy: state.remoteSolverPlacementPolicy,
      remoteSolverPlacementDecisions: state.remoteSolverPlacementDecisions,
      taskPlacement: state.taskPlacement,
      solverRuntime: state.solverRuntime,
      readoutText: document.querySelector('#layer-readout')?.textContent || '',
      runtimeDebugText: document.querySelector('#runtime-debug-readout')?.textContent || ''
    };
  });
  const responderAfter = await responder.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
  const replicaAfter = replica
    ? await replica.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus())
    : null;
  return {
    before,
    responderBefore,
    replicaBefore,
    policy,
    after,
    responderAfter,
    replicaAfter,
    primaryPeerId: remotePeerId,
    replicaPeerId
  };
}

function findReplicaReport(provenance, replicaPeerId) {
  const replicas = Array.isArray(provenance?.replicas) ? provenance.replicas : [];
  return replicas.find((entry) => [
    entry?.targetPeerId,
    entry?.transportPeerId,
    entry?.remotePeerId,
    entry?.peerId
  ].includes(replicaPeerId)) || null;
}

function assertRedundantPlacementProvenance(provenance, {
  primaryPeerId,
  replicaPeerId,
  label
} = {}) {
  const redundant = provenance?.redundantPlacement || null;
  const replica = findReplicaReport(provenance, replicaPeerId);
  const validation = provenance?.validation || null;
  const compareCommitDeltaHash = validation?.compareCommitDeltaHash !== false;
  if (redundant?.schema !== redundantPlacementSchema
    || redundant?.primaryPeerId !== primaryPeerId
    || !Array.isArray(redundant?.replicaPeerIds)
    || !redundant.replicaPeerIds.includes(replicaPeerId)
    || !(redundant?.replicaCount >= 1)
    || !(redundant?.replicaSuccessCount >= 1)
    || !(provenance?.replicaCount >= 1)
    || !(provenance?.replicaSuccessCount >= 1)
    || !replica
    || replica?.ok !== true
    || !String(replica?.workerId || '').startsWith('worker-')
    || replica?.remoteExecution?.executionMode !== 'worker'
    || (provenance?.outputHash && replica?.outputHash && replica.outputHash !== provenance.outputHash)
    || (compareCommitDeltaHash
      && provenance?.commitDeltaHash
      && replica?.commitDeltaHash
      && replica.commitDeltaHash !== provenance.commitDeltaHash)
    || validation?.valid !== true
    || !(validation?.totalResultCount >= 2)
    || !(validation?.remoteReplicaCount >= 1)
    || !(validation?.matchingResultCount >= 2)
    || !(validation?.matchingReplicaCount >= 1)) {
    throw new Error(`${label || 'redundant placement'} did not include a matching primary+replica quorum: ${JSON.stringify(provenance)}`);
  }
}

function assertPromotedFailoverProvenance(provenance, {
  primaryPeerId,
  promotedReplicaPeerId,
  quorumReplicaPeerId,
  label
} = {}) {
  const redundant = provenance?.redundantPlacement || null;
  const promoted = provenance?.promotedReplica || redundant?.promotedReplicaSummary || null;
  const quorumReplica = findReplicaReport(provenance, quorumReplicaPeerId);
  const validation = provenance?.validation || null;
  const primaryFailure = provenance?.primaryFailure || redundant?.primaryFailure || null;
  const promotedPeerMatches = [
    provenance?.targetPeerId,
    provenance?.transportPeerId,
    provenance?.remotePeerId,
    provenance?.peerId,
    promoted?.targetPeerId,
    promoted?.transportPeerId,
    promoted?.remotePeerId,
    promoted?.peerId
  ].includes(promotedReplicaPeerId);
  const quorumSelfMatch = findReplicaReport(provenance, promotedReplicaPeerId);
  if (redundant?.schema !== redundantPlacementSchema
    || redundant?.primaryPeerId !== primaryPeerId
    || redundant?.primaryOk !== false
    || redundant?.promotedReplica !== true
    || redundant?.commitSourceRole !== 'promoted-replica'
    || !Array.isArray(redundant?.replicaPeerIds)
    || !redundant.replicaPeerIds.includes(promotedReplicaPeerId)
    || !redundant.replicaPeerIds.includes(quorumReplicaPeerId)
    || !primaryFailure?.code
    || provenance?.role !== 'promoted-replica'
    || !String(provenance?.promotedReplicaExecutorId || '').includes(`:replica:0:${promotedReplicaPeerId}`)
    || !promoted
    || promoted?.usedAsCommitSource !== true
    || !promotedPeerMatches
    || quorumSelfMatch
    || !quorumReplica
    || quorumReplica?.ok !== true
    || !String(quorumReplica?.workerId || '').startsWith('worker-')
    || quorumReplica?.remoteExecution?.executionMode !== 'worker'
    || !(provenance?.redundantReplicaCount >= 2)
    || provenance?.replicaCount !== 1
    || provenance?.quorumReplicaCount !== 1
    || !(provenance?.replicaSuccessCount >= 2)
    || !(redundant?.quorumReplicaSuccessCount >= 1)
    || validation?.valid !== true
    || validation?.reason !== 'quorum-accepted'
    || validation?.totalResultCount !== 2
    || validation?.remoteReplicaCount !== 1
    || validation?.matchingResultCount !== 2
    || validation?.matchingReplicaCount !== 1
    || (provenance?.outputHash && quorumReplica?.outputHash && quorumReplica.outputHash !== provenance.outputHash)
    || (provenance?.taskHash && quorumReplica?.taskHash && quorumReplica.taskHash !== provenance.taskHash)
    || !String(provenance?.workerId || '').startsWith('worker-')
    || provenance?.remoteExecution?.executionMode !== 'worker') {
    throw new Error(`${label || 'redundant failover'} did not promote a replica with independent quorum: ${JSON.stringify(provenance)}`);
  }
}

function assertRuntimeRemotePolicyStep(summary) {
  const taskPlacement = summary?.after?.taskPlacement || {};
  const lastRemote = taskPlacement.lastRemotePlacement || null;
  const remoteCompleted = taskPlacement.byActualPlacement?.['remote-peer']?.completed || 0;
  const reliabilityEntry = summary?.after?.remotePeerReliability?.peers?.[lastRemote?.peerId];
  const reliabilityPersistence = summary?.after?.remotePeerReliability?.persistence || null;
  const selectedReliability = summary?.after?.remotePeerSelection?.candidates?.find?.(
    (candidate) => candidate.peerId === lastRemote?.peerId
  )?.capacity?.reliability;
  if (summary?.policy?.policy?.active !== true
    || summary?.after?.remotePlacementReadiness?.dispatchReady !== true
    || summary?.after?.remoteSolverPlacementDecisions?.entries?.cosmologyExpansion?.promoted !== true
    || remoteCompleted <= (summary?.before?.remotePeerCompleted || 0)
    || (summary?.after?.solverRuntime?.cosmologyExpansion?.completedTasks || 0) <= (summary?.before?.cosmologyCompleted || 0)
    || (summary?.responderAfter?.computeStats?.totalTasksCompleted || 0) <= (summary?.responderBefore || 0)
    || !(summary?.responderAfter?.computeStats?.workerCount > 0)
    || !(summary?.responderAfter?.computeStats?.workerTasksCompleted > 0)
    || lastRemote?.actualPlacement !== 'remote-peer'
    || lastRemote?.taskFamily !== 'cosmology-expansion'
    || !(lastRemote?.admission?.remoteWorkerCapacity > 0)
    || lastRemote?.provenance?.verified !== true
    || lastRemote?.provenance?.validation?.valid !== true
    || !String(lastRemote?.provenance?.workerId || '').startsWith('worker-')
    || lastRemote?.provenance?.remoteExecution?.executionMode !== 'worker'
    || !(lastRemote?.provenance?.durationMs >= 0)
    || !(lastRemote?.provenance?.durationMs < remoteComputeTimeoutMs)
    || summary?.after?.remotePeerSelection?.selectedPeerId !== lastRemote?.peerId
    || !(summary?.after?.remotePeerSelection?.candidateCount >= 1)
    || summary?.after?.remotePeerReliability?.schema !== 'peercompute.multiscale.remote-peer-reliability.v0'
    || reliabilityPersistence?.schema !== 'peercompute.multiscale.remote-peer-reliability-store.v0'
    || reliabilityPersistence?.status !== 'saved'
    || !String(summary?.after?.remotePeerReliability?.scopeId || '').includes('room:multiscale-live-remote-')
    || !String(summary?.after?.remotePeerReliability?.storageKey || '').includes('peercompute.multiscale.remotePeerReliability')
    || !(reliabilityEntry?.successes >= 1)
    || !(reliabilityEntry?.reliabilityScore > 0)
    || !(selectedReliability > 0)
    || !summary?.after?.readoutText?.includes('remote decisions')
    || !summary?.after?.readoutText?.includes('remote peer')
    || !summary?.after?.readoutText?.includes('remote reliability')
    || !summary?.after?.runtimeDebugText?.includes('remote decisions')
    || !summary?.after?.runtimeDebugText?.includes('remote peer')
    || !summary?.after?.runtimeDebugText?.includes('remote reliability')) {
    throw new Error(`Runtime remote solver policy did not drive normal solver cadence remotely: ${JSON.stringify(summary)}`);
  }
  if (summary?.replicaPeerId) {
    assertRedundantPlacementProvenance(lastRemote?.provenance, {
      primaryPeerId: summary.primaryPeerId,
      replicaPeerId: summary.replicaPeerId,
      label: 'runtime remote solver policy'
    });
    if ((summary?.replicaAfter?.computeStats?.totalTasksCompleted || 0) <= (summary?.replicaBefore || 0)
      || !(summary?.replicaAfter?.computeStats?.workerCount > 0)
      || !(summary?.replicaAfter?.computeStats?.workerTasksCompleted > 0)) {
      throw new Error(`Runtime remote solver policy did not execute on the replica responder: ${JSON.stringify(summary)}`);
    }
  }
}

function assertLiveRemoteProbe(summary) {
  const result = summary?.result;
  const reliabilityEntry = summary?.remotePeerReliability?.peers?.[result?.taskPlacement?.peerId];
  const reliabilityPersistence = summary?.remotePeerReliability?.persistence || null;
  const selectedReliability = summary?.remotePeerSelection?.candidates?.find?.(
    (candidate) => candidate.peerId === result?.taskPlacement?.peerId
  )?.capacity?.reliability;
  if (result?.ok !== true
    || result?.schema !== 'peercompute.multiscale.remote-solver-placement-probe.v0'
    || result?.result?.schema !== 'peercompute.multiscale.cosmology-expansion.result.v0'
    || result?.deltasCommitted < 1
    || result?.placementHint?.remoteSolverPlacement?.promoted !== true
    || result?.placementHint?.executionMode !== 'non-advisory-remote'
    || result?.taskPlacement?.actualPlacement !== 'remote-peer'
    || !(result?.taskPlacement?.admission?.remoteWorkerCapacity > 0)
    || result?.taskPlacement?.provenance?.verified !== true
    || result?.taskPlacement?.provenance?.validation?.valid !== true
    || !String(result?.taskPlacement?.provenance?.workerId || '').startsWith('worker-')
    || result?.taskPlacement?.provenance?.remoteExecution?.executionMode !== 'worker'
    || !(result?.taskPlacement?.provenance?.durationMs >= 0)
    || !(result?.taskPlacement?.provenance?.durationMs < remoteComputeTimeoutMs)
    || result?.remoteTasksCompleted < 1
    || summary?.remotePlacementReadiness?.dispatchReady !== true
    || summary?.remotePlacementReadiness?.loopbackEnabled === true
    || summary?.remotePlacementConfiguration?.executorId?.startsWith?.(redundantExecutorPrefix) !== true
    || summary?.remotePlacementConfiguration?.redundantPlacementEnabled !== true
    || summary?.remotePlacementConfiguration?.redundantPlacementSchema !== redundantPlacementSchema
    || !(summary?.remotePlacementConfiguration?.targetReplicaCount >= 2)
    || summary?.remotePeerSelection?.selectedPeerId !== result?.taskPlacement?.peerId
    || !(summary?.remotePeerSelection?.selectedScore > 0)
    || summary?.remotePeerReliability?.schema !== 'peercompute.multiscale.remote-peer-reliability.v0'
    || reliabilityPersistence?.schema !== 'peercompute.multiscale.remote-peer-reliability-store.v0'
    || reliabilityPersistence?.status !== 'saved'
    || !String(summary?.remotePeerReliability?.scopeId || '').includes('room:multiscale-live-remote-')
    || !String(summary?.remotePeerReliability?.storageKey || '').includes('peercompute.multiscale.remotePeerReliability')
    || !(reliabilityEntry?.attempts >= 2)
    || !(reliabilityEntry?.successes >= 2)
    || !(reliabilityEntry?.reliabilityScore > 0)
    || !(selectedReliability > 0)
    || summary?.remoteSolverPlacementPolicy?.active !== true
    || summary?.remoteSolverPlacementDecisions?.entries?.cosmologyExpansion?.promoted !== true
    || summary?.responderAfter?.remoteCompute?.responderEnabled !== true
    || !(summary?.responderAfter?.computeStats?.totalTasksCompleted > 0)
    || !(summary?.responderAfter?.computeStats?.workerCount > 0)
    || !(summary?.responderAfter?.computeStats?.workerTasksCompleted > 0)
    || !(summary?.responderAfter?.computeStats?.byTaskFamily?.['cosmology-expansion']?.completed > 0)
    || !summary?.readoutText?.includes('remote solver')
    || !summary?.readoutText?.includes('remote peer')
    || !summary?.readoutText?.includes('remote reliability')
    || !summary?.runtimeDebugText?.includes('remote solver')
    || !summary?.runtimeDebugText?.includes('remote reliability')) {
    throw new Error(`Live remote placement probe failed: ${JSON.stringify(summary)}`);
  }
  assertRedundantPlacementProvenance(result?.taskPlacement?.provenance, {
    primaryPeerId: summary.primaryPeerId,
    replicaPeerId: summary.replicaPeerId,
    label: 'live remote placement probe'
  });
  if ((summary?.replicaAfter?.computeStats?.totalTasksCompleted || 0) <= 0
    || !(summary?.replicaAfter?.computeStats?.workerCount > 0)
    || !(summary?.replicaAfter?.computeStats?.workerTasksCompleted > 0)
    || !(summary?.replicaAfter?.computeStats?.byTaskFamily?.['cosmology-expansion']?.completed > 0)) {
    throw new Error(`Live remote placement probe did not execute on the replica responder: ${JSON.stringify(summary)}`);
  }
}

function assertBalancedRemoteProbe(summary) {
  const firstPlan = summary?.firstPrepare?.remotePeerPlacementPlan || null;
  const prepare = summary?.prepare || {};
  const plan = prepare.remotePeerPlacementPlan || null;
  const config = prepare.remotePlacementConfiguration || {};
  const selection = prepare.remotePeerSelection || {};
  const result = summary?.probe?.result || null;
  const placement = result?.taskPlacement || null;
  const provenance = placement?.provenance || null;
  const primaryPageAfter = summary?.primaryAfter || null;
  const selectedPageAfter = summary?.selectedAfter || null;
  const quorumPageAfter = summary?.quorumAfter || null;
  const runtimeDebugText = summary?.probe?.runtimeDebugText || '';
  const readoutText = summary?.probe?.readoutText || '';
  if (firstPlan?.balanceRemotePlacementPeers !== true
    || firstPlan?.primaryPeerId !== summary.selectedPeerId
    || plan?.schema !== 'peercompute.multiscale.remote-peer-placement-plan.v0'
    || plan?.balanceRemotePlacementPeers !== true
    || plan?.primaryPeerId !== summary.expectedBalancedPeerId
    || plan?.primaryPeerId === summary.selectedPeerId
    || plan?.reason !== 'balanced-remote-primary'
    || !Array.isArray(plan?.replicaPeerIds)
    || !plan.replicaPeerIds.includes(summary.selectedPeerId)
    || config?.peerId !== summary.expectedBalancedPeerId
    || config?.balanceRemotePlacementPeers !== true
    || config?.redundantPlacementEnabled !== true
    || config?.redundantPlacementSchema !== redundantPlacementSchema
    || config?.executorId?.startsWith?.(`${redundantExecutorPrefix}${summary.expectedBalancedPeerId}:`) !== true
    || !(selection?.candidateCount >= 3)
    || !selection?.candidates?.some?.((candidate) => candidate?.peerId === summary.selectedPeerId)
    || result?.ok !== true
    || placement?.actualPlacement !== 'remote-peer'
    || placement?.peerId !== summary.expectedBalancedPeerId
    || !(placement?.admission?.remoteWorkerCapacity > 0)
    || placement?.provenance?.verified !== true
    || placement?.provenance?.validation?.valid !== true
    || !String(placement?.provenance?.workerId || '').startsWith('worker-')
    || placement?.provenance?.remoteExecution?.executionMode !== 'worker'
    || primaryPageAfter?.computeStats?.totalTasksCompleted <= summary.primaryBefore
    || selectedPageAfter?.computeStats?.totalTasksCompleted <= summary.selectedBefore
    || !quorumPageAfter?.computeStats
    || !readoutText.includes('remote peer plan')
    || !runtimeDebugText.includes('remote peer plan')) {
    throw new Error(`Balanced remote placement probe failed: ${JSON.stringify(summary)}`);
  }
  assertRedundantPlacementProvenance(provenance, {
    primaryPeerId: summary.expectedBalancedPeerId,
    replicaPeerId: summary.selectedPeerId,
    label: 'balanced remote placement probe'
  });
}

function assertLiveFailoverProbe(summary) {
  const result = summary?.result;
  const placement = result?.taskPlacement || null;
  const provenance = placement?.provenance || null;
  if (result?.ok !== true
    || result?.schema !== 'peercompute.multiscale.remote-solver-placement-probe.v0'
    || result?.result?.schema !== 'peercompute.multiscale.cosmology-expansion.result.v0'
    || (result?.deltasCommitted != null && result.deltasCommitted < 1)
    || placement?.actualPlacement !== 'remote-peer'
    || placement?.provenance?.verified !== true
    || placement?.provenance?.validation?.valid !== true
    || !(placement?.admission?.remoteWorkerCapacity > 0)
    || summary?.remotePlacementReadiness?.dispatchReady !== true
    || summary?.remotePlacementConfiguration?.executorId?.startsWith?.(redundantExecutorPrefix) !== true
    || summary?.remotePlacementConfiguration?.redundantPlacementEnabled !== true
    || summary?.remotePlacementConfiguration?.redundantPlacementSchema !== redundantPlacementSchema
    || summary?.remotePlacementConfiguration?.targetReplicaCount !== 3
    || summary?.remotePlacementConfiguration?.quorumResultCount !== 2
    || !summary?.remotePlacementConfiguration?.replicaPeerIds?.includes?.(summary.promotedReplicaPeerId)
    || !summary?.remotePlacementConfiguration?.replicaPeerIds?.includes?.(summary.quorumReplicaPeerId)
    || summary?.remoteSolverPlacementDecisions?.entries?.cosmologyExpansion?.promoted !== true
    || !(summary?.promotedReplicaAfter?.computeStats?.totalTasksCompleted > summary?.promotedReplicaBefore)
    || !(summary?.quorumReplicaAfter?.computeStats?.totalTasksCompleted > summary?.quorumReplicaBefore)
    || !(summary?.promotedReplicaAfter?.computeStats?.workerTasksCompleted > 0)
    || !(summary?.quorumReplicaAfter?.computeStats?.workerTasksCompleted > 0)
    || !summary?.readoutText?.includes('remote solver')
    || !summary?.runtimeDebugText?.includes('remote solver')) {
    throw new Error(`Live redundant failover probe failed: ${JSON.stringify(summary)}`);
  }
  assertPromotedFailoverProvenance(provenance, {
    primaryPeerId: summary.primaryPeerId,
    promotedReplicaPeerId: summary.promotedReplicaPeerId,
    quorumReplicaPeerId: summary.quorumReplicaPeerId,
    label: 'live redundant failover probe'
  });
}

async function main() {
  if (!existsSync(path.join(multiscaleDocsRoot, 'index.html'))) {
    throw new Error('docs/multiscale build missing. Run `npm run build:multiscale` first.');
  }

  const server = await startServer();
  const relay = startRelay();
  let browser = null;
  try {
    await waitForFiles([relay.relayConfigPath], relayConfigTimeoutMs);
    browser = await chromium.launch({
      executablePath: chromeBin,
      headless,
      args: [
        '--ignore-certificate-errors',
        '--enable-unsafe-webgpu',
        '--enable-unsafe-swiftshader'
      ]
    });
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 860 }
    });
    const errors = [];
    const requester = await context.newPage();
    const responder = await context.newPage();
    const replica = await context.newPage();
    const failoverReplica = await context.newPage();
    attachDiagnostics(requester, 'requester', errors);
    attachDiagnostics(responder, 'responder', errors);
    attachDiagnostics(replica, 'replica', errors);
    attachDiagnostics(failoverReplica, 'failover-replica', errors);

    const roomId = `multiscale-live-remote-${Date.now().toString(36)}`;
    const url = buildPageUrl(roomId);
    console.log(`[multiscale-live-remote] requester/responder/replica/failover-replica: ${url}`);
    await Promise.all([
      requester.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs }),
      responder.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs }),
      replica.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs }),
      failoverReplica.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs })
    ]);
    await Promise.all([
      waitForMultiscaleApi(requester, 'requester'),
      waitForMultiscaleApi(responder, 'responder'),
      waitForMultiscaleApi(replica, 'replica'),
      waitForMultiscaleApi(failoverReplica, 'failover-replica')
    ]);
    await Promise.all([
      startPeerNetwork(requester),
      startPeerNetwork(responder),
      startPeerNetwork(replica),
      startPeerNetwork(failoverReplica)
    ]);
    const [requesterStatus, responderStatus, replicaStatus, failoverReplicaStatus] = await Promise.all([
      waitForStartedPeer(requester, 'requester'),
      waitForStartedPeer(responder, 'responder'),
      waitForStartedPeer(replica, 'replica'),
      waitForStartedPeer(failoverReplica, 'failover-replica')
    ]);
    const responderPagesByPeerId = new Map([
      [responderStatus.peerId, responder],
      [replicaStatus.peerId, replica],
      [failoverReplicaStatus.peerId, failoverReplica]
    ]);
    await Promise.all([
      requester.waitForFunction(() => window.__multiscaleDemo.getPeerNetworkStatus()?.peerCount >= 3, null, { timeout: timeoutMs }),
      responder.waitForFunction(() => window.__multiscaleDemo.getPeerNetworkStatus()?.peerCount >= 1, null, { timeout: timeoutMs }),
      replica.waitForFunction(() => window.__multiscaleDemo.getPeerNetworkStatus()?.peerCount >= 1, null, { timeout: timeoutMs }),
      failoverReplica.waitForFunction(() => window.__multiscaleDemo.getPeerNetworkStatus()?.peerCount >= 1, null, { timeout: timeoutMs })
    ]);
    await Promise.all([
      requester.waitForFunction(({ primaryPeerId, replicaPeerId, failoverReplicaPeerId }) => {
        const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
        return Array.isArray(status?.connectedPeerIds)
          && status.connectedPeerIds.includes(primaryPeerId)
          && status.connectedPeerIds.includes(replicaPeerId)
          && status.connectedPeerIds.includes(failoverReplicaPeerId);
      }, {
        primaryPeerId: responderStatus.peerId,
        replicaPeerId: replicaStatus.peerId,
        failoverReplicaPeerId: failoverReplicaStatus.peerId
      }, { timeout: timeoutMs }),
      responder.waitForFunction((peerId) => {
        const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
        return Array.isArray(status?.connectedPeerIds) && status.connectedPeerIds.includes(peerId);
      }, requesterStatus.peerId, { timeout: timeoutMs }),
      replica.waitForFunction((peerId) => {
        const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
        return Array.isArray(status?.connectedPeerIds) && status.connectedPeerIds.includes(peerId);
      }, requesterStatus.peerId, { timeout: timeoutMs }),
      failoverReplica.waitForFunction((peerId) => {
        const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
        return Array.isArray(status?.connectedPeerIds) && status.connectedPeerIds.includes(peerId);
      }, requesterStatus.peerId, { timeout: timeoutMs })
    ]);
    await requester.waitForFunction(({ primaryPeerId, replicaPeerId, failoverReplicaPeerId }) => {
      const status = window.__multiscaleDemo.getNodeKernelStatus?.();
      const primaryCompute = status?.peerCapabilities?.[primaryPeerId]?.compute;
      const replicaCompute = status?.peerCapabilities?.[replicaPeerId]?.compute;
      const failoverReplicaCompute = status?.peerCapabilities?.[failoverReplicaPeerId]?.compute;
      return Boolean(primaryCompute)
        && Boolean(replicaCompute)
        && Boolean(failoverReplicaCompute)
        && (Number(primaryCompute.targetWorkers) > 0 || Number(primaryCompute.workerCount) > 0)
        && (Number(replicaCompute.targetWorkers) > 0 || Number(replicaCompute.workerCount) > 0)
        && (Number(failoverReplicaCompute.targetWorkers) > 0 || Number(failoverReplicaCompute.workerCount) > 0);
    }, {
      primaryPeerId: responderStatus.peerId,
      replicaPeerId: replicaStatus.peerId,
      failoverReplicaPeerId: failoverReplicaStatus.peerId
    }, { timeout: timeoutMs });

    const prepare = await prepareRequester(requester, responderStatus.peerId, {
      replicaPeerIds: [replicaStatus.peerId],
      targetReplicaCount: 2
    });
    if (prepare.remotePlacementConfiguration?.executorId?.startsWith?.(redundantExecutorPrefix) !== true) {
      throw new Error(`Requester did not attach a NodeKernel placement executor: ${JSON.stringify(prepare)}`);
    }
    if (prepare.selectedRemotePlacementPeerId !== responderStatus.peerId
      || prepare.remotePlacementConfiguration?.autoSelectRemotePlacementPeer !== true) {
      throw new Error(`Requester did not auto-select the responder for remote placement: ${JSON.stringify(prepare)}`);
    }
    if (prepare.remotePlacementConfiguration?.redundantPlacementEnabled !== true
      || prepare.remotePlacementConfiguration?.redundantPlacementSchema !== redundantPlacementSchema
      || prepare.remotePlacementConfiguration?.targetReplicaCount !== 2
      || !prepare.remotePlacementConfiguration?.replicaPeerIds?.includes?.(replicaStatus.peerId)) {
      throw new Error(`Requester did not configure redundant remote placement: ${JSON.stringify(prepare)}`);
    }
    if (prepare.remotePeerSelection?.schema !== 'peercompute.multiscale.remote-peer-selection.v0'
      || prepare.remotePeerSelection?.selectedPeerId !== responderStatus.peerId
      || !(prepare.remotePeerSelection?.candidateCount >= 2)
      || !(prepare.remotePeerSelection?.selectedScore > 0)) {
      throw new Error(`Requester remote peer selection report did not select the responder: ${JSON.stringify(prepare)}`);
    }
    const selectedCandidate = prepare.remotePeerSelection?.candidates?.find?.(
      (candidate) => candidate.peerId === responderStatus.peerId
    );
    if (!selectedCandidate?.reasons?.includes?.('advertised-capacity')
      || !(selectedCandidate?.capacity?.workerCount > 0)) {
      throw new Error(`Requester remote peer selection did not use advertised responder capacity: ${JSON.stringify(prepare)}`);
    }
    const replicaCandidate = prepare.remotePeerSelection?.candidates?.find?.(
      (candidate) => candidate.peerId === replicaStatus.peerId
    );
    if (!replicaCandidate?.reasons?.includes?.('advertised-capacity')
      || !(replicaCandidate?.capacity?.workerCount > 0)) {
      throw new Error(`Requester remote peer selection did not use advertised replica capacity: ${JSON.stringify(prepare)}`);
    }

    const selectedRemotePeerId = prepare.selectedRemotePlacementPeerId;
    const runtimeRemote = await runRuntimeRemotePolicyStep(
      requester,
      responder,
      selectedRemotePeerId,
      replica,
      replicaStatus.peerId
    );
    assertRuntimeRemotePolicyStep(runtimeRemote);

    let summary = null;
    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        summary = await runRemoteProbe(requester, selectedRemotePeerId);
        if (summary?.result?.ok === true) break;
        lastError = new Error(`Probe returned ok=false: ${JSON.stringify(summary)}`);
      } catch (error) {
        lastError = error;
      }
      await requester.waitForTimeout(1500);
    }
    if (summary?.result?.ok !== true && lastError) throw lastError;
    summary.responderAfter = await responder.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
    summary.replicaAfter = await replica.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
    summary.primaryPeerId = selectedRemotePeerId;
    summary.replicaPeerId = replicaStatus.peerId;
    assertLiveRemoteProbe(summary);

    const allResponderPeerIds = [
      responderStatus.peerId,
      replicaStatus.peerId,
      failoverReplicaStatus.peerId
    ];
    const firstBalancedPrepare = await prepareRequester(requester, null, {
      replicaPeerIds: allResponderPeerIds,
      targetReplicaCount: 3,
      quorumResultCount: 2,
      balanceRemotePlacementPeers: true,
      remotePlacementBalanceSeed: 0,
      clearExistingPlacement: true
    });
    const firstBalancedPlan = firstBalancedPrepare.remotePeerPlacementPlan || {};
    const firstBalancedSelection = firstBalancedPrepare.remotePeerSelection || {};
    if (firstBalancedSelection?.candidateCount < 3
      || firstBalancedPlan?.primaryPeerId !== firstBalancedSelection?.selectedPeerId
      || firstBalancedPlan?.balanceRemotePlacementPeers !== true) {
      throw new Error(`First balanced placement attach did not start from the top ranked candidate: ${JSON.stringify(firstBalancedPrepare)}`);
    }
    const balancedCandidates = firstBalancedSelection.candidates || [];
    const expectedBalancedPeerId = balancedCandidates[1]?.peerId || null;
    if (!expectedBalancedPeerId || expectedBalancedPeerId === firstBalancedSelection.selectedPeerId) {
      throw new Error(`Balanced placement candidate list did not expose a second primary candidate: ${JSON.stringify(firstBalancedPrepare)}`);
    }
    const balancedPrepare = await prepareRequester(requester, null, {
      replicaPeerIds: allResponderPeerIds,
      targetReplicaCount: 3,
      quorumResultCount: 2,
      balanceRemotePlacementPeers: true,
      remotePlacementBalanceSeed: 1
    });
    const balancedPlan = balancedPrepare.remotePeerPlacementPlan || {};
    const balancedPrimaryPage = responderPagesByPeerId.get(expectedBalancedPeerId);
    const selectedPage = responderPagesByPeerId.get(firstBalancedSelection.selectedPeerId);
    const quorumPeerId = (balancedPlan.replicaPeerIds || [])
      .find((peerId) => peerId !== firstBalancedSelection.selectedPeerId)
      || (balancedPlan.replicaPeerIds || [])[0];
    const quorumPage = responderPagesByPeerId.get(quorumPeerId);
    if (!balancedPrimaryPage || !selectedPage || !quorumPage) {
      throw new Error(`Balanced placement plan referenced an unknown responder page: ${JSON.stringify({
        firstBalancedPrepare,
        balancedPrepare,
        expectedBalancedPeerId,
        quorumPeerId
      })}`);
    }
    const balancedPrimaryBefore = await readResponderCompletedTasks(balancedPrimaryPage);
    const balancedSelectedBefore = await readResponderCompletedTasks(selectedPage);
    const balancedQuorumBefore = await readResponderCompletedTasks(quorumPage);
    const balancedProbe = await runRemoteProbe(requester, expectedBalancedPeerId, {
      stateKey: 'live:remote-placement:balanced-cosmology',
      attachNodeKernelExecutor: false
    });
    if (balancedProbe?.result?.ok !== true) {
      throw new Error(`Balanced remote placement probe returned ok=false: ${JSON.stringify({
        firstPlan: {
          selectedPeerId: firstBalancedSelection.selectedPeerId,
          primaryPeerId: firstBalancedPlan.primaryPeerId,
          replicaPeerIds: firstBalancedPlan.replicaPeerIds,
          balanceSeed: firstBalancedPlan.balanceSeed,
          executorId: firstBalancedPrepare.remotePlacementConfiguration?.executorId,
          targetReplicaCount: firstBalancedPrepare.remotePlacementConfiguration?.targetReplicaCount,
          quorumResultCount: firstBalancedPrepare.remotePlacementConfiguration?.quorumResultCount
        },
        expectedBalancedPeerId,
        activePlan: {
          primaryPeerId: balancedPlan.primaryPeerId,
          replicaPeerIds: balancedPlan.replicaPeerIds,
          balanceSeed: balancedPlan.balanceSeed,
          limitations: balancedPlan.limitations
        },
        activeConfiguration: {
          peerId: balancedPrepare.remotePlacementConfiguration?.peerId,
          replicaPeerIds: balancedPrepare.remotePlacementConfiguration?.replicaPeerIds,
          balanceSeed: balancedPrepare.remotePlacementConfiguration?.remotePlacementBalanceSeed,
          executorId: balancedPrepare.remotePlacementConfiguration?.executorId,
          targetReplicaCount: balancedPrepare.remotePlacementConfiguration?.targetReplicaCount,
          quorumResultCount: balancedPrepare.remotePlacementConfiguration?.quorumResultCount
        },
        probeResult: balancedProbe?.result || null,
        probeConfiguration: {
          peerId: balancedProbe?.remotePlacementConfiguration?.peerId,
          replicaPeerIds: balancedProbe?.remotePlacementConfiguration?.replicaPeerIds,
          balanceSeed: balancedProbe?.remotePlacementConfiguration?.remotePlacementBalanceSeed,
          executorId: balancedProbe?.remotePlacementConfiguration?.executorId,
          targetReplicaCount: balancedProbe?.remotePlacementConfiguration?.targetReplicaCount,
          quorumResultCount: balancedProbe?.remotePlacementConfiguration?.quorumResultCount
        },
        probePlan: {
          primaryPeerId: balancedProbe?.remotePeerPlacementPlan?.primaryPeerId,
          replicaPeerIds: balancedProbe?.remotePeerPlacementPlan?.replicaPeerIds,
          balanceSeed: balancedProbe?.remotePeerPlacementPlan?.balanceSeed,
          limitations: balancedProbe?.remotePeerPlacementPlan?.limitations
        }
      })}`);
    }
    await Promise.all([
      waitForResponderTasks(balancedPrimaryPage, balancedPrimaryBefore),
      waitForResponderTasks(selectedPage, balancedSelectedBefore)
    ]);
    const balancedSummary = {
      firstPrepare: firstBalancedPrepare,
      prepare: balancedPrepare,
      probe: balancedProbe,
      selectedPeerId: firstBalancedSelection.selectedPeerId,
      expectedBalancedPeerId,
      quorumPeerId,
      primaryBefore: balancedPrimaryBefore,
      selectedBefore: balancedSelectedBefore,
      quorumBefore: balancedQuorumBefore,
      primaryAfter: await balancedPrimaryPage.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus()),
      selectedAfter: await selectedPage.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus()),
      quorumAfter: await quorumPage.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus())
    };
    assertBalancedRemoteProbe(balancedSummary);

    const promotedReplicaBefore = await readResponderCompletedTasks(replica);
    const quorumReplicaBefore = await readResponderCompletedTasks(failoverReplica);
    await responder.close();
    await requester.waitForTimeout(1000);
    const failoverTimeoutMs = Math.min(remoteComputeTimeoutMs, 30000);
    const failoverPrimaryTimeoutMs = Math.min(5000, Math.max(1000, failoverTimeoutMs - 1000));
    const failoverPrepare = await prepareRequester(requester, selectedRemotePeerId, {
      replicaPeerIds: [replicaStatus.peerId, failoverReplicaStatus.peerId],
      targetReplicaCount: 3,
      quorumResultCount: 2,
      timeoutMs: failoverTimeoutMs,
      primaryTimeoutMs: failoverPrimaryTimeoutMs,
      replicaTimeoutMs: failoverTimeoutMs
    });
    if (failoverPrepare.remotePlacementConfiguration?.executorId?.startsWith?.(redundantExecutorPrefix) !== true
      || failoverPrepare.remotePlacementConfiguration?.redundantPlacementEnabled !== true
      || failoverPrepare.remotePlacementConfiguration?.targetReplicaCount !== 3
      || failoverPrepare.remotePlacementConfiguration?.quorumResultCount !== 2
      || failoverPrepare.remotePlacementConfiguration?.primaryTimeoutMs !== failoverPrimaryTimeoutMs
      || failoverPrepare.remotePlacementConfiguration?.replicaTimeoutMs !== failoverTimeoutMs
      || !failoverPrepare.remotePlacementConfiguration?.replicaPeerIds?.includes?.(replicaStatus.peerId)
      || !failoverPrepare.remotePlacementConfiguration?.replicaPeerIds?.includes?.(failoverReplicaStatus.peerId)) {
      throw new Error(`Requester did not configure redundant failover placement: ${JSON.stringify(failoverPrepare)}`);
    }

    let failoverSummary = null;
    let failoverError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        failoverSummary = await runRemoteProbe(requester, selectedRemotePeerId, {
          stateKey: 'live:remote-placement:failover-cosmology',
          timeoutMs: failoverTimeoutMs
        });
        if (failoverSummary?.result?.ok === true) break;
        failoverError = new Error(`Failover probe returned ok=false: ${JSON.stringify(failoverSummary)}`);
      } catch (error) {
        failoverError = error;
      }
      await requester.waitForTimeout(1500);
    }
    if (failoverSummary?.result?.ok !== true && failoverError) throw failoverError;
    await waitForResponderTasks(replica, promotedReplicaBefore);
    await waitForResponderTasks(failoverReplica, quorumReplicaBefore);
    failoverSummary.promotedReplicaAfter = await replica.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
    failoverSummary.quorumReplicaAfter = await failoverReplica.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
    failoverSummary.primaryPeerId = selectedRemotePeerId;
    failoverSummary.promotedReplicaPeerId = replicaStatus.peerId;
    failoverSummary.quorumReplicaPeerId = failoverReplicaStatus.peerId;
    failoverSummary.promotedReplicaBefore = promotedReplicaBefore;
    failoverSummary.quorumReplicaBefore = quorumReplicaBefore;
    failoverSummary.failoverPrepare = failoverPrepare;
    assertLiveFailoverProbe(failoverSummary);

    if (errors.length) {
      throw new Error(`Browser diagnostics during live remote smoke:\n${errors.join('\n')}`);
    }

    console.log(JSON.stringify({
      ok: true,
      schema: 'peercompute.multiscale.live-remote-placement-smoke.v0',
      requesterPeerId: requesterStatus.peerId,
      responderPeerId: responderStatus.peerId,
      replicaPeerId: replicaStatus.peerId,
      failoverReplicaPeerId: failoverReplicaStatus.peerId,
      responderCompletedTasks: summary.responderAfter?.computeStats?.totalTasksCompleted || 0,
      replicaCompletedTasks: summary.replicaAfter?.computeStats?.totalTasksCompleted || 0,
      failoverReplicaCompletedTasks: failoverSummary.quorumReplicaAfter?.computeStats?.totalTasksCompleted || 0,
      runtimeRemotePlacement: runtimeRemote.after.taskPlacement?.lastRemotePlacement || null,
      remotePeerSelection: summary.remotePeerSelection || null,
      balancedRemotePeerPlacementPlan: balancedSummary.prepare?.remotePeerPlacementPlan || null,
      balancedPlacement: balancedSummary.probe?.result?.taskPlacement || null,
      remotePeerReliability: summary.remotePeerReliability || null,
      placement: summary.result.taskPlacement,
      failoverPlacement: failoverSummary.result.taskPlacement,
      nodeKernel: summary.nodeKernel,
      runtimeRemoteWorkerId: runtimeRemote.after.taskPlacement?.lastRemotePlacement?.provenance?.workerId || null,
      balancedRemoteWorkerId: balancedSummary.probe?.result?.taskPlacement?.provenance?.workerId || null,
      probeRemoteWorkerId: summary.result.taskPlacement?.provenance?.workerId || null,
      failoverPromotedWorkerId: failoverSummary.result.taskPlacement?.provenance?.workerId || null,
      responderWorkerCount: summary.responderAfter?.computeStats?.workerCount || 0,
      responderWorkerTasksCompleted: summary.responderAfter?.computeStats?.workerTasksCompleted || 0,
      replicaWorkerCount: summary.replicaAfter?.computeStats?.workerCount || 0,
      replicaWorkerTasksCompleted: summary.replicaAfter?.computeStats?.workerTasksCompleted || 0,
      failoverReplicaWorkerCount: failoverSummary.quorumReplicaAfter?.computeStats?.workerCount || 0,
      failoverReplicaWorkerTasksCompleted: failoverSummary.quorumReplicaAfter?.computeStats?.workerTasksCompleted || 0,
      responderWorkerPoolRevision: summary.responderAfter?.computeStats?.workerPoolRevision || 0,
      replicaWorkerPoolRevision: summary.replicaAfter?.computeStats?.workerPoolRevision || 0,
      remoteTasksCompleted: summary.result.remoteTasksCompleted
    }, null, 2));
    await context.close();
  } finally {
    if (browser) await browser.close().catch(() => {});
    relay.child.kill('SIGTERM');
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
