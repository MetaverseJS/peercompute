import * as THREE from 'three';
import { BASE_RADIUS_UNITS } from './constants.js';

export class TinyPlanetControls {
    constructor(camera, domElement, scene, onExit, inputMultiplexer = null) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        this.onExitCallback = onExit;
        this.externalInput = inputMultiplexer;
        this.planetMesh = null;
        this.planetGroup = null;
        this.surfaceRay = new THREE.Raycaster();

        // Configuration
        this.planetRadius = BASE_RADIUS_UNITS;
        this.walkSpeed = 3.5;
        this.runSpeed = 6.5;
        this.flySpeed = 8.0;
        this.swimSpeed = 2.5;
        this.jumpForce = 6.0;
        this.gravity = 30.0;
        this.playerHeight = 0.04;
        this.accelGround = 32;
        this.accelAir = 10;
        this.accelFly = 14;
        this.accelSwim = 10;
        this.frictionGround = 9;
        this.stopSpeed = 1.2;

        // State
        this.enabled = false;
        this.isLocked = false;
        this.isFlying = false;
        this.isSwimming = false;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.rollLeft = false;
        this.rollRight = false;
        this.lookUp = false;
        this.lookDown = false;
        this.lookLeft = false;
        this.lookRight = false;
        this.isRunning = false;
        this.canJump = false;
        this.jumpRequested = false;
        this.keyLookYawVelocity = 0;
        this.keyLookPitchVelocity = 0;
        this.keyLookRollVelocity = 0;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.verticalVelocity = 0;
        this.horizontalVelocity = new THREE.Vector3();

        this.keyLookSpeed = 1.8;
        this.keyRollSpeed = 2.4;

        // The player rig
        this.player = new THREE.Object3D();
        this.player.name = "TinyPlanetPlayer";
        
        // Helper vectors
        this.raycaster = new THREE.Raycaster();
        this.worldUp = new THREE.Vector3();
        this.dummyVec = new THREE.Vector3();
        this.dummyQuat = new THREE.Quaternion();
        this.camLocalUp = new THREE.Vector3();

        // Bind events
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onPointerLockChange = this.onPointerLockChange.bind(this);
    }

    setPlanet(mesh) {
        this.planetMesh = mesh;
    }

    // Enter FPS mode at specific world position
    enter(startPointWorld, planetMesh, cameraForForward = null) {
        if (this.enabled) return;
        this.enabled = true;
        this.planetMesh = planetMesh;
        this.planetGroup = planetMesh.parent;

        // Convert start point to Local Direction
        const localPoint = startPointWorld.clone();
        this.planetMesh.worldToLocal(localPoint);
        const startDir = localPoint.normalize();
        const camForward = cameraForForward ? cameraForForward.getWorldDirection(new THREE.Vector3()) : new THREE.Vector3(0, 0, -1);
        const forwardProjected = camForward.clone().projectOnPlane(startDir).normalize();
        const basisForward = forwardProjected.lengthSq() > 1e-6 ? forwardProjected : this.basisEast(startDir);

        // Attach player to Planet (Local Space)
        this.planetMesh.add(this.player);
        
        // Position player
        // We start slightly above surface based on startDir
        const spawnHeight = localPoint.length() + 2.0; 
        this.player.position.copy(startDir).multiplyScalar(spawnHeight);
        this.alignToFrame(startDir, basisForward);
        
        // Attach camera
        this.player.add(this.camera);
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);

        // Reset physics
        this.velocity.set(0, 0, 0);
        this.verticalVelocity = 0;
        this.isFlying = false;
        this.horizontalVelocity.set(0, 0, 0);

        if (this.externalInput && this.externalInput.setLookMode) {
            this.externalInput.setLookMode('surface');
        }

        // Lock pointer (desktop only)
        const isMobile = /Mobi|Android|iP(ad|hone|od)/i.test(navigator.userAgent || '');
        if (!isMobile && this.domElement.requestPointerLock) {
            this.domElement.requestPointerLock();
        }
        
        this.addListeners();
    }

    exit() {
        if (!this.enabled) return;
        this.enabled = false;

        this.removeListeners();
        document.exitPointerLock();

        // Detach camera
        this.player.remove(this.camera);
        this.scene.add(this.camera); // Return to scene root
        
        // Remove player
        if (this.player.parent) {
            this.player.parent.remove(this.player);
        }
        
        if (this.onExitCallback) {
            this.onExitCallback();
        }

        if (this.externalInput) {
            this.externalInput.clear();
            if (this.externalInput.setLookMode) this.externalInput.setLookMode('orbit');
        }

        // Reset local input flags so stale state doesn't persist between sessions.
        this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false;
        this.moveUp = this.moveDown = false;
        this.rollLeft = this.rollRight = false;
        this.lookUp = this.lookDown = this.lookLeft = this.lookRight = false;
        this.isRunning = false;
        this.canJump = false;
        this.horizontalVelocity.set(0, 0, 0);
        this.keyLookYawVelocity = 0;
        this.keyLookPitchVelocity = 0;
        this.keyLookRollVelocity = 0;
    }

    addListeners() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('pointerlockchange', this.onPointerLockChange);
    }

    removeListeners() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    }

    onPointerLockChange() {
        this.isLocked = document.pointerLockElement === this.domElement;
        if (!this.isLocked && this.enabled) {
            // User unlocked cursor
        }
    }

    onKeyDown(event) {
        const code = event.code;
        switch (code) {
            case 'ArrowUp':
                this.lookUp = true;
                event.preventDefault();
                break;
            case 'ArrowDown':
                this.lookDown = true;
                event.preventDefault();
                break;
            case 'ArrowLeft':
                this.lookLeft = true;
                event.preventDefault();
                break;
            case 'ArrowRight':
                this.lookRight = true;
                event.preventDefault();
                break;
            case 'KeyW': this.moveForward = true; break;
            case 'KeyA': this.moveLeft = true; break;
            case 'KeyS': this.moveBackward = true; break;
            case 'KeyD': this.moveRight = true; break;
            case 'Space':
            case 'Numpad0':
                event.preventDefault();
                if(this.isFlying) {
                    this.moveUp = true;
                } else {
                    this.jumpRequested = true;
                }
                break;
            case 'ControlLeft':
            case 'ControlRight':
            case 'KeyC':
                event.preventDefault();
                this.moveDown = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.isRunning = true;
                break;
            case 'KeyF': this.toggleFlight(); break;
            case 'KeyQ': this.rollLeft = true; break;
            case 'KeyE': this.rollRight = true; break;
            case 'Escape': this.exit(); break; // Allow manual exit
        }
    }

    onKeyUp(event) {
        const code = event.code;
        switch (code) {
            case 'ArrowUp': this.lookUp = false; break;
            case 'ArrowDown': this.lookDown = false; break;
            case 'ArrowLeft': this.lookLeft = false; break;
            case 'ArrowRight': this.lookRight = false; break;
            case 'KeyW': this.moveForward = false; break;
            case 'KeyA': this.moveLeft = false; break;
            case 'KeyS': this.moveBackward = false; break;
            case 'KeyD': this.moveRight = false; break;
            case 'Space':
            case 'Numpad0':
                this.moveUp = false;
                break;
            case 'ControlLeft':
            case 'ControlRight':
            case 'KeyC':
                this.moveDown = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.isRunning = false;
                break;
            case 'KeyQ': this.rollLeft = false; break;
            case 'KeyE': this.rollRight = false; break;
        }
    }

    onMouseMove(event) {
        if (!this.isLocked) return;

        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        if (this.isFlying) {
            const camLocalUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);
            this.player.rotateOnAxis(camLocalUp, -movementX * 0.002);
            this.camera.rotateX(-movementY * 0.002);
        } else {
            this.player.rotateY(-movementX * 0.002);
            this.camera.rotateX(-movementY * 0.002);
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
        }
    }

    basisEast(up) {
        const axis = Math.abs(up.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
        const e = new THREE.Vector3().crossVectors(axis, up).normalize();
        return e.lengthSq() > 1e-6 ? e : new THREE.Vector3(1, 0, 0);
    }

    alignToFrame(up, forward) {
        const safeUp = up.clone().normalize();
        let fwd = forward.clone().projectOnPlane(safeUp);
        if (fwd.lengthSq() < 1e-6) fwd = this.basisEast(safeUp);
        fwd.normalize();
        const right = new THREE.Vector3().crossVectors(fwd, safeUp).normalize();
        fwd.crossVectors(safeUp, right).normalize();
        const m = new THREE.Matrix4().makeBasis(right, safeUp, fwd.negate());
        this.player.quaternion.setFromRotationMatrix(m);
        this.player.up.copy(safeUp);
    }

    toggleFlight() {
        this.isFlying = !this.isFlying;
        this.verticalVelocity = 0;
        if (!this.isFlying) {
            // Re-align to gravity
            const planetNormal = this.player.position.clone().normalize();
            const dummyUp = new THREE.Vector3(0, 1, 0);
            const alignQuat = new THREE.Quaternion().setFromUnitVectors(dummyUp, planetNormal);
            this.player.quaternion.copy(alignQuat);
            this.player.up.copy(planetNormal);
            this.camera.rotation.x = 0;
            this.velocity.set(0,0,0);
        }
    }

    snapToSurface() {
        if (!this.planetMesh || !this.planetMesh.userData?.forge || !this.planetMesh.userData?.settings) return;
        const forge = this.planetMesh.userData.forge;
        const settings = this.planetMesh.userData.settings;
        // Raycast from camera through center
        this.surfaceRay.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const hit = this.surfaceRay.intersectObject(this.planetMesh, false);
        if (!hit.length) return;
        const pointWorld = hit[0].point.clone();
        const dirLocal = pointWorld.clone();
        this.planetMesh.worldToLocal(dirLocal);
        const dir = dirLocal.normalize();
        const h = forge.getHeightAt(dir);
        const targetRadius = settings.radius + (h - settings.seaLevel) * settings.heightScale + this.playerHeight;
        const newPos = dir.clone().multiplyScalar(targetRadius + 0.2);
        this.player.position.copy(newPos);
        // Align up
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
        this.player.quaternion.copy(quat);
        this.player.up.copy(dir);
        this.camera.rotation.set(0,0,0);
        this.velocity.set(0,0,0);
        this.verticalVelocity = 0;
    }

    update(delta) {
        if (!this.enabled) return;
        const dt = Math.min(Math.max(delta ?? 0, 0), 0.05);

        const externalState = this.externalInput?.getState?.();
        const moveForward = this.moveForward || !!externalState?.forward;
        const moveBackward = this.moveBackward || !!externalState?.backward;
        const moveLeft = this.moveLeft || !!externalState?.left;
        const moveRight = this.moveRight || !!externalState?.right;
        const moveUp = this.moveUp || !!externalState?.up;
        const moveDown = this.moveDown || !!externalState?.down;
        const runActive = this.isRunning || !!externalState?.run;
        const rollLeft = this.rollLeft || !!externalState?.rollLeft;
        const rollRight = this.rollRight || !!externalState?.rollRight;

        if (this.externalInput) {
            if (this.externalInput.consume('flyToggle')) {
                this.toggleFlight();
            }
            if (this.externalInput.consume('exit')) {
                this.exit();
                return;
            }
            if (this.externalInput.consume('surface')) {
                this.snapToSurface();
            }
            if (!this.isFlying && this.externalInput.consume('jump')) {
                this.jumpRequested = true;
            }
            const look = this.externalInput.consumeLookDelta();
            if (Math.abs(look.x) > 1e-4 || Math.abs(look.y) > 1e-4) {
                const yaw = -look.x * 0.01;
                const pitch = -look.y * 0.01;
                this.player.rotateY(yaw);
                this.camera.rotateX(pitch);
                this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
            }
        }

        const keyPitch = (this.lookUp ? 1 : 0) - (this.lookDown ? 1 : 0);
        const keyYaw = (this.lookLeft ? 1 : 0) - (this.lookRight ? 1 : 0);
        const keyRoll = (rollLeft ? 1 : 0) - (rollRight ? 1 : 0);
        const targetYaw = keyYaw * this.keyLookSpeed;
        const targetPitch = keyPitch * this.keyLookSpeed;
        const targetRoll = keyRoll * this.keyRollSpeed;

        this.keyLookYawVelocity = targetYaw;
        this.keyLookPitchVelocity = targetPitch;
        this.keyLookRollVelocity = targetRoll;

        if (Math.abs(this.keyLookYawVelocity) > 1e-4) {
            if (this.isFlying) {
                this.camLocalUp.set(0, 1, 0).applyQuaternion(this.camera.quaternion);
                this.player.rotateOnAxis(this.camLocalUp, this.keyLookYawVelocity * dt);
            } else {
                this.player.rotateY(this.keyLookYawVelocity * dt);
            }
        }
        if (Math.abs(this.keyLookPitchVelocity) > 1e-4) {
            this.camera.rotateX(this.keyLookPitchVelocity * dt);
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
        }
        if (Math.abs(this.keyLookRollVelocity) > 1e-4) {
            this.camera.rotateZ(this.keyLookRollVelocity * dt);
        }

        let speed = this.walkSpeed;
        if (this.isFlying) speed = this.flySpeed;
        else if (runActive) speed = this.runSpeed;

        const moveVec = new THREE.Vector3();
        if (moveForward) moveVec.z += 1;
        if (moveBackward) moveVec.z -= 1;
        if (moveLeft) moveVec.x -= 1;
        if (moveRight) moveVec.x += 1;
        if (this.isFlying) moveVec.z *= -1; // Keep forward/backward consistent with ground controls
        moveVec.normalize();

        if (this.isFlying) {
            this.horizontalVelocity.multiplyScalar(0.5);
            const mv = moveVec.clone().multiplyScalar(speed * delta);
            mv.applyQuaternion(this.camera.quaternion);
            mv.applyQuaternion(this.player.quaternion); 
            this.player.position.add(mv);
        } else {
            const up = this.player.position.clone().normalize();
            const forward = new THREE.Vector3(0, 0, -1)
                .applyQuaternion(this.camera.quaternion)
                .applyQuaternion(this.player.quaternion)
                .projectOnPlane(up)
                .normalize();
            const right = new THREE.Vector3().crossVectors(forward, up).normalize();
            const walk = new THREE.Vector3();
            walk.addScaledVector(forward, moveVec.z);
            walk.addScaledVector(right, moveVec.x);
            const wishDir = walk.lengthSq() > 1e-6 ? walk.normalize() : walk;

            let targetHeight = this.planetRadius;
            const forge = this.planetMesh.userData.forge;
            const settings = this.planetMesh.userData.settings;
            if (forge && settings) {
                const dir = this.player.position.clone().normalize();
                const rawHeight = forge.getHeightAt(dir);
                targetHeight = settings.radius + (rawHeight - settings.seaLevel) * settings.heightScale;
            }
            const currentHeight = this.player.position.length();
            const floorHeight = targetHeight + this.playerHeight;
            const isOnGround = currentHeight <= floorHeight + 0.05;

            const applyFriction = () => {
                const v = this.horizontalVelocity;
                const spd = v.length();
                if (spd < 1e-5) return;
                const control = Math.max(this.stopSpeed, spd);
                const drop = control * this.frictionGround * dt;
                const newSpd = Math.max(spd - drop, 0);
                v.multiplyScalar(newSpd / spd);
            };

            const accelerate = (dir, wishSpeed, accel) => {
                if (wishSpeed <= 0 || dir.lengthSq() < 1e-6) return;
                const curSpeed = this.horizontalVelocity.dot(dir);
                const addSpeed = wishSpeed - curSpeed;
                if (addSpeed <= 0) return;
                const accelSpeed = accel * wishSpeed * dt;
                const amt = Math.min(accelSpeed, addSpeed);
                this.horizontalVelocity.addScaledVector(dir, amt);
            };

            // Grounded state and friction/acceleration.
            if (isOnGround) {
                if (wishDir.lengthSq() < 1e-6) {
                    applyFriction();
                } else {
                    applyFriction();
                    accelerate(wishDir, speed, this.accelGround);
                }
            } else if (wishDir.lengthSq() > 1e-6) {
                accelerate(wishDir, speed, this.accelAir);
            }

            const moveStep = this.horizontalVelocity.clone().multiplyScalar(dt);
            this.player.position.add(moveStep);

            // Process jump request when on ground BEFORE applying gravity
            if (isOnGround) {
                this.canJump = true;
                if (this.jumpRequested && this.canJump) {
                    this.verticalVelocity = this.jumpForce;
                    this.canJump = false;
                    // Don't zero velocity - we just jumped!
                } else {
                    this.verticalVelocity = 0;
                }
            } else {
                // In air - apply gravity
                this.verticalVelocity -= this.gravity * dt;
            }
            
            // Apply vertical movement
            if (Math.abs(this.verticalVelocity) > 1e-6) {
                this.player.translateY(this.verticalVelocity * dt);
            }

            // Floor collision - clamp to ground
            if (this.player.position.length() < floorHeight) {
                const dir = this.player.position.clone().normalize();
                this.player.position.copy(dir.multiplyScalar(floorHeight));
                if (this.verticalVelocity < 0) {
                    this.verticalVelocity = 0;
                }
                this.canJump = true;
            }
            
            // Clear jump request at end of frame
            this.jumpRequested = false;

            const upNow = this.player.position.clone().normalize();
            const currentUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.player.quaternion);
            const toUp = new THREE.Quaternion().setFromUnitVectors(currentUp, upNow);
            this.player.quaternion.premultiply(toUp);
            this.player.up.copy(upNow);
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
        }
    }
}
