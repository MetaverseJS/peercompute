export function usesTouchControls(event, fallback = false) {
  if (event?.pointerType) return event.pointerType === 'touch';
  if (event?.type?.startsWith('touch')) return true;
  if (event?.type === 'keydown') return false;
  if (event?.sourceCapabilities) return event.sourceCapabilities.firesTouchEvents;
  return fallback;
}

const gameplayKeys = new Set(['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ']);
const isEditable = (target) => target?.isContentEditable || Boolean(target?.closest?.('input, textarea, select'));

export class PlayerController {
  constructor({ canvas = document.querySelector('#scene-container > canvas') } = {}) {
    this.keys = {};
    
    // Camera controls
    this.rotation = 0; // Camera rotation around Y axis (yaw)
    this.pitch = 0;    // Camera vertical rotation (pitch)
    this.maxPitch = Math.PI / 2 - 0.1; // Limit to prevent flipping
    this.zoom = 1.0;   // Zoom level
    this.minZoom = 0.3; // Minimum zoom (closest)
    this.maxZoom = 30.0; // Maximum zoom (farthest) - 10x increase
    this.zoomSpeed = 0.1; // Zoom speed for mousewheel
    
    // Input sensitivities
    this.turnSpeed = 0.05; // Arrow key turn speed
    this.mouseSensitivity = 0.002; // Mouse horizontal rotation sensitivity
    this.mouseSensitivityVertical = 0.0002; // Mouse vertical look sensitivity
    this.invertMouse = false; // Invert mouse Y-axis
    this.mobileMoveSensitivity = 1.0; // Movement joystick sensitivity
    this.mobileLookSensitivityH = 0.1; // Look joystick horizontal sensitivity
    this.mobileLookSensitivityV = 0.005; // Look joystick vertical sensitivity
    
    // Jump state
    this.jumpKeyPressed = false; // Track jump key state
    this.jumpTriggered = false; // Track mobile jump trigger
    
    // Mobile controls
    this.isMobile = false;
    this.moveJoystick = { x: 0, y: 0 };
    this.lookJoystick = { x: 0, y: 0 };
    this.joystickElements = null;
    this.mobileControls = null;
    this.touchResetters = [];
    
    this.setupEventListeners(canvas);
  }

  setMobileMode(enabled) {
    enabled = Boolean(enabled);
    if (this.isMobile === enabled) return;
    this.isMobile = enabled;
    if (enabled && !this.mobileControls) this.createMobileControls();
    if (this.mobileControls) this.mobileControls.hidden = !enabled;
    this.resetTouchInput();
  }

  resetTouchInput() {
    this.moveJoystick = { x: 0, y: 0 };
    this.lookJoystick = { x: 0, y: 0 };
    this.jumpTriggered = false;
    for (const reset of this.touchResetters) reset();
  }

  clearInput() {
    this.keys = {};
    this.jumpKeyPressed = false;
    this.resetTouchInput();
  }

  getMovementInput() {
    const key = (name) => Number(Boolean(this.keys[name]));
    const forward = Number(Boolean(this.keys.w || this.keys.arrowup)) - Number(Boolean(this.keys.s || this.keys.arrowdown));
    const strafe = key('d') - key('a');
    const joystick = this.isMobile ? this.moveJoystick : { x: 0, y: 0 };
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    return {
      forward: clamp(forward - joystick.y * this.mobileMoveSensitivity),
      strafe: clamp(strafe + joystick.x * this.mobileMoveSensitivity)
    };
  }

  createMobileControls() {
    // Create joystick container
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'mobile-controls';
    controlsDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    `;

    // Left joystick (movement)
    const leftJoy = this.createJoystick('left', 'Move');
    leftJoy.style.cssText += 'left: 50px; bottom: 50px;';
    
    // Right joystick (look)
    const rightJoy = this.createJoystick('right', 'Look');
    rightJoy.style.cssText += 'right: 50px; bottom: 50px;';

    // Jump button (center)
    const jumpButton = this.createJumpButton();
    
    controlsDiv.appendChild(leftJoy);
    controlsDiv.appendChild(jumpButton);
    controlsDiv.appendChild(rightJoy);
    document.body.appendChild(controlsDiv);
    this.mobileControls = controlsDiv;

    this.joystickElements = { left: leftJoy, right: rightJoy, jump: jumpButton };
    this.setupJoystickListeners(leftJoy, 'move');
    this.setupJoystickListeners(rightJoy, 'look');
    this.setupJumpButtonListener(jumpButton);
  }

  createJumpButton() {
    const button = document.createElement('div');
    button.className = 'jump-button';
    button.style.cssText = `
      position: absolute;
      width: 80px;
      height: 80px;
      left: 50%;
      bottom: 60px;
      transform: translateX(-50%);
      pointer-events: auto;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.3);
      border: 3px solid rgba(0, 255, 255, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: #00ffff;
      font-weight: bold;
      user-select: none;
      transition: all 0.1s;
      cursor: pointer;
    `;

    // Up arrow character
    button.textContent = '↑';

    // Add label
    const labelDiv = document.createElement('div');
    labelDiv.textContent = 'Jump';
    labelDiv.style.cssText = `
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      color: #00ffff;
      font-size: 12px;
      font-family: monospace;
      white-space: nowrap;
    `;
    button.appendChild(labelDiv);

    return button;
  }

  setupJumpButtonListener(button) {
    let touchId = null;

    const resetButton = () => {
      touchId = null;
      button.style.background = 'rgba(0, 255, 255, 0.3)';
      button.style.transform = 'translateX(-50%) scale(1)';
    };
    this.touchResetters.push(resetButton);

    button.addEventListener('touchstart', (e) => {
      if (!this.isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      
      if (touchId === null) {
        const touch = e.touches[0];
        touchId = touch.identifier;
        
        // Set jump trigger flag for physics to handle
        this.jumpTriggered = true;
        
        // Visual feedback
        button.style.background = 'rgba(0, 255, 255, 0.6)';
        button.style.transform = 'translateX(-50%) scale(0.9)';
      }
    });

    // Attach touchend directly to button for immediate response
    button.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      for (let touch of e.changedTouches) {
        if (touch.identifier === touchId) {
          resetButton();
          break;
        }
      }
    });

    button.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      for (let touch of e.changedTouches) {
        if (touch.identifier === touchId) {
          resetButton();
          break;
        }
      }
    });

    // Global fallback in case touch moves off button
    document.addEventListener('touchend', (e) => {
      if (touchId !== null) {
        for (let touch of e.changedTouches) {
          if (touch.identifier === touchId) {
            resetButton();
            break;
          }
        }
      }
    });

    document.addEventListener('touchcancel', (e) => {
      if (touchId !== null) {
        for (let touch of e.changedTouches) {
          if (touch.identifier === touchId) {
            resetButton();
            break;
          }
        }
      }
    });
  }

  createJoystick(side, label) {
    const container = document.createElement('div');
    container.className = `joystick-${side}`;
    container.style.cssText = `
      position: absolute;
      width: 120px;
      height: 120px;
      pointer-events: auto;
    `;

    const base = document.createElement('div');
    base.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.2);
      border: 2px solid rgba(0, 255, 255, 0.5);
    `;

    const stick = document.createElement('div');
    stick.className = 'stick';
    stick.style.cssText = `
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.6);
      border: 2px solid #00ffff;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.1s;
    `;

    const labelDiv = document.createElement('div');
    labelDiv.textContent = label;
    labelDiv.style.cssText = `
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      color: #00ffff;
      font-size: 12px;
      font-family: monospace;
      white-space: nowrap;
    `;

    container.appendChild(base);
    container.appendChild(stick);
    container.appendChild(labelDiv);

    return container;
  }

  setupJoystickListeners(joystick, type) {
    const stick = joystick.querySelector('.stick');
    const maxDistance = 35; // Max distance stick can move from center
    let touchId = null;

    const updateStick = (clientX, clientY) => {
      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxDistance;
        deltaY = Math.sin(angle) * maxDistance;
      }
      
      stick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
      
      // Normalize to -1 to 1
      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      
      if (type === 'move') {
        this.moveJoystick = { x: normalizedX, y: normalizedY };
      } else {
        this.lookJoystick = { x: normalizedX, y: normalizedY };
      }
    };

    const resetStick = () => {
      touchId = null;
      stick.style.transform = 'translate(-50%, -50%)';
      if (type === 'move') {
        this.moveJoystick = { x: 0, y: 0 };
      } else {
        this.lookJoystick = { x: 0, y: 0 };
      }
    };
    this.touchResetters.push(resetStick);

    const getTouchInBounds = (touches) => {
      const rect = joystick.getBoundingClientRect();
      for (let touch of touches) {
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          return touch;
        }
      }
      return null;
    };

    joystick.addEventListener('touchstart', (e) => {
      if (!this.isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      
      const touch = getTouchInBounds(e.touches);
      if (touch && touchId === null) {
        touchId = touch.identifier;
        updateStick(touch.clientX, touch.clientY);
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (this.isMobile && touchId !== null) {
        for (let touch of e.touches) {
          if (touch.identifier === touchId) {
            e.preventDefault();
            updateStick(touch.clientX, touch.clientY);
            break;
          }
        }
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      for (let touch of e.changedTouches) {
        if (touch.identifier === touchId) {
          touchId = null;
          resetStick();
          break;
        }
      }
    });

    document.addEventListener('touchcancel', (e) => {
      for (let touch of e.changedTouches) {
        if (touch.identifier === touchId) {
          touchId = null;
          resetStick();
          break;
        }
      }
    });
  }

  setupEventListeners(canvas) {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || e.isComposing || e.ctrlKey || e.metaKey || e.altKey || isEditable(e.target)
          || document.querySelector('dialog[open]')) return;
      const key = e.key.toLowerCase();
      if (!gameplayKeys.has(key)) return;
      // Space on a focused button belongs to that button, not the avatar.
      if (key === ' ' && e.target?.closest?.('button, [role="button"]')) return;
      e.preventDefault();
      this.setMobileMode(false);
      this.keys[key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    window.addEventListener('blur', () => this.clearInput());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.clearInput(); });
    document.addEventListener('focusin', (event) => { if (isEditable(event.target)) this.clearInput(); });

    // Mouse movement for rotation (when pointer is locked)
    document.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement) {
        // Horizontal rotation (yaw)
        this.rotation -= event.movementX * this.mouseSensitivity;
        
        // Vertical rotation (pitch) with separate sensitivity
        // Apply invert setting: default is non-inverted (+=), invertMouse makes it inverted (-=)
        if (this.invertMouse) {
          this.pitch -= event.movementY * this.mouseSensitivityVertical;
        } else {
          this.pitch += event.movementY * this.mouseSensitivityVertical;
        }
        
        // Clamp pitch to prevent flipping over
        this.pitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.pitch));
      }
    });

    // Only the world canvas owns wheel zoom. Dialogs, editors and other UI
    // (including image canvases) must retain native scrolling.
    window.addEventListener('wheel', (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || !event.deltaY ||
          event.target !== canvas || isEditable(event.target) ||
          event.target?.closest?.('dialog, [role="dialog"]') ||
          (document.pointerLockElement && document.pointerLockElement !== canvas)) return;
      event.preventDefault();
      
      // Zoom in/out with mousewheel
      const delta = event.deltaY > 0 ? this.zoomSpeed : -this.zoomSpeed;
      this.zoom += delta;
      
      // Clamp zoom level
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    }, { passive: false });

    // Touch events for pinch-to-zoom
    let touchDistance = 0;
    
    document.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        touchDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    });

    document.addEventListener('touchmove', (event) => {
      if (event.touches.length === 2) {
        event.preventDefault();
        
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const newDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        if (touchDistance > 0) {
          const delta = (newDistance - touchDistance) * 0.01;
          this.zoom -= delta; // Inverted: pinch in = zoom out, pinch out = zoom in
          
          // Clamp zoom level
          this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
        }
        
        touchDistance = newDistance;
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      touchDistance = 0;
    });
  }

  getRotation() {
    return this.rotation;
  }

  getPitch() {
    return this.pitch;
  }

  getZoom() {
    return this.zoom;
  }

  // Check if player should jump (for physics integration)
  shouldJump() {
    // A connected keyboard remains usable even on a touch-capable device.
    if (this.keys[' ']) {
      // Prevent repeated jumps by checking if key was just pressed
      if (!this.jumpKeyPressed) {
        this.jumpKeyPressed = true;
        return true;
      }
    } else {
      this.jumpKeyPressed = false;
    }
    return false;
  }

  setInvertMouse(invert) {
    this.invertMouse = invert;
  }
}
