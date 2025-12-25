import * as THREE from 'three';
import { PlanetForge } from './worldgen.js';
import { AtmosphereSystem } from './AtmosphereSystem.js';
import { CloudSystem } from './CloudSystem.js';
import { OceanComputeSystem } from './OceanComputeSystem.js';
import { getSharedDevice } from './peercomputeDevice.js';
import { normalizeHeightmap, smoothHeightmap } from './utils.js';
import { DEFAULT_DIAMETER_KM } from './constants.js';

export class PlanetManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.forge = null;
        this.planet = null;
        this.water = null;
        this.freshwater = null;
        this.cloudLayerSettings = [];
        this.lastSettings = null;
        
        this.atmosphereSystem = new AtmosphereSystem(sceneManager.planetGroup);
        this.cloudSystem = new CloudSystem(sceneManager.planetGroup);
        this.oceanComputeSystem = null;
        this.useComputeOcean = true; // Enable WebGPU compute ocean by default

        this.waterUniforms = {
            time: { value: 0 },
            deepColor: { value: new THREE.Color(0x08203f) },
            shallowColor: { value: new THREE.Color(0x154f8a) },
            opacity: { value: 0.9 },
            fresnelPower: { value: 3.4 },
            iceCap: { value: 0.0 },
            iceColor: { value: new THREE.Color(0xd9f1ff) },
            windStrength: { value: 0.5 }
        };
    }

    async initOceanCompute() {
        if (this.oceanComputeSystem) return;
        try {
            const device = await getSharedDevice();
            this.oceanComputeSystem = await OceanComputeSystem.create({
                gridWidth: 256,
                gridHeight: 128,
                device: device || undefined
            });
            console.log('[PlanetManager] Ocean compute system initialized');
        } catch (err) {
            console.warn('[PlanetManager] Failed to init ocean compute:', err);
            this.oceanComputeSystem = null;
        }
    }

    async generate(settings, onStatusUpdate) {
        const updateStatus = (msg) => { if (onStatusUpdate) onStatusUpdate(msg); };
        
        try {
            updateStatus(`Tectonics: ${settings.numPlates} plates`);
            await new Promise(r => requestAnimationFrame(r));

            this.forge = new PlanetForge(settings.resolution);
            this.forge.generateTectonics({
                numPlates: settings.numPlates,
                jitter: settings.jitter,
                oceanFloor: 0.2,
                plateDelta: settings.plateDelta,
                faultType: settings.faultType,
                plateSizeVariance: settings.plateSizeVariance,
                desymmetrizeTiling: settings.desymmetrizeTiling
            });

            updateStatus(`Erosion: ${settings.iterations.toLocaleString()} droplets`);
            await new Promise(r => requestAnimationFrame(r));

            this.forge.applyErosion({
                iterations: settings.iterations,
                erosionRate: settings.erosionRate,
                evaporation: settings.evaporation
            });

            normalizeHeightmap(this.forge.data);
            smoothHeightmap(this.forge.data, this.forge.size, settings.smoothPasses);
            this.forge.applyHydrology({ seaLevel: settings.seaLevel, riverDepth: 0.015, lakeThreshold: 0.003 });

            updateStatus('Meshing planet…');
            await new Promise(r => requestAnimationFrame(r));

            this.lastSettings = { ...settings };
            
            // Create Planet Mesh
            const mesh = this.forge.createMesh(settings.radius, settings.heightScale, settings.seaLevel, settings.subdivisions, settings.iceCap);
            mesh.userData.forge = this.forge;
            mesh.userData.settings = settings;
            mesh.rotation.x = 0.25;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.replacePlanet(mesh);

            // Create Water Mesh
            this.replaceWater(this.buildWaterMesh(settings.radius, settings.subdivisions, settings.seaLevel, settings.heightScale, settings.iceCap, settings.waterShader || 'balanced'));

            // Create Freshwater Mesh
            this.replaceFreshwater(this.forge.createFreshwaterMesh(settings.radius, settings.heightScale, settings.seaLevel, settings.subdivisions));

            // Atmosphere
            const sunDir = this.sceneManager.getSunDir();
            this.atmosphereSystem.updateVisuals(settings, settings.radius, settings.subdivisions, settings.heightScale, sunDir);

            // Clouds
            this.cloudSystem.rebuild(
                sunDir,
                settings.radius,
                settings.seaLevel,
                settings.heightScale,
                settings.subdivisions,
                this.cloudLayerSettings
            );
            
            this.applyPlanetScale(settings.planetDiameterKm);

            updateStatus(`${settings.resolution}² map · ${settings.iterations.toLocaleString()} steps`);
        } catch (err) {
            console.error(err);
            updateStatus('Generation failed – check console');
        }
    }

    update(delta, rotatePlanet = true) {
        if (this.planet && rotatePlanet) {
            this.planet.rotation.y += 0.0009;
        }
        if (this.water) {
            this.waterUniforms.time.value += 0.016;
            // Update compute ocean material uniforms if using compute shader
            if (this.water.material?.uniforms?.time) {
                this.water.material.uniforms.time.value += delta;
            }
            if (this.water.material?.uniforms?.eye && this.sceneManager?.camera) {
                this.water.material.uniforms.eye.value.copy(this.sceneManager.camera.position);
            }
            if (this.water.material?.uniforms?.sunDirection) {
                const sunDir = this.sceneManager?.getSunDir();
                if (sunDir) this.water.material.uniforms.sunDirection.value.copy(sunDir);
            }
        }
        if (this.freshwater) this.freshwater.material.uniforms.time.value += 0.016;
        
        // Update ocean compute simulation
        if (this.oceanComputeSystem?.enabled) {
            this.oceanComputeSystem.update(delta);
        }
        
        this.atmosphereSystem.update(delta);
        this.cloudSystem.update(delta);
    }

    updateOceanMouse(uvX, uvY, speedX, speedY) {
        if (this.oceanComputeSystem?.enabled) {
            this.oceanComputeSystem.setMouseInteraction(uvX, uvY, speedX, speedY);
        }
    }

    clearOceanMouse() {
        if (this.oceanComputeSystem?.enabled) {
            this.oceanComputeSystem.clearMouseInteraction();
        }
    }

    setAtmosphereWeather(map, rainHaze) {
        this.atmosphereSystem?.setWeather(map, rainHaze);
    }

    // Update ocean shader with local wind texture from weather simulation
    setOceanWindTexture(windAuxTexture) {
        if (!this.water?.material?.uniforms) return;
        const u = this.water.material.uniforms;
        if (u.windAuxMap) {
            u.windAuxMap.value = windAuxTexture;
        }
        if (u.useLocalWind) {
            u.useLocalWind.value = windAuxTexture ? 1.0 : 0.0;
        }
    }

    setOceanWindVector(windWorld) {
        if (!this.oceanComputeSystem?.enabled || !windWorld) return;
        const dir = new THREE.Vector2(windWorld.x, windWorld.z);
        const speed = dir.length();
        if (speed > 1e-6) {
            dir.normalize();
        }
        const strength = Math.min(Math.max(speed / 40, 0), 2.0);
        this.oceanComputeSystem.setConfig({
            windStrength: strength,
            windDirectionX: dir.x,
            windDirectionY: dir.y
        });
    }

    replacePlanet(mesh) {
        if (this.planet) {
            this.planet.geometry.dispose();
            if (Array.isArray(this.planet.material)) {
                this.planet.material.forEach((m) => m.dispose?.());
            } else {
                this.planet.material.dispose?.();
            }
            this.sceneManager.planetGroup.remove(this.planet);
        }
        this.planet = mesh;
        this.planet.castShadow = true;
        this.planet.receiveShadow = true;
        this.sceneManager.planetGroup.add(mesh);
    }

    replaceWater(mesh) {
        if (this.water) {
            this.water.geometry.dispose();
            if (Array.isArray(this.water.material)) {
                this.water.material.forEach((m) => m.dispose?.());
            } else {
                this.water.material.dispose?.();
            }
            this.sceneManager.planetGroup.remove(this.water);
        }
        this.water = mesh;
        this.water.castShadow = true;
        this.water.receiveShadow = true;
        this.sceneManager.planetGroup.add(mesh);
    }

    replaceFreshwater(mesh) {
        if (this.freshwater) {
            this.freshwater.geometry.dispose();
            this.freshwater.material.dispose?.();
            if (this.freshwater.parent) this.freshwater.parent.remove(this.freshwater);
        }
        this.freshwater = mesh;
        this.freshwater.renderOrder = 1;
        this.freshwater.castShadow = true;
        this.freshwater.receiveShadow = true;
        if (this.planet) {
            this.planet.add(mesh);
        } else {
            this.sceneManager.planetGroup.add(mesh);
        }
    }

    buildWaterMesh(radius, subdivisions, seaLevel, heightScale, iceCap, shaderType = 'balanced') {
        const waterRadius = radius + ((seaLevel - 0.5) * heightScale) + 0.01;
        const geometry = new THREE.IcosahedronGeometry(waterRadius, Math.max(0, Math.floor(subdivisions)));
        this.waterUniforms.iceCap.value = iceCap ?? 0;
        
        let material;
        if (shaderType === 'compute' && this.oceanComputeSystem?.enabled) {
            material = this.buildComputeOceanMaterial(waterRadius);
        } else if (shaderType === 'fast') {
            material = this.buildFastOceanMaterial();
        } else {
            material = this.buildBalancedOceanMaterial();
        }
        return new THREE.Mesh(geometry, material);
    }

    buildComputeOceanMaterial(waterRadius, windAuxTexture = null) {
        // Deep blue ocean with procedural waves driven by local wind from weather sim
        // Uses 3D noise to avoid lat/lon UV polar artifacts
        const uniforms = {
            time: { value: 0 },
            deepColor: { value: new THREE.Color(0x0a4870) },      // Deep ocean blue
            midColor: { value: new THREE.Color(0x1a7090) },       // Mid blue
            shallowColor: { value: new THREE.Color(0x2590b0) },   // Light blue-green edge
            sunDirection: { value: new THREE.Vector3(0.3, 0.8, 0.45).normalize() },
            windAuxMap: { value: windAuxTexture },  // Weather aux texture (R=temp, G=snow, B=windU, A=windV)
            useLocalWind: { value: windAuxTexture ? 1.0 : 0.0 },
            globalWindDir: { value: new THREE.Vector3(1.0, 0.0, 0.5).normalize() }, // Fallback global wind
            eye: { value: new THREE.Vector3() },
            waveHeight: { value: 1.0 },  // Wave height multiplier
            waveScale: { value: 0.6 },
            windStrength: { value: 0.8 },
            maxWind: { value: 60.0 },  // Must match weather sim's maxWind
            fetchLength: { value: 1.5 },  // Wind fetch - longer = bigger waves
            waterRadius: { value: waterRadius }
        };
        const material = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            depthWrite: true,
            side: THREE.FrontSide,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                uniform float waveHeight;
                uniform float waveScale;
                uniform float windStrength;
                uniform float fetchLength;
                uniform sampler2D windAuxMap;
                uniform float useLocalWind;
                uniform vec3 globalWindDir;
                uniform float maxWind;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying vec3 vLocalPos;
                varying float vWaveHeight;
                varying float vLocalWindStrength;
                
                // Convert 3D direction to lat/lon UV for sampling weather texture
                vec2 dirToUV(vec3 dir) {
                    float u = atan(dir.z, dir.x) / (2.0 * 3.14159265) + 0.5;
                    float v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265 + 0.5;
                    return vec2(u, v);
                }
                
                // Get local wind from weather aux texture
                vec3 getLocalWind(vec3 dir) {
                    if (useLocalWind < 0.5) {
                        return globalWindDir * maxWind * windStrength;
                    }
                    vec2 uv = dirToUV(dir);
                    vec4 aux = texture2D(windAuxMap, uv);
                    // B = windU (east), A = windV (north), encoded as 0-1 where 0.5 = zero
                    float windU = (aux.b - 0.5) * 2.0 * maxWind;
                    float windV = (aux.a - 0.5) * 2.0 * maxWind;
                    
                    // Convert east/north wind to 3D world direction
                    vec3 up = abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
                    vec3 east = normalize(cross(up, dir));
                    vec3 north = normalize(cross(dir, east));
                    
                    return east * windU + north * windV;
                }

                vec3 rotateAroundAxis(vec3 v, vec3 axis, float angle) {
                    float s = sin(angle);
                    float c = cos(angle);
                    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
                }

                vec3 ekmanCurrent(vec3 windDir, vec3 dir) {
                    float hemisphere = dir.y >= 0.0 ? 1.0 : -1.0;
                    float angle = radians(35.0) * hemisphere;
                    return normalize(rotateAroundAxis(windDir, dir, angle));
                }
                
                // Wind-driven swell wave using spherical coordinates
                float swellWave(vec3 dir, vec3 windDir, float windSpeed, float t, 
                                float frequency, float amplitude) {
                    // Project direction onto wind direction for phase calculation
                    // Use spherical angle approach - works on sphere surface
                    float alongWind = dot(dir, windDir);
                    
                    // Use latitude/longitude perturbation for cross-wind variation
                    vec3 perpDir = dir - windDir * alongWind;
                    float crossWind = length(perpDir);
                    
                    // Primary wave phase - travels in wind direction
                    float phase = alongWind * frequency - t * 0.3;
                    
                    // Add cross-wind modulation for more natural pattern
                    float crossPhase = crossWind * frequency * 0.5;
                    
                    // Swell shape - asymmetric like real ocean swells
                    float wave = sin(phase + crossPhase * 0.2) * 0.55;
                    wave += sin(phase * 2.0 + 0.3) * 0.25;
                    wave += sin(phase * 0.5 - crossPhase * 0.1) * 0.2;
                    
                    // Amplitude scales with wind speed (linear is more visually pleasing at this scale)
                    float amp = amplitude * windSpeed * 0.008 * fetchLength;
                    
                    return wave * amp;
                }
                
                // Sum multiple wind-driven swells at different scales
                float oceanWaves(vec3 dir, vec3 windDir, float windSpeed, float t) {
                    if (windSpeed < 1.0) return 0.0;
                    
                    float totalDisp = 0.0;
                    
                    // Large primary swell - big rolling waves from sustained wind
                    totalDisp += swellWave(dir, windDir, windSpeed, t, 6.0, 1.0);
                    
                    // Secondary swell - medium period waves
                    totalDisp += swellWave(dir, windDir, windSpeed, t * 1.2, 12.0, 0.6);
                    
                    // Tertiary waves - shorter wavelength
                    totalDisp += swellWave(dir, windDir, windSpeed, t * 0.85, 24.0, 0.35);
                    
                    // Cross-swell (perpendicular to main wind) - creates diamond pattern
                    vec3 up = abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
                    vec3 crossDir = normalize(cross(windDir, up));
                    totalDisp += swellWave(dir, crossDir, windSpeed * 0.5, t * 0.7, 10.0, 0.4);
                    
                    // Wind chop - higher frequency local ripples
                    totalDisp += swellWave(dir, windDir, windSpeed, t * 1.4, 48.0, 0.2);
                    
                    return totalDisp;
                }
                
                void main() {
                    vec3 dir = normalize(position);
                    vLocalPos = dir;
                    
                    // Get local wind from weather texture
                    vec3 localWind = getLocalWind(dir);
                    float localWindSpeed = length(localWind);
                    vec3 windDir = localWindSpeed > 0.1 ? normalize(localWind) : globalWindDir;
                    vec3 currentDir = ekmanCurrent(windDir, dir);
                    float currentSpeed = localWindSpeed * 0.025;
                    float swellSpeed = localWindSpeed + currentSpeed * 12.0;
                    vLocalWindStrength = clamp((localWindSpeed + currentSpeed * 40.0) / maxWind, 0.0, 1.0);
                    
                    // Calculate wind-driven wave displacement using direction vector
                    float waveDisp = oceanWaves(dir, windDir, swellSpeed, time) * waveHeight;
                    waveDisp += oceanWaves(dir, currentDir, max(currentSpeed * 40.0, 0.4), time * 0.9) * waveHeight * 0.5;
                    vWaveHeight = waveDisp;
                    
                    // Displace vertex along surface normal
                    vec3 pos = position + dir * waveDisp;
                    
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * dir);
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform float time;
                uniform vec3 deepColor;
                uniform vec3 midColor;
                uniform vec3 shallowColor;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                uniform float maxWind;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying vec3 vLocalPos;
                varying float vWaveHeight;
                varying float vLocalWindStrength;

                void main() {
                    #include <logdepthbuf_fragment>
                    
                    vec3 V = normalize(eye - vWorldPos);
                    vec3 L = normalize(sunDirection);
                    
                    // Use the interpolated normal from vertex shader
                    // The wave shape already provides surface variation
                    vec3 n = normalize(vNormal);
                    
                    // Fresnel effect for water surface
                    float fresnel = pow(1.0 - max(dot(V, n), 0.0), 4.0);
                    
                    // Diffuse lighting
                    float diffuse = max(dot(n, L), 0.0) * 0.5 + 0.5;
                    
                    // Blend between deep and shallow colors based on view angle
                    vec3 baseColor = mix(deepColor, midColor, fresnel * 0.4);
                    baseColor = mix(baseColor, shallowColor, fresnel * fresnel * 0.3);
                    baseColor *= diffuse;
                    
                    // Specular highlight (sun glint)
                    vec3 H = normalize(L + V);
                    float spec = pow(max(dot(n, H), 0.0), 128.0) * 0.8;
                    float specBroad = pow(max(dot(n, H), 0.0), 32.0) * 0.15;
                    
                    // Whitecaps/foam - based on wave height and wind strength only
                    // Foam appears on wave crests when wind is strong
                    float waveSlope = abs(vWaveHeight) * 50.0;
                    float windFactor = vLocalWindStrength;
                    // Foam only appears with significant wind (> 40% of max)
                    float foamThreshold = 0.6;
                    float foam = smoothstep(foamThreshold, 1.0, waveSlope * windFactor);
                    foam = clamp(foam * 0.3, 0.0, 0.4) * smoothstep(0.4, 0.8, windFactor);
                    
                    // Foam color (bright white)
                    vec3 foamColor = vec3(0.95, 0.97, 1.0);
                    
                    // Combine all
                    vec3 finalColor = baseColor;
                    finalColor += vec3(spec + specBroad);
                    finalColor += fresnel * shallowColor * 0.12;
                    finalColor = mix(finalColor, foamColor, foam);
                    
                    gl_FragColor = vec4(finalColor, 0.92);
                }
            `
        });
        material.uniforms = uniforms;
        return material;
    }

    buildBalancedOceanMaterial() {
        // Adapted from three.js webgl_gpgpu_water shaders (simplified for spherical use)
        const uniforms = {
            time: { value: 0 },
            color: { value: new THREE.Color(0x4d9bd6) },
            sunDirection: { value: new THREE.Vector3(0.3, 0.8, 0.45).normalize() },
            eye: { value: new THREE.Vector3() }
        };
        const material = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            depthWrite: true,
            side: THREE.FrontSide,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                void main() {
                    vec3 pos = position;
                    float wave = sin((pos.x + pos.z) * 0.25 + time * 0.7) * 0.02;
                    float wave2 = sin((pos.y * 0.4 - pos.x * 0.3) + time * 0.9) * 0.015;
                    pos += normalize(normal) * (wave + wave2);
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform float time;
                uniform vec3 color;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                varying vec3 vWorldPos;
                varying vec3 vNormal;

                float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
                float noise(vec2 p){
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float a = hash(i);
                    float b = hash(i + vec2(1.0,0.0));
                    float c = hash(i + vec2(0.0,1.0));
                    float d = hash(i + vec2(1.0,1.0));
                    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
                }
                float fbm(vec2 p){
                    float s = 0.0;
                    float a = 0.6;
                    for(int i=0;i<4;i++){
                        s += noise(p) * a;
                        p *= 2.1;
                        a *= 0.5;
                    }
                    return s;
                }

                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 n = normalize(vNormal);
                    vec3 V = normalize(eye - vWorldPos);
                    vec3 L = normalize(sunDirection);
                    float fresnel = pow(1.0 - max(dot(V, n), 0.0), 3.0);
                    vec2 uv = vWorldPos.xz * 0.3 + vec2(time * 0.2, time * 0.15);
                    float bump = fbm(uv * 2.5) * 0.4 + fbm(uv * 5.0) * 0.2;
                    vec3 N = normalize(n + vec3(bump * 0.4, 0.0, bump * 0.4));
                    float diffuse = max(dot(N, L), 0.0);
                    vec3 base = mix(color * 0.6, color, diffuse);
                    float spec = pow(max(dot(reflect(-L, N), V), 0.0), 28.0) * 0.2;
                    vec3 col = base + vec3(spec) + fresnel * 0.25;
                    gl_FragColor = vec4(col, 0.9);
                }
            `
        });
        material.uniforms = uniforms;
        return material;
    }

    buildFastOceanMaterial() {
        // Adapted from webgl_shaders_ocean example (simplified)
        const uniforms = {
            time: { value: 0 },
            sunDirection: { value: new THREE.Vector3(0.3, 0.8, 0.45).normalize() },
            eye: { value: new THREE.Vector3() },
            uColor: { value: new THREE.Color(0x0d4b76) }
        };
        const material = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            depthWrite: true,
            side: THREE.FrontSide,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                void main() {
                    vec3 pos = position;
                    float w = sin(pos.x * 0.3 + time * 0.6) * 0.015;
                    w += sin(pos.z * 0.2 + time * 0.5) * 0.012;
                    pos += normalize(normal) * w;
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform float time;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                uniform vec3 uColor;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 n = normalize(vNormal);
                    vec3 V = normalize(eye - vWorldPos);
                    vec3 L = normalize(sunDirection);
                    float fresnel = pow(1.0 - max(dot(V, n), 0.0), 2.5);
                    float diff = max(dot(n, L), 0.0);
                    float spec = pow(max(dot(reflect(-L, n), V), 0.0), 16.0) * 0.1;
                    vec3 col = uColor * (0.5 + diff * 0.5) + spec + fresnel * 0.15;
                    gl_FragColor = vec4(col, 0.85);
                }
            `
        });
        material.uniforms = uniforms;
        return material;
    }

    applyPlanetScale(diameterKm) {
        const scale = (diameterKm || DEFAULT_DIAMETER_KM) / DEFAULT_DIAMETER_KM;
        this.sceneManager.planetGroup.scale.setScalar(scale);
        this.sceneManager.controls.minDistance = Math.max(0.2, (10 * scale) * 0.1); // approx
    }

    updateAtmosphere(settings, weather) {
        if (!this.lastSettings) return;
        const sunDir = this.sceneManager.getSunDir();
        this.atmosphereSystem.updateVisuals(settings, this.lastSettings.radius, this.lastSettings.subdivisions, this.lastSettings.heightScale, sunDir);
        if (weather) {
            this.atmosphereSystem.setWeather(weather.map, weather.rainHaze);
        }
    }

    rebuildClouds(sunDir) {
        if (!this.lastSettings) return;
        this.cloudSystem.rebuild(
            sunDir,
            this.lastSettings.radius,
            this.lastSettings.seaLevel,
            this.lastSettings.heightScale,
            this.lastSettings.subdivisions,
            this.cloudLayerSettings
        );
    }
}
