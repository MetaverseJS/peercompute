import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

// ExoWebTUI's desktop application seam lives in examples/ in the source distribution.
const revision = 'e89d2136a96dba9479ecbc984fb28e0927dfd8aa';
const root = fileURLToPath(new URL('../', import.meta.url));
const checkout = process.env.EXOTUI_DIR || path.resolve(root, '../exotui');
const source = await mkdtemp(path.join(tmpdir(), 'peercompute-gallery-'));
// Adapt only the pinned working copy. A changed seam must fail the build.
function patchPinned(source, changes, name) {
  for (const [before, after] of changes) {
    if (source.split(before).length !== 2) throw new Error(`Pinned ${name} hook mismatch: ${before}`);
    source = source.replace(before, () => after);
  }
  return source;
}

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
  // Project the same cell rectangles the native desktop paints above its
  // windows, so a live pixel layer can leave only those portions uncovered.
  const projected = patchPinned(upstream, [
    ['const active = windowHost.controller.inspect().activeWindowId;',
      'const { activeWindowId: active, windows } = windowHost.controller.inspect();'],
    ['const fullscreen = defaultFullscreen(active);', `const focused = windows.find(window => window.id === active);
    const arranged = focused?.snapTarget || focused?.placement === "tiled";
    const fullscreen = arranged ? mobileLayout() : defaultFullscreen(active);`],
    ['const desktopSettings = {', 'const defaultScrollSpeed = DESKTOP_SCROLL_SPEEDS.indexOf("fast");\nconst desktopSettings = {'],
    ['  /** Index into DESKTOP_SCROLL_SPEEDS; medium is the default. */\n  scrollSpeed: 1,', '  scrollSpeed: defaultScrollSpeed,'],
    ['speed < 0 ? 1 : speed', 'speed < 0 ? defaultScrollSpeed : speed'],
    ['export interface DesktopDemo {', 'export interface DesktopDemo {\n  readonly liveClient?: boolean;'],
    ['new DesktopWindowAnimations();',
      'new DesktopWindowAnimations(id => demoById.get(id)?.liveClient === true);'],
    ['    animating: boolean,', '    animating: boolean,\n    covers: readonly Rectangle[],'],
    // Keep a flick in the pane where it started, even when the finger crosses
    // from the preview to the list. Gallery hit regions use client coordinates.
    ['let touchScroll: {', 'let touchScroll: {\n  clientX: number;\n  clientY: number;'],
    ['? { windowId: top.id, startY: y,', '? { windowId: top.id, clientX: x - top.clientRect.column, clientY: y - top.clientRect.row, startY: y,'],
    ['demo?.onWheel?.(1, x, y);', 'demo?.onWheel?.(1, touchScroll.clientX, touchScroll.clientY);'],
    ['demo?.onWheel?.(-1, x, y);', 'demo?.onWheel?.(-1, touchScroll.clientX, touchScroll.clientY);'],
    ['function paintDesktop(now: number)', 'function paintDesktop(now: number, covers: Rectangle[])'],
    ['    paintShellSwitcher(frameSurface(frame)', '    const switcherRect = paintShellSwitcher(frameSurface(frame)'],
    ['  }\n  if (projection.snapPreview) {', '    covers.push(switcherRect);\n  }\n  if (projection.snapPreview) {'],
    ['    // The whole outline of where the window will land.', `    const { column, row, width, height } = projection.snapPreview.rect;
    covers.push({ column, row, width, height: 1 },
      { column, row: row + height - 1, width, height: 1 },
      { column, row, width: 1, height },
      { column: column + width - 1, row, width: 1, height });
    // The whole outline of where the window will land.`],
    ['function paintStartMenu(frame: VizCell[][]): void {\n  const layout = startMenuLayout();',
      'function paintStartMenu(frame: VizCell[][], layout: StartMenuLayout): void {'],
    ['  if (startMenuOpen) paintStartMenu(frame);', `  covers.push(barBounds());
  if (startMenuOpen) {
    const layout = startMenuLayout();
    covers.push(layout.rect);
    paintStartMenu(frame, layout);
  }
  if (contextMenu) covers.push(contextMenu.rect);
  if (degaussAlertOpen) covers.push(degaussAlertGeometry().rect);`],
    ['  if (chip && services.shader) {', '  if (chip && services.shader) {\n    covers.push(chip);'],
    ['  const frame = paintDesktop(now);', '  const covers: Rectangle[] = [];\n  const frame = paintDesktop(now, covers);'],
    ['    windowAnimations.status().length > 0,', '    windowAnimations.status().length > 0,\n    covers,'],
  ], 'desktop');
  await writeFile(desktop, projected + `
export const desktopWindowStates = () => windowHost.controller.inspect().windows;
export const focusDesktopWindow = id => windowHost.execute({ kind: "focus", id }, bodyBounds(), projectionOptions());
export const closeDesktopWindow = id => windowHost.execute({ kind: "close", id }, bodyBounds(), projectionOptions());
`);
  // Snaps are already projected against current bounds. Recovering their old
  // floating rectangles would discard the anchor on the first viewport resize.
  const hostPath = path.join(source, 'src/app/workbench_window_host.ts');
  await writeFile(hostPath, patchPinned(await readFile(hostPath, 'utf8'), [
    ['window.placement === "floating" && window.declaredVisible &&',
      'window.placement === "floating" && !window.snapTarget && window.declaredVisible &&'],
  ], 'window recovery'));
  // Detached animation snapshots contain terminal glyphs. Paint real window
  // chrome immediately if a transition would snapshot a live iframe region.
  const animationsPath = path.join(source, 'examples/web/desktop_animations.ts');
  await writeFile(animationsPath, patchPinned(await readFile(animationsPath, 'utf8'), [
    [`  kinds: {
    open: "fade",
    close: "disintegrate",
    minimize: "fly",
    maximize: "fade",
    restore: "fly",
    raise: "fade",
    lower: "fade",
  },`, `  kinds: Object.fromEntries(DESKTOP_WINDOW_TRANSITIONS.map(kind => [kind, "random"])) as DesktopAnimationSettings["kinds"],`],
    ['import type { Rectangle } from "../../src/types.ts";', `import type { Rectangle } from "../../src/types.ts";
import { intersects } from "../../src/app/hit_targets.ts";`],
    ['export class DesktopWindowAnimations {', `export class DesktopWindowAnimations {
  constructor(private readonly liveClient: (id: string) => boolean = () => false) {}
  #liveRects: readonly Rectangle[] = [];`],
    ['    this.#bounds = options.bounds;', `    this.#bounds = options.bounds;
    this.#liveRects = options.windows.filter(window => this.liveClient(window.id)).map(window => window.rect);
    for (const [id, entry] of this.#playing) {
      if (this.#liveRects.some(rect => intersects(rect, entry.snapshot.rect))) {
        this.#animator.cancel(id);
        this.#playing.delete(id);
      }
    }`],
    ['    const incoming = this.#pending.get(window.id);', `    if (this.liveClient(window.id)) {
      this.#pending.delete(window.id);
      paint();
      return;
    }
    const incoming = this.#pending.get(window.id);`],
    ['        active && active !== this.#active &&', `        active && !this.liveClient(active) && !(this.#active && this.liveClient(this.#active)) &&
        active !== this.#active &&`],
    ['    const engineTransition: SurfaceTransition =', `    if (this.liveClient(id) || this.#liveRects.some(rect => intersects(rect, source.rect))) return;
    const engineTransition: SurfaceTransition =`],
  ], 'animation'));
  // The gallery stretches its cell canvas to fill the viewport. Include the
  // remaining partial cell in the display scale used by mouse, wheel and touch.
  const platformPath = path.join(source, 'src/web/platform.ts');
  await writeFile(platformPath, patchPinned(await readFile(platformPath, 'utf8'), [
    [`    const rect = this.#target.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor((event.clientX - rect.left) / this.#cellWidth)),
      y: Math.max(0, Math.floor((event.clientY - rect.top) / this.#cellHeight)),`,
      `    const rect = this.#target.getBoundingClientRect();
    const cellIndex = (offset: number, extent: number, cellSize: number): number => {
      const cells = Math.max(1, Math.floor(extent / cellSize));
      return Math.max(0, Math.floor(offset * cells / Math.max(1, extent)));
    };
    return {
      x: cellIndex(event.clientX - rect.left, rect.width, this.#cellWidth),
      y: cellIndex(event.clientY - rect.top, rect.height, this.#cellHeight),`],
  ], 'cell coordinates'));
  // Add a pre-upload hook to the pinned presenter. All shader code, pass
  // ordering, uniforms, render targets and the display clock stay upstream.
  const shaderPath = path.join(source, 'src/web/canvas_shader.ts');
  const shader = patchPinned(await readFile(shaderPath, 'utf8'), [
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
  ], 'shader');
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
  // Render upstream's progress panel into the initial document. Keep it inert
  // for the plain HTML directory and size its fallback meter from this build.
  const { bootProgressHtml } = await import(pathToFileURL(path.join(source, 'examples/web/boot_progress.ts')).href);
  const boot = bootProgressHtml({
    name: 'PeerCompute', src: './assets/exowebtui.js', ready: 'manual',
    bytes: (await stat(path.join(root, 'docs/assets/exowebtui.js'))).size,
    fallbackHtml: '<a id="boot-directory" href="?view=html">Browse accessible HTML directory</a>',
  });
  const index = path.join(root, 'docs/index.html');
  const markup = await readFile(index, 'utf8');
  const slot = /(<template id="desktop-boot">)[\s\S]*?(<\/template>)/;
  if (!slot.test(markup)) throw new Error('Gallery is missing the desktop boot template');
  await writeFile(index, markup.replace(slot, (_, start, end) => start + '\n' + boot + '\n' + end));
  await copyFile(path.join(source, 'docs/assets/desktop-butterchurn.js'),
    path.join(root, 'docs/assets/desktop-butterchurn.js'));
  await writeFile(path.join(root, 'docs/assets/exowebtui-LICENSE.txt'), license.join('\n\n'));
} finally {
  await rm(source, { recursive: true, force: true });
}
