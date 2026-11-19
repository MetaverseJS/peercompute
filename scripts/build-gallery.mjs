import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
  execFileSync('git', ['-C', checkout, 'archive', `--output=${archive}`, revision, 'src', 'app', 'examples/web', 'LICENSE.md']);
  execFileSync('tar', ['-xf', archive, '-C', source]);
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
      'exowebtui-desktop': path.join(source, 'examples/web/desktop_app.ts'),
      'exowebtui-presenter': path.join(source, 'src/web/web_presenter.ts'),
      three,
    },
    banner: { js: `/*! Built from Exotui ${revision}. See exowebtui-LICENSE.txt. */` },
  });
  await writeFile(path.join(root, 'docs/assets/exowebtui-LICENSE.txt'), license.join('\n\n'));
} finally {
  await rm(source, { recursive: true, force: true });
}
