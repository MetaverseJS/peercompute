import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const browserRoot = fileURLToPath(new URL('../browser/', import.meta.url));

export async function buildBrowserHost(outDir) {
  await build({
    configFile: false, root: browserRoot, base: '/', publicDir: false,
    logLevel: 'warn', worker: { format: 'es' },
    build: { target: 'esnext', outDir: resolve(outDir), emptyOutDir: true },
  });
  return resolve(outDir);
}
