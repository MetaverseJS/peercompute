import * as THREE from 'three';
import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
import { NodeKernel } from '@peercompute/index.js';
import { CONFIG, GAME_NAMESPACE, GAME_VERSION, BUNDLE_HASH, PERSIST_KEY, PRESENCE_HEARTBEAT_MS, PEER_PRUNE_INTERVAL_MS, PEER_STALE_MS, STATE_POS_THRESHOLD, STATE_ROT_THRESHOLD, STATE_KEEPALIVE_MS, STATE_EVENT_MIN_MS, TIME_ANCHOR_KEY, isTerrainGenEnabled } from './config.js';
import { TimeSystem } from './systems/timeSystem.js';
import { TerrainGenerator } from './systems/terrainGenerator.js';
import { ELEV_MAX, TERRAIN_THRESHOLDS, SUMMIT_SEARCH } from './world/constants.js';
import { StateStore } from './world/stateStore.js';
import { TerrainCache } from './world/terrainCache.js';
import { computeTerrainChunk } from './world/terrainTask.js';

class VRButton {
  static createButton(renderer) {
    const button = document.createElement('button');
    button.id = 'VRButton';
    button.style.cssText = 'position:absolute;bottom:20px;right:20px;padding:12px 24px;border:1px solid white;border-radius:4px;background:rgba(0,0,0,0.6);color:white;font:normal 13px sans-serif;cursor:pointer;pointer-events:auto;';
    const showUnsupported = () => {
      button.textContent = 'VR NOT SUPPORTED';
      button.onclick = null;
    };
    const showEnter = () => {
      button.textContent = 'ENTER VR';
      button.onclick = async () => {
        try {
          const session = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor']
          });
          session.addEventListener('end', () => {
            button.textContent = 'ENTER VR';
          });
          renderer.xr.setSession(session);
          button.textContent = 'EXIT VR';
        } catch (e) {
          if (e?.name === 'AbortError') {
            console.warn('XR session aborted by user');
            button.textContent = 'ENTER VR';
            return;
          }
          console.warn('Failed to start XR session', e);
        }
      };
    };
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) showEnter(); else showUnsupported();
      }).catch(showUnsupported);
    } else {
      showUnsupported();
    }
    return button;
  }
}

export class Game {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.gameNamespace = GAME_NAMESPACE;
                this.peerMeshes = new Map();
                this.peers = new Map();
                this.terrainCache = null;
                this.chunkJobs = new Map();
                this.readyToRender = false;
                this.computeManager = null;
                this.computeReadyPromise = new Promise((resolve) => { this._resolveComputeReady = resolve; });
                this.spiralCache = new Map(); // cache of spiral offsets per radius
                this.visibilityHandler = null;
                this.backgroundHeartbeat = null;
                this.peerCleanupInterval = null;
                this.lastStateBroadcast = 0;
                this.attackEventsSeen = new Map();
                this.attackActiveUntil = 0;
                this.myColor = Math.random() * 0xffffff;
                this.spearThrustProgress = 0;
                this.killCount = this.persistedState?.kills || 0;
                this.peerKills = new Map();
                this.spearReach = this.getSpearReach();
                this.persistedState = this.loadPersistedState();
                this.lastPersistSave = 0;
                this.initThree();
                this.initTime();
                this.initTerrain();
                this.initPlayer();
                this.initSkyDome();
                this.initControls();
                
                this.chunks = new Map();
                this.chunkJobs = new Map();
                this.structures = new Map();
                this.collisionBoxes = []; // Store building collision boxes
                this.prevChunkX = null;
                this.prevChunkZ = null;
                this.mainTempleBeam = null;
                this.mainTempleApex = null;
                this.foundationInfo = null;
                this.globeMaterial = null;
                this.structureShadowCount = 0;
                this.lastSnowUpdate = 0;
                this.lastSnowSeason = null;
                this.fps = 0;
                this.lastFpsSample = performance.now();
                this.frameSamples = 0;
                this.baseFOV = 105; // Store base FOV (wider by default)
                this.godMode = false;
                this.wideFOV = false; // Track FOV state
                this.lastUpdate = Date.now();
                this.lastColorUpdate = 0; // Track terrain color updates
                this.lastShadowUpdate = 0; // Track shadow updates
                this.lastTimeSyncBroadcast = 0;
                this.lastStateSend = 0;
                this.lastSentState = {
                    position: new THREE.Vector3(),
                    rotationY: 0,
                    color: this.myColor
                };
                this.keys = {};
                this.currentSeed = CONFIG.WORLD_SEED; // Track current terrain seed
                this.terrainGenEnabled = isTerrainGenEnabled();
                this.pointerLocked = false;
                
                // VR state
                this.isInVR = false;
                this.vrTurning = false;
                this.vrJumpPressed = false;
                this.vrTorchPressed = false;
                
                this.hasTorch = false;
                this.hasSpear = true;
                this.templePosition = null;
                this.persistedState = this.loadPersistedState();
                if (this.persistedState?.kills !== undefined) {
                    this.killCount = this.persistedState.kills;
                    this.spearReach = this.getSpearReach();
                }
                this.lastPersistSave = 0;
                if (this.persistedState?.godMode !== undefined) {
                    this.godMode = !!this.persistedState.godMode;
                }
                if (this.persistedState?.wideFOV !== undefined) {
                    this.wideFOV = !!this.persistedState.wideFOV;
                }
                
                // Mobile detection and controls
                this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                this.touchControls = {
                    moveX: 0,
                    moveY: 0,
                    lookX: 0,
                    lookY: 0,
                    activeTouches: {}
                };
                
                this.initPlayerEquipment();
                this.applyLocalGrowth();
                if (this.isMobile) {
                    this.initMobileControls();
                }
                this.initMultiplayer();
                
                // Tree instancing - CRITICAL: Use InstancedMesh
                this.treeGeometryClose = new THREE.ConeGeometry(10, 10, 6);
                this.treeGeometryMedium = new THREE.ConeGeometry(10, 10, 3);
                this.treeMaterial = new THREE.MeshPhongMaterial({ color: 0x1a5010, shininess: 8, specular: 0x111111 });
                // Keep instance pools tighter to avoid overdraw; frustum culling stays disabled because instances span many chunks
                this.treeInstancedMeshClose = new THREE.InstancedMesh(this.treeGeometryClose, this.treeMaterial, 60000);
                this.treeInstancedMeshClose.castShadow = false; // avoid heavy shadow map cost for thousands of instances
                this.treeInstancedMeshClose.receiveShadow = true;
                this.treeInstancedMeshClose.frustumCulled = false;
                this.scene.add(this.treeInstancedMeshClose);
                this.treeInstancedMeshMedium = new THREE.InstancedMesh(this.treeGeometryMedium, this.treeMaterial, 40000);
                this.treeInstancedMeshMedium.castShadow = false;
                this.treeInstancedMeshMedium.receiveShadow = true;
                this.treeInstancedMeshMedium.frustumCulled = false;
                this.scene.add(this.treeInstancedMeshMedium);
                this.treeCountClose = 0;
                this.treeCountMedium = 0;
                this.terrainSharingEnabled = false; // disable network chunk sharing
                
            }
            
            loadPersistedState() {
                try {
                    const raw = localStorage.getItem(PERSIST_KEY);
                    if (!raw) return null;
                    return JSON.parse(raw);
                } catch (_) {
                    return null;
                }
            }
            
            savePersistedState() {
                try {
                    const payload = {
                        pos: { x: this.position.x, y: this.position.y, z: this.position.z },
                        yaw: this.yaw,
                        pitch: this.pitch,
                        godMode: this.godMode,
                        wideFOV: this.wideFOV,
                        kills: this.killCount,
                        time: {
                            multiplier: this.timeSystem?.timeMultiplier,
                            time: this.timeSystem?.getTime(),
                            sentAt: Date.now()
                        }
                    };
                    localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
                } catch (_) {
                    // ignore storage errors
                }
            }
            
            getScaleForKills(kills) {
                const k = Math.max(0, kills || 0);
                return 1 + 0.05 * k;
            }

            getSpearReach() {
                return this.getScaleForKills(this.killCount);
            }

            applyLocalGrowth() {
                const scale = this.getScaleForKills(this.killCount);
                if (this.rig) this.rig.scale.setScalar(scale);
                if (this.spear) this.spear.scale.setScalar(this.getSpearReach());
            }

            applyPeerGrowth(peerId, kills = 0) {
                const mesh = this.peerMeshes.get(peerId);
                if (!mesh || !mesh.group) return;
                const scale = this.getScaleForKills(kills);
                mesh.group.scale.setScalar(scale);
                if (mesh.spear) mesh.spear.scale.setScalar(this.getScaleForKills(kills));
            }
            
            initThree() {
                this.scene = new THREE.Scene();
                // Fog removed for long-range clarity
                
                // Calculate FOV based on aspect ratio (vertical FOV)
                const aspect = window.innerWidth / window.innerHeight;
                const vFOV = this.baseFOV;
                
                this.camera = new THREE.PerspectiveCamera(vFOV, aspect, 0.5, 4000000);
                this.rig = new THREE.Group();
                this.playerBody = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 2, 2),
                    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 })
                );
                this.playerBody.position.set(0, 1, 0);
                this.playerBody.add(this.camera); // head as child of body
                this.rig.add(this.playerBody);
                this.scene.add(this.rig);
                
                this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.renderer.xr.enabled = true; // Enable WebXR
                this.renderer.xr.setReferenceSpaceType('local-floor');
                
                // Add VR button
                document.body.appendChild(VRButton.createButton(this.renderer));
                
                window.addEventListener('resize', () => {
                    this.camera.aspect = window.innerWidth / window.innerHeight;
                    this.applyFovSetting();
                    this.renderer.setSize(window.innerWidth, window.innerHeight);
                });
                this.applyFovSetting();
            }
            
            initTime() { 
                this.timeSystem = new TimeSystem(); 
                if (this.persistedState?.time) {
                    this.timeSystem.applyRemoteSync(this.persistedState.time);
                }
            }
            initTerrain() { 
                this.terrainGen = this.terrainGenEnabled ? new TerrainGenerator(this.currentSeed) : null; 
            }
            
            findSummitLocation() {
                if (!this.terrainGen) return { x: 0, z: 0, h: 0 };
                const summitTh = TERRAIN_THRESHOLDS.summit;
                let best = { x: 0, z: 0, h: -Infinity };
                const step = SUMMIT_SEARCH.step;
                const radius = SUMMIT_SEARCH.radius;
                for (let x = -radius; x <= radius; x += step) {
                    for (let z = -radius; z <= radius; z += step) {
                        const h = this.terrainGen.getHeight(x, z);
                        if (h >= summitTh && h > best.h) {
                            best = { x, z, h };
                        }
                    }
                }
                return best;
            }

            ensureAboveGround(vec, extra = 4) {
                if (!this.terrainGen) return;
                const h = this.terrainGen.getHeight(vec.x, vec.z);
                if (vec.y < h + extra) vec.y = h + extra;
            }

            async loadRelayConfig() {
                try {
                    const res = await fetch('/relay-config.json');
                    if (res.ok) {
                        const json = await res.json();
                        return json;
                    }
                } catch (e) {
                    // ignore and use fallback
                }
                return { bootstrapPeers: [] };
            }
            
            async initMultiplayer() {
                const resolveComputeReady = () => {
                    if (this._resolveComputeReady) {
                        this._resolveComputeReady(true);
                        this._resolveComputeReady = null;
                    }
                };
                const startRenderLoop = async () => {
                    await this.generateInitialTerrain();
                    this.readyToRender = true;
                    this.applyFovSetting(); // ensure camera projection is set once render starts
                    this.renderer.setAnimationLoop(() => this.animate());
                    this.publishPlayerState();
                    this.broadcastTimeAnchor();
                    if (document.hidden) {
                        this.startBackgroundHeartbeat();
                    }
                };

                // Run offline if NodeKernel is unavailable; still render terrain/temple.
                if (!NodeKernel) {
                    console.warn('NodeKernel unavailable; running offline');
                    resolveComputeReady();
                    await startRenderLoop();
                    return;
                }
                try {
                    const cfg = await this.loadRelayConfig();
                    this.node = new NodeKernel({
                        bootstrapPeers: cfg.bootstrapPeers || [],
                        enablePersistence: true,
                        gameId: 'cb',
                        roomId: 'global',
                        docName: `peercompute-cb-${BUNDLE_HASH}`,
                        stateBroadcastNamespaces: [this.gameNamespace],
                        maxWorkers: 128,
                        enableWorkers: true,
                        disableStateNetworkProvider: false, // allow Yjs provider for terrain sync
                        disableStateBroadcast: false
                    });
                    await this.node.initialize();
                    await this.node.start();
                    this.stateManager = this.node.getStateManager();
                    this.network = this.node.getNetworkManager?.();
                    this.myPeerId = this.node.getStatus().network.peerId;
                    this.computeManager = this.node.getComputeManager();
                    resolveComputeReady();
                    // Re-enable local terrain cache (IndexedDB) without network sync
                    this.terrainCache = new TerrainCache(new StateStore(this.stateManager, 'terrain'), BUNDLE_HASH, true);
                    if (this.terrainSharingEnabled && this.network?.addMessageHandler) {
                        this.network.addMessageHandler((peerId, message) => this.handleNetworkMessage(peerId, message));
                    }
                this.syncExistingTimeAnchor();
                this.stateManager.observeNamespace(this.gameNamespace, (value, key) => {
                    if (key.startsWith('player-')) {
                        const id = key.replace('player-', '');
                        if (id === this.myPeerId) return;
                            this.applyRemotePlayer(id, value);
                        }
                        if (key.startsWith('attack-')) {
                            const attacker = key.replace('attack-', '');
                            this.handleRemoteAttack(attacker, value);
                        }
                        if (key === 'time' || key === TIME_ANCHOR_KEY) {
                            this.applyRemoteTimeSync(value);
                        }
                        if (key.startsWith('evt-')) {
                            const from = key.replace('evt-', '');
                            if (from === this.myPeerId) return;
                            this.handleRemoteEvent(from, value);
                        }
                    });
                    this.startPeerCleanup();
                    this.setupVisibilityHeartbeat();
                    window.addEventListener('beforeunload', () => {
                        this.stopBackgroundHeartbeat();
                        this.stopPeerCleanup();
                        this.savePersistedState();
                        if (this.visibilityHandler) {
                            document.removeEventListener('visibilitychange', this.visibilityHandler);
                            this.visibilityHandler = null;
                        }
                    this.stateManager?.deleteScoped(this.gameNamespace, `player-${this.myPeerId}`);
                    this.stateManager?.deleteScoped(this.gameNamespace, `evt-${this.myPeerId}`);
                });
            } catch (err) {
                console.error('Multiplayer init failed', err);
                resolveComputeReady();
            }
                // Always start the render loop, even if networking failed
                await this.computeReadyPromise;
                await startRenderLoop();
        }
            
            regenerateTerrain() {
                if (!this.terrainGenEnabled) return;
                // Generate new random seed
                this.currentSeed = Math.floor(Math.random() * 1000000);
                
                // Clear existing terrain
                for (const [key, chunk] of this.chunks) {
                    this.scene.remove(chunk.mesh);
                    if (chunk.mesh.geometry) chunk.mesh.geometry.dispose();
                    if (chunk.mesh.material) chunk.mesh.material.dispose();
                    if (chunk.snowMesh) {
                        this.scene.remove(chunk.snowMesh);
                        if (chunk.snowMesh.geometry) chunk.snowMesh.geometry.dispose();
                        if (chunk.snowMesh.material) chunk.snowMesh.material.dispose();
                    }
                    if (chunk.water) {
                        this.scene.remove(chunk.water);
                        if (chunk.water.geometry) chunk.water.geometry.dispose();
                        if (chunk.water.material) chunk.water.material.dispose();
                    }
                }
                this.chunks.clear();
                
                // Clear ALL structures (including temple complex)
                for (const [key, structure] of this.structures) {
                    structure.traverse((child) => {
                        if (child.isMesh) {
                            if (child.geometry) child.geometry.dispose();
                            if (child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach(mat => mat.dispose());
                                } else {
                                    child.material.dispose();
                                }
                            }
                        }
                    });
                    this.scene.remove(structure);
                }
                this.structures.clear();
                this.collisionBoxes = [];
                
                // Hide all trees
                const hideMatrix = new THREE.Matrix4();
                hideMatrix.makeScale(0, 0, 0);
                for (let i = 0; i < this.treeCountClose; i++) {
                    this.treeInstancedMeshClose.setMatrixAt(i, hideMatrix);
                }
                for (let i = 0; i < this.treeCountMedium; i++) {
                    this.treeInstancedMeshMedium.setMatrixAt(i, hideMatrix);
                }
                this.treeInstancedMeshClose.instanceMatrix.needsUpdate = true;
                this.treeInstancedMeshMedium.instanceMatrix.needsUpdate = true;
                this.treeCountClose = 0;
                this.treeCountMedium = 0;
                this.treeInstancedMeshClose.count = 0;
                this.treeInstancedMeshMedium.count = 0;
                this.prevChunkX = null;
                this.prevChunkZ = null;
                
                // Reinitialize terrain generator
                this.terrainGen = this.terrainGenEnabled ? new TerrainGenerator(this.currentSeed) : null;
                
                // Regenerate terrain around player
                this.generateInitialTerrain();
            }

            getChunkZone(playerDist) {
                // Aggressive LOD: exponentially fewer verts as distance grows; steps divide CHUNK_SIZE
                if (playerDist <= 1) {
                    return { name: 'close', terrainStep: 16, treeLevel: 'close' };  // 5x5 grid
                }
                if (playerDist <= 3) {
                    return { name: 'medium', terrainStep: 32, treeLevel: 'medium' }; // 3x3 grid
                }
                return { name: 'far', terrainStep: 64, treeLevel: null };           // 2x2 grid, no trees
            }

            getChunkZoneFromLod(lodStep) {
                if (lodStep <= 16) return { name: 'close', terrainStep: 16, treeLevel: 'close' };
                if (lodStep <= 32) return { name: 'medium', terrainStep: 32, treeLevel: 'medium' };
                return { name: 'far', terrainStep: 64, treeLevel: null };
            }

            requestMissingFarChunks(px, pz, offsets) {
                if (!this.network || !this.terrainSharingEnabled) return;
                const reversed = [...offsets].reverse(); // start from render edge inward
                for (const [dx, dz, dist] of reversed) {
                    const zone = this.getChunkZone(dist);
                    if (zone.name !== 'far') continue;
                    const cx = px + dx;
                    const cz = pz + dz;
                    const key = `${cx},${cz}`;
                    const cacheKey = this.getLodCacheKey(key, zone.terrainStep);
                    if (this.chunks.has(key) || this.chunkJobs.has(key)) continue;
                    if (this.requestedTerrain?.has(cacheKey)) continue;
                    if (this.terrainCache?.hasChunk(cacheKey)) continue;
                    if (!this.requestedTerrain) this.requestedTerrain = new Set();
                    this.requestedTerrain.add(cacheKey);
                    this.network.broadcast({
                        type: 'terrain-request',
                        data: { key: cacheKey }
                    }).catch?.(() => {});
                }
            }
            
            initPlayer() {
                // Spawn just outside the temple complex, facing north toward it
                const base = this.templePosition || { x: 0, z: 0 };
                const dir = new THREE.Vector2(0, 1).normalize(); // south side
                const offsetDist = 400;
                let spawnX = base.x + dir.x * offsetDist;
                let spawnZ = base.z + dir.y * offsetDist;
                let spawnHeight = this.terrainGen ? this.terrainGen.getHeight(spawnX, spawnZ) : 0;
                if (this.persistedState?.pos) {
                    spawnX = this.persistedState.pos.x;
                    spawnZ = this.persistedState.pos.z;
                    spawnHeight = this.persistedState.pos.y;
                }
                    this.position = new THREE.Vector3(spawnX, spawnHeight, spawnZ); // Above ground for VR/headset
                    this.velocity = new THREE.Vector3(0, 0, 0);
                    this.pitch = this.persistedState?.pitch ?? 0;
                    this.yaw = this.persistedState?.yaw ?? 0; // facing north
                    this.onGround = false;
                if (this.rig) this.rig.position.copy(this.position);
            }
            
            initPlayerEquipment() {
                // Torch (attach to left controller if available, else body)
                const torchGroup = new THREE.Group();
                
                const handle = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.04 / 3, 0.04 / 3, 0.5 / 3),
                    new THREE.MeshLambertMaterial({ color: 0x8b4513 })
                );
                handle.position.y = -0.5 / 3; // bottom aligns near controller
                torchGroup.add(handle);
                
                const flame = new THREE.Mesh(
                    new THREE.ConeGeometry(0.15 / 3, 0.4 / 3, 6),
                    new THREE.MeshBasicMaterial({ color: 0xff6600 })
                );
                flame.position.y = 0.25 / 3; // sit on top of shaft
                torchGroup.add(flame);
                
                torchGroup.position.set(-0.3, -0.5, -0.8);
                torchGroup.rotation.set(0, 0, Math.PI / 6);
                torchGroup.scale.setScalar(1 / 3);
                torchGroup.visible = false;
                this.torch = torchGroup;
                
                // Torch light
                this.torchLight = new THREE.PointLight(0xff6600, 100, 120, 1.4);
                this.torchLight.position.set(0, 0, 0);
                this.torchLight.castShadow = true;
                this.torchLight.shadow.mapSize.width = 1024;
                this.torchLight.shadow.mapSize.height = 1024;
                this.torchLight.shadow.bias = -0.0005;
                this.torchLight.shadow.radius = 2;
                this.torchLight.shadow.camera.near = 0.1;
                this.torchLight.shadow.camera.far = 120;
                this.torchLight.visible = false;
                this.torch.add(this.torchLight);
                
                // Spear
                const spearGroup = new THREE.Group();
                
                const shaft = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.03, 0.03, 1.2),
                    new THREE.MeshLambertMaterial({ color: 0x8b6914 })
                );
                shaft.position.y = -0.6;
                spearGroup.add(shaft);
                
                const blade = new THREE.Mesh(
                    new THREE.ConeGeometry(0.08, 0.25, 4),
                    new THREE.MeshLambertMaterial({ color: 0x888888 })
                );
                blade.position.y = 0.1;
                spearGroup.add(blade);
                
                spearGroup.position.set(0.6, -0.7, -0.5);
                spearGroup.rotation.set(-Math.PI / 4, 0, Math.PI / 12);
                this.spear = spearGroup;
                this.attachWeaponsDesktop();
            }
            
            initSkyDome() {
                // Sky dome that follows player
                const skyGeo = new THREE.SphereGeometry(8000 * 8, 32, 32);
                const skyMat = new THREE.MeshBasicMaterial({ 
                    color: 0x87CEEB, 
                    side: THREE.BackSide 
                });
                this.skyDome = new THREE.Mesh(skyGeo, skyMat);
                this.scene.add(this.skyDome);
                
                // Stars on inner surface of dome - properly randomized
                const starGeo = new THREE.BufferGeometry();
                const starVerts = [];
                const starSizes = [];
                const starBrightness = [];
                
                for (let i = 0; i < 3000; i++) {
                    // Proper uniform random distribution on sphere
                    const u = Math.random();
                    const v = Math.random();
                    const theta = 2 * Math.PI * u;
                    const phi = Math.acos(2 * v - 1);
                    
                    const r = 7950 * 8;
                    const x = r * Math.sin(phi) * Math.cos(theta);
                    const y = r * Math.sin(phi) * Math.sin(theta);
                    const z = r * Math.cos(phi);
                    
                    starVerts.push(x, y, z);
                    
                    // Vary size and brightness - most stars small/dim, some large/bright
                    const brightness = 0.3 + Math.pow(Math.random(), 2) * 0.7; // 0.3-1.0, bias toward dimmer
                    const size = 1 + Math.pow(Math.random(), 1.5) * 3; // 1-4, bias toward smaller (50% of original 2-8)
                    
                    starSizes.push(size);
                    starBrightness.push(brightness);
                }
                
                starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
                starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
                starGeo.setAttribute('brightness', new THREE.Float32BufferAttribute(starBrightness, 1));
                
                this.stars = new THREE.Points(starGeo, new THREE.ShaderMaterial({
                    uniforms: {
                        color: { value: new THREE.Color(0xffffff) },
                        opacity: { value: 1.0 }
                    },
                    vertexShader: `
                        attribute float size;
                        attribute float brightness;
                        varying float vBrightness;
                        void main() {
                            vBrightness = brightness;
                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                            gl_PointSize = size;
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `,
                    fragmentShader: `
                        uniform vec3 color;
                        uniform float opacity;
                        varying float vBrightness;
                        void main() {
                            gl_FragColor = vec4(color * vBrightness, vBrightness * opacity);
                        }
                    `,
                    transparent: true,
                    blending: THREE.AdditiveBlending
                }));
                this.stars.frustumCulled = false;
                this.scene.add(this.stars);
                
                // North Star (Polaris) - bright fixed point near celestial pole
                const northStarGeo = new THREE.PlaneGeometry(1600, 1600);
                const northStarMat = new THREE.ShaderMaterial({
                    transparent: true,
                    depthWrite: false,
                    depthTest: false,
                    blending: THREE.AdditiveBlending,
                    uniforms: {
                        time: { value: 0 },
                        color: { value: new THREE.Color(0xb8dfff) }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float time;
                        uniform vec3 color;
                        varying vec2 vUv;
                        void main() {
                            // Centered UV
                            vec2 uv = vUv * 2.0 - 1.0;
                            float r = length(uv);
                            
                            // Pulsing halo
                            float pulse = 0.5 + 0.5 * sin(time * 2.0);
                            float halo = exp(-r * 6.0) * (0.6 + 0.4 * pulse);
                            
                            // Diffraction spikes
                            float angle = atan(uv.y, uv.x);
                            float spikes = pow(abs(cos(angle * 4.0)), 24.0) * (0.4 + 0.6 * pulse);
                            
                            // Core
                            float core = exp(-r * 20.0);
                            
                            float brightness = core + halo + spikes;
                            vec3 col = color * brightness;
                            
                            // Subtle ring/bubble
                            float ring = smoothstep(0.4, 0.32, r) * 0.35;
                            float bubble = smoothstep(0.9, 0.4, r) * 0.25;
                            
                            col += color * ring * (0.6 + 0.4 * pulse);
                            col += vec3(0.8) * bubble;
                            
                            float alpha = clamp(brightness + ring * 0.6 + bubble, 0.0, 1.0);
                            gl_FragColor = vec4(col, alpha);
                        }
                    `
                });
                this.northStar = new THREE.Mesh(northStarGeo, northStarMat);
                this.northStarRadius = 7950 * 8 - 50;
                this.northStar.position.set(0, this.northStarRadius, 0);
                this.northStar.renderOrder = 999;
                this.skyDome.add(this.northStar);
                
                // Sun
                this.sun = new THREE.Mesh(
                    new THREE.SphereGeometry(120 * 8, 16, 16),
                    new THREE.MeshBasicMaterial({ color: 0xffff00 })
                );
                this.skyDome.add(this.sun);
                
                // Moon
                this.moon = new THREE.Mesh(
                    new THREE.SphereGeometry(100 * 8, 16, 16),
                    new THREE.MeshBasicMaterial({ color: 0xffffff })
                );
                this.skyDome.add(this.moon);
                
                // Northern Lights (Aurora Borealis) - cylindrical curtain around north celestial pole
                const auroraGeometry = new THREE.CylinderGeometry(
                    5000 * 8, 5000 * 8,  // radius top, radius bottom
                    4000 * 8,        // height
                    256,          // radial segments
                    64,          // height segments
                    true         // open ended
                );
                
                // Add wave distortion to cylinder with varied amplitudes/wavelengths
                const vertices = auroraGeometry.attributes.position.array;
                for (let i = 0; i < vertices.length; i += 3) {
                    const x = vertices[i];
                    const y = vertices[i + 1];
                    const z = vertices[i + 2];
                    const angle = Math.atan2(z, x);
                    const rBase = Math.sqrt(x * x + z * z);
                    // Multiple superimposed waves with slightly different scales/phases
                    const w1 = Math.sin(angle * 8 + y * 0.00035) * 4000;
                    const w2 = Math.sin(angle * 5.3 + y * 0.00022 + 1.1) * 2500;
                    const w3 = Math.sin(angle * -11.7 + y * 0.00048 - 0.6) * 1800;
                    const wave = w1 + w2 + w3;
                    const r = rBase + wave;
                    vertices[i] = Math.cos(angle) * r;
                    vertices[i + 2] = Math.sin(angle) * r;
                }
                auroraGeometry.computeVertexNormals();
                
                this.aurora = new THREE.Mesh(auroraGeometry, new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0 },
                        opacity: { value: 0 }
                    },
                    vertexShader: `
                        uniform float time;
                        varying vec2 vUv;
                        varying vec3 vPosition;
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            float angle = atan(pos.z, pos.x);
                            float radius = length(pos.xz);
                            float w1 = sin(angle * 8.0 + pos.y * 0.00035 + time * 0.6) * 3208.0;
                            float w2 = sin(angle * 5.3 + pos.y * 0.00022 + time * 0.5 + 1.1) * 2048.0;
                            float w3 = sin(angle * 11.7 + pos.y * 0.00048 + time * -0.3) * 666.0;
                            float yWave = sin(pos.y * 0.0008 + time * 0.7) * 200.0; // vertical traveling wave
                            pos.y += yWave;
                            float wave = w1 + w2 + w3;
                            float newR = radius + wave;
                            pos.x = cos(angle) * newR;
                            pos.z = sin(angle) * newR;
                            vPosition = pos;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float time;
                        uniform float opacity;
                        varying vec2 vUv;
                        varying vec3 vPosition;
                        
                        // 3D noise function for seamless wrapping
                        float noise3D(vec3 p) {
                            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                        }
                        
                        float smoothNoise3D(vec3 p) {
                            vec3 i = floor(p);
                            vec3 f = fract(p);
                            f = f * f * (3.0 - 2.0 * f);
                            
                            float a = noise3D(i);
                            float b = noise3D(i + vec3(1.0, 0.0, 0.0));
                            float c = noise3D(i + vec3(0.0, 1.0, 0.0));
                            float d = noise3D(i + vec3(1.0, 1.0, 0.0));
                            float e = noise3D(i + vec3(0.0, 0.0, 1.0));
                            float f1 = noise3D(i + vec3(1.0, 0.0, 1.0));
                            float g = noise3D(i + vec3(0.0, 1.0, 1.0));
                            float h = noise3D(i + vec3(1.0, 1.0, 1.0));
                            
                            float x1 = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                            float x2 = mix(mix(e, f1, f.x), mix(g, h, f.x), f.y);
                            
                            return mix(x1, x2, f.z);
                        }
                        
                        void main() {
                            // Map cylinder to 3D space for seamless wrapping
                            // Use normalized position on cylinder surface
                            float angle = atan(vPosition.z, vPosition.x);
                            float radius = sqrt(vPosition.x * vPosition.x + vPosition.z * vPosition.z);
                            
                            // Create 3D coordinates that wrap seamlessly around cylinder
                            vec3 p = vec3(
                                cos(angle) * 2.0,  // X wraps seamlessly
                                vPosition.y * 0.00005,  // Y is height (smoothed after 8x scale)
                                sin(angle) * 2.0   // Z wraps seamlessly
                            );
                            
                            // Add time-based flow
                            vec3 flow = vec3(time * 0.08, time * 0.04, time * 0.06);
                            
                            // Sample 3D noise at different scales
                            float n1 = smoothNoise3D(p + flow);
                            float n2 = smoothNoise3D(p * 1.5 + flow * 0.8);
                            float n3 = smoothNoise3D(p * 3.0 + flow * 0.5);
                            
                            float waves = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
                            
                            // Vertical gradient - fade at top and bottom
                            float verticalFade = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
                            
                            // Fade out near horizon (bottom of cylinder)
                            float horizonFade = smoothstep(0.0, 0.25, vUv.y);
                            
                            // Aurora colors - green, blue, purple, pink
                            vec3 green = vec3(0.3, 1.0, 0.4);
                            vec3 blue = vec3(0.2, 0.6, 1.0);
                            vec3 purple = vec3(0.8, 0.3, 1.0);
                            vec3 pink = vec3(1.0, 0.4, 0.7);
                            
                            // Mix colors based on noise and position (wider transitions)
                            vec3 color = mix(green, blue, smoothstep(0.25, 0.55, waves));
                            color = mix(color, purple, smoothstep(0.45, 0.75, n2));
                            color = mix(color, pink, smoothstep(0.55, 0.85, n3));
                            
                            // Brightness variation
                            float brightness = waves * verticalFade * horizonFade * (0.5 + n3 * 0.5);
                            
                            gl_FragColor = vec4(color * brightness, brightness * opacity * 1.5);
                        }
                    `,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide,
                    depthWrite: false
                }));
                
                // Orient cylinder toward north celestial pole at 65° latitude
                // Celestial pole is 65° above northern horizon
                const poleElevation = 65 * Math.PI / 180;
                this.aurora.rotation.x = Math.PI / 2 - poleElevation; // Tilt cylinder axis toward north celestial pole
                this.aurora.position.set(0, 1500 * 8, 0); // Centered on player, elevated
                this.scene.add(this.aurora);
                
                // Directional light (not parented to dome)
                const shadowRange = CONFIG.CHUNK_SIZE * 1.25; // tighter shadow frustum around the player
                this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
                this.sunLight.castShadow = true;
                this.sunLight.shadow.camera.left = -shadowRange;
                this.sunLight.shadow.camera.right = shadowRange;
                this.sunLight.shadow.camera.top = shadowRange;
                this.sunLight.shadow.camera.bottom = -shadowRange;
                this.sunLight.shadow.camera.near = 1;
                this.sunLight.shadow.camera.far = CONFIG.CHUNK_SIZE * 3;
                this.sunLight.shadow.mapSize.width = 2048;
                this.sunLight.shadow.mapSize.height = 2048;
                this.sunLight.shadow.bias = -0.0006;
                this.scene.add(this.sunLight);
                this.scene.add(this.sunLight.target);
                
                this.ambient = new THREE.AmbientLight(0x404040, 0.5);
                this.scene.add(this.ambient);
            }
            
            initControls() {
                window.addEventListener('keydown', (e) => {
                    this.keys[e.code] = true;
                    if (e.code === 'KeyG') this.godMode = !this.godMode;
                    if (e.code === 'KeyV') {
                        this.wideFOV = !this.wideFOV;
                        this.applyFovSetting();
                    }
                    if (e.code === 'KeyF') {
                        this.hasTorch = !this.hasTorch;
                        this.torch.visible = this.hasTorch;
                        this.torchLight.visible = this.hasTorch;
                    }
                    if (e.code === 'Equal') {
                        this.adjustTimeMultiplier(Math.min(this.timeSystem.timeMultiplier * 2, 128));
                    }
                    if (e.code === 'Minus') {
                        this.adjustTimeMultiplier(Math.max(this.timeSystem.timeMultiplier / 2, 0.25));
                    }
                    if (e.code === 'KeyR') {
                        this.regenerateTerrain();
                    }
                });
                window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
                // Pointer lock FPS look
                this.canvas.addEventListener('click', () => {
                    if (this.isInVR || this.isMobile) return;
                    if (document.pointerLockElement === this.canvas) return;
                    const res = this.canvas.requestPointerLock();
                    // Newer browsers return a promise; swallow rejections when user exits early
                    if (res && typeof res.catch === 'function') {
                        res.catch((err) => console.warn('Pointer lock request failed', err));
                    }
                });
                document.addEventListener('pointerlockchange', () => {
                    this.pointerLocked = document.pointerLockElement === this.canvas;
                });
                document.addEventListener('pointerlockerror', (e) => {
                    console.warn('Pointer lock error', e);
                    this.pointerLocked = false;
                });
                document.addEventListener('mousemove', (e) => {
                    if (this.pointerLocked && !this.isInVR) {
                        this.yaw -= e.movementX * 0.002;
                        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch - e.movementY * 0.002));
                    }
                });
                
                // VR Controllers
                this.initVRControllers();
                this.initAttackControls();
            }
            
            initVRControllers() {
                // Controller 0 (typically left hand)
                this.controller0 = this.renderer.xr.getController(0);
                this.controller0.addEventListener('connected', (event) => {
                    this.controller0.gamepad = event.data.gamepad;
                });
                this.playerBody.add(this.controller0);
                
                // Controller 1 (typically right hand)
                this.controller1 = this.renderer.xr.getController(1);
                this.controller1.addEventListener('connected', (event) => {
                    this.controller1.gamepad = event.data.gamepad;
                });
                this.playerBody.add(this.controller1);
                
                // Visual representation of controllers
                const controllerModelFactory = this.createControllerModel();
                
                this.controllerGrip0 = this.renderer.xr.getControllerGrip(0);
                this.controllerGrip0.add(controllerModelFactory.clone());
                this.playerBody.add(this.controllerGrip0);
                
                this.controllerGrip1 = this.renderer.xr.getControllerGrip(1);
                this.controllerGrip1.add(controllerModelFactory.clone());
                this.playerBody.add(this.controllerGrip1);
                
                // VR session tracking
                this.isInVR = false;
                this.renderer.xr.addEventListener('sessionstart', () => {
                    this.isInVR = true;
                    document.getElementById('ui').style.display = 'none'; // Hide 2D UI in VR
                    // XR uses its own render loop via setAnimationLoop
                    this.attachWeaponsVR();
                    this.ensureAboveGround(this.position, 6);
                    if (this.rig) this.rig.position.copy(this.position);
                    this.publishPlayerState();
                });
                this.renderer.xr.addEventListener('sessionend', () => {
                    this.isInVR = false;
                    document.getElementById('ui').style.display = 'block'; // Show 2D UI
                    this.attachWeaponsDesktop();
                });
            }

            initAttackControls() {
                window.addEventListener('mousedown', (e) => {
                    if (e.button === 0 && !this.isInVR) this.triggerAttack();
                });
                window.addEventListener('keydown', (e) => {
                    if (e.code === 'ControlLeft' || e.code === 'ControlRight') this.triggerAttack();
                });
                const attackBtn = document.getElementById('attackButton');
                if (attackBtn) {
                    attackBtn.style.display = this.isMobile ? 'block' : 'none';
                    const fire = (ev) => { ev.preventDefault(); this.triggerAttack(); };
                    attackBtn.addEventListener('touchstart', fire);
                    attackBtn.addEventListener('click', fire);
                }
            }
            
            createControllerModel() {
                // Simple controller visualization (line pointing forward)
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));
                const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
                return new THREE.Line(geometry, material);
            }
            
            getVRControllerInput() {
                // Read gamepad inputs from VR controllers; fallback to XR session inputSources
                const input = {
                    moveX: 0,
                    moveY: 0,
                    turnX: 0,
                    turnY: 0,
                    jump: false,
                    torch: false
                };

                const dead = (v) => Math.abs(v) > 0.1 ? v : 0;
                const readStick = (gp) => {
                    if (!gp || !gp.axes) return { x: 0, y: 0 };
                    // Some runtimes put thumbstick on axes[2]/[3]; others on [0]/[1]
                    if (gp.axes.length >= 4) {
                        return { x: dead(gp.axes[2] || 0), y: dead(gp.axes[3] || 0) };
                    }
                    return { x: dead(gp.axes[0] || 0), y: dead(gp.axes[1] || 0) };
                };

                const readButtons = (gp) => {
                    if (!gp?.buttons) return { trigger: false };
                    const b0 = gp.buttons[0];
                    return { trigger: !!(b0 && b0.pressed) };
                };

                // Prefer controller handles if connected
                const leftGp = this.controller0?.gamepad;
                const rightGp = this.controller1?.gamepad;
                const leftStick = readStick(leftGp);
                input.moveX = leftStick.x;
                input.moveY = leftStick.y;
                if (readButtons(leftGp).trigger) input.jump = true;

                const rightStick = readStick(rightGp);
                input.turnX = rightStick.x;
                input.turnY = rightStick.y;
                if (readButtons(leftGp).trigger) input.torch = true; // left trigger toggles torch

                // Fallback: iterate XR inputSources to find left/right hands
                const session = this.renderer.xr.getSession?.();
                if (session?.inputSources) {
                    for (const src of session.inputSources) {
                        if (!src.gamepad) continue;
                        const stick = readStick(src.gamepad);
                        if (src.handedness === 'left' && !leftGp) {
                            input.moveX = stick.x;
                            input.moveY = stick.y;
                            if (readButtons(src.gamepad).trigger) input.jump = true;
                        }
                        if (src.handedness === 'right' && !rightGp) {
                            input.turnX = stick.x;
                            input.turnY = stick.y;
                            if (readButtons(src.gamepad).trigger) input.torch = true;
                        }
                    }
                }

                return input;
            }

            attachWeaponsDesktop() {
                if (this.spear && this.camera) {
                    this.camera.add(this.spear);
                    this.spear.position.set(0.6, -0.5, -0.6); // grip near middle
                    this.spear.rotation.set(-Math.PI / 4, 0, Math.PI / 16);
                }
                if (this.torch && this.camera) {
                    this.camera.add(this.torch);
                    this.torch.position.set(-0.28, -0.65, -0.4); // hold near bottom
                    this.torch.rotation.set(-Math.PI / 12, 0, Math.PI / 10);
                    if (this.torchLight?.shadow) this.torchLight.shadow.needsUpdate = true;
                }
            }

            attachWeaponsVR() {
                if (this.spear && this.controllerGrip1) {
                    this.controllerGrip1.add(this.spear);
                    // Align spear with controller forward axis (-Z), centered at the grip
                    this.spear.position.set(0, -0.15, -0.05);
                    this.spear.rotation.set(-Math.PI / 2, 0, 0);
                }
                if (this.torch && this.controllerGrip0) {
                    this.controllerGrip0.add(this.torch);
                    // Torch aligned to controller forward axis (-Z)
                    this.torch.position.set(0, -0.05, 0.0); // bottom of shaft at controller
                    this.torch.rotation.set(-Math.PI / 2, 0, 0);
                    if (this.torchLight?.shadow) this.torchLight.shadow.needsUpdate = true;
                }
            }
            
            initMobileControls() {
                // Create twin stick UI
                const leftStick = document.createElement('div');
                leftStick.id = 'leftStick';
                leftStick.style.cssText = 'position:absolute; bottom:80px; left:60px; width:120px; height:120px; background:rgba(255,255,255,0.2); border-radius:50%; border:2px solid rgba(255,255,255,0.5); pointer-events:auto; touch-action:none;';
                
                const leftKnob = document.createElement('div');
                leftKnob.id = 'leftKnob';
                leftKnob.style.cssText = 'position:absolute; top:45px; left:45px; width:30px; height:30px; background:rgba(255,255,255,0.6); border-radius:50%; pointer-events:none;';
                leftStick.appendChild(leftKnob);
                
                const rightStick = document.createElement('div');
                rightStick.id = 'rightStick';
                rightStick.style.cssText = 'position:absolute; bottom:80px; right:60px; width:120px; height:120px; background:rgba(255,255,255,0.2); border-radius:50%; border:2px solid rgba(255,255,255,0.5); pointer-events:auto; touch-action:none;';
                
                const rightKnob = document.createElement('div');
                rightKnob.id = 'rightKnob';
                rightKnob.style.cssText = 'position:absolute; top:45px; left:45px; width:30px; height:30px; background:rgba(255,255,255,0.6); border-radius:50%; pointer-events:none;';
                rightStick.appendChild(rightKnob);
                
                document.body.appendChild(leftStick);
                document.body.appendChild(rightStick);
                
                // Touch handlers
                const handleTouch = (stick, isMove) => (e) => {
                    e.preventDefault();
                    const touches = e.touches;
                    const rect = stick.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    let touch = null;
                    for (let i = 0; i < touches.length; i++) {
                        const t = touches[i];
                        const dx = t.clientX - centerX;
                        const dy = t.clientY - centerY;
                        if (Math.sqrt(dx*dx + dy*dy) < 80) {
                            touch = t;
                            break;
                        }
                    }
                    
                    if (touch) {
                        const dx = touch.clientX - centerX;
                        const dy = touch.clientY - centerY;
                        const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 45);
                        const angle = Math.atan2(dy, dx);
                        
                        const knob = stick.children[0];
                        knob.style.left = (45 + Math.cos(angle) * dist) + 'px';
                        knob.style.top = (45 + Math.sin(angle) * dist) + 'px';
                        
                        if (isMove) {
                            this.touchControls.moveX = (dist / 45) * Math.cos(angle);
                            this.touchControls.moveY = (dist / 45) * Math.sin(angle);
                        } else {
                            this.touchControls.lookX = (dist / 45) * Math.cos(angle);
                            this.touchControls.lookY = (dist / 45) * Math.sin(angle);
                        }
                    } else {
                        const knob = stick.children[0];
                        knob.style.left = '45px';
                        knob.style.top = '45px';
                        if (isMove) {
                            this.touchControls.moveX = 0;
                            this.touchControls.moveY = 0;
                        } else {
                            this.touchControls.lookX = 0;
                            this.touchControls.lookY = 0;
                        }
                    }
                };
                
                leftStick.addEventListener('touchstart', handleTouch(leftStick, true));
                leftStick.addEventListener('touchmove', handleTouch(leftStick, true));
                leftStick.addEventListener('touchend', handleTouch(leftStick, true));
                
                rightStick.addEventListener('touchstart', handleTouch(rightStick, false));
                rightStick.addEventListener('touchmove', handleTouch(rightStick, false));
                rightStick.addEventListener('touchend', handleTouch(rightStick, false));
                
                // Add jump button
                const jumpBtn = document.createElement('button');
                jumpBtn.textContent = '↑';
                jumpBtn.style.cssText = 'position:absolute; bottom:220px; left:80px; width:60px; height:60px; font-size:24px; background:rgba(255,255,255,0.3); border:2px solid rgba(255,255,255,0.5); border-radius:50%; color:white; pointer-events:auto; touch-action:none;';
                jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys['Space'] = true; });
                jumpBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.keys['Space'] = false; });
                document.body.appendChild(jumpBtn);
                
                // Hide keyboard controls on mobile
                document.getElementById('controls').style.display = 'none';
            }
            
            async generateInitialTerrain() {
                if (!this.terrainGen) return;
                const startCx = Math.floor(this.position.x / CONFIG.CHUNK_SIZE);
                const startCz = Math.floor(this.position.z / CONFIG.CHUNK_SIZE);
                const offsets = this.getSpiralOffsets(2);
                for (const [dx, dz] of offsets) {
                    await this.generateChunk(startCx + dx, startCz + dz);
                }
                
                // Find and place temple complex on a summit
                this.templePosition = this.findSummitLocation();
                this.createTempleComplex(this.templePosition.x, this.templePosition.z);
                // If we don't have a persisted position, start the player near the temple
                if (!this.persistedState?.pos) {
                    const dir = new THREE.Vector2(0, 1).normalize();
                    const offsetDist = 400;
                    const spawnX = this.templePosition.x + dir.x * offsetDist;
                    const spawnZ = this.templePosition.z + dir.y * offsetDist;
                    const spawnHeight = this.terrainGen ? this.terrainGen.getHeight(spawnX, spawnZ) : 0;
                    this.position.set(spawnX, spawnHeight, spawnZ);
                    if (this.rig) this.rig.position.copy(this.position);
                }
                
                // Initialize terrain colors based on starting season
                this.updateTerrainColors();
            }
            
            createTempleComplex(centerX, centerZ) {
                if (!this.terrainGen) return;
                const groundHeight = this.terrainGen ? this.terrainGen.getHeight(centerX, centerZ) : 0;
                const complexKey = '0,0'; // Temple complex is at origin
                const obeliskRadius = 300; // 20% wider circle than before (was 250)
                const foundationTopRadius = obeliskRadius * 1.1; // 10% larger than obelisk circle diameter -> radius
                const foundationBottomRadius = 520;
                const samples = 24;
                let highest = groundHeight;
                let lowest = groundHeight;
                for (let i = 0; i < samples; i++) {
                    const ang = (i / samples) * Math.PI * 2;
                    const r = foundationBottomRadius * 0.98;
                    const sx = centerX + Math.cos(ang) * r;
                    const sz = centerZ + Math.sin(ang) * r;
                    const h = this.terrainGen.getHeight(sx, sz);
                    if (h > highest) highest = h;
                    if (h < lowest) lowest = h;
                }
                const platformY = highest + 12; // raise a few more units above the highest terrain
                const foundationHeight = Math.max(140, platformY - lowest + 120); // extra buffer to prevent poke-through
                const foundationMat = new THREE.MeshLambertMaterial({ color: 0x2f2f2f });
                const foundation = new THREE.Mesh(
                    new THREE.CylinderGeometry(foundationTopRadius, foundationBottomRadius, foundationHeight, 48, 1, false),
                    foundationMat
                );
                foundation.position.set(centerX, platformY - foundationHeight / 2, centerZ);
                foundation.castShadow = true;
                foundation.receiveShadow = true;
                this.scene.add(foundation);
                this.foundationInfo = {
                    centerX,
                    centerZ,
                    topRadius: foundationTopRadius,
                    bottomRadius: foundationBottomRadius,
                    topY: platformY,
                    height: foundationHeight,
                    lowestTerrain: lowest
                };
                
                // Central grand temple with pyramid roof
                const mainData = this.createGrandTempleWithPyramidRoof(centerX, platformY, centerZ);
                this.scene.add(mainData.group);
                this.structures.set(`${complexKey}-main`, mainData.group);
                this.createMainTempleBeam(mainData.apex.clone());
                mainData.colliders.forEach((c) => {
                    this.collisionBoxes.push({
                        ...c,
                        chunkKey: complexKey
                    });
                });
                
                // Ring of obelisks
                for (let i = 0; i < 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    const radius = obeliskRadius;
                    const x = centerX + Math.cos(angle) * radius;
                    const z = centerZ + Math.sin(angle) * radius;
                    const h = platformY;
                    const obelisk = this.createObelisk(x, h, z);
                    this.scene.add(obelisk);
                    this.structures.set(`${complexKey}-obelisk-${i}`, obelisk);
                    this.collisionBoxes.push({
                        minX: x - 4, maxX: x + 4,
                        minY: h - 8, maxY: h + 50,
                        minZ: z - 4, maxZ: z + 4,
                        chunkKey: complexKey
                    });
                }
            }

            getFoundationHeightAt(x, z) {
                if (!this.foundationInfo) return null;
                const { centerX, centerZ, topRadius, bottomRadius, topY, height } = this.foundationInfo;
                const dx = x - centerX;
                const dz = z - centerZ;
                const r = Math.sqrt(dx * dx + dz * dz);
                if (r > bottomRadius) return null;
                if (bottomRadius === topRadius) return topY;
                const t = (r - topRadius) / (bottomRadius - topRadius);
                const y = topY - t * height;
                const bottomY = topY - height;
                return Math.max(Math.min(y, topY), bottomY);
            }
            
            createGrandTempleWithPyramidRoof(x, y, z) {
                const group = new THREE.Group();
                const goldenRatio = 1.618;
                const footprintX = 240;
                const footprintZ = footprintX * goldenRatio;
                const floorHeight = 6;
                const columnHeight = 95;
                const columnRadius = 5;
                const beamHeight = 10;
                const roofStepCount = 9;
                const roofStepHeight = 6;
                const colliders = [];

                // Radiating stepped foundation (walkable stairs)
                const stepCount = 7;
                const stepHeight = 4;
                const baseWidth = footprintX * 1.25;
                const baseDepth = footprintZ * 1.25;
                const startY = -stepHeight * 2; // sink the first step modestly for visual grounding
                let topStepY = startY;
                // Deep footing extending straight down
                const buriedDepth = 0.5 * (floorHeight + columnHeight + roofStepCount * roofStepHeight + beamHeight);
                const footing = new THREE.Mesh(
                    new THREE.BoxGeometry(baseWidth, buriedDepth, baseDepth),
                    new THREE.MeshLambertMaterial({ color: 0x2f2f2f })
                );
                footing.position.y = startY - buriedDepth / 2;
                footing.receiveShadow = true;
                group.add(footing);
                for (let i = 0; i < stepCount; i++) {
                    const t = i / stepCount;
                    const width = baseWidth * (1 - t * 0.35);
                    const depth = baseDepth * (1 - t * 0.35);
                    const step = new THREE.Mesh(
                        new THREE.BoxGeometry(width, stepHeight, depth),
                        new THREE.MeshLambertMaterial({ color: 0x3d3d3d })
                    );
                    step.position.y = startY + i * stepHeight + stepHeight / 2;
                    step.castShadow = true;
                    step.receiveShadow = true;
                    group.add(step);
                    topStepY = step.position.y + stepHeight / 2;
                    colliders.push({
                        minX: x - width / 2,
                        maxX: x + width / 2,
                        minY: y + step.position.y - stepHeight / 2,
                        maxY: y + step.position.y + stepHeight / 2,
                        minZ: z - depth / 2,
                        maxZ: z + depth / 2
                    });
                }

                const platformY = topStepY + 0.2; // where columns and interior start

                // Colonnade (doubled density)
                const colMat = new THREE.MeshLambertMaterial({ color: 0x8a8a8a });
                const colPositions = [];
                const insetX = footprintX * 0.35;
                const insetZ = footprintZ * 0.35;
                const stepX = 18;
                const stepZ = 18;
                for (let xPos = -insetX; xPos <= insetX; xPos += stepX) {
                    colPositions.push([xPos, -insetZ]);
                    colPositions.push([xPos, insetZ]);
                }
                for (let zPos = -insetZ + stepZ; zPos <= insetZ - stepZ; zPos += stepZ) {
                    colPositions.push([-insetX, zPos]);
                    colPositions.push([insetX, zPos]);
                }
                for (const [cx, cz] of colPositions) {
                    const column = new THREE.Mesh(
                        new THREE.CylinderGeometry(columnRadius, columnRadius, columnHeight, 14),
                        colMat
                    );
                    column.position.set(cx, platformY + columnHeight / 2, cz);
                    column.castShadow = true;
                    column.receiveShadow = true;
                    group.add(column);
                }

                // Architrave and roof deck
                const beamWidth = footprintX * 0.78;
                const beamDepth = footprintZ * 0.78;
                const beam = new THREE.Mesh(
                    new THREE.BoxGeometry(beamWidth, beamHeight, beamDepth),
                    new THREE.MeshLambertMaterial({ color: 0x6a6a6a })
                );
                beam.position.y = platformY + columnHeight + beamHeight / 2;
                beam.castShadow = true;
                beam.receiveShadow = true;
                group.add(beam);

                // Stepped pyramid roof continuing the base steps
                const baseTopWidth = baseWidth * (1 - ((stepCount - 1) / stepCount) * 0.35);
                const baseTopDepth = baseDepth * (1 - ((stepCount - 1) / stepCount) * 0.35);
                let roofCurrentWidth = baseTopWidth * 0.9;
                let roofCurrentDepth = baseTopDepth * 0.9;
                let roofCurrentY = beam.position.y;
                for (let i = 0; i < roofStepCount; i++) {
                    const t = i / roofStepCount;
                    const shrink = 0.14 + 0.02 * i;
                    const stepW = roofCurrentWidth * (1 - shrink);
                    const stepD = roofCurrentDepth * (1 - shrink);
                    const roofStep = new THREE.Mesh(
                        new THREE.BoxGeometry(stepW, roofStepHeight, stepD),
                        new THREE.MeshLambertMaterial({ color: 0x707070 })
                    );
                    roofStep.position.y = roofCurrentY + roofStepHeight / 2;
                    roofStep.castShadow = true;
                    roofStep.receiveShadow = true;
                    group.add(roofStep);
                    roofCurrentY = roofStep.position.y + roofStepHeight / 2;
                    roofCurrentWidth = stepW;
                    roofCurrentDepth = stepD;
                }
                // Tiny cap to finish the point
                const capSize = Math.max(roofCurrentWidth, roofCurrentDepth) * 0.3;
                const cap = new THREE.Mesh(
                    new THREE.BoxGeometry(capSize, roofStepHeight * 0.8, capSize),
                    new THREE.MeshLambertMaterial({ color: 0x707070 })
                );
                cap.position.y = roofCurrentY + roofStepHeight * 0.4;
                cap.castShadow = true;
                cap.receiveShadow = true;
                group.add(cap);
                roofCurrentY = cap.position.y + (roofStepHeight * 0.4);

                // Gold globe at apex
                const globeRadius = 12;
                const globe = new THREE.Mesh(
                    new THREE.SphereGeometry(globeRadius, 24, 24),
                    new THREE.ShaderMaterial({
                        uniforms: {
                            time: { value: 0 },
                            baseColor: { value: new THREE.Color(0xffd700) }
                        },
                        vertexShader: `
                            varying vec3 vNormal;
                            varying vec3 vWorldPos;
                            void main() {
                                vNormal = normalize(normalMatrix * normal);
                                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                                vWorldPos = worldPos.xyz;
                                gl_Position = projectionMatrix * viewMatrix * worldPos;
                            }
                        `,
                        fragmentShader: `
                            uniform float time;
                            uniform vec3 baseColor;
                            varying vec3 vNormal;
                            varying vec3 vWorldPos;
                            float hash(vec3 p) {
                                return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
                            }
                            void main() {
                                vec3 n = normalize(vNormal);
                                float ndotl = max(dot(n, normalize(vec3(0.2, 0.9, 0.4))), 0.0);
                                float spec = pow(ndotl, 24.0);
                                float sparkle = 0.0;
                                vec3 cell = floor(vWorldPos * 6.0 + time * 2.0);
                                float h = hash(cell);
                                sparkle += smoothstep(0.92, 1.0, h) * 1.2;
                                float flicker = 0.5 + 0.5 * sin(time * 5.0 + h * 20.0);
                                sparkle *= flicker;
                                vec3 color = baseColor * (0.6 + 0.8 * ndotl) + vec3(spec * 1.4) + vec3(sparkle);
                                gl_FragColor = vec4(color, 1.0);
                            }
                        `,
                        transparent: false
                    })
                );
                globe.position.y = roofCurrentY + globeRadius;
                globe.castShadow = true;
                globe.receiveShadow = true;
                group.add(globe);
                this.globeMaterial = globe.material;

                // Fire altar
                const brazier = new THREE.Mesh(
                    new THREE.CylinderGeometry(10, 12, 10, 12),
                    new THREE.MeshLambertMaterial({ color: 0x4b2f1b })
                );
                brazier.position.set(0, platformY + 6, 0);
                brazier.castShadow = true;
                brazier.receiveShadow = true;
                group.add(brazier);

                const flame = new THREE.Mesh(
                    new THREE.ConeGeometry(8, 18, 10),
                    new THREE.MeshPhongMaterial({
                        color: 0xff8a3c,
                        emissive: 0xff5a00,
                        emissiveIntensity: 1.6,
                        transparent: true,
                        opacity: 0.9
                    })
                );
                flame.position.set(0, platformY + 15, 0);
                flame.castShadow = false;
                group.add(flame);

                const fireLight = new THREE.PointLight(0xffb15a, 2.4, 220, 2);
                fireLight.position.set(0, platformY + 24, 0);
                fireLight.castShadow = true;
                fireLight.shadow.mapSize.width = 1024;
                fireLight.shadow.mapSize.height = 1024;
                group.add(fireLight);

                // Bounding box and apex for beam
                const apexY = globe.position.y + globeRadius;
                const apex = new THREE.Vector3(x, y + apexY, z);
                group.position.set(x, y, z);
                return {
                    group,
                    apex,
                    colliders,
                    bounds: {
                        minX: x - baseWidth * 0.55,
                        maxX: x + baseWidth * 0.55,
                        minY: y + startY,
                        maxY: y + apexY,
                        minZ: z - baseDepth * 0.55,
                        maxZ: z + baseDepth * 0.55
                    }
                };
            }

            createLargePyramid(x, y, z, baseSize) {
                const group = new THREE.Group();
                const height = baseSize * 1.3;

                // Foundation sunk into the ground
                const foundationHeight = 30;
                const foundation = new THREE.Mesh(
                    new THREE.BoxGeometry(baseSize * 2.2, foundationHeight, baseSize * 2.2),
                    new THREE.MeshLambertMaterial({ color: 0x3c3c3c })
                );
                foundation.position.y = -foundationHeight * 0.4;
                foundation.receiveShadow = true;
                group.add(foundation);
                
                // Main pyramid body - granite gray
                const pyramid = new THREE.Mesh(
                    new THREE.ConeGeometry(baseSize, height, 4),
                    new THREE.MeshLambertMaterial({ color: 0x707070 })
                );
                pyramid.position.y = height / 2;
                pyramid.rotation.y = Math.PI / 4;
                pyramid.castShadow = true;
                pyramid.receiveShadow = true;
                group.add(pyramid);
                
                // Multiple step layers - darker granite
                const steps = 8;
                for (let i = 0; i < steps; i++) {
                    const stepSize = baseSize * (1 - i * 0.1);
                    const step = new THREE.Mesh(
                        new THREE.BoxGeometry(stepSize * 2, 6, stepSize * 2),
                        new THREE.MeshLambertMaterial({ color: 0x606060 })
                    );
                    step.position.y = i * 6 + 3;
                    step.castShadow = true;
                    step.receiveShadow = true;
                    group.add(step);
                }
                
                // Entrance platform - medium granite
                const entrance = new THREE.Mesh(
                    new THREE.BoxGeometry(baseSize * 0.4, 8, baseSize * 0.4),
                    new THREE.MeshLambertMaterial({ color: 0x505050 })
                );
                entrance.position.set(0, 4, baseSize);
                entrance.castShadow = true;
                entrance.receiveShadow = true;
                group.add(entrance);
                
                // Decorative top - gold capstone
                const capstone = new THREE.Mesh(
                    new THREE.SphereGeometry(8, 8, 8),
                    new THREE.MeshLambertMaterial({ color: 0xffd700 })
                );
                capstone.position.y = height;
                capstone.castShadow = true;
                group.add(capstone);
                
                group.position.set(x, y, z);
                return group;
            }
            
            createObelisk(x, y, z) {
                const group = new THREE.Group();
                const height = 40;

                // Foundation sunk into terrain
                const foundationHeight = 18;
                const foundation = new THREE.Mesh(
                    new THREE.BoxGeometry(12, foundationHeight, 12),
                    new THREE.MeshLambertMaterial({ color: 0x3c3c3c })
                );
                foundation.position.y = -foundationHeight * 0.4;
                foundation.receiveShadow = true;
                group.add(foundation);
                
                // Main shaft - granite gray
                const shaft = new THREE.Mesh(
                    new THREE.BoxGeometry(4, height, 4),
                    new THREE.MeshLambertMaterial({ color: 0x707070 })
                );
                shaft.position.y = height / 2;
                shaft.castShadow = true;
                shaft.receiveShadow = true;
                group.add(shaft);
                
                // Pyramid top - lighter granite
                const top = new THREE.Mesh(
                    new THREE.ConeGeometry(3, 8, 4),
                    new THREE.MeshLambertMaterial({ color: 0x808080 })
                );
                top.position.y = height + 4;
                top.rotation.y = Math.PI / 4;
                top.castShadow = true;
                group.add(top);
                
                // Base - dark granite
                const base = new THREE.Mesh(
                    new THREE.BoxGeometry(8, 4, 8),
                    new THREE.MeshLambertMaterial({ color: 0x505050 })
                );
                base.position.y = 2;
                base.castShadow = true;
                base.receiveShadow = true;
                group.add(base);
                
                group.position.set(x, y, z);
                return group;
            }
            
            createPyramid(x, y, z) {
                const group = new THREE.Group();
                const size = 30 + Math.random() * 20;
                const height = size * 1.2;

                // Foundation sunk into terrain
                const foundationHeight = 24;
                const foundation = new THREE.Mesh(
                    new THREE.BoxGeometry(size * 2.4, foundationHeight, size * 2.4),
                    new THREE.MeshLambertMaterial({ color: 0x3c3c3c })
                );
                foundation.position.y = -foundationHeight * 0.35;
                foundation.receiveShadow = true;
                group.add(foundation);
                
                // Main pyramid - granite gray
                const pyramid = new THREE.Mesh(
                    new THREE.ConeGeometry(size, height, 4),
                    new THREE.MeshLambertMaterial({ color: 0x707070 })
                );
                pyramid.position.y = height / 2;
                pyramid.rotation.y = Math.PI / 4;
                pyramid.castShadow = true;
                pyramid.receiveShadow = true;
                group.add(pyramid);
                
                // Steps - darker granite
                for (let i = 0; i < 5; i++) {
                    const stepSize = size * (1 - i * 0.15);
                    const step = new THREE.Mesh(
                        new THREE.BoxGeometry(stepSize * 2, 5, stepSize * 2),
                        new THREE.MeshLambertMaterial({ color: 0x606060 })
                    );
                    step.position.y = i * 5 + 2.5;
                    step.castShadow = true;
                    step.receiveShadow = true;
                    group.add(step);
                }
                
                group.position.set(x, y, z);
                return group;
            }
            async generateChunk(chunkX, chunkZ, playerDist = 0) {
                const key = `${chunkX},${chunkZ}`;
                if (this.chunkJobs.has(key)) return this.chunkJobs.get(key);
                
                const zone = this.getChunkZone(playerDist);
                const size = CONFIG.CHUNK_SIZE;
                const startX = chunkX * size;
                const startZ = chunkZ * size;
                const lodStep = zone.terrainStep;
                const cacheKey = this.getLodCacheKey(key, lodStep);
                const cached = this.terrainCache?.getChunk(cacheKey);
                if (cached && cached.gridSize === Math.floor(size / lodStep)) {
                    const chunkData = this.buildChunkFromData(key, zone, cached);
                    if (chunkData) {
                        if (this.chunks.has(key)) this.removeChunk(key, this.chunks.get(key));
                        this.chunks.set(key, chunkData);
                        this.applySeasonToChunk(chunkData, this.getSeasonFactors());
                        return chunkData;
                    }
                }
                // For far LOD, if we already asked peers, wait for response instead of regenerating immediately
                if (this.terrainSharingEnabled && zone.name === 'far' && this.requestedTerrain?.has(cacheKey)) {
                    return null;
                }
                if (!this.terrainGenEnabled) return null;
                const promise = this.computeTerrainChunkAsync({
                    seed: this.currentSeed,
                    startX,
                    startZ,
                    lodStep,
                    size,
                    treeLevel: zone.treeLevel,
                    includeStructures: zone.name === 'close'
                }).then((data) => {
                    if (!data) return null;
                    const chunkData = this.buildChunkFromData(key, zone, data);
                    if (chunkData) {
                        if (this.chunks.has(key)) {
                            this.removeChunk(key, this.chunks.get(key));
                        }
                        this.chunks.set(key, chunkData);
                        if (this.terrainCache) {
                            this.terrainCache.putChunk(cacheKey, data);
                        }
                        this.applySeasonToChunk(chunkData, this.getSeasonFactors());
                    }
                    return chunkData;
                }).catch((err) => {
                    console.error('Chunk compute failed', err);
                    return null;
                }).finally(() => {
                    this.chunkJobs.delete(key);
                });
                this.chunkJobs.set(key, promise);
                return promise;
            }

            getLodCacheKey(chunkKey, lodStep) {
                return `${chunkKey}::lod-${lodStep}::seed-${this.currentSeed}`;
            }

            getSpiralOffsets(radius) {
                if (this.spiralCache.has(radius)) return this.spiralCache.get(radius);
                const offsets = [];
                for (let dx = -radius; dx <= radius; dx++) {
                    for (let dz = -radius; dz <= radius; dz++) {
                        const dist = Math.max(Math.abs(dx), Math.abs(dz));
                        if (dist > radius) continue;
                        const manhattan = Math.abs(dx) + Math.abs(dz);
                        const angle = Math.atan2(dz, dx);
                        offsets.push({ dx, dz, dist, manhattan, angle });
                    }
                }
                offsets.sort((a, b) => {
                    if (a.manhattan !== b.manhattan) return a.manhattan - b.manhattan;
                    return a.angle - b.angle;
                });
                const ordered = offsets.map(o => [o.dx, o.dz, o.dist]);
                this.spiralCache.set(radius, ordered);
                return ordered;
            }

            async computeTerrainChunkAsync(params) {
                if (!this.computeManager) {
                    throw new Error('Compute manager unavailable; cannot generate terrain');
                }
                await this.computeReadyPromise;
                return this.computeManager.submitTask({
                    module: new URL('./world/terrainTask.js', import.meta.url).toString(),
                    exportName: 'computeTerrainChunk',
                    data: params
                });
            }

            buildChunkFromData(key, zone, data) {
                const {
                    startX,
                    startZ,
                    size,
                    lodStep,
                    gridSize,
                    heights,
                    moisture,
                    terrainTypes,
                    maxHeight,
                    trees,
                    structures
                } = data;
                const geo = new THREE.BufferGeometry();
                const verts = [];
                const colors = [];
                const normals = [];
                const indices = [];
                const terrainList = [];
                const sampleHeight = (x, z) => {
                    const ix = Math.max(0, Math.min(gridSize, x));
                    const iz = Math.max(0, Math.min(gridSize, z));
                    return heights[iz * (gridSize + 1) + ix];
                };

                for (let z = 0; z <= gridSize; z++) {
                    for (let x = 0; x <= gridSize; x++) {
                        const wx = startX + x * lodStep;
                        const wz = startZ + z * lodStep;
                        const idx = z * (gridSize + 1) + x;
                        const h = heights[idx];
                        verts.push(wx, h, wz);
                        terrainList.push(terrainTypes[idx]);
                        colors.push(1, 1, 1);

                        const hL = sampleHeight(x - 1, z);
                        const hR = sampleHeight(x + 1, z);
                        const hD = sampleHeight(x, z - 1);
                        const hU = sampleHeight(x, z + 1);
                        const nx = hL - hR;
                        const ny = 2 * lodStep;
                        const nz = hD - hU;
                        const normal = new THREE.Vector3(nx, ny, nz).normalize();
                        normals.push(normal.x, normal.y, normal.z);
                    }
                }

                for (let z = 0; z < gridSize; z++) {
                    for (let x = 0; x < gridSize; x++) {
                        const a = x + z * (gridSize + 1);
                        const b = x + (z + 1) * (gridSize + 1);
                        const c = (x + 1) + z * (gridSize + 1);
                        const d = (x + 1) + (z + 1) * (gridSize + 1);
                        indices.push(a, b, c, b, d, c);
                    }
                }

                geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
                geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
                geo.setIndex(indices);

                const mesh = new THREE.Mesh(geo, 
                    new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 10, specular: 0x222222 }));
                mesh.receiveShadow = true;
                mesh.castShadow = true; // Terrain casts shadows at all distances
                this.scene.add(mesh);

                let snowMesh = null;
                if (zone.name === 'close') {
                    const snowGeo = geo.clone();
                    snowMesh = new THREE.Mesh(snowGeo, 
                        new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 5, specular: 0x222222 }));
                    snowMesh.position.y = 0.2;
                    snowMesh.receiveShadow = true;
                    snowMesh.castShadow = true;
                    snowMesh.visible = false;
                    this.scene.add(snowMesh);
                }

                const waterMat = new THREE.MeshPhongMaterial({
                    color: 0x21374d,
                    transparent: true,
                    opacity: 0.01,
                    depthWrite: false,
                    shininess: 40,
                    specular: 0x2d4345
                });
                const water = new THREE.Mesh(new THREE.PlaneGeometry(size, size), waterMat);
                water.rotation.x = -Math.PI / 2;
                water.position.set(startX + size/2, 300, startZ + size/2);
                this.scene.add(water);

                const treeIndices = { close: [], medium: [] };
                const matrix = new THREE.Matrix4();
                for (const tree of trees || []) {
                    const instancedMesh = tree.level === 'close' ? this.treeInstancedMeshClose : this.treeInstancedMeshMedium;
                    const counterKey = tree.level === 'close' ? 'treeCountClose' : 'treeCountMedium';
                    if (!instancedMesh || this[counterKey] >= instancedMesh.instanceMatrix.count) continue;
                    matrix.makeTranslation(tree.x, tree.y, tree.z);
                    matrix.scale(new THREE.Vector3(tree.radius, tree.height, tree.radius));
                    instancedMesh.setMatrixAt(this[counterKey], matrix);
                    treeIndices[tree.level].push(this[counterKey]);
                    this[counterKey]++;
                }
                this.treeInstancedMeshClose.instanceMatrix.needsUpdate = true;
                this.treeInstancedMeshMedium.instanceMatrix.needsUpdate = true;
                this.treeInstancedMeshClose.count = this.treeCountClose;
                this.treeInstancedMeshMedium.count = this.treeCountMedium;

                const structureKeys = [];
                if (structures && structures.length && zone.name === 'close') {
                    structures.forEach((s, idx) => {
                        const structure = this.createObelisk(s.x, s.y, s.z);
                        const chunkKey = `${key}-structure-${idx}`;
                        structureKeys.push(chunkKey);
                        this.collisionBoxes.push({
                            minX: s.x - 8, maxX: s.x + 8,
                            minY: s.y - 8, maxY: s.y + 55,
                            minZ: s.z - 8, maxZ: s.z + 8,
                            chunkKey
                        });
                        this.scene.add(structure);
                        this.structures.set(chunkKey, structure);
                    });
                }

                const chunkData = { mesh, snowMesh, water, treeIndices, terrainTypes: terrainList, gridSize, zoneName: zone.name, maxHeight, structuresKeys: structureKeys };
                return chunkData;
            }

            hideTreeMatrices(indices, mesh) {
                if (!indices?.length || !mesh) return;
                const hideMatrix = new THREE.Matrix4();
                hideMatrix.makeScale(0, 0, 0);
                indices.forEach(idx => {
                    mesh.setMatrixAt(idx, hideMatrix);
                });
                mesh.instanceMatrix.needsUpdate = true;
            }

            recalcTreeCounts() {
                // Recompute the highest in-use instance index and shrink draw counts
                let maxClose = -1;
                let maxMedium = -1;
                for (const chunk of this.chunks.values()) {
                    if (!chunk.treeIndices) continue;
                    for (const idx of chunk.treeIndices.close || []) {
                        if (idx > maxClose) maxClose = idx;
                    }
                    for (const idx of chunk.treeIndices.medium || []) {
                        if (idx > maxMedium) maxMedium = idx;
                    }
                }
                this.treeCountClose = Math.max(0, maxClose + 1);
                this.treeCountMedium = Math.max(0, maxMedium + 1);
                this.treeInstancedMeshClose.count = this.treeCountClose;
                this.treeInstancedMeshMedium.count = this.treeCountMedium;
                this.treeInstancedMeshClose.instanceMatrix.needsUpdate = true;
                this.treeInstancedMeshMedium.instanceMatrix.needsUpdate = true;
            }
            
            updateChunkLOD(key, playerDist) {
                // Update LOD-related toggles (currently just shadows) based on distance
                const chunk = this.chunks.get(key);
                if (!chunk) return;
                
                const shadowDistance = 2; // only the nearest ring gets full shadows
                const shouldHaveShadows = playerDist <= shadowDistance;
                
                if (chunk.mesh.receiveShadow !== shouldHaveShadows) {
                    chunk.mesh.receiveShadow = shouldHaveShadows;
                    chunk.mesh.castShadow = shouldHaveShadows;
                }
                
                if (chunk.snowMesh && chunk.snowMesh.receiveShadow !== shouldHaveShadows) {
                    chunk.snowMesh.receiveShadow = shouldHaveShadows;
                    chunk.snowMesh.castShadow = shouldHaveShadows;
                }
                
                if (chunk.water && chunk.water.receiveShadow !== shouldHaveShadows) {
                    chunk.water.receiveShadow = shouldHaveShadows;
                    chunk.water.castShadow = shouldHaveShadows;
                }
            }
            
            updateStructureShadows() {
                // Enable shadows only for structures near player
                const shadowDistance = 400; // Distance threshold for shadows
                let shadowCount = 0;
                
                for (const [key, structure] of this.structures) {
                    const dist = structure.position.distanceTo(this.position);
                    const shouldCastShadow = dist < shadowDistance;
                    let structureHasShadow = false;
                    
                    // Update shadow casting for all children
                    structure.traverse((child) => {
                        if (child.isMesh) {
                            if (child.castShadow !== shouldCastShadow) {
                                child.castShadow = shouldCastShadow;
                                child.receiveShadow = shouldCastShadow;
                            }
                            if (child.castShadow) structureHasShadow = true;
                        }
                    });
                    if (structureHasShadow) shadowCount++;
                }
                this.structureShadowCount = shadowCount;
            }
            
            getSeasonFactors() {
                const yearProgress = this.timeSystem.getYearProgress();
                const smoothstep = (edge0, edge1, x) => {
                    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
                    return t * t * (3 - 2 * t);
                };
                let winterFactor = 0, springFactor = 0, summerFactor = 0, fallFactor = 0;
                if (yearProgress < 0.2) {
                    winterFactor = 1;
                } else if (yearProgress < 0.35) {
                    const t = smoothstep(0.2, 0.35, yearProgress);
                    winterFactor = 1 - t;
                    springFactor = t;
                } else if (yearProgress < 0.45) {
                    springFactor = 1;
                } else if (yearProgress < 0.55) {
                    const t = smoothstep(0.45, 0.55, yearProgress);
                    springFactor = 1 - t;
                    summerFactor = t;
                } else if (yearProgress < 0.65) {
                    summerFactor = 1;
                } else if (yearProgress < 0.75) {
                    const t = smoothstep(0.65, 0.75, yearProgress);
                    summerFactor = 1 - t;
                    fallFactor = t;
                } else if (yearProgress < 0.85) {
                    fallFactor = 1;
                } else {
                    const t = smoothstep(0.85, 0.95, yearProgress);
                    fallFactor = 1 - t;
                    winterFactor = t;
                }
                return { winterFactor, springFactor, summerFactor, fallFactor };
            }

            applySeasonToChunk(chunk, factors) {
                if (!chunk?.mesh) return;
                const { winterFactor, springFactor, summerFactor, fallFactor } = factors;
                const seasonalColors = {
                    boreal: {
                        winter: new THREE.Color(0xf5f5ff),
                        spring: new THREE.Color(0x4f6f3c),
                        summer: new THREE.Color(0x33542a),
                        fall: new THREE.Color(0xd9b13f) // yellowed fall
                    },
                    alpine: {
                        winter: new THREE.Color(0xe3eed7),
                        spring: new THREE.Color(0x808f5f), // olive green
                        summer: new THREE.Color(0x6f7d50), // olive green darker
                        fall: new THREE.Color(0x8b1a1a)   // deep red
                    },
                    mountain: {
                        winter: new THREE.Color(0xe9edf2),
                        spring: new THREE.Color(0xc8ccd2),
                        summer: new THREE.Color(0xb4b8bf),
                        fall: new THREE.Color(0xc0c4ca)
                    }
                };
                const colorAttr = chunk.mesh.geometry.getAttribute('color');
                const colorArray = colorAttr.array;
                const terrainTypes = chunk.terrainTypes;
                for (let i = 0; i < terrainTypes.length; i++) {
                    const terrain = terrainTypes[i];
                    const color = new THREE.Color();
                    if (terrain.type === 'water') {
                        color.setHex(0x2b3541); // dark silt; water surface tinted separately
                    } else if (terrain.type === 'peak') {
                        // Permanent snow only on the highest peaks
                        color.setHex(0xf5f8ff);
                    } else if (terrain.type === 'summit') {
                        color.setHex(0x4b525b); // gunmetal
                    } else if (terrain.type === 'alpine') {
                        const terrainColors = seasonalColors.alpine;
                        color.r = terrainColors.winter.r * winterFactor +
                                 terrainColors.spring.r * springFactor +
                                 terrainColors.summer.r * summerFactor +
                                 terrainColors.fall.r * fallFactor;
                        color.g = terrainColors.winter.g * winterFactor +
                                 terrainColors.spring.g * springFactor +
                                 terrainColors.summer.g * summerFactor +
                                 terrainColors.fall.g * fallFactor;
                        color.b = terrainColors.winter.b * winterFactor +
                                 terrainColors.spring.b * springFactor +
                                 terrainColors.summer.b * summerFactor +
                                 terrainColors.fall.b * fallFactor;
                    } else if (terrain.type === 'mountain') {
                        const terrainColors = seasonalColors.mountain;
                        color.r = terrainColors.winter.r * winterFactor +
                                 terrainColors.spring.r * springFactor +
                                 terrainColors.summer.r * summerFactor +
                                 terrainColors.fall.r * fallFactor;
                        color.g = terrainColors.winter.g * winterFactor +
                                 terrainColors.spring.g * springFactor +
                                 terrainColors.summer.g * summerFactor +
                                 terrainColors.fall.g * fallFactor;
                        color.b = terrainColors.winter.b * winterFactor +
                                 terrainColors.spring.b * springFactor +
                                 terrainColors.summer.b * summerFactor +
                                 terrainColors.fall.b * fallFactor;
                    } else if (terrain.type === 'boreal') {
                        let terrainColors = seasonalColors.boreal;
                        color.r = terrainColors.winter.r * winterFactor +
                                 terrainColors.spring.r * springFactor +
                                 terrainColors.summer.r * summerFactor +
                                 terrainColors.fall.r * fallFactor;
                        color.g = terrainColors.winter.g * winterFactor +
                                 terrainColors.spring.g * springFactor +
                                 terrainColors.summer.g * summerFactor +
                                 terrainColors.fall.g * fallFactor;
                        color.b = terrainColors.winter.b * winterFactor +
                                 terrainColors.spring.b * springFactor +
                                 terrainColors.summer.b * summerFactor +
                                 terrainColors.fall.b * fallFactor;
                    } else if (terrain.type === 'beach') {
                        color.setHex(0x4a4f57);
                    } else {
                        // fallback
                        color.setHex(0x4b525b);
                    }
                    // Distant snow tint: for medium/far chunks, fade base color toward white in winter
                    if (chunk.zoneName !== 'close' && winterFactor > 0) {
                        color.lerp(new THREE.Color(0xffffff), winterFactor);
                    }
                    colorArray[i * 3] = color.r;
                    colorArray[i * 3 + 1] = color.g;
                    colorArray[i * 3 + 2] = color.b;
                }
                colorAttr.needsUpdate = true;
            }

            updateTerrainColors() {
                const factors = this.getSeasonFactors();
                for (const chunk of this.chunks.values()) {
                    this.applySeasonToChunk(chunk, factors);
                }
            }
            
            updateChunks() {
                if (!this.readyToRender) return;
                const px = Math.floor(this.position.x / CONFIG.CHUNK_SIZE);
                const pz = Math.floor(this.position.z / CONFIG.CHUNK_SIZE);
                if (px === this.prevChunkX && pz === this.prevChunkZ) return;
                this.prevChunkX = px;
                this.prevChunkZ = pz;
                
                // Generate chunks within render distance with LOD in spiral order
                const offsets = this.getSpiralOffsets(CONFIG.RENDER_DISTANCE);
                if (this.terrainGenEnabled) {
                    for (const [dx, dz, dist] of offsets) {
                        this.generateChunk(px + dx, pz + dz, dist);
                    }
                }
                // Request far LOD chunks from peers starting from the edge inward to avoid clashing with local outward spiral
                this.requestMissingFarChunks(px, pz, offsets);
                
                // Remove far chunks AND their trees AND structures
                for (const [key, chunk] of this.chunks.entries()) {
                    const [cx, cz] = key.split(',').map(Number);
                    const dist = Math.max(Math.abs(cx - px), Math.abs(cz - pz));
                    if (dist > CONFIG.RENDER_DISTANCE + 2) {
                        if (this.chunkJobs.has(key)) continue; // keep until job finishes
                        this.removeChunk(key, chunk);
                    } else {
                        this.updateChunkLOD(key, dist);
                    }
                }
            }
            
            updateSnow() {
                if (!this.terrainGenEnabled) return;
                const now = Date.now();
                const season = this.timeSystem.getSeason();
                if (season === this.lastSnowSeason && (now - this.lastSnowUpdate) < 1000) return;
                this.lastSnowSeason = season;
                this.lastSnowUpdate = now;
                const isWinter = season === 'Winter';
                const summitSnowLine = 3000 * 0.8; // match summit band threshold
                for (const chunk of this.chunks.values()) {
                    if (chunk.snowMesh) {
                        // Snow mesh only exists for close chunks; keep visible in winter
                        chunk.snowMesh.visible = isWinter && (chunk.maxHeight || 0) >= summitSnowLine;
                    }
                    if (chunk.water) {
                        chunk.water.material.color.setHex(isWinter ? 0xd0e0ff : 0x16405e);
                        chunk.water.material.opacity = isWinter ? 0.9 : 0.99;
                    }
                }
            }

            createMainTempleBeam(origin) {
                this.mainTempleApex = origin.clone();
                const seedTarget = origin.clone().add(new THREE.Vector3(0, 4000, 0));
                const curve = this.buildMainBeamCurve(origin, seedTarget);
                const coreMat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.95,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    toneMapped: false
                });
                const glowMat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.3,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    toneMapped: false
                });
                const coreRadius = 12; // match gold orb radius
                const glowRadius = 18;
                const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, coreRadius, 28, false), coreMat);
                const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, glowRadius, 20, false), glowMat);
                const group = new THREE.Group();
                group.add(glow);
                group.add(core);
                group.visible = false;
                group.renderOrder = 999;
                this.scene.add(group);
                this.mainTempleBeam = {
                    group,
                    core,
                    glow,
                    origin: origin.clone(),
                    lastTarget: null,
                    lastUpdate: 0,
                    coreRadius,
                    glowRadius
                };
            }

            buildMainBeamCurve(origin, target) {
                const dir = target.clone().sub(origin);
                const dist = dir.length() || 1;
                const lift = Math.min(Math.max(dist * 0.18, 3000), 16000);
                dir.normalize();
                const lateral = new THREE.Vector3(0, 1, 0).cross(dir);
                if (lateral.lengthSq() < 1e-6) lateral.set(1, 0, 0);
                lateral.normalize();
                const cp1 = origin.clone()
                    .add(new THREE.Vector3(0, lift * 0.35, 0))
                    .add(lateral.clone().multiplyScalar(400));
                const cp2 = origin.clone()
                    .add(dir.clone().multiplyScalar(dist * 0.55))
                    .add(new THREE.Vector3(0, lift, 0))
                    .add(lateral.clone().multiplyScalar(-250));
                const knots = [0, 0, 0, 0, 1, 1, 1, 1];
                const controlPoints = [
                    new THREE.Vector4(origin.x, origin.y, origin.z, 1),
                    new THREE.Vector4(cp1.x, cp1.y, cp1.z, 0.6),
                    new THREE.Vector4(cp2.x, cp2.y, cp2.z, 0.8),
                    new THREE.Vector4(target.x, target.y, target.z, 1)
                ];
                return new NURBSCurve(3, knots, controlPoints);
            }

            refreshMainTempleBeam(target) {
                if (!this.mainTempleBeam) return;
                const now = performance.now();
                if (!this.mainTempleBeam.lastTarget) {
                    this.mainTempleBeam.lastTarget = target.clone().addScalar(1e6);
                }
                if (this.mainTempleBeam.lastTarget.distanceToSquared(target) < 4 &&
                    now - this.mainTempleBeam.lastUpdate < 120) {
                    return;
                }
                this.mainTempleBeam.lastTarget.copy(target);
                this.mainTempleBeam.lastUpdate = now;
                const curve = this.buildMainBeamCurve(this.mainTempleBeam.origin, target);
                const segments = 180;
                const coreGeom = new THREE.TubeGeometry(curve, segments, this.mainTempleBeam.coreRadius, 32, false);
                const glowGeom = new THREE.TubeGeometry(curve, segments, this.mainTempleBeam.glowRadius, 24, false);
                this.mainTempleBeam.core.geometry.dispose();
                this.mainTempleBeam.glow.geometry.dispose();
                this.mainTempleBeam.core.geometry = coreGeom;
                this.mainTempleBeam.glow.geometry = glowGeom;
            }

            updateTempleBeams(nightFactor) {
                if (!this.mainTempleBeam) return;
                const visible = nightFactor > 0.2;
                this.mainTempleBeam.group.visible = visible;
                if (visible && this.northStar) {
                    const end = new THREE.Vector3();
                    this.northStar.getWorldPosition(end);
                    this.refreshMainTempleBeam(end);
                }
            }
            
            updateSky() {
                // Sky dome and stars follow player
                this.skyDome.position.copy(this.position);
                this.stars.position.copy(this.position);
                if (this.northStar) this.northStar.position.copy(this.position);
                if (this.globeMaterial?.uniforms?.time) {
                    this.globeMaterial.uniforms.time.value = this.timeSystem.getTime() * 0.001;
                }
                
                const sunPos = this.timeSystem.getSunPosition();
                const angle = sunPos * Math.PI * 2 - Math.PI / 2;
                const dist = 4000 * 8;
                
                // Latitude setting: 65° North
                const latitude = 65 * Math.PI / 180; // 65 degrees in radians
                
                // At 65° latitude, the celestial sphere is tilted
                // The celestial pole is 65° above the horizon
                // Calculate sun/moon positions with latitude tilt
                const x = Math.cos(angle) * dist;
                const y = Math.sin(angle) * dist;
                
                // Apply latitude tilt: rotate around X-axis (east-west) by (90° - latitude)
                const tilt = Math.PI / 2 - latitude; // 25° tilt from vertical
                const yTilted = y * Math.cos(tilt);
                const zTilted = -y * Math.sin(tilt);
                
                // Position sun and moon on tilted dome
                this.sun.position.set(x, yTilted, zTilted);
                this.moon.position.set(-x, -yTilted, -zTilted);
                
                // Light direction (not on dome) - follows player
                const lightOffset = new THREE.Vector3(x * 0.3, yTilted * 0.3, zTilted * 0.3);
                this.sunLight.position.copy(this.position).add(lightOffset);
                this.sunLight.target.position.copy(this.position);
                this.sunLight.target.updateMatrixWorld();
                
                // Update shadow camera to follow player for proper shadow rendering
                this.sunLight.shadow.camera.position.copy(this.sunLight.position);
                this.sunLight.shadow.camera.lookAt(this.position);
                this.sunLight.shadow.camera.updateProjectionMatrix();
                this.sunLight.shadow.camera.updateMatrixWorld();
                
                const moonPhase = this.timeSystem.getMoonPhase();
                this.moon.scale.setScalar(0.5 + (0.5 - Math.abs(0.5 - moonPhase)));
                
                // Sun elevation angle accounting for 65° latitude tilt
                const sunElevation = Math.asin(yTilted / dist);
                const horizonFadeAngle = -0.2618; // -15 degrees
                
                // Smooth interpolation helper
                const smoothstep = (edge0, edge1, x) => {
                    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
                    return t * t * (3 - 2 * t);
                };
                
                // Calculate continuous fade factors
                const dayFactor = smoothstep(-0.1, 0.3, sunElevation); // 0 at -6°, 1 at 17°
                const twilightFactor = smoothstep(horizonFadeAngle, 0.05, sunElevation); // 0 at -15°, 1 at 3°
                const nightFactor = 1 - smoothstep(horizonFadeAngle, -0.05, sunElevation); // 0 at -3°, 1 at -15°
                
                // Sun light intensity - continuous fade; no extra boost during twilight
                const sunIntensity = Math.max(0, Math.sin(Math.max(0, sunElevation))) * dayFactor;
                
                // Sun color - fully continuous with blended transitions
                const sunColor = new THREE.Color();
                
                // Use multiple blend ranges for smooth color gradient
                if (sunElevation < 0) {
                    // Low/sunset: blend from deep red through orange to yellow
                    const sunsetBlend = smoothstep(horizonFadeAngle, 0, sunElevation);
                    const red = 1;
                    const green = 0.2 + sunsetBlend * 0.8; // 0.2 → 1.0
                    const blue = sunsetBlend * sunsetBlend * 0.5; // 0 → 0.5
                    sunColor.setRGB(red, green, blue);
                } else if (sunElevation < 0.5) {
                    // Mid: blend from yellow to white
                    const midBlend = smoothstep(0, 0.5, sunElevation);
                    const red = 1;
                    const green = 1;
                    const blue = 0.5 + midBlend * 0.5; // 0.5 → 1.0
                    sunColor.setRGB(red, green, blue);
                } else {
                    // High: pure white
                    sunColor.setRGB(1, 1, 1);
                }
                
                // Sky color - continuous transition
                const skyColor = new THREE.Color();
                const dayBlue = new THREE.Color(0.3, 0.45, 0.7);
                const twilightPurple = new THREE.Color(0.28, 0.18, 0.35);
                const nightBlue = new THREE.Color(0.02, 0.02, 0.08);
                
                // Blend between night → twilight → day
                if (dayFactor > 0.01) {
                    skyColor.lerpColors(twilightPurple, dayBlue, dayFactor);
                } else {
                    skyColor.lerpColors(nightBlue, twilightPurple, twilightFactor);
                }
                
                // Ambient light - continuous fade with brighter nights
                const ambientIntensity = 0.15 + nightFactor * 0.05 + twilightFactor * 0.2 + dayFactor * 0.5;
                
                // Moonlight contribution at night
                const moonBright = (0.5 - Math.abs(0.5 - moonPhase)) * nightFactor;
                const moonIntensity = moonBright * 0.6; // Increased from 0.2 for brighter nights
                const totalIntensity = Math.max(sunIntensity, moonIntensity);
                
                // Moon color for night lighting
                const moonColor = new THREE.Color(0.7, 0.7, 1);
                const lightColor = new THREE.Color();
                if (nightFactor > 0.5) {
                    lightColor.copy(moonColor);
                } else {
                    lightColor.lerpColors(sunColor, moonColor, nightFactor);
                }
                
                // Star opacity - smooth fade based on night factor
                const starOpacity = smoothstep(0.2, 0.8, nightFactor);
                this.stars.material.uniforms.opacity.value = starOpacity;
                
                // Visibility - keep stars always rendering but invisible when opacity is 0
                this.sun.visible = twilightFactor > 0.01;
                this.moon.visible = nightFactor > 0.01 || (twilightFactor > 0.01 && twilightFactor < 0.99);
                this.stars.visible = true; // Always visible, opacity handles fading
                
                // Update sun visual appearance
                this.sun.material.color.copy(sunColor);
                
                // Apply lighting
                if (this.sunLight) {
                    this.sunLight.color.copy(lightColor);
                    this.sunLight.intensity = totalIntensity;
                    const sunShadowOn = dayFactor > 0.2;
                    if (this.sunLight.castShadow !== sunShadowOn) {
                        this.sunLight.castShadow = sunShadowOn;
                        if (this.sunLight.shadow) this.sunLight.shadow.needsUpdate = true;
                    }
                }
                if (this.ambient) this.ambient.intensity = ambientIntensity;
                if (this.skyDome?.material?.color) this.skyDome.material.color.copy(skyColor);
                if (this.scene.fog?.color) this.scene.fog.color.copy(skyColor);
                
                // Rotate stars to match celestial motion at 65° latitude
                // Tilt FIRST to align rotation axis with celestial pole, then rotate around it
                this.stars.rotation.set(0, 0, 0);
                this.stars.rotateX(tilt);  // Latitude tilt first - tilts the rotation axis
                this.stars.rotateY(angle); // Daily rotation around the now-tilted Y axis
                if (this.northStar) {
                    // Keep Polaris on the rotation axis: tilt only, no daily spin
                    const poleOffset = new THREE.Vector3(0, this.northStarRadius, 0);
                    poleOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
                    this.northStar.position.copy(poleOffset); // local to sky dome so it follows player
                    this.northStar.lookAt(this.camera.position); // face the camera
                }

                this.updateTempleBeams(nightFactor);
                
                // Update northern lights (aurora) - follows player
                this.aurora.position.x = this.position.x;
                this.aurora.position.z = this.position.z;
                this.aurora.material.uniforms.time.value = this.timeSystem.getTime() * 0.001;
                if (this.northStar?.material?.uniforms?.time) {
                    this.northStar.material.uniforms.time.value = this.timeSystem.getTime() * 0.001;
                }
                
                // Aurora only visible during winter nights
                const season = this.timeSystem.getSeason();
                const isWinter = season === 'Winter';
                const auroraOpacity = isWinter ? nightFactor * 0.7 : 0; // 70% max opacity in winter
                this.aurora.material.uniforms.opacity.value = auroraOpacity;
                this.aurora.visible = auroraOpacity > 0.01;
            }
            
            updatePlayer(delta) {
                // VR or regular controls
                let vrInput = null;
                if (this.isInVR) {
                    vrInput = this.getVRControllerInput();
                    
                    // Toggle torch with left trigger
                    if (vrInput.torch && !this.vrTorchPressed) {
                        this.hasTorch = !this.hasTorch;
                        this.torch.visible = this.hasTorch;
                        this.torchLight.visible = this.hasTorch;
                        this.vrTorchPressed = true;
                    } else if (!vrInput.torch) {
                        this.vrTorchPressed = false;
                    }
                }
                
                // Look controls - VR stick or pointer lock/mobiles
                if (this.isInVR && vrInput) {
                    // Smooth turn with right stick
                    const turnSpeed = 1.5 * delta;
                    this.yaw -= vrInput.turnX * turnSpeed;
                } else if (this.isMobile && (this.touchControls.lookX !== 0 || this.touchControls.lookY !== 0)) {
                    const lookSpeed = 3 * delta;
                    this.yaw -= this.touchControls.lookX * lookSpeed;
                    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch - this.touchControls.lookY * lookSpeed));
                }
                
                if (this.godMode) {
                    const speed = CONFIG.PLAYER_SPEED * 20;
                    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
                    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
                    const movement = new THREE.Vector3();
                    
                    // VR, mobile touch, or keyboard
                    if (this.isInVR && vrInput) {
                        const fwd = forward.clone();
                        const rgt = right.clone();
                        movement.add(fwd.multiplyScalar(-vrInput.moveY));
                        movement.add(rgt.multiplyScalar(vrInput.moveX));
                        if (vrInput.jump) movement.y += 1;
                    } else if (this.isMobile && (this.touchControls.moveX !== 0 || this.touchControls.moveY !== 0)) {
                        const fwd = forward.clone();
                        const rgt = right.clone();
                        movement.add(fwd.multiplyScalar(-this.touchControls.moveY));
                        movement.add(rgt.multiplyScalar(this.touchControls.moveX));
                    } else { // desktop pointer-lock WASD
                        if (this.keys['KeyW']) movement.add(forward);
                        if (this.keys['KeyS']) movement.sub(forward);
                        if (this.keys['KeyD']) movement.add(right);
                        if (this.keys['KeyA']) movement.sub(right);
                    }
                    if (this.keys['Space']) movement.y += 1;
                    if (this.keys['ShiftLeft']) movement.y -= 1;
                    
                    if (movement.length() > 0) {
                        movement.normalize().multiplyScalar(speed * delta);
                        this.position.add(movement);
                    }
                } else {
                    // Normal physics mode - 4x speed
                    const normalSpeed = CONFIG.PLAYER_SPEED * 4;
                    this.velocity.y += CONFIG.GRAVITY * delta;
                    
                    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
                    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
                    
                    // VR, mobile touch, or keyboard input
                    if (this.isInVR && vrInput) {
                        this.velocity.x += (-forward.x * vrInput.moveY + right.x * vrInput.moveX) * normalSpeed * delta;
                        this.velocity.z += (-forward.z * vrInput.moveY + right.z * vrInput.moveX) * normalSpeed * delta;
                        if (vrInput.jump && this.onGround && !this.vrJumpPressed) {
                            this.velocity.y = CONFIG.JUMP_FORCE;
                            this.onGround = false;
                            this.vrJumpPressed = true;
                        } else if (!vrInput.jump) {
                            this.vrJumpPressed = false;
                        }
                    } else if (this.isMobile && (this.touchControls.moveX !== 0 || this.touchControls.moveY !== 0)) {
                        this.velocity.x += (-forward.x * this.touchControls.moveY + right.x * this.touchControls.moveX) * normalSpeed * delta;
                        this.velocity.z += (-forward.z * this.touchControls.moveY + right.z * this.touchControls.moveX) * normalSpeed * delta;
                    } else { // desktop pointer-lock WASD
                        if (this.keys['KeyW']) {
                            this.velocity.x += forward.x * normalSpeed * delta;
                            this.velocity.z += forward.z * normalSpeed * delta;
                        }
                        if (this.keys['KeyS']) {
                            this.velocity.x -= forward.x * normalSpeed * delta;
                            this.velocity.z -= forward.z * normalSpeed * delta;
                        }
                        if (this.keys['KeyD']) {
                            this.velocity.x += right.x * normalSpeed * delta;
                            this.velocity.z += right.z * normalSpeed * delta;
                        }
                        if (this.keys['KeyA']) {
                            this.velocity.x -= right.x * normalSpeed * delta;
                            this.velocity.z -= right.z * normalSpeed * delta;
                        }
                    }
                    
                    // Apply friction
                    this.velocity.x *= 0.85;
                    this.velocity.z *= 0.85;
                    
                    // Calculate new position
                    const newPos = this.position.clone().add(this.velocity.clone().multiplyScalar(delta));
                    
                    // Check collisions with buildings - horizontal and vertical
                    let collided = false;
                    let structureHeight = -Infinity;
                    const playerRadius = 1;
                    const playerHeight = 3;
                    const maxStepHeight = 5;
                    
                    for (const box of this.collisionBoxes) {
                        // Check if player is horizontally within the building footprint
                        const inFootprint = newPos.x + playerRadius > box.minX && newPos.x - playerRadius < box.maxX &&
                                          newPos.z + playerRadius > box.minZ && newPos.z - playerRadius < box.maxZ;
                        
                        if (inFootprint) {
                            // Gentle step-up allowance: treat low rises as ground instead of blocking
                            const heightDiff = box.maxY - this.position.y;
                            if (heightDiff > -maxStepHeight && heightDiff <= maxStepHeight && newPos.y + playerHeight > box.minY) {
                                structureHeight = Math.max(structureHeight, box.maxY);
                                continue;
                            }

                            // Check if player is above the structure (can stand on top)
                            if (this.position.y >= box.maxY - 2 && newPos.y >= box.maxY - 2) {
                                // Player is on top of structure - track the height
                                structureHeight = Math.max(structureHeight, box.maxY);
                            } 
                            // Check if player is colliding with interior
                            else if (newPos.y + playerHeight > box.minY && newPos.y < box.maxY) {
                                collided = true;
                                
                                // Push player out horizontally
                                const centerX = (box.minX + box.maxX) / 2;
                                const centerZ = (box.minZ + box.maxZ) / 2;
                                const dx = newPos.x - centerX;
                                const dz = newPos.z - centerZ;
                                const dist = Math.sqrt(dx * dx + dz * dz);
                                if (dist > 0) {
                                    const pushDist = Math.max(Math.abs(box.maxX - box.minX), Math.abs(box.maxZ - box.minZ)) / 2 + playerRadius;
                                    newPos.x = centerX + (dx / dist) * pushDist;
                                    newPos.z = centerZ + (dz / dist) * pushDist;
                                }
                                
                                // Stop horizontal velocity on collision
                                this.velocity.x = 0;
                                this.velocity.z = 0;
                                break;
                            }
                        }
                    }
                    
                    // Update position
                    this.position.copy(newPos);
                    if (this.rig) this.rig.position.copy(this.position);
                    
                    // Ground collision - check terrain, structures, foundation slope, and frozen water
                    const groundH = this.terrainGen ? this.terrainGen.getHeight(this.position.x, this.position.z) : -Infinity;
                    const foundationH = this.getFoundationHeightAt(this.position.x, this.position.z);
                    let effectiveGroundHeight = Number.isFinite(groundH) ? groundH : -Infinity;
                    if (foundationH !== null) effectiveGroundHeight = Math.max(effectiveGroundHeight, foundationH);
                    
                    // Check if standing on structure
                    if (structureHeight > groundH && this.position.y <= structureHeight + playerHeight) {
                        effectiveGroundHeight = structureHeight;
                    }
                    
                    // Check frozen water (winter season)
                    const season = this.timeSystem.getSeason();
                    const waterLevel = 300;
                    if (season === 'Winter' && Number.isFinite(groundH) && groundH < waterLevel && waterLevel > effectiveGroundHeight) {
                        effectiveGroundHeight = waterLevel; // Stand on ice
                    }
                    
                    if (this.position.y <= effectiveGroundHeight + playerHeight) {
                        this.position.y = effectiveGroundHeight + playerHeight;
                        this.velocity.y = 0;
                        this.onGround = true;
                    } else {
                        this.onGround = false;
                    }
                    
                    // Jump
                    if (this.keys['Space'] && this.onGround) {
                        this.velocity.y = CONFIG.JUMP_FORCE;
                        this.onGround = false;
                    }
                }
                
                // Update camera position and rotation
                if (!this.isInVR && this.rig) {
                    this.rig.position.copy(this.position);
                }
                
                // In VR, don't override head rotation - let the headset handle it
                // Only apply yaw rotation to the camera rig
                if (this.isInVR) {
                    // Apply yaw at the rig level; headset handles fine rotation
                    if (this.rig) this.rig.rotation.y = this.yaw;
                } else {
                    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
                }
                
                this.camera.updateMatrixWorld(); // Force update so children (torch light) move with camera
                
                // Update torch light
                if (this.hasTorch) {
                    const flicker = 2.5 + Math.random() * 0.5;
                this.torchLight.intensity = flicker;
                // Animate flame
                this.torch.children[1].scale.y = 0.9 + Math.random() * 0.2;
                // Force world update so light/shadows follow the player
                this.torch.updateMatrixWorld(true);
                if (this.torchLight.shadow) this.torchLight.shadow.needsUpdate = true;
            }

                // Animate spear thrust (desktop)
                if (!this.isInVR && this.spear) {
                    if (this.spearThrustProgress > 0) {
                        this.spearThrustProgress = Math.max(0, this.spearThrustProgress - delta * 2.5);
                    }
                    const thrust = Math.sin(this.spearThrustProgress * Math.PI);
                    this.spear.position.z = -0.8 - thrust * 0.35;
                    this.spear.rotation.x = -Math.PI / 4 + thrust * 0.2;
                }
            }
            
            updateUI() {
                const torchStatus = this.hasTorch ? ' | TORCH ON' : '';
                const fovStatus = this.wideFOV ? ' | WIDE FOV' : '';
                document.getElementById('timeInfo').textContent = 
                    `Day: ${this.timeSystem.getDayNumber()} | Season: ${this.timeSystem.getSeason()} (${this.timeSystem.timeMultiplier}x)${this.godMode ? ' | GOD' : ''}${torchStatus}${fovStatus}`;
                document.getElementById('posInfo').textContent = 
                    `X: ${Math.floor(this.position.x)} Y: ${Math.floor(this.position.y)} Z: ${Math.floor(this.position.z)}`;
                document.getElementById('fpsInfo').textContent = `FPS: ${Math.round(this.fps)}`;
                
                const totalTrees = this.treeCountClose + this.treeCountMedium;
                document.getElementById('tempInfo').textContent = 
                    `Temp: ${Math.floor(this.timeSystem.getTemperature())}°C | Trees: ${totalTrees} | Seed: ${this.currentSeed} | Chunks: ${this.chunks.size} | Structures: ${this.structures.size} (${this.structureShadowCount} with shadows)`;
            }
            
            animate() {
                if (!this.readyToRender) return;
                const now = Date.now();
                const delta = Math.min((now - this.lastUpdate) / 1000, 0.1);
                this.lastUpdate = now;
                this.frameSamples++;
                const sampleNow = performance.now();
                if (sampleNow - this.lastFpsSample >= 500) {
                    this.fps = (this.frameSamples * 1000) / (sampleNow - this.lastFpsSample);
                    this.frameSamples = 0;
                    this.lastFpsSample = sampleNow;
                }
                
                const hidden = document.hidden;
                // Update terrain colors every 2 seconds
                if (!hidden && now - this.lastColorUpdate > 2000) {
                    this.updateTerrainColors();
                    this.lastColorUpdate = now;
                }
                
                // Update structure shadows every 500ms for better performance
                if (!hidden && now - this.lastShadowUpdate > 500) {
                    this.updateStructureShadows();
                    this.lastShadowUpdate = now;
                }
                
                if (!hidden) {
                    this.updatePlayer(delta);
                    this.updateChunks();
                    this.updateSky();
                    this.updateSnow();
                    this.updateUI();
                    // Persist state periodically
                    if (now - this.lastPersistSave > 3000) {
                        this.savePersistedState();
                        this.lastPersistSave = now;
                    }
                }

                // Smooth peer avatars
                for (const [, mesh] of this.peerMeshes.entries()) {
                    const group = mesh.group || mesh;
                    const target = group?.userData?.targetPos;
                    if (group && target) {
                        group.position.lerp(target, 0.15);
                    }
                }

                // Spear hit test (VR continuous, desktop during attack window)
                this.performSpearHitTest(this.isInVR);

                // Event-based state broadcast with keepalive
                this.maybeBroadcastState();
                
                this.renderer.render(this.scene, this.camera);
            }

            startBackgroundHeartbeat() {
                if (this.backgroundHeartbeat) return;
                this.backgroundHeartbeat = setInterval(() => this.publishPlayerState(), PRESENCE_HEARTBEAT_MS);
            }

            stopBackgroundHeartbeat() {
                if (this.backgroundHeartbeat) {
                    clearInterval(this.backgroundHeartbeat);
                    this.backgroundHeartbeat = null;
                }
            }

            setupVisibilityHeartbeat() {
                if (this.visibilityHandler) return;
                this.visibilityHandler = () => {
                    if (document.hidden) {
                        this.startBackgroundHeartbeat();
                    } else {
                        this.stopBackgroundHeartbeat();
                        this.publishPlayerState();
                    }
                };
                document.addEventListener('visibilitychange', this.visibilityHandler);
                if (document.hidden) {
                    this.startBackgroundHeartbeat();
                }
            }

            startPeerCleanup() {
                if (this.peerCleanupInterval) return;
                this.peerCleanupInterval = setInterval(() => this.pruneStalePeers(), PEER_PRUNE_INTERVAL_MS);
            }

            stopPeerCleanup() {
                if (this.peerCleanupInterval) {
                    clearInterval(this.peerCleanupInterval);
                    this.peerCleanupInterval = null;
                }
            }

            pruneStalePeers() {
                const cutoff = Date.now() - PEER_STALE_MS;
                for (const [peerId, data] of this.peers.entries()) {
                    if ((data?.lastSeen || 0) < cutoff) {
                        this.removePeer(peerId);
                    }
                }
            }

            adjustTimeMultiplier(next) {
                this.timeSystem.setTimeMultiplier(next);
                this.broadcastTimeAnchor(true);
            }

            applyFovSetting() {
                if (!this.camera) return;
                this.camera.fov = this.wideFOV ? 120 : this.baseFOV;
                this.camera.updateProjectionMatrix();
            }

            broadcastTimeAnchor(force = false) {
                if (!this.stateManager || !this.myPeerId) return;
                const now = Date.now();
                // only first peer should anchor unless forced
                const anchor = this.stateManager.readScoped
                    ? this.stateManager.readScoped(this.gameNamespace, TIME_ANCHOR_KEY)
                    : null;
                if (!force && anchor && anchor.peerId !== this.myPeerId) return;
                // throttle to avoid spamming
                if (now - this.lastTimeSyncBroadcast < 500) return;
                this.lastTimeSyncBroadcast = now;
                this.stateManager.writeScoped(this.gameNamespace, 'time', {
                    multiplier: this.timeSystem.timeMultiplier,
                    time: this.timeSystem.getTime(),
                    sentAt: now,
                    peerId: this.myPeerId
                });
                this.stateManager.writeScoped(this.gameNamespace, TIME_ANCHOR_KEY, {
                    multiplier: this.timeSystem.timeMultiplier,
                    time: this.timeSystem.getTime(),
                    sentAt: now,
                    peerId: this.myPeerId
                });
            }

            applyRemoteTimeSync(payload) {
                if (!payload || payload.peerId === this.myPeerId) return;
                this.timeSystem.applyRemoteSync(payload);
            }

            syncExistingTimeAnchor() {
                if (!this.stateManager?.readScoped) return;
                const anchor = this.stateManager.readScoped(this.gameNamespace, TIME_ANCHOR_KEY);
                if (anchor) {
                    this.applyRemoteTimeSync(anchor);
                }
                const lastTime = this.stateManager.readScoped(this.gameNamespace, 'time');
                if (lastTime) {
                    this.applyRemoteTimeSync(lastTime);
                }
            }

            maybeBroadcastState(force = false) {
                if (!this.stateManager || !this.myPeerId) return;
                const now = Date.now();
                if (!force && (now - this.lastStateSend) < STATE_EVENT_MIN_MS) return;
                const pos = new THREE.Vector3();
                this.camera.getWorldPosition(pos);
                const rotY = this.camera.rotation.y;
                const moved = pos.distanceTo(this.lastSentState.position) > STATE_POS_THRESHOLD;
                const rotated = Math.abs(rotY - this.lastSentState.rotationY) > STATE_ROT_THRESHOLD;
                const colorChanged = this.lastSentState.color !== this.myColor;
                const keepalive = (now - this.lastStateSend) > STATE_KEEPALIVE_MS;
                if (!force && !(moved || rotated || colorChanged || keepalive)) return;

                this.lastSentState.position.copy(pos);
                this.lastSentState.rotationY = rotY;
                this.lastSentState.color = this.myColor;
                this.lastStateSend = now;

                const payload = {
                    type: 'state',
                    position: { x: pos.x, y: pos.y, z: pos.z },
                    rotation: { y: rotY },
                    color: this.myColor,
                    kills: this.killCount,
                    size: this.getScaleForKills(this.killCount),
                    torch: this.hasTorch,
                    spear: {
                        thrust: this.spearThrustProgress,
                        visible: true,
                        reach: this.getSpearReach()
                    },
                    ts: now
                };
                this.stateManager.writeScoped(this.gameNamespace, `evt-${this.myPeerId}`, payload);
                // also refresh presence timestamp for pruning
                this.stateManager.writeScoped(this.gameNamespace, `player-${this.myPeerId}`, {
                    position: payload.position,
                    rotation: payload.rotation,
                    color: payload.color,
                    kills: this.killCount,
                    size: payload.size,
                    torch: this.hasTorch,
                    spear: payload.spear,
                    ts: now
                });
            }

            publishPlayerState(force = false) {
                this.maybeBroadcastState(force);
            }

            triggerAttack() {
                const now = performance.now();
                this.attackActiveUntil = now + 350;
                this.spearThrustProgress = 1;
                this.performSpearHitTest(true);
            }

            performSpearHitTest(force = false) {
                const now = performance.now();
                if (!force && now > this.attackActiveUntil && !this.isInVR) return;
                const tip = this.getSpearTip();
                if (!tip) return;
                const tmpBox = new THREE.Box3();
                const sphere = new THREE.Sphere(tip, this.getSpearReach());
                for (const [peerId, mesh] of this.peerMeshes.entries()) {
                    const group = mesh.group || mesh;
                    tmpBox.setFromObject(group);
                    if (tmpBox.intersectsSphere(sphere)) {
                        this.registerHit(peerId);
                        break;
                    }
                }
            }

            getSpearTip() {
                if (!this.spear) return null;
                this.spear.updateMatrixWorld();
                const tipLocal = new THREE.Vector3(0, 0.8 * this.getSpearReach(), 0);
                return tipLocal.applyMatrix4(this.spear.matrixWorld);
            }

            registerHit(peerId) {
                if (!this.stateManager || !this.myPeerId) return;
                const ts = Date.now();
                this.stateManager.writeScoped(this.gameNamespace, `attack-${this.myPeerId}`, { victimId: peerId, ts });
            }

            applyRemotePlayer(peerId, data) {
                if (!data) {
                    this.removePeer(peerId);
                    return;
                }
                if (!data.position || !data.rotation) return;
                let mesh = this.peerMeshes.get(peerId);
                if (!mesh || !mesh.group) {
                    // Replace legacy mesh with full rig
                    if (mesh) this.removePeer(peerId);
                    mesh = this.createPeerRig(data.color || 0x00ffff);
                    this.scene.add(mesh.group);
                    this.peerMeshes.set(peerId, mesh);
                }
                if (!mesh.group.userData.targetPos) {
                    mesh.group.userData.targetPos = new THREE.Vector3();
                }
                const kills = data.kills || 0;
                mesh.group.userData.targetPos.set(data.position.x, data.position.y, data.position.z);
                mesh.group.userData.killCount = kills;
                this.peerKills.set(peerId, kills);
                this.applyPeerGrowth(peerId, kills);
                if (data.color) mesh.body.material.color.setHex(data.color);
                mesh.group.rotation.y = data.rotation?.y || 0;
                const lastSeen = typeof data.ts === 'number' ? data.ts : Date.now();
                this.peers.set(peerId, { lastSeen });
            }

            handleRemoteEvent(peerId, payload) {
                if (!payload) return;
                if (payload.type === 'state') {
                    this.applyRemotePlayer(peerId, {
                        position: payload.position,
                        rotation: payload.rotation,
                        color: payload.color,
                        kills: payload.kills,
                        size: payload.size,
                        ts: payload.ts
                    });
                    if (payload.torch) this.applyRemoteTorch(peerId, payload.torch);
                    if (payload.spear) this.applyRemoteSpear(peerId, payload.spear);
                }
            }

            handleNetworkMessage(peerId, message) {
                if (!this.terrainSharingEnabled) return;
                if (!message?.type) return;
                if (message.type === 'terrain-request') {
                    this.handleTerrainRequest(peerId, message.data);
                } else if (message.type === 'terrain-response') {
                    this.handleTerrainResponse(message.data);
                }
            }

            handleTerrainRequest(peerId, data) {
                if (!this.terrainSharingEnabled) return;
                if (!data?.key || !this.network) return;
                const cached = this.terrainCache?.getChunk(data.key);
                if (!cached || cached.lodStep > 64) return; // only send low LOD
                const zone = this.getChunkZoneFromLod(cached.lodStep);
                if (zone.name !== 'far') return;
                this.network.sendToPeer?.(peerId, {
                    type: 'terrain-response',
                    data: { key: data.key, chunk: cached }
                }).catch?.(() => {});
            }

            handleTerrainResponse(data) {
                if (!this.terrainSharingEnabled) return;
                if (!data?.key || !data?.chunk) return;
                const { key, chunk } = data;
                const parts = key.split('::');
                const chunkKey = parts[0];
                const lodMatch = key.match(/::lod-(\d+)/);
                const lodStep = chunk.lodStep || (lodMatch ? parseInt(lodMatch[1], 10) : 64);
                const zone = this.getChunkZoneFromLod(lodStep);
                if (zone.name !== 'far') return;
                this.requestedTerrain?.delete(key);
                this.terrainCache?.putChunk(key, chunk);
                if (this.chunks.has(chunkKey)) return;
                const built = this.buildChunkFromData(chunkKey, zone, chunk);
                if (built) {
                    this.chunks.set(chunkKey, built);
                    this.applySeasonToChunk(built, this.getSeasonFactors());
                }
            }

            createPeerRig(color) {
                const group = new THREE.Group();
                group.userData.targetPos = new THREE.Vector3();
                group.userData.killCount = 0;
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(4, 6, 4),
                    new THREE.MeshPhongMaterial({ color })
                );
                body.castShadow = true;
                body.receiveShadow = true;
                group.add(body);

                const torch = new THREE.Group();
                torch.position.set(-1.5, 0, -1.5);
                const torchHandle = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.05, 0.05, 1.2),
                    new THREE.MeshLambertMaterial({ color: 0x8b4513 })
                );
                torchHandle.position.y = -0.6;
                torch.add(torchHandle);
                const torchLight = new THREE.PointLight(0xff6600, 4, 60, 1.2);
                torchLight.position.set(0, 0, 0);
                torchLight.castShadow = true;
                torchLight.shadow.mapSize.width = 1024;
                torchLight.shadow.mapSize.height = 1024;
                torchLight.shadow.bias = -0.0005;
                torchLight.shadow.radius = 2;
                torch.add(torchLight);
                torch.visible = false;
                group.add(torch);

                const spear = new THREE.Group();
                const shaft = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.03, 0.03, 1.2),
                    new THREE.MeshLambertMaterial({ color: 0x8b6914 })
                );
                shaft.position.y = -0.6;
                spear.add(shaft);
                const blade = new THREE.Mesh(
                    new THREE.ConeGeometry(0.08, 0.25, 4),
                    new THREE.MeshLambertMaterial({ color: 0x888888 })
                );
                blade.position.y = 0.1;
                spear.add(blade);
                spear.position.set(1.6, -0.2, -1.0);
                spear.rotation.set(-Math.PI / 4, 0, Math.PI / 16);
                group.add(spear);

                group.userData.targetPos = new THREE.Vector3();
                return { group, body, torch, torchLight, spear };
            }

            applyRemoteTorch(peerId, torchData) {
                const mesh = this.peerMeshes.get(peerId);
                if (!mesh || !mesh.torch) return;
                mesh.torch.visible = !!torchData;
                if (mesh.torchLight) mesh.torchLight.visible = !!torchData;
            }

            applyRemoteSpear(peerId, spearData) {
                const mesh = this.peerMeshes.get(peerId);
                if (!mesh) return;
                mesh.spear.visible = !!spearData?.visible;
                const thrust = spearData?.thrust || 0;
                mesh.spear.position.z = -1.0 - Math.sin(thrust * Math.PI) * 0.3;
                mesh.spear.rotation.x = -Math.PI / 4 + Math.sin(thrust * Math.PI) * 0.15;
                const reach = spearData?.reach || 1;
                mesh.spear.scale.setScalar(reach);
            }

            removePeer(peerId) {
                const mesh = this.peerMeshes.get(peerId);
                if (mesh) {
                    this.scene.remove(mesh.group || mesh);
                }
                this.peerMeshes.delete(peerId);
                this.peers.delete(peerId);
                this.peerKills.delete(peerId);
            }

            removeChunk(key, chunk) {
                // Remove terrain mesh
                if (chunk.mesh) {
                    this.scene.remove(chunk.mesh);
                    if (chunk.mesh.geometry) chunk.mesh.geometry.dispose();
                    if (chunk.mesh.material) chunk.mesh.material.dispose();
                }
                // Remove snow mesh
                if (chunk.snowMesh) {
                    this.scene.remove(chunk.snowMesh);
                    if (chunk.snowMesh.geometry) chunk.snowMesh.geometry.dispose();
                    if (chunk.snowMesh.material) chunk.snowMesh.material.dispose();
                }
                // Remove water
                if (chunk.water) {
                    this.scene.remove(chunk.water);
                    if (chunk.water.geometry) chunk.water.geometry.dispose();
                    if (chunk.water.material) chunk.water.material.dispose();
                }
                // Hide trees
                if (chunk.treeIndices) {
                    this.hideTreeMatrices(chunk.treeIndices.close, this.treeInstancedMeshClose);
                    this.hideTreeMatrices(chunk.treeIndices.medium, this.treeInstancedMeshMedium);
                }
                // Remove structures and collision boxes
                const structKeys = chunk.structuresKeys && chunk.structuresKeys.length ? chunk.structuresKeys : [key];
                structKeys.forEach((sKey) => {
                    if (this.structures.has(sKey)) {
                        const structure = this.structures.get(sKey);
                        structure.traverse((child) => {
                            if (child.isMesh) {
                                child.geometry?.dispose();
                                if (child.material) {
                                    if (Array.isArray(child.material)) child.material.forEach(mat => mat.dispose());
                                    else child.material.dispose();
                                }
                            }
                        });
                        this.scene.remove(structure);
                        this.structures.delete(sKey);
                    }
                    this.collisionBoxes = this.collisionBoxes.filter(box => box.chunkKey !== sKey);
                });
                this.chunks.delete(key);
                this.recalcTreeCounts();
            }

            handleRemoteAttack(attackerId, payload) {
                if (!payload) return;
                const last = this.attackEventsSeen.get(attackerId);
                if (last === payload.ts) return;
                this.attackEventsSeen.set(attackerId, payload.ts);
                if (payload.victimId === this.myPeerId) {
                    this.respawnPlayer();
                }
                this.awardKill(attackerId);
            }

            awardKill(attackerId) {
                if (!attackerId) return;
                if (attackerId === this.myPeerId) {
                    this.killCount += 1;
                    this.spearReach = this.getSpearReach();
                    this.applyLocalGrowth();
                    this.publishPlayerState(true);
                    return;
                }
                const current = this.peerKills.get(attackerId) || 0;
                const next = current + 1;
                this.peerKills.set(attackerId, next);
                this.applyPeerGrowth(attackerId, next);
            }

            respawnPlayer() {
                const anchors = Array.from(this.peerMeshes.values()).map(m => {
                    const g = m.group || m;
                    return g.userData?.targetPos || g.position;
                });
                const base = anchors.length ? anchors[Math.floor(Math.random() * anchors.length)] : new THREE.Vector3(0, 0, 320);
                const angle = Math.random() * Math.PI * 2;
                const radius = 80;
                const pos = new THREE.Vector3(
                    base.x + Math.cos(angle) * radius,
                    0,
                    base.z + Math.sin(angle) * radius
                );
                const h = this.terrainGen ? this.terrainGen.getHeight(pos.x, pos.z) : 0;
                pos.y = h + 6;
                this.position.copy(pos);
                if (this.rig) this.rig.position.copy(this.position);
                this.velocity.set(0, 0, 0);
                this.onGround = false;
                this.publishPlayerState();
            }
        }

        
