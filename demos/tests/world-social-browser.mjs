import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { chromium } from 'playwright';

// Run against an explicitly prepared production preview, never against a user's room.
// CUBE_SOCIAL_GO=1 CUBE_SOCIAL_ORIGIN=https://host:5196 node demos/tests/world-social-browser.mjs
// Optional actual cached-model qualification: CUBE_SOCIAL_REAL_MODEL=1 CUBE_SOCIAL_PROFILE=/owned/profile
// To repeat only that qualification, add CUBE_SOCIAL_PHASE=model.
// CUBE_SOCIAL_MODEL_PERSONA=sociable tests an owner-defined desire to meet people; silence remains a valid result.
// Inference fixtures are deliberately distinct from the optional real WebGPU phase.
assert.equal(process.env.CUBE_SOCIAL_GO, '1', 'Set CUBE_SOCIAL_GO=1 only after the production preview is ready');
const origin = process.env.CUBE_SOCIAL_ORIGIN ?? 'https://fastbox.tail5c077c.ts.net:5196';
assert.equal(new URL(origin).protocol, 'https:', 'Real-network acceptance requires the secure preview');
const output = process.env.CUBE_SOCIAL_OUT ?? join(homedir(), '.cache', 'peercompute-social-browser', String(Date.now()));
const room = `codex-social-${Date.now()}`, url = `${origin}/?e2e=1&room=${encodeURIComponent(room)}`;
const executablePath = process.env.CHROME_PATH ?? '/opt/google/chrome/chrome';
const phase = process.env.CUBE_SOCIAL_PHASE ?? 'all';
assert(['all', 'network', 'model'].includes(phase), 'CUBE_SOCIAL_PHASE must be all, network or model');
if (phase === 'model') assert.equal(process.env.CUBE_SOCIAL_REAL_MODEL,'1','Model-only qualification requires explicit CUBE_SOCIAL_REAL_MODEL=1');
const relay = '12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs';
const report = { startedAt: new Date().toISOString(), url, room,
  scope: 'Owned production browsers, real authenticated SecretWorkshop room delivery, native opt-in UI, persisted world memory. Network cases replace only language inference with an explicit deterministic fixture. Actual cached WebGPU qualification is separately opt-in.',
  pages: [], checks: [], screenshots: [], cleanupErrors: [] };
const resources = [];
const redact = value => String(value).replace(/(?:https?|wss?):\/\/[^\s"'<>]+/g, match => {
  try { const u = new URL(match); return u.origin + u.pathname; } catch { return '[URL]'; }
}).slice(0,2500);
const save = () => writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
async function bounded(promise, milliseconds, label) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(label)), milliseconds); })]); }
  finally { clearTimeout(timer); }
}
async function shot(page, label) {
  const path = join(output, `${label}.png`); await page.screenshot({ path, fullPage: true }); report.screenshots.push(path);
}
async function dialogsClosed(page) {
  for (let i = 0; i < 5 && await page.locator('dialog[open]').count(); i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(100); }
}
async function ready(page) {
  await page.waitForFunction(() => window.__cubechat?.roomChat?.started && __cubechat.worldAgents && __cubechat.worldUi, null, { timeout: 90000 });
  await bounded(page.evaluate(() => __cubechat.worldAgents.ready), 45000, 'Resident host readiness');
  if (await page.locator('#loading').isVisible()) await page.locator('#loading').click();
  await dialogsClosed(page);
  await page.evaluate(() => {
    const chat = __cubechat.roomChat;
    if (chat.__socialObserved) return; chat.__socialObserved = true;
    const state = window.__socialTransport = { messages: [], deliveries: [], streams: [] };
    const message = chat.onMessage, status = chat.onStatus, open = chat._open.bind(chat);
    chat.onMessage = value => { state.messages.push(structuredClone(value)); return message(value); };
    chat.onStatus = value => { state.deliveries.push(structuredClone(value)); return status(value); };
    chat._open = async (...args) => {
      const result = await open(...args), connection = result.connection;
      state.streams.push({ peerId: connection.remotePeer.toString(), encryption: connection.encryption,
        address: connection.remoteAddr.toString(), status: connection.status }); return result;
    };
  });
}
async function attachPage(context, label) {
  const record = { label, pageErrors: [], consoleErrors: [], warnings: [], failedRequests: [], httpErrors: [], blockedModelRequests: [] };
  report.pages.push(record);
  await context.addInitScript(() => {
    if (navigator.mediaDevices) Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true, value: async () => { throw new DOMException('Owned text-only acceptance check', 'NotAllowedError'); }
    });
  });
  await context.route('**/*', route => {
    const host = new URL(route.request().url()).hostname;
    if (host === 'huggingface.co' || host.endsWith('.hf.co') || host.endsWith('.huggingface.co')) {
      record.blockedModelRequests.push(redact(route.request().url())); return route.abort();
    }
    return route.continue();
  });
  const page = await context.newPage(); page.setDefaultTimeout(20000);
  page.on('pageerror', error => record.pageErrors.push(redact(error.message)));
  page.on('console', message => {
    if (message.type() === 'error') record.consoleErrors.push(redact(message.text()));
    if (message.type() === 'warning') record.warnings.push(redact(message.text()));
  });
  page.on('requestfailed', request => record.failedRequests.push({ url: redact(request.url()), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) record.httpErrors.push({ url: redact(response.url()), status: response.status() }); });
  assert.equal((await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })).status(), 200);
  await ready(page); return page;
}
async function ownedBrowser(label) {
  const browser = await chromium.launch({ executablePath, headless: true,
    args: ['--disable-webgpu', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const resource = { browser, context }; resources.push(resource);
  resource.page = await attachPage(context, label); return resource.page;
}
async function closeOwned(resource) {
  if (resource.closed) return; resource.closed = true;
  if (resource.page && !resource.page.isClosed()) {
    await bounded(resource.page.evaluate(() => window.__cubechat?.destroy?.()), 30000, 'Owned world cleanup exceeded 30 seconds')
      .catch(error => report.cleanupErrors.push(redact(error.message)));
  }
  await resource.context?.close().catch(error => report.cleanupErrors.push(redact(error.message)));
  await resource.browser?.close().catch(error => report.cleanupErrors.push(redact(error.message)));
}
const snapshot = page => page.evaluate(() => {
  const app = __cubechat, manager = app.network.node.getNetworkManager(), node = manager.getLibp2pNode();
  return { peerId: node.peerId.toString(), room: app.currentRoom, world: app.worldAgents.getStatus(),
    calls: window.__socialFixture?.calls ?? window.__actualSocialCalls ?? [], transport: window.__socialTransport,
    connections: node.getConnections().map(c => ({ peerId: c.remotePeer.toString(), address: c.remoteAddr.toString(), encryption: c.encryption })),
    known: [...manager.peers].map(([peerId, value]) => ({ peerId, gameId: value.gameId, roomId: value.roomId, topologyId: value.topologyId })) };
});
async function paired(a, b) {
  const aId = (await snapshot(a)).peerId, bId = (await snapshot(b)).peerId;
  for (const [page, id] of [[a, bId], [b, aId]]) await page.waitForFunction(id => {
    const app = __cubechat, manager = app.network.node.getNetworkManager(), peer = manager.peers.get(id);
    return peer && ['gameId', 'roomId', 'topologyId'].every(key => peer[key] === manager.config[key]) && app.remotePlayers.has(id);
  }, id, { timeout: 90000 });
  for (const page of [a,b]) assert((await snapshot(page)).connections.some(c => c.peerId === relay), 'Connected to the configured SecretWorkshop relay');
  return { aId, bId };
}
async function installFixture(page, label) {
  return page.evaluate(async label => {
    const runtime = __cubechat.worldAgents.runtime;
    await runtime.setSharing(false); await runtime.setHostInference(false);
    const serviceBefore = runtime.getServiceForModel.bind(runtime), manifestBefore = runtime.store.getManifest.bind(runtime.store);
    const candidate = { key: `local:owned-social-${label}`, manifestCid: `owned-social-${label}`, sessionId: `owned-session-${label}`,
      name: `Explicit owned language fixture ${label}`, local: true, available: true, task: 'text-generation', runtime: 'transformers.js', modalities: ['text'], outputModalities: ['text'] };
    const state = window.__socialFixture = { calls: [], modes: {}, candidate, defaultMode: 'speak' };
    const service = { getStatus: () => ({ ...candidate, status: 'ready' }) };
    runtime.listInferenceTargets = () => [{ ...candidate }];
    runtime.getServiceForModel = cid => cid === candidate.manifestCid ? service : serviceBefore(cid);
    runtime.store.getManifest = (cid, options) => cid === candidate.manifestCid ? Promise.resolve({ model: candidate }) : manifestBefore(cid, options);
    runtime.generate = async (key, input) => {
      if (key !== candidate.key) throw Error('Owned language fixture refuses unrelated inference');
      input.signal?.throwIfAborted();
      let world; try { world = JSON.parse(input.worldContext); } catch { world = {}; }
      const self = world.senses?.self, social = /"decision"\s*:\s*"speak"/.test(input.prompt ?? '')
        && /"decision"\s*:\s*"quiet"/.test(input.prompt ?? '');
      const mode = state.modes[self?.name] ?? state.defaultMode;
      const call = { index: state.calls.length, startedAt: Date.now(), key, agentId: self?.agentId, name: self?.name,
        social, incoming: social && input.prompt.includes('They said '), mode, prompt: input.prompt,
        messages: structuredClone(input.messages), worldContext: input.worldContext, conversationId: input.conversationId };
      state.calls.push(call);
      if (social && mode === 'hold') await new Promise(resolve => {
        let timer;
        const finish = () => { clearTimeout(timer); resolve(); };
        // Return text after abort to prove production code suppresses late results.
        input.signal.addEventListener('abort', () => { call.abortedAt = Date.now(); setTimeout(finish, 150); }, { once: true });
        timer = setTimeout(finish, 90000);
      });
      else await new Promise(resolve => setTimeout(resolve, 100));
      const text = social ? JSON.stringify(mode === 'quiet' ? { decision: 'quiet' } : {
        decision: 'speak', text: mode === 'hold' ? `LATE_SOCIAL_RESULT_${call.index}` : `${self.name} greeting ${call.index}: What do you notice about this world?`,
        intent: null, goal: 'Learn what the nearby participant enjoys about this world.'
      }) : JSON.stringify({ text: `HUMAN_PRIORITY_ACK_${call.index}: I am listening to your current question.`, intent: null });
      call.result = text; call.finishedAt = Date.now(); return { text, finishReason: 'stop' };
    };
    return candidate;
  }, label);
}
async function roster(page) {
  await dialogsClosed(page); await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  return page.getByRole('dialog', { name: 'Residents', exact: true });
}
async function spawn(page, name, { initiate = false, respond = false, instructions,
  goals = 'Meet a nearby participant and learn one thing about them.' } = {}) {
  const dialog = await roster(page), summary = dialog.locator('summary').filter({ hasText: 'Place a resident' });
  if (!await summary.evaluate(element => element.parentElement.open)) await summary.click();
  assert.equal(await dialog.getByRole('checkbox', { name: 'Initiate conversations', exact: true }).isChecked(), false, 'Initiative defaults off for every new resident');
  await dialog.getByRole('textbox', { name: 'Resident name', exact: true }).fill(name);
  await dialog.getByRole('textbox', { name: 'Resident goals', exact: true }).fill(goals);
  if (instructions) await dialog.getByRole('textbox', { name: 'Resident instructions', exact: true }).fill(instructions);
  await dialog.getByRole('checkbox', { name: 'Use only models on this device', exact: true }).check();
  await dialog.getByRole('checkbox', { name: 'Respond to world chat', exact: true }).setChecked(respond);
  await dialog.getByRole('checkbox', { name: 'Initiate conversations', exact: true }).setChecked(initiate);
  await dialog.getByRole('combobox', { name: 'Movement', exact: true }).selectOption('stationary');
  await dialog.getByRole('button', { name: 'Place resident', exact: true }).click();
  await page.waitForFunction(name => __cubechat.worldAgents.getStatus().bodies.some(b => b.local && b.name === name), name, { timeout: 30000 });
  await dialogsClosed(page);
  return page.evaluate(name => __cubechat.worldAgents.getStatus().bodies.find(b => b.local && b.name === name), name);
}
async function editFlags(page, body, flags) {
  const dialog = await roster(page);
  await dialog.getByRole('button', { name: `Edit ${body.name}`, exact: true }).click();
  const editor = page.getByRole('dialog', { name: 'Edit resident', exact: true });
  if ('initiate' in flags) await editor.getByRole('checkbox', { name: 'Initiate conversations', exact: true }).setChecked(flags.initiate);
  if ('respond' in flags) await editor.getByRole('checkbox', { name: 'Respond to world chat', exact: true }).setChecked(flags.respond);
  await editor.getByRole('button', { name: 'Save resident', exact: true }).click();
  await editor.waitFor({ state: 'hidden' }); await dialogsClosed(page);
}
async function place(page, body, x, z = 0) {
  await page.evaluate(({ key, x, z }) => {
    const layer = __cubechat.agentLayer, entry = layer.entries.get(key);
    layer.place(entry, [x, layer.groundHeight(x,z) + 3, z]);
  }, { key: body.key, x, z });
}
async function moveHuman(page, x, z = 0) {
  await page.evaluate(({ x,z }) => {
    const app = __cubechat, id = app.network.localPlayer.id, body = app.physics.getPlayerBody(id);
    body.position.set(x,3,z); body.velocity.set(0,0,0); body.previousPosition.copy(body.position); body.interpolatedPosition.copy(body.position);
    app.network.localPlayer.position = { x, y: 3, z };
  }, { x,z });
}
const modes = (page, values) => page.evaluate(values => Object.assign(__socialFixture.modes, values), values);
async function knownResident(page, body) {
  await page.waitForFunction(id => __cubechat.worldAgents.getStatus().bodies.some(b => b.agentId === id), body.agentId, { timeout: 45000 });
}
async function chat(page) {
  await dialogsClosed(page);
  const input = page.getByRole('textbox', { name: 'World message', exact: true });
  if (!await input.isVisible()) { await page.locator('#scene-container canvas').focus(); await page.keyboard.press('Enter'); await input.waitFor({ state: 'visible' }); }
  await page.getByRole('combobox', { name: 'Chat with', exact: true }).selectOption('room');
  await page.waitForFunction(() => __cubechat.worldUi.getTarget() === 'room' && !document.querySelector('textarea[aria-label="World message"]').disabled);
  return input;
}
async function sendHuman(page, text) {
  const input = await chat(page); await input.fill(text); await input.press('Enter');
  await page.waitForFunction(text => __socialTransport.messages.some(m => !m.agentId && m.text === text), text);
}
const memory = (page, agentId) => page.evaluate(async agentId => {
  const runtime = __cubechat.worldAgents.runtime, agents = await runtime.getAgentController(), worldId = __cubechat.worldAgents.getStatus().worldId;
  const store = runtime.stateManager.getWorldMemoryStore(`${agents.store.name}-episodes`.slice(0,80));
  return { head: await agents.get(agentId), episodes: await store.snapshot({ agentId, worldId, includePrivate: true }), events: await agents.events(agentId) };
}, agentId);
async function bounds(dialog) {
  const value = await dialog.evaluate(element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height,
    windowWidth: innerWidth, windowHeight: innerHeight, scrollWidth: document.documentElement.scrollWidth }; });
  assert(value.x >= -1 && value.y >= -1 && value.x + value.width <= value.windowWidth + 1
    && value.y + value.height <= value.windowHeight + 1 && value.scrollWidth <= value.windowWidth + 1, JSON.stringify(value));
  return value;
}
async function fixtureRoot(page, root, target, label, lifetime = 60000) {
  return page.evaluate(async ({ root, target, label, lifetime }) => {
    const startedAt = Date.now(), social = { rootId: crypto.randomUUID(), rootPeerId: root.ownerPeerId,
      rootAgentId: root.agentId, targetPeerId: target.ownerPeerId, targetAgentId: target.agentId, startedAt, expiresAt: startedAt + lifetime, turn: 0 };
    await __cubechat.roomChat.send({ agentId: root.agentId, name: root.name, text: `Explicit owned protocol fixture: ${label}`, social });
    return social;
  }, { root, target, label, lifetime });
}
async function waitHeld(page, previous) {
  await page.waitForFunction(previous => __socialFixture.calls.length > previous && __socialFixture.calls.at(-1).mode === 'hold', previous, { timeout: 20000 });
  return (await snapshot(page)).calls.at(-1);
}
async function deterministicNetwork() {
  console.log('Starting isolated production network browsers');
  const a = await ownedBrowser('Network owner A'), b = await ownedBrowser('Network owner B');
  report.pair = await paired(a,b); await installFixture(a,'A'); await installFixture(b,'B');
  console.log('Paired through SecretWorkshop',JSON.stringify(report.pair)); await save();
  await moveHuman(a,400); await moveHuman(b,-400);
  const beryl = await spawn(b,'Beryl', { respond: true }), celia = await spawn(b,'Celia unrelated', { respond: true });
  await place(b,beryl,15); await place(b,celia,40); await knownResident(a,beryl); await knownResident(a,celia);
  const quiet = await spawn(a,'Quiet observer', { initiate: true }); await modes(a, { 'Quiet observer': 'quiet' }); await place(a,quiet,0);
  console.log('Waiting for native quiet decision after production quiet/dwell interval');
  await a.waitForFunction(() => __socialFixture.calls.some(c => c.name === 'Quiet observer' && c.social && c.finishedAt), null, { timeout: 70000 });
  report.quiet = { state: await snapshot(a), memory: await memory(a,quiet.agentId) };
  assert(report.quiet.memory.episodes.some(e => e.kind === 'social-quiet'));
  assert(!report.quiet.state.transport.messages.some(m => m.agentId === quiet.agentId), 'Model chose quiet without a fabricated public greeting');
  await editFlags(a,quiet,{ initiate: false }); await place(a,quiet,500);
  report.checks.push('Native opt-in defaults false; a quiet model decision creates memory without public speech'); await save();
  console.log('PASS native quiet decision and durable private/public separation setup');

  const atlas = await spawn(a,'Atlas', { initiate: false }); await place(a,atlas,0); await knownResident(b,atlas);
  await a.evaluate(({ key }) => __cubechat.worldAgents.send({ key, text: 'PRIVATE_SENTINEL_SOCIAL: never put this private conversation into a public encounter.' }), { key: atlas.key });
  report.privateBefore = await memory(a,atlas.agentId);
  assert(JSON.stringify(report.privateBefore.episodes.filter(e => e.audience === 'private')).includes('PRIVATE_SENTINEL_SOCIAL'));
  await editFlags(a,atlas,{ initiate: true });
  await a.waitForFunction(id => __socialTransport.messages.some(m => m.agentId === id && m.social?.turn === 0), atlas.agentId, { timeout: 70000 });
  const root = (await snapshot(a)).transport.messages.find(m => m.agentId === atlas.agentId && m.social?.turn === 0);
  assert.equal(root.social.targetAgentId, beryl.agentId, 'Nearest resident is the selected encounter');
  for (const page of [a,b]) await page.waitForFunction(id => __socialTransport.messages.filter(m => m.social?.rootId === id).length >= 4, root.social.rootId, { timeout: 60000 });
  await a.waitForTimeout(11500);
  report.dialogue = { root, a: await snapshot(a), b: await snapshot(b) };
  for (const state of [report.dialogue.a,report.dialogue.b]) {
    const thread = state.transport.messages.filter(m => m.social?.rootId === root.social.rootId);
    assert.equal(thread.length,4,'One root has at most four total turns');
    assert.deepEqual(thread.map(m => m.social.turn).sort(),[0,1,2,3]); assert.equal(new Set(thread.map(m => m.id)).size,4);
    assert(thread.every(m => m.agentId === (m.social.turn % 2 ? beryl.agentId : atlas.agentId)));
    assert(thread.every(m => m.peerId === (m.social.turn % 2 ? report.pair.bId : report.pair.aId)), 'Authenticated owner identity is preserved');
    assert(!JSON.stringify(state.calls.filter(c => c.social)).includes('PRIVATE_SENTINEL_SOCIAL'));
    assert(!JSON.stringify(state.transport.messages).includes('PRIVATE_SENTINEL_SOCIAL'));
  }
  assert.equal(report.dialogue.b.calls.filter(c => c.agentId === celia.agentId).length,0,'Unrelated opted-in resident does not join a targeted thread');
  assert(report.dialogue.b.transport.streams.some(s => s.peerId === report.pair.aId && ['native','/noise'].includes(s.encryption)), 'Peer chat used authenticated encrypted transport');
  const beforeDuplicate = report.dialogue.b.calls.length;
  report.duplicate = await b.evaluate(id => __cubechat.worldAgents.receiveWorldMessage(__socialTransport.messages.find(m => m.social?.rootId === id && m.social.turn === 0)),root.social.rootId);
  await b.waitForTimeout(700); assert.equal((await snapshot(b)).calls.length,beforeDuplicate);
  await chat(a); await shot(a,'desktop-bounded-resident-dialogue');
  report.checks.push('Real cross-peer targeted greeting, alternating four-turn cap, private exclusion, unrelated resident isolation and replay deduplication'); await save();
  console.log('PASS targeted four-turn exchange; waiting for the same-pair conversation deadline before a separate case');

  await editFlags(a,atlas,{ initiate: false });
  // A completed same-pair encounter retains its budget until the original
  // deadline. A delayed competing root must never reopen that spent budget.
  await a.waitForTimeout(Math.max(0,root.social.expiresAt-Date.now()+300));
  await modes(b, { Beryl: 'hold' });
  let before = (await snapshot(b)).calls.length;
  const expiry = await fixtureRoot(a,atlas,beryl,'expiry',3500); const heldExpiry = await waitHeld(b,before);
  await b.waitForFunction(index => __socialFixture.calls[index].abortedAt && __socialFixture.calls[index].finishedAt, heldExpiry.index, { timeout: 12000 });
  await b.waitForTimeout(700);
  assert.equal((await snapshot(b)).transport.messages.filter(m => m.social?.rootId === expiry.rootId).length,1,'Expired reply never published');
  report.expiry = { social: expiry, call: (await snapshot(b)).calls[heldExpiry.index] };
  report.checks.push('An actual peer reply in flight is aborted at its root deadline; late text is not published');
  console.log('PASS in-flight expiry'); await save();

  await b.waitForTimeout(5500); before = (await snapshot(b)).calls.length;
  const off = await fixtureRoot(a,atlas,beryl,'opt-out cancellation',10000); const heldOff = await waitHeld(b,before);
  await editFlags(b,beryl,{ initiate: false, respond: false });
  const offState = await snapshot(b); assert(offState.calls[heldOff.index].abortedAt);
  assert.equal(offState.transport.messages.filter(m => m.social?.rootId === off.rootId).length,1,'Opt-out suppresses a late reply');
  report.optOut = { social: off, call: offState.calls[heldOff.index], body: offState.world.bodies.find(x => x.agentId === beryl.agentId) };
  report.checks.push('Native opt-out aborts pending peer inference and suppresses its late reply');
  console.log('PASS native opt-out; waiting for its retained root deadline'); await save();
  await editFlags(b,beryl,{ respond: true });
  // Opting out must not replenish an existing social budget. Wait for that
  // explicitly bounded fixture root to expire before testing a separate root.
  await b.waitForTimeout(Math.max(5500,off.expiresAt-Date.now()+300)); before = (await snapshot(b)).calls.length;
  const human = await fixtureRoot(a,atlas,beryl,'human priority'); const heldHuman = await waitHeld(b,before);
  await sendHuman(a,'HUMAN_PRIORITY: please answer my current question.');
  await b.waitForFunction(index => __socialFixture.calls[index].abortedAt && __socialTransport.messages.some(m => m.local && !m.social && m.text.startsWith('HUMAN_PRIORITY_ACK_')), heldHuman.index, { timeout: 30000 });
  const humanState = await snapshot(b);
  assert.equal(humanState.transport.messages.filter(m => m.social?.rootId === human.rootId).length,1);
  assert(!humanState.transport.messages.some(m => m.text.includes('LATE_SOCIAL_RESULT_')));
  report.humanPriority = { social: human, state: humanState };
  report.checks.push('A real human world message takes priority over pending social inference and suppresses late output');
  console.log('PASS human priority'); await save();

  await b.setViewportSize({ width:390, height:844 }); const mobileRoster = await roster(b);
  report.mobileRoster = await bounds(mobileRoster); await shot(b,'mobile-native-residents');
  await mobileRoster.getByRole('button',{ name:'Edit Beryl',exact:true }).click();
  report.mobileEditor = await bounds(b.getByRole('dialog',{ name:'Edit resident',exact:true })); await shot(b,'mobile-social-opt-in'); await dialogsClosed(b);
  report.beforeReload = await memory(a,atlas.agentId);
  assert(report.beforeReload.episodes.some(e => e.kind === 'encounter'));
  assert(report.beforeReload.episodes.some(e => e.kind === 'social-goal'));
  assert(report.beforeReload.episodes.some(e => e.kind === 'social-delivery' && e.outcome.includes('acknowledged')));
  await a.reload(); await ready(a); await knownResident(a,atlas);
  report.afterReload = await memory(a,atlas.agentId);
  for (const episode of report.beforeReload.episodes) assert(report.afterReload.episodes.some(e => JSON.stringify(e) === JSON.stringify(episode)), `Persisted episode ${episode.kind}`);
  assert.equal(report.afterReload.head.embodiments.find(e => e.worldId === report.dialogue.a.world.worldId).initiateConversations,false);
  report.checks.push('Desktop/mobile native UI fits; encounters, goals, receipts and private memories survive reload');
  for (const resource of resources) await closeOwned(resource);
}

async function actualCachedModel() {
  console.log('Checking current GPU memory before actual cached-model qualification');
  const profile = process.env.CUBE_SOCIAL_PROFILE;
  assert(profile && /owned[^/]*profile/.test(profile), 'Explicit owned cached profile path is required; never use a user profile');
  const gpu = await promisify(execFile)('nvidia-smi',['--query-gpu=name,memory.free,memory.total','--format=csv,noheader,nounits']);
  const gpuLines = gpu.stdout.trim().split('\n').map(line => line.split(',').map(value => value.trim()));
  const persona = process.env.CUBE_SOCIAL_MODEL_PERSONA ?? 'default';
  assert(['default','sociable'].includes(persona),'CUBE_SOCIAL_MODEL_PERSONA must be default or sociable');
  report.actual = { profile, persona, gpuBefore: gpuLines, scope:'Actual cached Qwen3.5 0.8B GGUF, real managed WebGPU inference; no inference facade, remote inference, or model download.' };
  assert(gpuLines.some(line => Number(line[1]) >= 2048),'At least 2 GiB GPU memory must be free before owned local qualification');
  const context = await chromium.launchPersistentContext(profile,{ executablePath, headless:true, viewport:{width:1440,height:1000},
    args:['--enable-gpu','--enable-unsafe-webgpu','--enable-features=Vulkan,VulkanFromANGLE','--use-angle=vulkan','--use-vulkan=native','--disable-vulkan-surface','--enable-dawn-features=vulkan_enable_f16_on_nvidia'] });
  const resource = { context, browser:context.browser() }; resources.push(resource);
  const cdp = await resource.browser.newBrowserCDPSession(); report.actual.gpu = (await cdp.send('SystemInfo.getInfo')).gpu;
  assert.match(report.actual.gpu.auxAttributes.glRenderer,/NVIDIA|AMD|Intel/);
  const page = resource.page = await attachPage(context,'Actual local Qwen qualification');
  report.actual.setup = await page.evaluate(async () => {
    const runtime = __cubechat.worldAgents.runtime; await runtime.setSharing(false); await runtime.setHostInference(false);
    const capabilities = await runtime.checkDeviceCapabilities(), stored = await runtime.listStoredModels();
    const model = stored.find(entry => entry.modelId === 'qwen3.5-0.8b-q4-k-m-gguf');
    if (!model) throw Error('Required Qwen3.5 0.8B is not cached in the explicitly owned profile at this origin');
    return { capabilities, model };
  });
  assert(report.actual.setup.capabilities.webgpu); await save();
  report.actual.loaded = await bounded(page.evaluate(async cid => {
    const runtime = __cubechat.worldAgents.runtime; await runtime.loadStoredModel(cid,{signal:AbortSignal.timeout(180000)});
    return { targets:runtime.listInferenceTargets(), status:runtime.getServiceForModel(cid).getStatus() };
  },report.actual.setup.model.manifestCid),190000,'Cached Qwen load deadline');
  assert(report.actual.loaded.status.evidence?.workerId,'Local model is managed by a compute worker');
  assert(report.actual.loaded.status.evidence?.gpuOffload?.gpuLayers > 0,'Native model layers were offloaded to WebGPU');
  assert(report.actual.loaded.status.evidence?.nativeBuffers?.some(buffer=>buffer.backend==='WebGPU'&&buffer.bytes>0),'Runtime allocated WebGPU model buffers');
  console.log('Actual cached Qwen loaded',report.actual.loaded.status.evidence.gpuOffload);
  await save();
  await page.evaluate(() => {
    const runtime = __cubechat.worldAgents.runtime, generate = runtime.generate.bind(runtime);
    window.__actualSocialCalls = [];
    runtime.generate = async (key,input) => {
      if (!key.startsWith('local:')) throw Error('Actual qualification refuses peer inference');
      const call = { key, startedAt:Date.now(), prompt:input.prompt, messages:input.messages, worldContext:input.worldContext };
      __actualSocialCalls.push(call);
      try { const result = await generate(key,input); call.result = result; call.finishedAt=Date.now(); return result; }
      catch (error) { call.error=error.message; throw error; }
    };
  });
  await moveHuman(page,25);
  const ownerDefinition = persona === 'sociable' ? {
    instructions:'You are Rowan, a sociable CubeChat resident. You enjoy welcoming unfamiliar visitors and learning what interests them. You are eager to introduce yourself when you notice someone new nearby. Be warm, curious and brief. Choose your own words and respect their space. You may remain quiet when that better fits the encounter.',
    goals:'Introduce yourself to an unfamiliar nearby visitor when appropriate.\nLearn what brings the visitor to this world.'
  } : {};
  report.actual.ownerDefinition=ownerDefinition;
  const body = await spawn(page,persona === 'sociable' ? 'Rowan introduction qualification' : 'Qwen social qualification',
    {initiate:true,...ownerDefinition}); await place(page,body,0);
  await page.waitForFunction(() => __actualSocialCalls.some(c => c.result || c.error),null,{timeout:180000});
  await page.waitForFunction(() => !__cubechat.worldAgents.getStatus().social?.active,null,{timeout:30000});
  report.actual.state = await snapshot(page); report.actual.memory = await memory(page,body.agentId);
  const call = report.actual.state.calls[0]; assert(!call.error,call.error);
  const raw=call.result.text.trim(),fenced=raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  report.actual.decision=JSON.parse(fenced?fenced[1]:raw);
  assert(['quiet','speak'].includes(report.actual.decision.decision),'Actual model returned the social decision contract');
  if(report.actual.decision.decision==='speak') {
    await page.waitForFunction(id=>__socialTransport.messages.some(m=>m.agentId===id&&m.social?.turn===0),body.agentId,{timeout:15000});
    report.actual.published=(await snapshot(page)).transport.messages.find(m=>m.agentId===body.agentId&&m.social?.turn===0);
    assert.equal(report.actual.published.text,report.actual.decision.text.trim());
    assert(report.actual.memory.episodes.some(episode=>episode.kind==='social-goal'),'A real spoken decision saves its social goal');
    assert(report.actual.memory.episodes.some(episode=>episode.kind==='composed-reply'&&episode.text===report.actual.published.text),'The generated greeting is remembered separately from delivery');
    assert(report.actual.memory.episodes.some(episode=>episode.kind==='social-delivery'&&episode.text===report.actual.published.text),'Actual publication outcome is remembered');
  } else assert(report.actual.memory.episodes.some(e=>e.kind==='social-quiet'));
  await chat(page); await shot(page,'actual-local-qwen-social-decision'); report.actual.passed=true;
  report.checks.push(`Actual cached Qwen chose ${report.actual.decision.decision} through managed WebGPU`);
  await closeOwned(resource);
}

await mkdir(output,{recursive:true});
try {
  if(phase!=='model') await deterministicNetwork();
  else report.network={skipped:true,reason:'Explicit model-only qualification'};
  if(phase!=='network'&&process.env.CUBE_SOCIAL_REAL_MODEL==='1') await actualCachedModel();
  else report.actual={skipped:true,reason:'CUBE_SOCIAL_REAL_MODEL=1 and an explicit owned cached profile were not provided'};
  for(const page of report.pages) {
    assert.deepEqual(page.pageErrors,[],`${page.label}: uncaught browser errors`);
    assert.deepEqual(page.blockedModelRequests,[],`${page.label}: no unexpected model downloads`);
    assert(!page.httpErrors.some(error=>error.url.startsWith(origin)),`${page.label}: production asset errors`);
  }
  report.passed=true;
} catch(error) {
  report.passed=false;report.error=redact(error.stack);report.failureSnapshots=[];
  for(const [index,resource] of resources.entries()) if(resource.page&&!resource.page.isClosed()) {
    try {report.failureSnapshots.push(await bounded(snapshot(resource.page),5000,'Failure snapshot deadline'));await shot(resource.page,`failure-${index}`);}
    catch(snapshotError) {report.failureSnapshots.push({error:redact(snapshotError.message)});}
  }
}
finally {
  for(const resource of resources) await closeOwned(resource);
  report.finishedAt=new Date().toISOString(); await save();
  console.log(JSON.stringify({passed:report.passed,output,checks:report.checks,error:report.error},null,2));
  if(!report.passed)process.exitCode=1;
}
