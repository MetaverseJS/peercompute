import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const peercomputeRoot = path.join(repoRoot, 'peercompute');
const demosRoot = path.join(repoRoot, 'demos');

const NON_INFERENCE_DEMOS = [
  'daddygo',
  'eshkols-in-space',
  'fano-reactor',
  'hyperborea',
  'motorcycle',
  'multiscale',
  'netviz',
  'planetgen',
  'schrodinger',
  'sneakywoods',
  'universes',
  'webgpuphys',
  'wxglobe'
];

const JS_EXT = /\.(?:js|mjs|cjs|ts)$/i;
const IMPORT_PATTERNS = [
  /\bfrom\s*(["'])([^"']+)\1/g,
  /\bimport\s*(["'])([^"']+)\1/g,
  /\bimport\s*\(\s*(["'])([^"']+)\1/g,
  /\brequire\s*\(\s*(["'])([^"']+)\1/g
];

function walkFiles(dir, { excludeDirs = new Set(['node_modules', 'dist', 'build', 'docs', 'public', 'plan', 'tests']) } = {}) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (excludeDirs.has(entry.name)) continue;
      results.push(...walkFiles(path.join(dir, entry.name), { excludeDirs }));
    } else if (entry.isFile() && JS_EXT.test(entry.name)) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

function extractSpecifiers(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const specs = [];
  for (const re of IMPORT_PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(source)) !== null) {
      specs.push(match[2]);
    }
  }
  return specs;
}

test('peercompute/src and peercompute/tests have ZERO reverse imports into demos/', () => {
  const files = [
    ...walkFiles(path.join(peercomputeRoot, 'src'), { excludeDirs: new Set(['node_modules', 'dist']) }),
    ...walkFiles(path.join(peercomputeRoot, 'tests'), { excludeDirs: new Set(['node_modules', 'dist']) })
  ];
  assert.ok(files.length >= 100, `expected to scan peercompute source & test files, got ${files.length}`);

  const violations = [];
  for (const file of files) {
    for (const spec of extractSpecifiers(file)) {
      if (/(?:^|\/)demos(?:\/|$)/.test(spec)) {
        violations.push({ file: path.relative(repoRoot, file), spec });
      }
    }
  }
  assert.deepEqual(
    violations,
    [],
    `peercompute/ must never import from demos/; found: ${JSON.stringify(violations, null, 2)}`
  );
});

test('non-inference demos import only slim core entrypoints and never pull inference or ORT/Wllama WASM', () => {
  const forbidden = [
    /^@peercompute$/,
    /^peercompute$/,
    /^peercompute\/inference$/,
    /^@peercompute-inference(?:\/|$)/,
    /onnxruntime-web/,
    /peercompute-diffusion-ort/,
    /@huggingface\/transformers/,
    /@wllama\/wllama/,
    /@kaminos\/webgpu-inference-kit/,
    /(?:^|\/)demos\/inference(?:\/|$)/,
    /src\/peercompute\/(?:index\.js|inference(?:\/|$))/
  ];

  const violations = [];
  for (const demo of NON_INFERENCE_DEMOS) {
    const demoDir = path.join(demosRoot, demo);
    const files = walkFiles(demoDir);
    for (const file of files) {
      if (path.basename(file).startsWith('vite.config.')) continue;
      for (const spec of extractSpecifiers(file)) {
        if (forbidden.some((re) => re.test(spec))) {
          violations.push({ demo, file: path.relative(repoRoot, file), spec });
        }
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `non-inference demos must import peercompute/core (or @peercompute/core / @peercompute/gpu-hub / @peercompute/geo-core), never full @peercompute or inference packages: ${JSON.stringify(violations, null, 2)}`
  );
});
