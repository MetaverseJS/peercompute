import * as THREE from 'three';

/**
 * OceanVectorVisualizationSystem - Draws ocean current and wave vectors on the globe surface
 * Currents are driven by the ocean wind field, waves are derived from the ocean height/normal texture.
 */
export class OceanVectorVisualizationSystem {
    constructor(planetGroup, options = {}) {
        this.planetGroup = planetGroup;
        this.currentMesh = null;
        this.waveMesh = null;
        this.enabled = true;
        this.visible = true;

        this.gridLat = options.gridLat ?? 24;
        this.gridLon = options.gridLon ?? 48;
        this.totalVectors = this.gridLat * this.gridLon;

        this.currentTailLength = 0.06;
        this.waveTailLength = 0.045;
        this.heightOffset = 0.015;
        this.maxCurrent = 60.0;
        this.maxWave = 1.0;

        this.showCurrents = true;
        this.showWaves = true;

        this.oceanTexture = null;
        this.weatherTexture = null;
        this.windField = null;
        this.windFieldW = 0;
        this.windFieldH = 0;
        this.planetRadius = 1.0;

        this._initGeometry();
    }

    _initGeometry() {
        this._disposeGeometry();

        this.currentMesh = this._createLineMesh(0.85);
        this.waveMesh = this._createLineMesh(0.9);

        this.currentMesh.visible = false;
        this.waveMesh.visible = false;

        this.planetGroup.add(this.currentMesh);
        this.planetGroup.add(this.waveMesh);
    }

    _disposeGeometry() {
        if (this.currentMesh) {
            this.planetGroup.remove(this.currentMesh);
            this.currentMesh.geometry.dispose();
            this.currentMesh.material.dispose();
        }
        if (this.waveMesh) {
            this.planetGroup.remove(this.waveMesh);
            this.waveMesh.geometry.dispose();
            this.waveMesh.material.dispose();
        }
        this.currentMesh = null;
        this.waveMesh = null;
    }

    _createLineMesh(opacity) {
        const positions = new Float32Array(this.totalVectors * 2 * 3);
        const colors = new Float32Array(this.totalVectors * 2 * 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity,
            depthTest: true,
            depthWrite: false
        });
        const mesh = new THREE.LineSegments(geometry, material);
        mesh.frustumCulled = false;
        mesh.renderOrder = 100;
        return mesh;
    }

    setOceanTexture(texture) {
        this.oceanTexture = texture;
    }

    setWeatherTexture(texture) {
        this.weatherTexture = texture;
    }

    setWindField(field, gridW, gridH) {
        this.windField = field;
        this.windFieldW = gridW || 0;
        this.windFieldH = gridH || 0;
    }

    setPlanetRadius(radius) {
        if (Number.isFinite(radius) && radius > 0) {
            this.planetRadius = radius;
        }
    }

    setConfig({
        showCurrents,
        showWaves,
        currentTailLength,
        waveTailLength,
        heightOffset,
        maxCurrent,
        maxWave,
        gridLat,
        gridLon,
        visible
    } = {}) {
        if (typeof showCurrents === 'boolean') this.showCurrents = showCurrents;
        if (typeof showWaves === 'boolean') this.showWaves = showWaves;
        if (Number.isFinite(currentTailLength)) this.currentTailLength = Math.max(0.01, currentTailLength);
        if (Number.isFinite(waveTailLength)) this.waveTailLength = Math.max(0.01, waveTailLength);
        if (Number.isFinite(heightOffset)) this.heightOffset = Math.max(0, heightOffset);
        if (Number.isFinite(maxCurrent)) this.maxCurrent = Math.max(0.1, maxCurrent);
        if (Number.isFinite(maxWave)) this.maxWave = Math.max(0.1, maxWave);
        if (typeof visible === 'boolean') this.visible = visible;

        const nextLat = Number.isFinite(gridLat) ? Math.max(4, Math.floor(gridLat)) : this.gridLat;
        const nextLon = Number.isFinite(gridLon) ? Math.max(4, Math.floor(gridLon)) : this.gridLon;
        if (nextLat !== this.gridLat || nextLon !== this.gridLon) {
            this.gridLat = nextLat;
            this.gridLon = nextLon;
            this.totalVectors = this.gridLat * this.gridLon;
            this._initGeometry();
        }

        if (this.currentMesh) this.currentMesh.visible = this.visible && this.showCurrents;
        if (this.waveMesh) this.waveMesh.visible = this.visible && this.showWaves;
    }

    _sampleWindField(u, v) {
        if (!this.windField || !this.windFieldW || !this.windFieldH) return [0, 0];
        const x = Math.min(this.windFieldW - 1, Math.max(0, Math.floor(u * this.windFieldW)));
        const y = Math.min(this.windFieldH - 1, Math.max(0, Math.floor(v * this.windFieldH)));
        const idx = (y * this.windFieldW + x) * 2;
        return [this.windField[idx] || 0, this.windField[idx + 1] || 0];
    }

    _sampleOceanNormal(u, v) {
        const data = this.oceanTexture?.image?.data;
        const width = this.oceanTexture?.image?.width ?? 0;
        const height = this.oceanTexture?.image?.height ?? 0;
        if (!data || !width || !height) return [0, 0];
        const x = Math.min(width - 1, Math.max(0, Math.floor(u * width)));
        const y = Math.min(height - 1, Math.max(0, Math.floor(v * height)));
        const idx = (y * width + x) * 4;
        const nx = ((data[idx + 1] ?? 128) / 255 - 0.5) * 2;
        const ny = ((data[idx + 2] ?? 128) / 255 - 0.5) * 2;
        return [nx, ny];
    }

    _samplePressure(u, v) {
        const data = this.weatherTexture?.image?.data;
        const width = this.weatherTexture?.image?.width ?? 0;
        const height = this.weatherTexture?.image?.height ?? 0;
        if (!data || !width || !height) return 0.5;
        const x = Math.min(width - 1, Math.max(0, Math.floor(u * width)));
        const y = Math.min(height - 1, Math.max(0, Math.floor(v * height)));
        const idx = (y * width + x) * 4;
        return (data[idx + 2] ?? 128) / 255;
    }

    update() {
        if (!this.enabled || !this.visible) return;

        const showCurrents = this.showCurrents && this.currentMesh;
        const showWaves = this.showWaves && this.waveMesh;
        if (!showCurrents && !showWaves) return;

        const currentPositions = showCurrents ? this.currentMesh.geometry.attributes.position.array : null;
        const currentColors = showCurrents ? this.currentMesh.geometry.attributes.color.array : null;
        const wavePositions = showWaves ? this.waveMesh.geometry.attributes.position.array : null;
        const waveColors = showWaves ? this.waveMesh.geometry.attributes.color.array : null;

        const radius = this.planetRadius * (1 + this.heightOffset);
        const currentTailScale = this.planetRadius * this.currentTailLength;
        const waveTailScale = this.planetRadius * this.waveTailLength;

        let idx = 0;
        for (let lat = 0; lat < this.gridLat; lat++) {
            const latAngle = ((lat + 0.5) / this.gridLat - 0.5) * Math.PI;
            const cosLat = Math.cos(latAngle);
            const sinLat = Math.sin(latAngle);
            const v = (lat + 0.5) / this.gridLat;

            for (let lon = 0; lon < this.gridLon; lon++) {
                const lonAngle = ((lon + 0.5) / this.gridLon - 0.5) * Math.PI * 2;
                const cosLon = Math.cos(lonAngle);
                const sinLon = Math.sin(lonAngle);
                const u = (lon + 0.5) / this.gridLon;

                const dx = cosLat * cosLon;
                const dy = sinLat;
                const dz = cosLat * sinLon;

                const eastX = -sinLon;
                const eastY = 0;
                const eastZ = cosLon;

                const northX = -sinLat * cosLon;
                const northY = cosLat;
                const northZ = -sinLat * sinLon;

                const startIdx = idx * 6;
                const pressure01 = this._samplePressure(u, v);

                if (showCurrents && currentPositions && currentColors) {
                    const [uVal, vVal] = this._sampleWindField(u, v);
                    const mag = Math.hypot(uVal, vVal);
                    let dirX = eastX * uVal + northX * vVal;
                    let dirY = eastY * uVal + northY * vVal;
                    let dirZ = eastZ * uVal + northZ * vVal;
                    const dirLen = Math.hypot(dirX, dirY, dirZ);
                    if (dirLen > 1e-6) {
                        dirX /= dirLen;
                        dirY /= dirLen;
                        dirZ /= dirLen;
                    } else {
                        dirX = 0;
                        dirY = 0;
                        dirZ = 0;
                    }

                    const t = Math.min(mag / this.maxCurrent, 1);
                    const tailLen = currentTailScale * Math.max(0.15, t);
                    currentPositions[startIdx + 0] = dx * radius;
                    currentPositions[startIdx + 1] = dy * radius;
                    currentPositions[startIdx + 2] = dz * radius;
                    currentPositions[startIdx + 3] = dx * radius + dirX * tailLen;
                    currentPositions[startIdx + 4] = dy * radius + dirY * tailLen;
                    currentPositions[startIdx + 5] = dz * radius + dirZ * tailLen;

                    let r;
                    let g;
                    let b;
                    if (pressure01 < 0.5) {
                        const p = pressure01 * 2;
                        r = 1.0;
                        g = p;
                        b = p;
                    } else {
                        const p = (pressure01 - 0.5) * 2;
                        r = 1.0 - p;
                        g = 1.0 - p;
                        b = 1.0;
                    }
                    const brightness = 0.35 + t * 0.65;
                    r *= brightness;
                    g *= brightness;
                    b *= brightness;
                    currentColors[startIdx + 0] = r;
                    currentColors[startIdx + 1] = g;
                    currentColors[startIdx + 2] = b;
                    currentColors[startIdx + 3] = r;
                    currentColors[startIdx + 4] = g;
                    currentColors[startIdx + 5] = b;
                }

                if (showWaves && wavePositions && waveColors) {
                    const [nx, ny] = this._sampleOceanNormal(u, v);
                    const mag = Math.hypot(nx, ny);
                    let dirX = eastX * nx + northX * ny;
                    let dirY = eastY * nx + northY * ny;
                    let dirZ = eastZ * nx + northZ * ny;
                    const dirLen = Math.hypot(dirX, dirY, dirZ);
                    if (dirLen > 1e-6) {
                        dirX /= dirLen;
                        dirY /= dirLen;
                        dirZ /= dirLen;
                    } else {
                        dirX = 0;
                        dirY = 0;
                        dirZ = 0;
                    }

                    const t = Math.min(mag / this.maxWave, 1);
                    const tailLen = waveTailScale * Math.max(0.1, t);
                    wavePositions[startIdx + 0] = dx * radius;
                    wavePositions[startIdx + 1] = dy * radius;
                    wavePositions[startIdx + 2] = dz * radius;
                    wavePositions[startIdx + 3] = dx * radius + dirX * tailLen;
                    wavePositions[startIdx + 4] = dy * radius + dirY * tailLen;
                    wavePositions[startIdx + 5] = dz * radius + dirZ * tailLen;

                    let r;
                    let g;
                    let b;
                    if (pressure01 < 0.5) {
                        const p = pressure01 * 2;
                        r = 1.0;
                        g = p;
                        b = p;
                    } else {
                        const p = (pressure01 - 0.5) * 2;
                        r = 1.0 - p;
                        g = 1.0 - p;
                        b = 1.0;
                    }
                    const brightness = 0.25 + t * 0.75;
                    r *= brightness;
                    g *= brightness;
                    b *= brightness;
                    waveColors[startIdx + 0] = r;
                    waveColors[startIdx + 1] = g;
                    waveColors[startIdx + 2] = b;
                    waveColors[startIdx + 3] = r;
                    waveColors[startIdx + 4] = g;
                    waveColors[startIdx + 5] = b;
                }

                idx++;
            }
        }

        if (showCurrents) {
            this.currentMesh.geometry.attributes.position.needsUpdate = true;
            this.currentMesh.geometry.attributes.color.needsUpdate = true;
        }
        if (showWaves) {
            this.waveMesh.geometry.attributes.position.needsUpdate = true;
            this.waveMesh.geometry.attributes.color.needsUpdate = true;
        }
    }

    setVisible(visible) {
        this.visible = visible;
        if (this.currentMesh) this.currentMesh.visible = visible && this.showCurrents;
        if (this.waveMesh) this.waveMesh.visible = visible && this.showWaves;
    }

    dispose() {
        this._disposeGeometry();
    }
}
