import * as THREE from 'three';

const DEFAULT_WEATHER_TEX = (() => {
    const data = new Uint8Array([0, 0, 0, 0]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
})();

export class RainSystem {
    constructor(scene, { maxDrops = 12000 } = {}) {
        this.scene = scene;
        this.maxDrops = Math.max(0, Math.floor(maxDrops));
        this.enabled = true;

        this.uniforms = {
            time: { value: 0 },
            color: { value: new THREE.Color('#bfe8ff') },
            opacity: { value: 0.55 },
            strength: { value: 1.0 },
            density: { value: 0.65 },
            rainThreshold: { value: 0.03 },

            volumeRadius: { value: 0.012 },
            volumeHeight: { value: 0.012 },
            fallDistance: { value: 0.016 },
            fallSpeed: { value: 0.35 }, // cycles/s
            dropLength: { value: 0.00025 },
            dropWidth: { value: 0.00005 },

            // Gating: disable rain when far from surface (in planet-local unscaled units).
            planetNearRadius: { value: 12.0 },
            nearMargin: { value: 0.35 },

            // Weather frame + texture
            weatherMap: { value: DEFAULT_WEATHER_TEX },
            planetInvRot: { value: new THREE.Matrix3() },
            planetInvScale: { value: 1.0 },

            // Wind (world-space, tangent-ish)
            windWorld: { value: new THREE.Vector3(0, 0, 0) },
            windTilt: { value: 0.65 }
        };

        this.mesh = this._buildMesh();
        this.mesh.visible = this.enabled;
        this.mesh.frustumCulled = false;
        this.mesh.renderOrder = 1.2; // after planet, before volumetric clouds
        scene.add(this.mesh);
    }

    dispose() {
        if (!this.mesh) return;
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose?.();
        this.mesh = null;
    }

    setEnabled(enabled) {
        this.enabled = !!enabled;
        if (this.mesh) this.mesh.visible = this.enabled;
    }

    setWeatherMap(tex) {
        this.uniforms.weatherMap.value = tex ?? DEFAULT_WEATHER_TEX;
    }

    setWeatherFrame({ planetInvRot, planetInvScale }) {
        if (planetInvRot) this.uniforms.planetInvRot.value.copy(planetInvRot);
        if (Number.isFinite(planetInvScale)) this.uniforms.planetInvScale.value = planetInvScale;
    }

    setWindWorld(vec) {
        if (!vec) return;
        this.uniforms.windWorld.value.copy(vec);
    }

    setPlanetNearRadius(r) {
        if (Number.isFinite(r)) this.uniforms.planetNearRadius.value = Math.max(0.1, r);
    }

    setStrength(v) {
        if (Number.isFinite(v)) this.uniforms.strength.value = Math.max(0, v);
    }

    setDensity(v) {
        if (Number.isFinite(v)) this.uniforms.density.value = Math.min(Math.max(v, 0), 1);
    }

    setSizes({ volumeRadius, volumeHeight, fallDistance, dropLength, dropWidth } = {}) {
        if (Number.isFinite(volumeRadius)) this.uniforms.volumeRadius.value = Math.max(0, volumeRadius);
        if (Number.isFinite(volumeHeight)) this.uniforms.volumeHeight.value = Math.max(0, volumeHeight);
        if (Number.isFinite(fallDistance)) this.uniforms.fallDistance.value = Math.max(0, fallDistance);
        if (Number.isFinite(dropLength)) this.uniforms.dropLength.value = Math.max(0, dropLength);
        if (Number.isFinite(dropWidth)) this.uniforms.dropWidth.value = Math.max(0, dropWidth);
    }

    update(delta) {
        if (!this.enabled || !this.mesh) return;
        const dt = Math.min(Math.max(delta ?? 0, 0), 0.25);
        this.uniforms.time.value += dt;
    }

    _buildMesh() {
        const base = new THREE.PlaneGeometry(1, 1, 1, 1);
        const geom = new THREE.InstancedBufferGeometry();
        geom.index = base.index;
        geom.attributes.position = base.attributes.position;
        geom.attributes.uv = base.attributes.uv;

        const offsets = new Float32Array(this.maxDrops * 3);
        const seeds = new Float32Array(this.maxDrops);
        for (let i = 0; i < this.maxDrops; i++) {
            const i3 = i * 3;
            // x/z in tangent plane, y is "start height" above camera in [0..1].
            offsets[i3 + 0] = (Math.random() * 2 - 1);
            offsets[i3 + 1] = Math.random();
            offsets[i3 + 2] = (Math.random() * 2 - 1);
            seeds[i] = Math.random();
        }

        geom.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
        geom.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
        geom.instanceCount = this.maxDrops;

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: true,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>

                attribute vec3 aOffset;
                attribute float aSeed;

                uniform float time;
                uniform float density;

                uniform float volumeRadius;
                uniform float volumeHeight;
                uniform float fallDistance;
                uniform float fallSpeed;
                uniform float dropLength;
                uniform float dropWidth;

                uniform float planetNearRadius;
                uniform float nearMargin;

                uniform mat3 planetInvRot;
                uniform float planetInvScale;
                uniform vec3 windWorld;
                uniform float windTilt;

                varying vec2 vWeatherUV;
                varying float vSeed;
                varying float vVisible;
                varying vec2 vUV;

                vec3 safeNormalize(vec3 v) {
                    float l = length(v);
                    if (l < 1e-6) return vec3(0.0, 1.0, 0.0);
                    return v / l;
                }

                vec3 basisEast(vec3 up) {
                    vec3 axis = vec3(0.0, 1.0, 0.0);
                    vec3 e = cross(axis, up);
                    if (length(e) < 1e-5) {
                        axis = vec3(1.0, 0.0, 0.0);
                        e = cross(axis, up);
                    }
                    return safeNormalize(e);
                }

                void main() {
                    vUV = uv;
                    vSeed = aSeed;
                    if (aSeed > density) {
                        vVisible = 0.0;
                        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
                        return;
                    }

                    // Disable rain when the camera is far from the surface (orbit view).
                    vec3 camLocal = planetInvRot * (cameraPosition * planetInvScale);
                    float camR = length(camLocal);
                    float camNear = 1.0 - smoothstep(planetNearRadius + nearMargin, planetNearRadius + nearMargin * 3.0, camR);
                    if (camNear <= 0.001) {
                        vVisible = 0.0;
                        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
                        return;
                    }

                    vec3 upWorld = safeNormalize(cameraPosition);
                    vec3 eastWorld = basisEast(upWorld);
                    vec3 northWorld = safeNormalize(cross(upWorld, eastWorld));

                    float t = fract(time * fallSpeed + aSeed * 31.7);
                    vec3 offsetWorld = eastWorld * (aOffset.x * volumeRadius)
                        + northWorld * (aOffset.z * volumeRadius)
                        + upWorld * (aOffset.y * volumeHeight)
                        - upWorld * (t * fallDistance);

                    vec3 basePosWorld = cameraPosition + offsetWorld;
                    vec3 basePosLocal = planetInvRot * (basePosWorld * planetInvScale);
                    vec3 dirLocal = safeNormalize(basePosLocal);
                    float wu = atan(dirLocal.z, dirLocal.x) / (2.0 * 3.14159265) + 0.5;
                    float wv = asin(clamp(dirLocal.y, -1.0, 1.0)) / 3.14159265 + 0.5;
                    vWeatherUV = vec2(wu, wv);

                    vec3 downWorld = -upWorld;
                    vec3 fallDirWorld = safeNormalize(downWorld + windWorld * windTilt);
                    vec3 viewDirWorld = safeNormalize(cameraPosition - basePosWorld);
                    vec3 rightWorld = cross(viewDirWorld, fallDirWorld);
                    float rl = length(rightWorld);
                    if (rl < 1e-5) rightWorld = eastWorld;
                    else rightWorld /= rl;

                    float widthCoord = (uv.x - 0.5) * dropWidth;
                    float along = uv.y * dropLength;
                    vec3 worldPos = basePosWorld + rightWorld * widthCoord + fallDirWorld * along;

                    vVisible = camNear;
                    vec4 mv = viewMatrix * vec4(worldPos, 1.0);
                    gl_Position = projectionMatrix * mv;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>

                uniform sampler2D weatherMap;
                uniform vec3 color;
                uniform float opacity;
                uniform float strength;
                uniform float rainThreshold;

                varying vec2 vWeatherUV;
                varying float vSeed;
                varying float vVisible;
                varying vec2 vUV;

                void main() {
                    #include <logdepthbuf_fragment>

                    if (vVisible <= 0.001) discard;

                    vec4 w = texture2D(weatherMap, vWeatherUV);
                    float rainNow = w.g;
                    float rainFactor = smoothstep(rainThreshold, rainThreshold + 0.18, rainNow);

                    float across = abs(vUV.x - 0.5) * 2.0;
                    float core = 1.0 - smoothstep(0.65, 1.0, across);
                    float taper = smoothstep(0.0, 0.08, vUV.y) * (1.0 - smoothstep(0.85, 1.0, vUV.y));

                    float a = opacity * strength * rainFactor * core * taper * vVisible;
                    if (a < 0.01) discard;

                    gl_FragColor = vec4(color, a);
                }
            `
        });

        base.dispose();
        return new THREE.Mesh(geom, material);
    }
}

