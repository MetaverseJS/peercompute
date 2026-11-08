import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const TARGET_URL = process.env.NETVIZ_SMOKE_URL || 'https://localhost:4173/netviz/?render=off';
const CHROME_BIN = process.env.CHROME_BIN || '/bin/google-chrome';
const HEADLESS = process.env.HEADLESS !== '0';

const session = {
  sessionId: 'multiscale-smoke-session',
  nodeId: 'browser-multiscale-demo',
  peerId: null,
  gameId: 'multiscale',
  roomId: 'multiscale',
  topologyId: 'multiscale-ladder',
  topologyType: 'distributed',
  isStarted: true,
  ts: Date.now(),
  metadata: {
    schema: 'peercompute.multiscale.netviz-session.v0',
    activeLayerId: 'molecular',
    computeBackend: 'webgpu-compute',
    solverCount: 14,
    workerCount: 4,
    targetWorkers: 8,
    dominantSolver: 'molecular-dynamics',
    dominantPressure: 0.42,
    runtimeDebug: {
      schema: 'peercompute.multiscale.runtime-debug.v0',
      manager: {
        workerCount: 4,
        targetWorkers: 8,
        minWorkers: 2,
        maxWorkers: 12,
        activeTasks: 1,
        queuedTasks: 2,
        currentLoad: 0.5,
        totalTasksSubmitted: 16,
        totalTasksCompleted: 14,
        totalTasksFailed: 0,
        averageTaskDurationMs: 12.5
      },
      taskFamilies: [
        {
          family: 'multiscale-ladder',
          submitted: 11,
          completed: 10,
          failed: 0,
          averageTaskDurationMs: 7.5
        },
        {
          family: 'molecular-dynamics',
          submitted: 5,
          completed: 4,
          failed: 0,
          averageTaskDurationMs: 21.25
        }
      ],
      topTaskFamilies: [
        {
          family: 'multiscale-ladder',
          submitted: 11,
          completed: 10,
          failed: 0,
          averageTaskDurationMs: 7.5
        },
        {
          family: 'molecular-dynamics',
          submitted: 5,
          completed: 4,
          failed: 0,
          averageTaskDurationMs: 21.25
        }
      ],
      solverLoad: {
        dominantSolver: 'molecular-dynamics',
        dominantPressure: 0.42,
        totalPressure: 1.25,
        pendingFamilies: 2
      },
      scaler: {
        enabled: true,
        lastAction: 'scale-up',
        pressure: 1.25,
        frameMsAvg: 28.4,
        lastRequestAction: 'grow-workers'
      },
      warmDeltas: {
        compute: 3,
        solver: 2,
        closure: 1,
        conservation: 1
      },
      solverQuality: {
        global: 0.75,
        targeted: {}
      }
    }
  }
};

const browser = await chromium.launch({
  headless: HEADLESS,
  executablePath: CHROME_BIN,
  args: ['--ignore-certificate-errors', '--allow-insecure-localhost']
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(30000);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#session-inspector-body');
  await page.evaluate((nextSession) => {
    const channel = new BroadcastChannel('peercompute-netviz-debug-v1');
    channel.postMessage({ type: 'session-upsert', session: nextSession });
    channel.close();
  }, session);
  await page.waitForFunction(() => {
    const text = document.querySelector('#session-inspector-body')?.textContent || '';
    return text.includes('multiscale-ladder')
      && text.includes('molecular-dynamics')
      && text.includes('Workers: 4/8')
      && text.includes('Warm deltas: compute 3');
  });

  const result = await page.evaluate(() => {
    const text = document.querySelector('#session-inspector-body')?.textContent || '';
    const status = window.__NETVIZ__?.getStatus?.() || {};
    const options = Array.from(document.querySelectorAll('#attach-session-select option'))
      .map((option) => ({ value: option.value, label: option.textContent }));
    return { text, status, options };
  });

  assert.match(result.text, /schema peercompute\.multiscale\.netviz-session\.v0/);
  assert.match(result.text, /Top families: multiscale-ladder 10\/11/);
  assert.match(result.text, /molecular-dynamics 4\/5/);
  assert.ok(
    result.options.some((option) => option.value === session.sessionId),
    'attach session option was not registered'
  );
  const discovered = result.status.attachSessions
    ?.find((entry) => entry.sessionId === session.sessionId);
  assert.ok(discovered, 'session was not visible through __NETVIZ__.getStatus()');
  assert.equal(discovered.metadata?.schema, 'peercompute.multiscale.netviz-session.v0');
  assert.equal(
    discovered.metadata?.runtimeDebug?.schema,
    'peercompute.multiscale.runtime-debug.v0'
  );

  console.log(JSON.stringify({
    url: TARGET_URL,
    sessionId: session.sessionId,
    panelText: result.text
  }, null, 2));
} finally {
  await browser.close();
}
