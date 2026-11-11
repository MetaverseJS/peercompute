#!/usr/bin/env node
// Reconstruct the pinned companion on CPU. Optional --tensor-cache points to
// independently extracted <source tensor name>.bin files; their hashes remain
// mandatory. The checked recipe was qualified against llama.cpp46ca246 using:
// convert_hf_to_gguf.py <11-tensor source> --mmproj --outtype f16
//   --model-name 'Gemma4 12B Trevor Unified Companion' --outfile reference.gguf
import { open, link, unlink, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { GEMMA4_PROJECTOR_RECIPE as recipe } from '../peercompute/src/peercompute/artifacts/gemma4ProjectorRecipe.js';
import { createGemma4ProjectorSource } from '../peercompute/src/peercompute/artifacts/gemma4ProjectorSource.js';

const args = process.argv.slice(2), values = {};
for (let index = 0; index < args.length; index += 2) {
  if (!['--output', '--tensor-cache', '--reference'].includes(args[index]) || !args[index + 1]) {
    throw new Error('Usage: node scripts/derive-gemma4-projector.mjs --output FILE [--tensor-cache DIRECTORY] [--reference GGUF]');
  }
  values[args[index]] = args[index + 1];
}
if (!values['--output']) throw new Error('--output is required');
const output = resolve(values['--output']), temporary = `${output}.${process.pid}.partial`;
const controller = new AbortController();
process.once('SIGINT', () => controller.abort(new Error('Projector derivation interrupted')));
async function cachedFetch(url, { headers, signal }) {
  signal.throwIfAborted();
  if (url !== recipe.source.url) throw new Error('Unexpected recipe URL');
  const match = /^bytes=(\d+)-(\d+)$/.exec(headers.Range);
  const start = Number(match?.[1]), end = Number(match?.[2]), length = end - start + 1;
  const tensor = recipe.tensors.find((item) => start >= item.sourceOffset && end < item.sourceOffset + item.sourceBytes);
  if (!tensor || length < 1) throw new Error('Range does not belong to a recipe tensor');
  const file = await open(join(values['--tensor-cache'], `${tensor.sourceName}.bin`), 'r');
  try {
    const bytes = new Uint8Array(length);
    const { bytesRead } = await file.read(bytes, 0, length, start - tensor.sourceOffset);
    if (bytesRead !== length) throw new Error('Truncated tensor cache');
    return new Response(bytes, { status: 206, headers: {
      'Content-Range': `bytes ${start}-${end}/${recipe.source.size}`, 'Content-Length': String(length),
    } });
  } finally { await file.close(); }
}
let file, lastProgress = 0;
try {
  file = await open(temporary, 'wx');
  const hash = createHash('sha256'); let size = 0;
  for await (const bytes of createGemma4ProjectorSource({ signal: controller.signal,
    ...(values['--tensor-cache'] ? { fetchImpl: cachedFetch } : {}),
    onProgress(event) {
      if (Date.now() - lastProgress > 10000) {
        lastProgress = Date.now();
        process.stderr.write(`${event.stage}: ${event.sourceLoaded}/${event.sourceTotalBytes} source bytes, ${event.loaded}/${event.totalBytes} output bytes\n`);
      }
    },
  })) {
    for (let offset = 0; offset < bytes.length;) {
      const { bytesWritten } = await file.write(bytes, offset, bytes.length - offset);
      if (!bytesWritten) throw new Error('Output write made no progress');
      offset += bytesWritten;
    }
    hash.update(bytes); size += bytes.length;
  }
  await file.close(); file = null;
  const digest = hash.digest('hex');
  let referenceMatched;
  if (values['--reference']) {
    const reference = await readFile(values['--reference']);
    referenceMatched = reference.length === size && createHash('sha256').update(reference).digest('hex') === digest;
    if (!referenceMatched) throw new Error('Independent converter output does not match');
  }
  // Atomic create, refusing to overwrite an existing artifact.
  await link(temporary, output);
  console.log(JSON.stringify({ output, recipe: recipe.id, size, sha256: digest, referenceMatched }, null, 2));
} finally {
  await file?.close();
  await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
}
