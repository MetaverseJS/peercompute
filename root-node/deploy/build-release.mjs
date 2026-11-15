import { mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBrowserHost } from '../host/build.mjs';

// Run from an exported clean source revision. Never copy browser profiles,
// credentials, node_modules, user working-tree changes or runtime databases.
const output = process.argv[2];
if (!output?.startsWith('/')) throw new Error('Supply an absolute external release directory');
const root = fileURLToPath(new URL('../../', import.meta.url)), target = resolve(output);
if (target === root.slice(0, -1) || target.startsWith(root)) throw new Error('Release output must be outside the source tree');
await mkdir(target, { recursive: false });
await mkdir(join(target, 'root-node/host'), { recursive: true });
for (const file of ['BrowserHost.mjs', 'cli.mjs', 'config.mjs', 'profileLock.mjs', 'staticServer.mjs', 'evidenceDirectory.mjs']) {
  await cp(join(root, 'root-node/host', file), join(target, 'root-node/host', file));
}
const playwright = JSON.parse(await readFile(new URL('../../node_modules/playwright/package.json', import.meta.url), 'utf8'));
await writeFile(join(target, 'package.json'), JSON.stringify({ name: 'peercompute-root-registry', private: true, type: 'module',
  engines: { node: '>=24' }, dependencies: { playwright: playwright.version } }, null, 2));
await buildBrowserHost(join(target, 'browser'));
console.log(`Registry-only release: ${target}. Native companion/build tools excluded; use companion.enabled=false and --no-build.`);
