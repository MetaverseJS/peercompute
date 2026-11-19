import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

// Build the lazily imported wallpaper from the same pinned revision as the
// desktop. Keep MilkDrop's equations, shader translation and render passes.
export async function buildButterchurn({ root, source, patchPinned }) {
  const gpu = path.join(source, 'packages/exomux/butterchurn_gpu.ts');
  const original = await readFile(gpu, 'utf8');
  const transferStart = original.indexOf('    if (!copyOut) return;');
  const transferEnd = original.indexOf('  // ── uniforms and geometry', transferStart);
  if (transferStart < 0 || transferEnd < 0) throw new Error('Pinned GPU readback hook mismatch');
  const strideSetup = '    this.#readbackBytesPerRow = alignBytesPerRow(this.#width * 4);';
  const adapted = patchPinned(original, [
    ['    this.#resolveTexture = this.#createResolveTarget();\n' + strideSetup, '    this.#resolveTexture = this.#createResolveTarget();'],
    ['    this.#readback.destroy();\n' + strideSetup, '    this.#readback.destroy();'],
    ['  #readback: GPUBuffer;\n  #readbackBytesPerRow: number;', '  #readback: ButterchurnReadback;'],
    ['  #mapping = false;', ''],
    ['    this.#resolveToCells(encoder, !this.#mapping);', '    const slot = this.#resolveToCells(encoder);'],
    ['    if (!this.#mapping) this.#requestReadback();', `    void this.#readback.read(slot, pixels => {
      this.#latest = pixels;
      this.#readbacks += 1;
    });`],
    ['#resolveToCells(encoder: GPUCommandEncoder, copyOut: boolean): void {', '#resolveToCells(encoder: GPUCommandEncoder) {'],
    [original.slice(transferStart, transferEnd), '    return this.#readback.copy(encoder, this.#resolveTexture);\n  }\n\n'],
    [`  #createReadback(): GPUBuffer {
    return this.#device.createBuffer({
      size: this.#readbackBytesPerRow * this.#height,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
  }`, `  #createReadback() {
    return new ButterchurnReadback(this.#device, this.#width, this.#height);
  }`],
  ], 'Butterchurn GPU');
  await writeFile(gpu, 'import { ButterchurnReadback } from "gallery-readback";\n' + adapted);

  const field = path.join(source, 'packages/exomux/butterchurn_background.ts');
  await writeFile(field, patchPinned(await readFile(field, 'utf8'), [
    ['readonly #frameMs: number;', '#frameMs: number;'],
    ['const dt = elapsedMs / 1000;', `// Estimate the running display cadence for preset fps uniforms and stall detection.
    this.#frameMs += 0.1 * (clamp(elapsedMs, 1000 / 240, 250) - this.#frameMs);
    const dt = elapsedMs / 1000;`],
  ], 'Butterchurn timing'));
  const entry = path.join(source, 'examples/web/desktop_butterchurn.ts');
  await writeFile(entry, patchPinned(await readFile(entry, 'utf8'), [
    ['{ audio, autoCycle: true }', '{ audio, autoCycle: true, updateHz: 60 }'],
  ], 'Butterchurn factory'));
  await build({
    entryPoints: [entry], outfile: path.join(root, 'docs/assets/desktop-butterchurn.js'),
    format: 'esm', platform: 'browser', target: 'es2022', bundle: true, minify: true,
    banner: { js: '/*! Exotui Butterchurn and butterchurn-presets · Copyright (c) 2013–2018 Jordan Berg (presets), MIT. See exowebtui-LICENSE.txt. */' },
    alias: {
      'gallery-readback': path.join(root, 'demos/gallery/butterchurn-readback.js'),
      '@ubernaut/exotui/runtime': path.join(source, 'src/runtime/host.ts'),
      '@ubernaut/exotui': path.join(source, 'src/app/backgrounds/gpu_device.ts'),
    },
  });
}
