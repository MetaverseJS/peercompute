import * as THREE from 'three';

export class AtmosphereSystem {
    constructor(sceneGroup) {
        this.sceneGroup = sceneGroup;
        this.mesh = null;
        const defaultTex = new THREE.DataTexture(new Uint8Array([110, 0, 128, 0]), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
        defaultTex.needsUpdate = true;
        defaultTex.wrapS = THREE.RepeatWrapping;
        defaultTex.wrapT = THREE.ClampToEdgeWrapping;
        defaultTex.minFilter = THREE.LinearFilter;
        defaultTex.magFilter = THREE.LinearFilter;
        defaultTex.generateMipmaps = false;
        defaultTex.colorSpace = THREE.NoColorSpace;
        this.defaultWeatherTexture = defaultTex;
        this.uniforms = {
            sunDir: { value: new THREE.Vector3(0, 1, 0) },
            glowColor: { value: new THREE.Color(0x4da8ff) },
            alpha: { value: 1.0 },
            density: { value: 6.0 },
            weatherMap: { value: defaultTex },
            rainHaze: { value: 0.9 },
            planetInvRot: { value: new THREE.Matrix3() },
            planetInvScale: { value: 1.0 },
            innerRadius: { value: 10.0 },
            outerRadius: { value: 11.0 },
            rayleighScaleHeight: { value: 0.25 }, // fraction of (outer-inner)
            mieScaleHeight: { value: 0.08 }, // fraction of (outer-inner)
            mieG: { value: 0.76 },
            exposure: { value: 1.15 }
        };
        this.uniforms.planetInvRot.value.identity();
    }

    update(delta) {
        const scale = this.sceneGroup?.scale?.x || 1;
        this.uniforms.planetInvScale.value = scale ? (1 / scale) : 1;
    }

    setWeather(map, rainHaze = 0.9) {
        if (!this.uniforms.weatherMap) {
            this.uniforms.weatherMap = { value: this.defaultWeatherTexture };
        }
        if (!this.uniforms.rainHaze) {
            this.uniforms.rainHaze = { value: 0.9 };
        }
        this.uniforms.weatherMap.value = map || this.defaultWeatherTexture;
        this.uniforms.rainHaze.value = rainHaze;
    }

    // Rebuilds or updates the atmosphere mesh
    updateVisuals(settings, radius, subdivisions, heightScale, sunDir) {
        if (!settings.atmosphereEnabled) {
            if (this.mesh) this.mesh.visible = false;
            return;
        }

        const thickness = Math.max(0.05, settings.atmosphere);
        const heightOffset = settings.atmosphereHeight;
        const alpha = settings.atmosphereAlpha;
        const colorHex = settings.atmosphereColor;

        const outerRadius = radius + heightOffset + Math.max(0.05, thickness) * heightScale;
        
        this.uniforms.alpha.value = alpha;
        this.uniforms.glowColor.value = new THREE.Color(colorHex);
        this.uniforms.sunDir.value.copy(sunDir).normalize();
        this.uniforms.innerRadius.value = radius;
        this.uniforms.outerRadius.value = outerRadius;

        // Always rebuild geometry if resolution changes?
        // For simplicity, we rebuild mesh like original code.
        const detail = Math.max(2, Math.min(6, Math.floor(subdivisions / 24)));
        const geometry = new THREE.IcosahedronGeometry(outerRadius, detail);
        
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
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
            uniform float alpha;
            uniform float density;
            uniform vec3 glowColor;
            uniform vec3 sunDir;
            uniform sampler2D weatherMap;
            uniform float rainHaze;
            uniform mat3 planetInvRot;
            uniform float planetInvScale;
            uniform float innerRadius;
            uniform float outerRadius;
            uniform float rayleighScaleHeight;
                uniform float mieScaleHeight;
                uniform float mieG;
                uniform float exposure;
                varying vec3 vWorld;

                vec2 raySphere(vec3 ro, vec3 rd, float r) {
                    float b = dot(ro, rd);
                    float c = dot(ro, ro) - r * r;
                    float h = b * b - c;
                    if (h < 0.0) return vec2(1e9, -1e9);
                    h = sqrt(h);
                    return vec2(-b - h, -b + h);
                }

                float phaseRayleigh(float mu) {
                    return 3.0 / (16.0 * PI) * (1.0 + mu * mu);
                }

                float phaseMie(float mu, float g) {
                    float g2 = g * g;
                    float denom = pow(max(1.0 + g2 - 2.0 * g * mu, 1e-4), 1.5);
                    return (1.0 - g2) / (4.0 * PI * denom);
                }

                vec3 exp3(vec3 v) {
                    return vec3(exp(-v.x), exp(-v.y), exp(-v.z));
                }

                void main() {
                    #include <logdepthbuf_fragment>

                vec3 ro = planetInvRot * (cameraPosition * planetInvScale);
                vec3 p1 = planetInvRot * (vWorld * planetInvScale);
                vec3 rd = normalize(p1 - ro);
                float tFrag = length(p1 - ro);

                vec3 sunLocal = normalize(planetInvRot * sunDir);
                vec3 viewDirLocal = normalize(p1);
                float wu = atan(viewDirLocal.z, viewDirLocal.x) / (2.0 * PI) + 0.5;
                float wv = asin(clamp(viewDirLocal.y, -1.0, 1.0)) / PI + 0.5;
                float rainDir = texture2D(weatherMap, vec2(wu, wv)).g;

                vec2 tOuter = raySphere(ro, rd, outerRadius);
                float tStart = max(tOuter.x, 0.0);
                float tEnd = min(tOuter.y, tFrag);
                if (tEnd <= tStart) discard;

                    vec2 tInner = raySphere(ro, rd, innerRadius);
                    if (tInner.x > 0.0) {
                        tEnd = min(tEnd, tInner.x);
                    }
                    if (tEnd <= tStart) discard;

                float atmoH = max(outerRadius - innerRadius, 1e-3);
                float HR = max(atmoH * rayleighScaleHeight, 1e-4);
                float HM = max(atmoH * mieScaleHeight, 1e-4);
                float rainM = clamp(rainDir * rainHaze, 0.0, 2.0);
                HM = max(HM / (1.0 + rainM * 0.9), 1e-4); // concentrate haze near ground

                vec3 betaR = vec3(5.8e-3, 13.5e-3, 33.1e-3);
                betaR *= mix(vec3(0.75), glowColor, 0.85);

                betaR *= density;
                float betaM = 21e-3 * density;
                betaM *= (1.0 + rainM * 1.35);

                    const int PRIMARY_STEPS = 8;
                    const int LIGHT_STEPS = 4;

                    float segLen = (tEnd - tStart) / float(PRIMARY_STEPS);
                    float optR = 0.0;
                    float optM = 0.0;
                    vec3 sumR = vec3(0.0);
                    vec3 sumM = vec3(0.0);

                    for (int i = 0; i < PRIMARY_STEPS; i++) {
                        float t = tStart + (float(i) + 0.5) * segLen;
                        vec3 pos = ro + rd * t;
                        float height = max(length(pos) - innerRadius, 0.0);
                        float dR = exp(-height / HR);
                        float dM = exp(-height / HM);

                        optR += dR * segLen;
                        optM += dM * segLen;

                        vec2 tSunOuter = raySphere(pos, sunLocal, outerRadius);
                        float tSunEnd = tSunOuter.y;
                        if (tSunEnd <= 0.0) continue;

                        vec2 tSunInner = raySphere(pos, sunLocal, innerRadius);
                        float shadow = 1.0;
                        if (tSunInner.x > 0.0 && tSunInner.x < tSunEnd) {
                            shadow = 0.0;
                        }

                        float segL = tSunEnd / float(LIGHT_STEPS);
                        float optSunR = 0.0;
                        float optSunM = 0.0;
                        for (int j = 0; j < LIGHT_STEPS; j++) {
                            float tl = (float(j) + 0.5) * segL;
                            vec3 pl = pos + sunLocal * tl;
                            float hL = max(length(pl) - innerRadius, 0.0);
                            optSunR += exp(-hL / HR) * segL;
                            optSunM += exp(-hL / HM) * segL;
                        }

                        vec3 tau = betaR * (optR + optSunR) + vec3(betaM * (optM + optSunM));
                        vec3 trans = exp3(tau);
                        trans *= shadow;

                        sumR += trans * dR * segLen;
                        sumM += trans * dM * segLen;
                    }

                    float mu = dot(rd, sunLocal);
                    float pR = phaseRayleigh(mu);
                    float pM = phaseMie(mu, mieG);

                    vec3 radiance = (betaR * sumR * pR + vec3(betaM) * sumM * pM) * 18.0;
                    radiance = vec3(1.0) - exp(-radiance * exposure);
                    radiance *= alpha;

                    float lum = max(radiance.r, max(radiance.g, radiance.b));
                    if (lum < 0.002) discard;

                    gl_FragColor = vec4(radiance, 1.0);
                }
            `
        });

        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose?.();
            this.sceneGroup.remove(this.mesh);
        }

        this.mesh = new THREE.Mesh(geometry, material);
        // Draw before clouds so scattering doesn't wash out volumetric clouds (clouds don't write depth).
        this.mesh.renderOrder = 1;
        this.sceneGroup.add(this.mesh);
    }
}
