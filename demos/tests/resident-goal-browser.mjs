import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { homedir } from 'node:os';

// Run only after the parent has frozen and served the qualified production build.
// RESIDENT_GOAL_GO=1 RESIDENT_GOAL_ORIGIN=https://host:5196 \
// RESIDENT_GOAL_PROFILE=/absolute/owned-local-profile RESIDENT_GOAL_MODEL_CID=<live-peer-cid> \
// node demos/tests/resident-goal-browser.mjs
// Optional: RESIDENT_GOAL_CASE=lifecycle for independent owner-control qualification;
// default round-trip retains the complete ordered-navigation gate.
// RESIDENT_GOAL_GPU_MODE=nvidia-vulkan for Linux NVIDIA;
// RESIDENT_GOAL_RELAY_PEER_ID=<backend-peer-id> to require a particular relay.
assert.equal(process.env.RESIDENT_GOAL_GO, '1', 'Explicitly opt in after serving the frozen build');
const repository = process.env.PEERCOMPUTE_REPO ?? process.cwd();
const require = createRequire(path.join(repository, 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.RESIDENT_GOAL_ORIGIN, profile = process.env.RESIDENT_GOAL_PROFILE;
const modelCid = process.env.RESIDENT_GOAL_MODEL_CID;
const testCase = process.env.RESIDENT_GOAL_CASE ?? 'round-trip';
assert(['round-trip', 'lifecycle'].includes(testCase), 'Unknown objective acceptance case');
assert(modelCid, 'Explicit discovered peer model CID required');
assert(origin && new URL(origin).protocol === 'https:', 'Explicit secure production preview required');
assert(profile && path.isAbsolute(profile) && /^owned(?:-|$).*profile$/.test(path.basename(profile)), 'Explicitly owned profile required');
const { routeAgentTask } = await import(pathToFileURL(path.join(repository, 'peercompute/src/peercompute/agents/AgentRouter.js')));
const { MODEL_POLICY } = await import(pathToFileURL(path.join(repository, 'peercompute/src/peercompute/inference/modelManifest.js')));
const output = process.env.RESIDENT_GOAL_EVIDENCE ?? path.join(homedir(), '.cache', 'peercompute-goal-browser', String(Date.now()));
const room = `codex-objectives-${Date.now()}`, url = origin + '/?e2e=1&room=' + encodeURIComponent(room);
const relay = process.env.RESIDENT_GOAL_RELAY_PEER_ID;
const gpuMode = process.env.RESIDENT_GOAL_GPU_MODE ?? 'default';
assert(['default', 'nvidia-vulkan'].includes(gpuMode), 'Unknown GPU launch mode');
const encrypted = connection => /noise/i.test(connection.encryption) || (connection.encryption === 'native' && /\/webrtc/.test(connection.address));
const executablePath = process.env.CHROME_PATH ?? '/opt/google/chrome/chrome';
const report = { startedAt: new Date().toISOString(), scope: 'An actual peer-hosted model chooses objective steps over authenticated inference; production learned motor and Cannon physics establish receipts. No synthesized model decisions, scripted action sequence, HF downloads, user profile or public room. Owner controls and reload are independent acceptance cases.',
  testCase, roundTripRequired: testCase === 'round-trip',
  caseScope: testCase === 'lifecycle' ? 'Owner controls and reload only; a one-action objective must come from actual peer inference. This case does not assert multi-step planning or round-trip completion.' : 'Actual ordered Nova/owner arrivals and explicit completion assessment, followed by owner controls and reload.',
  room, url, profile, modelCid, expectedRelay: relay, gpuMode, onnxContextLimit: MODEL_POLICY.maxContextTokens,
  tls: 'Normal certificate verification',
  pages: [], checks: [], screenshots: [], cleanupErrors: [] };
const owned = [];
const save = () => writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const redact = value => String(value).replace(/(?:https?|wss?):\/\/[^\s"'<>]+/g, match => {
  try { const u = new URL(match); return u.origin + u.pathname; } catch { return '[URL]'; }
}).slice(0, 2500);
async function bounded(promise, ms, label) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(label)), ms); })]); }
  finally { clearTimeout(timer); }
}
async function shot(page, name) {
  const file = path.join(output, name + '.png'); await page.screenshot({ path: file, fullPage: true }); report.screenshots.push(file);
}
async function readyPage(page) {
  await page.waitForFunction(() => window.__cubechat?.roomChat?.started && __cubechat.worldAgents && __cubechat.worldUi, null, { timeout: 90000 });
  await bounded(page.evaluate(() => __cubechat.worldAgents.ready), 45000, 'Resident host readiness');
  if (await page.locator('#loading').isVisible()) await page.locator('#loading').click();
  for (let i = 0; i < 5 && await page.locator('dialog[open]').count(); i++) await page.keyboard.press('Escape');
}
async function attach(context, name) {
  const logs = { name, pageErrors: [], consoleErrors: [], warnings: [], failedRequests: [], httpErrors: [], blockedDownloads: [] };
  report.pages.push(logs);
  await context.addInitScript(() => {
    if (navigator.mediaDevices) Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true,
      value: async () => { throw new DOMException('Owned text-only objective acceptance', 'NotAllowedError'); } });
  });
  await context.route('**/*', route => {
    const host = new URL(route.request().url()).hostname;
    if (host === 'huggingface.co' || host.endsWith('.hf.co') || host.endsWith('.huggingface.co')) {
      logs.blockedDownloads.push(redact(route.request().url())); return route.abort();
    }
    return route.continue();
  });
  const page = await context.newPage(); page.setDefaultTimeout(20000);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setBypassServiceWorker', { bypass: true }); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  page.on('pageerror', error => logs.pageErrors.push(redact(error.message)));
  page.on('console', event => {
    if (event.type() === 'error') logs.consoleErrors.push(redact(event.text()));
    if (event.type() === 'warning') logs.warnings.push(redact(event.text()));
  });
  page.on('requestfailed', request => logs.failedRequests.push({ url: redact(request.url()), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) logs.httpErrors.push({ status: response.status(), url: redact(response.url()) }); });
  assert.equal((await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })).status(), 200);
  await readyPage(page); return page;
}
const network = page => page.evaluate(() => {
  const app = __cubechat, manager = app.network.node.getNetworkManager(), node = manager.getLibp2pNode();
  return { peerId: node.peerId.toString(), room: app.currentRoom, world: app.worldAgents.getStatus(),
    connections: node.getConnections().map(c => ({ peerId: c.remotePeer.toString(), address: c.remoteAddr.toString(), encryption: c.encryption })) };
});
const goal = (page, key) => page.evaluate(key => __cubechat.worldAgents.getObjective(key), key);
const calls = page => page.evaluate(() => __goalAcceptance.calls);
async function discoverySnapshot(page) {
  const expectedPeers = report.model?.candidate?.hosts?.map(host => host.peerId) ?? [];
  return page.evaluate(async ({ expectedPeers, modelCid }) => {
    const runtime = __cubechat.worldAgents.runtime, manager = runtime.networkManager;
    const service = manager?.getPeerInferenceService?.(), node = manager?.getLibp2pNode?.();
    const agents = await runtime.getAgentController();
    const targets = runtime.listInferenceTargets();
    const candidates = await agents.inference.listCandidates({ mode: 'network-assisted', task: 'text-generation', refresh: false });
    const primitive = value => value == null || ['string', 'number', 'boolean'].includes(typeof value);
    const known = value => value ? Object.fromEntries(Object.entries(value).filter(([, item]) => primitive(item)
      || (Array.isArray(item) && item.every(primitive)))) : null;
    return { at: Date.now(), managerPresent: Boolean(manager), managerPeerId: manager?.peerId, knownPeerCount: manager?.peers?.size ?? 0, recoveryTrace: window.__goalAcceptance?.recoveries ?? [], managerScope: { gameId: manager?.config?.gameId, roomId: manager?.config?.roomId, topologyId: manager?.config?.topologyId },
      nativeDialQueue: (node?.getDialQueue?.() ?? []).map(item => ({ id: item.id, peerId: item.peerId?.toString?.(), status: item.status })),
      discovery: runtime.getDiscoveryStatus(), candidateCount: candidates.length, candidates, targets,
      expectedModelAvailable: candidates.some(item => item.manifestCid === modelCid),
      expectedPeers: expectedPeers.map(peerId => ({ peerId, known: known(manager?.peers?.get(peerId)),
        dialBackoff: manager?.peerDialBackoff?.get(peerId), lastDialAt: manager?.recentDialAttempts?.get(peerId),
        pendingDial: manager?.pendingPeerDials?.get(peerId), recoveryPending: manager?.peerConnectionRecovery?.pending?.has(peerId) ?? false,
        recoveryCooldown: manager?.peerConnectionRecovery?.cooldowns?.get(peerId),
        serviceRecoveryPending: service?.recoveries?.has(peerId) ?? false,
        record: service?.records?.has(peerId) ? { receivedAt: service.records.get(peerId).receivedAt,
          protocol: service.records.get(peerId).protocol, hostedModels: service.records.get(peerId).state?.hostedModels } : null })),
      connections: (node?.getConnections?.() ?? []).map(connection => ({ peerId: connection.remotePeer.toString(),
        address: connection.remoteAddr.toString(), encryption: connection.encryption, status: connection.status })),
      service: service ? { closed: service.closed, refreshing: Boolean(service.refreshing), errors: service.lastErrors,
        recoveries: [...service.recoveries.keys()], records: [...service.records].map(([peerId, record]) => ({ peerId,
          receivedAt: record.receivedAt, protocol: record.protocol, hostedModels: record.state?.hostedModels })) } : null };
  }, { expectedPeers, modelCid });
}

// Playwright's injected predicate polling treats a Promise as truthy. Poll
// acknowledged IndexedDB reads in Node so async false results really wait.
async function waitGoal(page, key, predicate, { timeout = 20000, stableMs = 0 } = {}) {
  const deadline = Date.now() + timeout; let matchedAt, last, revision;
  while (Date.now() < deadline) {
    last = await goal(page, key);
    if (last && revision !== last.revision) {
      revision = last.revision; console.log('Objective checkpoint', JSON.stringify({ revision, status: last.status, steps: last.steps, reason: last.reason }));
      const discovery = await discoverySnapshot(page);
      (report.discoverySnapshots ??= []).push({ revision: last.revision, status: last.status, ...discovery });
      await writeFile(path.join(output, 'checkpoint-live.json'), JSON.stringify({ goal: last, calls: await calls(page), discovery }, null, 2) + '\n');
    }
    if (predicate(last)) { matchedAt ??= Date.now(); if (Date.now() - matchedAt >= stableMs) return last; }
    else matchedAt = undefined;
    await page.waitForTimeout(200);
  }
  throw Error('Objective wait timed out: ' + JSON.stringify(last));
}
async function inspect(page, name = 'Ada', requireObjective = true) {
  for (let i = 0; i < 5 && await page.locator('dialog[open]').count(); i++) await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  const modal = page.getByRole('dialog', { name: 'Residents', exact: true });
  const details = modal.getByLabel(`Objective details for ${name}`, { exact: true });
  if (requireObjective) {
    assert.equal(await details.count(), 1, 'Owner objective controls exist');
    if (!await details.evaluate(element => element.parentElement.open)) await details.click();
  }
  return modal;
}
async function installObserver(page) {
  return page.evaluate(modelCid => {
    const app = __cubechat, runtime = app.worldAgents.runtime, generate = runtime.generate.bind(runtime);
    const state = window.__goalAcceptance = { calls: [], outcomes: [], samples: [], keys: [], recoveries: [] };
    const manager = runtime.networkManager, recover = manager?.recoverPeerInferenceConnection?.bind(manager);
    if (recover) manager.recoverPeerInferenceConnection = (...args) => {
      const event = { peerId: args[0], at: Date.now() }; state.recoveries.push(event);
      if (state.recoveries.length > 256) state.recoveries.shift();
      let pending;
      try { pending = recover(...args); }
      catch (error) { event.error = { code: error.code, message: error.message }; event.finishedAt = Date.now(); throw error; }
      Promise.resolve(pending).then(connection => { try { event.result = { status: connection?.status,
        address: connection?.remoteAddr?.toString?.(), encryption: connection?.encryption }; event.finishedAt = Date.now(); } catch {} },
        error => { try { event.error = { code: error.code, message: error.message }; event.finishedAt = Date.now(); } catch {} });
      return pending; // Preserve the exact original recovery promise and outcome.
    };
    runtime.generate = async (key, input) => {
      if (key !== `peer:${modelCid}`) throw Error('Acceptance requires the discovered peer model; no local or substituted provider');
      const call = { key, prompt: input.prompt, messages: input.messages, worldContext: input.worldContext,
        maxNewTokens: input.maxNewTokens, startedAt: Date.now(), progress: [] };
      state.calls.push(call);
      try {
        const result = await generate(key, { ...input, onProgress: event => { call.progress.push(structuredClone(event)); input.onProgress?.(event); } });
        call.result = result; return result;
      } catch (error) { call.error = { message: error.message, code: error.code, committed: error.committed }; throw error; }
      finally { call.finishedAt = Date.now(); }
    };
    state.unsubscribe = app.agentLayer.subscribeOutcomes(event => { state.outcomes.push(structuredClone(event)); });
    state.timer = setInterval(() => {
      for (const key of state.keys) {
        const entry = app.agentLayer.entries.get(key); if (!entry) continue;
        state.samples.push({ at: Date.now(), key, position: entry.body.position.toArray(), velocity: entry.body.velocity.toArray(),
          status: app.agentLayer.getResidentMotorStatus(key) });
      }
      if (state.samples.length > 2000) state.samples.splice(0, state.samples.length - 2000);
    }, 200);
    return true;
  }, modelCid);
}
async function capture(page, key) {
  return page.evaluate(async key => {
    const app = __cubechat, state = __goalAcceptance, record = await app.worldAgents.getObjective(key);
    const runtime = app.worldAgents.runtime, agents = await runtime.getAgentController();
    const memory = runtime.stateManager.getWorldMemoryStore((agents.store.name + '-episodes').slice(0, 80));
    return { goal: record, calls: state.calls, recoveries: state.recoveries, outcomes: state.outcomes, samples: state.samples,
      motor: app.agentLayer.getMotorStatus(), status: app.agentLayer.getResidentMotorStatus(key),
      position: app.agentLayer.getPosition(key), velocity: app.agentLayer.entries.get(key)?.body.velocity.toArray(),
      episodes: await memory.snapshot({ worldId: record.worldId, agentId: record.agentId, includePrivate: true }) };
  }, key);
}
function assertPeerCalls(recordedCalls) {
  assert(recordedCalls.length > 0, 'At least one actual peer inference call is required');
  for (const call of recordedCalls) {
    assert(!call.error, call.error?.message); assert.equal(call.key, `peer:${modelCid}`); assert(call.result?.text?.trim());
    assert.equal(call.result.manifestCid, modelCid);
    assert.equal(call.result.route?.local, false);
    assert.equal(call.result.route?.peerId, call.result.peerId);
    assert(call.result.peerId && /^\/peercompute\/inference\//.test(call.result.protocol));
    assert(/noise/i.test(call.result.connectionEncryption) || (call.result.connectionEncryption === 'native'
      && /\/webrtc/.test(call.result.connectionAddress)), 'Actual encrypted connection evidence required');
    assert(Number.isInteger(call.result.inputTokens) && call.result.inputTokens > 0);
    assert(Number.isInteger(call.maxNewTokens) && call.result.inputTokens + call.maxNewTokens <= MODEL_POLICY.maxContextTokens);
    // Hardware counters are reported by the remote host, not independently measured here.
  }
}
await mkdir(output, { recursive: true });
let owner, visitor, key;
try {
  const args = ['--enable-gpu', '--enable-unsafe-webgpu'];
  if (gpuMode === 'nvidia-vulkan') {
    const gpu = await promisify(execFile)('nvidia-smi', ['--query-gpu=name,memory.free,memory.total', '--format=csv,noheader,nounits']);
    report.gpuBefore = gpu.stdout.trim(); report.minimumFreeGpuMiB = 2048;
    assert(gpu.stdout.trim().split('\n').some(line => Number(line.split(',')[1]) >= report.minimumFreeGpuMiB), `At least ${report.minimumFreeGpuMiB}MiB GPU memory free`);
    args.push('--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native',
      '--disable-vulkan-surface', '--enable-dawn-features=vulkan_enable_f16_on_nvidia');
  }
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true,
    viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: false, args });
  const resource = { context }; owned.push(resource); owner = resource.page = await attach(context, 'owner');
  report.application = await owner.evaluate(() => ({ assignGoal: typeof __cubechat.worldAgents.assignGoal, getObjective: typeof __cubechat.worldAgents.getObjective,
    scripts: [...document.scripts].map(script => script.src).filter(Boolean) }));
  assert.equal(report.application.assignGoal, 'function'); assert.equal(report.application.getObjective, 'function');
  await owner.evaluate(async () => {
    await __cubechat.worldAgents.runtime.setSharing(false);
    await __cubechat.worldAgents.runtime.setHostInference(false);
  });
  const discoveryUntil = Date.now() + 90000;
  while (Date.now() < discoveryUntil) {
    report.discovery = await owner.evaluate(async () => {
      const runtime = __cubechat.worldAgents.runtime, agents = await runtime.getAgentController();
      return { candidates: await agents.inference.listCandidates({ mode: 'network-assisted', task: 'text-generation', refresh: true }),
        localModels: runtime.listInferenceTargets().filter(item => item.local && item.available), discovery: runtime.getDiscoveryStatus() };
    });
    const startupDiscovery = await discoverySnapshot(owner);
    (report.discoverySnapshots ??= []).push({ phase: 'startup', ...startupDiscovery });
    await writeFile(path.join(output, 'discovery-live.json'), JSON.stringify(startupDiscovery, null, 2) + '\n');
    assert.equal(report.discovery.localModels.length, 0, 'No local model may serve this peer acceptance');
    try { report.model = routeAgentTask({ task: 'text-generation', inferenceMode: 'network-assisted', candidates: report.discovery.candidates }); }
    catch (error) { if (error.code !== 'ERR_AGENT_NO_MODEL') throw error; }
    if (report.model?.candidate.manifestCid === modelCid && report.model.candidate.local === false) break;
    await owner.waitForTimeout(1500);
  }
  assert.equal(report.model?.candidate.manifestCid, modelCid, 'The unchanged production router must choose the discovered peer model');
  assert.equal(report.model.candidate.local, false);
  await save(); console.log('Production router selected peer model:', report.model.candidate.name);
  await installObserver(owner);
  report.setup = await owner.evaluate(async () => {
    const app = __cubechat, common = { localOnly: false, shared: true, initiateConversations: false, respondToWorldChat: false, movement: 'stationary' };
    const nova = await app.worldAgents.spawn({ ...common, name: 'Nova', goals: ['Remain available for the owner.'] });
    const ada = await app.worldAgents.spawn({ ...common, name: 'Ada', goals: ['Use current observations and verified physical outcomes to carry out the owner objective.'] });
    const bodies = app.worldAgents.getStatus().bodies, adaBody = bodies.find(body => body.agentId === ada.agentId), novaBody = bodies.find(body => body.agentId === nova.agentId);
    app.agentLayer.place(app.agentLayer.entries.get(adaBody.key), [0, 3, 0]); app.agentLayer.place(app.agentLayer.entries.get(novaBody.key), [-35, 3, 0]);
    const human = app.physics.getPlayerBody(app.network.localPlayer.id); human.position.set(35, 3, 0); human.velocity.set(0, 0, 0);
    human.previousPosition.copy(human.position); human.interpolatedPosition.copy(human.position);
    app.network.localPlayer.position = { x: 35, y: 3, z: 0 }; __goalAcceptance.keys.push(adaBody.key);
    const peerId = app.network.node.getNetworkManager().getLibp2pNode().peerId.toString();
    return { ada, nova, adaBody, novaBody, peerId };
  });
  key = report.setup.adaBody.key;
  globalThis.__ownedGoalBrowser = { owner, cancel: async () => {
    const current = await goal(owner, key);
    return owner.evaluate(({ key, current }) => __cubechat.worldAgents.cancelGoal({ key, goalId: current.goalId,
      expectedRevision: current.revision }), { key, current });
  } };
  await owner.waitForTimeout(500);
  report.setup.observed = await owner.evaluate(key => __cubechat.agentLayer.observe(key, { requesterPeerId: __cubechat.network.node.getNetworkManager().peerId }), key);
  const novaId = `resident:${report.setup.novaBody.ownerPeerId}:${report.setup.nova.agentId}`, ownerId = `human:${report.setup.peerId}`;
  assert(report.setup.observed.participants.some(item => item.id === novaId), 'Nova is actually observed');
  assert(report.setup.observed.participants.some(item => item.id === ownerId), 'The owner is actually observed');
  let modal = await inspect(owner);
  await modal.getByRole('textbox', { name: 'Objective for Ada', exact: true }).fill(testCase === 'lifecycle' ? 'Visit Nova.' : 'Visit Nova, then come back to me.');
  await shot(owner, 'objective-ready-desktop');
  await modal.getByRole('button', { name: 'Start objective for Ada', exact: true }).click();
  await waitGoal(owner, key, record => !!record?.startedAt);
  report.startedGoal = await goal(owner, key); await save(); console.log('Native objective started; waiting for real physical outcomes.');
  await owner.keyboard.press('Escape');
  if (testCase === 'round-trip') {
  // Receipt persistence intentionally pauses while the matching motor is being
  // stopped. That acknowledgement is not a terminal failure.
  await waitGoal(owner, key, record => ['completed', 'cancelled'].includes(record?.status)
    || (record?.status === 'paused' && !/settling its motor/i.test(record.reason)), { timeout: 480000, stableMs: 3000 });
  report.roundTrip = await capture(owner, key); await save();
  assert.equal(report.roundTrip.goal.status, 'completed', JSON.stringify(report.roundTrip.goal));
  const arrivals = report.roundTrip.goal.receipts.filter(receipt => receipt.type === 'approach' && receipt.status === 'arrived');
  assert(arrivals.length >= 2, 'Two actual approach arrivals are required');
  assert.equal(arrivals[0].targetId, novaId, 'First physical arrival is Nova');
  assert.equal(arrivals[1].targetId, ownerId, 'Second physical arrival is the owner');
  assert(report.roundTrip.goal.modelAssessment.trim(), 'Completion is an explicit model assessment');
  assert(report.roundTrip.goal.steps <= 8); assert(report.roundTrip.goal.receipts.length <= 8);
  assert(report.roundTrip.goal.deadlineAt - report.roundTrip.goal.startedAt <= 600000);
  for (const receipt of arrivals.slice(0, 2)) {
    assert(report.roundTrip.outcomes.some(event => event.requestId === receipt.requestId && event.status === 'arrived'), 'Durable receipt matches a real motor event');
    assert(report.roundTrip.episodes.some(episode => episode.source.kind === 'verified-action' && episode.source.eventId.includes(receipt.requestId)), 'Physical episode retains action provenance');
  }
  const moving = report.roundTrip.samples.filter(sample => sample.status?.backend === 'webgpu' && sample.status?.worker === true);
  assert(moving.length > 10, 'Actual managed GPU motor supplied sustained navigation');
  assert(moving.some(sample => Math.hypot(sample.velocity[0], sample.velocity[2]) > .1));
  assert(Math.hypot(report.roundTrip.position[0] - 35, report.roundTrip.position[2]) <= 13, 'Resident physically returned near the owner');
  assertPeerCalls(report.roundTrip.calls);

  report.checks.push('The real peer model independently selects Nova then owner approaches; actual managed GPU motion produces ordered durable receipts and explicit completion assessment');
  await save(); console.log('Actual round trip complete; checking native UI and peer ownership.');
  } else {
    await waitGoal(owner, key, record => record?.status === 'acting', { timeout: 180000 });
    report.beforePause = await goal(owner, key);
    assert.equal(report.beforePause.pendingAction.intent.type, 'approach');
    assert.equal(report.beforePause.pendingAction.intent.targetId, novaId, 'The actual peer selected Nova for the one-action objective');
    await owner.waitForFunction(() => __goalAcceptance.samples.some(sample => sample.status?.backend === 'webgpu'
      && sample.status.worker === true && Math.hypot(sample.velocity[0], sample.velocity[2]) > .1), null, { timeout: 3000 });
    const callsBeforePause = (await calls(owner)).length;
    modal = await inspect(owner);
    await modal.getByRole('button', { name: 'Pause objective for Ada', exact: true }).click();
    await waitGoal(owner, key, record => record?.status === 'paused');
    report.pausedImmediately = await capture(owner, key);
    await owner.waitForTimeout(1400); report.paused = await capture(owner, key);
    assert.deepEqual(report.paused.velocity, [0, 0, 0]);
    assert.deepEqual(report.paused.position, report.pausedImmediately.position);
    assert.equal(report.paused.calls.length, callsBeforePause);
    assertPeerCalls(report.paused.calls);
    report.checks.push('Lifecycle case only: an actual peer-produced approach moved the managed GPU body; owner Pause stopped it. No round-trip completion is asserted.');
    await save(); console.log('Real one-action approach paused; checking native UI and peer ownership.');
  }
  modal = await inspect(owner); await shot(owner, testCase === 'lifecycle' ? 'objective-paused-desktop' : 'objective-completed-desktop');
  await owner.setViewportSize({ width: 390, height: 844 }); await owner.waitForTimeout(500);
  report.mobileBounds = await modal.evaluate(element => { const r = element.getBoundingClientRect(); return { x: r.x, width: r.width, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }; });
  assert(report.mobileBounds.x >= 0 && report.mobileBounds.x + report.mobileBounds.width <= 391 && report.mobileBounds.scrollWidth <= 390);
  await shot(owner, testCase === 'lifecycle' ? 'objective-paused-mobile' : 'objective-completed-mobile');
  await owner.setViewportSize({ width: 1440, height: 1000 }); await owner.waitForTimeout(300);
  report.network = await network(owner);
  assert(report.network.connections.some(connection => (!relay || connection.peerId === relay) && encrypted(connection)), 'Authenticated network connection to the configured backend, if specified');
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-webgpu', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const visitorContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: false });
  const visitorResource = { browser, context: visitorContext }; owned.push(visitorResource); visitor = visitorResource.page = await attach(visitorContext, 'visitor');
  await visitor.evaluate(() => {
    const app = __cubechat, body = app.physics.getPlayerBody(app.network.localPlayer.id);
    body.position.set(100, 3, 100); body.velocity.set(0, 0, 0); body.previousPosition.copy(body.position); body.interpolatedPosition.copy(body.position);
    app.network.localPlayer.position = { x: 100, y: 3, z: 100 };
  });
  await visitor.waitForFunction(id => __cubechat.worldAgents.getStatus().bodies.some(body => body.agentId === id), report.setup.ada.agentId, { timeout: 90000 });
  const remoteKey = await visitor.evaluate(id => __cubechat.worldAgents.getStatus().bodies.find(body => body.agentId === id).key, report.setup.ada.agentId);
  const ownershipCheckpoint = await goal(owner, key);
  report.remote = await visitor.evaluate(async ({ key, goalId, expectedRevision }) => {
    const host = __cubechat.worldAgents, attempts = {};
    for (const method of ['getObjective', 'assignGoal', 'pauseGoal', 'resumeGoal', 'cancelGoal']) {
      try { await host[method](method === 'getObjective' ? key : { key, goalId, expectedRevision, objective: 'Unauthorized visitor objective' }); attempts[method] = { unexpectedlySucceeded: true }; }
      catch (error) { attempts[method] = { error: error.message }; }
    }
    return { attempts, body: host.getStatus().bodies.find(body => body.key === key) };
  }, { key: remoteKey, goalId: ownershipCheckpoint.goalId, expectedRevision: ownershipCheckpoint.revision });
  for (const result of Object.values(report.remote.attempts)) assert.match(result.error ?? '', /owner/i);
  assert(!JSON.stringify(report.remote.body).includes('Visit Nova'), 'Public resident descriptor excludes private objective');
  const visitorModal = await inspect(visitor, 'Ada', false); assert.equal(await visitorModal.getByLabel('Objective details for Ada', { exact: true }).count(), 0);
  await shot(visitor, 'visitor-owner-only-objectives');
  report.checks.push('Actual second peer sees the resident but cannot read, assign, pause, resume or cancel its owner-local objective');
  if (testCase === 'round-trip') {
  // A separate explicit objective exercises native Pause/Resume and reload.
  modal = await inspect(owner);
  await modal.getByRole('textbox', { name: 'Objective for Ada', exact: true }).fill('Visit Nova again, then come back to me.');
  await modal.getByRole('button', { name: 'Start objective for Ada', exact: true }).click();
  await owner.keyboard.press('Escape');
  await waitGoal(owner, key, record => record?.status === 'acting', { timeout: 180000 });
  report.beforePause = await goal(owner, key); const callsBeforePause = (await calls(owner)).length;
  modal = await inspect(owner);
  await modal.getByRole('button', { name: 'Pause objective for Ada', exact: true }).click();
  await waitGoal(owner, key, record => record?.status === 'paused');
  await owner.waitForTimeout(1400); report.paused = await capture(owner, key);
  assert.deepEqual(report.paused.velocity, [0, 0, 0]); assert.equal(report.paused.calls.length, callsBeforePause);
  await shot(owner, 'objective-paused-desktop');
  }
  modal = await inspect(owner);
  await modal.getByRole('button', { name: 'Resume objective for Ada', exact: true }).click();
  await owner.keyboard.press('Escape');
  await waitGoal(owner, key, record => record?.status === 'acting', { timeout: 180000 });
  report.beforeReload = await capture(owner, key); assert.equal(report.beforeReload.goal.goalId, report.beforePause.goalId);
  assert.equal(report.beforeReload.goal.startedAt, report.beforePause.startedAt); assert.equal(report.beforeReload.goal.deadlineAt, report.beforePause.deadlineAt);
  assert.notEqual(report.beforeReload.goal.pendingAction.requestId, report.beforePause.pendingAction.requestId, 'Resume plans a fresh physical request');
  assertPeerCalls(report.beforeReload.calls);
  if (testCase === 'lifecycle') {
    assert.equal(report.beforeReload.goal.pendingAction.intent.type, 'approach');
    assert.equal(report.beforeReload.goal.pendingAction.intent.targetId, novaId);
  }
  await save();
  await owner.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }); await readyPage(owner); await installObserver(owner);
  const restoredKey = await owner.evaluate(id => __cubechat.worldAgents.getStatus().bodies.find(body => body.agentId === id && body.local)?.key, report.setup.ada.agentId);
  assert(restoredKey, 'Resident identity survives reload'); key = restoredKey;
  await owner.waitForTimeout(2500); report.restored = await capture(owner, key);
  assert.equal(report.restored.goal.status, 'paused'); assert.equal(report.restored.goal.goalId, report.beforeReload.goal.goalId);
  assert.equal(report.restored.goal.startedAt, report.beforeReload.goal.startedAt); assert.equal(report.restored.goal.deadlineAt, report.beforeReload.goal.deadlineAt);
  // The observer starts after host readiness. Establish the earlier interval
  // from acknowledged durable checkpoints as well as the later live counters.
  assert.equal(report.restored.goal.steps, report.beforeReload.goal.steps);
  assert.deepEqual(report.restored.goal.receipts, report.beforeReload.goal.receipts);
  assert.deepEqual(report.restored.goal.pendingDecision, report.beforeReload.goal.pendingDecision);
  assert.deepEqual(report.restored.goal.pendingAction, report.beforeReload.goal.pendingAction);
  const previousTrace = report.beforeReload.goal.trace.at(-1);
  const boundary = report.restored.goal.trace.findLastIndex(event => JSON.stringify(event) === JSON.stringify(previousTrace));
  assert(boundary >= 0, 'Reload retains the interrupted checkpoint trace');
  assert(report.restored.goal.trace.slice(boundary + 1).every(event => event.type === 'restored'), 'No new decision/action during bootstrap');
  assert.equal(report.restored.calls.length, 0, 'No model requests after reload readiness');
  assert.equal(report.restored.outcomes.length, 0, 'No physical outcomes after reload readiness');
  assert.deepEqual(report.restored.velocity, [0, 0, 0]);
  modal = await inspect(owner); await shot(owner, 'objective-reload-paused-desktop');
  await modal.getByRole('button', { name: 'Cancel objective for Ada', exact: true }).click();
  await waitGoal(owner, key, record => record?.status === 'cancelled');
  report.cancelled = await goal(owner, key); assert.equal(report.cancelled.goalId, report.beforeReload.goal.goalId);
  report.checks.push('Native owner Pause stops motion; Resume keeps original bounds and uses a fresh action; reload requires owner acknowledgement with no replay; Cancel persists');
  for (const logs of report.pages) {
    assert.deepEqual(logs.pageErrors, []); assert.deepEqual(logs.consoleErrors, []); assert.deepEqual(logs.blockedDownloads, []);
    assert.deepEqual(logs.httpErrors.filter(error => error.url.startsWith(origin)), []);
  }
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = { message: error.message, stack: error.stack }; process.exitCode = 1;
  if (owner && !owner.isClosed()) {
    try {
      if (key) await inspect(owner);
      await shot(owner, 'failure-desktop');
      await owner.setViewportSize({ width: 390, height: 844 }); await owner.waitForTimeout(300);
      await shot(owner, 'failure-mobile');
    } catch (visualError) { report.failureVisualError = visualError.message; }
  }
}
finally {
  if (owner && !owner.isClosed()) try { report.finalDiscovery = await discoverySnapshot(owner); } catch (error) { report.cleanupErrors.push('Discovery evidence: ' + error.message); }
  if (owner && !owner.isClosed() && key) try { report.finalState = await capture(owner, key); } catch (error) { report.cleanupErrors.push('Evidence: ' + error.message); }
  for (const resource of owned.reverse()) {
    if (resource.page && !resource.page.isClosed()) await bounded(resource.page.evaluate(async () => {
      const state = window.__goalAcceptance; if (state) { clearInterval(state.timer); state.unsubscribe?.(); }
      await window.__cubechat?.destroy?.();
    }), 30000, 'World cleanup timed out').catch(error => report.cleanupErrors.push(error.message));
    await resource.context.close().catch(error => report.cleanupErrors.push(error.message));
    await resource.browser?.close().catch(error => report.cleanupErrors.push(error.message));
  }
  if (report.cleanupErrors.length) { report.passed = false; process.exitCode = 1; }
  // Page errors can arrive during shutdown, after the functional assertions.
  // Preserve those errors and fail the final report instead of printing a pass.
  report.finalBrowserErrors = report.pages.filter(logs => logs.pageErrors.length || logs.consoleErrors.length
    || logs.blockedDownloads.length || logs.httpErrors.some(error => error.url.startsWith(origin))).map(logs => logs.name);
  if (report.finalBrowserErrors.length) { report.passed = false; process.exitCode = 1; }
  delete globalThis.__ownedGoalBrowser;
  report.finishedAt = new Date().toISOString(); await save();
  console.log(JSON.stringify({ passed: report.passed, testCase, output, checks: report.checks, error: report.error, cleanupErrors: report.cleanupErrors }, null, 2));
}
