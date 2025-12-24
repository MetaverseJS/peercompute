import './style.css';
import * as THREE from 'three';
import { P2PNetwork } from './p2p/network.js';
import { TronScene } from './renderer/scene.js';
import { PlayerController } from './controls/input.js';
import { PhysicsWorld } from './physics/world.js';

class CubeChat {
  constructor() {
    this.network = null;
    this.scene = null;
    this.controller = null;
    this.physics = null;
    this.remotePlayers = new Set();
    this.remoteBillboards = new Map(); // peerId -> {mesh, body, video}
    this.lastTime = performance.now();
    this.settingsShownOnce = false;
    this.screenStream = null;
    this.screenBillboard = null;
    this.screenBillboardBody = null;
  }

  async init() {
    // Show loading message
    const app = document.querySelector('#app');
    app.innerHTML = `
      <div id="loading">
        <h1>CubeChat</h1>
        <p>Initializing P2P Network...</p>
        <p style="font-size: 0.9em; color: #00ffff;">Click to start</p>
        <p style="font-size: 0.8em; color: #ffff00; max-width: 90%; margin: 0.5em auto;">📹 Share your voice and video to chat with other people!</p>
        <p style="font-size: 0.8em; color: #00cccc; max-width: 90%; margin: 0.5em auto;">WASD: Move | Mouse/Arrows: Look | Movement has momentum</p>
      </div>
      <div id="scene-container"></div>
      <div id="event-log"></div>
      <div id="vr-button" style="display: none;">Enter VR</div>
      <div id="settings-button">⚙️</div>
      <div id="settings-menu" style="display: none;">
        <div id="settings-close-x">✕</div>
        <h3>Settings</h3>
        <label>
          Name:
          <input type="text" id="player-name" maxlength="20" placeholder="Anonymous">
        </label>
        <label>
          Color:
          <input type="color" id="player-color">
        </label>
        <label>
          Mass:
          <input type="number" id="player-mass" min="0.1" max="100" step="0.1" value="5">
        </label>
        <label>
          Screen Height:
          <input type="number" id="screen-height" min="10" max="1000" step="10" value="100">
        </label>
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="invert-mouse" style="margin-right: 8px;">
          Invert Mouse Y-Axis
        </label>
        <div style="margin-top: 10px;">
          <button id="screen-share-toggle" style="width: 100%; margin-bottom: 5px;">Share Screen</button>
          <div id="screen-share-status" style="font-size: 0.8em; color: #00ffff; text-align: center;"></div>
        </div>
        <button id="save-settings">Save</button>
        <button id="close-settings">Close</button>
      </div>
    `;

    // Initialize event log system
    this.initEventLog();

    try {
      // Initialize P2P network
      this.network = new P2PNetwork();
      const localPlayer = await this.network.init();

      // Initialize physics world
      this.physics = new PhysicsWorld();

      // Initialize Three.js scene
      const container = document.querySelector('#scene-container');
      this.scene = new TronScene(container);

      // Create local player in scene
      this.scene.createPlayer(
        localPlayer.id,
        localPlayer.color,
        localPlayer.position
      );
      this.scene.setLocalPlayer(localPlayer.id);

      // Show direction arrow for local player
      const localPlayerMesh = this.scene.players.get(localPlayer.id);
      if (localPlayerMesh && localPlayerMesh.userData.directionArrow) {
        localPlayerMesh.userData.directionArrow.visible = true;
      }

      // Create physics body for local player
      this.physics.createPlayerBody(localPlayer.id, localPlayer.position);
      
      // Apply local video stream to own cube
      if (this.network.getLocalStream()) {
        this.scene.setPlayerVideoStream(localPlayer.id, this.network.getLocalStream());
      }

      // Initialize player controller
      this.controller = new PlayerController();

      // Set up network message handler
      this.network.onMessage((message) => {
        this.handleNetworkMessage(message);
      });

      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const loadingDiv = document.querySelector('#loading');
      const canvas = this.scene.renderer.domElement;
      
      if (isMobile) {
        // Mobile: just tap to start, no pointer lock
        loadingDiv.style.cursor = 'pointer';
        loadingDiv.addEventListener('click', () => {
          loadingDiv.style.display = 'none';
          this.controller.setMobileMode(true);
          // Show settings menu only the first time after loading screen closes
          if (!this.settingsShownOnce) {
            document.getElementById('settings-menu').style.display = 'block';
            this.settingsShownOnce = true;
          }
        });
      } else {
        // Desktop: use pointer lock
        canvas.addEventListener('click', () => {
          canvas.requestPointerLock();
        });

        loadingDiv.style.cursor = 'pointer';
        loadingDiv.addEventListener('click', () => {
          canvas.requestPointerLock();
        });

        // Remove loading screen when pointer is locked
        document.addEventListener('pointerlockchange', () => {
          if (document.pointerLockElement) {
            loadingDiv.style.display = 'none';
            // Show settings menu only the first time after loading screen closes
            if (!this.settingsShownOnce) {
              document.getElementById('settings-menu').style.display = 'block';
              this.settingsShownOnce = true;
              // Release pointer lock when showing settings
              document.exitPointerLock();
            }
          }
        });
      }

      // Initialize settings
      this.initSettings();

      // Initialize VR
      this.initVR();

      // Start game loop
      this.startGameLoop();

      console.log('Tron Overworld initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize:', error);
      app.innerHTML = `
        <div id="loading">
          <h1>Error</h1>
          <p style="max-width: 90%; margin: 0.5em auto;">Failed to initialize P2P network: ${error.message}</p>
          <p style="max-width: 90%; margin: 0.5em auto;">Please check the console for more details.</p>
        </div>
      `;
    }
  }

  handleNetworkMessage(message) {
    if (message.type === 'screen_stream_added') {
      // Screen share stream received - it will be picked up by proximity check
      console.log('Screen share stream received from', message.peerId);
      // The updateRemoteBillboardProximity() method will automatically apply it when in range
    } else if (message.type === 'player_update') {
      const { peerId, data } = message;

      // Add new remote player if not already tracked
      if (!this.remotePlayers.has(peerId)) {
        this.scene.createPlayer(peerId, data.color, data.position);
        this.physics.createPlayerBody(peerId, data.position);
        this.remotePlayers.add(peerId);
        
        // Apply name if available
        if (data.name) {
          this.scene.setPlayerName(peerId, data.name);
        }
        
        console.log('New player joined:', peerId);
        this.logEvent(`Player joined: ${data.name || peerId.substring(0, 8)}...`, 'join');
      } else {
        // Update existing player's name and color if changed
        if (data.name) {
          this.scene.setPlayerName(peerId, data.name);
        }
        if (data.color) {
          this.scene.updatePlayerColor(peerId, data.color);
        }
      }

      // Update remote player position in physics (for collisions)
      const physicsBody = this.physics.getPlayerBody(peerId);
      if (physicsBody) {
        physicsBody.position.set(data.position.x, data.position.y, data.position.z);
        if (data.velocity) {
          physicsBody.velocity.set(data.velocity.x, data.velocity.y, data.velocity.z);
        }
      }

      // Handle screen sharing state changes
      if (data.screenSharing && data.billboardData && !this.remoteBillboards.has(peerId)) {
        // Peer started screen sharing - create billboard
        this.createRemoteBillboard(peerId, data.billboardData, data.color, data.name);
      } else if (!data.screenSharing && this.remoteBillboards.has(peerId)) {
        // Peer stopped screen sharing - remove billboard
        this.removeRemoteBillboard(peerId);
      } else if (data.screenSharing && this.remoteBillboards.has(peerId)) {
        // Update billboard position and orientation from network data (no physics, direct positioning)
        const billboard = this.remoteBillboards.get(peerId);
        if (billboard && billboard.mesh && data.billboardData) {
          billboard.mesh.position.set(
            data.billboardData.position.x,
            data.billboardData.position.y,
            data.billboardData.position.z
          );
          
          // Update orientation if provided
          if (data.billboardData.quaternion) {
            billboard.mesh.quaternion.set(
              data.billboardData.quaternion.x,
              data.billboardData.quaternion.y,
              data.billboardData.quaternion.z,
              data.billboardData.quaternion.w
            );
          }
        }
      }

      // Update remote player position and rotation
      this.scene.updatePlayer(peerId, data.position, data.rotation);
      
      // Update proximity audio
      this.updateProximityAudio(peerId, data.position);
    } else if (message.type === 'player_leave') {
      const { peerId } = message;
      
      if (this.remotePlayers.has(peerId)) {
        this.scene.removePlayer(peerId);
        this.physics.removePlayerBody(peerId);
        this.remotePlayers.delete(peerId);
        
        // Clean up audio element
        const audio = document.getElementById(`audio-${peerId}`);
        if (audio) {
          audio.remove();
        }
        
        console.log('Player left:', peerId);
      }
    } else if (message.type === 'stream_added') {
      // Apply video stream to player cube
      this.scene.setPlayerVideoStream(message.peerId, message.stream);
      
      // Initialize audio for this peer
      const peerData = this.network.getPeers().find(p => p.id === message.peerId);
      if (peerData) {
        this.updateProximityAudio(message.peerId, peerData.position);
      }
      
      this.logEvent(`Video connected: ${message.peerId.substring(0, 8)}...`, 'video-success');
    } else if (message.type === 'stream_removed') {
      // Remove video texture from cube (revert to colored cube)
      this.scene.removePlayerVideoStream(message.peerId);
      
      // Clean up audio element
      const audio = document.getElementById(`audio-${message.peerId}`);
      if (audio) {
        audio.remove();
      }
      
      // Clear billboard video if it exists
      const billboard = this.remoteBillboards.get(message.peerId);
      if (billboard && billboard.video) {
        console.log('Clearing billboard video due to disconnect:', message.peerId);
        billboard.video.pause();
        billboard.video.srcObject = null;
        billboard.video = null;
        
        // Revert billboard to color
        const colorObj = new THREE.Color(billboard.ownerColor);
        billboard.mesh.material[4].map = null;
        billboard.mesh.material[4].color = colorObj;
        billboard.mesh.material[4].needsUpdate = true;
        billboard.mesh.material[5].map = null;
        billboard.mesh.material[5].color = colorObj;
        billboard.mesh.material[5].needsUpdate = true;
      }
      
      this.logEvent(`Video disconnected: ${message.peerId.substring(0, 8)}...`, 'video-fail');
    }
  }

  updateProximityAudio(peerId, remotePosition) {
    const stream = this.network.getRemoteStream(peerId);
    if (!stream) return;

    const localPos = this.scene.getLocalPlayerPosition();
    if (!localPos) return;

    // Calculate distance between players (grid squares are 10 units)
    const dx = remotePosition.x - localPos.x;
    const dz = remotePosition.z - localPos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Get audio tracks
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    // Find or create audio element for this peer
    let audio = document.getElementById(`audio-${peerId}`);
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = `audio-${peerId}`;
      audio.srcObject = new MediaStream(audioTracks);
      audio.autoplay = true;
      document.body.appendChild(audio);
      
      // Explicitly play audio (required by browser autoplay policies)
      audio.play().catch(err => {
        console.warn('Audio autoplay blocked for', peerId, '- user interaction required:', err);
      });
    }

    // Set volume based on proximity
    const proximityRange = 400;
    if (distance <= proximityRange) {
      const volume = 1 - (distance / proximityRange);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.muted = false;
    } else {
      audio.muted = true;
    }
  }

  startGameLoop() {
    // Use setAnimationLoop for VR compatibility
    this.scene.renderer.setAnimationLoop((currentTime) => {
      // Calculate delta time
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // Update mobile look controls if needed
      this.updateMobileLook();

      // Get input from controller
      const rotation = this.controller.getRotation();
      const pitch = this.controller.getPitch();
      const zoom = this.controller.getZoom();
      
      // Apply player input to physics (pass deltaTime for frame-rate independence)
      this.applyPlayerInput(deltaTime);

      // Step physics simulation
      this.physics.step(deltaTime);

      // Sync visual representation with physics
      this.syncPhysicsToScene();

      // Stabilize player rotation (keep upright) and sync Y rotation with controller
      this.physics.stabilizeRotation(this.network.localPlayer.id);
      
      // Sync physics body's Y rotation with visual rotation
      const localPlayerMesh = this.scene.players.get(this.network.localPlayer.id);
      if (localPlayerMesh) {
        const body = this.physics.getPlayerBody(this.network.localPlayer.id);
        if (body) {
          // Set physics body rotation to match visual rotation (Y-axis only)
          const yRotation = this.controller.getRotation();
          body.quaternion.setFromEuler(0, yRotation, 0);
        }
      }

      // Update network with physics state
      const physicsPos = this.physics.getPosition(this.network.localPlayer.id);
      const physicsVel = this.physics.getVelocity(this.network.localPlayer.id);
      
      if (physicsPos) {
        const updateData = {
          position: physicsPos,
          velocity: physicsVel,
          rotation: rotation
        };
        
        // Include billboard position and orientation if screen sharing
        if (this.screenBillboardBody) {
          updateData.billboardData = {
            position: {
              x: this.screenBillboardBody.position.x,
              y: this.screenBillboardBody.position.y,
              z: this.screenBillboardBody.position.z
            },
            quaternion: {
              x: this.screenBillboardBody.quaternion.x,
              y: this.screenBillboardBody.quaternion.y,
              z: this.screenBillboardBody.quaternion.z,
              w: this.screenBillboardBody.quaternion.w
            },
            height: parseFloat(localStorage.getItem('screenHeight')) || 100,
            width: this.screenBillboard.geometry.parameters.width,
            aspectRatio: this.screenBillboard.geometry.parameters.width / this.screenBillboard.geometry.parameters.height
          };
        }
        
        this.network.updateLocalPlayer(updateData);
      }

      // Update remote billboard proximity (for video streaming)
      this.updateRemoteBillboardProximity();

      // Render scene with current rotation, pitch, and zoom
      this.scene.render(rotation, pitch, zoom);
    });
  }

  applyPlayerInput(deltaTime) {
    // Get movement input from controller or VR
    let forwardBack = this.getForwardBackInput();
    let leftRight = this.getLeftRightInput();
    let vrJump = false;
    
    // Override with VR input if in VR mode
    if (this.scene.vrMode) {
      const vrInput = this.scene.getVRControllerInput();
      forwardBack = vrInput.movement.z;
      leftRight = vrInput.movement.x;
      vrJump = vrInput.jump;
      
      // Apply VR rotation input
      if (Math.abs(vrInput.rotation) > 0.1) {
        this.controller.rotation += vrInput.rotation * 0.05;
      }
    }

    // Apply movement force if there's input
    if (forwardBack !== 0 || leftRight !== 0) {
      const localPlayerMesh = this.scene.players.get(this.network.localPlayer.id);
      if (localPlayerMesh) {
        // Get world-space direction vectors from the cube's orientation
        const forward = new THREE.Vector3(0, 0, -1); // Local forward is -Z
        const right = new THREE.Vector3(1, 0, 0);    // Local right is +X
        
        // Transform to world space using cube's rotation
        forward.applyQuaternion(localPlayerMesh.quaternion);
        right.applyQuaternion(localPlayerMesh.quaternion);
        
        // Combine based on input
        const direction = new THREE.Vector3();
        direction.addScaledVector(forward, forwardBack);
        direction.addScaledVector(right, leftRight);
        direction.normalize();
        
        // Get player's mass and scale force to maintain constant acceleration
        const body = this.physics.getPlayerBody(this.network.localPlayer.id);
        const playerMass = body ? body.mass : 5;
        
        // Apply force along this direction (scaled by mass for constant acceleration)
        const baseAcceleration = 20; // Base acceleration constant
        const forceMagnitude = baseAcceleration * playerMass;
        this.physics.applyMovementForce(
          this.network.localPlayer.id,
          { x: direction.x, z: direction.z },
          forceMagnitude
        );
      }
    }

    // Check for jump input (keyboard, mobile, or VR)
    const shouldJump = this.controller.shouldJump();
    const shouldMobileJump = this.shouldMobileJump();
    
    if (shouldJump || shouldMobileJump || vrJump) {
      this.physics.jump(this.network.localPlayer.id, 300);
    }
  }

  shouldMobileJump() {
    // For mobile, check if jump was triggered
    if (this.controller.isMobile && this.controller.jumpTriggered) {
      this.controller.jumpTriggered = false;
      return true;
    }
    return false;
  }

  getForwardBackInput() {
    if (this.controller.isMobile) {
      return -this.controller.moveJoystick.y * this.controller.mobileMoveSensitivity;
    } else {
      let input = 0;
      if (this.controller.keys['w'] || this.controller.keys['arrowup']) input += 1;
      if (this.controller.keys['s'] || this.controller.keys['arrowdown']) input -= 1;
      return input;
    }
  }

  getLeftRightInput() {
    if (this.controller.isMobile) {
      return this.controller.moveJoystick.x * this.controller.mobileMoveSensitivity;
    } else {
      let input = 0;
      if (this.controller.keys['a']) input -= 1;
      if (this.controller.keys['d']) input += 1;
      return input;
    }
  }

  initVR() {
    const vrButton = document.getElementById('vr-button');
    
    // Check if WebXR is supported
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
          vrButton.style.display = 'block';
          
          vrButton.addEventListener('click', async () => {
            if (!this.scene.renderer.xr.isPresenting) {
              // Enter VR
              try {
                const session = await navigator.xr.requestSession('immersive-vr', {
                  optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
                });
                
                await this.scene.renderer.xr.setSession(session);
                this.scene.enterVR();
                vrButton.textContent = 'Exit VR';
                
                // Handle session end
                session.addEventListener('end', () => {
                  this.scene.exitVR();
                  vrButton.textContent = 'Enter VR';
                });
                
                console.log('Entered VR mode');
              } catch (error) {
                console.error('Failed to enter VR:', error);
                this.logEvent('Failed to enter VR: ' + error.message, 'error');
              }
            } else {
              // Exit VR
              await this.scene.renderer.xr.getSession().end();
            }
          });
        } else {
          console.log('VR not supported on this device');
        }
      }).catch((error) => {
        console.error('Error checking VR support:', error);
      });
    } else {
      console.log('WebXR not available');
    }
  }

  updateMobileLook() {
    const turnSpeed = 0.05;
    const maxPitch = Math.PI / 2 - 0.1;
    
    // Process mobile look joystick
    if (this.controller.isMobile) {
      const lookJoy = this.controller.lookJoystick;
      
      // Horizontal look (rotation) with sensitivity
      if (Math.abs(lookJoy.x) > 0.1) {
        this.controller.rotation -= lookJoy.x * this.controller.mobileLookSensitivityH;
      }
      
      // Vertical look (pitch) with sensitivity
      if (Math.abs(lookJoy.y) > 0.1) {
        this.controller.pitch -= lookJoy.y * this.controller.mobileLookSensitivityV;
        this.controller.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.controller.pitch));
      }
    } else {
      // Process keyboard rotation (arrow keys and Q/E)
      if (this.controller.keys['arrowleft'] || this.controller.keys['q']) {
        this.controller.rotation += turnSpeed;
      }
      if (this.controller.keys['arrowright'] || this.controller.keys['e']) {
        this.controller.rotation -= turnSpeed;
      }
    }
  }

  syncPhysicsToScene() {
    // Update local player
    const localId = this.network.localPlayer.id;
    const localPhysicsPos = this.physics.getPosition(localId);
    
    if (localPhysicsPos) {
      this.scene.updatePlayer(localId, localPhysicsPos, this.controller.getRotation());
    }

    // Update remote players (sync their physics bodies with network data)
    for (const peerId of this.remotePlayers) {
      const remotePhysicsPos = this.physics.getPosition(peerId);
      if (remotePhysicsPos) {
        this.scene.updatePlayer(peerId, remotePhysicsPos);
      }
    }

    // Update screen billboard if it exists
    if (this.screenBillboard && this.screenBillboardBody) {
      this.screenBillboard.position.copy(this.screenBillboardBody.position);
      this.screenBillboard.quaternion.copy(this.screenBillboardBody.quaternion);
    }

    // Update remote billboards (no physics, they follow network position)
    this.remoteBillboards.forEach((billboard, peerId) => {
      if (billboard.mesh && billboard.nameLabel) {
        // Update name label to follow mesh
        const labelHeight = billboard.height / 2 + 20;
        billboard.nameLabel.position.set(
          billboard.mesh.position.x,
          billboard.mesh.position.y + labelHeight,
          billboard.mesh.position.z
        );
      }
    });
  }

  initEventLog() {
    const logContainer = document.getElementById('event-log');
    logContainer.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 600px;
      z-index: 2000;
      pointer-events: none;
      font-family: monospace;
      font-size: 14px;
    `;
  }

  logEvent(message, type = 'info') {
    const logContainer = document.getElementById('event-log');
    if (!logContainer) return;

    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const maxMessages = isMobile ? 1 : 5;

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    // Set color based on type
    let color = '#00ffff'; // default cyan
    let bgColor = 'rgba(0, 20, 40, 0.9)';
    
    if (type === 'join') {
      color = '#00ff00'; // green
    } else if (type === 'video-success') {
      color = '#00ffff'; // cyan
    } else if (type === 'video-fail') {
      color = '#ff6600'; // orange
    } else if (type === 'error') {
      color = '#ff0000'; // red
    }
    
    entry.style.cssText = `
      background: ${bgColor};
      color: ${color};
      padding: 8px 12px;
      margin-bottom: 5px;
      border-radius: 4px;
      border: 1px solid ${color};
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(entry);
    
    // Fade in
    setTimeout(() => {
      entry.style.opacity = '1';
    }, 10);
    
    // Fade out and remove after 5 seconds
    setTimeout(() => {
      entry.style.opacity = '0';
      setTimeout(() => {
        if (entry.parentNode) {
          entry.parentNode.removeChild(entry);
        }
      }, 300);
    }, 5000);
    
    // Keep only last N messages (1 on mobile, 5 on desktop)
    const entries = logContainer.querySelectorAll('.log-entry');
    if (entries.length > maxMessages) {
      const oldest = entries[0];
      oldest.style.opacity = '0';
      setTimeout(() => {
        if (oldest.parentNode) {
          oldest.parentNode.removeChild(oldest);
        }
      }, 300);
    }
  }

  initSettings() {
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    const saveButton = document.getElementById('save-settings');
    const closeButton = document.getElementById('close-settings');
    const closeX = document.getElementById('settings-close-x');
    const nameInput = document.getElementById('player-name');
    const colorInput = document.getElementById('player-color');
    const massInput = document.getElementById('player-mass');
    const screenHeightInput = document.getElementById('screen-height');
    const invertMouseInput = document.getElementById('invert-mouse');

    // Load saved settings
    const savedName = localStorage.getItem('playerName') || '';
    const savedColor = localStorage.getItem('playerColor') || this.network.localPlayer.color;
    const savedMass = parseFloat(localStorage.getItem('playerMass')) || 5;
    const savedScreenHeight = parseFloat(localStorage.getItem('screenHeight')) || 100;
    const savedInvertMouse = localStorage.getItem('invertMouse') === 'true';
    
    nameInput.value = savedName;
    colorInput.value = savedColor;
    massInput.value = savedMass;
    screenHeightInput.value = savedScreenHeight;
    invertMouseInput.checked = savedInvertMouse;
    
    // Apply saved settings
    if (savedName) {
      this.network.localPlayer.name = savedName;
      this.scene.setPlayerName(this.network.localPlayer.id, savedName);
    }
    if (savedColor !== this.network.localPlayer.color) {
      this.network.localPlayer.color = savedColor;
      this.scene.updatePlayerColor(this.network.localPlayer.id, savedColor);
    }
    // Apply saved mass
    const body = this.physics.getPlayerBody(this.network.localPlayer.id);
    if (body) {
      body.mass = savedMass;
      body.updateMassProperties();
    }
    
    // Apply saved invert mouse setting
    this.controller.setInvertMouse(savedInvertMouse);

    // Toggle settings menu
    settingsButton.addEventListener('click', () => {
      const isShowing = settingsMenu.style.display === 'none';
      settingsMenu.style.display = isShowing ? 'block' : 'none';
      
      // Release pointer lock when showing settings
      if (isShowing && document.pointerLockElement) {
        document.exitPointerLock();
      }
    });

    // Close settings with button
    closeButton.addEventListener('click', () => {
      settingsMenu.style.display = 'none';
    });

    // Close settings with X
    closeX.addEventListener('click', () => {
      settingsMenu.style.display = 'none';
    });

    // Save settings
    saveButton.addEventListener('click', () => {
      const newName = nameInput.value.trim();
      const newColor = colorInput.value;
      const newMass = parseFloat(massInput.value) || 1;
      const newScreenHeight = parseFloat(screenHeightInput.value) || 100;
      const newInvertMouse = invertMouseInput.checked;
      
      // Update local player
      this.network.localPlayer.name = newName;
      this.network.localPlayer.color = newColor;
      
      // Save to localStorage
      localStorage.setItem('playerName', newName);
      localStorage.setItem('playerColor', newColor);
      localStorage.setItem('playerMass', newMass.toString());
      localStorage.setItem('screenHeight', newScreenHeight.toString());
      localStorage.setItem('invertMouse', newInvertMouse.toString());
      
      // Update visuals
      this.scene.updatePlayerColor(this.network.localPlayer.id, newColor);
      this.scene.setPlayerName(this.network.localPlayer.id, newName);
      
      // Update physics mass
      const body = this.physics.getPlayerBody(this.network.localPlayer.id);
      if (body) {
        body.mass = newMass;
        body.updateMassProperties();
      }
      
      // Apply invert mouse setting
      this.controller.setInvertMouse(newInvertMouse);
      
      // Broadcast updated info
      this.network.broadcastPlayerState();
      
      // Close menu
      settingsMenu.style.display = 'none';
      
      console.log('Settings saved:', newName, newColor, 'Mass:', newMass);
    });

    // Screen share toggle
    const screenShareToggle = document.getElementById('screen-share-toggle');
    const screenShareStatus = document.getElementById('screen-share-status');
    
    screenShareToggle.addEventListener('click', async () => {
      if (this.screenStream) {
        // Stop sharing
        this.stopScreenShare();
        screenShareToggle.textContent = 'Share Screen';
        screenShareStatus.textContent = '';
      } else {
        // Start sharing
        try {
          await this.startScreenShare();
          screenShareToggle.textContent = 'Stop Sharing';
          screenShareStatus.textContent = 'Screen is being shared';
        } catch (error) {
          console.error('Failed to share screen:', error);
          screenShareStatus.textContent = 'Failed to share screen';
          screenShareStatus.style.color = '#ff6600';
        }
      }
    });
  }

  async startScreenShare() {
    try {
      // Capture screen at 1fps for bandwidth efficiency
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          frameRate: { ideal: 1, max: 1 }
        },
        audio: false
      });

      // Get video track to get dimensions
      const videoTrack = this.screenStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const aspectRatio = settings.width / settings.height;

      // Get configured screen height
      const screenHeight = parseFloat(localStorage.getItem('screenHeight')) || 100;

      // Create billboard in front of player
      const playerPos = this.scene.getLocalPlayerPosition();
      const billboardPos = {
        x: playerPos.x,
        y: playerPos.y + (screenHeight / 2), // Center at half the height above ground
        z: playerPos.z + 100 // 100 units in front
      };

      this.createScreenBillboard(billboardPos, aspectRatio);

      // Notify network about screen sharing
      const billboardData = {
        position: billboardPos,
        height: screenHeight,
        width: screenHeight * aspectRatio,
        aspectRatio: aspectRatio
      };
      
      await this.network.startScreenSharing(this.screenStream, billboardData);

      // Handle when user stops sharing via browser UI
      videoTrack.onended = () => {
        this.stopScreenShare();
        document.getElementById('screen-share-toggle').textContent = 'Share Screen';
        document.getElementById('screen-share-status').textContent = '';
      };

      console.log('Screen sharing started');
    } catch (error) {
      throw error;
    }
  }

  createScreenBillboard(position, aspectRatio) {
    // Get screen height from settings
    const height = parseFloat(localStorage.getItem('screenHeight')) || 100;
    const width = height * aspectRatio;
    const depth = 10;

    // Create video element for texture
    const video = document.createElement('video');
    video.srcObject = this.screenStream;
    video.play();

    // Create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // Create billboard geometry and material
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x333333 }), // right
      new THREE.MeshBasicMaterial({ color: 0x333333 }), // left
      new THREE.MeshBasicMaterial({ color: 0x333333 }), // top
      new THREE.MeshBasicMaterial({ color: 0x333333 }), // bottom
      new THREE.MeshBasicMaterial({ map: videoTexture }), // front (screen)
      new THREE.MeshBasicMaterial({ map: videoTexture })  // back (screen)
    ];

    this.screenBillboard = new THREE.Mesh(geometry, materials);
    this.screenBillboard.position.set(position.x, position.y, position.z);
    this.scene.scene.add(this.screenBillboard);

    // Create physics body for billboard
    this.screenBillboardBody = this.physics.createBox(
      { x: position.x, y: position.y, z: position.z },
      { x: width, y: height, z: depth },
      50 // mass
    );

    console.log(`Created screen billboard: ${width.toFixed(1)}x${height}x${depth}, aspect ratio: ${aspectRatio.toFixed(2)}`);
  }

  stopScreenShare() {
    // Notify network that screen sharing stopped
    if (this.network) {
      this.network.stopScreenSharing();
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }

    if (this.screenBillboard) {
      // Dispose of video texture and materials
      this.screenBillboard.material.forEach(mat => {
        if (mat.map) {
          mat.map.dispose();
        }
        mat.dispose();
      });
      this.screenBillboard.geometry.dispose();
      this.scene.scene.remove(this.screenBillboard);
      this.screenBillboard = null;
    }

    if (this.screenBillboardBody) {
      this.physics.world.removeBody(this.screenBillboardBody);
      this.screenBillboardBody = null;
    }

    console.log('Screen sharing stopped');
  }

  createRemoteBillboard(peerId, billboardData, ownerColor, ownerName) {
    const { position, height, width, aspectRatio } = billboardData;
    const depth = 10;

    // Parse owner color to get RGB values
    const colorObj = new THREE.Color(ownerColor);

    // Create billboard geometry and material - initially with owner's color
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const materials = [
      new THREE.MeshBasicMaterial({ color: colorObj }), // right
      new THREE.MeshBasicMaterial({ color: colorObj }), // left
      new THREE.MeshBasicMaterial({ color: colorObj }), // top
      new THREE.MeshBasicMaterial({ color: colorObj }), // bottom
      new THREE.MeshBasicMaterial({ color: colorObj }), // front (will be video when in range)
      new THREE.MeshBasicMaterial({ color: colorObj })  // back (will be video when in range)
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(position.x, position.y, position.z);
    this.scene.scene.add(mesh);

    // Remote billboards don't have physics - they follow network position
    // Only the owner simulates physics
    const body = null;

    // Create name label above billboard
    const labelHeight = height / 2 + 20; // 20 units above top
    const nameLabel = this.createNameLabel(ownerName || peerId.substring(0, 8), ownerColor);
    nameLabel.position.set(position.x, position.y + labelHeight, position.z);
    this.scene.scene.add(nameLabel);

    // Store billboard data
    this.remoteBillboards.set(peerId, {
      mesh,
      body: null, // No physics body for remote billboards
      video: null,
      nameLabel,
      ownerColor,
      height,
      width,
      depth,
      proximityRange: height * 5 // Video visible within 5x billboard height
    });

    // Turn owner's cube name red
    this.scene.setPlayerNameColor(peerId, '#ff0000');

    console.log(`Created remote billboard for ${peerId}: ${width.toFixed(1)}x${height}x${depth}`);
  }

  removeRemoteBillboard(peerId) {
    const billboard = this.remoteBillboards.get(peerId);
    if (!billboard) return;

    // Clean up mesh
    if (billboard.mesh) {
      billboard.mesh.material.forEach(mat => {
        if (mat.map) {
          mat.map.dispose();
        }
        mat.dispose();
      });
      billboard.mesh.geometry.dispose();
      this.scene.scene.remove(billboard.mesh);
    }

    // No physics body to clean up for remote billboards

    // Clean up name label
    if (billboard.nameLabel) {
      this.scene.scene.remove(billboard.nameLabel);
    }

    // Clean up video element
    if (billboard.video) {
      billboard.video.pause();
      billboard.video.srcObject = null;
    }

    // Restore owner's cube name color
    this.scene.setPlayerNameColor(peerId, billboard.ownerColor);

    this.remoteBillboards.delete(peerId);
    console.log(`Removed remote billboard for ${peerId}`);
  }

  createNameLabel(text, color) {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    // Draw text
    context.fillStyle = '#00000088';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'Bold 60px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(50, 12.5, 1); // Scale to reasonable size

    return sprite;
  }

  updateRemoteBillboardProximity() {
    const localPos = this.scene.getLocalPlayerPosition();
    if (!localPos) return;

    this.remoteBillboards.forEach((billboard, peerId) => {
      // Calculate distance to billboard
      const billboardPos = billboard.mesh.position;
      const dx = billboardPos.x - localPos.x;
      const dy = billboardPos.y - localPos.y;
      const dz = billboardPos.z - localPos.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const inRange = distance <= billboard.proximityRange;
      
      // Get screen stream specifically (NOT camera stream)
      const screenStream = this.network.getRemoteScreenStream(peerId);
      
      // Update video texture based on proximity
      if (inRange && screenStream && !billboard.video) {
        // Create video element and apply to billboard
        const video = document.createElement('video');
        video.srcObject = screenStream;
        video.play().catch(err => console.warn('Video autoplay blocked:', err));
        billboard.video = video;

        // Create video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        // Apply to front and back faces (indices 4 and 5)
        // Set color to white to remove color filter
        billboard.mesh.material[4].map = videoTexture;
        billboard.mesh.material[4].color.setHex(0xffffff);
        billboard.mesh.material[4].needsUpdate = true;
        billboard.mesh.material[5].map = videoTexture;
        billboard.mesh.material[5].color.setHex(0xffffff);
        billboard.mesh.material[5].needsUpdate = true;

        console.log(`Applied screen stream to billboard ${peerId} (distance: ${distance.toFixed(1)})`);
      } else if (!inRange && billboard.video) {
        // Remove video texture, revert to color
        billboard.video.pause();
        billboard.video.srcObject = null;
        billboard.video = null;

        // Revert to owner's color
        const colorObj = new THREE.Color(billboard.ownerColor);
        billboard.mesh.material[4].map = null;
        billboard.mesh.material[4].color = colorObj;
        billboard.mesh.material[4].needsUpdate = true;
        billboard.mesh.material[5].map = null;
        billboard.mesh.material[5].color = colorObj;
        billboard.mesh.material[5].needsUpdate = true;

        console.log(`Removed video texture from billboard ${peerId} (distance: ${distance.toFixed(1)})`);
      }
    });
  }

  // Clean up on page unload
  destroy() {
    this.stopScreenShare();
    if (this.network) {
      this.network.stop();
    }
  }
}

// Initialize the application
const app = new CubeChat();
app.init();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  app.destroy();
});
