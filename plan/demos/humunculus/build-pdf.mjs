import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright } from '../../../net-chaos-lab/agent/playwright-loader.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = process.env.HUMUNCULUS_EVIDENCE_DIR || '/tmp/peercompute-humunculus-pdf';
await mkdir(evidenceDir, { recursive: true });
await import('./diagrams.mjs');
const { module: { chromium } } = await loadPlaywright();
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const errors = [];
try {
  const diagramErrors = [];
  const figurePage = await browser.newPage();
  for (const file of (await readdir(path.join(dir,'figures'))).filter(f=>f.endsWith('.svg'))) {
    await figurePage.goto(pathToFileURL(path.join(dir,'figures',file)).href);
    await figurePage.evaluate(() => document.fonts.ready);
    const problems = await figurePage.evaluate(() => [...document.querySelectorAll('[data-box]')].flatMap(g => {
      const r=g.querySelector('rect').getBBox();
      return [...g.querySelectorAll('text')].filter(t=>{const b=t.getBBox();return b.x<r.x+4 || b.x+b.width>r.x+r.width-4 || b.y<r.y+2 || b.y+b.height>r.y+r.height-2;}).map(t=>t.textContent);
    }));
    diagramErrors.push(...problems.map(text=>({file,text})));
  }
  await figurePage.close();
  const page = await browser.newPage({ viewport: { width: 1100, height: 1300 }, deviceScaleFactor: 1.25 });
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/^https?:/, route => route.abort());
  await page.goto(pathToFileURL(path.join(dir, 'humunculus.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  const report = await page.evaluate(() => {
    const pages = [...document.querySelectorAll('.page')];
    return { pages: pages.map((p,i) => {
      const body = p.querySelector('.content');
      const r = body.getBoundingClientRect();
      const children = [...body.querySelectorAll('*')].filter(e => !['SCRIPT','STYLE'].includes(e.tagName));
      const overflow = children.filter(e => { const a=e.getBoundingClientRect(); return a.width && (a.bottom > r.bottom + 1 || a.right > r.right + 1 || a.left < r.left - 1); }).map(e=>({tag:e.tagName,text:e.textContent.slice(0,90)}));
      return { number:i+1, title:p.dataset.title, overflow, textLength:body.innerText.length };
    }), figures:document.images.length, links:[...document.querySelectorAll('a[href]')].length,
      brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash) };
  });
  report.errors = errors;
  report.diagramErrors = diagramErrors;
  await writeFile(path.join(evidenceDir,'layout-report.json'), JSON.stringify(report,null,2));
  const bad=report.pages.filter(p=>p.overflow.length || p.textLength<100);
  if (bad.length || errors.length || report.brokenAnchors.length || diagramErrors.length) throw new Error(`Document validation failed: ${JSON.stringify({bad,errors,diagramErrors,brokenAnchors:report.brokenAnchors})}`);
  for (let i=0;i<report.pages.length;i++) await page.locator('.page').nth(i).screenshot({path:path.join(evidenceDir,`page-${String(i+1).padStart(2,'0')}.png`)});
  await page.pdf({path:path.join(dir,'humunculus.pdf'), preferCSSPageSize:true, printBackground:true, tagged:true, outline:true});
  console.log(JSON.stringify({ok:true,pages:report.pages.length,figures:report.figures,links:report.links,pdf:path.join(dir,'humunculus.pdf'),evidenceDir}));
} finally { await browser.close(); }
