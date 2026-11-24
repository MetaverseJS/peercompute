import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'demos/manifest.json'), 'utf8'));
const known = new Set(manifest.demos.map((d) => d.name));

const [demoName, ...rest] = process.argv.slice(2);
if (demoName && !demoName.startsWith('-') && !known.has(demoName)) {
  console.error(`Unknown demo "${demoName}". Known demos: ${[...known].join(', ')}`);
  process.exit(1);
}

const extraArgs = demoName && !demoName.startsWith('-') ? rest : [demoName, ...rest].filter(Boolean);
const port = process.env.DEMOS_PORT || String(manifest.devPort || 5173);
const demoRoute = demoName && !demoName.startsWith('-') ? `/${demoName}/` : '/';

console.log(`[dev-demos] Unified PeerCompute demo server (HTTPS):`);
console.log(`  Gallery: https://localhost:${port}/`);
if (demoRoute !== '/') {
  console.log(`  Demo:    https://localhost:${port}${demoRoute}`);
}

const viteBin = path.join(repoRoot, 'node_modules/.bin/vite');
const child = spawn(viteBin, ['--config', path.join(repoRoot, 'demos/vite.config.js'), '--host', ...extraArgs], {
  cwd: repoRoot,
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
