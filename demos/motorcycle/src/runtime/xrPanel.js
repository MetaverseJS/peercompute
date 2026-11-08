import {
  TerminalButton,
  TerminalPanel,
  TerminalSlider,
  TerminalUIInteraction,
  createThreeTerminalPanel,
} from '../../../shared/xr/index.js';

function buttonPressed(entry) {
  const button = entry?.inputSource?.gamepad?.buttons?.[0];
  return Boolean(entry?.inputState?.select?.held || button?.pressed || Number(button?.value) > 0.55);
}

/** In-scene terminal fallback controlled by real XR target rays. */
export function createMotorcycleXrPanel({
  THREE,
  scene,
  registry,
  createCanvas,
  createRaycaster = () => new THREE.Raycaster(),
  onCameraToggle = () => {},
  onReset = () => {},
  onLeanAssist = () => {},
} = {}) {
  if (!THREE?.Raycaster) throw new TypeError('Three Raycaster is required.');
  if (!scene?.add) throw new TypeError('A Three scene is required.');
  if (!registry?.getEntries) throw new TypeError('An XRControllerRegistry is required.');

  const panel = new TerminalPanel({
    id: 'motorcycle-ride',
    title: 'ROADVECTOR // RIDE',
    width: 1_000,
    height: 620,
  });
  panel.add(new TerminalButton({
    id: 'camera',
    label: 'TOGGLE VIEW',
    bounds: { x: 70, y: 110, width: 390, height: 130 },
    onActivate: onCameraToggle,
  }));
  panel.add(new TerminalButton({
    id: 'reset',
    label: 'RESET BIKE',
    bounds: { x: 540, y: 110, width: 390, height: 130 },
    onActivate: onReset,
  }));
  panel.add(new TerminalSlider({
    id: 'lean-assist',
    label: 'LEAN ASSIST',
    bounds: { x: 70, y: 330, width: 860, height: 150 },
    minimum: 0,
    maximum: 1,
    step: 1,
    value: 1,
    onInput: ({ value }) => onLeanAssist(value >= 0.5),
    onChange: ({ value }) => onLeanAssist(value >= 0.5),
  }));
  const interaction = new TerminalUIInteraction({ panel });
  const render = createThreeTerminalPanel({
    THREE,
    panel,
    widthMeters: 0.48,
    canvasWidth: 1_000,
    canvasHeight: 620,
    ...(createCanvas ? { createCanvas } : {}),
  });
  const raycaster = createRaycaster();
  if (!raycaster?.setFromXRController || !raycaster?.intersectObject) {
    throw new TypeError('createRaycaster must return an XR-capable raycaster.');
  }
  render.mesh.visible = false;
  let mount = null;
  let mountOwnerId = null;
  let mountMode = 'hidden';
  let lastInteraction = Object.freeze({
    hovered: false,
    surfaceHovered: false,
    captureGameplay: false,
    pointers: 0,
    mounted: false,
    mountOwnerId: null,
    mountMode: 'hidden',
  });
  let disposed = false;

  const mountForEntry = (entry) => {
    if (entry.role === 'hand') {
      // Three updates XRHand joint objects in reference space while the hand
      // root itself remains an identity container. Mounting to that root makes
      // the panel hover at the world origin instead of following the wrist.
      return entry.handObject?.joints?.wrist ?? null;
    }
    return entry.gripObject ?? entry.targetRayObject ?? null;
  };

  const syncMount = () => {
    const entries = registry.getEntries();
    const preferred = entries.length > 1 ? [...entries]
      .sort((left, right) => {
        const leftRank = left.handedness === 'left' ? 0 : 1;
        const rightRank = right.handedness === 'left' ? 0 : 1;
        return leftRank - rightRank || left.id.localeCompare(right.id);
      })
      .map((entry) => ({ entry, object: mountForEntry(entry) }))
      .find(({ object }) => Boolean(object)) ?? null : null;
    // With one input source, a wrist mount would exclude the only usable ray.
    // Put the panel in the XR-root/head frame instead so one-controller and
    // one-hand sessions retain a complete UI path.
    const fallback = entries.length === 1 ? scene : null;
    const next = preferred?.object ?? fallback;
    const nextOwnerId = preferred?.entry.id ?? null;
    const nextMode = preferred ? 'wrist-or-grip' : (fallback ? 'xr-root-fallback' : 'hidden');
    if (mount === next && mountOwnerId === nextOwnerId && mountMode === nextMode) return;
    render.mesh.parent?.remove?.(render.mesh);
    mount = next;
    mountOwnerId = nextOwnerId;
    mountMode = nextMode;
    if (mount?.add) {
      mount.add(render.mesh);
      if (mountMode === 'xr-root-fallback') {
        render.mesh.position.set(-0.38, 1.28, -0.9);
        render.mesh.rotation.set(-0.12, 0, 0);
      } else {
        render.mesh.position.set(0, 0.12, -0.24);
        render.mesh.rotation.set(-0.45, 0, 0);
      }
      render.mesh.visible = true;
    } else {
      scene.add(render.mesh);
      render.mesh.visible = false;
    }
  };

  return Object.freeze({
    panel,
    interaction,
    mesh: render.mesh,
    update() {
      if (disposed) return lastInteraction;
      syncMount();
      let surfaceHovered = false;
      const active = new Set();
      for (const entry of registry.getEntries()) {
        const pointerId = `xr-panel:${entry.id}`;
        // A controller/hand must never raycast its own wrist-mounted panel.
        // Apart from being unusable, that self-hit captured the ride context
        // while the rider was simply holding the controller.
        if (entry.id === mountOwnerId) {
          interaction.removePointer(pointerId);
          continue;
        }
        const object = entry.targetRayObject;
        if (!object) continue;
        active.add(pointerId);
        raycaster.setFromXRController(object);
        const intersection = raycaster.intersectObject(render.mesh, false)[0] ?? null;
        interaction.updateFromIntersection({
          id: pointerId,
          intersection,
          pressed: buttonPressed(entry),
          inputState: entry.inputState,
        });
        surfaceHovered ||= Boolean(intersection);
      }
      const status = interaction.getStatus();
      for (const pointer of status.pointers) {
        if (!active.has(pointer.id)) interaction.removePointer(pointer.id);
      }
      const pointers = interaction.getStatus().pointers;
      const hovered = pointers.some((pointer) => Boolean(pointer.hoveredControlId));
      const captureGameplay = pointers.some((pointer) => (
        Boolean(pointer.hoveredControlId) || Boolean(pointer.capturedControlId)
      ));
      lastInteraction = Object.freeze({
        hovered,
        surfaceHovered,
        captureGameplay,
        pointers: pointers.length,
        mounted: Boolean(mount),
        mountOwnerId,
        mountMode,
      });
      return lastInteraction;
    },
    getStatus() {
      return Object.freeze({
        disposed,
        mounted: Boolean(mount),
        mountOwnerId,
        mountMode,
        interactionSummary: lastInteraction,
        panel: panel.snapshot(),
        interaction: interaction.getStatus(),
      });
    },
    dispose() {
      if (disposed) return;
      interaction.dispose();
      render.dispose();
      panel.dispose();
      mount = null;
      mountOwnerId = null;
      mountMode = 'hidden';
      disposed = true;
    },
  });
}
