import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

// ExoWebTUI's desktop application seam lives in examples/ in the source distribution.
const revision = '8637fcc39d19959550ca179fe91c258766c2fa62';
const root = fileURLToPath(new URL('../', import.meta.url));
const checkout = process.env.EXOTUI_DIR || path.resolve(root, '../exotui');
const source = await mkdtemp(path.join(tmpdir(), 'peercompute-gallery-'));
try {
  const object = execFileSync('git', ['-C', checkout, 'rev-parse', '--verify', `${revision}^{commit}`], { encoding: 'utf8' }).trim();
  if (object !== revision) throw new Error(`The Exotui checkout must contain ${revision}.`);
  // Build the pinned tree even if someone is actively working in the sibling checkout.
  const archive = path.join(source, 'exotui.tar');
  execFileSync('git', ['-C', checkout, 'archive', `--output=${archive}`, revision, 'src', 'app', 'examples/web', 'packages/exomux/audio.ts', 'docs/assets/desktop-butterchurn.js', 'LICENSE.md']);
  execFileSync('tar', ['-xf', archive, '-C', source]);
  // The pinned demo desktop exposes only openWindow. Bridge its native
  // controller for iframe lifetime and focus without trying to infer a close
  // from the visible projection (which also omits minimized windows).
  const desktop = path.join(source, 'examples/web/desktop_app.ts');
  const upstream = await readFile(desktop, 'utf8');
  await writeFile(desktop, upstream + `
export const desktopWindowStates = () => windowHost.controller.inspect().windows;
export const focusDesktopWindow = id => windowHost.execute({ kind: "focus", id }, bodyBounds(), projectionOptions());
export const closeDesktopWindow = id => windowHost.execute({ kind: "close", id }, bodyBounds(), projectionOptions());
`);
  // Add a pre-upload hook to the pinned presenter. All shader code, pass
  // ordering, uniforms, render targets and the display clock stay upstream.
  const shaderPath = path.join(source, 'src/web/canvas_shader.ts');
  let shader = await readFile(shaderPath, 'utf8');
  for (const [before, after] of [
    ['  list(): readonly CanvasShaderDefinition[];', `  setSourceComposer(composer: ((source: HTMLCanvasElement) => HTMLCanvasElement) | null): void;
  isPresenting(): boolean;
  list(): readonly CanvasShaderDefinition[];`],
    ['  let raf = 0;', `  let composeSource: ((source: HTMLCanvasElement) => HTMLCanvasElement) | null = null;
  let presented = false;
  let raf = 0;`],
    ['    raf = 0;', '    raf = 0;\n    presented = false;'],
    ['context.UNSIGNED_BYTE, source);', 'context.UNSIGNED_BYTE, composeSource?.(source) ?? source);'],
    ['      // A zero-sized canvas mid-resize;', '      presented = false;\n      // A zero-sized canvas mid-resize;'],
    ['    raf = requestAnimationFrame(frame);\n  };', '    presented = true;\n    raf = requestAnimationFrame(frame);\n  };'],
    ['    list: () => CANVAS_SHADERS,', `    setSourceComposer(composer) { composeSource = composer; },
    isPresenting: () => presented && !!gl && !gl.isContextLost(),
    list: () => CANVAS_SHADERS,`],
  ]) {
    if (shader.split(before).length !== 2) throw new Error(`Pinned shader hook mismatch: ${before}`);
    shader = shader.replace(before, after);
  }
  await writeFile(shaderPath, shader);
  const three = fileURLToPath(import.meta.resolve('three'));
  const license = [
    `ExoWebTUI · https://github.com/ubernaut/exotui/tree/${revision}`,
    await readFile(path.join(source, 'LICENSE.md'), 'utf8'),
    'Three.js · https://github.com/mrdoob/three.js',
    await readFile(path.resolve(path.dirname(three), '../LICENSE'), 'utf8'),
  ];
  await build({
    absWorkingDir: root,
    entryPoints: ['demos/gallery/desktop.js'],
    outfile: 'docs/assets/exowebtui.js',
    format: 'esm', platform: 'browser', target: 'es2022', bundle: true, minify: true,
    alias: {
      'exowebtui-desktop': desktop,
      'exowebtui-glyphs': path.join(source, 'src/content/ascii_fonts.ts'),
      'exowebtui-audio': path.join(source, 'examples/web/browser_audio_source.ts'),
      'exowebtui-clipboard': path.join(source, 'examples/web/browser_clipboard.ts'),
      '@ubernaut/exotui/runtime': path.join(source, 'src/runtime/host.ts'),
      'exowebtui-presenter': path.join(source, 'src/web/web_presenter.ts'),
      three,
    },
    banner: { js: `/*! Built from Exotui ${revision}. See exowebtui-LICENSE.txt. */` },
  });
  await copyFile(path.join(source, 'docs/assets/desktop-butterchurn.js'),
    path.join(root, 'docs/assets/desktop-butterchurn.js'));
  await writeFile(path.join(root, 'docs/assets/exowebtui-LICENSE.txt'), license.join('\n\n'));
} finally {
  await rm(source, { recursive: true, force: true });
}
