import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        if (this.canvas && this.canvas.setAttribute) {
            this.canvas.setAttribute('tabindex', '0'); // allow focus for pointer lock
        }
        
        // Renderer
        this.renderer = this.createRenderer(canvas);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x05070f);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.xr.enabled = true; // Enable XR support
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x05070f);
        this.scene.fog = new THREE.Fog(0x05070f, 30, 120);

        // Groups
        this.planetGroup = new THREE.Group();
        this.scene.add(this.planetGroup);

        this.userGroup = new THREE.Group();
        this.scene.add(this.userGroup);

        // Camera
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
        this.userGroup.add(this.camera);
        this.camera.position.set(0, 10, 28);

        // Controls
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 2.2;
        this.controls.zoomSpeed = 2.0;
        this.controls.panSpeed = 1.0;
        this.controls.dynamicDampingFactor = 0.1;
        this.controls.noPan = true;
        this.controls.minDistance = 12;
        this.controls.maxDistance = 60;
        // Safe-guard TrackballControls touch handling: ignore stray touches we don't track
        if (typeof this.controls.onTouchMove === 'function') {
            const origTouchMove = this.controls.onTouchMove.bind(this.controls);
            this.controls.onTouchMove = (event) => {
                if (!event.touches || event.touches.length === 0) return;
                return origTouchMove(event);
            };
        }
        if (typeof this.controls.onTouchEnd === 'function') {
            const origTouchEnd = this.controls.onTouchEnd.bind(this.controls);
            this.controls.onTouchEnd = (event) => {
                if (!event.touches) return;
                return origTouchEnd(event);
            };
        }

        // Lights
        this.scene.add(new THREE.HemisphereLight(0xd8e7ff, 0x0a0c12, 0.0009));
        this.dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
        this.dirLight.position.set(12, 16, 10);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.set(2048, 2048);
        this.dirLight.shadow.camera.near = 0.5;
        this.dirLight.shadow.camera.far = 300;
        const s = 80;
        this.dirLight.shadow.camera.left = -s;
        this.dirLight.shadow.camera.right = s;
        this.dirLight.shadow.camera.top = s;
        this.dirLight.shadow.camera.bottom = -s;
        this.scene.add(this.dirLight.target);
        this.scene.add(this.dirLight);

        // Physical sun representation (billboarded glow + core sphere)
        // Sun visual disabled (directional light still used for lighting/shadows)
        this.sunMesh = null;

        // Starfield
        this.scene.add(this.buildStarfield());

        // Bindings
        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);
    }

    createRenderer(canvas) {
        const attempts = [
            { ctor: THREE.WebGLRenderer, opts: { antialias: true, canvas, logarithmicDepthBuffer: true } },
            { ctor: THREE.WebGLRenderer, opts: { antialias: true, canvas, logarithmicDepthBuffer: false } },
            { ctor: THREE.WebGLRenderer, opts: { antialias: false, canvas, logarithmicDepthBuffer: false } },
            { ctor: THREE.WebGL1Renderer, opts: { antialias: true, canvas, logarithmicDepthBuffer: false } }
        ];
        for (let i = 0; i < attempts.length; i++) {
            const { ctor, opts } = attempts[i];
            try {
                return new ctor(opts);
            } catch (err) {
                console.warn(`WebGL init failed (attempt ${i + 1})`, err);
            }
        }
        throw new Error('WebGL context could not be created. Enable WebGL/hardware acceleration or try a different browser/XR emulator configuration.');
    }

    buildStarfield() {
        const starCount = 1200;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const r = 90 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const u = Math.random() * 2 - 1;
            const phi = Math.acos(u);
            const sinPhi = Math.sin(phi);
    
            positions[i * 3] = r * sinPhi * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.cos(phi);
            positions[i * 3 + 2] = r * sinPhi * Math.sin(theta);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0x7dd3fc,
            size: 0.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.7
        });
        return new THREE.Points(geometry, material);
    }

    onResize() {
        const { innerWidth, innerHeight } = window;
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(innerWidth, innerHeight);
        this.controls.handleResize();
    }

    update(updateControls = true) {
        if (updateControls && this.controls) {
            this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    getSunDir() {
        return this.dirLight.position.clone().normalize();
    }
}
