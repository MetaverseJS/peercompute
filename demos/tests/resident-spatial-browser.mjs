import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import path from 'node:path';

// Explicitly owned production-browser acceptance. Actual routed language models,
// managed WebGPU neural motor and Cannon physics only; no fabricated responses,
// rewritten model outputs, dispatch scripting or HF downloads.
assert.equal(process.env.SPATIAL_GO, '1', 'Explicit test opt-in required');
const repo = process.cwd(), require = createRequire(path.join(repo, 'package.json'));
const { chromium } = require('playwright');
const output = process.env.SPATIAL_EVIDENCE, origin = process.env.SPATIAL_ORIGIN;
const provenance = JSON.parse(await readFile(process.env.SPATIAL_PROVENANCE, 'utf8'));
const scenario = process.env.SPATIAL_CASE ?? 'origin', localCid = process.env.SPATIAL_LOCAL_CID;
assert(['origin', 'requester', 'near', 'reload', 'cancel', 'unavailable', 'obstacle'].includes(scenario));
assert(output && path.isAbsolute(output)); assert.equal(new URL(origin).protocol, 'https:');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const [file, expected] of Object.entries(provenance.sourceFiles)) assert.equal(hash(await readFile(path.join(repo, file))), expected, file);
for (const [file, expected] of Object.entries(provenance.buildFiles)) {
  const response = await fetch(new URL(file, origin + '/')); assert(response.ok, file);
  assert.equal(hash(Buffer.from(await response.arrayBuffer())), expected, file);
}
await mkdir(output, { recursive: true });
const profile = process.env.SPATIAL_PROFILE ?? await mkdtemp(path.join(output, 'owned-spatial-profile-'));
assert(path.isAbsolute(profile) && path.basename(profile).startsWith('owned-'), 'Owned profile only');
const start = scenario === 'near' ? [-28, 3, 14] : [12, 3, -28];
const objective = scenario === 'near' ? 'Visit a nearby patch of open ground, then return to where you started.'
  : scenario === 'requester' ? 'Go far away, then come back to me.' : 'Go far away and then come back.';
const report = { startedAt: new Date().toISOString(), scenario, objective, start, origin, profile, provenance,
  scope: 'Actual model owner-chat task admission and model-authored plan; actual managed WebGPU motor and physical receipts. Setup positions/obstacles are test stimuli, never action outputs.',
  pageErrors: [], consoleErrors: [], downloads: [], checks: [], screenshots: [], cleanupErrors: [], captures: [] };
const save = () => writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const bounded = async (promise, ms, label) => {
  let timer; try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(label)), ms); })]); }
  finally { clearTimeout(timer); }
};
const gpu = await promisify(execFile)('nvidia-smi', ['--query-gpu=name,memory.free,memory.total', '--format=csv,noheader,nounits']);
report.gpuBefore = gpu.stdout.trim();
assert(gpu.stdout.trim().split('\n').some(row => Number(row.split(',')[1]) >= 1800), 'Need1.8GiB free for owned WebGPU checks');
let context, page, key;
const room = 'codex-spatial-' + Date.now();
const url = origin + '/?e2e=1&room=' + room + '&privacy=private&password=' + crypto.randomUUID();
async function ready() {
  await page.waitForFunction(() => window.__cubechat?.worldAgents && __cubechat.roomChat?.started, null, { timeout: 90000 });
  await bounded(page.evaluate(() => __cubechat.worldAgents.ready), 45000, 'World readiness');
  assert.equal(await page.evaluate(() => __cubechat.currentRoom.visibility), 'private');
  if (await page.locator('#loading').isVisible()) await page.locator('#loading').click();
  for (let i = 0; i < 6 && await page.locator('dialog[open]').count(); i++) await page.keyboard.press('Escape');
}
async function observer() {
  await page.evaluate(() => {
    const app = __cubechat, runtime = app.worldAgents.runtime, generate = runtime.generate.bind(runtime);
    const state = window.__spatial = { calls: [], outcomes: [], samples: [], keys: [] };
    runtime.generate = async (key, input) => {
      const call = { key, requestId: input.requestId, prompt: input.prompt, messages: input.messages, maxNewTokens: input.maxNewTokens, startedAt: Date.now() };
      state.calls.push(call);
      call.goals = await Promise.all(state.keys.map(key => app.worldAgents.getObjective(key)));
      try { const result = await generate(key, input); call.result = result; return result; }
      catch (error) { call.error = { message: error.message, code: error.code, committed: error.committed }; throw error; }
      finally { call.finishedAt = Date.now(); }
    };
    state.unsubscribe = app.agentLayer.subscribeOutcomes(event => state.outcomes.push(structuredClone(event)));
    state.timer = setInterval(() => {
      for (const key of state.keys) {
        const entry = app.agentLayer.entries.get(key); if (!entry) continue;
        state.samples.push({ key, at: Date.now(), position: entry.body.position.toArray(), status: app.agentLayer.getResidentMotorStatus(key) });
      }
      if (state.samples.length > 6000) state.samples.splice(0, state.samples.length - 6000);
    }, 200);
  });
}
async function capture(label) {
  const value = await page.evaluate(async key => ({ calls: __spatial.calls, outcomes: __spatial.outcomes, samples: __spatial.samples,
    goal: key ? await __cubechat.worldAgents.getObjective(key) : null, motor: __cubechat.agentLayer.getMotorStatus(),
    body: key ? __cubechat.agentLayer.getPosition(key) : null,
    network: __cubechat.worldAgents.runtime.getDiscoveryStatus(),
    connections: __cubechat.network.node.getNetworkManager().getLibp2pNode().getConnections().map(c => ({ peerId: c.remotePeer.toString(), encryption: c.encryption, address: c.remoteAddr.toString() })) }), key);
  report.captures.push({ label, at: Date.now(), ...value }); await save(); return value;
}
async function waitGoal(predicate, timeout = 420000) {
  const end = Date.now() + timeout; let last, checkpoint = 0;
  while (Date.now() < end) {
    last = await page.evaluate(key => __cubechat.worldAgents.getObjective(key), key);
    if (predicate(last)) return last;
    if (last == null && Date.now() > end - timeout + 15000 && !await page.getByRole('button', { name: 'Cancel', exact: true }).isVisible()) {
      const calls = await page.evaluate(() => __spatial.calls);
      if (calls.length && calls.every(call => call.finishedAt)) throw Error('Chat finished without admitting a persistent task');
    }
    if (Date.now() - checkpoint > 10000) {
      checkpoint = Date.now();
      const live = await capture('poll');
      console.log('Task:', last?.status ?? 'not admitted', 'calls:', live.calls.map(call => ({ kind: call.messages?.[0]?.content?.slice(0, 48), result: call.result?.text?.slice(0, 160), error: call.error?.message })));
    }
    if (last?.status === 'paused') throw Error('Task paused: ' + last.reason);
    await page.waitForTimeout(400);
  }
  throw Error('Task deadline: ' + JSON.stringify(last));
}
async function shot(name) {
  const file = path.join(output, name + '.png'); await page.screenshot({ path: file, fullPage: true }); report.screenshots.push(file);
}
async function send(text) {
  await page.evaluate(key => __cubechat.worldAgents.openConversation(key), key);
  await page.getByRole('textbox', { name: 'World message', exact: true }).fill(text);
  await page.getByRole('button', { name: 'Send', exact: true }).click();
}
const xz = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]);
try {
  context = await chromium.launchPersistentContext(profile, { executablePath: '/opt/google/chrome/chrome', headless: true,
    viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: false,
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan',
      '--use-vulkan=native', '--disable-vulkan-surface', '--enable-dawn-features=vulkan_enable_f16_on_nvidia'] });
  await context.route('**/*', route => {
    const hostname = new URL(route.request().url()).hostname;
    if (hostname === 'huggingface.co' || hostname.endsWith('.hf.co') || hostname.endsWith('.huggingface.co')) {
      report.downloads.push(route.request().url().split('?')[0]); return route.abort();
    }
    return route.continue();
  });
  page = await context.newPage(); page.setDefaultTimeout(20000);
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', event => { if (event.type() === 'error') report.consoleErrors.push(event.text().slice(0, 2000)); });
  const cdp = await context.newCDPSession(page); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await page.goto(url, { waitUntil: 'domcontentloaded' }); await ready();
  await page.evaluate(async () => {
    const host = __cubechat.worldAgents, agents = await host.runtime.getAgentController();
    for (const body of host.getStatus().bodies.filter(body => body.local)) await agents.pause(body.agentId);
    await host.runtime.setSharing(false); await host.runtime.setHostInference(false);
  });
  await observer();
  if (localCid && scenario !== 'unavailable') {
    report.localModel = await bounded(page.evaluate(async cid => {
      const runtime = __cubechat.worldAgents.runtime;
      if (!(await runtime.listStoredModels()).some(row => row.manifestCid === cid)) throw Error('Owned cached model absent');
      await runtime.checkDeviceCapabilities(); await runtime.loadStoredModel(cid, { signal: AbortSignal.timeout(180000) });
      return runtime.getServiceForModel(cid).getStatus();
    }, localCid), 190000, 'Owned model load');
    assert(report.localModel.evidence?.workerId);
  } else if (scenario !== 'unavailable') {
    const end = Date.now() + 120000;
    do {
      report.discovery = await page.evaluate(async () => {
        const agents = await __cubechat.worldAgents.runtime.getAgentController();
        return agents.inference.listCandidates({ mode: 'network-assisted', task: 'text-generation', refresh: true });
      });
      if (report.discovery.some(row => row.available && !row.local)) break;
      await page.waitForTimeout(1500);
    } while (Date.now() < end);
    assert(report.discovery.some(row => row.available && !row.local), 'A real peer text model must be available');
  }
  report.setup = await page.evaluate(async ({ start, localOnly }) => {
    const app = __cubechat, head = await app.worldAgents.spawn({ name: 'Mira',
      instructions: 'You are a helpful cube resident. Speak briefly and truthfully about the current world.',
      goals: ['Help the owner explore.'], localOnly, shared: true, movement: 'stationary', selfModifiable: false,
      initiateConversations: false, respondToWorldChat: false });
    const body = app.worldAgents.getStatus().bodies.find(body => body.agentId === head.agentId);
    app.agentLayer.place(app.agentLayer.entries.get(body.key), start);
    const human = app.physics.getPlayerBody(app.network.localPlayer.id), owner = [start[0] - 24, 3, start[2]];
    human.position.set(...owner); human.previousPosition.copy(human.position); human.interpolatedPosition.copy(human.position); human.velocity.set(0, 0, 0);
    app.network.localPlayer.position = { x: owner[0], y: owner[1], z: owner[2] }; __spatial.keys.push(body.key);
    return { head, body, owner };
  }, { start, localOnly: !!localCid || scenario === 'unavailable' });
  key = report.setup.body.key; await page.waitForTimeout(600);
  report.initial = await capture('before-chat');
  await send(objective); console.log('Submitted ordinary chat:', scenario);
  if (scenario === 'unavailable') {
    await page.waitForFunction(() => !__cubechat.worldAgents.getStatus().busy, null, { timeout: 30000 });
    await page.waitForTimeout(1500); const record = await capture('unavailable');
    assert(record.goal == null); assert.equal(record.outcomes.filter(r => r.type === 'move-to').length, 0);
    assert.equal(record.calls.length, 0); assert(xz(record.body, start) < 1); report.checks.push('No model: no goal fabricated or movement dispatched');
  } else {
    await waitGoal(goal => !!goal?.plan, 240000);
    const plan = await capture('plan'); assert.equal(plan.goal.objective, objective);
    assert(xz(plan.goal.originPosition, start) < .1);
    assert.equal(plan.goal.plan.milestones.length, 2, 'The actual model must preserve both requested legs');
    const outward = plan.goal.plan.milestones[0]; assert.equal(outward.type, 'move-to');
    const distance = xz(outward.position, plan.goal.originPosition);
    assert(scenario === 'near' ? distance >= 15 && distance <= 60 : distance >= 60, 'Model-selected distance satisfies owner wording');
    const back = plan.goal.plan.milestones[1];
    if (scenario === 'requester') assert.equal(back.targetRole, 'requester');
    else { assert.equal(back.type, 'move-to'); assert.deepEqual(back.position, plan.goal.originPosition); }
    report.checks.push('Ordinary chat admitted exact task; actual model selected grounded outward point and correct return semantics');
    if (scenario === 'requester') {
      report.movedOwner = [start[0], 3, start[2] + 45];
      await page.evaluate(position => {
        const app = __cubechat, human = app.physics.getPlayerBody(app.network.localPlayer.id);
        human.position.set(...position); human.velocity.set(0, 0, 0); human.previousPosition.copy(human.position); human.interpolatedPosition.copy(human.position);
        app.network.localPlayer.position = { x: position[0], y: position[1], z: position[2] };
      }, report.movedOwner);
    }
    if (scenario === 'obstacle') {
      // Put a real colliding wall across the chosen outward path, after model
      // planning. The destination remains free; no motor commands are supplied.
      report.obstacle = await page.evaluate(({ key, target }) => {
        const app = __cubechat, entry = app.agentLayer.entries.get(key), start = entry.body.position.toArray();
        const C = entry.body.constructor, shape = entry.body.shapes[0], Shape = shape.constructor, Vec = entry.body.position.constructor;
        const delta = [target[0] - start[0], target[2] - start[2]], angle = Math.atan2(delta[1], delta[0]);
        const wall = new C({ mass: 0 }); wall.addShape(new Shape(new Vec(2, 8, 12)));
        wall.position.set((target[0] + start[0]) / 2, 8, (target[2] + start[2]) / 2); wall.quaternion.setFromAxisAngle(new Vec(0, 1, 0), -angle);
        app.physics.world.addBody(wall); window.__spatial.wall = wall;
        return { position: wall.position.toArray(), angle, at: Date.now() };
      }, { key, target: outward.position });
    }
    if (scenario === 'cancel') {
      await waitGoal(goal => goal?.status === 'acting');
      await page.waitForFunction(({ key, start }) => {
        const position = __cubechat.agentLayer.getPosition(key), motor = __cubechat.agentLayer.getResidentMotorStatus(key);
        return motor?.worker === true && Math.hypot(position[0] - start[0], position[2] - start[2]) > 3;
      }, { key, start }, { timeout: 30000 });
      await page.getByRole('button', { name: 'Cancel task', exact: true }).click();
      await page.waitForFunction(async key => (await __cubechat.worldAgents.getObjective(key))?.status === 'cancelled', key);
      const cancelled = await capture('cancelled'); await page.waitForTimeout(2500); const after = await capture('after-cancel');
      assert.equal(after.goal.status, 'cancelled'); assert.equal(after.calls.length, cancelled.calls.length);
      assert(xz(after.body, cancelled.body) < 1); report.checks.push('Native chat Cancel stops physical work with no subsequent planner request');
    } else {
      if (scenario === 'reload') {
        await waitGoal(goal => goal?.completedMilestones?.length === 1);
        await page.getByRole('button', { name: 'Pause task', exact: true }).click();
        await page.waitForFunction(async key => (await __cubechat.worldAgents.getObjective(key))?.status === 'paused', key);
        const before = await capture('before-reload');
        await page.evaluate(() => __cubechat.worldAgents.dispose()); await page.reload(); await ready(); await observer();
        await page.evaluate(key => { __spatial.keys.push(key); }, key);
        const restored = await capture('restored'); assert.equal(restored.goal.status, 'paused');
        assert.deepEqual(restored.goal.originPosition, before.goal.originPosition); assert.deepEqual(restored.goal.plan, before.goal.plan);
        assert.deepEqual(restored.goal.completedMilestones, before.goal.completedMilestones);
        await page.waitForTimeout(2500); assert.equal((await capture('no-replay')).calls.length, 0);
        await page.evaluate(key => __cubechat.worldAgents.openConversation(key), key);
        if (localCid) await bounded(page.evaluate(async cid => {
          await __cubechat.worldAgents.runtime.checkDeviceCapabilities();
          await __cubechat.worldAgents.runtime.loadStoredModel(cid, { signal: AbortSignal.timeout(180000) });
        }, localCid), 190000, 'Reload owned cached model');
        await page.getByRole('button', { name: 'Resume task', exact: true }).click();
        await page.waitForFunction(async key => (await __cubechat.worldAgents.getObjective(key))?.status !== 'paused', key, { timeout: 15000 });
        report.checks.push('Reload retains origin and completed first leg; no automatic request replay before native owner Resume');
      }
      await waitGoal(goal => goal?.status === 'completed');
      const result = await capture('completed'), receipts = result.goal.completedMilestones.map(row => result.goal.receipts.find(receipt => receipt.requestId === row.requestId));
      assert.equal(receipts.length, 2); assert(receipts.every(row => row.status === 'arrived'));
      for (const receipt of receipts.filter(row => row.type === 'move-to')) {
        const raw = report.captures.flatMap(value => value.outcomes).find(row => row.requestId === receipt.requestId && row.status === 'arrived');
        assert(raw && Number.isFinite(raw.stopDistance), 'Actual motor receipt supplies its acknowledged arrival radius');
        assert.deepEqual(receipt.targetPosition, raw.targetPosition);
        assert(xz(receipt.position, receipt.targetPosition) <= raw.stopDistance);
      }
      assert(xz(result.body, scenario === 'requester' ? report.movedOwner : result.goal.originPosition) <= (scenario === 'requester' ? 13 : 8.1));
      assert(result.samples.some(row => row.status?.backend === 'webgpu' && row.status.worker === true && row.status.dispatches > 0), 'Actual managed WebGPU motor dispatch evidence');
      if (scenario === 'obstacle') {
        const wall = report.obstacle, crossed = result.samples.filter(row => row.at >= report.obstacle.at).map(row => {
          const dx = row.position[0] - wall.position[0], dz = row.position[2] - wall.position[2];
          return [dx * Math.cos(wall.angle) + dz * Math.sin(wall.angle), -dx * Math.sin(wall.angle) + dz * Math.cos(wall.angle)];
        }).filter(([x]) => Math.abs(x) < 8);
        assert(crossed.some(([, z]) => Math.abs(z) > 15), 'Measured neural trajectory passes around the physical wall');
      }
      report.checks.push('Both real physical arrivals verified, final body at requested return target, actual model assessment completed');
    }
    const records = report.captures.flatMap(value => value.calls), unique = [...new Map(records.map(call => [call.requestId, call])).values()];
    assert(unique.some(call => call.result && call.messages?.[0]?.content?.startsWith('Classify the owner')));
    assert(unique.some(call => call.result && call.messages?.[0]?.content?.includes('Current objective and world state')));
    for (const call of unique.filter(call => call.result)) {
      assert(call.result.text); assert.equal(call.result.contextTruncated, false);
      if (!localCid) { assert.equal(call.result.route?.local, false); assert(call.result.peerId); assert.match(call.result.protocol, /peercompute\/inference/); }
    }
  }
  await shot('spatial-desktop'); await page.setViewportSize({ width: 390, height: 844 }); await shot('spatial-mobile');
  assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.consoleErrors, []); assert.deepEqual(report.downloads, []);
  report.passed = true; console.log('PASS', report.checks);
} catch (error) {
  report.passed = false; report.failure = { message: error.message, stack: error.stack }; process.exitCode = 1;
  if (page) { await capture('failure').catch(() => {}); await shot('failure').catch(() => {}); }
  console.error(error.message);
} finally {
  if (page) await bounded(page.evaluate(async () => {
    clearInterval(window.__spatial?.timer); window.__spatial?.unsubscribe?.();
    if (window.__spatial?.wall) __cubechat.physics.world.removeBody(__spatial.wall);
    await window.__cubechat?.worldAgents?.dispose();
  }), 30000, 'Owned world disposal').catch(error => report.cleanupErrors.push(error.message));
  await context?.close().catch(error => report.cleanupErrors.push(error.message));
  if (report.cleanupErrors.length) { report.passed = false; process.exitCode = 1; }
  report.finishedAt = new Date().toISOString(); await save();
}
