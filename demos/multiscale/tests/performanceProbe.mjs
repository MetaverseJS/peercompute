import { chromium } from 'playwright';

const TARGET_URL = process.env.MULTISCALE_PERF_URL
  || process.env.MULTISCALE_SMOKE_URL
  || 'https://localhost:5185/';
const CHROME_BIN = process.env.CHROME_BIN || '/bin/google-chrome';
const HEADLESS = process.env.HEADLESS !== '0';
const VIEWPORT_WIDTH = Number(process.env.VIEWPORT_WIDTH || 1440);
const VIEWPORT_HEIGHT = Number(process.env.VIEWPORT_HEIGHT || 960);
const PROBE_LAYER = process.env.MULTISCALE_PERF_LAYER || 'surface';
const PROBE_HUD = process.env.MULTISCALE_PERF_HUD || 'focus';
const WARMUP_MS = Math.max(0, Number(process.env.MULTISCALE_PERF_WARMUP_MS || 2500));
const DURATION_MS = Math.max(1000, Number(process.env.MULTISCALE_PERF_DURATION_MS || 6000));
const TARGET_FRAME_MS = 1000 / 60;

function summarizeSamples(samples = []) {
  const valid = samples
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0);
  const sorted = [...valid].sort((a, b) => a - b);
  const percentile = (p) => {
    if (sorted.length < 1) return 0;
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
    return sorted[index];
  };
  const sum = valid.reduce((total, value) => total + value, 0);
  const average = valid.length > 0 ? sum / valid.length : 0;
  const overBudgetCount = valid.filter((value) => value > TARGET_FRAME_MS).length;
  const over33msCount = valid.filter((value) => value > 33.333).length;
  const over50msCount = valid.filter((value) => value > 50).length;
  const over100msCount = valid.filter((value) => value > 100).length;
  return {
    sampleCount: valid.length,
    averageMs: Number(average.toFixed(3)),
    fpsAverage: average > 0 ? Number((1000 / average).toFixed(2)) : 0,
    minMs: sorted.length ? Number(sorted[0].toFixed(3)) : 0,
    p50Ms: Number(percentile(0.5).toFixed(3)),
    p95Ms: Number(percentile(0.95).toFixed(3)),
    p99Ms: Number(percentile(0.99).toFixed(3)),
    maxMs: sorted.length ? Number(sorted[sorted.length - 1].toFixed(3)) : 0,
    over60fpsBudgetCount: overBudgetCount,
    over60fpsBudgetFraction: valid.length ? Number((overBudgetCount / valid.length).toFixed(3)) : 0,
    over33msCount,
    over50msCount,
    over100msCount
  };
}

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME_BIN,
    headless: HEADLESS,
    args: [
      '--ignore-certificate-errors',
      '--enable-unsafe-webgpu',
      '--enable-unsafe-swiftshader',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });
  const page = await browser.newPage({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    ignoreHTTPSErrors: true
  });
  const consoleMessages = [];
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    consoleMessages.push(`pageerror: ${error.message}`);
  });

  try {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.__multiscaleDemo?.getState, null, { timeout: 60000 });
    await page.evaluate(({ layerId, hudMode }) => {
      window.__multiscaleDemo.setLayerById?.(layerId);
      window.__multiscaleDemo.setHudMode?.(hudMode);
    }, { layerId: PROBE_LAYER, hudMode: PROBE_HUD });
    await page.waitForFunction((layerId) => window.__multiscaleDemo.getState().layer.id === layerId, PROBE_LAYER, {
      timeout: 30000
    });
    await page.waitForTimeout(WARMUP_MS);

    const before = await page.evaluate(() => {
      const state = window.__multiscaleDemo.getState();
      return {
        layer: state.layer?.id,
        hud: state.hud,
        runtimeScaler: state.runtimeScaler,
        renderBudget: state.renderBudget,
        framePhaseTiming: state.framePhaseTiming,
        framePhaseTimingApi: window.__multiscaleDemo.getFramePhaseTiming?.(),
        solverLoad: state.solverLoad,
        solverRuntime: state.solverRuntime,
        compute: state.compute?.peercompute
      };
    });

    const frameSamples = await page.evaluate((durationMs) => new Promise((resolve) => {
      const samples = [];
      const startedAt = performance.now();
      let lastFrameAt = startedAt;
      function tick(now) {
        samples.push(now - lastFrameAt);
        lastFrameAt = now;
        if (now - startedAt >= durationMs) {
          resolve({
            startedAt,
            endedAt: now,
            durationMs: now - startedAt,
            samples
          });
          return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }), DURATION_MS);

    const after = await page.evaluate(() => {
      const state = window.__multiscaleDemo.getState();
      return {
        layer: state.layer?.id,
        hud: state.hud,
        runtimeScaler: state.runtimeScaler,
        renderBudget: state.renderBudget,
        framePhaseTiming: state.framePhaseTiming,
        framePhaseTimingApi: window.__multiscaleDemo.getFramePhaseTiming?.(),
        readbackBudget: state.readbackBudget,
        statePublicationBudget: state.statePublicationBudget,
        runtimeDiagnosticsBudget: state.runtimeDiagnosticsBudget,
        solverLoad: state.solverLoad,
        solverRuntime: state.solverRuntime,
        compute: state.compute?.peercompute
      };
    });

    const summary = {
      schema: 'peercompute.multiscale.performance-probe.v0',
      targetUrl: TARGET_URL,
      layerId: PROBE_LAYER,
      hudMode: PROBE_HUD,
      viewport: {
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT
      },
      warmupMs: WARMUP_MS,
      requestedDurationMs: DURATION_MS,
      measuredDurationMs: Number((frameSamples.durationMs || 0).toFixed(3)),
      raf: summarizeSamples(frameSamples.samples),
      before,
      after,
      consoleMessages
    };

    console.log(JSON.stringify(summary, null, 2));
    if (summary.raf.sampleCount < 1) {
      throw new Error(`Performance probe collected no frames: ${JSON.stringify(summary.raf)}`);
    }
    if (consoleMessages.some((message) => message.startsWith('pageerror:'))) {
      throw new Error(`Performance probe saw page errors: ${consoleMessages.join('\n')}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
