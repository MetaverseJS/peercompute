import './style.css';
import * as THREE from 'three';
import { NodeKernel } from '@peercompute';

        const videoElement = document.getElementById('video');
        const canvas2d = document.getElementById('canvas2d');
        const ctx2d = canvas2d.getContext('2d');
        const canvas3d = document.getElementById('canvas3d');
        const statusElement = document.getElementById('status');
        const scoreElement = document.getElementById('score');
        const globalScoreElement = document.getElementById('global-score');

        let score = 0;
        let localHighScore = 0;
        let obstaclesEnabled = true;
        const peerScores = new Map();
        const gameNamespace = 'daddygo';
        let node = null;
        let stateManager = null;
        let myPeerId = null;

        const loadRelayConfig = async () => {
            const tryFetch = async (path) => {
                try {
                    const res = await fetch(path, { cache: 'no-store' });
                    if (res.ok) return await res.json();
                } catch (_) {
                    // ignore
                }
                return null;
            };
            return (
                (await tryFetch('/relay-config.json')) ||
                (await tryFetch('./relay-config.json')) ||
                (await tryFetch('/.relay-config.json')) ||
                (await tryFetch('./.relay-config.json')) ||
                { bootstrapPeers: [] }
            );
        };

        const normalizeBootstrapPeers = (peers) => {
            if (!Array.isArray(peers)) return [];
            return peers.filter(Boolean);
        };

        const updateGlobalHighScore = () => {
            let best = localHighScore;
            for (const data of peerScores.values()) {
                if (data && typeof data.score === 'number' && data.score > best) {
                    best = data.score;
                }
            }
            if (globalScoreElement) {
                globalScoreElement.textContent = `Global High Score: ${best}`;
            }
        };

        const publishHighScore = () => {
            if (!stateManager || !myPeerId) return;
            const payload = { score: localHighScore, updatedAt: Date.now() };
            stateManager.writeScoped(gameNamespace, `score-${myPeerId}`, payload);
        };

        async function initMultiplayer() {
            try {
                const cfg = await loadRelayConfig();
                const bootstrapPeers = normalizeBootstrapPeers(cfg.bootstrapPeers || []);
                node = new NodeKernel({
                    bootstrapPeers,
                    enablePersistence: false,
                    gameId: 'daddygo',
                    roomId: 'global'
                });
                await node.initialize();
                await node.start();
                stateManager = node.getStateManager();
                myPeerId = node.getStatus().network.peerId;

                stateManager.observeNamespace(gameNamespace, (value, key) => {
                    if (!key || !key.startsWith('score-')) return;
                    const peerId = key.replace('score-', '');
                    if (!value) {
                        peerScores.delete(peerId);
                    } else {
                        peerScores.set(peerId, value);
                    }
                    updateGlobalHighScore();
                });

                window.addEventListener('beforeunload', () => {
                    if (stateManager && myPeerId) {
                        stateManager.deleteScoped(gameNamespace, `score-${myPeerId}`);
                    }
                });

                publishHighScore();
                updateGlobalHighScore();
            } catch (err) {
                console.warn('Multiplayer high score unavailable:', err);
            }
        }

        const updateScore = (nextScore) => {
            score = nextScore;
            scoreElement.textContent = `Score: ${score}`;
            if (score > localHighScore) {
                localHighScore = score;
                publishHighScore();
            }
            updateGlobalHighScore();
        };

        // Audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Happy 8-bit collection sound
        function playCollectSound() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }

        // Sad 8-bit collision sound
        function playHitSound() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
            oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.1); // D4
            oscillator.frequency.setValueAtTime(196.00, audioContext.currentTime + 0.2); // G3
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        }

        // Explosion effect
        let explosions = [];

        function createExplosion(position) {
            const particleCount = 40;
            const particles = new THREE.Group();
            const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 });

            for (let i = 0; i < particleCount; i++) {
                const particleGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);

                particle.position.copy(position);
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
                particle.userData.life = 1.0;

                particles.add(particle);
            }

            scene.add(particles);
            explosions.push(particles);
        }

        // Three.js setup
        let scene, camera, renderer, skeleton, bones = {};
        let grids = [];
        let gridSpeed = 0.05; // Constant treadmill speed
        let currentSpeed = 0.05; // Actual speed (can be 0 when stopped)
        let icosahedrons = [];
        let obstacles = [];
        const maxIcosahedrons = 4;
        const maxObstacles = 3;
        const icosahedronRadius = 0.15; // Basketball size (~30cm diameter)
        let wasColliding = false; // Track collision state for sound

        // Handle window resize
        function handleResize() {
            const width = canvas3d.clientWidth;
            const height = canvas3d.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
        }

        function initThreeJS() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1a1a2e);

            camera = new THREE.PerspectiveCamera(75, canvas3d.clientWidth / canvas3d.clientHeight, 0.1, 1000);
            camera.position.set(0, 1, 3);
            camera.lookAt(0, 1, 0);

            renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(canvas3d.clientWidth, canvas3d.clientHeight);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 5);
            scene.add(directionalLight);

            // Create multiple grids for infinite effect
            const gridSize = 20;
            const gridDivisions = 20;
            for (let i = -1; i <= 1; i++) {
                const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0x0088ff);
                grid.material.opacity = 0.8;
                grid.material.transparent = true;
                grid.position.z = i * gridSize;
                scene.add(grid);
                grids.push(grid);
            }

            createSkeleton();
            createIcosahedrons();
            createObstacles();
            animate();
            handleResize();
        }

        function createObstacles() {
            for (let i = 0; i < maxObstacles; i++) {
                spawnObstacle();
            }
        }

        function spawnObstacle() {
            // If obstacles are disabled, don't spawn anything
            if (!obstaclesEnabled) return;
            
            const types = [
                { width: 1.5, height: 0.6, depth: 0.3, y: 0.3, name: 'low' },      // Low obstacle - jump over
                { width: 1.5, height: 0.8, depth: 0.3, y: 1.8, name: 'high' },     // High obstacle - duck
                { width: 0.6, height: 2, depth: 0.3, y: 1, name: 'left' },         // Left side - move right
                { width: 0.6, height: 2, depth: 0.3, y: 1, name: 'right' },        // Right side - move left
                { width: 0.8, height: 1.5, depth: 0.3, y: 0.75, name: 'center' }   // Center - move left or right
            ];
            
            const type = types[Math.floor(Math.random() * types.length)];
            
            const geometry = new THREE.BoxGeometry(type.width, type.height, type.depth);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xff0000,
                transparent: true,
                opacity: 0.7,
                emissive: 0xff0000,
                emissiveIntensity: 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position based on type
            let xPos = 0;
            if (type.name === 'left') xPos = -1.2;
            if (type.name === 'right') xPos = 1.2;
            
            mesh.position.set(xPos, type.y, -Math.random() * 20 - 10);
            
            // Store bounding box info
            mesh.userData = {
                width: type.width,
                height: type.height,
                depth: type.depth,
                type: type.name
            };
            
            scene.add(mesh);
            obstacles.push(mesh);
        }

        function checkObstacleCollision(obstacle) {
            const halfWidth = obstacle.userData.width / 2;
            const halfHeight = obstacle.userData.height / 2;
            const halfDepth = obstacle.userData.depth / 2;
            
            const minX = obstacle.position.x - halfWidth;
            const maxX = obstacle.position.x + halfWidth;
            const minY = obstacle.position.y - halfHeight;
            const maxY = obstacle.position.y + halfHeight;
            const minZ = obstacle.position.z - halfDepth;
            const maxZ = obstacle.position.z + halfDepth;
            
            // Check if any bone is inside the obstacle
            for (const boneName in bones) {
                if (bones[boneName].position) {
                    const pos = bones[boneName].position;
                    if (pos.x >= minX && pos.x <= maxX &&
                        pos.y >= minY && pos.y <= maxY &&
                        pos.z >= minZ && pos.z <= maxZ) {
                        return true;
                    }
                }
            }
            return false;
        }

        function createIcosahedrons() {
            const geometry = new THREE.IcosahedronGeometry(icosahedronRadius, 0);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xff69b4,
                shininess: 100,
                emissive: 0xff1493,
                emissiveIntensity: 0.2
            });

            for (let i = 0; i < maxIcosahedrons; i++) {
                spawnIcosahedron(geometry, material);
            }
        }

        function spawnIcosahedron(geometry, material) {
            const mesh = new THREE.Mesh(geometry, material);
            
            let validPosition = false;
            let attempts = 0;
            const maxAttempts = 20;
            
            // Try to find a position that doesn't overlap with obstacles
            while (!validPosition && attempts < maxAttempts) {
                // Random position: x between -1.34 and 1.34 (33% closer to center), y between 0.2 and 2, z between -30 and -5
                const x = (Math.random() - 0.5) * 2.68;
                const y = Math.random() * 1.8 + 0.2;
                const z = -Math.random() * 25 - 5;
                
                mesh.position.set(x, y, z);
                
                // Check if this position conflicts with any obstacle
                validPosition = true;
                for (const obstacle of obstacles) {
                    const dx = Math.abs(mesh.position.x - obstacle.position.x);
                    const dy = Math.abs(mesh.position.y - obstacle.position.y);
                    const dz = Math.abs(mesh.position.z - obstacle.position.z);
                    
                    // Check if icosahedron is too close to obstacle (within 2 units on z-axis)
                    if (dz < 2 && 
                        dx < (obstacle.userData.width / 2 + 0.5) &&
                        dy < (obstacle.userData.height / 2 + 0.5)) {
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
            }
            
            // Random rotation for visual variety
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            scene.add(mesh);
            icosahedrons.push(mesh);
        }

        function checkCollisions() {
            // Check each icosahedron against all bone positions
            for (let i = icosahedrons.length - 1; i >= 0; i--) {
                const ico = icosahedrons[i];
                let collided = false;

                // Check collision with all joints
                for (const boneName in bones) {
                    if (bones[boneName].position) {
                        const distance = ico.position.distanceTo(bones[boneName].position);
                        if (distance < icosahedronRadius + 0.1) { // 0.1 is collision tolerance
                            collided = true;
                            break;
                        }
                    }
                }

                // Remove if collided or passed the camera
                if (collided || ico.position.z > 5) {
                    
                    // Increment score only on collision, not when passing camera
                    if (collided) {
                        createExplosion(ico.position);
                        updateScore(score + 1);
                        // Speed up treadmill by 5% for each collection
                        gridSpeed *= 1.05;
                        // Play happy collection sound
                        playCollectSound();
                    }

                    scene.remove(ico);
                    icosahedrons.splice(i, 1);
                    
                    // Spawn a new one
                    const geometry = new THREE.IcosahedronGeometry(icosahedronRadius, 0);
                    const material = new THREE.MeshPhongMaterial({ 
                        color: 0xff69b4,
                        shininess: 100,
                        emissive: 0xff1493,
                        emissiveIntensity: 0.2
                    });
                    spawnIcosahedron(geometry, material);
                }
            }
        }

        function createSkeleton() {
            const boneMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
            const jointMaterial = new THREE.MeshPhongMaterial({ color: 0xff4444 });

            // Create joints as spheres
            function createJoint(name, size = 0.03) {
                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const joint = new THREE.Mesh(geometry, jointMaterial);
                bones[name] = joint;
                scene.add(joint);
                return joint;
            }

            // Create bone as cylinder between two points
            function createBone(start, end) {
                const geometry = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
                const bone = new THREE.Mesh(geometry, boneMaterial);
                scene.add(bone);
                return bone;
            }

            // Create all major joints
            const joints = [
                'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
                'left_shoulder', 'right_shoulder',
                'left_elbow', 'right_elbow',
                'left_wrist', 'right_wrist',
                'left_hip', 'right_hip',
                'left_knee', 'right_knee',
                'left_ankle', 'right_ankle'
            ];

            joints.forEach(name => createJoint(name));

            // Create bones (connections)
            const connections = [
                ['left_shoulder', 'right_shoulder'],
                ['left_shoulder', 'left_elbow'],
                ['left_elbow', 'left_wrist'],
                ['right_shoulder', 'right_elbow'],
                ['right_elbow', 'right_wrist'],
                ['left_shoulder', 'left_hip'],
                ['right_shoulder', 'right_hip'],
                ['left_hip', 'right_hip'],
                ['left_hip', 'left_knee'],
                ['left_knee', 'left_ankle'],
                ['right_hip', 'right_knee'],
                ['right_knee', 'right_ankle']
            ];

            bones.connections = connections.map(([start, end]) => ({
                bone: createBone(start, end),
                start: start,
                end: end
            }));
        }

        function updateBone(bone, startPos, endPos) {
            const direction = new THREE.Vector3().subVectors(endPos, startPos);
            const length = direction.length();
            
            bone.scale.y = length;
            bone.position.copy(startPos).add(direction.multiplyScalar(0.5));
            
            const axis = new THREE.Vector3(0, 1, 0);
            bone.quaternion.setFromUnitVectors(axis, direction.normalize());
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // Check for obstacle collisions and update speed
            let isColliding = false;
            obstacles.forEach(obstacle => {
                if (checkObstacleCollision(obstacle)) {
                    isColliding = true;
                }
            });
            
            // Play hit sound when collision starts (not every frame)
            if (isColliding && !wasColliding) {
                playHitSound();
            }
            wasColliding = isColliding;
            
            // Stop treadmill if colliding, otherwise use normal speed
            currentSpeed = isColliding ? 0 : gridSpeed;
            
            // Move grids continuously for treadmill effect
            grids.forEach(grid => {
                grid.position.z += currentSpeed;
                
                // Wrap grid when it goes too far
                if (grid.position.z > 20) {
                    grid.position.z -= 60;
                } else if (grid.position.z < -40) {
                    grid.position.z += 60;
                }
            });
            
            // Move icosahedrons with the treadmill
            icosahedrons.forEach(ico => {
                ico.position.z += currentSpeed;
                // Add rotation for visual effect
                ico.rotation.x += 0.01;
                ico.rotation.y += 0.015;
            });
            
            // Move obstacles with the treadmill
            obstacles.forEach(obstacle => {
                obstacle.position.z += currentSpeed;
                
                // Make obstacles pulse when player is colliding
                if (checkObstacleCollision(obstacle)) {
                    obstacle.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
                } else {
                    obstacle.material.emissiveIntensity = 0.3;
                }
            });
            
            // Remove and respawn obstacles that passed the camera
            for (let i = obstacles.length - 1; i >= 0; i--) {
                if (obstacles[i].position.z > 5) {
                    scene.remove(obstacles[i]);
                    obstacles.splice(i, 1);
                    spawnObstacle();
                }
            }
            
            // Check for collisions with collectibles
            checkCollisions();

            // Update explosions
            for (let i = explosions.length - 1; i >= 0; i--) {
                const explosion = explosions[i];
                let allParticlesDead = true;

                explosion.children.forEach(particle => {
                    if (particle.userData.life > 0) {
                        allParticlesDead = false;
                        particle.position.add(particle.userData.velocity);
                        particle.userData.velocity.multiplyScalar(0.95); // friction
                        particle.userData.life -= 0.02;
                        particle.material.opacity = particle.userData.life;
                        particle.material.transparent = true;
                    }
                });

                if (allParticlesDead) {
                    scene.remove(explosion);
                    explosions.splice(i, 1);
                }
            }
            
            renderer.render(scene, camera);
        }
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        // MediaPipe landmark indices
        const POSE_LANDMARKS = {
            NOSE: 0,
            LEFT_EYE: 2,
            RIGHT_EYE: 5,
            LEFT_EAR: 7,
            RIGHT_EAR: 8,
            LEFT_SHOULDER: 11,
            RIGHT_SHOULDER: 12,
            LEFT_ELBOW: 13,
            RIGHT_ELBOW: 14,
            LEFT_WRIST: 15,
            RIGHT_WRIST: 16,
            LEFT_HIP: 23,
            RIGHT_HIP: 24,
            LEFT_KNEE: 25,
            RIGHT_KNEE: 26,
            LEFT_ANKLE: 27,
            RIGHT_ANKLE: 28
        };

        function onResults(results) {
            // Draw on 2D canvas
            canvas2d.width = videoElement.videoWidth;
            canvas2d.height = videoElement.videoHeight;
            
            ctx2d.save();
            ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
            
            // Mirror the canvas
            ctx2d.translate(canvas2d.width, 0);
            ctx2d.scale(-1, 1);
            
            ctx2d.drawImage(results.image, 0, 0, canvas2d.width, canvas2d.height);

            if (results.poseLandmarks) {
                drawConnectors(ctx2d, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
                drawLandmarks(ctx2d, results.poseLandmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });

                // Update 3D skeleton
                updateSkeleton(results.poseLandmarks);
                statusElement.textContent = 'Pose Detected ✓';
                statusElement.style.color = '#0f0';
            } else {
                statusElement.textContent = 'No pose detected';
                statusElement.style.color = '#f90';
            }
            
            ctx2d.restore();
        }

        function updateSkeleton(landmarks) {
            const mapping = {
                'nose': POSE_LANDMARKS.NOSE,
                'left_eye': POSE_LANDMARKS.LEFT_EYE,
                'right_eye': POSE_LANDMARKS.RIGHT_EYE,
                'left_ear': POSE_LANDMARKS.LEFT_EAR,
                'right_ear': POSE_LANDMARKS.RIGHT_EAR,
                'left_shoulder': POSE_LANDMARKS.LEFT_SHOULDER,
                'right_shoulder': POSE_LANDMARKS.RIGHT_SHOULDER,
                'left_elbow': POSE_LANDMARKS.LEFT_ELBOW,
                'right_elbow': POSE_LANDMARKS.RIGHT_ELBOW,
                'left_wrist': POSE_LANDMARKS.LEFT_WRIST,
                'right_wrist': POSE_LANDMARKS.RIGHT_WRIST,
                'left_hip': POSE_LANDMARKS.LEFT_HIP,
                'right_hip': POSE_LANDMARKS.RIGHT_HIP,
                'left_knee': POSE_LANDMARKS.LEFT_KNEE,
                'right_knee': POSE_LANDMARKS.RIGHT_KNEE,
                'left_ankle': POSE_LANDMARKS.LEFT_ANKLE,
                'right_ankle': POSE_LANDMARKS.RIGHT_ANKLE
            };

            // Update joint positions (flip X for mirror effect, adjust scale)
            for (const [name, index] of Object.entries(mapping)) {
                if (bones[name] && landmarks[index]) {
                    const lm = landmarks[index];
                    // Mirror x-axis and scale to match 3D scene
                    bones[name].position.set(
                        -(lm.x - 0.5) * 2,  // Mirror and center
                        -(lm.y - 0.5) * 2 + 1,  // Flip Y and adjust height
                        -lm.z * 2  // Depth
                    );
                }
            }

            // Update bone connections
            bones.connections.forEach(({ bone, start, end }) => {
                if (bones[start] && bones[end]) {
                    updateBone(bone, bones[start].position, bones[end].position);
                }
            });
        }

        // Initialize camera with error handling
        async function initCamera() {
            try {
                statusElement.textContent = 'Requesting camera access...';
                statusElement.style.color = '#ff0';
                
                const cameraInstance = new Camera(videoElement, {
                    onFrame: async () => {
                        await pose.send({ image: videoElement });
                    },
                    width: 1024,
                    height: 768
                });

                await cameraInstance.start();
                statusElement.textContent = 'Camera ready!';
                statusElement.style.color = '#0f0';
            } catch (error) {
                console.error('Camera error:', error);
                statusElement.innerHTML = `
                    <strong>Camera Error:</strong><br>
                    ${error.message}<br><br>
                    <strong>Solutions:</strong><br>
                    1. Click the camera icon in your browser's address bar and allow camera access<br>
                    2. Try opening this in a new browser tab<br>
                    3. Check browser settings for camera permissions<br>
                    4. Use Chrome or Firefox for best compatibility
                `;
                statusElement.style.color = '#f00';
                statusElement.style.maxWidth = '350px';
            }
        }

        // Toggle obstacles
        const toggleObstaclesBtn = document.getElementById('toggleObstacles');
        toggleObstaclesBtn.addEventListener('click', () => {
            obstaclesEnabled = !obstaclesEnabled;
            
            if (obstaclesEnabled) {
                toggleObstaclesBtn.textContent = 'Obstacles: ON';
                toggleObstaclesBtn.classList.remove('disabled');
                createObstacles(); // Respawn obstacles
            } else {
                toggleObstaclesBtn.textContent = 'Obstacles: OFF';
                toggleObstaclesBtn.classList.add('disabled');
                // Remove all existing obstacles
                for (let i = obstacles.length - 1; i >= 0; i--) {
                    scene.remove(obstacles[i]);
                }
                obstacles = [];
            }
        });

        initThreeJS();
        initCamera();
        initMultiplayer();
