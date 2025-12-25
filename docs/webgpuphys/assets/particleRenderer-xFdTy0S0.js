import{b as u}from"./orbitControls-7kOmSw7O.js";class s{constructor(e){this.device=e;const{vertices:r,indices:t}=u(1,8,6);this.vertexBuffer=e.createBuffer({size:r.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,r),this.indexBuffer=e.createBuffer({size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,t),this.indexCount=t.length,this.uniformBuffer=e.createBuffer({size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const i=e.createShaderModule({code:`
      struct Uniforms {
        viewProj: mat4x4<f32>,
        radius: f32,
        pad0: vec3<f32>,
      };
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      @group(0) @binding(1) var<storage, read> positions: array<vec4<f32>>;

      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) normal: vec3<f32>,
        @location(1) @interpolate(flat) bodyId: u32,
      };

      @vertex
      fn vs_main(
        @location(0) localPos: vec3<f32>,
        @location(1) normal: vec3<f32>,
        @builtin(instance_index) instanceId: u32
      ) -> VertexOutput {
        let p = positions[instanceId];
        let worldPos = p.xyz + localPos * uniforms.radius;
        var out: VertexOutput;
        out.position = uniforms.viewProj * vec4(worldPos, 1.0);
        out.normal = normal;
        out.bodyId = u32(p.w);
        return out;
      }

      fn hsvToRgb(h: f32, s: f32, v: f32) -> vec3<f32> {
        let c = v * s;
        let x = c * (1.0 - abs(fract(h * 6.0) * 2.0 - 1.0));
        let m = v - c;
        var rgb: vec3<f32>;
        let hi = u32(h * 6.0) % 6u;
        if (hi == 0u) { rgb = vec3(c, x, 0.0); }
        else if (hi == 1u) { rgb = vec3(x, c, 0.0); }
        else if (hi == 2u) { rgb = vec3(0.0, c, x); }
        else if (hi == 3u) { rgb = vec3(0.0, x, c); }
        else if (hi == 4u) { rgb = vec3(x, 0.0, c); }
        else { rgb = vec3(c, 0.0, x); }
        return rgb + vec3(m);
      }

      @fragment
      fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
        let lightDir = vec3(0.0, 1.0, 0.0); // Straight down
        let ambient = 0.3;
        let diffuse = max(dot(in.normal, lightDir), 0.0);
        let hue = f32(in.bodyId % 16u) / 16.0;
        let color = hsvToRgb(hue, 0.6, 0.95);
        let lighting = ambient + diffuse * 1.0;
        return vec4(color * lighting, 1.0);
      }
    `}),o=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[o]}),vertex:{module:i,entryPoint:"vs_main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{module:i,entryPoint:"fs_main",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.bindGroup=null}updateBindGroup(e){this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:e}}]})}updateViewProj(e,r){const t=new Float32Array(20);t.set(e,0),t[16]=r,this.device.queue.writeBuffer(this.uniformBuffer,0,t)}record(e,r){this.bindGroup&&(e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.indexCount,r))}}export{s as P};
