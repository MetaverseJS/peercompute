import * as THREE from 'three';

export class TronScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.players = new Map();
    this.localPlayerId = null;
    
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000428); // Dark blue background

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 20, 30);
    this.camera.lookAt(0, 0, 0);

    // Create renderer with XR support
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true; // Enable WebXR
    this.container.appendChild(this.renderer.domElement);

    // WebXR state
    this.vrControllers = [];
    this.vrControllerGrips = [];
    this.vrMode = false;
    this.vrPlayerOffset = new THREE.Vector3();
    
    // Create camera rig for VR
    this.cameraRig = new THREE.Group();
    this.cameraRig.add(this.camera);
    this.scene.add(this.cameraRig);

    // Setup VR controllers
    this.setupVRControllers();

    // Create infinite grid
    this.createGrid();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createGrid() {
    this.gridSize = 1000;
    
    // Create shader-based grid that renders properly from all angles
    const gridShader = {
      vertexShader: `
        varying vec3 worldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          worldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 worldPosition;
        uniform float gridSize;
        uniform vec3 gridColor;
        uniform vec3 backgroundColor;
        
        float getGrid(float coord, float gridSize) {
          float line = abs(fract(coord / gridSize - 0.5) - 0.5) / fwidth(coord / gridSize);
          return min(line, 1.0);
        }
        
        void main() {
          float x = getGrid(worldPosition.x, 10.0);
          float z = getGrid(worldPosition.z, 10.0);
          float grid = 1.0 - min(x, z);
          
          vec3 color = mix(backgroundColor, gridColor, grid);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        gridSize: { value: 10.0 },
        gridColor: { value: new THREE.Color(0x00ffff) },
        backgroundColor: { value: new THREE.Color(0x001040) }
      }
    };

    const gridMaterial = new THREE.ShaderMaterial({
      vertexShader: gridShader.vertexShader,
      fragmentShader: gridShader.fragmentShader,
      uniforms: gridShader.uniforms,
      side: THREE.DoubleSide
    });

    this.floorGeometry = new THREE.PlaneGeometry(this.gridSize, this.gridSize);
    this.floor = new THREE.Mesh(this.floorGeometry, gridMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = 0;
    this.scene.add(this.floor);
  }

  expandGrid(playerPosition) {
    // Check if player is getting close to grid edge
    const distanceFromCenter = Math.sqrt(
      playerPosition.x * playerPosition.x + 
      playerPosition.z * playerPosition.z
    );
    
    // Expand if within 30% of edge
    const expansionThreshold = this.gridSize * 0.35;
    if (distanceFromCenter > expansionThreshold) {
      // Remove old floor
      this.scene.remove(this.floor);
      
      // Increase size
      this.gridSize += 200;
      
      // Create shader-based grid
      const gridShader = {
        vertexShader: `
          varying vec3 worldPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            worldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 worldPosition;
          uniform float gridSize;
          uniform vec3 gridColor;
          uniform vec3 backgroundColor;
          
          float getGrid(float coord, float gridSize) {
            float line = abs(fract(coord / gridSize - 0.5) - 0.5) / fwidth(coord / gridSize);
            return min(line, 1.0);
          }
          
          void main() {
            float x = getGrid(worldPosition.x, 10.0);
            float z = getGrid(worldPosition.z, 10.0);
            float grid = 1.0 - min(x, z);
            
            vec3 color = mix(backgroundColor, gridColor, grid);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        uniforms: {
          gridSize: { value: 10.0 },
          gridColor: { value: new THREE.Color(0x00ffff) },
          backgroundColor: { value: new THREE.Color(0x001040) }
        }
      };

      const gridMaterial = new THREE.ShaderMaterial({
        vertexShader: gridShader.vertexShader,
        fragmentShader: gridShader.fragmentShader,
        uniforms: gridShader.uniforms,
        side: THREE.DoubleSide
      });

      this.floorGeometry = new THREE.PlaneGeometry(this.gridSize, this.gridSize);
      this.floor = new THREE.Mesh(this.floorGeometry, gridMaterial);
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.position.y = 0;
      this.scene.add(this.floor);
      
      console.log('Grid expanded to size:', this.gridSize);
    }
  }

  createPlayer(id, color, position) {
    // Create cube for player (6x6x6 - twice as big)
    const geometry = new THREE.BoxGeometry(6, 6, 6);
    
    // Create materials array for each face
    const materials = [];
    for (let i = 0; i < 6; i++) {
      materials.push(new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 100
      }));
    }
    
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(position.x, position.y, position.z);
    cube.userData.videoTexture = null;
    cube.userData.videoElement = null;

    // Add glow effect (proportionally bigger, offset back by 1.4 units)
    const glowGeometry = new THREE.BoxGeometry(7.2, 7.2, 7.2);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    //glow.position.z = 1.4; // Offset back so front of cube sticks through
    cube.add(glow);
    cube.userData.glow = glow;

    // Add direction arrow to show which way cube is facing
    const arrowLength = 8;
    const arrowDir = new THREE.Vector3(0, 0, -1); // Points forward (local -Z)
    const arrowOrigin = new THREE.Vector3(0, 4, 0); // Above the cube
    const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, color, 2, 1);
    arrow.visible = true; // Always visible to show orientation
    cube.add(arrow);
    cube.userData.directionArrow = arrow;

    // Add vertical light beam starting 500 units above the cube
    const beamHeight = 1000; // Very tall beam
    const beamStartOffset = 500; // Start 500 units above cube
    const beamGeometry = new THREE.CylinderGeometry(0.5, 0.5, beamHeight, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.y = beamStartOffset + (beamHeight / 2); // Start 500 units above, then center the beam
    cube.add(beam);
    cube.userData.lightBeam = beam;

    this.scene.add(cube);
    this.players.set(id, cube);

    return cube;
  }

  setPlayerVideoStream(id, stream) {
    const player = this.players.get(id);
    if (!player) {
      console.error('Player not found:', id);
      return;
    }
    if (!stream) {
      console.error('No stream provided for player:', id);
      return;
    }

    console.log('Setting video stream for player', id);
    console.log('Stream video tracks:', stream.getVideoTracks().length);

    // Store original color
    if (!player.userData.originalColor) {
      const firstMaterial = Array.isArray(player.material) ? player.material[0] : player.material;
      player.userData.originalColor = firstMaterial.color.clone();
    }

    // Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true; // Important for mobile
    video.muted = true; // Will control audio separately for proximity
    
    // Wait for video metadata to load before applying texture
    video.onloadedmetadata = () => {
      console.log('Video metadata loaded for', id, 'Dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      // Create video texture
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;
      
      // Apply to all faces for testing (will show on all sides)
      const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture
      });
      
      // Replace all materials with video material
      if (Array.isArray(player.material)) {
        player.material = player.material.map(() => videoMaterial.clone());
        player.material[4].map = videoTexture; // Front face gets the texture
      } else {
        player.material = videoMaterial;
      }
      
      // Store references
      player.userData.videoTexture = videoTexture;
      player.userData.videoElement = video;
      
      console.log('Applied video texture to player', id);
    };
    
    // Ensure video plays
    video.play().then(() => {
      console.log('Video playing for', id);
    }).catch(err => {
      console.error('Error playing video for', id, err);
    });
  }

  removePlayerVideoStream(id) {
    const player = this.players.get(id);
    if (!player) return;

    console.log('Removing video stream from player', id);

    // Stop and clean up video element
    if (player.userData.videoElement) {
      player.userData.videoElement.pause();
      player.userData.videoElement.srcObject = null;
      player.userData.videoElement = null;
    }

    // Dispose video texture
    if (player.userData.videoTexture) {
      player.userData.videoTexture.dispose();
      player.userData.videoTexture = null;
    }

    // Restore original colored materials
    if (player.userData.originalColor) {
      const materials = [];
      for (let i = 0; i < 6; i++) {
        materials.push(new THREE.MeshPhongMaterial({
          color: player.userData.originalColor,
          emissive: player.userData.originalColor,
          emissiveIntensity: 0.5,
          shininess: 100
        }));
      }
      player.material = materials;
    }

    console.log('Restored original materials for player', id);
  }

  updatePlayer(id, position, rotation = null) {
    const player = this.players.get(id);
    if (player) {
      // For local player, use direct position (no lerp) for precise physics
      // For remote players, use lerp to smooth network jitter
      if (id === this.localPlayerId) {
        player.position.set(position.x, position.y, position.z);
      } else {
        player.position.lerp(
          new THREE.Vector3(position.x, position.y, position.z),
          0.2
        );
      }
      
      // Update rotation if provided (for local player)
      if (rotation !== null) {
        player.rotation.y = rotation;
      }
    }
  }

  setPlayerName(id, name) {
    const player = this.players.get(id);
    if (!player) return;

    // Remove existing name label if any
    if (player.userData.nameLabel) {
      player.remove(player.userData.nameLabel);
    }

    if (!name) return;

    // Store the name for potential color changes
    player.userData.playerName = name;
    player.userData.nameColor = player.userData.nameColor || '#ffffff';

    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    // Draw text
    context.fillStyle = player.userData.nameColor;
    context.font = 'Bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 128, 32);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.set(0, 8, 0); // Above the cube
    sprite.scale.set(8, 2, 1);
    
    player.add(sprite);
    player.userData.nameLabel = sprite;
  }

  setPlayerNameColor(id, color) {
    const player = this.players.get(id);
    if (!player) return;

    // Store the new color
    player.userData.nameColor = color;

    // Recreate the name label with the new color
    if (player.userData.playerName) {
      this.setPlayerName(id, player.userData.playerName);
    }
  }

  updatePlayerColor(id, color) {
    const player = this.players.get(id);
    if (!player) return;

    // Update cube materials (handle both MeshPhongMaterial and MeshBasicMaterial)
    if (Array.isArray(player.material)) {
      player.material.forEach(mat => {
        mat.color.set(color);
        if (mat.emissive) {
          mat.emissive.set(color);
        }
      });
    } else {
      player.material.color.set(color);
      if (player.material.emissive) {
        player.material.emissive.set(color);
      }
    }

    // Update glow using stored reference
    if (player.userData.glow && player.userData.glow.material) {
      player.userData.glow.material.color.set(color);
    }

    // Update light beam
    if (player.userData.lightBeam) {
      player.userData.lightBeam.material.color.set(color);
    }

    // Update direction arrow
    if (player.userData.directionArrow) {
      player.userData.directionArrow.setColor(color);
    }
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (player) {
      this.scene.remove(player);
      this.players.delete(id);
    }
  }

  setLocalPlayer(id) {
    this.localPlayerId = id;
  }

  updateCamera(rotation = 0, pitch = 0, zoom = 1.0) {
    // Follow local player with rotation, pitch, and zoom
    if (this.localPlayerId) {
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) {
        const baseDistance = 15; // Base camera distance
        const distance = baseDistance * zoom; // Apply zoom to distance
        const baseHeight = 10;   // Base camera height
        
        // Calculate camera position based on rotation and pitch
        // Pitch affects the vertical position and distance
        const horizontalDistance = distance * Math.cos(pitch);
        const verticalOffset = distance * Math.sin(pitch);
        
        // Use direct positioning for immediate, smooth response
        this.camera.position.set(
          localPlayer.position.x + Math.sin(rotation) * horizontalDistance,
          localPlayer.position.y + baseHeight + verticalOffset,
          localPlayer.position.z + Math.cos(rotation) * horizontalDistance
        );
        
        // Look at a point offset from the player based on pitch
        const lookAtTarget = new THREE.Vector3(
          localPlayer.position.x,
          localPlayer.position.y - Math.tan(pitch) * 5,
          localPlayer.position.z
        );
        this.camera.lookAt(lookAtTarget);
      }
    }
  }

  updateCameraVR() {
    // In VR mode, camera rig follows player in third-person view
    if (this.localPlayerId && this.vrMode) {
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) {
        // Position camera rig behind and above player (third-person view)
        const distance = 15; // Same as desktop camera
        const height = 10;
        
        // Get player's rotation to position camera behind them
        const playerRotation = localPlayer.rotation.y;
        
        // Calculate position behind player
        this.cameraRig.position.set(
          localPlayer.position.x + Math.sin(playerRotation) * distance,
          localPlayer.position.y + height,
          localPlayer.position.z + Math.cos(playerRotation) * distance
        );
        
        // Rotate rig to face player
        this.cameraRig.rotation.y = playerRotation;
      }
    }
  }

  render(rotation = 0, pitch = 0, zoom = 1.0) {
    if (this.vrMode) {
      this.updateCameraVR();
    } else {
      this.updateCamera(rotation, pitch, zoom);
    }
    
    // Check if grid needs expansion
    const localPlayerPos = this.getLocalPlayerPosition();
    if (localPlayerPos) {
      this.expandGrid(localPlayerPos);
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  setupVRControllers() {
    // Setup VR controllers
    for (let i = 0; i < 2; i++) {
      // Controller (for input)
      const controller = this.renderer.xr.getController(i);
      controller.userData.isSelecting = false;
      controller.userData.isSqueezing = false;
      
      // Add event listeners
      controller.addEventListener('selectstart', () => {
        controller.userData.isSelecting = true;
      });
      controller.addEventListener('selectend', () => {
        controller.userData.isSelecting = false;
      });
      controller.addEventListener('squeezestart', () => {
        controller.userData.isSqueezing = true;
      });
      controller.addEventListener('squeezeend', () => {
        controller.userData.isSqueezing = false;
      });
      
      // Add visual ray
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ]);
      const line = new THREE.Line(geometry);
      line.scale.z = 5;
      controller.add(line);
      
      this.cameraRig.add(controller);
      this.vrControllers.push(controller);
      
      // Controller grip (for visual model)
      const controllerGrip = this.renderer.xr.getControllerGrip(i);
      
      // Add simple cube as controller model
      const cubeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.15);
      const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: i === 0 ? 0xff0000 : 0x0000ff,
        emissive: i === 0 ? 0xff0000 : 0x0000ff,
        emissiveIntensity: 0.5
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      controllerGrip.add(cube);
      
      this.cameraRig.add(controllerGrip);
      this.vrControllerGrips.push(controllerGrip);
    }
  }

  getVRControllerInput() {
    if (!this.vrMode || this.vrControllers.length === 0) {
      return { movement: { x: 0, z: 0 }, rotation: 0, jump: false };
    }
    
    const input = {
      movement: { x: 0, z: 0 },
      rotation: 0,
      jump: false
    };
    
    // Get gamepad data from controllers
    const session = this.renderer.xr.getSession();
    if (session && session.inputSources) {
      for (let i = 0; i < session.inputSources.length; i++) {
        const inputSource = session.inputSources[i];
        const gamepad = inputSource.gamepad;
        
        if (gamepad) {
          // Debug: Log gamepad info (only log if there's actual input to avoid spam)
          const hasInput = gamepad.axes.some(axis => Math.abs(axis) > 0.1);
          if (hasInput && !this._lastLogTime || Date.now() - this._lastLogTime > 1000) {
            console.log(`Controller ${inputSource.handedness}:`, 
              `axes: [${gamepad.axes.map(a => a.toFixed(2)).join(', ')}]`,
              `buttons: ${gamepad.buttons.length}`);
            this._lastLogTime = Date.now();
          }
          
          if (gamepad.axes.length >= 4) {
            if (inputSource.handedness === 'left') {
              // Left controller: movement (thumbstick at axes 2,3)
              input.movement.x = gamepad.axes[2]; // Left/right
              input.movement.z = -gamepad.axes[3]; // Forward/back (inverted)
            } else if (inputSource.handedness === 'right') {
              // Right controller: rotation (thumbstick at axes 2,3)
              input.rotation = -gamepad.axes[2]; // Rotation (inverted)
            }
          }
        }
        
        // Check for button presses (jump on trigger or grip)
        const controller = this.vrControllers[i];
        if (controller && (controller.userData.isSelecting || controller.userData.isSqueezing)) {
          input.jump = true;
        }
      }
    }
    
    return input;
  }

  enterVR() {
    if (!this.renderer.xr.isPresenting) {
      this.vrMode = true;
      // Store the offset between camera and local player
      const localPlayer = this.players.get(this.localPlayerId);
      if (localPlayer) {
        this.vrPlayerOffset.copy(this.camera.position).sub(localPlayer.position);
      }
    }
  }

  exitVR() {
    this.vrMode = false;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getLocalPlayerPosition() {
    if (this.localPlayerId) {
      const player = this.players.get(this.localPlayerId);
      if (player) {
        return {
          x: player.position.x,
          y: player.position.y,
          z: player.position.z
        };
      }
    }
    return null;
  }
}
