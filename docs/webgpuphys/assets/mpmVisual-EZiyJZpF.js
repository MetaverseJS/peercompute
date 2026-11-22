import{r as Me,s as J}from"./ModelEvidenceService-Cqouo3eH.js";import{f as Ce}from"./device-CB8g0LHY.js";import{M as W,c as Fe,
s as ze,a as oe,u as Ue}from"./diagnostics-DRxK5GC6.js";import{a as Ge,g as Ve}from"./peercomputeDevice-31dfg0A4.js";import{
O as Re,b as be}from"./orbitControls-rEfmTUzB.js";const se=`
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
`,ue=`
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
`,ce=`
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
`,le=`
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
`,de=`
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
`,fe=`
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
`,pe=`
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
    var ddx = getViewPosFromTexCoord(input.uv + vec2f(uniforms.texel_size.x, 0.), input.iuv + vec2f(1.0, 0.0)) - viewPos\
; 
    var ddy = getViewPosFromTexCoord(input.uv + vec2f(0., uniforms.texel_size.y), input.iuv + vec2f(0.0, 1.0)) - viewPos\
; 
    var ddx2 = viewPos - getViewPosFromTexCoord(input.uv + vec2f(-uniforms.texel_size.x, 0.), input.iuv + vec2f(-1.0, 0.\
0));
    var ddy2 = viewPos - getViewPosFromTexCoord(input.uv + vec2f(0., -uniforms.texel_size.y), input.iuv + vec2f(0.0, -1.\
0));
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
`;class Oe{constructor(e,i){this.device=e,this.canvasFormat=i,this.width=1,this.height=1,this.radius=.25;const r=e.createSampler(
{magFilter:"linear",minFilter:"linear"});this.sampler=r,this.renderUniformBuffer=e.createBuffer({size:272,usage:GPUBufferUsage.
UNIFORM|GPUBufferUsage.COPY_DST});const c=16;this.filterXUniformBuffer=e.createBuffer({size:c,usage:GPUBufferUsage.UNIFORM|
GPUBufferUsage.COPY_DST}),this.filterYUniformBuffer=e.createBuffer({size:c,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),
e.queue.writeBuffer(this.filterXUniformBuffer,0,new Float32Array([1,0])),e.queue.writeBuffer(this.filterYUniformBuffer,0,
new Float32Array([0,1]));const d=e.createShaderModule({code:se});this.depthMapPipeline=e.createRenderPipeline({layout:"a\
uto",vertex:{module:e.createShaderModule({code:ue}),entryPoint:"vs"},fragment:{module:e.createShaderModule({code:ue}),entryPoint:"\
fs",targets:[{format:"r32float"}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"\
less",format:"depth32float"}}),this.thicknessMapPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:e.createShaderModule(
{code:le}),entryPoint:"vs"},fragment:{module:e.createShaderModule({code:le}),entryPoint:"fs",targets:[{format:"r16float",
blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},
primitive:{topology:"triangle-list"}}),this.depthFilterPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"\
vs",constants:{screenWidth:1,screenHeight:1}},fragment:{module:e.createShaderModule({code:ce}),entryPoint:"fs",targets:[
{format:"r32float"}],constants:{depth_threshold:.1,projected_particle_constant:100,max_filter_size:100}},primitive:{topology:"\
triangle-list"}}),this.thicknessFilterPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",constants:{
screenWidth:1,screenHeight:1}},fragment:{module:e.createShaderModule({code:fe}),entryPoint:"fs",targets:[{format:"r16flo\
at"}]},primitive:{topology:"triangle-list"}}),this.materialMapPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:e.
createShaderModule({code:de}),entryPoint:"vs"},fragment:{module:e.createShaderModule({code:de}),entryPoint:"fs",targets:[
{format:"r32float"}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"\
depth32float"}}),this.fluidPipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",constants:{screenWidth:1,
screenHeight:1}},fragment:{module:e.createShaderModule({code:pe}),entryPoint:"fs",targets:[{format:i,blend:{color:{srcFactor:"\
src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-li\
st"},depthStencil:{format:"depth24plus",depthWriteEnabled:!1,depthCompare:"always"}})}resize(e,i){this.width=e,this.height=
i;const r=GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING;this.depthMapTexture=this.device.createTexture(
{size:[e,i],format:"r32float",usage:r}),this.tmpDepthMapTexture=this.device.createTexture({size:[e,i],format:"r32float",
usage:r}),this.thicknessTexture=this.device.createTexture({size:[e,i],format:"r16float",usage:r}),this.tmpThicknessTexture=
this.device.createTexture({size:[e,i],format:"r16float",usage:r}),this.depthTestTexture=this.device.createTexture({size:[
e,i],format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.materialTexture=this.device.createTexture({size:[
e,i],format:"r32float",usage:r}),this.materialTextureView=this.materialTexture.createView(),this.materialDepthTexture=this.
device.createTexture({size:[e,i],format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.materialDepthTextureView=
this.materialDepthTexture.createView(),this.depthMapTextureView=this.depthMapTexture.createView(),this.tmpDepthMapTextureView=
this.tmpDepthMapTexture.createView(),this.thicknessTextureView=this.thicknessTexture.createView(),this.tmpThicknessTextureView=
this.tmpThicknessTexture.createView(),this.depthTestTextureView=this.depthTestTexture.createView(),this.recreatePipelines(
e,i),this.posVelBuffer&&this.updateBindGroups()}recreatePipelines(e,i){const r=this.device.createShaderModule({code:se}),
c={screenWidth:e,screenHeight:i},d=10,p=Math.PI/4,v=12*(2*this.radius)*.05*(i/2)/Math.tan(p/2),m={depth_threshold:this.radius*
d,max_filter_size:100,projected_particle_constant:v};this.depthFilterPipeline=this.device.createRenderPipeline({layout:"\
auto",vertex:{module:r,entryPoint:"vs",constants:c},fragment:{module:this.device.createShaderModule({code:ce}),entryPoint:"\
fs",targets:[{format:"r32float"}],constants:m},primitive:{topology:"triangle-list"}}),this.thicknessFilterPipeline=this.
device.createRenderPipeline({layout:"auto",vertex:{module:r,entryPoint:"vs",constants:c},fragment:{module:this.device.createShaderModule(
{code:fe}),entryPoint:"fs",targets:[{format:"r16float"}]},primitive:{topology:"triangle-list"}}),this.fluidPipeline=this.
device.createRenderPipeline({layout:"auto",vertex:{module:r,entryPoint:"vs",constants:c},fragment:{module:this.device.createShaderModule(
{code:pe}),entryPoint:"fs",targets:[{format:this.canvasFormat,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-s\
rc-alpha"},alpha:{srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"},depthStencil:{format:"depth2\
4plus",depthWriteEnabled:!0,depthCompare:"less"}})}updateBindGroup(e){this.posVelBuffer=e,this.updateBindGroups()}updateBindGroups(){
this.depthMapBindGroup=this.device.createBindGroup({layout:this.depthMapPipeline.getBindGroupLayout(0),entries:[{binding:0,
resource:{buffer:this.posVelBuffer}},{binding:1,resource:{buffer:this.renderUniformBuffer}}]}),this.thicknessMapBindGroup=
this.device.createBindGroup({layout:this.thicknessMapPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.
posVelBuffer}},{binding:1,resource:{buffer:this.renderUniformBuffer}}]}),this.depthFilterBindGroups=[this.device.createBindGroup(
{layout:this.depthFilterPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.depthMapTextureView},{binding:2,
resource:{buffer:this.filterXUniformBuffer}}]}),this.device.createBindGroup({layout:this.depthFilterPipeline.getBindGroupLayout(
0),entries:[{binding:1,resource:this.tmpDepthMapTextureView},{binding:2,resource:{buffer:this.filterYUniformBuffer}}]})],
this.thicknessFilterBindGroups=[this.device.createBindGroup({layout:this.thicknessFilterPipeline.getBindGroupLayout(0),entries:[
{binding:1,resource:this.thicknessTextureView},{binding:2,resource:{buffer:this.filterXUniformBuffer}}]}),this.device.createBindGroup(
{layout:this.thicknessFilterPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.tmpThicknessTextureView},{binding:2,
resource:{buffer:this.filterYUniformBuffer}}]})],this.materialMapBindGroup=this.device.createBindGroup({layout:this.materialMapPipeline.
getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.posVelBuffer}},{binding:1,resource:{buffer:this.renderUniformBuffer}}]}),
this.fluidBindGroup=this.device.createBindGroup({layout:this.fluidPipeline.getBindGroupLayout(0),entries:[{binding:1,resource:this.
depthMapTextureView},{binding:2,resource:{buffer:this.renderUniformBuffer}},{binding:3,resource:this.thicknessTextureView},
{binding:4,resource:this.materialTextureView}]})}updateUniforms(e,i){this.radius=i;const r=new Float32Array(272/4);r.set(
[1/this.width,1/this.height],0),r[2]=i*2,r.set(e.invProj,4),r.set(e.proj,20),r.set(e.view,36),r.set(e.invView,52),this.device.
queue.writeBuffer(this.renderUniformBuffer,0,r)}record(e,i){console.error("FluidRenderer.record expects CommandEncoder, \
not RenderPassEncoder")}render(e,i,r,c){if(!this.depthMapBindGroup)return;const d=e.beginRenderPass({colorAttachments:[{
view:this.depthMapTextureView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.
depthTestTextureView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});d.setPipeline(this.depthMapPipeline),
d.setBindGroup(0,this.depthMapBindGroup),d.draw(6,c),d.end();const p=e.beginRenderPass({colorAttachments:[{view:this.tmpDepthMapTextureView,
clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});p.setPipeline(this.depthFilterPipeline),p.setBindGroup(0,
this.depthFilterBindGroups[0]),p.draw(6),p.end();const x=e.beginRenderPass({colorAttachments:[{view:this.depthMapTextureView,
clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});x.setPipeline(this.depthFilterPipeline),x.setBindGroup(0,
this.depthFilterBindGroups[1]),x.draw(6),x.end();const y=e.beginRenderPass({colorAttachments:[{view:this.materialTextureView,
clearValue:{r:2,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.materialDepthTextureView,
depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});y.setPipeline(this.materialMapPipeline),y.setBindGroup(0,this.
materialMapBindGroup),y.draw(6,c),y.end();const v=e.beginRenderPass({colorAttachments:[{view:this.thicknessTextureView,clearValue:{
r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});v.setPipeline(this.thicknessMapPipeline),v.setBindGroup(0,this.thicknessMapBindGroup),
v.draw(6,c),v.end();const m=e.beginRenderPass({colorAttachments:[{view:this.tmpThicknessTextureView,clearValue:{r:0,g:0,
b:0,a:1},loadOp:"clear",storeOp:"store"}]});m.setPipeline(this.thicknessFilterPipeline),m.setBindGroup(0,this.thicknessFilterBindGroups[0]),
m.draw(6),m.end();const S=e.beginRenderPass({colorAttachments:[{view:this.thicknessTextureView,clearValue:{r:0,g:0,b:0,a:1},
loadOp:"clear",storeOp:"store"}]});S.setPipeline(this.thicknessFilterPipeline),S.setBindGroup(0,this.thicknessFilterBindGroups[1]),
S.draw(6),S.end();const C=e.beginRenderPass({colorAttachments:[{view:i,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{
view:r,depthLoadOp:"load",depthStoreOp:"store"}});C.setPipeline(this.fluidPipeline),C.setBindGroup(0,this.fluidBindGroup),
C.draw(6),C.end()}}const b=document.getElementById("canvas"),re=document.getElementById("toggleBtn"),X=document.getElementById(
"status"),De=document.getElementById("particleCount"),Ae=document.getElementById("fps"),ke=document.getElementById("mass"),
Ee=document.getElementById("momentum"),Le=document.getElementById("error");let _,q,ae,N,Z,G,V,Y,ne,B,U=!0,me=performance.
now(),ie=0,he=0,ve,H=0,K=!1,j=null,ge=!1,P,Ie,E=null,L=null,we=1,Pe=12;const k=[{key:"Hydrogen",id:0},{key:"Oxygen",id:1},
{key:"Sodium",id:2},{key:"Potassium",id:3},{key:"Magnesium",id:4},{key:"Aluminum",id:5},{key:"Silicon",id:6},{key:"Calci\
um",id:7},{key:"Titanium",id:8},{key:"Iron",id:9},{key:"Lead",id:10}],xe=[.8,.8,1,1.1,.95,1,.95,1.1,1,1,1],Ye=[2e-4,2e-4,
3e-4,3e-4,25e-5,2e-4,15e-5,25e-5,18e-5,17e-5,16e-5],je=[.05,.05,.08,.1,.07,.05,.05,.08,.06,.05,.05];function Xe(s,e){const r=new URLSearchParams(
window.location.search).get(s);if(r!==null){const c=parseFloat(r);return isNaN(c)?e:c}return e}const t={renderMode:"Flui\
d",particleCount:Xe("particles",2e4),gridSizeX:64,gridSizeY:64,gridSizeZ:64,spacing:1,jitter:.1,materialA:"Titanium",materialB:"\
Lead",temperature:300,dt:.1,gravity:-.3,ambientPressure:1,stiffness:50,restDensity:1,dynamicViscosity:.1,iterations:1,fixedPointScale:1e5,
visualRadius:.2,fluidRadius:1,interactionRadius:9,interactionX:32,interactionY:10,interactionZ:32,interactionActive:!1,heatSourceTemp:400};
re.addEventListener("click",()=>{U=!U,re.textContent=U?"Pause":"Resume",X.textContent=U?"running":"paused"});function Be(s){
console.error(s),Le.textContent=(s==null?void 0:s.stack)||String(s),X.textContent="error",U=!1,re.disabled=!0}function f(s,e){
return s!=null&&s.domElement&&(s.domElement.title=e),s}function ye(s,e,i){const r=Math.max(0,Math.min(s,xe.length-1)),c=xe[r],
d=Ye[r],p=je[r],x=e-300;let y=c*(1+d*x);const v=1/Math.max(.2,1+.1*(i-1));y*=v,y=Math.min(Math.max(y,.4),2.5);let m=p+Math.
abs(x)*1e-4+Math.max(0,i-1)*.02;return m=Math.min(Math.max(m,0),.6),{spacing:y,jitter:m}}function _e(){const s=we||Math.
min(2,window.devicePixelRatio||1),e=Math.max(1,Math.floor(b.clientWidth*s)),i=Math.max(1,Math.floor(b.clientHeight*s));b.
width=e,b.height=i,q.configure({device:_,format:ae,alphaMode:"opaque"}),N&&N.destroy(),N=_.createTexture({size:[e,i],format:"\
depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),Z=N.createView(),G&&G.resize(e,i),V&&V.resize(e,i)}class Ne{constructor(e){
this.device=e,this.canvasAspect=1;const{vertices:i,indices:r}=be(1,8,6);this.vertexBuffer=e.createBuffer({size:i.byteLength,
usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,i),this.indexBuffer=e.createBuffer(
{size:r.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,r),this.indexCount=
r.length,this.uniformBuffer=e.createBuffer({size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const d=e.createShaderModule(
{code:`
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
    `}),p=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,
visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout(
{bindGroupLayouts:[p]}),vertex:{module:d,entryPoint:"vs_main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,
format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{module:d,entryPoint:"fs_main",targets:[
{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"\
depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.bindGroup=null}resize(e,i){this.canvasAspect=e/i}updateBindGroup(e){
this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.
uniformBuffer}},{binding:1,resource:{buffer:e}}]})}updateUniforms(e,i){const r=new Float32Array(20);r.set(e,0),r[16]=i,this.
device.queue.writeBuffer(this.uniformBuffer,0,r)}record(e,i){this.bindGroup&&(e.setPipeline(this.pipeline),e.setBindGroup(
0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.
indexCount,i))}}class We{constructor(e){this.device=e;const{vertices:i,indices:r}=be(1,16,12);this.vertexBuffer=e.createBuffer(
{size:i.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,i),this.
indexBuffer=e.createBuffer({size:r.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.
indexBuffer,0,r),this.indexCount=r.length,this.uniformBuffer=e.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.
COPY_DST});const d=e.createShaderModule({code:`
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
        `});this.pipeline=e.createRenderPipeline({layout:"auto",vertex:{module:d,entryPoint:"vs",buffers:[{arrayStride:24,
attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{
module:d,entryPoint:"fs",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",
cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.bindGroup=e.createBindGroup(
{layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}update(e,i,r){const c=new Float32Array(
20);c.set(e,0),c.set(i,16),c[19]=r,this.device.queue.writeBuffer(this.uniformBuffer,0,c)}record(e){e.setPipeline(this.pipeline),
e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(
this.indexCount)}}async function w(){if(!K){K=!0,X.textContent="initializing...";try{const s=J({kind:"count",name:"mpm-p\
articles",baseCount:2e4,requestedCount:t.particleCount,minCount:100,maxCount:2e5,multiple:100,strideBytes:W||96,storageBufferBytesPerItem:W||
96,buffersCount:2,workgroupSize:64,dispatchDimensions:1},{capabilities:E||{},overrides:L}),e=J({kind:"grid3d",name:"mpm-\
grid",requestedDim:[t.gridSizeX,t.gridSizeY,t.gridSizeZ],minDim:[16,16,16],maxDim:[256,256,256],step:16,cellStrideBytes:32,
buffersCount:1,memoryFraction:.4,workgroupSize:64,dispatchDimensions:1},{capabilities:E||{},overrides:L}),i=s.count;t.particleCount=
i,t.gridSizeX=e.x,t.gridSizeY=e.y,t.gridSizeZ=e.z;const r={x:t.gridSizeX,y:t.gridSizeY,z:t.gridSizeZ},c=.005,d=Math.max(
1,Math.min(Pe,Math.ceil(t.dt/c))),p={stiffness:t.stiffness,restDensity:t.restDensity,dynamicViscosity:t.dynamicViscosity,
dt:c,fixedPointScale:t.fixedPointScale,tensileStrength:0,damageRate:0,ambientPressure:t.ambientPressure},x=_.createBuffer(
{size:i*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),y=_.createBuffer({size:32,usage:GPUBufferUsage.
UNIFORM|GPUBufferUsage.COPY_DST}),v=ze(_,{particleCount:i,gridSize:r,iterations:d,posVelBuffer:x,interactionBuffer:y,constants:p}),
m=Math.floor(i/2),S=i-m,C=k.find(I=>I.key===t.materialA)??k[0],R=k.find(I=>I.key===t.materialB)??k[1]??k[0],o=Math.ceil(
Math.cbrt(m)),l=Math.ceil(Math.cbrt(S)),g=ye(C.id,t.temperature,t.ambientPressure),h=ye(R.id,t.temperature,t.ambientPressure),
a=2,n=Math.max(o*g.spacing,l*h.spacing),u=Math.max(a,Math.min(r.y-a-n,r.y*.7)),O=[a,u,a],z=[Math.max(a,r.x-a-l*h.spacing),
u,Math.max(a,r.z-a-l*h.spacing)],T=new ArrayBuffer(i*W),M=oe({count:m,gridSize:r,start:O,spacing:g.spacing,jitter:g.jitter,
temperature:t.temperature,restDensity:t.restDensity,materialType:C.id,cubeSideCount:o}),D=oe({count:S,gridSize:r,start:z,
spacing:h.spacing,jitter:h.jitter,temperature:t.temperature,restDensity:t.restDensity,materialType:R.id,cubeSideCount:l});
new Uint8Array(T,0,M.byteLength).set(new Uint8Array(M)),new Uint8Array(T,M.byteLength,D.byteLength).set(new Uint8Array(D));
const Q=T;Ue(_,v.buffers.particleBuffer,Q),ne=v.domain,B=v.buffers,H=i,G&&G.updateBindGroup(x),V&&V.updateBindGroup(x),De.
textContent=i.toString(),X.textContent="running"}catch(s){console.warn("Init error:",s),Be(s)}finally{K=!1}}}async function qe(){
try{let y=function(){const o=t.gridSizeX/2,l=t.gridSizeY/2,g=t.gridSizeZ/2;r.setTarget([o,l,g]);const h=Math.max(t.gridSizeX,
t.gridSizeY,t.gridSizeZ);r.setRadius(h*1.8),t.interactionX=o,t.interactionY=l*.3,t.interactionZ=g,P.controllersRecursive().
forEach(a=>a.updateDisplay()),w()};L=Ce(),E=await Ge(),we=Me(E,null,L);const s=new URLSearchParams(window.location.search).
has("particles"),e=J({kind:"count",name:"mpm-initial-particles",baseCount:2e4,minCount:2e3,maxCount:1e5,multiple:1e3,strideBytes:W||
96,buffersCount:2,baseSubSteps:8,maxSubSteps:16},{capabilities:E,overrides:L}),i=J({kind:"grid3d",name:"mpm-initial-grid",
baseDim:[64,64,64],minDim:[32,32,32],maxDim:[128,128,128],step:16,cellStrideBytes:32,workgroupSize:64,dispatchDimensions:1},
{capabilities:E,overrides:L});s||(t.particleCount=e.count),t.gridSizeX=i.x,t.gridSizeY=i.y,t.gridSizeZ=i.z,t.interactionX=
Math.floor(t.gridSizeX/2),t.interactionZ=Math.floor(t.gridSizeZ/2),Pe=Math.max(4,e.recommendedSubSteps*2),_=await Ve(),q=
b.getContext("webgpu"),ae=navigator.gpu.getPreferredCanvasFormat(),G=new Ne(_),V=new Oe(_,ae),Y=new We(_),_e(),window.addEventListener(
"resize",_e);const r=new Re(b,{target:[32,32,32],radius:120});await w(),P=new window.lil.GUI({title:"MLS-MPM Controls"}),
(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<768)&&P.close(),
f(P.add(t,"renderMode",["Particles","Fluid"]).name("Render Mode"),"Choose between particle instancing or screen-space fl\
uid rendering");const d=P.addFolder("Visuals");f(d.add(t,"visualRadius",.05,1,.05).name("Particle Radius"),"Sphere radiu\
s for particle rendering (visual only)"),f(d.add(t,"fluidRadius",.05,3,.05).name("Fluid Radius"),"Splat radius for scree\
n-space fluid rendering");const p=P.addFolder("Simulation");f(p.add(t,"particleCount",100,1e5,1e3).name("Particle Count").
onFinishChange(w),"Total number of particles spawned (higher = heavier GPU load)");const x={};k.forEach(o=>{x[o.key]=o.key}),
f(p.add(t,"materialA",x).name("Element A").onChange(w),"Element for first spawn block (50% of particles)"),f(p.add(t,"ma\
terialB",x).name("Element B").onChange(w),"Element for second spawn block (50% of particles)"),p.add(t,"gridSizeX",16,256,
16).name("Box X").onFinishChange(y),p.add(t,"gridSizeY",16,256,16).name("Box Y").onFinishChange(y),p.add(t,"gridSizeZ",16,
256,16).name("Box Z").onFinishChange(y),f(p.add(t,"spacing",.1,2.5,.05).name("Spacing").onFinishChange(w),"Initial parti\
cle pitch (grid units); smaller = denser packing"),f(p.add(t,"jitter",0,1,.05).name("Jitter").onFinishChange(w),"Random \
perturbation of initial positions to break symmetry"),Ie=f(p.add(t,"temperature",0,5e3,1).name("Temperature (K)").onFinishChange(
w),"Initial particle temperature for the selected material");const v=P.addFolder("Physics Constants");f(v.add(t,"dt",.001,
.2,.001).name("Time Step (dt)").onChange(()=>w()),"Simulation timestep (seconds) per sub-step; smaller = more stable"),f(
v.add(t,"gravity",-20,20,.1).name("Gravity (Y)"),"Gravity acceleration along Y (negative = downward)"),f(v.add(t,"ambien\
tPressure",0,5,.05).name("Ambient Pressure"),"Ambient pressure baseline applied to fluids/gases (dimensionless)"),f(v.add(
t,"stiffness",.1,100,.1).name("Stiffness").onFinishChange(w),"Fluid bulk modulus for Tait EOS (affects compressibility)"),
f(v.add(t,"restDensity",.1,10,.1).onFinishChange(w),"Target rest density for mass/volume and pressure calculations"),f(v.
add(t,"dynamicViscosity",0,5,.01).onFinishChange(w),"Viscosity term applied to fluids (damps shear/velocity gradients)");
const m=P.addFolder("Interaction Sphere");f(m.add(t,"interactionActive").name("Active"),"Enable or disable the interacti\
on sphere"),f(m.add(t,"interactionRadius",.1,20).name("Radius"),"Sphere radius for collision/thermal interaction"),f(m.add(
t,"interactionX",0,100).name("X"),"Sphere center X (grid units)"),f(m.add(t,"interactionY",0,100).name("Y"),"Sphere cent\
er Y (grid units)"),f(m.add(t,"interactionZ",0,100).name("Z"),"Sphere center Z (grid units)"),f(m.add(t,"heatSourceTemp",
0,1e4,1).name("Heat Source (K)"),"Temperature of the heat/cool sphere (0 disables thermal effect)"),f(P.add({reset:w},"r\
eset").name("Reset Simulation"),"Rebuild buffers and restart the current scene"),f(P.add({calibrate:()=>j=null},"calibra\
te").name("Calibrate Sensors"),"Reset device-orientation baseline for gravity control"),X.textContent="running";let S=!1,
C=0;b.addEventListener("pointerdown",o=>{o.button===1&&t.interactionActive&&(S=!0,C=t.interactionY,o.preventDefault(),o.
stopImmediatePropagation())}),window.addEventListener("pointerup",()=>S=!1),b.addEventListener("wheel",o=>{if(o.ctrlKey&&
t.interactionActive){o.preventDefault();const l=o.deltaY>0?-1:1;t.interactionY=Math.max(0,Math.min(t.gridSizeY,t.interactionY+
l)),P.controllersRecursive().forEach(g=>g.updateDisplay())}},{passive:!1}),window.addEventListener("deviceorientation",o=>{
if(!B||!B.simUniformBuffer||o.beta===null||o.gamma===null)return;j||(j={beta:o.beta,gamma:o.gamma}),ge=!0;const l=.3,g=(o.
beta-j.beta)*(Math.PI/180),h=(o.gamma-j.gamma)*(Math.PI/180);let a=Math.sin(h)*l,n=Math.sin(g)*l,u=-Math.sqrt(Math.max(0,
l*l-a*a-n*n));const O=new Float32Array(4);O.set([a,u,n],0),O[3]=t.ambientPressure,_.queue.writeBuffer(B.simUniformBuffer,
0,O)},!0),b.addEventListener("pointermove",o=>{if(S&&t.interactionActive){const l=b.getBoundingClientRect(),g=(o.clientX-
l.left)/l.width*2-1,h=-(o.clientY-l.top)/l.height*2+1,a=r.getMatrices(l.width/l.height),n=a.invView,u=a.invProj,O=[g,h,.5,
1];let z=u[0]*g+u[4]*h+u[8]*.5+u[12],T=u[1]*g+u[5]*h+u[9]*.5+u[13],M=u[2]*g+u[6]*h+u[10]*.5+u[14],D=u[3]*g+u[7]*h+u[11]*
.5+u[15];z/=D,T/=D,M/=D;let Q=n[0]*z+n[4]*T+n[8]*M,I=n[1]*z+n[5]*T+n[9]*M,Se=n[2]*z+n[6]*T+n[10]*M;const A=a.eye,Ze=[Q,I,
Se],$=[n[0]*z+n[4]*T+n[8]*M+n[12],n[1]*z+n[5]*T+n[9]*M+n[13],n[2]*z+n[6]*T+n[10]*M+n[14]],F=[$[0]-A[0],$[1]-A[1],$[2]-A[2]],
ee=Math.hypot(F[0],F[1],F[2]);if(F[0]/=ee,F[1]/=ee,F[2]/=ee,Math.abs(F[1])>.001){const te=(C-A[1])/F[1];te>0&&(t.interactionX=
A[0]+te*F[0],t.interactionZ=A[2]+te*F[2],P.controllers.forEach(Te=>Te.updateDisplay()))}}});async function R(o){const l=(o-
me)/1e3;me=o;const g=.9;if(l>0){const a=1/l;ie=ie*g+a*(1-g),Ae.textContent=ie.toFixed(1)}if(K){ve=requestAnimationFrame(
R);return}if(B&&B.simUniformBuffer&&!ge){const a=new Float32Array(4);a[0]=0,a[1]=t.gravity,a[2]=0,a[3]=t.ambientPressure,
_.queue.writeBuffer(B.simUniformBuffer,0,a)}if(B&&B.interactionBuffer){const a=new Float32Array(8);t.interactionActive?(a[0]=
t.interactionX,a[1]=t.interactionY,a[2]=t.interactionZ,a[3]=t.interactionRadius,a[4]=0,a[5]=0,a[6]=0,a[7]=t.heatSourceTemp):
a[3]=-1,_.queue.writeBuffer(B.interactionBuffer,0,a)}const h=_.createCommandEncoder({label:"mpm-visual-frame"});if(U&&ne&&
ne.step(h,t.dt),t.renderMode==="Fluid"){const a=r.getMatrices(b.width/b.height);V.updateUniforms(a,t.fluidRadius);const n=q.
getCurrentTexture().createView(),u=h.beginRenderPass({colorAttachments:[{view:n,clearValue:{r:.05,g:.08,b:.14,a:1},loadOp:"\
clear",storeOp:"store"}],depthStencilAttachment:{view:Z,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});t.
interactionActive&&(Y.update(a.viewProj,[t.interactionX,t.interactionY,t.interactionZ],t.interactionRadius),Y.record(u)),
u.end(),V.render(h,n,Z,H)}else{const a=r.getViewProj(b.width/b.height);G.updateUniforms(a,t.visualRadius);const n=q.getCurrentTexture().
createView(),u=h.beginRenderPass({colorAttachments:[{view:n,loadOp:"clear",storeOp:"store",clearValue:{r:.05,g:.08,b:.14,
a:1}}],depthStencilAttachment:{view:Z,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});t.interactionActive&&
(Y.update(a,[t.interactionX,t.interactionY,t.interactionZ],t.interactionRadius),Y.record(u)),G.record(u,H),u.end()}_.queue.
submit([h.finish()]),o-he>500&&U&&B&&(he=o,Fe(_,B.particleBuffer,H).then(({mass:a,momentum:n})=>{ke.textContent=a.toFixed(
3),Ee.textContent=n.map(u=>u.toFixed(3)).join(", ")}).catch(a=>console.warn(a))),ve=requestAnimationFrame(R)}requestAnimationFrame(
R)}catch(s){Be(s)}}qe();
