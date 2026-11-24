import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { createDemoBuildConfig } from '../demos/vite.config.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'demos/manifest.json'), 'utf8'));
const knownNames = manifest.demos.map((d) => d.name);
const knownSet = new Set(knownNames);

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const unknown = args.filter((name) => !knownSet.has(name));
if (unknown.length > 0) {
  console.error(`Unknown demo(s): ${unknown.join(', ')}. Known demos: ${knownNames.join(', ')}`);
  process.exit(1);
}

const targets = args.length > 0 ? args : knownNames;
const startedAt = Date.now();

for (const name of targets) {
  const demoStart = Date.now();
  console.log(`\n[build-demos] Building ${name} -> docs/${name}`);
  const config = createDemoBuildConfig(name, { command: 'build', mode: 'production' });
  await build(config);
  console.log(`[build-demos] Built ${name} in ${((Date.now() - demoStart) / 1000).toFixed(2)}s`);
}

console.log(`\n[build-demos] Built ${targets.length} demo(s) in ${((Date.now() - startedAt) / 1000).toFixed(2)}s`);
