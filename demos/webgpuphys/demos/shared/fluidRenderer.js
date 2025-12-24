// Fluid Rendering implementation (Screen Space Fluid)
// Ported from WebGPU-Ocean/render/fluidRender.ts

const FULL_SCREEN_WGSL = /* wgsl */ `
struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(0) uv : vec2f,
  @location(1) iuv : vec2f,
}

override screenWidth: f32;
override screenHeight: f32;

@vertex
fn vs(@builtin(vertex_index) vertex_index : u32) -> VertexOutput {
    var out: VertexOutput;
    var pos = array(
        vec2( 1.0,  1.0), vec2( 1.0, -1.0), vec2(-1.0, -1.0),
        vec2( 1.0,  1.0), vec2(-1.0, -1.0), vec2(-1.0,  1.0),
    );
    var uv = array(
        vec2(1.0, 0.0), vec2(1.0, 1.0), vec2(0.0, 1.0),
        vec2(1.0, 0.0), vec2(0.0, 1.0), vec2(0.0, 0.0),
    );
    out.position = vec4(pos[vertex_index], 0.0, 1.0);
    out.uv = uv[vertex_index];
    out.iuv = out.uv * vec2f(screenWidth, screenHeight);
    return out;
}
`;

const DEPTH_MAP_WGSL = /* wgsl */ `
struct VertexOutput {
    @builtin(position) position: vec4f, 
    @location(0) uv: vec2f, 
    @location(1) view_position: vec3f, 
}
struct FragmentInput {
    @location(0) uv: vec2f, 
    @location(1) view_position: vec3f, 
}
struct FragmentOutput {
    @location(0) frag_color: vec4f, 
    @builtin(frag_depth) frag_depth: f32, 
}
struct RenderUniforms {
    texel_size: vec2f, 
    sphere_size: f32, 
    inv_projection_matrix: mat4x4f, 
    projection_matrix: mat4x4f, 
    view_matrix: mat4x4f, 
    inv_view_matrix: mat4x4f, 
}
struct PosVel {
    position: vec3f, 
    v: vec3f, 
}
@group(0) @binding(0) var<storage> particles: array<PosVel>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;

@vertex
fn vs(@builtin(vertex_index) vertex_index: u32, @builtin(instance_index) instance_index: u32) -> VertexOutput {
    var corner_positions = array(
        vec2(0.5, 0.5), vec2(0.5, -0.5), vec2(-0.5, -0.5),
        vec2(0.5, 0.5), vec2(-0.5, -0.5), vec2(-0.5, 0.5),
    );
    let corner = vec3(corner_positions[vertex_index] * uniforms.sphere_size, 0.0);
    let uv = corner_positions[vertex_index] + 0.5;
    let real_position = particles[instance_index].position;
    let view_position = (uniforms.view_matrix * vec4f(real_position, 1.0)).xyz;
    let out_position = uniforms.projection_matrix * vec4f(view_position + corner, 1.0);
    return VertexOutput(out_position, uv, view_position);
}

@fragment
fn fs(input: FragmentInput) -> FragmentOutput {
    var out: FragmentOutput;
    var normalxy: vec2f = input.uv * 2.0 - 1.0;
    var r2: f32 = dot(normalxy, normalxy);
    if (r2 > 1.0) { discard; }
    var normalz = sqrt(1.0 - r2);
    var normal = vec3(normalxy, normalz);
    var radius = uniforms.sphere_size / 2.0;
    var real_view_pos: vec4f = vec4f(input.view_position + normal * radius, 1.0);
    var clip_space_pos: vec4f = uniforms.projection_matrix * real_view_pos;
    out.frag_depth = clip_space_pos.z / clip_space_pos.w;
    out.frag_color = vec4(real_view_pos.z, 0.0, 0.0, 1.0);
    return out;
}
`;

const BILATERAL_WGSL = /* wgsl */ `
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> uniforms: FilterUniforms;

struct FragmentInput {
    @location(0) uv: vec2f,  
    @location(1) iuv: vec2f
}
override depth_threshold: f32;
override projected_particle_constant: f32;
override max_filter_size: f32;
struct FilterUniforms {
    blur_dir: vec2f,
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    var depth: f32 = abs(textureLoad(texture, vec2u(input.iuv), 0).r);
    if (depth >= 1e4 || depth <= 0.0) {
        return vec4f(vec3f(depth), 1.0);
    }
    var filter_size: i32 = min(i32(max_filter_size), i32(ceil(projected_particle_constant / depth)));
    var sigma: f32 = f32(filter_size) / 3.0; 
    var two_sigma: f32 = 2.0 * sigma * sigma;
    var sigma_depth: f32 = depth_threshold / 3.0;
    var two_sigma_depth: f32 = 2.0 * sigma_depth * sigma_depth;

    var sum: f32 = 0.0;
    var wsum: f32 = 0.0;
    for (var x: i32 = -filter_size; x <= filter_size; x++) {
        var coords: vec2f = vec2f(f32(x));
        var sampled_depth: f32 = abs(textureLoad(texture, vec2u(input.iuv + coords * uniforms.blur_dir), 0).r);
        var rr: f32 = dot(coords, coords);
        var w: f32 = exp(-rr / two_sigma);
        var r_depth: f32 = sampled_depth - depth;
        var wd: f32 = exp(-r_depth * r_depth / two_sigma_depth);
        sum += sampled_depth * w * wd;
        wsum += w * wd;
    }
    if (wsum > 0.0) { sum /= wsum; }
    return vec4f(sum, 0.0, 0.0, 1.0);
}
`;

const THICKNESS_MAP_WGSL = /* wgsl */ `
struct RenderUniforms {
    texel_size: vec2f, sphere_size: f32,
    inv_projection_matrix: mat4x4f, projection_matrix: mat4x4f,
    view_matrix: mat4x4f, inv_view_matrix: mat4x4f,
}
struct VertexOutput {
    @builtin(position) position: vec4f, 
    @location(0) uv: vec2f, 
}
struct FragmentInput { @location(0) uv: vec2f, }
struct PosVel { position: vec3f, materialType: f32, velocity: vec3f, temperature: f32, }
@group(0) @binding(0) var<storage> particles: array<PosVel>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;

@vertex
fn vs(@builtin(vertex_index) vertex_index: u32, @builtin(instance_index) instance_index: u32) -> VertexOutput {
    var corner_positions = array(
        vec2(0.5, 0.5), vec2(0.5, -0.5), vec2(-0.5, -0.5),
        vec2(0.5, 0.5), vec2(-0.5, -0.5), vec2(-0.5, 0.5),
    );
    let corner = vec3(corner_positions[vertex_index] * uniforms.sphere_size, 0.0);
    let uv = corner_positions[vertex_index] + 0.5;
    let real_position = particles[instance_index].position;
    let view_position = (uniforms.view_matrix * vec4f(real_position, 1.0)).xyz;
    let out_position = uniforms.projection_matrix * vec4f(view_position + corner, 1.0);
    return VertexOutput(out_position, uv);
}

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    var normalxy: vec2f = input.uv * 2.0 - 1.0;
    var r2: f32 = dot(normalxy, normalxy);
    if (r2 > 1.0) { discard; }
    var thickness: f32 = sqrt(1.0 - r2);
    let particle_alpha = 0.05;
    return vec4f(vec3f(particle_alpha * thickness), 1.0);
}
`;

const MATERIAL_MAP_WGSL = /* wgsl */ `
struct RenderUniforms {
    texel_size: vec2f, sphere_size: f32,
    inv_projection_matrix: mat4x4f, projection_matrix: mat4x4f,
    view_matrix: mat4x4f, inv_view_matrix: mat4x4f,
}
struct VertexOutput {
    @builtin(position) position: vec4f, 
    @location(0) uv: vec2f, 
    @location(1) view_position: vec3f,
    @location(2) @interpolate(flat) materialType: f32,
    @location(3) @interpolate(flat) temperature: f32,
}
struct FragmentInput { 
    @location(0) uv: vec2f, 
    @location(1) view_position: vec3f,
    @location(2) @interpolate(flat) materialType: f32,
    @location(3) @interpolate(flat) temperature: f32,
}
struct FragmentOutput {
    @location(0) frag_color: vec4f,
    @builtin(frag_depth) frag_depth: f32,
}
struct PosVel { position: vec3f, materialType: f32, velocity: vec3f, temperature: f32, }
@group(0) @binding(0) var<storage> particles: array<PosVel>;
@group(0) @binding(1) var<uniform> uniforms: RenderUniforms;

@vertex
fn vs(@builtin(vertex_index) vertex_index: u32, @builtin(instance_index) instance_index: u32) -> VertexOutput {
    var corner_positions = array(
        vec2(0.5, 0.5), vec2(0.5, -0.5), vec2(-0.5, -0.5),
        vec2(0.5, 0.5), vec2(-0.5, -0.5), vec2(-0.5, 0.5),
    );
    let corner = vec3(corner_positions[vertex_index] * uniforms.sphere_size, 0.0);
    let uv = corner_positions[vertex_index] + 0.5;
    let p = particles[instance_index];
    let view_position = (uniforms.view_matrix * vec4f(p.position, 1.0)).xyz;
    let out_position = uniforms.projection_matrix * vec4f(view_position + corner, 1.0);
    return VertexOutput(out_position, uv, view_position, p.materialType, p.temperature);
}

@fragment
fn fs(input: FragmentInput) -> FragmentOutput {
    var out: FragmentOutput;
    var normalxy: vec2f = input.uv * 2.0 - 1.0;
    var r2: f32 = dot(normalxy, normalxy);
    if (r2 > 1.0) { discard; }
    var normalz = sqrt(1.0 - r2);
    var normal = vec3(normalxy, normalz);
    var radius = uniforms.sphere_size / 2.0;
    var real_view_pos: vec4f = vec4f(input.view_position + normal * radius, 1.0);
    var clip_space_pos: vec4f = uniforms.projection_matrix * real_view_pos;
    out.frag_depth = clip_space_pos.z / clip_space_pos.w;
    // Output material type in R, temperature (normalized later) in G
    let tNorm = clamp(input.temperature / 10000.0, 0.0, 1.0);
    out.frag_color = vec4f(input.materialType, tNorm, 0.0, 1.0);
    return out;
}
`;

const GAUSSIAN_WGSL = /* wgsl */ `
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> uniforms: FilterUniforms;
struct FragmentInput { @location(0) uv: vec2f, @location(1) iuv: vec2f }
struct FilterUniforms { blur_dir: vec2f, }

@fragment
fn fs(input: FragmentInput) -> @location(0) vec4f {
    var thickness: f32 = textureLoad(texture, vec2u(input.iuv), 0).r;
    if (thickness == 0.0) { return vec4f(0.0, 0.0, 0.0, 1.0); }
    var filter_size: i32 = 30; 
    var sigma: f32 = f32(filter_size) / 3.0;
    var two_sigma: f32 = 2.0 * sigma * sigma;
    var sum = 0.0; var wsum = 0.0;
    for (var x: i32 = -filter_size; x <= filter_size; x++) {
        var coords: vec2f = vec2f(f32(x));
        var sampled_thickness: f32 = textureLoad(texture, vec2u(input.iuv + uniforms.blur_dir * coords), 0).r;
        var w: f32 = exp(-coords.x * coords.x / two_sigma);
        sum += sampled_thickness * w;
        wsum += w;
    }
    sum /= wsum;
    return vec4f(sum, 0.0, 0.0, 1.0);
}
`;

const FLUID_WGSL = /* wgsl */ `
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> uniforms: RenderUniforms;
@group(0) @binding(3) var thickness_texture: texture_2d<f32>;
@group(0) @binding(4) var material_texture: texture_2d<f32>;

struct RenderUniforms {
    texel_size: vec2f, sphere_size: f32,
    inv_projection_matrix: mat4x4f, projection_matrix: mat4x4f,
    view_matrix: mat4x4f, inv_view_matrix: mat4x4f,
}
struct FragmentInput { @location(0) uv: vec2f, @location(1) iuv: vec2f, }

struct FragmentOutput {
    @location(0) color: vec4f,
    @builtin(frag_depth) depth: f32,
}

// Material type constants
const MATERIAL_BRITTLE_SOLID: f32 = 0.0;  // Ice
const MATERIAL_ELASTIC_SOLID: f32 = 1.0;  // Rubber
// Element IDs (0..10) map to colors in getMaterialColor

fn computeViewPosFromUVDepth(tex_coord: vec2f, depth: f32) -> vec3f {
    var ndc: vec4f = vec4f(tex_coord.x * 2.0 - 1.0, 1.0 - 2.0 * tex_coord.y, 0.0, 1.0);
    ndc.z = -uniforms.projection_matrix[2].z + uniforms.projection_matrix[3].z / depth;
    ndc.w = 1.0;
    var eye_pos: vec4f = uniforms.inv_projection_matrix * ndc;
    return eye_pos.xyz / eye_pos.w;
}

fn getViewPosFromTexCoord(tex_coord: vec2f, iuv: vec2f) -> vec3f {
    var depth: f32 = abs(textureLoad(texture, vec2u(iuv), 0).x);
    return computeViewPosFromUVDepth(tex_coord, depth);
}

fn getMaterialColor(materialType: f32, tNorm: f32) -> vec3f {
    // Element-based base colors
    var base = vec3f(0.6, 0.6, 0.6);
    if (materialType < 0.5) { base = vec3f(0.7, 0.9, 1.0); }          // H: pale blue
    else if (materialType < 1.5) { base = vec3f(0.6, 0.8, 1.0); }     // O: light blue
    else if (materialType < 2.5) { base = vec3f(0.85, 0.85, 0.8); }   // Na: silver
    else if (materialType < 3.5) { base = vec3f(0.7, 0.6, 0.8); }     // K: violet tint
    else if (materialType < 4.5) { base = vec3f(0.85, 0.85, 0.85); }  // Mg: silver
    else if (materialType < 5.5) { base = vec3f(0.85, 0.9, 1.0); }    // Al: bright silver
    else if (materialType < 6.5) { base = vec3f(0.4, 0.4, 0.45); }    // Si: dark gray
    else if (materialType < 7.5) { base = vec3f(0.7, 0.7, 0.65); }    // Ca: dull gray
    else if (materialType < 8.5) { base = vec3f(0.35, 0.35, 0.4); }   // Ti: dark gray-blue
    else if (materialType < 9.5) { base = vec3f(0.35, 0.33, 0.32); }  // Fe: dark metal
    else if (materialType < 10.5) { base = vec3f(0.45, 0.45, 0.5); }  // Pb: dark gray-blue
    let hot = vec3f(1.0, 0.6, 0.3);
    return mix(base, hot, clamp(tNorm, 0.0, 1.0));
}

fn getMaterialDensity(materialType: f32, tNorm: f32) -> f32 {
    var density = 0.5;
    if (materialType < 0.5) { density = 0.3; }
    else if (materialType < 1.5) { density = 0.4; }
    else if (materialType < 2.5) { density = 0.6; }
    else if (materialType < 3.5) { density = 0.4; }
    else if (materialType < 4.5) { density = 0.5; }
    else if (materialType < 5.5) { density = 0.7; }
    else if (materialType < 6.5) { density = 0.6; }
    else if (materialType < 7.5) { density = 0.6; }
    else if (materialType < 8.5) { density = 0.8; }
    else if (materialType < 9.5) { density = 1.2; }
    else if (materialType < 10.5) { density = 1.0; }
    // Thin out slightly at high temperature
    return density * mix(1.0, 0.7, clamp(tNorm, 0.0, 1.0));
}

@fragment
fn fs(input: FragmentInput) -> FragmentOutput {
    var depth: f32 = abs(textureLoad(texture, vec2u(input.iuv), 0).r);
    // Make background lighter (greyish blue)
    let bgColor: vec3f = vec3f(0.7, 0.75, 0.8); 

    if (depth >= 1e4 || depth <= 0.0) { discard; }

    var viewPos: vec3f = computeViewPosFromUVDepth(input.uv, depth);
    
    // Finite difference for normals
    var ddx = getViewPosFromTexCoord(input.uv + vec2f(uniforms.texel_size.x, 0.), input.iuv + vec2f(1.0, 0.0)) - viewPos; 
    var ddy = getViewPosFromTexCoord(input.uv + vec2f(0., uniforms.texel_size.y), input.iuv + vec2f(0.0, 1.0)) - viewPos; 
    var ddx2 = viewPos - getViewPosFromTexCoord(input.uv + vec2f(-uniforms.texel_size.x, 0.), input.iuv + vec2f(-1.0, 0.0));
    var ddy2 = viewPos - getViewPosFromTexCoord(input.uv + vec2f(0., -uniforms.texel_size.y), input.iuv + vec2f(0.0, -1.0));
    if (abs(ddx.z) > abs(ddx2.z)) { ddx = ddx2; }
    if (abs(ddy.z) > abs(ddy2.z)) { ddy = ddy2; }

    var normal: vec3f = -normalize(cross(ddx, ddy)); 
    var rayDir = normalize(viewPos);
    // Light direction (top-down)
    var lightDir = normalize((uniforms.view_matrix * vec4f(0.2, 1.0, 0.2, 0.0)).xyz);
    
    var H = normalize(lightDir - rayDir);
    var specular = pow(max(0.0, dot(H, normal)), 250.0);
    
    // Get material type and temperature from texture
    var matSample = textureLoad(material_texture, vec2u(input.iuv), 0);
    var materialType = matSample.r;
    var tNorm = clamp(matSample.g, 0.0, 1.0);
    
    var density = 0.5; // Base density for transparency
    var thickness = textureLoad(thickness_texture, vec2u(input.iuv), 0).r;
    
    // Get color and density based on material and temperature
    var diffuseColor = getMaterialColor(materialType, tNorm);
    density = getMaterialDensity(materialType, tNorm);
    
    // Beer's law for attenuation
    var transmittance = exp(-density * thickness * (1.0 - diffuseColor)); 
    var refractionColor = bgColor * transmittance;

    let F0 = 0.02;
    var fresnel = clamp(F0 + (1.0 - F0) * pow(1.0 - dot(normal, -rayDir), 5.0), 0.0, 1.0);

    var reflectionDir = reflect(rayDir, normal);
    var reflectionDirWorld = (uniforms.inv_view_matrix * vec4f(reflectionDir, 0.0)).xyz;
    
    // Brighter Fake environment map
    // Sky gradient: Light blue at top, white/grey at horizon/bottom
    var skyTop = vec3f(0.6, 0.8, 1.0);
    var skyBottom = vec3f(0.9, 0.95, 1.0);
    var reflectionColor = mix(skyBottom, skyTop, clamp(reflectionDirWorld.y * 0.5 + 0.5, 0.0, 1.0));
    
    // Iron and rubber have less reflection (more matte)
    var reflectivity = fresnel;
    if (materialType > 4.5 || (materialType > 0.5 && materialType < 1.5)) {
        reflectivity = fresnel * 0.3;  // Reduce reflection for metals and rubber
    }
    
    var finalColor = 1.0 * specular + mix(refractionColor, reflectionColor, reflectivity);
    
    // Gamma correction
    var color = vec4f(pow(finalColor, vec3f(1.0/2.2)), 1.0);
    
    // Compute clip space depth for depth test
    var clipPos = uniforms.projection_matrix * vec4f(viewPos, 1.0);
    var fragDepth = clipPos.z / clipPos.w;

    return FragmentOutput(color, fragDepth);
}
`;

export class FluidRenderer {
  constructor(device, canvasFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.width = 1;
    this.height = 1;
    this.radius = 0.25; 
    
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });
    this.sampler = sampler;

    // Uniform buffers
    this.renderUniformBuffer = device.createBuffer({
      size: 272, // 2*4 + 4 + 4(pad) + 4*16 + 4*16 + 4*16 + 4*16 = 8+4+4+64+64+64+64 = 272?
      // Layout: texel_size(8), sphere_size(4), pad(4), invProj(64), proj(64), view(64), invView(64) -> 8+8+64*4 = 272 bytes
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const filterUniformSize = 16; // vec2 + pad
    this.filterXUniformBuffer = device.createBuffer({ size: filterUniformSize, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this.filterYUniformBuffer = device.createBuffer({ size: filterUniformSize, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(this.filterXUniformBuffer, 0, new Float32Array([1.0, 0.0]));
    device.queue.writeBuffer(this.filterYUniformBuffer, 0, new Float32Array([0.0, 1.0]));

    // Pipeline creation
    const fullScreenModule = device.createShaderModule({ code: FULL_SCREEN_WGSL });
    
    // 1. Depth Map
    this.depthMapPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: device.createShaderModule({ code: DEPTH_MAP_WGSL }), entryPoint: 'vs' },
      fragment: { module: device.createShaderModule({ code: DEPTH_MAP_WGSL }), entryPoint: 'fs', targets: [{ format: 'r32float' }] },
      primitive: { topology: 'triangle-list' },
      depthStencil: { depthWriteEnabled: true, depthCompare: 'less', format: 'depth32float' }
    });

    // 2. Thickness Map
    this.thicknessMapPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: device.createShaderModule({ code: THICKNESS_MAP_WGSL }), entryPoint: 'vs' },
      fragment: { 
        module: device.createShaderModule({ code: THICKNESS_MAP_WGSL }), entryPoint: 'fs', 
        targets: [{ 
          format: 'r16float', 
          blend: { color: { operation: 'add', srcFactor: 'one', dstFactor: 'one' }, alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one' } }
        }] 
      },
      primitive: { topology: 'triangle-list' }
    });

    // 3. Bilateral Filter (Depth)
    this.depthFilterPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: fullScreenModule, entryPoint: 'vs', constants: { screenWidth: 1, screenHeight: 1 } }, // Will update constants or ignore? 
      // Constants in vertex shader need to be overridden. But createRenderPipeline takes constants in descriptor.
      // We will need to re-create pipeline on resize if constants change. Or use uniform for screen size.
      // For now, let's assume we can update constants or use uniform. The shader uses override.
      // We'll handle resize by recreating pipelines? That's slow.
      // The original code passed constants. Let's make them uniforms or ignore strict screen size in UV.
      // Actually fullScreen.wgsl calculates iuv = uv * vec2(width, height).
      // If we use uniforms for texel_size, we don't need screen size in vertex shader.
      // Let's modify FULL_SCREEN_WGSL to not need constants if possible, or accept them.
      fragment: { 
        module: device.createShaderModule({ code: BILATERAL_WGSL }), entryPoint: 'fs', 
        targets: [{ format: 'r32float' }],
        constants: { depth_threshold: 0.1, projected_particle_constant: 100.0, max_filter_size: 100.0 } // Initial values
      },
      primitive: { topology: 'triangle-list' }
    });

    // 4. Gaussian Filter (Thickness)
    this.thicknessFilterPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: fullScreenModule, entryPoint: 'vs', constants: { screenWidth: 1, screenHeight: 1 } },
      fragment: { 
        module: device.createShaderModule({ code: GAUSSIAN_WGSL }), entryPoint: 'fs', 
        targets: [{ format: 'r16float' }] 
      },
      primitive: { topology: 'triangle-list' }
    });

    // 5. Material Map Pipeline
    this.materialMapPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: device.createShaderModule({ code: MATERIAL_MAP_WGSL }), entryPoint: 'vs' },
      fragment: { module: device.createShaderModule({ code: MATERIAL_MAP_WGSL }), entryPoint: 'fs', targets: [{ format: 'r32float' }] },
      primitive: { topology: 'triangle-list' },
      depthStencil: { depthWriteEnabled: true, depthCompare: 'less', format: 'depth32float' }
    });

    // 6. Fluid Composition
    this.fluidPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: fullScreenModule, entryPoint: 'vs', constants: { screenWidth: 1, screenHeight: 1 } },
      fragment: { 
        module: device.createShaderModule({ code: FLUID_WGSL }), entryPoint: 'fs', 
        targets: [{ format: canvasFormat, blend: { color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one' } } }] 
      },
      primitive: { topology: 'triangle-list' },
      depthStencil: { 
          format: 'depth24plus', 
          depthWriteEnabled: false,
          depthCompare: 'always'
      }
    });
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    // Recreate textures
    const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;
    this.depthMapTexture = this.device.createTexture({ size: [width, height], format: 'r32float', usage });
    this.tmpDepthMapTexture = this.device.createTexture({ size: [width, height], format: 'r32float', usage });
    this.thicknessTexture = this.device.createTexture({ size: [width, height], format: 'r16float', usage });
    this.tmpThicknessTexture = this.device.createTexture({ size: [width, height], format: 'r16float', usage });
    this.depthTestTexture = this.device.createTexture({ size: [width, height], format: 'depth32float', usage: GPUTextureUsage.RENDER_ATTACHMENT });

    // Material map texture
    this.materialTexture = this.device.createTexture({ size: [width, height], format: 'r32float', usage });
    this.materialTextureView = this.materialTexture.createView();
    this.materialDepthTexture = this.device.createTexture({ size: [width, height], format: 'depth32float', usage: GPUTextureUsage.RENDER_ATTACHMENT });
    this.materialDepthTextureView = this.materialDepthTexture.createView();

    this.depthMapTextureView = this.depthMapTexture.createView();
    this.tmpDepthMapTextureView = this.tmpDepthMapTexture.createView();
    this.thicknessTextureView = this.thicknessTexture.createView();
    this.tmpThicknessTextureView = this.tmpThicknessTexture.createView();
    this.depthTestTextureView = this.depthTestTexture.createView();

    // Recreate pipelines with correct constants (screen size)
    this.recreatePipelines(width, height);
    
    // Recreate BindGroups (dependent on textures)
    if (this.posVelBuffer) {
        this.updateBindGroups();
    }
  }

  recreatePipelines(width, height) {
    const fullScreenModule = this.device.createShaderModule({ code: FULL_SCREEN_WGSL });
    const constants = { screenWidth: width, screenHeight: height };
    
    // Recalculate filter constants
    const blurdDepthScale = 10;
    const fov = Math.PI / 4;
    const diameter = 2 * this.radius;
    const blurFilterSize = 12;
    const projected_particle_constant = (blurFilterSize * diameter * 0.05 * (height / 2)) / Math.tan(fov / 2);
    const filterConstants = {
        depth_threshold: this.radius * blurdDepthScale,
        max_filter_size: 100.0,
        projected_particle_constant
    };

    this.depthFilterPipeline = this.device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: fullScreenModule, entryPoint: 'vs', constants },
        fragment: { 
            module: this.device.createShaderModule({ code: BILATERAL_WGSL }), entryPoint: 'fs', 
            targets: [{ format: 'r32float' }],
            constants: filterConstants
        },
        primitive: { topology: 'triangle-list' }
    });

    this.thicknessFilterPipeline = this.device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: fullScreenModule, entryPoint: 'vs', constants },
        fragment: { 
            module: this.device.createShaderModule({ code: GAUSSIAN_WGSL }), entryPoint: 'fs', 
            targets: [{ format: 'r16float' }] 
        },
        primitive: { topology: 'triangle-list' }
    });

    this.fluidPipeline = this.device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: fullScreenModule, entryPoint: 'vs', constants },
        fragment: { 
            module: this.device.createShaderModule({ code: FLUID_WGSL }), entryPoint: 'fs', 
            targets: [{ format: this.canvasFormat, blend: { color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one' } } }]
        },
        primitive: { topology: 'triangle-list' },
        depthStencil: { 
            format: 'depth24plus', 
            depthWriteEnabled: true,
            depthCompare: 'less'
        }
    });
  }

  updateBindGroup(posVelBuffer) {
    this.posVelBuffer = posVelBuffer;
    this.updateBindGroups();
  }

  updateBindGroups() {
    this.depthMapBindGroup = this.device.createBindGroup({
        layout: this.depthMapPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: this.posVelBuffer } },
            { binding: 1, resource: { buffer: this.renderUniformBuffer } }
        ]
    });

    this.thicknessMapBindGroup = this.device.createBindGroup({
        layout: this.thicknessMapPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: this.posVelBuffer } },
            { binding: 1, resource: { buffer: this.renderUniformBuffer } }
        ]
    });

    this.depthFilterBindGroups = [
        this.device.createBindGroup({
            layout: this.depthFilterPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 1, resource: this.depthMapTextureView },
                { binding: 2, resource: { buffer: this.filterXUniformBuffer } }
            ]
        }),
        this.device.createBindGroup({
            layout: this.depthFilterPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 1, resource: this.tmpDepthMapTextureView },
                { binding: 2, resource: { buffer: this.filterYUniformBuffer } }
            ]
        })
    ];

    this.thicknessFilterBindGroups = [
        this.device.createBindGroup({
            layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 1, resource: this.thicknessTextureView },
                { binding: 2, resource: { buffer: this.filterXUniformBuffer } }
            ]
        }),
        this.device.createBindGroup({
            layout: this.thicknessFilterPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 1, resource: this.tmpThicknessTextureView },
                { binding: 2, resource: { buffer: this.filterYUniformBuffer } }
            ]
        })
    ];

    // Material map bind group
    this.materialMapBindGroup = this.device.createBindGroup({
        layout: this.materialMapPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: this.posVelBuffer } },
            { binding: 1, resource: { buffer: this.renderUniformBuffer } }
        ]
    });

    this.fluidBindGroup = this.device.createBindGroup({
        layout: this.fluidPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 1, resource: this.depthMapTextureView },
            { binding: 2, resource: { buffer: this.renderUniformBuffer } },
            { binding: 3, resource: this.thicknessTextureView },
            { binding: 4, resource: this.materialTextureView }
        ]
    });
  }

  updateUniforms(matrices, radius) {
    this.radius = radius;
    // Layout: texel_size(8), sphere_size(4), pad(4), invProj(64), proj(64), view(64), invView(64)
    const data = new Float32Array(272 / 4);
    data.set([1.0 / this.width, 1.0 / this.height], 0);
    data[2] = radius * 2.0; // sphere_size is diameter?
    // Reference: "let corner = vec3(corner_positions[vertex_index] * uniforms.sphere_size, 0.0);"
    // If sphere_size is diameter, then corner extends -0.5*d to 0.5*d. Yes.
    
    data.set(matrices.invProj, 4);
    data.set(matrices.proj, 20);
    data.set(matrices.view, 36);
    data.set(matrices.invView, 52);
    
    this.device.queue.writeBuffer(this.renderUniformBuffer, 0, data);
  }

  record(pass, particleCount) {
    // We cannot use the passed RenderPassEncoder because we need multiple passes.
    // So this method expects a CommandEncoder, or we must change signature.
    // The calling code currently does:
    // const pass = encoder.beginRenderPass(...);
    // renderer.record(pass, ...);
    // This is for simple forward rendering.
    // For Fluid, we need to handle our own passes.
    // So we should modify the caller to let us handle passes, or we just render the final quad in the passed pass?
    // No, we need to compute depth/thickness first.
    // So `record` should take `commandEncoder`.
    console.error("FluidRenderer.record expects CommandEncoder, not RenderPassEncoder");
  }

  render(commandEncoder, targetView, depthView, particleCount) {
    if (!this.depthMapBindGroup) return;

    // 1. Depth Map
    const depthPass = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.depthMapTextureView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }],
        depthStencilAttachment: { view: this.depthTestTextureView, depthClearValue: 1.0, depthLoadOp: 'clear', depthStoreOp: 'store' }
    });
    depthPass.setPipeline(this.depthMapPipeline);
    depthPass.setBindGroup(0, this.depthMapBindGroup);
    depthPass.draw(6, particleCount);
    depthPass.end();

    // 2. Filter Depth (X then Y)
    // X
    const filterDX = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.tmpDepthMapTextureView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }]
    });
    filterDX.setPipeline(this.depthFilterPipeline);
    filterDX.setBindGroup(0, this.depthFilterBindGroups[0]);
    filterDX.draw(6);
    filterDX.end();
    // Y
    const filterDY = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.depthMapTextureView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }]
    });
    filterDY.setPipeline(this.depthFilterPipeline);
    filterDY.setBindGroup(0, this.depthFilterBindGroups[1]);
    filterDY.draw(6);
    filterDY.end();

    // 3. Material Map (renders material type per pixel)
    const materialPass = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.materialTextureView, clearValue: { r: 2.0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }],
        depthStencilAttachment: { view: this.materialDepthTextureView, depthClearValue: 1.0, depthLoadOp: 'clear', depthStoreOp: 'store' }
    });
    materialPass.setPipeline(this.materialMapPipeline);
    materialPass.setBindGroup(0, this.materialMapBindGroup);
    materialPass.draw(6, particleCount);
    materialPass.end();

    // 4. Thickness
    const thickPass = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.thicknessTextureView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }]
    });
    thickPass.setPipeline(this.thicknessMapPipeline);
    thickPass.setBindGroup(0, this.thicknessMapBindGroup);
    thickPass.draw(6, particleCount);
    thickPass.end();

    // 5. Filter Thickness (X then Y)
    // X
    const filterTX = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.tmpThicknessTextureView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }]
    });
    filterTX.setPipeline(this.thicknessFilterPipeline);
    filterTX.setBindGroup(0, this.thicknessFilterBindGroups[0]);
    filterTX.draw(6);
    filterTX.end();
    // Y
    const filterTY = commandEncoder.beginRenderPass({
        colorAttachments: [{ view: this.thicknessTextureView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' }]
    });
    filterTY.setPipeline(this.thicknessFilterPipeline);
    filterTY.setBindGroup(0, this.thicknessFilterBindGroups[1]);
    filterTY.draw(6);
    filterTY.end();

    // 6. Final Composition (Fluid)
    // Composited against the scene depth buffer for correct occlusion.
    const fluidPass = commandEncoder.beginRenderPass({
        colorAttachments: [{ 
            view: targetView, 
            loadOp: 'load', 
            storeOp: 'store' 
        }],
        depthStencilAttachment: {
            view: depthView,
            depthLoadOp: 'load',
            depthStoreOp: 'store'
        }
    });
    fluidPass.setPipeline(this.fluidPipeline);
    fluidPass.setBindGroup(0, this.fluidBindGroup);
    fluidPass.draw(6);
    fluidPass.end();
  }
}
