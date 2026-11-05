import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright } from '../../../net-chaos-lab/agent/playwright-loader.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const evidence = process.env.AGENT_LAYER_EVIDENCE_DIR || '/tmp/peercompute-agent-layer-summary';
await mkdir(evidence, { recursive: true });
await import('./agent-layer-diagrams.mjs');
const { module: { chromium } } = await loadPlaywright();
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
try {
  const diagramErrors = [];
  const figurePage = await browser.newPage();
  for (const file of (await readdir(path.join(directory, 'figures'))).filter(name => name.endsWith('.svg'))) {
    await figurePage.goto(pathToFileURL(path.join(directory, 'figures', file)).href);
    await figurePage.evaluate(() => document.fonts.ready);
    const errors = await figurePage.evaluate(() => [...document.querySelectorAll('[data-box]')].flatMap(group => {
      const box = group.querySelector('rect').getBBox();
      return [...group.querySelectorAll('text')].filter(element => {
        const r = element.getBBox();
        return r.x < box.x + 4 || r.x + r.width > box.x + box.width - 4
          || r.y < box.y + 4 || r.y + r.height > box.y + box.height - 4;
      }).map(element => element.textContent);
    }));
    diagramErrors.push(...errors.map(label => ({ file, label })));
  }
  await figurePage.close();
  const page = await browser.newPage({ viewport: { width: 950, height: 1250 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/^https?:/, route => route.abort());
  await page.goto(pathToFileURL(path.join(directory, 'agent-layer-summary.html')).href);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  const report = await page.evaluate(() => {
    const box = document.querySelector('.content').getBoundingClientRect();
    const overflow = [...document.querySelectorAll('.content *')].filter(element => {
      const r = element.getBoundingClientRect();
      return r.width && (r.left < box.left - 1 || r.right > box.right + 1 || r.bottom > box.bottom + 1);
    }).map(element => element.textContent.slice(0, 100));
    return { pages: document.querySelectorAll('.page').length, figures: document.images.length, overflow,
      words: document.querySelector('.content').innerText.trim().split(/\s+/).length };
  });
  report.errors = errors;
  report.diagramErrors = diagramErrors;
  await writeFile(path.join(evidence, 'layout-report.json'), JSON.stringify(report, null, 2));
  if (report.pages !== 1 || report.figures !== 2 || report.overflow.length || errors.length || diagramErrors.length) throw new Error(JSON.stringify(report));
  await page.locator('.page').screenshot({ path: path.join(evidence, 'summary.png') });
  await page.pdf({ path: path.join(directory, 'agentlayer.pdf'), preferCSSPageSize: true,
    printBackground: true, tagged: true, outline: true });
  console.log(JSON.stringify({ ok: true, ...report, evidence, pdf: path.join(directory, 'agentlayer.pdf') }));
} finally {
  await browser.close();
}
