import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, link, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultDocsRoot = fileURLToPath(new URL('../docs/', import.meta.url));
const asyncify = /^ort-wasm-simd-threaded\.asyncify(?:-[A-Za-z0-9_-]+)?\.wasm$/;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const inside = (root, file) => {
  const relative = path.relative(root, file);
  return relative && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
};

async function publishImmutable(file, bytes) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, bytes, { flag: 'wx' });
    try { await link(temporary, file); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const previous = await readFile(file);
      if (previous.length !== bytes.length || digest(previous) !== digest(bytes)) {
        throw new Error(`Shared runtime asset collision: ${path.basename(file)}`);
      }
    }
  } finally { await rm(temporary, { force: true }); }
}

/** Full Pages builds share the two native ORT asyncify versions. Other assets
 * stay demo-local, including previous-release URLs retained by the release
 * process. Individual builds and preview builds are unchanged by default.
 * Vite's URL hook runs before chunk hashes are finalized, including workers;
 * this plugin never rewrites an emitted JavaScript file after hashing. */
export function pagesSharedRuntimePlugin({
  enabled = process.env.PEERCOMPUTE_PAGES_SHARED_RUNTIME === '1',
  docsRoot = defaultDocsRoot,
  publicBase = '/peercompute/',
  include = filename => asyncify.test(path.posix.basename(filename)),
} = {}) {
  if (!enabled) return null;
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(publicBase) || typeof include !== 'function') {
    throw new Error('Shared runtime assets require a same-origin directory base and selector');
  }
  const root = path.resolve(docsRoot), directory = path.join(root, 'assets', 'runtime');
  const shared = new Map();
  const select = filename => {
    if (!filename.endsWith('.wasm') || !include(filename)) return false;
    if (filename.includes('\\') || filename.split('/').some(part => !part || part === '.' || part === '..')
        || !/^[A-Za-z0-9_.-]+\.wasm$/.test(path.posix.basename(filename))) {
      throw new Error('Invalid shared runtime asset path');
    }
    return true;
  };
  const url = filename => `${publicBase}assets/runtime/${path.posix.basename(filename)}`;
  return {
    name: 'peercompute-pages-shared-runtime',
    apply: 'build',
    config(configuration) {
      const previous = configuration.experimental?.renderBuiltUrl;
      return { experimental: { renderBuiltUrl(filename, context) {
        if (context.type === 'asset' && !context.ssr && select(filename)) return url(filename);
        return previous?.(filename, context);
      } } };
    },
    configResolved(configuration) {
      const output = path.resolve(configuration.root, configuration.build.outDir);
      if (!inside(root, output) || output === directory || inside(directory, output)) {
        throw new Error('Shared runtime output must be a demo directory inside the Pages docs root');
      }
      if (configuration.build.ssr || configuration.build.manifest || configuration.build.ssrManifest) {
        throw new Error('Shared runtime assets support the static Pages demo build, without a Vite server manifest');
      }
    },
    buildStart() { shared.clear(); },
    generateBundle: {
      // Worker assets are added by Vite's normal generateBundle hook first.
      order: 'post',
      handler(_options, bundle) {
        for (const [filename, asset] of Object.entries(bundle)) {
          if (asset.type !== 'asset' || !select(filename)) continue;
          const name = path.posix.basename(filename), bytes = Buffer.from(asset.source);
          const previous = shared.get(name);
          if (previous && !previous.equals(bytes)) throw new Error(`Shared runtime asset collision: ${name}`);
          shared.set(name, bytes);
          delete bundle[filename];
        }
      },
    },
    async writeBundle() {
      for (const [name, bytes] of shared) await publishImmutable(path.join(directory, name), bytes);
    },
  };
}
