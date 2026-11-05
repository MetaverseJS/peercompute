import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright } from '../../../net-chaos-lab/agent/playwright-loader.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const evidence = process.env.AGENT_LAYER_EVIDENCE_DIR || '/tmp/peercompute-agent-layer-summary';
await mkdir(evidence, { recursive: true });
const { module: { chromium } } = await loadPlaywright();
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 950, height: 1250 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/^https?:/, route => route.abort());
  await page.goto(pathToFileURL(path.join(directory, 'agent-layer-summary.html')).href);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const report = await page.evaluate(() => {
    const box = document.querySelector('.content').getBoundingClientRect();
    const overflow = [...document.querySelectorAll('.content *')].filter(element => {
      const r = element.getBoundingClientRect();
      return r.width && (r.left < box.left - 1 || r.right > box.right + 1 || r.bottom > box.bottom + 1);
    }).map(element => element.textContent.slice(0, 100));
    return { pages: document.querySelectorAll('.page').length, overflow,
      words: document.querySelector('.content').innerText.trim().split(/\s+/).length };
  });
  report.errors = errors;
  await writeFile(path.join(evidence, 'layout-report.json'), JSON.stringify(report, null, 2));
  if (report.pages !== 1 || report.overflow.length || errors.length) throw new Error(JSON.stringify(report));
  await page.locator('.page').screenshot({ path: path.join(evidence, 'summary.png') });
  await page.pdf({ path: path.join(directory, 'agentlayer.pdf'), preferCSSPageSize: true,
    printBackground: true, tagged: true, outline: true });
  console.log(JSON.stringify({ ok: true, ...report, evidence, pdf: path.join(directory, 'agentlayer.pdf') }));
} finally {
  await browser.close();
}
