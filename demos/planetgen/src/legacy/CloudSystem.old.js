import * as THREE from 'three';
import { BASE_RADIUS_UNITS, DEFAULT_RADIUS_M } from './constants.js';

export class CloudSystem {
    constructor(sceneGroup) {
        this.sceneGroup = sceneGroup;
        this.clouds = [];
    }

    update(delta) {
        const dt = Math.min(delta, 0.25);
        for (const mesh of this.clouds) {
            const u = mesh.userData.uniforms;
            const s = mesh.userData.settings;
            const speed = s.speed || 1;
            // Accumulate wind offset at constant rate controlled by speed slider
            // Wind direction is constant (set at creation) - no rotation to avoid spiral acceleration
            u.windOffset.value += dt * speed * 0.3;
        }
    }

    clear() {
        for (const c of this.clouds) {
            this.sceneGroup.remove(c);
            c.geometry.dispose();
            c.material.dispose?.();
        }
        this.clouds = [];
    }

    rebuild(sunDir, planetRadius, seaLevel, heightScale, subdivisions, layers) {
        this.clear();
        for (const layer of layers) {
            if (!layer.enabled) continue;
            const mesh = this.buildCloudMesh(
                planetRadius + heightScale * 0.2, // Base radius approximation
                subdivisions,
                sunDir,
                planetRadius,
                seaLevel,
                heightScale,
                layer
            );
            this.clouds.push(mesh);
            this.sceneGroup.add(mesh);
        }
    }

    buildVolumeCloudMesh(radius, baseSubdivisions, sunDir, planetRadius, seaLevel, heightScale, settings, volumeTex, volumeMeta) {
<<<<<<< Updated upstream
        const n = Math.max(1, volumeMeta?.n || 1);
        const tilesX = Math.max(1, volumeMeta?.tilesX || Math.ceil(Math.sqrt(n)));
        const atlasW = Math.max(1, volumeMeta?.atlasW || n * tilesX);
        const atlasH = Math.max(1, volumeMeta?.atlasH || n * Math.ceil(n / tilesX));
        const baseRadius = Math.max(0.1, radius + settings.height);
        const halfThickness = Math.max(0.25, heightScale * 0.03);
        const innerRadius = Math.max(planetRadius + ((seaLevel - 0.5) * heightScale) + 0.05, baseRadius - halfThickness);
        const outerRadius = innerRadius + halfThickness * 2.0;
        const uniforms = {
            volumeAtlas: { value: volumeTex },
            volumeN: { value: n },
            tilesX: { value: tilesX },
            atlasW: { value: atlasW },
            atlasH: { value: atlasH },
            planetInvRot: { value: new THREE.Matrix3() },
            planetInvScale: { value: 1.0 },
            innerRadius: { value: innerRadius },
            outerRadius: { value: outerRadius },
            opacity: { value: settings.alpha },
            quantity: { value: settings.quantity },
            sunDir: { value: sunDir.clone().normalize() }
=======
        const modeId = settings.mode === 'billow' ? 1 : settings.mode === 'cellular' ? 2 : 0;

        const surfaceRadius = planetRadius + ((seaLevel - 0.5) * heightScale) + 0.05;
        const metersPerUnit = ((volumeMeta?.planetRadiusM ?? DEFAULT_RADIUS_M) / BASE_RADIUS_UNITS);
        const atmoUnits = ((volumeMeta?.atmoThicknessM ?? 20_000) / Math.max(metersPerUnit, 1e-6));
        const baseRadius = surfaceRadius;
        const halfThickness = Math.max(0.25, atmoUnits * 0.5);
        const innerRadius = Math.max(0.1, baseRadius - 0.05);
        const outerRadius = innerRadius + (2.0 * halfThickness);

        const uniforms = {
            windOffset: { value: 0 },
            color: { value: new THREE.Color(settings.color) },
            opacity: { value: settings.alpha },
            sunDir: { value: sunDir.clone().normalize() },
            windDir: { value: new THREE.Vector3(0, 0, 1) },
            quantity: { value: settings.quantity },
            noiseScale: { value: Math.max(1, settings.resolution) },
            mode: { value: modeId },
            volumeAtlas: { value: volumeTex },
            volumeN: { value: volumeMeta?.n ?? 64 },
            tilesX: { value: volumeMeta?.tilesX ?? 8 },
            atlasW: { value: volumeMeta?.atlasW ?? 512 },
            atlasH: { value: volumeMeta?.atlasH ?? 512 },
            volumeExtentM: { value: volumeMeta?.extentM ?? 520_000 },
            metersPerUnit: { value: metersPerUnit },
            planetInvRot: { value: new THREE.Matrix3() },
            planetInvScale: { value: 1.0 },
            innerRadius: { value: innerRadius },
            outerRadius: { value: outerRadius }
>>>>>>> Stashed changes
        };
        const detail = Math.max(2, Math.min(6, Math.floor(baseSubdivisions / 24)));
        const geometry = new THREE.IcosahedronGeometry(outerRadius, detail);
        const material = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                varying vec3 vWorld;
                void main() {
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorld = worldPos.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
<<<<<<< Updated upstream
=======
                uniform vec3 color;
                uniform float opacity;
                uniform float windOffset;
                uniform vec3 sunDir;
                uniform vec3 windDir;
                uniform float quantity;
                uniform float noiseScale;
                uniform float mode;
>>>>>>> Stashed changes
                uniform sampler2D volumeAtlas;
                uniform float volumeN;
                uniform float tilesX;
                uniform float atlasW;
                uniform float atlasH;
<<<<<<< Updated upstream
=======
                uniform float volumeExtentM;
                uniform float metersPerUnit;
>>>>>>> Stashed changes
                uniform mat3 planetInvRot;
                uniform float planetInvScale;
                uniform float innerRadius;
                uniform float outerRadius;
<<<<<<< Updated upstream
                uniform float opacity;
                uniform float quantity;
                uniform vec3 sunDir;
                varying vec3 vWorld;

                vec2 raySphere(vec3 ro, vec3 rd, float r) {
                    float b = dot(ro, rd);
                    float c = dot(ro, ro) - r * r;
                    float h = b * b - c;
=======
                varying vec3 vWorld;

                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float n000 = hash(i + vec3(0,0,0));
                    float n100 = hash(i + vec3(1,0,0));
                    float n010 = hash(i + vec3(0,1,0));
                    float n110 = hash(i + vec3(1,1,0));
                    float n001 = hash(i + vec3(0,0,1));
                    float n101 = hash(i + vec3(1,0,1));
                    float n011 = hash(i + vec3(0,1,1));
                    float n111 = hash(i + vec3(1,1,1));
                    float nx00 = mix(n000, n100, f.x);
                    float nx10 = mix(n010, n110, f.x);
                    float nx01 = mix(n001, n101, f.x);
                    float nx11 = mix(n011, n111, f.x);
                    float nxy0 = mix(nx00, nx10, f.y);
                    float nxy1 = mix(nx01, nx11, f.y);
                    return mix(nxy0, nxy1, f.z);
                }
                float fbm(vec3 p) {
                    float sum = 0.0;
                    float amp = 0.55;
                    for(int i=0;i<4;i++){
                        sum += noise(p) * amp;
                        p *= 2.1;
                        amp *= 0.5;
                    }
                    return sum;
                }

                vec2 sampleVolumeAtlas(vec3 idx) {
                    float tx = mod(idx.z, tilesX);
                    float ty = floor(idx.z / tilesX);
                    float ax = (tx * volumeN + idx.x + 0.5) / atlasW;
                    float ay = (ty * volumeN + idx.y + 0.5) / atlasH;
                    return texture2D(volumeAtlas, vec2(ax, ay)).rg; // cloud, rain
                }

                vec4 sampleVolumeTrilinear(vec3 posLocal) {
                    vec3 posM = posLocal * metersPerUnit;
                    vec3 uvw = clamp(posM / max(volumeExtentM, 1e-3) * 0.5 + vec3(0.5), 0.0, 0.999999);
                    vec3 posGrid = uvw * (volumeN - 1.0);
                    vec3 i0 = floor(posGrid);
                    vec3 f = clamp(posGrid - i0, 0.0, 1.0);
                    vec3 i1 = min(i0 + 1.0, vec3(volumeN - 1.0));
                    vec2 c000 = sampleVolumeAtlas(i0);
                    vec2 c100 = sampleVolumeAtlas(vec3(i1.x, i0.y, i0.z));
                    vec2 c010 = sampleVolumeAtlas(vec3(i0.x, i1.y, i0.z));
                    vec2 c110 = sampleVolumeAtlas(vec3(i1.x, i1.y, i0.z));
                    vec2 c001 = sampleVolumeAtlas(vec3(i0.x, i0.y, i1.z));
                    vec2 c101 = sampleVolumeAtlas(vec3(i1.x, i0.y, i1.z));
                    vec2 c011 = sampleVolumeAtlas(vec3(i0.x, i1.y, i1.z));
                    vec2 c111 = sampleVolumeAtlas(i1);

                    float wx = f.x, wy = f.y, wz = f.z;
                    vec2 cx0 = mix(c000, c100, wx);
                    vec2 cx1 = mix(c010, c110, wx);
                    vec2 cx2 = mix(c001, c101, wx);
                    vec2 cx3 = mix(c011, c111, wx);
                    vec2 cy0 = mix(cx0, cx1, wy);
                    vec2 cy1 = mix(cx2, cx3, wy);
                    vec2 c = mix(cy0, cy1, wz);

                    return vec4(c, 0.0, 0.0);
                }

                float densityAt(vec3 pos, out float rainOut) {
                    float r = length(pos);
                    if (r < innerRadius || r > outerRadius) { rainOut = 0.0; return 0.0; }
                    float h = (r - innerRadius) / max(outerRadius - innerRadius, 1e-3);
                    float profile = smoothstep(0.0, 0.12, h) * (1.0 - smoothstep(0.55, 1.0, h));

                    vec4 v = sampleVolumeTrilinear(pos);
                    vec4 v2 = sampleVolumeTrilinear(pos + vec3(0.3, -0.2, 0.15) * metersPerUnit * 0.25);
                    vec4 v3 = sampleVolumeTrilinear(pos + vec3(-0.25, 0.18, -0.22) * metersPerUnit * 0.35);
                    vec4 v4 = sampleVolumeTrilinear(pos + vec3(0.12, 0.24, -0.3) * metersPerUnit * 0.2);
                    vec4 vMix = (v + v2 + v3 + v4) * 0.25;

                    float cloud = vMix.r;
                    float rain = vMix.g;
                    rainOut = rain;

                    float cover = cloud * (0.45 + quantity * 1.1);

                    float freq = max(1.0, noiseScale) * 0.003;
                    vec3 advDir = normalize(windDir);
                    vec3 np = pos * freq + advDir * (windOffset * 0.35);
                    float n = fbm(np);
                    if (mode > 0.5 && mode < 1.5) {
                        n = abs(n) * 2.0 - 1.0;
                    } else if (mode > 1.5) {
                        vec3 q = floor(np * 0.9);
                        float c = fract(sin(dot(q, vec3(12.9898,78.233,45.164))) * 43758.5453);
                        n = mix(n, c * 2.0 - 1.0, 0.55);
                    }
                    float detail = smoothstep(0.15, 0.75, n + 0.2);
                    float d = cover * profile * detail;
                    d *= mix(1.0, 1.25, rain);
                    return d;
                }

                vec2 raySphere(vec3 ro, vec3 rd, float r) {
                    float b = dot(ro, rd);
                    float c = dot(ro, ro) - r * r;
                    float h = b*b - c;
>>>>>>> Stashed changes
                    if (h < 0.0) return vec2(1e9, -1e9);
                    h = sqrt(h);
                    return vec2(-b - h, -b + h);
                }

<<<<<<< Updated upstream
                vec2 atlasUV(vec3 dir, float slice) {
                    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
                    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
                    float tile = clamp(slice, 0.0, volumeN - 1.0);
                    float tileX = mod(tile, tilesX);
                    float tileY = floor(tile / tilesX);
                    float px = (tileX * volumeN + u * (volumeN - 1.0) + 0.5) / atlasW;
                    float py = (tileY * volumeN + v * (volumeN - 1.0) + 0.5) / atlasH;
                    return vec2(px, py);
                }

                float sampleDensity(vec3 dir, float shellT) {
                    float slice = shellT * (volumeN - 1.0);
                    float sliceL = floor(slice);
                    float sliceH = min(volumeN - 1.0, sliceL + 1.0);
                    float t = slice - sliceL;
                    vec2 uvL = atlasUV(dir, sliceL);
                    vec2 uvH = atlasUV(dir, sliceH);
                    float densL = texture2D(volumeAtlas, uvL).r;
                    float densH = texture2D(volumeAtlas, uvH).r;
                        float density = mix(densL, densH, t);
                        density *= quantity * 1.4;
                        density *= smoothstep(0.0, 1.0, shellT) * smoothstep(1.0, 0.1, shellT);
                        // Minimal floor to avoid “empty shell” frames when the volume is extremely sparse.
                        density = max(density, 0.01 * quantity);
                        return density;
                }

                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 ro = planetInvRot * (cameraPosition * planetInvScale);
                    vec3 p1 = planetInvRot * (vWorld * planetInvScale);
                    vec3 rd = normalize(p1 - ro);
                    float fragT = length(p1 - ro);

                    vec2 tOuter = raySphere(ro, rd, outerRadius);
                    float tStart = max(tOuter.x, 0.0);
                    float tEnd = min(tOuter.y, fragT);
                    if (tEnd <= tStart) discard;

                    vec2 tInner = raySphere(ro, rd, innerRadius);
                    if (tInner.x > 0.0) tEnd = min(tEnd, tInner.x);
                    if (tEnd <= tStart) discard;

                    float thickness = max(outerRadius - innerRadius, 1e-3);
                    // More ray steps for higher volume resolutions.
                    float stepF = clamp(mix(28.0, 48.0, clamp((volumeN - 32.0) / 96.0, 0.0, 1.0)), 28.0, 48.0);
                    int steps = int(stepF);
                    float seg = (tEnd - tStart) / float(steps);

                    vec3 sunL = normalize(planetInvRot * sunDir);
                    vec3 trans = vec3(1.0);
                    vec3 accum = vec3(0.0);
                    for (int i = 0; i < 64; i++) {
                        if (i >= steps) break;
                        float t = tStart + (float(i) + 0.5) * seg;
                        vec3 pos = ro + rd * t;
                        float r = length(pos);
                        float shellT = clamp((r - innerRadius) / thickness, 0.0, 1.0);
                        vec3 dir = normalize(pos);
                        float dens = sampleDensity(dir, shellT);
                        if (dens < 1e-4) continue;

                        float sunT = clamp(dot(dir, sunL), 0.0, 1.0);
                        vec3 col = vec3(1.0) * mix(0.7, 1.4, pow(sunT, 1.5));

                        float alphaStep = clamp(dens * opacity * (seg / thickness) * 6.0, 0.0, 1.0);
                        vec3 absorb = vec3(alphaStep);
                        accum += trans * col * alphaStep;
                        trans *= (vec3(1.0) - absorb);
                        if (max(trans.r, max(trans.g, trans.b)) < 0.02) break;
                    }

                    float alpha = clamp(1.0 - trans.r, 0.0, 1.0);
                    if (alpha < 0.01) discard;
                    gl_FragColor = vec4(accum, alpha);
=======
                void main() {
                    #include <logdepthbuf_fragment>

                    vec3 ro = planetInvRot * (cameraPosition * planetInvScale);
                    vec3 p1 = planetInvRot * (vWorld * planetInvScale);
                    vec3 rd = normalize(p1 - ro);

                    vec2 tOuter = raySphere(ro, rd, outerRadius);
                    float tStart = max(tOuter.x, 0.0);
                    float tEnd = tOuter.y;
                    if (tEnd <= tStart) discard;

                    vec2 tInner = raySphere(ro, rd, innerRadius);
                    if (tInner.x <= tInner.y) {
                        if (tInner.x > 0.0) tEnd = min(tEnd, tInner.x);
                        else if (tInner.y > 0.0) tStart = max(tStart, tInner.y);
                    }
                    if (tEnd <= tStart) discard;

                    int steps = int(clamp(mix(28.0, 48.0, clamp((volumeN - 32.0) / 96.0, 0.0, 1.0)), 28.0, 48.0));
                    float stepSize = (tEnd - tStart) / float(steps);
                    vec3 sum = vec3(0.0);
                    float alpha = 0.0;

                    vec3 sunLocal = normalize(planetInvRot * sunDir);

                    for (int i = 0; i < 48; i++) {
                        if (i >= steps) break;
                        float t = tStart + (float(i) + 0.5) * stepSize;
                        vec3 pos = ro + rd * t;

                        float rainNow = 0.0;
                        float d = densityAt(pos, rainNow);
                        if (d <= 1e-4) continue;

                        float day = clamp(dot(normalize(pos), sunLocal), 0.0, 1.0);
                        float light = mix(0.55, 1.15, day);
                        vec3 ccol = mix(color, color * 0.85, rainNow) * light;

                        float a = 1.0 - exp(-d * stepSize * 4.5);
                        sum += (1.0 - alpha) * ccol * a;
                        alpha += (1.0 - alpha) * a;
                        if (alpha > 0.985) break;
                    }

                    alpha *= opacity;
                    if (alpha < 0.01) discard;
                    gl_FragColor = vec4(sum, alpha);
>>>>>>> Stashed changes
                }
            `
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.uniforms = uniforms;
        mesh.userData.settings = settings;
        mesh.renderOrder = 2;
        return mesh;
    }

    buildCloudMesh(radius, baseSubdivisions, sunDir, planetRadius, seaLevel, heightScale, settings) {
        const cloudRadius = Math.max(0.1, radius + settings.height);
        const modeId = settings.mode === 'billow' ? 1 : settings.mode === 'cellular' ? 2 : 0;
        const uniforms = {
            time: { value: 0 },
            windOffset: { value: 0 },
            color: { value: new THREE.Color(settings.color) },
            opacity: { value: settings.alpha },
            sunDir: { value: sunDir.clone().normalize() },
            windDir: { value: new THREE.Vector3(0, 0, 1) },
            planetRadius: { value: planetRadius },
            seaLevel: { value: seaLevel },
            heightScale: { value: heightScale },
            speed: { value: settings.speed },
            quantity: { value: settings.quantity },
            noiseScale: { value: Math.max(0.1, settings.resolution) },
            mode: { value: modeId }
        };
        const geometry = new THREE.IcosahedronGeometry(cloudRadius, Math.max(1, Math.floor(baseSubdivisions * 0.5)));
        const material = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide,
            blending: THREE.NormalBlending,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                uniform float windOffset;
                uniform vec3 sunDir;
                uniform vec3 windDir;
                uniform float planetRadius;
                uniform float seaLevel;
                uniform float heightScale;
                uniform float quantity;
                uniform float noiseScale;
                uniform float mode;
                varying vec3 vWorld;
                varying vec3 vNormal;
                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float n000 = hash(i + vec3(0,0,0));
                    float n100 = hash(i + vec3(1,0,0));
                    float n010 = hash(i + vec3(0,1,0));
                    float n110 = hash(i + vec3(1,1,0));
                    float n001 = hash(i + vec3(0,0,1));
                    float n101 = hash(i + vec3(1,0,1));
                    float n011 = hash(i + vec3(0,1,1));
                    float n111 = hash(i + vec3(1,1,1));
                    float nx00 = mix(n000, n100, f.x);
                    float nx10 = mix(n010, n110, f.x);
                    float nx01 = mix(n001, n101, f.x);
                    float nx11 = mix(n011, n111, f.x);
                    float nxy0 = mix(nx00, nx10, f.y);
                    float nxy1 = mix(nx01, nx11, f.y);
                    return mix(nxy0, nxy1, f.z);
                }
                float fbm(vec3 p) {
                    float sum = 0.0;
                    float amp = 0.5;
                    for(int i=0;i<4;i++){
                        sum += noise(p) * amp;
                        p *= 2.1;
                        amp *= 0.5;
                    }
                    return sum;
                }
                void main() {
                    vec3 pos = position;
                    vec3 dir = normalize(pos);
                    float base = fbm(dir * (noiseScale * 0.05) + windDir * windOffset);
                    float n = base;
                    if (mode > 0.5 && mode < 1.5) {
                        n = abs(base) * 2.0 - 1.0;
                    } else if (mode > 1.5) {
                        vec3 q = floor(dir * noiseScale);
                        float c = fract(sin(dot(q, vec3(12.9898,78.233,45.164))) * 43758.5453);
                        n = mix(base, c * 2.0 - 1.0, 0.5);
                    }
                    pos += normal * n * 0.35;
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorld = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 color;
                uniform float opacity;
                uniform float time;
                uniform float windOffset;
                uniform vec3 sunDir;
                uniform vec3 windDir;
                uniform float planetRadius;
                uniform float seaLevel;
                uniform float heightScale;
                uniform float quantity;
                uniform float noiseScale;
                uniform float mode;
                varying vec3 vWorld;
                varying vec3 vNormal;
                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float n000 = hash(i + vec3(0,0,0));
                    float n100 = hash(i + vec3(1,0,0));
                    float n010 = hash(i + vec3(0,1,0));
                    float n110 = hash(i + vec3(1,1,0));
                    float n001 = hash(i + vec3(0,0,1));
                    float n101 = hash(i + vec3(1,0,1));
                    float n011 = hash(i + vec3(0,1,1));
                    float n111 = hash(i + vec3(1,1,1));
                    float nx00 = mix(n000, n100, f.x);
                    float nx10 = mix(n010, n110, f.x);
                    float nx01 = mix(n001, n101, f.x);
                    float nx11 = mix(n011, n111, f.x);
                    float nxy0 = mix(nx00, nx10, f.y);
                    float nxy1 = mix(nx01, nx11, f.y);
                    return mix(nxy0, nxy1, f.z);
                }
                float fbm(vec3 p) {
                    float sum = 0.0;
                    float amp = 0.5;
                    for(int i=0;i<4;i++){
                        sum += noise(p) * amp;
                        p *= 2.1;
                        amp *= 0.5;
                    }
                    return sum;
                }
                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 dir = normalize(vWorld);
                    float day = clamp(dot(dir, normalize(sunDir)), 0.0, 1.0);
                    float lat = 1.0 - abs(dir.y);
                    float base = fbm(dir * (noiseScale * 0.02 + 0.6) + windDir * windOffset + vec3(0.0, windOffset * 0.07, 0.0));
                    float n = base;
                    if (mode > 0.5 && mode < 1.5) {
                        n = abs(base) * 2.0 - 1.0;
                    } else if (mode > 1.5) {
                        vec3 q = floor(dir * noiseScale);
                        float c = fract(sin(dot(q, vec3(12.9898,78.233,45.164))) * 43758.5453);
                        n = mix(base, c * 2.0 - 1.0, 0.5);
                    }
                    float coverage = n + lat * 0.2 + day * 0.25;
                    coverage += (quantity - 0.5) * 0.8;
                    float alpha = smoothstep(0.48, 0.68, coverage) * opacity;
                    if(alpha < 0.01) discard;
                    vec3 viewDir = normalize(cameraPosition - vWorld);
                    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
                gl_FragColor = vec4(color * (0.8 + fresnel * 0.4), alpha);
            }
        `
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.uniforms = uniforms;
        mesh.userData.settings = settings;
        mesh.renderOrder = 2;
        return mesh;
    }
}
