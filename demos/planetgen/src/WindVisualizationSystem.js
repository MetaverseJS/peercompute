import * as THREE from 'three';

/**
 * WindVisualizationSystem - Draws 3D wind tell-tails on the globe surface
 * Each line segment shows wind direction at that location, colored by pressure
 * Blue = high pressure (anticyclone), Red = low pressure (cyclone)
 */
export class WindVisualizationSystem {
    constructor(planetGroup) {
        this.planetGroup = planetGroup;
        this.mesh = null;
        this.enabled = true;
        this.visible = true;
        
        // Grid resolution (lat/lon cells)
        this.gridLat = 32;  // Latitude divisions
        this.gridLon = 64;  // Longitude divisions
        this.totalVectors = this.gridLat * this.gridLon;
        
        // Visual parameters
        this.tailLength = 0.08;      // Base length of wind tails (as fraction of planet radius)
        this.tailWidth = 2.0;        // Line width in pixels
        this.heightOffset = 0.02;    // How far above surface to draw vectors
        this.maxWind = 60.0;         // Max wind speed (m/s) for scaling
        
        // Cached textures
        this.weatherTexture = null;
        this.weatherAuxTexture = null;
        this.planetRadius = 1.0;
        
        this._initGeometry();
    }

    _initGeometry() {
        // Create line segments geometry
        // Each wind vector = 2 vertices (start and end point)
        const positions = new Float32Array(this.totalVectors * 2 * 3);  // 2 verts × 3 components
        const colors = new Float32Array(this.totalVectors * 2 * 3);     // RGB per vertex
        
        // Initialize positions on sphere surface in lat/lon grid
        let idx = 0;
        for (let lat = 0; lat < this.gridLat; lat++) {
            // Latitude from -π/2 to π/2 (south pole to north pole)
            const latAngle = ((lat + 0.5) / this.gridLat - 0.5) * Math.PI;
            const cosLat = Math.cos(latAngle);
            const sinLat = Math.sin(latAngle);
            
            for (let lon = 0; lon < this.gridLon; lon++) {
                // Longitude from -π to π
                const lonAngle = ((lon + 0.5) / this.gridLon - 0.5) * Math.PI * 2;
                const cosLon = Math.cos(lonAngle);
                const sinLon = Math.sin(lonAngle);
                
                // 3D position on unit sphere
                const x = cosLat * cosLon;
                const y = sinLat;
                const z = cosLat * sinLon;
                
                // Start point (slightly above surface)
                const startIdx = idx * 6;
                positions[startIdx + 0] = x;
                positions[startIdx + 1] = y;
                positions[startIdx + 2] = z;
                
                // End point (initially same as start - will be updated)
                positions[startIdx + 3] = x;
                positions[startIdx + 4] = y;
                positions[startIdx + 5] = z;
                
                // Initial color (neutral gray)
                colors[startIdx + 0] = 0.5;
                colors[startIdx + 1] = 0.5;
                colors[startIdx + 2] = 0.5;
                colors[startIdx + 3] = 0.5;
                colors[startIdx + 4] = 0.5;
                colors[startIdx + 5] = 0.5;
                
                idx++;
            }
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            linewidth: this.tailWidth,
            transparent: true,
            opacity: 0.9,
            depthTest: true,
            depthWrite: false
        });
        
        this.mesh = new THREE.LineSegments(geometry, material);
        this.mesh.renderOrder = 100;  // Render on top of planet
        this.mesh.frustumCulled = false;
        this.planetGroup.add(this.mesh);
    }

    /**
     * Set the weather textures to sample wind and pressure from
     */
    setWeatherTextures(weatherTexture, weatherAuxTexture) {
        this.weatherTexture = weatherTexture;
        this.weatherAuxTexture = weatherAuxTexture;
    }

    /**
     * Set the planet radius for proper scaling
     */
    setPlanetRadius(radius) {
        this.planetRadius = radius;
    }

    /**
     * Set visualization parameters
     */
    setConfig({ tailLength, gridLat, gridLon, heightOffset, enabled, visible } = {}) {
        if (typeof tailLength === 'number') this.tailLength = tailLength;
        if (typeof heightOffset === 'number') this.heightOffset = heightOffset;
        if (typeof enabled === 'boolean') this.enabled = enabled;
        if (typeof visible === 'boolean') {
            this.visible = visible;
            if (this.mesh) this.mesh.visible = visible;
        }
        // Note: changing grid resolution requires rebuilding geometry
        if ((gridLat && gridLat !== this.gridLat) || (gridLon && gridLon !== this.gridLon)) {
            this.gridLat = gridLat || this.gridLat;
            this.gridLon = gridLon || this.gridLon;
            this.totalVectors = this.gridLat * this.gridLon;
            this._rebuildGeometry();
        }
    }

    _rebuildGeometry() {
        if (this.mesh) {
            this.planetGroup.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        this._initGeometry();
    }

    /**
     * Sample weather texture at UV coordinates
     * Returns { r, g, b, a } as 0-255 values
     */
    _sampleTexture(texture, u, v) {
        if (!texture?.image?.data) return { r: 128, g: 128, b: 128, a: 128 };
        
        const data = texture.image.data;
        const width = texture.image.width;
        const height = texture.image.height;
        
        // Clamp UV coordinates
        const uu = Math.max(0, Math.min(1, u));
        const vv = Math.max(0, Math.min(1, v));
        
        const x = Math.floor(uu * (width - 1));
        const y = Math.floor(vv * (height - 1));
        const idx = (y * width + x) * 4;
        
        return {
            r: data[idx] || 0,
            g: data[idx + 1] || 0,
            b: data[idx + 2] || 0,
            a: data[idx + 3] || 0
        };
    }

    /**
     * Update wind vectors from weather textures
     * Call this each frame after weather simulation updates
     */
    update() {
        if (!this.enabled || !this.mesh || !this.visible) return;
        if (!this.weatherTexture?.image?.data || !this.weatherAuxTexture?.image?.data) return;
        
        const positions = this.mesh.geometry.attributes.position.array;
        const colors = this.mesh.geometry.attributes.color.array;
        
        const radius = this.planetRadius * (1 + this.heightOffset);
        const tailScale = this.planetRadius * this.tailLength;
        
        let idx = 0;
        for (let lat = 0; lat < this.gridLat; lat++) {
            const latAngle = ((lat + 0.5) / this.gridLat - 0.5) * Math.PI;
            const cosLat = Math.cos(latAngle);
            const sinLat = Math.sin(latAngle);
            
            // V coordinate for texture sampling
            const v = (lat + 0.5) / this.gridLat;
            
            for (let lon = 0; lon < this.gridLon; lon++) {
                const lonAngle = ((lon + 0.5) / this.gridLon - 0.5) * Math.PI * 2;
                const cosLon = Math.cos(lonAngle);
                const sinLon = Math.sin(lonAngle);
                
                // U coordinate for texture sampling
                const u = (lon + 0.5) / this.gridLon;
                
                // 3D direction on unit sphere
                const dx = cosLat * cosLon;
                const dy = sinLat;
                const dz = cosLat * sinLon;
                
                // Sample weather texture for pressure (B channel)
                const weather = this._sampleTexture(this.weatherTexture, u, v);
                const pressure01 = weather.b / 255;  // 0.5 = neutral, <0.5 = low, >0.5 = high
                
                // Sample aux texture for wind direction (B=windU, A=windV)
                const aux = this._sampleTexture(this.weatherAuxTexture, u, v);
                const windU = (aux.b / 255 - 0.5) * 2.0;  // -1 to 1 (east/west)
                const windV = (aux.a / 255 - 0.5) * 2.0;  // -1 to 1 (north/south)
                
                // Convert wind U/V to 3D world direction
                // East vector (tangent to sphere, pointing east)
                const eastX = -sinLon;
                const eastY = 0;
                const eastZ = cosLon;
                
                // North vector (tangent to sphere, pointing north)
                const northX = -sinLat * cosLon;
                const northY = cosLat;
                const northZ = -sinLat * sinLon;
                
                // Wind direction in 3D
                const windMag = Math.sqrt(windU * windU + windV * windV);
                let windDirX = eastX * windU + northX * windV;
                let windDirY = eastY * windU + northY * windV;
                let windDirZ = eastZ * windU + northZ * windV;
                
                // Normalize wind direction
                const windLen = Math.sqrt(windDirX * windDirX + windDirY * windDirY + windDirZ * windDirZ);
                if (windLen > 0.001) {
                    windDirX /= windLen;
                    windDirY /= windLen;
                    windDirZ /= windLen;
                }
                
                // Start point (on sphere surface)
                const startIdx = idx * 6;
                positions[startIdx + 0] = dx * radius;
                positions[startIdx + 1] = dy * radius;
                positions[startIdx + 2] = dz * radius;
                
                // End point (start + wind direction * length scaled by wind magnitude)
                const tailLen = tailScale * Math.max(0.3, windMag);
                positions[startIdx + 3] = dx * radius + windDirX * tailLen;
                positions[startIdx + 4] = dy * radius + windDirY * tailLen;
                positions[startIdx + 5] = dz * radius + windDirZ * tailLen;
                
                // Color by pressure: Red = low pressure, Blue = high pressure
                // Interpolate: 0 (low) -> red, 0.5 (neutral) -> white, 1 (high) -> blue
                let r, g, b;
                if (pressure01 < 0.5) {
                    // Low pressure: red (0) to white (0.5)
                    const t = pressure01 * 2;  // 0 to 1
                    r = 1.0;
                    g = t;
                    b = t;
                } else {
                    // High pressure: white (0.5) to blue (1)
                    const t = (pressure01 - 0.5) * 2;  // 0 to 1
                    r = 1.0 - t;
                    g = 1.0 - t;
                    b = 1.0;
                }
                
                // Brighten based on wind magnitude
                const brightness = 0.4 + windMag * 0.6;
                r *= brightness;
                g *= brightness;
                b *= brightness;
                
                // Set colors for both vertices (start and end)
                colors[startIdx + 0] = r;
                colors[startIdx + 1] = g;
                colors[startIdx + 2] = b;
                colors[startIdx + 3] = r;
                colors[startIdx + 4] = g;
                colors[startIdx + 5] = b;
                
                idx++;
            }
        }
        
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.attributes.color.needsUpdate = true;
    }

    /**
     * Toggle visibility
     */
    setVisible(visible) {
        this.visible = visible;
        if (this.mesh) this.mesh.visible = visible;
    }

    /**
     * Clean up resources
     */
    dispose() {
        if (this.mesh) {
            this.planetGroup.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
    }
}
