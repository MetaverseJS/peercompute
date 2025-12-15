import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class PlanetForge {
    constructor(size = 512) {
        this.size = size;
        this.data = new Float32Array(size * size); // The heightmap buffer
        this.waterMask = new Float32Array(size * size); // Rivers/lakes mask
        this.rng = Math.random; // Can be swapped for seeded RNG
    }

    // ==========================================================
    // STEP 1: TECTONIC SIMULATION (Voronoi & Faults)
    // ==========================================================
    generateTectonics({ numPlates = 15, jitter = 0.5, oceanFloor = 0.2, plateDelta = 1.0, faultType = 'ridge' }) {
        console.time("Tectonics Generation");
        
        // 1. Create Plate Centers
        const plates = [];
        for (let i = 0; i < numPlates; i++) {
            plates.push({
                x: Math.floor(this.rng() * this.size),
                y: Math.floor(this.rng() * this.size),
                z: this.rng() * 0.5 + 0.5, // Plate "uplift" potential
                type: this.rng() > 0.6 ? 1 : -1 // 1 = Continental, -1 = Oceanic
            });
        }

        // 2. Voronoi Iteration (Pixel by Pixel)
        // We calculate distance to nearest plate center to determine height
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let minDist = Infinity;
                let secondMinDist = Infinity;
                let nearestPlate = null;

                // Check all plates (Brute force is heavy, but accurate for this scale)
                // Optimization: In a real app, use a spatial hash grid here.
                for (const plate of plates) {
                    // Handle Horizontal Wrapping (Cylindrical World)
                    const dx = Math.min(
                        Math.abs(x - plate.x),
                        this.size - Math.abs(x - plate.x)
                    );
                    const dy = y - plate.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < minDist) {
                        secondMinDist = minDist;
                        minDist = dist;
                        nearestPlate = plate;
                    } else if (dist < secondMinDist) {
                        secondMinDist = dist;
                    }
                }

                // 3. Generate Height based on Plate interaction
                // "Edge" value helps us find borders between plates
                const edge = minDist / (secondMinDist + 0.001); 
                
                let height = 0;

                // If it's a continental plate, it's high. Oceanic is low.
                if (nearestPlate.type > 0) {
                    // Continental: High plateau with noise
                    height = (nearestPlate.z * plateDelta) - (edge * jitter);
                } else {
                    // Oceanic: Deep basin
                    height = oceanFloor - 0.08 + (edge * 0.05);
                }

                // Create "Fault Lines" (Mountains) at boundaries
                // If edge is close to 1.0, we are at a boundary.
                const mountainRidge = Math.pow(edge, 5) * nearestPlate.z;
                let faultMode = faultType;
                if (faultType === 'mixed') {
                    const noise = Math.abs(Math.sin((nearestPlate.x + nearestPlate.y + nearestPlate.z) * 12.9898));
                    faultMode = noise < 0.33 ? 'ridge' : noise < 0.66 ? 'trench' : 'shear';
                }
                if (faultMode === 'ridge') {
                    height += mountainRidge;
                } else if (faultMode === 'trench') {
                    height -= mountainRidge * 0.7;
                } else if (faultMode === 'shear') {
                    height += mountainRidge * 0.2 * Math.sign(nearestPlate.type);
                } else {
                    height += mountainRidge;
                }

                // Clamp and Save
                this.data[y * this.size + x] = Math.max(0, Math.min(1, height));
            }
        }
        console.timeEnd("Tectonics Generation");
    }

    // ==========================================================
    // STEP 2: HYDRAULIC EROSION (Particle Simulation)
    // ==========================================================
    // This simulates rain dissolving rock and depositing sediment.
    applyErosion({ iterations = 50000, inertia = 0.05, gravity = 4.0, evaporation = 0.01, erosionRate = 0.3, depositionRate = 0.1 }) {
        console.time("Hydraulic Erosion");
        const mapSize = this.size;
        
        for (let i = 0; i < iterations; i++) {
            // Spawn a raindrop at random position
            let posX = this.rng() * (mapSize - 1);
            let posY = this.rng() * (mapSize - 1);
            let dirX = 0;
            let dirY = 0;
            let speed = 1.0;
            let water = 1.0;
            let sediment = 0.0;

            // Run the droplet until it dies or flows off map
            for (let life = 0; life < 30; life++) {
                // Get integer coordinates
                let nodeX = Math.floor(posX);
                let nodeY = Math.floor(posY);
                
                // Wrap X (Cylinder), Clamp Y (Poles)
                let wrapX = (nodeX + mapSize) % mapSize;
                let nextX = (nodeX + 1 + mapSize) % mapSize;
                let clampY = Math.max(0, Math.min(mapSize - 1, nodeY));
                let nextY = Math.max(0, Math.min(mapSize - 1, nodeY + 1));

                // Calculate offsets for bilinear interpolation
                let cellOffsetX = posX - nodeX;
                let cellOffsetY = posY - nodeY;

                // Get height of current cell and neighbors
                // (Simplified gradient calculation for performance)
                const h = this.data[clampY * mapSize + wrapX];
                const hL = this.data[clampY * mapSize + ((nodeX - 1 + mapSize) % mapSize)];
                const hR = this.data[clampY * mapSize + nextX];
                const hU = this.data[Math.max(0, nodeY - 1) * mapSize + wrapX];
                const hD = this.data[Math.min(mapSize - 1, nodeY + 1) * mapSize + wrapX];

                // Calculate Gradient (Slope)
                const gradX = hR - hL;
                const gradY = hD - hU;

                // Update Direction (with inertia)
                dirX = (dirX * inertia) - (gradX * (1 - inertia));
                dirY = (dirY * inertia) - (gradY * (1 - inertia));

                // Normalize direction
                const len = Math.sqrt(dirX * dirX + dirY * dirY);
                if (len !== 0) {
                    dirX /= len;
                    dirY /= len;
                }

                // Update Position
                posX += dirX;
                posY += dirY;

                // Stop if we hit map bounds (Poles) or math exploded
                if (posY < 0 || posY >= mapSize - 1 || !Number.isFinite(posY) || !Number.isFinite(posX)) break;

                // Calculate height difference
                const sampleY = Math.max(0, Math.min(mapSize - 1, Math.floor(posY)));
                const sampleX = (Math.floor(posX) + mapSize) % mapSize;
                let newH = this.data[sampleY * mapSize + sampleX];
                let diff = h - newH;

                // EROSION & DEPOSITION LOGIC
                // Maximum sediment capacity based on speed and slope (diff)
                const sedimentCapacity = Math.max(-diff, 0.01) * speed * water * 4.0;

                if (sediment > sedimentCapacity || diff < 0) {
                    // Deposit sediment (Fill the valley)
                    const amountToDeposit = (sediment - sedimentCapacity) * depositionRate;
                    sediment -= amountToDeposit;
                    this.data[clampY * mapSize + wrapX] += amountToDeposit; 
                } else {
                    // Erode terrain (Cut the mountain)
                    const amountToErode = Math.min((sedimentCapacity - sediment) * erosionRate, -diff);
                    sediment += amountToErode;
                    this.data[clampY * mapSize + wrapX] -= amountToErode;
                }

                // Physics update
                speed = Math.sqrt(speed * speed + Math.max(0, diff) * gravity);
                water *= (1 - evaporation);

                if (water < 0.01) break;
            }
        }
        console.timeEnd("Hydraulic Erosion");
        this._sanitize();
    }

    // ==========================================================
    // STEP 3: OUTPUT TO THREE.JS
    // ==========================================================
    createMesh(radius = 10, heightScale = 2, seaLevel = 0.5, subdivisions = 6, iceCap = 0.12) {
        this._sanitize();
        // Note: applyHydrology should be called before createMesh (e.g. in index.js) to avoid double-carving
        
        // Icosahedron avoids pole singularities present in equirectangular UVs
        let geometry = new THREE.IcosahedronGeometry(radius, Math.max(0, Math.floor(subdivisions)));
        
        // Remove UVs and merge vertices to ensure smooth normal calculation across seams
        geometry.deleteAttribute('uv');
        geometry = mergeVertices(geometry);

        const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
        const sampleBilinear = (u, v, buf) => {
            const fx = clamp01(u) * (this.size - 1);
            const fy = clamp01(1 - v) * (this.size - 1);
            const x0 = Math.floor(fx);
            const y0 = Math.floor(fy);
            const x1 = Math.min(this.size - 1, x0 + 1);
            const y1 = Math.min(this.size - 1, y0 + 1);
            const tx = fx - x0;
            const ty = fy - y0;
            const i00 = buf[y0 * this.size + x0];
            const i10 = buf[y0 * this.size + x1];
            const i01 = buf[y1 * this.size + x0];
            const i11 = buf[y1 * this.size + x1];
            const a = i00 * (1 - tx) + i10 * tx;
            const b = i01 * (1 - tx) + i11 * tx;
            const h = a * (1 - ty) + b * ty;
            return Number.isFinite(h) ? h : 0;
        };
        const sampleHeight = (u, v) => sampleBilinear(u, v, this.data);
        const sampleWater = (u, v) => sampleBilinear(u, v, this.waterMask);

        // Triplanar sample to reduce seams across icosahedron edges
        const sampleTriplanar = (dir) => {
            const ad = new THREE.Vector3(Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z));
            const sum = ad.x + ad.y + ad.z + 1e-6;
            const wx = ad.x / sum;
            const wy = ad.y / sum;
            const wz = ad.z / sum;

            const uvX = { u: dir.z * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };
            const uvY = { u: dir.x * 0.5 + 0.5, v: dir.z * 0.5 + 0.5 };
            const uvZ = { u: dir.x * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };

            const hX = sampleHeight(uvX.u, uvX.v);
            const hY = sampleHeight(uvY.u, uvY.v);
            const hZ = sampleHeight(uvZ.u, uvZ.v);

            return (hX * wx) + (hY * wy) + (hZ * wz);
        };

        const posAttribute = geometry.attributes.position;
        const vertex = new THREE.Vector3();
        const waterAttr = new Float32Array(posAttribute.count);

        for (let i = 0; i < posAttribute.count; i++) {
            vertex.fromBufferAttribute(posAttribute, i);
            const len = vertex.length();
            if (len === 0 || !Number.isFinite(len)) {
                vertex.set(radius, 0, 0);
                posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
                continue;
            }

            const dir = vertex.clone().normalize();
            const heightValue = sampleTriplanar(dir);
            const waterValue = sampleWater(dir.x * 0.5 + 0.5, dir.y * 0.5 + 0.5);
            const displacement = (heightValue - seaLevel) * heightScale;
            dir.multiplyScalar(radius + displacement);
            posAttribute.setXYZ(i, dir.x, dir.y, dir.z);
            waterAttr[i] = waterValue;
        }

        geometry.computeVertexNormals();
        this._ensureFinitePositions(geometry, radius);
        geometry.normalizeNormals();
        geometry.setAttribute('waterMask', new THREE.BufferAttribute(waterAttr, 1));

        // Simple vertex color material based on height
        const material = new THREE.MeshPhongMaterial({
            shininess: 50,
            specular: new THREE.Color(0x666666),
            color: 0x888888,
            flatShading: false,
            onBeforeCompile: (shader) => {
                // Quick hack to colorize by height in the shader
                shader.vertexShader = `
                    varying float vHeight;
                    varying vec3 vDir;
                    attribute float waterMask;
                    varying float vWater;
                    uniform float uIceCap;
                    ${shader.vertexShader}
                `.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    vHeight = length(transformed) - ${radius.toFixed(1)};
                    vDir = normalize(transformed);
                    vWater = waterMask;
                    `
                );
                shader.fragmentShader = `
                    varying float vHeight;
                    varying vec3 vDir;
                    varying float vWater;
                    uniform float uIceCap;
                    ${shader.fragmentShader}
                `.replace(
                    '#include <color_fragment>',
                    `
                    // Recover normalized height value used for displacement
                    float heightVal = (vHeight / ${heightScale.toFixed(3)}) + ${seaLevel.toFixed(3)};
                    // Thresholds relative to sea level
                    float sea = ${seaLevel.toFixed(3)};
                    float shore = sea + 0.015;
                    float lowland = sea + 0.08;
                    float midland = sea + 0.25;
                    float highland = sea + 0.45;
                    vec3 deep = vec3(0.01, 0.04, 0.12);
                    vec3 shallow = vec3(0.04, 0.20, 0.40);
                    vec3 grass = vec3(0.12, 0.44, 0.18);
                    vec3 rock = vec3(0.38, 0.32, 0.26);
                    vec3 snow = vec3(1.0, 1.0, 1.0);
                    vec3 col;
                    float waterFactor = vWater;
                    if(heightVal < sea) {
                        float t = smoothstep(sea - 0.05, sea, heightVal);
                        col = mix(deep, shallow, t);
                        waterFactor = 1.0;
                    } else if(heightVal < lowland) {
                        float t = smoothstep(sea, lowland, heightVal);
                        col = mix(shallow, grass, t);
                    } else if(heightVal < midland) {
                        float t = smoothstep(lowland, midland, heightVal);
                        col = mix(grass, rock, t);
                    } else if(heightVal < highland) {
                        float t = smoothstep(midland, highland, heightVal);
                        col = mix(rock, snow, t * 0.7);
                    } else {
                        col = snow;
                    }
                    float snowBlend = smoothstep(highland - 0.02, highland + 0.1, heightVal);
                    float pole = smoothstep(1.0 - uIceCap, 1.0, abs(vDir.y));
                    col = mix(col, snow, max(snowBlend, pole * 0.8));
                    if(waterFactor > 0.0) {
                        float wf = clamp(waterFactor, 0.0, 1.0);
                        vec3 wet = mix(shallow, deep, 0.6);
                        col = mix(col, wet, wf);
                    }
                    diffuseColor = vec4(col, 1.0);
                    `
                );
                shader.uniforms.uIceCap = { value: iceCap };
            }
        });

        return new THREE.Mesh(geometry, material);
    }

    createFreshwaterMesh(radius = 10, heightScale = 2, seaLevel = 0.5, subdivisions = 6) {
        // Create geometry similar to terrain
        let geometry = new THREE.IcosahedronGeometry(radius, Math.max(0, Math.floor(subdivisions)));
        geometry.deleteAttribute('uv');
        geometry = mergeVertices(geometry);

        const posAttribute = geometry.attributes.position;
        const vertex = new THREE.Vector3();
        const waterAttr = new Float32Array(posAttribute.count);
        
        // Helper to sample height and mask
        const sampleHeight = (u, v) => this._sampleBilinear(u, v, this.data);
        const sampleWater = (u, v) => this._sampleBilinear(u, v, this.waterMask);

        // Triplanar sample
        const sampleTriplanar = (dir) => {
            const ad = new THREE.Vector3(Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z));
            const sum = ad.x + ad.y + ad.z + 1e-6;
            const wx = ad.x / sum;
            const wy = ad.y / sum;
            const wz = ad.z / sum;

            const uvX = { u: dir.z * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };
            const uvY = { u: dir.x * 0.5 + 0.5, v: dir.z * 0.5 + 0.5 };
            const uvZ = { u: dir.x * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };

            const hX = sampleHeight(uvX.u, uvX.v);
            const hY = sampleHeight(uvY.u, uvY.v);
            const hZ = sampleHeight(uvZ.u, uvZ.v);

            const wX = sampleWater(uvX.u, uvX.v);
            const wY = sampleWater(uvY.u, uvY.v);
            const wZ = sampleWater(uvZ.u, uvZ.v);

            return {
                height: (hX * wx) + (hY * wy) + (hZ * wz),
                mask: (wX * wx) + (wY * wy) + (wZ * wz)
            };
        };

        const riverDepth = this.riverDepth || 0.015;

        for (let i = 0; i < posAttribute.count; i++) {
            vertex.fromBufferAttribute(posAttribute, i);
            const dir = vertex.clone().normalize();
            
            const sampled = sampleTriplanar(dir);
            const heightValue = sampled.height;
            const waterValue = sampled.mask;
            
            // Surface is at bed height + depth (restoring carved volume)
            // But we only want to lift it if there is water
            // To ensure smooth mesh, we always lift by waterValue * riverDepth
            // This way it exactly matches the carved surface + water depth
            // User requested halfway down the bank (0.5 * depth)
            const surfaceHeight = heightValue + (waterValue * riverDepth * 0.5);
            
            const displacement = (surfaceHeight - seaLevel) * heightScale;
            // Add a tiny epsilon to prevent z-fighting with the bed at edges
            dir.multiplyScalar(radius + displacement + 0.001);
            
            posAttribute.setXYZ(i, dir.x, dir.y, dir.z);
            waterAttr[i] = waterValue;
        }

        geometry.computeVertexNormals();
        this._ensureFinitePositions(geometry, radius);
        geometry.normalizeNormals();
        geometry.setAttribute('waterMask', new THREE.BufferAttribute(waterAttr, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                deepColor: { value: new THREE.Color(0x08203f) },
                shallowColor: { value: new THREE.Color(0x154f8a) },
                opacity: { value: 0.8 },
                fresnelPower: { value: 3.4 }
            },
            transparent: true,
            depthWrite: false, // Don't write depth for transparent water surface
            side: THREE.FrontSide,
            blending: THREE.NormalBlending,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying float vWater;
                attribute float waterMask;
                
                void main() {
                    vWater = waterMask;
                    vec3 pos = position;
                    // Only apply waves if we have water
                    if (vWater > 0.01) {
                        float wave = sin((pos.x + pos.z) * 0.35 + time * 0.6) * 0.02;
                        pos += normalize(normal) * wave * vWater; // Scale wave by depth mask
                    }
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    vec4 mvPosition = viewMatrix * worldPos;
                    gl_Position = projectionMatrix * mvPosition;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 deepColor;
                uniform vec3 shallowColor;
                uniform float opacity;
                uniform float fresnelPower;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying float vWater;
                
                void main() {
                    #include <logdepthbuf_fragment>
                    
                    // Discard if not water
                    if (vWater < 0.05) discard;
                    
                    vec3 viewDir = normalize(cameraPosition - vWorldPos);
                    float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), fresnelPower);
                    
                    // Use brighter debug colors or original
                    // vec3 base = vec3(1.0, 0.0, 0.0); // Debug RED
                    vec3 base = mix(shallowColor, deepColor, fresnel);
                    
                    float sparkle = pow(fresnel, 4.0) * 0.5;
                    
                    // Fade out at edges of river
                    float alpha = opacity * smoothstep(0.05, 0.2, vWater);
                    
                    gl_FragColor = vec4(base + sparkle, alpha);
                }
            `
        });

        return new THREE.Mesh(geometry, material);
    }

    // Ensures the heightmap stays finite and bounded
    _sanitize(min = -5, max = 5) {
        const data = this.data;
        for (let i = 0; i < data.length; i++) {
            let v = data[i];
            if (!Number.isFinite(v)) {
                v = 0;
            } else if (v < min) {
                v = min;
            } else if (v > max) {
                v = max;
            }
            data[i] = v;
        }
    }

    _clamp01(v) {
        return Math.min(Math.max(v, 0), 1);
    }

    _sampleBilinear(u, v, buf) {
        const fx = this._clamp01(u) * (this.size - 1);
        const fy = this._clamp01(1 - v) * (this.size - 1);
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const x1 = Math.min(this.size - 1, x0 + 1);
        const y1 = Math.min(this.size - 1, y0 + 1);
        const tx = fx - x0;
        const ty = fy - y0;
        const i00 = buf[y0 * this.size + x0];
        const i10 = buf[y0 * this.size + x1];
        const i01 = buf[y1 * this.size + x0];
        const i11 = buf[y1 * this.size + x1];
        const a = i00 * (1 - tx) + i10 * tx;
        const b = i01 * (1 - tx) + i11 * tx;
        return a * (1 - ty) + b * ty;
    }

    getHeightAt(dir) {
        const sampleHeight = (u, v) => this._sampleBilinear(u, v, this.data);
        
        // Triplanar sample
        const ad = new THREE.Vector3(Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z));
        const sum = ad.x + ad.y + ad.z + 1e-6;
        const wx = ad.x / sum;
        const wy = ad.y / sum;
        const wz = ad.z / sum;

        const uvX = { u: dir.z * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };
        const uvY = { u: dir.x * 0.5 + 0.5, v: dir.z * 0.5 + 0.5 };
        const uvZ = { u: dir.x * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };

        const hX = sampleHeight(uvX.u, uvX.v);
        const hY = sampleHeight(uvY.u, uvY.v);
        const hZ = sampleHeight(uvZ.u, uvZ.v);

        let h = (hX * wx) + (hY * wy) + (hZ * wz);
        return Number.isFinite(h) ? h : 0;
    }

    getWaterDataAt(dir) {
        const sampleHeight = (u, v) => this._sampleBilinear(u, v, this.data);
        const sampleWater = (u, v) => this._sampleBilinear(u, v, this.waterMask);
        
        // Triplanar sample
        const ad = new THREE.Vector3(Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z));
        const sum = ad.x + ad.y + ad.z + 1e-6;
        const wx = ad.x / sum;
        const wy = ad.y / sum;
        const wz = ad.z / sum;

        const uvX = { u: dir.z * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };
        const uvY = { u: dir.x * 0.5 + 0.5, v: dir.z * 0.5 + 0.5 };
        const uvZ = { u: dir.x * 0.5 + 0.5, v: dir.y * 0.5 + 0.5 };

        const hX = sampleHeight(uvX.u, uvX.v);
        const hY = sampleHeight(uvY.u, uvY.v);
        const hZ = sampleHeight(uvZ.u, uvZ.v);
        const h = (hX * wx) + (hY * wy) + (hZ * wz);

        const wX = sampleWater(uvX.u, uvX.v);
        const wY = sampleWater(uvY.u, uvY.v);
        const wZ = sampleWater(uvZ.u, uvZ.v);
        const w = (wX * wx) + (wY * wy) + (wZ * wz);

        // Water surface height (halfway down bank)
        // If w > 0, water surface is h + w * riverDepth * 0.5
        const riverDepth = this.riverDepth || 0.015;
        const waterHeight = h + (w * riverDepth * 0.5);

        return {
            height: Number.isFinite(h) ? h : 0,
            waterHeight: Number.isFinite(waterHeight) ? waterHeight : 0,
            waterMask: Number.isFinite(w) ? w : 0,
            hasWater: w > 0.05
        };
    }

    applyHydrology({ seaLevel = 0.5, riverDepth = 0.015, lakeThreshold = 0.003 } = {}) {
        this.riverDepth = riverDepth;
        const size = this.size;
        const total = size * size;
        this.waterMask.fill(0);

        // Priority flood to fill depressions for flow routing
        const filled = new Float32Array(this.data);
        const visited = new Uint8Array(total);
        const heapIdx = new Int32Array(total + size * 4);
        const heapVal = new Float32Array(total + size * 4);
        let heapSize = 0;
        const push = (idx, val) => {
            let i = heapSize++;
            heapIdx[i] = idx;
            heapVal[i] = val;
            while (i > 0) {
                const p = (i - 1) >> 1;
                if (heapVal[p] <= val) break;
                heapIdx[i] = heapIdx[p];
                heapVal[i] = heapVal[p];
                heapIdx[p] = idx;
                heapVal[p] = val;
                i = p;
            }
        };
        const pop = () => {
            const idx = heapIdx[0];
            const val = heapVal[0];
            heapSize--;
            if (heapSize > 0) {
                heapIdx[0] = heapIdx[heapSize];
                heapVal[0] = heapVal[heapSize];
                let i = 0;
                while (true) {
                    const l = (i << 1) + 1;
                    const r = l + 1;
                    if (l >= heapSize) break;
                    let s = l;
                    if (r < heapSize && heapVal[r] < heapVal[l]) s = r;
                    if (heapVal[i] <= heapVal[s]) break;
                    [heapIdx[i], heapIdx[s]] = [heapIdx[s], heapIdx[i]];
                    [heapVal[i], heapVal[s]] = [heapVal[s], heapVal[i]];
                    i = s;
                }
            }
            return [idx, val];
        };

        const pushBoundary = (x, y) => {
            const idx = y * size + x;
            if (visited[idx]) return;
            visited[idx] = 1;
            push(idx, filled[idx]);
        };

        for (let x = 0; x < size; x++) {
            pushBoundary(x, 0);
            pushBoundary(x, size - 1);
        }
        for (let y = 1; y < size - 1; y++) {
            pushBoundary(0, y);
            pushBoundary(size - 1, y);
        }

        const neighbors = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0], [1, 0],
            [-1, 1], [0, 1], [1, 1]
        ];

        while (heapSize > 0) {
            const [idx, h] = pop();
            const x = idx % size;
            const y = Math.floor(idx / size);
            for (const [dx, dy] of neighbors) {
                const nx = (x + dx + size) % size;
                const ny = y + dy;
                if (ny < 0 || ny >= size) continue;
                const nIdx = ny * size + nx;
                if (visited[nIdx]) continue;
                visited[nIdx] = 1;
                const nh = filled[nIdx];
                if (nh < h) filled[nIdx] = h;
                push(nIdx, filled[nIdx]);
            }
        }

        // Flow routing (single downslope)
        const flow = new Int32Array(total);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const idx = y * size + x;
                const h = filled[idx];
                let bestIdx = -1;
                let bestH = h;
                for (const [dx, dy] of neighbors) {
                    const nx = (x + dx + size) % size;
                    const ny = y + dy;
                    if (ny < 0 || ny >= size) continue;
                    const nIdx = ny * size + nx;
                    const nh = filled[nIdx];
                    if (nh < bestH) {
                        bestH = nh;
                        bestIdx = nIdx;
                    }
                }
                flow[idx] = bestIdx;
            }
        }

        // Accumulation using height-sorted order
        const order = new Array(total);
        for (let i = 0; i < total; i++) order[i] = i;
        order.sort((a, b) => filled[b] - filled[a]); // high to low

        const accum = new Float32Array(total);
        accum.fill(1);
        for (const idx of order) {
            const to = flow[idx];
            if (to >= 0) accum[to] += accum[idx];
        }

        let maxAcc = 0;
        for (let i = 0; i < total; i++) {
            if (accum[i] > maxAcc) maxAcc = accum[i];
        }
        const invMaxAcc = maxAcc > 0 ? 1 / maxAcc : 0;

        for (let i = 0; i < total; i++) {
            const lakeDepth = Math.max(0, filled[i] - this.data[i]);
            let mask = 0;
            if (lakeDepth > lakeThreshold) {
                mask = Math.min(1, lakeDepth * 12);
            }
            const flowNorm = Math.pow(accum[i] * invMaxAcc, 0.5);
            if (flowNorm > 0.1 && filled[i] > seaLevel) {
                mask = Math.max(mask, flowNorm);
            }
            this.waterMask[i] = mask;
            if (mask > 0) {
                this.data[i] = Math.max(0, this.data[i] - mask * riverDepth);
            }
        }
    }

    // Clamp any stray NaN/Inf positions that could break bounding volumes
    _ensureFinitePositions(geometry, fallbackRadius = 10) {
        const pos = geometry.attributes.position;
        const arr = pos.array;
        let dirty = false;
        for (let i = 0; i < arr.length; i++) {
            if (!Number.isFinite(arr[i])) {
                dirty = true;
                arr[i] = 0;
            }
        }
        if (dirty) {
            // Force a sensible fallback point so the mesh isn't collapsed
            arr[0] = fallbackRadius;
            arr[1] = 0;
            arr[2] = 0;
            pos.needsUpdate = true;
        }
    }
}
