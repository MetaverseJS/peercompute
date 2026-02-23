#!/usr/bin/env node

import { loadPlaywright } from './playwright-loader.mjs';

const fail = (code, message) => {
  process.stderr.write(`${message}\n`);
  process.exit(code);
};

const main = async () => {
  let runtime;
  try {
    runtime = await loadPlaywright();
  } catch (err) {
    fail(41, `playwright module load failed: ${err?.message || err}`);
  }

  const chromium = runtime?.module?.chromium;
  if (!chromium || typeof chromium.launch !== 'function') {
    fail(42, 'playwright chromium launcher is unavailable');
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
  } catch (err) {
    fail(43, `playwright chromium launch failed: ${err?.message || err}`);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  process.stdout.write(JSON.stringify({
    ok: true,
    playwrightModule: runtime.resolvedSpecifier || null
  }) + '\n');
};

main().catch((err) => {
  fail(50, `runtime-check unexpected failure: ${err?.stack || err}`);
});

