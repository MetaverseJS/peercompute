import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const clientPath = fileURLToPath(new URL('./pagesIsolation.js', import.meta.url));
const workerPath = fileURLToPath(new URL('./pagesIsolationWorker.js', import.meta.url));
const entryPath = '/@peercompute/pages-isolation-entry.js';
const virtualId = '\0peercompute:pages-isolation-entry';

/** Build-only wrapper: each demo gets its own worker and URL-directory scope. */
export function pagesIsolationPlugin() {
  let root, appEntry;
  return {
    name: 'peercompute-pages-isolation', apply: 'build',
    configResolved(config) { root = config.root; },
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
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'pages-isolation-sw.js',
        source: readFileSync(workerPath, 'utf8') });
    },
  };
}
