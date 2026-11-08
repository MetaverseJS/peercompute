import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const clientPath = fileURLToPath(new URL('./pagesIsolation.js', import.meta.url));
const workerPath = fileURLToPath(new URL('./pagesIsolationWorker.js', import.meta.url));
const entryPath = '/@peercompute/pages-isolation-entry.js';
const virtualId = '\0peercompute:pages-isolation-entry';

/** Build-only wrapper: each demo gets its own worker and URL-directory scope. */
export function pagesIsolationPlugin({ appShell = null } = {}) {
  let root, publicDir, appEntry;
  return {
    name: 'peercompute-pages-isolation', apply: 'build',
    configResolved(config) { root = config.root; publicDir = config.publicDir; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        let count = 0;
        const result = html.replace(/<script\b([^>]*\btype\s*=\s*["']module["'][^>]*)>\s*<\/script>/gi,
          (tag, attributes) => {
            const match = attributes.match(/\bsrc\s*=\s*(["'])([^"']+)\1/i);
            if (!match) return tag;
            const source = match[2];
            if (/^(?:[a-z]+:|\/\/)/i.test(source)) return tag;
            count += 1;
            appEntry = source.startsWith('/') ? path.resolve(root, `.${source}`)
              : path.resolve(path.dirname(context.filename), source);
            return `<script type="module" src="${entryPath}"></script>`;
          });
        if (count !== 1) throw new Error('Pages isolation requires exactly one local module entry');
        return result;
      },
    },
    resolveId(id) { if (id === entryPath) return virtualId; },
    load(id) {
      if (id !== virtualId) return null;
      if (!appEntry) throw new Error('Pages isolation application entry is missing');
      return `import { startPagesDemo } from ${JSON.stringify(clientPath)};\n`
        + `void startPagesDemo(() => import(${JSON.stringify(appEntry)}));\n`;
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const worker = readFileSync(workerPath, 'utf8');
        let configuration = null;
        if (appShell) {
          const entries = new Map();
          const add = (name, source) => {
            if (!/^(?:index\.html|assets\/[\w.-]+\.(?:js|css)|manifest\.webmanifest|icons\/[\w.-]+\.(?:png|svg))$/.test(name)) {
              throw new Error(`Invalid app-shell file: ${name}`);
            }
            const bytes = Buffer.from(source);
            if (bytes.length > 8 * 1024 * 1024) throw new Error(`App-shell asset exceeds 8 MiB: ${name}`);
            entries.set(name, { path: name, bytes: bytes.length,
              sha256: createHash('sha256').update(bytes).digest('hex') });
          };
          for (const asset of Object.values(bundle)) {
            if (asset.fileName === 'index.html' || /^assets\/[\w.-]+\.(?:js|css)$/.test(asset.fileName)) {
              add(asset.fileName, asset.type === 'chunk' ? asset.code : asset.source);
            }
          }
          if (!entries.has('index.html')) throw new Error('App-shell HTML was not emitted');
          for (const name of appShell.publicFiles ?? []) {
            // Validate before resolving a path; only explicitly selected public files.
            if (!/^(?:manifest\.webmanifest|icons\/[\w.-]+\.(?:png|svg))$/.test(name)) throw new Error('Invalid public app-shell file');
            add(name, readFileSync(path.join(publicDir, name)));
          }
          const files = [...entries.values()].sort((a, b) => a.path.localeCompare(b.path));
          const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
          if (files.length > 128 || totalBytes > 16 * 1024 * 1024) throw new Error('App-shell cache exceeds its 128-file / 16 MiB budget');
          configuration = { version: createHash('sha256').update(worker).update(JSON.stringify(files)).digest('hex'), files };
        }
        this.emitFile({ type: 'asset', fileName: 'pages-isolation-sw.js',
          source: `const __PEERCOMPUTE_APP_SHELL__ = ${JSON.stringify(configuration)};\n${worker}` });
      },
    },
  };
}
