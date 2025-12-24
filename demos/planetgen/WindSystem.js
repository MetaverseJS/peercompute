import * as THREE from 'three';

export class WindSystem {
    constructor(scene, { maxSprites = 1200 } = {}) {
        this.scene = scene;
        this.maxSprites = Math.max(16, Math.floor(maxSprites));
        this.enabled = true;
        this.center = new THREE.Vector3();

        this.uniforms = {
            time: { value: 0 },
            windWorld: { value: new THREE.Vector3(0, 0, 0) },
            color: { value: new THREE.Color('#d3ecff') },
            opacity: { value: 0.85 },
            radius: { value: 12.0 },
            height: { value: 6.0 },
            speed: { value: 1.4 }
        };

        this.mesh = this._buildMesh();
        this.mesh.frustumCulled = false;
        this.scene.add(this.mesh);
    }

    dispose() {
        if (!this.mesh) return;
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose?.();
        this.mesh = null;
    }

    setEnabled(v) {
        this.enabled = !!v;
        if (this.mesh) this.mesh.visible = this.enabled;
    }

    setWind(vec) {
        if (!vec) return;
        this.uniforms.windWorld.value.copy(vec);
    }

    setCenter(pos) {
        if (!pos || !this.mesh) return;
        this.center.copy(pos);
        this.mesh.position.copy(pos);
    }

    update(delta) {
        if (!this.enabled || !this.mesh) return;
        const dt = Math.min(Math.max(delta ?? 0, 0), 0.25);
        this.uniforms.time.value += dt;
    }

    _buildMesh() {
        const base = new THREE.PlaneGeometry(0.35, 0.08);
        const geom = new THREE.InstancedBufferGeometry();
        geom.index = base.index;
        geom.attributes.position = base.attributes.position;
        geom.attributes.uv = base.attributes.uv;

        const offsets = new Float32Array(this.maxSprites * 3);
        const seeds = new Float32Array(this.maxSprites);
        for (let i = 0; i < this.maxSprites; i++) {
            const i3 = i * 3;
            offsets[i3 + 0] = (Math.random() * 2 - 1); // x
            offsets[i3 + 1] = Math.random(); // y 0..1
            offsets[i3 + 2] = (Math.random() * 2 - 1); // z
            seeds[i] = Math.random();
        }
        geom.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
        geom.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
        geom.instanceCount = this.maxSprites;

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexShader: `
                #include <common>
                #include <logdepthbuf_pars_vertex>
                attribute vec3 aOffset;
                attribute float aSeed;
                uniform float time;
                uniform vec3 windWorld;
                uniform float radius;
                uniform float height;
                uniform float speed;
                varying float vAlpha;
                varying vec2 vUV;
                void main() {
                    vUV = uv;
                    vec3 basePos = vec3(aOffset.x * radius, aOffset.y * height, aOffset.z * radius);
                    float jitter = sin(dot(basePos, vec3(12.9898,78.233,45.164)) + aSeed * 19.19);
                    vec3 wind = windWorld;
                    float windLen = length(wind);
                    vec3 dir = windLen > 1e-4 ? wind / windLen : vec3(0.0, 0.0, 1.0);
                    float drift = time * speed * max(windLen, 0.4) + aSeed * 6.2831;
                    basePos += dir * drift * 1.35;
                    basePos.y += sin(drift + jitter) * 0.55;
                    basePos += vec3(jitter * 0.55, 0.0, jitter * 0.55);

                    vec3 centerWorld = (modelMatrix * vec4(basePos, 1.0)).xyz;
                    // Camera-facing billboard quad.
                    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
                    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
                    vec3 billboardPos = centerWorld + right * position.x * 0.35 + up * position.y * 0.35;
                    vec4 worldPos = vec4(billboardPos, 1.0);
                    vAlpha = 0.3 + smoothstep(0.0, 0.2, windLen * 0.6);
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,
            fragmentShader: `
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 color;
                uniform float opacity;
                varying float vAlpha;
                varying vec2 vUV;
                void main() {
                    #include <logdepthbuf_fragment>
                    float d = length(vUV - 0.5);
                    float m = smoothstep(0.65, 0.05, d);
                    float a = opacity * vAlpha * m;
                    if (a < 0.01) discard;
                    gl_FragColor = vec4(color, a);
                }
            `
        });

        const mesh = new THREE.Mesh(geom, material);
        mesh.renderOrder = 1.25;
        return mesh;
    }
}
