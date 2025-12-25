import"./device-CAsdAK37.js";import{g as xe,a as ye,s as _e,M as be,c as ee,u as we}from"./peercomputeDevice-D2SZGD2f.js";import{O as Pe,b as he}from"./orbitControls-7kOmSw7O.js";const te=`
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
`,ie=`
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
`,re=`
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
`,ae=`
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
`,ne=`
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
`,oe=`
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
`,se=`
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
`;class Be{constructor(e,r){this.device=e,this.canvasFormat=r,this.width=1,this.height=1,this.radius=.25;const i=e.createSampler({magFilter:"linear",minFilter:"linear"});this.sampler=i,this.renderUniformBuffer=e.createBuffer({size:272,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const c=16;this.filterXUniformBuffer=e.createBuffer({size:c,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.filterYUniformBuffer=e.createBuffer({size:c,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.filterXUniformBuffer,0,new Float32Array([1,0])),e.queue.writeBuffer(this.filterYUniformBuffer,0,new Float32Array([0,1]));const d=e.createShaderModule({code:te});this.depthMapPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:ie}),entryPoint:"vs"},fragment:{module:e.createShaderModule({code:ie}),entryPoint:"fs",targets:[{format:"r32float"}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth32float"}}),this.thicknessMapPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:ae}),entryPoint:"vs"},fragment:{module:e.createShaderModule({code:ae}),entryPoint:"fs",targets:[{format:"r16float",blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),this.depthFilterPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",constants:{screenWidth:1,screenHeight:1}},fragment:{module:e.createShaderModule({code:re}),entryPoint:"fs",targets:[{format:"r32float"}],constants:{depth_threshold:.1,projected_particle_constant:100,max_filter_size:100}},primitive:{topology:"triangle-list"}}),this.thicknessFilterPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",constants:{screenWidth:1,screenHeight:1}},fragment:{module:e.createShaderModule({code:oe}),entryPoint:"fs",targets:[{format:"r16float"}]},primitive:{topology:"triangle-list"}}),this.materialMapPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule({code:ne}),entryPoint:"vs"},fragment:{module:e.createShaderModule({code:ne}),entryPoint:"fs",targets:[{format:"r32float"}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth32float"}}),this.fluidPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",constants:{screenWidth:1,screenHeight:1}},fragment:{module:e.createShaderModule({code:se}),entryPoint:"fs",targets:[{format:r,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"},depthStencil:{format:"depth24plus",depthWriteEnabled:!1,depthCompare:"always"}})}resize(e,r){this.width=e,this.height=r;const i=GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING;this.depthMapTexture=this.device.createTexture({size:[e,r],format:"r32float",usage:i}),this.tmpDepthMapTexture=this.device.createTexture({size:[e,r],format:"r32float",usage:i}),this.thicknessTexture=this.device.createTexture({size:[e,r],format:"r16float",usage:i}),this.tmpThicknessTexture=this.device.createTexture({size:[e,r],format:"r16float",usage:i}),this.depthTestTexture=this.device.createTexture({size:[e,r],format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.materialTexture=this.device.createTexture({size:[e,r],format:"r32float",usage:i}),this.materialTextureView=this.materialTexture.createView(),this.materialDepthTexture=this.device.createTexture({size:[e,r],format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.materialDepthTextureView=this.materialDepthTexture.createView(),this.depthMapTextureView=this.depthMapTexture.createView(),this.tmpDepthMapTextureView=this.tmpDepthMapTexture.createView(),this.thicknessTextureView=this.thicknessTexture.createView(),this.tmpThicknessTextureView=this.tmpThicknessTexture.createView(),this.depthTestTextureView=this.depthTestTexture.createView(),this.recreatePipelines(e,r),this.posVelBuffer&&this.updateBindGroups()}recreatePipelines(e,r){const i=this.device.createShaderModule({code:te}),c={screenWidth:e,screenHeight:r},d=10,m=Math.PI/4,_=12*(2*this.radius)*.05*(r/2)/Math.tan(m/2),x={depth_threshold:this.radius*d,max_filter_size:100,projected_particle_constant:_};this.depthFilterPipeline=this.device.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"vs",constants:c},fragment:{module:this.device.createShaderModule({code:re}),entryPoint:"fs",targets:[{format:"r32float"}],constants:x},primitive:{topology:"triangle-list"}}),this.thicknessFilterPipeline=this.device.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"vs",constants:c},fragment:{module:this.device.createShaderModule({code:oe}),entryPoint:"fs",targets:[{format:"r16float"}]},primitive:{topology:"triangle-list"}}),this.fluidPipeline=this.device.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"vs",constants:c},fragment:{module:this.device.createShaderModule({code:se}),entryPoint:"fs",targets:[{format:this.canvasFormat,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}})}updateBindGroup(e){this.posVelBuffer=e,this.updateBindGroups()}updateBindGroups(){this.depthMapBindGroup=this.device.createBindGroup({layout:this.depthMapPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.posVelBuffer}},{binding:1,resource:{buffer:this.renderUniformBuffer}}]}),this.thicknessMapBindGroup=this.device.createBindGroup({layout:this.thicknessMapPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.posVelBuffer}},{binding:1,resource:{buffer:this.renderUniformBuffer}}]}),this.depthFilterBindGroups=[this.device.createBindGroup({layout:this.depthFilterPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.depthMapTextureView},{binding:2,resource:{buffer:this.filterXUniformBuffer}}]}),this.device.createBindGroup({layout:this.depthFilterPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.tmpDepthMapTextureView},{binding:2,resource:{buffer:this.filterYUniformBuffer}}]})],this.thicknessFilterBindGroups=[this.device.createBindGroup({layout:this.thicknessFilterPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.thicknessTextureView},{binding:2,resource:{buffer:this.filterXUniformBuffer}}]}),this.device.createBindGroup({layout:this.thicknessFilterPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.tmpThicknessTextureView},{binding:2,resource:{buffer:this.filterYUniformBuffer}}]})],this.materialMapBindGroup=this.device.createBindGroup({layout:this.materialMapPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.posVelBuffer}},{binding:1,resource:{buffer:this.renderUniformBuffer}}]}),this.fluidBindGroup=this.device.createBindGroup({layout:this.fluidPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.depthMapTextureView},{binding:2,resource:{buffer:this.renderUniformBuffer}},{binding:3,resource:this.thicknessTextureView},{binding:4,resource:this.materialTextureView}]})}updateUniforms(e,r){this.radius=r;const i=new Float32Array(272/4);i.set([1/this.width,1/this.height],0),i[2]=r*2,i.set(e.invProj,4),i.set(e.proj,20),i.set(e.view,36),i.set(e.invView,52),this.device.queue.writeBuffer(this.renderUniformBuffer,0,i)}record(e,r){console.error("FluidRenderer.record expects CommandEncoder, not RenderPassEncoder")}render(e,r,i,c){if(!this.depthMapBindGroup)return;const d=e.beginRenderPass({colorAttachments:[{view:this.depthMapTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthTestTextureView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});d.setPipeline(this.depthMapPipeline),d.setBindGroup(0,this.depthMapBindGroup),d.draw(6,c),d.end();const m=e.beginRenderPass({colorAttachments:[{view:this.tmpDepthMapTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});m.setPipeline(this.depthFilterPipeline),m.setBindGroup(0,this.depthFilterBindGroups[0]),m.draw(6),m.end();const h=e.beginRenderPass({colorAttachments:[{view:this.depthMapTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.depthFilterPipeline),h.setBindGroup(0,this.depthFilterBindGroups[1]),h.draw(6),h.end();const g=e.beginRenderPass({colorAttachments:[{view:this.materialTextureView,clearValue:{r:2,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.materialDepthTextureView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});g.setPipeline(this.materialMapPipeline),g.setBindGroup(0,this.materialMapBindGroup),g.draw(6,c),g.end();const _=e.beginRenderPass({colorAttachments:[{view:this.thicknessTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});_.setPipeline(this.thicknessMapPipeline),_.setBindGroup(0,this.thicknessMapBindGroup),_.draw(6,c),_.end();const x=e.beginRenderPass({colorAttachments:[{view:this.tmpThicknessTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});x.setPipeline(this.thicknessFilterPipeline),x.setBindGroup(0,this.thicknessFilterBindGroups[0]),x.draw(6),x.end();const s=e.beginRenderPass({colorAttachments:[{view:this.thicknessTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});s.setPipeline(this.thicknessFilterPipeline),s.setBindGroup(0,this.thicknessFilterBindGroups[1]),s.draw(6),s.end();const l=e.beginRenderPass({colorAttachments:[{view:r,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:i,depthLoadOp:"load",depthStoreOp:"store"}});l.setPipeline(this.fluidPipeline),l.setBindGroup(0,this.fluidBindGroup),l.draw(6),l.end()}}const b=document.getElementById("canvas"),J=document.getElementById("toggleBtn"),k=document.getElementById("status"),Te=document.getElementById("particleCount"),Se=document.getElementById("fps"),Me=document.getElementById("mass"),Fe=document.getElementById("momentum"),Ue=document.getElementById("error");let y,Y,Q,I,j,V,z,E,$,B,G=!0,ue=performance.now(),K=0,ce=0,le,N=0,X=!1,D=null,de=!1,P,Ce;const O=[{key:"Hydrogen",id:0},{key:"Oxygen",id:1},{key:"Sodium",id:2},{key:"Potassium",id:3},{key:"Magnesium",id:4},{key:"Aluminum",id:5},{key:"Silicon",id:6},{key:"Calcium",id:7},{key:"Titanium",id:8},{key:"Iron",id:9},{key:"Lead",id:10}],fe=[.8,.8,1,1.1,.95,1,.95,1.1,1,1,1],Ge=[2e-4,2e-4,3e-4,3e-4,25e-5,2e-4,15e-5,25e-5,18e-5,17e-5,16e-5],Ve=[.05,.05,.08,.1,.07,.05,.05,.08,.06,.05,.05];function ze(o,e){const i=new URLSearchParams(window.location.search).get(o);if(i!==null){const c=parseFloat(i);return isNaN(c)?e:c}return e}const t={renderMode:"Fluid",particleCount:ze("particles",2e4),gridSizeX:64,gridSizeY:64,gridSizeZ:64,spacing:1,jitter:.1,materialA:"Titanium",materialB:"Lead",temperature:300,dt:.1,gravity:-.3,ambientPressure:1,stiffness:50,restDensity:1,dynamicViscosity:.1,iterations:1,fixedPointScale:1e5,visualRadius:.2,fluidRadius:1,interactionRadius:9,interactionX:32,interactionY:10,interactionZ:32,interactionActive:!1,heatSourceTemp:400};J.addEventListener("click",()=>{G=!G,J.textContent=G?"Pause":"Resume",k.textContent=G?"running":"paused"});function ve(o){console.error(o),Ue.textContent=(o==null?void 0:o.stack)||String(o),k.textContent="error",G=!1,J.disabled=!0}function f(o,e){return o!=null&&o.domElement&&(o.domElement.title=e),o}function pe(o,e,r){const i=Math.max(0,Math.min(o,fe.length-1)),c=fe[i],d=Ge[i],m=Ve[i],h=e-300;let g=c*(1+d*h);const _=1/Math.max(.2,1+.1*(r-1));g*=_,g=Math.min(Math.max(g,.4),2.5);let x=m+Math.abs(h)*1e-4+Math.max(0,r-1)*.02;return x=Math.min(Math.max(x,0),.6),{spacing:g,jitter:x}}function me(){const o=window.devicePixelRatio||1,e=Math.max(1,Math.floor(b.clientWidth*o)),r=Math.max(1,Math.floor(b.clientHeight*o));b.width=e,b.height=r,Y.configure({device:y,format:Q,alphaMode:"opaque"}),I&&I.destroy(),I=y.createTexture({size:[e,r],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),j=I.createView(),V&&V.resize(e,r),z&&z.resize(e,r)}class Re{constructor(e){this.device=e,this.canvasAspect=1;const{vertices:r,indices:i}=he(1,8,6);this.vertexBuffer=e.createBuffer({size:r.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,r),this.indexBuffer=e.createBuffer({size:i.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,i),this.indexCount=i.length,this.uniformBuffer=e.createBuffer({size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const d=e.createShaderModule({code:`
      struct Uniforms {
        viewProj: mat4x4<f32>,
        radius: f32,
        pad0: vec3<f32>,
      };
      struct PosVel {
        position: vec3<f32>,
        velocity: vec3<f32>,
        temperature: f32,
      };
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      @group(0) @binding(1) var<storage, read> posvel: array<PosVel>;

      struct VSOut {
        @builtin(position) position: vec4<f32>,
        @location(0) normal: vec3<f32>,
        @location(1) color: vec3<f32>,
      };

      @vertex
      fn vs_main(
        @location(0) localPos: vec3<f32>,
        @location(1) normal: vec3<f32>,
        @builtin(instance_index) instanceId: u32
      ) -> VSOut {
        let p = posvel[instanceId].position;
        let t = posvel[instanceId].temperature;
        let worldPos = p + localPos * uniforms.radius;
        
        // Temperature mapping: 273K (Blue) -> 373K (Red)
        let tempT = clamp((t - 273.0) / 100.0, 0.0, 1.0);
        let colorCold = vec3<f32>(0.2, 0.7, 0.95);
        let colorHot = vec3<f32>(0.95, 0.2, 0.2);
        let color = mix(colorCold, colorHot, tempT);

        var out: VSOut;
        out.position = uniforms.viewProj * vec4<f32>(worldPos, 1.0);
        out.normal = normal;
        out.color = color;
        return out;
      }

      @fragment
      fn fs_main(in: VSOut) -> @location(0) vec4<f32> {
        let lightDir = normalize(vec3<f32>(0.3, 1.0, 0.2));
        let ambient = 0.25;
        let diffuse = max(dot(in.normal, lightDir), 0.0);
        let lighting = ambient + diffuse * 1.2;
        return vec4<f32>(in.color * lighting, 1.0);
      }
    `}),m=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[m]}),vertex:{module:d,entryPoint:"vs_main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{module:d,entryPoint:"fs_main",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.bindGroup=null}resize(e,r){this.canvasAspect=e/r}updateBindGroup(e){this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:e}}]})}updateUniforms(e,r){const i=new Float32Array(20);i.set(e,0),i[16]=r,this.device.queue.writeBuffer(this.uniformBuffer,0,i)}record(e,r){this.bindGroup&&(e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.indexCount,r))}}class Oe{constructor(e){this.device=e;const{vertices:r,indices:i}=he(1,16,12);this.vertexBuffer=e.createBuffer({size:r.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,r),this.indexBuffer=e.createBuffer({size:i.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,i),this.indexCount=i.length,this.uniformBuffer=e.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const d=e.createShaderModule({code:`
            struct Uniforms {
                viewProj: mat4x4<f32>,
                position: vec3<f32>,
                radius: f32,
            };
            @group(0) @binding(0) var<uniform> uniforms: Uniforms;
            
            struct VSOut {
                @builtin(position) position: vec4<f32>,
                @location(0) normal: vec3<f32>,
            };
            
            @vertex
            fn vs(@location(0) pos: vec3<f32>, @location(1) norm: vec3<f32>) -> VSOut {
                var out: VSOut;
                let worldPos = uniforms.position + pos * uniforms.radius;
                out.position = uniforms.viewProj * vec4<f32>(worldPos, 1.0);
                out.normal = norm;
                return out;
            }
            
            @fragment
            fn fs(in: VSOut) -> @location(0) vec4<f32> {
                let light = vec3<f32>(0.5, 1.0, 0.2);
                let diff = max(dot(in.normal, normalize(light)), 0.2);
                return vec4<f32>(1.0, 0.4, 0.4, 1.0) * diff;
            }
        `});this.pipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{module:d,entryPoint:"fs",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.bindGroup=e.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}update(e,r,i){const c=new Float32Array(20);c.set(e,0),c.set(r,16),c[19]=i,this.device.queue.writeBuffer(this.uniformBuffer,0,c)}record(e){e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.indexCount)}}async function w(){if(!X){X=!0,k.textContent="initializing...";try{const o=t.particleCount,e={x:t.gridSizeX,y:t.gridSizeY,z:t.gridSizeZ},r=.005,i=Math.ceil(t.dt/r),c={stiffness:t.stiffness,restDensity:t.restDensity,dynamicViscosity:t.dynamicViscosity,dt:r,fixedPointScale:t.fixedPointScale,tensileStrength:0,damageRate:0,ambientPressure:t.ambientPressure},d=y.createBuffer({size:o*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),m=y.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=_e(y,{particleCount:o,gridSize:e,iterations:i,posVelBuffer:d,interactionBuffer:m,constants:c}),g=Math.floor(o/2),_=o-g,x=O.find(A=>A.key===t.materialA)??O[0],s=O.find(A=>A.key===t.materialB)??O[1]??O[0],l=Math.ceil(Math.cbrt(g)),p=Math.ceil(Math.cbrt(_)),v=pe(x.id,t.temperature,t.ambientPressure),a=pe(s.id,t.temperature,t.ambientPressure),n=2,u=Math.max(l*v.spacing,p*a.spacing),U=Math.max(n,Math.min(e.y-n-u,e.y*.7)),M=[n,U,n],F=[Math.max(n,e.x-n-p*a.spacing),U,Math.max(n,e.z-n-p*a.spacing)],T=new ArrayBuffer(o*be),C=ee({count:g,gridSize:e,start:M,spacing:v.spacing,jitter:v.jitter,temperature:t.temperature,restDensity:t.restDensity,materialType:x.id,cubeSideCount:l}),L=ee({count:_,gridSize:e,start:F,spacing:a.spacing,jitter:a.jitter,temperature:t.temperature,restDensity:t.restDensity,materialType:s.id,cubeSideCount:p});new Uint8Array(T,0,C.byteLength).set(new Uint8Array(C)),new Uint8Array(T,C.byteLength,L.byteLength).set(new Uint8Array(L));const W=T;we(y,h.buffers.particleBuffer,W),$=h.domain,B=h.buffers,N=o,V&&V.updateBindGroup(d),z&&z.updateBindGroup(d),Te.textContent=o.toString(),k.textContent="running"}catch(o){console.warn("Init error:",o),ve(o)}finally{X=!1}}}async function Ae(){try{let d=function(){const s=t.gridSizeX/2,l=t.gridSizeY/2,p=t.gridSizeZ/2;o.setTarget([s,l,p]);const v=Math.max(t.gridSizeX,t.gridSizeY,t.gridSizeZ);o.setRadius(v*1.8),t.interactionX=s,t.interactionY=l*.3,t.interactionZ=p,P.controllersRecursive().forEach(a=>a.updateDisplay()),w()};y=await xe(),Y=b.getContext("webgpu"),Q=navigator.gpu.getPreferredCanvasFormat(),V=new Re(y),z=new Be(y,Q),E=new Oe(y),me(),window.addEventListener("resize",me);const o=new Pe(b,{target:[32,32,32],radius:120});await w(),P=new window.lil.GUI({title:"MLS-MPM Controls"}),(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<768)&&P.close(),f(P.add(t,"renderMode",["Particles","Fluid"]).name("Render Mode"),"Choose between particle instancing or screen-space fluid rendering");const r=P.addFolder("Visuals");f(r.add(t,"visualRadius",.05,1,.05).name("Particle Radius"),"Sphere radius for particle rendering (visual only)"),f(r.add(t,"fluidRadius",.05,3,.05).name("Fluid Radius"),"Splat radius for screen-space fluid rendering");const i=P.addFolder("Simulation");f(i.add(t,"particleCount",100,1e5,1e3).name("Particle Count").onFinishChange(w),"Total number of particles spawned (higher = heavier GPU load)");const c={};O.forEach(s=>{c[s.key]=s.key}),f(i.add(t,"materialA",c).name("Element A").onChange(w),"Element for first spawn block (50% of particles)"),f(i.add(t,"materialB",c).name("Element B").onChange(w),"Element for second spawn block (50% of particles)"),i.add(t,"gridSizeX",16,256,16).name("Box X").onFinishChange(d),i.add(t,"gridSizeY",16,256,16).name("Box Y").onFinishChange(d),i.add(t,"gridSizeZ",16,256,16).name("Box Z").onFinishChange(d),f(i.add(t,"spacing",.1,2.5,.05).name("Spacing").onFinishChange(w),"Initial particle pitch (grid units); smaller = denser packing"),f(i.add(t,"jitter",0,1,.05).name("Jitter").onFinishChange(w),"Random perturbation of initial positions to break symmetry"),Ce=f(i.add(t,"temperature",0,5e3,1).name("Temperature (K)").onFinishChange(w),"Initial particle temperature for the selected material");const m=P.addFolder("Physics Constants");f(m.add(t,"dt",.001,.2,.001).name("Time Step (dt)").onChange(()=>w()),"Simulation timestep (seconds) per sub-step; smaller = more stable"),f(m.add(t,"gravity",-20,20,.1).name("Gravity (Y)"),"Gravity acceleration along Y (negative = downward)"),f(m.add(t,"ambientPressure",0,5,.05).name("Ambient Pressure"),"Ambient pressure baseline applied to fluids/gases (dimensionless)"),f(m.add(t,"stiffness",.1,100,.1).name("Stiffness").onFinishChange(w),"Fluid bulk modulus for Tait EOS (affects compressibility)"),f(m.add(t,"restDensity",.1,10,.1).onFinishChange(w),"Target rest density for mass/volume and pressure calculations"),f(m.add(t,"dynamicViscosity",0,5,.01).onFinishChange(w),"Viscosity term applied to fluids (damps shear/velocity gradients)");const h=P.addFolder("Interaction Sphere");f(h.add(t,"interactionActive").name("Active"),"Enable or disable the interaction sphere"),f(h.add(t,"interactionRadius",.1,20).name("Radius"),"Sphere radius for collision/thermal interaction"),f(h.add(t,"interactionX",0,100).name("X"),"Sphere center X (grid units)"),f(h.add(t,"interactionY",0,100).name("Y"),"Sphere center Y (grid units)"),f(h.add(t,"interactionZ",0,100).name("Z"),"Sphere center Z (grid units)"),f(h.add(t,"heatSourceTemp",0,1e4,1).name("Heat Source (K)"),"Temperature of the heat/cool sphere (0 disables thermal effect)"),f(P.add({reset:w},"reset").name("Reset Simulation"),"Rebuild buffers and restart the current scene"),f(P.add({calibrate:()=>D=null},"calibrate").name("Calibrate Sensors"),"Reset device-orientation baseline for gravity control"),k.textContent="running";let g=!1,_=0;b.addEventListener("pointerdown",s=>{s.button===1&&t.interactionActive&&(g=!0,_=t.interactionY,s.preventDefault(),s.stopImmediatePropagation())}),window.addEventListener("pointerup",()=>g=!1),b.addEventListener("wheel",s=>{if(s.ctrlKey&&t.interactionActive){s.preventDefault();const l=s.deltaY>0?-1:1;t.interactionY=Math.max(0,Math.min(t.gridSizeY,t.interactionY+l)),P.controllersRecursive().forEach(p=>p.updateDisplay())}},{passive:!1}),window.addEventListener("deviceorientation",s=>{if(!B||!B.simUniformBuffer||s.beta===null||s.gamma===null)return;D||(D={beta:s.beta,gamma:s.gamma}),de=!0;const l=.3,p=(s.beta-D.beta)*(Math.PI/180),v=(s.gamma-D.gamma)*(Math.PI/180);let a=Math.sin(v)*l,n=Math.sin(p)*l,u=-Math.sqrt(Math.max(0,l*l-a*a-n*n));const U=new Float32Array(4);U.set([a,u,n],0),U[3]=t.ambientPressure,y.queue.writeBuffer(B.simUniformBuffer,0,U)},!0),b.addEventListener("pointermove",s=>{if(g&&t.interactionActive){const l=b.getBoundingClientRect(),p=(s.clientX-l.left)/l.width*2-1,v=-(s.clientY-l.top)/l.height*2+1,a=o.getMatrices(l.width/l.height),n=a.invView,u=a.invProj,U=[p,v,.5,1];let M=u[0]*p+u[4]*v+u[8]*.5+u[12],F=u[1]*p+u[5]*v+u[9]*.5+u[13],T=u[2]*p+u[6]*v+u[10]*.5+u[14],C=u[3]*p+u[7]*v+u[11]*.5+u[15];M/=C,F/=C,T/=C;let L=n[0]*M+n[4]*F+n[8]*T,W=n[1]*M+n[5]*F+n[9]*T,A=n[2]*M+n[6]*F+n[10]*T;const R=a.eye,Ee=[L,W,A],q=[n[0]*M+n[4]*F+n[8]*T+n[12],n[1]*M+n[5]*F+n[9]*T+n[13],n[2]*M+n[6]*F+n[10]*T+n[14]],S=[q[0]-R[0],q[1]-R[1],q[2]-R[2]],H=Math.hypot(S[0],S[1],S[2]);if(S[0]/=H,S[1]/=H,S[2]/=H,Math.abs(S[1])>.001){const Z=(_-R[1])/S[1];Z>0&&(t.interactionX=R[0]+Z*S[0],t.interactionZ=R[2]+Z*S[2],P.controllers.forEach(ge=>ge.updateDisplay()))}}});async function x(s){const l=(s-ue)/1e3;ue=s;const p=.9;if(l>0){const a=1/l;K=K*p+a*(1-p),Se.textContent=K.toFixed(1)}if(X){le=requestAnimationFrame(x);return}if(B&&B.simUniformBuffer&&!de){const a=new Float32Array(4);a[0]=0,a[1]=t.gravity,a[2]=0,a[3]=t.ambientPressure,y.queue.writeBuffer(B.simUniformBuffer,0,a)}if(B&&B.interactionBuffer){const a=new Float32Array(8);t.interactionActive?(a[0]=t.interactionX,a[1]=t.interactionY,a[2]=t.interactionZ,a[3]=t.interactionRadius,a[4]=0,a[5]=0,a[6]=0,a[7]=t.heatSourceTemp):a[3]=-1,y.queue.writeBuffer(B.interactionBuffer,0,a)}const v=y.createCommandEncoder({label:"mpm-visual-frame"});if(G&&$&&$.step(v,t.dt),t.renderMode==="Fluid"){const a=o.getMatrices(b.width/b.height);z.updateUniforms(a,t.fluidRadius);const n=Y.getCurrentTexture().createView(),u=v.beginRenderPass({colorAttachments:[{view:n,clearValue:{r:.05,g:.08,b:.14,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:j,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});t.interactionActive&&(E.update(a.viewProj,[t.interactionX,t.interactionY,t.interactionZ],t.interactionRadius),E.record(u)),u.end(),z.render(v,n,j,N)}else{const a=o.getViewProj(b.width/b.height);V.updateUniforms(a,t.visualRadius);const n=Y.getCurrentTexture().createView(),u=v.beginRenderPass({colorAttachments:[{view:n,loadOp:"clear",storeOp:"store",clearValue:{r:.05,g:.08,b:.14,a:1}}],depthStencilAttachment:{view:j,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});t.interactionActive&&(E.update(a,[t.interactionX,t.interactionY,t.interactionZ],t.interactionRadius),E.record(u)),V.record(u,N),u.end()}y.queue.submit([v.finish()]),s-ce>500&&G&&B&&(ce=s,ye(y,B.particleBuffer,N).then(({mass:a,momentum:n})=>{Me.textContent=a.toFixed(3),Fe.textContent=n.map(u=>u.toFixed(3)).join(", ")}).catch(a=>console.warn(a))),le=requestAnimationFrame(x)}requestAnimationFrame(x)}catch(o){ve(o)}}Ae();
