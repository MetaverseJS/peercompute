import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { buildButterchurn } from './butterchurn-build.mjs';

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
  execFileSync('git', ['-C', checkout, 'archive', `--output=${archive}`, revision, 'src', 'app', 'examples/web', 'packages/exomux/*.ts', 'LICENSE.md']);
  execFileSync('tar', ['-xf', archive, '-C', source]);
  // Backport the two-color pointer and surface leave event until the gallery's next upstream pin.
  execFileSync('git', ['apply', path.join(root, 'scripts/gallery-pointer.patch')], { cwd: source });
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
    ['    animating: boolean,', '    animating: boolean,\n    covers: readonly Rectangle[],\n    cursor?: { column: number; row: number },'],
    // Keep a flick in the pane where it started, even when the finger crosses
    // from the preview to the list. Gallery hit regions use client coordinates.
    ['let touchScroll: {', 'let touchScroll: {\n  clientX: number;\n  clientY: number;'],
    ['? { windowId: top.id, startY: y,', '? { windowId: top.id, clientX: x - top.clientRect.column, clientY: y - top.clientRect.row, startY: y,'],
    ['demo?.onWheel?.(1, x, y);', 'demo?.onWheel?.(1, touchScroll.clientX, touchScroll.clientY);'],
    ['demo?.onWheel?.(-1, x, y);', 'demo?.onWheel?.(-1, touchScroll.clientX, touchScroll.clientY);'],
    ['  if (style === "plain") return;', `  if ((style === "plain" || style === "dots") && backgroundFieldId === "butterchurn") {
    (backgroundField as ShellDisposableBackground)?.dispose?.();
    backgroundField = undefined;
    backgroundFieldId = "";
    backgroundCells = undefined;
  }
  if (style === "plain") return;`],
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
    ['    windowAnimations.status().length > 0,', '    windowAnimations.status().length > 0,\n    covers,\n    cursorVisible ? cursorPoint : undefined,'],
    // A window the viewport made fullscreen keeps that shape when another
    // window opens above it. Its hidden floating rectangle may have been sized
    // for a larger screen.
    [`    windowHost.execute({ kind: "restore", id: maximizedId }, bodyBounds(), projectionOptions());
  }
  const wasClosed`, `    windowHost.execute({ kind: "restore", id: maximizedId }, bodyBounds(), projectionOptions());
    if (responsiveDefaults.get(maximizedId)) {
      windowHost.execute({ kind: "set-placement", id: maximizedId, placement: "floating", rect: bodyBounds() },
        bodyBounds(), projectionOptions());
    }
  }
  const wasClosed`],
    ['      return composeDesktopFrame(now);', '      fitFloatingWindows();\n      return composeDesktopFrame(now);'],
  ], 'desktop');
  await writeFile(desktop, projected + `
export const desktopWindowStates = () => windowHost.controller.inspect().windows;
// No floating window may be larger than the desktop body, whichever command
// or viewport change revealed it. Position is left to the host's own recovery.
function fitFloatingWindows(): void {
  if (windowHost.inspect().interaction.active) return;
  const body = bodyBounds();
  const stack = windowHost.controller.inspect().windows;
  let placed = false;
  for (const window of stack) {
    const rect = window.floatingRect;
    if (!rect || window.placement !== "floating" || window.state !== "normal" || window.snapTarget) continue;
    if (rect.width <= body.width && rect.height <= body.height) continue;
    placed = true;
    const width = Math.min(rect.width, body.width), height = Math.min(rect.height, body.height);
    windowHost.execute({ kind: "set-placement", id: window.id, placement: "floating", rect: {
      column: Math.max(body.column, Math.min(rect.column, body.column + body.width - width)),
      row: Math.max(body.row, Math.min(rect.row, body.row + body.height - height)),
      width, height,
    } }, body, projectionOptions());
  }
  if (!placed) return;
  // Placing a window raises it. Put the stack back in its original order.
  for (const window of [...stack].sort((a, b) => a.focusOrder - b.focusOrder)) {
    if (window.visible && window.state !== "minimized" && window.state !== "closed") {
      windowHost.execute({ kind: "focus", id: window.id }, body, projectionOptions());
    }
  }
}
export const focusDesktopWindow = id => windowHost.execute({ kind: "focus", id }, bodyBounds(), projectionOptions());
export const closeDesktopWindow = id => windowHost.execute({ kind: "close", id }, bodyBounds(), projectionOptions());
export const desktopBodyBounds = () => bodyBounds();
const reconcileCurrentDesktopWindows = () => {
  const existing = new Map(windowHost.controller.inspect().windows.map(w => [w.id, w]));
  windowHost.reconcileWindows(DEMOS.map((item, index) => {
    const prev = existing.get(item.id);
    return {
      id: item.id,
      title: item.title,
      minWidth: item.window.minWidth,
      minHeight: item.window.minHeight,
      state: prev ? prev.state : (item.id === "about" ? "normal" as const : "closed" as const),
      placement: prev ? prev.placement : "floating" as const,
      floatingRect: prev?.floatingRect ?? { column: 4 + (index % 8) * 3, row: 2 + (index % 6) * 2, width: item.window.width, height: item.window.height },
    };
  }));
};
export const registerDesktopApplication = (demo: DesktopDemo) => {
  if (demoById.has(demo.id)) return;
  demoById.set(demo.id, demo);
  DEMOS.push(demo);
  reconcileCurrentDesktopWindows();
};
export const unregisterDesktopApplication = (id: string) => {
  if (!demoById.has(id)) return;
  windowHost.execute({ kind: "close", id }, bodyBounds(), projectionOptions());
  demoById.delete(id);
  const index = DEMOS.findIndex(item => item.id === id);
  if (index >= 0) DEMOS.splice(index, 1);
  reconcileCurrentDesktopWindows();
};
export const placeDesktopWindows = (placements: readonly { id: string; rect: Rectangle; focus?: boolean }[]) => {
  const maximizedId = windowHost.controller.inspect().maximizedWindowId;
  if (maximizedId) windowHost.execute({ kind: "restore", id: maximizedId }, bodyBounds(), projectionOptions());
  const body = bodyBounds();
  const options = projectionOptions();
  for (const item of placements) {
    if (!demoById.has(item.id)) continue;
    windowHost.execute({ kind: "restore", id: item.id }, body, options);
    const clamped = {
      column: Math.max(body.column, Math.min(item.rect.column, body.column + Math.max(0, body.width - item.rect.width))),
      row: Math.max(body.row, Math.min(item.rect.row, body.row + Math.max(0, body.height - item.rect.height))),
      width: Math.min(item.rect.width, body.width),
      height: Math.min(item.rect.height, body.height),
    };
    windowHost.execute({ kind: "set-placement", id: item.id, placement: "floating", rect: clamped }, body, options);
    if (item.focus) windowHost.execute({ kind: "focus", id: item.id }, body, options);
  }
};
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
  // Add a pre-upload hook and fused multi-shader pipeline (with quarter-res
  // separable phosphor bloom) to the pinned presenter. All shader catalog IDs,
  // options, defaults, warpPoint math, and degauss behavior stay upstream.
  const shaderPath = path.join(source, 'src/web/canvas_shader.ts');
  const shader = patchPinned(await readFile(shaderPath, 'utf8'), [
    ['  list(): readonly CanvasShaderDefinition[];', `  setSourceComposer(composer: ((source: HTMLCanvasElement, targetWidth: number, targetHeight: number, forceUpload: boolean) => HTMLCanvasElement | null) | null): void;
  setMaxPixelRatio(maxDpr: number): void;
  setFrameInterval(ms: number): void;
  requestRedraw(): void;
  isPresenting(): boolean;
  list(): readonly CanvasShaderDefinition[];`],
    ['  let raf = 0;', `  let composeSource: ((source: HTMLCanvasElement, targetWidth: number, targetHeight: number, forceUpload: boolean) => HTMLCanvasElement | null) | null = null;
  let presented = false;
  let frameIntervalMs = 0;
  let maxPixelRatio = 1.5;
  let lastDrawAt = -Infinity;
  let sourceUploaded = false;
  let glowDirty = true;
  const glowTargets: Array<{ texture: WebGLTexture; framebuffer: WebGLFramebuffer }> = [];
  let glowSize = "";
  let blurPass: CompiledPass | null = null;
  const fusedPasses = new Map<number, CompiledPass>();
  let raf = 0;`],
    ['    raf = 0;', '    raf = 0;\n    presented = false;\n    sourceUploaded = false;\n    glowDirty = true;'],
    ['    if (!gl || definitions.length === 0) return;', `    if (!gl || definitions.length === 0) return;
    if (frameIntervalMs > 0 && thumpAge >= DEGAUSS_SECONDS && now - lastDrawAt < frameIntervalMs) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastDrawAt = now;`],
    [`    if (overlay.width !== source.width || overlay.height !== source.height) {
      overlay.width = source.width;
      overlay.height = source.height;
    }
    context.viewport(0, 0, overlay.width, overlay.height);
    ensurePingPong(context, overlay.width, overlay.height);
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, sourceTexture);
    try {
      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, source);
    } catch {
      // A zero-sized canvas mid-resize; skip the frame.
      raf = requestAnimationFrame(frame);
      return;
    }
    const time = (performance.now() - started) / 1000;
    let input = sourceTexture!;
    for (let index = 0; index < definitions.length; index += 1) {
      const definition = definitions[index]!;
      const pass = passes.get(definition.id)!;
      const last = index === definitions.length - 1;
      const target = last ? null : pingPong[index % 2]!;
      context.bindFramebuffer(context.FRAMEBUFFER, target ? target.framebuffer : null);
      context.useProgram(pass.program);
      context.bindTexture(context.TEXTURE_2D, input);
      context.uniform2f(pass.uniforms.get("iResolution") ?? null, overlay.width, overlay.height);
      context.uniform1f(pass.uniforms.get("iTime") ?? null, time);
      context.uniform1i(pass.uniforms.get("iChannel0") ?? null, 0);
      // The source canvas texture has row 0 at the top; a pass's own output
      // lands with row 0 at the bottom. Only the first pass flips.
      context.uniform1f(pass.uniforms.get("iFlip") ?? null, index === 0 ? 1 : 0);
      context.uniform1f(pass.uniforms.get("iMagnet") ?? null, magnetism);
      context.uniform1f(pass.uniforms.get("iThump") ?? null, Math.min(thumpAge, 60));
      const tuning = values.get(definition.id);
      for (const option of definition.options ?? []) {
        context.uniform1f(pass.uniforms.get(\`u_\${option.key}\`) ?? null, tuning?.get(option.key) ?? option.value);
      }
      context.drawArrays(context.TRIANGLES, 0, 3);
      if (target) input = target.texture;
    }
    raf = requestAnimationFrame(frame);`, `    const dpr = window.devicePixelRatio || 1;
    const scale = maxPixelRatio > 0 && dpr > maxPixelRatio ? maxPixelRatio / dpr : 1;
    const targetW = Math.max(1, Math.round(source.width * scale));
    const targetH = Math.max(1, Math.round(source.height * scale));
    let resized = false;
    if (overlay.width !== targetW || overlay.height !== targetH) {
      overlay.width = targetW;
      overlay.height = targetH;
      resized = true;
      sourceUploaded = false;
    }
    const uploadCanvas = composeSource
      ? composeSource(source, overlay.width, overlay.height, !sourceUploaded || resized)
      : source;
    if (uploadCanvas) {
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, sourceTexture);
      try {
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, uploadCanvas);
        sourceUploaded = true;
        glowDirty = true;
      } catch {
        presented = false;
        // A zero-sized canvas mid-resize; skip the frame.
        raf = requestAnimationFrame(frame);
        return;
      }
    } else if (!sourceUploaded) {
      presented = false;
      raf = requestAnimationFrame(frame);
      return;
    }
    const time = (performance.now() - started) / 1000;
    let mask = 0;
    for (const def of definitions) {
      if (def.id === "vhs") mask |= 1;
      else if (def.id === "crt") mask |= 2;
      else if (def.id === "phosphor") mask |= 4;
      else if (def.id === "scanlines") mask |= 8;
      else if (def.id === "degauss") mask |= 16;
    }
    const compileCustom = (frag: string, uniformNames: readonly string[]): CompiledPass | null => {
      const make = (kind: number, text: string): WebGLShader | null => {
        const sh = context.createShader(kind);
        if (!sh) return null;
        context.shaderSource(sh, text);
        context.compileShader(sh);
        return context.getShaderParameter(sh, context.COMPILE_STATUS) ? sh : null;
      };
      const v = make(context.VERTEX_SHADER, VERTEX);
      const f = make(context.FRAGMENT_SHADER, frag);
      if (!v || !f) return null;
      const program = context.createProgram();
      if (!program) return null;
      context.attachShader(program, v);
      context.attachShader(program, f);
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) return null;
      const position = context.getAttribLocation(program, "position");
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      const uniforms = new Map<string, WebGLUniformLocation | null>();
      for (const name of uniformNames) uniforms.set(name, context.getUniformLocation(program, name));
      return { program, uniforms };
    };
    const ensureGlow = (w: number, h: number): { w: number; h: number } => {
      const gw = Math.max(1, w >> 1);
      const gh = Math.max(1, h >> 1);
      const key = \`\${gw}x\${gh}\`;
      if (glowSize !== key || glowTargets.length < 2) {
        glowSize = key;
        while (glowTargets.length < 2) {
          glowTargets.push({ texture: makeTexture(context), framebuffer: context.createFramebuffer()! });
        }
        for (const target of glowTargets) {
          context.bindTexture(context.TEXTURE_2D, target.texture);
          context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, gw, gh, 0, context.RGBA, context.UNSIGNED_BYTE, null);
          context.bindFramebuffer(context.FRAMEBUFFER, target.framebuffer);
          context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, target.texture, 0);
        }
        context.bindFramebuffer(context.FRAMEBUFFER, null);
        glowDirty = true;
      }
      return { w: gw, h: gh };
    };
    let fused = fusedPasses.get(mask);
    if (!fused && mask > 0) {
      const defines = [
        (mask & 1) ? "#define HAS_VHS" : "",
        (mask & 2) ? "#define HAS_CRT" : "",
        (mask & 4) ? "#define HAS_PHOSPHOR" : "",
        (mask & 8) ? "#define HAS_SCANLINES" : "",
        (mask & 16) ? "#define HAS_DEGAUSS" : "",
      ].filter(Boolean).join("\\n");
      const fusedFrag = \`#version 300 es
precision highp float;
\${defines}
uniform sampler2D iChannel0;
uniform sampler2D iGlow;
uniform vec2 iResolution;
uniform float iTime;
uniform float iMagnet;
uniform float iThump;
uniform float u_vhs_tracking;
uniform float u_vhs_noise;
uniform float u_vhs_bleed;
uniform float u_crt_curve;
uniform float u_crt_vignette;
uniform float u_crt_fringe;
uniform float u_phosphor_glow;
uniform float u_scanlines_strength;
uniform float u_scanlines_period;
out vec4 outColor;
float shaderHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
vec4 sampleSrc(vec2 uv) {
  return texture(iChannel0, vec2(uv.x, 1.0 - uv.y));
}
void main() {
  vec2 screenUv = gl_FragCoord.xy / iResolution.xy;
  vec2 uv = screenUv;
  float offR = 0.0;
  float offB = 0.0;
#ifdef HAS_DEGAUSS
  float settle = exp(-2.6 * iThump);
  float wob = sin(iThump * 34.0 - screenUv.y * 9.0) * settle;
  vec2 dCentered = screenUv - 0.5;
  float radius = length(dCentered);
  float angle = wob * 0.10 * radius + iMagnet * 0.05 * sin(iTime * 0.4) * radius;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 sheared = dCentered + vec2(iMagnet * 0.008 * sin(screenUv.y * 21.0 + iTime * 0.7), 0.0);
  uv = clamp(0.5 + rot * sheared * (1.0 + wob * 0.05), 0.0, 1.0);
  float dFringe = settle * 0.010 * (0.3 + radius) + iMagnet * 0.004 * radius;
  offR += dFringe * (0.4 + 0.6 * sin(iThump * 40.0));
  offB += dFringe * (0.4 + 0.6 * sin(iThump * 47.0 + 1.0));
  float stain = iMagnet * smoothstep(0.32, 0.72, radius);
  float theta = atan(dCentered.y, dCentered.x) * 2.0 + iTime * 0.05;
  float sweep = 6.0 * radius - iThump * 20.0;
#endif
  float scan = 1.0;
#ifdef HAS_SCANLINES
  scan = mod(uv.y * iResolution.y, u_scanlines_period) < 1.0
    ? max(0.0, 1.0 - u_scanlines_strength * iMagnet * 2.0) : 1.0;
#endif
  float dim = 1.0;
#ifdef HAS_CRT
  vec2 cCentered = uv * 2.0 - 1.0;
  cCentered *= 1.0 + u_crt_curve * (dot(cCentered, cCentered) - 1.0);
  uv = (cCentered + 1.0) * 0.5;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    vec3 border = vec3(0.0);
#ifdef HAS_DEGAUSS
    border += 0.22 * settle * settle * vec3(sin(sweep), sin(sweep + 2.1), sin(sweep + 4.2));
#endif
    outColor = vec4(border, 1.0);
    return;
  }
  dim = max(0.0, 1.0 - u_crt_vignette * iMagnet * 2.0 * pow(length(cCentered), 3.0));
  float cFringe = u_crt_fringe * iMagnet * 2.0;
  offR += cFringe;
  offB += cFringe;
#endif
  float grainDelta = 0.0;
#ifdef HAS_VHS
  float track = u_vhs_tracking * iMagnet * 2.0;
  float line = floor(uv.y * iResolution.y);
  float vWob = (shaderHash(vec2(line, floor(iTime * 60.0))) - 0.5) * 0.0025 * (0.4 + track);
  float band = fract(uv.y * 0.7 + iTime * 0.11);
  float inBand = smoothstep(0.0, 0.04, band) * (1.0 - smoothstep(0.05, 0.12, band));
  vWob += inBand * track * 0.03 * (shaderHash(vec2(line, floor(iTime * 24.0))) - 0.3);
  uv.x += vWob;
  float px = u_vhs_bleed * iMagnet * 2.0 / iResolution.x;
  offR += px * 1.5;
  offB += px * 1.5;
  float sparkle = shaderHash(vec2(uv.x * iResolution.x * 0.37 + iTime * 91.0, line * 1.7 + iTime * 57.0));
  float grain = u_vhs_noise * iMagnet * 2.0 * (0.35 + inBand * 2.0);
  if (uv.y < 0.025) grain += 0.5 * track;
  grainDelta = (sparkle - 0.5) * grain;
#endif
  vec3 color;
  if (offR == 0.0 && offB == 0.0) {
    color = sampleSrc(clamp(uv, 0.0, 1.0)).rgb;
  } else {
    color.r = sampleSrc(clamp(uv + vec2(offR, 0.0), 0.0, 1.0)).r;
    color.g = sampleSrc(clamp(uv, 0.0, 1.0)).g;
    color.b = sampleSrc(clamp(uv - vec2(offB, 0.0), 0.0, 1.0)).b;
  }
  color += grainDelta;
  color *= dim;
#ifdef HAS_PHOSPHOR
  vec3 glow = texture(iGlow, clamp(uv, 0.0, 1.0)).rgb * dim;
  color = color + glow * glow * u_phosphor_glow * iMagnet * 2.0;
  color *= mix(vec3(1.0), vec3(0.94, 1.03, 0.96), min(1.0, iMagnet * 2.0));
#endif
  color *= scan;
#ifdef HAS_DEGAUSS
  color *= 1.0 + stain * 0.45 * vec3(sin(theta), sin(theta + 2.1), sin(theta + 4.2));
  color += 0.22 * settle * settle * vec3(sin(sweep), sin(sweep + 2.1), sin(sweep + 4.2));
#endif
  outColor = vec4(color, 1.0);
}
\`;
      const compiled = compileCustom(fusedFrag, [
        "iChannel0", "iGlow", "iResolution", "iTime", "iMagnet", "iThump",
        "u_vhs_tracking", "u_vhs_noise", "u_vhs_bleed",
        "u_crt_curve", "u_crt_vignette", "u_crt_fringe",
        "u_phosphor_glow", "u_scanlines_strength", "u_scanlines_period",
      ]);
      if (compiled) {
        fusedPasses.set(mask, compiled);
        fused = compiled;
      }
    }
    if (fused) {
      if ((mask & 4) !== 0) {
        if (!blurPass) {
          blurPass = compileCustom(\`#version 300 es
precision highp float;
uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform vec2 u_step;
uniform float iFlip;
out vec4 outColor;
vec4 sampleB(vec2 uv) {
  return texture(iChannel0, iFlip > 0.5 ? vec2(uv.x, 1.0 - uv.y) : uv);
}
void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 sum = sampleB(uv - 2.0 * u_step).rgb
           + sampleB(uv - u_step).rgb
           + sampleB(uv).rgb
           + sampleB(uv + u_step).rgb
           + sampleB(uv + 2.0 * u_step).rgb;
  outColor = vec4(sum * 0.2, 1.0);
}
\`, ["iChannel0", "iResolution", "u_step", "iFlip"]);
        }
        const glowDim = ensureGlow(overlay.width, overlay.height);
        if (blurPass && glowDirty) {
          context.viewport(0, 0, glowDim.w, glowDim.h);
          context.useProgram(blurPass.program);
          context.activeTexture(context.TEXTURE0);
          context.uniform1i(blurPass.uniforms.get("iChannel0") ?? null, 0);
          context.uniform2f(blurPass.uniforms.get("iResolution") ?? null, glowDim.w, glowDim.h);
          // Pass H: sourceTexture -> glowTargets[0]
          context.bindFramebuffer(context.FRAMEBUFFER, glowTargets[0]!.framebuffer);
          context.bindTexture(context.TEXTURE_2D, sourceTexture);
          context.uniform2f(blurPass.uniforms.get("u_step") ?? null, 1.6 / overlay.width, 0);
          context.uniform1f(blurPass.uniforms.get("iFlip") ?? null, 1);
          context.drawArrays(context.TRIANGLES, 0, 3);
          // Pass V: glowTargets[0] -> glowTargets[1]
          context.bindFramebuffer(context.FRAMEBUFFER, glowTargets[1]!.framebuffer);
          context.bindTexture(context.TEXTURE_2D, glowTargets[0]!.texture);
          context.uniform2f(blurPass.uniforms.get("u_step") ?? null, 0, 1.6 / overlay.height);
          context.uniform1f(blurPass.uniforms.get("iFlip") ?? null, 0);
          context.drawArrays(context.TRIANGLES, 0, 3);
          glowDirty = false;
        }
      }
      context.bindFramebuffer(context.FRAMEBUFFER, null);
      context.viewport(0, 0, overlay.width, overlay.height);
      context.useProgram(fused.program);
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, sourceTexture);
      context.uniform1i(fused.uniforms.get("iChannel0") ?? null, 0);
      if ((mask & 4) !== 0 && glowTargets.length >= 2) {
        context.activeTexture(context.TEXTURE1);
        context.bindTexture(context.TEXTURE_2D, glowTargets[1]!.texture);
        context.uniform1i(fused.uniforms.get("iGlow") ?? null, 1);
        context.activeTexture(context.TEXTURE0);
      }
      context.uniform2f(fused.uniforms.get("iResolution") ?? null, overlay.width, overlay.height);
      context.uniform1f(fused.uniforms.get("iTime") ?? null, time);
      context.uniform1f(fused.uniforms.get("iMagnet") ?? null, magnetism);
      context.uniform1f(fused.uniforms.get("iThump") ?? null, Math.min(thumpAge, 60));
      const vhsV = values.get("vhs");
      const crtV = values.get("crt");
      const phosV = values.get("phosphor");
      const scanV = values.get("scanlines");
      context.uniform1f(fused.uniforms.get("u_vhs_tracking") ?? null, vhsV?.get("tracking") ?? 0.3);
      context.uniform1f(fused.uniforms.get("u_vhs_noise") ?? null, vhsV?.get("noise") ?? 0.1);
      context.uniform1f(fused.uniforms.get("u_vhs_bleed") ?? null, vhsV?.get("bleed") ?? 1);
      context.uniform1f(fused.uniforms.get("u_crt_curve") ?? null, crtV?.get("curve") ?? 0.04);
      context.uniform1f(fused.uniforms.get("u_crt_vignette") ?? null, crtV?.get("vignette") ?? 0.25);
      context.uniform1f(fused.uniforms.get("u_crt_fringe") ?? null, crtV?.get("fringe") ?? 0.0004);
      context.uniform1f(fused.uniforms.get("u_phosphor_glow") ?? null, phosV?.get("glow") ?? 0.9);
      context.uniform1f(fused.uniforms.get("u_scanlines_strength") ?? null, scanV?.get("strength") ?? 0.14);
      context.uniform1f(fused.uniforms.get("u_scanlines_period") ?? null, scanV?.get("period") ?? 3);
      context.drawArrays(context.TRIANGLES, 0, 3);
    } else {
      context.viewport(0, 0, overlay.width, overlay.height);
      ensurePingPong(context, overlay.width, overlay.height);
      let input = sourceTexture!;
      for (let index = 0; index < definitions.length; index += 1) {
        const definition = definitions[index]!;
        const pass = passes.get(definition.id)!;
        const last = index === definitions.length - 1;
        const target = last ? null : pingPong[index % 2]!;
        context.bindFramebuffer(context.FRAMEBUFFER, target ? target.framebuffer : null);
        context.useProgram(pass.program);
        context.bindTexture(context.TEXTURE_2D, input);
        context.uniform2f(pass.uniforms.get("iResolution") ?? null, overlay.width, overlay.height);
        context.uniform1f(pass.uniforms.get("iTime") ?? null, time);
        context.uniform1i(pass.uniforms.get("iChannel0") ?? null, 0);
        context.uniform1f(pass.uniforms.get("iFlip") ?? null, index === 0 ? 1 : 0);
        context.uniform1f(pass.uniforms.get("iMagnet") ?? null, magnetism);
        context.uniform1f(pass.uniforms.get("iThump") ?? null, Math.min(thumpAge, 60));
        const tuning = values.get(definition.id);
        for (const option of definition.options ?? []) {
          context.uniform1f(pass.uniforms.get(\`u_\${option.key}\`) ?? null, tuning?.get(option.key) ?? option.value);
        }
        context.drawArrays(context.TRIANGLES, 0, 3);
        if (target) input = target.texture;
      }
    }
    presented = true;
    raf = requestAnimationFrame(frame);`],
    ['    list: () => CANVAS_SHADERS,', `    setSourceComposer(composer) { composeSource = composer; sourceUploaded = false; glowDirty = true; lastDrawAt = -Infinity; },
    setMaxPixelRatio(maxDpr) {
      const next = Math.max(0, Number(maxDpr) || 0);
      if (next !== maxPixelRatio) {
        maxPixelRatio = next;
        sourceUploaded = false;
        glowDirty = true;
        lastDrawAt = -Infinity;
      }
    },
    setFrameInterval(ms) {
      const next = Math.max(0, Number(ms) || 0);
      if (next !== frameIntervalMs) {
        frameIntervalMs = next;
        lastDrawAt = -Infinity;
      }
    },
    requestRedraw() { lastDrawAt = -Infinity; },
    isPresenting: () => presented && !!gl && !gl.isContextLost(),
    list: () => CANVAS_SHADERS,`],
  ], 'shader');
  await writeFile(shaderPath, shader);
  const three = fileURLToPath(import.meta.resolve('three'));
  const markdownIt = fileURLToPath(import.meta.resolve('markdown-it/browser'));
  const license = [
    `ExoWebTUI · https://github.com/ubernaut/exotui/tree/${revision}`,
    await readFile(path.join(source, 'LICENSE.md'), 'utf8'),
    'Markdown-it · https://github.com/markdown-it/markdown-it',
    await readFile(path.resolve(path.dirname(markdownIt), '../../LICENSE'), 'utf8'),
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
      'exowebtui-cell-sink': path.join(source, 'src/web/cell_canvas_sink.ts'),
      'exowebtui-glyphs': path.join(source, 'src/content/ascii_fonts.ts'),
      'exowebtui-audio': path.join(source, 'examples/web/browser_audio_source.ts'),
      'exowebtui-clipboard': path.join(source, 'examples/web/browser_clipboard.ts'),
      '@ubernaut/exotui/runtime': path.join(source, 'src/runtime/host.ts'),
      'exowebtui-presenter': path.join(source, 'src/web/web_presenter.ts'),
      three,
    },
    banner: { js: `/*! Built from Exotui ${revision}. See exowebtui-LICENSE.txt. */` },
  });
  // Direct guide links can be a returning user's first visit to this build.
  // Resolve their saved theme from exactly the same palette catalog as the shell.
  const themeModule = path.join(source, 'guide-theme-catalog.mjs');
  await build({ entryPoints: [path.join(source, 'src/app/shell_theme.ts')], outfile: themeModule,
    bundle: true, platform: 'node', format: 'esm' });
  const { SHELL_THEMES } = await import(pathToFileURL(themeModule).href);
  const colors = ['background', 'surface', 'text', 'accent', 'muted', 'border'];
  const palettes = Object.fromEntries(SHELL_THEMES.map(theme => [theme.id, Object.fromEntries(
    colors.map(role => [role, '#' + theme[role].map(n => n.toString(16).padStart(2, '0')).join('')]))]));
  await writeFile(path.join(root, 'docs/assets/gallery-guide-themes.json'), JSON.stringify(palettes) + '\n');
  // Bundle the same native flex document and ANSI cell primitives that the
  // tech-stack site uses, without adding Markdown parsing to desktop startup.
  await build({
    absWorkingDir: root, entryPoints: ['demos/gallery/guide-window.js'],
    outfile: 'docs/assets/gallery-guide-reader.js',
    // Escape FIGlet font data so significant spaces stay inside string literals.
    supported: { 'template-literal': false },
    format: 'esm', platform: 'browser', target: 'es2022', bundle: true, minify: true,
    alias: {
      'exowebtui-flex-document': path.join(source, 'src/content/flex_markdown_surface.ts'),
      'exowebtui-document-fonts': path.join(source, 'src/content/heading_fonts.ts'),
      'exowebtui-ansi': path.join(source, 'examples/web/ansi_cells.ts'),
      'markdown-it': markdownIt,
    },
    banner: { js: `/*! ExoWebTUI document surface at ${revision}. See exowebtui-LICENSE.txt. */` },
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
  await buildButterchurn({ root, source, patchPinned });
  await writeFile(path.join(root, 'docs/assets/exowebtui-LICENSE.txt'), license.join('\n\n'));
} finally {
  await rm(source, { recursive: true, force: true });
}
