import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { homedir } from 'node:os';
import { chromium } from 'playwright';

// Explicitly owned cached-profile qualification, never a public world/user browser.
// RESIDENT_CONTEXT_GO=1 RESIDENT_CONTEXT_ORIGIN=https://host:5196 \
// RESIDENT_CONTEXT_PROFILE=/absolute/owned-local-profile node demos/tests/resident-context-browser.mjs
assert.equal(process.env.RESIDENT_CONTEXT_GO, '1', 'Wait for the prepared build and exclusive GPU GO');
const origin = process.env.RESIDENT_CONTEXT_ORIGIN;
const profile = process.env.RESIDENT_CONTEXT_PROFILE;
assert(origin && new URL(origin).protocol === 'https:', 'Explicit secure production preview required');
assert(profile && path.isAbsolute(profile) && /owned[^/]*profile/.test(profile), 'Explicitly owned cached profile required');
const output = process.env.RESIDENT_CONTEXT_EVIDENCE ?? path.join(homedir(), '.cache', 'peercompute-context-browser', String(Date.now()));
const room = 'codex-context-' + Date.now(), url = origin + '/?e2e=1&room=' + encodeURIComponent(room);
const relay = '12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs';
const executablePath = process.env.CHROME_PATH ?? '/opt/google/chrome/chrome';
const report = { startedAt: new Date().toISOString(), scope: 'Actual cached Qwen managed WebGPU, native bounded private token measurement and history trimming, real isolated SecretWorkshop peers, native owner-only Resume. Explicit one-shot error fixtures test the circuit breaker; qualified model replies are never substituted.',
  room, url, profile, pages: [], checks: [], screenshots: [], cleanupErrors: [] };
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
async function attach(context, name) {
  const logs = { name, pageErrors: [], consoleErrors: [], warnings: [], failedRequests: [], httpErrors: [], blockedDownloads: [] };
  report.pages.push(logs);
  await context.addInitScript(() => {
    if (navigator.mediaDevices) Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true,
      value: async () => { throw new DOMException('Owned text-only acceptance', 'NotAllowedError'); } });
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
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  page.on('pageerror', error => logs.pageErrors.push(redact(error.message)));
  page.on('console', event => {
    if (event.type() === 'error') logs.consoleErrors.push(redact(event.text()));
    if (event.type() === 'warning') logs.warnings.push(redact(event.text()));
  });
  page.on('requestfailed', request => logs.failedRequests.push({ url: redact(request.url()), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) logs.httpErrors.push({ status: response.status(), url: redact(response.url()) }); });
  assert.equal((await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })).status(), 200);
  await page.waitForFunction(() => window.__cubechat?.roomChat?.started && __cubechat.worldAgents && __cubechat.worldUi, null, { timeout: 90000 });
  await bounded(page.evaluate(() => __cubechat.worldAgents.ready), 45000, 'Resident host readiness');
  if (await page.locator('#loading').isVisible()) await page.locator('#loading').click();
  for (let i = 0; i < 5 && await page.locator('dialog[open]').count(); i++) await page.keyboard.press('Escape');
  return page;
}
const snapshot = page => page.evaluate(() => {
  const app = __cubechat, manager = app.network.node.getNetworkManager(), node = manager.getLibp2pNode();
  return { peerId: node.peerId.toString(), room: app.currentRoom, world: app.worldAgents.getStatus(),
    connections: node.getConnections().map(c => ({ peerId: c.remotePeer.toString(), address: c.remoteAddr.toString(), encryption: c.encryption })) };
});
async function pair(a, b) {
  const aId = (await snapshot(a)).peerId, bId = (await snapshot(b)).peerId;
  for (const [page, id] of [[a, bId], [b, aId]]) await page.waitForFunction(id => {
    const app = __cubechat, manager = app.network.node.getNetworkManager(), peer = manager.peers.get(id);
    return peer && ['gameId', 'roomId', 'topologyId'].every(key => peer[key] === manager.config[key]) && app.remotePlayers.has(id);
  }, id, { timeout: 90000 });
  const states = await Promise.all([snapshot(a), snapshot(b)]);
  for (const state of states) assert(state.connections.some(c => c.peerId === relay), 'Configured SecretWorkshop relay connected');
  return { aId, bId, states };
}
async function chat(page, key) {
  const input = page.getByRole('textbox', { name: 'World message', exact: true });
  if (!await input.isVisible()) { await page.locator('#scene-container canvas').focus(); await page.keyboard.press('Enter'); }
  await page.getByRole('combobox', { name: 'Chat with', exact: true }).selectOption(key);
  return input;
}
async function tapCube(page, key) {
  await page.keyboard.press('Escape');
  await page.evaluate(key => {
    const app = __cubechat, p = app.agentLayer.getPosition(key), body = app.physics.getPlayerBody(app.network.localPlayer.id);
    if (!p || !body) throw Error('Cube/player missing');
    body.position.set(p[0] + 10, p[1], p[2] + 12); body.velocity.set(0, 0, 0);
    body.previousPosition.copy(body.position); body.interpolatedPosition.copy(body.position);
    app.controller.rotation = 0; app.controller.pitch = 0;
    app.network.localPlayer.position = { x: body.position.x, y: body.position.y, z: body.position.z };
  }, key);
  await page.waitForTimeout(400);
  const point = await page.evaluate(key => {
    const layer = __cubechat.agentLayer, entry = layer.entries.get(key), camera = __cubechat.scene.camera;
    const p = entry.mesh.getWorldPosition(entry.mesh.position.clone()).project(camera), box = layer.canvas.getBoundingClientRect();
    const x = box.x + (p.x + 1) * box.width / 2, y = box.y + (1 - p.y) * box.height / 2;
    return { x, y, picked: layer.pick(x, y), z: p.z, width: innerWidth, height: innerHeight };
  }, key);
  assert.equal(point.picked, key, 'Real raycast resolves the resident cube');
  assert(point.x > 0 && point.y > 0 && point.x < point.width && point.y < point.height, 'Cube is onscreen');
  await page.mouse.click(point.x, point.y);
  await page.waitForFunction(key => document.querySelector('select[aria-label="Chat with"]')?.value === key, key);
  return point;
}
const calls = page => page.evaluate(() => __contextAcceptance.calls);
const head = (page, id) => page.evaluate(async id => (await __cubechat.worldAgents.runtime.getAgentController()).get(id), id);
async function send(page, key, text) {
  return bounded(page.evaluate(async ({ key, text }) => {
    try { return { result: await __cubechat.worldAgents.send({ key, text }) }; }
    catch (error) { return { error: { message: error.message, code: error.code, committed: error.committed } }; }
  }, { key, text }), 180000, 'Resident generation exceeded three minutes');
}
function validateBudget(call, { trimmed = false } = {}) {
  assert(!call.error, call.error?.message);
  const events = call.progress.filter(event => event.type === 'context-budget');
  assert(events.length, 'Native preflight emits validated token accounting');
  const last = events.at(-1), budget = call.result.contextBudget;
  assert.equal(last.probeTokenBudget, 1);
  assert(Number.isInteger(last.probeOutputTokens) && last.probeOutputTokens >= 0 && last.probeOutputTokens <= 1, 'Native measurement samples at most one private token');
  assert(!('text' in last), 'Measurement content is never emitted');
  assert.equal(budget.probeTokenBudget, 1);
  assert(budget.measurementTokens >= 0 && budget.measurementTokens <= budget.preflightCalls, 'All private measurement tokens are accounted for');
  assert.equal(last.overflow, false);
  assert.equal(call.progress.filter(event => event.type === 'token').map(event => event.text).join(''), call.result.text, 'Only visible generation tokens reach progress consumers');
  assert(budget && budget.inputTokens > 0 && budget.contextTokens > 0);
  assert(budget.inputTokens + budget.reservedOutputTokens <= budget.contextTokens, 'Measured prompt and output reserve fit native context');
  if (trimmed) { assert(budget.removedTurns > 0); assert(budget.preflightCalls > 1); assert.equal(call.result.contextTruncated, true); }
}
await mkdir(output, { recursive: true });
let owner, visitor;
try {
  const gpu = await promisify(execFile)('nvidia-smi', ['--query-gpu=name,memory.free,memory.total', '--format=csv,noheader,nounits']);
  report.gpuBefore = gpu.stdout.trim();
  assert(gpu.stdout.trim().split('\n').some(line => Number(line.split(',')[1]) >= 2048), 'At least 2 GiB GPU memory free');
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport: { width: 1440, height: 1000 },
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native',
      '--disable-vulkan-surface', '--enable-dawn-features=vulkan_enable_f16_on_nvidia'] });
  const resource = { context }; owned.push(resource); owner = resource.page = await attach(context, 'owner');
  report.model = await bounded(owner.evaluate(async () => {
    const runtime = __cubechat.worldAgents.runtime;
    await runtime.setSharing(false); await runtime.setHostInference(false); await runtime.checkDeviceCapabilities();
    const saved = (await runtime.listStoredModels()).find(item => item.modelId === 'qwen3.5-0.8b-q4-k-m-gguf');
    if (!saved) throw Error('Qwen 0.8B is not cached at this owned origin');
    await runtime.loadStoredModel(saved.manifestCid, { signal: AbortSignal.timeout(180000) });
    const state = window.__contextAcceptance = { calls: [], failNext: false, unknownNext: false };
    const generate = runtime.generate.bind(runtime);
    runtime.generate = async (key, input) => {
      if (!key.startsWith('local:')) throw Error('Owned acceptance refuses peer inference');
      const call = { key, prompt: input.prompt, messages: input.messages, worldContext: input.worldContext, startedAt: Date.now(), progress: [] };
      state.calls.push(call);
      try {
        if (state.failNext || state.unknownNext) {
          const unknown = state.unknownNext; state.failNext = false; state.unknownNext = false;
          call.fixture = unknown ? 'Explicit committed unknown-outcome error' : 'Explicit one-shot settled inference failure';
          throw Object.assign(Error('Owned acceptance controlled failure'), unknown ? { committed: true } : {});
        }
        const result = await generate(key, { ...input, onProgress: event => { call.progress.push(structuredClone(event)); input.onProgress?.(event); } });
        call.result = result; return result;
      } catch (error) { call.error = { message: error.message, code: error.code, committed: error.committed }; throw error; }
      finally { call.finishedAt = Date.now(); }
    };
    state.key = runtime.listInferenceTargets().find(item => item.local && item.available && item.manifestCid === saved.manifestCid).key;
    return { saved, status: runtime.getServiceForModel(saved.manifestCid).getStatus(), key: state.key };
  }), 210000, 'Cached model load timeout');
  assert(report.model.status.evidence?.gpuOffload?.gpuLayers > 0, 'Actual managed GPU model loaded'); await save();
  await owner.evaluate(() => __cubechat.worldAgents.runtime.generate(__contextAcceptance.key,
    { prompt: 'Reply with exactly READY.', maxNewTokens: 16, temperature: 0 }));
  report.nativePreflight = (await calls(owner)).at(-1); validateBudget(report.nativePreflight);
  report.checks.push('Pinned native bounded one-token measurement reports actual prompt tokens without emitting probe content'); await save();
  await owner.evaluate(() => {
    const paragraph = 'The visitor observes a quiet garden with moss on the stones. The old bridge crosses a narrow stream. Nearby cubes can communicate and move through this shared world. A small lantern rests beside a wooden bench. ';
    const messages = [{ role: 'system', content: 'Follow the latest request. Answer concisely.' }];
    for (let i = 0; i < 9; i++) messages.push({ role: 'user', content: `Earlier observation ${i}: ` + paragraph.repeat(5) }, { role: 'assistant', content: `I noticed observation ${i}.` });
    messages.push({ role: 'user', content: 'New request: reply with exactly BLUEBIRD. The word BLUEBIRD is the only correct response.' });
    return __cubechat.worldAgents.runtime.generate(__contextAcceptance.key, { messages, maxNewTokens: 512, temperature: 0 });
  });
  report.longHistory = (await calls(owner)).at(-1); validateBudget(report.longHistory, { trimmed: true });
  assert.match(report.longHistory.result.text, /BLUEBIRD/); report.checks.push('Long native history trims oldest complete turns and preserves newest instruction'); await save();
  report.resident = await owner.evaluate(async () => {
    const resident = await __cubechat.worldAgents.spawn({ name: 'Context acceptance resident',
      goals: ['Answer the visitor concisely and follow explicit movement requests.'], localOnly: true, shared: true,
      initiateConversations: false, respondToWorldChat: false, movement: 'stationary' });
    return { head: resident, body: __cubechat.worldAgents.getStatus().bodies.find(item => item.agentId === resident.agentId) };
  });
  const id = report.resident.head.agentId, key = report.resident.body.key;
  report.turns = [];
  const paragraph = 'I explored the garden near the stone bridge. The water sounded quiet and a lantern stood beside the path. I noticed a visitor studying the sky and a cube waiting near the bench. Please remember that this is just my observation of the environment, and answer the final request briefly. ';
  for (let i = 0; i < 7; i++) {
    const text = `Observation number ${i + 1}. ` + paragraph.repeat(2) + (i === 6 ? 'Now follow me as I move, keeping a little distance.' : `Please acknowledge observation ${i + 1} in one sentence. Stay still.`);
    const result = await send(owner, key, text), current = await head(owner, id), call = (await calls(owner)).at(-1);
    report.turns.push({ text, result, head: current, call });
    assert(!result.error, result.error?.message); validateBudget(call); assert.notEqual(current.status, 'paused');
    assert.equal(call.messages.at(-1).content, text, 'Latest human input remains exact');
    await save();
  }
  assert(report.turns.some(turn => turn.call.result.contextTruncated), 'Real resident conversation exercises truncation');
  const latest = report.turns.at(-1).call.result.text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  report.latestIntent = JSON.parse(latest); assert.equal(report.latestIntent.intent?.type, 'follow');
  assert.equal(report.latestIntent.intent.targetId, JSON.parse(report.turns.at(-1).call.worldContext).senses.requesterId, 'Latest follow target is the exact observed requester');
  report.persisted = await owner.evaluate(async id => {
    const runtime = __cubechat.worldAgents.runtime, agents = await runtime.getAgentController();
    const memory = runtime.stateManager.getWorldMemoryStore((agents.store.name + '-episodes').slice(0, 80));
    return { events: await agents.events(id, { limit: 100 }), episodes: await memory.snapshot({ agentId: id,
      worldId: __cubechat.worldAgents.getStatus().worldId, includePrivate: true }) };
  }, id);
  for (const turn of report.turns) assert(report.persisted.events.some(event => event.type === 'request' && event.text === turn.text), 'Full original human turns remain in the durable journal');
  assert(report.persisted.episodes.some(episode => episode.text === report.turns[0].text), 'Prompt projection does not truncate durable memory');
  report.checks.push('Seven actual resident turns preserve latest follow intent, trim context, never pause, and retain original durable memories');
  report.fixedOverflow = await owner.evaluate(async id => {
    const agents = await __cubechat.worldAgents.runtime.getAgentController();
    const prompt = 'Current request: ' + 'Describe every distinct stone in the ancient garden carefully. '.repeat(400);
    if (new TextEncoder().encode(prompt).length > 65536) throw Error('Direct AgentRuntime overflow fixture exceeds its prompt byte budget');
    try { await agents.run(id, { prompt,
      conversationId: 'owned-fixed-overflow', task: 'text-generation', maxNewTokens: 512 }); return { unexpectedSuccess: true }; }
    catch (error) { return { code: error.code, message: error.message, head: await agents.get(id) }; }
  }, id);
  assert.equal(report.fixedOverflow.code, 'ERR_MODEL_CONTEXT_BUDGET'); assert.equal(report.fixedOverflow.head.status, 'waiting');
  report.afterOverflow = await send(owner, key, 'Stop following me. Stay still and reply briefly.');
  assert(!report.afterOverflow.error, report.afterOverflow.error?.message); validateBudget((await calls(owner)).at(-1));
  report.checks.push('Oversized current input is rejected before visible generation; next valid prompt succeeds'); await save();
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-webgpu', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const visitorContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const visitorResource = { browser, context: visitorContext }; owned.push(visitorResource); visitor = visitorResource.page = await attach(visitorContext, 'visitor');
  report.pair = await pair(owner, visitor);
  await visitor.waitForFunction(id => __cubechat.worldAgents.getStatus().bodies.some(body => body.agentId === id), id, { timeout: 45000 });
  const remoteKey = await visitor.evaluate(id => __cubechat.worldAgents.getStatus().bodies.find(body => body.agentId === id).key, id);
  report.failures = [];
  for (let i = 0; i < 3; i++) {
    await owner.evaluate(() => { __contextAcceptance.failNext = true; });
    const result = await send(owner, key, `Explicit independent controlled failure request ${i + 1}`), current = await head(owner, id);
    report.failures.push({ result, head: current }); assert(result.error); assert.equal(current.status, i < 2 ? 'waiting' : 'paused');
  }
  const countBeforeResume = (await calls(owner)).length;
  await visitor.waitForFunction(id => __cubechat.worldAgents.getStatus().bodies.find(body => body.agentId === id)?.status === 'paused', id, { timeout: 45000 });
  report.remoteTap = await tapCube(visitor, remoteKey);
  assert.equal(await visitor.getByRole('button', { name: 'Resume', exact: true }).count(), 0, 'Visitor has no Resume control');
  report.remoteDenied = await visitor.evaluate(async key => { try { await __cubechat.worldAgents.resume(key); return { resumed: true }; } catch (error) { return { error: error.message }; } }, remoteKey);
  assert.match(report.remoteDenied.error, /owner/i); assert.equal((await head(owner, id)).status, 'paused');
  await shot(visitor, 'visitor-paused-desktop');
  report.ownerTap = await tapCube(owner, key);
  const resume = owner.getByRole('button', { name: 'Resume', exact: true }); await resume.waitFor({ state: 'visible' });
  await shot(owner, 'owner-resume-desktop'); await owner.setViewportSize({ width: 390, height: 844 }); await shot(owner, 'owner-resume-mobile');
  await resume.click(); await owner.waitForFunction(async id => (await (await __cubechat.worldAgents.runtime.getAgentController()).get(id)).status === 'waiting', id);
  await owner.waitForTimeout(500); assert.equal((await calls(owner)).length, countBeforeResume, 'Resume never replays the failed request');
  report.checks.push('Three settled failures trip circuit; native owner Resume resets it, visitor cannot resume, no automatic replay');
  await owner.setViewportSize({ width: 1440, height: 1000 });
  report.resetFailures = [];
  for (let i = 0; i < 2; i++) {
    await owner.evaluate(() => { __contextAcceptance.failNext = true; });
    const result = await send(owner, key, `Explicit pre-success failure ${i + 1}`), current = await head(owner, id);
    report.resetFailures.push({ result, head: current }); assert(result.error); assert.equal(current.status, 'waiting');
  }
  const countBeforePeer = (await calls(owner)).length;
  await visitor.waitForFunction(id => __cubechat.worldAgents.getStatus().bodies.find(body => body.agentId === id)?.status !== 'paused', id, { timeout: 45000 });
  const input = await chat(visitor, remoteKey); await input.fill('Please reply briefly: are you ready to speak with this visitor?'); await input.press('Enter');
  await owner.waitForFunction(index => __contextAcceptance.calls[index]?.result || __contextAcceptance.calls[index]?.error, countBeforePeer, { timeout: 180000 });
  report.peerReply = (await calls(owner))[countBeforePeer]; validateBudget(report.peerReply);
  const peerText = JSON.parse(report.peerReply.result.text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '')).text;
  await visitor.getByText(peerText, { exact: true }).first().waitFor({ state: 'visible', timeout: 30000 });
  report.visitorChat = await visitor.locator('body').innerText();
  assert(!report.peerReply.fixture); report.checks.push('Fresh remote native-chat request receives actual managed Qwen inference after owner Resume');
  await owner.evaluate(() => { __contextAcceptance.failNext = true; }); await send(owner, key, 'Single controlled failure after successful reply');
  assert.equal((await head(owner, id)).status, 'waiting', 'Successful reply resets consecutive failure streak');
  await owner.evaluate(async id => (await __cubechat.worldAgents.runtime.getAgentController()).pause(id), id);
  report.manualPause = await head(owner, id); assert.equal(report.manualPause.status, 'paused');
  await visitor.evaluate(async key => { try { await __cubechat.worldAgents.resume(key); throw Error('Visitor unexpectedly resumed'); } catch (error) { if (!/owner/i.test(error.message)) throw error; } }, remoteKey);
  await owner.evaluate(key => __cubechat.worldAgents.resume(key), key);
  await owner.evaluate(() => { __contextAcceptance.unknownNext = true; }); report.unknownOutcome = await send(owner, key, 'Controlled committed-unknown request');
  assert.equal((await head(owner, id)).status, 'paused');
  report.unknownOwnerTap = await tapCube(owner, key);
  await owner.getByRole('button', { name: 'Resume', exact: true }).waitFor({ state: 'visible' });
  const unknownCallCount = (await calls(owner)).length; await owner.waitForTimeout(600);
  assert.equal((await calls(owner)).length, unknownCallCount, 'Unknown outcome is never automatically replayed');
  assert.equal(await visitor.getByRole('button', { name: /resume/i }).count(), 0);
  report.checks.push('Successful reply resets streak; deliberate owner pause and uncertain outcome remain protected');
  report.finalNetwork = await Promise.all([snapshot(owner), snapshot(visitor)]);
  assert(report.finalNetwork.some(state => state.connections.some(c => c.peerId === (state.peerId === report.pair.aId ? report.pair.bId : report.pair.aId)
    && (/noise/i.test(c.encryption) || (c.encryption === 'native' && c.address.includes('/webrtc'))))), 'Peer conversation uses authenticated encrypted connection');
  for (const logs of report.pages) { assert.deepEqual(logs.pageErrors, []); assert.deepEqual(logs.blockedDownloads, []); assert.deepEqual(logs.httpErrors.filter(e => e.url.startsWith(origin)), []); }
  report.passed = true;
} catch (error) { report.passed = false; report.error = { message: error.message, stack: error.stack }; process.exitCode = 1; }
finally {
  if (owner && !owner.isClosed()) try { report.calls = await calls(owner); } catch (error) { report.cleanupErrors.push('Evidence: ' + error.message); }
  for (const resource of owned.reverse()) {
    if (resource.page && !resource.page.isClosed()) await bounded(resource.page.evaluate(() => window.__cubechat?.destroy?.()), 30000, 'World cleanup timed out').catch(error => report.cleanupErrors.push(error.message));
    await resource.context.close().catch(error => report.cleanupErrors.push(error.message));
    await resource.browser?.close().catch(error => report.cleanupErrors.push(error.message));
  }
  if (report.cleanupErrors.length) { report.passed = false; process.exitCode = 1; }
  report.finishedAt = new Date().toISOString(); await save();
  console.log(JSON.stringify({ passed: report.passed, output, checks: report.checks, error: report.error, cleanupErrors: report.cleanupErrors }, null, 2));
}
