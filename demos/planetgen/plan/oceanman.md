Ocean Simulation System Specification
Physically-Based Ocean Dynamics for WebGPU
Executive Summary
A multi-scale ocean simulation system implementing physically accurate currents, wave dynamics, and thermal modeling using WebGPU compute pipelines with adaptive LOD and quality scaling for real-time performance across varied hardware capabilities.

1. Physical Models
1.1 Ocean Currents (Navier-Stokes Based)
Governing Equations:
∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u + f
∇·u = 0  (incompressibility)
Where:

u = velocity field (3D vector)
p = pressure
ρ = density
ν = kinematic viscosity
f = external forces (Coriolis, wind stress, buoyancy)

Implementation Strategy:

2D Shallow Water Approximation for large-scale currents (100m - 10km scale)
3D Stratified Flow for depth-dependent circulation
Vorticity-based formulation for computational efficiency

Discretization:

Staggered grid (MAC grid) for stability
Semi-Lagrangian advection for large time steps
Pressure projection method for incompressibility

1.2 Wave Dynamics
Multi-Scale Approach:
A. Large-Scale Waves (FFT-based Spectrum)

Jerry Tessendorf's ocean model (industry standard)
Statistical wave spectrum: Phillips spectrum + JONSWAP modifications

  P(k) = A * exp(-1/(kL)²) / k⁴ * exp(-|k/k_peak|²)

Dispersion relation: ω = √(g|k| * tanh(|k|h))
Time evolution via inverse FFT

B. Mid-Scale Waves (Gerstner Waves)

Parametric wave packets for visual detail
Trochoidal motion for realistic crests
8-16 wave components with varying directions

C. Small-Scale Detail (Procedural)

Perlin/Simplex noise for surface detail
Normal map synthesis
Foam and spray generation

1.3 Temperature Dynamics
Heat Equation with Advection:
∂T/∂t + u·∇T = κ∇²T + Q
Where:

T = temperature field
κ = thermal diffusivity
Q = heat sources/sinks (solar radiation, evaporation)

Stratification Model:

Thermocline layer modeling (exponential profile)
Vertical mixing from wind and waves
Seasonal variation support

Heat Transfer Components:

Solar radiation absorption (Beer-Lambert law)
Longwave radiation
Sensible and latent heat flux
Evaporative cooling


2. WebGPU Compute Architecture
2.1 Pipeline Structure
┌─────────────────────────────────────┐
│   Simulation Manager (CPU/JS)       │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐         │
│  │ Quality  │  │ LOD      │         │
│  │ Detector │  │ Manager  │         │
│  └──────────┘  └──────────┘         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     WebGPU Compute Pipelines        │
├─────────────────────────────────────┤
│  ┌──────────────────────────┐       │
│  │  Current Solver          │       │
│  │  - Advection             │       │
│  │  - Diffusion             │       │
│  │  - Pressure Projection   │       │
│  └──────────────────────────┘       │
│  ┌──────────────────────────┐       │
│  │  Wave Simulator          │       │
│  │  - FFT (spectrum)        │       │
│  │  - Wave packets          │       │
│  │  - Height field update   │       │
│  └──────────────────────────┘       │
│  ┌──────────────────────────┐       │
│  │  Thermal Solver          │       │
│  │  - Heat advection        │       │
│  │  - Diffusion             │       │
│  │  - Surface exchange      │       │
│  └──────────────────────────┘       │
│  ┌──────────────────────────┐       │
│  │  Coupling & Interaction  │       │
│  │  - Wind → waves          │       │
│  │  - Temp → density        │       │
│  │  - Waves → foam          │       │
│  └──────────────────────────┘       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Rendering Pipeline              │
├─────────────────────────────────────┤
│  ┌──────────────────────────┐       │
│  │  Geometry Generation     │       │
│  │  - Tessellation/LOD mesh │       │
│  │  - Displacement mapping  │       │
│  └──────────────────────────┘       │
│  ┌──────────────────────────┐       │
│  │  Shading                 │       │
│  │  - PBR ocean material    │       │
│  │  - Subsurface scattering │       │
│  │  - Caustics              │       │
│  └──────────────────────────┘       │
└─────────────────────────────────────┘
2.2 Compute Shader Organization
Buffer Layout:
wgsl// Primary simulation state
struct OceanState {
    velocity: array<vec3f>,      // 3D velocity field
    pressure: array<f32>,         // Pressure field
    temperature: array<f32>,      // Temperature field
    height: array<f32>,           // Surface height displacement
    foam: array<f32>,             // Foam/whitecap coverage
}

// Wave spectrum (FFT domain)
struct WaveSpectrum {
    h0: array<vec2f>,             // Initial spectrum (complex)
    ht: array<vec2f>,             // Time-evolved spectrum
    displacement: array<vec3f>,   // 3D displacement field
}

// Grid parameters
struct GridParams {
    resolution: vec3u,            // Grid dimensions (x, y, z)
    cell_size: vec3f,             // Physical cell size
    time: f32,
    dt: f32,
}
Shader Stages:

Advection Shader (advect.wgsl)

wgsl   @compute @workgroup_size(8, 8, 4)
   fn advect_velocity(
       @builtin(global_invocation_id) id: vec3u,
       @group(0) @binding(0) var<storage, read> velocity_in: array<vec3f>,
       @group(0) @binding(1) var<storage, read_write> velocity_out: array<vec3f>,
   )

Diffusion Shader (diffuse.wgsl)

Jacobi iteration for implicit diffusion
Multi-grid solver for faster convergence


Pressure Projection (project.wgsl)

Divergence calculation
Poisson solver (Jacobi/Gauss-Seidel)
Gradient subtraction


FFT Wave Shader (waves_fft.wgsl)

Cooley-Tukey FFT implementation
Butterfly pattern for GPU efficiency
2D → 1D transform decomposition


Temperature Update (thermal.wgsl)

Heat advection
Diffusion + source terms



2.3 Data Structures
Grid Hierarchy:
javascriptclass OceanGrid {
  levels: [
    { resolution: 1024, cellSize: 10.0 },   // LOD 0: High detail
    { resolution: 512,  cellSize: 20.0 },   // LOD 1: Medium
    { resolution: 256,  cellSize: 40.0 },   // LOD 2: Low
  ]
}
Buffer Management:
javascriptclass SimulationBuffers {
  // Ping-pong buffers for temporal schemes
  velocityBuffers: [GPUBuffer, GPUBuffer],
  pressureBuffers: [GPUBuffer, GPUBuffer],
  temperatureBuffers: [GPUBuffer, GPUBuffer],
  
  // Wave data
  spectrumBuffer: GPUBuffer,
  heightFieldBuffer: GPUBuffer,
  
  // Read-only parameters
  uniformBuffer: GPUBuffer,
}

3. Scalability System
3.1 Quality Levels
Ultra (High-end GPUs: RTX 4080+, M3 Max+)

Grid: 1024×1024 surface, 32 depth layers
FFT: 512×512 spectrum
Time step: 1/120s
Wave components: 16 Gerstner waves
Features: Full 3D currents, subsurface scattering, caustics

High (Mid-range: RTX 3060, M1 Pro)

Grid: 512×512 surface, 16 depth layers
FFT: 256×256 spectrum
Time step: 1/60s
Wave components: 8 Gerstner waves
Features: 2.5D currents, simplified lighting

Medium (Entry-level: GTX 1660, Integrated)

Grid: 256×256 surface, 8 depth layers
FFT: 128×128 spectrum
Time step: 1/30s
Wave components: 4 Gerstner waves
Features: 2D currents, basic shading

Low (Mobile, Older hardware)

Grid: 128×128 surface, simplified
FFT: 64×64 spectrum (or pre-baked)
Time step: 1/30s (or lower)
Wave components: 2 Gerstner waves
Features: Height field only, simple normals

3.2 Adaptive LOD Strategy
Distance-Based Tessellation:
javascriptfunction calculateLOD(cameraPos, chunkPos, maxDistance) {
  const distance = length(cameraPos - chunkPos);
  const lodLevel = floor(log2(distance / maxDistance));
  return clamp(lodLevel, 0, MAX_LOD);
}
Chunk System:

Divide ocean into tiles (e.g., 64×64 cells per chunk)
Simulate high-detail near camera
Reduce resolution with distance
Seamless blending at boundaries

Dynamic Resolution Scaling:
javascriptclass PerformanceMonitor {
  targetFrameTime = 16.67; // 60 FPS
  
  adjustQuality() {
    if (avgFrameTime > targetFrameTime * 1.2) {
      reduceQuality();
    } else if (avgFrameTime < targetFrameTime * 0.8) {
      increaseQuality();
    }
  }
}
3.3 Workgroup Size Optimization
GPU Architecture Adaptation:
wgsl// Desktop GPUs: larger workgroups
@compute @workgroup_size(16, 16, 1)

// Mobile GPUs: smaller workgroups for better occupancy
@compute @workgroup_size(8, 8, 1)
Device Detection:
javascriptconst limits = adapter.limits;
const workgroupSize = limits.maxComputeWorkgroupSizeX >= 16 ? 16 : 8;

4. Real-Time Rendering
4.1 Geometry Generation
Approach 1: Tessellated Plane
wgsl// Vertex shader with displacement
@vertex
fn vs_main(@location(0) pos: vec2f) -> VertexOutput {
    let worldPos = vec3f(pos.x, 0.0, pos.y);
    
    // Sample height field
    let h = sampleHeight(worldPos.xz);
    let displaced = worldPos + vec3f(0.0, h, 0.0);
    
    // Sample FFT displacement
    let fftDisp = sampleFFTDisplacement(worldPos.xz);
    let finalPos = displaced + fftDisp;
    
    return VertexOutput(
        position: projection * view * vec4f(finalPos, 1.0),
        worldPos: finalPos,
    );
}
Approach 2: Compute-Generated Mesh

Generate vertices in compute shader
Indirect draw calls
Frustum culling in compute

4.2 Ocean Shading Model
Fragment Shader Structure:
wgsl@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4f {
    // Normal calculation (from height field)
    let normal = calculateNormal(in.worldPos);
    
    // Fresnel effect
    let F = fresnel(viewDir, normal, 0.02);
    
    // Reflection
    let reflection = sampleSkybox(reflect(-viewDir, normal));
    
    // Refraction with chromatic aberration
    let refraction = sampleRefraction(in.worldPos, normal);
    
    // Subsurface scattering
    let sss = subsurfaceScatter(in.worldPos, normal, lightDir);
    
    // Foam
    let foam = sampleFoam(in.worldPos);
    
    // Combine
    let color = mix(refraction, reflection, F) + sss + foam;
    
    return vec4f(color, 1.0);
}
Physical Parameters:

Index of refraction: 1.333 (water)
Absorption: RGB wavelength-dependent (red absorbed first)
Scattering: Mie + Rayleigh for realistic color
Foam albedo: 0.95 (nearly white)

4.3 Visual Effects
Caustics:

Ray-march through water volume
Project distorted light patterns
Pre-compute caustic textures for performance

Foam Generation:
wgsl// Jacobian determinant for wave breaking
fn calculateFoam(pos: vec3f) -> f32 {
    let J = jacobianDeterminant(pos);
    let foam = saturate(-J * foamStrength);
    
    // Decay over time
    return foam * exp(-foamDecay * dt);
}
Spray Particles:

Particle system triggered by wave peaks
GPU-based particle simulation
Additive blending


5. Performance Optimizations
5.1 Compute Optimization
Memory Access Patterns:
wgsl// Use shared memory for neighboring cell access
var<workgroup> shared_data: array<vec3f, 256>;

@compute @workgroup_size(16, 16)
fn optimized_kernel(
    @builtin(local_invocation_id) local_id: vec3u,
    @builtin(workgroup_id) group_id: vec3u,
) {
    // Load to shared memory
    let global_id = group_id.xy * 16u + local_id.xy;
    shared_data[local_id.y * 16u + local_id.x] = 
        velocity[global_id.y * width + global_id.x];
    
    workgroupBarrier();
    
    // Access neighbors from shared memory (faster)
    let left = shared_data[local_id.y * 16u + (local_id.x - 1u)];
    // ...
}
FFT Optimization:

Radix-2/4/8 FFT for power-of-2 grids
Stockham auto-sort algorithm (no bit reversal)
Half-precision for intermediate results

Temporal Coherence:

Cache FFT spectrum calculations
Update only changed parameters
Incremental simulation updates

5.2 Bandwidth Reduction
Compression:

Half-float (fp16) where appropriate
Packed normals (octahedral encoding)
Sparse storage for uniform regions

Culling:

Frustum culling in compute shader
Occlusion culling for underwater geometry
Distance-based LOD

5.3 Parallel Execution
Pipeline Stages:
javascript// Overlap compute and rendering
async function simulationLoop() {
  // Submit compute work
  const computePass = encoder.beginComputePass();
  computePass.setPipeline(advectionPipeline);
  computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
  computePass.end();
  
  // Start rendering immediately (GPU can overlap)
  const renderPass = encoder.beginRenderPass(desc);
  // ... rendering commands
  renderPass.end();
  
  device.queue.submit([encoder.finish()]);
}

6. Implementation Phases
Phase 1: Foundation (2-3 weeks)

 Basic grid structure and buffers
 Simple FFT-based wave simulation
 Basic visualization
 Performance monitoring system

Phase 2: Currents (2 weeks)

 2D shallow water equations
 Velocity advection
 Pressure solver
 Wind forcing

Phase 3: Temperature (1 week)

 Heat equation solver
 Solar radiation
 Thermal coupling with density

Phase 4: Advanced Waves (2 weeks)

 Gerstner wave overlay
 Foam generation
 Wave breaking detection

Phase 5: Rendering (2 weeks)

 PBR ocean shader
 Subsurface scattering
 Caustics
 Spray particles

Phase 6: Optimization (2 weeks)

 LOD system
 Quality scaling
 Mobile optimization
 Performance profiling

Phase 7: Polish (1 week)

 Parameter tuning
 Edge cases
 Documentation


7. Validation & Testing
7.1 Physical Validation
Wave Dispersion:

Compare to analytical dispersion relation
Verify wave propagation speed

Conservation Laws:

Mass conservation (divergence-free)
Energy conservation (wave energy spectrum)
Momentum conservation

Benchmark Scenarios:

Kelvin-Helmholtz instability
Wind-driven circulation
Thermal stratification

7.2 Performance Benchmarks
Target Metrics:

60 FPS @ 1080p (High quality)
30 FPS @ 1080p (Ultra quality)
60 FPS @ 720p (Medium on mobile)

Profiling Points:

Compute shader timings
Memory bandwidth usage
Frame budget breakdown


8. Configuration API
javascriptconst oceanConfig = {
  simulation: {
    grid: {
      surfaceResolution: 512,
      depthLayers: 16,
      physicalSize: 10000.0, // meters
    },
    
    waves: {
      enabled: true,
      fftSize: 256,
      windSpeed: 15.0,        // m/s
      windDirection: [1, 0],
      waveAge: 0.84,          // JONSWAP parameter
      gerstnerWaves: 8,
    },
    
    currents: {
      enabled: true,
      viscosity: 1e-6,        // m²/s
      timestep: 0.016,        // seconds
      coriolisForce: true,
      latitude: 45.0,
    },
    
    temperature: {
      enabled: true,
      thermalDiffusivity: 1.4e-7, // m²/s
      solarRadiation: 1000.0, // W/m²
      thermoclineDepth: 100.0,// meters
    },
  },
  
  rendering: {
    quality: 'auto',          // 'low'|'medium'|'high'|'ultra'|'auto'
    lodLevels: 4,
    maxDrawDistance: 50000.0,
    subsurfaceScattering: true,
    caustics: true,
    foam: true,
  },
  
  performance: {
    targetFPS: 60,
    adaptiveQuality: true,
    maxComputeTime: 10.0,   // ms per frame
  }
};
```

---

## 9. References & Resources

**Physical Oceanography:**
- Cushman-Roisin & Beckers: "Introduction to Geophysical Fluid Dynamics"
- Vallis: "Atmospheric and Oceanic Fluid Dynamics"

**Wave Modeling:**
- Tessendorf: "Simulating Ocean Water" (SIGGRAPH 2001)
- Horvath: "Empirical directional wave spectra for computer graphics"

**WebGPU:**
- WebGPU Specification: https://www.w3.org/TR/webgpu/
- WGSL Specification: https://www.w3.org/TR/WGSL/

**FFT Algorithms:**
- Cooley-Tukey: "An algorithm for the machine calculation of complex Fourier series"
- Stockham: "High-speed convolution and correlation"

---

## 10. Code Structure Example
```
ocean-sim/
├── src/
│   ├── simulation/
│   │   ├── OceanSimulator.ts
│   │   ├── GridManager.ts
│   │   ├── CurrentSolver.ts
│   │   ├── WaveSimulator.ts
│   │   ├── ThermalSolver.ts
│   │   └── FFTCompute.ts
│   ├── rendering/
│   │   ├── OceanRenderer.ts
│   │   ├── OceanMaterial.ts
│   │   └── LODManager.ts
│   ├── shaders/
│   │   ├── compute/
│   │   │   ├── advect.wgsl
│   │   │   ├── diffuse.wgsl
│   │   │   ├── project.wgsl
│   │   │   ├── waves_fft.wgsl
│   │   │   └── thermal.wgsl
│   │   └── render/
│   │       ├── ocean.vert.wgsl
│   │       ├── ocean.frag.wgsl
│   │       └── foam.wgsl
│   ├── utils/
│   │   ├── PerformanceMonitor.ts
│   │   ├── BufferManager.ts
│   │   └── DeviceCapabilities.ts
│   └── main.ts
├── tests/
│   ├── physical-validation.test.ts
│   └── performance.test.ts
└── examples/
    ├── basic-ocean.html
    └── full-simulation.html

This specification provides a complete blueprint for implementing a physically-based ocean simulation system. The modular architecture allows for incremental development while maintaining scalability across hardware capabilities. Start with Phase 1 (FFT waves) for immediate visual results, then layer